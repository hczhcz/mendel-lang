'use strict';

const coreType = require('./core.type');
const coreAst1 = require('./core.ast1');

module.exports = {
    literal: coreAst1.literal,

    self: (type) => {
        return {
            __type: coreType.builtin('self'),
            type: type,
        };
    },

    root: (type) => {
        return {
            __type: coreType.builtin('root'),
            type: type,
        };
    },

    pathOut: (type, source, name) => {
        return {
            __type: coreType.builtin('pathOut'),
            type: type,
            source: source,
            name: name,
        };
    },

    pathIn: (source, name) => {
        return {
            __type: coreType.builtin('pathIn'),
            source: source,
            name: name,
        };
    },

    callOut: (type, callee, closure, args) => {
        return {
            __type: coreType.builtin('callOut'),
            type: type,
            callee: callee,
            closure: closure,
            args: args,
        };
    },

    callIn: (callee, closure, args) => {
        return {
            __type: coreType.builtin('callIn'),
            callee: callee,
            closure: closure,
            args: args,
        };
    },
};
