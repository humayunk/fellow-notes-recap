import type { SummarySentence } from "../types";
import { cn, fmtTime } from "../util";
import { TimestampChip } from "./TimestampChip";

interface Props {
  sentences: SummarySentence[];
  activeTSec: number | null;
  onPlay: (sec: number) => void;
  onHover: (sec: number | null) => void;
  onCopy: () => void;
}

// A readable lead paragraph. Each sentence is itself a play button (keyboard
// reachable); hovering reveals its time and lights the ribbon segment. The
// sentence that playback is currently inside gets the accent wash.
export function Summary({ sentences, activeTSec, onPlay, onHover, onCopy }: Props) {
  return (
    <section className="card summary" aria-label="Summary">
      <div className="card-head">
        <h2>Summary</h2>
        <div className="spacer" />
        <TimestampChip tSec={sentences[0].tSec} onPlay={onPlay} onHover={onHover} />
        <button className="mini-btn" onClick={onCopy} aria-label="Copy summary">Copy</button>
      </div>
      <p>
        {sentences.map((s) => (
          <button
            key={s.id}
            type="button"
            data-tsec={s.tSec}
            className={cn("sent", activeTSec === s.tSec && "active")}
            style={{ display: "inline", border: 0, background: "transparent", padding: 0, textAlign: "left", font: "inherit", color: "inherit" }}
            onClick={() => onPlay(s.tSec)}
            onMouseEnter={() => onHover(s.tSec)}
            onMouseLeave={() => onHover(null)}
            onFocus={() => onHover(s.tSec)}
            onBlur={() => onHover(null)}
            title={`Play from ${fmtTime(s.tSec)}`}
          >
            {s.text}{" "}
          </button>
        ))}
      </p>
    </section>
  );
}
