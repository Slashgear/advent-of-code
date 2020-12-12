const fs = require("fs");
const util = require("util");
const _ = require("lodash");
const assert = require("assert");

const read = util.promisify(fs.readFile);

const validKeys = [
  "byr",
  "iyr",
  "eyr",
  "hgt",
  "hcl",
  "ecl",
  "pid",
  "cid",
].sort();

const isComplete = (passport) => {
  const missingKeys = _.xor(validKeys, Object.keys(passport));

  if (missingKeys.length > 1) {
    return false;
  }

  if (missingKeys.length === 1 && missingKeys[0] !== "cid") {
    return false;
  }

  return true;
};

const rulesByType = {
  byr: (value) =>
    /\d{4}/.test(value) && Number(value) >= 1920 && Number(value) <= 2002,
  iyr: (value) =>
    /\d{4}/.test(value) && Number(value) >= 2010 && Number(value) <= 2020,
  eyr: (value) =>
    /\d{4}/.test(value) && Number(value) >= 2020 && Number(value) <= 2030,
  hgt: (value) => {
    if (!/\d{1,3}(in|cm)/.test(value)) {
      return false;
    }
    const {
      groups: { size, unit },
    } = /(?<size>\d{1,3})(?<unit>in|cm)/.exec(value);
    const sizeCast = Number(size);

    if (unit === "cm") {
      return sizeCast >= 150 && sizeCast <= 193;
    }

    return sizeCast >= 59 && sizeCast <= 76;
  },
  hcl: (value) => /#([0-9]|[a-f]){6}/.test(value),
  ecl: (value) => /(amb|blu|brn|gry|grn|hzl|oth)/.test(value),
  pid: (value) => /^\d{9}$/.test(value),
  cid: () => true,
};

const isValid = (passport) => {
  let isValid = true;

  _.map(passport, (value, key) => {
    isValid = isValid && rulesByType[key](value);
  });

  return isValid;
};

assert(rulesByType.byr("2002"));
assert(!rulesByType.byr("2003"));

assert(rulesByType.hgt("60in"));
assert(rulesByType.hgt("190cm"));
assert(!rulesByType.hgt("190in"));
assert(!rulesByType.hgt("190"));

assert(rulesByType.hcl("#123abc"));
assert(!rulesByType.hcl("#123abz"));
assert(!rulesByType.hcl("123abc"));

assert(rulesByType.ecl("brn"));
assert(!rulesByType.ecl("wat"));

assert(rulesByType.pid("000000001"));
assert(!rulesByType.pid("0123456789"));

const run = async () => {
  const values = await read("./data.txt", "utf8");
  let countValid = 0;
  const passports = values
    .split("\n\n")
    .map((passport) =>
      passport.split("\n").map((passport) => passport.split(" "))
    )
    .map((passport) => _.flatten(passport))
    .map((passport) =>
      passport.reduce((acc, value) => {
        const split = value.split(":");
        acc[split[0]] = split[1];

        return acc;
      }, {})
    );

  passports.forEach((passport) => {
    const validity = isComplete(passport) && isValid(passport);
    if (validity) {
      countValid++;
    }
  });

  console.log(`Total valid passports ${countValid}`);
};

run();
