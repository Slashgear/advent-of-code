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

const computeNewWaypoint = (originalWaypoint, angle) => {
  let dE =
    originalWaypoint.E * Math.cos(angle) - originalWaypoint.N * Math.sin(angle);
  let dN =
    originalWaypoint.E * Math.sin(angle) + originalWaypoint.N * Math.cos(angle);
  return { E: Math.round(dE), N: Math.round(dN) };
};

const actionReducers = {
  N: (state, value) => ({
    ...state,
    waypoint: { N: state.waypoint.N + value, E: state.waypoint.E },
  }),
  S: (state, value) => ({
    ...state,
    waypoint: { N: state.waypoint.N - value, E: state.waypoint.E },
  }),
  E: (state, value) => ({
    ...state,
    waypoint: { N: state.waypoint.N, E: state.waypoint.E + value },
  }),
  W: (state, value) => ({
    ...state,
    waypoint: { N: state.waypoint.N, E: state.waypoint.E - value },
  }),
  F: (state, value) => ({
    ...state,
    position: {
      N: state.position.N + state.waypoint.N * value,
      E: state.position.E + state.waypoint.E * value,
    },
  }),
  L: (state, value) => {
    let angle = (value * Math.PI) / 180;
    return { ...state, waypoint: computeNewWaypoint(state.waypoint, angle) };
  },
  R: (state, value) => {
    let angle = (-value * Math.PI) / 180;
    return { ...state, waypoint: computeNewWaypoint(state.waypoint, angle) };
  },
};

const run = async () => {
  const file = await read("./data.txt", "utf8");
  let initialState = {
    position: {
      E: 0,
      N: 0,
    },
    waypoint: {
      E: 10,
      N: 1,
    },
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
    Math.abs(finalState.position.E) + Math.abs(finalState.position.N)
  );
};

run();
