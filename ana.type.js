'use strict';

const coreType = require('./core.type');

module.exports = {
    literalOut: (root, instance, ast) => {
        return ast.type;
    },
    literalIn: (root, instance, ast, type) => {
        throw 1;
    },

    lookup: (root, instance, ast) => {
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
    symbolOut: (root, instance, ast) => {
        return module.exports.lookup(
            root, instance, ast
        );
    },
    symbolIn: (root, instance, ast, type) => {
        if (
            module.exports.lookup(
                root, instance, ast
            ).name !== type.name // TODO: type checking
        ) {
            throw 1;
        }
    },

    pathOut: (root, instance, ast) => {
        return module.exports.visitOut(
            root, instance, ast.source
        ).find(ast.name);
    },
    pathIn: (root, instance, ast, type) => {
        if (
            module.exports.visitOut(
                root, instance, ast.source
            ).find(ast.name).name !== type.name // TODO: type checking
        ) {
            throw 1;
        }
    },

    call: (instance, ast, before, after) => {
        const callee = module.exports.visitOut(
            root, instance, ast.callee
        );
        const closure = module.exports.visitOut(
            root, instance, ast.closure
        );
        // TODO
    },
    callOut: (root, instance, ast) => {
        // TODO
    },
    callIn: (root, instance, ast, type) => {
        // TODO
    },

    codeOut: (root, instance, ast) => {
        return ast;
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
