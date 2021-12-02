export const isIn = <X>(setLike: { has: (x: X) => boolean }) =>
  (x: X) => setLike.has(x);
export const notIn = <X>(setLike: { has: (x: X) => boolean }) =>
  (x: X) => !setLike.has(x);
