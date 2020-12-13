const _ = require("lodash");
const timestamp = 1007268;
const departures =
  "17,x,x,x,x,x,x,41,x,x,x,x,x,x,x,x,x,937,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,13,x,x,x,x,23,x,x,x,x,x,29,x,397,x,x,x,x,x,37,x,x,x,x,x,x,x,x,x,x,x,x,19";

const run = async () => {
  const times = departures
    .split(",")
    .filter((string) => string !== "x")
    .map(Number);

  const result = times
    .reduce((acc, value) => {
      acc.push({
        value,
        modulo: timestamp % value,
        diff: value - (timestamp % value),
      });
      return acc;
    }, [])
    .sort((a, b) => b.diff - a.diff)
    .pop();
  console.log("Part 1 result is", result.value * result.diff);
};

const part2 = async () => {
  const [first, ...buses] = departures
    .split(",")
    .map((value) => {
      return value !== "x" ? Number(value) : value;
    })
    .reduce((acc, value, index) => {
      if (_.isNumber(value)) {
        acc.push({
          value,
          offset: index,
        });
      }

      return acc;
    }, []);

  let multiplier = first.value;
  let i = 0;

  buses.forEach(({ value, offset }) => {
    while (true) {
      if ((i + offset) % value === 0) {
        multiplier *= value;
        break;
      }
      i += multiplier;
    }
  });

  console.log("Result of part 2", i);
};

run();
part2();
