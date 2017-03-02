'use strict';

const fs = require('fs');
const peg = require('pegjs');

const ast0 = require('./ast');

// TODO: import ast.js correctly in the parser
global.ast0 = ast0;

module.exports = (onExecute, onExport) => {
    const pass = peg.generate(
        String(fs.readFileSync('./0/syntax.peg'))
    );

    const boot = {
        onExecute: onExecute,
        onExport: onExport,

        execute: (text) => {
            boot.onExecute(
                ast0.call(
                    ast0.code(
                        ast0.lookup('__self'),
                        [], [], '',
                        pass.parse(text)
                    ),
                    []
                )
            );
        },

        export: (name, mode, text) => {
            boot.onExport(
                name, mode,
                ast0.call(
                    ast0.code(
                        ast0.lookup('__self'),
                        [], [], '',
                        pass.parse(text)
                    ),
                    []
                )
            );
        },
    };

    return boot;
};
