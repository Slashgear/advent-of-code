const _ = require("lodash");
const fs = require("fs");
const util = require("util");
const assert = require("assert");
const { inRange } = require("lodash");
const read = util.promisify(fs.readFile);

const parseRule = (string) => {
  const {
    groups,
  } = /^(?<action>turn on|turn off|toggle) (?<minX>\d{1,3}),(?<minY>\d{1,3}) through (?<maxX>\d{1,3}),(?<maxY>\d{1,3})$/.exec(
    string
  );
  return {
    minX: Number(groups.minX),
    maxX: Number(groups.maxX),
    minY: Number(groups.minY),
    maxY: Number(groups.maxY),
    action: groups.action,
  };
};

assert(parseRule("turn off 643,319 through 935,662").action === "turn off");
assert(parseRule("turn off 643,319 through 935,662").minX === 643);
assert(parseRule("turn off 643,31 through 935,662").minY === 31);
assert(parseRule("turn off 643,31 through 935,662").maxX === 935);
assert(parseRule("turn off 643,31 through 935,662").maxY === 662);

const run = async () => {
  const file = await read("./data.txt", "utf8");
  let grid = new Array(1000).fill(new Array(1000));
  grid = grid.map((row) => row.map((it) => false));
  const rules = file.split("\n").map(parseRule);

  rules.forEach(({ minX, maxX, minY, maxY, state, action }) => {
    for (let i = minX; i <= maxX; i++) {
      for (let j = minY; j <= maxY; j++) {
        if (action === "toggle") {
          grid[i][j] = !grid[i][j];
        } else if (action === "turn on") {
          grid[i][j] = true;
        } else {
          grid[i][j] = false;
        }
      }
    }
  });

  console.log("Total 💡", _.sum(grid.map(_.sum)));
};

const part2 = async () => {
  const file = await read("./data.txt", "utf8");
  var input = file.split("\n").filter(function (l) {
    return l.length > 0;
  });

  function applyCommand2(grid, command) {
    for (let x = command.minX; x <= command.maxX; x++) {
      for (let y = command.minY; y <= command.maxY; y++) {
        if (grid[x] == undefined) grid[x] = [];
        if (grid[x][y] == undefined) grid[x][y] = 0;
        switch (command.action) {
          case "turn on":
            grid[x][y] += 1;
            break;
          case "turn off":
            if (grid[x][y] > 0) grid[x][y] -= 1;
            break;
          case "toggle":
            grid[x][y] += 2;
            break;
        }
      }
    }

    return grid;
  }

  console.log(
    "Total brightness 💡",
    input
      .map(parseRule)
      .reduce(applyCommand2, [])
      .reduce(function (intensity, row) {
        return (
          intensity +
          row.reduce(function (intensity, col) {
            return intensity + col;
          }, 0)
        );
      }, 0)
  );
};

run();
part2();
