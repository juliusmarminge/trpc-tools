type ProxyCallback = (path: string[], args: unknown[]) => unknown;

function createInnerProxy(callback: ProxyCallback, path: string[]) {
  const proxy: unknown = new Proxy(() => {}, {
    get(_target, key) {
      if (typeof key !== "string") return;
      return createInnerProxy(callback, [...path, key]);
    },
    apply(_target, _thisArg, args) {
      return callback(args, path);
    },
  });

  return proxy;
}

/**
 * Creates a proxy that calls the callback with the path and arguments
 */
export function createRecursiveProxy(callback: ProxyCallback) {
  return createInnerProxy(callback, []);
}
