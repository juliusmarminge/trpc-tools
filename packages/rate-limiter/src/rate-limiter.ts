import { type TRPCRateLimitConfig } from "./types";

const defaultConfig: Omit<TRPCRateLimitConfig, "trpcRoot"> = {
  windowMs: 60000,
  max: 5,
  message: "Too many requests, please try again later.",
  statusCode: 429,
};

const defineConfig = (userConfig: TRPCRateLimitConfig): TRPCRateLimitConfig => {
  return {
    ...defaultConfig,
    ...userConfig,
  };
};

const createTRPCRateLimiter = (config: TRPCRateLimitConfig) => {
  const fullConfig = defineConfig(config);

  const middleware = (overrides: Partial<TRPCRateLimitConfig>) => {
    const resolvedConfig = { ...fullConfig, ...overrides };
    console.log(resolvedConfig);
  };

  return {
    middleware,
  };
};

export default createTRPCRateLimiter;
