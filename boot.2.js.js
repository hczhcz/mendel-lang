'use strict';

const pass2js = require('./pass.2.js');

module.exports = () => {
    const pass = pass2js();

    return {
        // TODO: init the standard library

        render: () => {
            return '\'use strict\';\n'
                + '\n'
                + 'let __upper = null;\n'
                + 'let __inner = null;\n'
                + 'let __callee = null;\n'
                + 'let __root = new Map();\n'
                + 'let __self = __root;\n'
                + '\n'
                + pass.code.join('');
        },

        module: (instance) => {
            pass.build(instance, (ast) => {
                pass.visitOut(
                    ast,
                    (value) => {
                        return value; // TODO: return value as export
                    }
                );
            });

            const result = pass.code[0] + 'func_0();\n';

            delete pass.code[0];

            return result;
        },
    };
};
