'use strict';

// value type:
//     void
//     bool
//     i8 i16 i32 i64
//     u8 u16 u32 u64
//     f32 f64
//     str
// other ast node type:
//     sym
//     path
//     call
//     func

// lookup mode:
//     global, mixed, local

const literal = (type, value) => {
    return {
        type: () => {
            return type;
        },
        value: () => {
            return value;
        },
    };
};

const symbol = (mode, name) => {
    return {
        type: () => {
            return 'sym';
        },
        mode: () => {
            return mode;
        },
        name: () => {
            return name;
        },
    };
};

const path = (source, mode, name) => {
    return {
        type: () => {
            return 'path';
        },
        source: () => {
            return source;
        },
        mode: () => {
            return mode;
        },
        name: () => {
            return name;
        },
    };
};

const call = (source, args) => {
    return {
        type: () => {
            return 'call';
        },
        source: () => {
            return source;
        },
        args: () => {
            return args;
        },
    };
};

const func = (source, params, code) => {
    return {
        type: () => {
            return 'func';
        },
        source: () => {
            return source;
        },
        params: () => {
            return params;
        },
        code: () => {
            return code;
        },
    };
};
