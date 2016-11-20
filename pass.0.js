'use strict';

const parser = require('./mendel.peg.js');

module.exports = (code) => {
    return parser.parse(code);
};
