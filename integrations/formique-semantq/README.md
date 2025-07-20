# Formique-Semantq


<div align="center">
  <p align="center">
    <a href="https://bundlephobia.com/result?p=formique-semantq">
      <img src="https://img.shields.io/bundlephobia/minzip/formique-semantq?style=for-the-badge" alt="npm size badge" />
    </a>
    <a href="https://formiquejs.com">
      <img src="https://img.shields.io/badge/website-formiquejs.com-blue.svg?style=for-the-badge" alt="Website badge" />
    </a>
  </p>
</div>




<!--
[![npm downloads](https://img.shields.io/npm/dm/formique-semantq.svg?style=for-the-badge)](https://www.npmjs.com/package/formique-semantq)

[![npm](https://img.shields.io/npm/dt/formique-semantq.svg?style=for-the-badge)](https://www.npmjs.com/package/formique-semantq)

[![Coverage Status](https://img.shields.io/coveralls/github/Gugulethu-Nyoni/formique-semantq/master?style=for-the-badge)](https://coveralls.io/github/Gugulethu-Nyoni/formique-semantq?branch=master)
-->


<img src="https://github.com/Gugulethu-Nyoni/formique/blob/main/images/formique-js-form-builder-anyframework.png" alt="Formique JS Form Builder Example">


## About Formique Semantq

Formique Semantq is a native Semantq JS framework Schema Defintion Language (SDL) and Formique Form Definition Language (Low Code). The library is a robust and elegant Web Content Accessibility Guidelines (WCAG) and Web Accessibility Initiative – Accessible Rich Internet Applications (WAI-ARIA) compliant form-building library tailored for JavaScript enthusiasts. It supports a wide array of input types, features JavaScript-driven themes, and offers advanced functionalities like nested conditional logic and dynamic dropdowns. Highly customizable and extensible, Formique is built for the Semantq JS Framework but integrates seamlessly with Vanilla JS, Semantq, Semantq, and Vue. This guide covers implementing Formique in Semantq.

## Features

- **Declarative Syntax**: Define forms using a simple and intuitive schema.
- **Wide Range of Inputs**: Supports text, email, number, password, date, time, file uploads, and more.
- **Validation and Attributes**: Easily specify validation rules and attributes for each form field.
- **Dynamic Form Generation**: Generate forms dynamically based on your schema.
- **Framework Agnostic**: Currently works with Semantq and Vanilla JS (more frameworks to be added).
- **Accessibility and Usability Compliant**: Formique yields form markup compliant with WCAG.
- **Mobile Responsive**: Forms are mobile responsive out of the box.
- **Nested Dynamic Conditional Logic**: Implement complex conditional logic to show or hide form fields based on user input.
- **Dynamic Dropdowns**: Create dropdowns whose options change dynamically based on other field selections.
- **JavaScript-Driven Themes**: Apply themes dynamically using JavaScript for a customizable user interface.
- **WAI-ARIA and WCAG-Compliant HTML**: Ensure all form elements are accessible and meet WCAG standards.
- **Progressive Enhancement**: Forms function with or without JavaScript, ensuring accessibility and functionality across all environments.

## How to Install Formique in Semantq

### Step 1: Install Semantq

Create a new Semantq project using the following commands:

```bash
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

#### Select the following options:

- **SemantqKit minimal** (optional but preferred)
- **Type checking with TypeScript** (optional but preferred)
- **ESLint** (optional but preferred)
- **npm** (required)


> **Note:** Always refer to the latest official Semantq guide on how to create a Semantq app, as this may change. [Semantq Documentation: Creating a Project](https://Semantq.dev/docs/kit/creating-a-project)


## Developing

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```


## Demo: Creating a New Route in Semantq for Formique

### Step 1: Create a New Route

For demo purposes, let's create a new route (page) in `src/routes/registration`.

1. **Create the Route**:
   - Create a new directory for the route:
     ```bash
     mkdir src/routes/registration
     ```

2. **Create the Semantq Page**:
   - Inside the route directory, create a new Semantq page:
     ```bash
     touch src/routes/registration/+page.Semantq
     ```

## Step 2: Add the CSS (Optional)

The NPM option:  

```javascript
npm i formique-css
```

```javascript
import 'formique-css';
```

The CDN Option:

Include this inside the @head .. @end block of page layout file: `@layout.smq`

```html
<link rel="stylesheet" href="https://unpkg.com/formique-css@1.0.11/formique-css.css" />
```


**Note:** The provided Formique CSS is optional. Formique will function fully without it, allowing you full flexibility to apply your own styles. However, for convenience, a set of default class names is available to help you quickly style form containers, form elements, and input types. See the sections below for a complete list of available class names.

## Step 3: Install `@formique/semantq`

To use Formique in your Semantq application, you need to install the `formique-semantq` package.


```bash
npm i @formique/semantq
```

### Step 4: Implement the Form in `+page.Semantq`

Add the following code to +page.Semantq:


```Semantq
<script>
  import { onMount } from 'Semantq';
  import Formique from '@formique/semantq';

  // Define the form schema
  const formSchema = [
    ['text', 'name', 'Name', { required: true }],
    ['text', 'surname', 'Surname', { required: true }],
    ['email', 'email', 'Email', { required: true }],
    ['singleSelect', 'title', 'Title', { required: true }, { dependents: ['status'] },
      [
        { value: 'mr', label: 'Mr' },
        { value: 'ms', label: 'Ms' },
        { value: 'mrs', label: 'Mrs' },
        { value: 'dr', label: 'Dr' },
        { value: 'prof', label: 'Prof' }
      ]
    ],
    ['singleSelect', 'status', 'Status', { required: true }, { dependsOn: 'title', condition: 'prof' },
      [
        { value: 'full professor', label: 'Full Professor' },
        { value: 'associate professor', label: 'Associate Professor' }
      ]
    ],
    ['submit', 'submit', 'Submit', {}, { style: 'width: 100%;' }],
  ];

  // Define form parameters
  const formParams = {
    id: "regForm",
    method: "POST",
  };

  // Define form settings
  const formSettings = {
    submitOnPage: true,
    theme: "midnight-blush",
    requiredFieldIndicator: true,
    placeholders: true,  
  };

  // Initialize the form on component mount
  onMount(() => {
    const form = new Formique(formSchema, formParams, formSettings);
  });
</script>

<!-- Target element where the form will be inserted -->
<div id="formique"></div>
```
## Step 5: View the Form

To see the form in your browser, run the following command:

```bash
npm run dev
```

Once the server is running, you can view the form at:

http://localhost:5173/registration


## ✨ 1. Styling the Form

Formique comes with a set of built-in themes to help you quickly style your forms. These themes are **headless and minimal**, allowing easy blending with your site's design system. They apply styling **primarily to the submit button background** and **the bottom border of focused inputs**, while maintaining a **light background** for most themes.

### Available Built-in Themes:

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

> ⚠️ The `dark` theme is more opinionated with full dark background support. All others are intentionally minimal.

To apply a theme, set the `theme` option in your `formSettings`:

```js
const formSettings = {
  theme: 'indigo'
};
```
If no theme is set, Formique will default to the dark theme. 

### Fine-Grained Theme Control

To override the button and focus color with your own custom color, use the `themeColor` option in hexadecimal format:

```js
const formSettings = {
  themeColor: '#327ba8'  // Must be a valid hex value
};
```

### Custom Styling

Formique’s form classes are exposed for complete customization. You can target the form using `.formique`, and inputs with classes like `.formique-input`, `.formique-label`, `.formique-submit`. See section below.

Example:

```css
.formique-input {
  border-radius: 5px;
  padding: 10px;
}
```


## 2. Styling and Sizing the Form Container

Formique renders inside a container `<div>` that you specify by ID.

### Default Container

```html
<div id="formique" class=""></div>
```

### ⚙Custom Container ID

You can use any custom container ID by declaring it in your `formSettings`:

```js
const formSettings = {
  formContainerId: 'myForm'
};
```

And in your HTML:

```html
<div id="myForm"></div>
```

### Built-in Container Size Classes

Formique includes several responsive width utility classes that can be used directly on your form container:

| Class Name     | Description       |
| -- | -- |
| `width-full`   | 100% width        |
| `width-half`   | 50% width         |
| `width-medium` | 600px fixed width |
| `width-small`  | 400px fixed width |

Example:

```html
<div id="formique" class="width-half"></div>
```

### Custom Inline Style Control

If you want precise control over the container styling, use the `formContainerStyle` setting:

```js
const formSettings = {
  formContainerStyle: 'width: 100%; max-width: 700px; padding: 2rem;'
};
```

> This will override the container’s `style` attribute directly.




## ✅ Complete List of `.formique`-Scoped CSS Classes

Here is a clean, alphabetically grouped list of **all unique CSS class selectors** used in your Formique stylesheet:

### 📦 Container & Layout

* `.formique`
* `.formique-form`
* `.width-full`
* `.width-half`
* `.width-medium`
* `.width-small`
* `.width-custom`

### 🏷️ Labels & Inputs

* `.form-label`
* `.form-input`
* `.form-control`
* `.form-textarea`
* `.form-select`
* `.form-select-input`
* `.form-radio-input`
* `.form-checkbox-input`

### 📚 Input Wrappers

* `.input-block`
* `.radio-group`
* `.checkbox-group`

### 🎨 Themes

* `.custom-theme`
* `.dark-theme`
* `.light-theme`
* `.pink-theme`
* `.indigo-theme`
* `.dark-blue-theme`
* `.light-blue-theme`
* `.dark-orange-theme`
* `.bright-yellow-theme`
* `.green-theme`
* `.purple-theme`
* `.midnight-blush-theme`
* `.deep-blue-theme`
* `.blue-theme`
* `.brown-theme`
* `.orange-theme`

### 🚀 Button

* `.form-submit-btn`

### 🔁 Loading

* `#formiqueSpinner`
* `.formique-spinner`
* `.formique-spinner .message`

### Status Messages

* `.formique-success`
* `.formique-error`



## 📬 3. Contact Form Quick Setup

Formique supports plug-and-play email contact forms using `@formique/semantq`.

### 🔧 Basic Email Contact Setup

```js
const formSettings = {
  submitMode: 'email',                  // Required
  submitOnPage: true,                   // Required
  successMessage: 'Survey filled successfully',  // Optional
  errorMessage: 'Something went wrong',         // Optional
  sendTo: ['contacts@yourwebsite.com']  // Your actual email
};
```

### 📑 Defining a Form Schema

Create your form fields using a simple schema array:

```js
const formSchema = [
  ['text', 'name', 'Name', { required: true }],
  ['text', 'surname', 'Surname', { required: true }],
  ['email', 'email', 'Email', { required: true }, { style: 'color: red' }],
  ['textarea', 'message', 'Your Message here', { required: true }]
];
```

### Schema Syntax Recap

Each form field follows this format:

```js
['field type', 'field name', 'Label', { inlineValidation }, { inputAttributes }, [options]]
```

Examples:

* `text`, `email`, `textarea`, `select`, `checkbox`, `radio`
* Inline validation can include `{ required: true }`
* Additional HTML attributes (like `style`, `placeholder`, etc.) are supported.


## ⚠️ Domain Verification for Email Submissions

To enable email submissions, ensure your domain is **registered on your [useformique.com](https://useformique.com) account**.

This is required for sender verification and spam protection.


For more comprehensive details on Formique's features and usage and options visit the [Formique GitHub Repository](https://github.com/Gugulethu-Nyoni/formique).

