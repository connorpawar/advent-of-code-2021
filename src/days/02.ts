import { last, pipe, read, scan } from "../lib/index.ts";

export const run = async () => {
  console.group("Answers for day 2:");
  const input: [string, number][] = (await read("./src/inputs/02.txt")).trim().split("\n").map(
    instruction => [instruction.split(' ')[0], Number(instruction.split(' ')[1])]
  );

  // Challenge 1
  await pipe(
    input,
    scan(
      (acc: [number, number], _cur: [number, number], i): [number, number] => {
          let [totalDepth, totalDistance] = acc;
          const instr = input[i][0];
          const dist = input[i][1];

        if(instr === "forward"){
            totalDistance += dist;
        } else if(instr === "up"){
            totalDepth -= dist;
        } else {
            totalDepth += dist;
        }
        return [totalDepth, totalDistance]
    },
      [0, 0],
    ),
    last(),
    ([x, y]: [number, number]) => x * y,
    console.log,
  );

    // Challenge 2
    await pipe(
        input,
        scan(
          (acc: [number, number, number], _cur: [number, number, number], i): [number, number, number] => {
              let [totalDepth, totalDistance, totalAim] = acc;
              const instr = input[i][0];
              const dist = input[i][1];
    
            if(instr === "forward"){
                totalDistance += dist;
                totalDepth -= totalAim * dist;
            } else if(instr === "up"){
                totalAim -= dist;
            } else {
                totalAim += dist;
            }
            return [totalDepth, totalDistance, totalAim]
        },
          [0, 0, 0],
        ),
        last<[number, number, number]>(),
        ([x,y,_z]: [number, number, number]) => x * y,
        console.log,
      );

  console.groupEnd();
  console.log("\n");
};
