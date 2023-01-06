/* eslint-disable @typescript-eslint/no-empty-function */
type ProxyCallback = (path: string[], args: unknown[]) => unknown;

function createInnerProxy(callback: ProxyCallback, path: string[]) {
  const proxy: unknown = new Proxy(() => {}, {
    get(_target, key) {
      if (typeof key !== "string") return;
      return createInnerProxy(callback, [...path, key]);
    },
    apply(_target, _thisArg, args) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return callback(args, path);
    },
  });

  return proxy;
}

export function createRecursiveProxy(callback: ProxyCallback) {
  return createInnerProxy(callback, []);
}

export const createFlatProxy = <TFaux>(
  callback: (path: keyof TFaux & string) => unknown,
): TFaux => {
  return new Proxy(() => {}, {
    get(_obj, name) {
      if (typeof name !== "string" || name === "then") {
        // special case for if the proxy is accidentally treated
        // like a PromiseLike (like in `Promise.resolve(proxy)`)
        return undefined;
      }
      return callback(name as keyof TFaux & string);
    },
  }) as TFaux;
};
