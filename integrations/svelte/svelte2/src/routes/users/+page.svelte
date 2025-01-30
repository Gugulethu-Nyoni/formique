<script>
  import { onMount } from 'svelte';

  onMount(() => {
      import('formique').then(({ default: Formique }) => {
        const formSchema = [
          ['text', 'name', 'Name', { required: true }],
          ['email', 'email', 'Email', { required: true }],
          ['singleSelect', 'diet', 'Dietary Requirements', { required: true }, {}, [
            { value: 'gluten-free', label: 'Gluten-free' },
            { value: 'vegetarian', label: 'Vegetarian' },
          ]],
          ['submit', 'submitButton', 'Submit']
        ];

        const formParams = {
          method: 'post',
          id: 'myForm',
          class: 'form',
          style: 'width: 100%; font-size: 14px;'
        };

        const formSettings = {
          requiredFieldIndicator: true,
          placeholders: true,
        };

        //const formContainer = document.getElementById('formique');

        // Initialize Formique and render it into the container
        const form = new Formique(formSchema, formParams, formSettings);
        
      }).catch(error => {
        console.error('Error loading Formique', error);
      });
  });
</script>


  <div id="formique">
    
      <p>Loading form...</p>
   
  </div>

