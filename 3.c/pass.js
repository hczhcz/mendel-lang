'use strict';

const typename = require('./type.name');

module.exports = (writeHead, writeBody) => {
    const pass = {
        writeHead: writeHead,
        writeBody: writeBody,

        literalOut: (ast, target) => {
            switch (ast.type.type) {
                case 'bool': {
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
            pass.write(target(
                '((' + typename.visit(ast.type)
                + ') ' + ast.name + ')'
            ));
        },

        reservedIn: (ast, value) => {
            pass.write(ast.name + ' = ' + value + '->head');
        },

        pathOut: (ast, target) => {
            pass.visitOut(
                ast.upper,
                (value) => {
                    return '__upper = &' + value + '->head';
                }
            );

            pass.write(target(
                '((' + typename.visit(ast.upper.type)
                + ') __upper)->data.' + ast.name
            ));
        },

        pathIn: (ast, value) => {
            pass.visitOut(
                ast.upper,
                (value) => {
                    return '__upper = &' + value + '->head';
                }
            );

            pass.write(
                '((' + typename.visit(ast.upper.type)
                + ') __upper)->data.' + ast.name + ' = ' + value
            );
        },

        call: (ast, before, after) => {
            pass.visitOut(
                ast.callee,
                (value) => {
                    return '__upper = &' + value + '->head';
                }
            );

            const calleeId = 'func_' + ast.instance.id;
            const frameId = 'struct frame_' + ast.instance.id;

            pass.write(
                '__inner = (struct head *) GC_malloc(sizeof(' + frameId + '))'
            );
            pass.write('__inner->__func = ' + calleeId);
            pass.write(
                '((' + typename.visit(ast.instance)
                + ') __inner)->data.__parent'
                + ' = ((' + typename.visit(ast.callee.type)
                + ') __upper)'
            );

            before();

            pass.write('__inner->__outer = __callee');
            pass.write('__callee = __inner');

            for (const i in ast.outArgs) {
                pass.visitOut(
                    ast.outArgs[i],
                    (value) => {
                        return '((' + typename.visit(ast.instance)
                            + ') __callee)->data.' + i + ' = ' + value;
                    }
                );
            }

            pass.write('__callee->__caller = __self');
            pass.write('__self = __callee');

            // call
            pass.continuation(
                (returnId) => {
                    pass.write('__callee->__caller->__func = ' + returnId);
                    pass.write('__callee->__func()');
                },
                (returnId) => {
                    pass.write('__callee = __self');
                    pass.write('__self = __callee->__caller');
                }
            );

            for (const i in ast.inArgs) {
                pass.visitIn(
                    ast.inArgs[i],
                    '((' + typename.visit(ast.instance)
                    + ') __callee)->data.' + i
                );
            }

            pass.write('__inner = __callee');
            pass.write('__callee = __inner->__outer');

            after();
        },

        callOut: (ast, target) => {
            pass.call(
                ast,
                () => {
                    // nothing
                },
                () => {
                    pass.write(target(
                        '((' + typename.visit(ast.instance)
                        + ') __inner)->data.__return'
                    ));
                }
            );
        },

        callIn: (ast, value) => {
            pass.call(
                ast,
                () => {
                    pass.write(
                        '((' + typename.visit(ast.instance)
                        + ') __inner)->data.__return = ' + value
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

        continuation: (before, after) => {
            const returnId = pass.id[pass.id.length - 1]
                + '_' + pass.bufferBody[pass.bufferBody.length - 1].length;

            before(returnId);

            pass.writeRaw('};');
            pass.writeRaw('');
            pass.writeHeadRaw('static void ' + returnId + '();');
            pass.writeRaw('static void ' + returnId + '() {');

            after(returnId);
        },

        build: (instance, builder) => {
            const funcId = 'func_' + instance.id;
            const frameId = 'struct frame_' + instance.id;
            const dataId = 'struct data_' + instance.id;

            pass.id.push(funcId);

            pass.bufferHead.push([]);
            pass.bufferBody.push([]);

            pass.writeHeadRaw(dataId + ' {');
            for (const i in instance.types) {
                if (i !== '__root' && i !== '__self') {
                    pass.writeHead(typename.visit(instance.types[i]) + ' ' + i);
                }
            }
            pass.writeHeadRaw('};');
            pass.writeHeadRaw('');

            pass.writeHeadRaw(frameId + ' {');
            pass.writeHead('struct head head');
            pass.writeHead(dataId + ' data');
            pass.writeHeadRaw('};');
            pass.writeHeadRaw('');

            pass.writeHeadRaw('static void ' + funcId + '();');
            pass.writeRaw('static void ' + funcId + '() {');

            builder();

            pass.writeHeadRaw('');

            // return
            pass.write('__self->__func = NULL');
            if (instance.id !== 0) {
                pass.write('__self->__caller->__func()');
            }

            pass.writeRaw('}');
            pass.writeRaw('');

            pass.id.pop();
        },
    };

    return pass;
};
