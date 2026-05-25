// src/RepeaterManager.js

'use strict';

/**
 * RepeaterManager - Handles dynamic repeatable field groups
 * Zero dependencies, O(1) add/remove, nested repeater support
 * 
 * This class is instantiated once per Formique instance.
 * It manages all repeater field types for that form.
 */
class RepeaterManager {
    /**
     * @param {Formique} formique - Reference to the parent Formique instance
     */
    constructor(formique) {
        this.formique = formique;
        
        // In-memory blueprint registry (fast lookup, no DOM parsing)
        // Map<repeaterName, { blueprint, minRows, maxRows, addLabel, removeLabel }>
        this.blueprints = new Map();
        
        // Global unique counter for collision-free row indices
        this.rowCounter = 0;
        
        // Track active repeaters for state management
        this.activeRepeaters = new Set();
    }
    
    /**
     * Register a repeater configuration from schema
     * Called during form rendering
     * 
     * @param {string} name - Repeater field name
     * @param {Object} config - Configuration object
     * @param {Array} config.blueprint - Normalized field blueprint array
     * @param {number} config.minRows - Minimum required rows
     * @param {number} config.maxRows - Maximum allowed rows
     * @param {string} config.addLabel - Text for add button
     * @param {string} config.removeLabel - Text for remove button
     */
    register(name, config) {
        this.blueprints.set(name, {
            blueprint: config.blueprint,
            minRows: config.minRows || 0,
            maxRows: config.maxRows || Infinity,
            addLabel: config.addLabel || '+ Add',
            removeLabel: config.removeLabel || '×'
        });
        
        this.activeRepeaters.add(name);
    }
    
    /**
     * Generate a unique, collision-proof row index
     * Uses timestamp + incrementing counter to prevent same-millisecond collisions
     * 
     * @returns {string} Unique index string
     */
    generateIndex() {
        return `${Date.now()}_${this.rowCounter++}`;
    }
    
    /**
     * Render the initial HTML for a repeater including minimum rows
     * 
     * @param {string} name - Repeater field name
     * @returns {string} HTML string
     */
    renderInitial(name) {
        const config = this.blueprints.get(name);
        if (!config) {
            console.error(`RepeaterManager: No blueprint registered for "${name}"`);
            return '';
        }
        
        let html = '';
        
        // Opening container with data attributes
        html += `<div class="formique-repeater" data-repeater="${name}" data-min="${config.minRows}" data-max="${config.maxRows === Infinity ? '' : config.maxRows}">`;
        
        // Render minimum required rows
        for (let i = 0; i < config.minRows; i++) {
            const index = this.generateIndex();
            html += this._renderRow(name, index);
        }
        
        // Closing container
        html += `</div>`;
        
        // Add button
        html += `<button type="button" class="formique-repeater-add" data-repeater="${name}">${config.addLabel}</button>`;
        
        return html;
    }
    
    /**
     * Add a new row to an existing repeater
     * Called from event delegation or programmatically
     * 
     * @param {string} name - Repeater field name
     * @param {Object} prepopulatedData - Optional data to prefill fields
     * @returns {HTMLElement|null} The created row element or null if failed
     */
    addRow(name, prepopulatedData = {}) {
        const config = this.blueprints.get(name);
        if (!config) {
            console.error(`RepeaterManager: No blueprint for "${name}"`);
            return null;
        }
        
        const formElement = document.getElementById(this.formique.formId);
        if (!formElement) {
            console.error('RepeaterManager: Form element not found');
            return null;
        }
        
        const container = formElement.querySelector(`[data-repeater="${name}"]`);
        if (!container) {
            console.error(`RepeaterManager: Container not found for "${name}"`);
            return null;
        }
        
        const currentRows = container.querySelectorAll(':scope > .formique-repeater-row').length;
        if (currentRows >= config.maxRows) {
            console.warn(`RepeaterManager: Max rows (${config.maxRows}) reached for "${name}"`);
            return null;
        }
        
        const index = this.generateIndex();
        const rowHtml = this._renderRow(name, index, prepopulatedData);
        
        const temp = document.createElement('div');
        temp.innerHTML = rowHtml;
        const rowElement = temp.firstElementChild;
        
        container.appendChild(rowElement);
        this._updateButtonStates(name);
        
        return rowElement;
    }
    
    /**
     * Remove a row from a repeater
     * 
     * @param {HTMLElement} rowElement - The row element to remove
     * @returns {boolean} True if row was removed
     */
    removeRow(rowElement) {
        const container = rowElement.parentElement;
        const repeaterName = container.dataset.repeater;
        
        if (!repeaterName) return false;
        
        const config = this.blueprints.get(repeaterName);
        if (!config) return false;
        
        // Check minimum rows
        const currentRows = container.querySelectorAll(':scope > .formique-repeater-row').length;
        if (currentRows <= config.minRows) {
            console.warn(`RepeaterManager: Cannot remove below minimum rows (${config.minRows}) for "${repeaterName}"`);
            return false;
        }
        
        // Remove the row (no re-indexing needed)
        rowElement.remove();
        
        // Update button states
        this._updateButtonStates(repeaterName);
        
        return true;
    }
    
    /**
     * Update add/remove button visibility based on current row count
     * 
     * @param {string} name - Repeater field name
     */
    _updateButtonStates(name) {
        const config = this.blueprints.get(name);
        if (!config) return;
        
        const formElement = document.getElementById(this.formique.formId);
        if (!formElement) return;
        
        const container = formElement.querySelector(`[data-repeater="${name}"]`);
        if (!container) return;
        
        const currentRows = container.querySelectorAll(':scope > .formique-repeater-row').length;
        
        // Find add button by its data attribute
        const addButton = formElement.querySelector(`.formique-repeater-add[data-repeater="${name}"]`);
        if (addButton) {
            addButton.style.display = currentRows >= config.maxRows ? 'none' : '';
        }
        
        // Update remove button visibility on each row
        container.querySelectorAll(':scope > .formique-repeater-row').forEach(row => {
            const removeBtn = row.querySelector('.formique-repeater-remove');
            if (removeBtn) {
                removeBtn.style.display = currentRows <= config.minRows ? 'none' : '';
            }
        });
    }
    
    /**
     * Render a single repeater row
     * 
     * @param {string} name - Repeater field name
     * @param {string} index - Unique row index
     * @param {Object} data - Prepopulated data
     * @returns {string} HTML string for the row
     */
    _renderRow(name, index, data = {}) {
    const config = this.blueprints.get(name);
    if (!config) return '';
    
    // Build path context
    let currentPath;
    const container = document.querySelector(`[data-repeater="${name}"]`);
    const pathContext = container ? container.dataset.pathContext : '';
    
    if (pathContext) {
        currentPath = `${pathContext}[${name}][${index}]`;
    } else {
        currentPath = `${name}[${index}]`;
    }
    
    let html = '';
    
    html += `<div class="formique-repeater-row" data-repeater-row data-row-index="${index}">`;
    html += `<div class="formique-repeater-row-header">`;
    html += `<span>Row</span>`;
    html += `<button type="button" class="formique-repeater-remove" data-action="remove-row">${config.removeLabel}</button>`;
    html += `</div>`;
    html += `<div class="formique-repeater-row-content">`;
    
    config.blueprint.forEach(fieldDef => {
        const [type, fieldName, label, validate = {}, attributes = {}, ...rest] = fieldDef;
        
        if (type === 'repeater') {
            const nestedName = `${name}_${index}_${fieldName}`;
            html += this._renderNestedRepeater(type, fieldName, label, validate, attributes, rest, currentPath, nestedName);
        } else {
            const resolvedName = `${currentPath}[${fieldName}]`;
            const value = data[fieldName] || attributes.value || '';
            const id = attributes.id || resolvedName.replace(/[\[\]]/g, '-');
            
            // Render field directly instead of calling formique.renderField
            html += `<div class="input-block">`;
            html += `<label for="${id}">${label}</label>`;
            html += this._renderStandardField(type, resolvedName, id, label, validate, attributes, value, rest);
            html += `</div>`;
        }
    });
    
    html += `</div>`;
    html += `</div>`;
    
    return html;
}

/**
 * Render a standard (non-repeater) field and return its HTML string
 */
_renderStandardField(type, name, id, label, validate, attributes, value, rest) {
    const placeholder = attributes.placeholder || '';
    const required = validate.required ? 'required' : '';
    const inputClass = 'form-input';
    const selectClass = 'form-select';
    
    switch (type) {
        case 'text':
        case 'email':
        case 'number':
        case 'password':
        case 'tel':
        case 'date':
        case 'time':
        case 'datetime-local':
        case 'month':
        case 'week':
        case 'url':
        case 'search':
        case 'color':
            return `<input type="${type}" 
                          name="${name}" 
                          id="${id}" 
                          class="${inputClass}" 
                          placeholder="${placeholder}" 
                          value="${value}" 
                          ${required} />`;
        
        case 'textarea':
            const rows = attributes.rows || '4';
            const cols = attributes.cols || '50';
            return `<textarea name="${name}" 
                            id="${id}" 
                            class="${inputClass}" 
                            rows="${rows}" 
                            cols="${cols}" 
                            placeholder="${placeholder}" 
                            ${required}>${value}</textarea>`;
        
        case 'file':
            return `<input type="file" 
                          name="${name}" 
                          id="${id}" 
                          class="${inputClass}" 
                          ${required} />`;
        
        case 'singleSelect':
        case 'multipleSelect':
            const options = rest[0] || [];
            const multiple = type === 'multipleSelect' ? 'multiple' : '';
            let selectHtml = `<select name="${name}" 
                                     id="${id}" 
                                     class="${selectClass}" 
                                     ${multiple} 
                                     ${required}>`;
            options.forEach(opt => {
                const selected = opt.selected ? 'selected' : '';
                selectHtml += `<option value="${opt.value}" ${selected}>${opt.label}</option>`;
            });
            selectHtml += `</select>`;
            return selectHtml;
        
        case 'checkbox':
        case 'radio':
            const optionItems = rest[0] || [];
            let groupHtml = `<div class="${type}-group">`;
            optionItems.forEach((opt, i) => {
                const checked = opt.selected ? 'checked' : '';
                const itemId = `${id}_${i}`;
                groupHtml += `<label for="${itemId}">`;
                groupHtml += `<input type="${type}" 
                                     name="${name}" 
                                     id="${itemId}" 
                                     value="${opt.value}" 
                                     ${checked} /> ${opt.label}`;
                groupHtml += `</label>`;
            });
            groupHtml += `</div>`;
            return groupHtml;
        
        case 'hidden':
            return `<input type="hidden" name="${name}" value="${value}" />`;
        
        case 'range':
            const min = attributes.min || '0';
            const max = attributes.max || '100';
            const step = attributes.step || '1';
            return `<input type="range" 
                          name="${name}" 
                          id="${id}" 
                          class="${inputClass}" 
                          min="${min}" 
                          max="${max}" 
                          step="${step}" 
                          value="${value}" />`;
        
        default:
            return `<input type="text" 
                          name="${name}" 
                          id="${id}" 
                          class="${inputClass}" 
                          placeholder="${placeholder}" 
                          value="${value}" 
                          ${required} />`;
    }
}



    /**
     * Render a nested repeater within a row
     * 
     * @param {string} type - Field type (always 'repeater')
     * @param {string} name - Nested repeater name
     * @param {string} label - Display label
     * @param {Object} validate - Validation rules
     * @param {Object} attributes - Repeater config attributes
     * @param {Array} rest - Remaining positional arguments
     * @param {string} parentPath - Parent path context
     * @param {string} nestedName - Unique nested repeater identifier
     * @returns {string} HTML string
     */
    _renderNestedRepeater(type, name, label, validate, attributes, rest, parentPath, nestedName) {
    // Extract nested blueprint from rest[0] (the 6th slot)
    const nestedBlueprint = rest[0] || [];
    
    // Normalize nested blueprint
    const normalizedBlueprint = this.formique._normalizeBlueprint(nestedBlueprint);
    
    // Register nested repeater with the SAME name as the parent path + field name
    // This ensures the field names include the full path
    this.register(nestedName, {
        blueprint: normalizedBlueprint,
        minRows: attributes.minRows || 0,
        maxRows: attributes.maxRows || Infinity,
        addLabel: attributes.addButtonText || '+ Add',
        removeLabel: attributes.removeButtonText || '×'
    });
    
    let html = `<div class="input-block">`;
    html += `<label>${label}</label>`;
    
    // Nested container with path context set to parentPath
    html += `<div class="formique-repeater formique-repeater-nested" 
                   data-repeater="${nestedName}" 
                   data-path-context="${parentPath}" 
                   data-min="${attributes.minRows || 0}" 
                   data-max="${attributes.maxRows || Infinity === Infinity ? '' : attributes.maxRows}">`;
    
    // Render minimum rows for nested repeater
    const nestedConfig = this.blueprints.get(nestedName);
    if (nestedConfig) {
        for (let i = 0; i < nestedConfig.minRows; i++) {
            const nestedIndex = this.generateIndex();
            html += this._renderRow(nestedName, nestedIndex);
        }
    }
    
    html += `</div>`;
    html += `<button type="button" class="formique-repeater-add" data-repeater="${nestedName}">${attributes.addButtonText || '+ Add'}</button>`;
    html += `</div>`;
    
    return html;
}


    /**
     * Compact repeater arrays on form submission
     * Handles infinite nesting via tokenizer approach
     * 
     * @param {Object} formData - Raw form data
     * @returns {Object} Compacted form data with clean arrays
     */
    compactArrays(formData) {
    const result = {};
    
    for (const [key, value] of Object.entries(formData)) {
        const parts = key.replace(/\]/g, '').split(/\[/);
        
        if (parts.length === 1) {
            result[parts[0]] = (value === '' || value === null || value === undefined) ? null : value;
            continue;
        }
        
        let current = result;
        
        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            const isLastPart = (i === parts.length - 1);
            
            if (isLastPart) {
                current[part] = (value === '' || value === null || value === undefined) ? null : value;
            } else {
                if (!current[part]) {
                    current[part] = {};
                }
                current = current[part];
            }
        }
    }
    
    // Clean up nested repeater keys: strip parent prefix
    // "product_variants_123_0_images" -> "images"
    const cleanNestedKeys = (obj) => {
        if (typeof obj !== 'object' || obj === null) return obj;
        
        if (Array.isArray(obj)) {
            return obj.map(item => cleanNestedKeys(item));
        }
        
        const cleaned = {};
        for (const key in obj) {
            // Check if key matches pattern: parentName_index_subIndex_childName
            // e.g., "product_variants_1779685708994_0_images"
            const match = key.match(/^(.+)_(\d+_\d+)_(.+)$/);
            if (match) {
                const cleanKey = match[3]; // Use only the child name
                cleaned[cleanKey] = cleanNestedKeys(obj[key]);
            } else {
                cleaned[key] = cleanNestedKeys(obj[key]);
            }
        }
        return cleaned;
    };
    
    // Clean nested keys first
    const cleanedResult = cleanNestedKeys(result);
    
    // Convert objects with index keys to arrays
    const convertToArrays = (obj) => {
        if (typeof obj !== 'object' || obj === null) return obj;
        
        if (Array.isArray(obj)) {
            return obj.map(item => convertToArrays(item));
        }
        
        const keys = Object.keys(obj);
        const allKeysAreIndices = keys.length > 0 && keys.every(k => /^\d+_\d+$/.test(k));
        
        if (allKeysAreIndices) {
            const sortedKeys = keys.sort((a, b) => {
                const aCounter = parseInt(a.split('_')[1]);
                const bCounter = parseInt(b.split('_')[1]);
                return aCounter - bCounter;
            });
            return sortedKeys.map(k => convertToArrays(obj[k]));
        }
        
        const converted = {};
        for (const k in obj) {
            converted[k] = convertToArrays(obj[k]);
        }
        return converted;
    };
    
    return convertToArrays(cleanedResult);
}


    /**
     * Destroy all repeaters and clean up
     */
    destroy() {
        this.blueprints.clear();
        this.activeRepeaters.clear();
        this.rowCounter = 0;
    }
}

export default RepeaterManager;