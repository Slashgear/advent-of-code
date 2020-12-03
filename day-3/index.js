const fs = require("fs");
const util = require("util");

const read = util.promisify(fs.readFile);
const ROW_LENGTH = 31;

const run = async (xIncrement, yIncrement) => {
  let tree = 0;
  const values = await read("./data.txt", "utf8").then(data =>
    data.split("\n")
  );
  const HEIGHT = values.length;
  let x = 0;

  for (let y = 0; y < HEIGHT; y+=yIncrement) {
    const realValue = x % ROW_LENGTH;
    //console.log({ row: values[y], x, realValue, value: values[y][realValue]})
    if (values[y][realValue] === "#") {
      tree++;
    }
    x += xIncrement;
  }

  console.log({
    tree,
    xIncrement,
    yIncrement
  });

  return tree;
};


Promise.all([
  run(1, 1),
  run(3, 1),
  run(5, 1),
  run(7, 1),
  run(1, 2)
]).then(trees => {

  const total = trees.reduce((acc, value) => {
    acc*=value;

    return acc;
  } ,1);

  console.log({ total })
})

