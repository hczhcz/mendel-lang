'use strict';

const fs = require('fs');
const peg = require('pegjs');

const ast1 = require('./ast.1');

module.exports = () => {
    global.ast1 = ast1; // TODO

    const pegStr = String(fs.readFileSync('./mendel.peg'));
    const parser = peg.generate(pegStr);

    return parser;
};
