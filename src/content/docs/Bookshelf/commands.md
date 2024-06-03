---
title: Commands
description: A guide to the types of commands added by Bookshelf.
sidebar:
  order: 2
---
::cf-banner[]{p=228525}

Bookshelf adds several commands that are useful when creating or debugging modded content. These commands are enabled
by default and can be used by players in single player or a server if they have the right permission level.

## Command Syntax

Our commands follow the standard Java Edition command syntax.

|     Syntax     | Meaning                                                                 |
|:--------------:|:------------------------------------------------------------------------|
|  `plain_text`  | The text should be entered exactly as shown.                            |
|  `<required>`  | An argument that is required. Replace this with an appropriate value.   |
|  `[optional]`  | An argument that is optional. The command will still work without this. |
| `(arg1\|arg2)` | A required argument that must be one of the provided values.            |
| `[arg1\|arg2]` | An optional argument that must be one of the provided values.           |
|     `...`      | Another sub-command is required to continue.                            |

## Commands

### Hand

The hand command allows you to quickly learn more about the item you are holding. Clicking the output text will copy it
to your clipboard. This command can be used by all players.

`/bookshelf hand <data_type>`

The `data_type` must be one of the following.

- `STRING` - A Java string representation of the ItemStack.
- `INGREDIENT` - A JSON object for an Ingredient that can be used in data packs.
- `STACK_JSON` - A JSON object for an ItemStack that be be used in data packs.
- `SNBT` - The NBT of the ItemStack in SNBT format.
- `ID` - The namespaced ID of the item.
- `TAGS` - A list of item tags that the item has been registered to.
 
### Font
The font command allows you to use and modify text with alternative game fonts. These commands can only be used by 
players with vanilla permission level 2. This is the same permission level that gives players access to command blocks.

- `/bookshelf font item <font_id>` - Applies the font to the text styling of the held items display name.
- `/bookshelf font block <font_id>` - Applies the font to the styling of the block. This only works if the block has 
  text that can be styled. For example signs or nameable containers like chests.
- `/bookshelf font book <font_id>` - Applies the font to the styling of a held written book.
- `/bookshelf font say <font_id>` - Writes a message in chat that has been styled using the font.