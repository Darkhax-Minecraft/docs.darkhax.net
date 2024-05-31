---
title: Prickle
description: An introduction to the Prickle configuration format.
---
Prickle is a simple JSON schema for configuration files. The Prickle format aims to make config files more accessible to 
every day users while also making the files easier to generate and parse in code. Prickle files use the JSON format. 
This means that the syntax, editors, linters, and other tools for JSON files will also work for Prickle files.

### Config Property
Configuration properties are wrapped in an object. This allows additional metadata and properties to be associated with 
the value. The initial value is held by that object using the `value` key. The format of the value is dictated by the 
property type in code and may be a JSON primitive, JSON object, or a JSON object with additional config properties. The 
following example shows how a typical JSON object would look as a config property.

**Standard JSON**
```json title="json_example.json"
{
  "database_host": "192.168.1.0"
}
```

**Config Property**
```json title="prickle_example.json"
{
  "database_host": {
    "value": "192.168.1.0"
  }
}
```

### Comments
The `//` key is used to define a comment for a config property. Comments exist to convey additional meaning to the user 
and should not influence how the property is serialized or used. The value can be a JSON strong or an array of JSON 
strings for multiline comments.

```json {3} title="comment_example.json"
{
  "database_host": {
    "//": "The IP address of the database to connect to.",
    "value": "192.168.1.0"
  }
}
```

```json {3-6} title="multiline_comment_example.json"
{
  "database_host": {
    "//": [
      "The IP address of the database to connect to.",
      "The port can be suffixed using a colon.      "
    ],
    "value": "192.168.1.0"
  }
}
```

### Value Decorators
Value decorators are a type of comment that convey something specific to the reader. Decorators are defined using the 
comment key followed by a name that describes the decorator. The decorators used and the format of their values are 
entirely up to the config author but there are a few common decorators worth considering.

#### Default Value
For some properties it may be useful to note the default value. This allows the reader to easily check if a value was 
changed and can help them revert the change if they want to. This can be done using the `//default` decorator.

```json {7} title="default_example.json"
{
  "database_host": {
    "//": [
      "The IP address of the database to connect to.",
      "The port can be suffixed using a colon.      "
    ],
    "//default": "localhost:4321",
    "value": "192.168.1.0"
  }
}
```

#### References
The reference decorator can be used to link an online resource that may be useful to the reader. For example a webpage 
that describes the format of the value, a list of potential values, or even a tool that generate values like a hex color
picker or a base64 encoder. This is done using the `//reference` decorator.

```json {7} title="reference_example.json"
{
  "database_host": {
    "//": [
      "The IP address of the database to connect to.",
      "The port can be suffixed using a colon.      "
    ],
    "//reference": "https://example.com/database_host_format",
    "value": "192.168.1.0"
  }
}
```

#### Ranged Values
Properties that only accept numbers within a specific range may want to define this range using the `//range` property.

```json {4} title="ranged_number.json"
{
  "ranged_int": {
    "//": "A number that must fit within a given range.",
    "//range": ">=0 AND <=100",
    "value": 84
  }
}
```

#### Regex Validation
Properties that are validated using a regex pattern may share that pattern with the reader using the `//regex` 
decorator. This can allow the reader to check the property in advance or better understand why their value is not 
accepted.

```json {4} title="regex_property.json"
{
  "logo_file": {
    "//": "The logo file to display.",
    "//regex": "^.*\\.(jpg|png)$",
    "value": "/resources/my_logo.png"
  }
}
```

#### Non-Empty Arrays
Some arrays should not be empty, this can be noted by using the `//empty-allowed` decorator.
```json {4} title="non_empty_array.json"
{
  "non_empty_set": {
    "//": "An array that should not be empty.",
    "//empty-allowed": false,
    "value": [1,2,7,3]
  }
}
```

## FaQ

### Why did you make a new format?
Before starting development on Prickle I spent several months test driving existing formats and libraries. While I did 
find several formats that I liked I was disappointed with the available libraries. Every library that I tried had major 
bugs, lacked important features, and was unmaintained. After weighing my options I realized JSON could easily meet all 
of my criteria and had some additional benefits over the other formats. 

Before starting development on Prickle I spent several months test driving existing formats and their various libraries.
While I did find several formats that I liked I was disappointed with the available libraries. Every library I tried had
major bugs, lacked important features, and was unmaintained. After weighing my options I realized JSON could easily meet 
all of my criteria and had some additional benefits. 