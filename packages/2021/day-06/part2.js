const fs = require("fs");
const util = require("util");
const _ = require("lodash");

const read = util.promisify(fs.readFile);

const process = (values) => {
  let fishes = values[0].split(",").reduce((acc, v) => {
    acc[v] = acc[v] ? acc[v] + 1 : 1;
    return acc;
  }, {});

  for (let i = 0; i < 256; i++) {
    const nextFishes = {};
    for (let j = 0; j < 9; j++) {
      if (j === 0) {
        if (fishes["0"]) {
          nextFishes["6"] = (nextFishes["6"] || 0) + fishes["0"];
          nextFishes["8"] = (nextFishes["8"] || 0) + fishes["0"];
        }
      } else if (fishes[j]) {
        nextFishes[j - 1] = (nextFishes[j - 1] || 0) + fishes[j];
      }
    }
    fishes = nextFishes;
  }

  return _.reduce(fishes, (acc, v) => acc + v, 0);
};

const run = async () => {
  const values = await read("./data.txt", "utf8").then((data) =>
    data.split("\n")
  );

  const result = process(values);
  console.log({ result });
};

run();
