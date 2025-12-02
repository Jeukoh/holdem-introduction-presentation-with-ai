import { createRoot } from 'react-dom/client';
import { GameState } from './engine/GameState';
import { parsePHH } from './phhParser';
import HoldemTable from './components/HoldemTable';
import DeckDisplay from './components/DeckDisplay';
import HandRankingDisplay, { HAND_RANKING_TOTAL_STEPS } from './components/HandRankingDisplay';
import HoldemIntroDisplay from './components/HoldemIntroDisplay';
import './styles.css';

// ===========================================
// DECK ENGINE - 52 Cards Animation (Slide 2.1.1)
// ===========================================

class DeckEngine {
    constructor(container, options = {}) {
        this.container = container;
        this.step = 0;
        this.totalSteps = 9; // 0-8 (added wave animation at step 7)
        this.root = createRoot(container);
        this.listeners = [];

        this._render();
    }

    _render() {
        this.root.render(<DeckDisplay step={this.step} />);
    }

    _notify() {
        this.listeners.forEach(fn => fn(this.getState()));
    }

    subscribe(fn) {
        this.listeners.push(fn);
        return () => {
            this.listeners = this.listeners.filter(l => l !== fn);
        };
    }

    nextStep() {
        if (this.step < this.totalSteps - 1) {
            this.step++;
            this._render();
            this._notify();
            return true;
        }
        return false;
    }

    prevStep() {
        if (this.step > 0) {
            this.step--;
            this._render();
            this._notify();
            return true;
        }
        return false;
    }

    goToStep(n) {
        if (n >= 0 && n < this.totalSteps) {
            this.step = n;
            this._render();
            this._notify();
        }
    }

    reset() {
        this.step = 0;
        this._render();
        this._notify();
    }

    getState() {
        return {
            step: this.step,
            totalSteps: this.totalSteps,
        };
    }

    destroy() {
        this.root.unmount();
    }

    static mount(container, options = {}) {
        return new DeckEngine(container, options);
    }
}

// ===========================================
// HAND RANKING ENGINE - Poker Hands Education (Slide 2.1.2)
// ===========================================

class HandRankingEngine {
    constructor(container, options = {}) {
        this.container = container;
        this.step = 0;
        this.totalSteps = HAND_RANKING_TOTAL_STEPS;
        this.root = createRoot(container);
        this.listeners = [];

        this._render();
    }

    _render() {
        this.root.render(<HandRankingDisplay step={this.step} />);
    }

    _notify() {
        this.listeners.forEach(fn => fn(this.getState()));
    }

    subscribe(fn) {
        this.listeners.push(fn);
        return () => {
            this.listeners = this.listeners.filter(l => l !== fn);
        };
    }

    nextStep() {
        if (this.step < this.totalSteps - 1) {
            this.step++;
            this._render();
            this._notify();
            return true;
        }
        return false;
    }

    prevStep() {
        if (this.step > 0) {
            this.step--;
            this._render();
            this._notify();
            return true;
        }
        return false;
    }

    goToStep(n) {
        if (n >= 0 && n < this.totalSteps) {
            this.step = n;
            this._render();
            this._notify();
        }
    }

    reset() {
        this.step = 0;
        this._render();
        this._notify();
    }

    getState() {
        return {
            step: this.step,
            totalSteps: this.totalSteps,
        };
    }

    destroy() {
        this.root.unmount();
    }

    static mount(container, options = {}) {
        return new HandRankingEngine(container, options);
    }
}

// ===========================================
// HOLDEM ENGINE - Native API for Reveal.js
// ===========================================

class HoldemEngine {
    /**
     * @param {HTMLElement} container
     * @param {Object} options
     * @param {Object} [options.scenario] - 시나리오 객체 직접 전달
     * @param {string} [options.phh] - PHH 문자열
     */
    constructor(container, options = {}) {
        this.container = container;
        this.gameState = new GameState(options);
        this.root = createRoot(container);

        // 상태 변화시 리렌더
        this.unsubscribe = this.gameState.subscribe(() => {
            this._render();
        });

        // 초기 렌더
        this._render();
    }

    _render() {
        this.root.render(<HoldemTable gameState={this.gameState} />);
    }

    // Public API
    nextStep() {
        return this.gameState.nextStep();
    }

    prevStep() {
        return this.gameState.prevStep();
    }

    goToStep(n) {
        return this.gameState.goToStep(n);
    }

    reset() {
        this.gameState.reset();
    }

    /**
     * 새 시나리오 로드
     * @param {Object} options - { scenario: {...} } 또는 { phh: "..." }
     */
    loadScenario(options) {
        this.gameState.loadScenario(options);
    }

    getState() {
        return this.gameState.getState();
    }

    destroy() {
        this.unsubscribe();
        this.root.unmount();
    }

    // Static mount for convenience
    static mount(container, options = {}) {
        return new HoldemEngine(container, options);
    }

    // parsePHH 유틸리티 노출
    static parsePHH = parsePHH;
}

// ===========================================
// HOLDEM INTRO ENGINE - 7장 중 5장 설명 (Slide 2.1.3)
// ===========================================

const HOLDEM_INTRO_TOTAL_STEPS = 7; // 0-6

class HoldemIntroEngine {
    constructor(container, options = {}) {
        this.container = container;
        this.step = 0;
        this.totalSteps = HOLDEM_INTRO_TOTAL_STEPS;
        this.root = createRoot(container);
        this.listeners = [];

        this._render();
    }

    _render() {
        this.root.render(<HoldemIntroDisplay step={this.step} />);
    }

    _notify() {
        this.listeners.forEach(fn => fn(this.getState()));
    }

    subscribe(fn) {
        this.listeners.push(fn);
        return () => {
            this.listeners = this.listeners.filter(l => l !== fn);
        };
    }

    nextStep() {
        if (this.step < this.totalSteps - 1) {
            this.step++;
            this._render();
            this._notify();
            return true;
        }
        return false;
    }

    prevStep() {
        if (this.step > 0) {
            this.step--;
            this._render();
            this._notify();
            return true;
        }
        return false;
    }

    goToStep(n) {
        if (n >= 0 && n < this.totalSteps) {
            this.step = n;
            this._render();
            this._notify();
        }
    }

    reset() {
        this.step = 0;
        this._render();
        this._notify();
    }

    getState() {
        return {
            step: this.step,
            totalSteps: this.totalSteps,
        };
    }

    destroy() {
        this.root.unmount();
    }

    static mount(container, options = {}) {
        return new HoldemIntroEngine(container, options);
    }
}

// Export object containing all engines for IIFE compatibility
const HoldemEngines = {
    HoldemEngine,
    DeckEngine,
    HandRankingEngine,
    HoldemIntroEngine,
    // Convenience shortcuts
    mount: HoldemEngine.mount,
    mountDeck: DeckEngine.mount,
    mountHandRanking: HandRankingEngine.mount,
    mountHoldemIntro: HoldemIntroEngine.mount,
};

export default HoldemEngines;
