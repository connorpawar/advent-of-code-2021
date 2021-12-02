import { last, pipe, read, scan } from "../lib/index.ts";

export const day01 = async () => {
  console.group("Answers for day 1:");
  const input = (await read("./src/inputs/01.txt")).trim().split("\n").map(
    Number,
  );

  const hasIncreased = (prev: number, current: number) => current > prev;

  // Functional for challenge 1
  pipe(
    input,
    scan(
      (pre: number, cur: number, i) =>
        pre + (hasIncreased(input[i - 1], cur) ? 1 : 0),
      0,
    ),
    last(),
    console.log,
  );

  // Functional for challenge 2
  pipe(
    input,
    scan(
      (pre: number, cur: number, i) =>
        pre +
        (hasIncreased(
            input[i - 3] + input[i - 2] + input[i - 1],
            input[i - 2] + input[i - 1] + cur,
          )
          ? 1
          : 0),
      0,
    ),
    last(),
    console.log,
  );

  console.groupEnd();
  console.log("\n");
};

day01();
