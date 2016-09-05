'use strict';

module.exports = (obj) => {
    obj.visit = (ast) => {
        obj[ast.astType()](arguments());
    };
};
