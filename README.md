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
|   | Noop | Does nothing | `....` |
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

For computing "Hello World" we need to interpret integers in registers as a string.
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
| *A*      | 011010100 | 212     | `Hel`       |
| *B*      | 100101000 | 296     | `lo `       |
| *C*      | 111101110 | 494     | `Wor `      |
| *D*      | 100001    | 33      | `ld`        |


Shortened code:

```cppc
.:.. .:.. .:.. .:..     33 times
.:.. .:.. .:.. ....    179 times
.... .:.. .:.. ....     84 times
.... .... .:.. ....    198 times
```

## Turing completeness

To demonstrate that :..: is Turing-complete, we can utilize the structured program theorem,
 which asserts that sequence, selection, and repetition are adequate constructs
 to construct any computer program.

The proof (the folk version) is as follows (pseudocode):

```
pc = 1
while (pc > 0) {
    if (pc == 1) {
        perform step <1>
        pc = next step
    }    
    ...
    if (pc == n) {
        perform step <n>
        pc = next step
    }
}
```

First, we define new  convenient flow control constructs for selection and repetition:

| Construct | Name | Meaning |
| --------- | ---- | ------- |
| r(x)    | Repetition (WHILE) | Repeat *x* while register *r* is not zero |
| r{x\|y}  | Selection (IF-ELSE) | Execute *x* if register *r* is zero, *y* otherwise |

```
r(x) =

r[ C+ r+] r-
C[ r+ <x> r[ C+ r+] r-]
C-
```

```
r{x|y} =

r[ <x> r+ C+] r-
C[ r+ <y> C+]
C-
```

(Because register *C* is used as auxiliary, *r* can only be *A*, *B*, or *D*.)

Having the selection and repetition in place, we can translate any program workflow into a :..: program.
 As an example, we will demonstrate a translation of a register machine, as register machines
 with just two registers were proven to be Turing equivalent.

We will use an instruction set of a *program machine*: INC/+, DEC/-, JZ/0
 (increment, decrement, jump if zero) with program registers *A* and *B*.

(Registers *C* and *D* are auxiliary and must not be used by the simulated program.)

An example program for clearing register *A* and setting it to 1 reads as follows:

```
Instr.

1.      (A0)
       ↗ |  \0
       \ ↓   \
2.      (A-)  |
             /
            ↙ 
3.      (A+)

```

The corresponding :..: program is as follows:

```
D+      init pc (D) to 1
D(      while pc > 0
                              found                       not found
                ..................................    ..................
    C[ D-       D[ A{ D+ D+ D+ | D+ D+ } C+ C+ D+] D- C[ D+ D+       C+] ] C-
    C[ D- D-    D[ A- D+                 C+ C+ D+] D- C[ D+ D+ D+    C+] ] C-
    C[ D- D- D- D[ A+                    C+ C+ D+] D- C[ D+ D+ D+ D+ C+] ] C-
       ........    .....................    ..              ........
       match pc    perform & update pc      break search    reset pc

    C-  reset search
)
```

We use register *D* as the program counter (`pc`). 
 In the main loop we search for the n-th instruction by decrementing *D* n times.
 If it matches, we perform the instruction, update the program counter, and
 break the search by setting *C* to one.

The :..: code reads as follows:

```cppc
.... .... .... .:..
.... .... .... :...
.... .... .:.. .:.:
.... .... .... ..:.
.... .... :... .:..
.... .... :... ....
.... .... .... ..:.
.... .... .... :...
:... .... .... ....
.... .... .... .:..
.... .... .... .:..
.... .... .... .:..
.:.. .... .:.: ....
..:. .... :... ....
.:.. .... .... ....
.... .... .... .:..
.... .... .... .:..
.... .... .:.: ....
.... .... ..:. ....
.... .... .:.. ....
.... .... .:.. ....
.... .... .:.. ....
.... .... .... .:.:
.... .... .... ..:.
.... .... :... .:..
.... .... .... .:..
.... .... .:.: ...:
.... .... ..:. ....
.... .... :... ....
.... .... .... ..:.
.... .... .... ..:.
.... .... .... :...
..:. .... .... .:..
.... .... .:.. ....
.... .... .:.. ....
.... .... .... .:.:
.... .... .... ..:.
.... .... :... .:..
.... .... .... .:..
.... .... .... .:..
.... .... .:.: ...:
.... .... ..:. ....
.... .... :... ....
.... .... .... ..:.
.... .... .... ..:.
.... .... .... ..:.
.... .... .... :...
.:.. .... .... ....
.... .... .:.. ....
.... .... .:.. ....
.... .... .... .:.:
.... .... .... ..:.
.... .... :... .:..
.... .... .... .:..
.... .... .... .:..
.... .... .... .:..
.... .... .:.: ...:
.... .... ..:. ....
.... .... ..:. ....
.... .... .... :...
.... .... .:.. .:.:
.... .... .... ..::
.... .... ..:. ....
```

Similarly, we can easily translate any register machine to :..: proving it Turing-complete.

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
