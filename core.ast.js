'use strict';

const coreType = require('./core.type');

module.exports = {
    literal: (type, value) => {
        return {
            __type: coreType.builtin('literal'),
            type: type,
            value: value,
        };
    },

    symbol: (mode, name) => {
        return {
            __type: coreType.builtin('symbol'),
            mode: mode,
            name: name,
        };
    },

    lookup: (mode, name) => {
        return {
            __type: coreType.builtin('lookup'),
            mode: mode,
            name: name,
        };
    },

    path: (source, name) => {
        return {
            __type: coreType.builtin('path'),
            source: source,
            name: name,
        };
    },

    call: (callee, closure, args) => {
        return {
            __type: coreType.builtin('call'),
            callee: callee,
            closure: closure,
            args: args,
        };
    },

    code: (params, ast) => {
        return {
            __type: coreType.builtin('code'),
            params: params,
            ast: ast,
        };
    },
};
