    function readSavedState(){
      try{
        const current=localStorage.getItem(STORAGE_KEY);
        if(current)return {raw:JSON.parse(current),source:STORAGE_KEY};
        for(const key of MIGRATABLE_KEYS){const value=localStorage.getItem(key);if(value)return {raw:JSON.parse(value),source:key};}
        for(const key of LEGACY_KEYS){if(localStorage.getItem(key))return {raw:null,source:key,legacyIgnored:true};}
      }catch(error){console.warn('[THRESHOLD] saved-state read failed; starting clean',error);}
      return {raw:null,source:null};
    }
    function validMetrics(metrics){return !!metrics&&typeof metrics==='object'&&['risk','trust','infra','aid','evidence','cohesion','comms'].every(key=>Number.isFinite(Number(metrics[key])));}
    function validEvent(event){return !!event&&typeof event==='object'&&typeof event.title==='string'&&typeof event.body==='string'&&typeof event.q==='string';}
    function normalizeState(saved){
      const raw=saved?.raw&&typeof saved.raw==='object'?saved.raw:null;
      const next={...clone(initial),...(raw||{})};
      next.version=APP_VERSION;
      next.settings={...initial.settings,...(raw?.settings||{})};
      next.seed=Number.isFinite(Number(next.seed))?Number(next.seed)>>>0:Date.now()>>>0;
      next.scenario=scenarios.some(item=>item.id===next.scenario)?next.scenario:initial.scenario;
      next.ai=Object.prototype.hasOwnProperty.call(aiModes,next.ai)?next.ai:initial.ai;
      if(!Object.prototype.hasOwnProperty.call(continuityModes,next.continuity))next.continuity=raw?.cont&&Object.prototype.hasOwnProperty.call(continuityModes,raw.cont)?raw.cont:initial.continuity;
      next.difficulty=['standard','hard','extreme'].includes(next.difficulty)?next.difficulty:initial.difficulty;
      next.tab=['situation','decision','ai','systems','log'].includes(next.tab)?next.tab:initial.tab;
      next.screen=['landing','game','end'].includes(next.screen)?next.screen:initial.screen;
      next.turn=Number.isFinite(Number(next.turn))&&Number(next.turn)>=1?Math.floor(Number(next.turn)):1;
      next.command=Number.isFinite(Number(next.command))?Math.max(0,Math.min(9,Math.floor(Number(next.command)))):7;
      next.log=Array.isArray(next.log)?next.log.slice(-80):[];
      next.selectedAction=actionCatalog.some(item=>item.id===next.selectedAction)?next.selectedAction:null;
      next.lastOutcome=next.lastOutcome&&typeof next.lastOutcome==='object'?next.lastOutcome:null;
      next.resolution=next.resolution&&typeof next.resolution==='object'?next.resolution:null;
      next.busy=false;
      if(saved?.legacyIgnored)next.recoveryNotice='An older preview save was incompatible and was safely ignored. Start a new watch below.';
      if(saved?.source&&saved.source!==STORAGE_KEY&&!saved.legacyIgnored)next.recoveryNotice='Your compatible saved watch was upgraded to the current format.';
      if(next.screen==='game'&&(!validMetrics(next.metrics)||!validEvent(next.currentEvent))){next.screen='landing';next.metrics=null;next.currentEvent=null;next.selectedAction=null;next.resolution=null;next.recoveryNotice='A partial or incompatible saved watch was reset before it could freeze the game.';}
      if(next.screen==='end'&&(!next.ending||typeof next.ending!=='object')){next.screen='landing';next.recoveryNotice='An incomplete end-state save was reset.';}
      return next;
    }
    function clearSave(){try{localStorage.removeItem(STORAGE_KEY);for(const key of [...MIGRATABLE_KEYS,...LEGACY_KEYS])localStorage.removeItem(key);}catch{}}
    if(savedState.source&&savedState.source!==STORAGE_KEY){if(savedState.legacyIgnored){try{for(const key of LEGACY_KEYS)localStorage.removeItem(key);}catch{}}else save();}
    function hasSavedWatch(){const saved=normalizeState(readSavedState());return saved.screen==='game'&&validMetrics(saved.metrics)&&validEvent(saved.currentEvent);}
    function scenario(){ return scenarios.find(s=>s.id===state.scenario)||scenarios[0]; }
    function applySettings(){ document.body.classList.toggle('large-text',!!state.settings.large); document.body.classList.toggle('high-contrast',!!state.settings.contrast); }
    function metric(label,value,badHigh=false){ const bad=badHigh?value>60:value<40; return `<div class="meter"><div class="meter-head"><span>${label}</span><b>${Math.round(value)}</b></div><div class="bar ${bad?'bad':''}"><i style="width:${clamp(value)}%"></i></div></div>`; }
    function landing(){
      const s=scenario();
      const cards=scenarios.map(x=>`<button class="scenario-card ${x.id===state.scenario?'selected':''}" data-scenario="${x.id}"><div class="meta"><span>${x.category}</span><span>Challenge ${x.challenge}/5</span></div><h3>${x.title}</h3><p>${x.line}</p><div class="pills">${x.variables.slice(0,2).map(v=>`<span class="pill">${v}</span>`).join('')}</div></button>`).join('');
      const ai=Object.entries(aiModes).map(([id,x])=>`<button class="choice ${id===state.ai?'selected':''}" data-ai="${id}"><strong>${x.label}</strong><small>${x.line}</small></button>`).join('');
      const cont=Object.entries(continuityModes).map(([id,x])=>`<button class="choice ${id===state.continuity?'selected':''}" data-cont="${id}"><strong>${x.label}</strong><small>${x.line}</small></button>`).join('');
      return `<section class="screen"><div class="shell"><header class="landing-head"><div class="landing-copy"><p class="eyebrow">Portable playable preview · UX v2.2</p><h1>THRESHOLD</h1><p class="tagline">Stay below the line</p><p class="intro">A turn-based strategy puzzle about incomplete evidence, institutional strain, humanitarian capacity, machine recommendations, and keeping human control under pressure.</p></div><aside class="panel content-note"><p class="eyebrow">Content note · recommended 16+</p><p>Abstract mass-harm, crisis, public-health, contamination, and continuity themes. No graphic imagery and no operational weapon, agent, targeting, delivery, or trigger details.</p></aside></header>${state.recoveryNotice?`<div class="recovery-banner" role="status"><strong>Saved-game recovery</strong><span>${state.recoveryNotice}</span><button id="dismissRecovery" type="button">Dismiss</button></div>`:''}<div class="setup-grid"><section class="panel setup-main"><div class="section-title"><h2>Scenario library</h2><span>${scenarios.length} playable watches</span></div><div class="scenario-grid">${cards}</div></section><aside class="panel setup-side"><div class="setup-block"><p class="eyebrow">Selected operation</p><h2 style="margin-top:8px">${s.title}</h2><p class="muted">${s.line}</p><ul class="summary-list"><li><span>Seat</span><b>${s.seat}</b></li><li><span>Duration</span><b>${s.duration} turns</b></li><li><span>Learning goal</span><b>${s.goal}</b></li></ul></div><div class="setup-block"><p class="eyebrow">Command intelligence</p><div class="choice-grid" style="margin-top:10px">${ai}</div></div><div class="setup-block"><p class="eyebrow">Continuity option</p><div class="choice-grid" style="margin-top:10px">${cont}</div></div><div class="setup-block select-row"><label for="difficulty" class="eyebrow">Difficulty</label><select id="difficulty"><option value="standard" ${state.difficulty==='standard'?'selected':''}>Standard — readable evidence</option><option value="hard" ${state.difficulty==='hard'?'selected':''}>Hard — noisier evidence</option><option value="extreme" ${state.difficulty==='extreme'?'selected':''}>Extreme — cascading dependencies</option></select></div><button class="launch" id="start">Begin watch</button>${hasSavedWatch()?'<button class="resume" id="resume">Resume saved watch</button>':''}<p class="subtle" style="font-size:.74rem;margin:12px 0 0">This portable preview runs entirely on your device and stores progress locally.</p></aside></div></div></section>`;
    }
    function setupGame(){
      const s=scenario(), d=state.difficulty==='extreme'?1.35:state.difficulty==='hard'?1.16:1;
      state.screen='game';state.turn=1;state.tab='situation';state.selectedAction=null;state.command=7;state.eventIndex=0;state.busy=false;state.lastOutcome=null;state.resolution=null;
      state.metrics={risk:clamp((42+s.challenge*4)*d),trust:68,infra:70,aid:66,evidence:54,cohesion:63,comms:78,drift:state.ai==='skynet'?28:state.ai==='ensemble'?12:state.ai==='copilot'?7:0,takeover:state.ai==='skynet'?26:0,assurance:state.continuity==='deadhand'?58:state.continuity==='guarded'?76:100,ambiguity:state.continuity==='off'?0:24};
      state.log=[{t:1,title:'Watch opened',text:s.opening}];
      state.currentEvent={title:s.title,body:s.opening,q:s.question,bias:'verify'};
      save();render();
    }
    function aiRec(){
      const m=state.metrics,e=state.currentEvent;
      if(state.ai==='human') return {action:'None',why:'No machine recommendation is active. Staff dissent remains the primary decision aid.',confidence:0,uncertainty:100,votes:[]};
      let a=e.bias||'verify';
      if(m.evidence<45)a='verify'; else if(m.risk>74)a='diplomacy'; else if(m.aid<42)a='aid'; else if(m.infra<42)a='resilience';
      const confidence=clamp(42+m.evidence*.35-(m.drift||0)*.22+(state.ai==='skynet'?15:0));
      const uncertainty=clamp(100-confidence+(m.ambiguity||0)*.18);
      const votes=state.ai==='ensemble'||state.ai==='skynet'?[['ORACLE',a,confidence],['ARGUS',m.risk>64?'resilience':'verify',clamp(48+m.risk*.25)],['CHORUS',m.trust<55?'diplomacy':'aid',clamp(44+m.trust*.28)]]:[];
      return {action:names[a],key:a,why:`The model favors ${names[a].toLowerCase()} because evidence quality is ${Math.round(m.evidence)}, risk is ${Math.round(m.risk)}, and current dependencies remain partly reversible.`,confidence,uncertainty,votes};
    }
    function continuityStatus(){
      const m=state.metrics;
      if(state.continuity==='off')return 'off';
      if(m.comms<28)return 'isolated';
      if(m.ambiguity>68||m.assurance<38)return 'challenged';
      if(m.risk>(state.continuity==='deadhand'?58:74))return 'armed';
      return 'dormant';
    }
    function game(){
      const s=scenario(),m=state.metrics,rec=aiRec(),status=continuityStatus();
      const selected=actionCatalog.find(a=>a.id===state.selectedAction)||null;
      const actionHtml=actionCatalog.map(a=>`<button class="action ${state.selectedAction===a.id?'selected':''}" data-action="${a.id}" ${state.command<a.cost||state.busy?'disabled':''} aria-pressed="${state.selectedAction===a.id}"><div class="row"><b>${a.label}</b><span class="cost">${a.cost?a.cost+' command':'no cost'}</span></div><p>${a.line}</p></button>`).join('');
      const votes=rec.votes.length?`<div class="votes">${rec.votes.map(v=>`<div class="vote"><b>${v[0]}</b><span>${names[v[1]]} · ${Math.round(v[2])}%</span></div>`).join('')}</div>`:'';
      const log=state.log.slice().reverse().map(x=>`<li><strong>Turn ${x.t} · ${x.title}</strong><br>${x.text}</li>`).join('');
      const completed=Math.max(0,state.turn-1),progress=clamp((completed/s.duration)*100);
      const workflow=`<div class="workflow" aria-label="Decision workflow"><div class="workflow-step ${state.selectedAction?'done':'active'}"><b>1 · Choose</b><span>Select one response.</span></div><div class="workflow-step ${state.busy?'active':state.selectedAction?'active':''}"><b>2 · Execute</b><span>Commit the decision.</span></div><div class="workflow-step ${state.resolution?.open?'active':''}"><b>3 · Review</b><span>See every consequence.</span></div></div>`;
      const last=state.lastOutcome;
      const lastBanner=last?`<section class="panel outcome-banner"><div><p class="eyebrow">Last decision resolved · turn ${last.turn}</p><strong>${last.actionLabel}</strong><span>${last.shortSummary}</span></div><button id="reviewOutcome">Review changes</button></section>`:'';
      const selectedGuide=selected?`<div class="action-guide ready"><strong>Selected: ${selected.label}</strong><span>${selected.preview}</span></div>`:`<div class="action-guide"><strong>No action selected</strong><span>Tap an option below. The Execute button will then become active.</span></div>`;
      const executeLabel=state.busy?'Resolving decision…':selected?`2 · Execute ${selected.label}`:'2 · Select an action first';
