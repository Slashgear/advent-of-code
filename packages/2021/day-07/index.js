const fs = require("fs");
const util = require("util");
const assert = require('assert');
const _ = require("lodash");

const read = util.promisify(fs.readFile);

const computeFuel = (values, position) => {
  return _.reduce(values, (acc, value) => {
    acc+=Math.abs(value-position);
    return acc;
  },0)
}

assert.equal(computeFuel([16, 2], 2), 14)

const run = async () => {
  const values = await read("./data.txt", "utf8").then((data) => data.split(",").map(number => parseInt(number, 10)));

  const LIMIT = values.length;

  const costByPosition = new Map();

  for(let i = 0; i<LIMIT ; i++) {
    costByPosition.set(i, computeFuel(values, i))
  }

  const [lowestItems] = _.sortBy(Array.from(costByPosition.entries()),([,cost]) => cost);

  console.log(lowestItems)
};

run();
