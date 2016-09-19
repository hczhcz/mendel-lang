'use strict';

module.exports = {
    literal: (root, instance, ast) => {
        switch (ast.type) {
            case 'void': {
                return 'undefined';
            }
            case 'boolean':
            case 'i8':
            case 'i16':
            case 'i32':
            case 'u8':
            case 'u16':
            case 'u32':
            case 'f32':
            case 'f64': {
                return ast.value.toString();
            }
            case 'string': {
                return JSON.stringify(ast.value);
            }
            case 'i64':
            case 'u64': {
                throw 1;
            }
            default: {
                throw 1; // never reach
            }
        }
    },

    self: (root, instance, ast) => {
        return '__self';
    },

    root: (root, instance, ast) => {
        return '__root';
    },

    pathOut: (root, instance, ast) => {
        const upperJs = module.exports.visit(root, instance, ast.upper);

        return upperJs + '.get\(' + JSON.stringify(ast.name) + ')';
    },

    pathIn: (root, instance, ast) => {
        const upperJs = module.exports.visit(root, instance, ast.upper);

        return upperJs + '.get\(' + JSON.stringify(ast.name) + ')';
    },

    callOut: (root, instance, ast) => {
        //
    },

    callIn: (root, instance, ast) => {
        //
    },

    visit: (root, instance, ast) => {
        module.exports[ast.__type](root, instance, ast, target);
    },

    build: (root, instance) => {
        //
    },
};
