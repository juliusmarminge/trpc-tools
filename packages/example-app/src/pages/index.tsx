import type { NextPage } from "next";
import { trpc } from "../utils/trpc";
import { useTRPCForm } from "trpc-forms";

import { z } from "zod";
export const PostValidator = z.object({
  author: z.string(),
  title: z.string(),
  body: z.string().min(10),
});

const Home: NextPage = () => {
  const { handleSubmit, register, formState, ...rest } = useTRPCForm({
    mutation: trpc.post.add,
    validator: PostValidator,
  });
  const { data: posts } = trpc.post.list.useQuery();

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
      {posts?.map((post) => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.body}</p>
        </div>
      ))}

      <pre>Errors: {JSON.stringify(formState, null, 2)}</pre>
    </div>
  );
};

export default Home;
