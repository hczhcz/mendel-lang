'use strict';

module.exports = {
    closure: (parent, paramNames, paramModes, impl1) => {
        const closure = {
            __type: 'closure',
            parent: parent,
            paramNames: paramNames,
            paramModes: paramModes,
            impl1: impl1, // private
            instances: {},
            add: (instance) => {
                // TODO
            },
        };

        return closure;
    },

    instance: () => {
        const instance = {
            __type: 'instance',
            inits: {},
            modes: {},
            types: {}, // private
            impl2: undefined, // set by closure
            addInit: (name, mode) => {
                if (!instance.modes[name]) {
                    instance.inits[name] = true;
                    instance.modes[name] = mode;
                } else {
                    throw 1;
                }
            },
            add: (name, mode) => {
                if (!instance.modes[name]) {
                    instance.modes[name] = mode;
                } else {
                    throw 1;
                }
            },
            addType: (name, type) => {
                if (instance.modes[name] && !instance.types[name]) {
                    instance.types[name] = type;
                } else {
                    throw 1;
                }
            },
            accessOut: (name) => {
                if (
                    instance.modes[name] === 'const'
                    || instance.modes[name] === 'var'
                ) {
                    if (instance.types[name]) {
                        return instance.types[name];
                    } else {
                        throw 1;
                    }
                } else {
                    throw 1;
                }
            },
            accessIn: (name, type) => {
                if (
                    instance.modes[name] === 'out'
                    || instance.modes[name] === 'var'
                ) {
                    if (instance.types[name]) {
                        // type checking
                        if (!instance.types[name] === type) {
                            throw 1;
                        }
                    } else {
                        instance.types[name] = type;
                    }
                } else {
                    throw 1;
                }
            },
        };

        return instance;
    },
};
