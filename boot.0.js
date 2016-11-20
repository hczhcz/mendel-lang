'use strict';

const fs = require('fs');
const peg = require('pegjs');

module.exports = () => {
    global.ast1 = require('./ast.1'); // TODO

    const pegStr = String(fs.readFileSync('./mendel.peg'));
    const parser = peg.generate(pegStr);

    return parser;
}
