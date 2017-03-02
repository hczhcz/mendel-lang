'use strict';

const process = require('process');
const fs = require('fs');

const boot0 = require('./0/boot');
const boot1 = require('./1/boot');
const boot2 = require('./2/boot');
const boot3js = require('./3.js/boot');
const boot3c = require('./3.c/boot');
const libcore = require('./lib.core');

if (process.argv.length < 4) {
    throw Error();
}

const outFile = fs.openSync(process.argv[3], 'w');

const b3js = boot3js(
    root,
    (text) => {
        fs.writeSync(outFile, text);
    }
);

// const b3js = boot3js(
//     root,
//     (() => {
//         const doEvalGen = 'doEval = (text) => {\n'
//             + '    eval(text + doEvalGen);\n'
//             + '};\n'
//             + '\n';

//         let doEval = null;

//         eval(doEvalGen);

//         return (text) => {
//             doEval(text);
//         };
//     })()
// );

// const b3c = boot3c();

const b2 = boot2(
    b3js.newFunction, b3js.execute
);

const b1 = boot1(
    b2.newInstance, b2.execute, b2.export
);

const b0 = boot0(
    b1.execute, b1.export
);

libcore(b1);

b0.execute(String(fs.readFileSync(process.argv[2])));
