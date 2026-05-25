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

<img src="https://github.com/Gugulethu-Nyoni/formique/blob/main/images/formique-js-form-builder-anyframework.png" alt="Formique JS Form Builder Example">

## Table of Contents

- [About Formique Semantq](#about-formique-semantq)
- [Features](#features)
- [Installation](#how-to-install-formique-in-semantq)
- [Quick Start](#demo-creating-a-new-route-in-semantq-for-formique)
- [Form Schema Guide](#form-schema-guide)
  - [Standard Input Fields](#standard-input-fields)
  - [Radio & Checkbox Groups](#radio--checkbox-groups)
  - [Select Dropdowns](#select-dropdowns)
  - [Dynamic Single Select](#dynamic-single-select)
  - [HTML Content Blocks ✨ New](#html-content-blocks)
  - [Conditional Logic](#conditional-logic)
- [Styling Guide](#-1-styling-the-form)
  - [Built-in Themes](#available-built-in-themes)
  - [Custom Theme Colors](#fine-grained-theme-control)
  - [Container Sizing](#2-styling-and-sizing-the-form-container)
  - [Complete CSS Classes](#-complete-list-of-formique-scoped-css-classes)
- [Email Forms](#-3-contact-form-quick-setup)
- [Domain Verification](#⚠️-domain-verification-for-email-submissions)

## About Formique Semantq

Formique Semantq is a native Semantq JS framework Schema Definition Language (SDL) and Formique Form Definition Language (Low Code). The library is a robust and elegant Web Content Accessibility Guidelines (WCAG) and Web Accessibility Initiative – Accessible Rich Internet Applications (WAI-ARIA) compliant form-building library tailored for JavaScript enthusiasts. It supports a wide array of input types, features JavaScript-driven themes, and offers advanced functionalities like nested conditional logic and dynamic dropdowns. Highly customizable and extensible, Formique is built for the Semantq JS Framework but integrates seamlessly with Vanilla JS, Semantq, and Vue. This guide covers implementing Formique in Semantq.

## Features

- **Declarative Syntax**: Define forms using a simple and intuitive schema.
- **Wide Range of Inputs**: Supports text, email, number, password, date, time, file uploads, and more.
- **HTML Content Blocks**: Insert custom HTML or plain text anywhere in your form.
- **Validation and Attributes**: Easily specify validation rules and attributes for each form field.
- **Dynamic Form Generation**: Generate forms dynamically based on your schema.
- **Framework Agnostic**: Currently works with Semantq and Vanilla JS (more frameworks to be added).
- **Accessibility and Usability Compliant**: Formique yields form markup compliant with WCAG.
- **Mobile Responsive**: Forms are mobile responsive out of the box.
- **Nested Dynamic Conditional Logic**: Implement complex conditional logic to show or hide form fields based on user input.
- **Dynamic Dropdowns**: Create dropdowns whose options change dynamically based on other field selections.
- **JavaScript-Driven Themes**: Apply themes or theme colors dynamically using JavaScript for a customizable user interface.
- **WAI-ARIA and WCAG-Compliant HTML**: Ensure all form elements are accessible and meet WCAG standards.
- **Progressive Enhancement**: Forms function with or without JavaScript, ensuring accessibility and functionality across all environments.

## How to Install Formique in Semantq

### Step 1: Install Semantq

Create a new Semantq project using the following commands:

```bash
# install semantq globally 
npm i -g semantq

# create a new project in my-app
semantq create my-app
```

> **Note:** Always refer to the latest official Semantq guide on how to create a Semantq app, as this may change. [Semantq Documentation: Creating a Project](https://github.com/Gugulethu-Nyoni/semantq)

### Step 2: Install Formique

```bash
npm i @formique/semantq
```

### Step 3: CSS Styling (Optional)

Formique now **automatically injects its internal styles** by default - no additional CSS files needed! The library handles styling internally with built-in themes and CSS variables.

#### Using Built-in Styles (Default)

Formique automatically applies its styling system. Just use the `theme` or `themeColor` options in your `formSettings`:

```javascript
const formSettings = {
  theme: 'midnight-blush',  // Apply a built-in theme
  // OR use a custom color:
  themeColor: '#4338ca'      // Override with your own hex color
};
```

#### Disabling Default Styles

If you prefer to use your **own custom CSS**, you can disable Formique's internal styles:

```javascript
const formSettings = {
  disableStyles: true,  // Prevents internal CSS injection
  // Now you can provide your own CSS file or styles
};
```

When `disableStyles: true` is set, Formique will not inject any styles, giving you complete control over the form's appearance. You can then link your own CSS file:

```html
<!-- Your custom CSS -->
<link rel="stylesheet" href="/path/to/your-custom-form-styles.css" />
```

#### Why This Change?

- **Zero configuration**: Forms look great out of the box
- **Reduced dependencies**: No need to manage separate CSS packages
- **Better performance**: Styles are injected efficiently
- **Theming flexibility**: Built-in themes and CSS variables work seamlessly
- **Opt-out option**: Full control when you need it
- **Eliminates FOUC (Flash of Unstyled Content)**: Styles are injected before form rendering, ensuring the form appears fully styled immediately

## Demo: Creating a New Route in Semantq for Formique

### Step 1: Create a New Route

```bash
semantq make:route registration
```

### Step 2: Implement the Form

```
@script
  import Formique from '@formique/semantq';

  const formSchema = [
    ['text', 'name', 'Name', { required: true }],
    ['text', 'surname', 'Surname', { required: true }],
    ['email', 'email', 'Email', { required: true }],
    ['submit', 'submit', 'Submit', {}, { style: 'width: 100%;' }],
  ];

  const formParams = {
    id: "regForm",
    method: "POST",
  };

  const formSettings = {
    submitOnPage: true,
    theme: "midnight-blush",
    requiredFieldIndicator: true,
    placeholders: true,  
  };

  $onMount(() => {
    const form = new Formique(formSchema, formParams, formSettings);
  });
@end

@html
<div id="formique"></div>
```

## Form Schema Guide

Formique uses a simple, intuitive array-based schema to define forms. Each field follows this format:

```javascript
[type, name, label, validation, attributes, options]
```

### Standard Input Fields

```javascript
[
  ['text', 'username', 'Username', { required: true, minlength: 3 }],
  ['email', 'user_email', 'Email Address', { required: true }],
  ['password', 'user_pass', 'Password', { required: true, minlength: 8 }],
  ['number', 'age', 'Age', { min: 18, max: 99 }],
  ['tel', 'phone', 'Phone Number', { pattern: '[0-9]{3}-[0-9]{3}-[0-9]{4}' }],
  ['date', 'dob', 'Date of Birth'],
  ['time', 'appointment', 'Appointment Time'],
  ['color', 'fav_color', 'Favorite Color', {}, { value: '#ff0056' }],
  ['file', 'avatar', 'Profile Picture', { accept: 'image/*' }],
  ['textarea', 'bio', 'Biography', { maxlength: 500 }, { rows: 5 }],
  ['url', 'website', 'Personal Website'],
  ['search', 'search', 'Search'],
]
```

### Radio & Checkbox Groups

```javascript
// Radio buttons (single selection)
[
  'radio', 'gender', 'Gender', { required: true }, {}, [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' }
  ]
],

// Checkbox group (multiple selection)
[
  'checkbox', 'interests', 'Interests', {}, {}, [
    { value: 'coding', label: 'Coding', selected: true },
    { value: 'design', label: 'Design' },
    { value: 'music', label: 'Music' }
  ]
]
```

### Select Dropdowns

```javascript
// Single select
[
  'singleSelect', 'country', 'Country', { required: true }, {}, [
    { value: 'us', label: 'United States', selected: true },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'ca', label: 'Canada' }
  ]
],

// Multiple select
[
  'multipleSelect', 'skills', 'Skills', { required: true }, {}, [
    { value: 'js', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' }
  ]
]
```

### Dynamic Single Select

Create cascading dropdowns where options in the second select depend on the first selection:

```javascript
[
  'dynamicSingleSelect',       // Field type
  'programming',               // Field name
  'Programming Languages',     // Label
  { required: true },          // Validation
  {},                          // Attributes
  [  // Main categories (appear in first dropdown)
    {
      id: 'frontend',
      label: 'Front End',
      options: [
        { value: 'javascript', label: 'JavaScript' },
        { value: 'react', label: 'React' },
        { value: 'vue', label: 'Vue' }
      ]
    },
    {
      id: 'backend',
      label: 'Back End',
      options: [
        { value: 'nodejs', label: 'Node.js' },
        { value: 'python', label: 'Python' },
        { value: 'java', label: 'Java' }
      ]
    }
  ]
]
```

### HTML Content Blocks ✨ New

Insert custom HTML or plain text anywhere in your form. Perfect for section headers, instructional text, warnings, or embedded content:

```javascript
[
  'html',           // Field type
  'div',            // HTML element to render (div, p, span, section, etc.)
  'Your content here', // Content (HTML or plain text)
  {},               // Validation (not used for HTML blocks -but do keep the empty {})
  {                 // Attributes for the HTML element
    id: 'section-header',
    class: 'info-message highlight',
    style: 'color: #4338ca; padding: 1rem; background: #f5f3ff;',
    'data-type': 'instructional'
  }
]
```

#### Examples:

**Plain text paragraph:**
```javascript
['html', 'p', 'Please fill out all required fields marked with *', {}, {
  class: 'instruction-text',
  style: 'font-style: italic;'
}]
```

**Section header with custom styling:**
```javascript
['html', 'h3', 'Personal Information', {}, {
  class: 'form-section-header',
  style: 'border-bottom: 2px solid #4338ca; margin-top: 2rem;'
}]
```

**Warning message:**
```javascript
['html', 'div', '⚠️ Your session will expire in 5 minutes', {}, {
  class: 'warning-banner',
  role: 'alert'
}]
```

**Complex HTML with nested elements:**
```javascript
['html', 'div', `
  <div class="info-box">
    <strong>Note:</strong> 
    <span>All fields are required unless marked optional</span>
  </div>
`, {}, {
  class: 'custom-wrapper'
}]
```

**Resulting HTML structure:**
```html
<div class="form-group" id="section-header-block">
  <div id="section-header" class="info-message highlight" style="color: #4338ca; padding: 1rem;">
    Your content here
  </div>
</div>
```

Each HTML block is automatically wrapped in a `form-group` div for consistent spacing and layout with form fields.

### Conditional Logic

Show/hide fields based on other field values:

```javascript
// Parent field with dependents
[
  'singleSelect', 'role', 'Role', 
  { required: true }, 
  { dependents: ['topic', 'mode'] },  // Fields that depend on this
  [
    { value: 'attendee', label: 'Attendee' },
    { value: 'presenter', label: 'Presenter' }
  ]
],

// Dependent field with string condition
[
  'text', 'topic', 'Presentation Topic', 
  {}, 
  { 
    dependsOn: 'role', 
    condition: 'presenter'  // Shows when role = 'presenter'
  }
],

// Dependent field with function condition
[
  'singleSelect', 'mode', 'Presentation Mode',
  { required: true },
  { 
    dependsOn: 'role', 
    condition: (value) => value === 'presenter'  // Function condition
  },
  [
    { value: 'virtual', label: 'Virtual' },
    { value: 'physical', label: 'Physical' }
  ]
]
```

## 1. Styling the Form

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
If no theme is set, Formique will default to the light theme. 

### Fine-Grained Theme Control

To override the button and focus color with your own custom color, use the `themeColor` option in hexadecimal format:

```js
const formSettings = {
  themeColor: '#327ba8'  // Must be a valid hex value
};
```

### Custom Styling

Formique’s form classes are exposed for complete customization. You can target the form using `.formique`, and inputs with classes like `.form-input`, `.form-label`, `.form-submit-btn`. See section below.

Example:

```css
.form-input {
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

### ⚙ Custom Container ID

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

Formique includes several responsive width utility classes:

| Class Name     | Description       |
|----------------|-------------------|
| `width-full`   | 100% width        |
| `width-half`   | 50% width         |
| `width-medium` | 600px fixed width |
| `width-small`  | 400px fixed width |

Example:

```html
<div id="formique" class="width-half"></div>
```

### Custom Inline Style Control

For precise container control:

```js
const formSettings = {
  formContainerStyle: 'width: 100%; max-width: 700px; padding: 2rem;'
};
```

## Complete List of `.formique`-Scoped CSS Classes

### Container & Layout
* `.formique`
* `.formique-form`
* `.width-full`
* `.width-half`
* `.width-medium`
* `.width-small`
* `.width-custom`

### Labels & Inputs
* `.form-label`
* `.form-input`
* `.form-control`
* `.form-textarea`
* `.form-select`
* `.form-select-input`
* `.form-radio-input`
* `.form-checkbox-input`
* `.form-color-input`

### Input Wrappers
* `.input-block`
* `.radio-group`
* `.checkbox-group`
* `.form-group`

### Themes
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

### Button
* `.form-submit-btn`

### Loading
* `#formiqueSpinner`
* `.formique-spinner`
* `.formique-spinner .message`

### Status Messages
* `.formique-success`
* `.formique-error`

## 3. Contact Form Quick Setup

Formique supports plug-and-play email contact forms.

### Basic Email Contact Setup

```js
const formSettings = {
  submitMode: 'email',                  // Required
  submitOnPage: true,                   // Required
  successMessage: 'Message sent successfully!',
  errorMessage: 'Something went wrong',
  sendTo: ['contacts@yourwebsite.com']  // Recipient email(s)
};
```

### Complete Contact Form Example

```javascript
const formSchema = [
  ['html', 'h3', 'Get in Touch', {}, { 
    class: 'form-section',
    style: 'margin-top: 0;'
  }],
  ['text', 'name', 'Your Name', { required: true }],
  ['email', 'email', 'Email Address', { required: true }],
  ['text', 'subject', 'Subject', { required: true }],
  ['textarea', 'message', 'Message', { required: true, minlength: 20 }, { rows: 5 }],
  ['html', 'p', 'We\'ll respond within 24 hours', {}, { 
    class: 'form-note',
    style: 'font-size: 0.9rem; color: #666;'
  }],
  ['submit', 'submit', 'Send Message']
];

const formSettings = {
  submitMode: 'email',
  submitOnPage: true,
  sendTo: ['hello@yourwebsite.com'],
  theme: 'blue',
  requiredFieldIndicator: true
};
```

## ⚠️ Domain Verification for Email Submissions

To enable email submissions, ensure your domain is **registered on your [useformique.com](https://useformique.com) account**.

This is required for sender verification and spam protection.

For more comprehensive details on Formique's features and options, visit the [Formique GitHub Repository](https://github.com/Gugulethu-Nyoni/formique).