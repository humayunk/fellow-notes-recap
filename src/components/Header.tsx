import type { Meeting } from "../types";
import type { Theme } from "../hooks";
import { fmtDate, fmtTime, cn } from "../util";
import { Spark, Film } from "./icons";

interface Props {
  meeting: Meeting;
  theme: Theme;
  setTheme: (t: Theme) => void;
  tab: string;
  setTab: (t: string) => void;
  onWatch: () => void;
}

const TABS = ["Agenda", "AI Note", "Transcript"];
export const tabSlug = (s: string) => s.replace(/\s+/g, "-");

export function Header({ meeting, theme, setTheme, tab, setTab, onWatch }: Props) {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-title">
          <h1>{meeting.title}</h1>
          <span className="header-meta tnum">
            {fmtDate(meeting.date)} · {fmtTime(meeting.durationSec)} · {meeting.readMinutes} min read
          </span>
        </div>

        <div className="avatars" aria-label={`${meeting.attendees.length} attendees`}>
          {meeting.attendees.map((a) => (
            <span key={a.id} className="avatar" style={{ background: a.color }} title={a.name}>
              {a.initials}
            </span>
          ))}
        </div>

        <div
          className="tabs"
          role="tablist"
          aria-label="Recap views"
          onKeyDown={(e) => {
            if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
            e.preventDefault();
            const i = TABS.indexOf(tab);
            const next = e.key === "ArrowRight" ? (i + 1) % TABS.length : (i - 1 + TABS.length) % TABS.length;
            setTab(TABS[next]);
            document.getElementById(`tab-${tabSlug(TABS[next])}`)?.focus();
          }}
        >
          {TABS.map((t) => (
            <button
              key={t}
              id={`tab-${tabSlug(t)}`}
              role="tab"
              aria-selected={tab === t}
              aria-controls={`panel-${tabSlug(t)}`}
              tabIndex={tab === t ? 0 : -1}
              className="tab"
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="header-spacer" />

        <div className="theme-seg" role="group" aria-label="Theme">
          {(["system", "light", "dark"] as Theme[]).map((t) => (
            <button key={t} aria-pressed={theme === t} onClick={() => setTheme(t)}>
              {t[0].toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <button className={cn("ghost-btn")} onClick={onWatch}>
          <Film /> Watch
        </button>
        <button className="ask-fellow">
          <Spark /> Ask Fellow
        </button>
      </div>
    </header>
  );
}
