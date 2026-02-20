import { useState, useEffect } from "react";

const API = "/api";

async function apiFetch(path, options) {
  var res = await fetch(API + path, Object.assign({ headers: { "Content-Type": "application/json" } }, options));
  if (!res.ok) {
    var err = await res.json().catch(function() { return { error: res.statusText }; });
    throw new Error(err.error || res.statusText);
  }
  return res.json();
}

function calcScore(bid, handsWon) {
  if (bid === 0) return handsWon === 0 ? 10 : handsWon;
  return handsWon === bid ? bid + 10 : handsWon;
}

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Mono:wght@400;500&family=Lato:wght@300;400;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0d2418; min-height: 100vh; font-family: 'Lato', sans-serif; }
  .app { min-height: 100vh; background: radial-gradient(ellipse at 50% 0%, #1a3d28 0%, #0a1c12 60%); color: #e8dfc8; padding: 24px 16px 48px; }
  .header { text-align: center; margin-bottom: 32px; }
  .header h1 { font-family: 'Playfair Display', serif; font-size: clamp(2.4rem, 8vw, 4rem); font-weight: 900; letter-spacing: 0.12em; color: #f0c040; text-shadow: 0 2px 24px rgba(240,192,64,0.35), 0 0 48px rgba(240,192,64,0.12); }
  .header p { font-size: 0.85rem; letter-spacing: 0.2em; text-transform: uppercase; color: #7aad8a; margin-top: 4px; }
  .card { background: linear-gradient(135deg, #1c3826 0%, #162d1e 100%); border: 1px solid #2d5238; border-radius: 16px; padding: 28px; box-shadow: 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05); max-width: 560px; margin: 0 auto 24px; }
  .card h2 { font-family: 'Playfair Display', serif; font-size: 1.3rem; color: #f0c040; margin-bottom: 20px; display: flex; align-items: center; gap: 8px; }
  label { display: block; font-size: 0.75rem; letter-spacing: 0.15em; text-transform: uppercase; color: #7aad8a; margin-bottom: 6px; }
  input[type="text"], input[type="number"], select { width: 100%; background: #0d2418; border: 1px solid #2d5238; border-radius: 8px; color: #e8dfc8; font-family: 'Lato', sans-serif; font-size: 1rem; padding: 10px 14px; outline: none; transition: border-color 0.2s; }
  input:focus, select:focus { border-color: #f0c040; }
  select option { background: #1c3826; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
  .form-group { margin-bottom: 16px; }
  .player-inputs { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
  .player-input-row { display: flex; align-items: center; gap: 10px; }
  .player-badge { width: 32px; height: 32px; border-radius: 50%; background: #f0c040; color: #0d2418; font-weight: 700; font-size: 0.85rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-family: 'DM Mono', monospace; }
  .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 28px; border-radius: 10px; border: none; font-family: 'Lato', sans-serif; font-size: 0.9rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; transition: all 0.18s; }
  .btn-primary { background: linear-gradient(135deg, #f0c040, #d4a020); color: #0d2418; width: 100%; padding: 14px; font-size: 1rem; box-shadow: 0 4px 16px rgba(240,192,64,0.3); }
  .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(240,192,64,0.4); }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  .btn-secondary { background: transparent; border: 1px solid #2d5238; color: #7aad8a; font-size: 0.8rem; padding: 8px 16px; }
  .btn-secondary:hover { border-color: #7aad8a; color: #e8dfc8; }
  .btn-danger { background: transparent; border: 1px solid #5a2020; color: #c06060; font-size: 0.8rem; padding: 8px 16px; }
  .btn-danger:hover { background: #3a1515; border-color: #c06060; }
  .btn-edit { background: transparent; border: 1px solid #2d5238; color: #7aad8a; font-size: 0.68rem; padding: 3px 9px; border-radius: 6px; cursor: pointer; font-family: 'DM Mono', monospace; letter-spacing: 0.08em; transition: all 0.15s; white-space: nowrap; margin-top: 4px; display: inline-block; }
  .btn-edit:hover { border-color: #f0c040; color: #f0c040; }
  .btn-clone { background: transparent; border: 1px solid #2d5238; color: #7aad8a; font-size: 0.72rem; padding: 6px 12px; border-radius: 8px; cursor: pointer; font-family: 'Lato', sans-serif; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; transition: all 0.15s; white-space: nowrap; }
  .btn-clone:hover { border-color: #f0c040; color: #f0c040; background: rgba(240,192,64,0.07); }
  .scorecard-wrap { overflow-x: auto; }
  .scorecard { width: 100%; border-collapse: collapse; font-family: 'DM Mono', monospace; font-size: 0.82rem; }
  .scorecard th { background: #0d2418; padding: 10px 8px; text-align: center; font-size: 0.7rem; letter-spacing: 0.12em; text-transform: uppercase; color: #7aad8a; border-bottom: 1px solid #2d5238; }
  .scorecard th.player-col { color: #f0c040; }
  .scorecard td { padding: 8px 6px; text-align: center; border-bottom: 1px solid #1a3020; vertical-align: middle; }
  .scorecard tr:last-child td { border-bottom: none; }
  .round-label { font-size: 0.7rem; color: #7aad8a; letter-spacing: 0.1em; }
  .round-emoji { font-size: 0.9rem; margin: 2px 0; }
  .total-row td { background: #0d2418; color: #f0c040; font-weight: 700; font-size: 0.9rem; border-top: 2px solid #2d5238; }
  .round-entry-card { background: linear-gradient(135deg, #1c3826 0%, #162d1e 100%); border: 1px solid #2d5238; border-radius: 16px; padding: 24px; max-width: 560px; margin: 0 auto 24px; box-shadow: 0 8px 32px rgba(0,0,0,0.4); }
  .round-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
  .round-badge { font-family: 'Playfair Display', serif; font-size: 1.4rem; color: #f0c040; font-weight: 700; }
  .cards-badge { font-family: 'DM Mono', monospace; font-size: 0.75rem; color: #7aad8a; background: #0d2418; border: 1px solid #2d5238; padding: 4px 12px; border-radius: 20px; margin-top: 4px; display: inline-block; }
  .player-entry-row { background: #0d2418; border: 1px solid #2d5238; border-radius: 10px; padding: 14px 16px; margin-bottom: 10px; display: grid; grid-template-columns: 1fr auto auto; align-items: center; gap: 12px; }
  .player-entry-row.bid-met { border-color: #3d7a50; }
  .player-name { font-weight: 700; color: #e8dfc8; font-size: 0.95rem; }
  .player-bid-info { font-family: 'DM Mono', monospace; font-size: 0.72rem; color: #7aad8a; margin-top: 2px; }
  .checkbox-wrap { display: flex; flex-direction: column; align-items: center; gap: 4px; }
  .checkbox-label { font-size: 0.65rem; color: #7aad8a; letter-spacing: 0.1em; text-transform: uppercase; }
  .custom-checkbox { width: 28px; height: 28px; border-radius: 6px; border: 2px solid #2d5238; background: #162d1e; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; font-size: 1.1rem; font-weight: 700; color: #e8dfc8; }
  .custom-checkbox.checked { background: #3d7a50; border-color: #5aad6e; }
  .custom-checkbox:hover { border-color: #7aad8a; }
  .hands-wrap { display: flex; flex-direction: column; align-items: center; gap: 4px; }
  .hands-input { width: 58px !important; text-align: center; padding: 8px 6px !important; font-family: 'DM Mono', monospace !important; font-size: 1rem !important; }
  .score-preview { font-family: 'DM Mono', monospace; font-size: 0.85rem; color: #f0c040; text-align: right; min-width: 40px; }
  .tally-bar { display: flex; align-items: center; justify-content: space-between; padding: 10px 16px; border-radius: 10px; margin-bottom: 14px; font-family: 'DM Mono', monospace; font-size: 0.82rem; border: 1px solid; transition: all 0.2s; }
  .tally-bar.ok { background: rgba(61,122,80,0.18); border-color: #3d7a50; color: #7aad8a; }
  .tally-bar.warn { background: rgba(200,80,40,0.14); border-color: #a04020; color: #e08060; }
  .tally-bar.neutral { background: rgba(13,36,24,0.6); border-color: #2d5238; color: #7aad8a; }
  .tally-num { font-size: 1.05rem; font-weight: 500; }
  .action-row { display: flex; gap: 10px; max-width: 560px; margin: 0 auto; }
  .action-row .btn { flex: 1; }
  .alert { background: #1a3020; border: 1px solid #2d5238; border-radius: 8px; padding: 10px 14px; font-size: 0.82rem; color: #7aad8a; margin-bottom: 16px; }
  .trump-diamond { display: inline-block; color: #e84040; font-weight: 700; }
  .winner-banner { text-align: center; padding: 32px 24px; background: linear-gradient(135deg, #1c3826, #162d1e); border: 2px solid #f0c040; border-radius: 20px; max-width: 560px; margin: 0 auto 24px; }
  .winner-banner .trophy { font-size: 3.5rem; display: block; margin-bottom: 12px; }
  .winner-banner h2 { font-family: 'Playfair Display', serif; font-size: 2rem; color: #f0c040; }
  .winner-banner p { color: #7aad8a; margin-top: 6px; font-size: 0.9rem; }
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.72); z-index: 100; display: flex; align-items: flex-start; justify-content: center; padding: 24px 16px 48px; overflow-y: auto; }
  .modal-box { background: linear-gradient(135deg, #1c3826 0%, #0f2218 100%); border: 1px solid #3d7a50; border-radius: 18px; padding: 28px 24px; width: 100%; max-width: 560px; box-shadow: 0 16px 64px rgba(0,0,0,0.7); margin-top: 8px; }
  .modal-title { font-family: 'Playfair Display', serif; font-size: 1.35rem; color: #f0c040; margin-bottom: 4px; }
  .modal-subtitle { font-family: 'DM Mono', monospace; font-size: 0.75rem; color: #7aad8a; margin-bottom: 20px; letter-spacing: 0.08em; }
  .modal-actions { display: flex; gap: 10px; margin-top: 16px; }
  .modal-actions .btn { flex: 1; }
  .game-list { display: flex; flex-direction: column; gap: 10px; }
  .game-item { background: #0d2418; border: 1px solid #2d5238; border-radius: 10px; padding: 14px 16px; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
  .game-item:hover { border-color: #3d7a50; }
  .game-item-title { font-family: 'Playfair Display', serif; font-size: 1rem; color: #f0c040; }
  .game-item-meta { font-family: 'DM Mono', monospace; font-size: 0.72rem; color: #7aad8a; margin-top: 3px; }
  .game-item-actions { display: flex; gap: 8px; flex-shrink: 0; }
  .badge { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 0.65rem; font-family: 'DM Mono', monospace; letter-spacing: 0.08em; text-transform: uppercase; }
  .badge-progress { background: rgba(240,192,64,0.15); color: #f0c040; border: 1px solid rgba(240,192,64,0.3); }
  .badge-done { background: rgba(61,122,80,0.2); color: #7aad8a; border: 1px solid #2d5238; }
  .tab-row { display: flex; gap: 4px; max-width: 560px; margin: 0 auto 20px; background: #0d2418; border-radius: 12px; padding: 4px; border: 1px solid #2d5238; }
  .tab { flex: 1; padding: 8px; text-align: center; border-radius: 8px; cursor: pointer; font-size: 0.78rem; letter-spacing: 0.1em; text-transform: uppercase; transition: all 0.15s; font-family: 'DM Mono', monospace; color: #7aad8a; border: none; background: transparent; }
  .tab.active { background: #1c3826; color: #f0c040; }
  .error-bar { background: rgba(200,60,40,0.18); border: 1px solid #a04020; border-radius: 8px; padding: 10px 14px; color: #e08060; font-size: 0.82rem; margin-bottom: 16px; }
  .saving-bar { background: rgba(240,192,64,0.1); border: 1px solid rgba(240,192,64,0.3); border-radius: 8px; padding: 8px 14px; color: #f0c040; font-size: 0.78rem; font-family: 'DM Mono', monospace; margin-bottom: 12px; }
`;

export default function DirtScorekeeper() {
  var [tab, setTab] = useState("new");
  var [phase, setPhase] = useState("setup");
  var [numPlayers, setNumPlayers] = useState(3);
  var [numRounds, setNumRounds] = useState(5);
  var [names, setNames] = useState(["", "", "", "", "", ""]);
  var [rounds, setRounds] = useState([]);
  var [roundEntry, setRoundEntry] = useState(null);
  var [gameTitle, setGameTitle] = useState("");
  var [editingRound, setEditingRound] = useState(null);
  var [gameId, setGameId] = useState(null);
  var [saving, setSaving] = useState(false);
  var [apiError, setApiError] = useState(null);
  var [gameHistory, setGameHistory] = useState([]);
  var [historyLoading, setHistoryLoading] = useState(false);

  var players = names.slice(0, numPlayers);

  function totalUpTo(playerIdx, roundIdx) {
    return rounds.slice(0, roundIdx).reduce(function(sum, r) { return sum + (r.scores[playerIdx] || 0); }, 0);
  }

  function cardsForRound(roundIdx) { return numRounds - roundIdx; }

  function blankEntries() {
    return Array.from({ length: numPlayers }, function() { return { bid: "", handsWon: "", gotBid: false }; });
  }

  function applyEntryChange(entries, playerIdx, field, value) {
    return entries.map(function(e, i) {
      if (i !== playerIdx) return e;
      var u = Object.assign({}, e);
      u[field] = value;
      if (field === "gotBid" && value === true) { u.handsWon = u.bid !== "" ? u.bid : u.handsWon; }
      return u;
    });
  }

  function updateEntry(pi, field, val) {
    setRoundEntry(function(p) { return Object.assign({}, p, { entries: applyEntryChange(p.entries, pi, field, val) }); });
  }

  function updateEditEntry(pi, field, val) {
    setEditingRound(function(p) { return Object.assign({}, p, { entries: applyEntryChange(p.entries, pi, field, val) }); });
  }

  function resolvedHands(e) {
    var bid = parseInt(e.bid, 10);
    if (e.gotBid) return isNaN(bid) ? 0 : bid;
    return parseInt(e.handsWon, 10);
  }

  function handsTotal(entries) {
    return entries.reduce(function(s, e) { var h = resolvedHands(e); return s + (isNaN(h) ? 0 : h); }, 0);
  }

  function allFilled(entries) {
    return entries.every(function(e) {
      var bid = parseInt(e.bid, 10);
      if (isNaN(bid)) return false;
      if (e.gotBid) return true;
      return !isNaN(parseInt(e.handsWon, 10));
    });
  }

  function isValid(entries, roundIdx) { return allFilled(entries) && handsTotal(entries) === cardsForRound(roundIdx); }

  function computeScores(entries) {
    return entries.map(function(e) {
      var bid = parseInt(e.bid, 10); var hands = resolvedHands(e);
      if (isNaN(bid) || isNaN(hands)) return 0;
      return calcScore(bid, hands);
    });
  }

  function buildRound(roundIdx, entries) {
    var scores = computeScores(entries);
    var allGot = entries.every(function(e) { return e.gotBid; });
    var noneGot = entries.every(function(e) { return !e.gotBid; });
    return { roundIdx: roundIdx, entries: entries, scores: scores, emoji: allGot ? "happy" : noneGot ? "sad" : null };
  }

  async function startGame() {
    setApiError(null);
    var fixed = names.map(function(n, i) { return n.trim() || ("Player " + (i + 1)); });
    setNames(fixed);
    try {
      setSaving(true);
      var game = await apiFetch("/games", { method: "POST", body: JSON.stringify({ title: gameTitle, num_players: numPlayers, num_rounds: numRounds, player_names: fixed }) });
      setGameId(game.id);
      setRounds([]);
      setPhase("game");
      setRoundEntry({ roundIdx: 0, entries: blankEntries() });
    } catch (err) { setApiError("Could not save game: " + err.message); }
    finally { setSaving(false); }
  }

  async function submitRound() {
    setApiError(null);
    var nr = buildRound(roundEntry.roundIdx, roundEntry.entries);
    try {
      setSaving(true);
      await apiFetch("/games/" + gameId + "/rounds/" + roundEntry.roundIdx, { method: "PUT", body: JSON.stringify({ entries: nr.entries, scores: nr.scores, emoji: nr.emoji, cards_dealt: cardsForRound(roundEntry.roundIdx) }) });
      var nextIdx = roundEntry.roundIdx + 1;
      var isLast = nextIdx >= numRounds;
      if (isLast) await apiFetch("/games/" + gameId, { method: "PATCH", body: JSON.stringify({ status: "completed" }) });
      setRounds(function(prev) { return prev.concat([nr]); });
      if (isLast) { setPhase("summary"); }
      else { setRoundEntry({ roundIdx: nextIdx, entries: blankEntries() }); }
    } catch (err) { setApiError("Could not save round: " + err.message); }
    finally { setSaving(false); }
  }

  async function saveEditRound() {
    setApiError(null);
    var ri = editingRound.roundIdx; var entries = editingRound.entries;
    var updated = buildRound(ri, entries);
    try {
      setSaving(true);
      await apiFetch("/games/" + gameId + "/rounds/" + ri, { method: "PUT", body: JSON.stringify({ entries: updated.entries, scores: updated.scores, emoji: updated.emoji, cards_dealt: cardsForRound(ri) }) });
      setRounds(function(prev) { return prev.map(function(r, idx) { return idx === ri ? updated : r; }); });
      setEditingRound(null);
    } catch (err) { setApiError("Could not save edit: " + err.message); }
    finally { setSaving(false); }
  }

  function resetGame() {
    setPhase("setup"); setRounds([]); setRoundEntry(null);
    setEditingRound(null); setGameId(null); setGameTitle("");
    setApiError(null); setNames(["", "", "", "", "", ""]);
  }

  function openEditRound(roundIdx) {
    var r = rounds[roundIdx];
    setEditingRound({ roundIdx: roundIdx, entries: r.entries.map(function(e) { return Object.assign({}, e); }) });
  }

  async function loadHistory() {
    setHistoryLoading(true); setApiError(null);
    try { var games = await apiFetch("/games"); setGameHistory(games); }
    catch (err) { setApiError("Could not load history: " + err.message); }
    finally { setHistoryLoading(false); }
  }

  async function loadGame(id) {
    setApiError(null);
    try {
      setSaving(true);
      var data = await apiFetch("/games/" + id);
      var pNames = data.player_names;
      setGameId(data.id); setGameTitle(data.title || "");
      setNumPlayers(data.num_players); setNumRounds(data.num_rounds);
      setNames(pNames.concat(["","","","",""]).slice(0, 6));
      var loaded = (data.rounds || []).map(function(r) { return { roundIdx: r.round_index, entries: r.entries, scores: r.scores, emoji: r.emoji }; });
      setRounds(loaded);
      if (data.status === "completed") { setPhase("summary"); }
      else { setRoundEntry({ roundIdx: loaded.length, entries: Array.from({ length: data.num_players }, function() { return { bid: "", handsWon: "", gotBid: false }; }) }); setPhase("game"); }
      setTab("new");
    } catch (err) { setApiError("Could not load game: " + err.message); }
    finally { setSaving(false); }
  }

  async function deleteGame(id) {
    try { await apiFetch("/games/" + id, { method: "DELETE" }); setGameHistory(function(p) { return p.filter(function(g) { return g.id !== id; }); }); }
    catch (err) { setApiError("Delete failed: " + err.message); }
  }

  function cloneGame(g) {
    var pn = Array.isArray(g.player_names) ? g.player_names : JSON.parse(g.player_names || "[]");
    var baseTitle = g.title || "Untitled Game";
    var match = baseTitle.match(/^(.*)\s+\((\d+)\)$/);
    var newTitle = match ? match[1] + " (" + (parseInt(match[2], 10) + 1) + ")" : baseTitle + " (2)";
    setGameTitle(newTitle);
    setNumPlayers(g.num_players);
    setNumRounds(g.num_rounds);
    var padded = pn.concat(["", "", "", "", "", ""]).slice(0, 6);
    setNames(padded);
    setTab("new");
  }

  useEffect(function() { if (tab === "history") loadHistory(); }, [tab]);

  var finalTotals = players.map(function(_, pi) { return rounds.reduce(function(s, r) { return s + (r.scores[pi] || 0); }, 0); });
  var maxFinal = finalTotals.length > 0 ? Math.max.apply(null, finalTotals) : 0;
  var winnerName = players[finalTotals.indexOf(maxFinal)] || "";

  function TallyBar(props) {
    var cards = cardsForRound(props.roundIdx);
    var total = handsTotal(props.entries);
    var filled = allFilled(props.entries);
    var isOk = filled && total === cards;
    var isOver = filled && total > cards;
    var isUnder = filled && total < cards;
    var cls = "neutral"; var msg = "Enter all bids and hands won";
    if (isOk) { cls = "ok"; msg = "Hands check out!"; }
    else if (isOver) { cls = "warn"; msg = (total - cards) + " too many - total must equal " + cards; }
    else if (isUnder && filled) { cls = "warn"; msg = (cards - total) + " short - total must equal " + cards; }
    return <div className={"tally-bar " + cls}><span>{msg}</span><span className="tally-num">{total} / {cards} hands</span></div>;
  }

  function PlayerRow(props) {
    var e = props.entry; var pi = props.pi; var ri = props.roundIdx; var onChange = props.onChange;
    var bid = parseInt(e.bid, 10);
    var hw = e.gotBid ? bid : parseInt(e.handsWon, 10);
    var preview = !isNaN(bid) && !isNaN(hw) ? calcScore(bid, hw) : "-";
    var cards = cardsForRound(ri);
    return (
      <div className={"player-entry-row" + (e.gotBid ? " bid-met" : "")}>
        <div>
          <div className="player-name">{players[pi]}</div>
          <div className="player-bid-info">{"Running: " + totalUpTo(pi, ri) + " pts" + (!isNaN(bid) ? " - Bid: " + bid : "")}</div>
          <div style={{ display:"flex", gap:8, marginTop:8 }}>
            <div className="form-group" style={{ marginBottom:0, flex:1 }}>
              <label>Bid</label>
              <input type="number" min="0" max={cards} className="hands-input" style={{ width:"100%" }} value={e.bid} onChange={function(ev) { onChange(pi, "bid", ev.target.value); }} />
            </div>
          </div>
        </div>
        <div className="checkbox-wrap">
          <span className="checkbox-label">Got Bid</span>
          <div className={"custom-checkbox" + (e.gotBid ? " checked" : "")} onClick={function() { onChange(pi, "gotBid", !e.gotBid); }}>{e.gotBid ? "V" : ""}</div>
        </div>
        <div className="hands-wrap">
          <span className="checkbox-label">Hands</span>
          <input type="number" min="0" max={cards} className="hands-input" value={e.gotBid ? (isNaN(bid) ? "" : bid) : e.handsWon} disabled={e.gotBid} onChange={function(ev) { onChange(pi, "handsWon", ev.target.value); }} />
          <span className="score-preview">{preview}</span>
        </div>
      </div>
    );
  }

  function ScoreRow(props) {
    var r = props.r; var ri = props.ri;
    return (
      <tr>
        <td>
          <div className="round-label">{"R" + (ri + 1)}</div>
          {r.emoji === "happy" || r.emoji === "sad" ? <div className="round-emoji">{r.emoji === "happy" ? ":-)" : ":-("}</div> : null}
          <button className="btn-edit" onClick={function() { openEditRound(ri); }}>edit</button>
        </td>
        {r.scores.map(function(s, pi) {
          return <td key={pi}><div style={{ color:"#e8dfc8" }}>{s}</div><div style={{ fontSize:"0.68rem", color:"#7aad8a" }}>{"= " + (totalUpTo(pi, ri) + s)}</div></td>;
        })}
      </tr>
    );
  }

  function ScoreTable(props) {
    var isFinal = props.isFinal;
    return (
      <div className="scorecard-wrap">
        <table className="scorecard">
          <thead><tr><th>Round</th>{players.map(function(n, i) { return <th key={i} className="player-col">{n}</th>; })}</tr></thead>
          <tbody>
            {rounds.map(function(r, ri) { return <ScoreRow key={ri} r={r} ri={ri} />; })}
            <tr className="total-row">
              <td>{isFinal ? "Final" : "Total"}</td>
              {(isFinal ? finalTotals : players.map(function(_, pi) { return rounds.reduce(function(s, r) { return s + (r.scores[pi] || 0); }, 0); })).map(function(t, pi) {
                return <td key={pi} style={{ color: isFinal && t === maxFinal ? "#f0c040" : isFinal ? "#c8b878" : "#f0c040" }}>{isFinal && t === maxFinal ? t + " *" : t}</td>;
              })}
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <>
      <style>{STYLES}</style>
      <div className="app">
        <div className="header"><h1>DIRT</h1><p>Card Game Score Tracker</p></div>

        {phase === "setup" && (
          <>
            <div className="tab-row">
              <button className={"tab" + (tab === "new" ? " active" : "")} onClick={function() { setTab("new"); }}>New Game</button>
              <button className={"tab" + (tab === "history" ? " active" : "")} onClick={function() { setTab("history"); }}>Game History</button>
            </div>
            {apiError && <div className="error-bar" style={{ maxWidth:560, margin:"0 auto 16px" }}>{apiError}</div>}

            {tab === "new" && (
              <div className="card">
                <h2>Game Setup</h2>
                <div className="form-group">
                  <label>Game Name (optional)</label>
                  <input type="text" placeholder="Friday Night Dirt..." value={gameTitle} onChange={function(e) { setGameTitle(e.target.value); }} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Players</label>
                    <select value={numPlayers} onChange={function(e) { setNumPlayers(Number(e.target.value)); }}>
                      {[2,3,4,5,6].map(function(n) { return <option key={n} value={n}>{n + " Players"}</option>; })}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Rounds</label>
                    <select value={numRounds} onChange={function(e) { setNumRounds(Number(e.target.value)); }}>
                      {[3,4,5,6,7,8,9,10,11,12,13].map(function(n) { return <option key={n} value={n}>{n + " Rounds"}</option>; })}
                    </select>
                  </div>
                </div>
                <div className="alert"><span className="trump-diamond">Diamonds</span>{" is always trump. Round 1: " + numRounds + " cards each, counting down to 1 card in the last round."}</div>
                <label style={{ marginBottom:10 }}>Player Nicknames</label>
                <div className="player-inputs">
                  {Array.from({ length: numPlayers }).map(function(_, i) {
                    return (
                      <div key={i} className="player-input-row">
                        <div className="player-badge">{i + 1}</div>
                        <input type="text" placeholder={"Player " + (i + 1)} value={names[i] || ""} onChange={function(e) { var n = names.slice(); n[i] = e.target.value; setNames(n); }} />
                      </div>
                    );
                  })}
                </div>
                <button className="btn btn-primary" onClick={startGame} disabled={saving}>{saving ? "Saving..." : "Deal the Cards"}</button>
              </div>
            )}

            {tab === "history" && (
              <div className="card">
                <h2>Game History</h2>
                {historyLoading && <p style={{ color:"#7aad8a", fontFamily:"DM Mono", fontSize:"0.85rem" }}>Loading...</p>}
                {!historyLoading && gameHistory.length === 0 && <p style={{ color:"#7aad8a", fontFamily:"DM Mono", fontSize:"0.85rem" }}>No games saved yet.</p>}
                <div className="game-list">
                  {gameHistory.map(function(g) {
                    var pn = Array.isArray(g.player_names) ? g.player_names : JSON.parse(g.player_names || "[]");
                    return (
                      <div key={g.id} className="game-item">
                        <div>
                          <div className="game-item-title">{g.title || "Untitled Game"}</div>
                          <div className="game-item-meta">{pn.join(", ") + " - " + g.num_rounds + " rounds - " + new Date(g.created_at).toLocaleDateString()}</div>
                          <div style={{ marginTop:4 }}><span className={"badge " + (g.status === "completed" ? "badge-done" : "badge-progress")}>{g.status === "completed" ? "Completed" : "In Progress"}</span></div>
                        </div>
                        <div className="game-item-actions">
                          <button className="btn-clone" onClick={function() { cloneGame(g); }}>+ Clone</button>
                          <button className="btn btn-secondary" style={{ fontSize:"0.72rem", padding:"6px 12px" }} onClick={function() { loadGame(g.id); }}>{g.status === "completed" ? "View" : "Resume"}</button>
                          <button className="btn btn-danger" style={{ fontSize:"0.72rem", padding:"6px 12px" }} onClick={function() { if (window.confirm("Delete this game?")) deleteGame(g.id); }}>Del</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}

        {phase === "game" && (
          <>
            {apiError && <div className="error-bar" style={{ maxWidth:560, margin:"0 auto 16px" }}>{apiError}</div>}
            {saving && <div className="saving-bar" style={{ maxWidth:560, margin:"0 auto 12px" }}>Saving to database...</div>}
            {rounds.length > 0 && (
              <div className="card">
                <h2>{"Scorecard" + (gameTitle ? " - " + gameTitle : "")}</h2>
                <ScoreTable isFinal={false} />
              </div>
            )}
            {roundEntry && (
              <div className="round-entry-card">
                <div className="round-header">
                  <div>
                    <div className="round-badge">{"Round " + (roundEntry.roundIdx + 1)}</div>
                    <div className="cards-badge">{cardsForRound(roundEntry.roundIdx) + " cards each"}</div>
                  </div>
                </div>
                <div style={{ marginBottom:16 }}>
                  {roundEntry.entries.map(function(entry, pi) { return <PlayerRow key={pi} entry={entry} pi={pi} roundIdx={roundEntry.roundIdx} onChange={updateEntry} />; })}
                </div>
                <TallyBar entries={roundEntry.entries} roundIdx={roundEntry.roundIdx} />
                <button className="btn btn-primary" onClick={submitRound} disabled={!isValid(roundEntry.entries, roundEntry.roundIdx) || saving}>
                  {saving ? "Saving..." : (roundEntry.roundIdx + 1 >= numRounds ? "Finish Game" : "Submit Round " + (roundEntry.roundIdx + 1))}
                </button>
              </div>
            )}
            <div className="action-row" style={{ marginTop:8 }}>
              <button className="btn btn-danger" onClick={resetGame}>New Game</button>
            </div>
          </>
        )}

        {phase === "summary" && (
          <>
            {apiError && <div className="error-bar" style={{ maxWidth:560, margin:"0 auto 16px" }}>{apiError}</div>}
            <div className="winner-banner">
              <span className="trophy">&#127942;</span>
              <h2>{winnerName}</h2>
              <p>{"Wins with " + maxFinal + " points!"}</p>
            </div>
            <div className="card">
              <h2>{"Final Scorecard" + (gameTitle ? " - " + gameTitle : "")}</h2>
              <ScoreTable isFinal={true} />
            </div>
            <div className="action-row">
              <button className="btn btn-secondary" onClick={function() {
                cloneGame({ title: gameTitle, num_players: numPlayers, num_rounds: numRounds, player_names: players });
                setPhase("setup");
              }}>Rematch</button>
              <button className="btn btn-primary" onClick={resetGame}>New Game</button>
            </div>
          </>
        )}

        {editingRound && (
          <div className="modal-overlay" onClick={function(e) { if (e.target === e.currentTarget) setEditingRound(null); }}>
            <div className="modal-box">
              <div className="modal-title">{"Edit Round " + (editingRound.roundIdx + 1)}</div>
              <div className="modal-subtitle">{cardsForRound(editingRound.roundIdx) + " cards dealt - correct any mistakes below"}</div>
              {apiError && <div className="error-bar">{apiError}</div>}
              {editingRound.entries.map(function(entry, pi) { return <PlayerRow key={pi} entry={entry} pi={pi} roundIdx={editingRound.roundIdx} onChange={updateEditEntry} />; })}
              <TallyBar entries={editingRound.entries} roundIdx={editingRound.roundIdx} />
              <div className="modal-actions">
                <button className="btn btn-secondary" onClick={function() { setEditingRound(null); }}>Cancel</button>
                <button className="btn btn-primary" onClick={saveEditRound} disabled={!isValid(editingRound.entries, editingRound.roundIdx) || saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
