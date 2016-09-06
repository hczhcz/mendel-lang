'use strict';

module.exports = {
    literal: (session, instance, ast) => {
        //
    },
    symbol: (session, instance, ast) => {
        //
    },
    path: (session, instance, ast) => {
        //
    },
    call: (session, instance, ast) => {
        //
    },
    code: (session, instance, ast) => {
        //
    },

    visit: (session, instance, ast) => {
        this[ast.astType()](session, instance, ast);
    },
};
