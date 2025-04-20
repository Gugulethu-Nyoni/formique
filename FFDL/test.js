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

- diet*
  selectOne
  options: Vegan, vegetarian, Carnivorous, Other
  dependents: other, address

-other*:text
  dependsOn: diet, Other



	`; 


const ast = parser.parse(lowCode); 
const formSchema = ast.formSchema;
const formSettings= ast.formSettings;
const formParams = ast.formParams;

console.log(JSON.stringify(ast,null,2));
