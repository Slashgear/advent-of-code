const fs = require('fs');
const util = require('util');

const read = util.promisify(fs.readFile);

const run = async () => {
    const values = await read('./data.txt', 'utf8').then(data => data.split('\n'));

    console.log("Looping")
    for(let i = 0; i < values.length; i++) {
        for(let j = 0; j < values.length; j++) {
            for(let k = 0;k <values.length;k++) {
                const sum = parseInt(values[i],10) + parseInt(values[j], 10) + parseInt(values[k], 10);
                if(sum === 2020) {
                    console.log(`found pair A ${values[i]}, B ${values[j]}, C${values[k]}`)
                    console.log(`Multiply ${parseInt(values[i],10)*parseInt(values[j], 10)*parseInt(values[k], 10)}`)
                    process.exit(0)
                }
            }

        }
    }
    console.log("Not found")
}

run();