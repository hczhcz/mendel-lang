'use strict';

const entity = require('./entity');
const ast2 = require('./ast');

module.exports = (addFunction) => {
    const pass = {
        addFunction: addFunction,

        literalOut: (func, ast, target) => {
            // TODO: check all usages of ast.type, ast.???.type, etc.
            // what if ast.type.__type !== 'basic'?
            target(ast2.value(
                ast.value,
                ast.type.type
            ));
        },

        reservedOut: (func, ast, target) => {
            target(ast2.cast(
                ast2.reserved(ast.name),
                ast.type.id
            ));
        },

        reservedIn: (func, ast, value) => {
            func.add(ast2.move(
                ast2.reserved(ast.name),
                ast2.head(value)
            ));
        },

        pathOut: (func, ast, target) => {
            pass.visitOut(
                func,
                ast.upper,
                (value) => {
                    func.add(ast2.move(
                        ast2.reserved('__upper'),
                        ast2.head(value)
                    ));
                }
            );

            target(ast2.get(
                ast2.cast(
                    ast2.reserved('__upper'),
                    ast.upper.type.id
                ),
                ast.name
            ));
        },

        pathIn: (func, ast, value) => {
            pass.visitOut(
                ast.upper,
                (value) => {
                    func.add(ast2.move(
                        ast2.reserved('__upper'),
                        ast2.head(value)
                    ));
                }
            );

            func.add(ast2.set(
                ast2.cast(
                    ast2.reserved('__upper'),
                    ast.upper.type.id
                ),
                ast.name,
                value
            ));
        },

        call: (func, ast, before, after) => {
            pass.visitOut(
                ast.callee,
                (value) => {
                    func.add(ast2.move(
                        ast2.reserved('__upper'),
                        ast2.head(value)
                    ));
                }
            );

            func.add(ast2.alloc(
                ast2.reserved('__inner'),
                ast.instance.id
            ));
            func.add(ast2.bind(
                ast2.reserved('__inner'),
                'func_' + ast.instance.id
            ));
            func.add(ast2.set(
                ast2.cast(
                    ast2.reserved('__inner'),
                    ast.instance.id
                ),
                '__parent',
                ast2.cast(
                    ast2.reserved('__upper'),
                    ast.callee.type.id
                )
            ));

            before();

            func.add(ast2.move(
                ast2.reserved2(
                    ast2.reserved('__inner'),
                    '__outer'
                ),
                ast2.reserved('__callee')
            ));
            func.add(ast2.move(
                ast2.reserved('__callee'),
                ast2.reserved('__inner')
            ));

            for (const i in ast.outArgs) {
                pass.visitOut(
                    ast.outArgs[i],
                    (value) => {
                        func.add(ast2.set(
                            ast2.cast(
                                ast2.reserved('__callee'),
                                ast.instance.id
                            ),
                            i,
                            value
                        ));
                    }
                );
            }

            func.add(ast2.move(
                ast2.reserved2(
                    ast2.reserved('__callee'),
                    '__caller'
                ),
                ast2.reserved('__self')
            ));
            func.add(ast2.move(
                ast2.reserved('__self'),
                ast2.reserved('__callee')
            ));

            // call
            func.continuation(
                (returnId) => {
                    func.add(ast2.bind(
                        ast2.reserved2(
                            ast2.reserved('__callee'),
                            '__caller'
                        ),
                        'func_' + ast.instance.id + '_' + returnId
                    ));
                    func.add(ast2.invoke(
                        ast2.reserved('__callee')
                    ));
                }
            );

            func.add(ast2.move(
                ast2.reserved('__callee'),
                ast2.reserved('__self')
            ));
            func.add(ast2.move(
                ast2.reserved('__self'),
                ast2.reserved2(
                    ast2.reserved('__callee'),
                    '__caller'
                )
            ));

            for (const i in ast.inArgs) {
                pass.visitIn(
                    ast.inArgs[i],
                    ast2.get(
                        ast2.cast(
                            ast2.reserved('__callee'),
                            ast.instance.id
                        ),
                        i
                    )
                );
            }

            func.add(ast2.move(
                ast2.reserved('__inner'),
                ast2.reserved('__callee')
            ));
            func.add(ast2.move(
                ast2.reserved('__callee'),
                ast2.reserved2(
                    ast2.reserved('__inner'),
                    '__outer'
                )
            ));

            after();
        },

        callOut: (func, ast, target) => {
            pass.call(
                ast,
                () => {
                    // nothing
                },
                () => {
                    target(ast2.get(
                        ast2.cast(
                            ast2.reserved('__inner'),
                            ast.instance.id
                        ),
                        '__return'
                    ));
                }
            );
        },

        callIn: (func, ast, value) => {
            pass.call(
                ast,
                () => {
                    func.add(ast2.set(
                        ast2.cast(
                            ast2.reserved('__inner'),
                            ast.instance.id
                        ),
                        '__return',
                        value
                    ));
                },
                () => {
                    // nothing
                }
            );
        },

        nativeOut: (func, ast, target) => {
            if (ast.impls.js) {
                ast.impls.js(pass, func, target);
            } else {
                throw Error();
            }
        },

        nativeIn: (func, ast, value) => {
            if (ast.impls.js) {
                ast.impls.js(pass, func, value);
            } else {
                throw Error();
            }
        },

        visitOut: (func, ast, target) => {
            pass[ast.__type](
                func, ast,
                target
            );
        },

        visitIn: (func, ast, value) => {
            pass[ast.__type](
                func, ast,
                value
            );
        },

        build: (instance, builder) => {
            const func = entity.func(instance.id);

            builder(func);

            // return
            func.add(ast2.bind(
                ast2.reserved('__self'),
                'func_null' // TODO
            ));
            if (instance.id !== 0) {
                func.add(ast2.invoke(
                    ast2.reserved2(
                        ast2.reserved('__self'),
                        '__caller'
                    )
                ));
            }

            pass.addFunction(func);
        },
    };

    return pass;
};
