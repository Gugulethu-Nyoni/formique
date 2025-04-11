import parser from './parser.js';


const lowCode = `

@form: user-registration
theme: dark
mode: email

- ! email * 
  id: user-email
  required
  class: input-field

	`; 


const ast = parser.parse(lowCode); 
console.log(JSON.stringify(ast,null,2));
