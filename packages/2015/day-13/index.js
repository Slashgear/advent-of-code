const fs = require("fs");
const util = require("util");
const read = util.promisify(fs.readFile);
const _ = require("lodash");

const parseInput = async () => {
  const file = await read("./data.txt", "utf8");
  return file.split("\n").reduce((acc, ligne) => {
    const { groups } =
      /(?<p1>\w+) would (?<sign>lose|gain) (?<value>\d+) happiness units by sitting next to (?<p2>\w+)./.exec(
        ligne
      );
    _.set(
      acc,
      [groups.p1, groups.p2],
      Number(groups.value) * (groups.sign === "lose" ? -1 : 1)
    );
    return acc;
  }, {});
};

const fitness = (list, rules) =>
  list.reduce(
    (sum, name, i) =>
      sum +
      rules[name][list[(i || list.length) - 1]] +
      rules[name][list[(i + 1) % list.length]],
    0
  );

const data = parseInput();

const getMaxHappiness = (list, remaining, rules) => {
  if (remaining.length === 1) return fitness([...list, remaining[0]], rules);

  return Math.max(
    ...remaining.map((name, i) =>
      getMaxHappiness(
        [...list, name],
        [...remaining.slice(0, i), ...remaining.slice(i + 1)],
        rules
      )
    )
  );
};

const part1 = async () => {
  const rules = await data;
  const initialOrder = Object.keys(rules);

  console.log(getMaxHappiness([initialOrder[0]], initialOrder.slice(1), rules));
};

part1();
