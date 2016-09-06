'use strict';

module.exports = {
    builtin: (type) => {
        return {
            __type: 'builtin',
            type: type,
        };
    },

    instance: (code, types) => {
        return {
            __type: 'instance',
            code: code,
            _types: types,
            find: (name) => {}, // TODO
        };
    },
};
