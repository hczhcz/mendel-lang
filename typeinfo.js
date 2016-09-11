'use strict';

module.exports = {
    closure: (parent, params, impl) => {
        __type: 'closure',
        parent: parent,
        params: params,
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
            initAdd: (name, mode, type) => {
                result.add(name, mode, type);
                result.inits[name] = true;
            },
            add: (name, mode, type) => {
                if (result.modes[name]) {
                    throw 1;
                }

                result.modes[name] = mode;
                result.types[name] = type;
            },
        };

        return result;
    },
};
