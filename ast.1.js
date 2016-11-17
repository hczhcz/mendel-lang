'use strict';

module.exports = {
    /*
        AST of a literal value
        Code:
            'hello'
        AST:
            {
                __type: 'literal',
                value: 'hello',
                type: 'string',
            }
    */
    literal: (value, type) => {
        return {
            __type: 'literal',
            value: value,
            type: type,
        };
    },

    /*
        AST of a declaration of a symbol (constant, variable, etc.)
        Code:
            var foo
        AST:
            {
                __type: 'symbol',
                name: 'foo',
                mode: 'var',
            }
    */
    symbol: (name, mode) => {
        return {
            __type: 'symbol',
            name: name,
            mode: mode,
        };
    },

    /*
        AST of a lookup process of a symbol
        Code:
            foo
        AST:
            {
                __type: 'lookup',
                name: 'foo',
            }
    */
    lookup: (name) => {
        return {
            __type: 'lookup',
            name: name,
        };
    },

    /*
        AST of a lookup process of a member of an object
        Code:
            foo.bar
        AST:
            {
                __type: 'path',
                upper: {
                    __type: 'lookup',
                    name: 'foo',
                },
                name: 'bar',
            }
    */
    path: (upper, name) => {
        return {
            __type: 'path',
            upper: upper,
            name: name,
        };
    },

    /*
        AST of a call or an operation (assignment, etc.)
        Code:
            foo = bar
        AST:
            {
                __type: 'call',
                callee: {
                    __type: 'lookup',
                    name: '__assign',
                },
                args: [
                    {
                        __type: 'lookup',
                        name: 'foo',
                    },
                    {
                        __type: 'lookup',
                        name: 'bar',
                    },
                ],
            }

    */
    call: (callee, args) => {
        return {
            __type: 'call',
            callee: callee,
            args: args,
        };
    },

    /*
        AST of a code block (eg. function)
        Code:
            func (out foo, const bar) {
                foo = bar
            }
        AST:
            {
                __type: 'code',
                paramNames: ['foo', 'bar'],
                paramModes: ['out', 'const'],
                vaMode: '', // no variable argument in this function
                impl: {
                    ... // code of '__do(__assign(foo, bar))'
                },
            }
    */
    code: (paramNames, paramModes, vaMode, impl) => {
        return {
            __type: 'code',
            paramNames: paramNames,
            paramModes: paramModes,
            vaMode: vaMode,
            impl: impl,
        };
    },

    /*
        AST of a compile-time function
        **Warning: the interface of ast1.meta may change in the future**
    */
    meta: (outGen, inGen) => {
        return {
            __type: 'meta',
            outGen: outGen,
            inGen: inGen,
        };
    },
};
