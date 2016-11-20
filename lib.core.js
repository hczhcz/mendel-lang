'use strict';

const ast1 = require('./libpepper/ast.1')
const ast2 = require('./libpepper/ast.2')
const typeInfo = require('./libpepper/type.info')
const typeCheck = require('./libpepper/type.check')

module.exports = (boot) => {
    //  __do(...)
    boot.exportModule(
        '__do', 'const', ast1.code(ast1.lookup('__self'),
            [], [], 'const', ast1.meta(
                (pass, instance) => {
                    return ast2.nativeOut(
                        {
                            js: (pass, target) => {
                                // nothing
                            }
                        },
                        typeInfo.basic('null')
                    );
                },
                (pass, instance, type) => {
                    throw Error();
                }
            )
        )
    );

    //　__assign('target', 'source')
    boot.exportModule(
        '__assign', 'const', ast1.code(ast1.lookup('__self'),
            ['target', 'source'], ['out', 'const'], '', ast1.meta(
                (pass, instance) => {
                    instance.accessIn(
                        'target',
                        instance.accessOut('source')
                    );

                    return ast2.nativeOut(
                        {
                            js: (pass, target) => {
                                pass.write('__self.set(\'target\', __self.get(\'source\'))');
                            }
                        },
                        typeInfo.basic('null')
                    );
                },
                (pass, instance, type) => {
                    throw Error();
                }
            )
        )
    );

    //  write('val')
    boot.exportModule(
        'write', 'const', ast1.code(ast1.lookup('__self'),
            ['val'], ['const'], '', ast1.meta(
                (pass, instance) => {
                    return ast2.nativeOut(
                        {
                            js: (pass, target) => {
                                pass.write('console.log(__self.get(\'val\'))');
                            }
                        },
                        typeInfo.basic('null')
                    );
                },
                (pass, instance, type) => {
                    throw Error();
                }
            )
        )
    );

    //  read('val')
    boot.exportModule(
        'read', 'const', ast1.code(ast1.lookup('__self'),
            ['val'], ['var'], '', ast1.meta(
                (pass, instance) => {
                    return ast2.nativeOut(
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
                        typeInfo.basic('null')
                    );
                },
                (pass, instance, type) => {
                    throw Error();
                }
            )
        )
    );

    // __add('val1', 'val2')
    boot.exportModule(
        '__add', 'const', ast1.code(ast1.lookup('__self'),
            ['val1', 'val2'], ['const', 'const'], '', ast1.meta(
                (pass, instance) => {
                    let type1 = instance.accessOut('val1');
                    let type2 = instance.accessOut('val2');
                    if (typeCheck.visit(type1, type2) &&
                        typeCheck.visit(type1, typeInfo.basic('int'))) {
                        return ast2.nativeOut(
                            {
                                js: (pass, target) => {
                                    pass.write(target('__self.get(\'val1\') + __self.get(\'val2\')'));
                                }
                            },
                            typeInfo.basic('int')
                        )
                    }
                    else if (typeCheck.visit(type1, type2) &&
                             typeCheck.visit(type1, typeInfo.basic('float'))) {
                        return ast2.nativeOut(
                            {
                                js: (pass, target) => {
                                    pass.write(target('__self.get(\'val1\') + __self.get(\'val2\')'));
                                }
                            },
                            typeInfo.basic('float')
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
    boot.exportModule(
        '__subtract', 'const', ast1.code(ast1.lookup('__self'),
            ['val1', 'val2'], ['const', 'const'], '', ast1.meta(
                (pass, instance) => {
                    let type1 = instance.accessOut('val1');
                    let type2 = instance.accessOut('val2');
                    if (typeCheck.visit(type1, type2) &&
                        typeCheck.visit(type1, typeInfo.basic('int'))) {
                        return ast2.nativeOut(
                            {
                                js: (pass, target) => {
                                    pass.write(target('__self.get(\'val1\') - __self.get(\'val2\')'));
                                }
                            },
                            typeInfo.basic('int')
                        )
                    }
                    else if (typeCheck.visit(type1, type2) &&
                             typeCheck.visit(type1, typeInfo.basic('float'))) {
                        return ast2.nativeOut(
                            {
                                js: (pass, target) => {
                                    pass.write(target('__self.get(\'val1\') - __self.get(\'val2\')'));
                                }
                            },
                            typeInfo.basic('float')
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
    boot.exportModule(
        '__multiply', 'const', ast1.code(ast1.lookup('__self'),
            ['val1', 'val2'], ['const', 'const'], '', ast1.meta(
                (pass, instance) => {
                    let type1 = instance.accessOut('val1');
                    let type2 = instance.accessOut('val2');
                    if (typeCheck.visit(type1, type2) &&
                        typeCheck.visit(type1, typeInfo.basic('int'))) {
                        return ast2.nativeOut(
                            {
                                js: (pass, target) => {
                                    pass.write(target('__self.get(\'val1\') * __self.get(\'val2\')'));
                                }
                            },
                            typeInfo.basic('int')
                        )
                    }
                    else if (typeCheck.visit(type1, type2) &&
                             typeCheck.visit(type1, typeInfo.basic('float'))) {
                        return ast2.nativeOut(
                            {
                                js: (pass, target) => {
                                    pass.write(target('__self.get(\'val1\') * __self.get(\'val2\')'));
                                }
                            },
                            typeInfo.basic('float')
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
    boot.exportModule(
        '__divide', 'const', ast1.code(ast1.lookup('__self'),
            ['val1', 'val2'], ['const', 'const'], '', ast1.meta(
                (pass, instance) => {
                    let type1 = instance.accessOut('val1');
                    let type2 = instance.accessOut('val2');
                    if (typeCheck.visit(type1, type2) &&
                        typeCheck.visit(type1, typeInfo.basic('int'))) {
                        return ast2.nativeOut(
                            {
                                js: (pass, target) => {
                                    pass.write(target('__self.get(\'val1\') / __self.get(\'val2\')'));
                                }
                            },
                            typeInfo.basic('int')
                        )
                    }
                    else if (typeCheck.visit(type1, type2) &&
                             typeCheck.visit(type1, typeInfo.basic('float'))) {
                        return ast2.nativeOut(
                            {
                                js: (pass, target) => {
                                    pass.write(target('__self.get(\'val1\') / __self.get(\'val2\')'));
                                }
                            },
                            typeInfo.basic('float')
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
    boot.exportModule(
        '__less', 'const', ast1.code(ast1.lookup('__self'),
            ['val1', 'val2'], ['const', 'const'], '', ast1.meta(
                (pass, instance) => {
                    let type1 = instance.accessOut('val1');
                    let type2 = instance.accessOut('val2');
                    if (typeCheck.visit(type1, type2) &&
                        typeCheck.visit(type1, typeInfo.basic('int'))) {
                        return ast2.nativeOut(
                            {
                                js: (pass, target) => {
                                    pass.write(target('__self.get(\'val1\') < __self.get(\'val2\')'));
                                }
                            },
                            typeInfo.basic('boolean')
                        )
                    }
                    else if (typeCheck.visit(type1, type2) &&
                             typeCheck.visit(type1, typeInfo.basic('float'))) {
                        return ast2.nativeOut(
                            {
                                js: (pass, target) => {
                                    pass.write(target('__self.get(\'val1\') < __self.get(\'val2\')'));
                                }
                            },
                            typeInfo.basic('boolean')
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
    boot.exportModule(
        '__lessEqual', 'const', ast1.code(ast1.lookup('__self'),
            ['val1', 'val2'], ['const', 'const'], '', ast1.meta(
                (pass, instance) => {
                    let type1 = instance.accessOut('val1');
                    let type2 = instance.accessOut('val2');
                    if (typeCheck.visit(type1, type2) &&
                        typeCheck.visit(type1, typeInfo.basic('int'))) {
                        return ast2.nativeOut(
                            {
                                js: (pass, target) => {
                                    pass.write(target('__self.get(\'val1\') <= __self.get(\'val2\')'));
                                }
                            },
                            typeInfo.basic('boolean')
                        )
                    }
                    else if (typeCheck.visit(type1, type2) &&
                             typeCheck.visit(type1, typeInfo.basic('float'))) {
                        return ast2.nativeOut(
                            {
                                js: (pass, target) => {
                                    pass.write(target('__self.get(\'val1\') <= __self.get(\'val2\')'));
                                }
                            },
                            typeInfo.basic('boolean')
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
    boot.exportModule(
        '__greater', 'const', ast1.code(ast1.lookup('__self'),
            ['val1', 'val2'], ['const', 'const'], '', ast1.meta(
                (pass, instance) => {
                    let type1 = instance.accessOut('val1');
                    let type2 = instance.accessOut('val2');
                    if (typeCheck.visit(type1, type2) &&
                        typeCheck.visit(type1, typeInfo.basic('int'))) {
                        return ast2.nativeOut(
                            {
                                js: (pass, target) => {
                                    pass.write(target('__self.get(\'val1\') > __self.get(\'val2\')'));
                                }
                            },
                            typeInfo.basic('boolean')
                        )
                    }
                    else if (typeCheck.visit(type1, type2) &&
                             typeCheck.visit(type1, typeInfo.basic('float'))) {
                        return ast2.nativeOut(
                            {
                                js: (pass, target) => {
                                    pass.write(target('__self.get(\'val1\') > __self.get(\'val2\')'));
                                }
                            },
                            typeInfo.basic('boolean')
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
    boot.exportModule(
        '__greaterEqual', 'const', ast1.code(ast1.lookup('__self'),
            ['val1', 'val2'], ['const', 'const'], '', ast1.meta(
                (pass, instance) => {
                    let type1 = instance.accessOut('val1');
                    let type2 = instance.accessOut('val2');
                    if (typeCheck.visit(type1, type2) &&
                        typeCheck.visit(type1, typeInfo.basic('int'))) {
                        return ast2.nativeOut(
                            {
                                js: (pass, target) => {
                                    pass.write(target('__self.get(\'val1\') >= __self.get(\'val2\')'));
                                }
                            },
                            typeInfo.basic('boolean')
                        )
                    }
                    else if (typeCheck.visit(type1, type2) &&
                             typeCheck.visit(type1, typeInfo.basic('float'))) {
                        return ast2.nativeOut(
                            {
                                js: (pass, target) => {
                                    pass.write(target('__self.get(\'val1\') >= __self.get(\'val2\')'));
                                }
                            },
                            typeInfo.basic('boolean')
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
    boot.exportModule(
        '__equal', 'const', ast1.code(ast1.lookup('__self'),
            ['val1', 'val2'], ['const', 'const'], '', ast1.meta(
                (pass, instance) => {
                    let type1 = instance.accessOut('val1');
                    let type2 = instance.accessOut('val2');
                    if (typeCheck.visit(type1, type2) &&
                        typeCheck.visit(type1, typeInfo.basic('int'))) {
                        return ast2.nativeOut(
                            {
                                js: (pass, target) => {
                                    pass.write(target('__self.get(\'val1\') === __self.get(\'val2\')'));
                                }
                            },
                            typeInfo.basic('boolean')
                        )
                    }
                    else if (typeCheck.visit(type1, type2) &&
                             typeCheck.visit(type1, typeInfo.basic('float'))) {
                        return ast2.nativeOut(
                            {
                                js: (pass, target) => {
                                    pass.write(target('__self.get(\'val1\') === __self.get(\'val2\')'));
                                }
                            },
                            typeInfo.basic('boolean')
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
    boot.exportModule(
        '__positive', 'const', ast1.code(ast1.lookup('__self'),
            ['val'], ['const'], '', ast1.meta(
                (pass, instance) => {
                    return ast2.nativeOut(
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
    boot.exportModule(
        '__negative', 'const', ast1.code(ast1.lookup('__self'),
            ['val'], ['const'], '', ast1.meta(
                (pass, instance) => {
                    return ast2.nativeOut(
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
    boot.exportModule(
        '__not', 'const', ast1.code(ast1.lookup('__self'),
            ['val'], ['const'], '', ast1.meta(
                (pass, instance) => {
                    return ast2.nativeOut(
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
    boot.exportModule(
        'int', 'const', ast1.code(ast1.lookup('__self'),
            ['val'], ['const'], '', ast1.meta(
                (pass, instance) => {
                    return ast2.nativeOut(
                        {
                            js: (pass, target) => {
                                pass.write("let str = __self.get(\'val\').toString()");
                                pass.write(target("parseInt(str.substr(0, (str.indexOf('.') < 0) ? (str.length) : str.indexOf('.') ))"));
                            }
                        },
                        typeInfo.basic('int')
                    )
                },
                (pass, instance, type) => {
                    throw Error();
                }
            )
        )
    );

    // __array(...)
    boot.exportModule(
        '__array', 'const', ast1.code(ast1.lookup('__self'),
            [], [], 'const', ast1.meta(
                (pass, instance) => {
                    return ast2.nativeOut(
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
                        // typeInfo.array(typeInfo.basic('int'))
                        typeInfo.array(instance.accessOut('__argument_0'))
                    )
                },
                (pass, instance, type) => {
                    throw Error();
                }
            )
        )
    )

    // __index('container', 'index')
    boot.exportModule(
        '__index', 'const', ast1.code(ast1.lookup('__self'),
            ['container', 'index'], ['const', 'const'], '', ast1.meta(
                (pass, instance) => {
                    if (instance.accessOut('container').__type === 'array'
                        ) {
                            return ast2.nativeOut(
                                {
                                    js: (pass, target) => {
                                        pass.write(target(
                                            "__self.get('container')"
                                            + "[__self.get('index')]"
                                        ));
                                    }
                                },
                                typeInfo.basic('int')
                            )
                    }
                    else {
                        throw Error();
                    }
                },
                (pass, instance, type) => {
                    if (instance.accessOut('container').__type === 'array'
                        && typeCheck.visit(instance.accessOut('container').type, type)) {
                            return ast2.nativeIn(
                                {
                                    js: (pass, value) => {
                                        pass.write(
                                            "__self.get('container')"
                                            + "[__self.get('index')] = " + value
                                        );
                                    }
                                },
                                typeInfo.basic('null')
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
    boot.exportModule(
        '__if', 'const', ast1.code(ast1.lookup('__self'),
            ['cond', 'body'], ['const', 'const'], '',
            ast1.call(ast1.lookup('__do'), [
                // const c = cond()
                ast1.call(ast1.lookup('__assign'), [
                    ast1.symbol('c', 'const'),
                    ast1.call(ast1.lookup('cond'), [])
                ]),
                ast1.meta(
                    (pass, instance) => {
                        return ast2.nativeOut(
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
                ast1.call(ast1.lookup('body'), []),
            ])
        )
    )

    // exit('val')
    boot.exportModule(
        'exit', 'const', ast1.code(ast1.lookup('__self'),
            ['val'], 'const', '', ast1.meta(
                (pass, instance) => {
                    return ast2.nativeOut(
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
