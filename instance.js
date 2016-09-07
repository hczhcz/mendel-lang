'use strict';

let instanceId = 0;

module.exports = (ast, initModes, initTypes) => {
    const result = {
        __type: 'instance',
        type: 'instance' + instanceId,
        ast: ast,
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
};
