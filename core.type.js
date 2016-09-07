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

    instance: (code, initMembers) => {
        const finalMembers = {};

        for (const i in initMembers) {
            finalMembers[i] = initMembers[i];
        }

        ++instanceId;

        return {
            __type: module.exports.builtin('instance'),
            name: 'instance' + instanceId,
            code: code,
            initMembers: initMembers,
            finalMembers: finalMembers,
            add: (name, type) => {
                if (finalMembers[name]) {
                    throw 1;
                }

                finalMembers[name] = type;
            },
            find: (name) => {
                return finalMembers[name];
            },
        };
    },
};
