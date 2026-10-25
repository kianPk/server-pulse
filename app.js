const DEMO = {
  name: "YGuard · Mirage #3",
  map: "de_mirage",
  players: 8,
  maxPlayers: 10,
  mode: "Public",
  round: 12,
  score: { ct: 7, t: 5 },
  roster: [
    { name: "Kian", team: "CT", kills: 18, deaths: 9, ping: 24 },
    { name: "Nexa", team: "CT", kills: 14, deaths: 11, ping: 41 },
    { name: "Orbit", team: "CT", kills: 11, deaths: 10, ping: 33 },
    { name: "Vanta", team: "CT", kills: 7, deaths: 12, ping: 58 },
    { name: "Rook", team: "T", kills: 16, deaths: 10, ping: 29 },
    { name: "Echo", team: "T", kills: 13, deaths: 13, ping: 72 },
    { name: "Drift", team: "T", kills: 9, deaths: 14, ping: 110 },
    { name: "Ash", team: "T", kills: 6, deaths: 15, ping: 47 }
  ]
};

const playerHistory = [];
const HISTORY_MAX = 30;
let sortKey = "kills"; // kills | deaths | ping | kd
let lastData = DEMO;

function pingClass(ms) {
  if (ms < 50) return "good";
  if (ms < 90) return "ok";
  return "bad";
}

function kd(p) {
  return p.deaths === 0 ? p.kills : p.kills / p.deaths;
}

function pushSample(players) {
  playerHistory.push(players);
  if (playerHistory.length > HISTORY_MAX) playerHistory.shift();
}

function renderSparkline() {
  const el = document.getElementById("sparkline");
  if (!el) return;
  const max = Math.max(1, ...playerHistory, lastData.maxPlayers || 1);
  el.innerHTML = "";
  el.setAttribute("aria-label", `Player count history, last ${playerHistory.length} samples`);
  for (const n of playerHistory) {
    const bar = document.createElement("span");
    bar.className = "bar";
    bar.style.height = `${Math.max(8, (n / max) * 100)}%`;
    bar.title = String(n);
    el.appendChild(bar);
  }
}

function renderAlert(data) {
  const banner = document.getElementById("alertBanner");
  if (!banner) return;
  const almostFull = data.players >= data.maxPlayers - 1;
  banner.hidden = !almostFull;
  if (almostFull) {
    banner.textContent = `Almost full — ${data.players}/${data.maxPlayers} players`;
  }
}

function sortRoster(roster) {
  const rows = [...roster];
  rows.sort((a, b) => {
    if (sortKey === "ping") return a.ping - b.ping;
    if (sortKey === "deaths") return b.deaths - a.deaths;
    if (sortKey === "kd") return kd(b) - kd(a);
    return b.kills - a.kills;
  });
  return rows;
}

function render(data) {
  lastData = data;
  pushSample(data.players);
  document.getElementById("serverName").textContent = data.name;
  document.getElementById("mode").textContent = data.mode;
  document.getElementById("round").textContent = String(data.round);
  document.getElementById("mapLine").firstChild.textContent = `${data.map} · round `;
  document.getElementById("scoreCt").textContent = String(data.score.ct);
  document.getElementById("scoreT").textContent = String(data.score.t);
  document.getElementById("playersLine").textContent =
    `${data.players} / ${data.maxPlayers} players`;

  renderAlert(data);
  renderSparkline();

  const hint = document.getElementById("sortHint");
  if (hint) hint.textContent = `Sorted by ${sortKey.toUpperCase()} · ping color-coded`;

  const root = document.getElementById("roster");
  root.innerHTML = "";
  for (const p of sortRoster(data.roster)) {
    const el = document.createElement("div");
    el.className = "row";
    el.innerHTML = `
      <span class="team ${p.team.toLowerCase()}">${p.team}</span>
      <span class="name">${escapeHtml(p.name)}</span>
      <span class="stat">${p.kills}</span>
      <span class="stat">${p.deaths}</span>
      <span class="stat">${kd(p).toFixed(2)}</span>
      <span class="stat ping ${pingClass(p.ping)}">${p.ping}</span>
    `;
    root.appendChild(el);
  }
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}

function bindSort() {
  const group = document.getElementById("sortToggle");
  if (!group) return;
  group.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-sort]");
    if (!btn) return;
    sortKey = btn.dataset.sort;
    group.querySelectorAll("button").forEach((b) => b.classList.toggle("active", b === btn));
    render(lastData);
  });
}

async function load() {
  const endpoint = window.PULSE_ENDPOINT;
  if (!endpoint) {
    // Demo drift so sparkline moves
    const jitter = Math.max(0, Math.min(DEMO.maxPlayers, DEMO.players + (Math.random() > 0.5 ? 1 : -1)));
    render({ ...DEMO, players: Math.round(jitter) || DEMO.players });
    return;
  }
  try {
    const res = await fetch(endpoint, { cache: "no-store" });
    if (!res.ok) throw new Error(String(res.status));
    render(await res.json());
  } catch {
    render(DEMO);
  }
}

bindSort();
load();
setInterval(load, 5000);
