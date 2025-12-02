import { createRoot } from 'react-dom/client';
import { GameState, scenarios } from './engine/GameState';
import HoldemTable from './components/HoldemTable';
import './styles.css';

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

// Single default export for IIFE compatibility
export default HoldemEngine;
