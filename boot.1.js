'use strict';

const typeinfo = require('./type.info');
const ast1 = require('./ast.1');
const pass1 = require('./pass.1');

module.exports = (root, addInstance, onExecute, onExport) => {
    const pass = pass1(root, addInstance);

    pass.root.addInit(
        '__root', 'const',
        pass.root
    );
    pass.root.addInit(
        '__self', 'var',
        pass.root
    );
    pass.root.add(
        '__return', 'out'
    );
    pass.root.id = 0; // notice: done() is never called
    pass.root.accessIn(
        '__return',
        typeinfo.basic('null')
    );

    const boot = {
        onExecute: onExecute,
        onExport: onExport,

        execute: (ast) => {
            const impl = pass.module(ast);

            boot.onExecute(impl);
        },

        export: (name, mode, ast) => {
            const impl = pass.module(ast);

            pass.root.addInit(
                name, mode,
                impl.type
            );

            boot.onExport(name, impl);
        },
    };

    return boot;
};
