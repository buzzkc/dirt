export const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Mono:wght@400;500&family=Lato:wght@300;400;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0d2418; min-height: 100vh; font-family: 'Lato', sans-serif; }

  .app { min-height: 100vh; background: radial-gradient(ellipse at 50% 0%, #1a3d28 0%, #0a1c12 60%); color: #e8dfc8; padding: 24px 16px 48px; }

  /* Header */
  .header { text-align: center; margin-bottom: 32px; position: relative; }
  .header h1 { font-family: 'Playfair Display', serif; font-size: clamp(2rem, 7vw, 3.6rem); font-weight: 900; letter-spacing: 0.12em; color: #f0c040; text-shadow: 0 2px 24px rgba(240,192,64,0.35); cursor: pointer; display: inline-block; }
  .header p { font-size: 0.8rem; letter-spacing: 0.2em; text-transform: uppercase; color: #7aad8a; margin-top: 4px; }
  .header-nav { position: absolute; right: 0; top: 0; display: flex; gap: 8px; align-items: flex-start; }
  .nav-icon-btn { background: transparent; border: 1px solid #2d5238; border-radius: 8px; color: #7aad8a; cursor: pointer; padding: 6px 10px; font-size: 0.82rem; font-family: 'DM Mono', monospace; transition: all 0.15s; white-space: nowrap; }
  .nav-icon-btn:hover { border-color: #f0c040; color: #f0c040; }
  .nav-icon-btn.active { border-color: #f0c040; color: #f0c040; background: rgba(240,192,64,0.08); }

  /* Cards */
  .card { background: linear-gradient(135deg, #1c3826 0%, #162d1e 100%); border: 1px solid #2d5238; border-radius: 16px; padding: 28px; box-shadow: 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05); max-width: 600px; margin: 0 auto 24px; }
  .card h2 { font-family: 'Playfair Display', serif; font-size: 1.3rem; color: #f0c040; margin-bottom: 20px; display: flex; align-items: center; gap: 8px; }
  .card h3 { font-family: 'Playfair Display', serif; font-size: 1.1rem; color: #e8dfc8; margin-bottom: 12px; }

  /* Forms */
  label { display: block; font-size: 0.75rem; letter-spacing: 0.15em; text-transform: uppercase; color: #7aad8a; margin-bottom: 6px; }
  input[type="text"], input[type="number"], input[type="datetime-local"], select { width: 100%; background: #0d2418; border: 1px solid #2d5238; border-radius: 8px; color: #e8dfc8; font-family: 'Lato', sans-serif; font-size: 1rem; padding: 10px 14px; outline: none; transition: border-color 0.2s; }
  input:focus, select:focus { border-color: #f0c040; }
  input.input-error { border-color: #a04020; }
  select option { background: #1c3826; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
  .form-group { margin-bottom: 16px; }
  .field-error { font-size: 0.72rem; color: #e08060; margin-top: 4px; font-family: 'DM Mono', monospace; }
  .required-star { color: #e08060; margin-left: 2px; }

  /* Buttons */
  .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 28px; border-radius: 10px; border: none; font-family: 'Lato', sans-serif; font-size: 0.9rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; transition: all 0.18s; }
  .btn-primary { background: linear-gradient(135deg, #f0c040, #d4a020); color: #0d2418; width: 100%; padding: 14px; font-size: 1rem; box-shadow: 0 4px 16px rgba(240,192,64,0.3); }
  .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(240,192,64,0.4); }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  .btn-secondary { background: transparent; border: 1px solid #2d5238; color: #7aad8a; font-size: 0.8rem; padding: 8px 16px; }
  .btn-secondary:hover { border-color: #7aad8a; color: #e8dfc8; }
  .btn-danger { background: transparent; border: 1px solid #5a2020; color: #c06060; font-size: 0.8rem; padding: 8px 16px; }
  .btn-danger:hover { background: #3a1515; border-color: #c06060; }
  .btn-sm { padding: 5px 12px; font-size: 0.75rem; border-radius: 7px; }
  .btn-edit { background: transparent; border: 1px solid #2d5238; color: #7aad8a; font-size: 0.68rem; padding: 3px 9px; border-radius: 6px; cursor: pointer; font-family: 'DM Mono', monospace; letter-spacing: 0.08em; transition: all 0.15s; white-space: nowrap; margin-top: 4px; display: inline-block; }
  .btn-edit:hover { border-color: #f0c040; color: #f0c040; }
  .btn-clone { background: transparent; border: 1px solid #2d5238; color: #7aad8a; font-size: 0.72rem; padding: 6px 12px; border-radius: 8px; cursor: pointer; font-family: 'Lato', sans-serif; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; transition: all 0.15s; white-space: nowrap; }
  .btn-clone:hover { border-color: #f0c040; color: #f0c040; background: rgba(240,192,64,0.07); }
  .btn-link { background: none; border: none; color: #7aad8a; cursor: pointer; font-family: 'DM Mono', monospace; font-size: 0.82rem; padding: 0; text-decoration: underline; transition: color 0.15s; }
  .btn-link:hover { color: #f0c040; }

  /* Tabs */
  .tab-row { display: flex; gap: 4px; max-width: 600px; margin: 0 auto 20px; background: #0d2418; border-radius: 12px; padding: 4px; border: 1px solid #2d5238; }
  .tab { flex: 1; padding: 8px; text-align: center; border-radius: 8px; cursor: pointer; font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase; transition: all 0.15s; font-family: 'DM Mono', monospace; color: #7aad8a; border: none; background: transparent; }
  .tab.active { background: #1c3826; color: #f0c040; }

  /* Alerts / Feedback */
  .alert { background: #1a3020; border: 1px solid #2d5238; border-radius: 8px; padding: 10px 14px; font-size: 0.82rem; color: #7aad8a; margin-bottom: 16px; }
  .trump-diamond { display: inline-block; color: #e84040; font-weight: 700; }
  .error-bar { background: rgba(200,60,40,0.18); border: 1px solid #a04020; border-radius: 8px; padding: 10px 14px; color: #e08060; font-size: 0.82rem; margin-bottom: 16px; }
  .saving-bar { background: rgba(240,192,64,0.1); border: 1px solid rgba(240,192,64,0.3); border-radius: 8px; padding: 8px 14px; color: #f0c040; font-size: 0.78rem; font-family: 'DM Mono', monospace; margin-bottom: 12px; }
  .success-bar { background: rgba(61,122,80,0.2); border: 1px solid #3d7a50; border-radius: 8px; padding: 10px 14px; color: #7aad8a; font-size: 0.82rem; margin-bottom: 16px; }

  /* Scorecard */
  .scorecard-wrap { overflow-x: auto; }
  .scorecard { width: 100%; border-collapse: collapse; font-family: 'DM Mono', monospace; font-size: 0.82rem; }
  .scorecard th { background: #0d2418; padding: 10px 8px; text-align: center; font-size: 0.7rem; letter-spacing: 0.12em; text-transform: uppercase; color: #7aad8a; border-bottom: 1px solid #2d5238; }
  .scorecard th.player-col { color: #f0c040; }
  .scorecard td { padding: 8px 6px; text-align: center; border-bottom: 1px solid #1a3020; vertical-align: middle; }
  .scorecard tr:last-child td { border-bottom: none; }
  .round-label { font-size: 0.7rem; color: #7aad8a; letter-spacing: 0.1em; }
  .round-emoji { font-size: 0.9rem; margin: 2px 0; }
  .total-row td { background: #0d2418; color: #f0c040; font-weight: 700; font-size: 0.9rem; border-top: 2px solid #2d5238; }

  /* Round entry */
  .round-entry-card { background: linear-gradient(135deg, #1c3826 0%, #162d1e 100%); border: 1px solid #2d5238; border-radius: 16px; padding: 24px; max-width: 600px; margin: 0 auto 24px; box-shadow: 0 8px 32px rgba(0,0,0,0.4); }
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

  /* Tally */
  .tally-bar { display: flex; align-items: center; justify-content: space-between; padding: 10px 16px; border-radius: 10px; margin-bottom: 14px; font-family: 'DM Mono', monospace; font-size: 0.82rem; border: 1px solid; transition: all 0.2s; }
  .tally-bar.ok { background: rgba(61,122,80,0.18); border-color: #3d7a50; color: #7aad8a; }
  .tally-bar.warn { background: rgba(200,80,40,0.14); border-color: #a04020; color: #e08060; }
  .tally-bar.neutral { background: rgba(13,36,24,0.6); border-color: #2d5238; color: #7aad8a; }
  .tally-num { font-size: 1.05rem; font-weight: 500; }

  /* Layout helpers */
  .action-row { display: flex; gap: 10px; max-width: 600px; margin: 0 auto; }
  .action-row .btn { flex: 1; }
  .divider { border: none; border-top: 1px solid #2d5238; margin: 20px 0; }

  /* Winner */
  .winner-banner { text-align: center; padding: 32px 24px; background: linear-gradient(135deg, #1c3826, #162d1e); border: 2px solid #f0c040; border-radius: 20px; max-width: 600px; margin: 0 auto 24px; }
  .winner-banner .trophy { font-size: 3.5rem; display: block; margin-bottom: 12px; }
  .winner-banner h2 { font-family: 'Playfair Display', serif; font-size: 2rem; color: #f0c040; }
  .winner-banner p { color: #7aad8a; margin-top: 6px; font-size: 0.9rem; }

  /* Modal */
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.72); z-index: 100; display: flex; align-items: flex-start; justify-content: center; padding: 24px 16px 48px; overflow-y: auto; }
  .modal-box { background: linear-gradient(135deg, #1c3826 0%, #0f2218 100%); border: 1px solid #3d7a50; border-radius: 18px; padding: 28px 24px; width: 100%; max-width: 600px; box-shadow: 0 16px 64px rgba(0,0,0,0.7); margin-top: 8px; }
  .modal-title { font-family: 'Playfair Display', serif; font-size: 1.35rem; color: #f0c040; margin-bottom: 4px; }
  .modal-subtitle { font-family: 'DM Mono', monospace; font-size: 0.75rem; color: #7aad8a; margin-bottom: 20px; letter-spacing: 0.08em; }
  .modal-actions { display: flex; gap: 10px; margin-top: 16px; }
  .modal-actions .btn { flex: 1; }

  /* Game list */
  .game-list { display: flex; flex-direction: column; gap: 10px; }
  .game-item { background: #0d2418; border: 1px solid #2d5238; border-radius: 10px; padding: 14px 16px; display: flex; align-items: center; justify-content: space-between; gap: 12px; transition: border-color 0.15s; }
  .game-item:hover { border-color: #3d7a50; }
  .game-item-title { font-family: 'Playfair Display', serif; font-size: 1rem; color: #f0c040; cursor: pointer; }
  .game-item-title:hover { text-decoration: underline; }
  .game-item-meta { font-family: 'DM Mono', monospace; font-size: 0.72rem; color: #7aad8a; margin-top: 3px; }
  .game-item-actions { display: flex; gap: 8px; flex-shrink: 0; flex-wrap: wrap; justify-content: flex-end; }
  .badge { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 0.65rem; font-family: 'DM Mono', monospace; letter-spacing: 0.08em; text-transform: uppercase; }
  .badge-progress { background: rgba(240,192,64,0.15); color: #f0c040; border: 1px solid rgba(240,192,64,0.3); }
  .badge-done { background: rgba(61,122,80,0.2); color: #7aad8a; border: 1px solid #2d5238; }

  /* Player picker */
  .player-picker { margin-bottom: 16px; }
  .player-picker-list { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 10px; min-height: 36px; }
  .player-chip { display: inline-flex; align-items: center; gap: 6px; background: #162d1e; border: 1px solid #2d5238; border-radius: 20px; padding: 4px 12px; font-size: 0.82rem; color: #e8dfc8; cursor: default; transition: border-color 0.15s; }
  .player-chip.selected { border-color: #3d7a50; background: rgba(61,122,80,0.18); }
  .player-chip.clickable { cursor: pointer; }
  .player-chip.clickable:hover { border-color: #f0c040; }
  .player-chip-remove { cursor: pointer; color: #7aad8a; font-size: 1rem; line-height: 1; transition: color 0.15s; }
  .player-chip-remove:hover { color: #c06060; }
  .player-search { display: flex; gap: 8px; margin-bottom: 8px; }
  .player-search input { flex: 1; }
  .player-search-results { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px; }
  .player-order-hint { font-family: 'DM Mono', monospace; font-size: 0.7rem; color: #5a8a6a; margin-top: 4px; }

  /* Player stats */
  .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 20px; }
  .stat-box { background: #0d2418; border: 1px solid #2d5238; border-radius: 10px; padding: 14px; text-align: center; }
  .stat-value { font-family: 'Playfair Display', serif; font-size: 2rem; color: #f0c040; font-weight: 700; }
  .stat-label { font-family: 'DM Mono', monospace; font-size: 0.7rem; color: #7aad8a; letter-spacing: 0.1em; text-transform: uppercase; margin-top: 4px; }

  /* Player list */
  .player-list { display: flex; flex-direction: column; gap: 8px; }
  .player-item { background: #0d2418; border: 1px solid #2d5238; border-radius: 10px; padding: 12px 16px; display: flex; align-items: center; justify-content: space-between; gap: 12px; cursor: pointer; transition: border-color 0.15s; }
  .player-item:hover { border-color: #f0c040; }
  .player-item-name { font-family: 'Playfair Display', serif; font-size: 1rem; color: #f0c040; }
  .player-item-meta { font-family: 'DM Mono', monospace; font-size: 0.7rem; color: #7aad8a; margin-top: 2px; }

  /* Permalink bar */
  .permalink-bar { background: #0d2418; border: 1px solid #2d5238; border-radius: 8px; padding: 8px 12px; display: flex; align-items: center; gap: 10px; margin-bottom: 16px; max-width: 600px; margin-left: auto; margin-right: auto; }
  .permalink-url { font-family: 'DM Mono', monospace; font-size: 0.72rem; color: #7aad8a; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .permalink-copy { background: transparent; border: 1px solid #2d5238; border-radius: 6px; color: #7aad8a; cursor: pointer; padding: 3px 10px; font-size: 0.7rem; font-family: 'DM Mono', monospace; transition: all 0.15s; white-space: nowrap; }
  .permalink-copy:hover { border-color: #f0c040; color: #f0c040; }
  .permalink-copy.copied { border-color: #3d7a50; color: #7aad8a; }

  /* Rules page */
  .rules-section { margin-bottom: 24px; }
  .rules-section h3 { font-family: 'Playfair Display', serif; color: #f0c040; font-size: 1.15rem; margin-bottom: 10px; }
  .rules-section p, .rules-section li { font-size: 0.9rem; line-height: 1.7; color: #c8bfa8; margin-bottom: 8px; }
  .rules-section ul { padding-left: 20px; }
  .rules-section ul li { margin-bottom: 6px; }

  /* Misc */
  .page-back { display: inline-flex; align-items: center; gap: 6px; color: #7aad8a; cursor: pointer; font-family: 'DM Mono', monospace; font-size: 0.8rem; margin-bottom: 20px; max-width: 600px; width: 100%; margin-left: auto; margin-right: auto; display: block; }
  .page-back:hover { color: #f0c040; }
  .empty-state { text-align: center; padding: 32px 16px; color: #5a8a6a; font-family: 'DM Mono', monospace; font-size: 0.85rem; }
  .inline-edit-row { display: flex; gap: 8px; align-items: center; }
  .inline-edit-row input { flex: 1; }
`;
