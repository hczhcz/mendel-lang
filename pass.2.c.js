'use strict';

const type2c = require('./type.2.c');

module.exports = () => {
    const pass = {
        codeHead: [],
        codeBody: [],
        id: [], // stack
        bufferHead: [], // stack
        bufferBody: [], // stack

        writeHeadRaw: (line) => {
            pass.bufferHead[pass.bufferHead.length - 1].push(line + '\n');
        },

        writeHead: (line) => {
            pass.writeHeadRaw('    ' + line + ';');
        },

        writeRaw: (line) => {
            pass.bufferBody[pass.bufferBody.length - 1].push(line + '\n');
        },

        write: (line) => {
            pass.writeRaw('    ' + line + ';');
        },

        literalOut: (ast, target) => {
            switch (ast.type.type) {
                case 'boolean': {
                    //

                    break;
                }
                case 'int':
                case 'i8':
                case 'i16':
                case 'i32':
                case 'i64': {
                    pass.write(target(ast.value.toString() + 'll'));

                    break;
                }
                case 'unsigned':
                case 'u8':
                case 'u16':
                case 'u32':
                case 'u64': {
                    pass.write(target(ast.value.toString() + 'ull'));

                    break;
                }
                case 'float':
                case 'f32':
                case 'f64': {
                    pass.write(target(ast.value.toString()));

                    break;
                }
                case 'string': {
                    pass.write(target(JSON.stringify(ast.value)));

                    break;
                }
                default: {
                    throw Error(); // never reach
                }
            }
        },

        reservedOut: (ast, target) => {
            pass.write(target(ast.name));
        },

        reservedIn: (ast, value) => {
            pass.write(ast.name + ' = ' + value);
        },

        pathOut: (ast, target) => {
            pass.visitOut(
                ast.upper,
                (value) => {
                    return '__upper = ' + value;
                }
            );

            pass.write(target('__upper->data.' + ast.name));
        },

        pathIn: (ast, value) => {
            pass.visitOut(
                ast.upper,
                (value) => {
                    return '__upper = ' + value;
                }
            );

            pass.write('__upper->data.' + ast.name + ' = ' + value);
        },

        call: (ast, before, builder, after) => {
            pass.visitOut(
                ast.callee,
                (value) => {
                    return '__upper = ' + value;
                }
            );

            const calleeId = 'func_' + ast.instance.id;
            const structId = 'struct struct_' + ast.instance.id;

            const returnId = pass.id[pass.id.length - 1]
                + '_' + pass.bufferBody[pass.bufferBody.length - 1].length;

            pass.write(
                '__inner = (struct struct_head *)'
                + 'malloc(sizeof(' + structId + '))'
            );
            pass.write('__inner->__func = ' + calleeId);
            pass.write('__inner->data.__parent = __upper');

            pass.write('__inner->__outer = __callee');
            pass.write('__callee = __inner');

            before();

            for (const i in ast.outArgs) {
                pass.visitOut(
                    ast.outArgs[i],
                    (value) => {
                        return '__callee->data.' + i + ' = ' + value;
                    }
                );
            }

            pass.write('__callee->__caller = __self');
            pass.write('__self = __callee');

            // lazy codegen
            if (!pass.codeBody[ast.instance.id]) { // TODO: ?
                pass.build(ast.instance, builder);
            }

            // call
            pass.write('__callee->__caller->__func = ' + returnId);
            pass.write('__callee->__func()');

            pass.writeRaw('}');
            pass.writeRaw('');
            pass.writeRaw('void ' + returnId + '() {');

            pass.write('__callee = __self');
            pass.write('__self = __callee->__caller');

            for (const i in ast.inArgs) {
                pass.visitIn(
                    ast.inArgs[i],
                    '__callee->data.' + i
                );
            }

            after();

            pass.write('__inner = __callee');
            pass.write('__callee = __inner->__outer');
        },

        callOut: (ast, target) => {
            pass.call(
                ast,
                () => {
                    // nothing
                },
                (ast) => {
                    pass.visitOut(
                        ast,
                        (value) => {
                            return '__self->data.__return = ' + value;
                        }
                    );
                },
                () => {
                    pass.write(target('__callee->data.__return'));
                }
            );
        },

        callIn: (ast, value) => {
            pass.call(
                ast,
                () => {
                    pass.write('__callee->data.__return = ' + value);
                },
                (ast) => {
                    pass.visitIn(
                        ast,
                        '__self->data.__return'
                    );
                },
                () => {
                    // nothing
                }
            );
        },

        nativeOut: (ast, target) => {
            if (ast.impls.c) {
                ast.impls.c(pass, target);
            } else {
                throw Error();
            }
        },

        nativeIn: (ast, value) => {
            if (ast.impls.c) {
                ast.impls.c(pass, value);
            } else {
                throw Error();
            }
        },

        visitOut: (ast, target) => {
            pass[ast.__type](
                ast,
                target
            );
        },

        visitIn: (ast, value) => {
            pass[ast.__type](
                ast,
                value
            );
        },

        build: (instance, builder) => {
            const id = 'func_' + instance.id;

            pass.id.push(id);

            pass.bufferHead.push([]);
            pass.bufferBody.push([]);

            pass.writeRaw('void ' + id + '() {');

            builder(instance.impl);

            // return
            pass.write('__self->__func = null');
            pass.write('__self->__caller->__func()');

            pass.writeRaw('}');
            pass.writeRaw('');

            pass.id.pop();

            pass.codeHead[instance.id] = pass.bufferHead.pop().join('');
            pass.codeBody[instance.id] = pass.bufferBody.pop().join('');
        },
    };

    return pass;
};
