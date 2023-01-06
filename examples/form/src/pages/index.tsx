import { z } from "zod";
import { useTRPCForm } from "trpc-form";
import { api } from "../utils/api";

export const UserAddValidator = z.object({
  name: z.string().min(3),
  email: z.string().email(),
});

export default function Home() {
  const utils = api.useContext();

  const form = useTRPCForm({
    mutation: api.user.add,
    validator: UserAddValidator,
    onSuccess: () => utils.user.list.invalidate(),
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

      <pre>Values: {JSON.stringify(form.validation, null, 2)} </pre>
    </div>
  );
}

function UserList() {
  const { data: users } = api.user.list.useQuery();
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
}
