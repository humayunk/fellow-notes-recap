import { useEffect, useMemo, useState } from "react";
import { MEETING } from "./data";
import { fmtDate, fmtTime, copyText } from "./util";
import { useTheme, usePlayback, useTriage, useReadingPosition, useReducedMotion } from "./hooks";
import { Header } from "./components/Header";
import { Ribbon } from "./components/Ribbon";
import { Digest } from "./components/Digest";
import { Summary } from "./components/Summary";
import { Decisions } from "./components/Decisions";
import { ActionItems } from "./components/ActionItems";
import { Topics } from "./components/Topics";
import { Player } from "./components/Player";
import { ShortcutsOverlay } from "./components/ShortcutsOverlay";
import { Skeleton } from "./components/Skeleton";
import "./styles.css";

export default function App() {
  const m = MEETING;
  const { theme, setTheme } = useTheme();
  const reduced = useReducedMotion();
  const pb = usePlayback(m.durationSec);
  const actionIds = useMemo(() => m.actionItems.map((a) => a.id), [m]);
  const { done, toggle } = useTriage(actionIds);

  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("AI Note");
  const owedTotal = m.actionItems.filter((a) => a.assigneeId === m.currentViewerId).length;
  const [mineOnly, setMineOnly] = useState(owedTotal > 0);
  const [litSec, setLitSec] = useState<number | null>(null);
  const [followAlong, setFollowAlong] = useState(false);
  const [shortcuts, setShortcuts] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [topicsOpen, setTopicsOpen] = useState<Record<string, boolean>>({ [m.topics[0].id]: true });

  const readingSec = useReadingPosition(!loading);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  // Every anchor's second, for stepping and the "now playing" line.
  const anchorSecs = useMemo(() => {
    const s = new Set<number>();
    m.summary.sentences.forEach((x) => s.add(x.tSec));
    m.decisions.forEach((x) => s.add(x.tSec));
    m.actionItems.forEach((x) => s.add(x.tSec));
    m.topics.forEach((t) => t.bullets.forEach((b) => s.add(b.tSec)));
    return [...s].sort((a, b) => a - b);
  }, [m]);

  const activeTSec = useMemo(() => {
    if (!pb.open) return null;
    let best: number | null = null;
    for (const s of anchorSecs) if (s <= pb.currentSec + 0.4) best = s;
    return best;
  }, [pb.open, pb.currentSec, anchorSecs]);

  // Follow-along: keep the playing line in view.
  useEffect(() => {
    if (!followAlong || !pb.playing || activeTSec == null) return;
    const el = document.querySelector<HTMLElement>(`[data-tsec="${activeTSec}"]`);
    el?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
  }, [followAlong, pb.playing, activeTSec, reduced]);

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const onPlay = (sec: number) => pb.playFrom(sec);

  const onJumpTopic = (topicId: string) => {
    const t = m.topics.find((x) => x.id === topicId);
    setTopicsOpen((o) => ({ ...o, [topicId]: true }));
    setTimeout(() => {
      document.getElementById(`topic-${topicId}`)?.scrollIntoView({
        behavior: reduced ? "auto" : "smooth",
        block: "start",
      });
    }, 20);
    if (t) pb.seek(t.tStartSec);
  };

  const allTopicsOpen = m.topics.every((t) => topicsOpen[t.id]);
  const toggleExpandAll = () => {
    const next = !allTopicsOpen;
    setTopicsOpen(Object.fromEntries(m.topics.map((t) => [t.id, next])));
  };

  const nameOf = (id: string) => m.attendees.find((a) => a.id === id)?.name ?? "Someone";

  const copyDigest = async () => {
    const owed = m.actionItems.filter((a) => a.assigneeId === m.currentViewerId && !done[a.id]);
    const lines = [
      `${m.title} — ${fmtDate(m.date)}`,
      ``,
      `TL;DR`,
      m.summary.sentences[0].text,
      ``,
      `Decisions`,
      ...m.decisions.map((d) => `- ${d.text}`),
      ``,
      `My action items`,
      ...(owed.length ? owed.map((a) => `- ${a.text}${a.dueDate ? ` (due ${a.dueDate})` : ""}`) : ["- (all clear)"]),
    ];
    flash((await copyText(lines.join("\n"))) ? "Digest copied" : "Copy failed");
  };

  const copySummary = async () => {
    flash((await copyText(m.summary.sentences.map((s) => s.text).join(" "))) ? "Summary copied" : "Copy failed");
  };

  const copyAllActions = async () => {
    const list = (mineOnly ? m.actionItems.filter((a) => a.assigneeId === m.currentViewerId) : m.actionItems)
      .map((a) => `- ${a.text} — ${nameOf(a.assigneeId)}${a.dueDate ? ` (due ${a.dueDate})` : ""}`);
    flash((await copyText(list.join("\n"))) ? "Action items copied" : "Copy failed");
  };

  // Keyboard layer.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "?" || (e.key === "/" && e.shiftKey)) { e.preventDefault(); setShortcuts((s) => !s); return; }
      if (e.key === "Escape") { setShortcuts(false); return; }
      if (e.key === " ") { e.preventDefault(); pb.toggle(); return; }
      if (e.key === "]") { e.preventDefault(); pb.step(1, anchorSecs); return; }
      if (e.key === "[") { e.preventDefault(); pb.step(-1, anchorSecs); return; }
      if (e.key === "j" || e.key === "k") {
        const checks = Array.from(document.querySelectorAll<HTMLElement>(".check"));
        if (!checks.length) return;
        const idx = checks.indexOf(document.activeElement as HTMLElement);
        const next = e.key === "j" ? Math.min(checks.length - 1, idx + 1) : Math.max(0, idx - 1);
        checks[idx < 0 ? 0 : next]?.focus();
      }
      if (e.key === "x") {
        const el = document.activeElement as HTMLElement;
        if (el?.classList.contains("check")) el.click();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pb, anchorSecs]);

  if (loading) {
    return (
      <div className="app">
        <Header meeting={m} theme={theme} setTheme={setTheme} tab={tab} setTab={setTab} onWatch={() => pb.playFrom(0)} />
        <Skeleton />
      </div>
    );
  }

  return (
    <div className="app">
      <Header meeting={m} theme={theme} setTheme={setTheme} tab={tab} setTab={setTab} onWatch={() => pb.playFrom(0)} />

      {tab === "AI Note" && (
        <>
          <Ribbon
            topics={m.topics}
            decisions={m.decisions}
            actionItems={m.actionItems}
            durationSec={m.durationSec}
            currentSec={pb.currentSec}
            readingSec={readingSec}
            playing={pb.playing}
            litSec={litSec}
            onJumpTopic={onJumpTopic}
          />
          <main className="doc">
            <Digest
              decisionCount={m.decisions.length}
              actionCount={m.actionItems.length}
              owedCount={m.actionItems.filter((a) => a.assigneeId === m.currentViewerId && !done[a.id]).length}
              readMinutes={m.readMinutes}
              recordedLabel={`recorded ${fmtDate(m.date)}`}
              mineOnly={mineOnly}
              onToggleOwed={() => setMineOnly((v) => !v)}
              onCopyDigest={copyDigest}
            />
            <Summary sentences={m.summary.sentences} activeTSec={activeTSec} onPlay={onPlay} onHover={setLitSec} onCopy={copySummary} />
            <Decisions decisions={m.decisions} attendees={m.attendees} transcript={m.transcript} activeTSec={activeTSec} onPlay={onPlay} onHover={setLitSec} />
            <ActionItems
              items={m.actionItems}
              attendees={m.attendees}
              transcript={m.transcript}
              viewerId={m.currentViewerId}
              activeTSec={activeTSec}
              done={done}
              onToggle={toggle}
              mineOnly={mineOnly}
              setMineOnly={setMineOnly}
              onPlay={onPlay}
              onHover={setLitSec}
              onCopyAll={copyAllActions}
            />
            <Topics
              topics={m.topics}
              open={topicsOpen}
              onToggle={(id) => setTopicsOpen((o) => ({ ...o, [id]: !o[id] }))}
              onExpandAll={toggleExpandAll}
              allOpen={allTopicsOpen}
              activeTSec={activeTSec}
              onPlay={onPlay}
              onHover={setLitSec}
            />
            <p className="digest-read" style={{ textAlign: "center" }}>
              Press <kbd>?</kbd> for keyboard shortcuts
            </p>
          </main>
        </>
      )}

      {tab === "Agenda" && (
        <main className="doc">
          <section className="card">
            <div className="card-head"><h2>Agenda</h2></div>
            <ol style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 10 }}>
              {m.topics.map((t) => (
                <li key={t.id} style={{ fontSize: 15 }}>
                  {t.title} <span className="topic-range tnum">{fmtTime(t.tStartSec)}–{fmtTime(t.tEndSec)}</span>
                </li>
              ))}
            </ol>
          </section>
        </main>
      )}

      {tab === "Transcript" && (
        <main className="doc">
          <section className="card">
            <div className="card-head"><h2>Transcript</h2></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {m.transcript.map((c) => (
                <div key={c.tStartSec} className="context-cue" style={{ fontSize: 14 }}>
                  <span className="spk" style={{ color: "var(--text)" }}>{nameOf(c.speakerId)}</span>
                  {c.text}{" "}
                  <button className="chip tnum" onClick={() => onPlay(c.tStartSec)} aria-label={`Play from ${fmtTime(c.tStartSec)}`}>
                    {fmtTime(c.tStartSec)}
                  </button>
                </div>
              ))}
            </div>
          </section>
        </main>
      )}

      {pb.open && <Player meeting={m} pb={pb} followAlong={followAlong} setFollowAlong={setFollowAlong} />}
      {shortcuts && <ShortcutsOverlay onClose={() => setShortcuts(false)} />}
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}
