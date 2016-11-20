'use strict';

const pass2c = require('./pass.2.c');

module.exports = () => {
    const pass = pass2c();

    return {
        // TODO: init the standard library

        renderHead: () => {
            return pass.codeHead.join('');
        },

        renderBody: () => {
            return pass.codeBody.join('');
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
                    + '}'
            };

            delete pass.codeHead[0];
            delete pass.codeBody[0];

            return result;
        },
    };
};
