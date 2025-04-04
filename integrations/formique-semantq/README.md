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

## Step 2: Add the CSS

Paste the following Formique CSS in the `<head>` section of `src/app.html`:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/formique-css@1.0.7/formique.min.css" formique-style>
```

## Step 3: Install `formique-semantq`

To use Formique in your Semantq application, you need to install the `formique-semantq` package.


```bash
npm i @formique/semantq
```

### Step 4: Implement the Form in `+page.Semantq`

Add the following code to +page.Semantq:


```Semantq
<script>
  import { onMount } from 'Semantq';
  import Formique from 'formique-semantq';

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

> **Note** If you want to use a custom target element (form container) ID, you can do so by adding the item (property) `containerId: 'element-id'` in the `formSettings` object. This is particularly useful when you need to implement multiple Formique forms on a single page.
Also, note that if the target element's ID is 'formique', you do not need to declare this item (property) in the `formSettings` object.


For more comprehensive details on Formique's features and usage and options visit the [Formique GitHub Repository](https://github.com/Gugulethu-Nyoni/formique).

