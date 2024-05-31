---
title: Load Conditions
description: Bookshelf load conditions allow JSON files in data packs and resource packs to be conditionally loaded.
sidebar:
  order: 3
---
::cf-banner[]{p=228525}

Load conditions allow JSON files in data packs and resource packs to be loaded conditionally. For example if you are 
creating a recipe that references items from another mod the recipe should only be loaded if that mod is installed. This
can be done using a simple load condition.

## Condition Format
Load conditions can be used with most JSON resources loaded from data packs or resource packs. This is done by creating 
a `bookshelf:load_conditions` property in the JSON file. You can define as many conditions as you want by using a JSON 
array. If more than one condition is present all conditions must be met. 

The following example is of a shapeless crafting recipe that is only loaded if the `examplemod` has been loaded, 
allowing the recipe to safely reference an item from the mod in the recipe.
```json {2-9,13} title="data/example/recipes/dirt_to_diamonds.json"
{
    "bookshelf:load_conditions": [
      {
        "type": "bookshelf:mod_loaded",
        "values": ["examplemod"]
      }
    ],
    "type": "minecraft:crafting_shapeless",
    "ingredients": [
        {
            "item": "examplemod:diamond_dirt"
        }
    ],
    "result": {
        "item": "minecraft:diamond",
        "count": 1
    }
}
```

## Condition Types
The previous example used the `bookshelf:mod_loaded` condition type. While this condition is very useful there are many
condition types that you can use. This section will go into all of the built-in conditions and explain how they can be 
beneficial.

### Mod Loader Platform
The `bookshelf:on_platform` condition will check if the data is being loaded on a specific mod loader. For example you 
can have a recipe that is only loaded on Fabric. This condition can be useful when you have a data file that is using
features specific to one mod loader that would otherwise be invalid on a different loader. The accepted platform names 
are `fabric`, `forge`, and `neoforge`. The casing of the platform name is not important.

```json
{
  "type": "bookshelf:on_platform",
  "platform": "fabric"
}
```

### Mod Loaded
The `bookshelf:mod_loaded` condition will check if all of the specified mods are loaded. For example you can have a 
recipe that is only loaded if a specific mod or group of mods are installed. This is especially useful when creating 
files to add compatibility with other mods. For example adding a recipe that incorporates modded ingredients, or adding
items to an item tag from another mod. Mods are specified using their mod ID which is case sensitive!

```json
{
  "type": "bookshelf:mod_loaded",
  "values": ["mod_a", "mod_b"]
}
```

### Registry Entry Exists
There are several conditions that check if registry entries exist. For example you can have a recipe that is only loaded
when a certain block or item exists. This is similar to the mod_loaded condition but allows you to be much more precise.
For example an older/newer version of a mod may not have the item you want to reference, so checking for the item would 
be more accurate. The values must be valid namespaced ids and can not contain upper case characters. If more than one 
entry is defined all entries must be registered for the condition to pass.

:::caution
Minecraft loads content in stages and some things will be registered before others. Trying to check a registry before it
has been initialized does not make sense and will not work. This is safe to use in recipe files as all registries should
be loaded at that time. 
:::

Here are a list of the supported registry conditions.
- bookshelf:block_exists
- bookshelf:item_exists
- bookshelf:enchantment_exists
- bookshelf:painting_exists
- bookshelf:mob_effect_exists
- bookshelf:potion_exists
- bookshelf:attribute_exists
- bookshelf:entity_exists
- bookshelf:block_entity_exists

```json
{
  "type": "bookshelf:item_exists",
  "values": ["minecraft:stick", "minecraft:apple"]
}
```

### And
The `bookshelf:and` condition checks if all sub-conditions are met. For example you can check the mod loader and if a 
specific mod is loaded. The and condition allows you to create complex condition logic.

```json
{
  "type": "bookshelf:and",
  "conditions": [
    {
      "type": "bookshelf:on_platform",
      "platform": "fabric"
    },
    {
      "type": "bookshelf:mod_loaded",
      "values": ["example_a"]
    }
  ]
}
```

### Or
The `bookshelf:or` condition checks if at least one of the sub-conditions are met. The or condition allows you to create
complex condition logic.

```json
{
  "type": "bookshelf:or",
  "conditions": [
    {
      "type": "bookshelf:on_platform",
      "platform": "neoforge"
    },
    {
      "type": "bookshelf:on_platform",
      "platform": "forge"
    }
  ]
}
```

### Not
The `bookshelf:not` condition checks if none of the sub-conditions are met. This allows you to invert conditions and 
create complex condition logic. If more than one condition is specified none of them can be met.

```json
{
  "type": "bookshelf:not",
  "conditions": [
    {
      "type": "bookshelf:on_platform",
      "platform": "forge"
    }
  ]
}
```

## Registering New Condition Types
Mods may want to add new load condition types to cover cases that are not built-in. Bookshelf exposes a simple API to 
add them! In this example we will create a condition that checks if a system property has been set. This guide assumes 
you are familiar with Java and have already added Bookshelf to your development environment. You should also be familiar
with Mojang's codec API.

### Creating the Condition
The first step is to create a class that implements `ILoadCondition`. This class is the type of condition object that 
will be deserialized from the JSON data. You should also create a codec that can construct your condition.

```java
public record PropertyCondition(String propertyName) implements ILoadCondition {

    public static Codec<PropertyCondition> CODEC = RecordCodecBuilder.create(instance -> instance.group(
            Codec.STRING.fieldOf("property").forGetter(PropertyCondition::propertyName)
    ).apply(instance, PropertyCondition::new));

    @Override
    public boolean allowLoading() {
        return System.getProperty(this.propertyName()) != null;
    }

    @Override
    public LoadConditions.ConditionType getType() {
        // TODO Do this after registering.
        return null;
    }
}
```

### Registering Condition Types
Registering the condition type is very simple, just call `LoadConditions#register` when loading your mod. The ID used 
here will be the type ID users will use in their JSON file. 3rd party projects should never use the `bookshelf` or 
`minecraft` namespace for their conditions. The codec is the codec used to deserialize your condition. This method will
return a `ConditionType` that you should assign to a static field. Your condition class should return this type from the
`getType` method.

```java
public static ConditionType propertyConditionType;
    
public static void main() {
    propertyConditionType = LoadConditions.register(new ResourceLocation("example", "property"), PropertyCondition.CODEC);
}
```

### Referencing New Condition Types
New condition types are referenced the same way built-in conditions are referenced. Simply use the type ID as the type 
in JSON and then define the properties as specified by your codec.

```json
{
  "type": "example:property",
  "property": "special_packs_enabled"
}
```