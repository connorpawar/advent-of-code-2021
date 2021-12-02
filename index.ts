for (let i = 1; i < 25; i++) {
  import(`./src/days/${i.toString().padStart(2, "0")}.ts`).then((_day) => {})
    .catch(() => {});
}
