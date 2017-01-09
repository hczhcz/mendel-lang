'use strict';

const fs = require('fs');
const peg = require('pegjs');

const ast1 = require('./ast.1');

// TODO: import ast.1.js correctly in the parser
global.ast1 = ast1;

module.exports = (onExecute, onExport) => {
    const pass = peg.generate(
        String(fs.readFileSync('./mendel.peg'))
    );

    const boot = {
        onExecute: onExecute,
        onExport: onExport,

        execute: (code) => {
            boot.onExecute(pass.parse(code));
        },

        export: (name, mode, code) => {
            boot.onExport(name, code, pass.parse(code));
        },
    };

    return boot;
};
