const fs = require("fs");
const util = require("util");

const read = util.promisify(fs.readFile);

const run = async () => {
  const values = await read("./data.txt", "utf8").then((data) => {
    const array = data.split("\n");
    return array.map((string) => parseInt(string, 10));
  });

  const countIncrease = values.reduce((accumulator, value, index) => {
    if (index !== 0) {
      if (value > values[index - 1]) {
        accumulator++;
      }
    }

    return accumulator;
  }, 0);

  console.log({ countIncrease });
};

run();
