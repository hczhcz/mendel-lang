'use strict';

module.exports = {
    basic: (type1, type2) => {
        return type1.type === type2.type;
    },

    array: (type1, type2) => {
        return module.exports.visit(type1.type, type2.type);
    },

    closure: (type1, type2) => {
        return type1 === type2;
    },

    instance: (type1, type2) => {
        return type1 === type2;
    },

    visit: (type1, type2) => {
        if (type1.__type === type2.__type) {
            return module.exports[type1.__type](
                type1,
                type2
            );
        } else {
            return false;
        }
    },
};
