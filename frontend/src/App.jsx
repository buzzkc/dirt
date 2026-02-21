import { useState, useEffect } from "react";
import { STYLES } from "./styles.js";
import {
  apiFetch, calcScore, maxRoundsForPlayers, cardsForRound,
  handsTotal, allFilled, isValidRound, buildRound,
  incrementTitle, fmtDate, permalink,
  getSavedPasscodeHash, savePasscodeHash
} from "./api.js";

// ─── Router ───────────────────────────────────────────────────────────────────
function useHash() {
  var [hash, setHash] = useState(window.location.hash || "#/");
  useEffect(function() {
    function onHash() { setHash(window.location.hash || "#/"); }
    window.addEventListener("hashchange", onHash);
    return function() { window.removeEventListener("hashchange", onHash); };
  }, []);
  return hash;
}

function navigate(path) { window.location.hash = path; }

function parseRoute(hash) {
  var h = (hash || "").replace(/^#/, "") || "/";
  if (h === "/" || h === "") return { page: "home" };
  if (h === "/players") return { page: "players" };
  if (h === "/rules") return { page: "rules" };
  var m = h.match(/^\/players\/(.+)$/);
  if (m) return { page: "player", slug: m[1] };
  m = h.match(/^\/games\/(.+)$/);
  if (m) return { page: "game-detail", slug: m[1] };
  return { page: "home" };
}

// ─── Emoji helpers ────────────────────────────────────────────────────────────
var EMOJI_HAPPY = "😊";  // 😊
var EMOJI_SAD   = "🙁";  // 🙁

function RoundEmoji(props) {
  if (!props.emoji) return null;
  var em = props.emoji === "happy" ? EMOJI_HAPPY : EMOJI_SAD;
  var title = props.emoji === "happy" ? "Everyone made their bid!" : "Nobody made their bid";
  return (
    <span className="round-emoji" title={title} role="img" aria-label={title}>{em}</span>
  );
}

// ─── Shared UI ────────────────────────────────────────────────────────────────
function PermalinkBar(props) {
  var [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(props.url).then(function() {
      setCopied(true); setTimeout(function() { setCopied(false); }, 2000);
    });
  }
  return (
    <div className="permalink-bar">
      <span className="permalink-url" title={props.url}>{props.url}</span>
      <button className={"permalink-copy" + (copied ? " copied" : "")} onClick={copy}>{copied ? "Copied!" : "Copy Link"}</button>
    </div>
  );
}

function TallyBar(props) {
  var cards = cardsForRound(props.numRounds, props.roundIdx);
  var total = handsTotal(props.entries);
  var filled = allFilled(props.entries);
  var isOk = filled && total === cards;
  var isOver = filled && total > cards;
  var isUnder = filled && !isOk && total < cards;
  var cls = "neutral"; var msg = "Enter all bids and hands won";
  if (isOk) { cls = "ok"; msg = "Hands check out!"; }
  else if (isOver) { cls = "warn"; msg = (total - cards) + " too many — total must equal " + cards; }
  else if (isUnder && filled) { cls = "warn"; msg = (cards - total) + " short — total must equal " + cards; }
  return <div className={"tally-bar " + cls}><span>{msg}</span><span className="tally-num">{total} / {cards} hands</span></div>;
}

function PlayerEntryRow(props) {
  var e = props.entry; var pi = props.pi;
  var numRounds = props.numRounds; var ri = props.roundIdx;
  var onChange = props.onChange; var name = props.name; var prevTotal = props.prevTotal;
  var bid = parseInt(e.bid, 10);
  var hw = e.gotBid ? bid : parseInt(e.handsWon, 10);
  var preview = !isNaN(bid) && !isNaN(hw) ? calcScore(bid, hw) : "-";
  var cards = cardsForRound(numRounds, ri);
  return (
    <div className={"player-entry-row" + (e.gotBid ? " bid-met" : "")}>
      <div>
        <div className="player-name">{name}</div>
        <div className="player-bid-info">{"Running: " + prevTotal + " pts" + (!isNaN(bid) ? " — Bid: " + bid : "")}</div>
        <div style={{ display:"flex", gap:8, marginTop:8 }}>
          <div className="form-group" style={{ marginBottom:0, flex:1 }}>
            <label>Bid</label>
            <input type="number" min="0" max={cards} className="hands-input" style={{ width:"100%" }}
              value={e.bid} onChange={function(ev) { onChange(pi, "bid", ev.target.value); }} />
          </div>
        </div>
      </div>
      <div className="checkbox-wrap">
        <span className="checkbox-label">Got Bid</span>
        <div className={"custom-checkbox" + (e.gotBid ? " checked" : "")}
          onClick={function() { onChange(pi, "gotBid", !e.gotBid); }}>{e.gotBid ? "✓" : ""}</div>
      </div>
      <div className="hands-wrap">
        <span className="checkbox-label">Hands</span>
        <input type="number" min="0" max={cards} className="hands-input"
          value={e.gotBid ? (isNaN(bid) ? "" : bid) : e.handsWon}
          disabled={e.gotBid}
          onChange={function(ev) { onChange(pi, "handsWon", ev.target.value); }} />
        <span className="score-preview">{preview}</span>
      </div>
    </div>
  );
}

function ScoreTable(props) {
  var rounds = props.rounds; var players = props.players;
  var isFinal = props.isFinal; var onEdit = props.onEdit;
  function totalUpTo(pi, ri) { return rounds.slice(0, ri).reduce(function(s, r) { return s + (r.scores[pi] || 0); }, 0); }
  var finalTotals = players.map(function(_, pi) { return rounds.reduce(function(s, r) { return s + (r.scores[pi] || 0); }, 0); });
  var maxFinal = finalTotals.length > 0 ? Math.max.apply(null, finalTotals) : 0;
  return (
    <div className="scorecard-wrap">
      <table className="scorecard">
        <thead><tr>
          <th>Round</th>
          {players.map(function(n, i) { return <th key={i} className="player-col">{n}</th>; })}
        </tr></thead>
        <tbody>
          {rounds.map(function(r, ri) {
            return (
              <tr key={ri}>
                <td>
                  <div className="round-label">{"R" + (ri + 1)}</div>
                  <RoundEmoji emoji={r.emoji} />
                  {onEdit && <button className="btn-edit" onClick={function() { onEdit(ri); }}>edit</button>}
                </td>
                {r.scores.map(function(s, pi) {
                  return <td key={pi}>
                    <div style={{ color:"var(--text-primary)" }}>{s}</div>
                    <div style={{ fontSize:"0.68rem", color:"var(--text-secondary)" }}>{"= " + (totalUpTo(pi, ri) + s)}</div>
                  </td>;
                })}
              </tr>
            );
          })}
          <tr className="total-row">
            <td>{isFinal ? "Final" : "Total"}</td>
            {finalTotals.map(function(t, pi) {
              var isWinner = isFinal && t === maxFinal;
              return <td key={pi} style={{ color: isWinner ? "var(--gold)" : isFinal ? "var(--text-subheading)" : "var(--gold)" }}>
                {isWinner ? t + " ★" : t}
              </td>;
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// ─── Game Emoji Stats Bar ─────────────────────────────────────────────────────
function EmojiStatsBar(props) {
  var smiles = props.smiles || 0;
  var frowns = props.frowns || 0;
  if (smiles === 0 && frowns === 0) return null;
  return (
    <div className="emoji-stats-bar">
      {smiles > 0 && <span className="emoji-stat"><span role="img" aria-label="everyone made bid">{EMOJI_HAPPY}</span> <span className="emoji-stat-count">x{smiles}</span></span>}
      {frowns > 0 && <span className="emoji-stat"><span role="img" aria-label="nobody made bid">{EMOJI_SAD}</span> <span className="emoji-stat-count">x{frowns}</span></span>}
    </div>
  );
}

// ─── Player Picker ────────────────────────────────────────────────────────────
function PlayerPicker(props) {
  var selected = props.selected; var onChange = props.onChange; var maxPlayers = props.maxPlayers || 10;
  var [allPlayers, setAllPlayers] = useState([]);
  var [search, setSearch] = useState("");
  var [newName, setNewName] = useState("");
  var [adding, setAdding] = useState(false);
  var [err, setErr] = useState(null);
  var [dupPrompt, setDupPrompt] = useState(null);

  useEffect(function() { apiFetch("/players").then(setAllPlayers).catch(function() {}); }, []);

  var selectedIds = selected.map(function(p) { return p.id; });
  var filtered = allPlayers.filter(function(p) {
    return !selectedIds.includes(p.id) && p.name.toLowerCase().includes(search.toLowerCase());
  });

  function addExisting(player) {
    if (selected.length >= maxPlayers) return;
    onChange(selected.concat([{ id: player.id, name: player.name, slug: player.slug }]));
    setSearch("");
  }

  function remove(idx) { onChange(selected.filter(function(_, i) { return i !== idx; })); }

  async function createAndAdd() {
    var name = newName.trim();
    if (!name) return;
    var existing = allPlayers.find(function(p) {
      return p.name.toLowerCase() === name.toLowerCase() && !selectedIds.includes(p.id);
    });
    if (existing) { setDupPrompt({ name: name, existing: existing }); return; }
    await doCreate(name);
  }

  async function doCreate(name) {
    setAdding(true); setErr(null);
    try {
      var player = await apiFetch("/players", { method: "POST", body: JSON.stringify({ name: name }) });
      setAllPlayers(function(prev) { return prev.concat([player]).sort(function(a, b) { return a.name.localeCompare(b.name); }); });
      onChange(selected.concat([{ id: player.id, name: player.name, slug: player.slug }]));
      setNewName("");
    } catch (e) { setErr(e.message); }
    finally { setAdding(false); }
  }

  function resolveDup(useExisting) {
    if (useExisting) { addExisting(dupPrompt.existing); }
    else { doCreate(dupPrompt.name); }
    setDupPrompt(null); setNewName("");
  }

  return (
    <div className="player-picker">
      <label>Players <span className="required-star">*</span> <span style={{ color:"var(--text-muted)", fontWeight:400 }}>({selected.length}/{maxPlayers})</span></label>
      {selected.length > 0 && (
        <div className="player-picker-list">
          {selected.map(function(p, i) {
            return (
              <div key={p.id + "-" + i} className="player-chip selected">
                <span style={{ fontFamily:"DM Mono", fontSize:"0.7rem", color:"var(--text-muted)" }}>{i + 1}.</span>
                <span>{p.name}</span>
                <span className="player-chip-remove" onClick={function() { remove(i); }}>&times;</span>
              </div>
            );
          })}
        </div>
      )}
      {selected.length < maxPlayers && (
        <>
          {allPlayers.length > 0 && (
            <>
              <div className="player-search">
                <input type="text" placeholder="Search existing players..." value={search}
                  onChange={function(e) { setSearch(e.target.value); }} />
              </div>
              {search.length > 0 && filtered.length > 0 && (
                <div className="player-search-results">
                  {filtered.slice(0, 8).map(function(p) {
                    return <div key={p.id} className="player-chip clickable" onClick={function() { addExisting(p); }}>{p.name} +</div>;
                  })}
                </div>
              )}
              {search.length > 0 && filtered.length === 0 && (
                <div style={{ fontSize:"0.75rem", color:"var(--text-muted)", fontFamily:"DM Mono", marginBottom:8 }}>No matches. Create below.</div>
              )}
              <hr className="divider" />
            </>
          )}
          <label>Create New Player</label>
          {err && <div className="error-bar" style={{ marginBottom:8 }}>{err}</div>}
          {dupPrompt && (
            <div className="dup-prompt">
              <div className="dup-prompt-msg">
                <strong>{dupPrompt.existing.name}</strong> already exists. Add the existing player, or create a new one named <strong>{dupPrompt.name}</strong>?
              </div>
              <div className="dup-prompt-actions">
                <button className="btn btn-secondary btn-sm" onClick={function() { resolveDup(true); }}>Add Existing</button>
                <button className="btn btn-secondary btn-sm" onClick={function() { resolveDup(false); }}>Create New</button>
                <button className="btn btn-danger btn-sm" onClick={function() { setDupPrompt(null); }}>Cancel</button>
              </div>
            </div>
          )}
          <div className="player-search">
            <input type="text" placeholder="New player name..." value={newName}
              onChange={function(e) { setNewName(e.target.value); }}
              onKeyDown={function(e) { if (e.key === "Enter") createAndAdd(); }} />
            <button className="btn btn-secondary btn-sm" onClick={createAndAdd} disabled={adding || !newName.trim() || !!dupPrompt}>{adding ? "..." : "Add"}</button>
          </div>
          <div className="player-order-hint">Players are seated in the order selected above.</div>
        </>
      )}
    </div>
  );
}

// ─── New Game Form ────────────────────────────────────────────────────────────
function NewGameForm(props) {
  var prefill = props.prefill || {}; var onStart = props.onStart;
  var [title, setTitle] = useState(prefill.title || "");
  var [selectedPlayers, setSelectedPlayers] = useState(prefill.players || []);
  var [numRounds, setNumRounds] = useState(prefill.numRounds || 5);
  var [startedAt, setStartedAt] = useState(function() { return new Date().toISOString().slice(0, 16); });
  var [errors, setErrors] = useState({});
  var [saving, setSaving] = useState(false);
  var [apiError, setApiError] = useState(null);

  var numPlayers = selectedPlayers.length;
  var maxRounds = numPlayers >= 2 ? maxRoundsForPlayers(numPlayers) : 26;
  var clampedRounds = Math.min(numRounds, maxRounds);

  useEffect(function() {
    if (numPlayers >= 2 && numRounds > maxRoundsForPlayers(numPlayers)) {
      setNumRounds(maxRoundsForPlayers(numPlayers));
    }
  }, [numPlayers]);

  var roundOptions = [];
  for (var i = 1; i <= maxRounds; i++) roundOptions.push(i);

  function validate() {
    var e = {};
    if (!title.trim()) e.title = "Game name is required";
    if (selectedPlayers.length < 2) e.players = "At least 2 players required";
    return e;
  }

  async function handleStart() {
    var e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({}); setSaving(true); setApiError(null);
    try {
      var game = await apiFetch("/games", { method: "POST", body: JSON.stringify({
        title: title.trim(),
        num_players: numPlayers,
        num_rounds: clampedRounds,
        player_names: selectedPlayers.map(function(p) { return p.name; }),
        player_ids: selectedPlayers.map(function(p) { return p.id; }),
        started_at: new Date(startedAt).toISOString(),
      })});
      onStart(game, selectedPlayers);
    } catch (err) { setApiError(err.message); }
    finally { setSaving(false); }
  }

  return (
    <div className="card">
      <h2>New Game</h2>
      {apiError && <div className="error-bar">{apiError}</div>}
      <div className="form-group">
        <label>Game Name <span className="required-star">*</span></label>
        <input type="text" placeholder="Friday Night Dirt" value={title}
          className={errors.title ? "input-error" : ""}
          onChange={function(e) { setTitle(e.target.value); setErrors(function(p) { return Object.assign({}, p, {title:null}); }); }} />
        {errors.title && <div className="field-error">{errors.title}</div>}
      </div>
      <div className="form-group">
        <label>Date &amp; Time Started</label>
        <input type="datetime-local" value={startedAt} onChange={function(e) { setStartedAt(e.target.value); }} />
      </div>
      <div className="form-group">
        <PlayerPicker selected={selectedPlayers} onChange={setSelectedPlayers} maxPlayers={10} />
        {errors.players && <div className="field-error">{errors.players}</div>}
      </div>
      {numPlayers >= 2 && (
        <div className="form-group">
          <label>Rounds <span style={{ color:"var(--text-muted)", fontWeight:400 }}>(max {maxRounds} for {numPlayers} players)</span></label>
          <select value={clampedRounds} onChange={function(e) { setNumRounds(Number(e.target.value)); }}>
            {roundOptions.map(function(n) { return <option key={n} value={n}>{n}{n === maxRounds ? " (max)" : ""}</option>; })}
          </select>
        </div>
      )}
      {numPlayers >= 2 && (
        <div className="alert">
          <span className="trump-diamond">Diamonds</span> is always trump.
          {" Round 1: " + clampedRounds + " cards each, down to 1 in the last round."}
        </div>
      )}
      <button className="btn btn-primary" onClick={handleStart} disabled={saving}>{saving ? "Starting..." : "Deal the Cards"}</button>
    </div>
  );
}

// ─── Active Game ──────────────────────────────────────────────────────────────
function ActiveGame(props) {
  var game = props.game; var players = props.players;
  var initialRounds = props.initialRounds || [];
  var onFinish = props.onFinish; var onReset = props.onReset;
  var numRounds = game.num_rounds;
  var [rounds, setRounds] = useState(initialRounds);
  var [roundEntry, setRoundEntry] = useState(function() {
    return { roundIdx: initialRounds.length, entries: blankEntries(players.length) };
  });
  var [editingRound, setEditingRound] = useState(null);
  var [saving, setSaving] = useState(false);
  var [apiError, setApiError] = useState(null);

  function blankEntries(n) { return Array.from({ length: n }, function() { return { bid:"", handsWon:"", gotBid:false }; }); }

  function applyChange(entries, pi, field, val) {
    return entries.map(function(e, i) {
      if (i !== pi) return e;
      var u = Object.assign({}, e);
      u[field] = val;
      if (field === "gotBid" && val === true) u.handsWon = u.bid !== "" ? u.bid : u.handsWon;
      return u;
    });
  }

  function updateEntry(pi, f, v) { setRoundEntry(function(p) { return Object.assign({}, p, { entries: applyChange(p.entries, pi, f, v) }); }); }
  function updateEdit(pi, f, v) { setEditingRound(function(p) { return Object.assign({}, p, { entries: applyChange(p.entries, pi, f, v) }); }); }
  function totalUpTo(pi, ri) { return rounds.slice(0, ri).reduce(function(s, r) { return s + (r.scores[pi] || 0); }, 0); }

  async function submitRound() {
    setApiError(null);
    var nr = buildRound(roundEntry.roundIdx, roundEntry.entries);
    try {
      setSaving(true);
      await apiFetch("/games/" + game.id + "/rounds/" + roundEntry.roundIdx, {
        method:"PUT", body:JSON.stringify({ entries:nr.entries, scores:nr.scores, emoji:nr.emoji, cards_dealt:cardsForRound(numRounds, roundEntry.roundIdx) })
      });
      var newRounds = rounds.concat([nr]);
      var isLast = roundEntry.roundIdx + 1 >= numRounds;
      if (isLast) {
        await apiFetch("/games/" + game.id, { method:"PATCH", body:JSON.stringify({ status:"completed" }) });
        setRounds(newRounds);
        onFinish(newRounds);
      } else {
        setRounds(newRounds);
        setRoundEntry({ roundIdx: roundEntry.roundIdx + 1, entries: blankEntries(players.length) });
      }
    } catch (e) { setApiError(e.message); }
    finally { setSaving(false); }
  }

  async function saveEdit() {
    setApiError(null);
    var ri = editingRound.roundIdx;
    var updated = buildRound(ri, editingRound.entries);
    try {
      setSaving(true);
      await apiFetch("/games/" + game.id + "/rounds/" + ri, {
        method:"PUT", body:JSON.stringify({ entries:updated.entries, scores:updated.scores, emoji:updated.emoji, cards_dealt:cardsForRound(numRounds, ri) })
      });
      setRounds(function(prev) { return prev.map(function(r, idx) { return idx === ri ? updated : r; }); });
      setEditingRound(null);
    } catch (e) { setApiError(e.message); }
    finally { setSaving(false); }
  }

  var smiles = rounds.filter(function(r) { return r.emoji === "happy"; }).length;
  var frowns = rounds.filter(function(r) { return r.emoji === "sad"; }).length;

  return (
    <>
      {apiError && <div className="error-bar" style={{ maxWidth:600, margin:"0 auto 16px" }}>{apiError}</div>}
      {saving && <div className="saving-bar" style={{ maxWidth:600, margin:"0 auto 12px" }}>Saving...</div>}

      {rounds.length > 0 && (
        <div className="card">
          <h2>{game.title}</h2>
          <EmojiStatsBar smiles={smiles} frowns={frowns} />
          <ScoreTable rounds={rounds} players={players} isFinal={false}
            onEdit={function(ri) { setEditingRound({ roundIdx:ri, entries: rounds[ri].entries.map(function(e) { return Object.assign({}, e); }) }); }} />
        </div>
      )}

      <div className="round-entry-card">
        <div className="round-header">
          <div>
            <div className="round-badge">{"Round " + (roundEntry.roundIdx + 1)}</div>
            <div className="cards-badge">{cardsForRound(numRounds, roundEntry.roundIdx) + " cards each"}</div>
          </div>
          <div style={{ fontFamily:"DM Mono", fontSize:"0.72rem", color:"var(--text-muted)" }}>{(roundEntry.roundIdx + 1) + " / " + numRounds}</div>
        </div>
        <div style={{ marginBottom:16 }}>
          {roundEntry.entries.map(function(entry, pi) {
            return <PlayerEntryRow key={pi} entry={entry} pi={pi} numRounds={numRounds} roundIdx={roundEntry.roundIdx}
              onChange={updateEntry} name={players[pi]} prevTotal={totalUpTo(pi, roundEntry.roundIdx)} />;
          })}
        </div>
        <TallyBar entries={roundEntry.entries} numRounds={numRounds} roundIdx={roundEntry.roundIdx} />
        <button className="btn btn-primary" onClick={submitRound}
          disabled={!isValidRound(roundEntry.entries, numRounds, roundEntry.roundIdx) || saving}>
          {saving ? "Saving..." : roundEntry.roundIdx + 1 >= numRounds ? "Finish Game" : "Submit Round " + (roundEntry.roundIdx + 1)}
        </button>
      </div>

      <div className="action-row" style={{ marginTop:8 }}>
        <button className="btn btn-danger" onClick={onReset}>Abandon Game</button>
      </div>

      {editingRound && (
        <div className="modal-overlay" onClick={function(ev) { if (ev.target === ev.currentTarget) setEditingRound(null); }}>
          <div className="modal-box">
            <div className="modal-title">{"Edit Round " + (editingRound.roundIdx + 1)}</div>
            <div className="modal-subtitle">{cardsForRound(numRounds, editingRound.roundIdx) + " cards — correct mistakes below"}</div>
            {apiError && <div className="error-bar">{apiError}</div>}
            {editingRound.entries.map(function(entry, pi) {
              return <PlayerEntryRow key={pi} entry={entry} pi={pi} numRounds={numRounds} roundIdx={editingRound.roundIdx}
                onChange={updateEdit} name={players[pi]} prevTotal={totalUpTo(pi, editingRound.roundIdx)} />;
            })}
            <TallyBar entries={editingRound.entries} numRounds={numRounds} roundIdx={editingRound.roundIdx} />
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={function() { setEditingRound(null); }}>Cancel</button>
              <button className="btn btn-primary" onClick={saveEdit}
                disabled={!isValidRound(editingRound.entries, numRounds, editingRound.roundIdx) || saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Summary ──────────────────────────────────────────────────────────────────
function SummaryPage(props) {
  var game = props.game; var players = props.players; var rounds = props.rounds;
  var onReset = props.onReset; var onClone = props.onClone;
  var finalTotals = players.map(function(_, pi) { return rounds.reduce(function(s, r) { return s + (r.scores[pi] || 0); }, 0); });
  var maxFinal = finalTotals.length > 0 ? Math.max.apply(null, finalTotals) : 0;
  var winnerName = players[finalTotals.indexOf(maxFinal)] || "";
  var url = game.slug ? permalink("games", game.slug) : "";
  var smiles = rounds.filter(function(r) { return r.emoji === "happy"; }).length;
  var frowns = rounds.filter(function(r) { return r.emoji === "sad"; }).length;
  return (
    <>
      {url && <PermalinkBar url={url} />}
      <div className="winner-banner">
        <span className="trophy" role="img" aria-label="trophy">🏆</span>
        <h2>{winnerName}</h2>
        <p>{"Wins with " + maxFinal + " points!"}</p>
        <p style={{ fontSize:"0.8rem", marginTop:8 }}>{game.title + " — " + fmtDate(game.started_at)}</p>
        <EmojiStatsBar smiles={smiles} frowns={frowns} />
      </div>
      <div className="card">
        <h2>Final Scorecard</h2>
        <ScoreTable rounds={rounds} players={players} isFinal={true} onEdit={null} />
      </div>
      <div className="action-row">
        <button className="btn btn-secondary" onClick={onClone}>Rematch</button>
        <button className="btn btn-primary" onClick={onReset}>New Game</button>
      </div>
    </>
  );
}

// ─── Game Detail Page ─────────────────────────────────────────────────────────
function GameDetailPage(props) {
  var [game, setGame] = useState(null); var [loading, setLoading] = useState(true); var [err, setErr] = useState(null);
  useEffect(function() {
    setLoading(true);
    apiFetch("/games/" + props.slug).then(function(g) { setGame(g); setLoading(false); }).catch(function(e) { setErr(e.message); setLoading(false); });
  }, [props.slug]);
  if (loading) return <div className="card"><p style={{ color:"var(--text-secondary)", fontFamily:"DM Mono" }}>Loading...</p></div>;
  if (err) return <div className="card"><div className="error-bar">{err}</div></div>;
  if (!game) return null;
  var players = game.player_names || [];
  var pIds = game.player_ids || [];
  var pSlugs = game.player_slugs || [];
  var rounds = (game.rounds || []).map(function(r) { return { roundIdx:r.round_index, entries:r.entries, scores:r.scores, emoji:r.emoji }; });
  var finalTotals = players.map(function(_, pi) { return rounds.reduce(function(s, r) { return s + (r.scores[pi] || 0); }, 0); });
  var maxFinal = finalTotals.length > 0 ? Math.max.apply(null, finalTotals) : 0;
  var winnerName = players[finalTotals.indexOf(maxFinal)] || "";
  var smiles = game.smiles || 0;
  var frowns = game.frowns || 0;
  return (
    <>
      <button className="page-back" onClick={function() { navigate("/"); }}>Back to Home</button>
      <PermalinkBar url={permalink("games", props.slug)} />
      <div className="winner-banner" style={{ borderColor: game.status === "completed" ? "var(--winner-border)" : "var(--border)" }}>
        <span className="trophy" role="img" aria-label={game.status === "completed" ? "trophy" : "cards"}>{game.status === "completed" ? "🏆" : "🃏"}</span>
        <h2>{game.status === "completed" ? winnerName : game.title}</h2>
        <p>{game.status === "completed" ? (winnerName + " wins with " + maxFinal + " pts!") : "In progress"}</p>
        <p style={{ fontSize:"0.8rem", marginTop:8 }}>{fmtDate(game.started_at)}</p>
        <EmojiStatsBar smiles={smiles} frowns={frowns} />
      </div>
      <div className="card">
        <h2>{game.title}</h2>
        {players.length > 0 && (
          <div style={{ marginBottom:16, display:"flex", flexWrap:"wrap", gap:6 }}>
            {players.map(function(name, i) {
              var pid = pIds[i];
              var pslug = pSlugs[i] || (pid ? String(pid) : null);
              return (
                <div key={i} className="player-chip">
                  {pslug
                    ? <button className="btn-link" onClick={function() { navigate("/players/" + pslug); }}>{name}</button>
                    : <span>{name}</span>}
                </div>
              );
            })}
          </div>
        )}
        <ScoreTable rounds={rounds} players={players} isFinal={game.status === "completed"} onEdit={null} />
      </div>
    </>
  );
}

// ─── Players Page ─────────────────────────────────────────────────────────────
function PlayersPage() {
  var [players, setPlayers] = useState([]); var [loading, setLoading] = useState(true);
  var [newName, setNewName] = useState(""); var [adding, setAdding] = useState(false);
  var [editId, setEditId] = useState(null); var [editName, setEditName] = useState("");
  var [err, setErr] = useState(null);
  var [dupPrompt, setDupPrompt] = useState(null);

  function load() {
    setLoading(true);
    apiFetch("/players-stats").then(function(ps) { setPlayers(ps); setLoading(false); }).catch(function(e) {
      apiFetch("/players").then(function(ps) { setPlayers(ps); setLoading(false); }).catch(function(e2) { setErr(e2.message); setLoading(false); });
    });
  }
  useEffect(load, []);

  async function doAddPlayer(name) {
    setAdding(true); setErr(null);
    try {
      var p = await apiFetch("/players", { method:"POST", body:JSON.stringify({ name:name }) });
      setPlayers(function(prev) { return prev.concat([p]).sort(function(a, b) { return a.name.localeCompare(b.name); }); });
      setNewName("");
    } catch (e) { setErr(e.message); }
    finally { setAdding(false); }
  }

  function addPlayer() {
    var name = newName.trim(); if (!name) return;
    var existing = players.find(function(p) { return p.name.toLowerCase() === name.toLowerCase(); });
    if (existing) { setDupPrompt({ name: name, existing: existing }); return; }
    doAddPlayer(name);
  }

  function resolveDup(createNew) {
    var name = dupPrompt.name;
    setDupPrompt(null);
    if (createNew) doAddPlayer(name);
    else setNewName("");
  }

  async function saveEdit(id) {
    var name = editName.trim(); if (!name) return;
    try {
      var p = await apiFetch("/players/" + id, { method:"PUT", body:JSON.stringify({ name:name }) });
      setPlayers(function(prev) { return prev.map(function(x) { return x.id === id ? Object.assign({}, x, p) : x; }).sort(function(a, b) { return a.name.localeCompare(b.name); }); });
      setEditId(null);
    } catch (e) { setErr(e.message); }
  }

  async function deletePlayer(id) {
    if (!window.confirm("Delete player? Their game history remains.")) return;
    try { await apiFetch("/players/" + id, { method:"DELETE" }); setPlayers(function(prev) { return prev.filter(function(p) { return p.id !== id; }); }); }
    catch (e) { setErr(e.message); }
  }

  return (
    <>
      <button className="page-back" onClick={function() { navigate("/"); }}>Back to Home</button>
      <div className="card">
        <h2>Players</h2>
        {err && <div className="error-bar">{err}</div>}
        <div className="form-group">
          <label>Add New Player</label>
          {dupPrompt && (
            <div className="dup-prompt">
              <div className="dup-prompt-msg">
                A player named <strong>{dupPrompt.existing.name}</strong> already exists. Add another player with the same name?
              </div>
              <div className="dup-prompt-actions">
                <button className="btn btn-secondary btn-sm" onClick={function() { resolveDup(true); }}>Yes, Add Another</button>
                <button className="btn btn-danger btn-sm" onClick={function() { resolveDup(false); }}>No, Cancel</button>
              </div>
            </div>
          )}
          <div className="inline-edit-row">
            <input type="text" placeholder="Player name..." value={newName}
              onChange={function(e) { setNewName(e.target.value); setDupPrompt(null); }} onKeyDown={function(e) { if (e.key === "Enter") addPlayer(); }} />
            <button className="btn btn-secondary btn-sm" onClick={addPlayer} disabled={adding || !newName.trim() || !!dupPrompt}>{adding ? "..." : "Add"}</button>
          </div>
        </div>
        <hr className="divider" />
        {loading && <div className="empty-state">Loading...</div>}
        {!loading && players.length === 0 && <div className="empty-state">No players yet.</div>}
        <div className="player-list">
          {players.map(function(p) {
            var stats = p.stats || null;
            return (
              <div key={p.id} className="player-item">
                {editId === p.id ? (
                  <div className="inline-edit-row" style={{ flex:1 }}>
                    <input type="text" value={editName} autoFocus
                      onChange={function(e) { setEditName(e.target.value); }}
                      onKeyDown={function(e) { if (e.key === "Enter") saveEdit(p.id); if (e.key === "Escape") setEditId(null); }} />
                    <button className="btn btn-secondary btn-sm" onClick={function() { saveEdit(p.id); }}>Save</button>
                    <button className="btn btn-danger btn-sm" onClick={function() { setEditId(null); }}>Cancel</button>
                  </div>
                ) : (
                  <>
                    <div style={{ flex:1, cursor:"pointer" }} onClick={function() { navigate("/players/" + p.slug); }}>
                      <div className="player-item-name">{p.name}</div>
                      {stats ? (
                        <div className="player-item-stats">
                          <span className="player-stat-chip">{stats.games_played} <span className="player-stat-label">games</span></span>
                          <span className="player-stat-chip win">{stats.wins} <span className="player-stat-label">wins</span></span>
                          <span className="player-stat-chip loss">{stats.losses} <span className="player-stat-label">losses</span></span>
                          <span className="player-stat-chip">{stats.total_points} <span className="player-stat-label">pts</span></span>
                        </div>
                      ) : (
                        <div className="player-item-meta">View stats and game history</div>
                      )}
                    </div>
                    <div style={{ display:"flex", gap:6 }}>
                      <button className="btn btn-secondary btn-sm" onClick={function() { setEditId(p.id); setEditName(p.name); }}>Rename</button>
                      <button className="btn btn-danger btn-sm" onClick={function() { deletePlayer(p.id); }}>Delete</button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

// ─── Player Detail Page ───────────────────────────────────────────────────────
function PlayerDetailPage(props) {
  var [data, setData] = useState(null); var [loading, setLoading] = useState(true); var [err, setErr] = useState(null);
  useEffect(function() {
    setLoading(true);
    apiFetch("/players/" + props.slug).then(function(d) { setData(d); setLoading(false); }).catch(function(e) { setErr(e.message); setLoading(false); });
  }, [props.slug]);
  if (loading) return <div className="card"><p style={{ color:"var(--text-secondary)", fontFamily:"DM Mono" }}>Loading...</p></div>;
  if (err) return <div className="card"><div className="error-bar">{err}</div></div>;
  if (!data) return null;
  var stats = data.stats || {};
  return (
    <>
      <button className="page-back" onClick={function() { navigate("/players"); }}>Back to Players</button>
      <PermalinkBar url={permalink("players", props.slug)} />
      <div className="card">
        <h2>{data.name}</h2>
        <div className="stats-grid">
          <div className="stat-box"><div className="stat-value">{stats.games_played || 0}</div><div className="stat-label">Games Played</div></div>
          <div className="stat-box"><div className="stat-value">{stats.wins || 0}</div><div className="stat-label">Wins</div></div>
          <div className="stat-box"><div className="stat-value">{stats.losses || 0}</div><div className="stat-label">Losses</div></div>
          <div className="stat-box"><div className="stat-value">{stats.total_points || 0}</div><div className="stat-label">Total Points</div></div>
        </div>
        {(data.games_in_progress || []).length > 0 && (
          <>
            <h3 style={{ marginBottom:10 }}>In Progress</h3>
            <div className="game-list" style={{ marginBottom:16 }}>
              {(data.games_in_progress || []).map(function(g) {
                return (
                  <div key={g.id} className="game-item">
                    <div style={{ flex:1 }}>
                      <div className="game-item-title" onClick={function() { navigate("/games/" + g.slug); }}>{g.title}</div>
                      <div className="game-item-meta">{fmtDate(g.started_at)}</div>
                    </div>
                    <span className="badge badge-progress">In Progress</span>
                  </div>
                );
              })}
            </div>
          </>
        )}
        {(data.games || []).length > 0 && (
          <>
            <h3 style={{ marginBottom:10 }}>Completed Games</h3>
            <div className="game-list">
              {(data.games || []).map(function(g) {
                return (
                  <div key={g.id} className="game-item">
                    <div style={{ flex:1 }}>
                      <div className="game-item-title" onClick={function() { navigate("/games/" + g.slug); }}>{g.title}</div>
                      <div className="game-item-meta">{fmtDate(g.started_at) + " — " + g.my_score + " pts"}</div>
                      <span className={"badge " + (g.won ? "badge-progress" : "badge-done")} style={{ marginTop:4, display:"inline-block" }}>{g.won ? "🏆 Won" : "Lost"}</span>
                    </div>
                    <button className="btn btn-secondary btn-sm" onClick={function() { navigate("/games/" + g.slug); }}>View</button>
                  </div>
                );
              })}
            </div>
          </>
        )}
        {(stats.games_played || 0) === 0 && (
          <div className="empty-state">No completed games yet.</div>
        )}
      </div>
    </>
  );
}

// ─── Rules Page ───────────────────────────────────────────────────────────────
function RulesPage() {
  return (
    <>
      <button className="page-back" onClick={function() { navigate("/"); }}>Back to Home</button>
      <div className="card">
        <h2>How to Play Dirt</h2>
        <div className="rules-section">
          <h3>Overview</h3>
          <p>Dirt is a trick-taking card game where players bid the number of tricks they expect to win each round. Points are awarded for accurate prediction.</p>
        </div>
        <div className="rules-section">
          <h3>The Deck &amp; Trump</h3>
          <p>Standard 52-card deck, Ace high. <strong style={{ color:"var(--trump-red)" }}>Diamonds are always trump.</strong></p>
        </div>
        <div className="rules-section">
          <h3>The Deal</h3>
          <p>The game starts with N cards per player in Round 1 (where N = number of rounds), then N-1, N-2 ... down to 1 card in the final round. Remaining cards are discarded.</p>
        </div>
        <div className="rules-section">
          <h3>Bidding</h3>
          <p>After the deal, each player bids how many tricks they will win. Bidding starts left of the dealer and goes clockwise. Zero bids are allowed.</p>
        </div>
        <div className="rules-section">
          <h3>Play</h3>
          <ul>
            <li>The player left of the dealer leads the first trick with any card.</li>
            <li>Players must follow the led suit if possible.</li>
            <li>If unable to follow suit, any card including a trump (Diamond) may be played.</li>
            <li>Highest card in the led suit wins, unless a Diamond is played&mdash;then highest Diamond wins.</li>
            <li>The trick winner leads the next trick.</li>
          </ul>
        </div>
        <div className="rules-section">
          <h3>Scoring</h3>
          <ul>
            <li><strong>Made your bid:</strong> Bid + 10 pts &nbsp;<em>(bid 3, won 3 = 13 pts)</em></li>
            <li><strong>Over your bid:</strong> Tricks won only &nbsp;<em>(bid 3, won 4 = 4 pts)</em></li>
            <li><strong>Under your bid:</strong> Tricks won only &nbsp;<em>(bid 3, won 2 = 2 pts)</em></li>
            <li><strong>Bid zero, took none:</strong> 10 pts</li>
            <li><strong>Bid zero, took tricks:</strong> Tricks won only &nbsp;<em>(bid 0, won 2 = 2 pts)</em></li>
          </ul>
        </div>
        <div className="rules-section">
          <h3>Round Indicators</h3>
          <p><span role="img" aria-label="happy">{EMOJI_HAPPY}</span> = Every player made their bid that round.</p>
          <p><span role="img" aria-label="sad">{EMOJI_SAD}</span> = No player made their bid that round.</p>
        </div>
        <div className="rules-section">
          <h3>Winning</h3>
          <p>Highest total score after all rounds wins the game.</p>
        </div>
      </div>
    </>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────
function HomePage(props) {
  var onStartGame = props.onStartGame; var prefill = props.prefill; var setPrefill = props.setPrefill;
  var [tab, setTab] = useState(prefill ? "new" : "new");
  var [history, setHistory] = useState([]);
  var [histLoading, setHistLoading] = useState(false);
  var [apiError, setApiError] = useState(null);

  function loadHistory() {
    setHistLoading(true);
    apiFetch("/games").then(function(gs) { setHistory(gs); setHistLoading(false); }).catch(function(e) { setApiError(e.message); setHistLoading(false); });
  }
  useEffect(function() { if (tab === "history") loadHistory(); }, [tab]);

  async function resumeGame(g) {
    try {
      var data = await apiFetch("/games/" + g.id);
      var pNames = Array.isArray(data.player_names) ? data.player_names : [];
      var pIds = Array.isArray(data.player_ids) ? data.player_ids : [];
      var pSlugs = Array.isArray(data.player_slugs) ? data.player_slugs : [];
      var players = pNames.map(function(n, i) { return { id: pIds[i] || null, name: n, slug: pSlugs[i] || null }; });
      var loaded = (data.rounds || []).map(function(r) { return { roundIdx:r.round_index, entries:r.entries, scores:r.scores, emoji:r.emoji }; });
      onStartGame(data, players, loaded);
    } catch (e) { setApiError(e.message); }
  }

  function cloneGame(g) {
    var pn = Array.isArray(g.player_names) ? g.player_names : JSON.parse(g.player_names || "[]");
    var pids = Array.isArray(g.player_ids) ? g.player_ids : JSON.parse(g.player_ids || "[]");
    var pslugs = Array.isArray(g.player_slugs) ? g.player_slugs : [];
    var players = pn.map(function(n, i) { return { id: pids[i] || null, name: n, slug: pslugs[i] || null }; });
    setPrefill({ title: incrementTitle(g.title), numRounds: g.num_rounds, players: players });
    setTab("new");
  }

  async function deleteGame(id) {
    if (!window.confirm("Delete this game permanently?")) return;
    try { await apiFetch("/games/" + id, { method:"DELETE" }); setHistory(function(p) { return p.filter(function(g) { return g.id !== id; }); }); }
    catch (e) { setApiError(e.message); }
  }

  return (
    <>
      <div className="tab-row">
        <button className={"tab" + (tab === "new" ? " active" : "")} onClick={function() { setTab("new"); }}>New Game</button>
        <button className={"tab" + (tab === "history" ? " active" : "")} onClick={function() { setTab("history"); }}>Game History</button>
      </div>
      {apiError && <div className="error-bar" style={{ maxWidth:600, margin:"0 auto 16px" }}>{apiError}</div>}

      {tab === "new" && (
        <NewGameForm key={JSON.stringify(prefill)} prefill={prefill} onStart={function(game, players) { onStartGame(game, players, []); }} />
      )}

      {tab === "history" && (
        <div className="card">
          <h2>Game History</h2>
          {histLoading && <div className="empty-state">Loading...</div>}
          {!histLoading && history.length === 0 && <div className="empty-state">No games yet. Start one!</div>}
          <div className="game-list">
            {history.map(function(g) {
              var pn = Array.isArray(g.player_names) ? g.player_names : JSON.parse(g.player_names || "[]");
              return (
                <div key={g.id} className="game-item" style={{ flexDirection:"column", alignItems:"stretch" }}>
                  <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12 }}>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div className="game-item-title" onClick={function() { navigate("/games/" + g.slug); }}>{g.title}</div>
                      <div className="game-item-meta">{fmtDate(g.started_at) + " — " + pn.join(", ")}</div>
                      <div style={{ marginTop:6, display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                        <span className={"badge " + (g.status === "completed" ? "badge-done" : "badge-progress")}>{g.status === "completed" ? "Completed" : "In Progress"}</span>
                        <span className="badge" style={{ background:"var(--bg-inset)", border:"1px solid var(--border)", color:"var(--text-muted)" }}>{g.num_rounds + " rounds"}</span>
                        <EmojiStatsBar smiles={g.smiles} frowns={g.frowns} />
                      </div>
                    </div>
                    <div className="game-item-actions">
                      <button className="btn-clone" onClick={function() { cloneGame(g); }}>+ Clone</button>
                      <button className="btn btn-secondary btn-sm" onClick={function() { g.status === "completed" ? navigate("/games/" + g.slug) : resumeGame(g); }}>
                        {g.status === "completed" ? "View" : "Resume"}
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={function() { deleteGame(g.id); }}>Del</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

// ─── Passcode Gate ────────────────────────────────────────────────────────────
function PasscodeGate(props) {
  var onUnlock = props.onUnlock;
  var [code, setCode] = useState("");
  var [error, setError] = useState(null);
  var [loading, setLoading] = useState(false);
  var [theme, setTheme] = useState(function() { return localStorage.getItem("dirt-theme") || "dark"; });

  async function submit() {
    if (!code.trim()) return;
    setLoading(true); setError(null);
    try {
      var result = await apiFetch("/auth/verify", { method:"POST", body:JSON.stringify({ passcode: code }) });
      if (result.ok) {
        savePasscodeHash(result.passcodeHash);
        onUnlock();
      } else {
        setError("Incorrect passcode.");
      }
    } catch (e) {
      setError("Incorrect passcode.");
    } finally {
      setLoading(false);
    }
  }

  function toggleTheme() {
    setTheme(function(t) {
      var next = t === "dark" ? "light" : "dark";
      localStorage.setItem("dirt-theme", next);
      return next;
    });
  }

  return (
    <>
      <style>{STYLES}</style>
      <div className={"app" + (theme === "light" ? " light" : "")}>
        <div className="header">
          <div className="header-nav">
            <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          </div>
          <h1>DIRT</h1>
          <p>Card Game Score Tracker</p>
        </div>
        <div className="card" style={{ maxWidth:360 }}>
          <h2>Welcome</h2>
          <p style={{ color:"var(--text-secondary)", fontSize:"0.88rem", marginBottom:20 }}>Enter the passcode to access the app.</p>
          {error && <div className="error-bar">{error}</div>}
          <div className="form-group">
            <label>Passcode</label>
            <input
              type="password"
              placeholder="Enter passcode..."
              value={code}
              autoFocus
              onChange={function(e) { setCode(e.target.value); setError(null); }}
              onKeyDown={function(e) { if (e.key === "Enter") submit(); }}
            />
          </div>
          <button className="btn btn-primary" onClick={submit} disabled={loading || !code.trim()}>
            {loading ? "Checking..." : "Enter"}
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  var hash = useHash();
  var route = parseRoute(hash);
  var [activeGame, setActiveGame] = useState(null);
  var [prefill, setPrefill] = useState(null);
  var [theme, setTheme] = useState(function() { return localStorage.getItem("dirt-theme") || "dark"; });
  var [unlocked, setUnlocked] = useState(false);
  var [authChecking, setAuthChecking] = useState(true);

  // On mount: check if stored passcode hash matches server's current hash
  useEffect(function() {
    apiFetch("/auth/config").then(function(cfg) {
      var savedHash = getSavedPasscodeHash();
      if (savedHash && savedHash === cfg.passcodeHash) {
        setUnlocked(true);
      }
      setAuthChecking(false);
    }).catch(function() {
      // If auth endpoint fails (e.g. no passcode configured), let through
      setUnlocked(true);
      setAuthChecking(false);
    });
  }, []);

  function toggleTheme() {
    setTheme(function(t) {
      var next = t === "dark" ? "light" : "dark";
      localStorage.setItem("dirt-theme", next);
      return next;
    });
  }

  function startGame(game, players, initialRounds) {
    setActiveGame({ game: game, players: players.map(function(p) { return p.name; }), playerObjs: players, rounds: initialRounds || [], finished: false });
    navigate("/");
  }

  function finishGame(finalRounds) {
    setActiveGame(function(prev) { return Object.assign({}, prev, { rounds: finalRounds, finished: true }); });
  }

  function resetGame() { setActiveGame(null); setPrefill(null); }

  function handleClone() {
    if (!activeGame) return;
    var pids = (activeGame.playerObjs || []).map(function(p) { return p.id; });
    var pslugs = (activeGame.playerObjs || []).map(function(p) { return p.slug; });
    setPrefill({
      title: incrementTitle(activeGame.game.title),
      numRounds: activeGame.game.num_rounds,
      players: activeGame.players.map(function(n, i) { return { id: pids[i] || null, name: n, slug: pslugs[i] || null }; }),
    });
    setActiveGame(null);
    navigate("/");
  }

  if (authChecking) {
    return (
      <>
        <style>{STYLES}</style>
        <div className={"app" + (theme === "light" ? " light" : "")}>
          <div className="header"><h1>DIRT</h1></div>
          <div className="empty-state">Loading...</div>
        </div>
      </>
    );
  }

  if (!unlocked) {
    return <PasscodeGate onUnlock={function() { setUnlocked(true); }} />;
  }

  var isHome = route.page === "home";

  return (
    <>
      <style>{STYLES}</style>
      <div className={"app" + (theme === "light" ? " light" : "")}>
        <div className="header">
          <div className="header-nav">
            <button className={"nav-icon-btn" + (route.page === "players" ? " active" : "")} onClick={function() { navigate("/players"); }}>Players</button>
            <button className={"nav-icon-btn" + (route.page === "rules" ? " active" : "")} onClick={function() { navigate("/rules"); }}>? Rules</button>
            <button className="theme-toggle" onClick={toggleTheme} title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}>
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          </div>
          <h1 onClick={function() { navigate("/"); }}>DIRT</h1>
          <p>Card Game Score Tracker</p>
        </div>

        {route.page === "rules" && <RulesPage />}
        {route.page === "players" && <PlayersPage />}
        {route.page === "player" && <PlayerDetailPage slug={route.slug} />}
        {route.page === "game-detail" && <GameDetailPage slug={route.slug} />}

        {isHome && (
          <>
            {activeGame && !activeGame.finished && (
              <ActiveGame game={activeGame.game} players={activeGame.players} initialRounds={activeGame.rounds}
                onFinish={finishGame} onReset={resetGame} />
            )}
            {activeGame && activeGame.finished && (
              <SummaryPage game={activeGame.game} players={activeGame.players} rounds={activeGame.rounds}
                onReset={resetGame} onClone={handleClone} />
            )}
            {!activeGame && (
              <HomePage onStartGame={startGame} prefill={prefill} setPrefill={setPrefill} />
            )}
          </>
        )}
      </div>
    </>
  );
}
