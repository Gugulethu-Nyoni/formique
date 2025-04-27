let currentEffect = null;

export class PulseCore {
    constructor(value) {
        this._value = value;
        this._dependents = new Set();
    }

    get value() {
        if (currentEffect) {
            this._dependents.add(currentEffect);
        }
        return this._value;
    }

    set value(newValue) {
        if (this._value !== newValue) {
            this._value = newValue;
            const deps = new Set(this._dependents);
            this._dependents.clear();
            deps.forEach(effect => effect());
        }
    }
}

export function getCurrentEffect() {
    return currentEffect;
}

export function setCurrentEffect(effect) {
    currentEffect = effect;
}