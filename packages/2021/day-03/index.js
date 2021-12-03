const fs = require("fs");
const util = require("util");

const read = util.promisify(fs.readFile);

const run = async () => {
  const values = await read("./data.txt", "utf8").then((data) => {
    const array = data.split("\n");
    array.pop();
    return array;
  });

  console.log(values);
  let gamma = "";
  let epsilon = "";

  for (let i = 0; i < values[0].length; i++) {
    let count1 = 0;
    let count0 = 0;
    for (let j = 0; j < values.length; j++) {
      if (values[j][i] === "1") {
        count1++;
      } else {
        count0++;
      }
    }
    gamma = `${gamma}${count1 > count0 ? "1" : "0"}`;
    epsilon = `${epsilon}${count1 > count0 ? "0" : "1"}`;
  }

  console.log({
    epsilon: parseInt(epsilon, 2),
    gamma: parseInt(gamma, 2),
    result: parseInt(epsilon, 2) * parseInt(gamma, 2),
  });
};

run();
