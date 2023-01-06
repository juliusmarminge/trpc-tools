import type { NextPage } from "next";
import { trpc } from "../utils/trpc";
import { useTRPCForm } from "@trpc-tools/form";
import { z } from "zod";

export const UserValidator = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  // password: z.string().min(3),
  // confirmPassword: z.string().min(3),
});
// .refine((data) => data.password === data.confirmPassword, {
//   message: "Passwords do not match",
// });

const Home: NextPage = () => {
  const utils = trpc.useContext();
  const { data: users } = trpc.user.list.useQuery();

  const form = useTRPCForm({
    mutation: trpc.user.add,
    validator: UserValidator,
    onSuccess: () => utils.invalidate(),
    onSubmit: (e) => {
      console.log("from app", e.data);
      e.preventDefault();
    },
  });

  return (
    <div style={{ display: "flex", gap: "2em" }}>
      <div style={{ width: "200px" }}>
        <h2>Users</h2>
        {users?.map((user) => (
          <div key={user.id}>
            <h3>{user.name}</h3>
            <p>{user.email}</p>
          </div>
        ))}
      </div>

      <div>
        <h2>Create Post</h2>
        <form ref={form.ref}>
          <label htmlFor="user.create:email">Email</label>
          <input name="email" />

          {/* 
          <label htmlFor={form.name.id()}>Name</label>
          <input name={form.name.name()} />
          {form.name.error((e) => (
            <p>{e.message}</p>
          ))}

          <label htmlFor={fields.email("id")}>Email</label>
          <input name={fields.email("name")} />
          {errors.email((e) => (
            <p>{e.message}</p>
          ))}

          <label htmlFor={form.password.id()}>Password</label>
          <input name={form.password.name()} />
          {form.password.error((e) => (
            <p>{e.message}</p>
          ))}

          <label htmlFor={form.confirmPassword.id()}>Confirm Password</label>
          <input name={fields.confirmPassword.name()} />
          {form.confirmPassword.error((e) => (
            <p>{e.message}</p>
          ))}
          */}

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
