'use strict';

const pass3 = require('./pass');

module.exports = (main, write, onSection) => {
    const pass = pass3(write);

    const boot = {
        main: main,
        onSection: onSection,

        newFunction: (func) => {
            for (const i in func.insts) {
                pass.write(
                    'const func_' + func.instance.id + '_' + i
                        + ' = () => {\n'
                );

                for (const j in func.insts[i]) {
                    pass.write('    ');
                    pass.visit(func.insts[i][j]);
                    pass.write(';\n');
                }

                pass.write(
                    '};\n'
                    + '\n'
                );
            }

            // notice: func_X_Y uses func_X_Y+1
            boot.onSection();
        },

        execute: (nextId) => {
            for (const i in boot.main.insts) {
                if (i >= nextId) {
                    pass.write(
                        'const func_' + boot.main.instance.id + '_' + i
                            + ' = () => {\n'
                    );

                    for (const j in boot.main.insts[i]) {
                        pass.write('    ');
                        pass.visit(boot.main.insts[i][j]);
                        pass.write(';\n');
                    }

                    pass.write(
                        '};\n'
                        + '\n'
                    );
                }
            }

            pass.write(
                'func_' + boot.main.instance.id + '_' + nextId + '();\n'
                + '\n'
            );

            boot.onSection();
        },
    };

    pass.write(
        '\'use strict\';\n'
        + '\n'
        + 'let __upper = null;\n'
        + 'let __inner = null;\n'
        + 'let __callee = null;\n'
        + 'let __root = {};\n'
        + 'let __self = __root;\n'
        + '\n'
    );

    boot.onSection();

    pass.write(
        'const func_null = () => {\n'
        + '    throw Error();\n' // TODO
        + '};\n'
        + '\n'
    );

    boot.onSection();

    return boot;
};
