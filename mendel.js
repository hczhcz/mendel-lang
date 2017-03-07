'use strict';

const process = require('process');
const fs = require('fs');

const boot0 = require('./0/boot');
const boot1 = require('./1/boot');
const boot2 = require('./2/boot');
const boot3js = require('./3.js/boot');
const boot3c = require('./3.c/boot');
const libcore = require('./lib.core');

if (process.argv.length < 3) {
    throw Error();
}

const outJs = fs.openSync(process.argv[2] + '.js', 'w');
const outH = fs.openSync(process.argv[2] + '.h', 'w');
const outC = fs.openSync(process.argv[2] + '.c', 'w');

const b3js = boot3js(
    (text) => {
        fs.writeSync(outJs, text);
    },
    () => {
        // nothing
    }
);

let buffer = '';
const b3jsJIT = boot3js(
    (text) => {
        buffer += text;
    },
    (() => {
        const doEvalGen = 'doEval = (text) => {\n'
            + '    eval(text + doEvalGen);\n'
            + '};\n'
            + '\n';

        let doEval = null;

        eval(doEvalGen);

        return () => {
            doEval(buffer);
            buffer = '';
        };
    })()
);

const b3c = boot3c(
    (text) => {
        fs.writeSync(outH, text);
    },
    (text) => {
        fs.writeSync(outC, text);
    }
);

const b2 = boot2(
    (func) => {
        b3js.newFunction(func);
        b3jsJIT.newFunction(func);
        b3c.newFunction(func);
    },
    (func) => {
        b3js.execute(func);
        b3jsJIT.execute(func);
        b3c.execute(func);
    }
);

const b1 = boot1(
    b2.newInstance, b2.execute, b2.export
);

const b0 = boot0(
    b1.execute, b1.export
);

libcore(b1);

b0.execute(String(fs.readFileSync(process.argv[2])));
