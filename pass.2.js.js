'use strict';

module.exports = () => {
    const pass = {
        code: [],
        buffer: [],

        write: (line) => {
            pass.buffer.back().push(line + ';\n');
        },

        literal: (root, instance, ast, target) => {
            switch (ast.type) {
                case 'void': {
                    pass.write(target('undefined'));

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
                    throw 1;
                }
                default: {
                    throw 1; // never reach
                }
            }
        },

        self: (root, instance, ast, target) => {
            pass.write(target('self'));
        },

        root: (root, instance, ast, target) => {
            pass.write(target('root'));
        },

        pathOut: (root, instance, ast, target) => {
            pass.visitOut(
                root, instance, ast.upper,
                (value) => {
                    return 'upper = ' + value;
                }
            );

            pass.write(target('upper.get(' + JSON.stringify(ast.name) + ')'));
        },

        pathIn: (root, instance, ast, value) => {
            pass.visitOut(
                root, instance, ast.upper,
                (value) => {
                    return 'upper = ' + value;
                }
            );

            pass.write('upper.set(' + JSON.stringify(ast.name) + ', ' + value + ')');
        },

        call: (root, instance, ast, before, after, builder) => {
            pass.visitOut(
                root, instance, ast.callee,
                (value) => {
                    return 'callee = ' + value;
                }
            );

            const calleeId = pass.build(ast.instance, builder);

            pass.write('inner = new Map()');
            pass.write('inner.set(\'__func\', ' + calleeId + ')');

            const returnId = calleeId + '_' + pass.buffer.length;

            pass.write('inner.set(\'__outer\', callee)');
            pass.write('callee = inner');

            before();

            for (const i in ast.outArgs) {
                pass.visitOut(
                    root, instance, ast.callee,
                    (value) => {
                        return 'callee.set(' + JSON.stringify(i) + ', ' + value + ')';
                    }
                );
            }

            pass.write('callee.set(\'__caller\', self)');
            pass.write('self = callee');

            // call
            pass.write('func = callee.get(\'__func\')');
            pass.write('callee.set(\'__func\', ' + returnId + ')');
            pass.write('func()');

            pass.write('}');
            pass.write('');
            pass.write('const ' + returnId + ' = () => {');

            pass.write('callee = self');
            pass.write('self = callee.get(\'__caller\')');

            for (const i in ast.inArgs) {
                pass.visitIn(
                    root, instance, ast.callee,
                    'callee.get(' + JSON.stringify(i) + ')'
                );
            }

            after();

            pass.write('inner = callee');
            pass.write('callee = inner.get(\'__outer\')');
        },

        callOut: (root, instance, ast, target) => {
            pass.call(
                root, instance, ast,
                () => {
                    // nothing
                },
                () => {
                    pass.write(target('callee.get(\'__result\')'));
                },
                (child, ast) => {
                    pass.visitOut(
                        root, child, ast,
                        (value) => {
                            return 'self.set(\'__result\', ' + value + ')';
                        }
                    );
                }
            );
        },

        callIn: (root, instance, ast, value) => {
            pass.call(
                root, instance, ast,
                () => {
                    pass.write('callee.set(\'__input\', ' + value + ')');
                },
                () => {
                    // nothing
                },
                (child, ast) => {
                    pass.visitIn(
                        root, child, ast,
                        'self.get(\'__input\')'
                    );
                }
            );
        },

        visitOut: (root, instance, ast, target) => {
            // TODO: check ast.__type
            pass[ast.__type](
                root, instance, ast,
                target
            );
        },

        visitIn: (root, instance, ast, value) => {
            // TODO: check ast.__type
            pass[ast.__type](
                root, instance, ast,
                value
            );
        },

        build: (instance, builder) => {
            // TODO: remove duplicated

            const id = 'func_' + pass.code.length;

            pass.buffer.push([]);

            pass.write('const ' + id + ' = () => {');

            builder(instance, instance.impl2);

            pass.write('}');
            pass.write('');

            pass.code.push(pass.buffer.pop());

            return id;
        },
    };

    return pass;
};
