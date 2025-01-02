//import '../css/formique.css'; // Ensure this line is present

// Base class for form rendering self 

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
    this.dependencyGraph = {};
    document.addEventListener('DOMContentLoaded', () => {
    this.initDependencyGraph();
    this.registerObservers();

    });
    


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

  
initDependencyGraph() {
  this.dependencyGraph = {};

  this.formSchema.forEach((field) => {
    const [type, name, label, validate, attributes = {}] = field;
    const fieldId = attributes.id || name;

    if (attributes.dependents) {
      // Initialize dependency array for the parent field
      this.dependencyGraph[fieldId] = attributes.dependents.map((dependentName) => {
        const dependentField = this.formSchema.find(
          ([, depName]) => depName === dependentName
        );

        if (dependentField) {
          return {
            dependent: dependentName,
            condition: dependentField[4]?.condition || null, // Keep function as-is
          };
        } else {
          console.warn(`Dependent field "${dependentName}" not found in schema.`);
        }
      });

      // Add state tracking for the parent field
      this.dependencyGraph[fieldId].push({ state: null });

      // Attach the input change event listener to the parent field
      this.attachInputChangeListener(fieldId);
    }

    // Hide dependent fields initially
    if (attributes.dependents) {
      attributes.dependents.forEach((dependentName) => {
        const dependentElement = document.querySelector(`#${dependentName}`);
        if (dependentElement) {
          const inputBlock = dependentElement.closest('.input-block');
          if (inputBlock) {
            inputBlock.style.display = 'none'; // Hide dependent field by default
          }
        }
      });
    }
  });

  console.log("Dependency Graph:", this.dependencyGraph);
}

// Attach Event Listeners
attachInputChangeListener(parentField) {
  const fieldElement = document.getElementById(parentField);

  if (fieldElement) {
    fieldElement.addEventListener('input', (event) => {
      const value = event.target.value;
      this.handleParentFieldChange(parentField, value);
    });
  }
}


// Handle Parent Field Changes and Notify Observers
handleParentFieldChange(parentFieldId, value) {
  const dependencies = this.dependencyGraph[parentFieldId];

  if (dependencies) {
    // Update the state of the parent field
    this.dependencyGraph[parentFieldId].forEach((dep) => {
      if (dep.state !== undefined) {
        dep.state = value; // Set state to the selected value
      }
    });

    // Log the updated dependency graph for the parent field
    console.log(`Updated Dependency Graph for ${parentFieldId}:`, this.dependencyGraph[parentFieldId]);

    // Optionally, log the entire dependency graph to verify state changes
    console.log("Complete Dependency Graph:", this.dependencyGraph);

    // Now notify all observers (dependent fields)
    dependencies.forEach((dependency) => {
      if (dependency.observers) {
        dependency.observers.forEach((observerId) => {
          const observerElement = document.getElementById(observerId);

          if (observerElement) {
            // Check if the condition for the observer is satisfied
            const conditionMet = typeof dependency.condition === 'function'
              ? dependency.condition(value)
              : value === dependency.condition;

            // Toggle visibility based on the condition
            const inputBlock = observerElement.closest('.input-block');
            if (inputBlock) {
              inputBlock.style.display = conditionMet ? 'block' : 'none';
            }
          }
        });
      }
    });
  }
}


// Register observers for each dependent field
registerObservers() {
  this.formSchema.forEach((field) => {
    const [type, name, label, validate, attributes = {}] = field;
    const fieldId = attributes.id || name;

    if (attributes.dependents) {
      attributes.dependents.forEach((dependentName) => {
        // Ensure the dependency graph exists for the parent field
        if (this.dependencyGraph[fieldId]) {
          // Find the dependent field in the form schema
          const dependentField = this.formSchema.find(
            ([, depName]) => depName === dependentName
          );
          
          // If the dependent field exists, register it as an observer
          if (dependentField) {
            const dependentFieldId = dependentField[4]?.id || dependentName;
            this.dependencyGraph[fieldId].forEach((dependency) => {
              if (dependency.dependent === dependentName) {
                // Store the dependent as an observer for this parent field
                if (!dependency.observers) {
                  dependency.observers = [];
                }
                dependency.observers.push(dependentFieldId);
              }
            });
          }
        }
      });
    }
  });

  console.log("Observers Registered:", this.dependencyGraph);
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
        const [type, name, label, validate, attributes = {},options] = field;
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
  if (attributes.binding) {
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



renderNumberField(type, name, label, validate, attributes) {
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
  if (attributes.binding) {
  if (attributes.binding) {
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
  }
}


  // Get the id from attributes or fall back to name
  let id = attributes.id || name;

  // Construct additional attributes dynamically
  // Construct additional attributes dynamically
let additionalAttrs = '';
const excludedAttributes = ['dependsOn', 'condition']; // Add attributes to exclude

for (const [key, value] of Object.entries(attributes)) {
  if (
    key !== 'id' &&
    key !== 'class' &&
    value !== undefined &&
    !excludedAttributes.includes(key) // Exclude specific attributes
  ) {
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




renderSingleSelectField(type, name, label, validate, attributes, options, subCategoriesOptions, mode) {

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
    // Construct additional attributes dynamically
let additionalAttrs = '';
const excludedAttributes = ['dependsOn', 'condition']; // Add attributes to exclude

for (const [key, value] of Object.entries(attributes)) {
  if (
    key !== 'id' &&
    key !== 'class' &&
    value !== undefined &&
    !excludedAttributes.includes(key) // Exclude specific attributes
  ) {
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
      subCategoryLabel = rawLabel.split('-')?.[1] + ' Options'; 
    } else {
      subCategoryLabel = 'options';
    }

    let optionsLabel;
    if (subCategoryLabel !== 'options') {
      optionsLabel = rawLabel.split('-')?.[1] + ' Option'; 
    } else {
    optionsLabel  = subCategoryLabel; 
    }


  // Create the HTML for the fieldset and select elements
  let formHTML = `
    <fieldset class="${this.selectGroupClass} ${categoryId}" id="${id}-options" style="display: none;">
        <legend> ${label} ${subCategoryLabel} ${this.formSettings.requiredFieldIndicator ? this.formSettings.asteriskHtml : ''}
        </legend>
        <label for="${id}"> Select ${label} ${optionsLabel}           
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





 renderFormHTML () {

this.formMarkUp+= '</form>'; 
//console.log(this.formMarkUp);

const formContainer = document.getElementById(this.containerId);
if (!formContainer) {
  console.error('Error: formContainer not found. Please ensure an element with id "formique" exists in the HTML.');
} else {
  formContainer.innerHTML = this.formMarkUp;
}


return this.formMarkUp;


//console.log(this.formMarkUp);



 }


}


//export default Formique;


const formParams= {
method: 'post', 
action: 'submit.js',
  }

  
const formSchema=[ 
  ['text','name','Enter Your Name',{required: true},{placeholder: 'Ibizo Lakho', onclick:'trigger()', binding: 'bind:value'}],
  ['singleSelect','gender','Enter Your Gender', {required: true}, {id: 'the-gender',dependents: ['age','pregnancyDetails','maleDetails']},
    [
      {value: 'female', label:'Female'},
      {value: 'male', label: 'Male'}
    ]
  ],
  ['number','age','Age', {required: true}, {dependsOn: 'gender', condition: 'female', id: 'age'}],
  ['text','pregnancyDetails','Pregnancy Details',{required: true},{dependsOn: 'gender', condition: (value) => value === 'female'}],
  
  ['text','maleDetails','Male Details',{required: true}, {dependsOn: 'gender', condition: 'male' }]
];


const formSettings={
  requiredFieldIndicator: true,
  framework: 'semantq',
  placeholders: true,
}

// Instantiate the form
const form = new Formique(formParams, formSchema, formSettings);
const formHTML = form.renderFormHTML();
//console.log(formHTML);




