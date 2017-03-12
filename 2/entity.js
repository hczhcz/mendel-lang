'use strict';

module.exports = {
    func: (instance) => {
        const func = {
            __type: 'func',
            instance: instance,
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
