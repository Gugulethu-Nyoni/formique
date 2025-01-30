<script lang="ts">
  import { onMount } from 'svelte';
  import FormBuilder from '../../lib/FormBuilder';

  let formSchema = [
    { label: 'Username', type: 'text', placeholder: 'Enter your username' },
    { label: 'Password', type: 'password', placeholder: 'Enter your password' }
  ];
  
  let targetElementId = 'form-container';

  onMount(() => {
    const formBuilder = new FormBuilder(formSchema, targetElementId);
    formBuilder.renderForm();
  });
</script>

<style>
  .login-form {
    max-width: 300px;
    margin: auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  .login-form input {
    width: 100%;
    padding: 10px;
    margin: 10px 0;
  }
  .login-form button {
    padding: 10px;
    background-color: blue;
    color: white;
    border: none;
    cursor: pointer;
  }
</style>

<!-- The target element where the form will be inserted -->
<div id="form-container"></div>
