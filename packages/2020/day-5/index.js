const fs = require("fs");
const util = require("util");
const _ = require("lodash");
const assert = require('assert');

const read = util.promisify(fs.readFile);

const computeRowAndSet = value => {
  let minRow = 0;
  let maxRow = 127
  let minSeat = 0;
  let maxSeat = 7;
  let diff;
  let newValue;

  for(let i=0;i < value.length; i++) {
    switch (value[i]){
      case 'F':
        diff = maxRow - minRow;
        newValue = Math.floor(diff / 2);
        maxRow = newValue + minRow;
        break;
      case 'B':
        diff = maxRow - minRow;
        newValue = Math.ceil(diff / 2);
        minRow = newValue + minRow;
        break;
      case 'R':
        diff = maxSeat - minSeat;
        newValue = Math.ceil(diff / 2);
        minSeat = newValue + minSeat;
        break;
      case 'L':
        diff = maxSeat - minSeat;
        newValue = Math.floor(diff / 2);
        maxSeat = newValue + minSeat;
        break;
    }
  }

  return {
    row: maxRow,
    seat: maxSeat,
  }
}

assert(computeRowAndSet('FBFBBFFRLR').row === 44)
assert(computeRowAndSet('FBFBBFFRLR').seat === 5)

assert(computeRowAndSet('BFFFBBFRRR').row === 70)
assert(computeRowAndSet('BFFFBBFRRR').seat === 7)

assert(computeRowAndSet('FFFBBBFRRR').row === 14)
assert(computeRowAndSet('FFFBBBFRRR').seat === 7)

assert(computeRowAndSet('BBFFBBFRLL').row === 102)
assert(computeRowAndSet('BBFFBBFRLL').seat === 4)

const computeId = ({ row, seat}) => {
  return (row * 8) + seat;
}

assert(computeId(computeRowAndSet('BFFFBBFRRR'))=== 567)
assert(computeId(computeRowAndSet('FFFBBBFRRR'))=== 119)
assert(computeId(computeRowAndSet('BBFFBBFRLL'))=== 820)


const run = async () => {
  const values = await read("./data.txt", "utf8");
  const seats = values.split('\n');
  let maxValue = 0

  for(let i=0; i< seats.length; i++) {
    const id = computeId(computeRowAndSet(seats[i]));
    if(id > maxValue) {
      maxValue = id
    }
  }

  console.log("Max Id", maxValue)
};

const part2 = async () => {
  const values = await read("./data.txt", "utf8");
  const seats = values.split('\n');
  const usedIds = [];
  const allIds = [];

  for(let i=0; i< 128;i++) {
    for(let j=0; j<8; j++){
      allIds.push(computeId({ row:i, seat:j}))
    }
  }

  for(let i=0; i< seats.length; i++) {
    const id = computeId(computeRowAndSet(seats[i]));
    usedIds.push(id);
  }

  console.log(_.difference(allIds, usedIds))
}

run();
part2();

