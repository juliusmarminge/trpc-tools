import { t } from "../trpc";
import { PostValidator } from "../../pages/index";
import { z } from "zod";

export type Post = z.output<typeof PostValidator> & { id: string };

const posts: Post[] = [
  {
    id: "0",
    author: "Julius",
    title: "Hello client",
    body: "This post was created in the API handler!",
  },
];

const postRouter = t.router({
  list: t.procedure.query(() => posts),
  add: t.procedure.input(PostValidator).mutation(({ input }) => {
    const id = Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, "")
      .slice(0, 6);
    const post = { ...input, id };
    posts.push(post);
    return post;
  }),
});

export const appRouter = t.router({
  post: postRouter,
});

export type AppRouter = typeof appRouter;
