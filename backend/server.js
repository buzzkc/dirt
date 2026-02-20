const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

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

async function getPool() {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
  }
  return pool;
}

// Health check
app.get("/api/health", async (req, res) => {
  try {
    const db = await getPool();
    await db.query("SELECT 1");
    res.json({ status: "ok" });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// --- GAMES ---

// List all games
app.get("/api/games", async (req, res) => {
  try {
    const db = await getPool();
    const [rows] = await db.query(
      "SELECT id, title, num_players, num_rounds, player_names, status, created_at, updated_at FROM games ORDER BY created_at DESC"
    );
    res.json(rows.map(parseGame));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single game with rounds
app.get("/api/games/:id", async (req, res) => {
  try {
    const db = await getPool();
    const [[game]] = await db.query("SELECT * FROM games WHERE id = ?", [req.params.id]);
    if (!game) return res.status(404).json({ error: "Game not found" });
    const [rounds] = await db.query(
      "SELECT * FROM rounds WHERE game_id = ? ORDER BY round_index ASC",
      [game.id]
    );
    res.json({ ...parseGame(game), rounds: rounds.map(parseRound) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create game
app.post("/api/games", async (req, res) => {
  try {
    const { title, num_players, num_rounds, player_names } = req.body;
    const db = await getPool();
    const [result] = await db.query(
      "INSERT INTO games (title, num_players, num_rounds, player_names, status) VALUES (?, ?, ?, ?, 'in_progress')",
      [title || "", num_players, num_rounds, JSON.stringify(player_names)]
    );
    const [[game]] = await db.query("SELECT * FROM games WHERE id = ?", [result.insertId]);
    res.status(201).json(parseGame(game));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update game status / player names / title
app.patch("/api/games/:id", async (req, res) => {
  try {
    const db = await getPool();
    const { title, player_names, status } = req.body;
    const fields = [];
    const values = [];
    if (title !== undefined) { fields.push("title = ?"); values.push(title); }
    if (player_names !== undefined) { fields.push("player_names = ?"); values.push(JSON.stringify(player_names)); }
    if (status !== undefined) { fields.push("status = ?"); values.push(status); }
    if (fields.length === 0) return res.status(400).json({ error: "Nothing to update" });
    values.push(req.params.id);
    await db.query("UPDATE games SET " + fields.join(", ") + " WHERE id = ?", values);
    const [[game]] = await db.query("SELECT * FROM games WHERE id = ?", [req.params.id]);
    res.json(parseGame(game));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete game
app.delete("/api/games/:id", async (req, res) => {
  try {
    const db = await getPool();
    await db.query("DELETE FROM games WHERE id = ?", [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- ROUNDS ---

// Upsert a round (create or update)
app.put("/api/games/:gameId/rounds/:roundIndex", async (req, res) => {
  try {
    const db = await getPool();
    const { entries, scores, emoji, cards_dealt } = req.body;
    const gameId = parseInt(req.params.gameId);
    const roundIndex = parseInt(req.params.roundIndex);
    await db.query(
      `INSERT INTO rounds (game_id, round_index, cards_dealt, entries, scores, emoji)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         cards_dealt = VALUES(cards_dealt),
         entries = VALUES(entries),
         scores = VALUES(scores),
         emoji = VALUES(emoji)`,
      [gameId, roundIndex, cards_dealt, JSON.stringify(entries), JSON.stringify(scores), emoji || null]
    );
    const [[round]] = await db.query(
      "SELECT * FROM rounds WHERE game_id = ? AND round_index = ?",
      [gameId, roundIndex]
    );
    res.json(parseRound(round));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all rounds for a game
app.get("/api/games/:gameId/rounds", async (req, res) => {
  try {
    const db = await getPool();
    const [rounds] = await db.query(
      "SELECT * FROM rounds WHERE game_id = ? ORDER BY round_index ASC",
      [req.params.gameId]
    );
    res.json(rounds.map(parseRound));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

function parseGame(g) {
  return {
    ...g,
    player_names: typeof g.player_names === "string" ? JSON.parse(g.player_names) : g.player_names,
  };
}

function parseRound(r) {
  return {
    ...r,
    entries: typeof r.entries === "string" ? JSON.parse(r.entries) : r.entries,
    scores: typeof r.scores === "string" ? JSON.parse(r.scores) : r.scores,
  };
}

app.listen(PORT, () => {
  console.log("Dirt backend running on port " + PORT);
});
