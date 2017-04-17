'use strict';

module.exports = {
    basic: (type1, type2) => {
        return type1.type === type2.type;
    },

    array: (type1, type2) => {
        return module.exports.visit(type1.type, type2.type);
    },

    object: (type1, type2) => {
        return type1.instance.id !== null
            && type1.instance.id === type2.instance.id;
    },

    closure: (type1, type2) => {
        return type1 === type2; // TODO: use id to compare?
    },

    visit: (type1, type2) => {
        if (type1.__type !== type2.__type) {
            return false;
        }

        return module.exports[type1.__type](
            type1,
            type2
        );
    },
};
