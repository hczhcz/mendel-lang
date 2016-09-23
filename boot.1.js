'use strict';

const typeinfo = require('./typeinfo');
const ast1 = require('./ast.1');
const pass1 = require('./pass.1');

module.exports = () => {
    const root = typeinfo.instance();

    // TODO: add required root members
    // root.addInit(
    //     '__assign', 'const',
    //     typeinfo.closure(
    //         root, ['l', 'r'], ['out', 'const'],
    //         // ???
    //     )
    // );

    const pass = pass1(root);

    return {
        module: (root, ast) => {
            // TODO: arguments? type checking?

            return pass.visitOut(
                root, root, ast1.call(
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
