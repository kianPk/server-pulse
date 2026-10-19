# Server Pulse

Live **CS2 server status** page — players, map, round, ping heatmap feel. Pure HTML/CSS/JS, no build step. Point it at any JSON status endpoint (or use the built-in demo feed).

## Run

```bash
python3 -m http.server 8090 --directory showcase/server-pulse
# open http://localhost:8090
```

## Status JSON shape

```json
{
  "name": "YGuard · Mirage #3",
  "map": "de_mirage",
  "players": 8,
  "maxPlayers": 10,
  "mode": "Public",
  "round": 12,
  "score": { "ct": 7, "t": 5 },
  "roster": [
    { "name": "Kian", "team": "CT", "kills": 14, "deaths": 9, "ping": 28 }
  ]
}
```

Set `window.PULSE_ENDPOINT` before load, or edit `app.js`.

## License

MIT · Kian Zarandi ([@kianPk](https://github.com/kianPk))
