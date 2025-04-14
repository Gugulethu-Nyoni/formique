'use strict';

class {

constructor (ast) {
this.ast = ast;
this.schema='';

this.formAttributes = [
  "action",
  "method",
  "enctype",
  "name",
  "target",
  "autocomplete",
  "novalidate",
  "rel",
  "accept-charset",
  "id",
  "class",
  "style",
  "title",
  "lang",
  "dir",
  "hidden",
  "tabindex",
  "accesskey",
  "draggable",
  "contenteditable",
  "spellcheck",
  "onsubmit",
  "onreset",
  "onchange",
  "oninput",
  "onfocus",
  "onblur",
  "onkeydown",
  "onkeyup",
  "onclick",
  "ondblclick",
  "onmouseover",
  "onmouseout",
  "aria-label",
  "aria-labelledby",
  "aria-describedby",
  "role"
];

this.inputAttributes = [
  "type",
  "value",
  "name",
  "placeholder",
  "required",
  "readonly",
  "disabled",
  "min",
  "max",
  "maxlength",
  "pattern",
  "step",
  "checked",
  "multiple",
  "autofocus",
  "size",
  "accept",
  "form",
  "list"
];




this.traverse();

}






}

