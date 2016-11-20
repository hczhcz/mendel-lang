'use strict';

const fs = require('fs');

const typeinfo = require('./type.info');
const type2c = require('./type.2.c');
const ast1 = require('./ast.1');
const ast2 = require('./ast.2');
const boot1 = require('./boot.1');
const boot2js = require('./boot.2.js');
const boot2c = require('./boot.2.c');

const ast = ast1.call(ast1.lookup('__do'), [
    // var a = 'hello';
    ast1.call(ast1.lookup('__assign'), [
        ast1.symbol('a', 'var'),
        ast1.literal('hello', 'string'),
    ]),
    // const b = (x) => {a = x}
    ast1.call(ast1.lookup('__assign'), [
        ast1.symbol('b', 'const'),
        ast1.code(
            ['x'], ['const'], '',
            ast1.call(ast1.lookup('__assign'), [
                ast1.lookup('a'),
                ast1.lookup('x'),
            ])
        ),
    ]),
    // b('hello, world')
    ast1.call(ast1.lookup('b'), [
        ast1.literal('hello, world', 'string'),
    ]),
    // write(a)
    ast1.call(ast1.lookup('__write'), [
        ast1.lookup('a'),
    ]),
]);

const b1 = boot1();
const b2js = boot2js();
const b2c = boot2c();

b1.exportModule(
    '__do', 'const', ast1.code(
        [], [], 'const',
        ast1.meta(
            (pass, instance) => {
                return ast2.nativeOut(
                    {
                        js: (pass, target) => {
                            // nothing
                        },
                        c: (pass, target) => {
                            // nothing
                        },
                    },
                    typeinfo.basic('null')
                );
            },
            (pass, instance, type) => {
                throw Error();
            }
        )
    )
);

b1.exportModule(
    '__assign', 'const', ast1.code(
        ['a', 'b'], ['out', 'const'], '',
        ast1.meta(
            (pass, instance) => {
                instance.accessIn(
                    'a',
                    instance.accessOut('b')
                );

                return ast2.nativeOut(
                    {
                        js: (pass, target) => {
                            pass.write('__self.set(\'a\', __self.get(\'b\'))');
                        },
                        c: (pass, target) => {
                            pass.write(
                                '((' + type2c.visit(instance)
                                + ')__self)->data.a = ((' + type2c.visit(instance)
                                + ')__self)->data.b'
                            );
                        },
                    },
                    typeinfo.basic('null')
                );
            },
            (pass, instance, type) => {
                throw Error();
            }
        )
    )
);

b1.exportModule(
    '__write', 'const', ast1.code(
        ['a'], ['const'], '',
        ast1.meta(
            (pass, instance) => {
                return ast2.nativeOut(
                    {
                        js: (pass, target) => {
                            pass.write('console.log(__self.get(\'a\'))');
                        },
                        c: (pass, target) => {
                            pass.write(
                                'puts(((' + type2c.visit(instance)
                                + ')__self)->data.a)'
                            );
                        },
                    },
                    typeinfo.basic('null')
                );
            },
            (pass, instance, type) => {
                throw Error();
            }
        )
    )
);

const m1 = b1.execModule(ast);

const m2js = b2js.module(m1);
fs.writeFile(
    'test_gen.js',
    b2js.render() + m2js,
    (err) => {
        //
    }
);

const m2c = b2c.module(m1);
fs.writeFile(
    'test_gen.c',
    b2c.renderHead() + m2c.head + b2c.renderBody() + m2c.body + m2c.main,
    (err) => {
        //
    }
);
