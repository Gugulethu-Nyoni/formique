import '../css/formique.css'; // Ensure this line is present


// Base class for form rendering

class FormBuilder 
{
  renderField(type, name, label, validate, attributes, bindingSyntax, options) {
    throw new Error('Method renderField must be implemented');
  }
  
}



// Extended class for specific form rendering methods
class Formique extends FormBuilder {
 constructor (formParams = {}, formSchema, formSettings={}) {
    super();
    this.formSchema=formSchema;
    this.divClass='input-block';
    this.inputClass='form-input';
    this.radioGroupClass='radio-group';
    this.checkboxGroupClass='checkbox-group';
    this.selectGroupClass='form-select';
    this.submitButtonClass='form-submit-btn';
    this.formParams=formParams;
    this.formMarkUp='';
    this.containerId = formSettings.containerId || 'formique';


    this.formSettings = {
      requiredFieldIndicator: true,
      placeholders: true,
      asteriskHtml: '<span aria-hidden="true" style="color: red;">*</span>',
      ...formSettings
    };



    
    if (Object.keys(this.formParams).length > 0) {
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

   // Conditionally add CSRF token if 'laravel' is true
    if (paramsToUse.laravel) {
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        formHTML += `<input type="hidden" name="_token" value="${csrfToken}">`;
    }


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
    this.formMarkUp += formHTML; 
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
      case 'dynamicSingleSelect':
       return this.renderDynamicSingleSelectField(type, name, label, validate, attributes, bindingSyntax, options);
      case 'submit':
        return this.renderSubmitButton(type, name, label, attributes);
      default:
        console.warn(`Unsupported field type '${type}' encountered.`);
        return ''; // or handle gracefully
    }


  
  }


 


// text field rendering
renderTextField(type, name, label, validate, attributes, bindingSyntax) {
  const textInputValidationAttributes = [
  'required',
  'minlength',
  'maxlength',
  'pattern',
];

  // Construct validation attributes
  let validationAttrs = '';
  if (validate) {
    Object.entries(validate).forEach(([key, value]) => {
      if (textInputValidationAttributes.includes(key)) {
        if (typeof value === 'boolean' && value) {
          validationAttrs += `  ${key}\n`;
        } else {
          switch (key) {
            case 'pattern':
            case 'minlength':
            case 'maxlength':
              validationAttrs += `  ${key}="${value}"\n`;
              break;
            default:
              if (!textInputValidationAttributes.includes(key)) {
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

  // Determine if semanti is true based on formSettings
const framework = this.formSettings?.framework || false;

  // Construct additional attributes dynamically
  let additionalAttrs = '';
  for (const [key, value] of Object.entries(attributes)) {
    if (key !== 'id' && key !== 'class' && value !== undefined) {
      if (key.startsWith('on')) {
        // Handle event attributes
        if (framework === 'semantq') {
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



  let inputClass; 
  if ('class' in attributes) {
    inputClass = attributes.class; 
  } else {
        inputClass = this.inputClass; 
  }
// Construct the final HTML string
 let formHTML = `
    <div class="${this.divClass}">
      <label for="${id}">${label}
        ${validationAttrs.includes('required') && this.formSettings.requiredFieldIndicator ? this.formSettings.asteriskHtml : ''}
      </label>
      <input 
        type="${type}"
        name="${name}"
        ${bindingDirective}
        id="${id}"
        class="${inputClass}"
        ${additionalAttrs}
        ${validationAttrs}
        ${additionalAttrs.includes('placeholder') ? '' : (this.formSettings.placeholders ? `placeholder="${label}"` : '')}      />
    </div>
`.replace(/^\s*\n/gm, '').trim();

   let formattedHtml = formHTML; 

  // Apply vertical layout to the <input> element only
  formattedHtml = formattedHtml.replace(/<input\s+([^>]*)\/>/, (match, p1) => {
    // Reformat attributes into a vertical layout
    const attributes = p1.trim().split(/\s+/).map(attr => `  ${attr}`).join('\n');
    return `<input\n${attributes}\n/>`;
  });


  this.formMarkUp +=formattedHtml;
  //return formattedHtml;
}




  // Specific rendering method for rendering the email field
renderEmailField(type, name, label, validate, attributes, bindingSyntax) {
  // Define valid attributes for the email input type
  
const emailInputValidationAttributes = [
  'required',
  'pattern',
  'minlength',
  'maxlength',
  'multiple'
];


  // Construct validation attributes
  let validationAttrs = '';
  if (validate) {
    Object.entries(validate).forEach(([key, value]) => {
      if (emailInputValidationAttributes.includes(key)) {
        if (typeof value === 'boolean' && value) {
          validationAttrs += `  ${key}\n`;
        } else {
          switch (key) {
            case 'pattern':
            case 'minlength':
            case 'maxlength':
              validationAttrs += `  ${key}="${value}"\n`;
              break;
            default:
              if (!emailInputValidationAttributes.includes(key)) {
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
    if (key !== 'id' && key !== 'class' && value !== undefined) {
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


  let inputClass; 
  if ('class' in attributes) {
    inputClass = attributes.class; 
  } else {
        inputClass = this.inputClass; 
  }
// Construct the final HTML string
  let formHTML = `
    <div class="${this.divClass}"> 
      <label for="${id}">${label}
        ${validationAttrs.includes('required') && this.formSettings.requiredFieldIndicator ? this.formSettings.asteriskHtml : ''}
      </label>
      <input 
        type="${type}"
        name="${name}"
        ${bindingDirective}
        id="${id}"
        class="${inputClass}"
        ${additionalAttrs}
        ${validationAttrs}
      />
    </div>
  `.replace(/^\s*\n/gm, '').trim();

  let formattedHtml = formHTML; 

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
  

  this.formMarkUp += formattedHtml;

  //return formattedHtml;
  //return this.formMarkUp;
  //console.log(this.formMarkUp);
}



renderNumberField(type, name, label, validate, attributes, bindingSyntax) {
  // Define valid attributes for the number input type

  const numberInputValidationAttributes = [
  'required',
  'min',
  'max',
  'step',
];

  // Construct validation attributes
  let validationAttrs = '';
  if (validate) {
    Object.entries(validate).forEach(([key, value]) => {
      if (numberInputValidationAttributes.includes(key)) {
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
              if (!numberInputValidationAttributes.includes(key)) {
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
    if (key !== 'id' && key !== 'class' && value !== undefined) {
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

  let inputClass; 
  if ('class' in attributes) {
    inputClass = attributes.class; 
  } else {
        inputClass = this.inputClass; 
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
        class="${inputClass}"
        ${additionalAttrs}
        ${validationAttrs}
      />
    </div>
  `.replace(/^\s*\n/gm, '').trim();

  let formattedHtml = formHTML; 

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
  
  //return formattedHtml;
  this.formMarkUp +=formattedHtml;
}



// New method for rendering password fields
renderPasswordField(type, name, label, validate, attributes, bindingSyntax) {
  // Define valid attributes for the password input type
  /*
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
*/

  const passwordInputValidationAttributes = [
  'required',
  'minlength',
  'maxlength',
  'pattern',
];

  // Construct validation attributes
  let validationAttrs = '';
  if (validate) {
    Object.entries(validate).forEach(([key, value]) => {
      if (passwordInputValidationAttributes.includes(key)) {
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
              if (!passwordInputValidationAttributes.includes(key)) {
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
    if (key !== 'id' && key !== 'class' && value !== undefined) {
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

  let inputClass; 
  if ('class' in attributes) {
    inputClass = attributes.class; 
  } else {
        inputClass = this.inputClass; 
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
        class="${inputClass}"
        ${additionalAttrs}
        ${validationAttrs}
      />
    </div>
  `.replace(/^\s*\n/gm, '').trim();

  let formattedHtml = formHTML; 

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

  //return formattedHtml;
  this.formMarkUp +=formattedHtml;
}






// New method for rendering tel fields
renderTelField(type, name, label, validate, attributes, bindingSyntax) {
  // Define valid attributes for the tel input type
  /*
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
*/

  const telInputValidationAttributes = [
  'required',
  'pattern',
  'minlength',
  'maxlength',
];


  // Construct validation attributes
  let validationAttrs = '';
  if (validate) {
    Object.entries(validate).forEach(([key, value]) => {
      if (telInputValidationAttributes.includes(key)) {
        if (typeof value === 'boolean' && value) {
          validationAttrs += `  ${key}\n`;
        } else {
          switch (key) {
            case 'pattern':
            case 'minlength':
            case 'maxlength':
              validationAttrs += `  ${key}="${value}"\n`;
              break;
            default:
              if (!telInputValidationAttributes.includes(key)) {
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
    if (key !== 'id' && key !== 'class' && value !== undefined) {
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

  let inputClass; 
  if ('class' in attributes) {
    inputClass = attributes.class; 
  } else {
        inputClass = this.inputClass; 
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
        class="${inputClass}"
        ${additionalAttrs}
        ${validationAttrs}
      />
    </div>
  `.replace(/^\s*\n/gm, '').trim();

  let formattedHtml = formHTML; 

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
    if (key !== 'id' && key !== 'class' && value !== undefined) {
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

  let inputClass; 
  if ('class' in attributes) {
    inputClass = attributes.class; 
  } else {
        inputClass = this.inputClass; 
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
        class="${inputClass}"
        ${additionalAttrs}
        ${validationAttrs}
      />
    </div>
  `.replace(/^\s*\n/gm, '').trim();

  let formattedHtml = formHTML; 

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

  //return formattedHtml;
  this.formMarkUp +=formattedHtml;
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
    if (key !== 'id' && key !== 'class' && value !== undefined) {
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

  let inputClass; 
  if ('class' in attributes) {
    inputClass = attributes.class; 
  } else {
        inputClass = this.inputClass; 
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
        class="${inputClass}"
        ${additionalAttrs}
        ${validationAttrs}
      />
    </div>
  `.replace(/^\s*\n/gm, '').trim();

  let formattedHtml = formHTML; 

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

  //return formattedHtml;
  this.formMarkUp +=formattedHtml;
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
    if (key !== 'id' && key !== 'class' && value !== undefined) {
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

  let inputClass; 
  if ('class' in attributes) {
    inputClass = attributes.class; 
  } else {
        inputClass = this.inputClass; 
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
        class="${inputClass}"
        ${additionalAttrs}
        ${validationAttrs}
      />
    </div>
  `.replace(/^\s*\n/gm, '').trim();

  let formattedHtml = formHTML; 

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

  //return formattedHtml;
  this.formMarkUp +=formattedHtml;
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
    if (key !== 'id' && key !== 'class' && value !== undefined) {
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

  let inputClass; 
  if ('class' in attributes) {
    inputClass = attributes.class; 
  } else {
        inputClass = this.inputClass; 
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
        class="${inputClass}"
        ${additionalAttrs}
        ${validationAttrs}
      />
    </div>
  `.replace(/^\s*\n/gm, '').trim();

  let formattedHtml = formHTML; 

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

  //return formattedHtml;
  this.formMarkUp +=formattedHtml;
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
    if (key !== 'id' && key !== 'class' && value !== undefined) {
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

  let inputClass; 
  if ('class' in attributes) {
    inputClass = attributes.class; 
  } else {
        inputClass = this.inputClass; 
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
        class="${inputClass}"
        ${additionalAttrs}
        ${validationAttrs}
      />
    </div>
  `.replace(/^\s*\n/gm, '').trim();

  let formattedHtml = formHTML; 

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

  //return formattedHtml;
  this.formMarkUp +=formattedHtml;
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
    if (key !== 'id' && key !== 'class' && value !== undefined) {
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

  let inputClass; 
  if ('class' in attributes) {
    inputClass = attributes.class; 
  } else {
        inputClass = this.inputClass; 
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
        class="${inputClass}"
        ${additionalAttrs}
        ${validationAttrs}
      />
    </div>
  `.replace(/^\s*\n/gm, '').trim();

  let formattedHtml = formHTML; 

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

  //return formattedHtml;
  this.formMarkUp +=formattedHtml;
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
    if (key !== 'id' && key !== 'class' && value !== undefined) {
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

  let inputClass; 
  if ('class' in attributes) {
    inputClass = attributes.class; 
  } else {
        inputClass = this.inputClass; 
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
        class="${inputClass}"
        ${additionalAttrs}
        ${validationAttrs}
      />
    </div>
  `.replace(/^\s*\n/gm, '').trim();

  let formattedHtml = formHTML; 

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

  //return formattedHtml;
  this.formMarkUp +=formattedHtml;
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
    if (key !== 'id' && key !== 'class' && value !== undefined) {
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

  let inputClass; 
  if ('class' in attributes) {
    inputClass = attributes.class; 
  } else {
        inputClass = this.inputClass; 
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
        class="${inputClass}"
        ${additionalAttrs}
        ${validationAttrs}
      />
    </div>
  `.replace(/^\s*\n/gm, '').trim();

  let formattedHtml = formHTML; 

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

  //return formattedHtml;
  this.formMarkUp +=formattedHtml;
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
    if (key !== 'id' && key !== 'class' && value !== undefined) {
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

  let inputClass; 
  if ('class' in attributes) {
    inputClass = attributes.class; 
  } else {
        inputClass = this.inputClass; 
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
        class="${inputClass}"
        ${additionalAttrs}
        ${validationAttrs}
      />
    </div>
  `.replace(/^\s*\n/gm, '').trim();

  let formattedHtml = formHTML; 

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

  //return formattedHtml;
  this.formMarkUp +=formattedHtml;
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
    if (key !== 'id' && key !== 'class' && value !== undefined) {
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

  let inputClass; 
  if ('class' in attributes) {
    inputClass = attributes.class; 
  } else {
        inputClass = this.inputClass; 
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
        class="${inputClass}"
        ${additionalAttrs}
        ${validationAttrs}
      />
    </div>
  `.replace(/^\s*\n/gm, '').trim();

  let formattedHtml = formHTML; 

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

  //return formattedHtml;
  this.formMarkUp +=formattedHtml;
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
    if (key !== 'id' && key !== 'class' && value !== undefined) {
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

  let inputClass; 
  if ('class' in attributes) {
    inputClass = attributes.class; 
  } else {
        inputClass = this.inputClass; 
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
        class="${inputClass}"
        ${additionalAttrs}
        ${validationAttrs}
      />
    </div>
  `.replace(/^\s*\n/gm, '').trim();

  let formattedHtml = formHTML; 

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

  //return formattedHtml;
  this.formMarkUp +=formattedHtml;
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
    if (key !== 'id' && key !== 'class' && value !== undefined) {
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

  let inputClass; 
  if ('class' in attributes) {
    inputClass = attributes.class; 
  } else {
        inputClass = this.inputClass; 
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
        class="${inputClass}"
        ${additionalAttrs}
        ${validationAttrs}
      />
    </div>
  `.replace(/^\s*\n/gm, '').trim();

  let formattedHtml = formHTML; 

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
    if (key !== 'id' && key !== 'class' && value !== undefined) {
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

  let inputClass; 
  if ('class' in attributes) {
    inputClass = attributes.class; 
  } else {
        inputClass = this.inputClass; 
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
        class="${inputClass}"
        ${additionalAttrs}
        ${validationAttrs}
      ></textarea>
    </div>
  `.replace(/^\s*\n/gm, '').trim();

  let formattedHtml = formHTML; 

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

  //return formattedHtml;
  this.formMarkUp +=formattedHtml;
}




renderRadioField(type, name, label, validate, attributes, bindingSyntax, options) {
    // Define valid validation attributes for radio fields
    const radioValidationAttributes = ['required'];
    
    // Construct validation attributes
    let validationAttrs = '';
    if (validate) {
        Object.entries(validate).forEach(([key, value]) => {
            if (radioValidationAttributes.includes(key)) {
                if (typeof value === 'boolean' && value) {
                    validationAttrs += `  ${key}\n`;
                } else {
                    // Handle specific validation attributes
                    switch (key) {
                        case 'required':
                            validationAttrs += `  ${key}\n`;
                            break;
                        default:
                            if (!radioValidationAttributes.includes(key)) {
                                console.warn(`\x1b[31mUnsupported validation attribute '${key}' for field '${name}' of type 'radio'.\x1b[0m`);
                            }
                            break;
                    }
                }
            } else {
                console.warn(`\x1b[31mUnsupported validation attribute '${key}' for field '${name}' of type 'radio'.\x1b[0m`);
            }
        });
    }

    // Handle the binding syntax
    let bindingDirective = '';
    if (bindingSyntax === 'bind:value' && name) {
        bindingDirective = ` bind:value="${name}"\n`;
    } else if (bindingSyntax.startsWith('::') && name) {
        bindingDirective = ` bind:value="${name}"\n`;
    } else if (bindingSyntax && !name) {
        console.log(`\x1b[31m%s\x1b[0m`, `You cannot set binding value when there is no name attribute defined in ${name} ${type} field.`);
        return;
    }

    // Define attributes for the radio inputs
    let id = attributes.id || name;

    // Construct additional attributes dynamically
    let additionalAttrs = '';
    for (const [key, value] of Object.entries(attributes)) {
        if (key !== 'id' && key !== 'class' && value !== undefined) {
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

    let inputClass = attributes.class || this.inputClass;

    // Construct radio button HTML based on options
    let optionsHTML = '';
    if (options && options.length) {
        optionsHTML = options.map((option) => {
            return `
            <div>
                <input 
                    type="${type}" 
                    name="${name}" 
                    value="${option.value}"
                    ${bindingDirective} 
                    ${additionalAttrs}
                    ${attributes.id ? `id="${id}-${option.value}"` : `id="${id}-${option.value}"`}
                    class="${inputClass}"
                    ${validationAttrs}
                />
                <label 
                    for="${attributes.id ? `${id}-${option.value}` : `${id}-${option.value}`}">
                    ${option.label}
                </label>
            </div>
            `;
        }).join('');
    }

    // Construct the final HTML string
    let formHTML = `
    <fieldset class="${this.radioGroupClass}">
        <legend>
        ${label} 
        ${validationAttrs.includes('required') && this.formSettings.requiredFieldIndicator ? this.formSettings.asteriskHtml : ''}
        </legend>
        ${optionsHTML}
    </fieldset>
    `.replace(/^\s*\n/gm, '').trim();

    // Apply vertical layout to the <input> elements only
    let formattedHtml = formHTML.replace(/<input\s+([^>]*)\/>/g, (match, p1) => {
        // Reformat attributes into a vertical layout
        const attributes = p1.trim().split(/\s+/).map(attr => `  ${attr}`).join('\n');
        return `<input\n${attributes}\n/>`;
    });

    // Ensure the <fieldset> block starts on a new line and remove extra blank lines
    formattedHtml = formattedHtml.replace(/(<fieldset\s+[^>]*>)/g, (match) => {
        // Ensure <fieldset> starts on a new line
        return `\n${match}\n`;
    }).replace(/\n\s*\n/g, '\n'); // Remove extra blank lines

    //return formattedHtml;
    this.formMarkUp +=formattedHtml;
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
    if (key !== 'id' && key !== 'class' && value !== undefined) {
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


  let inputClass; 
  if ('class' in attributes) {
    inputClass = attributes.class; 
  } else {
        inputClass = this.inputClass; 
  }

  // Construct checkbox HTML based on options
  let optionsHTML = '';
  if (Array.isArray(options)) {
    optionsHTML = options.map((option) => {
      const optionId = `${id}-${option.value}`;
      return `
        <div>
          <input 
          type="checkbox" 
          name="${name}" 
          value="${option.value}"${bindingDirective} ${additionalAttrs}
            ${attributes.id ? `id="${optionId}"` : `id="${optionId}"`}
            class="${inputClass}"
          />
          <label 
          for="${optionId}">
            ${option.label}
          </label>
        </div>
      `;
    }).join('');
  }

  // Construct the final HTML string
  let formHTML = `
    <fieldset class="${this.checkboxGroupClass}">
      <legend>
      ${label}  ${validationAttrs.includes('required') && this.formSettings.requiredFieldIndicator ? this.formSettings.asteriskHtml : ''}
      </legend>
      ${optionsHTML}
    </fieldset>
  `.replace(/^\s*\n/gm, '').trim();

  let formattedHtml = formHTML; 

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

  //return formattedHtml;
  this.formMarkUp +=formattedHtml;
}



/* DYNAMIC SINGLE SELECT BLOCK */

// Function to render the dynamic select field and update based on user selection
renderDynamicSingleSelectField(type, name, label, validate, attributes, bindingSyntax, options) {
  
// Step 1: Transform the data into an array of objects
const mainCategoryOptions = options.flat().map(item => {
  // Check if any option has selected: true
  const selected = item.options.some(option => option.selected === true);

  // Create a transformed object
  return {
    value: item.id,
    label: item.label,
    ...(selected && { selected: true }) // Conditionally add selected: true
  };
});

const subCategoriesOptions=options;
const mode='dynamicSingleSelect';
this.renderSingleSelectField(type, name, label, validate, attributes, bindingSyntax, mainCategoryOptions, subCategoriesOptions, mode);

}


renderSingleSelectField(type, name, label, validate, attributes, bindingSyntax, options, subCategoriesOptions, mode) {

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
        if (key !== 'id' && key !== 'class' && value !== undefined) {
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

    let inputClass = attributes.class || this.inputClass;

    const onchangeAttr = (mode === 'dynamicSingleSelect' && subCategoriesOptions) ? ' onchange="handleDynamicSingleSelect(this.value,id)"' : '';
    
    let labelDisplay;
    let rawLabel; 

    if (mode === 'dynamicSingleSelect' && subCategoriesOptions) {
      if (label.includes('-')) {
        const [mainCategoryLabel] = label.split('-');
        labelDisplay = mainCategoryLabel; 
        rawLabel = label;
      } else {
        labelDisplay = label;
        rawLabel = label;
      }
    } else {
      labelDisplay = label;
    }


    // Construct the final HTML string
    let formHTML = `
    <fieldset class="${this.selectGroupClass}">
        <legend>${labelDisplay} 
            ${validationAttrs.includes('required') && this.formSettings.requiredFieldIndicator ? this.formSettings.asteriskHtml : ''}
        </legend>
        <label for="${id}"> Select ${labelDisplay} 
        <select name="${name}"
            ${bindingDirective}
            ${dimensionAttrs}
            id="${id}"
            class="${inputClass}"
            ${additionalAttrs}
            ${validationAttrs}
            ${onchangeAttr} 
        >
            ${selectHTML}
        </select>
    </fieldset>
`.replace(/^\s*\n/gm, '').trim();


    // Apply vertical layout to the <select> element and its children
    let formattedHtml = formHTML.replace(/<select\s+([^>]*)>([\s\S]*?)<\/select>/g, (match, p1, p2) => {
        // Reformat attributes into a vertical layout
        const attributes = p1.trim().split(/\s+/).map(attr => `  ${attr}`).join('\n');
        return `<select\n${attributes}\n>\n${p2.trim()}\n</select>`;
    });

    // Ensure the <fieldset> block starts on a new line and remove extra blank lines
    formattedHtml = formattedHtml.replace(/(<fieldset\s+[^>]*>)/g, (match) => {
        // Ensure <fieldset> starts on a new line
        return `\n${match}\n`;
    }).replace(/\n\s*\n/g, '\n'); // Remove extra blank lines

    //console.log(formattedHtml);
    this.formMarkUp+=formattedHtml;
    //return formattedHtml;


    /* dynamicSingleSelect */

if (mode && mode ==='dynamicSingleSelect' && subCategoriesOptions) {


// Find the target div with id "formique"
const targetDiv = document.getElementById('formique');

let categoryId = attributes.id || name;


if (targetDiv) {
  // Create a script element
  const scriptElement = document.createElement('script');
  scriptElement.textContent = `
  window.handleDynamicSingleSelect = function(category, fieldsetid) {
    //console.log("HERE", fieldsetid);

    // Hide all subcategory fields
    document.querySelectorAll(\`[class*="\${fieldsetid}"]\`).forEach(div => {
      div.style.display = "none";
    });

    // Show the selected category
    const selectedCategoryFieldset = document.getElementById(category + '-options');
    if (selectedCategoryFieldset) {
      selectedCategoryFieldset.style.display = "block";
    }
  }
`;

  // Append the script element to the target div
  targetDiv.appendChild(scriptElement);
} else {
  console.error('Target div with id "formique" not found.');
}

subCategoriesOptions.forEach(subCategory => {
  const { id, label, options } = subCategory;

  // Build the select options HTML
  const selectHTML = options.map(option => {
    const isSelected = option.selected ? ' selected' : '';
    return `
      <option value="${option.value}"${isSelected}>${option.label}</option>
    `;
  }).join('');


    let subCategoryLabel; 
    console.log('Label:', rawLabel); // Debug log

    if (rawLabel.includes('-')) {
      subCategoryLabel = rawLabel.split('-')?.[1] + ' Option'; 
    } else {
      subCategoryLabel = 'options';
    }


    

  // Create the HTML for the fieldset and select elements
  let formHTML = `
    <fieldset class="${this.selectGroupClass} ${categoryId}" id="${id}-options" style="display: none;">
        <legend> ${label} ${subCategoryLabel} ${this.formSettings.requiredFieldIndicator ? this.formSettings.asteriskHtml : ''}
        </legend>
        <label for="${id}"> Select ${label} ${subCategoryLabel}           
        </label>
        <select name="${id}"
            ${bindingDirective}
            ${dimensionAttrs}
            id="${id}"
            class="${inputClass}"
            ${additionalAttrs}
            ${validationAttrs}
        >
            <option value="">Choose an option</option>
            ${selectHTML}
        </select>
    </fieldset>
  `.replace(/^\s*\n/gm, '').trim();

  // Apply vertical layout to the <select> element and its children
  formHTML = formHTML.replace(/<select\s+([^>]*)>([\s\S]*?)<\/select>/g, (match, p1, p2) => {
    // Reformat attributes into a vertical layout
    const attributes = p1.trim().split(/\s+/).map(attr => `  ${attr}`).join('\n');
    return `<select\n${attributes}\n>\n${p2.trim()}\n</select>`;
  });

  // Ensure the <fieldset> block starts on a new line and remove extra blank lines
  formHTML = formHTML.replace(/(<fieldset\s+[^>]*>)/g, (match) => {
    // Ensure <fieldset> starts on a new line
    return `\n${match}\n`;
  }).replace(/\n\s*\n/g, '\n'); // Remove extra blank lines

  // Append the generated HTML to formMarkUp
  this.formMarkUp += formHTML;

  //return formHTML;
});


}
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
    if (key !== 'id' && key !== 'class' && value !== undefined) {
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

  let inputClass; 
  if ('class' in attributes) {
    inputClass = attributes.class; 
  } else {
        inputClass = this.inputClass; 
  }
// Construct the final HTML string
  let formHTML = `
    <fieldset class="${this.selectGroupClass}">
      <label for="${id}">${label}</label>
      <select name="${name}"
        ${bindingDirective}
        ${dimensionAttrs}
        id="${id}"
        class="${inputClass}"
        ${additionalAttrs}
        ${validationAttrs}
        ${multipleAttr}
      >
        ${selectHTML}
      </select>
    </fieldset>
  `.replace(/^\s*\n/gm, '').trim();

  let formattedHtml = formHTML; 

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

  //return formattedHtml;
  this.formMarkUp +=formattedHtml;
}


/* DYNAMIC SINGLE SELECT BLOCK */






/* END DYNAMIC SINGLE SELECT BLOCK */



renderSubmitButton(type, name, label, attributes) {
  // Define id attribute or fallback to name
  const id = attributes.id || name;

  // Handle additional attributes
  let additionalAttrs = '';
  for (const [key, value] of Object.entries(attributes)) {
    if (key !== 'id' && key !== 'class' && value !== undefined) {
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

  let submitButtonClass;
  if ('class' in attributes) {
    submitButtonClass=attributes.class;
  } else {
    submitButtonClass=this.submitButtonClass; 
  }

  // Construct the final HTML string
  const formHTML = `
    <input type="${type}"
      id="${id}"
      class="${submitButtonClass}"
      value="${label}"
      ${additionalAttrs}
    />
  `.replace(/^\s*\n/gm, '').trim();

  let formattedHtml = formHTML; 

  //return formattedHtml;
  this.formMarkUp +=formattedHtml;
}





 renderFormHTML () {

this.formMarkUp+= '</form>'; 
//console.log(this.formMarkUp);
const formContainer = document.getElementById(this.containerId);
if (!formContainer) {
  console.error('Error: formContainer not found. Please ensure an element with id "formique" exists in the HTML.');
} else {
  formContainer.innerHTML = this.formMarkUp;
}

//return this.formMarkUp;


 }




// no renderMethod below here
}



export default Formique;











