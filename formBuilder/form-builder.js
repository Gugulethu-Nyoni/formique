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
  const definition = fieldDefinitions[type];
  const fieldId = `field-${Date.now()}`;
  
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
    type: type,
    name: `${type}-${Date.now()}`,
    label: definition.label,
    attributes: defaultAttributes,
    //options: {},
    choices: definition.hasOptions ? [{ value: '', label: '' }] : undefined
  };
  
  formSchema.value = [...formSchema.value, newField];
  renderField(newField);
};




const getConditionalityHTML = (field) => {
  // Get all other fields in the form (excluding current field)
  const otherFields = formSchema.value.filter(f => f.id !== field.id);
  
  // Generate options for dependsOn dropdown
  const dependsOnOptions = otherFields.map(f => 
    `<option value="${f.name}" ${field.attributes.dependsOn?.value === f.name ? 'selected' : ''}>
      ${f.label}
    </option>`
  ).join('');
  
  // Generate options for dependents multi-select
  const dependentsOptions = otherFields.map(f => {
    const selected = field.attributes.dependents?.value 
      ? field.attributes.dependents.value.split(',').includes(f.name)
      : false;
    return `<option value="${f.name}" ${selected ? 'selected' : ''}>
      ${f.label} 
    </option>`;
  }).join('');
  
  return `
    <div class="accordion">
      <div class="accordion-header">
        <span>Conditional Logic</span>
        <span class="accordion-icon">▼</span>
      </div>
      <div class="accordion-content hidden">
        <div class="form-row">
          <label>This field depends on:</label>
          <select onchange="handleUpdateValue('${field.id}', 'dependsOn', this.value)">
            <option value="">-- None --</option>
            ${dependsOnOptions}
          </select>
          <small>Select a field that controls this field's visibility</small>
        </div>
        
        <div class="form-row" ${!field.attributes.dependsOn?.value ? 'style="display:block"' : ''}">
          <label>Condition:</label>
          <input type="text" 
                 value="${field.attributes.condition?.value || ''}"
                 placeholder="Some Value Expected from the Selected Field"
                 oninput="handleUpdateValue('${field.id}', 'condition', this.value)">
          <small>Enter Some Value Expected from the Selected Field</small>
        </div>
        
        <div class="form-row">
          <label>Fields that depend on this one:</label>
          <select multiple 
                 onchange="handleDependentFieldsChange('${field.id}', this)">
            ${dependentsOptions}
          </select>
          <small>Hold Ctrl/Cmd to select multiple fields</small>
        </div>
      </div>
    </div>
  `;
};



// Add this new handler to the window object
window.handleDependentFieldsChange = (fieldId, selectElement) => {
  console.log('handleDependentFieldsChange called', {fieldId, selectedOptions: Array.from(selectElement.selectedOptions).map(o => o.value)}); // DEBUG
  
  const selectedOptions = Array.from(selectElement.selectedOptions)
    .map(option => option.value);
  
  formSchema.value = formSchema.value.map(field => {
    if (field.id === fieldId) {
      return {
        ...field,
        attributes: {
          ...field.attributes,
          dependents: {
            ...field.attributes.dependents,
            value: selectedOptions.join(',')
          }
        }
      };
    }
    return field;
  });
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

  // Update the getValidationsHTML and getAttributesHTML functions to use toggle switches
/*
const getValidationsHTML = (field, definition) => {
  if (!definition.validations?.length) return '<p>No validations available</p>';
  
  return definition.validations.map(validation => {
    const attr = field.attributes[validation];
    const isBoolean = typeof attr.value === 'boolean';
    
    return `
      <div class="validation-item">
        <div class="toggle-container">
          <span class="toggle-label">${validation}</span>
          <label class="toggle-switch">
            <input type="checkbox" 
                   ${attr.active ? 'checked' : ''}
                   onchange="handleToggleActive('${field.id}', '${validation}', this.checked)">
            <span class="toggle-slider"></span>
          </label>
        </div>
        ${!isBoolean ? `
          <div class="value-input" style="display: ${attr.active ? 'block' : 'none'}">
            <input type="text" 
                   value="${attr.value}"
                   onchange="handleUpdateValue('${field.id}', '${validation}', this.value)"
                   placeholder="Enter ${validation} value">
          </div>
        ` : ''}
      </div>
    `;
  }).join('');
};




const getAttributesHTML = (field, definition) => {
  if (!definition.attributes?.length) return '<p>No attributes available</p>';
  return definition.attributes.map(attr => `
    <div class="toggle-container">
      <span class="toggle-label">${attr}</span>
      <label class="toggle-switch">
        <input type="checkbox" 
               ${field.attributes[attr] ? 'checked' : ''}
               onchange="handleToggle('${field.id}', 'attributes', '${attr}', this.checked)">
        <span class="toggle-slider"></span>
      </label>
    </div>
  `).join('');
};

// Replace the individual update functions with a unified handler
window.handleToggle = (fieldId, type, key, checked) => {
  formSchema.value = formSchema.value.map(field => {
    if (field.id === fieldId) {
      return {
        ...field,
        attributes: {
          ...field.attributes,
          [key]: checked
        }
      };
    }
    return field;
  });
  
  // Update visual state immediately
  const fieldElement = document.querySelector(`[data-id="${fieldId}"]`);
  if (fieldElement) {
    const checkbox = fieldElement.querySelector(`input[onchange*="${key}"]`);
    if (checkbox) {
      const slider = checkbox.nextElementSibling;
      if (slider) {
        slider.style.backgroundColor = checked ? '#4CAF50' : '#ccc';
      }
    }
  }
};

*/


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

  // Render field to canvas
  const renderField = (field) => {
  const container = document.getElementById('fields-container');
  const fieldElement = document.createElement('div');
  fieldElement.className = 'form-field compact-field';
  fieldElement.dataset.id = field.id;
  
  const definition = fieldDefinitions[field.type];


  // Prepare options HTML if field has options
  const optionsHTML = field.choices ? `
  <div class="accordion">
    <div class="accordion-header">
      <span>Options</span>
      <span class="accordion-icon">▼</span>
    </div>
    <div class="accordion-content hidden">
      <div class="options-container">
        ${field.choices.map((option, index) => `
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
              <input type="${field.type === 'radio' ? 'radio' : 'checkbox'}" 
                     name="${field.id}-selected"
                     ${option.selected ? 'checked' : ''}
                     onchange="handleOptionUpdate('${field.id}', ${index}, 'selected', this.checked)"
                     onclick="event.stopPropagation()">
              Selected
            </label>
            <button class="remove-option" 
                    onclick="handleRemoveOption('${field.id}', ${index}); event.stopPropagation()">×</button>
          </div>
        `).join('')}
      </div>
      <button class="add-option" 
        onclick="handleAddOption('${field.id}', event)">+ Add Option</button>
    </div>
  </div>
` : '';

  
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

     ${optionsHTML}
    
    <div class="accordion">
      <div class="accordion-header">
        <span>Validations</span>
        <span class="accordion-icon">▼</span>
      </div>
      <div class="accordion-content hidden">
        ${getValidationsHTML(field, definition)}
      </div>
    </div>
    
    <div class="accordion">
      <div class="accordion-header">
        <span>Attributes</span>
        <span class="accordion-icon">▼</span>
      </div>
      <div class="accordion-content hidden">
        ${getAttributesHTML(field, definition)}
      </div>
    </div>

    ${getConditionalityHTML(field)}
  `;

  // Add label edit functionality
  const labelElement = fieldElement.querySelector('.editable-label');
  
  // Handle label editing
  labelElement.addEventListener('blur', () => {
    const newLabel = labelElement.textContent.trim();
    if (newLabel && newLabel !== field.label) {
      field.label = newLabel;
      // Trigger reactive update
      formSchema.value = [...formSchema.value];
    } else {
      // Revert if empty or unchanged
      labelElement.textContent = field.label;
    }
  });

  // Improve editing experience
  labelElement.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      labelElement.blur();
    }
  });

  // Visual feedback during editing
  labelElement.addEventListener('focus', () => {
    labelElement.classList.add('editing');
    labelElement.style.minWidth = `${labelElement.scrollWidth}px`;
  });

  labelElement.addEventListener('blur', () => {
    labelElement.classList.remove('editing');
    labelElement.style.minWidth = '';
  });

  // Add accordion toggle functionality
// In the renderField function, update the accordion handler:
// In the renderField function, update the accordion handler:
fieldElement.querySelectorAll('.accordion-header').forEach(header => {
  header.addEventListener('click', (e) => {
    // Check if the click target is specifically the header elements we want
    const isHeaderClick = (
      e.target === header || 
      e.target.classList.contains('accordion-icon') || 
      (e.target.tagName === 'SPAN' && !e.target.closest('.options-container'))
    );
    
    if (isHeaderClick) {
      const content = header.nextElementSibling;
      content.classList.toggle('hidden');
      header.parentElement.classList.toggle('accordion-expanded');
    }
  });
}, true); // Use capture phase to ensure we get the event first



  // Add remove functionality
  fieldElement.querySelector('.remove-btn').addEventListener('click', () => {
    formSchema.value = formSchema.value.filter(f => f.id !== field.id);
    fieldElement.remove();
  });
  
  // Add configure functionality
  fieldElement.querySelector('.configure-btn').addEventListener('click', () => {
    selectedField.value = field;
  });
  
  container.appendChild(fieldElement);
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

window.handleUpdateValue = (fieldId, key, value) => {
  formSchema.value = formSchema.value.map(field => {
    if (field.id === fieldId) {
      const updatedAttributes = { ...field.attributes };

      //alert(key);

      if (key === 'condition') {
        updatedAttributes[key] = {
          value: (v) => v === value,
          active: true
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





// Update handleOptionUpdate to handle selected state
window.handleOptionUpdate = (fieldId, index, property, value) => {
  formSchema.value = formSchema.value.map(field => {
    if (field.id === fieldId && field.choices && field.choices[index]) {
      const updatedChoices = [...field.choices];
      
      // Auto-generate label when value changes and label is empty
      if (property === 'value') {
        const currentOption = updatedChoices[index];
        if (!currentOption.label || currentOption.label === currentOption.value) {
          const generatedLabel = value 
            ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
            : '';
          updatedChoices[index] = {
            ...currentOption,
            value: value,
            label: generatedLabel
          };
          return {
            ...field,
            choices: updatedChoices
          };
        }
      }
      
      // For radio buttons, only one can be selected
      if (property === 'selected' && value === true && field.type === 'radio') {
        updatedChoices.forEach((opt, i) => {
          if (i !== index) opt.selected = false;
        });
      }
      
      updatedChoices[index] = {
        ...updatedChoices[index],
        [property]: property === 'selected' ? value : value
      };
      
      return {
        ...field,
        choices: updatedChoices
      };
    }
    return field;
  });
};

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






  // React to field selection changes
  $effect(() => {
    const field = selectedField.value;
    if (!field) {
      configPanel.classList.add('hidden');
      return;
    }

    configPanel.classList.remove('hidden');
    const definition = fieldDefinitions[field.type];
    
    configPanel.innerHTML = `
      <div class="compact-config">
        <h3>${definition.label} Configuration</h3>
        
        <div class="form-row">
          <label>Field Name:</label>
          <input type="text" id="config-name" value="${field.name}">
        </div>
        
        <div class="form-row">
          <label>Label:</label>
          <input type="text" id="config-label" value="${field.label}">
        </div>
        
        <div class="accordion">
          <div class="accordion-header">
            <span>Advanced Settings</span>
            <span class="accordion-icon">▼</span>
          </div>
          <div class="accordion-content hidden">
            ${field.choices ? `
              <div class="form-row">
                <label>Options:</label>
                <textarea id="config-options">${field.choices.map(o => o.value).join('\n')}</textarea>
              </div>
            ` : ''}
          </div>
        </div>
        
        <div class="form-actions">
          <button id="save-config">Save</button>
          <button id="cancel-config">Cancel</button>
        </div>
      </div>
    `;

    // Bind configuration inputs
    bind('#config-name', { 
      input: (e) => { field.name = e.target.value; } 
    });
    
    bind('#config-label', { 
      input: (e) => { field.label = e.target.value; } 
    });
    
    bind('#save-config', { 
      click: () => { 
        // Update options if they exist
        if (field.choices) {
          const optionsText = document.getElementById('config-options').value;
          field.choices = optionsText.split('\n').map(value => ({
            value: value.trim(),
            label: value.trim()
          }));
        }
        
        formSchema.value = formSchema.value.map(f => 
          f.id === field.id ? field : f
        );
        selectedField.value = null;
      } 
    });
    
    bind('#cancel-config', { 
      click: () => { selectedField.value = null; } 
    });
  });

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

  const formattedSchema = formSchema.value.map(field => {
    const definition = fieldDefinitions[field.type];
    const validations = {};
    const attributes = {};

    // Process ALL attributes consistently
    Object.entries(field.attributes).forEach(([key, config]) => {
      if (!config.active) return;

      if (key === 'dependents') {
        attributes[key] = config.value
          .split(',')
          .map(s => s.trim())
          .filter(Boolean);
      } else {
        attributes[key] = config.value;
      }
    });

    // Build the schema array
    const fieldSchema = [
      field.type,
      field.name,
      field.label
    ];

    if (Object.keys(validations).length > 0) {
      fieldSchema.push(validations);
    }

    if (Object.keys(attributes).length > 0) {
      fieldSchema.push(attributes);
    }

    if (field.choices?.length) {
      const options = field.choices
        .filter(opt => opt.value.trim())
        .map(opt => ({
          value: opt.value.trim(),
          label: opt.label.trim() || formatLabelFromValue(opt.value),
          ...(opt.selected && { selected: true })
        }));

      if (options.length) {
        fieldSchema.push(options);
      }
    }

    return fieldSchema;
  });

  // JSON stringify replacer to handle functions
  const replacer = (key, value) => {
    if (typeof value === 'function') {
      return value.toString();
    }
    return value;
  };

  // Update the output
  const output = JSON.stringify(formattedSchema, replacer, 2)
    .replace(/"(\w+)":/g, '$1:')  // Remove quotes from keys
    .replace(/"/g, "'");          // Use single quotes for values

  document.getElementById('schema-output').value = output;
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


