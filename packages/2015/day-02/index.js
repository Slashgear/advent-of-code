const fs = require("fs");
const util = require("util");
const read = util.promisify(fs.readFile);
const assert = require("assert");

const computePaper = (l, w, h) => {
  const a = l * w;
  const b = l * h;
  const c = w * h;
  const marge = Math.min(a, b, c);

  return 2 * a + 2 * b + 2 * c + marge;
};

assert(computePaper(2, 3, 4) === 58);

const run = async () => {
  const text = await read("./data.txt", "utf8");
  const paquets = text
    .split("\n")
    .map((p) => p.split("x").map(Number))
    .map((p) => computePaper(...p))
    .reduce((acc, value) => {
      acc += value;
      return acc;
    }, 0);

  console.log("Total Paper", paquets);
};

const computeRibbon = (...border) => {
  const cubed = border[0] * border[1] * border[2];
  const biggest = border.reduce((a, b) => {
    return a > b ? a : b;
  });
  border.splice(border.indexOf(biggest), 1);

  return cubed + border[0] * 2 + border[1] * 2;
};

assert(computeRibbon(2, 3, 4) === 34);
assert(computeRibbon(1, 10, 1) === 14);

const part2 = async () => {
  const text = await read("./data.txt", "utf8");
  const paquets = text
    .split("\n")
    .map((p) => p.split("x").map(Number))
    .map((p) => computeRibbon(...p))
    .reduce((acc, value) => {
      acc += value;
      return acc;
    }, 0);

  console.log("Total Ribon", paquets);
};

run();
part2();
