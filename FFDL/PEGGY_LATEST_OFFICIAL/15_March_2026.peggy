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

// Main form structure (Updated to return only the result of formDefinition)
start = _ definition:formDefinition {
 // definition is already a filtered array from the rule below.
 return definition;
}

formDefinition
= directive:formDirective _ fields:formFields? {
// 1. Start with the mandatory FormDirective node.
const result = [directive];

// 2. Conditionally add the optional FormFields node.
if (fields) {
 result.push(fields);
}

// 3. Return only the array of meaningful nodes, filtering out the '_' match.
return result;
}

formDirective "form directive must be in this format: @form: form-name"
= "@form:" _ name:Identifier _ properties:formProperties {
// No change needed here, as it returns a single, well-formed object.
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

// 💡 FIX 1: Use a dedicated, less-greedy unquoted string rule for properties/attributes
PropertyValue
= UnquotedAttributeString / StringLiteral / BooleanLiteral / NumberLiteral / Identifier




// DEPRECATE: This rule is now replaced by UnquotedAttributeString to control greediness
// FIX: Allows characters like '.', ':', '/' and stops matching only on comma (list separator) or newline.
UnquotedAttributeString
= contents:UnquotedLine+ {
    return createNode('StringLiteral', location().start, location().end, {
      value: contents.join("").replace(/\s+/g, ' ').trim() // Normalizes multiline spaces
    })
  }

// Captures a character if it's NOT the start of a new field or property
UnquotedLine
= !([\r\n]+ _ ("-" / Identifier ":")) char:[^\r\n] { return char }
/ [\r\n]+ !(_ ("-" / Identifier ":")) { return " " }

// NOTE: The old UnquotedString rule is now effectively deprecated/replaced in use by UnquotedAttributeString.
UnquotedString
= [^\s:\r\n]+ { // Original definition kept for reference but its use is replaced above
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
= _ markers:FieldMarkers? _ name:NamePart _ markers2:FieldMarkers? _ {
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


// -----------------------------------------------------------
// MODIFIED FIELD ATTRIBUTES (Corrects Semantic Priority)
// -----------------------------------------------------------
// -----------------------------------------------------------
// Attribute Entry Point (Crucial Priority)
// -----------------------------------------------------------
// 💡 FIX: RegularAttribute MUST be checked first. 
// It will match 'key: value'. If a comma exists ('key: value, value2'), 
// RegularAttribute will fail on the comma, and OptionsAttribute will then match.
FieldAttribute
=  OptionsAttribute / RegularAttribute


// -----------------------------------------------------------
// Regular Attribute (Single Value)
// -----------------------------------------------------------
RegularAttribute
= key:AttributeKey ":" _ value:AttributeValue _ { // Consumes trailing spaces/newlines
 return createNode('FieldAttribute', location().start, location().end, {
 key: key, // 💡 FIX: Removed .value, since AttributeKey returns a string
 value: value
 })
}
/ flag:AttributeFlag _ {
 return createNode('FieldAttribute', location().start, location().end, {
 key: flag,
 value: createNode('BooleanLiteral', location().start, location().end, { value: true })
 })
}

// -----------------------------------------------------------
// Options Attribute (Comma-Separated List)
// -----------------------------------------------------------
// -----------------------------------------------------------
// Options Attribute (Comma-Separated List)
// -----------------------------------------------------------
OptionsAttribute
= key:AttributeKey ":" _ values:OptionList {
 return createNode('OptionsAttribute', location().start, location().end, {
 key: key, // 💡 FIX: Removed .value, since AttributeKey returns a string
 values: values
 })
}


// -----------------------------------------------------------
// Options List (Strict Comma Requirement)
// -----------------------------------------------------------
OptionList
// 💡 FINAL FIX: Requires the head Option followed by one or more repetitions of 
// (separator AND next option). The '+' forces failure on single attributes.
= head:Option tail:(_ "," _ Option)+ {
const options = [head];
// The tail is an array of [whitespace, comma, whitespace, Option] tuples.
for (const item of tail) {
 options.push(item[3]); // item[3] is the Option node
}
return options;
}


// -----------------------------------------------------------
// Attribute Value Primitives (For RegularAttribute)
// -----------------------------------------------------------
// 💡 FIX: Simplified to allow only quoted strings or the permissive unquoted string.
// No need for separate BooleanLiteral/NumberLiteral here since UnquotedAttributeString
// is the intended handler for all simple text.
AttributeValue
= ExtendedIdentifier / StringLiteral / UnquotedAttributeString


// -----------------------------------------------------------
// Options Primitives (For OptionList)
// -----------------------------------------------------------
// -----------------------------------------------------------
// MODIFIED Option (Uses AttributeValue rules)
// -----------------------------------------------------------
// -----------------------------------------------------------
// MODIFIED Option (Uses AttributeValue for consistent parsing)
// -----------------------------------------------------------
Option
// Use AttributeValue, which correctly handles quoted strings and stops before a comma/newline.
= value:AttributeValue {
 return createNode('Option', location().start, location().end, {
  value: value.value, // Extract the value from the AttributeValue node
  quoted: value.type === 'StringLiteral' // Check if it was a quoted string
 })
}

// -----------------------------------------------------------
// REMOVE QuotedOption and UnquotedOption
// -----------------------------------------------------------
// These two rules are now replaced by the logic in the new 'Option' rule.


// -----------------------------------------------------------
// Key Primitives (Cleaned up)
// -----------------------------------------------------------
AttributeKey
= [a-zA-Z][a-zA-Z0-9_ \-]* { return text() }

AttributeFlag
= [a-zA-Z][a-zA-Z0-9_-]* { return text() }



// Utility rules
_ = [ \t\n\r]*
__ = [ \t\n\r]+

Identifier = [a-zA-Z_][a-zA-Z0-9_-]* {
return createNode('Identifier', location().start, location().end, { value: text() })
}

ExtendedIdentifier
// Starts with a standard identifier character, then allows a very broad set of characters, including space.
= head:[a-zA-Z_] 
  tail:[a-zA-Z0-9_./:\-?&=()@#%+!\[\] ]* { // 💡 FIX: Added space ' '
    return createNode('StringLiteral', location().start, location().end, { 
      value: text() // Returns the entire matched text
    })
  }