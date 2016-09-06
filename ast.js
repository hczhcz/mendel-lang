'use strict';

// data types:
//     void
//     bool
//     i8 i16 i32 i64
//     u8 u16 u32 u64
//     f32 f64
//     str
//     instance<...>
// ast node types:
//     literal
//     symbol
//     path
//     call
//     code
// lookup modes:
//     global, mixed, local

module.exports = {
    literal: (type, value) => {
        return {
            astType: () => {
                return 'literal';
            },
            dataType: () => {
                return type;
            },
            value: () => {
                return value;
            },
        };
    },
    symbol: (mode, name) => {
        return {
            astType: () => {
                return 'symbol';
            },
            mode: () => {
                return mode;
            },
            name: () => {
                return name;
            },
        };
    },
    path: (source, name) => {
        return {
            astType: () => {
                return 'path';
            },
            source: () => {
                return source;
            },
            name: () => {
                return name;
            },
        };
    },
    call: (callee, closure, args) => {
        return {
            astType: () => {
                return 'call';
            },
            callee: () => {
                return callee;
            },
            closure: () => {
                return closure;
            },
            args: () => {
                return args;
            },
        };
    },
    code: (params, ast) => {
        // const instance = (code, types) => {
        //     return {
        //         astType: () => {
        //             return 'instance';
        //         },
        //         code: () => {
        //             return code;
        //         },
        //         types: () => {
        //             return types;
        //         },
        //         find: (name) => {}, // TODO
        //     };
        // };

        return {
            astType: () => {
                return 'code';
            },
            params: () => {
                return params;
            },
            ast: () => {
                return ast;
            },
        };
    },
};
