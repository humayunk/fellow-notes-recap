import { useRef, useState } from "react";
import type { Meeting } from "../types";
import type { Playback } from "../hooks";
import { fmtTime, cn, clamp } from "../util";
import { Play, Pause } from "./icons";

interface Props {
  meeting: Meeting;
  pb: Playback;
  followAlong: boolean;
  setFollowAlong: (v: boolean) => void;
}

export function Player({ meeting, pb, followAlong, setFollowAlong }: Props) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const drag = useRef<{ dx: number; dy: number } | null>(null);
  const scrubRef = useRef<HTMLDivElement>(null);

  const cue =
    meeting.transcript.find((c) => pb.currentSec >= c.tStartSec && pb.currentSec < c.tEndSec) ??
    [...meeting.transcript].reverse().find((c) => c.tStartSec <= pb.currentSec);
  const speaker = cue && meeting.attendees.find((a) => a.id === cue.speakerId);

  const onGripDown = (e: React.PointerEvent) => {
    const el = (e.currentTarget.closest(".pip") as HTMLElement).getBoundingClientRect();
    drag.current = { dx: e.clientX - el.left, dy: e.clientY - el.top };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onGripMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    setPos({
      x: clamp(e.clientX - drag.current.dx, 8, window.innerWidth - 120),
      y: clamp(e.clientY - drag.current.dy, 8, window.innerHeight - 80),
    });
  };
  const onGripUp = (e: React.PointerEvent) => {
    drag.current = null;
    try { (e.target as HTMLElement).releasePointerCapture(e.pointerId); } catch { /* noop */ }
  };

  const seekScrub = (clientX: number) => {
    const el = scrubRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    pb.seek(((clientX - r.left) / r.width) * meeting.durationSec);
  };

  const style: React.CSSProperties = pos
    ? { left: pos.x, top: pos.y, right: "auto", bottom: "auto" }
    : { right: 24, bottom: 24 };

  return (
    <div className="pip" style={style} role="dialog" aria-label="Meeting recording">
      <div className="pip-video">
        <div
          className="pip-grip"
          onPointerDown={onGripDown}
          onPointerMove={onGripMove}
          onPointerUp={onGripUp}
          onPointerCancel={onGripUp}
          aria-hidden="true"
        />
        <div className="pip-tiles">
          {meeting.attendees.slice(0, 2).map((a) => (
            <div key={a.id} className="pip-tile" style={{ background: a.color }}>{a.initials}</div>
          ))}
        </div>
        {cue && (
          <div className="pip-caption">
            {speaker && <span className="spk">{speaker.name}</span>}
            {cue.text}
          </div>
        )}
      </div>

      <div className="pip-bar">
        <button className="pip-play" onClick={pb.toggle} aria-label={pb.playing ? "Pause" : "Play"}>
          {pb.playing ? <Pause /> : <Play />}
        </button>
        <div
          ref={scrubRef}
          className="pip-scrub"
          role="slider"
          aria-label="Seek"
          aria-valuemin={0}
          aria-valuemax={Math.round(meeting.durationSec)}
          aria-valuenow={Math.round(pb.currentSec)}
          aria-valuetext={`${fmtTime(pb.currentSec)} of ${fmtTime(meeting.durationSec)}`}
          tabIndex={0}
          onClick={(e) => seekScrub(e.clientX)}
          onKeyDown={(e) => {
            const keys = ["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown", "Home", "End"];
            if (!keys.includes(e.key)) return;
            e.preventDefault();
            if (e.key === "ArrowRight" || e.key === "ArrowUp") pb.seek(pb.currentSec + 10);
            if (e.key === "ArrowLeft" || e.key === "ArrowDown") pb.seek(pb.currentSec - 10);
            if (e.key === "Home") pb.seek(0);
            if (e.key === "End") pb.seek(meeting.durationSec);
          }}
        >
          <div className="pip-prog" style={{ width: `${(pb.currentSec / meeting.durationSec) * 100}%` }} />
        </div>
        <span className="pip-time tnum">{fmtTime(pb.currentSec)} / {fmtTime(meeting.durationSec)}</span>
        <button
          className="pip-rate tnum"
          onClick={() => pb.setRate(pb.rate >= 2 ? 1 : pb.rate + 0.5)}
          aria-label="Playback speed"
        >
          {pb.rate}×
        </button>
        <button className="pip-x" onClick={pb.close} aria-label="Close player">✕</button>
      </div>

      <button
        className="follow"
        role="switch"
        aria-checked={followAlong}
        onClick={() => setFollowAlong(!followAlong)}
        style={{ width: "100%", justifyContent: "flex-start", border: 0, borderTop: "1px solid var(--border)" }}
      >
        <span className={cn("switch", followAlong && "on")} aria-hidden="true">
          <span className="knob" />
        </span>
        Follow along — highlight notes as it plays
      </button>
    </div>
  );
}
