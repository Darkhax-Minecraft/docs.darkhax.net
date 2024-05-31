---
title: Dependency Info
description: Information about adding Bookshelf to your project as a dependency.
sidebar:
  order: 2
---
::cf-banner[]{p=228525}

## Gradle Dependency
This project is hosted on the BlameJared maven, you will need to add this repository to your Gradle configurations so it
can find and download the necessary files. 

```groovy
repositories {
    maven {
        url 'https://maven.blamejared.com'
    }
}

dependencies {
    // Pick the one for your platform. Common is Mojmap with no modloadr.
    // implementation "net.darkhax.bookshelf:Bookshelf-Common-1.20.4:23.0.8"
    // implementation "net.darkhax.bookshelf:Bookshelf-Fabric-1.20.4:23.0.8"
    // implementation "net.darkhax.bookshelf:Bookshelf-Forge-1.20.4:23.0.8"
    // implementation "net.darkhax.bookshelf:Bookshelf-NeoForge-1.20.4:23.0.8"
    implementation "net.darkhax.bookshelf:Bookshelf-PLATFORM-MC_VERSION:MOD_VERSION"
}
```