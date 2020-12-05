const fs = require('fs');
const util = require('util');
const _ = require('lodash');
const assert = require('assert');

const read = util.promisify(fs.readFile);

const MIN_RANGE = 147981;
const MAX_RANGE = 691423;

const toArray = number => number.toString(10).replace(/\D/g, '0').split('').map(Number)

const checkPair = (nArray) => {
    for(let i = 0; i<nArray.length - 1; i++) {
        if(nArray[i] === nArray[i+1]) {
            return true;
        }
    }

    return false;
}

assert(checkPair(toArray(1123453)))
assert(!checkPair(toArray(1234567)))
assert(checkPair(toArray(1111111)))

const checkIncrease = (nArray) => {
    for(let i = 0; i < nArray.length - 1; i++) {
        if(nArray[i+1] < nArray[i]) {
            return false;
        }
    }

    return true;
}


assert(!checkIncrease(toArray(1123453)))
assert(checkIncrease(toArray(1234567)))
assert(checkIncrease(toArray(1111111)))

const run = async () => {
    let count = 0;
    for (let i = MIN_RANGE; i <= MAX_RANGE; i++) {
        const values = toArray(i);
        if(checkPair(values) && checkIncrease(values)) {
            count++
        }
    }
    console.log("Total password match", count)
}

const checkNo3 = (nArray) => {
    const countByNumber = nArray.reduce((acc, value) => {
        if(!acc[value]) {
            acc[value] = 0
        }
        acc[value]++

        return acc
    }, {});

    return _.find(countByNumber, (value, key) => value === 2);
}

assert(checkNo3(toArray(1123453)))
assert(!checkNo3(toArray(1111111)))
assert(checkNo3(toArray(11333333)))

const part2 = async () => {
    let count = 0;
    for (let i = MIN_RANGE; i <= MAX_RANGE; i++) {
        const values = toArray(i);
        if(checkPair(values) && checkIncrease(values) && checkNo3(values)) {
            count++
        }
    }
    console.log("Total password match", count)
}

run();
part2();