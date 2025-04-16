# **Formique Low-Code Form Syntax Guide**  

## **1. Introduction**  

Formique is a lightweight, declarative JavaScript library for building accessible, WCAG-compliant forms. It enables both developers and non-technical users to create forms quickly and efficiently.  

### **Low-Code Form Definition Language (FFDL)**  

At the heart of Formique is the **Formique Form Definition Language (FFDL)**—a simple yet powerful **low-code syntax** that allows users to define forms without writing HTML or JavaScript.  

FFDL is designed for:  
**Non-technical users** – Easily create forms with minimal syntax  
**Developers** – Define forms using a structured, human-readable format  
**Accessibility & Compliance** – Automatically ensures usability and best practices  

Formique supports two approaches:  

- **JavaScript Schema Definition Language (SDL)** – For developers. You explore the SDL guide here:[Formique SDL](https://github.com/Gugulethu-Nyoni/formique)
- **FFDL (Low-Code Syntax)** – For non-technical users (covered in this guide)  

This guide will walk you through **FFDL**, making form creation effortless and intuitive. 


## **2. Form Definition Basics**  

### **2.1 The `@form` Directive**  
Every form starts with the `@form` directive, followed by a name and optional properties.  

#### **Basic Syntax**  
```ffdl
@form: form-name  
property1: value1  
property2: value2  
```  

#### **Example**  
```ffdl
@form: user-registration  
theme: dark  
submitMode: email  
sendTo: contact@example.com  
```  

## **2.2 Form Properties & Settings**

### 1. Standard Form Attributes (formParams)
These standard HTML form attributes will be added directly to your `<form>` element:

```ffdl
@form: contact-form
id: main-contact         # Form ID
class: responsive-form   # CSS classes
action: /submit          # Submission endpoint
method: post             # HTTP method
enctype: multipart/form-data  # For file uploads
target: _blank           # Open response in new tab
autocomplete: off        # Browser autocomplete
```

**Common Standard Attributes:**
| Attribute | Examples | Description |
|-----------|----------|-------------|
| `id` | `user-registration` | Unique form identifier |
| `class` | `compact-form dark-theme` | CSS classes |
| `action` | `/api/submit` | Submission URL |
| `method` | `get`, `post` | HTTP method |
| `enctype` | `multipart/form-data` | For file uploads |
| `target` | `_blank`, `_self` | Where to open response |
| `autocomplete` | `on`, `off` | Browser autofill |

### 2. Special Form Settings (formSettings)
These control Formique-specific behavior and appearance:

```ffdl
@form: event-registration
theme: dark-blue                # Color scheme
submitMode: email               # Submission type
sendTo: events@example.com      # Recipient email
successMessage: "Thank you!"    # Success confirmation
requiredFieldIndicator: true    # Show * for required fields
framework: semantq              # JS framework or Laravel
```

**Key Special Settings:**
| Setting | Example Values | Description |
|---------|----------------|-------------|
| `theme` | `light`, `dark-blue` | Predefined color schemes |
| `submitMode` | `email`, `ajax`, `page` | How form submits |
| `successMessage` | Custom text | Post-submission message |
| `errorMessage` | Custom text | Form error message |
| `framework` | `tailwind`, `bootstrap` | Styling framework |
| `placeholders` | `true`, `false` | Use labels as placeholders |

### 3. Combined Example
Mix both types in any order:

```ffdl
@form: job-application
id: app-form
theme: corporate-blue
method: post
action: /careers/submit
successMessage: "Application received!"
requiredFieldIndicator: true
enctype: multipart/form-data
```

### How It Works:
1. **Standard attributes** (`id`, `class`, `action`, etc.) → Become HTML attributes
2. **Special settings** (`theme`, `submitMode`, etc.) → Control Formique behavior
3. **All properties** can be mixed together in any order

> 💡 **Tip**: Don't worry about categorization - Formique automatically sorts them into the right place during processing.


## **3. Field Definitions**  

### **3.1 Basic Field Syntax**  
Fields are defined with `-` followed by a name and optional attributes.  
FFDL uses inference to determine the name for of the field for example if the field is:

```ffdl
- name 
```

FFDL will infer that this will be text field type with "name" as id and name attributes.  

#### **Syntax**  
```ffdl
- field_name  
  attribute1: value1  
  attribute2: value2  
```  

#### **Example**  
```ffdl
- email  
  required  
  placeholder: Enter your email
```  

---

## **4. Field Markers (Required & Validated Fields)**  

### **4.1 Markers Overview**  
- `*` → **Required field**  
- `!` → **Field with validation**  
- `*!` or `!*` → **Required + validated**  

There are no strict rules for placing these markers (**`!`** and **`*`**). You can:  

- Use either **`!`** or **`*`** as needed.  
- Place them on **either side** of the field name—or on **both sides**.  
- Arrange them in **any order** (e.g., `!*field`, `field*!`, `*field!`, etc.).  
- **Include spaces** between the markers and the field name (`! field *`, `* field !`), as this is completely acceptable.  
- **Omit them entirely** if not needed.  

This flexibility ensures a **user-friendly low-code approach**, making form creation as intuitive as possible. 

#### ** Examples **  
`*field`, `field*`, `!field`, `field!`  
`* field`, `field *` (spaces optional)  
`* !field`, `! * field` (combine markers)  

#### **Examples**  
```ffdl
- *email           # Required  
- password!        # Validated (e.g., min-length)  
- *!phone          # Required + validated  
- age*             # Required (right side)  
```  

---

## **5. Field Types**  

### **5.1 Automatic Type Detection**  
If no type is specified, Formique defaults to `text`.  

#### **Example**  
```ffdl
- username   # Treated as text input  (Formique LowCode use type inference)
```  

### **5.2 Explicit Type Declaration**  
Add `:type` after the field name.  

#### **Syntax**  
```ffdl
- field_name:type  
```  

#### **Example**  
```ffdl
- dob:date  
```  

#### **Supported Types**  

| **Type** | **Example** | **Description** |
|----------|------------|----------------|
| `text` | `- full_name:text` | Standard text input |
| `email` | `- user_email:email` | Email input with validation |
| `number` | `- age:number` | Numeric input (integers & decimals) |
| `password` | `- user_password:password` | Password input (masked text) |
| `textarea` | `- comments:textarea` | Multi-line text input |
| `tel` | `- phone_number:tel` | Telephone number input |
| `date` | `- birth_date:date` | Date picker |
| `time` | `- appointment_time:time` | Time picker |
| `datetime-local` | `- event_datetime:datetime-local` | Date & time picker (local) |
| `month` | `- billing_month:month` | Month picker |
| `week` | `- work_week:week` | Week picker |
| `url` | `- website:url` | URL input with validation |
| `search` | `- query:search` | Search input field |
| `color` | `- favorite_color:color` | Color picker |
| `checkbox` | `- subscribe:checkbox` | Checkbox input |
| `radio` | `- gender:radio` | Radio buttons (single choice) |
| `file` | `- upload:file` | File upload input |
| `hidden` | `- user_id:hidden` | Hidden input field |
| `image` | `- profile_picture:image` | Image upload input |
| `singleSelect` | `- country:singleSelect` | Dropdown with single selection |
| `multipleSelect` | `- interests:multipleSelect` | Dropdown with multiple selection |
| `dynamicSingleSelect` | `- city:dynamicSingleSelect` | Dynamic single-choice dropdown |
| `range` | `- volume:range` | Slider input for range selection |


## **6. Selection Fields (Dropdowns, Radio, Checkbox)**  

### **6.1 Radio Buttons (`oneof`)**  
For single-choice selections.  

#### **Syntax**  
```ffdl
- field_name  
  oneof  
  options: Option1, Option2, Option3  
```  

**Note** Instead of oneof you can also use radio.

#### **Example**  
```ffdl
- payment_method  
  oneof  
  options: Credit Card, PayPal, Bank Transfer  
```  

### **6.2 Checkboxes (`manyof`)**  
For multi-selection.  

#### **Syntax**  
```ffdl
- field_name  
  manyof  
  options: Option1, Option2  
```  

**Note** Instead of manyof you can also use checkbox.


#### **Example**  
```ffdl
- hobbies  
  checkbox  
  options: Music, Sports, Reading  
```  

### **6.3 Dropdown Select (`selectOne` / `selectMany`)**  
For single or multiple selections in a dropdown.  

#### **Single Select**  
```ffdl
- country  
  selectOne  
  options: USA, Canada, Mexico  
```  

**Note** Instead of selectOne you can also use select.


#### **Multi-Select**  
```ffdl
- skills  
  selectMany  
  options: HTML, CSS, JavaScript  
```  

**Note** Instead of selectMany you can also use multiSelect.

#### Pre-selected Values (defaults)

#### **Multi-Select**  
```ffdl
- skills  
  selectMany  
  options: HTML, CSS, JavaScript  
  default: html,css
```  


#### **Single Select**  
```ffdl
- country  
  selectOne  
  options: South Africa, Zambia, Algeria  
  default: South Africa
```  

---

## **7. Advanced Field Attributes**  

### **7.1 Common Attributes**  
| **Attribute** | **Example** | **Description** |
|--------------|------------|----------------|
| `required` | `- email (required)` | Makes field mandatory |
| `default` | `default: "USA"` | Pre-selects a value |
| `min` / `max` | `min: 2` (for checkboxes) | Minimum/maximum selections |
| `pattern` | `pattern: "\d{3}-\d{3}-\d{4}"` | Regex validation |

### **7.2 File Upload Example**  
```ffdl
- profile_pic:file  
  accept: image/*  
  max-size: 2MB  
```  

---

## **8. Complete Examples**  

### **8.1 Registration Form**  
```ffdl
@form: user-signup  
theme: light  
submitMode: ajax  

- *full_name  
  placeholder: "First & Last Name"  

- *!email:email  
  required  
  pattern: ".+@.+\..+"  

- *password  
  min-length: 8  

- *country  
  selectOne  
  options: USA, Canada, UK  

- subscribe:checkbox  
  default: true  
```  

### **8.2 Survey Form**  
```ffdl
@form: customer-feedback  
theme: dark  

- *rating  
  oneof  
  options: Poor, Good, Excellent  

- comments:textarea  
  placeholder: "Tell us more..."  

- contact_me:checkbox  
  label: "Can we follow up?"  
```  

---

## **9. Summary**  
✅ **Simple syntax** – No HTML/JS required  
✅ **Flexible markers** – `*` (required) and `!` (validation)  
✅ **Multiple field types** – Text, email, date, file, dropdowns  
✅ **Selection fields** – Radio (`oneof`), Checkbox (`manyof`), Dropdown (`selectOne`/`selectMany`)  
✅ **Real-world examples** – Registration forms, surveys, file uploads  

---

### **Next Steps**  
- Try the [Formique Playground] to experiment  
- Explore [Advanced Validation Rules]  
- Learn [Dynamic Form Binding]  

Would you like a **PDF version** of this guide? Let us know! 🚀