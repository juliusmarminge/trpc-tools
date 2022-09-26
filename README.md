# trpc-forms

A tRPC integration with react-hook-form to use form with as little friction as possible.

> **Warning**
>
> This is a work in progress and is not ready for production use.

## Installation

This package is built on top of `react-hook-form`, `zod` and of course, `trpc` and thus requires them to be installed as peer dependencies:

- `@trpc/react@^10.0.0 @trpc/server@^10.0.0 @trpc/client@^10.0.0`
- `react@^18.0.0`
- `react-hook-form@^7.0.0`
- `@hookform/resolvers@^2.0.0`
- `zod@^3.0.0`

Considering all of these are installed, install this integration with

```bash
npx install trpc-forms
```

## Usage

```tsx
import { trpc } from "~/utils/trpc";
import { useTRPCForm } from "trpc-forms";

const App = () => {
  // 🤯 Pass your mutation to the hook
  const { register, handleSubmit } = useTRPCForm(trpc.post.create, {
    // 🧩 Use your ordinary trpc mutation options
    onMutate() {
      // ...
    },
    onSuccess() {
      // ...
    },
  });

  return (
    <form onSubmit={methods.handleSubmit}>
      {/* use the ordinary react-hook-form methods */}
      <input {...register("title")} />
      <input {...register("body")} />
      <button type="submit">Submit</button>
    </form>
  );
};
```
