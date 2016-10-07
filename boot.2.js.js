'use strict';

const pass2 = require('./pass.2.js');

module.exports = () => {
    const pass = pass2();

    return {
        // TODO: init the standard library

        // TODO: collect pass.code?

        module: (ast) => {
            pass.buffer.push([]);

            pass.writeRaw('(() => {');

            pass.visitOut(
                ast,
                (value) => {
                    return 'void (' + value + ')'; // TODO
                }
            );

            pass.writeRaw('})();');
            pass.writeRaw('');

            return pass.buffer.pop().join('');
        },
    };
};
