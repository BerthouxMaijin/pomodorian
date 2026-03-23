import Anthropic from "@anthropic-ai/sdk";
import { buildAIPlannerPrompt } from "@/lib/ai-prompt";

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour

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

    return Response.json(parsed);
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
