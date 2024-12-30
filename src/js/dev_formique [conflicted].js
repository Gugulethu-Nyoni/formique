//import '../css/formique.css'; // Ensure this line is present
//Base class for form rendering self 

class FormBuilder 
{
  renderField(type, name, label, validate, attributes, options) {
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
        const [type, name, label, validate, attributes = {}, options] = field;
        return this.renderField(type, name, label, validate, attributes, options);
    }).join('');   
    this.formMarkUp += formHTML; 
}



renderField(type, name, label, validate, attributes, options) {
    switch (type) {
      case 'text':
        return this.renderTextField(type, name, label, validate, attributes);
      case 'email':
        return this.renderEmailField(type, name, label, validate, attributes);
      case 'number':
        return this.renderNumberField(type, name, label, validate, attributes);
      case 'password':
        return this.renderPasswordField(type, name, label, validate, attributes);
      case 'tel': // New case for tel field
        return this.renderTelField(type, name, label, validate, attributes);
      case 'date':
        return this.renderDateField(type, name, label, validate, attributes);
      case 'time':
        return this.renderTimeField(type, name, label, validate, attributes);
      case 'datetime-local':
        return this.renderDateTimeField(type, name, label, validate, attributes);
      case 'month':
        return this.renderMonthField(type, name, label, validate, attributes);
      case 'week':
        return this.renderWeekField(type, name, label, validate, attributes);
      case 'url':
        return this.renderUrlField(type, name, label, validate, attributes);
      case 'search':
        return this.renderSearchField(type, name, label, validate, attributes);
      case 'color':
        return this.renderColorField(type, name, label, validate, attributes);
      case 'checkbox':
       return this.renderCheckboxField(type, name, label, validate, attributes, options);
      case 'radio':
        return this.renderRadioField(type, name, label, validate, attributes, options);
      case 'file':
        return this.renderFileField(type, name, label, validate, attributes);
      case 'hidden':
        return this.renderHiddenField(type, name, label, validate, attributes);
      case 'image':
        return this.renderImageField(type, name, label, validate, attributes);
      case 'textarea':
        return this.renderTextareaField(type, name, label, validate, attributes);
      case 'singleSelect':
        return this.renderSingleSelectField(type, name, label, validate, attributes, options);
      case 'multipleSelect':
        return this.renderMultipleSelectField(type, name, label, validate, attributes, options);
      case 'dynamicSingleSelect':
       return this.renderDynamicSingleSelectField(type, name, label, validate, attributes, options);
      case 'submit':
        return this.renderSubmitButton(type, name, label, attributes);
      default:
        console.warn(`Unsupported field type '${type}' encountered.`);
        return ''; // or handle gracefully
    }


  
  }




// text field rendering
renderTextField(type, name, label, validate, attributes) {
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
  if (attributes.binding === 'bind:value' && name) {
    bindingDirective = `  bind:value="${name}"\n`;
  }
  if (attributes.binding.startsWith('::') && name) {
   bindingDirective = `  bind:value="${name}"\n`;
  }
  if (attributes.binding && !name) {
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
renderEmailField(type, name, label, validate, attributes) {
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
        ${additionalAttrs.includes('placeholder') ? '' : (this.formSettings.placeholders ? `placeholder="${label}"` : '')}

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



 renderFormHTML () {

this.formMarkUp+= '</form>'; 
//console.log(this.formMarkUp);
/*
const formContainer = document.getElementById(this.containerId);
if (!formContainer) {
  console.error('Error: formContainer not found. Please ensure an element with id "formique" exists in the HTML.');
} else {
  formContainer.innerHTML = this.formMarkUp;
}

*/

console.log(this.formMarkUp);

//return this.formMarkUp;


 }


}







//export default Formique;


const formParams= {
method: 'post', 
action: 'submit.js',
  }

  
const formSchema=[ 
  ['text','name','Enter Your Name',{required: true},{placeholder: 'Ibizo Lakho'},''],
];




const formSettings={
  requiredFieldIndicator: true,
  framework: 'semantq',
  placeholders: true,
}

// Instantiate the form
const form = new Formique(formParams, formSchema, formSettings);
const formHTML = form.renderFormHTML();
console.log(formHTML);









