const fs = require("fs");
const util = require("util");

const read = util.promisify(fs.readFile);

const run = async () => {
  const values = await read("./data.txt", "utf8").then((data) => {
    const array = data.split("\n");
    return array
      .map((string) => string.split(" "))
      .map(([direction, count]) => ({
        direction,
        count: parseInt(count, 10),
      }));
  });

  let x = 0;
  let y = 0;
  let aim = 0;

  values.forEach(({ direction, count }) => {
    switch (direction) {
      case "forward":
        x += count;
        y += count * aim;
        break;
      case "down":
        aim += count;
        break;
      case "up":
        aim -= count;
        break;
      default:
        break;
    }
  });

  console.log({ x, y, solution: x * y });
};

run();
