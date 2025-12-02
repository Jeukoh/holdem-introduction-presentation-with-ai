import * as he from "react";
import Wr, { createContext as At, useRef as tt, useLayoutEffect as Hr, useEffect as tn, useId as en, useContext as O, useInsertionEffect as ii, useMemo as dt, useCallback as ri, Children as Gr, isValidElement as zr, useState as je, Fragment as oi, createElement as Yr, forwardRef as Xr, Component as Jr } from "react";
import { createRoot as nn } from "react-dom/client";
var ye = { exports: {} }, Vt = {};
var Fn;
function Qr() {
  if (Fn) return Vt;
  Fn = 1;
  var t = Wr, e = Symbol.for("react.element"), n = Symbol.for("react.fragment"), s = Object.prototype.hasOwnProperty, i = t.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, o = { key: !0, ref: !0, __self: !0, __source: !0 };
  function r(a, l, u) {
    var c, h = {}, d = null, f = null;
    u !== void 0 && (d = "" + u), l.key !== void 0 && (d = "" + l.key), l.ref !== void 0 && (f = l.ref);
    for (c in l) s.call(l, c) && !o.hasOwnProperty(c) && (h[c] = l[c]);
    if (a && a.defaultProps) for (c in l = a.defaultProps, l) h[c] === void 0 && (h[c] = l[c]);
    return { $$typeof: e, type: a, key: d, ref: f, props: h, _owner: i.current };
  }
  return Vt.Fragment = n, Vt.jsx = r, Vt.jsxs = r, Vt;
}
var Nn;
function qr() {
  return Nn || (Nn = 1, ye.exports = Qr()), ye.exports;
}
var p = qr();
const Kn = {
  c: { symbol: "♣", color: "black" },
  d: { symbol: "♦", color: "red" },
  h: { symbol: "♥", color: "red" },
  s: { symbol: "♠", color: "black" },
  "?": { symbol: "?", color: "gray" }
}, Zr = {
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
function to(t) {
  if (!t || t.length < 2) return null;
  const e = Zr[t[0]] || t[0], n = Kn[t[1]] || Kn["?"];
  return {
    rank: e,
    suit: n.symbol,
    color: n.color
  };
}
function $n(t) {
  const e = [];
  for (let n = 0; n < t.length; n += 2) {
    const s = to(t.slice(n, n + 2));
    s && e.push(s);
  }
  return e;
}
const eo = {
  f: "FOLD",
  cc: "CALL",
  cbr: "RAISE",
  sm: "SHOW"
};
function no(t) {
  const e = t.trim().split(/\s+/);
  if (e[0] === "d") {
    if (e[1] === "dh") {
      const n = e[2], s = $n(e[3]);
      return { type: "deal", player: n, cards: s };
    } else if (e[1] === "db")
      return { type: "board", cards: $n(e[2]) };
  } else if (e[0].startsWith("p")) {
    const n = parseInt(e[0].slice(1)), s = eo[e[1]] || e[1].toUpperCase(), i = e[2] ? parseInt(e[2]) : null;
    return { type: "action", player: n, action: s, amount: i };
  }
  return null;
}
const so = ["BTN", "SB", "BB", "UTG", "HJ", "CO"];
function io(t) {
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
        const c = u.replace(/^"|",?$/g, ""), h = no(c);
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
      const u = so[(l.player - 1) % 6] || `P${l.player}`;
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
const ro = `
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
`, oo = io(ro), pt = {
  phh: oo,
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
class _n {
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
const sn = At({});
function rn(t) {
  const e = tt(null);
  return e.current === null && (e.current = t()), e.current;
}
const on = typeof window < "u", ai = on ? Hr : tn, de = /* @__PURE__ */ At(null);
function an(t, e) {
  t.indexOf(e) === -1 && t.push(e);
}
function ln(t, e) {
  const n = t.indexOf(e);
  n > -1 && t.splice(n, 1);
}
const Q = (t, e, n) => n > e ? e : n < t ? t : n;
let cn = () => {
};
const q = {}, li = (t) => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(t);
function ci(t) {
  return typeof t == "object" && t !== null;
}
const ui = (t) => /^0[^.\s]+$/u.test(t);
// @__NO_SIDE_EFFECTS__
function un(t) {
  let e;
  return () => (e === void 0 && (e = t()), e);
}
const H = /* @__NO_SIDE_EFFECTS__ */ (t) => t, ao = (t, e) => (n) => e(t(n)), $t = (...t) => t.reduce(ao), Bt = /* @__NO_SIDE_EFFECTS__ */ (t, e, n) => {
  const s = e - t;
  return s === 0 ? 1 : (n - t) / s;
};
class hn {
  constructor() {
    this.subscriptions = [];
  }
  add(e) {
    return an(this.subscriptions, e), () => ln(this.subscriptions, e);
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
const Y = /* @__NO_SIDE_EFFECTS__ */ (t) => t * 1e3, W = /* @__NO_SIDE_EFFECTS__ */ (t) => t / 1e3;
function hi(t, e) {
  return e ? t * (1e3 / e) : 0;
}
const di = (t, e, n) => (((1 - 3 * n + 3 * e) * t + (3 * n - 6 * e)) * t + 3 * e) * t, lo = 1e-7, co = 12;
function uo(t, e, n, s, i) {
  let o, r, a = 0;
  do
    r = e + (n - e) / 2, o = di(r, s, i) - t, o > 0 ? n = r : e = r;
  while (Math.abs(o) > lo && ++a < co);
  return r;
}
function _t(t, e, n, s) {
  if (t === e && n === s)
    return H;
  const i = (o) => uo(o, 0, 1, t, n);
  return (o) => o === 0 || o === 1 ? o : di(i(o), e, s);
}
const fi = (t) => (e) => e <= 0.5 ? t(2 * e) / 2 : (2 - t(2 * (1 - e))) / 2, pi = (t) => (e) => 1 - t(1 - e), mi = /* @__PURE__ */ _t(0.33, 1.53, 0.69, 0.99), dn = /* @__PURE__ */ pi(mi), yi = /* @__PURE__ */ fi(dn), gi = (t) => (t *= 2) < 1 ? 0.5 * dn(t) : 0.5 * (2 - Math.pow(2, -10 * (t - 1))), fn = (t) => 1 - Math.sin(Math.acos(t)), xi = pi(fn), vi = fi(fn), ho = /* @__PURE__ */ _t(0.42, 0, 1, 1), fo = /* @__PURE__ */ _t(0, 0, 0.58, 1), Ti = /* @__PURE__ */ _t(0.42, 0, 0.58, 1), po = (t) => Array.isArray(t) && typeof t[0] != "number", bi = (t) => Array.isArray(t) && typeof t[0] == "number", mo = {
  linear: H,
  easeIn: ho,
  easeInOut: Ti,
  easeOut: fo,
  circIn: fn,
  circInOut: vi,
  circOut: xi,
  backIn: dn,
  backInOut: yi,
  backOut: mi,
  anticipate: gi
}, yo = (t) => typeof t == "string", Un = (t) => {
  if (bi(t)) {
    cn(t.length === 4);
    const [e, n, s, i] = t;
    return _t(e, n, s, i);
  } else if (yo(t))
    return mo[t];
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
function go(t, e) {
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
const xo = 40;
function Si(t, e) {
  let n = !1, s = !0;
  const i = {
    delta: 0,
    timestamp: 0,
    isProcessing: !1
  }, o = () => n = !0, r = Yt.reduce((T, g) => (T[g] = go(o), T), {}), { setup: a, read: l, resolveKeyframes: u, preUpdate: c, update: h, preRender: d, render: f, postRender: m } = r, v = () => {
    const T = q.useManualTiming ? i.timestamp : performance.now();
    n = !1, q.useManualTiming || (i.delta = s ? 1e3 / 60 : Math.max(Math.min(T - i.timestamp, xo), 1)), i.timestamp = T, i.isProcessing = !0, a.process(i), l.process(i), u.process(i), c.process(i), h.process(i), d.process(i), f.process(i), m.process(i), i.isProcessing = !1, n && e && (s = !1, t(v));
  }, b = () => {
    n = !0, s = !0, i.isProcessing || t(v);
  };
  return { schedule: Yt.reduce((T, g) => {
    const y = r[g];
    return T[g] = (w, C = !1, P = !1) => (n || b(), y.schedule(w, C, P)), T;
  }, {}), cancel: (T) => {
    for (let g = 0; g < Yt.length; g++)
      r[Yt[g]].cancel(T);
  }, state: i, steps: r };
}
const { schedule: V, cancel: et, state: B, steps: ge } = /* @__PURE__ */ Si(typeof requestAnimationFrame < "u" ? requestAnimationFrame : H, !0);
let qt;
function vo() {
  qt = void 0;
}
const K = {
  now: () => (qt === void 0 && K.set(B.isProcessing || q.useManualTiming ? B.timestamp : performance.now()), qt),
  set: (t) => {
    qt = t, queueMicrotask(vo);
  }
}, Ai = (t) => (e) => typeof e == "string" && e.startsWith(t), pn = /* @__PURE__ */ Ai("--"), To = /* @__PURE__ */ Ai("var(--"), mn = (t) => To(t) ? bo.test(t.split("/*")[0].trim()) : !1, bo = /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu, Pt = {
  test: (t) => typeof t == "number",
  parse: parseFloat,
  transform: (t) => t
}, Ot = {
  ...Pt,
  transform: (t) => Q(0, 1, t)
}, Xt = {
  ...Pt,
  default: 1
}, Rt = (t) => Math.round(t * 1e5) / 1e5, yn = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu;
function So(t) {
  return t == null;
}
const Ao = /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu, gn = (t, e) => (n) => !!(typeof n == "string" && Ao.test(n) && n.startsWith(t) || e && !So(n) && Object.prototype.hasOwnProperty.call(n, e)), Pi = (t, e, n) => (s) => {
  if (typeof s != "string")
    return s;
  const [i, o, r, a] = s.match(yn);
  return {
    [t]: parseFloat(i),
    [e]: parseFloat(o),
    [n]: parseFloat(r),
    alpha: a !== void 0 ? parseFloat(a) : 1
  };
}, Po = (t) => Q(0, 255, t), xe = {
  ...Pt,
  transform: (t) => Math.round(Po(t))
}, at = {
  test: /* @__PURE__ */ gn("rgb", "red"),
  parse: /* @__PURE__ */ Pi("red", "green", "blue"),
  transform: ({ red: t, green: e, blue: n, alpha: s = 1 }) => "rgba(" + xe.transform(t) + ", " + xe.transform(e) + ", " + xe.transform(n) + ", " + Rt(Ot.transform(s)) + ")"
};
function wo(t) {
  let e = "", n = "", s = "", i = "";
  return t.length > 5 ? (e = t.substring(1, 3), n = t.substring(3, 5), s = t.substring(5, 7), i = t.substring(7, 9)) : (e = t.substring(1, 2), n = t.substring(2, 3), s = t.substring(3, 4), i = t.substring(4, 5), e += e, n += n, s += s, i += i), {
    red: parseInt(e, 16),
    green: parseInt(n, 16),
    blue: parseInt(s, 16),
    alpha: i ? parseInt(i, 16) / 255 : 1
  };
}
const Le = {
  test: /* @__PURE__ */ gn("#"),
  parse: wo,
  transform: at.transform
}, Ut = /* @__NO_SIDE_EFFECTS__ */ (t) => ({
  test: (e) => typeof e == "string" && e.endsWith(t) && e.split(" ").length === 1,
  parse: parseFloat,
  transform: (e) => `${e}${t}`
}), Z = /* @__PURE__ */ Ut("deg"), X = /* @__PURE__ */ Ut("%"), A = /* @__PURE__ */ Ut("px"), Co = /* @__PURE__ */ Ut("vh"), Vo = /* @__PURE__ */ Ut("vw"), Wn = {
  ...X,
  parse: (t) => X.parse(t) / 100,
  transform: (t) => X.transform(t * 100)
}, mt = {
  test: /* @__PURE__ */ gn("hsl", "hue"),
  parse: /* @__PURE__ */ Pi("hue", "saturation", "lightness"),
  transform: ({ hue: t, saturation: e, lightness: n, alpha: s = 1 }) => "hsla(" + Math.round(t) + ", " + X.transform(Rt(e)) + ", " + X.transform(Rt(n)) + ", " + Rt(Ot.transform(s)) + ")"
}, j = {
  test: (t) => at.test(t) || Le.test(t) || mt.test(t),
  parse: (t) => at.test(t) ? at.parse(t) : mt.test(t) ? mt.parse(t) : Le.parse(t),
  transform: (t) => typeof t == "string" ? t : t.hasOwnProperty("red") ? at.transform(t) : mt.transform(t),
  getAnimatableNone: (t) => {
    const e = j.parse(t);
    return e.alpha = 0, j.transform(e);
  }
}, Do = /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;
function Mo(t) {
  return isNaN(t) && typeof t == "string" && (t.match(yn)?.length || 0) + (t.match(Do)?.length || 0) > 0;
}
const wi = "number", Ci = "color", Ro = "var", Eo = "var(", Hn = "${}", jo = /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;
function It(t) {
  const e = t.toString(), n = [], s = {
    color: [],
    number: [],
    var: []
  }, i = [];
  let o = 0;
  const a = e.replace(jo, (l) => (j.test(l) ? (s.color.push(o), i.push(Ci), n.push(j.parse(l))) : l.startsWith(Eo) ? (s.var.push(o), i.push(Ro), n.push(l)) : (s.number.push(o), i.push(wi), n.push(parseFloat(l))), ++o, Hn)).split(Hn);
  return { values: n, split: a, indexes: s, types: i };
}
function Vi(t) {
  return It(t).values;
}
function Di(t) {
  const { split: e, types: n } = It(t), s = e.length;
  return (i) => {
    let o = "";
    for (let r = 0; r < s; r++)
      if (o += e[r], i[r] !== void 0) {
        const a = n[r];
        a === wi ? o += Rt(i[r]) : a === Ci ? o += j.transform(i[r]) : o += i[r];
      }
    return o;
  };
}
const Lo = (t) => typeof t == "number" ? 0 : j.test(t) ? j.getAnimatableNone(t) : t;
function ko(t) {
  const e = Vi(t);
  return Di(t)(e.map(Lo));
}
const nt = {
  test: Mo,
  parse: Vi,
  createTransformer: Di,
  getAnimatableNone: ko
};
function ve(t, e, n) {
  return n < 0 && (n += 1), n > 1 && (n -= 1), n < 1 / 6 ? t + (e - t) * 6 * n : n < 1 / 2 ? e : n < 2 / 3 ? t + (e - t) * (2 / 3 - n) * 6 : t;
}
function Bo({ hue: t, saturation: e, lightness: n, alpha: s }) {
  t /= 360, e /= 100, n /= 100;
  let i = 0, o = 0, r = 0;
  if (!e)
    i = o = r = n;
  else {
    const a = n < 0.5 ? n * (1 + e) : n + e - n * e, l = 2 * n - a;
    i = ve(l, a, t + 1 / 3), o = ve(l, a, t), r = ve(l, a, t - 1 / 3);
  }
  return {
    red: Math.round(i * 255),
    green: Math.round(o * 255),
    blue: Math.round(r * 255),
    alpha: s
  };
}
function ne(t, e) {
  return (n) => n > 0 ? e : t;
}
const D = (t, e, n) => t + (e - t) * n, Te = (t, e, n) => {
  const s = t * t, i = n * (e * e - s) + s;
  return i < 0 ? 0 : Math.sqrt(i);
}, Oo = [Le, at, mt], Io = (t) => Oo.find((e) => e.test(t));
function Gn(t) {
  const e = Io(t);
  if (!e)
    return !1;
  let n = e.parse(t);
  return e === mt && (n = Bo(n)), n;
}
const zn = (t, e) => {
  const n = Gn(t), s = Gn(e);
  if (!n || !s)
    return ne(t, e);
  const i = { ...n };
  return (o) => (i.red = Te(n.red, s.red, o), i.green = Te(n.green, s.green, o), i.blue = Te(n.blue, s.blue, o), i.alpha = D(n.alpha, s.alpha, o), at.transform(i));
}, ke = /* @__PURE__ */ new Set(["none", "hidden"]);
function Fo(t, e) {
  return ke.has(t) ? (n) => n <= 0 ? t : e : (n) => n >= 1 ? e : t;
}
function No(t, e) {
  return (n) => D(t, e, n);
}
function xn(t) {
  return typeof t == "number" ? No : typeof t == "string" ? mn(t) ? ne : j.test(t) ? zn : _o : Array.isArray(t) ? Mi : typeof t == "object" ? j.test(t) ? zn : Ko : ne;
}
function Mi(t, e) {
  const n = [...t], s = n.length, i = t.map((o, r) => xn(o)(o, e[r]));
  return (o) => {
    for (let r = 0; r < s; r++)
      n[r] = i[r](o);
    return n;
  };
}
function Ko(t, e) {
  const n = { ...t, ...e }, s = {};
  for (const i in n)
    t[i] !== void 0 && e[i] !== void 0 && (s[i] = xn(t[i])(t[i], e[i]));
  return (i) => {
    for (const o in s)
      n[o] = s[o](i);
    return n;
  };
}
function $o(t, e) {
  const n = [], s = { color: 0, var: 0, number: 0 };
  for (let i = 0; i < e.values.length; i++) {
    const o = e.types[i], r = t.indexes[o][s[o]], a = t.values[r] ?? 0;
    n[i] = a, s[o]++;
  }
  return n;
}
const _o = (t, e) => {
  const n = nt.createTransformer(e), s = It(t), i = It(e);
  return s.indexes.var.length === i.indexes.var.length && s.indexes.color.length === i.indexes.color.length && s.indexes.number.length >= i.indexes.number.length ? ke.has(t) && !i.values.length || ke.has(e) && !s.values.length ? Fo(t, e) : $t(Mi($o(s, i), i.values), n) : ne(t, e);
};
function Ri(t, e, n) {
  return typeof t == "number" && typeof e == "number" && typeof n == "number" ? D(t, e, n) : xn(t)(t, e);
}
const Uo = (t) => {
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
}, Ei = (t, e, n = 10) => {
  let s = "";
  const i = Math.max(Math.round(e / n), 2);
  for (let o = 0; o < i; o++)
    s += Math.round(t(o / (i - 1)) * 1e4) / 1e4 + ", ";
  return `linear(${s.substring(0, s.length - 2)})`;
}, se = 2e4;
function vn(t) {
  let e = 0;
  const n = 50;
  let s = t.next(e);
  for (; !s.done && e < se; )
    e += n, s = t.next(e);
  return e >= se ? 1 / 0 : e;
}
function Wo(t, e = 100, n) {
  const s = n({ ...t, keyframes: [0, e] }), i = Math.min(vn(s), se);
  return {
    type: "keyframes",
    ease: (o) => s.next(i * o).value / e,
    duration: /* @__PURE__ */ W(i)
  };
}
const Ho = 5;
function ji(t, e, n) {
  const s = Math.max(e - Ho, 0);
  return hi(n - t(s), e - s);
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
}, be = 1e-3;
function Go({ duration: t = M.duration, bounce: e = M.bounce, velocity: n = M.velocity, mass: s = M.mass }) {
  let i, o, r = 1 - e;
  r = Q(M.minDamping, M.maxDamping, r), t = Q(M.minDuration, M.maxDuration, /* @__PURE__ */ W(t)), r < 1 ? (i = (u) => {
    const c = u * r, h = c * t, d = c - n, f = Be(u, r), m = Math.exp(-h);
    return be - d / f * m;
  }, o = (u) => {
    const h = u * r * t, d = h * n + n, f = Math.pow(r, 2) * Math.pow(u, 2) * t, m = Math.exp(-h), v = Be(Math.pow(u, 2), r);
    return (-i(u) + be > 0 ? -1 : 1) * ((d - f) * m) / v;
  }) : (i = (u) => {
    const c = Math.exp(-u * t), h = (u - n) * t + 1;
    return -be + c * h;
  }, o = (u) => {
    const c = Math.exp(-u * t), h = (n - u) * (t * t);
    return c * h;
  });
  const a = 5 / t, l = Yo(i, o, a);
  if (t = /* @__PURE__ */ Y(t), isNaN(l))
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
const zo = 12;
function Yo(t, e, n) {
  let s = n;
  for (let i = 1; i < zo; i++)
    s = s - t(s) / e(s);
  return s;
}
function Be(t, e) {
  return t * Math.sqrt(1 - e * e);
}
const Xo = ["duration", "bounce"], Jo = ["stiffness", "damping", "mass"];
function Yn(t, e) {
  return e.some((n) => t[n] !== void 0);
}
function Qo(t) {
  let e = {
    velocity: M.velocity,
    stiffness: M.stiffness,
    damping: M.damping,
    mass: M.mass,
    isResolvedFromDuration: !1,
    ...t
  };
  if (!Yn(t, Jo) && Yn(t, Xo))
    if (t.visualDuration) {
      const n = t.visualDuration, s = 2 * Math.PI / (n * 1.2), i = s * s, o = 2 * Q(0.05, 1, 1 - (t.bounce || 0)) * Math.sqrt(i);
      e = {
        ...e,
        mass: M.mass,
        stiffness: i,
        damping: o
      };
    } else {
      const n = Go(t);
      e = {
        ...e,
        ...n,
        mass: M.mass
      }, e.isResolvedFromDuration = !0;
    }
  return e;
}
function ie(t = M.visualDuration, e = M.bounce) {
  const n = typeof t != "object" ? {
    visualDuration: t,
    keyframes: [0, 1],
    bounce: e
  } : t;
  let { restSpeed: s, restDelta: i } = n;
  const o = n.keyframes[0], r = n.keyframes[n.keyframes.length - 1], a = { done: !1, value: o }, { stiffness: l, damping: u, mass: c, duration: h, velocity: d, isResolvedFromDuration: f } = Qo({
    ...n,
    velocity: -/* @__PURE__ */ W(n.velocity || 0)
  }), m = d || 0, v = u / (2 * Math.sqrt(l * c)), b = r - o, x = /* @__PURE__ */ W(Math.sqrt(l / c)), S = Math.abs(b) < 5;
  s || (s = S ? M.restSpeed.granular : M.restSpeed.default), i || (i = S ? M.restDelta.granular : M.restDelta.default);
  let T;
  if (v < 1) {
    const y = Be(x, v);
    T = (w) => {
      const C = Math.exp(-v * x * w);
      return r - C * ((m + v * x * b) / y * Math.sin(y * w) + b * Math.cos(y * w));
    };
  } else if (v === 1)
    T = (y) => r - Math.exp(-x * y) * (b + (m + x * b) * y);
  else {
    const y = x * Math.sqrt(v * v - 1);
    T = (w) => {
      const C = Math.exp(-v * x * w), P = Math.min(y * w, 300);
      return r - C * ((m + v * x * b) * Math.sinh(P) + y * b * Math.cosh(P)) / y;
    };
  }
  const g = {
    calculatedDuration: f && h || null,
    next: (y) => {
      const w = T(y);
      if (f)
        a.done = y >= h;
      else {
        let C = y === 0 ? m : 0;
        v < 1 && (C = y === 0 ? /* @__PURE__ */ Y(m) : ji(T, y, w));
        const P = Math.abs(C) <= s, E = Math.abs(r - w) <= i;
        a.done = P && E;
      }
      return a.value = a.done ? r : w, a;
    },
    toString: () => {
      const y = Math.min(vn(g), se), w = Ei((C) => g.next(y * C).value, y, 30);
      return y + "ms " + w;
    },
    toTransition: () => {
    }
  };
  return g;
}
ie.applyToOptions = (t) => {
  const e = Wo(t, 100, ie);
  return t.ease = e.ease, t.duration = /* @__PURE__ */ Y(e.duration), t.type = "keyframes", t;
};
function Oe({ keyframes: t, velocity: e = 0, power: n = 0.8, timeConstant: s = 325, bounceDamping: i = 10, bounceStiffness: o = 500, modifyTarget: r, min: a, max: l, restDelta: u = 0.5, restSpeed: c }) {
  const h = t[0], d = {
    done: !1,
    value: h
  }, f = (P) => a !== void 0 && P < a || l !== void 0 && P > l, m = (P) => a === void 0 ? l : l === void 0 || Math.abs(a - P) < Math.abs(l - P) ? a : l;
  let v = n * e;
  const b = h + v, x = r === void 0 ? b : r(b);
  x !== b && (v = x - h);
  const S = (P) => -v * Math.exp(-P / s), T = (P) => x + S(P), g = (P) => {
    const E = S(P), L = T(P);
    d.done = Math.abs(E) <= u, d.value = d.done ? x : L;
  };
  let y, w;
  const C = (P) => {
    f(d.value) && (y = P, w = ie({
      keyframes: [d.value, m(d.value)],
      velocity: ji(T, P, d.value),
      // TODO: This should be passing * 1000
      damping: i,
      stiffness: o,
      restDelta: u,
      restSpeed: c
    }));
  };
  return C(0), {
    calculatedDuration: null,
    next: (P) => {
      let E = !1;
      return !w && y === void 0 && (E = !0, g(P), C(P)), y !== void 0 && P >= y ? w.next(P - y) : (!E && g(P), d);
    }
  };
}
function qo(t, e, n) {
  const s = [], i = n || q.mix || Ri, o = t.length - 1;
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
function Zo(t, e, { clamp: n = !0, ease: s, mixer: i } = {}) {
  const o = t.length;
  if (cn(o === e.length), o === 1)
    return () => e[0];
  if (o === 2 && e[0] === e[1])
    return () => e[1];
  const r = t[0] === t[1];
  t[0] > t[o - 1] && (t = [...t].reverse(), e = [...e].reverse());
  const a = qo(e, s, i), l = a.length, u = (c) => {
    if (r && c < t[0])
      return e[0];
    let h = 0;
    if (l > 1)
      for (; h < t.length - 2 && !(c < t[h + 1]); h++)
        ;
    const d = /* @__PURE__ */ Bt(t[h], t[h + 1], c);
    return a[h](d);
  };
  return n ? (c) => u(Q(t[0], t[o - 1], c)) : u;
}
function ta(t, e) {
  const n = t[t.length - 1];
  for (let s = 1; s <= e; s++) {
    const i = /* @__PURE__ */ Bt(0, e, s);
    t.push(D(n, 1, i));
  }
}
function ea(t) {
  const e = [0];
  return ta(e, t.length - 1), e;
}
function na(t, e) {
  return t.map((n) => n * e);
}
function sa(t, e) {
  return t.map(() => e || Ti).splice(0, t.length - 1);
}
function Et({ duration: t = 300, keyframes: e, times: n, ease: s = "easeInOut" }) {
  const i = po(s) ? s.map(Un) : Un(s), o = {
    done: !1,
    value: e[0]
  }, r = na(
    // Only use the provided offsets if they're the correct length
    // TODO Maybe we should warn here if there's a length mismatch
    n && n.length === e.length ? n : ea(e),
    t
  ), a = Zo(r, e, {
    ease: Array.isArray(i) ? i : sa(e, i)
  });
  return {
    calculatedDuration: t,
    next: (l) => (o.value = a(l), o.done = l >= t, o)
  };
}
const ia = (t) => t !== null;
function Tn(t, { repeat: e, repeatType: n = "loop" }, s, i = 1) {
  const o = t.filter(ia), a = i < 0 || e && n !== "loop" && e % 2 === 1 ? 0 : o.length - 1;
  return !a || s === void 0 ? o[a] : s;
}
const ra = {
  decay: Oe,
  inertia: Oe,
  tween: Et,
  keyframes: Et,
  spring: ie
};
function Li(t) {
  typeof t.type == "string" && (t.type = ra[t.type]);
}
class bn {
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
const oa = (t) => t / 100;
class Sn extends bn {
  constructor(e) {
    super(), this.state = "idle", this.startTime = null, this.isStopped = !1, this.currentTime = 0, this.holdTime = null, this.playbackSpeed = 1, this.stop = () => {
      const { motionValue: n } = this.options;
      n && n.updatedAt !== K.now() && this.tick(K.now()), this.isStopped = !0, this.state !== "idle" && (this.teardown(), this.options.onStop?.());
    }, this.options = e, this.initAnimation(), this.play(), e.autoplay === !1 && this.pause();
  }
  initAnimation() {
    const { options: e } = this;
    Li(e);
    const { type: n = Et, repeat: s = 0, repeatDelay: i = 0, repeatType: o, velocity: r = 0 } = e;
    let { keyframes: a } = e;
    const l = n || Et;
    l !== Et && typeof a[0] != "number" && (this.mixKeyframes = $t(oa, Ri(a[0], a[1])), a = [0, 100]);
    const u = l({ ...e, keyframes: a });
    o === "mirror" && (this.mirroredGenerator = l({
      ...e,
      keyframes: [...a].reverse(),
      velocity: -r
    })), u.calculatedDuration === null && (u.calculatedDuration = vn(u));
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
    const { delay: u = 0, keyframes: c, repeat: h, repeatType: d, repeatDelay: f, type: m, onUpdate: v, finalKeyframe: b } = this.options;
    this.speed > 0 ? this.startTime = Math.min(this.startTime, e) : this.speed < 0 && (this.startTime = Math.min(e - i / this.speed, this.startTime)), n ? this.currentTime = e : this.updateTime(e);
    const x = this.currentTime - u * (this.playbackSpeed >= 0 ? 1 : -1), S = this.playbackSpeed >= 0 ? x < 0 : x > i;
    this.currentTime = Math.max(x, 0), this.state === "finished" && this.holdTime === null && (this.currentTime = i);
    let T = this.currentTime, g = s;
    if (h) {
      const P = Math.min(this.currentTime, i) / a;
      let E = Math.floor(P), L = P % 1;
      !L && P >= 1 && (L = 1), L === 1 && E--, E = Math.min(E, h + 1), !!(E % 2) && (d === "reverse" ? (L = 1 - L, f && (L -= f / a)) : d === "mirror" && (g = r)), T = Q(0, 1, L) * a;
    }
    const y = S ? { done: !1, value: c[0] } : g.next(T);
    o && (y.value = o(y.value));
    let { done: w } = y;
    !S && l !== null && (w = this.playbackSpeed >= 0 ? this.currentTime >= i : this.currentTime <= 0);
    const C = this.holdTime === null && (this.state === "finished" || this.state === "running" && w);
    return C && m !== Oe && (y.value = Tn(c, this.options, b, this.speed)), v && v(y.value), C && this.finish(), y;
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
    e = /* @__PURE__ */ Y(e), this.currentTime = e, this.startTime === null || this.holdTime !== null || this.playbackSpeed === 0 ? this.holdTime = e : this.driver && (this.startTime = this.driver.now() - e / this.playbackSpeed), this.driver?.start(!1);
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
    const { driver: e = Uo, startTime: n } = this.options;
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
function aa(t) {
  for (let e = 1; e < t.length; e++)
    t[e] ?? (t[e] = t[e - 1]);
}
const lt = (t) => t * 180 / Math.PI, Ie = (t) => {
  const e = lt(Math.atan2(t[1], t[0]));
  return Fe(e);
}, la = {
  x: 4,
  y: 5,
  translateX: 4,
  translateY: 5,
  scaleX: 0,
  scaleY: 3,
  scale: (t) => (Math.abs(t[0]) + Math.abs(t[3])) / 2,
  rotate: Ie,
  rotateZ: Ie,
  skewX: (t) => lt(Math.atan(t[1])),
  skewY: (t) => lt(Math.atan(t[2])),
  skew: (t) => (Math.abs(t[1]) + Math.abs(t[2])) / 2
}, Fe = (t) => (t = t % 360, t < 0 && (t += 360), t), Xn = Ie, Jn = (t) => Math.sqrt(t[0] * t[0] + t[1] * t[1]), Qn = (t) => Math.sqrt(t[4] * t[4] + t[5] * t[5]), ca = {
  x: 12,
  y: 13,
  z: 14,
  translateX: 12,
  translateY: 13,
  translateZ: 14,
  scaleX: Jn,
  scaleY: Qn,
  scale: (t) => (Jn(t) + Qn(t)) / 2,
  rotateX: (t) => Fe(lt(Math.atan2(t[6], t[5]))),
  rotateY: (t) => Fe(lt(Math.atan2(-t[2], t[0]))),
  rotateZ: Xn,
  rotate: Xn,
  skewX: (t) => lt(Math.atan(t[4])),
  skewY: (t) => lt(Math.atan(t[1])),
  skew: (t) => (Math.abs(t[1]) + Math.abs(t[4])) / 2
};
function Ne(t) {
  return t.includes("scale") ? 1 : 0;
}
function Ke(t, e) {
  if (!t || t === "none")
    return Ne(e);
  const n = t.match(/^matrix3d\(([-\d.e\s,]+)\)$/u);
  let s, i;
  if (n)
    s = ca, i = n;
  else {
    const a = t.match(/^matrix\(([-\d.e\s,]+)\)$/u);
    s = la, i = a;
  }
  if (!i)
    return Ne(e);
  const o = s[e], r = i[1].split(",").map(ha);
  return typeof o == "function" ? o(r) : r[o];
}
const ua = (t, e) => {
  const { transform: n = "none" } = getComputedStyle(t);
  return Ke(n, e);
};
function ha(t) {
  return parseFloat(t.trim());
}
const wt = [
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
], Ct = new Set(wt), qn = (t) => t === Pt || t === A, da = /* @__PURE__ */ new Set(["x", "y", "z"]), fa = wt.filter((t) => !da.has(t));
function pa(t) {
  const e = [];
  return fa.forEach((n) => {
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
  x: (t, { transform: e }) => Ke(e, "x"),
  y: (t, { transform: e }) => Ke(e, "y")
};
ut.translateX = ut.x;
ut.translateY = ut.y;
const ht = /* @__PURE__ */ new Set();
let $e = !1, _e = !1, Ue = !1;
function ki() {
  if (_e) {
    const t = Array.from(ht).filter((s) => s.needsMeasurement), e = new Set(t.map((s) => s.element)), n = /* @__PURE__ */ new Map();
    e.forEach((s) => {
      const i = pa(s);
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
  _e = !1, $e = !1, ht.forEach((t) => t.complete(Ue)), ht.clear();
}
function Bi() {
  ht.forEach((t) => {
    t.readKeyframes(), t.needsMeasurement && (_e = !0);
  });
}
function ma() {
  Ue = !0, Bi(), ki(), Ue = !1;
}
class An {
  constructor(e, n, s, i, o, r = !1) {
    this.state = "pending", this.isAsync = !1, this.needsMeasurement = !1, this.unresolvedKeyframes = [...e], this.onComplete = n, this.name = s, this.motionValue = i, this.element = o, this.isAsync = r;
  }
  scheduleResolve() {
    this.state = "scheduled", this.isAsync ? (ht.add(this), $e || ($e = !0, V.read(Bi), V.resolveKeyframes(ki))) : (this.readKeyframes(), this.complete());
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
    aa(e);
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
const ya = (t) => t.startsWith("--");
function ga(t, e, n) {
  ya(e) ? t.style.setProperty(e, n) : t.style[e] = n;
}
const xa = /* @__PURE__ */ un(() => window.ScrollTimeline !== void 0), va = {};
function Ta(t, e) {
  const n = /* @__PURE__ */ un(t);
  return () => va[e] ?? n();
}
const Oi = /* @__PURE__ */ Ta(() => {
  try {
    document.createElement("div").animate({ opacity: 0 }, { easing: "linear(0, 1)" });
  } catch {
    return !1;
  }
  return !0;
}, "linearEasing"), Mt = ([t, e, n, s]) => `cubic-bezier(${t}, ${e}, ${n}, ${s})`, Zn = {
  linear: "linear",
  ease: "ease",
  easeIn: "ease-in",
  easeOut: "ease-out",
  easeInOut: "ease-in-out",
  circIn: /* @__PURE__ */ Mt([0, 0.65, 0.55, 1]),
  circOut: /* @__PURE__ */ Mt([0.55, 0, 1, 0.45]),
  backIn: /* @__PURE__ */ Mt([0.31, 0.01, 0.66, -0.59]),
  backOut: /* @__PURE__ */ Mt([0.33, 1.53, 0.69, 0.99])
};
function Ii(t, e) {
  if (t)
    return typeof t == "function" ? Oi() ? Ei(t, e) : "ease-out" : bi(t) ? Mt(t) : Array.isArray(t) ? t.map((n) => Ii(n, e) || Zn.easeOut) : Zn[t];
}
function ba(t, e, n, { delay: s = 0, duration: i = 300, repeat: o = 0, repeatType: r = "loop", ease: a = "easeOut", times: l } = {}, u = void 0) {
  const c = {
    [e]: n
  };
  l && (c.offset = l);
  const h = Ii(a, i);
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
function Fi(t) {
  return typeof t == "function" && "applyToOptions" in t;
}
function Sa({ type: t, ...e }) {
  return Fi(t) && Oi() ? t.applyToOptions(e) : (e.duration ?? (e.duration = 300), e.ease ?? (e.ease = "easeOut"), e);
}
class Aa extends bn {
  constructor(e) {
    if (super(), this.finishedTime = null, this.isStopped = !1, !e)
      return;
    const { element: n, name: s, keyframes: i, pseudoElement: o, allowFlatten: r = !1, finalKeyframe: a, onComplete: l } = e;
    this.isPseudoElement = !!o, this.allowFlatten = r, this.options = e, cn(typeof e.type != "string");
    const u = Sa(e);
    this.animation = ba(n, s, i, u, o), u.autoplay === !1 && this.animation.pause(), this.animation.onfinish = () => {
      if (this.finishedTime = this.time, !o) {
        const c = Tn(i, this.options, a, this.speed);
        this.updateMotionValue ? this.updateMotionValue(c) : ga(n, s, c), this.animation.cancel();
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
    this.finishedTime = null, this.animation.currentTime = /* @__PURE__ */ Y(e);
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
    return this.allowFlatten && this.animation.effect?.updateTiming({ easing: "linear" }), this.animation.onfinish = null, e && xa() ? (this.animation.timeline = e, H) : n(this);
  }
}
const Ni = {
  anticipate: gi,
  backInOut: yi,
  circInOut: vi
};
function Pa(t) {
  return t in Ni;
}
function wa(t) {
  typeof t.ease == "string" && Pa(t.ease) && (t.ease = Ni[t.ease]);
}
const ts = 10;
class Ca extends Aa {
  constructor(e) {
    wa(e), Li(e), super(e), e.startTime && (this.startTime = e.startTime), this.options = e;
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
    const a = new Sn({
      ...r,
      autoplay: !1
    }), l = /* @__PURE__ */ Y(this.finishedTime ?? this.time);
    n.setWithVelocity(a.sample(l - ts).value, a.sample(l).value, ts), a.stop();
  }
}
const es = (t, e) => e === "zIndex" ? !1 : !!(typeof t == "number" || Array.isArray(t) || typeof t == "string" && // It's animatable if we have a string
(nt.test(t) || t === "0") && // And it contains numbers and/or colors
!t.startsWith("url("));
function Va(t) {
  const e = t[0];
  if (t.length === 1)
    return !0;
  for (let n = 0; n < t.length; n++)
    if (t[n] !== e)
      return !0;
}
function Da(t, e, n, s) {
  const i = t[0];
  if (i === null)
    return !1;
  if (e === "display" || e === "visibility")
    return !0;
  const o = t[t.length - 1], r = es(i, e), a = es(o, e);
  return !r || !a ? !1 : Va(t) || (n === "spring" || Fi(n)) && s;
}
function We(t) {
  t.duration = 0, t.type = "keyframes";
}
const Ma = /* @__PURE__ */ new Set([
  "opacity",
  "clipPath",
  "filter",
  "transform"
  // TODO: Could be re-enabled now we have support for linear() easing
  // "background-color"
]), Ra = /* @__PURE__ */ un(() => Object.hasOwnProperty.call(Element.prototype, "animate"));
function Ea(t) {
  const { motionValue: e, name: n, repeatDelay: s, repeatType: i, damping: o, type: r } = t;
  if (!(e?.owner?.current instanceof HTMLElement))
    return !1;
  const { onUpdate: l, transformTemplate: u } = e.owner.getProps();
  return Ra() && n && Ma.has(n) && (n !== "transform" || !u) && /**
   * If we're outputting values to onUpdate then we can't use WAAPI as there's
   * no way to read the value from WAAPI every frame.
   */
  !l && !s && i !== "mirror" && o !== 0 && r !== "inertia";
}
const ja = 40;
class La extends bn {
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
    }, f = c?.KeyframeResolver || An;
    this.keyframeResolver = new f(a, (m, v, b) => this.onKeyframesResolved(m, v, d, !b), l, u, c), this.keyframeResolver?.scheduleResolve();
  }
  onKeyframesResolved(e, n, s, i) {
    this.keyframeResolver = void 0;
    const { name: o, type: r, velocity: a, delay: l, isHandoff: u, onUpdate: c } = s;
    this.resolvedAt = K.now(), Da(e, o, r, a) || ((q.instantAnimations || !l) && c?.(Tn(e, s, n)), e[0] = e[e.length - 1], We(s), s.repeat = 0);
    const d = {
      startTime: i ? this.resolvedAt ? this.resolvedAt - this.createdAt > ja ? this.resolvedAt : this.createdAt : this.createdAt : void 0,
      finalKeyframe: n,
      ...s,
      keyframes: e
    }, f = !u && Ea(d) ? new Ca({
      ...d,
      element: d.motionValue.owner.current
    }) : new Sn(d);
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
    return this._animation || (this.keyframeResolver?.resume(), ma()), this._animation;
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
const ka = (
  // eslint-disable-next-line redos-detector/no-unsafe-regex -- false positive, as it can match a lot of words
  /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u
);
function Ba(t) {
  const e = ka.exec(t);
  if (!e)
    return [,];
  const [, n, s, i] = e;
  return [`--${n ?? s}`, i];
}
function Ki(t, e, n = 1) {
  const [s, i] = Ba(t);
  if (!s)
    return;
  const o = window.getComputedStyle(e).getPropertyValue(s);
  if (o) {
    const r = o.trim();
    return li(r) ? parseFloat(r) : r;
  }
  return mn(i) ? Ki(i, e, n + 1) : i;
}
function Pn(t, e) {
  return t?.[e] ?? t?.default ?? t;
}
const $i = /* @__PURE__ */ new Set([
  "width",
  "height",
  "top",
  "left",
  "right",
  "bottom",
  ...wt
]), Oa = {
  test: (t) => t === "auto",
  parse: (t) => t
}, _i = (t) => (e) => e.test(t), Ui = [Pt, A, X, Z, Vo, Co, Oa], ns = (t) => Ui.find(_i(t));
function Ia(t) {
  return typeof t == "number" ? t === 0 : t !== null ? t === "none" || t === "0" || ui(t) : !0;
}
const Fa = /* @__PURE__ */ new Set(["brightness", "contrast", "saturate", "opacity"]);
function Na(t) {
  const [e, n] = t.slice(0, -1).split("(");
  if (e === "drop-shadow")
    return t;
  const [s] = n.match(yn) || [];
  if (!s)
    return t;
  const i = n.replace(s, "");
  let o = Fa.has(e) ? 1 : 0;
  return s !== n && (o *= 100), e + "(" + o + i + ")";
}
const Ka = /\b([a-z-]*)\(.*?\)/gu, He = {
  ...nt,
  getAnimatableNone: (t) => {
    const e = t.match(Ka);
    return e ? e.map(Na).join(" ") : t;
  }
}, ss = {
  ...Pt,
  transform: Math.round
}, $a = {
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
  distance: A,
  translateX: A,
  translateY: A,
  translateZ: A,
  x: A,
  y: A,
  z: A,
  perspective: A,
  transformPerspective: A,
  opacity: Ot,
  originX: Wn,
  originY: Wn,
  originZ: A
}, wn = {
  // Border props
  borderWidth: A,
  borderTopWidth: A,
  borderRightWidth: A,
  borderBottomWidth: A,
  borderLeftWidth: A,
  borderRadius: A,
  radius: A,
  borderTopLeftRadius: A,
  borderTopRightRadius: A,
  borderBottomRightRadius: A,
  borderBottomLeftRadius: A,
  // Positioning props
  width: A,
  maxWidth: A,
  height: A,
  maxHeight: A,
  top: A,
  right: A,
  bottom: A,
  left: A,
  // Spacing props
  padding: A,
  paddingTop: A,
  paddingRight: A,
  paddingBottom: A,
  paddingLeft: A,
  margin: A,
  marginTop: A,
  marginRight: A,
  marginBottom: A,
  marginLeft: A,
  // Misc
  backgroundPositionX: A,
  backgroundPositionY: A,
  ...$a,
  zIndex: ss,
  // SVG
  fillOpacity: Ot,
  strokeOpacity: Ot,
  numOctaves: ss
}, _a = {
  ...wn,
  // Color props
  color: j,
  backgroundColor: j,
  outlineColor: j,
  fill: j,
  stroke: j,
  // Border props
  borderColor: j,
  borderTopColor: j,
  borderRightColor: j,
  borderBottomColor: j,
  borderLeftColor: j,
  filter: He,
  WebkitFilter: He
}, Wi = (t) => _a[t];
function Hi(t, e) {
  let n = Wi(t);
  return n !== He && (n = nt), n.getAnimatableNone ? n.getAnimatableNone(e) : void 0;
}
const Ua = /* @__PURE__ */ new Set(["auto", "none", "0"]);
function Wa(t, e, n) {
  let s = 0, i;
  for (; s < t.length && !i; ) {
    const o = t[s];
    typeof o == "string" && !Ua.has(o) && It(o).values.length && (i = t[s]), s++;
  }
  if (i && n)
    for (const o of e)
      t[o] = Hi(n, i);
}
class Ha extends An {
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
      if (typeof u == "string" && (u = u.trim(), mn(u))) {
        const c = Ki(u, n.current);
        c !== void 0 && (e[l] = c), l === e.length - 1 && (this.finalKeyframe = u);
      }
    }
    if (this.resolveNoneKeyframes(), !$i.has(s) || e.length !== 2)
      return;
    const [i, o] = e, r = ns(i), a = ns(o);
    if (r !== a)
      if (qn(r) && qn(a))
        for (let l = 0; l < e.length; l++) {
          const u = e[l];
          typeof u == "string" && (e[l] = parseFloat(u));
        }
      else ut[s] && (this.needsMeasurement = !0);
  }
  resolveNoneKeyframes() {
    const { unresolvedKeyframes: e, name: n } = this, s = [];
    for (let i = 0; i < e.length; i++)
      (e[i] === null || Ia(e[i])) && s.push(i);
    s.length && Wa(e, s, n);
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
function Ga(t, e, n) {
  if (t instanceof EventTarget)
    return [t];
  if (typeof t == "string") {
    let s = document;
    const i = n?.[t] ?? s.querySelectorAll(t);
    return i ? Array.from(i) : [];
  }
  return Array.from(t);
}
const Gi = (t, e) => e && typeof t == "number" ? e.transform(t) : t;
function zi(t) {
  return ci(t) && "offsetHeight" in t;
}
const is = 30, za = (t) => !isNaN(parseFloat(t));
class Ya {
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
    this.current = e, this.updatedAt = K.now(), this.canTrackVelocity === null && e !== void 0 && (this.canTrackVelocity = za(this.current));
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
    this.events[e] || (this.events[e] = new hn());
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
    if (!this.canTrackVelocity || this.prevFrameValue === void 0 || e - this.updatedAt > is)
      return 0;
    const n = Math.min(this.updatedAt - this.prevUpdatedAt, is);
    return hi(parseFloat(this.current) - parseFloat(this.prevFrameValue), n);
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
function bt(t, e) {
  return new Ya(t, e);
}
const { schedule: Cn } = /* @__PURE__ */ Si(queueMicrotask, !1), G = {
  x: !1,
  y: !1
};
function Yi() {
  return G.x || G.y;
}
function Xa(t) {
  return t === "x" || t === "y" ? G[t] ? null : (G[t] = !0, () => {
    G[t] = !1;
  }) : G.x || G.y ? null : (G.x = G.y = !0, () => {
    G.x = G.y = !1;
  });
}
function Xi(t, e) {
  const n = Ga(t), s = new AbortController(), i = {
    passive: !0,
    ...e,
    signal: s.signal
  };
  return [n, i, () => s.abort()];
}
function rs(t) {
  return !(t.pointerType === "touch" || Yi());
}
function Ja(t, e, n = {}) {
  const [s, i, o] = Xi(t, n), r = (a) => {
    if (!rs(a))
      return;
    const { target: l } = a, u = e(l, a);
    if (typeof u != "function" || !l)
      return;
    const c = (h) => {
      rs(h) && (u(h), l.removeEventListener("pointerleave", c));
    };
    l.addEventListener("pointerleave", c, i);
  };
  return s.forEach((a) => {
    a.addEventListener("pointerenter", r, i);
  }), o;
}
const Ji = (t, e) => e ? t === e ? !0 : Ji(t, e.parentElement) : !1, Vn = (t) => t.pointerType === "mouse" ? typeof t.button != "number" || t.button <= 0 : t.isPrimary !== !1, Qa = /* @__PURE__ */ new Set([
  "BUTTON",
  "INPUT",
  "SELECT",
  "TEXTAREA",
  "A"
]);
function qa(t) {
  return Qa.has(t.tagName) || t.tabIndex !== -1;
}
const Zt = /* @__PURE__ */ new WeakSet();
function os(t) {
  return (e) => {
    e.key === "Enter" && t(e);
  };
}
function Se(t, e) {
  t.dispatchEvent(new PointerEvent("pointer" + e, { isPrimary: !0, bubbles: !0 }));
}
const Za = (t, e) => {
  const n = t.currentTarget;
  if (!n)
    return;
  const s = os(() => {
    if (Zt.has(n))
      return;
    Se(n, "down");
    const i = os(() => {
      Se(n, "up");
    }), o = () => Se(n, "cancel");
    n.addEventListener("keyup", i, e), n.addEventListener("blur", o, e);
  });
  n.addEventListener("keydown", s, e), n.addEventListener("blur", () => n.removeEventListener("keydown", s), e);
};
function as(t) {
  return Vn(t) && !Yi();
}
function tl(t, e, n = {}) {
  const [s, i, o] = Xi(t, n), r = (a) => {
    const l = a.currentTarget;
    if (!as(a))
      return;
    Zt.add(l);
    const u = e(l, a), c = (f, m) => {
      window.removeEventListener("pointerup", h), window.removeEventListener("pointercancel", d), Zt.has(l) && Zt.delete(l), as(f) && typeof u == "function" && u(f, { success: m });
    }, h = (f) => {
      c(f, l === window || l === document || n.useGlobalTarget || Ji(l, f.target));
    }, d = (f) => {
      c(f, !1);
    };
    window.addEventListener("pointerup", h, i), window.addEventListener("pointercancel", d, i);
  };
  return s.forEach((a) => {
    (n.useGlobalTarget ? window : a).addEventListener("pointerdown", r, i), zi(a) && (a.addEventListener("focus", (u) => Za(u, i)), !qa(a) && !a.hasAttribute("tabindex") && (a.tabIndex = 0));
  }), o;
}
function Qi(t) {
  return ci(t) && "ownerSVGElement" in t;
}
function el(t) {
  return Qi(t) && t.tagName === "svg";
}
const I = (t) => !!(t && t.getVelocity), nl = [...Ui, j, nt], sl = (t) => nl.find(_i(t)), Dn = At({
  transformPagePoint: (t) => t,
  isStatic: !1,
  reducedMotion: "never"
});
function ls(t, e) {
  if (typeof t == "function")
    return t(e);
  t != null && (t.current = e);
}
function il(...t) {
  return (e) => {
    let n = !1;
    const s = t.map((i) => {
      const o = ls(i, e);
      return !n && typeof o == "function" && (n = !0), o;
    });
    if (n)
      return () => {
        for (let i = 0; i < s.length; i++) {
          const o = s[i];
          typeof o == "function" ? o() : ls(t[i], null);
        }
      };
  };
}
function rl(...t) {
  return he.useCallback(il(...t), t);
}
class ol extends he.Component {
  getSnapshotBeforeUpdate(e) {
    const n = this.props.childRef.current;
    if (n && e.isPresent && !this.props.isPresent) {
      const s = n.offsetParent, i = zi(s) && s.offsetWidth || 0, o = this.props.sizeRef.current;
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
function al({ children: t, isPresent: e, anchorX: n, root: s }) {
  const i = en(), o = tt(null), r = tt({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    right: 0
  }), { nonce: a } = O(Dn), l = rl(o, t?.ref);
  return ii(() => {
    const { width: u, height: c, top: h, left: d, right: f } = r.current;
    if (e || !o.current || !u || !c)
      return;
    const m = n === "left" ? `left: ${d}` : `right: ${f}`;
    o.current.dataset.motionPopId = i;
    const v = document.createElement("style");
    a && (v.nonce = a);
    const b = s ?? document.head;
    return b.appendChild(v), v.sheet && v.sheet.insertRule(`
          [data-motion-pop-id="${i}"] {
            position: absolute !important;
            width: ${u}px !important;
            height: ${c}px !important;
            ${m}px !important;
            top: ${h}px !important;
          }
        `), () => {
      b.contains(v) && b.removeChild(v);
    };
  }, [e]), p.jsx(ol, { isPresent: e, childRef: o, sizeRef: r, children: he.cloneElement(t, { ref: l }) });
}
const ll = ({ children: t, initial: e, isPresent: n, onExitComplete: s, custom: i, presenceAffectsLayout: o, mode: r, anchorX: a, root: l }) => {
  const u = rn(cl), c = en();
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
  }, [n]), he.useEffect(() => {
    !n && !u.size && s && s();
  }, [n]), r === "popLayout" && (t = p.jsx(al, { isPresent: n, anchorX: a, root: l, children: t })), p.jsx(de.Provider, { value: d, children: t });
};
function cl() {
  return /* @__PURE__ */ new Map();
}
function qi(t = !0) {
  const e = O(de);
  if (e === null)
    return [!0, null];
  const { isPresent: n, onExitComplete: s, register: i } = e, o = en();
  tn(() => {
    if (t)
      return i(o);
  }, [t]);
  const r = ri(() => t && s && s(o), [o, s, t]);
  return !n && s ? [!1, r] : [!0];
}
const Jt = (t) => t.key || "";
function cs(t) {
  const e = [];
  return Gr.forEach(t, (n) => {
    zr(n) && e.push(n);
  }), e;
}
const re = ({ children: t, custom: e, initial: n = !0, onExitComplete: s, presenceAffectsLayout: i = !0, mode: o = "sync", propagate: r = !1, anchorX: a = "left", root: l }) => {
  const [u, c] = qi(r), h = dt(() => cs(t), [t]), d = r && !u ? [] : h.map(Jt), f = tt(!0), m = tt(h), v = rn(() => /* @__PURE__ */ new Map()), [b, x] = je(h), [S, T] = je(h);
  ai(() => {
    f.current = !1, m.current = h;
    for (let w = 0; w < S.length; w++) {
      const C = Jt(S[w]);
      d.includes(C) ? v.delete(C) : v.get(C) !== !0 && v.set(C, !1);
    }
  }, [S, d.length, d.join("-")]);
  const g = [];
  if (h !== b) {
    let w = [...h];
    for (let C = 0; C < S.length; C++) {
      const P = S[C], E = Jt(P);
      d.includes(E) || (w.splice(C, 0, P), g.push(P));
    }
    return o === "wait" && g.length && (w = g), T(cs(w)), x(h), null;
  }
  const { forceRender: y } = O(sn);
  return p.jsx(p.Fragment, { children: S.map((w) => {
    const C = Jt(w), P = r && !u ? !1 : h === S || d.includes(C), E = () => {
      if (v.has(C))
        v.set(C, !0);
      else
        return;
      let L = !0;
      v.forEach((z) => {
        z || (L = !1);
      }), L && (y?.(), T(m.current), r && c?.(), s && s());
    };
    return p.jsx(ll, { isPresent: P, initial: !f.current || n ? void 0 : !1, custom: e, presenceAffectsLayout: i, mode: o, root: l, onExitComplete: P ? void 0 : E, anchorX: a, children: w }, C);
  }) });
}, Zi = At({ strict: !1 }), us = {
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
}, St = {};
for (const t in us)
  St[t] = {
    isEnabled: (e) => us[t].some((n) => !!e[n])
  };
function ul(t) {
  for (const e in t)
    St[e] = {
      ...St[e],
      ...t[e]
    };
}
const hl = /* @__PURE__ */ new Set([
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
function oe(t) {
  return t.startsWith("while") || t.startsWith("drag") && t !== "draggable" || t.startsWith("layout") || t.startsWith("onTap") || t.startsWith("onPan") || t.startsWith("onLayout") || hl.has(t);
}
let tr = (t) => !oe(t);
function dl(t) {
  typeof t == "function" && (tr = (e) => e.startsWith("on") ? !oe(e) : t(e));
}
try {
  dl(require("@emotion/is-prop-valid").default);
} catch {
}
function fl(t, e, n) {
  const s = {};
  for (const i in t)
    i === "values" && typeof t.values == "object" || (tr(i) || n === !0 && oe(i) || !e && !oe(i) || // If trying to use native HTML drag events, forward drag listeners
    t.draggable && i.startsWith("onDrag")) && (s[i] = t[i]);
  return s;
}
const fe = /* @__PURE__ */ At({});
function pe(t) {
  return t !== null && typeof t == "object" && typeof t.start == "function";
}
function Ft(t) {
  return typeof t == "string" || Array.isArray(t);
}
const Mn = [
  "animate",
  "whileInView",
  "whileFocus",
  "whileHover",
  "whileTap",
  "whileDrag",
  "exit"
], Rn = ["initial", ...Mn];
function me(t) {
  return pe(t.animate) || Rn.some((e) => Ft(t[e]));
}
function er(t) {
  return !!(me(t) || t.variants);
}
function pl(t, e) {
  if (me(t)) {
    const { initial: n, animate: s } = t;
    return {
      initial: n === !1 || Ft(n) ? n : void 0,
      animate: Ft(s) ? s : void 0
    };
  }
  return t.inherit !== !1 ? e : {};
}
function ml(t) {
  const { initial: e, animate: n } = pl(t, O(fe));
  return dt(() => ({ initial: e, animate: n }), [hs(e), hs(n)]);
}
function hs(t) {
  return Array.isArray(t) ? t.join(" ") : t;
}
const Nt = {};
function yl(t) {
  for (const e in t)
    Nt[e] = t[e], pn(e) && (Nt[e].isCSSVariable = !0);
}
function nr(t, { layout: e, layoutId: n }) {
  return Ct.has(t) || t.startsWith("origin") || (e || n !== void 0) && (!!Nt[t] || t === "opacity");
}
const gl = {
  x: "translateX",
  y: "translateY",
  z: "translateZ",
  transformPerspective: "perspective"
}, xl = wt.length;
function vl(t, e, n) {
  let s = "", i = !0;
  for (let o = 0; o < xl; o++) {
    const r = wt[o], a = t[r];
    if (a === void 0)
      continue;
    let l = !0;
    if (typeof a == "number" ? l = a === (r.startsWith("scale") ? 1 : 0) : l = parseFloat(a) === 0, !l || n) {
      const u = Gi(a, wn[r]);
      if (!l) {
        i = !1;
        const c = gl[r] || r;
        s += `${c}(${u}) `;
      }
      n && (e[r] = u);
    }
  }
  return s = s.trim(), n ? s = n(e, i ? "" : s) : i && (s = "none"), s;
}
function En(t, e, n) {
  const { style: s, vars: i, transformOrigin: o } = t;
  let r = !1, a = !1;
  for (const l in e) {
    const u = e[l];
    if (Ct.has(l)) {
      r = !0;
      continue;
    } else if (pn(l)) {
      i[l] = u;
      continue;
    } else {
      const c = Gi(u, wn[l]);
      l.startsWith("origin") ? (a = !0, o[l] = c) : s[l] = c;
    }
  }
  if (e.transform || (r || n ? s.transform = vl(e, t.transform, n) : s.transform && (s.transform = "none")), a) {
    const { originX: l = "50%", originY: u = "50%", originZ: c = 0 } = o;
    s.transformOrigin = `${l} ${u} ${c}`;
  }
}
const jn = () => ({
  style: {},
  transform: {},
  transformOrigin: {},
  vars: {}
});
function sr(t, e, n) {
  for (const s in e)
    !I(e[s]) && !nr(s, n) && (t[s] = e[s]);
}
function Tl({ transformTemplate: t }, e) {
  return dt(() => {
    const n = jn();
    return En(n, e, t), Object.assign({}, n.vars, n.style);
  }, [e]);
}
function bl(t, e) {
  const n = t.style || {}, s = {};
  return sr(s, n, t), Object.assign(s, Tl(t, e)), s;
}
function Sl(t, e) {
  const n = {}, s = bl(t, e);
  return t.drag && t.dragListener !== !1 && (n.draggable = !1, s.userSelect = s.WebkitUserSelect = s.WebkitTouchCallout = "none", s.touchAction = t.drag === !0 ? "none" : `pan-${t.drag === "x" ? "y" : "x"}`), t.tabIndex === void 0 && (t.onTap || t.onTapStart || t.whileTap) && (n.tabIndex = 0), n.style = s, n;
}
const Al = {
  offset: "stroke-dashoffset",
  array: "stroke-dasharray"
}, Pl = {
  offset: "strokeDashoffset",
  array: "strokeDasharray"
};
function wl(t, e, n = 1, s = 0, i = !0) {
  t.pathLength = 1;
  const o = i ? Al : Pl;
  t[o.offset] = A.transform(-s);
  const r = A.transform(e), a = A.transform(n);
  t[o.array] = `${r} ${a}`;
}
function ir(t, {
  attrX: e,
  attrY: n,
  attrScale: s,
  pathLength: i,
  pathSpacing: o = 1,
  pathOffset: r = 0,
  // This is object creation, which we try to avoid per-frame.
  ...a
}, l, u, c) {
  if (En(t, a, u), l) {
    t.style.viewBox && (t.attrs.viewBox = t.style.viewBox);
    return;
  }
  t.attrs = t.style, t.style = {};
  const { attrs: h, style: d } = t;
  h.transform && (d.transform = h.transform, delete h.transform), (d.transform || h.transformOrigin) && (d.transformOrigin = h.transformOrigin ?? "50% 50%", delete h.transformOrigin), d.transform && (d.transformBox = c?.transformBox ?? "fill-box", delete h.transformBox), e !== void 0 && (h.x = e), n !== void 0 && (h.y = n), s !== void 0 && (h.scale = s), i !== void 0 && wl(h, i, o, r, !1);
}
const rr = () => ({
  ...jn(),
  attrs: {}
}), or = (t) => typeof t == "string" && t.toLowerCase() === "svg";
function Cl(t, e, n, s) {
  const i = dt(() => {
    const o = rr();
    return ir(o, e, or(s), t.transformTemplate, t.style), {
      ...o.attrs,
      style: { ...o.style }
    };
  }, [e]);
  if (t.style) {
    const o = {};
    sr(o, t.style, t), i.style = { ...o, ...i.style };
  }
  return i;
}
const Vl = [
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
function Ln(t) {
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
      !!(Vl.indexOf(t) > -1 || /**
       * If it contains a capital letter, it's an SVG component
       */
      /[A-Z]/u.test(t))
    )
  );
}
function Dl(t, e, n, { latestValues: s }, i, o = !1) {
  const a = (Ln(t) ? Cl : Sl)(e, s, i, t), l = fl(e, typeof t == "string", o), u = t !== oi ? { ...l, ...a, ref: n } : {}, { children: c } = e, h = dt(() => I(c) ? c.get() : c, [c]);
  return Yr(t, {
    ...u,
    children: h
  });
}
function ds(t) {
  const e = [{}, {}];
  return t?.values.forEach((n, s) => {
    e[0][s] = n.get(), e[1][s] = n.getVelocity();
  }), e;
}
function kn(t, e, n, s) {
  if (typeof e == "function") {
    const [i, o] = ds(s);
    e = e(n !== void 0 ? n : t.custom, i, o);
  }
  if (typeof e == "string" && (e = t.variants && t.variants[e]), typeof e == "function") {
    const [i, o] = ds(s);
    e = e(n !== void 0 ? n : t.custom, i, o);
  }
  return e;
}
function te(t) {
  return I(t) ? t.get() : t;
}
function Ml({ scrapeMotionValuesFromProps: t, createRenderState: e }, n, s, i) {
  return {
    latestValues: Rl(n, s, i, t),
    renderState: e()
  };
}
function Rl(t, e, n, s) {
  const i = {}, o = s(t, {});
  for (const d in o)
    i[d] = te(o[d]);
  let { initial: r, animate: a } = t;
  const l = me(t), u = er(t);
  e && u && !l && t.inherit !== !1 && (r === void 0 && (r = e.initial), a === void 0 && (a = e.animate));
  let c = n ? n.initial === !1 : !1;
  c = c || r === !1;
  const h = c ? a : r;
  if (h && typeof h != "boolean" && !pe(h)) {
    const d = Array.isArray(h) ? h : [h];
    for (let f = 0; f < d.length; f++) {
      const m = kn(t, d[f]);
      if (m) {
        const { transitionEnd: v, transition: b, ...x } = m;
        for (const S in x) {
          let T = x[S];
          if (Array.isArray(T)) {
            const g = c ? T.length - 1 : 0;
            T = T[g];
          }
          T !== null && (i[S] = T);
        }
        for (const S in v)
          i[S] = v[S];
      }
    }
  }
  return i;
}
const ar = (t) => (e, n) => {
  const s = O(fe), i = O(de), o = () => Ml(t, e, s, i);
  return n ? o() : rn(o);
};
function Bn(t, e, n) {
  const { style: s } = t, i = {};
  for (const o in s)
    (I(s[o]) || e.style && I(e.style[o]) || nr(o, t) || n?.getValue(o)?.liveStyle !== void 0) && (i[o] = s[o]);
  return i;
}
const El = /* @__PURE__ */ ar({
  scrapeMotionValuesFromProps: Bn,
  createRenderState: jn
});
function lr(t, e, n) {
  const s = Bn(t, e, n);
  for (const i in t)
    if (I(t[i]) || I(e[i])) {
      const o = wt.indexOf(i) !== -1 ? "attr" + i.charAt(0).toUpperCase() + i.substring(1) : i;
      s[o] = t[i];
    }
  return s;
}
const jl = /* @__PURE__ */ ar({
  scrapeMotionValuesFromProps: lr,
  createRenderState: rr
}), Ll = Symbol.for("motionComponentSymbol");
function yt(t) {
  return t && typeof t == "object" && Object.prototype.hasOwnProperty.call(t, "current");
}
function kl(t, e, n) {
  return ri(
    (s) => {
      s && t.onMount && t.onMount(s), e && (s ? e.mount(s) : e.unmount()), n && (typeof n == "function" ? n(s) : yt(n) && (n.current = s));
    },
    /**
     * Include externalRef in dependencies to ensure the callback updates
     * when the ref changes, allowing proper ref forwarding.
     */
    [e]
  );
}
const On = (t) => t.replace(/([a-z])([A-Z])/gu, "$1-$2").toLowerCase(), Bl = "framerAppearId", cr = "data-" + On(Bl), ur = At({});
function Ol(t, e, n, s, i) {
  const { visualElement: o } = O(fe), r = O(Zi), a = O(de), l = O(Dn).reducedMotion, u = tt(null);
  s = s || r.renderer, !u.current && s && (u.current = s(t, {
    visualState: e,
    parent: o,
    props: n,
    presenceContext: a,
    blockInitialAnimation: a ? a.initial === !1 : !1,
    reducedMotionConfig: l
  }));
  const c = u.current, h = O(ur);
  c && !c.projection && i && (c.type === "html" || c.type === "svg") && Il(u.current, n, i, h);
  const d = tt(!1);
  ii(() => {
    c && d.current && c.update(n, a);
  });
  const f = n[cr], m = tt(!!f && !window.MotionHandoffIsComplete?.(f) && window.MotionHasOptimisedAnimation?.(f));
  return ai(() => {
    c && (d.current = !0, window.MotionIsMounted = !0, c.updateFeatures(), c.scheduleRenderMicrotask(), m.current && c.animationState && c.animationState.animateChanges());
  }), tn(() => {
    c && (!m.current && c.animationState && c.animationState.animateChanges(), m.current && (queueMicrotask(() => {
      window.MotionHandoffMarkAsComplete?.(f);
    }), m.current = !1), c.enteringChildren = void 0);
  }), c;
}
function Il(t, e, n, s) {
  const { layoutId: i, layout: o, drag: r, dragConstraints: a, layoutScroll: l, layoutRoot: u, layoutCrossfade: c } = e;
  t.projection = new n(t.latestValues, e["data-framer-portal-id"] ? void 0 : hr(t.parent)), t.projection.setOptions({
    layoutId: i,
    layout: o,
    alwaysMeasureLayout: !!r || a && yt(a),
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
function hr(t) {
  if (t)
    return t.options.allowProjection !== !1 ? t.projection : hr(t.parent);
}
function Ae(t, { forwardMotionProps: e = !1 } = {}, n, s) {
  n && ul(n);
  const i = Ln(t) ? jl : El;
  function o(a, l) {
    let u;
    const c = {
      ...O(Dn),
      ...a,
      layoutId: Fl(a)
    }, { isStatic: h } = c, d = ml(a), f = i(a, h);
    if (!h && on) {
      Nl();
      const m = Kl(c);
      u = m.MeasureLayout, d.visualElement = Ol(t, f, c, s, m.ProjectionNode);
    }
    return p.jsxs(fe.Provider, { value: d, children: [u && d.visualElement ? p.jsx(u, { visualElement: d.visualElement, ...c }) : null, Dl(t, a, kl(f, d.visualElement, l), f, h, e)] });
  }
  o.displayName = `motion.${typeof t == "string" ? t : `create(${t.displayName ?? t.name ?? ""})`}`;
  const r = Xr(o);
  return r[Ll] = t, r;
}
function Fl({ layoutId: t }) {
  const e = O(sn).id;
  return e && t !== void 0 ? e + "-" + t : t;
}
function Nl(t, e) {
  O(Zi).strict;
}
function Kl(t) {
  const { drag: e, layout: n } = St;
  if (!e && !n)
    return {};
  const s = { ...e, ...n };
  return {
    MeasureLayout: e?.isEnabled(t) || n?.isEnabled(t) ? s.MeasureLayout : void 0,
    ProjectionNode: s.ProjectionNode
  };
}
function $l(t, e) {
  if (typeof Proxy > "u")
    return Ae;
  const n = /* @__PURE__ */ new Map(), s = (o, r) => Ae(o, r, t, e), i = (o, r) => s(o, r);
  return new Proxy(i, {
    /**
     * Called when `motion` is referenced with a prop: `motion.div`, `motion.input` etc.
     * The prop name is passed through as `key` and we can use that to generate a `motion`
     * DOM component with that name.
     */
    get: (o, r) => r === "create" ? s : (n.has(r) || n.set(r, Ae(r, void 0, t, e)), n.get(r))
  });
}
function dr({ top: t, left: e, right: n, bottom: s }) {
  return {
    x: { min: e, max: n },
    y: { min: t, max: s }
  };
}
function _l({ x: t, y: e }) {
  return { top: e.min, right: t.max, bottom: e.max, left: t.min };
}
function Ul(t, e) {
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
function Pe(t) {
  return t === void 0 || t === 1;
}
function Ge({ scale: t, scaleX: e, scaleY: n }) {
  return !Pe(t) || !Pe(e) || !Pe(n);
}
function ot(t) {
  return Ge(t) || fr(t) || t.z || t.rotate || t.rotateX || t.rotateY || t.skewX || t.skewY;
}
function fr(t) {
  return fs(t.x) || fs(t.y);
}
function fs(t) {
  return t && t !== "0%";
}
function ae(t, e, n) {
  const s = t - n, i = e * s;
  return n + i;
}
function ps(t, e, n, s, i) {
  return i !== void 0 && (t = ae(t, i, s)), ae(t, n, s) + e;
}
function ze(t, e = 0, n = 1, s, i) {
  t.min = ps(t.min, e, n, s, i), t.max = ps(t.max, e, n, s, i);
}
function pr(t, { x: e, y: n }) {
  ze(t.x, e.translate, e.scale, e.originPoint), ze(t.y, n.translate, n.scale, n.originPoint);
}
const ms = 0.999999999999, ys = 1.0000000000001;
function Wl(t, e, n, s = !1) {
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
    }), r && (e.x *= r.x.scale, e.y *= r.y.scale, pr(t, r)), s && ot(o.latestValues) && xt(t, o.latestValues));
  }
  e.x < ys && e.x > ms && (e.x = 1), e.y < ys && e.y > ms && (e.y = 1);
}
function gt(t, e) {
  t.min = t.min + e, t.max = t.max + e;
}
function gs(t, e, n, s, i = 0.5) {
  const o = D(t.min, t.max, i);
  ze(t, e, n, o, s);
}
function xt(t, e) {
  gs(t.x, e.x, e.scaleX, e.scale, e.originX), gs(t.y, e.y, e.scaleY, e.scale, e.originY);
}
function mr(t, e) {
  return dr(Ul(t.getBoundingClientRect(), e));
}
function Hl(t, e, n) {
  const s = mr(t, n), { scroll: i } = e;
  return i && (gt(s.x, i.offset.x), gt(s.y, i.offset.y)), s;
}
const xs = () => ({
  translate: 0,
  scale: 1,
  origin: 0,
  originPoint: 0
}), vt = () => ({
  x: xs(),
  y: xs()
}), vs = () => ({ min: 0, max: 0 }), R = () => ({
  x: vs(),
  y: vs()
}), Ye = { current: null }, yr = { current: !1 };
function Gl() {
  if (yr.current = !0, !!on)
    if (window.matchMedia) {
      const t = window.matchMedia("(prefers-reduced-motion)"), e = () => Ye.current = t.matches;
      t.addEventListener("change", e), e();
    } else
      Ye.current = !1;
}
const zl = /* @__PURE__ */ new WeakMap();
function Yl(t, e, n) {
  for (const s in e) {
    const i = e[s], o = n[s];
    if (I(i))
      t.addValue(s, i);
    else if (I(o))
      t.addValue(s, bt(i, { owner: t }));
    else if (o !== i)
      if (t.hasValue(s)) {
        const r = t.getValue(s);
        r.liveStyle === !0 ? r.jump(i) : r.hasAnimated || r.set(i);
      } else {
        const r = t.getStaticValue(s);
        t.addValue(s, bt(r !== void 0 ? r : i, { owner: t }));
      }
  }
  for (const s in n)
    e[s] === void 0 && t.removeValue(s);
  return e;
}
const Ts = [
  "AnimationStart",
  "AnimationComplete",
  "Update",
  "BeforeLayoutMeasure",
  "LayoutMeasure",
  "LayoutAnimationStart",
  "LayoutAnimationComplete"
];
class Xl {
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
    this.current = null, this.children = /* @__PURE__ */ new Set(), this.isVariantNode = !1, this.isControllingVariants = !1, this.shouldReduceMotion = null, this.values = /* @__PURE__ */ new Map(), this.KeyframeResolver = An, this.features = {}, this.valueSubscriptions = /* @__PURE__ */ new Map(), this.prevMotionValues = {}, this.events = {}, this.propEventSubscriptions = {}, this.notifyUpdate = () => this.notify("Update", this.latestValues), this.render = () => {
      this.current && (this.triggerBuild(), this.renderInstance(this.current, this.renderState, this.props.style, this.projection));
    }, this.renderScheduledAt = 0, this.scheduleRender = () => {
      const d = K.now();
      this.renderScheduledAt < d && (this.renderScheduledAt = d, V.render(this.render, !1, !0));
    };
    const { latestValues: l, renderState: u } = r;
    this.latestValues = l, this.baseTarget = { ...l }, this.initialValues = n.initial ? { ...l } : {}, this.renderState = u, this.parent = e, this.props = n, this.presenceContext = s, this.depth = e ? e.depth + 1 : 0, this.reducedMotionConfig = i, this.options = a, this.blockInitialAnimation = !!o, this.isControllingVariants = me(n), this.isVariantNode = er(n), this.isVariantNode && (this.variantChildren = /* @__PURE__ */ new Set()), this.manuallyAnimateOnMount = !!(e && e.current);
    const { willChange: c, ...h } = this.scrapeMotionValuesFromProps(n, {}, this);
    for (const d in h) {
      const f = h[d];
      l[d] !== void 0 && I(f) && f.set(l[d]);
    }
  }
  mount(e) {
    this.current = e, zl.set(e, this), this.projection && !this.projection.instance && this.projection.mount(e), this.parent && this.isVariantNode && !this.isControllingVariants && (this.removeFromVariantTree = this.parent.addVariantChild(this)), this.values.forEach((n, s) => this.bindToMotionValue(s, n)), yr.current || Gl(), this.shouldReduceMotion = this.reducedMotionConfig === "never" ? !1 : this.reducedMotionConfig === "always" ? !0 : Ye.current, this.parent?.addChild(this), this.update(this.props, this.presenceContext);
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
    const s = Ct.has(e);
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
    for (e in St) {
      const n = St[e];
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
    for (let s = 0; s < Ts.length; s++) {
      const i = Ts[s];
      this.propEventSubscriptions[i] && (this.propEventSubscriptions[i](), delete this.propEventSubscriptions[i]);
      const o = "on" + i, r = e[o];
      r && (this.propEventSubscriptions[i] = this.on(i, r));
    }
    this.prevMotionValues = Yl(this, this.scrapeMotionValuesFromProps(e, this.prevProps, this), this.prevMotionValues), this.handleChildMotionValue && this.handleChildMotionValue();
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
    return s === void 0 && n !== void 0 && (s = bt(n === null ? void 0 : n, { owner: this }), this.addValue(e, s)), s;
  }
  /**
   * If we're trying to animate to a previously unencountered value,
   * we need to check for it in our state and as a last resort read it
   * directly from the instance (which might have performance implications).
   */
  readValue(e, n) {
    let s = this.latestValues[e] !== void 0 || !this.current ? this.latestValues[e] : this.getBaseTargetFromProps(this.props, e) ?? this.readValueFromInstance(this.current, e, this.options);
    return s != null && (typeof s == "string" && (li(s) || ui(s)) ? s = parseFloat(s) : !sl(s) && nt.test(n) && (s = Hi(e, n)), this.setBaseTarget(e, I(s) ? s.get() : s)), I(s) ? s.get() : s;
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
      const o = kn(this.props, n, this.presenceContext?.custom);
      o && (s = o[e]);
    }
    if (n && s !== void 0)
      return s;
    const i = this.getBaseTargetFromProps(this.props, e);
    return i !== void 0 && !I(i) ? i : this.initialValues[e] !== void 0 && s === void 0 ? void 0 : this.baseTarget[e];
  }
  on(e, n) {
    return this.events[e] || (this.events[e] = new hn()), this.events[e].add(n);
  }
  notify(e, ...n) {
    this.events[e] && this.events[e].notify(...n);
  }
  scheduleRenderMicrotask() {
    Cn.render(this.render);
  }
}
class gr extends Xl {
  constructor() {
    super(...arguments), this.KeyframeResolver = Ha;
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
    I(e) && (this.childSubscription = e.on("change", (n) => {
      this.current && (this.current.textContent = `${n}`);
    }));
  }
}
function xr(t, { style: e, vars: n }, s, i) {
  const o = t.style;
  let r;
  for (r in e)
    o[r] = e[r];
  i?.applyProjectionStyles(o, s);
  for (r in n)
    o.setProperty(r, n[r]);
}
function Jl(t) {
  return window.getComputedStyle(t);
}
class Ql extends gr {
  constructor() {
    super(...arguments), this.type = "html", this.renderInstance = xr;
  }
  readValueFromInstance(e, n) {
    if (Ct.has(n))
      return this.projection?.isProjecting ? Ne(n) : ua(e, n);
    {
      const s = Jl(e), i = (pn(n) ? s.getPropertyValue(n) : s[n]) || 0;
      return typeof i == "string" ? i.trim() : i;
    }
  }
  measureInstanceViewportBox(e, { transformPagePoint: n }) {
    return mr(e, n);
  }
  build(e, n, s) {
    En(e, n, s.transformTemplate);
  }
  scrapeMotionValuesFromProps(e, n, s) {
    return Bn(e, n, s);
  }
}
const vr = /* @__PURE__ */ new Set([
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
function ql(t, e, n, s) {
  xr(t, e, void 0, s);
  for (const i in e.attrs)
    t.setAttribute(vr.has(i) ? i : On(i), e.attrs[i]);
}
class Zl extends gr {
  constructor() {
    super(...arguments), this.type = "svg", this.isSVGTag = !1, this.measureInstanceViewportBox = R;
  }
  getBaseTargetFromProps(e, n) {
    return e[n];
  }
  readValueFromInstance(e, n) {
    if (Ct.has(n)) {
      const s = Wi(n);
      return s && s.default || 0;
    }
    return n = vr.has(n) ? n : On(n), e.getAttribute(n);
  }
  scrapeMotionValuesFromProps(e, n, s) {
    return lr(e, n, s);
  }
  build(e, n, s) {
    ir(e, n, this.isSVGTag, s.transformTemplate, s.style);
  }
  renderInstance(e, n, s, i) {
    ql(e, n, s, i);
  }
  mount(e) {
    this.isSVGTag = or(e.tagName), super.mount(e);
  }
}
const tc = (t, e) => Ln(t) ? new Zl(e) : new Ql(e, {
  allowProjection: t !== oi
});
function Tt(t, e, n) {
  const s = t.getProps();
  return kn(s, e, n !== void 0 ? n : s.custom, t);
}
const Xe = (t) => Array.isArray(t);
function ec(t, e, n) {
  t.hasValue(e) ? t.getValue(e).set(n) : t.addValue(e, bt(n));
}
function nc(t) {
  return Xe(t) ? t[t.length - 1] || 0 : t;
}
function sc(t, e) {
  const n = Tt(t, e);
  let { transitionEnd: s = {}, transition: i = {}, ...o } = n || {};
  o = { ...o, ...s };
  for (const r in o) {
    const a = nc(o[r]);
    ec(t, r, a);
  }
}
function ic(t) {
  return !!(I(t) && t.add);
}
function Je(t, e) {
  const n = t.getValue("willChange");
  if (ic(n))
    return n.add(e);
  if (!n && q.WillChange) {
    const s = new q.WillChange("auto");
    t.addValue("willChange", s), s.add(e);
  }
}
function Tr(t) {
  return t.props[cr];
}
const rc = (t) => t !== null;
function oc(t, { repeat: e, repeatType: n = "loop" }, s) {
  const i = t.filter(rc), o = e && n !== "loop" && e % 2 === 1 ? 0 : i.length - 1;
  return i[o];
}
const ac = {
  type: "spring",
  stiffness: 500,
  damping: 25,
  restSpeed: 10
}, lc = (t) => ({
  type: "spring",
  stiffness: 550,
  damping: t === 0 ? 2 * Math.sqrt(550) : 30,
  restSpeed: 10
}), cc = {
  type: "keyframes",
  duration: 0.8
}, uc = {
  type: "keyframes",
  ease: [0.25, 0.1, 0.35, 1],
  duration: 0.3
}, hc = (t, { keyframes: e }) => e.length > 2 ? cc : Ct.has(t) ? t.startsWith("scale") ? lc(e[1]) : ac : uc;
function dc({ when: t, delay: e, delayChildren: n, staggerChildren: s, staggerDirection: i, repeat: o, repeatType: r, repeatDelay: a, from: l, elapsed: u, ...c }) {
  return !!Object.keys(c).length;
}
const In = (t, e, n, s = {}, i, o) => (r) => {
  const a = Pn(s, t) || {}, l = a.delay || s.delay || 0;
  let { elapsed: u = 0 } = s;
  u = u - /* @__PURE__ */ Y(l);
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
  dc(a) || Object.assign(c, hc(t, c)), c.duration && (c.duration = /* @__PURE__ */ Y(c.duration)), c.repeatDelay && (c.repeatDelay = /* @__PURE__ */ Y(c.repeatDelay)), c.from !== void 0 && (c.keyframes[0] = c.from);
  let h = !1;
  if ((c.type === !1 || c.duration === 0 && !c.repeatDelay) && (We(c), c.delay === 0 && (h = !0)), (q.instantAnimations || q.skipAnimations) && (h = !0, We(c), c.delay = 0), c.allowFlatten = !a.type && !a.ease, h && !o && e.get() !== void 0) {
    const d = oc(c.keyframes, a);
    if (d !== void 0) {
      V.update(() => {
        c.onUpdate(d), c.onComplete();
      });
      return;
    }
  }
  return a.isSync ? new Sn(c) : new La(c);
};
function fc({ protectedKeys: t, needsAnimating: e }, n) {
  const s = t.hasOwnProperty(n) && e[n] !== !0;
  return e[n] = !1, s;
}
function br(t, e, { delay: n = 0, transitionOverride: s, type: i } = {}) {
  let { transition: o = t.getDefaultTransition(), transitionEnd: r, ...a } = e;
  s && (o = s);
  const l = [], u = i && t.animationState && t.animationState.getState()[i];
  for (const c in a) {
    const h = t.getValue(c, t.latestValues[c] ?? null), d = a[c];
    if (d === void 0 || u && fc(u, c))
      continue;
    const f = {
      delay: n,
      ...Pn(o || {}, c)
    }, m = h.get();
    if (m !== void 0 && !h.isAnimating && !Array.isArray(d) && d === m && !f.velocity)
      continue;
    let v = !1;
    if (window.MotionHandoffAnimation) {
      const x = Tr(t);
      if (x) {
        const S = window.MotionHandoffAnimation(x, c, V);
        S !== null && (f.startTime = S, v = !0);
      }
    }
    Je(t, c), h.start(In(c, h, d, t.shouldReduceMotion && $i.has(c) ? { type: !1 } : f, t, v));
    const b = h.animation;
    b && l.push(b);
  }
  return r && Promise.all(l).then(() => {
    V.update(() => {
      r && sc(t, r);
    });
  }), l;
}
function Sr(t, e, n, s = 0, i = 1) {
  const o = Array.from(t).sort((u, c) => u.sortNodePosition(c)).indexOf(e), r = t.size, a = (r - 1) * s;
  return typeof n == "function" ? n(o, r) : i === 1 ? o * s : a - o * s;
}
function Qe(t, e, n = {}) {
  const s = Tt(t, e, n.type === "exit" ? t.presenceContext?.custom : void 0);
  let { transition: i = t.getDefaultTransition() || {} } = s || {};
  n.transitionOverride && (i = n.transitionOverride);
  const o = s ? () => Promise.all(br(t, s, n)) : () => Promise.resolve(), r = t.variantChildren && t.variantChildren.size ? (l = 0) => {
    const { delayChildren: u = 0, staggerChildren: c, staggerDirection: h } = i;
    return pc(t, e, l, u, c, h, n);
  } : () => Promise.resolve(), { when: a } = i;
  if (a) {
    const [l, u] = a === "beforeChildren" ? [o, r] : [r, o];
    return l().then(() => u());
  } else
    return Promise.all([o(), r(n.delay)]);
}
function pc(t, e, n = 0, s = 0, i = 0, o = 1, r) {
  const a = [];
  for (const l of t.variantChildren)
    l.notify("AnimationStart", e), a.push(Qe(l, e, {
      ...r,
      delay: n + (typeof s == "function" ? 0 : s) + Sr(t.variantChildren, l, s, i, o)
    }).then(() => l.notify("AnimationComplete", e)));
  return Promise.all(a);
}
function mc(t, e, n = {}) {
  t.notify("AnimationStart", e);
  let s;
  if (Array.isArray(e)) {
    const i = e.map((o) => Qe(t, o, n));
    s = Promise.all(i);
  } else if (typeof e == "string")
    s = Qe(t, e, n);
  else {
    const i = typeof e == "function" ? Tt(t, e, n.custom) : e;
    s = Promise.all(br(t, i, n));
  }
  return s.then(() => {
    t.notify("AnimationComplete", e);
  });
}
function Ar(t, e) {
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
const yc = Rn.length;
function Pr(t) {
  if (!t)
    return;
  if (!t.isControllingVariants) {
    const n = t.parent ? Pr(t.parent) || {} : {};
    return t.props.initial !== void 0 && (n.initial = t.props.initial), n;
  }
  const e = {};
  for (let n = 0; n < yc; n++) {
    const s = Rn[n], i = t.props[s];
    (Ft(i) || i === !1) && (e[s] = i);
  }
  return e;
}
const gc = [...Mn].reverse(), xc = Mn.length;
function vc(t) {
  return (e) => Promise.all(e.map(({ animation: n, options: s }) => mc(t, n, s)));
}
function Tc(t) {
  let e = vc(t), n = bs(), s = !0;
  const i = (l) => (u, c) => {
    const h = Tt(t, c, l === "exit" ? t.presenceContext?.custom : void 0);
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
    const { props: u } = t, c = Pr(t.parent) || {}, h = [], d = /* @__PURE__ */ new Set();
    let f = {}, m = 1 / 0;
    for (let b = 0; b < xc; b++) {
      const x = gc[b], S = n[x], T = u[x] !== void 0 ? u[x] : c[x], g = Ft(T), y = x === l ? S.isActive : null;
      y === !1 && (m = b);
      let w = T === c[x] && T !== u[x] && g;
      if (w && s && t.manuallyAnimateOnMount && (w = !1), S.protectedKeys = { ...f }, // If it isn't active and hasn't *just* been set as inactive
      !S.isActive && y === null || // If we didn't and don't have any defined prop for this animation type
      !T && !S.prevProp || // Or if the prop doesn't define an animation
      pe(T) || typeof T == "boolean")
        continue;
      const C = bc(S.prevProp, T);
      let P = C || // If we're making this variant active, we want to always make it active
      x === l && S.isActive && !w && g || // If we removed a higher-priority variant (i is in reverse order)
      b > m && g, E = !1;
      const L = Array.isArray(T) ? T : [T];
      let z = L.reduce(i(x), {});
      y === !1 && (z = {});
      const { prevResolvedValues: Ht = {} } = S, J = {
        ...Ht,
        ...z
      }, Gt = (k) => {
        P = !0, d.has(k) && (E = !0, d.delete(k)), S.needsAnimating[k] = !0;
        const $ = t.getValue(k);
        $ && ($.liveStyle = !1);
      };
      for (const k in J) {
        const $ = z[k], it = Ht[k];
        if (f.hasOwnProperty(k))
          continue;
        let ft = !1;
        Xe($) && Xe(it) ? ft = !Ar($, it) : ft = $ !== it, ft ? $ != null ? Gt(k) : d.add(k) : $ !== void 0 && d.has(k) ? Gt(k) : S.protectedKeys[k] = !0;
      }
      S.prevProp = T, S.prevResolvedValues = z, S.isActive && (f = { ...f, ...z }), s && t.blockInitialAnimation && (P = !1);
      const zt = w && C;
      P && (!zt || E) && h.push(...L.map((k) => {
        const $ = { type: x };
        if (typeof k == "string" && s && !zt && t.manuallyAnimateOnMount && t.parent) {
          const { parent: it } = t, ft = Tt(it, k);
          if (it.enteringChildren && ft) {
            const { delayChildren: Ur } = ft.transition || {};
            $.delay = Sr(it.enteringChildren, t, Ur);
          }
        }
        return {
          animation: k,
          options: $
        };
      }));
    }
    if (d.size) {
      const b = {};
      if (typeof u.initial != "boolean") {
        const x = Tt(t, Array.isArray(u.initial) ? u.initial[0] : u.initial);
        x && x.transition && (b.transition = x.transition);
      }
      d.forEach((x) => {
        const S = t.getBaseTarget(x), T = t.getValue(x);
        T && (T.liveStyle = !0), b[x] = S ?? null;
      }), h.push({ animation: b });
    }
    let v = !!h.length;
    return s && (u.initial === !1 || u.initial === u.animate) && !t.manuallyAnimateOnMount && (v = !1), s = !1, v ? e(h) : Promise.resolve();
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
      n = bs();
    }
  };
}
function bc(t, e) {
  return typeof e == "string" ? e !== t : Array.isArray(e) ? !Ar(e, t) : !1;
}
function rt(t = !1) {
  return {
    isActive: t,
    protectedKeys: {},
    needsAnimating: {},
    prevResolvedValues: {}
  };
}
function bs() {
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
class Sc extends st {
  /**
   * We dynamically generate the AnimationState manager as it contains a reference
   * to the underlying animation library. We only want to load that if we load this,
   * so people can optionally code split it out using the `m` component.
   */
  constructor(e) {
    super(e), e.animationState || (e.animationState = Tc(e));
  }
  updateAnimationControlsSubscription() {
    const { animate: e } = this.node.getProps();
    pe(e) && (this.unmountControls = e.subscribe(this.node));
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
let Ac = 0;
class Pc extends st {
  constructor() {
    super(...arguments), this.id = Ac++;
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
const wc = {
  animation: {
    Feature: Sc
  },
  exit: {
    Feature: Pc
  }
};
function Kt(t, e, n, s = { passive: !0 }) {
  return t.addEventListener(e, n, s), () => t.removeEventListener(e, n);
}
function Wt(t) {
  return {
    point: {
      x: t.pageX,
      y: t.pageY
    }
  };
}
const Cc = (t) => (e) => Vn(e) && t(e, Wt(e));
function jt(t, e, n, s) {
  return Kt(t, e, Cc(n), s);
}
const wr = 1e-4, Vc = 1 - wr, Dc = 1 + wr, Cr = 0.01, Mc = 0 - Cr, Rc = 0 + Cr;
function F(t) {
  return t.max - t.min;
}
function Ec(t, e, n) {
  return Math.abs(t - e) <= n;
}
function Ss(t, e, n, s = 0.5) {
  t.origin = s, t.originPoint = D(e.min, e.max, t.origin), t.scale = F(n) / F(e), t.translate = D(n.min, n.max, t.origin) - t.originPoint, (t.scale >= Vc && t.scale <= Dc || isNaN(t.scale)) && (t.scale = 1), (t.translate >= Mc && t.translate <= Rc || isNaN(t.translate)) && (t.translate = 0);
}
function Lt(t, e, n, s) {
  Ss(t.x, e.x, n.x, s ? s.originX : void 0), Ss(t.y, e.y, n.y, s ? s.originY : void 0);
}
function As(t, e, n) {
  t.min = n.min + e.min, t.max = t.min + F(e);
}
function jc(t, e, n) {
  As(t.x, e.x, n.x), As(t.y, e.y, n.y);
}
function Ps(t, e, n) {
  t.min = e.min - n.min, t.max = t.min + F(e);
}
function kt(t, e, n) {
  Ps(t.x, e.x, n.x), Ps(t.y, e.y, n.y);
}
function U(t) {
  return [t("x"), t("y")];
}
const Vr = ({ current: t }) => t ? t.ownerDocument.defaultView : null, ws = (t, e) => Math.abs(t - e);
function Lc(t, e) {
  const n = ws(t.x, e.x), s = ws(t.y, e.y);
  return Math.sqrt(n ** 2 + s ** 2);
}
class Dr {
  constructor(e, n, { transformPagePoint: s, contextWindow: i = window, dragSnapToOrigin: o = !1, distanceThreshold: r = 3 } = {}) {
    if (this.startEvent = null, this.lastMoveEvent = null, this.lastMoveEventInfo = null, this.handlers = {}, this.contextWindow = window, this.updatePoint = () => {
      if (!(this.lastMoveEvent && this.lastMoveEventInfo))
        return;
      const d = Ce(this.lastMoveEventInfo, this.history), f = this.startEvent !== null, m = Lc(d.offset, { x: 0, y: 0 }) >= this.distanceThreshold;
      if (!f && !m)
        return;
      const { point: v } = d, { timestamp: b } = B;
      this.history.push({ ...v, timestamp: b });
      const { onStart: x, onMove: S } = this.handlers;
      f || (x && x(this.lastMoveEvent, d), this.startEvent = this.lastMoveEvent), S && S(this.lastMoveEvent, d);
    }, this.handlePointerMove = (d, f) => {
      this.lastMoveEvent = d, this.lastMoveEventInfo = we(f, this.transformPagePoint), V.update(this.updatePoint, !0);
    }, this.handlePointerUp = (d, f) => {
      this.end();
      const { onEnd: m, onSessionEnd: v, resumeAnimation: b } = this.handlers;
      if (this.dragSnapToOrigin && b && b(), !(this.lastMoveEvent && this.lastMoveEventInfo))
        return;
      const x = Ce(d.type === "pointercancel" ? this.lastMoveEventInfo : we(f, this.transformPagePoint), this.history);
      this.startEvent && m && m(d, x), v && v(d, x);
    }, !Vn(e))
      return;
    this.dragSnapToOrigin = o, this.handlers = n, this.transformPagePoint = s, this.distanceThreshold = r, this.contextWindow = i || window;
    const a = Wt(e), l = we(a, this.transformPagePoint), { point: u } = l, { timestamp: c } = B;
    this.history = [{ ...u, timestamp: c }];
    const { onSessionStart: h } = n;
    h && h(e, Ce(l, this.history)), this.removeListeners = $t(jt(this.contextWindow, "pointermove", this.handlePointerMove), jt(this.contextWindow, "pointerup", this.handlePointerUp), jt(this.contextWindow, "pointercancel", this.handlePointerUp));
  }
  updateHandlers(e) {
    this.handlers = e;
  }
  end() {
    this.removeListeners && this.removeListeners(), et(this.updatePoint);
  }
}
function we(t, e) {
  return e ? { point: e(t.point) } : t;
}
function Cs(t, e) {
  return { x: t.x - e.x, y: t.y - e.y };
}
function Ce({ point: t }, e) {
  return {
    point: t,
    delta: Cs(t, Mr(e)),
    offset: Cs(t, kc(e)),
    velocity: Bc(e, 0.1)
  };
}
function kc(t) {
  return t[0];
}
function Mr(t) {
  return t[t.length - 1];
}
function Bc(t, e) {
  if (t.length < 2)
    return { x: 0, y: 0 };
  let n = t.length - 1, s = null;
  const i = Mr(t);
  for (; n >= 0 && (s = t[n], !(i.timestamp - s.timestamp > /* @__PURE__ */ Y(e))); )
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
function Oc(t, { min: e, max: n }, s) {
  return e !== void 0 && t < e ? t = s ? D(e, t, s.min) : Math.max(t, e) : n !== void 0 && t > n && (t = s ? D(n, t, s.max) : Math.min(t, n)), t;
}
function Vs(t, e, n) {
  return {
    min: e !== void 0 ? t.min + e : void 0,
    max: n !== void 0 ? t.max + n - (t.max - t.min) : void 0
  };
}
function Ic(t, { top: e, left: n, bottom: s, right: i }) {
  return {
    x: Vs(t.x, n, i),
    y: Vs(t.y, e, s)
  };
}
function Ds(t, e) {
  let n = e.min - t.min, s = e.max - t.max;
  return e.max - e.min < t.max - t.min && ([n, s] = [s, n]), { min: n, max: s };
}
function Fc(t, e) {
  return {
    x: Ds(t.x, e.x),
    y: Ds(t.y, e.y)
  };
}
function Nc(t, e) {
  let n = 0.5;
  const s = F(t), i = F(e);
  return i > s ? n = /* @__PURE__ */ Bt(e.min, e.max - s, t.min) : s > i && (n = /* @__PURE__ */ Bt(t.min, t.max - i, e.min)), Q(0, 1, n);
}
function Kc(t, e) {
  const n = {};
  return e.min !== void 0 && (n.min = e.min - t.min), e.max !== void 0 && (n.max = e.max - t.min), n;
}
const qe = 0.35;
function $c(t = qe) {
  return t === !1 ? t = 0 : t === !0 && (t = qe), {
    x: Ms(t, "left", "right"),
    y: Ms(t, "top", "bottom")
  };
}
function Ms(t, e, n) {
  return {
    min: Rs(t, e),
    max: Rs(t, n)
  };
}
function Rs(t, e) {
  return typeof t == "number" ? t : t[e] || 0;
}
const _c = /* @__PURE__ */ new WeakMap();
class Uc {
  constructor(e) {
    this.openDragLock = null, this.isDragging = !1, this.currentDirection = null, this.originPoint = { x: 0, y: 0 }, this.constraints = !1, this.hasMutatedConstraints = !1, this.elastic = R(), this.latestPointerEvent = null, this.latestPanInfo = null, this.visualElement = e;
  }
  start(e, { snapToCursor: n = !1, distanceThreshold: s } = {}) {
    const { presenceContext: i } = this.visualElement;
    if (i && i.isPresent === !1)
      return;
    const o = (h) => {
      const { dragSnapToOrigin: d } = this.getProps();
      d ? this.pauseAnimation() : this.stopAnimation(), n && this.snapToCursor(Wt(h).point);
    }, r = (h, d) => {
      const { drag: f, dragPropagation: m, onDragStart: v } = this.getProps();
      if (f && !m && (this.openDragLock && this.openDragLock(), this.openDragLock = Xa(f), !this.openDragLock))
        return;
      this.latestPointerEvent = h, this.latestPanInfo = d, this.isDragging = !0, this.currentDirection = null, this.resolveConstraints(), this.visualElement.projection && (this.visualElement.projection.isAnimationBlocked = !0, this.visualElement.projection.target = void 0), U((x) => {
        let S = this.getAxisMotionValue(x).get() || 0;
        if (X.test(S)) {
          const { projection: T } = this.visualElement;
          if (T && T.layout) {
            const g = T.layout.layoutBox[x];
            g && (S = F(g) * (parseFloat(S) / 100));
          }
        }
        this.originPoint[x] = S;
      }), v && V.postRender(() => v(h, d)), Je(this.visualElement, "transform");
      const { animationState: b } = this.visualElement;
      b && b.setActive("whileDrag", !0);
    }, a = (h, d) => {
      this.latestPointerEvent = h, this.latestPanInfo = d;
      const { dragPropagation: f, dragDirectionLock: m, onDirectionLock: v, onDrag: b } = this.getProps();
      if (!f && !this.openDragLock)
        return;
      const { offset: x } = d;
      if (m && this.currentDirection === null) {
        this.currentDirection = Wc(x), this.currentDirection !== null && v && v(this.currentDirection);
        return;
      }
      this.updateAxis("x", d.point, x), this.updateAxis("y", d.point, x), this.visualElement.render(), b && b(h, d);
    }, l = (h, d) => {
      this.latestPointerEvent = h, this.latestPanInfo = d, this.stop(h, d), this.latestPointerEvent = null, this.latestPanInfo = null;
    }, u = () => U((h) => this.getAnimationState(h) === "paused" && this.getAxisMotionValue(h).animation?.play()), { dragSnapToOrigin: c } = this.getProps();
    this.panSession = new Dr(e, {
      onSessionStart: o,
      onStart: r,
      onMove: a,
      onSessionEnd: l,
      resumeAnimation: u
    }, {
      transformPagePoint: this.visualElement.getTransformPagePoint(),
      dragSnapToOrigin: c,
      distanceThreshold: s,
      contextWindow: Vr(this.visualElement)
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
    this.constraints && this.constraints[e] && (r = Oc(r, this.constraints[e], this.elastic[e])), o.set(r);
  }
  resolveConstraints() {
    const { dragConstraints: e, dragElastic: n } = this.getProps(), s = this.visualElement.projection && !this.visualElement.projection.layout ? this.visualElement.projection.measure(!1) : this.visualElement.projection?.layout, i = this.constraints;
    e && yt(e) ? this.constraints || (this.constraints = this.resolveRefConstraints()) : e && s ? this.constraints = Ic(s.layoutBox, e) : this.constraints = !1, this.elastic = $c(n), i !== this.constraints && s && this.constraints && !this.hasMutatedConstraints && U((o) => {
      this.constraints !== !1 && this.getAxisMotionValue(o) && (this.constraints[o] = Kc(s.layoutBox[o], this.constraints[o]));
    });
  }
  resolveRefConstraints() {
    const { dragConstraints: e, onMeasureDragConstraints: n } = this.getProps();
    if (!e || !yt(e))
      return !1;
    const s = e.current, { projection: i } = this.visualElement;
    if (!i || !i.layout)
      return !1;
    const o = Hl(s, i.root, this.visualElement.getTransformPagePoint());
    let r = Fc(i.layout.layoutBox, o);
    if (n) {
      const a = n(_l(r));
      this.hasMutatedConstraints = !!a, a && (r = dr(a));
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
    return Je(this.visualElement, e), s.start(In(e, s, 0, n, this.visualElement, !1));
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
    if (!yt(n) || !s || !this.constraints)
      return;
    this.stopAnimation();
    const i = { x: 0, y: 0 };
    U((r) => {
      const a = this.getAxisMotionValue(r);
      if (a && this.constraints !== !1) {
        const l = a.get();
        i[r] = Nc({ min: l, max: l }, this.constraints[r]);
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
    _c.set(this.visualElement, this);
    const e = this.visualElement.current, n = jt(e, "pointerdown", (l) => {
      const { drag: u, dragListener: c = !0 } = this.getProps();
      u && c && this.start(l);
    }), s = () => {
      const { dragConstraints: l } = this.getProps();
      yt(l) && l.current && (this.constraints = this.resolveRefConstraints());
    }, { projection: i } = this.visualElement, o = i.addEventListener("measure", s);
    i && !i.layout && (i.root && i.root.updateScroll(), i.updateLayout()), V.read(s);
    const r = Kt(window, "resize", () => this.scalePositionWithinConstraints()), a = i.addEventListener("didUpdate", (({ delta: l, hasLayoutChanged: u }) => {
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
    const e = this.visualElement.getProps(), { drag: n = !1, dragDirectionLock: s = !1, dragPropagation: i = !1, dragConstraints: o = !1, dragElastic: r = qe, dragMomentum: a = !0 } = e;
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
function Wc(t, e = 10) {
  let n = null;
  return Math.abs(t.y) > e ? n = "y" : Math.abs(t.x) > e && (n = "x"), n;
}
class Hc extends st {
  constructor(e) {
    super(e), this.removeGroupControls = H, this.removeListeners = H, this.controls = new Uc(e);
  }
  mount() {
    const { dragControls: e } = this.node.getProps();
    e && (this.removeGroupControls = e.subscribe(this.controls)), this.removeListeners = this.controls.addListeners() || H;
  }
  unmount() {
    this.removeGroupControls(), this.removeListeners();
  }
}
const Es = (t) => (e, n) => {
  t && V.postRender(() => t(e, n));
};
class Gc extends st {
  constructor() {
    super(...arguments), this.removePointerDownListener = H;
  }
  onPointerDown(e) {
    this.session = new Dr(e, this.createPanHandlers(), {
      transformPagePoint: this.node.getTransformPagePoint(),
      contextWindow: Vr(this.node)
    });
  }
  createPanHandlers() {
    const { onPanSessionStart: e, onPanStart: n, onPan: s, onPanEnd: i } = this.node.getProps();
    return {
      onSessionStart: Es(e),
      onStart: Es(n),
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
const ee = {
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
function js(t, e) {
  return e.max === e.min ? 0 : t / (e.max - e.min) * 100;
}
const Dt = {
  correct: (t, e) => {
    if (!e.target)
      return t;
    if (typeof t == "string")
      if (A.test(t))
        t = parseFloat(t);
      else
        return t;
    const n = js(t, e.target.x), s = js(t, e.target.y);
    return `${n}% ${s}%`;
  }
}, zc = {
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
let Ve = !1;
class Yc extends Jr {
  /**
   * This only mounts projection nodes for components that
   * need measuring, we might want to do it for all components
   * in order to incorporate transforms
   */
  componentDidMount() {
    const { visualElement: e, layoutGroup: n, switchLayoutGroup: s, layoutId: i } = this.props, { projection: o } = e;
    yl(Xc), o && (n.group && n.group.add(o), s && s.register && i && s.register(o), Ve && o.root.didUpdate(), o.addEventListener("animationComplete", () => {
      this.safeToRemove();
    }), o.setOptions({
      ...o.options,
      onExitComplete: () => this.safeToRemove()
    })), ee.hasEverUpdated = !0;
  }
  getSnapshotBeforeUpdate(e) {
    const { layoutDependency: n, visualElement: s, drag: i, isPresent: o } = this.props, { projection: r } = s;
    return r && (r.isPresent = o, Ve = !0, i || e.layoutDependency !== n || n === void 0 || e.isPresent !== o ? r.willUpdate() : this.safeToRemove(), e.isPresent !== o && (o ? r.promote() : r.relegate() || V.postRender(() => {
      const a = r.getStack();
      (!a || !a.members.length) && this.safeToRemove();
    }))), null;
  }
  componentDidUpdate() {
    const { projection: e } = this.props.visualElement;
    e && (e.root.didUpdate(), Cn.postRender(() => {
      !e.currentAnimation && e.isLead() && this.safeToRemove();
    }));
  }
  componentWillUnmount() {
    const { visualElement: e, layoutGroup: n, switchLayoutGroup: s } = this.props, { projection: i } = e;
    Ve = !0, i && (i.scheduleCheckAfterUnmount(), n && n.group && n.group.remove(i), s && s.deregister && s.deregister(i));
  }
  safeToRemove() {
    const { safeToRemove: e } = this.props;
    e && e();
  }
  render() {
    return null;
  }
}
function Rr(t) {
  const [e, n] = qi(), s = O(sn);
  return p.jsx(Yc, { ...t, layoutGroup: s, switchLayoutGroup: O(ur), isPresent: e, safeToRemove: n });
}
const Xc = {
  borderRadius: {
    ...Dt,
    applyTo: [
      "borderTopLeftRadius",
      "borderTopRightRadius",
      "borderBottomLeftRadius",
      "borderBottomRightRadius"
    ]
  },
  borderTopLeftRadius: Dt,
  borderTopRightRadius: Dt,
  borderBottomLeftRadius: Dt,
  borderBottomRightRadius: Dt,
  boxShadow: zc
};
function Jc(t, e, n) {
  const s = I(t) ? t : bt(t);
  return s.start(In("", s, e, n)), s.animation;
}
const Qc = (t, e) => t.depth - e.depth;
class qc {
  constructor() {
    this.children = [], this.isDirty = !1;
  }
  add(e) {
    an(this.children, e), this.isDirty = !0;
  }
  remove(e) {
    ln(this.children, e), this.isDirty = !0;
  }
  forEach(e) {
    this.isDirty && this.children.sort(Qc), this.isDirty = !1, this.children.forEach(e);
  }
}
function Zc(t, e) {
  const n = K.now(), s = ({ timestamp: i }) => {
    const o = i - n;
    o >= e && (et(s), t(o - e));
  };
  return V.setup(s, !0), () => et(s);
}
const Er = ["TopLeft", "TopRight", "BottomLeft", "BottomRight"], tu = Er.length, Ls = (t) => typeof t == "string" ? parseFloat(t) : t, ks = (t) => typeof t == "number" || A.test(t);
function eu(t, e, n, s, i, o) {
  i ? (t.opacity = D(0, n.opacity ?? 1, nu(s)), t.opacityExit = D(e.opacity ?? 1, 0, su(s))) : o && (t.opacity = D(e.opacity ?? 1, n.opacity ?? 1, s));
  for (let r = 0; r < tu; r++) {
    const a = `border${Er[r]}Radius`;
    let l = Bs(e, a), u = Bs(n, a);
    if (l === void 0 && u === void 0)
      continue;
    l || (l = 0), u || (u = 0), l === 0 || u === 0 || ks(l) === ks(u) ? (t[a] = Math.max(D(Ls(l), Ls(u), s), 0), (X.test(u) || X.test(l)) && (t[a] += "%")) : t[a] = u;
  }
  (e.rotate || n.rotate) && (t.rotate = D(e.rotate || 0, n.rotate || 0, s));
}
function Bs(t, e) {
  return t[e] !== void 0 ? t[e] : t.borderRadius;
}
const nu = /* @__PURE__ */ jr(0, 0.5, xi), su = /* @__PURE__ */ jr(0.5, 0.95, H);
function jr(t, e, n) {
  return (s) => s < t ? 0 : s > e ? 1 : n(/* @__PURE__ */ Bt(t, e, s));
}
function Os(t, e) {
  t.min = e.min, t.max = e.max;
}
function _(t, e) {
  Os(t.x, e.x), Os(t.y, e.y);
}
function Is(t, e) {
  t.translate = e.translate, t.scale = e.scale, t.originPoint = e.originPoint, t.origin = e.origin;
}
function Fs(t, e, n, s, i) {
  return t -= e, t = ae(t, 1 / n, s), i !== void 0 && (t = ae(t, 1 / i, s)), t;
}
function iu(t, e = 0, n = 1, s = 0.5, i, o = t, r = t) {
  if (X.test(e) && (e = parseFloat(e), e = D(r.min, r.max, e / 100) - r.min), typeof e != "number")
    return;
  let a = D(o.min, o.max, s);
  t === o && (a -= e), t.min = Fs(t.min, e, n, a, i), t.max = Fs(t.max, e, n, a, i);
}
function Ns(t, e, [n, s, i], o, r) {
  iu(t, e[n], e[s], e[i], e.scale, o, r);
}
const ru = ["x", "scaleX", "originX"], ou = ["y", "scaleY", "originY"];
function Ks(t, e, n, s) {
  Ns(t.x, e, ru, n ? n.x : void 0, s ? s.x : void 0), Ns(t.y, e, ou, n ? n.y : void 0, s ? s.y : void 0);
}
function $s(t) {
  return t.translate === 0 && t.scale === 1;
}
function Lr(t) {
  return $s(t.x) && $s(t.y);
}
function _s(t, e) {
  return t.min === e.min && t.max === e.max;
}
function au(t, e) {
  return _s(t.x, e.x) && _s(t.y, e.y);
}
function Us(t, e) {
  return Math.round(t.min) === Math.round(e.min) && Math.round(t.max) === Math.round(e.max);
}
function kr(t, e) {
  return Us(t.x, e.x) && Us(t.y, e.y);
}
function Ws(t) {
  return F(t.x) / F(t.y);
}
function Hs(t, e) {
  return t.translate === e.translate && t.scale === e.scale && t.originPoint === e.originPoint;
}
class lu {
  constructor() {
    this.members = [];
  }
  add(e) {
    an(this.members, e), e.scheduleRender();
  }
  remove(e) {
    if (ln(this.members, e), e === this.prevLead && (this.prevLead = void 0), e === this.lead) {
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
function cu(t, e, n) {
  let s = "";
  const i = t.x.translate / e.x, o = t.y.translate / e.y, r = n?.z || 0;
  if ((i || o || r) && (s = `translate3d(${i}px, ${o}px, ${r}px) `), (e.x !== 1 || e.y !== 1) && (s += `scale(${1 / e.x}, ${1 / e.y}) `), n) {
    const { transformPerspective: u, rotate: c, rotateX: h, rotateY: d, skewX: f, skewY: m } = n;
    u && (s = `perspective(${u}px) ${s}`), c && (s += `rotate(${c}deg) `), h && (s += `rotateX(${h}deg) `), d && (s += `rotateY(${d}deg) `), f && (s += `skewX(${f}deg) `), m && (s += `skewY(${m}deg) `);
  }
  const a = t.x.scale * e.x, l = t.y.scale * e.y;
  return (a !== 1 || l !== 1) && (s += `scale(${a}, ${l})`), s || "none";
}
const De = ["", "X", "Y", "Z"], uu = 1e3;
let hu = 0;
function Me(t, e, n, s) {
  const { latestValues: i } = e;
  i[t] && (n[t] = i[t], e.setStaticValue(t, 0), s && (s[t] = 0));
}
function Br(t) {
  if (t.hasCheckedOptimisedAppear = !0, t.root === t)
    return;
  const { visualElement: e } = t.options;
  if (!e)
    return;
  const n = Tr(e);
  if (window.MotionHasOptimisedAnimation(n, "transform")) {
    const { layout: i, layoutId: o } = t.options;
    window.MotionCancelOptimisedAnimation(n, "transform", V, !(i || o));
  }
  const { parent: s } = t;
  s && !s.hasCheckedOptimisedAppear && Br(s);
}
function Or({ attachResizeListener: t, defaultParent: e, measureScroll: n, checkIsScrollRoot: s, resetTransform: i }) {
  return class {
    constructor(r = {}, a = e?.()) {
      this.id = hu++, this.animationId = 0, this.animationCommitId = 0, this.children = /* @__PURE__ */ new Set(), this.options = {}, this.isTreeAnimating = !1, this.isAnimationBlocked = !1, this.isLayoutDirty = !1, this.isProjectionDirty = !1, this.isSharedProjectionDirty = !1, this.isTransformDirty = !1, this.updateManuallyBlocked = !1, this.updateBlockedByResize = !1, this.isUpdating = !1, this.isSVG = !1, this.needsReset = !1, this.shouldResetTransform = !1, this.hasCheckedOptimisedAppear = !1, this.treeScale = { x: 1, y: 1 }, this.eventHandlers = /* @__PURE__ */ new Map(), this.hasTreeAnimated = !1, this.updateScheduled = !1, this.scheduleUpdate = () => this.update(), this.projectionUpdateScheduled = !1, this.checkUpdateFailed = () => {
        this.isUpdating && (this.isUpdating = !1, this.clearAllSnapshots());
      }, this.updateProjection = () => {
        this.projectionUpdateScheduled = !1, this.nodes.forEach(pu), this.nodes.forEach(xu), this.nodes.forEach(vu), this.nodes.forEach(mu);
      }, this.resolvedRelativeTargetAt = 0, this.hasProjected = !1, this.isVisible = !0, this.animationProgress = 0, this.sharedNodes = /* @__PURE__ */ new Map(), this.latestValues = r, this.root = a ? a.root || a : this, this.path = a ? [...a.path, a] : [], this.parent = a, this.depth = a ? a.depth + 1 : 0;
      for (let l = 0; l < this.path.length; l++)
        this.path[l].shouldResetTransform = !0;
      this.root === this && (this.nodes = new qc());
    }
    addEventListener(r, a) {
      return this.eventHandlers.has(r) || this.eventHandlers.set(r, new hn()), this.eventHandlers.get(r).add(a);
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
      this.isSVG = Qi(r) && !el(r), this.instance = r;
      const { layoutId: a, layout: l, visualElement: u } = this.options;
      if (u && !u.current && u.mount(r), this.root.nodes.add(this), this.parent && this.parent.children.add(this), this.root.hasTreeAnimated && (l || a) && (this.isLayoutDirty = !0), t) {
        let c, h = 0;
        const d = () => this.root.updateBlockedByResize = !1;
        V.read(() => {
          h = window.innerWidth;
        }), t(r, () => {
          const f = window.innerWidth;
          f !== h && (h = f, this.root.updateBlockedByResize = !0, c && c(), c = Zc(d, 250), ee.hasAnimatedSinceResize && (ee.hasAnimatedSinceResize = !1, this.nodes.forEach(Ys)));
        });
      }
      a && this.root.registerSharedNode(a, this), this.options.animate !== !1 && u && (a || l) && this.addEventListener("didUpdate", ({ delta: c, hasLayoutChanged: h, hasRelativeLayoutChanged: d, layout: f }) => {
        if (this.isTreeAnimationBlocked()) {
          this.target = void 0, this.relativeTarget = void 0;
          return;
        }
        const m = this.options.transition || u.getDefaultTransition() || Pu, { onLayoutAnimationStart: v, onLayoutAnimationComplete: b } = u.getProps(), x = !this.targetLayout || !kr(this.targetLayout, f), S = !h && d;
        if (this.options.layoutRoot || this.resumeFrom || S || h && (x || !this.currentAnimation)) {
          this.resumeFrom && (this.resumingFrom = this.resumeFrom, this.resumingFrom.resumingFrom = void 0);
          const T = {
            ...Pn(m, "layout"),
            onPlay: v,
            onComplete: b
          };
          (u.shouldReduceMotion || this.options.layoutRoot) && (T.delay = 0, T.type = !1), this.startAnimation(T), this.setAnimationOrigin(c, S);
        } else
          h || Ys(this), this.isLead() && this.options.onExitComplete && this.options.onExitComplete();
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
      this.isUpdateBlocked() || (this.isUpdating = !0, this.nodes && this.nodes.forEach(Tu), this.animationId++);
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
      if (window.MotionCancelOptimisedAnimation && !this.hasCheckedOptimisedAppear && Br(this), !this.root.isUpdating && this.root.startUpdate(), this.isLayoutDirty)
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
        this.unblockUpdate(), this.clearAllSnapshots(), this.nodes.forEach(Gs);
        return;
      }
      if (this.animationId <= this.animationCommitId) {
        this.nodes.forEach(zs);
        return;
      }
      this.animationCommitId = this.animationId, this.isUpdating ? (this.isUpdating = !1, this.nodes.forEach(gu), this.nodes.forEach(du), this.nodes.forEach(fu)) : this.nodes.forEach(zs), this.clearAllSnapshots();
      const a = K.now();
      B.delta = Q(0, 1e3 / 60, a - B.timestamp), B.timestamp = a, B.isProcessing = !0, ge.update.process(B), ge.preRender.process(B), ge.render.process(B), B.isProcessing = !1;
    }
    didUpdate() {
      this.updateScheduled || (this.updateScheduled = !0, Cn.read(this.scheduleUpdate));
    }
    clearAllSnapshots() {
      this.nodes.forEach(yu), this.sharedNodes.forEach(bu);
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
      const r = this.isLayoutDirty || this.shouldResetTransform || this.options.alwaysMeasureLayout, a = this.projectionDelta && !Lr(this.projectionDelta), l = this.getTransformTemplate(), u = l ? l(this.latestValues, "") : void 0, c = u !== this.prevTransformTemplateValue;
      r && this.instance && (a || ot(this.latestValues) || c) && (i(this.instance, u), this.shouldResetTransform = !1, this.scheduleRender());
    }
    measure(r = !0) {
      const a = this.measurePageBox();
      let l = this.removeElementScroll(a);
      return r && (l = this.removeTransform(l)), wu(l), {
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
      if (!(this.scroll?.wasRoot || this.path.some(Cu))) {
        const { scroll: u } = this.root;
        u && (gt(a.x, u.offset.x), gt(a.y, u.offset.y));
      }
      return a;
    }
    removeElementScroll(r) {
      const a = R();
      if (_(a, r), this.scroll?.wasRoot)
        return a;
      for (let l = 0; l < this.path.length; l++) {
        const u = this.path[l], { scroll: c, options: h } = u;
        u !== this.root && c && h.layoutScroll && (c.wasRoot && _(a, r), gt(a.x, c.offset.x), gt(a.y, c.offset.y));
      }
      return a;
    }
    applyTransform(r, a = !1) {
      const l = R();
      _(l, r);
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
      _(a, r);
      for (let l = 0; l < this.path.length; l++) {
        const u = this.path[l];
        if (!u.instance || !ot(u.latestValues))
          continue;
        Ge(u.latestValues) && u.updateSnapshot();
        const c = R(), h = u.measurePageBox();
        _(c, h), Ks(a, u.latestValues, u.snapshot ? u.snapshot.layoutBox : void 0, c);
      }
      return ot(this.latestValues) && Ks(a, this.latestValues), a;
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
          d && d.layout && this.animationProgress !== 1 ? (this.relativeParent = d, this.forceRelativeParentToResolveTarget(), this.relativeTarget = R(), this.relativeTargetOrigin = R(), kt(this.relativeTargetOrigin, this.layout.layoutBox, d.layout.layoutBox), _(this.relativeTarget, this.relativeTargetOrigin)) : this.relativeParent = this.relativeTarget = void 0;
        }
        if (!(!this.relativeTarget && !this.targetDelta) && (this.target || (this.target = R(), this.targetWithTransforms = R()), this.relativeTarget && this.relativeTargetOrigin && this.relativeParent && this.relativeParent.target ? (this.forceRelativeParentToResolveTarget(), jc(this.target, this.relativeTarget, this.relativeParent.target)) : this.targetDelta ? (this.resumingFrom ? this.target = this.applyTransform(this.layout.layoutBox) : _(this.target, this.layout.layoutBox), pr(this.target, this.targetDelta)) : _(this.target, this.layout.layoutBox), this.attemptToResolveRelativeTarget)) {
          this.attemptToResolveRelativeTarget = !1;
          const d = this.getClosestProjectingParent();
          d && !!d.resumingFrom == !!this.resumingFrom && !d.options.layoutScroll && d.target && this.animationProgress !== 1 ? (this.relativeParent = d, this.forceRelativeParentToResolveTarget(), this.relativeTarget = R(), this.relativeTargetOrigin = R(), kt(this.relativeTargetOrigin, this.target, d.target), _(this.relativeTarget, this.relativeTargetOrigin)) : this.relativeParent = this.relativeTarget = void 0;
        }
      }
    }
    getClosestProjectingParent() {
      if (!(!this.parent || Ge(this.parent.latestValues) || fr(this.parent.latestValues)))
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
      _(this.layoutCorrected, this.layout.layoutBox);
      const h = this.treeScale.x, d = this.treeScale.y;
      Wl(this.layoutCorrected, this.treeScale, this.path, a), r.layout && !r.target && (this.treeScale.x !== 1 || this.treeScale.y !== 1) && (r.target = r.layout.layoutBox, r.targetWithTransforms = R());
      const { target: f } = r;
      if (!f) {
        this.prevProjectionDelta && (this.createProjectionDeltas(), this.scheduleRender());
        return;
      }
      !this.projectionDelta || !this.prevProjectionDelta ? this.createProjectionDeltas() : (Is(this.prevProjectionDelta.x, this.projectionDelta.x), Is(this.prevProjectionDelta.y, this.projectionDelta.y)), Lt(this.projectionDelta, this.layoutCorrected, f, this.latestValues), (this.treeScale.x !== h || this.treeScale.y !== d || !Hs(this.projectionDelta.x, this.prevProjectionDelta.x) || !Hs(this.projectionDelta.y, this.prevProjectionDelta.y)) && (this.hasProjected = !0, this.scheduleRender(), this.notifyListeners("projectionUpdate", f));
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
      this.prevProjectionDelta = vt(), this.projectionDelta = vt(), this.projectionDeltaWithTransform = vt();
    }
    setAnimationOrigin(r, a = !1) {
      const l = this.snapshot, u = l ? l.latestValues : {}, c = { ...this.latestValues }, h = vt();
      (!this.relativeParent || !this.relativeParent.options.layoutRoot) && (this.relativeTarget = this.relativeTargetOrigin = void 0), this.attemptToResolveRelativeTarget = !a;
      const d = R(), f = l ? l.source : void 0, m = this.layout ? this.layout.source : void 0, v = f !== m, b = this.getStack(), x = !b || b.members.length <= 1, S = !!(v && !x && this.options.crossfade === !0 && !this.path.some(Au));
      this.animationProgress = 0;
      let T;
      this.mixTargetDelta = (g) => {
        const y = g / 1e3;
        Xs(h.x, r.x, y), Xs(h.y, r.y, y), this.setTargetDelta(h), this.relativeTarget && this.relativeTargetOrigin && this.layout && this.relativeParent && this.relativeParent.layout && (kt(d, this.layout.layoutBox, this.relativeParent.layout.layoutBox), Su(this.relativeTarget, this.relativeTargetOrigin, d, y), T && au(this.relativeTarget, T) && (this.isProjectionDirty = !1), T || (T = R()), _(T, this.relativeTarget)), v && (this.animationValues = c, eu(c, u, this.latestValues, y, S, x)), this.root.scheduleUpdateProjection(), this.scheduleRender(), this.animationProgress = y;
      }, this.mixTargetDelta(this.options.layoutRoot ? 1e3 : 0);
    }
    startAnimation(r) {
      this.notifyListeners("animationStart"), this.currentAnimation?.stop(), this.resumingFrom?.currentAnimation?.stop(), this.pendingAnimation && (et(this.pendingAnimation), this.pendingAnimation = void 0), this.pendingAnimation = V.update(() => {
        ee.hasAnimatedSinceResize = !0, this.motionValue || (this.motionValue = bt(0)), this.currentAnimation = Jc(this.motionValue, [0, 1e3], {
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
      this.currentAnimation && (this.mixTargetDelta && this.mixTargetDelta(uu), this.currentAnimation.stop()), this.completeAnimation();
    }
    applyTransformsToTarget() {
      const r = this.getLead();
      let { targetWithTransforms: a, target: l, layout: u, latestValues: c } = r;
      if (!(!a || !l || !u)) {
        if (this !== r && this.layout && u && Ir(this.options.animationType, this.layout.layoutBox, u.layoutBox)) {
          l = this.target || R();
          const h = F(this.layout.layoutBox.x);
          l.x.min = r.target.x.min, l.x.max = l.x.min + h;
          const d = F(this.layout.layoutBox.y);
          l.y.min = r.target.y.min, l.y.max = l.y.min + d;
        }
        _(a, l), xt(a, c), Lt(this.projectionDeltaWithTransform, this.layoutCorrected, a, c);
      }
    }
    registerSharedNode(r, a) {
      this.sharedNodes.has(r) || this.sharedNodes.set(r, new lu()), this.sharedNodes.get(r).add(a);
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
      l.z && Me("z", r, u, this.animationValues);
      for (let c = 0; c < De.length; c++)
        Me(`rotate${De[c]}`, r, u, this.animationValues), Me(`skew${De[c]}`, r, u, this.animationValues);
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
        this.needsReset = !1, r.visibility = "", r.opacity = "", r.pointerEvents = te(a?.pointerEvents) || "", r.transform = l ? l(this.latestValues, "") : "none";
        return;
      }
      const u = this.getLead();
      if (!this.projectionDelta || !this.layout || !u.target) {
        this.options.layoutId && (r.opacity = this.latestValues.opacity !== void 0 ? this.latestValues.opacity : 1, r.pointerEvents = te(a?.pointerEvents) || ""), this.hasProjected && !ot(this.latestValues) && (r.transform = l ? l({}, "") : "none", this.hasProjected = !1);
        return;
      }
      r.visibility = "";
      const c = u.animationValues || u.latestValues;
      this.applyTransformsToTarget();
      let h = cu(this.projectionDeltaWithTransform, this.treeScale, c);
      l && (h = l(c, h)), r.transform = h;
      const { x: d, y: f } = this.projectionDelta;
      r.transformOrigin = `${d.origin * 100}% ${f.origin * 100}% 0`, u.animationValues ? r.opacity = u === this ? c.opacity ?? this.latestValues.opacity ?? 1 : this.preserveOpacity ? this.latestValues.opacity : c.opacityExit : r.opacity = u === this ? c.opacity !== void 0 ? c.opacity : "" : c.opacityExit !== void 0 ? c.opacityExit : 0;
      for (const m in Nt) {
        if (c[m] === void 0)
          continue;
        const { correct: v, applyTo: b, isCSSVariable: x } = Nt[m], S = h === "none" ? c[m] : v(c[m], u);
        if (b) {
          const T = b.length;
          for (let g = 0; g < T; g++)
            r[b[g]] = S;
        } else
          x ? this.options.visualElement.renderState.vars[m] = S : r[m] = S;
      }
      this.options.layoutId && (r.pointerEvents = u === this ? te(a?.pointerEvents) || "" : "none");
    }
    clearSnapshot() {
      this.resumeFrom = this.snapshot = void 0;
    }
    // Only run on root
    resetTree() {
      this.root.nodes.forEach((r) => r.currentAnimation?.stop()), this.root.nodes.forEach(Gs), this.root.sharedNodes.clear();
    }
  };
}
function du(t) {
  t.updateLayout();
}
function fu(t) {
  const e = t.resumeFrom?.snapshot || t.snapshot;
  if (t.isLead() && t.layout && e && t.hasListeners("didUpdate")) {
    const { layoutBox: n, measuredBox: s } = t.layout, { animationType: i } = t.options, o = e.source !== t.layout.source;
    i === "size" ? U((c) => {
      const h = o ? e.measuredBox[c] : e.layoutBox[c], d = F(h);
      h.min = n[c].min, h.max = h.min + d;
    }) : Ir(i, e.layoutBox, n) && U((c) => {
      const h = o ? e.measuredBox[c] : e.layoutBox[c], d = F(n[c]);
      h.max = h.min + d, t.relativeTarget && !t.currentAnimation && (t.isProjectionDirty = !0, t.relativeTarget[c].max = t.relativeTarget[c].min + d);
    });
    const r = vt();
    Lt(r, n, e.layoutBox);
    const a = vt();
    o ? Lt(a, t.applyTransform(s, !0), e.measuredBox) : Lt(a, n, e.layoutBox);
    const l = !Lr(r);
    let u = !1;
    if (!t.resumeFrom) {
      const c = t.getClosestProjectingParent();
      if (c && !c.resumeFrom) {
        const { snapshot: h, layout: d } = c;
        if (h && d) {
          const f = R();
          kt(f, e.layoutBox, h.layoutBox);
          const m = R();
          kt(m, n, d.layoutBox), kr(f, m) || (u = !0), c.options.layoutRoot && (t.relativeTarget = m, t.relativeTargetOrigin = f, t.relativeParent = c);
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
function pu(t) {
  t.parent && (t.isProjecting() || (t.isProjectionDirty = t.parent.isProjectionDirty), t.isSharedProjectionDirty || (t.isSharedProjectionDirty = !!(t.isProjectionDirty || t.parent.isProjectionDirty || t.parent.isSharedProjectionDirty)), t.isTransformDirty || (t.isTransformDirty = t.parent.isTransformDirty));
}
function mu(t) {
  t.isProjectionDirty = t.isSharedProjectionDirty = t.isTransformDirty = !1;
}
function yu(t) {
  t.clearSnapshot();
}
function Gs(t) {
  t.clearMeasurements();
}
function zs(t) {
  t.isLayoutDirty = !1;
}
function gu(t) {
  const { visualElement: e } = t.options;
  e && e.getProps().onBeforeLayoutMeasure && e.notify("BeforeLayoutMeasure"), t.resetTransform();
}
function Ys(t) {
  t.finishAnimation(), t.targetDelta = t.relativeTarget = t.target = void 0, t.isProjectionDirty = !0;
}
function xu(t) {
  t.resolveTargetDelta();
}
function vu(t) {
  t.calcProjection();
}
function Tu(t) {
  t.resetSkewAndRotation();
}
function bu(t) {
  t.removeLeadSnapshot();
}
function Xs(t, e, n) {
  t.translate = D(e.translate, 0, n), t.scale = D(e.scale, 1, n), t.origin = e.origin, t.originPoint = e.originPoint;
}
function Js(t, e, n, s) {
  t.min = D(e.min, n.min, s), t.max = D(e.max, n.max, s);
}
function Su(t, e, n, s) {
  Js(t.x, e.x, n.x, s), Js(t.y, e.y, n.y, s);
}
function Au(t) {
  return t.animationValues && t.animationValues.opacityExit !== void 0;
}
const Pu = {
  duration: 0.45,
  ease: [0.4, 0, 0.1, 1]
}, Qs = (t) => typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().includes(t), qs = Qs("applewebkit/") && !Qs("chrome/") ? Math.round : H;
function Zs(t) {
  t.min = qs(t.min), t.max = qs(t.max);
}
function wu(t) {
  Zs(t.x), Zs(t.y);
}
function Ir(t, e, n) {
  return t === "position" || t === "preserve-aspect" && !Ec(Ws(e), Ws(n), 0.2);
}
function Cu(t) {
  return t !== t.root && t.scroll?.wasRoot;
}
const Vu = Or({
  attachResizeListener: (t, e) => Kt(t, "resize", e),
  measureScroll: () => ({
    x: document.documentElement.scrollLeft || document.body.scrollLeft,
    y: document.documentElement.scrollTop || document.body.scrollTop
  }),
  checkIsScrollRoot: () => !0
}), Re = {
  current: void 0
}, Fr = Or({
  measureScroll: (t) => ({
    x: t.scrollLeft,
    y: t.scrollTop
  }),
  defaultParent: () => {
    if (!Re.current) {
      const t = new Vu({});
      t.mount(window), t.setOptions({ layoutScroll: !0 }), Re.current = t;
    }
    return Re.current;
  },
  resetTransform: (t, e) => {
    t.style.transform = e !== void 0 ? e : "none";
  },
  checkIsScrollRoot: (t) => window.getComputedStyle(t).position === "fixed"
}), Du = {
  pan: {
    Feature: Gc
  },
  drag: {
    Feature: Hc,
    ProjectionNode: Fr,
    MeasureLayout: Rr
  }
};
function ti(t, e, n) {
  const { props: s } = t;
  t.animationState && s.whileHover && t.animationState.setActive("whileHover", n === "Start");
  const i = "onHover" + n, o = s[i];
  o && V.postRender(() => o(e, Wt(e)));
}
class Mu extends st {
  mount() {
    const { current: e } = this.node;
    e && (this.unmount = Ja(e, (n, s) => (ti(this.node, s, "Start"), (i) => ti(this.node, i, "End"))));
  }
  unmount() {
  }
}
class Ru extends st {
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
    this.unmount = $t(Kt(this.node.current, "focus", () => this.onFocus()), Kt(this.node.current, "blur", () => this.onBlur()));
  }
  unmount() {
  }
}
function ei(t, e, n) {
  const { props: s } = t;
  if (t.current instanceof HTMLButtonElement && t.current.disabled)
    return;
  t.animationState && s.whileTap && t.animationState.setActive("whileTap", n === "Start");
  const i = "onTap" + (n === "End" ? "" : n), o = s[i];
  o && V.postRender(() => o(e, Wt(e)));
}
class Eu extends st {
  mount() {
    const { current: e } = this.node;
    e && (this.unmount = tl(e, (n, s) => (ei(this.node, s, "Start"), (i, { success: o }) => ei(this.node, i, o ? "End" : "Cancel")), { useGlobalTarget: this.node.props.globalTapTarget }));
  }
  unmount() {
  }
}
const Ze = /* @__PURE__ */ new WeakMap(), Ee = /* @__PURE__ */ new WeakMap(), ju = (t) => {
  const e = Ze.get(t.target);
  e && e(t);
}, Lu = (t) => {
  t.forEach(ju);
};
function ku({ root: t, ...e }) {
  const n = t || document;
  Ee.has(n) || Ee.set(n, {});
  const s = Ee.get(n), i = JSON.stringify(e);
  return s[i] || (s[i] = new IntersectionObserver(Lu, { root: t, ...e })), s[i];
}
function Bu(t, e, n) {
  const s = ku(e);
  return Ze.set(t, n), s.observe(t), () => {
    Ze.delete(t), s.unobserve(t);
  };
}
const Ou = {
  some: 0,
  all: 1
};
class Iu extends st {
  constructor() {
    super(...arguments), this.hasEnteredView = !1, this.isInView = !1;
  }
  startObserver() {
    this.unmount();
    const { viewport: e = {} } = this.node.getProps(), { root: n, margin: s, amount: i = "some", once: o } = e, r = {
      root: n ? n.current : void 0,
      rootMargin: s,
      threshold: typeof i == "number" ? i : Ou[i]
    }, a = (l) => {
      const { isIntersecting: u } = l;
      if (this.isInView === u || (this.isInView = u, o && !u && this.hasEnteredView))
        return;
      u && (this.hasEnteredView = !0), this.node.animationState && this.node.animationState.setActive("whileInView", u);
      const { onViewportEnter: c, onViewportLeave: h } = this.node.getProps(), d = u ? c : h;
      d && d(l);
    };
    return Bu(this.node.current, r, a);
  }
  mount() {
    this.startObserver();
  }
  update() {
    if (typeof IntersectionObserver > "u")
      return;
    const { props: e, prevProps: n } = this.node;
    ["amount", "margin", "root"].some(Fu(e, n)) && this.startObserver();
  }
  unmount() {
  }
}
function Fu({ viewport: t = {} }, { viewport: e = {} } = {}) {
  return (n) => t[n] !== e[n];
}
const Nu = {
  inView: {
    Feature: Iu
  },
  tap: {
    Feature: Eu
  },
  focus: {
    Feature: Ru
  },
  hover: {
    Feature: Mu
  }
}, Ku = {
  layout: {
    ProjectionNode: Fr,
    MeasureLayout: Rr
  }
}, $u = {
  ...wc,
  ...Nu,
  ...Du,
  ...Ku
}, N = /* @__PURE__ */ $l($u, tc), _u = 620, Uu = 1, ni = [
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
], Wu = {
  BTN: "#f1c40f",
  SB: "#e74c3c",
  BB: "#e74c3c",
  UTG: "#3498db",
  HJ: "#9b59b6",
  CO: "#27ae60"
}, Nr = "/", si = {
  "♥": { symbol: "SH", color: "red" },
  "♦": { symbol: "SD", color: "red" },
  "♣": { symbol: "SC", color: "black" },
  "♠": { symbol: "SS", color: "black" }
};
function Kr(t) {
  if (!t) return null;
  const e = si[t.suit] || si["♠"];
  return { rankSymbol: `V${t.rank === "10" ? "T" : t.rank}`, suitSymbol: e.symbol, color: e.color };
}
function Hu(t) {
  return `${Nr}assets/positions/${t}.svg`;
}
function Gu() {
  return `${Nr}assets/decorative/dealer-button.svg`;
}
function $r({ rankSymbol: t, suitSymbol: e, color: n }) {
  return /* @__PURE__ */ p.jsxs("g", { style: { color: n }, children: [
    /* @__PURE__ */ p.jsx("rect", { width: "239", height: "335", x: "-119.5", y: "-167.5", rx: "12", fill: "white", stroke: "#999" }),
    /* @__PURE__ */ p.jsx("use", { href: `#${t}`, width: "32", height: "32", x: "-114.4", y: "-156" }),
    /* @__PURE__ */ p.jsx("use", { href: `#${e}`, width: "26.769", height: "26.769", x: "-111.784", y: "-119" }),
    /* @__PURE__ */ p.jsx("use", { href: `#${e}`, width: "70", height: "70", x: "-35", y: "-35" }),
    /* @__PURE__ */ p.jsxs("g", { transform: "rotate(180)", children: [
      /* @__PURE__ */ p.jsx("use", { href: `#${t}`, width: "32", height: "32", x: "-114.4", y: "-156" }),
      /* @__PURE__ */ p.jsx("use", { href: `#${e}`, width: "26.769", height: "26.769", x: "-111.784", y: "-119" })
    ] })
  ] });
}
function _r() {
  return /* @__PURE__ */ p.jsxs("g", { children: [
    /* @__PURE__ */ p.jsx("rect", { width: "239", height: "335", x: "-119.5", y: "-167.5", rx: "12", fill: "white", stroke: "black" }),
    /* @__PURE__ */ p.jsx("rect", { width: "216", height: "312", x: "-108", y: "-156", rx: "8", fill: "#b22222" }),
    /* @__PURE__ */ p.jsx("rect", { width: "196", height: "292", x: "-98", y: "-146", rx: "4", fill: "none", stroke: "white", strokeWidth: "2" })
  ] });
}
function zu({ card: t, dealOrder: e = 0, isFolded: n = !1, isHidden: s = !0 }) {
  const i = e * 0.15, o = s ? null : Kr(t);
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
        delay: i,
        duration: 0.4,
        type: "spring",
        stiffness: 200
      },
      children: /* @__PURE__ */ p.jsx(
        "svg",
        {
          viewBox: "-120 -168 240 336",
          preserveAspectRatio: "none",
          className: "card-image",
          children: o ? /* @__PURE__ */ p.jsx($r, { ...o }) : /* @__PURE__ */ p.jsx(_r, {})
        }
      )
    }
  );
}
function Yu({ card: t, dealOrder: e = 0 }) {
  const n = e * 0.15, s = Kr(t);
  return /* @__PURE__ */ p.jsx(
    N.div,
    {
      className: "community-card-wrapper",
      initial: { opacity: 0, y: -50, rotateY: 180 },
      animate: { opacity: 1, y: 0, rotateY: 0 },
      transition: { delay: n, duration: 0.4, type: "spring" },
      children: /* @__PURE__ */ p.jsx(
        "svg",
        {
          viewBox: "-120 -168 240 336",
          preserveAspectRatio: "none",
          className: "community-card-image",
          children: s ? /* @__PURE__ */ p.jsx($r, { ...s }) : /* @__PURE__ */ p.jsx(_r, {})
        }
      )
    }
  );
}
function Xu({ action: t, delay: e }) {
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
function Ju({ amount: t, layoutPosition: e }) {
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
function Qu({ player: t, step: e, cardsDealt: n, yourCards: s, foldedPlayers: i, calledPlayers: o, checkedPlayers: r, raisedPlayers: a, blindPlayers: l, phase: u, playerChips: c, latestBet: h }) {
  const [d, f] = je(!1), m = n && e >= 2, v = i.includes(t.position), b = o.includes(t.position), x = r?.includes(t.position), S = a?.includes(t.position), T = l?.[t.position] && u === "preflop", g = t.isYou ? s : [null, null], y = Wu[t.position], w = Hu(t.position), C = c?.[t.position] ?? t.chips, P = h?.[t.position]?.amount, E = t.layoutPosition === "top", L = t.layoutPosition === "bottom", z = t.layoutPosition === "left", Ht = E ? { top: "100%", left: "50%", transform: "translateX(-50%)" } : L ? { bottom: "100%", left: "50%", transform: "translateX(-50%)" } : z ? { left: "100%", top: "50%", transform: "translateY(-50%)" } : { right: "100%", top: "50%", transform: "translateY(-50%)" };
  let J = null;
  return v ? J = "FOLD" : S ? J = "RAISE" : b ? J = "CALL" : x ? J = "CHECK" : T && (J = t.position === "SB" ? "SB $50" : "BB $100"), /* @__PURE__ */ p.jsxs(
    N.div,
    {
      className: `player ${t.isYou ? "you" : ""} ${t.layoutPosition || ""}`,
      style: t.style,
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { delay: t.id * 0.1 },
      children: [
        /* @__PURE__ */ p.jsx("div", { className: "position-icon", style: d ? { background: y } : {}, children: d ? /* @__PURE__ */ p.jsx("span", { style: { color: "#fff", fontWeight: "bold", fontSize: "14px" }, children: t.position }) : /* @__PURE__ */ p.jsx(
          "img",
          {
            src: w,
            alt: t.position,
            onError: () => f(!0)
          }
        ) }),
        /* @__PURE__ */ p.jsxs("div", { className: "player-info", children: [
          /* @__PURE__ */ p.jsx("div", { className: "player-name", style: t.isYou ? { color: y } : {}, children: t.isYou ? "YOU" : t.position }),
          /* @__PURE__ */ p.jsxs(
            N.div,
            {
              className: "player-chips",
              initial: { scale: 1.2, color: "#e74c3c" },
              animate: { scale: 1, color: "#f1c40f" },
              transition: { duration: 0.3 },
              children: [
                "$",
                C.toLocaleString()
              ]
            },
            C
          )
        ] }),
        /* @__PURE__ */ p.jsx("div", { className: "player-cards", style: { position: "absolute", ...Ht }, children: m && g.map((Gt, zt) => /* @__PURE__ */ p.jsx(
          zu,
          {
            card: Gt,
            dealOrder: t.dealOrder,
            isFolded: v,
            isHidden: !t.isYou
          },
          zt
        )) }),
        /* @__PURE__ */ p.jsx(re, { children: J && /* @__PURE__ */ p.jsx(Xu, { action: J, delay: 0 }) }),
        /* @__PURE__ */ p.jsx(re, { children: P > 0 && /* @__PURE__ */ p.jsx(
          Ju,
          {
            amount: P,
            layoutPosition: t.layoutPosition
          },
          `chip-${e}`
        ) })
      ]
    }
  );
}
function qu({ amount: t }) {
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
function Zu({ currentPhase: t }) {
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
function th({ step: t, totalSteps: e }) {
  return /* @__PURE__ */ p.jsx("div", { className: "step-indicator", children: [...Array(e)].map((n, s) => /* @__PURE__ */ p.jsx(
    "div",
    {
      className: `step-dot ${s === t ? "active" : ""} ${s < t ? "completed" : ""}`
    },
    s
  )) });
}
function eh({ gameState: t }) {
  const e = _u, n = Uu, s = t.getState(), {
    step: i,
    totalSteps: o,
    phase: r,
    pot: a,
    communityCards: l,
    yourCards: u
  } = s, c = [], h = {}, d = {};
  let f = 0;
  for (let g = 0; g <= i; g++) {
    const y = t.scenario.steps[g];
    (y?.type === "flop" || y?.type === "turn" || y?.type === "river") && (f = g);
  }
  for (let g = 0; g <= i; g++) {
    const y = t.scenario.steps[g];
    y?.type === "action" && y.action === "FOLD" && c.push(y.player), y?.type === "blinds" && (d.SB = "SB", d.BB = "BB"), g >= f && y?.type === "action" && y.action !== "FOLD" && (h[y.player] = y.action);
  }
  const m = Object.entries(h).filter(([g, y]) => y === "CALL").map(([g]) => g), v = Object.entries(h).filter(([g, y]) => y === "CHECK").map(([g]) => g), b = Object.entries(h).filter(([g, y]) => y === "RAISE").map(([g]) => g), x = {}, S = {};
  ni.forEach((g) => {
    x[g.position] = g.chips;
  });
  for (let g = 0; g <= i; g++) {
    const y = t.scenario.steps[g];
    y?.type === "blinds" && y.bets && Object.entries(y.bets).forEach(([w, C]) => {
      x[w] -= C, g === i && (S[w] = { amount: C, stepIndex: g });
    }), y?.type === "action" && y.bet > 0 && (x[y.player] -= y.bet, g === i && (S[y.player] = { amount: y.bet, stepIndex: g }));
  }
  const T = {
    "--scale": n,
    "--table-width": `${e}px`,
    "--table-height": `${e * 0.625}px`
  };
  return /* @__PURE__ */ p.jsxs("div", { className: "container embed-mode", style: T, children: [
    /* @__PURE__ */ p.jsx(Zu, { currentPhase: r }),
    /* @__PURE__ */ p.jsxs("div", { className: "poker-table", children: [
      /* @__PURE__ */ p.jsx("div", { className: "table-rail" }),
      /* @__PURE__ */ p.jsx("div", { className: "table-felt" }),
      i >= 1 && ni.map((g) => /* @__PURE__ */ p.jsx(
        Qu,
        {
          player: g,
          step: i,
          cardsDealt: i >= 2,
          yourCards: u,
          foldedPlayers: c,
          calledPlayers: m,
          checkedPlayers: v,
          raisedPlayers: b,
          blindPlayers: d,
          phase: r,
          playerChips: x,
          latestBet: S
        },
        g.id
      )),
      i >= 1 && /* @__PURE__ */ p.jsx(
        N.div,
        {
          className: "dealer-button",
          style: { top: "34%", right: "15%" },
          initial: { opacity: 0, scale: 0 },
          animate: { opacity: 1, scale: 1 },
          transition: { delay: 0.6 },
          children: /* @__PURE__ */ p.jsx("img", { src: Gu(), alt: "Dealer", className: "dealer-button-img" })
        }
      ),
      i >= 2 && /* @__PURE__ */ p.jsx(qu, { amount: a }),
      /* @__PURE__ */ p.jsx("div", { className: "community-cards", children: l.map((g, y) => /* @__PURE__ */ p.jsx(Yu, { card: g, dealOrder: y }, y)) }),
      /* @__PURE__ */ p.jsx(th, { step: i, totalSteps: o })
    ] })
  ] });
}
const nh = 1.27, sh = {
  S: { symbol: "SS", color: "black" },
  H: { symbol: "SH", color: "red" },
  D: { symbol: "SD", color: "red" },
  C: { symbol: "SC", color: "black" }
}, ih = ["S", "H", "D", "C"], rh = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K"], oh = ih.flatMap(
  (t, e) => rh.map((n, s) => ({
    rank: n,
    suit: t,
    suitIndex: e,
    rankIndex: s,
    id: `${n}${t}`
  }))
);
function ah(t, e, n, s = 1) {
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
function lh(t, e, n) {
  return t === 6 ? n * 0.05 : 0;
}
function ch({ rankSymbol: t, suitSymbol: e, color: n }) {
  return /* @__PURE__ */ p.jsxs("g", { style: { color: n }, children: [
    /* @__PURE__ */ p.jsx("rect", { width: "239", height: "335", x: "-119.5", y: "-167.5", rx: "12", fill: "white", stroke: "#999" }),
    /* @__PURE__ */ p.jsx("use", { href: `#${t}`, width: "32", height: "32", x: "-114.4", y: "-156" }),
    /* @__PURE__ */ p.jsx("use", { href: `#${e}`, width: "26.769", height: "26.769", x: "-111.784", y: "-119" }),
    /* @__PURE__ */ p.jsx("use", { href: `#${e}`, width: "70", height: "70", x: "-35", y: "-35" }),
    /* @__PURE__ */ p.jsxs("g", { transform: "rotate(180)", children: [
      /* @__PURE__ */ p.jsx("use", { href: `#${t}`, width: "32", height: "32", x: "-114.4", y: "-156" }),
      /* @__PURE__ */ p.jsx("use", { href: `#${e}`, width: "26.769", height: "26.769", x: "-111.784", y: "-119" })
    ] })
  ] });
}
function uh({ rank: t, suit: e, suitIndex: n, rankIndex: s, step: i, scale: o }) {
  const r = ah(i, n, s, o), a = lh(i, n, s), l = sh[e], u = `V${t}`, c = l.symbol, h = l.color, d = 50, f = 70, m = d * o, v = f * o, b = i === 7, x = r.waveOrder || 0, S = 0.15, T = 0.25, g = x * S;
  return /* @__PURE__ */ p.jsx(
    N.div,
    {
      style: {
        position: "absolute",
        left: "50%",
        top: "50%",
        width: m,
        height: v,
        marginLeft: -m / 2,
        marginTop: -v / 2,
        borderRadius: 3 * o,
        overflow: "hidden",
        boxShadow: `${1 * o}px ${1 * o}px ${4 * o}px rgba(0,0,0,0.3)`,
        backgroundColor: "white"
      },
      animate: {
        x: r.x,
        y: r.y,
        opacity: r.opacity,
        filter: b ? [
          "grayscale(100%) brightness(0.5)",
          // 시작: 어둡게
          "grayscale(0%) brightness(1.3)",
          // 켜짐
          "grayscale(100%) brightness(0.5)"
          // 다시 어둡게
        ] : r.filter,
        scale: b ? [1, 1.1, 1] : 1
      },
      transition: b ? {
        delay: g,
        duration: T,
        times: [0, 0.4, 1],
        ease: "easeOut"
      } : {
        delay: a,
        duration: 0.4,
        type: "spring",
        stiffness: 100,
        damping: 15
      },
      children: /* @__PURE__ */ p.jsx(
        "svg",
        {
          viewBox: "-120 -168 240 336",
          preserveAspectRatio: "none",
          style: { width: "100%", height: "100%" },
          children: /* @__PURE__ */ p.jsx(ch, { rankSymbol: u, suitSymbol: c, color: h })
        }
      )
    }
  );
}
function hh({ step: t = 0 }) {
  const e = nh, n = 715 * e, s = 312 * e;
  return /* @__PURE__ */ p.jsx(
    "div",
    {
      style: {
        position: "relative",
        width: n,
        height: s
      },
      children: oh.map((i) => /* @__PURE__ */ p.jsx(
        uh,
        {
          rank: i.rank,
          suit: i.suit,
          suitIndex: i.suitIndex,
          rankIndex: i.rankIndex,
          step: t,
          scale: e
        },
        i.id
      ))
    }
  );
}
const dh = 1.3, fh = {
  s: { symbol: "SS", color: "black" },
  h: { symbol: "SH", color: "red" },
  d: { symbol: "SD", color: "red" },
  c: { symbol: "SC", color: "black" }
}, ct = [
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
], ph = ct.reduce((t, e) => t + e.examples.length, 0);
function mh(t) {
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
function yh(t) {
  const e = t[0], n = t[1];
  return { rank: e, suit: n };
}
function gh({ cardStr: t, index: e, scale: n, shouldAnimate: s = !0 }) {
  const { rank: i, suit: o } = yh(t), r = fh[o], a = `V${i}`, l = r.symbol, u = r.color, c = 50 * n, h = 70 * n;
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
        width: c,
        height: h,
        borderRadius: 4 * n,
        overflow: "hidden",
        boxShadow: "1px 1px 4px rgba(0,0,0,0.3)",
        backgroundColor: "white",
        flexShrink: 0
      },
      children: /* @__PURE__ */ p.jsx(
        "svg",
        {
          viewBox: "-120 -168 240 336",
          preserveAspectRatio: "none",
          style: { width: "100%", height: "100%" },
          children: /* @__PURE__ */ p.jsxs("g", { style: { color: u }, children: [
            /* @__PURE__ */ p.jsx("rect", { width: "239", height: "335", x: "-119.5", y: "-167.5", rx: "12", fill: "white", stroke: "#999" }),
            /* @__PURE__ */ p.jsx("use", { href: `#${a}`, width: "32", height: "32", x: "-114.4", y: "-156" }),
            /* @__PURE__ */ p.jsx("use", { href: `#${l}`, width: "26.769", height: "26.769", x: "-111.784", y: "-119" }),
            /* @__PURE__ */ p.jsx("use", { href: `#${l}`, width: "70", height: "70", x: "-35", y: "-35" }),
            /* @__PURE__ */ p.jsxs("g", { transform: "rotate(180)", children: [
              /* @__PURE__ */ p.jsx("use", { href: `#${a}`, width: "32", height: "32", x: "-114.4", y: "-156" }),
              /* @__PURE__ */ p.jsx("use", { href: `#${l}`, width: "26.769", height: "26.769", x: "-111.784", y: "-119" })
            ] })
          ] })
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
function vh({ example: t, exampleIdx: e, handName: n, scale: s, isNew: i }) {
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
      children: t.cards.map((o, r) => /* @__PURE__ */ p.jsx(
        gh,
        {
          cardStr: o,
          index: r,
          scale: s * 0.85,
          shouldAnimate: i
        },
        `${n}-${e}-${o}`
      ))
    }
  );
}
function Th({ hand: t, exampleIndex: e, scale: n }) {
  if (e < 0) return null;
  const s = t.examples.slice(0, e + 1);
  return /* @__PURE__ */ p.jsx("div", { style: {
    display: "flex",
    flexDirection: "column",
    gap: 18 * n,
    // 왼쪽 테이블 행간과 맞춤
    alignItems: "flex-start"
  }, children: s.map((i, o) => /* @__PURE__ */ p.jsx(
    vh,
    {
      example: i,
      exampleIdx: o,
      handName: t.name,
      scale: n,
      isNew: o === e
    },
    `${t.name}-row-${o}`
  )) });
}
function bh({ step: t = 0 }) {
  const e = dh, { handIndex: n, exampleIndex: s } = mh(t), i = ct[n];
  return /* @__PURE__ */ p.jsxs(
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
          ct.map((o, r) => /* @__PURE__ */ p.jsx(
            xh,
            {
              hand: o,
              isActive: r === n,
              isPassed: r < n,
              scale: e
            },
            o.name
          ))
        ] }),
        /* @__PURE__ */ p.jsxs("div", { style: {
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          minWidth: 350 * e
        }, children: [
          /* @__PURE__ */ p.jsx(re, { mode: "wait", children: /* @__PURE__ */ p.jsx(
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
              children: i.name
            },
            `title-${i.name}`
          ) }),
          /* @__PURE__ */ p.jsx("div", { style: {
            fontSize: 10 * e,
            color: "#7f8c8d",
            marginBottom: 8 * e
          }, children: " " }),
          /* @__PURE__ */ p.jsx(re, { mode: "wait", children: t >= 0 && /* @__PURE__ */ p.jsx(
            N.div,
            {
              initial: { opacity: 0, x: 20 },
              animate: { opacity: 1, x: 0 },
              exit: { opacity: 0, x: -20 },
              transition: { duration: 0.3 },
              children: /* @__PURE__ */ p.jsx(
                Th,
                {
                  hand: i,
                  exampleIndex: s,
                  scale: e
                }
              )
            },
            `cards-${n}`
          ) })
        ] })
      ]
    }
  );
}
const Sh = ph;
class le {
  constructor(e, n = {}) {
    this.container = e, this.step = 0, this.totalSteps = 9, this.root = nn(e), this.listeners = [], this._render();
  }
  _render() {
    this.root.render(/* @__PURE__ */ p.jsx(hh, { step: this.step }));
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
    return new le(e, n);
  }
}
class ce {
  constructor(e, n = {}) {
    this.container = e, this.step = 0, this.totalSteps = Sh, this.root = nn(e), this.listeners = [], this._render();
  }
  _render() {
    this.root.render(/* @__PURE__ */ p.jsx(bh, { step: this.step }));
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
    return new ce(e, n);
  }
}
class ue {
  constructor(e, n = {}) {
    this.container = e, this.gameState = new _n(n.scenario || "tutorial"), this.root = nn(e), this.unsubscribe = this.gameState.subscribe(() => {
      this._render();
    }), this._render();
  }
  _render() {
    this.root.render(/* @__PURE__ */ p.jsx(eh, { gameState: this.gameState }));
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
    return _n.getScenarios();
  }
  // Static mount for convenience
  static mount(e, n = {}) {
    return new ue(e, n);
  }
}
const Vh = {
  HoldemEngine: ue,
  DeckEngine: le,
  HandRankingEngine: ce,
  // Convenience shortcuts
  mount: ue.mount,
  mountDeck: le.mount,
  mountHandRanking: ce.mount
};
export {
  Vh as default
};
