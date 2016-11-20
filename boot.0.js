'use strict';

const fs = require('fs');
const peg = require('pegjs');

module.exports = () => {
    const pegStr = String(fs.readFileSync('./mendel.peg'));
    const parser = peg.generate(pegCode);

    return parser;
}
