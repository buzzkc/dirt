const BASE = "/api";

export async function apiFetch(path, options) {
  var res = await fetch(BASE + path, Object.assign({ headers: { "Content-Type": "application/json" } }, options || {}));
  if (!res.ok) {
    var err = await res.json().catch(function() { return { error: res.statusText }; });
    throw new Error(err.error || res.statusText);
  }
  return res.json();
}

export function calcScore(bid, handsWon) {
  if (bid === 0) return handsWon === 0 ? 10 : handsWon;
  return handsWon === bid ? bid + 10 : handsWon;
}

export function maxRoundsForPlayers(n) {
  return Math.floor(52 / n);
}

export function cardsForRound(numRounds, roundIdx) {
  return numRounds - roundIdx;
}

export function resolvedHands(e) {
  var bid = parseInt(e.bid, 10);
  if (e.gotBid) return isNaN(bid) ? 0 : bid;
  return parseInt(e.handsWon, 10);
}

export function handsTotal(entries) {
  return entries.reduce(function(s, e) { var h = resolvedHands(e); return s + (isNaN(h) ? 0 : h); }, 0);
}

export function allFilled(entries) {
  return entries.every(function(e) {
    var bid = parseInt(e.bid, 10);
    if (isNaN(bid)) return false;
    if (e.gotBid) return true;
    return !isNaN(parseInt(e.handsWon, 10));
  });
}

export function isValidRound(entries, numRounds, roundIdx) {
  return allFilled(entries) && handsTotal(entries) === cardsForRound(numRounds, roundIdx);
}

export function computeScores(entries) {
  return entries.map(function(e) {
    var bid = parseInt(e.bid, 10);
    var hands = resolvedHands(e);
    if (isNaN(bid) || isNaN(hands)) return 0;
    return calcScore(bid, hands);
  });
}

export function buildRound(roundIdx, entries) {
  var scores = computeScores(entries);
  var allGot = entries.every(function(e) { return e.gotBid; });
  var noneGot = entries.every(function(e) { return !e.gotBid; });
  return { roundIdx: roundIdx, entries: entries, scores: scores, emoji: allGot ? "happy" : noneGot ? "sad" : null };
}

export function incrementTitle(title) {
  var m = (title || "").match(/^(.*)\s+\((\d+)\)$/);
  return m ? m[1] + " (" + (parseInt(m[2], 10) + 1) + ")" : (title || "Game") + " (2)";
}

export function fmtDate(ts) {
  if (!ts) return "";
  return new Date(ts).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function permalink(type, slug) {
  return window.location.origin + window.location.pathname + "#/" + type + "/" + slug;
}
