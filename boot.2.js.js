'use strict';

const pass2js = require('./pass.2.js');

module.exports = () => {
    const pass = pass2js();

    return {
        // TODO: init the standard library

        render: () => {
            return pass.code.join('');
        },

        module: (ast) => {
            pass.id.push('func_main');

            pass.buffer.push([]);

            pass.writeRaw('const func_main = () => {');

            pass.visitOut(
                ast,
                (value) => {
                    return value; // TODO: discard?
                }
            );

            pass.writeRaw('};');
            pass.writeRaw('');

            pass.writeRaw('func_main();');

            pass.id.pop();

            return pass.buffer.pop().join('');
        },
    };
};
