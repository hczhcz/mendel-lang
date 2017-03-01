'use strict';

const pass2 = require('./pass');

module.exports = (main, write) => {
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
            + 'const func_null = () => {\n'
            + '    throw Error();\n' // TODO
            + '};\n'
            + '\n'
    );

    const boot = {
        main: main,
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
                'func_0_0();\n'
                    + '\n'
            );
        },
    };

    return boot;
};
