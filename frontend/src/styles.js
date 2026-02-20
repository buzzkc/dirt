export const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Mono:wght@400;500&family=Lato:wght@300;400;700&display=swap');

  /* ── Dark theme (default) ─────────────────────────────────────────── */
  :root {
    --bg-page:        #0d2418;
    --bg-app:         radial-gradient(ellipse at 50% 0%, #1a3d28 0%, #0a1c12 60%);
    --bg-card:        linear-gradient(135deg, #1c3826 0%, #162d1e 100%);
    --bg-card-alt:    linear-gradient(135deg, #1c3826 0%, #0f2218 100%);
    --bg-inset:       #0d2418;
    --bg-chip:        #162d1e;
    --bg-modal:       linear-gradient(135deg, #1c3826 0%, #0f2218 100%);

    --border:         #2d5238;
    --border-strong:  #3d7a50;
    --border-danger:  #5a2020;
    --border-hover:   #f0c040;

    --text-primary:   #e8dfc8;
    --text-secondary: #7aad8a;
    --text-muted:     #5a8a6a;
    --text-heading:   #f0c040;
    --text-subheading:#c8bfa8;

    --gold:           #f0c040;
    --gold-dark:      #d4a020;
    --gold-dim:       rgba(240,192,64,0.15);
    --gold-shadow:    rgba(240,192,64,0.3);

    --green-dim:      rgba(61,122,80,0.18);
    --green-border:   #3d7a50;
    --red-dim:        rgba(200,80,40,0.14);
    --red-border:     #a04020;
    --red-text:       #e08060;
    --danger-dim:     rgba(200,60,40,0.18);

    --shadow-card:    0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05);
    --shadow-modal:   0 16px 64px rgba(0,0,0,0.7);
    --shadow-btn:     0 4px 16px rgba(240,192,64,0.3);
    --shadow-btn-h:   0 6px 24px rgba(240,192,64,0.4);
    --modal-overlay:  rgba(0,0,0,0.72);

    --trump-red:      #e84040;
    --btn-primary-color: #0d2418;
    --scorecard-th-bg: #0d2418;
    --scorecard-td-border: #1a3020;
    --total-row-bg:   #0d2418;
    --winner-border:  #f0c040;
    --tally-neutral-bg: rgba(13,36,24,0.6);
    --badge-done-bg:  rgba(61,122,80,0.2);
    --badge-done-border: #2d5238;
  }

  /* ── Light theme ──────────────────────────────────────────────────── */
  .light {
    --bg-page:        #f0ebe0;
    --bg-app:         radial-gradient(ellipse at 50% 0%, #e8f0e8 0%, #dde8dd 60%);
    --bg-card:        linear-gradient(135deg, #ffffff 0%, #f5f0e8 100%);
    --bg-card-alt:    linear-gradient(135deg, #ffffff 0%, #eef5ee 100%);
    --bg-inset:       #f5f0e8;
    --bg-chip:        #eef5ee;
    --bg-modal:       linear-gradient(135deg, #ffffff 0%, #eef5ee 100%);

    --border:         #b8d4b8;
    --border-strong:  #5a9a6a;
    --border-danger:  #d4a0a0;
    --border-hover:   #b88a00;

    --text-primary:   #2a3828;
    --text-secondary: #3d6a4a;
    --text-muted:     #7aaa8a;
    --text-heading:   #8a6800;
    --text-subheading:#4a5a48;

    --gold:           #b88a00;
    --gold-dark:      #9a7200;
    --gold-dim:       rgba(184,138,0,0.12);
    --gold-shadow:    rgba(184,138,0,0.2);

    --green-dim:      rgba(61,122,80,0.1);
    --green-border:   #5a9a6a;
    --red-dim:        rgba(180,60,20,0.08);
    --red-border:     #c06040;
    --red-text:       #b04020;
    --danger-dim:     rgba(180,40,20,0.08);

    --shadow-card:    0 4px 20px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.8);
    --shadow-modal:   0 12px 48px rgba(0,0,0,0.2);
    --shadow-btn:     0 4px 16px rgba(184,138,0,0.25);
    --shadow-btn-h:   0 6px 24px rgba(184,138,0,0.35);
    --modal-overlay:  rgba(60,80,60,0.45);

    --trump-red:      #cc2020;
    --btn-primary-color: #fff8e8;
    --scorecard-th-bg: #e8f0e8;
    --scorecard-td-border: #dde8dd;
    --total-row-bg:   #e8f0e8;
    --winner-border:  #b88a00;
    --tally-neutral-bg: rgba(220,240,220,0.8);
    --badge-done-bg:  rgba(61,122,80,0.12);
    --badge-done-border: #b8d4b8;
  }

  /* ── Reset ────────────────────────────────────────────────────────── */
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: var(--bg-page); min-height: 100vh; font-family: 'Lato', sans-serif; transition: background 0.3s; }

  /* ── App shell ────────────────────────────────────────────────────── */
  .app { min-height: 100vh; background: var(--bg-app); color: var(--text-primary); padding: 24px 16px 48px; transition: background 0.3s, color 0.3s; }

  /* ── Header ───────────────────────────────────────────────────────── */
  .header { text-align: center; margin-bottom: 32px; position: relative; }
  .header h1 { font-family: 'Playfair Display', serif; font-size: clamp(2rem, 7vw, 3.6rem); font-weight: 900; letter-spacing: 0.12em; color: var(--gold); text-shadow: 0 2px 24px var(--gold-shadow); cursor: pointer; display: inline-block; transition: color 0.3s; }
  .header p { font-size: 0.8rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--text-secondary); margin-top: 4px; }
  .header-nav { position: absolute; right: 0; top: 0; display: flex; gap: 8px; align-items: flex-start; }
  .nav-icon-btn { background: transparent; border: 1px solid var(--border); border-radius: 8px; color: var(--text-secondary); cursor: pointer; padding: 6px 10px; font-size: 0.82rem; font-family: 'DM Mono', monospace; transition: all 0.15s; white-space: nowrap; }
  .nav-icon-btn:hover { border-color: var(--border-hover); color: var(--gold); }
  .nav-icon-btn.active { border-color: var(--gold); color: var(--gold); background: var(--gold-dim); }

  /* Theme toggle button */
  .theme-toggle { background: transparent; border: 1px solid var(--border); border-radius: 8px; color: var(--text-secondary); cursor: pointer; padding: 5px 9px; font-size: 1rem; line-height: 1; transition: all 0.15s; }
  .theme-toggle:hover { border-color: var(--border-hover); color: var(--gold); }

  /* ── Cards ────────────────────────────────────────────────────────── */
  .card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 28px; box-shadow: var(--shadow-card); max-width: 600px; margin: 0 auto 24px; transition: background 0.3s, border-color 0.3s; }
  .card h2 { font-family: 'Playfair Display', serif; font-size: 1.3rem; color: var(--gold); margin-bottom: 20px; display: flex; align-items: center; gap: 8px; }
  .card h3 { font-family: 'Playfair Display', serif; font-size: 1.1rem; color: var(--text-primary); margin-bottom: 12px; }

  /* ── Forms ────────────────────────────────────────────────────────── */
  label { display: block; font-size: 0.75rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--text-secondary); margin-bottom: 6px; }
  input[type="text"], input[type="number"], input[type="datetime-local"], select {
    width: 100%; background: var(--bg-inset); border: 1px solid var(--border); border-radius: 8px;
    color: var(--text-primary); font-family: 'Lato', sans-serif; font-size: 1rem;
    padding: 10px 14px; outline: none; transition: border-color 0.2s, background 0.3s, color 0.3s;
  }
  input:focus, select:focus { border-color: var(--gold); }
  input.input-error { border-color: var(--red-border) !important; }
  select option { background: var(--bg-inset); color: var(--text-primary); }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
  .form-group { margin-bottom: 16px; }
  .field-error { font-size: 0.72rem; color: var(--red-text); margin-top: 4px; font-family: 'DM Mono', monospace; }
  .required-star { color: var(--red-text); margin-left: 2px; }

  /* ── Buttons ──────────────────────────────────────────────────────── */
  .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 28px; border-radius: 10px; border: none; font-family: 'Lato', sans-serif; font-size: 0.9rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; transition: all 0.18s; }
  .btn-primary { background: linear-gradient(135deg, var(--gold), var(--gold-dark)); color: var(--btn-primary-color); width: 100%; padding: 14px; font-size: 1rem; box-shadow: var(--shadow-btn); }
  .btn-primary:hover { transform: translateY(-1px); box-shadow: var(--shadow-btn-h); }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  .btn-secondary { background: transparent; border: 1px solid var(--border); color: var(--text-secondary); font-size: 0.8rem; padding: 8px 16px; }
  .btn-secondary:hover { border-color: var(--text-secondary); color: var(--text-primary); }
  .btn-danger { background: transparent; border: 1px solid var(--border-danger); color: #c06060; font-size: 0.8rem; padding: 8px 16px; }
  .btn-danger:hover { background: var(--danger-dim); border-color: #c06060; }
  .btn-sm { padding: 5px 12px; font-size: 0.75rem; border-radius: 7px; }
  .btn-edit { background: transparent; border: 1px solid var(--border); color: var(--text-secondary); font-size: 0.68rem; padding: 3px 9px; border-radius: 6px; cursor: pointer; font-family: 'DM Mono', monospace; letter-spacing: 0.08em; transition: all 0.15s; white-space: nowrap; margin-top: 4px; display: inline-block; }
  .btn-edit:hover { border-color: var(--gold); color: var(--gold); }
  .btn-clone { background: transparent; border: 1px solid var(--border); color: var(--text-secondary); font-size: 0.72rem; padding: 6px 12px; border-radius: 8px; cursor: pointer; font-family: 'Lato', sans-serif; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; transition: all 0.15s; white-space: nowrap; }
  .btn-clone:hover { border-color: var(--gold); color: var(--gold); background: var(--gold-dim); }
  .btn-link { background: none; border: none; color: var(--text-secondary); cursor: pointer; font-family: 'DM Mono', monospace; font-size: 0.82rem; padding: 0; text-decoration: underline; transition: color 0.15s; }
  .btn-link:hover { color: var(--gold); }

  /* ── Tabs ─────────────────────────────────────────────────────────── */
  .tab-row { display: flex; gap: 4px; max-width: 600px; margin: 0 auto 20px; background: var(--bg-inset); border-radius: 12px; padding: 4px; border: 1px solid var(--border); }
  .tab { flex: 1; padding: 8px; text-align: center; border-radius: 8px; cursor: pointer; font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase; transition: all 0.15s; font-family: 'DM Mono', monospace; color: var(--text-secondary); border: none; background: transparent; }
  .tab.active { background: var(--bg-card); color: var(--gold); box-shadow: 0 1px 4px rgba(0,0,0,0.1); }

  /* ── Alerts ───────────────────────────────────────────────────────── */
  .alert { background: var(--bg-inset); border: 1px solid var(--border); border-radius: 8px; padding: 10px 14px; font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 16px; }
  .trump-diamond { display: inline-block; color: var(--trump-red); font-weight: 700; }
  .error-bar { background: var(--danger-dim); border: 1px solid var(--red-border); border-radius: 8px; padding: 10px 14px; color: var(--red-text); font-size: 0.82rem; margin-bottom: 16px; }
  .saving-bar { background: var(--gold-dim); border: 1px solid var(--gold-shadow); border-radius: 8px; padding: 8px 14px; color: var(--gold); font-size: 0.78rem; font-family: 'DM Mono', monospace; margin-bottom: 12px; }
  .success-bar { background: var(--green-dim); border: 1px solid var(--green-border); border-radius: 8px; padding: 10px 14px; color: var(--text-secondary); font-size: 0.82rem; margin-bottom: 16px; }

  /* ── Scorecard ────────────────────────────────────────────────────── */
  .scorecard-wrap { overflow-x: auto; }
  .scorecard { width: 100%; border-collapse: collapse; font-family: 'DM Mono', monospace; font-size: 0.82rem; }
  .scorecard th { background: var(--scorecard-th-bg); padding: 10px 8px; text-align: center; font-size: 0.7rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-secondary); border-bottom: 1px solid var(--border); }
  .scorecard th.player-col { color: var(--gold); }
  .scorecard td { padding: 8px 6px; text-align: center; border-bottom: 1px solid var(--scorecard-td-border); vertical-align: middle; color: var(--text-primary); }
  .scorecard tr:last-child td { border-bottom: none; }
  .round-label { font-size: 0.7rem; color: var(--text-secondary); letter-spacing: 0.1em; }
  .round-emoji { font-size: 0.9rem; margin: 2px 0; }
  .total-row td { background: var(--total-row-bg); color: var(--gold); font-weight: 700; font-size: 0.9rem; border-top: 2px solid var(--border); }

  /* ── Round entry ──────────────────────────────────────────────────── */
  .round-entry-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 24px; max-width: 600px; margin: 0 auto 24px; box-shadow: var(--shadow-card); }
  .round-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
  .round-badge { font-family: 'Playfair Display', serif; font-size: 1.4rem; color: var(--gold); font-weight: 700; }
  .cards-badge { font-family: 'DM Mono', monospace; font-size: 0.75rem; color: var(--text-secondary); background: var(--bg-inset); border: 1px solid var(--border); padding: 4px 12px; border-radius: 20px; margin-top: 4px; display: inline-block; }
  .player-entry-row { background: var(--bg-inset); border: 1px solid var(--border); border-radius: 10px; padding: 14px 16px; margin-bottom: 10px; display: grid; grid-template-columns: 1fr auto auto; align-items: center; gap: 12px; transition: border-color 0.15s; }
  .player-entry-row.bid-met { border-color: var(--green-border); }
  .player-name { font-weight: 700; color: var(--text-primary); font-size: 0.95rem; }
  .player-bid-info { font-family: 'DM Mono', monospace; font-size: 0.72rem; color: var(--text-secondary); margin-top: 2px; }
  .checkbox-wrap { display: flex; flex-direction: column; align-items: center; gap: 4px; }
  .checkbox-label { font-size: 0.65rem; color: var(--text-secondary); letter-spacing: 0.1em; text-transform: uppercase; }
  .custom-checkbox { width: 28px; height: 28px; border-radius: 6px; border: 2px solid var(--border); background: var(--bg-chip); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; font-size: 1.1rem; font-weight: 700; color: var(--text-primary); }
  .custom-checkbox.checked { background: var(--green-border); border-color: var(--border-strong); }
  .hands-wrap { display: flex; flex-direction: column; align-items: center; gap: 4px; }
  .hands-input { width: 58px !important; text-align: center; padding: 8px 6px !important; font-family: 'DM Mono', monospace !important; font-size: 1rem !important; }
  .score-preview { font-family: 'DM Mono', monospace; font-size: 0.85rem; color: var(--gold); text-align: right; min-width: 40px; }
  .tally-bar { display: flex; align-items: center; justify-content: space-between; padding: 10px 16px; border-radius: 10px; margin-bottom: 14px; font-family: 'DM Mono', monospace; font-size: 0.82rem; border: 1px solid; transition: all 0.2s; }
  .tally-bar.ok { background: var(--green-dim); border-color: var(--green-border); color: var(--text-secondary); }
  .tally-bar.warn { background: var(--red-dim); border-color: var(--red-border); color: var(--red-text); }
  .tally-bar.neutral { background: var(--tally-neutral-bg); border-color: var(--border); color: var(--text-secondary); }
  .tally-num { font-size: 1.05rem; font-weight: 500; }

  /* ── Layout ───────────────────────────────────────────────────────── */
  .action-row { display: flex; gap: 10px; max-width: 600px; margin: 0 auto; }
  .action-row .btn { flex: 1; }
  .divider { border: none; border-top: 1px solid var(--border); margin: 20px 0; }

  /* ── Winner ───────────────────────────────────────────────────────── */
  .winner-banner { text-align: center; padding: 32px 24px; background: var(--bg-card); border: 2px solid var(--winner-border); border-radius: 20px; max-width: 600px; margin: 0 auto 24px; }
  .winner-banner .trophy { font-size: 3.5rem; display: block; margin-bottom: 12px; }
  .winner-banner h2 { font-family: 'Playfair Display', serif; font-size: 2rem; color: var(--gold); }
  .winner-banner p { color: var(--text-secondary); margin-top: 6px; font-size: 0.9rem; }

  /* ── Modal ────────────────────────────────────────────────────────── */
  .modal-overlay { position: fixed; inset: 0; background: var(--modal-overlay); z-index: 100; display: flex; align-items: flex-start; justify-content: center; padding: 24px 16px 48px; overflow-y: auto; }
  .modal-box { background: var(--bg-modal); border: 1px solid var(--border-strong); border-radius: 18px; padding: 28px 24px; width: 100%; max-width: 600px; box-shadow: var(--shadow-modal); margin-top: 8px; }
  .modal-title { font-family: 'Playfair Display', serif; font-size: 1.35rem; color: var(--gold); margin-bottom: 4px; }
  .modal-subtitle { font-family: 'DM Mono', monospace; font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 20px; letter-spacing: 0.08em; }
  .modal-actions { display: flex; gap: 10px; margin-top: 16px; }
  .modal-actions .btn { flex: 1; }

  /* ── Game list ────────────────────────────────────────────────────── */
  .game-list { display: flex; flex-direction: column; gap: 10px; }
  .game-item { background: var(--bg-inset); border: 1px solid var(--border); border-radius: 10px; padding: 14px 16px; display: flex; align-items: center; justify-content: space-between; gap: 12px; transition: border-color 0.15s; }
  .game-item:hover { border-color: var(--border-strong); }
  .game-item-title { font-family: 'Playfair Display', serif; font-size: 1rem; color: var(--gold); cursor: pointer; }
  .game-item-title:hover { text-decoration: underline; }
  .game-item-meta { font-family: 'DM Mono', monospace; font-size: 0.72rem; color: var(--text-secondary); margin-top: 3px; }
  .game-item-actions { display: flex; gap: 8px; flex-shrink: 0; flex-wrap: wrap; justify-content: flex-end; }
  .badge { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 0.65rem; font-family: 'DM Mono', monospace; letter-spacing: 0.08em; text-transform: uppercase; }
  .badge-progress { background: var(--gold-dim); color: var(--gold); border: 1px solid var(--gold-shadow); }
  .badge-done { background: var(--badge-done-bg); color: var(--text-secondary); border: 1px solid var(--badge-done-border); }

  /* ── Player picker ────────────────────────────────────────────────── */
  .player-picker { margin-bottom: 16px; }
  .player-picker-list { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 10px; min-height: 36px; }
  .player-chip { display: inline-flex; align-items: center; gap: 6px; background: var(--bg-chip); border: 1px solid var(--border); border-radius: 20px; padding: 4px 12px; font-size: 0.82rem; color: var(--text-primary); cursor: default; transition: border-color 0.15s; }
  .player-chip.selected { border-color: var(--green-border); background: var(--green-dim); }
  .player-chip.clickable { cursor: pointer; }
  .player-chip.clickable:hover { border-color: var(--gold); }
  .player-chip-remove { cursor: pointer; color: var(--text-secondary); font-size: 1rem; line-height: 1; transition: color 0.15s; }
  .player-chip-remove:hover { color: #c06060; }
  .player-search { display: flex; gap: 8px; margin-bottom: 8px; }
  .player-search input { flex: 1; }
  .player-search-results { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px; }
  .player-order-hint { font-family: 'DM Mono', monospace; font-size: 0.7rem; color: var(--text-muted); margin-top: 4px; }

  /* ── Player stats ─────────────────────────────────────────────────── */
  .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 20px; }
  .stat-box { background: var(--bg-inset); border: 1px solid var(--border); border-radius: 10px; padding: 14px; text-align: center; }
  .stat-value { font-family: 'Playfair Display', serif; font-size: 2rem; color: var(--gold); font-weight: 700; }
  .stat-label { font-family: 'DM Mono', monospace; font-size: 0.7rem; color: var(--text-secondary); letter-spacing: 0.1em; text-transform: uppercase; margin-top: 4px; }

  /* ── Player list ──────────────────────────────────────────────────── */
  .player-list { display: flex; flex-direction: column; gap: 8px; }
  .player-item { background: var(--bg-inset); border: 1px solid var(--border); border-radius: 10px; padding: 12px 16px; display: flex; align-items: center; justify-content: space-between; gap: 12px; cursor: pointer; transition: border-color 0.15s; }
  .player-item:hover { border-color: var(--gold); }
  .player-item-name { font-family: 'Playfair Display', serif; font-size: 1rem; color: var(--gold); }
  .player-item-meta { font-family: 'DM Mono', monospace; font-size: 0.7rem; color: var(--text-secondary); margin-top: 2px; }

  /* ── Permalink ────────────────────────────────────────────────────── */
  .permalink-bar { background: var(--bg-inset); border: 1px solid var(--border); border-radius: 8px; padding: 8px 12px; display: flex; align-items: center; gap: 10px; margin-bottom: 16px; max-width: 600px; margin-left: auto; margin-right: auto; }
  .permalink-url { font-family: 'DM Mono', monospace; font-size: 0.72rem; color: var(--text-secondary); flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .permalink-copy { background: transparent; border: 1px solid var(--border); border-radius: 6px; color: var(--text-secondary); cursor: pointer; padding: 3px 10px; font-size: 0.7rem; font-family: 'DM Mono', monospace; transition: all 0.15s; white-space: nowrap; }
  .permalink-copy:hover { border-color: var(--gold); color: var(--gold); }
  .permalink-copy.copied { border-color: var(--green-border); color: var(--text-secondary); }

  /* ── Rules ────────────────────────────────────────────────────────── */
  .rules-section { margin-bottom: 24px; }
  .rules-section h3 { font-family: 'Playfair Display', serif; color: var(--gold); font-size: 1.15rem; margin-bottom: 10px; }
  .rules-section p, .rules-section li { font-size: 0.9rem; line-height: 1.7; color: var(--text-subheading); margin-bottom: 8px; }
  .rules-section ul { padding-left: 20px; }
  .rules-section ul li { margin-bottom: 6px; }

  /* ── Misc ─────────────────────────────────────────────────────────── */
  .page-back { display: block; color: var(--text-secondary); cursor: pointer; font-family: 'DM Mono', monospace; font-size: 0.8rem; margin-bottom: 20px; max-width: 600px; width: 100%; margin-left: auto; margin-right: auto; background: none; border: none; text-align: left; padding: 0; }
  .page-back:hover { color: var(--gold); }
  .empty-state { text-align: center; padding: 32px 16px; color: var(--text-muted); font-family: 'DM Mono', monospace; font-size: 0.85rem; }
  .inline-edit-row { display: flex; gap: 8px; align-items: center; }
  .inline-edit-row input { flex: 1; }
`;
