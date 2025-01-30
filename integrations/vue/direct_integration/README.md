# Formique.js Vue Integration

This project demonstrates how to integrate **Formique.js** with **Vue.js**. It provides two approaches:
1. **Direct Integration**: Quick setup for small projects.
2. **npm Package**: Reusable and scalable solution for larger applications.

---

## Table of Contents
1. [Direct Integration](#direct-integration)
   - [Prerequisites](#prerequisites)
   - [Step 1: Create a Vue Component](#step-1-create-a-vue-component)
   - [Step 2: Use the Component in Your App](#step-2-use-the-component-in-your-app)
   - [Step 3: Run the Project](#step-3-run-the-project)
   - [Limitations](#limitations)

2. [npm Package Route](#npm-package-route)
   - [Why Use the npm Package?](#why-use-the-npm-package)
   - [How to Use the npm Package](#how-to-use-the-npm-package)

---

## Direct Integration

### Prerequisites
1. **Vue.js Project**:
   - Ensure you have a Vue.js project set up. If not, create one using [Vue CLI](https://cli.vuejs.org/):
     ```bash
     npm install -g @vue/cli
     vue create my-vue-project
     ```

2. **Formique.js**:
   - Install Formique.js via npm:
     ```bash
     npm install formique
     ```

3. **Formique CSS**:
   - Include the Formique CSS in your `index.html`:
     ```html
     <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/formique-css@1.0.6/formique.min.css" formique-style>
     ```

---

### Step 1: Create a Vue Component
Create a Vue component (e.g., `UserForm.vue`) to integrate Formique.js.

#### File: `src/components/UserForm.vue`
```vue
<template>
  <div>
    <h1>Users Registration Form</h1>
    <div id="formique"></div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import Formique from 'formique'; // Import Formique.js

export default {
  setup() {
    // Define the form schema
    const formSchema = ref([
      ['text', 'name', 'Name', { required: true }, {}],
      ['text', 'surname', 'Surname', { required: true }],
      ['email', 'email', 'Email', { required: true }, {}],
      ['singleSelect', 'title', 'Title', { required: true }, { dependents: ['status'] }, [
        { value: 'mr', label: 'Mr' },
        { value: 'ms', label: 'Ms' },
        { value: 'mrs', label: 'Mrs' },
        { value: 'dr', label: 'Dr' },
        { value: 'prof', label: 'Prof' }
      ]],
      ['singleSelect', 'status', 'Status', { required: true }, { dependsOn: 'title', condition: (value) => value === 'prof' }, [
        { value: 'full professor', label: 'Full Professor' },
        { value: 'associate professor', label: 'Associate Professor' }
      ]],
      ['submit', 'submit', 'Submit', {}, { style: 'width: 100%;' }]
    ]);

    // Define the form parameters
    const formParams = ref({
      method: 'post',
      id: 'myForm',
      class: 'form',
      style: 'width: 100%; font-size: 14px;'
    });

    // Define the form settings
    const formSettings = ref({
      requiredFieldIndicator: true,
      framework: 'vue',
      placeholders: true,
      theme: 'dark-blue',
      submitOnPage: true
    });

    // Initialize Formique.js when the component is mounted
    onMounted(() => {
      new Formique(formSchema.value, formParams.value, formSettings.value);
    });

    return {};
  }
};
</script>

<style scoped>
/* Add any custom styles here */
</style>