const fs = require("fs");
const util = require("util");
const read = util.promisify(fs.readFile);
const _ = require("lodash");
const assert = require("assert");

const analyseNeighboors = ({ rows, x, y, ROW_LENGTH, ROW_COUNT }) => {
  let neighboors = [];

  // Up
  if (y > 0) {
    if (rows[y - 1][x]) neighboors.push(rows[y - 1][x]);
    if (x > 0) {
      if (rows[y - 1][x - 1]) neighboors.push(rows[y - 1][x - 1]);
    }
    if (x < ROW_LENGTH) {
      if (rows[y - 1][x + 1]) neighboors.push(rows[y - 1][x + 1]);
    }
  }

  //Left
  if (x > 0) {
    if (rows[y][x - 1]) neighboors.push(rows[y][x - 1]);
  }

  //Right
  if (x < ROW_LENGTH) {
    if (rows[y][x + 1]) neighboors.push(rows[y][x + 1]);
  }

  // Down
  if (y < ROW_COUNT - 1) {
    if (rows[y + 1][x]) neighboors.push(rows[y + 1][x]);
    if (x > 0) {
      if (rows[y + 1][x - 1]) neighboors.push(rows[y + 1][x - 1]);
    }
    if (x < ROW_LENGTH) {
      if (rows[y + 1][x + 1]) neighboors.push(rows[y + 1][x + 1]);
    }
  }

  return {
    "#": 0,
    ".": 0,
    L: 0,
    ..._.countBy(neighboors),
  };
};

const degubValue = [
  ["#", ".", "#", "#", ".", "#", "#", ".", "#", "#"],
  ["#", "#", "#", "#", "#", "#", "#", ".", "#", "#"],
  ["#", ".", "#", ".", "#", ".", ".", "#", ".", "."],
  ["#", "#", "#", "#", ".", "#", "#", ".", "#", "#"],
  ["#", ".", "#", "#", ".", "#", "#", ".", "#", "#"],
  ["#", ".", "#", "#", "#", "#", "#", ".", "#", "#"],
  [".", ".", "#", ".", "#", ".", ".", ".", ".", "."],
  ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
  ["#", ".", "#", "#", "#", "#", "#", "#", ".", "#"],
  ["#", ".", "#", "#", "#", "#", "#", ".", "#", "#"],
];

assert.equal(
  analyseNeighboors({
    rows: degubValue,
    x: 2,
    y: 0,
    ROW_COUNT: 10,
    ROW_LENGTH: 10,
  })["#"],
  4
);

const countOccupiedSeats = (grid) => {
  return _.reduce(
    grid,
    (acc, value) => {
      const countOccupied = _.countBy(value)["#"];
      acc += countOccupied ? countOccupied : 0;
      return acc;
    },
    0
  );
};

const run = async () => {
  const file = await read("./data.txt", "utf8");
  let rows = file.split("\n").map((row) => row.split(""));
  const ROW_LENGTH = rows[0].length;
  const ROW_COUNT = rows.length;

  let countChanges;
  do {
    countChanges = 0;
    const copy = _.cloneDeep(rows);
    for (let y = 0; y < ROW_COUNT; y++) {
      for (let x = 0; x < ROW_LENGTH; x++) {
        const infos = analyseNeighboors({ rows, x, y, ROW_COUNT, ROW_LENGTH });

        if (rows[y][x] === "L" && infos["#"] === 0) {
          copy[y][x] = "#";
          countChanges++;
        }

        if (rows[y][x] === "#" && infos["#"] >= 4) {
          copy[y][x] = "L";
          countChanges++;
        }
      }
    }

    rows = copy;
  } while (countChanges !== 0);

  console.log("Final occupied seats", countOccupiedSeats(rows));
};

const nextItem = ({ direction, x, y }) => {
  if (direction === "top-left") return { y: y - 1, x: x - 1 };
  if (direction === "top") return { y: y - 1, x };
  if (direction === "top-right") return { y: y - 1, x: x + 1 };
  if (direction === "right") return { y, x: x + 1 };
  if (direction === "bottom-right") return { y: y + 1, x: x + 1 };
  if (direction === "bottom") return { y: y + 1, x };
  if (direction === "bottom-left") return { y: y + 1, x: x - 1 };
  if (direction === "left") return { y, x: x - 1 };
};

const recursion = ({ rows, direction, x, y }) => {
  if (!rows[y]) return "";
  if (!rows[y][x]) return "";
  if (rows[y][x] !== ".") return rows[y][x];
  return recursion({ rows, direction, ...nextItem({ direction, x, y }) });
};

const analyseFullNeighboors = ({ rows, x, y }) => {
  let count = 0;
  if (recursion({ rows, x: x - 1, y: y - 1, direction: "top-left" }) === "#") {
    count++;
  }
  if (recursion({ rows, y: y - 1, x, direction: "top" }) === "#") {
    count++;
  }
  if (recursion({ rows, y: y - 1, x: x + 1, direction: "top-right" }) === "#") {
    count++;
  }
  if (recursion({ rows, y, x: x + 1, direction: "right" }) === "#") {
    count++;
  }
  if (
    recursion({ rows, x: x + 1, y: y + 1, direction: "bottom-right" }) === "#"
  ) {
    count++;
  }
  if (recursion({ rows, x, y: y + 1, direction: "bottom" }) === "#") {
    count++;
  }
  if (
    recursion({ rows, x: x - 1, y: y + 1, direction: "bottom-left" }) === "#"
  ) {
    count++;
  }
  if (recursion({ rows, x: x - 1, y, direction: "left" }) === "#") {
    count++;
  }
  return count;
};

const printGrid = (grid) => {
  console.log(grid.map((row) => row.join("")).join("\n") + "\n");
};

const part2 = async () => {
  const file = await read("./data.txt", "utf8");
  let rows = file.split("\n").map((row) => row.split(""));
  const ROW_LENGTH = rows[0].length;
  const ROW_COUNT = rows.length;

  let countChanges;
  do {
    countChanges = 0;
    const copy = _.cloneDeep(rows);
    for (let y = 0; y < ROW_COUNT; y++) {
      for (let x = 0; x < ROW_LENGTH; x++) {
        const occupiedSeats = analyseFullNeighboors({
          rows,
          x,
          y,
        });

        if (rows[y][x] === "L" && occupiedSeats === 0) {
          copy[y][x] = "#";
          countChanges++;
        }

        if (rows[y][x] === "#" && occupiedSeats >= 5) {
          copy[y][x] = "L";
          countChanges++;
        }
      }
    }
    rows = copy;
  } while (countChanges !== 0);

  console.log("Final full occupied seats", countOccupiedSeats(rows));
};

run();
part2();
