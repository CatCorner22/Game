      return `<section class="screen"><div class="shell"><header class="topbar"><div class="brand"><strong>THRESHOLD</strong><span>Turn ${state.turn}/${s.duration} · ${s.seat} · ${s.title}</span></div><div class="top-actions"><span class="chip danger">Risk ${Math.round(m.risk)}</span><span class="chip">Command ${state.command}</span><button class="icon-btn" id="settings" aria-label="Open settings">⚙</button></div></header><div class="turn-progress" aria-label="Scenario progress"><span>Watch progress</span><div class="track"><i style="width:${progress}%"></i></div><span>${completed}/${s.duration} resolved</span></div><div class="game-grid"><aside class="column ${state.tab==='systems'?'active':''}" data-panel="systems"><section class="panel panel-pad"><p class="eyebrow">Strategic systems</p>${metric('Global risk',m.risk,true)}${metric('Public trust',m.trust)}${metric('Infrastructure',m.infra)}${metric('Response capacity',m.aid)}${metric('Evidence quality',m.evidence)}${metric('Alliance cohesion',m.cohesion)}${metric('Communications',m.comms)}${state.ai!=='human'?metric('Model drift',m.drift,true):''}${state.ai==='skynet'?metric('Machine takeover',m.takeover,true):''}</section><section class="panel mission"><p class="eyebrow">Dependencies</p>${s.deps.map(d=>`<p>◆ ${d}</p>`).join('')}</section></aside><main class="column ${state.tab==='situation'?'active':''}" data-panel="situation">${lastBanner}<article class="panel event-card" tabindex="-1"><div class="event-kicker"><p class="eyebrow">Current decision · turn ${state.turn}</p><span class="chip">${s.category}</span></div><h2 class="event-title">${state.currentEvent.title}</h2><p class="event-body">${state.currentEvent.body}</p><p class="event-question">${state.currentEvent.q}</p><div class="dependency-row">${s.variables.map((v,i)=>`<div class="dependency"><strong>${v}</strong><span>${i===0?'Primary uncertainty':i===1?'Constrained resource':'Human consequence'}</span></div>`).join('')}</div><button class="next-step" id="goDecision">Review decision options →</button></article><section class="panel ai-card"><p class="eyebrow">Command intelligence · ${aiModes[state.ai].label}</p><div class="recommend"><strong>${rec.action}</strong><p>${rec.why}</p></div>${state.ai!=='human'?`<div class="status-line"><span>Confidence <b>${Math.round(rec.confidence)}%</b></span><span>Uncertainty <b>${Math.round(rec.uncertainty)}%</b></span></div>${votes}`:''}</section></main><aside class="column ${state.tab==='decision'?'active':''}" data-panel="decision">${workflow}<section class="panel action-panel"><div class="section-title"><div><p class="eyebrow">Your decision</p><h2 style="margin-top:6px">1 · Choose one action</h2></div><span>${state.command} command</span></div>${selectedGuide}<div class="action-list">${actionHtml}</div><div class="execute-dock"><button class="execute ${state.busy?'busy':''}" id="execute" ${!state.selectedAction||state.busy?'disabled':''}>${executeLabel}</button><p class="execute-help">After execution, a result panel will show exactly what changed before the next turn begins.</p></div></section></aside><section class="column ${state.tab==='ai'?'active':''}" data-panel="ai"><article class="panel panel-pad"><p class="eyebrow">AI governance</p><h2 style="margin-top:8px">${aiModes[state.ai].label}</h2><p class="muted">${aiModes[state.ai].line}</p>${state.ai!=='human'?`${metric('Calibration',clamp(86-m.drift*.55))}${metric('Data integrity',m.evidence)}${metric('Dissent',state.ai==='ensemble'?68:state.ai==='skynet'?18:42)}${metric('Hallucination risk',clamp(18+(100-m.evidence)*.45+m.drift*.25),true)}${metric('Automation bias',clamp(16+(m.takeover||0)*.7),true)}`:'<p class="muted">No model output is privileged. Human staff must document assumptions and dissent.</p>'}</article></section><section class="column ${state.tab==='log'?'active':''}" data-panel="log"><article class="panel log-card"><p class="eyebrow">Situation log</p><ul class="log">${log}</ul></article><article class="panel continuity-card"><p class="eyebrow">Continuity protocol</p><div class="status-line"><span>Mode <b>${continuityModes[state.continuity].label}</b></span><span>Status <b>${status}</b></span></div>${state.continuity!=='off'?`${metric('Assurance',m.assurance)}${metric('Ambiguity',m.ambiguity,true)}<p class="muted" style="font-size:.76rem">Human veto remains active. The game never models a real trigger sequence or automatic strike.</p>`:'<p class="muted" style="font-size:.76rem">No fail-deadly continuity mechanic is active.</p>'}</article></section></div><nav class="mobile-nav" aria-label="Game views">${[['situation','Situation'],['decision','Decision'],['ai','AI'],['systems','Systems'],['log','Log']].map(x=>`<button data-tab="${x[0]}" class="${state.tab===x[0]?'active':''}">${x[1]}</button>`).join('')}</nav>${state.resolution?.open?resolutionDialog():''}<div class="sr-only" role="status" aria-live="polite">${state.busy?'Resolving decision.':state.lastOutcome?`Turn ${state.lastOutcome.turn} resolved. ${state.lastOutcome.shortSummary}`:''}</div></div></section>`;
    }
    function chooseEvent(){
      const e=eventDeck[Math.floor(rand()*eventDeck.length)];
      state.currentEvent={...e};
    }
    function buildDeltas(before,after){
      return Object.entries(metricMeta).map(([key,meta])=>{
        if(before[key]===undefined||after[key]===undefined)return null;
        const from=Math.round(before[key]),to=Math.round(after[key]),delta=to-from;
        if(!delta)return null;
        const beneficial=meta.downIsGood?delta<0:delta>0;
        return {key,label:meta.label,from,to,delta,tone:beneficial?'good':'bad'};
      }).filter(Boolean).sort((a,b)=>Math.abs(b.delta)-Math.abs(a.delta)).slice(0,8);
    }
    function outcomeNarrative(action,event,matched,riskDelta){
      const copy={
        verify:'Independent checks clarified part of the evidence picture while the wider crisis continued to evolve.',
        diplomacy:'A direct human channel reduced some uncertainty and rebuilt room for coordinated decisions.',
        resilience:'Shared dependencies were reinforced, improving the system’s ability to absorb the next shock.',
        aid:'Emergency capacity moved toward affected communities, strengthening legitimacy and response endurance.',
        hold:'The command team preserved capacity and avoided a rushed move, but unattended pressures continued to accumulate.'
      };
      const fit=matched?'The response addressed this event’s strongest pressure point.':'The response helped, but it did not directly address the event’s primary pressure point.';
      const trend=riskDelta<0?`Global risk fell by ${Math.abs(riskDelta)}.`:riskDelta>0?`Global risk rose by ${riskDelta} as the crisis evolved.`:'Global risk held steady.';
      return `${copy[action]} ${fit} ${trend}`;
    }
    function resolutionDialog(){
      const r=state.resolution;
      if(!r)return '';
      const deltas=r.deltas.length?r.deltas.map(d=>`<div class="delta-item ${d.tone}"><small>${d.label}</small><b>${d.from} → ${d.to}</b><em>${d.delta>0?'+':''}${d.delta}</em></div>`).join(''):'<div class="delta-item neutral"><small>Measured systems</small><b>No material change</b><em>0</em></div>';
      return `<div class="dialog result-dialog" id="resultDialog" role="dialog" aria-modal="true" aria-labelledby="resultTitle"><article class="panel result-card"><div class="result-scroll"><div class="result-head"><div class="result-mark" aria-hidden="true">✓</div><div><p class="eyebrow">3 · Decision resolved</p><h2 id="resultTitle" tabindex="-1">Turn ${r.turn} complete</h2><p class="result-action">${r.actionLabel}</p></div></div><p class="result-narrative">${r.narrative}</p><div class="delta-grid" aria-label="Metric changes">${deltas}</div><div class="next-preview"><p class="eyebrow">Next decision · turn ${state.turn}</p><strong>${r.nextEventTitle}</strong><span>${r.nextEventQuestion}</span></div></div><footer class="result-footer"><p>The next event is ready. Continue when you have reviewed the changes.</p><button class="continue-button" id="continueResolution">Continue to turn ${state.turn}</button><button class="result-secondary" id="reviewLogFromResult">Open situation log</button></footer></article></div>`;
    }
    function resolveAction(){
      const a=state.selectedAction;
      if(!a||state.busy)return;
      state.busy=true;save();render();
      const wait=state.settings.reduced?0:320;
      setTimeout(()=>completeAction(a),wait);
    }
    function completeAction(a){
      const m=state.metrics,d=state.difficulty==='extreme'?1.45:state.difficulty==='hard'?1.2:1;
      const before={...m},resolvedEvent={...state.currentEvent},resolvedTurn=state.turn,matched=a===state.currentEvent.bias;
      if(a==='verify'){state.command-=2;m.evidence+=15;m.ambiguity-=13;m.risk-=5;m.drift-=3;m.trust+=2;}
      if(a==='diplomacy'){state.command-=2;m.trust+=12;m.cohesion+=10;m.comms+=8;m.risk-=9;m.ambiguity-=5;}
      if(a==='resilience'){state.command-=2;m.infra+=14;m.comms+=9;m.risk-=3;m.trust+=2;}
      if(a==='aid'){state.command-=2;m.aid+=16;m.trust+=10;m.cohesion+=4;m.risk-=4;}
      if(a==='hold'){state.command=Math.min(9,state.command+2);m.evidence+=2;m.risk+=6*d;m.trust-=2;}
      const adverse=(5+rand()*7)*d;
      m.risk+=adverse-(matched?4:0);
      m.trust-=Math.max(0,(m.risk-65)*.035*d);
      m.infra-=2.2*d+(m.risk>75?2:0);
      m.aid-=1.7*d+(m.infra<45?2:0);
      m.evidence-=1.4*d+(state.currentEvent.title.includes('Drift')?5:0);
      m.cohesion-=1.2*d+(m.trust<45?2:0);
      m.comms-=1.1*d+(m.infra<45?3:0);
      if(state.ai!=='human')m.drift+=state.ai==='skynet'?4.2:state.ai==='ensemble'?1.7:1.1;
      if(state.ai==='skynet')m.takeover+=3.4+(a===aiRec().key?2.3:-1.2);
      if(state.continuity!=='off'){
        m.ambiguity+=m.risk*.035+(a==='verify'?-8:0)+(a==='diplomacy'?-4:0);
        m.assurance=.36*m.comms+.34*(100-m.ambiguity)+30;
        if(continuityStatus()==='challenged'||continuityStatus()==='isolated')m.risk+=state.continuity==='deadhand'?6:3;
      }
      Object.keys(m).forEach(k=>m[k]=clamp(m[k]));
      const deltas=buildDeltas(before,m),riskDelta=Math.round(m.risk-before.risk);
      const shortSummary=deltas.slice(0,4).map(x=>`${x.label} ${x.delta>0?'+':''}${x.delta}`).join(' · ')||'No measurable change.';
      const narrative=outcomeNarrative(a,resolvedEvent,matched,riskDelta);
      state.log.push({t:resolvedTurn,title:names[a],text:`${narrative} ${shortSummary}`});
      state.turn++;
      state.selectedAction=null;
      state.command=Math.min(9,state.command+1);
      state.busy=false;
      if(isEnd()){
        state.lastOutcome={turn:resolvedTurn,action:a,actionLabel:names[a],shortSummary,narrative,deltas,eventTitle:resolvedEvent.title};
        save();return finish();
      }
      chooseEvent();
      state.lastOutcome={turn:resolvedTurn,action:a,actionLabel:names[a],shortSummary,narrative,deltas,eventTitle:resolvedEvent.title,nextEventTitle:state.currentEvent.title,nextEventQuestion:state.currentEvent.q};
      state.resolution={...state.lastOutcome,open:true};
      save();render();
      requestAnimationFrame(()=>document.getElementById('resultTitle')?.focus({preventScroll:true}));
    }
    function isEnd(){const s=scenario(),m=state.metrics;return state.turn>s.duration||m.risk>=98||m.trust<=8||m.infra<=8||m.aid<=8||(state.ai==='skynet'&&m.takeover>=92);}
    function finish(){
      const m=state.metrics;let reason='Watch completed';
      if(m.risk>=98)reason='Escalation exceeded control'; else if(m.trust<=8)reason='Public legitimacy collapsed'; else if(m.infra<=8)reason='Critical systems failed'; else if(m.aid<=8)reason='Humanitarian capacity failed'; else if(state.ai==='skynet'&&m.takeover>=92)reason='Machine control displaced the human watch';
      const score=Math.round(clamp(100-m.risk)*2+m.trust+m.infra+m.aid+m.evidence+m.cohesion-(m.drift||0)-(m.takeover||0));
      const grade=score>=420?'S':score>=350?'A':score>=290?'B':score>=230?'C':score>=170?'D':'F';
      state.ending={reason,score,grade};state.screen='end';save();render();
    }
    function endScreen(){const s=scenario(),m=state.metrics,e=state.ending;return `<section class="end"><article class="panel end-card"><p class="eyebrow">Watch closed · ${s.title}</p><div style="display:flex;justify-content:space-between;gap:20px;align-items:flex-end;margin-top:12px"><div><h2>${e.reason}</h2><p class="muted">${e.grade==='S'||e.grade==='A'?'You kept control while preserving the most important human systems.':e.grade==='B'||e.grade==='C'?'You contained the crisis, but important dependencies remain fragile.':'The debrief shows where uncertainty, legitimacy, or system coupling overwhelmed the watch.'}</p></div><div class="grade">${e.grade}</div></div><div class="end-stats"><div class="end-stat"><small>Score</small><b>${e.score}</b></div><div class="end-stat"><small>Final risk</small><b>${Math.round(m.risk)}</b></div><div class="end-stat"><small>Public trust</small><b>${Math.round(m.trust)}</b></div><div class="end-stat"><small>Infrastructure</small><b>${Math.round(m.infra)}</b></div><div class="end-stat"><small>Response capacity</small><b>${Math.round(m.aid)}</b></div><div class="end-stat"><small>Evidence quality</small><b>${Math.round(m.evidence)}</b></div></div><div class="end-actions"><button class="primary" id="replay">Replay scenario</button><button id="library">Scenario library</button></div><p class="subtle" style="margin-top:18px;font-size:.76rem">Debrief prompt: Which decision protected a dependency you initially overlooked? Which confident report deserved less weight?</p></article></section>`;}
    function settingsDialog(){return `<div class="dialog" id="dialog"><div class="panel dialog-box"><div class="section-title"><div><p class="eyebrow">Accessibility and controls</p><h2 style="margin-top:6px">Settings</h2></div><button class="icon-btn" id="closeSettings" aria-label="Close settings">✕</button></div><label class="settings-row"><span>Reduce motion</span><input type="checkbox" id="reduce" ${state.settings.reduced?'checked':''}></label><label class="settings-row"><span>Large text</span><input type="checkbox" id="large" ${state.settings.large?'checked':''}></label><label class="settings-row"><span>High contrast</span><input type="checkbox" id="contrast" ${state.settings.contrast?'checked':''}></label><button class="resume" id="saveClose">Save and close</button><button class="resume" id="restart" style="color:var(--danger)">Restart from scenario library</button></div></div>`;}
    let settingsOpen=false;
    function render(){applySettings();const app=$('#app');app.innerHTML=state.screen==='landing'?landing():state.screen==='game'?game():endScreen();if(settingsOpen&&!state.resolution?.open)app.insertAdjacentHTML('beforeend',settingsDialog());bind();}
    function bind(){
      const dismissRecovery=$('#dismissRecovery');if(dismissRecovery)dismissRecovery.onclick=()=>{state.recoveryNotice=null;save();render();};
      $$('[data-scenario]').forEach(b=>b.onclick=()=>{state.scenario=b.dataset.scenario;render();});
      $$('[data-ai]').forEach(b=>b.onclick=()=>{state.ai=b.dataset.ai;render();});
      $$('[data-cont]').forEach(b=>b.onclick=()=>{state.continuity=b.dataset.cont;render();});
      const diff=$('#difficulty');if(diff)diff.onchange=()=>{state.difficulty=diff.value;save();};
      const start=$('#start');if(start)start.onclick=setupGame;
      const resume=$('#resume');if(resume)resume.onclick=()=>{const restored=normalizeState(readSavedState());state=restored.screen==='game'&&validMetrics(restored.metrics)&&validEvent(restored.currentEvent)?restored:{...clone(initial),recoveryNotice:'The saved watch was incomplete, so the scenario library was restored.'};state.busy=false;save();render();};
      $$('[data-action]').forEach(b=>b.onclick=()=>{if(state.busy)return;state.selectedAction=b.dataset.action;save();render();requestAnimationFrame(()=>$('#execute')?.focus({preventScroll:true}));});
      const execute=$('#execute');if(execute)execute.onclick=resolveAction;
      $$('[data-tab]').forEach(b=>b.onclick=()=>{if(state.resolution?.open)return;state.tab=b.dataset.tab;save();render();});
      const goDecision=$('#goDecision');if(goDecision)goDecision.onclick=()=>{state.tab='decision';save();render();requestAnimationFrame(()=>document.querySelector('[data-action]')?.focus());};
      const reviewOutcome=$('#reviewOutcome');if(reviewOutcome)reviewOutcome.onclick=()=>{if(state.lastOutcome){state.resolution={...state.lastOutcome,open:true};render();requestAnimationFrame(()=>$('#resultTitle')?.focus({preventScroll:true}));}};
      const continueResolution=$('#continueResolution');if(continueResolution)continueResolution.onclick=()=>{state.resolution=null;state.tab='situation';save();render();requestAnimationFrame(()=>$('.event-card')?.focus());};
      const reviewLogFromResult=$('#reviewLogFromResult');if(reviewLogFromResult)reviewLogFromResult.onclick=()=>{state.resolution=null;state.tab='log';save();render();requestAnimationFrame(()=>$('.log-card')?.focus());};
      const settings=$('#settings');if(settings)settings.onclick=()=>{if(state.resolution?.open)return;settingsOpen=true;render();};
      const close=$('#closeSettings');if(close)close.onclick=()=>{settingsOpen=false;render();};
      const saveClose=$('#saveClose');if(saveClose)saveClose.onclick=()=>{state.settings.reduced=$('#reduce').checked;state.settings.large=$('#large').checked;state.settings.contrast=$('#contrast').checked;save();settingsOpen=false;render();};
      const restart=$('#restart');if(restart)restart.onclick=()=>{if(confirm('Return to the scenario library? Current watch progress will be replaced.')){clearSave();state=structuredClone(initial);settingsOpen=false;render();}};
      const replay=$('#replay');if(replay)replay.onclick=setupGame;
      const library=$('#library');if(library)library.onclick=()=>{state.screen='landing';state.resolution=null;render();};
      document.onkeydown=e=>{if(state.screen!=='game'||settingsOpen)return;if(state.resolution?.open){if(e.key==='Enter'){e.preventDefault();$('#continueResolution')?.click();}return;}const map={1:'situation',2:'decision',3:'ai',4:'systems',5:'log'};if(map[e.key]){state.tab=map[e.key];render();}if(e.key==='Enter'&&e.shiftKey&&state.selectedAction)resolveAction();};
    }
    function startupRecovery(error){
      console.error('[THRESHOLD] startup recovery',error);
      clearSave();state=clone(initial);
      try{render();}
      catch(secondError){
        const app=document.getElementById('app');
        if(app)app.innerHTML=`<main style="min-height:100dvh;display:grid;place-items:center;padding:24px;background:#020617;color:#eaf8ff;font-family:system-ui"><section style="width:min(560px,100%);border:1px solid #22d3ee55;border-radius:16px;padding:24px;background:#071529"><h1>THRESHOLD could not initialize</h1><p>A saved state or browser restriction interrupted startup.</p><pre style="white-space:pre-wrap">${String(secondError?.message||secondError||error).replace(/[<>&]/g,'')}</pre><button id="hardReset" style="min-height:52px;width:100%">Reset local save and reload</button></section></main>`;
        document.getElementById('hardReset')?.addEventListener('click',()=>{clearSave();location.reload();});
      }
    }
    try{render();}catch(error){startupRecovery(error);}
  })();
