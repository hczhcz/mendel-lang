'use strict';

const typeinfo = require('./typeinfo');
const ast2 = require('./ast.2');

module.exports = {
    literalOut: (root, instance, ast) => {
        return ast2.literal(ast.type, ast.value);
    },
    literalIn: (root, instance, ast, type) => {
        throw 1;
    },

    symbolOut: (root, instance, ast) => {
        throw 1;
    },
    symbolIn: (root, instance, ast, type) => {
        instance.add(ast.name, ast.mode, type);

        return ast2.pathIn(ast2.self(instance), ast.name);
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

                while (
                    !source.type.modes[ast.name] && (
                        source.type.modes.__parent === 'const'
                        || source.type.modes.__parent === 'var'
                    )
                ) {
                    source = ast2.pathOut(
                        source.type.types.__parent,
                        source,
                        '__parent'
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
        const source = module.exports.lookup(root, instance, ast);

        if (
            source.type.modes[ast.name] === 'const'
            || source.type.modes[ast.name] === 'var'
        ) {
            return ast2.pathOut(
                source.type.types[ast.name],
                source,
                ast.name
            );
        } else {
            throw 1;
        }
    },
    lookupIn: (root, instance, ast, type) => {
        const source = module.exports.lookup(root, instance, ast);

        if (
            (
                source.type.modes[ast.name] === 'out'
                || source.type.modes[ast.name] === 'var'
            ) && source.type.types[ast.name] === type // TODO: type checking
        ) {
            return ast2.pathIn(
                source,
                ast.name
            );
        } else {
            throw 1;
        }
    },

    pathOut: (root, instance, ast) => {
        const source = module.exports.visitOut(root, instance, ast.source);

        if (
            source.type.modes[ast.name] === 'const'
            || source.type.modes[ast.name] === 'var'
        ) {
            return ast2.pathOut(
                source.type.types[ast.name],
                source,
                ast.name
            );
        } else {
            throw 1;
        }
    },
    pathIn: (root, instance, ast, type) => {
        const source = module.exports.visitOut(root, instance, ast.source);

        if (
            (
                source.type.modes.__parent === 'out'
                || source.type.modes.__parent === 'var'
            ) && source.type.types[ast.name] === type // TODO: type checking
        ) {
            return ast2.pathIn(
                source,
                ast.name
            );
        } else {
            throw 1;
        }
    },

    call: (instance, ast, before, after) => {
        // const callee = module.exports.visitOut(
        //     root, instance, ast.callee
        // );
        // const closure = module.exports.visitOut(
        //     root, instance, ast.closure
        // );

        // // const initMembers = {};

        // if (ast.args.length !== callee.params.length) {
        //     throw 1;
        // }

        // for (const i in ast.args) {
        //     //
        // }
    },
    callOut: (root, instance, ast) => {
        // TODO
    },
    callIn: (root, instance, ast, type) => {
        // TODO
    },

    codeOut: (root, instance, ast) => {
        return typeinfo.closure(instance, ast.params, ast.impl);
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
        module.exports[ast.__type + 'In'](
            root, instance, ast, type
        );
    },
};
