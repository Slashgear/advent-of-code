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

  compute(rules[0], rules);

  const focus = new RegExp("^" + ruleAsRegexp[rules[0]] + "$");

  console.log(
    "Sum for rule 0",
    messages.reduce((acc, value) => {
      if (focus.test(value)) {
        acc++;
      }
      return acc;
    }, 0)
  );
};

run();
