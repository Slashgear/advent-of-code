const fs = require("fs");
const util = require("util");
const read = util.promisify(fs.readFile);
const _ = require("lodash");

const operation = {
  AND: (a, b) => a & b,
  OR: (a, b) => a | b,
  LSHIFT: (a, b) => a << b,
  RSHIFT: (a, b) => a >> b,
  NOT: (a, b) => b ^ 65535,
  VAL: (a, b) => b,
};

const run = async () => {
  const file = await read("./data.txt", "utf8");
  let rules = file.split("\n");
  let acc = {};

  while (rules.length) {
    const [o, a, op, b, c] = rules
      .shift()
      .match(/([a-z0-9]*)\b\s?([A-Z]+)?\s?(\S+)\s->\s(\S+)/);
    if ([a, b].every((it) => !it || acc.hasOwnProperty(it) || /\d+/.test(it)))
      acc[c] =
        acc[c] || operation[op || "VAL"](...[a, b].map((i) => acc[i] || +i));
    else rules.push(o);
  }

  console.log("Value of a", acc["a"]);
};

const part2 = async () => {
  const file = await read("./data.txt", "utf8");
  let rules = file.split("\n");
  let acc = {
    b: 3176,
  };

  while (rules.length) {
    const [o, a, op, b, c] = rules
      .shift()
      .match(/([a-z0-9]*)\b\s?([A-Z]+)?\s?(\S+)\s->\s(\S+)/);
    if ([a, b].every((it) => !it || acc.hasOwnProperty(it) || /\d+/.test(it)))
      acc[c] =
        acc[c] || operation[op || "VAL"](...[a, b].map((i) => acc[i] || +i));
    else rules.push(o);
  }
  console.log("Value of a", acc["a"]);
};

run();
part2();
