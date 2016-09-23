'use strict';

const typeinfo = require('./typeinfo');
const ast1 = require('./ast.1');
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
        return pass1.visitOut(
            root, root, ast1.code(
                [], [],
                ast
            )
        );
    },

    main: (root, ast) => {
        return pass1.visitOut(
            root, root, ast1.call(
                ast1.code(
                    [], [],
                    ast
                ),
                []
            )
        );
    },
};
