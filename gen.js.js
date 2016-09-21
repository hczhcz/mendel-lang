'use strict';

module.exports = (line, id) => {
    const generator = {
        line: line,
        id: id,

        literal: (root, instance, ast, target) => {
            switch (ast.type) {
                case 'void': {
                    generator.line(target('undefined'));
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
                    generator.line(target(ast.value.toString()));
                }
                case 'string': {
                    generator.line(target(JSON.stringify(ast.value)));
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
            generator.line(target('self'));
        },

        root: (root, instance, ast, target) => {
            generator.line(target('root'));
        },

        pathOut: (root, instance, ast, target) => {
            generator.visit(
                root, instance, ast.upper,
                (value) => {
                    return 'upper = ' + value;
                }
            );

            generator.line(target('upper.get(' + JSON.stringify(ast.name) + ')'));
        },

        pathIn: (root, instance, ast, value) => {
            generator.visit(
                root, instance, ast.upper,
                (value) => {
                    return 'upper = ' + value;
                }
            );

            generator.line('upper.set(' + JSON.stringify(ast.name) + ', ' + value + ')');
        },

        call: (root, instance, ast, before, after) => {
            generator.visit(
                root, instance, ast.callee,
                'callee'
            );

            const calleeId = generator.build(root, ast.instance);
            const returnId = generator.id();

            generator.line('inner = new Map()');
            generator.line('inner.set(\'__func\', ' + calleeId + ')');
            generator.line('inner.set(\'__outer\', callee)');
            generator.line('callee = inner');

            before();

            for (const i in ast.outArgs) {
                generator.visit(
                    root, instance, ast.callee,
                    (value) => {
                        return 'callee.set(' + JSON.stringify(i) + ', ' + value + ')';
                    }
                );
            }

            generator.line('callee.set(\'__caller\', self)');
            generator.line('self = callee');

            // call
            generator.line('func = callee.get(\'__func\')');
            generator.line('callee.set(\'__func\', ' + returnId + ')');
            generator.line('func()');

            generator.line('}');
            generator.line('const ' + returnId + ' = () => {'); // TODO

            generator.line('callee = self');
            generator.line('self = callee.get(\'__caller\')');

            for (const i in ast.inArgs) {
                generator.visit(
                    root, instance, ast.callee,
                    'callee.get(' + JSON.stringify(i) + ')'
                );
            }

            after();

            generator.line('inner = callee');
            generator.line('callee = inner.get(\'__outer\')');
        },

        callOut: (root, instance, ast, target) => {
            generator.call(
                root, instance, ast,
                () => {
                    //
                },
                () => {
                    generator.line(target('callee.get(\'__result\')'));
                }
            );
        },

        callIn: (root, instance, ast, value) => {
            generator.call(
                root, instance, ast,
                () => {
                    generator.line('callee.set(\'__input\', ' + value + ')'));
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
