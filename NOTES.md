---
bitref: [3uFZETB,3K6Ms0A,3vfmW2U]
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

The [WordPress API](https://developer.wordpress.org/rest-api/) is required for frontity to work, so check that your locally created wordpress service has it working by appending `yoursite.local/wp-json`. It will return JSON like below if it works.

Then there needs to be configured permanent links to posts in some known pattern. The default is to simply use the post name, but it could also be date and post or some other pattern. Set it by going to `Settings => Permalinks` to set it like below.


## Integrate Frontity & WordPress

Now that each peice is working individually it's time to connect the two to start playing around with React JSX instead of PHP to transform content into web pages. To do this edit the `./frontity.settings.js` file like the comment below. **Don't** forget to add the `/wp-json` at the end as it is looking for the WordPress API endpoint.

```js
// change source URL in frontity.settings.js
const settings = {
  // ...,
  packages: [
    // ...,
    {
      name: "@frontity/wp-source",
      state: {
        source: {
          // Change this url to point to your WordPress site.
          api: "http://frontitytest.local/wp-json"
        }
      }
    }
  ]
}
```

Once this has been modified, both the Local server needs to be restarted and now the frontify version of the site should be displaying new posts from the WordPress test content. And if you check the navigation bar categories for **Nature, Travel, Japan, About Us** you'll get a 404 error because now frontity is looking to WordPress for content. Later we'll remove those categories.

### Updating Frontity's Hardcoded Menus

Until WordPress's [WP-REST-API V2 Menus][https://ve.wordpress.org/plugins/wp-rest-api-v2-menus/] gets more properly incorporated into the core API, let's stick with hardcoding menus for now. They won't change that often anyhow. However this is a bit of a strange method of doing this since content creators won't have menus that correspond to the final site's menus should they change it. More on that in another article.

The frontity mars theme used to bootstrap this website get hardcoded in the `./frontity.settings.js` file edited before under the `menu` property. Let's add some of the menus present in the fake WordPress data like below in frontity's settings file.

```js
// inside packages property of frontity.settings.js
{
  "name": "@frontity/mars-theme",
  "state"": {
    "theme": {
      "menu"": [
        ["Home", "/"],
        ["Block", "/category/block/"],
        ["Classic", "/category/classic/"],
        ["Alignments", "/tag/alignment-2/"],
        ["About", "/about/"]
      ],
      "featured": {
        "showOnList": true,
        "showOnPost": true
      }
    }
  }
},
```

With the changes saved, restart the wordpress development server to update the changes. And because the frontity settings are being changed, frontity needs to be manually reloaded. Components and theme scripts should hot reload automatically.

**TODO** screenshot of the updated nav menu items

### Frontity Folder Strucutre

The frontity demo project created here should now have two files in the project root `package.json` and `fronity.settings.js`, but also a falder `packages/mars-theme` which has all of the react code needed to create the theme *(WordPress speak for page templates)*. This is what the directory tree should look like.

```sh

├── README.md
├── build
│   ├── bundling
│   │   ├── chunks.module.json
│   │   └── entry-points
│   │       ├── marcusgrant.site
│   │       │   └── client.ts
│   │       └── server.ts
│   ├── server.js
│   └── static
│       ├── list.module.js
│       └── marcusgrant.site.module.js
├── favicon.ico
├── frontity.settings.js
├── package-lock.json
├── package.json
└── packages
    └── mars-theme
        ├── CHANGELOG.md
        ├── README.md
        ├── package.json
        ├── src
        │   ├── components
        │   │   ├── featured-media.js
        │   │   ├── header.js
        │   │   ├── index.js
        │   │   ├── link.js
        │   │   ├── list
        │   │   │   ├── index.js
        │   │   │   ├── list-item.js
        │   │   │   ├── list.js
        │   │   │   └── pagination.js
        │   │   ├── loading.js
        │   │   ├── menu-icon.js
        │   │   ├── menu-modal.js
        │   │   ├── menu.js
        │   │   ├── nav.js
        │   │   ├── page-error.js
        │   │   ├── post.js
        │   │   └── title.js
        │   └── index.js
        └── types.ts
```

## Editing Styles

Frontity makes use of [CSS-in-JS](https://cssinjs.org/?v=v10.6.0) and its derived library [Emotion](https://emotion.sh/docs/introduction) to style all React components. Styled components are similar to CSS in their explicit rule names. However they're defined inside JS files in JS datastructures making it easier to edit everything about a component in one file and to add programatic behavior to style rules. More details about them will come later.

The Frontity team details styling of components [here in their documentation](https://tutorial.frontity.org/part4-adding-styling). Let's keep it simple for now. Let's change the header's styling, specifically the the title and subtitle color. Change `./packages/mars-theme/src/components/header.js` to something like this code. 

```js
const Title = styled.h2`
  margin: 0;
  margin-bottom: 16px;
  color: #b8bb26;
`;

const Description = styled.h4`
  margin: 0;
  color: #d3869b;
`;
```

I like the [gruvbox](https://github.com/morhetz/gruvbox) color scheme if you couldn't already tell, and as we modify the style of this page you'll notice it getting more gruv-y colors. As you can see the `<Title>` component in the header now has a green heading text and the `<Description>` component below it purple.  

**TODO** insert screenshot with blue bg, green title and purple description

## Deploy WordPress Using Ansible & Docker

I'm a big proponent of Ansible for basically anything developer operations related. And it might be the best option for self hosting WordPress. There are however **far easier** options with Wordpress since it's the most popular CMS. Search for *managed WordPress providers* on your favorite search engine and pick one with a price and feature set favorable to you and skip this section if you prefer the managed approach.

Because WordPress is such a massive monolith of a software stack we're going to have to get a bit clever with how we deploy things. For example if we just download the official container then we don't get any plugins. It all starts with the Dockerfile.In the project root create a directory `./deploy` and inside a file called `Dockerfile`.

```Dockerfile
FROM wordpress:php7.4-apache
COPY packages/mars-theme /var/www/html/wp-content/themes/mars-theme/
# COPY plugins /var/www/html/wp-content/plugins/
```

This will copy over **everything** from this repository over to the container. This should be done when you're managing all the parts of WP with a container. 

This will copy over the theme and plugins to wordpress into the container. Note that this means that adding plugins means rebuilding the container but this is actually kind of nice because it keeps WordPress plugins and themes immutable and version controllable which can really help keep it stable and predictable.

To run the container a database container is also necessary and there we can just use the official `mysql:5.7` container.

