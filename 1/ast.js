'use strict';

module.exports = {
    literalOut: (value, type) => {
        return {
            __type: 'literalOut',
            value: value,
            type: type,
        };
    },

    reservedOut: (name, type) => {
        return {
            __type: 'reservedOut',
            name: name,
            type: type,
        };
    },

    reservedIn: (name, type) => {
        return {
            __type: 'reservedIn',
            name: name,
            type: type,
        };
    },

    pathOut: (upper, name, type) => {
        return {
            __type: 'pathOut',
            upper: upper,
            name: name,
            type: type,
        };
    },

    pathIn: (upper, name, type) => {
        return {
            __type: 'pathIn',
            upper: upper,
            name: name,
            type: type,
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

    callIn: (callee, instance, outArgs, inArgs, type) => {
        return {
            __type: 'callIn',
            callee: callee,
            instance: instance,
            outArgs: outArgs,
            inArgs: inArgs,
            type: type,
        };
    },

    metaOut: (gen, type) => {
        return {
            __type: 'metaOut',
            gen: gen,
            type: type,
        };
    },

    metaIn: (gen, type) => {
        return {
            __type: 'metaIn',
            gen: gen,
            type: type,
        };
    },
};
