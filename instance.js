'use strict';

module.exports = (ast, initModes, initTypes) => {
    const result = {
        __type: 'instance',
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

    for (const i in initModes) {
        result.add(i, initModes[i], initTypes[i]);
    }

    return result;
};
