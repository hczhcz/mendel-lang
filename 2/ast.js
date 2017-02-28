'use strict';

module.exports = {
    value: (value, type) => {
        return {
            __type: 'value',
            value: value,
            type: type,
        };
    },

    reserved: (name) => {
        return {
            __type: 'reserved',
            name: name,
        };
    },

    reserved2: (name, name2) => {
        return {
            __type: 'reserved2',
            name: name,
            name2: name2,
        };
    },

    cast: (source, id) => {
        return {
            __type: 'cast',
            source: source,
            id: id,
        };
    },

    head: (source, value) => {
        return {
            __type: 'head',
            source: source,
            value: value,
        };
    },

    move: (target, value) => {
        return {
            __type: 'move',
            target: target,
            value: value,
        };
    },

    alloc: (upper, id) => {
        return {
            __type: 'alloc',
            upper: upper,
            id: id,
        };
    },

    get: (upper, name) => {
        return {
            __type: 'get',
            upper: upper,
            name: name,
        };
    },

    set: (upper, name, value) => {
        return {
            __type: 'set',
            upper: upper,
            name: name,
            value: value,
        };
    },

    bind: (upper, func) => {
        return {
            __type: 'bind',
            upper: upper,
            func: func,
        };
    },

    invoke: (upper) => {
        return {
            __type: 'invoke',
            upper: upper,
        };
    },
};
