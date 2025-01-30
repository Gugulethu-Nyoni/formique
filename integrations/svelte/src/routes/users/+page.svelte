<script>
    import Formique from 'https://cdn.jsdelivr.net/npm/formique@1.0.6/formique.umd.min.js';

    const formSchema=[
   ['text','name','Name',{required: true}],
   ['text','surname','Surname',{required: true}],
   ['email','email','Email',{required: true}],
   ['password','password','Password',{required: true}],
   ['submit', 'submit', 'Submit']
    ];

    const formParams = {
        action: "submit.js",
        method: "post"
    }

    const formSettings = {
        theme: 'dark-blue'
    }

    const form = new Formique(formSchema, formParams, formSettings);
    

  </script>
  
  <style>
    /* Add any styles for your page here */
    h1 {
      color: blue;
    }
  </style>
  
  <h1>Formique Svelte Guide </h1>
  <p>Let's build a registration form using formique </p>


  <div id="formique">

  </div>
  