---
title: Durability Recipes
description: Crafting recipes that damage items with durability instead of consuming them.
sidebar:
  order: 2
---
::cf-banner[]{p=228525}

Durability recipes are a new type of crafting recipe that will damage items with durability instead of consuming them. 
This can be useful when you want to put a recipe behind acquiring a tool but you don't want the entire tool to be 
consumed with the recipe. The JSON format is the same as a basic crafting recipe, just use our recipe type in place of 
the vanilla type.

## Additional Details
Shapeless recipes will consume one durability by default. This can be changed by setting the `damageAmount` property on 
the JSON data. Items with the unbreaking enchantment will have the same chance to avoid damage as when they are normally
used. Additionally items with the `Unbreakable` NBT tag will not be damaged.

### Shapeless Example
This JSON will create a shapeless recipe that uses shears and a book in any arrangement.

```json {2-3} title="data/example/recipes/shapeless_example.json"
{
  "type": "bookshelf:shapeless_durability",
  "damageAmount": 1,
  "ingredients": [
    {
      "item": "minecraft:shears"
    },
    {
      "item": "minecraft:book"
    }
  ],
  "result": {
    "item": "minecraft:paper"
  }
}
```

### Shaped Example
This JSON will create a shaped recipe that uses an iron sword surrounded by 8 cobwebs. 

```json {2-3} title="data/example/recipes/shaped_example.json"
{
  "type": "bookshelf:shapeless_durability",
  "damageAmount": 1,
  "pattern": [
    "WWW",
    "WSW",
    "WWW"
  ],
  "key": {
    "W": {
      "item": "minecraft:web"
    },
    "S": {
      "item": "minecraft:iron_sword"
    }
  },
  "result": {
    "item": "minecraft:string",
    "count": 16
  }
}
```