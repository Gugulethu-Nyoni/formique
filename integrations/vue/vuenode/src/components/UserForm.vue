<template>
  <div>
    <h1>Users Reg Form Here</h1>
    <div id="formique"></div>
  </div>
</template>

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