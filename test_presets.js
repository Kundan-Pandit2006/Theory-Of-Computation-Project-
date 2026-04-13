// ─── Turing Machine Preset Test Runner v3 ───
function parseRules(rulesText) {
  const rules = {};
  for (const line of rulesText.split('\n')) {
    const t = line.trim(); if (!t) continue;
    const p = t.split(',').map(s => s.trim());
    if (p.length !== 5) continue;
    const [state, read, write, move, nextState] = p;
    if (!rules[state]) rules[state] = {};
    rules[state][read] = { write, move, nextState };
  }
  return rules;
}

function runTM(rules, tapeInput, maxSteps = 50000) {
  const PAD = 30;
  const input = tapeInput === '' ? ['_'] : tapeInput.split('');
  const tape = Array(PAD).fill('_').concat(input).concat(Array(PAD).fill('_'));
  let head = PAD, state = 'q0', steps = 0;
  while (steps < maxSteps) {
    const sym = tape[head] || '_';
    const sr = rules[state]; if (!sr) break;
    const rule = sr[sym]; if (!rule) break;
    tape[head] = rule.write;
    state = rule.nextState;
    head += rule.move === 'R' ? 1 : -1;
    steps++;
    if (head < 2) { tape.unshift(...Array(10).fill('_')); head += 10; }
    if (head >= tape.length - 2) tape.push(...Array(10).fill('_'));
    const sl = state.toLowerCase();
    if (sl.includes('stop') || sl.includes('halt') || sl.includes('accept') || sl.includes('reject')) break;
  }
  const sl = state.toLowerCase();
  let result = sl.includes('accept') ? 'accept' : sl.includes('reject') ? 'reject' : (sl.includes('stop') || sl.includes('halt')) ? 'halt' : 'timeout';
  const tapeStr = tape.join('').replace(/^_+/, '').replace(/_+$/, '') || '';
  return { state, result, tape: tapeStr, steps };
}

const tests = [
  { name: 'increment',
    rules: `q0, 0, 0, R, q0\nq0, 1, 1, R, q0\nq0, _, _, L, q1\nq1, 0, 1, L, qStop\nq1, 1, 0, L, q1\nq1, _, 1, L, qStop`,
    cases: [
      { input: '1011', expect: 'halt', tapeContains: '1100' },
      { input: '0', expect: 'halt', tapeContains: '1' },
      { input: '111', expect: 'halt', tapeContains: '1000' },
    ]},
  { name: 'decrement',
    rules: `q0, 0, 0, R, q0\nq0, 1, 1, R, q0\nq0, _, _, L, q1\nq1, 1, 0, L, qStop\nq1, 0, 1, L, q1\nq1, _, _, R, qStop`,
    cases: [
      { input: '1100', expect: 'halt', tapeContains: '1011' },
      { input: '1', expect: 'halt', tapeContains: '0' },
    ]},
  { name: 'onesComp',
    rules: `q0, 0, 1, R, q0\nq0, 1, 0, R, q0\nq0, _, _, L, qStop`,
    cases: [
      { input: '101100', expect: 'halt', tapeContains: '010011' },
      { input: '0000', expect: 'halt', tapeContains: '1111' },
    ]},
  { name: 'palindrome',
    rules: `q0, 0, X, R, q1\nq0, 1, X, R, q3\nq0, X, X, R, q0\nq0, Y, Y, R, q0\nq0, _, _, R, qAccept\nq1, 0, 0, R, q1\nq1, 1, 1, R, q1\nq1, Y, Y, R, q1\nq1, _, _, L, q2\nq2, 0, Y, L, q5\nq2, 1, 1, L, qReject\nq2, Y, Y, L, q2\nq2, X, X, R, qAccept\nq3, 0, 0, R, q3\nq3, 1, 1, R, q3\nq3, Y, Y, R, q3\nq3, _, _, L, q4\nq4, 1, Y, L, q5\nq4, 0, 0, L, qReject\nq4, Y, Y, L, q4\nq4, X, X, R, qAccept\nq5, 0, 0, L, q5\nq5, 1, 1, L, q5\nq5, Y, Y, L, q5\nq5, X, X, L, q5\nq5, _, _, R, q0`,
    cases: [
      { input: '1001', expect: 'accept' }, { input: '010', expect: 'accept' },
      { input: '1', expect: 'accept' }, { input: '11', expect: 'accept' },
      { input: '1010', expect: 'reject' }, { input: '100', expect: 'reject' },
    ]},
  { name: 'unaryAdd',
    rules: `q0, 1, 1, R, q0\nq0, +, 1, R, q1\nq1, 1, 1, R, q1\nq1, _, _, L, q2\nq2, 1, _, L, qStop`,
    cases: [
      { input: '111+1111', expect: 'halt', tapeContains: '1111111' },
      { input: '1+1', expect: 'halt', tapeContains: '11' },
    ]},
  { name: 'anbn',
    rules: `q0, a, X, R, q1\nq0, Y, Y, R, q3\nq0, _, _, R, qAccept\nq1, a, a, R, q1\nq1, Y, Y, R, q1\nq1, b, Y, L, q2\nq1, _, _, R, qReject\nq2, a, a, L, q2\nq2, Y, Y, L, q2\nq2, X, X, R, q0\nq3, Y, Y, R, q3\nq3, _, _, R, qAccept\nq3, b, b, R, qReject`,
    cases: [
      { input: 'aaabbb', expect: 'accept' }, { input: 'ab', expect: 'accept' },
      { input: 'aabb', expect: 'accept' }, { input: '', expect: 'accept' },
      { input: 'aab', expect: 'reject' }, { input: 'abb', expect: 'reject' },
    ]},
  { name: 'divBy3',
    rules: `q0, 1, 1, R, q1\nq0, _, _, R, qAccept\nq1, 1, 1, R, q2\nq1, _, _, R, qReject\nq2, 1, 1, R, q0\nq2, _, _, R, qReject`,
    cases: [
      { input: '111111', expect: 'accept' }, { input: '111', expect: 'accept' },
      { input: '', expect: 'accept' }, { input: '111111111', expect: 'accept' },
      { input: '1', expect: 'reject' }, { input: '11', expect: 'reject' },
      { input: '1111', expect: 'reject' }, { input: '11111', expect: 'reject' },
    ]},
  { name: 'evenOnes',
    rules: `q0, 0, 0, R, q0\nq0, 1, 1, R, q1\nq0, _, _, R, qAccept\nq1, 0, 0, R, q1\nq1, 1, 1, R, q0\nq1, _, _, R, qReject`,
    cases: [
      { input: '1010', expect: 'accept' }, { input: '1100', expect: 'accept' },
      { input: '0000', expect: 'accept' }, { input: '11', expect: 'accept' },
      { input: '1111', expect: 'accept' }, { input: '', expect: 'accept' },
      { input: '1', expect: 'reject' }, { input: '111', expect: 'reject' },
      { input: '10', expect: 'reject' },
    ]},
  { name: 'endsWith01',
    rules: `q0, 0, 0, R, q1\nq0, 1, 1, R, q0\nq0, _, _, R, qReject\nq1, 0, 0, R, q1\nq1, 1, 1, R, q2\nq1, _, _, R, qReject\nq2, 0, 0, R, q1\nq2, 1, 1, R, q0\nq2, _, _, R, qAccept`,
    cases: [
      { input: '1101', expect: 'accept' }, { input: '01', expect: 'accept' },
      { input: '0001', expect: 'accept' },
      { input: '10', expect: 'reject' }, { input: '11', expect: 'reject' },
      { input: '0', expect: 'reject' }, { input: '100', expect: 'reject' },
    ]},
  { name: 'contains101',
    rules: `q0, 0, 0, R, q0\nq0, 1, 1, R, q1\nq0, _, _, R, qReject\nq1, 0, 0, R, q2\nq1, 1, 1, R, q1\nq1, _, _, R, qReject\nq2, 0, 0, R, q0\nq2, 1, 1, R, qF\nq2, _, _, R, qReject\nqF, 0, 0, R, qF\nqF, 1, 1, R, qF\nqF, _, _, R, qAccept`,
    cases: [
      { input: '110101', expect: 'accept' }, { input: '101', expect: 'accept' },
      { input: '0101', expect: 'accept' },
      { input: '110', expect: 'reject' }, { input: '100', expect: 'reject' },
      { input: '11', expect: 'reject' },
    ]},
  { name: 'zerosOnes',
    rules: `q0, 0, 0, R, q0\nq0, 1, 1, R, q1\nq0, _, _, R, qAccept\nq1, 1, 1, R, q1\nq1, 0, 0, R, qReject\nq1, _, _, R, qAccept`,
    cases: [
      { input: '000111', expect: 'accept' }, { input: '0011', expect: 'accept' },
      { input: '0000', expect: 'accept' }, { input: '1111', expect: 'accept' },
      { input: '', expect: 'accept' },
      { input: '10', expect: 'reject' }, { input: '010', expect: 'reject' },
    ]},
  { name: 'equalZerosOnes',
    rules: `q0, X, X, R, q0\nq0, Y, Y, R, q0\nq0, 0, X, R, q1\nq0, 1, Y, R, q3\nq0, _, _, R, qAccept\nq1, 0, 0, R, q1\nq1, Y, Y, R, q1\nq1, 1, Y, L, q2\nq1, _, _, R, qReject\nq2, 0, 0, L, q2\nq2, Y, Y, L, q2\nq2, X, X, R, q0\nq3, 1, 1, R, q3\nq3, X, X, R, q3\nq3, 0, X, L, q4\nq3, _, _, R, qReject\nq4, 1, 1, L, q4\nq4, X, X, L, q4\nq4, Y, Y, R, q0`,
    cases: [
      { input: '1010', expect: 'accept' }, { input: '01', expect: 'accept' },
      { input: '0011', expect: 'accept' }, { input: '', expect: 'accept' },
      { input: '0', expect: 'reject' }, { input: '1', expect: 'reject' },
      { input: '001', expect: 'reject' },
    ]},
  { name: 'anbncn',
    rules: `q0, a, X, R, q1\nq0, Y, Y, R, q5\nq0, _, _, R, qAccept\nq1, a, a, R, q1\nq1, Y, Y, R, q1\nq1, b, Y, R, q2\nq1, _, _, R, qReject\nq2, b, b, R, q2\nq2, Z, Z, R, q2\nq2, c, Z, L, q3\nq2, _, _, R, qReject\nq3, a, a, L, q3\nq3, b, b, L, q3\nq3, Y, Y, L, q3\nq3, Z, Z, L, q3\nq3, X, X, R, q0\nq5, Y, Y, R, q5\nq5, Z, Z, R, q5\nq5, _, _, R, qAccept\nq5, a, a, R, qReject\nq5, b, b, R, qReject\nq5, c, c, R, qReject`,
    cases: [
      { input: 'aaabbbccc', expect: 'accept' }, { input: 'abc', expect: 'accept' },
      { input: 'aabbcc', expect: 'accept' }, { input: '', expect: 'accept' },
      { input: 'aabbc', expect: 'reject' }, { input: 'abcc', expect: 'reject' },
    ]},
  { name: 'divBy2',
    rules: `q0, 0, 0, R, q1\nq0, 1, 1, R, q2\nq0, _, _, R, qReject\nq1, 0, 0, R, q1\nq1, 1, 1, R, q2\nq1, _, _, R, qAccept\nq2, 0, 0, R, q1\nq2, 1, 1, R, q2\nq2, _, _, R, qReject`,
    cases: [
      { input: '1010', expect: 'accept' }, { input: '10', expect: 'accept' },
      { input: '0', expect: 'accept' },
      { input: '1', expect: 'reject' }, { input: '11', expect: 'reject' },
      { input: '101', expect: 'reject' },
    ]},
  { name: 'palindromeHash',
    rules: `q0, 0, X, R, q1\nq0, 1, X, R, q3\nq0, #, #, R, q7\nq1, 0, 0, R, q1\nq1, 1, 1, R, q1\nq1, #, #, R, q2\nq2, 0, 0, R, q2\nq2, 1, 1, R, q2\nq2, Y, Y, R, q2\nq2, _, _, L, q2B\nq2B, Y, Y, L, q2B\nq2B, 0, Y, L, q6\nq2B, 1, 1, L, qReject\nq2B, #, #, L, qReject\nq3, 0, 0, R, q3\nq3, 1, 1, R, q3\nq3, #, #, R, q4\nq4, 0, 0, R, q4\nq4, 1, 1, R, q4\nq4, Y, Y, R, q4\nq4, _, _, L, q4B\nq4B, Y, Y, L, q4B\nq4B, 1, Y, L, q6\nq4B, 0, 0, L, qReject\nq4B, #, #, L, qReject\nq6, 0, 0, L, q6\nq6, 1, 1, L, q6\nq6, Y, Y, L, q6\nq6, #, #, L, q6\nq6, X, X, R, q0\nq7, Y, Y, R, q7\nq7, _, _, R, qAccept\nq7, 0, 0, R, qReject\nq7, 1, 1, R, qReject`,
    cases: [
      { input: '101#101', expect: 'accept' },
      { input: '0#0', expect: 'accept' }, { input: '1#1', expect: 'accept' },
      { input: '11#11', expect: 'accept' }, { input: '#', expect: 'accept' },
      { input: '01#10', expect: 'accept' }, { input: '10#01', expect: 'accept' },
      { input: '1#0', expect: 'reject' }, { input: '0#1', expect: 'reject' },
      { input: '10#10', expect: 'reject' }, { input: '01#01', expect: 'reject' },
    ]},
  { name: 'doubleCount',
    rules: `q0, 0, 0, R, q0\nq0, X, X, R, q0\nq0, Y, Y, R, q0\nq0, 1, Y, L, qA\nq0, _, _, L, q4\nqA, 0, X, L, qB\nqA, X, X, L, qA\nqA, Y, Y, L, qA\nqA, _, _, R, qReject\nqB, 0, X, R, qC\nqB, X, X, L, qB\nqB, Y, Y, L, qB\nqB, _, _, R, qReject\nqC, 0, 0, R, qC\nqC, X, X, R, qC\nqC, Y, Y, R, qC\nqC, 1, Y, L, qA\nqC, _, _, L, q4\nq4, X, X, L, q4\nq4, Y, Y, L, q4\nq4, 0, 0, L, qReject\nq4, 1, 1, L, qReject\nq4, _, _, R, qAccept`,
    cases: [
      { input: '001', expect: 'accept' },        // 2 zeros, 1 one
      { input: '000011', expect: 'accept' },      // 4 zeros, 2 ones
      { input: '', expect: 'accept' },            // 0 = 2*0
      { input: '1', expect: 'reject' },           // 0 zeros, 1 one
      { input: '0', expect: 'reject' },           // 1 zero, 0 ones
      { input: '00001', expect: 'reject' },       // 4 ≠ 2*1
      { input: '01', expect: 'reject' },          // 1 ≠ 2*1
    ]},
  { name: 'unaryMul',
    rules: `q0, 1, 0, R, q1\nq0, *, *, R, q6\nq1, 1, 1, R, q1\nq1, *, *, R, q2\nq2, 1, X, L, q3\nq2, _, _, L, q5\nq2, X, X, R, q2\nq3, X, X, L, q3\nq3, *, *, L, q3\nq3, 1, 1, L, q3\nq3, 0, 0, L, q3\nq3, _, 1, R, q4\nq4, 0, 0, R, q4\nq4, 1, 1, R, q4\nq4, *, *, R, q2\nq5, X, 1, L, q5\nq5, *, *, L, q5\nq5, 1, 1, L, q5\nq5, 0, 0, R, q0\nq6, 1, _, R, q6\nq6, X, _, R, q6\nq6, _, _, L, qStop`,
    cases: [
      { input: '111*11', expect: 'halt', tapeContains: '111111' },
      { input: '11*11', expect: 'halt', tapeContains: '1111' },
      { input: '1*111', expect: 'halt', tapeContains: '111' },
      { input: '11*1', expect: 'halt', tapeContains: '11' },
    ]},
  { name: 'binaryAdd',
    rules: `q0, 0, 0, R, q0
q0, 1, 1, R, q0
q0, +, +, R, q0
q0, _, _, L, qDecB
qDecB, 1, 0, L, qGo
qDecB, 0, 1, L, qDecB
qDecB, +, +, R, qClnB
qGo, 0, 0, L, qGo
qGo, 1, 1, L, qGo
qGo, +, +, L, qIncA
qIncA, 0, 1, R, qLoop
qIncA, 1, 0, L, qIncA
qIncA, _, 1, R, qLoop
qLoop, 0, 0, R, qLoop
qLoop, 1, 1, R, qLoop
qLoop, +, +, R, qLoop
qLoop, _, _, L, qDecB
qClnB, 1, _, R, qClnB
qClnB, 0, _, R, qClnB
qClnB, _, _, L, qClnP
qClnP, _, _, L, qClnP
qClnP, +, _, R, qFin
qFin, _, _, L, qStop
qFin, 0, 0, R, qFin
qFin, 1, 1, R, qFin`,
    cases: [
      { input: '101+11', expect: 'halt', tapeContains: '1000' },   // 5+3=8
      { input: '1+1', expect: 'halt', tapeContains: '10' },        // 1+1=2
      { input: '11+1', expect: 'halt', tapeContains: '100' },      // 3+1=4
      { input: '10+10', expect: 'halt', tapeContains: '100' },     // 2+2=4
      { input: '111+1', expect: 'halt', tapeContains: '1000' },    // 7+1=8
    ]},
  { name: 'oddOnes',
    rules: `q0, 0, 0, R, q0\nq0, 1, 1, R, q1\nq0, _, _, R, qReject\nq1, 0, 0, R, q1\nq1, 1, 1, R, q0\nq1, _, _, R, qAccept`,
    cases: [ { input: '111', expect: 'accept' }, { input: '10', expect: 'accept' }, { input: '11', expect: 'reject' }, { input: '', expect: 'reject' } ]
  },
  { name: 'start0end1',
    rules: `q0, 0, 0, R, q1\nq0, 1, 1, R, qReject\nq0, _, _, R, qReject\nq1, 0, 0, R, q1\nq1, 1, 1, R, q2\nq1, _, _, R, qReject\nq2, 0, 0, R, q1\nq2, 1, 1, R, q2\nq2, _, _, R, qAccept`,
    cases: [ { input: '0101', expect: 'accept' }, { input: '01', expect: 'accept' }, { input: '00', expect: 'reject' }, { input: '101', expect: 'reject' } ]
  },
  { name: 'contains00or11',
    rules: `q0, 0, 0, R, q1\nq0, 1, 1, R, q2\nq0, _, _, R, qReject\nq1, 0, 0, R, qAccept\nq1, 1, 1, R, q2\nq1, _, _, R, qReject\nq2, 1, 1, R, qAccept\nq2, 0, 0, R, q1\nq2, _, _, R, qReject`,
    cases: [ { input: '1100', expect: 'accept' }, { input: '1010', expect: 'reject' }, { input: '1001', expect: 'accept' } ]
  },
  { name: 'noConsecutive1s',
    rules: `q0, 0, 0, R, q0\nq0, 1, 1, R, q1\nq0, _, _, R, qAccept\nq1, 0, 0, R, q0\nq1, 1, 1, R, qReject\nq1, _, _, R, qAccept`,
    cases: [ { input: '101010', expect: 'accept' }, { input: '110', expect: 'reject' }, { input: '00', expect: 'accept' } ]
  },
  { name: 'exactlyTwo1s',
    rules: `q0, 0, 0, R, q0\nq0, 1, 1, R, q1\nq0, _, _, R, qReject\nq1, 0, 0, R, q1\nq1, 1, 1, R, q2\nq1, _, _, R, qReject\nq2, 0, 0, R, q2\nq2, 1, 1, R, qReject\nq2, _, _, R, qAccept`,
    cases: [ { input: '1001', expect: 'accept' }, { input: '111', expect: 'reject' }, { input: '1', expect: 'reject' } ]
  },
  { name: 'evenLength',
    rules: `q0, 0, 0, R, q1\nq0, 1, 1, R, q1\nq0, _, _, R, qAccept\nq1, 0, 0, R, q0\nq1, 1, 1, R, q0\nq1, _, _, R, qReject`,
    cases: [ { input: '1010', expect: 'accept' }, { input: '1', expect: 'reject' }, { input: '', expect: 'accept' } ]
  },
  { name: 'lengthMod3',
    rules: `q0, 0, 0, R, q1\nq0, 1, 1, R, q1\nq0, _, _, R, qAccept\nq1, 0, 0, R, q2\nq1, 1, 1, R, q2\nq1, _, _, R, qReject\nq2, 0, 0, R, q0\nq2, 1, 1, R, q0\nq2, _, _, R, qReject`,
    cases: [ { input: '101010', expect: 'accept' }, { input: '11', expect: 'reject' }, { input: '', expect: 'accept' } ]
  },
  { name: 'moreZeros',
    rules: `q0, X, X, R, q0\nq0, Y, Y, R, q0\nq0, 0, X, R, q1\nq0, 1, Y, R, q3\nq0, _, _, R, qReject\nq1, 0, 0, R, q1\nq1, Y, Y, R, q1\nq1, 1, Y, L, q2\nq1, _, _, R, qAccept\nq3, 1, 1, R, q3\nq3, X, X, R, q3\nq3, Y, Y, R, q3\nq3, 0, X, L, q2\nq3, _, _, R, qReject\nq2, 0, 0, L, q2\nq2, 1, 1, L, q2\nq2, X, X, L, q2\nq2, Y, Y, L, q2\nq2, _, _, R, q0`,
    cases: [ { input: '0001', expect: 'accept' }, { input: '100', expect: 'accept' }, { input: '110', expect: 'reject' }, { input: '01', expect: 'reject' } ]
  },
  { name: 'reverseString',
    rules: `q0, 0, 0, R, q0\nq0, 1, 1, R, q0\nq0, _, #, L, qGet\nqGet, 0, #, R, qC0\nqGet, 1, #, R, qC1\nqGet, _, _, R, qClean\nqC0, #, #, R, qC0\nqC0, 0, 0, R, qC0\nqC0, 1, 1, R, qC0\nqC0, _, 0, L, qRet\nqC1, #, #, R, qC1\nqC1, 0, 0, R, qC1\nqC1, 1, 1, R, qC1\nqC1, _, 1, L, qRet\nqRet, 0, 0, L, qRet\nqRet, 1, 1, L, qRet\nqRet, #, #, L, qRet2\nqRet2, #, #, L, qRet2\nqRet2, 0, 0, R, qReady\nqRet2, 1, 1, R, qReady\nqRet2, _, _, R, qClean\nqReady, #, #, L, qGet\nqClean, #, _, R, qClean\nqClean, 0, 0, L, qStop\nqClean, 1, 1, L, qStop\nqClean, _, _, R, qStop`,
    cases: [ { input: '1011', expect: 'halt', tapeContains: '1101' }, { input: '1', expect: 'halt', tapeContains: '1' } ]
  },
  { name: 'replace0with1',
    rules: `q0, 0, 1, R, q0\nq0, 1, 1, R, q0\nq0, _, _, L, qStop`,
    cases: [ { input: '10010', expect: 'halt', tapeContains: '11111' } ]
  },
  { name: 'removeAll1s',
    rules: `q0, 0, 0, R, q0\nq0, 1, 1, R, q0\nq0, _, #, L, qRewind\nqRewind, 0, 0, L, qRewind\nqRewind, 1, 1, L, qRewind\nqRewind, _, _, R, qRead\nqRead, 1, _, R, qRead\nqRead, 0, _, R, qCopy0\nqRead, #, _, R, qStop\nqCopy0, 0, 0, R, qCopy0\nqCopy0, 1, 1, R, qCopy0\nqCopy0, #, #, R, qCopy0\nqCopy0, _, 0, L, qRet\nqRet, 0, 0, L, qRet\nqRet, 1, 1, L, qRet\nqRet, #, #, L, qRet\nqRet, _, _, R, qRead`,
    cases: [ { input: '101010', expect: 'halt', tapeContains: '000' }, { input: '11', expect: 'halt', tapeContains: '' }, { input: '0', expect: 'halt', tapeContains: '0' } ]
  }
];

let totalPass = 0, totalFail = 0;
const failures = [];
console.log('═══════════════════════════════════════════════════');
console.log('  TURING MACHINE PRESET TEST RUNNER');
console.log('═══════════════════════════════════════════════════\n');

for (const test of tests) {
  const rules = parseRules(test.rules);
  let pp = 0, pf = 0;
  for (const tc of test.cases) {
    const r = runTM(rules, tc.input);
    let ok = true, reason = '';
    if (tc.expect && r.result !== tc.expect) { ok = false; reason = `expected ${tc.expect}, got ${r.result} (${r.state})`; }
    if (ok && tc.tapeContains) {
      const clean = r.tape.replace(/[XY0]/g, c => c === '0' ? '0' : '').replace(/^0+(?=.)/, '');
      if (!r.tape.includes(tc.tapeContains) && clean !== tc.tapeContains) {
        ok = false; reason = `tape "${r.tape}" doesn't contain "${tc.tapeContains}"`;
      }
    }
    if (ok) { pp++; totalPass++; }
    else { pf++; totalFail++; failures.push({ p: test.name, i: tc.input||'ε', reason, t: r.tape, s: r.steps }); }
    const icon = ok ? '✓' : '✗';
    const extra = tc.tapeContains ? ` → "${r.tape}"` : '';
    console.log(`  ${icon} ${test.name.padEnd(18)} "${(tc.input||'ε').padEnd(12)}" → ${r.result.padEnd(8)} [${r.steps}]${extra}`);
  }
  console.log(`  └─ ${test.name}: ${pp}/${pp+pf} ${pf===0?'PASS':'FAIL'}\n`);
}

console.log('═══════════════════════════════════════════════════');
console.log(`  TOTAL: ${totalPass} passed, ${totalFail} failed`);
console.log('═══════════════════════════════════════════════════');
if (failures.length > 0) { console.log('\n  FAILURES:'); for (const f of failures) console.log(`    ✗ ${f.p} | "${f.i}" | ${f.reason} | tape="${f.t}" (${f.s})`); }
process.exit(totalFail > 0 ? 1 : 0);
