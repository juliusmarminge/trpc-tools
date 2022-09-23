import { initTRPC } from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { z } from "zod";

const t = initTRPC.create();

export const PostValidator = z.object({
  author: z.string(),
  title: z.string(),
  body: z.string(),
});

export type Post = z.output<typeof PostValidator> & { id: string };

const posts: Post[] = [
  {
    id: "0",
    author: "Julius",
    title: "Hello client",
    body: "This post was created in the API handler!",
  },
];

const appRouter = t.router({
  post: t.router({
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
  }),
});

export type AppRouter = typeof appRouter;

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => ({}),
});
