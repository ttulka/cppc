const MAX_STEPS = 100000

const interpret = (program, regA, regB, regC, regD, maxSteps, onStepFinished) => {
    // initialize
    const p = parse(program)
    const r = [regA ? regA : 0, regB ? regB : 0, regC ? regC : 0, regD ? regD : 0]
    const ms = maxSteps > 0 ? maxSteps : MAX_STEPS

    // execute
    let pc = 0   // program counter
    let sc = 0   // step counter
    while (pc < p.length && sc <= ms) {
        const inst = p[pc]
        const regi = registerIndex(inst.regname)

        switch (inst.cmd) {
            case '+': {
                r[regi]++
                pc++
                break;
            }
            case '-': {
                if (r[regi] > 0) r[regi]--
                pc++
                break;
            }
            case '[': {
                if (r[regi] > 0) pc = findNextLoopEnd(p, pc) + 1
                else pc++
                break;
            }
            case ']': {
                pc = findPreviousLoopStart(p, pc)
                break;
            }
        }

        if (onStepFinished) onStepFinished(sc, [...r])
        sc++
    }

    if (sc > MAX_STEPS) throw new Error('Maximal steps exceeded')

    return r

    function findPreviousLoopStart(p, pc) {
        let pairs = 0
        while (pc > 0) {
            pc--
            if (p[pc].cmd === ']') pairs++
            if (p[pc].cmd === '[') {
                if (!pairs) return pc
                pairs--
            }
        }
        throw new Error('Loop start not found')
    }

    function findNextLoopEnd(p, pc) {
        let pairs = 0
        while (pc < p.length - 1) {
            pc++
            if (p[pc].cmd === '[') pairs++
            if (p[pc].cmd === ']') {
                if (!pairs) return pc
                pairs--
            }
        }
        throw new Error('Loop end not found')
    }
}

// parse the program to AST of tuples[id, register, instruction]
function parse(program) {    
    const source = program
        .replaceAll(/[^\.:]/g, '') // remove all except : and .
        .split('') // to array

    if (!source.length) throw new Error('Syntax error: program must consist of at least one 4-tuple')
    if (source.length % 4 !== 0) throw new Error('Syntax error: program length must be a sequence of 4-tuples')

    const ast = []
    let open = 0 // count of open loops
    for (let i = 0; i < source.length; i += 4) {
        const tuple = source.slice(i, i + 4)
        const regname = registerName(i / 4)
        if (tuple[0] === ':') ast.push(new Instr(regname, '['))
        if (tuple[1] === ':') ast.push(new Instr(regname, '+'))
        if (tuple[2] === ':') ast.push(new Instr(regname, '-'))
        if (tuple[3] === ':') ast.push(new Instr(regname, ']'))

        // check loops are paired
        if (tuple[0] === ':') open++
        if (tuple[3] === ':') open--
        if (open < 0) throw new Error('Syntax error: missing loop start at ' + i)
    }

    if (open) throw new Error('Syntax error: missing loop end(s)')

    return ast
}

function registerName(index) {
    switch (index % 4) {
        case 0: return 'A'
        case 1: return 'B'
        case 2: return 'C'
        case 3: return 'D'
    }
}

function registerIndex(regname) {
    switch (regname) {
        case 'A': return 0
        case 'B': return 1
        case 'C': return 2
        case 'D': return 3
    }
    throw new Error('Unknown register ' + regname)
}

class Instr {
    constructor(regname, cmd) {
        this.regname = regname
        this.cmd = cmd
    }
}

module.exports = interpret