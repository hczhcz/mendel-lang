'use strict';

const pass3 = require('./pass');

module.exports = (write, onSection) => {
    const pass = pass3(write);

    const boot = {
        main: main,
        operations: [],
        onSection: onSection,

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

    pass.write(
        'const func_null = () => {\n'
        + '    throw Error();\n' // TODO
        + '};\n'
        + '\n'
    );

    return boot;
};
