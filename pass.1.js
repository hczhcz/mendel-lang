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
        let source;

        switch (ast.mode) {
            case 'global': {
                source = ast2.root(root);

                break;
            }
            case 'mixed': {
                source = ast2.self(instance);

                while (!source.type.modes[ast.name]) {
                    source = ast2.pathOut(
                        source, '__parent',
                        source.type.accessOut('__parent')
                    );
                }

                break;
            }
            case 'local': {
                source = ast2.self(instance);

                break;
            }
            default: {
                throw 1; // never reach
            }
        }

        if (!source.type.modes[ast.name]) {
            throw 1;
        }

        return source;
    },
    lookupOut: (root, instance, ast) => {
        const source = module.exports.lookup(
            root, instance, ast
        );

        return ast2.pathOut(
            source, ast.name,
            source.type.accessOut(ast.name)
        );
    },
    lookupIn: (root, instance, ast, type) => {
        const source = module.exports.lookup(
            root, instance, ast
        );

        source.type.accessIn(
            ast.name,
            type
        );

        return ast2.pathIn(
            source, ast.name
        );
    },

    pathOut: (root, instance, ast) => {
        const source = module.exports.visitOut(
            root, instance, ast.source
        );

        return ast2.pathOut(
            source, ast.name,
            source.type.accessOut(ast.name)
        );
    },
    pathIn: (root, instance, ast, type) => {
        const source = module.exports.visitOut(
            root, instance, ast.source
        );

        source.type.accessIn(
            ast.name,
            type
        );

        return ast2.pathIn(
            source, ast.name
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
            '__parent', 'var'
        ); // TODO: mode?

        for (const i in closure.paramNames) {
            result.addInit(
                closure.paramNames[i], closure.paramModes[i]
            );
        }

        result.addType(
            '__parent', instance
        );

        before(result);

        for (const i in ast.args) {
            if (
                closure.paramModes[i] === 'const'
                || closure.paramModes[i] === 'var'
            ) {
                const arg = module.exports.visitOut(
                    root, instance, ast.args[i]
                );

                result.addType(
                    closure.paramNames[i],
                    arg.type
                );
            }
        }


        for (const i in ast.args) {
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
            instance, ast.paramNames, ast.paramModes, ast.impl
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
