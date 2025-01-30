
class Formique {

constructor (name) {

//this.builder();
//this.alerter(name);

//document.addEventListener('DOMContentLoaded',  () => {

this.builder();

//}); 



} 






alerter () {

	alert(`Hello ${name}`);
}

builder () {
const elem = document.getElementById('regForm');
const h1 = document.createElement('h1'); 
h1.textContent= "It's working";
elem.appendChild(h1);
}

}



export default Formique;