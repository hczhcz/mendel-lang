'use strict';

const pass2c = require('./pass.2.c');

module.exports = () => {
    const pass = pass2c();

    return {
        // TODO: init the standard library

        renderHead: () => {
            return '#include <stdbool.h>\n'
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
                + '\n'
                + pass.codeHead.join('');
        },

        renderBody: () => {
            return 'struct head *__upper;\n'
                + 'struct head *__inner;\n'
                + 'struct head *__callee;\n'
                + 'struct frame_0 __root_frame;\n'
                + 'struct head *__root = &__root_frame.head;\n'
                + 'struct head *__self = &__root_frame.head;\n'
                + '\n'
                + pass.codeBody.join('');
        },

        module: (instance) => {
            pass.build(instance, (ast) => {
                pass.visitOut(
                    ast,
                    (value) => {
                        return value; // TODO: return value as export
                    }
                );
            });

            const result = {
                head: pass.codeHead[0],
                body: pass.codeBody[0],
                main: 'int main(int argc, char *argv[]) {\n'
                    + '    func_0();\n'
                    + '\n'
                    + '    return 0;\n'
                    + '}',
            };

            delete pass.codeHead[0];
            delete pass.codeBody[0];

            return result;
        },
    };
};
