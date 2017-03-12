'use strict';

module.exports = {
    instance: (mainMode) => {
        const instance = {
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
                if (instance.id !== null) {
                    throw Error();
                }

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
