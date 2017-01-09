'use strict';

const typeinfo = require('./type.info');
const ast1 = require('./ast.1');
const pass1 = require('./pass.1');

module.exports = (root, onNewInstance, onExecute, onExport) => {
    const pass = pass1(root, onNewInstance);

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

        module: (ast) => {
            // TODO: return value as export (module.exports = __return)

            return pass.visitOut(
                pass.root, ast1.call(
                    ast1.code(
                        ast1.lookup('__self'),
                        [], [], '',
                        ast
                    ),
                    []
                )
            );
        },

        execute: (ast) => {
            const impl = boot.module(ast);

            boot.onExecute(impl);
        },

        export: (name, mode, ast) => {
            const impl = boot.module(ast);

            pass.root.addInit(
                name, mode,
                impl.type
            );

            boot.onExport(name, impl);
        },
    };

    return boot;
};
