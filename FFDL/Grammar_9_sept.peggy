/*


@form: user-registration
theme: dark
mode: email

- email * 
  id: user-email
  required
  class: input-field

- *! password
  disabled
  min-length: 8

- *phone_number
  pattern: "\d{3}-\d{3}-\d{4}"
  
 - name

Radio


- *payment_method
  oneof / or radio or chooseOne 
  options: Credit Card, PayPal, Bank Transfer


Checkbox
- *topics!
  manyof
  options: Science, Math, History



Single Select 
-!*country
  selectOne
  options: USA, Canada, Mexico
  default: USA


MultiSelect

- interests
  selectMany
  options: Music, Sports, Art
  default: Music

File Name with Type Reference
- dob:date 


- name*
- email*
- !message*!:textarea


Simple Contact From Example :: FormiqueCloud Enabled

@form: my-contact-form
sendTo: gugunnn@gmail.com
subject: 
submitMode: email

- name*
- email*
- subject! 
- !message*!:textarea


Conditionality

Single Select 
-!*country
  selectOne
  options: USA, Canada, Mexico
  default: USA
  dependents: topic, mode


- topic:text
  dependsOn: country, USA

- mode
 oneof
 options: virtual,physical,hybrid
 dependsOn: country, USA


 - country-state  
  options: Zambia, South Africa, Zimbabwe  
  Zambia: Lusaka, Copperbelt  
  South Africa: Gauteng, North West, Limpopo  
  Zimbabwe: Midlands, Mashonaland West

  OR

- country-state  
  country: Zambia, South Africa, Zimbabwe  
  Zambia: Lusaka, Copperbelt  
  South Africa: Gauteng, North West, Limpopo  
  Zimbabwe: Midlands, Mashonaland West

*/


{
  function createNode(type, start, end, additionalProps) {
    const node = {
      type: type,
      start: start,
      end: end,
      ...additionalProps
    };
    if (additionalProps.expression) {
      node.expression = createNode('Identifier', additionalProps.expression.start, additionalProps.expression.end, {
        name: additionalProps.expression.value,
        loc: {
          start: {
            line: 1,
            column: additionalProps.expression.start + 1
          },
          end: {
            line: 1,
            column: additionalProps.expression.start + 2
          }
        }
      });
    }
    return node;
  }
}

// Main form structure 
start = _ formDefinition 

formDefinition
  = formDirective _ formFields?

formDirective "form directive must be in this format: @form: form-name"
  = "@form:" _ name:Identifier _ properties:formProperties {
    return createNode('FormDirective', location().start, location().end, {
      name: name,
      properties: properties
    })
  }

formProperties
  = props:(formProperty _)* { 
      const properties = [];
      for (const prop of props) {
        if (prop[0] && prop[0].type) properties.push(prop[0]);
      }
      return createNode('FormProperties', location().start, location().end, {
        properties: properties
      })
    }

formProperty
  = key:Identifier ":" _ value:PropertyValue {
    return createNode('FormProperty', location().start, location().end, {
      key: key,
      value: value
    })
  }

PropertyValue
  = UnquotedString / StringLiteral / BooleanLiteral / NumberLiteral / Identifier

UnquotedString
  = [^\s:\r\n]+ {  // Now allows @ symbols
      return createNode('StringLiteral', location().start, location().end, {
        value: text()
      })
    }
    
StringLiteral 
  = '"' [^"]* '"' {
    return createNode('StringLiteral', location().start, location().end, {
      value: text().slice(1, -1)
    })
  }

BooleanLiteral
  = ("true" / "false") {
    return createNode('BooleanLiteral', location().start, location().end, {
      value: text() === "true"
    })
  }

NumberLiteral
  = [0-9]+ {
    return createNode('NumberLiteral', location().start, location().end, {
      value: parseInt(text(), 10)
    })
  }


formFields
  = _ fields:FormField+ {
    return createNode('FormFields', location().start, location().end, {
      fields: fields
    })
  }

FormField
  = "-" _ name:FieldName attributes:FieldAttributes? _ {
    return createNode('FormField', location().start, location().end, {
      name: name,
      attributes: attributes || []
    })
  }

/*
FieldName
  = _ markers:FieldMarkers? _  name:NamePart _ markers2:FieldMarkers? _ {
    return (markers || '') + name + (markers2 || '')
  }
 */ 
 

FieldName 
  = _ markers:FieldMarkers? _ name:FieldNameContent _ markers2:FieldMarkers? _ {
      return (markers || '') + name + (markers2 || '')
    }

FieldNameContent
  = NameWithType / SimpleName

NameWithType
  = name:FieldMarkers? namePart:[a-zA-Z0-9_-]+ name2:FieldMarkers? ":" type:[a-zA-Z0-9_-]+ {
      return (name || '') + namePart.join('') + ':' + type.join('')
    }

SimpleName
  = [a-zA-Z0-9_-]+ { return text() }

FieldMarkers
  = [!*]+ { return text() }

FieldAttributes
  = attrs:(_ FieldAttribute)* {
    return attrs.map(attr => attr[1])
  }



FieldAttribute
= OptionsAttribute / RegularAttribute 

RegularAttribute
  = key:AttributeKey ":" _ value:AttributeValue {
    return createNode('FieldAttribute', location().start, location().end, {
      key: key,
      value: value
    })
  }
  / flag:AttributeFlag {
    return createNode('FieldAttribute', location().start, location().end, {
      key: flag,
      value: true
    })
  }

AttributeKey
  = [a-zA-Z][a-zA-Z0-9_-]* { return text() }

AttributeValue
  = StringLiteral / BooleanLiteral / NumberLiteral / Identifier / UnquotedString

AttributeFlag
  = [a-zA-Z][a-zA-Z0-9_-]* { return text() }
  
OptionsAttribute
  = key:Identifier ":" _ values:OptionList {
      return createNode('OptionsAttribute', location().start, location().end, {
        values: values
      })
    }


OptionList
  = head:Option tail:(_ "," _ Option)* {
      const options = [head];
      for (const item of tail) {
        options.push(item[3]); // Get the Option from the tail items
      }
      return options;
    }

Option
  = QuotedOption / UnquotedOption

QuotedOption
  = '"' value:[^"]+ '"' {
      return createNode('Option', location().start, location().end, {
        value: value.join(''),
        quoted: true
      })
    }

UnquotedOption
  = value:[^,\r\n]+ {
      return createNode('Option', location().start, location().end, {
        value: text().trim(),
        quoted: false
      })
    }
    
// Utility rules
_ = [ \t\n\r]*
__ = [ \t\n\r]+

Identifier = [a-zA-Z_][a-zA-Z0-9_-]* {
  return createNode('Identifier', location().start, location().end, { value: text() }) 
}