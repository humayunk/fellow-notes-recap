import type { Topic } from "../types";
import { cn, fmtTime } from "../util";
import { TimestampChip } from "./TimestampChip";
import { Chevron } from "./icons";

interface Props {
  topics: Topic[];
  open: Record<string, boolean>;
  onToggle: (id: string) => void;
  onExpandAll: () => void;
  allOpen: boolean;
  activeTSec: number | null;
  onPlay: (sec: number) => void;
  onHover: (sec: number | null) => void;
}

export function Topics({ topics, open, onToggle, onExpandAll, allOpen, activeTSec, onPlay, onHover }: Props) {
  return (
    <section aria-label="Topics">
      <div className="section-label">
        Topics <span className="count tnum">{topics.length}</span>
        <div style={{ flex: 1 }} />
        <button className="mini-btn" onClick={onExpandAll}>{allOpen ? "Collapse all" : "Expand all"}</button>
      </div>

      <div className="card" style={{ padding: "4px 20px" }}>
        {topics.map((t) => {
          const isOpen = !!open[t.id];
          return (
            <div key={t.id} id={`topic-${t.id}`} className={cn("topic", isOpen && "open")}>
              <button
                className="topic-head"
                aria-expanded={isOpen}
                data-tsec={t.tStartSec}
                onClick={() => onToggle(t.id)}
                onMouseEnter={() => onHover(t.tStartSec)}
                onMouseLeave={() => onHover(null)}
              >
                <span className="topic-chev" aria-hidden="true"><Chevron /></span>
                <span className="topic-title">{t.title}</span>
                <span className="topic-range tnum">{fmtTime(t.tStartSec)}–{fmtTime(t.tEndSec)}</span>
              </button>
              <div className="topic-body">
                <div className="topic-body-inner">
                  <ul className="topic-bullets">
                    {t.bullets.map((b) => (
                      <li key={b.id} data-tsec={b.tSec} className={cn(activeTSec === b.tSec && "active")}>
                        <span className="dot" aria-hidden="true">•</span>
                        <span className="bl-text">
                          {b.text}
                          <TimestampChip tSec={b.tSec} playing={activeTSec === b.tSec} onPlay={onPlay} onHover={onHover} />
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
