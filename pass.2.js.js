'use strict';

module.exports = () => {
    const pass = {
        code: [],
        buffer: [],

        writeRaw: (line) => {
            pass.buffer.back().push(line);
        },

        write: (line) => {
            pass.writeRaw('    ' + line + ';\n');
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
                + JSON.stringify(ast.name)
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
                + JSON.stringify(ast.name) + ', ' + value
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

            pass.write('__inner = new Map()');
            pass.write('__inner.__func = ' + calleeId);

            const returnId = calleeId + '_' + pass.buffer.length;

            pass.write('__inner.__outer = __callee');
            pass.write('__callee = __inner');

            before();

            for (const i in ast.outArgs) {
                pass.visitOut(
                    ast.callee,
                    (value) => {
                        return '__callee.set('
                            + JSON.stringify(i) + ', ' + value
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
                    ast.callee,
                    '__callee.get('
                    + JSON.stringify(i)
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

            pass.buffer.push([]);

            pass.writeRaw('const ' + id + ' = () => {');

            builder(instance.impl);

            // return
            pass.write('__self.__func = undefined');
            pass.write('__self.__caller.__func()');

            pass.writeRaw('};');
            pass.writeRaw('');

            pass.code[instance.id] = pass.buffer.pop().join('');
        },
    };

    return pass;
};
