'use strict';

const builtinMeta = {
    __type: undefined,
    type: 'builtin',
};
builtinMeta.__type = builtinMeta;

let instanceId = -1;

module.exports = {
    builtin: (name) => {
        return {
            __type: builtinMeta,
            name: name,
        };
    },

    instance: (code, initTypes) => {
        const finalTypes = {};

        for (const i in initTypes) {
            finalTypes[i] = initTypes[i];
        }

        ++instanceId;

        return {
            __type: module.exports.builtin('instance'),
            name: 'instance' + instanceId,
            code: code,
            initTypes: initTypes,
            finalTypes: finalTypes,
            add: (name, type) => {
                if (finalTypes[name]) {
                    throw 1;
                }

                finalTypes[name] = type;
            },
            find: (name) => {
                return finalTypes[name];
            },
        };
    },
};
