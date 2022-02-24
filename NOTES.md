# Blogging with Next.js & the JAMStack

Disorganized notes that will be synthesized into an article later on.

## Vaguely Ordered Notes

- Bootstrap nextjs
```sh
npx create-next-app marcusgrant.dev
```
- This will install these dependencies:
  - react
  - react-dom
  - next
- ... and these devDependencies
  - eslint
  - eslint-config-next
  - typescript
  - @types/react
  - @types/node

- Install some more dependencies
  - [gray-matter](https://www.npmjs.com/package/gray-matter)
    - Parse front matter from static files like markdown
  - [next-mdx-remote](https://www.npmjs.com/package/next-mdx-remote)
    - Allows loading MDX (MarkDown eXtended) content on server & client
  - [tailwindcss](https://www.npmjs.com/package/tailwindcss)
    - A great utility CSS framework, good for more customized styling
  - [postcss](https://www.npmjs.com/package/postcss)
    - A CSS developer tool that allows use of CSS in JS modules
    - Will be used to transform CSS from within Markdown extensions
  - [autoprefixer](https://www.npmjs.com/package/autoprefixer)
    - Post CSS library for parsing CSS & adding prefixes to CSS
  - [@tailwind/typography](https://www.npmjs.com/package/@tailwindcss/typography)
    - CSS classes that can be used to generate pretty typographic defaults

```sh
npm i gray-matter next-mdx-remote tailwindcss postcss autoprefixer @tailwindcss/typography
```

- Next, setup `postcss` & `tailwindcss` while creating default configuration files for both.

```sh
npx tailwindcss init -p
```

- Configure `tailwind.config.js`:

```js
module.exports = {
  plugins: [require('@tailwindcss/typography')],
  purge: ['./components/**/*.tsx', './pages/**/*.tsx'],
  variants: {},
  theme: {
    extend: {},
  },
  darkMode: false, 
};
```

- `purge` removes unused style when in production, very nice considering tailwind generates many atomic style rules

- Including `plugin`: `@tailwindscss/typography` enables the typography plugin, giving us pre-styled classes to make having nice typography easy

- Now the nextjs app entrypoint in `pages/_app.tsx` needs to import tailwind

```js
// top of pages/_app.tsx
import 'tailwindcss/tailwind.css';
// ... rest of the component file ...
```

### Static File Utility Functions

- To help perform tasks such as getting posts, post content, metadata, and single pages from markdown files we'll want some helper functions get the job done.

- Create new directory in project root, let's call it `util`, with the below contents in file `util/mdxUtils.ts`:

```ts
import matter from 'gray-matter';
import {join} from 'path';
import fs from 'fs';
import { verify } from 'crypto';

// Content items type to represent a single peice of content
type ContentItem =  {
    // each item has a string to string key value pair
    [key: string] : string
}

// A Post, the basic element of a blog
type Post = {
    data:{
        // Each post has a parameter key that takes the value of a string
        [key: string] : string
    };
    // Each post will include the post content associated with its parameter key
    content: string
}

// Path to all markdown files representing posts
const POSTS_PATH = join(process.cwd(),'_posts');

// Get all file paths to every markdown (post)
function getPostsFilePaths(): string[]{
    return (
        // Return mdx file in posts path
        fs.readdirSync(POSTS_PATH)
        // load post content from mdx file
        .filter((path) => /\.mdx?$/.test(path))
    )
}

// Get a single post
export function getPost(slug:string):Post {
    // Extract path to single post
    const fullPath = join(POSTS_PATH,`${slug}.mdx`);
    // Extract file contents of the post
    const fileContents = fs.readFileSync(fullPath,'utf-8');
    // Parse frontmatter metadata and markdown contents
    const {data,content} = matter(fileContents);
    // Return data and content of post in an object
    return { data,content };
}

// Load Post's ContentItems
export function getPostContentItem(filePath:string,fields:string[] = []): Items{
    // Use a slug to hold the mdx file location
    const slug = filePath.replace(/\.mdx?$/,"");
    // Extract frontmatter and post data
    const {data,content} = getPost(slug);

    const items: ContentItem = {};

    // Load and pass on the content
    fields.forEach((field) => {
        // Load the slug
        if(field === 'slug'){
            items[field] = slug;
        }
        // Load the post content
        if(field === 'content'){
            items[field] = content;
        }
        // Check if above field exists in data
        if(data[field]){
            // Verify field has data
            items[field] = data[field];
        }
    });
    // Return the post item
    return items;
}

// Now tie it all together to get all posts
export function getAllPosts(fields: string[]): ContentItem []{
    // Add paths for all posts
    const filePaths = getPostsFilePaths();
    // Get posts from files' paths w/ needed fields sorted by date
    const posts = filePaths
      .map((filePath) => getPostItems(filePath, fields))
      .sort((post1, post2) => (post1.date > post2.date ? 1 : -1));
    // return the available post
    return posts;
}
```

- This creates the new functions `getAllPosts(), getPostItems, getPost(), and getPostsFilePaths()`

- Now it's easy to just call any of these functions to get all the data `nextjs` needs to create blog posts.

### First Version of First Components

Create a directory for the components



