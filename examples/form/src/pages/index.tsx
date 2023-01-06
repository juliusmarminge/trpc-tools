import { z } from "zod";
import { useTRPCForm } from "trpc-form";
import { api } from "../utils/api";
import Link from "next/link";

export const userAddInput = z.object({
  name: z.string().min(3),
  email: z.string().email(),
});

function AddUserForm() {
  const utils = api.useContext();

  const form = useTRPCForm({
    mutation: api.user.add,
    validator: userAddInput,
    onSuccess: () => utils.user.list.invalidate(),

    // Demonstation purposes of loading state
    onSubmit: async () => {
      await new Promise((r) => setTimeout(r, 2000));
    },
  });

  return (
    <form ref={form.ref} className="flex flex-col gap-4 flex-1">
      <h2 className="text-3xl font-bold">Create Post</h2>
      <div className="flex flex-col">
        <label htmlFor={form.name.id()}>Name</label>
        <input
          name={form.name.name()}
          className="rounded-md text-zinc-900 p-2 bg-zinc-300"
        />
        {form.name.error((e) => (
          <p className="text-red-500">{e.message}</p>
        ))}
      </div>

      <div className="flex flex-col">
        <label htmlFor={form.email.id()}>Email</label>
        <input
          name={form.email.name()}
          className="rounded-md text-zinc-900 p-2 bg-zinc-300"
        />
        {form.email.error((e) => (
          <p className="text-red-500">{e.message}</p>
        ))}
      </div>

      <button
        type="submit"
        className="bg-blue-500 rounded-md p-2 disabled:bg-blue-300"
        disabled={form.isSubmitting}
      >
        {form.isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}

export default function Home() {
  const { data: users } = api.user.list.useQuery();

  return (
    <div className="flex max-w-4xl mx-auto py-16 gap-14">
      <div>
        <h1 className="text-3xl font-bold">trpc-form</h1>
        <p>A form library for your tRPC mutations.</p>
        <p>
          Like it? Give{" "}
          <Link
            className="underline text-blue-300"
            href="https://github.com/juliusmarminge/trpc-tools/blob/main/packages/form"
          >
            the repo a star
          </Link>
          , and I'll continue!
        </p>

        <Link
          href="https://github.com/juliusmarminge/trpc-tools/blob/main/examples/form/src/pages/index.tsx"
          className="underline text-blue-300"
        >
          Checkout this example on GitHub
        </Link>
        <p className="mt-4">tldr;</p>

        <code className="my-4">$ npm install trpc-form</code>

        <p>Then 👇👇👇</p>
        <img
          height={700}
          width={400}
          alt="Demo"
          src="https://user-images.githubusercontent.com/51714798/211056243-4dce2f4f-7d75-4104-b3ec-5773158a13f7.png"
        />
      </div>

      <div className="flex-1 space-y-8">
        <AddUserForm />

        <h2 className="text-3xl font-bold border-b-2 border-zinc-700">Users</h2>
        {users?.map((user) => (
          <div key={user.id}>
            <h3 className="text-lg font-medium">{user.name}</h3>
            <p>{user.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
