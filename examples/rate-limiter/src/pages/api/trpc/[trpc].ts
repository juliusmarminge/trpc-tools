import { type NextApiResponse } from "next";
import { createNextApiHandler } from "@trpc/server/adapters/next";
import { initTRPC } from "@trpc/server";
import createTRPCRateLimiter from "@trpc-tools/rate-limiter";

type Context = {
  res: NextApiResponse;
};

/** Init tRPC */
const t = initTRPC.context<Context>().create({
  errorFormatter({ shape }) {
    return shape;
  },
});

/** Create the rate limiter */
const rateLimiter = createTRPCRateLimiter({
  trpcRoot: t,
});

const appRouter = t.router({
  hello: t.procedure.use(rateLimiter.middleware).query(() => "world"),
});

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext: (opts) => ({ res: opts.res }),
});

// export router's type definition
export type AppRouter = typeof appRouter;
