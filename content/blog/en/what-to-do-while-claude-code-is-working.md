---
title: "What to Do While Claude Code Is Working: A Workflow"
description: "Reddit's most honest answers, what attention research says about the agent wait, and a Claude Code workflow that protects your focus between prompts."
date: "2026-08-10"
updated: "2026-08-10"
readTime: "10 min"
author: "Jean-Baptiste Berthoux"
keywords:
  - claude code workflow
  - what to do while claude code is working
  - ai agent waiting time
  - context switching developers
status: draft
sources:
  - "https://ics.uci.edu/~gmark/chi08-mark.pdf"
  - "https://www.sciencedirect.com/science/article/abs/pii/S0749597809000399"
  - "https://www.reddit.com/r/ClaudeCode/comments/1rferq7/what_do_you_do_when_claude_code_is_working/"
  - "https://www.reddit.com/r/ClaudeCode/comments/1qx9vdo/what_do_you_do_while_claude_code_is_working/"
  - "https://xkcd.com/303/"
---

The short answer: stay inside the task. The best uses of the minutes while Claude Code works are reviewing what the agent just produced, reading its reasoning, and writing the next prompt. The worst use, according to both the developers who have tried it and four decades of attention research, is jumping to a different project "just for a minute."

That answer deserves unpacking, because the wait itself is new. Agentic coding tools now run autonomously for anywhere from thirty seconds to a couple of hours, and a whole generation of developers is rediscovering a problem their predecessors thought had died with slow compilers. In 2026, "what do you do while Claude Code is working?" has become one of the most recurring questions on the coding subreddits, and Google Trends shows searches for the phrase going from zero to a vertical spike in under a year. I build [Pomodorian](https://pomodorian.app), a focus timer, so I have an obvious interest in this question; I'll flag where the product enters the picture, and everything before that stands on its own.

**In this article:**

- [The new compiling break](#the-new-compiling-break)
- [What developers actually do: field notes from Reddit](#what-developers-actually-do-field-notes-from-reddit)
- [Why "just work on something else" backfires](#why-just-work-on-something-else-backfires)
- [A workflow for the agent wait](#a-workflow-for-the-agent-wait)
- [Where a timer fits](#where-a-timer-fits)

## The new compiling break

Every developer knows [xkcd #303](https://xkcd.com/303/): two programmers sword-fighting on office chairs because "compiling!" was the one legitimate excuse to stop working. The agent wait is the same dead time with three differences that make it harder, not easier, to handle.

First, frequency. A slow build interrupted you a few times a day; an agentic session can hand you a wait every few minutes, each time it finishes a step or asks for an approval. Second, unpredictability: a run can end in forty seconds or forty minutes, and you rarely know which in advance. Third, and most important, you are not actually free. The agent may need an approval, may drift off spec, or may finish and sit idle, burning your momentum. One thread on r/ClaudeAI in February 2026 named this precisely: the "can't leave, can't focus" paradox.

That combination, frequent, unpredictable, semi-attended gaps, is a genuinely new shape of working time. Treating it as free time wastes it; treating it as work time burns you out. It needs its own workflow.

## What developers actually do: field notes from Reddit

The question keeps being asked because nobody is satisfied with their own answer. Across the recurring threads on [r/ClaudeCode](https://www.reddit.com/r/ClaudeCode/comments/1rferq7/what_do_you_do_when_claude_code_is_working/) (the February 2026 edition drew over a hundred upvotes), the answers fall into three camps.

**The honest camp.** Coffee, email, and, as u/Formal_Bat_3109 put it, "most importantly, go to Reddit." One user answers simply "Pushups." Another runs Football Manager on the second monitor. u/dbbk's contribution: "Stare into middle distance." u/Luke_thePuke reports that his wife noticed the idle minutes and started assigning chores. The thread's original poster admits Reddit is already his default and that he needs something better.

**The systematic camp.** These answers converge with striking consistency:

- **Review the output.** u/Sponge8389 spends the wait reviewing generated code or writing the prompt for the next session.
- **Read the agent's reasoning.** u/DifferenceTimely8292 calls the reasoning log fantastic reading and a lesson in problem decomposition, and others agree it's the most underrated use of the gap.
- **Run parallel sessions on the same project.** u/taldbek keeps multiple editor workspaces open: while one agent works, he feeds the next. The author of [the January thread](https://www.reddit.com/r/ClaudeCode/comments/1qx9vdo/what_do_you_do_while_claude_code_is_working/) runs 2-3 sessions on the same repo and explicitly warns against a different repo: he tried filling waits with tasks from other projects and concluded it was a mistake that ruined his flow and drained his energy.
- **Plan in batches.** u/catalan-93 groups his todo list by theme so related tasks run together, which he says makes the switching less painful.
- **Get notified instead of babysitting.** Some pipe Claude Code updates through text-to-speech or Telegram so they can step away without anxiety.

**The builder camp.** My favorite: u/hotcoolhot built a small hardware session monitor (a microcontroller with a round display) that he carries to the kitchen so he can watch his agent's status while making a snack. It's an extreme answer, but it's also the whole problem in one image: the agent wait creates a need to *see the state of your time* at a glance.

<!-- TODO: capture/illustration - the three camps as a simple diagram, or a screenshot of the Reddit thread question -->

## Why "just work on something else" backfires

The most tempting answer, filling agent waits with a second project, is the one the experienced users warn against. The research explains why they're right.

In a series of experiments published in 2009, Sophie Leroy, then at the University of Minnesota, showed that when people switch tasks while the first task is unfinished, part of their attention stays attached to it. She named the effect [attention residue](https://www.sciencedirect.com/science/article/abs/pii/S0749597809000399): performance on the second task drops, and the stronger the residue, the worse the result. An agent run is the textbook trigger, because your first task is by definition unfinished while Claude works, and you anticipate being pulled back at an unpredictable moment.

Field research points the same way. Observing office workers minute by minute, [Gloria Mark and colleagues at UC Irvine found](https://ics.uci.edu/~gmark/chi08-mark.pdf) that interrupted work carries a real cost: after a significant interruption, people took on average around 23 minutes to return to the original task, typically detouring through two other tasks on the way, and compensated by working faster at the price of more stress and frustration. Her more recent data adds that the average time spent on one screen before switching has collapsed to under a minute. An agent that interrupts you every few minutes, if you let each interruption launch a detour, turns your day into exactly the fragmented pattern her lab measured.

The Reddit consensus and the literature agree on the mechanism: the problem with the agent wait is not idleness, it's the switch. Which means the goal of a workflow is not to fill the gap, it's to keep your working memory loaded on one project while the agent does its part.

## A workflow for the agent wait

Here is the protocol that falls out of the testimonials and the research. The core rule: size the wait, and match your response to it.

1. **Under about 2 minutes: don't move.** Stay on the session. Watch the diff scroll, skim the reasoning. Switching anywhere, even to a browser tab, buys you nothing and costs you residue.
2. **2 to 10 minutes: stay in the project, change altitude.** This is the golden slot for same-context work: review the last output properly, tighten the spec, write the next prompt, update your task list, check the tests. Same project, different altitude. This is also where a second session on the *same repo* fits if you run parallel agents, as the experienced users do; shared context keeps the reviews cheap.
3. **Over 10 minutes, or an autonomous run: take a real break, and protect it.** Set a notification (a sound, a TTS hook, a Telegram bridge) so the agent can reach you, then leave the screen. Movement beats scrolling: the "pushups" answer is better cognitive science than it looks, and the honest camp's Reddit default is how a break stops being one. If you work alongside teammates, do what one commenter's office does and sync your agent runs so the waits line up; it's [body doubling](/blog/body-doubling) applied to agentic coding.
4. **Batch the approvals.** If your session mostly needs quick confirmations, don't hover. Let them accumulate for a few minutes and clear them in one pass, the same batching logic that [timeboxing](/blog/stop-procrastinating-timeboxing) applies to shallow work.
5. **Close the loop before you open another.** When a run ends, review and commit (or reject) before launching the next prompt. An open loop is precisely what generates attention residue; closing it is what makes the next wait cheap.

Two anti-patterns to name explicitly, because they're the two defaults: **the second project** (maximum residue, the one move the experienced users regret) and **the infinite scroll** (a "break" that leaves you more depleted than the work). If you take one thing from the research: your enemy is not the wait, it's the unmanaged switch.

## Where a timer fits

This is where I should be transparent: Pomodorian is my product, and the reason this topic caught my attention is that the agent wait is structurally a timer problem. The wait is invisible, unpredictable, and fragmenting; a visible clock is the cheapest tool we have for making time concrete, which is the same reason a developer built himself a physical session monitor.

In practice, the combination that works is running your agent sessions *inside* [Pomodoro intervals](/blog/pomodoro-2-automated-workflows) rather than around them. A 25-minute interval comfortably holds a cycle of prompt, wait, review, next prompt on one project; the interval's single-task rule is exactly the "same project, different altitude" rule above, enforced by a countdown you can see. When the alarm rings, you take the break you were promising yourself anyway, away from the screen, while the agent keeps working. Any timer does this; [Pomodorian](https://pomodorian.app) adds an AI planner that breaks your goal into pomodoro-sized tasks, which maps neatly onto feeding a queue of well-scoped prompts to an agent. Free, in the browser, no account.

The deeper point stands whatever tool you use: agentic coding does not remove the need for [deep work](/blog/deep-work-programmers-framework), it concentrates it. The agent writes more of the code; your leverage moves to specification, review, and judgment, all activities that reward an unfragmented mind. The developers who handle the wait well are not the ones who found the best distraction. They're the ones who stopped treating it as a distraction slot at all.

## Frequently Asked Questions

### What should I do while Claude Code is running?

Match the action to the length of the wait. Under two minutes: stay on the session and read the output. Two to ten minutes: review, refine your spec, or write the next prompt for the same project. Longer autonomous runs: set up a completion notification and take a genuine screen-free break.

### Should I work on another project while the agent runs?

The experienced consensus and the research both say no. Task-switching with an unfinished task in flight creates attention residue, measured as lower performance on the second task and a costly re-entry into the first. If you want parallelism, run a second agent session on the same repository instead; the shared context keeps switching cheap.

### Is it fine to browse Reddit or social media during agent waits?

It's the most common answer and the least satisfying one, by the account of the people who give it. Short feeds-based breaks tend to extend past the agent's completion and to leave attention more fragmented. A physical micro-break (moving, stretching, making coffee) restores more and overruns less.

### How do I know when Claude Code needs me without watching it?

Use notifications rather than supervision: terminal bells or hooks, text-to-speech updates, or a Telegram/Slack bridge that pings you on completion or approval requests. Community projects and Claude Code's own hooks support all three patterns.

### Does the Pomodoro Technique work with AI coding agents?

They fit together well. An agent cycle (prompt, wait, review, next prompt) sits naturally inside a 25-minute focus interval on a single project, and the timer's visible countdown counters the shapeless, fragmenting nature of agent waits. The break then happens away from the screen while the agent keeps running.

## Key Takeaways

- The agent wait is the new compiling break, but more frequent, less predictable, and only semi-free; it needs a deliberate workflow, not a default distraction.
- Real-world answers from the Claude Code community converge: review output, read the reasoning, prep the next prompt, parallel sessions on the same repo, notifications instead of babysitting.
- The one move to avoid is switching to a different project: attention residue (Leroy, 2009) and interruption research (Mark, UC Irvine) both show the switch, not the idle time, is what destroys focus.
- Size the wait: under 2 minutes, stay put; 2-10 minutes, same project at a different altitude; longer, a protected screen-free break with a notification set.
- A visible timer turns the shapeless wait into structured time; running agent cycles inside Pomodoro intervals is a natural fit.
