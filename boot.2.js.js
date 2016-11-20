'use strict';

const pass2js = require('./pass.2.js');

module.exports = () => {
    const pass = pass2js();

    return {
        // TODO: init the standard library

        render: () => {
            return pass.code.join('');
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
