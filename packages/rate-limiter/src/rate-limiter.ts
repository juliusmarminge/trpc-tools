import { TRPCError } from "@trpc/server";
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
  };
};

export const createTRPCRateLimiter = (opts: TRPCRateLimitOptions) => {
  const options = parseOptions(opts);
  const store = new MemoryStore(options);

  /**
   * The middleware function that will validate the request.
   * Accepts overrides on a per-procedure basis, that lets
   * you override the default config for a specific procedure.
   **/
  const middleware = (overrides: Partial<TRPCRateLimitOptions>) => {
    const opts = { ...options, ...overrides };

    const hits = store.hits["some-id"] ?? 0;
    if (hits > opts.max) {
      throw new TRPCError({
        code: "TOO_MANY_REQUESTS",
        message: opts.message,
      });
    }
  };

  return {
    middleware: middleware,
  };
};
