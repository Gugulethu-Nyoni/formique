import React, { useEffect } from 'react';
import Formique from 'formique';

function FormiqueForm() {
  useEffect(() => {
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
      action: '/api/submit', // Ensure this points to a valid API endpoint
      id: 'myForm',
      class: 'form',
      style: 'width: 100%; font-size: 14px;',
    };

    const formSettings = {
      requiredFieldIndicator: true,
      placeholders: true,
    };

    const form = new Formique(formSchema, formParams, formSettings);
  }, []);

  return (
    <div>
    
      <div id="formique"></div>
    </div>
  );
}

export default FormiqueForm;
