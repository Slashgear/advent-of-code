const fs = require("fs");
const util = require("util");
const read = util.promisify(fs.readFile);
const _ = require("lodash");

const loadInput = async () => {
  const file = await read("./data.json", "utf8");
  return JSON.parse(file);
};

const mapping = loadInput();

const deepValues = (input) => {
  let values = [];
  if (_.isNumber(input)) {
    values.push(input);
  }

  if (_.isObject(input)) {
    values = [...Object.values(input).map(deepValues)];
  }

  if (_.isArray(input)) {
    values = [...input.map(deepValues)];
  }

  return _.flattenDeep(values);
};

const run = async () => {
  const data = await mapping;
  const flattened = deepValues(data);
  const totalValuePart1 = _.sum(flattened);
  console.log({ totalValuePart1 });
};

const deepValuesPart2 = (input) => {
  let values = [];
  if (_.isNumber(input)) {
    values.push(input);
  }

  if (_.isObject(input)) {
    if (!Object.values(input).filter(_.isString).includes("red")) {
      values = [...Object.values(input).map(deepValuesPart2)];
    }
  }

  if (_.isArray(input)) {
    values = [...input.map(deepValuesPart2)];
  }

  return _.flattenDeep(values);
};

const part2 = async () => {
  const data = await mapping;
  const flattened = deepValuesPart2(data);
  const totalValuePart2 = _.sum(flattened);
  console.log({ totalValuePart2 });
};

run();
part2();
