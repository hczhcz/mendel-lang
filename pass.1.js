'use strict';

const typeinfo = require('./typeinfo');
const ast2 = require('./ast.2');

module.exports = (root) => {
    const pass = {
        root: root,
        instances: [root],

        literalOut: (instance, ast) => {
            return ast2.literal(
                ast.value,
                ast.type
            );
        },

        literalIn: (instance, ast, type) => {
            throw 1;
        },

        symbolOut: (instance, ast) => {
            instance.add(
                ast.name, ast.mode
            );

            return ast2.literal(
                null,
                'void'
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
                ast2.reservedOut('__self', instance),
                ast.name
            );
        },

        lookup: (instance, ast, makePath, makeReserved) => {
            switch (ast.name) {
                case '__root':
                case '__self': {
                    return makeReserved(ast.name);
                }
                default: {
                    let upper = ast2.reservedOut('__self', instance);

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
                    return ast2.reservedOut(name, instance);
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
                        upper,
                        ast.name
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
                upper,
                ast.name
            );
        },

        call: (instance, ast, before, builder, after, makeCall) => {
            const callee = pass.visitOut(
                instance, ast.callee
            );
            const closure = callee.type;

            if (
                closure.__type !== 'closure'
                || ast.args.length !== closure.paramNames.length
            ) {
                throw 1;
            }

            // notice: .length change only when a new instance is built
            let child = typeinfo.instance(pass.instances.length);

            child.addInit(
                '__root', 'special',
                pass.root
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

            for (const i in closure.paramNames) {
                if (
                    closure.paramModes[i] === 'const'
                    || closure.paramModes[i] === 'var'
                ) {
                    outArgs[i] = pass.visitOut(
                        instance, ast.args[i]
                    );

                    child.addInit(
                        closure.paramNames[i], closure.paramModes[i],
                        outArgs[i].type
                    );
                } else {
                    child.add(
                        closure.paramNames[i], closure.paramModes[i]
                    );
                }
            }

            child = closure.add(child, builder);

            const inArgs = {};

            for (const i in closure.paramNames) {
                if (
                    closure.paramModes[i] === 'out'
                    || closure.paramModes[i] === 'var'
                ) {
                    inArgs[i] = pass.visitIn(
                        instance, ast.args[i],
                        child.accessOut(closure.paramNames[i])
                    );
                }
            }

            after(child);

            return makeCall(callee, child, outArgs, inArgs);
        },

        callOut: (instance, ast) => {
            let result;

            return pass.call(
                instance, ast,
                (child) => {
                    child.add(
                        '__result', 'out'
                    );
                },
                (child, ast) => {
                    pass.instances.push(child);

                    result = pass.visitOut(
                        child, ast
                    );

                    return result;
                },
                (child) => {
                    child.addType(
                        '__result',
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
                        '__input', 'const',
                        type
                    );
                },
                (child, ast) => {
                    pass.instances.push(child);

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
            return ast2.reservedOut('__self', typeinfo.closure(
                instance, ast.paramNames, ast.paramModes,
                ast.impl1
            ));
        },

        codeIn: (instance, ast, type) => {
            throw 1;
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
