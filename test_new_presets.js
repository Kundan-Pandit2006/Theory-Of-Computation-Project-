function parseRules(t) {
  const r = {}; for (const l of t.split('\n')) {
    const p = l.trim().split(',').map(s=>s.trim()); if(p.length!==5) continue;
    if(!r[p[0]]) r[p[0]]={}; r[p[0]][p[1]]={write:p[2],move:p[3],nextState:p[4]};
  } return r;
}
function runTM(rules, inp, max=50000) {
  const P=30, input=inp===''?['_']:inp.split('');
  const tape=[...Array(P).fill('_'),...input,...Array(P).fill('_')];
  let h=P, st='q0', s=0;
  while(s<max) {
    const sym=tape[h]||'_'; if(!rules[st]||!rules[st][sym]) break;
    const r=rules[st][sym]; tape[h]=r.write; st=r.nextState; h+=r.move==='R'?1:-1; s++;
    if(h<2){tape.unshift(...Array(10).fill('_'));h+=10;}
    if(h>=tape.length-2) tape.push(...Array(10).fill('_'));
    const sl=st.toLowerCase();
    if(sl.includes('stop')||sl.includes('halt')||sl.includes('accept')||sl.includes('reject')) break;
  }
  const sl=st.toLowerCase();
  let res=sl.includes('accept')?'accept':sl.includes('reject')?'reject':(sl.includes('stop')||sl.includes('halt'))?'halt':'timeout';
  return{state:st,result:res,tape:tape.join('').replace(/^_+/,'').replace(/_+$/,'')||'',steps:s};
}

const tests = [
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
    cases: [ { input: '1011', expect: 'halt', expectedOut: '1101' }, { input: '1', expect: 'halt', expectedOut: '1' } ]
  },
  { name: 'replace0with1',
    rules: `q0, 0, 1, R, q0\nq0, 1, 1, R, q0\nq0, _, _, L, qStop`,
    cases: [ { input: '10010', expect: 'halt', expectedOut: '11111' } ]
  },
  { name: 'removeAll1s',
    rules: `q0, 0, 0, R, q0\nq0, 1, 1, R, q0\nq0, _, #, L, qRewind\nqRewind, 0, 0, L, qRewind\nqRewind, 1, 1, L, qRewind\nqRewind, _, _, R, qRead\nqRead, 1, _, R, qRead\nqRead, 0, _, R, qCopy0\nqRead, #, _, R, qStop\nqCopy0, 0, 0, R, qCopy0\nqCopy0, 1, 1, R, qCopy0\nqCopy0, #, #, R, qCopy0\nqCopy0, _, 0, L, qRet\nqRet, 0, 0, L, qRet\nqRet, 1, 1, L, qRet\nqRet, #, #, L, qRet\nqRet, _, _, R, qRead`,
    cases: [ { input: '101010', expect: 'stop', expectedOut: '000' }, { input: '11', expect: 'stop', expectedOut: '' }, { input: '0', expect: 'stop', expectedOut: '0' } ]
  }
];

let totalPass=0, totalFail=0;
for (const test of tests) {
  const rules = parseRules(test.rules);
  let pp=0, pf=0;
  for (const tc of test.cases) {
    const r = runTM(rules, tc.input);
    let ok = true, reason = '';
    
    // For expected output matching
    if (tc.expectedOut !== undefined) {
      if (r.tape !== tc.expectedOut) {
        ok = false;
        reason = `Tape didn't match. got "${r.tape}"`;
      }
    } else {
      if (tc.expect && r.result !== tc.expect && !slMatch(r.state, tc.expect)) { 
        ok = false; reason = `expected ${tc.expect}, got ${r.result} (${r.state})`; 
      }
    }
    
    if (ok) { pp++; totalPass++; }
    else { pf++; totalFail++; console.log(`  ✗ ${test.name} | "${tc.input}" | ${reason} | tape="${r.tape}"`); }
  }
}
function slMatch(state, exp) {
    return state.toLowerCase().includes(exp.toLowerCase());
}
console.log(`TOTAL: ${totalPass} passed, ${totalFail} failed`);
