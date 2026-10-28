import type { TranscriptCue, Attendee } from "../types";
import { TimestampChip } from "./TimestampChip";

interface Props {
  tSec: number;
  transcript: TranscriptCue[];
  attendees: Attendee[];
  onPlay: (sec: number) => void;
  onHover: (sec: number | null) => void;
}

// The 2-3 transcript lines around a moment, so most verification happens
// without ever spawning the player — the heart of the video-demotion thesis.
export function ContextDisclosure({ tSec, transcript, attendees, onPlay, onHover }: Props) {
  const nameOf = (id: string) => attendees.find((a) => a.id === id)?.name ?? "Speaker";
  const cues = [...transcript]
    .sort((a, b) => Math.abs(a.tStartSec - tSec) - Math.abs(b.tStartSec - tSec))
    .slice(0, 3)
    .sort((a, b) => a.tStartSec - b.tStartSec);

  return (
    <div className="context">
      {cues.map((c) => (
        <div key={c.tStartSec} className="context-cue">
          <span className="spk">{nameOf(c.speakerId)}</span>
          {c.text}{" "}
          <TimestampChip tSec={c.tStartSec} onPlay={onPlay} onHover={onHover} />
        </div>
      ))}
    </div>
  );
}
