'use strict';

const typecheck1 = require('./type.check');

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

    object: (instance) => {
        return {
            __type: 'object',
            instance: instance,
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
                                || !typecheck1.visit(
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
};
