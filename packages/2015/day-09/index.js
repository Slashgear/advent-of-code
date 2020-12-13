const fs = require("fs");
const util = require("util");
const read = util.promisify(fs.readFile);
const _ = require("lodash");

const permutation = (array) => {
  const result = [];
  for (let i = 0; i < array.length; i++) {
    let rest = permutation(array.slice(0, i).concat(array.slice(i + 1)));

    if (!rest.length) {
      result.push([array[i]]);
    } else {
      for (let j = 0; j < rest.length; j = j + 1) {
        result.push([array[i]].concat(rest[j]));
      }
    }
  }

  return result;
};

const getDistance = (order, distances) => {
  let distance = 0;

  for (let i = 0; i < order.length - 1; i++) {
    const start = order[i];
    const end = order[i + 1];

    distance += distances.find(
      ({ pair }) =>
        (pair[0] === start && pair[1] === end) ||
        (pair[0] === end && pair[1] === start)
    ).distance;
  }

  return distance;
};

const computeDistance = async () => {
  const file = await read("./data.txt", "utf8");

  const distances = file.split("\n").map((string) => {
    const {
      groups: { A, B, dist },
    } = /(?<A>\w+) to (?<B>\w+) = (?<dist>\d+)/.exec(string);

    return {
      pair: [A, B],
      distance: Number(dist),
    };
  });

  const cities = _.uniq(_.flatten(distances.map(({ pair }) => pair)));
  const permutations = permutation(cities);

  return permutations.reduce((acc, value) => {
    acc.push({
      value,
      distance: getDistance(value, distances),
    });

    return acc;
  }, []);
};

const mapping = computeDistance();

const run = async () => {
  console.log(
    "Minimum distance",
    (await mapping).sort((a, b) => a.distance - b.distance)[0]
  );
};

const part2 = async () => {
  console.log(
    "Maximum distance",
    (await mapping).sort((a, b) => b.distance - a.distance)[0]
  );
};

run();
part2();
