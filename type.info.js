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
            instances: [],

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
                            return;
                        }
                    }
                }

                // new instance

                closure.instances.push(instance);

                builder(instance, closure.code.impl);
            },
        };

        return closure;
    },

    instance: (mainMode) => {
        const instance = {
            __type: 'instance',
            inits: [],
            mainMode: mainMode,
            modes: {},
            types: {}, // edit by member functions
            id: null, // set by instance.done()
            impl: null, // set by instance.done()

            addInit: (name, mode, type) => {
                instance.inits.push(name);
                instance.add(
                    name, mode
                );
                instance.doIn(
                    name,
                    type
                );
            },

            add: (name, mode) => {
                if (instance.modes[name]) {
                    throw Error();
                }

                if (mode === 'dep') {
                    if (instance.mainMode === 'const') {
                        instance.modes[name] = 'out';
                    } else {
                        // mainMode === 'out'
                        instance.modes[name] = 'const';
                    }
                } else if (mode === 'ret') {
                    instance.modes[name] = instance.mainMode;
                } else {
                    instance.modes[name] = mode;
                }
            },

            doOut: (name) => {
                if (!instance.types[name]) {
                    throw Error();
                }

                return instance.types[name];
            },

            doIn: (name, type) => {
                if (!instance.modes[name]) {
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

            accessOut: (name) => {
                if (
                    instance.modes[name] !== 'const'
                    && instance.modes[name] !== 'var'
                ) {
                    throw Error();
                }

                return instance.doOut(name);
            },

            // TODO: assignments happen outside an instance
            //       with new types?
            accessIn: (name, type) => {
                if (
                    instance.modes[name] !== 'out'
                    && instance.modes[name] !== 'var'
                ) {
                    throw Error();
                }

                instance.doIn(name, type);
            },

            done: (id, impl) => {
                for (const i in instance.modes) {
                    if (!instance.types[i]) {
                        throw Error();
                    }
                }

                instance.id = id;
                instance.impl = impl;
            },
        };

        return instance;
    },
};
