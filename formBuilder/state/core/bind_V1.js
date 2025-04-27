import { $effect } from './effect.js';

export function bind(inputSelectorOrElement, state, options = {}) {
    const element = typeof inputSelectorOrElement === 'string' 
        ? document.querySelector(inputSelectorOrElement) 
        : inputSelectorOrElement;
    
    if (!element) {
        console.warn(`Element not found for binding: ${inputSelectorOrElement}`);
        return;
    }

    // State to element binding
    const updateElement = () => {
        const value = state.value;
        if (element.type === 'checkbox') {
            element.checked = !!value;
        } else if (element.type === 'radio') {
            element.checked = (element.value === value);
        } else if (element.tagName === 'SELECT' || element.type === 'select-one' || element.type === 'select-multiple') {
            if (options.multiple && Array.isArray(value)) {
                Array.from(element.options).forEach(option => {
                    option.selected = value.includes(option.value);
                });
            } else {
                element.value = value;
            }
        } else {
            element.value = value;
        }
        
        if (options.format) {
            element.value = options.format(value);
        }
    };

    // Element to state binding
    const updateState = (event) => {
        let newValue;
        
        if (element.type === 'checkbox') {
            newValue = element.checked;
        } else if (element.type === 'radio') {
            if (element.checked) {
                newValue = element.value;
            }
        } else if (element.tagName === 'SELECT' && options.multiple) {
            newValue = Array.from(element.selectedOptions).map(option => option.value);
        } else {
            newValue = element.value;
        }
        
        if (options.parse) {
            newValue = options.parse(newValue);
        }
        
        state.value = newValue;
    };

    // Set up event listeners based on element type
    const eventType = getEventType(element);
    element.addEventListener(eventType, updateState);
    
    // Initial sync and reactive updates
    updateElement();
    const cleanupEffect = $effect(updateElement);
    
    // Return cleanup function
    return () => {
        element.removeEventListener(eventType, updateState);
        cleanupEffect();
    };
}

function getEventType(element) {
    if (element.type === 'checkbox' || element.type === 'radio') {
        return 'change';
    }
    if (element.tagName === 'SELECT') {
        return 'change';
    }
    if (element.tagName === 'INPUT' && (element.type === 'range' || element.type === 'file')) {
        return 'change';
    }
    return 'input';
}

// Bind text content of non-input elements
export function bindText(selectorOrElement, state, options = {}) {
    const element = typeof selectorOrElement === 'string' 
        ? document.querySelector(selectorOrElement) 
        : selectorOrElement;
    
    if (!element) {
        console.warn(`Element not found for text binding: ${selectorOrElement}`);
        return;
    }

    const updateElement = () => {
        const value = state.value;
        element.textContent = options.format ? options.format(value) : value;
    };

    updateElement();
    const cleanupEffect = $effect(updateElement);
    
    return () => {
        cleanupEffect();
    };
}

// Bind any attribute
export function bindAttr(selectorOrElement, attrName, state, options = {}) {
    const element = typeof selectorOrElement === 'string' 
        ? document.querySelector(selectorOrElement) 
        : selectorOrElement;
    
    if (!element) {
        console.warn(`Element not found for attribute binding: ${selectorOrElement}`);
        return;
    }

    const updateElement = () => {
        const value = state.value;
        element.setAttribute(attrName, options.format ? options.format(value) : value);
    };

    updateElement();
    const cleanupEffect = $effect(updateElement);
    
    return () => {
        cleanupEffect();
    };
}

// Bind class names
export function bindClass(selectorOrElement, className, state, options = {}) {
    const element = typeof selectorOrElement === 'string' 
        ? document.querySelector(selectorOrElement) 
        : selectorOrElement;
    
    if (!element) {
        console.warn(`Element not found for class binding: ${selectorOrElement}`);
        return;
    }

    const updateElement = () => {
        const value = state.value;
        if (value) {
            element.classList.add(className);
        } else {
            element.classList.remove(className);
        }
    };

    updateElement();
    const cleanupEffect = $effect(updateElement);
    
    return () => {
        cleanupEffect();
    };
}