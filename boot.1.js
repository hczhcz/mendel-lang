'use strict';

const typeinfo = require('./typeinfo');
const ast1 = require('./ast.1');
const pass1 = require('./pass.1');

module.exports = () => {
    const root = typeinfo.instance(0);

    // TODO: add required root members
    // root.addInit(
    //     '__assign', 'const',
    //     typeinfo.closure(
    //         root, ['l', 'r'], ['out', 'const'],
    //         // ???
    //     )
    // );

    const pass = pass1(root);

    const boot = {
        instances: pass.instances,

        module: (root, ast) => {
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

    return boot;
};
