import { createRoot } from 'react-dom/client';
import { GameState, scenarios } from './engine/GameState';
import HoldemTable from './components/HoldemTable';
import DeckDisplay from './components/DeckDisplay';
import HandRankingDisplay, { HAND_RANKING_TOTAL_STEPS } from './components/HandRankingDisplay';
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
    constructor(container, options = {}) {
        this.container = container;
        this.gameState = new GameState(options.scenario || 'tutorial');
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

    setScenario(scenarioKey) {
        this.gameState.setScenario(scenarioKey);
    }

    getState() {
        return this.gameState.getState();
    }

    destroy() {
        this.unsubscribe();
        this.root.unmount();
    }

    // Static methods
    static getScenarios() {
        return GameState.getScenarios();
    }

    // Static mount for convenience
    static mount(container, options = {}) {
        return new HoldemEngine(container, options);
    }
}

// Export object containing all engines for IIFE compatibility
const HoldemEngines = {
    HoldemEngine,
    DeckEngine,
    HandRankingEngine,
    // Convenience shortcuts
    mount: HoldemEngine.mount,
    mountDeck: DeckEngine.mount,
    mountHandRanking: HandRankingEngine.mount,
};

export default HoldemEngines;
