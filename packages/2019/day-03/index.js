const fs = require("fs");
const util = require("util");
const _ = require("lodash");

const read = util.promisify(fs.readFile);

const parseAction = (action) => {
  return {
    direction: action.substr(0, 1),
    value: Number(action.substr(1)),
  };
};

const listPoints = (cable) => {
  let currentPosX = 0;
  let currentPosY = 0;
  const list = [];
  for (let i = 0; i < cable.length; i++) {
    const action = parseAction(cable[i]);
    for (let j = 0; j < action.value; j++) {
      switch (action.direction) {
        case "U":
          currentPosY++;
          break;
        case "R":
          currentPosX++;
          break;
        case "D":
          currentPosY--;
          break;
        case "L":
          currentPosX--;
          break;
      }
      list.push(`${currentPosX},${currentPosY}`);
    }
  }
  return list;
};

console.log(listPoints("L1010", "D906", "R561", "D862", "R541"));

const run = async () => {
  const cables = await read("./data.txt", "utf8").then((data) =>
    data.split("\n")
  );
  const cable1 = cables[0].split(",");
  const cable2 = cables[1].split(",");

  const points1 = listPoints(cable1);
  const points2 = listPoints(cable2);

  const matchingPoints = _.intersection(points1, points2);
  console.log(matchingPoints);
  console.log(
    matchingPoints.map((item) =>
      _.sum(item.split(",").map((val) => Math.abs(Number(val))))
    )
  );
};

const part2 = async () => {
  const cables = await read("./data.txt", "utf8").then((data) =>
    data.split("\n")
  );
  const cable1 = cables[0].split(",");
  const cable2 = cables[1].split(",");

  const points1 = listPoints(cable1);
  const points2 = listPoints(cable2);

  const matchingPoints = _.intersection(points1, points2);
  console.log(matchingPoints);
  const yeah = matchingPoints
    .map((item) => {
      return {
        cable1: points1.indexOf(item) + 1,
        cable2: points2.indexOf(item) + 1,
      };
    })
    .map(({ cable1, cable2 }) => cable1 + cable2);

  console.log(_.min(yeah));
};

run();
part2();
