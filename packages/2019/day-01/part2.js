const fs = require("fs");
const util = require("util");

const read = util.promisify(fs.readFile);

const sumFuel = (fuel) => {
  const nextFuel = Math.floor(fuel / 3) - 2;
  if (nextFuel <= 0) {
    return 0;
  }

  return nextFuel + sumFuel(nextFuel);
};

const run = async () => {
  const values = await read("./data.txt", "utf8").then((data) =>
    data.split("\n")
  );
  let sum = 0;
  for (let i = 0; i < values.length; i++) {
    const parsed = Number(values[i]);
    sum += sumFuel(parsed);
  }

  console.log("Total", sum);
};

run();
