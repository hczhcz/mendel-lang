'use strict';

const fs = require('fs');

const typeinfo = require('./type.info');
const type2c = require('./type.2.c');
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
                            pass.write(
                                '((' + type2c.visit(instance)
                                + ')__self)->data.a'
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

    const headc1 = '#include <stdbool.h>\n'
        + '#include <stdint.h>\n'
        + '#include <stdio.h>\n'
        + '\n'
        + 'typedef struct {} null_t;\n'
        + 'typedef struct {uint64_t placeholder;} variant_t;\n'
        + '\n'
        + 'struct array {\n'
        + '    size_t size;\n'
        + '    null_t data;\n'
        + '};\n'
        + '\n'
        + 'struct head {\n'
        + '    void (*__func)();\n'
        + '    struct head *__caller;\n'
        + '    struct head *__outer;\n'
        + '};\n'
        + '\n';

    const headc2 =
        'struct head *__upper;\n'
        + 'struct head *__inner;\n'
        + 'struct head *__callee;\n'
        + 'struct frame_0 __root_frame;\n'
        + 'struct head *__root = &__root_frame.head;\n'
        + 'struct head *__self = &__root_frame.head;\n'
        + '\n';
        // TODO: init members of __root_frame

    const m2c = b2c.module(a2);
    fs.writeFile(
        'test_gen.c',
        headc1 + b2c.renderHead() + m2c.head + headc2 + b2c.renderBody() + m2c.body,
        (err) => {
            //
        }
    );
} catch (err) {
    console.log(err.stack);
}
