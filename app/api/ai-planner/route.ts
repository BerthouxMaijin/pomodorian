import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { buildAIPlannerPrompt } from "@/lib/ai-prompt";
import type { AIPlannerResponse } from "@/lib/types";

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour

const rawTaskSchema = z.object({
  title: z.string().catch(""),
  estimatedPomodoros: z.coerce.number().catch(1),
  rationale: z.string().catch(""),
});

const rawPlanSchema = z.object({
  sessionGoal: z.string().catch(""),
  totalEstimatedPomodoros: z.coerce.number().catch(0),
  tasks: z
    .array(rawTaskSchema.catch({ title: "", estimatedPomodoros: 1, rationale: "" }))
    .catch([]),
  tips: z.string().catch(""),
});

function clampPomodoros(n: number): number {
  return Math.min(8, Math.max(1, Math.round(Number.isFinite(n) ? n : 1)));
}

function normalizePlan(
  raw: z.infer<typeof rawPlanSchema>,
  goal: string
): AIPlannerResponse | null {
  const tasks = raw.tasks
    .map((t) => ({
      title: t.title.trim().slice(0, 200),
      estimatedPomodoros: clampPomodoros(t.estimatedPomodoros),
      rationale: t.rationale.trim().slice(0, 300),
    }))
    .filter((t) => t.title.length > 0)
    .slice(0, 10);

  if (tasks.length === 0) return null;

  return {
    sessionGoal: (raw.sessionGoal.trim() || goal).slice(0, 300),
    totalEstimatedPomodoros: tasks.reduce((s, t) => s + t.estimatedPomodoros, 0),
    tasks,
    tips: raw.tips.trim().slice(0, 500),
  };
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT) {
    return false;
  }

  entry.count++;
  return true;
}

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";

    if (!checkRateLimit(ip)) {
      return Response.json(
        { error: "Rate limit exceeded. Try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { goal, pomodoroDuration = 25, availableMinutes, language = "en" } = body;

    if (!goal || typeof goal !== "string" || goal.length > 2000) {
      return Response.json(
        { error: "Invalid goal. Must be a string under 2000 characters." },
        { status: 400 }
      );
    }

    const anthropic = new Anthropic();

    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: buildAIPlannerPrompt(goal, availableMinutes, pomodoroDuration, language),
        },
      ],
    });

    const textContent = message.content.find((c) => c.type === "text");
    if (!textContent || textContent.type !== "text") {
      return Response.json(
        { error: "No response from AI" },
        { status: 500 }
      );
    }

    // Strip markdown code fences if present
    let jsonText = textContent.text.trim();
    if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }
    const parsed = JSON.parse(jsonText);
    const validated = rawPlanSchema.safeParse(parsed);
    if (!validated.success) {
      return Response.json(
        { error: "AI returned an unexpected format" },
        { status: 502 }
      );
    }
    const plan = normalizePlan(validated.data, goal);
    if (!plan) {
      return Response.json(
        { error: "AI returned no usable tasks" },
        { status: 502 }
      );
    }

    return Response.json(plan);
  } catch (err) {
    console.error("AI Planner error:", err);
    return Response.json(
      {
        error:
          err instanceof SyntaxError
            ? "Failed to parse AI response"
            : "AI planning failed. Please try again.",
      },
      { status: 500 }
    );
  }
}
