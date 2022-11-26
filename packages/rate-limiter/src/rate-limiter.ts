import { MiddlewareFunction, TRPCError } from "@trpc/server";
import { MemoryStore } from "./store";
import { type TRPCRateLimitOptions } from "./types";

const parseOptions = (
  passed: TRPCRateLimitOptions,
): Required<TRPCRateLimitOptions> => {
  return {
    trpcRoot: passed.trpcRoot,
    windowMs: passed.windowMs ?? 60_000,
    max: passed.max ?? 5,
    message: passed.message ?? "Too many requests, please try again later.",
    shouldSetHeaders: true,
  };
};

export const createTRPCRateLimiter = (opts: TRPCRateLimitOptions) => {
  const options = parseOptions(opts);
  const store = new MemoryStore(options);

  const middleware: MiddlewareFunction<any, any> = async ({ ctx, next }) => {
    const ip = "blah";
    const { totalHits, resetTime } = await store.increment(ip);

    console.log("[RateLimiter] headers", ctx.res.headers);

    if (totalHits > options.max) {
      const retryAfter = Math.ceil((resetTime.getTime() - Date.now()) / 1000);
      if (opts.shouldSetHeaders) {
        ctx?.res?.setHeader("Retry-After", retryAfter);
      }

      throw new TRPCError({
        code: "TOO_MANY_REQUESTS",
        message: opts.message,
      });
    }

    console.log("[RateLimiter] totalHits", totalHits);

    return next();
  };

  return {
    middleware,
  };
};
