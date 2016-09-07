'use strict';

module.exports = {
    literal: (type, value) => {
        return {
            __type: 'literal',
            type: type,
            value: value,
        };
    },

    symbol: (name, mode) => {
        return {
            __type: 'symbol',
            name: name,
            mode: mode,
        };
    },

    lookup: (name, mode) => {
        return {
            __type: 'lookup',
            name: name,
            mode: mode,
        };
    },

    path: (source, name) => {
        return {
            __type: 'path',
            source: source,
            name: name,
        };
    },

    call: (callee, closure, args) => {
        return {
            __type: 'call',
            callee: callee,
            closure: closure,
            args: args,
        };
    },

    code: (params, ast) => {
        return {
            __type: 'code',
            params: params,
            ast: ast,
        };
    },
};
