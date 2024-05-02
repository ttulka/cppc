const cppc = require('./cppc')

test('error: empty program', () => {
    expect(() => cppc('')).toThrow()
})

test('error: no 4-tuples', () => {
    expect(() => cppc('.')).toThrow()
    expect(() => cppc(':')).toThrow()
    expect(() => cppc('..')).toThrow()
    expect(() => cppc('::')).toThrow()
    expect(() => cppc('...')).toThrow()
    expect(() => cppc(':::')).toThrow()
    expect(() => cppc('.... .')).toThrow()
    expect(() => cppc(':::: :')).toThrow()
    expect(() => cppc('.... ..')).toThrow()
    expect(() => cppc(':::: ::')).toThrow()
    expect(() => cppc('.... ...')).toThrow()
    expect(() => cppc(':::: :::')).toThrow()
})

test('error: ill-formed loops', () => {
    expect(() => cppc('...:')).toThrow()
    expect(() => cppc(':...')).toThrow()
    expect(() => cppc(':..: :...')).toThrow()
    expect(() => cppc(':... ...: :...')).toThrow()
    expect(() => cppc(':... ...: ...:')).toThrow()
})

test('max steps: infinite loops', () => {
    expect(() => cppc(':..:')).toThrow()
    expect(() => cppc('::::')).toThrow()
    expect(() => cppc(':... ...:')).toThrow()
    expect(() => cppc(':... .... ...:')).toThrow()
})

test('increment', () => {
    expect(cppc('.:..')).toStrictEqual([1, 0, 0, 0])
    expect(cppc('.:.. .:..')).toStrictEqual([1, 1, 0, 0])
    expect(cppc('.:.. .:.. .:..')).toStrictEqual([1, 1, 1, 0])
    expect(cppc('.:.. .:.. .:..')).toStrictEqual([1, 1, 1, 0])
    expect(cppc('.:.. .:.. .:.. .:..')).toStrictEqual([1, 1, 1, 1])
    expect(cppc('.:.. .:.. .:.. .:.. .:..')).toStrictEqual([2, 1, 1, 1])
    expect(cppc('.:.. .:.. .:.. .:.. .:.. .:..')).toStrictEqual([2, 2, 1, 1])
    expect(cppc('.:.. .:.. .:.. .:.. .:.. .:.. .:..')).toStrictEqual([2, 2, 2, 1])
    expect(cppc('.:.. .:.. .:.. .:.. .:.. .:.. .:.. .:..')).toStrictEqual([2, 2, 2, 2])
})

test('decrement', () => {
    expect(cppc('..:.')).toStrictEqual([0, 0, 0, 0])
    expect(cppc('..:. ..:.')).toStrictEqual([0, 0, 0, 0])
    expect(cppc('.:.. .:.. ..:.')).toStrictEqual([1, 1, 0, 0])
    expect(cppc('.:.. .... ..:.')).toStrictEqual([1, 0, 0, 0])
    expect(cppc('.:.. .:.. ..:.')).toStrictEqual([1, 1, 0, 0])
    expect(cppc('.:.. .:.. .:.. .:.. .:.. ..:.')).toStrictEqual([2, 0, 1, 1])
    expect(cppc('.:.. .:.. .:.. .:.. .:.. ..:. ..:.')).toStrictEqual([2, 0, 0, 1])
    expect(cppc('.:.. .:.. .:.. .:.. .:.. ..:. ..:. ..:.')).toStrictEqual([2, 0, 0, 0])
    expect(cppc('.:.. .:.. .:.. .:.. .:.. ..:. ..:. ..:. ..:.')).toStrictEqual([1, 0, 0, 0])
})

test('loop', () => {
    expect(cppc(':..:', 1)).toStrictEqual([1, 0, 0, 0])
    expect(cppc('::.:', 1)).toStrictEqual([1, 0, 0, 0])
    expect(cppc('::.:')).toStrictEqual([1, 0, 0, 0])
    expect(cppc('::.:')).toStrictEqual([1, 0, 0, 0])
    expect(cppc('::.. ...:')).toStrictEqual([1, 0, 0, 0])
    expect(cppc('::.. .:.:')).toStrictEqual([1, 1, 0, 0])
    expect(cppc('::.. .:.. ...:')).toStrictEqual([1, 1, 0, 0])
    expect(cppc('::.: .:..')).toStrictEqual([1, 1, 0, 0])
    expect(cppc('::.. .:.. .:.. ...:')).toStrictEqual([1, 1, 1, 0])
    expect(cppc('::.. .:.. .:.. .:.:')).toStrictEqual([1, 1, 1, 1])
    expect(cppc(':... .... .... .... .:.:')).toStrictEqual([1, 0, 0, 0])
    expect(cppc(':... .:.. .... .... .:.:')).toStrictEqual([1, 1, 0, 0])
})

test('nested loop', () => {
    expect(cppc('::.. ::.. ...: .... ...:')).toStrictEqual([1, 1, 0, 0])
    expect(cppc(':... ::.. ...: .... .:.:')).toStrictEqual([1, 1, 0, 0])
    expect(cppc('::.. ::.. ...: .... .:.:')).toStrictEqual([2, 1, 0, 0])
    expect(cppc('::.. ::.. ::.. ...: ...: ...:')).toStrictEqual([1, 1, 1, 0])
    expect(cppc('::.. ::.. ...: ::.. ...: ...:')).toStrictEqual([1, 1, 0, 1])
    expect(cppc('::.. .... .... .... :... .:.. ...: ...:')).toStrictEqual([1, 0, 0, 0])
    expect(cppc(':... .... .... .... ::.. .:.. ...: ...:')).toStrictEqual([1, 1, 0, 0])
    expect(cppc(':... .... .... .... :... .... .... .... .:.: ...:')).toStrictEqual([1, 0, 0, 0])
    expect(cppc(':... .... .... .... :... .... .... .... .:.: .:.:')).toStrictEqual([1, 1, 0, 0])
    expect(cppc(':... .... .... .... :... .... .... .... .:.: .... .... .... .:.:')).toStrictEqual([2, 0, 0, 0])
})

test('clear', () => {
    const clear = `
        .... .... :... ....
        :... .... .:.. ....
        .:.: .... .... ....
        ..:: .... ..:. ....
    `
    expect(cppc(clear)).toStrictEqual([0, 0, 0, 0])
    expect(cppc(clear, 1)).toStrictEqual([0, 0, 0, 0])
    expect(cppc(clear, 42)).toStrictEqual([0, 0, 0, 0])
})

test('move', () => {
    const move = `
        .... .... :... ....
        .... :... .:.. ....
        .... .:.: .... ....
        .:.. ..:. ...: ....
        ..:. ..:. ..:. ....
    `
    expect(cppc(move)).toStrictEqual([0, 0, 0, 0])
    expect(cppc(move, 1, 0)).toStrictEqual([1, 0, 0, 0])
    expect(cppc(move, 0, 1)).toStrictEqual([1, 0, 0, 0])
    expect(cppc(move, 42, 0)).toStrictEqual([42, 0, 0, 0])
    expect(cppc(move, 0, 42)).toStrictEqual([42, 0, 0, 0])
    expect(cppc(move, 42, 123)).toStrictEqual([165, 0, 0, 0])
})

test('copy', () => {
    const copy = `
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
    `
    expect(cppc(copy)).toStrictEqual([0, 0, 0, 0])
    expect(cppc(copy, 1)).toStrictEqual([1, 1, 0, 0])
    expect(cppc(copy, 42)).toStrictEqual([42, 42, 0, 0])
    expect(cppc(copy, 42, 42)).toStrictEqual([42, 84, 0, 0])
})

test('switch', () => {
    const switc = `
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
    `
    expect(cppc(switc)).toStrictEqual([0, 0, 0, 0])
    expect(cppc(switc, 1, 0)).toStrictEqual([0, 1, 0, 0])
    expect(cppc(switc, 0, 1)).toStrictEqual([1, 0, 0, 0])
    expect(cppc(switc, 42, 0)).toStrictEqual([0, 42, 0, 0])
    expect(cppc(switc, 0, 42)).toStrictEqual([42, 0, 0, 0])
})

test('fibonacci', () => {
    const fibonacci = `
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
    `
    const results = [1] // start with 1 not have to deal with 1 1 subsequence
    let last = 0
    const onStepFinished = (_, regs) => {
        if (regs[0] < last) {   // another item in the sequence is ready
            if (regs[0] > results[results.length - 1])
                results.push(regs[0])
        }
        last = regs[0]        
    }
    cppc(fibonacci, 0, 0, 0, 0, 1000, onStepFinished)

    console.log(results)
    expect(results.slice(0, 6)).toStrictEqual([1, 2, 3, 5, 8, 13])
})

test('Hello World', () => {
    const hello = `
        .:.. .:.. .:.. .:..
        .:.. .:.. .:.. .:..
        .:.. .:.. .:.. .:..
        .:.. .:.. .:.. .:..
        .:.. .:.. .:.. .:..
        .:.. .:.. .:.. .:..
        .:.. .:.. .:.. .:..
        .:.. .:.. .:.. .:..
        .:.. .:.. .:.. .:..
        .:.. .:.. .:.. .:..
        .:.. .:.. .:.. .:..
        .:.. .:.. .:.. .:..
        .:.. .:.. .:.. .:..
        .:.. .:.. .:.. .:..
        .:.. .:.. .:.. .:..
        .:.. .:.. .:.. .:..
        .:.. .:.. .:.. .:..
        .:.. .:.. .:.. .:..
        .:.. .:.. .:.. .:..
        .:.. .:.. .:.. .:..
        .:.. .:.. .:.. .:..
        .:.. .:.. .:.. .:..
        .:.. .:.. .:.. .:..
        .:.. .:.. .:.. .:..
        .:.. .:.. .:.. .:..
        .:.. .:.. .:.. .:..
        .:.. .:.. .:.. .:..
        .:.. .:.. .:.. .:..
        .:.. .:.. .:.. .:..
        .:.. .:.. .:.. .:..
        .:.. .:.. .:.. .:..
        .:.. .:.. .:.. .:..
        .:.. .:.. .:.. .:..
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .:.. .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .:.. .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .:.. ....
    `
    const result = cppc(hello)
    expect(result).toStrictEqual([212, 296, 494, 33])

    let str = result[0].toString(2) + result[1].toString(2) + result[2].toString(2) + result[3].toString(2)
    str = '0'.repeat(3 - str.length % 3) + str // align to 3-tuples 
    console.log(str)

    const alphabet = []
    alphabet['000'] = ' '
    alphabet['001'] = 'd'
    alphabet['010'] = 'e'
    alphabet['011'] = 'H'
    alphabet['100'] = 'l'
    alphabet['101'] = 'o'
    alphabet['110'] = 'r'
    alphabet['111'] = 'W'

    let msg = ''
    for (let i = 0; i < str.length; i += 3) {
        const ch = str.substring(i, i + 3)
        msg += alphabet[ch]
    }

    expect(msg).toEqual('Hello World')
})

test('while r(x)', () => {   /* r == A */
    const whil = `
        :... .... .:.. ....
        .:.: .... .... ....
        ..:. .... :... ....
        .:.. .... .... ....

        ..:. .:.. .... ....  x = A- B+

        :... .... .:.. ....
        .:.: .... .... ....
        ..:: .... ..:. ....
    `
    expect(cppc(whil)).toStrictEqual([0, 0, 0, 0])
    expect(cppc(whil, 1)).toStrictEqual([0, 1, 0, 0])
    expect(cppc(whil, 3)).toStrictEqual([0, 3, 0, 0])
    expect(cppc(whil, 42)).toStrictEqual([0, 42, 0, 0])
})

test('if-else r{x|y}', () => {   /* r == A */
    const ifelse = `
        :... .... .... ....

        .... .:.. .... ....  x = B+

        .:.. .... .:.: ....
        ..:. .... :... ....
        .:.. .... .... ....

        .... .... .... .:..  y = D+

        .... .... .:.: ....
        .... .... ..:. ....
    `
    expect(cppc(ifelse, 0)).toStrictEqual([0, 1, 0, 0])
    expect(cppc(ifelse, 1)).toStrictEqual([1, 0, 0, 1])
    expect(cppc(ifelse, 42)).toStrictEqual([42, 0, 0, 1])
})

test('program machine', () => {
    const pmachine = `
        .... .... .... .:..     D+

        .... .... .... :...     while D > 0
        .... .... .:.. .:.:
        .... .... .... ..:.
        .... .... :... .:..

        .... .... :... ....     1 match?
        .... .... .... ..:.     D-
        .... .... .... :...     

        :... .... .... ....     A{ D+ D+ D+ | D+ D+ }
        
        .... .... .... .:..     D+ D+ D+
        .... .... .... .:..
        .... .... .... .:..

        .:.. .... .:.: ....
        ..:. .... :... ....
        .:.. .... .... ....
        
        .... .... .... .:..     D+ D+
        .... .... .... .:..

        .... .... .:.: ....     end if-else
        .... .... ..:. ....     

        .... .... .:.. ....     C+ C+ C+ D+] D- C[ D+ D+       C+] ] C-
        .... .... .:.. ....
        .... .... .:.. ....
        .... .... .... .:.:
        .... .... .... ..:.
        .... .... :... .:..     
        .... .... .... .:..     D+
        .... .... .:.: ...:
        .... .... ..:. ....

        .... .... :... ....     2 match?
        .... .... .... ..:.     D-
        .... .... .... ..:.     D-
        .... .... .... :...     

        ..:. .... .... .:..     A- D+ 

        .... .... .:.. ....     C+ C+ D+] D- C[ D+ D+       C+] ] C-
        .... .... .:.. ....
        .... .... .... .:.:
        .... .... .... ..:.
        .... .... :... .:..     
        .... .... .... .:..     D+
        .... .... .... .:..     D+
        .... .... .:.: ...:
        .... .... ..:. ....

        .... .... :... ....     3 match?
        .... .... .... ..:.     D-
        .... .... .... ..:.     D-
        .... .... .... ..:.     D-
        .... .... .... :...     

        .:.. .... .... ....     A+ (D remains 0)

        .... .... .:.. ....     C+ C+ D+] D- C[ D+ D+       C+] ] C-
        .... .... .:.. ....
        .... .... .... .:.:
        .... .... .... ..:.
        .... .... :... .:..     
        .... .... .... .:..     D+
        .... .... .... .:..     D+
        .... .... .... .:..     D+
        .... .... .:.: ...:
        .... .... ..:. ....
        
        .... .... ..:. ....     C-  reset search

        .... .... .... :...     end while
        .... .... .:.. .:.:
        .... .... .... ..::
        .... .... ..:. ....

    `
    expect(cppc(pmachine, 0)).toStrictEqual([1, 0, 0, 0])
    expect(cppc(pmachine, 1)).toStrictEqual([1, 0, 0, 0])
    expect(cppc(pmachine, 3)).toStrictEqual([1, 0, 0, 0])
    expect(cppc(pmachine, 42)).toStrictEqual([1, 0, 0, 0])
})