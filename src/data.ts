import type { Meeting } from "./types";

// One realistic meeting, fully local. Topics are of deliberately unequal duration
// (one ~45s sliver) so the ribbon segments read as visibly proportional.
// Transcript cue timestamps are aligned to decision/action/summary/topic moments
// so clicking any chip lands on a real cue.

export const MEETING: Meeting = {
  id: "mtg-q4-roadmap",
  title: "Q4 Roadmap Sync",
  date: "2026-10-28",
  durationSec: 2040, // 34:00
  readMinutes: 4,
  currentViewerId: "u-maya",
  attendees: [
    { id: "u-maya", name: "Maya Chen", initials: "MC", color: "#8b5cf6", speakingSec: 612 },
    { id: "u-devin", name: "Devin Park", initials: "DP", color: "#3b82f6", speakingSec: 498 },
    { id: "u-priya", name: "Priya Rao", initials: "PR", color: "#10b981", speakingSec: 441 },
    { id: "u-sam", name: "Sam Okafor", initials: "SO", color: "#f59e0b", speakingSec: 303 },
    { id: "u-lena", name: "Lena Brandt", initials: "LB", color: "#ec4899", speakingSec: 186 },
  ],

  summary: {
    sentences: [
      { id: "s1", text: "The team aligned on three priorities for Q4: shipping the onboarding redesign, cutting activation time, and closing the mobile parity gap.", tSec: 54 },
      { id: "s2", text: "Onboarding was named the top bet after Priya showed that 38% of new accounts never reach the first core action.", tSec: 262 },
      { id: "s3", text: "The group debated whether to pull the pricing experiment forward, and decided to hold it until onboarding ships to avoid confounding the activation metric.", tSec: 735 },
      { id: "s4", text: "Devin raised that mobile parity is now the most common churn reason in exit surveys, and the team agreed to staff a dedicated mobile pod.", tSec: 1378 },
      { id: "s5", text: "The meeting closed with owners assigned and a check-in set for the second week of November.", tSec: 2004 },
    ],
  },

  decisions: [
    { id: "d1", text: "Onboarding redesign is the #1 Q4 priority; it gets the first engineer off any other track.", tSec: 318, decidedBy: "u-maya" },
    { id: "d2", text: "Hold the pricing experiment until after onboarding ships, to keep the activation read clean.", tSec: 742, decidedBy: "u-devin" },
    { id: "d3", text: "Stand up a dedicated mobile parity pod of two engineers for the quarter.", tSec: 1452, decidedBy: "u-maya" },
  ],

  actionItems: [
    { id: "a1", text: "Write the onboarding redesign brief and circulate for async review.", assigneeId: "u-maya", dueDate: "2026-10-31", tSec: 402, pushState: "pushed", pushedTo: "Jira", done: false },
    { id: "a2", text: "Pull the 38% drop-off funnel into a shareable dashboard.", assigneeId: "u-priya", dueDate: "2026-10-30", tSec: 288, pushState: "pushed", pushedTo: "Jira", done: false },
    { id: "a3", text: "Draft the mobile pod staffing plan and name the two engineers.", assigneeId: "u-maya", dueDate: "2026-11-03", tSec: 1498, pushState: "local", pushedTo: null, done: false },
    { id: "a4", text: "Park the pricing experiment ticket and add a dependency on onboarding ship.", assigneeId: "u-devin", dueDate: null, tSec: 788, pushState: "local", pushedTo: null, done: false },
    { id: "a5", text: "Book the Nov 12 roadmap check-in and send the agenda.", assigneeId: "u-sam", dueDate: "2026-11-05", tSec: 2016, pushState: "pushed", pushedTo: "Slack", done: false },
  ],

  topics: [
    {
      id: "t1",
      title: "Context & goals for the quarter",
      tStartSec: 0,
      tEndSec: 240,
      bullets: [
        { id: "t1b1", text: "Maya framed Q4 around one question: what moves activation, not what ships the most features.", tSec: 32 },
        { id: "t1b2", text: "Three candidate bets on the table: onboarding, activation time, mobile parity.", tSec: 118 },
      ],
    },
    {
      id: "t2",
      title: "Onboarding redesign & the pricing question",
      tStartSec: 240,
      tEndSec: 1320,
      bullets: [
        { id: "t2b1", text: "Priya: 38% of new accounts never reach the first core action; most drop in the first session.", tSec: 262 },
        { id: "t2b2", text: "Debate on sequencing the pricing experiment alongside onboarding.", tSec: 680 },
        { id: "t2b3", text: "Agreement that running both at once would confound the activation metric.", tSec: 735 },
        { id: "t2b4", text: "Sam flagged that the redesign brief needs the funnel data attached before review.", tSec: 980 },
      ],
    },
    {
      id: "t3",
      title: "Mobile parity & resourcing",
      tStartSec: 1320,
      tEndSec: 1995,
      bullets: [
        { id: "t3b1", text: "Devin: mobile parity is the #1 churn reason in the last two months of exit surveys.", tSec: 1378 },
        { id: "t3b2", text: "A dedicated two-engineer pod beats part-time attention from the whole team.", tSec: 1452 },
        { id: "t3b3", text: "Open question on who backfills the two engineers' current work.", tSec: 1690 },
      ],
    },
    {
      id: "t4",
      title: "Parking lot & next check-in",
      tStartSec: 1995,
      tEndSec: 2040,
      bullets: [
        { id: "t4b1", text: "Check-in set for Nov 12; owners to post status async before.", tSec: 2010 },
      ],
    },
  ],

  transcript: [
    { tStartSec: 30, tEndSec: 58, speakerId: "u-maya", text: "Let's keep Q4 to one question: what actually moves activation. Not what ships the most." },
    { tStartSec: 58, tEndSec: 92, speakerId: "u-maya", text: "So three bets I want to pressure-test today: onboarding, time-to-activate, and mobile parity." },
    { tStartSec: 116, tEndSec: 140, speakerId: "u-devin", text: "Those are the right three. My gut says onboarding is upstream of the other two." },
    { tStartSec: 258, tEndSec: 300, speakerId: "u-priya", text: "Here's the number that worries me: 38% of new accounts never hit the first core action. Most drop in session one." },
    { tStartSec: 300, tEndSec: 330, speakerId: "u-maya", text: "That settles it for me. Onboarding is the number one priority. First free engineer goes there." },
    { tStartSec: 396, tEndSec: 430, speakerId: "u-maya", text: "I'll write the redesign brief and send it around for async review by Friday." },
    { tStartSec: 672, tEndSec: 710, speakerId: "u-sam", text: "Do we run the pricing experiment in parallel, or does that muddy the activation read?" },
    { tStartSec: 728, tEndSec: 760, speakerId: "u-devin", text: "It muddies it. Let's hold pricing until onboarding ships, then we get a clean baseline." },
    { tStartSec: 970, tEndSec: 1000, speakerId: "u-sam", text: "The brief won't pass review without the funnel data attached, so let's get that dashboard first." },
    { tStartSec: 1370, tEndSec: 1410, speakerId: "u-devin", text: "Mobile parity is now the single most common churn reason in exit surveys, two months running." },
    { tStartSec: 1440, tEndSec: 1480, speakerId: "u-maya", text: "Then we staff it properly. A dedicated pod, two engineers, for the quarter. Part-time won't close it." },
    { tStartSec: 1680, tEndSec: 1712, speakerId: "u-priya", text: "The open question is who backfills those two. Let's not leave their current work orphaned." },
    { tStartSec: 2000, tEndSec: 2030, speakerId: "u-sam", text: "I'll book the Nov 12 check-in and send the agenda. Owners post status async before then." },
  ],
};
