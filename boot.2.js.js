'use strict';

const pass2 = require('./pass.2.js');

module.exports = () => {
    const pass = pass2();

    return {
        // TODO: init the standard library

        render: () => {
            return pass.code.join('');
        },

        module: (ast) => {
            pass.id.push('main');

            pass.buffer.push([]);

            pass.writeRaw('const main = () => {');

            pass.visitOut(
                ast,
                (value) => {
                    return 'void (' + value + ')'; // TODO
                }
            );

            pass.writeRaw('};');
            pass.writeRaw('');

            pass.writeRaw('main();');

            pass.id.pop();

            return pass.buffer.pop().join('');
        },
    };
};
