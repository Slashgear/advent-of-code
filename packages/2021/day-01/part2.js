const fs = require("fs");
const util = require("util");

const read = util.promisify(fs.readFile);

const run = async () => {
  const values = await read("./data.txt", "utf8").then((data) => {
    const array = data.split("\n");
    return array.map((string) => parseInt(string, 10));
  });

  let previousSum = values[0] + values[1] + values[2];
  let countIncrease = 0;
  for (let i = 3; i < values.length; i++) {
    const currentSum = previousSum + values[i] - values[i - 3];
    if (currentSum > previousSum) {
      countIncrease++;
    }
    previousSum = currentSum;
  }
  console.log({ countIncrease });
};

run();
