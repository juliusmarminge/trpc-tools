import type { NextPage } from "next";
import { trpc } from "../utils/trpc";
import { useTRPCForm } from "trpc-forms";

// import { PostValidator } from "./api/trpc/[trpc]";

const Home: NextPage = () => {
  const { handleSubmit, register, formState, ...rest } = useTRPCForm(trpc.post.add);
  const { data: posts } = trpc.post.list.useQuery();

  console.log(rest);

  return (
    <div>
      <h2>Create Post</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="author">Author</label>
        <input {...register("author")} />

        <label htmlFor="title">Title</label>
        <input {...register("title")} />

        <label htmlFor="body">Body</label>
        <input {...register("body")} />
        <button type="submit">Submit</button>
      </form>

      <h2>Posts</h2>

      <pre>Errors: {JSON.stringify(formState, null, 2)}</pre>
    </div>
  );
};

export default Home;
