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




// Helper to handle the "Country-State" -> "Country" transformation
formatLabel(str) {
  if (!str) return "";
  // Capitalize first letter only
  return str.charAt(0).toUpperCase() + str.slice(1);
}

  // NEW: Optimized Mapping Loop
  mapFields() {
    const fieldNode = this.ast.find(node => node.type === 'FormFields');
    if (!fieldNode) return [];

    fieldNode.fields.forEach(field => {
      //  Branching Logic: Check for the new fieldType property
      if (field.fieldType === "dynamicSingleSelect") {
        this.buildDynamicSingleSelect(field);
      } else {
        this.buildStandardField(field);
      }
    });

    return this.formSchema;
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
  // Get everything before colon (removes :type)
  let rawName = str.split(':')[0];
  
  // Remove * and ! markers
  let input_name = rawName.replace(/[*!]/g, '');
  
  // Get type after colon (if exists)
  let input_type = str.includes(':') ? str.split(':')[1] : '';
  
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
  const attrs = node.attributes || [];
  
  // 1. Setup Basic Identity
  const { input_name } = this.cleanFieldName(rawFieldName);
  const cleanName = input_name.toLowerCase().replace(/\s+/g, '-');
  const cleanLabel = this.formatLabel(input_name);

  // 2. Identify Primary Options
  const optionsAttr = attrs.find(a => a.key === 'options');
  const primaryValues = optionsAttr 
    ? (Array.isArray(optionsAttr.values) 
        ? optionsAttr.values.map(v => v.value) 
        : optionsAttr.value.value.split(',').map(v => v.trim()))
    : [];

  const mainOptions = primaryValues.map(val => ({
    value: val.toLowerCase().replace(/\s+/g, '-'),
    label: this.formatLabel(val)
  }));

  // 3. Identify Secondary Scenarios (Attributes whose keys are in primaryValues)
  const scenarioBlocks = attrs
    .filter(a => a.key !== 'options' && primaryValues.includes(a.key))
    .map(attr => {
      const rawVals = Array.isArray(attr.values) 
        ? attr.values.map(v => v.value) 
        : attr.value.value.split(',').map(v => v.trim());
        
      return {
        id: attr.key.toLowerCase().replace(/\s+/g, '-'),
        label: attr.key,
        options: rawVals.map(opt => ({
          value: opt.toLowerCase().replace(/\s+/g, '-'),
          label: this.formatLabel(opt)
        }))
      };
    });

  // 4. Determine Labels (Handle "Country-State" split if present)
  let primaryLabel = cleanLabel;
  let secondaryLabel = "Options";
  if (rawFieldName.includes('-')) {
    const parts = rawFieldName.split('-');
    primaryLabel = this.formatLabel(parts[0].replace(/[*!]/g, ''));
    secondaryLabel = this.formatLabel(parts[1].split(':')[0].replace(/[*!]/g, ''));
  }
  const combinedLabel = `${primaryLabel}-${secondaryLabel}`;

  // 5. Validations & Attributes (Excluding the ones used for scenarios)
  const { validations, attributes } = this.handleAttributes(
    attrs.filter(a => a.key === 'options' || !primaryValues.includes(a.key)), 
    rawFieldName
  );

  if (this.isRequired(rawFieldName)) {
    validations['required'] = true;
  }

  // 6. Build Final Formique Schema
  const dynamicSchema = [
    "dynamicSingleSelect", 
    cleanName, 
    combinedLabel, 
    validations, 
    attributes, 
    mainOptions, 
    scenarioBlocks 
  ];

  this.formSchema.push(dynamicSchema);
  console.log(`Built dynamicSingleSelect: ${cleanName}`);
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
    let result;

    // 1. Handle Array/OptionList (Preferred path)
    if (node.value && Array.isArray(node.value.values)) {
        // Map the array of option objects to an array of email strings
        result = node.value.values.map(option => option.value);
    } else {
        // 2. Handle Fallback (Single string or null)
        // Ensure 'val' is treated as a single-element array if it exists.
        if (val) {
            // SUEGICAL FIX: Wrap the single email string in an array.
            result = [val]; 
        } else {
            result = []; // Use an empty array if no value is present
        }
    }
    
    // 3. Assign the final array result
    this.formSettings[key] = result;
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
  
  // 1. High-Priority check for Dynamic Select
  if (node.fieldType === 'dynamicSingleSelect') {
    this.buildDynamicSingleSelect(node, rawFieldName);
    return;
  }

  // 2. Resolve Names and Types
  const cleanString = this.cleanFieldName(rawFieldName);
  const cleanFieldName = cleanString.input_name;
  const fieldLabel = this.formatLabel(cleanFieldName);

  let fieldType;
  if (cleanString.input_type) {
    fieldType = this.cleanToInputType(cleanString.input_type);
  } else {
    const attributeKeys = node.attributes?.length > 0 ? this.extractAttributeKeys(node.attributes) : [];
    if (attributeKeys.includes('manyof')) {
      fieldType = 'checkbox';
    } else {
      fieldType = this.inputTypeResolver(cleanFieldName, attributeKeys);
    }
  }

  // 3. Process Attributes & Validations
  let validations = {};
  let attributes = {};

  if (node.attributes && node.attributes.length > 0) {
    const params = this.handleAttributes(node.attributes, rawFieldName);
    validations = params.validations;
    attributes = params.attributes;
  }

  // 4. Add required validation from asterisk marker
  if (this.isRequired(rawFieldName)) {
    validations['required'] = true;
  }

  // 5. SPECIAL: Add 'multiple' attribute for multipleSelect
  if (fieldType === 'multipleSelect') {
    attributes['multiple'] = true;
  }

  // 6. Build base schema: [type, name, label, validations, attributes]
  const fieldSchema = [fieldType, cleanFieldName, fieldLabel, validations, attributes];

  // 7. Handle Options for Radio/Checkbox/Select fields
  const isOptionField = ['checkbox', 'radio', 'select', 'singleSelect', 'multipleSelect'].includes(fieldType);
  if (isOptionField) {
    let options = [];
    
    // Get options from attributes (already processed) or extract from AST
    if (attributes.options && Array.isArray(attributes.options)) {
      options = attributes.options;
    } else {
      const optionValues = this.extractOptionValues(node.attributes || []);
      options = optionValues.map(opt => ({
        value: opt.toLowerCase().replace(/\s+/g, '-'),
        label: this.formatLabel(opt)
      }));
    }
    
    if (options.length > 0) {
      fieldSchema.push(options);
    }
    
    // Remove options from attributes to avoid duplication
    delete attributes.options;
  }

  // 8. Push to schema
  this.formSchema.push(fieldSchema);
  console.log(`Built field: ${cleanFieldName} (${fieldType})`);
}



handleAttributes(attributesAST, fieldName) {
    let validations = {};
    let attributes = {};

    /**
     * @helper extractValue
     * Safely extracts the raw value from various node types in the AST.
     */
    const extractValue = (attrValue) => {
        if (!attrValue) return "";
        
        // 1. If it's a standard Node (StringLiteral, BooleanLiteral, NumberLiteral)
        if (typeof attrValue === 'object' && attrValue.value !== undefined) {
            return attrValue.value;
        }
        
        // 2. If it's an OptionsAttribute node containing a values array
        if (attrValue.type === 'OptionsAttribute' && Array.isArray(attrValue.values)) {
            return attrValue.values.map(v => (typeof v === 'object' ? v.value : v)).join(', ');
        }

        // 3. Fallback for raw strings or already extracted values
        return attrValue;
    };

    // --- STEP 1: Identify and Extract Options ---
    // We look for any attribute with the key 'options'
    let allOptions = [];
    const optionsAttrs = attributesAST.filter(attr => attr.key === 'options');
    
    for (const attr of optionsAttrs) {
        // Get the value regardless of whether it's a simple attribute or a list
        let rawValue = extractValue(attr.type === 'OptionsAttribute' ? attr : attr.value);

        if (rawValue && typeof rawValue === 'string') {
            const parts = rawValue.split(',').map(p => p.trim()).filter(p => p);
            allOptions.push(...parts);
        } else if (Array.isArray(rawValue)) {
            allOptions.push(...rawValue);
        }
    }
    
    if (allOptions.length > 0) {
        // Map to Formique option format: { value, label }
        attributes['options'] = [...new Set(allOptions)].map(opt => ({
            value: opt.toLowerCase().replace(/\s+/g, '-'),
            label: this.formatLabel(opt)
        }));
    }
    
    // --- STEP 2: Process All Other Attributes ---
    attributesAST.forEach(attr => {
        const key = attr.key;
        if (key === 'options') return; // Already handled above

        // Extract the value (handles StringLiterals vs OptionsAttributes)
        let value = extractValue(attr.type === 'OptionsAttribute' ? attr : attr.value);

        // Skip internal/meta attributes
        if (this.ignoreAttributes?.includes(key)) return;
        if (['selected', 'default'].includes(key)) return;

        // --- Logic: Conditional Routing ---
        if (key === 'dependsOn') {
            if (typeof value === 'string' && value.includes(',')) {
                const parts = value.split(',').map(p => p.trim());
                attributes['dependsOn'] = parts[0];
                if (parts[1]) attributes['condition'] = parts[1].toLowerCase();
            } else {
                attributes['dependsOn'] = Array.isArray(value) ? value[0] : value;
            }
            return;
        }

        if (key === 'condition') {
            attributes['condition'] = typeof value === 'string' ? value.toLowerCase() : value;
            return;
        }

        if (key === 'dependents') {
            const deps = typeof value === 'string' ? value.split(',').map(v => v.trim()) : value;
            attributes['dependents'] = Array.isArray(deps) ? deps : [deps];
            return;
        }

        // --- Logic: Validation Extraction ---
        if (this.validationAttributes?.includes(key)) {
            let finalVal = value;
            // Type Casting for JSON-safe schema
            if (value === 'true' || value === true) finalVal = true;
            else if (value === 'false' || value === false) finalVal = false;
            else if (!isNaN(value) && typeof value === 'string' && value !== '') {
                finalVal = Number(value);
            }
            validations[key] = finalVal;
        } else {
            // All other custom attributes (e.g., placeholder, class, etc.)
            attributes[key] = value;
        }
    });

    return { validations, attributes };
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
