'use strict';

class  FormiqueParser{

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




cleanFieldName(str) {
  return str
    .trim()
    .replace(/[^\w-]/g, '');
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

  const traverseNode = (node) => {
    if (!node || typeof node !== 'object') return;

    const handler = nodeHandlers[node.type];

    if (handler) {
     // console.log('Processing:', node.type);
      handler(node);
    } else {
      console.warn(`No handler for node type: ${node.type}`);
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

// first option - explicit field name directive 
  if (fieldName.includes(':')) {
    const chunks = fieldName.split(':');
    return chunks[1]; // e.g., 'date' from 'dob:date'
  }

// Second option - low code type definition  
const matchedKey = attributeKeys.find(key => key in this.inputTypeMaps);
if (matchedKey) {
  return this.inputTypeMaps[matchedKey];
}

// option 3: inference with text fall back 
  return this.inferInputType(fieldName);

  
}



  // Builder methods - implement these according to your needs
  buildDirective(node) {
    //console.log(`Processing FormDirective: ${node.name.value}`);
   
   	this.formParams['id'] = node.name.value;
    // Handle directive specific logic
  }

  buildProperties(node) {
    console.log(`Processing FormProperties with ${node.properties.length} properties`);
  }

  buildProperty(node) {
    //console.log(`Processing FormProperty: ${node.key.value} = ${node.value.value}`);
    const key = node.key.value;
    const val = node.value.value 

// if this is regular form attribute then it goes to formParams
    if (this.formAttributes.includes(key)) {
      this.formParams[key] = val
    } else {
 
 this.formSettings[key] = val

    }
    

  }

  buildFields(node) {
    //console.log(`Processing FormFields with ${node.fields} fields`);




  }

  buildField(node) {
  //console.log(`Processing FormField: ${node.name} with ${node.attributes.length} attributes`);
  const rawFieldName = node.name;
  const cleanFieldName = this.cleanFieldName(rawFieldName);
  //const fieldType = this.inferInputType(cleanFieldName);
  
  let attributeKeys;
  let fieldType;  

  if (node.attributes.length > 0) {
  attributeKeys = this.extractAttributeKeys(node.attributes);
  fieldType = this.inputTypeResolver(cleanFieldName, attributeKeys); 
}  else {
fieldType = this.inferInputType(cleanFieldName);

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

const optionValues = this.extractOptionValues(node.attributes);
let options = []; 

if (optionValues.length > 0 ) {

  optionValues.forEach(option => {
  options.push({value: option, label: this.toTitleCase(option)})
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


    // console.log("attributes", attributes);



} // can else if OptionAttribute here

  });

  return {
    validations,
    attributes
  };
}






  buildOptionsAttribute(node) {
    console.log(`Processing OptionsAttribute with ${node.values.length} values`);
  }

  buildFieldAttribute(node) {
    //console.log(`Processing FieldAttribute: ${node.key} = ${node.value}`);
  }

  buildOption(node) {
    console.log(`Processing Option: ${node.value} (quoted: ${node.quoted})`);
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


const ast = {
  "directive": {
    "type": "FormDirective",
    "start": {
      "offset": 2,
      "line": 3,
      "column": 1
    },
    "end": {
      "offset": 76,
      "line": 9,
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
        "offset": 76,
        "line": 9,
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
            "type": "StringLiteral",
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
            "value": "dark"
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
            "type": "StringLiteral",
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
            "value": "email"
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
            "offset": 61,
            "line": 6,
            "column": 11
          },
          "key": {
            "type": "Identifier",
            "start": {
              "offset": 51,
              "line": 6,
              "column": 1
            },
            "end": {
              "offset": 53,
              "line": 6,
              "column": 3
            },
            "value": "id"
          },
          "value": {
            "type": "StringLiteral",
            "start": {
              "offset": 55,
              "line": 6,
              "column": 5
            },
            "end": {
              "offset": 61,
              "line": 6,
              "column": 11
            },
            "value": "myForm"
          }
        },
        {
          "type": "FormProperty",
          "start": {
            "offset": 62,
            "line": 7,
            "column": 1
          },
          "end": {
            "offset": 74,
            "line": 7,
            "column": 13
          },
          "key": {
            "type": "Identifier",
            "start": {
              "offset": 62,
              "line": 7,
              "column": 1
            },
            "end": {
              "offset": 67,
              "line": 7,
              "column": 6
            },
            "value": "class"
          },
          "value": {
            "type": "StringLiteral",
            "start": {
              "offset": 69,
              "line": 7,
              "column": 8
            },
            "end": {
              "offset": 74,
              "line": 7,
              "column": 13
            },
            "value": "block"
          }
        }
      ]
    }
  },
  "fields": {
    "type": "FormFields",
    "start": {
      "offset": 76,
      "line": 9,
      "column": 1
    },
    "end": {
      "offset": 406,
      "line": 29,
      "column": 2
    },
    "fields": [
      {
        "type": "FormField",
        "start": {
          "offset": 76,
          "line": 9,
          "column": 1
        },
        "end": {
          "offset": 138,
          "line": 13,
          "column": 1
        },
        "name": "!email*",
        "attributes": [
          {
            "type": "OptionsAttribute",
            "start": {
              "offset": 91,
              "line": 10,
              "column": 3
            },
            "end": {
              "offset": 105,
              "line": 10,
              "column": 17
            },
            "key": "id",
            "values": [
              {
                "type": "Option",
                "start": {
                  "offset": 95,
                  "line": 10,
                  "column": 7
                },
                "end": {
                  "offset": 105,
                  "line": 10,
                  "column": 17
                },
                "value": "user-email",
                "quoted": false
              }
            ]
          },
          {
            "type": "FieldAttribute",
            "start": {
              "offset": 108,
              "line": 11,
              "column": 3
            },
            "end": {
              "offset": 116,
              "line": 11,
              "column": 11
            },
            "key": "required",
            "value": true
          },
          {
            "type": "OptionsAttribute",
            "start": {
              "offset": 119,
              "line": 12,
              "column": 3
            },
            "end": {
              "offset": 137,
              "line": 12,
              "column": 21
            },
            "key": "class",
            "values": [
              {
                "type": "Option",
                "start": {
                  "offset": 126,
                  "line": 12,
                  "column": 10
                },
                "end": {
                  "offset": 137,
                  "line": 12,
                  "column": 21
                },
                "value": "input-field",
                "quoted": false
              }
            ]
          }
        ]
      },
      {
        "type": "FormField",
        "start": {
          "offset": 138,
          "line": 13,
          "column": 1
        },
        "end": {
          "offset": 145,
          "line": 14,
          "column": 1
        },
        "name": "name",
        "attributes": []
      },
      {
        "type": "FormField",
        "start": {
          "offset": 145,
          "line": 14,
          "column": 1
        },
        "end": {
          "offset": 159,
          "line": 16,
          "column": 1
        },
        "name": "telephone*",
        "attributes": []
      },
      {
        "type": "FormField",
        "start": {
          "offset": 159,
          "line": 16,
          "column": 1
        },
        "end": {
          "offset": 171,
          "line": 18,
          "column": 1
        },
        "name": "dob:date",
        "attributes": []
      },
      {
        "type": "FormField",
        "start": {
          "offset": 171,
          "line": 18,
          "column": 1
        },
        "end": {
          "offset": 225,
          "line": 23,
          "column": 1
        },
        "name": "Diet*",
        "attributes": [
          {
            "type": "FieldAttribute",
            "start": {
              "offset": 181,
              "line": 19,
              "column": 3
            },
            "end": {
              "offset": 186,
              "line": 19,
              "column": 8
            },
            "key": "oneof",
            "value": true
          },
          {
            "type": "OptionsAttribute",
            "start": {
              "offset": 189,
              "line": 20,
              "column": 3
            },
            "end": {
              "offset": 222,
              "line": 20,
              "column": 36
            },
            "key": "options",
            "values": [
              {
                "type": "Option",
                "start": {
                  "offset": 198,
                  "line": 20,
                  "column": 12
                },
                "end": {
                  "offset": 203,
                  "line": 20,
                  "column": 17
                },
                "value": "Vegan",
                "quoted": false
              },
              {
                "type": "Option",
                "start": {
                  "offset": 205,
                  "line": 20,
                  "column": 19
                },
                "end": {
                  "offset": 216,
                  "line": 20,
                  "column": 30
                },
                "value": "Pescitarian",
                "quoted": false
              },
              {
                "type": "Option",
                "start": {
                  "offset": 218,
                  "line": 20,
                  "column": 32
                },
                "end": {
                  "offset": 222,
                  "line": 20,
                  "column": 36
                },
                "value": "Meat",
                "quoted": false
              }
            ]
          }
        ]
      },
      {
        "type": "FormField",
        "start": {
          "offset": 225,
          "line": 23,
          "column": 1
        },
        "end": {
          "offset": 406,
          "line": 29,
          "column": 2
        },
        "name": "country-state",
        "attributes": [
          {
            "type": "OptionsAttribute",
            "start": {
              "offset": 245,
              "line": 24,
              "column": 3
            },
            "end": {
              "offset": 286,
              "line": 24,
              "column": 44
            },
            "key": "options",
            "values": [
              {
                "type": "Option",
                "start": {
                  "offset": 254,
                  "line": 24,
                  "column": 12
                },
                "end": {
                  "offset": 260,
                  "line": 24,
                  "column": 18
                },
                "value": "Zambia",
                "quoted": false
              },
              {
                "type": "Option",
                "start": {
                  "offset": 262,
                  "line": 24,
                  "column": 20
                },
                "end": {
                  "offset": 274,
                  "line": 24,
                  "column": 32
                },
                "value": "South Africa",
                "quoted": false
              },
              {
                "type": "Option",
                "start": {
                  "offset": 276,
                  "line": 24,
                  "column": 34
                },
                "end": {
                  "offset": 286,
                  "line": 24,
                  "column": 44
                },
                "value": "Zimbabwe",
                "quoted": false
              }
            ]
          },
          {
            "type": "OptionsAttribute",
            "start": {
              "offset": 289,
              "line": 25,
              "column": 3
            },
            "end": {
              "offset": 317,
              "line": 25,
              "column": 31
            },
            "key": "Zambia",
            "values": [
              {
                "type": "Option",
                "start": {
                  "offset": 297,
                  "line": 25,
                  "column": 11
                },
                "end": {
                  "offset": 303,
                  "line": 25,
                  "column": 17
                },
                "value": "Lusaka",
                "quoted": false
              },
              {
                "type": "Option",
                "start": {
                  "offset": 305,
                  "line": 25,
                  "column": 19
                },
                "end": {
                  "offset": 317,
                  "line": 25,
                  "column": 31
                },
                "value": "Copperbelt",
                "quoted": false
              }
            ]
          },
          {
            "type": "FieldAttribute",
            "start": {
              "offset": 320,
              "line": 26,
              "column": 3
            },
            "end": {
              "offset": 325,
              "line": 26,
              "column": 8
            },
            "key": "South",
            "value": true
          },
          {
            "type": "OptionsAttribute",
            "start": {
              "offset": 326,
              "line": 26,
              "column": 9
            },
            "end": {
              "offset": 364,
              "line": 26,
              "column": 47
            },
            "key": "Africa",
            "values": [
              {
                "type": "Option",
                "start": {
                  "offset": 334,
                  "line": 26,
                  "column": 17
                },
                "end": {
                  "offset": 341,
                  "line": 26,
                  "column": 24
                },
                "value": "Gauteng",
                "quoted": false
              },
              {
                "type": "Option",
                "start": {
                  "offset": 343,
                  "line": 26,
                  "column": 26
                },
                "end": {
                  "offset": 353,
                  "line": 26,
                  "column": 36
                },
                "value": "North West",
                "quoted": false
              },
              {
                "type": "Option",
                "start": {
                  "offset": 355,
                  "line": 26,
                  "column": 38
                },
                "end": {
                  "offset": 364,
                  "line": 26,
                  "column": 47
                },
                "value": "Limpopo",
                "quoted": false
              }
            ]
          },
          {
            "type": "OptionsAttribute",
            "start": {
              "offset": 367,
              "line": 27,
              "column": 3
            },
            "end": {
              "offset": 403,
              "line": 27,
              "column": 39
            },
            "key": "Zimbabwe",
            "values": [
              {
                "type": "Option",
                "start": {
                  "offset": 377,
                  "line": 27,
                  "column": 13
                },
                "end": {
                  "offset": 385,
                  "line": 27,
                  "column": 21
                },
                "value": "Midlands",
                "quoted": false
              },
              {
                "type": "Option",
                "start": {
                  "offset": 387,
                  "line": 27,
                  "column": 23
                },
                "end": {
                  "offset": 403,
                  "line": 27,
                  "column": 39
                },
                "value": "Mashonaland West",
                "quoted": false
              }
            ]
          }
        ]
      }
    ]
  }
};


const getSchemas = new FormiqueParser(ast); 
console.log(JSON.stringify(getSchemas,null,2));
