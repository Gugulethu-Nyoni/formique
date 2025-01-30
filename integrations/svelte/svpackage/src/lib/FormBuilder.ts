// src/lib/FormBuilder.ts
export default class FormBuilder {
  private formSchema: Array<{ label: string, type: string, placeholder: string }>;
  private targetElementId: string;

  constructor(formSchema: Array<{ label: string, type: string, placeholder: string }>, targetElementId: string) {
    this.formSchema = formSchema;
    this.targetElementId = targetElementId;
  }

  // Method to generate and insert the form into the target container
  renderForm(): void {
    const targetElement = document.getElementById(this.targetElementId);
    if (!targetElement) {
      console.error(`Target element with ID ${this.targetElementId} not found.`);
      return;
    }

    const form = document.createElement('form');
    form.className = 'login-form';

    this.formSchema.forEach(field => {
      const label = document.createElement('label');
      label.innerText = field.label;

      const input = document.createElement('input');
      input.type = field.type;
      input.placeholder = field.placeholder;

      form.appendChild(label);
      form.appendChild(input);
    });

    // Submit button
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.innerText = 'Submit';
    form.appendChild(submitButton);

    // Insert form into the target element
    targetElement.appendChild(form);
  }
}
