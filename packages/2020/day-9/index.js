const fs = require("fs");
const util = require("util");
const _ = require("lodash");
const read = util.promisify(fs.readFile);

const BASE_NUMBER_COUNT = 25;

const run = async () => {
  const file = await read("./data.txt", "utf8");
  const numbers = file.split("\n").map(Number);

  for (let i = BASE_NUMBER_COUNT; i < numbers.length; i++) {
    let pairs = null;

    for (let x = i - BASE_NUMBER_COUNT; x < i && !pairs; x++) {
      for (let y = x + 1; y < i; y++) {
        const sum = numbers[x] + numbers[y];
        if (sum === numbers[i]) {
          pairs = [numbers[x], numbers[y]];
          break;
        }
      }
    }
    if (!pairs) {
      console.log("First number found", numbers[i]);
      return;
    }
  }
};

const part2 = async () => {
  const file = await read("./data.txt", "utf8");
  const firstValue = 556543474;
  const numbers = file.split("\n").map(Number);
  for (let x = 0; x < numbers.length; x++) {
    let sum = numbers[x];
    let addNumbers = [numbers[x]];
    for (let y = x + 1; y < numbers.length; y++) {
      sum += numbers[y];
      addNumbers.push(numbers[y]);
      if (sum === firstValue) {
        const min = Math.min(...addNumbers);
        const max = Math.max(...addNumbers);
        console.log("Yeah", min, max, min + max);
        return;
      }
    }
  }
};

run();
part2();
