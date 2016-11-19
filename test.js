'use strict';

const typeinfo = require('./type.info');
const ast1 = require('./ast.1');
const ast2 = require('./ast.2');
const boot1 = require('./boot.1');
const boot2 = require('./boot.2.js');

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
const b2 = boot2();

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
    const head = '\'use strict\';\n'
        + '\n'
        + 'let __inner = null;\n'
        + 'let __upper = null;\n'
        + 'let __callee = null;\n'
        + 'let __parent = null;\n'
        + 'let __root = new Map();\n'
        + 'let __self = __root;\n'
        + '\n'
        + '__root.set(\'__do\', __root);\n'
        + '__root.set(\'__assign\', __root);\n'
        + '__root.set(\'__write\', __root);\n'
        + '\n';

    const a2 = b1.module(a1);

    const m2 = b2.module(a2);

    console.log(head + b2.render() + m2);
} catch (err) {
    console.log(err.stack);
}
