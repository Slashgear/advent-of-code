const fs = require("fs");
const util = require("util");
const _ = require("lodash");
const assert = require("assert");
const read = util.promisify(fs.readFile);

const parseInstructions = (file) =>
  file.split("\n").map((instruction) => {
    const { groups } = /(?<ins>\w{3}) (?<sign>\+|-)(?<number>\d+)/.exec(
      instruction
    );
    const signMult = groups.sign === "-" ? -1 : 1;

    return {
      instruction: groups.ins,
      value: signMult * Number(groups.number),
      executed: false,
    };
  });

const run = async () => {
  const file = await read("./data.txt", "utf8");
  const instructions = parseInstructions(file);
  let currentValue = 0;
  for (let i = 0; i < instructions.length; ) {
    if (instructions[i].executed) {
      break;
    }
    switch (instructions[i].instruction) {
      case "nop":
        instructions[i].executed = true;
        i++;
        break;
      case "acc":
        currentValue += instructions[i].value;
        instructions[i].executed = true;
        i++;
        break;
      case "jmp":
        instructions[i].executed = true;
        i += instructions[i].value;
        break;
    }
  }

  console.log("Current value", currentValue);
};

const rumCode = (instructions) => {
  let accumulator = 0;
  let currentIndex = 0;
  let stepsVisited = [];

  while (!stepsVisited.includes(currentIndex)) {
    stepsVisited.push(currentIndex);

    if (instructions[currentIndex] === undefined) {
      return { currentIndex, accumulator };
    }

    switch (instructions[currentIndex].instruction) {
      case "acc":
        accumulator += instructions[currentIndex].value;
        currentIndex++;
        break;

      case "jmp":
        currentIndex += instructions[currentIndex].value;
        break;

      default:
        currentIndex++;
        break;
    }
  }

  return { currentIndex, accumulator };
};

const part2 = async () => {
  const file = await read("./data.txt", "utf8");
  const instructions = parseInstructions(file);

  for (let i = 0; i < instructions.length; i++) {
    if (instructions[i].instruction === "acc") continue;

    if (["nop", "jmp"].includes(instructions[i].instruction)) {
      let modifiedInstructions = [...instructions];
      modifiedInstructions.splice(i, 1, {
        instruction: instructions[i].instruction === "nop" ? "jmp" : "nop",
        value: instructions[i].value,
        executed: false,
      });

      let results = rumCode(modifiedInstructions);

      if (results.currentIndex === modifiedInstructions.length) {
        console.log("total acc", results.accumulator);
        return results.accumulator;
      }
    }
  }
};

run();
part2();
