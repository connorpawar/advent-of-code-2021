export type ForOfAwaitable<T> = AsyncIterable<T> | Iterable<T>;
export type ForOfAwaitableIterator<T> =
  | AsyncIterableIterator<T>
  | IterableIterator<T>;

export function iterator<T>(xs: Iterable<T>): IterableIterator<T> {
  const it = xs[Symbol.iterator]();
  if (!xs[Symbol.iterator]) xs[Symbol.iterator] = () => it;
  return it as IterableIterator<T>;
}

export function asyncIterator<T>(
  xs: AsyncIterable<T>,
): AsyncIterableIterator<T> {
  const it = xs[Symbol.asyncIterator]();
  if (!xs[Symbol.asyncIterator]) xs[Symbol.asyncIterator] = () => it;
  return it as AsyncIterableIterator<T>;
}

export function forAwaitableIterator<T>(
  xs: ForOfAwaitable<T>,
): ForOfAwaitableIterator<T> {
  return isAsyncIterator(xs)
    ? asyncIterator(xs as AsyncIterable<T>)
    : iterator(xs as Iterable<T>);
}

// deno-lint-ignore no-explicit-any
export function isIterator<T>(xs: any): xs is Iterable<unknown> {
  return xs && xs[Symbol.iterator] && xs[Symbol.iterator]() === xs;
}
// deno-lint-ignore no-explicit-any
export function isAsyncIterator(xs: any): xs is AsyncIterable<unknown> {
  return xs && xs[Symbol.asyncIterator] && xs[Symbol.asyncIterator]() === xs;
}
// deno-lint-ignore no-explicit-any
export function isForOfAwaitableIterator(xs: any): boolean {
  return isAsyncIterator(xs) || isIterator(xs);
}

// https://stackoverflow.com/a/46416353/870615
export function tee<T>(
  it: Iterable<T> | Iterator<T>,
): [Iterable<T>, Iterable<T>] {
  // If `it` is not an iterator, i.e. can be traversed more than once,
  // we just return it unmodified.
  if (!isIterator(it)) return [it, it] as unknown as [Iterable<T>, Iterable<T>];

  const source = it[Symbol.iterator]();
  const buffers: [T[], T[]] = [[], []];
  const DONE = Symbol("done");

  const next = (i: number): T | symbol => {
    if (buffers[i].length) return buffers[i].shift() as symbol | T;
    const x = source.next();
    if (x.done) return DONE;
    buffers[1 - i].push(x.value);
    return x.value;
  };

  function* buffer2Iterable(i: number): Iterable<T> {
    while (true) {
      const x = next(i);
      if (x === DONE) break;
      yield x as T;
    }
  }

  return [buffer2Iterable(0), buffer2Iterable(1)];
}

export function asyncTee<T>(
  it: ForOfAwaitable<T> | ForOfAwaitableIterator<T>,
): [ForOfAwaitable<T>, ForOfAwaitable<T>] {
  if (!isForOfAwaitableIterator(it)) {
    return [it, it] as [ForOfAwaitable<T>, ForOfAwaitable<T>];
  }

  const source = it as ForOfAwaitableIterator<T>;
  const buffers: (T | symbol)[][] = [[], []];
  const DONE = Symbol("done");

  const next = async (i: number): Promise<T | symbol> => {
    if (buffers[i].length) return buffers[i].shift() as symbol | T;
    const x = await source.next();
    if (x.done) return DONE;
    buffers[1 - i].push(x.value);
    return x.value;
  };

  async function* buffer2AsyncIterable(i: number): AsyncIterable<T> {
    while (true) {
      const x = await next(i);
      if (x === DONE) break;
      yield x as T;
    }
  }

  return [buffer2AsyncIterable(0), buffer2AsyncIterable(1)];
}

export function asyncTeeN<T>(
  it: ForOfAwaitable<T> | ForOfAwaitableIterator<T>,
  n = 2,
): ForOfAwaitable<T>[] {
  const res = [];
  let orig = it;
  let copy: ForOfAwaitable<T>;
  for (let i = 0; i < n - 1; i++) {
    [orig, copy] = asyncTee(orig);
    res.push(copy);
  }
  res.push(orig);
  return res;
}

export const sum = (zero = 0) =>
  (xs: Iterable<number>): number => {
    let res = zero;
    for (const x of xs) res += x;
    return res;
  };

export const map = <X, Y>(f: (x: X) => Y) => {
  return function* (xs: Iterable<X>): IterableIterator<Y> {
    for (const x of xs) yield f(x);
  };
};

export const skip = <X>(n: number) => {
  return function* (xs: Iterable<X>): IterableIterator<X> {
    let i = 0;
    for (const x of xs) {
      if (++i <= n) continue;
      yield x;
    }
  };
};

export const take = <X>(n: number) => {
  return function* (xs: Iterable<X>): IterableIterator<X> {
    let i = 0;
    for (const x of xs) {
      if (++i > n) break;
      yield x;
    }
  };
};

/**
 * @remarks
 * This functions similar to Array.reduce except it returns all intermediate results as well
 *
 * @param func - The reducer function to be applied
 * @param init - The initial value to apply the function to
 * @returns An iterator containing all intermediate results
 */
export const scan = <X, R>(
  func: (acc: R, x: X, index: number, arr: Iterable<X>) => R,
  init: R,
) => {
  return function* (xs: Iterable<X>): IterableIterator<R> {
    let i = 0;
    const arr = Array.from(xs);
    let res = init;
    for (const x of xs) {
      res = func(res, x, i, arr);
      i++;
      yield res;
    }
  };
};

export function* repeat<X>(
  value?: X,
  r: number = Number.POSITIVE_INFINITY,
): IterableIterator<X> {
  for (let i = 0; i < r; i++) yield value as X;
}

export const splitAt = <X>(n: number) => {
  return function (
    xs: Iterable<X>,
  ): [IterableIterator<X>, IterableIterator<X>] {
    const [xs1, xs2] = tee(xs);
    return [take<X>(n)(xs1), skip<X>(n)(xs2)];
  };
};

export const skipWhile = <X>(f: (x: X) => boolean) => {
  return function* (xs: Iterable<X>): IterableIterator<X> {
    const it = iterator(xs);
    let res: IteratorResult<X>;
    while (((res = it.next()), !res.done)) {
      if (f(res.value)) continue;
      else break;
    }
    yield res.value;
    for (const x of it) yield x;
  };
};

export const takeWhile = <X>(f: (x: X) => boolean) => {
  return function* (xs: Iterable<X>): IterableIterator<X> {
    for (const x of xs) {
      if (f(x)) yield x;
      else break;
    }
  };
};

export const last = <X>() =>
  (xs: Iterable<X>): X | null => {
    let res: X | null = null;
    for (const x of xs) res = x;
    return res;
  };
