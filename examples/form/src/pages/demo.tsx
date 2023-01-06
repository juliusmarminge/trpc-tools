import { api as trpc } from "../utils/api";
import { z } from "zod";

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
