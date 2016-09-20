'use strict';

module.exports = {
    literal: (root, instance, ast, target) => {
        switch (ast.type) {
            case 'void': {
                return [target + ' = undefined'];
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
                return [target + ' = ' + ast.value.toString()];
            }
            case 'string': {
                return [target + ' = ' + JSON.stringify(ast.value)];
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

    self: (root, instance, ast, target) => {
        return [target + ' = __self'];
    },

    root: (root, instance, ast, target) => {
        return [target + ' = __root'];
    },

    pathOut: (root, instance, ast, target) => {
        const upper = module.exports.visit(root, instance, ast.upper, '__upper');

        upper.push(target + ' = __upper.get(' + JSON.stringify(ast.name) + ')');
    },

    pathIn: (root, instance, ast, target) => {
        const upper = module.exports.visit(root, instance, ast.upper, '__upper');

        upper.push('__upper.set(' + JSON.stringify(ast.name) + ', ' + target + ')');
    },

    callOut: (root, instance, ast, target) => {
        //
    },

    callIn: (root, instance, ast, target) => {
        //
    },

    visit: (root, instance, ast, target) => {
        module.exports[ast.__type](root, instance, ast, target);
    },

    build: (root, instance) => {
        //
    },
};
