import type { ExerciseProps } from "./catalog";
import type { ExerciseId, ResetExercise as ResetId } from "./copy/types";
import { DebriefExercise } from "./exercises/DebriefExercise";
import { SpotFlawExercise } from "./exercises/SpotFlawExercise";
import { CompressExercise } from "./exercises/CompressExercise";
import { EstimateExercise } from "./exercises/EstimateExercise";
import { HumanCaptchaExercise } from "./exercises/HumanCaptchaExercise";
import { RoomRaidExercise } from "./exercises/RoomRaidExercise";
import { BodyDebuggerExercise } from "./exercises/BodyDebuggerExercise";
import { DuckBossExercise } from "./exercises/DuckBossExercise";
import { ResetExercise } from "./exercises/ResetExercise";

interface ExerciseViewProps extends ExerciseProps {
  id: ExerciseId;
  recentTasks: string[];
  onAddTask: (title: string) => void;
  onPauseAmbients: () => void;
  onResumeAmbients: () => void;
}

export function ExerciseView({ id, recentTasks, onAddTask, onPauseAmbients, onResumeAmbients, ...props }: ExerciseViewProps) {
  switch (id) {
    case "debrief":
      return <DebriefExercise {...props} recentTasks={recentTasks} onAddTask={onAddTask} />;
    case "spotFlaw":
      return <SpotFlawExercise {...props} />;
    case "compress":
      return <CompressExercise {...props} />;
    case "estimate":
      return <EstimateExercise {...props} />;
    case "humanCaptcha":
      return <HumanCaptchaExercise {...props} />;
    case "roomRaid":
      return <RoomRaidExercise {...props} />;
    case "bodyDebugger":
      return <BodyDebuggerExercise {...props} />;
    case "duckBoss":
      return <DuckBossExercise {...props} />;
    default:
      return (
        <ResetExercise
          {...props}
          id={id as ResetId}
          onPauseAmbients={onPauseAmbients}
          onResumeAmbients={onResumeAmbients}
        />
      );
  }
}
