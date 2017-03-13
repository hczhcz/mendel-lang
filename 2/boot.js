'use strict';

const entity2 = require('./entity');
const ast2 = require('./ast');
const pass2 = require('./pass');

module.exports = (main, addFunction, onExecute) => {
    const pass = pass2();

    const boot = {
        id: 0,
        main: main,
        addFunction: addFunction,
        onExecute: onExecute,

        newInstance: (instance) => {
            const func = entity2.func(instance);

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

        execute: (root, ast) => {
            const main = entity2.func(root);
            root.id = 'main_' + boot.id; // TODO: hack

            boot.id += 1;

            pass.visitOut(
                boot.main,
                ast,
                (value) => {
                    // notice: discard
                }
            );

            boot.onExecute(main);
        },

        export: (root, name, ast) => {
            const main = entity2.func(root);
            root.id = 'main_' + boot.id; // TODO: hack

            boot.id += 1;

            pass.visitOut(
                boot.main,
                ast,
                (value) => {
                    main.add(ast2.set(
                        ast2.cast(
                            ast2.reserved('__root'),
                            0 // TODO: root.id?
                        ),
                        name,
                        value
                    ));
                }
            );

            boot.onExecute(main);
        },
    };

    return boot;
};
