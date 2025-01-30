# Vue Formique Integration Guide

## 1. Install a Vue.js Project

To get started with Vue and Formique, first create a new Vue project:

```bash
npm create vue@latest myapp
```

> **Note:** Refer to the [official Vue.js installation guide](https://vuejs.org/guide/quick-start.html) for the latest instructions.

Then, navigate to your project directory:

```sh
cd myapp
```

## 2. Include Formique CSS

To style your Formique forms properly, add the following CSS CDN link inside the <head> of your index.html file in the root of your project:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/formique-css@1.0.6/formique.min.css" formique-style>
```

This ensures that Formique elements are styled correctly across your Vue application.

## 3. Install Formique

To install Formique, run the following command:

```sh
npm install formique
```


## 4. Create a Form Component

Create a new Vue component inside the src/components directory. You can name it whatever you like, for example: src/components/RegForm.vue


```html
<template>
  <div>
    <h1>Form Title Here</h1>
    <div id="formique"></div>
  </div>
</template>
```

Ensure to include the form container in your template html

```html
<div id="formique"></div>
```

You can use a custom container ID instead of 'formique', if you do this, you will need to define the containerId property in your formSettings object eg: 

```javascript 
const formSettings = {

	containerId: 'regForm'
}
```


### Setting up your js code inside your component 

```html
<script>
import { ref, onMounted } from 'vue';
import Formique from 'formique';

export default {
  setup() {
    const formSchema = ref([
      ['text', 'name', 'Name', { required: true }, {}],
      ['text','surname','Surname',{required: true}],
      ['email', 'email', 'Email', { required: true }, {}],
      ['singleSelect', 'title', 'Title', { required: true }, {dependents: ['status']}, [
        { value: 'mr', label: 'Mr' },
        { value: 'ms', label: 'Ms' },
        { value: 'mrs', label: 'mrs' },
        { value: 'dr', label: 'Dr'},
        { value: 'prof', label: 'Prof'}
      ]],
      ['singleSelect', 'status','Status',{required: true}, {dependsOn: 'title', condition: (value) => value === 'prof'}, 
        [
          {value: 'full professor', label: 'Full Professor'},
          {value: 'associate professor', label: 'Associate Professor'}

        ]
      ],
      ['submit', 'submit', 'Submit',{},{style:'width: 100%;'}]
    ]);

    const formParams = ref({
      method: 'post',
      //action: 'submit.js',
      id: 'myForm',
      class: 'form',
      style: 'width: 100%; font-size: 14px;'
    });

    const formSettings = ref({
      requiredFieldIndicator: true,
      framework: 'vue',
      placeholders: true,
      theme: 'dark-blue',
      submitOnPage: true
    });

    onMounted(() => {
      new Formique(formSchema.value, formParams.value, formSettings.value);
    });

    return {};
  }
};
</script>
```


## Step 5: Import and Use Your Component
Import your component in your App.vue page or any desired page:
App.vue

```html
<template>
  <div id="app">
    <UserForm />
  </div>
</template>

<script>
import UserForm from './components/UserForm.vue';

export default {
  components: { UserForm }
};
</script>
```

## Step 6: Run and View Your Form
Run the following command to view your form on the browser:

```bash
npm run serve
```

## Additional Resources  
For a comprehensive guide on implementing Formique features, visit the official [Formique GitHub repository](https://github.com/Gugulethu-Nyoni/formique).  

## Contributing  
Contributions are welcome! If you'd like to contribute to Formique, please fork the repository and submit a pull request.  

## License  
Formique is licensed under the [MIT License](https://opensource.org/licenses/MIT).  
