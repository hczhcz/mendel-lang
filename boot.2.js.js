'use strict';

const pass2js = require('./pass.2.js');

module.exports = (gen) => {
    const pass = pass2js(gen);

    const boot = {
        // TODO: init the standard library

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

        genInstance: (instance) => {
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
