import type { NextPage } from "next";
import { trpc } from "../utils/trpc";
import { useTRPCForm } from "trpc-form";
import { z } from "zod";

const UserList = () => {
  const { data: users } = trpc.user.list.useQuery();
  return (
    <div style={{ width: "200px" }}>
      <h2>Users</h2>
      {users?.map((user) => (
        <div key={user.id}>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  );
};

export const UserAddValidator = z.object({
  name: z.string().min(3),
  email: z.string().email(),
});

const Home: NextPage = () => {
  const utils = trpc.useContext();

  const form = useTRPCForm({
    mutation: trpc.user.add,
    validator: UserAddValidator,
    onSuccess: () => utils.user.list.invalidate(),
    onSubmit: (e) => e.preventDefault(),
  });

  return (
    <div style={{ display: "flex", gap: "2em" }}>
      <UserList />

      <div>
        <h2>Create Post</h2>
        <form ref={form.ref}>
          <label htmlFor={form.name.id()}>Name</label>
          <input name={form.name.name()} />
          {form.name.error((e) => (
            <p style={{ color: "red" }}>{e.message}</p>
          ))}

          <label htmlFor={form.email.id()}>Email</label>
          <input name={form.email.name()} />
          {form.email.error((e) => (
            <p style={{ color: "red" }}>{e.message}</p>
          ))}

          <button type="submit">Submit</button>
        </form>
      </div>

      <div>
        <pre>Values: {JSON.stringify(form.validation, null, 2)} </pre>
      </div>
    </div>
  );
};

export default Home;

export const Demo = () => {
  const utils = trpc.useContext();

  const form = useTRPCForm({
    mutation: trpc.user.add,
    validator: UserAddValidator,
    onSuccess: () => utils.user.list.invalidate(),
    onSubmit: (e) => e.preventDefault(),
  });

  return (
    <form ref={form.ref}>
      <label htmlFor={form.name.id()}>Name</label>
      <input name={form.name.name()} />
      {form.name.error((e) => (
        <p style={{ color: "red" }}>{e.message}</p>
      ))}

      <label htmlFor={form.email.id()}>Email</label>
      <input name={form.email.name()} />
      {form.email.error((e) => (
        <p style={{ color: "red" }}>{e.message}</p>
      ))}

      <button type="submit">Submit</button>
    </form>
  );
};
