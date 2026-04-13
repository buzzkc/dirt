export const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Mono:wght@400;500&family=Lato:wght@300;400;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── Dark theme (default) ──────────────────────────────────────────── */
  :root {
    --bg-page:        #0d2418;
    --bg-app:         radial-gradient(ellipse at 50% 0%, #1a3d28 0%, #0a1c12 60%);
    --bg-card:        linear-gradient(135deg, #1c3826 0%, #162d1e 100%);
    --bg-inset:       #0d2418;
    --bg-round-entry: linear-gradient(135deg, #1c3826 0%, #162d1e 100%);
    --bg-modal:       linear-gradient(135deg, #1c3826 0%, #0f2218 100%);
    --bg-player-row:  #0d2418;
    --bg-checkbox:    #162d1e;
    --bg-total-row:   #0d2418;
    --bg-tab-bar:     #0d2418;
    --bg-active-tab:  #1c3826;
    --bg-winner:      linear-gradient(135deg, #1c3826, #162d1e);
    --bg-alert:       #1a3020;
    --border:         #2d5238;
    --border-modal:   #3d7a50;
    --border-met:     #3d7a50;
    --border-met-chk: #5aad6e;
    --text-primary:   #e8dfc8;
    --text-secondary: #7aad8a;
    --text-muted:     #5a8a6a;
    --text-subheading:#c8b878;
    --gold:           #f0c040;
    --gold-dim:       rgba(240,192,64,0.08);
    --gold-shadow:    rgba(240,192,64,0.2);
    --green-dim:      rgba(61,122,80,0.18);
    --red-border:     #5a2020;
    --red-text:       #c06060;
    --red-bg:         #3a1515;
    --red-warn-bg:    rgba(200,80,40,0.14);
    --red-warn-border:#a04020;
    --red-warn-text:  #e08060;
    --trump-red:      #e84040;
    --winner-border:  #f0c040;
    --card-shadow:    0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05);
    --modal-shadow:   0 16px 64px rgba(0,0,0,0.7);
    --header-title-shadow: 0 2px 24px rgba(240,192,64,0.35), 0 0 48px rgba(240,192,64,0.12);
    --btn-primary-bg: linear-gradient(135deg, #f0c040, #d4a020);
    --btn-primary-color: #0d2418;
    --btn-primary-shadow: 0 4px 16px rgba(240,192,64,0.3);
    --score-sub:      #7aad8a;
    --divider:        #2d5238;
  }

  /* ── Light theme ───────────────────────────────────────────────────── */
  .light {
    --bg-page:        #e8e0d0;
    --bg-app:         radial-gradient(ellipse at 50% 0%, #f0ebe0 0%, #e0d8c8 60%);
    --bg-card:        linear-gradient(135deg, #f5f0e8 0%, #ede8dc 100%);
    --bg-inset:       #e8e0d0;
    --bg-round-entry: linear-gradient(135deg, #f5f0e8 0%, #ede8dc 100%);
    --bg-modal:       linear-gradient(135deg, #f5f0e8 0%, #ede8dc 100%);
    --bg-player-row:  #ede8dc;
    --bg-checkbox:    #ddd8cc;
    --bg-total-row:   #e0d8c8;
    --bg-tab-bar:     #ddd8cc;
    --bg-active-tab:  #f5f0e8;
    --bg-winner:      linear-gradient(135deg, #f5f0e8, #ede8dc);
    --bg-alert:       #e8e4d8;
    --border:         #b8a888;
    --border-modal:   #8a7a5a;
    --border-met:     #6a9a7a;
    --border-met-chk: #4a8a6a;
    --text-primary:   #2a2018;
    --text-secondary: #4a6a3a;
    --text-muted:     #7a6a4a;
    --text-subheading:#6a5a3a;
    --gold:           #8a6a00;
    --gold-dim:       rgba(138,106,0,0.08);
    --gold-shadow:    rgba(138,106,0,0.2);
    --green-dim:      rgba(74,138,106,0.12);
    --red-border:     #c09080;
    --red-text:       #a04030;
    --red-bg:         #f0e0da;
    --red-warn-bg:    rgba(180,60,30,0.08);
    --red-warn-border:#c07060;
    --red-warn-text:  #a04030;
    --trump-red:      #c02020;
    --winner-border:  #8a6a00;
    --card-shadow:    0 4px 16px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6);
    --modal-shadow:   0 8px 32px rgba(0,0,0,0.2);
    --header-title-shadow: 0 2px 12px rgba(138,106,0,0.2);
    --btn-primary-bg: linear-gradient(135deg, #b88a00, #9a7000);
    --btn-primary-color: #fff8ee;
    --btn-primary-shadow: 0 4px 16px rgba(138,106,0,0.25);
    --score-sub:      #4a6a3a;
    --divider:        #c0b090;
  }

  body { background: var(--bg-page); min-height: 100vh; font-family: 'Lato', sans-serif; transition: background 0.3s; }

  .app {
    min-height: 100vh;
    background: var(--bg-app);
    color: var(--text-primary);
    padding: 24px 16px 48px;
    transition: background 0.3s, color 0.3s;
  }

  /* ── Header ───────────────────────────────────────────────────────── */
  .header { text-align: center; margin-bottom: 32px; position: relative; }
  .header h1 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2.4rem, 8vw, 4rem);
    font-weight: 900; letter-spacing: 0.12em;
    color: var(--gold);
    text-shadow: var(--header-title-shadow);
    cursor: pointer;
  }
  .header p { font-size: 0.85rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--text-secondary); margin-top: 4px; }
  .header-nav { display: flex; justify-content: flex-end; gap: 8px; margin-bottom: 8px; align-items: center; }
  .nav-icon-btn {
    background: transparent; border: 1px solid var(--border); border-radius: 8px;
    color: var(--text-secondary); font-size: 0.75rem; font-family: 'DM Mono', monospace;
    letter-spacing: 0.08em; text-transform: uppercase; padding: 5px 12px; cursor: pointer; transition: all 0.15s;
  }
  .nav-icon-btn:hover, .nav-icon-btn.active { border-color: var(--gold); color: var(--gold); }
  .theme-toggle {
    background: transparent; border: 1px solid var(--border); border-radius: 8px;
    font-size: 1rem; padding: 4px 10px; cursor: pointer; transition: border-color 0.15s;
  }
  .theme-toggle:hover { border-color: var(--gold); }
  .page-back {
    display: block; margin: 0 auto 16px; max-width: 560px; width: 100%;
    background: transparent; border: 1px solid var(--border); border-radius: 8px;
    color: var(--text-secondary); font-size: 0.75rem; font-family: 'DM Mono', monospace;
    letter-spacing: 0.08em; text-transform: uppercase; padding: 6px 14px; cursor: pointer; transition: all 0.15s;
    text-align: left;
  }
  .page-back:hover { border-color: var(--gold); color: var(--gold); }

  /* ── Card ─────────────────────────────────────────────────────────── */
  .card {
    background: var(--bg-card); border: 1px solid var(--border);
    border-radius: 16px; padding: 28px;
    box-shadow: var(--card-shadow);
    max-width: 560px; margin: 0 auto 24px;
  }
  .card h2 { font-family: 'Playfair Display', serif; font-size: 1.3rem; color: var(--gold); margin-bottom: 20px; }
  .card h3 { font-family: 'Playfair Display', serif; font-size: 1.05rem; color: var(--text-primary); margin-bottom: 10px; margin-top: 20px; }

  /* ── Forms ────────────────────────────────────────────────────────── */
  label { display: block; font-size: 0.75rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--text-secondary); margin-bottom: 6px; }
  .required-star { color: var(--trump-red); }
  input[type="text"], input[type="number"], input[type="password"], input[type="datetime-local"], select {
    width: 100%; background: var(--bg-inset); border: 1px solid var(--border);
    border-radius: 8px; color: var(--text-primary); font-family: 'Lato', sans-serif;
    font-size: 1rem; padding: 10px 14px; outline: none; transition: border-color 0.2s;
  }
  input:focus, select:focus { border-color: var(--gold); }
  input.input-error { border-color: var(--red-warn-border); }
  select option { background: var(--bg-card); }
  .form-group { margin-bottom: 16px; }
  .field-error { font-size: 0.75rem; color: var(--red-warn-text); margin-top: 4px; font-family: 'DM Mono', monospace; }
  .divider { border: none; border-top: 1px solid var(--divider); margin: 14px 0; }
  .inline-edit-row { display: flex; gap: 8px; align-items: center; }
  .inline-edit-row input { flex: 1; }

  /* ── Buttons ──────────────────────────────────────────────────────── */
  .btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    padding: 12px 28px; border-radius: 10px; border: none;
    font-family: 'Lato', sans-serif; font-size: 0.9rem; font-weight: 700;
    letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; transition: all 0.18s;
  }
  .btn-primary {
    background: var(--btn-primary-bg); color: var(--btn-primary-color);
    width: 100%; padding: 14px; font-size: 1rem; box-shadow: var(--btn-primary-shadow);
  }
  .btn-primary:hover { transform: translateY(-1px); }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  .btn-secondary {
    background: transparent; border: 1px solid var(--border);
    color: var(--text-secondary); font-size: 0.8rem; padding: 8px 16px;
  }
  .btn-secondary:hover { border-color: var(--text-secondary); color: var(--text-primary); }
  .btn-danger {
    background: transparent; border: 1px solid var(--red-border);
    color: var(--red-text); font-size: 0.8rem; padding: 8px 16px;
  }
  .btn-danger:hover { background: var(--red-bg); border-color: var(--red-text); }
  .btn-sm { font-size: 0.75rem !important; padding: 6px 12px !important; }
  .btn-edit {
    background: transparent; border: 1px solid var(--border); color: var(--text-secondary);
    font-size: 0.68rem; padding: 3px 9px; border-radius: 6px; cursor: pointer;
    font-family: 'DM Mono', monospace; letter-spacing: 0.08em; transition: all 0.15s;
    white-space: nowrap; margin-top: 4px; display: inline-block;
  }
  .btn-edit:hover { border-color: var(--gold); color: var(--gold); }
  .btn-link {
    background: none; border: none; color: var(--gold); cursor: pointer;
    font-family: inherit; font-size: inherit; padding: 0; text-decoration: underline;
  }
  .btn-clone {
    background: transparent; border: 1px solid var(--border); color: var(--text-secondary);
    font-size: 0.72rem; padding: 5px 10px; border-radius: 7px; cursor: pointer;
    font-family: 'DM Mono', monospace; transition: all 0.15s;
  }
  .btn-clone:hover { border-color: var(--gold); color: var(--gold); }

  /* ── Scorecard ────────────────────────────────────────────────────── */
  .scorecard-wrap { overflow-x: auto; }
  .scorecard { width: 100%; border-collapse: collapse; font-family: 'DM Mono', monospace; font-size: 0.82rem; }
  .scorecard th {
    background: var(--bg-inset); padding: 10px 8px; text-align: center;
    font-size: 0.7rem; letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--text-secondary); border-bottom: 1px solid var(--border);
  }
  .scorecard th.player-col { color: var(--gold); }
  .scorecard td { padding: 8px 6px; text-align: center; border-bottom: 1px solid var(--border); vertical-align: middle; }
  .scorecard tr:last-child td { border-bottom: none; }
  .round-label { font-size: 0.7rem; color: var(--text-secondary); letter-spacing: 0.1em; }
  .round-emoji { font-size: 1rem; display: block; margin: 2px 0; line-height: 1.2; }
  .total-row td { background: var(--bg-total-row); color: var(--gold); font-weight: 700; font-size: 0.9rem; border-top: 2px solid var(--border); }

  /* ── Round entry ──────────────────────────────────────────────────── */
  .round-entry-card {
    background: var(--bg-round-entry); border: 1px solid var(--border);
    border-radius: 16px; padding: 24px; max-width: 560px; margin: 0 auto 24px;
    box-shadow: var(--card-shadow);
  }
  .round-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
  .round-badge { font-family: 'Playfair Display', serif; font-size: 1.4rem; color: var(--gold); font-weight: 700; }
  .cards-badge {
    font-family: 'DM Mono', monospace; font-size: 0.75rem; color: var(--text-secondary);
    background: var(--bg-inset); border: 1px solid var(--border);
    padding: 4px 12px; border-radius: 20px; margin-top: 4px; display: inline-block;
  }

  /* ── Player entry row ─────────────────────────────────────────────── */
  .player-entry-row {
    background: var(--bg-player-row); border: 1px solid var(--border);
    border-radius: 10px; padding: 14px 16px; margin-bottom: 10px;
    display: block;
  }
  .player-entry-row.bid-met { border-color: var(--border-met); }
  .player-entry-row.round-leader { border-left: 3px solid var(--gold); }
  .player-name { font-weight: 700; color: var(--text-primary); font-size: 0.95rem; display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
  .dealer-badge {
    display: inline-block; font-size: 0.6rem; font-family: 'DM Mono', monospace;
    letter-spacing: 0.1em; text-transform: uppercase;
    background: rgba(122,173,138,0.12); border: 1px solid rgba(122,173,138,0.35);
    color: var(--text-secondary); border-radius: 4px; padding: 1px 6px; font-weight: 400;
  }
  .leads-badge {
    display: inline-block; font-size: 0.6rem; font-family: 'DM Mono', monospace;
    letter-spacing: 0.1em; text-transform: uppercase;
    background: var(--gold-dim); border: 1px solid var(--gold-shadow);
    color: var(--gold); border-radius: 4px; padding: 1px 6px; font-weight: 400;
  }
  .bids-progress {
    font-family: 'DM Mono', monospace; font-size: 0.75rem; color: var(--text-muted);
    text-align: center; margin-bottom: 8px; letter-spacing: 0.06em;
  }
  .player-bid-info { font-family: 'DM Mono', monospace; font-size: 0.72rem; color: var(--text-secondary); margin-top: 2px; }
  .checkbox-wrap { display: flex; flex-direction: column; align-items: center; gap: 4px; }
  .checkbox-label { font-size: 0.65rem; color: var(--text-secondary); letter-spacing: 0.1em; text-transform: uppercase; }
  .custom-checkbox {
    width: 28px; height: 28px; border-radius: 6px; border: 2px solid var(--border);
    background: var(--bg-checkbox); cursor: pointer; display: flex; align-items: center;
    justify-content: center; transition: all 0.15s; font-size: 1.1rem; font-weight: 700; color: var(--text-primary);
  }
  .custom-checkbox.checked { background: var(--border-met); border-color: var(--border-met-chk); }
  .custom-checkbox:hover { border-color: var(--text-secondary); }
  .hands-wrap { display: flex; flex-direction: column; align-items: center; gap: 4px; }
  .hands-input { width: 58px !important; text-align: center; padding: 8px 6px !important; font-family: 'DM Mono', monospace !important; font-size: 1rem !important; }
  .score-preview { font-family: 'DM Mono', monospace; font-size: 0.85rem; color: var(--gold); text-align: right; min-width: 40px; }

  /* ── Tally bar ────────────────────────────────────────────────────── */
  .tally-bar-wrap { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
  .bid-subtotal {
    display: flex; align-items: center; justify-content: space-between;
    padding: 7px 16px; border-radius: 10px;
    font-family: 'DM Mono', monospace; font-size: 0.82rem;
    background: var(--bg-inset); border: 1px solid var(--border); color: var(--text-secondary);
  }
  .bid-subtotal.bid-over  { border-color: var(--red-warn-border); color: var(--red-warn-text); background: var(--red-warn-bg); }
  .bid-subtotal.bid-under { border-color: var(--red-warn-border); color: var(--red-warn-text); background: var(--red-warn-bg); }
  .bid-subtotal.bid-exact { border-color: var(--border-met); color: var(--text-secondary); }
  .tally-bar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 16px; border-radius: 10px;
    font-family: 'DM Mono', monospace; font-size: 0.82rem; border: 1px solid; transition: all 0.2s;
  }
  .tally-bar.ok     { background: var(--green-dim);      border-color: var(--border-met);      color: var(--text-secondary); }
  .tally-bar.warn   { background: var(--red-warn-bg);    border-color: var(--red-warn-border);  color: var(--red-warn-text); }
  .tally-bar.neutral{ background: var(--bg-inset);       border-color: var(--border);           color: var(--text-secondary); }
  .tally-num { font-size: 1.05rem; font-weight: 500; }

  /* ── Action row ───────────────────────────────────────────────────── */
  .action-row { display: flex; gap: 10px; max-width: 560px; margin: 0 auto; }
  .action-row .btn { flex: 1; }

  /* ── Alert ────────────────────────────────────────────────────────── */
  .alert { background: var(--bg-alert); border: 1px solid var(--border); border-radius: 8px; padding: 10px 14px; font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 16px; }
  .trump-diamond { display: inline-block; color: var(--trump-red); font-weight: 700; }

  /* ── Winner banner ────────────────────────────────────────────────── */
  .winner-banner {
    text-align: center; padding: 32px 24px;
    background: var(--bg-winner); border: 2px solid var(--winner-border);
    border-radius: 20px; max-width: 560px; margin: 0 auto 24px;
  }
  .winner-banner .trophy { font-size: 3.5rem; display: block; margin-bottom: 12px; }
  .tie-names { font-family: 'Playfair Display', serif; font-size: 1.1rem; color: var(--gold); margin-top: 4px; font-weight: 700; }
  .winner-banner h2 { font-family: 'Playfair Display', serif; font-size: 2rem; color: var(--gold); }
  .winner-banner p { color: var(--text-secondary); margin-top: 6px; font-size: 0.9rem; }

  /* ── Modal ────────────────────────────────────────────────────────── */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.72); z-index: 100;
    display: flex; align-items: flex-start; justify-content: center;
    padding: 24px 16px 48px; overflow-y: auto;
  }
  .modal-box {
    background: var(--bg-modal); border: 1px solid var(--border-modal);
    border-radius: 18px; padding: 28px 24px; width: 100%; max-width: 560px;
    box-shadow: var(--modal-shadow); margin-top: 8px;
  }
  .modal-title { font-family: 'Playfair Display', serif; font-size: 1.35rem; color: var(--gold); margin-bottom: 4px; }
  .modal-subtitle { font-family: 'DM Mono', monospace; font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 20px; letter-spacing: 0.08em; }
  .modal-actions { display: flex; gap: 10px; margin-top: 16px; }
  .modal-actions .btn { flex: 1; }

  /* ── Game list ────────────────────────────────────────────────────── */
  .game-list { display: flex; flex-direction: column; gap: 10px; }
  .game-item {
    background: var(--bg-inset); border: 1px solid var(--border);
    border-radius: 10px; padding: 14px 16px;
    display: flex; align-items: center; gap: 12px;
  }
  .game-item:hover { border-color: var(--border-met); }
  .game-item-title { font-family: 'Playfair Display', serif; font-size: 1rem; color: var(--gold); cursor: pointer; }
  .game-item-title:hover { text-decoration: underline; }
  .game-item-meta { font-family: 'DM Mono', monospace; font-size: 0.72rem; color: var(--text-secondary); margin-top: 3px; }
  .game-item-actions { display: flex; gap: 8px; flex-shrink: 0; flex-direction: column; }
  .badge {
    display: inline-block; padding: 2px 8px; border-radius: 10px;
    font-size: 0.65rem; font-family: 'DM Mono', monospace; letter-spacing: 0.08em; text-transform: uppercase;
  }
  .badge-progress { background: var(--gold-dim); color: var(--gold); border: 1px solid var(--gold-shadow); }
  .badge-done { background: var(--green-dim); color: var(--text-secondary); border: 1px solid var(--border); }

  /* ── Tabs ─────────────────────────────────────────────────────────── */
  .tab-row {
    display: flex; gap: 4px; max-width: 560px; margin: 0 auto 20px;
    background: var(--bg-tab-bar); border-radius: 12px; padding: 4px; border: 1px solid var(--border);
  }
  .tab {
    flex: 1; padding: 8px; text-align: center; border-radius: 8px; cursor: pointer;
    font-size: 0.78rem; letter-spacing: 0.1em; text-transform: uppercase; transition: all 0.15s;
    font-family: 'DM Mono', monospace; color: var(--text-secondary); border: none; background: transparent;
  }
  .tab.active { background: var(--bg-active-tab); color: var(--gold); }

  /* ── Feedback bars ────────────────────────────────────────────────── */
  .error-bar { background: var(--red-warn-bg); border: 1px solid var(--red-warn-border); border-radius: 8px; padding: 10px 14px; color: var(--red-warn-text); font-size: 0.82rem; margin-bottom: 16px; }
  .saving-bar { background: var(--gold-dim); border: 1px solid var(--gold-shadow); border-radius: 8px; padding: 8px 14px; color: var(--gold); font-size: 0.78rem; font-family: 'DM Mono', monospace; margin-bottom: 12px; }
  .empty-state { font-family: 'DM Mono', monospace; font-size: 0.85rem; color: var(--text-muted); text-align: center; padding: 24px 0; }

  /* ── Player picker ────────────────────────────────────────────────── */
  .player-picker { margin-bottom: 8px; }
  .player-picker-list { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px; }
  .player-chip {
    display: inline-flex; align-items: center; gap: 6px;
    background: var(--bg-inset); border: 1px solid var(--border);
    border-radius: 20px; padding: 4px 12px; font-size: 0.82rem; color: var(--text-primary);
  }
  .player-chip.selected { border-color: var(--border-met); }
  .player-chip.clickable { cursor: pointer; color: var(--text-secondary); }
  .player-chip.clickable:hover { border-color: var(--gold); color: var(--gold); }
  .player-chip-remove { cursor: pointer; color: var(--text-muted); font-size: 1rem; line-height: 1; transition: color 0.15s; }
  .player-chip-remove:hover { color: var(--red-text); }
  .player-search { display: flex; gap: 8px; margin-bottom: 8px; }
  .player-search input { flex: 1; }
  .player-search-results { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px; }
  .player-order-hint { font-family: 'DM Mono', monospace; font-size: 0.7rem; color: var(--text-muted); margin-top: 4px; }

  /* ── Dup prompt ───────────────────────────────────────────────────── */
  .dup-prompt { background: var(--gold-dim); border: 1px solid var(--gold-shadow); border-radius: 10px; padding: 12px 14px; margin-bottom: 10px; }
  .dup-prompt-msg { font-size: 0.85rem; color: var(--text-primary); margin-bottom: 10px; line-height: 1.5; }
  .dup-prompt-actions { display: flex; gap: 8px; flex-wrap: wrap; }

  /* ── Permalink bar ────────────────────────────────────────────────── */
  .permalink-bar {
    display: flex; align-items: center; gap: 10px; max-width: 560px; margin: 0 auto 16px;
    background: var(--bg-inset); border: 1px solid var(--border); border-radius: 10px; padding: 8px 14px;
  }
  .permalink-url { font-family: 'DM Mono', monospace; font-size: 0.7rem; color: var(--text-muted); flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .permalink-copy { background: transparent; border: 1px solid var(--border); border-radius: 6px; color: var(--text-secondary); font-size: 0.7rem; font-family: 'DM Mono', monospace; padding: 3px 10px; cursor: pointer; white-space: nowrap; transition: all 0.15s; }
  .permalink-copy:hover, .permalink-copy.copied { border-color: var(--gold); color: var(--gold); }

  /* ── Player list (Players page) ───────────────────────────────────── */
  .player-list { display: flex; flex-direction: column; gap: 8px; }
  .player-item {
    display: flex; align-items: center; gap: 12px;
    background: var(--bg-inset); border: 1px solid var(--border);
    border-radius: 10px; padding: 12px 14px;
  }
  .player-item:hover { border-color: var(--border-met); }
  .player-item-name { font-weight: 700; color: var(--text-primary); font-size: 0.95rem; cursor: pointer; }
  .player-item-name:hover { color: var(--gold); }
  .player-item-meta { font-family: 'DM Mono', monospace; font-size: 0.72rem; color: var(--text-muted); margin-top: 2px; }

  /* ── Player inline stats ──────────────────────────────────────────── */
  .player-item-stats { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 4px; align-items: center; }
  .player-stat-chip { font-family: 'DM Mono', monospace; font-size: 0.78rem; color: var(--text-primary); font-weight: 500; }
  .player-stat-chip.win  { color: var(--gold); }
  .player-stat-chip.loss { color: var(--red-text); }
  .player-stat-label { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-muted); font-weight: 400; margin-left: 2px; }

  /* ── Stats grid (Player detail) ───────────────────────────────────── */
  .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 24px; }
  .stat-box { background: var(--bg-inset); border: 1px solid var(--border); border-radius: 10px; padding: 12px 8px; text-align: center; }
  .stat-value { font-family: 'Playfair Display', serif; font-size: 1.6rem; color: var(--gold); font-weight: 700; }
  .stat-label { font-family: 'DM Mono', monospace; font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; margin-top: 2px; }

  /* ── Emoji stats bar ──────────────────────────────────────────────── */
  .emoji-stats-bar { display: inline-flex; gap: 12px; align-items: center; margin-top: 8px; }
  .emoji-stat { display: inline-flex; align-items: center; gap: 4px; font-family: 'DM Mono', monospace; font-size: 0.82rem; }
  .emoji-stat-count { color: var(--text-secondary); }

  /* ── Rules page ───────────────────────────────────────────────────── */
  /* ── NumPad ──────────────────────────────────────────────────────────────── */
  .numpad-field-wrap { display: flex; flex-direction: column; align-items: center; gap: 4px; }
  .numpad-field-label { font-size: 0.65rem; color: var(--text-secondary); letter-spacing: 0.1em; text-transform: uppercase; }
  .numpad-display {
    width: 52px; height: 44px; border-radius: 8px;
    background: var(--bg-inset); border: 2px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    font-family: 'DM Mono', monospace; font-size: 1.3rem; font-weight: 600;
    color: var(--text-primary); cursor: pointer; transition: border-color 0.15s;
    user-select: none;
  }
  .numpad-display:hover { border-color: var(--text-secondary); }
  .numpad-display.active { border-color: var(--gold); box-shadow: 0 0 0 2px var(--gold-shadow); }
  .numpad-display.disabled { opacity: 0.4; cursor: default; }
  .numpad-placeholder { color: var(--text-muted); font-size: 1rem; }
  .numpad {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;
    margin-top: 12px; padding: 12px;
    background: var(--bg-inset); border: 1px solid var(--border);
    border-radius: 12px;
  }
  .numpad-key {
    height: 52px; border-radius: 10px; border: 1px solid var(--border);
    background: var(--bg-card); color: var(--text-primary);
    font-family: 'DM Mono', monospace; font-size: 1.2rem; font-weight: 500;
    cursor: pointer; transition: all 0.1s;
    display: flex; align-items: center; justify-content: center;
    user-select: none; -webkit-user-select: none;
  }
  .numpad-key:hover  { border-color: var(--text-secondary); background: var(--bg-round-entry); }
  .numpad-key:active { transform: scale(0.93); }
  .numpad-back  { color: var(--red-text); border-color: var(--red-border); }
  .numpad-back:hover  { background: var(--red-bg); }
  .numpad-enter {
    background: var(--btn-primary-bg); color: var(--btn-primary-color);
    border-color: transparent; font-size: 1.4rem;
    box-shadow: var(--btn-primary-shadow);
  }
  .numpad-enter:hover { opacity: 0.9; }

  .rules-section { margin-bottom: 20px; }
  .rules-section h3 { font-family: 'Playfair Display', serif; font-size: 1.05rem; color: var(--gold); margin-bottom: 8px; }
  .rules-section p { font-size: 0.9rem; color: var(--text-primary); line-height: 1.6; margin-bottom: 6px; }
  .rules-section ul { padding-left: 20px; }
  .rules-section li { font-size: 0.9rem; color: var(--text-primary); line-height: 1.7; }
`;
