

const formSchema = [
  ['text', 'firstName', 'First Name', { minlength: 2, maxlength: 5, required: true, disabled: true}, { value: "John", id: 'firstNameInput', class: 'form-input', style: 'width: 100%;', oninput: "incrementer()"}, '::firstName'],
  ['email', 'email', 'Email', { required: true}, { class: 'form-input', style: 'width: 100%;'}, '::emailValue'],
  ['number', 'age', 'Your Age', {required: false}, { id: 'age12'}, '::age'],
  ['password', 'password', 'Password', { minlength: 8, required: true }, { class: 'form-control', style: 'width: 100%;' }, '::passwordValue'],
  ['tel', 'phoneNumber', 'Phone Number', { required: true }, { class: 'form-control', style: 'width: 100%;' }, '::telValue'],
  ['date', 'birthdate', 'Birth Date', { required: true }, { id: 'birthdateInput', class: 'form-control', style: 'width: 100%;' }, '::date'],
  ['time', 'meetingTime', 'Meeting Time', { required: true }, { id: 'meetingTimeInput', class: 'form-control', style: 'width: 100%;' }, '::time'],
  ['datetime-local', 'meetingDateTime', 'Meeting Date & Time', { required: true }, { id: 'meetingDateTimeInput', class: 'form-control', style: 'width: 100%;' }, '::meetingDateTime'],
  ['month', 'eventMonth', 'Event Month', { required: true }, { id: 'eventMonthInput', class: 'form-control', style: 'width: 100%;' }, '::eventMonth'],
  ['week', 'eventWeek', 'Event Week', { required: true }, { id: 'eventWeekInput', class: 'form-control', style: 'width: 100%;' }, '::eventWeek'],
  ['url', 'websiteUrl', 'Website URL', { required: true}, { id: 'websiteUrlInput', class: 'form-control', style: 'width: 100%;' }, 'bind:value'],
  ['search', 'searchQuery', 'Search', { required: true }, { id: 'searchQueryInput', class: 'form-control', style: 'width: 100%;' }, '::searchQuery'],
  ['color', 'colorPicker', 'Pick a Color', { required: true }, { id: 'colorPickerInput', class: 'form-control', style: 'width: 100%;' }, '::colorValue'],
  ['file', 'terms', 'Upload File', { required: true }, { id: 'my-file', class: 'form-control', style: 'width: 100%;' }, 'bind:value'],
  ['hidden', 'user_id', '', { required: true }, {}, '::user_id'],
  ['image','profilePicture','Profile Picture', { required: true, accept: 'image/*' }, 
  { id: 'profilePictureInput', class: 'form-control', style: 'width: 100%;' }, 
  'bind:value'],
  ['textarea', 'comments', 'Comments', 
  { required: true, minlength: 10, maxlength: 200, rows: 4, cols: 50 }, 
  { id: 'commentsTextarea', class: 'form-control', style: 'width: 100%; height: 100px;' }, 
  '::comments'],


  [
  'radio', 
  'gender', 
  'Gender', 
  { required: true }, 
  { id: 'genderRadio', class: 'form-radio-input', style: 'margin-left: 1rem;', onchange: 'actioner()' }, 
  '::gender', 
  [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
  ]
],


[
  'checkbox', 
  'preferences', 
  'Preferences', 
  { required: true }, 
  { id: 'preferencesCheckbox', class: 'form-checkbox-input', style: 'margin-left: 1rem;', onchange: 'submit' }, 
  '::preferences', 
  [
    { value: 'news', label: 'Newsletter' },
    { value: 'updates', label: 'Product Updates' },
    { value: 'offers', label: 'Special Offers' },
  ]
],



[
  'singleSelect', 
  'colors', 
  'Colors', 
  { required: true }, // Validation options
  { id: 'colorsSelect', class: 'form-select-input', style: 'margin-left: 1rem;', onchange: 'trigger' }, // Attributes
  '::colors', // Binding syntax
  [
    { value: 'red', label: 'Red', selected: false },
    { value: 'green', label: 'Green'},
    { value: 'blue', label: 'Blue', selected: true},
  ] // Options
],



[
  'multipleSelect', // Type of field
  'colors', // Name/identifier of the field
  'Colors', // Label of the field
  { required: true, min: 2, max: 3 }, // Validation options
  { id: 'colorsSelect', class: 'form-select-input', style: 'margin-left: 1rem;', onchange: 'alerter' }, // Attributes
  '::colors', // Binding syntax
  [
    { value: 'red', label: 'Red' },
    { value: 'green', label: 'Green' },
    { value: 'blue', label: 'Blue', selected: false },
    { value: 'yellow', label: 'Yellow', selected: false },
  ] // Options
],


[
    'submit',
    'submitButton',
    'Submit',
    { required: true },
    { id: 'submitBtn', class: 'form-submit-btn', style: 'margin-top: 1rem;' }
  ],



  [
    'dynamicSingleSelect',
    'location',
    'Country-States',
    { required: true },
    {},
    '',
        [
      {
        id: 'usa',
        label: 'USA',
        options: [
          { value: 'california', label: 'California' },
          { value: 'new york', label: 'New York' },
          { value: 'texas', label: 'Texas' }
        ],
        
      },
      {
        id: 'canada',
        label: 'Canada',
        options: [
          { value: 'ontario', label: 'Ontario' },
          { value: 'quebec', label: 'Quebec' },
          { value: 'british-columbia', label: 'British Columbia'}
        ],
       
      }
    ]

],


    





];


*/


/* SMALLER SET OF FIELDS */

/*

const formSchema = [
  // Text Input Field
  [
    'text', 
    'firstName', 
    'First Name', 
    { minlength: 2, maxlength: 5, required: true, disabled: true }, // Validation options
    { value: "John", id: 'firstNameInput', class: 'form-input', style: 'width: 100%;', oninput: "incrementer()" }, // Attributes
    '::firstName' // Binding syntax
  ],

  // URL Input Field
  [
    'url', 
    'websiteUrl', 
    'Website URL', 
    { required: true }, // Validation options
    { id: 'websiteUrlInput', class: 'form-control', style: 'width: 100%;' }, // Attributes
    'bind:value' // Binding syntax
  ],

  // Radio Input Field
  [
    'radio', 
    'gender', 
    'Gender', 
    { required: true }, // Validation options
    { id: 'genderRadio', class: 'form-radio-input', style: 'margin-left: 1rem;', onchange: 'actioner()' }, // Attributes
    '::gender', // Binding syntax
    [
      { value: 'male', label: 'Male' }, // Options
      { value: 'female', label: 'Female' },
      { value: 'other', label: 'Other' }
    ]
  ],

  // Checkbox Input Field
  [
    'checkbox', 
    'preferences', 
    'Preferences', 
    { required: true }, // Validation options
    { id: 'preferencesCheckbox', class: 'form-checkbox-input', style: 'margin-left: 1rem;', onchange: 'submit' }, // Attributes
    '::preferences', // Binding syntax
    [
      { value: 'news', label: 'Newsletter' }, // Options
      { value: 'updates', label: 'Product Updates' },
      { value: 'offers', label: 'Special Offers' }
    ]
  ],

  // Single Select Input Field
  [
    'singleSelect', 
    'colors', 
    'Colors', 
    { required: true }, // Validation options
    { id: 'colorsSelect', class: 'form-select-input', style: 'margin-left: 1rem;', onchange: 'trigger' }, // Attributes
    '::colors', // Binding syntax
    [
      { value: 'red', label: 'Red' }, // Options
      { value: 'green', label: 'Green' },
      { value: 'blue', label: 'Blue', selected: true }
    ]
  ],

  // Multiple Select Input Field
  [
    'multipleSelect', // Type of field
    'colors', // Name/identifier of the field
    'Colors', // Label of the field
    { required: true, minlength: 2, maxlength: 3 }, // Validation options
    { id: 'colorsSelect', class: 'form-select-input', style: 'margin-left: 1rem;', onchange: 'alerter' }, // Attributes
    '::colors', // Binding syntax
    [
      { value: 'red', label: 'Red' }, // Options
      { value: 'green', label: 'Green' },
      { value: 'blue', label: 'Blue' },
      { value: 'yellow', label: 'Yellow' }
    ]
  ],

  // Submit Button
  [
    'submit',
    'submitButton',
    'Submit',
    { required: true }, // Validation options
    { id: 'submitBtn', class: 'form-submit-btn', style: 'margin-top: 1rem;' } // Attributes
  ]
];








/*


const formParams= {
method: 'post', 
action: 'submit.js', 
  };


const formSchema=[ 

  ['text','name','Enter Your Name',{required: true},{placeholder: 'Ibizo Lakho'},''],


  [
    'dynamicSingleSelect',
    'location',
    'Country-States',
    { required: true },
    {},
    '',
        [
      {
        id: 'usa',
        label: 'USA',
        options: [
          { value: 'california', label: 'California' },
          { value: 'new york', label: 'New York' },
          { value: 'texas', label: 'Texas' }
        ],
        
      },
      {
        id: 'canada',
        label: 'Canada',
        options: [
          { value: 'ontario', label: 'Ontario' },
          { value: 'quebec', label: 'Quebec' },
          { value: 'british-columbia', label: 'British Columbia'}
        ],
       
      }
    ]

],


[
  'dynamicSingleSelect',
  'languages',
  'Programming Scope-Programming Languages',
  { required: true },
  {},
  '',
  [
    {
      id: 'frontend',
      label: 'Front End',
      options: [
        { value: 'javascript', label: 'JavaScript' },
        { value: 'html', label: 'HTML' },
        { value: 'css', label: 'CSS' },
        { value: 'typescript', label: 'TypeScript' },
        { value: 'react', label: 'React' },
        { value: 'angular', label: 'Angular' },
        { value: 'vue', label: 'Vue.js' }
      ]
    },
    {
      id: 'backend',
      label: 'Back End',
      options: [
        { value: 'nodejs', label: 'Node.js' },
        { value: 'python', label: 'Python' },
        { value: 'java', label: 'Java' },
        { value: 'php', label: 'PHP' },
        { value: 'ruby', label: 'Ruby' },
        { value: 'csharp', label: 'C#' },
        { value: 'golang', label: 'Go' }
      ]
    }
  ]
],

['singleSelect','car','Choose Your Car', {required: true}, {}, '' , [
{value: 'bmw', label:'BMW'},
{value: 'toyota', label: 'Toyota'},
{value: 'kia', label: 'Kia'}

]],

['radio','gender', 'Gender', {required: true}, {}, '', 
[
{value: 'male', label: 'Female'},
{value: 'female', label: 'Female'},
{value: 'other', label: 'Other'},


]
],

['submit','submit','Submit', {}, {}, ''],



];




const formSettings={
  //requiredFieldIndicator: true,
  framework: 'semantq',
  placeholders: true,
}

// Instantiate the form
const form = new Formique(formParams, formSchema, formSettings);
const formHTML = form.renderFormHTML();
//console.log(formHTML);



















const formParams= {
method: 'post', 
action: 'submit.js', 
  };


const formSchema=[ 

  ['text','name','Enter Your Name',{required: true},{},''],

  
  const formSchema=[ 

  ['text','name','Enter Your Name',{required: true},{placeholder: 'Ibizo Lakho'},''],


  [
    'dynamicSingleSelect',
    'location',
    'Country-States',
    { required: true },
    {},
    '',
        [
      {
        id: 'usa',
        label: 'USA',
        options: [
          { value: 'california', label: 'California' },
          { value: 'new york', label: 'New York' },
          { value: 'texas', label: 'Texas' }
        ],
        
      },
      {
        id: 'canada',
        label: 'Canada',
        options: [
          { value: 'ontario', label: 'Ontario' },
          { value: 'quebec', label: 'Quebec' },
          { value: 'british-columbia', label: 'British Columbia'}
        ],
       
      }
    ]

],


[
  'dynamicSingleSelect',
  'languages',
  'Programming Scope-Programming Languages',
  { required: true },
  {},
  '',
  [
    {
      id: 'frontend',
      label: 'Front End',
      options: [
        { value: 'javascript', label: 'JavaScript' },
        { value: 'html', label: 'HTML' },
        { value: 'css', label: 'CSS' },
        { value: 'typescript', label: 'TypeScript' },
        { value: 'react', label: 'React' },
        { value: 'angular', label: 'Angular' },
        { value: 'vue', label: 'Vue.js' }
      ]
    },
    {
      id: 'backend',
      label: 'Back End',
      options: [
        { value: 'nodejs', label: 'Node.js' },
        { value: 'python', label: 'Python' },
        { value: 'java', label: 'Java' },
        { value: 'php', label: 'PHP' },
        { value: 'ruby', label: 'Ruby' },
        { value: 'csharp', label: 'C#' },
        { value: 'golang', label: 'Go' }
      ]
    }
  ]
],

['singleSelect','car','Choose Your Car', {required: true}, {}, '' , [
{value: 'bmw', label:'BMW'},
{value: 'toyota', label: 'Toyota'},
{value: 'kia', label: 'Kia'}

]],

['radio','gender', 'Gender', {required: true}, {}, '', 
[
{value: 'male', label: 'Female'},
{value: 'female', label: 'Female'},
{value: 'other', label: 'Other'},


]
],

['submit','submit','Submit', {}, {}, ''],



];

];

const formSettings={
  requiredFieldIndicator: true,
  framework: 'semantq',
  placeholders: true,
}

// Instantiate the form
const form = new Formique(formParams, formSchema, formSettings);
const formHTML = form.renderFormHTML();
//console.log(formHTML);

*/