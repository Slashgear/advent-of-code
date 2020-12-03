const fs = require('fs');
const util = require('util');

const read = util.promisify(fs.readFile);

const run = async () => {
    const values = await read('./data.txt', 'utf8').then(data => data.split('\n'));
    let sum = 0
    for(let i = 0; i < values.length; i++) {
        const parsed = Number(values[i]);
        sum=sum + (Math.floor(parsed / 3) - 2)
    }

    console.log("Total", sum);
}

run();