'use strict';

module.exports = {
    _builtinMeta: (() => {
        const result = {
            __type: undefined,
            type: 'builtin',
        };

        result.__type = result;

        return result;
    }) (),
    builtin: (type) => {
        return {
            __type: module.exports.builtinMeta,
            type: type,
        };
    },

    instance: (code, types) => {
        return {
            __type: module.exports.builtin('instance'),
            code: code,
            _types: types,
            find: (name) => {}, // TODO
        };
    },
};
