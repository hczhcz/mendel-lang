'use strict';

const fs = require('fs');

const typeinfo = require('./type.info');
const ast1 = require('./ast.1');
const ast2 = require('./ast.2');
const boot1 = require('./boot.1');
const boot2js = require('./boot.2.js');
const boot2c = require('./boot.2.c');

const a1 = ast1.call(ast1.lookup('__do'), [
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

b1.namedModule(
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

b1.namedModule(
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
                            pass.write('__self.set(\'a\', __self.get(\'b\'))');
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

b1.namedModule(
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
                            pass.write('console.log(__self.get(\'a\'))');
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

try {
    const a2 = b1.module(a1);

    const headjs = '\'use strict\';\n'
        + '\n'
        + 'let __upper = null;\n'
        + 'let __inner = null;\n'
        + 'let __callee = null;\n'
        + 'let __root = new Map();\n'
        + 'let __self = __root;\n'
        + '\n'
        + '__root.set(\'__do\', __root);\n'
        + '__root.set(\'__assign\', __root);\n'
        + '__root.set(\'__write\', __root);\n'
        + '\n';

    const m2js = b2js.module(a2);
    fs.writeFile(
        'test_gen.js',
        headjs + b2js.render() + m2js,
        (err) => {
            //
        }
    );

    const headc = '#include <iostream>\n'
        + '\n'
        + 'struct struct_head {\n'
        + '    void (*__func)();\n'
        + '    struct struct_head *__caller;\n'
        + '    struct struct_head *__outer;\n'
        + '};\n'
        + '\n'
        // TODO: structs here
        + '\n'
        + 'struct struct_head *__upper;\n'
        + 'struct struct_head *__inner;\n'
        + 'struct struct_head *__callee;\n'
        + 'struct struct_0 __root_struct;\n'
        + 'struct struct_head *__root ='
            + '(struct struct_head *) &__root_struct;\n'
        + 'struct struct_head *__self = __root;\n'
        + '\n';
        // TODO: init members of __root_struct

    const m2c = b2c.module(a2);
    fs.writeFile(
        'test_gen.c',
        headc + b2c.render() + m2c,
        (err) => {
            //
        }
    );
} catch (err) {
    console.log(err.stack);
}
