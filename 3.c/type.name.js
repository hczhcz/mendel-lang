'use strict';

module.exports = {
    basic: (type) => {
        const map = {
            bool: 'bool',
            int: 'intmax_t',
            i8: 'int8_t',
            i16: 'int16_t',
            i32: 'int32_t',
            i64: 'int64_t',
            unsigned: 'uintmax_t',
            u8: 'uint8_t',
            u16: 'uint16_t',
            u32: 'uint32_t',
            u64: 'uint64_t',
            float: 'double',
            f32: 'float',
            f64: 'double',
            string: 'char *',
            null: 'null_t',
            variant: 'variant_t',
        };

        return map[type.type];
    },

    array: (type) => {
        return 'array_p';
    },

    object: (type) => {
        return 'struct frame_' + type.instance.id + ' *'; // TODO
        // return 'frame_' + type.instance.id + '_p';
    },

    closure: (type) => {
        return 'struct frame_' + type.parent.id + ' *'; // TODO
        // return 'frame_' + type.parent.id + '_p';
    },

    visit: (type) => {
        return module.exports[type.__type](type);
    },
};
