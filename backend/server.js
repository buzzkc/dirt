const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const slugify = require("slugify");

const app = express();
app.use(cors());
app.use(express.json({ limit: "50kb" }));

const PORT = process.env.PORT || 3001;
const APP_PASSCODE = process.env.APP_PASSCODE || "letmein";

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

// ── Security helpers ──────────────────────────────────────────────────────────

// Strip any HTML tags and trim whitespace to prevent XSS from stored strings
function sanitizeStr(val) {
  if (typeof val !== "string") return "";
  return val.replace(/<[^>]*>/g, "").replace(/[&<>"'`]/g, function(c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#x27;", "`": "&#x60;" }[c];
  }).trim().slice(0, 500);
}

function sanitizeInt(val, fallback) {
  var n = parseInt(val, 10);
  return isNaN(n) ? fallback : n;
}

// All DB queries use mysql2 prepared statements (? placeholders) — no string interpolation
// This function builds slug with record ID suffix for guaranteed uniqueness
function buildSlug(text, id) {
  var base = slugify(text || "item", { lower: true, strict: true }).slice(0, 60) || "item";
  return base + "-" + id;
}

function parseGame(g) {
  return Object.assign({}, g, {
    player_names: typeof g.player_names === "string" ? JSON.parse(g.player_names) : (g.player_names || []),
    player_ids: typeof g.player_ids === "string" ? JSON.parse(g.player_ids) : (g.player_ids || []),
  });
}

async function enrichGameWithPlayerSlugs(game, conn) {
  var ids = game.player_ids || [];
  if (!ids.length) return game;
  var placeholders = ids.map(function() { return "?"; }).join(",");
  var [rows] = await conn.query("SELECT id, slug FROM players WHERE id IN (" + placeholders + ")", ids);
  var slugMap = {};
  rows.forEach(function(r) { slugMap[r.id] = r.slug; });
  var slugs = ids.map(function(id) { return slugMap[id] || null; });
  return Object.assign({}, game, { player_slugs: slugs });
}

function parseRound(r) {
  return Object.assign({}, r, {
    entries: typeof r.entries === "string" ? JSON.parse(r.entries) : r.entries,
    scores: typeof r.scores === "string" ? JSON.parse(r.scores) : r.scores,
  });
}

// ── Passcode ─────────────────────────────────────────────────────────────────
// Returns a hash of the current passcode so the client can detect changes
// without ever receiving the actual passcode value
const crypto = require("crypto");
function passcodeHash() {
  return crypto.createHash("sha256").update(APP_PASSCODE).digest("hex").slice(0, 16);
}

app.get("/api/auth/config", function(req, res) {
  res.json({ passcodeHash: passcodeHash() });
});

app.post("/api/auth/verify", function(req, res) {
  var submitted = sanitizeStr(req.body.passcode || "");
  if (submitted === APP_PASSCODE) {
    res.json({ ok: true, passcodeHash: passcodeHash() });
  } else {
    // Use timing-safe compare to avoid timing attacks
    var dummy = crypto.timingSafeEqual(
      Buffer.from(submitted.padEnd(APP_PASSCODE.length, "\0").slice(0, Math.max(submitted.length, APP_PASSCODE.length))),
      Buffer.from(APP_PASSCODE.padEnd(submitted.length, "\0").slice(0, Math.max(submitted.length, APP_PASSCODE.length)))
    );
    res.status(401).json({ ok: false, error: "Incorrect passcode" });
  }
});

// ── Health ────────────────────────────────────────────────────────────────────
app.get("/api/health", async function(req, res) {
  try { await (await getDb()).query("SELECT 1"); res.json({ status: "ok" }); }
  catch (e) { res.status(500).json({ status: "error", message: e.message }); }
});

// ── Players ───────────────────────────────────────────────────────────────────
app.get("/api/players", async function(req, res) {
  try {
    var conn = await getDb();
    // Return players with basic stats in one query using subqueries
    var [players] = await conn.query("SELECT * FROM players ORDER BY name ASC");
    res.json(players);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Players with stats (for the players listing page)
app.get("/api/players-stats", async function(req, res) {
  try {
    var conn = await getDb();
    var [players] = await conn.query("SELECT * FROM players ORDER BY name ASC");

    // For each player get completed game stats
    var results = await Promise.all(players.map(async function(player) {
      var [completedGames] = await conn.query(
        "SELECT id, player_ids FROM games WHERE status = 'completed' AND JSON_CONTAINS(player_ids, ?)",
        [JSON.stringify(player.id)]
      );
      var wins = 0; var losses = 0; var totalPoints = 0;
      for (var i = 0; i < completedGames.length; i++) {
        var cg = completedGames[i];
        var cgIds = typeof cg.player_ids === "string" ? JSON.parse(cg.player_ids) : cg.player_ids;
        var playerIdx = cgIds.indexOf(player.id);
        if (playerIdx < 0) continue;
        var [roundRows] = await conn.query("SELECT scores FROM rounds WHERE game_id = ?", [cg.id]);
        var totals = cgIds.map(function() { return 0; });
        roundRows.forEach(function(rr) {
          var sc = typeof rr.scores === "string" ? JSON.parse(rr.scores) : rr.scores;
          sc.forEach(function(s, si) { totals[si] = (totals[si] || 0) + s; });
        });
        var myScore = totals[playerIdx] || 0;
        var maxScore = Math.max.apply(null, totals);
        totalPoints += myScore;
        if (myScore === maxScore) wins++; else losses++;
      }
      return Object.assign({}, player, {
        stats: { games_played: completedGames.length, wins: wins, losses: losses, total_points: totalPoints }
      });
    }));
    res.json(results);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post("/api/players", async function(req, res) {
  try {
    var conn = await getDb();
    var name = sanitizeStr(req.body.name || "");
    if (!name) return res.status(400).json({ error: "Name is required" });
    if (name.length > 100) return res.status(400).json({ error: "Name too long (max 100 chars)" });
    // Insert with temporary slug, then update with ID-based slug
    var [result] = await conn.query("INSERT INTO players (name, slug) VALUES (?, ?)", [name, "tmp-" + Date.now()]);
    var id = result.insertId;
    var slug = buildSlug(name, id);
    await conn.query("UPDATE players SET slug = ? WHERE id = ?", [slug, id]);
    var [[player]] = await conn.query("SELECT * FROM players WHERE id = ?", [id]);
    res.status(201).json(player);
  } catch (e) {
    if (e.code === "ER_DUP_ENTRY") return res.status(409).json({ error: "Player already exists" });
    res.status(500).json({ error: e.message });
  }
});

app.put("/api/players/:id", async function(req, res) {
  try {
    var conn = await getDb();
    var id = sanitizeInt(req.params.id, 0);
    if (!id) return res.status(400).json({ error: "Invalid ID" });
    var name = sanitizeStr(req.body.name || "");
    if (!name) return res.status(400).json({ error: "Name is required" });
    var slug = buildSlug(name, id);
    await conn.query("UPDATE players SET name = ?, slug = ? WHERE id = ?", [name, slug, id]);
    var [[player]] = await conn.query("SELECT * FROM players WHERE id = ?", [id]);
    res.json(player);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete("/api/players/:id", async function(req, res) {
  try {
    var conn = await getDb();
    var id = sanitizeInt(req.params.id, 0);
    if (!id) return res.status(400).json({ error: "Invalid ID" });
    await conn.query("DELETE FROM players WHERE id = ?", [id]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get("/api/players/:ref", async function(req, res) {
  try {
    var conn = await getDb();
    var ref = sanitizeStr(req.params.ref);
    var idNum = sanitizeInt(ref, 0);
    var [[player]] = await conn.query("SELECT * FROM players WHERE slug = ? OR id = ?", [ref, idNum]);
    if (!player) return res.status(404).json({ error: "Player not found" });

    var [completedGames] = await conn.query(
      "SELECT id, title, slug, player_ids, player_names, started_at FROM games WHERE status = 'completed' AND JSON_CONTAINS(player_ids, ?)",
      [JSON.stringify(player.id)]
    );

    var wins = 0; var losses = 0; var totalPoints = 0; var gameLinks = [];

    for (var i = 0; i < completedGames.length; i++) {
      var cg = completedGames[i];
      var cgIds = typeof cg.player_ids === "string" ? JSON.parse(cg.player_ids) : cg.player_ids;
      var playerIdx = cgIds.indexOf(player.id);
      if (playerIdx < 0) continue;
      var [roundRows] = await conn.query("SELECT scores FROM rounds WHERE game_id = ?", [cg.id]);
      var totals = cgIds.map(function() { return 0; });
      roundRows.forEach(function(rr) {
        var sc = typeof rr.scores === "string" ? JSON.parse(rr.scores) : rr.scores;
        sc.forEach(function(s, si) { totals[si] = (totals[si] || 0) + s; });
      });
      var myScore = totals[playerIdx] || 0;
      var maxScore = Math.max.apply(null, totals);
      totalPoints += myScore;
      if (myScore === maxScore) wins++; else losses++;
      gameLinks.push({ id: cg.id, title: cg.title, slug: cg.slug, started_at: cg.started_at, my_score: myScore, won: myScore === maxScore });
    }

    var [inProgress] = await conn.query(
      "SELECT id, title, slug, started_at FROM games WHERE status = 'in_progress' AND JSON_CONTAINS(player_ids, ?)",
      [JSON.stringify(player.id)]
    );

    res.json(Object.assign({}, player, {
      stats: { games_played: completedGames.length, wins: wins, losses: losses, total_points: totalPoints },
      games: gameLinks,
      games_in_progress: inProgress
    }));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Games ─────────────────────────────────────────────────────────────────────
app.get("/api/games", async function(req, res) {
  try {
    var conn = await getDb();
    var [rows] = await conn.query(
      "SELECT id, title, slug, num_players, num_rounds, player_names, player_ids, status, started_at, created_at FROM games ORDER BY started_at DESC"
    );
    // Attach emoji stats (smiles/frowns) to each game
    var games = await Promise.all(rows.map(parseGame).map(async function(g) {
      var [emojiRows] = await conn.query("SELECT emoji FROM rounds WHERE game_id = ? AND emoji IS NOT NULL", [g.id]);
      var smiles = 0; var frowns = 0;
      emojiRows.forEach(function(r) { if (r.emoji === "happy") smiles++; else if (r.emoji === "sad") frowns++; });
      return Object.assign({}, g, { smiles: smiles, frowns: frowns });
    }));
    res.json(games);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get("/api/games/:ref", async function(req, res) {
  try {
    var conn = await getDb();
    var ref = sanitizeStr(req.params.ref);
    var idNum = sanitizeInt(ref, 0);
    var [[game]] = await conn.query("SELECT * FROM games WHERE slug = ? OR id = ?", [ref, idNum]);
    if (!game) return res.status(404).json({ error: "Game not found" });
    var [rounds] = await conn.query("SELECT * FROM rounds WHERE game_id = ? ORDER BY round_index ASC", [game.id]);
    var smiles = rounds.filter(function(r) { return r.emoji === "happy"; }).length;
    var frowns = rounds.filter(function(r) { return r.emoji === "sad"; }).length;
    var parsed = parseGame(game);
    var enriched = await enrichGameWithPlayerSlugs(parsed, conn);
    res.json(Object.assign({}, enriched, { rounds: rounds.map(parseRound), smiles: smiles, frowns: frowns }));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post("/api/games", async function(req, res) {
  try {
    var conn = await getDb();
    var title = sanitizeStr(req.body.title || "");
    if (!title) return res.status(400).json({ error: "Game title is required" });
    var num_players = sanitizeInt(req.body.num_players, 2);
    var num_rounds = sanitizeInt(req.body.num_rounds, 5);
    if (num_players < 2 || num_players > 10) return res.status(400).json({ error: "Players must be 2-10" });
    if (num_rounds < 1 || num_rounds > 26) return res.status(400).json({ error: "Rounds out of range" });

    var player_names = (req.body.player_names || []).map(sanitizeStr).slice(0, 10);
    var player_ids = (req.body.player_ids || []).map(function(id) { return sanitizeInt(id, 0); }).slice(0, 10);
    var startTime = req.body.started_at ? new Date(req.body.started_at) : new Date();
    if (isNaN(startTime.getTime())) startTime = new Date();

    // Insert then set slug with ID
    var [result] = await conn.query(
      "INSERT INTO games (title, slug, num_players, num_rounds, player_names, player_ids, status, started_at) VALUES (?, ?, ?, ?, ?, ?, 'in_progress', ?)",
      [title, "tmp-" + Date.now(), num_players, num_rounds, JSON.stringify(player_names), JSON.stringify(player_ids), startTime]
    );
    var id = result.insertId;
    var slug = buildSlug(title, id);
    await conn.query("UPDATE games SET slug = ? WHERE id = ?", [slug, id]);
    var [[game]] = await conn.query("SELECT * FROM games WHERE id = ?", [id]);
    res.status(201).json(parseGame(game));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.patch("/api/games/:id", async function(req, res) {
  try {
    var conn = await getDb();
    var id = sanitizeInt(req.params.id, 0);
    if (!id) return res.status(400).json({ error: "Invalid ID" });
    var fields = []; var values = [];
    if (req.body.title !== undefined) { fields.push("title = ?"); values.push(sanitizeStr(req.body.title)); }
    if (req.body.player_names !== undefined) { fields.push("player_names = ?"); values.push(JSON.stringify((req.body.player_names || []).map(sanitizeStr))); }
    if (req.body.player_ids !== undefined) { fields.push("player_ids = ?"); values.push(JSON.stringify((req.body.player_ids || []).map(function(x) { return sanitizeInt(x, 0); }))); }
    if (req.body.status !== undefined) {
      var status = ["in_progress", "completed"].includes(req.body.status) ? req.body.status : null;
      if (!status) return res.status(400).json({ error: "Invalid status" });
      fields.push("status = ?"); values.push(status);
    }
    if (!fields.length) return res.status(400).json({ error: "Nothing to update" });
    values.push(id);
    await conn.query("UPDATE games SET " + fields.join(", ") + " WHERE id = ?", values);
    var [[game]] = await conn.query("SELECT * FROM games WHERE id = ?", [id]);
    res.json(parseGame(game));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete("/api/games/:id", async function(req, res) {
  try {
    var conn = await getDb();
    var id = sanitizeInt(req.params.id, 0);
    if (!id) return res.status(400).json({ error: "Invalid ID" });
    await conn.query("DELETE FROM games WHERE id = ?", [id]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Rounds ────────────────────────────────────────────────────────────────────
app.put("/api/games/:gameId/rounds/:roundIndex", async function(req, res) {
  try {
    var conn = await getDb();
    var gameId = sanitizeInt(req.params.gameId, 0);
    var roundIndex = sanitizeInt(req.params.roundIndex, 0);
    if (!gameId) return res.status(400).json({ error: "Invalid game ID" });

    // Validate entries array structure
    var entries = (req.body.entries || []).slice(0, 10).map(function(e) {
      return {
        bid: sanitizeStr(String(e.bid || "")),
        handsWon: sanitizeStr(String(e.handsWon || "")),
        gotBid: Boolean(e.gotBid)
      };
    });
    var scores = (req.body.scores || []).slice(0, 10).map(function(s) { return sanitizeInt(s, 0); });
    var emojiRaw = req.body.emoji;
    var emoji = emojiRaw === "happy" || emojiRaw === "sad" ? emojiRaw : null;
    var cards_dealt = sanitizeInt(req.body.cards_dealt, 1);

    await conn.query(
      "INSERT INTO rounds (game_id, round_index, cards_dealt, entries, scores, emoji) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE cards_dealt=VALUES(cards_dealt), entries=VALUES(entries), scores=VALUES(scores), emoji=VALUES(emoji)",
      [gameId, roundIndex, cards_dealt, JSON.stringify(entries), JSON.stringify(scores), emoji]
    );
    var [[round]] = await conn.query("SELECT * FROM rounds WHERE game_id = ? AND round_index = ?", [gameId, roundIndex]);
    res.json(parseRound(round));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.listen(PORT, function() {
  console.log("Dirt backend listening on port " + PORT);
});
