import type { ReactNode } from "react";
import { EXERCISE_MINUTES, FOCUS_RING, MODE_STYLES, modeOf } from "./catalog";
import type { ExerciseId, NeverDumbCopy } from "./copy/types";
import { NdIcon } from "./NdIcon";

interface ExerciseFrameProps {
  id: ExerciseId;
  copy: NeverDumbCopy;
  onBack: () => void;
  children: ReactNode;
}

export function ExerciseFrame({ id, copy, onBack, children }: ExerciseFrameProps) {
  const mode = modeOf(id);
  const style = MODE_STYLES[mode];
  const exercise = copy.exercises[id];

  return (
    <div className="mx-auto max-w-3xl py-6 sm:py-10">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className={`inline-flex items-center gap-2 rounded-full px-3 py-2 -ml-3 text-sm text-muted hover:text-foreground focus-visible:ring-foreground/40 ${FOCUS_RING}`}
        >
          <NdIcon name="back" size={16} />
          {copy.shared.back}
        </button>
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${style.border} ${style.soft} ${style.text}`}>
          <NdIcon name={mode} size={14} />
          {copy.categories[mode].title}
          <span className="opacity-60">· {EXERCISE_MINUTES[id]} {copy.shared.minuteShort}</span>
        </span>
      </div>

      <div className="mt-8 flex items-start gap-4">
        <div className={`hidden sm:flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${style.soft} ${style.text}`}>
          <NdIcon name={id} size={26} />
        </div>
        <div className="min-w-0">
          <h2 id="neverdumb-exercise-title" className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
            {exercise.title}
          </h2>
          <p className="mt-2 max-w-2xl text-base leading-relaxed text-muted">{exercise.instruction}</p>
        </div>
      </div>

      <div className="mt-8">{children}</div>
    </div>
  );
}
