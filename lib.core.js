'use strict';

const ast0 = require('./0/ast');
const ast1 = require('./1/ast');
const type = require('./1/type');
const typecheck = require('./1/type.check');

module.exports = (boot) => {
    //  __do(...)
    boot.export(
        '__do', 'const', ast0.code(ast0.lookup('__self'),
            [], [], 'const', ast0.meta(
                (pass, instance) => {
                    return ast1.nativeOut(
                        {
                            js: (pass, target) => {
                                // nothing
                            }
                        },
                        type.basic('null')
                    );
                },
                (pass, instance, type) => {
                    throw Error();
                }
            )
        )
    );

    //　__assign('target', 'source')
    boot.export(
        '__assign', 'const', ast0.code(ast0.lookup('__self'),
            ['target', 'source'], ['out', 'const'], '', ast0.meta(
                (pass, instance) => {
                    instance.accessIn(
                        'target',
                        instance.accessOut('source')
                    );

                    return ast1.nativeOut(
                        {
                            js: (pass, target) => {
                                pass.write('__self.set(\'target\', __self.get(\'source\'))');
                            }
                        },
                        type.basic('null')
                    );
                },
                (pass, instance, type) => {
                    throw Error();
                }
            )
        )
    );

    //  write('val')
    boot.export(
        'write', 'const', ast0.code(ast0.lookup('__self'),
            ['val'], ['const'], '', ast0.meta(
                (pass, instance) => {
                    return ast1.nativeOut(
                        {
                            js: (pass, target) => {
                                pass.write('console.log(__self.get(\'val\'))');
                            }
                        },
                        type.basic('null')
                    );
                },
                (pass, instance, type) => {
                    throw Error();
                }
            )
        )
    );

    //  read('val')
    boot.export(
        'read', 'const', ast0.code(ast0.lookup('__self'),
            ['val'], ['var'], '', ast0.meta(
                (pass, instance) => {
                    return ast1.nativeOut(
                        {
                            js: (pass, target) => {
                                pass.continuation(
                                    (returnId) => {
                                        pass.write(
                                        "const readline = require('readline');" +
                                            "const rl = readline.createInterface({" +
                                            "    input: process.stdin," +
                                            "    output: process.stdout" +
                                            "});" +
                                            "rl.question('', (answer) => {" +
                                            "    __self.set(\'val\', answer);" +
                                            "    rl.close();" +
                                            returnId + "();" +
                                                "})");
                                    },
                                    (returnId) => {
                                    }
                                );
                            }
                        },
                        type.basic('null')
                    );
                },
                (pass, instance, type) => {
                    throw Error();
                }
            )
        )
    );

    // __add('val1', 'val2')
    boot.export(
        '__add', 'const', ast0.code(ast0.lookup('__self'),
            ['val1', 'val2'], ['const', 'const'], '', ast0.meta(
                (pass, instance) => {
                    let type1 = instance.accessOut('val1');
                    let type2 = instance.accessOut('val2');
                    if (typecheck.visit(type1, type2) &&
                        typecheck.visit(type1, type.basic('int'))) {
                        return ast1.nativeOut(
                            {
                                js: (pass, target) => {
                                    pass.write(target('__self.get(\'val1\') + __self.get(\'val2\')'));
                                }
                            },
                            type.basic('int')
                        )
                    }
                    else if (typecheck.visit(type1, type2) &&
                             typecheck.visit(type1, type.basic('float'))) {
                        return ast1.nativeOut(
                            {
                                js: (pass, target) => {
                                    pass.write(target('__self.get(\'val1\') + __self.get(\'val2\')'));
                                }
                            },
                            type.basic('float')
                        )
                    }
                    else {
                        throw Error();
                    }
                },
                (pass, instance, type) => {
                    throw Error();
                }
            )
        )
    )

    //__subtract(const val1, const val2)
    boot.export(
        '__subtract', 'const', ast0.code(ast0.lookup('__self'),
            ['val1', 'val2'], ['const', 'const'], '', ast0.meta(
                (pass, instance) => {
                    let type1 = instance.accessOut('val1');
                    let type2 = instance.accessOut('val2');
                    if (typecheck.visit(type1, type2) &&
                        typecheck.visit(type1, type.basic('int'))) {
                        return ast1.nativeOut(
                            {
                                js: (pass, target) => {
                                    pass.write(target('__self.get(\'val1\') - __self.get(\'val2\')'));
                                }
                            },
                            type.basic('int')
                        )
                    }
                    else if (typecheck.visit(type1, type2) &&
                             typecheck.visit(type1, type.basic('float'))) {
                        return ast1.nativeOut(
                            {
                                js: (pass, target) => {
                                    pass.write(target('__self.get(\'val1\') - __self.get(\'val2\')'));
                                }
                            },
                            type.basic('float')
                        )
                    }
                    else {
                        throw Error();
                    }
                },
                (pass, instance, type) => {
                    throw Error();
                }
            )
        )
    )

    //__multiply(const val1, const val2)
    boot.export(
        '__multiply', 'const', ast0.code(ast0.lookup('__self'),
            ['val1', 'val2'], ['const', 'const'], '', ast0.meta(
                (pass, instance) => {
                    let type1 = instance.accessOut('val1');
                    let type2 = instance.accessOut('val2');
                    if (typecheck.visit(type1, type2) &&
                        typecheck.visit(type1, type.basic('int'))) {
                        return ast1.nativeOut(
                            {
                                js: (pass, target) => {
                                    pass.write(target('__self.get(\'val1\') * __self.get(\'val2\')'));
                                }
                            },
                            type.basic('int')
                        )
                    }
                    else if (typecheck.visit(type1, type2) &&
                             typecheck.visit(type1, type.basic('float'))) {
                        return ast1.nativeOut(
                            {
                                js: (pass, target) => {
                                    pass.write(target('__self.get(\'val1\') * __self.get(\'val2\')'));
                                }
                            },
                            type.basic('float')
                        )
                    }
                    else {
                        throw Error();
                    }
                },
                (pass, instance, type) => {
                    throw Error();
                }
            )
        )
    )

    //__divide(const val1, const val2)
    boot.export(
        '__divide', 'const', ast0.code(ast0.lookup('__self'),
            ['val1', 'val2'], ['const', 'const'], '', ast0.meta(
                (pass, instance) => {
                    let type1 = instance.accessOut('val1');
                    let type2 = instance.accessOut('val2');
                    if (typecheck.visit(type1, type2) &&
                        typecheck.visit(type1, type.basic('int'))) {
                        return ast1.nativeOut(
                            {
                                js: (pass, target) => {
                                    pass.write(target('__self.get(\'val1\') / __self.get(\'val2\')'));
                                }
                            },
                            type.basic('int')
                        )
                    }
                    else if (typecheck.visit(type1, type2) &&
                             typecheck.visit(type1, type.basic('float'))) {
                        return ast1.nativeOut(
                            {
                                js: (pass, target) => {
                                    pass.write(target('__self.get(\'val1\') / __self.get(\'val2\')'));
                                }
                            },
                            type.basic('float')
                        )
                    }
                    else {
                        throw Error();
                    }
                },
                (pass, instance, type) => {
                    throw Error();
                }
            )
        )
    )

    // __less('val1', 'val2')
    boot.export(
        '__less', 'const', ast0.code(ast0.lookup('__self'),
            ['val1', 'val2'], ['const', 'const'], '', ast0.meta(
                (pass, instance) => {
                    let type1 = instance.accessOut('val1');
                    let type2 = instance.accessOut('val2');
                    if (typecheck.visit(type1, type2) &&
                        typecheck.visit(type1, type.basic('int'))) {
                        return ast1.nativeOut(
                            {
                                js: (pass, target) => {
                                    pass.write(target('__self.get(\'val1\') < __self.get(\'val2\')'));
                                }
                            },
                            type.basic('bool')
                        )
                    }
                    else if (typecheck.visit(type1, type2) &&
                             typecheck.visit(type1, type.basic('float'))) {
                        return ast1.nativeOut(
                            {
                                js: (pass, target) => {
                                    pass.write(target('__self.get(\'val1\') < __self.get(\'val2\')'));
                                }
                            },
                            type.basic('bool')
                        )
                    }
                    else {
                        throw Error();
                    }
                },
                (pass, instance, type) => {
                    throw Error();
                }
            )
        )
    )

    // __lessEqual('val1', 'val2')
    boot.export(
        '__lessEqual', 'const', ast0.code(ast0.lookup('__self'),
            ['val1', 'val2'], ['const', 'const'], '', ast0.meta(
                (pass, instance) => {
                    let type1 = instance.accessOut('val1');
                    let type2 = instance.accessOut('val2');
                    if (typecheck.visit(type1, type2) &&
                        typecheck.visit(type1, type.basic('int'))) {
                        return ast1.nativeOut(
                            {
                                js: (pass, target) => {
                                    pass.write(target('__self.get(\'val1\') <= __self.get(\'val2\')'));
                                }
                            },
                            type.basic('bool')
                        )
                    }
                    else if (typecheck.visit(type1, type2) &&
                             typecheck.visit(type1, type.basic('float'))) {
                        return ast1.nativeOut(
                            {
                                js: (pass, target) => {
                                    pass.write(target('__self.get(\'val1\') <= __self.get(\'val2\')'));
                                }
                            },
                            type.basic('bool')
                        )
                    }
                    else {
                        throw Error();
                    }
                },
                (pass, instance, type) => {
                    throw Error();
                }
            )
        )
    )

    // __greater('val1', 'val2')
    boot.export(
        '__greater', 'const', ast0.code(ast0.lookup('__self'),
            ['val1', 'val2'], ['const', 'const'], '', ast0.meta(
                (pass, instance) => {
                    let type1 = instance.accessOut('val1');
                    let type2 = instance.accessOut('val2');
                    if (typecheck.visit(type1, type2) &&
                        typecheck.visit(type1, type.basic('int'))) {
                        return ast1.nativeOut(
                            {
                                js: (pass, target) => {
                                    pass.write(target('__self.get(\'val1\') > __self.get(\'val2\')'));
                                }
                            },
                            type.basic('bool')
                        )
                    }
                    else if (typecheck.visit(type1, type2) &&
                             typecheck.visit(type1, type.basic('float'))) {
                        return ast1.nativeOut(
                            {
                                js: (pass, target) => {
                                    pass.write(target('__self.get(\'val1\') > __self.get(\'val2\')'));
                                }
                            },
                            type.basic('bool')
                        )
                    }
                    else {
                        throw Error();
                    }
                },
                (pass, instance, type) => {
                    throw Error();
                }
            )
        )
    )

    // __greaterEqual('val1', 'val2')
    boot.export(
        '__greaterEqual', 'const', ast0.code(ast0.lookup('__self'),
            ['val1', 'val2'], ['const', 'const'], '', ast0.meta(
                (pass, instance) => {
                    let type1 = instance.accessOut('val1');
                    let type2 = instance.accessOut('val2');
                    if (typecheck.visit(type1, type2) &&
                        typecheck.visit(type1, type.basic('int'))) {
                        return ast1.nativeOut(
                            {
                                js: (pass, target) => {
                                    pass.write(target('__self.get(\'val1\') >= __self.get(\'val2\')'));
                                }
                            },
                            type.basic('bool')
                        )
                    }
                    else if (typecheck.visit(type1, type2) &&
                             typecheck.visit(type1, type.basic('float'))) {
                        return ast1.nativeOut(
                            {
                                js: (pass, target) => {
                                    pass.write(target('__self.get(\'val1\') >= __self.get(\'val2\')'));
                                }
                            },
                            type.basic('bool')
                        )
                    }
                    else {
                        throw Error();
                    }
                },
                (pass, instance, type) => {
                    throw Error();
                }
            )
        )
    )

    // __equal('val1', 'val2')
    boot.export(
        '__equal', 'const', ast0.code(ast0.lookup('__self'),
            ['val1', 'val2'], ['const', 'const'], '', ast0.meta(
                (pass, instance) => {
                    let type1 = instance.accessOut('val1');
                    let type2 = instance.accessOut('val2');
                    if (typecheck.visit(type1, type2) &&
                        typecheck.visit(type1, type.basic('int'))) {
                        return ast1.nativeOut(
                            {
                                js: (pass, target) => {
                                    pass.write(target('__self.get(\'val1\') === __self.get(\'val2\')'));
                                }
                            },
                            type.basic('bool')
                        )
                    }
                    else if (typecheck.visit(type1, type2) &&
                             typecheck.visit(type1, type.basic('float'))) {
                        return ast1.nativeOut(
                            {
                                js: (pass, target) => {
                                    pass.write(target('__self.get(\'val1\') === __self.get(\'val2\')'));
                                }
                            },
                            type.basic('bool')
                        )
                    }
                    else {
                        throw Error();
                    }
                },
                (pass, instance, type) => {
                    throw Error();
                }
            )
        )
    )

    // __positive('val')
    boot.export(
        '__positive', 'const', ast0.code(ast0.lookup('__self'),
            ['val'], ['const'], '', ast0.meta(
                (pass, instance) => {
                    return ast1.nativeOut(
                        {
                            js: (pass, target) => {
                                pass.write(target('+__self.get(\'val\')'));
                            }
                        },
                        instance.accessOut('val')
                    )
                },
                (pass, instance, type) => {
                    throw Error();
                }
            )
        )
    )

    // __negative('val')
    boot.export(
        '__negative', 'const', ast0.code(ast0.lookup('__self'),
            ['val'], ['const'], '', ast0.meta(
                (pass, instance) => {
                    return ast1.nativeOut(
                        {
                            js: (pass, target) => {
                                pass.write(target('-__self.get(\'val\')'));
                            }
                        },
                        instance.accessOut('val')
                    )
                },
                (pass, instance, type) => {
                    throw Error();
                }
            )
        )
    )

    // __not('val')
    boot.export(
        '__not', 'const', ast0.code(ast0.lookup('__self'),
            ['val'], ['const'], '', ast0.meta(
                (pass, instance) => {
                    return ast1.nativeOut(
                        {
                            js: (pass, target) => {
                                pass.write(target('!__self.get(\'val\')'));
                            }
                        },
                        instance.accessOut('val')
                    )
                },
                (pass, instance, type) => {
                    throw Error();
                }
            )
        )
    )

    // int('val')
    boot.export(
        'int', 'const', ast0.code(ast0.lookup('__self'),
            ['val'], ['const'], '', ast0.meta(
                (pass, instance) => {
                    return ast1.nativeOut(
                        {
                            js: (pass, target) => {
                                pass.write("let str = __self.get(\'val\').toString()");
                                pass.write(target("parseInt(str.substr(0, (str.indexOf('.') < 0) ? (str.length) : str.indexOf('.') ))"));
                            }
                        },
                        type.basic('int')
                    )
                },
                (pass, instance, type) => {
                    throw Error();
                }
            )
        )
    );

    // __array(...)
    boot.export(
        '__array', 'const', ast0.code(ast0.lookup('__self'),
            [], [], 'const', ast0.meta(
                (pass, instance) => {
                    return ast1.nativeOut(
                        {
                            js: (pass, target) => {
                                var output = "[";
                                for(var i = 0; instance.types['__argument_'+i]; i++) {
                                    output += "__self.get('__argument_" + i + "'),";
                                }
                                output += "]";
                                pass.write(target(output));
                            }
                        },
                        // type.array(type.basic('int'))
                        type.array(instance.accessOut('__argument_0'))
                    )
                },
                (pass, instance, type) => {
                    throw Error();
                }
            )
        )
    )

    // __index('container', 'index')
    boot.export(
        '__index', 'const', ast0.code(ast0.lookup('__self'),
            ['container', 'index'], ['const', 'const'], '', ast0.meta(
                (pass, instance) => {
                    if (instance.accessOut('container').__type === 'array'
                        ) {
                            return ast1.nativeOut(
                                {
                                    js: (pass, target) => {
                                        pass.write(target(
                                            "__self.get('container')"
                                            + "[__self.get('index')]"
                                        ));
                                    }
                                },
                                type.basic('int')
                            )
                    }
                    else {
                        throw Error();
                    }
                },
                (pass, instance, type) => {
                    if (instance.accessOut('container').__type === 'array'
                        && typecheck.visit(instance.accessOut('container').type, type)) {
                            return ast1.nativeIn(
                                {
                                    js: (pass, value) => {
                                        pass.write(
                                            "__self.get('container')"
                                            + "[__self.get('index')] = " + value
                                        );
                                    }
                                },
                                type.basic('null')
                            )
                    }
                    else {
                        throw Error();
                    }
                }
            )
        )
    )

    // __if('cond', 'body')
    boot.export(
        '__if', 'const', ast0.code(ast0.lookup('__self'),
            ['cond', 'body'], ['const', 'const'], '',
            ast0.call(ast0.lookup('__do'), [
                // const c = cond()
                ast0.call(ast0.lookup('__assign'), [
                    ast0.symbol('c', 'const'),
                    ast0.call(ast0.lookup('cond'), [])
                ]),
                ast0.meta(
                    (pass, instance) => {
                        return ast1.nativeOut(
                            {
                                js: (pass, target) => {
                                    pass.writeRaw('    if (!__self.get("c")) {');
                                    pass.writeRaw('        __self.__func = null;');
                                    pass.writeRaw('        __self.__caller.__func();');
                                    pass.writeRaw('        return;')
                                    pass.writeRaw('    }');
                                }
                            }
                        )
                    },
                    (pass, instance, type) => {
                        throw Error();
                    }
                ),
                // body()
                ast0.call(ast0.lookup('body'), []),
            ])
        )
    )

    // exit('val')
    boot.export(
        'exit', 'const', ast0.code(ast0.lookup('__self'),
            ['val'], 'const', '', ast0.meta(
                (pass, instance) => {
                    return ast1.nativeOut(
                        {
                            js: (pass, target) => {
                                pass.write('__self.__caller.__func = null');
                                pass.write('__self.__caller.__caller.__func()');
                            }
                        }
                    )
                },
                (pass, instance, type) => {
                    throw Error();
                }
            )
        )
    )
};
