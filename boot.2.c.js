'use strict';

const type2c = require('./type.2.c');
const pass2c = require('./pass.2.c');

module.exports = () => {
    const pass = pass2c();

    const boot = {
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

        collectRoot: (exports) => {
            for (const i in exports) {
                pass.visitOut(
                    exports[i].impl,
                    (value) => {
                        if (exports[i].name !== '') {
                            return '__root_frame.data.' + exports[i].name
                                + ' = ' + value;
                        } else {
                            return value; // notice: discard
                        }
                    }
                );
            }
        },

        collect: (instances, exports) => {
            for (const i in instances) {
                pass.build(instances[i], () => {
                    if (i === '0') {
                        boot.collectRoot(exports);
                    } else if (instances[i].mainMode === 'out') {
                        pass.visitOut(
                            instances[i].impl,
                            (value) => {
                                return '((' + type2c.visit(instances[i])
                                    + ') __self)->data.__return = ' + value;
                            }
                        );
                    } else {
                        // mainMode === 'const'
                        pass.visitIn(
                            instances[i].impl,
                            '((' + type2c.visit(instances[i])
                            + ') __self)->data.__return'
                        );
                    }
                });
            }

            let main = 'int main(int argc, char *argv[]) {\n';

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

    return boot;
};
