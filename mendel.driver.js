'use strict';

const process = require('process');
const fs = require('fs');

const boot0 = require('./boot.0');
const boot1 = require('./boot.1');
const boot2js = require('./boot.2.js');
const boot2c = require('./boot.2.c');

if (process.argv.length < 4) {
    throw Error();
}

const b0 = boot0();
const b1 = boot1();
const b2js = boot2js();
const b2c = boot2c();

const code0 = String(fs.readFileSync(process.argv[2]));
const code1 = b0.parse(code0);
const code2 = b1.execModule(code1);
const code3js = b2js.collect(code2, b1.exports);

fs.writeFileSync(process.argv[3], b2js.render() + code3js);
