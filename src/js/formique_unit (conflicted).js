// Base class for form rendering
//import '../css/formique.css'; // Ensure this line is present

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
    this.dynamicSelectOptions = this.dynamicSelectOptions || [];
    this.submitButtonClass='form-submit-btn';
    this.formParams=formParams;
    this.formMarkUp='';
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


 


/* DYNAMIC SINGLE SELECT BLOCK */

// Function to render the dynamic select field and update based on user selection
renderDynamicSingleSelectField(type, name, label, validate, attributes, bindingSyntax, options) {
  
//console.log(JSON.stringify(options,null,2)); //return;

const categorySelectOptions = options.map(option => {
  // Check if any sub-option is selected
  const selected = option.options.some(subOption => subOption.selected);
  
  // Return the object with `selected` only if any sub-option is selected
  return {
    label: option.label,
    value: option.id,
    ...(selected ? { selected: true } : {})
  };
});

console.log(categorySelectOptions);
this.renderDynamicSingleSelectField(type, name, label, validate, attributes, bindingSyntax, categorySelectOptions);







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

    // Construct the final HTML string
    let formHTML = `
    <fieldset class="${this.selectGroupClass}">
        <label for="${id}">${label} 
            ${validationAttrs.includes('required') && this.formSettings.requiredFieldIndicator ? this.formSettings.asteriskHtml : ''}
        </label>
        <select name="${name}"
            ${bindingDirective}
            ${dimensionAttrs}
            id="${id}"
            class="${inputClass}"
            ${additionalAttrs}
            ${validationAttrs}
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

    return formattedHtml;
}





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

  return formattedHtml;
}





 renderFormHTML () {

this.formMarkUp+= '</form>';
return this.formMarkUp;


/*
const formContainer = document.getElementById('formique');

if (!formContainer) {
  console.error('Error: formContainer not found. Please ensure an element with id "formique" exists in the HTML.');
} else {
  formContainer.innerHTML = this.formMarkUp;
}
*/

//return this.formMarkUp;


 }




// no renderMethod below here
}




//export default Formique;









const formParams= {
method: 'post', 
action: 'submit.js', 
  };


const formSchema=[ 

  [
    'dynamicSingleSelect',
    'location',
    'Country & State',
    { required: true },
    {},
    '',
        [
      {
        id: 'usa',
        label: 'USA',
        options: [
          { value: 'california', label: 'California' },
          { value: 'new york', label: 'New York' },
          { value: 'texas', label: 'Texas' }
        ]
      },
      {
        id: 'canada',
        label: 'Canada',
        options: [
          { value: 'ontario', label: 'Ontario' },
          { value: 'quebec', label: 'Quebec' },
          { value: 'british-columbia', label: 'British Columbia', selected: true }
        ]
      }
    ]

],

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









