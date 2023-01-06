/* eslint-disable @typescript-eslint/no-empty-function */
export function createFlatProxy<TFaux>(
  callback: (path: keyof TFaux & string) => unknown,
): TFaux {
  return new Proxy(() => {}, {
    get(_obj, name) {
      if (typeof name !== "string") return undefined;
      return callback(name as keyof TFaux & string);
    },
  }) as TFaux;
}

type ProxyCallback = (path: string[], args: unknown[]) => unknown;
function createInnerProxy(callback: ProxyCallback, path: string[]) {
  const proxy: unknown = new Proxy(() => {}, {
    get(_target, key) {
      if (typeof key !== "string") return undefined;
      return createInnerProxy(callback, [...path, key]);
    },
    apply(_target, _thisArg, args) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return callback(path, args);
    },
  });

  return proxy;
}

export function createRecursiveProxy(callback: ProxyCallback) {
  return createInnerProxy(callback, []);
}
