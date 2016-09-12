'use strict';

module.exports = {
    literal: (value, type) => {
        return {
            __type: 'literal',
            value: value,
            type: type,
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

    call: (callee, args) => {
        return {
            __type: 'call',
            callee: callee,
            args: args,
        };
    },

    code: (params, impl) => {
        return {
            __type: 'code',
            params: params,
            impl: impl,
        };
    },
};
