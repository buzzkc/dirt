const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const slugify = require("slugify");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  database: process.env.DB_NAME || "dirt_scores",
  user: process.env.DB_USER || "dirt",
  password: process.env.DB_PASSWORD || "dirtpass",
  waitForConnections: true,
  connectionLimit: 10,
};

let pool;
async function getDb() {
  if (!pool) pool = mysql.createPool(dbConfig);
  return pool;
}

async function uniqueSlug(table, text) {
  var conn = await getDb();
  var base = slugify(text || "item", { lower: true, strict: true }) || "item";
  var slug = base;
  var i = 2;
  while (true) {
    var [rows] = await conn.query("SELECT id FROM " + table + " WHERE slug = ?", [slug]);
    if (rows.length === 0) return slug;
    slug = base + "-" + i++;
  }
}

function parseGame(g) {
  return Object.assign({}, g, {
    player_names: typeof g.player_names === "string" ? JSON.parse(g.player_names) : (g.player_names || []),
    player_ids: typeof g.player_ids === "string" ? JSON.parse(g.player_ids) : (g.player_ids || []),
  });
}

function parseRound(r) {
  return Object.assign({}, r, {
    entries: typeof r.entries === "string" ? JSON.parse(r.entries) : r.entries,
    scores: typeof r.scores === "string" ? JSON.parse(r.scores) : r.scores,
  });
}

// ─── Health ──────────────────────────────────────────────────────────────────
app.get("/api/health", async function(req, res) {
  try { await (await getDb()).query("SELECT 1"); res.json({ status: "ok" }); }
  catch (e) { res.status(500).json({ status: "error", message: e.message }); }
});

// ─── Players ─────────────────────────────────────────────────────────────────
app.get("/api/players", async function(req, res) {
  try {
    var conn = await getDb();
    var [players] = await conn.query("SELECT * FROM players ORDER BY name ASC");
    res.json(players);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post("/api/players", async function(req, res) {
  try {
    var conn = await getDb();
    var name = (req.body.name || "").trim();
    if (!name) return res.status(400).json({ error: "Name is required" });
    var slug = await uniqueSlug("players", name);
    var [result] = await conn.query("INSERT INTO players (name, slug) VALUES (?, ?)", [name, slug]);
    var [[player]] = await conn.query("SELECT * FROM players WHERE id = ?", [result.insertId]);
    res.status(201).json(player);
  } catch (e) {
    if (e.code === "ER_DUP_ENTRY") return res.status(409).json({ error: "Player already exists" });
    res.status(500).json({ error: e.message });
  }
});

app.put("/api/players/:id", async function(req, res) {
  try {
    var conn = await getDb();
    var name = (req.body.name || "").trim();
    if (!name) return res.status(400).json({ error: "Name is required" });
    var slug = await uniqueSlug("players", name);
    await conn.query("UPDATE players SET name = ?, slug = ? WHERE id = ?", [name, slug, req.params.id]);
    var [[player]] = await conn.query("SELECT * FROM players WHERE id = ?", [req.params.id]);
    res.json(player);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete("/api/players/:id", async function(req, res) {
  try {
    var conn = await getDb();
    await conn.query("DELETE FROM players WHERE id = ?", [req.params.id]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get("/api/players/:ref", async function(req, res) {
  try {
    var conn = await getDb();
    var ref = req.params.ref;
    var idNum = parseInt(ref) || 0;
    var [[player]] = await conn.query("SELECT * FROM players WHERE slug = ? OR id = ?", [ref, idNum]);
    if (!player) return res.status(404).json({ error: "Player not found" });

    // Get all completed games this player participated in
    var [completedGames] = await conn.query(
      "SELECT id, title, slug, player_ids, player_names, started_at FROM games WHERE status = 'completed' AND JSON_CONTAINS(player_ids, ?)",
      [JSON.stringify(player.id)]
    );

    var wins = 0; var losses = 0; var totalPoints = 0;
    var gameLinks = [];

    for (var i = 0; i < completedGames.length; i++) {
      var cg = completedGames[i];
      var cgIds = typeof cg.player_ids === "string" ? JSON.parse(cg.player_ids) : cg.player_ids;
      var playerIdx = cgIds.indexOf(player.id);
      if (playerIdx < 0) continue;

      var [roundRows] = await conn.query("SELECT scores FROM rounds WHERE game_id = ?", [cg.id]);
      var playerTotals = cgIds.map(function() { return 0; });
      roundRows.forEach(function(rr) {
        var sc = typeof rr.scores === "string" ? JSON.parse(rr.scores) : rr.scores;
        sc.forEach(function(s, si) { playerTotals[si] = (playerTotals[si] || 0) + s; });
      });
      var myScore = playerTotals[playerIdx] || 0;
      var maxScore = Math.max.apply(null, playerTotals);
      totalPoints += myScore;
      if (myScore === maxScore) wins++; else losses++;
      gameLinks.push({ id: cg.id, title: cg.title, slug: cg.slug, started_at: cg.started_at, my_score: myScore, won: myScore === maxScore });
    }

    // Also get in-progress games
    var [inProgressGames] = await conn.query(
      "SELECT id, title, slug, started_at FROM games WHERE status = 'in_progress' AND JSON_CONTAINS(player_ids, ?)",
      [JSON.stringify(player.id)]
    );

    res.json(Object.assign({}, player, {
      stats: { games_played: completedGames.length, wins: wins, losses: losses, total_points: totalPoints },
      games: gameLinks,
      games_in_progress: inProgressGames.map(function(g) { return { id: g.id, title: g.title, slug: g.slug, started_at: g.started_at }; })
    }));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── Games ───────────────────────────────────────────────────────────────────
app.get("/api/games", async function(req, res) {
  try {
    var conn = await getDb();
    var [rows] = await conn.query(
      "SELECT id, title, slug, num_players, num_rounds, player_names, player_ids, status, started_at, created_at FROM games ORDER BY started_at DESC"
    );
    res.json(rows.map(parseGame));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get("/api/games/:ref", async function(req, res) {
  try {
    var conn = await getDb();
    var ref = req.params.ref;
    var idNum = parseInt(ref) || 0;
    var [[game]] = await conn.query("SELECT * FROM games WHERE slug = ? OR id = ?", [ref, idNum]);
    if (!game) return res.status(404).json({ error: "Game not found" });
    var [rounds] = await conn.query("SELECT * FROM rounds WHERE game_id = ? ORDER BY round_index ASC", [game.id]);
    res.json(Object.assign({}, parseGame(game), { rounds: rounds.map(parseRound) }));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post("/api/games", async function(req, res) {
  try {
    var conn = await getDb();
    var title = (req.body.title || "").trim();
    if (!title) return res.status(400).json({ error: "Game title is required" });
    var { num_players, num_rounds, player_names, player_ids, started_at } = req.body;
    var slug = await uniqueSlug("games", title);
    var startTime = started_at ? new Date(started_at) : new Date();
    var [result] = await conn.query(
      "INSERT INTO games (title, slug, num_players, num_rounds, player_names, player_ids, status, started_at) VALUES (?, ?, ?, ?, ?, ?, 'in_progress', ?)",
      [title, slug, num_players, num_rounds, JSON.stringify(player_names || []), JSON.stringify(player_ids || []), startTime]
    );
    var [[game]] = await conn.query("SELECT * FROM games WHERE id = ?", [result.insertId]);
    res.status(201).json(parseGame(game));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.patch("/api/games/:id", async function(req, res) {
  try {
    var conn = await getDb();
    var fields = []; var values = [];
    var allowed = { title: true, player_names: true, player_ids: true, status: true };
    Object.keys(req.body).forEach(function(k) {
      if (!allowed[k]) return;
      fields.push(k + " = ?");
      values.push(k === "player_names" || k === "player_ids" ? JSON.stringify(req.body[k]) : req.body[k]);
    });
    if (!fields.length) return res.status(400).json({ error: "Nothing to update" });
    values.push(req.params.id);
    await conn.query("UPDATE games SET " + fields.join(", ") + " WHERE id = ?", values);
    var [[game]] = await conn.query("SELECT * FROM games WHERE id = ?", [req.params.id]);
    res.json(parseGame(game));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete("/api/games/:id", async function(req, res) {
  try {
    var conn = await getDb();
    await conn.query("DELETE FROM games WHERE id = ?", [req.params.id]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── Rounds ──────────────────────────────────────────────────────────────────
app.put("/api/games/:gameId/rounds/:roundIndex", async function(req, res) {
  try {
    var conn = await getDb();
    var { entries, scores, emoji, cards_dealt } = req.body;
    var gameId = parseInt(req.params.gameId);
    var roundIndex = parseInt(req.params.roundIndex);
    await conn.query(
      "INSERT INTO rounds (game_id, round_index, cards_dealt, entries, scores, emoji) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE cards_dealt=VALUES(cards_dealt), entries=VALUES(entries), scores=VALUES(scores), emoji=VALUES(emoji)",
      [gameId, roundIndex, cards_dealt, JSON.stringify(entries), JSON.stringify(scores), emoji || null]
    );
    var [[round]] = await conn.query("SELECT * FROM rounds WHERE game_id = ? AND round_index = ?", [gameId, roundIndex]);
    res.json(parseRound(round));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.listen(PORT, function() {
  console.log("Dirt backend listening on port " + PORT);
});
