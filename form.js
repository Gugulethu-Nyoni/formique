import pretty from 'pretty';

// Base class for form rendering
class FormBuilder 
{


  renderField(type, name, label, validate, attributes, bindingSyntax) {
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
        const [type, name, label, validate, attributes = {}, bindingSyntax] = field;
        return this.renderField(type, name, label, validate, attributes, bindingSyntax);
    }).join('');
    
  //return formHTML;
  //return this.formMarkUp;

    this.formMarkUp += formHTML; 
    //console.log("here", this.formMarkUp);
}


  renderField(type, name, label, validate, attributes, bindingSyntax) {
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
  if (bindingSyntax === 'bind:value' || bindingSyntax.startsWith('::') && !name) {
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
  if (bindingSyntax === 'bind:value' || bindingSyntax.startsWith('::') && !name) {
    console.log('\x1b[31m%s\x1b[0m', 'You cannot set binding value when there is no name attribute defined.');
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
  if (bindingSyntax === 'bind:value' || bindingSyntax.startsWith('::') && !name) {
    console.log('\x1b[31m%s\x1b[0m', 'You cannot set binding value when there is no name attribute defined.');
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
  if (bindingSyntax === 'bind:value' || bindingSyntax.startsWith('::') && !name) {
    console.log('\x1b[31m%s\x1b[0m', 'You cannot set binding value when there is no name attribute defined.');
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
  if (bindingSyntax === 'bind:value' || bindingSyntax.startsWith('::') && !name) {
    console.log('\x1b[31m%s\x1b[0m', 'You cannot set binding value when there is no name attribute defined.');
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




 renderFormHTML () {

return this.formMarkUp;


 }




// no renderMethod below here
}


















const formSchema = [
  ['text', 'firstName', 'First Name', { minlength: 2, maxlength: 5, required: true, disabled: true}, { id: 'firstNameInput', class: 'form-input', style: 'width: 100%;', oninput: "incrementer()"}, '::firstName'],
  ['email', 'email', 'Email', { required: true}, { class: 'form-input', style: 'width: 100%;'}, '::emailValue'],
  ['number', 'age', 'Your Age', {required: false}, { id: 'age12'}, '::age'],
  ['password', 'password', 'Password', { minlength: 8, required: true }, { class: 'form-control', style: 'width: 100%;' }, '::passwordValue'],
  ['tel', 'phoneNumber', 'Phone Number', { required: true }, { class: 'form-control', style: 'width: 100%;' }, '::telValue'],
 
/*




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
style: 'width: 100%; font-size: 14px;',
//enctype: 'multipart/form-data', 
//target: '_blank', 
//nonvalidate: true, 
//accept_charset: 'UTF-8', 
  };

/*
const form = new Formique(formParams,formSchema);
const formHTML = form.renderForm(formSchema);
console.log(formHTML);
*/

// Instantiate the form
const form = new Formique(formParams, formSchema);
const formHTML = form.renderFormHTML();
console.log(formHTML);

// Generate the form HTML
//const formHTML = form.renderFormElement();
//console.log(pretty(form));








