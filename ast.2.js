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

    pathOut: (source, name, type) => {
        return {
            __type: 'pathOut',
            source: source,
            name: name,
            type: type,
        };
    },

    pathIn: (source, name) => {
        return {
            __type: 'pathIn',
            source: source,
            name: name,
        };
    },

    callOut: (callee, instance, outArgs, inArgs, type) => {
        return {
            __type: 'callOut',
            callee: callee,
            instance: instance,
            outArgs: outArgs,
            inArgs: inArgs,
            type: type,
        };
    },

    callIn: (callee, instance, outArgs, inArgs) => {
        return {
            __type: 'callIn',
            callee: callee,
            instance: instance,
            outArgs: outArgs,
            inArgs: inArgs,
        };
    },
};
