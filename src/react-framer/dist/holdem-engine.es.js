import * as ie from "react";
import $r, { createContext as St, useRef as J, useLayoutEffect as _r, useEffect as Ye, useId as ze, useContext as B, useInsertionEffect as Qs, useMemo as ut, useCallback as ti, Children as Wr, isValidElement as Kr, useState as Ae, Fragment as ei, createElement as Hr, forwardRef as Gr, Component as Yr } from "react";
import { createRoot as ni } from "react-dom/client";
var ce = { exports: {} }, At = {};
var kn;
function zr() {
  if (kn) return At;
  kn = 1;
  var t = $r, e = Symbol.for("react.element"), n = Symbol.for("react.fragment"), s = Object.prototype.hasOwnProperty, i = t.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, o = { key: !0, ref: !0, __self: !0, __source: !0 };
  function r(a, l, u) {
    var c, h = {}, f = null, d = null;
    u !== void 0 && (f = "" + u), l.key !== void 0 && (f = "" + l.key), l.ref !== void 0 && (d = l.ref);
    for (c in l) s.call(l, c) && !o.hasOwnProperty(c) && (h[c] = l[c]);
    if (a && a.defaultProps) for (c in l = a.defaultProps, l) h[c] === void 0 && (h[c] = l[c]);
    return { $$typeof: e, type: a, key: f, ref: d, props: h, _owner: i.current };
  }
  return At.Fragment = n, At.jsx = r, At.jsxs = r, At;
}
var jn;
function Xr() {
  return jn || (jn = 1, ce.exports = zr()), ce.exports;
}
var m = Xr();
const Bn = {
  c: { symbol: "♣", color: "black" },
  d: { symbol: "♦", color: "red" },
  h: { symbol: "♥", color: "red" },
  s: { symbol: "♠", color: "black" },
  "?": { symbol: "?", color: "gray" }
}, qr = {
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
function Zr(t) {
  if (!t || t.length < 2) return null;
  const e = qr[t[0]] || t[0], n = Bn[t[1]] || Bn["?"];
  return {
    rank: e,
    suit: n.symbol,
    color: n.color
  };
}
function On(t) {
  const e = [];
  for (let n = 0; n < t.length; n += 2) {
    const s = Zr(t.slice(n, n + 2));
    s && e.push(s);
  }
  return e;
}
const Jr = {
  f: "FOLD",
  cc: "CALL",
  cbr: "RAISE",
  sm: "SHOW"
};
function Qr(t) {
  const e = t.trim().split(/\s+/);
  if (e[0] === "d") {
    if (e[1] === "dh") {
      const n = e[2], s = On(e[3]);
      return { type: "deal", player: n, cards: s };
    } else if (e[1] === "db")
      return { type: "board", cards: On(e[2]) };
  } else if (e[0].startsWith("p")) {
    const n = parseInt(e[0].slice(1)), s = Jr[e[1]] || e[1].toUpperCase(), i = e[2] ? parseInt(e[2]) : null;
    return { type: "action", player: n, action: s, amount: i };
  }
  return null;
}
const to = ["BTN", "SB", "BB", "UTG", "HJ", "CO"];
function eo(t) {
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
        const [c, ...h] = u.split("="), f = c.trim();
        let d = h.join("=").trim();
        d = d.replace(/^["'\[]|["'\]]$/g, ""), f === "variant" ? n.variant = d : f === "blinds_or_straddles" ? n.blinds = d.split(",").map((p) => parseInt(p.trim())) : f === "starting_stacks" ? n.startingStacks = d.split(",").map((p) => parseInt(p.trim())) : f === "actions" && (s = !0);
      }
      if (s && u.startsWith('"')) {
        const c = u.replace(/^"|",?$/g, ""), h = Qr(c);
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
      const u = to[(l.player - 1) % 6] || `P${l.player}`;
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
const no = `
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
`, so = eo(no), ft = {
  phh: so,
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
      { type: "blinds", pot: 150, description: "SB $50 + BB $100" },
      { type: "action", player: "UTG", action: "FOLD", pot: 150, description: "UTG 폴드" },
      { type: "action", player: "HJ", action: "CALL", pot: 250, description: "HJ $100 콜" },
      { type: "action", player: "CO", action: "FOLD", pot: 250, description: "CO 폴드" },
      { type: "action", player: "BTN", action: "FOLD", pot: 250, description: "BTN 폴드" },
      { type: "action", player: "SB", action: "CALL", pot: 300, description: "SB $50 콜" },
      { type: "action", player: "BB", action: "CHECK", pot: 300, description: "BB 체크" },
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
class Fn {
  constructor(e = "tutorial") {
    this.scenarioKey = e, this.scenario = ft[e] || ft.tutorial, this.step = 0, this.listeners = /* @__PURE__ */ new Set();
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
    ft[e] && (this.scenarioKey = e, this.scenario = ft[e], this.step = 0, this._notify());
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
    return Object.keys(ft).map((e) => ({
      key: e,
      name: ft[e].name
    }));
  }
}
const Xe = St({});
function qe(t) {
  const e = J(null);
  return e.current === null && (e.current = t()), e.current;
}
const Ze = typeof window < "u", si = Ze ? _r : Ye, re = /* @__PURE__ */ St(null);
function Je(t, e) {
  t.indexOf(e) === -1 && t.push(e);
}
function Qe(t, e) {
  const n = t.indexOf(e);
  n > -1 && t.splice(n, 1);
}
const z = (t, e, n) => n > e ? e : n < t ? t : n;
let tn = () => {
};
const X = {}, ii = (t) => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(t);
function ri(t) {
  return typeof t == "object" && t !== null;
}
const oi = (t) => /^0[^.\s]+$/u.test(t);
// @__NO_SIDE_EFFECTS__
function en(t) {
  let e;
  return () => (e === void 0 && (e = t()), e);
}
const K = /* @__NO_SIDE_EFFECTS__ */ (t) => t, io = (t, e) => (n) => e(t(n)), Nt = (...t) => t.reduce(io), kt = /* @__NO_SIDE_EFFECTS__ */ (t, e, n) => {
  const s = e - t;
  return s === 0 ? 1 : (n - t) / s;
};
class nn {
  constructor() {
    this.subscriptions = [];
  }
  add(e) {
    return Je(this.subscriptions, e), () => Qe(this.subscriptions, e);
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
const G = /* @__NO_SIDE_EFFECTS__ */ (t) => t * 1e3, W = /* @__NO_SIDE_EFFECTS__ */ (t) => t / 1e3;
function ai(t, e) {
  return e ? t * (1e3 / e) : 0;
}
const li = (t, e, n) => (((1 - 3 * n + 3 * e) * t + (3 * n - 6 * e)) * t + 3 * e) * t, ro = 1e-7, oo = 12;
function ao(t, e, n, s, i) {
  let o, r, a = 0;
  do
    r = e + (n - e) / 2, o = li(r, s, i) - t, o > 0 ? n = r : e = r;
  while (Math.abs(o) > ro && ++a < oo);
  return r;
}
function Ut(t, e, n, s) {
  if (t === e && n === s)
    return K;
  const i = (o) => ao(o, 0, 1, t, n);
  return (o) => o === 0 || o === 1 ? o : li(i(o), e, s);
}
const ci = (t) => (e) => e <= 0.5 ? t(2 * e) / 2 : (2 - t(2 * (1 - e))) / 2, ui = (t) => (e) => 1 - t(1 - e), hi = /* @__PURE__ */ Ut(0.33, 1.53, 0.69, 0.99), sn = /* @__PURE__ */ ui(hi), fi = /* @__PURE__ */ ci(sn), di = (t) => (t *= 2) < 1 ? 0.5 * sn(t) : 0.5 * (2 - Math.pow(2, -10 * (t - 1))), rn = (t) => 1 - Math.sin(Math.acos(t)), pi = ui(rn), mi = ci(rn), lo = /* @__PURE__ */ Ut(0.42, 0, 1, 1), co = /* @__PURE__ */ Ut(0, 0, 0.58, 1), yi = /* @__PURE__ */ Ut(0.42, 0, 0.58, 1), uo = (t) => Array.isArray(t) && typeof t[0] != "number", gi = (t) => Array.isArray(t) && typeof t[0] == "number", ho = {
  linear: K,
  easeIn: lo,
  easeInOut: yi,
  easeOut: co,
  circIn: rn,
  circInOut: mi,
  circOut: pi,
  backIn: sn,
  backInOut: fi,
  backOut: hi,
  anticipate: di
}, fo = (t) => typeof t == "string", In = (t) => {
  if (gi(t)) {
    tn(t.length === 4);
    const [e, n, s, i] = t;
    return Ut(e, n, s, i);
  } else if (fo(t))
    return ho[t];
  return t;
}, Wt = [
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
function po(t, e) {
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
    schedule: (c, h = !1, f = !1) => {
      const p = f && i ? n : s;
      return h && r.add(c), p.has(c) || p.add(c), c;
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
const mo = 40;
function vi(t, e) {
  let n = !1, s = !0;
  const i = {
    delta: 0,
    timestamp: 0,
    isProcessing: !1
  }, o = () => n = !0, r = Wt.reduce((v, w) => (v[w] = po(o), v), {}), { setup: a, read: l, resolveKeyframes: u, preUpdate: c, update: h, preRender: f, render: d, postRender: p } = r, g = () => {
    const v = X.useManualTiming ? i.timestamp : performance.now();
    n = !1, X.useManualTiming || (i.delta = s ? 1e3 / 60 : Math.max(Math.min(v - i.timestamp, mo), 1)), i.timestamp = v, i.isProcessing = !0, a.process(i), l.process(i), u.process(i), c.process(i), h.process(i), f.process(i), d.process(i), p.process(i), i.isProcessing = !1, n && e && (s = !1, t(g));
  }, x = () => {
    n = !0, s = !0, i.isProcessing || t(g);
  };
  return { schedule: Wt.reduce((v, w) => {
    const S = r[w];
    return v[w] = (A, C = !1, P = !1) => (n || x(), S.schedule(A, C, P)), v;
  }, {}), cancel: (v) => {
    for (let w = 0; w < Wt.length; w++)
      r[Wt[w]].cancel(v);
  }, state: i, steps: r };
}
const { schedule: V, cancel: Q, state: j, steps: ue } = /* @__PURE__ */ vi(typeof requestAnimationFrame < "u" ? requestAnimationFrame : K, !0);
let Yt;
function yo() {
  Yt = void 0;
}
const N = {
  now: () => (Yt === void 0 && N.set(j.isProcessing || X.useManualTiming ? j.timestamp : performance.now()), Yt),
  set: (t) => {
    Yt = t, queueMicrotask(yo);
  }
}, xi = (t) => (e) => typeof e == "string" && e.startsWith(t), on = /* @__PURE__ */ xi("--"), go = /* @__PURE__ */ xi("var(--"), an = (t) => go(t) ? vo.test(t.split("/*")[0].trim()) : !1, vo = /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu, bt = {
  test: (t) => typeof t == "number",
  parse: parseFloat,
  transform: (t) => t
}, jt = {
  ...bt,
  transform: (t) => z(0, 1, t)
}, Kt = {
  ...bt,
  default: 1
}, Dt = (t) => Math.round(t * 1e5) / 1e5, ln = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu;
function xo(t) {
  return t == null;
}
const To = /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu, cn = (t, e) => (n) => !!(typeof n == "string" && To.test(n) && n.startsWith(t) || e && !xo(n) && Object.prototype.hasOwnProperty.call(n, e)), Ti = (t, e, n) => (s) => {
  if (typeof s != "string")
    return s;
  const [i, o, r, a] = s.match(ln);
  return {
    [t]: parseFloat(i),
    [e]: parseFloat(o),
    [n]: parseFloat(r),
    alpha: a !== void 0 ? parseFloat(a) : 1
  };
}, So = (t) => z(0, 255, t), he = {
  ...bt,
  transform: (t) => Math.round(So(t))
}, ot = {
  test: /* @__PURE__ */ cn("rgb", "red"),
  parse: /* @__PURE__ */ Ti("red", "green", "blue"),
  transform: ({ red: t, green: e, blue: n, alpha: s = 1 }) => "rgba(" + he.transform(t) + ", " + he.transform(e) + ", " + he.transform(n) + ", " + Dt(jt.transform(s)) + ")"
};
function bo(t) {
  let e = "", n = "", s = "", i = "";
  return t.length > 5 ? (e = t.substring(1, 3), n = t.substring(3, 5), s = t.substring(5, 7), i = t.substring(7, 9)) : (e = t.substring(1, 2), n = t.substring(2, 3), s = t.substring(3, 4), i = t.substring(4, 5), e += e, n += n, s += s, i += i), {
    red: parseInt(e, 16),
    green: parseInt(n, 16),
    blue: parseInt(s, 16),
    alpha: i ? parseInt(i, 16) / 255 : 1
  };
}
const Ce = {
  test: /* @__PURE__ */ cn("#"),
  parse: bo,
  transform: ot.transform
}, $t = /* @__NO_SIDE_EFFECTS__ */ (t) => ({
  test: (e) => typeof e == "string" && e.endsWith(t) && e.split(" ").length === 1,
  parse: parseFloat,
  transform: (e) => `${e}${t}`
}), Z = /* @__PURE__ */ $t("deg"), Y = /* @__PURE__ */ $t("%"), b = /* @__PURE__ */ $t("px"), Po = /* @__PURE__ */ $t("vh"), wo = /* @__PURE__ */ $t("vw"), Nn = {
  ...Y,
  parse: (t) => Y.parse(t) / 100,
  transform: (t) => Y.transform(t * 100)
}, dt = {
  test: /* @__PURE__ */ cn("hsl", "hue"),
  parse: /* @__PURE__ */ Ti("hue", "saturation", "lightness"),
  transform: ({ hue: t, saturation: e, lightness: n, alpha: s = 1 }) => "hsla(" + Math.round(t) + ", " + Y.transform(Dt(e)) + ", " + Y.transform(Dt(n)) + ", " + Dt(jt.transform(s)) + ")"
}, E = {
  test: (t) => ot.test(t) || Ce.test(t) || dt.test(t),
  parse: (t) => ot.test(t) ? ot.parse(t) : dt.test(t) ? dt.parse(t) : Ce.parse(t),
  transform: (t) => typeof t == "string" ? t : t.hasOwnProperty("red") ? ot.transform(t) : dt.transform(t),
  getAnimatableNone: (t) => {
    const e = E.parse(t);
    return e.alpha = 0, E.transform(e);
  }
}, Ao = /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;
function Co(t) {
  return isNaN(t) && typeof t == "string" && (t.match(ln)?.length || 0) + (t.match(Ao)?.length || 0) > 0;
}
const Si = "number", bi = "color", Vo = "var", Do = "var(", Un = "${}", Mo = /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;
function Bt(t) {
  const e = t.toString(), n = [], s = {
    color: [],
    number: [],
    var: []
  }, i = [];
  let o = 0;
  const a = e.replace(Mo, (l) => (E.test(l) ? (s.color.push(o), i.push(bi), n.push(E.parse(l))) : l.startsWith(Do) ? (s.var.push(o), i.push(Vo), n.push(l)) : (s.number.push(o), i.push(Si), n.push(parseFloat(l))), ++o, Un)).split(Un);
  return { values: n, split: a, indexes: s, types: i };
}
function Pi(t) {
  return Bt(t).values;
}
function wi(t) {
  const { split: e, types: n } = Bt(t), s = e.length;
  return (i) => {
    let o = "";
    for (let r = 0; r < s; r++)
      if (o += e[r], i[r] !== void 0) {
        const a = n[r];
        a === Si ? o += Dt(i[r]) : a === bi ? o += E.transform(i[r]) : o += i[r];
      }
    return o;
  };
}
const Ro = (t) => typeof t == "number" ? 0 : E.test(t) ? E.getAnimatableNone(t) : t;
function Eo(t) {
  const e = Pi(t);
  return wi(t)(e.map(Ro));
}
const tt = {
  test: Co,
  parse: Pi,
  createTransformer: wi,
  getAnimatableNone: Eo
};
function fe(t, e, n) {
  return n < 0 && (n += 1), n > 1 && (n -= 1), n < 1 / 6 ? t + (e - t) * 6 * n : n < 1 / 2 ? e : n < 2 / 3 ? t + (e - t) * (2 / 3 - n) * 6 : t;
}
function Lo({ hue: t, saturation: e, lightness: n, alpha: s }) {
  t /= 360, e /= 100, n /= 100;
  let i = 0, o = 0, r = 0;
  if (!e)
    i = o = r = n;
  else {
    const a = n < 0.5 ? n * (1 + e) : n + e - n * e, l = 2 * n - a;
    i = fe(l, a, t + 1 / 3), o = fe(l, a, t), r = fe(l, a, t - 1 / 3);
  }
  return {
    red: Math.round(i * 255),
    green: Math.round(o * 255),
    blue: Math.round(r * 255),
    alpha: s
  };
}
function Zt(t, e) {
  return (n) => n > 0 ? e : t;
}
const D = (t, e, n) => t + (e - t) * n, de = (t, e, n) => {
  const s = t * t, i = n * (e * e - s) + s;
  return i < 0 ? 0 : Math.sqrt(i);
}, ko = [Ce, ot, dt], jo = (t) => ko.find((e) => e.test(t));
function $n(t) {
  const e = jo(t);
  if (!e)
    return !1;
  let n = e.parse(t);
  return e === dt && (n = Lo(n)), n;
}
const _n = (t, e) => {
  const n = $n(t), s = $n(e);
  if (!n || !s)
    return Zt(t, e);
  const i = { ...n };
  return (o) => (i.red = de(n.red, s.red, o), i.green = de(n.green, s.green, o), i.blue = de(n.blue, s.blue, o), i.alpha = D(n.alpha, s.alpha, o), ot.transform(i));
}, Ve = /* @__PURE__ */ new Set(["none", "hidden"]);
function Bo(t, e) {
  return Ve.has(t) ? (n) => n <= 0 ? t : e : (n) => n >= 1 ? e : t;
}
function Oo(t, e) {
  return (n) => D(t, e, n);
}
function un(t) {
  return typeof t == "number" ? Oo : typeof t == "string" ? an(t) ? Zt : E.test(t) ? _n : No : Array.isArray(t) ? Ai : typeof t == "object" ? E.test(t) ? _n : Fo : Zt;
}
function Ai(t, e) {
  const n = [...t], s = n.length, i = t.map((o, r) => un(o)(o, e[r]));
  return (o) => {
    for (let r = 0; r < s; r++)
      n[r] = i[r](o);
    return n;
  };
}
function Fo(t, e) {
  const n = { ...t, ...e }, s = {};
  for (const i in n)
    t[i] !== void 0 && e[i] !== void 0 && (s[i] = un(t[i])(t[i], e[i]));
  return (i) => {
    for (const o in s)
      n[o] = s[o](i);
    return n;
  };
}
function Io(t, e) {
  const n = [], s = { color: 0, var: 0, number: 0 };
  for (let i = 0; i < e.values.length; i++) {
    const o = e.types[i], r = t.indexes[o][s[o]], a = t.values[r] ?? 0;
    n[i] = a, s[o]++;
  }
  return n;
}
const No = (t, e) => {
  const n = tt.createTransformer(e), s = Bt(t), i = Bt(e);
  return s.indexes.var.length === i.indexes.var.length && s.indexes.color.length === i.indexes.color.length && s.indexes.number.length >= i.indexes.number.length ? Ve.has(t) && !i.values.length || Ve.has(e) && !s.values.length ? Bo(t, e) : Nt(Ai(Io(s, i), i.values), n) : Zt(t, e);
};
function Ci(t, e, n) {
  return typeof t == "number" && typeof e == "number" && typeof n == "number" ? D(t, e, n) : un(t)(t, e);
}
const Uo = (t) => {
  const e = ({ timestamp: n }) => t(n);
  return {
    start: (n = !0) => V.update(e, n),
    stop: () => Q(e),
    /**
     * If we're processing this frame we can use the
     * framelocked timestamp to keep things in sync.
     */
    now: () => j.isProcessing ? j.timestamp : N.now()
  };
}, Vi = (t, e, n = 10) => {
  let s = "";
  const i = Math.max(Math.round(e / n), 2);
  for (let o = 0; o < i; o++)
    s += Math.round(t(o / (i - 1)) * 1e4) / 1e4 + ", ";
  return `linear(${s.substring(0, s.length - 2)})`;
}, Jt = 2e4;
function hn(t) {
  let e = 0;
  const n = 50;
  let s = t.next(e);
  for (; !s.done && e < Jt; )
    e += n, s = t.next(e);
  return e >= Jt ? 1 / 0 : e;
}
function $o(t, e = 100, n) {
  const s = n({ ...t, keyframes: [0, e] }), i = Math.min(hn(s), Jt);
  return {
    type: "keyframes",
    ease: (o) => s.next(i * o).value / e,
    duration: /* @__PURE__ */ W(i)
  };
}
const _o = 5;
function Di(t, e, n) {
  const s = Math.max(e - _o, 0);
  return ai(n - t(s), e - s);
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
}, pe = 1e-3;
function Wo({ duration: t = M.duration, bounce: e = M.bounce, velocity: n = M.velocity, mass: s = M.mass }) {
  let i, o, r = 1 - e;
  r = z(M.minDamping, M.maxDamping, r), t = z(M.minDuration, M.maxDuration, /* @__PURE__ */ W(t)), r < 1 ? (i = (u) => {
    const c = u * r, h = c * t, f = c - n, d = De(u, r), p = Math.exp(-h);
    return pe - f / d * p;
  }, o = (u) => {
    const h = u * r * t, f = h * n + n, d = Math.pow(r, 2) * Math.pow(u, 2) * t, p = Math.exp(-h), g = De(Math.pow(u, 2), r);
    return (-i(u) + pe > 0 ? -1 : 1) * ((f - d) * p) / g;
  }) : (i = (u) => {
    const c = Math.exp(-u * t), h = (u - n) * t + 1;
    return -pe + c * h;
  }, o = (u) => {
    const c = Math.exp(-u * t), h = (n - u) * (t * t);
    return c * h;
  });
  const a = 5 / t, l = Ho(i, o, a);
  if (t = /* @__PURE__ */ G(t), isNaN(l))
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
const Ko = 12;
function Ho(t, e, n) {
  let s = n;
  for (let i = 1; i < Ko; i++)
    s = s - t(s) / e(s);
  return s;
}
function De(t, e) {
  return t * Math.sqrt(1 - e * e);
}
const Go = ["duration", "bounce"], Yo = ["stiffness", "damping", "mass"];
function Wn(t, e) {
  return e.some((n) => t[n] !== void 0);
}
function zo(t) {
  let e = {
    velocity: M.velocity,
    stiffness: M.stiffness,
    damping: M.damping,
    mass: M.mass,
    isResolvedFromDuration: !1,
    ...t
  };
  if (!Wn(t, Yo) && Wn(t, Go))
    if (t.visualDuration) {
      const n = t.visualDuration, s = 2 * Math.PI / (n * 1.2), i = s * s, o = 2 * z(0.05, 1, 1 - (t.bounce || 0)) * Math.sqrt(i);
      e = {
        ...e,
        mass: M.mass,
        stiffness: i,
        damping: o
      };
    } else {
      const n = Wo(t);
      e = {
        ...e,
        ...n,
        mass: M.mass
      }, e.isResolvedFromDuration = !0;
    }
  return e;
}
function Qt(t = M.visualDuration, e = M.bounce) {
  const n = typeof t != "object" ? {
    visualDuration: t,
    keyframes: [0, 1],
    bounce: e
  } : t;
  let { restSpeed: s, restDelta: i } = n;
  const o = n.keyframes[0], r = n.keyframes[n.keyframes.length - 1], a = { done: !1, value: o }, { stiffness: l, damping: u, mass: c, duration: h, velocity: f, isResolvedFromDuration: d } = zo({
    ...n,
    velocity: -/* @__PURE__ */ W(n.velocity || 0)
  }), p = f || 0, g = u / (2 * Math.sqrt(l * c)), x = r - o, y = /* @__PURE__ */ W(Math.sqrt(l / c)), T = Math.abs(x) < 5;
  s || (s = T ? M.restSpeed.granular : M.restSpeed.default), i || (i = T ? M.restDelta.granular : M.restDelta.default);
  let v;
  if (g < 1) {
    const S = De(y, g);
    v = (A) => {
      const C = Math.exp(-g * y * A);
      return r - C * ((p + g * y * x) / S * Math.sin(S * A) + x * Math.cos(S * A));
    };
  } else if (g === 1)
    v = (S) => r - Math.exp(-y * S) * (x + (p + y * x) * S);
  else {
    const S = y * Math.sqrt(g * g - 1);
    v = (A) => {
      const C = Math.exp(-g * y * A), P = Math.min(S * A, 300);
      return r - C * ((p + g * y * x) * Math.sinh(P) + S * x * Math.cosh(P)) / S;
    };
  }
  const w = {
    calculatedDuration: d && h || null,
    next: (S) => {
      const A = v(S);
      if (d)
        a.done = S >= h;
      else {
        let C = S === 0 ? p : 0;
        g < 1 && (C = S === 0 ? /* @__PURE__ */ G(p) : Di(v, S, A));
        const P = Math.abs(C) <= s, L = Math.abs(r - A) <= i;
        a.done = P && L;
      }
      return a.value = a.done ? r : A, a;
    },
    toString: () => {
      const S = Math.min(hn(w), Jt), A = Vi((C) => w.next(S * C).value, S, 30);
      return S + "ms " + A;
    },
    toTransition: () => {
    }
  };
  return w;
}
Qt.applyToOptions = (t) => {
  const e = $o(t, 100, Qt);
  return t.ease = e.ease, t.duration = /* @__PURE__ */ G(e.duration), t.type = "keyframes", t;
};
function Me({ keyframes: t, velocity: e = 0, power: n = 0.8, timeConstant: s = 325, bounceDamping: i = 10, bounceStiffness: o = 500, modifyTarget: r, min: a, max: l, restDelta: u = 0.5, restSpeed: c }) {
  const h = t[0], f = {
    done: !1,
    value: h
  }, d = (P) => a !== void 0 && P < a || l !== void 0 && P > l, p = (P) => a === void 0 ? l : l === void 0 || Math.abs(a - P) < Math.abs(l - P) ? a : l;
  let g = n * e;
  const x = h + g, y = r === void 0 ? x : r(x);
  y !== x && (g = y - h);
  const T = (P) => -g * Math.exp(-P / s), v = (P) => y + T(P), w = (P) => {
    const L = T(P), F = v(P);
    f.done = Math.abs(L) <= u, f.value = f.done ? y : F;
  };
  let S, A;
  const C = (P) => {
    d(f.value) && (S = P, A = Qt({
      keyframes: [f.value, p(f.value)],
      velocity: Di(v, P, f.value),
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
      let L = !1;
      return !A && S === void 0 && (L = !0, w(P), C(P)), S !== void 0 && P >= S ? A.next(P - S) : (!L && w(P), f);
    }
  };
}
function Xo(t, e, n) {
  const s = [], i = n || X.mix || Ci, o = t.length - 1;
  for (let r = 0; r < o; r++) {
    let a = i(t[r], t[r + 1]);
    if (e) {
      const l = Array.isArray(e) ? e[r] || K : e;
      a = Nt(l, a);
    }
    s.push(a);
  }
  return s;
}
function qo(t, e, { clamp: n = !0, ease: s, mixer: i } = {}) {
  const o = t.length;
  if (tn(o === e.length), o === 1)
    return () => e[0];
  if (o === 2 && e[0] === e[1])
    return () => e[1];
  const r = t[0] === t[1];
  t[0] > t[o - 1] && (t = [...t].reverse(), e = [...e].reverse());
  const a = Xo(e, s, i), l = a.length, u = (c) => {
    if (r && c < t[0])
      return e[0];
    let h = 0;
    if (l > 1)
      for (; h < t.length - 2 && !(c < t[h + 1]); h++)
        ;
    const f = /* @__PURE__ */ kt(t[h], t[h + 1], c);
    return a[h](f);
  };
  return n ? (c) => u(z(t[0], t[o - 1], c)) : u;
}
function Zo(t, e) {
  const n = t[t.length - 1];
  for (let s = 1; s <= e; s++) {
    const i = /* @__PURE__ */ kt(0, e, s);
    t.push(D(n, 1, i));
  }
}
function Jo(t) {
  const e = [0];
  return Zo(e, t.length - 1), e;
}
function Qo(t, e) {
  return t.map((n) => n * e);
}
function ta(t, e) {
  return t.map(() => e || yi).splice(0, t.length - 1);
}
function Mt({ duration: t = 300, keyframes: e, times: n, ease: s = "easeInOut" }) {
  const i = uo(s) ? s.map(In) : In(s), o = {
    done: !1,
    value: e[0]
  }, r = Qo(
    // Only use the provided offsets if they're the correct length
    // TODO Maybe we should warn here if there's a length mismatch
    n && n.length === e.length ? n : Jo(e),
    t
  ), a = qo(r, e, {
    ease: Array.isArray(i) ? i : ta(e, i)
  });
  return {
    calculatedDuration: t,
    next: (l) => (o.value = a(l), o.done = l >= t, o)
  };
}
const ea = (t) => t !== null;
function fn(t, { repeat: e, repeatType: n = "loop" }, s, i = 1) {
  const o = t.filter(ea), a = i < 0 || e && n !== "loop" && e % 2 === 1 ? 0 : o.length - 1;
  return !a || s === void 0 ? o[a] : s;
}
const na = {
  decay: Me,
  inertia: Me,
  tween: Mt,
  keyframes: Mt,
  spring: Qt
};
function Mi(t) {
  typeof t.type == "string" && (t.type = na[t.type]);
}
class dn {
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
const sa = (t) => t / 100;
class pn extends dn {
  constructor(e) {
    super(), this.state = "idle", this.startTime = null, this.isStopped = !1, this.currentTime = 0, this.holdTime = null, this.playbackSpeed = 1, this.stop = () => {
      const { motionValue: n } = this.options;
      n && n.updatedAt !== N.now() && this.tick(N.now()), this.isStopped = !0, this.state !== "idle" && (this.teardown(), this.options.onStop?.());
    }, this.options = e, this.initAnimation(), this.play(), e.autoplay === !1 && this.pause();
  }
  initAnimation() {
    const { options: e } = this;
    Mi(e);
    const { type: n = Mt, repeat: s = 0, repeatDelay: i = 0, repeatType: o, velocity: r = 0 } = e;
    let { keyframes: a } = e;
    const l = n || Mt;
    l !== Mt && typeof a[0] != "number" && (this.mixKeyframes = Nt(sa, Ci(a[0], a[1])), a = [0, 100]);
    const u = l({ ...e, keyframes: a });
    o === "mirror" && (this.mirroredGenerator = l({
      ...e,
      keyframes: [...a].reverse(),
      velocity: -r
    })), u.calculatedDuration === null && (u.calculatedDuration = hn(u));
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
    const { delay: u = 0, keyframes: c, repeat: h, repeatType: f, repeatDelay: d, type: p, onUpdate: g, finalKeyframe: x } = this.options;
    this.speed > 0 ? this.startTime = Math.min(this.startTime, e) : this.speed < 0 && (this.startTime = Math.min(e - i / this.speed, this.startTime)), n ? this.currentTime = e : this.updateTime(e);
    const y = this.currentTime - u * (this.playbackSpeed >= 0 ? 1 : -1), T = this.playbackSpeed >= 0 ? y < 0 : y > i;
    this.currentTime = Math.max(y, 0), this.state === "finished" && this.holdTime === null && (this.currentTime = i);
    let v = this.currentTime, w = s;
    if (h) {
      const P = Math.min(this.currentTime, i) / a;
      let L = Math.floor(P), F = P % 1;
      !F && P >= 1 && (F = 1), F === 1 && L--, L = Math.min(L, h + 1), !!(L % 2) && (f === "reverse" ? (F = 1 - F, d && (F -= d / a)) : f === "mirror" && (w = r)), v = z(0, 1, F) * a;
    }
    const S = T ? { done: !1, value: c[0] } : w.next(v);
    o && (S.value = o(S.value));
    let { done: A } = S;
    !T && l !== null && (A = this.playbackSpeed >= 0 ? this.currentTime >= i : this.currentTime <= 0);
    const C = this.holdTime === null && (this.state === "finished" || this.state === "running" && A);
    return C && p !== Me && (S.value = fn(c, this.options, x, this.speed)), g && g(S.value), C && this.finish(), S;
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
    e = /* @__PURE__ */ G(e), this.currentTime = e, this.startTime === null || this.holdTime !== null || this.playbackSpeed === 0 ? this.holdTime = e : this.driver && (this.startTime = this.driver.now() - e / this.playbackSpeed), this.driver?.start(!1);
  }
  get speed() {
    return this.playbackSpeed;
  }
  set speed(e) {
    this.updateTime(N.now());
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
    this.state = "paused", this.updateTime(N.now()), this.holdTime = this.currentTime;
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
function ia(t) {
  for (let e = 1; e < t.length; e++)
    t[e] ?? (t[e] = t[e - 1]);
}
const at = (t) => t * 180 / Math.PI, Re = (t) => {
  const e = at(Math.atan2(t[1], t[0]));
  return Ee(e);
}, ra = {
  x: 4,
  y: 5,
  translateX: 4,
  translateY: 5,
  scaleX: 0,
  scaleY: 3,
  scale: (t) => (Math.abs(t[0]) + Math.abs(t[3])) / 2,
  rotate: Re,
  rotateZ: Re,
  skewX: (t) => at(Math.atan(t[1])),
  skewY: (t) => at(Math.atan(t[2])),
  skew: (t) => (Math.abs(t[1]) + Math.abs(t[2])) / 2
}, Ee = (t) => (t = t % 360, t < 0 && (t += 360), t), Kn = Re, Hn = (t) => Math.sqrt(t[0] * t[0] + t[1] * t[1]), Gn = (t) => Math.sqrt(t[4] * t[4] + t[5] * t[5]), oa = {
  x: 12,
  y: 13,
  z: 14,
  translateX: 12,
  translateY: 13,
  translateZ: 14,
  scaleX: Hn,
  scaleY: Gn,
  scale: (t) => (Hn(t) + Gn(t)) / 2,
  rotateX: (t) => Ee(at(Math.atan2(t[6], t[5]))),
  rotateY: (t) => Ee(at(Math.atan2(-t[2], t[0]))),
  rotateZ: Kn,
  rotate: Kn,
  skewX: (t) => at(Math.atan(t[4])),
  skewY: (t) => at(Math.atan(t[1])),
  skew: (t) => (Math.abs(t[1]) + Math.abs(t[4])) / 2
};
function Le(t) {
  return t.includes("scale") ? 1 : 0;
}
function ke(t, e) {
  if (!t || t === "none")
    return Le(e);
  const n = t.match(/^matrix3d\(([-\d.e\s,]+)\)$/u);
  let s, i;
  if (n)
    s = oa, i = n;
  else {
    const a = t.match(/^matrix\(([-\d.e\s,]+)\)$/u);
    s = ra, i = a;
  }
  if (!i)
    return Le(e);
  const o = s[e], r = i[1].split(",").map(la);
  return typeof o == "function" ? o(r) : r[o];
}
const aa = (t, e) => {
  const { transform: n = "none" } = getComputedStyle(t);
  return ke(n, e);
};
function la(t) {
  return parseFloat(t.trim());
}
const Pt = [
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
], wt = new Set(Pt), Yn = (t) => t === bt || t === b, ca = /* @__PURE__ */ new Set(["x", "y", "z"]), ua = Pt.filter((t) => !ca.has(t));
function ha(t) {
  const e = [];
  return ua.forEach((n) => {
    const s = t.getValue(n);
    s !== void 0 && (e.push([n, s.get()]), s.set(n.startsWith("scale") ? 1 : 0));
  }), e;
}
const lt = {
  // Dimensions
  width: ({ x: t }, { paddingLeft: e = "0", paddingRight: n = "0" }) => t.max - t.min - parseFloat(e) - parseFloat(n),
  height: ({ y: t }, { paddingTop: e = "0", paddingBottom: n = "0" }) => t.max - t.min - parseFloat(e) - parseFloat(n),
  top: (t, { top: e }) => parseFloat(e),
  left: (t, { left: e }) => parseFloat(e),
  bottom: ({ y: t }, { top: e }) => parseFloat(e) + (t.max - t.min),
  right: ({ x: t }, { left: e }) => parseFloat(e) + (t.max - t.min),
  // Transform
  x: (t, { transform: e }) => ke(e, "x"),
  y: (t, { transform: e }) => ke(e, "y")
};
lt.translateX = lt.x;
lt.translateY = lt.y;
const ct = /* @__PURE__ */ new Set();
let je = !1, Be = !1, Oe = !1;
function Ri() {
  if (Be) {
    const t = Array.from(ct).filter((s) => s.needsMeasurement), e = new Set(t.map((s) => s.element)), n = /* @__PURE__ */ new Map();
    e.forEach((s) => {
      const i = ha(s);
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
  Be = !1, je = !1, ct.forEach((t) => t.complete(Oe)), ct.clear();
}
function Ei() {
  ct.forEach((t) => {
    t.readKeyframes(), t.needsMeasurement && (Be = !0);
  });
}
function fa() {
  Oe = !0, Ei(), Ri(), Oe = !1;
}
class mn {
  constructor(e, n, s, i, o, r = !1) {
    this.state = "pending", this.isAsync = !1, this.needsMeasurement = !1, this.unresolvedKeyframes = [...e], this.onComplete = n, this.name = s, this.motionValue = i, this.element = o, this.isAsync = r;
  }
  scheduleResolve() {
    this.state = "scheduled", this.isAsync ? (ct.add(this), je || (je = !0, V.read(Ei), V.resolveKeyframes(Ri))) : (this.readKeyframes(), this.complete());
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
    ia(e);
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
    this.state = "complete", this.onComplete(this.unresolvedKeyframes, this.finalKeyframe, e), ct.delete(this);
  }
  cancel() {
    this.state === "scheduled" && (ct.delete(this), this.state = "pending");
  }
  resume() {
    this.state === "pending" && this.scheduleResolve();
  }
}
const da = (t) => t.startsWith("--");
function pa(t, e, n) {
  da(e) ? t.style.setProperty(e, n) : t.style[e] = n;
}
const ma = /* @__PURE__ */ en(() => window.ScrollTimeline !== void 0), ya = {};
function ga(t, e) {
  const n = /* @__PURE__ */ en(t);
  return () => ya[e] ?? n();
}
const Li = /* @__PURE__ */ ga(() => {
  try {
    document.createElement("div").animate({ opacity: 0 }, { easing: "linear(0, 1)" });
  } catch {
    return !1;
  }
  return !0;
}, "linearEasing"), Vt = ([t, e, n, s]) => `cubic-bezier(${t}, ${e}, ${n}, ${s})`, zn = {
  linear: "linear",
  ease: "ease",
  easeIn: "ease-in",
  easeOut: "ease-out",
  easeInOut: "ease-in-out",
  circIn: /* @__PURE__ */ Vt([0, 0.65, 0.55, 1]),
  circOut: /* @__PURE__ */ Vt([0.55, 0, 1, 0.45]),
  backIn: /* @__PURE__ */ Vt([0.31, 0.01, 0.66, -0.59]),
  backOut: /* @__PURE__ */ Vt([0.33, 1.53, 0.69, 0.99])
};
function ki(t, e) {
  if (t)
    return typeof t == "function" ? Li() ? Vi(t, e) : "ease-out" : gi(t) ? Vt(t) : Array.isArray(t) ? t.map((n) => ki(n, e) || zn.easeOut) : zn[t];
}
function va(t, e, n, { delay: s = 0, duration: i = 300, repeat: o = 0, repeatType: r = "loop", ease: a = "easeOut", times: l } = {}, u = void 0) {
  const c = {
    [e]: n
  };
  l && (c.offset = l);
  const h = ki(a, i);
  Array.isArray(h) && (c.easing = h);
  const f = {
    delay: s,
    duration: i,
    easing: Array.isArray(h) ? "linear" : h,
    fill: "both",
    iterations: o + 1,
    direction: r === "reverse" ? "alternate" : "normal"
  };
  return u && (f.pseudoElement = u), t.animate(c, f);
}
function ji(t) {
  return typeof t == "function" && "applyToOptions" in t;
}
function xa({ type: t, ...e }) {
  return ji(t) && Li() ? t.applyToOptions(e) : (e.duration ?? (e.duration = 300), e.ease ?? (e.ease = "easeOut"), e);
}
class Ta extends dn {
  constructor(e) {
    if (super(), this.finishedTime = null, this.isStopped = !1, !e)
      return;
    const { element: n, name: s, keyframes: i, pseudoElement: o, allowFlatten: r = !1, finalKeyframe: a, onComplete: l } = e;
    this.isPseudoElement = !!o, this.allowFlatten = r, this.options = e, tn(typeof e.type != "string");
    const u = xa(e);
    this.animation = va(n, s, i, u, o), u.autoplay === !1 && this.animation.pause(), this.animation.onfinish = () => {
      if (this.finishedTime = this.time, !o) {
        const c = fn(i, this.options, a, this.speed);
        this.updateMotionValue ? this.updateMotionValue(c) : pa(n, s, c), this.animation.cancel();
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
    this.finishedTime = null, this.animation.currentTime = /* @__PURE__ */ G(e);
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
    return this.allowFlatten && this.animation.effect?.updateTiming({ easing: "linear" }), this.animation.onfinish = null, e && ma() ? (this.animation.timeline = e, K) : n(this);
  }
}
const Bi = {
  anticipate: di,
  backInOut: fi,
  circInOut: mi
};
function Sa(t) {
  return t in Bi;
}
function ba(t) {
  typeof t.ease == "string" && Sa(t.ease) && (t.ease = Bi[t.ease]);
}
const Xn = 10;
class Pa extends Ta {
  constructor(e) {
    ba(e), Mi(e), super(e), e.startTime && (this.startTime = e.startTime), this.options = e;
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
    const a = new pn({
      ...r,
      autoplay: !1
    }), l = /* @__PURE__ */ G(this.finishedTime ?? this.time);
    n.setWithVelocity(a.sample(l - Xn).value, a.sample(l).value, Xn), a.stop();
  }
}
const qn = (t, e) => e === "zIndex" ? !1 : !!(typeof t == "number" || Array.isArray(t) || typeof t == "string" && // It's animatable if we have a string
(tt.test(t) || t === "0") && // And it contains numbers and/or colors
!t.startsWith("url("));
function wa(t) {
  const e = t[0];
  if (t.length === 1)
    return !0;
  for (let n = 0; n < t.length; n++)
    if (t[n] !== e)
      return !0;
}
function Aa(t, e, n, s) {
  const i = t[0];
  if (i === null)
    return !1;
  if (e === "display" || e === "visibility")
    return !0;
  const o = t[t.length - 1], r = qn(i, e), a = qn(o, e);
  return !r || !a ? !1 : wa(t) || (n === "spring" || ji(n)) && s;
}
function Fe(t) {
  t.duration = 0, t.type = "keyframes";
}
const Ca = /* @__PURE__ */ new Set([
  "opacity",
  "clipPath",
  "filter",
  "transform"
  // TODO: Could be re-enabled now we have support for linear() easing
  // "background-color"
]), Va = /* @__PURE__ */ en(() => Object.hasOwnProperty.call(Element.prototype, "animate"));
function Da(t) {
  const { motionValue: e, name: n, repeatDelay: s, repeatType: i, damping: o, type: r } = t;
  if (!(e?.owner?.current instanceof HTMLElement))
    return !1;
  const { onUpdate: l, transformTemplate: u } = e.owner.getProps();
  return Va() && n && Ca.has(n) && (n !== "transform" || !u) && /**
   * If we're outputting values to onUpdate then we can't use WAAPI as there's
   * no way to read the value from WAAPI every frame.
   */
  !l && !s && i !== "mirror" && o !== 0 && r !== "inertia";
}
const Ma = 40;
class Ra extends dn {
  constructor({ autoplay: e = !0, delay: n = 0, type: s = "keyframes", repeat: i = 0, repeatDelay: o = 0, repeatType: r = "loop", keyframes: a, name: l, motionValue: u, element: c, ...h }) {
    super(), this.stop = () => {
      this._animation && (this._animation.stop(), this.stopTimeline?.()), this.keyframeResolver?.cancel();
    }, this.createdAt = N.now();
    const f = {
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
    }, d = c?.KeyframeResolver || mn;
    this.keyframeResolver = new d(a, (p, g, x) => this.onKeyframesResolved(p, g, f, !x), l, u, c), this.keyframeResolver?.scheduleResolve();
  }
  onKeyframesResolved(e, n, s, i) {
    this.keyframeResolver = void 0;
    const { name: o, type: r, velocity: a, delay: l, isHandoff: u, onUpdate: c } = s;
    this.resolvedAt = N.now(), Aa(e, o, r, a) || ((X.instantAnimations || !l) && c?.(fn(e, s, n)), e[0] = e[e.length - 1], Fe(s), s.repeat = 0);
    const f = {
      startTime: i ? this.resolvedAt ? this.resolvedAt - this.createdAt > Ma ? this.resolvedAt : this.createdAt : this.createdAt : void 0,
      finalKeyframe: n,
      ...s,
      keyframes: e
    }, d = !u && Da(f) ? new Pa({
      ...f,
      element: f.motionValue.owner.current
    }) : new pn(f);
    d.finished.then(() => this.notifyFinished()).catch(K), this.pendingTimeline && (this.stopTimeline = d.attachTimeline(this.pendingTimeline), this.pendingTimeline = void 0), this._animation = d;
  }
  get finished() {
    return this._animation ? this.animation.finished : this._finished;
  }
  then(e, n) {
    return this.finished.finally(e).then(() => {
    });
  }
  get animation() {
    return this._animation || (this.keyframeResolver?.resume(), fa()), this._animation;
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
const Ea = (
  // eslint-disable-next-line redos-detector/no-unsafe-regex -- false positive, as it can match a lot of words
  /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u
);
function La(t) {
  const e = Ea.exec(t);
  if (!e)
    return [,];
  const [, n, s, i] = e;
  return [`--${n ?? s}`, i];
}
function Oi(t, e, n = 1) {
  const [s, i] = La(t);
  if (!s)
    return;
  const o = window.getComputedStyle(e).getPropertyValue(s);
  if (o) {
    const r = o.trim();
    return ii(r) ? parseFloat(r) : r;
  }
  return an(i) ? Oi(i, e, n + 1) : i;
}
function yn(t, e) {
  return t?.[e] ?? t?.default ?? t;
}
const Fi = /* @__PURE__ */ new Set([
  "width",
  "height",
  "top",
  "left",
  "right",
  "bottom",
  ...Pt
]), ka = {
  test: (t) => t === "auto",
  parse: (t) => t
}, Ii = (t) => (e) => e.test(t), Ni = [bt, b, Y, Z, wo, Po, ka], Zn = (t) => Ni.find(Ii(t));
function ja(t) {
  return typeof t == "number" ? t === 0 : t !== null ? t === "none" || t === "0" || oi(t) : !0;
}
const Ba = /* @__PURE__ */ new Set(["brightness", "contrast", "saturate", "opacity"]);
function Oa(t) {
  const [e, n] = t.slice(0, -1).split("(");
  if (e === "drop-shadow")
    return t;
  const [s] = n.match(ln) || [];
  if (!s)
    return t;
  const i = n.replace(s, "");
  let o = Ba.has(e) ? 1 : 0;
  return s !== n && (o *= 100), e + "(" + o + i + ")";
}
const Fa = /\b([a-z-]*)\(.*?\)/gu, Ie = {
  ...tt,
  getAnimatableNone: (t) => {
    const e = t.match(Fa);
    return e ? e.map(Oa).join(" ") : t;
  }
}, Jn = {
  ...bt,
  transform: Math.round
}, Ia = {
  rotate: Z,
  rotateX: Z,
  rotateY: Z,
  rotateZ: Z,
  scale: Kt,
  scaleX: Kt,
  scaleY: Kt,
  scaleZ: Kt,
  skew: Z,
  skewX: Z,
  skewY: Z,
  distance: b,
  translateX: b,
  translateY: b,
  translateZ: b,
  x: b,
  y: b,
  z: b,
  perspective: b,
  transformPerspective: b,
  opacity: jt,
  originX: Nn,
  originY: Nn,
  originZ: b
}, gn = {
  // Border props
  borderWidth: b,
  borderTopWidth: b,
  borderRightWidth: b,
  borderBottomWidth: b,
  borderLeftWidth: b,
  borderRadius: b,
  radius: b,
  borderTopLeftRadius: b,
  borderTopRightRadius: b,
  borderBottomRightRadius: b,
  borderBottomLeftRadius: b,
  // Positioning props
  width: b,
  maxWidth: b,
  height: b,
  maxHeight: b,
  top: b,
  right: b,
  bottom: b,
  left: b,
  // Spacing props
  padding: b,
  paddingTop: b,
  paddingRight: b,
  paddingBottom: b,
  paddingLeft: b,
  margin: b,
  marginTop: b,
  marginRight: b,
  marginBottom: b,
  marginLeft: b,
  // Misc
  backgroundPositionX: b,
  backgroundPositionY: b,
  ...Ia,
  zIndex: Jn,
  // SVG
  fillOpacity: jt,
  strokeOpacity: jt,
  numOctaves: Jn
}, Na = {
  ...gn,
  // Color props
  color: E,
  backgroundColor: E,
  outlineColor: E,
  fill: E,
  stroke: E,
  // Border props
  borderColor: E,
  borderTopColor: E,
  borderRightColor: E,
  borderBottomColor: E,
  borderLeftColor: E,
  filter: Ie,
  WebkitFilter: Ie
}, Ui = (t) => Na[t];
function $i(t, e) {
  let n = Ui(t);
  return n !== Ie && (n = tt), n.getAnimatableNone ? n.getAnimatableNone(e) : void 0;
}
const Ua = /* @__PURE__ */ new Set(["auto", "none", "0"]);
function $a(t, e, n) {
  let s = 0, i;
  for (; s < t.length && !i; ) {
    const o = t[s];
    typeof o == "string" && !Ua.has(o) && Bt(o).values.length && (i = t[s]), s++;
  }
  if (i && n)
    for (const o of e)
      t[o] = $i(n, i);
}
class _a extends mn {
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
      if (typeof u == "string" && (u = u.trim(), an(u))) {
        const c = Oi(u, n.current);
        c !== void 0 && (e[l] = c), l === e.length - 1 && (this.finalKeyframe = u);
      }
    }
    if (this.resolveNoneKeyframes(), !Fi.has(s) || e.length !== 2)
      return;
    const [i, o] = e, r = Zn(i), a = Zn(o);
    if (r !== a)
      if (Yn(r) && Yn(a))
        for (let l = 0; l < e.length; l++) {
          const u = e[l];
          typeof u == "string" && (e[l] = parseFloat(u));
        }
      else lt[s] && (this.needsMeasurement = !0);
  }
  resolveNoneKeyframes() {
    const { unresolvedKeyframes: e, name: n } = this, s = [];
    for (let i = 0; i < e.length; i++)
      (e[i] === null || ja(e[i])) && s.push(i);
    s.length && $a(e, s, n);
  }
  measureInitialState() {
    const { element: e, unresolvedKeyframes: n, name: s } = this;
    if (!e || !e.current)
      return;
    s === "height" && (this.suspendedScrollY = window.pageYOffset), this.measuredOrigin = lt[s](e.measureViewportBox(), window.getComputedStyle(e.current)), n[0] = this.measuredOrigin;
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
    s[o] = lt[n](e.measureViewportBox(), window.getComputedStyle(e.current)), r !== null && this.finalKeyframe === void 0 && (this.finalKeyframe = r), this.removedTransforms?.length && this.removedTransforms.forEach(([a, l]) => {
      e.getValue(a).set(l);
    }), this.resolveNoneKeyframes();
  }
}
function Wa(t, e, n) {
  if (t instanceof EventTarget)
    return [t];
  if (typeof t == "string") {
    let s = document;
    const i = n?.[t] ?? s.querySelectorAll(t);
    return i ? Array.from(i) : [];
  }
  return Array.from(t);
}
const _i = (t, e) => e && typeof t == "number" ? e.transform(t) : t;
function Wi(t) {
  return ri(t) && "offsetHeight" in t;
}
const Qn = 30, Ka = (t) => !isNaN(parseFloat(t));
class Ha {
  /**
   * @param init - The initiating value
   * @param config - Optional configuration options
   *
   * -  `transformer`: A function to transform incoming values with.
   */
  constructor(e, n = {}) {
    this.canTrackVelocity = null, this.events = {}, this.updateAndNotify = (s) => {
      const i = N.now();
      if (this.updatedAt !== i && this.setPrevFrameValue(), this.prev = this.current, this.setCurrent(s), this.current !== this.prev && (this.events.change?.notify(this.current), this.dependents))
        for (const o of this.dependents)
          o.dirty();
    }, this.hasAnimated = !1, this.setCurrent(e), this.owner = n.owner;
  }
  setCurrent(e) {
    this.current = e, this.updatedAt = N.now(), this.canTrackVelocity === null && e !== void 0 && (this.canTrackVelocity = Ka(this.current));
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
    this.events[e] || (this.events[e] = new nn());
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
    const e = N.now();
    if (!this.canTrackVelocity || this.prevFrameValue === void 0 || e - this.updatedAt > Qn)
      return 0;
    const n = Math.min(this.updatedAt - this.prevUpdatedAt, Qn);
    return ai(parseFloat(this.current) - parseFloat(this.prevFrameValue), n);
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
function xt(t, e) {
  return new Ha(t, e);
}
const { schedule: vn } = /* @__PURE__ */ vi(queueMicrotask, !1), H = {
  x: !1,
  y: !1
};
function Ki() {
  return H.x || H.y;
}
function Ga(t) {
  return t === "x" || t === "y" ? H[t] ? null : (H[t] = !0, () => {
    H[t] = !1;
  }) : H.x || H.y ? null : (H.x = H.y = !0, () => {
    H.x = H.y = !1;
  });
}
function Hi(t, e) {
  const n = Wa(t), s = new AbortController(), i = {
    passive: !0,
    ...e,
    signal: s.signal
  };
  return [n, i, () => s.abort()];
}
function ts(t) {
  return !(t.pointerType === "touch" || Ki());
}
function Ya(t, e, n = {}) {
  const [s, i, o] = Hi(t, n), r = (a) => {
    if (!ts(a))
      return;
    const { target: l } = a, u = e(l, a);
    if (typeof u != "function" || !l)
      return;
    const c = (h) => {
      ts(h) && (u(h), l.removeEventListener("pointerleave", c));
    };
    l.addEventListener("pointerleave", c, i);
  };
  return s.forEach((a) => {
    a.addEventListener("pointerenter", r, i);
  }), o;
}
const Gi = (t, e) => e ? t === e ? !0 : Gi(t, e.parentElement) : !1, xn = (t) => t.pointerType === "mouse" ? typeof t.button != "number" || t.button <= 0 : t.isPrimary !== !1, za = /* @__PURE__ */ new Set([
  "BUTTON",
  "INPUT",
  "SELECT",
  "TEXTAREA",
  "A"
]);
function Xa(t) {
  return za.has(t.tagName) || t.tabIndex !== -1;
}
const zt = /* @__PURE__ */ new WeakSet();
function es(t) {
  return (e) => {
    e.key === "Enter" && t(e);
  };
}
function me(t, e) {
  t.dispatchEvent(new PointerEvent("pointer" + e, { isPrimary: !0, bubbles: !0 }));
}
const qa = (t, e) => {
  const n = t.currentTarget;
  if (!n)
    return;
  const s = es(() => {
    if (zt.has(n))
      return;
    me(n, "down");
    const i = es(() => {
      me(n, "up");
    }), o = () => me(n, "cancel");
    n.addEventListener("keyup", i, e), n.addEventListener("blur", o, e);
  });
  n.addEventListener("keydown", s, e), n.addEventListener("blur", () => n.removeEventListener("keydown", s), e);
};
function ns(t) {
  return xn(t) && !Ki();
}
function Za(t, e, n = {}) {
  const [s, i, o] = Hi(t, n), r = (a) => {
    const l = a.currentTarget;
    if (!ns(a))
      return;
    zt.add(l);
    const u = e(l, a), c = (d, p) => {
      window.removeEventListener("pointerup", h), window.removeEventListener("pointercancel", f), zt.has(l) && zt.delete(l), ns(d) && typeof u == "function" && u(d, { success: p });
    }, h = (d) => {
      c(d, l === window || l === document || n.useGlobalTarget || Gi(l, d.target));
    }, f = (d) => {
      c(d, !1);
    };
    window.addEventListener("pointerup", h, i), window.addEventListener("pointercancel", f, i);
  };
  return s.forEach((a) => {
    (n.useGlobalTarget ? window : a).addEventListener("pointerdown", r, i), Wi(a) && (a.addEventListener("focus", (u) => qa(u, i)), !Xa(a) && !a.hasAttribute("tabindex") && (a.tabIndex = 0));
  }), o;
}
function Yi(t) {
  return ri(t) && "ownerSVGElement" in t;
}
function Ja(t) {
  return Yi(t) && t.tagName === "svg";
}
const O = (t) => !!(t && t.getVelocity), Qa = [...Ni, E, tt], tl = (t) => Qa.find(Ii(t)), Tn = St({
  transformPagePoint: (t) => t,
  isStatic: !1,
  reducedMotion: "never"
});
function ss(t, e) {
  if (typeof t == "function")
    return t(e);
  t != null && (t.current = e);
}
function el(...t) {
  return (e) => {
    let n = !1;
    const s = t.map((i) => {
      const o = ss(i, e);
      return !n && typeof o == "function" && (n = !0), o;
    });
    if (n)
      return () => {
        for (let i = 0; i < s.length; i++) {
          const o = s[i];
          typeof o == "function" ? o() : ss(t[i], null);
        }
      };
  };
}
function nl(...t) {
  return ie.useCallback(el(...t), t);
}
class sl extends ie.Component {
  getSnapshotBeforeUpdate(e) {
    const n = this.props.childRef.current;
    if (n && e.isPresent && !this.props.isPresent) {
      const s = n.offsetParent, i = Wi(s) && s.offsetWidth || 0, o = this.props.sizeRef.current;
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
function il({ children: t, isPresent: e, anchorX: n, root: s }) {
  const i = ze(), o = J(null), r = J({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    right: 0
  }), { nonce: a } = B(Tn), l = nl(o, t?.ref);
  return Qs(() => {
    const { width: u, height: c, top: h, left: f, right: d } = r.current;
    if (e || !o.current || !u || !c)
      return;
    const p = n === "left" ? `left: ${f}` : `right: ${d}`;
    o.current.dataset.motionPopId = i;
    const g = document.createElement("style");
    a && (g.nonce = a);
    const x = s ?? document.head;
    return x.appendChild(g), g.sheet && g.sheet.insertRule(`
          [data-motion-pop-id="${i}"] {
            position: absolute !important;
            width: ${u}px !important;
            height: ${c}px !important;
            ${p}px !important;
            top: ${h}px !important;
          }
        `), () => {
      x.contains(g) && x.removeChild(g);
    };
  }, [e]), m.jsx(sl, { isPresent: e, childRef: o, sizeRef: r, children: ie.cloneElement(t, { ref: l }) });
}
const rl = ({ children: t, initial: e, isPresent: n, onExitComplete: s, custom: i, presenceAffectsLayout: o, mode: r, anchorX: a, root: l }) => {
  const u = qe(ol), c = ze();
  let h = !0, f = ut(() => (h = !1, {
    id: c,
    initial: e,
    isPresent: n,
    custom: i,
    onExitComplete: (d) => {
      u.set(d, !0);
      for (const p of u.values())
        if (!p)
          return;
      s && s();
    },
    register: (d) => (u.set(d, !1), () => u.delete(d))
  }), [n, u, s]);
  return o && h && (f = { ...f }), ut(() => {
    u.forEach((d, p) => u.set(p, !1));
  }, [n]), ie.useEffect(() => {
    !n && !u.size && s && s();
  }, [n]), r === "popLayout" && (t = m.jsx(il, { isPresent: n, anchorX: a, root: l, children: t })), m.jsx(re.Provider, { value: f, children: t });
};
function ol() {
  return /* @__PURE__ */ new Map();
}
function zi(t = !0) {
  const e = B(re);
  if (e === null)
    return [!0, null];
  const { isPresent: n, onExitComplete: s, register: i } = e, o = ze();
  Ye(() => {
    if (t)
      return i(o);
  }, [t]);
  const r = ti(() => t && s && s(o), [o, s, t]);
  return !n && s ? [!1, r] : [!0];
}
const Ht = (t) => t.key || "";
function is(t) {
  const e = [];
  return Wr.forEach(t, (n) => {
    Kr(n) && e.push(n);
  }), e;
}
const al = ({ children: t, custom: e, initial: n = !0, onExitComplete: s, presenceAffectsLayout: i = !0, mode: o = "sync", propagate: r = !1, anchorX: a = "left", root: l }) => {
  const [u, c] = zi(r), h = ut(() => is(t), [t]), f = r && !u ? [] : h.map(Ht), d = J(!0), p = J(h), g = qe(() => /* @__PURE__ */ new Map()), [x, y] = Ae(h), [T, v] = Ae(h);
  si(() => {
    d.current = !1, p.current = h;
    for (let A = 0; A < T.length; A++) {
      const C = Ht(T[A]);
      f.includes(C) ? g.delete(C) : g.get(C) !== !0 && g.set(C, !1);
    }
  }, [T, f.length, f.join("-")]);
  const w = [];
  if (h !== x) {
    let A = [...h];
    for (let C = 0; C < T.length; C++) {
      const P = T[C], L = Ht(P);
      f.includes(L) || (A.splice(C, 0, P), w.push(P));
    }
    return o === "wait" && w.length && (A = w), v(is(A)), y(h), null;
  }
  const { forceRender: S } = B(Xe);
  return m.jsx(m.Fragment, { children: T.map((A) => {
    const C = Ht(A), P = r && !u ? !1 : h === T || f.includes(C), L = () => {
      if (g.has(C))
        g.set(C, !0);
      else
        return;
      let F = !0;
      g.forEach((q) => {
        q || (F = !1);
      }), F && (S?.(), v(p.current), r && c?.(), s && s());
    };
    return m.jsx(rl, { isPresent: P, initial: !d.current || n ? void 0 : !1, custom: e, presenceAffectsLayout: i, mode: o, root: l, onExitComplete: P ? void 0 : L, anchorX: a, children: A }, C);
  }) });
}, Xi = St({ strict: !1 }), rs = {
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
}, Tt = {};
for (const t in rs)
  Tt[t] = {
    isEnabled: (e) => rs[t].some((n) => !!e[n])
  };
function ll(t) {
  for (const e in t)
    Tt[e] = {
      ...Tt[e],
      ...t[e]
    };
}
const cl = /* @__PURE__ */ new Set([
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
function te(t) {
  return t.startsWith("while") || t.startsWith("drag") && t !== "draggable" || t.startsWith("layout") || t.startsWith("onTap") || t.startsWith("onPan") || t.startsWith("onLayout") || cl.has(t);
}
let qi = (t) => !te(t);
function ul(t) {
  typeof t == "function" && (qi = (e) => e.startsWith("on") ? !te(e) : t(e));
}
try {
  ul(require("@emotion/is-prop-valid").default);
} catch {
}
function hl(t, e, n) {
  const s = {};
  for (const i in t)
    i === "values" && typeof t.values == "object" || (qi(i) || n === !0 && te(i) || !e && !te(i) || // If trying to use native HTML drag events, forward drag listeners
    t.draggable && i.startsWith("onDrag")) && (s[i] = t[i]);
  return s;
}
const oe = /* @__PURE__ */ St({});
function ae(t) {
  return t !== null && typeof t == "object" && typeof t.start == "function";
}
function Ot(t) {
  return typeof t == "string" || Array.isArray(t);
}
const Sn = [
  "animate",
  "whileInView",
  "whileFocus",
  "whileHover",
  "whileTap",
  "whileDrag",
  "exit"
], bn = ["initial", ...Sn];
function le(t) {
  return ae(t.animate) || bn.some((e) => Ot(t[e]));
}
function Zi(t) {
  return !!(le(t) || t.variants);
}
function fl(t, e) {
  if (le(t)) {
    const { initial: n, animate: s } = t;
    return {
      initial: n === !1 || Ot(n) ? n : void 0,
      animate: Ot(s) ? s : void 0
    };
  }
  return t.inherit !== !1 ? e : {};
}
function dl(t) {
  const { initial: e, animate: n } = fl(t, B(oe));
  return ut(() => ({ initial: e, animate: n }), [os(e), os(n)]);
}
function os(t) {
  return Array.isArray(t) ? t.join(" ") : t;
}
const Ft = {};
function pl(t) {
  for (const e in t)
    Ft[e] = t[e], on(e) && (Ft[e].isCSSVariable = !0);
}
function Ji(t, { layout: e, layoutId: n }) {
  return wt.has(t) || t.startsWith("origin") || (e || n !== void 0) && (!!Ft[t] || t === "opacity");
}
const ml = {
  x: "translateX",
  y: "translateY",
  z: "translateZ",
  transformPerspective: "perspective"
}, yl = Pt.length;
function gl(t, e, n) {
  let s = "", i = !0;
  for (let o = 0; o < yl; o++) {
    const r = Pt[o], a = t[r];
    if (a === void 0)
      continue;
    let l = !0;
    if (typeof a == "number" ? l = a === (r.startsWith("scale") ? 1 : 0) : l = parseFloat(a) === 0, !l || n) {
      const u = _i(a, gn[r]);
      if (!l) {
        i = !1;
        const c = ml[r] || r;
        s += `${c}(${u}) `;
      }
      n && (e[r] = u);
    }
  }
  return s = s.trim(), n ? s = n(e, i ? "" : s) : i && (s = "none"), s;
}
function Pn(t, e, n) {
  const { style: s, vars: i, transformOrigin: o } = t;
  let r = !1, a = !1;
  for (const l in e) {
    const u = e[l];
    if (wt.has(l)) {
      r = !0;
      continue;
    } else if (on(l)) {
      i[l] = u;
      continue;
    } else {
      const c = _i(u, gn[l]);
      l.startsWith("origin") ? (a = !0, o[l] = c) : s[l] = c;
    }
  }
  if (e.transform || (r || n ? s.transform = gl(e, t.transform, n) : s.transform && (s.transform = "none")), a) {
    const { originX: l = "50%", originY: u = "50%", originZ: c = 0 } = o;
    s.transformOrigin = `${l} ${u} ${c}`;
  }
}
const wn = () => ({
  style: {},
  transform: {},
  transformOrigin: {},
  vars: {}
});
function Qi(t, e, n) {
  for (const s in e)
    !O(e[s]) && !Ji(s, n) && (t[s] = e[s]);
}
function vl({ transformTemplate: t }, e) {
  return ut(() => {
    const n = wn();
    return Pn(n, e, t), Object.assign({}, n.vars, n.style);
  }, [e]);
}
function xl(t, e) {
  const n = t.style || {}, s = {};
  return Qi(s, n, t), Object.assign(s, vl(t, e)), s;
}
function Tl(t, e) {
  const n = {}, s = xl(t, e);
  return t.drag && t.dragListener !== !1 && (n.draggable = !1, s.userSelect = s.WebkitUserSelect = s.WebkitTouchCallout = "none", s.touchAction = t.drag === !0 ? "none" : `pan-${t.drag === "x" ? "y" : "x"}`), t.tabIndex === void 0 && (t.onTap || t.onTapStart || t.whileTap) && (n.tabIndex = 0), n.style = s, n;
}
const Sl = {
  offset: "stroke-dashoffset",
  array: "stroke-dasharray"
}, bl = {
  offset: "strokeDashoffset",
  array: "strokeDasharray"
};
function Pl(t, e, n = 1, s = 0, i = !0) {
  t.pathLength = 1;
  const o = i ? Sl : bl;
  t[o.offset] = b.transform(-s);
  const r = b.transform(e), a = b.transform(n);
  t[o.array] = `${r} ${a}`;
}
function tr(t, {
  attrX: e,
  attrY: n,
  attrScale: s,
  pathLength: i,
  pathSpacing: o = 1,
  pathOffset: r = 0,
  // This is object creation, which we try to avoid per-frame.
  ...a
}, l, u, c) {
  if (Pn(t, a, u), l) {
    t.style.viewBox && (t.attrs.viewBox = t.style.viewBox);
    return;
  }
  t.attrs = t.style, t.style = {};
  const { attrs: h, style: f } = t;
  h.transform && (f.transform = h.transform, delete h.transform), (f.transform || h.transformOrigin) && (f.transformOrigin = h.transformOrigin ?? "50% 50%", delete h.transformOrigin), f.transform && (f.transformBox = c?.transformBox ?? "fill-box", delete h.transformBox), e !== void 0 && (h.x = e), n !== void 0 && (h.y = n), s !== void 0 && (h.scale = s), i !== void 0 && Pl(h, i, o, r, !1);
}
const er = () => ({
  ...wn(),
  attrs: {}
}), nr = (t) => typeof t == "string" && t.toLowerCase() === "svg";
function wl(t, e, n, s) {
  const i = ut(() => {
    const o = er();
    return tr(o, e, nr(s), t.transformTemplate, t.style), {
      ...o.attrs,
      style: { ...o.style }
    };
  }, [e]);
  if (t.style) {
    const o = {};
    Qi(o, t.style, t), i.style = { ...o, ...i.style };
  }
  return i;
}
const Al = [
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
function An(t) {
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
      !!(Al.indexOf(t) > -1 || /**
       * If it contains a capital letter, it's an SVG component
       */
      /[A-Z]/u.test(t))
    )
  );
}
function Cl(t, e, n, { latestValues: s }, i, o = !1) {
  const a = (An(t) ? wl : Tl)(e, s, i, t), l = hl(e, typeof t == "string", o), u = t !== ei ? { ...l, ...a, ref: n } : {}, { children: c } = e, h = ut(() => O(c) ? c.get() : c, [c]);
  return Hr(t, {
    ...u,
    children: h
  });
}
function as(t) {
  const e = [{}, {}];
  return t?.values.forEach((n, s) => {
    e[0][s] = n.get(), e[1][s] = n.getVelocity();
  }), e;
}
function Cn(t, e, n, s) {
  if (typeof e == "function") {
    const [i, o] = as(s);
    e = e(n !== void 0 ? n : t.custom, i, o);
  }
  if (typeof e == "string" && (e = t.variants && t.variants[e]), typeof e == "function") {
    const [i, o] = as(s);
    e = e(n !== void 0 ? n : t.custom, i, o);
  }
  return e;
}
function Xt(t) {
  return O(t) ? t.get() : t;
}
function Vl({ scrapeMotionValuesFromProps: t, createRenderState: e }, n, s, i) {
  return {
    latestValues: Dl(n, s, i, t),
    renderState: e()
  };
}
function Dl(t, e, n, s) {
  const i = {}, o = s(t, {});
  for (const f in o)
    i[f] = Xt(o[f]);
  let { initial: r, animate: a } = t;
  const l = le(t), u = Zi(t);
  e && u && !l && t.inherit !== !1 && (r === void 0 && (r = e.initial), a === void 0 && (a = e.animate));
  let c = n ? n.initial === !1 : !1;
  c = c || r === !1;
  const h = c ? a : r;
  if (h && typeof h != "boolean" && !ae(h)) {
    const f = Array.isArray(h) ? h : [h];
    for (let d = 0; d < f.length; d++) {
      const p = Cn(t, f[d]);
      if (p) {
        const { transitionEnd: g, transition: x, ...y } = p;
        for (const T in y) {
          let v = y[T];
          if (Array.isArray(v)) {
            const w = c ? v.length - 1 : 0;
            v = v[w];
          }
          v !== null && (i[T] = v);
        }
        for (const T in g)
          i[T] = g[T];
      }
    }
  }
  return i;
}
const sr = (t) => (e, n) => {
  const s = B(oe), i = B(re), o = () => Vl(t, e, s, i);
  return n ? o() : qe(o);
};
function Vn(t, e, n) {
  const { style: s } = t, i = {};
  for (const o in s)
    (O(s[o]) || e.style && O(e.style[o]) || Ji(o, t) || n?.getValue(o)?.liveStyle !== void 0) && (i[o] = s[o]);
  return i;
}
const Ml = /* @__PURE__ */ sr({
  scrapeMotionValuesFromProps: Vn,
  createRenderState: wn
});
function ir(t, e, n) {
  const s = Vn(t, e, n);
  for (const i in t)
    if (O(t[i]) || O(e[i])) {
      const o = Pt.indexOf(i) !== -1 ? "attr" + i.charAt(0).toUpperCase() + i.substring(1) : i;
      s[o] = t[i];
    }
  return s;
}
const Rl = /* @__PURE__ */ sr({
  scrapeMotionValuesFromProps: ir,
  createRenderState: er
}), El = Symbol.for("motionComponentSymbol");
function pt(t) {
  return t && typeof t == "object" && Object.prototype.hasOwnProperty.call(t, "current");
}
function Ll(t, e, n) {
  return ti(
    (s) => {
      s && t.onMount && t.onMount(s), e && (s ? e.mount(s) : e.unmount()), n && (typeof n == "function" ? n(s) : pt(n) && (n.current = s));
    },
    /**
     * Include externalRef in dependencies to ensure the callback updates
     * when the ref changes, allowing proper ref forwarding.
     */
    [e]
  );
}
const Dn = (t) => t.replace(/([a-z])([A-Z])/gu, "$1-$2").toLowerCase(), kl = "framerAppearId", rr = "data-" + Dn(kl), or = St({});
function jl(t, e, n, s, i) {
  const { visualElement: o } = B(oe), r = B(Xi), a = B(re), l = B(Tn).reducedMotion, u = J(null);
  s = s || r.renderer, !u.current && s && (u.current = s(t, {
    visualState: e,
    parent: o,
    props: n,
    presenceContext: a,
    blockInitialAnimation: a ? a.initial === !1 : !1,
    reducedMotionConfig: l
  }));
  const c = u.current, h = B(or);
  c && !c.projection && i && (c.type === "html" || c.type === "svg") && Bl(u.current, n, i, h);
  const f = J(!1);
  Qs(() => {
    c && f.current && c.update(n, a);
  });
  const d = n[rr], p = J(!!d && !window.MotionHandoffIsComplete?.(d) && window.MotionHasOptimisedAnimation?.(d));
  return si(() => {
    c && (f.current = !0, window.MotionIsMounted = !0, c.updateFeatures(), c.scheduleRenderMicrotask(), p.current && c.animationState && c.animationState.animateChanges());
  }), Ye(() => {
    c && (!p.current && c.animationState && c.animationState.animateChanges(), p.current && (queueMicrotask(() => {
      window.MotionHandoffMarkAsComplete?.(d);
    }), p.current = !1), c.enteringChildren = void 0);
  }), c;
}
function Bl(t, e, n, s) {
  const { layoutId: i, layout: o, drag: r, dragConstraints: a, layoutScroll: l, layoutRoot: u, layoutCrossfade: c } = e;
  t.projection = new n(t.latestValues, e["data-framer-portal-id"] ? void 0 : ar(t.parent)), t.projection.setOptions({
    layoutId: i,
    layout: o,
    alwaysMeasureLayout: !!r || a && pt(a),
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
function ar(t) {
  if (t)
    return t.options.allowProjection !== !1 ? t.projection : ar(t.parent);
}
function ye(t, { forwardMotionProps: e = !1 } = {}, n, s) {
  n && ll(n);
  const i = An(t) ? Rl : Ml;
  function o(a, l) {
    let u;
    const c = {
      ...B(Tn),
      ...a,
      layoutId: Ol(a)
    }, { isStatic: h } = c, f = dl(a), d = i(a, h);
    if (!h && Ze) {
      Fl();
      const p = Il(c);
      u = p.MeasureLayout, f.visualElement = jl(t, d, c, s, p.ProjectionNode);
    }
    return m.jsxs(oe.Provider, { value: f, children: [u && f.visualElement ? m.jsx(u, { visualElement: f.visualElement, ...c }) : null, Cl(t, a, Ll(d, f.visualElement, l), d, h, e)] });
  }
  o.displayName = `motion.${typeof t == "string" ? t : `create(${t.displayName ?? t.name ?? ""})`}`;
  const r = Gr(o);
  return r[El] = t, r;
}
function Ol({ layoutId: t }) {
  const e = B(Xe).id;
  return e && t !== void 0 ? e + "-" + t : t;
}
function Fl(t, e) {
  B(Xi).strict;
}
function Il(t) {
  const { drag: e, layout: n } = Tt;
  if (!e && !n)
    return {};
  const s = { ...e, ...n };
  return {
    MeasureLayout: e?.isEnabled(t) || n?.isEnabled(t) ? s.MeasureLayout : void 0,
    ProjectionNode: s.ProjectionNode
  };
}
function Nl(t, e) {
  if (typeof Proxy > "u")
    return ye;
  const n = /* @__PURE__ */ new Map(), s = (o, r) => ye(o, r, t, e), i = (o, r) => s(o, r);
  return new Proxy(i, {
    /**
     * Called when `motion` is referenced with a prop: `motion.div`, `motion.input` etc.
     * The prop name is passed through as `key` and we can use that to generate a `motion`
     * DOM component with that name.
     */
    get: (o, r) => r === "create" ? s : (n.has(r) || n.set(r, ye(r, void 0, t, e)), n.get(r))
  });
}
function lr({ top: t, left: e, right: n, bottom: s }) {
  return {
    x: { min: e, max: n },
    y: { min: t, max: s }
  };
}
function Ul({ x: t, y: e }) {
  return { top: e.min, right: t.max, bottom: e.max, left: t.min };
}
function $l(t, e) {
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
function ge(t) {
  return t === void 0 || t === 1;
}
function Ne({ scale: t, scaleX: e, scaleY: n }) {
  return !ge(t) || !ge(e) || !ge(n);
}
function rt(t) {
  return Ne(t) || cr(t) || t.z || t.rotate || t.rotateX || t.rotateY || t.skewX || t.skewY;
}
function cr(t) {
  return ls(t.x) || ls(t.y);
}
function ls(t) {
  return t && t !== "0%";
}
function ee(t, e, n) {
  const s = t - n, i = e * s;
  return n + i;
}
function cs(t, e, n, s, i) {
  return i !== void 0 && (t = ee(t, i, s)), ee(t, n, s) + e;
}
function Ue(t, e = 0, n = 1, s, i) {
  t.min = cs(t.min, e, n, s, i), t.max = cs(t.max, e, n, s, i);
}
function ur(t, { x: e, y: n }) {
  Ue(t.x, e.translate, e.scale, e.originPoint), Ue(t.y, n.translate, n.scale, n.originPoint);
}
const us = 0.999999999999, hs = 1.0000000000001;
function _l(t, e, n, s = !1) {
  const i = n.length;
  if (!i)
    return;
  e.x = e.y = 1;
  let o, r;
  for (let a = 0; a < i; a++) {
    o = n[a], r = o.projectionDelta;
    const { visualElement: l } = o.options;
    l && l.props.style && l.props.style.display === "contents" || (s && o.options.layoutScroll && o.scroll && o !== o.root && yt(t, {
      x: -o.scroll.offset.x,
      y: -o.scroll.offset.y
    }), r && (e.x *= r.x.scale, e.y *= r.y.scale, ur(t, r)), s && rt(o.latestValues) && yt(t, o.latestValues));
  }
  e.x < hs && e.x > us && (e.x = 1), e.y < hs && e.y > us && (e.y = 1);
}
function mt(t, e) {
  t.min = t.min + e, t.max = t.max + e;
}
function fs(t, e, n, s, i = 0.5) {
  const o = D(t.min, t.max, i);
  Ue(t, e, n, o, s);
}
function yt(t, e) {
  fs(t.x, e.x, e.scaleX, e.scale, e.originX), fs(t.y, e.y, e.scaleY, e.scale, e.originY);
}
function hr(t, e) {
  return lr($l(t.getBoundingClientRect(), e));
}
function Wl(t, e, n) {
  const s = hr(t, n), { scroll: i } = e;
  return i && (mt(s.x, i.offset.x), mt(s.y, i.offset.y)), s;
}
const ds = () => ({
  translate: 0,
  scale: 1,
  origin: 0,
  originPoint: 0
}), gt = () => ({
  x: ds(),
  y: ds()
}), ps = () => ({ min: 0, max: 0 }), R = () => ({
  x: ps(),
  y: ps()
}), $e = { current: null }, fr = { current: !1 };
function Kl() {
  if (fr.current = !0, !!Ze)
    if (window.matchMedia) {
      const t = window.matchMedia("(prefers-reduced-motion)"), e = () => $e.current = t.matches;
      t.addEventListener("change", e), e();
    } else
      $e.current = !1;
}
const Hl = /* @__PURE__ */ new WeakMap();
function Gl(t, e, n) {
  for (const s in e) {
    const i = e[s], o = n[s];
    if (O(i))
      t.addValue(s, i);
    else if (O(o))
      t.addValue(s, xt(i, { owner: t }));
    else if (o !== i)
      if (t.hasValue(s)) {
        const r = t.getValue(s);
        r.liveStyle === !0 ? r.jump(i) : r.hasAnimated || r.set(i);
      } else {
        const r = t.getStaticValue(s);
        t.addValue(s, xt(r !== void 0 ? r : i, { owner: t }));
      }
  }
  for (const s in n)
    e[s] === void 0 && t.removeValue(s);
  return e;
}
const ms = [
  "AnimationStart",
  "AnimationComplete",
  "Update",
  "BeforeLayoutMeasure",
  "LayoutMeasure",
  "LayoutAnimationStart",
  "LayoutAnimationComplete"
];
class Yl {
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
    this.current = null, this.children = /* @__PURE__ */ new Set(), this.isVariantNode = !1, this.isControllingVariants = !1, this.shouldReduceMotion = null, this.values = /* @__PURE__ */ new Map(), this.KeyframeResolver = mn, this.features = {}, this.valueSubscriptions = /* @__PURE__ */ new Map(), this.prevMotionValues = {}, this.events = {}, this.propEventSubscriptions = {}, this.notifyUpdate = () => this.notify("Update", this.latestValues), this.render = () => {
      this.current && (this.triggerBuild(), this.renderInstance(this.current, this.renderState, this.props.style, this.projection));
    }, this.renderScheduledAt = 0, this.scheduleRender = () => {
      const f = N.now();
      this.renderScheduledAt < f && (this.renderScheduledAt = f, V.render(this.render, !1, !0));
    };
    const { latestValues: l, renderState: u } = r;
    this.latestValues = l, this.baseTarget = { ...l }, this.initialValues = n.initial ? { ...l } : {}, this.renderState = u, this.parent = e, this.props = n, this.presenceContext = s, this.depth = e ? e.depth + 1 : 0, this.reducedMotionConfig = i, this.options = a, this.blockInitialAnimation = !!o, this.isControllingVariants = le(n), this.isVariantNode = Zi(n), this.isVariantNode && (this.variantChildren = /* @__PURE__ */ new Set()), this.manuallyAnimateOnMount = !!(e && e.current);
    const { willChange: c, ...h } = this.scrapeMotionValuesFromProps(n, {}, this);
    for (const f in h) {
      const d = h[f];
      l[f] !== void 0 && O(d) && d.set(l[f]);
    }
  }
  mount(e) {
    this.current = e, Hl.set(e, this), this.projection && !this.projection.instance && this.projection.mount(e), this.parent && this.isVariantNode && !this.isControllingVariants && (this.removeFromVariantTree = this.parent.addVariantChild(this)), this.values.forEach((n, s) => this.bindToMotionValue(s, n)), fr.current || Kl(), this.shouldReduceMotion = this.reducedMotionConfig === "never" ? !1 : this.reducedMotionConfig === "always" ? !0 : $e.current, this.parent?.addChild(this), this.update(this.props, this.presenceContext);
  }
  unmount() {
    this.projection && this.projection.unmount(), Q(this.notifyUpdate), Q(this.render), this.valueSubscriptions.forEach((e) => e()), this.valueSubscriptions.clear(), this.removeFromVariantTree && this.removeFromVariantTree(), this.parent?.removeChild(this);
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
    const s = wt.has(e);
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
    for (e in Tt) {
      const n = Tt[e];
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
    for (let s = 0; s < ms.length; s++) {
      const i = ms[s];
      this.propEventSubscriptions[i] && (this.propEventSubscriptions[i](), delete this.propEventSubscriptions[i]);
      const o = "on" + i, r = e[o];
      r && (this.propEventSubscriptions[i] = this.on(i, r));
    }
    this.prevMotionValues = Gl(this, this.scrapeMotionValuesFromProps(e, this.prevProps, this), this.prevMotionValues), this.handleChildMotionValue && this.handleChildMotionValue();
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
    return s === void 0 && n !== void 0 && (s = xt(n === null ? void 0 : n, { owner: this }), this.addValue(e, s)), s;
  }
  /**
   * If we're trying to animate to a previously unencountered value,
   * we need to check for it in our state and as a last resort read it
   * directly from the instance (which might have performance implications).
   */
  readValue(e, n) {
    let s = this.latestValues[e] !== void 0 || !this.current ? this.latestValues[e] : this.getBaseTargetFromProps(this.props, e) ?? this.readValueFromInstance(this.current, e, this.options);
    return s != null && (typeof s == "string" && (ii(s) || oi(s)) ? s = parseFloat(s) : !tl(s) && tt.test(n) && (s = $i(e, n)), this.setBaseTarget(e, O(s) ? s.get() : s)), O(s) ? s.get() : s;
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
      const o = Cn(this.props, n, this.presenceContext?.custom);
      o && (s = o[e]);
    }
    if (n && s !== void 0)
      return s;
    const i = this.getBaseTargetFromProps(this.props, e);
    return i !== void 0 && !O(i) ? i : this.initialValues[e] !== void 0 && s === void 0 ? void 0 : this.baseTarget[e];
  }
  on(e, n) {
    return this.events[e] || (this.events[e] = new nn()), this.events[e].add(n);
  }
  notify(e, ...n) {
    this.events[e] && this.events[e].notify(...n);
  }
  scheduleRenderMicrotask() {
    vn.render(this.render);
  }
}
class dr extends Yl {
  constructor() {
    super(...arguments), this.KeyframeResolver = _a;
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
function pr(t, { style: e, vars: n }, s, i) {
  const o = t.style;
  let r;
  for (r in e)
    o[r] = e[r];
  i?.applyProjectionStyles(o, s);
  for (r in n)
    o.setProperty(r, n[r]);
}
function zl(t) {
  return window.getComputedStyle(t);
}
class Xl extends dr {
  constructor() {
    super(...arguments), this.type = "html", this.renderInstance = pr;
  }
  readValueFromInstance(e, n) {
    if (wt.has(n))
      return this.projection?.isProjecting ? Le(n) : aa(e, n);
    {
      const s = zl(e), i = (on(n) ? s.getPropertyValue(n) : s[n]) || 0;
      return typeof i == "string" ? i.trim() : i;
    }
  }
  measureInstanceViewportBox(e, { transformPagePoint: n }) {
    return hr(e, n);
  }
  build(e, n, s) {
    Pn(e, n, s.transformTemplate);
  }
  scrapeMotionValuesFromProps(e, n, s) {
    return Vn(e, n, s);
  }
}
const mr = /* @__PURE__ */ new Set([
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
  pr(t, e, void 0, s);
  for (const i in e.attrs)
    t.setAttribute(mr.has(i) ? i : Dn(i), e.attrs[i]);
}
class Zl extends dr {
  constructor() {
    super(...arguments), this.type = "svg", this.isSVGTag = !1, this.measureInstanceViewportBox = R;
  }
  getBaseTargetFromProps(e, n) {
    return e[n];
  }
  readValueFromInstance(e, n) {
    if (wt.has(n)) {
      const s = Ui(n);
      return s && s.default || 0;
    }
    return n = mr.has(n) ? n : Dn(n), e.getAttribute(n);
  }
  scrapeMotionValuesFromProps(e, n, s) {
    return ir(e, n, s);
  }
  build(e, n, s) {
    tr(e, n, this.isSVGTag, s.transformTemplate, s.style);
  }
  renderInstance(e, n, s, i) {
    ql(e, n, s, i);
  }
  mount(e) {
    this.isSVGTag = nr(e.tagName), super.mount(e);
  }
}
const Jl = (t, e) => An(t) ? new Zl(e) : new Xl(e, {
  allowProjection: t !== ei
});
function vt(t, e, n) {
  const s = t.getProps();
  return Cn(s, e, n !== void 0 ? n : s.custom, t);
}
const _e = (t) => Array.isArray(t);
function Ql(t, e, n) {
  t.hasValue(e) ? t.getValue(e).set(n) : t.addValue(e, xt(n));
}
function tc(t) {
  return _e(t) ? t[t.length - 1] || 0 : t;
}
function ec(t, e) {
  const n = vt(t, e);
  let { transitionEnd: s = {}, transition: i = {}, ...o } = n || {};
  o = { ...o, ...s };
  for (const r in o) {
    const a = tc(o[r]);
    Ql(t, r, a);
  }
}
function nc(t) {
  return !!(O(t) && t.add);
}
function We(t, e) {
  const n = t.getValue("willChange");
  if (nc(n))
    return n.add(e);
  if (!n && X.WillChange) {
    const s = new X.WillChange("auto");
    t.addValue("willChange", s), s.add(e);
  }
}
function yr(t) {
  return t.props[rr];
}
const sc = (t) => t !== null;
function ic(t, { repeat: e, repeatType: n = "loop" }, s) {
  const i = t.filter(sc), o = e && n !== "loop" && e % 2 === 1 ? 0 : i.length - 1;
  return i[o];
}
const rc = {
  type: "spring",
  stiffness: 500,
  damping: 25,
  restSpeed: 10
}, oc = (t) => ({
  type: "spring",
  stiffness: 550,
  damping: t === 0 ? 2 * Math.sqrt(550) : 30,
  restSpeed: 10
}), ac = {
  type: "keyframes",
  duration: 0.8
}, lc = {
  type: "keyframes",
  ease: [0.25, 0.1, 0.35, 1],
  duration: 0.3
}, cc = (t, { keyframes: e }) => e.length > 2 ? ac : wt.has(t) ? t.startsWith("scale") ? oc(e[1]) : rc : lc;
function uc({ when: t, delay: e, delayChildren: n, staggerChildren: s, staggerDirection: i, repeat: o, repeatType: r, repeatDelay: a, from: l, elapsed: u, ...c }) {
  return !!Object.keys(c).length;
}
const Mn = (t, e, n, s = {}, i, o) => (r) => {
  const a = yn(s, t) || {}, l = a.delay || s.delay || 0;
  let { elapsed: u = 0 } = s;
  u = u - /* @__PURE__ */ G(l);
  const c = {
    keyframes: Array.isArray(n) ? n : [null, n],
    ease: "easeOut",
    velocity: e.getVelocity(),
    ...a,
    delay: -u,
    onUpdate: (f) => {
      e.set(f), a.onUpdate && a.onUpdate(f);
    },
    onComplete: () => {
      r(), a.onComplete && a.onComplete();
    },
    name: t,
    motionValue: e,
    element: o ? void 0 : i
  };
  uc(a) || Object.assign(c, cc(t, c)), c.duration && (c.duration = /* @__PURE__ */ G(c.duration)), c.repeatDelay && (c.repeatDelay = /* @__PURE__ */ G(c.repeatDelay)), c.from !== void 0 && (c.keyframes[0] = c.from);
  let h = !1;
  if ((c.type === !1 || c.duration === 0 && !c.repeatDelay) && (Fe(c), c.delay === 0 && (h = !0)), (X.instantAnimations || X.skipAnimations) && (h = !0, Fe(c), c.delay = 0), c.allowFlatten = !a.type && !a.ease, h && !o && e.get() !== void 0) {
    const f = ic(c.keyframes, a);
    if (f !== void 0) {
      V.update(() => {
        c.onUpdate(f), c.onComplete();
      });
      return;
    }
  }
  return a.isSync ? new pn(c) : new Ra(c);
};
function hc({ protectedKeys: t, needsAnimating: e }, n) {
  const s = t.hasOwnProperty(n) && e[n] !== !0;
  return e[n] = !1, s;
}
function gr(t, e, { delay: n = 0, transitionOverride: s, type: i } = {}) {
  let { transition: o = t.getDefaultTransition(), transitionEnd: r, ...a } = e;
  s && (o = s);
  const l = [], u = i && t.animationState && t.animationState.getState()[i];
  for (const c in a) {
    const h = t.getValue(c, t.latestValues[c] ?? null), f = a[c];
    if (f === void 0 || u && hc(u, c))
      continue;
    const d = {
      delay: n,
      ...yn(o || {}, c)
    }, p = h.get();
    if (p !== void 0 && !h.isAnimating && !Array.isArray(f) && f === p && !d.velocity)
      continue;
    let g = !1;
    if (window.MotionHandoffAnimation) {
      const y = yr(t);
      if (y) {
        const T = window.MotionHandoffAnimation(y, c, V);
        T !== null && (d.startTime = T, g = !0);
      }
    }
    We(t, c), h.start(Mn(c, h, f, t.shouldReduceMotion && Fi.has(c) ? { type: !1 } : d, t, g));
    const x = h.animation;
    x && l.push(x);
  }
  return r && Promise.all(l).then(() => {
    V.update(() => {
      r && ec(t, r);
    });
  }), l;
}
function vr(t, e, n, s = 0, i = 1) {
  const o = Array.from(t).sort((u, c) => u.sortNodePosition(c)).indexOf(e), r = t.size, a = (r - 1) * s;
  return typeof n == "function" ? n(o, r) : i === 1 ? o * s : a - o * s;
}
function Ke(t, e, n = {}) {
  const s = vt(t, e, n.type === "exit" ? t.presenceContext?.custom : void 0);
  let { transition: i = t.getDefaultTransition() || {} } = s || {};
  n.transitionOverride && (i = n.transitionOverride);
  const o = s ? () => Promise.all(gr(t, s, n)) : () => Promise.resolve(), r = t.variantChildren && t.variantChildren.size ? (l = 0) => {
    const { delayChildren: u = 0, staggerChildren: c, staggerDirection: h } = i;
    return fc(t, e, l, u, c, h, n);
  } : () => Promise.resolve(), { when: a } = i;
  if (a) {
    const [l, u] = a === "beforeChildren" ? [o, r] : [r, o];
    return l().then(() => u());
  } else
    return Promise.all([o(), r(n.delay)]);
}
function fc(t, e, n = 0, s = 0, i = 0, o = 1, r) {
  const a = [];
  for (const l of t.variantChildren)
    l.notify("AnimationStart", e), a.push(Ke(l, e, {
      ...r,
      delay: n + (typeof s == "function" ? 0 : s) + vr(t.variantChildren, l, s, i, o)
    }).then(() => l.notify("AnimationComplete", e)));
  return Promise.all(a);
}
function dc(t, e, n = {}) {
  t.notify("AnimationStart", e);
  let s;
  if (Array.isArray(e)) {
    const i = e.map((o) => Ke(t, o, n));
    s = Promise.all(i);
  } else if (typeof e == "string")
    s = Ke(t, e, n);
  else {
    const i = typeof e == "function" ? vt(t, e, n.custom) : e;
    s = Promise.all(gr(t, i, n));
  }
  return s.then(() => {
    t.notify("AnimationComplete", e);
  });
}
function xr(t, e) {
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
const pc = bn.length;
function Tr(t) {
  if (!t)
    return;
  if (!t.isControllingVariants) {
    const n = t.parent ? Tr(t.parent) || {} : {};
    return t.props.initial !== void 0 && (n.initial = t.props.initial), n;
  }
  const e = {};
  for (let n = 0; n < pc; n++) {
    const s = bn[n], i = t.props[s];
    (Ot(i) || i === !1) && (e[s] = i);
  }
  return e;
}
const mc = [...Sn].reverse(), yc = Sn.length;
function gc(t) {
  return (e) => Promise.all(e.map(({ animation: n, options: s }) => dc(t, n, s)));
}
function vc(t) {
  let e = gc(t), n = ys(), s = !0;
  const i = (l) => (u, c) => {
    const h = vt(t, c, l === "exit" ? t.presenceContext?.custom : void 0);
    if (h) {
      const { transition: f, transitionEnd: d, ...p } = h;
      u = { ...u, ...p, ...d };
    }
    return u;
  };
  function o(l) {
    e = l(t);
  }
  function r(l) {
    const { props: u } = t, c = Tr(t.parent) || {}, h = [], f = /* @__PURE__ */ new Set();
    let d = {}, p = 1 / 0;
    for (let x = 0; x < yc; x++) {
      const y = mc[x], T = n[y], v = u[y] !== void 0 ? u[y] : c[y], w = Ot(v), S = y === l ? T.isActive : null;
      S === !1 && (p = x);
      let A = v === c[y] && v !== u[y] && w;
      if (A && s && t.manuallyAnimateOnMount && (A = !1), T.protectedKeys = { ...d }, // If it isn't active and hasn't *just* been set as inactive
      !T.isActive && S === null || // If we didn't and don't have any defined prop for this animation type
      !v && !T.prevProp || // Or if the prop doesn't define an animation
      ae(v) || typeof v == "boolean")
        continue;
      const C = xc(T.prevProp, v);
      let P = C || // If we're making this variant active, we want to always make it active
      y === l && T.isActive && !A && w || // If we removed a higher-priority variant (i is in reverse order)
      x > p && w, L = !1;
      const F = Array.isArray(v) ? v : [v];
      let q = F.reduce(i(y), {});
      S === !1 && (q = {});
      const { prevResolvedValues: Rn = {} } = T, Nr = {
        ...Rn,
        ...q
      }, En = (k) => {
        P = !0, f.has(k) && (L = !0, f.delete(k)), T.needsAnimating[k] = !0;
        const U = t.getValue(k);
        U && (U.liveStyle = !1);
      };
      for (const k in Nr) {
        const U = q[k], st = Rn[k];
        if (d.hasOwnProperty(k))
          continue;
        let ht = !1;
        _e(U) && _e(st) ? ht = !xr(U, st) : ht = U !== st, ht ? U != null ? En(k) : f.add(k) : U !== void 0 && f.has(k) ? En(k) : T.protectedKeys[k] = !0;
      }
      T.prevProp = v, T.prevResolvedValues = q, T.isActive && (d = { ...d, ...q }), s && t.blockInitialAnimation && (P = !1);
      const Ln = A && C;
      P && (!Ln || L) && h.push(...F.map((k) => {
        const U = { type: y };
        if (typeof k == "string" && s && !Ln && t.manuallyAnimateOnMount && t.parent) {
          const { parent: st } = t, ht = vt(st, k);
          if (st.enteringChildren && ht) {
            const { delayChildren: Ur } = ht.transition || {};
            U.delay = vr(st.enteringChildren, t, Ur);
          }
        }
        return {
          animation: k,
          options: U
        };
      }));
    }
    if (f.size) {
      const x = {};
      if (typeof u.initial != "boolean") {
        const y = vt(t, Array.isArray(u.initial) ? u.initial[0] : u.initial);
        y && y.transition && (x.transition = y.transition);
      }
      f.forEach((y) => {
        const T = t.getBaseTarget(y), v = t.getValue(y);
        v && (v.liveStyle = !0), x[y] = T ?? null;
      }), h.push({ animation: x });
    }
    let g = !!h.length;
    return s && (u.initial === !1 || u.initial === u.animate) && !t.manuallyAnimateOnMount && (g = !1), s = !1, g ? e(h) : Promise.resolve();
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
      n = ys();
    }
  };
}
function xc(t, e) {
  return typeof e == "string" ? e !== t : Array.isArray(e) ? !xr(e, t) : !1;
}
function it(t = !1) {
  return {
    isActive: t,
    protectedKeys: {},
    needsAnimating: {},
    prevResolvedValues: {}
  };
}
function ys() {
  return {
    animate: it(!0),
    whileInView: it(),
    whileHover: it(),
    whileTap: it(),
    whileDrag: it(),
    whileFocus: it(),
    exit: it()
  };
}
class nt {
  constructor(e) {
    this.isMounted = !1, this.node = e;
  }
  update() {
  }
}
class Tc extends nt {
  /**
   * We dynamically generate the AnimationState manager as it contains a reference
   * to the underlying animation library. We only want to load that if we load this,
   * so people can optionally code split it out using the `m` component.
   */
  constructor(e) {
    super(e), e.animationState || (e.animationState = vc(e));
  }
  updateAnimationControlsSubscription() {
    const { animate: e } = this.node.getProps();
    ae(e) && (this.unmountControls = e.subscribe(this.node));
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
let Sc = 0;
class bc extends nt {
  constructor() {
    super(...arguments), this.id = Sc++;
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
const Pc = {
  animation: {
    Feature: Tc
  },
  exit: {
    Feature: bc
  }
};
function It(t, e, n, s = { passive: !0 }) {
  return t.addEventListener(e, n, s), () => t.removeEventListener(e, n);
}
function _t(t) {
  return {
    point: {
      x: t.pageX,
      y: t.pageY
    }
  };
}
const wc = (t) => (e) => xn(e) && t(e, _t(e));
function Rt(t, e, n, s) {
  return It(t, e, wc(n), s);
}
const Sr = 1e-4, Ac = 1 - Sr, Cc = 1 + Sr, br = 0.01, Vc = 0 - br, Dc = 0 + br;
function I(t) {
  return t.max - t.min;
}
function Mc(t, e, n) {
  return Math.abs(t - e) <= n;
}
function gs(t, e, n, s = 0.5) {
  t.origin = s, t.originPoint = D(e.min, e.max, t.origin), t.scale = I(n) / I(e), t.translate = D(n.min, n.max, t.origin) - t.originPoint, (t.scale >= Ac && t.scale <= Cc || isNaN(t.scale)) && (t.scale = 1), (t.translate >= Vc && t.translate <= Dc || isNaN(t.translate)) && (t.translate = 0);
}
function Et(t, e, n, s) {
  gs(t.x, e.x, n.x, s ? s.originX : void 0), gs(t.y, e.y, n.y, s ? s.originY : void 0);
}
function vs(t, e, n) {
  t.min = n.min + e.min, t.max = t.min + I(e);
}
function Rc(t, e, n) {
  vs(t.x, e.x, n.x), vs(t.y, e.y, n.y);
}
function xs(t, e, n) {
  t.min = e.min - n.min, t.max = t.min + I(e);
}
function Lt(t, e, n) {
  xs(t.x, e.x, n.x), xs(t.y, e.y, n.y);
}
function _(t) {
  return [t("x"), t("y")];
}
const Pr = ({ current: t }) => t ? t.ownerDocument.defaultView : null, Ts = (t, e) => Math.abs(t - e);
function Ec(t, e) {
  const n = Ts(t.x, e.x), s = Ts(t.y, e.y);
  return Math.sqrt(n ** 2 + s ** 2);
}
class wr {
  constructor(e, n, { transformPagePoint: s, contextWindow: i = window, dragSnapToOrigin: o = !1, distanceThreshold: r = 3 } = {}) {
    if (this.startEvent = null, this.lastMoveEvent = null, this.lastMoveEventInfo = null, this.handlers = {}, this.contextWindow = window, this.updatePoint = () => {
      if (!(this.lastMoveEvent && this.lastMoveEventInfo))
        return;
      const f = xe(this.lastMoveEventInfo, this.history), d = this.startEvent !== null, p = Ec(f.offset, { x: 0, y: 0 }) >= this.distanceThreshold;
      if (!d && !p)
        return;
      const { point: g } = f, { timestamp: x } = j;
      this.history.push({ ...g, timestamp: x });
      const { onStart: y, onMove: T } = this.handlers;
      d || (y && y(this.lastMoveEvent, f), this.startEvent = this.lastMoveEvent), T && T(this.lastMoveEvent, f);
    }, this.handlePointerMove = (f, d) => {
      this.lastMoveEvent = f, this.lastMoveEventInfo = ve(d, this.transformPagePoint), V.update(this.updatePoint, !0);
    }, this.handlePointerUp = (f, d) => {
      this.end();
      const { onEnd: p, onSessionEnd: g, resumeAnimation: x } = this.handlers;
      if (this.dragSnapToOrigin && x && x(), !(this.lastMoveEvent && this.lastMoveEventInfo))
        return;
      const y = xe(f.type === "pointercancel" ? this.lastMoveEventInfo : ve(d, this.transformPagePoint), this.history);
      this.startEvent && p && p(f, y), g && g(f, y);
    }, !xn(e))
      return;
    this.dragSnapToOrigin = o, this.handlers = n, this.transformPagePoint = s, this.distanceThreshold = r, this.contextWindow = i || window;
    const a = _t(e), l = ve(a, this.transformPagePoint), { point: u } = l, { timestamp: c } = j;
    this.history = [{ ...u, timestamp: c }];
    const { onSessionStart: h } = n;
    h && h(e, xe(l, this.history)), this.removeListeners = Nt(Rt(this.contextWindow, "pointermove", this.handlePointerMove), Rt(this.contextWindow, "pointerup", this.handlePointerUp), Rt(this.contextWindow, "pointercancel", this.handlePointerUp));
  }
  updateHandlers(e) {
    this.handlers = e;
  }
  end() {
    this.removeListeners && this.removeListeners(), Q(this.updatePoint);
  }
}
function ve(t, e) {
  return e ? { point: e(t.point) } : t;
}
function Ss(t, e) {
  return { x: t.x - e.x, y: t.y - e.y };
}
function xe({ point: t }, e) {
  return {
    point: t,
    delta: Ss(t, Ar(e)),
    offset: Ss(t, Lc(e)),
    velocity: kc(e, 0.1)
  };
}
function Lc(t) {
  return t[0];
}
function Ar(t) {
  return t[t.length - 1];
}
function kc(t, e) {
  if (t.length < 2)
    return { x: 0, y: 0 };
  let n = t.length - 1, s = null;
  const i = Ar(t);
  for (; n >= 0 && (s = t[n], !(i.timestamp - s.timestamp > /* @__PURE__ */ G(e))); )
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
function jc(t, { min: e, max: n }, s) {
  return e !== void 0 && t < e ? t = s ? D(e, t, s.min) : Math.max(t, e) : n !== void 0 && t > n && (t = s ? D(n, t, s.max) : Math.min(t, n)), t;
}
function bs(t, e, n) {
  return {
    min: e !== void 0 ? t.min + e : void 0,
    max: n !== void 0 ? t.max + n - (t.max - t.min) : void 0
  };
}
function Bc(t, { top: e, left: n, bottom: s, right: i }) {
  return {
    x: bs(t.x, n, i),
    y: bs(t.y, e, s)
  };
}
function Ps(t, e) {
  let n = e.min - t.min, s = e.max - t.max;
  return e.max - e.min < t.max - t.min && ([n, s] = [s, n]), { min: n, max: s };
}
function Oc(t, e) {
  return {
    x: Ps(t.x, e.x),
    y: Ps(t.y, e.y)
  };
}
function Fc(t, e) {
  let n = 0.5;
  const s = I(t), i = I(e);
  return i > s ? n = /* @__PURE__ */ kt(e.min, e.max - s, t.min) : s > i && (n = /* @__PURE__ */ kt(t.min, t.max - i, e.min)), z(0, 1, n);
}
function Ic(t, e) {
  const n = {};
  return e.min !== void 0 && (n.min = e.min - t.min), e.max !== void 0 && (n.max = e.max - t.min), n;
}
const He = 0.35;
function Nc(t = He) {
  return t === !1 ? t = 0 : t === !0 && (t = He), {
    x: ws(t, "left", "right"),
    y: ws(t, "top", "bottom")
  };
}
function ws(t, e, n) {
  return {
    min: As(t, e),
    max: As(t, n)
  };
}
function As(t, e) {
  return typeof t == "number" ? t : t[e] || 0;
}
const Uc = /* @__PURE__ */ new WeakMap();
class $c {
  constructor(e) {
    this.openDragLock = null, this.isDragging = !1, this.currentDirection = null, this.originPoint = { x: 0, y: 0 }, this.constraints = !1, this.hasMutatedConstraints = !1, this.elastic = R(), this.latestPointerEvent = null, this.latestPanInfo = null, this.visualElement = e;
  }
  start(e, { snapToCursor: n = !1, distanceThreshold: s } = {}) {
    const { presenceContext: i } = this.visualElement;
    if (i && i.isPresent === !1)
      return;
    const o = (h) => {
      const { dragSnapToOrigin: f } = this.getProps();
      f ? this.pauseAnimation() : this.stopAnimation(), n && this.snapToCursor(_t(h).point);
    }, r = (h, f) => {
      const { drag: d, dragPropagation: p, onDragStart: g } = this.getProps();
      if (d && !p && (this.openDragLock && this.openDragLock(), this.openDragLock = Ga(d), !this.openDragLock))
        return;
      this.latestPointerEvent = h, this.latestPanInfo = f, this.isDragging = !0, this.currentDirection = null, this.resolveConstraints(), this.visualElement.projection && (this.visualElement.projection.isAnimationBlocked = !0, this.visualElement.projection.target = void 0), _((y) => {
        let T = this.getAxisMotionValue(y).get() || 0;
        if (Y.test(T)) {
          const { projection: v } = this.visualElement;
          if (v && v.layout) {
            const w = v.layout.layoutBox[y];
            w && (T = I(w) * (parseFloat(T) / 100));
          }
        }
        this.originPoint[y] = T;
      }), g && V.postRender(() => g(h, f)), We(this.visualElement, "transform");
      const { animationState: x } = this.visualElement;
      x && x.setActive("whileDrag", !0);
    }, a = (h, f) => {
      this.latestPointerEvent = h, this.latestPanInfo = f;
      const { dragPropagation: d, dragDirectionLock: p, onDirectionLock: g, onDrag: x } = this.getProps();
      if (!d && !this.openDragLock)
        return;
      const { offset: y } = f;
      if (p && this.currentDirection === null) {
        this.currentDirection = _c(y), this.currentDirection !== null && g && g(this.currentDirection);
        return;
      }
      this.updateAxis("x", f.point, y), this.updateAxis("y", f.point, y), this.visualElement.render(), x && x(h, f);
    }, l = (h, f) => {
      this.latestPointerEvent = h, this.latestPanInfo = f, this.stop(h, f), this.latestPointerEvent = null, this.latestPanInfo = null;
    }, u = () => _((h) => this.getAnimationState(h) === "paused" && this.getAxisMotionValue(h).animation?.play()), { dragSnapToOrigin: c } = this.getProps();
    this.panSession = new wr(e, {
      onSessionStart: o,
      onStart: r,
      onMove: a,
      onSessionEnd: l,
      resumeAnimation: u
    }, {
      transformPagePoint: this.visualElement.getTransformPagePoint(),
      dragSnapToOrigin: c,
      distanceThreshold: s,
      contextWindow: Pr(this.visualElement)
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
    if (!s || !Gt(e, i, this.currentDirection))
      return;
    const o = this.getAxisMotionValue(e);
    let r = this.originPoint[e] + s[e];
    this.constraints && this.constraints[e] && (r = jc(r, this.constraints[e], this.elastic[e])), o.set(r);
  }
  resolveConstraints() {
    const { dragConstraints: e, dragElastic: n } = this.getProps(), s = this.visualElement.projection && !this.visualElement.projection.layout ? this.visualElement.projection.measure(!1) : this.visualElement.projection?.layout, i = this.constraints;
    e && pt(e) ? this.constraints || (this.constraints = this.resolveRefConstraints()) : e && s ? this.constraints = Bc(s.layoutBox, e) : this.constraints = !1, this.elastic = Nc(n), i !== this.constraints && s && this.constraints && !this.hasMutatedConstraints && _((o) => {
      this.constraints !== !1 && this.getAxisMotionValue(o) && (this.constraints[o] = Ic(s.layoutBox[o], this.constraints[o]));
    });
  }
  resolveRefConstraints() {
    const { dragConstraints: e, onMeasureDragConstraints: n } = this.getProps();
    if (!e || !pt(e))
      return !1;
    const s = e.current, { projection: i } = this.visualElement;
    if (!i || !i.layout)
      return !1;
    const o = Wl(s, i.root, this.visualElement.getTransformPagePoint());
    let r = Oc(i.layout.layoutBox, o);
    if (n) {
      const a = n(Ul(r));
      this.hasMutatedConstraints = !!a, a && (r = lr(a));
    }
    return r;
  }
  startAnimation(e) {
    const { drag: n, dragMomentum: s, dragElastic: i, dragTransition: o, dragSnapToOrigin: r, onDragTransitionEnd: a } = this.getProps(), l = this.constraints || {}, u = _((c) => {
      if (!Gt(c, n, this.currentDirection))
        return;
      let h = l && l[c] || {};
      r && (h = { min: 0, max: 0 });
      const f = i ? 200 : 1e6, d = i ? 40 : 1e7, p = {
        type: "inertia",
        velocity: s ? e[c] : 0,
        bounceStiffness: f,
        bounceDamping: d,
        timeConstant: 750,
        restDelta: 1,
        restSpeed: 10,
        ...o,
        ...h
      };
      return this.startAxisValueAnimation(c, p);
    });
    return Promise.all(u).then(a);
  }
  startAxisValueAnimation(e, n) {
    const s = this.getAxisMotionValue(e);
    return We(this.visualElement, e), s.start(Mn(e, s, 0, n, this.visualElement, !1));
  }
  stopAnimation() {
    _((e) => this.getAxisMotionValue(e).stop());
  }
  pauseAnimation() {
    _((e) => this.getAxisMotionValue(e).animation?.pause());
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
    _((n) => {
      const { drag: s } = this.getProps();
      if (!Gt(n, s, this.currentDirection))
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
    if (!pt(n) || !s || !this.constraints)
      return;
    this.stopAnimation();
    const i = { x: 0, y: 0 };
    _((r) => {
      const a = this.getAxisMotionValue(r);
      if (a && this.constraints !== !1) {
        const l = a.get();
        i[r] = Fc({ min: l, max: l }, this.constraints[r]);
      }
    });
    const { transformTemplate: o } = this.visualElement.getProps();
    this.visualElement.current.style.transform = o ? o({}, "") : "none", s.root && s.root.updateScroll(), s.updateLayout(), this.resolveConstraints(), _((r) => {
      if (!Gt(r, e, null))
        return;
      const a = this.getAxisMotionValue(r), { min: l, max: u } = this.constraints[r];
      a.set(D(l, u, i[r]));
    });
  }
  addListeners() {
    if (!this.visualElement.current)
      return;
    Uc.set(this.visualElement, this);
    const e = this.visualElement.current, n = Rt(e, "pointerdown", (l) => {
      const { drag: u, dragListener: c = !0 } = this.getProps();
      u && c && this.start(l);
    }), s = () => {
      const { dragConstraints: l } = this.getProps();
      pt(l) && l.current && (this.constraints = this.resolveRefConstraints());
    }, { projection: i } = this.visualElement, o = i.addEventListener("measure", s);
    i && !i.layout && (i.root && i.root.updateScroll(), i.updateLayout()), V.read(s);
    const r = It(window, "resize", () => this.scalePositionWithinConstraints()), a = i.addEventListener("didUpdate", (({ delta: l, hasLayoutChanged: u }) => {
      this.isDragging && u && (_((c) => {
        const h = this.getAxisMotionValue(c);
        h && (this.originPoint[c] += l[c].translate, h.set(h.get() + l[c].translate));
      }), this.visualElement.render());
    }));
    return () => {
      r(), n(), o(), a && a();
    };
  }
  getProps() {
    const e = this.visualElement.getProps(), { drag: n = !1, dragDirectionLock: s = !1, dragPropagation: i = !1, dragConstraints: o = !1, dragElastic: r = He, dragMomentum: a = !0 } = e;
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
function Gt(t, e, n) {
  return (e === !0 || e === t) && (n === null || n === t);
}
function _c(t, e = 10) {
  let n = null;
  return Math.abs(t.y) > e ? n = "y" : Math.abs(t.x) > e && (n = "x"), n;
}
class Wc extends nt {
  constructor(e) {
    super(e), this.removeGroupControls = K, this.removeListeners = K, this.controls = new $c(e);
  }
  mount() {
    const { dragControls: e } = this.node.getProps();
    e && (this.removeGroupControls = e.subscribe(this.controls)), this.removeListeners = this.controls.addListeners() || K;
  }
  unmount() {
    this.removeGroupControls(), this.removeListeners();
  }
}
const Cs = (t) => (e, n) => {
  t && V.postRender(() => t(e, n));
};
class Kc extends nt {
  constructor() {
    super(...arguments), this.removePointerDownListener = K;
  }
  onPointerDown(e) {
    this.session = new wr(e, this.createPanHandlers(), {
      transformPagePoint: this.node.getTransformPagePoint(),
      contextWindow: Pr(this.node)
    });
  }
  createPanHandlers() {
    const { onPanSessionStart: e, onPanStart: n, onPan: s, onPanEnd: i } = this.node.getProps();
    return {
      onSessionStart: Cs(e),
      onStart: Cs(n),
      onMove: s,
      onEnd: (o, r) => {
        delete this.session, i && V.postRender(() => i(o, r));
      }
    };
  }
  mount() {
    this.removePointerDownListener = Rt(this.node.current, "pointerdown", (e) => this.onPointerDown(e));
  }
  update() {
    this.session && this.session.updateHandlers(this.createPanHandlers());
  }
  unmount() {
    this.removePointerDownListener(), this.session && this.session.end();
  }
}
const qt = {
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
function Vs(t, e) {
  return e.max === e.min ? 0 : t / (e.max - e.min) * 100;
}
const Ct = {
  correct: (t, e) => {
    if (!e.target)
      return t;
    if (typeof t == "string")
      if (b.test(t))
        t = parseFloat(t);
      else
        return t;
    const n = Vs(t, e.target.x), s = Vs(t, e.target.y);
    return `${n}% ${s}%`;
  }
}, Hc = {
  correct: (t, { treeScale: e, projectionDelta: n }) => {
    const s = t, i = tt.parse(t);
    if (i.length > 5)
      return s;
    const o = tt.createTransformer(t), r = typeof i[0] != "number" ? 1 : 0, a = n.x.scale * e.x, l = n.y.scale * e.y;
    i[0 + r] /= a, i[1 + r] /= l;
    const u = D(a, l, 0.5);
    return typeof i[2 + r] == "number" && (i[2 + r] /= u), typeof i[3 + r] == "number" && (i[3 + r] /= u), o(i);
  }
};
let Te = !1;
class Gc extends Yr {
  /**
   * This only mounts projection nodes for components that
   * need measuring, we might want to do it for all components
   * in order to incorporate transforms
   */
  componentDidMount() {
    const { visualElement: e, layoutGroup: n, switchLayoutGroup: s, layoutId: i } = this.props, { projection: o } = e;
    pl(Yc), o && (n.group && n.group.add(o), s && s.register && i && s.register(o), Te && o.root.didUpdate(), o.addEventListener("animationComplete", () => {
      this.safeToRemove();
    }), o.setOptions({
      ...o.options,
      onExitComplete: () => this.safeToRemove()
    })), qt.hasEverUpdated = !0;
  }
  getSnapshotBeforeUpdate(e) {
    const { layoutDependency: n, visualElement: s, drag: i, isPresent: o } = this.props, { projection: r } = s;
    return r && (r.isPresent = o, Te = !0, i || e.layoutDependency !== n || n === void 0 || e.isPresent !== o ? r.willUpdate() : this.safeToRemove(), e.isPresent !== o && (o ? r.promote() : r.relegate() || V.postRender(() => {
      const a = r.getStack();
      (!a || !a.members.length) && this.safeToRemove();
    }))), null;
  }
  componentDidUpdate() {
    const { projection: e } = this.props.visualElement;
    e && (e.root.didUpdate(), vn.postRender(() => {
      !e.currentAnimation && e.isLead() && this.safeToRemove();
    }));
  }
  componentWillUnmount() {
    const { visualElement: e, layoutGroup: n, switchLayoutGroup: s } = this.props, { projection: i } = e;
    Te = !0, i && (i.scheduleCheckAfterUnmount(), n && n.group && n.group.remove(i), s && s.deregister && s.deregister(i));
  }
  safeToRemove() {
    const { safeToRemove: e } = this.props;
    e && e();
  }
  render() {
    return null;
  }
}
function Cr(t) {
  const [e, n] = zi(), s = B(Xe);
  return m.jsx(Gc, { ...t, layoutGroup: s, switchLayoutGroup: B(or), isPresent: e, safeToRemove: n });
}
const Yc = {
  borderRadius: {
    ...Ct,
    applyTo: [
      "borderTopLeftRadius",
      "borderTopRightRadius",
      "borderBottomLeftRadius",
      "borderBottomRightRadius"
    ]
  },
  borderTopLeftRadius: Ct,
  borderTopRightRadius: Ct,
  borderBottomLeftRadius: Ct,
  borderBottomRightRadius: Ct,
  boxShadow: Hc
};
function zc(t, e, n) {
  const s = O(t) ? t : xt(t);
  return s.start(Mn("", s, e, n)), s.animation;
}
const Xc = (t, e) => t.depth - e.depth;
class qc {
  constructor() {
    this.children = [], this.isDirty = !1;
  }
  add(e) {
    Je(this.children, e), this.isDirty = !0;
  }
  remove(e) {
    Qe(this.children, e), this.isDirty = !0;
  }
  forEach(e) {
    this.isDirty && this.children.sort(Xc), this.isDirty = !1, this.children.forEach(e);
  }
}
function Zc(t, e) {
  const n = N.now(), s = ({ timestamp: i }) => {
    const o = i - n;
    o >= e && (Q(s), t(o - e));
  };
  return V.setup(s, !0), () => Q(s);
}
const Vr = ["TopLeft", "TopRight", "BottomLeft", "BottomRight"], Jc = Vr.length, Ds = (t) => typeof t == "string" ? parseFloat(t) : t, Ms = (t) => typeof t == "number" || b.test(t);
function Qc(t, e, n, s, i, o) {
  i ? (t.opacity = D(0, n.opacity ?? 1, tu(s)), t.opacityExit = D(e.opacity ?? 1, 0, eu(s))) : o && (t.opacity = D(e.opacity ?? 1, n.opacity ?? 1, s));
  for (let r = 0; r < Jc; r++) {
    const a = `border${Vr[r]}Radius`;
    let l = Rs(e, a), u = Rs(n, a);
    if (l === void 0 && u === void 0)
      continue;
    l || (l = 0), u || (u = 0), l === 0 || u === 0 || Ms(l) === Ms(u) ? (t[a] = Math.max(D(Ds(l), Ds(u), s), 0), (Y.test(u) || Y.test(l)) && (t[a] += "%")) : t[a] = u;
  }
  (e.rotate || n.rotate) && (t.rotate = D(e.rotate || 0, n.rotate || 0, s));
}
function Rs(t, e) {
  return t[e] !== void 0 ? t[e] : t.borderRadius;
}
const tu = /* @__PURE__ */ Dr(0, 0.5, pi), eu = /* @__PURE__ */ Dr(0.5, 0.95, K);
function Dr(t, e, n) {
  return (s) => s < t ? 0 : s > e ? 1 : n(/* @__PURE__ */ kt(t, e, s));
}
function Es(t, e) {
  t.min = e.min, t.max = e.max;
}
function $(t, e) {
  Es(t.x, e.x), Es(t.y, e.y);
}
function Ls(t, e) {
  t.translate = e.translate, t.scale = e.scale, t.originPoint = e.originPoint, t.origin = e.origin;
}
function ks(t, e, n, s, i) {
  return t -= e, t = ee(t, 1 / n, s), i !== void 0 && (t = ee(t, 1 / i, s)), t;
}
function nu(t, e = 0, n = 1, s = 0.5, i, o = t, r = t) {
  if (Y.test(e) && (e = parseFloat(e), e = D(r.min, r.max, e / 100) - r.min), typeof e != "number")
    return;
  let a = D(o.min, o.max, s);
  t === o && (a -= e), t.min = ks(t.min, e, n, a, i), t.max = ks(t.max, e, n, a, i);
}
function js(t, e, [n, s, i], o, r) {
  nu(t, e[n], e[s], e[i], e.scale, o, r);
}
const su = ["x", "scaleX", "originX"], iu = ["y", "scaleY", "originY"];
function Bs(t, e, n, s) {
  js(t.x, e, su, n ? n.x : void 0, s ? s.x : void 0), js(t.y, e, iu, n ? n.y : void 0, s ? s.y : void 0);
}
function Os(t) {
  return t.translate === 0 && t.scale === 1;
}
function Mr(t) {
  return Os(t.x) && Os(t.y);
}
function Fs(t, e) {
  return t.min === e.min && t.max === e.max;
}
function ru(t, e) {
  return Fs(t.x, e.x) && Fs(t.y, e.y);
}
function Is(t, e) {
  return Math.round(t.min) === Math.round(e.min) && Math.round(t.max) === Math.round(e.max);
}
function Rr(t, e) {
  return Is(t.x, e.x) && Is(t.y, e.y);
}
function Ns(t) {
  return I(t.x) / I(t.y);
}
function Us(t, e) {
  return t.translate === e.translate && t.scale === e.scale && t.originPoint === e.originPoint;
}
class ou {
  constructor() {
    this.members = [];
  }
  add(e) {
    Je(this.members, e), e.scheduleRender();
  }
  remove(e) {
    if (Qe(this.members, e), e === this.prevLead && (this.prevLead = void 0), e === this.lead) {
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
function au(t, e, n) {
  let s = "";
  const i = t.x.translate / e.x, o = t.y.translate / e.y, r = n?.z || 0;
  if ((i || o || r) && (s = `translate3d(${i}px, ${o}px, ${r}px) `), (e.x !== 1 || e.y !== 1) && (s += `scale(${1 / e.x}, ${1 / e.y}) `), n) {
    const { transformPerspective: u, rotate: c, rotateX: h, rotateY: f, skewX: d, skewY: p } = n;
    u && (s = `perspective(${u}px) ${s}`), c && (s += `rotate(${c}deg) `), h && (s += `rotateX(${h}deg) `), f && (s += `rotateY(${f}deg) `), d && (s += `skewX(${d}deg) `), p && (s += `skewY(${p}deg) `);
  }
  const a = t.x.scale * e.x, l = t.y.scale * e.y;
  return (a !== 1 || l !== 1) && (s += `scale(${a}, ${l})`), s || "none";
}
const Se = ["", "X", "Y", "Z"], lu = 1e3;
let cu = 0;
function be(t, e, n, s) {
  const { latestValues: i } = e;
  i[t] && (n[t] = i[t], e.setStaticValue(t, 0), s && (s[t] = 0));
}
function Er(t) {
  if (t.hasCheckedOptimisedAppear = !0, t.root === t)
    return;
  const { visualElement: e } = t.options;
  if (!e)
    return;
  const n = yr(e);
  if (window.MotionHasOptimisedAnimation(n, "transform")) {
    const { layout: i, layoutId: o } = t.options;
    window.MotionCancelOptimisedAnimation(n, "transform", V, !(i || o));
  }
  const { parent: s } = t;
  s && !s.hasCheckedOptimisedAppear && Er(s);
}
function Lr({ attachResizeListener: t, defaultParent: e, measureScroll: n, checkIsScrollRoot: s, resetTransform: i }) {
  return class {
    constructor(r = {}, a = e?.()) {
      this.id = cu++, this.animationId = 0, this.animationCommitId = 0, this.children = /* @__PURE__ */ new Set(), this.options = {}, this.isTreeAnimating = !1, this.isAnimationBlocked = !1, this.isLayoutDirty = !1, this.isProjectionDirty = !1, this.isSharedProjectionDirty = !1, this.isTransformDirty = !1, this.updateManuallyBlocked = !1, this.updateBlockedByResize = !1, this.isUpdating = !1, this.isSVG = !1, this.needsReset = !1, this.shouldResetTransform = !1, this.hasCheckedOptimisedAppear = !1, this.treeScale = { x: 1, y: 1 }, this.eventHandlers = /* @__PURE__ */ new Map(), this.hasTreeAnimated = !1, this.updateScheduled = !1, this.scheduleUpdate = () => this.update(), this.projectionUpdateScheduled = !1, this.checkUpdateFailed = () => {
        this.isUpdating && (this.isUpdating = !1, this.clearAllSnapshots());
      }, this.updateProjection = () => {
        this.projectionUpdateScheduled = !1, this.nodes.forEach(fu), this.nodes.forEach(yu), this.nodes.forEach(gu), this.nodes.forEach(du);
      }, this.resolvedRelativeTargetAt = 0, this.hasProjected = !1, this.isVisible = !0, this.animationProgress = 0, this.sharedNodes = /* @__PURE__ */ new Map(), this.latestValues = r, this.root = a ? a.root || a : this, this.path = a ? [...a.path, a] : [], this.parent = a, this.depth = a ? a.depth + 1 : 0;
      for (let l = 0; l < this.path.length; l++)
        this.path[l].shouldResetTransform = !0;
      this.root === this && (this.nodes = new qc());
    }
    addEventListener(r, a) {
      return this.eventHandlers.has(r) || this.eventHandlers.set(r, new nn()), this.eventHandlers.get(r).add(a);
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
      this.isSVG = Yi(r) && !Ja(r), this.instance = r;
      const { layoutId: a, layout: l, visualElement: u } = this.options;
      if (u && !u.current && u.mount(r), this.root.nodes.add(this), this.parent && this.parent.children.add(this), this.root.hasTreeAnimated && (l || a) && (this.isLayoutDirty = !0), t) {
        let c, h = 0;
        const f = () => this.root.updateBlockedByResize = !1;
        V.read(() => {
          h = window.innerWidth;
        }), t(r, () => {
          const d = window.innerWidth;
          d !== h && (h = d, this.root.updateBlockedByResize = !0, c && c(), c = Zc(f, 250), qt.hasAnimatedSinceResize && (qt.hasAnimatedSinceResize = !1, this.nodes.forEach(Ws)));
        });
      }
      a && this.root.registerSharedNode(a, this), this.options.animate !== !1 && u && (a || l) && this.addEventListener("didUpdate", ({ delta: c, hasLayoutChanged: h, hasRelativeLayoutChanged: f, layout: d }) => {
        if (this.isTreeAnimationBlocked()) {
          this.target = void 0, this.relativeTarget = void 0;
          return;
        }
        const p = this.options.transition || u.getDefaultTransition() || bu, { onLayoutAnimationStart: g, onLayoutAnimationComplete: x } = u.getProps(), y = !this.targetLayout || !Rr(this.targetLayout, d), T = !h && f;
        if (this.options.layoutRoot || this.resumeFrom || T || h && (y || !this.currentAnimation)) {
          this.resumeFrom && (this.resumingFrom = this.resumeFrom, this.resumingFrom.resumingFrom = void 0);
          const v = {
            ...yn(p, "layout"),
            onPlay: g,
            onComplete: x
          };
          (u.shouldReduceMotion || this.options.layoutRoot) && (v.delay = 0, v.type = !1), this.startAnimation(v), this.setAnimationOrigin(c, T);
        } else
          h || Ws(this), this.isLead() && this.options.onExitComplete && this.options.onExitComplete();
        this.targetLayout = d;
      });
    }
    unmount() {
      this.options.layoutId && this.willUpdate(), this.root.nodes.remove(this);
      const r = this.getStack();
      r && r.remove(this), this.parent && this.parent.children.delete(this), this.instance = void 0, this.eventHandlers.clear(), Q(this.updateProjection);
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
      this.isUpdateBlocked() || (this.isUpdating = !0, this.nodes && this.nodes.forEach(vu), this.animationId++);
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
      if (window.MotionCancelOptimisedAnimation && !this.hasCheckedOptimisedAppear && Er(this), !this.root.isUpdating && this.root.startUpdate(), this.isLayoutDirty)
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
        this.unblockUpdate(), this.clearAllSnapshots(), this.nodes.forEach($s);
        return;
      }
      if (this.animationId <= this.animationCommitId) {
        this.nodes.forEach(_s);
        return;
      }
      this.animationCommitId = this.animationId, this.isUpdating ? (this.isUpdating = !1, this.nodes.forEach(mu), this.nodes.forEach(uu), this.nodes.forEach(hu)) : this.nodes.forEach(_s), this.clearAllSnapshots();
      const a = N.now();
      j.delta = z(0, 1e3 / 60, a - j.timestamp), j.timestamp = a, j.isProcessing = !0, ue.update.process(j), ue.preRender.process(j), ue.render.process(j), j.isProcessing = !1;
    }
    didUpdate() {
      this.updateScheduled || (this.updateScheduled = !0, vn.read(this.scheduleUpdate));
    }
    clearAllSnapshots() {
      this.nodes.forEach(pu), this.sharedNodes.forEach(xu);
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
      this.snapshot || !this.instance || (this.snapshot = this.measure(), this.snapshot && !I(this.snapshot.measuredBox.x) && !I(this.snapshot.measuredBox.y) && (this.snapshot = void 0));
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
      const r = this.isLayoutDirty || this.shouldResetTransform || this.options.alwaysMeasureLayout, a = this.projectionDelta && !Mr(this.projectionDelta), l = this.getTransformTemplate(), u = l ? l(this.latestValues, "") : void 0, c = u !== this.prevTransformTemplateValue;
      r && this.instance && (a || rt(this.latestValues) || c) && (i(this.instance, u), this.shouldResetTransform = !1, this.scheduleRender());
    }
    measure(r = !0) {
      const a = this.measurePageBox();
      let l = this.removeElementScroll(a);
      return r && (l = this.removeTransform(l)), Pu(l), {
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
      if (!(this.scroll?.wasRoot || this.path.some(wu))) {
        const { scroll: u } = this.root;
        u && (mt(a.x, u.offset.x), mt(a.y, u.offset.y));
      }
      return a;
    }
    removeElementScroll(r) {
      const a = R();
      if ($(a, r), this.scroll?.wasRoot)
        return a;
      for (let l = 0; l < this.path.length; l++) {
        const u = this.path[l], { scroll: c, options: h } = u;
        u !== this.root && c && h.layoutScroll && (c.wasRoot && $(a, r), mt(a.x, c.offset.x), mt(a.y, c.offset.y));
      }
      return a;
    }
    applyTransform(r, a = !1) {
      const l = R();
      $(l, r);
      for (let u = 0; u < this.path.length; u++) {
        const c = this.path[u];
        !a && c.options.layoutScroll && c.scroll && c !== c.root && yt(l, {
          x: -c.scroll.offset.x,
          y: -c.scroll.offset.y
        }), rt(c.latestValues) && yt(l, c.latestValues);
      }
      return rt(this.latestValues) && yt(l, this.latestValues), l;
    }
    removeTransform(r) {
      const a = R();
      $(a, r);
      for (let l = 0; l < this.path.length; l++) {
        const u = this.path[l];
        if (!u.instance || !rt(u.latestValues))
          continue;
        Ne(u.latestValues) && u.updateSnapshot();
        const c = R(), h = u.measurePageBox();
        $(c, h), Bs(a, u.latestValues, u.snapshot ? u.snapshot.layoutBox : void 0, c);
      }
      return rt(this.latestValues) && Bs(a, this.latestValues), a;
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
      this.relativeParent && this.relativeParent.resolvedRelativeTargetAt !== j.timestamp && this.relativeParent.resolveTargetDelta(!0);
    }
    resolveTargetDelta(r = !1) {
      const a = this.getLead();
      this.isProjectionDirty || (this.isProjectionDirty = a.isProjectionDirty), this.isTransformDirty || (this.isTransformDirty = a.isTransformDirty), this.isSharedProjectionDirty || (this.isSharedProjectionDirty = a.isSharedProjectionDirty);
      const l = !!this.resumingFrom || this !== a;
      if (!(r || l && this.isSharedProjectionDirty || this.isProjectionDirty || this.parent?.isProjectionDirty || this.attemptToResolveRelativeTarget || this.root.updateBlockedByResize))
        return;
      const { layout: c, layoutId: h } = this.options;
      if (!(!this.layout || !(c || h))) {
        if (this.resolvedRelativeTargetAt = j.timestamp, !this.targetDelta && !this.relativeTarget) {
          const f = this.getClosestProjectingParent();
          f && f.layout && this.animationProgress !== 1 ? (this.relativeParent = f, this.forceRelativeParentToResolveTarget(), this.relativeTarget = R(), this.relativeTargetOrigin = R(), Lt(this.relativeTargetOrigin, this.layout.layoutBox, f.layout.layoutBox), $(this.relativeTarget, this.relativeTargetOrigin)) : this.relativeParent = this.relativeTarget = void 0;
        }
        if (!(!this.relativeTarget && !this.targetDelta) && (this.target || (this.target = R(), this.targetWithTransforms = R()), this.relativeTarget && this.relativeTargetOrigin && this.relativeParent && this.relativeParent.target ? (this.forceRelativeParentToResolveTarget(), Rc(this.target, this.relativeTarget, this.relativeParent.target)) : this.targetDelta ? (this.resumingFrom ? this.target = this.applyTransform(this.layout.layoutBox) : $(this.target, this.layout.layoutBox), ur(this.target, this.targetDelta)) : $(this.target, this.layout.layoutBox), this.attemptToResolveRelativeTarget)) {
          this.attemptToResolveRelativeTarget = !1;
          const f = this.getClosestProjectingParent();
          f && !!f.resumingFrom == !!this.resumingFrom && !f.options.layoutScroll && f.target && this.animationProgress !== 1 ? (this.relativeParent = f, this.forceRelativeParentToResolveTarget(), this.relativeTarget = R(), this.relativeTargetOrigin = R(), Lt(this.relativeTargetOrigin, this.target, f.target), $(this.relativeTarget, this.relativeTargetOrigin)) : this.relativeParent = this.relativeTarget = void 0;
        }
      }
    }
    getClosestProjectingParent() {
      if (!(!this.parent || Ne(this.parent.latestValues) || cr(this.parent.latestValues)))
        return this.parent.isProjecting() ? this.parent : this.parent.getClosestProjectingParent();
    }
    isProjecting() {
      return !!((this.relativeTarget || this.targetDelta || this.options.layoutRoot) && this.layout);
    }
    calcProjection() {
      const r = this.getLead(), a = !!this.resumingFrom || this !== r;
      let l = !0;
      if ((this.isProjectionDirty || this.parent?.isProjectionDirty) && (l = !1), a && (this.isSharedProjectionDirty || this.isTransformDirty) && (l = !1), this.resolvedRelativeTargetAt === j.timestamp && (l = !1), l)
        return;
      const { layout: u, layoutId: c } = this.options;
      if (this.isTreeAnimating = !!(this.parent && this.parent.isTreeAnimating || this.currentAnimation || this.pendingAnimation), this.isTreeAnimating || (this.targetDelta = this.relativeTarget = void 0), !this.layout || !(u || c))
        return;
      $(this.layoutCorrected, this.layout.layoutBox);
      const h = this.treeScale.x, f = this.treeScale.y;
      _l(this.layoutCorrected, this.treeScale, this.path, a), r.layout && !r.target && (this.treeScale.x !== 1 || this.treeScale.y !== 1) && (r.target = r.layout.layoutBox, r.targetWithTransforms = R());
      const { target: d } = r;
      if (!d) {
        this.prevProjectionDelta && (this.createProjectionDeltas(), this.scheduleRender());
        return;
      }
      !this.projectionDelta || !this.prevProjectionDelta ? this.createProjectionDeltas() : (Ls(this.prevProjectionDelta.x, this.projectionDelta.x), Ls(this.prevProjectionDelta.y, this.projectionDelta.y)), Et(this.projectionDelta, this.layoutCorrected, d, this.latestValues), (this.treeScale.x !== h || this.treeScale.y !== f || !Us(this.projectionDelta.x, this.prevProjectionDelta.x) || !Us(this.projectionDelta.y, this.prevProjectionDelta.y)) && (this.hasProjected = !0, this.scheduleRender(), this.notifyListeners("projectionUpdate", d));
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
      this.prevProjectionDelta = gt(), this.projectionDelta = gt(), this.projectionDeltaWithTransform = gt();
    }
    setAnimationOrigin(r, a = !1) {
      const l = this.snapshot, u = l ? l.latestValues : {}, c = { ...this.latestValues }, h = gt();
      (!this.relativeParent || !this.relativeParent.options.layoutRoot) && (this.relativeTarget = this.relativeTargetOrigin = void 0), this.attemptToResolveRelativeTarget = !a;
      const f = R(), d = l ? l.source : void 0, p = this.layout ? this.layout.source : void 0, g = d !== p, x = this.getStack(), y = !x || x.members.length <= 1, T = !!(g && !y && this.options.crossfade === !0 && !this.path.some(Su));
      this.animationProgress = 0;
      let v;
      this.mixTargetDelta = (w) => {
        const S = w / 1e3;
        Ks(h.x, r.x, S), Ks(h.y, r.y, S), this.setTargetDelta(h), this.relativeTarget && this.relativeTargetOrigin && this.layout && this.relativeParent && this.relativeParent.layout && (Lt(f, this.layout.layoutBox, this.relativeParent.layout.layoutBox), Tu(this.relativeTarget, this.relativeTargetOrigin, f, S), v && ru(this.relativeTarget, v) && (this.isProjectionDirty = !1), v || (v = R()), $(v, this.relativeTarget)), g && (this.animationValues = c, Qc(c, u, this.latestValues, S, T, y)), this.root.scheduleUpdateProjection(), this.scheduleRender(), this.animationProgress = S;
      }, this.mixTargetDelta(this.options.layoutRoot ? 1e3 : 0);
    }
    startAnimation(r) {
      this.notifyListeners("animationStart"), this.currentAnimation?.stop(), this.resumingFrom?.currentAnimation?.stop(), this.pendingAnimation && (Q(this.pendingAnimation), this.pendingAnimation = void 0), this.pendingAnimation = V.update(() => {
        qt.hasAnimatedSinceResize = !0, this.motionValue || (this.motionValue = xt(0)), this.currentAnimation = zc(this.motionValue, [0, 1e3], {
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
      this.currentAnimation && (this.mixTargetDelta && this.mixTargetDelta(lu), this.currentAnimation.stop()), this.completeAnimation();
    }
    applyTransformsToTarget() {
      const r = this.getLead();
      let { targetWithTransforms: a, target: l, layout: u, latestValues: c } = r;
      if (!(!a || !l || !u)) {
        if (this !== r && this.layout && u && kr(this.options.animationType, this.layout.layoutBox, u.layoutBox)) {
          l = this.target || R();
          const h = I(this.layout.layoutBox.x);
          l.x.min = r.target.x.min, l.x.max = l.x.min + h;
          const f = I(this.layout.layoutBox.y);
          l.y.min = r.target.y.min, l.y.max = l.y.min + f;
        }
        $(a, l), yt(a, c), Et(this.projectionDeltaWithTransform, this.layoutCorrected, a, c);
      }
    }
    registerSharedNode(r, a) {
      this.sharedNodes.has(r) || this.sharedNodes.set(r, new ou()), this.sharedNodes.get(r).add(a);
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
      l.z && be("z", r, u, this.animationValues);
      for (let c = 0; c < Se.length; c++)
        be(`rotate${Se[c]}`, r, u, this.animationValues), be(`skew${Se[c]}`, r, u, this.animationValues);
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
        this.needsReset = !1, r.visibility = "", r.opacity = "", r.pointerEvents = Xt(a?.pointerEvents) || "", r.transform = l ? l(this.latestValues, "") : "none";
        return;
      }
      const u = this.getLead();
      if (!this.projectionDelta || !this.layout || !u.target) {
        this.options.layoutId && (r.opacity = this.latestValues.opacity !== void 0 ? this.latestValues.opacity : 1, r.pointerEvents = Xt(a?.pointerEvents) || ""), this.hasProjected && !rt(this.latestValues) && (r.transform = l ? l({}, "") : "none", this.hasProjected = !1);
        return;
      }
      r.visibility = "";
      const c = u.animationValues || u.latestValues;
      this.applyTransformsToTarget();
      let h = au(this.projectionDeltaWithTransform, this.treeScale, c);
      l && (h = l(c, h)), r.transform = h;
      const { x: f, y: d } = this.projectionDelta;
      r.transformOrigin = `${f.origin * 100}% ${d.origin * 100}% 0`, u.animationValues ? r.opacity = u === this ? c.opacity ?? this.latestValues.opacity ?? 1 : this.preserveOpacity ? this.latestValues.opacity : c.opacityExit : r.opacity = u === this ? c.opacity !== void 0 ? c.opacity : "" : c.opacityExit !== void 0 ? c.opacityExit : 0;
      for (const p in Ft) {
        if (c[p] === void 0)
          continue;
        const { correct: g, applyTo: x, isCSSVariable: y } = Ft[p], T = h === "none" ? c[p] : g(c[p], u);
        if (x) {
          const v = x.length;
          for (let w = 0; w < v; w++)
            r[x[w]] = T;
        } else
          y ? this.options.visualElement.renderState.vars[p] = T : r[p] = T;
      }
      this.options.layoutId && (r.pointerEvents = u === this ? Xt(a?.pointerEvents) || "" : "none");
    }
    clearSnapshot() {
      this.resumeFrom = this.snapshot = void 0;
    }
    // Only run on root
    resetTree() {
      this.root.nodes.forEach((r) => r.currentAnimation?.stop()), this.root.nodes.forEach($s), this.root.sharedNodes.clear();
    }
  };
}
function uu(t) {
  t.updateLayout();
}
function hu(t) {
  const e = t.resumeFrom?.snapshot || t.snapshot;
  if (t.isLead() && t.layout && e && t.hasListeners("didUpdate")) {
    const { layoutBox: n, measuredBox: s } = t.layout, { animationType: i } = t.options, o = e.source !== t.layout.source;
    i === "size" ? _((c) => {
      const h = o ? e.measuredBox[c] : e.layoutBox[c], f = I(h);
      h.min = n[c].min, h.max = h.min + f;
    }) : kr(i, e.layoutBox, n) && _((c) => {
      const h = o ? e.measuredBox[c] : e.layoutBox[c], f = I(n[c]);
      h.max = h.min + f, t.relativeTarget && !t.currentAnimation && (t.isProjectionDirty = !0, t.relativeTarget[c].max = t.relativeTarget[c].min + f);
    });
    const r = gt();
    Et(r, n, e.layoutBox);
    const a = gt();
    o ? Et(a, t.applyTransform(s, !0), e.measuredBox) : Et(a, n, e.layoutBox);
    const l = !Mr(r);
    let u = !1;
    if (!t.resumeFrom) {
      const c = t.getClosestProjectingParent();
      if (c && !c.resumeFrom) {
        const { snapshot: h, layout: f } = c;
        if (h && f) {
          const d = R();
          Lt(d, e.layoutBox, h.layoutBox);
          const p = R();
          Lt(p, n, f.layoutBox), Rr(d, p) || (u = !0), c.options.layoutRoot && (t.relativeTarget = p, t.relativeTargetOrigin = d, t.relativeParent = c);
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
function fu(t) {
  t.parent && (t.isProjecting() || (t.isProjectionDirty = t.parent.isProjectionDirty), t.isSharedProjectionDirty || (t.isSharedProjectionDirty = !!(t.isProjectionDirty || t.parent.isProjectionDirty || t.parent.isSharedProjectionDirty)), t.isTransformDirty || (t.isTransformDirty = t.parent.isTransformDirty));
}
function du(t) {
  t.isProjectionDirty = t.isSharedProjectionDirty = t.isTransformDirty = !1;
}
function pu(t) {
  t.clearSnapshot();
}
function $s(t) {
  t.clearMeasurements();
}
function _s(t) {
  t.isLayoutDirty = !1;
}
function mu(t) {
  const { visualElement: e } = t.options;
  e && e.getProps().onBeforeLayoutMeasure && e.notify("BeforeLayoutMeasure"), t.resetTransform();
}
function Ws(t) {
  t.finishAnimation(), t.targetDelta = t.relativeTarget = t.target = void 0, t.isProjectionDirty = !0;
}
function yu(t) {
  t.resolveTargetDelta();
}
function gu(t) {
  t.calcProjection();
}
function vu(t) {
  t.resetSkewAndRotation();
}
function xu(t) {
  t.removeLeadSnapshot();
}
function Ks(t, e, n) {
  t.translate = D(e.translate, 0, n), t.scale = D(e.scale, 1, n), t.origin = e.origin, t.originPoint = e.originPoint;
}
function Hs(t, e, n, s) {
  t.min = D(e.min, n.min, s), t.max = D(e.max, n.max, s);
}
function Tu(t, e, n, s) {
  Hs(t.x, e.x, n.x, s), Hs(t.y, e.y, n.y, s);
}
function Su(t) {
  return t.animationValues && t.animationValues.opacityExit !== void 0;
}
const bu = {
  duration: 0.45,
  ease: [0.4, 0, 0.1, 1]
}, Gs = (t) => typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().includes(t), Ys = Gs("applewebkit/") && !Gs("chrome/") ? Math.round : K;
function zs(t) {
  t.min = Ys(t.min), t.max = Ys(t.max);
}
function Pu(t) {
  zs(t.x), zs(t.y);
}
function kr(t, e, n) {
  return t === "position" || t === "preserve-aspect" && !Mc(Ns(e), Ns(n), 0.2);
}
function wu(t) {
  return t !== t.root && t.scroll?.wasRoot;
}
const Au = Lr({
  attachResizeListener: (t, e) => It(t, "resize", e),
  measureScroll: () => ({
    x: document.documentElement.scrollLeft || document.body.scrollLeft,
    y: document.documentElement.scrollTop || document.body.scrollTop
  }),
  checkIsScrollRoot: () => !0
}), Pe = {
  current: void 0
}, jr = Lr({
  measureScroll: (t) => ({
    x: t.scrollLeft,
    y: t.scrollTop
  }),
  defaultParent: () => {
    if (!Pe.current) {
      const t = new Au({});
      t.mount(window), t.setOptions({ layoutScroll: !0 }), Pe.current = t;
    }
    return Pe.current;
  },
  resetTransform: (t, e) => {
    t.style.transform = e !== void 0 ? e : "none";
  },
  checkIsScrollRoot: (t) => window.getComputedStyle(t).position === "fixed"
}), Cu = {
  pan: {
    Feature: Kc
  },
  drag: {
    Feature: Wc,
    ProjectionNode: jr,
    MeasureLayout: Cr
  }
};
function Xs(t, e, n) {
  const { props: s } = t;
  t.animationState && s.whileHover && t.animationState.setActive("whileHover", n === "Start");
  const i = "onHover" + n, o = s[i];
  o && V.postRender(() => o(e, _t(e)));
}
class Vu extends nt {
  mount() {
    const { current: e } = this.node;
    e && (this.unmount = Ya(e, (n, s) => (Xs(this.node, s, "Start"), (i) => Xs(this.node, i, "End"))));
  }
  unmount() {
  }
}
class Du extends nt {
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
    this.unmount = Nt(It(this.node.current, "focus", () => this.onFocus()), It(this.node.current, "blur", () => this.onBlur()));
  }
  unmount() {
  }
}
function qs(t, e, n) {
  const { props: s } = t;
  if (t.current instanceof HTMLButtonElement && t.current.disabled)
    return;
  t.animationState && s.whileTap && t.animationState.setActive("whileTap", n === "Start");
  const i = "onTap" + (n === "End" ? "" : n), o = s[i];
  o && V.postRender(() => o(e, _t(e)));
}
class Mu extends nt {
  mount() {
    const { current: e } = this.node;
    e && (this.unmount = Za(e, (n, s) => (qs(this.node, s, "Start"), (i, { success: o }) => qs(this.node, i, o ? "End" : "Cancel")), { useGlobalTarget: this.node.props.globalTapTarget }));
  }
  unmount() {
  }
}
const Ge = /* @__PURE__ */ new WeakMap(), we = /* @__PURE__ */ new WeakMap(), Ru = (t) => {
  const e = Ge.get(t.target);
  e && e(t);
}, Eu = (t) => {
  t.forEach(Ru);
};
function Lu({ root: t, ...e }) {
  const n = t || document;
  we.has(n) || we.set(n, {});
  const s = we.get(n), i = JSON.stringify(e);
  return s[i] || (s[i] = new IntersectionObserver(Eu, { root: t, ...e })), s[i];
}
function ku(t, e, n) {
  const s = Lu(e);
  return Ge.set(t, n), s.observe(t), () => {
    Ge.delete(t), s.unobserve(t);
  };
}
const ju = {
  some: 0,
  all: 1
};
class Bu extends nt {
  constructor() {
    super(...arguments), this.hasEnteredView = !1, this.isInView = !1;
  }
  startObserver() {
    this.unmount();
    const { viewport: e = {} } = this.node.getProps(), { root: n, margin: s, amount: i = "some", once: o } = e, r = {
      root: n ? n.current : void 0,
      rootMargin: s,
      threshold: typeof i == "number" ? i : ju[i]
    }, a = (l) => {
      const { isIntersecting: u } = l;
      if (this.isInView === u || (this.isInView = u, o && !u && this.hasEnteredView))
        return;
      u && (this.hasEnteredView = !0), this.node.animationState && this.node.animationState.setActive("whileInView", u);
      const { onViewportEnter: c, onViewportLeave: h } = this.node.getProps(), f = u ? c : h;
      f && f(l);
    };
    return ku(this.node.current, r, a);
  }
  mount() {
    this.startObserver();
  }
  update() {
    if (typeof IntersectionObserver > "u")
      return;
    const { props: e, prevProps: n } = this.node;
    ["amount", "margin", "root"].some(Ou(e, n)) && this.startObserver();
  }
  unmount() {
  }
}
function Ou({ viewport: t = {} }, { viewport: e = {} } = {}) {
  return (n) => t[n] !== e[n];
}
const Fu = {
  inView: {
    Feature: Bu
  },
  tap: {
    Feature: Mu
  },
  focus: {
    Feature: Du
  },
  hover: {
    Feature: Vu
  }
}, Iu = {
  layout: {
    ProjectionNode: jr,
    MeasureLayout: Cr
  }
}, Nu = {
  ...Pc,
  ...Fu,
  ...Cu,
  ...Iu
}, et = /* @__PURE__ */ Nl(Nu, Jl), Uu = [
  {
    id: 1,
    position: "CO",
    name: "CO",
    chips: 5e3,
    dealOrder: 5,
    layoutPosition: "top",
    style: { top: "-75px", left: "50%", transform: "translateX(-50%)" }
  },
  {
    id: 2,
    position: "BTN",
    name: "BTN",
    chips: 7500,
    dealOrder: 6,
    layoutPosition: "right",
    style: { top: "100px", right: "-90px" }
  },
  {
    id: 3,
    position: "SB",
    name: "SB",
    chips: 4200,
    dealOrder: 1,
    layoutPosition: "right",
    style: { bottom: "100px", right: "-90px" }
  },
  {
    id: 4,
    position: "BB",
    name: "YOU (BB)",
    chips: 6e3,
    dealOrder: 2,
    isYou: !0,
    layoutPosition: "bottom",
    style: { bottom: "-75px", left: "50%", transform: "translateX(-50%)" }
  },
  {
    id: 5,
    position: "UTG",
    name: "UTG",
    chips: 3800,
    dealOrder: 3,
    layoutPosition: "left",
    style: { bottom: "100px", left: "-90px" }
  },
  {
    id: 6,
    position: "HJ",
    name: "HJ",
    chips: 5500,
    dealOrder: 4,
    layoutPosition: "left",
    style: { top: "100px", left: "-90px" }
  }
], $u = {
  BTN: "#f1c40f",
  SB: "#e74c3c",
  BB: "#e74c3c",
  UTG: "#3498db",
  HJ: "#9b59b6",
  CO: "#27ae60"
}, Br = "/", Zs = {
  "♥": { symbol: "SH", color: "red" },
  "♦": { symbol: "SD", color: "red" },
  "♣": { symbol: "SC", color: "black" },
  "♠": { symbol: "SS", color: "black" }
};
function Or(t) {
  if (!t) return null;
  const e = Zs[t.suit] || Zs["♠"];
  return { rankSymbol: `V${t.rank === "10" ? "T" : t.rank}`, suitSymbol: e.symbol, color: e.color };
}
function _u(t) {
  return `${Br}assets/positions/${t}.svg`;
}
function Wu() {
  return `${Br}assets/decorative/dealer-button.svg`;
}
function Fr({ rankSymbol: t, suitSymbol: e, color: n }) {
  return /* @__PURE__ */ m.jsxs("g", { style: { color: n }, children: [
    /* @__PURE__ */ m.jsx("rect", { width: "239", height: "335", x: "-119.5", y: "-167.5", rx: "12", fill: "white", stroke: "#999" }),
    /* @__PURE__ */ m.jsx("use", { href: `#${t}`, width: "32", height: "32", x: "-114.4", y: "-156" }),
    /* @__PURE__ */ m.jsx("use", { href: `#${e}`, width: "26.769", height: "26.769", x: "-111.784", y: "-119" }),
    /* @__PURE__ */ m.jsx("use", { href: `#${e}`, width: "70", height: "70", x: "-35", y: "-35" }),
    /* @__PURE__ */ m.jsxs("g", { transform: "rotate(180)", children: [
      /* @__PURE__ */ m.jsx("use", { href: `#${t}`, width: "32", height: "32", x: "-114.4", y: "-156" }),
      /* @__PURE__ */ m.jsx("use", { href: `#${e}`, width: "26.769", height: "26.769", x: "-111.784", y: "-119" })
    ] })
  ] });
}
function Ir() {
  return /* @__PURE__ */ m.jsxs("g", { children: [
    /* @__PURE__ */ m.jsx("rect", { width: "239", height: "335", x: "-119.5", y: "-167.5", rx: "12", fill: "white", stroke: "black" }),
    /* @__PURE__ */ m.jsx("rect", { width: "216", height: "312", x: "-108", y: "-156", rx: "8", fill: "#b22222" }),
    /* @__PURE__ */ m.jsx("rect", { width: "196", height: "292", x: "-98", y: "-146", rx: "4", fill: "none", stroke: "white", strokeWidth: "2" })
  ] });
}
function Ku({ card: t, dealOrder: e = 0, isFolded: n = !1, isHidden: s = !0 }) {
  const i = e * 0.15, o = s ? null : Or(t);
  return /* @__PURE__ */ m.jsx(
    et.div,
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
      children: /* @__PURE__ */ m.jsx(
        "svg",
        {
          viewBox: "-120 -168 240 336",
          preserveAspectRatio: "none",
          className: "card-image",
          children: o ? /* @__PURE__ */ m.jsx(Fr, { ...o }) : /* @__PURE__ */ m.jsx(Ir, {})
        }
      )
    }
  );
}
function Hu({ card: t, dealOrder: e = 0 }) {
  const n = e * 0.15, s = Or(t);
  return /* @__PURE__ */ m.jsx(
    et.div,
    {
      className: "community-card-wrapper",
      initial: { opacity: 0, y: -50, rotateY: 180 },
      animate: { opacity: 1, y: 0, rotateY: 0 },
      transition: { delay: n, duration: 0.4, type: "spring" },
      children: /* @__PURE__ */ m.jsx(
        "svg",
        {
          viewBox: "-120 -168 240 336",
          preserveAspectRatio: "none",
          className: "community-card-image",
          children: s ? /* @__PURE__ */ m.jsx(Fr, { ...s }) : /* @__PURE__ */ m.jsx(Ir, {})
        }
      )
    }
  );
}
function Js({ action: t, delay: e }) {
  const n = t.toLowerCase();
  return /* @__PURE__ */ m.jsx(
    et.div,
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
function Gu({ player: t, step: e, cardsDealt: n, yourCards: s, foldedPlayers: i, calledPlayers: o }) {
  const [r, a] = Ae(!1), l = n && e >= 2, u = i.includes(t.position), c = o.includes(t.position), h = t.isYou ? s : [null, null], f = $u[t.position], d = _u(t.position), p = t.layoutPosition === "top", g = t.layoutPosition === "bottom", x = t.layoutPosition === "left", y = p ? { top: "100%", left: "50%", transform: "translateX(-50%)" } : g ? { bottom: "100%", left: "50%", transform: "translateX(-50%)" } : x ? { left: "100%", top: "50%", transform: "translateY(-50%)" } : { right: "100%", top: "50%", transform: "translateY(-50%)" };
  return /* @__PURE__ */ m.jsxs(
    et.div,
    {
      className: `player ${t.isYou ? "you" : ""} ${t.layoutPosition || ""}`,
      style: t.style,
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { delay: t.id * 0.1 },
      children: [
        /* @__PURE__ */ m.jsx("div", { className: "position-icon", style: r ? { background: f } : {}, children: r ? /* @__PURE__ */ m.jsx("span", { style: { color: "#fff", fontWeight: "bold", fontSize: "14px" }, children: t.position }) : /* @__PURE__ */ m.jsx(
          "img",
          {
            src: d,
            alt: t.position,
            onError: () => a(!0)
          }
        ) }),
        /* @__PURE__ */ m.jsxs("div", { className: "player-info", children: [
          /* @__PURE__ */ m.jsx("div", { className: "player-name", style: t.isYou ? { color: f } : {}, children: t.isYou ? "YOU" : t.position }),
          /* @__PURE__ */ m.jsxs("div", { className: "player-chips", children: [
            "$",
            t.chips.toLocaleString()
          ] })
        ] }),
        /* @__PURE__ */ m.jsx("div", { className: "player-cards", style: { position: "absolute", ...y }, children: l && h.map((T, v) => /* @__PURE__ */ m.jsx(
          Ku,
          {
            card: T,
            dealOrder: t.dealOrder,
            isFolded: u,
            isHidden: !t.isYou
          },
          v
        )) }),
        /* @__PURE__ */ m.jsxs(al, { children: [
          u && /* @__PURE__ */ m.jsx(Js, { action: "FOLD", delay: 0 }),
          c && !u && /* @__PURE__ */ m.jsx(Js, { action: "CALL", delay: 0 })
        ] })
      ]
    }
  );
}
function Yu({ amount: t }) {
  return /* @__PURE__ */ m.jsxs(
    et.div,
    {
      className: "pot",
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { delay: 0.5 },
      children: [
        /* @__PURE__ */ m.jsx("div", { className: "pot-label", children: "POT" }),
        /* @__PURE__ */ m.jsxs(
          et.div,
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
function zu({ currentPhase: t }) {
  const e = ["Pre-flop", "Flop", "Turn", "River"], s = { preflop: 0, flop: 1, turn: 2, river: 3 }[t] ?? 0;
  return /* @__PURE__ */ m.jsx("div", { className: "game-phase", children: e.map((i, o) => /* @__PURE__ */ m.jsx(
    "div",
    {
      className: `phase ${o === s ? "active" : ""} ${o < s ? "completed" : ""}`,
      children: i
    },
    i
  )) });
}
function Xu({ step: t, totalSteps: e }) {
  return /* @__PURE__ */ m.jsx("div", { className: "step-indicator", children: [...Array(e)].map((n, s) => /* @__PURE__ */ m.jsx(
    "div",
    {
      className: `step-dot ${s === t ? "active" : ""} ${s < t ? "completed" : ""}`
    },
    s
  )) });
}
function qu({ gameState: t }) {
  const e = t.getState(), {
    step: n,
    totalSteps: s,
    phase: i,
    pot: o,
    communityCards: r,
    yourCards: a
  } = e, l = [], u = [];
  for (let c = 0; c <= n; c++) {
    const h = t.scenario.steps[c];
    h?.type === "action" && (h.action === "FOLD" && l.push(h.player), h.action === "CALL" && u.push(h.player));
  }
  return /* @__PURE__ */ m.jsxs("div", { className: "container embed-mode", children: [
    /* @__PURE__ */ m.jsx(zu, { currentPhase: i }),
    /* @__PURE__ */ m.jsxs("div", { className: "poker-table", children: [
      /* @__PURE__ */ m.jsx("div", { className: "table-rail" }),
      /* @__PURE__ */ m.jsx("div", { className: "table-felt" }),
      n >= 1 && Uu.map((c) => /* @__PURE__ */ m.jsx(
        Gu,
        {
          player: c,
          step: n,
          cardsDealt: n >= 2,
          yourCards: a,
          foldedPlayers: l,
          calledPlayers: u
        },
        c.id
      )),
      n >= 1 && /* @__PURE__ */ m.jsx(
        et.div,
        {
          className: "dealer-button",
          style: { top: "170px", right: "120px" },
          initial: { opacity: 0, scale: 0 },
          animate: { opacity: 1, scale: 1 },
          transition: { delay: 0.6 },
          children: /* @__PURE__ */ m.jsx("img", { src: Wu(), alt: "Dealer", className: "dealer-button-img" })
        }
      ),
      n >= 2 && /* @__PURE__ */ m.jsx(Yu, { amount: o }),
      /* @__PURE__ */ m.jsx("div", { className: "community-cards", children: r.map((c, h) => /* @__PURE__ */ m.jsx(Hu, { card: c, dealOrder: h }, h)) }),
      /* @__PURE__ */ m.jsx(Xu, { step: n, totalSteps: s })
    ] })
  ] });
}
const Zu = {
  S: { symbol: "SS", color: "black" },
  H: { symbol: "SH", color: "red" },
  D: { symbol: "SD", color: "red" },
  C: { symbol: "SC", color: "black" }
}, Ju = ["S", "H", "D", "C"], Qu = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K"], th = Ju.flatMap(
  (t, e) => Qu.map((n, s) => ({
    rank: n,
    suit: t,
    suitIndex: e,
    rankIndex: s,
    id: `${n}${t}`
  }))
);
function eh(t, e, n) {
  if (t === 0) {
    const a = e * 13 + n;
    return {
      x: a * 1.8 - 50,
      y: a * 1 - 25,
      opacity: 1,
      filter: "none"
    };
  }
  if (t === 1)
    return {
      x: n * 4 - 25,
      y: -117 + e * 78,
      opacity: 1,
      filter: "none"
    };
  if (t >= 2 && t <= 5) {
    const a = t - 2, l = n * 4 - 25, u = e === a;
    return {
      x: l,
      y: -117 + e * 78,
      opacity: 1,
      filter: u ? "none" : "grayscale(100%) brightness(0.6)"
    };
  }
  if (t === 6)
    return {
      x: -330 + n * 55,
      y: -117 + e * 78,
      opacity: 1,
      filter: "none"
    };
  if (t === 7) {
    const a = n === 0;
    return {
      x: -330 + n * 55,
      y: -117 + e * 78,
      opacity: 1,
      filter: a ? "none" : "grayscale(100%) brightness(0.6)"
    };
  }
  return { x: 0, y: 0, opacity: 1, filter: "none" };
}
function nh(t, e, n) {
  return t === 6 ? n * 0.05 : 0;
}
function sh({ rankSymbol: t, suitSymbol: e, color: n }) {
  return /* @__PURE__ */ m.jsxs("g", { style: { color: n }, children: [
    /* @__PURE__ */ m.jsx("rect", { width: "239", height: "335", x: "-119.5", y: "-167.5", rx: "12", fill: "white", stroke: "#999" }),
    /* @__PURE__ */ m.jsx("use", { href: `#${t}`, width: "32", height: "32", x: "-114.4", y: "-156" }),
    /* @__PURE__ */ m.jsx("use", { href: `#${e}`, width: "26.769", height: "26.769", x: "-111.784", y: "-119" }),
    /* @__PURE__ */ m.jsx("use", { href: `#${e}`, width: "70", height: "70", x: "-35", y: "-35" }),
    /* @__PURE__ */ m.jsxs("g", { transform: "rotate(180)", children: [
      /* @__PURE__ */ m.jsx("use", { href: `#${t}`, width: "32", height: "32", x: "-114.4", y: "-156" }),
      /* @__PURE__ */ m.jsx("use", { href: `#${e}`, width: "26.769", height: "26.769", x: "-111.784", y: "-119" })
    ] })
  ] });
}
function ih({ rank: t, suit: e, suitIndex: n, rankIndex: s, step: i }) {
  const o = eh(i, n, s), r = nh(i, n, s), a = Zu[e], l = `V${t}`, u = a.symbol, c = a.color, h = 50, f = 70;
  return /* @__PURE__ */ m.jsx(
    et.div,
    {
      style: {
        position: "absolute",
        left: "50%",
        top: "50%",
        width: h,
        height: f,
        marginLeft: -h / 2,
        marginTop: -f / 2,
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: "1px 1px 4px rgba(0,0,0,0.3)",
        backgroundColor: "white"
      },
      animate: {
        x: o.x,
        y: o.y,
        opacity: o.opacity,
        filter: o.filter
      },
      transition: {
        delay: r,
        duration: 0.4,
        type: "spring",
        stiffness: 100,
        damping: 15
      },
      children: /* @__PURE__ */ m.jsx(
        "svg",
        {
          viewBox: "-120 -168 240 336",
          preserveAspectRatio: "none",
          style: { width: "100%", height: "100%" },
          children: /* @__PURE__ */ m.jsx(sh, { rankSymbol: l, suitSymbol: u, color: c })
        }
      )
    }
  );
}
function rh({ step: t = 0 }) {
  return /* @__PURE__ */ m.jsx(
    "div",
    {
      style: {
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: 400
      },
      children: /* @__PURE__ */ m.jsx(
        "div",
        {
          style: {
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: 715,
            height: 312
          },
          children: th.map((s) => /* @__PURE__ */ m.jsx(
            ih,
            {
              rank: s.rank,
              suit: s.suit,
              suitIndex: s.suitIndex,
              rankIndex: s.rankIndex,
              step: t
            },
            s.id
          ))
        }
      )
    }
  );
}
class ne {
  constructor(e, n = {}) {
    this.container = e, this.step = 0, this.totalSteps = 8, this.root = ni(e), this.listeners = [], this._render();
  }
  _render() {
    this.root.render(/* @__PURE__ */ m.jsx(rh, { step: this.step }));
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
    return new ne(e, n);
  }
}
class se {
  constructor(e, n = {}) {
    this.container = e, this.gameState = new Fn(n.scenario || "tutorial"), this.root = ni(e), this.unsubscribe = this.gameState.subscribe(() => {
      this._render();
    }), this._render();
  }
  _render() {
    this.root.render(/* @__PURE__ */ m.jsx(qu, { gameState: this.gameState }));
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
    return Fn.getScenarios();
  }
  // Static mount for convenience
  static mount(e, n = {}) {
    return new se(e, n);
  }
}
const uh = {
  HoldemEngine: se,
  DeckEngine: ne,
  // Convenience shortcuts
  mount: se.mount,
  mountDeck: ne.mount
};
export {
  uh as default
};
