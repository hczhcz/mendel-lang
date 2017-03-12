'use strict';

const type = require('./type');
const pass1 = require('./pass');

module.exports = (addInstance, onExecute, onExport) => {
    const pass = pass1(addInstance);

    const boot = {
        onExecute: onExecute,
        onExport: onExport,

        execute: (ast) => {
            const impl = pass.visitOut(
                pass.root, ast
            );

            boot.onExecute(impl);
        },

        export: (name, mode, ast) => {
            const impl = pass.visitOut(
                pass.root, ast
            );

            pass.root.addInit(
                name, mode,
                impl.type
            );

            boot.onExport(name, impl);
        },
    };

    pass.root.addInit(
        '__root', 'const',
        type.object(pass.root)
    );
    pass.root.addInit(
        '__self', 'var',
        type.object(pass.root)
    );
    pass.root.add(
        '__return', 'out'
    );
    pass.root.id = 0; // notice: done() is never called
    pass.root.accessIn(
        '__return',
        type.basic('null')
    );

    return boot;
};
