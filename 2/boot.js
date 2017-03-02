'use strict';

const entity = require('./entity');
const ast2 = require('./ast');
const pass2 = require('./pass');

module.exports = (addFunction) => {
    const pass = pass2();

    const boot = {
        main: entity.func(0), // TODO: id?
        addFunction: addFunction,

        newInstance: (instance) => {
            const func = entity.func(instance.id);

            // body
            if (instance.mainMode === 'out') {
                pass.visitOut(
                    func,
                    instance.impl,
                    (value) => {
                        func.add(ast2.set(
                            ast2.cast(
                                ast2.reserved('__self'),
                                instance.id
                            ),
                            '__return',
                            value
                        ));
                    }
                );
            } else {
                // mainMode === 'const'
                pass.visitIn(
                    func,
                    instance.impl,
                    ast2.get(
                        ast2.cast(
                            ast2.reserved('__self'),
                            instance.id
                        ),
                        '__return'
                    )
                );
            }

            // return protection
            func.add(ast2.bind(
                ast2.reserved('__self'),
                'func_null' // TODO
            ));

            // return
            func.add(ast2.invoke(
                ast2.reserved2(
                    '__self',
                    '__caller'
                )
            ));

            boot.addFunction(func);
        },

        execute: (ast) => {
            pass.visitOut(
                boot.main,
                ast,
                (value) => {
                    // notice: discard
                }
            );
        },

        export: (name, ast) => {
            pass.visitOut(
                boot.main,
                ast,
                (value) => {
                    boot.main.add(ast2.set(
                        ast2.cast(
                            ast2.reserved('__root'),
                            0 // TODO: root.id?
                        ),
                        name,
                        value
                    ));
                }
            );
        },
    };

    return boot;
};
