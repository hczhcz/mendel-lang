types:
    literal types:
        void
        boolean
        int i8 i16 i32 i64
        unsigned u8 u16 u32 u64
        float f32 f64
        string
    user defined types:
        <closure #>
        <instance #>
    type info types (compile time, hidden to user):
        basic
            type -> string (in literal types)
        closure
            parent -> instance
            code -> code
            private instances -> array of instance
            add -> function
        instance
            id -> i64
            inits -> array of string
            modes -> object
                (string) -> string (in symbol modes)
            private types -> object
                (string) -> type info
            impl -> pass-2 ast node
            addInit -> function
            add -> function
            addType -> function
            doOut -> function
            accessOut -> function
            accessIn -> function
    pass-1 ast node types (compile time):
        literal
            value -> literal
            type -> string (in literal types)
        symbol
            name -> string
            mode -> string (in symbol modes)
        lookup
            name -> string
        path
            upper -> pass-1 ast node
            name -> string
        call
            callee -> pass-1 ast node
            args -> array of pass-1 ast node
        code
            paramNames -> array of string
            paramModes -> array of string (in symbol modes)
            vaMode -> string (in symbol modes or '')
            impl -> pass-1 ast node
        native
            typing -> object
                out -> function
                in -> function
            impls -> object
                (string) -> object
                    out -> function
                    in -> function

    pass-2 ast node types (compile time):
        literalOut
            value -> literal
            type -> type info
        reservedOut
            name -> string
            type -> type info
        reservedIn
            name -> string
        pathOut
            upper -> pass-2 ast node
            name -> string
            type -> type info
        pathIn
            upper -> pass-2 ast node
            name -> string
        callOut
            callee -> pass-2 ast node
            instance -> instance
            outArgs -> object
                (i64) -> pass-2 ast node
            inArgs -> object
                (i64) -> pass-2 ast node
            type -> type info
        callIn
            callee -> pass-2 ast node
            instance -> instance
            outArgs -> object
                (i64) -> pass-2 ast node
            inArgs -> object
                (i64) -> pass-2 ast node
        nativeOut
            impls -> object
                (string) -> object
                    out -> function
                    in -> function
            type -> type info
        nativeIn
            impls -> object
                (string) -> object
                    out -> function
                    in -> function

symbol modes:
    const, out, var, special

reserved names:
    internal names:
        __root
        __self
    members:
        __parent
        __return
        __argument_#

standard library:
    builtin:
        __do
        __assign
