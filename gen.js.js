'use strict';

module.exports = require('./util.visiting')({
    literal: (session, instance, ast) => {
        //
    },
    instance: (session, instance, ast) => {
        //
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
        //
    },

    visit: (session, instance, ast) => {
        this[ast.astType()](session, instance, ast);
    },
});
