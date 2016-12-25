'use strict';

const type2c = require('./type.2.c');
const pass2c = require('./pass.2.c');

module.exports = (genHead, genBody) => {
    const pass = pass2c(genHead, genBody);

    const boot = {
        // TODO: init the standard library

        renderHead: () => {
            pass.genHead(
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
            );
        },

        renderBody: () => {
            pass.genBody(
                'struct head *__upper;\n'
                    + 'struct head *__inner;\n'
                    + 'struct head *__callee;\n'
                    + 'struct frame_0 __root_frame;\n'
                    + 'struct head *__root = &__root_frame.head;\n'
                    + 'struct head *__self = &__root_frame.head;\n'
                    + '\n'
            );
        },

        renderMain: () => {
            pass.genBody(
                'int main(int argc, char *argv[]) {\n'
                    + '    GC_init();\n'
                    + '    func_0();\n'
                    + '\n'
                    + '    return 0;\n'
                    + '}\n'
            );
        },

        genInstance: (instance) => {
            pass.build(instance, () => {
                if (instance.mainMode === 'out') {
                    pass.visitOut(
                        instance.impl,
                        (value) => {
                            return '((' + type2c.visit(instance)
                                + ') __self)->data.__return = ' + value;
                        }
                    );
                } else {
                    // mainMode === 'const'
                    pass.visitIn(
                        instance.impl,
                        '((' + type2c.visit(instance)
                        + ') __self)->data.__return'
                    );
                }
            });
        },

        genExec: (impl) => {
            pass.visitOut(
                impl,
                (value) => {
                    return '(void) ' + value; // notice: discard
                }
            );
        },

        genExport: (name, impl) => {
            pass.visitOut(
                impl,
                (value) => {
                    return '__root_frame.data.' + name + ' = ' + value;
                }
            );
        },
    };

    return boot;
};
