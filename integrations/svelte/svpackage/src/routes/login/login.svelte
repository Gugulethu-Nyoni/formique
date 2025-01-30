<script>
  import FormBuilder from 'dummy-svelte-package';

  let formSchema = [
    { label: 'Username', type: 'text', placeholder: 'Enter your username' },
    { label: 'Password', type: 'password', placeholder: 'Enter your password' }
  ];

  let targetElementId = 'form-container';

  // Create a new instance of FormBuilder and render the form
  const formBuilder = new FormBuilder(formSchema, targetElementId);
  formBuilder.renderForm();
</script>

<h1> New Login </h1> 
<div id="form-container"></div>

<style>
  /* You can style your login page here */
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
