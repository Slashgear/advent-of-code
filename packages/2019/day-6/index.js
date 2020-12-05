const fs = require("fs");
const util = require("util");
const read = util.promisify(fs.readFile);




const run = async () => {
  const file = await read('./data.txt', "utf8")
  const starMap = file.split('\n').reduce((map, line) => {
    map[line.split(')')[1]] = line.split(')')[0];
    return map;
  }, {});

  const getAncestorCount = body => body in starMap ? 1 + getAncestorCount(starMap[body]) : 0;

  console.log(Object.keys(starMap).reduce((sum, body) => sum + getAncestorCount(body), 0));
}


const part2 = async () => {
  const file = await read('./data.txt', "utf8")
  const starMap = file.split('\n').reduce((map, line) => {
    map[line.split(')')[1]] = line.split(')')[0];
    return map;
  }, {});

  const getAncestors = body => body in starMap ? [ ...getAncestors(starMap[body]), starMap[body] ] : [];

  const youAncestors = getAncestors('YOU');
  const santaAncestors = getAncestors('SAN');

  const transfers = youAncestors
    .filter(body => santaAncestors.includes(body))
    .map(body => [
      ...youAncestors.slice(youAncestors.indexOf(body)).reverse(),
      ...santaAncestors.slice(santaAncestors.indexOf(body) + 1)
    ]);

  console.log(Math.min(...transfers.map(transfer => transfer.length - 1)));
}

run();
part2();