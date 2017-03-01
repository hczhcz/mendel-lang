'use strict';

module.exports = (write) => {
    const pass = {
        write: write,

        value: (ast) => {
            switch (ast.type) {
                case 'bool':
                case 'int':
                case 'i8':
                case 'i16':
                case 'i32':
                case 'unsigned':
                case 'u8':
                case 'u16':
                case 'u32':
                case 'float':
                case 'f32':
                case 'f64': {
                    pass.write(ast.value.toString());

                    break;
                }
                case 'string': {
                    pass.write(JSON.stringify(ast.value));

                    break;
                }
                case 'i64':
                case 'u64': {
                    throw Error(); // not supported
                }
                default: {
                    throw Error(); // never reach
                }
            }
        },

        reserved: (ast) => {
            pass.write(ast.name);
        },

        reserved2: (ast) => {
            pass.write(ast.name + '.' + ast.name2);
        },

        cast: (ast) => {
            pass.visit(ast.source);
        },

        head: (ast) => {
            pass.visit(ast.source);
            pass.write(' = ');
            pass.visit(ast.value);
        },

        move: (ast) => {
            pass.visit(ast.target);
            pass.write(' = ');
            pass.visit(ast.value);
        },

        alloc: (ast) => {
            pass.visit(ast.upper);
            pass.write(' = new Map()');
        },

        get: (ast) => {
            pass.visit(ast.upper);
            pass.write('.get(' + ast.name + ')');
        },

        set: (ast) => {
            pass.visit(ast.upper);
            pass.write('.set(' + ast.name + ', ');
            pass.visit(ast.value);
            pass.write(')');
        },

        bind: (ast) => {
            pass.visit(ast.upper);
            pass.write('.__func = ' + ast.func);
        },

        invoke: (ast) => {
            pass.visit(ast.upper);
            pass.write('.__func()');
        },

        native: (ast) => {
            pass.write(ast.impls.js);
        },

        visit: (ast) => {
            pass[ast.__type](ast);
        },
    };

    return pass;
};
