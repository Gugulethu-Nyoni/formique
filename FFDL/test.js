import parser from './latestParser.mjs';


const lowCode = `

@form: user-registration
theme: dark
mode: email
id: myForm
class: block

- ! email * 
  id: user-email
  required
  class: input-field
- name
- telephone*

- dob:date

- Diet*
  oneof
  options: Vegan, Pescitarian, Meat


- country-state  
  options: Zambia, South Africa, Zimbabwe  
  Zambia: Lusaka, Copperbelt  
  South Africa: Gauteng, North West, Limpopo  
  Zimbabwe: Midlands, Mashonaland West

	`; 


const ast = parser.parse(lowCode); 
console.log(JSON.stringify(ast,null,2));
