import { TRPCError } from "@trpc/server";
import { type TRPCRateLimitOptions } from "./types";

const defaultOptions: Omit<TRPCRateLimitOptions, "trpcRoot"> = {
  windowMs: 60000,
  max: 5,
  message: "Too many requests, please try again later.",
};

const parseOptions = (passed: TRPCRateLimitOptions): TRPCRateLimitOptions => {
  return {
    ...defaultOptions,
    ...passed,
  };
};

export const createTRPCRateLimiter = (opts: TRPCRateLimitOptions) => {
  const options = parseOptions(opts);

  /**
   * The middleware function that will validate the request.
   * Accepts overrides on a per-procedure basis, that lets
   * you override the default config for a specific procedure.
   **/
  const middleware = (overrides: Partial<TRPCRateLimitOptions>) => {
    const opts = { ...options, ...overrides };

    if (opts.max === 0) {
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
