'use strict';

module.exports = {
    func: (id) => {
        const func = {
            __type: 'func',
            id: id,
            insts: [[]],

            add: (inst) => {
                func.insts[func.insts.length - 1].push(inst);
            },

            continuation: (generator) => {
                generator(func.insts.length);

                func.insts.push([]);
            },
        };

        return func;
    },
};
