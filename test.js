'use strict';

const typeinfo = require('./typeinfo');
const ast1 = require('./ast.1');
const boot1 = require('./boot.1');
const boot2 = require('./boot.2.js');

const a1 = ast1.call(ast1.lookup('__do'), [
    // var a = 1;
    ast1.call(ast1.lookup('__assign'), [
        ast1.symbol('a', 'var'),
        ast1.literal(1, 'int'),
    ]),
    // const b = (x) => {a = x}
    ast1.call(ast1.lookup('__assign'), [
        ast1.symbol('b', 'const'),
        ast1.code(
            ['x'], ['const'],
            ast1.call('__assign', [
                ast1.lookup('a'),
                ast1.lookup('x'),
            ])
        ),
    ]),
    // b(2)
    ast1.call(ast1.lookup('b'), [
        ast1.literal(2, 'int'),
    ]),
]);

const b1 = boot1();
const b2 = boot2();

b1.namedModule(
    '__do', 'const', ast1.literal(null, 'void')
);

b1.namedModule(
    '__assign', 'const', ast1.literal(null, 'void')
);

try {
    const a2 = b1.module(a1);

    console.log(b2.module(a2));
} catch (e) {
    console.log(e.stack);
}
