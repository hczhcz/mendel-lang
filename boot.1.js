'use strict';

const typeinfo = require('./type.info');
const ast1 = require('./ast.1');
const pass1 = require('./pass.1');

module.exports = () => {
    const pass = pass1(typeinfo.instance('out'));

    pass.instances[0].add(
        '__return', 'out'
    );
    pass.instances[0].id = 0;
    pass.instances[0].doIn(
        '__return',
        typeinfo.basic('null')
    );

    const boot = {
        exports: [],

        module: (ast) => {
            // TODO: return value as export (module.exports = __return)

            return pass.visitOut(
                pass.instances[0], ast1.call(
                    ast1.code(
                        [], [], '',
                        ast
                    ),
                    []
                )
            );
        },

        execModule: (ast) => {
            const impl = boot.module(ast);

            boot.exports.push({
                name: '',
                impl: impl,
            });

            return pass.instances;
        },

        exportModule: (name, mode, ast) => {
            const impl = boot.module(ast);

            boot.exports.push({
                name: name,
                impl: impl,
            });

            pass.instances[0].addInit(
                name, mode,
                impl.type
            );

            return pass.instances;
        },
    };

    return boot;
};
