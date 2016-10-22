'use strict';

module.exports = () => {
    const pass = {
        code: [],
        id: [],
        buffer: [],

        writeRaw: (line) => {
            pass.buffer[pass.buffer.length - 1].push(line + '\n');
        },

        write: (line) => {
            pass.writeRaw('    ' + line + ';');
        },

        literal: (ast, target) => {
            switch (ast.type) {
                case 'void': {
                    pass.write(target('null'));

                    break;
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

        call: (ast, before, builder, after) => {
            pass.visitOut(
                ast.callee,
                (value) => {
                    return '__callee = ' + value;
                }
            );

            const calleeId = 'func_' + ast.instance.id;

            const returnId = pass.id[pass.id.length - 1]
                + '_' + pass.buffer[pass.buffer.length - 1].length;

            pass.write('__inner = new Map()');
            pass.write('__inner.__func = ' + calleeId);

            pass.write('__inner.__outer = __callee');
            pass.write('__callee = __inner');

            before();

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

            // lazy codegen
            if (!pass.code[ast.instance.id]) {
                pass.build(ast.instance, builder);
            }

            // call
            pass.write('__self.__func = ' + returnId);
            pass.write('__callee.__func()');

            pass.writeRaw('};');
            pass.writeRaw('');
            pass.writeRaw('const ' + returnId + ' = () => {');

            pass.write('__callee = __self');
            pass.write('__self = __callee.__caller');

            for (const i in ast.inArgs) {
                pass.visitIn(
                    ast.inArgs[i],
                    '__callee.get('
                    + '\'' + i + '\''
                    + ')'
                );
            }

            after();

            pass.write('__inner = __callee');
            pass.write('__callee = __inner.__outer');
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
                            return '__self.set(\'__result\', ' + value + ')';
                        }
                    );
                },
                () => {
                    pass.write(target('__callee.get(\'__result\')'));
                }
            );
        },

        callIn: (ast, value) => {
            pass.call(
                ast,
                () => {
                    pass.write('__callee.set(\'__input\', ' + value + ')');
                },
                (ast) => {
                    pass.visitIn(
                        ast,
                        '__self.get(\'__input\')'
                    );
                },
                () => {
                    // nothing
                }
            );
        },

        nativeOut: (ast, target) => {
            if (ast.impls.js) {
                ast.impls.js.out(pass, target);
            } else {
                throw Error();
            }
        },

        nativeIn: (ast, value) => {
            if (ast.impls.js) {
                ast.impls.js.in(pass, value);
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

            pass.buffer.push([]);

            pass.writeRaw('const ' + id + ' = () => {');

            builder(instance.impl);

            // return
            pass.write('__self.__func = null');
            pass.write('__self.__caller.__func()');

            pass.writeRaw('};');
            pass.writeRaw('');

            pass.id.pop();

            pass.code[instance.id] = pass.buffer.pop().join('');
        },
    };

    return pass;
};
