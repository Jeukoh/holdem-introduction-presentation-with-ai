import * as Se from "react";
import ir, { createContext as Rt, useRef as at, useLayoutEffect as sr, useEffect as Te, useId as gn, useContext as W, useInsertionEffect as gs, useMemo as gt, useCallback as xs, Children as or, isValidElement as rr, useState as de, Fragment as vs, createElement as ar, forwardRef as lr, Component as cr } from "react";
import { createRoot as Ae } from "react-dom/client";
var Me = { exports: {} }, Lt = {};
var Jn;
function ur() {
  if (Jn) return Lt;
  Jn = 1;
  var t = ir, e = Symbol.for("react.element"), n = Symbol.for("react.fragment"), i = Object.prototype.hasOwnProperty, s = t.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, r = { key: !0, ref: !0, __self: !0, __source: !0 };
  function o(a, l, d) {
    var c, h = {}, f = null, p = null;
    d !== void 0 && (f = "" + d), l.key !== void 0 && (f = "" + l.key), l.ref !== void 0 && (p = l.ref);
    for (c in l) i.call(l, c) && !r.hasOwnProperty(c) && (h[c] = l[c]);
    if (a && a.defaultProps) for (c in l = a.defaultProps, l) h[c] === void 0 && (h[c] = l[c]);
    return { $$typeof: e, type: a, key: f, ref: p, props: h, _owner: s.current };
  }
  return Lt.Fragment = n, Lt.jsx = o, Lt.jsxs = o, Lt;
}
var Zn;
function dr() {
  return Zn || (Zn = 1, Me.exports = ur()), Me.exports;
}
var u = dr();
const ti = {
  c: { symbol: "♣", color: "black" },
  d: { symbol: "♦", color: "red" },
  h: { symbol: "♥", color: "red" },
  s: { symbol: "♠", color: "black" },
  "?": { symbol: "?", color: "gray" }
}, hr = {
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
function fr(t) {
  if (!t || t.length < 2) return null;
  const e = hr[t[0]] || t[0], n = ti[t[1]] || ti["?"];
  return {
    rank: e,
    suit: n.symbol,
    color: n.color
  };
}
function ei(t) {
  const e = [];
  for (let n = 0; n < t.length; n += 2) {
    const i = fr(t.slice(n, n + 2));
    i && e.push(i);
  }
  return e;
}
const pr = {
  f: "FOLD",
  cc: "CALL",
  cbr: "RAISE",
  sm: "SHOW"
};
function mr(t) {
  const e = t.trim().split(/\s+/);
  if (e[0] === "d") {
    if (e[1] === "dh") {
      const n = e[2], i = ei(e[3]);
      return { type: "deal", player: n, cards: i };
    } else if (e[1] === "db")
      return { type: "board", cards: ei(e[2]) };
  } else if (e[0].startsWith("p")) {
    const n = parseInt(e[0].slice(1)), i = pr[e[1]] || e[1].toUpperCase(), s = e[2] ? parseInt(e[2]) : null;
    return { type: "action", player: n, action: i, amount: s };
  }
  return null;
}
const yr = ["BTN", "SB", "BB", "UTG", "HJ", "CO"];
function Ye(t) {
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
  let i = !1;
  const s = {}, r = [];
  for (const l of e) {
    const d = l.trim();
    if (!(!d || d.startsWith("#"))) {
      if (d.includes("=") && !i) {
        const [c, ...h] = d.split("="), f = c.trim();
        let p = h.join("=").trim();
        p = p.replace(/^["'\[]|["'\]]$/g, ""), f === "variant" ? n.variant = p : f === "blinds_or_straddles" ? n.blinds = p.split(",").map((m) => parseInt(m.trim())) : f === "starting_stacks" ? n.startingStacks = p.split(",").map((m) => parseInt(m.trim())) : f === "actions" && (i = !0);
      }
      if (i && d.startsWith('"')) {
        const c = d.replace(/^"|",?$/g, ""), h = mr(c);
        h && r.push(h);
      }
    }
  }
  let o = n.blinds[0] + n.blinds[1], a = !1;
  for (const l of r)
    if (l.type === "deal")
      s[l.player] = l.cards, !a && Object.keys(s).length >= 2 && (n.steps.push({
        type: "deal",
        description: "카드 딜링",
        playerCards: s
      }), a = !0);
    else if (l.type === "board") {
      const d = l.cards.length, c = d === 3 ? "flop" : d === 1 ? n.communityCards.length === 3 ? "turn" : "river" : "board";
      n.communityCards.push(...l.cards), n.steps.push({
        type: c,
        description: `${c.charAt(0).toUpperCase() + c.slice(1)} 오픈`,
        cards: l.cards
      });
    } else if (l.type === "action") {
      const d = yr[(l.player - 1) % 6] || `P${l.player}`;
      (l.action === "RAISE" || l.action === "CALL") && (o += l.amount || 0), n.steps.push({
        type: "action",
        player: d,
        action: l.action,
        amount: l.amount,
        pot: o,
        description: `${d} ${l.action}${l.amount ? " $" + l.amount : ""}`
      });
    }
  return s.p1 && (n.yourCards = s.p1, n.yourPosition = "BB"), n;
}
const gr = {
  name: "Demo: Empty Table",
  yourPosition: "BB",
  yourCards: [
    { suit: "♥", rank: "A", color: "red" },
    { suit: "♠", rank: "K", color: "black" }
  ],
  steps: [
    { type: "setup", description: "테이블 셋업" },
    { type: "deal", description: "카드 딜링" }
  ]
};
class xr {
  /**
   * @param {Object} options
   * @param {Object} [options.scenario] - 시나리오 객체 직접 전달
   * @param {string} [options.phh] - PHH 문자열 (파싱하여 시나리오로 변환)
   */
  constructor(e = {}) {
    e.scenario ? (this.scenario = e.scenario, this.scenarioKey = e.scenario.name || "custom") : e.phh ? (this.scenario = Ye(e.phh), this.scenarioKey = "phh") : (this.scenario = gr, this.scenarioKey = "demo"), this.step = 0, this.listeners = /* @__PURE__ */ new Set();
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
    const n = this.scenario.steps.length - 1, i = Math.max(0, Math.min(e, n));
    return this.step !== i && (this.step = i, this._notify()), this.step;
  }
  // 리셋
  reset() {
    this.step = 0, this._notify();
  }
  /**
   * 새 시나리오 로드
   * @param {Object} options - { scenario: {...} } 또는 { phh: "..." }
   */
  loadScenario(e) {
    e.scenario ? (this.scenario = e.scenario, this.scenarioKey = e.scenario.name || "custom") : e.phh && (this.scenario = Ye(e.phh), this.scenarioKey = "phh"), this.step = 0, this._notify();
  }
  // 현재 상태 조회
  getState() {
    const e = this.scenario.steps[this.step] || {}, n = [];
    for (let o = 0; o <= this.step; o++) {
      const a = this.scenario.steps[o];
      a?.type === "flop" && a.cards ? n.push(...a.cards) : (a?.type === "turn" || a?.type === "river") && a.card && n.push(a.card);
    }
    let i = "preflop";
    for (let o = 0; o <= this.step; o++) {
      const a = this.scenario.steps[o];
      a?.type === "flop" ? i = "flop" : a?.type === "turn" ? i = "turn" : a?.type === "river" && (i = "river");
    }
    let s = 0;
    for (let o = 0; o <= this.step; o++) {
      const a = this.scenario.steps[o];
      a?.pot !== void 0 && (s = a.pot);
    }
    let r = 0;
    for (let o = 0; o <= this.step; o++) {
      const a = this.scenario.steps[o];
      (a?.type === "flop" || a?.type === "turn" || a?.type === "river" || a?.type === "showdown" || a?.type === "winner") && a?.pot !== void 0 && (r = a.pot);
    }
    return {
      scenarioKey: this.scenarioKey,
      scenarioName: this.scenario.name,
      step: this.step,
      totalSteps: this.scenario.steps.length,
      currentStepData: e,
      phase: i,
      pot: s,
      collectedPot: r,
      communityCards: n,
      yourCards: this.scenario.yourCards,
      yourPosition: this.scenario.yourPosition,
      // 쇼다운/위너 시 다른 플레이어 카드
      playerCards: this.scenario.playerCards
    };
  }
}
const xn = Rt({});
function vn(t) {
  const e = at(null);
  return e.current === null && (e.current = t()), e.current;
}
const bn = typeof window < "u", bs = bn ? sr : Te, we = /* @__PURE__ */ Rt(null);
function Sn(t, e) {
  t.indexOf(e) === -1 && t.push(e);
}
function Tn(t, e) {
  const n = t.indexOf(e);
  n > -1 && t.splice(n, 1);
}
const it = (t, e, n) => n > e ? e : n < t ? t : n;
let An = () => {
};
const st = {}, Ss = (t) => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(t);
function Ts(t) {
  return typeof t == "object" && t !== null;
}
const As = (t) => /^0[^.\s]+$/u.test(t);
// @__NO_SIDE_EFFECTS__
function wn(t) {
  let e;
  return () => (e === void 0 && (e = t()), e);
}
const Q = /* @__NO_SIDE_EFFECTS__ */ (t) => t, vr = (t, e) => (n) => e(t(n)), qt = (...t) => t.reduce(vr), $t = /* @__NO_SIDE_EFFECTS__ */ (t, e, n) => {
  const i = e - t;
  return i === 0 ? 1 : (n - t) / i;
};
class Pn {
  constructor() {
    this.subscriptions = [];
  }
  add(e) {
    return Sn(this.subscriptions, e), () => Tn(this.subscriptions, e);
  }
  notify(e, n, i) {
    const s = this.subscriptions.length;
    if (s)
      if (s === 1)
        this.subscriptions[0](e, n, i);
      else
        for (let r = 0; r < s; r++) {
          const o = this.subscriptions[r];
          o && o(e, n, i);
        }
  }
  getSize() {
    return this.subscriptions.length;
  }
  clear() {
    this.subscriptions.length = 0;
  }
}
const tt = /* @__NO_SIDE_EFFECTS__ */ (t) => t * 1e3, q = /* @__NO_SIDE_EFFECTS__ */ (t) => t / 1e3;
function ws(t, e) {
  return e ? t * (1e3 / e) : 0;
}
const Ps = (t, e, n) => (((1 - 3 * n + 3 * e) * t + (3 * n - 6 * e)) * t + 3 * e) * t, br = 1e-7, Sr = 12;
function Tr(t, e, n, i, s) {
  let r, o, a = 0;
  do
    o = e + (n - e) / 2, r = Ps(o, i, s) - t, r > 0 ? n = o : e = o;
  while (Math.abs(r) > br && ++a < Sr);
  return o;
}
function Qt(t, e, n, i) {
  if (t === e && n === i)
    return Q;
  const s = (r) => Tr(r, 0, 1, t, n);
  return (r) => r === 0 || r === 1 ? r : Ps(s(r), e, i);
}
const js = (t) => (e) => e <= 0.5 ? t(2 * e) / 2 : (2 - t(2 * (1 - e))) / 2, Cs = (t) => (e) => 1 - t(1 - e), Ds = /* @__PURE__ */ Qt(0.33, 1.53, 0.69, 0.99), jn = /* @__PURE__ */ Cs(Ds), Vs = /* @__PURE__ */ js(jn), Rs = (t) => (t *= 2) < 1 ? 0.5 * jn(t) : 0.5 * (2 - Math.pow(2, -10 * (t - 1))), Cn = (t) => 1 - Math.sin(Math.acos(t)), Ms = Cs(Cn), Es = js(Cn), Ar = /* @__PURE__ */ Qt(0.42, 0, 1, 1), wr = /* @__PURE__ */ Qt(0, 0, 0.58, 1), Bs = /* @__PURE__ */ Qt(0.42, 0, 0.58, 1), Pr = (t) => Array.isArray(t) && typeof t[0] != "number", ks = (t) => Array.isArray(t) && typeof t[0] == "number", jr = {
  linear: Q,
  easeIn: Ar,
  easeInOut: Bs,
  easeOut: wr,
  circIn: Cn,
  circInOut: Es,
  circOut: Ms,
  backIn: jn,
  backInOut: Vs,
  backOut: Ds,
  anticipate: Rs
}, Cr = (t) => typeof t == "string", ni = (t) => {
  if (ks(t)) {
    An(t.length === 4);
    const [e, n, i, s] = t;
    return Qt(e, n, i, s);
  } else if (Cr(t))
    return jr[t];
  return t;
}, ne = [
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
function Dr(t, e) {
  let n = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set(), s = !1, r = !1;
  const o = /* @__PURE__ */ new WeakSet();
  let a = {
    delta: 0,
    timestamp: 0,
    isProcessing: !1
  };
  function l(c) {
    o.has(c) && (d.schedule(c), t()), c(a);
  }
  const d = {
    /**
     * Schedule a process to run on the next frame.
     */
    schedule: (c, h = !1, f = !1) => {
      const m = f && s ? n : i;
      return h && o.add(c), m.has(c) || m.add(c), c;
    },
    /**
     * Cancel the provided callback from running on the next frame.
     */
    cancel: (c) => {
      i.delete(c), o.delete(c);
    },
    /**
     * Execute all schedule callbacks.
     */
    process: (c) => {
      if (a = c, s) {
        r = !0;
        return;
      }
      s = !0, [n, i] = [i, n], n.forEach(l), n.clear(), s = !1, r && (r = !1, d.process(c));
    }
  };
  return d;
}
const Vr = 40;
function Is(t, e) {
  let n = !1, i = !0;
  const s = {
    delta: 0,
    timestamp: 0,
    isProcessing: !1
  }, r = () => n = !0, o = ne.reduce((x, D) => (x[D] = Dr(r), x), {}), { setup: a, read: l, resolveKeyframes: d, preUpdate: c, update: h, preRender: f, render: p, postRender: m } = o, g = () => {
    const x = st.useManualTiming ? s.timestamp : performance.now();
    n = !1, st.useManualTiming || (s.delta = i ? 1e3 / 60 : Math.max(Math.min(x - s.timestamp, Vr), 1)), s.timestamp = x, s.isProcessing = !0, a.process(s), l.process(s), d.process(s), c.process(s), h.process(s), f.process(s), p.process(s), m.process(s), s.isProcessing = !1, n && e && (i = !1, t(g));
  }, v = () => {
    n = !0, i = !0, s.isProcessing || t(g);
  };
  return { schedule: ne.reduce((x, D) => {
    const A = o[D];
    return x[D] = (C, V = !1, P = !1) => (n || v(), A.schedule(C, V, P)), x;
  }, {}), cancel: (x) => {
    for (let D = 0; D < ne.length; D++)
      o[ne[D]].cancel(x);
  }, state: s, steps: o };
}
const { schedule: M, cancel: lt, state: _, steps: Ee } = /* @__PURE__ */ Is(typeof requestAnimationFrame < "u" ? requestAnimationFrame : Q, !0);
let ae;
function Rr() {
  ae = void 0;
}
const H = {
  now: () => (ae === void 0 && H.set(_.isProcessing || st.useManualTiming ? _.timestamp : performance.now()), ae),
  set: (t) => {
    ae = t, queueMicrotask(Rr);
  }
}, Ls = (t) => (e) => typeof e == "string" && e.startsWith(t), Dn = /* @__PURE__ */ Ls("--"), Mr = /* @__PURE__ */ Ls("var(--"), Vn = (t) => Mr(t) ? Er.test(t.split("/*")[0].trim()) : !1, Er = /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu, Mt = {
  test: (t) => typeof t == "number",
  parse: parseFloat,
  transform: (t) => t
}, Ut = {
  ...Mt,
  transform: (t) => it(0, 1, t)
}, ie = {
  ...Mt,
  default: 1
}, Nt = (t) => Math.round(t * 1e5) / 1e5, Rn = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu;
function Br(t) {
  return t == null;
}
const kr = /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu, Mn = (t, e) => (n) => !!(typeof n == "string" && kr.test(n) && n.startsWith(t) || e && !Br(n) && Object.prototype.hasOwnProperty.call(n, e)), Os = (t, e, n) => (i) => {
  if (typeof i != "string")
    return i;
  const [s, r, o, a] = i.match(Rn);
  return {
    [t]: parseFloat(s),
    [e]: parseFloat(r),
    [n]: parseFloat(o),
    alpha: a !== void 0 ? parseFloat(a) : 1
  };
}, Ir = (t) => it(0, 255, t), Be = {
  ...Mt,
  transform: (t) => Math.round(Ir(t))
}, ft = {
  test: /* @__PURE__ */ Mn("rgb", "red"),
  parse: /* @__PURE__ */ Os("red", "green", "blue"),
  transform: ({ red: t, green: e, blue: n, alpha: i = 1 }) => "rgba(" + Be.transform(t) + ", " + Be.transform(e) + ", " + Be.transform(n) + ", " + Nt(Ut.transform(i)) + ")"
};
function Lr(t) {
  let e = "", n = "", i = "", s = "";
  return t.length > 5 ? (e = t.substring(1, 3), n = t.substring(3, 5), i = t.substring(5, 7), s = t.substring(7, 9)) : (e = t.substring(1, 2), n = t.substring(2, 3), i = t.substring(3, 4), s = t.substring(4, 5), e += e, n += n, i += i, s += s), {
    red: parseInt(e, 16),
    green: parseInt(n, 16),
    blue: parseInt(i, 16),
    alpha: s ? parseInt(s, 16) / 255 : 1
  };
}
const Xe = {
  test: /* @__PURE__ */ Mn("#"),
  parse: Lr,
  transform: ft.transform
}, Jt = /* @__NO_SIDE_EFFECTS__ */ (t) => ({
  test: (e) => typeof e == "string" && e.endsWith(t) && e.split(" ").length === 1,
  parse: parseFloat,
  transform: (e) => `${e}${t}`
}), rt = /* @__PURE__ */ Jt("deg"), et = /* @__PURE__ */ Jt("%"), w = /* @__PURE__ */ Jt("px"), Or = /* @__PURE__ */ Jt("vh"), Fr = /* @__PURE__ */ Jt("vw"), ii = {
  ...et,
  parse: (t) => et.parse(t) / 100,
  transform: (t) => et.transform(t * 100)
}, St = {
  test: /* @__PURE__ */ Mn("hsl", "hue"),
  parse: /* @__PURE__ */ Os("hue", "saturation", "lightness"),
  transform: ({ hue: t, saturation: e, lightness: n, alpha: i = 1 }) => "hsla(" + Math.round(t) + ", " + et.transform(Nt(e)) + ", " + et.transform(Nt(n)) + ", " + Nt(Ut.transform(i)) + ")"
}, F = {
  test: (t) => ft.test(t) || Xe.test(t) || St.test(t),
  parse: (t) => ft.test(t) ? ft.parse(t) : St.test(t) ? St.parse(t) : Xe.parse(t),
  transform: (t) => typeof t == "string" ? t : t.hasOwnProperty("red") ? ft.transform(t) : St.transform(t),
  getAnimatableNone: (t) => {
    const e = F.parse(t);
    return e.alpha = 0, F.transform(e);
  }
}, Nr = /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;
function _r(t) {
  return isNaN(t) && typeof t == "string" && (t.match(Rn)?.length || 0) + (t.match(Nr)?.length || 0) > 0;
}
const Fs = "number", Ns = "color", Kr = "var", Wr = "var(", si = "${}", zr = /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;
function Ht(t) {
  const e = t.toString(), n = [], i = {
    color: [],
    number: [],
    var: []
  }, s = [];
  let r = 0;
  const a = e.replace(zr, (l) => (F.test(l) ? (i.color.push(r), s.push(Ns), n.push(F.parse(l))) : l.startsWith(Wr) ? (i.var.push(r), s.push(Kr), n.push(l)) : (i.number.push(r), s.push(Fs), n.push(parseFloat(l))), ++r, si)).split(si);
  return { values: n, split: a, indexes: i, types: s };
}
function _s(t) {
  return Ht(t).values;
}
function Ks(t) {
  const { split: e, types: n } = Ht(t), i = e.length;
  return (s) => {
    let r = "";
    for (let o = 0; o < i; o++)
      if (r += e[o], s[o] !== void 0) {
        const a = n[o];
        a === Fs ? r += Nt(s[o]) : a === Ns ? r += F.transform(s[o]) : r += s[o];
      }
    return r;
  };
}
const $r = (t) => typeof t == "number" ? 0 : F.test(t) ? F.getAnimatableNone(t) : t;
function Ur(t) {
  const e = _s(t);
  return Ks(t)(e.map($r));
}
const ct = {
  test: _r,
  parse: _s,
  createTransformer: Ks,
  getAnimatableNone: Ur
};
function ke(t, e, n) {
  return n < 0 && (n += 1), n > 1 && (n -= 1), n < 1 / 6 ? t + (e - t) * 6 * n : n < 1 / 2 ? e : n < 2 / 3 ? t + (e - t) * (2 / 3 - n) * 6 : t;
}
function Hr({ hue: t, saturation: e, lightness: n, alpha: i }) {
  t /= 360, e /= 100, n /= 100;
  let s = 0, r = 0, o = 0;
  if (!e)
    s = r = o = n;
  else {
    const a = n < 0.5 ? n * (1 + e) : n + e - n * e, l = 2 * n - a;
    s = ke(l, a, t + 1 / 3), r = ke(l, a, t), o = ke(l, a, t - 1 / 3);
  }
  return {
    red: Math.round(s * 255),
    green: Math.round(r * 255),
    blue: Math.round(o * 255),
    alpha: i
  };
}
function he(t, e) {
  return (n) => n > 0 ? e : t;
}
const E = (t, e, n) => t + (e - t) * n, Ie = (t, e, n) => {
  const i = t * t, s = n * (e * e - i) + i;
  return s < 0 ? 0 : Math.sqrt(s);
}, Gr = [Xe, ft, St], Yr = (t) => Gr.find((e) => e.test(t));
function oi(t) {
  const e = Yr(t);
  if (!e)
    return !1;
  let n = e.parse(t);
  return e === St && (n = Hr(n)), n;
}
const ri = (t, e) => {
  const n = oi(t), i = oi(e);
  if (!n || !i)
    return he(t, e);
  const s = { ...n };
  return (r) => (s.red = Ie(n.red, i.red, r), s.green = Ie(n.green, i.green, r), s.blue = Ie(n.blue, i.blue, r), s.alpha = E(n.alpha, i.alpha, r), ft.transform(s));
}, qe = /* @__PURE__ */ new Set(["none", "hidden"]);
function Xr(t, e) {
  return qe.has(t) ? (n) => n <= 0 ? t : e : (n) => n >= 1 ? e : t;
}
function qr(t, e) {
  return (n) => E(t, e, n);
}
function En(t) {
  return typeof t == "number" ? qr : typeof t == "string" ? Vn(t) ? he : F.test(t) ? ri : Zr : Array.isArray(t) ? Ws : typeof t == "object" ? F.test(t) ? ri : Qr : he;
}
function Ws(t, e) {
  const n = [...t], i = n.length, s = t.map((r, o) => En(r)(r, e[o]));
  return (r) => {
    for (let o = 0; o < i; o++)
      n[o] = s[o](r);
    return n;
  };
}
function Qr(t, e) {
  const n = { ...t, ...e }, i = {};
  for (const s in n)
    t[s] !== void 0 && e[s] !== void 0 && (i[s] = En(t[s])(t[s], e[s]));
  return (s) => {
    for (const r in i)
      n[r] = i[r](s);
    return n;
  };
}
function Jr(t, e) {
  const n = [], i = { color: 0, var: 0, number: 0 };
  for (let s = 0; s < e.values.length; s++) {
    const r = e.types[s], o = t.indexes[r][i[r]], a = t.values[o] ?? 0;
    n[s] = a, i[r]++;
  }
  return n;
}
const Zr = (t, e) => {
  const n = ct.createTransformer(e), i = Ht(t), s = Ht(e);
  return i.indexes.var.length === s.indexes.var.length && i.indexes.color.length === s.indexes.color.length && i.indexes.number.length >= s.indexes.number.length ? qe.has(t) && !s.values.length || qe.has(e) && !i.values.length ? Xr(t, e) : qt(Ws(Jr(i, s), s.values), n) : he(t, e);
};
function zs(t, e, n) {
  return typeof t == "number" && typeof e == "number" && typeof n == "number" ? E(t, e, n) : En(t)(t, e);
}
const ta = (t) => {
  const e = ({ timestamp: n }) => t(n);
  return {
    start: (n = !0) => M.update(e, n),
    stop: () => lt(e),
    /**
     * If we're processing this frame we can use the
     * framelocked timestamp to keep things in sync.
     */
    now: () => _.isProcessing ? _.timestamp : H.now()
  };
}, $s = (t, e, n = 10) => {
  let i = "";
  const s = Math.max(Math.round(e / n), 2);
  for (let r = 0; r < s; r++)
    i += Math.round(t(r / (s - 1)) * 1e4) / 1e4 + ", ";
  return `linear(${i.substring(0, i.length - 2)})`;
}, fe = 2e4;
function Bn(t) {
  let e = 0;
  const n = 50;
  let i = t.next(e);
  for (; !i.done && e < fe; )
    e += n, i = t.next(e);
  return e >= fe ? 1 / 0 : e;
}
function ea(t, e = 100, n) {
  const i = n({ ...t, keyframes: [0, e] }), s = Math.min(Bn(i), fe);
  return {
    type: "keyframes",
    ease: (r) => i.next(s * r).value / e,
    duration: /* @__PURE__ */ q(s)
  };
}
const na = 5;
function Us(t, e, n) {
  const i = Math.max(e - na, 0);
  return ws(n - t(i), e - i);
}
const B = {
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
}, Le = 1e-3;
function ia({ duration: t = B.duration, bounce: e = B.bounce, velocity: n = B.velocity, mass: i = B.mass }) {
  let s, r, o = 1 - e;
  o = it(B.minDamping, B.maxDamping, o), t = it(B.minDuration, B.maxDuration, /* @__PURE__ */ q(t)), o < 1 ? (s = (d) => {
    const c = d * o, h = c * t, f = c - n, p = Qe(d, o), m = Math.exp(-h);
    return Le - f / p * m;
  }, r = (d) => {
    const h = d * o * t, f = h * n + n, p = Math.pow(o, 2) * Math.pow(d, 2) * t, m = Math.exp(-h), g = Qe(Math.pow(d, 2), o);
    return (-s(d) + Le > 0 ? -1 : 1) * ((f - p) * m) / g;
  }) : (s = (d) => {
    const c = Math.exp(-d * t), h = (d - n) * t + 1;
    return -Le + c * h;
  }, r = (d) => {
    const c = Math.exp(-d * t), h = (n - d) * (t * t);
    return c * h;
  });
  const a = 5 / t, l = oa(s, r, a);
  if (t = /* @__PURE__ */ tt(t), isNaN(l))
    return {
      stiffness: B.stiffness,
      damping: B.damping,
      duration: t
    };
  {
    const d = Math.pow(l, 2) * i;
    return {
      stiffness: d,
      damping: o * 2 * Math.sqrt(i * d),
      duration: t
    };
  }
}
const sa = 12;
function oa(t, e, n) {
  let i = n;
  for (let s = 1; s < sa; s++)
    i = i - t(i) / e(i);
  return i;
}
function Qe(t, e) {
  return t * Math.sqrt(1 - e * e);
}
const ra = ["duration", "bounce"], aa = ["stiffness", "damping", "mass"];
function ai(t, e) {
  return e.some((n) => t[n] !== void 0);
}
function la(t) {
  let e = {
    velocity: B.velocity,
    stiffness: B.stiffness,
    damping: B.damping,
    mass: B.mass,
    isResolvedFromDuration: !1,
    ...t
  };
  if (!ai(t, aa) && ai(t, ra))
    if (t.visualDuration) {
      const n = t.visualDuration, i = 2 * Math.PI / (n * 1.2), s = i * i, r = 2 * it(0.05, 1, 1 - (t.bounce || 0)) * Math.sqrt(s);
      e = {
        ...e,
        mass: B.mass,
        stiffness: s,
        damping: r
      };
    } else {
      const n = ia(t);
      e = {
        ...e,
        ...n,
        mass: B.mass
      }, e.isResolvedFromDuration = !0;
    }
  return e;
}
function pe(t = B.visualDuration, e = B.bounce) {
  const n = typeof t != "object" ? {
    visualDuration: t,
    keyframes: [0, 1],
    bounce: e
  } : t;
  let { restSpeed: i, restDelta: s } = n;
  const r = n.keyframes[0], o = n.keyframes[n.keyframes.length - 1], a = { done: !1, value: r }, { stiffness: l, damping: d, mass: c, duration: h, velocity: f, isResolvedFromDuration: p } = la({
    ...n,
    velocity: -/* @__PURE__ */ q(n.velocity || 0)
  }), m = f || 0, g = d / (2 * Math.sqrt(l * c)), v = o - r, y = /* @__PURE__ */ q(Math.sqrt(l / c)), b = Math.abs(v) < 5;
  i || (i = b ? B.restSpeed.granular : B.restSpeed.default), s || (s = b ? B.restDelta.granular : B.restDelta.default);
  let x;
  if (g < 1) {
    const A = Qe(y, g);
    x = (C) => {
      const V = Math.exp(-g * y * C);
      return o - V * ((m + g * y * v) / A * Math.sin(A * C) + v * Math.cos(A * C));
    };
  } else if (g === 1)
    x = (A) => o - Math.exp(-y * A) * (v + (m + y * v) * A);
  else {
    const A = y * Math.sqrt(g * g - 1);
    x = (C) => {
      const V = Math.exp(-g * y * C), P = Math.min(A * C, 300);
      return o - V * ((m + g * y * v) * Math.sinh(P) + A * v * Math.cosh(P)) / A;
    };
  }
  const D = {
    calculatedDuration: p && h || null,
    next: (A) => {
      const C = x(A);
      if (p)
        a.done = A >= h;
      else {
        let V = A === 0 ? m : 0;
        g < 1 && (V = A === 0 ? /* @__PURE__ */ tt(m) : Us(x, A, C));
        const P = Math.abs(V) <= i, R = Math.abs(o - C) <= s;
        a.done = P && R;
      }
      return a.value = a.done ? o : C, a;
    },
    toString: () => {
      const A = Math.min(Bn(D), fe), C = $s((V) => D.next(A * V).value, A, 30);
      return A + "ms " + C;
    },
    toTransition: () => {
    }
  };
  return D;
}
pe.applyToOptions = (t) => {
  const e = ea(t, 100, pe);
  return t.ease = e.ease, t.duration = /* @__PURE__ */ tt(e.duration), t.type = "keyframes", t;
};
function Je({ keyframes: t, velocity: e = 0, power: n = 0.8, timeConstant: i = 325, bounceDamping: s = 10, bounceStiffness: r = 500, modifyTarget: o, min: a, max: l, restDelta: d = 0.5, restSpeed: c }) {
  const h = t[0], f = {
    done: !1,
    value: h
  }, p = (P) => a !== void 0 && P < a || l !== void 0 && P > l, m = (P) => a === void 0 ? l : l === void 0 || Math.abs(a - P) < Math.abs(l - P) ? a : l;
  let g = n * e;
  const v = h + g, y = o === void 0 ? v : o(v);
  y !== v && (g = y - h);
  const b = (P) => -g * Math.exp(-P / i), x = (P) => y + b(P), D = (P) => {
    const R = b(P), L = x(P);
    f.done = Math.abs(R) <= d, f.value = f.done ? y : L;
  };
  let A, C;
  const V = (P) => {
    p(f.value) && (A = P, C = pe({
      keyframes: [f.value, m(f.value)],
      velocity: Us(x, P, f.value),
      // TODO: This should be passing * 1000
      damping: s,
      stiffness: r,
      restDelta: d,
      restSpeed: c
    }));
  };
  return V(0), {
    calculatedDuration: null,
    next: (P) => {
      let R = !1;
      return !C && A === void 0 && (R = !0, D(P), V(P)), A !== void 0 && P >= A ? C.next(P - A) : (!R && D(P), f);
    }
  };
}
function ca(t, e, n) {
  const i = [], s = n || st.mix || zs, r = t.length - 1;
  for (let o = 0; o < r; o++) {
    let a = s(t[o], t[o + 1]);
    if (e) {
      const l = Array.isArray(e) ? e[o] || Q : e;
      a = qt(l, a);
    }
    i.push(a);
  }
  return i;
}
function ua(t, e, { clamp: n = !0, ease: i, mixer: s } = {}) {
  const r = t.length;
  if (An(r === e.length), r === 1)
    return () => e[0];
  if (r === 2 && e[0] === e[1])
    return () => e[1];
  const o = t[0] === t[1];
  t[0] > t[r - 1] && (t = [...t].reverse(), e = [...e].reverse());
  const a = ca(e, i, s), l = a.length, d = (c) => {
    if (o && c < t[0])
      return e[0];
    let h = 0;
    if (l > 1)
      for (; h < t.length - 2 && !(c < t[h + 1]); h++)
        ;
    const f = /* @__PURE__ */ $t(t[h], t[h + 1], c);
    return a[h](f);
  };
  return n ? (c) => d(it(t[0], t[r - 1], c)) : d;
}
function da(t, e) {
  const n = t[t.length - 1];
  for (let i = 1; i <= e; i++) {
    const s = /* @__PURE__ */ $t(0, e, i);
    t.push(E(n, 1, s));
  }
}
function ha(t) {
  const e = [0];
  return da(e, t.length - 1), e;
}
function fa(t, e) {
  return t.map((n) => n * e);
}
function pa(t, e) {
  return t.map(() => e || Bs).splice(0, t.length - 1);
}
function _t({ duration: t = 300, keyframes: e, times: n, ease: i = "easeInOut" }) {
  const s = Pr(i) ? i.map(ni) : ni(i), r = {
    done: !1,
    value: e[0]
  }, o = fa(
    // Only use the provided offsets if they're the correct length
    // TODO Maybe we should warn here if there's a length mismatch
    n && n.length === e.length ? n : ha(e),
    t
  ), a = ua(o, e, {
    ease: Array.isArray(s) ? s : pa(e, s)
  });
  return {
    calculatedDuration: t,
    next: (l) => (r.value = a(l), r.done = l >= t, r)
  };
}
const ma = (t) => t !== null;
function kn(t, { repeat: e, repeatType: n = "loop" }, i, s = 1) {
  const r = t.filter(ma), a = s < 0 || e && n !== "loop" && e % 2 === 1 ? 0 : r.length - 1;
  return !a || i === void 0 ? r[a] : i;
}
const ya = {
  decay: Je,
  inertia: Je,
  tween: _t,
  keyframes: _t,
  spring: pe
};
function Hs(t) {
  typeof t.type == "string" && (t.type = ya[t.type]);
}
class In {
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
const ga = (t) => t / 100;
class Ln extends In {
  constructor(e) {
    super(), this.state = "idle", this.startTime = null, this.isStopped = !1, this.currentTime = 0, this.holdTime = null, this.playbackSpeed = 1, this.stop = () => {
      const { motionValue: n } = this.options;
      n && n.updatedAt !== H.now() && this.tick(H.now()), this.isStopped = !0, this.state !== "idle" && (this.teardown(), this.options.onStop?.());
    }, this.options = e, this.initAnimation(), this.play(), e.autoplay === !1 && this.pause();
  }
  initAnimation() {
    const { options: e } = this;
    Hs(e);
    const { type: n = _t, repeat: i = 0, repeatDelay: s = 0, repeatType: r, velocity: o = 0 } = e;
    let { keyframes: a } = e;
    const l = n || _t;
    l !== _t && typeof a[0] != "number" && (this.mixKeyframes = qt(ga, zs(a[0], a[1])), a = [0, 100]);
    const d = l({ ...e, keyframes: a });
    r === "mirror" && (this.mirroredGenerator = l({
      ...e,
      keyframes: [...a].reverse(),
      velocity: -o
    })), d.calculatedDuration === null && (d.calculatedDuration = Bn(d));
    const { calculatedDuration: c } = d;
    this.calculatedDuration = c, this.resolvedDuration = c + s, this.totalDuration = this.resolvedDuration * (i + 1) - s, this.generator = d;
  }
  updateTime(e) {
    const n = Math.round(e - this.startTime) * this.playbackSpeed;
    this.holdTime !== null ? this.currentTime = this.holdTime : this.currentTime = n;
  }
  tick(e, n = !1) {
    const { generator: i, totalDuration: s, mixKeyframes: r, mirroredGenerator: o, resolvedDuration: a, calculatedDuration: l } = this;
    if (this.startTime === null)
      return i.next(0);
    const { delay: d = 0, keyframes: c, repeat: h, repeatType: f, repeatDelay: p, type: m, onUpdate: g, finalKeyframe: v } = this.options;
    this.speed > 0 ? this.startTime = Math.min(this.startTime, e) : this.speed < 0 && (this.startTime = Math.min(e - s / this.speed, this.startTime)), n ? this.currentTime = e : this.updateTime(e);
    const y = this.currentTime - d * (this.playbackSpeed >= 0 ? 1 : -1), b = this.playbackSpeed >= 0 ? y < 0 : y > s;
    this.currentTime = Math.max(y, 0), this.state === "finished" && this.holdTime === null && (this.currentTime = s);
    let x = this.currentTime, D = i;
    if (h) {
      const P = Math.min(this.currentTime, s) / a;
      let R = Math.floor(P), L = P % 1;
      !L && P >= 1 && (L = 1), L === 1 && R--, R = Math.min(R, h + 1), !!(R % 2) && (f === "reverse" ? (L = 1 - L, p && (L -= p / a)) : f === "mirror" && (D = o)), x = it(0, 1, L) * a;
    }
    const A = b ? { done: !1, value: c[0] } : D.next(x);
    r && (A.value = r(A.value));
    let { done: C } = A;
    !b && l !== null && (C = this.playbackSpeed >= 0 ? this.currentTime >= s : this.currentTime <= 0);
    const V = this.holdTime === null && (this.state === "finished" || this.state === "running" && C);
    return V && m !== Je && (A.value = kn(c, this.options, v, this.speed)), g && g(A.value), V && this.finish(), A;
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
    return /* @__PURE__ */ q(this.calculatedDuration);
  }
  get iterationDuration() {
    const { delay: e = 0 } = this.options || {};
    return this.duration + /* @__PURE__ */ q(e);
  }
  get time() {
    return /* @__PURE__ */ q(this.currentTime);
  }
  set time(e) {
    e = /* @__PURE__ */ tt(e), this.currentTime = e, this.startTime === null || this.holdTime !== null || this.playbackSpeed === 0 ? this.holdTime = e : this.driver && (this.startTime = this.driver.now() - e / this.playbackSpeed), this.driver?.start(!1);
  }
  get speed() {
    return this.playbackSpeed;
  }
  set speed(e) {
    this.updateTime(H.now());
    const n = this.playbackSpeed !== e;
    this.playbackSpeed = e, n && (this.time = /* @__PURE__ */ q(this.currentTime));
  }
  play() {
    if (this.isStopped)
      return;
    const { driver: e = ta, startTime: n } = this.options;
    this.driver || (this.driver = e((s) => this.tick(s))), this.options.onPlay?.();
    const i = this.driver.now();
    this.state === "finished" ? (this.updateFinished(), this.startTime = i) : this.holdTime !== null ? this.startTime = i - this.holdTime : this.startTime || (this.startTime = n ?? i), this.state === "finished" && this.speed < 0 && (this.startTime += this.calculatedDuration), this.holdTime = null, this.state = "running", this.driver.start();
  }
  pause() {
    this.state = "paused", this.updateTime(H.now()), this.holdTime = this.currentTime;
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
function xa(t) {
  for (let e = 1; e < t.length; e++)
    t[e] ?? (t[e] = t[e - 1]);
}
const pt = (t) => t * 180 / Math.PI, Ze = (t) => {
  const e = pt(Math.atan2(t[1], t[0]));
  return tn(e);
}, va = {
  x: 4,
  y: 5,
  translateX: 4,
  translateY: 5,
  scaleX: 0,
  scaleY: 3,
  scale: (t) => (Math.abs(t[0]) + Math.abs(t[3])) / 2,
  rotate: Ze,
  rotateZ: Ze,
  skewX: (t) => pt(Math.atan(t[1])),
  skewY: (t) => pt(Math.atan(t[2])),
  skew: (t) => (Math.abs(t[1]) + Math.abs(t[2])) / 2
}, tn = (t) => (t = t % 360, t < 0 && (t += 360), t), li = Ze, ci = (t) => Math.sqrt(t[0] * t[0] + t[1] * t[1]), ui = (t) => Math.sqrt(t[4] * t[4] + t[5] * t[5]), ba = {
  x: 12,
  y: 13,
  z: 14,
  translateX: 12,
  translateY: 13,
  translateZ: 14,
  scaleX: ci,
  scaleY: ui,
  scale: (t) => (ci(t) + ui(t)) / 2,
  rotateX: (t) => tn(pt(Math.atan2(t[6], t[5]))),
  rotateY: (t) => tn(pt(Math.atan2(-t[2], t[0]))),
  rotateZ: li,
  rotate: li,
  skewX: (t) => pt(Math.atan(t[4])),
  skewY: (t) => pt(Math.atan(t[1])),
  skew: (t) => (Math.abs(t[1]) + Math.abs(t[4])) / 2
};
function en(t) {
  return t.includes("scale") ? 1 : 0;
}
function nn(t, e) {
  if (!t || t === "none")
    return en(e);
  const n = t.match(/^matrix3d\(([-\d.e\s,]+)\)$/u);
  let i, s;
  if (n)
    i = ba, s = n;
  else {
    const a = t.match(/^matrix\(([-\d.e\s,]+)\)$/u);
    i = va, s = a;
  }
  if (!s)
    return en(e);
  const r = i[e], o = s[1].split(",").map(Ta);
  return typeof r == "function" ? r(o) : o[r];
}
const Sa = (t, e) => {
  const { transform: n = "none" } = getComputedStyle(t);
  return nn(n, e);
};
function Ta(t) {
  return parseFloat(t.trim());
}
const Et = [
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
], Bt = new Set(Et), di = (t) => t === Mt || t === w, Aa = /* @__PURE__ */ new Set(["x", "y", "z"]), wa = Et.filter((t) => !Aa.has(t));
function Pa(t) {
  const e = [];
  return wa.forEach((n) => {
    const i = t.getValue(n);
    i !== void 0 && (e.push([n, i.get()]), i.set(n.startsWith("scale") ? 1 : 0));
  }), e;
}
const mt = {
  // Dimensions
  width: ({ x: t }, { paddingLeft: e = "0", paddingRight: n = "0" }) => t.max - t.min - parseFloat(e) - parseFloat(n),
  height: ({ y: t }, { paddingTop: e = "0", paddingBottom: n = "0" }) => t.max - t.min - parseFloat(e) - parseFloat(n),
  top: (t, { top: e }) => parseFloat(e),
  left: (t, { left: e }) => parseFloat(e),
  bottom: ({ y: t }, { top: e }) => parseFloat(e) + (t.max - t.min),
  right: ({ x: t }, { left: e }) => parseFloat(e) + (t.max - t.min),
  // Transform
  x: (t, { transform: e }) => nn(e, "x"),
  y: (t, { transform: e }) => nn(e, "y")
};
mt.translateX = mt.x;
mt.translateY = mt.y;
const yt = /* @__PURE__ */ new Set();
let sn = !1, on = !1, rn = !1;
function Gs() {
  if (on) {
    const t = Array.from(yt).filter((i) => i.needsMeasurement), e = new Set(t.map((i) => i.element)), n = /* @__PURE__ */ new Map();
    e.forEach((i) => {
      const s = Pa(i);
      s.length && (n.set(i, s), i.render());
    }), t.forEach((i) => i.measureInitialState()), e.forEach((i) => {
      i.render();
      const s = n.get(i);
      s && s.forEach(([r, o]) => {
        i.getValue(r)?.set(o);
      });
    }), t.forEach((i) => i.measureEndState()), t.forEach((i) => {
      i.suspendedScrollY !== void 0 && window.scrollTo(0, i.suspendedScrollY);
    });
  }
  on = !1, sn = !1, yt.forEach((t) => t.complete(rn)), yt.clear();
}
function Ys() {
  yt.forEach((t) => {
    t.readKeyframes(), t.needsMeasurement && (on = !0);
  });
}
function ja() {
  rn = !0, Ys(), Gs(), rn = !1;
}
class On {
  constructor(e, n, i, s, r, o = !1) {
    this.state = "pending", this.isAsync = !1, this.needsMeasurement = !1, this.unresolvedKeyframes = [...e], this.onComplete = n, this.name = i, this.motionValue = s, this.element = r, this.isAsync = o;
  }
  scheduleResolve() {
    this.state = "scheduled", this.isAsync ? (yt.add(this), sn || (sn = !0, M.read(Ys), M.resolveKeyframes(Gs))) : (this.readKeyframes(), this.complete());
  }
  readKeyframes() {
    const { unresolvedKeyframes: e, name: n, element: i, motionValue: s } = this;
    if (e[0] === null) {
      const r = s?.get(), o = e[e.length - 1];
      if (r !== void 0)
        e[0] = r;
      else if (i && n) {
        const a = i.readValue(n, o);
        a != null && (e[0] = a);
      }
      e[0] === void 0 && (e[0] = o), s && r === void 0 && s.set(e[0]);
    }
    xa(e);
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
    this.state = "complete", this.onComplete(this.unresolvedKeyframes, this.finalKeyframe, e), yt.delete(this);
  }
  cancel() {
    this.state === "scheduled" && (yt.delete(this), this.state = "pending");
  }
  resume() {
    this.state === "pending" && this.scheduleResolve();
  }
}
const Ca = (t) => t.startsWith("--");
function Da(t, e, n) {
  Ca(e) ? t.style.setProperty(e, n) : t.style[e] = n;
}
const Va = /* @__PURE__ */ wn(() => window.ScrollTimeline !== void 0), Ra = {};
function Ma(t, e) {
  const n = /* @__PURE__ */ wn(t);
  return () => Ra[e] ?? n();
}
const Xs = /* @__PURE__ */ Ma(() => {
  try {
    document.createElement("div").animate({ opacity: 0 }, { easing: "linear(0, 1)" });
  } catch {
    return !1;
  }
  return !0;
}, "linearEasing"), Ft = ([t, e, n, i]) => `cubic-bezier(${t}, ${e}, ${n}, ${i})`, hi = {
  linear: "linear",
  ease: "ease",
  easeIn: "ease-in",
  easeOut: "ease-out",
  easeInOut: "ease-in-out",
  circIn: /* @__PURE__ */ Ft([0, 0.65, 0.55, 1]),
  circOut: /* @__PURE__ */ Ft([0.55, 0, 1, 0.45]),
  backIn: /* @__PURE__ */ Ft([0.31, 0.01, 0.66, -0.59]),
  backOut: /* @__PURE__ */ Ft([0.33, 1.53, 0.69, 0.99])
};
function qs(t, e) {
  if (t)
    return typeof t == "function" ? Xs() ? $s(t, e) : "ease-out" : ks(t) ? Ft(t) : Array.isArray(t) ? t.map((n) => qs(n, e) || hi.easeOut) : hi[t];
}
function Ea(t, e, n, { delay: i = 0, duration: s = 300, repeat: r = 0, repeatType: o = "loop", ease: a = "easeOut", times: l } = {}, d = void 0) {
  const c = {
    [e]: n
  };
  l && (c.offset = l);
  const h = qs(a, s);
  Array.isArray(h) && (c.easing = h);
  const f = {
    delay: i,
    duration: s,
    easing: Array.isArray(h) ? "linear" : h,
    fill: "both",
    iterations: r + 1,
    direction: o === "reverse" ? "alternate" : "normal"
  };
  return d && (f.pseudoElement = d), t.animate(c, f);
}
function Qs(t) {
  return typeof t == "function" && "applyToOptions" in t;
}
function Ba({ type: t, ...e }) {
  return Qs(t) && Xs() ? t.applyToOptions(e) : (e.duration ?? (e.duration = 300), e.ease ?? (e.ease = "easeOut"), e);
}
class ka extends In {
  constructor(e) {
    if (super(), this.finishedTime = null, this.isStopped = !1, !e)
      return;
    const { element: n, name: i, keyframes: s, pseudoElement: r, allowFlatten: o = !1, finalKeyframe: a, onComplete: l } = e;
    this.isPseudoElement = !!r, this.allowFlatten = o, this.options = e, An(typeof e.type != "string");
    const d = Ba(e);
    this.animation = Ea(n, i, s, d, r), d.autoplay === !1 && this.animation.pause(), this.animation.onfinish = () => {
      if (this.finishedTime = this.time, !r) {
        const c = kn(s, this.options, a, this.speed);
        this.updateMotionValue ? this.updateMotionValue(c) : Da(n, i, c), this.animation.cancel();
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
    return /* @__PURE__ */ q(Number(e));
  }
  get iterationDuration() {
    const { delay: e = 0 } = this.options || {};
    return this.duration + /* @__PURE__ */ q(e);
  }
  get time() {
    return /* @__PURE__ */ q(Number(this.animation.currentTime) || 0);
  }
  set time(e) {
    this.finishedTime = null, this.animation.currentTime = /* @__PURE__ */ tt(e);
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
    return this.allowFlatten && this.animation.effect?.updateTiming({ easing: "linear" }), this.animation.onfinish = null, e && Va() ? (this.animation.timeline = e, Q) : n(this);
  }
}
const Js = {
  anticipate: Rs,
  backInOut: Vs,
  circInOut: Es
};
function Ia(t) {
  return t in Js;
}
function La(t) {
  typeof t.ease == "string" && Ia(t.ease) && (t.ease = Js[t.ease]);
}
const fi = 10;
class Oa extends ka {
  constructor(e) {
    La(e), Hs(e), super(e), e.startTime && (this.startTime = e.startTime), this.options = e;
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
    const { motionValue: n, onUpdate: i, onComplete: s, element: r, ...o } = this.options;
    if (!n)
      return;
    if (e !== void 0) {
      n.set(e);
      return;
    }
    const a = new Ln({
      ...o,
      autoplay: !1
    }), l = /* @__PURE__ */ tt(this.finishedTime ?? this.time);
    n.setWithVelocity(a.sample(l - fi).value, a.sample(l).value, fi), a.stop();
  }
}
const pi = (t, e) => e === "zIndex" ? !1 : !!(typeof t == "number" || Array.isArray(t) || typeof t == "string" && // It's animatable if we have a string
(ct.test(t) || t === "0") && // And it contains numbers and/or colors
!t.startsWith("url("));
function Fa(t) {
  const e = t[0];
  if (t.length === 1)
    return !0;
  for (let n = 0; n < t.length; n++)
    if (t[n] !== e)
      return !0;
}
function Na(t, e, n, i) {
  const s = t[0];
  if (s === null)
    return !1;
  if (e === "display" || e === "visibility")
    return !0;
  const r = t[t.length - 1], o = pi(s, e), a = pi(r, e);
  return !o || !a ? !1 : Fa(t) || (n === "spring" || Qs(n)) && i;
}
function an(t) {
  t.duration = 0, t.type = "keyframes";
}
const _a = /* @__PURE__ */ new Set([
  "opacity",
  "clipPath",
  "filter",
  "transform"
  // TODO: Could be re-enabled now we have support for linear() easing
  // "background-color"
]), Ka = /* @__PURE__ */ wn(() => Object.hasOwnProperty.call(Element.prototype, "animate"));
function Wa(t) {
  const { motionValue: e, name: n, repeatDelay: i, repeatType: s, damping: r, type: o } = t;
  if (!(e?.owner?.current instanceof HTMLElement))
    return !1;
  const { onUpdate: l, transformTemplate: d } = e.owner.getProps();
  return Ka() && n && _a.has(n) && (n !== "transform" || !d) && /**
   * If we're outputting values to onUpdate then we can't use WAAPI as there's
   * no way to read the value from WAAPI every frame.
   */
  !l && !i && s !== "mirror" && r !== 0 && o !== "inertia";
}
const za = 40;
class $a extends In {
  constructor({ autoplay: e = !0, delay: n = 0, type: i = "keyframes", repeat: s = 0, repeatDelay: r = 0, repeatType: o = "loop", keyframes: a, name: l, motionValue: d, element: c, ...h }) {
    super(), this.stop = () => {
      this._animation && (this._animation.stop(), this.stopTimeline?.()), this.keyframeResolver?.cancel();
    }, this.createdAt = H.now();
    const f = {
      autoplay: e,
      delay: n,
      type: i,
      repeat: s,
      repeatDelay: r,
      repeatType: o,
      name: l,
      motionValue: d,
      element: c,
      ...h
    }, p = c?.KeyframeResolver || On;
    this.keyframeResolver = new p(a, (m, g, v) => this.onKeyframesResolved(m, g, f, !v), l, d, c), this.keyframeResolver?.scheduleResolve();
  }
  onKeyframesResolved(e, n, i, s) {
    this.keyframeResolver = void 0;
    const { name: r, type: o, velocity: a, delay: l, isHandoff: d, onUpdate: c } = i;
    this.resolvedAt = H.now(), Na(e, r, o, a) || ((st.instantAnimations || !l) && c?.(kn(e, i, n)), e[0] = e[e.length - 1], an(i), i.repeat = 0);
    const f = {
      startTime: s ? this.resolvedAt ? this.resolvedAt - this.createdAt > za ? this.resolvedAt : this.createdAt : this.createdAt : void 0,
      finalKeyframe: n,
      ...i,
      keyframes: e
    }, p = !d && Wa(f) ? new Oa({
      ...f,
      element: f.motionValue.owner.current
    }) : new Ln(f);
    p.finished.then(() => this.notifyFinished()).catch(Q), this.pendingTimeline && (this.stopTimeline = p.attachTimeline(this.pendingTimeline), this.pendingTimeline = void 0), this._animation = p;
  }
  get finished() {
    return this._animation ? this.animation.finished : this._finished;
  }
  then(e, n) {
    return this.finished.finally(e).then(() => {
    });
  }
  get animation() {
    return this._animation || (this.keyframeResolver?.resume(), ja()), this._animation;
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
const Ua = (
  // eslint-disable-next-line redos-detector/no-unsafe-regex -- false positive, as it can match a lot of words
  /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u
);
function Ha(t) {
  const e = Ua.exec(t);
  if (!e)
    return [,];
  const [, n, i, s] = e;
  return [`--${n ?? i}`, s];
}
function Zs(t, e, n = 1) {
  const [i, s] = Ha(t);
  if (!i)
    return;
  const r = window.getComputedStyle(e).getPropertyValue(i);
  if (r) {
    const o = r.trim();
    return Ss(o) ? parseFloat(o) : o;
  }
  return Vn(s) ? Zs(s, e, n + 1) : s;
}
function Fn(t, e) {
  return t?.[e] ?? t?.default ?? t;
}
const to = /* @__PURE__ */ new Set([
  "width",
  "height",
  "top",
  "left",
  "right",
  "bottom",
  ...Et
]), Ga = {
  test: (t) => t === "auto",
  parse: (t) => t
}, eo = (t) => (e) => e.test(t), no = [Mt, w, et, rt, Fr, Or, Ga], mi = (t) => no.find(eo(t));
function Ya(t) {
  return typeof t == "number" ? t === 0 : t !== null ? t === "none" || t === "0" || As(t) : !0;
}
const Xa = /* @__PURE__ */ new Set(["brightness", "contrast", "saturate", "opacity"]);
function qa(t) {
  const [e, n] = t.slice(0, -1).split("(");
  if (e === "drop-shadow")
    return t;
  const [i] = n.match(Rn) || [];
  if (!i)
    return t;
  const s = n.replace(i, "");
  let r = Xa.has(e) ? 1 : 0;
  return i !== n && (r *= 100), e + "(" + r + s + ")";
}
const Qa = /\b([a-z-]*)\(.*?\)/gu, ln = {
  ...ct,
  getAnimatableNone: (t) => {
    const e = t.match(Qa);
    return e ? e.map(qa).join(" ") : t;
  }
}, yi = {
  ...Mt,
  transform: Math.round
}, Ja = {
  rotate: rt,
  rotateX: rt,
  rotateY: rt,
  rotateZ: rt,
  scale: ie,
  scaleX: ie,
  scaleY: ie,
  scaleZ: ie,
  skew: rt,
  skewX: rt,
  skewY: rt,
  distance: w,
  translateX: w,
  translateY: w,
  translateZ: w,
  x: w,
  y: w,
  z: w,
  perspective: w,
  transformPerspective: w,
  opacity: Ut,
  originX: ii,
  originY: ii,
  originZ: w
}, Nn = {
  // Border props
  borderWidth: w,
  borderTopWidth: w,
  borderRightWidth: w,
  borderBottomWidth: w,
  borderLeftWidth: w,
  borderRadius: w,
  radius: w,
  borderTopLeftRadius: w,
  borderTopRightRadius: w,
  borderBottomRightRadius: w,
  borderBottomLeftRadius: w,
  // Positioning props
  width: w,
  maxWidth: w,
  height: w,
  maxHeight: w,
  top: w,
  right: w,
  bottom: w,
  left: w,
  // Spacing props
  padding: w,
  paddingTop: w,
  paddingRight: w,
  paddingBottom: w,
  paddingLeft: w,
  margin: w,
  marginTop: w,
  marginRight: w,
  marginBottom: w,
  marginLeft: w,
  // Misc
  backgroundPositionX: w,
  backgroundPositionY: w,
  ...Ja,
  zIndex: yi,
  // SVG
  fillOpacity: Ut,
  strokeOpacity: Ut,
  numOctaves: yi
}, Za = {
  ...Nn,
  // Color props
  color: F,
  backgroundColor: F,
  outlineColor: F,
  fill: F,
  stroke: F,
  // Border props
  borderColor: F,
  borderTopColor: F,
  borderRightColor: F,
  borderBottomColor: F,
  borderLeftColor: F,
  filter: ln,
  WebkitFilter: ln
}, io = (t) => Za[t];
function so(t, e) {
  let n = io(t);
  return n !== ln && (n = ct), n.getAnimatableNone ? n.getAnimatableNone(e) : void 0;
}
const tl = /* @__PURE__ */ new Set(["auto", "none", "0"]);
function el(t, e, n) {
  let i = 0, s;
  for (; i < t.length && !s; ) {
    const r = t[i];
    typeof r == "string" && !tl.has(r) && Ht(r).values.length && (s = t[i]), i++;
  }
  if (s && n)
    for (const r of e)
      t[r] = so(n, s);
}
class nl extends On {
  constructor(e, n, i, s, r) {
    super(e, n, i, s, r, !0);
  }
  readKeyframes() {
    const { unresolvedKeyframes: e, element: n, name: i } = this;
    if (!n || !n.current)
      return;
    super.readKeyframes();
    for (let l = 0; l < e.length; l++) {
      let d = e[l];
      if (typeof d == "string" && (d = d.trim(), Vn(d))) {
        const c = Zs(d, n.current);
        c !== void 0 && (e[l] = c), l === e.length - 1 && (this.finalKeyframe = d);
      }
    }
    if (this.resolveNoneKeyframes(), !to.has(i) || e.length !== 2)
      return;
    const [s, r] = e, o = mi(s), a = mi(r);
    if (o !== a)
      if (di(o) && di(a))
        for (let l = 0; l < e.length; l++) {
          const d = e[l];
          typeof d == "string" && (e[l] = parseFloat(d));
        }
      else mt[i] && (this.needsMeasurement = !0);
  }
  resolveNoneKeyframes() {
    const { unresolvedKeyframes: e, name: n } = this, i = [];
    for (let s = 0; s < e.length; s++)
      (e[s] === null || Ya(e[s])) && i.push(s);
    i.length && el(e, i, n);
  }
  measureInitialState() {
    const { element: e, unresolvedKeyframes: n, name: i } = this;
    if (!e || !e.current)
      return;
    i === "height" && (this.suspendedScrollY = window.pageYOffset), this.measuredOrigin = mt[i](e.measureViewportBox(), window.getComputedStyle(e.current)), n[0] = this.measuredOrigin;
    const s = n[n.length - 1];
    s !== void 0 && e.getValue(i, s).jump(s, !1);
  }
  measureEndState() {
    const { element: e, name: n, unresolvedKeyframes: i } = this;
    if (!e || !e.current)
      return;
    const s = e.getValue(n);
    s && s.jump(this.measuredOrigin, !1);
    const r = i.length - 1, o = i[r];
    i[r] = mt[n](e.measureViewportBox(), window.getComputedStyle(e.current)), o !== null && this.finalKeyframe === void 0 && (this.finalKeyframe = o), this.removedTransforms?.length && this.removedTransforms.forEach(([a, l]) => {
      e.getValue(a).set(l);
    }), this.resolveNoneKeyframes();
  }
}
function il(t, e, n) {
  if (t instanceof EventTarget)
    return [t];
  if (typeof t == "string") {
    let i = document;
    const s = n?.[t] ?? i.querySelectorAll(t);
    return s ? Array.from(s) : [];
  }
  return Array.from(t);
}
const oo = (t, e) => e && typeof t == "number" ? e.transform(t) : t;
function ro(t) {
  return Ts(t) && "offsetHeight" in t;
}
const gi = 30, sl = (t) => !isNaN(parseFloat(t));
class ol {
  /**
   * @param init - The initiating value
   * @param config - Optional configuration options
   *
   * -  `transformer`: A function to transform incoming values with.
   */
  constructor(e, n = {}) {
    this.canTrackVelocity = null, this.events = {}, this.updateAndNotify = (i) => {
      const s = H.now();
      if (this.updatedAt !== s && this.setPrevFrameValue(), this.prev = this.current, this.setCurrent(i), this.current !== this.prev && (this.events.change?.notify(this.current), this.dependents))
        for (const r of this.dependents)
          r.dirty();
    }, this.hasAnimated = !1, this.setCurrent(e), this.owner = n.owner;
  }
  setCurrent(e) {
    this.current = e, this.updatedAt = H.now(), this.canTrackVelocity === null && e !== void 0 && (this.canTrackVelocity = sl(this.current));
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
    this.events[e] || (this.events[e] = new Pn());
    const i = this.events[e].add(n);
    return e === "change" ? () => {
      i(), M.read(() => {
        this.events.change.getSize() || this.stop();
      });
    } : i;
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
  setWithVelocity(e, n, i) {
    this.set(n), this.prev = void 0, this.prevFrameValue = e, this.prevUpdatedAt = this.updatedAt - i;
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
    const e = H.now();
    if (!this.canTrackVelocity || this.prevFrameValue === void 0 || e - this.updatedAt > gi)
      return 0;
    const n = Math.min(this.updatedAt - this.prevUpdatedAt, gi);
    return ws(parseFloat(this.current) - parseFloat(this.prevFrameValue), n);
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
function Dt(t, e) {
  return new ol(t, e);
}
const { schedule: _n } = /* @__PURE__ */ Is(queueMicrotask, !1), Z = {
  x: !1,
  y: !1
};
function ao() {
  return Z.x || Z.y;
}
function rl(t) {
  return t === "x" || t === "y" ? Z[t] ? null : (Z[t] = !0, () => {
    Z[t] = !1;
  }) : Z.x || Z.y ? null : (Z.x = Z.y = !0, () => {
    Z.x = Z.y = !1;
  });
}
function lo(t, e) {
  const n = il(t), i = new AbortController(), s = {
    passive: !0,
    ...e,
    signal: i.signal
  };
  return [n, s, () => i.abort()];
}
function xi(t) {
  return !(t.pointerType === "touch" || ao());
}
function al(t, e, n = {}) {
  const [i, s, r] = lo(t, n), o = (a) => {
    if (!xi(a))
      return;
    const { target: l } = a, d = e(l, a);
    if (typeof d != "function" || !l)
      return;
    const c = (h) => {
      xi(h) && (d(h), l.removeEventListener("pointerleave", c));
    };
    l.addEventListener("pointerleave", c, s);
  };
  return i.forEach((a) => {
    a.addEventListener("pointerenter", o, s);
  }), r;
}
const co = (t, e) => e ? t === e ? !0 : co(t, e.parentElement) : !1, Kn = (t) => t.pointerType === "mouse" ? typeof t.button != "number" || t.button <= 0 : t.isPrimary !== !1, ll = /* @__PURE__ */ new Set([
  "BUTTON",
  "INPUT",
  "SELECT",
  "TEXTAREA",
  "A"
]);
function cl(t) {
  return ll.has(t.tagName) || t.tabIndex !== -1;
}
const le = /* @__PURE__ */ new WeakSet();
function vi(t) {
  return (e) => {
    e.key === "Enter" && t(e);
  };
}
function Oe(t, e) {
  t.dispatchEvent(new PointerEvent("pointer" + e, { isPrimary: !0, bubbles: !0 }));
}
const ul = (t, e) => {
  const n = t.currentTarget;
  if (!n)
    return;
  const i = vi(() => {
    if (le.has(n))
      return;
    Oe(n, "down");
    const s = vi(() => {
      Oe(n, "up");
    }), r = () => Oe(n, "cancel");
    n.addEventListener("keyup", s, e), n.addEventListener("blur", r, e);
  });
  n.addEventListener("keydown", i, e), n.addEventListener("blur", () => n.removeEventListener("keydown", i), e);
};
function bi(t) {
  return Kn(t) && !ao();
}
function dl(t, e, n = {}) {
  const [i, s, r] = lo(t, n), o = (a) => {
    const l = a.currentTarget;
    if (!bi(a))
      return;
    le.add(l);
    const d = e(l, a), c = (p, m) => {
      window.removeEventListener("pointerup", h), window.removeEventListener("pointercancel", f), le.has(l) && le.delete(l), bi(p) && typeof d == "function" && d(p, { success: m });
    }, h = (p) => {
      c(p, l === window || l === document || n.useGlobalTarget || co(l, p.target));
    }, f = (p) => {
      c(p, !1);
    };
    window.addEventListener("pointerup", h, s), window.addEventListener("pointercancel", f, s);
  };
  return i.forEach((a) => {
    (n.useGlobalTarget ? window : a).addEventListener("pointerdown", o, s), ro(a) && (a.addEventListener("focus", (d) => ul(d, s)), !cl(a) && !a.hasAttribute("tabindex") && (a.tabIndex = 0));
  }), r;
}
function uo(t) {
  return Ts(t) && "ownerSVGElement" in t;
}
function hl(t) {
  return uo(t) && t.tagName === "svg";
}
const z = (t) => !!(t && t.getVelocity), fl = [...no, F, ct], pl = (t) => fl.find(eo(t)), Wn = Rt({
  transformPagePoint: (t) => t,
  isStatic: !1,
  reducedMotion: "never"
});
function Si(t, e) {
  if (typeof t == "function")
    return t(e);
  t != null && (t.current = e);
}
function ml(...t) {
  return (e) => {
    let n = !1;
    const i = t.map((s) => {
      const r = Si(s, e);
      return !n && typeof r == "function" && (n = !0), r;
    });
    if (n)
      return () => {
        for (let s = 0; s < i.length; s++) {
          const r = i[s];
          typeof r == "function" ? r() : Si(t[s], null);
        }
      };
  };
}
function yl(...t) {
  return Se.useCallback(ml(...t), t);
}
class gl extends Se.Component {
  getSnapshotBeforeUpdate(e) {
    const n = this.props.childRef.current;
    if (n && e.isPresent && !this.props.isPresent) {
      const i = n.offsetParent, s = ro(i) && i.offsetWidth || 0, r = this.props.sizeRef.current;
      r.height = n.offsetHeight || 0, r.width = n.offsetWidth || 0, r.top = n.offsetTop, r.left = n.offsetLeft, r.right = s - r.width - r.left;
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
function xl({ children: t, isPresent: e, anchorX: n, root: i }) {
  const s = gn(), r = at(null), o = at({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    right: 0
  }), { nonce: a } = W(Wn), l = yl(r, t?.ref);
  return gs(() => {
    const { width: d, height: c, top: h, left: f, right: p } = o.current;
    if (e || !r.current || !d || !c)
      return;
    const m = n === "left" ? `left: ${f}` : `right: ${p}`;
    r.current.dataset.motionPopId = s;
    const g = document.createElement("style");
    a && (g.nonce = a);
    const v = i ?? document.head;
    return v.appendChild(g), g.sheet && g.sheet.insertRule(`
          [data-motion-pop-id="${s}"] {
            position: absolute !important;
            width: ${d}px !important;
            height: ${c}px !important;
            ${m}px !important;
            top: ${h}px !important;
          }
        `), () => {
      v.contains(g) && v.removeChild(g);
    };
  }, [e]), u.jsx(gl, { isPresent: e, childRef: r, sizeRef: o, children: Se.cloneElement(t, { ref: l }) });
}
const vl = ({ children: t, initial: e, isPresent: n, onExitComplete: i, custom: s, presenceAffectsLayout: r, mode: o, anchorX: a, root: l }) => {
  const d = vn(bl), c = gn();
  let h = !0, f = gt(() => (h = !1, {
    id: c,
    initial: e,
    isPresent: n,
    custom: s,
    onExitComplete: (p) => {
      d.set(p, !0);
      for (const m of d.values())
        if (!m)
          return;
      i && i();
    },
    register: (p) => (d.set(p, !1), () => d.delete(p))
  }), [n, d, i]);
  return r && h && (f = { ...f }), gt(() => {
    d.forEach((p, m) => d.set(m, !1));
  }, [n]), Se.useEffect(() => {
    !n && !d.size && i && i();
  }, [n]), o === "popLayout" && (t = u.jsx(xl, { isPresent: n, anchorX: a, root: l, children: t })), u.jsx(we.Provider, { value: f, children: t });
};
function bl() {
  return /* @__PURE__ */ new Map();
}
function ho(t = !0) {
  const e = W(we);
  if (e === null)
    return [!0, null];
  const { isPresent: n, onExitComplete: i, register: s } = e, r = gn();
  Te(() => {
    if (t)
      return s(r);
  }, [t]);
  const o = xs(() => t && i && i(r), [r, i, t]);
  return !n && i ? [!1, o] : [!0];
}
const se = (t) => t.key || "";
function Ti(t) {
  const e = [];
  return or.forEach(t, (n) => {
    rr(n) && e.push(n);
  }), e;
}
const J = ({ children: t, custom: e, initial: n = !0, onExitComplete: i, presenceAffectsLayout: s = !0, mode: r = "sync", propagate: o = !1, anchorX: a = "left", root: l }) => {
  const [d, c] = ho(o), h = gt(() => Ti(t), [t]), f = o && !d ? [] : h.map(se), p = at(!0), m = at(h), g = vn(() => /* @__PURE__ */ new Map()), [v, y] = de(h), [b, x] = de(h);
  bs(() => {
    p.current = !1, m.current = h;
    for (let C = 0; C < b.length; C++) {
      const V = se(b[C]);
      f.includes(V) ? g.delete(V) : g.get(V) !== !0 && g.set(V, !1);
    }
  }, [b, f.length, f.join("-")]);
  const D = [];
  if (h !== v) {
    let C = [...h];
    for (let V = 0; V < b.length; V++) {
      const P = b[V], R = se(P);
      f.includes(R) || (C.splice(V, 0, P), D.push(P));
    }
    return r === "wait" && D.length && (C = D), x(Ti(C)), y(h), null;
  }
  const { forceRender: A } = W(xn);
  return u.jsx(u.Fragment, { children: b.map((C) => {
    const V = se(C), P = o && !d ? !1 : h === b || f.includes(V), R = () => {
      if (g.has(V))
        g.set(V, !0);
      else
        return;
      let L = !0;
      g.forEach((K) => {
        K || (L = !1);
      }), L && (A?.(), x(m.current), o && c?.(), i && i());
    };
    return u.jsx(vl, { isPresent: P, initial: !p.current || n ? void 0 : !1, custom: e, presenceAffectsLayout: s, mode: r, root: l, onExitComplete: P ? void 0 : R, anchorX: a, children: C }, V);
  }) });
}, fo = Rt({ strict: !1 }), Ai = {
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
}, Vt = {};
for (const t in Ai)
  Vt[t] = {
    isEnabled: (e) => Ai[t].some((n) => !!e[n])
  };
function Sl(t) {
  for (const e in t)
    Vt[e] = {
      ...Vt[e],
      ...t[e]
    };
}
const Tl = /* @__PURE__ */ new Set([
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
function me(t) {
  return t.startsWith("while") || t.startsWith("drag") && t !== "draggable" || t.startsWith("layout") || t.startsWith("onTap") || t.startsWith("onPan") || t.startsWith("onLayout") || Tl.has(t);
}
let po = (t) => !me(t);
function Al(t) {
  typeof t == "function" && (po = (e) => e.startsWith("on") ? !me(e) : t(e));
}
try {
  Al(require("@emotion/is-prop-valid").default);
} catch {
}
function wl(t, e, n) {
  const i = {};
  for (const s in t)
    s === "values" && typeof t.values == "object" || (po(s) || n === !0 && me(s) || !e && !me(s) || // If trying to use native HTML drag events, forward drag listeners
    t.draggable && s.startsWith("onDrag")) && (i[s] = t[s]);
  return i;
}
const Pe = /* @__PURE__ */ Rt({});
function je(t) {
  return t !== null && typeof t == "object" && typeof t.start == "function";
}
function Gt(t) {
  return typeof t == "string" || Array.isArray(t);
}
const zn = [
  "animate",
  "whileInView",
  "whileFocus",
  "whileHover",
  "whileTap",
  "whileDrag",
  "exit"
], $n = ["initial", ...zn];
function Ce(t) {
  return je(t.animate) || $n.some((e) => Gt(t[e]));
}
function mo(t) {
  return !!(Ce(t) || t.variants);
}
function Pl(t, e) {
  if (Ce(t)) {
    const { initial: n, animate: i } = t;
    return {
      initial: n === !1 || Gt(n) ? n : void 0,
      animate: Gt(i) ? i : void 0
    };
  }
  return t.inherit !== !1 ? e : {};
}
function jl(t) {
  const { initial: e, animate: n } = Pl(t, W(Pe));
  return gt(() => ({ initial: e, animate: n }), [wi(e), wi(n)]);
}
function wi(t) {
  return Array.isArray(t) ? t.join(" ") : t;
}
const Yt = {};
function Cl(t) {
  for (const e in t)
    Yt[e] = t[e], Dn(e) && (Yt[e].isCSSVariable = !0);
}
function yo(t, { layout: e, layoutId: n }) {
  return Bt.has(t) || t.startsWith("origin") || (e || n !== void 0) && (!!Yt[t] || t === "opacity");
}
const Dl = {
  x: "translateX",
  y: "translateY",
  z: "translateZ",
  transformPerspective: "perspective"
}, Vl = Et.length;
function Rl(t, e, n) {
  let i = "", s = !0;
  for (let r = 0; r < Vl; r++) {
    const o = Et[r], a = t[o];
    if (a === void 0)
      continue;
    let l = !0;
    if (typeof a == "number" ? l = a === (o.startsWith("scale") ? 1 : 0) : l = parseFloat(a) === 0, !l || n) {
      const d = oo(a, Nn[o]);
      if (!l) {
        s = !1;
        const c = Dl[o] || o;
        i += `${c}(${d}) `;
      }
      n && (e[o] = d);
    }
  }
  return i = i.trim(), n ? i = n(e, s ? "" : i) : s && (i = "none"), i;
}
function Un(t, e, n) {
  const { style: i, vars: s, transformOrigin: r } = t;
  let o = !1, a = !1;
  for (const l in e) {
    const d = e[l];
    if (Bt.has(l)) {
      o = !0;
      continue;
    } else if (Dn(l)) {
      s[l] = d;
      continue;
    } else {
      const c = oo(d, Nn[l]);
      l.startsWith("origin") ? (a = !0, r[l] = c) : i[l] = c;
    }
  }
  if (e.transform || (o || n ? i.transform = Rl(e, t.transform, n) : i.transform && (i.transform = "none")), a) {
    const { originX: l = "50%", originY: d = "50%", originZ: c = 0 } = r;
    i.transformOrigin = `${l} ${d} ${c}`;
  }
}
const Hn = () => ({
  style: {},
  transform: {},
  transformOrigin: {},
  vars: {}
});
function go(t, e, n) {
  for (const i in e)
    !z(e[i]) && !yo(i, n) && (t[i] = e[i]);
}
function Ml({ transformTemplate: t }, e) {
  return gt(() => {
    const n = Hn();
    return Un(n, e, t), Object.assign({}, n.vars, n.style);
  }, [e]);
}
function El(t, e) {
  const n = t.style || {}, i = {};
  return go(i, n, t), Object.assign(i, Ml(t, e)), i;
}
function Bl(t, e) {
  const n = {}, i = El(t, e);
  return t.drag && t.dragListener !== !1 && (n.draggable = !1, i.userSelect = i.WebkitUserSelect = i.WebkitTouchCallout = "none", i.touchAction = t.drag === !0 ? "none" : `pan-${t.drag === "x" ? "y" : "x"}`), t.tabIndex === void 0 && (t.onTap || t.onTapStart || t.whileTap) && (n.tabIndex = 0), n.style = i, n;
}
const kl = {
  offset: "stroke-dashoffset",
  array: "stroke-dasharray"
}, Il = {
  offset: "strokeDashoffset",
  array: "strokeDasharray"
};
function Ll(t, e, n = 1, i = 0, s = !0) {
  t.pathLength = 1;
  const r = s ? kl : Il;
  t[r.offset] = w.transform(-i);
  const o = w.transform(e), a = w.transform(n);
  t[r.array] = `${o} ${a}`;
}
function xo(t, {
  attrX: e,
  attrY: n,
  attrScale: i,
  pathLength: s,
  pathSpacing: r = 1,
  pathOffset: o = 0,
  // This is object creation, which we try to avoid per-frame.
  ...a
}, l, d, c) {
  if (Un(t, a, d), l) {
    t.style.viewBox && (t.attrs.viewBox = t.style.viewBox);
    return;
  }
  t.attrs = t.style, t.style = {};
  const { attrs: h, style: f } = t;
  h.transform && (f.transform = h.transform, delete h.transform), (f.transform || h.transformOrigin) && (f.transformOrigin = h.transformOrigin ?? "50% 50%", delete h.transformOrigin), f.transform && (f.transformBox = c?.transformBox ?? "fill-box", delete h.transformBox), e !== void 0 && (h.x = e), n !== void 0 && (h.y = n), i !== void 0 && (h.scale = i), s !== void 0 && Ll(h, s, r, o, !1);
}
const vo = () => ({
  ...Hn(),
  attrs: {}
}), bo = (t) => typeof t == "string" && t.toLowerCase() === "svg";
function Ol(t, e, n, i) {
  const s = gt(() => {
    const r = vo();
    return xo(r, e, bo(i), t.transformTemplate, t.style), {
      ...r.attrs,
      style: { ...r.style }
    };
  }, [e]);
  if (t.style) {
    const r = {};
    go(r, t.style, t), s.style = { ...r, ...s.style };
  }
  return s;
}
const Fl = [
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
function Gn(t) {
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
      !!(Fl.indexOf(t) > -1 || /**
       * If it contains a capital letter, it's an SVG component
       */
      /[A-Z]/u.test(t))
    )
  );
}
function Nl(t, e, n, { latestValues: i }, s, r = !1) {
  const a = (Gn(t) ? Ol : Bl)(e, i, s, t), l = wl(e, typeof t == "string", r), d = t !== vs ? { ...l, ...a, ref: n } : {}, { children: c } = e, h = gt(() => z(c) ? c.get() : c, [c]);
  return ar(t, {
    ...d,
    children: h
  });
}
function Pi(t) {
  const e = [{}, {}];
  return t?.values.forEach((n, i) => {
    e[0][i] = n.get(), e[1][i] = n.getVelocity();
  }), e;
}
function Yn(t, e, n, i) {
  if (typeof e == "function") {
    const [s, r] = Pi(i);
    e = e(n !== void 0 ? n : t.custom, s, r);
  }
  if (typeof e == "string" && (e = t.variants && t.variants[e]), typeof e == "function") {
    const [s, r] = Pi(i);
    e = e(n !== void 0 ? n : t.custom, s, r);
  }
  return e;
}
function ce(t) {
  return z(t) ? t.get() : t;
}
function _l({ scrapeMotionValuesFromProps: t, createRenderState: e }, n, i, s) {
  return {
    latestValues: Kl(n, i, s, t),
    renderState: e()
  };
}
function Kl(t, e, n, i) {
  const s = {}, r = i(t, {});
  for (const f in r)
    s[f] = ce(r[f]);
  let { initial: o, animate: a } = t;
  const l = Ce(t), d = mo(t);
  e && d && !l && t.inherit !== !1 && (o === void 0 && (o = e.initial), a === void 0 && (a = e.animate));
  let c = n ? n.initial === !1 : !1;
  c = c || o === !1;
  const h = c ? a : o;
  if (h && typeof h != "boolean" && !je(h)) {
    const f = Array.isArray(h) ? h : [h];
    for (let p = 0; p < f.length; p++) {
      const m = Yn(t, f[p]);
      if (m) {
        const { transitionEnd: g, transition: v, ...y } = m;
        for (const b in y) {
          let x = y[b];
          if (Array.isArray(x)) {
            const D = c ? x.length - 1 : 0;
            x = x[D];
          }
          x !== null && (s[b] = x);
        }
        for (const b in g)
          s[b] = g[b];
      }
    }
  }
  return s;
}
const So = (t) => (e, n) => {
  const i = W(Pe), s = W(we), r = () => _l(t, e, i, s);
  return n ? r() : vn(r);
};
function Xn(t, e, n) {
  const { style: i } = t, s = {};
  for (const r in i)
    (z(i[r]) || e.style && z(e.style[r]) || yo(r, t) || n?.getValue(r)?.liveStyle !== void 0) && (s[r] = i[r]);
  return s;
}
const Wl = /* @__PURE__ */ So({
  scrapeMotionValuesFromProps: Xn,
  createRenderState: Hn
});
function To(t, e, n) {
  const i = Xn(t, e, n);
  for (const s in t)
    if (z(t[s]) || z(e[s])) {
      const r = Et.indexOf(s) !== -1 ? "attr" + s.charAt(0).toUpperCase() + s.substring(1) : s;
      i[r] = t[s];
    }
  return i;
}
const zl = /* @__PURE__ */ So({
  scrapeMotionValuesFromProps: To,
  createRenderState: vo
}), $l = Symbol.for("motionComponentSymbol");
function Tt(t) {
  return t && typeof t == "object" && Object.prototype.hasOwnProperty.call(t, "current");
}
function Ul(t, e, n) {
  return xs(
    (i) => {
      i && t.onMount && t.onMount(i), e && (i ? e.mount(i) : e.unmount()), n && (typeof n == "function" ? n(i) : Tt(n) && (n.current = i));
    },
    /**
     * Include externalRef in dependencies to ensure the callback updates
     * when the ref changes, allowing proper ref forwarding.
     */
    [e]
  );
}
const qn = (t) => t.replace(/([a-z])([A-Z])/gu, "$1-$2").toLowerCase(), Hl = "framerAppearId", Ao = "data-" + qn(Hl), wo = Rt({});
function Gl(t, e, n, i, s) {
  const { visualElement: r } = W(Pe), o = W(fo), a = W(we), l = W(Wn).reducedMotion, d = at(null);
  i = i || o.renderer, !d.current && i && (d.current = i(t, {
    visualState: e,
    parent: r,
    props: n,
    presenceContext: a,
    blockInitialAnimation: a ? a.initial === !1 : !1,
    reducedMotionConfig: l
  }));
  const c = d.current, h = W(wo);
  c && !c.projection && s && (c.type === "html" || c.type === "svg") && Yl(d.current, n, s, h);
  const f = at(!1);
  gs(() => {
    c && f.current && c.update(n, a);
  });
  const p = n[Ao], m = at(!!p && !window.MotionHandoffIsComplete?.(p) && window.MotionHasOptimisedAnimation?.(p));
  return bs(() => {
    c && (f.current = !0, window.MotionIsMounted = !0, c.updateFeatures(), c.scheduleRenderMicrotask(), m.current && c.animationState && c.animationState.animateChanges());
  }), Te(() => {
    c && (!m.current && c.animationState && c.animationState.animateChanges(), m.current && (queueMicrotask(() => {
      window.MotionHandoffMarkAsComplete?.(p);
    }), m.current = !1), c.enteringChildren = void 0);
  }), c;
}
function Yl(t, e, n, i) {
  const { layoutId: s, layout: r, drag: o, dragConstraints: a, layoutScroll: l, layoutRoot: d, layoutCrossfade: c } = e;
  t.projection = new n(t.latestValues, e["data-framer-portal-id"] ? void 0 : Po(t.parent)), t.projection.setOptions({
    layoutId: s,
    layout: r,
    alwaysMeasureLayout: !!o || a && Tt(a),
    visualElement: t,
    /**
     * TODO: Update options in an effect. This could be tricky as it'll be too late
     * to update by the time layout animations run.
     * We also need to fix this safeToRemove by linking it up to the one returned by usePresence,
     * ensuring it gets called if there's no potential layout animations.
     *
     */
    animationType: typeof r == "string" ? r : "both",
    initialPromotionConfig: i,
    crossfade: c,
    layoutScroll: l,
    layoutRoot: d
  });
}
function Po(t) {
  if (t)
    return t.options.allowProjection !== !1 ? t.projection : Po(t.parent);
}
function Fe(t, { forwardMotionProps: e = !1 } = {}, n, i) {
  n && Sl(n);
  const s = Gn(t) ? zl : Wl;
  function r(a, l) {
    let d;
    const c = {
      ...W(Wn),
      ...a,
      layoutId: Xl(a)
    }, { isStatic: h } = c, f = jl(a), p = s(a, h);
    if (!h && bn) {
      ql();
      const m = Ql(c);
      d = m.MeasureLayout, f.visualElement = Gl(t, p, c, i, m.ProjectionNode);
    }
    return u.jsxs(Pe.Provider, { value: f, children: [d && f.visualElement ? u.jsx(d, { visualElement: f.visualElement, ...c }) : null, Nl(t, a, Ul(p, f.visualElement, l), p, h, e)] });
  }
  r.displayName = `motion.${typeof t == "string" ? t : `create(${t.displayName ?? t.name ?? ""})`}`;
  const o = lr(r);
  return o[$l] = t, o;
}
function Xl({ layoutId: t }) {
  const e = W(xn).id;
  return e && t !== void 0 ? e + "-" + t : t;
}
function ql(t, e) {
  W(fo).strict;
}
function Ql(t) {
  const { drag: e, layout: n } = Vt;
  if (!e && !n)
    return {};
  const i = { ...e, ...n };
  return {
    MeasureLayout: e?.isEnabled(t) || n?.isEnabled(t) ? i.MeasureLayout : void 0,
    ProjectionNode: i.ProjectionNode
  };
}
function Jl(t, e) {
  if (typeof Proxy > "u")
    return Fe;
  const n = /* @__PURE__ */ new Map(), i = (r, o) => Fe(r, o, t, e), s = (r, o) => i(r, o);
  return new Proxy(s, {
    /**
     * Called when `motion` is referenced with a prop: `motion.div`, `motion.input` etc.
     * The prop name is passed through as `key` and we can use that to generate a `motion`
     * DOM component with that name.
     */
    get: (r, o) => o === "create" ? i : (n.has(o) || n.set(o, Fe(o, void 0, t, e)), n.get(o))
  });
}
function jo({ top: t, left: e, right: n, bottom: i }) {
  return {
    x: { min: e, max: n },
    y: { min: t, max: i }
  };
}
function Zl({ x: t, y: e }) {
  return { top: e.min, right: t.max, bottom: e.max, left: t.min };
}
function tc(t, e) {
  if (!e)
    return t;
  const n = e({ x: t.left, y: t.top }), i = e({ x: t.right, y: t.bottom });
  return {
    top: n.y,
    left: n.x,
    bottom: i.y,
    right: i.x
  };
}
function Ne(t) {
  return t === void 0 || t === 1;
}
function cn({ scale: t, scaleX: e, scaleY: n }) {
  return !Ne(t) || !Ne(e) || !Ne(n);
}
function ht(t) {
  return cn(t) || Co(t) || t.z || t.rotate || t.rotateX || t.rotateY || t.skewX || t.skewY;
}
function Co(t) {
  return ji(t.x) || ji(t.y);
}
function ji(t) {
  return t && t !== "0%";
}
function ye(t, e, n) {
  const i = t - n, s = e * i;
  return n + s;
}
function Ci(t, e, n, i, s) {
  return s !== void 0 && (t = ye(t, s, i)), ye(t, n, i) + e;
}
function un(t, e = 0, n = 1, i, s) {
  t.min = Ci(t.min, e, n, i, s), t.max = Ci(t.max, e, n, i, s);
}
function Do(t, { x: e, y: n }) {
  un(t.x, e.translate, e.scale, e.originPoint), un(t.y, n.translate, n.scale, n.originPoint);
}
const Di = 0.999999999999, Vi = 1.0000000000001;
function ec(t, e, n, i = !1) {
  const s = n.length;
  if (!s)
    return;
  e.x = e.y = 1;
  let r, o;
  for (let a = 0; a < s; a++) {
    r = n[a], o = r.projectionDelta;
    const { visualElement: l } = r.options;
    l && l.props.style && l.props.style.display === "contents" || (i && r.options.layoutScroll && r.scroll && r !== r.root && wt(t, {
      x: -r.scroll.offset.x,
      y: -r.scroll.offset.y
    }), o && (e.x *= o.x.scale, e.y *= o.y.scale, Do(t, o)), i && ht(r.latestValues) && wt(t, r.latestValues));
  }
  e.x < Vi && e.x > Di && (e.x = 1), e.y < Vi && e.y > Di && (e.y = 1);
}
function At(t, e) {
  t.min = t.min + e, t.max = t.max + e;
}
function Ri(t, e, n, i, s = 0.5) {
  const r = E(t.min, t.max, s);
  un(t, e, n, r, i);
}
function wt(t, e) {
  Ri(t.x, e.x, e.scaleX, e.scale, e.originX), Ri(t.y, e.y, e.scaleY, e.scale, e.originY);
}
function Vo(t, e) {
  return jo(tc(t.getBoundingClientRect(), e));
}
function nc(t, e, n) {
  const i = Vo(t, n), { scroll: s } = e;
  return s && (At(i.x, s.offset.x), At(i.y, s.offset.y)), i;
}
const Mi = () => ({
  translate: 0,
  scale: 1,
  origin: 0,
  originPoint: 0
}), Pt = () => ({
  x: Mi(),
  y: Mi()
}), Ei = () => ({ min: 0, max: 0 }), I = () => ({
  x: Ei(),
  y: Ei()
}), dn = { current: null }, Ro = { current: !1 };
function ic() {
  if (Ro.current = !0, !!bn)
    if (window.matchMedia) {
      const t = window.matchMedia("(prefers-reduced-motion)"), e = () => dn.current = t.matches;
      t.addEventListener("change", e), e();
    } else
      dn.current = !1;
}
const sc = /* @__PURE__ */ new WeakMap();
function oc(t, e, n) {
  for (const i in e) {
    const s = e[i], r = n[i];
    if (z(s))
      t.addValue(i, s);
    else if (z(r))
      t.addValue(i, Dt(s, { owner: t }));
    else if (r !== s)
      if (t.hasValue(i)) {
        const o = t.getValue(i);
        o.liveStyle === !0 ? o.jump(s) : o.hasAnimated || o.set(s);
      } else {
        const o = t.getStaticValue(i);
        t.addValue(i, Dt(o !== void 0 ? o : s, { owner: t }));
      }
  }
  for (const i in n)
    e[i] === void 0 && t.removeValue(i);
  return e;
}
const Bi = [
  "AnimationStart",
  "AnimationComplete",
  "Update",
  "BeforeLayoutMeasure",
  "LayoutMeasure",
  "LayoutAnimationStart",
  "LayoutAnimationComplete"
];
class rc {
  /**
   * This method takes React props and returns found MotionValues. For example, HTML
   * MotionValues will be found within the style prop, whereas for Three.js within attribute arrays.
   *
   * This isn't an abstract method as it needs calling in the constructor, but it is
   * intended to be one.
   */
  scrapeMotionValuesFromProps(e, n, i) {
    return {};
  }
  constructor({ parent: e, props: n, presenceContext: i, reducedMotionConfig: s, blockInitialAnimation: r, visualState: o }, a = {}) {
    this.current = null, this.children = /* @__PURE__ */ new Set(), this.isVariantNode = !1, this.isControllingVariants = !1, this.shouldReduceMotion = null, this.values = /* @__PURE__ */ new Map(), this.KeyframeResolver = On, this.features = {}, this.valueSubscriptions = /* @__PURE__ */ new Map(), this.prevMotionValues = {}, this.events = {}, this.propEventSubscriptions = {}, this.notifyUpdate = () => this.notify("Update", this.latestValues), this.render = () => {
      this.current && (this.triggerBuild(), this.renderInstance(this.current, this.renderState, this.props.style, this.projection));
    }, this.renderScheduledAt = 0, this.scheduleRender = () => {
      const f = H.now();
      this.renderScheduledAt < f && (this.renderScheduledAt = f, M.render(this.render, !1, !0));
    };
    const { latestValues: l, renderState: d } = o;
    this.latestValues = l, this.baseTarget = { ...l }, this.initialValues = n.initial ? { ...l } : {}, this.renderState = d, this.parent = e, this.props = n, this.presenceContext = i, this.depth = e ? e.depth + 1 : 0, this.reducedMotionConfig = s, this.options = a, this.blockInitialAnimation = !!r, this.isControllingVariants = Ce(n), this.isVariantNode = mo(n), this.isVariantNode && (this.variantChildren = /* @__PURE__ */ new Set()), this.manuallyAnimateOnMount = !!(e && e.current);
    const { willChange: c, ...h } = this.scrapeMotionValuesFromProps(n, {}, this);
    for (const f in h) {
      const p = h[f];
      l[f] !== void 0 && z(p) && p.set(l[f]);
    }
  }
  mount(e) {
    this.current = e, sc.set(e, this), this.projection && !this.projection.instance && this.projection.mount(e), this.parent && this.isVariantNode && !this.isControllingVariants && (this.removeFromVariantTree = this.parent.addVariantChild(this)), this.values.forEach((n, i) => this.bindToMotionValue(i, n)), Ro.current || ic(), this.shouldReduceMotion = this.reducedMotionConfig === "never" ? !1 : this.reducedMotionConfig === "always" ? !0 : dn.current, this.parent?.addChild(this), this.update(this.props, this.presenceContext);
  }
  unmount() {
    this.projection && this.projection.unmount(), lt(this.notifyUpdate), lt(this.render), this.valueSubscriptions.forEach((e) => e()), this.valueSubscriptions.clear(), this.removeFromVariantTree && this.removeFromVariantTree(), this.parent?.removeChild(this);
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
    const i = Bt.has(e);
    i && this.onBindTransform && this.onBindTransform();
    const s = n.on("change", (o) => {
      this.latestValues[e] = o, this.props.onUpdate && M.preRender(this.notifyUpdate), i && this.projection && (this.projection.isTransformDirty = !0), this.scheduleRender();
    });
    let r;
    window.MotionCheckAppearSync && (r = window.MotionCheckAppearSync(this, e, n)), this.valueSubscriptions.set(e, () => {
      s(), r && r(), n.owner && n.stop();
    });
  }
  sortNodePosition(e) {
    return !this.current || !this.sortInstanceNodePosition || this.type !== e.type ? 0 : this.sortInstanceNodePosition(this.current, e.current);
  }
  updateFeatures() {
    let e = "animation";
    for (e in Vt) {
      const n = Vt[e];
      if (!n)
        continue;
      const { isEnabled: i, Feature: s } = n;
      if (!this.features[e] && s && i(this.props) && (this.features[e] = new s(this)), this.features[e]) {
        const r = this.features[e];
        r.isMounted ? r.update() : (r.mount(), r.isMounted = !0);
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
    return this.current ? this.measureInstanceViewportBox(this.current, this.props) : I();
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
    for (let i = 0; i < Bi.length; i++) {
      const s = Bi[i];
      this.propEventSubscriptions[s] && (this.propEventSubscriptions[s](), delete this.propEventSubscriptions[s]);
      const r = "on" + s, o = e[r];
      o && (this.propEventSubscriptions[s] = this.on(s, o));
    }
    this.prevMotionValues = oc(this, this.scrapeMotionValuesFromProps(e, this.prevProps, this), this.prevMotionValues), this.handleChildMotionValue && this.handleChildMotionValue();
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
    const i = this.values.get(e);
    n !== i && (i && this.removeValue(e), this.bindToMotionValue(e, n), this.values.set(e, n), this.latestValues[e] = n.get());
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
    let i = this.values.get(e);
    return i === void 0 && n !== void 0 && (i = Dt(n === null ? void 0 : n, { owner: this }), this.addValue(e, i)), i;
  }
  /**
   * If we're trying to animate to a previously unencountered value,
   * we need to check for it in our state and as a last resort read it
   * directly from the instance (which might have performance implications).
   */
  readValue(e, n) {
    let i = this.latestValues[e] !== void 0 || !this.current ? this.latestValues[e] : this.getBaseTargetFromProps(this.props, e) ?? this.readValueFromInstance(this.current, e, this.options);
    return i != null && (typeof i == "string" && (Ss(i) || As(i)) ? i = parseFloat(i) : !pl(i) && ct.test(n) && (i = so(e, n)), this.setBaseTarget(e, z(i) ? i.get() : i)), z(i) ? i.get() : i;
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
    let i;
    if (typeof n == "string" || typeof n == "object") {
      const r = Yn(this.props, n, this.presenceContext?.custom);
      r && (i = r[e]);
    }
    if (n && i !== void 0)
      return i;
    const s = this.getBaseTargetFromProps(this.props, e);
    return s !== void 0 && !z(s) ? s : this.initialValues[e] !== void 0 && i === void 0 ? void 0 : this.baseTarget[e];
  }
  on(e, n) {
    return this.events[e] || (this.events[e] = new Pn()), this.events[e].add(n);
  }
  notify(e, ...n) {
    this.events[e] && this.events[e].notify(...n);
  }
  scheduleRenderMicrotask() {
    _n.render(this.render);
  }
}
class Mo extends rc {
  constructor() {
    super(...arguments), this.KeyframeResolver = nl;
  }
  sortInstanceNodePosition(e, n) {
    return e.compareDocumentPosition(n) & 2 ? 1 : -1;
  }
  getBaseTargetFromProps(e, n) {
    return e.style ? e.style[n] : void 0;
  }
  removeValueFromRenderState(e, { vars: n, style: i }) {
    delete n[e], delete i[e];
  }
  handleChildMotionValue() {
    this.childSubscription && (this.childSubscription(), delete this.childSubscription);
    const { children: e } = this.props;
    z(e) && (this.childSubscription = e.on("change", (n) => {
      this.current && (this.current.textContent = `${n}`);
    }));
  }
}
function Eo(t, { style: e, vars: n }, i, s) {
  const r = t.style;
  let o;
  for (o in e)
    r[o] = e[o];
  s?.applyProjectionStyles(r, i);
  for (o in n)
    r.setProperty(o, n[o]);
}
function ac(t) {
  return window.getComputedStyle(t);
}
class lc extends Mo {
  constructor() {
    super(...arguments), this.type = "html", this.renderInstance = Eo;
  }
  readValueFromInstance(e, n) {
    if (Bt.has(n))
      return this.projection?.isProjecting ? en(n) : Sa(e, n);
    {
      const i = ac(e), s = (Dn(n) ? i.getPropertyValue(n) : i[n]) || 0;
      return typeof s == "string" ? s.trim() : s;
    }
  }
  measureInstanceViewportBox(e, { transformPagePoint: n }) {
    return Vo(e, n);
  }
  build(e, n, i) {
    Un(e, n, i.transformTemplate);
  }
  scrapeMotionValuesFromProps(e, n, i) {
    return Xn(e, n, i);
  }
}
const Bo = /* @__PURE__ */ new Set([
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
function cc(t, e, n, i) {
  Eo(t, e, void 0, i);
  for (const s in e.attrs)
    t.setAttribute(Bo.has(s) ? s : qn(s), e.attrs[s]);
}
class uc extends Mo {
  constructor() {
    super(...arguments), this.type = "svg", this.isSVGTag = !1, this.measureInstanceViewportBox = I;
  }
  getBaseTargetFromProps(e, n) {
    return e[n];
  }
  readValueFromInstance(e, n) {
    if (Bt.has(n)) {
      const i = io(n);
      return i && i.default || 0;
    }
    return n = Bo.has(n) ? n : qn(n), e.getAttribute(n);
  }
  scrapeMotionValuesFromProps(e, n, i) {
    return To(e, n, i);
  }
  build(e, n, i) {
    xo(e, n, this.isSVGTag, i.transformTemplate, i.style);
  }
  renderInstance(e, n, i, s) {
    cc(e, n, i, s);
  }
  mount(e) {
    this.isSVGTag = bo(e.tagName), super.mount(e);
  }
}
const dc = (t, e) => Gn(t) ? new uc(e) : new lc(e, {
  allowProjection: t !== vs
});
function jt(t, e, n) {
  const i = t.getProps();
  return Yn(i, e, n !== void 0 ? n : i.custom, t);
}
const hn = (t) => Array.isArray(t);
function hc(t, e, n) {
  t.hasValue(e) ? t.getValue(e).set(n) : t.addValue(e, Dt(n));
}
function fc(t) {
  return hn(t) ? t[t.length - 1] || 0 : t;
}
function pc(t, e) {
  const n = jt(t, e);
  let { transitionEnd: i = {}, transition: s = {}, ...r } = n || {};
  r = { ...r, ...i };
  for (const o in r) {
    const a = fc(r[o]);
    hc(t, o, a);
  }
}
function mc(t) {
  return !!(z(t) && t.add);
}
function fn(t, e) {
  const n = t.getValue("willChange");
  if (mc(n))
    return n.add(e);
  if (!n && st.WillChange) {
    const i = new st.WillChange("auto");
    t.addValue("willChange", i), i.add(e);
  }
}
function ko(t) {
  return t.props[Ao];
}
const yc = (t) => t !== null;
function gc(t, { repeat: e, repeatType: n = "loop" }, i) {
  const s = t.filter(yc), r = e && n !== "loop" && e % 2 === 1 ? 0 : s.length - 1;
  return s[r];
}
const xc = {
  type: "spring",
  stiffness: 500,
  damping: 25,
  restSpeed: 10
}, vc = (t) => ({
  type: "spring",
  stiffness: 550,
  damping: t === 0 ? 2 * Math.sqrt(550) : 30,
  restSpeed: 10
}), bc = {
  type: "keyframes",
  duration: 0.8
}, Sc = {
  type: "keyframes",
  ease: [0.25, 0.1, 0.35, 1],
  duration: 0.3
}, Tc = (t, { keyframes: e }) => e.length > 2 ? bc : Bt.has(t) ? t.startsWith("scale") ? vc(e[1]) : xc : Sc;
function Ac({ when: t, delay: e, delayChildren: n, staggerChildren: i, staggerDirection: s, repeat: r, repeatType: o, repeatDelay: a, from: l, elapsed: d, ...c }) {
  return !!Object.keys(c).length;
}
const Qn = (t, e, n, i = {}, s, r) => (o) => {
  const a = Fn(i, t) || {}, l = a.delay || i.delay || 0;
  let { elapsed: d = 0 } = i;
  d = d - /* @__PURE__ */ tt(l);
  const c = {
    keyframes: Array.isArray(n) ? n : [null, n],
    ease: "easeOut",
    velocity: e.getVelocity(),
    ...a,
    delay: -d,
    onUpdate: (f) => {
      e.set(f), a.onUpdate && a.onUpdate(f);
    },
    onComplete: () => {
      o(), a.onComplete && a.onComplete();
    },
    name: t,
    motionValue: e,
    element: r ? void 0 : s
  };
  Ac(a) || Object.assign(c, Tc(t, c)), c.duration && (c.duration = /* @__PURE__ */ tt(c.duration)), c.repeatDelay && (c.repeatDelay = /* @__PURE__ */ tt(c.repeatDelay)), c.from !== void 0 && (c.keyframes[0] = c.from);
  let h = !1;
  if ((c.type === !1 || c.duration === 0 && !c.repeatDelay) && (an(c), c.delay === 0 && (h = !0)), (st.instantAnimations || st.skipAnimations) && (h = !0, an(c), c.delay = 0), c.allowFlatten = !a.type && !a.ease, h && !r && e.get() !== void 0) {
    const f = gc(c.keyframes, a);
    if (f !== void 0) {
      M.update(() => {
        c.onUpdate(f), c.onComplete();
      });
      return;
    }
  }
  return a.isSync ? new Ln(c) : new $a(c);
};
function wc({ protectedKeys: t, needsAnimating: e }, n) {
  const i = t.hasOwnProperty(n) && e[n] !== !0;
  return e[n] = !1, i;
}
function Io(t, e, { delay: n = 0, transitionOverride: i, type: s } = {}) {
  let { transition: r = t.getDefaultTransition(), transitionEnd: o, ...a } = e;
  i && (r = i);
  const l = [], d = s && t.animationState && t.animationState.getState()[s];
  for (const c in a) {
    const h = t.getValue(c, t.latestValues[c] ?? null), f = a[c];
    if (f === void 0 || d && wc(d, c))
      continue;
    const p = {
      delay: n,
      ...Fn(r || {}, c)
    }, m = h.get();
    if (m !== void 0 && !h.isAnimating && !Array.isArray(f) && f === m && !p.velocity)
      continue;
    let g = !1;
    if (window.MotionHandoffAnimation) {
      const y = ko(t);
      if (y) {
        const b = window.MotionHandoffAnimation(y, c, M);
        b !== null && (p.startTime = b, g = !0);
      }
    }
    fn(t, c), h.start(Qn(c, h, f, t.shouldReduceMotion && to.has(c) ? { type: !1 } : p, t, g));
    const v = h.animation;
    v && l.push(v);
  }
  return o && Promise.all(l).then(() => {
    M.update(() => {
      o && pc(t, o);
    });
  }), l;
}
function Lo(t, e, n, i = 0, s = 1) {
  const r = Array.from(t).sort((d, c) => d.sortNodePosition(c)).indexOf(e), o = t.size, a = (o - 1) * i;
  return typeof n == "function" ? n(r, o) : s === 1 ? r * i : a - r * i;
}
function pn(t, e, n = {}) {
  const i = jt(t, e, n.type === "exit" ? t.presenceContext?.custom : void 0);
  let { transition: s = t.getDefaultTransition() || {} } = i || {};
  n.transitionOverride && (s = n.transitionOverride);
  const r = i ? () => Promise.all(Io(t, i, n)) : () => Promise.resolve(), o = t.variantChildren && t.variantChildren.size ? (l = 0) => {
    const { delayChildren: d = 0, staggerChildren: c, staggerDirection: h } = s;
    return Pc(t, e, l, d, c, h, n);
  } : () => Promise.resolve(), { when: a } = s;
  if (a) {
    const [l, d] = a === "beforeChildren" ? [r, o] : [o, r];
    return l().then(() => d());
  } else
    return Promise.all([r(), o(n.delay)]);
}
function Pc(t, e, n = 0, i = 0, s = 0, r = 1, o) {
  const a = [];
  for (const l of t.variantChildren)
    l.notify("AnimationStart", e), a.push(pn(l, e, {
      ...o,
      delay: n + (typeof i == "function" ? 0 : i) + Lo(t.variantChildren, l, i, s, r)
    }).then(() => l.notify("AnimationComplete", e)));
  return Promise.all(a);
}
function jc(t, e, n = {}) {
  t.notify("AnimationStart", e);
  let i;
  if (Array.isArray(e)) {
    const s = e.map((r) => pn(t, r, n));
    i = Promise.all(s);
  } else if (typeof e == "string")
    i = pn(t, e, n);
  else {
    const s = typeof e == "function" ? jt(t, e, n.custom) : e;
    i = Promise.all(Io(t, s, n));
  }
  return i.then(() => {
    t.notify("AnimationComplete", e);
  });
}
function Oo(t, e) {
  if (!Array.isArray(e))
    return !1;
  const n = e.length;
  if (n !== t.length)
    return !1;
  for (let i = 0; i < n; i++)
    if (e[i] !== t[i])
      return !1;
  return !0;
}
const Cc = $n.length;
function Fo(t) {
  if (!t)
    return;
  if (!t.isControllingVariants) {
    const n = t.parent ? Fo(t.parent) || {} : {};
    return t.props.initial !== void 0 && (n.initial = t.props.initial), n;
  }
  const e = {};
  for (let n = 0; n < Cc; n++) {
    const i = $n[n], s = t.props[i];
    (Gt(s) || s === !1) && (e[i] = s);
  }
  return e;
}
const Dc = [...zn].reverse(), Vc = zn.length;
function Rc(t) {
  return (e) => Promise.all(e.map(({ animation: n, options: i }) => jc(t, n, i)));
}
function Mc(t) {
  let e = Rc(t), n = ki(), i = !0;
  const s = (l) => (d, c) => {
    const h = jt(t, c, l === "exit" ? t.presenceContext?.custom : void 0);
    if (h) {
      const { transition: f, transitionEnd: p, ...m } = h;
      d = { ...d, ...m, ...p };
    }
    return d;
  };
  function r(l) {
    e = l(t);
  }
  function o(l) {
    const { props: d } = t, c = Fo(t.parent) || {}, h = [], f = /* @__PURE__ */ new Set();
    let p = {}, m = 1 / 0;
    for (let v = 0; v < Vc; v++) {
      const y = Dc[v], b = n[y], x = d[y] !== void 0 ? d[y] : c[y], D = Gt(x), A = y === l ? b.isActive : null;
      A === !1 && (m = v);
      let C = x === c[y] && x !== d[y] && D;
      if (C && i && t.manuallyAnimateOnMount && (C = !1), b.protectedKeys = { ...p }, // If it isn't active and hasn't *just* been set as inactive
      !b.isActive && A === null || // If we didn't and don't have any defined prop for this animation type
      !x && !b.prevProp || // Or if the prop doesn't define an animation
      je(x) || typeof x == "boolean")
        continue;
      const V = Ec(b.prevProp, x);
      let P = V || // If we're making this variant active, we want to always make it active
      y === l && b.isActive && !C && D || // If we removed a higher-priority variant (i is in reverse order)
      v > m && D, R = !1;
      const L = Array.isArray(x) ? x : [x];
      let K = L.reduce(s(y), {});
      A === !1 && (K = {});
      const { prevResolvedValues: ot = {} } = b, nt = {
        ...ot,
        ...K
      }, xt = (k) => {
        P = !0, f.has(k) && (R = !0, f.delete(k)), b.needsAnimating[k] = !0;
        const O = t.getValue(k);
        O && (O.liveStyle = !1);
      };
      for (const k in nt) {
        const O = K[k], U = ot[k];
        if (p.hasOwnProperty(k))
          continue;
        let G = !1;
        hn(O) && hn(U) ? G = !Oo(O, U) : G = O !== U, G ? O != null ? xt(k) : f.add(k) : O !== void 0 && f.has(k) ? xt(k) : b.protectedKeys[k] = !0;
      }
      b.prevProp = x, b.prevResolvedValues = K, b.isActive && (p = { ...p, ...K }), i && t.blockInitialAnimation && (P = !1);
      const vt = C && V;
      P && (!vt || R) && h.push(...L.map((k) => {
        const O = { type: y };
        if (typeof k == "string" && i && !vt && t.manuallyAnimateOnMount && t.parent) {
          const { parent: U } = t, G = jt(U, k);
          if (U.enteringChildren && G) {
            const { delayChildren: N } = G.transition || {};
            O.delay = Lo(U.enteringChildren, t, N);
          }
        }
        return {
          animation: k,
          options: O
        };
      }));
    }
    if (f.size) {
      const v = {};
      if (typeof d.initial != "boolean") {
        const y = jt(t, Array.isArray(d.initial) ? d.initial[0] : d.initial);
        y && y.transition && (v.transition = y.transition);
      }
      f.forEach((y) => {
        const b = t.getBaseTarget(y), x = t.getValue(y);
        x && (x.liveStyle = !0), v[y] = b ?? null;
      }), h.push({ animation: v });
    }
    let g = !!h.length;
    return i && (d.initial === !1 || d.initial === d.animate) && !t.manuallyAnimateOnMount && (g = !1), i = !1, g ? e(h) : Promise.resolve();
  }
  function a(l, d) {
    if (n[l].isActive === d)
      return Promise.resolve();
    t.variantChildren?.forEach((h) => h.animationState?.setActive(l, d)), n[l].isActive = d;
    const c = o(l);
    for (const h in n)
      n[h].protectedKeys = {};
    return c;
  }
  return {
    animateChanges: o,
    setActive: a,
    setAnimateFunction: r,
    getState: () => n,
    reset: () => {
      n = ki();
    }
  };
}
function Ec(t, e) {
  return typeof e == "string" ? e !== t : Array.isArray(e) ? !Oo(e, t) : !1;
}
function dt(t = !1) {
  return {
    isActive: t,
    protectedKeys: {},
    needsAnimating: {},
    prevResolvedValues: {}
  };
}
function ki() {
  return {
    animate: dt(!0),
    whileInView: dt(),
    whileHover: dt(),
    whileTap: dt(),
    whileDrag: dt(),
    whileFocus: dt(),
    exit: dt()
  };
}
class ut {
  constructor(e) {
    this.isMounted = !1, this.node = e;
  }
  update() {
  }
}
class Bc extends ut {
  /**
   * We dynamically generate the AnimationState manager as it contains a reference
   * to the underlying animation library. We only want to load that if we load this,
   * so people can optionally code split it out using the `m` component.
   */
  constructor(e) {
    super(e), e.animationState || (e.animationState = Mc(e));
  }
  updateAnimationControlsSubscription() {
    const { animate: e } = this.node.getProps();
    je(e) && (this.unmountControls = e.subscribe(this.node));
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
let kc = 0;
class Ic extends ut {
  constructor() {
    super(...arguments), this.id = kc++;
  }
  update() {
    if (!this.node.presenceContext)
      return;
    const { isPresent: e, onExitComplete: n } = this.node.presenceContext, { isPresent: i } = this.node.prevPresenceContext || {};
    if (!this.node.animationState || e === i)
      return;
    const s = this.node.animationState.setActive("exit", !e);
    n && !e && s.then(() => {
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
const Lc = {
  animation: {
    Feature: Bc
  },
  exit: {
    Feature: Ic
  }
};
function Xt(t, e, n, i = { passive: !0 }) {
  return t.addEventListener(e, n, i), () => t.removeEventListener(e, n);
}
function Zt(t) {
  return {
    point: {
      x: t.pageX,
      y: t.pageY
    }
  };
}
const Oc = (t) => (e) => Kn(e) && t(e, Zt(e));
function Kt(t, e, n, i) {
  return Xt(t, e, Oc(n), i);
}
const No = 1e-4, Fc = 1 - No, Nc = 1 + No, _o = 0.01, _c = 0 - _o, Kc = 0 + _o;
function $(t) {
  return t.max - t.min;
}
function Wc(t, e, n) {
  return Math.abs(t - e) <= n;
}
function Ii(t, e, n, i = 0.5) {
  t.origin = i, t.originPoint = E(e.min, e.max, t.origin), t.scale = $(n) / $(e), t.translate = E(n.min, n.max, t.origin) - t.originPoint, (t.scale >= Fc && t.scale <= Nc || isNaN(t.scale)) && (t.scale = 1), (t.translate >= _c && t.translate <= Kc || isNaN(t.translate)) && (t.translate = 0);
}
function Wt(t, e, n, i) {
  Ii(t.x, e.x, n.x, i ? i.originX : void 0), Ii(t.y, e.y, n.y, i ? i.originY : void 0);
}
function Li(t, e, n) {
  t.min = n.min + e.min, t.max = t.min + $(e);
}
function zc(t, e, n) {
  Li(t.x, e.x, n.x), Li(t.y, e.y, n.y);
}
function Oi(t, e, n) {
  t.min = e.min - n.min, t.max = t.min + $(e);
}
function zt(t, e, n) {
  Oi(t.x, e.x, n.x), Oi(t.y, e.y, n.y);
}
function X(t) {
  return [t("x"), t("y")];
}
const Ko = ({ current: t }) => t ? t.ownerDocument.defaultView : null, Fi = (t, e) => Math.abs(t - e);
function $c(t, e) {
  const n = Fi(t.x, e.x), i = Fi(t.y, e.y);
  return Math.sqrt(n ** 2 + i ** 2);
}
class Wo {
  constructor(e, n, { transformPagePoint: i, contextWindow: s = window, dragSnapToOrigin: r = !1, distanceThreshold: o = 3 } = {}) {
    if (this.startEvent = null, this.lastMoveEvent = null, this.lastMoveEventInfo = null, this.handlers = {}, this.contextWindow = window, this.updatePoint = () => {
      if (!(this.lastMoveEvent && this.lastMoveEventInfo))
        return;
      const f = Ke(this.lastMoveEventInfo, this.history), p = this.startEvent !== null, m = $c(f.offset, { x: 0, y: 0 }) >= this.distanceThreshold;
      if (!p && !m)
        return;
      const { point: g } = f, { timestamp: v } = _;
      this.history.push({ ...g, timestamp: v });
      const { onStart: y, onMove: b } = this.handlers;
      p || (y && y(this.lastMoveEvent, f), this.startEvent = this.lastMoveEvent), b && b(this.lastMoveEvent, f);
    }, this.handlePointerMove = (f, p) => {
      this.lastMoveEvent = f, this.lastMoveEventInfo = _e(p, this.transformPagePoint), M.update(this.updatePoint, !0);
    }, this.handlePointerUp = (f, p) => {
      this.end();
      const { onEnd: m, onSessionEnd: g, resumeAnimation: v } = this.handlers;
      if (this.dragSnapToOrigin && v && v(), !(this.lastMoveEvent && this.lastMoveEventInfo))
        return;
      const y = Ke(f.type === "pointercancel" ? this.lastMoveEventInfo : _e(p, this.transformPagePoint), this.history);
      this.startEvent && m && m(f, y), g && g(f, y);
    }, !Kn(e))
      return;
    this.dragSnapToOrigin = r, this.handlers = n, this.transformPagePoint = i, this.distanceThreshold = o, this.contextWindow = s || window;
    const a = Zt(e), l = _e(a, this.transformPagePoint), { point: d } = l, { timestamp: c } = _;
    this.history = [{ ...d, timestamp: c }];
    const { onSessionStart: h } = n;
    h && h(e, Ke(l, this.history)), this.removeListeners = qt(Kt(this.contextWindow, "pointermove", this.handlePointerMove), Kt(this.contextWindow, "pointerup", this.handlePointerUp), Kt(this.contextWindow, "pointercancel", this.handlePointerUp));
  }
  updateHandlers(e) {
    this.handlers = e;
  }
  end() {
    this.removeListeners && this.removeListeners(), lt(this.updatePoint);
  }
}
function _e(t, e) {
  return e ? { point: e(t.point) } : t;
}
function Ni(t, e) {
  return { x: t.x - e.x, y: t.y - e.y };
}
function Ke({ point: t }, e) {
  return {
    point: t,
    delta: Ni(t, zo(e)),
    offset: Ni(t, Uc(e)),
    velocity: Hc(e, 0.1)
  };
}
function Uc(t) {
  return t[0];
}
function zo(t) {
  return t[t.length - 1];
}
function Hc(t, e) {
  if (t.length < 2)
    return { x: 0, y: 0 };
  let n = t.length - 1, i = null;
  const s = zo(t);
  for (; n >= 0 && (i = t[n], !(s.timestamp - i.timestamp > /* @__PURE__ */ tt(e))); )
    n--;
  if (!i)
    return { x: 0, y: 0 };
  const r = /* @__PURE__ */ q(s.timestamp - i.timestamp);
  if (r === 0)
    return { x: 0, y: 0 };
  const o = {
    x: (s.x - i.x) / r,
    y: (s.y - i.y) / r
  };
  return o.x === 1 / 0 && (o.x = 0), o.y === 1 / 0 && (o.y = 0), o;
}
function Gc(t, { min: e, max: n }, i) {
  return e !== void 0 && t < e ? t = i ? E(e, t, i.min) : Math.max(t, e) : n !== void 0 && t > n && (t = i ? E(n, t, i.max) : Math.min(t, n)), t;
}
function _i(t, e, n) {
  return {
    min: e !== void 0 ? t.min + e : void 0,
    max: n !== void 0 ? t.max + n - (t.max - t.min) : void 0
  };
}
function Yc(t, { top: e, left: n, bottom: i, right: s }) {
  return {
    x: _i(t.x, n, s),
    y: _i(t.y, e, i)
  };
}
function Ki(t, e) {
  let n = e.min - t.min, i = e.max - t.max;
  return e.max - e.min < t.max - t.min && ([n, i] = [i, n]), { min: n, max: i };
}
function Xc(t, e) {
  return {
    x: Ki(t.x, e.x),
    y: Ki(t.y, e.y)
  };
}
function qc(t, e) {
  let n = 0.5;
  const i = $(t), s = $(e);
  return s > i ? n = /* @__PURE__ */ $t(e.min, e.max - i, t.min) : i > s && (n = /* @__PURE__ */ $t(t.min, t.max - s, e.min)), it(0, 1, n);
}
function Qc(t, e) {
  const n = {};
  return e.min !== void 0 && (n.min = e.min - t.min), e.max !== void 0 && (n.max = e.max - t.min), n;
}
const mn = 0.35;
function Jc(t = mn) {
  return t === !1 ? t = 0 : t === !0 && (t = mn), {
    x: Wi(t, "left", "right"),
    y: Wi(t, "top", "bottom")
  };
}
function Wi(t, e, n) {
  return {
    min: zi(t, e),
    max: zi(t, n)
  };
}
function zi(t, e) {
  return typeof t == "number" ? t : t[e] || 0;
}
const Zc = /* @__PURE__ */ new WeakMap();
class tu {
  constructor(e) {
    this.openDragLock = null, this.isDragging = !1, this.currentDirection = null, this.originPoint = { x: 0, y: 0 }, this.constraints = !1, this.hasMutatedConstraints = !1, this.elastic = I(), this.latestPointerEvent = null, this.latestPanInfo = null, this.visualElement = e;
  }
  start(e, { snapToCursor: n = !1, distanceThreshold: i } = {}) {
    const { presenceContext: s } = this.visualElement;
    if (s && s.isPresent === !1)
      return;
    const r = (h) => {
      const { dragSnapToOrigin: f } = this.getProps();
      f ? this.pauseAnimation() : this.stopAnimation(), n && this.snapToCursor(Zt(h).point);
    }, o = (h, f) => {
      const { drag: p, dragPropagation: m, onDragStart: g } = this.getProps();
      if (p && !m && (this.openDragLock && this.openDragLock(), this.openDragLock = rl(p), !this.openDragLock))
        return;
      this.latestPointerEvent = h, this.latestPanInfo = f, this.isDragging = !0, this.currentDirection = null, this.resolveConstraints(), this.visualElement.projection && (this.visualElement.projection.isAnimationBlocked = !0, this.visualElement.projection.target = void 0), X((y) => {
        let b = this.getAxisMotionValue(y).get() || 0;
        if (et.test(b)) {
          const { projection: x } = this.visualElement;
          if (x && x.layout) {
            const D = x.layout.layoutBox[y];
            D && (b = $(D) * (parseFloat(b) / 100));
          }
        }
        this.originPoint[y] = b;
      }), g && M.postRender(() => g(h, f)), fn(this.visualElement, "transform");
      const { animationState: v } = this.visualElement;
      v && v.setActive("whileDrag", !0);
    }, a = (h, f) => {
      this.latestPointerEvent = h, this.latestPanInfo = f;
      const { dragPropagation: p, dragDirectionLock: m, onDirectionLock: g, onDrag: v } = this.getProps();
      if (!p && !this.openDragLock)
        return;
      const { offset: y } = f;
      if (m && this.currentDirection === null) {
        this.currentDirection = eu(y), this.currentDirection !== null && g && g(this.currentDirection);
        return;
      }
      this.updateAxis("x", f.point, y), this.updateAxis("y", f.point, y), this.visualElement.render(), v && v(h, f);
    }, l = (h, f) => {
      this.latestPointerEvent = h, this.latestPanInfo = f, this.stop(h, f), this.latestPointerEvent = null, this.latestPanInfo = null;
    }, d = () => X((h) => this.getAnimationState(h) === "paused" && this.getAxisMotionValue(h).animation?.play()), { dragSnapToOrigin: c } = this.getProps();
    this.panSession = new Wo(e, {
      onSessionStart: r,
      onStart: o,
      onMove: a,
      onSessionEnd: l,
      resumeAnimation: d
    }, {
      transformPagePoint: this.visualElement.getTransformPagePoint(),
      dragSnapToOrigin: c,
      distanceThreshold: i,
      contextWindow: Ko(this.visualElement)
    });
  }
  /**
   * @internal
   */
  stop(e, n) {
    const i = e || this.latestPointerEvent, s = n || this.latestPanInfo, r = this.isDragging;
    if (this.cancel(), !r || !s || !i)
      return;
    const { velocity: o } = s;
    this.startAnimation(o);
    const { onDragEnd: a } = this.getProps();
    a && M.postRender(() => a(i, s));
  }
  /**
   * @internal
   */
  cancel() {
    this.isDragging = !1;
    const { projection: e, animationState: n } = this.visualElement;
    e && (e.isAnimationBlocked = !1), this.panSession && this.panSession.end(), this.panSession = void 0;
    const { dragPropagation: i } = this.getProps();
    !i && this.openDragLock && (this.openDragLock(), this.openDragLock = null), n && n.setActive("whileDrag", !1);
  }
  updateAxis(e, n, i) {
    const { drag: s } = this.getProps();
    if (!i || !oe(e, s, this.currentDirection))
      return;
    const r = this.getAxisMotionValue(e);
    let o = this.originPoint[e] + i[e];
    this.constraints && this.constraints[e] && (o = Gc(o, this.constraints[e], this.elastic[e])), r.set(o);
  }
  resolveConstraints() {
    const { dragConstraints: e, dragElastic: n } = this.getProps(), i = this.visualElement.projection && !this.visualElement.projection.layout ? this.visualElement.projection.measure(!1) : this.visualElement.projection?.layout, s = this.constraints;
    e && Tt(e) ? this.constraints || (this.constraints = this.resolveRefConstraints()) : e && i ? this.constraints = Yc(i.layoutBox, e) : this.constraints = !1, this.elastic = Jc(n), s !== this.constraints && i && this.constraints && !this.hasMutatedConstraints && X((r) => {
      this.constraints !== !1 && this.getAxisMotionValue(r) && (this.constraints[r] = Qc(i.layoutBox[r], this.constraints[r]));
    });
  }
  resolveRefConstraints() {
    const { dragConstraints: e, onMeasureDragConstraints: n } = this.getProps();
    if (!e || !Tt(e))
      return !1;
    const i = e.current, { projection: s } = this.visualElement;
    if (!s || !s.layout)
      return !1;
    const r = nc(i, s.root, this.visualElement.getTransformPagePoint());
    let o = Xc(s.layout.layoutBox, r);
    if (n) {
      const a = n(Zl(o));
      this.hasMutatedConstraints = !!a, a && (o = jo(a));
    }
    return o;
  }
  startAnimation(e) {
    const { drag: n, dragMomentum: i, dragElastic: s, dragTransition: r, dragSnapToOrigin: o, onDragTransitionEnd: a } = this.getProps(), l = this.constraints || {}, d = X((c) => {
      if (!oe(c, n, this.currentDirection))
        return;
      let h = l && l[c] || {};
      o && (h = { min: 0, max: 0 });
      const f = s ? 200 : 1e6, p = s ? 40 : 1e7, m = {
        type: "inertia",
        velocity: i ? e[c] : 0,
        bounceStiffness: f,
        bounceDamping: p,
        timeConstant: 750,
        restDelta: 1,
        restSpeed: 10,
        ...r,
        ...h
      };
      return this.startAxisValueAnimation(c, m);
    });
    return Promise.all(d).then(a);
  }
  startAxisValueAnimation(e, n) {
    const i = this.getAxisMotionValue(e);
    return fn(this.visualElement, e), i.start(Qn(e, i, 0, n, this.visualElement, !1));
  }
  stopAnimation() {
    X((e) => this.getAxisMotionValue(e).stop());
  }
  pauseAnimation() {
    X((e) => this.getAxisMotionValue(e).animation?.pause());
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
    const n = `_drag${e.toUpperCase()}`, i = this.visualElement.getProps(), s = i[n];
    return s || this.visualElement.getValue(e, (i.initial ? i.initial[e] : void 0) || 0);
  }
  snapToCursor(e) {
    X((n) => {
      const { drag: i } = this.getProps();
      if (!oe(n, i, this.currentDirection))
        return;
      const { projection: s } = this.visualElement, r = this.getAxisMotionValue(n);
      if (s && s.layout) {
        const { min: o, max: a } = s.layout.layoutBox[n];
        r.set(e[n] - E(o, a, 0.5));
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
    const { drag: e, dragConstraints: n } = this.getProps(), { projection: i } = this.visualElement;
    if (!Tt(n) || !i || !this.constraints)
      return;
    this.stopAnimation();
    const s = { x: 0, y: 0 };
    X((o) => {
      const a = this.getAxisMotionValue(o);
      if (a && this.constraints !== !1) {
        const l = a.get();
        s[o] = qc({ min: l, max: l }, this.constraints[o]);
      }
    });
    const { transformTemplate: r } = this.visualElement.getProps();
    this.visualElement.current.style.transform = r ? r({}, "") : "none", i.root && i.root.updateScroll(), i.updateLayout(), this.resolveConstraints(), X((o) => {
      if (!oe(o, e, null))
        return;
      const a = this.getAxisMotionValue(o), { min: l, max: d } = this.constraints[o];
      a.set(E(l, d, s[o]));
    });
  }
  addListeners() {
    if (!this.visualElement.current)
      return;
    Zc.set(this.visualElement, this);
    const e = this.visualElement.current, n = Kt(e, "pointerdown", (l) => {
      const { drag: d, dragListener: c = !0 } = this.getProps();
      d && c && this.start(l);
    }), i = () => {
      const { dragConstraints: l } = this.getProps();
      Tt(l) && l.current && (this.constraints = this.resolveRefConstraints());
    }, { projection: s } = this.visualElement, r = s.addEventListener("measure", i);
    s && !s.layout && (s.root && s.root.updateScroll(), s.updateLayout()), M.read(i);
    const o = Xt(window, "resize", () => this.scalePositionWithinConstraints()), a = s.addEventListener("didUpdate", (({ delta: l, hasLayoutChanged: d }) => {
      this.isDragging && d && (X((c) => {
        const h = this.getAxisMotionValue(c);
        h && (this.originPoint[c] += l[c].translate, h.set(h.get() + l[c].translate));
      }), this.visualElement.render());
    }));
    return () => {
      o(), n(), r(), a && a();
    };
  }
  getProps() {
    const e = this.visualElement.getProps(), { drag: n = !1, dragDirectionLock: i = !1, dragPropagation: s = !1, dragConstraints: r = !1, dragElastic: o = mn, dragMomentum: a = !0 } = e;
    return {
      ...e,
      drag: n,
      dragDirectionLock: i,
      dragPropagation: s,
      dragConstraints: r,
      dragElastic: o,
      dragMomentum: a
    };
  }
}
function oe(t, e, n) {
  return (e === !0 || e === t) && (n === null || n === t);
}
function eu(t, e = 10) {
  let n = null;
  return Math.abs(t.y) > e ? n = "y" : Math.abs(t.x) > e && (n = "x"), n;
}
class nu extends ut {
  constructor(e) {
    super(e), this.removeGroupControls = Q, this.removeListeners = Q, this.controls = new tu(e);
  }
  mount() {
    const { dragControls: e } = this.node.getProps();
    e && (this.removeGroupControls = e.subscribe(this.controls)), this.removeListeners = this.controls.addListeners() || Q;
  }
  unmount() {
    this.removeGroupControls(), this.removeListeners();
  }
}
const $i = (t) => (e, n) => {
  t && M.postRender(() => t(e, n));
};
class iu extends ut {
  constructor() {
    super(...arguments), this.removePointerDownListener = Q;
  }
  onPointerDown(e) {
    this.session = new Wo(e, this.createPanHandlers(), {
      transformPagePoint: this.node.getTransformPagePoint(),
      contextWindow: Ko(this.node)
    });
  }
  createPanHandlers() {
    const { onPanSessionStart: e, onPanStart: n, onPan: i, onPanEnd: s } = this.node.getProps();
    return {
      onSessionStart: $i(e),
      onStart: $i(n),
      onMove: i,
      onEnd: (r, o) => {
        delete this.session, s && M.postRender(() => s(r, o));
      }
    };
  }
  mount() {
    this.removePointerDownListener = Kt(this.node.current, "pointerdown", (e) => this.onPointerDown(e));
  }
  update() {
    this.session && this.session.updateHandlers(this.createPanHandlers());
  }
  unmount() {
    this.removePointerDownListener(), this.session && this.session.end();
  }
}
const ue = {
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
function Ui(t, e) {
  return e.max === e.min ? 0 : t / (e.max - e.min) * 100;
}
const Ot = {
  correct: (t, e) => {
    if (!e.target)
      return t;
    if (typeof t == "string")
      if (w.test(t))
        t = parseFloat(t);
      else
        return t;
    const n = Ui(t, e.target.x), i = Ui(t, e.target.y);
    return `${n}% ${i}%`;
  }
}, su = {
  correct: (t, { treeScale: e, projectionDelta: n }) => {
    const i = t, s = ct.parse(t);
    if (s.length > 5)
      return i;
    const r = ct.createTransformer(t), o = typeof s[0] != "number" ? 1 : 0, a = n.x.scale * e.x, l = n.y.scale * e.y;
    s[0 + o] /= a, s[1 + o] /= l;
    const d = E(a, l, 0.5);
    return typeof s[2 + o] == "number" && (s[2 + o] /= d), typeof s[3 + o] == "number" && (s[3 + o] /= d), r(s);
  }
};
let We = !1;
class ou extends cr {
  /**
   * This only mounts projection nodes for components that
   * need measuring, we might want to do it for all components
   * in order to incorporate transforms
   */
  componentDidMount() {
    const { visualElement: e, layoutGroup: n, switchLayoutGroup: i, layoutId: s } = this.props, { projection: r } = e;
    Cl(ru), r && (n.group && n.group.add(r), i && i.register && s && i.register(r), We && r.root.didUpdate(), r.addEventListener("animationComplete", () => {
      this.safeToRemove();
    }), r.setOptions({
      ...r.options,
      onExitComplete: () => this.safeToRemove()
    })), ue.hasEverUpdated = !0;
  }
  getSnapshotBeforeUpdate(e) {
    const { layoutDependency: n, visualElement: i, drag: s, isPresent: r } = this.props, { projection: o } = i;
    return o && (o.isPresent = r, We = !0, s || e.layoutDependency !== n || n === void 0 || e.isPresent !== r ? o.willUpdate() : this.safeToRemove(), e.isPresent !== r && (r ? o.promote() : o.relegate() || M.postRender(() => {
      const a = o.getStack();
      (!a || !a.members.length) && this.safeToRemove();
    }))), null;
  }
  componentDidUpdate() {
    const { projection: e } = this.props.visualElement;
    e && (e.root.didUpdate(), _n.postRender(() => {
      !e.currentAnimation && e.isLead() && this.safeToRemove();
    }));
  }
  componentWillUnmount() {
    const { visualElement: e, layoutGroup: n, switchLayoutGroup: i } = this.props, { projection: s } = e;
    We = !0, s && (s.scheduleCheckAfterUnmount(), n && n.group && n.group.remove(s), i && i.deregister && i.deregister(s));
  }
  safeToRemove() {
    const { safeToRemove: e } = this.props;
    e && e();
  }
  render() {
    return null;
  }
}
function $o(t) {
  const [e, n] = ho(), i = W(xn);
  return u.jsx(ou, { ...t, layoutGroup: i, switchLayoutGroup: W(wo), isPresent: e, safeToRemove: n });
}
const ru = {
  borderRadius: {
    ...Ot,
    applyTo: [
      "borderTopLeftRadius",
      "borderTopRightRadius",
      "borderBottomLeftRadius",
      "borderBottomRightRadius"
    ]
  },
  borderTopLeftRadius: Ot,
  borderTopRightRadius: Ot,
  borderBottomLeftRadius: Ot,
  borderBottomRightRadius: Ot,
  boxShadow: su
};
function au(t, e, n) {
  const i = z(t) ? t : Dt(t);
  return i.start(Qn("", i, e, n)), i.animation;
}
const lu = (t, e) => t.depth - e.depth;
class cu {
  constructor() {
    this.children = [], this.isDirty = !1;
  }
  add(e) {
    Sn(this.children, e), this.isDirty = !0;
  }
  remove(e) {
    Tn(this.children, e), this.isDirty = !0;
  }
  forEach(e) {
    this.isDirty && this.children.sort(lu), this.isDirty = !1, this.children.forEach(e);
  }
}
function uu(t, e) {
  const n = H.now(), i = ({ timestamp: s }) => {
    const r = s - n;
    r >= e && (lt(i), t(r - e));
  };
  return M.setup(i, !0), () => lt(i);
}
const Uo = ["TopLeft", "TopRight", "BottomLeft", "BottomRight"], du = Uo.length, Hi = (t) => typeof t == "string" ? parseFloat(t) : t, Gi = (t) => typeof t == "number" || w.test(t);
function hu(t, e, n, i, s, r) {
  s ? (t.opacity = E(0, n.opacity ?? 1, fu(i)), t.opacityExit = E(e.opacity ?? 1, 0, pu(i))) : r && (t.opacity = E(e.opacity ?? 1, n.opacity ?? 1, i));
  for (let o = 0; o < du; o++) {
    const a = `border${Uo[o]}Radius`;
    let l = Yi(e, a), d = Yi(n, a);
    if (l === void 0 && d === void 0)
      continue;
    l || (l = 0), d || (d = 0), l === 0 || d === 0 || Gi(l) === Gi(d) ? (t[a] = Math.max(E(Hi(l), Hi(d), i), 0), (et.test(d) || et.test(l)) && (t[a] += "%")) : t[a] = d;
  }
  (e.rotate || n.rotate) && (t.rotate = E(e.rotate || 0, n.rotate || 0, i));
}
function Yi(t, e) {
  return t[e] !== void 0 ? t[e] : t.borderRadius;
}
const fu = /* @__PURE__ */ Ho(0, 0.5, Ms), pu = /* @__PURE__ */ Ho(0.5, 0.95, Q);
function Ho(t, e, n) {
  return (i) => i < t ? 0 : i > e ? 1 : n(/* @__PURE__ */ $t(t, e, i));
}
function Xi(t, e) {
  t.min = e.min, t.max = e.max;
}
function Y(t, e) {
  Xi(t.x, e.x), Xi(t.y, e.y);
}
function qi(t, e) {
  t.translate = e.translate, t.scale = e.scale, t.originPoint = e.originPoint, t.origin = e.origin;
}
function Qi(t, e, n, i, s) {
  return t -= e, t = ye(t, 1 / n, i), s !== void 0 && (t = ye(t, 1 / s, i)), t;
}
function mu(t, e = 0, n = 1, i = 0.5, s, r = t, o = t) {
  if (et.test(e) && (e = parseFloat(e), e = E(o.min, o.max, e / 100) - o.min), typeof e != "number")
    return;
  let a = E(r.min, r.max, i);
  t === r && (a -= e), t.min = Qi(t.min, e, n, a, s), t.max = Qi(t.max, e, n, a, s);
}
function Ji(t, e, [n, i, s], r, o) {
  mu(t, e[n], e[i], e[s], e.scale, r, o);
}
const yu = ["x", "scaleX", "originX"], gu = ["y", "scaleY", "originY"];
function Zi(t, e, n, i) {
  Ji(t.x, e, yu, n ? n.x : void 0, i ? i.x : void 0), Ji(t.y, e, gu, n ? n.y : void 0, i ? i.y : void 0);
}
function ts(t) {
  return t.translate === 0 && t.scale === 1;
}
function Go(t) {
  return ts(t.x) && ts(t.y);
}
function es(t, e) {
  return t.min === e.min && t.max === e.max;
}
function xu(t, e) {
  return es(t.x, e.x) && es(t.y, e.y);
}
function ns(t, e) {
  return Math.round(t.min) === Math.round(e.min) && Math.round(t.max) === Math.round(e.max);
}
function Yo(t, e) {
  return ns(t.x, e.x) && ns(t.y, e.y);
}
function is(t) {
  return $(t.x) / $(t.y);
}
function ss(t, e) {
  return t.translate === e.translate && t.scale === e.scale && t.originPoint === e.originPoint;
}
class vu {
  constructor() {
    this.members = [];
  }
  add(e) {
    Sn(this.members, e), e.scheduleRender();
  }
  remove(e) {
    if (Tn(this.members, e), e === this.prevLead && (this.prevLead = void 0), e === this.lead) {
      const n = this.members[this.members.length - 1];
      n && this.promote(n);
    }
  }
  relegate(e) {
    const n = this.members.findIndex((s) => e === s);
    if (n === 0)
      return !1;
    let i;
    for (let s = n; s >= 0; s--) {
      const r = this.members[s];
      if (r.isPresent !== !1) {
        i = r;
        break;
      }
    }
    return i ? (this.promote(i), !0) : !1;
  }
  promote(e, n) {
    const i = this.lead;
    if (e !== i && (this.prevLead = i, this.lead = e, e.show(), i)) {
      i.instance && i.scheduleRender(), e.scheduleRender(), e.resumeFrom = i, n && (e.resumeFrom.preserveOpacity = !0), i.snapshot && (e.snapshot = i.snapshot, e.snapshot.latestValues = i.animationValues || i.latestValues), e.root && e.root.isUpdating && (e.isLayoutDirty = !0);
      const { crossfade: s } = e.options;
      s === !1 && i.hide();
    }
  }
  exitAnimationComplete() {
    this.members.forEach((e) => {
      const { options: n, resumingFrom: i } = e;
      n.onExitComplete && n.onExitComplete(), i && i.options.onExitComplete && i.options.onExitComplete();
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
function bu(t, e, n) {
  let i = "";
  const s = t.x.translate / e.x, r = t.y.translate / e.y, o = n?.z || 0;
  if ((s || r || o) && (i = `translate3d(${s}px, ${r}px, ${o}px) `), (e.x !== 1 || e.y !== 1) && (i += `scale(${1 / e.x}, ${1 / e.y}) `), n) {
    const { transformPerspective: d, rotate: c, rotateX: h, rotateY: f, skewX: p, skewY: m } = n;
    d && (i = `perspective(${d}px) ${i}`), c && (i += `rotate(${c}deg) `), h && (i += `rotateX(${h}deg) `), f && (i += `rotateY(${f}deg) `), p && (i += `skewX(${p}deg) `), m && (i += `skewY(${m}deg) `);
  }
  const a = t.x.scale * e.x, l = t.y.scale * e.y;
  return (a !== 1 || l !== 1) && (i += `scale(${a}, ${l})`), i || "none";
}
const ze = ["", "X", "Y", "Z"], Su = 1e3;
let Tu = 0;
function $e(t, e, n, i) {
  const { latestValues: s } = e;
  s[t] && (n[t] = s[t], e.setStaticValue(t, 0), i && (i[t] = 0));
}
function Xo(t) {
  if (t.hasCheckedOptimisedAppear = !0, t.root === t)
    return;
  const { visualElement: e } = t.options;
  if (!e)
    return;
  const n = ko(e);
  if (window.MotionHasOptimisedAnimation(n, "transform")) {
    const { layout: s, layoutId: r } = t.options;
    window.MotionCancelOptimisedAnimation(n, "transform", M, !(s || r));
  }
  const { parent: i } = t;
  i && !i.hasCheckedOptimisedAppear && Xo(i);
}
function qo({ attachResizeListener: t, defaultParent: e, measureScroll: n, checkIsScrollRoot: i, resetTransform: s }) {
  return class {
    constructor(o = {}, a = e?.()) {
      this.id = Tu++, this.animationId = 0, this.animationCommitId = 0, this.children = /* @__PURE__ */ new Set(), this.options = {}, this.isTreeAnimating = !1, this.isAnimationBlocked = !1, this.isLayoutDirty = !1, this.isProjectionDirty = !1, this.isSharedProjectionDirty = !1, this.isTransformDirty = !1, this.updateManuallyBlocked = !1, this.updateBlockedByResize = !1, this.isUpdating = !1, this.isSVG = !1, this.needsReset = !1, this.shouldResetTransform = !1, this.hasCheckedOptimisedAppear = !1, this.treeScale = { x: 1, y: 1 }, this.eventHandlers = /* @__PURE__ */ new Map(), this.hasTreeAnimated = !1, this.updateScheduled = !1, this.scheduleUpdate = () => this.update(), this.projectionUpdateScheduled = !1, this.checkUpdateFailed = () => {
        this.isUpdating && (this.isUpdating = !1, this.clearAllSnapshots());
      }, this.updateProjection = () => {
        this.projectionUpdateScheduled = !1, this.nodes.forEach(Pu), this.nodes.forEach(Vu), this.nodes.forEach(Ru), this.nodes.forEach(ju);
      }, this.resolvedRelativeTargetAt = 0, this.hasProjected = !1, this.isVisible = !0, this.animationProgress = 0, this.sharedNodes = /* @__PURE__ */ new Map(), this.latestValues = o, this.root = a ? a.root || a : this, this.path = a ? [...a.path, a] : [], this.parent = a, this.depth = a ? a.depth + 1 : 0;
      for (let l = 0; l < this.path.length; l++)
        this.path[l].shouldResetTransform = !0;
      this.root === this && (this.nodes = new cu());
    }
    addEventListener(o, a) {
      return this.eventHandlers.has(o) || this.eventHandlers.set(o, new Pn()), this.eventHandlers.get(o).add(a);
    }
    notifyListeners(o, ...a) {
      const l = this.eventHandlers.get(o);
      l && l.notify(...a);
    }
    hasListeners(o) {
      return this.eventHandlers.has(o);
    }
    /**
     * Lifecycles
     */
    mount(o) {
      if (this.instance)
        return;
      this.isSVG = uo(o) && !hl(o), this.instance = o;
      const { layoutId: a, layout: l, visualElement: d } = this.options;
      if (d && !d.current && d.mount(o), this.root.nodes.add(this), this.parent && this.parent.children.add(this), this.root.hasTreeAnimated && (l || a) && (this.isLayoutDirty = !0), t) {
        let c, h = 0;
        const f = () => this.root.updateBlockedByResize = !1;
        M.read(() => {
          h = window.innerWidth;
        }), t(o, () => {
          const p = window.innerWidth;
          p !== h && (h = p, this.root.updateBlockedByResize = !0, c && c(), c = uu(f, 250), ue.hasAnimatedSinceResize && (ue.hasAnimatedSinceResize = !1, this.nodes.forEach(as)));
        });
      }
      a && this.root.registerSharedNode(a, this), this.options.animate !== !1 && d && (a || l) && this.addEventListener("didUpdate", ({ delta: c, hasLayoutChanged: h, hasRelativeLayoutChanged: f, layout: p }) => {
        if (this.isTreeAnimationBlocked()) {
          this.target = void 0, this.relativeTarget = void 0;
          return;
        }
        const m = this.options.transition || d.getDefaultTransition() || Iu, { onLayoutAnimationStart: g, onLayoutAnimationComplete: v } = d.getProps(), y = !this.targetLayout || !Yo(this.targetLayout, p), b = !h && f;
        if (this.options.layoutRoot || this.resumeFrom || b || h && (y || !this.currentAnimation)) {
          this.resumeFrom && (this.resumingFrom = this.resumeFrom, this.resumingFrom.resumingFrom = void 0);
          const x = {
            ...Fn(m, "layout"),
            onPlay: g,
            onComplete: v
          };
          (d.shouldReduceMotion || this.options.layoutRoot) && (x.delay = 0, x.type = !1), this.startAnimation(x), this.setAnimationOrigin(c, b);
        } else
          h || as(this), this.isLead() && this.options.onExitComplete && this.options.onExitComplete();
        this.targetLayout = p;
      });
    }
    unmount() {
      this.options.layoutId && this.willUpdate(), this.root.nodes.remove(this);
      const o = this.getStack();
      o && o.remove(this), this.parent && this.parent.children.delete(this), this.instance = void 0, this.eventHandlers.clear(), lt(this.updateProjection);
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
      this.isUpdateBlocked() || (this.isUpdating = !0, this.nodes && this.nodes.forEach(Mu), this.animationId++);
    }
    getTransformTemplate() {
      const { visualElement: o } = this.options;
      return o && o.getProps().transformTemplate;
    }
    willUpdate(o = !0) {
      if (this.root.hasTreeAnimated = !0, this.root.isUpdateBlocked()) {
        this.options.onExitComplete && this.options.onExitComplete();
        return;
      }
      if (window.MotionCancelOptimisedAnimation && !this.hasCheckedOptimisedAppear && Xo(this), !this.root.isUpdating && this.root.startUpdate(), this.isLayoutDirty)
        return;
      this.isLayoutDirty = !0;
      for (let c = 0; c < this.path.length; c++) {
        const h = this.path[c];
        h.shouldResetTransform = !0, h.updateScroll("snapshot"), h.options.layoutRoot && h.willUpdate(!1);
      }
      const { layoutId: a, layout: l } = this.options;
      if (a === void 0 && !l)
        return;
      const d = this.getTransformTemplate();
      this.prevTransformTemplateValue = d ? d(this.latestValues, "") : void 0, this.updateSnapshot(), o && this.notifyListeners("willUpdate");
    }
    update() {
      if (this.updateScheduled = !1, this.isUpdateBlocked()) {
        this.unblockUpdate(), this.clearAllSnapshots(), this.nodes.forEach(os);
        return;
      }
      if (this.animationId <= this.animationCommitId) {
        this.nodes.forEach(rs);
        return;
      }
      this.animationCommitId = this.animationId, this.isUpdating ? (this.isUpdating = !1, this.nodes.forEach(Du), this.nodes.forEach(Au), this.nodes.forEach(wu)) : this.nodes.forEach(rs), this.clearAllSnapshots();
      const a = H.now();
      _.delta = it(0, 1e3 / 60, a - _.timestamp), _.timestamp = a, _.isProcessing = !0, Ee.update.process(_), Ee.preRender.process(_), Ee.render.process(_), _.isProcessing = !1;
    }
    didUpdate() {
      this.updateScheduled || (this.updateScheduled = !0, _n.read(this.scheduleUpdate));
    }
    clearAllSnapshots() {
      this.nodes.forEach(Cu), this.sharedNodes.forEach(Eu);
    }
    scheduleUpdateProjection() {
      this.projectionUpdateScheduled || (this.projectionUpdateScheduled = !0, M.preRender(this.updateProjection, !1, !0));
    }
    scheduleCheckAfterUnmount() {
      M.postRender(() => {
        this.isLayoutDirty ? this.root.didUpdate() : this.root.checkUpdateFailed();
      });
    }
    /**
     * Update measurements
     */
    updateSnapshot() {
      this.snapshot || !this.instance || (this.snapshot = this.measure(), this.snapshot && !$(this.snapshot.measuredBox.x) && !$(this.snapshot.measuredBox.y) && (this.snapshot = void 0));
    }
    updateLayout() {
      if (!this.instance || (this.updateScroll(), !(this.options.alwaysMeasureLayout && this.isLead()) && !this.isLayoutDirty))
        return;
      if (this.resumeFrom && !this.resumeFrom.instance)
        for (let l = 0; l < this.path.length; l++)
          this.path[l].updateScroll();
      const o = this.layout;
      this.layout = this.measure(!1), this.layoutCorrected = I(), this.isLayoutDirty = !1, this.projectionDelta = void 0, this.notifyListeners("measure", this.layout.layoutBox);
      const { visualElement: a } = this.options;
      a && a.notify("LayoutMeasure", this.layout.layoutBox, o ? o.layoutBox : void 0);
    }
    updateScroll(o = "measure") {
      let a = !!(this.options.layoutScroll && this.instance);
      if (this.scroll && this.scroll.animationId === this.root.animationId && this.scroll.phase === o && (a = !1), a && this.instance) {
        const l = i(this.instance);
        this.scroll = {
          animationId: this.root.animationId,
          phase: o,
          isRoot: l,
          offset: n(this.instance),
          wasRoot: this.scroll ? this.scroll.isRoot : l
        };
      }
    }
    resetTransform() {
      if (!s)
        return;
      const o = this.isLayoutDirty || this.shouldResetTransform || this.options.alwaysMeasureLayout, a = this.projectionDelta && !Go(this.projectionDelta), l = this.getTransformTemplate(), d = l ? l(this.latestValues, "") : void 0, c = d !== this.prevTransformTemplateValue;
      o && this.instance && (a || ht(this.latestValues) || c) && (s(this.instance, d), this.shouldResetTransform = !1, this.scheduleRender());
    }
    measure(o = !0) {
      const a = this.measurePageBox();
      let l = this.removeElementScroll(a);
      return o && (l = this.removeTransform(l)), Lu(l), {
        animationId: this.root.animationId,
        measuredBox: a,
        layoutBox: l,
        latestValues: {},
        source: this.id
      };
    }
    measurePageBox() {
      const { visualElement: o } = this.options;
      if (!o)
        return I();
      const a = o.measureViewportBox();
      if (!(this.scroll?.wasRoot || this.path.some(Ou))) {
        const { scroll: d } = this.root;
        d && (At(a.x, d.offset.x), At(a.y, d.offset.y));
      }
      return a;
    }
    removeElementScroll(o) {
      const a = I();
      if (Y(a, o), this.scroll?.wasRoot)
        return a;
      for (let l = 0; l < this.path.length; l++) {
        const d = this.path[l], { scroll: c, options: h } = d;
        d !== this.root && c && h.layoutScroll && (c.wasRoot && Y(a, o), At(a.x, c.offset.x), At(a.y, c.offset.y));
      }
      return a;
    }
    applyTransform(o, a = !1) {
      const l = I();
      Y(l, o);
      for (let d = 0; d < this.path.length; d++) {
        const c = this.path[d];
        !a && c.options.layoutScroll && c.scroll && c !== c.root && wt(l, {
          x: -c.scroll.offset.x,
          y: -c.scroll.offset.y
        }), ht(c.latestValues) && wt(l, c.latestValues);
      }
      return ht(this.latestValues) && wt(l, this.latestValues), l;
    }
    removeTransform(o) {
      const a = I();
      Y(a, o);
      for (let l = 0; l < this.path.length; l++) {
        const d = this.path[l];
        if (!d.instance || !ht(d.latestValues))
          continue;
        cn(d.latestValues) && d.updateSnapshot();
        const c = I(), h = d.measurePageBox();
        Y(c, h), Zi(a, d.latestValues, d.snapshot ? d.snapshot.layoutBox : void 0, c);
      }
      return ht(this.latestValues) && Zi(a, this.latestValues), a;
    }
    setTargetDelta(o) {
      this.targetDelta = o, this.root.scheduleUpdateProjection(), this.isProjectionDirty = !0;
    }
    setOptions(o) {
      this.options = {
        ...this.options,
        ...o,
        crossfade: o.crossfade !== void 0 ? o.crossfade : !0
      };
    }
    clearMeasurements() {
      this.scroll = void 0, this.layout = void 0, this.snapshot = void 0, this.prevTransformTemplateValue = void 0, this.targetDelta = void 0, this.target = void 0, this.isLayoutDirty = !1;
    }
    forceRelativeParentToResolveTarget() {
      this.relativeParent && this.relativeParent.resolvedRelativeTargetAt !== _.timestamp && this.relativeParent.resolveTargetDelta(!0);
    }
    resolveTargetDelta(o = !1) {
      const a = this.getLead();
      this.isProjectionDirty || (this.isProjectionDirty = a.isProjectionDirty), this.isTransformDirty || (this.isTransformDirty = a.isTransformDirty), this.isSharedProjectionDirty || (this.isSharedProjectionDirty = a.isSharedProjectionDirty);
      const l = !!this.resumingFrom || this !== a;
      if (!(o || l && this.isSharedProjectionDirty || this.isProjectionDirty || this.parent?.isProjectionDirty || this.attemptToResolveRelativeTarget || this.root.updateBlockedByResize))
        return;
      const { layout: c, layoutId: h } = this.options;
      if (!(!this.layout || !(c || h))) {
        if (this.resolvedRelativeTargetAt = _.timestamp, !this.targetDelta && !this.relativeTarget) {
          const f = this.getClosestProjectingParent();
          f && f.layout && this.animationProgress !== 1 ? (this.relativeParent = f, this.forceRelativeParentToResolveTarget(), this.relativeTarget = I(), this.relativeTargetOrigin = I(), zt(this.relativeTargetOrigin, this.layout.layoutBox, f.layout.layoutBox), Y(this.relativeTarget, this.relativeTargetOrigin)) : this.relativeParent = this.relativeTarget = void 0;
        }
        if (!(!this.relativeTarget && !this.targetDelta) && (this.target || (this.target = I(), this.targetWithTransforms = I()), this.relativeTarget && this.relativeTargetOrigin && this.relativeParent && this.relativeParent.target ? (this.forceRelativeParentToResolveTarget(), zc(this.target, this.relativeTarget, this.relativeParent.target)) : this.targetDelta ? (this.resumingFrom ? this.target = this.applyTransform(this.layout.layoutBox) : Y(this.target, this.layout.layoutBox), Do(this.target, this.targetDelta)) : Y(this.target, this.layout.layoutBox), this.attemptToResolveRelativeTarget)) {
          this.attemptToResolveRelativeTarget = !1;
          const f = this.getClosestProjectingParent();
          f && !!f.resumingFrom == !!this.resumingFrom && !f.options.layoutScroll && f.target && this.animationProgress !== 1 ? (this.relativeParent = f, this.forceRelativeParentToResolveTarget(), this.relativeTarget = I(), this.relativeTargetOrigin = I(), zt(this.relativeTargetOrigin, this.target, f.target), Y(this.relativeTarget, this.relativeTargetOrigin)) : this.relativeParent = this.relativeTarget = void 0;
        }
      }
    }
    getClosestProjectingParent() {
      if (!(!this.parent || cn(this.parent.latestValues) || Co(this.parent.latestValues)))
        return this.parent.isProjecting() ? this.parent : this.parent.getClosestProjectingParent();
    }
    isProjecting() {
      return !!((this.relativeTarget || this.targetDelta || this.options.layoutRoot) && this.layout);
    }
    calcProjection() {
      const o = this.getLead(), a = !!this.resumingFrom || this !== o;
      let l = !0;
      if ((this.isProjectionDirty || this.parent?.isProjectionDirty) && (l = !1), a && (this.isSharedProjectionDirty || this.isTransformDirty) && (l = !1), this.resolvedRelativeTargetAt === _.timestamp && (l = !1), l)
        return;
      const { layout: d, layoutId: c } = this.options;
      if (this.isTreeAnimating = !!(this.parent && this.parent.isTreeAnimating || this.currentAnimation || this.pendingAnimation), this.isTreeAnimating || (this.targetDelta = this.relativeTarget = void 0), !this.layout || !(d || c))
        return;
      Y(this.layoutCorrected, this.layout.layoutBox);
      const h = this.treeScale.x, f = this.treeScale.y;
      ec(this.layoutCorrected, this.treeScale, this.path, a), o.layout && !o.target && (this.treeScale.x !== 1 || this.treeScale.y !== 1) && (o.target = o.layout.layoutBox, o.targetWithTransforms = I());
      const { target: p } = o;
      if (!p) {
        this.prevProjectionDelta && (this.createProjectionDeltas(), this.scheduleRender());
        return;
      }
      !this.projectionDelta || !this.prevProjectionDelta ? this.createProjectionDeltas() : (qi(this.prevProjectionDelta.x, this.projectionDelta.x), qi(this.prevProjectionDelta.y, this.projectionDelta.y)), Wt(this.projectionDelta, this.layoutCorrected, p, this.latestValues), (this.treeScale.x !== h || this.treeScale.y !== f || !ss(this.projectionDelta.x, this.prevProjectionDelta.x) || !ss(this.projectionDelta.y, this.prevProjectionDelta.y)) && (this.hasProjected = !0, this.scheduleRender(), this.notifyListeners("projectionUpdate", p));
    }
    hide() {
      this.isVisible = !1;
    }
    show() {
      this.isVisible = !0;
    }
    scheduleRender(o = !0) {
      if (this.options.visualElement?.scheduleRender(), o) {
        const a = this.getStack();
        a && a.scheduleRender();
      }
      this.resumingFrom && !this.resumingFrom.instance && (this.resumingFrom = void 0);
    }
    createProjectionDeltas() {
      this.prevProjectionDelta = Pt(), this.projectionDelta = Pt(), this.projectionDeltaWithTransform = Pt();
    }
    setAnimationOrigin(o, a = !1) {
      const l = this.snapshot, d = l ? l.latestValues : {}, c = { ...this.latestValues }, h = Pt();
      (!this.relativeParent || !this.relativeParent.options.layoutRoot) && (this.relativeTarget = this.relativeTargetOrigin = void 0), this.attemptToResolveRelativeTarget = !a;
      const f = I(), p = l ? l.source : void 0, m = this.layout ? this.layout.source : void 0, g = p !== m, v = this.getStack(), y = !v || v.members.length <= 1, b = !!(g && !y && this.options.crossfade === !0 && !this.path.some(ku));
      this.animationProgress = 0;
      let x;
      this.mixTargetDelta = (D) => {
        const A = D / 1e3;
        ls(h.x, o.x, A), ls(h.y, o.y, A), this.setTargetDelta(h), this.relativeTarget && this.relativeTargetOrigin && this.layout && this.relativeParent && this.relativeParent.layout && (zt(f, this.layout.layoutBox, this.relativeParent.layout.layoutBox), Bu(this.relativeTarget, this.relativeTargetOrigin, f, A), x && xu(this.relativeTarget, x) && (this.isProjectionDirty = !1), x || (x = I()), Y(x, this.relativeTarget)), g && (this.animationValues = c, hu(c, d, this.latestValues, A, b, y)), this.root.scheduleUpdateProjection(), this.scheduleRender(), this.animationProgress = A;
      }, this.mixTargetDelta(this.options.layoutRoot ? 1e3 : 0);
    }
    startAnimation(o) {
      this.notifyListeners("animationStart"), this.currentAnimation?.stop(), this.resumingFrom?.currentAnimation?.stop(), this.pendingAnimation && (lt(this.pendingAnimation), this.pendingAnimation = void 0), this.pendingAnimation = M.update(() => {
        ue.hasAnimatedSinceResize = !0, this.motionValue || (this.motionValue = Dt(0)), this.currentAnimation = au(this.motionValue, [0, 1e3], {
          ...o,
          velocity: 0,
          isSync: !0,
          onUpdate: (a) => {
            this.mixTargetDelta(a), o.onUpdate && o.onUpdate(a);
          },
          onStop: () => {
          },
          onComplete: () => {
            o.onComplete && o.onComplete(), this.completeAnimation();
          }
        }), this.resumingFrom && (this.resumingFrom.currentAnimation = this.currentAnimation), this.pendingAnimation = void 0;
      });
    }
    completeAnimation() {
      this.resumingFrom && (this.resumingFrom.currentAnimation = void 0, this.resumingFrom.preserveOpacity = void 0);
      const o = this.getStack();
      o && o.exitAnimationComplete(), this.resumingFrom = this.currentAnimation = this.animationValues = void 0, this.notifyListeners("animationComplete");
    }
    finishAnimation() {
      this.currentAnimation && (this.mixTargetDelta && this.mixTargetDelta(Su), this.currentAnimation.stop()), this.completeAnimation();
    }
    applyTransformsToTarget() {
      const o = this.getLead();
      let { targetWithTransforms: a, target: l, layout: d, latestValues: c } = o;
      if (!(!a || !l || !d)) {
        if (this !== o && this.layout && d && Qo(this.options.animationType, this.layout.layoutBox, d.layoutBox)) {
          l = this.target || I();
          const h = $(this.layout.layoutBox.x);
          l.x.min = o.target.x.min, l.x.max = l.x.min + h;
          const f = $(this.layout.layoutBox.y);
          l.y.min = o.target.y.min, l.y.max = l.y.min + f;
        }
        Y(a, l), wt(a, c), Wt(this.projectionDeltaWithTransform, this.layoutCorrected, a, c);
      }
    }
    registerSharedNode(o, a) {
      this.sharedNodes.has(o) || this.sharedNodes.set(o, new vu()), this.sharedNodes.get(o).add(a);
      const d = a.options.initialPromotionConfig;
      a.promote({
        transition: d ? d.transition : void 0,
        preserveFollowOpacity: d && d.shouldPreserveFollowOpacity ? d.shouldPreserveFollowOpacity(a) : void 0
      });
    }
    isLead() {
      const o = this.getStack();
      return o ? o.lead === this : !0;
    }
    getLead() {
      const { layoutId: o } = this.options;
      return o ? this.getStack()?.lead || this : this;
    }
    getPrevLead() {
      const { layoutId: o } = this.options;
      return o ? this.getStack()?.prevLead : void 0;
    }
    getStack() {
      const { layoutId: o } = this.options;
      if (o)
        return this.root.sharedNodes.get(o);
    }
    promote({ needsReset: o, transition: a, preserveFollowOpacity: l } = {}) {
      const d = this.getStack();
      d && d.promote(this, l), o && (this.projectionDelta = void 0, this.needsReset = !0), a && this.setOptions({ transition: a });
    }
    relegate() {
      const o = this.getStack();
      return o ? o.relegate(this) : !1;
    }
    resetSkewAndRotation() {
      const { visualElement: o } = this.options;
      if (!o)
        return;
      let a = !1;
      const { latestValues: l } = o;
      if ((l.z || l.rotate || l.rotateX || l.rotateY || l.rotateZ || l.skewX || l.skewY) && (a = !0), !a)
        return;
      const d = {};
      l.z && $e("z", o, d, this.animationValues);
      for (let c = 0; c < ze.length; c++)
        $e(`rotate${ze[c]}`, o, d, this.animationValues), $e(`skew${ze[c]}`, o, d, this.animationValues);
      o.render();
      for (const c in d)
        o.setStaticValue(c, d[c]), this.animationValues && (this.animationValues[c] = d[c]);
      o.scheduleRender();
    }
    applyProjectionStyles(o, a) {
      if (!this.instance || this.isSVG)
        return;
      if (!this.isVisible) {
        o.visibility = "hidden";
        return;
      }
      const l = this.getTransformTemplate();
      if (this.needsReset) {
        this.needsReset = !1, o.visibility = "", o.opacity = "", o.pointerEvents = ce(a?.pointerEvents) || "", o.transform = l ? l(this.latestValues, "") : "none";
        return;
      }
      const d = this.getLead();
      if (!this.projectionDelta || !this.layout || !d.target) {
        this.options.layoutId && (o.opacity = this.latestValues.opacity !== void 0 ? this.latestValues.opacity : 1, o.pointerEvents = ce(a?.pointerEvents) || ""), this.hasProjected && !ht(this.latestValues) && (o.transform = l ? l({}, "") : "none", this.hasProjected = !1);
        return;
      }
      o.visibility = "";
      const c = d.animationValues || d.latestValues;
      this.applyTransformsToTarget();
      let h = bu(this.projectionDeltaWithTransform, this.treeScale, c);
      l && (h = l(c, h)), o.transform = h;
      const { x: f, y: p } = this.projectionDelta;
      o.transformOrigin = `${f.origin * 100}% ${p.origin * 100}% 0`, d.animationValues ? o.opacity = d === this ? c.opacity ?? this.latestValues.opacity ?? 1 : this.preserveOpacity ? this.latestValues.opacity : c.opacityExit : o.opacity = d === this ? c.opacity !== void 0 ? c.opacity : "" : c.opacityExit !== void 0 ? c.opacityExit : 0;
      for (const m in Yt) {
        if (c[m] === void 0)
          continue;
        const { correct: g, applyTo: v, isCSSVariable: y } = Yt[m], b = h === "none" ? c[m] : g(c[m], d);
        if (v) {
          const x = v.length;
          for (let D = 0; D < x; D++)
            o[v[D]] = b;
        } else
          y ? this.options.visualElement.renderState.vars[m] = b : o[m] = b;
      }
      this.options.layoutId && (o.pointerEvents = d === this ? ce(a?.pointerEvents) || "" : "none");
    }
    clearSnapshot() {
      this.resumeFrom = this.snapshot = void 0;
    }
    // Only run on root
    resetTree() {
      this.root.nodes.forEach((o) => o.currentAnimation?.stop()), this.root.nodes.forEach(os), this.root.sharedNodes.clear();
    }
  };
}
function Au(t) {
  t.updateLayout();
}
function wu(t) {
  const e = t.resumeFrom?.snapshot || t.snapshot;
  if (t.isLead() && t.layout && e && t.hasListeners("didUpdate")) {
    const { layoutBox: n, measuredBox: i } = t.layout, { animationType: s } = t.options, r = e.source !== t.layout.source;
    s === "size" ? X((c) => {
      const h = r ? e.measuredBox[c] : e.layoutBox[c], f = $(h);
      h.min = n[c].min, h.max = h.min + f;
    }) : Qo(s, e.layoutBox, n) && X((c) => {
      const h = r ? e.measuredBox[c] : e.layoutBox[c], f = $(n[c]);
      h.max = h.min + f, t.relativeTarget && !t.currentAnimation && (t.isProjectionDirty = !0, t.relativeTarget[c].max = t.relativeTarget[c].min + f);
    });
    const o = Pt();
    Wt(o, n, e.layoutBox);
    const a = Pt();
    r ? Wt(a, t.applyTransform(i, !0), e.measuredBox) : Wt(a, n, e.layoutBox);
    const l = !Go(o);
    let d = !1;
    if (!t.resumeFrom) {
      const c = t.getClosestProjectingParent();
      if (c && !c.resumeFrom) {
        const { snapshot: h, layout: f } = c;
        if (h && f) {
          const p = I();
          zt(p, e.layoutBox, h.layoutBox);
          const m = I();
          zt(m, n, f.layoutBox), Yo(p, m) || (d = !0), c.options.layoutRoot && (t.relativeTarget = m, t.relativeTargetOrigin = p, t.relativeParent = c);
        }
      }
    }
    t.notifyListeners("didUpdate", {
      layout: n,
      snapshot: e,
      delta: a,
      layoutDelta: o,
      hasLayoutChanged: l,
      hasRelativeLayoutChanged: d
    });
  } else if (t.isLead()) {
    const { onExitComplete: n } = t.options;
    n && n();
  }
  t.options.transition = void 0;
}
function Pu(t) {
  t.parent && (t.isProjecting() || (t.isProjectionDirty = t.parent.isProjectionDirty), t.isSharedProjectionDirty || (t.isSharedProjectionDirty = !!(t.isProjectionDirty || t.parent.isProjectionDirty || t.parent.isSharedProjectionDirty)), t.isTransformDirty || (t.isTransformDirty = t.parent.isTransformDirty));
}
function ju(t) {
  t.isProjectionDirty = t.isSharedProjectionDirty = t.isTransformDirty = !1;
}
function Cu(t) {
  t.clearSnapshot();
}
function os(t) {
  t.clearMeasurements();
}
function rs(t) {
  t.isLayoutDirty = !1;
}
function Du(t) {
  const { visualElement: e } = t.options;
  e && e.getProps().onBeforeLayoutMeasure && e.notify("BeforeLayoutMeasure"), t.resetTransform();
}
function as(t) {
  t.finishAnimation(), t.targetDelta = t.relativeTarget = t.target = void 0, t.isProjectionDirty = !0;
}
function Vu(t) {
  t.resolveTargetDelta();
}
function Ru(t) {
  t.calcProjection();
}
function Mu(t) {
  t.resetSkewAndRotation();
}
function Eu(t) {
  t.removeLeadSnapshot();
}
function ls(t, e, n) {
  t.translate = E(e.translate, 0, n), t.scale = E(e.scale, 1, n), t.origin = e.origin, t.originPoint = e.originPoint;
}
function cs(t, e, n, i) {
  t.min = E(e.min, n.min, i), t.max = E(e.max, n.max, i);
}
function Bu(t, e, n, i) {
  cs(t.x, e.x, n.x, i), cs(t.y, e.y, n.y, i);
}
function ku(t) {
  return t.animationValues && t.animationValues.opacityExit !== void 0;
}
const Iu = {
  duration: 0.45,
  ease: [0.4, 0, 0.1, 1]
}, us = (t) => typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().includes(t), ds = us("applewebkit/") && !us("chrome/") ? Math.round : Q;
function hs(t) {
  t.min = ds(t.min), t.max = ds(t.max);
}
function Lu(t) {
  hs(t.x), hs(t.y);
}
function Qo(t, e, n) {
  return t === "position" || t === "preserve-aspect" && !Wc(is(e), is(n), 0.2);
}
function Ou(t) {
  return t !== t.root && t.scroll?.wasRoot;
}
const Fu = qo({
  attachResizeListener: (t, e) => Xt(t, "resize", e),
  measureScroll: () => ({
    x: document.documentElement.scrollLeft || document.body.scrollLeft,
    y: document.documentElement.scrollTop || document.body.scrollTop
  }),
  checkIsScrollRoot: () => !0
}), Ue = {
  current: void 0
}, Jo = qo({
  measureScroll: (t) => ({
    x: t.scrollLeft,
    y: t.scrollTop
  }),
  defaultParent: () => {
    if (!Ue.current) {
      const t = new Fu({});
      t.mount(window), t.setOptions({ layoutScroll: !0 }), Ue.current = t;
    }
    return Ue.current;
  },
  resetTransform: (t, e) => {
    t.style.transform = e !== void 0 ? e : "none";
  },
  checkIsScrollRoot: (t) => window.getComputedStyle(t).position === "fixed"
}), Nu = {
  pan: {
    Feature: iu
  },
  drag: {
    Feature: nu,
    ProjectionNode: Jo,
    MeasureLayout: $o
  }
};
function fs(t, e, n) {
  const { props: i } = t;
  t.animationState && i.whileHover && t.animationState.setActive("whileHover", n === "Start");
  const s = "onHover" + n, r = i[s];
  r && M.postRender(() => r(e, Zt(e)));
}
class _u extends ut {
  mount() {
    const { current: e } = this.node;
    e && (this.unmount = al(e, (n, i) => (fs(this.node, i, "Start"), (s) => fs(this.node, s, "End"))));
  }
  unmount() {
  }
}
class Ku extends ut {
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
    this.unmount = qt(Xt(this.node.current, "focus", () => this.onFocus()), Xt(this.node.current, "blur", () => this.onBlur()));
  }
  unmount() {
  }
}
function ps(t, e, n) {
  const { props: i } = t;
  if (t.current instanceof HTMLButtonElement && t.current.disabled)
    return;
  t.animationState && i.whileTap && t.animationState.setActive("whileTap", n === "Start");
  const s = "onTap" + (n === "End" ? "" : n), r = i[s];
  r && M.postRender(() => r(e, Zt(e)));
}
class Wu extends ut {
  mount() {
    const { current: e } = this.node;
    e && (this.unmount = dl(e, (n, i) => (ps(this.node, i, "Start"), (s, { success: r }) => ps(this.node, s, r ? "End" : "Cancel")), { useGlobalTarget: this.node.props.globalTapTarget }));
  }
  unmount() {
  }
}
const yn = /* @__PURE__ */ new WeakMap(), He = /* @__PURE__ */ new WeakMap(), zu = (t) => {
  const e = yn.get(t.target);
  e && e(t);
}, $u = (t) => {
  t.forEach(zu);
};
function Uu({ root: t, ...e }) {
  const n = t || document;
  He.has(n) || He.set(n, {});
  const i = He.get(n), s = JSON.stringify(e);
  return i[s] || (i[s] = new IntersectionObserver($u, { root: t, ...e })), i[s];
}
function Hu(t, e, n) {
  const i = Uu(e);
  return yn.set(t, n), i.observe(t), () => {
    yn.delete(t), i.unobserve(t);
  };
}
const Gu = {
  some: 0,
  all: 1
};
class Yu extends ut {
  constructor() {
    super(...arguments), this.hasEnteredView = !1, this.isInView = !1;
  }
  startObserver() {
    this.unmount();
    const { viewport: e = {} } = this.node.getProps(), { root: n, margin: i, amount: s = "some", once: r } = e, o = {
      root: n ? n.current : void 0,
      rootMargin: i,
      threshold: typeof s == "number" ? s : Gu[s]
    }, a = (l) => {
      const { isIntersecting: d } = l;
      if (this.isInView === d || (this.isInView = d, r && !d && this.hasEnteredView))
        return;
      d && (this.hasEnteredView = !0), this.node.animationState && this.node.animationState.setActive("whileInView", d);
      const { onViewportEnter: c, onViewportLeave: h } = this.node.getProps(), f = d ? c : h;
      f && f(l);
    };
    return Hu(this.node.current, o, a);
  }
  mount() {
    this.startObserver();
  }
  update() {
    if (typeof IntersectionObserver > "u")
      return;
    const { props: e, prevProps: n } = this.node;
    ["amount", "margin", "root"].some(Xu(e, n)) && this.startObserver();
  }
  unmount() {
  }
}
function Xu({ viewport: t = {} }, { viewport: e = {} } = {}) {
  return (n) => t[n] !== e[n];
}
const qu = {
  inView: {
    Feature: Yu
  },
  tap: {
    Feature: Wu
  },
  focus: {
    Feature: Ku
  },
  hover: {
    Feature: _u
  }
}, Qu = {
  layout: {
    ProjectionNode: Jo,
    MeasureLayout: $o
  }
}, Ju = {
  ...Lc,
  ...qu,
  ...Nu,
  ...Qu
}, S = /* @__PURE__ */ Jl(Ju, dc);
let bt = null, re = null;
function De() {
  !bt && typeof window < "u" && window.CARDS_BUNDLE && (bt = window.CARDS_BUNDLE);
  const [t, e] = de(bt);
  return Te(() => {
    if (bt) {
      e(bt);
      return;
    }
    re || (re = fetch("/assets/cards-bundle.json").then((n) => n.json()).then((n) => (bt = n, n)).catch((n) => (console.error("Failed to load cards bundle:", n), re = null, null))), re.then((n) => {
      n && e(n);
    });
  }, []), t;
}
const Zu = [
  { abbr: "SB", full: "Small Blind", desc: "0.5 BB 강제 베팅", note: "플랍 이후 첫 액션", color: "#3498db" },
  { abbr: "BB", full: "Big Blind", desc: "1 BB 강제 베팅", note: "최소 베팅/레이즈 단위", color: "#2ecc71" },
  { abbr: "UTG", full: "Under The Gun", desc: "프리플랍 첫 액션", note: "가장 불리", color: "#e74c3c" },
  { abbr: "HJ", full: "Hijack", desc: "중간 포지션", note: "", color: "#9b59b6" },
  { abbr: "CO", full: "Cutoff", desc: "BTN 직전", note: "두 번째로 유리", color: "#f39c12" },
  { abbr: "BTN", full: "Button", desc: "딜러 버튼", note: "가장 유리!", color: "#d4a574", highlight: !0 }
];
function td({ show: t }) {
  return /* @__PURE__ */ u.jsx(J, { children: t && /* @__PURE__ */ u.jsx(
    S.div,
    {
      style: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        pointerEvents: "none"
      },
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.3 },
      children: /* @__PURE__ */ u.jsxs(
        S.div,
        {
          style: {
            background: "rgba(0, 0, 0, 0.95)",
            borderRadius: 16,
            padding: "24px 32px",
            width: 480,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.6)",
            border: "1px solid rgba(255, 255, 255, 0.15)"
          },
          initial: { scale: 0.9, y: 20 },
          animate: { scale: 1, y: 0 },
          exit: { scale: 0.9, y: 20 },
          transition: { duration: 0.3, type: "spring", stiffness: 300, damping: 25 },
          children: [
            /* @__PURE__ */ u.jsx("div", { style: {
              fontSize: 20,
              fontWeight: "bold",
              color: "#fff",
              marginBottom: 8,
              textAlign: "center"
            }, children: "🎯 포지션 = 액션 순서" }),
            /* @__PURE__ */ u.jsx("div", { style: {
              fontSize: 13,
              color: "#888",
              marginBottom: 20,
              textAlign: "center"
            }, children: "늦게 행동할수록 유리! (상대 정보를 더 많이 볼 수 있음)" }),
            /* @__PURE__ */ u.jsxs("div", { style: {
              display: "grid",
              gridTemplateColumns: "60px 130px 1fr 100px",
              gap: 8,
              marginBottom: 8,
              padding: "0 4px"
            }, children: [
              /* @__PURE__ */ u.jsx("div", { style: { color: "#666", fontSize: 11, fontWeight: "bold" }, children: "순서" }),
              /* @__PURE__ */ u.jsx("div", { style: { color: "#666", fontSize: 11, fontWeight: "bold" }, children: "포지션" }),
              /* @__PURE__ */ u.jsx("div", { style: { color: "#666", fontSize: 11, fontWeight: "bold" }, children: "설명" }),
              /* @__PURE__ */ u.jsx("div", { style: { color: "#666", fontSize: 11, fontWeight: "bold", textAlign: "right" }, children: "특징" })
            ] }),
            /* @__PURE__ */ u.jsx("div", { style: {
              height: 1,
              background: "rgba(255, 255, 255, 0.15)",
              marginBottom: 12
            } }),
            /* @__PURE__ */ u.jsx("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: Zu.map((e, n) => /* @__PURE__ */ u.jsxs(
              S.div,
              {
                style: {
                  display: "grid",
                  gridTemplateColumns: "60px 130px 1fr 100px",
                  gap: 8,
                  alignItems: "center",
                  padding: "8px 4px",
                  borderRadius: 8,
                  background: e.highlight ? "rgba(241, 196, 15, 0.15)" : "transparent"
                },
                initial: { opacity: 0, x: -20 },
                animate: { opacity: 1, x: 0 },
                transition: { delay: 0.1 + n * 0.06 },
                children: [
                  /* @__PURE__ */ u.jsx("div", { style: {
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    fontWeight: "bold",
                    color: "#888"
                  }, children: n + 1 }),
                  /* @__PURE__ */ u.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
                    /* @__PURE__ */ u.jsx("div", { style: {
                      width: 40,
                      height: 22,
                      borderRadius: 11,
                      background: e.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 10,
                      fontWeight: "bold",
                      color: e.highlight ? "#000" : "#fff",
                      flexShrink: 0
                    }, children: e.abbr }),
                    /* @__PURE__ */ u.jsx("span", { style: {
                      color: "#aaa",
                      fontSize: 11,
                      whiteSpace: "nowrap"
                    }, children: e.full })
                  ] }),
                  /* @__PURE__ */ u.jsx("div", { style: {
                    color: "#fff",
                    fontSize: 13
                  }, children: e.desc }),
                  /* @__PURE__ */ u.jsx("div", { style: {
                    color: e.highlight ? "#f1c40f" : "#666",
                    fontSize: 12,
                    textAlign: "right",
                    fontWeight: e.highlight ? "bold" : "normal"
                  }, children: e.note })
                ]
              },
              e.abbr
            )) }),
            /* @__PURE__ */ u.jsx("div", { style: {
              height: 1,
              background: "rgba(255, 255, 255, 0.15)",
              margin: "16px 0"
            } }),
            /* @__PURE__ */ u.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: [
              /* @__PURE__ */ u.jsxs(
                S.div,
                {
                  style: {
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    color: "#ffd700",
                    fontSize: 13
                  },
                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                  transition: { delay: 0.5 },
                  children: [
                    /* @__PURE__ */ u.jsx("span", { children: "💡" }),
                    /* @__PURE__ */ u.jsx("span", { children: "BTN이 마지막에 액션 → 정보 우위 → 가장 유리!" })
                  ]
                }
              ),
              /* @__PURE__ */ u.jsxs(
                S.div,
                {
                  style: {
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    color: "#aaa",
                    fontSize: 12
                  },
                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                  transition: { delay: 0.6 },
                  children: [
                    /* @__PURE__ */ u.jsx("span", { children: "🔄" }),
                    /* @__PURE__ */ u.jsx("span", { children: "매 판마다 버튼이 시계방향으로 이동 (공평!)" })
                  ]
                }
              )
            ] })
          ]
        }
      )
    }
  ) });
}
const ed = [
  {
    action: "Check",
    emoji: "✋",
    desc: "패스 (베팅 없이 넘기기)",
    color: "#9b59b6"
  },
  {
    action: "Bet",
    emoji: "💰",
    desc: "베팅 시작하기",
    color: "#e67e22"
  },
  {
    action: "Fold",
    emoji: "🚫",
    desc: "카드 버리고 포기",
    color: "#e74c3c",
    note: "(체크 가능하면 폴드할 필요 없음)",
    dim: !0
  }
], nd = [
  {
    action: "Call",
    emoji: "📞",
    desc: "같은 금액 맞추기",
    color: "#3498db"
  },
  {
    action: "Raise",
    emoji: "⬆️",
    desc: "더 올리기",
    color: "#27ae60"
  },
  {
    action: "Fold",
    emoji: "🚫",
    desc: "카드 버리고 포기",
    color: "#e74c3c"
  }
];
function id({ show: t }) {
  return /* @__PURE__ */ u.jsx(J, { children: t && /* @__PURE__ */ u.jsx(
    S.div,
    {
      style: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        pointerEvents: "none"
      },
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.3 },
      children: /* @__PURE__ */ u.jsxs(
        S.div,
        {
          style: {
            background: "rgba(0, 0, 0, 0.95)",
            borderRadius: 16,
            padding: "24px 32px",
            width: 560,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.6)",
            border: "1px solid rgba(255, 255, 255, 0.15)"
          },
          initial: { scale: 0.9, y: 20 },
          animate: { scale: 1, y: 0 },
          exit: { scale: 0.9, y: 20 },
          transition: { duration: 0.3, type: "spring", stiffness: 300, damping: 25 },
          children: [
            /* @__PURE__ */ u.jsx("div", { style: {
              fontSize: 20,
              fontWeight: "bold",
              color: "#fff",
              marginBottom: 8,
              textAlign: "center"
            }, children: "🎲 베팅 액션" }),
            /* @__PURE__ */ u.jsx("div", { style: {
              fontSize: 13,
              color: "#888",
              marginBottom: 24,
              textAlign: "center"
            }, children: "내 차례에 할 수 있는 선택들" }),
            /* @__PURE__ */ u.jsxs("div", { style: {
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 24
            }, children: [
              /* @__PURE__ */ u.jsxs("div", { children: [
                /* @__PURE__ */ u.jsx("div", { style: {
                  fontSize: 14,
                  fontWeight: "bold",
                  color: "#9b59b6",
                  marginBottom: 12,
                  textAlign: "center",
                  padding: "8px 0",
                  background: "rgba(155, 89, 182, 0.15)",
                  borderRadius: 8
                }, children: "앞에 베팅이 없을 때" }),
                /* @__PURE__ */ u.jsx("div", { style: { display: "flex", flexDirection: "column", gap: 10 }, children: ed.map((e, n) => /* @__PURE__ */ u.jsxs(
                  S.div,
                  {
                    style: {
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "10px 12px",
                      borderRadius: 8,
                      background: "rgba(255,255,255,0.05)",
                      opacity: e.dim ? 0.5 : 1
                    },
                    initial: { opacity: 0, x: -20 },
                    animate: { opacity: e.dim ? 0.5 : 1, x: 0 },
                    transition: { delay: 0.1 + n * 0.08 },
                    children: [
                      /* @__PURE__ */ u.jsx("div", { style: { fontSize: 20 }, children: e.emoji }),
                      /* @__PURE__ */ u.jsx("div", { style: {
                        width: 60,
                        padding: "4px 8px",
                        borderRadius: 4,
                        background: e.color,
                        color: "#fff",
                        fontSize: 12,
                        fontWeight: "bold",
                        textAlign: "center"
                      }, children: e.action }),
                      /* @__PURE__ */ u.jsxs("div", { style: { flex: 1 }, children: [
                        /* @__PURE__ */ u.jsx("div", { style: { color: "#fff", fontSize: 13 }, children: e.desc }),
                        e.note && /* @__PURE__ */ u.jsx("div", { style: { color: "#666", fontSize: 10, marginTop: 2 }, children: e.note })
                      ] })
                    ]
                  },
                  e.action
                )) })
              ] }),
              /* @__PURE__ */ u.jsxs("div", { children: [
                /* @__PURE__ */ u.jsx("div", { style: {
                  fontSize: 14,
                  fontWeight: "bold",
                  color: "#3498db",
                  marginBottom: 12,
                  textAlign: "center",
                  padding: "8px 0",
                  background: "rgba(52, 152, 219, 0.15)",
                  borderRadius: 8
                }, children: "앞에 베팅이 있을 때" }),
                /* @__PURE__ */ u.jsx("div", { style: { display: "flex", flexDirection: "column", gap: 10 }, children: nd.map((e, n) => /* @__PURE__ */ u.jsxs(
                  S.div,
                  {
                    style: {
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "10px 12px",
                      borderRadius: 8,
                      background: "rgba(255,255,255,0.05)"
                    },
                    initial: { opacity: 0, x: 20 },
                    animate: { opacity: 1, x: 0 },
                    transition: { delay: 0.2 + n * 0.08 },
                    children: [
                      /* @__PURE__ */ u.jsx("div", { style: { fontSize: 20 }, children: e.emoji }),
                      /* @__PURE__ */ u.jsx("div", { style: {
                        width: 60,
                        padding: "4px 8px",
                        borderRadius: 4,
                        background: e.color,
                        color: "#fff",
                        fontSize: 12,
                        fontWeight: "bold",
                        textAlign: "center"
                      }, children: e.action }),
                      /* @__PURE__ */ u.jsx("div", { style: { color: "#fff", fontSize: 13 }, children: e.desc })
                    ]
                  },
                  e.action
                )) })
              ] })
            ] }),
            /* @__PURE__ */ u.jsx("div", { style: {
              height: 1,
              background: "rgba(255, 255, 255, 0.15)",
              margin: "20px 0"
            } }),
            /* @__PURE__ */ u.jsxs(
              S.div,
              {
                style: {
                  background: "rgba(241, 196, 15, 0.1)",
                  borderRadius: 8,
                  padding: 16
                },
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                transition: { delay: 0.5 },
                children: [
                  /* @__PURE__ */ u.jsx("div", { style: {
                    fontSize: 14,
                    fontWeight: "bold",
                    color: "#f1c40f",
                    marginBottom: 10
                  }, children: "🔄 다음 라운드로 넘어가는 조건" }),
                  /* @__PURE__ */ u.jsxs("div", { style: {
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    color: "#ccc",
                    fontSize: 13
                  }, children: [
                    /* @__PURE__ */ u.jsxs("div", { children: [
                      "• 모든 플레이어가 ",
                      /* @__PURE__ */ u.jsx("span", { style: { color: "#e74c3c" }, children: "Fold" }),
                      " 또는 ",
                      /* @__PURE__ */ u.jsx("span", { style: { color: "#3498db" }, children: "Call" }),
                      " (금액 맞춤)"
                    ] }),
                    /* @__PURE__ */ u.jsxs("div", { children: [
                      "• 또는 ",
                      /* @__PURE__ */ u.jsx("span", { style: { color: "#f39c12" }, children: "All-in" }),
                      " (더 낼 칩이 없음)"
                    ] })
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ u.jsxs(
              S.div,
              {
                style: {
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  color: "#888",
                  fontSize: 12,
                  marginTop: 16,
                  justifyContent: "center"
                },
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                transition: { delay: 0.6 },
                children: [
                  /* @__PURE__ */ u.jsx("span", { children: "💡" }),
                  /* @__PURE__ */ u.jsx("span", { children: "한 라운드에 누군가 Raise하면, 다시 한 바퀴 돌아요!" })
                ]
              }
            )
          ]
        }
      )
    }
  ) });
}
function sd({ show: t, data: e }) {
  return e ? /* @__PURE__ */ u.jsx(J, { children: t && /* @__PURE__ */ u.jsx(
    S.div,
    {
      style: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        pointerEvents: "none"
      },
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      children: /* @__PURE__ */ u.jsxs(
        S.div,
        {
          style: {
            background: "rgba(0, 0, 0, 0.95)",
            borderRadius: 16,
            padding: "24px 32px",
            width: 420,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.6)",
            border: "1px solid rgba(241, 196, 15, 0.3)"
          },
          initial: { scale: 0.9, y: 20 },
          animate: { scale: 1, y: 0 },
          exit: { scale: 0.9, y: 20 },
          children: [
            /* @__PURE__ */ u.jsxs("div", { style: {
              fontSize: 20,
              fontWeight: "bold",
              color: "#f1c40f",
              marginBottom: 20,
              textAlign: "center"
            }, children: [
              "📊 ",
              e.title
            ] }),
            /* @__PURE__ */ u.jsx("div", { style: { display: "flex", flexDirection: "column", gap: 12 }, children: e.scenarios.map((n, i) => /* @__PURE__ */ u.jsxs(
              S.div,
              {
                style: { display: "flex", flexDirection: "column", gap: 4 },
                initial: { opacity: 0, x: -20 },
                animate: { opacity: 1, x: 0 },
                transition: { delay: 0.1 + i * 0.1 },
                children: [
                  /* @__PURE__ */ u.jsxs("div", { style: {
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 13,
                    color: "#ccc"
                  }, children: [
                    /* @__PURE__ */ u.jsx("span", { children: n.situation }),
                    /* @__PURE__ */ u.jsxs("span", { style: {
                      color: n.equity >= 70 ? "#27ae60" : n.equity >= 50 ? "#f1c40f" : "#e74c3c",
                      fontWeight: "bold"
                    }, children: [
                      n.equity,
                      "%"
                    ] })
                  ] }),
                  /* @__PURE__ */ u.jsx("div", { style: {
                    height: 20,
                    background: "rgba(255,255,255,0.1)",
                    borderRadius: 10,
                    overflow: "hidden"
                  }, children: /* @__PURE__ */ u.jsx(
                    S.div,
                    {
                      style: {
                        height: "100%",
                        background: n.equity >= 70 ? "linear-gradient(90deg, #27ae60, #2ecc71)" : n.equity >= 50 ? "linear-gradient(90deg, #f39c12, #f1c40f)" : "linear-gradient(90deg, #c0392b, #e74c3c)",
                        borderRadius: 10
                      },
                      initial: { width: 0 },
                      animate: { width: `${n.equity}%` },
                      transition: { delay: 0.3 + i * 0.1, duration: 0.5 }
                    }
                  ) })
                ]
              },
              i
            )) }),
            /* @__PURE__ */ u.jsx("div", { style: {
              height: 1,
              background: "rgba(255,255,255,0.15)",
              margin: "20px 0"
            } }),
            /* @__PURE__ */ u.jsxs(
              S.div,
              {
                style: {
                  fontSize: 15,
                  color: "#fff",
                  textAlign: "center",
                  padding: "12px 16px",
                  background: "rgba(241, 196, 15, 0.15)",
                  borderRadius: 8,
                  border: "1px solid rgba(241, 196, 15, 0.3)"
                },
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                transition: { delay: 0.6 },
                children: [
                  "💡 ",
                  e.conclusion
                ]
              }
            )
          ]
        }
      )
    }
  ) }) : null;
}
function od({ show: t, data: e }) {
  return e ? /* @__PURE__ */ u.jsx(J, { children: t && /* @__PURE__ */ u.jsx(
    S.div,
    {
      style: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        pointerEvents: "none"
      },
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      children: /* @__PURE__ */ u.jsxs(
        S.div,
        {
          style: {
            background: "rgba(0, 0, 0, 0.95)",
            borderRadius: 16,
            padding: "24px 32px",
            width: 450,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.6)",
            border: "1px solid rgba(52, 152, 219, 0.3)"
          },
          initial: { scale: 0.9, y: 20 },
          animate: { scale: 1, y: 0 },
          exit: { scale: 0.9, y: 20 },
          children: [
            /* @__PURE__ */ u.jsxs("div", { style: {
              fontSize: 20,
              fontWeight: "bold",
              color: "#3498db",
              marginBottom: 8,
              textAlign: "center"
            }, children: [
              "🧮 ",
              e.title
            ] }),
            /* @__PURE__ */ u.jsxs("div", { style: {
              display: "flex",
              justifyContent: "center",
              gap: 20,
              marginBottom: 20,
              fontSize: 13,
              color: "#888"
            }, children: [
              /* @__PURE__ */ u.jsxs("span", { children: [
                "팟: ",
                /* @__PURE__ */ u.jsxs("span", { style: { color: "#f1c40f" }, children: [
                  e.potSize,
                  "BB"
                ] })
              ] }),
              /* @__PURE__ */ u.jsxs("span", { children: [
                "베팅: ",
                /* @__PURE__ */ u.jsxs("span", { style: { color: "#e74c3c" }, children: [
                  e.betSize,
                  "BB"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ u.jsxs("div", { style: {
              background: "rgba(255,255,255,0.05)",
              borderRadius: 8,
              padding: 12,
              marginBottom: 16
            }, children: [
              /* @__PURE__ */ u.jsxs("div", { style: {
                display: "grid",
                gridTemplateColumns: "1fr 60px 80px",
                gap: 8,
                fontSize: 12,
                color: "#666",
                marginBottom: 8,
                paddingBottom: 8,
                borderBottom: "1px solid rgba(255,255,255,0.1)"
              }, children: [
                /* @__PURE__ */ u.jsx("span", { children: "결과" }),
                /* @__PURE__ */ u.jsx("span", { style: { textAlign: "center" }, children: "확률" }),
                /* @__PURE__ */ u.jsx("span", { style: { textAlign: "right" }, children: "수익" })
              ] }),
              e.scenarios.map((n, i) => /* @__PURE__ */ u.jsxs(
                S.div,
                {
                  style: {
                    display: "grid",
                    gridTemplateColumns: "1fr 60px 80px",
                    gap: 8,
                    fontSize: 13,
                    padding: "6px 0"
                  },
                  initial: { opacity: 0, x: -10 },
                  animate: { opacity: 1, x: 0 },
                  transition: { delay: 0.1 + i * 0.1 },
                  children: [
                    /* @__PURE__ */ u.jsx("span", { style: { color: "#ccc" }, children: n.outcome }),
                    /* @__PURE__ */ u.jsxs("span", { style: { textAlign: "center", color: "#888" }, children: [
                      n.probability,
                      "%"
                    ] }),
                    /* @__PURE__ */ u.jsx("span", { style: {
                      textAlign: "right",
                      color: n.result.startsWith("+") ? "#27ae60" : "#e74c3c",
                      fontWeight: "bold"
                    }, children: n.result })
                  ]
                },
                i
              ))
            ] }),
            /* @__PURE__ */ u.jsxs(
              S.div,
              {
                style: {
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 12,
                  padding: "16px",
                  background: e.ev.startsWith("+") ? "rgba(39, 174, 96, 0.2)" : "rgba(231, 76, 60, 0.2)",
                  borderRadius: 8,
                  border: `1px solid ${e.ev.startsWith("+") ? "#27ae60" : "#e74c3c"}`
                },
                initial: { scale: 0.9, opacity: 0 },
                animate: { scale: 1, opacity: 1 },
                transition: { delay: 0.4 },
                children: [
                  /* @__PURE__ */ u.jsx("span", { style: { color: "#fff", fontSize: 14 }, children: "기대값 (EV):" }),
                  /* @__PURE__ */ u.jsx("span", { style: {
                    fontSize: 24,
                    fontWeight: "bold",
                    color: e.ev.startsWith("+") ? "#27ae60" : "#e74c3c"
                  }, children: e.ev })
                ]
              }
            ),
            /* @__PURE__ */ u.jsxs(
              S.div,
              {
                style: {
                  marginTop: 16,
                  fontSize: 14,
                  color: "#fff",
                  textAlign: "center"
                },
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                transition: { delay: 0.6 },
                children: [
                  "✅ ",
                  e.conclusion
                ]
              }
            )
          ]
        }
      )
    }
  ) }) : null;
}
function rd({ show: t, data: e }) {
  return e ? /* @__PURE__ */ u.jsx(J, { children: t && /* @__PURE__ */ u.jsx(
    S.div,
    {
      style: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        pointerEvents: "none"
      },
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      children: /* @__PURE__ */ u.jsxs(
        S.div,
        {
          style: {
            background: "rgba(0, 0, 0, 0.95)",
            borderRadius: 16,
            padding: "24px 32px",
            width: 480,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.6)",
            border: "1px solid rgba(155, 89, 182, 0.3)"
          },
          initial: { scale: 0.9, y: 20 },
          animate: { scale: 1, y: 0 },
          exit: { scale: 0.9, y: 20 },
          children: [
            /* @__PURE__ */ u.jsxs("div", { style: {
              fontSize: 20,
              fontWeight: "bold",
              color: "#9b59b6",
              marginBottom: 24,
              textAlign: "center"
            }, children: [
              "⚖️ ",
              e.title
            ] }),
            /* @__PURE__ */ u.jsx("div", { style: {
              display: "flex",
              gap: 16,
              marginBottom: 20
            }, children: e.scenarios.map((n, i) => /* @__PURE__ */ u.jsxs(
              S.div,
              {
                style: {
                  flex: 1,
                  padding: 16,
                  borderRadius: 12,
                  background: n.result.startsWith("-") ? "rgba(231, 76, 60, 0.15)" : "rgba(39, 174, 96, 0.15)",
                  border: `2px solid ${n.result.startsWith("-") ? "#e74c3c" : "#27ae60"}`,
                  textAlign: "center"
                },
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { delay: 0.1 + i * 0.15 },
                children: [
                  /* @__PURE__ */ u.jsx("div", { style: {
                    fontSize: 13,
                    color: "#888",
                    marginBottom: 8
                  }, children: n.name }),
                  /* @__PURE__ */ u.jsx("div", { style: {
                    fontSize: 28,
                    fontWeight: "bold",
                    color: n.result.startsWith("-") ? "#e74c3c" : "#27ae60",
                    marginBottom: 8
                  }, children: n.result }),
                  /* @__PURE__ */ u.jsx("div", { style: {
                    fontSize: 11,
                    color: "#aaa"
                  }, children: n.description })
                ]
              },
              i
            )) }),
            /* @__PURE__ */ u.jsxs(
              S.div,
              {
                style: {
                  textAlign: "center",
                  padding: "16px",
                  background: "linear-gradient(135deg, rgba(241, 196, 15, 0.2), rgba(241, 196, 15, 0.05))",
                  borderRadius: 8,
                  border: "1px solid rgba(241, 196, 15, 0.3)"
                },
                initial: { scale: 0.9, opacity: 0 },
                animate: { scale: 1, opacity: 1 },
                transition: { delay: 0.5 },
                children: [
                  /* @__PURE__ */ u.jsx("div", { style: { fontSize: 14, color: "#888", marginBottom: 4 }, children: "결정 하나의 차이" }),
                  /* @__PURE__ */ u.jsx("div", { style: {
                    fontSize: 32,
                    fontWeight: "bold",
                    color: "#f1c40f"
                  }, children: e.difference })
                ]
              }
            )
          ]
        }
      )
    }
  ) }) : null;
}
function ad({ show: t, data: e }) {
  return e ? /* @__PURE__ */ u.jsx(J, { children: t && /* @__PURE__ */ u.jsx(
    S.div,
    {
      style: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        pointerEvents: "none"
      },
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      children: /* @__PURE__ */ u.jsxs(
        S.div,
        {
          style: {
            background: "rgba(0, 0, 0, 0.95)",
            borderRadius: 16,
            padding: "28px 36px",
            width: 420,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.6)",
            border: "2px solid rgba(241, 196, 15, 0.5)"
          },
          initial: { scale: 0.9, y: 20 },
          animate: { scale: 1, y: 0 },
          exit: { scale: 0.9, y: 20 },
          children: [
            /* @__PURE__ */ u.jsxs("div", { style: {
              fontSize: 24,
              fontWeight: "bold",
              color: "#f1c40f",
              marginBottom: 24,
              textAlign: "center"
            }, children: [
              "📝 ",
              e.title
            ] }),
            e.points && /* @__PURE__ */ u.jsx("div", { style: {
              display: "flex",
              flexDirection: "column",
              gap: 12
            }, children: e.points.map((n, i) => /* @__PURE__ */ u.jsxs(
              S.div,
              {
                style: {
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 16px",
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: 8
                },
                initial: { opacity: 0, x: -20 },
                animate: { opacity: 1, x: 0 },
                transition: { delay: 0.2 + i * 0.1 },
                children: [
                  /* @__PURE__ */ u.jsx("div", { style: {
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: "#f1c40f",
                    color: "#000",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    fontSize: 14,
                    flexShrink: 0
                  }, children: i + 1 }),
                  /* @__PURE__ */ u.jsx("span", { style: {
                    color: "#fff",
                    fontSize: 14,
                    lineHeight: 1.4
                  }, children: n })
                ]
              },
              i
            )) }),
            !e.points && e.description && /* @__PURE__ */ u.jsx(
              S.div,
              {
                style: {
                  fontSize: 16,
                  color: "#fff",
                  textAlign: "center",
                  lineHeight: 1.6
                },
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                transition: { delay: 0.2 },
                children: e.description
              }
            )
          ]
        }
      )
    }
  ) }) : null;
}
function ld({ show: t, data: e }) {
  return e ? /* @__PURE__ */ u.jsx(J, { children: t && /* @__PURE__ */ u.jsx(
    S.div,
    {
      style: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        pointerEvents: "none"
      },
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      children: /* @__PURE__ */ u.jsxs(
        S.div,
        {
          style: {
            background: "rgba(0, 0, 0, 0.95)",
            borderRadius: 16,
            padding: "24px 32px",
            width: 520,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.6)",
            border: "1px solid rgba(155, 89, 182, 0.3)"
          },
          initial: { scale: 0.9, y: 20 },
          animate: { scale: 1, y: 0 },
          exit: { scale: 0.9, y: 20 },
          children: [
            /* @__PURE__ */ u.jsxs("div", { style: {
              fontSize: 20,
              fontWeight: "bold",
              color: "#9b59b6",
              marginBottom: 16,
              textAlign: "center"
            }, children: [
              "📐 ",
              e.title
            ] }),
            /* @__PURE__ */ u.jsxs(
              S.div,
              {
                style: {
                  background: "rgba(155, 89, 182, 0.15)",
                  borderRadius: 8,
                  padding: "12px 16px",
                  marginBottom: 16,
                  textAlign: "center",
                  border: "1px solid rgba(155, 89, 182, 0.3)"
                },
                initial: { opacity: 0, y: -10 },
                animate: { opacity: 1, y: 0 },
                transition: { delay: 0.1 },
                children: [
                  /* @__PURE__ */ u.jsx("div", { style: { fontSize: 11, color: "#888", marginBottom: 4 }, children: "공식" }),
                  /* @__PURE__ */ u.jsxs("div", { style: { fontSize: 15, color: "#fff", fontFamily: "monospace" }, children: [
                    "Pot Odds = ",
                    /* @__PURE__ */ u.jsx("span", { style: { color: "#e74c3c" }, children: "투자금" }),
                    " / (",
                    /* @__PURE__ */ u.jsx("span", { style: { color: "#27ae60" }, children: "이득금" }),
                    " + ",
                    /* @__PURE__ */ u.jsx("span", { style: { color: "#e74c3c" }, children: "투자금" }),
                    ")"
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ u.jsx(
              S.div,
              {
                style: {
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 8,
                  marginBottom: 16
                },
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                transition: { delay: 0.2 },
                children: e.extremeCases?.map((n, i) => /* @__PURE__ */ u.jsxs(
                  "div",
                  {
                    style: {
                      background: "rgba(255,255,255,0.05)",
                      borderRadius: 8,
                      padding: "10px 8px",
                      textAlign: "center"
                    },
                    children: [
                      /* @__PURE__ */ u.jsx("div", { style: {
                        fontSize: 18,
                        fontWeight: "bold",
                        color: n.color || "#fff",
                        marginBottom: 4
                      }, children: n.potOdds }),
                      /* @__PURE__ */ u.jsx("div", { style: { fontSize: 10, color: "#888", marginBottom: 2 }, children: n.meaning }),
                      /* @__PURE__ */ u.jsx("div", { style: { fontSize: 11, color: "#aaa" }, children: n.decision })
                    ]
                  },
                  i
                ))
              }
            ),
            /* @__PURE__ */ u.jsxs(
              S.div,
              {
                style: {
                  background: "rgba(241, 196, 15, 0.1)",
                  borderRadius: 8,
                  padding: "10px 16px",
                  marginBottom: 16,
                  textAlign: "center",
                  border: "1px solid rgba(241, 196, 15, 0.3)"
                },
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                transition: { delay: 0.3 },
                children: [
                  /* @__PURE__ */ u.jsxs("span", { style: { color: "#f1c40f", fontSize: 13 }, children: [
                    "💡 내 승률 ",
                    ">",
                    " Pot Odds → ",
                    /* @__PURE__ */ u.jsx("span", { style: { color: "#27ae60" }, children: "+EV (콜)" })
                  ] }),
                  /* @__PURE__ */ u.jsx("span", { style: { margin: "0 12px", color: "#555" }, children: "|" }),
                  /* @__PURE__ */ u.jsxs("span", { style: { color: "#f1c40f", fontSize: 13 }, children: [
                    "내 승률 ",
                    "<",
                    " Pot Odds → ",
                    /* @__PURE__ */ u.jsx("span", { style: { color: "#e74c3c" }, children: "-EV (폴드)" })
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ u.jsxs("div", { style: {
              background: "rgba(255,255,255,0.05)",
              borderRadius: 8,
              padding: 12,
              marginBottom: 12
            }, children: [
              /* @__PURE__ */ u.jsxs("div", { style: {
                display: "grid",
                gridTemplateColumns: "1fr 70px 70px 60px",
                gap: 8,
                fontSize: 11,
                color: "#666",
                marginBottom: 8,
                paddingBottom: 8,
                borderBottom: "1px solid rgba(255,255,255,0.1)"
              }, children: [
                /* @__PURE__ */ u.jsx("span", { children: "상황" }),
                /* @__PURE__ */ u.jsx("span", { style: { textAlign: "center" }, children: "Pot Odds" }),
                /* @__PURE__ */ u.jsx("span", { style: { textAlign: "center" }, children: "승률" }),
                /* @__PURE__ */ u.jsx("span", { style: { textAlign: "right" }, children: "판정" })
              ] }),
              e.scenarios?.map((n, i) => /* @__PURE__ */ u.jsxs(
                S.div,
                {
                  style: {
                    display: "grid",
                    gridTemplateColumns: "1fr 70px 70px 60px",
                    gap: 8,
                    fontSize: 13,
                    padding: "8px 0",
                    borderBottom: i < e.scenarios.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none"
                  },
                  initial: { opacity: 0, x: -10 },
                  animate: { opacity: 1, x: 0 },
                  transition: { delay: 0.4 + i * 0.15 },
                  children: [
                    /* @__PURE__ */ u.jsx("span", { style: { color: "#ccc" }, children: n.situation }),
                    /* @__PURE__ */ u.jsxs("span", { style: { textAlign: "center", color: "#9b59b6", fontWeight: "bold" }, children: [
                      n.potOdds,
                      "%"
                    ] }),
                    /* @__PURE__ */ u.jsxs("span", { style: { textAlign: "center", color: "#3498db" }, children: [
                      n.equity,
                      "%"
                    ] }),
                    /* @__PURE__ */ u.jsx("span", { style: {
                      textAlign: "right",
                      color: n.verdict === "+EV" ? "#27ae60" : "#e74c3c",
                      fontWeight: "bold"
                    }, children: n.verdict === "+EV" ? "✅ 콜" : "❌ 폴드" })
                  ]
                },
                i
              ))
            ] }),
            /* @__PURE__ */ u.jsxs(
              S.div,
              {
                style: {
                  fontSize: 14,
                  color: "#fff",
                  textAlign: "center"
                },
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                transition: { delay: 0.7 },
                children: [
                  "🎯 ",
                  e.conclusion
                ]
              }
            )
          ]
        }
      )
    }
  ) }) : null;
}
const cd = 620, ud = 1, dd = [
  {
    id: 1,
    position: "CO",
    name: "CO",
    chips: 100,
    dealOrder: 5,
    layoutPosition: "top",
    style: { top: "calc(-1 * var(--player-offset-top))", left: "50%", transform: "translateX(-50%)" }
  },
  {
    id: 2,
    position: "BTN",
    name: "BTN",
    chips: 100,
    dealOrder: 6,
    layoutPosition: "right",
    style: { top: "var(--player-offset-side-inner)", right: "calc(-1 * var(--player-offset-side))" }
  },
  {
    id: 3,
    position: "SB",
    name: "SB",
    chips: 100,
    dealOrder: 1,
    layoutPosition: "right",
    style: { bottom: "var(--player-offset-side-inner)", right: "calc(-1 * var(--player-offset-side))" }
  },
  {
    id: 4,
    position: "BB",
    name: "YOU (BB)",
    chips: 100,
    dealOrder: 2,
    isYou: !0,
    layoutPosition: "bottom",
    style: { bottom: "calc(-1 * var(--player-offset-top))", left: "50%", transform: "translateX(-50%)" }
  },
  {
    id: 5,
    position: "UTG",
    name: "UTG",
    chips: 100,
    dealOrder: 3,
    layoutPosition: "left",
    style: { bottom: "var(--player-offset-side-inner)", left: "calc(-1 * var(--player-offset-side))" }
  },
  {
    id: 6,
    position: "HJ",
    name: "HJ",
    chips: 100,
    dealOrder: 4,
    layoutPosition: "left",
    style: { top: "var(--player-offset-side-inner)", left: "calc(-1 * var(--player-offset-side))" }
  }
], hd = {
  BTN: "#d4a574",
  // 베이지
  SB: "#3498db",
  // 파란색
  BB: "#2ecc71",
  // 초록색
  UTG: "#e74c3c",
  // 빨간색
  HJ: "#9b59b6",
  // 보라색
  CO: "#f39c12"
  // 주황색
}, Zo = "/", fd = {
  "♥": "H",
  "♦": "D",
  "♣": "C",
  "♠": "S"
};
function tr(t) {
  if (!t) return null;
  const e = t.rank === "10" ? "T" : t.rank, n = fd[t.suit] || "S";
  return `${e}${n}`;
}
function pd(t) {
  return `${Zo}assets/positions/${t}.svg`;
}
function md() {
  return `${Zo}assets/decorative/dealer-button.svg`;
}
function er({ cardId: t, cards: e }) {
  const n = e?.[t];
  return n ? /* @__PURE__ */ u.jsx(
    "div",
    {
      dangerouslySetInnerHTML: {
        __html: n.replace(/width="2\.5in"/, 'width="100%"').replace(/height="3\.5in"/, 'height="100%"')
      },
      style: { width: "100%", height: "100%" }
    }
  ) : null;
}
function nr() {
  return /* @__PURE__ */ u.jsxs("svg", { viewBox: "-120 -168 240 336", style: { width: "100%", height: "100%" }, children: [
    /* @__PURE__ */ u.jsx("rect", { width: "239", height: "335", x: "-119.5", y: "-167.5", rx: "12", fill: "white", stroke: "black" }),
    /* @__PURE__ */ u.jsx("rect", { width: "216", height: "312", x: "-108", y: "-156", rx: "8", fill: "#b22222" }),
    /* @__PURE__ */ u.jsx("rect", { width: "196", height: "292", x: "-98", y: "-146", rx: "4", fill: "none", stroke: "white", strokeWidth: "2" })
  ] });
}
function yd({ card: t, dealOrder: e = 0, isFolded: n = !1, isHidden: i = !0, isWinner: s = !1, cards: r }) {
  const o = e * 0.15, a = i ? null : tr(t);
  return /* @__PURE__ */ u.jsx(
    S.div,
    {
      className: `card-wrapper ${n ? "folded" : ""} ${s ? "winner" : ""}`,
      initial: { opacity: 0, y: -100, rotateY: 180 },
      animate: {
        opacity: n ? 0.3 : 1,
        y: 0,
        rotateY: 0,
        scale: s ? 1.1 : 1
      },
      transition: {
        delay: o,
        duration: 0.4,
        type: "spring",
        stiffness: 200
      },
      children: /* @__PURE__ */ u.jsx("div", { className: "card-image", style: s ? { boxShadow: "0 0 20px #f1c40f" } : {}, children: a ? /* @__PURE__ */ u.jsx(er, { cardId: a, cards: r }) : /* @__PURE__ */ u.jsx(nr, {}) })
    }
  );
}
function gd({ card: t, dealOrder: e = 0, cards: n }) {
  const i = e * 0.15, s = tr(t);
  return /* @__PURE__ */ u.jsx(
    S.div,
    {
      className: "community-card-wrapper",
      initial: { opacity: 0, y: -50, rotateY: 180 },
      animate: { opacity: 1, y: 0, rotateY: 0 },
      transition: { delay: i, duration: 0.4, type: "spring" },
      children: /* @__PURE__ */ u.jsx("div", { className: "community-card-image", children: s ? /* @__PURE__ */ u.jsx(er, { cardId: s, cards: n }) : /* @__PURE__ */ u.jsx(nr, {}) })
    }
  );
}
function xd({ action: t, delay: e }) {
  let n = t.toLowerCase();
  return t.includes("$") && (n = "blind"), /* @__PURE__ */ u.jsx(
    S.div,
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
function vd({ amount: t, layoutPosition: e, position: n }) {
  if (!t || t <= 0) return null;
  const i = () => {
    switch (e) {
      case "top":
        return { top: "calc(100% + 50px)", left: "calc(50% - 40px)", transform: "translateX(-50%)" };
      case "bottom":
        return { bottom: "calc(100% + 50px)", left: "calc(50% + 40px)", transform: "translateX(-50%)" };
      case "left":
        return { left: "calc(100% + 80px)", top: "50%", transform: "translateY(-50%)" };
      case "right":
        return { right: "calc(100% + 80px)", top: "50%", transform: "translateY(-50%)" };
      default:
        return {};
    }
  }, s = Math.min(5, Math.max(1, Math.ceil(t / 5)));
  return /* @__PURE__ */ u.jsxs(
    S.div,
    {
      className: "player-chip-stack",
      style: {
        position: "absolute",
        ...i(),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        zIndex: 20
      },
      initial: { opacity: 0, scale: 0 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0, y: e === "top" ? 50 : e === "bottom" ? -50 : 0 },
      transition: { duration: 0.3 },
      children: [
        /* @__PURE__ */ u.jsx("div", { className: "chip-stack", style: { display: "flex", flexDirection: "column-reverse", marginBottom: 4 }, children: [...Array(s)].map((r, o) => /* @__PURE__ */ u.jsx(
          S.div,
          {
            className: "chip red",
            style: {
              width: 20,
              height: 6,
              background: "linear-gradient(180deg, #e74c3c 0%, #c0392b 100%)",
              borderRadius: 3,
              marginTop: o > 0 ? -3 : 0,
              boxShadow: "0 1px 2px rgba(0,0,0,0.3)",
              border: "1px solid #a93226"
            },
            initial: { opacity: 0, y: -10 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: o * 0.05 }
          },
          o
        )) }),
        /* @__PURE__ */ u.jsxs("span", { style: {
          fontSize: 10,
          fontWeight: "bold",
          color: "#fff",
          textShadow: "0 1px 2px rgba(0,0,0,0.8)",
          background: "rgba(0,0,0,0.6)",
          padding: "1px 5px",
          borderRadius: 4
        }, children: [
          t,
          "BB"
        ] })
      ]
    }
  );
}
function bd({ amount: t, winnerPosition: e, layoutPosition: n }) {
  if (!t || !e) return null;
  const s = (() => {
    switch (n) {
      case "top":
        return { x: 0, y: -200 };
      case "bottom":
        return { x: 0, y: 200 };
      case "left":
        return { x: -250, y: 0 };
      case "right":
        return { x: 250, y: 0 };
      default:
        return { x: 0, y: 0 };
    }
  })();
  return /* @__PURE__ */ u.jsxs(
    S.div,
    {
      style: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        zIndex: 100
      },
      initial: { opacity: 1, scale: 1, x: 0, y: 0 },
      animate: {
        opacity: [1, 1, 0],
        scale: [1, 1.2, 0.8],
        x: s.x,
        y: s.y
      },
      transition: {
        duration: 1.2,
        ease: "easeInOut",
        times: [0, 0.3, 1]
      },
      children: [
        /* @__PURE__ */ u.jsx("div", { style: { display: "flex", gap: 2 }, children: [...Array(8)].map((r, o) => /* @__PURE__ */ u.jsx(
          S.div,
          {
            style: {
              width: 24,
              height: 8,
              background: o < 4 ? "linear-gradient(180deg, #e74c3c 0%, #c0392b 100%)" : o < 6 ? "linear-gradient(180deg, #27ae60 0%, #1e8449 100%)" : "linear-gradient(180deg, #2980b9 0%, #1a5276 100%)",
              borderRadius: 4,
              boxShadow: "0 2px 4px rgba(0,0,0,0.4)"
            },
            initial: { rotate: 0 },
            animate: { rotate: [0, 5, -5, 0] },
            transition: { duration: 0.3, delay: o * 0.03 }
          },
          o
        )) }),
        /* @__PURE__ */ u.jsxs(
          S.span,
          {
            style: {
              fontSize: 16,
              fontWeight: "bold",
              color: "#f1c40f",
              textShadow: "0 2px 4px rgba(0,0,0,0.8)",
              marginTop: 8
            },
            initial: { scale: 1 },
            animate: { scale: [1, 1.3, 1] },
            transition: { duration: 0.4 },
            children: [
              "+",
              t,
              "BB"
            ]
          }
        )
      ]
    }
  );
}
function Sd({ player: t, step: e, cardsDealt: n, yourCards: i, foldedPlayers: s, calledPlayers: r, checkedPlayers: o, raisedPlayers: a, betPlayers: l, blindPlayers: d, phase: c, playerChips: h, latestBet: f, phaseBets: p, cards: m, isShowdown: g, isRevealAll: v, scenarioPlayerCards: y, winner: b }) {
  const [x, D] = de(!1), A = n && e >= 2, C = s.includes(t.position), V = r.includes(t.position), P = o?.includes(t.position), R = l?.includes(t.position), L = a?.includes(t.position), K = d?.[t.position] && c === "preflop", ot = b === t.position;
  let nt = [null, null];
  t.isYou ? nt = i : (v && y?.[t.position] || g && !C && y?.[t.position]) && (nt = y[t.position]);
  const xt = hd[t.position], vt = pd(t.position), kt = h?.[t.position] ?? t.chips;
  f?.[t.position]?.amount;
  const k = t.layoutPosition === "top", O = t.layoutPosition === "bottom", U = t.layoutPosition === "left", G = k ? { top: "100%", left: "calc(50% + 40px)", transform: "translateX(-50%)" } : O ? { bottom: "100%", left: "calc(50% - 40px)", transform: "translateX(-50%)" } : U ? { left: "100%", top: "50%", transform: "translateY(-50%)" } : { right: "100%", top: "50%", transform: "translateY(-50%)" };
  let N = null;
  return C ? N = "FOLD" : L ? N = "RAISE" : R ? N = "BET" : V ? N = "CALL" : P ? N = "CHECK" : K && (N = `${d[t.position]}BB`), /* @__PURE__ */ u.jsxs(
    S.div,
    {
      className: `player ${t.isYou ? "you" : ""} ${t.layoutPosition || ""}`,
      style: {
        ...t.style,
        ...t.isYou ? {
          filter: "drop-shadow(0 0 12px rgba(231, 76, 60, 0.7))"
        } : {}
      },
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { delay: t.id * 0.1 },
      children: [
        /* @__PURE__ */ u.jsx("div", { className: "position-icon", style: x ? { background: xt } : {}, children: x ? /* @__PURE__ */ u.jsx("span", { style: { color: "#fff", fontWeight: "bold", fontSize: "14px" }, children: t.position }) : /* @__PURE__ */ u.jsx(
          "img",
          {
            src: vt,
            alt: t.position,
            onError: () => D(!0)
          }
        ) }),
        /* @__PURE__ */ u.jsxs("div", { className: "player-info", children: [
          t.isYou && /* @__PURE__ */ u.jsx("div", { className: "player-name", style: {
            color: "#e74c3c",
            fontWeight: "bold",
            textShadow: "0 0 8px rgba(231, 76, 60, 0.5)"
          }, children: "YOU" }),
          /* @__PURE__ */ u.jsxs(
            S.div,
            {
              className: "player-chips",
              initial: { scale: 1.2, color: "#e74c3c" },
              animate: { scale: 1, color: "#f1c40f" },
              transition: { duration: 0.3 },
              children: [
                kt,
                "BB"
              ]
            },
            kt
          )
        ] }),
        /* @__PURE__ */ u.jsx("div", { className: "player-cards", style: { position: "absolute", ...G }, children: A && nt.map((te, ee) => /* @__PURE__ */ u.jsx(
          yd,
          {
            card: te,
            dealOrder: t.dealOrder,
            isFolded: C,
            isHidden: !t.isYou && !g && !v,
            isWinner: ot,
            cards: m
          },
          ee
        )) }),
        /* @__PURE__ */ u.jsx(J, { children: N && /* @__PURE__ */ u.jsx(xd, { action: N, delay: 0 }) }),
        /* @__PURE__ */ u.jsx(J, { children: p?.[t.position] > 0 && /* @__PURE__ */ u.jsx(
          vd,
          {
            amount: p[t.position],
            layoutPosition: t.layoutPosition
          },
          `phase-chips-${c}`
        ) })
      ]
    }
  );
}
function Td({ amount: t }) {
  if (!t || t <= 0) return null;
  const e = {
    red: "linear-gradient(180deg, #e74c3c 0%, #c0392b 100%)",
    green: "linear-gradient(180deg, #27ae60 0%, #1e8449 100%)",
    blue: "linear-gradient(180deg, #3498db 0%, #2471a3 100%)"
  }, n = Math.min(12, Math.max(3, Math.ceil(t / 20))), i = [];
  for (let s = 0; s < n; s++) {
    const r = s % 3, o = r === 0 ? "red" : r === 1 ? "green" : "blue", a = (Math.random() - 0.5) * 20, l = s * -2;
    i.push({ color: o, offsetX: a, offsetY: l, delay: s * 0.02 });
  }
  return /* @__PURE__ */ u.jsx(
    S.div,
    {
      className: "pot-chips",
      style: {
        position: "absolute",
        top: "32%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 25
      },
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { delay: 0.2 },
      children: /* @__PURE__ */ u.jsx("div", { style: { position: "relative", width: 60, height: 40 }, children: i.map((s, r) => /* @__PURE__ */ u.jsx(
        S.div,
        {
          style: {
            position: "absolute",
            left: 20 + s.offsetX,
            bottom: 0,
            width: 20,
            height: 8,
            background: e[s.color],
            borderRadius: 4,
            boxShadow: "0 1px 3px rgba(0,0,0,0.5)",
            border: "1px solid rgba(255,255,255,0.2)",
            transform: `translateY(${s.offsetY}px)`
          },
          initial: { opacity: 0, y: -20 },
          animate: { opacity: 1, y: s.offsetY },
          transition: { delay: s.delay, type: "spring", stiffness: 300 }
        },
        r
      )) })
    }
  );
}
function Ad({ amount: t }) {
  return !t || t <= 0 ? null : /* @__PURE__ */ u.jsxs(
    S.div,
    {
      className: "pot-amount",
      style: {
        position: "absolute",
        bottom: "-5%",
        left: "8%",
        background: "rgba(0, 0, 0, 0.75)",
        color: "#f1c40f",
        padding: "4px 10px",
        borderRadius: 8,
        fontSize: 13,
        fontWeight: "bold",
        zIndex: 35,
        border: "1px solid rgba(241, 196, 15, 0.3)"
      },
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      transition: { delay: 0.3 },
      children: [
        "POT: ",
        t,
        "BB"
      ]
    },
    t
  );
}
function wd({ currentPhase: t }) {
  const e = ["Pre-flop", "Flop", "Turn", "River"], i = { preflop: 0, flop: 1, turn: 2, river: 3 }[t] ?? 0;
  return /* @__PURE__ */ u.jsx("div", { className: "game-phase", children: e.map((s, r) => /* @__PURE__ */ u.jsx(
    "div",
    {
      className: `phase ${r === i ? "active" : ""} ${r < i ? "completed" : ""}`,
      children: s
    },
    s
  )) });
}
function Pd({ step: t, totalSteps: e }) {
  return /* @__PURE__ */ u.jsx("div", { className: "step-indicator", children: [...Array(e)].map((n, i) => /* @__PURE__ */ u.jsx(
    "div",
    {
      className: `step-dot ${i === t ? "active" : ""} ${i < t ? "completed" : ""}`
    },
    i
  )) });
}
function jd({ gameState: t }) {
  const e = cd, n = ud, i = De(), s = t.getState(), {
    step: r,
    totalSteps: o,
    phase: a,
    pot: l,
    collectedPot: d,
    communityCards: c,
    yourCards: h,
    yourPosition: f,
    currentStepData: p
  } = s, m = p?.type === "position_modal", g = p?.type === "action_modal", v = p?.type === "equity_modal", y = p?.type === "ev_modal", b = p?.type === "comparison_modal", x = p?.type === "lesson", D = p?.type === "pot_odds_modal", A = p?.type === "info_modal", C = p?.type === "showdown" || p?.type === "winner", V = p?.type === "reveal_all_hands", P = t.scenario.playerCards || {}, R = p?.type === "winner" ? p.winner : null, L = [], K = {}, ot = {};
  let nt = 0;
  for (let T = 0; T <= r; T++) {
    const j = t.scenario.steps[T];
    (j?.type === "flop" || j?.type === "turn" || j?.type === "river") && (nt = T);
  }
  for (let T = 0; T <= r; T++) {
    const j = t.scenario.steps[T];
    j?.type === "action" && j.action === "FOLD" && L.push(j.player), j?.type === "blinds" && j.bets && (ot.SB = j.bets.SB, ot.BB = j.bets.BB), T >= nt && j?.type === "action" && j.action !== "FOLD" && (K[j.player] = j.action);
  }
  const xt = Object.entries(K).filter(([T, j]) => j === "CALL").map(([T]) => T), vt = Object.entries(K).filter(([T, j]) => j === "CHECK").map(([T]) => T), kt = Object.entries(K).filter(([T, j]) => j === "RAISE").map(([T]) => T), k = Object.entries(K).filter(([T, j]) => j === "BET").map(([T]) => T), O = dd.map((T) => ({
    ...T,
    isYou: T.position === f
  })), U = {}, G = {}, N = {};
  O.forEach((T) => {
    U[T.position] = T.chips, N[T.position] = 0;
  });
  for (let T = 0; T <= r; T++) {
    const j = t.scenario.steps[T];
    (j?.type === "flop" || j?.type === "turn" || j?.type === "river") && O.forEach((It) => {
      N[It.position] = 0;
    }), j?.type === "blinds" && j.bets && Object.entries(j.bets).forEach(([It, Re]) => {
      U[It] -= Re, N[It] += Re, T === r && (G[It] = { amount: Re, stepIndex: T });
    }), j?.type === "action" && j.bet > 0 && (U[j.player] -= j.bet, N[j.player] += j.bet, T === r && (G[j.player] = { amount: j.bet, stepIndex: T }));
  }
  (p?.type === "showdown" || p?.type === "winner") && O.forEach((T) => {
    N[T.position] = 0;
  });
  const te = {
    "--scale": n,
    "--table-width": `${e}px`,
    "--table-height": `${e * 0.625}px`
  }, ee = t.scenario.steps.slice(0, r + 1).some((T) => T?.type === "deal" || T?.type === "blinds" || T?.type === "setup"), Ve = t.scenario.steps.slice(0, r + 1).some((T) => T?.type === "deal");
  return /* @__PURE__ */ u.jsxs("div", { className: "container embed-mode", style: te, children: [
    /* @__PURE__ */ u.jsx(wd, { currentPhase: a }),
    /* @__PURE__ */ u.jsxs("div", { className: "poker-table", children: [
      /* @__PURE__ */ u.jsx("div", { className: "table-rail" }),
      /* @__PURE__ */ u.jsx("div", { className: "table-felt" }),
      ee && O.map((T) => /* @__PURE__ */ u.jsx(
        Sd,
        {
          player: T,
          step: r,
          cardsDealt: Ve,
          yourCards: h,
          foldedPlayers: L,
          calledPlayers: xt,
          checkedPlayers: vt,
          raisedPlayers: kt,
          betPlayers: k,
          blindPlayers: ot,
          phase: a,
          playerChips: U,
          latestBet: G,
          phaseBets: N,
          cards: i,
          isShowdown: C,
          isRevealAll: V,
          scenarioPlayerCards: P,
          winner: R
        },
        T.id
      )),
      ee && /* @__PURE__ */ u.jsx(
        S.div,
        {
          className: "dealer-button",
          style: { top: "34%", right: "15%" },
          initial: { opacity: 0, scale: 0 },
          animate: { opacity: 1, scale: 1 },
          transition: { delay: 0.6 },
          children: /* @__PURE__ */ u.jsx("img", { src: md(), alt: "Dealer", className: "dealer-button-img" })
        }
      ),
      Ve && d > 0 && /* @__PURE__ */ u.jsx(Td, { amount: d }),
      Ve && d > 0 && /* @__PURE__ */ u.jsx(Ad, { amount: d }),
      /* @__PURE__ */ u.jsx(J, { children: R && (() => {
        const T = O.find((j) => j.position === R);
        return T ? /* @__PURE__ */ u.jsx(
          bd,
          {
            amount: l,
            winnerPosition: R,
            layoutPosition: T.layoutPosition
          },
          `pot-to-winner-${r}`
        ) : null;
      })() }),
      /* @__PURE__ */ u.jsx("div", { className: "community-cards", children: c.map((T, j) => /* @__PURE__ */ u.jsx(gd, { card: T, dealOrder: j, cards: i }, j)) }),
      /* @__PURE__ */ u.jsx(Pd, { step: r, totalSteps: o }),
      /* @__PURE__ */ u.jsx(td, { show: m }),
      /* @__PURE__ */ u.jsx(id, { show: g }),
      /* @__PURE__ */ u.jsx(sd, { show: v, data: p }),
      /* @__PURE__ */ u.jsx(od, { show: y, data: p }),
      /* @__PURE__ */ u.jsx(rd, { show: b, data: p }),
      /* @__PURE__ */ u.jsx(ad, { show: x, data: p }),
      /* @__PURE__ */ u.jsx(ld, { show: D, data: p }),
      A && /* @__PURE__ */ u.jsx(
        S.div,
        {
          style: {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            pointerEvents: "none"
          },
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          children: /* @__PURE__ */ u.jsxs(
            S.div,
            {
              style: {
                background: "rgba(0, 0, 0, 0.95)",
                borderRadius: 16,
                padding: "24px 32px",
                width: 380,
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.6)",
                border: "1px solid rgba(39, 174, 96, 0.3)"
              },
              initial: { scale: 0.9, y: 20 },
              animate: { scale: 1, y: 0 },
              children: [
                /* @__PURE__ */ u.jsxs("div", { style: {
                  fontSize: 18,
                  fontWeight: "bold",
                  color: "#27ae60",
                  marginBottom: 16,
                  textAlign: "center"
                }, children: [
                  "✅ ",
                  p?.title
                ] }),
                /* @__PURE__ */ u.jsx("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: p?.content?.map((T, j) => /* @__PURE__ */ u.jsx("div", { style: {
                  fontSize: 14,
                  color: "#fff",
                  padding: "8px 12px",
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: 6
                }, children: T }, j)) })
              ]
            }
          )
        }
      )
    ] })
  ] });
}
const Cd = 1.27, Dd = ["S", "H", "D", "C"], Vd = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K"], Rd = Dd.flatMap(
  (t, e) => Vd.map((n, i) => ({
    rank: n,
    suit: t,
    suitIndex: e,
    rankIndex: i,
    id: `${n}${t}`
  }))
);
function Md(t, e, n, i = 1) {
  const o = 55 * i, a = 78 * i, l = -(13 * o) / 2 + o / 2, d = -(4 * a) / 2 + a / 2;
  if (t === 0) {
    const c = e * 13 + n;
    return {
      x: (c * 1.8 - 50) * i,
      y: (c * 1 - 25) * i,
      opacity: 1,
      filter: "none"
    };
  }
  if (t === 1)
    return {
      x: (n * 4 - 25) * i,
      y: d + e * a,
      opacity: 1,
      filter: "none"
    };
  if (t >= 2 && t <= 5) {
    const c = t - 2, h = (n * 4 - 25) * i, f = e === c;
    return {
      x: h,
      y: d + e * a,
      opacity: 1,
      filter: f ? "none" : "grayscale(100%) brightness(0.6)"
    };
  }
  if (t === 6)
    return {
      x: l + n * o,
      y: d + e * a,
      opacity: 1,
      filter: "none"
    };
  if (t === 7)
    return {
      x: l + n * o,
      y: d + e * a,
      opacity: 1,
      filter: "none",
      // waveOrder는 rankIndex 그대로 (A=0, 2=1, ..., K=12)
      waveOrder: n
    };
  if (t === 8) {
    const c = n === 0;
    return {
      x: l + n * o,
      y: d + e * a,
      opacity: 1,
      filter: c ? "none" : "grayscale(100%) brightness(0.6)"
    };
  }
  return { x: 0, y: 0, opacity: 1, filter: "none" };
}
function Ed(t, e, n) {
  return t === 6 ? n * 0.05 : 0;
}
function Bd({ rank: t, suit: e, suitIndex: n, rankIndex: i, step: s, scale: r, cards: o }) {
  const a = Md(s, n, i, r), l = Ed(s, n, i), d = `${t}${e}`, c = 50, h = 70, f = c * r, p = h * r, m = s === 7, g = a.waveOrder || 0, v = 0.15, y = 0.25, b = g * v;
  return /* @__PURE__ */ u.jsx(
    S.div,
    {
      style: {
        position: "absolute",
        left: "50%",
        top: "50%",
        width: f,
        height: p,
        marginLeft: -f / 2,
        marginTop: -p / 2,
        borderRadius: 3 * r,
        overflow: "hidden",
        boxShadow: `${1 * r}px ${1 * r}px ${4 * r}px rgba(0,0,0,0.3)`,
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
        duration: y,
        times: [0, 0.4, 1],
        ease: "easeOut"
      } : {
        delay: l,
        duration: 0.4,
        type: "spring",
        stiffness: 100,
        damping: 15
      },
      children: /* @__PURE__ */ u.jsx(
        "div",
        {
          dangerouslySetInnerHTML: {
            __html: o?.[d]?.replace(/width="2\.5in"/, 'width="100%"').replace(/height="3\.5in"/, 'height="100%"') || ""
          },
          style: { width: "100%", height: "100%" }
        }
      )
    }
  );
}
function kd({ step: t = 0 }) {
  const e = Cd, n = De(), i = 715 * e, s = 312 * e;
  return n ? /* @__PURE__ */ u.jsx(
    "div",
    {
      style: {
        position: "relative",
        width: i,
        height: s
      },
      children: Rd.map((r) => /* @__PURE__ */ u.jsx(
        Bd,
        {
          rank: r.rank,
          suit: r.suit,
          suitIndex: r.suitIndex,
          rankIndex: r.rankIndex,
          step: t,
          scale: e,
          cards: n
        },
        r.id
      ))
    }
  ) : /* @__PURE__ */ u.jsx("div", { style: { width: i, height: s, display: "flex", alignItems: "center", justifyContent: "center", color: "#888" }, children: "Loading cards..." });
}
const Id = 1.5;
function Ld(t) {
  const e = t[0].toUpperCase(), n = t[1].toUpperCase();
  return `${e}${n}`;
}
const Ct = [
  {
    name: "Royal Straight Flush",
    nameKr: "로열 스트레이트 플러시",
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
], Od = Ct.reduce((t, e) => t + e.examples.length, 0);
function Fd(t) {
  let e = t;
  for (let n = Ct.length - 1; n >= 0; n--) {
    const i = Ct[n].examples.length;
    if (e < i)
      return { handIndex: n, exampleIndex: e };
    e -= i;
  }
  return { handIndex: 0, exampleIndex: Ct[0].examples.length - 1 };
}
function Nd({ cardStr: t, index: e, scale: n, shouldAnimate: i = !0, cards: s }) {
  const r = Ld(t), o = 50 * n, a = 70 * n;
  return /* @__PURE__ */ u.jsx(
    S.div,
    {
      initial: i ? { opacity: 0, y: -20, rotateY: 180 } : !1,
      animate: { opacity: 1, y: 0, rotateY: 0 },
      transition: i ? {
        delay: e * 0.1,
        duration: 0.3,
        type: "spring",
        stiffness: 200,
        damping: 20
      } : { duration: 0 },
      style: {
        width: o,
        height: a,
        borderRadius: 4 * n,
        overflow: "hidden",
        boxShadow: "1px 1px 4px rgba(0,0,0,0.3)",
        flexShrink: 0
      },
      children: /* @__PURE__ */ u.jsx(
        "div",
        {
          dangerouslySetInnerHTML: {
            __html: s?.[r]?.replace(/width="2\.5in"/, 'width="100%"').replace(/height="3\.5in"/, 'height="100%"') || ""
          },
          style: { width: "100%", height: "100%" }
        }
      )
    }
  );
}
function _d({ hand: t, isActive: e, isPassed: n, scale: i }) {
  const s = (r) => r.toLocaleString();
  return /* @__PURE__ */ u.jsxs(
    S.div,
    {
      animate: {
        backgroundColor: e ? "#f1c40f" : n ? "#27ae60" : "#2c3e50",
        color: e ? "#000" : "#fff",
        scale: e ? 1.02 : 1
      },
      transition: { duration: 0.2 },
      style: {
        padding: `${5 * i}px ${8 * i}px`,
        borderRadius: 4 * i,
        marginBottom: 2 * i,
        display: "flex",
        alignItems: "center",
        gap: 5 * i
      },
      children: [
        /* @__PURE__ */ u.jsx("span", { style: {
          fontSize: 12 * i,
          fontWeight: "bold",
          minWidth: 110 * i
        }, children: t.name }),
        /* @__PURE__ */ u.jsx("span", { style: {
          fontSize: 10 * i,
          opacity: 0.7,
          minWidth: 100 * i,
          whiteSpace: "nowrap"
        }, children: t.description }),
        /* @__PURE__ */ u.jsx("span", { style: {
          fontSize: 10 * i,
          opacity: 0.6,
          minWidth: 60 * i,
          textAlign: "right",
          fontFamily: "monospace"
        }, children: s(t.count) }),
        /* @__PURE__ */ u.jsx("span", { style: {
          fontSize: 10 * i,
          opacity: 0.6,
          minWidth: 48 * i,
          textAlign: "right"
        }, children: t.probability })
      ]
    }
  );
}
function Kd({ example: t, exampleIdx: e, handName: n, scale: i, isNew: s, cards: r }) {
  return /* @__PURE__ */ u.jsx(
    S.div,
    {
      initial: s ? { opacity: 0, y: 10 } : !1,
      animate: { opacity: 1, y: 0 },
      transition: s ? { duration: 0.3 } : { duration: 0 },
      style: {
        display: "flex",
        gap: 4 * i
      },
      children: t.cards.map((o, a) => /* @__PURE__ */ u.jsx(
        Nd,
        {
          cardStr: o,
          index: a,
          scale: i * 1.1,
          shouldAnimate: s,
          cards: r
        },
        `${n}-${e}-${o}`
      ))
    }
  );
}
function Wd({ hand: t, exampleIndex: e, scale: n, cards: i }) {
  if (e < 0) return null;
  const s = t.examples.slice(0, e + 1);
  return /* @__PURE__ */ u.jsx("div", { style: {
    display: "flex",
    flexDirection: "column",
    gap: 18 * n,
    // 왼쪽 테이블 행간과 맞춤
    alignItems: "flex-start"
  }, children: s.map((r, o) => /* @__PURE__ */ u.jsx(
    Kd,
    {
      example: r,
      exampleIdx: o,
      handName: t.name,
      scale: n,
      isNew: o === e,
      cards: i
    },
    `${t.name}-row-${o}`
  )) });
}
function zd({ step: t = 0 }) {
  const e = Id, n = De(), { handIndex: i, exampleIndex: s } = Fd(t), r = Ct[i];
  return n ? /* @__PURE__ */ u.jsxs(
    "div",
    {
      style: {
        display: "flex",
        gap: 40 * e,
        padding: 20 * e,
        alignItems: "flex-start",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        paddingTop: 40 * e
      },
      children: [
        /* @__PURE__ */ u.jsxs("div", { style: {
          display: "flex",
          flexDirection: "column",
          minWidth: 310 * e
        }, children: [
          /* @__PURE__ */ u.jsx("div", { style: {
            fontSize: 18 * e,
            fontWeight: "bold",
            color: "#f1c40f",
            marginBottom: 12 * e,
            textAlign: "center"
          }, children: "POKER HAND RANKINGS" }),
          /* @__PURE__ */ u.jsx("div", { style: {
            fontSize: 10 * e,
            color: "#7f8c8d",
            marginBottom: 8 * e,
            textAlign: "center"
          }, children: "↑ 강          약 ↓" }),
          Ct.map((o, a) => /* @__PURE__ */ u.jsx(
            _d,
            {
              hand: o,
              isActive: a === i,
              isPassed: a > i,
              scale: e
            },
            o.name
          ))
        ] }),
        /* @__PURE__ */ u.jsxs("div", { style: {
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          minWidth: 350 * e
        }, children: [
          /* @__PURE__ */ u.jsx(J, { mode: "wait", children: /* @__PURE__ */ u.jsx(
            S.div,
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
              children: r.name
            },
            `title-${r.name}`
          ) }),
          /* @__PURE__ */ u.jsx("div", { style: {
            fontSize: 10 * e,
            color: "#7f8c8d",
            marginBottom: 8 * e
          }, children: " " }),
          /* @__PURE__ */ u.jsx(J, { mode: "wait", children: t >= 0 && /* @__PURE__ */ u.jsx(
            S.div,
            {
              initial: { opacity: 0, x: 20 },
              animate: { opacity: 1, x: 0 },
              exit: { opacity: 0, x: -20 },
              transition: { duration: 0.3 },
              children: /* @__PURE__ */ u.jsx(
                Wd,
                {
                  hand: r,
                  exampleIndex: s,
                  scale: e,
                  cards: n
                }
              )
            },
            `cards-${i}`
          ) })
        ] })
      ]
    }
  ) : /* @__PURE__ */ u.jsx("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", color: "#888" }, children: "Loading cards..." });
}
const $d = Od, Ud = ["TC", "TD"], Hd = ["KS", "7H"], Gd = ["TS", "JS", "QS", "AS", "TH"], ms = ["TC", "TD", "TS", "TH", "AS"], ys = ["TS", "JS", "QS", "KS", "AS"];
function Ge({ cardId: t, isRevealed: e = !1, isHighlighted: n = !1, delay: i = 0, cards: s }) {
  const r = e ? s?.[t] : null;
  return /* @__PURE__ */ u.jsx(
    S.div,
    {
      style: {
        width: 60,
        height: 84,
        borderRadius: 4,
        overflow: "hidden",
        backgroundColor: "white",
        boxShadow: n ? "0 0 10px 2px rgba(255, 200, 0, 0.5)" : "2px 2px 8px rgba(0,0,0,0.3)",
        border: n ? "2px solid rgba(255, 200, 0, 0.7)" : "none",
        flexShrink: 0
      },
      initial: { opacity: 0.5 },
      animate: { opacity: 1 },
      transition: {
        delay: i,
        duration: 0.3
      },
      children: e && r ? /* @__PURE__ */ u.jsx(
        "div",
        {
          dangerouslySetInnerHTML: {
            __html: r.replace(/width="2\.5in"/, 'width="100%"').replace(/height="3\.5in"/, 'height="100%"')
          },
          style: { width: "100%", height: "100%" }
        }
      ) : (
        // 카드 뒷면 - 인라인 SVG (패턴 스케일링 문제 회피)
        /* @__PURE__ */ u.jsxs("svg", { viewBox: "-120 -168 240 336", style: { width: "100%", height: "100%" }, children: [
          /* @__PURE__ */ u.jsx("rect", { width: "239", height: "335", x: "-119.5", y: "-167.5", rx: "12", fill: "white", stroke: "black" }),
          /* @__PURE__ */ u.jsx("rect", { width: "216", height: "312", x: "-108", y: "-156", rx: "8", fill: "#b22222" }),
          /* @__PURE__ */ u.jsx("rect", { width: "196", height: "292", x: "-98", y: "-146", rx: "4", fill: "none", stroke: "white", strokeWidth: "2" })
        ] })
      )
    }
  );
}
function Yd({ step: t = 0 }) {
  const e = De(), n = t >= 1, i = t >= 4 ? 5 : t >= 3 ? 4 : t >= 2 ? 3 : 0, s = t >= 6, r = t === 5 ? ms : t === 6 ? [] : [], o = t === 6 ? ys : [], a = t === 5 ? ms : t === 6 ? ys : [], l = t === 5, d = t === 6;
  return e ? /* @__PURE__ */ u.jsx("div", { style: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 20
  }, children: /* @__PURE__ */ u.jsxs("div", { style: { position: "relative" }, children: [
    /* @__PURE__ */ u.jsx("div", { style: {
      position: "absolute",
      top: 0,
      left: -20,
      right: -20,
      bottom: "33%",
      // 공용 카드까지
      border: "2px dashed",
      borderColor: d ? "rgba(255, 107, 107, 0.5)" : "transparent",
      borderRadius: 12,
      pointerEvents: "none",
      transition: "border-color 0.3s ease",
      zIndex: 10
    }, children: /* @__PURE__ */ u.jsx("div", { style: {
      position: "absolute",
      top: -10,
      left: "50%",
      transform: "translateX(-50%)",
      backgroundColor: "#1a1a1a",
      padding: "2px 10px",
      fontSize: 11,
      color: "#ff6b6b",
      borderRadius: 4,
      opacity: d ? 1 : 0,
      transition: "opacity 0.3s ease"
    }, children: "7장 중 최강 5장" }) }),
    /* @__PURE__ */ u.jsx("div", { style: {
      position: "absolute",
      top: "33%",
      // 공용 카드부터
      left: -20,
      right: -20,
      bottom: 0,
      border: "2px dashed",
      borderColor: l ? "rgba(78, 205, 196, 0.5)" : "transparent",
      borderRadius: 12,
      pointerEvents: "none",
      transition: "border-color 0.3s ease",
      zIndex: 10
    }, children: /* @__PURE__ */ u.jsx("div", { style: {
      position: "absolute",
      top: -10,
      left: "50%",
      transform: "translateX(-50%)",
      backgroundColor: "#1a1a1a",
      padding: "2px 10px",
      fontSize: 11,
      color: "#4ecdc4",
      borderRadius: 4,
      opacity: l ? 1 : 0,
      transition: "opacity 0.3s ease"
    }, children: "7장 중 최강 5장" }) }),
    /* @__PURE__ */ u.jsxs("div", { style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginBottom: 16
    }, children: [
      /* @__PURE__ */ u.jsx("div", { style: {
        color: s ? "#ff6b6b" : "#888",
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 8
      }, children: "상대" }),
      /* @__PURE__ */ u.jsx("div", { style: { display: "flex", gap: 4 }, children: Hd.map((c, h) => /* @__PURE__ */ u.jsx(
        Ge,
        {
          cardId: c,
          isRevealed: s,
          isHighlighted: o.includes(c),
          delay: h * 0.1,
          cards: e
        },
        h
      )) }),
      /* @__PURE__ */ u.jsx("div", { style: { height: 24, marginTop: 8 }, children: d && /* @__PURE__ */ u.jsx(
        S.div,
        {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          style: {
            color: "#ff6b6b",
            fontSize: 16,
            fontWeight: "bold"
          },
          children: "로열 스트레이트 플러시!"
        }
      ) })
    ] }),
    /* @__PURE__ */ u.jsxs("div", { style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginBottom: 16
    }, children: [
      /* @__PURE__ */ u.jsx("div", { style: {
        color: "#888",
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 8
      }, children: "공용 카드" }),
      /* @__PURE__ */ u.jsx("div", { style: { display: "flex", gap: 6 }, children: Gd.map((c, h) => /* @__PURE__ */ u.jsx(
        Ge,
        {
          cardId: c,
          isRevealed: h < i,
          isHighlighted: a.includes(c),
          delay: 0.2 + h * 0.1,
          cards: e
        },
        h
      )) })
    ] }),
    /* @__PURE__ */ u.jsxs("div", { style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }, children: [
      /* @__PURE__ */ u.jsx("div", { style: {
        color: l ? "#4ecdc4" : "#888",
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 8
      }, children: "나" }),
      /* @__PURE__ */ u.jsx("div", { style: { display: "flex", gap: 4 }, children: Ud.map((c, h) => /* @__PURE__ */ u.jsx(
        Ge,
        {
          cardId: c,
          isRevealed: n,
          isHighlighted: r.includes(c),
          delay: 0.1 + h * 0.1,
          cards: e
        },
        h
      )) }),
      /* @__PURE__ */ u.jsx("div", { style: { height: 24, marginTop: 8 }, children: l && /* @__PURE__ */ u.jsx(
        S.div,
        {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          style: {
            color: "#4ecdc4",
            fontSize: 16,
            fontWeight: "bold"
          },
          children: "포카드!"
        }
      ) })
    ] })
  ] }) }) : /* @__PURE__ */ u.jsx("div", { style: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 400,
    color: "#888"
  }, children: "Loading..." });
}
class ge {
  constructor(e, n = {}) {
    this.container = e, this.step = 0, this.totalSteps = 9, this.root = Ae(e), this.listeners = [], this._render();
  }
  _render() {
    this.root.render(/* @__PURE__ */ u.jsx(kd, { step: this.step }));
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
    return new ge(e, n);
  }
}
class xe {
  constructor(e, n = {}) {
    this.container = e, this.step = 0, this.totalSteps = $d, this.root = Ae(e), this.listeners = [], this._render();
  }
  _render() {
    this.root.render(/* @__PURE__ */ u.jsx(zd, { step: this.step }));
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
    return new xe(e, n);
  }
}
class ve {
  /**
   * @param {HTMLElement} container
   * @param {Object} options
   * @param {Object} [options.scenario] - 시나리오 객체 직접 전달
   * @param {string} [options.phh] - PHH 문자열
   */
  constructor(e, n = {}) {
    this.container = e, this.gameState = new xr(n), this.root = Ae(e), this.unsubscribe = this.gameState.subscribe(() => {
      this._render();
    }), this._render();
  }
  _render() {
    this.root.render(/* @__PURE__ */ u.jsx(jd, { gameState: this.gameState }));
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
  /**
   * 새 시나리오 로드
   * @param {Object} options - { scenario: {...} } 또는 { phh: "..." }
   */
  loadScenario(e) {
    this.gameState.loadScenario(e);
  }
  getState() {
    return this.gameState.getState();
  }
  destroy() {
    this.unsubscribe(), this.root.unmount();
  }
  // Static mount for convenience
  static mount(e, n = {}) {
    return new ve(e, n);
  }
  // parsePHH 유틸리티 노출
  static parsePHH = Ye;
}
const Xd = 7;
class be {
  constructor(e, n = {}) {
    this.container = e, this.step = 0, this.totalSteps = Xd, this.root = Ae(e), this.listeners = [], this._render();
  }
  _render() {
    this.root.render(/* @__PURE__ */ u.jsx(Yd, { step: this.step }));
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
    return new be(e, n);
  }
}
const Zd = {
  HoldemEngine: ve,
  DeckEngine: ge,
  HandRankingEngine: xe,
  HoldemIntroEngine: be,
  // Convenience shortcuts
  mount: ve.mount,
  mountDeck: ge.mount,
  mountHandRanking: xe.mount,
  mountHoldemIntro: be.mount
};
export {
  Zd as default
};
