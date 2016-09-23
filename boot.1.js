'use strict';

const typeinfo = require('./typeinfo');
const pass1 = require('./pass.1');

module.exports = {
    root: () => {
        const root = typeinfo.instance();

        // TODO: add required root members
        // root.addInit(
        //     '__assign', 'const',
        //     typeinfo.closure(
        //         root, ['l', 'r'], ['out', 'const'],
        //         // ???
        //     )
        // );

        return root;
    },

    module: (root, ast) => {
        return typeinfo.closure(root, [], [], ast);
    },
};
