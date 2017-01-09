'use strict';

const process = require('process');
const fs = require('fs');

const type = require('./1/type');
const boot0 = require('./0/boot');
const boot1 = require('./1/boot');
const boot2js = require('./2.js/boot');
const boot2c = require('./2.c/boot');
const libcore = require('./lib.core');

if (process.argv.length < 4) {
    throw Error();
}

const outFile = fs.openSync(process.argv[3], 'w');

const root = type.instance('out');

const b2js = boot2js(
    root,
    (data) => {
        fs.writeSync(outFile, data);
    }
);

// const b2js = boot2js(
//     root,
//     (() => {
//         const doEvalGen = 'doEval = (data) => {\n'
//             + '    eval(data + doEvalGen);\n'
//             + '};\n'
//             + '\n';

//         let doEval;

//         eval(doEvalGen);

//         return (data) => {
//             doEval(data);
//         };
//     })()
// );

// const b2c = boot2c();

const b1 = boot1(
    root,
    b2js.newInstance, b2js.execute, b2js.export
);

const b0 = boot0(
    b1.execute, b1.export
);

libcore(b1);

b0.execute(String(fs.readFileSync(process.argv[2])));
b2js.collect();
