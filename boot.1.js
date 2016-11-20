'use strict';

const typeinfo = require('./type.info');
const ast1 = require('./ast.1');
const pass1 = require('./pass.1');

module.exports = () => {
    const pass = pass1(typeinfo.instance('out'));

    pass.instances[0].id = 0;

    const boot = {
        module: (ast) => {
            // TODO: env info as arguments?
            // TODO: return value as export (module.exports = __return)

            const instance = typeinfo.instance('out'); // a virtual instance 0

            instance.id = 0;

            instance.impl = pass.visitOut(
                pass.instances[0], ast1.call(
                    ast1.code(
                        [], [], '',
                        ast
                    ),
                    []
                )
            );

            return instance;
        },

        namedModule: (name, mode, ast) => {
            const instance = boot.module(ast);

            pass.instances[0].addInit(
                name, mode,
                instance.impl.type
            );

            return instance;
        },
    };

    return boot;
};
