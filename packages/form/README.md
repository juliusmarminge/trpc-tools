# trpc-form

## Demo

Open in CodeSandbox:

<a href="https://codesandbox.io/s/github/juliusmarminge/trpc-tools/tree/main/examples/form">
  <img width="200" src="https://user-images.githubusercontent.com/51714798/211045303-2603f241-412b-4c4e-8a34-476ae7ba189b.png" />
</a>

```tsx
const userAdd = z.object({
  name: z.string(),
  email: z.string().email(),
});

export const Demo = () => {
  const utils = trpc.useContext();

  const form = useTRPCForm({
    mutation: trpc.user.add,
    validator: userAdd,
    onSuccess: () => utils.user.invalidate(),
    onSubmit: (e) => e.preventDefault(),
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
```
