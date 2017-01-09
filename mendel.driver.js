'use strict';

const process = require('process');
const fs = require('fs');

const typeinfo = require('./type.info');
const boot0 = require('./boot.0');
const boot1 = require('./boot.1');
const boot2js = require('./boot.2.js');
const boot2c = require('./boot.2.c');
const libcore = require('./lib.core');

if (process.argv.length < 4) {
    throw Error();
}

const outFile = fs.openSync(process.argv[3], 'w');

const root = typeinfo.instance('out');

const b2js = boot2js(
    root,
    (data) => {
        fs.writeSync(outFile, data);
    }
);
// const b2c = boot2c();
const b1 = boot1(
    root,
    b2js.newInstance, b2js.execute, b2js.export
);
const b0 = boot0();

libcore(b1);

const code0 = String(fs.readFileSync(process.argv[2]));
const code1 = b0.parse(code0);

b1.execute(code1);
b2js.collect();
