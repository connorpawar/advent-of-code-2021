export const findAndRemove = <T>(arr: T[], f: (x: T) => boolean) => {
  const i = arr.findIndex(f);
  return i === -1 ? null : arr.splice(i, 1)[0];
};

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