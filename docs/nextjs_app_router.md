### Using useRouter from next/compat/router for cross-directory compatibility

Source: https://github.com/vercel/next.js/blob/canary/docs/02-pages/04-api-reference/03-functions/use-router.mdx

This example demonstrates how to use `useRouter` from `next/compat/router` alongside `useSearchParams` for components designed to function in both `app` and `pages` directories. It explicitly handles the possibility of `router` being `null` when the Pages Router is not mounted, ensuring safe access to router properties and immediate availability of `searchParams` in the `app` directory.

```jsx
import { useEffect } from 'react'
import { useRouter } from 'next/compat/router'
import { useSearchParams } from 'next/navigation'
const MyComponent = () => {
  const router = useRouter() // may be null or a NextRouter instance
  const searchParams = useSearchParams()
  useEffect(() => {
    if (router && !router.isReady) {
      return
    }
    // In `app/`, searchParams will be ready immediately with the values, in
    // `pages/` it will be available after the router is ready.
    const search = searchParams.get('search')
    // ...
  }, [router, searchParams])
  // ...
}
```

--------------------------------

### Refactored component for App Router after removing compat router

Source: https://github.com/vercel/next.js/blob/canary/docs/02-pages/04-api-reference/03-functions/use-router.mdx

This snippet shows a component refactored for exclusive use within the Next.js `app` directory, where `next/compat/router` is no longer needed. It directly uses `useSearchParams` from `next/navigation`, simplifying the code as `app` directory components do not require the compatibility layer for router state or checks for `router` being null.

```jsx
import { useSearchParams } from 'next/navigation'
const MyComponent = () => {
  const searchParams = useSearchParams()
  // As this component is only used in `app/`, the compat router can be removed.
  const search = searchParams.get('search')
  // ...
}
```

--------------------------------

### Define Next.js App Router Home Page

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/testing/playwright.mdx

This `tsx` code creates the root page (`/`) for a Next.js application utilizing the App Router. It renders a main heading and includes a `Link` component to navigate to the `/about` page.

```tsx
import Link from 'next/link'

export default function Page() {
  return (
    <div>
      <h1>Home</h1>
      <Link href="/about">About</Link>
    </div>
  )
}
```

--------------------------------

### Update Next.js Version for App Directory Support

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/migrating/app-router-migration.mdx

This command updates the Next.js framework to the latest version (13.4 or greater) using npm, which is required to enable and utilize the new `app` directory features and functionalities.

```bash
npm install next@latest
```

--------------------------------

### Migrate `getStaticProps` and `getServerSideProps` to Next.js App Router `fetch`

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/migrating/app-router-migration.mdx

This snippet demonstrates how `fetch()` within an `async` React Server Component in the Next.js App Router can replicate the behavior of `getStaticProps` (force-cache), `getServerSideProps` (no-store), and `getStaticProps` with revalidation (next: { revalidate: N }) from the `pages` directory. It shows different caching strategies for data fetching directly within a page component.

```tsx
export default async function Page() {
  // This request should be cached until manually invalidated.
  // Similar to `getStaticProps`.
  // `force-cache` is the default and can be omitted.
  const staticData = await fetch(`https://...`, { cache: 'force-cache' })

  // This request should be refetched on every request.
  // Similar to `getServerSideProps`.
  const dynamicData = await fetch(`https://...`, { cache: 'no-store' })

  // This request should be cached with a lifetime of 10 seconds.
  // Similar to `getStaticProps` with the `revalidate` option.
  const revalidatedData = await fetch(`https://...`, {
    next: { revalidate: 10 },
  })

  return <div>...</div>
}
```

```jsx
export default async function Page() {
  // This request should be cached until manually invalidated.
  // Similar to `getStaticProps`.
  // `force-cache` is the default and can be omitted.
  const staticData = await fetch(`https://...`, { cache: 'force-cache' })

  // This request should be refetched on every request.
  // Similar to `getServerSideProps`.
  const dynamicData = await fetch(`https://...`, { cache: 'no-store' })

  // This request should be cached with a lifetime of 10 seconds.
  // Similar to `getStaticProps` with the `revalidate` option.
  const revalidatedData = await fetch(`https://...`, {
    next: { revalidate: 10 },
  })

  return <div>...</div>
}
```

--------------------------------

### Create Next.js App Router Home and About Pages

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/testing/cypress.mdx

Define basic Next.js pages for the App Router (`app/page.js` and `app/about/page.js`) including internal navigation links. These pages serve as the application under test for E2E navigation verification.

```jsx
import Link from 'next/link'

export default function Page() {
  return (
    <div>
      <h1>Home</h1>
      <Link href="/about">About</Link>
    </div>
  )
}
```

```jsx
import Link from 'next/link'

export default function Page() {
  return (
    <div>
      <h1>About</h1>
      <Link href="/">Home</Link>
    </div>
  )
}
```

--------------------------------

### Migrate `getServerSideProps` to Next.js App Router Server Component

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/migrating/app-router-migration.mdx

This example shows how to replicate `getServerSideProps` behavior in the Next.js App Router using an `async` React Server Component. Data fetching is co-located within the component using `fetch()` with the `cache: 'no-store'` option to ensure data is refetched on every request, providing server-side rendering similar to the `pages` directory approach.

```tsx
// `app` directory

// This function can be named anything
async function getProjects() {
  const res = await fetch(`https://...`, { cache: 'no-store' })
  const projects = await res.json()

  return projects
}

export default async function Dashboard() {
  const projects = await getProjects()

  return (
    <ul>
      {projects.map((project) => (
        <li key={project.id}>{project.name}</li>
      ))}
    </ul>
  )
}
```

```jsx
// `app` directory

// This function can be named anything
async function getProjects() {
  const res = await fetch(`https://...`, { cache: 'no-store' })
  const projects = await res.json()

  return projects
}

export default async function Dashboard() {
  const projects = await getProjects()

  return (
    <ul>
      {projects.map((project) => (
        <li key={project.id}>{project.name}</li>
      ))}
    </ul>
  )
}
```

--------------------------------

### Embed YouTube Video using YouTubeEmbed in Next.js (App Router & Pages Router)

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/third-party-libraries.mdx

This snippet demonstrates how to integrate and use the `YouTubeEmbed` component from `@next/third-parties/google` in a Next.js application. It supports both the App Router (`app/page.js`) and Pages Router (`pages/index.js`) patterns, allowing for quick embedding of YouTube videos with options for custom height and player parameters like `controls=0`. The component uses `lite-youtube-embed` under the hood for improved performance.

```jsx
import { YouTubeEmbed } from '@next/third-parties/google'

export default function Page() {
  return <YouTubeEmbed videoid="ogfYd705cRs" height={400} params="controls=0" />
}
```

```jsx
import { YouTubeEmbed } from '@next/third-parties/google'

export default function Page() {
  return <YouTubeEmbed videoid="ogfYd705cRs" height={400} params="controls=0" />
}
```

--------------------------------

### Configure Next.js `dynamic` Behavior for App Router Layouts, Pages, and Routes

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-api-reference/03-file-conventions/route-segment-config.mdx

The `dynamic` export configures the rendering and caching strategy for Next.js App Router layouts, pages, or route handlers. It accepts values like `'auto'`, `'force-dynamic'`, `'error'`, or `'force-static'` to control server-side rendering, data fetching, and caching behavior. This allows developers to fine-tune how routes interact with dynamic APIs and data, offering a migration path from the `pages` directory's `getServerSideProps` and `getStaticProps` models.

```tsx
export const dynamic = 'auto'
// 'auto' | 'force-dynamic' | 'error' | 'force-static'
```

```js
export const dynamic = 'auto'
// 'auto' | 'force-dynamic' | 'error' | 'force-static'
```

--------------------------------

### Define Next.js App Router About Page

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/testing/playwright.mdx

This `tsx` code establishes the `/about` page within a Next.js App Router setup. It displays an 'About' heading and provides a `Link` component for users to return to the home page.

```tsx
import Link from 'next/link'

export default function Page() {
  return (
    <div>
      <h1>About</h1>
      <Link href="/">Home</Link>
    </div>
  )
}
```

--------------------------------

### Perform Static Data Fetching in Next.js app directory with fetch()

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/migrating/app-router-migration.mdx

This example shows how to achieve static data fetching in the `app` directory using the native `fetch()` API. By default, `fetch()` requests are cached (`cache: 'force-cache'`), mimicking the behavior of `getStaticProps` for efficient build-time data retrieval.

```jsx
// `app` directory

// This function can be named anything
async function getProjects() {
  const res = await fetch(`https://...`)
  const projects = await res.json()

  return projects
}

export default async function Index() {
  const projects = await getProjects()

  return projects.map((project) => <div>{project.name}</div>)
}
```

--------------------------------

### Define GET API Route Handler in Next.js App Directory

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/migrating/app-router-migration.mdx

This snippet illustrates how to create a GET request handler using Route Handlers in the Next.js `app` directory. Route Handlers replace traditional API Routes and leverage Web Request and Response APIs for handling HTTP requests, supporting both TypeScript and JavaScript.

```ts
export async function GET(request: Request) {}
```

```js
export async function GET(request) {}
```

--------------------------------

### Configure i18n Redirects for Next.js App Router

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-api-reference/05-config/01-next-config-js/redirects.mdx

This configuration demonstrates how to set up redirects with i18n support in `next.config.js` specifically for the Next.js App Router. It illustrates hardcoded locale paths, dynamic locale parameters, cross-locale redirects, and catch-all redirects, as dynamic or per-request locale handling is not directly supported within `next.config.js` for App Router i18n.

```javascript
module.exports = {
  async redirects() {
    return [
      {
        // Manually handle locale prefixes for App Router
        source: '/en/old-path',
        destination: '/en/new-path',
        permanent: false,
      },
      {
        // Redirect for all locales using a parameter
        source: '/:locale/old-path',
        destination: '/:locale/new-path',
        permanent: false,
      },
      {
        // Redirect from one locale to another
        source: '/de/old-path',
        destination: '/en/new-path',
        permanent: false,
      },
      {
        // Catch-all redirect for multiple locales
        source: '/:locale(en|fr|de)/:path*',
        destination: '/:locale/new-section/:path*',
        permanent: false,
      },
    ]
  },
}
```

--------------------------------

### Force Dynamic Rendering in Next.js App Router with connection()

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/content-security-policy.mdx

This snippet shows how to explicitly opt a Next.js App Router page into dynamic rendering. By awaiting `connection()` from `next/server`, the page ensures that it waits for an incoming request, preventing static optimization and ensuring a fresh render for nonce-based Content Security Policies.

```tsx
import { connection } from 'next/server'

export default async function Page() {
  // wait for an incoming request to render this page
  await connection()
  // Your page content
}
```

```jsx
import { connection } from 'next/server'

export default async function Page() {
  // wait for an incoming request to render this page
  await connection()
  // Your page content
}
```

--------------------------------

### Using useRouter from next/router (Legacy Pages Router)

Source: https://github.com/vercel/next.js/blob/canary/docs/02-pages/04-api-reference/03-functions/use-router.mdx

This snippet shows the traditional way of using the `useRouter` hook from `next/router` to access router properties like `isReady` and `query`. This approach is primarily used in the `pages` directory and may cause errors if used directly in the `app` directory without proper checks, as it expects the Pages Router to be mounted.

```jsx
import { useRouter } from 'next/router'
const MyComponent = () => {
  const { isReady, query } = useRouter()
  // ...
}
```

--------------------------------

### Generate Static Parameters for Next.js `app` Directory with `generateStaticParams`

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/migrating/app-router-migration.mdx

This example illustrates how to use `generateStaticParams` in the Next.js `app` directory, which replaces `getStaticPaths` for defining static route parameters. It features a simplified API for returning an array of segment objects and shows an asynchronous function for fetching post data and rendering with `PostLayout`.

```jsx
// `app` directory
import PostLayout from '@/components/post-layout'

export async function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }]
}

async function getPost(params) {
  const res = await fetch(`https://.../posts/${(await params).id}`)
  const post = await res.json()

  return post
}

export default async function Post({ params }) {
  const post = await getPost(params)

  return <PostLayout post={post} />
}
```

--------------------------------

### Configure ISR-like Caching with Fetch in Next.js App Directory

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/migrating/app-router-migration.mdx

This example shows how to achieve a similar revalidation effect to ISR using the `fetch()` API in the Next.js `app` directory. By setting `next: { revalidate: 60 }`, the fetched data will be cached and revalidated after 60 seconds, providing fresh content.

```jsx
// `app` directory

async function getPosts() {
  const res = await fetch(`https://.../posts`, { next: { revalidate: 60 } })
  const data = await res.json()

  return data.posts
}

export default async function PostList() {
  const posts = await getPosts()

  return posts.map((post) => <div>{post.name}</div>)
}
```

--------------------------------

### Configure Next.js Link Component for Proxy Prefetching (App Router)

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-api-reference/02-components/link.mdx

This example demonstrates how to use the Next.js <Link /> component within the App Router to correctly prefetch routes that are managed by a proxy. It dynamically sets the 'href' prop based on user authentication while maintaining a consistent 'as' prop ('/dashboard'), preventing redundant fetches to the proxy during prefetching.

```tsx
'use client'

import Link from 'next/link'
import useIsAuthed from './hooks/useIsAuthed' // Your auth hook

export default function Page() {
  const isAuthed = useIsAuthed()
  const path = isAuthed ? '/auth/dashboard' : '/public/dashboard'
  return (
    <Link as="/dashboard" href={path}>
      Dashboard
    </Link>
  )
}
```

```js
'use client'

import Link from 'next/link'
import useIsAuthed from './hooks/useIsAuthed' // Your auth hook

export default function Page() {
  const isAuthed = useIsAuthed()
  const path = isAuthed ? '/auth/dashboard' : '/public/dashboard'
  return (
    <Link as="/dashboard" href={path}>
      Dashboard
    </Link>
  )
}
```

--------------------------------

### Implement Root Layout Component (App Directory)

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/migrating/app-router-migration.mdx

This JSX snippet shows a Server Component `layout.js` in the `app` directory, which imports and uses the `DashboardLayout` Client Component. This `layout.js` file now serves as the nested layout for the `/app/dashboard` route, replacing the `getLayout` pattern from the `pages` directory.

```jsx
import DashboardLayout from './DashboardLayout'

// This is a Server Component
export default function Layout({ children }) {
  return <DashboardLayout>{children}</DashboardLayout>
}
```

--------------------------------

### Create Next.js App Router POST API Route to Set Cookie

Source: https://context7.com/vercel/next.js/llms.txt

This TypeScript example demonstrates how to create a POST API route using the Next.js App Router. It sets a 'token' cookie on the response and returns a JSON message. Useful for authentication flows where a token needs to be stored client-side.

```typescript
// app/api/set-token/route.ts
import { NextResponse } from 'next/server'

export function POST() {
  const res = NextResponse.json({ message: 'successful' })
  res.cookies.set('token', 'this is a token')
  return res
}
```

--------------------------------

### Import custom polyfills in Next.js App Router

Source: https://github.com/vercel/next.js/blob/canary/docs/03-architecture/supported-browsers.mdx

To add custom polyfills in the App Router, import them into the `instrumentation-client.js` file. This ensures the polyfills are loaded before other application code that might rely on the new features.

```ts
import './polyfills'
```

--------------------------------

### Fetch Data with TypeScript in Next.js App Router

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-api-reference/05-config/02-typescript.mdx

This example demonstrates asynchronous data fetching within a Next.js App Router component using TypeScript. It highlights the App Router's capability to return complex types like Date, Map, or Set directly from server components without serialization, enhancing end-to-end type safety.

```tsx
async function getData() {
  const res = await fetch('https://api.example.com/...')
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.
  return res.json()
}

export default async function Page() {
  const name = await getData()

  return '...'
}
```

--------------------------------

### Create Next.js Root Layout in App Directory

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/migrating/app-router-migration.mdx

This code defines a root layout component for the `app` directory, which acts as the top-level UI wrapper for all pages and nested layouts. It is essential for defining the global structure, ensuring `<html>` and `<body>` tags are present, and accepting `children` to render nested content.

```tsx
export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

```jsx
export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

--------------------------------

### Import Tailwind CSS in Global CSS for App Router

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/01-getting-started/11-css.mdx

Import Tailwind CSS into your global CSS file (e.g., `app/globals.css`) within an App Router project. This step makes Tailwind's utility classes available throughout your application.

```css
@import 'tailwindcss';
```

--------------------------------

### Configure Tailwind CSS Content Path for Next.js App Directory

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/migrating/app-router-migration.mdx

When migrating to the Next.js `app` directory, it's essential to update your `tailwind.config.js` file. This configuration ensures that Tailwind CSS scans the new `app` directory for class names, preventing styles from being purged incorrectly.

```js
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}', // <-- Add this line
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
}
```

--------------------------------

### Define Page Component (App Directory, After Migration)

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/migrating/app-router-migration.mdx

This JSX snippet shows a simple page component in the `app` directory after migrating from the `pages` directory's `getLayout` pattern. In the `app` directory, layout concerns are handled by separate `layout.js` files, simplifying the page component itself.

```jsx
export default function Page() {
  return <p>My Page</p>
}
```

--------------------------------

### Example Page Component and Basic Test (App Router)

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/testing/jest.mdx

This section presents an example `Page` component for Next.js App Router and its corresponding test. The test renders the component using `@testing-library/react` and verifies that a heading element exists in the rendered output, illustrating how to test components in the App Router environment.

```jsx
import Link from 'next/link'

export default function Page() {
  return (
    <div>
      <h1>Home</h1>
      <Link href="/about">About</Link>
    </div>
  )
}
```

```jsx
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Page from '../app/page'

describe('Page', () => {
  it('renders a heading', () => {
    render(<Page />)

    const heading = screen.getByRole('heading', { level: 1 })

    expect(heading).toBeInTheDocument()
  })
})
```

--------------------------------

### Demonstrate Next.js Router.onAppUpdated for Page Redirection

Source: https://github.com/vercel/next.js/blob/canary/errors/no-on-app-updated-hook.mdx

This JavaScript snippet illustrates the usage of the now-removed `Router.onAppUpdated` hook in Next.js. It was commonly used to redirect the user to a new route upon app updates, but was limited as it could not handle asynchronous operations or block page navigation.

```js
Router.onAppUpdated = function (nextRoute) {
  location.href = nextRoute
}
```

--------------------------------

### Define Next.js App Router Page Component

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/testing/vitest.mdx

Defines a simple React component for a Next.js page following the App Router structure. This component renders a heading and a link, serving as a subject for unit testing with Vitest.

```typescript
import Link from 'next/link'

export default function Page() {
  return (
    <div>
      <h1>Home</h1>
      <Link href="/about">About</Link>
    </div>
  )
}
```

```javascript
import Link from 'next/link'

export default function Page() {
  return (
    <div>
      <h1>Home</h1>
      <Link href="/about">About</Link>
    </div>
  )
}
```

--------------------------------

### Implement Next.js App Router ISR with revalidate and generateStaticParams

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/incremental-static-regeneration.mdx

This example demonstrates Incremental Static Regeneration (ISR) using Next.js App Router. It defines `revalidate` to refresh data every 60 seconds and `generateStaticParams` to pre-render known blog post paths during build, fetching post data dynamically for display.

```tsx
interface Post {
  id: string
  title: string
  content: string
}

// Next.js will invalidate the cache when a
// request comes in, at most once every 60 seconds.
export const revalidate = 60

export async function generateStaticParams() {
  const posts: Post[] = await fetch('https://api.vercel.app/blog').then((res) =>
    res.json()
  )
  return posts.map((post) => ({
    id: String(post.id),
  }))
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const post: Post = await fetch(`https://api.vercel.app/blog/${id}`).then(
    (res) => res.json()
  )
  return (
    <main>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </main>
  )
}
```

```jsx
// Next.js will invalidate the cache when a
// request comes in, at most once every 60 seconds.
export const revalidate = 60

export async function generateStaticParams() {
  const posts = await fetch('https://api.vercel.app/blog').then((res) =>
    res.json()
  )
  return posts.map((post) => ({
    id: String(post.id),
  }))
}

export default async function Page({ params }) {
  const { id } = await params
  const post = await fetch(`https://api.vercel.app/blog/${id}`).then((res) =>
    res.json()
  )
  return (
    <main>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </main>
  )
}
```

--------------------------------

### Define dynamic href with object in Next.js Link (before fix)

Source: https://github.com/vercel/next.js/blob/canary/errors/app-dir-dynamic-href.mdx

This JSX code snippet demonstrates an incorrect way to define a dynamic href using an object with `pathname` and `query` properties for a `next/link` component. This pattern is not supported in the Next.js App Router and will cause an error.

```jsx
<Link
  href={{
    pathname: '/route/[slug]',
    query: { slug: '1' },
  }}
>
  link
</Link>
```

--------------------------------

### Configure ISR with getStaticProps in Next.js Pages Directory

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/migrating/app-router-migration.mdx

This snippet demonstrates how to implement Incremental Static Regeneration (ISR) in the Next.js `pages` directory using `getStaticProps`. By adding a `revalidate` field, the page will automatically regenerate after the specified number of seconds, fetching fresh data.

```jsx
// `pages` directory

export async function getStaticProps() {
  const res = await fetch(`https://.../posts`)
  const posts = await res.json()

  return {
    props: { posts },
    revalidate: 60,
  }
}

export default function Index({ posts }) {
  return (
    <Layout>
      <PostList posts={posts} />
    </Layout>
  )
}
```

--------------------------------

### Read Runtime Environment Variables in Next.js App Router

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/self-hosting.mdx

This code demonstrates how to safely read environment variables on the server during dynamic rendering within a Next.js App Router component. Using `connection` from 'next/server' ensures that dynamic APIs (like cookies, headers) are triggered, leading to runtime evaluation of `process.env` variables rather than build-time inlining.

```tsx
import { connection } from 'next/server'

export default async function Component() {
  await connection()
  // cookies, headers, and other Dynamic APIs
  // will also opt into dynamic rendering, meaning
  // this env variable is evaluated at runtime
  const value = process.env.MY_VALUE
  // ...
}
```

```jsx
import { connection } from 'next/server'

export default async function Component() {
  await connection()
  // cookies, headers, and other Dynamic APIs
  // will also opt into dynamic rendering, meaning
  // this env variable is evaluated at runtime
  const value = process.env.MY_VALUE
  // ...
}
```

--------------------------------

### Next.js Project Folder Structure Examples

Source: https://github.com/vercel/next.js/blob/canary/errors/prerender-error.mdx

Demonstrates the correct file structures for Next.js projects to avoid prerendering errors, differentiating between the Pages Router and the App Router. The Pages Router requires specific files in `pages/`, while the App Router allows colocation of components and pages.

```txt
  .
  ├── components/
  │   └── Header.js
  ├── pages/
  │   ├── about.js
  │   └── index.js
  └── styles/
      └── globals.css
```

```txt
  .
  └── app/
      ├── about/
      │   └── page.tsx
      ├── blog/
      │   ├── page.tsx
      │   └── PostCard.tsx
      ├── layout.tsx
      └── page.tsx
```

--------------------------------

### Create Next.js Client Component in App Directory (TSX/JSX)

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/migrating/app-router-migration.mdx

Demonstrates how to create a client-side component in the Next.js `app` directory. It uses the `'use client'` directive, receives data as props, and handles rendering logic, similar to components found in the `pages` directory.

```tsx
'use client'\n\n// This is a Client Component (same as components in the `pages` directory)\n// It receives data as props, has access to state and effects, and is\n// prerendered on the server during the initial page load.\nexport default function HomePage({ recentPosts }) {\n  return (\n    <div>\n      {recentPosts.map((post) => (\n        <div key={post.id}>{post.title}</div>\n      ))}\n    </div>\n  )\n}
```

```jsx
'use client'\n\n// This is a Client Component. It receives data as props and\n// has access to state and effects just like Page components\n// in the `pages` directory.\nexport default function HomePage({ recentPosts }) {\n  return (\n    <div>\n      {recentPosts.map((post) => (\n        <div key={post.id}>{post.title}</div>\n      ))}\n    </div>\n  )\n}
```

--------------------------------

### Add Tailwind CSS Directives to Global CSS for App Router

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/tailwind-v3-css.mdx

Include the `@tailwind` directives in your `app/globals.css` file. These directives inject Tailwind's base, components, and utility styles into your App Router project.

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

--------------------------------

### Access Request Data in Next.js pages with getServerSideProps

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/migrating/app-router-migration.mdx

This example demonstrates how to retrieve the Node.js HTTP `req` object within `getServerSideProps` in the `pages` directory. It shows accessing `authorization` headers and `theme` cookies, which are then available for server-side rendering.

```jsx
// `pages` directory

export async function getServerSideProps({ req, query }) {
  const authHeader = req.getHeaders()['authorization'];
  const theme = req.cookies['theme'];

  return { props: { ... }}
}

export default function Page(props) {
  return ...
}
```

--------------------------------

### Disable Nginx buffering for Next.js App Router streaming (next.config.js)

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/self-hosting.mdx

When using the Next.js App Router with streaming responses behind a proxy like Nginx, it's crucial to disable buffering to ensure real-time data delivery. This configuration adds an `X-Accel-Buffering: no` header to all responses, instructing Nginx to stream data without buffering. This setup is essential for self-hosted Next.js applications leveraging streaming.

```js
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*{/}?',
        headers: [
          {
            key: 'X-Accel-Buffering',
            value: 'no',
          },
        ],
      },
    ]
  },
}
```

--------------------------------

### Write Vitest unit test for Next.js App Router Page

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/testing/vitest.mdx

An example Vitest test file demonstrating how to render and assert elements within a Next.js App Router component. It uses `@testing-library/react` to render the component and checks for a specific heading.

```typescript
import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import Page from '../app/page'

test('Page', () => {
  render(<Page />)
  expect(screen.getByRole('heading', { level: 1, name: 'Home' })).toBeDefined()
})
```

```javascript
import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import Page from '../app/page'

test('Page', () => {
  render(<Page />)
  expect(screen.getByRole('heading', { level: 1, name: 'Home' })).toBeDefined()
})
```

--------------------------------

### Define dynamic href with query string in Next.js Link (before fix)

Source: https://github.com/vercel/next.js/blob/canary/errors/app-dir-dynamic-href.mdx

This JSX code snippet shows another incorrect method of defining a dynamic href for a `next/link` component using a query string in the path. This approach is also not supported in the Next.js App Router and will result in an error.

```jsx
<Link href="/route/[slug]?slug=1">link</Link>
```

--------------------------------

### Define direct path href in Next.js Link (after fix)

Source: https://github.com/vercel/next.js/blob/canary/errors/app-dir-dynamic-href.mdx

This JSX code snippet illustrates the corrected way to define an href for a `next/link` component in the Next.js App Router. It replaces the dynamic part of the path (`[slug]`) with the actual value, using a direct and static path, which resolves the 'Dynamic href is not Supported' error.

```jsx
<Link href="/route/1">link</Link>
```

--------------------------------

### Define Dynamic Paths for Pre-rendering with Next.js `getStaticPaths` (Pages Directory)

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/migrating/app-router-migration.mdx

This snippet demonstrates the use of `getStaticPaths` in the `pages` directory of Next.js to specify which dynamic routes should be pre-rendered at build time. It also includes a basic `getStaticProps` function for fetching data and a default export for rendering the post using a `PostLayout` component.

```jsx
// `pages` directory
import PostLayout from '@/components/post-layout'

export async function getStaticPaths() {
  return {
    paths: [{ params: { id: '1' } }, { params: { id: '2' } }],
  }
}

export async function getStaticProps({ params }) {
  const res = await fetch(`https://.../posts/${params.id}`)
  const post = await res.json()

  return { props: { post } }
}

export default function Post({ post }) {
  return <PostLayout post={post} />
}
```

--------------------------------

### Implement Next.js App Router POST API Route for On-Demand Revalidation

Source: https://context7.com/vercel/next.js/llms.txt

This TypeScript example shows an asynchronous POST API route in Next.js App Router for on-demand revalidation. It validates a secret header and then calls `revalidateTag` to update cached data. Ideal for integrating with CMS webhooks to trigger data revalidation.

```typescript
// app/api/revalidate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function POST(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const secret = requestHeaders.get("x-vercel-reval-key");

  if (secret !== process.env.CONTENTFUL_REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  revalidateTag("posts");

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
```

--------------------------------

### Import Global Styles in Next.js App Directory Layout

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/migrating/app-router-migration.mdx

This code demonstrates how to import global stylesheets within the `app/layout.js` file in the Next.js `app` directory. This approach allows global styles to be applied across the entire application, lifting the previous restriction of only using `_app.js` for global styles.

```jsx
import '../styles/globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

--------------------------------

### Implement Static Site Generation (SSG) in Next.js pages with getStaticProps

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/migrating/app-router-migration.mdx

This code demonstrates using `getStaticProps` in the `pages` directory to fetch data at build time. The fetched `projects` data is then passed as props to the `Index` page component, enabling static pre-rendering.

```jsx
// `pages` directory

export async function getStaticProps() {
  const res = await fetch(`https://...`)
  const projects = await res.json()

  return { props: { projects } }
}

export default function Index({ projects }) {
  return projects.map((project) => <div>{project.name}</div>)
}
```

--------------------------------

### Use Tailwind Classes in App Router Page Component

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/01-getting-started/11-css.mdx

Apply Tailwind's utility classes directly within your React components (e.g., `app/page.tsx`) in an App Router project. This demonstrates how to use the framework for styling elements like layout and typography.

```tsx
export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Welcome to Next.js!</h1>
    </main>
  )
}
```

```jsx
export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Welcome to Next.js!</h1>
    </main>
  )
}
```

--------------------------------

### Implementing `withRouter` for Next.js router access in a functional component

Source: https://github.com/vercel/next.js/blob/canary/docs/02-pages/04-api-reference/03-functions/use-router.mdx

Shows how to wrap a functional React component with Next.js `withRouter` higher-order component to inject the `router` object as a prop, allowing access to router properties like `pathname`.

```jsx
import { withRouter } from 'next/router'

function Page({ router }) {
  return <p>{router.pathname}</p>
}

export default withRouter(Page)
```

--------------------------------

### Enable Automatic Bundling for All Next.js Pages Router Dependencies

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/package-bundling.mdx

Set `bundlePagesRouterDependencies` to `true` in `next.config.js` to automatically bundle all external packages used by the Pages Router. This aligns the bundling behavior with the App Router's default, improving performance by ensuring all dependencies are processed.

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  bundlePagesRouterDependencies: true,
}

module.exports = nextConfig
```

--------------------------------

### Implement Per-Page Layout with getLayout (Pages Directory)

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/migrating/app-router-migration.mdx

This JSX snippet demonstrates the `getLayout` pattern used in the `pages` directory. A page component imports a layout component and assigns it to the `getLayout` property, allowing a custom layout to be applied per page. This pattern is replaced by native nested layouts in the `app` directory.

```jsx
import DashboardLayout from '../components/DashboardLayout'

export default function Page() {
  return <p>My Page</p>
}

Page.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>
}
```

--------------------------------

### Integrate Google Font in Next.js App Router Layout

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-api-reference/02-components/font.mdx

This code demonstrates how to use `next/font/google` to load the Inter font in a Next.js App Router `RootLayout`. The font is configured with Latin subsets and `display: 'swap'`, and then applied globally to the `<html>` element via `className`.

```TypeScript
import { Inter } from 'next/font/google'

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  )
}
```

```JavaScript
import { Inter } from 'next/font/google'

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  )
}
```

--------------------------------

### Migrate Next.js Deprecated `url` Prop to `withRouter` using Codemod

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/upgrading/codemods.mdx

The `@next/codemod url-to-withrouter` tool automates the migration of deprecated `url` properties on top-level Next.js pages. It replaces direct `this.props.url` access with the `withRouter` HOC, which injects a `router` object into the component props. This ensures compatibility with newer Next.js versions and best practices for router access.

```bash
npx @next/codemod url-to-withrouter
```

```js
import React from 'react'
export default class extends React.Component {
  render() {
    const { pathname } = this.props.url
    return <div>Current pathname: {pathname}</div>
  }
}
```

```js
import React from 'react'
import { withRouter } from 'next/router'
export default withRouter(
  class extends React.Component {
    render() {
      const { pathname } = this.props.router
      return <div>Current pathname: {pathname}</div>
    }
  }
)
```

--------------------------------

### Transform App Router runtime from experimental-edge to edge (Terminal, TypeScript)

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/upgrading/codemods.mdx

This codemod updates the `runtime` configuration in App Router segments from the `experimental-edge` value to the stabilized `edge` value. This change reflects the promotion of the Edge Runtime from experimental to general availability. It helps in modernizing the runtime declarations within your Next.js application.

```bash
npx @next/codemod@latest app-dir-runtime-config-experimental-edge .
```

```typescript
export const runtime = 'experimental-edge'
```

```typescript
export const runtime = 'edge'
```

--------------------------------

### Integrate Google Tag Manager with CSP in Next.js App Router

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/content-security-policy.mdx

This example demonstrates integrating Google Tag Manager into a Next.js App Router `RootLayout` while adhering to Content Security Policy (CSP). It retrieves a `nonce` from the request headers and passes it to the `@next/third-parties/google` `GoogleTagManager` component, allowing secure execution of the external script.

```tsx
import { GoogleTagManager } from '@next/third-parties/google'
import { headers } from 'next/headers'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const nonce = (await headers()).get('x-nonce')

  return (
    <html lang="en">
      <body>
        {children}
        <GoogleTagManager gtmId="GTM-XYZ" nonce={nonce} />
      </body>
    </html>
  )
}
```

```jsx
import { GoogleTagManager } from '@next/third-parties/google'
import { headers } from 'next/headers'

export default async function RootLayout({ children }) {
  const nonce = (await headers()).get('x-nonce')

  return (
    <html lang="en">
      <body>
        {children}
        <GoogleTagManager gtmId="GTM-XYZ" nonce={nonce} />
      </body>
    </html>
  )
}
```

--------------------------------

### Create Dynamic Segment Page in Next.js App Router

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/01-getting-started/03-layouts-and-pages.mdx

This code demonstrates how to create a dynamic segment in a Next.js App Router page. It defines an `async` Server Component that extracts a `slug` from the `params` prop to fetch specific post data and render its content. This pattern allows for generating routes based on external data.

```tsx
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPost(slug)

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </div>
  )
}
```

```jsx
export default async function BlogPostPage({ params }) {
  const { slug } = await params
  const post = await getPost(slug)

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </div>
  )
}
```

--------------------------------

### Next.js router.push to predefined route

Source: https://github.com/vercel/next.js/blob/canary/docs/02-pages/04-api-reference/03-functions/use-router.mdx

Shows how to use `router.push` to navigate to a predefined page route in Next.js, such as `/about`. It uses `useRouter` to get the router instance and attaches a click handler to a button.

```jsx
import { useRouter } from 'next/router'

export default function Page() {
  const router = useRouter()

  return (
    <button type="button" onClick={() => router.push('/about')}>
      Click me
    </button>
  )
}
```

--------------------------------

### Access Router Properties in Next.js using withRouter

Source: https://github.com/vercel/next.js/blob/canary/errors/url-deprecated.mdx

This code snippet demonstrates how to use the `withRouter` Higher-Order Component (HOC) from `next/router` to access the router object within a React class component. By wrapping the component with `withRouter`, the `router` object, containing properties like `pathname`, `asPath`, and `query`, is injected into the component's props, allowing explicit access to routing information.

```jsx
import { withRouter } from 'next/router'

class Page extends React.Component {
  render() {
    const { router } = this.props
    console.log(router)
    return <div>{router.pathname}</div>
  }
}

export default withRouter(Page)
```

--------------------------------

### Add global 'beforeInteractive' script in Next.js App Router

Source: https://github.com/vercel/next.js/blob/canary/errors/no-before-interactive-script-outside-document.mdx

This snippet demonstrates how to correctly place a global script using `next/script` with the `beforeInteractive` strategy within `app/layout.jsx` for Next.js App Router. This ensures the script loads before hydration for site-wide functionality.

```jsx
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
      <Script
        src="https://example.com/script.js"
        strategy="beforeInteractive"
      />
    </html>
  )
}
```

--------------------------------

### Initialize AppRouteRouteModule instance in JavaScript

Source: https://github.com/vercel/next.js/blob/canary/turbopack/crates/turbopack-ecmascript/tests/tree-shaker/analyzer/app-route/output.md

Initializes a new instance of `AppRouteRouteModule`, configuring it with route definition details such as kind, page path, and bundle path. This module encapsulates the logic for a specific application route and uses previously imported `AppRouteRouteModule` and `RouteKind`.

```javascript
const routeModule = new AppRouteRouteModule({
    definition: {
        kind: RouteKind.APP_ROUTE,
        page: 'VAR_DEFINITION_PAGE',
        pathname: 'VAR_DEFINITION_PATHNAME',
        filename: 'VAR_DEFINITION_FILENAME',
        bundlePath: 'VAR_DEFINITION_BUNDLE_PATH'
    },
    resolvedPagePath: 'VAR_RESOLVED_PAGE_PATH',
    nextConfigOutput,
    userland
});
```

--------------------------------

### Import Global CSS in Next.js App Router Root Layout

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/tailwind-v3-css.mdx

Import the global CSS file (`./globals.css`) containing Tailwind directives into your App Router's `app/layout.tsx` or `app/layout.js` component to apply styles globally.

```tsx
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

```jsx
import './globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

--------------------------------

### Configure specific weight Google Font in Next.js App Router

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-api-reference/02-components/font.mdx

This example illustrates how to import and apply a non-variable Google Font, such as Roboto, by explicitly defining its weight, for use in an App Router `layout.tsx` or `layout.js` file. This is required when not using a variable font to ensure proper rendering.

```typescript
import { Roboto } from 'next/font/google'

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={roboto.className}>
      <body>{children}</body>
    </html>
  )
}
```

```javascript
import { Roboto } from 'next/font/google'

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={roboto.className}>
      <body>{children}</body>
    </html>
  )
}
```
