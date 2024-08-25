class e{renderField(e,n,t,i,s,l,a){throw new Error("Method renderField must be implemented")}}class n extends e{constructor(e={},n,t={}){super(),this.formSchema=n,this.divClass="input-block",this.inputClass="form-input",this.radioGroupClass="radio-group",this.checkboxGroupClass="checkbox-group",this.selectGroupClass="form-select",this.submitButtonClass="form-submit-btn",this.formParams=e,this.formMarkUp="",this.formSettings={requiredFieldIndicator:!0,placeholders:!0,asteriskHtml:'<span aria-hidden="true" style="color: red;">*</span>',...t},Object.keys(this.formParams).length>0&&(this.formMarkUp+=this.renderFormElement()),this.renderForm()}renderFormElement(){let e="<form\n";const n=this.formParams||{};for(const[t,i]of Object.entries(n))if(null!=i)if("boolean"==typeof i)i&&(e+=`  ${t}\n`);else{e+=`  ${"accept_charset"===t?"accept-charset":t.replace(/_/g,"-")}="${i}"\n`}if(e+=">\n",n.laravel){e+=`<input type="hidden" name="_token" value="${document.querySelector('meta[name="csrf-token"]').getAttribute("content")}">`}return e=e.replace(/\n\s*$/,"\n"),e}renderForm(){const e=this.formSchema.map((e=>{const[n,t,i,s,l={},a,r]=e;return this.renderField(n,t,i,s,l,a,r)})).join("");this.formMarkUp+=e}renderField(e,n,t,i,s,l,a){switch(e){case"text":return this.renderTextField(e,n,t,i,s,l);case"email":return this.renderEmailField(e,n,t,i,s,l);case"number":return this.renderNumberField(e,n,t,i,s,l);case"password":return this.renderPasswordField(e,n,t,i,s,l);case"tel":return this.renderTelField(e,n,t,i,s,l);case"date":return this.renderDateField(e,n,t,i,s,l);case"time":return this.renderTimeField(e,n,t,i,s,l);case"datetime-local":return this.renderDateTimeField(e,n,t,i,s,l);case"month":return this.renderMonthField(e,n,t,i,s,l);case"week":return this.renderWeekField(e,n,t,i,s,l);case"url":return this.renderUrlField(e,n,t,i,s,l);case"search":return this.renderSearchField(e,n,t,i,s,l);case"color":return this.renderColorField(e,n,t,i,s,l);case"checkbox":return this.renderCheckboxField(e,n,t,i,s,l,a);case"radio":return this.renderRadioField(e,n,t,i,s,l,a);case"file":return this.renderFileField(e,n,t,i,s,l);case"hidden":return this.renderHiddenField(e,n,t,i,s,l);case"image":return this.renderImageField(e,n,t,i,s,l);case"textarea":return this.renderTextareaField(e,n,t,i,s,l);case"singleSelect":return this.renderSingleSelectField(e,n,t,i,s,l,a);case"multipleSelect":return this.renderMultipleSelectField(e,n,t,i,s,l,a);case"submit":return this.renderSubmitButton(e,n,t,s);default:return console.warn(`Unsupported field type '${e}' encountered.`),""}}renderTextField(e,n,t,i,s,l){const a=["required","minlength","maxlength","pattern"];let r="";i&&Object.entries(i).forEach((([e,t])=>{if(a.includes(e))if("boolean"==typeof t&&t)r+=`  ${e}\n`;else switch(e){case"pattern":case"minlength":case"maxlength":r+=`  ${e}="${t}"\n`;break;default:a.includes(e)||console.warn(`[31mUnsupported validation attribute '${e}' for field '${n}' of type 'number'.[0m`)}else console.warn(`[31mUnsupported validation attribute '${e}' for field '${n}' of type 'text'.[0m`)}));let o="";if("bind:value"===l&&n&&(o=`  bind:value="${n}"\n`),l.startsWith("::")&&n&&(o=`  bind:value="${n}"\n`),l&&!n)return void console.log("[31m%s[0m",`You cannot set binding value when there is no name attribute defined in ${n} ${e} field.`);let d=s.id||n;const c=this.formSettings?.framework||!1;let $,p="";for(const[e,n]of Object.entries(s))if("id"!==e&&"class"!==e&&void 0!==n)if(e.startsWith("on"))if("semantq"===c){const t=n.endsWith("()")?n.slice(0,-2):n;p+=`  @${e.replace(/^on/,"")}={${t}}\n`}else{p+=`  ${e}="${n.endsWith("()")?n:`${n}()`}"\n`}else!0===n?p+=`  ${e.replace(/_/g,"-")}\n`:!1!==n&&(p+=`  ${e.replace(/_/g,"-")}="${n}"\n`);$="class"in s?s.class:this.inputClass;let u=`\n    <div class="${this.divClass}">\n      <label for="${d}">${t}\n        ${r.includes("required")&&this.formSettings.requiredFieldIndicator?this.formSettings.asteriskHtml:""}\n      </label>\n      <input \n        type="${e}"\n        name="${n}"\n        ${o}\n        id="${d}"\n        class="${$}"\n        ${p}\n        ${r}\n        ${p.includes("placeholder")?"":this.formSettings.placeholders?`placeholder="${t}"`:""}      />\n    </div>\n`.replace(/^\s*\n/gm,"").trim();return u=u.replace(/<input\s+([^>]*)\/>/,((e,n)=>`<input\n${n.trim().split(/\s+/).map((e=>`  ${e}`)).join("\n")}\n/>`)),u}renderEmailField(e,n,t,i,s,l){const a=["required","pattern","minlength","maxlength","multiple"];let r="";i&&Object.entries(i).forEach((([e,t])=>{if(a.includes(e))if("boolean"==typeof t&&t)r+=`  ${e}\n`;else switch(e){case"pattern":case"minlength":case"maxlength":r+=`  ${e}="${t}"\n`;break;default:a.includes(e)||console.warn(`[31mUnsupported validation attribute '${e}' for field '${n}' of type 'number'.[0m`)}else console.warn(`[31mUnsupported validation attribute '${e}' for field '${n}' of type 'email'.[0m`)}));let o="";if("bind:value"===l&&n&&(o=`  bind:value="${n}"\n`),l.startsWith("::")&&n&&(o=`  bind:value="${n}"\n`),l&&!n)return void console.log("[31m%s[0m",`You cannot set binding value when there is no name attribute defined in ${n} ${e} field.`);let d,c=s.id||n,$="";for(const[e,n]of Object.entries(s))if("id"!==e&&"class"!==e&&void 0!==n)if(e.startsWith("on")){const t=n.endsWith("()")?n.slice(0,-2):n;$+=`  @${e.replace(/^on/,"")}={${t}}\n`}else!0===n?$+=`  ${e.replace(/_/g,"-")}\n`:!1!==n&&($+=`  ${e.replace(/_/g,"-")}="${n}"\n`);d="class"in s?s.class:this.inputClass;let p=`\n    <div class="${this.divClass}"> \n      <label for="${c}">${t}</label>\n      <input \n        type="${e}"\n        name="${n}"\n        ${o}\n        id="${c}"\n        class="${d}"\n        ${$}\n        ${r}\n      />\n    </div>\n  `.replace(/^\s*\n/gm,"").trim();return p=p.replace(/<input\s+([^>]*)\/>/,((e,n)=>`<input\n${n.trim().split(/\s+/).map((e=>`  ${e}`)).join("\n")}\n/>`)),p=p.replace(/(<div\s+[^>]*>)/g,(e=>`\n${e}\n`)).replace(/\n\s*\n/g,"\n"),p}renderNumberField(e,n,t,i,s,l){const a=["required","min","max","step"];let r="";i&&Object.entries(i).forEach((([e,t])=>{if(a.includes(e))if("boolean"==typeof t&&t)r+=`  ${e}\n`;else switch(e){case"min":case"max":case"step":r+=`  ${e}="${t}"\n`;break;default:a.includes(e)||console.warn(`[31mUnsupported validation attribute '${e}' for field '${n}' of type 'number'.[0m`)}else console.warn(`[31mUnsupported validation attribute '${e}' for field '${n}' of type 'number'.[0m`)}));let o="";if("bind:value"===l&&n&&(o=`  bind:value="${n}"\n`),l.startsWith("::")&&n&&(o=`  bind:value="${n}"\n`),l&&!n)return void console.log("[31m%s[0m",`You cannot set binding value when there is no name attribute defined in ${n} ${e} field.`);let d,c=s.id||n,$="";for(const[e,n]of Object.entries(s))if("id"!==e&&"class"!==e&&void 0!==n)if(e.startsWith("on")){const t=n.endsWith("()")?n.slice(0,-2):n;$+=`  @${e.replace(/^on/,"")}={${t}}\n`}else!0===n?$+=`  ${e.replace(/_/g,"-")}\n`:!1!==n&&($+=`  ${e.replace(/_/g,"-")}="${n}"\n`);d="class"in s?s.class:this.inputClass;let p=`\n    <div class="${this.divClass}"> \n      <label for="${c}">${t}</label>\n      <input \n        type="${e}"\n        name="${n}"\n        ${o}\n        id="${c}"\n        class="${d}"\n        ${$}\n        ${r}\n      />\n    </div>\n  `.replace(/^\s*\n/gm,"").trim();return p=p.replace(/<input\s+([^>]*)\/>/,((e,n)=>`<input\n${n.trim().split(/\s+/).map((e=>`  ${e}`)).join("\n")}\n/>`)),p=p.replace(/(<div\s+[^>]*>)/g,(e=>`\n${e}\n`)).replace(/\n\s*\n/g,"\n"),p}renderPasswordField(e,n,t,i,s,l){const a=["required","minlength","maxlength","pattern"];let r="";i&&Object.entries(i).forEach((([e,t])=>{if(a.includes(e))if("boolean"==typeof t&&t)r+=`  ${e}\n`;else switch(e){case"minlength":case"maxlength":case"pattern":r+=`  ${e}="${t}"\n`;break;default:a.includes(e)||console.warn(`[31mUnsupported validation attribute '${e}' for field '${n}' of type 'password'.[0m`)}else console.warn(`[31mUnsupported validation attribute '${e}' for field '${n}' of type 'password'.[0m`)}));let o="";if("bind:value"===l&&n&&(o=`  bind:value="${n}"\n`),l.startsWith("::")&&n&&(o=`  bind:value="${n}"\n`),l&&!n)return void console.log("[31m%s[0m",`You cannot set binding value when there is no name attribute defined in ${n} ${e} field.`);let d,c=s.id||n,$="";for(const[e,n]of Object.entries(s))if("id"!==e&&"class"!==e&&void 0!==n)if(e.startsWith("on")){const t=n.endsWith("()")?n.slice(0,-2):n;$+=`  @${e.replace(/^on/,"")}={${t}}\n`}else!0===n?$+=`  ${e.replace(/_/g,"-")}\n`:!1!==n&&($+=`  ${e.replace(/_/g,"-")}="${n}"\n`);d="class"in s?s.class:this.inputClass;let p=`\n    <div class="${this.divClass}"> \n      <label for="${c}">${t}</label>\n      <input \n        type="${e}"\n        name="${n}"\n        ${o}\n        id="${c}"\n        class="${d}"\n        ${$}\n        ${r}\n      />\n    </div>\n  `.replace(/^\s*\n/gm,"").trim();return p=p.replace(/<input\s+([^>]*)\/>/,((e,n)=>`<input\n${n.trim().split(/\s+/).map((e=>`  ${e}`)).join("\n")}\n/>`)),p=p.replace(/(<div\s+[^>]*>)/g,(e=>`\n${e}\n`)).replace(/\n\s*\n/g,"\n"),p}renderTelField(e,n,t,i,s,l){const a=["required","pattern","minlength","maxlength"];let r="";i&&Object.entries(i).forEach((([e,t])=>{if(a.includes(e))if("boolean"==typeof t&&t)r+=`  ${e}\n`;else switch(e){case"pattern":case"minlength":case"maxlength":r+=`  ${e}="${t}"\n`;break;default:a.includes(e)||console.warn(`[31mUnsupported validation attribute '${e}' for field '${n}' of type 'tel'.[0m`)}else console.warn(`[31mUnsupported validation attribute '${e}' for field '${n}' of type 'tel'.[0m`)}));let o="";if("bind:value"===l&&n&&(o=`  bind:value="${n}"\n`),l.startsWith("::")&&n&&(o=`  bind:value="${n}"\n`),l&&!n)return void console.log("[31m%s[0m",`You cannot set binding value when there is no name attribute defined in ${n} ${e} field.`);let d,c=s.id||n,$="";for(const[e,n]of Object.entries(s))if("id"!==e&&"class"!==e&&void 0!==n)if(e.startsWith("on")){const t=n.endsWith("()")?n.slice(0,-2):n;$+=`  @${e.replace(/^on/,"")}={${t}}\n`}else!0===n?$+=`  ${e.replace(/_/g,"-")}\n`:!1!==n&&($+=`  ${e.replace(/_/g,"-")}="${n}"\n`);d="class"in s?s.class:this.inputClass;let p=`\n    <div class="${this.divClass}">\n      <label for="${c}">${t}</label>\n      <input \n        type="${e}"\n        name="${n}"\n        ${o}\n        id="${c}"\n        class="${d}"\n        ${$}\n        ${r}\n      />\n    </div>\n  `.replace(/^\s*\n/gm,"").trim();return p=p.replace(/<input\s+([^>]*)\/>/,((e,n)=>`<input\n${n.trim().split(/\s+/).map((e=>`  ${e}`)).join("\n")}\n/>`)),p=p.replace(/(<div\s+[^>]*>)/g,(e=>`\n${e}\n`)).replace(/\n\s*\n/g,"\n"),p}renderDateField(e,n,t,i,s,l){const a=["required","min","max","step","placeholder","readonly","disabled","autocomplete","spellcheck","inputmode","title"];let r="";i&&Object.entries(i).forEach((([e,t])=>{if(a.includes(e))if("boolean"==typeof t&&t)r+=`  ${e}\n`;else switch(e){case"min":case"max":case"step":r+=`  ${e}="${t}"\n`;break;default:a.includes(e)||console.warn(`[31mUnsupported validation attribute '${e}' for field '${n}' of type 'date'.[0m`)}else console.warn(`[31mUnsupported validation attribute '${e}' for field '${n}' of type 'date'.[0m`)}));let o="";if("bind:value"===l&&n&&(o=`  bind:value="${n}"\n`),l.startsWith("::")&&n&&(o=`  bind:value="${n}"\n`),l&&!n)return void console.log("[31m%s[0m",`You cannot set binding value when there is no name attribute defined in ${n} ${e} field.`);let d,c=s.id||n,$="";for(const[e,n]of Object.entries(s))if("id"!==e&&"class"!==e&&void 0!==n)if(e.startsWith("on")){const t=n.endsWith("()")?n.slice(0,-2):n;$+=`  @${e.replace(/^on/,"")}={${t}}\n`}else!0===n?$+=`  ${e.replace(/_/g,"-")}\n`:!1!==n&&($+=`  ${e.replace(/_/g,"-")}="${n}"\n`);d="class"in s?s.class:this.inputClass;let p=`\n    <div class="${this.divClass}"> \n      <label for="${c}">${t}</label>\n      <input \n        type="${e}"\n        name="${n}"\n        ${o}\n        id="${c}"\n        class="${d}"\n        ${$}\n        ${r}\n      />\n    </div>\n  `.replace(/^\s*\n/gm,"").trim();return p=p.replace(/<input\s+([^>]*)\/>/,((e,n)=>`<input\n${n.trim().split(/\s+/).map((e=>`  ${e}`)).join("\n")}\n/>`)),p=p.replace(/(<div\s+[^>]*>)/g,(e=>`\n${e}\n`)).replace(/\n\s*\n/g,"\n"),p}renderTimeField(e,n,t,i,s,l){const a=["required","min","max","step","readonly","disabled","autocomplete","spellcheck","inputmode","title"];let r="";i&&Object.entries(i).forEach((([t,i])=>{if(a.includes(t))if("boolean"==typeof i&&i)r+=`  ${t}\n`;else switch(t){case"min":case"max":case"step":r+=`  ${t}="${i}"\n`;break;default:a.includes(t)||console.warn(`[31mUnsupported validation attribute '${t}' for field '${n}' of type '${e}'.[0m`)}else console.warn(`[31mUnsupported validation attribute '${t}' for field '${n}' of type '${e}'.[0m`)}));let o="";if("bind:value"===l&&n&&(o=`  bind:value="${n}"\n`),l.startsWith("::")&&n&&(o=`  bind:value="${n}"\n`),l&&!n)return void console.log("[31m%s[0m",`You cannot set binding value when there is no name attribute defined in ${n} ${e} field.`);let d,c=s.id||n,$="";for(const[e,n]of Object.entries(s))if("id"!==e&&"class"!==e&&void 0!==n)if(e.startsWith("on")){const t=n.endsWith("()")?n.slice(0,-2):n;$+=`  @${e.replace(/^on/,"")}={${t}}\n`}else!0===n?$+=`  ${e.replace(/_/g,"-")}\n`:!1!==n&&($+=`  ${e.replace(/_/g,"-")}="${n}"\n`);d="class"in s?s.class:this.inputClass;let p=`\n    <div class="${this.divClass}"> \n      <label for="${c}">${t}</label>\n      <input \n        type="${e}"\n        name="${n}"\n        ${o}\n        id="${c}"\n        class="${d}"\n        ${$}\n        ${r}\n      />\n    </div>\n  `.replace(/^\s*\n/gm,"").trim();return p=p.replace(/<input\s+([^>]*)\/>/,((e,n)=>`<input\n${n.trim().split(/\s+/).map((e=>`  ${e}`)).join("\n")}\n/>`)),p=p.replace(/(<div\s+[^>]*>)/g,(e=>`\n${e}\n`)).replace(/\n\s*\n/g,"\n"),p}renderDateTimeField(e,n,t,i,s,l){const a=["required","min","max","step","readonly","disabled","autocomplete","spellcheck","inputmode","title"];let r="";i&&Object.entries(i).forEach((([t,i])=>{if(a.includes(t))if("boolean"==typeof i&&i)r+=`  ${t}\n`;else switch(t){case"min":case"max":case"step":r+=`  ${t}="${i}"\n`;break;default:a.includes(t)||console.warn(`[31mUnsupported validation attribute '${t}' for field '${n}' of type '${e}'.[0m`)}else console.warn(`[31mUnsupported validation attribute '${t}' for field '${n}' of type '${e}'.[0m`)}));let o="";if("bind:value"===l&&n&&(o=`  bind:value="${n}"\n`),l.startsWith("::")&&n&&(o=`  bind:value="${n}"\n`),l&&!n)return void console.log("[31m%s[0m",`You cannot set binding value when there is no name attribute defined in ${n} ${e} field.`);let d,c=s.id||n,$="";for(const[e,n]of Object.entries(s))if("id"!==e&&"class"!==e&&void 0!==n)if(e.startsWith("on")){const t=n.endsWith("()")?n.slice(0,-2):n;$+=`  @${e.replace(/^on/,"")}={${t}}\n`}else!0===n?$+=`  ${e.replace(/_/g,"-")}\n`:!1!==n&&($+=`  ${e.replace(/_/g,"-")}="${n}"\n`);d="class"in s?s.class:this.inputClass;let p=`\n    <div class="${this.divClass}"> \n      <label for="${c}">${t}</label>\n      <input \n        type="${e}"\n        name="${n}"\n        ${o}\n        id="${c}"\n        class="${d}"\n        ${$}\n        ${r}\n      />\n    </div>\n  `.replace(/^\s*\n/gm,"").trim();return p=p.replace(/<input\s+([^>]*)\/>/,((e,n)=>`<input\n${n.trim().split(/\s+/).map((e=>`  ${e}`)).join("\n")}\n/>`)),p=p.replace(/(<div\s+[^>]*>)/g,(e=>`\n${e}\n`)).replace(/\n\s*\n/g,"\n"),p}renderMonthField(e,n,t,i,s,l){const a=["required","min","max","pattern","placeholder","readonly","disabled","size","autocomplete","spellcheck","inputmode","title"];let r="";i&&Object.entries(i).forEach((([e,t])=>{if(a.includes(e))if("boolean"==typeof t&&t)r+=`  ${e}\n`;else switch(e){case"min":case"max":case"pattern":r+=`  ${e}="${t}"\n`;break;default:a.includes(e)&&console.warn(`[31mUnsupported validation attribute '${e}' for field '${n}' of type 'month'.[0m`)}else console.warn(`[31mUnsupported validation attribute '${e}' for field '${n}' of type 'month'.[0m`)}));let o="";if("bind:value"===l&&n&&(o=`  bind:value="${n}"\n`),l.startsWith("::")&&n&&(o=`  bind:value="${n}"\n`),l&&!n)return void console.log("[31m%s[0m",`You cannot set binding value when there is no name attribute defined in ${n} ${e} field.`);let d,c=s.id||n,$="";for(const[e,n]of Object.entries(s))if("id"!==e&&"class"!==e&&void 0!==n)if(e.startsWith("on")){const t=n.endsWith("()")?n.slice(0,-2):n;$+=`  @${e.replace(/^on/,"")}={${t}}\n`}else!0===n?$+=`  ${e.replace(/_/g,"-")}\n`:!1!==n&&($+=`  ${e.replace(/_/g,"-")}="${n}"\n`);d="class"in s?s.class:this.inputClass;let p=`\n    <div class="${this.divClass}">\n      <label for="${c}">${t}</label>\n      <input \n        type="${e}"\n        name="${n}"\n        ${o}\n        id="${c}"\n        class="${d}"\n        ${$}\n        ${r}\n      />\n    </div>\n  `.replace(/^\s*\n/gm,"").trim();return p=p.replace(/<input\s+([^>]*)\/>/,((e,n)=>`<input\n${n.trim().split(/\s+/).map((e=>`  ${e}`)).join("\n")}\n/>`)),p=p.replace(/(<div\s+[^>]*>)/g,(e=>`\n${e}\n`)).replace(/\n\s*\n/g,"\n"),p}renderWeekField(e,n,t,i,s,l){const a=["required","min","max","pattern","placeholder","readonly","disabled","size","autocomplete","spellcheck","inputmode","title"];let r="";i&&Object.entries(i).forEach((([e,t])=>{if(a.includes(e))if("boolean"==typeof t&&t)r+=`  ${e}\n`;else switch(e){case"min":case"max":case"pattern":r+=`  ${e}="${t}"\n`;break;default:a.includes(e)&&console.warn(`[31mUnsupported validation attribute '${e}' for field '${n}' of type 'week'.[0m`)}else console.warn(`[31mUnsupported validation attribute '${e}' for field '${n}' of type 'week'.[0m`)}));let o="";if("bind:value"===l&&n&&(o=`  bind:value="${n}"\n`),l.startsWith("::")&&n&&(o=`  bind:value="${n}"\n`),l&&!n)return void console.log("[31m%s[0m",`You cannot set binding value when there is no name attribute defined in ${n} ${e} field.`);let d,c=s.id||n,$="";for(const[e,n]of Object.entries(s))if("id"!==e&&"class"!==e&&void 0!==n)if(e.startsWith("on")){const t=n.endsWith("()")?n.slice(0,-2):n;$+=`  @${e.replace(/^on/,"")}={${t}}\n`}else!0===n?$+=`  ${e.replace(/_/g,"-")}\n`:!1!==n&&($+=`  ${e.replace(/_/g,"-")}="${n}"\n`);d="class"in s?s.class:this.inputClass;let p=`\n    <div class="${this.divClass}">\n      <label for="${c}">${t}</label>\n      <input \n        type="${e}"\n        name="${n}"\n        ${o}\n        id="${c}"\n        class="${d}"\n        ${$}\n        ${r}\n      />\n    </div>\n  `.replace(/^\s*\n/gm,"").trim();return p=p.replace(/<input\s+([^>]*)\/>/,((e,n)=>`<input\n${n.trim().split(/\s+/).map((e=>`  ${e}`)).join("\n")}\n/>`)),p=p.replace(/(<div\s+[^>]*>)/g,(e=>`\n${e}\n`)).replace(/\n\s*\n/g,"\n"),p}renderUrlField(e,n,t,i,s,l){const a=["required","pattern","placeholder","readonly","disabled","size","autocomplete","spellcheck","inputmode","title"];let r="";i&&Object.entries(i).forEach((([t,i])=>{if(a.includes(t))if("boolean"==typeof i&&i)r+=`  ${t}\n`;else if("pattern"===t)r+=`  ${t}="${i}"\n`;else a.includes(t)||console.warn(`[31mUnsupported validation attribute '${t}' for field '${n}' of type '${e}'.[0m`);else console.warn(`[31mUnsupported validation attribute '${t}' for field '${n}' of type '${e}'.[0m`)}));let o="";if("bind:value"===l&&n&&(o=`  bind:value="${n}"\n`),l.startsWith("::")&&n&&(o=`  bind:value="${n}"\n`),l&&!n)return void console.log("[31m%s[0m",`You cannot set binding value when there is no name attribute defined in ${n} ${e} field.`);let d,c=s.id||n,$="";for(const[e,n]of Object.entries(s))if("id"!==e&&"class"!==e&&void 0!==n)if(e.startsWith("on")){const t=n.endsWith("()")?n.slice(0,-2):n;$+=`  @${e.replace(/^on/,"")}={${t}}\n`}else!0===n?$+=`  ${e.replace(/_/g,"-")}\n`:!1!==n&&($+=`  ${e.replace(/_/g,"-")}="${n}"\n`);d="class"in s?s.class:this.inputClass;let p=`\n    <div class="${this.divClass}">\n      <label for="${c}">${t}</label>\n      <input \n        type="${e}"\n        name="${n}"\n        ${o}\n        id="${c}"\n        class="${d}"\n        ${$}\n        ${r}\n      />\n    </div>\n  `.replace(/^\s*\n/gm,"").trim();return p=p.replace(/<input\s+([^>]*)\/>/,((e,n)=>`<input\n${n.trim().split(/\s+/).map((e=>`  ${e}`)).join("\n")}\n/>`)),p=p.replace(/(<div\s+[^>]*>)/g,(e=>`\n${e}\n`)).replace(/\n\s*\n/g,"\n"),p}renderSearchField(e,n,t,i,s,l){const a=["required","pattern","placeholder","readonly","disabled","size","autocomplete","spellcheck","inputmode","title"];let r="";i&&Object.entries(i).forEach((([t,i])=>{if(a.includes(t))if("boolean"==typeof i&&i)r+=`  ${t}\n`;else if("pattern"===t)r+=`  ${t}="${i}"\n`;else a.includes(t)||console.warn(`[31mUnsupported validation attribute '${t}' for field '${n}' of type '${e}'.[0m`);else console.warn(`[31mUnsupported validation attribute '${t}' for field '${n}' of type '${e}'.[0m`)}));let o="";if("bind:value"===l&&n&&(o=`  bind:value="${n}"\n`),l.startsWith("::")&&n&&(o=`  bind:value="${n}"\n`),l&&!n)return void console.log("[31m%s[0m",`You cannot set binding value when there is no name attribute defined in ${n} ${e} field.`);let d,c=s.id||n,$="";for(const[e,n]of Object.entries(s))if("id"!==e&&"class"!==e&&void 0!==n)if(e.startsWith("on")){const t=n.endsWith("()")?n.slice(0,-2):n;$+=`  @${e.replace(/^on/,"")}={${t}}\n`}else!0===n?$+=`  ${e.replace(/_/g,"-")}\n`:!1!==n&&($+=`  ${e.replace(/_/g,"-")}="${n}"\n`);d="class"in s?s.class:this.inputClass;let p=`\n    <div class="${this.divClass}">\n      <label for="${c}">${t}</label>\n      <input \n        type="${e}"\n        name="${n}"\n        ${o}\n        id="${c}"\n        class="${d}"\n        ${$}\n        ${r}\n      />\n    </div>\n  `.replace(/^\s*\n/gm,"").trim();return p=p.replace(/<input\s+([^>]*)\/>/,((e,n)=>`<input\n${n.trim().split(/\s+/).map((e=>`  ${e}`)).join("\n")}\n/>`)),p=p.replace(/(<div\s+[^>]*>)/g,(e=>`\n${e}\n`)).replace(/\n\s*\n/g,"\n"),p}renderColorField(e,n,t,i,s,l){const a=["required","readonly","disabled","autocomplete","inputmode","title"];let r="";i&&Object.entries(i).forEach((([t,i])=>{a.includes(t)?"boolean"==typeof i&&i?r+=`  ${t}\n`:a.includes(t)||console.warn(`[31mUnsupported validation attribute '${t}' for field '${n}' of type '${e}'.[0m`):console.warn(`[31mUnsupported validation attribute '${t}' for field '${n}' of type '${e}'.[0m`)}));let o="";if(("bind:value"===l||l.startsWith("::")&&n)&&(o=`  bind:value="${n}"\n`),l&&!n)return void console.log("[31m%s[0m",`You cannot set binding value when there is no name attribute defined in ${n} ${e} field.`);let d,c=s.id||n,$="";for(const[e,n]of Object.entries(s))if("id"!==e&&"class"!==e&&void 0!==n)if(e.startsWith("on")){const t=n.endsWith("()")?n.slice(0,-2):n;$+=`  @${e.replace(/^on/,"")}={${t}}\n`}else!0===n?$+=`  ${e.replace(/_/g,"-")}\n`:!1!==n&&($+=`  ${e.replace(/_/g,"-")}="${n}"\n`);d="class"in s?s.class:this.inputClass;let p=`\n    <div class="${this.divClass}">\n      <label for="${c}">${t}</label>\n      <input \n        type="${e}"\n        name="${n}"\n        ${o}\n        id="${c}"\n        class="${d}"\n        ${$}\n        ${r}\n      />\n    </div>\n  `.replace(/^\s*\n/gm,"").trim();return p=p.replace(/<input\s+([^>]*)\/>/,((e,n)=>`<input\n${n.trim().split(/\s+/).map((e=>`  ${e}`)).join("\n")}\n/>`)),p=p.replace(/(<div\s+[^>]*>)/g,(e=>`\n${e}\n`)).replace(/\n\s*\n/g,"\n"),p}renderFileField(e,n,t,i,s,l){const a=["required","accept","multiple","disabled","title"];let r="";i&&Object.entries(i).forEach((([t,i])=>{a.includes(t)?"boolean"==typeof i&&i?r+=`  ${t}\n`:a.includes(t)||console.warn(`[31mUnsupported validation attribute '${t}' for field '${n}' of type '${e}'.[0m`):console.warn(`[31mUnsupported validation attribute '${t}' for field '${n}' of type '${e}'.[0m`)}));let o="";if("bind:value"===l&&(o=`  bind:value="${n}"\n`),l.startsWith("::")&&n&&(o=`  bind:value="${n}"\n`),l&&!n)return void console.log("[31m%s[0m",`You cannot set binding value when there is no name attribute defined in ${n} ${e} field.`);let d,c=s.id||n,$="";for(const[e,n]of Object.entries(s))if("id"!==e&&"class"!==e&&void 0!==n)if(e.startsWith("on")){const t=n.endsWith("()")?n.slice(0,-2):n;$+=`  @${e.replace(/^on/,"")}={${t}}\n`}else!0===n?$+=`  ${e.replace(/_/g,"-")}\n`:!1!==n&&($+=`  ${e.replace(/_/g,"-")}="${n}"\n`);d="class"in s?s.class:this.inputClass;let p=`\n    <div class="${this.divClass}">\n      <label for="${c}">${t}</label>\n      <input \n        type="${e}"\n        name="${n}"\n        ${o}\n        id="${c}"\n        class="${d}"\n        ${$}\n        ${r}\n      />\n    </div>\n  `.replace(/^\s*\n/gm,"").trim();return p=p.replace(/<input\s+([^>]*)\/>/,((e,n)=>`<input\n${n.trim().split(/\s+/).map((e=>`  ${e}`)).join("\n")}\n/>`)),p=p.replace(/(<div\s+[^>]*>)/g,(e=>`\n${e}\n`)).replace(/\n\s*\n/g,"\n"),p}renderHiddenField(e,n,t,i,s,l){const a=["type","name","value","id","class","style","required","readonly","disabled","tabindex"];let r="";i&&Object.entries(i).forEach((([t,i])=>{a.includes(t)&&"boolean"==typeof i&&i?r+=`  ${t}\n`:console.warn(`[31mUnsupported validation attribute '${t}' for field '${n}' of type '${e}'.[0m`)}));let o="";if("bind:value"===l&&(o=`  bind:value="${n}"\n`),l.startsWith("::")&&n&&(o=`  bind:value="${n}"\n`),l&&!n)return void console.log("[31m%s[0m",`You cannot set binding value when there is no name attribute defined in ${n} ${e} field.`);let d,c=s.id||n,$="";for(const[e,n]of Object.entries(s))if("id"!==e&&"class"!==e&&void 0!==n)if(e.startsWith("on")){const t=n.endsWith("()")?n.slice(0,-2):n;$+=`  @${e.replace(/^on/,"")}={${t}}\n`}else!0===n?$+=`  ${e.replace(/_/g,"-")}\n`:!1!==n&&($+=`  ${e.replace(/_/g,"-")}="${n}"\n`);d="class"in s?s.class:this.inputClass;let p=`\n    <div class="${this.divClass}">\n    <label for="${c}">${t}</label>\n      <input \n        type="${e}"\n        name="${n}"\n        ${o}\n        id="${c}"\n        class="${d}"\n        ${$}\n        ${r}\n      />\n    </div>\n  `.replace(/^\s*\n/gm,"").trim();return p=p.replace(/<input\s+([^>]*)\/>/,((e,n)=>`<input\n${n.trim().split(/\s+/).map((e=>`  ${e}`)).join("\n")}\n/>`)),p=p.replace(/(<div\s+[^>]*>)/g,(e=>`\n${e}\n`)).replace(/\n\s*\n/g,"\n"),p}renderImageField(e,n,t,i,s,l){const a=["accept","required","minwidth","maxwidth","minheight","maxheight"];let r="";i&&Object.entries(i).forEach((([t,i])=>{a.includes(t)?"accept"===t?r+=`accept="${i}"\n`:["required","minwidth","maxwidth","minheight","maxheight"].includes(t)?r+=`${t}="${i}"\n`:console.warn(`[31mUnsupported validation attribute '${t}' for field '${n}' of type '${e}'.[0m`):console.warn(`[31mUnsupported validation attribute '${t}' for field '${n}' of type '${e}'.[0m`)}));let o="";("bind:value"===l||l.startsWith("::"))&&(o=` bind:value="${n}"`);let d,c=s.id||n,$="";for(const[e,n]of Object.entries(s))if("id"!==e&&"class"!==e&&void 0!==n)if(e.startsWith("on")){const t=n.endsWith("()")?n.slice(0,-2):n;$+=`  @${e.replace(/^on/,"")}={${t}}\n`}else!0===n?$+=`  ${e.replace(/_/g,"-")}\n`:!1!==n&&($+=`  ${e.replace(/_/g,"-")}="${n}"\n`);d="class"in s?s.class:this.inputClass;let p=`\n    <div class="${this.divClass}">\n      <label for="${c}">${t}</label>\n      <input \n        type="${e}"\n        name="${n}"\n        ${o}\n        id="${c}"\n        class="${d}"\n        ${$}\n        ${r}\n      />\n    </div>\n  `.replace(/^\s*\n/gm,"").trim();return p=p.replace(/<input\s+([^>]*)\/>/,((e,n)=>`<input\n${n.trim().split(/\s+/).map((e=>`  ${e}`)).join("\n")}\n/>`)),p=p.replace(/(<div\s+[^>]*>)/g,(e=>`\n${e}\n`)).replace(/\n\s*\n/g,"\n"),p}renderImageField(e,n,t,i,s,l){const a=["accept","required","minwidth","maxwidth","minheight","maxheight"];let r="";i&&Object.entries(i).forEach((([t,i])=>{a.includes(t)?r+=`${t}="${i}"\n`:console.warn(`[31mUnsupported validation attribute '${t}' for field '${n}' of type '${e}'.[0m`)}));let o="";("bind:value"===l||l.startsWith("::"))&&(o=`bind:value="${n}"\n`);let d,c=s.id||n,$="";for(const[e,n]of Object.entries(s))if("id"!==e&&"class"!==e&&void 0!==n)if(e.startsWith("on")){const t=n.endsWith("()")?n.slice(0,-2):n;$+=`  @${e.replace(/^on/,"")}={${t}}\n`}else!0===n?$+=`  ${e.replace(/_/g,"-")}\n`:!1!==n&&($+=`  ${e.replace(/_/g,"-")}="${n}"\n`);d="class"in s?s.class:this.inputClass;let p=`\n    <div class="${this.divClass}">\n      <label for="${c}">${t}</label>\n      <input \n        type="${e}"\n        name="${n}"\n        ${o}\n        id="${c}"\n        class="${d}"\n        ${$}\n        ${r}\n      />\n    </div>\n  `.replace(/^\s*\n/gm,"").trim();return p=p.replace(/<input\s+([^>]*)\/>/,((e,n)=>`<input\n${n.trim().split(/\s+/).map((e=>`  ${e}`)).join("\n")}\n/>`)),p=p.replace(/(<div\s+[^>]*>)/g,(e=>`\n${e}\n`)).replace(/\n\s*\n/g,"\n"),p}renderTextareaField(e,n,t,i,s,l){const a=["required","minlength","maxlength","rows","cols"];let r="",o="";i&&Object.entries(i).forEach((([t,i])=>{a.includes(t)?"required"===t?r+="required\n":["minlength","maxlength"].includes(t)?r+=`${t}="${i}"\n`:["rows","cols"].includes(t)&&(o+=`${t}="${i}"\n`):console.warn(`[31mUnsupported validation attribute '${t}' for field '${n}' of type '${e}'.[0m`)}));let d="";("bind:value"===l||l.startsWith("::"))&&(d=`bind:value="${n}"\n`);let c,$=s.id||n,p="";for(const[e,n]of Object.entries(s))if("id"!==e&&"class"!==e&&void 0!==n)if(e.startsWith("on")){const t=n.endsWith("()")?n.slice(0,-2):n;p+=`  @${e.replace(/^on/,"")}={${t}}\n`}else!0===n?p+=`  ${e.replace(/_/g,"-")}\n`:!1!==n&&(p+=`  ${e.replace(/_/g,"-")}="${n}"\n`);c="class"in s?s.class:this.inputClass;let u=`\n    <div class="${this.divClass}">\n      <label for="${$}">${t}</label>\n      <textarea \n        name="${n}"\n        ${d}\n        ${o}\n        id="${$}"\n        class="${c}"\n        ${p}\n        ${r}\n      ></textarea>\n    </div>\n  `.replace(/^\s*\n/gm,"").trim();return u=u.replace(/<textarea\s+([^>]*)<\/textarea>/,((e,n)=>`<textarea\n${n.trim().split(/\s+/).map((e=>`  ${e}`)).join("\n")}\n></textarea>`)),u=u.replace(/(<div\s+[^>]*>)/g,(e=>`\n${e}\n`)).replace(/\n\s*\n/g,"\n"),u}renderRadioField(e,n,t,i,s,l,a){const r=["required"];let o="";i&&Object.entries(i).forEach((([e,t])=>{if(r.includes(e))if("boolean"==typeof t&&t)o+=`  ${e}\n`;else if("required"===e)o+=`  ${e}\n`;else r.includes(e)||console.warn(`[31mUnsupported validation attribute '${e}' for field '${n}' of type 'radio'.[0m`);else console.warn(`[31mUnsupported validation attribute '${e}' for field '${n}' of type 'radio'.[0m`)}));let d="";if("bind:value"===l&&n)d=` bind:value="${n}"\n`;else if(l.startsWith("::")&&n)d=` bind:value="${n}"\n`;else if(l&&!n)return void console.log("[31m%s[0m",`You cannot set binding value when there is no name attribute defined in ${n} ${e} field.`);let c=s.id||n,$="";for(const[e,n]of Object.entries(s))if("id"!==e&&"class"!==e&&void 0!==n)if(e.startsWith("on")){const t=n.endsWith("()")?n.slice(0,-2):n;$+=`  @${e.replace(/^on/,"")}={${t}}\n`}else!0===n?$+=`  ${e.replace(/_/g,"-")}\n`:!1!==n&&($+=`  ${e.replace(/_/g,"-")}="${n}"\n`);let p=s.class||this.inputClass,u="";a&&a.length&&(u=a.map((t=>`\n            <div>\n                <input \n                    type="${e}" \n                    name="${n}" \n                    value="${t.value}"\n                    ${d} \n                    ${$}\n                    ${s.id,`id="${c}-${t.value}"`}\n                    class="${p}"\n                    ${o}\n                />\n                <label \n                    for="${s.id,`${c}-${t.value}`}">\n                    ${t.label}\n                </label>\n            </div>\n            `)).join(""));let f=`\n    <fieldset class="${this.radioGroupClass}">\n        <legend>${t} ${o.includes("required")?'<span aria-hidden="true" style="color: red;">*</span>':""}</legend>\n        ${u}\n    </fieldset>\n    `.replace(/^\s*\n/gm,"").trim().replace(/<input\s+([^>]*)\/>/g,((e,n)=>`<input\n${n.trim().split(/\s+/).map((e=>`  ${e}`)).join("\n")}\n/>`));return f=f.replace(/(<fieldset\s+[^>]*>)/g,(e=>`\n${e}\n`)).replace(/\n\s*\n/g,"\n"),f}renderCheckboxField(e,n,t,i,s,l,a){const r=["required"];i&&Object.entries(i).forEach((([t,i])=>{r.includes(t)||console.warn(`[31mUnsupported validation attribute '${t}' for field '${n}' of type '${e}'.[0m`)}));let o="";("bind:checked"===l||l.startsWith("::"))&&(o=` bind:checked="${n}"\n`);let d,c=s.id||n,$="";for(const[e,n]of Object.entries(s))if("id"!==e&&"class"!==e&&void 0!==n)if(e.startsWith("on")){const t=n.endsWith("()")?n.slice(0,-2):n;$+=`  @${e.replace(/^on/,"")}={${t}}\n`}else!0===n?$+=`  ${e.replace(/_/g,"-")}\n`:!1!==n&&($+=`  ${e.replace(/_/g,"-")}="${n}"\n`);d="class"in s?s.class:this.inputClass;let p="";Array.isArray(a)&&(p=a.map((e=>{const t=`${c}-${e.value}`;return`\n        <div>\n          <input \n          type="checkbox" \n          name="${n}" \n          value="${e.value}"${o} ${$}\n            ${s.id,`id="${t}"`}\n            class="${d}"\n          />\n          <label \n          for="${t}">\n            ${e.label}\n          </label>\n        </div>\n      `})).join(""));let u=`\n    <fieldset class="${this.checkboxGroupClass}">\n      <legend>${t}</legend>\n      ${p}\n    </fieldset>\n  `.replace(/^\s*\n/gm,"").trim();return u=u.replace(/<input\s+([^>]*)\/>/g,((e,n)=>`<input\n${n.trim().split(/\s+/).map((e=>`  ${e}`)).join("\n")}\n/>`)),u=u.replace(/(<fieldset\s+[^>]*>)/g,(e=>`\n${e}\n`)).replace(/\n\s*\n/g,"\n"),u}renderSingleSelectField(e,n,t,i,s,l,a){const r=["required"];let o="";i&&Object.entries(i).forEach((([t,i])=>{r.includes(t)?"required"===t&&(o+=`${t} `):console.warn(`[31mUnsupported validation attribute '${t}' for field '${n}' of type '${e}'.[0m`)}));let d="";"string"==typeof l&&l.startsWith("::")&&(d=` bind:value="${n}" `);let c=s.id||n,$="";for(const[e,n]of Object.entries(s))if("id"!==e&&"class"!==e&&void 0!==n)if(e.startsWith("on")){const t=n.endsWith("()")?n.slice(0,-2):n;$+=`  @${e.replace(/^on/,"")}={${t}}\n`}else!0===n?$+=`  ${e.replace(/_/g,"-")}\n`:!1!==n&&($+=`  ${e.replace(/_/g,"-")}="${n}"\n`);let p="";Array.isArray(a)&&(p+='\n        <option value="">Choose an option</option>\n        ',p+=a.map((e=>{const n=e.selected?" selected":"";return`\n            <option value="${e.value}"${n}>${e.label}</option>\n            `})).join(""));let u=s.class||this.inputClass,f=`\n    <fieldset class="${this.selectGroupClass}">\n        <label for="${c}">${t} \n            ${o.includes("required")&&this.formSettings.requiredFieldIndicator?this.formSettings.asteriskHtml:""}\n        </label>\n        <select name="${n}"\n            ${d}\n            \n            id="${c}"\n            class="${u}"\n            ${$}\n            ${o}\n        >\n            ${p}\n        </select>\n    </fieldset>\n`.replace(/^\s*\n/gm,"").trim().replace(/<select\s+([^>]*)>([\s\S]*?)<\/select>/g,((e,n,t)=>`<select\n${n.trim().split(/\s+/).map((e=>`  ${e}`)).join("\n")}\n>\n${t.trim()}\n</select>`));return f=f.replace(/(<fieldset\s+[^>]*>)/g,(e=>`\n${e}\n`)).replace(/\n\s*\n/g,"\n"),f}renderMultipleSelectField(e,n,t,i,s,l,a){const r=["required","minlength","maxlength"];let o="";i&&Object.entries(i).forEach((([t,i])=>{r.includes(t)?"required"===t?o+=`${t} `:"minlength"===t?o+=`minlength="${i}" `:"maxlength"===t&&(o+=`maxlength="${i}" `):console.warn(`[31mUnsupported validation attribute '${t}' for field '${n}' of type '${e}'.[0m`)}));let d="";"string"==typeof l&&l.startsWith("::")&&(d=` bind:value="${n}" `);let c=s.id||n,$="";for(const[e,n]of Object.entries(s))if("id"!==e&&"class"!==e&&void 0!==n)if(e.startsWith("on")){const t=n.endsWith("()")?n.slice(0,-2):n;$+=`  @${e.replace(/^on/,"")}={${t}}\n`}else!0===n?$+=`  ${e.replace(/_/g,"-")}\n`:!1!==n&&($+=`  ${e.replace(/_/g,"-")}="${n}"\n`);let p="";Array.isArray(a)&&(p=a.map((e=>{const n=e.selected?" selected":"";return`\n        <option value="${e.value}"${n}>${e.label}</option>\n      `})).join(""));let u;u="class"in s?s.class:this.inputClass;let f=`\n    <fieldset class="${this.selectGroupClass}">\n      <label for="${c}">${t}</label>\n      <select name="${n}"\n        ${d}\n        \n        id="${c}"\n        class="${u}"\n        ${$}\n        ${o}\n        multiple\n      >\n        ${p}\n      </select>\n    </fieldset>\n  `.replace(/^\s*\n/gm,"").trim();return f=f.replace(/<select\s+([^>]*)>([\s\S]*?)<\/select>/g,((e,n,t)=>`<select\n${n.trim().split(/\s+/).map((e=>`  ${e}`)).join("\n")}\n>\n${t.trim()}\n</select>`)),f=f.replace(/(<fieldset\s+[^>]*>)/g,(e=>`\n${e}\n`)).replace(/\n\s*\n/g,"\n"),f}renderSubmitButton(e,n,t,i){const s=i.id||n;let l,a="";for(const[e,n]of Object.entries(i))if("id"!==e&&"class"!==e&&void 0!==n)if(e.startsWith("on")){a+=` ${e}="${n.endsWith("()")?n.slice(0,-2):n}"`}else!0===n?a+=` ${e.replace(/_/g,"-")}`:!1!==n&&(a+=` ${e.replace(/_/g,"-")}="${n}"`);l="class"in i?i.class:this.submitButtonClass;return`\n    <input type="${e}"\n      id="${s}"\n      class="${l}"\n      value="${t}"\n      ${a}\n    />\n  `.replace(/^\s*\n/gm,"").trim()}renderFormHTML(){this.formMarkUp+="</form>";const e=document.getElementById("formique");e?e.innerHTML=this.formMarkUp:console.error('Error: formContainer not found. Please ensure an element with id "formique" exists in the HTML.')}}export{n as default};
