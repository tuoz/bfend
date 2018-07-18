export function toPromise(handler: (cbk: (err: Error | null, ...args: any[]) => void) => void): Promise<any[]> {
  return new Promise((resolve, reject) => {
    handler((err, ...args) => {
      if (err) {
        reject(err);
      } else {
        resolve(args);
      }
    });
  });
}
