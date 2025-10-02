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
'one',
'manyof',
'many',
'radio',
'select',
'mutli-select',
'multiselect',
'multipleselect',
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
  'checkbox',
  'radio',
  'file',
  'hidden',
  'submit',
  'reset',
  'button',
  'image'
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

  // Get all option values from all OptionsAttributes and remove duplicates
  const allOptions = attributes
    .filter(attr => attr?.type === 'OptionsAttribute')
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
fieldSchema.push('dynamicSingleSelect',fieldName, this.toTitleCase(fieldName)); 

let validations; 
let attributes; 


//console.log("HERE",validations);
 let inputParams;

if (node.attributes.length > 0 ) {
  inputParams = this.handleAttributes(node.attributes);
   //console.log("InputParams",inputParams);   
}  else {
inputParams = { validations: {}, attributes: {} }
}
 

 //console.log("InputParams",inputParams); 

validations = inputParams.validations;
attributes = inputParams.attributes;

if (this.isRequired(rawFieldName)) {
  validations['required'] = true;

 }


//console.log("VALS",validations);
//console.log("ATTRs",attributes);

   fieldSchema.push(validations)
   fieldSchema.push(attributes)

/// NOW BUILD SCENARIO (SELECT STATE) BLOCKS


/// E.G. Countries for which we want display states reactively 
const optionValues = this.extractOptionValues(node.attributes);
//console.log("optionValues",optionValues);

let scenarioBlocks =[];


if (optionValues.length > 0 ) {

  optionValues.forEach(option => {

let schema = {}; 

    schema['id']= option.toLowerCase(); 
    schema['label']= option; 

    /// add options now
const keyOptions = this.getOptionValuesByKey(node.attributes, option);
//console.log(keyOptions);
let options = []; 

if (keyOptions.length > 0) {
  keyOptions.forEach(subOption => {
  options.push({value: subOption.toLowerCase(), label: this.toTitleCase(subOption)})
  })
schema['options']= options; 
scenarioBlocks.push(schema);

}



// now get option options 
  //scenarioBlock.push(schema); 
 fieldSchema.push(scenarioBlocks); 


 // options.push({value: option, label: this.toTitleCase(option)})
  });

 this.formSchema.push(fieldSchema);

   //console.log("THERE",JSON.stringify(fieldSchema,null,2));

}



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
    //console.log(`Processing FormProperty: ${node.key.value} = ${node.value.value}`);
    const key = node.key.value;
    const val = node.value.values[0].value; 

    //console.log(node);

// if this is regular form attribute then it goes to formParams
    if (this.formAttributes.includes(key)) {
      this.formParams[key] = val
    } else {

if (key === 'sendTo') {
const sendToEmails = node.value.values.map(option => option.value);
this.formSettings[key] = sendToEmails
}  else 
 {
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
// ...
// ...

buildField(node) {
 const rawFieldName = node.name;
 const cleanString = this.cleanFieldName(rawFieldName);
 const cleanFieldName = cleanString.input_name;

 let fieldType;

 if (cleanString.input_type) {
  fieldType = this.cleanToInputType(cleanString.input_type);
 } else {
  let attributeKeys;
  if (node.attributes.length > 0) {
   attributeKeys = this.extractAttributeKeys(node.attributes);
   fieldType = this.inputTypeResolver(cleanFieldName, attributeKeys);
  } else {
   fieldType = this.inferInputType(cleanFieldName);
  }
 }

 if (fieldType === 'dynamicSingleSelect') {
  this.buildDynamicSingleSelect(node, rawFieldName);
  return;
 }

 const fieldSchema = [];
 const fieldLabel = this.toTitleCase(cleanFieldName);

 fieldSchema.push(fieldType, cleanFieldName, fieldLabel);

 let validations = {};
 let attributes = {};

 let inputParams;
 if (node.attributes.length > 0) {
  inputParams = this.handleAttributes(node.attributes);
 } else {
  inputParams = { validations: {}, attributes: {} };
 }

 validations = inputParams.validations;
 attributes = inputParams.attributes;

 if (this.isRequired(rawFieldName)) {
  validations['required'] = true;
 }

 fieldSchema.push(validations);
 fieldSchema.push(attributes);

 // Handle options for select, radio, checkbox fields
 if (node.attributes.length > 0 && (fieldType === 'checkbox' || fieldType === 'radio' || fieldType === 'select' || fieldType === 'multipleSelect')) {
  const getDefaultValue = (attributes) => {
     console.log("AST", JSON.stringify(this.ast,null,2))


  if (!Array.isArray(attributes)) {
    console.debug("getDefaultValue: Input is not an array, returning null.");
    return null;
  }

  // Look for FieldAttributes with 'selected' or 'default'
  const selectedAttr = attributes.find(attr =>
    attr?.type === "FieldAttribute" &&
    (attr?.key === "selected" || attr?.key === "default")
  );

  // Look for OptionsAttributes with 'selected' or 'default'
  const selectedOptionsAttr = attributes.find(attr =>
    attr?.type === "OptionsAttribute" &&
    (attr?.key === "selected" || attr?.key === "default")
  );

  console.debug("getDefaultValue: Found FieldAttribute:", selectedAttr);
  console.debug("getDefaultValue: Found OptionsAttribute:", selectedOptionsAttr);

  if (selectedAttr) {
    // ... (existing logic)
    // The previous logic was simplified, here is a more explicit check
    const value = selectedAttr.value?.value?.toLowerCase() || selectedAttr.value?.toLowerCase();
    console.debug(`getDefaultValue: Returning value from FieldAttribute: ${value}`);
    return value;
  }

  if (selectedOptionsAttr && selectedOptionsAttr.values && selectedOptionsAttr.values.length > 0) {
    const value = selectedOptionsAttr.values[0].value.toLowerCase();
    console.debug(`getDefaultValue: Returning value from OptionsAttribute: ${value}`);
    return value;
  }

  console.debug("getDefaultValue: No matching attribute found, returning null.");
  return null;
};
  const defaultValue = getDefaultValue(node.attributes);
  console.log("defaultValue",defaultValue);
  const optionValues = this.extractOptionValues(node.attributes);
  let options = [];

  if (optionValues.length > 0) {
   optionValues.forEach(option => {
    if (option.toLowerCase() === defaultValue) {
     options.push({value: option.toLowerCase(), label: this.toTitleCase(option), selected: true});
    } else {
     options.push({value: option.toLowerCase(), label: this.toTitleCase(option)});
    }
   });
   fieldSchema.push(options);
  }
 }

 this.formSchema.push(fieldSchema);
}


/*
buildCheckboxField(node, rawFieldName) {
  const cleanString = this.cleanFieldName(rawFieldName);
  const fieldName = cleanString.input_name;
  const fieldSchema = ['checkbox', fieldName, this.toTitleCase(fieldName)];
  
  let validations = {};
  let attributes = {};
  
  // Extract options from all OptionsAttributes
  const allOptions = [];
  
  node.attributes.forEach(attr => {
    if (attr.type === 'OptionsAttribute') {
      const optionValues = attr.values.map(option => option.value);
      allOptions.push(...optionValues);
    }
  });
  
  // Build options array
  const options = allOptions.map(option => ({
    value: option.toLowerCase(),
    label: this.toTitleCase(option)
  }));
  
  // Handle validations and attributes
  if (node.attributes.length > 0) {
    const inputParams = this.handleAttributes(node.attributes);
    validations = inputParams.validations;
    attributes = inputParams.attributes;
  }
  
  if (this.isRequired(rawFieldName)) {
    validations['required'] = true;
  }
  
  fieldSchema.push(validations);
  fieldSchema.push(attributes);
  fieldSchema.push(options);
  
  this.formSchema.push(fieldSchema);
}
*/




handleAttributes(attributesAST) {
  let validations = {};
  let attributes = {};

  attributesAST.forEach(attr => {
    if (attr.type === 'FieldAttribute') {
      const key = attr.key;
      let value;

      if (typeof attr.value === 'object') {
        value = attr.value.value;
      } else {
        value = attr.value;
      }

      // Skip ignored keys (including selected/default which are handled separately)
      if (this.ignoreAttributes.includes(key) || key === 'selected' || key === 'default') return;

      // Categorize key as input attribute or validation
      if (this.inputAttributes.includes(key)) {
        attributes[key] = value;
      } else if (this.validationAttributes.includes(key)) {
        validations[key] = value;
      }
    }
  });

  // Handle dependents extraction
  const getDependents = (attributesAST = []) => {
    const dependentsAttr = attributesAST.find(attr => attr.key === "dependents");
    if (!dependentsAttr) return [];
    
    if (dependentsAttr.type === "OptionsAttribute" && dependentsAttr.values) {
      return dependentsAttr.values
        .map(option => option.value)
        .filter(Boolean);
    }
    
    if (dependentsAttr.value !== undefined) {
      if (Array.isArray(dependentsAttr.value)) {
        return dependentsAttr.value.filter(Boolean);
      }
      const values = typeof dependentsAttr.value === 'string' 
        ? dependentsAttr.value.split(',').map(v => v.trim())
        : [dependentsAttr.value];
      return values.filter(Boolean);
    }
    
    return [];
  };

  let dependents = getDependents(attributesAST);
  if (dependents.length > 0) {
    attributes['dependents'] = dependents;
  }

  const getDependsOn = (attributesAST) => {
    if (!Array.isArray(attributesAST)) return null;

    const dependsOnAttr = attributesAST.find(
      attr => attr?.type === "OptionsAttribute" && attr?.key === "dependsOn"
    );

    if (!dependsOnAttr?.values || dependsOnAttr.values.length < 2) {
      return null;
    }

    return {
      dependsOnValue: dependsOnAttr.values[0]?.value || '',
      dependsOnCondition: dependsOnAttr.values[1]?.value || ''
    };
  };

  const dependency = getDependsOn(attributesAST);
  if (dependency) {
    const dependsOnCondition = dependency.dependsOnCondition.toLowerCase(); 
    attributes['dependsOn'] = dependency.dependsOnValue;
    attributes['condition'] = `${dependsOnCondition}`;
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
