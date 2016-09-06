'use strict';

module.exports = {
    literal: (type, value) => {
        return {
            __type: 'literal',
            type: type,
            value: value,
        };
    },
    symbol: (mode, name) => {
        return {
            __type: 'symbol',
            mode: mode,
            name: name,
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
        // const instance = (code, types) => {
        //     return {
        //         code: code,
        //         _types: types,
        //         find: (name) => {}, // TODO
        //     };
        // };

        return {
            __type: 'code',
            params: params,
            ast: ast,
        };
    },
};
