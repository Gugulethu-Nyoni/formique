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
- Submit: ```html <input type="submit"> ```




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



Here's the updated README content in markdown format with the two options for using Formique as a UMD and an ESM module:

```markdown
## Installation

There are two ways to install and use Formique in your project:

## Option A: Use Formique as a UMD Module

1. Include the CSS and JavaScript in the head section of your HTML file:

    ```html
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/formique-css@1.0.1/formique.min.css">
    ```

2. Insert the js script tag just before the closing tag ```html </body> ``` of your html file.

    ```html
    <script src="https://cdn.jsdelivr.net/npm/formique@1.0.1/formique.umd.js"></script>
    ```
## Usage Example

1. Define form container somewhere in the html body: 

```html
<div id="formique"></div>
```


2. Define your form parameters (formParams), form schema (formSchema) and then initialize Formique in script which should go below this script tag : ```html
    <script src="https://cdn.jsdelivr.net/npm/formique@1.0.1/formique.umd.js"></script>
    ```

    ```html
    <script src="https://cdn.jsdelivr.net/npm/formique@1.0.1/formique.umd.js"></script>

    <script>
        const formParams = {
            method: 'post',
            action: 'submit.js',
            id: 'myForm',
            class: 'form',
            semantq: true,
            style: 'width: 100%; font-size: 14px;'
        };

        const formSchema = [
            ['text', 'name', 'Name', { required: true }, {}, ''],
            ['email', 'email', 'Email', { required: true }, {}, ''],
            [
                'singleSelect', 'diet', 'Dietary Requirements', {required: true}, {}, '', 
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
            ['submit', 'submitButton', 'Submit', {}, {}, '']
        ];


       (function(formParams, formSchema) {
        const form = new Formique(formParams, formSchema);
        const formHTML = form.renderFormHTML();
        })(formParams, formSchema);

    </script>
    // </body>
    ```

## Option B: Use Formique as an ESM Module

1. Install Formique via npm:

    ```bash
    npm install formique
    ```

2. Include the CSS and import Formique in the head section of your HTML file:

    ```html
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/formique-css@1.0.1/formique.min.css">
    ```
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
            ['text', 'name', 'Name', { required: true }, {}, ''],
            ['email', 'email', 'Email', { required: true }, {}, ''],
            [
                'singleSelect', 'diet', 'Dietary Requirements', {required: true}, {}, '', 
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
            ['submit', 'submitButton', 'Submit', {}, {}, ''],
        ];

        const form = new Formique(formParams, formSchema);
        const formHTML = form.renderFormHTML();

    </script>
    ```

Formique can be used as either a UMD module with a simple `<script>` tag or as an ESM module via npm. 
```

# Form Schema Example


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

In your html, place this markup as placegolder for where the form will be rendered.

```html

<div id="formique"></div>

```

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

## Styling the Form

Formique provides a set of CSS classes to facilitate the styling of various form elements. The default class names for different form components are as follows:

- **Wrapper for Input Elements:** `input-block`
- **Input Fields:** `form-input`
- **Radio Button Groups:** `radio-group`
- **Checkbox Groups:** `checkbox-group`
- **Select Dropdowns:** `form-select`

These classes are predefined in the `formique.css` stylesheet. Developers can either use this stylesheet for consistent styling or create their own custom CSS based on these class names to suit their design preferences.

### Customizing Styles

1. **Using Default Styles:** Apply the `formique.css` stylesheet to leverage the default styling provided by Formique.
2. **Custom CSS:** If you prefer custom styling, you can override the default styles by defining your own CSS rules for the above class names.

### Inline Styling

In addition to external stylesheets, individual form elements can be styled directly via attributes specified in the form schema. This allows for precise control over the appearance of each element without needing additional CSS files.

By utilizing these options, you can easily adapt the look and feel of your form to meet your project's design requirements.


## Contribute

Formique is an open-source project. Contributions, issues, and feature requests are welcome!

## License

Formique is licensed under the MIT License.

## Keywords

Javascript datatables.