import * as fe from "react";
import zr, { createContext as Pt, useRef as tt, useLayoutEffect as Yr, useEffect as pe, useId as sn, useContext as I, useInsertionEffect as ai, useMemo as dt, useCallback as li, Children as Xr, isValidElement as Jr, useState as se, Fragment as ci, createElement as Qr, forwardRef as qr, Component as Zr } from "react";
import { createRoot as rn } from "react-dom/client";
var Te = { exports: {} }, Dt = {};
var $n;
function to() {
  if ($n) return Dt;
  $n = 1;
  var t = zr, e = Symbol.for("react.element"), n = Symbol.for("react.fragment"), s = Object.prototype.hasOwnProperty, i = t.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, o = { key: !0, ref: !0, __self: !0, __source: !0 };
  function r(a, l, u) {
    var c, h = {}, d = null, f = null;
    u !== void 0 && (d = "" + u), l.key !== void 0 && (d = "" + l.key), l.ref !== void 0 && (f = l.ref);
    for (c in l) s.call(l, c) && !o.hasOwnProperty(c) && (h[c] = l[c]);
    if (a && a.defaultProps) for (c in l = a.defaultProps, l) h[c] === void 0 && (h[c] = l[c]);
    return { $$typeof: e, type: a, key: d, ref: f, props: h, _owner: i.current };
  }
  return Dt.Fragment = n, Dt.jsx = r, Dt.jsxs = r, Dt;
}
var Un;
function eo() {
  return Un || (Un = 1, Te.exports = to()), Te.exports;
}
var p = eo();
const Wn = {
  c: { symbol: "♣", color: "black" },
  d: { symbol: "♦", color: "red" },
  h: { symbol: "♥", color: "red" },
  s: { symbol: "♠", color: "black" },
  "?": { symbol: "?", color: "gray" }
}, no = {
  A: "A",
  K: "K",
  Q: "Q",
  J: "J",
  T: "10",
  9: "9",
  8: "8",
  7: "7",
  6: "6",
  5: "5",
  4: "4",
  3: "3",
  2: "2",
  "?": "?"
};
function so(t) {
  if (!t || t.length < 2) return null;
  const e = no[t[0]] || t[0], n = Wn[t[1]] || Wn["?"];
  return {
    rank: e,
    suit: n.symbol,
    color: n.color
  };
}
function Hn(t) {
  const e = [];
  for (let n = 0; n < t.length; n += 2) {
    const s = so(t.slice(n, n + 2));
    s && e.push(s);
  }
  return e;
}
const io = {
  f: "FOLD",
  cc: "CALL",
  cbr: "RAISE",
  sm: "SHOW"
};
function ro(t) {
  const e = t.trim().split(/\s+/);
  if (e[0] === "d") {
    if (e[1] === "dh") {
      const n = e[2], s = Hn(e[3]);
      return { type: "deal", player: n, cards: s };
    } else if (e[1] === "db")
      return { type: "board", cards: Hn(e[2]) };
  } else if (e[0].startsWith("p")) {
    const n = parseInt(e[0].slice(1)), s = io[e[1]] || e[1].toUpperCase(), i = e[2] ? parseInt(e[2]) : null;
    return { type: "action", player: n, action: s, amount: i };
  }
  return null;
}
const oo = ["BTN", "SB", "BB", "UTG", "HJ", "CO"];
function ao(t) {
  const e = t.trim().split(`
`), n = {
    name: "Parsed Hand",
    variant: "NT",
    players: [],
    blinds: [0, 0],
    startingStacks: [],
    yourPosition: null,
    yourCards: [],
    communityCards: [],
    steps: [{ type: "setup", description: "테이블 셋업" }]
  };
  let s = !1;
  const i = {}, o = [];
  for (const l of e) {
    const u = l.trim();
    if (!(!u || u.startsWith("#"))) {
      if (u.includes("=") && !s) {
        const [c, ...h] = u.split("="), d = c.trim();
        let f = h.join("=").trim();
        f = f.replace(/^["'\[]|["'\]]$/g, ""), d === "variant" ? n.variant = f : d === "blinds_or_straddles" ? n.blinds = f.split(",").map((m) => parseInt(m.trim())) : d === "starting_stacks" ? n.startingStacks = f.split(",").map((m) => parseInt(m.trim())) : d === "actions" && (s = !0);
      }
      if (s && u.startsWith('"')) {
        const c = u.replace(/^"|",?$/g, ""), h = ro(c);
        h && o.push(h);
      }
    }
  }
  let r = n.blinds[0] + n.blinds[1], a = !1;
  for (const l of o)
    if (l.type === "deal")
      i[l.player] = l.cards, !a && Object.keys(i).length >= 2 && (n.steps.push({
        type: "deal",
        description: "카드 딜링",
        playerCards: i
      }), a = !0);
    else if (l.type === "board") {
      const u = l.cards.length, c = u === 3 ? "flop" : u === 1 ? n.communityCards.length === 3 ? "turn" : "river" : "board";
      n.communityCards.push(...l.cards), n.steps.push({
        type: c,
        description: `${c.charAt(0).toUpperCase() + c.slice(1)} 오픈`,
        cards: l.cards
      });
    } else if (l.type === "action") {
      const u = oo[(l.player - 1) % 6] || `P${l.player}`;
      (l.action === "RAISE" || l.action === "CALL") && (r += l.amount || 0), n.steps.push({
        type: "action",
        player: u,
        action: l.action,
        amount: l.amount,
        pot: r,
        description: `${u} ${l.action}${l.amount ? " $" + l.amount : ""}`
      });
    }
  return i.p1 && (n.yourCards = i.p1, n.yourPosition = "BB"), n;
}
const lo = `
# Example hand from WSOP 2023
variant = "NT"
blinds_or_straddles = [100, 200]
starting_stacks = [10000, 12000, 8000, 15000, 9000, 11000]
actions = [
    "d dh p1 Ah7s",
    "d dh p2 ????",
    "d dh p3 ????",
    "d dh p4 ????",
    "d dh p5 ????",
    "d dh p6 ????",
    "p4 f",
    "p5 cc",
    "p6 f",
    "p1 cc",
    "p2 cbr 600",
    "p3 f",
    "p5 cc",
    "p1 cc",
    "d db Kh9c2d",
    "p5 cc",
    "p1 cbr 1200",
    "p2 cc",
    "p5 f",
    "d db Jh",
    "p1 cbr 2400",
    "p2 cc",
    "d db 3c",
    "p1 cc",
    "p2 cc",
]
`, co = ao(lo), pt = {
  phh: co,
  tutorial: {
    name: "🎓 Tutorial: 한 판의 홀덤",
    yourPosition: "BB",
    yourCards: [
      { suit: "♥", rank: "A", color: "red" },
      { suit: "♠", rank: "7", color: "black" }
    ],
    steps: [
      { type: "setup", description: "테이블 셋업" },
      { type: "deal", description: "카드 딜링" },
      { type: "blinds", pot: 150, bets: { SB: 50, BB: 100 }, description: "SB $50 + BB $100" },
      { type: "action", player: "UTG", action: "FOLD", bet: 0, pot: 150, description: "UTG 폴드" },
      { type: "action", player: "HJ", action: "CALL", bet: 100, pot: 250, description: "HJ $100 콜" },
      { type: "action", player: "CO", action: "FOLD", bet: 0, pot: 250, description: "CO 폴드" },
      { type: "action", player: "BTN", action: "FOLD", bet: 0, pot: 250, description: "BTN 폴드" },
      { type: "action", player: "SB", action: "CALL", bet: 50, pot: 300, description: "SB $50 콜" },
      { type: "action", player: "BB", action: "CHECK", bet: 0, pot: 300, description: "BB 체크" },
      {
        type: "flop",
        cards: [
          { suit: "♥", rank: "K", color: "red" },
          { suit: "♦", rank: "7", color: "red" },
          { suit: "♣", rank: "2", color: "black" }
        ],
        pot: 300,
        description: "플랍: K♥ 7♦ 2♣"
      },
      {
        type: "turn",
        card: { suit: "♠", rank: "3", color: "black" },
        pot: 300,
        description: "턴: 3♠"
      },
      {
        type: "river",
        card: { suit: "♥", rank: "A", color: "red" },
        pot: 300,
        description: "리버: A♥"
      }
    ]
  },
  preflop: {
    name: "Pre-flop Basic",
    yourPosition: "BB",
    yourCards: [
      { suit: "♥", rank: "A", color: "red" },
      { suit: "♠", rank: "7", color: "black" }
    ],
    steps: [
      { type: "setup", description: "테이블 셋업" },
      { type: "deal", description: "카드 딜링" },
      { type: "blinds", pot: 150, description: "블라인드 포스팅" },
      { type: "action", player: "UTG", action: "FOLD", description: "UTG 폴드" },
      { type: "action", player: "HJ", action: "CALL", pot: 250, description: "HJ 콜" },
      { type: "your_turn", description: "당신의 차례" }
    ]
  },
  flop: {
    name: "Flop Decision",
    yourPosition: "BTN",
    yourCards: [
      { suit: "♠", rank: "K", color: "black" },
      { suit: "♠", rank: "Q", color: "black" }
    ],
    communityCards: [
      { suit: "♠", rank: "J", color: "black" },
      { suit: "♥", rank: "10", color: "red" },
      { suit: "♦", rank: "2", color: "red" }
    ],
    steps: [
      { type: "setup", description: "테이블 셋업" },
      { type: "deal", description: "카드 딜링" },
      { type: "flop", description: "플랍 오픈" },
      { type: "your_turn", description: "플러시 드로우 + 스트레이트 드로우!" }
    ]
  }
};
class Gn {
  constructor(e = "tutorial") {
    this.scenarioKey = e, this.scenario = pt[e] || pt.tutorial, this.step = 0, this.listeners = /* @__PURE__ */ new Set();
  }
  // 상태 변경 알림
  _notify() {
    this.listeners.forEach((e) => e(this.getState()));
  }
  // 구독
  subscribe(e) {
    return this.listeners.add(e), () => this.listeners.delete(e);
  }
  // 다음 스텝
  nextStep() {
    const e = this.scenario.steps.length - 1;
    return this.step < e && (this.step++, this._notify()), this.step;
  }
  // 이전 스텝
  prevStep() {
    return this.step > 0 && (this.step--, this._notify()), this.step;
  }
  // 특정 스텝으로 이동
  goToStep(e) {
    const n = this.scenario.steps.length - 1, s = Math.max(0, Math.min(e, n));
    return this.step !== s && (this.step = s, this._notify()), this.step;
  }
  // 리셋
  reset() {
    this.step = 0, this._notify();
  }
  // 시나리오 변경
  setScenario(e) {
    pt[e] && (this.scenarioKey = e, this.scenario = pt[e], this.step = 0, this._notify());
  }
  // 현재 상태 조회
  getState() {
    const e = this.scenario.steps[this.step] || {}, n = [];
    for (let o = 0; o <= this.step; o++) {
      const r = this.scenario.steps[o];
      r?.type === "flop" && r.cards ? n.push(...r.cards) : (r?.type === "turn" || r?.type === "river") && r.card && n.push(r.card);
    }
    let s = "preflop";
    for (let o = 0; o <= this.step; o++) {
      const r = this.scenario.steps[o];
      r?.type === "flop" ? s = "flop" : r?.type === "turn" ? s = "turn" : r?.type === "river" && (s = "river");
    }
    const i = e.pot || (this.step >= 2 ? 150 : 0);
    return {
      scenarioKey: this.scenarioKey,
      scenarioName: this.scenario.name,
      step: this.step,
      totalSteps: this.scenario.steps.length,
      currentStepData: e,
      phase: s,
      pot: i,
      communityCards: n,
      yourCards: this.scenario.yourCards,
      yourPosition: this.scenario.yourPosition
    };
  }
  // 시나리오 목록 조회
  static getScenarios() {
    return Object.keys(pt).map((e) => ({
      key: e,
      name: pt[e].name
    }));
  }
}
const on = Pt({});
function an(t) {
  const e = tt(null);
  return e.current === null && (e.current = t()), e.current;
}
const ln = typeof window < "u", ui = ln ? Yr : pe, me = /* @__PURE__ */ Pt(null);
function cn(t, e) {
  t.indexOf(e) === -1 && t.push(e);
}
function un(t, e) {
  const n = t.indexOf(e);
  n > -1 && t.splice(n, 1);
}
const Q = (t, e, n) => n > e ? e : n < t ? t : n;
let hn = () => {
};
const q = {}, hi = (t) => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(t);
function di(t) {
  return typeof t == "object" && t !== null;
}
const fi = (t) => /^0[^.\s]+$/u.test(t);
// @__NO_SIDE_EFFECTS__
function dn(t) {
  let e;
  return () => (e === void 0 && (e = t()), e);
}
const H = /* @__NO_SIDE_EFFECTS__ */ (t) => t, uo = (t, e) => (n) => e(t(n)), $t = (...t) => t.reduce(uo), It = /* @__NO_SIDE_EFFECTS__ */ (t, e, n) => {
  const s = e - t;
  return s === 0 ? 1 : (n - t) / s;
};
class fn {
  constructor() {
    this.subscriptions = [];
  }
  add(e) {
    return cn(this.subscriptions, e), () => un(this.subscriptions, e);
  }
  notify(e, n, s) {
    const i = this.subscriptions.length;
    if (i)
      if (i === 1)
        this.subscriptions[0](e, n, s);
      else
        for (let o = 0; o < i; o++) {
          const r = this.subscriptions[o];
          r && r(e, n, s);
        }
  }
  getSize() {
    return this.subscriptions.length;
  }
  clear() {
    this.subscriptions.length = 0;
  }
}
const X = /* @__NO_SIDE_EFFECTS__ */ (t) => t * 1e3, W = /* @__NO_SIDE_EFFECTS__ */ (t) => t / 1e3;
function pi(t, e) {
  return e ? t * (1e3 / e) : 0;
}
const mi = (t, e, n) => (((1 - 3 * n + 3 * e) * t + (3 * n - 6 * e)) * t + 3 * e) * t, ho = 1e-7, fo = 12;
function po(t, e, n, s, i) {
  let o, r, a = 0;
  do
    r = e + (n - e) / 2, o = mi(r, s, i) - t, o > 0 ? n = r : e = r;
  while (Math.abs(o) > ho && ++a < fo);
  return r;
}
function Ut(t, e, n, s) {
  if (t === e && n === s)
    return H;
  const i = (o) => po(o, 0, 1, t, n);
  return (o) => o === 0 || o === 1 ? o : mi(i(o), e, s);
}
const yi = (t) => (e) => e <= 0.5 ? t(2 * e) / 2 : (2 - t(2 * (1 - e))) / 2, gi = (t) => (e) => 1 - t(1 - e), vi = /* @__PURE__ */ Ut(0.33, 1.53, 0.69, 0.99), pn = /* @__PURE__ */ gi(vi), xi = /* @__PURE__ */ yi(pn), Ti = (t) => (t *= 2) < 1 ? 0.5 * pn(t) : 0.5 * (2 - Math.pow(2, -10 * (t - 1))), mn = (t) => 1 - Math.sin(Math.acos(t)), bi = gi(mn), Si = yi(mn), mo = /* @__PURE__ */ Ut(0.42, 0, 1, 1), yo = /* @__PURE__ */ Ut(0, 0, 0.58, 1), Ai = /* @__PURE__ */ Ut(0.42, 0, 0.58, 1), go = (t) => Array.isArray(t) && typeof t[0] != "number", Pi = (t) => Array.isArray(t) && typeof t[0] == "number", vo = {
  linear: H,
  easeIn: mo,
  easeInOut: Ai,
  easeOut: yo,
  circIn: mn,
  circInOut: Si,
  circOut: bi,
  backIn: pn,
  backInOut: xi,
  backOut: vi,
  anticipate: Ti
}, xo = (t) => typeof t == "string", zn = (t) => {
  if (Pi(t)) {
    hn(t.length === 4);
    const [e, n, s, i] = t;
    return Ut(e, n, s, i);
  } else if (xo(t))
    return vo[t];
  return t;
}, Yt = [
  "setup",
  // Compute
  "read",
  // Read
  "resolveKeyframes",
  // Write/Read/Write/Read
  "preUpdate",
  // Compute
  "update",
  // Compute
  "preRender",
  // Compute
  "render",
  // Write
  "postRender"
  // Compute
];
function To(t, e) {
  let n = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Set(), i = !1, o = !1;
  const r = /* @__PURE__ */ new WeakSet();
  let a = {
    delta: 0,
    timestamp: 0,
    isProcessing: !1
  };
  function l(c) {
    r.has(c) && (u.schedule(c), t()), c(a);
  }
  const u = {
    /**
     * Schedule a process to run on the next frame.
     */
    schedule: (c, h = !1, d = !1) => {
      const m = d && i ? n : s;
      return h && r.add(c), m.has(c) || m.add(c), c;
    },
    /**
     * Cancel the provided callback from running on the next frame.
     */
    cancel: (c) => {
      s.delete(c), r.delete(c);
    },
    /**
     * Execute all schedule callbacks.
     */
    process: (c) => {
      if (a = c, i) {
        o = !0;
        return;
      }
      i = !0, [n, s] = [s, n], n.forEach(l), n.clear(), i = !1, o && (o = !1, u.process(c));
    }
  };
  return u;
}
const bo = 40;
function wi(t, e) {
  let n = !1, s = !0;
  const i = {
    delta: 0,
    timestamp: 0,
    isProcessing: !1
  }, o = () => n = !0, r = Yt.reduce((T, w) => (T[w] = To(o), T), {}), { setup: a, read: l, resolveKeyframes: u, preUpdate: c, update: h, preRender: d, render: f, postRender: m } = r, x = () => {
    const T = q.useManualTiming ? i.timestamp : performance.now();
    n = !1, q.useManualTiming || (i.delta = s ? 1e3 / 60 : Math.max(Math.min(T - i.timestamp, bo), 1)), i.timestamp = T, i.isProcessing = !0, a.process(i), l.process(i), u.process(i), c.process(i), h.process(i), d.process(i), f.process(i), m.process(i), i.isProcessing = !1, n && e && (s = !1, t(x));
  }, S = () => {
    n = !0, s = !0, i.isProcessing || t(x);
  };
  return { schedule: Yt.reduce((T, w) => {
    const y = r[w];
    return T[w] = (v, C = !1, A = !1) => (n || S(), y.schedule(v, C, A)), T;
  }, {}), cancel: (T) => {
    for (let w = 0; w < Yt.length; w++)
      r[Yt[w]].cancel(T);
  }, state: i, steps: r };
}
const { schedule: V, cancel: et, state: B, steps: be } = /* @__PURE__ */ wi(typeof requestAnimationFrame < "u" ? requestAnimationFrame : H, !0);
let Zt;
function So() {
  Zt = void 0;
}
const K = {
  now: () => (Zt === void 0 && K.set(B.isProcessing || q.useManualTiming ? B.timestamp : performance.now()), Zt),
  set: (t) => {
    Zt = t, queueMicrotask(So);
  }
}, Ci = (t) => (e) => typeof e == "string" && e.startsWith(t), yn = /* @__PURE__ */ Ci("--"), Ao = /* @__PURE__ */ Ci("var(--"), gn = (t) => Ao(t) ? Po.test(t.split("/*")[0].trim()) : !1, Po = /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu, wt = {
  test: (t) => typeof t == "number",
  parse: parseFloat,
  transform: (t) => t
}, Ot = {
  ...wt,
  transform: (t) => Q(0, 1, t)
}, Xt = {
  ...wt,
  default: 1
}, Rt = (t) => Math.round(t * 1e5) / 1e5, vn = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu;
function wo(t) {
  return t == null;
}
const Co = /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu, xn = (t, e) => (n) => !!(typeof n == "string" && Co.test(n) && n.startsWith(t) || e && !wo(n) && Object.prototype.hasOwnProperty.call(n, e)), Vi = (t, e, n) => (s) => {
  if (typeof s != "string")
    return s;
  const [i, o, r, a] = s.match(vn);
  return {
    [t]: parseFloat(i),
    [e]: parseFloat(o),
    [n]: parseFloat(r),
    alpha: a !== void 0 ? parseFloat(a) : 1
  };
}, Vo = (t) => Q(0, 255, t), Se = {
  ...wt,
  transform: (t) => Math.round(Vo(t))
}, at = {
  test: /* @__PURE__ */ xn("rgb", "red"),
  parse: /* @__PURE__ */ Vi("red", "green", "blue"),
  transform: ({ red: t, green: e, blue: n, alpha: s = 1 }) => "rgba(" + Se.transform(t) + ", " + Se.transform(e) + ", " + Se.transform(n) + ", " + Rt(Ot.transform(s)) + ")"
};
function Do(t) {
  let e = "", n = "", s = "", i = "";
  return t.length > 5 ? (e = t.substring(1, 3), n = t.substring(3, 5), s = t.substring(5, 7), i = t.substring(7, 9)) : (e = t.substring(1, 2), n = t.substring(2, 3), s = t.substring(3, 4), i = t.substring(4, 5), e += e, n += n, s += s, i += i), {
    red: parseInt(e, 16),
    green: parseInt(n, 16),
    blue: parseInt(s, 16),
    alpha: i ? parseInt(i, 16) / 255 : 1
  };
}
const Ie = {
  test: /* @__PURE__ */ xn("#"),
  parse: Do,
  transform: at.transform
}, Wt = /* @__NO_SIDE_EFFECTS__ */ (t) => ({
  test: (e) => typeof e == "string" && e.endsWith(t) && e.split(" ").length === 1,
  parse: parseFloat,
  transform: (e) => `${e}${t}`
}), Z = /* @__PURE__ */ Wt("deg"), J = /* @__PURE__ */ Wt("%"), P = /* @__PURE__ */ Wt("px"), Mo = /* @__PURE__ */ Wt("vh"), Eo = /* @__PURE__ */ Wt("vw"), Yn = {
  ...J,
  parse: (t) => J.parse(t) / 100,
  transform: (t) => J.transform(t * 100)
}, yt = {
  test: /* @__PURE__ */ xn("hsl", "hue"),
  parse: /* @__PURE__ */ Vi("hue", "saturation", "lightness"),
  transform: ({ hue: t, saturation: e, lightness: n, alpha: s = 1 }) => "hsla(" + Math.round(t) + ", " + J.transform(Rt(e)) + ", " + J.transform(Rt(n)) + ", " + Rt(Ot.transform(s)) + ")"
}, L = {
  test: (t) => at.test(t) || Ie.test(t) || yt.test(t),
  parse: (t) => at.test(t) ? at.parse(t) : yt.test(t) ? yt.parse(t) : Ie.parse(t),
  transform: (t) => typeof t == "string" ? t : t.hasOwnProperty("red") ? at.transform(t) : yt.transform(t),
  getAnimatableNone: (t) => {
    const e = L.parse(t);
    return e.alpha = 0, L.transform(e);
  }
}, Ro = /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;
function Lo(t) {
  return isNaN(t) && typeof t == "string" && (t.match(vn)?.length || 0) + (t.match(Ro)?.length || 0) > 0;
}
const Di = "number", Mi = "color", jo = "var", ko = "var(", Xn = "${}", Bo = /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;
function Ft(t) {
  const e = t.toString(), n = [], s = {
    color: [],
    number: [],
    var: []
  }, i = [];
  let o = 0;
  const a = e.replace(Bo, (l) => (L.test(l) ? (s.color.push(o), i.push(Mi), n.push(L.parse(l))) : l.startsWith(ko) ? (s.var.push(o), i.push(jo), n.push(l)) : (s.number.push(o), i.push(Di), n.push(parseFloat(l))), ++o, Xn)).split(Xn);
  return { values: n, split: a, indexes: s, types: i };
}
function Ei(t) {
  return Ft(t).values;
}
function Ri(t) {
  const { split: e, types: n } = Ft(t), s = e.length;
  return (i) => {
    let o = "";
    for (let r = 0; r < s; r++)
      if (o += e[r], i[r] !== void 0) {
        const a = n[r];
        a === Di ? o += Rt(i[r]) : a === Mi ? o += L.transform(i[r]) : o += i[r];
      }
    return o;
  };
}
const Io = (t) => typeof t == "number" ? 0 : L.test(t) ? L.getAnimatableNone(t) : t;
function Oo(t) {
  const e = Ei(t);
  return Ri(t)(e.map(Io));
}
const nt = {
  test: Lo,
  parse: Ei,
  createTransformer: Ri,
  getAnimatableNone: Oo
};
function Ae(t, e, n) {
  return n < 0 && (n += 1), n > 1 && (n -= 1), n < 1 / 6 ? t + (e - t) * 6 * n : n < 1 / 2 ? e : n < 2 / 3 ? t + (e - t) * (2 / 3 - n) * 6 : t;
}
function Fo({ hue: t, saturation: e, lightness: n, alpha: s }) {
  t /= 360, e /= 100, n /= 100;
  let i = 0, o = 0, r = 0;
  if (!e)
    i = o = r = n;
  else {
    const a = n < 0.5 ? n * (1 + e) : n + e - n * e, l = 2 * n - a;
    i = Ae(l, a, t + 1 / 3), o = Ae(l, a, t), r = Ae(l, a, t - 1 / 3);
  }
  return {
    red: Math.round(i * 255),
    green: Math.round(o * 255),
    blue: Math.round(r * 255),
    alpha: s
  };
}
function ie(t, e) {
  return (n) => n > 0 ? e : t;
}
const D = (t, e, n) => t + (e - t) * n, Pe = (t, e, n) => {
  const s = t * t, i = n * (e * e - s) + s;
  return i < 0 ? 0 : Math.sqrt(i);
}, No = [Ie, at, yt], Ko = (t) => No.find((e) => e.test(t));
function Jn(t) {
  const e = Ko(t);
  if (!e)
    return !1;
  let n = e.parse(t);
  return e === yt && (n = Fo(n)), n;
}
const Qn = (t, e) => {
  const n = Jn(t), s = Jn(e);
  if (!n || !s)
    return ie(t, e);
  const i = { ...n };
  return (o) => (i.red = Pe(n.red, s.red, o), i.green = Pe(n.green, s.green, o), i.blue = Pe(n.blue, s.blue, o), i.alpha = D(n.alpha, s.alpha, o), at.transform(i));
}, Oe = /* @__PURE__ */ new Set(["none", "hidden"]);
function _o(t, e) {
  return Oe.has(t) ? (n) => n <= 0 ? t : e : (n) => n >= 1 ? e : t;
}
function $o(t, e) {
  return (n) => D(t, e, n);
}
function Tn(t) {
  return typeof t == "number" ? $o : typeof t == "string" ? gn(t) ? ie : L.test(t) ? Qn : Ho : Array.isArray(t) ? Li : typeof t == "object" ? L.test(t) ? Qn : Uo : ie;
}
function Li(t, e) {
  const n = [...t], s = n.length, i = t.map((o, r) => Tn(o)(o, e[r]));
  return (o) => {
    for (let r = 0; r < s; r++)
      n[r] = i[r](o);
    return n;
  };
}
function Uo(t, e) {
  const n = { ...t, ...e }, s = {};
  for (const i in n)
    t[i] !== void 0 && e[i] !== void 0 && (s[i] = Tn(t[i])(t[i], e[i]));
  return (i) => {
    for (const o in s)
      n[o] = s[o](i);
    return n;
  };
}
function Wo(t, e) {
  const n = [], s = { color: 0, var: 0, number: 0 };
  for (let i = 0; i < e.values.length; i++) {
    const o = e.types[i], r = t.indexes[o][s[o]], a = t.values[r] ?? 0;
    n[i] = a, s[o]++;
  }
  return n;
}
const Ho = (t, e) => {
  const n = nt.createTransformer(e), s = Ft(t), i = Ft(e);
  return s.indexes.var.length === i.indexes.var.length && s.indexes.color.length === i.indexes.color.length && s.indexes.number.length >= i.indexes.number.length ? Oe.has(t) && !i.values.length || Oe.has(e) && !s.values.length ? _o(t, e) : $t(Li(Wo(s, i), i.values), n) : ie(t, e);
};
function ji(t, e, n) {
  return typeof t == "number" && typeof e == "number" && typeof n == "number" ? D(t, e, n) : Tn(t)(t, e);
}
const Go = (t) => {
  const e = ({ timestamp: n }) => t(n);
  return {
    start: (n = !0) => V.update(e, n),
    stop: () => et(e),
    /**
     * If we're processing this frame we can use the
     * framelocked timestamp to keep things in sync.
     */
    now: () => B.isProcessing ? B.timestamp : K.now()
  };
}, ki = (t, e, n = 10) => {
  let s = "";
  const i = Math.max(Math.round(e / n), 2);
  for (let o = 0; o < i; o++)
    s += Math.round(t(o / (i - 1)) * 1e4) / 1e4 + ", ";
  return `linear(${s.substring(0, s.length - 2)})`;
}, re = 2e4;
function bn(t) {
  let e = 0;
  const n = 50;
  let s = t.next(e);
  for (; !s.done && e < re; )
    e += n, s = t.next(e);
  return e >= re ? 1 / 0 : e;
}
function zo(t, e = 100, n) {
  const s = n({ ...t, keyframes: [0, e] }), i = Math.min(bn(s), re);
  return {
    type: "keyframes",
    ease: (o) => s.next(i * o).value / e,
    duration: /* @__PURE__ */ W(i)
  };
}
const Yo = 5;
function Bi(t, e, n) {
  const s = Math.max(e - Yo, 0);
  return pi(n - t(s), e - s);
}
const M = {
  // Default spring physics
  stiffness: 100,
  damping: 10,
  mass: 1,
  velocity: 0,
  // Default duration/bounce-based options
  duration: 800,
  // in ms
  bounce: 0.3,
  visualDuration: 0.3,
  // in seconds
  // Rest thresholds
  restSpeed: {
    granular: 0.01,
    default: 2
  },
  restDelta: {
    granular: 5e-3,
    default: 0.5
  },
  // Limits
  minDuration: 0.01,
  // in seconds
  maxDuration: 10,
  // in seconds
  minDamping: 0.05,
  maxDamping: 1
}, we = 1e-3;
function Xo({ duration: t = M.duration, bounce: e = M.bounce, velocity: n = M.velocity, mass: s = M.mass }) {
  let i, o, r = 1 - e;
  r = Q(M.minDamping, M.maxDamping, r), t = Q(M.minDuration, M.maxDuration, /* @__PURE__ */ W(t)), r < 1 ? (i = (u) => {
    const c = u * r, h = c * t, d = c - n, f = Fe(u, r), m = Math.exp(-h);
    return we - d / f * m;
  }, o = (u) => {
    const h = u * r * t, d = h * n + n, f = Math.pow(r, 2) * Math.pow(u, 2) * t, m = Math.exp(-h), x = Fe(Math.pow(u, 2), r);
    return (-i(u) + we > 0 ? -1 : 1) * ((d - f) * m) / x;
  }) : (i = (u) => {
    const c = Math.exp(-u * t), h = (u - n) * t + 1;
    return -we + c * h;
  }, o = (u) => {
    const c = Math.exp(-u * t), h = (n - u) * (t * t);
    return c * h;
  });
  const a = 5 / t, l = Qo(i, o, a);
  if (t = /* @__PURE__ */ X(t), isNaN(l))
    return {
      stiffness: M.stiffness,
      damping: M.damping,
      duration: t
    };
  {
    const u = Math.pow(l, 2) * s;
    return {
      stiffness: u,
      damping: r * 2 * Math.sqrt(s * u),
      duration: t
    };
  }
}
const Jo = 12;
function Qo(t, e, n) {
  let s = n;
  for (let i = 1; i < Jo; i++)
    s = s - t(s) / e(s);
  return s;
}
function Fe(t, e) {
  return t * Math.sqrt(1 - e * e);
}
const qo = ["duration", "bounce"], Zo = ["stiffness", "damping", "mass"];
function qn(t, e) {
  return e.some((n) => t[n] !== void 0);
}
function ta(t) {
  let e = {
    velocity: M.velocity,
    stiffness: M.stiffness,
    damping: M.damping,
    mass: M.mass,
    isResolvedFromDuration: !1,
    ...t
  };
  if (!qn(t, Zo) && qn(t, qo))
    if (t.visualDuration) {
      const n = t.visualDuration, s = 2 * Math.PI / (n * 1.2), i = s * s, o = 2 * Q(0.05, 1, 1 - (t.bounce || 0)) * Math.sqrt(i);
      e = {
        ...e,
        mass: M.mass,
        stiffness: i,
        damping: o
      };
    } else {
      const n = Xo(t);
      e = {
        ...e,
        ...n,
        mass: M.mass
      }, e.isResolvedFromDuration = !0;
    }
  return e;
}
function oe(t = M.visualDuration, e = M.bounce) {
  const n = typeof t != "object" ? {
    visualDuration: t,
    keyframes: [0, 1],
    bounce: e
  } : t;
  let { restSpeed: s, restDelta: i } = n;
  const o = n.keyframes[0], r = n.keyframes[n.keyframes.length - 1], a = { done: !1, value: o }, { stiffness: l, damping: u, mass: c, duration: h, velocity: d, isResolvedFromDuration: f } = ta({
    ...n,
    velocity: -/* @__PURE__ */ W(n.velocity || 0)
  }), m = d || 0, x = u / (2 * Math.sqrt(l * c)), S = r - o, g = /* @__PURE__ */ W(Math.sqrt(l / c)), b = Math.abs(S) < 5;
  s || (s = b ? M.restSpeed.granular : M.restSpeed.default), i || (i = b ? M.restDelta.granular : M.restDelta.default);
  let T;
  if (x < 1) {
    const y = Fe(g, x);
    T = (v) => {
      const C = Math.exp(-x * g * v);
      return r - C * ((m + x * g * S) / y * Math.sin(y * v) + S * Math.cos(y * v));
    };
  } else if (x === 1)
    T = (y) => r - Math.exp(-g * y) * (S + (m + g * S) * y);
  else {
    const y = g * Math.sqrt(x * x - 1);
    T = (v) => {
      const C = Math.exp(-x * g * v), A = Math.min(y * v, 300);
      return r - C * ((m + x * g * S) * Math.sinh(A) + y * S * Math.cosh(A)) / y;
    };
  }
  const w = {
    calculatedDuration: f && h || null,
    next: (y) => {
      const v = T(y);
      if (f)
        a.done = y >= h;
      else {
        let C = y === 0 ? m : 0;
        x < 1 && (C = y === 0 ? /* @__PURE__ */ X(m) : Bi(T, y, v));
        const A = Math.abs(C) <= s, E = Math.abs(r - v) <= i;
        a.done = A && E;
      }
      return a.value = a.done ? r : v, a;
    },
    toString: () => {
      const y = Math.min(bn(w), re), v = ki((C) => w.next(y * C).value, y, 30);
      return y + "ms " + v;
    },
    toTransition: () => {
    }
  };
  return w;
}
oe.applyToOptions = (t) => {
  const e = zo(t, 100, oe);
  return t.ease = e.ease, t.duration = /* @__PURE__ */ X(e.duration), t.type = "keyframes", t;
};
function Ne({ keyframes: t, velocity: e = 0, power: n = 0.8, timeConstant: s = 325, bounceDamping: i = 10, bounceStiffness: o = 500, modifyTarget: r, min: a, max: l, restDelta: u = 0.5, restSpeed: c }) {
  const h = t[0], d = {
    done: !1,
    value: h
  }, f = (A) => a !== void 0 && A < a || l !== void 0 && A > l, m = (A) => a === void 0 ? l : l === void 0 || Math.abs(a - A) < Math.abs(l - A) ? a : l;
  let x = n * e;
  const S = h + x, g = r === void 0 ? S : r(S);
  g !== S && (x = g - h);
  const b = (A) => -x * Math.exp(-A / s), T = (A) => g + b(A), w = (A) => {
    const E = b(A), j = T(A);
    d.done = Math.abs(E) <= u, d.value = d.done ? g : j;
  };
  let y, v;
  const C = (A) => {
    f(d.value) && (y = A, v = oe({
      keyframes: [d.value, m(d.value)],
      velocity: Bi(T, A, d.value),
      // TODO: This should be passing * 1000
      damping: i,
      stiffness: o,
      restDelta: u,
      restSpeed: c
    }));
  };
  return C(0), {
    calculatedDuration: null,
    next: (A) => {
      let E = !1;
      return !v && y === void 0 && (E = !0, w(A), C(A)), y !== void 0 && A >= y ? v.next(A - y) : (!E && w(A), d);
    }
  };
}
function ea(t, e, n) {
  const s = [], i = n || q.mix || ji, o = t.length - 1;
  for (let r = 0; r < o; r++) {
    let a = i(t[r], t[r + 1]);
    if (e) {
      const l = Array.isArray(e) ? e[r] || H : e;
      a = $t(l, a);
    }
    s.push(a);
  }
  return s;
}
function na(t, e, { clamp: n = !0, ease: s, mixer: i } = {}) {
  const o = t.length;
  if (hn(o === e.length), o === 1)
    return () => e[0];
  if (o === 2 && e[0] === e[1])
    return () => e[1];
  const r = t[0] === t[1];
  t[0] > t[o - 1] && (t = [...t].reverse(), e = [...e].reverse());
  const a = ea(e, s, i), l = a.length, u = (c) => {
    if (r && c < t[0])
      return e[0];
    let h = 0;
    if (l > 1)
      for (; h < t.length - 2 && !(c < t[h + 1]); h++)
        ;
    const d = /* @__PURE__ */ It(t[h], t[h + 1], c);
    return a[h](d);
  };
  return n ? (c) => u(Q(t[0], t[o - 1], c)) : u;
}
function sa(t, e) {
  const n = t[t.length - 1];
  for (let s = 1; s <= e; s++) {
    const i = /* @__PURE__ */ It(0, e, s);
    t.push(D(n, 1, i));
  }
}
function ia(t) {
  const e = [0];
  return sa(e, t.length - 1), e;
}
function ra(t, e) {
  return t.map((n) => n * e);
}
function oa(t, e) {
  return t.map(() => e || Ai).splice(0, t.length - 1);
}
function Lt({ duration: t = 300, keyframes: e, times: n, ease: s = "easeInOut" }) {
  const i = go(s) ? s.map(zn) : zn(s), o = {
    done: !1,
    value: e[0]
  }, r = ra(
    // Only use the provided offsets if they're the correct length
    // TODO Maybe we should warn here if there's a length mismatch
    n && n.length === e.length ? n : ia(e),
    t
  ), a = na(r, e, {
    ease: Array.isArray(i) ? i : oa(e, i)
  });
  return {
    calculatedDuration: t,
    next: (l) => (o.value = a(l), o.done = l >= t, o)
  };
}
const aa = (t) => t !== null;
function Sn(t, { repeat: e, repeatType: n = "loop" }, s, i = 1) {
  const o = t.filter(aa), a = i < 0 || e && n !== "loop" && e % 2 === 1 ? 0 : o.length - 1;
  return !a || s === void 0 ? o[a] : s;
}
const la = {
  decay: Ne,
  inertia: Ne,
  tween: Lt,
  keyframes: Lt,
  spring: oe
};
function Ii(t) {
  typeof t.type == "string" && (t.type = la[t.type]);
}
class An {
  constructor() {
    this.updateFinished();
  }
  get finished() {
    return this._finished;
  }
  updateFinished() {
    this._finished = new Promise((e) => {
      this.resolve = e;
    });
  }
  notifyFinished() {
    this.resolve();
  }
  /**
   * Allows the animation to be awaited.
   *
   * @deprecated Use `finished` instead.
   */
  then(e, n) {
    return this.finished.then(e, n);
  }
}
const ca = (t) => t / 100;
class Pn extends An {
  constructor(e) {
    super(), this.state = "idle", this.startTime = null, this.isStopped = !1, this.currentTime = 0, this.holdTime = null, this.playbackSpeed = 1, this.stop = () => {
      const { motionValue: n } = this.options;
      n && n.updatedAt !== K.now() && this.tick(K.now()), this.isStopped = !0, this.state !== "idle" && (this.teardown(), this.options.onStop?.());
    }, this.options = e, this.initAnimation(), this.play(), e.autoplay === !1 && this.pause();
  }
  initAnimation() {
    const { options: e } = this;
    Ii(e);
    const { type: n = Lt, repeat: s = 0, repeatDelay: i = 0, repeatType: o, velocity: r = 0 } = e;
    let { keyframes: a } = e;
    const l = n || Lt;
    l !== Lt && typeof a[0] != "number" && (this.mixKeyframes = $t(ca, ji(a[0], a[1])), a = [0, 100]);
    const u = l({ ...e, keyframes: a });
    o === "mirror" && (this.mirroredGenerator = l({
      ...e,
      keyframes: [...a].reverse(),
      velocity: -r
    })), u.calculatedDuration === null && (u.calculatedDuration = bn(u));
    const { calculatedDuration: c } = u;
    this.calculatedDuration = c, this.resolvedDuration = c + i, this.totalDuration = this.resolvedDuration * (s + 1) - i, this.generator = u;
  }
  updateTime(e) {
    const n = Math.round(e - this.startTime) * this.playbackSpeed;
    this.holdTime !== null ? this.currentTime = this.holdTime : this.currentTime = n;
  }
  tick(e, n = !1) {
    const { generator: s, totalDuration: i, mixKeyframes: o, mirroredGenerator: r, resolvedDuration: a, calculatedDuration: l } = this;
    if (this.startTime === null)
      return s.next(0);
    const { delay: u = 0, keyframes: c, repeat: h, repeatType: d, repeatDelay: f, type: m, onUpdate: x, finalKeyframe: S } = this.options;
    this.speed > 0 ? this.startTime = Math.min(this.startTime, e) : this.speed < 0 && (this.startTime = Math.min(e - i / this.speed, this.startTime)), n ? this.currentTime = e : this.updateTime(e);
    const g = this.currentTime - u * (this.playbackSpeed >= 0 ? 1 : -1), b = this.playbackSpeed >= 0 ? g < 0 : g > i;
    this.currentTime = Math.max(g, 0), this.state === "finished" && this.holdTime === null && (this.currentTime = i);
    let T = this.currentTime, w = s;
    if (h) {
      const A = Math.min(this.currentTime, i) / a;
      let E = Math.floor(A), j = A % 1;
      !j && A >= 1 && (j = 1), j === 1 && E--, E = Math.min(E, h + 1), !!(E % 2) && (d === "reverse" ? (j = 1 - j, f && (j -= f / a)) : d === "mirror" && (w = r)), T = Q(0, 1, j) * a;
    }
    const y = b ? { done: !1, value: c[0] } : w.next(T);
    o && (y.value = o(y.value));
    let { done: v } = y;
    !b && l !== null && (v = this.playbackSpeed >= 0 ? this.currentTime >= i : this.currentTime <= 0);
    const C = this.holdTime === null && (this.state === "finished" || this.state === "running" && v);
    return C && m !== Ne && (y.value = Sn(c, this.options, S, this.speed)), x && x(y.value), C && this.finish(), y;
  }
  /**
   * Allows the returned animation to be awaited or promise-chained. Currently
   * resolves when the animation finishes at all but in a future update could/should
   * reject if its cancels.
   */
  then(e, n) {
    return this.finished.then(e, n);
  }
  get duration() {
    return /* @__PURE__ */ W(this.calculatedDuration);
  }
  get iterationDuration() {
    const { delay: e = 0 } = this.options || {};
    return this.duration + /* @__PURE__ */ W(e);
  }
  get time() {
    return /* @__PURE__ */ W(this.currentTime);
  }
  set time(e) {
    e = /* @__PURE__ */ X(e), this.currentTime = e, this.startTime === null || this.holdTime !== null || this.playbackSpeed === 0 ? this.holdTime = e : this.driver && (this.startTime = this.driver.now() - e / this.playbackSpeed), this.driver?.start(!1);
  }
  get speed() {
    return this.playbackSpeed;
  }
  set speed(e) {
    this.updateTime(K.now());
    const n = this.playbackSpeed !== e;
    this.playbackSpeed = e, n && (this.time = /* @__PURE__ */ W(this.currentTime));
  }
  play() {
    if (this.isStopped)
      return;
    const { driver: e = Go, startTime: n } = this.options;
    this.driver || (this.driver = e((i) => this.tick(i))), this.options.onPlay?.();
    const s = this.driver.now();
    this.state === "finished" ? (this.updateFinished(), this.startTime = s) : this.holdTime !== null ? this.startTime = s - this.holdTime : this.startTime || (this.startTime = n ?? s), this.state === "finished" && this.speed < 0 && (this.startTime += this.calculatedDuration), this.holdTime = null, this.state = "running", this.driver.start();
  }
  pause() {
    this.state = "paused", this.updateTime(K.now()), this.holdTime = this.currentTime;
  }
  complete() {
    this.state !== "running" && this.play(), this.state = "finished", this.holdTime = null;
  }
  finish() {
    this.notifyFinished(), this.teardown(), this.state = "finished", this.options.onComplete?.();
  }
  cancel() {
    this.holdTime = null, this.startTime = 0, this.tick(0), this.teardown(), this.options.onCancel?.();
  }
  teardown() {
    this.state = "idle", this.stopDriver(), this.startTime = this.holdTime = null;
  }
  stopDriver() {
    this.driver && (this.driver.stop(), this.driver = void 0);
  }
  sample(e) {
    return this.startTime = 0, this.tick(e, !0);
  }
  attachTimeline(e) {
    return this.options.allowFlatten && (this.options.type = "keyframes", this.options.ease = "linear", this.initAnimation()), this.driver?.stop(), e.observe(this);
  }
}
function ua(t) {
  for (let e = 1; e < t.length; e++)
    t[e] ?? (t[e] = t[e - 1]);
}
const lt = (t) => t * 180 / Math.PI, Ke = (t) => {
  const e = lt(Math.atan2(t[1], t[0]));
  return _e(e);
}, ha = {
  x: 4,
  y: 5,
  translateX: 4,
  translateY: 5,
  scaleX: 0,
  scaleY: 3,
  scale: (t) => (Math.abs(t[0]) + Math.abs(t[3])) / 2,
  rotate: Ke,
  rotateZ: Ke,
  skewX: (t) => lt(Math.atan(t[1])),
  skewY: (t) => lt(Math.atan(t[2])),
  skew: (t) => (Math.abs(t[1]) + Math.abs(t[2])) / 2
}, _e = (t) => (t = t % 360, t < 0 && (t += 360), t), Zn = Ke, ts = (t) => Math.sqrt(t[0] * t[0] + t[1] * t[1]), es = (t) => Math.sqrt(t[4] * t[4] + t[5] * t[5]), da = {
  x: 12,
  y: 13,
  z: 14,
  translateX: 12,
  translateY: 13,
  translateZ: 14,
  scaleX: ts,
  scaleY: es,
  scale: (t) => (ts(t) + es(t)) / 2,
  rotateX: (t) => _e(lt(Math.atan2(t[6], t[5]))),
  rotateY: (t) => _e(lt(Math.atan2(-t[2], t[0]))),
  rotateZ: Zn,
  rotate: Zn,
  skewX: (t) => lt(Math.atan(t[4])),
  skewY: (t) => lt(Math.atan(t[1])),
  skew: (t) => (Math.abs(t[1]) + Math.abs(t[4])) / 2
};
function $e(t) {
  return t.includes("scale") ? 1 : 0;
}
function Ue(t, e) {
  if (!t || t === "none")
    return $e(e);
  const n = t.match(/^matrix3d\(([-\d.e\s,]+)\)$/u);
  let s, i;
  if (n)
    s = da, i = n;
  else {
    const a = t.match(/^matrix\(([-\d.e\s,]+)\)$/u);
    s = ha, i = a;
  }
  if (!i)
    return $e(e);
  const o = s[e], r = i[1].split(",").map(pa);
  return typeof o == "function" ? o(r) : r[o];
}
const fa = (t, e) => {
  const { transform: n = "none" } = getComputedStyle(t);
  return Ue(n, e);
};
function pa(t) {
  return parseFloat(t.trim());
}
const Ct = [
  "transformPerspective",
  "x",
  "y",
  "z",
  "translateX",
  "translateY",
  "translateZ",
  "scale",
  "scaleX",
  "scaleY",
  "rotate",
  "rotateX",
  "rotateY",
  "rotateZ",
  "skew",
  "skewX",
  "skewY"
], Vt = new Set(Ct), ns = (t) => t === wt || t === P, ma = /* @__PURE__ */ new Set(["x", "y", "z"]), ya = Ct.filter((t) => !ma.has(t));
function ga(t) {
  const e = [];
  return ya.forEach((n) => {
    const s = t.getValue(n);
    s !== void 0 && (e.push([n, s.get()]), s.set(n.startsWith("scale") ? 1 : 0));
  }), e;
}
const ut = {
  // Dimensions
  width: ({ x: t }, { paddingLeft: e = "0", paddingRight: n = "0" }) => t.max - t.min - parseFloat(e) - parseFloat(n),
  height: ({ y: t }, { paddingTop: e = "0", paddingBottom: n = "0" }) => t.max - t.min - parseFloat(e) - parseFloat(n),
  top: (t, { top: e }) => parseFloat(e),
  left: (t, { left: e }) => parseFloat(e),
  bottom: ({ y: t }, { top: e }) => parseFloat(e) + (t.max - t.min),
  right: ({ x: t }, { left: e }) => parseFloat(e) + (t.max - t.min),
  // Transform
  x: (t, { transform: e }) => Ue(e, "x"),
  y: (t, { transform: e }) => Ue(e, "y")
};
ut.translateX = ut.x;
ut.translateY = ut.y;
const ht = /* @__PURE__ */ new Set();
let We = !1, He = !1, Ge = !1;
function Oi() {
  if (He) {
    const t = Array.from(ht).filter((s) => s.needsMeasurement), e = new Set(t.map((s) => s.element)), n = /* @__PURE__ */ new Map();
    e.forEach((s) => {
      const i = ga(s);
      i.length && (n.set(s, i), s.render());
    }), t.forEach((s) => s.measureInitialState()), e.forEach((s) => {
      s.render();
      const i = n.get(s);
      i && i.forEach(([o, r]) => {
        s.getValue(o)?.set(r);
      });
    }), t.forEach((s) => s.measureEndState()), t.forEach((s) => {
      s.suspendedScrollY !== void 0 && window.scrollTo(0, s.suspendedScrollY);
    });
  }
  He = !1, We = !1, ht.forEach((t) => t.complete(Ge)), ht.clear();
}
function Fi() {
  ht.forEach((t) => {
    t.readKeyframes(), t.needsMeasurement && (He = !0);
  });
}
function va() {
  Ge = !0, Fi(), Oi(), Ge = !1;
}
class wn {
  constructor(e, n, s, i, o, r = !1) {
    this.state = "pending", this.isAsync = !1, this.needsMeasurement = !1, this.unresolvedKeyframes = [...e], this.onComplete = n, this.name = s, this.motionValue = i, this.element = o, this.isAsync = r;
  }
  scheduleResolve() {
    this.state = "scheduled", this.isAsync ? (ht.add(this), We || (We = !0, V.read(Fi), V.resolveKeyframes(Oi))) : (this.readKeyframes(), this.complete());
  }
  readKeyframes() {
    const { unresolvedKeyframes: e, name: n, element: s, motionValue: i } = this;
    if (e[0] === null) {
      const o = i?.get(), r = e[e.length - 1];
      if (o !== void 0)
        e[0] = o;
      else if (s && n) {
        const a = s.readValue(n, r);
        a != null && (e[0] = a);
      }
      e[0] === void 0 && (e[0] = r), i && o === void 0 && i.set(e[0]);
    }
    ua(e);
  }
  setFinalKeyframe() {
  }
  measureInitialState() {
  }
  renderEndStyles() {
  }
  measureEndState() {
  }
  complete(e = !1) {
    this.state = "complete", this.onComplete(this.unresolvedKeyframes, this.finalKeyframe, e), ht.delete(this);
  }
  cancel() {
    this.state === "scheduled" && (ht.delete(this), this.state = "pending");
  }
  resume() {
    this.state === "pending" && this.scheduleResolve();
  }
}
const xa = (t) => t.startsWith("--");
function Ta(t, e, n) {
  xa(e) ? t.style.setProperty(e, n) : t.style[e] = n;
}
const ba = /* @__PURE__ */ dn(() => window.ScrollTimeline !== void 0), Sa = {};
function Aa(t, e) {
  const n = /* @__PURE__ */ dn(t);
  return () => Sa[e] ?? n();
}
const Ni = /* @__PURE__ */ Aa(() => {
  try {
    document.createElement("div").animate({ opacity: 0 }, { easing: "linear(0, 1)" });
  } catch {
    return !1;
  }
  return !0;
}, "linearEasing"), Et = ([t, e, n, s]) => `cubic-bezier(${t}, ${e}, ${n}, ${s})`, ss = {
  linear: "linear",
  ease: "ease",
  easeIn: "ease-in",
  easeOut: "ease-out",
  easeInOut: "ease-in-out",
  circIn: /* @__PURE__ */ Et([0, 0.65, 0.55, 1]),
  circOut: /* @__PURE__ */ Et([0.55, 0, 1, 0.45]),
  backIn: /* @__PURE__ */ Et([0.31, 0.01, 0.66, -0.59]),
  backOut: /* @__PURE__ */ Et([0.33, 1.53, 0.69, 0.99])
};
function Ki(t, e) {
  if (t)
    return typeof t == "function" ? Ni() ? ki(t, e) : "ease-out" : Pi(t) ? Et(t) : Array.isArray(t) ? t.map((n) => Ki(n, e) || ss.easeOut) : ss[t];
}
function Pa(t, e, n, { delay: s = 0, duration: i = 300, repeat: o = 0, repeatType: r = "loop", ease: a = "easeOut", times: l } = {}, u = void 0) {
  const c = {
    [e]: n
  };
  l && (c.offset = l);
  const h = Ki(a, i);
  Array.isArray(h) && (c.easing = h);
  const d = {
    delay: s,
    duration: i,
    easing: Array.isArray(h) ? "linear" : h,
    fill: "both",
    iterations: o + 1,
    direction: r === "reverse" ? "alternate" : "normal"
  };
  return u && (d.pseudoElement = u), t.animate(c, d);
}
function _i(t) {
  return typeof t == "function" && "applyToOptions" in t;
}
function wa({ type: t, ...e }) {
  return _i(t) && Ni() ? t.applyToOptions(e) : (e.duration ?? (e.duration = 300), e.ease ?? (e.ease = "easeOut"), e);
}
class Ca extends An {
  constructor(e) {
    if (super(), this.finishedTime = null, this.isStopped = !1, !e)
      return;
    const { element: n, name: s, keyframes: i, pseudoElement: o, allowFlatten: r = !1, finalKeyframe: a, onComplete: l } = e;
    this.isPseudoElement = !!o, this.allowFlatten = r, this.options = e, hn(typeof e.type != "string");
    const u = wa(e);
    this.animation = Pa(n, s, i, u, o), u.autoplay === !1 && this.animation.pause(), this.animation.onfinish = () => {
      if (this.finishedTime = this.time, !o) {
        const c = Sn(i, this.options, a, this.speed);
        this.updateMotionValue ? this.updateMotionValue(c) : Ta(n, s, c), this.animation.cancel();
      }
      l?.(), this.notifyFinished();
    };
  }
  play() {
    this.isStopped || (this.animation.play(), this.state === "finished" && this.updateFinished());
  }
  pause() {
    this.animation.pause();
  }
  complete() {
    this.animation.finish?.();
  }
  cancel() {
    try {
      this.animation.cancel();
    } catch {
    }
  }
  stop() {
    if (this.isStopped)
      return;
    this.isStopped = !0;
    const { state: e } = this;
    e === "idle" || e === "finished" || (this.updateMotionValue ? this.updateMotionValue() : this.commitStyles(), this.isPseudoElement || this.cancel());
  }
  /**
   * WAAPI doesn't natively have any interruption capabilities.
   *
   * In this method, we commit styles back to the DOM before cancelling
   * the animation.
   *
   * This is designed to be overridden by NativeAnimationExtended, which
   * will create a renderless JS animation and sample it twice to calculate
   * its current value, "previous" value, and therefore allow
   * Motion to also correctly calculate velocity for any subsequent animation
   * while deferring the commit until the next animation frame.
   */
  commitStyles() {
    this.isPseudoElement || this.animation.commitStyles?.();
  }
  get duration() {
    const e = this.animation.effect?.getComputedTiming?.().duration || 0;
    return /* @__PURE__ */ W(Number(e));
  }
  get iterationDuration() {
    const { delay: e = 0 } = this.options || {};
    return this.duration + /* @__PURE__ */ W(e);
  }
  get time() {
    return /* @__PURE__ */ W(Number(this.animation.currentTime) || 0);
  }
  set time(e) {
    this.finishedTime = null, this.animation.currentTime = /* @__PURE__ */ X(e);
  }
  /**
   * The playback speed of the animation.
   * 1 = normal speed, 2 = double speed, 0.5 = half speed.
   */
  get speed() {
    return this.animation.playbackRate;
  }
  set speed(e) {
    e < 0 && (this.finishedTime = null), this.animation.playbackRate = e;
  }
  get state() {
    return this.finishedTime !== null ? "finished" : this.animation.playState;
  }
  get startTime() {
    return Number(this.animation.startTime);
  }
  set startTime(e) {
    this.animation.startTime = e;
  }
  /**
   * Attaches a timeline to the animation, for instance the `ScrollTimeline`.
   */
  attachTimeline({ timeline: e, observe: n }) {
    return this.allowFlatten && this.animation.effect?.updateTiming({ easing: "linear" }), this.animation.onfinish = null, e && ba() ? (this.animation.timeline = e, H) : n(this);
  }
}
const $i = {
  anticipate: Ti,
  backInOut: xi,
  circInOut: Si
};
function Va(t) {
  return t in $i;
}
function Da(t) {
  typeof t.ease == "string" && Va(t.ease) && (t.ease = $i[t.ease]);
}
const is = 10;
class Ma extends Ca {
  constructor(e) {
    Da(e), Ii(e), super(e), e.startTime && (this.startTime = e.startTime), this.options = e;
  }
  /**
   * WAAPI doesn't natively have any interruption capabilities.
   *
   * Rather than read commited styles back out of the DOM, we can
   * create a renderless JS animation and sample it twice to calculate
   * its current value, "previous" value, and therefore allow
   * Motion to calculate velocity for any subsequent animation.
   */
  updateMotionValue(e) {
    const { motionValue: n, onUpdate: s, onComplete: i, element: o, ...r } = this.options;
    if (!n)
      return;
    if (e !== void 0) {
      n.set(e);
      return;
    }
    const a = new Pn({
      ...r,
      autoplay: !1
    }), l = /* @__PURE__ */ X(this.finishedTime ?? this.time);
    n.setWithVelocity(a.sample(l - is).value, a.sample(l).value, is), a.stop();
  }
}
const rs = (t, e) => e === "zIndex" ? !1 : !!(typeof t == "number" || Array.isArray(t) || typeof t == "string" && // It's animatable if we have a string
(nt.test(t) || t === "0") && // And it contains numbers and/or colors
!t.startsWith("url("));
function Ea(t) {
  const e = t[0];
  if (t.length === 1)
    return !0;
  for (let n = 0; n < t.length; n++)
    if (t[n] !== e)
      return !0;
}
function Ra(t, e, n, s) {
  const i = t[0];
  if (i === null)
    return !1;
  if (e === "display" || e === "visibility")
    return !0;
  const o = t[t.length - 1], r = rs(i, e), a = rs(o, e);
  return !r || !a ? !1 : Ea(t) || (n === "spring" || _i(n)) && s;
}
function ze(t) {
  t.duration = 0, t.type = "keyframes";
}
const La = /* @__PURE__ */ new Set([
  "opacity",
  "clipPath",
  "filter",
  "transform"
  // TODO: Could be re-enabled now we have support for linear() easing
  // "background-color"
]), ja = /* @__PURE__ */ dn(() => Object.hasOwnProperty.call(Element.prototype, "animate"));
function ka(t) {
  const { motionValue: e, name: n, repeatDelay: s, repeatType: i, damping: o, type: r } = t;
  if (!(e?.owner?.current instanceof HTMLElement))
    return !1;
  const { onUpdate: l, transformTemplate: u } = e.owner.getProps();
  return ja() && n && La.has(n) && (n !== "transform" || !u) && /**
   * If we're outputting values to onUpdate then we can't use WAAPI as there's
   * no way to read the value from WAAPI every frame.
   */
  !l && !s && i !== "mirror" && o !== 0 && r !== "inertia";
}
const Ba = 40;
class Ia extends An {
  constructor({ autoplay: e = !0, delay: n = 0, type: s = "keyframes", repeat: i = 0, repeatDelay: o = 0, repeatType: r = "loop", keyframes: a, name: l, motionValue: u, element: c, ...h }) {
    super(), this.stop = () => {
      this._animation && (this._animation.stop(), this.stopTimeline?.()), this.keyframeResolver?.cancel();
    }, this.createdAt = K.now();
    const d = {
      autoplay: e,
      delay: n,
      type: s,
      repeat: i,
      repeatDelay: o,
      repeatType: r,
      name: l,
      motionValue: u,
      element: c,
      ...h
    }, f = c?.KeyframeResolver || wn;
    this.keyframeResolver = new f(a, (m, x, S) => this.onKeyframesResolved(m, x, d, !S), l, u, c), this.keyframeResolver?.scheduleResolve();
  }
  onKeyframesResolved(e, n, s, i) {
    this.keyframeResolver = void 0;
    const { name: o, type: r, velocity: a, delay: l, isHandoff: u, onUpdate: c } = s;
    this.resolvedAt = K.now(), Ra(e, o, r, a) || ((q.instantAnimations || !l) && c?.(Sn(e, s, n)), e[0] = e[e.length - 1], ze(s), s.repeat = 0);
    const d = {
      startTime: i ? this.resolvedAt ? this.resolvedAt - this.createdAt > Ba ? this.resolvedAt : this.createdAt : this.createdAt : void 0,
      finalKeyframe: n,
      ...s,
      keyframes: e
    }, f = !u && ka(d) ? new Ma({
      ...d,
      element: d.motionValue.owner.current
    }) : new Pn(d);
    f.finished.then(() => this.notifyFinished()).catch(H), this.pendingTimeline && (this.stopTimeline = f.attachTimeline(this.pendingTimeline), this.pendingTimeline = void 0), this._animation = f;
  }
  get finished() {
    return this._animation ? this.animation.finished : this._finished;
  }
  then(e, n) {
    return this.finished.finally(e).then(() => {
    });
  }
  get animation() {
    return this._animation || (this.keyframeResolver?.resume(), va()), this._animation;
  }
  get duration() {
    return this.animation.duration;
  }
  get iterationDuration() {
    return this.animation.iterationDuration;
  }
  get time() {
    return this.animation.time;
  }
  set time(e) {
    this.animation.time = e;
  }
  get speed() {
    return this.animation.speed;
  }
  get state() {
    return this.animation.state;
  }
  set speed(e) {
    this.animation.speed = e;
  }
  get startTime() {
    return this.animation.startTime;
  }
  attachTimeline(e) {
    return this._animation ? this.stopTimeline = this.animation.attachTimeline(e) : this.pendingTimeline = e, () => this.stop();
  }
  play() {
    this.animation.play();
  }
  pause() {
    this.animation.pause();
  }
  complete() {
    this.animation.complete();
  }
  cancel() {
    this._animation && this.animation.cancel(), this.keyframeResolver?.cancel();
  }
}
const Oa = (
  // eslint-disable-next-line redos-detector/no-unsafe-regex -- false positive, as it can match a lot of words
  /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u
);
function Fa(t) {
  const e = Oa.exec(t);
  if (!e)
    return [,];
  const [, n, s, i] = e;
  return [`--${n ?? s}`, i];
}
function Ui(t, e, n = 1) {
  const [s, i] = Fa(t);
  if (!s)
    return;
  const o = window.getComputedStyle(e).getPropertyValue(s);
  if (o) {
    const r = o.trim();
    return hi(r) ? parseFloat(r) : r;
  }
  return gn(i) ? Ui(i, e, n + 1) : i;
}
function Cn(t, e) {
  return t?.[e] ?? t?.default ?? t;
}
const Wi = /* @__PURE__ */ new Set([
  "width",
  "height",
  "top",
  "left",
  "right",
  "bottom",
  ...Ct
]), Na = {
  test: (t) => t === "auto",
  parse: (t) => t
}, Hi = (t) => (e) => e.test(t), Gi = [wt, P, J, Z, Eo, Mo, Na], os = (t) => Gi.find(Hi(t));
function Ka(t) {
  return typeof t == "number" ? t === 0 : t !== null ? t === "none" || t === "0" || fi(t) : !0;
}
const _a = /* @__PURE__ */ new Set(["brightness", "contrast", "saturate", "opacity"]);
function $a(t) {
  const [e, n] = t.slice(0, -1).split("(");
  if (e === "drop-shadow")
    return t;
  const [s] = n.match(vn) || [];
  if (!s)
    return t;
  const i = n.replace(s, "");
  let o = _a.has(e) ? 1 : 0;
  return s !== n && (o *= 100), e + "(" + o + i + ")";
}
const Ua = /\b([a-z-]*)\(.*?\)/gu, Ye = {
  ...nt,
  getAnimatableNone: (t) => {
    const e = t.match(Ua);
    return e ? e.map($a).join(" ") : t;
  }
}, as = {
  ...wt,
  transform: Math.round
}, Wa = {
  rotate: Z,
  rotateX: Z,
  rotateY: Z,
  rotateZ: Z,
  scale: Xt,
  scaleX: Xt,
  scaleY: Xt,
  scaleZ: Xt,
  skew: Z,
  skewX: Z,
  skewY: Z,
  distance: P,
  translateX: P,
  translateY: P,
  translateZ: P,
  x: P,
  y: P,
  z: P,
  perspective: P,
  transformPerspective: P,
  opacity: Ot,
  originX: Yn,
  originY: Yn,
  originZ: P
}, Vn = {
  // Border props
  borderWidth: P,
  borderTopWidth: P,
  borderRightWidth: P,
  borderBottomWidth: P,
  borderLeftWidth: P,
  borderRadius: P,
  radius: P,
  borderTopLeftRadius: P,
  borderTopRightRadius: P,
  borderBottomRightRadius: P,
  borderBottomLeftRadius: P,
  // Positioning props
  width: P,
  maxWidth: P,
  height: P,
  maxHeight: P,
  top: P,
  right: P,
  bottom: P,
  left: P,
  // Spacing props
  padding: P,
  paddingTop: P,
  paddingRight: P,
  paddingBottom: P,
  paddingLeft: P,
  margin: P,
  marginTop: P,
  marginRight: P,
  marginBottom: P,
  marginLeft: P,
  // Misc
  backgroundPositionX: P,
  backgroundPositionY: P,
  ...Wa,
  zIndex: as,
  // SVG
  fillOpacity: Ot,
  strokeOpacity: Ot,
  numOctaves: as
}, Ha = {
  ...Vn,
  // Color props
  color: L,
  backgroundColor: L,
  outlineColor: L,
  fill: L,
  stroke: L,
  // Border props
  borderColor: L,
  borderTopColor: L,
  borderRightColor: L,
  borderBottomColor: L,
  borderLeftColor: L,
  filter: Ye,
  WebkitFilter: Ye
}, zi = (t) => Ha[t];
function Yi(t, e) {
  let n = zi(t);
  return n !== Ye && (n = nt), n.getAnimatableNone ? n.getAnimatableNone(e) : void 0;
}
const Ga = /* @__PURE__ */ new Set(["auto", "none", "0"]);
function za(t, e, n) {
  let s = 0, i;
  for (; s < t.length && !i; ) {
    const o = t[s];
    typeof o == "string" && !Ga.has(o) && Ft(o).values.length && (i = t[s]), s++;
  }
  if (i && n)
    for (const o of e)
      t[o] = Yi(n, i);
}
class Ya extends wn {
  constructor(e, n, s, i, o) {
    super(e, n, s, i, o, !0);
  }
  readKeyframes() {
    const { unresolvedKeyframes: e, element: n, name: s } = this;
    if (!n || !n.current)
      return;
    super.readKeyframes();
    for (let l = 0; l < e.length; l++) {
      let u = e[l];
      if (typeof u == "string" && (u = u.trim(), gn(u))) {
        const c = Ui(u, n.current);
        c !== void 0 && (e[l] = c), l === e.length - 1 && (this.finalKeyframe = u);
      }
    }
    if (this.resolveNoneKeyframes(), !Wi.has(s) || e.length !== 2)
      return;
    const [i, o] = e, r = os(i), a = os(o);
    if (r !== a)
      if (ns(r) && ns(a))
        for (let l = 0; l < e.length; l++) {
          const u = e[l];
          typeof u == "string" && (e[l] = parseFloat(u));
        }
      else ut[s] && (this.needsMeasurement = !0);
  }
  resolveNoneKeyframes() {
    const { unresolvedKeyframes: e, name: n } = this, s = [];
    for (let i = 0; i < e.length; i++)
      (e[i] === null || Ka(e[i])) && s.push(i);
    s.length && za(e, s, n);
  }
  measureInitialState() {
    const { element: e, unresolvedKeyframes: n, name: s } = this;
    if (!e || !e.current)
      return;
    s === "height" && (this.suspendedScrollY = window.pageYOffset), this.measuredOrigin = ut[s](e.measureViewportBox(), window.getComputedStyle(e.current)), n[0] = this.measuredOrigin;
    const i = n[n.length - 1];
    i !== void 0 && e.getValue(s, i).jump(i, !1);
  }
  measureEndState() {
    const { element: e, name: n, unresolvedKeyframes: s } = this;
    if (!e || !e.current)
      return;
    const i = e.getValue(n);
    i && i.jump(this.measuredOrigin, !1);
    const o = s.length - 1, r = s[o];
    s[o] = ut[n](e.measureViewportBox(), window.getComputedStyle(e.current)), r !== null && this.finalKeyframe === void 0 && (this.finalKeyframe = r), this.removedTransforms?.length && this.removedTransforms.forEach(([a, l]) => {
      e.getValue(a).set(l);
    }), this.resolveNoneKeyframes();
  }
}
function Xa(t, e, n) {
  if (t instanceof EventTarget)
    return [t];
  if (typeof t == "string") {
    let s = document;
    const i = n?.[t] ?? s.querySelectorAll(t);
    return i ? Array.from(i) : [];
  }
  return Array.from(t);
}
const Xi = (t, e) => e && typeof t == "number" ? e.transform(t) : t;
function Ji(t) {
  return di(t) && "offsetHeight" in t;
}
const ls = 30, Ja = (t) => !isNaN(parseFloat(t));
class Qa {
  /**
   * @param init - The initiating value
   * @param config - Optional configuration options
   *
   * -  `transformer`: A function to transform incoming values with.
   */
  constructor(e, n = {}) {
    this.canTrackVelocity = null, this.events = {}, this.updateAndNotify = (s) => {
      const i = K.now();
      if (this.updatedAt !== i && this.setPrevFrameValue(), this.prev = this.current, this.setCurrent(s), this.current !== this.prev && (this.events.change?.notify(this.current), this.dependents))
        for (const o of this.dependents)
          o.dirty();
    }, this.hasAnimated = !1, this.setCurrent(e), this.owner = n.owner;
  }
  setCurrent(e) {
    this.current = e, this.updatedAt = K.now(), this.canTrackVelocity === null && e !== void 0 && (this.canTrackVelocity = Ja(this.current));
  }
  setPrevFrameValue(e = this.current) {
    this.prevFrameValue = e, this.prevUpdatedAt = this.updatedAt;
  }
  /**
   * Adds a function that will be notified when the `MotionValue` is updated.
   *
   * It returns a function that, when called, will cancel the subscription.
   *
   * When calling `onChange` inside a React component, it should be wrapped with the
   * `useEffect` hook. As it returns an unsubscribe function, this should be returned
   * from the `useEffect` function to ensure you don't add duplicate subscribers..
   *
   * ```jsx
   * export const MyComponent = () => {
   *   const x = useMotionValue(0)
   *   const y = useMotionValue(0)
   *   const opacity = useMotionValue(1)
   *
   *   useEffect(() => {
   *     function updateOpacity() {
   *       const maxXY = Math.max(x.get(), y.get())
   *       const newOpacity = transform(maxXY, [0, 100], [1, 0])
   *       opacity.set(newOpacity)
   *     }
   *
   *     const unsubscribeX = x.on("change", updateOpacity)
   *     const unsubscribeY = y.on("change", updateOpacity)
   *
   *     return () => {
   *       unsubscribeX()
   *       unsubscribeY()
   *     }
   *   }, [])
   *
   *   return <motion.div style={{ x }} />
   * }
   * ```
   *
   * @param subscriber - A function that receives the latest value.
   * @returns A function that, when called, will cancel this subscription.
   *
   * @deprecated
   */
  onChange(e) {
    return this.on("change", e);
  }
  on(e, n) {
    this.events[e] || (this.events[e] = new fn());
    const s = this.events[e].add(n);
    return e === "change" ? () => {
      s(), V.read(() => {
        this.events.change.getSize() || this.stop();
      });
    } : s;
  }
  clearListeners() {
    for (const e in this.events)
      this.events[e].clear();
  }
  /**
   * Attaches a passive effect to the `MotionValue`.
   */
  attach(e, n) {
    this.passiveEffect = e, this.stopPassiveEffect = n;
  }
  /**
   * Sets the state of the `MotionValue`.
   *
   * @remarks
   *
   * ```jsx
   * const x = useMotionValue(0)
   * x.set(10)
   * ```
   *
   * @param latest - Latest value to set.
   * @param render - Whether to notify render subscribers. Defaults to `true`
   *
   * @public
   */
  set(e) {
    this.passiveEffect ? this.passiveEffect(e, this.updateAndNotify) : this.updateAndNotify(e);
  }
  setWithVelocity(e, n, s) {
    this.set(n), this.prev = void 0, this.prevFrameValue = e, this.prevUpdatedAt = this.updatedAt - s;
  }
  /**
   * Set the state of the `MotionValue`, stopping any active animations,
   * effects, and resets velocity to `0`.
   */
  jump(e, n = !0) {
    this.updateAndNotify(e), this.prev = e, this.prevUpdatedAt = this.prevFrameValue = void 0, n && this.stop(), this.stopPassiveEffect && this.stopPassiveEffect();
  }
  dirty() {
    this.events.change?.notify(this.current);
  }
  addDependent(e) {
    this.dependents || (this.dependents = /* @__PURE__ */ new Set()), this.dependents.add(e);
  }
  removeDependent(e) {
    this.dependents && this.dependents.delete(e);
  }
  /**
   * Returns the latest state of `MotionValue`
   *
   * @returns - The latest state of `MotionValue`
   *
   * @public
   */
  get() {
    return this.current;
  }
  /**
   * @public
   */
  getPrevious() {
    return this.prev;
  }
  /**
   * Returns the latest velocity of `MotionValue`
   *
   * @returns - The latest velocity of `MotionValue`. Returns `0` if the state is non-numerical.
   *
   * @public
   */
  getVelocity() {
    const e = K.now();
    if (!this.canTrackVelocity || this.prevFrameValue === void 0 || e - this.updatedAt > ls)
      return 0;
    const n = Math.min(this.updatedAt - this.prevUpdatedAt, ls);
    return pi(parseFloat(this.current) - parseFloat(this.prevFrameValue), n);
  }
  /**
   * Registers a new animation to control this `MotionValue`. Only one
   * animation can drive a `MotionValue` at one time.
   *
   * ```jsx
   * value.start()
   * ```
   *
   * @param animation - A function that starts the provided animation
   */
  start(e) {
    return this.stop(), new Promise((n) => {
      this.hasAnimated = !0, this.animation = e(n), this.events.animationStart && this.events.animationStart.notify();
    }).then(() => {
      this.events.animationComplete && this.events.animationComplete.notify(), this.clearAnimation();
    });
  }
  /**
   * Stop the currently active animation.
   *
   * @public
   */
  stop() {
    this.animation && (this.animation.stop(), this.events.animationCancel && this.events.animationCancel.notify()), this.clearAnimation();
  }
  /**
   * Returns `true` if this value is currently animating.
   *
   * @public
   */
  isAnimating() {
    return !!this.animation;
  }
  clearAnimation() {
    delete this.animation;
  }
  /**
   * Destroy and clean up subscribers to this `MotionValue`.
   *
   * The `MotionValue` hooks like `useMotionValue` and `useTransform` automatically
   * handle the lifecycle of the returned `MotionValue`, so this method is only necessary if you've manually
   * created a `MotionValue` via the `motionValue` function.
   *
   * @public
   */
  destroy() {
    this.dependents?.clear(), this.events.destroy?.notify(), this.clearListeners(), this.stop(), this.stopPassiveEffect && this.stopPassiveEffect();
  }
}
function St(t, e) {
  return new Qa(t, e);
}
const { schedule: Dn } = /* @__PURE__ */ wi(queueMicrotask, !1), G = {
  x: !1,
  y: !1
};
function Qi() {
  return G.x || G.y;
}
function qa(t) {
  return t === "x" || t === "y" ? G[t] ? null : (G[t] = !0, () => {
    G[t] = !1;
  }) : G.x || G.y ? null : (G.x = G.y = !0, () => {
    G.x = G.y = !1;
  });
}
function qi(t, e) {
  const n = Xa(t), s = new AbortController(), i = {
    passive: !0,
    ...e,
    signal: s.signal
  };
  return [n, i, () => s.abort()];
}
function cs(t) {
  return !(t.pointerType === "touch" || Qi());
}
function Za(t, e, n = {}) {
  const [s, i, o] = qi(t, n), r = (a) => {
    if (!cs(a))
      return;
    const { target: l } = a, u = e(l, a);
    if (typeof u != "function" || !l)
      return;
    const c = (h) => {
      cs(h) && (u(h), l.removeEventListener("pointerleave", c));
    };
    l.addEventListener("pointerleave", c, i);
  };
  return s.forEach((a) => {
    a.addEventListener("pointerenter", r, i);
  }), o;
}
const Zi = (t, e) => e ? t === e ? !0 : Zi(t, e.parentElement) : !1, Mn = (t) => t.pointerType === "mouse" ? typeof t.button != "number" || t.button <= 0 : t.isPrimary !== !1, tl = /* @__PURE__ */ new Set([
  "BUTTON",
  "INPUT",
  "SELECT",
  "TEXTAREA",
  "A"
]);
function el(t) {
  return tl.has(t.tagName) || t.tabIndex !== -1;
}
const te = /* @__PURE__ */ new WeakSet();
function us(t) {
  return (e) => {
    e.key === "Enter" && t(e);
  };
}
function Ce(t, e) {
  t.dispatchEvent(new PointerEvent("pointer" + e, { isPrimary: !0, bubbles: !0 }));
}
const nl = (t, e) => {
  const n = t.currentTarget;
  if (!n)
    return;
  const s = us(() => {
    if (te.has(n))
      return;
    Ce(n, "down");
    const i = us(() => {
      Ce(n, "up");
    }), o = () => Ce(n, "cancel");
    n.addEventListener("keyup", i, e), n.addEventListener("blur", o, e);
  });
  n.addEventListener("keydown", s, e), n.addEventListener("blur", () => n.removeEventListener("keydown", s), e);
};
function hs(t) {
  return Mn(t) && !Qi();
}
function sl(t, e, n = {}) {
  const [s, i, o] = qi(t, n), r = (a) => {
    const l = a.currentTarget;
    if (!hs(a))
      return;
    te.add(l);
    const u = e(l, a), c = (f, m) => {
      window.removeEventListener("pointerup", h), window.removeEventListener("pointercancel", d), te.has(l) && te.delete(l), hs(f) && typeof u == "function" && u(f, { success: m });
    }, h = (f) => {
      c(f, l === window || l === document || n.useGlobalTarget || Zi(l, f.target));
    }, d = (f) => {
      c(f, !1);
    };
    window.addEventListener("pointerup", h, i), window.addEventListener("pointercancel", d, i);
  };
  return s.forEach((a) => {
    (n.useGlobalTarget ? window : a).addEventListener("pointerdown", r, i), Ji(a) && (a.addEventListener("focus", (u) => nl(u, i)), !el(a) && !a.hasAttribute("tabindex") && (a.tabIndex = 0));
  }), o;
}
function tr(t) {
  return di(t) && "ownerSVGElement" in t;
}
function il(t) {
  return tr(t) && t.tagName === "svg";
}
const O = (t) => !!(t && t.getVelocity), rl = [...Gi, L, nt], ol = (t) => rl.find(Hi(t)), En = Pt({
  transformPagePoint: (t) => t,
  isStatic: !1,
  reducedMotion: "never"
});
function ds(t, e) {
  if (typeof t == "function")
    return t(e);
  t != null && (t.current = e);
}
function al(...t) {
  return (e) => {
    let n = !1;
    const s = t.map((i) => {
      const o = ds(i, e);
      return !n && typeof o == "function" && (n = !0), o;
    });
    if (n)
      return () => {
        for (let i = 0; i < s.length; i++) {
          const o = s[i];
          typeof o == "function" ? o() : ds(t[i], null);
        }
      };
  };
}
function ll(...t) {
  return fe.useCallback(al(...t), t);
}
class cl extends fe.Component {
  getSnapshotBeforeUpdate(e) {
    const n = this.props.childRef.current;
    if (n && e.isPresent && !this.props.isPresent) {
      const s = n.offsetParent, i = Ji(s) && s.offsetWidth || 0, o = this.props.sizeRef.current;
      o.height = n.offsetHeight || 0, o.width = n.offsetWidth || 0, o.top = n.offsetTop, o.left = n.offsetLeft, o.right = i - o.width - o.left;
    }
    return null;
  }
  /**
   * Required with getSnapshotBeforeUpdate to stop React complaining.
   */
  componentDidUpdate() {
  }
  render() {
    return this.props.children;
  }
}
function ul({ children: t, isPresent: e, anchorX: n, root: s }) {
  const i = sn(), o = tt(null), r = tt({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    right: 0
  }), { nonce: a } = I(En), l = ll(o, t?.ref);
  return ai(() => {
    const { width: u, height: c, top: h, left: d, right: f } = r.current;
    if (e || !o.current || !u || !c)
      return;
    const m = n === "left" ? `left: ${d}` : `right: ${f}`;
    o.current.dataset.motionPopId = i;
    const x = document.createElement("style");
    a && (x.nonce = a);
    const S = s ?? document.head;
    return S.appendChild(x), x.sheet && x.sheet.insertRule(`
          [data-motion-pop-id="${i}"] {
            position: absolute !important;
            width: ${u}px !important;
            height: ${c}px !important;
            ${m}px !important;
            top: ${h}px !important;
          }
        `), () => {
      S.contains(x) && S.removeChild(x);
    };
  }, [e]), p.jsx(cl, { isPresent: e, childRef: o, sizeRef: r, children: fe.cloneElement(t, { ref: l }) });
}
const hl = ({ children: t, initial: e, isPresent: n, onExitComplete: s, custom: i, presenceAffectsLayout: o, mode: r, anchorX: a, root: l }) => {
  const u = an(dl), c = sn();
  let h = !0, d = dt(() => (h = !1, {
    id: c,
    initial: e,
    isPresent: n,
    custom: i,
    onExitComplete: (f) => {
      u.set(f, !0);
      for (const m of u.values())
        if (!m)
          return;
      s && s();
    },
    register: (f) => (u.set(f, !1), () => u.delete(f))
  }), [n, u, s]);
  return o && h && (d = { ...d }), dt(() => {
    u.forEach((f, m) => u.set(m, !1));
  }, [n]), fe.useEffect(() => {
    !n && !u.size && s && s();
  }, [n]), r === "popLayout" && (t = p.jsx(ul, { isPresent: n, anchorX: a, root: l, children: t })), p.jsx(me.Provider, { value: d, children: t });
};
function dl() {
  return /* @__PURE__ */ new Map();
}
function er(t = !0) {
  const e = I(me);
  if (e === null)
    return [!0, null];
  const { isPresent: n, onExitComplete: s, register: i } = e, o = sn();
  pe(() => {
    if (t)
      return i(o);
  }, [t]);
  const r = li(() => t && s && s(o), [o, s, t]);
  return !n && s ? [!1, r] : [!0];
}
const Jt = (t) => t.key || "";
function fs(t) {
  const e = [];
  return Xr.forEach(t, (n) => {
    Jr(n) && e.push(n);
  }), e;
}
const ae = ({ children: t, custom: e, initial: n = !0, onExitComplete: s, presenceAffectsLayout: i = !0, mode: o = "sync", propagate: r = !1, anchorX: a = "left", root: l }) => {
  const [u, c] = er(r), h = dt(() => fs(t), [t]), d = r && !u ? [] : h.map(Jt), f = tt(!0), m = tt(h), x = an(() => /* @__PURE__ */ new Map()), [S, g] = se(h), [b, T] = se(h);
  ui(() => {
    f.current = !1, m.current = h;
    for (let v = 0; v < b.length; v++) {
      const C = Jt(b[v]);
      d.includes(C) ? x.delete(C) : x.get(C) !== !0 && x.set(C, !1);
    }
  }, [b, d.length, d.join("-")]);
  const w = [];
  if (h !== S) {
    let v = [...h];
    for (let C = 0; C < b.length; C++) {
      const A = b[C], E = Jt(A);
      d.includes(E) || (v.splice(C, 0, A), w.push(A));
    }
    return o === "wait" && w.length && (v = w), T(fs(v)), g(h), null;
  }
  const { forceRender: y } = I(on);
  return p.jsx(p.Fragment, { children: b.map((v) => {
    const C = Jt(v), A = r && !u ? !1 : h === b || d.includes(C), E = () => {
      if (x.has(C))
        x.set(C, !0);
      else
        return;
      let j = !0;
      x.forEach((z) => {
        z || (j = !1);
      }), j && (y?.(), T(m.current), r && c?.(), s && s());
    };
    return p.jsx(hl, { isPresent: A, initial: !f.current || n ? void 0 : !1, custom: e, presenceAffectsLayout: i, mode: o, root: l, onExitComplete: A ? void 0 : E, anchorX: a, children: v }, C);
  }) });
}, nr = Pt({ strict: !1 }), ps = {
  animation: [
    "animate",
    "variants",
    "whileHover",
    "whileTap",
    "exit",
    "whileInView",
    "whileFocus",
    "whileDrag"
  ],
  exit: ["exit"],
  drag: ["drag", "dragControls"],
  focus: ["whileFocus"],
  hover: ["whileHover", "onHoverStart", "onHoverEnd"],
  tap: ["whileTap", "onTap", "onTapStart", "onTapCancel"],
  pan: ["onPan", "onPanStart", "onPanSessionStart", "onPanEnd"],
  inView: ["whileInView", "onViewportEnter", "onViewportLeave"],
  layout: ["layout", "layoutId"]
}, At = {};
for (const t in ps)
  At[t] = {
    isEnabled: (e) => ps[t].some((n) => !!e[n])
  };
function fl(t) {
  for (const e in t)
    At[e] = {
      ...At[e],
      ...t[e]
    };
}
const pl = /* @__PURE__ */ new Set([
  "animate",
  "exit",
  "variants",
  "initial",
  "style",
  "values",
  "variants",
  "transition",
  "transformTemplate",
  "custom",
  "inherit",
  "onBeforeLayoutMeasure",
  "onAnimationStart",
  "onAnimationComplete",
  "onUpdate",
  "onDragStart",
  "onDrag",
  "onDragEnd",
  "onMeasureDragConstraints",
  "onDirectionLock",
  "onDragTransitionEnd",
  "_dragX",
  "_dragY",
  "onHoverStart",
  "onHoverEnd",
  "onViewportEnter",
  "onViewportLeave",
  "globalTapTarget",
  "ignoreStrict",
  "viewport"
]);
function le(t) {
  return t.startsWith("while") || t.startsWith("drag") && t !== "draggable" || t.startsWith("layout") || t.startsWith("onTap") || t.startsWith("onPan") || t.startsWith("onLayout") || pl.has(t);
}
let sr = (t) => !le(t);
function ml(t) {
  typeof t == "function" && (sr = (e) => e.startsWith("on") ? !le(e) : t(e));
}
try {
  ml(require("@emotion/is-prop-valid").default);
} catch {
}
function yl(t, e, n) {
  const s = {};
  for (const i in t)
    i === "values" && typeof t.values == "object" || (sr(i) || n === !0 && le(i) || !e && !le(i) || // If trying to use native HTML drag events, forward drag listeners
    t.draggable && i.startsWith("onDrag")) && (s[i] = t[i]);
  return s;
}
const ye = /* @__PURE__ */ Pt({});
function ge(t) {
  return t !== null && typeof t == "object" && typeof t.start == "function";
}
function Nt(t) {
  return typeof t == "string" || Array.isArray(t);
}
const Rn = [
  "animate",
  "whileInView",
  "whileFocus",
  "whileHover",
  "whileTap",
  "whileDrag",
  "exit"
], Ln = ["initial", ...Rn];
function ve(t) {
  return ge(t.animate) || Ln.some((e) => Nt(t[e]));
}
function ir(t) {
  return !!(ve(t) || t.variants);
}
function gl(t, e) {
  if (ve(t)) {
    const { initial: n, animate: s } = t;
    return {
      initial: n === !1 || Nt(n) ? n : void 0,
      animate: Nt(s) ? s : void 0
    };
  }
  return t.inherit !== !1 ? e : {};
}
function vl(t) {
  const { initial: e, animate: n } = gl(t, I(ye));
  return dt(() => ({ initial: e, animate: n }), [ms(e), ms(n)]);
}
function ms(t) {
  return Array.isArray(t) ? t.join(" ") : t;
}
const Kt = {};
function xl(t) {
  for (const e in t)
    Kt[e] = t[e], yn(e) && (Kt[e].isCSSVariable = !0);
}
function rr(t, { layout: e, layoutId: n }) {
  return Vt.has(t) || t.startsWith("origin") || (e || n !== void 0) && (!!Kt[t] || t === "opacity");
}
const Tl = {
  x: "translateX",
  y: "translateY",
  z: "translateZ",
  transformPerspective: "perspective"
}, bl = Ct.length;
function Sl(t, e, n) {
  let s = "", i = !0;
  for (let o = 0; o < bl; o++) {
    const r = Ct[o], a = t[r];
    if (a === void 0)
      continue;
    let l = !0;
    if (typeof a == "number" ? l = a === (r.startsWith("scale") ? 1 : 0) : l = parseFloat(a) === 0, !l || n) {
      const u = Xi(a, Vn[r]);
      if (!l) {
        i = !1;
        const c = Tl[r] || r;
        s += `${c}(${u}) `;
      }
      n && (e[r] = u);
    }
  }
  return s = s.trim(), n ? s = n(e, i ? "" : s) : i && (s = "none"), s;
}
function jn(t, e, n) {
  const { style: s, vars: i, transformOrigin: o } = t;
  let r = !1, a = !1;
  for (const l in e) {
    const u = e[l];
    if (Vt.has(l)) {
      r = !0;
      continue;
    } else if (yn(l)) {
      i[l] = u;
      continue;
    } else {
      const c = Xi(u, Vn[l]);
      l.startsWith("origin") ? (a = !0, o[l] = c) : s[l] = c;
    }
  }
  if (e.transform || (r || n ? s.transform = Sl(e, t.transform, n) : s.transform && (s.transform = "none")), a) {
    const { originX: l = "50%", originY: u = "50%", originZ: c = 0 } = o;
    s.transformOrigin = `${l} ${u} ${c}`;
  }
}
const kn = () => ({
  style: {},
  transform: {},
  transformOrigin: {},
  vars: {}
});
function or(t, e, n) {
  for (const s in e)
    !O(e[s]) && !rr(s, n) && (t[s] = e[s]);
}
function Al({ transformTemplate: t }, e) {
  return dt(() => {
    const n = kn();
    return jn(n, e, t), Object.assign({}, n.vars, n.style);
  }, [e]);
}
function Pl(t, e) {
  const n = t.style || {}, s = {};
  return or(s, n, t), Object.assign(s, Al(t, e)), s;
}
function wl(t, e) {
  const n = {}, s = Pl(t, e);
  return t.drag && t.dragListener !== !1 && (n.draggable = !1, s.userSelect = s.WebkitUserSelect = s.WebkitTouchCallout = "none", s.touchAction = t.drag === !0 ? "none" : `pan-${t.drag === "x" ? "y" : "x"}`), t.tabIndex === void 0 && (t.onTap || t.onTapStart || t.whileTap) && (n.tabIndex = 0), n.style = s, n;
}
const Cl = {
  offset: "stroke-dashoffset",
  array: "stroke-dasharray"
}, Vl = {
  offset: "strokeDashoffset",
  array: "strokeDasharray"
};
function Dl(t, e, n = 1, s = 0, i = !0) {
  t.pathLength = 1;
  const o = i ? Cl : Vl;
  t[o.offset] = P.transform(-s);
  const r = P.transform(e), a = P.transform(n);
  t[o.array] = `${r} ${a}`;
}
function ar(t, {
  attrX: e,
  attrY: n,
  attrScale: s,
  pathLength: i,
  pathSpacing: o = 1,
  pathOffset: r = 0,
  // This is object creation, which we try to avoid per-frame.
  ...a
}, l, u, c) {
  if (jn(t, a, u), l) {
    t.style.viewBox && (t.attrs.viewBox = t.style.viewBox);
    return;
  }
  t.attrs = t.style, t.style = {};
  const { attrs: h, style: d } = t;
  h.transform && (d.transform = h.transform, delete h.transform), (d.transform || h.transformOrigin) && (d.transformOrigin = h.transformOrigin ?? "50% 50%", delete h.transformOrigin), d.transform && (d.transformBox = c?.transformBox ?? "fill-box", delete h.transformBox), e !== void 0 && (h.x = e), n !== void 0 && (h.y = n), s !== void 0 && (h.scale = s), i !== void 0 && Dl(h, i, o, r, !1);
}
const lr = () => ({
  ...kn(),
  attrs: {}
}), cr = (t) => typeof t == "string" && t.toLowerCase() === "svg";
function Ml(t, e, n, s) {
  const i = dt(() => {
    const o = lr();
    return ar(o, e, cr(s), t.transformTemplate, t.style), {
      ...o.attrs,
      style: { ...o.style }
    };
  }, [e]);
  if (t.style) {
    const o = {};
    or(o, t.style, t), i.style = { ...o, ...i.style };
  }
  return i;
}
const El = [
  "animate",
  "circle",
  "defs",
  "desc",
  "ellipse",
  "g",
  "image",
  "line",
  "filter",
  "marker",
  "mask",
  "metadata",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "rect",
  "stop",
  "switch",
  "symbol",
  "svg",
  "text",
  "tspan",
  "use",
  "view"
];
function Bn(t) {
  return (
    /**
     * If it's not a string, it's a custom React component. Currently we only support
     * HTML custom React components.
     */
    typeof t != "string" || /**
     * If it contains a dash, the element is a custom HTML webcomponent.
     */
    t.includes("-") ? !1 : (
      /**
       * If it's in our list of lowercase SVG tags, it's an SVG component
       */
      !!(El.indexOf(t) > -1 || /**
       * If it contains a capital letter, it's an SVG component
       */
      /[A-Z]/u.test(t))
    )
  );
}
function Rl(t, e, n, { latestValues: s }, i, o = !1) {
  const a = (Bn(t) ? Ml : wl)(e, s, i, t), l = yl(e, typeof t == "string", o), u = t !== ci ? { ...l, ...a, ref: n } : {}, { children: c } = e, h = dt(() => O(c) ? c.get() : c, [c]);
  return Qr(t, {
    ...u,
    children: h
  });
}
function ys(t) {
  const e = [{}, {}];
  return t?.values.forEach((n, s) => {
    e[0][s] = n.get(), e[1][s] = n.getVelocity();
  }), e;
}
function In(t, e, n, s) {
  if (typeof e == "function") {
    const [i, o] = ys(s);
    e = e(n !== void 0 ? n : t.custom, i, o);
  }
  if (typeof e == "string" && (e = t.variants && t.variants[e]), typeof e == "function") {
    const [i, o] = ys(s);
    e = e(n !== void 0 ? n : t.custom, i, o);
  }
  return e;
}
function ee(t) {
  return O(t) ? t.get() : t;
}
function Ll({ scrapeMotionValuesFromProps: t, createRenderState: e }, n, s, i) {
  return {
    latestValues: jl(n, s, i, t),
    renderState: e()
  };
}
function jl(t, e, n, s) {
  const i = {}, o = s(t, {});
  for (const d in o)
    i[d] = ee(o[d]);
  let { initial: r, animate: a } = t;
  const l = ve(t), u = ir(t);
  e && u && !l && t.inherit !== !1 && (r === void 0 && (r = e.initial), a === void 0 && (a = e.animate));
  let c = n ? n.initial === !1 : !1;
  c = c || r === !1;
  const h = c ? a : r;
  if (h && typeof h != "boolean" && !ge(h)) {
    const d = Array.isArray(h) ? h : [h];
    for (let f = 0; f < d.length; f++) {
      const m = In(t, d[f]);
      if (m) {
        const { transitionEnd: x, transition: S, ...g } = m;
        for (const b in g) {
          let T = g[b];
          if (Array.isArray(T)) {
            const w = c ? T.length - 1 : 0;
            T = T[w];
          }
          T !== null && (i[b] = T);
        }
        for (const b in x)
          i[b] = x[b];
      }
    }
  }
  return i;
}
const ur = (t) => (e, n) => {
  const s = I(ye), i = I(me), o = () => Ll(t, e, s, i);
  return n ? o() : an(o);
};
function On(t, e, n) {
  const { style: s } = t, i = {};
  for (const o in s)
    (O(s[o]) || e.style && O(e.style[o]) || rr(o, t) || n?.getValue(o)?.liveStyle !== void 0) && (i[o] = s[o]);
  return i;
}
const kl = /* @__PURE__ */ ur({
  scrapeMotionValuesFromProps: On,
  createRenderState: kn
});
function hr(t, e, n) {
  const s = On(t, e, n);
  for (const i in t)
    if (O(t[i]) || O(e[i])) {
      const o = Ct.indexOf(i) !== -1 ? "attr" + i.charAt(0).toUpperCase() + i.substring(1) : i;
      s[o] = t[i];
    }
  return s;
}
const Bl = /* @__PURE__ */ ur({
  scrapeMotionValuesFromProps: hr,
  createRenderState: lr
}), Il = Symbol.for("motionComponentSymbol");
function gt(t) {
  return t && typeof t == "object" && Object.prototype.hasOwnProperty.call(t, "current");
}
function Ol(t, e, n) {
  return li(
    (s) => {
      s && t.onMount && t.onMount(s), e && (s ? e.mount(s) : e.unmount()), n && (typeof n == "function" ? n(s) : gt(n) && (n.current = s));
    },
    /**
     * Include externalRef in dependencies to ensure the callback updates
     * when the ref changes, allowing proper ref forwarding.
     */
    [e]
  );
}
const Fn = (t) => t.replace(/([a-z])([A-Z])/gu, "$1-$2").toLowerCase(), Fl = "framerAppearId", dr = "data-" + Fn(Fl), fr = Pt({});
function Nl(t, e, n, s, i) {
  const { visualElement: o } = I(ye), r = I(nr), a = I(me), l = I(En).reducedMotion, u = tt(null);
  s = s || r.renderer, !u.current && s && (u.current = s(t, {
    visualState: e,
    parent: o,
    props: n,
    presenceContext: a,
    blockInitialAnimation: a ? a.initial === !1 : !1,
    reducedMotionConfig: l
  }));
  const c = u.current, h = I(fr);
  c && !c.projection && i && (c.type === "html" || c.type === "svg") && Kl(u.current, n, i, h);
  const d = tt(!1);
  ai(() => {
    c && d.current && c.update(n, a);
  });
  const f = n[dr], m = tt(!!f && !window.MotionHandoffIsComplete?.(f) && window.MotionHasOptimisedAnimation?.(f));
  return ui(() => {
    c && (d.current = !0, window.MotionIsMounted = !0, c.updateFeatures(), c.scheduleRenderMicrotask(), m.current && c.animationState && c.animationState.animateChanges());
  }), pe(() => {
    c && (!m.current && c.animationState && c.animationState.animateChanges(), m.current && (queueMicrotask(() => {
      window.MotionHandoffMarkAsComplete?.(f);
    }), m.current = !1), c.enteringChildren = void 0);
  }), c;
}
function Kl(t, e, n, s) {
  const { layoutId: i, layout: o, drag: r, dragConstraints: a, layoutScroll: l, layoutRoot: u, layoutCrossfade: c } = e;
  t.projection = new n(t.latestValues, e["data-framer-portal-id"] ? void 0 : pr(t.parent)), t.projection.setOptions({
    layoutId: i,
    layout: o,
    alwaysMeasureLayout: !!r || a && gt(a),
    visualElement: t,
    /**
     * TODO: Update options in an effect. This could be tricky as it'll be too late
     * to update by the time layout animations run.
     * We also need to fix this safeToRemove by linking it up to the one returned by usePresence,
     * ensuring it gets called if there's no potential layout animations.
     *
     */
    animationType: typeof o == "string" ? o : "both",
    initialPromotionConfig: s,
    crossfade: c,
    layoutScroll: l,
    layoutRoot: u
  });
}
function pr(t) {
  if (t)
    return t.options.allowProjection !== !1 ? t.projection : pr(t.parent);
}
function Ve(t, { forwardMotionProps: e = !1 } = {}, n, s) {
  n && fl(n);
  const i = Bn(t) ? Bl : kl;
  function o(a, l) {
    let u;
    const c = {
      ...I(En),
      ...a,
      layoutId: _l(a)
    }, { isStatic: h } = c, d = vl(a), f = i(a, h);
    if (!h && ln) {
      $l();
      const m = Ul(c);
      u = m.MeasureLayout, d.visualElement = Nl(t, f, c, s, m.ProjectionNode);
    }
    return p.jsxs(ye.Provider, { value: d, children: [u && d.visualElement ? p.jsx(u, { visualElement: d.visualElement, ...c }) : null, Rl(t, a, Ol(f, d.visualElement, l), f, h, e)] });
  }
  o.displayName = `motion.${typeof t == "string" ? t : `create(${t.displayName ?? t.name ?? ""})`}`;
  const r = qr(o);
  return r[Il] = t, r;
}
function _l({ layoutId: t }) {
  const e = I(on).id;
  return e && t !== void 0 ? e + "-" + t : t;
}
function $l(t, e) {
  I(nr).strict;
}
function Ul(t) {
  const { drag: e, layout: n } = At;
  if (!e && !n)
    return {};
  const s = { ...e, ...n };
  return {
    MeasureLayout: e?.isEnabled(t) || n?.isEnabled(t) ? s.MeasureLayout : void 0,
    ProjectionNode: s.ProjectionNode
  };
}
function Wl(t, e) {
  if (typeof Proxy > "u")
    return Ve;
  const n = /* @__PURE__ */ new Map(), s = (o, r) => Ve(o, r, t, e), i = (o, r) => s(o, r);
  return new Proxy(i, {
    /**
     * Called when `motion` is referenced with a prop: `motion.div`, `motion.input` etc.
     * The prop name is passed through as `key` and we can use that to generate a `motion`
     * DOM component with that name.
     */
    get: (o, r) => r === "create" ? s : (n.has(r) || n.set(r, Ve(r, void 0, t, e)), n.get(r))
  });
}
function mr({ top: t, left: e, right: n, bottom: s }) {
  return {
    x: { min: e, max: n },
    y: { min: t, max: s }
  };
}
function Hl({ x: t, y: e }) {
  return { top: e.min, right: t.max, bottom: e.max, left: t.min };
}
function Gl(t, e) {
  if (!e)
    return t;
  const n = e({ x: t.left, y: t.top }), s = e({ x: t.right, y: t.bottom });
  return {
    top: n.y,
    left: n.x,
    bottom: s.y,
    right: s.x
  };
}
function De(t) {
  return t === void 0 || t === 1;
}
function Xe({ scale: t, scaleX: e, scaleY: n }) {
  return !De(t) || !De(e) || !De(n);
}
function ot(t) {
  return Xe(t) || yr(t) || t.z || t.rotate || t.rotateX || t.rotateY || t.skewX || t.skewY;
}
function yr(t) {
  return gs(t.x) || gs(t.y);
}
function gs(t) {
  return t && t !== "0%";
}
function ce(t, e, n) {
  const s = t - n, i = e * s;
  return n + i;
}
function vs(t, e, n, s, i) {
  return i !== void 0 && (t = ce(t, i, s)), ce(t, n, s) + e;
}
function Je(t, e = 0, n = 1, s, i) {
  t.min = vs(t.min, e, n, s, i), t.max = vs(t.max, e, n, s, i);
}
function gr(t, { x: e, y: n }) {
  Je(t.x, e.translate, e.scale, e.originPoint), Je(t.y, n.translate, n.scale, n.originPoint);
}
const xs = 0.999999999999, Ts = 1.0000000000001;
function zl(t, e, n, s = !1) {
  const i = n.length;
  if (!i)
    return;
  e.x = e.y = 1;
  let o, r;
  for (let a = 0; a < i; a++) {
    o = n[a], r = o.projectionDelta;
    const { visualElement: l } = o.options;
    l && l.props.style && l.props.style.display === "contents" || (s && o.options.layoutScroll && o.scroll && o !== o.root && xt(t, {
      x: -o.scroll.offset.x,
      y: -o.scroll.offset.y
    }), r && (e.x *= r.x.scale, e.y *= r.y.scale, gr(t, r)), s && ot(o.latestValues) && xt(t, o.latestValues));
  }
  e.x < Ts && e.x > xs && (e.x = 1), e.y < Ts && e.y > xs && (e.y = 1);
}
function vt(t, e) {
  t.min = t.min + e, t.max = t.max + e;
}
function bs(t, e, n, s, i = 0.5) {
  const o = D(t.min, t.max, i);
  Je(t, e, n, o, s);
}
function xt(t, e) {
  bs(t.x, e.x, e.scaleX, e.scale, e.originX), bs(t.y, e.y, e.scaleY, e.scale, e.originY);
}
function vr(t, e) {
  return mr(Gl(t.getBoundingClientRect(), e));
}
function Yl(t, e, n) {
  const s = vr(t, n), { scroll: i } = e;
  return i && (vt(s.x, i.offset.x), vt(s.y, i.offset.y)), s;
}
const Ss = () => ({
  translate: 0,
  scale: 1,
  origin: 0,
  originPoint: 0
}), Tt = () => ({
  x: Ss(),
  y: Ss()
}), As = () => ({ min: 0, max: 0 }), R = () => ({
  x: As(),
  y: As()
}), Qe = { current: null }, xr = { current: !1 };
function Xl() {
  if (xr.current = !0, !!ln)
    if (window.matchMedia) {
      const t = window.matchMedia("(prefers-reduced-motion)"), e = () => Qe.current = t.matches;
      t.addEventListener("change", e), e();
    } else
      Qe.current = !1;
}
const Jl = /* @__PURE__ */ new WeakMap();
function Ql(t, e, n) {
  for (const s in e) {
    const i = e[s], o = n[s];
    if (O(i))
      t.addValue(s, i);
    else if (O(o))
      t.addValue(s, St(i, { owner: t }));
    else if (o !== i)
      if (t.hasValue(s)) {
        const r = t.getValue(s);
        r.liveStyle === !0 ? r.jump(i) : r.hasAnimated || r.set(i);
      } else {
        const r = t.getStaticValue(s);
        t.addValue(s, St(r !== void 0 ? r : i, { owner: t }));
      }
  }
  for (const s in n)
    e[s] === void 0 && t.removeValue(s);
  return e;
}
const Ps = [
  "AnimationStart",
  "AnimationComplete",
  "Update",
  "BeforeLayoutMeasure",
  "LayoutMeasure",
  "LayoutAnimationStart",
  "LayoutAnimationComplete"
];
class ql {
  /**
   * This method takes React props and returns found MotionValues. For example, HTML
   * MotionValues will be found within the style prop, whereas for Three.js within attribute arrays.
   *
   * This isn't an abstract method as it needs calling in the constructor, but it is
   * intended to be one.
   */
  scrapeMotionValuesFromProps(e, n, s) {
    return {};
  }
  constructor({ parent: e, props: n, presenceContext: s, reducedMotionConfig: i, blockInitialAnimation: o, visualState: r }, a = {}) {
    this.current = null, this.children = /* @__PURE__ */ new Set(), this.isVariantNode = !1, this.isControllingVariants = !1, this.shouldReduceMotion = null, this.values = /* @__PURE__ */ new Map(), this.KeyframeResolver = wn, this.features = {}, this.valueSubscriptions = /* @__PURE__ */ new Map(), this.prevMotionValues = {}, this.events = {}, this.propEventSubscriptions = {}, this.notifyUpdate = () => this.notify("Update", this.latestValues), this.render = () => {
      this.current && (this.triggerBuild(), this.renderInstance(this.current, this.renderState, this.props.style, this.projection));
    }, this.renderScheduledAt = 0, this.scheduleRender = () => {
      const d = K.now();
      this.renderScheduledAt < d && (this.renderScheduledAt = d, V.render(this.render, !1, !0));
    };
    const { latestValues: l, renderState: u } = r;
    this.latestValues = l, this.baseTarget = { ...l }, this.initialValues = n.initial ? { ...l } : {}, this.renderState = u, this.parent = e, this.props = n, this.presenceContext = s, this.depth = e ? e.depth + 1 : 0, this.reducedMotionConfig = i, this.options = a, this.blockInitialAnimation = !!o, this.isControllingVariants = ve(n), this.isVariantNode = ir(n), this.isVariantNode && (this.variantChildren = /* @__PURE__ */ new Set()), this.manuallyAnimateOnMount = !!(e && e.current);
    const { willChange: c, ...h } = this.scrapeMotionValuesFromProps(n, {}, this);
    for (const d in h) {
      const f = h[d];
      l[d] !== void 0 && O(f) && f.set(l[d]);
    }
  }
  mount(e) {
    this.current = e, Jl.set(e, this), this.projection && !this.projection.instance && this.projection.mount(e), this.parent && this.isVariantNode && !this.isControllingVariants && (this.removeFromVariantTree = this.parent.addVariantChild(this)), this.values.forEach((n, s) => this.bindToMotionValue(s, n)), xr.current || Xl(), this.shouldReduceMotion = this.reducedMotionConfig === "never" ? !1 : this.reducedMotionConfig === "always" ? !0 : Qe.current, this.parent?.addChild(this), this.update(this.props, this.presenceContext);
  }
  unmount() {
    this.projection && this.projection.unmount(), et(this.notifyUpdate), et(this.render), this.valueSubscriptions.forEach((e) => e()), this.valueSubscriptions.clear(), this.removeFromVariantTree && this.removeFromVariantTree(), this.parent?.removeChild(this);
    for (const e in this.events)
      this.events[e].clear();
    for (const e in this.features) {
      const n = this.features[e];
      n && (n.unmount(), n.isMounted = !1);
    }
    this.current = null;
  }
  addChild(e) {
    this.children.add(e), this.enteringChildren ?? (this.enteringChildren = /* @__PURE__ */ new Set()), this.enteringChildren.add(e);
  }
  removeChild(e) {
    this.children.delete(e), this.enteringChildren && this.enteringChildren.delete(e);
  }
  bindToMotionValue(e, n) {
    this.valueSubscriptions.has(e) && this.valueSubscriptions.get(e)();
    const s = Vt.has(e);
    s && this.onBindTransform && this.onBindTransform();
    const i = n.on("change", (r) => {
      this.latestValues[e] = r, this.props.onUpdate && V.preRender(this.notifyUpdate), s && this.projection && (this.projection.isTransformDirty = !0), this.scheduleRender();
    });
    let o;
    window.MotionCheckAppearSync && (o = window.MotionCheckAppearSync(this, e, n)), this.valueSubscriptions.set(e, () => {
      i(), o && o(), n.owner && n.stop();
    });
  }
  sortNodePosition(e) {
    return !this.current || !this.sortInstanceNodePosition || this.type !== e.type ? 0 : this.sortInstanceNodePosition(this.current, e.current);
  }
  updateFeatures() {
    let e = "animation";
    for (e in At) {
      const n = At[e];
      if (!n)
        continue;
      const { isEnabled: s, Feature: i } = n;
      if (!this.features[e] && i && s(this.props) && (this.features[e] = new i(this)), this.features[e]) {
        const o = this.features[e];
        o.isMounted ? o.update() : (o.mount(), o.isMounted = !0);
      }
    }
  }
  triggerBuild() {
    this.build(this.renderState, this.latestValues, this.props);
  }
  /**
   * Measure the current viewport box with or without transforms.
   * Only measures axis-aligned boxes, rotate and skew must be manually
   * removed with a re-render to work.
   */
  measureViewportBox() {
    return this.current ? this.measureInstanceViewportBox(this.current, this.props) : R();
  }
  getStaticValue(e) {
    return this.latestValues[e];
  }
  setStaticValue(e, n) {
    this.latestValues[e] = n;
  }
  /**
   * Update the provided props. Ensure any newly-added motion values are
   * added to our map, old ones removed, and listeners updated.
   */
  update(e, n) {
    (e.transformTemplate || this.props.transformTemplate) && this.scheduleRender(), this.prevProps = this.props, this.props = e, this.prevPresenceContext = this.presenceContext, this.presenceContext = n;
    for (let s = 0; s < Ps.length; s++) {
      const i = Ps[s];
      this.propEventSubscriptions[i] && (this.propEventSubscriptions[i](), delete this.propEventSubscriptions[i]);
      const o = "on" + i, r = e[o];
      r && (this.propEventSubscriptions[i] = this.on(i, r));
    }
    this.prevMotionValues = Ql(this, this.scrapeMotionValuesFromProps(e, this.prevProps, this), this.prevMotionValues), this.handleChildMotionValue && this.handleChildMotionValue();
  }
  getProps() {
    return this.props;
  }
  /**
   * Returns the variant definition with a given name.
   */
  getVariant(e) {
    return this.props.variants ? this.props.variants[e] : void 0;
  }
  /**
   * Returns the defined default transition on this component.
   */
  getDefaultTransition() {
    return this.props.transition;
  }
  getTransformPagePoint() {
    return this.props.transformPagePoint;
  }
  getClosestVariantNode() {
    return this.isVariantNode ? this : this.parent ? this.parent.getClosestVariantNode() : void 0;
  }
  /**
   * Add a child visual element to our set of children.
   */
  addVariantChild(e) {
    const n = this.getClosestVariantNode();
    if (n)
      return n.variantChildren && n.variantChildren.add(e), () => n.variantChildren.delete(e);
  }
  /**
   * Add a motion value and bind it to this visual element.
   */
  addValue(e, n) {
    const s = this.values.get(e);
    n !== s && (s && this.removeValue(e), this.bindToMotionValue(e, n), this.values.set(e, n), this.latestValues[e] = n.get());
  }
  /**
   * Remove a motion value and unbind any active subscriptions.
   */
  removeValue(e) {
    this.values.delete(e);
    const n = this.valueSubscriptions.get(e);
    n && (n(), this.valueSubscriptions.delete(e)), delete this.latestValues[e], this.removeValueFromRenderState(e, this.renderState);
  }
  /**
   * Check whether we have a motion value for this key
   */
  hasValue(e) {
    return this.values.has(e);
  }
  getValue(e, n) {
    if (this.props.values && this.props.values[e])
      return this.props.values[e];
    let s = this.values.get(e);
    return s === void 0 && n !== void 0 && (s = St(n === null ? void 0 : n, { owner: this }), this.addValue(e, s)), s;
  }
  /**
   * If we're trying to animate to a previously unencountered value,
   * we need to check for it in our state and as a last resort read it
   * directly from the instance (which might have performance implications).
   */
  readValue(e, n) {
    let s = this.latestValues[e] !== void 0 || !this.current ? this.latestValues[e] : this.getBaseTargetFromProps(this.props, e) ?? this.readValueFromInstance(this.current, e, this.options);
    return s != null && (typeof s == "string" && (hi(s) || fi(s)) ? s = parseFloat(s) : !ol(s) && nt.test(n) && (s = Yi(e, n)), this.setBaseTarget(e, O(s) ? s.get() : s)), O(s) ? s.get() : s;
  }
  /**
   * Set the base target to later animate back to. This is currently
   * only hydrated on creation and when we first read a value.
   */
  setBaseTarget(e, n) {
    this.baseTarget[e] = n;
  }
  /**
   * Find the base target for a value thats been removed from all animation
   * props.
   */
  getBaseTarget(e) {
    const { initial: n } = this.props;
    let s;
    if (typeof n == "string" || typeof n == "object") {
      const o = In(this.props, n, this.presenceContext?.custom);
      o && (s = o[e]);
    }
    if (n && s !== void 0)
      return s;
    const i = this.getBaseTargetFromProps(this.props, e);
    return i !== void 0 && !O(i) ? i : this.initialValues[e] !== void 0 && s === void 0 ? void 0 : this.baseTarget[e];
  }
  on(e, n) {
    return this.events[e] || (this.events[e] = new fn()), this.events[e].add(n);
  }
  notify(e, ...n) {
    this.events[e] && this.events[e].notify(...n);
  }
  scheduleRenderMicrotask() {
    Dn.render(this.render);
  }
}
class Tr extends ql {
  constructor() {
    super(...arguments), this.KeyframeResolver = Ya;
  }
  sortInstanceNodePosition(e, n) {
    return e.compareDocumentPosition(n) & 2 ? 1 : -1;
  }
  getBaseTargetFromProps(e, n) {
    return e.style ? e.style[n] : void 0;
  }
  removeValueFromRenderState(e, { vars: n, style: s }) {
    delete n[e], delete s[e];
  }
  handleChildMotionValue() {
    this.childSubscription && (this.childSubscription(), delete this.childSubscription);
    const { children: e } = this.props;
    O(e) && (this.childSubscription = e.on("change", (n) => {
      this.current && (this.current.textContent = `${n}`);
    }));
  }
}
function br(t, { style: e, vars: n }, s, i) {
  const o = t.style;
  let r;
  for (r in e)
    o[r] = e[r];
  i?.applyProjectionStyles(o, s);
  for (r in n)
    o.setProperty(r, n[r]);
}
function Zl(t) {
  return window.getComputedStyle(t);
}
class tc extends Tr {
  constructor() {
    super(...arguments), this.type = "html", this.renderInstance = br;
  }
  readValueFromInstance(e, n) {
    if (Vt.has(n))
      return this.projection?.isProjecting ? $e(n) : fa(e, n);
    {
      const s = Zl(e), i = (yn(n) ? s.getPropertyValue(n) : s[n]) || 0;
      return typeof i == "string" ? i.trim() : i;
    }
  }
  measureInstanceViewportBox(e, { transformPagePoint: n }) {
    return vr(e, n);
  }
  build(e, n, s) {
    jn(e, n, s.transformTemplate);
  }
  scrapeMotionValuesFromProps(e, n, s) {
    return On(e, n, s);
  }
}
const Sr = /* @__PURE__ */ new Set([
  "baseFrequency",
  "diffuseConstant",
  "kernelMatrix",
  "kernelUnitLength",
  "keySplines",
  "keyTimes",
  "limitingConeAngle",
  "markerHeight",
  "markerWidth",
  "numOctaves",
  "targetX",
  "targetY",
  "surfaceScale",
  "specularConstant",
  "specularExponent",
  "stdDeviation",
  "tableValues",
  "viewBox",
  "gradientTransform",
  "pathLength",
  "startOffset",
  "textLength",
  "lengthAdjust"
]);
function ec(t, e, n, s) {
  br(t, e, void 0, s);
  for (const i in e.attrs)
    t.setAttribute(Sr.has(i) ? i : Fn(i), e.attrs[i]);
}
class nc extends Tr {
  constructor() {
    super(...arguments), this.type = "svg", this.isSVGTag = !1, this.measureInstanceViewportBox = R;
  }
  getBaseTargetFromProps(e, n) {
    return e[n];
  }
  readValueFromInstance(e, n) {
    if (Vt.has(n)) {
      const s = zi(n);
      return s && s.default || 0;
    }
    return n = Sr.has(n) ? n : Fn(n), e.getAttribute(n);
  }
  scrapeMotionValuesFromProps(e, n, s) {
    return hr(e, n, s);
  }
  build(e, n, s) {
    ar(e, n, this.isSVGTag, s.transformTemplate, s.style);
  }
  renderInstance(e, n, s, i) {
    ec(e, n, s, i);
  }
  mount(e) {
    this.isSVGTag = cr(e.tagName), super.mount(e);
  }
}
const sc = (t, e) => Bn(t) ? new nc(e) : new tc(e, {
  allowProjection: t !== ci
});
function bt(t, e, n) {
  const s = t.getProps();
  return In(s, e, n !== void 0 ? n : s.custom, t);
}
const qe = (t) => Array.isArray(t);
function ic(t, e, n) {
  t.hasValue(e) ? t.getValue(e).set(n) : t.addValue(e, St(n));
}
function rc(t) {
  return qe(t) ? t[t.length - 1] || 0 : t;
}
function oc(t, e) {
  const n = bt(t, e);
  let { transitionEnd: s = {}, transition: i = {}, ...o } = n || {};
  o = { ...o, ...s };
  for (const r in o) {
    const a = rc(o[r]);
    ic(t, r, a);
  }
}
function ac(t) {
  return !!(O(t) && t.add);
}
function Ze(t, e) {
  const n = t.getValue("willChange");
  if (ac(n))
    return n.add(e);
  if (!n && q.WillChange) {
    const s = new q.WillChange("auto");
    t.addValue("willChange", s), s.add(e);
  }
}
function Ar(t) {
  return t.props[dr];
}
const lc = (t) => t !== null;
function cc(t, { repeat: e, repeatType: n = "loop" }, s) {
  const i = t.filter(lc), o = e && n !== "loop" && e % 2 === 1 ? 0 : i.length - 1;
  return i[o];
}
const uc = {
  type: "spring",
  stiffness: 500,
  damping: 25,
  restSpeed: 10
}, hc = (t) => ({
  type: "spring",
  stiffness: 550,
  damping: t === 0 ? 2 * Math.sqrt(550) : 30,
  restSpeed: 10
}), dc = {
  type: "keyframes",
  duration: 0.8
}, fc = {
  type: "keyframes",
  ease: [0.25, 0.1, 0.35, 1],
  duration: 0.3
}, pc = (t, { keyframes: e }) => e.length > 2 ? dc : Vt.has(t) ? t.startsWith("scale") ? hc(e[1]) : uc : fc;
function mc({ when: t, delay: e, delayChildren: n, staggerChildren: s, staggerDirection: i, repeat: o, repeatType: r, repeatDelay: a, from: l, elapsed: u, ...c }) {
  return !!Object.keys(c).length;
}
const Nn = (t, e, n, s = {}, i, o) => (r) => {
  const a = Cn(s, t) || {}, l = a.delay || s.delay || 0;
  let { elapsed: u = 0 } = s;
  u = u - /* @__PURE__ */ X(l);
  const c = {
    keyframes: Array.isArray(n) ? n : [null, n],
    ease: "easeOut",
    velocity: e.getVelocity(),
    ...a,
    delay: -u,
    onUpdate: (d) => {
      e.set(d), a.onUpdate && a.onUpdate(d);
    },
    onComplete: () => {
      r(), a.onComplete && a.onComplete();
    },
    name: t,
    motionValue: e,
    element: o ? void 0 : i
  };
  mc(a) || Object.assign(c, pc(t, c)), c.duration && (c.duration = /* @__PURE__ */ X(c.duration)), c.repeatDelay && (c.repeatDelay = /* @__PURE__ */ X(c.repeatDelay)), c.from !== void 0 && (c.keyframes[0] = c.from);
  let h = !1;
  if ((c.type === !1 || c.duration === 0 && !c.repeatDelay) && (ze(c), c.delay === 0 && (h = !0)), (q.instantAnimations || q.skipAnimations) && (h = !0, ze(c), c.delay = 0), c.allowFlatten = !a.type && !a.ease, h && !o && e.get() !== void 0) {
    const d = cc(c.keyframes, a);
    if (d !== void 0) {
      V.update(() => {
        c.onUpdate(d), c.onComplete();
      });
      return;
    }
  }
  return a.isSync ? new Pn(c) : new Ia(c);
};
function yc({ protectedKeys: t, needsAnimating: e }, n) {
  const s = t.hasOwnProperty(n) && e[n] !== !0;
  return e[n] = !1, s;
}
function Pr(t, e, { delay: n = 0, transitionOverride: s, type: i } = {}) {
  let { transition: o = t.getDefaultTransition(), transitionEnd: r, ...a } = e;
  s && (o = s);
  const l = [], u = i && t.animationState && t.animationState.getState()[i];
  for (const c in a) {
    const h = t.getValue(c, t.latestValues[c] ?? null), d = a[c];
    if (d === void 0 || u && yc(u, c))
      continue;
    const f = {
      delay: n,
      ...Cn(o || {}, c)
    }, m = h.get();
    if (m !== void 0 && !h.isAnimating && !Array.isArray(d) && d === m && !f.velocity)
      continue;
    let x = !1;
    if (window.MotionHandoffAnimation) {
      const g = Ar(t);
      if (g) {
        const b = window.MotionHandoffAnimation(g, c, V);
        b !== null && (f.startTime = b, x = !0);
      }
    }
    Ze(t, c), h.start(Nn(c, h, d, t.shouldReduceMotion && Wi.has(c) ? { type: !1 } : f, t, x));
    const S = h.animation;
    S && l.push(S);
  }
  return r && Promise.all(l).then(() => {
    V.update(() => {
      r && oc(t, r);
    });
  }), l;
}
function wr(t, e, n, s = 0, i = 1) {
  const o = Array.from(t).sort((u, c) => u.sortNodePosition(c)).indexOf(e), r = t.size, a = (r - 1) * s;
  return typeof n == "function" ? n(o, r) : i === 1 ? o * s : a - o * s;
}
function tn(t, e, n = {}) {
  const s = bt(t, e, n.type === "exit" ? t.presenceContext?.custom : void 0);
  let { transition: i = t.getDefaultTransition() || {} } = s || {};
  n.transitionOverride && (i = n.transitionOverride);
  const o = s ? () => Promise.all(Pr(t, s, n)) : () => Promise.resolve(), r = t.variantChildren && t.variantChildren.size ? (l = 0) => {
    const { delayChildren: u = 0, staggerChildren: c, staggerDirection: h } = i;
    return gc(t, e, l, u, c, h, n);
  } : () => Promise.resolve(), { when: a } = i;
  if (a) {
    const [l, u] = a === "beforeChildren" ? [o, r] : [r, o];
    return l().then(() => u());
  } else
    return Promise.all([o(), r(n.delay)]);
}
function gc(t, e, n = 0, s = 0, i = 0, o = 1, r) {
  const a = [];
  for (const l of t.variantChildren)
    l.notify("AnimationStart", e), a.push(tn(l, e, {
      ...r,
      delay: n + (typeof s == "function" ? 0 : s) + wr(t.variantChildren, l, s, i, o)
    }).then(() => l.notify("AnimationComplete", e)));
  return Promise.all(a);
}
function vc(t, e, n = {}) {
  t.notify("AnimationStart", e);
  let s;
  if (Array.isArray(e)) {
    const i = e.map((o) => tn(t, o, n));
    s = Promise.all(i);
  } else if (typeof e == "string")
    s = tn(t, e, n);
  else {
    const i = typeof e == "function" ? bt(t, e, n.custom) : e;
    s = Promise.all(Pr(t, i, n));
  }
  return s.then(() => {
    t.notify("AnimationComplete", e);
  });
}
function Cr(t, e) {
  if (!Array.isArray(e))
    return !1;
  const n = e.length;
  if (n !== t.length)
    return !1;
  for (let s = 0; s < n; s++)
    if (e[s] !== t[s])
      return !1;
  return !0;
}
const xc = Ln.length;
function Vr(t) {
  if (!t)
    return;
  if (!t.isControllingVariants) {
    const n = t.parent ? Vr(t.parent) || {} : {};
    return t.props.initial !== void 0 && (n.initial = t.props.initial), n;
  }
  const e = {};
  for (let n = 0; n < xc; n++) {
    const s = Ln[n], i = t.props[s];
    (Nt(i) || i === !1) && (e[s] = i);
  }
  return e;
}
const Tc = [...Rn].reverse(), bc = Rn.length;
function Sc(t) {
  return (e) => Promise.all(e.map(({ animation: n, options: s }) => vc(t, n, s)));
}
function Ac(t) {
  let e = Sc(t), n = ws(), s = !0;
  const i = (l) => (u, c) => {
    const h = bt(t, c, l === "exit" ? t.presenceContext?.custom : void 0);
    if (h) {
      const { transition: d, transitionEnd: f, ...m } = h;
      u = { ...u, ...m, ...f };
    }
    return u;
  };
  function o(l) {
    e = l(t);
  }
  function r(l) {
    const { props: u } = t, c = Vr(t.parent) || {}, h = [], d = /* @__PURE__ */ new Set();
    let f = {}, m = 1 / 0;
    for (let S = 0; S < bc; S++) {
      const g = Tc[S], b = n[g], T = u[g] !== void 0 ? u[g] : c[g], w = Nt(T), y = g === l ? b.isActive : null;
      y === !1 && (m = S);
      let v = T === c[g] && T !== u[g] && w;
      if (v && s && t.manuallyAnimateOnMount && (v = !1), b.protectedKeys = { ...f }, // If it isn't active and hasn't *just* been set as inactive
      !b.isActive && y === null || // If we didn't and don't have any defined prop for this animation type
      !T && !b.prevProp || // Or if the prop doesn't define an animation
      ge(T) || typeof T == "boolean")
        continue;
      const C = Pc(b.prevProp, T);
      let A = C || // If we're making this variant active, we want to always make it active
      g === l && b.isActive && !v && w || // If we removed a higher-priority variant (i is in reverse order)
      S > m && w, E = !1;
      const j = Array.isArray(T) ? T : [T];
      let z = j.reduce(i(g), {});
      y === !1 && (z = {});
      const { prevResolvedValues: Gt = {} } = b, xe = {
        ...Gt,
        ...z
      }, Y = (k) => {
        A = !0, d.has(k) && (E = !0, d.delete(k)), b.needsAnimating[k] = !0;
        const _ = t.getValue(k);
        _ && (_.liveStyle = !1);
      };
      for (const k in xe) {
        const _ = z[k], it = Gt[k];
        if (f.hasOwnProperty(k))
          continue;
        let ft = !1;
        qe(_) && qe(it) ? ft = !Cr(_, it) : ft = _ !== it, ft ? _ != null ? Y(k) : d.add(k) : _ !== void 0 && d.has(k) ? Y(k) : b.protectedKeys[k] = !0;
      }
      b.prevProp = T, b.prevResolvedValues = z, b.isActive && (f = { ...f, ...z }), s && t.blockInitialAnimation && (A = !1);
      const zt = v && C;
      A && (!zt || E) && h.push(...j.map((k) => {
        const _ = { type: g };
        if (typeof k == "string" && s && !zt && t.manuallyAnimateOnMount && t.parent) {
          const { parent: it } = t, ft = bt(it, k);
          if (it.enteringChildren && ft) {
            const { delayChildren: Gr } = ft.transition || {};
            _.delay = wr(it.enteringChildren, t, Gr);
          }
        }
        return {
          animation: k,
          options: _
        };
      }));
    }
    if (d.size) {
      const S = {};
      if (typeof u.initial != "boolean") {
        const g = bt(t, Array.isArray(u.initial) ? u.initial[0] : u.initial);
        g && g.transition && (S.transition = g.transition);
      }
      d.forEach((g) => {
        const b = t.getBaseTarget(g), T = t.getValue(g);
        T && (T.liveStyle = !0), S[g] = b ?? null;
      }), h.push({ animation: S });
    }
    let x = !!h.length;
    return s && (u.initial === !1 || u.initial === u.animate) && !t.manuallyAnimateOnMount && (x = !1), s = !1, x ? e(h) : Promise.resolve();
  }
  function a(l, u) {
    if (n[l].isActive === u)
      return Promise.resolve();
    t.variantChildren?.forEach((h) => h.animationState?.setActive(l, u)), n[l].isActive = u;
    const c = r(l);
    for (const h in n)
      n[h].protectedKeys = {};
    return c;
  }
  return {
    animateChanges: r,
    setActive: a,
    setAnimateFunction: o,
    getState: () => n,
    reset: () => {
      n = ws();
    }
  };
}
function Pc(t, e) {
  return typeof e == "string" ? e !== t : Array.isArray(e) ? !Cr(e, t) : !1;
}
function rt(t = !1) {
  return {
    isActive: t,
    protectedKeys: {},
    needsAnimating: {},
    prevResolvedValues: {}
  };
}
function ws() {
  return {
    animate: rt(!0),
    whileInView: rt(),
    whileHover: rt(),
    whileTap: rt(),
    whileDrag: rt(),
    whileFocus: rt(),
    exit: rt()
  };
}
class st {
  constructor(e) {
    this.isMounted = !1, this.node = e;
  }
  update() {
  }
}
class wc extends st {
  /**
   * We dynamically generate the AnimationState manager as it contains a reference
   * to the underlying animation library. We only want to load that if we load this,
   * so people can optionally code split it out using the `m` component.
   */
  constructor(e) {
    super(e), e.animationState || (e.animationState = Ac(e));
  }
  updateAnimationControlsSubscription() {
    const { animate: e } = this.node.getProps();
    ge(e) && (this.unmountControls = e.subscribe(this.node));
  }
  /**
   * Subscribe any provided AnimationControls to the component's VisualElement
   */
  mount() {
    this.updateAnimationControlsSubscription();
  }
  update() {
    const { animate: e } = this.node.getProps(), { animate: n } = this.node.prevProps || {};
    e !== n && this.updateAnimationControlsSubscription();
  }
  unmount() {
    this.node.animationState.reset(), this.unmountControls?.();
  }
}
let Cc = 0;
class Vc extends st {
  constructor() {
    super(...arguments), this.id = Cc++;
  }
  update() {
    if (!this.node.presenceContext)
      return;
    const { isPresent: e, onExitComplete: n } = this.node.presenceContext, { isPresent: s } = this.node.prevPresenceContext || {};
    if (!this.node.animationState || e === s)
      return;
    const i = this.node.animationState.setActive("exit", !e);
    n && !e && i.then(() => {
      n(this.id);
    });
  }
  mount() {
    const { register: e, onExitComplete: n } = this.node.presenceContext || {};
    n && n(this.id), e && (this.unmount = e(this.id));
  }
  unmount() {
  }
}
const Dc = {
  animation: {
    Feature: wc
  },
  exit: {
    Feature: Vc
  }
};
function _t(t, e, n, s = { passive: !0 }) {
  return t.addEventListener(e, n, s), () => t.removeEventListener(e, n);
}
function Ht(t) {
  return {
    point: {
      x: t.pageX,
      y: t.pageY
    }
  };
}
const Mc = (t) => (e) => Mn(e) && t(e, Ht(e));
function jt(t, e, n, s) {
  return _t(t, e, Mc(n), s);
}
const Dr = 1e-4, Ec = 1 - Dr, Rc = 1 + Dr, Mr = 0.01, Lc = 0 - Mr, jc = 0 + Mr;
function F(t) {
  return t.max - t.min;
}
function kc(t, e, n) {
  return Math.abs(t - e) <= n;
}
function Cs(t, e, n, s = 0.5) {
  t.origin = s, t.originPoint = D(e.min, e.max, t.origin), t.scale = F(n) / F(e), t.translate = D(n.min, n.max, t.origin) - t.originPoint, (t.scale >= Ec && t.scale <= Rc || isNaN(t.scale)) && (t.scale = 1), (t.translate >= Lc && t.translate <= jc || isNaN(t.translate)) && (t.translate = 0);
}
function kt(t, e, n, s) {
  Cs(t.x, e.x, n.x, s ? s.originX : void 0), Cs(t.y, e.y, n.y, s ? s.originY : void 0);
}
function Vs(t, e, n) {
  t.min = n.min + e.min, t.max = t.min + F(e);
}
function Bc(t, e, n) {
  Vs(t.x, e.x, n.x), Vs(t.y, e.y, n.y);
}
function Ds(t, e, n) {
  t.min = e.min - n.min, t.max = t.min + F(e);
}
function Bt(t, e, n) {
  Ds(t.x, e.x, n.x), Ds(t.y, e.y, n.y);
}
function U(t) {
  return [t("x"), t("y")];
}
const Er = ({ current: t }) => t ? t.ownerDocument.defaultView : null, Ms = (t, e) => Math.abs(t - e);
function Ic(t, e) {
  const n = Ms(t.x, e.x), s = Ms(t.y, e.y);
  return Math.sqrt(n ** 2 + s ** 2);
}
class Rr {
  constructor(e, n, { transformPagePoint: s, contextWindow: i = window, dragSnapToOrigin: o = !1, distanceThreshold: r = 3 } = {}) {
    if (this.startEvent = null, this.lastMoveEvent = null, this.lastMoveEventInfo = null, this.handlers = {}, this.contextWindow = window, this.updatePoint = () => {
      if (!(this.lastMoveEvent && this.lastMoveEventInfo))
        return;
      const d = Ee(this.lastMoveEventInfo, this.history), f = this.startEvent !== null, m = Ic(d.offset, { x: 0, y: 0 }) >= this.distanceThreshold;
      if (!f && !m)
        return;
      const { point: x } = d, { timestamp: S } = B;
      this.history.push({ ...x, timestamp: S });
      const { onStart: g, onMove: b } = this.handlers;
      f || (g && g(this.lastMoveEvent, d), this.startEvent = this.lastMoveEvent), b && b(this.lastMoveEvent, d);
    }, this.handlePointerMove = (d, f) => {
      this.lastMoveEvent = d, this.lastMoveEventInfo = Me(f, this.transformPagePoint), V.update(this.updatePoint, !0);
    }, this.handlePointerUp = (d, f) => {
      this.end();
      const { onEnd: m, onSessionEnd: x, resumeAnimation: S } = this.handlers;
      if (this.dragSnapToOrigin && S && S(), !(this.lastMoveEvent && this.lastMoveEventInfo))
        return;
      const g = Ee(d.type === "pointercancel" ? this.lastMoveEventInfo : Me(f, this.transformPagePoint), this.history);
      this.startEvent && m && m(d, g), x && x(d, g);
    }, !Mn(e))
      return;
    this.dragSnapToOrigin = o, this.handlers = n, this.transformPagePoint = s, this.distanceThreshold = r, this.contextWindow = i || window;
    const a = Ht(e), l = Me(a, this.transformPagePoint), { point: u } = l, { timestamp: c } = B;
    this.history = [{ ...u, timestamp: c }];
    const { onSessionStart: h } = n;
    h && h(e, Ee(l, this.history)), this.removeListeners = $t(jt(this.contextWindow, "pointermove", this.handlePointerMove), jt(this.contextWindow, "pointerup", this.handlePointerUp), jt(this.contextWindow, "pointercancel", this.handlePointerUp));
  }
  updateHandlers(e) {
    this.handlers = e;
  }
  end() {
    this.removeListeners && this.removeListeners(), et(this.updatePoint);
  }
}
function Me(t, e) {
  return e ? { point: e(t.point) } : t;
}
function Es(t, e) {
  return { x: t.x - e.x, y: t.y - e.y };
}
function Ee({ point: t }, e) {
  return {
    point: t,
    delta: Es(t, Lr(e)),
    offset: Es(t, Oc(e)),
    velocity: Fc(e, 0.1)
  };
}
function Oc(t) {
  return t[0];
}
function Lr(t) {
  return t[t.length - 1];
}
function Fc(t, e) {
  if (t.length < 2)
    return { x: 0, y: 0 };
  let n = t.length - 1, s = null;
  const i = Lr(t);
  for (; n >= 0 && (s = t[n], !(i.timestamp - s.timestamp > /* @__PURE__ */ X(e))); )
    n--;
  if (!s)
    return { x: 0, y: 0 };
  const o = /* @__PURE__ */ W(i.timestamp - s.timestamp);
  if (o === 0)
    return { x: 0, y: 0 };
  const r = {
    x: (i.x - s.x) / o,
    y: (i.y - s.y) / o
  };
  return r.x === 1 / 0 && (r.x = 0), r.y === 1 / 0 && (r.y = 0), r;
}
function Nc(t, { min: e, max: n }, s) {
  return e !== void 0 && t < e ? t = s ? D(e, t, s.min) : Math.max(t, e) : n !== void 0 && t > n && (t = s ? D(n, t, s.max) : Math.min(t, n)), t;
}
function Rs(t, e, n) {
  return {
    min: e !== void 0 ? t.min + e : void 0,
    max: n !== void 0 ? t.max + n - (t.max - t.min) : void 0
  };
}
function Kc(t, { top: e, left: n, bottom: s, right: i }) {
  return {
    x: Rs(t.x, n, i),
    y: Rs(t.y, e, s)
  };
}
function Ls(t, e) {
  let n = e.min - t.min, s = e.max - t.max;
  return e.max - e.min < t.max - t.min && ([n, s] = [s, n]), { min: n, max: s };
}
function _c(t, e) {
  return {
    x: Ls(t.x, e.x),
    y: Ls(t.y, e.y)
  };
}
function $c(t, e) {
  let n = 0.5;
  const s = F(t), i = F(e);
  return i > s ? n = /* @__PURE__ */ It(e.min, e.max - s, t.min) : s > i && (n = /* @__PURE__ */ It(t.min, t.max - i, e.min)), Q(0, 1, n);
}
function Uc(t, e) {
  const n = {};
  return e.min !== void 0 && (n.min = e.min - t.min), e.max !== void 0 && (n.max = e.max - t.min), n;
}
const en = 0.35;
function Wc(t = en) {
  return t === !1 ? t = 0 : t === !0 && (t = en), {
    x: js(t, "left", "right"),
    y: js(t, "top", "bottom")
  };
}
function js(t, e, n) {
  return {
    min: ks(t, e),
    max: ks(t, n)
  };
}
function ks(t, e) {
  return typeof t == "number" ? t : t[e] || 0;
}
const Hc = /* @__PURE__ */ new WeakMap();
class Gc {
  constructor(e) {
    this.openDragLock = null, this.isDragging = !1, this.currentDirection = null, this.originPoint = { x: 0, y: 0 }, this.constraints = !1, this.hasMutatedConstraints = !1, this.elastic = R(), this.latestPointerEvent = null, this.latestPanInfo = null, this.visualElement = e;
  }
  start(e, { snapToCursor: n = !1, distanceThreshold: s } = {}) {
    const { presenceContext: i } = this.visualElement;
    if (i && i.isPresent === !1)
      return;
    const o = (h) => {
      const { dragSnapToOrigin: d } = this.getProps();
      d ? this.pauseAnimation() : this.stopAnimation(), n && this.snapToCursor(Ht(h).point);
    }, r = (h, d) => {
      const { drag: f, dragPropagation: m, onDragStart: x } = this.getProps();
      if (f && !m && (this.openDragLock && this.openDragLock(), this.openDragLock = qa(f), !this.openDragLock))
        return;
      this.latestPointerEvent = h, this.latestPanInfo = d, this.isDragging = !0, this.currentDirection = null, this.resolveConstraints(), this.visualElement.projection && (this.visualElement.projection.isAnimationBlocked = !0, this.visualElement.projection.target = void 0), U((g) => {
        let b = this.getAxisMotionValue(g).get() || 0;
        if (J.test(b)) {
          const { projection: T } = this.visualElement;
          if (T && T.layout) {
            const w = T.layout.layoutBox[g];
            w && (b = F(w) * (parseFloat(b) / 100));
          }
        }
        this.originPoint[g] = b;
      }), x && V.postRender(() => x(h, d)), Ze(this.visualElement, "transform");
      const { animationState: S } = this.visualElement;
      S && S.setActive("whileDrag", !0);
    }, a = (h, d) => {
      this.latestPointerEvent = h, this.latestPanInfo = d;
      const { dragPropagation: f, dragDirectionLock: m, onDirectionLock: x, onDrag: S } = this.getProps();
      if (!f && !this.openDragLock)
        return;
      const { offset: g } = d;
      if (m && this.currentDirection === null) {
        this.currentDirection = zc(g), this.currentDirection !== null && x && x(this.currentDirection);
        return;
      }
      this.updateAxis("x", d.point, g), this.updateAxis("y", d.point, g), this.visualElement.render(), S && S(h, d);
    }, l = (h, d) => {
      this.latestPointerEvent = h, this.latestPanInfo = d, this.stop(h, d), this.latestPointerEvent = null, this.latestPanInfo = null;
    }, u = () => U((h) => this.getAnimationState(h) === "paused" && this.getAxisMotionValue(h).animation?.play()), { dragSnapToOrigin: c } = this.getProps();
    this.panSession = new Rr(e, {
      onSessionStart: o,
      onStart: r,
      onMove: a,
      onSessionEnd: l,
      resumeAnimation: u
    }, {
      transformPagePoint: this.visualElement.getTransformPagePoint(),
      dragSnapToOrigin: c,
      distanceThreshold: s,
      contextWindow: Er(this.visualElement)
    });
  }
  /**
   * @internal
   */
  stop(e, n) {
    const s = e || this.latestPointerEvent, i = n || this.latestPanInfo, o = this.isDragging;
    if (this.cancel(), !o || !i || !s)
      return;
    const { velocity: r } = i;
    this.startAnimation(r);
    const { onDragEnd: a } = this.getProps();
    a && V.postRender(() => a(s, i));
  }
  /**
   * @internal
   */
  cancel() {
    this.isDragging = !1;
    const { projection: e, animationState: n } = this.visualElement;
    e && (e.isAnimationBlocked = !1), this.panSession && this.panSession.end(), this.panSession = void 0;
    const { dragPropagation: s } = this.getProps();
    !s && this.openDragLock && (this.openDragLock(), this.openDragLock = null), n && n.setActive("whileDrag", !1);
  }
  updateAxis(e, n, s) {
    const { drag: i } = this.getProps();
    if (!s || !Qt(e, i, this.currentDirection))
      return;
    const o = this.getAxisMotionValue(e);
    let r = this.originPoint[e] + s[e];
    this.constraints && this.constraints[e] && (r = Nc(r, this.constraints[e], this.elastic[e])), o.set(r);
  }
  resolveConstraints() {
    const { dragConstraints: e, dragElastic: n } = this.getProps(), s = this.visualElement.projection && !this.visualElement.projection.layout ? this.visualElement.projection.measure(!1) : this.visualElement.projection?.layout, i = this.constraints;
    e && gt(e) ? this.constraints || (this.constraints = this.resolveRefConstraints()) : e && s ? this.constraints = Kc(s.layoutBox, e) : this.constraints = !1, this.elastic = Wc(n), i !== this.constraints && s && this.constraints && !this.hasMutatedConstraints && U((o) => {
      this.constraints !== !1 && this.getAxisMotionValue(o) && (this.constraints[o] = Uc(s.layoutBox[o], this.constraints[o]));
    });
  }
  resolveRefConstraints() {
    const { dragConstraints: e, onMeasureDragConstraints: n } = this.getProps();
    if (!e || !gt(e))
      return !1;
    const s = e.current, { projection: i } = this.visualElement;
    if (!i || !i.layout)
      return !1;
    const o = Yl(s, i.root, this.visualElement.getTransformPagePoint());
    let r = _c(i.layout.layoutBox, o);
    if (n) {
      const a = n(Hl(r));
      this.hasMutatedConstraints = !!a, a && (r = mr(a));
    }
    return r;
  }
  startAnimation(e) {
    const { drag: n, dragMomentum: s, dragElastic: i, dragTransition: o, dragSnapToOrigin: r, onDragTransitionEnd: a } = this.getProps(), l = this.constraints || {}, u = U((c) => {
      if (!Qt(c, n, this.currentDirection))
        return;
      let h = l && l[c] || {};
      r && (h = { min: 0, max: 0 });
      const d = i ? 200 : 1e6, f = i ? 40 : 1e7, m = {
        type: "inertia",
        velocity: s ? e[c] : 0,
        bounceStiffness: d,
        bounceDamping: f,
        timeConstant: 750,
        restDelta: 1,
        restSpeed: 10,
        ...o,
        ...h
      };
      return this.startAxisValueAnimation(c, m);
    });
    return Promise.all(u).then(a);
  }
  startAxisValueAnimation(e, n) {
    const s = this.getAxisMotionValue(e);
    return Ze(this.visualElement, e), s.start(Nn(e, s, 0, n, this.visualElement, !1));
  }
  stopAnimation() {
    U((e) => this.getAxisMotionValue(e).stop());
  }
  pauseAnimation() {
    U((e) => this.getAxisMotionValue(e).animation?.pause());
  }
  getAnimationState(e) {
    return this.getAxisMotionValue(e).animation?.state;
  }
  /**
   * Drag works differently depending on which props are provided.
   *
   * - If _dragX and _dragY are provided, we output the gesture delta directly to those motion values.
   * - Otherwise, we apply the delta to the x/y motion values.
   */
  getAxisMotionValue(e) {
    const n = `_drag${e.toUpperCase()}`, s = this.visualElement.getProps(), i = s[n];
    return i || this.visualElement.getValue(e, (s.initial ? s.initial[e] : void 0) || 0);
  }
  snapToCursor(e) {
    U((n) => {
      const { drag: s } = this.getProps();
      if (!Qt(n, s, this.currentDirection))
        return;
      const { projection: i } = this.visualElement, o = this.getAxisMotionValue(n);
      if (i && i.layout) {
        const { min: r, max: a } = i.layout.layoutBox[n];
        o.set(e[n] - D(r, a, 0.5));
      }
    });
  }
  /**
   * When the viewport resizes we want to check if the measured constraints
   * have changed and, if so, reposition the element within those new constraints
   * relative to where it was before the resize.
   */
  scalePositionWithinConstraints() {
    if (!this.visualElement.current)
      return;
    const { drag: e, dragConstraints: n } = this.getProps(), { projection: s } = this.visualElement;
    if (!gt(n) || !s || !this.constraints)
      return;
    this.stopAnimation();
    const i = { x: 0, y: 0 };
    U((r) => {
      const a = this.getAxisMotionValue(r);
      if (a && this.constraints !== !1) {
        const l = a.get();
        i[r] = $c({ min: l, max: l }, this.constraints[r]);
      }
    });
    const { transformTemplate: o } = this.visualElement.getProps();
    this.visualElement.current.style.transform = o ? o({}, "") : "none", s.root && s.root.updateScroll(), s.updateLayout(), this.resolveConstraints(), U((r) => {
      if (!Qt(r, e, null))
        return;
      const a = this.getAxisMotionValue(r), { min: l, max: u } = this.constraints[r];
      a.set(D(l, u, i[r]));
    });
  }
  addListeners() {
    if (!this.visualElement.current)
      return;
    Hc.set(this.visualElement, this);
    const e = this.visualElement.current, n = jt(e, "pointerdown", (l) => {
      const { drag: u, dragListener: c = !0 } = this.getProps();
      u && c && this.start(l);
    }), s = () => {
      const { dragConstraints: l } = this.getProps();
      gt(l) && l.current && (this.constraints = this.resolveRefConstraints());
    }, { projection: i } = this.visualElement, o = i.addEventListener("measure", s);
    i && !i.layout && (i.root && i.root.updateScroll(), i.updateLayout()), V.read(s);
    const r = _t(window, "resize", () => this.scalePositionWithinConstraints()), a = i.addEventListener("didUpdate", (({ delta: l, hasLayoutChanged: u }) => {
      this.isDragging && u && (U((c) => {
        const h = this.getAxisMotionValue(c);
        h && (this.originPoint[c] += l[c].translate, h.set(h.get() + l[c].translate));
      }), this.visualElement.render());
    }));
    return () => {
      r(), n(), o(), a && a();
    };
  }
  getProps() {
    const e = this.visualElement.getProps(), { drag: n = !1, dragDirectionLock: s = !1, dragPropagation: i = !1, dragConstraints: o = !1, dragElastic: r = en, dragMomentum: a = !0 } = e;
    return {
      ...e,
      drag: n,
      dragDirectionLock: s,
      dragPropagation: i,
      dragConstraints: o,
      dragElastic: r,
      dragMomentum: a
    };
  }
}
function Qt(t, e, n) {
  return (e === !0 || e === t) && (n === null || n === t);
}
function zc(t, e = 10) {
  let n = null;
  return Math.abs(t.y) > e ? n = "y" : Math.abs(t.x) > e && (n = "x"), n;
}
class Yc extends st {
  constructor(e) {
    super(e), this.removeGroupControls = H, this.removeListeners = H, this.controls = new Gc(e);
  }
  mount() {
    const { dragControls: e } = this.node.getProps();
    e && (this.removeGroupControls = e.subscribe(this.controls)), this.removeListeners = this.controls.addListeners() || H;
  }
  unmount() {
    this.removeGroupControls(), this.removeListeners();
  }
}
const Bs = (t) => (e, n) => {
  t && V.postRender(() => t(e, n));
};
class Xc extends st {
  constructor() {
    super(...arguments), this.removePointerDownListener = H;
  }
  onPointerDown(e) {
    this.session = new Rr(e, this.createPanHandlers(), {
      transformPagePoint: this.node.getTransformPagePoint(),
      contextWindow: Er(this.node)
    });
  }
  createPanHandlers() {
    const { onPanSessionStart: e, onPanStart: n, onPan: s, onPanEnd: i } = this.node.getProps();
    return {
      onSessionStart: Bs(e),
      onStart: Bs(n),
      onMove: s,
      onEnd: (o, r) => {
        delete this.session, i && V.postRender(() => i(o, r));
      }
    };
  }
  mount() {
    this.removePointerDownListener = jt(this.node.current, "pointerdown", (e) => this.onPointerDown(e));
  }
  update() {
    this.session && this.session.updateHandlers(this.createPanHandlers());
  }
  unmount() {
    this.removePointerDownListener(), this.session && this.session.end();
  }
}
const ne = {
  /**
   * Global flag as to whether the tree has animated since the last time
   * we resized the window
   */
  hasAnimatedSinceResize: !0,
  /**
   * We set this to true once, on the first update. Any nodes added to the tree beyond that
   * update will be given a `data-projection-id` attribute.
   */
  hasEverUpdated: !1
};
function Is(t, e) {
  return e.max === e.min ? 0 : t / (e.max - e.min) * 100;
}
const Mt = {
  correct: (t, e) => {
    if (!e.target)
      return t;
    if (typeof t == "string")
      if (P.test(t))
        t = parseFloat(t);
      else
        return t;
    const n = Is(t, e.target.x), s = Is(t, e.target.y);
    return `${n}% ${s}%`;
  }
}, Jc = {
  correct: (t, { treeScale: e, projectionDelta: n }) => {
    const s = t, i = nt.parse(t);
    if (i.length > 5)
      return s;
    const o = nt.createTransformer(t), r = typeof i[0] != "number" ? 1 : 0, a = n.x.scale * e.x, l = n.y.scale * e.y;
    i[0 + r] /= a, i[1 + r] /= l;
    const u = D(a, l, 0.5);
    return typeof i[2 + r] == "number" && (i[2 + r] /= u), typeof i[3 + r] == "number" && (i[3 + r] /= u), o(i);
  }
};
let Re = !1;
class Qc extends Zr {
  /**
   * This only mounts projection nodes for components that
   * need measuring, we might want to do it for all components
   * in order to incorporate transforms
   */
  componentDidMount() {
    const { visualElement: e, layoutGroup: n, switchLayoutGroup: s, layoutId: i } = this.props, { projection: o } = e;
    xl(qc), o && (n.group && n.group.add(o), s && s.register && i && s.register(o), Re && o.root.didUpdate(), o.addEventListener("animationComplete", () => {
      this.safeToRemove();
    }), o.setOptions({
      ...o.options,
      onExitComplete: () => this.safeToRemove()
    })), ne.hasEverUpdated = !0;
  }
  getSnapshotBeforeUpdate(e) {
    const { layoutDependency: n, visualElement: s, drag: i, isPresent: o } = this.props, { projection: r } = s;
    return r && (r.isPresent = o, Re = !0, i || e.layoutDependency !== n || n === void 0 || e.isPresent !== o ? r.willUpdate() : this.safeToRemove(), e.isPresent !== o && (o ? r.promote() : r.relegate() || V.postRender(() => {
      const a = r.getStack();
      (!a || !a.members.length) && this.safeToRemove();
    }))), null;
  }
  componentDidUpdate() {
    const { projection: e } = this.props.visualElement;
    e && (e.root.didUpdate(), Dn.postRender(() => {
      !e.currentAnimation && e.isLead() && this.safeToRemove();
    }));
  }
  componentWillUnmount() {
    const { visualElement: e, layoutGroup: n, switchLayoutGroup: s } = this.props, { projection: i } = e;
    Re = !0, i && (i.scheduleCheckAfterUnmount(), n && n.group && n.group.remove(i), s && s.deregister && s.deregister(i));
  }
  safeToRemove() {
    const { safeToRemove: e } = this.props;
    e && e();
  }
  render() {
    return null;
  }
}
function jr(t) {
  const [e, n] = er(), s = I(on);
  return p.jsx(Qc, { ...t, layoutGroup: s, switchLayoutGroup: I(fr), isPresent: e, safeToRemove: n });
}
const qc = {
  borderRadius: {
    ...Mt,
    applyTo: [
      "borderTopLeftRadius",
      "borderTopRightRadius",
      "borderBottomLeftRadius",
      "borderBottomRightRadius"
    ]
  },
  borderTopLeftRadius: Mt,
  borderTopRightRadius: Mt,
  borderBottomLeftRadius: Mt,
  borderBottomRightRadius: Mt,
  boxShadow: Jc
};
function Zc(t, e, n) {
  const s = O(t) ? t : St(t);
  return s.start(Nn("", s, e, n)), s.animation;
}
const tu = (t, e) => t.depth - e.depth;
class eu {
  constructor() {
    this.children = [], this.isDirty = !1;
  }
  add(e) {
    cn(this.children, e), this.isDirty = !0;
  }
  remove(e) {
    un(this.children, e), this.isDirty = !0;
  }
  forEach(e) {
    this.isDirty && this.children.sort(tu), this.isDirty = !1, this.children.forEach(e);
  }
}
function nu(t, e) {
  const n = K.now(), s = ({ timestamp: i }) => {
    const o = i - n;
    o >= e && (et(s), t(o - e));
  };
  return V.setup(s, !0), () => et(s);
}
const kr = ["TopLeft", "TopRight", "BottomLeft", "BottomRight"], su = kr.length, Os = (t) => typeof t == "string" ? parseFloat(t) : t, Fs = (t) => typeof t == "number" || P.test(t);
function iu(t, e, n, s, i, o) {
  i ? (t.opacity = D(0, n.opacity ?? 1, ru(s)), t.opacityExit = D(e.opacity ?? 1, 0, ou(s))) : o && (t.opacity = D(e.opacity ?? 1, n.opacity ?? 1, s));
  for (let r = 0; r < su; r++) {
    const a = `border${kr[r]}Radius`;
    let l = Ns(e, a), u = Ns(n, a);
    if (l === void 0 && u === void 0)
      continue;
    l || (l = 0), u || (u = 0), l === 0 || u === 0 || Fs(l) === Fs(u) ? (t[a] = Math.max(D(Os(l), Os(u), s), 0), (J.test(u) || J.test(l)) && (t[a] += "%")) : t[a] = u;
  }
  (e.rotate || n.rotate) && (t.rotate = D(e.rotate || 0, n.rotate || 0, s));
}
function Ns(t, e) {
  return t[e] !== void 0 ? t[e] : t.borderRadius;
}
const ru = /* @__PURE__ */ Br(0, 0.5, bi), ou = /* @__PURE__ */ Br(0.5, 0.95, H);
function Br(t, e, n) {
  return (s) => s < t ? 0 : s > e ? 1 : n(/* @__PURE__ */ It(t, e, s));
}
function Ks(t, e) {
  t.min = e.min, t.max = e.max;
}
function $(t, e) {
  Ks(t.x, e.x), Ks(t.y, e.y);
}
function _s(t, e) {
  t.translate = e.translate, t.scale = e.scale, t.originPoint = e.originPoint, t.origin = e.origin;
}
function $s(t, e, n, s, i) {
  return t -= e, t = ce(t, 1 / n, s), i !== void 0 && (t = ce(t, 1 / i, s)), t;
}
function au(t, e = 0, n = 1, s = 0.5, i, o = t, r = t) {
  if (J.test(e) && (e = parseFloat(e), e = D(r.min, r.max, e / 100) - r.min), typeof e != "number")
    return;
  let a = D(o.min, o.max, s);
  t === o && (a -= e), t.min = $s(t.min, e, n, a, i), t.max = $s(t.max, e, n, a, i);
}
function Us(t, e, [n, s, i], o, r) {
  au(t, e[n], e[s], e[i], e.scale, o, r);
}
const lu = ["x", "scaleX", "originX"], cu = ["y", "scaleY", "originY"];
function Ws(t, e, n, s) {
  Us(t.x, e, lu, n ? n.x : void 0, s ? s.x : void 0), Us(t.y, e, cu, n ? n.y : void 0, s ? s.y : void 0);
}
function Hs(t) {
  return t.translate === 0 && t.scale === 1;
}
function Ir(t) {
  return Hs(t.x) && Hs(t.y);
}
function Gs(t, e) {
  return t.min === e.min && t.max === e.max;
}
function uu(t, e) {
  return Gs(t.x, e.x) && Gs(t.y, e.y);
}
function zs(t, e) {
  return Math.round(t.min) === Math.round(e.min) && Math.round(t.max) === Math.round(e.max);
}
function Or(t, e) {
  return zs(t.x, e.x) && zs(t.y, e.y);
}
function Ys(t) {
  return F(t.x) / F(t.y);
}
function Xs(t, e) {
  return t.translate === e.translate && t.scale === e.scale && t.originPoint === e.originPoint;
}
class hu {
  constructor() {
    this.members = [];
  }
  add(e) {
    cn(this.members, e), e.scheduleRender();
  }
  remove(e) {
    if (un(this.members, e), e === this.prevLead && (this.prevLead = void 0), e === this.lead) {
      const n = this.members[this.members.length - 1];
      n && this.promote(n);
    }
  }
  relegate(e) {
    const n = this.members.findIndex((i) => e === i);
    if (n === 0)
      return !1;
    let s;
    for (let i = n; i >= 0; i--) {
      const o = this.members[i];
      if (o.isPresent !== !1) {
        s = o;
        break;
      }
    }
    return s ? (this.promote(s), !0) : !1;
  }
  promote(e, n) {
    const s = this.lead;
    if (e !== s && (this.prevLead = s, this.lead = e, e.show(), s)) {
      s.instance && s.scheduleRender(), e.scheduleRender(), e.resumeFrom = s, n && (e.resumeFrom.preserveOpacity = !0), s.snapshot && (e.snapshot = s.snapshot, e.snapshot.latestValues = s.animationValues || s.latestValues), e.root && e.root.isUpdating && (e.isLayoutDirty = !0);
      const { crossfade: i } = e.options;
      i === !1 && s.hide();
    }
  }
  exitAnimationComplete() {
    this.members.forEach((e) => {
      const { options: n, resumingFrom: s } = e;
      n.onExitComplete && n.onExitComplete(), s && s.options.onExitComplete && s.options.onExitComplete();
    });
  }
  scheduleRender() {
    this.members.forEach((e) => {
      e.instance && e.scheduleRender(!1);
    });
  }
  /**
   * Clear any leads that have been removed this render to prevent them from being
   * used in future animations and to prevent memory leaks
   */
  removeLeadSnapshot() {
    this.lead && this.lead.snapshot && (this.lead.snapshot = void 0);
  }
}
function du(t, e, n) {
  let s = "";
  const i = t.x.translate / e.x, o = t.y.translate / e.y, r = n?.z || 0;
  if ((i || o || r) && (s = `translate3d(${i}px, ${o}px, ${r}px) `), (e.x !== 1 || e.y !== 1) && (s += `scale(${1 / e.x}, ${1 / e.y}) `), n) {
    const { transformPerspective: u, rotate: c, rotateX: h, rotateY: d, skewX: f, skewY: m } = n;
    u && (s = `perspective(${u}px) ${s}`), c && (s += `rotate(${c}deg) `), h && (s += `rotateX(${h}deg) `), d && (s += `rotateY(${d}deg) `), f && (s += `skewX(${f}deg) `), m && (s += `skewY(${m}deg) `);
  }
  const a = t.x.scale * e.x, l = t.y.scale * e.y;
  return (a !== 1 || l !== 1) && (s += `scale(${a}, ${l})`), s || "none";
}
const Le = ["", "X", "Y", "Z"], fu = 1e3;
let pu = 0;
function je(t, e, n, s) {
  const { latestValues: i } = e;
  i[t] && (n[t] = i[t], e.setStaticValue(t, 0), s && (s[t] = 0));
}
function Fr(t) {
  if (t.hasCheckedOptimisedAppear = !0, t.root === t)
    return;
  const { visualElement: e } = t.options;
  if (!e)
    return;
  const n = Ar(e);
  if (window.MotionHasOptimisedAnimation(n, "transform")) {
    const { layout: i, layoutId: o } = t.options;
    window.MotionCancelOptimisedAnimation(n, "transform", V, !(i || o));
  }
  const { parent: s } = t;
  s && !s.hasCheckedOptimisedAppear && Fr(s);
}
function Nr({ attachResizeListener: t, defaultParent: e, measureScroll: n, checkIsScrollRoot: s, resetTransform: i }) {
  return class {
    constructor(r = {}, a = e?.()) {
      this.id = pu++, this.animationId = 0, this.animationCommitId = 0, this.children = /* @__PURE__ */ new Set(), this.options = {}, this.isTreeAnimating = !1, this.isAnimationBlocked = !1, this.isLayoutDirty = !1, this.isProjectionDirty = !1, this.isSharedProjectionDirty = !1, this.isTransformDirty = !1, this.updateManuallyBlocked = !1, this.updateBlockedByResize = !1, this.isUpdating = !1, this.isSVG = !1, this.needsReset = !1, this.shouldResetTransform = !1, this.hasCheckedOptimisedAppear = !1, this.treeScale = { x: 1, y: 1 }, this.eventHandlers = /* @__PURE__ */ new Map(), this.hasTreeAnimated = !1, this.updateScheduled = !1, this.scheduleUpdate = () => this.update(), this.projectionUpdateScheduled = !1, this.checkUpdateFailed = () => {
        this.isUpdating && (this.isUpdating = !1, this.clearAllSnapshots());
      }, this.updateProjection = () => {
        this.projectionUpdateScheduled = !1, this.nodes.forEach(gu), this.nodes.forEach(bu), this.nodes.forEach(Su), this.nodes.forEach(vu);
      }, this.resolvedRelativeTargetAt = 0, this.hasProjected = !1, this.isVisible = !0, this.animationProgress = 0, this.sharedNodes = /* @__PURE__ */ new Map(), this.latestValues = r, this.root = a ? a.root || a : this, this.path = a ? [...a.path, a] : [], this.parent = a, this.depth = a ? a.depth + 1 : 0;
      for (let l = 0; l < this.path.length; l++)
        this.path[l].shouldResetTransform = !0;
      this.root === this && (this.nodes = new eu());
    }
    addEventListener(r, a) {
      return this.eventHandlers.has(r) || this.eventHandlers.set(r, new fn()), this.eventHandlers.get(r).add(a);
    }
    notifyListeners(r, ...a) {
      const l = this.eventHandlers.get(r);
      l && l.notify(...a);
    }
    hasListeners(r) {
      return this.eventHandlers.has(r);
    }
    /**
     * Lifecycles
     */
    mount(r) {
      if (this.instance)
        return;
      this.isSVG = tr(r) && !il(r), this.instance = r;
      const { layoutId: a, layout: l, visualElement: u } = this.options;
      if (u && !u.current && u.mount(r), this.root.nodes.add(this), this.parent && this.parent.children.add(this), this.root.hasTreeAnimated && (l || a) && (this.isLayoutDirty = !0), t) {
        let c, h = 0;
        const d = () => this.root.updateBlockedByResize = !1;
        V.read(() => {
          h = window.innerWidth;
        }), t(r, () => {
          const f = window.innerWidth;
          f !== h && (h = f, this.root.updateBlockedByResize = !0, c && c(), c = nu(d, 250), ne.hasAnimatedSinceResize && (ne.hasAnimatedSinceResize = !1, this.nodes.forEach(qs)));
        });
      }
      a && this.root.registerSharedNode(a, this), this.options.animate !== !1 && u && (a || l) && this.addEventListener("didUpdate", ({ delta: c, hasLayoutChanged: h, hasRelativeLayoutChanged: d, layout: f }) => {
        if (this.isTreeAnimationBlocked()) {
          this.target = void 0, this.relativeTarget = void 0;
          return;
        }
        const m = this.options.transition || u.getDefaultTransition() || Vu, { onLayoutAnimationStart: x, onLayoutAnimationComplete: S } = u.getProps(), g = !this.targetLayout || !Or(this.targetLayout, f), b = !h && d;
        if (this.options.layoutRoot || this.resumeFrom || b || h && (g || !this.currentAnimation)) {
          this.resumeFrom && (this.resumingFrom = this.resumeFrom, this.resumingFrom.resumingFrom = void 0);
          const T = {
            ...Cn(m, "layout"),
            onPlay: x,
            onComplete: S
          };
          (u.shouldReduceMotion || this.options.layoutRoot) && (T.delay = 0, T.type = !1), this.startAnimation(T), this.setAnimationOrigin(c, b);
        } else
          h || qs(this), this.isLead() && this.options.onExitComplete && this.options.onExitComplete();
        this.targetLayout = f;
      });
    }
    unmount() {
      this.options.layoutId && this.willUpdate(), this.root.nodes.remove(this);
      const r = this.getStack();
      r && r.remove(this), this.parent && this.parent.children.delete(this), this.instance = void 0, this.eventHandlers.clear(), et(this.updateProjection);
    }
    // only on the root
    blockUpdate() {
      this.updateManuallyBlocked = !0;
    }
    unblockUpdate() {
      this.updateManuallyBlocked = !1;
    }
    isUpdateBlocked() {
      return this.updateManuallyBlocked || this.updateBlockedByResize;
    }
    isTreeAnimationBlocked() {
      return this.isAnimationBlocked || this.parent && this.parent.isTreeAnimationBlocked() || !1;
    }
    // Note: currently only running on root node
    startUpdate() {
      this.isUpdateBlocked() || (this.isUpdating = !0, this.nodes && this.nodes.forEach(Au), this.animationId++);
    }
    getTransformTemplate() {
      const { visualElement: r } = this.options;
      return r && r.getProps().transformTemplate;
    }
    willUpdate(r = !0) {
      if (this.root.hasTreeAnimated = !0, this.root.isUpdateBlocked()) {
        this.options.onExitComplete && this.options.onExitComplete();
        return;
      }
      if (window.MotionCancelOptimisedAnimation && !this.hasCheckedOptimisedAppear && Fr(this), !this.root.isUpdating && this.root.startUpdate(), this.isLayoutDirty)
        return;
      this.isLayoutDirty = !0;
      for (let c = 0; c < this.path.length; c++) {
        const h = this.path[c];
        h.shouldResetTransform = !0, h.updateScroll("snapshot"), h.options.layoutRoot && h.willUpdate(!1);
      }
      const { layoutId: a, layout: l } = this.options;
      if (a === void 0 && !l)
        return;
      const u = this.getTransformTemplate();
      this.prevTransformTemplateValue = u ? u(this.latestValues, "") : void 0, this.updateSnapshot(), r && this.notifyListeners("willUpdate");
    }
    update() {
      if (this.updateScheduled = !1, this.isUpdateBlocked()) {
        this.unblockUpdate(), this.clearAllSnapshots(), this.nodes.forEach(Js);
        return;
      }
      if (this.animationId <= this.animationCommitId) {
        this.nodes.forEach(Qs);
        return;
      }
      this.animationCommitId = this.animationId, this.isUpdating ? (this.isUpdating = !1, this.nodes.forEach(Tu), this.nodes.forEach(mu), this.nodes.forEach(yu)) : this.nodes.forEach(Qs), this.clearAllSnapshots();
      const a = K.now();
      B.delta = Q(0, 1e3 / 60, a - B.timestamp), B.timestamp = a, B.isProcessing = !0, be.update.process(B), be.preRender.process(B), be.render.process(B), B.isProcessing = !1;
    }
    didUpdate() {
      this.updateScheduled || (this.updateScheduled = !0, Dn.read(this.scheduleUpdate));
    }
    clearAllSnapshots() {
      this.nodes.forEach(xu), this.sharedNodes.forEach(Pu);
    }
    scheduleUpdateProjection() {
      this.projectionUpdateScheduled || (this.projectionUpdateScheduled = !0, V.preRender(this.updateProjection, !1, !0));
    }
    scheduleCheckAfterUnmount() {
      V.postRender(() => {
        this.isLayoutDirty ? this.root.didUpdate() : this.root.checkUpdateFailed();
      });
    }
    /**
     * Update measurements
     */
    updateSnapshot() {
      this.snapshot || !this.instance || (this.snapshot = this.measure(), this.snapshot && !F(this.snapshot.measuredBox.x) && !F(this.snapshot.measuredBox.y) && (this.snapshot = void 0));
    }
    updateLayout() {
      if (!this.instance || (this.updateScroll(), !(this.options.alwaysMeasureLayout && this.isLead()) && !this.isLayoutDirty))
        return;
      if (this.resumeFrom && !this.resumeFrom.instance)
        for (let l = 0; l < this.path.length; l++)
          this.path[l].updateScroll();
      const r = this.layout;
      this.layout = this.measure(!1), this.layoutCorrected = R(), this.isLayoutDirty = !1, this.projectionDelta = void 0, this.notifyListeners("measure", this.layout.layoutBox);
      const { visualElement: a } = this.options;
      a && a.notify("LayoutMeasure", this.layout.layoutBox, r ? r.layoutBox : void 0);
    }
    updateScroll(r = "measure") {
      let a = !!(this.options.layoutScroll && this.instance);
      if (this.scroll && this.scroll.animationId === this.root.animationId && this.scroll.phase === r && (a = !1), a && this.instance) {
        const l = s(this.instance);
        this.scroll = {
          animationId: this.root.animationId,
          phase: r,
          isRoot: l,
          offset: n(this.instance),
          wasRoot: this.scroll ? this.scroll.isRoot : l
        };
      }
    }
    resetTransform() {
      if (!i)
        return;
      const r = this.isLayoutDirty || this.shouldResetTransform || this.options.alwaysMeasureLayout, a = this.projectionDelta && !Ir(this.projectionDelta), l = this.getTransformTemplate(), u = l ? l(this.latestValues, "") : void 0, c = u !== this.prevTransformTemplateValue;
      r && this.instance && (a || ot(this.latestValues) || c) && (i(this.instance, u), this.shouldResetTransform = !1, this.scheduleRender());
    }
    measure(r = !0) {
      const a = this.measurePageBox();
      let l = this.removeElementScroll(a);
      return r && (l = this.removeTransform(l)), Du(l), {
        animationId: this.root.animationId,
        measuredBox: a,
        layoutBox: l,
        latestValues: {},
        source: this.id
      };
    }
    measurePageBox() {
      const { visualElement: r } = this.options;
      if (!r)
        return R();
      const a = r.measureViewportBox();
      if (!(this.scroll?.wasRoot || this.path.some(Mu))) {
        const { scroll: u } = this.root;
        u && (vt(a.x, u.offset.x), vt(a.y, u.offset.y));
      }
      return a;
    }
    removeElementScroll(r) {
      const a = R();
      if ($(a, r), this.scroll?.wasRoot)
        return a;
      for (let l = 0; l < this.path.length; l++) {
        const u = this.path[l], { scroll: c, options: h } = u;
        u !== this.root && c && h.layoutScroll && (c.wasRoot && $(a, r), vt(a.x, c.offset.x), vt(a.y, c.offset.y));
      }
      return a;
    }
    applyTransform(r, a = !1) {
      const l = R();
      $(l, r);
      for (let u = 0; u < this.path.length; u++) {
        const c = this.path[u];
        !a && c.options.layoutScroll && c.scroll && c !== c.root && xt(l, {
          x: -c.scroll.offset.x,
          y: -c.scroll.offset.y
        }), ot(c.latestValues) && xt(l, c.latestValues);
      }
      return ot(this.latestValues) && xt(l, this.latestValues), l;
    }
    removeTransform(r) {
      const a = R();
      $(a, r);
      for (let l = 0; l < this.path.length; l++) {
        const u = this.path[l];
        if (!u.instance || !ot(u.latestValues))
          continue;
        Xe(u.latestValues) && u.updateSnapshot();
        const c = R(), h = u.measurePageBox();
        $(c, h), Ws(a, u.latestValues, u.snapshot ? u.snapshot.layoutBox : void 0, c);
      }
      return ot(this.latestValues) && Ws(a, this.latestValues), a;
    }
    setTargetDelta(r) {
      this.targetDelta = r, this.root.scheduleUpdateProjection(), this.isProjectionDirty = !0;
    }
    setOptions(r) {
      this.options = {
        ...this.options,
        ...r,
        crossfade: r.crossfade !== void 0 ? r.crossfade : !0
      };
    }
    clearMeasurements() {
      this.scroll = void 0, this.layout = void 0, this.snapshot = void 0, this.prevTransformTemplateValue = void 0, this.targetDelta = void 0, this.target = void 0, this.isLayoutDirty = !1;
    }
    forceRelativeParentToResolveTarget() {
      this.relativeParent && this.relativeParent.resolvedRelativeTargetAt !== B.timestamp && this.relativeParent.resolveTargetDelta(!0);
    }
    resolveTargetDelta(r = !1) {
      const a = this.getLead();
      this.isProjectionDirty || (this.isProjectionDirty = a.isProjectionDirty), this.isTransformDirty || (this.isTransformDirty = a.isTransformDirty), this.isSharedProjectionDirty || (this.isSharedProjectionDirty = a.isSharedProjectionDirty);
      const l = !!this.resumingFrom || this !== a;
      if (!(r || l && this.isSharedProjectionDirty || this.isProjectionDirty || this.parent?.isProjectionDirty || this.attemptToResolveRelativeTarget || this.root.updateBlockedByResize))
        return;
      const { layout: c, layoutId: h } = this.options;
      if (!(!this.layout || !(c || h))) {
        if (this.resolvedRelativeTargetAt = B.timestamp, !this.targetDelta && !this.relativeTarget) {
          const d = this.getClosestProjectingParent();
          d && d.layout && this.animationProgress !== 1 ? (this.relativeParent = d, this.forceRelativeParentToResolveTarget(), this.relativeTarget = R(), this.relativeTargetOrigin = R(), Bt(this.relativeTargetOrigin, this.layout.layoutBox, d.layout.layoutBox), $(this.relativeTarget, this.relativeTargetOrigin)) : this.relativeParent = this.relativeTarget = void 0;
        }
        if (!(!this.relativeTarget && !this.targetDelta) && (this.target || (this.target = R(), this.targetWithTransforms = R()), this.relativeTarget && this.relativeTargetOrigin && this.relativeParent && this.relativeParent.target ? (this.forceRelativeParentToResolveTarget(), Bc(this.target, this.relativeTarget, this.relativeParent.target)) : this.targetDelta ? (this.resumingFrom ? this.target = this.applyTransform(this.layout.layoutBox) : $(this.target, this.layout.layoutBox), gr(this.target, this.targetDelta)) : $(this.target, this.layout.layoutBox), this.attemptToResolveRelativeTarget)) {
          this.attemptToResolveRelativeTarget = !1;
          const d = this.getClosestProjectingParent();
          d && !!d.resumingFrom == !!this.resumingFrom && !d.options.layoutScroll && d.target && this.animationProgress !== 1 ? (this.relativeParent = d, this.forceRelativeParentToResolveTarget(), this.relativeTarget = R(), this.relativeTargetOrigin = R(), Bt(this.relativeTargetOrigin, this.target, d.target), $(this.relativeTarget, this.relativeTargetOrigin)) : this.relativeParent = this.relativeTarget = void 0;
        }
      }
    }
    getClosestProjectingParent() {
      if (!(!this.parent || Xe(this.parent.latestValues) || yr(this.parent.latestValues)))
        return this.parent.isProjecting() ? this.parent : this.parent.getClosestProjectingParent();
    }
    isProjecting() {
      return !!((this.relativeTarget || this.targetDelta || this.options.layoutRoot) && this.layout);
    }
    calcProjection() {
      const r = this.getLead(), a = !!this.resumingFrom || this !== r;
      let l = !0;
      if ((this.isProjectionDirty || this.parent?.isProjectionDirty) && (l = !1), a && (this.isSharedProjectionDirty || this.isTransformDirty) && (l = !1), this.resolvedRelativeTargetAt === B.timestamp && (l = !1), l)
        return;
      const { layout: u, layoutId: c } = this.options;
      if (this.isTreeAnimating = !!(this.parent && this.parent.isTreeAnimating || this.currentAnimation || this.pendingAnimation), this.isTreeAnimating || (this.targetDelta = this.relativeTarget = void 0), !this.layout || !(u || c))
        return;
      $(this.layoutCorrected, this.layout.layoutBox);
      const h = this.treeScale.x, d = this.treeScale.y;
      zl(this.layoutCorrected, this.treeScale, this.path, a), r.layout && !r.target && (this.treeScale.x !== 1 || this.treeScale.y !== 1) && (r.target = r.layout.layoutBox, r.targetWithTransforms = R());
      const { target: f } = r;
      if (!f) {
        this.prevProjectionDelta && (this.createProjectionDeltas(), this.scheduleRender());
        return;
      }
      !this.projectionDelta || !this.prevProjectionDelta ? this.createProjectionDeltas() : (_s(this.prevProjectionDelta.x, this.projectionDelta.x), _s(this.prevProjectionDelta.y, this.projectionDelta.y)), kt(this.projectionDelta, this.layoutCorrected, f, this.latestValues), (this.treeScale.x !== h || this.treeScale.y !== d || !Xs(this.projectionDelta.x, this.prevProjectionDelta.x) || !Xs(this.projectionDelta.y, this.prevProjectionDelta.y)) && (this.hasProjected = !0, this.scheduleRender(), this.notifyListeners("projectionUpdate", f));
    }
    hide() {
      this.isVisible = !1;
    }
    show() {
      this.isVisible = !0;
    }
    scheduleRender(r = !0) {
      if (this.options.visualElement?.scheduleRender(), r) {
        const a = this.getStack();
        a && a.scheduleRender();
      }
      this.resumingFrom && !this.resumingFrom.instance && (this.resumingFrom = void 0);
    }
    createProjectionDeltas() {
      this.prevProjectionDelta = Tt(), this.projectionDelta = Tt(), this.projectionDeltaWithTransform = Tt();
    }
    setAnimationOrigin(r, a = !1) {
      const l = this.snapshot, u = l ? l.latestValues : {}, c = { ...this.latestValues }, h = Tt();
      (!this.relativeParent || !this.relativeParent.options.layoutRoot) && (this.relativeTarget = this.relativeTargetOrigin = void 0), this.attemptToResolveRelativeTarget = !a;
      const d = R(), f = l ? l.source : void 0, m = this.layout ? this.layout.source : void 0, x = f !== m, S = this.getStack(), g = !S || S.members.length <= 1, b = !!(x && !g && this.options.crossfade === !0 && !this.path.some(Cu));
      this.animationProgress = 0;
      let T;
      this.mixTargetDelta = (w) => {
        const y = w / 1e3;
        Zs(h.x, r.x, y), Zs(h.y, r.y, y), this.setTargetDelta(h), this.relativeTarget && this.relativeTargetOrigin && this.layout && this.relativeParent && this.relativeParent.layout && (Bt(d, this.layout.layoutBox, this.relativeParent.layout.layoutBox), wu(this.relativeTarget, this.relativeTargetOrigin, d, y), T && uu(this.relativeTarget, T) && (this.isProjectionDirty = !1), T || (T = R()), $(T, this.relativeTarget)), x && (this.animationValues = c, iu(c, u, this.latestValues, y, b, g)), this.root.scheduleUpdateProjection(), this.scheduleRender(), this.animationProgress = y;
      }, this.mixTargetDelta(this.options.layoutRoot ? 1e3 : 0);
    }
    startAnimation(r) {
      this.notifyListeners("animationStart"), this.currentAnimation?.stop(), this.resumingFrom?.currentAnimation?.stop(), this.pendingAnimation && (et(this.pendingAnimation), this.pendingAnimation = void 0), this.pendingAnimation = V.update(() => {
        ne.hasAnimatedSinceResize = !0, this.motionValue || (this.motionValue = St(0)), this.currentAnimation = Zc(this.motionValue, [0, 1e3], {
          ...r,
          velocity: 0,
          isSync: !0,
          onUpdate: (a) => {
            this.mixTargetDelta(a), r.onUpdate && r.onUpdate(a);
          },
          onStop: () => {
          },
          onComplete: () => {
            r.onComplete && r.onComplete(), this.completeAnimation();
          }
        }), this.resumingFrom && (this.resumingFrom.currentAnimation = this.currentAnimation), this.pendingAnimation = void 0;
      });
    }
    completeAnimation() {
      this.resumingFrom && (this.resumingFrom.currentAnimation = void 0, this.resumingFrom.preserveOpacity = void 0);
      const r = this.getStack();
      r && r.exitAnimationComplete(), this.resumingFrom = this.currentAnimation = this.animationValues = void 0, this.notifyListeners("animationComplete");
    }
    finishAnimation() {
      this.currentAnimation && (this.mixTargetDelta && this.mixTargetDelta(fu), this.currentAnimation.stop()), this.completeAnimation();
    }
    applyTransformsToTarget() {
      const r = this.getLead();
      let { targetWithTransforms: a, target: l, layout: u, latestValues: c } = r;
      if (!(!a || !l || !u)) {
        if (this !== r && this.layout && u && Kr(this.options.animationType, this.layout.layoutBox, u.layoutBox)) {
          l = this.target || R();
          const h = F(this.layout.layoutBox.x);
          l.x.min = r.target.x.min, l.x.max = l.x.min + h;
          const d = F(this.layout.layoutBox.y);
          l.y.min = r.target.y.min, l.y.max = l.y.min + d;
        }
        $(a, l), xt(a, c), kt(this.projectionDeltaWithTransform, this.layoutCorrected, a, c);
      }
    }
    registerSharedNode(r, a) {
      this.sharedNodes.has(r) || this.sharedNodes.set(r, new hu()), this.sharedNodes.get(r).add(a);
      const u = a.options.initialPromotionConfig;
      a.promote({
        transition: u ? u.transition : void 0,
        preserveFollowOpacity: u && u.shouldPreserveFollowOpacity ? u.shouldPreserveFollowOpacity(a) : void 0
      });
    }
    isLead() {
      const r = this.getStack();
      return r ? r.lead === this : !0;
    }
    getLead() {
      const { layoutId: r } = this.options;
      return r ? this.getStack()?.lead || this : this;
    }
    getPrevLead() {
      const { layoutId: r } = this.options;
      return r ? this.getStack()?.prevLead : void 0;
    }
    getStack() {
      const { layoutId: r } = this.options;
      if (r)
        return this.root.sharedNodes.get(r);
    }
    promote({ needsReset: r, transition: a, preserveFollowOpacity: l } = {}) {
      const u = this.getStack();
      u && u.promote(this, l), r && (this.projectionDelta = void 0, this.needsReset = !0), a && this.setOptions({ transition: a });
    }
    relegate() {
      const r = this.getStack();
      return r ? r.relegate(this) : !1;
    }
    resetSkewAndRotation() {
      const { visualElement: r } = this.options;
      if (!r)
        return;
      let a = !1;
      const { latestValues: l } = r;
      if ((l.z || l.rotate || l.rotateX || l.rotateY || l.rotateZ || l.skewX || l.skewY) && (a = !0), !a)
        return;
      const u = {};
      l.z && je("z", r, u, this.animationValues);
      for (let c = 0; c < Le.length; c++)
        je(`rotate${Le[c]}`, r, u, this.animationValues), je(`skew${Le[c]}`, r, u, this.animationValues);
      r.render();
      for (const c in u)
        r.setStaticValue(c, u[c]), this.animationValues && (this.animationValues[c] = u[c]);
      r.scheduleRender();
    }
    applyProjectionStyles(r, a) {
      if (!this.instance || this.isSVG)
        return;
      if (!this.isVisible) {
        r.visibility = "hidden";
        return;
      }
      const l = this.getTransformTemplate();
      if (this.needsReset) {
        this.needsReset = !1, r.visibility = "", r.opacity = "", r.pointerEvents = ee(a?.pointerEvents) || "", r.transform = l ? l(this.latestValues, "") : "none";
        return;
      }
      const u = this.getLead();
      if (!this.projectionDelta || !this.layout || !u.target) {
        this.options.layoutId && (r.opacity = this.latestValues.opacity !== void 0 ? this.latestValues.opacity : 1, r.pointerEvents = ee(a?.pointerEvents) || ""), this.hasProjected && !ot(this.latestValues) && (r.transform = l ? l({}, "") : "none", this.hasProjected = !1);
        return;
      }
      r.visibility = "";
      const c = u.animationValues || u.latestValues;
      this.applyTransformsToTarget();
      let h = du(this.projectionDeltaWithTransform, this.treeScale, c);
      l && (h = l(c, h)), r.transform = h;
      const { x: d, y: f } = this.projectionDelta;
      r.transformOrigin = `${d.origin * 100}% ${f.origin * 100}% 0`, u.animationValues ? r.opacity = u === this ? c.opacity ?? this.latestValues.opacity ?? 1 : this.preserveOpacity ? this.latestValues.opacity : c.opacityExit : r.opacity = u === this ? c.opacity !== void 0 ? c.opacity : "" : c.opacityExit !== void 0 ? c.opacityExit : 0;
      for (const m in Kt) {
        if (c[m] === void 0)
          continue;
        const { correct: x, applyTo: S, isCSSVariable: g } = Kt[m], b = h === "none" ? c[m] : x(c[m], u);
        if (S) {
          const T = S.length;
          for (let w = 0; w < T; w++)
            r[S[w]] = b;
        } else
          g ? this.options.visualElement.renderState.vars[m] = b : r[m] = b;
      }
      this.options.layoutId && (r.pointerEvents = u === this ? ee(a?.pointerEvents) || "" : "none");
    }
    clearSnapshot() {
      this.resumeFrom = this.snapshot = void 0;
    }
    // Only run on root
    resetTree() {
      this.root.nodes.forEach((r) => r.currentAnimation?.stop()), this.root.nodes.forEach(Js), this.root.sharedNodes.clear();
    }
  };
}
function mu(t) {
  t.updateLayout();
}
function yu(t) {
  const e = t.resumeFrom?.snapshot || t.snapshot;
  if (t.isLead() && t.layout && e && t.hasListeners("didUpdate")) {
    const { layoutBox: n, measuredBox: s } = t.layout, { animationType: i } = t.options, o = e.source !== t.layout.source;
    i === "size" ? U((c) => {
      const h = o ? e.measuredBox[c] : e.layoutBox[c], d = F(h);
      h.min = n[c].min, h.max = h.min + d;
    }) : Kr(i, e.layoutBox, n) && U((c) => {
      const h = o ? e.measuredBox[c] : e.layoutBox[c], d = F(n[c]);
      h.max = h.min + d, t.relativeTarget && !t.currentAnimation && (t.isProjectionDirty = !0, t.relativeTarget[c].max = t.relativeTarget[c].min + d);
    });
    const r = Tt();
    kt(r, n, e.layoutBox);
    const a = Tt();
    o ? kt(a, t.applyTransform(s, !0), e.measuredBox) : kt(a, n, e.layoutBox);
    const l = !Ir(r);
    let u = !1;
    if (!t.resumeFrom) {
      const c = t.getClosestProjectingParent();
      if (c && !c.resumeFrom) {
        const { snapshot: h, layout: d } = c;
        if (h && d) {
          const f = R();
          Bt(f, e.layoutBox, h.layoutBox);
          const m = R();
          Bt(m, n, d.layoutBox), Or(f, m) || (u = !0), c.options.layoutRoot && (t.relativeTarget = m, t.relativeTargetOrigin = f, t.relativeParent = c);
        }
      }
    }
    t.notifyListeners("didUpdate", {
      layout: n,
      snapshot: e,
      delta: a,
      layoutDelta: r,
      hasLayoutChanged: l,
      hasRelativeLayoutChanged: u
    });
  } else if (t.isLead()) {
    const { onExitComplete: n } = t.options;
    n && n();
  }
  t.options.transition = void 0;
}
function gu(t) {
  t.parent && (t.isProjecting() || (t.isProjectionDirty = t.parent.isProjectionDirty), t.isSharedProjectionDirty || (t.isSharedProjectionDirty = !!(t.isProjectionDirty || t.parent.isProjectionDirty || t.parent.isSharedProjectionDirty)), t.isTransformDirty || (t.isTransformDirty = t.parent.isTransformDirty));
}
function vu(t) {
  t.isProjectionDirty = t.isSharedProjectionDirty = t.isTransformDirty = !1;
}
function xu(t) {
  t.clearSnapshot();
}
function Js(t) {
  t.clearMeasurements();
}
function Qs(t) {
  t.isLayoutDirty = !1;
}
function Tu(t) {
  const { visualElement: e } = t.options;
  e && e.getProps().onBeforeLayoutMeasure && e.notify("BeforeLayoutMeasure"), t.resetTransform();
}
function qs(t) {
  t.finishAnimation(), t.targetDelta = t.relativeTarget = t.target = void 0, t.isProjectionDirty = !0;
}
function bu(t) {
  t.resolveTargetDelta();
}
function Su(t) {
  t.calcProjection();
}
function Au(t) {
  t.resetSkewAndRotation();
}
function Pu(t) {
  t.removeLeadSnapshot();
}
function Zs(t, e, n) {
  t.translate = D(e.translate, 0, n), t.scale = D(e.scale, 1, n), t.origin = e.origin, t.originPoint = e.originPoint;
}
function ti(t, e, n, s) {
  t.min = D(e.min, n.min, s), t.max = D(e.max, n.max, s);
}
function wu(t, e, n, s) {
  ti(t.x, e.x, n.x, s), ti(t.y, e.y, n.y, s);
}
function Cu(t) {
  return t.animationValues && t.animationValues.opacityExit !== void 0;
}
const Vu = {
  duration: 0.45,
  ease: [0.4, 0, 0.1, 1]
}, ei = (t) => typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().includes(t), ni = ei("applewebkit/") && !ei("chrome/") ? Math.round : H;
function si(t) {
  t.min = ni(t.min), t.max = ni(t.max);
}
function Du(t) {
  si(t.x), si(t.y);
}
function Kr(t, e, n) {
  return t === "position" || t === "preserve-aspect" && !kc(Ys(e), Ys(n), 0.2);
}
function Mu(t) {
  return t !== t.root && t.scroll?.wasRoot;
}
const Eu = Nr({
  attachResizeListener: (t, e) => _t(t, "resize", e),
  measureScroll: () => ({
    x: document.documentElement.scrollLeft || document.body.scrollLeft,
    y: document.documentElement.scrollTop || document.body.scrollTop
  }),
  checkIsScrollRoot: () => !0
}), ke = {
  current: void 0
}, _r = Nr({
  measureScroll: (t) => ({
    x: t.scrollLeft,
    y: t.scrollTop
  }),
  defaultParent: () => {
    if (!ke.current) {
      const t = new Eu({});
      t.mount(window), t.setOptions({ layoutScroll: !0 }), ke.current = t;
    }
    return ke.current;
  },
  resetTransform: (t, e) => {
    t.style.transform = e !== void 0 ? e : "none";
  },
  checkIsScrollRoot: (t) => window.getComputedStyle(t).position === "fixed"
}), Ru = {
  pan: {
    Feature: Xc
  },
  drag: {
    Feature: Yc,
    ProjectionNode: _r,
    MeasureLayout: jr
  }
};
function ii(t, e, n) {
  const { props: s } = t;
  t.animationState && s.whileHover && t.animationState.setActive("whileHover", n === "Start");
  const i = "onHover" + n, o = s[i];
  o && V.postRender(() => o(e, Ht(e)));
}
class Lu extends st {
  mount() {
    const { current: e } = this.node;
    e && (this.unmount = Za(e, (n, s) => (ii(this.node, s, "Start"), (i) => ii(this.node, i, "End"))));
  }
  unmount() {
  }
}
class ju extends st {
  constructor() {
    super(...arguments), this.isActive = !1;
  }
  onFocus() {
    let e = !1;
    try {
      e = this.node.current.matches(":focus-visible");
    } catch {
      e = !0;
    }
    !e || !this.node.animationState || (this.node.animationState.setActive("whileFocus", !0), this.isActive = !0);
  }
  onBlur() {
    !this.isActive || !this.node.animationState || (this.node.animationState.setActive("whileFocus", !1), this.isActive = !1);
  }
  mount() {
    this.unmount = $t(_t(this.node.current, "focus", () => this.onFocus()), _t(this.node.current, "blur", () => this.onBlur()));
  }
  unmount() {
  }
}
function ri(t, e, n) {
  const { props: s } = t;
  if (t.current instanceof HTMLButtonElement && t.current.disabled)
    return;
  t.animationState && s.whileTap && t.animationState.setActive("whileTap", n === "Start");
  const i = "onTap" + (n === "End" ? "" : n), o = s[i];
  o && V.postRender(() => o(e, Ht(e)));
}
class ku extends st {
  mount() {
    const { current: e } = this.node;
    e && (this.unmount = sl(e, (n, s) => (ri(this.node, s, "Start"), (i, { success: o }) => ri(this.node, i, o ? "End" : "Cancel")), { useGlobalTarget: this.node.props.globalTapTarget }));
  }
  unmount() {
  }
}
const nn = /* @__PURE__ */ new WeakMap(), Be = /* @__PURE__ */ new WeakMap(), Bu = (t) => {
  const e = nn.get(t.target);
  e && e(t);
}, Iu = (t) => {
  t.forEach(Bu);
};
function Ou({ root: t, ...e }) {
  const n = t || document;
  Be.has(n) || Be.set(n, {});
  const s = Be.get(n), i = JSON.stringify(e);
  return s[i] || (s[i] = new IntersectionObserver(Iu, { root: t, ...e })), s[i];
}
function Fu(t, e, n) {
  const s = Ou(e);
  return nn.set(t, n), s.observe(t), () => {
    nn.delete(t), s.unobserve(t);
  };
}
const Nu = {
  some: 0,
  all: 1
};
class Ku extends st {
  constructor() {
    super(...arguments), this.hasEnteredView = !1, this.isInView = !1;
  }
  startObserver() {
    this.unmount();
    const { viewport: e = {} } = this.node.getProps(), { root: n, margin: s, amount: i = "some", once: o } = e, r = {
      root: n ? n.current : void 0,
      rootMargin: s,
      threshold: typeof i == "number" ? i : Nu[i]
    }, a = (l) => {
      const { isIntersecting: u } = l;
      if (this.isInView === u || (this.isInView = u, o && !u && this.hasEnteredView))
        return;
      u && (this.hasEnteredView = !0), this.node.animationState && this.node.animationState.setActive("whileInView", u);
      const { onViewportEnter: c, onViewportLeave: h } = this.node.getProps(), d = u ? c : h;
      d && d(l);
    };
    return Fu(this.node.current, r, a);
  }
  mount() {
    this.startObserver();
  }
  update() {
    if (typeof IntersectionObserver > "u")
      return;
    const { props: e, prevProps: n } = this.node;
    ["amount", "margin", "root"].some(_u(e, n)) && this.startObserver();
  }
  unmount() {
  }
}
function _u({ viewport: t = {} }, { viewport: e = {} } = {}) {
  return (n) => t[n] !== e[n];
}
const $u = {
  inView: {
    Feature: Ku
  },
  tap: {
    Feature: ku
  },
  focus: {
    Feature: ju
  },
  hover: {
    Feature: Lu
  }
}, Uu = {
  layout: {
    ProjectionNode: _r,
    MeasureLayout: jr
  }
}, Wu = {
  ...Dc,
  ...$u,
  ...Ru,
  ...Uu
}, N = /* @__PURE__ */ Wl(Wu, sc);
let mt = null, qt = null;
function Kn() {
  !mt && typeof window < "u" && window.CARDS_BUNDLE && (mt = window.CARDS_BUNDLE);
  const [t, e] = se(mt);
  return pe(() => {
    if (mt) {
      e(mt);
      return;
    }
    qt || (qt = fetch("/assets/cards-bundle.json").then((n) => n.json()).then((n) => (mt = n, n)).catch((n) => (console.error("Failed to load cards bundle:", n), qt = null, null))), qt.then((n) => {
      n && e(n);
    });
  }, []), t;
}
const Hu = 620, Gu = 1, oi = [
  {
    id: 1,
    position: "CO",
    name: "CO",
    chips: 5e3,
    dealOrder: 5,
    layoutPosition: "top",
    style: { top: "calc(-1 * var(--player-offset-top))", left: "50%", transform: "translateX(-50%)" }
  },
  {
    id: 2,
    position: "BTN",
    name: "BTN",
    chips: 7500,
    dealOrder: 6,
    layoutPosition: "right",
    style: { top: "var(--player-offset-side-inner)", right: "calc(-1 * var(--player-offset-side))" }
  },
  {
    id: 3,
    position: "SB",
    name: "SB",
    chips: 4200,
    dealOrder: 1,
    layoutPosition: "right",
    style: { bottom: "var(--player-offset-side-inner)", right: "calc(-1 * var(--player-offset-side))" }
  },
  {
    id: 4,
    position: "BB",
    name: "YOU (BB)",
    chips: 6e3,
    dealOrder: 2,
    isYou: !0,
    layoutPosition: "bottom",
    style: { bottom: "calc(-1 * var(--player-offset-top))", left: "50%", transform: "translateX(-50%)" }
  },
  {
    id: 5,
    position: "UTG",
    name: "UTG",
    chips: 3800,
    dealOrder: 3,
    layoutPosition: "left",
    style: { bottom: "var(--player-offset-side-inner)", left: "calc(-1 * var(--player-offset-side))" }
  },
  {
    id: 6,
    position: "HJ",
    name: "HJ",
    chips: 5500,
    dealOrder: 4,
    layoutPosition: "left",
    style: { top: "var(--player-offset-side-inner)", left: "calc(-1 * var(--player-offset-side))" }
  }
], zu = {
  BTN: "#f1c40f",
  SB: "#e74c3c",
  BB: "#e74c3c",
  UTG: "#3498db",
  HJ: "#9b59b6",
  CO: "#27ae60"
}, $r = "/", Yu = {
  "♥": "H",
  "♦": "D",
  "♣": "C",
  "♠": "S"
};
function Ur(t) {
  if (!t) return null;
  const e = t.rank === "10" ? "T" : t.rank, n = Yu[t.suit] || "S";
  return `${e}${n}`;
}
function Xu(t) {
  return `${$r}assets/positions/${t}.svg`;
}
function Ju() {
  return `${$r}assets/decorative/dealer-button.svg`;
}
function Wr({ cardId: t, cards: e }) {
  const n = e?.[t];
  return n ? /* @__PURE__ */ p.jsx(
    "div",
    {
      dangerouslySetInnerHTML: {
        __html: n.replace(/width="2\.5in"/, 'width="100%"').replace(/height="3\.5in"/, 'height="100%"')
      },
      style: { width: "100%", height: "100%" }
    }
  ) : null;
}
function Hr() {
  return /* @__PURE__ */ p.jsxs("svg", { viewBox: "-120 -168 240 336", style: { width: "100%", height: "100%" }, children: [
    /* @__PURE__ */ p.jsx("rect", { width: "239", height: "335", x: "-119.5", y: "-167.5", rx: "12", fill: "white", stroke: "black" }),
    /* @__PURE__ */ p.jsx("rect", { width: "216", height: "312", x: "-108", y: "-156", rx: "8", fill: "#b22222" }),
    /* @__PURE__ */ p.jsx("rect", { width: "196", height: "292", x: "-98", y: "-146", rx: "4", fill: "none", stroke: "white", strokeWidth: "2" })
  ] });
}
function Qu({ card: t, dealOrder: e = 0, isFolded: n = !1, isHidden: s = !0, cards: i }) {
  const o = e * 0.15, r = s ? null : Ur(t);
  return /* @__PURE__ */ p.jsx(
    N.div,
    {
      className: `card-wrapper ${n ? "folded" : ""}`,
      initial: { opacity: 0, y: -100, rotateY: 180 },
      animate: {
        opacity: n ? 0.3 : 1,
        y: 0,
        rotateY: 0
      },
      transition: {
        delay: o,
        duration: 0.4,
        type: "spring",
        stiffness: 200
      },
      children: /* @__PURE__ */ p.jsx("div", { className: "card-image", children: r ? /* @__PURE__ */ p.jsx(Wr, { cardId: r, cards: i }) : /* @__PURE__ */ p.jsx(Hr, {}) })
    }
  );
}
function qu({ card: t, dealOrder: e = 0, cards: n }) {
  const s = e * 0.15, i = Ur(t);
  return /* @__PURE__ */ p.jsx(
    N.div,
    {
      className: "community-card-wrapper",
      initial: { opacity: 0, y: -50, rotateY: 180 },
      animate: { opacity: 1, y: 0, rotateY: 0 },
      transition: { delay: s, duration: 0.4, type: "spring" },
      children: /* @__PURE__ */ p.jsx("div", { className: "community-card-image", children: i ? /* @__PURE__ */ p.jsx(Wr, { cardId: i, cards: n }) : /* @__PURE__ */ p.jsx(Hr, {}) })
    }
  );
}
function Zu({ action: t, delay: e }) {
  let n = t.toLowerCase();
  return t.includes("$") && (n = "blind"), /* @__PURE__ */ p.jsx(
    N.div,
    {
      className: `action-indicator ${n}`,
      initial: { opacity: 0, scale: 0 },
      animate: { opacity: 1, scale: 1 },
      transition: {
        delay: e,
        type: "spring",
        stiffness: 300,
        damping: 15
      },
      children: t
    }
  );
}
function th({ amount: t, layoutPosition: e }) {
  if (!t || t <= 0) return null;
  const s = (() => {
    switch (e) {
      case "top":
        return { x: 0, y: 150 };
      case "bottom":
        return { x: 0, y: -150 };
      case "left":
        return { x: 200, y: 0 };
      case "right":
        return { x: -200, y: 0 };
      default:
        return { x: 0, y: 0 };
    }
  })();
  return /* @__PURE__ */ p.jsxs(
    N.div,
    {
      className: "chip-animation",
      initial: { opacity: 1, scale: 1, x: 0, y: 0 },
      animate: {
        opacity: [1, 1, 0],
        scale: [1, 0.8, 0.5],
        x: s.x,
        y: s.y
      },
      transition: {
        duration: 0.6,
        ease: "easeOut",
        times: [0, 0.7, 1]
      },
      children: [
        /* @__PURE__ */ p.jsxs("div", { className: "chip-stack", children: [
          /* @__PURE__ */ p.jsx("div", { className: "chip red" }),
          /* @__PURE__ */ p.jsx("div", { className: "chip red" }),
          /* @__PURE__ */ p.jsx("div", { className: "chip red" })
        ] }),
        /* @__PURE__ */ p.jsxs("span", { className: "chip-amount", children: [
          "$",
          t
        ] })
      ]
    }
  );
}
function eh({ player: t, step: e, cardsDealt: n, yourCards: s, foldedPlayers: i, calledPlayers: o, checkedPlayers: r, raisedPlayers: a, blindPlayers: l, phase: u, playerChips: c, latestBet: h, cards: d }) {
  const [f, m] = se(!1), x = n && e >= 2, S = i.includes(t.position), g = o.includes(t.position), b = r?.includes(t.position), T = a?.includes(t.position), w = l?.[t.position] && u === "preflop", y = t.isYou ? s : [null, null], v = zu[t.position], C = Xu(t.position), A = c?.[t.position] ?? t.chips, E = h?.[t.position]?.amount, j = t.layoutPosition === "top", z = t.layoutPosition === "bottom", Gt = t.layoutPosition === "left", xe = j ? { top: "100%", left: "50%", transform: "translateX(-50%)" } : z ? { bottom: "100%", left: "50%", transform: "translateX(-50%)" } : Gt ? { left: "100%", top: "50%", transform: "translateY(-50%)" } : { right: "100%", top: "50%", transform: "translateY(-50%)" };
  let Y = null;
  return S ? Y = "FOLD" : T ? Y = "RAISE" : g ? Y = "CALL" : b ? Y = "CHECK" : w && (Y = t.position === "SB" ? "SB $50" : "BB $100"), /* @__PURE__ */ p.jsxs(
    N.div,
    {
      className: `player ${t.isYou ? "you" : ""} ${t.layoutPosition || ""}`,
      style: t.style,
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { delay: t.id * 0.1 },
      children: [
        /* @__PURE__ */ p.jsx("div", { className: "position-icon", style: f ? { background: v } : {}, children: f ? /* @__PURE__ */ p.jsx("span", { style: { color: "#fff", fontWeight: "bold", fontSize: "14px" }, children: t.position }) : /* @__PURE__ */ p.jsx(
          "img",
          {
            src: C,
            alt: t.position,
            onError: () => m(!0)
          }
        ) }),
        /* @__PURE__ */ p.jsxs("div", { className: "player-info", children: [
          /* @__PURE__ */ p.jsx("div", { className: "player-name", style: t.isYou ? { color: v } : {}, children: t.isYou ? "YOU" : t.position }),
          /* @__PURE__ */ p.jsxs(
            N.div,
            {
              className: "player-chips",
              initial: { scale: 1.2, color: "#e74c3c" },
              animate: { scale: 1, color: "#f1c40f" },
              transition: { duration: 0.3 },
              children: [
                "$",
                A.toLocaleString()
              ]
            },
            A
          )
        ] }),
        /* @__PURE__ */ p.jsx("div", { className: "player-cards", style: { position: "absolute", ...xe }, children: x && y.map((zt, _n) => /* @__PURE__ */ p.jsx(
          Qu,
          {
            card: zt,
            dealOrder: t.dealOrder,
            isFolded: S,
            isHidden: !t.isYou,
            cards: d
          },
          _n
        )) }),
        /* @__PURE__ */ p.jsx(ae, { children: Y && /* @__PURE__ */ p.jsx(Zu, { action: Y, delay: 0 }) }),
        /* @__PURE__ */ p.jsx(ae, { children: E > 0 && /* @__PURE__ */ p.jsx(
          th,
          {
            amount: E,
            layoutPosition: t.layoutPosition
          },
          `chip-${e}`
        ) })
      ]
    }
  );
}
function nh({ amount: t }) {
  return /* @__PURE__ */ p.jsxs(
    N.div,
    {
      className: "pot",
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { delay: 0.5 },
      children: [
        /* @__PURE__ */ p.jsx("div", { className: "pot-label", children: "POT" }),
        /* @__PURE__ */ p.jsxs(
          N.div,
          {
            className: "pot-amount",
            initial: { scale: 1.2 },
            animate: { scale: 1 },
            children: [
              "$",
              t
            ]
          },
          t
        )
      ]
    }
  );
}
function sh({ currentPhase: t }) {
  const e = ["Pre-flop", "Flop", "Turn", "River"], s = { preflop: 0, flop: 1, turn: 2, river: 3 }[t] ?? 0;
  return /* @__PURE__ */ p.jsx("div", { className: "game-phase", children: e.map((i, o) => /* @__PURE__ */ p.jsx(
    "div",
    {
      className: `phase ${o === s ? "active" : ""} ${o < s ? "completed" : ""}`,
      children: i
    },
    i
  )) });
}
function ih({ step: t, totalSteps: e }) {
  return /* @__PURE__ */ p.jsx("div", { className: "step-indicator", children: [...Array(e)].map((n, s) => /* @__PURE__ */ p.jsx(
    "div",
    {
      className: `step-dot ${s === t ? "active" : ""} ${s < t ? "completed" : ""}`
    },
    s
  )) });
}
function rh({ gameState: t }) {
  const e = Hu, n = Gu, s = Kn(), i = t.getState(), {
    step: o,
    totalSteps: r,
    phase: a,
    pot: l,
    communityCards: u,
    yourCards: c
  } = i, h = [], d = {}, f = {};
  let m = 0;
  for (let y = 0; y <= o; y++) {
    const v = t.scenario.steps[y];
    (v?.type === "flop" || v?.type === "turn" || v?.type === "river") && (m = y);
  }
  for (let y = 0; y <= o; y++) {
    const v = t.scenario.steps[y];
    v?.type === "action" && v.action === "FOLD" && h.push(v.player), v?.type === "blinds" && (f.SB = "SB", f.BB = "BB"), y >= m && v?.type === "action" && v.action !== "FOLD" && (d[v.player] = v.action);
  }
  const x = Object.entries(d).filter(([y, v]) => v === "CALL").map(([y]) => y), S = Object.entries(d).filter(([y, v]) => v === "CHECK").map(([y]) => y), g = Object.entries(d).filter(([y, v]) => v === "RAISE").map(([y]) => y), b = {}, T = {};
  oi.forEach((y) => {
    b[y.position] = y.chips;
  });
  for (let y = 0; y <= o; y++) {
    const v = t.scenario.steps[y];
    v?.type === "blinds" && v.bets && Object.entries(v.bets).forEach(([C, A]) => {
      b[C] -= A, y === o && (T[C] = { amount: A, stepIndex: y });
    }), v?.type === "action" && v.bet > 0 && (b[v.player] -= v.bet, y === o && (T[v.player] = { amount: v.bet, stepIndex: y }));
  }
  const w = {
    "--scale": n,
    "--table-width": `${e}px`,
    "--table-height": `${e * 0.625}px`
  };
  return /* @__PURE__ */ p.jsxs("div", { className: "container embed-mode", style: w, children: [
    /* @__PURE__ */ p.jsx(sh, { currentPhase: a }),
    /* @__PURE__ */ p.jsxs("div", { className: "poker-table", children: [
      /* @__PURE__ */ p.jsx("div", { className: "table-rail" }),
      /* @__PURE__ */ p.jsx("div", { className: "table-felt" }),
      o >= 1 && oi.map((y) => /* @__PURE__ */ p.jsx(
        eh,
        {
          player: y,
          step: o,
          cardsDealt: o >= 2,
          yourCards: c,
          foldedPlayers: h,
          calledPlayers: x,
          checkedPlayers: S,
          raisedPlayers: g,
          blindPlayers: f,
          phase: a,
          playerChips: b,
          latestBet: T,
          cards: s
        },
        y.id
      )),
      o >= 1 && /* @__PURE__ */ p.jsx(
        N.div,
        {
          className: "dealer-button",
          style: { top: "34%", right: "15%" },
          initial: { opacity: 0, scale: 0 },
          animate: { opacity: 1, scale: 1 },
          transition: { delay: 0.6 },
          children: /* @__PURE__ */ p.jsx("img", { src: Ju(), alt: "Dealer", className: "dealer-button-img" })
        }
      ),
      o >= 2 && /* @__PURE__ */ p.jsx(nh, { amount: l }),
      /* @__PURE__ */ p.jsx("div", { className: "community-cards", children: u.map((y, v) => /* @__PURE__ */ p.jsx(qu, { card: y, dealOrder: v, cards: s }, v)) }),
      /* @__PURE__ */ p.jsx(ih, { step: o, totalSteps: r })
    ] })
  ] });
}
const oh = 1.27, ah = ["S", "H", "D", "C"], lh = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K"], ch = ah.flatMap(
  (t, e) => lh.map((n, s) => ({
    rank: n,
    suit: t,
    suitIndex: e,
    rankIndex: s,
    id: `${n}${t}`
  }))
);
function uh(t, e, n, s = 1) {
  const r = 55 * s, a = 78 * s, l = -(13 * r) / 2 + r / 2, u = -(4 * a) / 2 + a / 2;
  if (t === 0) {
    const c = e * 13 + n;
    return {
      x: (c * 1.8 - 50) * s,
      y: (c * 1 - 25) * s,
      opacity: 1,
      filter: "none"
    };
  }
  if (t === 1)
    return {
      x: (n * 4 - 25) * s,
      y: u + e * a,
      opacity: 1,
      filter: "none"
    };
  if (t >= 2 && t <= 5) {
    const c = t - 2, h = (n * 4 - 25) * s, d = e === c;
    return {
      x: h,
      y: u + e * a,
      opacity: 1,
      filter: d ? "none" : "grayscale(100%) brightness(0.6)"
    };
  }
  if (t === 6)
    return {
      x: l + n * r,
      y: u + e * a,
      opacity: 1,
      filter: "none"
    };
  if (t === 7)
    return {
      x: l + n * r,
      y: u + e * a,
      opacity: 1,
      filter: "none",
      // waveOrder는 rankIndex 그대로 (A=0, 2=1, ..., K=12)
      waveOrder: n
    };
  if (t === 8) {
    const c = n === 0;
    return {
      x: l + n * r,
      y: u + e * a,
      opacity: 1,
      filter: c ? "none" : "grayscale(100%) brightness(0.6)"
    };
  }
  return { x: 0, y: 0, opacity: 1, filter: "none" };
}
function hh(t, e, n) {
  return t === 6 ? n * 0.05 : 0;
}
function dh({ rank: t, suit: e, suitIndex: n, rankIndex: s, step: i, scale: o, cards: r }) {
  const a = uh(i, n, s, o), l = hh(i, n, s), u = `${t}${e}`, c = 50, h = 70, d = c * o, f = h * o, m = i === 7, x = a.waveOrder || 0, S = 0.15, g = 0.25, b = x * S;
  return /* @__PURE__ */ p.jsx(
    N.div,
    {
      style: {
        position: "absolute",
        left: "50%",
        top: "50%",
        width: d,
        height: f,
        marginLeft: -d / 2,
        marginTop: -f / 2,
        borderRadius: 3 * o,
        overflow: "hidden",
        boxShadow: `${1 * o}px ${1 * o}px ${4 * o}px rgba(0,0,0,0.3)`,
        backgroundColor: "white"
      },
      animate: {
        x: a.x,
        y: a.y,
        opacity: a.opacity,
        filter: m ? [
          "grayscale(100%) brightness(0.5)",
          // 시작: 어둡게
          "grayscale(0%) brightness(1.3)",
          // 켜짐
          "grayscale(100%) brightness(0.5)"
          // 다시 어둡게
        ] : a.filter,
        scale: m ? [1, 1.1, 1] : 1
      },
      transition: m ? {
        delay: b,
        duration: g,
        times: [0, 0.4, 1],
        ease: "easeOut"
      } : {
        delay: l,
        duration: 0.4,
        type: "spring",
        stiffness: 100,
        damping: 15
      },
      children: /* @__PURE__ */ p.jsx(
        "div",
        {
          dangerouslySetInnerHTML: {
            __html: r?.[u]?.replace(/width="2\.5in"/, 'width="100%"').replace(/height="3\.5in"/, 'height="100%"') || ""
          },
          style: { width: "100%", height: "100%" }
        }
      )
    }
  );
}
function fh({ step: t = 0 }) {
  const e = oh, n = Kn(), s = 715 * e, i = 312 * e;
  return n ? /* @__PURE__ */ p.jsx(
    "div",
    {
      style: {
        position: "relative",
        width: s,
        height: i
      },
      children: ch.map((o) => /* @__PURE__ */ p.jsx(
        dh,
        {
          rank: o.rank,
          suit: o.suit,
          suitIndex: o.suitIndex,
          rankIndex: o.rankIndex,
          step: t,
          scale: e,
          cards: n
        },
        o.id
      ))
    }
  ) : /* @__PURE__ */ p.jsx("div", { style: { width: s, height: i, display: "flex", alignItems: "center", justifyContent: "center", color: "#888" }, children: "Loading cards..." });
}
const ph = 1.3;
function mh(t) {
  const e = t[0].toUpperCase(), n = t[1].toUpperCase();
  return `${e}${n}`;
}
const ct = [
  {
    name: "Royal Flush",
    nameKr: "로열 플러시",
    description: "같은 무늬 A-K-Q-J-10",
    count: 4,
    probability: "0.00015%",
    examples: [
      { cards: ["As", "Ks", "Qs", "Js", "Ts"], note: "스페이드 로열" },
      { cards: ["Ah", "Kh", "Qh", "Jh", "Th"], note: "하트 로열" },
      { cards: ["Ad", "Kd", "Qd", "Jd", "Td"], note: "무늬 달라도 동점!" }
    ]
  },
  {
    name: "Straight Flush",
    nameKr: "스트레이트 플러시",
    description: "같은 무늬 연속 5장",
    count: 36,
    probability: "0.0014%",
    examples: [
      { cards: ["Kh", "Qh", "Jh", "Th", "9h"], note: "킹하이 (로열 다음)" },
      { cards: ["6d", "5d", "4d", "3d", "2d"], note: "식스하이" },
      { cards: ["5c", "4c", "3c", "2c", "Ac"], note: "휠 (A=1, 최약)" }
    ]
  },
  {
    name: "Four of a Kind",
    nameKr: "포카드",
    description: "같은 숫자 4장 + 1장",
    count: 624,
    probability: "0.024%",
    examples: [
      { cards: ["As", "Ah", "Ad", "Ac", "Ks"], note: "에이스 포카드 (최강)" },
      { cards: ["Ks", "Kh", "Kd", "Kc", "As"], note: "킹 포카드" },
      { cards: ["2s", "2h", "2d", "2c", "As"], note: "투 포카드 (최약)" }
    ]
  },
  {
    name: "Full House",
    nameKr: "풀하우스",
    description: "트리플 + 페어",
    count: 3744,
    probability: "0.14%",
    examples: [
      { cards: ["As", "Ah", "Ad", "Ks", "Kh"], note: "AAA KK (트리플이 기준!)" },
      { cards: ["As", "Ah", "Ad", "2s", "2h"], note: "AAA 22 (↑와 동급)" },
      { cards: ["Ks", "Kh", "Kd", "As", "Ah"], note: "KKK AA (↑보다 약함!)" }
    ]
  },
  {
    name: "Flush",
    nameKr: "플러시",
    description: "같은 무늬 5장",
    count: 5108,
    probability: "0.20%",
    examples: [
      { cards: ["As", "Ks", "Qs", "Js", "9s"], note: "에이스 하이 플러시" },
      { cards: ["As", "Ks", "Qs", "Js", "8s"], note: "↑와 5번째 카드로 비교" },
      { cards: ["Kh", "Qh", "Jh", "Th", "8h"], note: "킹 하이 (A없으면 약함)" }
    ]
  },
  {
    name: "Straight",
    nameKr: "스트레이트",
    description: "연속 숫자 5장",
    count: 10200,
    probability: "0.39%",
    examples: [
      { cards: ["As", "Kh", "Qd", "Jc", "Ts"], note: "브로드웨이 (최강)" },
      { cards: ["Kh", "Qd", "Jc", "Ts", "9s"], note: "킹하이 스트레이트" },
      { cards: ["5s", "4h", "3d", "2c", "As"], note: "휠 (A=1로 사용, 최약)" }
    ]
  },
  {
    name: "Three of a Kind",
    nameKr: "트리플",
    description: "같은 숫자 3장",
    count: 54912,
    probability: "2.1%",
    examples: [
      { cards: ["As", "Ah", "Ad", "Ks", "Qh"], note: "트리플 에이스" },
      { cards: ["Ks", "Kh", "Kd", "As", "Qh"], note: "트리플 킹" },
      { cards: ["2s", "2h", "2d", "As", "Kh"], note: "트리플 투 (키커 비교)" }
    ]
  },
  {
    name: "Two Pair",
    nameKr: "투페어",
    description: "페어 2개",
    count: 123552,
    probability: "4.8%",
    examples: [
      { cards: ["As", "Ah", "Ks", "Kh", "Qd"], note: "AA KK (탑페어 기준)" },
      { cards: ["As", "Ah", "Qs", "Qh", "Kd"], note: "AA QQ (↑보다 약함)" },
      { cards: ["Ks", "Kh", "Qs", "Qh", "Ad"], note: "KK QQ (A페어 없어서 약함)" }
    ]
  },
  {
    name: "One Pair",
    nameKr: "원페어",
    description: "같은 숫자 2장",
    count: 1098240,
    probability: "42%",
    examples: [
      { cards: ["As", "Ah", "Ks", "Qh", "Jd"], note: "AA + K Q J 키커" },
      { cards: ["As", "Ah", "Ks", "Qh", "Td"], note: "AA + K Q T (↑보다 약함)" },
      { cards: ["Ks", "Kh", "As", "Qh", "Jd"], note: "KK (A페어보다 약함)" }
    ]
  },
  {
    name: "High Card",
    nameKr: "하이카드",
    description: "족보 없음",
    count: 1302540,
    probability: "50%",
    examples: [
      { cards: ["As", "Kh", "Qd", "Jc", "9s"], note: "A K Q J 9 하이" },
      { cards: ["As", "Kh", "Qd", "Jc", "8s"], note: "A K Q J 8 (↑보다 약함)" },
      { cards: ["Ks", "Qh", "Jd", "Tc", "8s"], note: "K하이 (A없으면 약함)" }
    ]
  }
], yh = ct.reduce((t, e) => t + e.examples.length, 0);
function gh(t) {
  let e = t;
  for (let s = 0; s < ct.length; s++) {
    const i = ct[s].examples.length;
    if (e < i)
      return { handIndex: s, exampleIndex: e };
    e -= i;
  }
  const n = ct.length - 1;
  return { handIndex: n, exampleIndex: ct[n].examples.length - 1 };
}
function vh({ cardStr: t, index: e, scale: n, shouldAnimate: s = !0, cards: i }) {
  const o = mh(t), r = 50 * n, a = 70 * n;
  return /* @__PURE__ */ p.jsx(
    N.div,
    {
      initial: s ? { opacity: 0, y: -20, rotateY: 180 } : !1,
      animate: { opacity: 1, y: 0, rotateY: 0 },
      transition: s ? {
        delay: e * 0.1,
        duration: 0.3,
        type: "spring",
        stiffness: 200,
        damping: 20
      } : { duration: 0 },
      style: {
        width: r,
        height: a,
        borderRadius: 4 * n,
        overflow: "hidden",
        boxShadow: "1px 1px 4px rgba(0,0,0,0.3)",
        flexShrink: 0
      },
      children: /* @__PURE__ */ p.jsx(
        "div",
        {
          dangerouslySetInnerHTML: {
            __html: i?.[o]?.replace(/width="2\.5in"/, 'width="100%"').replace(/height="3\.5in"/, 'height="100%"') || ""
          },
          style: { width: "100%", height: "100%" }
        }
      )
    }
  );
}
function xh({ hand: t, isActive: e, isPassed: n, scale: s }) {
  const i = (o) => o.toLocaleString();
  return /* @__PURE__ */ p.jsxs(
    N.div,
    {
      animate: {
        backgroundColor: e ? "#f1c40f" : n ? "#27ae60" : "#2c3e50",
        color: e ? "#000" : "#fff",
        scale: e ? 1.02 : 1
      },
      transition: { duration: 0.2 },
      style: {
        padding: `${3 * s}px ${8 * s}px`,
        borderRadius: 4 * s,
        marginBottom: 2 * s,
        display: "flex",
        alignItems: "center",
        gap: 4 * s
      },
      children: [
        /* @__PURE__ */ p.jsx("span", { style: {
          fontSize: 11 * s,
          fontWeight: "bold",
          minWidth: 100 * s
        }, children: t.name }),
        /* @__PURE__ */ p.jsx("span", { style: {
          fontSize: 9 * s,
          opacity: 0.7,
          minWidth: 80 * s
        }, children: t.description }),
        /* @__PURE__ */ p.jsx("span", { style: {
          fontSize: 9 * s,
          opacity: 0.6,
          minWidth: 55 * s,
          textAlign: "right",
          fontFamily: "monospace"
        }, children: i(t.count) }),
        /* @__PURE__ */ p.jsx("span", { style: {
          fontSize: 9 * s,
          opacity: 0.6,
          minWidth: 45 * s,
          textAlign: "right"
        }, children: t.probability })
      ]
    }
  );
}
function Th({ example: t, exampleIdx: e, handName: n, scale: s, isNew: i, cards: o }) {
  return /* @__PURE__ */ p.jsx(
    N.div,
    {
      initial: i ? { opacity: 0, y: 10 } : !1,
      animate: { opacity: 1, y: 0 },
      transition: i ? { duration: 0.3 } : { duration: 0 },
      style: {
        display: "flex",
        gap: 4 * s
      },
      children: t.cards.map((r, a) => /* @__PURE__ */ p.jsx(
        vh,
        {
          cardStr: r,
          index: a,
          scale: s * 0.85,
          shouldAnimate: i,
          cards: o
        },
        `${n}-${e}-${r}`
      ))
    }
  );
}
function bh({ hand: t, exampleIndex: e, scale: n, cards: s }) {
  if (e < 0) return null;
  const i = t.examples.slice(0, e + 1);
  return /* @__PURE__ */ p.jsx("div", { style: {
    display: "flex",
    flexDirection: "column",
    gap: 18 * n,
    // 왼쪽 테이블 행간과 맞춤
    alignItems: "flex-start"
  }, children: i.map((o, r) => /* @__PURE__ */ p.jsx(
    Th,
    {
      example: o,
      exampleIdx: r,
      handName: t.name,
      scale: n,
      isNew: r === e,
      cards: s
    },
    `${t.name}-row-${r}`
  )) });
}
function Sh({ step: t = 0 }) {
  const e = ph, n = Kn(), { handIndex: s, exampleIndex: i } = gh(t), o = ct[s];
  return n ? /* @__PURE__ */ p.jsxs(
    "div",
    {
      style: {
        display: "flex",
        gap: 40 * e,
        padding: 20 * e,
        alignItems: "flex-start",
        justifyContent: "center",
        width: "100%",
        height: "100%"
      },
      children: [
        /* @__PURE__ */ p.jsxs("div", { style: {
          display: "flex",
          flexDirection: "column",
          minWidth: 280 * e
        }, children: [
          /* @__PURE__ */ p.jsx("div", { style: {
            fontSize: 18 * e,
            fontWeight: "bold",
            color: "#f1c40f",
            marginBottom: 12 * e,
            textAlign: "center"
          }, children: "POKER HAND RANKINGS" }),
          /* @__PURE__ */ p.jsx("div", { style: {
            fontSize: 10 * e,
            color: "#7f8c8d",
            marginBottom: 8 * e,
            textAlign: "center"
          }, children: "↑ 강          약 ↓" }),
          ct.map((r, a) => /* @__PURE__ */ p.jsx(
            xh,
            {
              hand: r,
              isActive: a === s,
              isPassed: a < s,
              scale: e
            },
            r.name
          ))
        ] }),
        /* @__PURE__ */ p.jsxs("div", { style: {
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          minWidth: 350 * e
        }, children: [
          /* @__PURE__ */ p.jsx(ae, { mode: "wait", children: /* @__PURE__ */ p.jsx(
            N.div,
            {
              initial: { opacity: 0, y: -10 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0 },
              style: {
                fontSize: 18 * e,
                fontWeight: "bold",
                color: "#f1c40f",
                marginBottom: 12 * e
              },
              children: o.name
            },
            `title-${o.name}`
          ) }),
          /* @__PURE__ */ p.jsx("div", { style: {
            fontSize: 10 * e,
            color: "#7f8c8d",
            marginBottom: 8 * e
          }, children: " " }),
          /* @__PURE__ */ p.jsx(ae, { mode: "wait", children: t >= 0 && /* @__PURE__ */ p.jsx(
            N.div,
            {
              initial: { opacity: 0, x: 20 },
              animate: { opacity: 1, x: 0 },
              exit: { opacity: 0, x: -20 },
              transition: { duration: 0.3 },
              children: /* @__PURE__ */ p.jsx(
                bh,
                {
                  hand: o,
                  exampleIndex: i,
                  scale: e,
                  cards: n
                }
              )
            },
            `cards-${s}`
          ) })
        ] })
      ]
    }
  ) : /* @__PURE__ */ p.jsx("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", color: "#888" }, children: "Loading cards..." });
}
const Ah = yh;
class ue {
  constructor(e, n = {}) {
    this.container = e, this.step = 0, this.totalSteps = 9, this.root = rn(e), this.listeners = [], this._render();
  }
  _render() {
    this.root.render(/* @__PURE__ */ p.jsx(fh, { step: this.step }));
  }
  _notify() {
    this.listeners.forEach((e) => e(this.getState()));
  }
  subscribe(e) {
    return this.listeners.push(e), () => {
      this.listeners = this.listeners.filter((n) => n !== e);
    };
  }
  nextStep() {
    return this.step < this.totalSteps - 1 ? (this.step++, this._render(), this._notify(), !0) : !1;
  }
  prevStep() {
    return this.step > 0 ? (this.step--, this._render(), this._notify(), !0) : !1;
  }
  goToStep(e) {
    e >= 0 && e < this.totalSteps && (this.step = e, this._render(), this._notify());
  }
  reset() {
    this.step = 0, this._render(), this._notify();
  }
  getState() {
    return {
      step: this.step,
      totalSteps: this.totalSteps
    };
  }
  destroy() {
    this.root.unmount();
  }
  static mount(e, n = {}) {
    return new ue(e, n);
  }
}
class he {
  constructor(e, n = {}) {
    this.container = e, this.step = 0, this.totalSteps = Ah, this.root = rn(e), this.listeners = [], this._render();
  }
  _render() {
    this.root.render(/* @__PURE__ */ p.jsx(Sh, { step: this.step }));
  }
  _notify() {
    this.listeners.forEach((e) => e(this.getState()));
  }
  subscribe(e) {
    return this.listeners.push(e), () => {
      this.listeners = this.listeners.filter((n) => n !== e);
    };
  }
  nextStep() {
    return this.step < this.totalSteps - 1 ? (this.step++, this._render(), this._notify(), !0) : !1;
  }
  prevStep() {
    return this.step > 0 ? (this.step--, this._render(), this._notify(), !0) : !1;
  }
  goToStep(e) {
    e >= 0 && e < this.totalSteps && (this.step = e, this._render(), this._notify());
  }
  reset() {
    this.step = 0, this._render(), this._notify();
  }
  getState() {
    return {
      step: this.step,
      totalSteps: this.totalSteps
    };
  }
  destroy() {
    this.root.unmount();
  }
  static mount(e, n = {}) {
    return new he(e, n);
  }
}
class de {
  constructor(e, n = {}) {
    this.container = e, this.gameState = new Gn(n.scenario || "tutorial"), this.root = rn(e), this.unsubscribe = this.gameState.subscribe(() => {
      this._render();
    }), this._render();
  }
  _render() {
    this.root.render(/* @__PURE__ */ p.jsx(rh, { gameState: this.gameState }));
  }
  // Public API
  nextStep() {
    return this.gameState.nextStep();
  }
  prevStep() {
    return this.gameState.prevStep();
  }
  goToStep(e) {
    return this.gameState.goToStep(e);
  }
  reset() {
    this.gameState.reset();
  }
  setScenario(e) {
    this.gameState.setScenario(e);
  }
  getState() {
    return this.gameState.getState();
  }
  destroy() {
    this.unsubscribe(), this.root.unmount();
  }
  // Static methods
  static getScenarios() {
    return Gn.getScenarios();
  }
  // Static mount for convenience
  static mount(e, n = {}) {
    return new de(e, n);
  }
}
const Vh = {
  HoldemEngine: de,
  DeckEngine: ue,
  HandRankingEngine: he,
  // Convenience shortcuts
  mount: de.mount,
  mountDeck: ue.mount,
  mountHandRanking: he.mount
};
export {
  Vh as default
};
