'use strict';

module.exports = {
    /*
      Given a literal value, return its ast.
      eg:
      in: 'hello' // value = 'hello', type = 'string'
      return: {
          __type: 'literal',
          value: 'hello',
          type: 'string'
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
      Given a declaration of a variable, return its ast
      eg:
      in: 'var a' // name = 'a', mode = 'var'
      out: {
        __type: 'symbol',
        name: 'a',
        mode: 'var'
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
      Given a name, return the ast of lookup process
      eg:
      in: 'a' // name = 'a'
      out: {
        __type: 'lookup',
        name: 'a'
      }
    */
    lookup: (name) => {
        return {
            __type: 'lookup',
            name: name,
        };
    },

    /*
      Given a path, return its ast
      eg:
      in: 'Java.util' // upper = 'Java', name = 'util'
      out: {
        __type: 'path',
        upper: 'Java',
        name: 'util'
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
      Given a call statements, return its ast.
      eg:
      in: 'a = b' // callee = '=', args = ['a', 'b']
      out: {
        __type: 'call',
        callee: '=',
        args: ['a', 'b']
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
      Given a code block(eg. function), return its ast.
      eg:
      in: '(x) => {a = x}'
      // paramNames = ['x'], paramModes = ['const'], vaMode = ''
      // impl = ast1.call(ast1.lookup('='), [ast1.lookup('a'), ast1.lookup('x')])
      out: {
        __type: 'code',
        paramNames: ['x'],
        paramModes: ['const'],
        vaMode: '',
        impl: {
          __type: 'call',
          args: [{__type: 'lookup', name: 'a'},
                {__type: 'lookup', name: 'x'}]
        }
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

    meta: (outGen, inGen) => {
        return {
            __type: 'meta',
            outGen: outGen,
            inGen: inGen,
        };
    },
};
