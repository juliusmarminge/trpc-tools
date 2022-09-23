import { initTRPC } from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { z } from "zod";

const t = initTRPC.create();

export type Post = {
  id: string;
  author: string;
  title: string;
  body: string;
};

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
    add: t.procedure
      .input(
        z.object({ author: z.string(), title: z.string(), body: z.string() }),
      )
      .mutation(({ input }) => {
        const id = Math.random()
          .toString(36)
          .replace(/[^a-z]+/g, "")
          .slice(0, 6);
        posts.push({ id, ...input });
      }),
  }),
});

export type AppRouter = typeof appRouter;

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => ({}),
});
