const fs = require("fs");
const util = require("util");
const _ = require("lodash");
const assert = require("assert");
const read = util.promisify(fs.readFile);

const parseRule = (ruleAsString) => {
  const [bag, ...children] = ruleAsString.matchAll(
    /(?<number>\d+)? ?(?<color>\w* \w*) bags?/g
  );
  return {
    color: bag[2],
    children: children
      .map((child) => ({
        number: Number(child[1]),
        color: child[2],
      }))
      .filter((child) => child.color !== "no other"),
  };
};

assert(
  parseRule("light red bags contain 1 bright white bag, 2 muted yellow bags.")
    .color === "light red"
);
assert(
  parseRule("light red bags contain 1 bright white bag, 2 muted yellow bags.")
    .children[0].number === 1
);
assert(
  parseRule("light red bags contain 1 bright white bag, 2 muted yellow bags.")
    .children[0].color === "bright white"
);
assert(
  parseRule("light red bags contain 1 bright white bag, 2 muted yellow bags.")
    .children[1].number === 2
);
assert(
  parseRule("light red bags contain 1 bright white bag, 2 muted yellow bags.")
    .children[1].color === "muted yellow"
);
assert(
  parseRule("dotted black bags contain no other bags.").children.length === 0
);

const findParents = (rules, color, parents = []) => {
  const currentParents = _.reduce(
    rules,
    (acc, value, key) => {
      if (value.some((child) => child.color === color)) {
        acc.push(key);
      }
      return acc;
    },
    []
  );

  const recurs = _.flattenDeep(
    currentParents.map((c) => findParents(rules, c))
  );
  return [...parents, color, ...recurs];
};

const run = async () => {
  const file = await read("./data.txt", "utf8");
  const rules = file.split("\n").reduce((acc, value) => {
    const parsedRule = parseRule(value);
    acc[parsedRule.color] = parsedRule.children;

    return acc;
  }, {});

  console.log(
    "Number of parents",
    _.uniq(findParents(rules, "shiny gold")).length - 1
  );
};

const countBags = (rules, color) => {
  const contents = rules.get(color);
  if (contents == null) return 0;
  return contents.reduce(
    (acc, value) => acc + value.number * (1 + countBags(rules, value.color)),
    0
  );
};

const part2 = async () => {
  const file = await read("./data.txt", "utf8");
  const rules = file.split("\n").reduce((acc, value) => {
    const parsedRule = parseRule(value);
    acc.set(parsedRule.color, parsedRule.children);

    return acc;
  }, new Map());

  console.log("Number of bag", countBags(rules, "shiny gold"));
};

run();
part2();
