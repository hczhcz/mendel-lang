'use strict';

module.exports = {
    literal: (root, instance, ast) => {
        switch (ast.type) {
            case 'void': {
                return ['undefined'];
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
                return [ast.value.toString()];
            }
            case 'string': {
                return [JSON.stringify(ast.value)];
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
