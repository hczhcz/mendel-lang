'use strict';

const pass2c = require('./pass.2.c');

module.exports = () => {
    const pass = pass2c();

    return {
        // TODO: init the standard library

        render: () => {
            return pass.code.join('');
        },

        module: (ast) => {
            pass.id.push('func_main');

            pass.buffer.push([]);

            pass.writeRaw('void func_main() {');

            pass.visitOut(
                ast,
                (value) => {
                    return value; // TODO: discard?
                }
            );

            pass.writeRaw('}');
            pass.writeRaw('');

            pass.writeRaw('int main(int argc, char *argv[]) {');
            pass.write('func_main()');
            pass.writeRaw('}');

            pass.id.pop();

            return pass.buffer.pop().join('');
        },
    };
};
