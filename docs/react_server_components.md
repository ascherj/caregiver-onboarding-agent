### View Rendered HTML Output from React Server Components

Source: https://react.dev/reference/rsc/server-components

This snippet shows the final HTML delivered to the client after Server Components have been rendered on the server. Notice that only the static, rendered content is present, not the original component logic or client-side JavaScript.

```html
<div>
  <span>By: The React Team</span>
  <p>React 19 is...</p>
</div>
```

--------------------------------

### Add Interactivity to React Server Components by Composing with Client Components

Source: https://react.dev/reference/rsc/server-components

This example illustrates how to introduce interactivity to Server Components by integrating them with Client Components. The `Notes` Server Component renders an `Expandable` Client Component, which uses `useState` for interactive behavior, enabled by the `"use client"` directive.

```javascript
// Server Component
import Expandable from './Expandable';

async function Notes() {
  const notes = await db.notes.getAll();
  return (
    <div>
      {notes.map(note => (
        <Expandable key={note.id}>
          <p note={note} />
        </Expandable>
      ))}
    </div>
  )
}
```

```javascript
// Client Component
"use client"

export default function Expandable({children}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
      >
        Toggle
      </button>
      {expanded && children}
    </div>
  )
}
```

--------------------------------

### Inspect Browser Output with Hydrated React Client Components

Source: https://react.dev/reference/rsc/server-components

This HTML snippet demonstrates the structure sent to the browser when Server Components compose with Client Components. It includes a script bundle for Client Components and placeholders for hydration, allowing interactive Client Components to rehydrate on the client side.

```html
<head>
  <!-- the bundle for Client Components -->
  <script src="bundle.js" />
</head>
<body>
  <div>
    <Expandable key={1}>
      <p>this is the first note</p>
    </Expandable>
    <Expandable key={2}>
      <p>this is the second note</p>
    </Expandable>
    <!--...-->
  </div>
</body>
```

--------------------------------

### Define an Async React Server Component for Data Fetching

Source: https://react.dev/reference/rsc/server-components

This JavaScript code demonstrates an asynchronous React Server Component that fetches data. It uses `await` to suspend rendering for critical data (`note`) and passes a promise for lower-priority data (`commentsPromise`) directly to a Client Component, leveraging `Suspense` for loading states.

```javascript
// Server Component
import db from './database';

async function Page({id}) {
  // Will suspend the Server Component.
  const note = await db.notes.get(id);

  // NOTE: not awaited, will start here and await on the client.
  const commentsPromise = db.comments.get(note.id);
  return (
    <div>
      {note}
      <Suspense fallback={<p>Loading Comments...</p>}>
        <Comments commentsPromise={commentsPromise} />
      </Suspense>
    </div>
  );
}
```

--------------------------------

### Define and Pass Server Function from Server Component to Client Component (React)

Source: https://react.dev/reference/rsc/server-actions

This example shows how to define an asynchronous Server Function using the 'use server' directive within a React Server Component. The function, 'createNoteAction', is then passed as a prop to a Client Component ('Button'), allowing the client to trigger server-side logic upon interaction.

```javascript
// Server Component

import Button from './Button';



function EmptyNote () {

  async function createNoteAction() {

    // Server Function

    'use server';



    await db.notes.create();

  }



  return <Button onClick={createNoteAction}/>;

}
```

```javascript
"use client";



export default function Button({onClick}) {

  console.log(onClick);

  // {$$typeof: Symbol.for("react.server.reference"), $$id: 'createNoteAction'}

  return <button onClick={() => onClick()}>Create Empty Note</button>

}
```

--------------------------------

### Perform Server-Side Data Fetching in React Server Components

Source: https://react.dev/reference/rsc/server-components

This code demonstrates how React Server Components can directly fetch data using `await` during the render phase. This approach eliminates the need for `useEffect` and avoids client-side data waterfalls, fetching data closer to the source and making it available immediately during render.

```javascript
import db from './database';

async function Note({id}) {
  // NOTE: loads *during* render.
  const note = await db.notes.get(id);
  return (
    <div>
      <Author id={note.authorId} />
      <p>{note}</p>
    </div>
  );
}

async function Author({id}) {
  // NOTE: loads *after* Note,
  // but is fast if data is co-located.
  const author = await db.authors.get(id);
  return <span>By: {author.name}</span>;
}
```

--------------------------------

### React Server Component for Build-Time Static Content Processing

Source: https://react.dev/reference/rsc/server-components

This React Server Component illustrates how to fetch and process static content directly at build time, eliminating the need for client-side data fetching and large library bundles. The `Page` component is an `async` function that reads content from the file system. Libraries like `marked` and `sanitize-html` are used during the build process and are not included in the final client-side bundle, resulting in a smaller download and immediate content display upon page load.

```javascript
import marked from 'marked'; // Not included in bundle

import sanitizeHtml from 'sanitize-html'; // Not included in bundle



async function Page({page}) {
  // NOTE: loads *during* render, when the app is built.
  const content = await file.readFile(`${page}.md`);



  return <div>{sanitizeHtml(marked(content))}</div>;
}
```

--------------------------------

### Define Server Function in React Server Component

Source: https://react.dev/reference/rsc/server-functions

This example demonstrates defining an asynchronous Server Function, `createNoteAction`, within a React Server Component. The function, marked with 'use server', performs a server-side database operation and is subsequently passed as a prop to a Client Component for execution.

```javascript
// Server Component
import Button from './Button';

function EmptyNote () {
  async function createNoteAction() {
    // Server Function
    'use server';

    await db.notes.create();
  }

  return <Button onClick={createNoteAction}/>;
}
```

--------------------------------

### Client-side Data Fetching with React Effect and API

Source: https://react.dev/reference/rsc/server-components

This example demonstrates a traditional client-side data fetching pattern in React without Server Components. The `Page` component uses `useEffect` to fetch content from a backend API after the initial render. It highlights that libraries for markdown parsing and HTML sanitization are included in the client bundle, leading to larger download sizes and delayed content display.

```javascript
// bundle.js

import marked from 'marked'; // 35.9K (11.2K gzipped)

import sanitizeHtml from 'sanitize-html'; // 206K (63.3K gzipped)



function Page({page}) {
  const [content, setContent] = useState('');
  // NOTE: loads *after* first page render.
  useEffect(() => {
    fetch(`/api/content/${page}`).then((data) => {
      setContent(data.content);
    });
  }, [page]);



  return <div>{sanitizeHtml(marked(content))}</div>;
}
```

```javascript
// api.js

app.get(`/api/content/:page`, async (req, res) => {
  const page = req.params.page;
  const content = await file.readFile(`${page}.md`);
  res.send({content});
});
```

--------------------------------

### Asynchronous React Server Component Using `cache`

Source: https://react.dev/reference/react/cache

This snippet provides a clear example of an asynchronous React Server Component that directly `await`s the result of a `cache`-memoized function. It highlights the capability for Server Components to perform data fetching within their render logic, relying on the `cache` to manage data retrieval and sharing.

```javascript
async function AnimatedWeatherCard({city}) {
	const temperature = await getTemperature(city);
	// ...

}
```

--------------------------------

### Handle Server Function Call in React Client Component

Source: https://react.dev/reference/rsc/server-functions

This React Client Component, `Button`, receives a Server Function via its `onClick` prop. When activated, it executes the provided Server Function, which triggers a server request. The `console.log` illustrates how a server reference appears on the client side.

```javascript
"use client";

export default function Button({onClick}) {
  console.log(onClick);
  // {$$typeof: Symbol.for("react.server.reference"), $$id: 'createNoteAction'}
  return <button onClick={() => onClick()}>Create Empty Note</button>
}
```

--------------------------------

### Share Memoized Data Fetches Across React Server Components with `cache`

Source: https://react.dev/reference/react/cache

This code demonstrates using React's `cache` API to memoize data fetches in Server Components, allowing the result to be shared across multiple component instances. Unlike `useMemo`, `cache` enables sharing fetched data across different components, preventing redundant network requests for the same data. The `cache` is invalidated across server requests, making it suitable for server-side data management.

```javascript
const cachedFetchReport = cache(fetchReport);  \n  \nfunction WeatherReport({city}) {  \n  const report = cachedFetchReport(city);  \n  // ...  \n}  \n  \nfunction App() {  \n  const city = "Los Angeles";  \n  return (  \n    <>  \n      <WeatherReport city={city} />  \n      <WeatherReport city={city} />  \n    </>  \n  );  \n}
```

--------------------------------

### Handle Server Function Return Values in React Forms using useActionState

Source: https://react.dev/reference/rsc/use-server

This set of examples illustrates how to handle return values from a Server Function in a React form while supporting progressive enhancement. The `requestUsername` Server Function returns a status, which is then consumed by a client component using the `useActionState` hook to update the UI based on the server's response.

```javascript
// requestUsername.js
'use server';

export default async function requestUsername(formData) {
  const username = formData.get('username');
  if (canRequest(username)) {
    // ...
    return 'successful';
  }
  return 'failed';
}
```

```javascript
// UsernameForm.js
'use client';

import { useActionState } from 'react';
import requestUsername from './requestUsername';

function UsernameForm() {
  const [state, action] = useActionState(requestUsername, null, 'n/a');

  return (
    <>
      <form action={action}>
        <input type="text" name="username" />
        <button type="submit">Request</button>
      </form>
      <p>Last submission request returned: {state}</p>
    </>
  );
}
```

--------------------------------

### Consume Server-Side Promise in React Client Component with use Hook

Source: https://react.dev/reference/rsc/server-components

This JavaScript Client Component, marked with `"use client"`, receives a promise initiated on the server. It utilizes React's `use` hook to await the resolution of this promise, allowing the component to suspend until the data is available without blocking the initial server-side render.

```javascript
// Client Component
"use client";
import {use} from 'react';

function Comments({commentsPromise}) {
  // NOTE: this will resume the promise from the server.
  // It will suspend until the data is available.
  const comments = use(commentsPromise);
  return comments.map(comment => <p>{comment}</p>);
}
```

--------------------------------

### Define a Server-Only React Component for Data Fetching

Source: https://react.dev/learn/start-a-new-react-project

This JavaScript code demonstrates a server-only React component (`Talks`) implemented as an asynchronous function. It fetches data directly from a database without needing a separate API endpoint, showcasing how server components can handle data-intensive operations and pass results to client components without increasing the client's JavaScript bundle size, aligning with the React Server Components specification.

```javascript
async function Talks({ confId }) {
  // 1. You're on the server, so you can talk to your data layer. API endpoint not required.
  const talks = await db.Talks.findAll({ confId });

  // 2. Add any amount of rendering logic. It won't make your JavaScript bundle larger.
  const videos = talks.map(talk => talk.video);

  // 3. Pass the data down to the components that will run in the browser.
  return <SearchableVideoList videos={videos} />;
}
```

--------------------------------

### Import and Use Server Function in Client Component (React)

Source: https://react.dev/reference/rsc/server-actions

This demonstrates how a Server Function, 'createNote', defined with 'use server' in a separate file, can be imported directly into a React Client Component. The Client Component can then invoke this server-side function, sending a request to the server to execute the logic.

```javascript
"use server";



export async function createNote() {

  await db.notes.create();

}
```

```javascript
"use client";

import {createNote} from './actions';



function EmptyNote() {

  console.log(createNote);

  // {$$typeof: Symbol.for("react.server.reference"), $$id: 'createNote'}

  return <button onClick={() => createNote()} />

}
```

--------------------------------

### Server-only React Component for Data Fetching

Source: https://react.dev/learn/creating-a-react-app

This example demonstrates an asynchronous React component designed to run exclusively on the server or during the build process, adhering to the React Server Components specification. It allows direct interaction with the data layer (e.g., database) without requiring an API endpoint, minimizing the client-side JavaScript bundle and passing fetched data to interactive browser components.

```javascript
// This component runs *only* on the server (or during the build).
async function Talks({ confId }) {
  // 1. You're on the server, so you can talk to your data layer. API endpoint not required.
  const talks = await db.Talks.findAll({ confId });

  // 2. Add any amount of rendering logic. It won't make your JavaScript bundle larger.
  const videos = talks.map(talk => talk.video);

  // 3. Pass the data down to the components that will run in the browser.
  return <SearchableVideoList videos={videos} />;
}
```

--------------------------------

### React Server Component for Data Fetching

Source: https://react.dev/reference/rsc/use-client

This component serves as a container for the `Counter` Client Component. It demonstrates a Server Component's ability to perform server-side operations, such as reading from the file system using `node:fs/promises`, and then passes the fetched data as props to a Client Component. It does not require a `'use client'` directive as it lacks client-side interactivity or hooks.

```jsx
import { readFile } from 'node:fs/promises';

import Counter from './Counter';



export default async function CounterContainer() {

  const initialValue = await readFile('/path/to/counter_value');

  return <Counter initialValue={initialValue} />

}
```

--------------------------------

### Define Exported Server Function for React Client Component Import

Source: https://react.dev/reference/rsc/server-functions

This code block defines an asynchronous Server Function, `createNote`, in a separate file. Marked with 'use server', it is designed to be exported and directly imported by Client Components to perform server-side database operations.

```javascript
"use server";

export async function createNote() {
  await db.notes.create();
}
```

--------------------------------

### Submit Form Data to React Server Function

Source: https://react.dev/reference/rsc/use-server

This example demonstrates how to use a Server Function directly as the `action` prop of an HTML form in React. When the form is submitted, the Server Function `requestUsername` is invoked with the form's `FormData` as its argument, enabling server-side data mutations with progressive enhancement.

```javascript
// App.js

async function requestUsername(formData) {
  'use server';
  const username = formData.get('username');
  // ...
}

export default function App() {
  return (
    <form action={requestUsername}>
      <input type="text" name="username" />
      <button type="submit">Request</button>
    </form>
  );
}
```

--------------------------------

### Define a Server Function with 'use server' directive in JavaScript

Source: https://react.dev/reference/rsc/use-server

This JavaScript code illustrates how to declare an asynchronous server function using the `'use server'` directive. When placed at the top of the function body, it enables the function to be invoked from client-side React code, facilitating server-side mutations. Arguments passed to such functions must be serializable and should be treated as untrusted input for security validation.

```javascript
async function addToCart(data) {

  'use server';

  // ...

}
```

--------------------------------

### Implement Client-Side Data Fetching in React with `useEffect` and Node.js API

Source: https://react.dev/reference/rsc/server-components

This example illustrates the traditional client-side data fetching pattern in React using `useEffect` for `Note` and `Author` components. It also includes the corresponding Node.js/Express API routes that serve this data, demonstrating the common client-server waterfall where data loads after the first render.

```javascript
// bundle.js

function Note({id}) {
  const [note, setNote] = useState('');
  // NOTE: loads *after* first render.
  useEffect(() => {
    fetch(`/api/notes/${id}`).then(data => {
      setNote(data.note);
    });
  }, [id]);

  return (
    <div>
      <Author id={note.authorId} />
      <p>{note}</p>
    </div>
  );
}

function Author({id}) {
  const [author, setAuthor] = useState('');
  // NOTE: loads *after* Note renders.
  // Causing an expensive client-server waterfall.
  useEffect(() => {
    fetch(`/api/authors/${id}`).then(data => {
      setAuthor(data.author);
    });
  }, [id]);

  return <span>By: {author.name}</span>;
}
```

```javascript
// api
import db from './database';

app.get(`/api/notes/:id`, async (req, res) => {
  const note = await db.notes.get(id);
  res.send({note});
});

app.get(`/api/authors/:id`, async (req, res) => {
  const author = await db.authors.get(id);
  res.send({author});
});
```

--------------------------------

### Render Client-Only Components with React Suspense and Server Fallback

Source: https://react.dev/reference/react/Suspense

To prevent certain components from rendering on the server (e.g., those dependent on the `window` object), wrap them in a `<Suspense>` boundary. Inside the component, throw an error if `window` is undefined, causing React to render the fallback on the server and the actual component on the client after hydration.

```jsx
<Suspense fallback={<Loading />}>
  <Chat />
</Suspense>

function Chat() {
  if (typeof window === 'undefined') {
    throw Error('Chat should only render on the client.');
  }
  // ...
}
```

--------------------------------

### Log React Server Components Crashes with onError

Source: https://react.dev/reference/react-dom/server/renderToReadableStream

This server handler illustrates how to implement custom error logging for crashes that occur during React server component rendering. It leverages the `onError` option within `renderToReadableStream` to capture errors, logging them to the console and invoking a custom `logServerCrashReport` function for centralized crash reporting.

```javascript
async function handler(request) {
  const stream = await renderToReadableStream(<App />, {
    bootstrapScripts: ['/main.js'],
    onError(error) {
      console.error(error);
      logServerCrashReport(error);
    }
  });
  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}
```

--------------------------------

### Call React Server Functions Outside Forms with useTransition

Source: https://react.dev/reference/rsc/use-server

This example demonstrates how to call a Server Function from client-side code, such as a button click, when not using a form. It uses React's `useTransition` hook to manage pending states, allowing for a loading indicator and smooth UI updates while the asynchronous Server Function is being executed.

```javascript
import incrementLike from './actions';
import { useState, useTransition } from 'react';

function LikeButton() {
  const [isPending, startTransition] = useTransition();
  const [likeCount, setLikeCount] = useState(0);

  const onClick = () => {
    startTransition(async () => {
      const currentCount = await incrementLike();
      setLikeCount(currentCount);
    });
  };

  return (
    <>
      <p>Total Likes: {likeCount}</p>
      <button onClick={onClick} disabled={isPending}>Like</button>;
    </>
  );
}
```

```javascript
// actions.js
'use server';

let likeCount = 0;
export default async function incrementLike() {
  likeCount++;
  return likeCount;
}
```

--------------------------------

### Server APIs for Web Streams

Source: https://react.dev/reference/react-dom/server

These APIs allow server-side rendering of React components to HTML using Web Streams. They are available in environments like browsers, Deno, and modern edge runtimes, offering progressive rendering capabilities.

```APIDOC
## FUNCTION renderToReadableStream

### Description
Renders a React tree to a Readable Web Stream, enabling progressive rendering and streaming HTML output in environments that support Web Streams.

### Method
Function Call

### Function
`renderToReadableStream(component, options?)`

### Parameters
#### Arguments
- **component** (ReactElement) - Required - The root React element you want to render to HTML.
- **options** (object) - Optional - An object that may contain optional properties like `signal` (an AbortSignal to abort rendering) or `nonce` (a string to allow trusted inline scripts).

### Request Example
```javascript
import { renderToReadableStream } from 'react-dom/server';
import App from './App'; // Your root React component

async function handleRequest(request) {
  const stream = await renderToReadableStream(<App />, {
    // signal: request.signal,
    // nonce: 'my-nonce-value'
  });
  return new Response(stream, {
    headers: { 'Content-Type': 'text/html' }
  });
}
```

### Response
#### Success Response
- **ReadableStream** (Web Stream) - A ReadableStream that emits the HTML output of your React component progressively.

#### Response Example
```javascript
// The stream will send chunks of HTML over time:
// <html><head></head><body><div id="root">...</div></body></html>
```

```

```APIDOC
## FUNCTION resume

### Description
Resumes `prerender` to a Readable Web Stream. This API is typically used in conjunction with React's experimental `prerender` API for hydration, allowing pre-rendered content to be resumed with streaming.

### Method
Function Call

### Function
`resume(prerenderResult)`

### Parameters
#### Arguments
- **prerenderResult** (object) - Required - The result object obtained from a call to the experimental `prerender` API.

### Request Example
```javascript
// This API is primarily for internal use by frameworks or build tools
// that leverage React's experimental prerendering capabilities.
// const prerenderResult = await prerender(<App />);
// const stream = await resume(prerenderResult);
```

### Response
#### Success Response
- **ReadableStream** (Web Stream) - A ReadableStream that emits the HTML output, resuming from a prerendered state.

#### Response Example
```javascript
// The stream will progressively output HTML, continuing from the prerendered content.
```

```

--------------------------------

### Using cacheSignal with React Server Components

Source: https://react.dev/blog/2025/10/01/react-19-2

Demonstrates how to use the `cacheSignal` API in React Server Components with the `cache()` function. This allows you to attach a signal to a cached fetch request, enabling cleanup or abortion of work when the cached result is no longer needed, such as after rendering completes or is aborted.

```javascript
import {cache, cacheSignal} from 'react';

const dedupedFetch = cache(fetch);



async function Component() {
	await dedupedFetch(url, { signal: cacheSignal() });
}
```

--------------------------------

### Correct React Component Usage of Shared Memoized Function

Source: https://react.dev/reference/react/cache

These snippets demonstrate how `Temperature` and `Precipitation` components correctly import and utilize a shared memoized function defined in a separate module. This approach allows both components to read from and write to the same cache, maximizing cache hits and reducing duplicate `calculateWeekReport` calls.

```javascript
// Temperature.js

import getWeekReport from './getWeekReport';



export default function Temperature({cityData}) {
	const report = getWeekReport(cityData);

  // ...

}
```

```javascript
// Precipitation.js

import getWeekReport from './getWeekReport';



export default function Precipitation({cityData}) {

  const report = getWeekReport(cityData);

  // ...

}
```

--------------------------------

### Legacy Server APIs for non-streaming environments

Source: https://react.dev/reference/react-dom/server

These older APIs render React components to a string, making them suitable for environments that do not support streams. They offer limited functionality compared to the newer streaming APIs, lacking progressive rendering and selective hydration features.

```APIDOC
## FUNCTION renderToString

### Description
Renders a React tree to a complete HTML string. This method is synchronous and does not support streaming or selective hydration, returning the full HTML output at once.

### Method
Function Call

### Function
`renderToString(component)`

### Parameters
#### Arguments
- **component** (ReactElement) - Required - The root React element you want to render to HTML.

### Request Example
```javascript
import { renderToString } from 'react-dom/server';
import App from './App'; // Your root React component

const html = renderToString(<App />);
console.log(html);
// Example output: '<div data-reactroot=""><h1>Hello, World!</h1></div>'
```

### Response
#### Success Response
- **string** - A string containing the full HTML representation of your React component, including React-specific attributes for hydration.

#### Response Example
```javascript
"<!DOCTYPE html><html><body><div id=\"root\" data-reactroot=\"\"><h1>Hello, Server!</h1></div></body></html>"
```

```

```APIDOC
## FUNCTION renderToStaticMarkup

### Description
Renders a non-interactive React tree to an HTML string. Similar to `renderToString` but it omits React-specific attributes (like `data-reactroot`), resulting in smaller HTML and potentially faster parsing. It's ideal for generating static content where hydration is not needed.

### Method
Function Call

### Function
`renderToStaticMarkup(component)`

### Parameters
#### Arguments
- **component** (ReactElement) - Required - The root React element you want to render to static HTML.

### Request Example
```javascript
import { renderToStaticMarkup } from 'react-dom/server';
import App from './App'; // Your root React component (assumed to be static)

const html = renderToStaticMarkup(<App />);
console.log(html);
// Example output: '<div><h1>Hello, Static!</h1></div>' (no data-reactroot)
```

### Response
#### Success Response
- **string** - A string containing the static HTML representation of your React component, without React-specific attributes.

#### Response Example
```javascript
"<!DOCTYPE html><html><body><div id=\"root\"><h1>Hello, Static!</h1></div></body></html>"
```

```

--------------------------------

### Server APIs for Node.js Streams

Source: https://react.dev/reference/react-dom/server

These APIs are designed for server-side rendering of React components to HTML using Node.js Streams. They offer optimized performance for Node.js environments and support pipeable streams for efficient data transfer.

```APIDOC
## FUNCTION renderToPipeableStream

### Description
Renders a React tree to a pipeable Node.js Stream, enabling progressive HTML output and selective hydration in Node.js environments.

### Method
Function Call

### Function
`renderToPipeableStream(component, options?)`

### Parameters
#### Arguments
- **component** (ReactElement) - Required - The root React element you want to render to HTML.
- **options** (object) - Optional - An object with various callbacks (`onAllReady`, `onShellReady`, `onShellError`, `onError`) and properties like `nonce` (string) or `identifierPrefix` (string).

### Request Example
```javascript
import { renderToPipeableStream } from 'react-dom/server';
import express from 'express';
import App from './App'; // Your root React component

const app = express();

app.get('/', (req, res) => {
  let didError = false;
  const { pipe, abort } = renderToPipeableStream(<App />,
    {
      onAllReady() {
        res.setHeader('Content-Type', 'text/html');
        res.statusCode = didError ? 500 : 200;
        pipe(res);
      },
      onShellError(err) {
        console.error(err);
        didError = true;
        res.statusCode = 500;
        res.send('<!doctype html><p>Loading Error</p>');
      },
      onError(err) {
        didError = true;
        console.error(err);
      }
    }
  );
  // Optional: Set a timeout to abort if rendering takes too long
  setTimeout(abort, 10000);
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

### Response
#### Success Response
- **object** - An object containing a `pipe` method (to connect the stream to a writable destination, e.g., an Express response object) and an `abort` method.

#### Response Example
```javascript
// The `pipe` method will write HTML directly to the provided writable stream (e.g., Node.js http.ServerResponse).
```

```

```APIDOC
## FUNCTION resumeToPipeableStream

### Description
Resumes `prerenderToNodeStream` to a pipeable Node.js Stream. Similar to `resume` for Web Streams, this is used with React's experimental `prerenderToNodeStream` API for hydration in Node.js environments.

### Method
Function Call

### Function
`resumeToPipeableStream(prerenderResult)`

### Parameters
#### Arguments
- **prerenderResult** (object) - Required - The result object obtained from a call to the experimental `prerenderToNodeStream` API.

### Request Example
```javascript
// This API is primarily for internal use by frameworks or build tools
// that leverage React's experimental prerendering capabilities in Node.js.
// const prerenderResult = await prerenderToNodeStream(<App />);
// const { pipe, abort } = resumeToPipeableStream(prerenderResult);
```

### Response
#### Success Response
- **object** - An object containing a `pipe` method and an `abort` method, allowing the Node.js stream to resume from a prerendered state.

#### Response Example
```javascript
// The `pipe` method will write HTML to the provided writable stream, continuing from the prerendered content.
```

```

--------------------------------

### Preloading Data in React Server Components with `cache`

Source: https://react.dev/reference/react/cache

This example demonstrates a strategy for preloading data using `cache` to improve perceived performance. By calling the memoized `getUser` function early in the `Page` component, the data fetch is initiated in parallel with other rendering work. When the `Profile` component later calls `getUser`, it can retrieve the data from the cache, potentially avoiding an additional network roundtrip.

```javascript
const getUser = cache(async (id) => {
  return await db.user.query(id);

});



async function Profile({id}) {
  const user = await getUser(id);

  return (

    <section>

      <img src={user.profilePic} />

      <h2>{user.name}</h2>

    </section>

  );

}



function Page({id}) {

  // ✅ Good: start fetching the user data

  getUser(id);

  // ... some computational work

  return (

    <>

      <Profile id={id} />

    </>

  );

}
```

--------------------------------

### Import and Use Server Function in React Client Component

Source: https://react.dev/reference/rsc/server-functions

This Client Component demonstrates how to import and directly invoke an exported Server Function, `createNote`, from a button click handler. The `console.log` output illustrates that even when imported, the function is represented as a server reference on the client.

```javascript
"use client";
import {createNote} from './actions';

function EmptyNote() {
  console.log(createNote);
  // {$$typeof: Symbol.for("react.server.reference"), $$id: 'createNote'}
  <button onClick={() => createNote()} />
}
```

--------------------------------

### React: Render Component to HTML String using renderToString

Source: https://react.dev/reference/react-dom/server/renderToString

This snippet demonstrates the basic usage of `renderToString` to convert a React component (reactNode) into an HTML string on the server. It illustrates how to import the function and pass a JSX component to it.

```javascript
const html = renderToString(reactNode, options?)
```

```javascript
import { renderToString } from 'react-dom/server';

const html = renderToString(<App />);
```

--------------------------------

### Convert React Class Component to Functional Component with Hooks for Chat Room

Source: https://react.dev/reference/react/Component

This complete functional `ChatRoom` component utilizes `useState` for managing local state (`serverUrl`) and `useEffect` for handling side effects related to the chat connection. It dynamically connects and disconnects based on `roomId` and `serverUrl` changes, providing a modern, hook-based approach equivalent to the class component's lifecycle methods. The component also includes a UI for changing the server URL.

```javascript
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

--------------------------------

### React Server Function Form Submission with Hidden Input

Source: https://react.dev/reference/react-dom/components/form

Illustrates how to handle form submissions using a Server Function (marked with `'use server'`) as the `action` prop. This example uses a hidden input field to pass additional data, like `productId`, to the server function via `formData`.

```jsx
import { updateCart } from './lib.js';



function AddToCart({productId}) {

  async function addToCart(formData) {

    'use server'

    const productId = formData.get('productId')

    await updateCart(productId)

  }

  return (

    <form action={addToCart}>

        <input type="hidden" name="productId" value={productId} />

        <button type="submit">Add to Cart</button>

    </form>



  );

}
```

--------------------------------

### Basic `cache(fn)` function wrapping in React Server Components

Source: https://react.dev/reference/react/cache

This snippet shows the basic syntax for using the `cache` utility. It takes a function `fn` as an argument and returns a memoized version of that function, `cachedFn`, which will store and reuse results for the same inputs.

```javascript
const cachedFn = cache(fn);
```

--------------------------------

### Implement Server Function as Action with useTransition (React)

Source: https://react.dev/reference/rsc/server-actions

This example illustrates using a Server Function, 'updateName', as an action within a Client Component's form. It integrates 'useTransition' to manage pending states during server-side execution, providing feedback to the user while the action is in progress.

```javascript
"use server";



export async function updateName(name) {

  if (!name) {

    return {error: 'Name is required'};

  }

  await db.users.updateName(name);

}
```

```javascript
"use client";



import {updateName} from './actions';



function UpdateName() {

  const [name, setName] = useState('');

  const [error, setError] = useState(null);



  const [isPending, startTransition] = useTransition();



  const submitAction = async () => {

    startTransition(async () => {

      const {error} = await updateName(name);

      if (error) {

        setError(error);

      } else {

        setName('');

      }

    })

  }



  return (

    <form action={submitAction}>

      <input type="text" name="name" disabled={isPending}/>

      {error && <span>Failed: {error}</span>}

    </form>

  )

}
```

--------------------------------

### Optimize React Component Re-renders with `memo`

Source: https://react.dev/reference/react/cache

This example demonstrates how to use React's `memo` higher-order component to prevent functional components from re-rendering if their props have not changed. `memo` performs a shallow comparison of props, leading to performance improvements by skipping unnecessary render cycles. It caches the last render result with the last prop values, invalidating the cache only when props change.

```javascript
'use client';

function WeatherReport({record}) {
  const avgTemp = calculateAvg(record);
  // ...
}

const MemoWeatherReport = memo(WeatherReport);

function App() {
  const record = getRecord();
  return (
    <>
      <MemoWeatherReport record={record} />
      <MemoWeatherReport record={record} />
    </>
  );
}
```

--------------------------------

### Using `cache(fn)` to memoize a function in a React Server Component

Source: https://react.dev/reference/react/cache

This example demonstrates how to import `cache` from 'react' and apply it to a utility function like `calculateMetrics`. The resulting `getMetrics` function can then be used within a React Server Component, such as `Chart`, to ensure `calculateMetrics` is only called when there's a cache miss for the given data.

```javascript
import {cache} from 'react';

import calculateMetrics from 'lib/metrics';



const getMetrics = cache(calculateMetrics);



function Chart({data}) {
  const report = getMetrics(data);
  // ...
}
```

--------------------------------

### Stream React Server Components Response to Client

Source: https://react.dev/reference/react-dom/server/renderToReadableStream

This asynchronous server handler demonstrates how to use `renderToReadableStream` to generate an HTML stream from a React application, enabling progressive rendering. It returns a new `Response` object with the generated stream, setting the `Content-Type` header to `text/html` for proper browser interpretation.

```javascript
async function handler(request) {
  const stream = await renderToReadableStream(<App />, {
    bootstrapScripts: ['/main.js']
  });
  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}
```

--------------------------------

### Call Server Function with `useTransition` in React Client Action

Source: https://react.dev/reference/rsc/server-functions

This Client Component showcases how to call a Server Function, `updateName`, from within a form's action handler using React's `useTransition` hook. It manages input state, handles pending states during the server call, and displays error feedback based on the Server Function's return value.

```javascript
"use client";

import {updateName} from './actions';

function UpdateName() {
  const [name, setName] = useState('');
  const [error, setError] = useState(null);

  const [isPending, startTransition] = useTransition();

  const submitAction = async () => {
    startTransition(async () => {
      const {error} = await updateName(name);
      if (error) {
        setError(error);
      } else {
        setName('');
      }
    })
  }

  return (
    <form action={submitAction}>
      <input type="text" name="name" disabled={isPending}/>
      {error && <span>Failed: {error}</span>}
    </form>
  )
}
```

--------------------------------

### Resolve Promise Directly in React Server Component with Await

Source: https://react.dev/reference/react/use

This example demonstrates resolving a Promise directly within a React Server Component using the `await` keyword. The resolved data is then passed as a standard prop to a Client Component. This approach, however, blocks the Server Component's rendering until the `await` operation completes.

```javascript
export default async function App() {
  const messageContent = await fetchMessage();
  return <Message messageContent={messageContent} />
}
```

--------------------------------

### Define a Basic React Component

Source: https://react.dev/reference/rsc/use-client

This snippet demonstrates how to define a simple functional React component. It's a standard JavaScript function that returns JSX, representing the component's structure and content. This component can be rendered on either the server or client depending on its usage context.

```javascript
// This is a definition of a component
function MyComponent() {
  return <p>My Component</p>
}
```

--------------------------------

### Sharing Data Snapshots Across React Components with `cache`

Source: https://react.dev/reference/react/cache

This example illustrates how the `cache` API can be used to share a snapshot of data between multiple components, particularly with asynchronous data-fetching functions. When `AnimatedWeatherCard` and `MinimalWeatherCard` call the same `getTemperature` function with identical arguments, `fetchTemperature` is invoked only once, and the result is cached and shared.

```javascript
import {cache} from 'react';

import {fetchTemperature} from './api.js';



const getTemperature = cache(async (city) => {
	return await fetchTemperature(city);

});



async function AnimatedWeatherCard({city}) {
	const temperature = await getTemperature(city);
	// ...

}



async function MinimalWeatherCard({city}) {
	const temperature = await getTemperature(city);
	// ...

}
```

--------------------------------

### React Server Function Form Submission with Bind Method

Source: https://react.dev/reference/react-dom/components/form

Presents an alternative method for passing extra arguments to a Server Function used as a form's `action`. The `bind` method is employed to supply arguments like `productId` directly to the server function, alongside the `formData`.

```jsx
import { updateCart } from './lib.js';



function AddToCart({productId}) {

  async function addToCart(productId, formData) {

    "use server";

    await updateCart(productId)

  }

  const addProductToCart = addToCart.bind(null, productId);

  return (

    <form action={addProductToCart}>

      <button type="submit">Add to Cart</button>

    </form>

  );

}
```

--------------------------------

### Incorrect React `cache` Usage in Component (Temperature.js)

Source: https://react.dev/reference/react/cache

This snippet demonstrates an anti-pattern where `cache` is called directly within a React component's render function. This leads to a new memoized function being created on every render, effectively negating the benefits of memoization and preventing any cache sharing between renders or components.

```javascript
// Temperature.js

import {cache} from 'react';

import {calculateWeekReport} from './report';



export function Temperature({cityData}) {

  // 🚩 Wrong: Calling `cache` in component creates new `getWeekReport` for each render

  const getWeekReport = cache(calculateWeekReport);

  const report = getWeekReport(cityData);

  // ...

}
```

--------------------------------

### Incorrect React `cache` Usage for Component-Local Memoization (Precipitation.js)

Source: https://react.dev/reference/react/cache

This snippet illustrates another incorrect usage where a memoized function is defined outside a component but within a component's file. While better than creating it on every render, this approach still isolates the cache to a single component file, preventing cache sharing with other components that might need the same data.

```javascript
// Precipitation.js

import {cache} from 'react';

import {calculateWeekReport} from './report';



// 🚩 Wrong: `getWeekReport` is only accessible for `Precipitation` component.

const getWeekReport = cache(calculateWeekReport);



export function Precipitation({cityData}) {

  const report = getWeekReport(cityData);

  // ...

}
```

--------------------------------

### Cache Asynchronous Data Fetching in React Server Components

Source: https://react.dev/reference/react/cache

This example demonstrates how to use React's `cache` API to memoize an asynchronous data fetching function. The first call to `getData()` initiates the fetch and caches the promise, allowing subsequent calls to retrieve the same promise and optimize waiting time if the promise is still pending or already settled. This pattern is particularly useful for sharing async work.

```javascript
async function fetchData() {  \n  return await fetch(`https://...`);  \n}  \n  \nconst getData = cache(fetchData);  \n  \nasync function MyComponent() {  \n  getData();  \n  // ... some computational work  \n  await getData();  \n  // ...  \n}
```

--------------------------------

### React Server: Render with `renderToPipeableStream` and dynamic `assetMap`

Source: https://react.dev/reference/react-dom/server/renderToPipeableStream

This server-side snippet shows how to integrate an `assetMap` with `renderToPipeableStream` to provide dynamically generated asset URLs to the root React component. The `assetMap` should be sourced from build tooling and passed as a prop to the `App` component, ensuring correct asset linking for server-rendered HTML.

```javascript
// You'd need to get this JSON from your build tooling, e.g. read it from the build output.
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

app.use('/', (request, response) => {
  const { pipe } = renderToPipeableStream(<App assetMap={assetMap} />, {
    bootstrapScripts: [assetMap['main.js']],
    onShellReady() {
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  });
});
```
