const fs = require("fs");
const util = require("util");
const read = util.promisify(fs.readFile);

const run = async () => {
  const file = await read("./data.txt", "utf8");
  const strings = file.split("\n");

  console.log(
    "Total char",
    strings.join``.length -
      strings.map((string) => string.replace(/\\\\|\\"|\\x[a-f0-9]{2}/g, "a"))
        .join``.length +
      strings.length * 2
  );
};

const part2 = async () => {
  const file = await read("./data.txt", "utf8");
  const strings = file.split("\n");

  console.log(
    "Total extended char diff",
    strings.map((string) => string.replace(/\\|"/g, "aa") + "aa").join``
      .length - strings.join``.length
  );
};

run();
part2();
