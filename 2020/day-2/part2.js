const fs = require('fs');
const util = require('util');

const read = util.promisify(fs.readFile);

const run = async () => {
    let valid = 0;
    const values = await read('./data.txt', 'utf8').then(data => data.split('\n'));
    const parseRegexp = /(?<min>\d+)-(?<max>\d+) (?<char>.): (?<password>.+)/
    values.forEach(value => {
        const { groups: { min: minString, max: maxString, char, password }} = parseRegexp.exec(value);
        const min = parseInt(minString, 10)
        const max = parseInt(maxString, 10)
        //console.log({ value, char,count, min, max, password, valid: count >= min && count <= max })
        if((password[min-1] === char && password[max - 1] !== char) || (password[min-1] !== char && password[max - 1] === char)) {
            valid++
        }
    })

    console.log("Total", valid)
}

run();