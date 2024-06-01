---
title: FaQ
description: Answers to common questions about the Prickle config format.
---

## What is Prickle?
Prickle is a lightweight configuration format based on the JSON format. It aims to be simple, accessible to every day 
users, and be easy to generate and parse using code.

## Why is it called Prickle?
Prickle is the collective noun for a group of hedgehogs. Hedgehogs are one of my favourite animals and I think they are
an oddly fitting metaphor for configuration files. For example both may seem intimidating at first but can be really 
cool once you get to know them.

## Why not use an existing format?
Before working on Prickle I spent several months test driving existing formats and libraries. While there are several 
formats that I really liked I was disappointed with the available libraries. Every library that I tried had serious long
standing bugs, was not being maintained, and lacked features that were important to me. After weighing my options I 
realized JSON could easily meet all of my criteria and had many tools and libraries already available.

## Why use JSON as the base?
My specific use case for Prickle is configuration files for Minecraft mods. Minecraft already bundles Google's GSON 
library and has built in JSON serializers for most data types in the game. Minecraft already uses JSON for some of their
in-game commands and their resource pack and data pack systems. This makes JSON a great choice and users should be 
reasonably familiar with JSON and tools to work with JSON files.