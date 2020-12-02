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
        const customRegexp = new RegExp(char, 'g')
        const occ = password.match(customRegexp)
        const count = occ ? occ.length : 0
        //console.log({ value, char,count, min, max, password, valid: count >= min && count <= max })
        if(count >= min && count <= max) {
            valid++
        }
    })

    console.log("Total", valid)
}

run();