const fs = require("fs");
const util = require("util");
const read = util.promisify(fs.readFile);

const run = async () => {
  const file = await read("./data.txt", "utf8");
  const numbers = file
    .trim()
    .split("\n")
    .map((line) => parseInt(line.trim(), 10))
    .sort((a, b) => a - b);

  const values = numbers.reduce(
    (acc, jolt, index, numbers) => {
      const prev = numbers[index - 1];
      const diff = jolt - (prev || 0);
      acc[diff] += 1;
      return acc;
    },
    { 1: 0, 3: 1 }
  );

  console.log("Total ⚡️", values[1] * values[3]);
};

const part2 = async () => {
  const file = await read("./data.txt", "utf8");
  const numbers = file
    .trim()
    .split("\n")
    .map((line) => parseInt(line.trim(), 10))
    .sort((a, b) => a - b);

  const solutions = numbers
    .reduce(
      (acc, value) => {
        acc[value] =
          (acc[value - 3] || 0) + (acc[value - 2] || 0) + (acc[value - 1] || 0);
        return acc;
      },
      [1]
    )
    .pop();

  console.log("Solution count 🔌", solutions);
};

run();
part2();
