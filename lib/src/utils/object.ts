export function merge<T>(out: T, ...args): T {
  out = out || {} as T;

  for (let i = 0, len = args.length; i < len; ++i) {
    const obj = args[i];

    if (!obj) {
      continue;
    }

    for (const key in obj) {
      if (!obj.hasOwnProperty(key)) {
        continue;
      }

      // based on https://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/
      if (Object.prototype.toString.call(obj[key]) === '[object Object]') {
        out[key] = merge(out[key], obj[key]);
        continue;
      }

      out[key] = obj[key];
    }
  }

  return out;
}
