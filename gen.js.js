'use strict';

module.exports = {
    literal: (root, instance, ast) => {
        //
    },
    symbol: (root, instance, ast) => {
        //
    },
    path: (root, instance, ast) => {
        //
    },
    call: (root, instance, ast) => {
        //
    },
    code: (root, instance, ast) => {
        //
    },

    visit: (root, instance, ast) => {
        module.exports[ast.astType()](root, instance, ast);
    },
};
