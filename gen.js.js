'use strict';

module.exports = () => {
    const generator = {
        code: [],
        buffer: [],

        write: (line) => {
            buffer.back().push(line + ';\n');
        },

        literal: (root, instance, ast, target) => {
            switch (ast.type) {
                case 'void': {
                    generator.write(target('undefined'));

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
                    generator.write(target(ast.value.toString()));

                    break;
                }
                case 'string': {
                    generator.write(target(JSON.stringify(ast.value)));

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
            generator.write(target('self'));
        },

        root: (root, instance, ast, target) => {
            generator.write(target('root'));
        },

        pathOut: (root, instance, ast, target) => {
            generator.visit(
                root, instance, ast.upper,
                (value) => {
                    return 'upper = ' + value;
                }
            );

            generator.write(target('upper.get(' + JSON.stringify(ast.name) + ')'));
        },

        pathIn: (root, instance, ast, value) => {
            generator.visit(
                root, instance, ast.upper,
                (value) => {
                    return 'upper = ' + value;
                }
            );

            generator.write('upper.set(' + JSON.stringify(ast.name) + ', ' + value + ')');
        },

        call: (root, instance, ast, before, after) => {
            generator.visit(
                root, instance, ast.callee,
                'callee'
            );

            const calleeId = generator.build(root, ast.instance);
            const returnId = generator.id();

            generator.write('inner = new Map()');
            generator.write('inner.set(\'__func\', ' + calleeId + ')');
            generator.write('inner.set(\'__outer\', callee)');
            generator.write('callee = inner');

            before();

            for (const i in ast.outArgs) {
                generator.visit(
                    root, instance, ast.callee,
                    (value) => {
                        return 'callee.set(' + JSON.stringify(i) + ', ' + value + ')';
                    }
                );
            }

            generator.write('callee.set(\'__caller\', self)');
            generator.write('self = callee');

            // call
            generator.write('func = callee.get(\'__func\')');
            generator.write('callee.set(\'__func\', ' + returnId + ')');
            generator.write('func()');

            generator.write('}');
            generator.write('const ' + returnId + ' = () => {'); // TODO

            generator.write('callee = self');
            generator.write('self = callee.get(\'__caller\')');

            for (const i in ast.inArgs) {
                generator.visit(
                    root, instance, ast.callee,
                    'callee.get(' + JSON.stringify(i) + ')'
                );
            }

            after();

            generator.write('inner = callee');
            generator.write('callee = inner.get(\'__outer\')');
        },

        callOut: (root, instance, ast, target) => {
            generator.call(
                root, instance, ast,
                () => {
                    //
                },
                () => {
                    generator.write(target('callee.get(\'__result\')'));
                }
            );
        },

        callIn: (root, instance, ast, value) => {
            generator.call(
                root, instance, ast,
                () => {
                    generator.write('callee.set(\'__input\', ' + value + ')');
                },
                () => {
                    //
                }
            );
        },

        visitOut: (root, instance, ast, target) => {
            // TODO: check ast.__type
            generator[ast.__type](
                root, instance, ast,
                target
            );
        },

        visitIn: (root, instance, ast, value) => {
            // TODO: check ast.__type
            generator[ast.__type](
                root, instance, ast,
                value
            );
        },

        build: (root, instance) => {
            //
        },
    };

    return generator;
};
