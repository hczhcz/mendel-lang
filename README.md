![Mendel Logo](mendel_logo_small.png)

# Mendel Programming Language

Mendel is a statically typed, multi-paradigm, and compiled programming language with modern and clean style. The Mendel compiler was developed in JavaScript (and will migrate to Mendel iteself in the future). Mendel can be compiled to low level subsets of JavaScript and C.

Mendel is a project created in [HackOHI/O](http://hack.osu.edu/). For more information about the project and out team, visit our [presentation](http://go.osu.edu/intro2mendel).

Key features of Mendel Programming Language:

* Templete-based generic
* Prototype-based OOP
* Multi-paradigm: Proc + Func + OO
* Static & strong typing
* Full type inference
* Clean, modern and flexible design
* Compliered to JavaScript & C
* Simple enough to be built in 24 hours

## Getting Started

### Requirements

Currently, the Mendel compiler runs on [Node.js](https://nodejs.org/). You can download its installer on the official website. It is also available in software repository package and source code.

Since you are here, you may already have [Git](https://www.git-scm.com/) installed. [Npm](https://www.npmjs.com/) is another a useful tool to install required libraries.

[PEG.js](http://pegjs.org/) is required for running the compiler. You can download it on the website or install it via npm:

```bash
$ npm install pegjs
```

For users on Microsoft Windows, it might be helpful to have a terminal emulator and a shell (like [PowerShell](https://microsoft.com/powershell)) on your computer.

### Setup

To download the source repository of the Mendel compiler, run the following command:

```bash
$ git clone https://github.com/hczhcz/mendel-lang.git
```

## Code Examples

### "Hello, World!"

```
write("Hello, World!");
```

Output:

```
Hello, World!
```

### Statements and Expressions

```
const a = 1;
const b = 2;
write(a + b);
```

Output:

```
3
```

### Generic

```
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

### Object

```
func newUser(id, var name) {
    return __self;
}

const user = newUser(42, "Foo");

write(user.id);
write(user.name);

user.name = "Bar";

write(user.name);
```

Output:

```
42
Foo
Bar
```

## Contributing

Contributions to the Mendel are always welcomed, no matter what form and size the contribution is. Welcome to open a [pull request](https://github.com/hczhcz/mendel-lang/pulls). If you are adding new feature or making some changes on the language design, opening an [issue](https://github.com/hczhcz/mendel-lang/issues) before coding would be a good practice.

If you have any question, feel free to contact the development team by opening an [issue](https://github.com/hczhcz/mendel-lang/issues) with "question" label.

## License

The Mendel project, including complier and standard library, is released under MIT License. You can use any license for your own use, while the official repository will probably not introduce any other licenses.

> The MIT License (MIT)
>
> Copyright (c) 2016 Mendel Development Team
>
> Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
