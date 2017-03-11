'use strict';

const ast2 = require('./ast');

module.exports = () => {
    const pass = {
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
            func.add(ast2.head(
                ast2.reserved(ast.name),
                value
            ));
        },

        pathOut: (func, ast, target) => {
            pass.visitOut(
                func,
                ast.upper,
                (value) => {
                    func.add(ast2.head(
                        ast2.reserved('__upper'),
                        value
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
                func,
                ast.upper,
                (value) => {
                    func.add(ast2.head(
                        ast2.reserved('__upper'),
                        value
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
                func,
                ast.callee,
                (value) => {
                    func.add(ast2.head(
                        ast2.reserved('__upper'),
                        value
                    ));
                }
            );

            func.add(ast2.alloc(
                ast2.reserved('__inner'),
                ast.instance.id
            ));
            func.add(ast2.bind(
                ast2.reserved('__inner'),
                'func_' + ast.instance.id + '_0'
            ));
            func.add(ast2.set(
                ast2.cast(
                    ast2.reserved('__inner'),
                    ast.instance.id
                ),
                '__parent',
                ast2.cast(
                    ast2.reserved('__upper'),
                    ast.callee.type.parent.id
                )
            ));

            before();

            func.add(ast2.move(
                ast2.reserved2(
                    '__inner',
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
                    func,
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
                    '__callee',
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
                            '__callee',
                            '__caller'
                        ),
                        'func_' + func.id + '_' + returnId
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
                    '__callee',
                    '__caller'
                )
            ));

            for (const i in ast.inArgs) {
                pass.visitIn(
                    func,
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
                    '__inner',
                    '__outer'
                )
            ));

            after();
        },

        callOut: (func, ast, target) => {
            pass.call(
                func,
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
                func,
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

        codeOut: (func, ast, target) => {
            pass.visitOut(
                func, ast.extend,
                target
            );
        },

        metaOut: (func, ast, target) => {
            ast.gen(pass, func, target);
        },

        metaIn: (func, ast, value) => {
            ast.gen(pass, func, value);
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
    };

    return pass;
};
