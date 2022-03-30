---
tref: https://bit.ly/3uFZETB
---
# Creating a JAMStack Site with React + Wordpress = Frontity

## Frontity Overview

**TODO** Write informative introduction.

## Prerequisites

Frontity is a react based framework, so it's being assumed here that you have a working knowledge of React, Javascript, ES6, and as a bonus webpack. Knowing Wordpress beyond vague familiarity is not necessary and in fact here we will setup a local developer instance of it and deploy production versions of it.

## So What is Frontity?

**TODO** detailed overview of frontity architecture, especially the different nodes and their relation to a wordpress service.

## Install a Local Version of Frontity for Developers

Let's begin by installing a developer version of a frontity project site and dockerized wordpress installation to bring up to test out and develop the site locally. Later we'll go over how to deploy this for a production server. Before doing anything with frontity, make sure you have a somewhat recent version of node, npm then install frontity globally through npm.

```sh
node --version  # check node version
npm -- version  # check npm version
npm install -g npm@latest # update to latest npm version
# install frontity globally so it can bootstrap the project
npm install -g frontity   
```

### Create the Frontity Project

Now bootstrap a new frontity project with the name `marcusgrant.site` using `npx frontity create`:

```sh
### Bootstrap the frontity project
npx frontity create marcusgrant.site
```

This should a little something like this terminal output:

```sh
❯ npx frontity create marcusgrant.site
? Pick a starter theme to clone: @frontity/mars-theme (recommended)
✔ Creating README.md.
✔ Creating package.json.
✔ Creating frontity.settings.js.
✔ Cloning @frontity/mars-theme.
✔ Installing dependencies.
✔ Downloading favicon.ico.
✔ Initializing git repo.

Frontity project created.


Run cd marcusgrant.site && npx frontity dev and have fun! 🎉

You can find docs at https://docs.frontity.org/.
For technical support and assistance please join our community at https://community.frontity.org/.
```

It will ask you some questions about how you want to setup the project, most should be fairly obvious, but it will also ask you what theme to use. As of this writing there's two themes [twentytwenty-theme](https://api.frontity.org/frontity-packages/themes-packages#twenty-twenty-frontity-theme) & [mars-theme](https://api.frontity.org/frontity-packages/themes-packages#mars-theme). For starters the mars-theme is generally recommended.

### Check Everything is Working

When it's done building it will give you a little prompt about going into the new project folder and starting the development server which will be a nice opportunity to check everything works and to see what this is all about. So go into the new project directory and start the dev server with the npm run script `dev`.

```sh
cd marcusgrant.site
npm run dev
```

This should open your default browser up to the development version of the bootstrapped frontity project and it should look a little something like the screenshot below. If it doesn't open a browser by itself you can just open a new tab and point your browser to <http://localhost:3000>. **Note** this isn't actually a real wordpress site, in the next section a development version of one will be installed. This is just a mock site.

**TODO** Insert a screen shot of the default mars-themed bootstrapped frontity project.

## Wordpress Installation

Next a WordPress site is needed to act as our site's data source and content API. This could be a pre-existing WordPress site if you already have one, or in this case a locally installed instance that will be used for testing and development. There's actually a pretty great tool for this that doesn't require docker, which on my MacBook Air which doesn't have native docker is quite nice to have, it's called [Local](https://localwp.com/). Install it, give your new local wordpress site a good name and password for the database and remember them.

Next, to be able to tell the difference between the frontity content and the wordpress content, using the WordPress team's own [test environment](https://raw.githubusercontent.com/WPTT/theme-unit-test/master/themeunittestdata.wordpress.xml) is really useful. Start by going to `your-local-wordpress-site.local/admin` in your browser, then enter your login information you registered just a moment ago, go into the admin panel on the left then `Tools => Import => WordPress`.

