'use strict';

module.exports = {
    literalIn: (session, instance, ast) => {
        return ast.dataType();
    },
    literalOut: (session, instance, ast, type) => {
        throw 1;
    },

    _symbolLookup: (session, instance, ast) => {
        let result;

        switch (ast.mode()) {
            case 'global':
                result = session.root().find(ast.name());

                break;
            case 'mixed':
                let target = instance;

                while (!result && target) {
                    result = target.find(ast.name());
                    target = target.find('parent');
                }

                break;
            case 'local':
                result = instance.find(ast.name());

                break;
        }

        if (!result) {
            throw 1;
        }

        return result;
    },
    symbolIn: (session, instance, ast) => {
        return this._symbolLookup(
            session, instance, ast
        );
    },
    symbolOut: (session, instance, ast, type) => {
        if (
            this._symbolLookup(
                session, instance, ast
            ) !== type
        ) {
            throw 1;
        }

    },

    pathIn: (session, instance, ast) => {
        return this.visitIn(
            session, instance, ast.source()
        ).find(ast.name());
    },
    pathOut: (session, instance, ast, type) => {
        if (
            this.visitIn(
                session, instance, ast.source()
            ).find(ast.name()) !== type
        ) {
            throw 1;
        }
    },

    callIn: (session, instance, ast) => {
        // TODO
    },
    callOut: (session, instance, ast, type) => {
        // TODO
    },

    codeIn: (session, instance, ast) => {
        return ast;
    },
    codeOut: (session, instance, ast, type) => {
        throw 1;
    },

    visitIn: (session, instance, ast) => {
        return this[ast.astType() + 'In'](
            session, instance, ast
        );
    },
    visitOut: (session, instance, ast, type) => {
        this[ast.astType() + 'Out'](
            session, instance, ast, type
        );
    },
};
