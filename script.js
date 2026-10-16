'use strict';
(() => {
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => Array.from(root.querySelectorAll(s));
  const storageKey = 'minha-trilha-qt-v1';
  const completedSteps = [
    {id:'enap-start',label:'Iniciar curso gratuito da ENAP',meta:'Outubro de 2026 · Análise e Melhoria de Processos'},
    {id:'enap-finish',label:'Concluir curso da ENAP',meta:'Meta: novembro de 2026 · Certificado de conclusão'},
    {id:'puc-research',label:'Conferir próxima turma e preços da PUC Minas',meta:'Antes de matricular-se · 24 × R$ 260 é só referência'},
    {id:'puc-enroll',label:'Efetivar matrícula na pós-graduação',meta:'Quando houver turma compatível · Registrar como em andamento'},
    {id:'power-bi',label:'Concluir trilha gratuita de Power BI',meta:'Durante 2027 · Microsoft Learn'},
    {id:'power-automate',label:'Concluir introdução ao Power Automate',meta:'Durante 2027 · Microsoft Learn'},
    {id:'puc-finish',label:'Concluir a pós-graduação',meta:'Meta projetada: até abril de 2028, se iniciada em nov/2026'},
    {id:'auditor',label:'Concluir formação de Auditor Interno',meta:'Meta: novembro/2028 a fevereiro/2029'},
    {id:'green-belt',label:'Concluir Lean Six Sigma Green Belt',meta:'Meta: março a agosto de 2029'},
    {id:'pl-300',label:'Ser aprovado no exame oficial Microsoft PL-300',meta:'Certificação profissional somente após aprovação na prova'}
  ];
  function readStorage(){
    try { const v=JSON.parse(localStorage.getItem(storageKey)||'{}'); return v&&typeof v==='object'?v:{}; }
    catch { return {}; }
  }
  function writeStorage(patch){
    try { localStorage.setItem(storageKey,JSON.stringify({...readStorage(),...patch})); }
    catch { /* some private browser contexts disable localStorage */ }
  }
  // Menu mobile
  const menu = $('#mainNav'), toggle = $('#menuToggle');
  toggle?.addEventListener('click',()=>{
    const open=menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded',String(open));
    toggle.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');
  });
  $$('.main-nav a').forEach(link=>link.addEventListener('click',()=>{
    menu.classList.remove('open');
    toggle?.setAttribute('aria-expanded','false');
  }));
  document.addEventListener('keydown', e=>{
    if(e.key==='Escape'&&menu?.classList.contains('open')){
      menu.classList.remove('open');toggle?.setAttribute('aria-expanded','false');toggle?.focus();
    }
  });
  // Filter course cards without network calls
  $$('.filter-btn').forEach(btn=>btn.addEventListener('click',()=>{
    const filter=btn.dataset.filter;
    $$('.filter-btn').forEach(b=>{
      const selected=b===btn;b.classList.toggle('is-active',selected);b.setAttribute('aria-pressed',String(selected));
    });
    $$('.course-card').forEach(card=>{card.hidden=filter!=='all'&&card.dataset.kind!==filter;});
  }));
  // Monthly budget slider. The three bands are the known concurrent monthly fees.
  const budgetInput = $('#monthlyBudget');
  function brl(v){return new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0}).format(v)}
  function renderBudget(){
    const budget=Number(budgetInput.value),vals=[260,95,144.75];
    $('#budgetDisplay').textContent=brl(budget);
    [['#barPuc',vals[0]],['#barAuditor',vals[1]],['#barCombined',vals[2]]].forEach(([id,value])=>{
      $(id).style.width=Math.min(value/budget*100,100)+'%';
    });
    const alert=$('#budgetExplanation');
    if (budget>=260){
      alert.className='budget-alert success';
      alert.innerHTML=`<strong>Plano dentro do teto escolhido.</strong><span>Maior parcela mensal prevista: R$ 260. Você teria ${brl(budget-260)} livres nos meses da pós.</span>`;
    } else {
      alert.className='budget-alert warning';
      alert.innerHTML=`<strong>A pós ultrapassa o teto em ${brl(260-budget)}/mês.</strong><span>Antes de contratar, negocie desconto, aumente o orçamento ou procure uma pós mais econômica. Não assuma uma parcela acima do que pode pagar.</span>`;
    }
    writeStorage({budget});
  }
  if(budgetInput){
    const last=readStorage().budget;
    if(Number.isFinite(last)&&last>=200&&last<=300)budgetInput.value=last;
    budgetInput.addEventListener('input',renderBudget);renderBudget();
  }
  // Persistent checklist. No account or cloud sync: device-only browser storage.
  let checked = new Set((Array.isArray(readStorage().completed)?readStorage().completed:[]).filter(id=>completedSteps.some(s=>s.id===id)));
  function renderChecklist(){
    const host=$('#checklistItems');
    host.innerHTML='';
    for(const step of completedSteps){
      const label=document.createElement('label');label.className='check-row';
      const input=document.createElement('input');input.type='checkbox';input.checked=checked.has(step.id);
      input.setAttribute('aria-label',step.label);
      const text=document.createElement('span');
      const title=document.createElement('strong');title.textContent=step.label;
      const meta=document.createElement('small');meta.textContent=step.meta;
      text.append(title,meta);label.append(input,text);host.appendChild(label);
      input.addEventListener('change',()=>{
        if(input.checked)checked.add(step.id);else checked.delete(step.id);
        writeStorage({completed:[...checked]});renderChecklist();
      });
    }
    const len=checked.size;
    $('#progressPercent').textContent=Math.round(len/completedSteps.length*100)+'%';
    $('#progressBar').style.width=len/completedSteps.length*100+'%';
    $('#progressCount').textContent=`${len} de ${completedSteps.length} etapas`;
    $('#checklistState').textContent=`${len} concluída${len===1?'':'s'}`;
  }
  if($('#checklistItems'))renderChecklist();
  $('#resetChecklist')?.addEventListener('click',()=>{
    if(!checked.size)return;
    if(window.confirm('Deseja apagar as marcações deste checklist neste navegador?')){
      checked.clear();writeStorage({completed:[]});renderChecklist();
    }
  });
  $('#printPlan')?.addEventListener('click',()=>window.print());
  // Download offline-friendly .ics with recurring 4 study slots in Sao Paulo time.
  function makeCalendar(){
    const slots=[
      {id:'TUE',date:'20261020',start:'190000',end:'201500',title:'Estudo principal — Minha Trilha',desc:'Aulas e anotações da formação principal. Terça: 1h15.'},
      {id:'THU',date:'20261022',start:'190000',end:'201500',title:'Estudo e exercícios — Minha Trilha',desc:'Revisar conteúdos e resolver atividades. Quinta: 1h15.'},
      {id:'SAT',date:'20261024',start:'140000',end:'150000',title:'Revisão leve — Minha Trilha',desc:'Sessão de 1h para revisar após o treino.'},
      {id:'SUN',date:'20261025',start:'090000',end:'110000',title:'Projeto prático — Minha Trilha',desc:'Estudos de caso, trabalhos e avaliações. Domingo: 2h.'}
    ];
    const esc=(x)=>x.replaceAll('\\','\\\\').replaceAll(',','\\,').replaceAll(';','\\;').replaceAll('\n','\\n');
    const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Minha Trilha//Plano de Qualidade e Tecnologia//PT-BR','CALSCALE:GREGORIAN','METHOD:PUBLISH','X-WR-CALNAME:Minha Trilha - Estudos','X-WR-TIMEZONE:America/Sao_Paulo'];
    for(const s of slots){
      lines.push('BEGIN:VEVENT','UID:minha-trilha-'+s.id.toLowerCase()+'-2026@local','DTSTAMP:20261016T140000Z',`DTSTART;TZID=America/Sao_Paulo:${s.date}T${s.start}`,`DTEND;TZID=America/Sao_Paulo:${s.date}T${s.end}`,'RRULE:FREQ=WEEKLY;UNTIL=20291028T235959Z',`SUMMARY:${esc(s.title)}`,`DESCRIPTION:${esc(s.desc+'\nAdaptar horários conforme calendário da instituição.')}`,'END:VEVENT');
    }
    lines.push('END:VCALENDAR');
    const blob=new Blob([lines.join('\r\n')+'\r\n'],{type:'text/calendar;charset=utf-8'});
    const url=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=url;a.download='Minha_Trilha_Rotina_Estudos.ics';a.style.display='none';document.body.appendChild(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),5000);
  }
  $('#downloadCalendar')?.addEventListener('click',makeCalendar);
})();
