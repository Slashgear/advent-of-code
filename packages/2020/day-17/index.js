const fs = require("fs");
const util = require("util");
const read = util.promisify(fs.readFile);
const _ = require("lodash");

const getNeighbours = (x, y, z, map) => {
  const result = [];
  for (let i = x - 1; i <= x + 1; i++) {
    for (let j = y - 1; j <= y + 1; j++) {
      for (let k = z - 1; k <= z + 1; k++) {
        if (i !== x || j !== y || k !== z) {
          const key = [i, j, k].join`,`;
          if (map.has(key)) {
            result.push(map.get(key));
          } else {
            result.push(false);
          }
        }
      }
    }
  }
  return result;
};

const parseFile = async () => {
  const file = await read("./data.txt", "utf8");
  const lines = file
    .split("\n")
    .filter((x) => x)
    .map((x) => [...x]);
  let map = new Map();

  lines.forEach((line, y) => {
    line.forEach((value, x) => {
      const active = value === "#";
      const id = [x, y, 0].join`,`;
      map.set(id, active);
    });
  });
  return map;
};

const loadData = parseFile();

const part1 = async () => {
  let map = await loadData;

  for (let i = 0; i < 6; i++) {
    const keys = map.keys();
    let minx = null;
    let miny = null;
    let minz = null;
    let maxx = null;
    let maxy = null;
    let maxz = null;

    for (const key of keys) {
      const [x, y, z] = key.split(",").map((x) => parseInt(x));
      if (x < minx) minx = x;
      if (y < miny) miny = y;
      if (z < minz) minz = z;
      if (x > maxx) maxx = x;
      if (y > maxy) maxy = y;
      if (z > maxz) maxz = z;
    }

    const newState = new Map();

    for (let x = minx - 1; x <= maxx + 1; x++) {
      for (let y = miny - 1; y <= maxy + 1; y++) {
        for (let z = minz - 1; z <= maxz + 1; z++) {
          const neighbours = getNeighbours(x, y, z, map);
          const activeNeibours = neighbours.filter((x) => x).length;
          const key = [x, y, z].join`,`;
          const isActive = map.has(key) ? map.get(key) : false;
          if (isActive && activeNeibours !== 2 && activeNeibours !== 3) {
            newState.set(key, false);
          } else if (!isActive && activeNeibours === 3) {
            newState.set(key, true);
          } else {
            newState.set(key, isActive);
          }
        }
      }
    }

    map = newState;
  }

  let sum = 0;
  let cubes = map.values();
  for (const cube of cubes) {
    if (cube) sum++;
  }

  console.log("Sum for part 1:", sum);
};

part1();
