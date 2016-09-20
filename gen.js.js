'use strict';

module.exports = (out) => {
    return {
        literal: (root, instance, ast, target) => {
            switch (ast.type) {
                case 'void': {
                    out.line(target('undefined'));
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
                    out.line(target(ast.value.toString()));
                }
                case 'string': {
                    out.line(target(JSON.stringify(ast.value)));
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
            out.line(target('self'));
        },

        root: (root, instance, ast, target) => {
            out.line(target('root'));
        },

        pathOut: (root, instance, ast, target) => {
            module.exports.visit(
                root, instance, ast.upper,
                (value) => {
                    return 'upper = ' + value;
                }
            );

            out.line(target('upper.get(' + JSON.stringify(ast.name) + ')'));
        },

        pathIn: (root, instance, ast, value) => {
            module.exports.visit(
                root, instance, ast.upper,
                (value) => {
                    return 'upper = ' + value;
                }
            );

            out.line('upper.set(' + JSON.stringify(ast.name) + ', ' + value + ')');
        },

        call: (root, instance, ast, target) => {
            module.exports.visit(
                root, instance, ast.callee,
                'callee'
            );

            out.line('inner = new Map()');

            for (const i in ast.outArgs) {
                module.exports.visit(
                    root, instance, ast.callee,
                    (value) => {
                        return 'inner.set(' + JSON.stringify(i) + ', ' + value + ')';
                    }
                );
            }

            // TODO

            for (const i in ast.inArgs) {
                module.exports.visit(
                    root, instance, ast.callee,
                    'inner.get(' + JSON.stringify(i) + ')'
                );
            }
        },

        callOut: (root, instance, ast, target) => {
            call(root, instance, ast, target);
            out.line(target('inner.get(\'__result\')'));
        },

        callIn: (root, instance, ast, value) => {
            out.line('inner.set(\'__input\', ' + value + ')'));
            call(root, instance, ast, target);
        },

        visitOut: (root, instance, ast, target) => {
            // TODO: check ast.__type
            module.exports[ast.__type](root, instance, ast, target);
        },

        visitIn: (root, instance, ast, value) => {
            // TODO: check ast.__type
            module.exports[ast.__type](root, instance, ast, value);
        },

        build: (root, instance) => {
            //
        },
    };
};
