# trpc-form

## Demo

```tsx
const userCreate = z.object({
  name: z.string(),
  email: z.string().email(),
});

function MyForm() {
  const utils = trpc.useContext();

  const form = useTRPCForm({
    mutation: trpc.user.create,
    // validator: userCreate, // <-- if omitted will be fetched from backend
    onSubmit: (e) => e.preventDefault(),
    onSuccess: () => utils.user.list.invalidate(),
    validateOn: ["submit", "change"],
  });

  return (
    <form ref={form.ref}>
      <label htmlFor={form.name.id()}>Name</label>
      <input name={form.name.name()} />
      {form.name.error((err) => (
        <p>{err.message}</p>
      ))}

      <label htmlFor={form.email.id()}>Email</label>
      <input name={form.email.name()} />
      {form.email.error((e) => (
        <p>{e.message}</p>
      ))}

      <button type="submit">Submit</button>
    </form>
  );
}
```
