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

            pass.instances[0].impl = pass.visitOut(
                pass.instances[0], ast1.call(
                    ast1.code(
                        [], [], '',
                        ast
                    ),
                    []
                )
            );

            return pass.instances[0];
        },

        namedModule: (name, mode, ast) => {
            boot.module(ast);

            pass.instances[0].addInit(
                name, mode,
                pass.instances[0].impl.type
            );

            return pass.instances[0];
        },
    };

    return boot;
};
