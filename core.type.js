'use strict';

const builtinMeta = {
    __type: undefined,
    type: 'builtin',
};
builtinMeta.__type = builtinMeta;

let instanceId = 0;

module.exports = {
    builtin: (name) => {
        return {
            __type: builtinMeta,
            name: name,
        };
    },

    instance: (code, initModes, initTypes) => {
        const result = {
            __type: module.exports.builtin('instance'),
            name: 'instance' + instanceId,
            code: code,
            initModes: initModes,
            initTypes: initTypes,
            modes: {},
            types: {},
            add: (name, mode, type) => {
                if (result.modes[name]) {
                    throw 1;
                }

                result.modes[name] = mode;
                result.types[name] = type;
            },
        };

        ++instanceId;

        for (const i in initModes) {
            result.add(i, initModes[i], initTypes[i]);
        }

        return result;
    },
};
