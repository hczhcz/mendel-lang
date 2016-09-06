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
            astType: 'literal',
            dataType: type,
            value: value,
        };
    },
    symbol: (mode, name) => {
        return {
            astType: 'symbol',
            mode: mode,
            name: name,
        };
    },
    path: (source, name) => {
        return {
            astType: 'path',
            source: source,
            name: name,
        };
    },
    call: (callee, closure, args) => {
        return {
            astType: 'call',
            callee: callee,
            closure: closure,
            args: args,
        };
    },
    code: (params, ast) => {
        // const instance = (code, types) => {
        //     return {
        //         code: code,
        //         _types: types,
        //         find: (name) => {}, // TODO
        //     };
        // };

        return {
            astType: 'code',
            params: params,
            ast: ast,
        };
    },
};
