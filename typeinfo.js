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

            add: (instance, builder) => {
                // find exist instance

                for (const i in closure.instnaces) {
                    if (
                        closure.instances[i].inits.length
                        === instance.inits.length
                    ) {
                        let ok = true;

                        for (const name of closure.instances[i].inits) {
                            // type checking
                            if (
                                closure.instances[i].modes[name]
                                !== instance.modes[name]
                                || closure.instances[i].types[name]
                                !== instance.types[name]
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

                const impl2 = builder(instance, closure.impl1);

                // type checking
                if (impl2.type !== 'void') {
                    throw 1;
                }

                instance.impl2 = impl2;

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
            impl2: null, // set by closure

            addInit: (name, mode, type) => {
                instance.inits.push(name);
                instance.add(name, mode);
                instance.addType(name, type);
            },

            add: (name, mode) => {
                if (instance.modes[name]) {
                    throw 1;
                }

                instance.modes[name] = mode;
            },

            addType: (name, type) => {
                if (!instance.modes[name]) {
                    throw 1;
                }

                if (instance.types[name]) {
                    throw 1;
                }

                instance.types[name] = type;
            },

            accessOut: (name) => {
                if (
                    instance.modes[name] !== 'const'
                    && instance.modes[name] !== 'var'
                ) {
                    throw 1;
                }

                if (!instance.types[name]) {
                    throw 1;
                }

                return instance.types[name];
            },

            accessIn: (name, type) => {
                if (
                    instance.modes[name] !== 'out'
                    && instance.modes[name] !== 'var'
                ) {
                    throw 1;
                }

                if (instance.types[name]) {
                    // type checking
                    if (instance.types[name] !== type) {
                        throw 1;
                    }
                } else {
                    instance.types[name] = type;
                }
            },
        };

        return instance;
    },
};
