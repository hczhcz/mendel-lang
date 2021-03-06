'use strict';

const type1 = require('./type');
const entity1 = require('./entity');
const ast1 = require('./ast');

module.exports = (root, addInstance) => {
    const pass = {
        root: root,
        id: 1,
        addInstance: addInstance,

        literalOut: (instance, ast) => {
            return ast1.literalOut(
                ast.value,
                type1.basic(ast.type)
            );
        },

        literalIn: (instance, ast, type) => {
            throw Error();
        },

        symbolOut: (instance, ast) => {
            instance.add(
                ast.name, ast.mode
            );

            return ast1.literalOut(
                null,
                type1.basic('null')
            );
        },

        symbolIn: (instance, ast, type) => {
            instance.add(
                ast.name, ast.mode
            );
            instance.doIn(
                ast.name,
                type
            );

            return ast1.pathIn(
                ast1.reservedOut(
                    '__self',
                    type1.object(instance)
                ),
                ast.name,
                type
            );
        },

        lookup: (instance, ast, makePath, makeReserved) => {
            switch (ast.name) {
                case '__root':
                case '__self': {
                    return makeReserved();
                }
                default: {
                    let upper = ast1.reservedOut(
                        '__self',
                        type1.object(instance)
                    );

                    while (!upper.type.instance.modes[ast.name]) {
                        upper = ast1.pathOut(
                            upper, '__parent',
                            upper.type.instance.accessOut('__parent')
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
                    return ast1.pathOut(
                        upper, ast.name,
                        upper.type.instance.accessOut(ast.name)
                    );
                },
                () => {
                    return ast1.reservedOut(
                        ast.name,
                        instance.accessOut(ast.name)
                    );
                }
            );
        },

        lookupIn: (instance, ast, type) => {
            return pass.lookup(
                instance, ast,
                (upper) => {
                    upper.type.instance.accessIn(
                        ast.name,
                        type
                    );

                    return ast1.pathIn(
                        upper, ast.name,
                        type
                    );
                },
                () => {
                    instance.accessIn(
                        ast.name,
                        type
                    );

                    return ast1.reservedIn(
                        ast.name,
                        type
                    );
                }
            );
        },

        pathOut: (instance, ast) => {
            const upper = pass.visitOut(
                instance, ast.upper
            );

            return ast1.pathOut(
                upper, ast.name,
                upper.type.instance.accessOut(ast.name)
            );
        },

        pathIn: (instance, ast, type) => {
            const upper = pass.visitOut(
                instance, ast.upper
            );

            upper.type.instance.accessIn(
                ast.name,
                type
            );

            return ast1.pathIn(
                upper, ast.name,
                type
            );
        },

        call: (instance, ast, mainMode, before, builder, after, makeCall) => {
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

            let child = entity1.instance(mainMode);

            // notice: __root and __self are not actual members
            child.addInit(
                '__root', 'const',
                type1.object(pass.root)
            );
            child.addInit(
                '__self', 'var',
                type1.object(child)
            );
            child.addInit(
                '__parent', 'var',
                type1.object(closure.parent)
            );

            before(child);

            const outArgs = {};

            for (const i in ast.args) {
                const name = closure.code.paramNames[i]
                    || '__argument_' + i;
                let mode = closure.code.paramModes[i]
                    || closure.code.vaMode;

                if (mode === 'dep') {
                    if (child.mainMode === 'out') {
                        mode = 'const';
                    } else {
                        // mainMode === 'const'
                        mode = 'out';
                    }
                } else if (mode === 'ret') {
                    mode = child.mainMode;
                }

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

            let impl = null;

            closure.add(
                child,
                (trueChild, ast) => {
                    child = trueChild;
                    impl = builder(trueChild, ast);
                }
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

            if (impl) { // TODO: dirty fix
                // allocate an instance id
                child.done(pass.id, impl);
                pass.id += 1;

                pass.addInstance(child);
            }

            return makeCall(callee, child, outArgs, inArgs);
        },

        callOut: (instance, ast) => {
            let resultType = null;

            return pass.call(
                instance, ast, 'out',
                (child) => {
                    child.add(
                        '__return', 'out'
                    );
                },
                (child, ast) => {
                    const impl = pass.visitOut(
                        child, ast
                    );

                    resultType = impl.type;

                    return impl;
                },
                (child) => {
                    child.accessIn(
                        '__return',
                        resultType
                    );
                },
                (callee, child, outArgs, inArgs) => {
                    return ast1.callOut(
                        callee, child,
                        outArgs, inArgs,
                        resultType
                    );
                }
            );
        },

        callIn: (instance, ast, type) => {
            return pass.call(
                instance, ast, 'const',
                (child) => {
                    child.addInit(
                        '__return', 'const',
                        type
                    );
                },
                (child, ast) => {
                    return pass.visitIn(
                        child, ast,
                        type
                    );
                },
                (child) => {
                    // nothing
                },
                (callee, child, outArgs, inArgs) => {
                    return ast1.callIn(
                        callee, child,
                        outArgs, inArgs,
                        type
                    );
                }
            );
        },

        codeOut: (instance, ast) => {
            const extend = pass.visitOut(
                instance, ast.extend
            );

            if (extend.type.__type !== 'object') {
                throw Error();
            }

            return ast1.codeOut(
                extend,
                type1.closure(extend.type.instance, ast)
            );
        },

        codeIn: (instance, ast, type) => {
            throw Error();
        },

        metaOut: (instance, ast) => {
            return ast.outGen(pass, instance);
        },

        metaIn: (instance, ast, type) => {
            return ast.inGen(pass, instance, type);
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
