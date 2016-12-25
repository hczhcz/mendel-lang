'use strict';

const pass2js = require('./pass.2.js');

module.exports = () => {
    const pass = pass2js();

    const boot = {
        // TODO: init the standard library

        render: () => {
            return '\'use strict\';\n'
                + '\n'
                + 'let __upper = null;\n'
                + 'let __inner = null;\n'
                + 'let __callee = null;\n'
                + 'let __root = new Map();\n'
                + 'let __self = __root;\n'
                + '\n'
                + pass.code.join('');
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
                                return '__self.set(\'__return\', ' + value + ')';
                            }
                        );
                    } else {
                        // mainMode === 'const'
                        pass.visitIn(
                            instances[i].impl,
                            '__self.get(\'__return\')'
                        );
                    }
                });
            }

            const result = pass.code[0] + 'func_0();\n';

            delete pass.code[0];

            return result;
        },

        genExec: (impl) => {
            pass.visitOut(
                impl,
                (value) => {
                    return 'void ' + value; // notice: discard
                }
            );
        },

        genExport: (name, impl) => {
            pass.visitOut(
                impl,
                (value) => {
                    return '__root.set('
                        + '\'' + name + '\', ' + value
                        + ')';
                }
            );
        },
    };

    return boot;
};
