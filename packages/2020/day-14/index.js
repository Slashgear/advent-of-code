const fs = require("fs");
const util = require("util");
const assert = require("assert");
const read = util.promisify(fs.readFile);
const _ = require("lodash");

const toBinaryString = (number) => {
  return number.toString(2);
};

const ADDRESS_LENGTH = 36;

assert.strictEqual(toBinaryString(12), "1100");

const applyMask = (number, mask) => {
  let result = "";

  let index = 1;
  for (let i = 0; i < ADDRESS_LENGTH; i++) {
    const maskValue = mask[mask.length - 1 - i];
    const numberValue = number[number.length - 1 - i];
    if (maskValue !== "X") {
      result = `${maskValue}${result}`;
    } else {
      const newValue = numberValue !== undefined ? numberValue : 0;
      result = `${newValue}${result}`;
    }
  }
  return result;
};

assert.strictEqual(
  applyMask(
    "000000000000000000000000000000001011",
    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X"
  ),
  "000000000000000000000000000001001001"
);
assert.strictEqual(
  applyMask(
    "000000000000000000000000000001100101",
    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X"
  ),
  "000000000000000000000000000001100101"
);
assert.strictEqual(
  applyMask(
    "000000000000000000000000000000000000",
    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X"
  ),
  "000000000000000000000000000001000000"
);

const toNumber = (string) => {
  return parseInt(string, 2);
};

assert.strictEqual(toNumber("000000000000000000000000000001001001"), 73);
assert.strictEqual(toNumber("000000000000000000000000000001100101"), 101);
assert.strictEqual(toNumber("000000000000000000000000000001000000"), 64);

const run = async () => {
  const file = await read("./data.txt", "utf8");
  const lines = file.split("\n");
  const memory = {};
  let currentMask;
  lines.forEach((line) => {
    if (_.startsWith(line, "mask")) {
      const {
        groups: { mask },
      } = /mask = (?<mask>\w+)/.exec(line);
      currentMask = mask;
    } else {
      const {
        groups: { index, value },
      } = /mem\[(?<index>\d+)] = (?<value>\d+)/.exec(line);
      const numberAsBinary = toBinaryString(Number(value));
      memory[index] = applyMask(numberAsBinary, currentMask);
    }
  });

  const sum = Object.values(memory).reduce((acc, value) => {
    acc += toNumber(value);
    return acc;
  }, 0);
  console.log("Sum all in memory value for part 1", sum);
};

const applyMaskPart2 = (number, mask) => {
  const result = [[...number.toString(2).padStart(ADDRESS_LENGTH, "0")]];
  for (let i = 0; i < ADDRESS_LENGTH; i++) {
    const maskVal = mask[mask.length - i - 1];
    if (maskVal === "1") {
      for (const binary of result) {
        binary[binary.length - i - 1] = maskVal;
      }
    } else if (maskVal === "X") {
      const resc = [...result.map((r) => [...r])];
      for (const binary of result) {
        binary[binary.length - i - 1] = "0";
      }
      for (const binary of resc) {
        binary[binary.length - i - 1] = "1";
      }
      result.push(...resc);
    }
  }
  return result.map((r) => parseInt(r.join(""), 2));
};

const part2 = async () => {
  const file = await read("./data.txt", "utf8");
  const lines = file.split("\n");
  const memory = {};
  let currentMask;

  lines.forEach((line) => {
    if (_.startsWith(line, "mask")) {
      const {
        groups: { mask },
      } = /mask = (?<mask>\w+)/.exec(line);
      currentMask = mask;
    } else {
      const {
        groups: { index, value },
      } = /mem\[(?<index>\d+)] = (?<value>\d+)/.exec(line);
      const addresses = applyMaskPart2(Number(index), currentMask);
      addresses.forEach((addresse) => {
        memory[addresse] = Number(value);
      });
    }
  });

  const sum = Object.values(memory).reduce((acc, value) => {
    acc += value;
    return acc;
  }, 0);
  console.log("Sum all in memory value for part 2", sum);
};

run();
part2();
