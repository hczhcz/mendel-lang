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

    lookup: (name) => {
        return {
            __type: 'lookup',
            name: name,
        };
    },

    path: (upper, name) => {
        return {
            __type: 'path',
            upper: upper,
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

    code: (paramNames, paramModes, impl1) => {
        return {
            __type: 'code',
            paramNames: paramNames,
            paramModes: paramModes,
            impl1: impl1,
        };
    },
};
