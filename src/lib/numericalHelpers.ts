export const add = (a: number, b: number): number => a + b;
export const sub = (a: number, b: number): number => a - b;
export const mul = (a: number, b: number): number => a * b;
export const div = (a: number, b: number): number => a / b;

export const addN = (a: number, ...bs: number[]) => bs.reduce(add, a);
export const subN = (a: number, ...bs: number[]) => bs.reduce(sub, a);
export const mulN = (a: number, ...bs: number[]) => bs.reduce(mul, a);
export const divN = (a: number, ...bs: number[]) => a / mulN(a, ...bs);

const _lcm = (a: number, b: number): number => {
  if (a == 0 || b == 0) {
    return 0;
  }
  return (a * b) / _gcd(a, b);
};

const _gcd = (a: number, b: number): number => {
  if (a < 1 || b < 1) {
    throw Error("a or b is less than 1");
  }
  let remainder = 0;
  do {
    remainder = a % b;
    a = b;
    b = remainder;
  } while (b !== 0);
  return a;
};

export const lcm = (a: number, ...bs: number[]) => {
  return bs.reduce(_lcm, a);
};

export const gcd = (a: number, ...bs: number[]) => {
  return bs.reduce(_gcd, a);
};
