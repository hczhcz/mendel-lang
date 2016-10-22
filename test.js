'use strict';

const ast1 = require('./ast.1');
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
            ['x'], ['const'],
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
        ['a', 'b', 'c', 'd'], ['const', 'const', 'const', 'const'],
        ast1.literal(null, 'void')
    )
);

b1.namedModule(
    '__assign', 'const', ast1.code(
        ['a', 'b'], ['out', 'const'],
        ast1.native(
            {
                out: (pass, instance) => {
                    instance.addType(
                        'a',
                        instance.accessOut('b')
                    );

                    return 'void';
                },
                in: (pass, instance) => {
                    throw Error();
                },
            },
            {
                js: {
                    out: (pass, target) => {
                        pass.write('__self.set(\'a\', __self.get(\'b\'))');
                    },
                    in: (pass, value) => {
                        throw Error(); // never reach
                    },
                },
            }
        )
    )
);

b1.namedModule(
    '__write', 'const', ast1.code(
        ['a'], ['const'],
        ast1.native(
            {
                out: (pass, instance) => {
                    return 'void';
                },
                in: (pass, instance) => {
                    throw Error();
                },
            },
            {
                js: {
                    out: (pass, target) => {
                        pass.write('console.log(__self.get(\'a\'))');
                    },
                    in: (pass, value) => {
                        throw Error(); // never reach
                    },
                },
            }
        )
    )
);

try {
    const head = '\'use strict\';\n'
        + '\n'
        + 'let __inner, __upper, __callee;\n'
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
