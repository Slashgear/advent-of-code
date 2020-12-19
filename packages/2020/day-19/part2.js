const fs = require("fs");
const util = require("util");
const read = util.promisify(fs.readFile);
const _ = require("lodash");

const loadFile = async () => {
  const file = await read("./data.txt", "utf8");
  const [ruleAsString, messageAsStrings] = file.split("\n\n");

  return {
    rules: ruleAsString.split("\n").reduce((acc, value) => {
      const { groups } = /^(?<key>\d+): (?<content>.*)$/.exec(value);
      acc[groups.key] = groups.content;
      return acc;
    }, {}),
    messages: messageAsStrings.split("\n"),
  };
};

const run = async () => {
  let { rules, messages } = await loadFile();
  rules["0"] = "8 11";
  rules["8"] = "42 | 42 8"; // 42 at least one time
  rules["11"] = "42 31 | 42 11 31"; // 42{n}31{n}

  let ruleAsRegexp = {};

  const compute = (value, rules) => {
    if (value in ruleAsRegexp) {
      return ruleAsRegexp[value];
    }
    let result = "";
    if (/^".*"$/.test(value)) {
      result = value.replace(/"/g, "");
    } else if (/\|/.test(value)) {
      const options = value.split(" | ");
      result = `(${compute(options[0], rules)}|${compute(options[1], rules)})`;
    } else {
      const keys = value.split(" ");
      result = keys.map((key) => compute(rules[key], rules)).join("");
    }
    ruleAsRegexp[value] = result;
    return result;
  };

  compute(rules[42], rules);
  compute(rules[31], rules);

  const rule = new RegExp(
    "^(?<group42>(" +
      ruleAsRegexp[rules[42]] +
      ")+)(?<group31>(" +
      ruleAsRegexp[rules[31]] +
      ")+)$"
  );

  console.log(
    "Sum for part 2",
    messages.reduce((sum, message) => {
      const matches = rule.exec(message);
      if (matches) {
        const { groups } = matches;
        const matches42 = groups.group42.match(
          new RegExp(ruleAsRegexp[rules[42]], "g")
        ).length;
        const matches31 = groups.group31.match(
          new RegExp(ruleAsRegexp[rules[31]], "g")
        ).length;
        if (matches42 > matches31) {
          sum++;
        }
      }
      return sum;
    }, 0)
  );
};

run();
