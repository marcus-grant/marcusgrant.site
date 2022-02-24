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

