'use strict';

const ast1 = require('./ast.1');

module.exports = {
    literal: ast1.literal,

    self: (type) => {
        return {
            __type: 'self',
            type: type,
        };
    },

    root: (type) => {
        return {
            __type: 'root',
            type: type,
        };
    },

    pathOut: (type, source, name) => {
        return {
            __type: 'pathOut',
            type: type,
            source: source,
            name: name,
        };
    },

    pathIn: (source, name) => {
        return {
            __type: 'pathIn',
            source: source,
            name: name,
        };
    },

    callOut: (type, callee, closure, instance, outArgs, inArgs) => {
        return {
            __type: 'callOut',
            type: type,
            callee: callee,
            closure: closure,
            instance: instance,
            outArgs: outArgs,
            inArgs: inArgs,
        };
    },

    callIn: (callee, closure, instance, outArgs, inArgs) => {
        return {
            __type: 'callIn',
            callee: callee,
            closure: closure,
            instance: instance,
            outArgs: outArgs,
            inArgs: inArgs,
        };
    },
};
