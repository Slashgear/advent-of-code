const _ = require("lodash");
const fs = require("fs");
const util = require("util");
const assert = require("assert");
const read = util.promisify(fs.readFile);

const rulesPart1 = {
  threeVowels: (string) => {
    let vowels = ["a", "e", "i", "o", "u"];
    let count = 0;
    for (let i = 0; i < string.length; i++) {
      const foundIndex = vowels.indexOf(string[i]);
      if (foundIndex !== -1) {
        count++;
        if (count === 3) {
          return true;
        }
      }
    }

    return false;
  },
  twiceInRow: (string) => {
    for (let i = 0; i < string.length - 1; i++) {
      if (string[i] === string[i + 1]) {
        return true;
      }
    }
    return false;
  },
  notLikeThis: (string) => !/(ab|cd|pq|xy)/.test(string),
};

assert(rulesPart1.threeVowels("aei"));
assert(rulesPart1.threeVowels("xazegov"));
assert(rulesPart1.threeVowels("aeiouaeiouaeiou"));
assert(!rulesPart1.threeVowels("dvszwmarrgswjxmb"));

assert(rulesPart1.twiceInRow("xx"));
assert(rulesPart1.twiceInRow("abcdde"));
assert(rulesPart1.twiceInRow("aabbccdd"));
assert(!rulesPart1.twiceInRow("jchzalrnumimnmhp"));

assert(!rulesPart1.notLikeThis("haegwjzuvuyypxyu"));
assert(rulesPart1.notLikeThis("ugknbfddgicrmopn"));

const run = async () => {
  const file = await read("./data.txt", "utf8");
  console.log(
    "Total nice strings",
    file.split("\n").reduce((acc, value) => {
      if (_.every(rulesPart1, (rule) => rule(value))) {
        acc++;
      }
      return acc;
    }, 0)
  );
};

const rulesPart2 = {
  oneAndOne: (string) => {
    for (let i = 0; i < string.length - 2; i++) {
      if (string[i] === string[i + 2]) {
        return true;
      }
    }
    return false;
  },
  repeatPattern: (string) => {
    const pairs = [];
    for (let i = 0; i < string.length - 1; i++) {
      pairs.push(string[i] + string[i + 1]);
    }
    for (let i = 0; i < pairs.length; i++) {
      if (_.lastIndexOf(pairs, pairs[i]) !== i) {
        return true;
      }
    }
    return false;
  },
};

assert(rulesPart2.oneAndOne("qjhvhtzxzqqjkmpb"));
assert(rulesPart2.oneAndOne("xxyxx"));
assert(!rulesPart2.oneAndOne("uurcxstgmygtbstg"));

assert(rulesPart2.repeatPattern("qjhvhtzxzqqjkmpb"));
assert(!rulesPart2.repeatPattern("ieodomkazucvgmuy"));
assert(rulesPart2.repeatPattern("xxyxx"));

const part2 = async () => {
  const file = await read("./data.txt", "utf8");
  console.log(
    "Total nice strings part 2",
    file.split("\n").reduce((acc, value) => {
      if (_.every(rulesPart2, (rule) => rule(value))) {
        acc++;
      }
      return acc;
    }, 0)
  );
};

run();
part2();
