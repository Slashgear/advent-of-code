const fs = require("fs");
const util = require("util");
const read = util.promisify(fs.readFile);

const run = async () => {
  const text = await read("./data.txt", "utf8");
  let floor = 0;
  for (let i = 0; i < text.length; i++) {
    if (text[i] === "(") {
      floor++;
    }

    if (text[i] === ")") {
      floor--;
    }
  }

  console.log("Computed floor", floor);
};

const part2 = async () => {
  const text = await read("./data.txt", "utf8");
  let floor = 0;
  let i;
  for (i = 0; i < text.length; i++) {
    if (text[i] === "(") {
      floor++;
    }

    if (text[i] === ")") {
      floor--;
    }

    if (floor === -1) {
      break;
    }
  }

  console.log("Total", i + 1);
};

run();
part2();
