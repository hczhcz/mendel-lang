'use strict';

const pass2js = require('./pass.2.js');

module.exports = (root, gen) => {
    const pass = pass2js(gen);

    const boot = {
        // TODO: init the standard library

        root: root,
        exec: [],

        render: () => {
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
        },

        renderMain: () => {
            pass.gen(
                'func_0();\n'
            );
        },

        addInstance: (instance) => {
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

        addExec: (impl) => {
            boot.exec.push(() => {
                pass.visitOut(
                    impl,
                    (value) => {
                        return 'void ' + value; // notice: discard
                    }
                );
            });
        },

        addExport: (name, impl) => {
            boot.exec.push(() => {
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
                for (const i in boot.exec) {
                    boot.exec[i]();
                }

                boot.exec = [];
            });
        },
    };

    return boot;
};
