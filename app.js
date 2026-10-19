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

function pingClass(ms) {
  if (ms < 50) return "good";
  if (ms < 90) return "ok";
  return "bad";
}

function render(data) {
  document.getElementById("serverName").textContent = data.name;
  document.getElementById("mode").textContent = data.mode;
  document.getElementById("round").textContent = String(data.round);
  document.getElementById("mapLine").firstChild.textContent = `${data.map} · round `;
  document.getElementById("scoreCt").textContent = String(data.score.ct);
  document.getElementById("scoreT").textContent = String(data.score.t);
  document.getElementById("playersLine").textContent =
    `${data.players} / ${data.maxPlayers} players`;

  const root = document.getElementById("roster");
  root.innerHTML = "";
  const rows = [...data.roster].sort((a, b) => b.kills - a.kills);
  for (const p of rows) {
    const el = document.createElement("div");
    el.className = "row";
    el.innerHTML = `
      <span class="team ${p.team.toLowerCase()}">${p.team}</span>
      <span class="name">${escapeHtml(p.name)}</span>
      <span class="stat">${p.kills}</span>
      <span class="stat">${p.deaths}</span>
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

async function load() {
  const endpoint = window.PULSE_ENDPOINT;
  if (!endpoint) {
    render(DEMO);
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

load();
setInterval(load, 5000);
