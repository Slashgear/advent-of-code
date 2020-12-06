const fs = require("fs");
const util = require("util");
const _ = require("lodash");
const assert = require("assert");
const read = util.promisify(fs.readFile);

const loadGroup = async () => {
  const file = await read('./data.txt', 'utf8');
  const groups = file
     .split('\n\n')
     .map(group => group.split('\n'));

  return groups;
}

const reduceGroup = (group) => {
  return _.union(...group.map(person => person.split(''))).length
}


const run = async () => {
  const groups = await loadGroup();
  let count = 0;
  for(let i=0;i< groups.length; i++) {
    count+=reduceGroup(groups[i])
  }
  console.log('Total part 1', count)
};

const intersection = (group) => {
  return _.intersection(...group.map(person => person.split(''))).length
}

const part2 = async () => {
  const groups = await loadGroup();
  let count = 0;
  for(let i=0;i< groups.length; i++) {
    count+=intersection(groups[i])
  }
  console.log('Total part 2', count)
};

run();
part2();
