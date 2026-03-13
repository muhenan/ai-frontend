# Hooks and `useEffect`

This document explains what React Hooks are, why they exist, how they are used in this project, and how to write `useEffect` correctly.

## What Is a Hook

A Hook is a special React function that lets a function component use React features such as:

- state
- side effects
- memoization
- shared logic
- refs
- context

Common built-in Hooks include:

- `useState`
- `useEffect`
- `useMemo`
- `useCallback`
- `useRef`
- `useContext`

This project also uses custom Hooks:

- `useNotesState`
- `useKeyboardNavigation`

The idea is simple: a function component is just a function, but Hooks allow that function to remember values, react to changes, and connect to the outside world.

## Why Hooks Matter

Hooks solve two important problems:

1. They let function components manage state and side effects.
2. They let developers extract reusable logic into custom Hooks.

Without Hooks, a component would have to keep too much logic inside itself, and sharing behavior across components would be much harder.

## Built-In Hooks vs Custom Hooks

### Built-In Hooks

These come from React itself.

Example:

```tsx
const [isMobile, setIsMobile] = useState(false);
```

Here, `useState` gives the component a piece of state called `isMobile` and a function `setIsMobile` to update it.

### Custom Hooks

These are regular functions created by developers, usually starting with `use`.

Example from this project:

```tsx
const notesState = useNotesState();
```

`useNotesState` is not magic syntax. It is just a function that internally uses other Hooks such as `useState`, `useEffect`, and `useMemo`, then returns reusable state and actions.

## Hooks in This Project

This project provides good real examples of how Hooks are used in day-to-day React work.

### `useState` in `App`

`App` uses `useState` to track whether the layout should behave like mobile UI.

```tsx
const [isMobile, setIsMobile] = useState(false);
```

When `setIsMobile` runs, React schedules a re-render. On the next render, the UI reads the updated value and changes the layout.

### `useNotesState` as a Custom Hook

`useNotesState` manages the main notes workflow:

- selected date
- selected note
- notes grouped by date
- panel visibility
- note creation
- note update
- note deletion

This is a strong example of extracting business logic out of UI components.

### `useKeyboardNavigation` as a Custom Hook

`useKeyboardNavigation` handles global keyboard input for calendar navigation.

This keeps keyboard event logic out of the visual component and makes the feature easier to reason about.

## What Is `useEffect`

`useEffect` is the Hook used for side effects.

A side effect is anything that goes beyond calculating JSX from props and state. Typical side effects include:

- reading or writing `localStorage`
- subscribing to browser events
- setting timers
- making API calls
- interacting with third-party libraries
- manually syncing with the DOM or other external systems

In short:

- rendering describes what the UI should look like
- `useEffect` describes what should happen after React updates the UI

## The Basic `useEffect` Shape

The standard pattern looks like this:

```tsx
useEffect(() => {
  // run side effect

  return () => {
    // optional cleanup
  };
}, [dependencies]);
```

It has three parts:

1. The effect function
2. The optional cleanup function
3. The dependency array

## Part 1: The Effect Function

The first function contains the side effect logic.

Example:

```tsx
useEffect(() => {
  console.log('Component rendered');
}, []);
```

React runs this after rendering, not during rendering.

That matters because rendering should stay pure, while effects are specifically for external work.

## Part 2: The Cleanup Function

If the effect creates something that must be stopped, removed, or cleaned up, return a function.

Example:

```tsx
useEffect(() => {
  const id = setInterval(() => {
    console.log('tick');
  }, 1000);

  return () => {
    clearInterval(id);
  };
}, []);
```

Cleanup is commonly used for:

- event listeners
- timers
- subscriptions
- manual resource cleanup

React runs cleanup:

- before the effect runs again
- when the component unmounts

## Part 3: The Dependency Array

The dependency array controls when the effect re-runs.

### `[]`

```tsx
useEffect(() => {
  // run once after mount
}, []);
```

This usually means the effect should run only once after the first render.

### `[value]`

```tsx
useEffect(() => {
  // run after mount and whenever value changes
}, [value]);
```

This means React re-runs the effect when `value` changes.

### `[a, b, c]`

```tsx
useEffect(() => {
  // run after mount and whenever a, b, or c changes
}, [a, b, c]);
```

If any dependency changes, cleanup runs first, then the effect runs again.

## `useEffect` in This Project

### Example 1: Responding to Window Size

In `App.tsx`, the component sets up a `resize` listener:

```tsx
useEffect(() => {
  const checkMobile = () => {
    setIsMobile(window.innerWidth < 1024);
  };

  checkMobile();
  window.addEventListener('resize', checkMobile);
  return () => window.removeEventListener('resize', checkMobile);
}, []);
```

What this does:

- runs once after the component mounts
- checks the current screen width immediately
- adds a window resize listener
- removes the listener when the component unmounts

This is a classic effect because it connects React to the browser environment.

### Example 2: Saving Notes to `localStorage`

In `useNotesState.ts`, notes are saved when note data changes:

```tsx
useEffect(() => {
  const timeoutId = setTimeout(() => {
    saveNotesToStorage(state.notesByDate);
  }, 300);

  return () => clearTimeout(timeoutId);
}, [state.notesByDate]);
```

What this does:

- waits until note data changes
- delays the save by 300ms
- cancels the previous timer if another change happens first

This is a debounce pattern. It prevents excessive writes and keeps storage synchronized with state.

### Example 3: Keyboard Event Handling

In `useKeyboardNavigation.ts`, a keydown listener is attached:

```tsx
useEffect(() => {
  if (!isEnabled) return;

  const handleKeyDown = (event: KeyboardEvent) => {
    // handle keys
  };

  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
}, [navigationHandlers, isEnabled]);
```

What this does:

- only runs when keyboard navigation is enabled
- listens for arrow keys and `t`
- removes the event listener when dependencies change or the component unmounts

This is another excellent example of effect plus cleanup.

## When You Should Use `useEffect`

Use `useEffect` when you need to synchronize the component with something outside the render process.

Good use cases:

- fetch data from an API
- read or write browser storage
- attach event listeners
- start or stop timers
- integrate with a non-React library

Do not use `useEffect` just to compute values that can be derived during render.

Bad example:

```tsx
useEffect(() => {
  setFullName(firstName + ' ' + lastName);
}, [firstName, lastName]);
```

Better:

```tsx
const fullName = `${firstName} ${lastName}`;
```

If something can be calculated directly from props or state, it usually should not live in `useEffect`.

## A Practical Mental Model

Think about `useEffect` like this:

- render computes the UI
- effect connects the UI to the outside world
- cleanup disconnects it safely

This mental model helps prevent many common mistakes.

## Common `useEffect` Patterns

### Run once on mount

```tsx
useEffect(() => {
  // initialization logic
}, []);
```

### Sync when a value changes

```tsx
useEffect(() => {
  // sync external system with value
}, [value]);
```

### Subscribe and unsubscribe

```tsx
useEffect(() => {
  const handler = () => {};
  window.addEventListener('resize', handler);
  return () => window.removeEventListener('resize', handler);
}, []);
```

### Debounced work

```tsx
useEffect(() => {
  const id = setTimeout(() => {
    // delayed side effect
  }, 300);

  return () => clearTimeout(id);
}, [value]);
```

## Common Mistakes

### 1. Putting normal calculations into `useEffect`

If you only need a computed value for rendering, calculate it directly in the component.

### 2. Forgetting cleanup

If you add listeners or timers without cleanup, the app can leak memory or attach duplicate handlers.

### 3. Missing dependencies

If an effect uses a value but that value is not listed in the dependency array, the effect may read stale data.

### 4. Causing infinite loops

An effect can trigger a state update, which causes a re-render, which re-runs the effect again.

Example:

```tsx
useEffect(() => {
  setCount(count + 1);
}, [count]);
```

This keeps updating forever because changing `count` re-triggers the effect.

### 5. Depending on unstable objects or functions

If a function or object is recreated on every render, the effect may re-run more often than expected.

This is one reason React apps sometimes use `useMemo` or `useCallback`.

## Rules of Hooks

Hooks must follow these rules:

1. Only call Hooks at the top level.
2. Do not call Hooks inside loops, conditions, or nested functions.
3. Only call Hooks from React function components or custom Hooks.

Correct:

```tsx
function MyComponent() {
  const [count, setCount] = useState(0);
  return <div>{count}</div>;
}
```

Incorrect:

```tsx
function MyComponent() {
  if (someCondition) {
    useEffect(() => {
      // wrong
    }, []);
  }
}
```

React relies on Hook call order being stable from render to render.

## How to Write a Custom Hook

A custom Hook is usually just a function that:

1. starts with `use`
2. uses one or more Hooks internally
3. returns state, behavior, or both

Example:

```tsx
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return width;
}
```

This is similar in spirit to your project's `useKeyboardNavigation` and `useNotesState`: wrap reusable behavior, hide setup details, and expose a clean interface.

## How `useNotesState` Teaches Good Hook Design

`useNotesState` is a strong learning example because it combines several ideas:

- initialize state
- load existing data
- expose business actions
- persist changes with an effect
- keep UI components simpler

This is a common real-world pattern:

- components focus on display
- custom Hooks focus on stateful logic

## How to Decide Whether Logic Belongs in a Hook

Put logic into a custom Hook when:

- it uses state or effects
- it may be reused
- it makes components easier to read
- it represents one coherent feature

Keep logic in the component when:

- it is very small
- it is only relevant to that one render block
- extracting it would make the code harder to follow

## Summary

Hooks are the mechanism that gives function components access to React features such as state and effects.

`useEffect` is the Hook used for side effects. It runs after render, can react to dependency changes, and can clean up work when needed.

In this project:

- `useState` stores UI state
- `useEffect` syncs with the browser and storage
- `useNotesState` packages note logic into a reusable custom Hook
- `useKeyboardNavigation` packages keyboard behavior into a reusable custom Hook

If you understand those examples, you already understand the practical foundation of Hooks in React.
