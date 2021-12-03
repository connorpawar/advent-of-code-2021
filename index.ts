import { Confirm, prompt, Number } from "./deps.ts";

const result = await prompt([{
  name: "total",
  message: "Do you want to run all days?",
  type: Confirm,
  // deno-lint-ignore no-explicit-any
  after: async ({ total }: any, next: (arg0?: string) => void) => { // executed after prompt
    if (!total) {
      await next(); // run day prompt
    }
  },
}, {
  name: "day",
  message: "What day would you like to run?",
  type: Number,
  // deno-lint-ignore no-explicit-any
  after: async ({ day }: any, next: (arg0?: string) => void) => { // executed after prompt
    if (day <1 || day > 25) {
        await next("day")
      }
    }
  },
]);

if(result.total){
  // Run all days in a row
for (let i = 1; i < 25; i++) {
  await import(`./src/days/${i.toString().padStart(2, "0")}.ts`).then((d) => d.run())
    .catch(() => {});
}
} else{
  await import(`./src/days/${result.day.toString().padStart(2, "0")}.ts`).then((d) => d.run())
  .catch(() => {});
}