![Mendel Logo](mendel_logo_small.png)

# Mendel Programming Language

Mendel is an user friendly programming language. It has a clean design with modern programming principles.

Mendel is a static typed programming language although it was developed based on JavaScript. Mendel is also friendly to JavaScript and C.

Get to know about the Mendel by visiting our [presentation](http://go.osu.edu/intro2mendel).

## Getting Started

### Requirements

Currently, the Mendel is complied using node.js. Node.js can be downloaded on [Node.js](https://nodejs.org).

For Windows user, it might be helpful to have an terminal like [PuTTy](http://www.putty.org/) on your computer.

### Source

To download the source of the Mendel, open a terminal and type in the following command:

```bash
$ git clone https://github.com/hczhcz/mendel-lang.git
```

## Turorial

### HelloWorld

Your first Mendel code:

```javascript
write("Hello, World!");
```

Output:

```
Hello, World!
```

### Assignment

```javasrcipt
a := 1;
b := 2;
write(a+b);
```

Output:

```
3
```

### Generic

```javascript
func add(a, b) {
    return a + b;
}
write(add(1, 2));
write(add(1.2, 2.3));
```

Output:

```
3
3.5
```

### Prototype-based OOP

```javascript
func newUser(name, id) {
    return __self;
}
user := newUser("Foo", 42);
write(user);
```

Output:

```
{"name": "Foo", "id": 42}
```

## Features

- Template and generic driven
- Prototype-based OOP
- Multi-paradigm
- Static & strong type
- Full type inference
- Support UTF-8
- Compiled to JavaScript and C

## Contributing

Contributing to the Mendel is always welcome.

If you have any question, feel free to contact the Mendel development group.

## License

The Mendel, including complier and standard library, is under MIT License, expect some of project files suggest otherwise.
