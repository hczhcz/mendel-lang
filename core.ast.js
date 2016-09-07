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

    symbol: (name, mode) => {
        return {
            __type: coreType.builtin('symbol'),
            name: name,
            mode: mode,
        };
    },

    lookup: (name, mode) => {
        return {
            __type: coreType.builtin('lookup'),
            name: name,
            mode: mode,
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
