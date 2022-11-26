import { initTRPC } from "@trpc/server";

export type TRPCRateLimitConfig = {
  /**
   * Your root tRPC object returned from `initTRPC.create()`
   * @required
   **/
  // FIXME: Type
  trpcRoot: ReturnType<typeof initTRPC.create>;

  /**
   * Time frame in milliseconds how long to keep track of requests
   * @default 60000 (1 minute)
   */
  windowMs?: number;

  /**
   * The number of requests allowed per `windowMs`.
   * @default 5
   **/
  max?: number | ((ctx: unknown) => number);

  /**
   * The response body to send when a request is blocked.
   * @default 'Too many requests, please try again later.'
   **/
  message?: string;

  /**
   * Status Code to send when a request is blocked.
   * @default 429 (HTTP 429 - Too Many Requests)
   **/
  statusCode?: number;
};
