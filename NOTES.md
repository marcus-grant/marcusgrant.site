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

## Static File Utility Functions

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

## First Version of First Components

Create a directory for the components in the root of the project. Then make three new files using `touch` for `header.tsx`, `thumbnail.tsx`, `layout.tsx`.

```sh
# Make the components directory
mkdir ./components
# Make three empty files
touch ./components/{header,thumbnail,layout}.tsx
```

### Header Component

Now with an empty header component file, let's edit `./components/header.tsx`.

```tsx
import Link from 'next/link';

const Header: React.FC = () => {
  return (
    <header className="py-2">
      <Link href="/">
        <h1>
          <a className="text-green-700">
            A NextJS & MDX Static Site
          </a>
        </h1>
      </Link>
    </header>
  );
};

export default Header;
```

It's just a fairly basic header with the inclusion of NextJS's `Link` component to manage routing so that the title of the header leads to the root of the site via `href="/"`. Next let's make the site's header actually render by placing it in the `./pages/index.tsx` index file by adding the below lines to the automatically generated NextJS one.

```tsx
// Rest of the imports ...
import Header from '../components/header'
// ... Inside the NextPage component's return after the Head component
<Header />
```

This should look something like this for the first few lines.

```tsx
import type { NextPage } from 'next'
import Head from 'next/head'
import Header from '../components/header'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* Our new header component added below */}
      <Header />
      {/* ... Rest of the generated next js site ... */}
```

### Thumbnail Component

Here is a quick Thumbnail component to be used as cover images for article previews.

```tsx
// import nextjs link artifacts
import Link from 'next/link';
// import nextjs image artifacts
import Image from 'next/image';

// Thumbnail props
type Props = {
    // Thumbnail title
    title: string;
    // Thumbnail image src
    src: string;
    // Thumbnail slug link
    slug?:string;
}

const Thumbnail: React.FC<Props> = ({ title, src, slug}: Props) => {
  // Add the Thumbnail cover image
    const image = (
        <Image
        height={720}
        width={1280}
        src={src}
        alt={`Thumbnail cover image ${title}`}
        />
    );

    // return the Thumbnail cover image slug
    return (
        <>
            {slug ? (
                <Link href={`/posts/${slug}`}>
                < aaria-label={title}>{image}</a>
                </Link>
            ) : (
                image
            )}
        </>
    )
}

// export Thumbnail module
export default Thumbnail;
```

### Layout Component

To standardize the layout of every page, the `./components/layout.tsx` component will be created to encapsulate all that markup, styling and if any dynamic behavior. Each page will use the `./components/header.tsx` component created before like this.

```tsx
import Header from './Header';

type Props = {
    children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }: Props) => {
    return (
        <>
            <div className="max-w-prose mx-auto px-4" id="page-layout">
                <Header />
                <main className="pt-4 pb-12">{children}</main>
            </div>
        </>
    )
}

export default Layout;
```

Then let's add it to the `./pages/index.tsx` page instead of the old `<Header />` component that we placed there. But also, it should be a block component wrapping all content after it. This will include the `<main>` and `<footer>` elements since those are part of a page layout. In the future a footer and main layout will be added to this layout component.


```tsx
// ... rest of the index page
// return statement of the generated NextPage component
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
          <main className={styles.main}>
            <h1 className={styles.title}>
              Welcome to <a href="https://nextjs.org">Next.js!</a>
            </h1>

            <p className={styles.description}>
              Get started by editing{' '}
              <code className={styles.code}>pages/index.tsx</code>
            </p>

            <div className={styles.grid}>
              <a href="https://nextjs.org/docs" className={styles.card}>
                <h2>Documentation &rarr;</h2>
                <p>Find in-depth information about Next.js features and API.</p>
              </a>

              <a href="https://nextjs.org/learn" className={styles.card}>
                <h2>Learn &rarr;</h2>
                <p>Learn about Next.js in an interactive course with quizzes!</p>
              </a>

              <a
                href="https://github.com/vercel/next.js/tree/canary/examples"
                className={styles.card}
              >
                <h2>Examples &rarr;</h2>
                <p>Discover and deploy boilerplate example Next.js projects.</p>
              </a>

              <a
                href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                className={styles.card}
              >
                <h2>Deploy &rarr;</h2>
                <p>
                  Instantly deploy your Next.js site to a public URL with Vercel.
                </p>
              </a>
            </div>
          </main>

          <footer className={styles.footer}>
            <a
              href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              Powered by{' '}
              <span className={styles.logo}>
                <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
              </span>
            </a>
          </footer>
      </Layout>
    </div>
  )
```
**TODO** Add preview image nextjs-blog-screenshot-layout-component.png in documents.

## The First Blog Post

<!-- Reference -->
<!-- Site: https://bit.ly/3IHKMZJ -->
