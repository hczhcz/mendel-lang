'use strict';

module.exports = {
    literal: (root, instance, ast) => {
        //
    },

    self: (root, instance, ast) => {
        //
    },

    root: (root, instance, ast) => {
        //
    },

    pathOut: (root, instance, ast) => {
        //
    },

    pathIn: (root, instance, ast) => {
        //
    },

    callOut: (root, instance, ast) => {
        //
    },

    callIn: (root, instance, ast) => {
        //
    },

    visit: (root, instance, ast) => {
        module.exports[ast.__type()](root, instance, ast);
    },
};
