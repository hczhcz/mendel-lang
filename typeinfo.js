'use strict';

module.exports = {
    closure: (parent, paramNames, paramModes, impl) => {
        return {
            __type: 'closure',
            parent: parent,
            paramNames: paramNames,
            paramModes: paramModes,
            impl: impl,
            instances: {},
            add: (instance) => {
                // TODO
            },
        };
    },

    instance: () => {
        const result = {
            __type: 'instance',
            inits: {},
            modes: {},
            types: {}, // do not access directly
            ast: undefined, // ast for the second pass
            addInit: (name, mode) => {
                if (!result.modes[name]) {
                    result.inits[name] = true;
                    result.modes[name] = mode;
                } else {
                    throw 1;
                }
            },
            add: (name, mode) => {
                if (!result.modes[name]) {
                    result.modes[name] = mode;
                } else {
                    throw 1;
                }
            },
            addType: (name, type) => {
                if (result.modes[name] && !result.types[name]) {
                    result.types[name] = type;
                } else {
                    throw 1;
                }
            },
            accessOut: (name) => {
                if (
                    result.modes[name] === 'const'
                    || result.modes[name] === 'var'
                ) {
                    if (result.types[name]) {
                        return result.types[name];
                    } else {
                        throw 1;
                    }
                } else {
                    throw 1;
                }
            },
            accessIn: (name, type) => {
                if (
                    result.modes[name] === 'out'
                    || result.modes[name] === 'var'
                ) {
                    if (result.types[name]) {
                        // type checking
                        if (!result.types[name] === type) {
                            throw 1;
                        }
                    } else {
                        result.types[name] = type;
                    }
                } else {
                    throw 1;
                }
            },
            makeAst: (ast) => {
                result.ast = ast; // TODO
            },
        };

        return result;
    },
};
