'use strict';

module.exports = {
    closure: (parent, paramNames, paramModes, impl) => {
        __type: 'closure',
        parent: parent,
        paramNames: paramNames,
        paramModes: paramModes,
        impl: impl,
        instances: {},
        add: (instance) => {
            // TODO
        },
    },

    instance: () => {
        const result = {
            __type: 'instance',
            modes: {},
            types: {},
            inits: {},
            ast: ast, // ast for the second pass
            init: (name, mode) => {
                result.add(name, mode);
                result.inits[name] = true;
            },
            add: (name, mode) => {
                if (result.modes[name]) {
                    throw 1;
                }

                result.modes[name] = mode;
            },
            typing: (name, type) => {
                if (
                    !result.modes[name]
                    || result.types[name]
                ) {
                    throw 1;
                }

                result.types[name] = type;
            },
        };

        return result;
    },
};
