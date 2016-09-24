'use strict';

const typeinfo = require('./typeinfo');
const ast1 = require('./ast.1');
const pass1 = require('./pass.1');

module.exports = () => {
    const pass = pass1(typeinfo.instance(0));

    return {
        // namedModule: (name, ast) =>
        // TODO: init the standard library
        // pass.root.addInit(
        //     '__assign', 'const',
        //     typeinfo.closure(
        //         pass.root, ['l', 'r'], ['out', 'const'],
        //         // ???
        //     )
        // );

        module: (ast) => {
            // TODO: arguments? type checking?

            return pass.visitOut(
                pass.root, pass.root, ast1.call(
                    ast1.code(
                        [], [],
                        ast
                    ),
                    []
                )
            );
        },
    };
};
