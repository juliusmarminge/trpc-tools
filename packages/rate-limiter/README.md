## trpc-rate-limit

A rate limiter for tRPC, inspired by [express-rate-limit](https://github.com/express-rate-limit/express-rate-limit)

> **Warning**
>
> This is a work in progress and is not ready for production use.
>
> Discontinued. See [OrJDev/trpc-limiter](https://github.com/OrJDev/trpc-limiter) instead.

## Usage

```tsx
import { createTRPCRateLimiter } from "@trpc-tools/rate-limiter";
import { initTRPC } from "@trpc/server";

const t = initTRPC.create();

const rateLimiter = createTRPCRateLimiter({
  t,
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  headers: true, // Return rate limit info in the `RateLimit-*` headers
});

export const rateLimitedProcedure = t.procedure
  .use(rateLimiter.middleware())
  .query("hello", {
    resolve() {
      return "world";
    },
  });
```
