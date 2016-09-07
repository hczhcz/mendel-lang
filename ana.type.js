'use strict';

const coreType = require('./core.type');

module.exports = {
    literalIn: (root, instance, ast) => {
        return ast.type;
    },
    literalOut: (root, instance, ast, type) => {
        throw 1;
    },

    symbolLookup: (root, instance, ast) => {
        let result;

        switch (ast.mode) {
        case 'global': {
            result = root.find(ast.name);

            break;
        }
        case 'mixed': {
            let target = instance;

            while (!result && target) {
                result = target.find(ast.name);
                target = target.find('__parent');
            }

            break;
        }
        case 'local': {
            result = instance.find(ast.name);

            break;
        }
        default: {
            throw 1; // never reach
        }
        }

        if (!result) {
            throw 1;
        }

        return result;
    },
    symbolIn: (root, instance, ast) => {
        return module.exports.symbolLookup(
            root, instance, ast
        );
    },
    symbolOut: (root, instance, ast, type) => {
        if (
            module.exports.symbolLookup(
                root, instance, ast
            ).name !== type.name // TODO: type checking
        ) {
            throw 1;
        }
    },

    pathIn: (root, instance, ast) => {
        return module.exports.visitIn(
            root, instance, ast.source
        ).find(ast.name);
    },
    pathOut: (root, instance, ast, type) => {
        if (
            module.exports.visitIn(
                root, instance, ast.source
            ).find(ast.name).name !== type.name // TODO: type checking
        ) {
            throw 1;
        }
    },

    callConstruct: (instance, ast, before, after) => {
        const callee = module.exports.visitIn(
            root, instance, ast.callee
        );
        const closure = module.exports.visitIn(
            root, instance, ast.closure
        );
        // TODO
    },
    callIn: (root, instance, ast) => {
        // TODO
    },
    callOut: (root, instance, ast, type) => {
        // TODO
    },

    codeIn: (root, instance, ast) => {
        return ast;
    },
    codeOut: (root, instance, ast, type) => {
        throw 1;
    },

    visitIn: (root, instance, ast) => {
        return module.exports[ast.__type + 'In'](
            root, instance, ast
        );
    },
    visitOut: (root, instance, ast, type) => {
        module.exports[ast.__type + 'Out'](
            root, instance, ast, type
        );
    },
};
