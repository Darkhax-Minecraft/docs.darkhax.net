# Darkhax Mod Docs
This repo houses the source code for [docs.darkhax.net](https://docs.darkhax.net).

## Project Structure
This website is a composite of several projects. Each project exists as a branch on this git repository. A full deploy
of this website requires building and deploying all of these projects.

### Main Branch
The main branch is responsible for building the content at the root of the `docs.darkhax.net` site. This includes the
version selector, legal disclaimers, and files like robots.txt and the main sitemap.

### Versioned Branch
Versioned branches like `1.20.1` contain a separate instance of the website that only contains content for a specific 
game version. These branches are deployed to `docs.darkhax.net/version_branch_name`, for example the `1.20.1` branch 
should deploy to `docs.darkhax.net/1.20.1`. Versioned branches contain a modified copy of the starlight project from the 
`main` branch.