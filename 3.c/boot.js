'use strict';

const typename = require('./type.name');
const pass3 = require('./pass');

module.exports = (writeHead, write) => {
    const pass = pass3(writeHead, write);

    const boot = {
        executeList: [],

        newFunction: (func) => {
            pass.writeHead(
                'struct data_' + func.instance.id + ' {\n'
            );

            // TODO

            pass.writeHead(
                '};\n'
                + '\n'
            );

            pass.writeHead(
                'typedef struct frame_' + func.instance.id
                    + ' *frame_' + func.instance.id + '_p;\n'
                + 'struct frame_' + func.instance.id + ' {\n'
                + '    struct head head;\n'
                + '    struct data_' + func.instance.id + ' data;\n'
                + '};\n'
            );

            for (const i in func.insts) {
                pass.write(
                    'static void func_' + func.instance.id + '_' + i + '() {\n'
                );

                for (const j in func.insts[i]) {
                    pass.write('    ');
                    pass.visit(func.insts[i][j]);
                    pass.write(';\n');
                }

                pass.write(
                    '}\n'
                    + '\n'
                );
            }
        },

        execute: (func) => {
            boot.newFunction(func);

            boot.executeList.push(func.instance.id);
        },

        collect: () => {
            pass.write(
                'int main(int argc, char *argv[]) {\n'
                + '    GC_init();\n'
                + '\n'
            );

            for (const i in boot.executeList) {
                pass.write(
                    '    ' + boot.executeList[i] + '();\n'
                );
            }

            pass.write(
                '\n'
                + '    return 0;\n'
                + '}\n'
                + '\n'
            );
        },
    };

    pass.writeHead(
        '#include <stdlib.h>\n'
        + '#include <stdbool.h>\n'
        + '#include <stdint.h>\n'
        + '#include <stdio.h>\n'
        + '#include <gc.h>\n'
        + '\n'
        + 'typedef struct {} null_t;\n'
        + 'typedef void (*func_t)();\n'
        + '\n'
        + 'typedef struct array *array_p;\n'
        + 'struct array {\n'
        + '    size_t size;\n'
        + '    null_t data;\n'
        + '};\n' // TODO
        + '\n'
        + 'typedef struct head *head_p;\n'
        + 'struct head {\n'
        + '    func_t __func;\n'
        + '    head_p __caller;\n'
        + '    head_p __outer;\n'
        + '};\n'
        + '\n'
        + 'static void func_null() {\n'
        + '    exit(1);\n' // TODO
        + '};\n'
        + '\n'
    );

    pass.write(
        'static head_p __upper;\n'
        + 'static head_p __inner;\n'
        + 'static head_p __callee;\n'
        + 'static struct frame_0 __root_frame;\n'
        + 'static head_p __root = &__root_frame.head;\n'
        + 'static head_p __self = &__root_frame.head;\n'
        + '\n'
    );

    return boot;
};
