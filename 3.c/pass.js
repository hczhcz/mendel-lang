'use strict';

const typename = require('./type.name');

module.exports = (writeHead, write) => {
    const pass = {
        writeHead: writeHead,
        write: write,

        value: (ast) => {
            switch (ast.type) {
                case 'bool': {
                    pass.write(ast.value ? 'true' : 'false');

                    break;
                }
                case 'int':
                case 'i8':
                case 'i16':
                case 'i32':
                case 'i64': {
                    pass.write(ast.value.toString() + 'll');

                    break;
                }
                case 'unsigned':
                case 'u8':
                case 'u16':
                case 'u32':
                case 'u64': {
                    pass.write(ast.value.toString() + 'ull');

                    break;
                }
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
                default: {
                    throw Error(); // never reach
                }
            }
        },

        reserved: (ast) => {
            pass.write(ast.name);
        },

        reserved2: (ast) => {
            pass.write(ast.upper + '->' + ast.name);
        },

        cast: (ast) => {
            pass.write('((struct frame_' + ast.id + ' *) ');
            pass.visit(ast.source);
            pass.write(')');
        },

        head: (ast) => {
            pass.visit(ast.source);
            pass.write('->head');
        },

        move: (ast) => {
            pass.visit(ast.target);
            pass.write(' = ');
            pass.visit(ast.value);
        },

        alloc: (ast) => {
            pass.visit(ast.upper);
            pass.write(
                + ' = (struct head *) GC_malloc(sizeof(struct frame_'
                + ast.id
                + '))'
            );
        },

        get: (ast) => {
            pass.visit(ast.upper);
            pass.write('->data.' + ast.name);
        },

        set: (ast) => {
            pass.visit(ast.upper);
            pass.write('->data.' + ast.name + ' = ');
            pass.visit(ast.value);
        },

        bind: (ast) => {
            pass.visit(ast.upper);
            pass.write('->__func = ' + ast.func);
        },

        invoke: (ast) => {
            pass.visit(ast.upper);
            pass.write('->__func()');
        },

        visit: (ast) => {
            pass[ast.__type](ast);
        },
    };

    return pass;
};
