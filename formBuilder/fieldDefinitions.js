
// Global validations and attributes that apply to all fields
export const globalValidations = ['required', 'disabled', 'readonly'];
//export const globalAttributes = ['id', 'class', 'style', 'data-*'];

export const globalAttributes = [
  'id', 
  'class', 
  'style', 
  'autofocus',
  'disabled',
  'readonly'
];

  // FIELD TYPE DEFINITIONS ==============================================
  export const fieldDefinitions = {
  // Standard input types
  text: {
    label: 'Text Input',
    validations: ['required', 'minLength', 'maxLength', 'pattern', 'placeholder'],
    attributes: ['autocomplete', 'readonly', 'disabled', 'autofocus','id','class']
  },
  email: {
    label: 'Email Input',
    validations: ['required', 'pattern', 'multiple', 'placeholder'],
    attributes: ['autocomplete', 'readonly', 'disabled', 'autofocus']
  },
  number: {
    label: 'Number Input',
    validations: ['required', 'min', 'max', 'step', 'placeholder'],
    attributes: ['autocomplete', 'readonly', 'disabled', 'autofocus']
  },
  password: {
    label: 'Password',
    validations: ['required', 'minLength', 'maxLength', 'pattern', 'placeholder'],
    attributes: ['autocomplete', 'readonly', 'disabled', 'autofocus']
  },
  tel: {
    label: 'Phone Number',
    validations: ['required', 'pattern', 'placeholder'],
    attributes: ['autocomplete', 'readonly', 'disabled', 'autofocus']
  },
  url: {
    label: 'URL',
    validations: ['required', 'pattern', 'placeholder'],
    attributes: ['autocomplete', 'readonly', 'disabled', 'autofocus']
  },
  search: {
    label: 'Search',
    validations: ['required', 'minLength', 'maxLength', 'placeholder'],
    attributes: ['autocomplete', 'readonly', 'disabled', 'autofocus']
  },
  color: {
    label: 'Color Picker',
    validations: ['required'],
    attributes: ['disabled']
  },
  range: {
    label: 'Range Slider',
    validations: ['required', 'min', 'max', 'step'],
    attributes: ['disabled']
  },
  date: {
    label: 'Date',
    validations: ['required', 'minDate', 'maxDate'],
    attributes: ['readonly', 'disabled', 'autofocus']
  },
  datetimeLocal: {
    label: 'Date/Time (Local)',
    validations: ['required', 'minDate', 'maxDate'],
    attributes: ['readonly', 'disabled', 'autofocus']
  },
  month: {
    label: 'Month',
    validations: ['required', 'minDate', 'maxDate'],
    attributes: ['readonly', 'disabled', 'autofocus']
  },
  week: {
    label: 'Week',
    validations: ['required', 'minDate', 'maxDate'],
    attributes: ['readonly', 'disabled', 'autofocus']
  },
  time: {
    label: 'Time',
    validations: ['required', 'minTime', 'maxTime'],
    attributes: ['readonly', 'disabled', 'autofocus']
  },
  
  // Special input types
  file: {
    label: 'File Upload',
    validations: ['required', 'accept', 'multiple', 'maxSize', 'minSize'],
    attributes: ['disabled', 'capture']
  },
  reset: {
    label: 'Reset Button',
    validations: [],
    attributes: ['disabled']
  },
  image: {
    label: 'Image Button',
    validations: [],
    attributes: ['disabled', 'alt', 'src', 'width', 'height']
  },
  hidden: {
    label: 'Hidden Input',
    validations: ['required'],
    attributes: []
  },
  
  // Other form elements
  textarea: {
    label: 'Text Area',
    validations: ['required', 'minLength', 'maxLength', 'placeholder'],
    attributes: ['autocomplete', 'readonly', 'disabled', 'autofocus', 'rows', 'cols', 'wrap']
  },
  checkbox: {
    label: 'Checkbox',
    validations: ['required'],
    attributes: ['readonly', 'disabled', 'checked'],
    hasOptions: true

  },
  radio: {
    label: 'Radio Button',
    validations: ['required'],
    attributes: ['readonly', 'disabled', 'checked'],
    hasOptions: true
  },
  singleSelect: {
    label: 'Dropdown Select',
    validations: ['required'],
    attributes: ['disabled', 'multiple', 'size'],
    hasOptions: true
  },
  multiSelect: {
    label: 'Multi-Select',
    validations: ['required'],
    attributes: ['disabled', 'size'],
    hasOptions: true
  },
  
  // Buttons
  button: {
    label: 'Button',
    validations: [],
    attributes: ['disabled', 'type']
  },
  submit: {
    label: 'Submit Button',
    validations: [],
    attributes: ['disabled']
  },
  
  // Special components
  colorPicker: {
    label: 'Color Picker',
    validations: ['required'],
    attributes: ['disabled']
  },
  richText: {
    label: 'Rich Text Editor',
    validations: ['required', 'minLength', 'maxLength'],
    attributes: ['disabled']
  },
  fileDropzone: {
    label: 'File Dropzone',
    validations: ['required', 'accept', 'maxFiles', 'maxSize'],
    attributes: ['disabled']
  }
};


// Helper function to merge globals with specific field definitions
// Helper function
export const getFieldTypeOptions = () => {
  return Object.entries(fieldDefinitions).map(([value, def]) => ({
    value,
    label: def.label,
    validations: [...globalValidations, ...(def.validations || [])],
    attributes: [...globalAttributes, ...(def.attributes || [])]
  }));
};

// Export everything
/*
export {
  fieldDefinitions,
  getFieldTypeOptions,
  globalValidations,
  globalAttributes
};

*/