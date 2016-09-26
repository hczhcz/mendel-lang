types:
    literal types:
        void
        boolean
        i8 i16 i32 i64
        u8 u16 u32 u64
        f32 f64
        string
    user defined types:
        <closure #>
        <instance #>
    type info types (compile time, hidden to user):
        string // duplicated
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
        reservedOut
        reservedIn
        pathOut
        pathIn
        callOut
        callIn

symbol modes:
    const, out, var, special
