'use strict';

const typename = require('./type.name');
const pass2 = require('./pass');

module.exports = (main, writeHead, write) => {
    const pass = pass2(writeHead, write);

    const boot = {
        main: main,
        operations: [],

        newFunction: (func) => {
            //
        },

        collect: () => {
            pass.build(boot.root, () => {
                for (const i in boot.operations) {
                    boot.operations[i]();
                }

                boot.operations = [];
            });

            pass.write(
                'int main(int argc, char *argv[]) {\n'
                + '    GC_init();\n'
                + '    func_0_0();\n'
                + '\n'
                + '    return 0;\n'
                + '}\n'
                + '\n'
            );
        },
    };

    pass.writeHead(
        '#include <stdbool.h>\n'
        + '#include <stdint.h>\n'
        + '#include <stdio.h>\n'
        + '#include <gc.h>\n'
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
        + '\n'
        + 'void func_null() {\n'
        + '    exit(1);\n' // TODO
        + '};\n'
        + '\n'
    );

    pass.write(
        'struct head *__upper;\n'
        + 'struct head *__inner;\n'
        + 'struct head *__callee;\n'
        + 'struct frame_0 __root_frame;\n'
        + 'struct head *__root = &__root_frame.head;\n'
        + 'struct head *__self = &__root_frame.head;\n'
        + '\n'
    );

    return boot;
};
