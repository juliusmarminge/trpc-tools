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
  const { post } = trpc.useContext();
  const {
    handleSubmit,
    register,
    formState: { errors },
    ...rest
  } = useTRPCForm({
    mutation: trpc.post.add,
    mutationOptions: {
      onSuccess: () => {
        rest.reset();
        post.list.invalidate();
      },
    },
    validator: PostValidator,
  });
  const { data: posts } = trpc.post.list.useQuery();

  return (
    <div>
      <h2>Create Post</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="author">Author</label>
        <input {...register("author")} />
        {errors?.author && <p>{errors.author.message}</p>}

        <label htmlFor="title">Title</label>
        <input {...register("title")} />
        {errors?.title && <p>{errors.title.message}</p>}

        <label htmlFor="body">Body</label>
        <input {...register("body")} />
        {errors?.body && <p>{errors.body.message}</p>}
        <button type="submit">Submit</button>
      </form>

      <h2>Posts</h2>
      {posts?.map((post) => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.body}</p>
        </div>
      ))}
    </div>
  );
};

export default Home;
