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

### React Client Component Using DOM APIs

Source: https://react.dev/reference/rsc/use-client

This `Circle` component exemplifies a React Client Component that directly interacts with browser-specific APIs, specifically the DOM `canvas` element. It uses `useRef` to access the canvas element and `useLayoutEffect` to draw a circle, making the `'use client'` directive essential as these APIs are only available in the browser environment.

```jsx
'use client';



import {useRef, useLayoutEffect} from 'react';



export default function Circle() {

  const ref = useRef(null);

  useLayoutEffect(() => {

    const canvas = ref.current;

    const context = canvas.getContext('2d');

    context.reset();

    context.beginPath();

    context.arc(100, 75, 50, 0, 2 * Math.PI);

    context.stroke();

  });

  return <canvas ref={ref} />;

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

### React Component Renderable on Client or Server

Source: https://react.dev/reference/rsc/use-client

This `FancyText` component is an example of a universal React component that can be rendered on either the server or the client. It does not use any client-specific hooks or server-specific data fetching, allowing it to function without the `'use client'` directive and render its output efficiently based on where it's imported.

```jsx
export default function FancyText({title, text}) {

  return title

    ? <h1 className='fancy title'>{text}</h1>

    : <h3 className='fancy cursive'>{text}</h3>

}
```

--------------------------------

### Mark React Component as Client Code with 'use client'

Source: https://react.dev/reference/rsc/use-client

This JavaScript snippet illustrates the placement of the `'use client'` directive at the very top of a file, marking the `RichTextEditor` component and its imported dependencies (`useState`, `formatDate`, `Button`) as client-side code. This is crucial for integrating interactive features in React Server Components applications. The directive must precede any imports or other code.

```javascript
'use client';

import { useState } from 'react';
import { formatDate } from './formatters';
import Button from './button';

export default function RichTextEditor({ timestamp, text }) {
  const date = formatDate(timestamp);
  // ...
  const editButton = <Button />;
  // ...
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

### React Client Component for Interactive Counter

Source: https://react.dev/reference/rsc/use-client

This React component demonstrates a basic interactive counter. It uses the `useState` hook for managing its internal state and handles user input via `onClick` event handlers, thus requiring the `'use client'` directive at the top to mark it as a Client Component.

```jsx
'use client';

import { useState } from 'react';

export default function Counter({initialValue = 0}) {
  const [countValue, setCountValue] = useState(initialValue);
  const increment = () => setCountValue(countValue + 1);
  const decrement = () => setCountValue(countValue - 1);
  return (
    <>
      <h2>Count Value: {countValue}</h2>
      <button onClick={increment}>+1</button>
      <button onClick={decrement}>-1</button>
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

### Use an Imported React Component

Source: https://react.dev/reference/rsc/use-client

This example shows how to import a previously defined React component and use it within another component's render function. This illustrates the concept of component usage, where a component definition is instantiated and rendered as part of a larger application structure.

```javascript
import MyComponent from './MyComponent';

function App() {
  // This is a usage of a component
  return <MyComponent />;
}
```

--------------------------------

### Display user info in React Client Component

Source: https://react.dev/reference/react/experimental_taintObjectReference

This `InfoCard` is a Client Component designed to receive a `user` object and display specific properties like `user.name`. It demonstrates how client components interact with data, underscoring the importance of carefully managing what data is made available to them from the server.

```javascript
// components.js
"use client";

export async function InfoCard({ user }) {
  return <div>{user.name}</div>;
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

### Stream Promise from React Server to Client Component

Source: https://react.dev/reference/react/use

This example demonstrates how a React Server Component (`App`) can pass a Promise to a Client Component (`Message`). The Client Component uses the `use` API to read the Promise's resolved value, while `Suspense` manages the loading state.

```javascript
import { fetchMessage } from './lib.js';
import { Message } from './message.js';

export default function App() {
  const messagePromise = fetchMessage();
  return (
    <Suspense fallback={<p>waiting for message...</p>>>
      <Message messagePromise={messagePromise} />
    </Suspense>
  );
}
```

```javascript
// message.js
'use client';

import { use } from 'react';

export function Message({ messagePromise }) {
  const messageContent = use(messagePromise);
  return <p>Here is the message: {messageContent}</p>;
}
```

--------------------------------

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

### Hydrating Server-Rendered HTML with hydrateRoot

Source: https://react.dev/reference/react-dom/client/hydrateRoot

To make server-rendered React HTML interactive on the client, use `hydrateRoot` from `react-dom/client`. This function attaches React's component logic to the existing server-generated DOM, turning a static HTML snapshot into a fully interactive application. It should typically be called once at application startup.

```javascript
import { hydrateRoot } from 'react-dom/client';

hydrateRoot(document.getElementById('root'), <App />);
```

```javascript
import './styles.css';
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(
  document.getElementById('root'),
  <App />
);
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

### Wrap React Client Component with Suspense for Promise Resolution

Source: https://react.dev/reference/react/use

This client-side example shows how to wrap a component (`Message`) that consumes a Promise via the `use` API with `Suspense`. The `MessageContainer` provides a loading fallback (`⌛Downloading message...`) until the `messagePromise` resolves, improving the user experience during data fetching.

```javascript
"use client";

import { use, Suspense } from "react";

function Message({ messagePromise }) {
  const messageContent = use(messagePromise);
  return <p>Here is the message: {messageContent}</p>;
}

export function MessageContainer({ messagePromise }) {
  return (
    <Suspense fallback={<p>⌛Downloading message...</p>>>
      <Message messagePromise={messagePromise} />
    </Suspense>
  );
}
```

--------------------------------

### Server-side render passing asset map to client via `bootstrapScriptContent` (React)

Source: https://react.dev/reference/react-dom/static/prerender

This advanced server-side `handler` uses `bootstrapScriptContent` to serialize and embed the `assetMap` directly into the generated HTML stream. This makes the `assetMap` available globally on the client (`window.assetMap`), ensuring both server and client render the `App` component with the exact same asset paths, which is crucial for preventing hydration mismatches when using hashed assets.

```javascript
// You'd need to get this JSON from your build tooling.
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

async function handler(request) {
  const {prelude} = await prerender(<App assetMap={assetMap} />, {
    // Careful: It's safe to stringify() this because this data isn't user-generated.
    bootstrapScriptContent: `window.assetMap = ${JSON.stringify(assetMap)};`,
    bootstrapScripts: [assetMap['/main.js']]
  });
  return new Response(prelude, {
    headers: { 'content-type': 'text/html' },
  });
}
```

--------------------------------

### Hydrate React App on Client (React DOM)

Source: https://react.dev/reference/react-dom/static/prerenderToNodeStream

This client-side JavaScript code demonstrates how to use `hydrateRoot` from 'react-dom/client' to make a server-rendered React application interactive. It takes the entire `document` and the root `<App />` component, attaching event listeners and rehydrating the static HTML.

```javascript
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App />);
```

--------------------------------

### Render Different Content on Client/Server in React using `useState` and `useEffect`

Source: https://react.dev/link/hydration-mismatch

This example shows a two-pass rendering technique to intentionally render different content on the server and client without causing hydration mismatches. It uses a `isClient` state variable, initialized to `false`, which is then set to `true` inside a `useEffect` hook that runs only after the component mounts on the client. This ensures the initial render matches the server output, followed by a client-side update.

```javascript
import { useState, useEffect } from "react";

export default function App() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <h1>
      {isClient ? 'Is Client' : 'Is Server'}
    </h1>
  );
}
```

--------------------------------

### Memoize Expensive Computations with `useMemo` in React Client Components

Source: https://react.dev/reference/react/cache

This example shows how to use the `useMemo` hook to cache the result of an expensive computation within a React Client Component. `useMemo`'s cache is local to the component instance and ensures that if dependencies (like `record`) haven't changed, the computation (`calculateAvg`) is skipped on re-renders. It's ideal for optimizing UI-specific computations.

```javascript
'use client';  \n  \nfunction WeatherReport({record}) {  \n  const avgTemp = useMemo(() => calculateAvg(record), record);  \n  // ...  \n}  \n  \nfunction App() {  \n  const record = getRecord();  \n  return (  \n    <>  \n      <WeatherReport record={record} />  \n      <WeatherReport record={record} />  \n    </>  \n  );  \n}
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

### Illustrate leaking secrets from Server to Client Components in React

Source: https://react.dev/reference/react/experimental_taintUniqueValue

This snippet demonstrates an anti-pattern where a Server Component (`Dashboard`) directly passes a sensitive environment variable (`process.env.API_PASSWORD`) as a prop to a Client Component (`Overview`). The Client Component then uses this secret to make an authenticated API call, exposing the secret to the client's browser and risking a data breach.

```javascript
export async function Dashboard(props) {
  // DO NOT DO THIS
  return <Overview password={process.env.API_PASSWORD} />;
}
```

```javascript
"use client";

import {useEffect} from '...'

export async function Overview({ password }) {
  useEffect(() => {
    const headers = { Authorization: password };
    fetch(url, { headers }).then(...);
  }, [password]);
  ...
}
```

--------------------------------

### Render user profile in React Server Component (DO NOT DO THIS)

Source: https://react.dev/reference/react/experimental_taintObjectReference

The `Profile` Server Component fetches user data using the `getUser` function and then attempts to pass the entire user object directly to the `InfoCard` Client Component. This pattern is explicitly highlighted as a security vulnerability, as it risks exposing sensitive server-side data to the client.

```javascript
import { getUser } from 'api.js';
import { InfoCard } from 'components.js';

export async function Profile(props) {
  const user = await getUser(props.userId);
  // DO NOT DO THIS
  return <InfoCard user={user} />;
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

### React: Conditionally Render Client-Only Content After Hydration

Source: https://react.dev/reference/react/useEffect

This React component demonstrates how to display different JSX content on the client after hydration compared to the initial server render. It uses `useState` to track mount status and `useEffect` to update this status once the component mounts on the client, ensuring client-specific logic (e.g., `localStorage` access) is executed only when available.

```javascript
function MyComponent() {
  const [didMount, setDidMount] = useState(false);

  useEffect(() => {
    setDidMount(true);
  }, []);

  if (didMount) {
    // ... return client-only JSX ...
  }  else {
    // ... return initial JSX ...
  }
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

### Preventing sensitive user data from reaching React Client Components

Source: https://react.dev/reference/react/experimental_taintObjectReference

Shows how to integrate `experimental_taintObjectReference` within a data fetching function (`getUser`) to taint a database-retrieved user object. This ensures the full user object, potentially containing sensitive data, cannot be unintentionally passed to client components, enforcing data isolation.

```javascript
import {experimental_taintObjectReference} from 'react';

export async function getUser(id) {
  const user = await db`SELECT * FROM users WHERE id = ${id}`;
  experimental_taintObjectReference(
    'Do not pass the entire user object to the client. ' +
      'Instead, pick off the specific properties you need for this use case.',
    user,
  );
  return user;
}
```

--------------------------------

### Tainting process.env to prevent leakage to React Client Components

Source: https://react.dev/reference/react/experimental_taintObjectReference

Demonstrates how to use `experimental_taintObjectReference` to prevent the entire `process.env` object from being passed to client components, providing a custom error message if it occurs. This example highlights protecting sensitive environment variables.

```javascript
import {experimental_taintObjectReference} from 'react';

experimental_taintObjectReference(
  'Do not pass ALL environment variables to the client.',
  process.env
);
```

--------------------------------

### Hydrate static server-generated HTML on client with `hydrateRoot` (React)

Source: https://react.dev/reference/react-dom/static/prerender

This client-side JavaScript code uses `react-dom/client`'s `hydrateRoot` to attach event listeners and make the server-generated static HTML interactive. It takes the `document` object and the root `App` component, re-rendering the application to match the server's output and enabling client-side interactivity.

```javascript
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App />);
```

--------------------------------

### Compose React Components by Exposing Nested Components

Source: https://react.dev/reference/react/Children

This example demonstrates a robust way to compose React components by exporting individual child components (like `Row`). Instead of manipulating children with `Children` methods, consumers explicitly wrap content, making the composition less fragile. This `App` component renders a `RowList` and manually wraps each item in a `Row` component.

```javascript
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList>
      <Row>
        <p>This is the first item.</p>
      </Row>
      <Row>
        <p>This is the second item.</p>
      </Row>
      <Row>
        <p>This is the third item.</p>
      </Row>
    </RowList>
  );
}
```

--------------------------------

### Hydrate React App with Injected Asset Map (React DOM)

Source: https://react.dev/reference/react-dom/static/prerenderToNodeStream

This client-side JavaScript code demonstrates how to hydrate a server-rendered React application using an `assetMap` that was injected globally by the server. It retrieves the `assetMap` from `window.assetMap` and passes it as a prop to the `<App />` component, ensuring consistent rendering between server and client and preventing hydration errors.

```javascript
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App assetMap={window.assetMap} />);
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

### React Contact Component with Textarea (DOM State Loss)

Source: https://react.dev/reference/react/Activity

A simple `Contact.js` React component featuring a `<textarea>`. In a multi-tab application that unmounts components, any text entered into this `<textarea>` would be lost when navigating away from and back to this tab, as the component's DOM state is destroyed.

```javascript
export default function Contact() {
  return (
    <div>
      <p>Send me a message!</p>

      <textarea />

      <p>You can find me online here:</p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </div>
  );
}
```

--------------------------------

### Implement React component with useEffect for chat connection lifecycle

Source: https://react.dev/learn/lifecycle-of-reactive-effects

This example showcases a `ChatRoom` component using `useEffect` with an empty dependency array to manage a chat connection's lifecycle. The connection is established once on component mount and closed on unmount. The `App` component controls the `ChatRoom`'s visibility, illustrating how the effect's mount/unmount behavior is tied to the component's presence in the DOM.

```javascript
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'general';

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>Welcome to the {roomId} room!</h1>;
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom />}
    </>
  );
}
```

```javascript
// chat.js
// Assume createConnection is defined elsewhere, e.g.:
export function createConnection(serverUrl, roomId) {
  return {
    connect: () => console.log(`Connecting to ${roomId} at ${serverUrl}`),
    disconnect: () => console.log(`Disconnecting from ${roomId} at ${serverUrl}`)
  };
}
```

--------------------------------

### Server-Side Render with Dynamic Asset Map

Source: https://react.dev/reference/react-dom/server/renderToReadableStream

This JavaScript server-side handler integrates a pre-defined `assetMap` (e.g., from build tooling) into the rendering process. It passes the `assetMap` as a prop to the React `App` component and uses it to specify the `bootstrapScripts` for client hydration, ensuring consistent asset loading.

```javascript
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

async function handler(request) {
  const stream = await renderToReadableStream(<App assetMap={assetMap} />, {
    bootstrapScripts: [assetMap['/main.js']]
  });
  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}
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

### Render React Activity Component with Dynamic Visibility

Source: https://react.dev/reference/react/Activity

This example illustrates the basic structure of the `<Activity>` component in React, wrapping a `<Sidebar />` component. The `mode` prop dynamically controls the visibility of its children based on the `visibility` variable, allowing the component to be hidden or shown while preserving its state.

```jsx
<Activity mode={visibility}>

  <Sidebar />

</Activity>
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

### Render Multiple Configurable Avatar Components with Props (React)

Source: https://react.dev/learn/passing-props-to-a-component

This comprehensive React example demonstrates a `Profile` component rendering multiple `Avatar` components, each configured with different `size` and `person` props. The `Avatar` component uses these props to dynamically render an image and its alt text, relying on a utility function `getImageUrl` for the source.

```javascript
import { getImageUrl } from './utils.js';

function Avatar({ person, size }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

export default function Profile() {
  return (
    <div>
      <Avatar
        size={100}
        person={{
          name: 'Katsuko Saruhashi',
          imageId: 'YfeOqp2'
        }}
      />
      <Avatar
        size={80}
        person={{
          name: 'Aklilu Lemma',
          imageId: 'OKS67lh'
        }}
      />
      <Avatar
        size={50}
        person={{
          name: 'Lin Lanying',
          imageId: '1bX5QH6'
        }}
      />
    </div>
  );
}
```

--------------------------------

### Import Default Exported React Component in App.js

Source: https://react.dev/learn/importing-and-exporting-components

This code demonstrates how to import a default exported `Gallery` component from `./Gallery.js` into `App.js`. The `App` component then renders the `Gallery` component, illustrating a basic component composition after refactoring into separate files.

```javascript
import Gallery from './Gallery.js';

export default function App() {
  return (
    <Gallery />
  );
}
```

--------------------------------

### Manage Component Lifecycle with componentDidMount, componentDidUpdate, and componentWillUnmount in React

Source: https://react.dev/reference/react/Component

This React class component example illustrates the coordinated use of `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount` to manage a chat room connection. `componentDidMount` initializes the connection, `componentDidUpdate` handles connection changes based on `roomId` or `serverUrl` updates, and `componentWillUnmount` ensures proper cleanup upon component unmounting.

```javascript
class ChatRoom extends Component {

  state = {

    serverUrl: 'https://localhost:1234'

  };



  componentDidMount() {

    this.setupConnection();

  }



  componentDidUpdate(prevProps, prevState) {

    if (

      this.props.roomId !== prevProps.roomId ||

      this.state.serverUrl !== prevState.serverUrl

    ) {

      this.destroyConnection();

      this.setupConnection();

    }

  }



  componentWillUnmount() {

    this.destroyConnection();

  }



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

### Render an Avatar Component with Hardcoded Props (React)

Source: https://react.dev/learn/passing-props-to-a-component

This React component demonstrates rendering an `<img>` element with standard HTML attributes and then wrapping it in a custom `Avatar` component within a `Profile` component. It shows the basic structure of a React component rendering another custom component without passing any dynamic props initially.

```javascript
function Avatar() {
  return (
    <img
      className="avatar"
      src="https://i.imgur.com/1bX5QH6.jpg"
      alt="Lin Lanying"
      width={100}
      height={100}
    />
  );
}

export default function Profile() {
  return (
    <Avatar />
  );
}
```

--------------------------------

### React Class Component Lifecycle for Connection Management

Source: https://react.dev/reference/react/Component

This React class component demonstrates how to manage a connection (e.g., a chat room connection) using lifecycle methods. `componentDidMount` establishes the connection, `componentWillUnmount` tears it down, and `componentDidUpdate` handles re-establishing the connection if `roomId` or `serverUrl` props/state change. It ensures that the connection is properly managed throughout the component's lifecycle.

```javascript
class ChatRoom extends Component {

  state = {

    serverUrl: 'https://localhost:1234'

  };



  componentDidMount() {

    this.setupConnection();

  }



  componentDidUpdate(prevProps, prevState) {

    if (

      this.props.roomId !== prevProps.roomId ||

      this.state.serverUrl !== prevState.serverUrl

    ) {

      this.destroyConnection();

      this.setupConnection();

    }

  }



  componentWillUnmount() {

    this.destroyConnection();

  }



  // ...

}
```

--------------------------------

### Render React Component (JavaScript)

Source: https://react.dev/learn/importing-and-exporting-components

This snippet defines a default exported `App` component that renders the previously imported `Profile` component within JSX. This illustrates how to utilize a functional component within another component, often at the root of a React application.

```javascript
export default function App() {
  return <Profile />;
}
```

--------------------------------

### React: Implement Custom onCaughtError for Hydration

Source: https://react.dev/reference/react-dom/client/hydrateRoot

This snippet illustrates how to integrate a custom `onCaughtError` handler into `hydrateRoot` options for specialized error reporting in production. It captures caught errors, including their component stack, and allows for conditional reporting (e.g., ignoring known errors).

```javascript
import { hydrateRoot } from "react-dom/client";

import App from "./App.js";

import { reportCaughtError } from "./reportError";



const container = document.getElementById("root");

const root = hydrateRoot(container, <App />, {
	onCaughtError: (error, errorInfo) => {
		if (error.message !== "Known error") {
			reportCaughtError({
				error,
				componentStack: errorInfo.componentStack
			});
		}
	}
});
```

--------------------------------

### Define React root component with dynamic asset map for hashed files (React)

Source: https://react.dev/reference/react-dom/static/prerender

This `App` component is modified to accept an `assetMap` prop, which allows dynamic loading of hashed CSS and JavaScript file paths. Instead of hardcoding asset URLs, it retrieves them from the `assetMap`, making it suitable for production builds where asset filenames are often fingerprinted for caching purposes. This prevents hydration errors by ensuring consistent asset URLs between server and client.

```javascript
export default function App({ assetMap }) {
  return (
    <html>
      <head>
        <title>My app</title>
        <link rel="stylesheet" href={assetMap['styles.css']}></link>
      </head>
      ...
    </html>
  );
}
```

--------------------------------

### Define Custom Event Handlers for React Components

Source: https://react.dev/learn/adding-interactivity

This React example demonstrates how to define and pass custom event handler props (`onPlayMovie`, `onUploadImage`) to child components. The `Toolbar` component receives these props and passes them down to a generic `Button` component, which then attaches them to a native HTML `<button>`'s `onClick` event, making components reusable and their interactions customizable.

```jsx
export default function App() {
  return (
    <Toolbar
      onPlayMovie={() => alert('Playing!')}
      onUploadImage={() => alert('Uploading!')}
    />
  );
}

function Toolbar({ onPlayMovie, onUploadImage }) {
  return (
    <div>
      <Button onClick={onPlayMovie}>
        Play Movie
      </Button>
      <Button onClick={onUploadImage}>
        Upload Image
      </Button>
    </div>
  );
}

function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

--------------------------------

### Handle Rejected Promise with React Error Boundary

Source: https://react.dev/reference/react/use

This example illustrates how to use a `react-error-boundary` to gracefully handle rejected Promises in a Client Component. By wrapping the `Suspense` component with an `ErrorBoundary`, a custom fallback UI is displayed if the `messagePromise` fails, preventing application crashes and providing user feedback.

```javascript
"use client";

import { use, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export function MessageContainer({ messagePromise }) {
  return (
    <ErrorBoundary fallback={<p>⚠️Something went wrong</p>>>
      <Suspense fallback={<p>⌛Downloading message...</p>>>
        <Message messagePromise={messagePromise} />
      </Suspense>
    </ErrorBoundary>
  );
}

function Message({ messagePromise }) {
  const content = use(messagePromise);
  return <p>Here is the message: {content}</p>;
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

### Export Default React Gallery Component from Gallery.js

Source: https://react.dev/learn/importing-and-exporting-components

This `Gallery.js` file demonstrates moving the `Profile` and `Gallery` components from the root `App.js`. The `Profile` component is defined for internal use, while the `Gallery` component is exported as the default export, making it available for import in other files like `App.js`.

```javascript
function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3As.jpg"
      alt="Katherine Johnson"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
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

### Optimizing React re-rendering with component separation

Source: https://react.dev/reference/react-dom/components/input

This section demonstrates a performance optimization technique for controlled inputs. By moving the input and its state into a separate component (`SignupForm`), only that component re-renders on every keystroke, preventing unrelated parts of the UI (like `PageContent`) from re-rendering unnecessarily.

```jsx
function App() {
  const [firstName, setFirstName] = useState('');
  return (
    <>
      <form>
        <input value={firstName} onChange={e => setFirstName(e.target.value)} />
      </form>
      <PageContent />
    </>
  );
}
```

```jsx
function App() {
  return (
    <>
      <SignupForm />
      <PageContent />
    </>
  );
}

function SignupForm() {
  const [firstName, setFirstName] = useState('');
  return (
    <form>
      <input value={firstName} onChange={e => setFirstName(e.target.value)} />
    </form>
  );
}
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
