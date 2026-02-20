import { useState, useEffect } from "react";

// ─── API ─────────────────────────────────────────────────────────────────────
const API = "/api";
async function apiFetch(path, opts) {
  var res = await fetch(API + path, Object.assign({ headers: { "Content-Type": "application/json" } }, opts));
  if (!res.ok) {
    var e = await res.json().catch(function() { return { error: res.statusText }; });
    throw new Error(e.error || res.statusText);
  }
  return res.json();
}

// ─── Scoring ─────────────────────────────────────────────────────────────────
function calcScore(bid, handsWon) {
  if (bid === 0) return handsWon === 0 ? 10 : handsWon;
  return handsWon === bid ? bid + 10 : handsWon;
}

function maxRoundsForPlayers(n) {
  return Math.floor(52 / n);
}

// ─── Routing ─────────────────────────────────────────────────────────────────
function getRoute() {
  var hash = window.location.hash || "#/";
  return hash.replace(/^#/, "") || "/";
}

function navigate(path) {
  window.location.hash = path;
}

function useRoute() {
  var [route, setRoute] = useState(getRoute());
  useEffect(function() {
    function onHash() { setRoute(getRoute()); }
    window.addEventListener("hashchange", onHash);
    return function() { window.removeEventListener("hashchange", onHash); };
  }, []);
  return route;
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Mono:wght@400;500&family=Lato:wght@300;400;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0d2418; min-height: 100vh; font-family: 'Lato', sans-serif; }
  .app { min-height: 100vh; background: radial-gradient(ellipse at 50% 0%, #1a3d28 0%, #0a1c12 60%); color: #e8dfc8; padding: 24px 16px 48px; }
  .header { text-align: center; margin-bottom: 28px; position: relative; }
  .header h1 { font-family: 'Playfair Display', serif; font-size: clamp(2rem, 8vw, 3.5rem); font-weight: 900; letter-spacing: 0.12em; color: #f0c040; text-shadow: 0 2px 24px rgba(240,192,64,0.35); cursor: pointer; display: inline-block; }
  .header p { font-size: 0.8rem; letter-spacing: 0.2em; text-transform: uppercase; color: #7aad8a; margin-top: 4px; }
  .header-icons { position: absolute; right: 0; top: 0; display: flex; gap: 10px; align-items: center; }
  .icon-btn { background: transparent; border: 1px solid #2d5238; border-radius: 8px; color: #7aad8a; cursor: pointer; padding: 6px 10px; font-size: 1rem; transition: all 0.15s; text-decoration: none; display: inline-flex; align-items: center; }
  .icon-btn:hover { border-color: #f0c040; color: #f0c040; }

  .card { background: linear-gradient(135deg, #1c3826 0%, #162d1e 100%); border: 1px solid #2d5238; border-radius: 16px; padding: 28px; box-shadow: 0 8px 32px rgba(0,0,0,0.4); max-width: 600px; margin: 0 auto 24px; }
  .card h2 { font-family: 'Playfair Display', serif; font-size: 1.3rem; color: #f0c040; margin-bottom: 20px; display: flex; align-items: center; gap: 8px; }

  label { display: block; font-size: 0.75rem; letter-spacing: 0.15em; text-transform: uppercase; color: #7aad8a; margin-bottom: 6px; }
  .required-star { color: #e84040; margin-left: 2px; }
  input[type="text"], input[type="number"], input[type="datetime-local"], select, textarea { width: 100%; background: #0d2418; border: 1px solid #2d5238; border-radius: 8px; color: #e8dfc8; font-family: 'Lato', sans-serif; font-size: 1rem; padding: 10px 14px; outline: none; transition: border-color 0.2s; }
  input:focus, select:focus, textarea:focus { border-color: #f0c040; }
  input.invalid { border-color: #a04020 !important; }
  select option { background: #1c3826; }

  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
  .form-group { margin-bottom: 16px; }

  .btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 10px 22px; border-radius: 10px; border: none; font-family: 'Lato', sans-serif; font-size: 0.88rem; font-weight: 700; letter-spacing: 0.07em; text-transform: uppercase; cursor: pointer; transition: all 0.18s; }
  .btn-primary { background: linear-gradient(135deg, #f0c040, #d4a020); color: #0d2418; width: 100%; padding: 14px; font-size: 1rem; box-shadow: 0 4px 16px rgba(240,192,64,0.3); }
  .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(240,192,64,0.4); }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  .btn-secondary { background: transparent; border: 1px solid #2d5238; color: #7aad8a; }
  .btn-secondary:hover { border-color: #7aad8a; color: #e8dfc8; }
  .btn-danger { background: transparent; border: 1px solid #5a2020; color: #c06060; }
  .btn-danger:hover { background: #3a1515; border-color: #c06060; }
  .btn-ghost { background: transparent; border: 1px solid #2d5238; color: #7aad8a; font-size: 0.72rem; padding: 4px 10px; border-radius: 6px; cursor: pointer; font-family: 'DM Mono', monospace; transition: all 0.15s; white-space: nowrap; }
  .btn-ghost:hover { border-color: #f0c040; color: #f0c040; }
  .btn-clone { background: rgba(240,192,64,0.08); border: 1px solid rgba(240,192,64,0.3); color: #f0c040; }
  .btn-clone:hover { background: rgba(240,192,64,0.16); }

  .action-row { display: flex; gap: 10px; max-width: 600px; margin: 0 auto; flex-wrap: wrap; }
  .action-row .btn { flex: 1; min-width: 100px; }

  .tab-row { display: flex; gap: 4px; max-width: 600px; margin: 0 auto 20px; background: #0d2418; border-radius: 12px; padding: 4px; border: 1px solid #2d5238; }
  .tab { flex: 1; padding: 8px 4px; text-align: center; border-radius: 8px; cursor: pointer; font-size: 0.75rem; letter-spacing: 0.08em; text-transform: uppercase; transition: all 0.15s; font-family: 'DM Mono', monospace; color: #7aad8a; border: none; background: transparent; }
  .tab.active { background: #1c3826; color: #f0c040; }

  .error-bar { background: rgba(200,60,40,0.18); border: 1px solid #a04020; border-radius: 8px; padding: 10px 14px; color: #e08060; font-size: 0.82rem; margin-bottom: 16px; }
  .info-bar { background: rgba(61,122,80,0.15); border: 1px solid #2d5238; border-radius: 8px; padding: 8px 14px; color: #7aad8a; font-size: 0.8rem; margin-bottom: 12px; font-family: 'DM Mono', monospace; }
  .saving-bar { background: rgba(240,192,64,0.1); border: 1px solid rgba(240,192,64,0.3); border-radius: 8px; padding: 8px 14px; color: #f0c040; font-size: 0.78rem; font-family: 'DM Mono', monospace; margin-bottom: 12px; }
  .alert { background: #1a3020; border: 1px solid #2d5238; border-radius: 8px; padding: 10px 14px; font-size: 0.82rem; color: #7aad8a; margin-bottom: 16px; }
  .trump-diamond { color: #e84040; font-weight: 700; }

  /* Player selector */
  .player-slot { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
  .player-slot-num { width: 28px; height: 28px; border-radius: 50%; background: #f0c040; color: #0d2418; font-weight: 700; font-size: 0.8rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-family: 'DM Mono', monospace; }
  .player-slot select { flex: 1; }
  .player-slot .btn-ghost { flex-shrink: 0; }
  .new-player-row { display: flex; gap: 8px; margin-top: 8px; }
  .new-player-row input { flex: 1; }

  /* Scorecard */
  .scorecard-wrap { overflow-x: auto; }
  .scorecard { width: 100%; border-collapse: collapse; font-family: 'DM Mono', monospace; font-size: 0.8rem; }
  .scorecard th { background: #0d2418; padding: 10px 6px; text-align: center; font-size: 0.68rem; letter-spacing: 0.1em; text-transform: uppercase; color: #7aad8a; border-bottom: 1px solid #2d5238; }
  .scorecard th.player-col { color: #f0c040; }
  .scorecard td { padding: 8px 6px; text-align: center; border-bottom: 1px solid #1a3020; vertical-align: middle; }
  .scorecard tr:last-child td { border-bottom: none; }
  .round-label { font-size: 0.68rem; color: #7aad8a; }
  .round-emoji { font-size: 0.85rem; margin: 2px 0; }
  .total-row td { background: #0d2418; color: #f0c040; font-weight: 700; font-size: 0.9rem; border-top: 2px solid #2d5238; }

  /* Round entry */
  .round-entry-card { background: linear-gradient(135deg, #1c3826 0%, #162d1e 100%); border: 1px solid #2d5238; border-radius: 16px; padding: 24px; max-width: 600px; margin: 0 auto 24px; box-shadow: 0 8px 32px rgba(0,0,0,0.4); }
  .round-badge { font-family: 'Playfair Display', serif; font-size: 1.3rem; color: #f0c040; font-weight: 700; }
  .cards-badge { font-family: 'DM Mono', monospace; font-size: 0.72rem; color: #7aad8a; background: #0d2418; border: 1px solid #2d5238; padding: 3px 10px; border-radius: 20px; margin-top: 4px; display: inline-block; }
  .player-entry-row { background: #0d2418; border: 1px solid #2d5238; border-radius: 10px; padding: 12px 14px; margin-bottom: 8px; display: grid; grid-template-columns: 1fr auto auto; align-items: center; gap: 10px; }
  .player-entry-row.bid-met { border-color: #3d7a50; }
  .player-name-label { font-weight: 700; color: #e8dfc8; font-size: 0.9rem; }
  .player-bid-info { font-family: 'DM Mono', monospace; font-size: 0.7rem; color: #7aad8a; margin-top: 2px; }
  .checkbox-wrap { display: flex; flex-direction: column; align-items: center; gap: 3px; }
  .checkbox-label { font-size: 0.6rem; color: #7aad8a; letter-spacing: 0.1em; text-transform: uppercase; }
  .custom-checkbox { width: 26px; height: 26px; border-radius: 6px; border: 2px solid #2d5238; background: #162d1e; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; font-size: 1rem; font-weight: 700; color: #e8dfc8; }
  .custom-checkbox.checked { background: #3d7a50; border-color: #5aad6e; }
  .hands-wrap { display: flex; flex-direction: column; align-items: center; gap: 3px; }
  .hands-input { width: 54px !important; text-align: center; padding: 7px 4px !important; font-family: 'DM Mono', monospace !important; font-size: 1rem !important; }
  .score-preview { font-family: 'DM Mono', monospace; font-size: 0.82rem; color: #f0c040; min-width: 36px; text-align: right; }
  .tally-bar { display: flex; align-items: center; justify-content: space-between; padding: 9px 14px; border-radius: 10px; margin-bottom: 12px; font-family: 'DM Mono', monospace; font-size: 0.8rem; border: 1px solid; }
  .tally-bar.ok { background: rgba(61,122,80,0.18); border-color: #3d7a50; color: #7aad8a; }
  .tally-bar.warn { background: rgba(200,80,40,0.14); border-color: #a04020; color: #e08060; }
  .tally-bar.neutral { background: rgba(13,36,24,0.6); border-color: #2d5238; color: #7aad8a; }
  .tally-num { font-size: 1rem; font-weight: 500; }

  /* Summary */
  .winner-banner { text-align: center; padding: 28px 24px; background: linear-gradient(135deg, #1c3826, #162d1e); border: 2px solid #f0c040; border-radius: 20px; max-width: 600px; margin: 0 auto 24px; }
  .winner-banner .trophy { font-size: 3rem; display: block; margin-bottom: 10px; }
  .winner-banner h2 { font-family: 'Playfair Display', serif; font-size: 1.8rem; color: #f0c040; }
  .winner-banner p { color: #7aad8a; margin-top: 6px; font-size: 0.88rem; }

  /* Game history list */
  .game-list { display: flex; flex-direction: column; gap: 10px; }
  .game-item { background: #0d2418; border: 1px solid #2d5238; border-radius: 10px; padding: 14px 16px; }
  .game-item:hover { border-color: #3d7a50; }
  .game-item-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
  .game-item-title { font-family: 'Playfair Display', serif; font-size: 1rem; color: #f0c040; cursor: pointer; }
  .game-item-title:hover { text-decoration: underline; }
  .game-item-meta { font-family: 'DM Mono', monospace; font-size: 0.7rem; color: #7aad8a; margin-top: 3px; }
  .game-item-actions { display: flex; gap: 6px; flex-shrink: 0; flex-wrap: wrap; justify-content: flex-end; }
  .badge { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 0.62rem; font-family: 'DM Mono', monospace; letter-spacing: 0.08em; text-transform: uppercase; margin-top: 4px; }
  .badge-progress { background: rgba(240,192,64,0.15); color: #f0c040; border: 1px solid rgba(240,192,64,0.3); }
  .badge-done { background: rgba(61,122,80,0.2); color: #7aad8a; border: 1px solid #2d5238; }

  /* Modal */
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.75); z-index: 100; display: flex; align-items: flex-start; justify-content: center; padding: 24px 16px 48px; overflow-y: auto; }
  .modal-box { background: linear-gradient(135deg, #1c3826 0%, #0f2218 100%); border: 1px solid #3d7a50; border-radius: 18px; padding: 28px 24px; width: 100%; max-width: 600px; box-shadow: 0 16px 64px rgba(0,0,0,0.7); margin-top: 8px; }
  .modal-title { font-family: 'Playfair Display', serif; font-size: 1.3rem; color: #f0c040; margin-bottom: 4px; }
  .modal-subtitle { font-family: 'DM Mono', monospace; font-size: 0.73rem; color: #7aad8a; margin-bottom: 18px; }
  .modal-actions { display: flex; gap: 10px; margin-top: 16px; }
  .modal-actions .btn { flex: 1; }

  /* Player management */
  .player-card { background: #0d2418; border: 1px solid #2d5238; border-radius: 10px; padding: 14px 16px; display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 8px; }
  .player-card:hover { border-color: #3d7a50; }
  .player-card-name { font-family: 'Playfair Display', serif; font-size: 1rem; color: #f0c040; cursor: pointer; }
  .player-card-name:hover { text-decoration: underline; }
  .player-card-stats { font-family: 'DM Mono', monospace; font-size: 0.7rem; color: #7aad8a; margin-top: 3px; }
  .player-card-actions { display: flex; gap: 6px; flex-shrink: 0; }

  /* Stats page */
  .stat-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 20px; }
  .stat-box { background: #0d2418; border: 1px solid #2d5238; border-radius: 10px; padding: 16px; text-align: center; }
  .stat-value { font-family: 'Playfair Display', serif; font-size: 2rem; color: #f0c040; font-weight: 700; }
  .stat-label { font-family: 'DM Mono', monospace; font-size: 0.68rem; color: #7aad8a; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 4px; }

  /* Rules page */
  .rules-content { line-height: 1.7; }
  .rules-content h3 { font-family: 'Playfair Display', serif; color: #f0c040; font-size: 1.1rem; margin: 20px 0 8px; }
  .rules-content p { color: #c8b878; font-size: 0.9rem; margin-bottom: 10px; }
  .rules-content ul { color: #c8b878; font-size: 0.9rem; padding-left: 20px; margin-bottom: 10px; }
  .rules-content ul li { margin-bottom: 6px; }
  .rules-content .highlight { color: #f0c040; font-weight: 700; }

  /* Permalink */
  .permalink-row { display: flex; align-items: center; gap: 8px; background: #0d2418; border: 1px solid #2d5238; border-radius: 8px; padding: 8px 12px; margin-top: 12px; }
  .permalink-url { font-family: 'DM Mono', monospace; font-size: 0.72rem; color: #7aad8a; flex: 1; word-break: break-all; }
  .permalink-copy { background: transparent; border: 1px solid #2d5238; color: #7aad8a; border-radius: 6px; padding: 3px 8px; cursor: pointer; font-size: 0.68rem; font-family: 'DM Mono', monospace; transition: all 0.15s; white-space: nowrap; }
  .permalink-copy:hover { border-color: #f0c040; color: #f0c040; }

  .back-link { display: inline-flex; align-items: center; gap: 6px; color: #7aad8a; font-size: 0.8rem; font-family: 'DM Mono', monospace; cursor: pointer; margin-bottom: 16px; text-decoration: none; background: transparent; border: none; padding: 0; }
  .back-link:hover { color: #f0c040; }

  .page-title { font-family: 'Playfair Display', serif; font-size: 1.6rem; color: #f0c040; max-width: 600px; margin: 0 auto 20px; }
  .section-label { font-family: 'DM Mono', monospace; font-size: 0.7rem; color: #7aad8a; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 10px; }

  .game-link { color: #7aad8a; text-decoration: none; font-family: 'DM Mono', monospace; font-size: 0.78rem; cursor: pointer; }
  .game-link:hover { color: #f0c040; text-decoration: underline; }
  .player-link { color: #f0c040; text-decoration: none; cursor: pointer; font-family: 'Playfair Display', serif; }
  .player-link:hover { text-decoration: underline; }

  .btn-edit { background: transparent; border: 1px solid #2d5238; color: #7aad8a; font-size: 0.64rem; padding: 2px 8px; border-radius: 5px; cursor: pointer; font-family: 'DM Mono', monospace; transition: all 0.15s; display: inline-block; margin-top: 3px; }
  .btn-edit:hover { border-color: #f0c040; color: #f0c040; }
`;

// ─── Main App Shell ───────────────────────────────────────────────────────────
export default function App() {
  var route = useRoute();

  return (
    <>
      <style>{STYLES}</style>
      <div className="app">
        <Header route={route} />
        {renderRoute(route)}
      </div>
    </>
  );
}

function Header(props) {
  var route = props.route;
  return (
    <div className="header">
      <h1 onClick={function() { navigate("/"); }}>DIRT</h1>
      <p>Card Game Score Tracker</p>
      <div className="header-icons">
        <a className="icon-btn" title="Players" onClick={function(e) { e.preventDefault(); navigate("/players"); }} href="#/players">P</a>
        <a className="icon-btn" title="Rules" onClick={function(e) { e.preventDefault(); navigate("/rules"); }} href="#/rules">?</a>
      </div>
    </div>
  );
}

function renderRoute(route) {
  if (route === "/rules") return <RulesPage />;
  if (route === "/players") return <PlayersPage />;
  if (route.startsWith("/players/")) {
    var playerSlug = route.replace("/players/", "");
    return <PlayerStatsPage slug={playerSlug} />;
  }
  if (route.startsWith("/games/")) {
    var gameSlug = route.replace("/games/", "");
    return <GameViewPage slug={gameSlug} />;
  }
  return <HomePage />;
}

// ─── Permalink Component ──────────────────────────────────────────────────────
function Permalink(props) {
  var url = window.location.origin + window.location.pathname + "#" + props.path;
  var [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(url).then(function() {
      setCopied(true);
      setTimeout(function() { setCopied(false); }, 2000);
    });
  }
  return (
    <div className="permalink-row">
      <span className="permalink-url">{url}</span>
      <button className="permalink-copy" onClick={copy}>{copied ? "Copied!" : "Copy Link"}</button>
    </div>
  );
}

// ─── Rules Page ───────────────────────────────────────────────────────────────
function RulesPage() {
  return (
    <div className="card">
      <button className="back-link" onClick={function() { navigate("/"); }}>back to home</button>
      <h2>How to Play Dirt</h2>
      <div className="rules-content">
        <h3>Overview</h3>
        <p>Dirt is a card hand-taking game where players bid the number of hands they expect to take each round. Points are earned by accurately predicting and achieving your bid.</p>

        <h3>The Deck</h3>
        <p>Played with a standard 52-card deck (no jokers). Ace is high. <span className="highlight">Diamonds is always trump.</span></p>

        <h3>The Deal</h3>
        <p>For a game with N rounds, each player receives N cards in Round 1, N-1 in Round 2, and so on down to 1 card in the final round. Remaining cards form a discard pile and are not used.</p>

        <h3>Bidding</h3>
        <p>After the deal, each player bids the number of hands they believe they will win. Bidding starts left of the dealer and goes clockwise. A bid of zero is allowed.</p>

        <h3>Play</h3>
        <ul>
          <li>The player left of the dealer leads the first hand with any card.</li>
          <li>Going clockwise, players must follow suit if possible.</li>
          <li>If a player cannot follow suit, they may play any card including a trump (Diamond).</li>
          <li>The highest card in the led suit wins, unless a trump (Diamond) is played, in which case the highest trump wins.</li>
          <li>The hand winner leads the next hand.</li>
        </ul>

        <h3>Scoring</h3>
        <ul>
          <li><span className="highlight">Made your bid:</span> Bid + 10 points. (e.g. bid 3, win 3 = 13 pts)</li>
          <li><span className="highlight">Over your bid:</span> Only hands won, no bonus. (e.g. bid 3, win 4 = 4 pts)</li>
          <li><span className="highlight">Under your bid:</span> Only hands won, no bonus. (e.g. bid 3, win 2 = 2 pts)</li>
          <li><span className="highlight">Zero bid made:</span> 10 points.</li>
          <li><span className="highlight">Zero bid failed:</span> Only hands won. (e.g. bid 0, win 2 = 2 pts)</li>
        </ul>

        <h3>Winning</h3>
        <p>After all rounds are complete, the player with the highest total score wins the game.</p>

        <h3>Next Round</h3>
        <p>The player who started play in the previous round becomes the dealer for the next round.</p>
      </div>
    </div>
  );
}

// ─── Players Page ─────────────────────────────────────────────────────────────
function PlayersPage() {
  var [players, setPlayers] = useState([]);
  var [loading, setLoading] = useState(true);
  var [newName, setNewName] = useState("");
  var [error, setError] = useState(null);
  var [saving, setSaving] = useState(false);
  var [editId, setEditId] = useState(null);
  var [editName, setEditName] = useState("");

  useEffect(function() { load(); }, []);

  async function load() {
    setLoading(true);
    try { setPlayers(await apiFetch("/players")); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  async function addPlayer() {
    if (!newName.trim()) return;
    setError(null); setSaving(true);
    try {
      var p = await apiFetch("/players", { method: "POST", body: JSON.stringify({ name: newName.trim() }) });
      setPlayers(function(prev) { return prev.concat([p]).sort(function(a, b) { return a.name.localeCompare(b.name); }); });
      setNewName("");
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  }

  async function saveEdit() {
    if (!editName.trim()) return;
    setError(null); setSaving(true);
    try {
      var p = await apiFetch("/players/" + editId, { method: "PUT", body: JSON.stringify({ name: editName.trim() }) });
      setPlayers(function(prev) { return prev.map(function(x) { return x.id === editId ? p : x; }).sort(function(a, b) { return a.name.localeCompare(b.name); }); });
      setEditId(null); setEditName("");
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  }

  async function removePlayer(id) {
    if (!window.confirm("Delete this player? Their game history will remain.")) return;
    try {
      await apiFetch("/players/" + id, { method: "DELETE" });
      setPlayers(function(prev) { return prev.filter(function(p) { return p.id !== id; }); });
    } catch (e) { setError(e.message); }
  }

  return (
    <>
      <button className="back-link" style={{ maxWidth: 600, margin: "0 auto 12px", display: "flex" }} onClick={function() { navigate("/"); }}>back to home</button>
      <div className="card">
        <h2>Player Roster</h2>
        {error && <div className="error-bar">{error}</div>}
        {loading && <p className="section-label">Loading...</p>}

        {players.map(function(p) {
          return (
            <div key={p.id} className="player-card">
              <div>
                <div className="player-card-name" onClick={function() { navigate("/players/" + p.slug); }}>{p.name}</div>
                <div className="player-card-stats">View stats and game history</div>
              </div>
              <div className="player-card-actions">
                <button className="btn-ghost" onClick={function() { setEditId(p.id); setEditName(p.name); }}>Edit</button>
                <button className="btn-ghost" style={{ borderColor: "#5a2020", color: "#c06060" }} onClick={function() { removePlayer(p.id); }}>Del</button>
              </div>
            </div>
          );
        })}

        {editId && (
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <input type="text" value={editName} onChange={function(e) { setEditName(e.target.value); }} onKeyDown={function(e) { if (e.key === "Enter") saveEdit(); }} placeholder="New name..." />
            <button className="btn btn-secondary" style={{ width: "auto", padding: "8px 14px" }} onClick={saveEdit} disabled={saving}>Save</button>
            <button className="btn btn-ghost" onClick={function() { setEditId(null); }}>Cancel</button>
          </div>
        )}

        <div style={{ marginTop: 16 }}>
          <label>Add New Player</label>
          <div className="new-player-row">
            <input type="text" placeholder="Player name..." value={newName}
              onChange={function(e) { setNewName(e.target.value); }}
              onKeyDown={function(e) { if (e.key === "Enter") addPlayer(); }} />
            <button className="btn btn-secondary" style={{ width: "auto", padding: "8px 14px" }} onClick={addPlayer} disabled={saving || !newName.trim()}>Add</button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Player Stats Page ────────────────────────────────────────────────────────
function PlayerStatsPage(props) {
  var [data, setData] = useState(null);
  var [loading, setLoading] = useState(true);
  var [error, setError] = useState(null);

  useEffect(function() {
    setLoading(true);
    apiFetch("/players/" + props.slug)
      .then(function(d) { setData(d); setLoading(false); })
      .catch(function(e) { setError(e.message); setLoading(false); });
  }, [props.slug]);

  if (loading) return <div className="card"><p className="section-label">Loading...</p></div>;
  if (error || !data) return <div className="card"><div className="error-bar">{error || "Not found"}</div></div>;

  var s = data.stats;
  return (
    <>
      <button className="back-link" style={{ maxWidth: 600, margin: "0 auto 12px", display: "flex" }} onClick={function() { navigate("/players"); }}>back to players</button>
      <div className="card">
        <h2>{data.name}</h2>
        <Permalink path={"/players/" + data.slug} />

        <div className="stat-grid" style={{ marginTop: 16 }}>
          <div className="stat-box"><div className="stat-value">{s.games_played}</div><div className="stat-label">Games Played</div></div>
          <div className="stat-box"><div className="stat-value">{s.wins}</div><div className="stat-label">Wins</div></div>
          <div className="stat-box"><div className="stat-value">{s.losses}</div><div className="stat-label">Losses</div></div>
          <div className="stat-box"><div className="stat-value">{s.total_points}</div><div className="stat-label">Total Points</div></div>
        </div>

        {data.games_in_progress && data.games_in_progress.length > 0 && (
          <>
            <div className="section-label" style={{ marginTop: 8 }}>In Progress</div>
            {data.games_in_progress.map(function(g) {
              return (
                <div key={g.id} style={{ marginBottom: 6 }}>
                  <span className="game-link" onClick={function() { navigate("/games/" + g.slug); }}>{g.title}</span>
                  <span style={{ color: "#7aad8a", fontFamily: "DM Mono", fontSize: "0.68rem", marginLeft: 8 }}>{new Date(g.started_at).toLocaleDateString()}</span>
                </div>
              );
            })}
          </>
        )}

        {data.games && data.games.length > 0 && (
          <>
            <div className="section-label" style={{ marginTop: 16 }}>Completed Games</div>
            {data.games.map(function(g) {
              return (
                <div key={g.id} style={{ marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
                  <span className="game-link" onClick={function() { navigate("/games/" + g.slug); }}>{g.title}</span>
                  <span style={{ color: "#7aad8a", fontFamily: "DM Mono", fontSize: "0.68rem" }}>{new Date(g.started_at).toLocaleDateString()}</span>
                  {g.won && <span className="badge badge-done">Won</span>}
                </div>
              );
            })}
          </>
        )}

        {s.games_played === 0 && <p style={{ color: "#7aad8a", fontFamily: "DM Mono", fontSize: "0.82rem", marginTop: 12 }}>No completed games yet.</p>}
      </div>
    </>
  );
}

// ─── Game View Page (permalink) ───────────────────────────────────────────────
function GameViewPage(props) {
  var [game, setGame] = useState(null);
  var [loading, setLoading] = useState(true);
  var [error, setError] = useState(null);

  useEffect(function() {
    setLoading(true);
    apiFetch("/games/" + props.slug)
      .then(function(g) { setGame(g); setLoading(false); })
      .catch(function(e) { setError(e.message); setLoading(false); });
  }, [props.slug]);

  if (loading) return <div className="card"><p className="section-label">Loading...</p></div>;
  if (error || !game) return <div className="card"><div className="error-bar">{error || "Game not found"}</div></div>;

  var players = game.player_names || [];
  var rounds = game.rounds || [];

  function totalUpTo(pi, roundIdx) {
    return rounds.slice(0, roundIdx).reduce(function(s, r) { return s + (r.scores[pi] || 0); }, 0);
  }

  var finalTotals = players.map(function(_, pi) { return rounds.reduce(function(s, r) { return s + (r.scores[pi] || 0); }, 0); });
  var maxFinal = finalTotals.length ? Math.max.apply(null, finalTotals) : 0;
  var winnerIdx = finalTotals.indexOf(maxFinal);

  return (
    <>
      <button className="back-link" style={{ maxWidth: 600, margin: "0 auto 12px", display: "flex" }} onClick={function() { navigate("/"); }}>back to games</button>
      <div className="card">
        <h2>{game.title}</h2>
        <div className="section-label">
          {new Date(game.started_at).toLocaleString()} &bull; {game.num_players} players &bull; {game.num_rounds} rounds
          <span className={"badge " + (game.status === "completed" ? "badge-done" : "badge-progress")} style={{ marginLeft: 8 }}>
            {game.status === "completed" ? "Completed" : "In Progress"}
          </span>
        </div>
        <Permalink path={"/games/" + game.slug} />

        {game.status === "completed" && (
          <div style={{ marginTop: 16, padding: "12px 16px", background: "#0d2418", borderRadius: 10, border: "1px solid #f0c040", textAlign: "center" }}>
            <span style={{ fontFamily: "Playfair Display, serif", color: "#f0c040", fontSize: "1.1rem" }}>
              Winner: {players[winnerIdx]} with {maxFinal} pts
            </span>
          </div>
        )}

        {rounds.length > 0 && (
          <div className="scorecard-wrap" style={{ marginTop: 16 }}>
            <table className="scorecard">
              <thead>
                <tr>
                  <th>Round</th>
                  {players.map(function(n, i) { return <th key={i} className="player-col">{n}</th>; })}
                </tr>
              </thead>
              <tbody>
                {rounds.map(function(r, ri) {
                  var emojiLabel = r.emoji === "happy" ? ":-)" : r.emoji === "sad" ? ":-(" : "";
                  return (
                    <tr key={ri}>
                      <td>
                        <div className="round-label">{"R" + (ri + 1)}</div>
                        {emojiLabel ? <div className="round-emoji">{emojiLabel}</div> : null}
                      </td>
                      {r.scores.map(function(s, pi) {
                        return <td key={pi}><div style={{ color: "#e8dfc8" }}>{s}</div><div style={{ fontSize: "0.65rem", color: "#7aad8a" }}>{"= " + (totalUpTo(pi, ri) + s)}</div></td>;
                      })}
                    </tr>
                  );
                })}
                <tr className="total-row">
                  <td>Final</td>
                  {finalTotals.map(function(t, pi) {
                    return <td key={pi} style={{ color: t === maxFinal ? "#f0c040" : "#c8b878" }}>{t}{t === maxFinal ? " *" : ""}</td>;
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────
function HomePage() {
  var [tab, setTab] = useState("new");
  var [gameState, setGameState] = useState(null); // null = setup, else active game

  function startGame(state) { setGameState(state); }
  function endGame() { setGameState(null); setTab("history"); }
  function resetToSetup() { setGameState(null); setTab("new"); }

  if (gameState) {
    return <ActiveGame state={gameState} onEnd={endGame} onAbandon={resetToSetup} />;
  }

  return (
    <>
      <div className="tab-row">
        <button className={"tab" + (tab === "new" ? " active" : "")} onClick={function() { setTab("new"); }}>New Game</button>
        <button className={"tab" + (tab === "history" ? " active" : "")} onClick={function() { setTab("history"); }}>History</button>
      </div>
      {tab === "new" && <SetupForm onStart={startGame} />}
      {tab === "history" && <GameHistory onResume={startGame} />}
    </>
  );
}

// ─── Setup Form ───────────────────────────────────────────────────────────────
function SetupForm(props) {
  var [title, setTitle] = useState("");
  var [titleTouched, setTitleTouched] = useState(false);
  var [numRounds, setNumRounds] = useState(5);
  var [playerSlots, setPlayerSlots] = useState([null, null, null]); // array of player objects or null
  var [allPlayers, setAllPlayers] = useState([]);
  var [newPlayerName, setNewPlayerName] = useState("");
  var [error, setError] = useState(null);
  var [saving, setSaving] = useState(false);
  var [startedAt, setStartedAt] = useState(isoLocal(new Date()));
  var cloneData = props.cloneData;

  var numPlayers = playerSlots.length;
  var maxRounds = maxRoundsForPlayers(numPlayers);
  var roundOptions = [];
  for (var i = 1; i <= maxRounds; i++) roundOptions.push(i);

  useEffect(function() {
    apiFetch("/players").then(setAllPlayers).catch(function() {});
  }, []);

  useEffect(function() {
    if (cloneData) {
      setTitle(cloneData.title);
      setNumRounds(Math.min(cloneData.num_rounds, maxRoundsForPlayers(cloneData.num_players)));
      setPlayerSlots(cloneData.player_names.map(function(name) {
        return { id: cloneData.player_ids[cloneData.player_names.indexOf(name)], name: name };
      }));
      setStartedAt(isoLocal(new Date()));
    }
  }, []);

  function isoLocal(d) {
    var pad = function(n) { return String(n).padStart(2, "0"); };
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) + "T" + pad(d.getHours()) + ":" + pad(d.getMinutes());
  }

  function setSlotPlayer(idx, player) {
    setPlayerSlots(function(prev) { var n = prev.slice(); n[idx] = player; return n; });
  }

  function addSlot() {
    if (playerSlots.length < 10) setPlayerSlots(function(prev) { return prev.concat([null]); });
  }

  function removeSlot(idx) {
    if (playerSlots.length > 2) setPlayerSlots(function(prev) { return prev.filter(function(_, i) { return i !== idx; }); });
  }

  async function createNewPlayer() {
    if (!newPlayerName.trim()) return;
    setError(null);
    try {
      var p = await apiFetch("/players", { method: "POST", body: JSON.stringify({ name: newPlayerName.trim() }) });
      setAllPlayers(function(prev) { return prev.concat([p]).sort(function(a, b) { return a.name.localeCompare(b.name); }); });
      var emptyIdx = playerSlots.findIndex(function(s) { return !s; });
      if (emptyIdx >= 0) setSlotPlayer(emptyIdx, p);
      setNewPlayerName("");
    } catch (e) { setError(e.message); }
  }

  async function handleStart() {
    setTitleTouched(true);
    if (!title.trim()) { setError("Game name is required."); return; }
    var filledPlayers = playerSlots.filter(function(p) { return p; });
    if (filledPlayers.length < 2) { setError("At least 2 players are required."); return; }
    var uniqueIds = new Set(filledPlayers.map(function(p) { return p.id; }));
    if (uniqueIds.size < filledPlayers.length) { setError("Each player can only appear once."); return; }

    setError(null); setSaving(true);
    try {
      var game = await apiFetch("/games", {
        method: "POST",
        body: JSON.stringify({
          title: title.trim(),
          num_players: filledPlayers.length,
          num_rounds: numRounds,
          player_names: filledPlayers.map(function(p) { return p.name; }),
          player_ids: filledPlayers.map(function(p) { return p.id; }),
          started_at: new Date(startedAt).toISOString(),
        }),
      });
      props.onStart({
        game: game,
        players: filledPlayers,
        rounds: [],
        roundEntry: { roundIdx: 0, entries: blankEntries(filledPlayers.length) },
      });
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  }

  var usedIds = new Set(playerSlots.filter(Boolean).map(function(p) { return p.id; }));
  var effectiveRounds = Math.min(numRounds, maxRounds);

  return (
    <div className="card">
      <h2>New Game</h2>
      {error && <div className="error-bar">{error}</div>}

      <div className="form-group">
        <label>Game Name <span className="required-star">*</span></label>
        <input type="text" placeholder="Friday Night Dirt..." value={title}
          className={titleTouched && !title.trim() ? "invalid" : ""}
          onChange={function(e) { setTitle(e.target.value); setTitleTouched(true); }}
          onBlur={function() { setTitleTouched(true); }} />
        {titleTouched && !title.trim() && <div style={{ color: "#e08060", fontSize: "0.75rem", marginTop: 4 }}>Game name is required</div>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Rounds (max {maxRounds})</label>
          <select value={Math.min(numRounds, maxRounds)} onChange={function(e) { setNumRounds(Number(e.target.value)); }}>
            {roundOptions.map(function(n) { return <option key={n} value={n}>{n} Rounds</option>; })}
          </select>
        </div>
        <div className="form-group">
          <label>Start Date/Time</label>
          <input type="datetime-local" value={startedAt} onChange={function(e) { setStartedAt(e.target.value); }} />
        </div>
      </div>

      <div className="alert">
        <span className="trump-diamond">Diamonds</span> is always trump. Round 1: {effectiveRounds} cards, counting down to 1 card in the final round.
      </div>

      <label>Players ({numPlayers} selected, 2-10)</label>
      <div style={{ marginBottom: 8 }}>
        {playerSlots.map(function(player, idx) {
          return (
            <div key={idx} className="player-slot">
              <div className="player-slot-num">{idx + 1}</div>
              <select value={player ? player.id : ""} onChange={function(e) {
                var val = e.target.value;
                var found = allPlayers.find(function(p) { return String(p.id) === val; });
                setSlotPlayer(idx, found || null);
              }}>
                <option value="">-- Select player --</option>
                {allPlayers.map(function(p) {
                  var disabled = usedIds.has(p.id) && (!player || player.id !== p.id);
                  return <option key={p.id} value={p.id} disabled={disabled}>{p.name}{disabled ? " (in use)" : ""}</option>;
                })}
              </select>
              {playerSlots.length > 2 && (
                <button className="btn-ghost" style={{ borderColor: "#5a2020", color: "#c06060" }} onClick={function() { removeSlot(idx); }}>X</button>
              )}
            </div>
          );
        })}
        {playerSlots.length < 10 && (
          <button className="btn-ghost" style={{ marginTop: 4 }} onClick={addSlot}>+ Add Player Slot</button>
        )}
      </div>

      <div className="form-group">
        <label>Create New Player</label>
        <div className="new-player-row">
          <input type="text" placeholder="New player name..." value={newPlayerName}
            onChange={function(e) { setNewPlayerName(e.target.value); }}
            onKeyDown={function(e) { if (e.key === "Enter") createNewPlayer(); }} />
          <button className="btn btn-secondary" style={{ width: "auto", padding: "8px 14px" }} onClick={createNewPlayer} disabled={!newPlayerName.trim()}>Create</button>
        </div>
      </div>

      <button className="btn btn-primary" onClick={handleStart} disabled={saving}>
        {saving ? "Starting..." : "Deal the Cards"}
      </button>
    </div>
  );
}

function blankEntries(n) {
  return Array.from({ length: n }, function() { return { bid: "", handsWon: "", gotBid: false }; });
}

// ─── Game History ─────────────────────────────────────────────────────────────
function GameHistory(props) {
  var [games, setGames] = useState([]);
  var [loading, setLoading] = useState(true);
  var [error, setError] = useState(null);
  var [cloneTarget, setCloneTarget] = useState(null);

  useEffect(function() { load(); }, []);

  async function load() {
    setLoading(true);
    try { setGames(await apiFetch("/games")); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  async function resumeGame(g) {
    try {
      var data = await apiFetch("/games/" + g.id);
      var loaded = (data.rounds || []).map(function(r) { return { roundIdx: r.round_index, entries: r.entries, scores: r.scores, emoji: r.emoji }; });
      var pLen = data.num_players;
      props.onResume({
        game: data,
        players: (data.player_names || []).map(function(name, i) { return { id: (data.player_ids || [])[i], name: name }; }),
        rounds: loaded,
        roundEntry: data.status === "completed" ? null : { roundIdx: loaded.length, entries: blankEntries(pLen) },
        readOnly: data.status === "completed",
      });
    } catch (e) { setError(e.message); }
  }

  async function deleteGame(id) {
    if (!window.confirm("Delete this game?")) return;
    try {
      await apiFetch("/games/" + id, { method: "DELETE" });
      setGames(function(prev) { return prev.filter(function(g) { return g.id !== id; }); });
    } catch (e) { setError(e.message); }
  }

  function cloneGame(g) {
    var base = (g.title || "Game").replace(/\s+\(\d+\)$/, "");
    var nums = games.map(function(x) {
      var m = (x.title || "").match(new RegExp("^" + base.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\s+\\((\\d+)\\)$"));
      return m ? parseInt(m[1]) : (x.title === base ? 1 : 0);
    }).filter(Boolean);
    var next = nums.length ? Math.max.apply(null, nums) + 1 : 2;
    var newTitle = base + " (" + next + ")";
    setCloneTarget({
      title: newTitle,
      num_rounds: g.num_rounds,
      num_players: g.num_players,
      player_names: Array.isArray(g.player_names) ? g.player_names : JSON.parse(g.player_names || "[]"),
      player_ids: Array.isArray(g.player_ids) ? g.player_ids : JSON.parse(g.player_ids || "[]"),
    });
  }

  if (cloneTarget) {
    return <SetupForm cloneData={cloneTarget} onStart={props.onResume} />;
  }

  return (
    <div className="card">
      <h2>Game History</h2>
      {error && <div className="error-bar">{error}</div>}
      {loading && <p className="section-label">Loading...</p>}
      {!loading && games.length === 0 && <p style={{ color: "#7aad8a", fontFamily: "DM Mono", fontSize: "0.82rem" }}>No games yet. Start one!</p>}
      <div className="game-list">
        {games.map(function(g) {
          var pn = Array.isArray(g.player_names) ? g.player_names : JSON.parse(g.player_names || "[]");
          return (
            <div key={g.id} className="game-item">
              <div className="game-item-top">
                <div>
                  <div className="game-item-title" onClick={function() { navigate("/games/" + g.slug); }}>{g.title}</div>
                  <div className="game-item-meta">{pn.join(", ")}</div>
                  <div className="game-item-meta">{new Date(g.started_at).toLocaleString()} &bull; {g.num_rounds} rounds</div>
                  <span className={"badge " + (g.status === "completed" ? "badge-done" : "badge-progress")}>
                    {g.status === "completed" ? "Completed" : "In Progress"}
                  </span>
                </div>
                <div className="game-item-actions">
                  <button className="btn btn-clone btn-ghost" onClick={function() { cloneGame(g); }}>+ Clone</button>
                  <button className="btn-ghost" onClick={function() { resumeGame(g); }}>{g.status === "completed" ? "View" : "Resume"}</button>
                  <button className="btn-ghost" style={{ borderColor: "#5a2020", color: "#c06060" }} onClick={function() { deleteGame(g.id); }}>Del</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Active Game ──────────────────────────────────────────────────────────────
function ActiveGame(props) {
  var init = props.state;
  var [game, setGame] = useState(init.game);
  var [players, setPlayers] = useState(init.players);
  var [rounds, setRounds] = useState(init.rounds || []);
  var [roundEntry, setRoundEntry] = useState(init.roundEntry || null);
  var [editingRound, setEditingRound] = useState(null);
  var [saving, setSaving] = useState(false);
  var [error, setError] = useState(null);
  var [phase, setPhase] = useState(init.readOnly ? "summary" : "game");

  var numPlayers = players.length;
  var numRounds = game.num_rounds;

  function totalUpTo(pi, roundIdx) {
    return rounds.slice(0, roundIdx).reduce(function(s, r) { return s + (r.scores[pi] || 0); }, 0);
  }

  function cardsForRound(roundIdx) { return numRounds - roundIdx; }

  function applyChange(entries, pi, field, val) {
    return entries.map(function(e, i) {
      if (i !== pi) return e;
      var u = Object.assign({}, e); u[field] = val;
      if (field === "gotBid" && val === true) u.handsWon = u.bid !== "" ? u.bid : u.handsWon;
      return u;
    });
  }

  function updateEntry(pi, field, val) {
    setRoundEntry(function(p) { return Object.assign({}, p, { entries: applyChange(p.entries, pi, field, val) }); });
  }

  function updateEditEntry(pi, field, val) {
    setEditingRound(function(p) { return Object.assign({}, p, { entries: applyChange(p.entries, pi, field, val) }); });
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

  function isValid(entries, roundIdx) {
    return allFilled(entries) && handsTotal(entries) === cardsForRound(roundIdx);
  }

  function computeScores(entries) {
    return entries.map(function(e) {
      var bid = parseInt(e.bid, 10); var h = resolvedHands(e);
      if (isNaN(bid) || isNaN(h)) return 0;
      return calcScore(bid, h);
    });
  }

  function buildRound(roundIdx, entries) {
    var scores = computeScores(entries);
    var allGot = entries.every(function(e) { return e.gotBid; });
    var noneGot = entries.every(function(e) { return !e.gotBid; });
    return { roundIdx: roundIdx, entries: entries, scores: scores, emoji: allGot ? "happy" : noneGot ? "sad" : null };
  }

  async function submitRound() {
    setError(null); setSaving(true);
    var nr = buildRound(roundEntry.roundIdx, roundEntry.entries);
    try {
      await apiFetch("/games/" + game.id + "/rounds/" + roundEntry.roundIdx, {
        method: "PUT",
        body: JSON.stringify({ entries: nr.entries, scores: nr.scores, emoji: nr.emoji, cards_dealt: cardsForRound(roundEntry.roundIdx) }),
      });
      var nextIdx = roundEntry.roundIdx + 1;
      var isLast = nextIdx >= numRounds;
      if (isLast) await apiFetch("/games/" + game.id, { method: "PATCH", body: JSON.stringify({ status: "completed" }) });
      setRounds(function(prev) { return prev.concat([nr]); });
      if (isLast) { setPhase("summary"); setRoundEntry(null); }
      else setRoundEntry({ roundIdx: nextIdx, entries: blankEntries(numPlayers) });
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  }

  async function saveEditRound() {
    setError(null); setSaving(true);
    var ri = editingRound.roundIdx; var entries = editingRound.entries;
    var updated = buildRound(ri, entries);
    try {
      await apiFetch("/games/" + game.id + "/rounds/" + ri, {
        method: "PUT",
        body: JSON.stringify({ entries: updated.entries, scores: updated.scores, emoji: updated.emoji, cards_dealt: cardsForRound(ri) }),
      });
      setRounds(function(prev) { return prev.map(function(r, idx) { return idx === ri ? updated : r; }); });
      setEditingRound(null);
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  }

  function openEdit(ri) {
    setEditingRound({ roundIdx: ri, entries: rounds[ri].entries.map(function(e) { return Object.assign({}, e); }) });
  }

  var finalTotals = players.map(function(_, pi) { return rounds.reduce(function(s, r) { return s + (r.scores[pi] || 0); }, 0); });
  var maxFinal = finalTotals.length ? Math.max.apply(null, finalTotals) : 0;
  var winnerName = players[finalTotals.indexOf(maxFinal)] ? players[finalTotals.indexOf(maxFinal)].name : "";

  function TallyBar(p) {
    var cards = cardsForRound(p.roundIdx);
    var total = handsTotal(p.entries);
    var filled = allFilled(p.entries);
    var isOk = filled && total === cards;
    var isOver = filled && total > cards;
    var isUnder = filled && total < cards;
    var cls = "neutral"; var msg = "Enter all bids and hands won";
    if (isOk) { cls = "ok"; msg = "Hands check out!"; }
    else if (isOver) { cls = "warn"; msg = (total - cards) + " too many - must equal " + cards; }
    else if (isUnder && filled) { cls = "warn"; msg = (cards - total) + " short - must equal " + cards; }
    return <div className={"tally-bar " + cls}><span>{msg}</span><span className="tally-num">{total} / {cards}</span></div>;
  }

  function PlayerRow(p) {
    var e = p.entry; var pi = p.pi; var ri = p.roundIdx; var onChange = p.onChange;
    var bid = parseInt(e.bid, 10);
    var hw = e.gotBid ? bid : parseInt(e.handsWon, 10);
    var preview = !isNaN(bid) && !isNaN(hw) ? calcScore(bid, hw) : "-";
    var cards = cardsForRound(ri);
    var playerName = players[pi] ? players[pi].name : ("Player " + (pi + 1));
    return (
      <div className={"player-entry-row" + (e.gotBid ? " bid-met" : "")}>
        <div>
          <div className="player-name-label">{playerName}</div>
          <div className="player-bid-info">{"Running: " + totalUpTo(pi, ri) + " pts" + (!isNaN(bid) ? " - Bid: " + bid : "")}</div>
          <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
            <div style={{ flex: 1 }}>
              <div className="checkbox-label" style={{ marginBottom: 3 }}>Bid</div>
              <input type="number" min="0" max={cards} className="hands-input" style={{ width: "100%" }} value={e.bid} onChange={function(ev) { onChange(pi, "bid", ev.target.value); }} />
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

  function ScoreTable(p) {
    var isFinal = p.isFinal;
    return (
      <div className="scorecard-wrap">
        <table className="scorecard">
          <thead>
            <tr>
              <th>Round</th>
              {players.map(function(pl, i) {
                return (
                  <th key={i} className="player-col">
                    {pl.slug ? <span className="player-link" onClick={function() { navigate("/players/" + pl.slug); }}>{pl.name}</span> : pl.name}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rounds.map(function(r, ri) {
              var emojiLabel = r.emoji === "happy" ? ":-)" : r.emoji === "sad" ? ":-(" : "";
              return (
                <tr key={ri}>
                  <td>
                    <div className="round-label">{"R" + (ri + 1)}</div>
                    {emojiLabel ? <div className="round-emoji">{emojiLabel}</div> : null}
                    {!p.readOnly && <button className="btn-edit" onClick={function() { openEdit(ri); }}>edit</button>}
                  </td>
                  {r.scores.map(function(s, pi) {
                    return <td key={pi}><div style={{ color: "#e8dfc8" }}>{s}</div><div style={{ fontSize: "0.65rem", color: "#7aad8a" }}>{"= " + (totalUpTo(pi, ri) + s)}</div></td>;
                  })}
                </tr>
              );
            })}
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
      {error && <div className="error-bar" style={{ maxWidth: 600, margin: "0 auto 16px" }}>{error}</div>}
      {saving && <div className="saving-bar" style={{ maxWidth: 600, margin: "0 auto 12px" }}>Saving...</div>}

      {phase === "summary" && (
        <>
          <div className="winner-banner">
            <span className="trophy">&#127942;</span>
            <h2>{winnerName}</h2>
            <p>{"Wins with " + maxFinal + " points!"}</p>
          </div>
        </>
      )}

      {rounds.length > 0 && (
        <div className="card">
          <h2>{phase === "summary" ? "Final Scorecard" : "Scorecard"}{game.title ? " - " + game.title : ""}</h2>
          <div className="section-label" style={{ marginBottom: 8 }}>{new Date(game.started_at).toLocaleString()}</div>
          <Permalink path={"/games/" + game.slug} />
          <div style={{ marginTop: 12 }}><ScoreTable isFinal={phase === "summary"} readOnly={phase === "summary"} /></div>
        </div>
      )}

      {phase === "game" && roundEntry && (
        <div className="round-entry-card">
          <div style={{ marginBottom: 16 }}>
            <div className="round-badge">{"Round " + (roundEntry.roundIdx + 1)}</div>
            <div className="cards-badge">{cardsForRound(roundEntry.roundIdx) + " cards each"}</div>
          </div>
          {roundEntry.entries.map(function(entry, pi) {
            return <PlayerRow key={pi} entry={entry} pi={pi} roundIdx={roundEntry.roundIdx} onChange={updateEntry} />;
          })}
          <TallyBar entries={roundEntry.entries} roundIdx={roundEntry.roundIdx} />
          <button className="btn btn-primary" onClick={submitRound} disabled={!isValid(roundEntry.entries, roundEntry.roundIdx) || saving}>
            {saving ? "Saving..." : (roundEntry.roundIdx + 1 >= numRounds ? "Finish Game" : "Submit Round " + (roundEntry.roundIdx + 1))}
          </button>
        </div>
      )}

      <div className="action-row" style={{ marginTop: 8 }}>
        {phase === "summary" && (
          <button className="btn btn-secondary" onClick={function() {
            var pn = players.map(function(p) { return p.name; });
            var pi = players.map(function(p) { return p.id; });
            props.onEnd({ cloneData: { title: game.title, num_rounds: numRounds, num_players: numPlayers, player_names: pn, player_ids: pi } });
          }}>Rematch</button>
        )}
        <button className="btn btn-danger" onClick={props.onAbandon}>New Game</button>
      </div>

      {editingRound && (
        <div className="modal-overlay" onClick={function(e) { if (e.target === e.currentTarget) setEditingRound(null); }}>
          <div className="modal-box">
            <div className="modal-title">{"Edit Round " + (editingRound.roundIdx + 1)}</div>
            <div className="modal-subtitle">{cardsForRound(editingRound.roundIdx) + " cards dealt"}</div>
            {error && <div className="error-bar">{error}</div>}
            {editingRound.entries.map(function(entry, pi) {
              return <PlayerRow key={pi} entry={entry} pi={pi} roundIdx={editingRound.roundIdx} onChange={updateEditEntry} />;
            })}
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
    </>
  );
}
