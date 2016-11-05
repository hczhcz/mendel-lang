'use strict';

const typeinfo = require('./type.info');
const ast1 = require('./ast.1');
const pass1 = require('./pass.1');

module.exports = () => {
    const pass = pass1(typeinfo.instance(0));

    const boot = {
        namedModule: (name, mode, ast) => {
            const code = boot.module(ast);

            pass.root.addInit(
                name, mode,
                code.type
            );

            return code;
        },

        module: (ast) => {
            // TODO: env info as arguments?

            return pass.visitOut(
                pass.root, ast1.call(
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
