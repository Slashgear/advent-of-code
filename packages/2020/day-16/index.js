const fs = require("fs");
const util = require("util");
const read = util.promisify(fs.readFile);
const _ = require("lodash");

const parseFile = async () => {
  const file = await read("./data.txt", "utf8");
  const [rulesAsString, currentTicketAsString, otherTicketAsString] =
    file.split("\n\n");

  const rules = rulesAsString
    .split("\n")
    .map((row) =>
      /^(?<name>.*): (?<a>\d+)-(?<b>\d+) or (?<c>\d+)-(?<d>\d+)/.exec(row)
    )
    .map(({ groups: { name, a, b, c, d } }) => ({
      name,
      minA: Number(a),
      maxA: Number(b),
      minB: Number(c),
      maxB: Number(d),
    }));

  const currentTicket = currentTicketAsString
    .split("\n")[1]
    .split(",")
    .map(Number);

  const otherTickets = otherTicketAsString
    .split("\n")
    .slice(1)
    .map((row) => row.split(",").map(Number));

  return {
    rules,
    currentTicket,
    otherTickets,
  };
};

const loadData = parseFile();

const rulesAsPredicates = (rules) => {
  return rules.map(
    ({ minA, maxA, minB, maxB }) =>
      (value) =>
        (value >= minA && value <= maxA) || (value >= minB && value <= maxB)
  );
};

const part1 = async () => {
  const { otherTickets, rules } = await loadData;

  const predicates = rulesAsPredicates(rules);

  const scanningErrorRate = otherTickets
    .map((ticket) =>
      ticket.filter((value) =>
        predicates.map((predicate) => predicate(value)).every((bool) => !bool)
      )
    )
    .reduce((acc, value) => {
      value.forEach((number) => {
        acc += number;
      });
      return acc;
    }, 0);

  console.log("Error rate part 1", scanningErrorRate);
};

part1();

const part2 = async () => {
  const { otherTickets, rules, currentTicket } = await loadData;
  const predicates = rulesAsPredicates(rules);
  const validTicket = otherTickets.filter((ticket) =>
    ticket.every((number) => predicates.find((predicate) => predicate(number)))
  );

  let ruleOrder = Array(rules.length).fill([]);

  validTicket.forEach((ticket) => {
    ticket.forEach((number, index) => {
      const validRuleNames = rules
        .filter(
          ({ minA, maxA, minB, maxB }) =>
            (number >= minA && number <= maxA) ||
            (number >= minB && number <= maxB)
        )
        .map((rule) => rule.name);
      ruleOrder[index] =
        ruleOrder[index].length === 0
          ? validRuleNames
          : _.intersection(validRuleNames, ruleOrder[index]);
    });
  });

  while (!ruleOrder.every((rule) => rule.length === 1)) {
    const foundIndexes = [];
    ruleOrder.forEach((rule, index) => {
      if (rule.length === 1) {
        foundIndexes.push(index);
      }
    });

    foundIndexes.forEach((found) => {
      ruleOrder.forEach((rule, index) => {
        if (index !== found) {
          _.remove(ruleOrder[index], (rule) => rule === ruleOrder[found][0]);
        }
      });
    });
  }

  ruleOrder = _.flatten(ruleOrder);

  console.log(
    "Total number for part 2",
    ruleOrder.reduce((acc, value, index) => {
      if (value.startsWith("departure")) {
        acc *= currentTicket[index];
      }
      return acc;
    }, 1)
  );
};

part2();
