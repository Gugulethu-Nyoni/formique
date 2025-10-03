'use strict';

/**
 * FormiqueParser - A comprehensive form definition parser that converts an Abstract Syntax Tree (AST)
 * representation into a structured form schema with validation rules, input types, and conditional logic.
 * 
 * Handles complex form structures including:
 * - Dynamic single-select fields with scenario-based options
 * - Input type inference from field names and attributes
 * - Validation rules extraction and categorization
 * - Conditional field dependencies (dependsOn/dependents)
 * - Multiple input types (text, email, select, radio, checkbox, file, etc.)
 * - Form-level settings and parameters
 * - Option lists for selectable inputs
 * - Required field detection via asterisk notation
 * 
 * The parser processes AST nodes to build a complete form configuration including:
 * - Form schema with field definitions, validations, and attributes
 * - Form settings for behavioral configuration
 * - Form parameters for HTML form attributes
 * - Support for complex field relationships and dynamic content
 * 
 * @class
 * @param {Object} ast - The Abstract Syntax Tree representing the form structure
 * @returns {Object} Configuration object containing formSchema, formSettings, and formParams
 */

export default class  astToFormique{
constructor (ast) {
this.ast = ast;
this.formSchema=[];
this.formSettings={};
this.formParams={};

this.formAttributes = [
  "action",
  "method",
  "enctype",
  "name",
  "target",
  "autocomplete",
  "novalidate",
  "rel",
  "accept-charset",
  "id",
  "class",
  "style",
  "title",
  "lang",
  "dir",
  "hidden",
  "tabindex",
  "accesskey",
  "draggable",
  "contenteditable",
  "spellcheck",
  "onsubmit",
  "onreset",
  "onchange",
  "oninput",
  "onfocus",
  "onblur",
  "onkeydown",
  "onkeyup",
  "onclick",
  "ondblclick",
  "onmouseover",
  "onmouseout",
  "aria-label",
  "aria-labelledby",
  "aria-describedby",
  "role"
];

this.inputAttributes = [
  "id",
  "class",
  "type",
  "value",
  "name",
  "placeholder",
  "autofocus",
  "size",
  "accept",
  "form",
  "list"
];


this.validationAttributes = [
  // Basic validations
  'required',
  'disabled',
  'readonly',
  
  // Text/pattern validations
  'minlength',
  'maxlength',
  'pattern',
  
  // Numeric validations
  'min',
  'max',
  'step',
  
  // Date/time validations
  'min',
  'max',
  
  // File validations
  'accept',
  'multiple',
  'filesize',  // Note: Typically implemented via JavaScript
  
  // Special input types
  'checked',    // For checkboxes/radios
  'selected',   // For options
  'placeholder', // Not validation but affects input
  
  // Custom data attributes (commonly used for validation)
  'data-validate',
  'data-required',
  'data-min',
  'data-max',
  'data-minlength',
  'data-maxlength',
  'data-pattern',
  'data-error',
  'data-validate-on',
  'data-equal-to',
  
  // ARIA validation attributes
  'aria-required',
  'aria-invalid',
  
  // Form-level validation
  'novalidate',
  'formnovalidate'
];


this.ignoreAttributes =[

'oneof',
'oneOf',
'one',
'manyof',
'manyOf',
'many',
'radio',
'select',
'mutli-select',
'multiselect',
'multipleselect',
'multipleSelect',
'multiple-select',
'multiple',
'checkbox',
'selected',
'default'

]; 


this.inputTypeMaps = {
  oneof: 'radio',
  one: 'radio',
  radio: 'radio',
  select: 'singleSelect',
  singleSelect: 'singleSelect', // optional addition
  manyof: 'checkbox',
  many: 'checkbox',
  checkbox: 'checkbox',
  'multi-select': 'multipleSelect',
  multiselect: 'multipleSelect',
  multipleselect: 'multipleSelect',
  'multiple-select': 'multipleSelect',
  multiple: 'multipleSelect',
  selectMany: 'multipleSelect',
  selectOne:'singleSelect',
  manyselect: 'multipleSelect',
  oneselect:'singleSelect',
  selectmany: 'multipleSelect',
  selectone:'singleSelect',

};

this.regularInputTypes = [
  'text',
  'password',
  'email',
  'number',
  'range',
  'date',
  'datetime-local',
  'time',
  'month',
  'week',
  'search',
  'tel',
  'url',
  'color',
  'select',
  'checkbox',
  'radio',
  'file',
  'hidden',
  'submit',
  'reset',
  'button',
  'image'
];

this.specialInputTypes = [
'singleSelect',
'dynamicSingleSelect',
'multipleSelect'
];


 // Exhaustive type inference map
    this.typeInferenceRules = {
      // Email fields
      email: { type: 'email', priority: 10 },
      'e-mail': { type: 'email', priority: 9 },
      mail: { type: 'email', priority: 8 },


      // Name fields (all text type)
  name: { type: 'text', subtype: 'name', priority: 10 },
  'first-name': { type: 'text', subtype: 'given-name', priority: 10 },
  'firstname': { type: 'text', subtype: 'given-name', priority: 9 },
  'given-name': { type: 'text', subtype: 'given-name', priority: 10 },
  'last-name': { type: 'text', subtype: 'family-name', priority: 10 },
  'lastname': { type: 'text', subtype: 'family-name', priority: 9 },
  surname: { type: 'text', subtype: 'family-name', priority: 10 },
  'family-name': { type: 'text', subtype: 'family-name', priority: 10 },
  'full-name': { type: 'text', subtype: 'full-name', priority: 10 },
  'middle-name': { type: 'text', subtype: 'additional-name', priority: 9 },
  'middle-initial': { type: 'text', subtype: 'additional-name', priority: 8 },
  nickname: { type: 'text', subtype: 'nickname', priority: 9 },
  username: { type: 'text', subtype: 'username', priority: 9 },
  displayname: { type: 'text', subtype: 'display-name', priority: 8 },


   // General text fields
  title: { type: 'text', subtype: 'title', priority: 9 },
  subject: { type: 'text', subtype: 'subject', priority: 8 },
  description: { type: 'text', subtype: 'description', priority: 9 },
  note: { type: 'text', subtype: 'note', priority: 8 },
  bio: { type: 'text', subtype: 'bio', priority: 8 },
  address: { type: 'text', subtype: 'address', priority: 9 },
  city: { type: 'text', subtype: 'city', priority: 9 },
  state: { type: 'text', subtype: 'state', priority: 9 },
  province: { type: 'text', subtype: 'province', priority: 9 },
  country: { type: 'text', subtype: 'country', priority: 9 },
  zipcode: { type: 'text', subtype: 'postal-code', priority: 9 },
  'postal-code': { type: 'text', subtype: 'postal-code', priority: 9 },
  company: { type: 'text', subtype: 'organization', priority: 9 },
  organization: { type: 'text', subtype: 'organization', priority: 9 },
  job: { type: 'text', subtype: 'job-title', priority: 8 },
  'job-title': { type: 'text', subtype: 'job-title', priority: 9 },
  occupation: { type: 'text', subtype: 'job-title', priority: 8 },
  message: { type: 'textarea', subtype: 'message', priority: 9 },
  comment: { type: 'textarea', subtype: 'comment', priority: 8 },


      
      // Telephone fields
      tel: { type: 'tel', priority: 10 },
      phone: { type: 'tel', priority: 10 },
      mobile: { type: 'tel', priority: 10 },
      telephone: { type: 'tel', priority: 10 },
      cell: { type: 'tel', priority: 9 },
      'cell-phone': { type: 'tel', priority: 9 },
      
      // Numeric fields
      // Numeric fields - Add these to your existing object
  count: { type: 'number', priority: 9 },
  price: { type: 'number', priority: 9 },
  total: { type: 'number', priority: 8 },
  amount: { type: 'number', priority: 9 },
  quantity: { type: 'number', priority: 9 },
  qty: { type: 'number', priority: 8 },
  age: { type: 'number', priority: 8 },
  sum: { type: 'number', priority: 7 },
  value: { type: 'number', priority: 7 },
  percent: { type: 'number', priority: 8 },
  percentage: { type: 'number', priority: 8 },
  discount: { type: 'number', priority: 7 },

  // Currency fields (also numeric but might need special handling)
  cost: { type: 'number', priority: 9 },
  payment: { type: 'number', priority: 8 },
  salary: { type: 'number', priority: 8 },
  fee: { type: 'number', priority: 8 },
      
      // Date fields
      date: { type: 'date', priority: 10 },
      dob: { type: 'date', priority: 9 },
      'birth-date': { type: 'date', priority: 8 },
      'start-date': { type: 'date', priority: 7 },
      'end-date': { type: 'date', priority: 7 },
      
      // Password fields
      password: { type: 'password', priority: 10 },
      pwd: { type: 'password', priority: 8 },
      secret: { type: 'password', priority: 6 },
      
      // URL fields
      url: { type: 'url', priority: 10 },
      website: { type: 'url', priority: 8 },
      link: { type: 'url', priority: 7 },
      
      // Special cases
      color: { type: 'color', priority: 10 },
      search: { type: 'search', priority: 10 },
      range: { type: 'range', priority: 10 },

      // File uploads
  file: { type: 'file', priority: 10 },
  upload: { type: 'file', priority: 9 },
  document: { type: 'file', priority: 8 },
  attachment: { type: 'file', priority: 8 },
  resume: { type: 'file', priority: 7 },
  cv: { type: 'file', priority: 7 },
  portfolio: { type: 'file', priority: 7 },
  
  // Image-specific
  image: { type: 'file', accept: 'image/*', priority: 10 },
  photo: { type: 'file', accept: 'image/*', priority: 9 },
  avatar: { type: 'file', accept: 'image/*', priority: 9 },
  picture: { type: 'file', accept: 'image/*', priority: 8 },
  logo: { type: 'file', accept: 'image/*', priority: 8 },
  banner: { type: 'file', accept: 'image/*', priority: 7 },
  thumbnail: { type: 'file', accept: 'image/*', priority: 7 },
  
  // Media files
  video: { type: 'file', accept: 'video/*', priority: 9 },
  audio: { type: 'file', accept: 'audio/*', priority: 9 },
  recording: { type: 'file', accept: 'audio/*', priority: 7 },
  
  // Specific file types
  pdf: { type: 'file', accept: '.pdf', priority: 8 },
  spreadsheet: { type: 'file', accept: '.csv,.xls,.xlsx', priority: 7 },
  excel: { type: 'file', accept: '.xls,.xlsx', priority: 8 },
  word: { type: 'file', accept: '.doc,.docx', priority: 8 },
  presentation: { type: 'file', accept: '.ppt,.pptx', priority: 7 },
  
  // Multiple files
  files: { type: 'file', multiple: true, priority: 8 },
  images: { type: 'file', accept: 'image/*', multiple: true, priority: 8 },
  gallery: { type: 'file', accept: 'image/*', multiple: true, priority: 7 },


gender: { type: 'radio', priority: 10 },
  sex: { type: 'radio', priority: 9 },
  title: { type: 'select', priority: 8 },
  pronoun: { type: 'select', priority: 8 },
  salutation: { type: 'select', priority: 7 },

  // Boolean (Yes/No)
  newsletter: { type: 'radio', priority: 7 },
  agree: { type: 'radio', priority: 6 },
  smoker: { type: 'radio', priority: 5 },
  terms: { type: 'radio', priority: 6 },

  // Categories
  maritalstatus: { type: 'select', priority: 7 },
  employment: { type: 'select', priority: 7 },
  education: { type: 'select', priority: 6 },
  status: { type: 'select', priority: 5 },

  // Location
  country: { type: 'select', priority: 9 },
  language: { type: 'select', priority: 6 },
  region: { type: 'select', priority: 5 },
  state: { type: 'select', priority: 5 },

  // Surveys/Ratings
  rating: { type: 'radio', priority: 5 },
  satisfaction: { type: 'radio', priority: 5 },
  feedback: { type: 'radio', priority: 4 },


  reset: { type: 'reset', priority: 10 },


    };
    
    // Default fallback
    this.defaultType = 'text';

    this.traverse();
    this.addSubmit();



    return {
    formSchema: this.formSchema,
    formSettings: this.formSettings,
    formParams: this.formParams
  };

  }

  
// formDirective , formProperties, formProperty, formFields, 
// optionsAttribute, fieldsAttribute 


inferInputType(fieldName) {
    if (!fieldName) return this.defaultType;
   
    const lowerName = fieldName.toLowerCase().trim();
    const matches = [];
    
    // Check for exact matches first
    if (this.typeInferenceRules[lowerName]) {
      return this.typeInferenceRules[lowerName].type;
    }
    
    // Check for partial matches (e.g., "userEmail" contains "email")
    for (const [key, rule] of Object.entries(this.typeInferenceRules)) {
      if (lowerName.includes(key)) {
        matches.push({ ...rule, key });
      }
    }
    
    // If multiple matches, use the one with highest priority
    if (matches.length > 0) {
      matches.sort((a, b) => b.priority - a.priority);
      return matches[0].type;
    }
    
    // Check for common patterns
    if (/.*password.*/i.test(fieldName)) return 'password';
    if (/.*(mail|email).*/i.test(fieldName)) return 'email';
    if (/.*(tel|phone|mobile).*/i.test(fieldName)) return 'tel';
    if (/.*(date|dob|birth).*/i.test(fieldName)) return 'date';
    
    return this.defaultType;
  }



cleanFieldName(str) {
  const [rawName = '', rawType = ''] = str.split(':');

  const input_name = rawName
    .trim()
    .replace(/[^\w-]/g, ''); // keeps letters, digits, underscores, hyphens

  const input_type = rawType.trim(); // untouched for now

  return { input_name, input_type };
}


cleanToInputType(str) {
    //console.log("STR", str);

  if (this.specialInputTypes.includes(str)) {
    //console.log("STR", str);
  return str;
  }

const cleaned = str.trim().toLowerCase();


  if (cleaned.includes('datetime-local')) {
    // Keep only letters and hyphen
    return cleaned.replace(/[^a-z-]/g, '');
  }

  // Otherwise, keep only letters
  return cleaned.replace(/[^a-z]/g, '');
}



toTitleCase(str) {
  return str
    .toLowerCase()
    .split(/[\s_-]+/) // split by space, dash, or underscore
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

isRequired(str) {
  return str.replace(/\s+/g, '').includes('*');
}


traverse() {
 const nodeHandlers = {
  FormDirective: this.buildDirective.bind(this),
  FormProperties: this.buildProperties.bind(this),
    //  FIX: Add the handler for individual form properties
    FormProperty: this.buildProperty.bind(this),
  FormFields: this.buildFields.bind(this),
  FormField: this.buildField.bind(this),
  OptionsAttribute: this.buildOptionsAttribute.bind(this)
 };

 const traverseNode = (node) => {
  if (!node || typeof node !== 'object') return;

  const handler = nodeHandlers[node.type];
  if (handler) {
   handler(node);
  }

  // Handle nested structures specific to this AST format
  if (node.properties && node.properties.properties && Array.isArray(node.properties.properties)) {
   // This ensures individual FormProperty nodes (like theme: dark) are visited.
   node.properties.properties.forEach(traverseNode);
  }
  if (node.fields && Array.isArray(node.fields)) {
   node.fields.forEach(traverseNode);
  }
  if (node.attributes && Array.isArray(node.attributes)) {
   node.attributes.forEach(traverseNode);
  }
  if (node.values && Array.isArray(node.values)) {
   node.values.forEach(traverseNode);
  }
 };

 // Handle the array-based AST structure
 if (Array.isArray(this.ast)) {
  this.ast.forEach(traverseNode);
 }
}


extractAttributeKeys(nodes) {

  if (!Array.isArray(nodes)) {
    throw new Error('Input must be an array of nodes');
  }

  return nodes
    // Step 1: Filter only FieldAttribute nodes
    .filter(node => node?.type === 'FieldAttribute')
    
    // Step 2: Extract keys safely
    .map(node => node?.key)
    
    // Step 3: Remove any undefined/null keys
    .filter(Boolean)
    
    // Step 4: Remove potential duplicates (optional)
    .filter((key, index, self) => self.indexOf(key) === index);
}


extractOptionValues(attributes) {
  if (!Array.isArray(attributes)) {
    throw new Error('Input must be an array of attributes');
  }

  // Get all option values from only the 'options' OptionsAttribute and remove duplicates
  const allOptions = attributes
    // 💡 FIX: Filter strictly for nodes of type 'OptionsAttribute' AND key 'options'
    .filter(attr => attr?.type === 'OptionsAttribute' && attr.key === 'options')
    .flatMap(attr => attr.values || [])
    .map(option => option?.value)
    .filter(Boolean);

  // Remove duplicates by using a Set
  return [...new Set(allOptions)];
}


extractDependentValues(attributes) {
  if (!Array.isArray(attributes)) {
    throw new Error('Input must be an array of attributes');
  }

  return attributes
    // Find the OptionsAttribute node
    .filter(attr => attr?.type === 'OptionsAttribute' && attr?.key === 'dependents')
    // Get the values array
    .flatMap(attr => attr.values || [])
    // Extract each option's value
    .map(option => option?.value)
    // Remove any undefined/null values
    .filter(Boolean);
}


inputTypeResolver(fieldName, attributeKeys) {

// first option - handle dynamicSingleSelect
  //console.log("CHK",fieldName); 
if (fieldName.includes('-')) {
    return "dynamicSingleSelect"; // 
  }



// second option - explicit field name directive 
  if (fieldName.includes(':')) {
    const chunks = fieldName.split(':');
    //console.log("LAPHA",chunks[1]);
    return chunks[1]; // e.g., 'date' from 'dob:date'
  }

// Third option - low code type definition  
const matchedKey = attributeKeys.find(key => key in this.inputTypeMaps);
if (matchedKey) {
  //console.log("HERE",matchedKey);
 // console.log("HERE 2",this.inputTypeMaps[matchedKey]);

  return this.inputTypeMaps[matchedKey];
}

// Fourth 3: inference with text fall back 
  return this.inferInputType(fieldName);

  
}


getOptionValuesByKey(attributes, targetKey) {
  if (!Array.isArray(attributes)) throw new Error('Input must be an array of attributes');
  if (!targetKey) throw new Error('Target key is required');

  const optionsAttribute = attributes.find(
    attr => attr?.type === 'OptionsAttribute' && attr?.key === targetKey
  );

  return optionsAttribute?.values
    ? optionsAttribute.values
        .map(option => option?.value)
        .filter(Boolean)
        .map(value => value.toLowerCase()) // Normalize to lowercase
    : [];
}



buildDynamicSingleSelect(node, rawFieldName) {

    const cleanString = this.cleanFieldName(rawFieldName);
    const fieldName = cleanString.input_name;

    let fieldSchema = [];
    fieldSchema.push('dynamicSingleSelect', fieldName, this.toTitleCase(fieldName));

    let validations;
    let attributes;
    let mainSelectOptions = []; // Index 5

    let inputParams;

    if (node.attributes.length > 0) {
        inputParams = this.handleAttributes(node.attributes);
    } else {
        inputParams = { validations: {}, attributes: {} }
    }


    validations = inputParams.validations;
    attributes = inputParams.attributes;

    if (this.isRequired(rawFieldName)) {
        validations['required'] = true;
    }

    // 1. CRITICAL FIX: Extract 'options' (main dropdown values) from attributes and store separately (Index 5).
    if (attributes.options) {
        mainSelectOptions = attributes.options;
        delete attributes.options;
    }

    // Since the AST is now clean, we assume the only remaining attributes are standard HTML attributes (or empty {}).
    // The previous workaround for fragmented 'South' and 'Africa' keys is now removed.

    // Push Schema Elements (Index 3 and 4)
    fieldSchema.push(validations); // Index 3
    fieldSchema.push(attributes); // Index 4 (Should be {} if no HTML attributes were defined)


    /// NOW BUILD SCENARIO (SUB-OPTIONS) BLOCKS (Index 6)

    // optionValues retrieves all unique keys that are NOT 'options'
    const optionValues = this.extractOptionValues(node.attributes);
    let scenarioBlocks = [];


    if (optionValues.length > 0) {
        optionValues.forEach(option => {

            let schema = {};
            const lowerCaseOption = option.toLowerCase();

            // Set the ID/label for the scenario block
            schema['id'] = option; //lowerCaseOption;
            schema['label'] = option;

            // Use the option string directly as the attribute key for lookup (e.g., 'South Africa' -> 'South Africa')
            const attributeKey = option; 
            
            /// Add sub-options now
            const keyOptions = this.getOptionValuesByKey(node.attributes, attributeKey);
            let options = [];

            if (keyOptions.length > 0) {
                keyOptions.forEach(subOption => {
                    options.push({ value: subOption.toLowerCase(), label: this.toTitleCase(subOption) })
                });
                schema['options'] = options;
                scenarioBlocks.push(schema);
            }
        });
    }


    // 3. PUSH MAIN OPTIONS: Add the main select options list (Index 5)
    fieldSchema.push(mainSelectOptions);

    // 4. PUSH SCENARIO BLOCKS: Add the list of scenario blocks (Index 6)
    fieldSchema.push(scenarioBlocks);


    // 5. Final push to the form schema
    this.formSchema.push(fieldSchema);
}





  // Builder methods - implement these according to your needs
  buildDirective(node) {
    //console.log(`Processing FormDirective: ${node.name.value}`);
   
   	this.formParams['id'] = node.name.value;
    // Handle directive specific logic
  }

  buildProperties(node) {
   // console.log(`Processing FormProperties with ${node.properties.length} properties`);
  }

  buildProperty(node) {
  //console.log(`Processing FormProperty: ${node.key.value}`);
  const key = node.key.value;
  let val;

  // 💡 FIX: Correctly extract the value based on the AST structure.
  // Simple values (StringLiteral, BooleanLiteral, NumberLiteral, Identifier)
  if (node.value && node.value.type) {
   val = node.value.value;
  } else if (node.value !== undefined) {
   // Fallback for raw, unparsed values or flags
   val = node.value;
  } else {
   // Treat properties with no explicit value as 'true' (if supported by grammar)
   val = true;
  }

  //console.log(node);

// if this is regular form attribute then it goes to formParams
  if (this.formAttributes.includes(key)) {
   this.formParams[key] = val
  } else {

// Handle special case for 'sendTo' which might use a structure like OptionList
if (key === 'sendTo') {
    // Assuming 'sendTo' value is parsed as an OptionList (Array of Options)
    if (node.value && Array.isArray(node.value.values)) {
        const sendToEmails = node.value.values.map(option => option.value);
        this.formSettings[key] = sendToEmails;
    } else {
        // Fallback for single email string
        this.formSettings[key] = val;
    }
} else
{
    // All other custom form settings
    this.formSettings[key] = val
}

}
 
  //console.log(this.formSettings);
  //console.log(this.formParams);
 }



  buildFields(node) {
    //console.log(`Processing FormFields with ${node.fields} fields`);




  }

  

 /* eslint-disable no-unused-vars */
/* eslint-disable no-useless-escape */
// The rest of the class definition from Part 1 goes here...


buildField(node) {
  const rawFieldName = node.name;
  const cleanString = this.cleanFieldName(rawFieldName);
  const cleanFieldName = cleanString.input_name;

  let fieldType;

  // 1. Determine the Field Type
  if (cleanString.input_type) {
    fieldType = this.cleanToInputType(cleanString.input_type);
  } else {
    let attributeKeys;
    if (node.attributes.length > 0) {
      attributeKeys = this.extractAttributeKeys(node.attributes);
      
      // Check for 'manyof' attribute to force 'checkbox' type
      if (attributeKeys.includes('manyof')) {
        fieldType = 'checkbox';
      } else {
        fieldType = this.inputTypeResolver(cleanFieldName, attributeKeys);
      }
    } else {
      fieldType = this.inferInputType(cleanFieldName);
    }
  }

  // Handle Dynamic Selects (assuming external function)
  if (fieldType === 'dynamicSingleSelect') {
    this.buildDynamicSingleSelect(node, rawFieldName);
    return;
  }

  // Initialize Schema Structure
  const fieldSchema = [];
  const fieldLabel = this.toTitleCase(cleanFieldName);

  // Push Base Definition: [type, name, label]
  fieldSchema.push(fieldType, cleanFieldName, fieldLabel);

  let validations = {};
  let attributes = {};

  // 2. Process Attributes and Validations
  let inputParams;
  if (node.attributes.length > 0) {
    // Pass rawFieldName to handleAttributes for specific logic (like 'accept')
    inputParams = this.handleAttributes(node.attributes, rawFieldName);
  } else {
    inputParams = { validations: {}, attributes: {} };
  }

  validations = inputParams.validations;
  attributes = inputParams.attributes;

  // 3. Clean up Attributes and Add Required Validation
  // CRITICAL: We only delete the attributes that are used to build the final list
  // but should NOT appear in the attributes object. Dependents/dependsOn SHOULD remain.
  delete attributes.options;
  delete attributes.selected;
  delete attributes.default; 
  // delete attributes.dependents; // REMOVED: This attribute needs to be in the final object
  // delete attributes.dependsOn; // REMOVED: This attribute needs to be in the final object
  // delete attributes.condition; // REMOVED: This attribute needs to be in the final object
  delete attributes.manyof; // If 'manyof' is not needed in the final attributes, delete it.

  if (this.isRequired(rawFieldName)) {
    validations['required'] = true;
  }

  // Push Validation and Attributes: [..., validations, attributes]
  fieldSchema.push(validations);
  fieldSchema.push(attributes);

  // 4. Handle Option-Based Fields (The list of choices)
  if (node.attributes.length > 0 && (fieldType === 'checkbox' || fieldType === 'radio' || fieldType === 'select' || fieldType === 'multipleSelect' || fieldType === 'singleSelect')) {

    // Helper function to correctly retrieve single string OR array of selected values.
    const getSelectedValues = (attributes) => {
      const isMultiSelect = (fieldType === 'checkbox' || fieldType === 'multipleSelect');
      
      // 1. Look for OptionsAttributes (list: selected: a, b)
      const selectedOptionsAttr = node.attributes.find(attr =>
        attr?.type === "OptionsAttribute" && (attr?.key === "selected" || attr?.key === "default")
      );

      if (selectedOptionsAttr && selectedOptionsAttr.values && selectedOptionsAttr.values.length > 0) {
        const values = selectedOptionsAttr.values.map(v => v.value.toLowerCase());
        return isMultiSelect ? values : values[0]; // array or first item
      }

      // 2. Look for FieldAttributes (single: selected: a)
      const selectedAttr = node.attributes.find(attr =>
        attr?.type === "FieldAttribute" && (attr?.key === "selected" || attr?.key === "default")
      );

      if (selectedAttr) {
        // Use a safe value retrieval/lower-casing
        const rawValue = selectedAttr.value?.value || selectedAttr.value;
        const value = (typeof rawValue === 'string' ? rawValue.toLowerCase() : rawValue);
        
        return isMultiSelect ? [value].filter(Boolean) : value; // array or string
      }

      return isMultiSelect ? [] : null;
    };

    const isMultiSelection = (fieldType === 'checkbox' || fieldType === 'multipleSelect');
    const selectedValues = getSelectedValues(node.attributes); 
    const optionValues = this.extractOptionValues(node.attributes); 
    let options = [];

    if (optionValues.length > 0) {
      optionValues.forEach(option => {
        //const optValue = option.toLowerCase();
        const optValue = option;
        let isSelected = false;

        if (isMultiSelection) {
          // Check if value is IN the array of selected values
          isSelected = Array.isArray(selectedValues) && selectedValues.includes(optValue);
        } else {
          // Check if value EQUALS the single selected string
          isSelected = (optValue === selectedValues);
        }

        if (isSelected) {
          options.push({value: optValue, label: this.toTitleCase(option), selected: true});
        } else {
          options.push({value: optValue, label: this.toTitleCase(option)});
        }
      });
      
      // Push Options Array: [..., validations, attributes, options_array]
      fieldSchema.push(options); 
    }
  }

  // 5. Finalize Schema
  this.formSchema.push(fieldSchema);
}



handleAttributes(attributesAST, fieldName) {
    let validations = {};
    let attributes = {};

    // Helper to extract the final value from a nested AST node (unchanged)
    const extractValue = (attrValue) => {
        let value;
        if (attrValue && typeof attrValue === 'object') {
            if (attrValue.value !== undefined) {
                value = attrValue.value;
            } else {
                value = attrValue;
            }
        } else {
            value = attrValue;
        }
        if (typeof value === 'string') {
            value = value.trim();
            if (value.length >= 2 && value.startsWith("'") && value.endsWith("'")) {
                value = value.slice(1, -1);
            }
        }
        return value;
    };
    
// ----------------------------------------------------------------------
// 1. Initial Pass: Process all attributes (including single-value dependents/dependsOn)
// ----------------------------------------------------------------------
    attributesAST.forEach(attr => {
        const key = attr.key;

        if (attr.type === 'FieldAttribute') {
            let value = extractValue(attr.value);

            // Only skip list-building keys ('selected', 'default', 'options'). 
            if (this.ignoreAttributes && this.ignoreAttributes.includes(key)) return;
            if (['selected', 'default', 'options'].includes(key)) return; 
            
            // Categorize key
            if (this.inputAttributes && this.inputAttributes.includes(key)) {
                attributes[key] = value;
            } else if (this.validationAttributes && this.validationAttributes.includes(key)) {
                validations[key] = value;
            } else {
                // For 'dependents', 'dependsOn', 'manyof', and any unrecognized attributes
                
                // 💡 CRITICAL FIX: Ensure 'dependents' value is always an array
                if (key === 'dependents') {
                    // This handles AST parsing a single value as a FieldAttribute.
                    attributes[key] = Array.isArray(value) ? value : [value];
                } else {
                    attributes[key] = value;
                }
            }
        } 
// ----------------------------------------------------------------------
// 2. Process OptionsAttribute (List) Nodes for 'dependents', 'accept', and 'dependsOn'
// ----------------------------------------------------------------------
        else if (attr.type === 'OptionsAttribute') {
            
            // ⭐ NEW/FIXED HANDLING: Process 'dependents' (List of field names)
            if (key === 'dependents') {
                const dependentFields = attr.values
                    .map(option => extractValue(option))
                    .filter(Boolean);
                    
                if (dependentFields.length > 0) {
                    attributes[key] = dependentFields;
                }
            }

            // SPECIAL HANDLING: Process 'accept' for file inputs
            if (key === 'accept' && fieldName.includes(':file')) {
                const acceptValues = attr.values
                    .map(option => extractValue(option))
                    .filter(Boolean);
                    
                if (acceptValues.length > 0) {
                    attributes[key] = acceptValues.join(',');
                }
            }
            
            // SPECIAL HANDLING: Process 'dependsOn' (Conditional Logic) if it's a list
            if (key === 'dependsOn' && attr.values && attr.values.length >= 2) {
                const dependsOnValue = extractValue(attr.values[0]);
                const dependsOnCondition = extractValue(attr.values[1]);
                
                if (dependsOnValue && dependsOnCondition) {
                    attributes['dependsOn'] = dependsOnValue;
                    attributes['condition'] = dependsOnCondition.toLowerCase();
                }
            }
        }
    });


// ----------------------------------------------------------------------
// 3. Handle 'options' Extraction (List of choices) - UNCHANGED
// ----------------------------------------------------------------------
    const optionsAttr = attributesAST.find(attr => attr.type === "OptionsAttribute" && attr.key === "options");
    if (optionsAttr?.values) {
        const options = optionsAttr.values.map(option => ({
            value: extractValue(option),
            label: extractValue(option) // Simple case: value is also the label
        }));
        if (options.length > 0) {
            attributes['options'] = options;
        }
    }

// ----------------------------------------------------------------------
// 4. Handle 'selected' (Single or Multi-Select) - UNCHANGED
// ----------------------------------------------------------------------
    const selectedListAttr = attributesAST.find(attr => attr.type === "OptionsAttribute" && attr.key === "selected");
    if (selectedListAttr && selectedListAttr.values) {
        const selectedValues = selectedListAttr.values
            .map(option => extractValue(option))
            .filter(Boolean);
        if (selectedValues.length > 0) {
            attributes['selected'] = selectedValues;
        }
    } else {
        const selectedSingleAttr = attributesAST.find(attr => attr.type === "FieldAttribute" && attr.key === "selected");
        if (selectedSingleAttr) {
            attributes['selected'] = extractValue(selectedSingleAttr.value);
        }
    }

// ----------------------------------------------------------------------
// 5. Handle 'default' (Single Value) - UNCHANGED
// ----------------------------------------------------------------------
    const defaultAttr = attributesAST.find(attr => attr.type === "FieldAttribute" && attr.key === "default");
    if (defaultAttr) {
        attributes['default'] = extractValue(defaultAttr.value);
    }

    return {
        validations,
        attributes
    };
}


  buildOptionsAttribute(node) {
    //console.log(`Processing OptionsAttribute with ${node.values.length} values`);
  }

  buildFieldAttribute(node) {
    //console.log(`Processing FieldAttribute: ${node.key} = ${node.value}`);
  }

  buildOption(node) {
    //console.log(`Processing Option: ${node.value} (quoted: ${node.quoted})`);
  }

  buildIdentifier(node) {
   // console.log(`Processing Identifier: ${node.value}`);
  }

  buildStringLiteral(node) {
   // console.log(`Processing StringLiteral: "${node.value}"`);
  }



addSubmit () {

this.formSchema.push(['submit','submit','Submit']); 


}

  // class wrapper - nothing below this point

}
