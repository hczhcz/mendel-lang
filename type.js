'use strict';

module.exports = {
    literal: (session, instance, ast) => {
        return ast.dataType();
    },
    instance: (session, instance, ast) => {
        return ast;
    },
    root: (session, instance, ast) => {
        //
    },
    path: (session, instance, ast) => {
        //
    },
    call: (session, instance, ast) => {
        //
    },
    code: (session, instance, ast) => {
        return ast;
    },

    visit: (session, instance, ast) => {
        this[ast.astType()](session, instance, ast);
    },
};
