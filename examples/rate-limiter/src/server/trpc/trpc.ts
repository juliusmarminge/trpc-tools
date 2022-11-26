import { initTRPC } from "@trpc/server";
import { createTRPCRateLimiter } from "@trpc-tools/rate-limiter";
import superjson from "superjson";

import { type Context } from "./context";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

export const rateLimiter = createTRPCRateLimiter({
  trpcRoot: t,
});

export const router = t.router;

export const publicProcedure = t.procedure;
