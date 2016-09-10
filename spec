types:
    literal types:
        void
        boolean
        i8 i16 i32 i64
        u8 u16 u32 u64
        f32 f64
        string
    typeinfo types:
        <string>
        <closure #>
        <instance #>
    info container types (compile time):
        closure
        instance
    pass-1 ast node types (compile time):
        literal
        symbol
        lookup
        path
        call
        code
    pass-2 ast node types (compile time):
        literal // duplicated
        self
        root
        pathOut
        pathIn
        callOut
        callIn

symbol modes:
    const, out, var

lookup modes:
    global, mixed, local
