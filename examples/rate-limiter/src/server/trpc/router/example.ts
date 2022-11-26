import { z } from "zod";

import { router, publicProcedure, rateLimiter as _RL } from "../trpc";

export const exampleRouter = router({
  hello: publicProcedure
    // .use(rateLimiter.middleware)
    .input(z.object({ text: z.string().nullish() }).nullish())
    .query(({ input }) => {
      return {
        greeting: `Hello ${input?.text ?? "world"}`,
      };
    }),
});
