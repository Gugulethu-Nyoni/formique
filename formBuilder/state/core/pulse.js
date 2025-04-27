// pulse.js
import { PulseCore } from './PulseCore.js';

export function pulse(initialValue) {
    const signal = new PulseCore(initialValue);
    
    return new Proxy(signal, {
        get(target, prop) {
            if (prop === 'value') return target.value;
            if (prop === 'set') return (newValue) => { target.value = newValue; };
            return Reflect.get(target, prop);
        },
        set(target, prop, value) {
            if (prop === 'value') {
                target.value = value;
                return true;
            }
            return Reflect.set(target, prop, value);
        }
    });
}

export const $state = pulse;