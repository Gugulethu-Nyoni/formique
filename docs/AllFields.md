# Formique All Fields Complete CDN Implementation

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Core - Formique</title>

  <!-- Formique CSS for styling -->
  <link rel="stylesheet" href="https://unpkg.com/formique-css@1.0.13/formique-css.css" />

  <script src="https://cdn.jsdelivr.net/npm/formique@1.0.11/formique.umd.min.js"></script>

  <!-- Initialize Formique via ES Module script -->
  <script type="module">

    /**
     * Form schema definition containing all form fields and their configurations
     * @type {Array<Array>}
     */
    const formSchema = [
      // Dynamic Single Select Field - Programming Languages
      [
        'dynamicSingleSelect',       // Input type (required)
        'languages',                 // Field name (required)
        'Programming Scope(Dynamic Select)-Programming Languages', // Labels
        { required: true },          // Validation rules
        {},                          // Field attributes
        
        // Dropdown Options
        [
          {
            id: 'frontend',          // Option group ID
            label: 'Front End',     // Option group label
            options: [               // Frontend language options
              { value: 'javascript', label: 'JavaScript' },
              { value: 'html', label: 'HTML' },
              { value: 'css', label: 'CSS' },
              { value: 'typescript', label: 'TypeScript' },
              { value: 'semantq', label: 'Semantq' },
              { value: 'svelte', label: 'Svelte' },
              { value: 'vue', label: 'Vue' },
              { value: 'react', label: 'React' },
              { value: 'angular', label: 'Angular' },
            ]
          },
          {
            id: 'backend',          // Option group ID
            label: 'Back End',       // Option group label
            options: [               // Backend language options
              { value: 'nodejs', label: 'Node.js' },
              { value: 'python', label: 'Python' },
              { value: 'java', label: 'Java' },
              { value: 'php', label: 'PHP' },
              { value: 'ruby', label: 'Ruby' },
              { value: 'csharp', label: 'C#' },
              { value: 'golang', label: 'Go' }
            ]
          },
          {
            id: 'server',            // Option group ID
            label: 'Server',        // Option group label
            options: [              // Server/database options
              { value: 'mysql', label: 'MySql' },
              { value: 'supabase', label: 'Supabase' },
              { value: 'MongoDB', label: 'Mongodb' },
              { value: 'sqlite', label: 'SQlite' },
            ]
          }
        ]
      ],

      // Conditionality Fields - disppaly fields based on input of a specific field
      [
        'singleSelect', 
        'role', 
        'Role (Select Conference Presenter to see conditionality)', 
        { required: true }, 
        { dependents: ['topic', 'mode'] },  // Fields that depend on this one
        [
          { value: 'conference attendee', label: 'Conference Attendee' },
          { value: 'conference presenter', label: 'Conference Presenter' }
        ]
      ],

      // Topic field - Text input (dependent on 'role' being 'conference presenter')
      [
        'text', 
        'topic', 
        'Topic', 
        {}, 
        { 
          dependsOn: 'role', 
          condition: 'conference presenter'  // (value) Simple string condition
        }
      ],

      // Mode field - Single Select (required, dependent on 'role')
      [
        'singleSelect', 
        'mode', 
        'Mode', 
        { required: true }, 
        { 
          dependsOn: 'role', 
          condition: (value) => value === 'conference presenter'  // Function condition
        },
        [
          { value: 'physical', label: 'Physical' },
          { value: 'virtual', label: 'Virtual' }
        ]
      ],

      // Standard input fields
      ['text', 'text_input', 'Text',{required: true},{'data-id': 'some-id'}],
      ['email', 'email_input', 'Email', {},{disabled: ''}], // boolean attributes
      ['number', 'number_input', 'Number',{required: true},{style: 'width: 100%;'}],
      ['password', 'password_input', 'Password'],
      ['tel', 'telephone_input', 'Telephone',{},{placeholder: '123-45-678', pattern: '[0-9]{3}-[0-9]{2}-[0-9]{3}'}],
      ['date', 'date_input', 'Date'],
      ['time', 'time_input', 'Time'],
      ['datetime-local', 'datetime_input', 'Datetime-local'],
      ['month', 'month_input', 'Month'],
      ['week', 'week_input', 'Week'],
      ['url', 'url_input', 'URL'],
      ['search', 'search_input', 'Search'],
      ['color', 'color_input', 'Color',{},{value: '#ff0056'}],
      ['file', 'file_input', 'File'],
      ['hidden', 'user_id', 'Hidden', {}, { value: '156' }],  // Hidden field with preset value
      ['image', 'image_input', 'Image', {}, { src: 'some_image.png' }],
      ['textarea', 'textarea_input', 'Textarea', {}, { rows: '4', cols: '6' }],
      
      // Radio button group
      ['radio', 'radio_input', 'Radio', {}, {}, [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'other', label: 'Other' }
      ]],
      
      // Checkbox group
      ['checkbox', 'checkbox_input', 'Checkbox', {}, {}, [
        { value: 'newsletter', label: 'Newsletter', selected: true },
        { value: 'updates', label: 'Updates' },
        { value: 'events', label: 'Events' }
      ]],
      
      // Single select dropdown
      ['singleSelect', 'location', 'Select (Single Option with East selected)', {}, {}, [
        { value: 'east', label: 'East', selected: true },
        { value: 'south', label: 'South' },
        { value: 'north', label: 'North' }
      ]],
      
      // Multiple select dropdown
      ['multipleSelect', 'diet', 'Diet (Multiple Select)', {}, {}, [
        { value: 'vegan', label: 'Vegan' },
        { value: 'vegetarian', label: 'Vegetarian' },
        { value: 'lacto-ovo', label: 'Lacto-ovo' }
      ]],
      
      // Additional fields
      ['submit', 'submit_input', 'Submit'],
    ];

    /**
     * Form settings configuration
     * @type {Object}
     */
    const formSettings = {
      theme: 'blue',                 // Predefined theme
      formContainerId: 'myForm',     // ID of form container element
      submitOnPage: true,            // Enable client-side submission
      errorMessage: 'Something went wrong'
    };

    /**
     * Form parameters and attributes
     * @type {Object}
     */
    const formParams = {
      method: 'POST',
      // Additional standard form attributes can be added here
    };

    // Instantiate and render the form
    const form = new Formique(formSchema, formSettings, formParams);
  </script>
</head>

<body>
  <!-- Form container where Formique will inject the form -->
  <div id="myForm" class="width-half"></div>
</body>
</html>
```

[Formique GitHub repository](https://github.com/Gugulethu-Nyoni/formique).  
