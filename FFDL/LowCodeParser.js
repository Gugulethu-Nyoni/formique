'use strict';

export default class  FormiqueParser{
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
'manyof',
'radio',
'select',
'mutli-select',
'multiselect',
'multipleselect',
'multiple-select',
'multiple',
'checkbox',

]; 


/*

this.selectInputTypes =[

'oneof',
'manyof',
'radio',
'select',
'mutli-select',
'multiselect',
'multipleselect',
'multiple-select',
'multiple',
'checkbox',

]; 

*/


this.inputTypeMaps = {
  oneof: 'radio',
  radio: 'radio',
  select: 'select',
  singleSelect: 'select', // optional addition
  manyof: 'checkbox',
  checkbox: 'checkbox',
  'multi-select': 'select-multiple',
  multiselect: 'select-multiple',
  multipleselect: 'select-multiple',
  'multiple-select': 'select-multiple',
  multiple: 'select-multiple',
  selectMany: 'select-multiple',
  selectOne:'select',
  manyselect: 'select-multiple',
  oneselect:'select',
  selectmany: 'select-multiple',
  selectone:'select',

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
      range: { type: 'range', priority: 10 }
    };
    
    // Default fallback
    this.defaultType = 'text';

    this.traverse();



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



/*
cleanFieldName(str) {
  return str
    .trim()
    .replace(/[^\w-]/g, '');
}
*/
/*
cleanFieldName(str) {
const anyFirstChunk = str.split(':')[0]; 
  return anyFirstChunk
    .trim()
    .replace(/[^\w-]/g, '');
}

*/

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
    FormProperty: this.buildProperty.bind(this),
    FormFields: this.buildFields.bind(this),
    FormField: this.buildField.bind(this),
    FieldAttribute: this.buildFieldAttribute.bind(this),
    Identifier: this.buildIdentifier.bind(this),
    StringLiteral: this.buildStringLiteral.bind(this)
  };

      const skipNodeTypes= ['buildProperties','StringLiteral','Identifier','FieldAttribute','buildFields']

  const traverseNode = (node) => {
    if (!node || typeof node !== 'object') return;

    const handler = nodeHandlers[node.type];

    if (handler && !skipNodeTypes.includes(node.type) ) {
     // console.log('Processing:', node.type);
      handler(node);
    } else {
      //console.warn(`No handler for node type: ${node.type}`);
    }

    // Handle nested nodes based on AST structure
    if (node.properties && Array.isArray(node.properties.properties)) {
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
    if (node.name && typeof node.name === 'object') {
      traverseNode(node.name);
    }
    if (node.key && typeof node.key === 'object') {
      traverseNode(node.key);
    }
    if (node.value && typeof node.value === 'object') {
      traverseNode(node.value);
    }
  };

  // Handle root-level nodes
  if (this.ast && typeof this.ast === 'object') {
    // Process directive if exists
    if (this.ast.directive) {
      traverseNode(this.ast.directive);
    }
    
    // Process fields if exists
    if (this.ast.fields) {
      traverseNode(this.ast.fields);
    }
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

  return attributes
    // Find the OptionsAttribute node
    .filter(attr => attr?.type === 'OptionsAttribute' && attr?.key === 'options')
    // Get the values array
    .flatMap(attr => attr.values || [])
    // Extract each option's value
    .map(option => option?.value)
    // Remove any undefined/null values
    .filter(Boolean);
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

  buildField(node) {
  //console.log(`Processing FormField: ${node.name} with ${node.attributes.length} attributes`);
  const rawFieldName = node.name;
  const cleanString = this.cleanFieldName(rawFieldName);
  //const fieldType = this.inferInputType(cleanFieldName);
  
const cleanFieldName = cleanString.input_name;
let fieldType; 

if (cleanString.input_type) {
fieldType = this.cleanToInputType(cleanString.input_type);
}



  let attributeKeys;

if (!fieldType) {

  if (node.attributes.length > 0) {
  attributeKeys = this.extractAttributeKeys(node.attributes);
  fieldType = this.inputTypeResolver(cleanFieldName, attributeKeys); 
}  else {
fieldType = this.inferInputType(cleanFieldName);

}


}

//console.log("fieldType", fieldType);



if (fieldType === 'dynamicSingleSelect') {
  //console.log("HERE",fieldType);
this.buildDynamicSingleSelect(node, rawFieldName);
return; 
}


  const fieldSchema = []; 
  const fieldLabel = this.toTitleCase(cleanFieldName);


 fieldSchema.push(fieldType, cleanFieldName, fieldLabel );
 // validation 
 let validations = {};
 let attributes = {}; 

 




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


// now we need to build options schema for select, radio, select-multiple, checkbox

  if (node.attributes.length > 0) {


/// in case of options (selects scenarios) - get the default (selected) value if exists


const getDefaultValue = (attributes) => {
  if (!Array.isArray(attributes)) return null;
  
  // Find the default attribute (could be FieldAttribute or OptionsAttribute)
  const defaultAttr = attributes.find(attr => 
    attr?.key === "default" && 
    (attr.type === "FieldAttribute" || attr.type === "OptionsAttribute")
  );

  // Handle different attribute types
  if (defaultAttr?.type === "FieldAttribute") {
    return defaultAttr.value ?? null;
  }
  if (defaultAttr?.type === "OptionsAttribute") {
    // Return first value if exists (though default should typically be single value)
    return defaultAttr.values?.[0]?.value ?? null;
  }

  return null;
};

const defaultValue = getDefaultValue(node.attributes);




const optionValues = this.extractOptionValues(node.attributes);
let options = []; 

if (optionValues.length > 0 ) {
  optionValues.forEach(option => { 
    if (option === defaultValue) {
    options.push({value: option.toLowerCase(), label: this.toTitleCase(option), selected: true})
} else {
  options.push({value: option.toLowerCase(), label: this.toTitleCase(option)})
}

  })

 fieldSchema.push(options) 
}
//console.log(optionValues);

//console.log(options);

  }


 this.formSchema.push(fieldSchema); 

 
 //console.log("fieldType", fieldType);

  }


handleAttributes(attributesAST) {


  let validations = {};
  let attributes = {};

  attributesAST.forEach(attr => {
    if (attr.type === 'FieldAttribute') {
    const key = attr.key;
    let value;
     //console.log("CHECK 1",attr);
     //console.log("CHECK 2",attr.value);

    if (typeof attr.value === 'object') {
      value = attr.value.value;

    } else {
      value = attr.value;
    }


    // Skip ignored keys
    if (this.ignoreAttributes.includes(key)) return;

    // Categorize key as input attribute or validation
    if (this.inputAttributes.includes(key)) {
      attributes[key] = value;
    } else if (this.validationAttributes.includes(key)) {
      validations[key] = value;
    }


    // HANDLE Conditionality Attributes 

   
    // console.log("attributes", attributes);



} // can else if OptionAttribute here

  });


let dependents = [];

const getDependents = (attributesAST) => {
  // Find the OptionsAttribute with key "dependents"
  const dependentsAttr = attributesAST.find(
    attr => attr.type === "OptionsAttribute" && attr.key === "dependents"
  );
  
  // If found, map the values to just the option strings
  return dependentsAttr 
    ? dependentsAttr.values.map(option => option.value) 
    : [];


 }

// Usage example:
dependents = getDependents(attributesAST);
if(dependents.length > 0) {
  attributes['dependents'] = dependents; 
}
//console.log("WHY?",dependents);

// NOW LET'S HANDLE child dependencies


const getDependsOn = (attributesAST) => {
  if (!Array.isArray(attributesAST)) return null;

  const dependsOnAttr = attributesAST.find(
    attr => attr?.type === "OptionsAttribute" && attr?.key === "dependsOn"
  );

  // Must have at least 2 values (field and condition)
  if (!dependsOnAttr?.values || dependsOnAttr.values.length < 2) {
    return null;
  }

  return {
    dependsOnValue: dependsOnAttr.values[0]?.value || '',
    dependsOnCondition: dependsOnAttr.values[1]?.value || ''
  };


  
};

const dependency = getDependsOn(attributesAST);
/// 

if (dependency) {
const dependsOnCondition= dependency.dependsOnCondition.toLowerCase(); 

attributes['dependsOn']= dependency.dependsOnValue;
attributes['condition'] = `${dependsOnCondition}`;
//attributes['condition'] = `(value) => value === ${dependency.dependsOnCondition}`;

}
/*
const dependencyObject =  {
    dependsOn: `${dependency.dependsOnValue}`,
    condition: (value) => value === `${dependency.dependsOnCondition}`
  };
console.log(dependency);
*/

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


  //class wrapper - nothing below

}


/* TESTING */


const testAst = {
  "directive": {
    "type": "FormDirective",
    "start": {
      "offset": 2,
      "line": 3,
      "column": 1
    },
    "end": {
      "offset": 120,
      "line": 10,
      "column": 1
    },
    "name": {
      "type": "Identifier",
      "start": {
        "offset": 9,
        "line": 3,
        "column": 8
      },
      "end": {
        "offset": 26,
        "line": 3,
        "column": 25
      },
      "value": "user-registration"
    },
    "properties": {
      "type": "FormProperties",
      "start": {
        "offset": 27,
        "line": 4,
        "column": 1
      },
      "end": {
        "offset": 120,
        "line": 10,
        "column": 1
      },
      "properties": [
        {
          "type": "FormProperty",
          "start": {
            "offset": 27,
            "line": 4,
            "column": 1
          },
          "end": {
            "offset": 38,
            "line": 4,
            "column": 12
          },
          "key": {
            "type": "Identifier",
            "start": {
              "offset": 27,
              "line": 4,
              "column": 1
            },
            "end": {
              "offset": 32,
              "line": 4,
              "column": 6
            },
            "value": "theme"
          },
          "value": {
            "isOptions": true,
            "values": [
              {
                "type": "Option",
                "start": {
                  "offset": 34,
                  "line": 4,
                  "column": 8
                },
                "end": {
                  "offset": 38,
                  "line": 4,
                  "column": 12
                },
                "value": "dark",
                "quoted": false
              }
            ]
          }
        },
        {
          "type": "FormProperty",
          "start": {
            "offset": 39,
            "line": 5,
            "column": 1
          },
          "end": {
            "offset": 50,
            "line": 5,
            "column": 12
          },
          "key": {
            "type": "Identifier",
            "start": {
              "offset": 39,
              "line": 5,
              "column": 1
            },
            "end": {
              "offset": 43,
              "line": 5,
              "column": 5
            },
            "value": "mode"
          },
          "value": {
            "isOptions": true,
            "values": [
              {
                "type": "Option",
                "start": {
                  "offset": 45,
                  "line": 5,
                  "column": 7
                },
                "end": {
                  "offset": 50,
                  "line": 5,
                  "column": 12
                },
                "value": "email",
                "quoted": false
              }
            ]
          }
        },
        {
          "type": "FormProperty",
          "start": {
            "offset": 51,
            "line": 6,
            "column": 1
          },
          "end": {
            "offset": 94,
            "line": 6,
            "column": 44
          },
          "key": {
            "type": "Identifier",
            "start": {
              "offset": 51,
              "line": 6,
              "column": 1
            },
            "end": {
              "offset": 57,
              "line": 6,
              "column": 7
            },
            "value": "sendTo"
          },
          "value": {
            "isOptions": true,
            "values": [
              {
                "type": "Option",
                "start": {
                  "offset": 59,
                  "line": 6,
                  "column": 9
                },
                "end": {
                  "offset": 75,
                  "line": 6,
                  "column": 25
                },
                "value": "info@example.com",
                "quoted": false
              },
              {
                "type": "Option",
                "start": {
                  "offset": 77,
                  "line": 6,
                  "column": 27
                },
                "end": {
                  "offset": 94,
                  "line": 6,
                  "column": 44
                },
                "value": "admin@example.com",
                "quoted": false
              }
            ]
          }
        },
        {
          "type": "FormProperty",
          "start": {
            "offset": 95,
            "line": 7,
            "column": 1
          },
          "end": {
            "offset": 105,
            "line": 7,
            "column": 11
          },
          "key": {
            "type": "Identifier",
            "start": {
              "offset": 95,
              "line": 7,
              "column": 1
            },
            "end": {
              "offset": 97,
              "line": 7,
              "column": 3
            },
            "value": "id"
          },
          "value": {
            "isOptions": true,
            "values": [
              {
                "type": "Option",
                "start": {
                  "offset": 99,
                  "line": 7,
                  "column": 5
                },
                "end": {
                  "offset": 105,
                  "line": 7,
                  "column": 11
                },
                "value": "myForm",
                "quoted": false
              }
            ]
          }
        },
        {
          "type": "FormProperty",
          "start": {
            "offset": 106,
            "line": 8,
            "column": 1
          },
          "end": {
            "offset": 118,
            "line": 8,
            "column": 13
          },
          "key": {
            "type": "Identifier",
            "start": {
              "offset": 106,
              "line": 8,
              "column": 1
            },
            "end": {
              "offset": 111,
              "line": 8,
              "column": 6
            },
            "value": "class"
          },
          "value": {
            "isOptions": true,
            "values": [
              {
                "type": "Option",
                "start": {
                  "offset": 113,
                  "line": 8,
                  "column": 8
                },
                "end": {
                  "offset": 118,
                  "line": 8,
                  "column": 13
                },
                "value": "block",
                "quoted": false
              }
            ]
          }
        }
      ]
    }
  },
  "fields": {
    "type": "FormFields",
    "start": {
      "offset": 120,
      "line": 10,
      "column": 1
    },
    "end": {
      "offset": 697,
      "line": 46,
      "column": 1
    },
    "fields": [
      {
        "type": "FormField",
        "start": {
          "offset": 120,
          "line": 10,
          "column": 1
        },
        "end": {
          "offset": 182,
          "line": 14,
          "column": 1
        },
        "name": "!email*",
        "attributes": [
          {
            "type": "FieldAttribute",
            "start": {
              "offset": 135,
              "line": 11,
              "column": 3
            },
            "end": {
              "offset": 182,
              "line": 14,
              "column": 1
            },
            "key": "id",
            "value": "user-email"
          },
          {
            "type": "FieldAttribute",
            "start": {
              "offset": 135,
              "line": 11,
              "column": 3
            },
            "end": {
              "offset": 182,
              "line": 14,
              "column": 1
            },
            "key": "required",
            "value": true
          },
          {
            "type": "FieldAttribute",
            "start": {
              "offset": 135,
              "line": 11,
              "column": 3
            },
            "end": {
              "offset": 182,
              "line": 14,
              "column": 1
            },
            "key": "class",
            "value": "input-field"
          }
        ]
      },
      {
        "type": "FormField",
        "start": {
          "offset": 182,
          "line": 14,
          "column": 1
        },
        "end": {
          "offset": 189,
          "line": 15,
          "column": 1
        },
        "name": "name",
        "attributes": []
      },
      {
        "type": "FormField",
        "start": {
          "offset": 189,
          "line": 15,
          "column": 1
        },
        "end": {
          "offset": 203,
          "line": 17,
          "column": 1
        },
        "name": "telephone*",
        "attributes": []
      },
      {
        "type": "FormField",
        "start": {
          "offset": 203,
          "line": 17,
          "column": 1
        },
        "end": {
          "offset": 215,
          "line": 19,
          "column": 1
        },
        "name": "dob:date",
        "attributes": []
      },
      {
        "type": "FormField",
        "start": {
          "offset": 215,
          "line": 19,
          "column": 1
        },
        "end": {
          "offset": 268,
          "line": 23,
          "column": 1
        },
        "name": "Diet*",
        "attributes": [
          {
            "type": "FieldAttribute",
            "start": {
              "offset": 225,
              "line": 20,
              "column": 3
            },
            "end": {
              "offset": 268,
              "line": 23,
              "column": 1
            },
            "key": "oneof",
            "value": true
          },
          {
            "type": "OptionsAttribute",
            "start": {
              "offset": 225,
              "line": 20,
              "column": 3
            },
            "end": {
              "offset": 268,
              "line": 23,
              "column": 1
            },
            "key": "options",
            "values": [
              {
                "type": "Option",
                "start": {
                  "offset": 225,
                  "line": 20,
                  "column": 3
                },
                "end": {
                  "offset": 268,
                  "line": 23,
                  "column": 1
                },
                "value": "Vegan",
                "quoted": false
              },
              {
                "type": "Option",
                "start": {
                  "offset": 225,
                  "line": 20,
                  "column": 3
                },
                "end": {
                  "offset": 268,
                  "line": 23,
                  "column": 1
                },
                "value": "Pescitarian",
                "quoted": false
              },
              {
                "type": "Option",
                "start": {
                  "offset": 225,
                  "line": 20,
                  "column": 3
                },
                "end": {
                  "offset": 268,
                  "line": 23,
                  "column": 1
                },
                "value": "Meat",
                "quoted": false
              }
            ]
          },
          {
            "type": "FieldAttribute",
            "start": {
              "offset": 225,
              "line": 20,
              "column": 3
            },
            "end": {
              "offset": 268,
              "line": 23,
              "column": 1
            },
            "key": "",
            "value": true
          }
        ]
      },
      {
        "type": "FormField",
        "start": {
          "offset": 268,
          "line": 23,
          "column": 1
        },
        "end": {
          "offset": 477,
          "line": 32,
          "column": 1
        },
        "name": "country-state*",
        "attributes": [
          {
            "type": "FieldAttribute",
            "start": {
              "offset": 287,
              "line": 24,
              "column": 3
            },
            "end": {
              "offset": 477,
              "line": 32,
              "column": 1
            },
            "key": "id",
            "value": "dsel"
          },
          {
            "type": "FieldAttribute",
            "start": {
              "offset": 287,
              "line": 24,
              "column": 3
            },
            "end": {
              "offset": 477,
              "line": 32,
              "column": 1
            },
            "key": "class",
            "value": "active"
          },
          {
            "type": "OptionsAttribute",
            "start": {
              "offset": 287,
              "line": 24,
              "column": 3
            },
            "end": {
              "offset": 477,
              "line": 32,
              "column": 1
            },
            "key": "options",
            "values": [
              {
                "type": "Option",
                "start": {
                  "offset": 287,
                  "line": 24,
                  "column": 3
                },
                "end": {
                  "offset": 477,
                  "line": 32,
                  "column": 1
                },
                "value": "Zambia",
                "quoted": false
              },
              {
                "type": "Option",
                "start": {
                  "offset": 287,
                  "line": 24,
                  "column": 3
                },
                "end": {
                  "offset": 477,
                  "line": 32,
                  "column": 1
                },
                "value": "South Africa",
                "quoted": false
              },
              {
                "type": "Option",
                "start": {
                  "offset": 287,
                  "line": 24,
                  "column": 3
                },
                "end": {
                  "offset": 477,
                  "line": 32,
                  "column": 1
                },
                "value": "Zimbabwe",
                "quoted": false
              }
            ]
          },
          {
            "type": "OptionsAttribute",
            "start": {
              "offset": 287,
              "line": 24,
              "column": 3
            },
            "end": {
              "offset": 477,
              "line": 32,
              "column": 1
            },
            "key": "Zambia",
            "values": [
              {
                "type": "Option",
                "start": {
                  "offset": 287,
                  "line": 24,
                  "column": 3
                },
                "end": {
                  "offset": 477,
                  "line": 32,
                  "column": 1
                },
                "value": "Lusaka",
                "quoted": false
              },
              {
                "type": "Option",
                "start": {
                  "offset": 287,
                  "line": 24,
                  "column": 3
                },
                "end": {
                  "offset": 477,
                  "line": 32,
                  "column": 1
                },
                "value": "Copperbelt",
                "quoted": false
              }
            ]
          },
          {
            "type": "OptionsAttribute",
            "start": {
              "offset": 287,
              "line": 24,
              "column": 3
            },
            "end": {
              "offset": 477,
              "line": 32,
              "column": 1
            },
            "key": "South Africa",
            "values": [
              {
                "type": "Option",
                "start": {
                  "offset": 287,
                  "line": 24,
                  "column": 3
                },
                "end": {
                  "offset": 477,
                  "line": 32,
                  "column": 1
                },
                "value": "Gauteng",
                "quoted": false
              },
              {
                "type": "Option",
                "start": {
                  "offset": 287,
                  "line": 24,
                  "column": 3
                },
                "end": {
                  "offset": 477,
                  "line": 32,
                  "column": 1
                },
                "value": "North West",
                "quoted": false
              },
              {
                "type": "Option",
                "start": {
                  "offset": 287,
                  "line": 24,
                  "column": 3
                },
                "end": {
                  "offset": 477,
                  "line": 32,
                  "column": 1
                },
                "value": "Limpopo",
                "quoted": false
              }
            ]
          },
          {
            "type": "OptionsAttribute",
            "start": {
              "offset": 287,
              "line": 24,
              "column": 3
            },
            "end": {
              "offset": 477,
              "line": 32,
              "column": 1
            },
            "key": "Zimbabwe",
            "values": [
              {
                "type": "Option",
                "start": {
                  "offset": 287,
                  "line": 24,
                  "column": 3
                },
                "end": {
                  "offset": 477,
                  "line": 32,
                  "column": 1
                },
                "value": "Midlands",
                "quoted": false
              },
              {
                "type": "Option",
                "start": {
                  "offset": 287,
                  "line": 24,
                  "column": 3
                },
                "end": {
                  "offset": 477,
                  "line": 32,
                  "column": 1
                },
                "value": "Mashonaland West",
                "quoted": false
              }
            ]
          },
          {
            "type": "FieldAttribute",
            "start": {
              "offset": 287,
              "line": 24,
              "column": 3
            },
            "end": {
              "offset": 477,
              "line": 32,
              "column": 1
            },
            "key": "",
            "value": true
          },
          {
            "type": "FieldAttribute",
            "start": {
              "offset": 287,
              "line": 24,
              "column": 3
            },
            "end": {
              "offset": 477,
              "line": 32,
              "column": 1
            },
            "key": "",
            "value": true
          }
        ]
      },
      {
        "type": "FormField",
        "start": {
          "offset": 477,
          "line": 32,
          "column": 1
        },
        "end": {
          "offset": 576,
          "line": 39,
          "column": 1
        },
        "name": "!*role",
        "attributes": [
          {
            "type": "FieldAttribute",
            "start": {
              "offset": 487,
              "line": 33,
              "column": 3
            },
            "end": {
              "offset": 576,
              "line": 39,
              "column": 1
            },
            "key": "selectOne",
            "value": true
          },
          {
            "type": "OptionsAttribute",
            "start": {
              "offset": 487,
              "line": 33,
              "column": 3
            },
            "end": {
              "offset": 576,
              "line": 39,
              "column": 1
            },
            "key": "options",
            "values": [
              {
                "type": "Option",
                "start": {
                  "offset": 487,
                  "line": 33,
                  "column": 3
                },
                "end": {
                  "offset": 576,
                  "line": 39,
                  "column": 1
                },
                "value": "Attendee",
                "quoted": false
              },
              {
                "type": "Option",
                "start": {
                  "offset": 487,
                  "line": 33,
                  "column": 3
                },
                "end": {
                  "offset": 576,
                  "line": 39,
                  "column": 1
                },
                "value": "Presenter",
                "quoted": false
              }
            ]
          },
          {
            "type": "FieldAttribute",
            "start": {
              "offset": 487,
              "line": 33,
              "column": 3
            },
            "end": {
              "offset": 576,
              "line": 39,
              "column": 1
            },
            "key": "default",
            "value": "Attendee"
          },
          {
            "type": "OptionsAttribute",
            "start": {
              "offset": 487,
              "line": 33,
              "column": 3
            },
            "end": {
              "offset": 576,
              "line": 39,
              "column": 1
            },
            "key": "dependents",
            "values": [
              {
                "type": "Option",
                "start": {
                  "offset": 487,
                  "line": 33,
                  "column": 3
                },
                "end": {
                  "offset": 576,
                  "line": 39,
                  "column": 1
                },
                "value": "topic",
                "quoted": false
              },
              {
                "type": "Option",
                "start": {
                  "offset": 487,
                  "line": 33,
                  "column": 3
                },
                "end": {
                  "offset": 576,
                  "line": 39,
                  "column": 1
                },
                "value": "mode",
                "quoted": false
              }
            ]
          },
          {
            "type": "FieldAttribute",
            "start": {
              "offset": 487,
              "line": 33,
              "column": 3
            },
            "end": {
              "offset": 576,
              "line": 39,
              "column": 1
            },
            "key": "",
            "value": true
          },
          {
            "type": "FieldAttribute",
            "start": {
              "offset": 487,
              "line": 33,
              "column": 3
            },
            "end": {
              "offset": 576,
              "line": 39,
              "column": 1
            },
            "key": "",
            "value": true
          }
        ]
      },
      {
        "type": "FormField",
        "start": {
          "offset": 576,
          "line": 39,
          "column": 1
        },
        "end": {
          "offset": 620,
          "line": 42,
          "column": 1
        },
        "name": "topic:text",
        "attributes": [
          {
            "type": "OptionsAttribute",
            "start": {
              "offset": 592,
              "line": 40,
              "column": 3
            },
            "end": {
              "offset": 620,
              "line": 42,
              "column": 1
            },
            "key": "dependsOn",
            "values": [
              {
                "type": "Option",
                "start": {
                  "offset": 592,
                  "line": 40,
                  "column": 3
                },
                "end": {
                  "offset": 620,
                  "line": 42,
                  "column": 1
                },
                "value": "role",
                "quoted": false
              },
              {
                "type": "Option",
                "start": {
                  "offset": 592,
                  "line": 40,
                  "column": 3
                },
                "end": {
                  "offset": 620,
                  "line": 42,
                  "column": 1
                },
                "value": "Presenter",
                "quoted": false
              }
            ]
          },
          {
            "type": "FieldAttribute",
            "start": {
              "offset": 592,
              "line": 40,
              "column": 3
            },
            "end": {
              "offset": 620,
              "line": 42,
              "column": 1
            },
            "key": "",
            "value": true
          }
        ]
      },
      {
        "type": "FormField",
        "start": {
          "offset": 620,
          "line": 42,
          "column": 1
        },
        "end": {
          "offset": 697,
          "line": 46,
          "column": 1
        },
        "name": "mode*",
        "attributes": [
          {
            "type": "FieldAttribute",
            "start": {
              "offset": 629,
              "line": 43,
              "column": 2
            },
            "end": {
              "offset": 697,
              "line": 46,
              "column": 1
            },
            "key": "oneof",
            "value": true
          },
          {
            "type": "OptionsAttribute",
            "start": {
              "offset": 629,
              "line": 43,
              "column": 2
            },
            "end": {
              "offset": 697,
              "line": 46,
              "column": 1
            },
            "key": "options",
            "values": [
              {
                "type": "Option",
                "start": {
                  "offset": 629,
                  "line": 43,
                  "column": 2
                },
                "end": {
                  "offset": 697,
                  "line": 46,
                  "column": 1
                },
                "value": "virtual",
                "quoted": false
              },
              {
                "type": "Option",
                "start": {
                  "offset": 629,
                  "line": 43,
                  "column": 2
                },
                "end": {
                  "offset": 697,
                  "line": 46,
                  "column": 1
                },
                "value": "physical",
                "quoted": false
              },
              {
                "type": "Option",
                "start": {
                  "offset": 629,
                  "line": 43,
                  "column": 2
                },
                "end": {
                  "offset": 697,
                  "line": 46,
                  "column": 1
                },
                "value": "hybrid",
                "quoted": false
              }
            ]
          },
          {
            "type": "OptionsAttribute",
            "start": {
              "offset": 629,
              "line": 43,
              "column": 2
            },
            "end": {
              "offset": 697,
              "line": 46,
              "column": 1
            },
            "key": "dependsOn",
            "values": [
              {
                "type": "Option",
                "start": {
                  "offset": 629,
                  "line": 43,
                  "column": 2
                },
                "end": {
                  "offset": 697,
                  "line": 46,
                  "column": 1
                },
                "value": "role",
                "quoted": false
              },
              {
                "type": "Option",
                "start": {
                  "offset": 629,
                  "line": 43,
                  "column": 2
                },
                "end": {
                  "offset": 697,
                  "line": 46,
                  "column": 1
                },
                "value": "Presenter",
                "quoted": false
              }
            ]
          }
        ]
      }
    ]
  }
};




//const getSchemas = new FormiqueParser(ast); 
//console.log(JSON.stringify(getSchemas,null,2));
