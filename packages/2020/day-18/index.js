const fs = require("fs");
const util = require("util");
const read = util.promisify(fs.readFile);
const _ = require("lodash");

const INSTRUCTION_SIZE = 3;

const math = (instruction) => {
  let tokens = instruction.split(" ");
  while (tokens.length > 1) {
    const currentInstructionValue = eval(
      tokens.slice(0, INSTRUCTION_SIZE).join("")
    );
    const nextInstructions = tokens.slice(INSTRUCTION_SIZE);
    tokens = [currentInstructionValue].concat(nextInstructions);
  }
  return tokens[0];
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

  console.log("Current value for part 1:", _.sum(instructionsValues));
};

run();
