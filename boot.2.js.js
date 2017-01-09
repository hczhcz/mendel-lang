'use strict';

const pass2js = require('./pass.2.js');

module.exports = (root, gen) => {
    const pass = pass2js(gen);

    pass.gen(
        '\'use strict\';\n'
            + '\n'
            + 'let __upper = null;\n'
            + 'let __inner = null;\n'
            + 'let __callee = null;\n'
            + 'let __root = new Map();\n'
            + 'let __self = __root;\n'
            + '\n'
    );

    const boot = {
        root: root,
        operations: [],

        newInstance: (instance) => {
            pass.build(instance, () => {
                if (instance.mainMode === 'out') {
                    pass.visitOut(
                        instance.impl,
                        (value) => {
                            return '__self.set(\'__return\', ' + value + ')';
                        }
                    );
                } else {
                    // mainMode === 'const'
                    pass.visitIn(
                        instance.impl,
                        '__self.get(\'__return\')'
                    );
                }
            });
        },

        execute: (impl) => {
            boot.operations.push(() => {
                pass.visitOut(
                    impl,
                    (value) => {
                        return 'void ' + value; // notice: discard
                    }
                );
            });
        },

        export: (name, impl) => {
            boot.operations.push(() => {
                pass.visitOut(
                    impl,
                    (value) => {
                        return '__root.set('
                            + '\'' + name + '\', ' + value
                            + ')';
                    }
                );
            });
        },

        collect: () => {
            pass.build(root, () => {
                for (const i in boot.operations) {
                    boot.operations[i]();
                }

                boot.operations = [];
            });

            pass.gen(
                'func_0();\n'
                    + '\n'
            );
        },
    };

    return boot;
};
