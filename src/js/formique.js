'use strict';
import LowCodeParser from './LowCodeParser.js';
import astToFormique from './astToFormique.js'; 
/**
 * Formique Semantq Class Library
 * 
 * This library provides an extension of the FormBuilder class, allowing for dynamic form rendering, theming, 
 * and dependency management. The key functionalities include:
 * 
 * - Dynamic form rendering based on a provided schema (`formSchema`).
 * - Theming support with predefined themes that can be applied to the form container.
 * - Dependency management to show/hide fields based on parent field values.
 * - Initialization of event listeners to handle form input changes.
 * - **Dynamic dropdowns**: Automatically populate dropdown fields based on other form inputs.
 * - **ARIA labels and WCAG compliance**: Generates forms with accessibility features, including ARIA labels for improved accessibility and compliance with Web Content Accessibility Guidelines (WCAG).
 * 
 * Key Methods:
 * - `constructor(formParams, formSchema, formSettings)`: Initializes the form with the provided parameters, schema, and settings.
 * - `renderForm()`: Renders the form using the schema and appends it to the DOM.
 * - `initDependencyGraph()`: Sets up the dependency graph for managing field visibility based on dependencies.
 * - `attachInputChangeListener(parentField)`: Attaches input change listeners to parent fields for dependency management.
 * - `handleParentFieldChange(parentFieldId, value)`: Handles changes in parent fields and updates dependent fields.
 * - `registerObservers()`: Registers observers for dependent fields to manage their state based on parent field values.
 * - `applyTheme(theme, formContainerId)`: Applies a specified theme to the form container.
 * - `renderFormElement()`: Renders the form element with the necessary attributes and CSRF token if applicable.
 * - `renderField(type, name, label, validate, attributes, options)`: Renders individual form fields based on type and attributes, including dynamic dropdowns and ARIA attributes.
 * 
 * Dependencies:
 * - The library depends on a DOM structure to initialize and manipulate form elements.
 * - Requires a CSS stylesheet with theme definitions.- there are plans to internalise css themes within js
 * 
 * Example Usage:
 * const form = new Formique(formSchema,formParams,formSettings);
 * - formParams and formSettings parameters are optional
 * 
 * This package is suited for Vanilla Js implementations. Formique has different versions 
 * applicable to these frameworks: Svelte, Vue JS, React and Angular. 
 * 
 * Author: Gugulethu Nyoni
 * Version: 1.0.8
 * License: Open-source & MIT licensed.
 */


class FormBuilder 
{
  renderField(type, name, label, validate, attributes, options) {
    throw new Error('Method renderField must be implemented');
  }
  
}

// Extended class for specific form rendering methods
class Formique extends FormBuilder {
    constructor(formDefinition, formSettings = {}, formParams = {}) {
        super();
      
        let formSchema;
        let finalSettings = formSettings;
        let finalParams = formParams;

        if (typeof formDefinition === 'string') {
            const ast = LowCodeParser.parse(formDefinition.trim());
           //console.log("AST", JSON.stringify(ast, null,2));

            const formObjects = new astToFormique(ast);

            //console.log("CHECK formSchema", JSON.stringify(formObjects.formSchema,null,2));
            // Assign from formObjects if a string is passed
            formSchema = formObjects.formSchema;
            finalSettings = { ...formSettings, ...formObjects.formSettings };
            finalParams = { ...formParams, ...formObjects.formParams };
        } else {
            // Assign from the parameters if formDefinition is not a string
            formSchema = formDefinition;
        }

        this.formSchema = formSchema;
        this.formParams = finalParams;
        this.formSettings = {
            requiredFieldIndicator: true,
            placeholders: true,
            asteriskHtml: '<span aria-hidden="true" style="color: red;">*</span>',
            ...finalSettings
        };

               // Only inject CSS if the user hasn't explicitly disabled it
       if (this.formSettings.disableStyles !== true) {
                this.injectInternalStyles();
            }

        //console.log("constructor",this.formSettings);

         this.themeColor = this.formSettings.themeColor || null;

         //console.log("color set?", this.themeColor); 
        
         this.themeColorMap = {
          'primary': {
            '--formique-base-bg': '#ffffff',
            '--formique-base-text': '#333333',
            '--formique-base-shadow': '0 10px 30px rgba(0, 0, 0, 0.1)',
            '--formique-base-label': '#555555',
            '--formique-input-border': '#dddddd',
            '--formique-focus-color': null, // Will be set to themeColor
            '--formique-btn-bg': null,      // Will be set to themeColor
            '--formique-btn-text': '#ffffff',
            '--formique-btn-shadow': null    // Will be calculated from themeColor
          }
        };

        this.divClass = 'input-block';
        this.inputClass = 'form-input';
        this.radioGroupClass = 'radio-group';
        this.checkboxGroupClass = 'checkbox-group';
        this.selectGroupClass = 'form-select';
        this.submitButtonClass = 'form-submit-btn';
        this.formContainerId = formSettings?.formContainerId || 'formique';
        // Ensure formParams.id is used if provided, otherwise generate a new ID
        this.formId = this.formParams?.id || this.generateFormId(); 
        this.formAction = formParams?.action || 'https://httpbin.org/post';
        this.method = 'POST';
        this.formMarkUp = '';
        this.dependencyGraph = {};
        this.redirect = formSettings?.redirect || '';
        this.redirectURL = formSettings?.redirectURL || '';
        this.themes = [
            "dark", "light", "pink", "indigo", "dark-blue", "light-blue",
            "dark-orange", "bright-yellow", "green", "purple", "midnight-blush",
            "deep-blue", "blue", "brown", "orange"
        ];
        this.formiqueEndpoint = "https://formiqueapi.onrender.com/api/send-email";

        // DISABLE DOM LISTENER 
       document.addEventListener('DOMContentLoaded', () => {
            // 1. Build the form's HTML in memory
            this.formMarkUp += this.renderFormElement(); // Adds opening <form> tag and any hidden inputs

            // Filter out 'submit' field for rendering, and render all other fields
            const nonSubmitFieldsHtml = this.formSchema
                .filter(field => field[0] !== 'submit')
                 .map(field => {
                //  FIX 1: Add 'subOptions' to capture the 7th element (Index 6)
                const [type, name, label, validate, attributes = {}, options, subOptions] = field;
                
                // FIX 2: Pass 'subOptions' through to renderField
                return this.renderField(type, name, label, validate, attributes, options, subOptions);
            }).join('');

            this.formMarkUp += nonSubmitFieldsHtml;

            // Find and render the submit button separately, at the very end of the form content
            const submitField = this.formSchema.find(field => field[0] === 'submit');
            if (submitField) {
                const [type, name, label, validate, attributes = {}] = submitField;
                const id = attributes.id || name;
                let buttonClass = this.submitButtonClass;
                if ('class' in attributes) {
                    buttonClass = attributes.class;
                }
                let additionalAttrs = '';
                for (const [key, value] of Object.entries(attributes)) {
                    if (key !== 'id' && key !== 'class' && key !== 'dependsOn' && key !== 'dependents' && value !== undefined) {
                        if (key.startsWith('on')) {
                            const eventValue = value.endsWith('()') ? value : `${value}()`;
                            additionalAttrs += ` ${key}="${eventValue}"`;
                        } else {
                            if (value === true) {
                                additionalAttrs += ` ${key.replace(/_/g, '-')}`;
                            } else if (value !== false) {
                                additionalAttrs += ` ${key.replace(/_/g, '-')}="${value}"`;
                            }
                        }
                    }
                }
                this.formMarkUp += `
                    <div id="formiqueSpinner" style="display: flex; align-items: center; gap: 1rem; font-family: sans-serif; display:none;">
                        <div class="formique-spinner"></div>
                        <p class="message">Hang in tight, we are submitting your details…</p>
                    </div>
                    <input type="submit" id="${id}" class="${buttonClass}" value="${label}"${additionalAttrs}>
                `;
            }


            // 2. Inject the complete form HTML into the DOM
            // A conceptual snippet from your form initialization method
this.renderFormHTML(); // This puts the form element into the document!

// 3. Now that the form is in the DOM, get the element and attach a single event listener
const formElement = document.getElementById(`${this.formId}`);
if (formElement) {
    // Attach a single, unified submit event listener
    formElement.addEventListener('submit', (event) => {
        // Prevent default submission behavior immediately
        event.preventDefault();

        // Check if reCAPTCHA is present in the form schema
        const recaptchaField = this.formSchema.find(field => field[0] === 'recaptcha');
        
        // If reCAPTCHA is required, validate it first
        if (recaptchaField) {
            const recaptchaToken = grecaptcha.getResponse();

            if (!recaptchaToken) {
                // If reCAPTCHA is not checked, display an error and stop
                document.getElementById("formiqueSpinner").style.display = "none";
                alert('Please verify that you are not a robot.');
                return; // Stop execution of the handler
            }
        }

        // If reCAPTCHA is not required or is validated, proceed with submission logic
        document.getElementById("formiqueSpinner").style.display = "block";

        if (this.formSettings.submitMode === 'email' || this.formSettings.submitMode === 'rsvp') {
            this.handleEmailSubmission(this.formId);
        }

        if (this.formSettings.submitOnPage) {
            this.handleOnPageFormSubmission(this.formId);
        }
    });

} else {
    console.error(`Form with ID ${this.formId} not found after rendering. Event listener could not be attached.`);
}

// Initialize dependency graph and observers after the form is rendered
this.initDependencyGraph();
this.registerObservers();
this.attachDynamicSelectListeners(); 


// In your constructor, after attachDynamicSelectListeners:
//console.log('FORM SCHEMA FOR DYNAMIC SELECT:');
const dynamicField = this.formSchema.find(f => f[0] === 'dynamicSingleSelect');
if (dynamicField) {
  //console.log('Main options:', dynamicField[5]);
  //console.log('Sub options:', dynamicField[6]);
  
  // Check the IDs
  const mainOptions = dynamicField[5] || [];
  mainOptions.forEach(opt => {
    //console.log(`Option ID: ${opt.id}, Label: ${opt.label}`);
  });
}


// --- CONDITIONAL CONSOLIDATED THEME LOGIC ---
if (this.formSettings.disableStyles !== true) {
    const container = document.getElementById(this.formContainerId);
    
    if (container) {
        // Apply the base class regardless of theme choice
        container.classList.add('formique');

        if (this.themeColor) {
            // Priority 1: Custom Hex Color Override
            this.applyCustomTheme(this.themeColor, this.formContainerId);
        } else {
            // Priority 2: Named Theme (or fallback to 'dark')
            const activeTheme = (this.formSettings.theme && this.themes.includes(this.formSettings.theme)) 
                                ? this.formSettings.theme 
                                : 'light';
            this.applyTheme(activeTheme, this.formContainerId);
        }

        // Priority 3: Manual Inline Style Overrides (Highest Specificity)
        if (this.formSettings.formContainerStyle) {
            container.style.cssText += this.formSettings.formContainerStyle;
        }
    }
} else {
    // Optional: Log that styles are being skipped for easier debugging
    console.log("Formique: Internal styles disabled by user settings.");
}


        
       // DISABLE DOM LISTENER
       }); // DOM LISTENER WRAPPER
    
// CONSTRUCTOR WRAPPER FOR FORMIQUE CLASS
  }






injectInternalStyles() {
        if (document.getElementById('formique-internal-css')) return;
        
        const style = document.createElement('style');
        style.id = 'formique-internal-css';
        style.textContent = FORMIQUE_INTERNAL_CSS;
        document.head.appendChild(style);
    }



applyCustomTheme(color, formContainerId) {
    const container = document.getElementById(formContainerId);
    if (!container) return;

    // Set variables directly on the element (highest specificity)
    container.style.setProperty('--formique-focus-color', color);
    container.style.setProperty('--formique-btn-bg', color);
    
    // Add a transparent shadow using the hex color
    container.style.setProperty('--formique-btn-shadow', `0 4px 14px ${color}66`);
}



generateFormId() {
  return `fmq-${Math.random().toString(36).substr(2, 10)}`;
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
                    const dependentAttributes = dependentField[4] || {};
                    const dependentFieldId = dependentAttributes.id || dependentName; // Get dependent field ID

                    return {
                        dependent: dependentFieldId,
                        condition: dependentAttributes.condition || null,
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

        // Hide dependent fields initially and set their required state
        if (attributes.dependents) {
            attributes.dependents.forEach((dependentName) => {
                const dependentField = this.formSchema.find(
                    ([, depName]) => depName === dependentName
                );
                const dependentAttributes = dependentField ? dependentField[4] || {} : {};
                const dependentFieldId = dependentAttributes.id || dependentName;

                const inputBlock = document.querySelector(`#${dependentFieldId}-block`);

                if (inputBlock) {
                   inputBlock.style.display = 'none'; // Hide dependent field by default
                   // Save original required state and set to false
                   const inputs = inputBlock.querySelectorAll('input, select, textarea');
                   inputs.forEach((input) => {
                     // Check if the input was originally required in the schema
                     if (input.hasAttribute('required') && input.required === true) {
                       input.setAttribute('data-original-required', 'true'); // Save original required state
                       input.required = false; // Remove required attribute when hiding
                     } else {
                       input.setAttribute('data-original-required', 'false'); // Explicitly mark as not originally required
                     }
                   });
                }
            });
        }
    });
}

// Attach Event Listeners
// Corrected Attach Event Listeners
attachInputChangeListener(parentField) {
  // Use querySelectorAll to get all elements with the name attribute matching the fieldId.
  // This correctly targets all radio/checkbox inputs in a group.
  const fieldElements = document.querySelectorAll(`[name="${parentField}"]`);
  
  // If no elements found by name, fall back to getting the single element by ID
  if (fieldElements.length === 0) {
      const singleElement = document.getElementById(parentField);
      if (singleElement) {
          fieldElements = [singleElement]; // Treat it as a single element array
      } else {
          console.warn(`Parent field element(s) not found for field: ${parentField}`);
          return;
      }
  }

  fieldElements.forEach(fieldElement => {
      // Radio/checkbox groups should use 'change', not 'input'
      const eventType = (fieldElement.type === 'radio' || fieldElement.type === 'checkbox') ? 'change' : 'input';

      fieldElement.addEventListener(eventType, (event) => {
          let value;
          if (fieldElement.type === 'radio' && !event.target.checked) {
              // Only process the change if the radio button is now checked
              return; 
          }

          if (fieldElement.type === 'checkbox') {
              // For checkboxes, you might need special logic to return an array of checked values
              // For now, let's stick to the change event on a single checkbox
              value = event.target.checked ? event.target.value : '';
          } else {
              value = event.target.value;
          }

          // Convert value to lowercase for consistent comparison with 'yes' condition
          //this.handleParentFieldChange(parentField, value.toLowerCase()); 
          
          this.handleParentFieldChange(parentField, value); 
      });
  });
}


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
   // console.log(`Updated Dependency Graph for ${parentFieldId}:`, this.dependencyGraph[parentFieldId]);

    // Notify all observers (dependent fields)
    dependencies.forEach((dependency) => {
      if (dependency.dependent) {
        const observerId = dependency.dependent + "-block"; // Ensure we're targeting the wrapper
        const inputBlock = document.getElementById(observerId); // Find the wrapper element

        if (inputBlock) {
          // Check if the condition for the observer is satisfied
          const conditionMet = typeof dependency.condition === 'function'
            ? dependency.condition(value)
            : value === dependency.condition;

          // Debug the condition evaluation
         // console.log(`Checking condition for ${observerId}: `, value, "==", dependency.condition, "Result:", conditionMet);

          // Toggle visibility based on the condition
          inputBlock.style.display = conditionMet ? 'block' : 'none';

          // Adjust the 'required' attribute for all inputs within the block based on visibility
          const inputs = inputBlock.querySelectorAll('input, select, textarea');
          inputs.forEach((input) => {
            if (conditionMet) {
              input.required = input.getAttribute('data-original-required') === 'true'; // Restore original required state
            } else {
              input.setAttribute('data-original-required', input.required); // Save original required state
              input.required = false; // Remove required attribute when hiding
            }
          });
        } else {
          console.warn(`Wrapper block with ID ${observerId} not found.`);
        }
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

  // console.log("Observers Registered:", JSON.stringify(this.dependencyGraph,null,2));
}


// --- NEW METHOD FOR DYNAMIC SELECT LISTENERS ---
attachDynamicSelectListeners() {
    //console.log('DEBUG: attachDynamicSelectListeners called');
    
    this.formSchema.forEach(field => {
        const [type, name, label, validate, attributes = {}] = field;

        if (type === 'dynamicSingleSelect') {
            const mainSelectId = attributes.id || name;
            //console.log('Setting up dynamic select for:', mainSelectId);
            
            const mainSelectElement = document.getElementById(mainSelectId);

            if (mainSelectElement) {
                //console.log('Found main select element:', mainSelectElement);
                
                mainSelectElement.addEventListener('change', (event) => {
                    const selectedCategory = event.target.value;
                    //console.log('Select changed to:', selectedCategory);
                    
                    // Find all sub-category fieldsets related to this main select
                    const subCategoryFieldsets = document.querySelectorAll(`.${mainSelectId}`);
                    //console.log(`Found ${subCategoryFieldsets.length} fieldsets with class .${mainSelectId}`);
                    
                    subCategoryFieldsets.forEach(fieldset => {
                        //console.log('Hiding fieldset:', fieldset.id);
                        const subSelect = fieldset.querySelector('select');
                        if (subSelect) {
                            subSelect.setAttribute('data-original-required', subSelect.required.toString());
                            subSelect.required = false;
                        }
                        fieldset.style.display = 'none';
                    });

                    // Show the selected sub-category fieldset
                    const selectedFieldsetId = selectedCategory;
                    //console.log('Looking for fieldset with ID:', selectedFieldsetId);
                    
                    const selectedFieldset = document.getElementById(selectedFieldsetId);
                    
                    if (selectedFieldset) {
                       // console.log('Found selected fieldset, showing it:', selectedFieldset);
                        selectedFieldset.style.display = 'block';
                        const selectedSubSelect = selectedFieldset.querySelector('select');
                        if (selectedSubSelect) {
                            selectedSubSelect.required = selectedSubSelect.getAttribute('data-original-required') === 'true';
                        }
                    } else {
                        console.warn('Selected fieldset not found with ID:', selectedFieldsetId);
                    }
                });

                // Trigger initial state
                if (mainSelectElement.value) {
                    console.log('Triggering initial change event for:', mainSelectId);
                    const event = new Event('change');
                    mainSelectElement.dispatchEvent(event);
                }
            } else {
                console.warn(`Main dynamic select element with ID ${mainSelectId} not found.`);
            }
        }
    });
}



applyTheme(theme, formContainerId) {
    // Safety Guard: If styles are disabled, exit immediately
    if (this.formSettings.disableStyles === true) {
        // console.warn('applyTheme ignored because disableStyles is true.');
        return;
    }

    const formContainer = document.getElementById(formContainerId);
    if (formContainer) {
        // Apply classes for backward compatibility
        formContainer.classList.add(`${theme}-theme`, 'formique');

        // Set the data attribute for our internal CSS variables
        formContainer.setAttribute('data-theme', theme);
    } else {
        console.error(`Form container with ID ${formContainerId} not found.`);
    }
}


// New method to apply a custom theme based on a color
applyCustomTheme(color, formContainerId) {
    const formContainer = document.getElementById(formContainerId);

    if (!formContainer) {
        console.error(`Form container with ID "${formContainerId}" not found. Cannot apply custom theme.`);
        return;
    }

    // You can add 'formique' class here as well if not already added
    formContainer.classList.add('formique');

    // Generate a slightly darker shade for the button shadow if needed
    // This is a simplified example; for robust color manipulation, consider a library
    const darkenColor = (hex, percent) => {
        const f = parseInt(hex.slice(1), 16);
        const t = percent < 0 ? 0 : 255;
        const p = percent < 0 ? percent * -1 : percent;
        const R = f >> 16;
        const G = (f >> 8) & 0x00FF;
        const B = f & 0x0000FF;
        return "#" + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1);
    };

    const shadowColor = darkenColor(color, 0.2); // Darken the theme color by 20% for shadow

    // Define the custom CSS variables, prioritizing the provided color
    const customCssVars = {
        '--formique-base-bg': '#ffffff', // Light theme base background
        '--formique-base-text': '#333333', // Light theme base text
        '--formique-base-shadow': '0 10px 30px rgba(0, 0, 0, 0.1)', // Light theme shadow
        '--formique-base-label': '#555555', // Light theme label
        '--formique-input-border': '#dddddd', // Light theme input border
        '--formique-focus-color': color, // Set to the provided custom color
        '--formique-btn-bg': color, // Set to the provided custom color
        '--formique-btn-text': '#ffffff', // White text for buttons
        '--formique-btn-shadow': `0 2px 10px ${shadowColor || 'rgba(0, 0, 0, 0.1)'}` // Dynamic button shadow
    };

    let styleContent = '';
    for (const [prop, val] of Object.entries(customCssVars)) {
        styleContent += `  ${prop}: ${val};\n`;
    }

    // Create a <style> tag for the custom theme
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        #${formContainerId}.formique {
            ${styleContent}
        }
    `;

    // Insert the style element into the head or before the form container
    formContainer.parentNode.insertBefore(styleElement, formContainer);

    //console.log(`Applied custom theme with color: ${color} to form container: ${formContainerId}`);
}



// renderFormElement method
    renderFormElement() {
  let formHTML = '<form';

  // Ensure `this.formParams` is being passed in as the source of form attributes
  const paramsToUse = this.formParams || {};
  //console.log(paramsToUse);

if (!paramsToUse.id) {
  paramsToUse.id = this.formId;
}


  // Dynamically add attributes if they are present in the parameters
Object.keys(paramsToUse).forEach(key => {
  const value = paramsToUse[key];
  if (value !== undefined && value !== null) {
    // Handle boolean attributes (without values, just their presence)
    if (typeof value === 'boolean') {
      if (value) {
        formHTML += ` ${key}`;  // Simply add the key as the attribute
      }
    } else {
      // Handle other attributes (key-value pairs)
      const formattedKey = key === 'accept_charset' ? 'accept-charset' : key.replace(/_/g, '-');
      formHTML += ` ${formattedKey}="${value}"`;
      //console.log("HERE",formHTML);
    }
  }
});

  // Conditionally add CSRF token if 'laravel' is true
  if (paramsToUse.laravel) {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (csrfToken) {
      formHTML += `<input type="hidden" name="_token" value="${csrfToken}">`;
    }
  }

  // Close the <form> tag
  formHTML += '>\n';

  // Return the generated form HTML
  return formHTML;
}




  // Main renderForm method
/*
renderForm() {
    // Process each field synchronously
    const formHTML = this.formSchema.map(field => {
        const [type, name, label, validate, attributes = {},options] = field;
        return this.renderField(type, name, label, validate, attributes, options);
    }).join('');   
    this.formMarkUp += formHTML; 
}
*/

renderForm() {
        // Filter out the 'submit' type before mapping
        const formHTML = this.formSchema
            .filter(field => field[0] !== 'submit') // Exclude submit button from this loop
            .map(field => {
                const [type, name, label, validate, attributes = {}, options] = field;
                return this.renderField(type, name, label, validate, attributes, options);
            }).join('');
        this.formMarkUp += formHTML;
  }



// New method to render the submit button specifically
    renderSubmitButtonElement() {
        const submitField = this.formSchema.find(field => field[0] === 'submit');
        if (submitField) {
            const [type, name, label, validate, attributes = {}] = submitField;
            const id = attributes.id || name;
            let buttonClass = this.submitButtonClass;
            if ('class' in attributes) {
                buttonClass = attributes.class;
            }
            let additionalAttrs = '';
            for (const [key, value] of Object.entries(attributes)) {
                if (key !== 'id' && key !== 'class' && key !== 'dependsOn' && key !== 'dependents' && value !== undefined) {
                    if (key.startsWith('on')) {
                        const eventValue = value.endsWith('()') ? value : `${value}()`;
                        additionalAttrs += ` ${key}="${eventValue}"`;
                    } else {
                        if (value === true) {
                            additionalAttrs += ` ${key.replace(/_/g, '-')}`;
                        } else if (value !== false) {
                            additionalAttrs += ` ${key.replace(/_/g, '-')}="${value}"`;
                        }
                    }
                }
            }

            // Include the spinner div before the submit button
            return `
<div id="formiqueSpinner" style="display: flex; align-items: center; gap: 1rem; font-family: sans-serif; display:none;">
    <div class="formique-spinner"></div>
    <p class="message">Hang in tight, we are submitting your details…</p>
</div>
<input type="submit" id="${id}" class="${buttonClass}" value="${label}"${additionalAttrs}>
            `.trim();
        }
        return ''; // Return empty string if no submit button is found in schema
    }




 // renderField method - No change needed here for this issue, but ensure it handles 'submit' type correctly if called directly
    renderField(type, name, label, validate, attributes, options, subOptions = undefined) {
    const fieldRenderMap = {
        'text': this.renderTextField,
        'email': this.renderEmailField,
        'number': this.renderNumberField,
        'password': this.renderPasswordField,
        'textarea': this.renderTextAreaField,
        'tel': this.renderTelField,
        'date': this.renderDateField,
        'time': this.renderTimeField,
        'datetime-local': this.renderDateTimeField,
        'month': this.renderMonthField,
        'week': this.renderWeekField,
        'url': this.renderUrlField,
        'search': this.renderSearchField,
        'color': this.renderColorField,
        'checkbox': this.renderCheckboxField,
        'radio': this.renderRadioField,
        'file': this.renderFileField,
        'hidden': this.renderHiddenField,
        'image': this.renderImageField,
        'singleSelect': this.renderSingleSelectField,
        'multipleSelect': this.renderMultipleSelectField,
        'dynamicSingleSelect': this.renderDynamicSingleSelectField,
        'range': this.renderRangeField,
        'recaptcha': this.renderRecaptchaField,
        'html': this.renderHtmlField,
        'submit': this.renderSubmitButton,
    };

    const renderMethod = fieldRenderMap[type];

    if (renderMethod) {
        // IMPORTANT: Pass ALL arguments including subOptions
        return renderMethod.call(this, type, name, label, validate, attributes, options, subOptions);
    } else {
        console.warn(`Unsupported field type '${type}' encountered.`);
        return '';
    }
}






renderSubmitButton(type, name, label, validate, attributes) {
        // This method can simply call the dedicated submit button renderer if it's kept separate.
        // Or, if renderField is only used for non-submit fields, this method might not be strictly necessary
        // to be called from renderField's map, but it needs to exist if mapped.
        // For simplicity, I'll make it consistent with the new separation.
        const id = attributes.id || name;
        let buttonClass = this.submitButtonClass;
        if ('class' in attributes) {
            buttonClass = attributes.class;
        }
        let additionalAttrs = '';
        for (const [key, value] of Object.entries(attributes)) {
            if (key !== 'id' && key !== 'class' && key !== 'dependsOn' && key !== 'dependents' && value !== undefined) {
                if (key.startsWith('on')) {
                    const eventValue = value.endsWith('()') ? value : `${value}()`;
                    additionalAttrs += ` ${key}="${eventValue}"`;
                } else {
                    if (value === true) {
                        additionalAttrs += ` ${key.replace(/_/g, '-')}`;
                    } else if (value !== false) {
                        additionalAttrs += ` ${key.replace(/_/g, '-')}="${value}"`;
                    }
                }
            }
        }
        // No spinner div here, as that's added once by renderSubmitButtonElement
        return `<input type="${type}" id="${id}" class="${buttonClass}" value="${label}"${additionalAttrs}>`;
    }


// Show success/error messages (externalizable)
showSuccessMessage(message) {
  const container = document.getElementById(this.formContainerId);
  container.innerHTML = `
    <div class="formique-success"> ${message}</div>
    ${this.formSettings.redirectURL 
      ? `<meta http-equiv="refresh" content="2;url=${this.formSettings.redirectURL}">` 
      : ""}
  `;
}

showErrorMessage(message) {
  const container = document.getElementById(this.formContainerId);
  const errorDiv = document.createElement("div");
  errorDiv.className = "formique-error";
  errorDiv.textContent = `${message}`;
  container.prepend(errorDiv);
}

// Check if form has file inputs
hasFileInputs(form) {
  return Boolean(form.querySelector('input[type="file"]'));
}





async handleEmailSubmission(formId) {
    console.log(`Starting email submission for form ID: ${formId}`);

    const form = document.getElementById(formId);
    if (!form) {
        console.error(`Form with ID ${formId} not found`);
        throw new Error(`Form with ID ${formId} not found`);
    }

    // Validate required settings for 'sendTo'
    if (!Array.isArray(this.formSettings?.sendTo) || this.formSettings.sendTo.length === 0) {
        console.error('formSettings.sendTo must be an array with at least one recipient email');
        throw new Error('formSettings.sendTo must be an array with at least one recipient email');
    }

    // Serialize form data
    const payload = {
        formData: {},
        metadata: {
            recipients: this.formSettings.sendTo,
            timestamp: new Date().toISOString(),
        },
    };

    let senderName = '';
    let senderEmail = '';
    let formSubject = '';
    let registrantEmail = '';

    console.log('Initial payload structure:', JSON.parse(JSON.stringify(payload)));

    // Process form fields and find registrant's email
    const formData = new FormData(form);
    formData.forEach((value, key) => {
        console.log(`Processing form field - Key: ${key}, Value: ${value}`);
        payload.formData[key] = value;

        const lowerKey = key.toLowerCase();
        if (lowerKey.includes('email')) {
            senderEmail = value;
        }
        if (lowerKey.includes('name')) {
            senderName = value;
        }
        if (lowerKey.includes('subject')) {
            formSubject = value;
        }

        // Check if the current field is the registrant's email
        if (this.formSettings.emailField && key === this.formSettings.emailField) {
            registrantEmail = value;
        }
    });

    // Determine the email subject with fallback logic
    payload.metadata.subject = formSubject ||
                                this.formSettings.subject ||
                                'Message From Contact Form';

    console.log('Determined email subject:', payload.metadata.subject);

    // Add sender information to metadata
    if (senderEmail) {
        payload.metadata.sender = senderEmail;
        payload.metadata.replyTo = senderName
            ? `${senderName} <${senderEmail}>`
            : senderEmail;
    }

    // **NEW:** Add reCAPTCHA secret key to the metadata object
    if (this.formSettings.recaptchaSecretKey) {
        payload.metadata.recaptchaSecretKey = this.formSettings.recaptchaSecretKey;
    }

    console.log('Payload after form processing:', JSON.parse(JSON.stringify(payload)));

    // ... (The rest of your code remains the same)
    try {
      const endpoint = this.formiqueEndpoint || this.formAction;
      const method = this.method || 'POST';

      console.log(`Preparing to send primary request to: ${endpoint}`);
      console.log(`Request method: ${method}`);
      console.log('Final payload being sent to recipients:', payload);

      // Send the first email to the 'sendTo' recipients
      const response = await fetch(endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'X-Formique-Version': '1.0',
        },
        body: JSON.stringify(payload),
      });

      console.log(`Received response for primary email with status: ${response.status}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error Response:', errorData);
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Primary API Success Response:', data);

      // ------------------- NEW RSVP LOGIC -------------------
      if (this.formSettings.submitMode === 'rsvp' && registrantEmail && this.formSettings.registrantMessage) {
        console.log('RSVP mode detected. Sending confirmation email to registrant.');

        // Create a new payload for the registrant
        const rsvpPayload = {
          formData: payload.formData,
          metadata: {
            recipients: [registrantEmail], // Send only to the registrant
            timestamp: new Date().toISOString(),
            subject: this.formSettings.registrantSubject || 'RSVP Confirmation',
            body: this.processDynamicMessage(this.formSettings.registrantMessage, payload.formData),
            sender: this.formSettings.sendFrom || 'noreply@yourdomain.com',
            replyTo: this.formSettings.sendFrom || 'noreply@yourdomain.com',
          },
        };

        try {
          console.log('Preparing to send RSVP email. Final payload:', rsvpPayload);
          const rsvpResponse = await fetch(endpoint, {
            method: method,
            headers: {
              'Content-Type': 'application/json',
              'X-Formique-Version': '1.0',
            },
            body: JSON.stringify(rsvpPayload),
          });

          if (!rsvpResponse.ok) {
            const rsvpErrorData = await rsvpResponse.json().catch(() => ({}));
            console.error('RSVP API Error Response:', rsvpErrorData);
            // Log the error but don't fail the entire submission since the primary email was sent
            console.warn('Failed to send RSVP email to registrant, but primary submission was successful.');
          } else {
            console.log('RSVP email sent successfully to registrant.');
          }
        } catch (rsvpError) {
          console.error('RSVP email submission failed:', rsvpError);
          console.warn('Failed to send RSVP email to registrant, but primary submission was successful.');
        }
      }
      // ------------------- END NEW RSVP LOGIC -------------------

      const successMessage = this.formSettings.successMessage ||
                              data.message ||
                              'Your message has been sent successfully!';
      console.log(`Showing success message: ${successMessage}`);

      this.showSuccessMessage(successMessage);

    } catch (error) {
      console.error('Email submission failed:', error);
      const errorMessage = this.formSettings.errorMessage ||
                            error.message ||
                            'Failed to send message. Please try again later.';
      console.log(`Showing error message: ${errorMessage}`);
      this.showErrorMessage(errorMessage);
    } finally {
      document.getElementById("formiqueSpinner").style.display = "none";
    }
}

// Add this method to your Formique class
processDynamicMessage(message, formData) {
  let processedMessage = message;
  // Iterate over each key-value pair in the form data
  for (const key in formData) {
    if (Object.prototype.hasOwnProperty.call(formData, key)) {
      const placeholder = `{${key}}`;
      // Replace all occurrences of the placeholder with the corresponding form data value
      processedMessage = processedMessage.split(placeholder).join(formData[key]);
    }
  }
  return processedMessage;
}





// Email validation helper
validateEmail(email) {
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  console.log(`Validating email ${email}: ${isValid ? 'valid' : 'invalid'}`); // Debug log
  return isValid;
}


attachSubmitListener() {
    this.formElement.addEventListener('submit', (e) => {
      // Find the reCAPTCHA field in the form schema.
      const recaptchaField = this.formSchema.find(field => field[0] === 'recaptcha');
      
      // If a reCAPTCHA field is present, check its state.
      if (recaptchaField) {
        const recaptchaToken = grecaptcha.getResponse();

        if (!recaptchaToken) {
          // Prevent the default form submission.
          e.preventDefault(); 
          
          // Display the alert and handle UI.
          alert('Please verify that you are not a robot.');
          document.getElementById("formiqueSpinner").style.display = "none";
          return;
        }
      }

      // If reCAPTCHA is valid or not present, proceed with submission logic.
      this.handleOnPageFormSubmission(e); 
    });
  }



// Method to handle on-page form submissions
handleOnPageFormSubmission(formId) {
    const formElement = document.getElementById(formId);

    if (formElement) {
        // Intercept the form's native submit event
        formElement.addEventListener('submit', (e) => {
            // Find the reCAPTCHA field in the form schema.
            const recaptchaField = this.formSchema.find(field => field[0] === 'recaptcha');

            // If a reCAPTCHA field exists, perform client-side validation.
            if (recaptchaField) {
                const recaptchaToken = grecaptcha.getResponse();

                // If the token is empty, the reCAPTCHA challenge has not been completed.
                if (!recaptchaToken) {
                    e.preventDefault(); // <-- The crucial line to stop default form submission
                    
                    // Hide the spinner to indicate the submission was halted.
                    document.getElementById("formiqueSpinner").style.display = "none";
                    
                    // Display a user-friendly error message.
                    alert('Please verify that you are not a robot.');
                    
                    // Stop the function's execution to prevent form submission.
                    return;
                }
            }

            // At this point, reCAPTCHA is validated (or not present), so we can proceed with the fetch request.
            // Show the spinner as submission is now beginning.
            document.getElementById("formiqueSpinner").style.display = "block";

            // Gather form data.
            const formData = {};
            new FormData(formElement).forEach((value, key) => {
                formData[key] = value;
            });

            console.log("Setting Object",this.formSettings);

            // Create the full payload with formData and metadata, including the secret key.
            const payload = {
                formData: formData,
                metadata: {
                    ...this.formSettings, // Include all formSettings
                    // Other metadata like recipients and sender will be included from this.formSettings
                }
            };

            // Submit form data using fetch to the endpoint.
            fetch(this.formAction, {
                method: this.method,
                headers: {
                    'Content-Type': 'application/json' // Important: set the content type
                },
                body: JSON.stringify(payload) // Send the combined payload as JSON
            })
            .then(response => {
                // Check if the response status is OK (200-299).
                if (!response.ok) {
                    return response.json().then(errorData => {
                        throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
                    });
                }
                return response.json();
            })
            .then(data => {
                console.log('Success:', data);
                
                // Hide the spinner on success.
                document.getElementById("formiqueSpinner").style.display = "none";

                const formContainer = document.getElementById(this.formContainerId);
                if (this.redirect && this.redirectURL) {
                    window.location.href = this.redirectURL;
                }
                if (formContainer) {
                    const successMessageDiv = document.createElement('div');
                    successMessageDiv.classList.add('success-message', 'message-container');
                    successMessageDiv.innerHTML = this.formSettings.successMessage || 'Your details have been successfully submitted!';
                    formContainer.innerHTML = '';
                    formContainer.appendChild(successMessageDiv);
                }
            })
            .catch(error => {
                console.error('Error:', error);

                // Hide the spinner on error.
                document.getElementById("formiqueSpinner").style.display = "none";

                const formContainer = document.getElementById(this.formContainerId);
                if (formContainer) {
                    let existingErrorDiv = formContainer.querySelector('.error-message');
                    if (existingErrorDiv) {
                        existingErrorDiv.remove();
                    }
                    const errorMessageDiv = document.createElement('div');
                    errorMessageDiv.classList.add('error-message', 'message-container');
                    let err = this.formSettings.errorMessage || 'An error occurred while submitting the form. Please try again.';
                    err = `${err}<br/>Details: ${error.message}`;
                    errorMessageDiv.innerHTML = err;
                    formContainer.appendChild(errorMessageDiv);
                }
            });

            // Return false to ensure no other default action is taken, especially for legacy browsers.
            return false;
        });
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
    bindingDirective = `bind:value="${name}"\n`;
  }
  if (attributes.binding.startsWith('::') && name) {
   bindingDirective = `bind:value="${name}"\n`;
  }
  if (attributes.binding && !name) {
    console.log(`\x1b[31m%s\x1b[0m`,`You cannot set binding value when there is no name attribute defined in ${name} ${type} field.`);
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
  if (key !== 'id' && key !== 'class' && key !== 'dependsOn' && key !== 'dependents' && value !== undefined) {      if (key.startsWith('on')) {
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
    <div class="${this.divClass}" id="${id + '-block'}">
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
  if (attributes.binding) {
if (attributes.binding === 'bind:value' && name) {
    bindingDirective = `bind:value="${name}"\n`;
  }
  if (attributes.binding.startsWith('::') && name) {
   bindingDirective = `bind:value="${name}"\n`;
  }
  if (attributes.binding && !name) {
    console.log(`\x1b[31m%s\x1b[0m`, `You cannot set binding value when there is no name attribute defined in ${name} ${type} field.`);
    return;
  }
  }


  // Get the id from attributes or fall back to name
  let id = attributes.id || name;

  // Construct additional attributes dynamically
  let additionalAttrs = '';
  for (const [key, value] of Object.entries(attributes)) {
  if (key !== 'id' && key !== 'class' && key !== 'dependsOn' && key !== 'dependents' && value !== undefined) {      if (key.startsWith('on')) {
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
    <div class="${this.divClass}" id="${id + '-block'}"> 
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
if (attributes.binding === 'bind:value' && name) {
    bindingDirective = `bind:value="${name}"\n`;
  }
  if (attributes.binding.startsWith('::') && name) {
   bindingDirective = `bind:value="${name}"\n`;
  }
  if (attributes.binding && !name) {
    console.log(`\x1b[31m%s\x1b[0m`, `You cannot set binding value when there is no name attribute defined in ${name} ${type} field.`);
    return;
  }
  }



  // Get the id from attributes or fall back to name
  let id = attributes.id || name;

  // Construct additional attributes dynamically
  let additionalAttrs = '';
  for (const [key, value] of Object.entries(attributes)) {
  if (key !== 'id' && key !== 'class' && key !== 'dependsOn' && key !== 'dependents' && value !== undefined) {      if (key.startsWith('on')) {
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
    <div class="${this.divClass}" id="${id + '-block'}"> 
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
  
  //return formattedHtml;
  this.formMarkUp +=formattedHtml;
}



// New method for rendering password fields
renderPasswordField(type, name, label, validate, attributes) {
  // Define valid attributes for the password input type


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
  // Handle the binding syntax
  let bindingDirective = '';
  if (attributes.binding) {
if (attributes.binding === 'bind:value' && name) {
    bindingDirective = `bind:value="${name}"\n`;
  }
  if (attributes.binding.startsWith('::') && name) {
   bindingDirective = `bind:value="${name}"\n`;
  }
  if (attributes.binding && !name) {
    console.log(`\x1b[31m%s\x1b[0m`, `You cannot set binding value when there is no name attribute defined in ${name} ${type} field.`);
    return;
  }
  }




  // Get the id from attributes or fall back to name
  let id = attributes.id || name;

  // Construct additional attributes dynamically
  let additionalAttrs = '';
  for (const [key, value] of Object.entries(attributes)) {
  if (key !== 'id' && key !== 'class' && key !== 'dependsOn' && key !== 'dependents' && value !== undefined) {      if (key.startsWith('on')) {
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
    <div class="${this.divClass}" id="${id + '-block'}"> 
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

  //return formattedHtml;
  this.formMarkUp +=formattedHtml;
}


// Textarea field rendering

renderTextAreaField(type, name, label, validate, attributes) {
  const textInputValidationAttributes = ['required', 'minlength', 'maxlength', 'pattern'];

  // 1. Extract content value to place between tags later
  const textareaValue = attributes.value || '';

  // Construct validation attributes
  let validationAttrs = '';
  if (validate) {
    Object.entries(validate).forEach(([key, value]) => {
      if (textInputValidationAttributes.includes(key)) {
        if (typeof value === 'boolean' && value) {
          validationAttrs += `  ${key}\n`;
        } else {
          validationAttrs += `  ${key}="${value}"\n`;
        }
      } else {
        console.warn(`\x1b[31mUnsupported validation attribute '${key}' for field '${name}' of type 'textarea'.\x1b[0m`);
      }
    });
  }

  // Handle the binding syntax
  let bindingDirective = '';
  if (attributes.binding && name) {
    bindingDirective = `bind:value="${name}"\n`;
  }

  let id = attributes.id || name;
  const framework = this.formSettings?.framework || false;

  // Construct additional attributes (excluding internal keys and the 'value' content)
  let additionalAttrs = '';
  for (const [key, value] of Object.entries(attributes)) {
    if (!['id', 'class', 'dependsOn', 'dependents', 'value', 'binding'].includes(key) && value !== undefined) {
      if (key.startsWith('on')) {
        const eventValue = value.endsWith('()') ? value : `${value}()`;
        additionalAttrs += `  ${key}="${eventValue}"\n`;
      } else {
        const attrName = key.replace(/_/g, '-');
        if (value === true) {
          additionalAttrs += `  ${attrName}\n`;
        } else if (value !== false) {
          additionalAttrs += `  ${attrName}="${value}"\n`;
        }
      }
    }
  }

  let inputClass = attributes.class || this.inputClass;

  // Build the raw HTML structure
  let formHTML = `
<div class="${this.divClass}" id="${id + '-block'}">
  <label for="${id}">${label}
    ${validationAttrs.includes('required') && this.formSettings.requiredFieldIndicator ? this.formSettings.asteriskHtml : ''}
  </label>
  <textarea 
    name="${name}"
    ${bindingDirective}
    id="${id}"
    class="${inputClass}"
    ${additionalAttrs}
    ${validationAttrs}
    ${(additionalAttrs.includes('placeholder') || attributes.placeholder) ? '' : (this.formSettings.placeholders ? `placeholder="${label}"` : '')}>${textareaValue}</textarea>
</div>`.replace(/^\s*\n/gm, '').trim();

  // Vertical layout formatting for attributes while preserving content
  let formattedHtml = formHTML.replace(/<textarea\s+([\s\S]*?)>([\s\S]*?)<\/textarea>/, (match, attrPart, content) => {
    // Split by whitespace only if it is NOT inside quotes (prevents stacking text/placeholders)
    const attrs = attrPart.trim()
      .split(/\s+(?=(?:[^"]*"[^"]*")*[^"]*$)/)
      .filter(a => a.trim() !== '')
      .map(attr => `  ${attr.trim()}`)
      .join('\n');

    return `<textarea\n${attrs}\n>${content}</textarea>`;
  });

  this.formMarkUp += formattedHtml;
}

// New method for rendering tel fields
renderTelField(type, name, label, validate, attributes) {
  
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
  // Handle the binding syntax
    let bindingDirective = '';
    if (attributes?.binding === 'bind:value' && name) {
      bindingDirective = `bind:value="${name}"\n`;
    }
    if (attributes?.binding?.startsWith('::') && name) {
      bindingDirective = `bind:value="${name}"\n`;
    }
    if (attributes?.binding && !name) {
      console.log(`\x1b[31m%s\x1b[0m`, `You cannot set binding value when there is no name attribute defined in ${name} ${type} field.`);
      return;
    }

  // Get the id from attributes or fall back to name
  let id = attributes.id || name;

  // Construct additional attributes dynamically
  let additionalAttrs = '';
  for (const [key, value] of Object.entries(attributes)) {
  if (key !== 'id' && key !== 'class' && key !== 'dependsOn' && key !== 'dependents' && value !== undefined) {      if (key.startsWith('on')) {
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
    <div class="${this.divClass}" id="${id + '-block'}">
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
}

renderDateField(type, name, label, validate, attributes) {
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
  if (attributes?.binding === 'bind:value' && name) {
    bindingDirective = `bind:value="${name}"\n`;
  }
  if (attributes?.binding?.startsWith('::') && name) {
    bindingDirective = `bind:value="${name}"\n`;
  }
  if (attributes?.binding && !name) {
    console.log(`\x1b[31m%s\x1b[0m`, `You cannot set binding value when there is no name attribute defined in ${name} ${type} field.`);
    return;
  }

  // Get the id from attributes or fall back to name
  let id = attributes.id || name;

  // Construct additional attributes dynamically
  let additionalAttrs = '';
  for (const [key, value] of Object.entries(attributes)) {
  if (key !== 'id' && key !== 'class' && key !== 'dependsOn' && key !== 'dependents' && value !== undefined) {      if (key.startsWith('on')) {
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
    <div class="${this.divClass}" id="${id + '-block'}"> 
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

  //return formattedHtml;
  this.formMarkUp +=formattedHtml;
}



renderTimeField(type, name, label, validate, attributes) {
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
  // Handle the binding syntax
  let bindingDirective = '';
  if (attributes?.binding === 'bind:value' && name) {
    bindingDirective = `bind:value="${name}"\n`;
  }
  if (attributes?.binding?.startsWith('::') && name) {
    bindingDirective = `bind:value="${name}"\n`;
  }
  if (attributes?.binding && !name) {
    console.log(`\x1b[31m%s\x1b[0m`, `You cannot set binding value when there is no name attribute defined in ${name} ${type} field.`);
    return;
  }

  // Get the id from attributes or fall back to name
  let id = attributes.id || name;

  // Construct additional attributes dynamically
  let additionalAttrs = '';
  for (const [key, value] of Object.entries(attributes)) {
  if (key !== 'id' && key !== 'class' && key !== 'dependsOn' && key !== 'dependents' && value !== undefined) {      if (key.startsWith('on')) {
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
    <div class="${this.divClass}" id="${id + '-block'}"> 
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

  //return formattedHtml;
  this.formMarkUp +=formattedHtml;
}




renderDateTimeField(type, name, label, validate, attributes) {
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
  if (attributes.binding) {
  if (attributes.binding === 'bind:value' && name) {
    bindingDirective = `bind:value="${name}"\n`;
  }
  if (attributes.binding.startsWith('::') && name) {
   bindingDirective = `bind:value="${name}"\n`;
  }
  if (attributes.binding && !name) {
    console.log(`\x1b[31m%s\x1b[0m`, `You cannot set binding value when there is no name attribute defined in ${name} ${type} field.`);
    return;
  }
  }




  // Get the id from attributes or fall back to name
  let id = attributes.id || name;

  // Construct additional attributes dynamically
  let additionalAttrs = '';
  for (const [key, value] of Object.entries(attributes)) {
  if (key !== 'id' && key !== 'class' && key !== 'dependsOn' && key !== 'dependents' && value !== undefined) {      if (key.startsWith('on')) {
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
    <div class="${this.divClass}" id="${id + '-block'}"> 
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

  //return formattedHtml;
  this.formMarkUp +=formattedHtml;
}


renderMonthField(type, name, label, validate, attributes) {
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
    if (attributes?.binding === 'bind:value' && name) {
      bindingDirective = `bind:value="${name}"\n`;
    }
    if (attributes?.binding?.startsWith('::') && name) {
      bindingDirective = `bind:value="${name}"\n`;
    }
    if (attributes?.binding && !name) {
      console.log(`\x1b[31m%s\x1b[0m`, `You cannot set binding value when there is no name attribute defined in ${name} ${type} field.`);
      return;
    }


  // Get the id from attributes or fall back to name
  let id = attributes.id || name;

  // Construct additional attributes dynamically
  let additionalAttrs = '';
  for (const [key, value] of Object.entries(attributes)) {
  if (key !== 'id' && key !== 'class' && key !== 'dependsOn' && key !== 'dependents' && value !== undefined) {      if (key.startsWith('on')) {
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
    <div class="${this.divClass}" id="${id + '-block'}">
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

  //return formattedHtml;
  this.formMarkUp +=formattedHtml;
}



renderWeekField(type, name, label, validate, attributes) {
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
    if (attributes?.binding === 'bind:value' && name) {
      bindingDirective = `bind:value="${name}"\n`;
    }
    if (attributes?.binding?.startsWith('::') && name) {
      bindingDirective = `bind:value="${name}"\n`;
    }
    if (attributes?.binding && !name) {
      console.log(`\x1b[31m%s\x1b[0m`, `You cannot set binding value when there is no name attribute defined in ${name} ${type} field.`);
      return;
    }

  // Get the id from attributes or fall back to name
  let id = attributes.id || name;

  // Construct additional attributes dynamically
  let additionalAttrs = '';
  for (const [key, value] of Object.entries(attributes)) {
  if (key !== 'id' && key !== 'class' && key !== 'dependsOn' && key !== 'dependents' && value !== undefined) {      if (key.startsWith('on')) {
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
    <div class="${this.divClass}" id="${id + '-block'}">
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

  //return formattedHtml;
  this.formMarkUp +=formattedHtml;
}



renderUrlField(type, name, label, validate, attributes) {
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
  // Handle the binding syntax
let bindingDirective = '';
if (attributes?.binding === 'bind:value' && name) {
  bindingDirective = `bind:value="${name}"\n`;
}
if (attributes?.binding?.startsWith('::') && name) {
  bindingDirective = `bind:value="${name}"\n`;
}
if (attributes?.binding && !name) {
  console.log(`\x1b[31m%s\x1b[0m`, `You cannot set binding value when there is no name attribute defined in ${name} ${type} field.`);
  return;
}

  // Get the id from attributes or fall back to name
  let id = attributes.id || name;

  // Construct additional attributes dynamically
  let additionalAttrs = '';
  for (const [key, value] of Object.entries(attributes)) {
  if (key !== 'id' && key !== 'class' && key !== 'dependsOn' && key !== 'dependents' && value !== undefined) {      if (key.startsWith('on')) {
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
    <div class="${this.divClass}" id="${id + '-block'}">
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

  //return formattedHtml;
  this.formMarkUp +=formattedHtml;
}


renderSearchField(type, name, label, validate, attributes) {
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
if (attributes?.binding === 'bind:value' && name) {
  bindingDirective = `bind:value="${name}"\n`;
}
if (attributes?.binding?.startsWith('::') && name) {
  bindingDirective = `bind:value="${name}"\n`;
}
if (attributes?.binding && !name) {
  console.log(`\x1b[31m%s\x1b[0m`, `You cannot set binding value when there is no name attribute defined in ${name} ${type} field.`);
  return;
}

  // Get the id from attributes or fall back to name
  let id = attributes.id || name;

  // Construct additional attributes dynamically
  let additionalAttrs = '';
  for (const [key, value] of Object.entries(attributes)) {
  if (key !== 'id' && key !== 'class' && key !== 'dependsOn' && key !== 'dependents' && value !== undefined) {      if (key.startsWith('on')) {
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
    <div class="${this.divClass}" id="${id + '-block'}">
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

  //return formattedHtml;
  this.formMarkUp +=formattedHtml;
}


renderColorField(type, name, label, validate, attributes) {
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
  // Handle the binding syntax
  let bindingDirective = '';
  if (attributes?.binding === 'bind:value' && name) {
    bindingDirective = `bind:value="${name}"\n`;
  }
  if (attributes?.binding?.startsWith('::') && name) {
    bindingDirective = `bind:value="${name}"\n`;
  }
  if (attributes?.binding && !name) {
    console.log(`\x1b[31m%s\x1b[0m`, `You cannot set binding value when there is no name attribute defined in ${name} ${type} field.`);
    return;
  }

  // Get the id from attributes or fall back to name
  let id = attributes.id || name;

  // Construct additional attributes dynamically
  let additionalAttrs = '';
  for (const [key, value] of Object.entries(attributes)) {
  if (key !== 'id' && key !== 'class' && key !== 'dependsOn' && key !== 'dependents' && value !== undefined) {      if (key.startsWith('on')) {
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
       // inputClass = this.inputClass; 
  }

 if (type === 'color') {
  inputClass += ' form-color-input'; // Add the new specific class for color inputs
}

// Construct the final HTML string
  let formHTML = `
    <div class="${this.divClass}" id="${id + '-block'}">
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

  //return formattedHtml;
  this.formMarkUp +=formattedHtml;
}



renderFileField(type, name, label, validate, attributes) {
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
    if (attributes?.binding === 'bind:value' && name) {
      bindingDirective = `bind:value="${name}"\n`;
    }
    if (attributes?.binding?.startsWith('::') && name) {
      bindingDirective = `bind:value="${name}"\n`;
    }
    if (attributes?.binding && !name) {
      console.log(`\x1b[31m%s\x1b[0m`, `You cannot set binding value when there is no name attribute defined in ${name} ${type} field.`);
      return;
    }

  // Get the id from attributes or fall back to name
  let id = attributes.id || name;

  // Construct additional attributes dynamically
  let additionalAttrs = '';
  for (const [key, value] of Object.entries(attributes)) {
  if (key !== 'id' && key !== 'class' && key !== 'dependsOn' && key !== 'dependents' && value !== undefined) {      if (key.startsWith('on')) {
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
    <div class="${this.divClass}" id="${id + '-block'}">
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

  //return formattedHtml;
  this.formMarkUp +=formattedHtml;
}





renderHiddenField(type, name, label, validate, attributes) {
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
  if (attributes?.binding === 'bind:value' && name) {
    bindingDirective = `bind:value="${name}"\n`;
  }
  if (attributes?.binding?.startsWith('::') && name) {
    bindingDirective = `bind:value="${name}"\n`;
  }
  if (attributes?.binding && !name) {
    console.log(`\x1b[31m%s\x1b[0m`, `You cannot set binding value when there is no name attribute defined in ${name} ${type} field.`);
    return;
  }


  // Get the id from attributes or fall back to name
  let id = attributes.id || name;

  // Construct additional attributes dynamically
  let additionalAttrs = '';
  for (const [key, value] of Object.entries(attributes)) {
  if (key !== 'id' && key !== 'class' && key !== 'dependsOn' && key !== 'dependents' && value !== undefined) {      if (key.startsWith('on')) {
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
    <div class="${this.divClass}" id="${id + '-block'}">
    <!--<label for="${id}">${label} 
  ${validationAttrs.includes('required') && this.formSettings.requiredFieldIndicator ? this.formSettings.asteriskHtml : ''}
</label> -->
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


/*
renderImageField(type, name, label, validate, attributes) {
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
  // Handle the binding syntax
let bindingDirective = '';
if (attributes?.binding === 'bind:value' && name) {
  bindingDirective = `bind:value="${name}"\n`;
}
if (attributes?.binding?.startsWith('::') && name) {
  bindingDirective = `bind:value="${name}"\n`;
}
if (attributes?.binding && !name) {
  console.log(`\x1b[31m%s\x1b[0m`, `You cannot set binding value when there is no name attribute defined in ${name} ${type} field.`);
  return;
}

  // Get the id from attributes or fall back to name
  let id = attributes.id || name;

  // Construct additional attributes dynamically
  let additionalAttrs = '';
  for (const [key, value] of Object.entries(attributes)) {
  if (key !== 'id' && key !== 'class' && key !== 'dependsOn' && key !== 'dependents' && value !== undefined) {      if (key.startsWith('on')) {
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
    <div class="${this.divClass}" id="${id + '-block'}">
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

  //return formattedHtml;
  this.formMarkUp +=formattedHtml;
}

*/

renderImageField(type, name, label, validate, attributes) {
  // Define valid validation attributes for image input
  const imageValidationAttributes = [
    'accept',
    'required',
    'minwidth',
    'maxwidth',
    'minheight',
    'maxheight',
    'src',
    'alt',
    'width',
    'height'
  ];

  // Construct validation attributes
  let validationAttrs = '';
  if (validate) {
    Object.entries(validate).forEach(([key, value]) => {
      if (imageValidationAttributes.includes(key)) {
        if (typeof value === 'boolean' && value) {
          validationAttrs += `  ${key}\n`;
        } else {
          validationAttrs += `  ${key}="${value}"\n`;
        }
      } else {
        console.warn(`\x1b[31mUnsupported validation attribute '${key}' for field '${name}' of type '${type}'.\x1b[0m`);
      }
    });
  }

  // Handle the binding syntax
  let bindingDirective = '';
  const bindingValue = attributes?.binding;
  if (bindingValue === 'bind:value' && name) {
    bindingDirective = `bind:value="${name}"\n`;
  }
  if (typeof bindingValue === 'string' && bindingValue.startsWith('::') && name) {
    bindingDirective = `bind:value="${name}"\n`;
  }
  if (bindingValue && !name) {
    console.log(`\x1b[31m%s\x1b[0m`, `You cannot set binding value when there is no name attribute defined in ${name} ${type} field.`);
    return;
  }

  // Get the id from attributes or fall back to name
  let id = attributes.id || name;

  // Construct additional attributes dynamically
  let additionalAttrs = '';
  for (const [key, value] of Object.entries(attributes)) {
    if (key !== 'id' && key !== 'class' && key !== 'dependsOn' && key !== 'dependents' && value !== undefined) {
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

  // Special handling for image submit button
  let inputElement;
  if (type === 'image' && name === 'submit') {
    inputElement = `
      <input 
        type="image"
        name="${name}"
        ${bindingDirective}
        id="${id}"
        class="${attributes.class || this.inputClass}"
        src="${attributes.src || 'img_submit.gif'}"
        alt="${attributes.alt || 'Submit'}"
        width="${attributes.width || '48'}"
        height="${attributes.height || '48'}"
        ${additionalAttrs}
        ${validationAttrs}
      />`;
  } else {
    // Regular image input field
    inputElement = `
      <input 
        type="${type}"
        name="${name}"
        ${bindingDirective}
        id="${id}"
        class="${attributes.class || this.inputClass}"
        ${additionalAttrs}
        ${validationAttrs}
      />`;
  }

  // Construct the final HTML string
  let formHTML = `
    <div class="${this.divClass}" id="${id + '-block'}">
      ${type === 'image' && name === 'submit' ? '' : `<label for="${id}">${label}
        ${validationAttrs.includes('required') && this.formSettings.requiredFieldIndicator ? this.formSettings.asteriskHtml : ''}
      </label>`}
      ${inputElement}
    </div>
  `.replace(/^\s*\n/gm, '').trim();

  // Format the HTML
  let formattedHtml = formHTML.replace(/<input\s+([^>]*)\/>/, (match, p1) => {
    const attributes = p1.trim().split(/\s+/).map(attr => `  ${attr}`).join('\n');
    return `<input\n${attributes}\n/>`;
  });

  formattedHtml = formattedHtml.replace(/(<div\s+[^>]*>)/g, (match) => {
    return `\n${match}\n`;
  }).replace(/\n\s*\n/g, '\n');

  this.formMarkUp += formattedHtml;
}




// Radio field rendering

renderRadioField(type, name, label, validate, attributes, options) {
    // Define valid validation attributes for radio fields
    //console.log("RADIO DEBUG - options:", JSON.stringify(options, null, 2));

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
    if (attributes.binding) {
        if (attributes.binding === 'bind:value' && name) {
            bindingDirective = ` bind:value="${name}"\n`;
        } else if (attributes.binding.startsWith('::') && name) {
            bindingDirective = ` bind:value="${name}"\n`;
        } else if (attributes.binding && !name) {
            console.log(`\x1b[31m%s\x1b[0m`, `You cannot set binding value when there is no name attribute defined in ${name} ${type} field.`);
            return;
        }
    }

    // Define attributes for the radio inputs
    let id = attributes.id || name;

    // Construct additional attributes dynamically
    let additionalAttrs = '';
    for (const [key, value] of Object.entries(attributes)) {
        if (key !== 'id' && key !== 'class' && key !== 'dependsOn' && key !== 'dependents' && value !== undefined) {
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

    // Determine which option should be selected
    let selectedValue = null;
    
    // Check options array for selected: true
    if (options && options.length) {
        const selectedOption = options.find(opt => opt.selected === true);
        //console.log("RADIO DEBUG - selectedOption:", selectedOption);
        if (selectedOption) {
            selectedValue = selectedOption.value;
           // console.log("RADIO DEBUG - selectedValue:", selectedValue);
        }
    }

    // Construct radio button HTML based on options
    let optionsHTML = '';
    if (options && options.length) {
        optionsHTML = options.map((option) => {
            // Check if this option should be selected
            const isSelected = (option.value === selectedValue);
            //console.log("RADIO DEBUG - option:", option.value, "isSelected:", isSelected);
            const checkedAttr = isSelected ? ' checked' : '';
            
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
                    ${checkedAttr}
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
    <fieldset class="${this.radioGroupClass}" id="${id + '-block'}">
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

    this.formMarkUp += formattedHtml;
}

renderCheckboxField(type, name, label, validate, attributes, options) {
  // Define valid validation attributes for checkbox fields
  //console.log("CHECKBOX DEBUG - options:", JSON.stringify(options, null, 2));

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
  if (attributes.binding) {
    if (attributes.binding === 'bind:checked') {
      bindingDirective = ` bind:checked="${name}"\n`;
    } else if (attributes.binding.startsWith('::')) {
      bindingDirective = ` bind:checked="${name}"\n`;
    }
  }

  // Define attributes for the checkbox inputs
  let id = attributes.id || name;

  // Handle additional attributes
  let additionalAttrs = '';
  for (const [key, value] of Object.entries(attributes)) {
    if (key !== 'id' && key !== 'class' && key !== 'dependsOn' && key !== 'dependents' && value !== undefined) {
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

  // Determine which options should be checked
  const checkedValues = [];
  if (options && options.length) {
    options.forEach(option => {
      if (option.checked === true || option.selected === true) {
        checkedValues.push(option.value);
      }
    });
  }
  //console.log("CHECKBOX DEBUG - checkedValues:", checkedValues);

  // Construct checkbox HTML based on options
  let optionsHTML = '';
  if (Array.isArray(options)) {
    optionsHTML = options.map((option) => {
      const optionId = `${id}-${option.value}`;
      const isChecked = checkedValues.includes(option.value);
      //console.log("CHECKBOX DEBUG - option:", option.value, "isChecked:", isChecked);
      const checkedAttr = isChecked ? ' checked' : '';
      
      return `
        <div>
          <input 
            type="checkbox" 
            name="${name}" 
            value="${option.value}"${bindingDirective} ${additionalAttrs}
            ${attributes.id ? `id="${optionId}"` : `id="${optionId}"`}
            class="${inputClass}"
            ${checkedAttr}
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
    <fieldset class="${this.checkboxGroupClass}" id="${id + '-block'}">
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

  this.formMarkUp += formattedHtml;
}



/* DYNAMIC SINGLE SELECT BLOCK */

// Function to render the dynamic select field and update based on user selection
renderDynamicSingleSelectField(type, name, label, validate, attributes, options, subOptions) {
    console.log('DEBUG: renderDynamicSingleSelectField called', { 
        type, name, label, 
        options: options ? options.length : 'none',
        subOptions: subOptions ? subOptions.length : 'none'
    });
    
    // Check if options exist
    if (!options || !Array.isArray(options)) {
        console.warn('Dynamic single select field missing options:', name);
        options = [];
    }
    
    // Step 1: Extract main categories from options
    // Options should already be in the correct format from the parser
    const mainCategoryOptions = options.map(item => {
        // Handle both string and object formats
        if (typeof item === 'string') {
            return {
                value: item.toLowerCase().replace(/\s+/g, '-'),
                label: item
            };
        } else {
            // Already an object with value/label
            return {
                value: item.value || item.id || item,
                label: item.label || item.value || item
            };
        }
    });
    
    // Step 2: Handle subCategoriesOptions (scenario blocks)
    let subCategoriesOptions = [];
    
    if (subOptions && Array.isArray(subOptions)) {
        // Use the subOptions exactly as provided by the parser
        // They should already have the correct structure
        subCategoriesOptions = subOptions.map(item => {
            // Ensure each subCategory has the required structure
            return {
                id: item.id || item.value || '',
                label: item.label || item.id || '',
                options: Array.isArray(item.options) ? item.options : []
            };
        });
    }
    
    console.log('Main categories:', mainCategoryOptions);
    console.log('Sub categories:', subCategoriesOptions);
    
    // Pass both to the renderer with the mode flag
    this.renderSingleSelectField(
        type, 
        name, 
        label, 
        validate, 
        attributes, 
        mainCategoryOptions, 
        subCategoriesOptions, 
        'dynamicSingleSelect'
    );
}





renderSingleSelectField(type, name, label, validate, attributes, options, subCategoriesOptions, mode) {
    // Define valid validation attributes for select fields
    const selectValidationAttributes = ['required'];

    // Construct validation attributes
    let validationAttrs = '';
    let originalRequired = false;
    if (validate) {
        Object.entries(validate).forEach(([key, value]) => {
            if (selectValidationAttributes.includes(key)) {
                if (key === 'required') {
                    validationAttrs += `${key} `;
                    originalRequired = true;
                }
            }
        });
    }

    // Handle the binding syntax
    let bindingDirective = '';
    if (attributes.binding) {
        if (typeof attributes.binding === 'string' && attributes.binding.startsWith('::')) {
            bindingDirective = ` bind:value="${name}" `;
        }
    }

    // Define attributes for the select field
    let id = attributes.id || name;
    let dimensionAttrs = '';

    // Handle additional attributes
    let additionalAttrs = '';
    for (const [key, value] of Object.entries(attributes)) {
        if (key !== 'id' && key !== 'class' && key !== 'dependsOn' && key !== 'dependents' && value !== undefined) {
            if (key.startsWith('on')) {
                const eventValue = value.endsWith('()') ? value.slice(0, -2) : value;
                additionalAttrs += ` @${key.replace(/^on/, '')}={${eventValue}}\n`;
            } else {
                if (value === true) {
                    additionalAttrs += ` ${key.replace(/_/g, '-')}\n`;
                } else if (value !== false) {
                    additionalAttrs += ` ${key.replace(/_/g, '-')}="${value}"\n`;
                }
            }
        }
    }

    // Construct select options HTML based on options
    let selectHTML = '';
    if (Array.isArray(options) && options.length > 0) {
        // Add a default option
        selectHTML += `
        <option value="">Choose an option</option>
        `;

        // Add the provided options
        selectHTML += options.map((option) => {
            const optionValue = option.value || option;
            const optionLabel = option.label || option;
            const isSelected = option.selected ? ' selected' : '';
            return `
            <option value="${optionValue}"${isSelected}>${optionLabel}</option>
            `;
        }).join('');
    }

    let inputClass = attributes.class || this.inputClass;

    // Construct the final HTML string for the main select
    let formHTML = `
    <fieldset class="${this.selectGroupClass}" id="${id + '-block'}">
        <legend>${label}
            ${validationAttrs.includes('required') && this.formSettings.requiredFieldIndicator ? this.formSettings.asteriskHtml : ''}
        </legend>
        <label for="${id}"> Select ${label}
        <select name="${name}"
            ${bindingDirective}
            ${dimensionAttrs}
            id="${id}"
            class="${inputClass}"
            ${additionalAttrs}
            ${validationAttrs}
            data-original-required="${originalRequired}" >
            ${selectHTML}
        </select>
    </fieldset>
    `.replace(/^\s*\n/gm, '').trim();

    // Format the HTML
    let formattedHtml = formHTML.replace(/<select\s+([^>]*)>([\s\S]*?)<\/select>/g, (match, p1, p2) => {
        const attributes = p1.match(/(\w+(?:-\w+)*=("[^"]*"|'[^']*'|\w+)|[^=\s]+(?!\s*=))/g) || [];
        const formattedAttributes = attributes.map(attr => ` ${attr}`).join('\n');
        return `<select\n${formattedAttributes}\n>\n${p2.trim()}\n</select>`;
    });

    this.formMarkUp += formattedHtml;

    /* dynamicSingleSelect - Sub-Category Generation Block */
    if (mode === 'dynamicSingleSelect' && subCategoriesOptions && Array.isArray(subCategoriesOptions) && subCategoriesOptions.length > 0) {
        const categoryId = attributes.id || name;

        subCategoriesOptions.forEach((subCategory) => {
            // Skip invalid subCategories
            if (!subCategory || !subCategory.id) {
                console.warn('Invalid subCategory in dynamic select:', subCategory);
                return;
            }

            const { id, label: subLabel, options: subOptions } = subCategory;
            
            // Ensure subOptions is an array
            const subOptionArray = Array.isArray(subOptions) ? subOptions : [];
            
            // Build the select options HTML for sub-category
            const subSelectHTML = subOptionArray.length > 0 ? 
                subOptionArray.map(option => {
                    const optionValue = option.value || option;
                    const optionLabel = option.label || option;
                    const isSelected = option.selected ? ' selected' : '';
                    return `
                        <option value="${optionValue}"${isSelected}>${optionLabel}</option>
                    `;
                }).join('') :
                '<option value="">No options available</option>';

            // Create the HTML for the sub-category fieldset
            let subFormHTML = `
                <fieldset class="${this.selectGroupClass} ${categoryId}" id="${id}" style="display: none;">
                    <legend>${subLabel || id}</legend>
                    <label for="${id}"> Select ${subLabel || id}</label>
                    <select name="${id}"
                        ${bindingDirective}
                        ${dimensionAttrs}
                        id="${id}"
                        class="${inputClass}"
                        ${additionalAttrs}
                        data-original-required="false">
                        <option value="">Choose an option</option>
                        ${subSelectHTML}
                    </select>
                </fieldset>
            `.replace(/^\s*\n/gm, '').trim();

            // Format the HTML
            subFormHTML = subFormHTML.replace(/<select\s+([^>]*)>([\s\S]*?)<\/select>/g, (match, p1, p2) => {
                const attributes = p1.match(/(\w+(?:-\w+)*=("[^"]*"|'[^']*'|\w+)|[^=\s]+(?!\s*=))/g) || [];
                const formattedAttributes = attributes.map(attr => ` ${attr}`).join('\n');
                return `<select\n${formattedAttributes}\n>\n${p2.trim()}\n</select>`;
            });

            this.formMarkUp += subFormHTML;
        });
    }
}


renderMultipleSelectField(type, name, label, validate, attributes, options) {
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
  if (attributes.binding) {
  if (typeof attributes.binding === 'string' && attributes.binding.startsWith('::')) {
    bindingDirective = ` bind:value="${name}" `;
  }
}

  // Define attributes for the select field
  let id = attributes.id || name;
  let dimensionAttrs = ''; // No dimension attributes applicable for select fields

  // Handle additional attributes
  let additionalAttrs = '';
  for (const [key, value] of Object.entries(attributes)) {
  if (key !== 'id' && key !== 'class' && key !== 'dependsOn' && key !== 'dependents' && value !== undefined) {      if (key.startsWith('on')) {
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
    <fieldset class="${this.selectGroupClass}" id="${id + '-block'}">
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


renderRangeField(type, name, label, validate, attributes) {
  const rangeValidationAttributes = ['required', 'min', 'max', 'step'];

  // Construct validation attributes
  let validationAttrs = '';
  if (validate) {
    Object.entries(validate).forEach(([key, value]) => {
      if (rangeValidationAttributes.includes(key)) {
        if (typeof value === 'boolean' && value) {
          validationAttrs += `  ${key}\n`;
        } else {
          validationAttrs += `  ${key}="${value}"\n`;
        }
      } else {
        console.warn(`Unsupported validation attribute '${key}' for field '${name}' of type 'range'.`);
      }
    });
  }

  // Handle the binding syntax
  let bindingDirective = '';
  if (attributes.binding) {
    if (attributes.binding === 'bind:value' && name) {
      bindingDirective = `bind:value="${name}"\n`;
    } else if (attributes.binding.startsWith('::') && name) {
      bindingDirective = `bind:value="${name}"\n`;
    } else if (attributes.binding && !name) {
      console.log(`You cannot set binding value when there is no name attribute defined in ${name} ${type} field.`);
      return;
    }
  }

  // Get the id from attributes or fall back to name
  let id = attributes.id || name;

  // Construct additional attributes dynamically
  let additionalAttrs = '';
  for (const [key, value] of Object.entries(attributes)) {
    if (key !== 'id' && key !== 'class' && value !== undefined) {
      if (key.startsWith('on')) {
        const eventValue = value.endsWith('()') ? value.slice(0, -2) : value;
        additionalAttrs += `  @${key.replace(/^on/, '')}={${eventValue}}\n`;
      } else {
        if (value === true) {
          additionalAttrs += `  ${key.replace(/_/g, '-')}\n`;
        } else if (value !== false) {
          additionalAttrs += `  ${key.replace(/_/g, '-')}="${value}"\n`;
        }
      }
    }
  }

  // Handle class attribute
  let inputClass = attributes.class || this.inputClass;

  // Construct the final HTML string
  let formHTML = `
    <div class="${this.divClass}" id="${id}-block">
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
      <span id="${id}-value">50</span> <!-- Displays the range value dynamically -->
    </div>
  `.replace(/^\s*\n/gm, '').trim();

  // Apply vertical layout to the <input> element only
  formHTML = formHTML.replace(/<input\s+([^>]*)\/>/, (match, p1) => {
    const attributes = p1.trim().split(/\s+/).map(attr => `  ${attr}`).join('\n');
    return `<input\n${attributes}\n/>`;
  });

  this.formMarkUp += formHTML;
}


renderRecaptchaField(type, name, label, validate, attributes = {}) {
    const fieldId = attributes.id || name;
    const siteKey = attributes.siteKey;
    // Check for the presence of a siteKey
    if (!siteKey) {
        console.error('reCAPTCHA siteKey is missing from the field attributes.');
        return ''; // Do not render if the key is missing
    }

    return `
        <div class="${this.divClass}" id="${fieldId}-block">
            <label for="${fieldId}">${label}</label>
            <div class="g-recaptcha" id="${fieldId}" data-sitekey="${siteKey}"></div>
        </div>
    `;
}



/*
renderRangeField(type, name, label, validate, attributes) {
  const rangeValidationAttributes = ['required', 'min', 'max', 'step'];

  // Validate required parameters
  if (!type || !name || !label) {
    throw new Error('Missing required parameters: type, name, or label.');
  }

  // Construct validation attributes
  let validationAttrs = '';
  if (validate) {
    Object.entries(validate).forEach(([key, value]) => {
      if (rangeValidationAttributes.includes(key)) {
        if (typeof value === 'boolean' && value) {
          validationAttrs += ` ${key}`;
        } else {
          validationAttrs += ` ${key}="${value}"`;
        }
      } else {
        console.warn(`Unsupported validation attribute '${key}' for field '${name}' of type 'range'.`);
      }
    });
  }

  // Handle the binding syntax
  let bindingDirective = '';
  if (attributes.binding) {
    if (attributes.binding === 'bind:value' && name) {
      bindingDirective = `bind:value="${name}"`;
    } else if (attributes.binding.startsWith('::') && name) {
      bindingDirective = `bind:value="${name}"`;
    } else if (attributes.binding && !name) {
      console.error(`You cannot set binding value when there is no name attribute defined in ${name} ${type} field.`);
      return;
    }
  }

  // Get the id from attributes or fall back to name
  let id = attributes.id || name;

  // Construct additional attributes dynamically
  let additionalAttrs = '';
  for (const [key, value] of Object.entries(attributes)) {
    if (key !== 'id' && key !== 'class' && value !== undefined) {
      if (key.startsWith('on')) {
        const eventValue = value.endsWith('()') ? value.slice(0, -2) : value;
        additionalAttrs += ` @${key.replace(/^on/, '')}={${eventValue}}`;
      } else {
        if (value === true) {
          additionalAttrs += ` ${key.replace(/_/g, '-')}`;
        } else if (value !== false) {
          additionalAttrs += ` ${key.replace(/_/g, '-')}="${value}"`;
        }
      }
    }
  }

  // Handle class attribute
  let inputClass = attributes.class || this.inputClass;

  // Construct the final HTML string
  let formHTML = `
    <div class="${this.divClass}" id="${id}-block">
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
        ${this.formSettings.placeholders ? `placeholder="${label}"` : ''}
      />
      <span id="${id}-value">50</span> <!-- Displays the range value dynamically -->
    </div>
  `;

  this.formMarkUp += formHTML;
}

*/


/* DYNAMIC SINGLE SELECT BLOCK */



/* END DYNAMIC SINGLE SELECT BLOCK */


renderHtmlField(type, element, contents, validate, attributes) {
    // Get the id from attributes or generate one
    const id = attributes.id || `html-${Math.random().toString(36).substr(2, 9)}`;
    
    // Build class string
    let elementClass = 'html-content';
    if ('class' in attributes) {
        elementClass = attributes.class;
    }
    
    // Build additional attributes (excluding id and class)
    let additionalAttrs = '';
    for (const [key, value] of Object.entries(attributes)) {
        if (key !== 'id' && key !== 'class' && value !== undefined) {
            if (value === true) {
                additionalAttrs += ` ${key}`;
            } else if (value !== false) {
                additionalAttrs += ` ${key}="${value}"`;
            }
        }
    }
    
    // Construct HTML with form-group wrapper
    const formHTML = `
        <div class="form-group" id="${id}-block">
            <${element} id="${id}" class="${elementClass}"${additionalAttrs}>
                ${contents}
            </${element}>
        </div>
    `;
    
    this.formMarkUp += formHTML;
}



renderSubmitButton(type, name, label, validate, attributes) {
  // Define id attribute or fallback to name
  const id = attributes.id || name;

  // Handle additional attributes§
  let additionalAttrs = '';
  for (const [key, value] of Object.entries(attributes)) {
  if (key !== 'id' && key !== 'class' && key !== 'dependsOn' && key !== 'dependents' && value !== undefined) {      if (key.startsWith('on')) {
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


const spinner = `<div id="formiqueSpinner" style="display: flex; align-items: center; gap: 1rem; font-family: sans-serif; display:none;">
  <div class="formique-spinner"></div>
  <p class="message">Hang in tight, we are submitting your details…</p>
</div>
`;
  // Construct the final HTML string

  const formHTML = `
    ${spinner}
    <input type="${type}"
      id="${id + '-block'}"
      class="${submitButtonClass}"
      value="${label}"
      ${additionalAttrs}
    />
  `.replace(/^\s*\n/gm, '').trim();

  let formattedHtml = formHTML; 

  //return formattedHtml;
  this.formMarkUp +=formattedHtml;
}





 renderFormHTML() {
        this.formMarkUp += '</form>';
        const formContainer = document.getElementById(this.formContainerId);
        if (!formContainer) {
            console.error(`Error: form container with ID ${this.formContainerId} not found. Please ensure an element with id ${this.formContainerId} exists in the HTML.`);
        } else {
            formContainer.innerHTML = this.formMarkUp;
        }
    

//return this.formMarkUp;


 }




// no renderMethod below here
}


const FORMIQUE_INTERNAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600&display=swap');

/* ==================== */
/* BASE FORM VARIABLES */
/* ==================== */

:root {
    --formique-border-radius: 6px;
    --formique-padding: 2rem;
}
/*
:root {
    --formique-base-bg: white;
    --formique-base-text: #333;
    --formique-base-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    --formique-base-label: #555;
    --formique-input-border: #ddd;
    --formique-focus-color: #6a4fbf;
    --formique-btn-bg: #6a4fbf;
    --formique-btn-text: white;
    --formique-btn-shadow: 0 2px 10px rgba(106, 79, 191, 0.3);
    --formique-border-radius: 6px;
    --formique-max-width: 100%;
    --formique-padding: 2rem;
}
*/
/* ==================== */
/* BASE FORM STYLES */
/* ==================== */
.formique {
    width: 100%;
    max-width: var(--formique-max-width);
    margin: 2rem auto;
    padding: var(--formique-padding);
    background-color: var(--formique-base-bg);
    border-radius: var(--formique-border-radius);
    box-shadow: var(--formique-base-shadow);
    font-family: 'Montserrat', sans-serif;
    color: var(--formique-base-text);
    transition: all 0.3s ease;
    box-sizing: border-box;
}

/* Input Block */
.formique .input-block {
    margin-bottom: 1.5rem;
    position: relative;
}

.formique .input-block label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: var(--formique-base-label);
    font-size: 0.9rem;
}

.formique .input-block .form-input,
.formique .input-block .form-control {
    width: 100%;
    padding: 0.75rem 0;
    border: none;
    border-bottom: 1px solid var(--formique-input-border);
    background-color: transparent;
    color: var(--formique-base-text);
    box-sizing: border-box;
    font-size: 1rem;
    transition: all 0.3s ease;
}

.formique .input-block .form-input:focus,
.formique .input-block .form-control:focus {
    outline: none;
    border-bottom-width: 2px;
    border-bottom-color: var(--formique-focus-color);
}

.formique .input-block .form-input:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

/* Fieldset General Styling */
.formique fieldset {
    border: 1px solid var(--formique-input-border);
    border-radius: var(--formique-border-radius);
    padding: 1rem;
    margin-bottom: 1.5rem;
    background-color: var(--formique-base-bg);
    transition: all 0.3s ease;
}

.formique fieldset legend {
    font-weight: 600;
    color: var(--formique-base-label);
    font-size: 1rem;
    padding: 0 0.5rem;
}

/* Radio Group */
.formique .radio-group {
    /* Styles are now handled by the general fieldset or input-block if used outside fieldset */
}

.formique .radio-group legend {
    display: block;
    margin-bottom: 0.75rem;
    font-weight: 500;
    color: var(--formique-base-label);
    font-size: 0.9rem;
}

.formique .radio-group div {
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
}

.formique .radio-group .form-radio-input {
    margin-right: 0.75rem;
    width: 18px;
    height: 18px;
    accent-color: var(--formique-focus-color);
    cursor: pointer;
}

/* Checkbox Group */
.formique .checkbox-group {
    /* Styles are now handled by the general fieldset or input-block if used outside fieldset */
}

.formique .checkbox-group legend {
    display: block;
    margin-bottom: 0.75rem;
    font-weight: 500;
    color: var(--formique-base-label);
    font-size: 0.9rem;
}

.formique .checkbox-group div {
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
}

.formique .checkbox-group .form-checkbox-input {
    margin-right: 0.75rem;
    width: 18px;
    height: 18px;
    accent-color: var(--formique-focus-color);
    cursor: pointer;
}

/* Select (Dropdowns) */
.formique .form-select {
    margin-bottom: 1.5rem;
}

.formique .form-select label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: var(--formique-base-label);
    font-size: 0.9rem;
}

.formique .form-select .form-input { /* Changed from .form-select-input to .form-input */
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--formique-input-border);
    border-radius: var(--formique-border-radius);
    background-color: var(--formique-base-bg);
    color: var(--formique-base-text);
    box-sizing: border-box;
    font-size: 1rem;
    transition: all 0.3s ease;
    /* Custom arrow for select element */
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20256%20256%22%3E%3Cpath%20fill%3D%22%23'+encodeURIComponent(var(--formique-base-text)).substring(1)+'%22%20d%3D%22M208.5%2084.5l-80%2080a12%2012%200%2001-17%200l-80-80a12%2012%200%200117-17L128%20139l71.5-71.5a12%2012%200%200117%2017z%22%2F%3E%3C%2Fsvg%3E');
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    background-size: 1rem;
    cursor: pointer;
}

.formique .form-select .form-input:focus { /* Changed from .form-select-input to .form-input */
    outline: none;
    border-color: var(--formique-focus-color);
    box-shadow: 0 0 0 2px rgba(106, 79, 191, 0.1);
}

/* Multiple Selects */
.formique .form-select .form-input[multiple] {
    min-height: 100px; /* Adjust as needed */
    padding: 0.5rem;
    background-image: none; /* Remove custom arrow for multiselect */
}

/* Submit Button */
.formique .form-submit-btn {
    display: block;
    width: 100%;
    padding: 0.875rem 1.75rem;
    border: none;
    border-radius: var(--formique-border-radius);
    background-color: var(--formique-btn-bg);
    color: var(--formique-btn-text);
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: var(--formique-btn-shadow);
    box-sizing: border-box;
}

.formique .form-submit-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 15px var(--formique-btn-shadow);
}

.formique .form-submit-btn:active {
    transform: translateY(0);
}

/* ==================== */
/* THEME DEFINITIONS */
/* ==================== */
.dark-theme {
    --formique-base-bg: #1e1e1e;
    --formique-base-text: #e0e0e0;
    --formique-base-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    --formique-base-label: #b0b0b0;
    --formique-input-border: #444;
    --formique-focus-color: #b0b0b0;
    --formique-btn-bg: #b0b0b0;
    --formique-btn-text: #1e1e1e;
    --formique-btn-shadow: 0 2px 10px rgba(176, 176, 176, 0.3);
}

.light-theme {
    --formique-base-bg: #ffffff;
    --formique-base-text: #333333;
    --formique-base-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    --formique-base-label: #555555;
    --formique-input-border: #dddddd;
    --formique-focus-color: #555555;
    --formique-btn-bg: #777777;
    --formique-btn-text: #ffffff;
    --formique-btn-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.pink-theme {
    --formique-base-bg: #ffffff;
    --formique-base-text: #333333;
    --formique-base-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    --formique-base-label: #555555;
    --formique-input-border: #dddddd;
    --formique-focus-color: #ff4081;
    --formique-btn-bg: #ff4081;
    --formique-btn-text: #ffffff;
    --formique-btn-shadow: 0 2px 10px rgba(255, 64, 129, 0.3);
}

.indigo-theme {
    --formique-base-bg: #ffffff;
    --formique-base-text: #333333;
    --formique-base-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    --formique-base-label: #555555;
    --formique-input-border: #dddddd;
    --formique-focus-color: #3f51b5;
    --formique-btn-bg: #3f51b5;
    --formique-btn-text: #ffffff;
    --formique-btn-shadow: 0 2px 10px rgba(63, 81, 181, 0.3);
}

.dark-blue-theme {
    --formique-base-bg: #0a192f;
    --formique-base-text: #e6f1ff;
    --formique-base-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
    --formique-base-label: #a8b2d1;
    --formique-input-border: #233554;
    --formique-focus-color: #64ffda;
    --formique-btn-bg: #64ffda;
    --formique-btn-text: #0a192f;
    --formique-btn-shadow: 0 2px 10px rgba(100, 255, 218, 0.3);
}

.light-blue-theme {
    --formique-base-bg: #f5f9ff;
    --formique-base-text: #2a4365;
    --formique-base-shadow: 0 10px 30px rgba(66, 153, 225, 0.1);
    --formique-base-label: #4299e1;
    --formique-input-border: #bee3f8;
    --formique-focus-color: #3182ce;
    --formique-btn-bg: #3182ce;
    --formique-btn-text: #ffffff;
    --formique-btn-shadow: 0 2px 10px rgba(49, 130, 206, 0.3);
}

.dark-orange-theme {
    --formique-base-bg: #2d3748;
    --formique-base-text: #f7fafc;
    --formique-base-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    --formique-base-label: #cbd5e0;
    --formique-input-border: #4a5568;
    --formique-focus-color: #ed8936;
    --formique-btn-bg: #ed8936;
    --formique-btn-text: #1a202c;
    --formique-btn-shadow: 0 2px 10px rgba(237, 137, 54, 0.3);
}

.bright-yellow-theme {
    --formique-base-bg: #ffffff;
    --formique-base-text: #1a202c;
    --formique-base-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    --formique-base-label: #4a5568;
    --formique-input-border: #e2e8f0;
    --formique-focus-color: #f6e05e;
    --formique-btn-bg: #f6e05e;
    --formique-btn-text: #1a202c;
    --formique-btn-shadow: 0 2px 10px rgba(246, 224, 94, 0.3);
}

.green-theme {
    --formique-base-bg: #ffffff;
    --formique-base-text: #1a202c;
    --formique-base-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    --formique-base-label: #4a5568;
    --formique-input-border: #e2e8f0;
    --formique-focus-color: #48bb78;
    --formique-btn-bg: #48bb78;
    --formique-btn-text: #ffffff;
    --formique-btn-shadow: 0 2px 10px rgba(72, 187, 120, 0.3);
}

.purple-theme {
    --formique-base-bg: #ffffff;
    --formique-base-text: #1a202c;
    --formique-base-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    --formique-base-label: #4a5568;
    --formique-input-border: #e2e8f0;
    --formique-focus-color: #9f7aea;
    --formique-btn-bg: #9f7aea;
    --formique-btn-text: #ffffff;
    --formique-btn-shadow: 0 2px 10px rgba(159, 122, 234, 0.3);
}

.midnight-blush-theme {
    --formique-base-bg: #1a1a2e;
    --formique-base-text: #e6e6e6;
    --formique-base-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
    --formique-base-label: #b8b8b8;
    --formique-input-border: #4e4e6a;
    --formique-focus-color: #f67280;
    --formique-btn-bg: #f67280;
    --formique-btn-text: #1a1a2e;
    --formique-btn-shadow: 0 2px 10px rgba(246, 114, 128, 0.3);
}

.deep-blue-theme {
    --formique-base-bg: #0f172a;
    --formique-base-text: #e2e8f0;
    --formique-base-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
    --formique-base-label: #94a3b8;
    --formique-input-border: #1e293b;
    --formique-focus-color: #60a5fa;
    --formique-btn-bg: #60a5fa;
    --formique-btn-text: #0f172a;
    --formique-btn-shadow: 0 2px 10px rgba(96, 165, 250, 0.3);
}

.blue-theme {
    --formique-base-bg: #ffffff;
    --formique-base-text: #1e3a8a;
    --formique-base-shadow: 0 10px 30px rgba(29, 78, 216, 0.1);
    --formique-base-label: #3b82f6;
    --formique-input-border: #bfdbfe;
    --formique-focus-color: #2563eb;
    --formique-btn-bg: #2563eb;
    --formique-btn-text: #ffffff;
    --formique-btn-shadow: 0 2px 10px rgba(37, 99, 235, 0.3);
}

.brown-theme {
    --formique-base-bg: #f5f5f5;
    --formique-base-text: #3e2723;
    --formique-base-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    --formique-base-label: #5d4037;
    --formique-input-border: #d7ccc8;
    --formique-focus-color: #8d6e63;
    --formique-btn-bg: #6d4c41;
    --formique-btn-text: #ffffff;
    --formique-btn-shadow: 0 2px 10px rgba(109, 76, 65, 0.3);
}

.orange-theme {
    --formique-base-bg: #ffffff;
    --formique-base-text: #7b341e;
    --formique-base-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    --formique-base-label: #dd6b20;
    --formique-input-border: #fed7aa;
    --formique-focus-color: #ed8936;
    --formique-btn-bg: #ed8936;
    --formique-btn-text: #ffffff;
    --formique-btn-shadow: 0 2px 10px rgba(237, 137, 54, 0.3);
}
/* ==================== */
/* WIDTH CONTROL CLASSES */
/* ==================== */
.formique {
    padding: 1rem;
}
.formique.width-full {
    --formique-max-width: 100%;
}

.formique.width-half {
    --formique-max-width: 50%;
}

.formique.width-medium {
    --formique-max-width: 600px;
}

.formique.width-small {
    --formique-max-width: 400px;
}

.formique.width-custom {
    /* To be set inline or via JS */
}

/* Spinner Container */
#formiqueSpinner {
    display: none;
    align-items: center;
    gap: 1rem;
    font-family: var(--formique-font-family, 'Montserrat, sans-serif');
    padding: 1rem;
    border-radius: var(--formique-border-radius, 6px);
    background-color: var(--formique-base-bg);
    color: var(--formique-base-text);
    margin-top: 1rem;
}

/* Spinner Circle */
.formique-spinner {
    width: 1.5rem;
    height: 1.5rem;
    border: 3px solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    border-top-color: var(--formique-btn-bg);
    animation: formique-spin 1s ease-in-out infinite;
}

/* Spinner Animation */
@keyframes formique-spin {
    to { transform: rotate(360deg); }
}

/* Message */
#formiqueSpinner .message {
    margin: 0;
    font-size: 0.9rem;
    color: var(--formique-focus-color);
}


.formique-success, .formique-error {
    /* Background with opacity to work with both themes */
    background-color: var(--formique-base-bg); /* Based on --formique-btn-bg */
    
    /* Text styling using theme variables */
    color: var(--formique-focus-color);
    font-family: inherit;
    font-size: 0.95rem;
    
    /* Border using focus color with opacity */
    border: 1px solid var(--formique-focus-color); /* Based on --formique-btn-bg */
    border-radius: 4px;
    padding: 12px 16px;
    margin: 16px 0;
    
    /* Layout */
    display: flex;
    align-items: center;
    gap: 8px;
    
    /* Animation */
    animation: fadeIn 0.3s ease-in-out;
    
    /* Shadow using theme variable */
    box-shadow: var(--formique-base-shadow);
}

.formique-success::before {
    content: "âœ“";
    color: var(--formique-btn-bg); /* Using button background color for checkmark */
    font-weight: bold;
    font-size: 1.2rem;
}

.formique-error::before {
    content: "âœ—";
    color: var(--formique-btn-bg); /* Using button background color for checkmark */
    font-weight: bold;
    font-size: 1.2rem;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
}


/* --- */
/* Specific Styles for Color Input */
.formique .input-block .form-color-input {
    /* Restore native appearance */
    -webkit-appearance: auto;
    -moz-appearance: auto;
    appearance: auto;
    
    /* Reset properties that typically interfere with native color inputs */
    padding: 2px; /* Small padding to allow native swatch to show */
    border: 1px solid var(--formique-input-border); /* Visible border */
    background-color: var(--formique-base-bg); /* Ensure it has a background */
    width: 50px; /* A typical width for the color swatch */
    height: 30px; /* A typical height for the color swatch */
    cursor: pointer; /* Indicates it's interactive */
    
    /* Ensure border-radius and vertical alignment blend with other inputs */
    border-radius: var(--formique-border-radius);
    vertical-align: middle; /* Aligns with text if label is inline */
    
    /* Override any focus border-bottom rules from general .form-input if needed */
    border-bottom: 1px solid var(--formique-input-border); /* Keep consistent border for focus */
}

.formique .input-block .form-color-input:focus {
    outline: none; /* Remove default browser outline */
    border-color: var(--formique-focus-color); /* Apply theme focus color */
    border-bottom-color: var(--formique-focus-color); /* Ensure bottom border matches on focus */
    box-shadow: 0 0 0 2px rgba(var(--formique-focus-color-rgb, 106, 79, 191), 0.1); /* Optional: subtle shadow */
}

`;



export default Formique;