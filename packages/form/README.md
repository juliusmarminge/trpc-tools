# trpc-form

## Demo

Also on [![StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/juliusmarminge/trpc-tools/tree/main/examples/form)

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
