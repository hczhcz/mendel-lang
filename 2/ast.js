'use strict';

module.exports = {
    value: (value, type) => {
        return {
            __type: '__value',
            value: value,
            type: type,
        };
    },

    reserved: (name) => {
        return {
            __type: '__reserved',
            name: name,
        };
    },

    reserved2: (upper, name) => {
        return {
            __type: '__reserved2',
            upper: upper,
            name: name,
        };
    },

    cast: (source, id) => {
        return {
            __type: '__cast',
            source: source,
            id: id,
        };
    },

    head: (source) => {
        return {
            __type: '__head',
            source: source,
        };
    },

    move: (target, value) => {
        return {
            __type: '__move',
            target: target,
            value: value,
        };
    },

    alloc: (upper, id) => {
        return {
            __type: '__alloc',
            upper: upper,
            id: id,
        };
    },

    get: (upper, name) => {
        return {
            __type: '__get',
            upper: upper,
            name: name,
        };
    },

    set: (upper, name, value) => {
        return {
            __type: '__set',
            upper: upper,
            name: name,
            value: value,
        };
    },

    func: (upper, func) => {
        return {
            __type: '__func',
            upper: upper,
            func: func,
        };
    },

    invoke: (upper) => {
        return {
            __type: '__invoke',
            upper: upper,
        };
    },
};
