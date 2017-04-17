'use strict';

const typename3 = require('./type.name');
const pass3 = require('./pass');

module.exports = (main, writeHead, write) => {
    const pass = pass3(writeHead, write);

    const boot = {
        main: main,
        executeList: [],

        newFunction: (func) => {
            pass.writeHead(
                'typedef struct frame_' + func.instance.id
                    + ' *frame_' + func.instance.id + '_p;\n'
                + 'struct frame_' + func.instance.id + ' {\n'
                + '    func_t __func;\n'
                + '    head_p __caller;\n'
                + '    head_p __outer;\n'
            );

            for (const i in func.instance.types) {
                pass.writeHead(
                    '    ' + typename3.visit(func.instance.types[i])
                    + ' ' + pass.convName(i) + ';\n'
                );
            }

            pass.writeHead(
                '};\n'
                + '\n'
            );

            for (const i in func.insts) {
                pass.writeHead(
                    'static void func_' + func.instance.id + '_' + i + '();\n'
                );

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

        execute: (nextId) => {
            boot.executeList.push('func_' + boot.main.instance.id + '_' + nextId);
        },

        collect: () => {
            boot.newFunction(boot.main);

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
        + '#include <gc/gc.h>\n'
        + '\n'
        + 'typedef struct {} null_t;\n'
        + 'typedef void (*func_t)();\n'
        + '\n'
        + 'typedef struct array *array_p;\n'
        + 'struct array {\n'
        + '    size_t __size;\n'
        + '    null_t __data;\n'
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
        + '}\n'
        + '\n'
    );

    pass.write(
        'static head_p __upper;\n'
        + 'static head_p __inner;\n'
        + 'static head_p __callee;\n'
        + 'static struct frame_0 __root_frame;\n'
        + 'static head_p __root = (head_p) &__root_frame;\n'
        + 'static head_p __self = (head_p) &__root_frame;\n'
        + '\n'
    );

    return boot;
};
