'use strict';

const typeinfo = require('./typeinfo');
const ast2 = require('./ast.2');

module.exports = {
    literalOut: (root, instance, ast) => {
        return ast2.literal(
            ast.value, ast.type
        );
    },
    literalIn: (root, instance, ast, type) => {
        throw 1;
    },

    symbolOut: (root, instance, ast) => {
        instance.add(
            ast.name, ast.mode
        );

        return ast2.literal(
            undefined, 'void'
        );
    },
    symbolIn: (root, instance, ast, type) => {
        instance.add(
            ast.name, ast.mode
        );
        instance.addType(
            ast.name, type
        );

        return ast2.pathIn(
            ast2.self(instance), ast.name
        );
    },

    lookup: (root, instance, ast) => {
        let upper;

        switch (ast.mode) {
            case 'global': {
                upper = ast2.root(root);

                break;
            }
            case 'mixed': {
                upper = ast2.self(instance);

                while (!upper.type.modes[ast.name]) {
                    upper = ast2.pathOut(
                        upper, '__parent',
                        upper.type.accessOut('__parent')
                    );
                }

                break;
            }
            case 'local': {
                upper = ast2.self(instance);

                break;
            }
            default: {
                throw 1; // never reach
            }
        }

        if (!upper.type.modes[ast.name]) {
            throw 1;
        }

        return upper;
    },
    lookupOut: (root, instance, ast) => {
        const upper = module.exports.lookup(
            root, instance, ast
        );

        return ast2.pathOut(
            upper, ast.name,
            upper.type.accessOut(ast.name)
        );
    },
    lookupIn: (root, instance, ast, type) => {
        const upper = module.exports.lookup(
            root, instance, ast
        );

        upper.type.accessIn(
            ast.name,
            type
        );

        return ast2.pathIn(
            upper, ast.name
        );
    },

    pathOut: (root, instance, ast) => {
        const upper = module.exports.visitOut(
            root, instance, ast.upper
        );

        return ast2.pathOut(
            upper, ast.name,
            upper.type.accessOut(ast.name)
        );
    },
    pathIn: (root, instance, ast, type) => {
        const upper = module.exports.visitOut(
            root, instance, ast.upper
        );

        upper.type.accessIn(
            ast.name,
            type
        );

        return ast2.pathIn(
            upper, ast.name
        );
    },

    call: (instance, ast, before, after) => {
        const callee = module.exports.visitOut(
            root, instance, ast.callee
        );
        const closure = callee.type;

        if (
            closure.__type !== 'closure'
            || ast.args.length !== closure.params.length
        ) {
            throw 1;
        }

        let result = typeinfo.instance();

        result.addInit(
            '__parent', 'var',
            instance
        ); // TODO: mode?

        before(result);

        for (const i in closure.paramNames) {
            if (
                closure.paramModes[i] === 'const'
                || closure.paramModes[i] === 'var'
            ) {
                const arg = module.exports.visitOut(
                    root, instance, ast.args[i]
                );

                result.addInit(
                    closure.paramNames[i], closure.paramModes[i],
                    arg.type
                );
            } else {
                result.add(
                    closure.paramNames[i], closure.paramModes[i]
                );
            }
        }

        result = closure.add(root, result, module.exports.visitOut);

        for (const i in closure.paramNames) {
            if (
                closure.paramModes[i] === 'out'
                || closure.paramModes[i] === 'var'
            ) {
                const arg = module.exports.visitIn(
                    root, instance, ast.args[i],
                    result.accessOut(closure.paramNames[i])
                );
            }
        }

        after(result);
    },
    callOut: (root, instance, ast) => {
        // TODO
    },
    callIn: (root, instance, ast, type) => {
        // TODO
    },

    codeOut: (root, instance, ast) => {
        return typeinfo.closure(
            instance, ast.paramNames, ast.paramModes, ast.impl1
        );
    },
    codeIn: (root, instance, ast, type) => {
        throw 1;
    },

    visitOut: (root, instance, ast) => {
        return module.exports[ast.__type + 'Out'](
            root, instance, ast
        );
    },
    visitIn: (root, instance, ast, type) => {
        return module.exports[ast.__type + 'In'](
            root, instance, ast,
            type
        );
    },
};
