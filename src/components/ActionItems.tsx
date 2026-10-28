import { useState } from "react";
import type { ActionItem, Attendee, TranscriptCue } from "../types";
import { cn, fmtDue } from "../util";
import { TimestampChip } from "./TimestampChip";
import { Check, Chevron, Copy, Send } from "./icons";
import { ContextDisclosure } from "./ContextDisclosure";

interface Props {
  items: ActionItem[];
  attendees: Attendee[];
  transcript: TranscriptCue[];
  viewerId: string;
  activeTSec: number | null;
  done: Record<string, boolean>;
  onToggle: (id: string) => void;
  mineOnly: boolean;
  setMineOnly: (v: boolean) => void;
  onPlay: (sec: number) => void;
  onHover: (sec: number | null) => void;
  onCopyAll: () => void;
}

export function ActionItems(p: Props) {
  const { items, attendees, transcript, viewerId, activeTSec, done, onToggle, mineOnly, setMineOnly, onPlay, onHover, onCopyAll } = p;
  const [ctxOpen, setCtxOpen] = useState<Record<string, boolean>>({});
  const att = (id: string) => attendees.find((a) => a.id === id);

  const visible = mineOnly ? items.filter((i) => i.assigneeId === viewerId) : items;
  const open = visible.filter((i) => !done[i.id]);
  const closed = visible.filter((i) => done[i.id]);
  const owedOpen = items.filter((i) => i.assigneeId === viewerId && !done[i.id]).length;
  const allClear = mineOnly && owedOpen === 0;

  const row = (it: ActionItem) => {
    const a = att(it.assigneeId);
    const mine = it.assigneeId === viewerId;
    const dueLabel = fmtDue(it.dueDate);
    const soon = it.dueDate ? new Date(it.dueDate).getTime() - Date.now() < 3 * 864e5 : false;
    return (
      <div
        key={it.id}
        data-tsec={it.tSec}
        className={cn("row", mine && !done[it.id] && "mine", done[it.id] && "done", activeTSec === it.tSec && "active")}
      >
        <button
          className={cn("check", done[it.id] && "on")}
          role="checkbox"
          aria-checked={!!done[it.id]}
          aria-label={done[it.id] ? "Mark not done" : "Mark done"}
          onClick={() => onToggle(it.id)}
        >
          <Check />
        </button>
        <div className="row-main">
          <div className="row-text">{it.text}</div>
          <div className="row-sub">
            {a && (
              <span className="assignee">
                <span className="avatar" style={{ background: a.color }}>{a.initials}</span>
                {mine ? "You" : a.name}
              </span>
            )}
            {dueLabel && <span className={cn("due", soon && "soon")}>Due {dueLabel}</span>}
            <span className={cn("push-ind", it.pushState)}>
              {it.pushState === "pushed" ? `In ${it.pushedTo}` : "Local only"}
            </span>
            <TimestampChip tSec={it.tSec} playing={activeTSec === it.tSec} onPlay={onPlay} onHover={onHover} />
            <button
              className="disclose-btn"
              aria-expanded={!!ctxOpen[it.id]}
              onClick={() => setCtxOpen((o) => ({ ...o, [it.id]: !o[it.id] }))}
            >
              <Chevron size={12} /> {ctxOpen[it.id] ? "Hide context" : "Show context"}
            </button>
          </div>
          {ctxOpen[it.id] && (
            <ContextDisclosure tSec={it.tSec} transcript={transcript} attendees={attendees} onPlay={onPlay} onHover={onHover} />
          )}
        </div>
      </div>
    );
  };

  return (
    <section className="card" aria-label="Action items">
      <div className="card-head">
        <h2>Action items</h2>
        <div className="spacer" />
        <span className="progress tnum">{closed.length} of {visible.length} done</span>
        <div className="mine-toggle" role="group" aria-label="Filter action items">
          <button aria-pressed={mineOnly} onClick={() => setMineOnly(true)}>Mine</button>
          <button aria-pressed={!mineOnly} onClick={() => setMineOnly(false)}>All</button>
        </div>
      </div>

      {allClear && (
        <div className="all-clear">
          <span className="check on" aria-hidden="true"><Check /></span>
          You're clear. Everything assigned to you is done.
        </div>
      )}

      <div className="rows">{open.map(row)}</div>

      {closed.length > 0 && (
        <>
          <div className="done-group-label tnum">Done ({closed.length})</div>
          <div className="rows">{closed.map(row)}</div>
        </>
      )}

      <div className="row-sub" style={{ marginTop: 14 }}>
        <button className="mini-btn" onClick={onCopyAll}><Copy /> Copy all</button>
        <button className="mini-btn"><Send /> Send to Slack</button>
      </div>
    </section>
  );
}
