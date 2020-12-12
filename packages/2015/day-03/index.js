const fs = require("fs");
const util = require("util");
const read = util.promisify(fs.readFile);

const run = async () => {
  const text = await read("./data.txt", "utf8");
  const { visited } = text.split("").reduce(
    (data, char) => {
      if (char === "^") data.y--;
      if (char === ">") data.x++;
      if (char === "v") data.y++;
      if (char === "<") data.x--;
      data.visited.add(data.x + "," + data.y);

      return data;
    },
    {
      x: 0,
      y: 0,
      visited: new Set(),
    }
  );

  console.log("Total duplicate position", visited.size);
};

const part2 = async () => {
  const text = await read("./data.txt", "utf8");
  const { visited } = text.split("").reduce(
    (data, ch, i) => {
      let p = i % 2;
      if (ch === "^") data.y[p]--;
      if (ch === ">") data.x[p]++;
      if (ch === "v") data.y[p]++;
      if (ch === "<") data.x[p]--;
      data.visited.add(data.x[p] + "," + data.y[p]);

      return data;
    },
    {
      x: [0, 0],
      y: [0, 0],
      visited: new Set(),
    }
  );

  console.log("Total position", visited.size);
};

run();
part2();
