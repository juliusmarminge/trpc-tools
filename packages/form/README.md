# trpc-form

## API

````ts
type UseFormOptions = {
  /** Your tRPC mutation, e.g. trpc.post.add */
  mutation: DecorateProcedure,

  /** Your zod validator (for now) */
  validator: z.ZodSchema,

  /** onSubmit callback called before the mutation.mutate() */
  onSubmit?: (e: SubmitEvent) => void,

  /**
   * whether the submitHandler should call preventDefault,
   * @default true,
   * shorthand for `onSubmit: (e) => e.preventDefault()`
   **/
  preventDefault?: boolean,

  /**
   * When to validate the form
   * @default ["change", "submit"]
   **/
  validateOn?: ("change" | "submit")[];
} & UseMutationOptions; // all options from useMutation e.g. onSuccess, etc...

const form = useTRPCForm(opts: UseFormOptions);

// ref to the form: `<form ref={form.ref}>`
form.ref;

// validate the form whenever you want
form.validate();

// the SafeParseResult from zod validation
form.validation;

// status indicator whether the form is submitting
form.isSubmitting;

// access to all your form fields as a proxy (only 1 level deep for now but will handle nested props later)
form.user.name(); // returns the name prop
form.user.name.id(); // returns the id prop
```

## Demo

Open in CodeSandbox:

<a href="https://codesandbox.io/s/github/juliusmarminge/trpc-tools/tree/main/examples/form">
  <img width="200" src="https://user-images.githubusercontent.com/51714798/211045303-2603f241-412b-4c4e-8a34-476ae7ba189b.png" />
</a>

```tsx
import { useTRPCForm } from "trpc-form";

const userAdd = z.object({
  name: z.string(),
  email: z.string().email(),
});

export const MyForm = () => {
  const utils = trpc.useContext();

  const form = useTRPCForm({
    mutation: trpc.user.add,
    validator: userAdd,
    onSuccess: () => utils.user.invalidate(),
  });

  return (
    <form ref={form.ref}>
      <label htmlFor={form.name.id()}>Name</label>
      <input name={form.name.name()} />
      {form.name.error((e) => (
        <p className="text-red-500">{e.message}</p>
      ))}

      <label htmlFor={form.email.id()}>Email</label>
      <input name={form.email.name()} />
      {form.email.error((e) => (
        <p className="text-red-500">{e.message}</p>
      ))}

      <button type="submit">Submit</button>
    </form>
  );
};
````
