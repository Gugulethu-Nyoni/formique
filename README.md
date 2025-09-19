# Formique JS Form Builder Documentation

[![NPM](https://img.shields.io/npm/v/formique.svg)](https://www.npmjs.com/package/formique)
[![NPM Downloads](https://img.shields.io/npm/dt/formique.svg)](https://www.npmjs.com/package/formique)
[![GitHub Stars](https://img.shields.io/github/stars/Gugulethu-Nyoni/formique.svg)](https://github.com/Gugulethu-Nyoni/formique/stargazers)
[![GitHub Issues](https://img.shields.io/github/issues/Gugulethu-Nyoni/formique.svg)](https://github.com/Gugulethu-Nyoni/formique/issues)
<a href="https://github.com/Gugulethu-Nyoni/formique/blob/main/LICENSE">
  <img alt="Formique uses the MIT license" src="https://img.shields.io/github/license/Gugulethu-Nyoni/formique" style="max-width: 100%;">
</a>
[![GitHub Workflow](https://img.shields.io/github/workflow/status/Gugulethu-Nyoni/formique/CI/main.svg)](https://github.com/Gugulethu-Nyoni/formique/actions)

<img src="https://github.com/Gugulethu-Nyoni/formique/blob/main/images/formique-js-form-builder-anyframework.png" alt="Formique JS Form Builder Example">

If you want a quick guide for `@formique/semantq`, please visit:
[Formique Semantq Guide](https://github.com/Gugulethu-Nyoni/formique/tree/main/integrations/formique-semantq)


## Table of Contents
- [About Formique](#about-formique)
- [Why Choose Formique?](#why-choose-formique)
- [Form Input Types Covered](#form-input-types-covered)
- [How to Write Form Schema](#how-to-write-form-schema)
- [Installation](#installation)
- [Form Schema Example](#form-schema-example)
- [Dynamic Drop-Down Schema](#dynamic-drop-down-schema)
- [Nested Conditionality Logic - Schema Definition](#nested-conditionality-logic---schema-definition)
- [Styling the Form](#styling-the-form)
- [Testing Form Submission with submitOnPage](#testing-form-submission-with-submitonpage)
- [Contribute](#contribute)


## About Formique

Formique is a robust and elegant WCAG and ARIA compliant form-building library tailored for JavaScript enthusiasts. It supports a wide array of input types, features JS-driven themes, and offers advanced functionalities like nested conditional logic and dynamic dropdowns. Highly customizable and extensible, Formique is built for the Semantq JS Framework but seamlessly integrates with Vanilla JS, React, Vue, Angular, and Svelte.


Formique is Open-source &amp; MIT licensed.


## Accessibility Compliance - 

Formique is designed with a laser focus on WAI-ARIA and WCAG usability and accessibility, ensuring that the generated form HTML markup meets the highest standards of web accessibility.

With minimal declarative form input definitions, Formique takes care of the rest to ensure the final markup is comprehensive enough to meet [official](https://www.w3.org/WAI/tutorials/forms/) usability and accessibility standards. 

For more information on the Web Content (Forms) Accessibility Guidelines (WCAG), you can visit the [W3C website](https://www.w3.org/WAI/tutorials/forms/).


## Key Features

- **Declarative Syntax:** Define forms using a simple and intuitive schema.
- **Low Code Syntax:** Cut out the coding and technical jargon and write forms using easy and flexible low code syntax.
- **Wide Range of Inputs:** Supports text, email, number, password, date, time, file uploads, and more.
- **Validation and Attributes:** Easily specify validation rules and attributes for each form field.
- **Dynamic Form Generation:** Generate forms dynamically based on your schema.
- **Framework Agnostic:** Currently works with Semantq and vanilla JS. (More frameworks to be added)
- **Accessibility and Usability Compliant:** Formique yields form markup compliant with WCAG.
- **Mobile Responsive:** Forms are mobile responsive out of the box.
- **Nested Dynamic Conditional Logic:** Implement complex conditional logic to show or hide form fields based on user input.
- **Dynamic Dropdowns:** Create dropdowns whose options change dynamically based on other field selections.
- **JavaScript-Driven Themes:** Apply themes dynamically using JavaScript for a customizable user interface.
- **WAI-ARIA and WCAG-Compliant HTML:** Ensure all form elements are accessible and meet WCAG standards.
- **Progressive Enhancement:** Forms function with or without JavaScript, ensuring accessibility and functionality across all environments.

## Why Choose Formique?

- **Vanilla JS:** No dependencies; works seamlessly with vanilla JS and Semantq JS framework. (More frameworks to be added)
- **Lightweight:** Minimal footprint optimized for performance.
- **Customizable:** Adapt the library to fit your project's unique needs for functionality and style.
- **Declarative:** Write your forms in JavaScript and define forms with a concise schema for better readability and maintainability.
- **Usability and Accessibility Compliant:** You just need to focus on defining form fields data. Formique handles WCAG compliance for you.
- **Mobile Responsive:** Formique forms are mobile responsive out of the box.
- **Dynamic Features:** Implement nested conditional logic, dynamic dropdowns, and JavaScript-driven themes to enhance user experience.
- **Progressive Enhancement:** Forms are designed to function with or without JavaScript, ensuring broad compatibility.
- **Low Code Syntax:** Cut out the coding and technical jargon and write forms using easy and flexible low code syntax.



## Form Input Types Covered

- Text: ```html <input type="text"> ```
- Email: ```html <input type="email"> ```
- Number: ```html <input type="number"> ```
- Password: ```html <input type="password"> ```
- Telephone: ```html <input type="tel"> ```
- Date: ```html <input type="date"> ```
- Time: ```html <input type="time"> ```
- Datetime-local: ```html <input type="datetime-local"> ```
- Month: ```html <input type="month"> ```
- Week: ```html <input type="week"> ```
- URL: ```html <input type="url"> ```
- Search: ```html <input type="search"> ```
- Color: ```html <input type="color"> ```
- File: ```html <input type="file"> ```
- Hidden: ```html <input type="hidden"> ```
- Image: ```html <input type="image"> ```
- Textarea: ```html <textarea> ```
- Radio: ```html <input type="radio"> ```
- Checkbox: ```html <input type="checkbox"> ```
- Select (Single & Multiple): ```html <select> ```
- Dynamic Single Select: Displays a single-select dropdown of subcategories based on a selected category. For example, it dynamically shows a dropdown of states when a country is selected from a list of countries: ```html <select> ```
- Submit: ```html <input type="submit"> ```


# How to Write Form Schema

The form schema is an array of field definitions. Each field is defined by an array containing:
- Input definition (required)
- Input validation (optional)
- Input attributes (optional, including binding attribute (optional)
- Options (applicable to single select, multiple select, radio and check box inputs)

## Input Definition
- **Type**: The input type (e.g., 'text', 'email', 'radio').
- **Name**: The name attribute for the input. 
- **Label**: The label for the input.

You don't need to use the type, name and label keys to define these parameters.
**Example Input Definition:**

`['text', 'firstname', 'First Name' ]`

In the example above:
 - The first item (text) defines the type of the input - this will yield: `<input type="text" ...` 
 - The second item (firstname) defines the name value of the input - this will yield: `<input name="firstname" ...`
 - The third item (First Name) defines the Label value- this will yield:  `<label for="firstname">First Name</label>`
 - Final html output will be:

 ```html
 <div class="input-block" id="firstname-block">
      <label for="firstname">First Name</label>
      <input type="text" name="firstname" id="firstname" class="form-input" placeholder="First
  Name">
    </div>
 ```


## Input Validation
- **Validation**: Object specifying validation rules. This can include:
  - **Required**: Boolean to specify if the field is mandatory.
    - Example: `required: true`
  - **Minlength**: Specifies the minimum number of characters allowed.
    - Example: `minlength: 5`
  - **Maxlength**: Specifies the maximum number of characters allowed.
    - Example: `maxlength: 50`
  - **Pattern**: A regex pattern the input must match.
    - Example: `pattern: "/^[A-Za-z0-9]+$/"`

  ### Number Field Specific Validation:
  - **Min**: Specifies the minimum numeric value allowed.
    - Example: `min: 1`
  - **Max**: Specifies the maximum numeric value allowed.
    - Example: `max: 100`
  - **Step**: Specifies the increment step for numeric values.
    - Example: `step: 0.01` (for decimal increments)

**Formique will filter out any invalid validation defined and throw warnings on the browser console.E.g. when you define min and max validations (instead of minlength and maxlength) for a text field,  Formique will filter these out.**


## Input Attributes
- **Attributes**: Object specifying additional attributes like `id`, `class`, `style`, etc.
  - Example: `{ id: 'username', class: 'form-input', style: 'font-size: 13px;' }`

## Binding

- **Binding:** Optional binding syntax for dynamic data. The binding object has been moved to the attributes object, allowing for inclusion directly within the attributes. Two syntax formats are supported:
  - `binding: '::nameOfField'`
  - `binding: 'bind-value'`
  - Example: `'::inputName'` or `'bind-value'`  
    *Note:* `inputName` must be the value defined as the input name (the second item) in the input definition object.

## Options
- **Options**: For singleSelect,, multipleSelect, radio, and checkbox inputs. This is an array of options, each with a `value` and `label`.
  - Example: `[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }]`

### Selected Options
  For fields like singleSelect and multipleSelect you can also define default or pre selected options this way:  

  `[{ value: 'red', label: 'Red' }, { value: 'blue', label: 'Blue', selected: true }]`

  In the example given: the blue option will be selected by default.


## Installation (Vanilla JS)

There are two primary ways to install and use Formique in your project: 

### Option A: Use Formique in a Browser Context (No Bundler Required)

1. **Include the CSS** in the head section of your HTML file:

```html
<link rel="stylesheet" href="https://unpkg.com/formique-css@1.0.13/formique-css.css" />
```

2. **Include the JavaScript** before the closing `</body>` tag of your HTML file:

    ```html
      <script src="https://cdn.jsdelivr.net/npm/formique@1.0.12/formique.umd.min.js"></script>
    ```

### Usage Example:

1. Define the form container somewhere in the HTML body:

    ```html
    <div id="formique"></div>
    ```

    Alternatively, you can use a different container ID by setting `formContainerId: 'someelementid'` in the `formSettings` object.

2. Define your `formParams`, `formSchema`, and initialize Formique in a `<script>` block (placed below the previous script tag):

    ```html
    <script>
        const formSchema = [
            ['text', 'name', 'Name', { required: true }, {}],
            ['email', 'email', 'Email', { required: true }, {}],
            ['singleSelect', 'diet', 'Dietary Requirements', { required: true }, {}, [
                { value: 'gluten-free', label: 'Gluten-free' },
                { value: 'vegetarian', label: 'Vegetarian' },
                // Additional options here...
            ]],
            ['submit', 'submitButton', 'Submit']
        ];

        const formParams = {
            method: 'post',
            action: 'submit.js',
            id: 'myForm',
            class: 'form',
            style: 'width: 100%; font-size: 14px;'
        };

        const formSettings = {
            requiredFieldIndicator: true,
            framework: 'semantq',
            placeholders: true,
            formContainerId: 'form-div'
        };

        // Initialize the form
        const form = new Formique(formSchema, formSettings, formParams);
    </script>
    ```

    **Note:** You can also use this instantiation with just the `formSchema`, leaving out the `formParams` and `formSettings`. This will apply the default dark theme and render the form inputs without the surrounding `<form>` element.

# Full Vanilla JS Implementation

```html

<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title> Formique Core - Full CDN Implementation </title>

  <!-- Formique CSS for styling -->
  <link rel="stylesheet" href="https://unpkg.com/formique-css@1.0.13/formique-css.css" />


 <script src="https://cdn.jsdelivr.net/npm/formique@1.0.12/formique.umd.min.js"></script>


  <!-- Initialize Formique via ES Module script -->
  <script type="module">

    /**
     * Form schema definition containing all form fields and their configurations
     * @type {Array<Array>}
     */
    const formSchema = [
      // Dynamic Single Select Field - Programming Languages
      [
        'dynamicSingleSelect',       // Input type (required)
        'languages',                 // Field name (required)
        'Programming Scope(Dynamic Select)-Programming Languages', // Labels
        { required: true },          // Validation rules
        {},                          // Field attributes
        
        // Dropdown Options
        [
          {
            id: 'frontend',          // Option group ID
            label: 'Front End',     // Option group label
            options: [               // Frontend language options
              { value: 'javascript', label: 'JavaScript' },
              { value: 'html', label: 'HTML' },
              { value: 'css', label: 'CSS' },
              { value: 'typescript', label: 'TypeScript' },
              { value: 'semantq', label: 'Semantq' },
              { value: 'svelte', label: 'Svelte' },
              { value: 'vue', label: 'Vue' },
              { value: 'react', label: 'React' },
              { value: 'angular', label: 'Angular' },
            ]
          },
          {
            id: 'backend',          // Option group ID
            label: 'Back End',       // Option group label
            options: [               // Backend language options
              { value: 'nodejs', label: 'Node.js' },
              { value: 'python', label: 'Python' },
              { value: 'java', label: 'Java' },
              { value: 'php', label: 'PHP' },
              { value: 'ruby', label: 'Ruby' },
              { value: 'csharp', label: 'C#' },
              { value: 'golang', label: 'Go' }
            ]
          },
          {
            id: 'server',            // Option group ID
            label: 'Server',        // Option group label
            options: [              // Server/database options
              { value: 'mysql', label: 'MySql' },
              { value: 'supabase', label: 'Supabase' },
              { value: 'MongoDB', label: 'Mongodb' },
              { value: 'sqlite', label: 'SQlite' },
            ]
          }
        ]
      ],

      // Conditionality Fields - disppaly fields based on input of a specific field
      [
        'singleSelect', 
        'role', 
        'Role (Select Conference Presenter to see conditionality)', 
        { required: true }, 
        { dependents: ['topic', 'mode'] },  // Fields that depend on this one
        [
          { value: 'conference attendee', label: 'Conference Attendee' },
          { value: 'conference presenter', label: 'Conference Presenter' }
        ]
      ],

      // Topic field - Text input (dependent on 'role' being 'conference presenter')
      [
        'text', 
        'topic', 
        'Topic', 
        {}, 
        { 
          dependsOn: 'role', 
          condition: 'conference presenter'  // (value) Simple string condition
        }
      ],

      // Mode field - Single Select (required, dependent on 'role')
      [
        'singleSelect', 
        'mode', 
        'Mode', 
        { required: true }, 
        { 
          dependsOn: 'role', 
          condition: (value) => value === 'conference presenter'  // Function condition
        },
        [
          { value: 'physical', label: 'Physical' },
          { value: 'virtual', label: 'Virtual' }
        ]
      ],

      // Standard input fields
      ['text', 'text_input', 'Text',{required: true},{'data-id': 'some-id'}],
      ['email', 'email_input', 'Email', {},{disabled: ''}], // boolean attributes
      ['number', 'number_input', 'Number',{required: true},{style: 'width: 100%;'}],
      ['password', 'password_input', 'Password'],
      ['tel', 'telephone_input', 'Telephone',{},{placeholder: '123-45-678', pattern: '[0-9]{3}-[0-9]{2}-[0-9]{3}'}],
      ['date', 'date_input', 'Date'],
      ['time', 'time_input', 'Time'],
      ['datetime-local', 'datetime_input', 'Datetime-local'],
      ['month', 'month_input', 'Month'],
      ['week', 'week_input', 'Week'],
      ['url', 'url_input', 'URL'],
      ['search', 'search_input', 'Search'],
      ['color', 'color_input', 'Color',{},{value: '#ff0056'}],
      ['file', 'file_input', 'File'],
      ['hidden', 'user_id', 'Hidden', {}, { value: '156' }],  // Hidden field with preset value
      ['image', 'image_input', 'Image', {}, { src: 'some_image.png' }],
      ['textarea', 'textarea_input', 'Textarea', {}, { rows: '4', cols: '6' }],
      
      // Radio button group
      ['radio', 'radio_input', 'Radio', {}, {}, [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'other', label: 'Other' }
      ]],
      
      // Checkbox group
      ['checkbox', 'checkbox_input', 'Checkbox', {}, {}, [
        { value: 'newsletter', label: 'Newsletter', selected: true },
        { value: 'updates', label: 'Updates' },
        { value: 'events', label: 'Events' }
      ]],
      
      // Single select dropdown
      ['singleSelect', 'location', 'Select (Single Option with East selected)', {}, {}, [
        { value: 'east', label: 'East', selected: true },
        { value: 'south', label: 'South' },
        { value: 'north', label: 'North' }
      ]],
      
      // Multiple select dropdown
      ['multipleSelect', 'diet', 'Diet (Multiple Select)', {}, {}, [
        { value: 'vegan', label: 'Vegan' },
        { value: 'vegetarian', label: 'Vegetarian' },
        { value: 'lacto-ovo', label: 'Lacto-ovo' }
      ]],
      
      // Additional fields
      ['submit', 'submit_input', 'Submit'],
    ];

    /**
     * Form settings configuration
     * @type {Object}
     */
const formSettings = {
  theme: 'dark-blue',               // [Optional] Name of visual theme
  themeColor: '#da42f5',             // [Optional] Overrides theme with a specific color
  submitOnPage: true,               // [Optional] If true, form submits without navigating away
  //submitMode: 'email',              // [Required if submitOnPage is true] 
  /*  sendTo: [
    'contacts@website.com',
    'admin@someentity.com'
  ],                                // [Required if submitMode is 'email'] List of recipient emails
  */
  //successMessage: 'Your registration details have been captured successfully!',
                                    // [Optional] Custom message to show on successful submission
  //errorMessage: 'There was an error in submitting your details. Please try again!',
                                    // [Optional] Custom error message
  //requiredFieldIndicator: true,     // [Optional] Show an asterisk (*) for required fields
  //framework: 'semantq',             // [Optional] Enables syntax transformations for Semantq and CSRF handling for Laravel
  //placeholders: true,               // [Optional] If true, use labels as placeholders
  formContainerId: 'myForm',      // ID of the form wrapper (default is 'formique' - no need to define formContainerId here if the container element is 'formique')
  //formContainerStyle: 'width: 100%; max-width: 700px; padding: 2rem;'
                                    // [Optional] Inline style for the form container
};

    /**
     * Form parameters and attributes
     * @type {Object}
     */
    const formParams = {
    method: 'POST',                    // [Required] HTTP method: 'GET' or 'POST'
    //action: 'submit.php',             // [Required] Form submission URL
    //id: 'myForm',                     // [Optional] Unique form ID
    //class: 'form',                    // [Optional] CSS class for styling
    //framework: 'semantq',             // [Optional] Enables Semantq syntax sugar (e.g., @change={handler})
    //style: 'width: 100%; font-size: 14px;', // [Optional] Inline CSS styling for the <form> element
    //enctype: 'multipart/form-data',   // [Optional] Required for file uploads
    //target: '_blank',                 // [Optional] Specifies where to display the response
    //novalidate: true,                 // [Optional] Disable HTML5 validation
    //accept_charset: 'UTF-8'           // [Optional] Character set (will render as accept-charset)
  };

    // Instantiate and render the form
    const form = new Formique(formSchema, formSettings, formParams);
  </script>
</head>

<body>
  <!-- Form container where Formique will inject the form -->
  <div id="myForm" class="width-half"></div>
</body>
</html>
```

When submit the filled form it will be submitted to the test `POST` api end point: `https://httpbin.org/post` - you can check the captured form data in your browser logs.


### Option B: Use Formique in a Node.js (Bundler) Environment

1. **Install Formique via npm:**

    ```bash
    npm install formique
    ```

2. **Import and Use Formique in Your JavaScript File:**

    ```javascript
    import Formique from 'formique';

    const formSchema = [
        // Define your schema as shown above...
    ];

    const formParams = {
        // Optional parameters...
    };

    const formSettings = {
        // Optional settings...
    };

    const form = new Formique(formSchema, formParams, formSettings);
    ```

---

### Other Formats

Formique is also available in additional formats like **ESM (ES Modules)** and **IIFE (Immediately Invoked Function Expression)** for specific use cases. For most projects, we recommend using **UMD** for browser contexts and **ESM** for Node.js environments. Refer to the Formique CDN for all available formats.

Include the CSS and import Formique in the head section of your HTML file as shown above. 


If you want use the provided `CSS` please include this CDN link in your page head section: 

`<!-- Formique CSS for styling -->
  <link rel="stylesheet" href="https://unpkg.com/formique-css@1.0.13/formique-css.css" />`

3. Define form container somewhere in the html body: 

```html
<div id="formique"></div>
```

4. Define your form parameters (formParams), form schema (formSchema) and then initialize Formique in script which should go before the ```html </body> ``` tag.
 
    ```html
    <script type="module">
        import Formique  from 'formique';

        const formParams = {
            method: 'post',
            action: 'submit.js',
            id: 'myForm',
            class: 'form',
            semantq: true,
            style: 'width: 100%; font-size: 14px;'
        };

        const formSchema = [
            ['text', 'name', 'Name', { required: true }],
            ['email', 'email', 'Email', { required: true }],
            [
                'singleSelect', 'diet', 'Dietary Requirements', {required: true}, {}, 
                [
                    {value: 'gluten-free', label: 'Gluten-free'},
                    {value: 'dairy-free', label: 'Dairy-free'},
                    {value: 'keto', label: 'Ketogenic'},
                    {value: 'low-carb', label: 'Low-carb'},
                    {value: 'pescatarian', label: 'Pescatarian'},
                    {value: 'halal', label: 'Halal'},
                    {value: 'kosher', label: 'Kosher'},
                    {value: 'vegetarian', label: 'Vegetarian'},
                    {value: 'lacto-ovo-vegetarian', label: 'Lacto-ovo-vegetarian'},
                    {value: 'raw-food', label: 'Raw food'},
                    {value: 'macrobiotic', label: 'Macrobiotic'},
                    {value: 'flexitarian', label: 'Flexitarian'}
                ]
            ],
            ['submit', 'submitButton', 'Submit'],
        ];

        const form = new Formique(formParams, formSchema);
        

    </script>
    ```

Formique can be used as either a UMD module with a simple `<script>` tag or as an ESM module via npm. 

# Form Schema Example


Here's an example of a form schema that defines various input fields with validation, attributes, binding syntax and options:

```javascript
const formSchema = [
  // Text Input Field
  [
    'text', 
    'firstName', 
    'First Name', 
    { minlength: 2, maxlength: 5, required: true, disabled: true }, // Validation options
    { value: "John", id: 'firstNameInput', class: 'form-input', style: 'width: 100%;', oninput: "incrementer()" }, // Attributes
  ],

  // URL Input Field
  [
    'url', 
    'websiteUrl', 
    'Website URL', 
    { required: true }, // Validation options
    { id: 'websiteUrlInput', class: 'form-control', style: 'width: 100%;', binding: 'bind:value'  }
  ],

  // Radio Input Field
  [
    'radio', 
    'gender', 
    'Gender', 
    { required: true }, // Validation options
    { id: 'genderRadio', class: 'form-radio-input', style: 'margin-left: 1rem;', onchange: 'actionFunction()' }
    [
      { value: 'male', label: 'Male' }, // Options
      { value: 'female', label: 'Female' },
      { value: 'other', label: 'Other' }
    ]
  ],

  // Checkbox Input Field
  [
    'checkbox', 
    'preferences', 
    'Preferences', 
    { required: true }, // Validation options
    { id: 'preferencesCheckbox', binding: '::preferences', class: 'form-checkbox-input', style: 'margin-left: 1rem;', onchange: 'submit' }
    [
      { value: 'news', label: 'Newsletter' }, // Options
      { value: 'updates', label: 'Product Updates' },
      { value: 'offers', label: 'Special Offers' }
    ]
  ],

  // Single Select Input Field
  [
    'singleSelect', 
    'colors', 
    'Colors', 
    { required: true }, // Validation options
    { id: 'colorsSelect', class: 'form-select-input', style: 'margin-left: 1rem;', onchange: 'trigger' }, // the onchange: 'trigger' format works with (framework: semantq) set in your formSettings object so that the syntax can be transformed as per framework specs 
    [
      { value: 'red', label: 'Red' }, // Options
      { value: 'green', label: 'Green' },
      { value: 'blue', label: 'Blue', selected: true }
    ]
  ],

  // Multiple Select Input Field
  [
    'multipleSelect', // Type of field
    'colors', // Name/identifier of the field
    'Colors', // Label of the field
    { required: true, min: 2, max: 3 }, // Validation options
    { id: 'colorsSelect', class: 'form-select-input', style: 'margin-left: 1rem;', onchange: 'alerter' }
    [
      { value: 'red', label: 'Red' }, // Options
      { value: 'green', label: 'Green' },
      { value: 'blue', label: 'Blue' },
      { value: 'yellow', label: 'Yellow' }
    ]
  ],

  // Submit Button
  [
    'submit',
    'submitButton',
    'Submit',
    {}, // Validation options
    { id: 'submitBtn', class: 'form-submit-btn', style: 'margin-top: 1rem; width: 100%;' } 
  ]
];

```

# Invoking the Formique Class

To create a form using Formique, you need to define the form parameters and schema. Below is an example of how to invoke the class with basic parameters, followed by a full list of possible parameters.

## Basic Form Parameters

```javascript
const formParams = {
  method: 'post', // HTTP method (e.g., 'get', 'post')
  action: 'submit.js', // Form submission URL
  id: 'myForm', // Unique identifier for the form
  class: 'form', // CSS class for styling
  semantq: true, // Whether to use semantq HTML elements
  style: 'width: 100%; font-size: 14px;' // Inline CSS styling
};

```


# Full List of Possible Form Parameters

```javascript
const formParams = {
  method: 'post', // HTTP method (e.g., 'get', 'post')
  action: 'submit.js', // Form submission URL
  id: 'myForm', // Unique identifier for the form
  class: 'form', // CSS class for styling
  framework: 'semantq', // this enables Semantq syntax sugar: i.e. attribute: onchange: 'handlerFunction' will be transformed to: @change={handlerFunction} if false or not defined completely the output would be regular html e.g.: onchange="handlerFunction()"
  style: 'width: 100%; font-size: 14px;', // Inline CSS styling
  enctype: 'multipart/form-data', // Encoding type for file uploads
  target: '_blank', // Where to open the form result (e.g., '_self', '_blank')
  novalidate: true, // Disable form validation
  accept_charset: 'UTF-8' // this will be transformed to: accept-charset: 'UTF-8' Character set for form data
};
```

## Explanation of Parameters

- **method**: Specifies the HTTP method to use when submitting the form ('get', 'post').
- **action**: The URL where the form data will be submitted.
- **id**: A unique identifier for the form.
- **class**: CSS class names applied to the form for styling purposes.
- **semantq**: Boolean value to add syntax sugar in the Semantq JS Framework use case. If set event handler attributes will be rendered in the format: @click={incrementer} 
- **style**: Inline CSS styling applied directly to the form element.
- **enctype**: Specifies how the form data should be encoded when submitted ('application/x-www-form-urlencoded', 'multipart/form-data', 'text/plain').
- **target**: Specifies where to display the response after submitting the form ('_self', '_blank', '_parent', '_top').
- **novalidate**: Disables form validation when set to true.
- **accept_charset**: Specifies the character encoding used for form data submission.

By customizing these parameters, you can control various aspects of the form's behavior and appearance.


# Complete List of Form Settings

The `formSettings` object allows you to customize the behavior and appearance of your form. Below is a comprehensive list of all possible settings:

# Form Settings

```javascript
const formSettings = {
  theme: "dark-blue", // Form theme: see section below on complete list of themes
  submitOnPage: true, // Enable form submission on the same page
  successMessage: "Your registration details have been captured successfully!", // Success message
  errorMessage: "There was an error in submitting your details. Please try again!", // Error message
  requiredFieldIndicator: true, // Display asterisk for required fields
  framework: 'semantq', // Specify framework (optional)
  placeholders: true, // Use labels as placeholders
  formContainerId: 'form-div', // Target container by ID (optional)
};
```

## Detailed Explanation of Form Settings

- **theme**: Defines the appearance of the form. Options include `"dark-blue"`, `"light"`, and more, allowing for customization based on your application's UI.

- **submitOnPage**: Controls whether the form submission should happen on the same page (`true`) - omit if you don't need this feature. 

- **successMessage**: The message displayed to the user after a successful form submission in the context of enabled submitOnPage. This can be customized to fit the context of the form. If submitOnPage is enabled and the successMessage parameter is not defined, Formique will display the default success message upon form submission: "Your details have been submitted successfully!"

- **errorMessage**: The message displayed when there is an error in form submission. The actual JSON response error is appended for detailed feedback. If submitOnPage is enabled and the errorMessage parameter is not defined, Formique will display the default error message upon form submission: "An error occurred while submitting the form. Please try again."

- **requiredFieldIndicator**: When set to `true`, a red asterisk (`*`) will appear next to fields marked as required, helping users easily identify mandatory fields.

- **framework**: Specifies the front-end framework used, such as `'semantq'`, `'svelte'`, `'vue'`, `'angular'`, or `'react'`. If you are not using any framework, this parameter can be omitted.

- **placeholders**: Enables labels to be shown as placeholders inside input fields, providing a cleaner look and saving space.

- **formContainerId**: Allows targeting a specific container by its ID where the form will be rendered. If the container ID is `'formique'`, this parameter can be omitted.

**All settings are optional:** You can use only the settings that are relevant to your needs.

Default Invocation: Just like the formParams object, if no formSettings object is provided, you can simply initialize Formique with the form schema as follows:

```javascript
const form = new Formique(formSchema);
```

## Installation Guide for Svelte

To implement Formique in your Svelte project please follow this guide: 
[https://www.npmjs.com/package/svelte-formique](Svelte Formique guide).



## Example HTML Output

```html
<div id="formique">
<form
  method="post"
  action="submit.js"
  id="myForm"
  class="form"
  semantq
  style="width: 100%; font-size: 14px;"
>
  <div class="input-block">
    <label for="firstNameInput">First Name</label>
    <input
      type="text"
      name="firstName"
      bind:value="firstName"
      id="firstNameInput"
      value="John"
      class="form-input"
      style="width: 100%;"
      @input={incrementer}
      minlength="2"
      maxlength="5"
      required
      disabled
    />
  </div>
  <div class="input-block">
    <label for="websiteUrlInput">Website URL</label>
    <input
      type="url"
      name="websiteUrl"
      bind:value="websiteUrl"
      id="websiteUrlInput"
      class="form-control"
      style="width: 100%;"
      required
    />
  </div>
  <fieldset class="radio-group">
    <legend>Gender</legend>
    <div>
      <input
        type="radio"
        name="gender"
        value="male"
        bind:value="gender"
        class="form-radio-input"
        style="margin-left: 1rem;"
        @change={actioner}
        id="genderRadio-male"
      />
      <label for="genderRadio-male">Male</label>
    </div>
    <div>
      <input
        type="radio"
        name="gender"
        value="female"
        bind:value="gender"
        class="form-radio-input"
        style="margin-left: 1rem;"
        @change={actioner}
        id="genderRadio-female"
      />
      <label for="genderRadio-female">Female</label>
    </div>
    <div>
      <input
        type="radio"
        name="gender"
        value="other"
        bind:value="gender"
        class="form-radio-input"
        style="margin-left: 1rem;"
        @change={actioner}
        id="genderRadio-other"
      />
      <label for="genderRadio-other">Other</label>
    </div>
  </fieldset>
  <fieldset class="checkbox-group">
    <legend>Preferences</legend>
    <div>
      <input
        type="checkbox"
        name="preferences"
        value="news"
        bind:checked="preferences"
        class="form-checkbox-input"
        style="margin-left: 1rem;"
        @change={submit}
        id="preferencesCheckbox-news"
      />
      <label for="preferencesCheckbox-news">Newsletter</label>
    </div>
    <div>
      <input
        type="checkbox"
        name="preferences"
        value="updates"
        bind:checked="preferences"
        class="form-checkbox-input"
        style="margin-left: 1rem;"
        @change={submit}
        id="preferencesCheckbox-updates"
      />
      <label for="preferencesCheckbox-updates">Product Updates</label>
    </div>
    <div>
      <input
        type="checkbox"
        name="preferences"
        value="offers"
        bind:checked="preferences"
        class="form-checkbox-input"
        style="margin-left: 1rem;"
        @change={submit}
        id="preferencesCheckbox-offers"
      />
      <label for="preferencesCheckbox-offers">Special Offers</label>
    </div>
  </fieldset>
  <fieldset class="form-select">
    <label for="colorsSelect">Colors</label>
    <select
      name="colors"
      bind:value="colors"
      id="colorsSelect"
      class="form-select-input"
      style="margin-left: 1rem;"
      @change={trigger}
      required
    >
      <option value="">Choose an option</option>
      <option value="red">Red</option>
      <option value="green">Green</option>
      <option value="blue" selected>Blue</option>
    </select>
  </fieldset>
  <fieldset class="form-select">
    <label for="colorsSelect">Colors</label>
    <select
      name="colors"
      bind:value="colors"
      id="colorsSelect"
      class="form-select-input"
      style="margin-left: 1rem;"
      @change={alerter}
      required
      multiple
    >
      <option value="red">Red</option>
      <option value="green">Green</option>
      <option value="blue">Blue</option>
      <option value="yellow">Yellow</option>
    </select>
  </fieldset>
  <input
    type="submit"
    id="submitBtn"
    value="Submit"
    class="form-submit-btn"
    style="margin-top: 1rem;"
  />
</form>
</div>
```


## Dynamic Drop-Down Schema

The `dynamicSingleSelect` input type in Formique is used for generating dynamic dropdowns based on predefined options. It allows you to define multi-level select options (e.g., categories and subcategories) that change based on user selections. Below is an example of the schema format for implementing dynamic drop-downs.


### Common Use Cases:

- **Country-State Dropdowns**: A common implementation where selecting a country dynamically updates the list of states/provinces.
- **Product Categories**: A dropdown where the first selection (e.g., a product category) updates the second dropdown to show relevant product subcategories.
- **Job Roles & Departments**: Selecting a department dynamically shows job roles related to that department (e.g., selecting "IT" shows job roles like "Software Developer", "Network Engineer", etc.).
- **Course & Subjects**: In educational systems, choosing a course can display relevant subjects or modules available for that course.
- **Location-Based Services**: When selecting a country or city, a second dropdown can list local services or offices relevant to the location chosen.


### Dynamic Drop Downs Schema Definition:

The code below goes into your 
```javascript
[
  'dynamicSingleSelect',       // Input type (required)
  'languages',                 // Field name (required)
  'Programming Scope-Programming Languages', // Labels for both primary drop down and secondary (dynamic) drop down seperated by a hyphen - e.g. Country-States
  { required: true },          // Validation rules (optional) but the curly braces {} must always be included  
  {},                          // Field attributes (optional) but the curly braces {} must always be included  
  
  // Dropdown Options
  [
    {
      id: 'frontend',           // Option group ID (required)
      label: 'Front End',       // Option group label (required)
      options: [                // List of options (required)
        { value: 'javascript', label: 'JavaScript' },
        { value: 'html', label: 'HTML' },
        { value: 'css', label: 'CSS' },
        { value: 'typescript', label: 'TypeScript' },
        { value: 'semantq', label: 'Semantq' },
        { value: 'svelte', label: 'Svelte' },
        { value: 'vue', label: 'Vue' },
        { value: 'react', label: 'React' },
        { value: 'angular', label: 'Angular' },
      ]
    },
    {
      id: 'backend',            // Option group ID (required)
      label: 'Back End',        // Option group label (required)
      options: [                // List of options (required)
        { value: 'nodejs', label: 'Node.js' },
        { value: 'python', label: 'Python' },
        { value: 'java', label: 'Java' },
        { value: 'php', label: 'PHP' },
        { value: 'ruby', label: 'Ruby' },
        { value: 'csharp', label: 'C#' },
        { value: 'golang', label: 'Go' }
      ]
    }
  ]
]
```


## Nested Conditionality Logic - Schema Definition

Formique allows for dynamic form generation with powerful conditional logic based on the values of other form fields. This allows you to create forms where the options in one field depend on the selection made in another field.

### Key Features:
- **Dynamic Field Display**: Show or hide fields based on previous selections.
- **Conditional Logic**: Use conditions such as specific values in other fields to control the availability of options or visibility of fields.
- **Multiple Dependencies**: Fields can have more than one dependents 

### Schema Definition Example:

The following schema demonstrates how to implement dynamic dropdowns with nested conditional logic in Formique.

```js
[
  // Role field - Single Select (required)
  ['singleSelect', 'role', 'Role', { required: true }, { dependents: ['topic', 'mode'] }, 
    // in the attributes object of the parent field add dependents (array) by field names to the dependents: item
    [
      { value: 'conference attendee', label: 'Conference Attendee' },
      { value: 'conference presenter', label: 'Conference Presenter' }
    ]
  ],

  // Topic field - Text input (dependent on 'role' being 'conference presenter')
  ['text', 'topic', 'Topic', {}, { dependsOn: 'role', condition: 'conference presenter' }],
  // in the attributes object of the child field add the dependsOn: 'role' item where the key is dependsOn: and the value is name of the parent field: e.g. 'role in this case'
  // also add the condition this way:  condition: 'conference presenter' 
  // you can use the string 'conference presenter' as the condition to be met
  // so this if the user select Conference Presenter in the role field - then dependents of that field (mode and topic) will be displayed. If the selected is changed to something else that doesn't meet the defined condtion - the dependents will be hidden. 

  // Mode field - Single Select (required, dependent on 'role' being 'conference presenter')
  ['singleSelect', 'mode', 'Mode', { required: true }, { dependsOn: 'role', condition: (value) => value === 'conference presenter' }, // you can use an arrow function to evaluate the condition - this is useful for more comprex evaluations 
    [
      { value: 'physical', label: 'Physical' },
      { value: 'virtual', label: 'Virtual' }
    ]
  ]
]
```

# ✨ Styling the Form 

Formique provides a robust and flexible system for styling forms, offering built-in themes, CSS classes for various components, and options for fine-grained customization of both form elements and the form container.


## Styling Form Elements

Formique offers several ways to style form elements, from predefined themes to custom CSS.

### Built-in Themes 

Formique includes a set of **headless and minimal** built-in themes primarily affecting the **submit button background** and the **bottom border of focused inputs**. Most themes maintain a **light background**, with the `dark` theme being an exception as it offers full dark background support.

**Available Themes:**

  * `light`
  * `dark`
  * `pink`
  * `indigo`
  * `dark-blue`
  * `light-blue`
  * `dark-orange`
  * `bright-yellow`
  * `green`
  * `purple`
  * `midnight-blush`
  * `deep-blue`
  * `blue`
  * `brown`
  * `orange`

To apply a theme, set the `theme` option in your `formSettings` object. If no theme is specified, Formique defaults to the `dark` theme.

```javascript
const formSettings = {
  theme: 'indigo' // Example: Applies the 'indigo' theme
};
```

### Fine-Grained Theme Control 

For precise control over the button and focus colors, use the `themeColor` option with a hexadecimal value.

```javascript
const formSettings = {
  themeColor: '#327ba8' // Overrides the button and focus color
};
```

### CSS Classes for Form Elements 🖌

Formique provides a set of default CSS classes for various form components, enabling consistent styling. These classes are predefined in the `formique.css` stylesheet, which developers can use directly or as a reference for custom CSS.

| Form Component                | Default Class Name      |
| :---------------------------- | :---------------------- |
| Wrapper (`div`) for Inputs    | `input-block`           |
| Input Fields                  | `form-input`            |
| Radio Button Groups           | `radio-group`           |
| Checkbox Groups               | `checkbox-group`        |
| Select Dropdowns              | `form-select`           |

You can override the default input class by defining your preferred class name within the input attributes object, e.g., `{ class: 'form-control' }`.

### Custom Styling with `.formique`-Scoped Classes

Formique exposes its internal CSS classes, allowing for complete customization. You can target the form using `.formique` and individual elements with classes like `.formique-input`, `.formique-label`, and `.formique-submit`.

```css
.formique-input {
  border-radius: 5px;
  padding: 10px;
}
```


## Styling and Sizing the Form Container

Formique renders within a container `<div>`, which offers flexible styling and sizing options.

### Default and Custom Container IDs

By default, Formique uses a `<div>` with the ID `formique`:

```html
<div id="formique" class=""></div>
```

You can specify a custom container ID using the `formContainerId` option in your `formSettings`:

```javascript
const formSettings = {
  formContainerId: 'myForm'
};
```

And in your HTML:

```html
<div id="myForm"> Your Form will be displayed here </div>
```

### Built-in Container Size Classes

Formique includes responsive width utility classes that can be applied directly to your form container:

| Class Name     | Description       |
| :------------- | :---------------- |
| `width-full`   | 100% width        |
| `width-half`   | 50% width         |
| `width-medium` | 600px fixed width |
| `width-small`  | 400px fixed width |

Example:

```html
<div id="formique" class="width-half"></div>
```

### Custom Inline Style Control 

For precise control over the container's inline styling, use the `formContainerStyle` setting. This will directly override the container's `style` attribute.

```javascript
const formSettings = {
  formContainerStyle: 'width: 100%; max-width: 700px; padding: 2rem;'
};
```

## Complete List of Formique CSS Classes

Here's an alphabetically grouped list of all unique CSS class selectors used in Formique for comprehensive customization:

### 📦 Container & Layout

  * `.formique`
  * `.formique-form`
  * `.width-custom`
  * `.width-full`
  * `.width-half`
  * `.width-medium`
  * `.width-small`

### 🏷️ Labels & Inputs

  * `.form-checkbox-input`
  * `.form-control`
  * `.form-input`
  * `.form-label`
  * `.form-radio-input`
  * `.form-select`
  * `.form-select-input`
  * `.form-textarea`

### 📚 Input Wrappers

  * `.checkbox-group`
  * `.input-block`
  * `.radio-group`

## Testing Form Submission with `submitOnPage`

For testing purposes, you can define the `method` as `"POST"` in the `formParams` object. This allows you to simulate and test form submissions using Formique's built-in functionality.

### Example:

```javascript
const formParams = {
    method: "POST",
    // other params
};
```

## Configuration Steps:

- **Omit the `action` parameter** in the `formSettings`. This way, Formique will serialize the form data upon submission and send it to the `https://httpbin.org/post` endpoint.

- **Console Logging**: The response, along with the actual form data, will be logged in the browser's console, allowing you to review and verify the submission process.

## How It Works:

- **Fetch API-Based Form Submission**: By omitting the `action` parameter, Formique uses the Fetch API to send the form data to `https://httpbin.org/post`. This sets up a functional testing environment where you can observe the data handling without needing an immediate backend setup.

- **Transition to Custom Endpoints**: Once you've tested the form submission, you can define your own `action` URL or endpoint in the `formParams` object. This allows you to direct the form data to your specified backend and handle it according to your application's needs.

### Example for Custom Endpoint:

```javascript
const formParams = {
    method: "POST", // OR GET, ETC 
    action: "https://your-custom-endpoint.com/submit"
};
```
This approach helps you smoothly transition from testing to production, giving you control over where and how your form data is processed.

### Inline Styling

In addition to external stylesheets, individual form elements can be styled directly via attributes specified in the form schema. This allows for fine grained control (inline styling) over the appearance of each element. 

# Other Implementation Guide

## Implementing Formique in Vue.js  
For Vue-specific integration details, check out the [Vue.js Guide](docs/vue-guide.md).


## Contribute

Formique is an open-source project. Contributions, issues, and feature requests are welcome!

## License

Formique is licensed under the MIT License.

## Keywords

Javascript forms, declarative form syntax, js form library, formique
[ View Formique Complete CDN Implementation - All Fields](docs/AllFields.md)

[![Get Started with Formique](https://img.shields.io/badge/Get_Started-FormiqueJS-blue)](https://www.formiquejs.com)

