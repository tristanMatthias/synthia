const isProxy = Symbol('_isProxy');


export type ProxyExtended<T> = T & {
  [isProxy]: true;
  __update(): void;
  __callbacks: ((v: any) => any)[]
  __parent: ProxyExtended<any>
  __isArray: boolean;
  toJSON: () => T
}

const ignoreProps = [ '__update', '__callbacks', '__parent', '__isArray' ];

/**
 * Watches for changes on an object deeply (includes arrays)
 * @param value Object to observe
 * @param cb Callback to return the root object on change
 */
export const wrapProxy = <T extends object>(
  value: T,
  cb?: (value: T) => any,
  parent?: ProxyExtended<any>
): ProxyExtended<T> => {

  let root: ProxyExtended<T>;

  const handler: ProxyHandler<T> = {
    get(target: T, key: keyof T) {

      const prop = target[key];
      if (ignoreProps.includes(key as string)) return prop;

      // return if property not found
      if (typeof prop == 'undefined') return;

      // set value as proxy if object the first time
      if (!prop[isProxy as keyof typeof prop] && typeof prop === 'object') {
        // @ts-ignore
        target[key] = wrapProxy(prop as any, undefined, root) as unknown as T[keyof T];
      }

      return target[key];
    },

    set<K extends keyof T>(target: ProxyExtended<T>, key: K, value: ProxyExtended<T>[K]) {
      target[key] = value;
      if (!ignoreProps.includes(key as string)) target.__update();
      return true;
    }
  };



  if (!(value as ProxyExtended<T>)[isProxy]) {
    // @ts-ignore
    root = new Proxy(value, handler);

    root.__callbacks = [];
    root.__update = () => {
      root.__callbacks.forEach(cb => cb(root));
      if (root.__parent) root.__parent.__update();
    }

    if (parent) root.__parent = parent;
    root[isProxy] = true;
    if (value instanceof Array) root.__isArray = true;


    root.toJSON = () => {
      const {__callbacks, __parent, __update, __isArray, ...data} = root;
      let copy = {...data};
      delete copy[isProxy];


      Object.entries(copy).forEach(([key, value]) => {
        // @ts-ignore
        if (typeof value === 'object' && value[isProxy]) copy[key as keyof copy] = value.toJSON();
      });

      if (__isArray) {
        return Object.entries(copy).reduce((arr, [key, v]) => {
          // Only add it if the key is the index of the array (only a number)
          if (/^\d+$/.test(key)) (arr as Array<any>).push(v);
          return arr;
        }, [] as T);
      }

      delete copy.toJSON;
      return copy as T;
    }

  } else {
    root = value as ProxyExtended<T>;
  }

  if (cb && !root.__callbacks.includes(cb)) root.__callbacks.push(cb);

  return root;
};
