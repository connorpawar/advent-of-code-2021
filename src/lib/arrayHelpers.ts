export const notEmpty = (
  arrayLike: { [key: string]: number; length: number },
) => arrayLike.length > 0;

export const findAndRemove = <T>(arr: T[], f: (x: T) => boolean) => {
  const i = arr.findIndex(f);
  return i === -1 ? null : arr.splice(i, 1)[0];
};
