export const read = (filePath: string): Promise<string> =>
  Deno.readTextFile(filePath);

// deno-lint-ignore ban-types
export function pipe(x: unknown, ...funcs: Function[]): unknown {
  let res = x;
  for (const f of funcs) res = f(res);
  return res;
}
