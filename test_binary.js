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
const rules = parseRules(`q0, 0, 0, R, q0
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
qFin, 1, 1, R, qFin`);
const cases=[['1+1','10'],['101+11','1000'],['11+1','100'],['10+10','100'],['111+1','1000']];
for (const [inp,exp] of cases) {
  const r=runTM(rules,inp); const clean=r.tape.replace(/^0+(?=.)/,'');
  console.log(`${clean===exp?'✓':'✗'} "${inp}" → "${r.tape}" clean="${clean}" exp="${exp}" [${r.steps}] ${r.state}`);
}
