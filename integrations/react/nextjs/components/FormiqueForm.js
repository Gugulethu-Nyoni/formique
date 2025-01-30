import { useEffect } from 'react';
import Formique from 'formique'; // Import Formique package

const FormiqueForm = () => {
  useEffect(() => {
    // Ensure Formique is available and initialize it
    const formSchema = [
      ['text', 'name', 'Name', { required: true }, {}],
      ['email', 'email', 'Email', { required: true }, {}],
      ['singleSelect', 'diet', 'Dietary Requirements', { required: true }, {}, [
        { value: 'gluten-free', label: 'Gluten-free' },
        { value: 'vegetarian', label: 'Vegetarian' },
      ]],
      ['submit', 'submitButton', 'Submit']
    ];

    const formParams = {
      method: 'post',
      action: 'submit.js',
      id: 'myForm',
      class: 'form',
      style: 'width: 100%; font-size: 14px;',
    };

    const formSettings = {
      requiredFieldIndicator: true,
      framework: 'semantq',
      placeholders: true,
    };

    // Initialize the Formique form only if Formique is available
    const formContainer = document.getElementById('formique');
    new Formique(formSchema, formParams, formSettings, formContainer);

  }, []); // Run only once when the component is mounted

  return <div id="formique">Loading form...</div>; // Loading text while Formique initializes
};

export default FormiqueForm;
