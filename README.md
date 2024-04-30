# :..:

:..: (colon period period colon) is an esoteric programming language
 based on the manipulation of four unbounded integer registers.

## Language

### Syntax

A program in :..:

1. Consists only of the symbols `:` (colon) and `.` (period); all other symbols are ignored.
2. Is a sequence of 4-tuples that form program instructions (the program length % 4 == 0).
3. Has a length greater than zero (at least one 4-tuple).

### Semantics

#### Registers

Each 4-tuple reads or manipulates one of the four registers *A*, *B*, *C*, *D*.

The current register is determined by the index of the instruction in the program code.
 For instance, the first instruction works with *A*, fourth with *D*, fifth with *A*, and so on.

#### Instructions

Four possible instructions can be formed based on the position of the colon in a 4-tuple:

| Instruction | Name | Meaning | Code |
| :---------: | ---- | ------- | ---- |
|   | Noop | Do nothing | `....` |
| + | Increment | Increments the current register value | `.:..` |
| - | Decrement | Decrements the current register value | `..:.` |
| [ | Loop begin | Jumps to the loop end if the current register value is not zero | `:...` |
| ] | Loop end | Jumps to the paring [ | `...:` |

Instructions [ and ] are paired, meaning each [ must have a following ] and vice versa.

Instructions can be combined into compact ones. For instance, the 4-tuple 
 `::..` contains both instructions [ (loop begin) and + (increment). 
 Compact instructions are executed in the order they appear in the 4-tuple.

## Examples

### No-op program

Does nothing:

```cppc
....
```

### Infinite loop

Loops forever:

```cppc
:..:
```

Alternativelly:

```cppc
::::
```

### Clear

Sets register *A* to zero:

```cppc
.... .... :... ....
:... .... .:.. ....
.:.: .... .... ....
..:: .... ..:. .... 
```

The program reads as follows: 

```
C[ A[ C+ A+] A-] C-
```

### Move

Moves register *B* to register *A*:

```cppc
.... .... :... ....
.... :... .:.. ....
.... .:.: .... ....
.:.. ..:. ...: ....
..:. ..:. ..:. ....
```

The program reads as follows: 

```
C[ B[ C+ B+] A+ B- C] A- B- C-
```

### Copy

Copies register *A* to register *B*:

```cppc
.... .... :... ....
:... .... .:.. ....
.:.: .... .... ....
..:. .:.. .... .:.:
.... ..:. ..:. ..:.
.... .... :... :...
.... .... .:.. .:.:
.... .... .... ..:.
.:.: .... .... ....
..:. .... ..:. ....
```

The program reads as follows: 

```
C[ A[ C+ A+] A- B+ D+] B- C- D- 
C[ D[ C+ D+] D- A+] A- C-
```

### Switch

Switches register *A* with register *B*:

```cppc
.... .... :... ....
::.. .... .:.: .:..
..:: .... ..:. ..:.
.... .... :... ....
.... ::.. .:.: ....
.:.. ..:: ..:. ....
..:. .... :... ::..
.... .... .:.: ..:.
.... .:.: ..:. ....
.... ..:. .... ....
```

The program reads as follows: 

```
C[ A[ A+ C+] D+ A-] C- D-   move A to D
C[ B[ B+ C+] A+ B-] C- A-   move B to A
C[ D[ D+ C+] D- B+] C- B-   move D to B
```

### Fibonacci sequence

Computes the sequence in register *A*:

```cppc
.... .:.. :... ....
.... .... :... ....
::.. .... .:.: .:..
..:: .... ..:. ..:.
.... .... :... ....
.... ::.. .:.: ....
.:.. ..:: ..:. ....
..:. .... :... ::..
.... .... .:.: ..:.
.... .:.: ..:. ....
.... ..:. :... ....
::.. .... .:.: .:..
..:. .:.: ..:. ..:.
.... ..:. :... ::..
.... .... .:.: ..:.
.:.: .... ..:. ....
..:: .... .... ....
```

The program reads as follows: 

```
B+                              init 0 1 0 0
C[                              loop forever
    C[ A[ A+ C+] D+ A-] C- D-   move A to D
    C[ B[ B+ C+] A+ B-] C- A-   move B to A
    C[ D[ D+ C+] D- B+] C- B-   move D to B
    C[ A[ A+ C+] D+ A- B+] C- D- B- 
    C[ D[ D+ C+] D- A+] C- A-   copy A to B
]
```

### Hello World

For computing "Hello World," we need to interpret integers in registers as a string.
 We can achieve this by defining an alphabet and concatenating register values.

| Symbol | Binary |
| ------ | ------ |
| ` `    | 000    |
| `d`    | 001    |
| `e`    | 010    |
| `H`    | 011    |
| `l`    | 100    |
| `o`    | 101    |
| `r`    | 110    |
| `W`    | 111    |

Registers must contain the following values:

| Register | Binary    | Decimal | Interpreted |
| -------- | --------- | ------- | ----------- |
| *A*      | 011010100 | 212     | Hel         |
| *B*      | 100101000 | 296     | lo          |
| *C*      | 111101110 | 494     | Wor         |
| *D*      | 100001    | 33      | ld          |


Shortened code:

```cppc
.:.. .:.. .:.. .:..     33 times
.:.. .:.. .:.. ....    179 times
.... .:.. .:.. ....     84 times
.... .... .:.. ....    198 times
```

## Turing completeness

:..: is intuitively Turing-complete as it provides four unbounded registers
 (two have been proven to be sufficient), elementary arithmetics, and while loops.

A concrete proof is still to be done.

## JavaScript interpreter

```sh
npm i cppc
```

```js
const cppc = require('cppc')

// [2, 0, 1, 1]
cppc(`.:...:...:...:...:....:.`)

```

## License

[MIT](LICENSE)
