## Formique Repeater SDL Specification

# Formique Repeater: Dynamic Field Groups

## Overview

The `repeater` field type enables users to dynamically add, remove, and nest groups of form fields at runtime. It extends Formique's positional array paradigm with a dedicated **6th slot** for the inner field blueprint, keeping the syntax consistent with all other field types.


## Positional Signature

```javascript
[
    'repeater',        // [0] Type identifier
    field_name,        // [1] Field name (used for data serialization)
    group_label,       // [2] Display label for the group
    validation,        // [3] Validation rules (standard Formique format)
    attributes,        // [4] Repeater configuration attributes
    inner_blueprint    // [5] ⬅️ REPEATER-SPECIFIC: Field(s) to repeat
]
```

### Slot-by-Slot Breakdown

| Slot | Purpose | Required | Example |
|------|---------|----------|---------|
| `[0]` | Type identifier | ✔️ Always `'repeater'` | `'repeater'` |
| `[1]` | Data namespace | ✔️ | `'product_variants'` |
| `[2]` | Display label | ✔️ | `'Product Variants'` |
| `[3]` | Validation rules | No (use `{}`) | `{ required: true }` |
| `[4]` | Configuration | No (use `{}`) | `{ minRows: 1, maxRows: 10 }` |
| `[5]` | **Inner blueprint** | ✔️ | Single field array or array of field arrays |


## The Critical Distinction: Slot [5] vs Standard Fields

### Standard Field (text example)
```javascript
['text', 'username', 'Username', { required: true }, { placeholder: 'Enter name' }]
//  ↑       ↑          ↑            ↑                    ↑
// [0]     [1]        [2]          [3]                  [4]
// type    name       label        validate             attributes
//                                                  (flat key-value config)
```

### Repeater Field
```javascript
['repeater', 'hobbies', 'Hobbies', {}, { minRows: 1 }, ['text', 'hobby', 'Hobby']]
//  ↑           ↑          ↑         ↑        ↑              ↑
// [0]         [1]        [2]       [3]      [4]            [5]
// type        name       label     validate attributes     INNER BLUEPRINT
//                                                     (nested field definition)
```

**Key difference:** Slot `[4]` in a standard field holds HTML attributes (`placeholder`, `disabled`, `class`). Slot `[4]` in a repeater holds **repeater configuration** (`minRows`, `maxRows`, `addButtonText`). Slot `[5]` is **exclusive to repeaters** and contains the field(s) to repeat.


## Slot [4]: Repeater Configuration Attributes

These are **not** HTML attributes—they control repeater behavior:

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `minRows` | Number | `0` | Minimum rows required (prevents deletion below this) |
| `maxRows` | Number | `Infinity` | Maximum rows allowed (hides add button when reached) |
| `addButtonText` | String | `'+ Add'` | Text for the add row button |
| `removeButtonText` | String | `'×'` | Text for the remove row button |

```javascript
// Full configuration example
{ 
    minRows: 2,                    // At least 2 rows must exist
    maxRows: 8,                    // Cannot exceed 8 rows
    addButtonText: '+ Add Variant',
    removeButtonText: 'Remove'
}
```


## Slot [5]: Inner Blueprint Formats

The blueprint accepts **two structural formats**, automatically normalized by the engine:

### Format A: Single Field (Auto-Wrapped)

When the blueprint contains exactly one field, it can be written without the outer array wrapper:

```javascript
// Single field shorthand (engine auto-wraps in [])
['repeater', 'tags', 'Tags', {}, {},
    ['text', 'tag', 'Tag Name']           // ← Single field, no wrapper
]

// Engine normalizes to:
// [['text', 'tag', 'Tag Name']]
```

### Format B: Multiple Fields (Explicit Array)

When the blueprint contains two or more fields, an explicit outer array is required:

```javascript
// Multi-field explicit array
['repeater', 'specs', 'Specifications', {}, {},
    [                                      // ← Explicit outer array
        ['text', 'spec_key', 'Key'],
        ['text', 'spec_value', 'Value'],
        ['text', 'spec_unit', 'Unit']
    ]
]
```


### Format C: Nested Repeater

A repeater can contain another repeater in its blueprint for infinite nesting:

```javascript
['repeater', 'variants', 'Variants', {}, { minRows: 1 },
    [                                      // ← Outer array for multi-field
        ['text', 'sku', 'SKU Code'],
        ['number', 'price', 'Price'],
        ['repeater', 'images', 'Images', {}, {},
            ['text', 'image_url', 'Image URL']  // ← Nested single field
        ]
    ]
]
```

**Nested Repeater Name Cleaning**

Nested repeater field names include the full parent path during rendering:

```
variants[123_0][product_variants_123_0_images][456_1][image_url]
```

On submission, the compaction engine strips the parent prefix:

```
variants[0].images[0].image_url
```

This ensures clean, intuitive key names in the final payload while maintaining unique namespacing during form interaction.


## Tiered Usage Patterns

### Tier 1: Simple Field Multiplier

**Use case:** Collecting a variable list of single values (tags, emails, URLs).

```javascript
['repeater', 'product_tags', 'Product Tags', {}, { maxRows: 10 },
    ['text', 'tag', 'Tag Name']
]
```

**Renders as:**
```
Product Tags
┌─────────────────────────────┐
│ Tag #0                      │
│ [___________________________]│
│ Tag #1                      │
│ [___________________________]│
└─────────────────────────────┘
[+ Add Tag]
```

**Serializes to:**
```json
{
  "product_tags": [
    { "tag": "summer-collection" },
    { "tag": "new-arrival" }
  ]
}
```

### Tier 2: Key-Value Structured Sub-Forms

**Use case:** Custom metadata, specifications, or any paired data.

```javascript
// 2-field KV
['repeater', 'metadata', 'Metadata', {}, {},
    [
        ['text', 'key', 'Key', { required: true }],
        ['text', 'value', 'Value']
    ]
]

// 3-field KV (Key, Value, Unit)
['repeater', 'dimensions', 'Dimensions', {}, {},
    [
        ['text', 'dim_key', 'Dimension', { required: true }],
        ['number', 'dim_value', 'Value', { required: true }],
        ['text', 'dim_unit', 'Unit']
    ]
]
```

**Renders as:**
```
Metadata
┌─────────────────────────────┐
│ SPEC #0              [× Remove]│
│ Key: [Weight____] Value: [12]  │
│ Unit: [kg________]             │
└─────────────────────────────┘
[+ Add Specification]
```

**Serializes to:**
```json
{
  "metadata": [
    { "key": "Weight", "value": "12", "unit": "kg" },
    { "key": "Material", "value": "Cotton", "unit": null }
  ]
}
```

### Tier 3: Complex Multi-Field Layout Blocks

**Use case:** E-commerce variants, address books, invoice line items.

```javascript
['repeater', 'product_variants', 'Product Variants', {}, { minRows: 1, maxRows: 20 },
    [
        ['text', 'sku', 'SKU Code', { required: true }],
        ['number', 'price', 'Price', { required: true, min: 0 }],
        ['singleSelect', 'status', 'Status', {}, {},
            [
                { value: 'active', label: 'Active' },
                { value: 'draft', label: 'Draft' }
            ]
        ],
        ['repeater', 'images', 'Variant Images', {}, { maxRows: 5 },
            ['text', 'image_url', 'Image URL']
        ]
    ]
]
```

**Renders as:**
```
Product Variants
┌──────────────────────────────────────┐
│ VARIANT #0                    [× Remove]│
│ SKU: [TSHIRT-L-RED____] Price: [299]   │
│ Status: [Active ▼]                     │
│ Variant Images:                        │
│ ┌ - - - - - - - - - - - - - - - - - ┐ │
│ │ IMAGE #0                   [× Remove]││
│ │ [https://img.com/1.jpg___________]│ │
│ └ - - - - - - - - - - - - - - - - - ┘ │
│ [+ Add Image]                          │
└──────────────────────────────────────┘
[+ Add Variant]
```

**Serializes to:**
```json
{
  "product_variants": [
    {
      "sku": "TSHIRT-L-RED",
      "price": "299",
      "status": "active",
      "images": [
        { "image_url": "https://img.com/1.jpg" },
        { "image_url": "https://img.com/2.jpg" }
      ]
    },
    {
      "sku": "TSHIRT-M-BLU",
      "price": "249",
      "status": "draft",
      "images": []
    }
  ]
}
```

## Syntax Decision Tree

Use this flowchart to determine the correct format:

```
Is this a field that should repeat?
│
├─ NO → Use standard field type
│       ['text', 'name', 'Label', {}, {}]
│
└─ YES → Use 'repeater' type
    │
    └─ How many fields per row?
        │
        ├─ ONE field → Format A (shorthand)
        │   ['repeater', 'name', 'Label', {}, {},
        │       ['text', 'field', 'Label']
        │   ]
        │
        └─ MULTIPLE fields → Format B (explicit array)
            ['repeater', 'name', 'Label', {}, {},
                [
                    ['text', 'field1', 'Label 1'],
                    ['text', 'field2', 'Label 2']
                ]
            ]
            │
            └─ Any field itself a repeater? → Format C (nested)
                ['repeater', 'name', 'Label', {}, {},
                    [
                        ['text', 'field1', 'Label 1'],
                        ['repeater', 'nested', 'Label', {}, {},
                            ['text', 'subfield', 'Label']
                        ]
                    ]
                ]
```

## Common Mistakes & Error Messages

### ⛔ Mistake 1: Missing outer array for multi-field blueprint
```javascript
// WRONG - engine will misinterpret
['repeater', 'specs', 'Specs', {}, {},
    ['text', 'key', 'Key'],
    ['text', 'value', 'Value']
]
// Error: "Repeater blueprint slot [5] accepts either a single field array 
//         or an array of field arrays for multiple fields."
```

### ✔️ Correct
```javascript
['repeater', 'specs', 'Specs', {}, {},
    [  // ← Outer array required for 2+ fields
        ['text', 'key', 'Key'],
        ['text', 'value', 'Value']
    ]
]
```


### ⛔ Mistake 2: Putting blueprint in slot [4]
```javascript
// WRONG - slot [4] is for configuration, not blueprint
['repeater', 'tags', 'Tags', {}, 
    ['text', 'tag', 'Tag'],  // ← This goes in slot [5], not [4]
    {}
]
```

### ✔️ Correct
```javascript
['repeater', 'tags', 'Tags', {}, {},  // ← slot [4] is config (or empty {})
    ['text', 'tag', 'Tag']            // ← slot [5] is blueprint
]
```


### ⛔ Mistake 3: Confusing repeater config with HTML attributes
```javascript
// WRONG - placeholder has no meaning for a repeater container
['repeater', 'items', 'Items', {}, { placeholder: 'Enter item' },
    ['text', 'item', 'Item']
]
```

### ✔️ Correct
```javascript
['repeater', 'items', 'Items', {}, { minRows: 1, maxRows: 10 },
    ['text', 'item', 'Item', {}, { placeholder: 'Enter item' }]
    //                                ↑ placeholder goes on the inner field
]
```


## Field Name Serialization

The engine generates unique names using bracket notation:

```
Format:  repeater_name[unique_index][field_name]

Examples:
  tags[1703123456789_0][tag]
  specs[1703123456789_1][spec_key]
  variants[1703123456789_2][images][1703123456790_0][image_url]
```

**Key behaviors:**
- Indices are unique timestamp+counter combinations (never re-used)
- Deleting a row does **not** re-index surviving rows
- Array gaps are compacted only at form submission
- Nested repeaters inherit the full path context from their parent


## Configuration Reference Card

```
┌──────────────────────────────────────────────────────────────┐
│ REPEATER SIGNATURE                                           │
│                                                              │
│ ['repeater', name, label, validate, config, blueprint]       │
│                                                              │
│ SLOTS:                                                       │
│   [0] 'repeater'    ← Type identifier                        │
│   [1] name          ← Data namespace                         │
│   [2] label         ← Display label                          │
│   [3] validate      ← { required, custom, ... }              │
│   [4] config        ← { minRows, maxRows, ... }              │
│   [5] blueprint     ← Field(s) to repeat                     │
│                                                              │
│ CONFIG OPTIONS (slot [4]):                                   │
│   minRows: 0        ← Minimum rows (default 0)               │
│   maxRows: Infinity ← Maximum rows (default unlimited)       │
│   addButtonText     ← Text for add button (default '+ Add')  │
│   removeButtonText  ← Text for remove button (default '×')   │
│                                                              │
│ FORM SETTINGS (formSettings object):                         │
│   compactRepeaterArrays: true  ← Compact arrays on submit    │
│   logPayload: true             ← Log payload to console      │
│   devMode: true                ← Enable all debug logging    │
│                                                              │
│ BLUEPRINT FORMATS (slot [5]):                                │
│   Single:  ['text', 'name', 'Label']                         │
│   Multi:   [['text', 'a', 'A'], ['text', 'b', 'B']]          │
│   Nested:  [['text', 'a', 'A'], ['repeater', ...]]           │
│                                                              │
│ SERIALIZATION:                                               │
│   Names:    name[timestamp_counter][field]                   │
│   Nested:   parent[index][child][nestedIndex][field]         │
│   Compact:  Nested keys cleaned (prefixes stripped)          │
│   Gaps:     Removed on submit, null values preserved         │
│                                                              │
│ DEBUGGING:                                                   │
│   logPayload: true   → Logs raw + compacted payload          │
│   devMode: true      → Logs all submission details           │
└──────────────────────────────────────────────────────────────┘
```
## Debugging & Payload Inspection

Enable payload logging for development:

```javascript
const formSettings = {
    logPayload: true,    // Logs raw and compacted payload to console on submit
    // devMode: true,    // Enables all debug logging including errors
};
```

When enabled, the console will show:
```
========== FORMIQUE SUBMISSION PAYLOAD ==========
Raw form data: { ... flat key-value pairs ... }
Compacted data: { ... nested arrays and objects ... }
Form settings: { ... current configuration ... }
=================================================
```

[Back to Formique](https://github.com/Gugulethu-Nyoni/formique)

