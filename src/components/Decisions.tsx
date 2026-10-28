import { useState } from "react";
import type { Decision, Attendee, TranscriptCue } from "../types";
import { cn } from "../util";
import { TimestampChip } from "./TimestampChip";
import { Gavel, Chevron } from "./icons";
import { ContextDisclosure } from "./ContextDisclosure";

interface Props {
  decisions: Decision[];
  attendees: Attendee[];
  transcript: TranscriptCue[];
  activeTSec: number | null;
  onPlay: (sec: number) => void;
  onHover: (sec: number | null) => void;
}

export function Decisions({ decisions, attendees, transcript, activeTSec, onPlay, onHover }: Props) {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const nameOf = (id: string) => attendees.find((a) => a.id === id)?.name ?? "Someone";

  return (
    <section className="card" aria-label="Decisions">
      <div className="card-head">
        <h2>Decisions</h2>
        <span className="section-label" style={{ margin: 0 }}>
          <span className="count tnum">{decisions.length}</span>
        </span>
      </div>
      <div className="rows">
        {decisions.map((d) => (
          <div
            key={d.id}
            data-tsec={d.tSec}
            className={cn("row", activeTSec === d.tSec && "active")}
          >
            <span className="decision-glyph" aria-hidden="true"><Gavel /></span>
            <div className="row-main">
              <div className="row-text">{d.text}</div>
              <div className="row-sub">
                <span className="tag decided">Decided</span>
                <span className="due">by {nameOf(d.decidedBy)}</span>
                <TimestampChip tSec={d.tSec} playing={activeTSec === d.tSec} onPlay={onPlay} onHover={onHover} />
                <button
                  className="disclose-btn"
                  aria-expanded={!!open[d.id]}
                  onClick={() => setOpen((o) => ({ ...o, [d.id]: !o[d.id] }))}
                >
                  <Chevron size={12} /> {open[d.id] ? "Hide context" : "Show context"}
                </button>
              </div>
              {open[d.id] && (
                <ContextDisclosure tSec={d.tSec} transcript={transcript} attendees={attendees} onPlay={onPlay} onHover={onHover} />
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
