'use strict';

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

        return ast2.pathIn(ast2.self(instance.type), ast.name);
    },

    lookup: (root, instance, ast, handler) => {
        let source;
        let sourceAst;

        switch (ast.mode) {
            case 'global': {
                source = root;
                sourceAst = ast2.root(root.type);

                break;
            }
            case 'mixed': {
                source = instance;
                sourceAst = ast2.self(instance.type);

                while (
                    !source.modes[ast.name] && (
                        source.modes.__parent === 'const'
                        || source.modes.__parent === 'var'
                    )
                ) {
                    source = source.types.__parent;
                    sourceAst = ast2.pathOut(
                        source.type,
                        sourceAst,
                        '__parent'
                    );
                }

                break;
            }
            case 'local': {
                source = instance;
                sourceAst = ast2.self(instance.type);

                break;
            }
            default: {
                throw 1; // never reach
            }
        }

        if (!source.modes[ast.name]) {
            throw 1;
        }

        handler(source, sourceAst);
    },
    lookupOut: (root, instance, ast) => {
        let result;

        module.exports.lookup(
            root, instance, ast,
            (source, sourceAst) => {
                if (
                    source.modes.__parent === 'const'
                    || source.modes.__parent === 'var'
                ) {
                    result = ast2.pathOut(
                        source.types[ast.name],
                        sourceAst,
                        ast.name
                    );
                } else {
                    throw 1;
                }
            }
        );

        return result;
    },
    lookupIn: (root, instance, ast, type) => {
        let result;

        module.exports.lookup(
            root, instance, ast,
            (source, sourceAst) => {
                if (
                    (
                        source.modes.__parent === 'out'
                        || source.modes.__parent === 'var'
                    ) && source.types[ast.name] !== type // TODO: type checking
                ) {
                    result = ast2.pathOut(
                        source.types[ast.name],
                        sourceAst,
                        ast.name
                    );
                } else {
                    throw 1;
                }

            }
        );

        return result;
    },

    pathOut: (root, instance, ast) => {
        // return module.exports.visitOut(
        //     root, instance, ast.source
        // ).types[ast.name];
    },
    pathIn: (root, instance, ast, type) => {
        // if (
        //     module.exports.visitOut(
        //         root, instance, ast.source
        //     ).types[ast.name].name !== type.name // TODO: type checking
        // ) {
        //     throw 1;
        // }
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
        // return ast;
    },
    codeIn: (root, instance, ast, type) => {
        // throw 1;
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
