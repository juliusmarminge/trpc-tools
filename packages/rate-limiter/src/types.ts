import { RootConfig } from "@trpc/server";

export type TRPCRateLimitOptions<
  TContext extends Record<string, unknown>,
  TMeta extends Record<string, unknown>,
  TErrorShape,
  TTransformer,
> = {
  /**
   * Your root tRPC object returned from `initTRPC.create()`
   * @required
   **/
  trpcRoot: RootConfig<{
    ctx: TContext;
    meta: TMeta;
    errorShape: TErrorShape;
    transformer: TTransformer;
  }>;

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
   * Wheter or not some headers should be set.
   * @default true
   */
  headers?: boolean;
};
