import { $state, bind, bindText, bindAttr, $effect } from '../../src/core/index.js';
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

    
    // Global value attributes
    id: { active: false, type: 'text', value: '' },
    class: { active: false, type: 'text', value: '' },
    style: { active: false, type: 'text', value: '' }
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
    options: {},
    choices: definition.hasOptions ? [] : undefined
  };
  
  formSchema.value = [...formSchema.value, newField];
  renderField(newField);
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
  fieldElement.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const content = header.nextElementSibling;
      content.classList.toggle('hidden');
      header.parentElement.classList.toggle('accordion-expanded');
    });
  });
  
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
      const updatedAttributes = {
        ...field.attributes,
        [key]: {
          ...field.attributes[key],
          value: field.attributes[key].type === 'number' ? Number(value) : value
        }
      };
      
      return { ...field, attributes: updatedAttributes };
    }
    return field;
  });
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

  // Update schema output whenever formSchema changes
 $effect(() => {
  const formattedSchema = formSchema.value.map(field => {
    const definition = fieldDefinitions[field.type];
    const validations = {};
    const attributes = {};
    
    Object.entries(field.attributes).forEach(([key, config]) => {
      if (!config.active) return;
      
      // Boolean attributes just show as true in schema
      const value = config.type === 'boolean' ? true : config.value;
      
      if (definition.validations?.includes(key)) {
        validations[key] = value;
      } else {
        attributes[key] = value;
      }
    });
    
    return [
      field.type,
      field.name,
      field.label,
      validations,
      attributes,
      ...(field.choices ? [field.choices] : [])
    ];
  });
  
  document.getElementById('schema-output').value = 
    JSON.stringify(formattedSchema, null, 2)
    .replace(/"(\w+)":/g, '$1:')
    .replace(/"/g, "'");
});


});






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


