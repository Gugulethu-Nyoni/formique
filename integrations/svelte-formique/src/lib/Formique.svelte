<script>
  import { onMount } from 'svelte';
  import Formique from '../../lib/Formique';


  const formSchema = [
  ['text','name','Name',{required: true}],
  ['text','surname','Surname',{required: true}],
  ['email','email','Email',{required: true}],
  ['singleSelect','title','Title',{required: true},{dependents: ['status']},
    [
    {value: 'mr', label: 'Mr'},
    {value: 'ms', label: 'Ms'},
    {value: 'mrs', label: 'Mrs'},
    {value: 'dr', label: 'Dr'},
    {value: 'prof', label: 'Prof'}
    ]
  ],
  ['singleSelect','status','Status',{required: true},{dependsOn: 'title', condition: 'prof'},
    [
      {value: 'full professor', label: 'Full Professor'},
      {value: 'associate professor', label: 'Associate Professor'}
    ]
  ],
  ['submit','submit','Submit',{},{style: 'width: 100%;'}],
  ];

  const formParams = {
  id: "regForm",
  method: "POST",
  }; 

  const formSettings = {
   submitOnPage: true,
   theme: "midnight-blush",
   requiredFieldIndicator: true,
   placeholders: true,
   framework: "svelte"
  }; 
  onMount(() => {
    const form = new Formique(formSchema, formParams, formSettings);
    console.log(form);
  });

</script>


<!-- The target element where the form will be inserted -->
<div id="formique"> </div>
