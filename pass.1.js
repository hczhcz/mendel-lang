'use strict';

const typeinfo = require('./type.info');
const ast2 = require('./ast.2');

module.exports = (root) => {
    const pass = {
        id: 1,
        instances: [root],

        literalOut: (instance, ast) => {
            return ast2.literalOut(
                ast.value,
                typeinfo.basic(ast.type)
            );
        },

        literalIn: (instance, ast, type) => {
            throw Error();
        },

        symbolOut: (instance, ast) => {
            instance.add(
                ast.name, ast.mode
            );

            return ast2.literalOut(
                null,
                typeinfo.basic('null')
            );
        },

        symbolIn: (instance, ast, type) => {
            instance.add(
                ast.name, ast.mode
            );
            instance.addType(
                ast.name,
                type
            );

            return ast2.pathIn(
                ast2.reservedOut(
                    '__self',
                    instance
                ), ast.name
            );
        },

        lookup: (instance, ast, makePath, makeReserved) => {
            switch (ast.name) {
                case '__root':
                case '__self': {
                    return makeReserved(ast.name);
                }
                default: {
                    let upper = ast2.reservedOut(
                        '__self',
                        instance
                    );

                    while (!upper.type.modes[ast.name]) {
                        upper = ast2.pathOut(
                            upper, '__parent',
                            upper.type.accessOut('__parent')
                        );
                    }

                    return makePath(upper);
                }
            }
        },

        lookupOut: (instance, ast) => {
            return pass.lookup(
                instance, ast,
                (upper) => {
                    return ast2.pathOut(
                        upper, ast.name,
                        upper.type.accessOut(ast.name)
                    );
                },
                (name) => {
                    return ast2.reservedOut(
                        name,
                        instance
                    );
                }
            );
        },

        lookupIn: (instance, ast, type) => {
            return pass.lookup(
                instance, ast,
                (upper) => {
                    upper.type.accessIn(
                        ast.name,
                        type
                    );

                    return ast2.pathIn(
                        upper, ast.name
                    );
                },
                (name) => {
                    return ast2.reservedIn(name);
                }
            );
        },

        pathOut: (instance, ast) => {
            const upper = pass.visitOut(
                instance, ast.upper
            );

            return ast2.pathOut(
                upper, ast.name,
                upper.type.accessOut(ast.name)
            );
        },

        pathIn: (instance, ast, type) => {
            const upper = pass.visitOut(
                instance, ast.upper
            );

            upper.type.accessIn(
                ast.name,
                type
            );

            return ast2.pathIn(
                upper, ast.name
            );
        },

        call: (instance, ast, before, builder, after, makeCall) => {
            const callee = pass.visitOut(
                instance, ast.callee
            );
            const closure = callee.type;

            if (closure.__type !== 'closure') {
                throw Error();
            }

            if (ast.args.length < closure.code.paramModes.length) {
                throw Error();
            }

            if (
                closure.code.vaMode === ''
                && ast.args.length > closure.code.paramModes.length
            ) {
                throw Error();
            }

            // notice: .length change only when a new instance is built
            let child = typeinfo.instance(pass.id);

            if (child.id === pass.id) {
                pass.id += 1;
            }

            child.addInit(
                '__root', 'special',
                pass.instances[0]
            );
            child.addInit(
                '__self', 'special',
                child
            );
            child.addInit(
                '__parent', 'var',
                instance
            ); // TODO: mode?

            before(child);

            const outArgs = {};

            for (const i in ast.args) {
                const name = closure.code.paramNames[i]
                    || '__argument_' + i;
                const mode = closure.code.paramModes[i]
                    || closure.code.vaMode;

                if (mode === 'const' || mode === 'var') {
                    outArgs[name] = pass.visitOut(
                        instance, ast.args[i]
                    );

                    child.addInit(
                        name, mode,
                        outArgs[name].type
                    );
                } else {
                    child.add(
                        name, mode
                    );
                }
            }

            child = closure.add(
                child,
                builder
            );

            const inArgs = {};

            for (const i in ast.args) {
                const name = closure.code.paramNames[i]
                    || '__argument_' + i;
                const mode = closure.code.paramModes[i]
                    || closure.code.vaMode;

                if (mode === 'out' || mode === 'var') {
                    inArgs[name] = pass.visitIn(
                        instance, ast.args[i],
                        child.doOut(name)
                    );
                }
            }

            after(child);

            return makeCall(callee, child, outArgs, inArgs);
        },

        callOut: (instance, ast) => {
            let result = null;

            return pass.call(
                instance, ast,
                (child) => {
                    child.add(
                        '__return', 'out'
                    );
                },
                (child, ast) => {
                    pass.instances[child.id] = child;

                    result = pass.visitOut(
                        child, ast
                    );

                    return result;
                },
                (child) => {
                    child.addType(
                        '__return',
                        result.type
                    );
                },
                (callee, child, outArgs, inArgs) => {
                    return ast2.callOut(
                        callee, child,
                        outArgs, inArgs,
                        result.type
                    );
                }
            );
        },

        callIn: (instance, ast, type) => {
            return pass.call(
                instance, ast,
                (child) => {
                    child.addInit(
                        '__return', 'const',
                        type
                    );
                },
                (child, ast) => {
                    pass.instances[child.id] = child;

                    return pass.visitIn(
                        child, ast,
                        type
                    );
                },
                (child) => {
                    // nothing
                },
                (callee, child, outArgs, inArgs) => {
                    return ast2.callIn(
                        callee, child,
                        outArgs, inArgs
                    );
                }
            );
        },

        codeOut: (instance, ast) => {
            return ast2.reservedOut(
                '__self',
                typeinfo.closure(
                    instance, ast
                )
            );
        },

        codeIn: (instance, ast, type) => {
            throw Error();
        },

        nativeOut: (instance, ast) => {
            const type = ast.typing.out(pass, instance);

            return ast2.nativeOut(
                ast.impls,
                type
            );
        },

        nativeIn: (instance, ast, type) => {
            ast.typing.in(pass, instance);

            return ast2.nativeIn(ast.impls);
        },

        visitOut: (instance, ast) => {
            return pass[ast.__type + 'Out'](
                instance, ast
            );
        },

        visitIn: (instance, ast, type) => {
            return pass[ast.__type + 'In'](
                instance, ast,
                type
            );
        },
    };

    return pass;
};
