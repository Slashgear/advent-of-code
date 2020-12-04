const fs = require("fs");
const util = require("util");
const _ = require("lodash");

const read = util.promisify(fs.readFile);

const validKeys = ["byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid", "cid"].sort();

const isValid = passport => {
  const missingKeys = _.xor(validKeys, Object.keys(passport));

  if (missingKeys.length > 1) {
    return false;
  }

  if (missingKeys.length === 1 && missingKeys[0] !== "cid") {
    return false;
  }

  return true;
};

const run = async () => {
  const values = await read("./data.txt", "utf8");
  let countValid = 0;
  const passports = values
    .split("\n\n")
    .map(passport => passport.split("\n").map(passport => passport.split(" ")))
    .map(passport => _.flatten(passport))
    .map(passport =>
      passport.reduce((acc, value) => {
        const split = value.split(":");
        acc[split[0]] = split[1];

        return acc;
      }, {})
    );

  passports.forEach(passport => {
    const validity = isValid(passport);
    if (validity) {
      countValid++;
    }
  });

  console.log(`Total valid passports ${countValid}`);
};

run();

