const assert = require("assert");

const INPUT = "cqjxjnds";
const LETTER_ORDER = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];

const incrementLetter = (letter) => {
  const index = LETTER_ORDER.indexOf(letter);

  return index === LETTER_ORDER.length - 1
    ? LETTER_ORDER[0]
    : LETTER_ORDER[index + 1];
};

assert.strictEqual(incrementLetter("a"), "b");
assert.strictEqual(incrementLetter("d"), "e");
assert.strictEqual(incrementLetter("z"), "a");

const nextPassword = (currentPassword) => {
  let nextPassword = "";
  let modifiedLetter = "a";
  let index = currentPassword.length;
  do {
    index--;
    if (modifiedLetter === "a") {
      modifiedLetter = incrementLetter(currentPassword[index]);
      nextPassword = `${modifiedLetter}${nextPassword}`;
    } else {
      nextPassword = `${currentPassword[index]}${nextPassword}`;
    }
  } while (index > 0);

  return nextPassword;
};

assert.strictEqual(nextPassword("a"), "b");
assert.strictEqual(nextPassword("xy"), "xz");
assert.strictEqual(nextPassword("xzz"), "yaa");

const rulesPart1 = {
  following: (password) =>
    /abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz/.test(
      password
    ),
  notSomeLetter: (password) => !/[iol]/.test(password),
  overlapping: (password) => /(.)\1.*?(.)\2/.test(password),
};

const part1 = () => {
  let found = false;
  let currentPassword = INPUT;
  while (!found) {
    currentPassword = nextPassword(currentPassword);
    //console.log(currentPassword)
    found = Object.values(rulesPart1).every((rule) => rule(currentPassword));
  }
  console.log("Next password part 1", currentPassword);
};

const part2 = () => {
  let found = false;
  let currentPassword = "cqjxxyzz";
  while (!found) {
    currentPassword = nextPassword(currentPassword);
    //console.log(currentPassword)
    found = Object.values(rulesPart1).every((rule) => rule(currentPassword));
  }
  console.log("Next password part 1", currentPassword);
};

part1();
part2();
