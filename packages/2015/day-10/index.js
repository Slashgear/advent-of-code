const assert = require("assert");

const readNumber = (numberAsString) => {
  let result = "";

  for (let i = 0; i < numberAsString.length; i++) {
    let count = 1;
    for (let j = i + 1; j < numberAsString.length; j++) {
      if (numberAsString[i] === numberAsString[j]) {
        count++;
      } else {
        break;
      }
    }
    result = `${result}${count}${numberAsString[i]}`;
    i += count - 1;
  }

  return result;
};

assert.equal(readNumber("1"), "11");
assert.equal(readNumber("21"), "1211");
assert.equal(readNumber("1211"), "111221");
assert.equal(readNumber("111221"), "312211");

const part1 = () => {
  let initialValue = "1113122113";
  for (let i = 0; i < 40; i++) {
    const newValue = readNumber(initialValue);
    initialValue = newValue;
  }
  console.log("Final value part 1", initialValue.length);
  return initialValue;
};

const part2 = () => {
  let initialValue = part1();
  for (let i = 0; i < 10; i++) {
    const newValue = readNumber(initialValue);
    initialValue = newValue;
  }
  console.log("Final value part 2", initialValue.length);
};

part2();
