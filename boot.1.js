'use strict';

const typeinfo = require('./type.info');
const ast1 = require('./ast.1');
const pass1 = require('./pass.1');

module.exports = () => {
    const pass = pass1(typeinfo.instance());

    const boot = {
        namedModule: (name, mode, ast) => {
            const code = boot.module(ast);

            pass.instances[0].addInit(
                name, mode,
                code.type
            );

            return code;
        },

        module: (ast) => {
            // TODO: env info as arguments?
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
    };

    return boot;
};
