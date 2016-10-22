'use strict';

const pass2 = require('./pass.2.js');

module.exports = () => {
    const pass = pass2();

    return {
        // TODO: init the standard library

        // TODO: collect pass.code?

        render: () => {
            return pass.code.join('');
        },

        module: (ast) => {
            pass.id.push('__module');

            pass.buffer.push([]);

            pass.writeRaw('const __module = () => {');

            pass.visitOut(
                ast,
                (value) => {
                    return 'void (' + value + ')'; // TODO
                }
            );

            pass.writeRaw('}');
            pass.writeRaw('');

            pass.writeRaw('__module();');

            pass.id.pop();

            return pass.buffer.pop().join('');
        },
    };
};
