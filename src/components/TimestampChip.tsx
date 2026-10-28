import { fmtTime, cn } from "../util";
import { Play } from "./icons";

interface Props {
  tSec: number;
  playing?: boolean;
  onPlay: (tSec: number) => void;
  onHover?: (tSec: number | null) => void;
  className?: string;
}

// A real, keyboard-reachable button. Hover fills it left-to-right (CSS) and
// lights the matching ribbon segment via onHover.
export function TimestampChip({ tSec, playing, onPlay, onHover, className }: Props) {
  return (
    <button
      type="button"
      className={cn("chip tnum", playing && "playing", className)}
      onClick={(e) => {
        e.stopPropagation();
        onPlay(tSec);
      }}
      onMouseEnter={() => onHover?.(tSec)}
      onMouseLeave={() => onHover?.(null)}
      onFocus={() => onHover?.(tSec)}
      onBlur={() => onHover?.(null)}
      aria-label={`Play from ${fmtTime(tSec)}`}
    >
      <span className="fill" aria-hidden="true" />
      <span className="tri" aria-hidden="true"><Play size={8} /></span>
      {fmtTime(tSec)}
    </button>
  );
}
