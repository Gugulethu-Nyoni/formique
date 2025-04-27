import { $effect } from './effect.js';

export function bind(inputSelectorOrElement, state, options = {}) {
    const elements = getElements(inputSelectorOrElement);
    
    if (!elements || elements.length === 0) {
        console.warn(`Element(s) not found for binding: ${inputSelectorOrElement}`);
        return;
    }

    // Special handling for radio buttons
    if (elements[0].type === 'radio') {
        return bindRadioGroup(elements, state, options);
    }

    // Normal binding for other elements
    return bindStandardElement(elements[0], state, options);
}

function bindStandardElement(element, state, options) {
    // State to element binding
    const updateElement = () => {
        const value = state.value;
        if (element.type === 'checkbox') {
            element.checked = !!value;
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

function bindRadioGroup(radioButtons, state, options) {
    // State to radio buttons binding
    const updateRadios = () => {
        const value = state.value;
        radioButtons.forEach(radio => {
            radio.checked = (radio.value === value);
        });
    };

    // Radio buttons to state binding
    const updateState = (event) => {
        const selectedRadio = event.target;
        if (selectedRadio.checked) {
            const newValue = options.parse 
                ? options.parse(selectedRadio.value) 
                : selectedRadio.value;
            state.value = newValue;
        }
    };

    // Set up event listeners
    radioButtons.forEach(radio => {
        radio.addEventListener('change', updateState);
    });
    
    // Initial sync and reactive updates
    updateRadios();
    const cleanupEffect = $effect(updateRadios);
    
    // Return cleanup function
    return () => {
        radioButtons.forEach(radio => {
            radio.removeEventListener('change', updateState);
        });
        cleanupEffect();
    };
}

function getElements(selectorOrElement) {
    if (typeof selectorOrElement === 'string') {
        const elements = document.querySelectorAll(selectorOrElement);
        return elements.length > 0 ? Array.from(elements) : null;
    }
    return [selectorOrElement];
}

function getEventType(element) {
    if (element.type === 'checkbox') {
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
// [Rest of the file remains the same - bindText, bindAttr, bindClass]