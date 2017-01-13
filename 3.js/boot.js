'use strict';

const pass2 = require('./pass');

module.exports = (root, write) => {
    const pass = pass2(write);

    pass.write(
        '\'use strict\';\n'
            + '\n'
            + 'let __upper = null;\n'
            + 'let __inner = null;\n'
            + 'let __callee = null;\n'
            + 'let __root = new Map();\n'
            + 'let __self = __root;\n'
            + '\n'
    );

    const boot = {
        root: root,
        operations: [],

        newFunction: (func) => {
            //
        },

        collect: () => {
            pass.build(root, () => {
                for (const i in boot.operations) {
                    boot.operations[i]();
                }

                boot.operations = [];
            });

            pass.write(
                'func_0();\n'
                    + '\n'
            );
        },
    };

    return boot;
};
