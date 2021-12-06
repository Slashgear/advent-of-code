const fs = require("fs");
const assert = require("assert");

const nextDay = (population) => {
  const nextPop = [];
  const newPop = [];

  for(let fish of population) {
    switch (fish) {
      case 0:
        newPop.push(8)
        nextPop.push(6);
        break;
      default:
        nextPop.push(fish - 1)
    }
  }

  return [...nextPop, ...newPop]
}

assert.deepEqual(nextDay([3,4,3,1,2]), [2,3,2,0,1]);
assert.deepEqual(nextDay([0,1,0,5,6,0,1,2,2,3,7,8]), [6,0,6,4,5,6,0,1,1,2,6,7,8,8,8]);

const run = async () => {
  const input = fs.readFileSync("./data.txt").toString("utf-8");

  let values = input.split(',').map(number => parseInt(number, 10));

  for(let i=0; i < 80; i++) {
    values = nextDay(values);
  }

  console.log(values.length);
};

run();
