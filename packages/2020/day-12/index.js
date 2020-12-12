const fs = require("fs");
const util = require("util");
const assert = require("assert");
const read = util.promisify(fs.readFile);

const parseAction = (action) => {
  const {
    groups: { direction, value },
  } = /^(?<direction>\w)(?<value>\d+)/.exec(action);
  return {
    direction,
    value: Number(value),
  };
};

assert.equal(parseAction("A234").value, 234);
assert.equal(parseAction("A234").direction, "A");
const modulo = (n, m) => {
  return ((n % m) + m) % m;
};

const directionOrder = ["E", "S", "W", "N"];
const leftDir = (currentDir, value) => {
  const number = value / 90;
  const index = directionOrder.indexOf(currentDir);
  const nextIndex = modulo(index - number, directionOrder.length);
  return directionOrder[nextIndex];
};

assert.equal(leftDir("E", 90), "N");

const rightDir = (currentDir, value) => {
  const number = value / 90;
  const index = directionOrder.indexOf(currentDir);
  const nextIndex = modulo(index + number, directionOrder.length);
  return directionOrder[nextIndex];
};

const actionReducers = {
  N: (state, value) => ({ ...state, N: state.N + value }),
  S: (state, value) => ({ ...state, N: state.N - value }),
  E: (state, value) => ({ ...state, E: state.E + value }),
  W: (state, value) => ({ ...state, E: state.E - value }),
  F: (state, value) => actionReducers[state.CURRENT_DIRECTION](state, value),
  L: (state, value) => ({
    ...state,
    CURRENT_DIRECTION: leftDir(state.CURRENT_DIRECTION, value),
  }),
  R: (state, value) => ({
    ...state,
    CURRENT_DIRECTION: rightDir(state.CURRENT_DIRECTION, value),
  }),
};

const run = async () => {
  const file = await read("./data.txt", "utf8");
  let initialState = {
    E: 0,
    N: 0,
    CURRENT_DIRECTION: "E",
  };
  const finalState = file
    .split("\n")
    .map(parseAction)
    .reduce((state, action) => {
      return actionReducers[action.direction](state, action.value);
    }, initialState);

  console.log(
    "Final position for part 1",
    finalState,
    Math.abs(finalState.E) + Math.abs(finalState.N)
  );
};

run();
