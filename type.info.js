'use strict';

const typecheck = require('./type.check');

module.exports = {
    basic: (type) => {
        return {
            __type: 'basic',
            type: type,
        };
    },

    array: (type) => {
        return {
            __type: 'array',
            type: type,
        };
    },

    closure: (parent, code) => {
        const closure = {
            __type: 'closure',
            parent: parent,
            code: code,
            instances: [], // private

            add: (instance, builder) => {
                // find exist instance

                for (const i in closure.instnaces) {
                    if (
                        closure.instances[i].inits.length
                        === instance.inits.length
                    ) {
                        let ok = true;

                        for (const name of closure.instances[i].inits) {
                            if (
                                closure.instances[i].modes[name]
                                !== instance.modes[name]
                                || !typecheck.visit(
                                    closure.instances[i].types[name],
                                    instance.types[name]
                                )
                            ) {
                                ok = false;
                            }
                        }

                        if (ok) {
                            return closure.instances[i];
                        }
                    }
                }

                // new instance

                closure.instances.push(instance);

                builder(instance, closure.code.impl);

                return instance;
            },
        };

        return closure;
    },

    instance: () => {
        const instance = {
            __type: 'instance',
            inits: [],
            modes: {},
            types: {}, // private
            id: null, // int, set by pass 1
            impl: null, // ast2, set by pass 1

            addInit: (name, mode, type) => {
                instance.inits.push(name);
                instance.add(
                    name, mode
                );
                instance.addType(
                    name,
                    type
                );
            },

            add: (name, mode) => {
                if (instance.modes[name]) {
                    throw Error();
                }

                instance.modes[name] = mode;
            },

            addType: (name, type) => {
                if (!instance.modes[name]) {
                    throw Error();
                }

                if (instance.types[name]) {
                    throw Error();
                }

                instance.types[name] = type;
            },

            doOut: (name) => {
                if (!instance.types[name]) {
                    throw Error();
                }

                return instance.types[name];
            },

            accessOut: (name) => {
                if (
                    instance.modes[name] !== 'const'
                    && instance.modes[name] !== 'var'
                ) {
                    throw Error();
                }

                if (!instance.types[name]) {
                    throw Error();
                }

                return instance.types[name];
            },

            accessIn: (name, type) => {
                if (
                    instance.modes[name] !== 'out'
                    && instance.modes[name] !== 'var'
                ) {
                    throw Error();
                }

                if (instance.types[name]) {
                    if (
                        !typecheck.visit(
                            instance.types[name],
                            type
                        )
                    ) {
                        throw Error();
                    }
                } else {
                    instance.types[name] = type;
                }
            },
        };

        return instance;
    },
};
