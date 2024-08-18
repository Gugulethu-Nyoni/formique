// Base class for form rendering
class FormRenderer 
{
  renderField(type, name, label, validate, attributes, bindingSyntax,options) {
    throw new Error('Method renderField must be implemented');
  }

  // Main renderForm method
  renderForm(schema) {
    return schema.map(field => {
      const [type, name, label, validate, attributes = {}, bindingSyntax] = field;
      return this.renderField(type, name, label, validate, attributes, bindingSyntax);
    }).join('');
  }

  
}



// Extended class for specific form rendering methods
class Formique extends FormRenderer {


 constructor (formParams = {}) {
    super();
    this.divClass='input-block';
    this.inputClass='form-input';
    this.formParams=formParams;

    if (this.formParams) {
      //console.log(formParams);
    const formElement = this.renderFormElement(); 
    console.log(formElement);


    }


 }


  renderField(type, name, label, validate, attributes, bindingSyntax, options) {
    switch (type) {
      case 'text':
        return this.renderTextField(type, name, label, validate, attributes, bindingSyntax);
      case 'email':
        return this.renderEmailField(type, name, label, validate, attributes, bindingSyntax);
      case 'number':
        return this.renderNumberField(type, name, label, validate, attributes, bindingSyntax);
      case 'password':
        return this.renderPasswordField(type, name, label, validate, attributes, bindingSyntax);
      case 'tel': // New case for tel field
        return this.renderTelField(type, name, label, validate, attributes, bindingSyntax);
      case 'date':
        return this.renderDateField(type, name, label, validate, attributes, bindingSyntax);
      case 'time':
        return this.renderTimeField(type, name, label, validate, attributes, bindingSyntax);
      case 'datetime':
        return this.renderDateTimeField(type, name, label, validate, attributes, bindingSyntax);
      case 'month':
        return this.renderMonthField(type, name, label, validate, attributes, bindingSyntax);
      case 'week':
        return this.renderWeekField(type, name, label, validate, attributes, bindingSyntax);
      case 'url':
        return this.renderUrlField(type, name, label, validate, attributes, bindingSyntax);
      case 'search':
        return this.renderSearchField(type, name, label, validate, attributes, bindingSyntax);
      case 'color':
        return this.renderColorField(type, name, label, validate, attributes, bindingSyntax);
      case 'checkbox':
       return this.renderCheckboxField(type, name, label, validate, attributes, bindingSyntax, options);
      case 'radio':
        return this.renderRadioField(type, name, label, validate, attributes, bindingSyntax);
      case 'file':
        return this.renderFileField(type, name, label, validate, attributes, bindingSyntax);
      case 'hidden':
        return this.renderHiddenField(type, name, label, validate, attributes, bindingSyntax);
      case 'image':
        return this.renderImageField(type, name, label, validate, attributes, bindingSyntax);
      case 'textarea':
        return this.renderTextareaField(type, name, label, validate, attributes, bindingSyntax);
      case 'singleSelect':
        return this.renderSingleSelectField(type, name, label, validate, attributes, bindingSyntax, options);
      case 'multipleSelect':
        return this.renderMultipleSelectField(type, name, label, validate, attributes, bindingSyntax, options);
      case 'submit':
        return this.renderSubmitButton(type, name, label, attributes);
      default:
        console.warn(`Unsupported field type '${type}' encountered.`);
        return ''; // or handle gracefully
    }


  }


  renderFormElement() {
  //console.log(this.formParams);
  let formHTML = '<form ';

  // Use this.formParams directly
  const paramsToUse = this.formParams || {};

  // Dynamically add attributes if they are present in the parameters
  for (const [key, value] of Object.entries(paramsToUse)) {
    if (value !== undefined && value !== null) {
      // Handle boolean attributes
      if (typeof value === 'boolean') {
        if (value) {
          formHTML += `${key} `;
        }
      } else {
        // Handle other attributes
        const formattedKey = key === 'accept_charset' ? 'accept-charset' : key.replace(/_/g, '-');
        formHTML += `${formattedKey}="${value}" `;
      }
    }
  }

  // Close the <form> tag
  formHTML += '>';
  return formHTML;
}


 renderTextField(type, name, label, validate, attributes, bindingSyntax) {
  const textInputAttributes = new Set([
    'required',
    'minlength',
    'maxlength',
    'pattern',
    'placeholder',
    'readonly',
    'disabled',
    'size',
    'autocomplete',
    'spellcheck',
    'inputmode',
    'title',
  ]);

  // Construct validation attributes
  let validationAttrs = '';
  if (validate) {
    Object.entries(validate).forEach(([key, value]) => {
      if (textInputAttributes.has(key)) {
        if (typeof value === 'boolean' && value) {
          validationAttrs += `${key}\n`;
        } else {
          validationAttrs += `${key}="${value}"\n`;
        }
      } else {
        console.warn(`\x1b[31mUnsupported validation attribute '${key}' for field '${name}' of type 'text'.\x1b[0m`);
      }
    });
  }

  // Handle the binding syntax
  let bindingDirective = '';
  if (bindingSyntax === 'bind:value' && name) {
    bindingDirective = `bind:value="${name}"\n`;
  } else if (bindingSyntax === 'bind:value' && !name) {
    console.log('\x1b[31m%s\x1b[0m', 'You cannot set binding value when there is no name attribute defined.');
    return;
  }

  // Get the id from attributes or fall back to name
  let id = attributes.id || name;

  // Determine if semantiq is true based on formParams
  const semantq = this.formParams?.semantq || false;

  // Construct additional attributes dynamically
  let additionalAttrs = '';
  for (const [key, value] of Object.entries(attributes)) {
    if (key !== 'id' && value !== undefined) {
      if (key.startsWith('on')) {
        // Handle event attributes
        if (semantq) {
  // Remove "()" if the value ends with it
  const eventHandler = value.endsWith('()') ? value.slice(0, -2) : value;
  additionalAttrs += `@${key.replace(/^on/, '')}={${eventHandler}}\n`;
}
 else {
          // Add parentheses if not present
          const eventValue = value.endsWith('()') ? value : `${value}()`;
          additionalAttrs += `${key}="${eventValue}"\n`;
        }
      } else {
        // Handle boolean attributes
        if (value === true) {
          additionalAttrs += `${key.replace(/_/g, '-')}\n`;
        } else if (value !== false) {
          additionalAttrs += `${key.replace(/_/g, '-')}="${value}"\n`;
        }
      }
    }
  }

  // Return the final HTML for the text field
  return `
    <div class="${this.divClass}"> 
      <label for="${id}">${label}</label>
      <input 
        type="${type}"\n
        name="${name}"\n
        ${bindingDirective}
        id="${id}"\n
        ${additionalAttrs}
        ${validationAttrs}
      />
    </div>
  `.replace(/^\s*\n/gm, '').trim();
}



  renderEmailField(type, name, label, validate, attributes, bindingSyntax) {
  let validationAttrs = '';
  if (validate) {
    Object.entries(validate).forEach(([key, value]) => {
      switch (key) {
        case 'required':
          validationAttrs += `${key} `;
          break;
        case 'email':
          // Email validation is typically handled by the input type itself,
          // but if you need a custom validation, you can handle it here.
          validationAttrs += `${key}="${value}" `;
          break;
        default:
          console.warn(`Unsupported validation attribute '${key}' for field '${name}' of type 'email'.`);
          break;
      }
    });
  }

  let id = attributes.id || name;
  let bindingDirective = '';
  if (bindingSyntax === 'bind:value' && name) {
    bindingDirective = ` bind:value="${name}"`;
  } 

  if (bindingSyntax === 'bind:value' && !name) {
    console.log('\x1b[31m%s\x1b[0m', 'You can not set binding value when there is no name attribute defined.');
    return; 
  }

  let inputClass = attributes.class || this.inputClass;

  return `
    <div class="${this.divClass}"> 
      <label for="${id}">${label}</label>
      <input 
        type="${type}" 
        name="${name}" 
        ${bindingDirective}  
        id="${id}"
        ${attributes.class ? `class="${inputClass}"` : ''}
        ${attributes.style ? `style="${attributes.style}"` : ''}
        ${validationAttrs} 

      />
    </div>
  `.replace(/^\s*\n/gm, '').trim();
}



renderNumberField(type, name, label, validate, attributes, bindingSyntax) {
  // Initialize validation attributes string
  let validationAttrs = '';
  
  // Add validation attributes based on the 'validate' object
  if (validate) {
    Object.entries(validate).forEach(([key, value]) => {
      switch (key) {
        case 'required':
          validationAttrs += `${key} `;
          break;
        case 'min':
        case 'max':
          validationAttrs += `${key}="${value}" `;
          break;
        default:
          console.warn(`Unsupported validation attribute '${key}' for field '${name}' of type 'number'.`);
          break;
      }
    });
  }

  // Determine the ID attribute (fallback to the name attribute if ID is not present)
  let id = attributes.id || name;

  // Set the binding directive if applicable
  let bindingDirective = '';
  if (bindingSyntax === 'bind:value' && name) {
    bindingDirective = ` bind:value="${name}"`;
  } else if (bindingSyntax === 'bind:value' && !name) {
    console.log('\x1b[31m%s\x1b[0m', 'You can not set binding value when there is no name attribute defined.');
    return;
  }

  // Set the input class, defaulting to this.inputClass if not provided
  let inputClass = attributes.class || this.inputClass;

  // Return the formatted HTML string
  return `
    <div class="${this.divClass}"> 
      <label for="${id}">${label}</label>
      <input 
        type="${type}" 
        name="${name}" 
        ${bindingDirective}  
        id="${id}"
        ${attributes.class ? `class="${inputClass}"` : ''}
        ${attributes.style ? `style="${attributes.style}"` : ''}
        ${validationAttrs} 

      />
    </div>
  `.replace(/^\s*\n/gm, '').trim();
}




// New method for rendering password fields
  renderPasswordField(name, label, validate, attributes, bindingSyntax) {
    let validationAttrs = '';
    if (validate) {
      Object.entries(validate).forEach(([key, value]) => {
        switch (key) {
          case 'required':
            validationAttrs += `${key} `;
            break;
          case 'minLength':
          case 'maxLength':
            validationAttrs += `${key}="${value}" `;
            break;
          default:
            console.warn(`Unsupported validation attribute '${key}' for field '${name}' of type 'password'.`);
            break;
        }
      });
    }

    let bindingDirective = '';
    if (bindingSyntax === '::passwordValue') {
      bindingDirective = ` bind:value="${name}"`;
    }

    return `
      <label for="${name}">${label}</label>
      <input type="password"${bindingDirective} ${validationAttrs}
        ${attributes.id ? `id="${attributes.id}"` : ''}
        ${attributes.class ? `class="${attributes.class}"` : ''}
        ${attributes.style ? `style="${attributes.style}"` : ''}
      />
    `;
  }




// New method for rendering tel fields
  renderTelField(name, label, validate, attributes, bindingSyntax) {
    let validationAttrs = '';
    if (validate) {
      Object.entries(validate).forEach(([key, value]) => {
        switch (key) {
          case 'required':
            validationAttrs += `${key} `;
            break;
          default:
            console.warn(`Unsupported validation attribute '${key}' for field '${name}' of type 'tel'.`);
            break;
        }
      });
    }

    let bindingDirective = '';
    if (bindingSyntax === '::telValue') {
      bindingDirective = ` bind:value="${name}"`;
    }

    return `
      <label for="${name}">${label}</label>
      <input type="tel"${bindingDirective} ${validationAttrs}
        ${attributes.id ? `id="${attributes.id}"` : ''}
        ${attributes.class ? `class="${attributes.class}"` : ''}
        ${attributes.style ? `style="${attributes.style}"` : ''}
      />
    `;
  }




renderDateField(name, label, validate, attributes, bindingSyntax) {
    let validationAttrs = '';
    if (validate) {
      Object.entries(validate).forEach(([key, value]) => {
        switch (key) {
          case 'required':
            validationAttrs += `${key} `;
            break;
          default:
            console.warn(`Unsupported validation attribute '${key}' for field '${name}' of type 'date'.`);
            break;
        }
      });
    }

    let bindingDirective = '';
    if (bindingSyntax === '::date') {
      bindingDirective = ` bind:value="${name}"`;
    }

    return `
      <label for="${name}">${label}</label>
      <input type="date"${bindingDirective} ${validationAttrs}
        ${attributes.id ? `id="${attributes.id}"` : ''}
        ${attributes.class ? `class="${attributes.class}"` : ''}
        ${attributes.style ? `style="${attributes.style}"` : ''}
      />
    `;
  }



renderTimeField(name, label, validate, attributes, bindingSyntax) {
    let validationAttrs = '';
    if (validate) {
      Object.entries(validate).forEach(([key, value]) => {
        switch (key) {
          case 'required':
            validationAttrs += `${key} `;
            break;
          default:
            console.warn(`Unsupported validation attribute '${key}' for field '${name}' of type 'time'.`);
            break;
        }
      });
    }

    let bindingDirective = '';
    if (bindingSyntax === '::time') {
      bindingDirective = ` bind:value="${name}"`;
    }

    return `
      <label for="${name}">${label}</label>
      <input type="time"${bindingDirective} ${validationAttrs}
        ${attributes.id ? `id="${attributes.id}"` : ''}
        ${attributes.class ? `class="${attributes.class}"` : ''}
        ${attributes.style ? `style="${attributes.style}"` : ''}
      />
    `;
  }



renderDateTimeField(name, label, validate, attributes, bindingSyntax) {
    let validationAttrs = '';
    if (validate) {
      Object.entries(validate).forEach(([key, value]) => {
        switch (key) {
          case 'required':
            validationAttrs += `${key} `;
            break;
          default:
            console.warn(`Unsupported validation attribute '${key}' for field '${name}' of type 'datetime'.`);
            break;
        }
      });
    }

    let bindingDirective = '';
    if (bindingSyntax === 'bind:value') {
      bindingDirective = ` bind:value="${name}"`;
    } else if (bindingSyntax === `::${name}`) {
      bindingDirective = ` bind:value="${name}"`;
    }

    return `
      <label for="${name}">${label}</label>
      <input type="datetime-local"${bindingDirective} ${validationAttrs}
        ${attributes.id ? `id="${attributes.id}"` : ''}
        ${attributes.class ? `class="${attributes.class}"` : ''}
        ${attributes.style ? `style="${attributes.style}"` : ''}
      />
    `;
  }






renderMonthField(name, label, validate, attributes, bindingSyntax) {
    let validationAttrs = '';
    if (validate) {
      Object.entries(validate).forEach(([key, value]) => {
        switch (key) {
          case 'required':
            validationAttrs += `${key} `;
            break;
          default:
            console.warn(`Unsupported validation attribute '${key}' for field '${name}' of type 'month'.`);
            break;
        }
      });
    }

    let bindingDirective = '';
    if (bindingSyntax === 'bind:value') {
      bindingDirective = ` bind:value="${name}"`;
    } else if (bindingSyntax === `::${name}`) {
      bindingDirective = ` bind:value="${name}"`;
    }

    return `
      <label for="${name}">${label}</label>
      <input type="month"${bindingDirective} ${validationAttrs}
        ${attributes.id ? `id="${attributes.id}"` : ''}
        ${attributes.class ? `class="${attributes.class}"` : ''}
        ${attributes.style ? `style="${attributes.style}"` : ''}
      />
    `;
  }



renderWeekField(name, label, validate, attributes, bindingSyntax) {
    let validationAttrs = '';
    if (validate) {
      Object.entries(validate).forEach(([key, value]) => {
        switch (key) {
          case 'required':
            validationAttrs += `${key} `;
            break;
          default:
            console.warn(`Unsupported validation attribute '${key}' for field '${name}' of type 'week'.`);
            break;
        }
      });
    }

    let bindingDirective = '';
    if (bindingSyntax === 'bind:value') {
      bindingDirective = ` bind:value="${name}"`;
    } else if (bindingSyntax === `::${name}`) {
      bindingDirective = ` bind:value="${name}"`;
    }

    return `
      <label for="${name}">${label}</label>
      <input type="week"${bindingDirective} ${validationAttrs}
        ${attributes.id ? `id="${attributes.id}"` : ''}
        ${attributes.class ? `class="${attributes.class}"` : ''}
        ${attributes.style ? `style="${attributes.style}"` : ''}
      />
    `;
  }





renderUrlField(name, label, validate, attributes, bindingSyntax) {
    let validationAttrs = '';
    if (validate) {
      Object.entries(validate).forEach(([key, value]) => {
        switch (key) {
          case 'required':
            validationAttrs += `${key} `;
            break;
          case 'url':
            validationAttrs += `${key} `;
            break;
          default:
            console.warn(`Unsupported validation attribute '${key}' for field '${name}' of type 'url'.`);
            break;
        }
      });
    }

    let bindingDirective = '';
    if (bindingSyntax === 'bind:value') {
      bindingDirective = ` bind:value="${name}"`;
    } else if (bindingSyntax === `::${name}`) {
      bindingDirective = ` bind:value="${name}"`;
    }

    return `
      <label for="${name}">${label}</label>
      <input type="url"${bindingDirective} ${validationAttrs}
        ${attributes.id ? `id="${attributes.id}"` : ''}
        ${attributes.class ? `class="${attributes.class}"` : ''}
        ${attributes.style ? `style="${attributes.style}"` : ''}
      />
    `;
  }





renderSearchField(name, label, validate, attributes, bindingSyntax) {
  let validationAttrs = '';
  if (validate) {
    Object.entries(validate).forEach(([key, value]) => {
      switch (key) {
        case 'required':
          validationAttrs += `${key} `;
          break;
        case 'search':
          validationAttrs += `${key} `;
          break;
        default:
          console.warn(`Unsupported validation attribute '${key}' for field '${name}' of type 'search'.`);
          break;
      }
    });
  }

  let bindingDirective = '';
  if (bindingSyntax === 'bind:value') {
    bindingDirective = ` bind:value="${name}"`;
  } else if (bindingSyntax === `::${name}`) {
    bindingDirective = ` bind:value="${name}"`;
  }

  return `
    <label for="${name}">${label}</label>
    <input type="search"${bindingDirective} ${validationAttrs}
      ${attributes.id ? `id="${attributes.id}"` : ''}
      ${attributes.class ? `class="${attributes.class}"` : ''}
      ${attributes.style ? `style="${attributes.style}"` : ''}
    />
  `;
}





renderColorField(name, label, validate, attributes, bindingSyntax) {
    let validationAttrs = '';
    if (validate) {
  Object.entries(validate).forEach(([key, value]) => {
    switch (key) {
      case 'required':
        validationAttrs += `${key} `;
        break;
      case 'checkbox': // Handle 'checkbox' validation
        validationAttrs += `${key} `;
        break;
      default:
        console.warn(`Unsupported validation attribute '${key}' for field '${name}' of type 'checkbox'.`);
        break;
    }
  });
}

    let bindingDirective = '';
    if (bindingSyntax === 'bind:value') {
      bindingDirective = ` bind:value="${name}"`;
    } else if (bindingSyntax === `::${name}`) {
      bindingDirective = ` bind:value="${name}"`;
    }

    return `
      <label for="${name}">${label}</label>
      <input type="color"${bindingDirective} ${validationAttrs}
        ${attributes.id ? `id="${attributes.id}"` : ''}
        ${attributes.class ? `class="${attributes.class}"` : ''}
        ${attributes.style ? `style="${attributes.style}"` : ''}
      />
    `;
  }




renderCheckboxField(name, label, validate, attributes, bindingSyntax) {
  let validationAttrs = '';
  if (validate) {
    Object.entries(validate).forEach(([key, value]) => {
      switch (key) {
        case 'required':
          validationAttrs += `${key} `;
          break;
        default:
          console.warn(`Unsupported validation attribute '${key}' for field '${name}' of type 'checkbox'.`);
          break;
      }
    });
  }

  let bindingDirective = '';
  if (bindingSyntax === 'bind:value') {
    bindingDirective = ` bind:value="${name}"`;
  } else if (bindingSyntax === `::${name}`) {
    bindingDirective = ` bind:value="${name}"`;
  }

  return `
    <label for="${name}">${label}</label>
    <input type="checkbox"${bindingDirective} ${validationAttrs}
        ${attributes.id ? `id="${attributes.id}"` : ''}
        ${attributes.class ? `class="${attributes.class}"` : ''}
        ${attributes.style ? `style="${attributes.style}"` : ''}
    />
  `;
}




 renderRadioField(name, label, validate, attributes, bindingSyntax, options) {
  let validationAttrs = '';
  
  if (validate) {
    Object.entries(validate).forEach(([key, value]) => {
      switch (key) {
        case 'required':
          validationAttrs += `required `;
          break;
        default:
          console.warn(`Unsupported validation attribute '${key}' for field '${name}' of type 'radio'.`);
          break;
      }
    });
  }

  let bindingDirective = '';
  if (bindingSyntax === 'bind:value') {
    bindingDirective = ` bind:value="${name}"`;
  } else if (bindingSyntax.startsWith('::')) {
    bindingDirective = ` bind:value="${name}"`;
  }

  let optionsHTML = '';
  if (options && options.length) {
    optionsHTML = options.map((option) => {
      return `
        <div>
          <input type="radio" name="${name}" value="${option.value}"${bindingDirective} ${validationAttrs}
            ${attributes.id ? `id="${attributes.id}-${option.value}"` : ''}
            ${attributes.class ? `class="${attributes.class}"` : ''}
            ${attributes.style ? `style="${attributes.style}"` : ''}
          >
          <label for="${attributes.id ? `${attributes.id}-${option.value}` : option.value}">${option.label}</label>
        </div>
      `;
    }).join('');
  }

  return `
    <fieldset>
      <legend>${label}</legend>
      ${optionsHTML}
    </fieldset>
  `;
}




renderFileField(name, label, validate, attributes, bindingSyntax) {
  let validationAttrs = '';
  if (validate) {
    Object.entries(validate).forEach(([key, value]) => {
      switch (key) {
        case 'required':
          validationAttrs += `${key} `;
          break;
        case 'file': // Handle 'file' validation
          validationAttrs += `${key} `;
          break;
        default:
          console.warn(`Unsupported validation attribute '${key}' for field '${name}' of type 'file'.`);
          break;
      }
    });
  }

  let bindingDirective = '';
  if (bindingSyntax === 'bind:value') {
    bindingDirective = ` bind:value="${name}"`;
  } else if (bindingSyntax.startsWith('::')) {
    bindingDirective = ` bind:value="${name}"`;
  }

  return `
    <label for="${name}">${label}</label>
    <input type="file"${bindingDirective} ${validationAttrs}
      ${attributes.id ? `id="${attributes.id}"` : ''}
      ${attributes.class ? `class="${attributes.class}"` : ''}
      ${attributes.style ? `style="${attributes.style}"` : ''}
    />
  `;


// Example usage
const fileFieldHTML = renderFileField(
  'upload', 
  'Upload File', 
  { required: true, file: true }, 
  { id: 'uploadFileInput', class: 'form-control', style: 'width: 100%;' }, 
  '::upload'
);


}





renderHiddenField(name, label, validate, attributes, bindingSyntax) {
  let validationAttrs = '';
  if (validate) {
    Object.entries(validate).forEach(([key, value]) => {
      switch (key) {
        case 'required':
          validationAttrs += `${key} `;
          break;
        case 'hidden': // Handle 'hidden' validation
          validationAttrs += `${key} `;
          break;
        default:
          console.warn(`Unsupported validation attribute '${key}' for field '${name}' of type 'hidden'.`);
          break;
      }
    });
  }

  let bindingDirective = '';
  if (bindingSyntax === 'bind:value') {
    bindingDirective = ` bind:value="${name}"`;
  } else if (bindingSyntax.startsWith('::')) {
    bindingDirective = ` bind:value="${name}"`;
  }

  return `
    <input type="hidden"${bindingDirective} ${validationAttrs}
      ${attributes.id ? `id="${attributes.id}"` : ''}
      ${attributes.class ? `class="${attributes.class}"` : ''}
      ${attributes.style ? `style="${attributes.style}"` : ''}
    />
  `;
}




 renderImageField(name, label, validate, attributes, bindingSyntax) {
  let validationAttrs = '';
  if (validate) {
    Object.entries(validate).forEach(([key, value]) => {
      switch (key) {
        case 'required':
          validationAttrs += `${key} `;
          break;
        case 'accept':
          validationAttrs += `accept="${value}" `;
          break;
        default:
          console.warn(`Unsupported validation attribute '${key}' for field '${name}' of type 'image'.`);
          break;
      }
    });
  }

  let bindingDirective = '';
  if (bindingSyntax === 'bind:value') {
    bindingDirective = ` bind:value="${name}"`;
  } else if (bindingSyntax.startsWith('::')) {
    bindingDirective = ` bind:value="${name}"`;
  }

  return `
    <label for="${name}">${label}</label>
    <input type="file" ${bindingDirective} ${validationAttrs}
      ${attributes.id ? `id="${attributes.id}"` : ''}
      ${attributes.class ? `class="${attributes.class}"` : ''}
      ${attributes.style ? `style="${attributes.style}"` : ''}
    />
  `;
}



 renderTextareaField(name, label, validate, attributes, bindingSyntax) {
  let validationAttrs = '';
  let dimensionAttrs = '';
  
  if (validate) {
    Object.entries(validate).forEach(([key, value]) => {
      switch (key) {
        case 'required':
          validationAttrs += `${key} `;
          break;
        case 'minLength':
          validationAttrs += `minlength="${value}" `;
          break;
        case 'maxLength':
          validationAttrs += `maxlength="${value}" `;
          break;
        case 'rows':
          dimensionAttrs += `rows="${value}" `;
          break;
        case 'cols':
          dimensionAttrs += `cols="${value}" `;
          break;
        default:
          console.warn(`Unsupported validation attribute '${key}' for field '${name}' of type 'textarea'.`);
          break;
      }
    });
  }

  let bindingDirective = '';
  if (bindingSyntax === 'bind:value') {
    bindingDirective = ` bind:value="${name}"`;
  } else if (bindingSyntax.startsWith('::')) {
    bindingDirective = ` bind:value="${name}"`;
  }

  return `
    <label for="${name}">${label}</label>
    <textarea ${bindingDirective} ${validationAttrs} ${dimensionAttrs}
      ${attributes.id ? `id="${attributes.id}"` : ''}
      ${attributes.class ? `class="${attributes.class}"` : ''}
      ${attributes.style ? `style="${attributes.style}"` : ''}
    ></textarea>
  `;
}







renderCheckboxField(type, name, label, validate, attributes, bindingSyntax, options) {
  let validationAttrs = '';

  if (validate) {
    Object.entries(validate).forEach(([key, value]) => {
      switch (key) {
        case 'required':
          validationAttrs += `${key} `;
          break;
        default:
          console.warn(`Unsupported validation attribute '${key}' for field '${name}' of type 'checkbox'.`);
          break;
      }
    });
  }

  let bindingDirective = '';
  if (typeof bindingSyntax === 'string' && bindingSyntax.startsWith('::')) {
    bindingDirective = ` bind:checked="${name}"`;
  }

  let optionsHTML = '';
  if (Array.isArray(options)) {
    optionsHTML = options.map((option) => {
      const optionId = `${name}-${option.value}`;
      return `
        <div>
          <input type="checkbox" name="${name}" value="${option.value}"${bindingDirective} ${validationAttrs}
            id="${optionId}"
            ${attributes.class ? `class="${attributes.class}"` : ''}
            ${attributes.style ? `style="${attributes.style}"` : ''}
          >
          <label for="${optionId}">${option.label}</label>
        </div>
      `;
    }).join('');
  }

  return `
    <fieldset>
      <legend>${label}</legend>
      ${optionsHTML}
    </fieldset>
  `;
}



// Function to render a single select field
renderSingleSelectField(type, name, label, validate, attributes, bindingSyntax, options) {
  let validationAttrs = '';
  if (validate) {
    Object.entries(validate).forEach(([key, value]) => {
      switch (key) {
        case 'required':
          validationAttrs += `${key} `;
          break;
        default:
          console.warn(`Unsupported validation attribute '${key}' for field '${name}' of type 'select'.`);
          break;
      }
    });
  }

  let bindingDirective = '';
  if (typeof bindingSyntax === 'string' && bindingSyntax.startsWith('::')) {
    bindingDirective = ` bind:value="${name}"`;
  }

  let selectHTML = '';
  if (Array.isArray(options)) {
    selectHTML = options.map((option) => {
      return `
        <option value="${option.value}">${option.label}</option>
      `;
    }).join('');
  }

  return `
    <fieldset>
      <legend>${label}</legend>
      <select name="${name}"${bindingDirective} ${validationAttrs}
        ${attributes.id ? `id="${attributes.id}"` : ''}
        ${attributes.class ? `class="${attributes.class}"` : ''}
        ${attributes.style ? `style="${attributes.style}"` : ''}
      >
        ${selectHTML}
      </select>
    </fieldset>
  `;
}





// Function to render a multiple select field
 renderMultipleSelectField(type, name, label, validate, attributes, bindingSyntax, options) {
  let validationAttrs = '';
  if (validate) {
    Object.entries(validate).forEach(([key, value]) => {
      switch (key) {
        case 'required':
          validationAttrs += `${key} `;
          break;
        case 'min':
          validationAttrs += `min="${value}" `;
          break;
        case 'max':
          validationAttrs += `max="${value}" `;
          break;
        default:
          console.warn(`Unsupported validation attribute '${key}' for field '${name}' of type 'select'.`);
          break;
      }
    });
  }

  let bindingDirective = '';
  if (typeof bindingSyntax === 'string' && bindingSyntax.startsWith('::')) {
    bindingDirective = ` bind:value="${name}"`;
  }

  let selectHTML = '';
  if (Array.isArray(options)) {
    selectHTML = options.map((option) => {
      return `
        <option value="${option.value}">${option.label}</option>
      `;
    }).join('');
  }

  const multipleAttr = 'multiple';

  return `
    <fieldset>
      <legend>${label}</legend>
      <select name="${name}"${bindingDirective} ${validationAttrs} ${multipleAttr}
        ${attributes.id ? `id="${attributes.id}"` : ''}
        ${attributes.class ? `class="${attributes.class}"` : ''}
        ${attributes.style ? `style="${attributes.style}"` : ''}
      >
        ${selectHTML}
      </select>
    </fieldset>
  `;
}




renderSubmitButton(name, label, attributes) {
    return `
      <button type="submit"
        ${attributes.id ? `id="${attributes.id}"` : ''}
        ${attributes.class ? `class="${attributes.class}"` : ''}
        ${attributes.style ? `style="${attributes.style}"` : ''}
      >
        ${label}
      </button>
    `;
  }







// no renderMethod below here
}


















const formSchema = [
  ['text', 'firstName', 'First Name', { min: 2, max: 5, required: true, disabled: true}, { id: 'firstNameInput', class: 'form-input', style: 'width: 100%;', oninput: "incrementer()"}, 'bind:value'],
  ['email', 'email', 'Email', { required: true}, { class: 'form-input', style: 'width: 100%;'}, '::emailValue'],

  ['number', 'age', 'Your Age', { required: false }, { id: 'age12'}, '::age'],
 
  /*


  ['password', 'password', 'Password', { required: true, minLength: 8 }, { class: 'form-control', style: 'width: 100%;' }, '::passwordValue'],
  ['tel', 'phoneNumber', 'Phone Number', { required: true }, { class: 'form-control', style: 'width: 100%;' }, '::telValue'],
  ['date', 'birthdate', 'Birthdate', { required: true }, { id: 'birthdateInput', class: 'form-control', style: 'width: 100%;' }, '::date'],
  ['time', 'meetingTime', 'Meeting Time', { required: true }, { id: 'meetingTimeInput', class: 'form-control', style: 'width: 100%;' }, '::time'],
  ['datetime', 'meetingDateTime', 'Meeting Date & Time', { required: true }, { id: 'meetingDateTimeInput', class: 'form-control', style: 'width: 100%;' }, '::meetingDateTime'],
  ['month', 'eventMonth', 'Event Month', { required: true }, { id: 'eventMonthInput', class: 'form-control', style: 'width: 100%;' }, '::eventMonth'],
  ['week', 'eventWeek', 'Event Week', { required: true }, { id: 'eventWeekInput', class: 'form-control', style: 'width: 100%;' }, '::eventWeek'],
  ['url', 'websiteUrl', 'Website URL', { required: true, url: true }, { id: 'websiteUrlInput', class: 'form-control', style: 'width: 100%;' }, '::websiteUrl'],
  ['search', 'searchQuery', 'Search', { required: true }, { id: 'searchQueryInput', class: 'form-control', style: 'width: 100%;' }, '::searchQuery'],
  ['color', 'colorPicker', 'Pick a Color', { required: true }, { id: 'colorPickerInput', class: 'form-control', style: 'width: 100%;' }, '::colorValue'],
  ['file', 'terms', 'Upload File', { required: true }, { id: 'my-file', class: 'form-control', style: 'width: 100%;' }, '::terms'],

  ['hidden', 'user_id', '', { required: true }, {}, '::user_id'],

  ['image','profilePicture','Profile Picture', { required: true, accept: 'image/*' }, 
  { id: 'profilePictureInput', class: 'form-control', style: 'width: 100%;' }, 
  'bind:value'],

  ['textarea', 'comments', 'Comments', 
  { required: true, minLength: 10, maxLength: 200, rows: 4, cols: 50 }, 
  { id: 'commentsTextarea', class: 'form-control', style: 'width: 100%; height: 100px;' }, 
  '::comments'],

  [
  'radio', 
  'gender', 
  'Gender', 
  { required: true }, 
  { id: 'genderRadio', class: 'form-radio-input', style: 'margin-left: 1rem;' }, 
  '::gender', 
  [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
  ]
],


[
  'checkbox', 
  'preferences', 
  'Preferences', 
  { required: true }, 
  { id: 'preferencesCheckbox', class: 'form-checkbox-input', style: 'margin-left: 1rem;' }, 
  '::preferences', 
  [
    { value: 'news', label: 'Newsletter' },
    { value: 'updates', label: 'Product Updates' },
    { value: 'offers', label: 'Special Offers' },
  ]
],


[
  'singleSelect', 
  'colors', 
  'Colors', 
  { required: true }, // Validation options
  { id: 'colorsSelect', class: 'form-select-input', style: 'margin-left: 1rem;' }, // Attributes
  '::colors', // Binding syntax
  [
    { value: 'red', label: 'Red' },
    { value: 'green', label: 'Green' },
    { value: 'blue', label: 'Blue' },
  ] // Options
],



[
  'multipleSelect', // Type of field
  'colors', // Name/identifier of the field
  'Colors', // Label of the field
  { required: true, min: 2, max: 3 }, // Validation options
  { id: 'colorsSelect', class: 'form-select-input', style: 'margin-left: 1rem;' }, // Attributes
  '::colors', // Binding syntax
  [
    { value: 'red', label: 'Red' },
    { value: 'green', label: 'Green' },
    { value: 'blue', label: 'Blue' },
    { value: 'yellow', label: 'Yellow' },
  ] // Options
],


[
    'submit',
    'submitButton',
    'Submit',
    { required: true },
    { id: 'submitBtn', class: 'form-submit-btn', style: 'margin-top: 1rem;' }
  ],

*/


];


const formParams= {
method: 'post', 
action: 'submit.js', 
id: 'myForm', 
class: 'form',
semantq: true,
style: "width: 100%; font-size: 14px;"
//enctype: 'multipart/form-data', 
//target: '_blank', 
//nonvalidate: true, 
//accept_charset: 'UTF-8', 
  };

const form = new Formique(formParams);
const formHTML = form.renderForm(formSchema);
console.log(formHTML);





