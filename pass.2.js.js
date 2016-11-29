'use strict';

module.exports = () => {
    const pass = {
        code: [],
        id: [], // stack
        buffer: [], // stack

        writeRaw: (line) => {
            pass.buffer[pass.buffer.length - 1].push(line + '\n');
        },

        write: (line) => {
            pass.writeRaw('    ' + line + ';');
        },

        literalOut: (ast, target) => {
            switch (ast.type.type) {
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
                    pass.write(target(ast.value.toString()));

                    break;
                }
                case 'string': {
                    pass.write(target(JSON.stringify(ast.value)));

                    break;
                }
                case 'i64':
                case 'u64': {
                    throw Error();
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

            pass.write(target(
                '__upper.get('
                + '\'' + ast.name + '\''
                + ')'
            ));
        },

        pathIn: (ast, value) => {
            pass.visitOut(
                ast.upper,
                (value) => {
                    return '__upper = ' + value;
                }
            );

            pass.write(
                '__upper.set('
                + '\'' + ast.name + '\', ' + value
                + ')'
            );
        },

        call: (ast, before, after) => {
            pass.visitOut(
                ast.callee,
                (value) => {
                    return '__upper = ' + value;
                }
            );

            const calleeId = 'func_' + ast.instance.id;

            pass.write('__inner = new Map()');
            pass.write('__inner.__func = ' + calleeId);
            pass.write('__inner.set(\'__parent\', __upper)');

            before();

            pass.write('__inner.__outer = __callee');
            pass.write('__callee = __inner');

            for (const i in ast.outArgs) {
                pass.visitOut(
                    ast.outArgs[i],
                    (value) => {
                        return '__callee.set('
                            + '\'' + i + '\', ' + value
                            + ')';
                    }
                );
            }

            pass.write('__callee.__caller = __self');
            pass.write('__self = __callee');

            // call
            pass.continuation(
                (returnId) => {
                    pass.write('__callee.__caller.__func = ' + returnId);
                    pass.write('__callee.__func()');
                },
                (returnId) => {
                    pass.write('__callee = __self');
                    pass.write('__self = __callee.__caller');
                }
            );

            for (const i in ast.inArgs) {
                pass.visitIn(
                    ast.inArgs[i],
                    '__callee.get('
                    + '\'' + i + '\''
                    + ')'
                );
            }

            pass.write('__inner = __callee');
            pass.write('__callee = __inner.__outer');

            after();
        },

        callOut: (ast, target) => {
            pass.call(
                ast,
                () => {
                    // nothing
                },
                () => {
                    pass.write(target('__inner.get(\'__return\')'));
                }
            );
        },

        callIn: (ast, value) => {
            pass.call(
                ast,
                () => {
                    pass.write('__inner.set(\'__return\', ' + value + ')');
                },
                () => {
                    // nothing
                }
            );
        },

        nativeOut: (ast, target) => {
            if (ast.impls.js) {
                ast.impls.js(pass, target);
            } else {
                throw Error();
            }
        },

        nativeIn: (ast, value) => {
            if (ast.impls.js) {
                ast.impls.js(pass, value);
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
                + '_' + pass.buffer[pass.buffer.length - 1].length;

            before(returnId);

            pass.writeRaw('};');
            pass.writeRaw('');
            pass.writeRaw('const ' + returnId + ' = () => {');

            after(returnId);
        },

        build: (instance, builder) => {
            const funcId = 'func_' + instance.id;

            pass.id.push(funcId);

            pass.buffer.push([]);

            pass.writeRaw('const ' + funcId + ' = () => {');

            builder();

            // return
            pass.write('__self.__func = null');
            if (instance.id !== 0) {
                pass.write('__self.__caller.__func()');
            }

            pass.writeRaw('};');
            pass.writeRaw('');

            pass.id.pop();

            pass.code[instance.id] = pass.buffer.pop().join('');
        },
    };

    return pass;
};
