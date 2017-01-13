'use strict';

const entity = require('./entity');
const ast2 = require('./ast');
const pass2 = require('./pass');

module.exports = (addFunction) => {
    const pass = pass2(addFunction);

    const boot = {
        main: entity.func(0), // TODO: id?

        newInstance: (instance) => {
            pass.build(instance, (func) => {
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
            });
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
