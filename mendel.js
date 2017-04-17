'use strict';

const process = require('process');
const fs = require('fs');
const path = require('path');

const boot0 = require('./0/boot');
const entity1 = require('./1/entity');
const boot1 = require('./1/boot');
const entity2 = require('./2/entity');
const boot2 = require('./2/boot');
const boot3js = require('./3.js/boot');
const boot3c = require('./3.c/boot');
const libcore = require('./lib/core');

if (process.argv.length < 3) {
    throw Error();
}

const inPath = path.parse(process.argv[2]);

const outJs = fs.openSync(path.format({
    root: inPath.root,
    dir: inPath.dir,
    name: inPath.name,
    ext: '.js',
}), 'w');
const outH = fs.openSync(path.format({
    root: inPath.root,
    dir: inPath.dir,
    name: inPath.name,
    ext: '.h',
}), 'w');
const outC = fs.openSync(path.format({
    root: inPath.root,
    dir: inPath.dir,
    name: inPath.name,
    ext: '.c',
}), 'w');

const root = entity1.instance('out');
const main = entity2.func(root);

fs.writeSync(outC, '#include "' + path.format({
    name: inPath.name,
    ext: '.h',
}) + '"\n\n');

const b3js = boot3js(
    main,
    (text) => {
        fs.writeSync(outJs, text);
    },
    () => {
        // nothing
    }
);

let buffer = '';
const b3jsJIT = boot3js(
    main,
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
    main,
    (text) => {
        fs.writeSync(outH, text);
    },
    (text) => {
        fs.writeSync(outC, text);
    }
);

const b2 = boot2(
    root, main,
    (nextId) => {
        b3js.newFunction(nextId);
        b3jsJIT.newFunction(nextId);
        b3c.newFunction(nextId);
    },
    (nextId) => {
        b3js.execute(nextId);
        b3jsJIT.execute(nextId);
        b3c.execute(nextId);
    }
);

const b1 = boot1(
    root, b2.newInstance, b2.execute, b2.export
);

const b0 = boot0(
    b1.execute, b1.export
);

libcore(b1);

b0.execute(String(fs.readFileSync(path.format(inPath))));
b3c.collect();
