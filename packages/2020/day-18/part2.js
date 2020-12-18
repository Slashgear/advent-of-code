const fs = require("fs");
const util = require("util");
const read = util.promisify(fs.readFile);
const _ = require("lodash");

const INSTRUCTION_SIZE = 3;

const math = (instruction) => {
  while (/\+/.test(instruction)) {
    instruction = instruction.replace(
      /(\d+) \+ (\d+)/g,
      (match, first, second) => {
        return Number(first) + Number(second);
      }
    );
  }
  return eval(instruction);
};

const compute = (instruction) => {
  while (/\(/.test(instruction)) {
    // find parenthesis that does not contain parentheses and resolve it.
    // update instruction when computed
    instruction = instruction.replace(/\(([^()]+)\)/g, (match, group) => {
      return math(group);
    });
  }
  return math(instruction);
};

const run = async () => {
  const file = await read("./data.txt", "utf8");
  const instructionsValues = file.split("\n").map(compute);

  console.log("Current value for part 2:", _.sum(instructionsValues));
};

run();
