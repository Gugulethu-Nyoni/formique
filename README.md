# Formique

<!-- <img src="https://github.com/thincmedia/anyGridJs/blob/main/images/anyGridJs_Example.png" alt="anyGridJs Example"> --> 


Formique: A lightweight, declarative JavaScript library for generating forms. Suited for vanilla js needs and Semantq JS framework. Formique simplifies the process of creating and managing forms with a variety of input types, built-in validation, and customizable attributes. Open-source &amp; MIT licensed.

## Key Features

  - Declarative Syntax: Define forms using a simple and intuitive schema.
  - Wide Range of Inputs: Supports text, email, number, password, date, time, file uploads, and more.
  - Validation and Attributes: Easily specify validation rules and attributes for each form field.
  - Dynamic Form Generation: Generate forms dynamically based on your schema.
  - Framework Agnostic: Currently works Semantq and vanilla JS.



## Why Choose Formique?

   - Vanilla JS: No dependencies; works seamlessly with vanilla JS or any JS framework.
   - Lightweight: Minimal footprint optimized for performance.
   - Customizable: Adapt the library to fit your project's unique needs.
   - Declarative: Define forms with a straightforward schema for better readability and maintainability.


## Form Input Types Covered

   - Text: <input type="text">
   - Email: <input type="email">
   - Number: <input type="number">
   - Password: <input type="password">
   - Telephone: <input type="tel">
   - Date: <input type="date">
   - Time: <input type="time">
   - Datetime-local: <input type="datetime-local">
   - Month: <input type="month">
   - Week: <input type="week">
   - URL: <input type="url">
   - Search: <input type="search">
   - Color: <input type="color">
   - File: <input type="file">
   - Hidden: <input type="hidden">
   - Image: <input type="image">
   - Textarea: <textarea>
   - Radio: <input type="radio">
   - Checkbox: <input type="checkbox">
   - Select (Single & Multiple): <select>
   - Submit: <input type="submit">



# How to Write Form Schema

The form schema is an array of field definitions. Each field is defined by an array containing:

## Input Definition
- **Type**: The input type (e.g., 'text', 'email', 'radio').
- **Name**: The name attribute for the input.
- **Label**: The label for the input.

## Input Validation
- **Validation**: Object specifying validation rules. This can include:
  - **Required**: Boolean to specify if the field is mandatory.
    - Example: `required: true`
  - **MinLength**: Specifies the minimum number of characters allowed.
    - Example: `minlength: 5`
  - **MaxLength**: Specifies the maximum number of characters allowed.
    - Example: `maxlength: 50`
  - **Pattern**: A regex pattern the input must match.
    - Example: `pattern: /^[A-Za-z0-9]+$/`
  - **Custom**: Function for custom validation logic.
    - Example: `custom: value => value.startsWith('A')`

## Input Attributes
- **Attributes**: Object specifying additional attributes like `id`, `class`, `style`, etc.
  - Example: `attributes: { id: 'username', class: 'form-control' }`

## Binding
- **Binding**: Optional binding syntax for dynamic data. It can use `bind:value` or `::inputName`.
  - Example: `binding: 'bind:value'` or `binding: '::username'`

## Options
- **Options**: For select, radio, and checkbox inputs. This is an array of options, each with a `value` and `label`.
  - Example: `options: [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }]`



## Usage Example


There are two ways to use install Formique in your project

## Option A: Clone the GitHub repo:

1. go to your terminal and run:

```bash
git clone https://github.com/Gugulethu-Nyoni/formique.git

````
2. now you can use anygridjs this way in your html file

```html

<link rel="stylesheet" href="./formique/formique.css">

```

```html

<script type="module">

  import { Formique } from './formique/formique.js';

</script>

```


## Option B: Via npm

### Installation 


1. go to your terminal and run:

```bash

npm install formique

````

2. now you can use formique this way in your html file

```html

<link rel="stylesheet" href="./node_modules/formique/formique.css">

```

```html

<script type="module">

  import { Formique } from './node_modules/formique/formique.js';

  // rest of js code (app.js) can come here e.g. data object, column definition etc ( see below)

</script>

```


# Example Usage 

## Form Schema

Here's an example of a form schema that defines various input fields with validation, attributes, options, and binding syntax:

```javascript
const formSchema = [
  // Text Input Field
  [
    'text', 
    'firstName', 
    'First Name', 
    { minlength: 2, maxlength: 5, required: true, disabled: true }, // Validation options
    { value: "John", id: 'firstNameInput', class: 'form-input', style: 'width: 100%;', oninput: "incrementer()" }, // Attributes
    '::firstName' // Binding syntax
  ],

  // URL Input Field
  [
    'url', 
    'websiteUrl', 
    'Website URL', 
    { required: true }, // Validation options
    { id: 'websiteUrlInput', class: 'form-control', style: 'width: 100%;' }, // Attributes
    'bind:value' // Binding syntax
  ],

  // Radio Input Field
  [
    'radio', 
    'gender', 
    'Gender', 
    { required: true }, // Validation options
    { id: 'genderRadio', class: 'form-radio-input', style: 'margin-left: 1rem;', onchange: 'actioner()' }, // Attributes
    '::gender', // Binding syntax
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
    { id: 'preferencesCheckbox', class: 'form-checkbox-input', style: 'margin-left: 1rem;', onchange: 'submit' }, // Attributes
    '::preferences', // Binding syntax
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
    { id: 'colorsSelect', class: 'form-select-input', style: 'margin-left: 1rem;', onchange: 'trigger' }, // Attributes
    '::colors', // Binding syntax
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
    { id: 'colorsSelect', class: 'form-select-input', style: 'margin-left: 1rem;', onchange: 'alerter' }, // Attributes
    '::colors', // Binding syntax
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
    { required: true }, // Validation options
    { id: 'submitBtn', class: 'form-submit-btn', style: 'margin-top: 1rem;' } // Attributes
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
  semantq: true, // Whether to use semantic HTML elements
  style: 'width: 100%; font-size: 14px;' // Inline CSS styling
};

const form = new Formique(formParams, formSchema);
const formHTML = form.renderFormHTML();
console.log(formHTML);
```



# Full List of Possible Form Parameters

```javascript
const formParams = {
  method: 'post', // HTTP method (e.g., 'get', 'post')
  action: 'submit.js', // Form submission URL
  id: 'myForm', // Unique identifier for the form
  class: 'form', // CSS class for styling
  semantq: true, // if true it enables Semantq syntax sugar: i.e. attribute: onchange: 'handlerFunction' will be transformed to: @change={handlerFunction} if false or not defined completely the output would be regular html e.g.: onchange="handlerFunction()"
  style: 'width: 100%; font-size: 14px;', // Inline CSS styling
  enctype: 'multipart/form-data', // Encoding type for file uploads
  target: '_blank', // Where to open the form result (e.g., '_self', '_blank')
  novalidate: true, // Disable form validation
  accept_charset: 'UTF-8' // this will be transformed to: accept-charset: 'UTF-8'  Character set for form data
};
```

## Explanation of Parameters

- **method**: Specifies the HTTP method to use when submitting the form ('get', 'post').
- **action**: The URL where the form data will be submitted.
- **id**: A unique identifier for the form.
- **class**: CSS class names applied to the form for styling purposes.
- **semantq**: Boolean value indicating whether to use semantic HTML elements (e.g., `<fieldset>`, `<legend>`).
- **style**: Inline CSS styling applied directly to the form element.
- **enctype**: Specifies how the form data should be encoded when submitted ('application/x-www-form-urlencoded', 'multipart/form-data', 'text/plain').
- **target**: Specifies where to display the response after submitting the form ('_self', '_blank', '_parent', '_top').
- **novalidate**: Disables form validation when set to true.
- **accept_charset**: Specifies the character encoding used for form data submission.

By customizing these parameters, you can control various aspects of the form's behavior and appearance.



## HTML 

```html

<div id="formique"></div>

```

## Contribute

Formique is an open-source project. Contributions, issues, and feature requests are welcome!

## License

Formique is licensed under the MIT License.

## Keywords

Javascript datatables.