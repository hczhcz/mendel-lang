'use strict';

module.exports = {
    func: (name) => {
        const func = {
            __type: 'func',
            name: name,
            insts: [[]],

            add: (inst) => {
                func.insts[func.insts.length - 1].push(inst);
            },

            continuation: (generator) => {
                const returnId = func.insts.length;

                generator(returnId);

                func.insts.push([]);
            },
        };

        return func;
    },
};
