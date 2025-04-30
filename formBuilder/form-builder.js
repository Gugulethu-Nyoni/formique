import { $state, bind, bindText, bindAttr, $effect } from './state/core/index.js';
//import { fieldDefinitions, getFieldTypeOptions } from './fieldDefinitions.js';


import { 
  fieldDefinitions, 
  getFieldTypeOptions,
  globalValidations,
  globalAttributes  
} from './fieldDefinitions.js';



// Initialize when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
  // State for the form schema
  const formSchema = $state([]);
  

  // Add this at the top with your other state declarations
const accordionStates = $state({});

// Add this in your DOMContentLoaded handler
document.addEventListener('click', (e) => {
  const header = e.target.closest('.accordion-header');
  if (!header) return;
  
  const accordion = header.closest('.accordion');
  if (!accordion) return;
  
  // Don't handle clicks on interactive elements
  if (e.target.closest('input, select, button, [contenteditable]')) {
    return;
  }
  
  const fieldId = accordion.id.split('-')[1];
  const accordionType = accordion.id.split('-')[3];
  
  // Ensure the field exists in accordionStates
  if (!accordionStates.value[fieldId]) {
    accordionStates.value = {
      ...accordionStates.value,
      [fieldId]: {
        options: false,
        validations: false,
        attributes: false,
        conditionality: false
      }
    };
  }
  
  // Get current state (default to false if not set)
  const currentState = accordionStates.value[fieldId][accordionType] || false;
  const newState = !currentState;
  
  // Update state
  accordionStates.value = {
    ...accordionStates.value,
    [fieldId]: {
      ...accordionStates.value[fieldId],
      [accordionType]: newState
    }
  };
  
  // Update UI
  const content = header.nextElementSibling;
  const icon = header.querySelector('.accordion-icon');
  
  content.classList.toggle('hidden');
  icon.textContent = newState ? '▲' : '▼';
});

  // State for the currently selected field in canvas
  const selectedField = $state(null);

  // Initialize toolbox
  const fieldTypeOptions = getFieldTypeOptions();
  const toolbox = document.getElementById('field-toolbox');

  // Create draggable field elements
  fieldTypeOptions.forEach(option => {
    const fieldPreview = document.createElement('div');
    fieldPreview.className = 'field-preview';
    fieldPreview.textContent = option.label;
    fieldPreview.dataset.type = option.value;
    fieldPreview.draggable = true;
    
    fieldPreview.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', option.value);
    });
    
    toolbox.appendChild(fieldPreview);
  });

  // Canvas drop zone setup
  const canvas = document.getElementById('form-canvas');
  canvas.addEventListener('dragover', (e) => {
    e.preventDefault();
    canvas.style.backgroundColor = '#f0f0f0';
  });

  canvas.addEventListener('dragleave', () => {
    canvas.style.backgroundColor = '';
  });

  canvas.addEventListener('drop', (e) => {
    e.preventDefault();
    canvas.style.backgroundColor = '';
    const fieldType = e.dataTransfer.getData('text/plain');
    addFieldToCanvas(fieldType);
  });

  // Add field to canvas function
 const addFieldToCanvas = (type) => {

  const fieldId = `field-${Date.now()}`;


// Initialize its accordionStates
  accordionStates.value = {
    ...accordionStates.value,
    [fieldId]: {
      attributes: false,
      conditionality: false,
      validations: false
    }
  };


/*
 // Initialize accordion state for this field
  accordionStates.value = {
    ...accordionStates.value,
    [fieldId]: {
      options: false,
      validations: false,
      attributes: false,
      conditionality: false
    }
  };
*/

  const definition = fieldDefinitions[type];
  
  // Initialize with global defaults first
  const defaultAttributes = {
    // Global boolean attributes
    required: { active: false, type: 'boolean', value: true },
    disabled: { active: false, type: 'boolean', value: true },
    readonly: { active: false, type: 'boolean', value: true },
    autofocus: { active: false, type: 'boolean', value: true },
    checked: { active: false, type: 'boolean', value: true },

    
    // Global value attributes
    id: { active: false, type: 'text', value: '' },
    class: { active: false, type: 'text', value: '' },
    style: { active: false, type: 'text', value: '' },

    // Conditional fields attributes
    dependsOn: { active: false, type: 'text', value: '' },
    condition: { active: false, type: 'text', value: '' },
    dependents: { active: false, type: 'text', value: '' }



  };

  // Add field-specific attributes
  definition.validations?.forEach(v => {
    if (!defaultAttributes[v]) {
      defaultAttributes[v] = { 
        active: false, 
        type: ['minLength', 'maxLength', 'min', 'max'].includes(v) ? 'number' : 'text',
        value: ''
      };
    }
  });
  
  definition.attributes?.forEach(a => {
    if (!defaultAttributes[a]) {
      defaultAttributes[a] = { 
        active: false, 
        type: 'text',
        value: '' 
      };
    }
  });
  
   const newField = {
    id: fieldId,
    type,
    name: `${type}-${Date.now()}`,
    label: definition.label,
    // Add reactive tracking for the name
    get reactiveName() { return this.name; },
    get reactiveLabel() { return this.label; },
    attributes: defaultAttributes,
    choices: definition.hasOptions ? [{ value: '', label: '' }] : undefined
  };
  
  formSchema.value = [...formSchema.value, newField];
  renderField(newField);
};



const getReactiveFieldOptions = (currentFieldId) => {
  return $effect(() => {
    return formSchema.value
      .filter(field => field.id !== currentFieldId)
      .map(field => ({
        value: field.name,
        label: field.label,
        id: field.id
      }));
  });
};



const getConditionalityHTML = (field) => {
  // Create container div
  const container = document.createElement('div');
  container.className = 'conditionality-container';
  
  // Update function
  const updateHTML = () => {
    const otherFields = formSchema.value.filter(f => f.id !== field.id);
    
    const dependsOnOptions = otherFields.map(f => 
      `<option value="${f.name}" ${field.attributes.dependsOn?.value === f.name ? 'selected' : ''}>
        ${f.label}
      </option>`
    ).join('');
    
    const dependentsOptions = otherFields.map(f => {
      const selected = field.attributes.dependents?.value?.split(',').includes(f.name);
      return `<option value="${f.name}" ${selected ? 'selected' : ''}>${f.label}</option>`;
    }).join('');

    container.innerHTML = `
    <div class="accordion">
      <div class="accordion-header">
        <span>Conditional Logic</span>
        <span class="accordion-icon">▼</span>
      </div>
      <div class="accordion-content hidden">
        <form class="conditional-form" onreset="handleResetConditionalLogic('${field.id}')">
          <div class="form-row">
            <label>This field depends on:</label>
            <select name="dependsOn" onchange="handleUpdateValue('${field.id}', 'dependsOn', this.value)"
                    ${otherFields.length ? '' : 'disabled'}>
              <option value="">-- None --</option>
              ${dependsOnOptions}
            </select>
            <small>${otherFields.length ? 'Select controlling field' : 'No other fields available'}</small>
          </div>
          
          <div class="form-row" ${!field.attributes.dependsOn?.value ? 'style="display:block"' : ''}>
            <label>Condition:</label>
            <input type="text" 
                   name="condition"
                   value="${field.attributes.condition?.value || ''}"
                   placeholder="Expected value"
                   oninput="handleUpdateValue('${field.id}', 'condition', this.value)"
                   ${!field.attributes.dependsOn?.value ? '' : ''}>
            <small>${field.attributes.dependsOn?.value ? 'Enter expected value' : 'Select a field first'}</small>
          </div>
          
          <div class="form-row">
            <label>Fields that depend on this one:</label>
            <select multiple 
                   name="dependents"
                   onchange="handleDependentFieldsChange('${field.id}', this)"
                   ${otherFields.length ? '' : 'disabled'}>
              ${dependentsOptions}
            </select>
            <small>${otherFields.length ? 'Ctrl/Cmd to multi-select' : 'Add more fields first'}</small>
          </div>
          
          <div class="form-actions">
            <button type="reset" class="reset-btn">Reset Logic</button>
          </div>
        </form>
      </div>
    </div>
    `;
  };

  // Initial render
  updateHTML();

  // Set up reactive updates
  $effect(() => {
    // Track both formSchema and field label changes
    formSchema.value;
    field.label;
    updateHTML();
    return () => {};
  });

  return container;
};


// Handle dependent field changes, ensuring selections persist
window.handleDependentFieldsChange = (fieldId, selectElement) => {
  debounce(() => {
    const selectedOptions = Array.from(selectElement.selectedOptions)
      .map(option => option.value);

    formSchema.value = formSchema.value.map(field => {
      if (field.id === fieldId) {
        const updatedDependents = {
          ...field.attributes.dependents,
          value: selectedOptions.join(','),
          active: selectedOptions.length > 0
        };

        return {
          ...field,
          attributes: {
            ...field.attributes,
            dependents: updatedDependents
          }
        };
      }
      return field;
    });
  }, 300); // Debounce the dependent field update to prevent UI reset
};


window.handleResetConditionalLogic = (fieldId) => {
  formSchema.value = formSchema.value.map(field => {
    if (field.id === fieldId) {
      return {
        ...field,
        attributes: {
          ...field.attributes,
          dependsOn: { active: false, value: '' },
          condition: { active: false, value: '' },
          dependents: { active: false, value: '' }
        }
      };
    }
    return field;
  });
  
  // No re-render needed - just update the conditionality UI directly
  const fieldElement = document.querySelector(`[data-id="${fieldId}"]`);
  if (fieldElement) {
    const conditionalityContent = fieldElement.querySelector('.conditionality-content');
    if (conditionalityContent) {
      const field = formSchema.value.find(f => f.id === fieldId);
      conditionalityContent.innerHTML = getConditionalityHTML(field);
    }
  }
};


  // Helper functions for rendering
  const getFieldPreviewHTML = (field) => {
    switch(field.type) {
      case 'text':
      case 'email':
      case 'password':
      case 'number':
        return `<input type="${field.type}" placeholder="${field.label}" disabled>`;
      case 'checkbox':
        return `<label><input type="checkbox" disabled> ${field.label}</label>`;
      case 'radio':
        return `<label><input type="radio" disabled> ${field.label}</label>`;
      case 'singleSelect':
      case 'multiSelect':
        return `<select ${field.type === 'multiSelect' ? 'multiple' : ''} disabled>
          <option>${field.label}</option>
        </select>`;
      default:
        return `<p>${field.label}</p>`;
    }
  };


// Update the CSS to include toggle switch styles (add to your existing CSS)
const toggleStyles = `
.toggle-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.toggle-container:last-child {
  border-bottom: none;
}

.toggle-label {
  flex-grow: 1;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 24px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: #4CAF50;
}

input:checked + .toggle-slider:before {
  transform: translateX(26px);
}
`;

// Inject the styles
const styleElement = document.createElement('style');
styleElement.textContent = toggleStyles;
document.head.appendChild(styleElement);


const renderAttributeControl = (fieldId, key, config, group) => {
  const isBoolean = config.type === 'boolean';
  const inputType = config.type === 'number' ? 'number' : 'text';
  
  return `
    <div class="${group}-item">
      <div class="toggle-container">
        <span class="toggle-label">${key}</span>
        <label class="toggle-switch">
          <input type="checkbox" 
                 ${config.active ? 'checked' : ''}
                 onchange="handleToggleActive('${fieldId}', '${key}', this.checked)">
          <span class="toggle-slider"></span>
        </label>
      </div>
      ${!isBoolean ? `
        <div class="value-input" style="display: ${config.active ? 'flex' : 'none'}">
          <input type="${inputType}" 
                 value="${config.value}"
                 oninput="handleUpdateValue('${fieldId}', '${key}', this.value)"
                 placeholder="Enter ${key}">
        </div>
      ` : ''}
    </div>
  `;
};

const getValidationsHTML = (field, definition) => {
  const allValidations = [
    ...globalValidations.map(v => ({
      name: v,
      type: 'boolean'
    })),
    ...(definition.validations || []).map(v => ({
      name: v,
      type: ['minLength', 'maxLength', 'min', 'max'].includes(v) ? 'number' : 'text'
    }))
  ];

  if (!allValidations.length) return '<p>No validations available</p>';

  return allValidations.map(({ name, type }) => {
    if (!field.attributes[name]) {
      field.attributes[name] = {
        active: false,
        type: type,
        value: type === 'boolean' ? true : ''
      };
    }
    return renderAttributeControl(field.id, name, field.attributes[name], 'validation');
  }).join('');
};

const getAttributesHTML = (field, definition) => {
  // Get merged attributes (globals + field-specific)
  const allAttributes = [
    ...globalAttributes.map(a => ({ 
      name: a, 
      type: ['id', 'class', 'style'].includes(a) ? 'text' : 'boolean'
    })),
    ...(definition.attributes || []).map(a => ({
      name: a,
      type: ['autocomplete', 'placeholder'].includes(a) ? 'text' : 'boolean'
    }))
  ];

  // Add common data attributes
  const dataAttributes = ['data-testid', 'data-cy', 'data-qa'];
  dataAttributes.forEach(attr => {
    if (!field.attributes[attr]) {
      field.attributes[attr] = {
        active: false,
        type: 'text',
        value: ''
      };
    }
    allAttributes.push({
      name: attr,
      type: 'text'
    });
  });

  if (!allAttributes.length) return '<p>No attributes available</p>';

  return allAttributes.map(({ name, type }) => {
    if (!field.attributes[name]) {
      field.attributes[name] = {
        active: false,
        type: type,
        value: type === 'boolean' ? true : ''
      };
    }
    return renderAttributeControl(field.id, name, field.attributes[name], 'attribute');
  }).join('');
};

  const renderField = (field) => {
  if (!accordionStates.value[field.id]) {
    accordionStates.value = {
      ...accordionStates.value,
      [field.id]: {
        options: false,
        validations: false,
        attributes: false,
        conditionality: false
      }
    };
  }

  const container = document.getElementById('fields-container');
  const fieldElement = document.createElement('div');
  fieldElement.className = 'form-field compact-field';
  fieldElement.dataset.id = field.id;
  
  const definition = fieldDefinitions[field.type];

  // Generate unique IDs for each accordion
  const accordionIds = {
    options: `accordion-${field.id}-options`,
    validations: `accordion-${field.id}-validations`,
    attributes: `accordion-${field.id}-attributes`,
    conditionality: `accordion-${field.id}-conditionality`
  };

  // Prepare options HTML if field has options
  const optionsHTML = definition.hasOptions ? `
    <div class="options-container">
      ${(field.choices || [{ value: '', label: '' }]).map((option, index) => `
        <div class="option-item" data-index="${index}">
          <input type="text" 
                 value="${option.value}" 
                 placeholder="Value (required)"
                 class="${!option.value ? 'error' : ''}"
                 oninput="handleOptionUpdate('${field.id}', ${index}, 'value', this.value)"
                 onblur="validateOptionValue('${field.id}', ${index}, this)"
                 onclick="event.stopPropagation()">
          <input type="text" 
                 value="${option.label || ''}" 
                 placeholder="Label (auto-generated)"
                 oninput="handleOptionUpdate('${field.id}', ${index}, 'label', this.value)"
                 onclick="event.stopPropagation()">
          <label class="option-selected" onclick="event.stopPropagation()">
            <input type="${['radio', 'singleSelect'].includes(field.type) ? 'radio' : 'checkbox'}" 
                   name="${field.id}-selected"
                   ${option.selected ? 'checked' : ''}
                   onchange="handleOptionUpdate('${field.id}', ${index}, 'selected', this.checked)"
                   onclick="event.stopPropagation()">
            ${['radio', 'singleSelect'].includes(field.type) ? 'Default' : 'Selected'}
          </label>
          <button class="remove-option" 
                  onclick="handleRemoveOption('${field.id}', ${index}); event.stopPropagation()">×</button>
        </div>
      `).join('')}
    </div>
    <button class="add-option" onclick="handleAddOption('${field.id}', event)">+ Add Option</button>
  ` : '';

  // Create main HTML structure - conditionally include options accordion
  fieldElement.innerHTML = `
    <div class="field-header">
      <h4 contenteditable="true" class="editable-label">${field.label}</h4>
      <div class="field-actions">
        <button class="configure-btn">⚙️</button>
        <button class="remove-btn">🗑️</button>
      </div>
    </div>
    
    <div class="field-preview-content">
      ${getFieldPreviewHTML(field)}
      <small class="field-type">${definition.label}</small>
    </div>

    ${definition.hasOptions ? `
    <div class="accordion" id="${accordionIds.options}">
      <div class="accordion-header">
        <span>Options</span>
        <span class="accordion-icon">${accordionStates.value[field.id]?.options ? '▲' : '▼'}</span>
      </div>
      <div class="accordion-content ${accordionStates.value[field.id]?.options ? '' : 'hidden'}">
        ${optionsHTML}
      </div>
    </div>
    ` : ''}
    
    <div class="accordion" id="${accordionIds.validations}">
      <div class="accordion-header">
        <span>Validations</span>
        <span class="accordion-icon">${accordionStates.value[field.id]?.validations ? '▲' : '▼'}</span>
      </div>
      <div class="accordion-content ${accordionStates.value[field.id]?.validations ? '' : 'hidden'}">
        ${getValidationsHTML(field, definition)}
      </div>
    </div>
    
    <div class="accordion" id="${accordionIds.attributes}">
      <div class="accordion-header">
        <span>Attributes</span>
        <span class="accordion-icon">${accordionStates.value[field.id]?.attributes ? '▲' : '▼'}</span>
      </div>
      <div class="accordion-content ${accordionStates.value[field.id]?.attributes ? '' : 'hidden'}">
        ${getAttributesHTML(field, definition)}
      </div>
    </div>

    <div class="accordion" id="${accordionIds.conditionality}">
      <div class="accordion-header">
        <span>Conditional Logic</span>
        <span class="accordion-icon">${accordionStates.value[field.id]?.conditionality ? '▲' : '▼'}</span>
      </div>
      <div class="accordion-content ${accordionStates.value[field.id]?.conditionality ? '' : 'hidden'}">
        <!-- Conditionality content will be inserted here -->
      </div>
    </div>
  `;

  // Append conditionality content
  const conditionalityContent = fieldElement.querySelector(`#${accordionIds.conditionality} .accordion-content`);
  conditionalityContent.appendChild(getConditionalityContent(field));

  // Rest of the function remains the same...
  // Label editing functionality
  const labelElement = fieldElement.querySelector('.editable-label');
  
  labelElement.addEventListener('blur', () => {
    const newLabel = labelElement.textContent.trim();
    if (newLabel && newLabel !== field.label) {
      field.label = newLabel;
      formSchema.value = [...formSchema.value]; // Trigger reactive update
    } else {
      labelElement.textContent = field.label; // Revert if empty/unchanged
    }
  });

  labelElement.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      labelElement.blur();
    }
  });

  labelElement.addEventListener('focus', () => {
    labelElement.classList.add('editing');
    labelElement.style.minWidth = `${labelElement.scrollWidth}px`;
  });

  labelElement.addEventListener('blur', () => {
    labelElement.classList.remove('editing');
    labelElement.style.minWidth = '';
  });

  // Field actions
  fieldElement.querySelector('.remove-btn').addEventListener('click', () => {
    formSchema.value = formSchema.value.filter(f => f.id !== field.id);
    fieldElement.remove();
    
    // Clean up accordion state
    const newStates = {...accordionStates.value};
    delete newStates[field.id];
    accordionStates.value = newStates;
  });
  
  fieldElement.querySelector('.configure-btn').addEventListener('click', () => {
    selectedField.value = field;
  });

  container.appendChild(fieldElement);
};




// Helper function for conditionality content
const getConditionalityContent = (field) => {
  const container = document.createElement('div');
  
  const updateHTML = () => {
    const otherFields = formSchema.value.filter(f => f.id !== field.id);
    
    const dependsOnOptions = otherFields.map(f => 
      `<option value="${f.name}" ${field.attributes.dependsOn?.value === f.name ? 'selected' : ''}>
        ${f.label}
      </option>`
    ).join('');
    
    const dependentsOptions = otherFields.map(f => {
      const selected = field.attributes.dependents?.value?.split(',').includes(f.name);
      return `<option value="${f.name}" ${selected ? 'selected' : ''}>${f.label}</option>`;
    }).join('');

    container.innerHTML = `
      <form class="conditional-form" onreset="handleResetConditionalLogic('${field.id}')">
        <div class="form-row">
          <label>This field depends on:</label>
          <select name="dependsOn" onchange="handleUpdateValue('${field.id}', 'dependsOn', this.value)"
                  ${otherFields.length ? '' : 'disabled'}>
            <option value="">-- None --</option>
            ${dependsOnOptions}
          </select>
          <small>${otherFields.length ? 'Select controlling field' : 'No other fields available'}</small>
        </div>
        
        <div class="form-row" ${!field.attributes.dependsOn?.value ? 'style="display:block"' : ''}>
          <label>Condition:</label>
          <input type="text" 
                 name="condition"
                 value="${field.attributes.condition?.value || ''}"
                 placeholder="Expected value"
                 oninput="handleUpdateValue('${field.id}', 'condition', this.value)"
                 ${!field.attributes.dependsOn?.value ? '' : ''}>
          <small>${field.attributes.dependsOn?.value ? 'Enter expected value' : 'Select a field first'}</small>
        </div>
        
        <div class="form-row">
          <label>Fields that depend on this one:</label>
          <select multiple 
                 name="dependents"
                 onchange="handleDependentFieldsChange('${field.id}', this)"
                 ${otherFields.length ? '' : 'disabled'}>
            ${dependentsOptions}
          </select>
          <small>${otherFields.length ? 'Ctrl/Cmd to multi-select' : 'Add more fields first'}</small>
        </div>
        
        <div class="form-actions">
          <button type="reset" class="reset-btn">Reset Logic</button>
        </div>
      </form>
    `;
  };

  // Initial render
  updateHTML();

  // Set up reactive updates
  $effect(() => {
    formSchema.value;
    field.label;
    updateHTML();
  });

  return container;
};



  // Create configuration panel
  const configPanel = document.createElement('div');
  configPanel.id = 'config-panel';
  configPanel.className = 'hidden';
  document.body.appendChild(configPanel);




window.handleToggleActive = (fieldId, key, active) => {
  formSchema.value = formSchema.value.map(field => {
    if (field.id === fieldId) {
      const updatedAttributes = {
        ...field.attributes,
        [key]: {
          ...field.attributes[key],
          active
        }
      };
      
      return { ...field, attributes: updatedAttributes };
    }
    return field;
  });
  
  // Toggle value input visibility
  const fieldElement = document.querySelector(`[data-id="${fieldId}"]`);
  if (fieldElement) {
    const inputContainer = fieldElement.querySelector(`input[onchange*="${key}"]`)
                         ?.closest('.validation-item, .attribute-item')
                         ?.querySelector('.value-input');
    if (inputContainer) {
      inputContainer.style.display = active ? 'flex' : 'none';
    }
  }
};

// Store debounce timers per field+key to avoid conflicts
const debounceTimers = {};

window.handleUpdateValue = (fieldId, key, value) => {
  const isConditionalityUpdate = ['dependsOn', 'condition', 'dependents'].includes(key);
  
  // Clear any pending update for this field+key
  const timerKey = `${fieldId}-${key}`;
  clearTimeout(debounceTimers[timerKey]);
  
  // Debounce the update
  debounceTimers[timerKey] = setTimeout(() => {
    formSchema.value = formSchema.value.map(field => {
      if (field.id === fieldId) {
        const updatedAttributes = { ...field.attributes };

        if (key === 'condition') {
          updatedAttributes[key] = {
            value: `(v) => v === '${value.replace(/'/g, "\\'")}'`,
            active: true,
            __isFunction: true
          };
        } else {
          updatedAttributes[key] = {
            ...field.attributes[key],
            value: value,
            active: !!value
          };
        }

        return {
          ...field,
          attributes: updatedAttributes
        };
      }
      return field;
    });

    // Only trigger re-render for non-conditionality updates
    if (!isConditionalityUpdate) {
      const field = formSchema.value.find(f => f.id === fieldId);
      if (field) {
        const existingElement = document.querySelector(`[data-id="${fieldId}"]`);
        if (existingElement) existingElement.remove();
        renderField(field);
      }
    }
  }, 300);
};



let debounceTimeout;

const debounce = (func, delay) => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(func, delay);
};





// Validate option value (not empty)
window.validateOptionValue = (fieldId, index, inputElement) => {
  const field = formSchema.value.find(f => f.id === fieldId);
  if (!field || !field.choices || !field.choices[index]) return;

  if (!field.choices[index].value.trim()) {
    inputElement.classList.add('error');
    return false;
  }
  inputElement.classList.remove('error');
  return true;
};


// Handle adding new options
window.handleAddOption = (fieldId, e) => {
  // Completely stop the event
  e.stopImmediatePropagation();
  e.preventDefault();
  
  formSchema.value = formSchema.value.map(field => {
    if (field.id === fieldId && field.choices) {
      // Don't add new option if last one is empty
      if (field.choices.length > 0 && !field.choices[field.choices.length-1].value.trim()) {
        return field;
      }
      
      const newOption = { value: '', label: '', selected: false };
      return {
        ...field,
        choices: [...field.choices, newOption]
      };
    }
    return field;
  });
  
  // Force the accordion to stay open by adding a class
  const accordionContent = e.target.closest('.accordion-content');
  if (accordionContent) {
    accordionContent.classList.remove('hidden');
    accordionContent.parentElement.classList.add('accordion-expanded');
  }
  
  // Re-render the field to show the new option
  const field = formSchema.value.find(f => f.id === fieldId);
  if (field) {
    const existingElement = document.querySelector(`[data-id="${fieldId}"]`);
    if (existingElement) {
      existingElement.remove();
    }
    renderField(field);
    
    // Focus the new option's value input
    const newInput = document.querySelector(`[data-id="${fieldId}"] .option-item:last-child input[placeholder="Value (required)"]`);
    if (newInput) newInput.focus();
  }
};





window.handleOptionUpdate = (fieldId, index, property, value) => {
  formSchema.value = formSchema.value.map(field => {
    if (field.id === fieldId && field.choices && field.choices[index]) {
      const updatedChoices = [...field.choices];
      const currentOption = updatedChoices[index];
      
      // Handle value updates
      if (property === 'value') {
        const lowerValue = value; //.toLowerCase(); // Ensure lowercase value
        const shouldUpdateLabel = !currentOption.label || currentOption.label === currentOption.value;
        
        updatedChoices[index] = {
          ...currentOption,
          value: lowerValue,
          ...(shouldUpdateLabel && {
            label: formatLabelFromValue(lowerValue) // Generate proper label
          })
        };
        
        return { ...field, choices: updatedChoices };
      }
      
      // Handle selection updates
      if (property === 'selected') {
        // For radio/singleSelect fields - exclusive selection
        if (value && ['radio', 'singleSelect'].includes(field.type)) {
          updatedChoices.forEach((opt, i) => {
            opt.selected = (i === index); // Only true for current selection
          });
        } 
        // For checkbox/multiSelect fields - multiple selection
        else {
          updatedChoices[index] = {
            ...currentOption,
            selected: value
          };
        }
        
        return { ...field, choices: updatedChoices };
      }
      
      // Handle label updates (direct edits)
      if (property === 'label') {
        updatedChoices[index] = {
          ...currentOption,
          label: value
        };
        
        return { ...field, choices: updatedChoices };
      }
    }
    return field;
  });
};

// Helper function (should be defined elsewhere in your code)
function formatLabelFromValue(value) {
  if (!value) return '';
  return value
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
// Handle removing options
window.handleRemoveOption = (fieldId, index) => {
  formSchema.value = formSchema.value.map(field => {
    if (field.id === fieldId && field.choices) {
      const updatedChoices = [...field.choices];
      updatedChoices.splice(index, 1);
      return {
        ...field,
        choices: updatedChoices.length ? updatedChoices : undefined
      };
    }
    return field;
  });
  
  // Re-render the field if we removed the last option
  const field = formSchema.value.find(f => f.id === fieldId);
  if (field && (!field.choices || !field.choices.length)) {
    const existingElement = document.querySelector(`[data-id="${fieldId}"]`);
    if (existingElement) {
      existingElement.remove();
    }
    renderField(field);
  }
};









  // Global functions for validation/attribute updates
  window.updateValidation = (fieldId, validation, checked) => {
    formSchema.value = formSchema.value.map(field => {
      if (field.id === fieldId) {
        return {
          ...field,
          attributes: {
            ...field.attributes,
            [validation]: checked
          }
        };
      }
      return field;
    });
  };

  window.updateAttribute = (fieldId, attribute, checked) => {
    formSchema.value = formSchema.value.map(field => {
      if (field.id === fieldId) {
        return {
          ...field,
          attributes: {
            ...field.attributes,
            [attribute]: checked
          }
        };
      }
      return field;
    });
  };




 $effect(() => {
  console.log("[Effect Triggered]"); // Track how often this runs

  const formattedSchema = formSchema.value.map(field => {
    const definition = fieldDefinitions[field.type];
    const validations = {};
    const attributes = {};

    Object.entries(field.attributes).forEach(([key, config]) => {
      if (!config.active) return;

      console.log(`Processing attribute: ${key}`);

      if (key === 'dependents') {
        attributes[key] = config.value
          .split(',')
          .map(s => s.trim())
          .filter(Boolean);
      } 
      else if (key === 'dependsOn' || key === 'condition') {
        attributes[key] = config.value;
      }
      else if (globalValidations.includes(key) || (definition.validations?.includes(key))) {
        validations[key] = config.value;
      }
      else {
        attributes[key] = config.value;
      }
    });

    const fieldSchema = [
      field.type,
      field.name,
      field.label,
      Object.keys(validations).length ? validations : {},
      Object.keys(attributes).length ? attributes : {}
    ];

    if (field.choices?.length) {
      const options = field.choices
        .filter(opt => opt.value.trim())
        .map(opt => ({
          value: opt.value.trim().toLowerCase(),
          label: opt.label.trim() || formatLabelFromValue(opt.value),
          ...(opt.selected && { selected: true })
        }));

      if (options.length) {
        fieldSchema.push(options);
      }
    }

    return fieldSchema;
  });

  console.log("[Schema Built]");

  const replacer = (key, value) => {
    if (value?.__isFunction) return value.value;
    if (typeof value === 'function') return value.toString();
    return value;
  };

  const rawOutput = JSON.stringify(formattedSchema, replacer, 2);

  const output = rawOutput
    .replace(/"(\w+)":/g, '$1:')
    .replace(/"__isFunction": true,/g, '')
    .replace(/"value": ((?:\\"|[^"])*)/g, '$1')
    .replace(/"/g, "'")
    .replace(/{}, \{\}/g, '{}, {}');

  document.getElementById('schema-output').value = output;

  console.log("[Schema Rendered]");
});


});





const optionsStyles = `
/* ... existing styles ... */

.accordion-content {
  pointer-events: auto;
}

.add-option {
  pointer-events: auto;
}

.options-container {
  pointer-events: auto;
}

.accordion-header > * {
  pointer-events: none;
}

.accordion-header {
  cursor: pointer;
  position: relative;
}

.accordion-header::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: auto;
}
`;

// Add to existing style injection
styleElement.textContent += optionsStyles;




$effect(() => {
  const formattedSchema = formSchema.value.map(field => {
    // ... existing schema formatting code
    // The label updates will automatically reflect here
    // because we're using field.label directly
  });
  
  document.getElementById('schema-output').value = 
    JSON.stringify(formattedSchema, null, 2)
    .replace(/"(\w+)":/g, '$1:')
    .replace(/"/g, "'");
});


function formatLabelFromValue(value) {
  if (!value) return '';
  return value
    .split('-') // Handle kebab-case
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}


const conditionalityStyles = `
.conditionality-section {
  margin-top: 15px;
  border-top: 1px solid #eee;
  padding-top: 15px;
}

.conditionality-section h4 {
  margin-bottom: 10px;
}

.condition-example {
  font-family: monospace;
  background: #f5f5f5;
  padding: 5px;
  border-radius: 3px;
  margin-top: 5px;
  font-size: 0.9em;
}

.condition-help {
  color: #666;
  font-size: 0.8em;
  margin-top: 5px;
}
`;


// Add to existing style injection
styleElement.textContent += conditionalityStyles;


const accordionStyles = `
.accordion {
  border: 1px solid #eee;
  border-radius: 4px;
  margin: 10px 0;
  overflow: hidden;
}

.accordion-header {
  padding: 10px;
  background: #f9f9f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.accordion-header:hover {
  background: #f0f0f0;
}

.accordion-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.accordion-content:not(.hidden) {
  max-height: 1000px; /* Adjust based on your content */
  padding: 10px;
}

.accordion-icon {
  font-size: 0.8em;
  transition: transform 0.3s ease;
}
`;

// Add to your style injection
styleElement.textContent += accordionStyles;


