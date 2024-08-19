import pretty from 'pretty';

// Base class for form rendering
class FormBuilder 
{


  renderField(type, name, label, validate, attributes, bindingSyntax, options) {
    throw new Error('Method renderField must be implemented');
  }

 

  
}



// Extended class for specific form rendering methods
class Formique extends FormBuilder {

 constructor (formParams = {}, formSchema) {
    super();
    this.formSchema=formSchema;
    this.divClass='input-block';
    this.inputClass='form-input';
    this.radioGroupClass='radio-group';
    this.checkboxGroupClass='checkbox-group';
    this.selectGroupClass='form-select';
    this.formParams=formParams;
    this.formMarkUp='';

    if (this.formParams) {
      this.formMarkUp += this.renderFormElement(); 
    }

    this.renderForm();


 }


 

// renderFormElement method
  renderFormElement() {
    let formHTML = '<form\n';
    // Use this.formParams directly
    const paramsToUse = this.formParams || {};

    // Dynamically add attributes if they are present in the parameters
    for (const [key, value] of Object.entries(paramsToUse)) {
      if (value !== undefined && value !== null) {
        // Handle boolean attributes
        if (typeof value === 'boolean') {
          if (value) {
            formHTML += `  ${key}\n`;
          }
        } else {
          // Handle other attributes
          const formattedKey = key === 'accept_charset' ? 'accept-charset' : key.replace(/_/g, '-');
          formHTML += `  ${formattedKey}="${value}"\n`;
        }
      }
    }

    // Close the <form> tag
    formHTML += '>\n';

    // Manually ensure vertical formatting of the HTML string
    formHTML = formHTML.replace(/\n\s*$/, '\n'); // Remove trailing whitespace/newline if necessary
    return formHTML;
  }


  // Main renderForm method
renderForm() {
    // Process each field synchronously
    const formHTML = this.formSchema.map(field => {
        const [type, name, label, validate, attributes = {}, bindingSyntax, options] = field;
        return this.renderField(type, name, label, validate, attributes, bindingSyntax, options);
    }).join('');
    
  //return formHTML;
  //return this.formMarkUp;

    this.formMarkUp += formHTML; 
    //console.log("here", this.formMarkUp);
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
      case 'datetime-local':
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
        return this.renderRadioField(type, name, label, validate, attributes, bindingSyntax, options);
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


 


// Specific rendering methods for each field type
renderTextField(type, name, label, validate, attributes, bindingSyntax) {

  //console.log("here");
  // Define valid attributes for different input types
  const textInputAttributes = [
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
  ];

  // Construct validation attributes
  let validationAttrs = '';
  if (validate) {
    Object.entries(validate).forEach(([key, value]) => {
      if (textInputAttributes.includes(key)) {
        if (typeof value === 'boolean' && value) {
          validationAttrs += `  ${key}\n`;
        } else {
          switch (key) {
            case 'minlength':
            case 'maxlength':
              validationAttrs += `  ${key}="${value}"\n`;
              break;
            default:
              if (!numberInputAttributes.includes(key)) {
              console.warn(`\x1b[31mUnsupported validation attribute '${key}' for field '${name}' of type 'number'.\x1b[0m`);
               }
              break;
          }
        }
      } else {
        console.warn(`\x1b[31mUnsupported validation attribute '${key}' for field '${name}' of type 'text'.\x1b[0m`);
      }
    });
  }

  // Handle the binding syntax
  let bindingDirective = '';
  if (bindingSyntax === 'bind:value' && name) {
    bindingDirective = `  bind:value="${name}"\n`;
  }
  if (bindingSyntax.startsWith('::') && name) {
   bindingDirective = `  bind:value="${name}"\n`;
  }
  if (bindingSyntax && !name) {
    console.log(`\x1b[31m%s\x1b[0m`, `You cannot set binding value when there is no name attribute defined in ${name} ${type} field.`);
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
          const eventValue = value.endsWith('()') ? value.slice(0, -2) : value;
          additionalAttrs += `  @${key.replace(/^on/, '')}={${eventValue}}\n`;
        } else {
          // Add parentheses if not present
          const eventValue = value.endsWith('()') ? value : `${value}()`;
          additionalAttrs += `  ${key}="${eventValue}"\n`;
        }
      } else {
        // Handle boolean attributes
        if (value === true) {
          additionalAttrs += `  ${key.replace(/_/g, '-')}\n`;
        } else if (value !== false) {
          // Convert underscores to hyphens and set the attribute
          additionalAttrs += `  ${key.replace(/_/g, '-')}="${value}"\n`;
        }
      }
    }
  }

  // Construct the final HTML string
  let formHTML = `
    <div class="${this.divClass}"> 
      <label for="${id}">${label}</label>
      <input 
        type="${type}"
        name="${name}"
        ${bindingDirective}
        id="${id}"
        ${additionalAttrs}
        ${validationAttrs}
      />
    </div>
  `.replace(/^\s*\n/gm, '').trim();

   // Format the entire HTML using pretty
  let formattedHtml = pretty(formHTML, {
    indent_size: 2,
    wrap_line_length: 0,
    preserve_newlines: true, // Preserve existing newlines
  });

  // Apply vertical layout to the <input> element only
  formattedHtml = formattedHtml.replace(/<input\s+([^>]*)\/>/, (match, p1) => {
    // Reformat attributes into a vertical layout
    const attributes = p1.trim().split(/\s+/).map(attr => `  ${attr}`).join('\n');
    return `<input\n${attributes}\n/>`;
  });

  // Ensure the <div> block starts on a new line
  /*
  formattedHtml = formattedHtml.replace(/<div\s+([^>]*)>/, (match) => {
    // Ensure <div> starts on a new line
    return `\n${match}\n`;
  });
  */
  

  //this.formMarkUp += formattedHtml;
  //console.log("HR",this.formMarkUp);
  return formattedHtml;
}




  // Specific rendering methods for each field type
renderEmailField(type, name, label, validate, attributes, bindingSyntax) {
  // Define valid attributes for the email input type
  const emailInputAttributes = [
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
  ];

  // Construct validation attributes
  let validationAttrs = '';
  if (validate) {
    Object.entries(validate).forEach(([key, value]) => {
      if (emailInputAttributes.includes(key)) {
        if (typeof value === 'boolean' && value) {
          validationAttrs += `  ${key}\n`;
        } else {
          switch (key) {
            case 'minlength':
            case 'maxlength':
              validationAttrs += `  ${key}="${value}"\n`;
              break;
            case 'pattern':
              validationAttrs += `  ${key}="${value}"\n`;
              break;
            default:
              if (!numberInputAttributes.includes(key)) {
              console.warn(`\x1b[31mUnsupported validation attribute '${key}' for field '${name}' of type 'number'.\x1b[0m`);
               }
              break;
          }
        }
      } else {
        console.warn(`\x1b[31mUnsupported validation attribute '${key}' for field '${name}' of type 'email'.\x1b[0m`);
      }
    });
  }

  // Handle the binding syntax
  let bindingDirective = '';
  if (bindingSyntax === 'bind:value' && name) {
    bindingDirective = `  bind:value="${name}"\n`;
  }
  if (bindingSyntax.startsWith('::') && name) {
   bindingDirective = `  bind:value="${name}"\n`;
  }
  if (bindingSyntax && !name) {
    console.log(`\x1b[31m%s\x1b[0m`, `You cannot set binding value when there is no name attribute defined in ${name} ${type} field.`);
    return;
  }

  // Get the id from attributes or fall back to name
  let id = attributes.id || name;

  // Construct additional attributes dynamically
  let additionalAttrs = '';
  for (const [key, value] of Object.entries(attributes)) {
    if (key !== 'id' && value !== undefined) {
      if (key.startsWith('on')) {
        // Handle event attributes
        const eventValue = value.endsWith('()') ? value.slice(0, -2) : value;
        additionalAttrs += `  @${key.replace(/^on/, '')}={${eventValue}}\n`;
      } else {
        // Handle boolean attributes
        if (value === true) {
          additionalAttrs += `  ${key.replace(/_/g, '-')}\n`;
        } else if (value !== false) {
          // Convert underscores to hyphens and set the attribute
          additionalAttrs += `  ${key.replace(/_/g, '-')}="${value}"\n`;
        }
      }
    }
  }

  // Construct the final HTML string
  let formHTML = `
    <div class="${this.divClass}"> 
      <label for="${id}">${label}</label>
      <input 
        type="${type}"
        name="${name}"
        ${bindingDirective}
        id="${id}"
        ${additionalAttrs}
        ${validationAttrs}
      />
    </div>
  `.replace(/^\s*\n/gm, '').trim();

  // Format the entire HTML using pretty
  let formattedHtml = pretty(formHTML, {
    indent_size: 2,
    wrap_line_length: 0,
    preserve_newlines: true, // Preserve existing newlines
  });

  // Apply vertical layout to the <input> element only
  formattedHtml = formattedHtml.replace(/<input\s+([^>]*)\/>/, (match, p1) => {
    // Reformat attributes into a vertical layout
    const attributes = p1.trim().split(/\s+/).map(attr => `  ${attr}`).join('\n');
    return `<input\n${attributes}\n/>`;
  });

  // Ensure the <div> block starts on a new line and remove extra blank lines
  
  formattedHtml = formattedHtml.replace(/(<div\s+[^>]*>)/g, (match) => {
    // Ensure <div> starts on a new line
    return `\n${match}\n`;
  }).replace(/\n\s*\n/g, '\n'); // Remove extra blank lines
  

  //this.formMarkUp += formattedHtml;

  return formattedHtml;
  //return this.formMarkUp;
  //console.log(this.formMarkUp);
}



renderNumberField(type, name, label, validate, attributes, bindingSyntax) {
  // Define valid attributes for the number input type
  const numberInputAttributes = [
    'required',
    'min',
    'max',
    'step',
    'placeholder',
    'readonly',
    'disabled',
    'size',
    'autocomplete',
    'inputmode',
    'title',
  ];

  // Construct validation attributes
  let validationAttrs = '';
  if (validate) {
    Object.entries(validate).forEach(([key, value]) => {
      if (numberInputAttributes.includes(key)) {
        if (typeof value === 'boolean' && value) {
          validationAttrs += `  ${key}\n`;
        } else {
          switch (key) {
            case 'min':
            case 'max':
              validationAttrs += `  ${key}="${value}"\n`;
              break;
            case 'step':
              validationAttrs += `  ${key}="${value}"\n`;
              break;
            default:
              if (!numberInputAttributes.includes(key)) {
              console.warn(`\x1b[31mUnsupported validation attribute '${key}' for field '${name}' of type 'number'.\x1b[0m`);
               }
              break;
          }
        }
      } else {
        console.warn(`\x1b[31mUnsupported validation attribute '${key}' for field '${name}' of type 'number'.\x1b[0m`);
      }
    });
  }

  // Handle the binding syntax
  let bindingDirective = '';
  if (bindingSyntax === 'bind:value' && name) {
    bindingDirective = `  bind:value="${name}"\n`;
  }
  if (bindingSyntax.startsWith('::') && name) {
   bindingDirective = `  bind:value="${name}"\n`;
  }
  if (bindingSyntax && !name) {
    console.log(`\x1b[31m%s\x1b[0m`, `You cannot set binding value when there is no name attribute defined in ${name} ${type} field.`);
    return;
  }


  // Get the id from attributes or fall back to name
  let id = attributes.id || name;

  // Construct additional attributes dynamically
  let additionalAttrs = '';
  for (const [key, value] of Object.entries(attributes)) {
    if (key !== 'id' && value !== undefined) {
      if (key.startsWith('on')) {
        // Handle event attributes
        const eventValue = value.endsWith('()') ? value.slice(0, -2) : value;
        additionalAttrs += `  @${key.replace(/^on/, '')}={${eventValue}}\n`;
      } else {
        // Handle boolean attributes
        if (value === true) {
          additionalAttrs += `  ${key.replace(/_/g, '-')}\n`;
        } else if (value !== false) {
          // Convert underscores to hyphens and set the attribute
          additionalAttrs += `  ${key.replace(/_/g, '-')}="${value}"\n`;
        }
      }
    }
  }

  // Construct the final HTML string
  let formHTML = `
    <div class="${this.divClass}"> 
      <label for="${id}">${label}</label>
      <input 
        type="${type}"
        name="${name}"
        ${bindingDirective}
        id="${id}"
        ${additionalAttrs}
        ${validationAttrs}
      />
    </div>
  `.replace(/^\s*\n/gm, '').trim();

  // Format the entire HTML using pretty
  let formattedHtml = pretty(formHTML, {
    indent_size: 2,
    wrap_line_length: 0,
    preserve_newlines: true, // Preserve existing newlines
  });

  // Apply vertical layout to the <input> element only
  formattedHtml = formattedHtml.replace(/<input\s+([^>]*)\/>/, (match, p1) => {
    // Reformat attributes into a vertical layout
    const attributes = p1.trim().split(/\s+/).map(attr => `  ${attr}`).join('\n');
    return `<input\n${attributes}\n/>`;
  });

  // Ensure the <div> block starts on a new line and remove extra blank lines
  formattedHtml = formattedHtml.replace(/(<div\s+[^>]*>)/g, (match) => {
    // Ensure <div> starts on a new line
    return `\n${match}\n`;
  }).replace(/\n\s*\n/g, '\n'); // Remove extra blank lines
  
  return formattedHtml;
}



// New method for rendering password fields
renderPasswordField(type, name, label, validate, attributes, bindingSyntax) {
  // Define valid attributes for the password input type
  const passwordInputAttributes = [
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
  ];

  // Construct validation attributes
  let validationAttrs = '';
  if (validate) {
    Object.entries(validate).forEach(([key, value]) => {
      if (passwordInputAttributes.includes(key)) {
        if (typeof value === 'boolean' && value) {
          validationAttrs += `  ${key}\n`;
        } else {
          switch (key) {
            case 'minlength':
            case 'maxlength':
            case 'pattern':
              validationAttrs += `  ${key}="${value}"\n`;
              break;
            default:
              if (!passwordInputAttributes.includes(key)) {
              console.warn(`\x1b[31mUnsupported validation attribute '${key}' for field '${name}' of type 'password'.\x1b[0m`);
               }
              break;
          }
        }
      } else {
        console.warn(`\x1b[31mUnsupported validation attribute '${key}' for field '${name}' of type 'password'.\x1b[0m`);
      }
    });
  }

  // Handle the binding syntax
  let bindingDirective = '';
  if (bindingSyntax === 'bind:value' && name) {
    bindingDirective = `  bind:value="${name}"\n`;
  }
  if (bindingSyntax.startsWith('::') && name) {
   bindingDirective = `  bind:value="${name}"\n`;
  }
  if (bindingSyntax && !name) {
    console.log(`\x1b[31m%s\x1b[0m`, `You cannot set binding value when there is no name attribute defined in ${name} ${type} field.`);
    return;
  }

  // Get the id from attributes or fall back to name
  let id = attributes.id || name;

  // Construct additional attributes dynamically
  let additionalAttrs = '';
  for (const [key, value] of Object.entries(attributes)) {
    if (key !== 'id' && value !== undefined) {
      if (key.startsWith('on')) {
        // Handle event attributes
        const eventValue = value.endsWith('()') ? value.slice(0, -2) : value;
        additionalAttrs += `  @${key.replace(/^on/, '')}={${eventValue}}\n`;
      } else {
        // Handle boolean attributes
        if (value === true) {
          additionalAttrs += `  ${key.replace(/_/g, '-')}\n`;
        } else if (value !== false) {
          // Convert underscores to hyphens and set the attribute
          additionalAttrs += `  ${key.replace(/_/g, '-')}="${value}"\n`;
        }
      }
    }
  }

  // Construct the final HTML string
  let formHTML = `
    <div class="${this.divClass}"> 
      <label for="${id}">${label}</label>
      <input 
        type="${type}"
        name="${name}"
        ${bindingDirective}
        id="${id}"
        ${additionalAttrs}
        ${validationAttrs}
      />
    </div>
  `.replace(/^\s*\n/gm, '').trim();

  // Format the entire HTML using pretty
  let formattedHtml = pretty(formHTML, {
    indent_size: 2,
    wrap_line_length: 0,
    preserve_newlines: true, // Preserve existing newlines
  });

  // Apply vertical layout to the <input> element only
  formattedHtml = formattedHtml.replace(/<input\s+([^>]*)\/>/, (match, p1) => {
    // Reformat attributes into a vertical layout
    const attributes = p1.trim().split(/\s+/).map(attr => `  ${attr}`).join('\n');
    return `<input\n${attributes}\n/>`;
  });

  // Ensure the <div> block starts on a new line and remove extra blank lines
  formattedHtml = formattedHtml.replace(/(<div\s+[^>]*>)/g, (match) => {
    // Ensure <div> starts on a new line
    return `\n${match}\n`;
  }).replace(/\n\s*\n/g, '\n'); // Remove extra blank lines

  return formattedHtml;
}






// New method for rendering tel fields
renderTelField(type, name, label, validate, attributes, bindingSyntax) {
  // Define valid attributes for the tel input type
  const telInputAttributes = [
  'required',
  'pattern',
  'placeholder',
  'readonly',
  'disabled',
  'size',
  'autocomplete',
  'spellcheck',
  'inputmode',
  'title',
  'minlength',
  'maxlength',
];


  // Construct validation attributes
  let validationAttrs = '';
  if (validate) {
    Object.entries(validate).forEach(([key, value]) => {
      if (telInputAttributes.includes(key)) {
        if (typeof value === 'boolean' && value) {
          validationAttrs += `  ${key}\n`;
        } else {
          switch (key) {
            case 'pattern':
              validationAttrs += `  ${key}="${value}"\n`;
              break;
            default:
              if (!telInputAttributes.includes(key)) {
              console.warn(`\x1b[31mUnsupported validation attribute '${key}' for field '${name}' of type 'tel'.\x1b[0m`);
               }
              break;
          }
        }
      } else {
        console.warn(`\x1b[31mUnsupported validation attribute '${key}' for field '${name}' of type 'tel'.\x1b[0m`);
      }
    });
  }

  // Handle the binding syntax
  let bindingDirective = '';
  if (bindingSyntax === 'bind:value' && name) {
    bindingDirective = `  bind:value="${name}"\n`;
  }
  if (bindingSyntax.startsWith('::') && name) {
    bindingDirective = `  bind:value="${name}"\n`;
  }
  if (bindingSyntax && !name) {
    console.log(`\x1b[31m%s\x1b[0m`, `You cannot set binding value when there is no name attribute defined in ${name} ${type} field.`);
    return;
  }

  // Get the id from attributes or fall back to name
  let id = attributes.id || name;

  // Construct additional attributes dynamically
  let additionalAttrs = '';
  for (const [key, value] of Object.entries(attributes)) {
    if (key !== 'id' && value !== undefined) {
      if (key.startsWith('on')) {
        // Handle event attributes
        const eventValue = value.endsWith('()') ? value.slice(0, -2) : value;
        additionalAttrs += `  @${key.replace(/^on/, '')}={${eventValue}}\n`;
      } else {
        // Handle boolean attributes
        if (value === true) {
          additionalAttrs += `  ${key.replace(/_/g, '-')}\n`;
        } else if (value !== false) {
          // Convert underscores to hyphens and set the attribute
          additionalAttrs += `  ${key.replace(/_/g, '-')}="${value}"\n`;
        }
      }
    }
  }

  // Construct the final HTML string
  let formHTML = `
    <div class="${this.divClass}">
      <label for="${id}">${label}</label>
      <input 
        type="${type}"
        name="${name}"
        ${bindingDirective}
        id="${id}"
        ${additionalAttrs}
        ${validationAttrs}
      />
    </div>
  `.replace(/^\s*\n/gm, '').trim();

  // Format the entire HTML using pretty
  let formattedHtml = pretty(formHTML, {
    indent_size: 2,
    wrap_line_length: 0,
    preserve_newlines: true, // Preserve existing newlines
  });

  // Apply vertical layout to the <input> element only
  formattedHtml = formattedHtml.replace(/<input\s+([^>]*)\/>/, (match, p1) => {
    // Reformat attributes into a vertical layout
    const attributes = p1.trim().split(/\s+/).map(attr => `  ${attr}`).join('\n');
    return `<input\n${attributes}\n/>`;
  });

  // Ensure the <div> block starts on a new line and remove extra blank lines
  formattedHtml = formattedHtml.replace(/(<div\s+[^>]*>)/g, (match) => {
    // Ensure <div> starts on a new line
    return `\n${match}\n`;
  }).replace(/\n\s*\n/g, '\n'); // Remove extra blank lines

  return formattedHtml;
}



renderDateField(type, name, label, validate, attributes, bindingSyntax) {
  // Define valid attributes for the date input type
  const dateInputAttributes = [
    'required',
    'min',
    'max',
    'step',
    'placeholder',
    'readonly',
    'disabled',
    'autocomplete',
    'spellcheck',
    'inputmode',
    'title',
  ];

  // Construct validation attributes
  let validationAttrs = '';
  if (validate) {
    Object.entries(validate).forEach(([key, value]) => {
      if (dateInputAttributes.includes(key)) {
        if (typeof value === 'boolean' && value) {
          validationAttrs += `  ${key}\n`;
        } else {
          switch (key) {
            case 'min':
            case 'max':
            case 'step':
              validationAttrs += `  ${key}="${value}"\n`;
              break;
            default:
              if (!dateInputAttributes.includes(key)) {
                console.warn(`\x1b[31mUnsupported validation attribute '${key}' for field '${name}' of type 'date'.\x1b[0m`);
              }
              break;
          }
        }
      } else {
        console.warn(`\x1b[31mUnsupported validation attribute '${key}' for field '${name}' of type 'date'.\x1b[0m`);
      }
    });
  }

  // Handle the binding syntax
  let bindingDirective = '';
  if (bindingSyntax === 'bind:value' && name) {
    bindingDirective = `  bind:value="${name}"\n`;
  }
  if (bindingSyntax.startsWith('::') && name) {
    bindingDirective = `  bind:value="${name}"\n`;
  }
  if (bindingSyntax && !name) {
    console.log(`\x1b[31m%s\x1b[0m`, `You cannot set binding value when there is no name attribute defined in ${name} ${type} field.`);
    return;
  }

  // Get the id from attributes or fall back to name
  let id = attributes.id || name;

  // Construct additional attributes dynamically
  let additionalAttrs = '';
  for (const [key, value] of Object.entries(attributes)) {
    if (key !== 'id' && value !== undefined) {
      if (key.startsWith('on')) {
        // Handle event attributes
        const eventValue = value.endsWith('()') ? value.slice(0, -2) : value;
        additionalAttrs += `  @${key.replace(/^on/, '')}={${eventValue}}\n`;
      } else {
        // Handle boolean attributes
        if (value === true) {
          additionalAttrs += `  ${key.replace(/_/g, '-')}\n`;
        } else if (value !== false) {
          // Convert underscores to hyphens and set the attribute
          additionalAttrs += `  ${key.replace(/_/g, '-')}="${value}"\n`;
        }
      }
    }
  }

  // Construct the final HTML string
  let formHTML = `
    <div class="${this.divClass}"> 
      <label for="${id}">${label}</label>
      <input 
        type="${type}"
        name="${name}"
        ${bindingDirective}
        id="${id}"
        ${additionalAttrs}
        ${validationAttrs}
      />
    </div>
  `.replace(/^\s*\n/gm, '').trim();

  // Format the entire HTML using pretty
  let formattedHtml = pretty(formHTML, {
    indent_size: 2,
    wrap_line_length: 0,
    preserve_newlines: true, // Preserve existing newlines
  });

  // Apply vertical layout to the <input> element only
  formattedHtml = formattedHtml.replace(/<input\s+([^>]*)\/>/, (match, p1) => {
    // Reformat attributes into a vertical layout
    const attributes = p1.trim().split(/\s+/).map(attr => `  ${attr}`).join('\n');
    return `<input\n${attributes}\n/>`;
  });

  // Ensure the <div> block starts on a new line and remove extra blank lines
  formattedHtml = formattedHtml.replace(/(<div\s+[^>]*>)/g, (match) => {
    // Ensure <div> starts on a new line
    return `\n${match}\n`;
  }).replace(/\n\s*\n/g, '\n'); // Remove extra blank lines

  return formattedHtml;
}



renderTimeField(type, name, label, validate, attributes, bindingSyntax) {
  // Define valid attributes for the time input type
  const timeInputAttributes = [
    'required',
    'min',
    'max',
    'step',
    'readonly',
    'disabled',
    'autocomplete',
    'spellcheck',
    'inputmode',
    'title',
  ];

  // Construct validation attributes
  let validationAttrs = '';
  if (validate) {
    Object.entries(validate).forEach(([key, value]) => {
      if (timeInputAttributes.includes(key)) {
        if (typeof value === 'boolean' && value) {
          validationAttrs += `  ${key}\n`;
        } else {
          switch (key) {
            case 'min':
            case 'max':
            case 'step':
              validationAttrs += `  ${key}="${value}"\n`;
              break;
            default:
              if (!timeInputAttributes.includes(key)) {
                console.warn(`\x1b[31mUnsupported validation attribute '${key}' for field '${name}' of type '${type}'.\x1b[0m`);
              }
              break;
          }
        }
      } else {
        console.warn(`\x1b[31mUnsupported validation attribute '${key}' for field '${name}' of type '${type}'.\x1b[0m`);
      }
    });
  }

  // Handle the binding syntax
  let bindingDirective = '';
  if (bindingSyntax === 'bind:value' && name) {
    bindingDirective = `  bind:value="${name}"\n`;
  }
  if (bindingSyntax.startsWith('::') && name) {
    bindingDirective = `  bind:value="${name}"\n`;
  }
  if (bindingSyntax && !name) {
    console.log(`\x1b[31m%s\x1b[0m`, `You cannot set binding value when there is no name attribute defined in ${name} ${type} field.`);
    return;
  }

  // Get the id from attributes or fall back to name
  let id = attributes.id || name;

  // Construct additional attributes dynamically
  let additionalAttrs = '';
  for (const [key, value] of Object.entries(attributes)) {
    if (key !== 'id' && value !== undefined) {
      if (key.startsWith('on')) {
        // Handle event attributes
        const eventValue = value.endsWith('()') ? value.slice(0, -2) : value;
        additionalAttrs += `  @${key.replace(/^on/, '')}={${eventValue}}\n`;
      } else {
        // Handle boolean attributes
        if (value === true) {
          additionalAttrs += `  ${key.replace(/_/g, '-')}\n`;
        } else if (value !== false) {
          // Convert underscores to hyphens and set the attribute
          additionalAttrs += `  ${key.replace(/_/g, '-')}="${value}"\n`;
        }
      }
    }
  }

  // Construct the final HTML string
  let formHTML = `
    <div class="${this.divClass}"> 
      <label for="${id}">${label}</label>
      <input 
        type="${type}"
        name="${name}"
        ${bindingDirective}
        id="${id}"
        ${additionalAttrs}
        ${validationAttrs}
      />
    </div>
  `.replace(/^\s*\n/gm, '').trim();

  // Format the entire HTML using pretty
  let formattedHtml = pretty(formHTML, {
    indent_size: 2,
    wrap_line_length: 0,
    preserve_newlines: true, // Preserve existing newlines
  });

  // Apply vertical layout to the <input> element only
  formattedHtml = formattedHtml.replace(/<input\s+([^>]*)\/>/, (match, p1) => {
    // Reformat attributes into a vertical layout
    const attributes = p1.trim().split(/\s+/).map(attr => `  ${attr}`).join('\n');
    return `<input\n${attributes}\n/>`;
  });

  // Ensure the <div> block starts on a new line and remove extra blank lines
  formattedHtml = formattedHtml.replace(/(<div\s+[^>]*>)/g, (match) => {
    // Ensure <div> starts on a new line
    return `\n${match}\n`;
  }).replace(/\n\s*\n/g, '\n'); // Remove extra blank lines

  return formattedHtml;
}




renderDateTimeField(type, name, label, validate, attributes, bindingSyntax) {
  // Define valid attributes for the datetime input type
  const dateTimeInputAttributes = [
    'required',
    'min',
    'max',
    'step',
    'readonly',
    'disabled',
    'autocomplete',
    'spellcheck',
    'inputmode',
    'title',
  ];

  // Construct validation attributes
  let validationAttrs = '';
  if (validate) {
    Object.entries(validate).forEach(([key, value]) => {
      if (dateTimeInputAttributes.includes(key)) {
        if (typeof value === 'boolean' && value) {
          validationAttrs += `  ${key}\n`;
        } else {
          switch (key) {
            case 'min':
            case 'max':
            case 'step':
              validationAttrs += `  ${key}="${value}"\n`;
              break;
            default:
              if (!dateTimeInputAttributes.includes(key)) {
                console.warn(`\x1b[31mUnsupported validation attribute '${key}' for field '${name}' of type '${type}'.\x1b[0m`);
              }
              break;
          }
        }
      } else {
        console.warn(`\x1b[31mUnsupported validation attribute '${key}' for field '${name}' of type '${type}'.\x1b[0m`);
      }
    });
  }

  // Handle the binding syntax
  let bindingDirective = '';
  if (bindingSyntax === 'bind:value' && name) {
    bindingDirective = `  bind:value="${name}"\n`;
  } if (bindingSyntax.startsWith('::') && name) {
    bindingDirective = `  bind:value="${name}"\n`;
  }
  if (bindingSyntax && !name) {
    console.log(`\x1b[31m%s\x1b[0m`, `You cannot set binding value when there is no name attribute defined in ${name} ${type} field.`);
    return;
  }

  // Get the id from attributes or fall back to name
  let id = attributes.id || name;

  // Construct additional attributes dynamically
  let additionalAttrs = '';
  for (const [key, value] of Object.entries(attributes)) {
    if (key !== 'id' && value !== undefined) {
      if (key.startsWith('on')) {
        // Handle event attributes
        const eventValue = value.endsWith('()') ? value.slice(0, -2) : value;
        additionalAttrs += `  @${key.replace(/^on/, '')}={${eventValue}}\n`;
      } else {
        // Handle boolean attributes
        if (value === true) {
          additionalAttrs += `  ${key.replace(/_/g, '-')}\n`;
        } else if (value !== false) {
          // Convert underscores to hyphens and set the attribute
          additionalAttrs += `  ${key.replace(/_/g, '-')}="${value}"\n`;
        }
      }
    }
  }

  // Construct the final HTML string
  let formHTML = `
    <div class="${this.divClass}"> 
      <label for="${id}">${label}</label>
      <input 
        type="${type}"
        name="${name}"
        ${bindingDirective}
        id="${id}"
        ${additionalAttrs}
        ${validationAttrs}
      />
    </div>
  `.replace(/^\s*\n/gm, '').trim();

  // Format the entire HTML using pretty
  let formattedHtml = pretty(formHTML, {
    indent_size: 2,
    wrap_line_length: 0,
    preserve_newlines: true, // Preserve existing newlines
  });

  // Apply vertical layout to the <input> element only
  formattedHtml = formattedHtml.replace(/<input\s+([^>]*)\/>/, (match, p1) => {
    // Reformat attributes into a vertical layout
    const attributes = p1.trim().split(/\s+/).map(attr => `  ${attr}`).join('\n');
    return `<input\n${attributes}\n/>`;
  });

  // Ensure the <div> block starts on a new line and remove extra blank lines
  formattedHtml = formattedHtml.replace(/(<div\s+[^>]*>)/g, (match) => {
    // Ensure <div> starts on a new line
    return `\n${match}\n`;
  }).replace(/\n\s*\n/g, '\n'); // Remove extra blank lines

  return formattedHtml;
}







renderMonthField(type, name, label, validate, attributes, bindingSyntax) {
  // Define valid attributes for the month input type
  const monthInputAttributes = [
    'required',
    'min',
    'max',
    'pattern',
    'placeholder',
    'readonly',
    'disabled',
    'size',
    'autocomplete',
    'spellcheck',
    'inputmode',
    'title',
  ];

  // Construct validation attributes
  let validationAttrs = '';
  if (validate) {
    Object.entries(validate).forEach(([key, value]) => {
      if (monthInputAttributes.includes(key)) {
        if (typeof value === 'boolean' && value) {
          validationAttrs += `  ${key}\n`;
        } else {
          switch (key) {
            case 'min':
            case 'max':
            case 'pattern':
              validationAttrs += `  ${key}="${value}"\n`;
              break;
            default:
               if (monthInputAttributes.includes(key)) {
              console.warn(`\x1b[31mUnsupported validation attribute '${key}' for field '${name}' of type 'month'.\x1b[0m`);
               }
              break;
          }
        }
      } else {
        console.warn(`\x1b[31mUnsupported validation attribute '${key}' for field '${name}' of type 'month'.\x1b[0m`);
      }
    });
  }

  // Handle the binding syntax
  let bindingDirective = '';
  if (bindingSyntax === 'bind:value' && name) {
    bindingDirective = `  bind:value="${name}"\n`;
  } if (bindingSyntax.startsWith('::') && name) {
    bindingDirective = `  bind:value="${name}"\n`;
  } if (bindingSyntax && !name) {
    console.log(`\x1b[31m%s\x1b[0m`, `You cannot set binding value when there is no name attribute defined in ${name} ${type} field.`);
    return;
  }

  // Get the id from attributes or fall back to name
  let id = attributes.id || name;

  // Construct additional attributes dynamically
  let additionalAttrs = '';
  for (const [key, value] of Object.entries(attributes)) {
    if (key !== 'id' && value !== undefined) {
      if (key.startsWith('on')) {
        // Handle event attributes
        const eventValue = value.endsWith('()') ? value.slice(0, -2) : value;
        additionalAttrs += `  @${key.replace(/^on/, '')}={${eventValue}}\n`;
      } else {
        // Handle boolean attributes
        if (value === true) {
          additionalAttrs += `  ${key.replace(/_/g, '-')}\n`;
        } else if (value !== false) {
          // Convert underscores to hyphens and set the attribute
          additionalAttrs += `  ${key.replace(/_/g, '-')}="${value}"\n`;
        }
      }
    }
  }

  // Construct the final HTML string
  let formHTML = `
    <div class="${this.divClass}">
      <label for="${id}">${label}</label>
      <input 
        type="${type}"
        name="${name}"
        ${bindingDirective}
        id="${id}"
        ${additionalAttrs}
        ${validationAttrs}
      />
    </div>
  `.replace(/^\s*\n/gm, '').trim();

  // Format the entire HTML using pretty
  let formattedHtml = pretty(formHTML, {
    indent_size: 2,
    wrap_line_length: 0,
    preserve_newlines: true, // Preserve existing newlines
  });

  // Apply vertical layout to the <input> element only
  formattedHtml = formattedHtml.replace(/<input\s+([^>]*)\/>/, (match, p1) => {
    // Reformat attributes into a vertical layout
    const attributes = p1.trim().split(/\s+/).map(attr => `  ${attr}`).join('\n');
    return `<input\n${attributes}\n/>`;
  });

  // Ensure the <div> block starts on a new line and remove extra blank lines
  formattedHtml = formattedHtml.replace(/(<div\s+[^>]*>)/g, (match) => {
    // Ensure <div> starts on a new line
    return `\n${match}\n`;
  }).replace(/\n\s*\n/g, '\n'); // Remove extra blank lines

  return formattedHtml;
}



renderWeekField(type, name, label, validate, attributes, bindingSyntax) {
  // Define valid attributes for the week input type
  const weekInputAttributes = [
    'required',
    'min',
    'max',
    'pattern',
    'placeholder',
    'readonly',
    'disabled',
    'size',
    'autocomplete',
    'spellcheck',
    'inputmode',
    'title',
  ];

  // Construct validation attributes
  let validationAttrs = '';
  if (validate) {
    Object.entries(validate).forEach(([key, value]) => {
      if (weekInputAttributes.includes(key)) {
        if (typeof value === 'boolean' && value) {
          validationAttrs += `  ${key}\n`;
        } else {
          switch (key) {
            case 'min':
            case 'max':
            case 'pattern':
              validationAttrs += `  ${key}="${value}"\n`;
              break;
            default:
              if (weekInputAttributes.includes(key)) {
              console.warn(`\x1b[31mUnsupported validation attribute '${key}' for field '${name}' of type 'week'.\x1b[0m`);
               }
              break;
          }
        }
      } else {
        console.warn(`\x1b[31mUnsupported validation attribute '${key}' for field '${name}' of type 'week'.\x1b[0m`);
      }
    });
  }

  // Handle the binding syntax
  let bindingDirective = '';
  if (bindingSyntax === 'bind:value' && name) {
    bindingDirective = `  bind:value="${name}"\n`;
  } if (bindingSyntax.startsWith('::') && name) {
    bindingDirective = `  bind:value="${name}"\n`;
  } if (bindingSyntax  && !name) {
    console.log(`\x1b[31m%s\x1b[0m`, `You cannot set binding value when there is no name attribute defined in ${name} ${type} field.`);
    return;
  }

  // Get the id from attributes or fall back to name
  let id = attributes.id || name;

  // Construct additional attributes dynamically
  let additionalAttrs = '';
  for (const [key, value] of Object.entries(attributes)) {
    if (key !== 'id' && value !== undefined) {
      if (key.startsWith('on')) {
        // Handle event attributes
        const eventValue = value.endsWith('()') ? value.slice(0, -2) : value;
        additionalAttrs += `  @${key.replace(/^on/, '')}={${eventValue}}\n`;
      } else {
        // Handle boolean attributes
        if (value === true) {
          additionalAttrs += `  ${key.replace(/_/g, '-')}\n`;
        } else if (value !== false) {
          // Convert underscores to hyphens and set the attribute
          additionalAttrs += `  ${key.replace(/_/g, '-')}="${value}"\n`;
        }
      }
    }
  }

  // Construct the final HTML string
  let formHTML = `
    <div class="${this.divClass}">
      <label for="${id}">${label}</label>
      <input 
        type="${type}"
        name="${name}"
        ${bindingDirective}
        id="${id}"
        ${additionalAttrs}
        ${validationAttrs}
      />
    </div>
  `.replace(/^\s*\n/gm, '').trim();

  // Format the entire HTML using pretty
  let formattedHtml = pretty(formHTML, {
    indent_size: 2,
    wrap_line_length: 0,
    preserve_newlines: true, // Preserve existing newlines
  });

  // Apply vertical layout to the <input> element only
  formattedHtml = formattedHtml.replace(/<input\s+([^>]*)\/>/, (match, p1) => {
    // Reformat attributes into a vertical layout
    const attributes = p1.trim().split(/\s+/).map(attr => `  ${attr}`).join('\n');
    return `<input\n${attributes}\n/>`;
  });

  // Ensure the <div> block starts on a new line and remove extra blank lines
  formattedHtml = formattedHtml.replace(/(<div\s+[^>]*>)/g, (match) => {
    // Ensure <div> starts on a new line
    return `\n${match}\n`;
  }).replace(/\n\s*\n/g, '\n'); // Remove extra blank lines

  return formattedHtml;
}



renderUrlField(type, name, label, validate, attributes, bindingSyntax) {
  // Define valid attributes for the URL input type
  const urlInputAttributes = [
    'required',
    'pattern',
    'placeholder',
    'readonly',
    'disabled',
    'size',
    'autocomplete',
    'spellcheck',
    'inputmode',
    'title',
  ];

  // Construct validation attributes
  let validationAttrs = '';
  if (validate) {
    Object.entries(validate).forEach(([key, value]) => {
      if (urlInputAttributes.includes(key)) {
        if (typeof value === 'boolean' && value) {
          validationAttrs += `  ${key}\n`;
        } else {
          switch (key) {
            case 'pattern':
              validationAttrs += `  ${key}="${value}"\n`;
              break;
            default:
              if (!urlInputAttributes.includes(key)) {
                console.warn(`\x1b[31mUnsupported validation attribute '${key}' for field '${name}' of type '${type}'.\x1b[0m`);
              }
              break;
          }
        }
      } else {
        console.warn(`\x1b[31mUnsupported validation attribute '${key}' for field '${name}' of type '${type}'.\x1b[0m`);
      }
    });
  }

  // Handle the binding syntax
  let bindingDirective = '';
  if (bindingSyntax === 'bind:value' && name) {
    bindingDirective = `  bind:value="${name}"\n`;
  } if (bindingSyntax.startsWith('::') && name) {
    bindingDirective = `  bind:value="${name}"\n`;
  } if (bindingSyntax && !name) {
    console.log(`\x1b[31m%s\x1b[0m`, `You cannot set binding value when there is no name attribute defined in ${name} ${type} field.`);
    return;
  }

  // Get the id from attributes or fall back to name
  let id = attributes.id || name;

  // Construct additional attributes dynamically
  let additionalAttrs = '';
  for (const [key, value] of Object.entries(attributes)) {
    if (key !== 'id' && value !== undefined) {
      if (key.startsWith('on')) {
        // Handle event attributes
        const eventValue = value.endsWith('()') ? value.slice(0, -2) : value;
        additionalAttrs += `  @${key.replace(/^on/, '')}={${eventValue}}\n`;
      } else {
        // Handle boolean attributes
        if (value === true) {
          additionalAttrs += `  ${key.replace(/_/g, '-')}\n`;
        } else if (value !== false) {
          // Convert underscores to hyphens and set the attribute
          additionalAttrs += `  ${key.replace(/_/g, '-')}="${value}"\n`;
        }
      }
    }
  }

  // Construct the final HTML string
  let formHTML = `
    <div class="${this.divClass}">
      <label for="${id}">${label}</label>
      <input 
        type="${type}"
        name="${name}"
        ${bindingDirective}
        id="${id}"
        ${additionalAttrs}
        ${validationAttrs}
      />
    </div>
  `.replace(/^\s*\n/gm, '').trim();

  // Format the entire HTML using pretty
  let formattedHtml = pretty(formHTML, {
    indent_size: 2,
    wrap_line_length: 0,
    preserve_newlines: true, // Preserve existing newlines
  });

  // Apply vertical layout to the <input> element only
  formattedHtml = formattedHtml.replace(/<input\s+([^>]*)\/>/, (match, p1) => {
    // Reformat attributes into a vertical layout
    const attributes = p1.trim().split(/\s+/).map(attr => `  ${attr}`).join('\n');
    return `<input\n${attributes}\n/>`;
  });

  // Ensure the <div> block starts on a new line and remove extra blank lines
  formattedHtml = formattedHtml.replace(/(<div\s+[^>]*>)/g, (match) => {
    // Ensure <div> starts on a new line
    return `\n${match}\n`;
  }).replace(/\n\s*\n/g, '\n'); // Remove extra blank lines

  return formattedHtml;
}


renderSearchField(type, name, label, validate, attributes, bindingSyntax) {
  // Define valid attributes for the search input type
  const searchInputAttributes = [
    'required',
    'pattern',
    'placeholder',
    'readonly',
    'disabled',
    'size',
    'autocomplete',
    'spellcheck',
    'inputmode',
    'title',
  ];

  // Construct validation attributes
  let validationAttrs = '';
  if (validate) {
    Object.entries(validate).forEach(([key, value]) => {
      if (searchInputAttributes.includes(key)) {
        if (typeof value === 'boolean' && value) {
          validationAttrs += `  ${key}\n`;
        } else {
          switch (key) {
            case 'pattern':
              validationAttrs += `  ${key}="${value}"\n`;
              break;
            default:
              if (!searchInputAttributes.includes(key)) {
                console.warn(`\x1b[31mUnsupported validation attribute '${key}' for field '${name}' of type '${type}'.\x1b[0m`);
              }
              break;
          }
        }
      } else {
        console.warn(`\x1b[31mUnsupported validation attribute '${key}' for field '${name}' of type '${type}'.\x1b[0m`);
      }
    });
  }

  // Handle the binding syntax
  let bindingDirective = '';
  if (bindingSyntax === 'bind:value' && name) {
    bindingDirective = `  bind:value="${name}"\n`;
  } if (bindingSyntax.startsWith('::') && name) {
    bindingDirective = `  bind:value="${name}"\n`;
  } if (bindingSyntax && !name) {
    console.log(`\x1b[31m%s\x1b[0m`, `You cannot set binding value when there is no name attribute defined in ${name} ${type} field.`);
    return;
  }

  // Get the id from attributes or fall back to name
  let id = attributes.id || name;

  // Construct additional attributes dynamically
  let additionalAttrs = '';
  for (const [key, value] of Object.entries(attributes)) {
    if (key !== 'id' && value !== undefined) {
      if (key.startsWith('on')) {
        // Handle event attributes
        const eventValue = value.endsWith('()') ? value.slice(0, -2) : value;
        additionalAttrs += `  @${key.replace(/^on/, '')}={${eventValue}}\n`;
      } else {
        // Handle boolean attributes
        if (value === true) {
          additionalAttrs += `  ${key.replace(/_/g, '-')}\n`;
        } else if (value !== false) {
          // Convert underscores to hyphens and set the attribute
          additionalAttrs += `  ${key.replace(/_/g, '-')}="${value}"\n`;
        }
      }
    }
  }

  // Construct the final HTML string
  let formHTML = `
    <div class="${this.divClass}">
      <label for="${id}">${label}</label>
      <input 
        type="${type}"
        name="${name}"
        ${bindingDirective}
        id="${id}"
        ${additionalAttrs}
        ${validationAttrs}
      />
    </div>
  `.replace(/^\s*\n/gm, '').trim();

  // Format the entire HTML using pretty
  let formattedHtml = pretty(formHTML, {
    indent_size: 2,
    wrap_line_length: 0,
    preserve_newlines: true, // Preserve existing newlines
  });

  // Apply vertical layout to the <input> element only
  formattedHtml = formattedHtml.replace(/<input\s+([^>]*)\/>/, (match, p1) => {
    // Reformat attributes into a vertical layout
    const attributes = p1.trim().split(/\s+/).map(attr => `  ${attr}`).join('\n');
    return `<input\n${attributes}\n/>`;
  });

  // Ensure the <div> block starts on a new line and remove extra blank lines
  formattedHtml = formattedHtml.replace(/(<div\s+[^>]*>)/g, (match) => {
    // Ensure <div> starts on a new line
    return `\n${match}\n`;
  }).replace(/\n\s*\n/g, '\n'); // Remove extra blank lines

  return formattedHtml;
}


renderColorField(type, name, label, validate, attributes, bindingSyntax) {
  // Define valid attributes for the color input type
  const colorInputAttributes = [
    'required',
    'readonly',
    'disabled',
    'autocomplete',
    'inputmode',
    'title',
  ];

  // Construct validation attributes
  let validationAttrs = '';
  if (validate) {
    Object.entries(validate).forEach(([key, value]) => {
      if (colorInputAttributes.includes(key)) {
        if (typeof value === 'boolean' && value) {
          validationAttrs += `  ${key}\n`;
        } else {
          switch (key) {
            default:
              if (!colorInputAttributes.includes(key)) {
                console.warn(`\x1b[31mUnsupported validation attribute '${key}' for field '${name}' of type '${type}'.\x1b[0m`);
              }
              break;
          }
        }
      } else {
        console.warn(`\x1b[31mUnsupported validation attribute '${key}' for field '${name}' of type '${type}'.\x1b[0m`);
      }
    });
  }

  // Handle the binding syntax
  let bindingDirective = '';
  if (bindingSyntax === 'bind:value') {
    bindingDirective = `  bind:value="${name}"\n`;
  } else if (bindingSyntax.startsWith('::') && name) {
    bindingDirective = `  bind:value="${name}"\n`;
  }
  if (bindingSyntax && !name) {
    console.log(`\x1b[31m%s\x1b[0m`, `You cannot set binding value when there is no name attribute defined in ${name} ${type} field.`);
    return;
  }

  // Get the id from attributes or fall back to name
  let id = attributes.id || name;

  // Construct additional attributes dynamically
  let additionalAttrs = '';
  for (const [key, value] of Object.entries(attributes)) {
    if (key !== 'id' && value !== undefined) {
      if (key.startsWith('on')) {
        // Handle event attributes
        const eventValue = value.endsWith('()') ? value.slice(0, -2) : value;
        additionalAttrs += `  @${key.replace(/^on/, '')}={${eventValue}}\n`;
      } else {
        // Handle boolean attributes
        if (value === true) {
          additionalAttrs += `  ${key.replace(/_/g, '-')}\n`;
        } else if (value !== false) {
          // Convert underscores to hyphens and set the attribute
          additionalAttrs += `  ${key.replace(/_/g, '-')}="${value}"\n`;
        }
      }
    }
  }

  // Construct the final HTML string
  let formHTML = `
    <div class="${this.divClass}">
      <label for="${id}">${label}</label>
      <input 
        type="${type}"
        name="${name}"
        ${bindingDirective}
        id="${id}"
        ${additionalAttrs}
        ${validationAttrs}
      />
    </div>
  `.replace(/^\s*\n/gm, '').trim();

  // Format the entire HTML using pretty
  let formattedHtml = pretty(formHTML, {
    indent_size: 2,
    wrap_line_length: 0,
    preserve_newlines: true, // Preserve existing newlines
  });

  // Apply vertical layout to the <input> element only
  formattedHtml = formattedHtml.replace(/<input\s+([^>]*)\/>/, (match, p1) => {
    // Reformat attributes into a vertical layout
    const attributes = p1.trim().split(/\s+/).map(attr => `  ${attr}`).join('\n');
    return `<input\n${attributes}\n/>`;
  });

  // Ensure the <div> block starts on a new line and remove extra blank lines
  formattedHtml = formattedHtml.replace(/(<div\s+[^>]*>)/g, (match) => {
    // Ensure <div> starts on a new line
    return `\n${match}\n`;
  }).replace(/\n\s*\n/g, '\n'); // Remove extra blank lines

  return formattedHtml;
}






renderFileField(type, name, label, validate, attributes, bindingSyntax) {
  // Define valid attributes for the file input type
  const fileInputAttributes = [
    'required',
    'accept',
    'multiple',
    'disabled',
    'title',
  ];

  // Construct validation attributes
  let validationAttrs = '';
  if (validate) {
    Object.entries(validate).forEach(([key, value]) => {
      if (fileInputAttributes.includes(key)) {
        if (typeof value === 'boolean' && value) {
          validationAttrs += `  ${key}\n`;
        } else {
          switch (key) {
            default:
              if (!fileInputAttributes.includes(key)) {
                console.warn(`\x1b[31mUnsupported validation attribute '${key}' for field '${name}' of type '${type}'.\x1b[0m`);
              }
              break;
          }
        }
      } else {
        console.warn(`\x1b[31mUnsupported validation attribute '${key}' for field '${name}' of type '${type}'.\x1b[0m`);
      }
    });
  }

  // Handle the binding syntax
  let bindingDirective = '';
  if (bindingSyntax === 'bind:value') {
    bindingDirective = `  bind:value="${name}"\n`;
  } if (bindingSyntax.startsWith('::') && name) {
    bindingDirective = `  bind:value="${name}"\n`;
  }
  if (bindingSyntax && !name) {
    console.log(`\x1b[31m%s\x1b[0m`, `You cannot set binding value when there is no name attribute defined in ${name} ${type} field.`);
    return;
  }

  // Get the id from attributes or fall back to name
  let id = attributes.id || name;

  // Construct additional attributes dynamically
  let additionalAttrs = '';
  for (const [key, value] of Object.entries(attributes)) {
    if (key !== 'id' && value !== undefined) {
      if (key.startsWith('on')) {
        // Handle event attributes
        const eventValue = value.endsWith('()') ? value.slice(0, -2) : value;
        additionalAttrs += `  @${key.replace(/^on/, '')}={${eventValue}}\n`;
      } else {
        // Handle boolean attributes
        if (value === true) {
          additionalAttrs += `  ${key.replace(/_/g, '-')}\n`;
        } else if (value !== false) {
          // Convert underscores to hyphens and set the attribute
          additionalAttrs += `  ${key.replace(/_/g, '-')}="${value}"\n`;
        }
      }
    }
  }

  // Construct the final HTML string
  let formHTML = `
    <div class="${this.divClass}">
      <label for="${id}">${label}</label>
      <input 
        type="${type}"
        name="${name}"
        ${bindingDirective}
        id="${id}"
        ${additionalAttrs}
        ${validationAttrs}
      />
    </div>
  `.replace(/^\s*\n/gm, '').trim();

  // Format the entire HTML using pretty
  let formattedHtml = pretty(formHTML, {
    indent_size: 2,
    wrap_line_length: 0,
    preserve_newlines: true, // Preserve existing newlines
  });

  // Apply vertical layout to the <input> element only
  formattedHtml = formattedHtml.replace(/<input\s+([^>]*)\/>/, (match, p1) => {
    // Reformat attributes into a vertical layout
    const attributes = p1.trim().split(/\s+/).map(attr => `  ${attr}`).join('\n');
    return `<input\n${attributes}\n/>`;
  });

  // Ensure the <div> block starts on a new line and remove extra blank lines
  formattedHtml = formattedHtml.replace(/(<div\s+[^>]*>)/g, (match) => {
    // Ensure <div> starts on a new line
    return `\n${match}\n`;
  }).replace(/\n\s*\n/g, '\n'); // Remove extra blank lines

  return formattedHtml;
}





renderHiddenField(type, name, label, validate, attributes, bindingSyntax) {
  // Define valid attributes for the hidden input type
  const validAttributes = [
    'type',
    'name',
    'value',
    'id',
    'class',
    'style',
    'required',
    'readonly',
    'disabled',
    'tabindex',
  ];

  // Construct validation attributes
  let validationAttrs = '';
  if (validate) {
    Object.entries(validate).forEach(([key, value]) => {
      if (validAttributes.includes(key)) {
        if (typeof value === 'boolean' && value) {
          validationAttrs += `  ${key}\n`;
        } else {
          console.warn(`\x1b[31mUnsupported validation attribute '${key}' for field '${name}' of type '${type}'.\x1b[0m`);
        }
      } else {
        console.warn(`\x1b[31mUnsupported validation attribute '${key}' for field '${name}' of type '${type}'.\x1b[0m`);
      }
    });
  }

  // Handle the binding syntax
  let bindingDirective = '';
  if (bindingSyntax === 'bind:value') {
    bindingDirective = `  bind:value="${name}"\n`;
  } if (bindingSyntax.startsWith('::') && name) {
    bindingDirective = `  bind:value="${name}"\n`;
  }
  if (bindingSyntax && !name) {
    console.log(`\x1b[31m%s\x1b[0m`, `You cannot set binding value when there is no name attribute defined in ${name} ${type} field.`);
    return;
  }


  // Get the id from attributes or fall back to name
  let id = attributes.id || name;

  // Construct additional attributes dynamically
  let additionalAttrs = '';
  for (const [key, value] of Object.entries(attributes)) {
    if (key !== 'id' && value !== undefined) {
      if (key.startsWith('on')) {
        // Handle event attributes
        const eventValue = value.endsWith('()') ? value.slice(0, -2) : value;
        additionalAttrs += `  @${key.replace(/^on/, '')}={${eventValue}}\n`;
      } else {
        // Handle boolean attributes
        if (value === true) {
          additionalAttrs += `  ${key.replace(/_/g, '-')}\n`;
        } else if (value !== false) {
          // Convert underscores to hyphens and set the attribute
          additionalAttrs += `  ${key.replace(/_/g, '-')}="${value}"\n`;
        }
      }
    }
  }

  // Construct the final HTML string
  let formHTML = `
    <div class="${this.divClass}">
    <label for="${id}">${label}</label>
      <input 
        type="${type}"
        name="${name}"
        ${bindingDirective}
        id="${id}"
        ${additionalAttrs}
        ${validationAttrs}
      />
    </div>
  `.replace(/^\s*\n/gm, '').trim();

  // Format the entire HTML using pretty
  let formattedHtml = pretty(formHTML, {
    indent_size: 2,
    wrap_line_length: 0,
    preserve_newlines: true, // Preserve existing newlines
  });

  // Apply vertical layout to the <input> element only
  formattedHtml = formattedHtml.replace(/<input\s+([^>]*)\/>/, (match, p1) => {
    // Reformat attributes into a vertical layout
    const attributes = p1.trim().split(/\s+/).map(attr => `  ${attr}`).join('\n');
    return `<input\n${attributes}\n/>`;
  });

  // Ensure the <div> block starts on a new line and remove extra blank lines
  formattedHtml = formattedHtml.replace(/(<div\s+[^>]*>)/g, (match) => {
    // Ensure <div> starts on a new line
    return `\n${match}\n`;
  }).replace(/\n\s*\n/g, '\n'); // Remove extra blank lines

  return formattedHtml;
}



renderImageField(type, name, label, validate, attributes, bindingSyntax) {
  // Define valid validation attributes for image upload
  const imageUploadValidationAttributes = [
    'accept',
    'required',
    'minwidth',
    'maxwidth',
    'minheight',
    'maxheight',
  ];

  // Construct validation attributes
  let validationAttrs = '';
  if (validate) {
    Object.entries(validate).forEach(([key, value]) => {
      if (imageUploadValidationAttributes.includes(key)) {
        if (key === 'accept') {
          validationAttrs += `accept="${value}"\n`;
        } else if (['required', 'minwidth', 'maxwidth', 'minheight', 'maxheight'].includes(key)) {
          validationAttrs += `${key}="${value}"\n`;
        } else {
          console.warn(`\x1b[31mUnsupported validation attribute '${key}' for field '${name}' of type '${type}'.\x1b[0m`);
        }
      } else {
        console.warn(`\x1b[31mUnsupported validation attribute '${key}' for field '${name}' of type '${type}'.\x1b[0m`);
      }
    });
  }

  // Handle the binding syntax
  let bindingDirective = '';
  if (bindingSyntax === 'bind:value') {
    bindingDirective = ` bind:value="${name}"`;
  } else if (bindingSyntax.startsWith('::')) {
    bindingDirective = ` bind:value="${name}"`;
  }

  // Get the id from attributes or fall back to name
  let id = attributes.id || name;

  // Construct additional attributes dynamically
  let additionalAttrs = '';
  for (const [key, value] of Object.entries(attributes)) {
    if (key !== 'id' && value !== undefined) {
      if (key.startsWith('on')) {
        // Handle event attributes
        const eventValue = value.endsWith('()') ? value.slice(0, -2) : value;
        additionalAttrs += `  @${key.replace(/^on/, '')}={${eventValue}}\n`;
      } else {
        // Handle boolean attributes
        if (value === true) {
          additionalAttrs += `  ${key.replace(/_/g, '-')}\n`;
        } else if (value !== false) {
          // Convert underscores to hyphens and set the attribute
          additionalAttrs += `  ${key.replace(/_/g, '-')}="${value}"\n`;
        }
      }
    }
  }

  // Construct the final HTML string
  let formHTML = `
    <div class="${this.divClass}">
      <label for="${id}">${label}</label>
      <input 
        type="${type}"
        name="${name}"
        ${bindingDirective}
        id="${id}"
        ${additionalAttrs}
        ${validationAttrs}
      />
    </div>
  `.replace(/^\s*\n/gm, '').trim();

  // Format the entire HTML using pretty
  let formattedHtml = pretty(formHTML, {
    indent_size: 2,
    wrap_line_length: 0,
    preserve_newlines: true, // Preserve existing newlines
  });

  // Apply vertical layout to the <input> element only
  formattedHtml = formattedHtml.replace(/<input\s+([^>]*)\/>/, (match, p1) => {
    // Reformat attributes into a vertical layout
    const attributes = p1.trim().split(/\s+/).map(attr => `  ${attr}`).join('\n');
    return `<input\n${attributes}\n/>`;
  });

  // Ensure the <div> block starts on a new line and remove extra blank lines
  formattedHtml = formattedHtml.replace(/(<div\s+[^>]*>)/g, (match) => {
    // Ensure <div> starts on a new line
    return `\n${match}\n`;
  }).replace(/\n\s*\n/g, '\n'); // Remove extra blank lines

  return formattedHtml;
}




renderImageField(type, name, label, validate, attributes, bindingSyntax) {
  // Define valid validation attributes for image upload
  const imageUploadValidationAttributes = [
    'accept',
    'required',
    'minwidth',
    'maxwidth',
    'minheight',
    'maxheight',
  ];

  // Construct validation attributes
  let validationAttrs = '';
  if (validate) {
    Object.entries(validate).forEach(([key, value]) => {
      if (imageUploadValidationAttributes.includes(key)) {
        validationAttrs += `${key}="${value}"\n`;
      } else {
        console.warn(`\x1b[31mUnsupported validation attribute '${key}' for field '${name}' of type '${type}'.\x1b[0m`);
      }
    });
  }

  // Handle the binding syntax
  let bindingDirective = '';
  if (bindingSyntax === 'bind:value' || bindingSyntax.startsWith('::')) {
    bindingDirective = `bind:value="${name}"\n`;
  }

  // Get the id from attributes or fall back to name
  let id = attributes.id || name;

  // Construct additional attributes dynamically
  let additionalAttrs = '';
  for (const [key, value] of Object.entries(attributes)) {
    if (key !== 'id' && value !== undefined) {
      if (key.startsWith('on')) {
        // Handle event attributes
        const eventValue = value.endsWith('()') ? value.slice(0, -2) : value;
        additionalAttrs += `  @${key.replace(/^on/, '')}={${eventValue}}\n`;
      } else {
        // Handle boolean attributes
        if (value === true) {
          additionalAttrs += `  ${key.replace(/_/g, '-')}\n`;
        } else if (value !== false) {
          // Convert underscores to hyphens and set the attribute
          additionalAttrs += `  ${key.replace(/_/g, '-')}="${value}"\n`;
        }
      }
    }
  }

  // Construct the final HTML string
  let formHTML = `
    <div class="${this.divClass}">
      <label for="${id}">${label}</label>
      <input 
        type="${type}"
        name="${name}"
        ${bindingDirective}
        id="${id}"
        ${additionalAttrs}
        ${validationAttrs}
      />
    </div>
  `.replace(/^\s*\n/gm, '').trim();

  // Format the entire HTML using pretty
  let formattedHtml = pretty(formHTML, {
    indent_size: 2,
    wrap_line_length: 0,
    preserve_newlines: true, // Preserve existing newlines
  });

  // Apply vertical layout to the <input> element only
  formattedHtml = formattedHtml.replace(/<input\s+([^>]*)\/>/, (match, p1) => {
    // Reformat attributes into a vertical layout
    const attributes = p1.trim().split(/\s+/).map(attr => `  ${attr}`).join('\n');
    return `<input\n${attributes}\n/>`;
  });

  // Ensure the <div> block starts on a new line and remove extra blank lines
  formattedHtml = formattedHtml.replace(/(<div\s+[^>]*>)/g, (match) => {
    // Ensure <div> starts on a new line
    return `\n${match}\n`;
  }).replace(/\n\s*\n/g, '\n'); // Remove extra blank lines

  return formattedHtml;
}

renderTextareaField(type, name, label, validate, attributes, bindingSyntax) {
  // Define valid validation attributes for textarea
  const textareaValidationAttributes = [
    'required',
    'minlength',
    'maxlength',
    'rows',
    'cols',
  ];

  // Construct validation and dimension attributes
  let validationAttrs = '';
  let dimensionAttrs = '';

  if (validate) {
    Object.entries(validate).forEach(([key, value]) => {
      if (textareaValidationAttributes.includes(key)) {
        if (key === 'required') {
          validationAttrs += `required\n`;
        } else if (['minlength', 'maxlength'].includes(key)) {
          validationAttrs += `${key}="${value}"\n`;
        } else if (['rows', 'cols'].includes(key)) {
          dimensionAttrs += `${key}="${value}"\n`;
        }
      } else {
        console.warn(`\x1b[31mUnsupported validation attribute '${key}' for field '${name}' of type '${type}'.\x1b[0m`);
      }
    });
  }

  // Handle the binding syntax
  let bindingDirective = '';
  if (bindingSyntax === 'bind:value' || bindingSyntax.startsWith('::')) {
    bindingDirective = `bind:value="${name}"\n`;
  }

  // Get the id from attributes or fall back to name
  let id = attributes.id || name;

  // Construct additional attributes dynamically
  let additionalAttrs = '';
  for (const [key, value] of Object.entries(attributes)) {
    if (key !== 'id' && value !== undefined) {
      if (key.startsWith('on')) {
        // Handle event attributes
        const eventValue = value.endsWith('()') ? value.slice(0, -2) : value;
        additionalAttrs += `  @${key.replace(/^on/, '')}={${eventValue}}\n`;
      } else {
        // Handle boolean attributes
        if (value === true) {
          additionalAttrs += `  ${key.replace(/_/g, '-')}\n`;
        } else if (value !== false) {
          // Convert underscores to hyphens and set the attribute
          additionalAttrs += `  ${key.replace(/_/g, '-')}="${value}"\n`;
        }
      }
    }
  }

  // Construct the final HTML string
  let formHTML = `
    <div class="${this.divClass}">
      <label for="${id}">${label}</label>
      <textarea 
        name="${name}"
        ${bindingDirective}
        ${dimensionAttrs}
        id="${id}"
        ${additionalAttrs}
        ${validationAttrs}
      ></textarea>
    </div>
  `.replace(/^\s*\n/gm, '').trim();

  // Format the entire HTML using pretty
  let formattedHtml = pretty(formHTML, {
    indent_size: 2,
    wrap_line_length: 0,
    preserve_newlines: true, // Preserve existing newlines
  });

  // Apply vertical layout to the <textarea> element only
  formattedHtml = formattedHtml.replace(/<textarea\s+([^>]*)<\/textarea>/, (match, p1) => {
    // Reformat attributes into a vertical layout
    const attributes = p1.trim().split(/\s+/).map(attr => `  ${attr}`).join('\n');
    return `<textarea\n${attributes}\n></textarea>`;
  });

  // Ensure the <div> block starts on a new line and remove extra blank lines
  formattedHtml = formattedHtml.replace(/(<div\s+[^>]*>)/g, (match) => {
    // Ensure <div> starts on a new line
    return `\n${match}\n`;
  }).replace(/\n\s*\n/g, '\n'); // Remove extra blank lines

  return formattedHtml;
}




renderRadioField(type, name, label, validate, attributes, bindingSyntax, options) {
  // Define valid validation attributes for radio fields
  const radioValidationAttributes = ['required'];

  // Construct validation attributes
  let validationAttrs = '';
  if (validate) {
    Object.entries(validate).forEach(([key, value]) => {
      if (radioValidationAttributes.includes(key)) {
        if (key === 'required') {
          validationAttrs += `required\n`;
        }
      } else {
        console.warn(`\x1b[31mUnsupported validation attribute '${key}' for field '${name}' of type '${type}'.\x1b[0m`);
      }
    });
  }

  // Handle the binding syntax
  let bindingDirective = '';
  if (bindingSyntax === 'bind:value') {
    bindingDirective = ` bind:value="${name}"\n`;
  } else if (bindingSyntax.startsWith('::')) {
    bindingDirective = ` bind:value="${name}"\n`;
  }

  // Define attributes for the radio inputs
  let id = attributes.id || name;

  // Handle additional attributes
  let additionalAttrs = '';
  for (const [key, value] of Object.entries(attributes)) {
    if (key !== 'id' && value !== undefined) {
      if (key.startsWith('on')) {
        // Handle event attributes
        const eventValue = value.endsWith('()') ? value.slice(0, -2) : value;
        additionalAttrs += `  @${key.replace(/^on/, '')}={${eventValue}}\n`;
      } else {
        // Handle boolean attributes
        if (value === true) {
          additionalAttrs += `  ${key.replace(/_/g, '-')}\n`;
        } else if (value !== false) {
          // Convert underscores to hyphens and set the attribute
          additionalAttrs += `  ${key.replace(/_/g, '-')}="${value}"\n`;
        }
      }
    }
  }

  // Construct radio button HTML based on options
  let optionsHTML = '';
  if (options && options.length) {
    optionsHTML = options.map((option) => {
      return `
        <div>
          <input type="radio" name="${name}" value="${option.value}"${bindingDirective} ${additionalAttrs}
            ${attributes.id ? `id="${id}-${option.value}"` : `id="${id}-${option.value}"`}
          />
          <label for="${attributes.id ? `${id}-${option.value}` : `${id}-${option.value}`}">${option.label}</label>
        </div>
      `;
    }).join('');
  }

  // Construct the final HTML string
  let formHTML = `
    <fieldset class="${this.radioGroupClass}">
      <legend>${label}</legend>
      ${optionsHTML}
    </fieldset>
  `.replace(/^\s*\n/gm, '').trim();

  // Format the entire HTML using pretty
  let formattedHtml = pretty(formHTML, {
    indent_size: 2,
    wrap_line_length: 0,
    preserve_newlines: true, // Preserve existing newlines
  });

  // Apply vertical layout to the <input> elements only
  formattedHtml = formattedHtml.replace(/<input\s+([^>]*)\/>/g, (match, p1) => {
    // Reformat attributes into a vertical layout
    const attributes = p1.trim().split(/\s+/).map(attr => `  ${attr}`).join('\n');
    return `<input\n${attributes}\n/>`;
  });

  // Ensure the <fieldset> block starts on a new line and remove extra blank lines
  formattedHtml = formattedHtml.replace(/(<fieldset\s+[^>]*>)/g, (match) => {
    // Ensure <fieldset> starts on a new line
    return `\n${match}\n`;
  }).replace(/\n\s*\n/g, '\n'); // Remove extra blank lines

  return formattedHtml;
}


renderCheckboxField(type, name, label, validate, attributes, bindingSyntax, options) {
  // Define valid validation attributes for checkbox fields
  const checkboxValidationAttributes = ['required'];

  // Construct validation attributes
  let validationAttrs = '';
  if (validate) {
    Object.entries(validate).forEach(([key, value]) => {
      if (checkboxValidationAttributes.includes(key)) {
        if (key === 'required') {
          validationAttrs += `${key}\n`;
        }
      } else {
        console.warn(`\x1b[31mUnsupported validation attribute '${key}' for field '${name}' of type '${type}'.\x1b[0m`);
      }
    });
  }

  // Handle the binding syntax
  let bindingDirective = '';
  if (bindingSyntax === 'bind:checked') {
    bindingDirective = ` bind:checked="${name}"\n`;
  } else if (bindingSyntax.startsWith('::')) {
    bindingDirective = ` bind:checked="${name}"\n`;
  }

  // Define attributes for the checkbox inputs
  let id = attributes.id || name;

  // Handle additional attributes
  let additionalAttrs = '';
  for (const [key, value] of Object.entries(attributes)) {
    if (key !== 'id' && value !== undefined) {
      if (key.startsWith('on')) {
        // Handle event attributes
        const eventValue = value.endsWith('()') ? value.slice(0, -2) : value;
        additionalAttrs += `  @${key.replace(/^on/, '')}={${eventValue}}\n`;
      } else {
        // Handle boolean attributes
        if (value === true) {
          additionalAttrs += `  ${key.replace(/_/g, '-')}\n`;
        } else if (value !== false) {
          // Convert underscores to hyphens and set the attribute
          additionalAttrs += `  ${key.replace(/_/g, '-')}="${value}"\n`;
        }
      }
    }
  }

  // Construct checkbox HTML based on options
  let optionsHTML = '';
  if (Array.isArray(options)) {
    optionsHTML = options.map((option) => {
      const optionId = `${id}-${option.value}`;
      return `
        <div>
          <input type="checkbox" name="${name}" value="${option.value}"${bindingDirective} ${additionalAttrs}
            ${attributes.id ? `id="${optionId}"` : `id="${optionId}"`}
          />
          <label for="${optionId}">${option.label}</label>
        </div>
      `;
    }).join('');
  }

  // Construct the final HTML string
  let formHTML = `
    <fieldset class="${this.checkboxGroupClass}">
      <legend>${label}</legend>
      ${optionsHTML}
    </fieldset>
  `.replace(/^\s*\n/gm, '').trim();

  // Format the entire HTML using pretty
  let formattedHtml = pretty(formHTML, {
    indent_size: 2,
    wrap_line_length: 0,
    preserve_newlines: true, // Preserve existing newlines
  });

  // Apply vertical layout to the <input> elements only
  formattedHtml = formattedHtml.replace(/<input\s+([^>]*)\/>/g, (match, p1) => {
    // Reformat attributes into a vertical layout
    const attributes = p1.trim().split(/\s+/).map(attr => `  ${attr}`).join('\n');
    return `<input\n${attributes}\n/>`;
  });

  // Ensure the <fieldset> block starts on a new line and remove extra blank lines
  formattedHtml = formattedHtml.replace(/(<fieldset\s+[^>]*>)/g, (match) => {
    // Ensure <fieldset> starts on a new line
    return `\n${match}\n`;
  }).replace(/\n\s*\n/g, '\n'); // Remove extra blank lines

  return formattedHtml;
}



renderSingleSelectField(type, name, label, validate, attributes, bindingSyntax, options) {
  // Define valid validation attributes for select fields
  const selectValidationAttributes = ['required'];

  // Construct validation attributes
  let validationAttrs = '';
  if (validate) {
    Object.entries(validate).forEach(([key, value]) => {
      if (selectValidationAttributes.includes(key)) {
        if (key === 'required') {
          validationAttrs += `${key} `;
        }
      } else {
        console.warn(`\x1b[31mUnsupported validation attribute '${key}' for field '${name}' of type '${type}'.\x1b[0m`);
      }
    });
  }

  // Handle the binding syntax
  let bindingDirective = '';
  if (typeof bindingSyntax === 'string' && bindingSyntax.startsWith('::')) {
    bindingDirective = ` bind:value="${name}" `;
  }

  // Define attributes for the select field
  let id = attributes.id || name;
  let dimensionAttrs = ''; // No dimension attributes applicable for select fields

  // Handle additional attributes
  let additionalAttrs = '';
  for (const [key, value] of Object.entries(attributes)) {
    if (key !== 'id' && value !== undefined) {
      if (key.startsWith('on')) {
        // Handle event attributes
        const eventValue = value.endsWith('()') ? value.slice(0, -2) : value;
        additionalAttrs += `  @${key.replace(/^on/, '')}={${eventValue}}\n`;
      } else {
        // Handle boolean attributes
        if (value === true) {
          additionalAttrs += `  ${key.replace(/_/g, '-')}\n`;
        } else if (value !== false) {
          // Convert underscores to hyphens and set the attribute
          additionalAttrs += `  ${key.replace(/_/g, '-')}="${value}"\n`;
        }
      }
    }
  }

  // Construct select options HTML based on options
  let selectHTML = '';
  if (Array.isArray(options)) {
    // Add a default option
    selectHTML += `
      <option value="">Choose an option</option>
    `;

    // Add the provided options
    selectHTML += options.map((option) => {
      const isSelected = option.selected ? ' selected' : '';
      return `
        <option value="${option.value}"${isSelected}>${option.label}</option>
      `;
    }).join('');
  }

  // Construct the final HTML string
  let formHTML = `
    <fieldset class="${this.selectGroupClass}">
      <label for="${id}">${label}</label>
      <select name="${name}"
        ${bindingDirective}
        ${dimensionAttrs}
        id="${id}"
        ${additionalAttrs}
        ${validationAttrs}
      >
        ${selectHTML}
      </select>
    </fieldset>
  `.replace(/^\s*\n/gm, '').trim();

  // Format the entire HTML using pretty
  let formattedHtml = pretty(formHTML, {
    indent_size: 2,
    wrap_line_length: 0,
    preserve_newlines: true, // Preserve existing newlines
  });

  // Apply vertical layout to the <select> element and its children
  formattedHtml = formattedHtml.replace(/<select\s+([^>]*)>([\s\S]*?)<\/select>/g, (match, p1, p2) => {
    // Reformat attributes into a vertical layout
    const attributes = p1.trim().split(/\s+/).map(attr => `  ${attr}`).join('\n');
    return `<select\n${attributes}\n>\n${p2.trim()}\n</select>`;
  });

  // Ensure the <fieldset> block starts on a new line and remove extra blank lines
  formattedHtml = formattedHtml.replace(/(<fieldset\s+[^>]*>)/g, (match) => {
    // Ensure <fieldset> starts on a new line
    return `\n${match}\n`;
  }).replace(/\n\s*\n/g, '\n'); // Remove extra blank lines

  return formattedHtml;
}




renderMultipleSelectField(type, name, label, validate, attributes, bindingSyntax, options) {
  // Define valid validation attributes for multiple select fields
  const selectValidationAttributes = ['required', 'minlength', 'maxlength'];

  // Construct validation attributes
  let validationAttrs = '';
  if (validate) {
    Object.entries(validate).forEach(([key, value]) => {
      if (selectValidationAttributes.includes(key)) {
        if (key === 'required') {
          validationAttrs += `${key} `;
        } else if (key === 'minlength') {
          validationAttrs += `minlength="${value}" `;
        } else if (key === 'maxlength') {
          validationAttrs += `maxlength="${value}" `;
        }
      } else {
        console.warn(`\x1b[31mUnsupported validation attribute '${key}' for field '${name}' of type '${type}'.\x1b[0m`);
      }
    });
  }

  // Handle the binding syntax
  let bindingDirective = '';
  if (typeof bindingSyntax === 'string' && bindingSyntax.startsWith('::')) {
    bindingDirective = ` bind:value="${name}" `;
  }

  // Define attributes for the select field
  let id = attributes.id || name;
  let dimensionAttrs = ''; // No dimension attributes applicable for select fields

  // Handle additional attributes
  let additionalAttrs = '';
  for (const [key, value] of Object.entries(attributes)) {
    if (key !== 'id' && value !== undefined) {
      if (key.startsWith('on')) {
        // Handle event attributes
        const eventValue = value.endsWith('()') ? value.slice(0, -2) : value;
        additionalAttrs += `  @${key.replace(/^on/, '')}={${eventValue}}\n`;
      } else {
        // Handle boolean attributes
        if (value === true) {
          additionalAttrs += `  ${key.replace(/_/g, '-')}\n`;
        } else if (value !== false) {
          // Convert underscores to hyphens and set the attribute
          additionalAttrs += `  ${key.replace(/_/g, '-')}="${value}"\n`;
        }
      }
    }
  }

  // Construct select options HTML based on options
  let selectHTML = '';
  if (Array.isArray(options)) {
    selectHTML = options.map((option) => {
      const isSelected = option.selected ? ' selected' : '';
      return `
        <option value="${option.value}"${isSelected}>${option.label}</option>
      `;
    }).join('');
  }

  // Define multiple attribute for multi-select
  const multipleAttr = 'multiple';

  // Construct the final HTML string
  let formHTML = `
    <fieldset class="${this.selectGroupClass}">
      <label for="${id}">${label}</label>
      <select name="${name}"
        ${bindingDirective}
        ${dimensionAttrs}
        id="${id}"
        ${additionalAttrs}
        ${validationAttrs}
        ${multipleAttr}
      >
        ${selectHTML}
      </select>
    </fieldset>
  `.replace(/^\s*\n/gm, '').trim();

  // Format the entire HTML using pretty
  let formattedHtml = pretty(formHTML, {
    indent_size: 2,
    wrap_line_length: 0,
    preserve_newlines: true, // Preserve existing newlines
  });

  // Apply vertical layout to the <select> element and its children
  formattedHtml = formattedHtml.replace(/<select\s+([^>]*)>([\s\S]*?)<\/select>/g, (match, p1, p2) => {
    // Reformat attributes into a vertical layout
    const attributes = p1.trim().split(/\s+/).map(attr => `  ${attr}`).join('\n');
    return `<select\n${attributes}\n>\n${p2.trim()}\n</select>`;
  });

  // Ensure the <fieldset> block starts on a new line and remove extra blank lines
  formattedHtml = formattedHtml.replace(/(<fieldset\s+[^>]*>)/g, (match) => {
    // Ensure <fieldset> starts on a new line
    return `\n${match}\n`;
  }).replace(/\n\s*\n/g, '\n'); // Remove extra blank lines

  return formattedHtml;
}



renderSubmitButton(type, name, label, attributes) {
  // Define id attribute or fallback to name
  const id = attributes.id || name;

  // Handle additional attributes
  let additionalAttrs = '';
  for (const [key, value] of Object.entries(attributes)) {
    if (key !== 'id' && value !== undefined) {
      if (key.startsWith('on')) {
        // Handle event attributes
        const eventValue = value.endsWith('()') ? value.slice(0, -2) : value;
        additionalAttrs += ` ${key}="${eventValue}"`;
      } else {
        // Handle boolean attributes
        if (value === true) {
          additionalAttrs += ` ${key.replace(/_/g, '-')}`;
        } else if (value !== false) {
          // Convert underscores to hyphens and set the attribute
          additionalAttrs += ` ${key.replace(/_/g, '-')}="${value}"`;
        }
      }
    }
  }

  // Construct the final HTML string
  const formHTML = `
    <input type="${type}"
      id="${id}"
      value="${label}"
      ${additionalAttrs}
    />
  `.replace(/^\s*\n/gm, '').trim();

  // Format the entire HTML using pretty
  const formattedHtml = pretty(formHTML, {
    indent_size: 2,
    wrap_line_length: 0,
    preserve_newlines: true, // Preserve existing newlines
  });

  return formattedHtml;
}





 renderFormHTML () {

this.formMarkUp+= '</form>'; 
const formContainer = document.getElementById('formique');
formContainer.innerHTML = this.formMarkUp;
//return this.formMarkUp;


 }




// no renderMethod below here
}















/*


const formSchema = [
  ['text', 'firstName', 'First Name', { minlength: 2, maxlength: 5, required: true, disabled: true}, { value: "John", id: 'firstNameInput', class: 'form-input', style: 'width: 100%;', oninput: "incrementer()"}, '::firstName'],
  ['email', 'email', 'Email', { required: true}, { class: 'form-input', style: 'width: 100%;'}, '::emailValue'],
  ['number', 'age', 'Your Age', {required: false}, { id: 'age12'}, '::age'],
  ['password', 'password', 'Password', { minlength: 8, required: true }, { class: 'form-control', style: 'width: 100%;' }, '::passwordValue'],
  ['tel', 'phoneNumber', 'Phone Number', { required: true }, { class: 'form-control', style: 'width: 100%;' }, '::telValue'],
  ['date', 'birthdate', 'Birth Date', { required: true }, { id: 'birthdateInput', class: 'form-control', style: 'width: 100%;' }, '::date'],
  ['time', 'meetingTime', 'Meeting Time', { required: true }, { id: 'meetingTimeInput', class: 'form-control', style: 'width: 100%;' }, '::time'],
  ['datetime-local', 'meetingDateTime', 'Meeting Date & Time', { required: true }, { id: 'meetingDateTimeInput', class: 'form-control', style: 'width: 100%;' }, '::meetingDateTime'],
  ['month', 'eventMonth', 'Event Month', { required: true }, { id: 'eventMonthInput', class: 'form-control', style: 'width: 100%;' }, '::eventMonth'],
  ['week', 'eventWeek', 'Event Week', { required: true }, { id: 'eventWeekInput', class: 'form-control', style: 'width: 100%;' }, '::eventWeek'],
  ['url', 'websiteUrl', 'Website URL', { required: true}, { id: 'websiteUrlInput', class: 'form-control', style: 'width: 100%;' }, 'bind:value'],
  ['search', 'searchQuery', 'Search', { required: true }, { id: 'searchQueryInput', class: 'form-control', style: 'width: 100%;' }, '::searchQuery'],
  ['color', 'colorPicker', 'Pick a Color', { required: true }, { id: 'colorPickerInput', class: 'form-control', style: 'width: 100%;' }, '::colorValue'],
  ['file', 'terms', 'Upload File', { required: true }, { id: 'my-file', class: 'form-control', style: 'width: 100%;' }, 'bind:value'],
  ['hidden', 'user_id', '', { required: true }, {}, '::user_id'],
  ['image','profilePicture','Profile Picture', { required: true, accept: 'image/*' }, 
  { id: 'profilePictureInput', class: 'form-control', style: 'width: 100%;' }, 
  'bind:value'],
  ['textarea', 'comments', 'Comments', 
  { required: true, minlength: 10, maxlength: 200, rows: 4, cols: 50 }, 
  { id: 'commentsTextarea', class: 'form-control', style: 'width: 100%; height: 100px;' }, 
  '::comments'],


  [
  'radio', 
  'gender', 
  'Gender', 
  { required: true }, 
  { id: 'genderRadio', class: 'form-radio-input', style: 'margin-left: 1rem;', onchange: 'actioner()' }, 
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
  { id: 'preferencesCheckbox', class: 'form-checkbox-input', style: 'margin-left: 1rem;', onchange: 'submit' }, 
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
  { id: 'colorsSelect', class: 'form-select-input', style: 'margin-left: 1rem;', onchange: 'trigger' }, // Attributes
  '::colors', // Binding syntax
  [
    { value: 'red', label: 'Red', selected: false },
    { value: 'green', label: 'Green'},
    { value: 'blue', label: 'Blue', selected: true},
  ] // Options
],



[
  'multipleSelect', // Type of field
  'colors', // Name/identifier of the field
  'Colors', // Label of the field
  { required: true, min: 2, max: 3 }, // Validation options
  { id: 'colorsSelect', class: 'form-select-input', style: 'margin-left: 1rem;', onchange: 'alerter' }, // Attributes
  '::colors', // Binding syntax
  [
    { value: 'red', label: 'Red' },
    { value: 'green', label: 'Green' },
    { value: 'blue', label: 'Blue', selected: false },
    { value: 'yellow', label: 'Yellow', selected: false },
  ] // Options
],


[
    'submit',
    'submitButton',
    'Submit',
    { required: true },
    { id: 'submitBtn', class: 'form-submit-btn', style: 'margin-top: 1rem;' }
  ],




];


*/

const formSchema = [
  // Text Input Field
  [
    'text', 
    'firstName', 
    'First Name', 
    { minlength: 2, maxlength: 5, required: true, disabled: true }, // Validation options
    { value: "John", id: 'firstNameInput', class: 'form-input', style: 'width: 100%;', oninput: "incrementer()" }, // Attributes
    '::firstName' // Binding syntax
  ],

  // URL Input Field
  [
    'url', 
    'websiteUrl', 
    'Website URL', 
    { required: true }, // Validation options
    { id: 'websiteUrlInput', class: 'form-control', style: 'width: 100%;' }, // Attributes
    'bind:value' // Binding syntax
  ],

  // Radio Input Field
  [
    'radio', 
    'gender', 
    'Gender', 
    { required: true }, // Validation options
    { id: 'genderRadio', class: 'form-radio-input', style: 'margin-left: 1rem;', onchange: 'actioner()' }, // Attributes
    '::gender', // Binding syntax
    [
      { value: 'male', label: 'Male' }, // Options
      { value: 'female', label: 'Female' },
      { value: 'other', label: 'Other' }
    ]
  ],

  // Checkbox Input Field
  [
    'checkbox', 
    'preferences', 
    'Preferences', 
    { required: true }, // Validation options
    { id: 'preferencesCheckbox', class: 'form-checkbox-input', style: 'margin-left: 1rem;', onchange: 'submit' }, // Attributes
    '::preferences', // Binding syntax
    [
      { value: 'news', label: 'Newsletter' }, // Options
      { value: 'updates', label: 'Product Updates' },
      { value: 'offers', label: 'Special Offers' }
    ]
  ],

  // Single Select Input Field
  [
    'singleSelect', 
    'colors', 
    'Colors', 
    { required: true }, // Validation options
    { id: 'colorsSelect', class: 'form-select-input', style: 'margin-left: 1rem;', onchange: 'trigger' }, // Attributes
    '::colors', // Binding syntax
    [
      { value: 'red', label: 'Red' }, // Options
      { value: 'green', label: 'Green' },
      { value: 'blue', label: 'Blue', selected: true }
    ]
  ],

  // Multiple Select Input Field
  [
    'multipleSelect', // Type of field
    'colors', // Name/identifier of the field
    'Colors', // Label of the field
    { required: true, min: 2, max: 3 }, // Validation options
    { id: 'colorsSelect', class: 'form-select-input', style: 'margin-left: 1rem;', onchange: 'alerter' }, // Attributes
    '::colors', // Binding syntax
    [
      { value: 'red', label: 'Red' }, // Options
      { value: 'green', label: 'Green' },
      { value: 'blue', label: 'Blue' },
      { value: 'yellow', label: 'Yellow' }
    ]
  ],

  // Submit Button
  [
    'submit',
    'submitButton',
    'Submit',
    { required: true }, // Validation options
    { id: 'submitBtn', class: 'form-submit-btn', style: 'margin-top: 1rem;' } // Attributes
  ]
];



const formParams= {
method: 'post', 
action: 'submit.js', 
id: 'myForm', 
class: 'form',
semantq: true,
style: 'width: 100%; font-size: 14px;',
//enctype: 'multipart/form-data', 
//target: '_blank', 
//nonvalidate: true, 
//accept_charset: 'UTF-8', 
  };


// Instantiate the form
const form = new Formique(formParams, formSchema);
const formHTML = form.renderFormHTML();
console.log(formHTML);









