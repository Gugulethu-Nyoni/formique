import parser from './latestParser.mjs';

/*

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


*/

const lowCode =`

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

- country-state*
  id: dsel
  class: active  
  options: Zambia, South Africa, Zimbabwe  
  Zambia: Lusaka, Copperbelt  
  South Africa: Gauteng, North West, Limpopo  
  Zimbabwe: Midlands, Mashonaland West


-!*role
  selectOne
  options: Attendee, Presenter
  default: Attendee
  dependents: topic, mode


- topic*:text
  dependsOn: role, Presenter

- mode*
 oneof
 options: virtual,physical,hybrid
 dependsOn: role, Presenter
	`; 


const ast = parser.parse(lowCode); 
console.log(JSON.stringify(ast,null,2));
