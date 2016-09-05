'use strict';

// literal type:
//     void
//     bool
//     i8 i16 i32 i64
//     u8 u16 u32 u64
//     f32 f64
//     str
// other data type:
//     instance of #
// other ast type:
//     root
//     path
//     call
//     code
// lookup mode:
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
    instance: (code, types) => {
        return {
            astType: () => {
                return 'instance';
            },
            code: () => {
                return code;
            },
            types: () => {
                return types;
            },
        };
    },
    root: (mode) => {
        return {
            astType: () => {
                return 'root';
            },
            mode: () => {
                return mode;
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
    call: (source, args) => {
        return {
            astType: () => {
                return 'call';
            },
            source: () => {
                return source;
            },
            args: () => {
                return args;
            },
        };
    },
    code: (source, params, ast) => {
        return {
            astType: () => {
                return 'code';
            },
            source: () => {
                return source;
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
