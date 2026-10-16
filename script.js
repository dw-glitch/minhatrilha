'use strict';
(() => {
  const $ = id => document.getElementById(id);
  const key = 'minha-trilha-qt-v1', pk = 'minha-trilha-qt-cv-v1';
  const get = k => { try { const v=JSON.parse(localStorage.getItem(k)||'{}'); return v && typeof v === 'object' ? v : {}; } catch { return {}; } };
  const put = (k,v) => { try {localStorage.setItem(k,JSON.stringify(v));} catch {} };
  const esc = v => String(v??'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const links = {
    enap:'https://www.escolavirtual.gov.br/curso/424',
    puc:'https://vemprapuc.pucminas.br/gestao-da-qualidade-controle-e-auditoria-ead-com-videoaulas',
    bi:'https://learn.microsoft.com/pt-br/training/paths/prepare-visualize-data-power-bi/',
    auto:'https://learn.microsoft.com/pt-br/training/paths/automate-process-power-automate/',
    auditor:'https://ead.target-q.com/loja/catalogo/sgi-auditor-interno-iso-90012026-iso-140012026-e-iso-45001_70/',
    green:'https://www.fm2s.com.br/cursos/green-belt',
    pl:'https://learn.microsoft.com/pt-br/credentials/certifications/data-analyst-associate/'
  };
  const items = [
    ['enap-finish','Análise e Melhoria de Processos','ENAP · 20 horas'],
    ['puc-enroll','Iniciar a pós-graduação','Marque somente após a matrícula'],
    ['puc-finish','Concluir a pós-graduação','Gestão da Qualidade, Controle e Auditoria'],
    ['power-bi','Power BI e Power Query','Microsoft Learn · trilha concluída'],
    ['power-automate','Power Automate','Microsoft Learn · trilha concluída'],
    ['auditor','Formação de Auditor Interno','Curso e avaliação concluídos'],
    ['green-belt','Lean Six Sigma Green Belt','Formação e avaliação concluídas'],
    ['pl-300','Certificação Microsoft PL-300','Somente após aprovação no exame']
  ];
  const timeline = [
    ['Out–Nov/2026','Primeiro curso','Análise e Melhoria de Processos','ENAP · 20 h · EAD','Gratuito','enap','Acessar curso','enap-finish'],
    ['Nov/2026–Abr/2028','Prioridade nº 1','Pós em Gestão da Qualidade, Controle e Auditoria','PUC Minas · EAD · 360 h','24 × R$ 260*','puc','Ver pós','puc-finish','puc-enroll'],
    ['Ao longo de 2027','Em paralelo à pós','Power BI e Power Query','Microsoft Learn · online','Gratuito','bi','Estudar','power-bi'],
    ['Ao longo de 2027','Em paralelo à pós','Power Automate','Microsoft Learn · online','Gratuito','auto','Estudar','power-automate'],
    ['Nov/2028–Fev/2029','Após a pós','Formação de Auditor Interno','Target-Q · EAD gravado','10 × R$ 95*','auditor','Ver curso','auditor'],
    ['Mar–Ago/2029','Melhoria contínua','Lean Six Sigma Green Belt','FM2S · online','12 × R$ 49,75*','green','Ver curso','green-belt'],
    ['Após preparação','Quando estiver pronto','Certificação Power BI PL-300','Microsoft · exame oficial','Exame pago','pl','Ver exame','pl-300']
  ];
  const defaults = {
    name:'',location:'',email:'',phone:'',headline:'Qualidade | Processos | Transformação Digital',
    adsSchool:'',adsYear:'',postSchool:'PUC Minas',auditorSchool:'',greenSchool:'FM2S',portfolio:'',
    summary:'Profissional formado em Análise e Desenvolvimento de Sistemas, com experiência em controle documental e rotinas da Qualidade Industrial e interesse em análise de dados, melhoria contínua e transformação digital.',
    experience:''
  };
  const old = get(pk);
  let profile = {...defaults,...old,name:old.name||old.fullName||''};
  let checked = new Set((Array.isArray(get(key).completed)?get(key).completed:[]).filter(x=>typeof x==='string'));
  const done = id => checked.has(id);
  let copyText = '';
  function paintTimeline() {
    $('timelineList').innerHTML = timeline.map((r,i) => {
      const [when,detail,title,school,cost,path,link,id,started] = r;
      const badge = done(id)?'<span class="done-pill">✓ Concluído</span>':(started&&done(started)?'<span class="done-pill">Em andamento</span>':'');
      return '<article class="timeline-item"><div class="timeline-when"><span class="step-num">'+(i+1)+'</span><span class="timeline-date">'+esc(when)+'<small>'+esc(detail)+'</small></span></div><div class="timeline-course"><strong>'+esc(title)+' '+badge+'</strong><span class="meta">'+esc(school)+'</span></div><div class="timeline-cost'+(cost==='Gratuito'?' zero':'')+'">'+esc(cost)+'</div><div class="timeline-link"><a href="'+links[path]+'" target="_blank" rel="noopener noreferrer" aria-label="'+esc(link+' — '+title)+'">'+esc(link)+' ↗</a></div></article>';
    }).join('');
  }
  function paintChecklist() {
    $('checkItems').innerHTML = items.map(([id,title,desc]) => '<label class="check-item"><input type="checkbox" data-check-id="'+id+'"'+(done(id)?' checked':'')+' aria-label="'+esc(title)+'"><span class="check-copy"><strong>'+esc(title)+'</strong><small>'+esc(desc)+'</small></span>'+(done(id)?'<span class="done-pill">Feito</span>':'')+'</label>').join('');
    const n=items.filter(i=>done(i[0])).length;
    $('headCount').textContent=n+' de '+items.length;
    $('headBar').style.width=(n/items.length*100)+'%';
    $('tabCount').textContent=n+'/'+items.length;
    $('checkPercent').textContent=Math.round(n/items.length*100)+'%';
    $('checkItems').querySelectorAll('[data-check-id]').forEach(box=>box.addEventListener('change',()=>{
      if(box.checked)checked.add(box.dataset.checkId); else checked.delete(box.dataset.checkId);
      put(key,{...get(key),completed:[...checked]});paint();
    }));
  }
  const byLine = v => String(v||'').split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
  function cvModel() {
    const education=['Tecnólogo em Análise e Desenvolvimento de Sistemas'+(profile.adsSchool?' — '+profile.adsSchool.trim():'')+(profile.adsYear?' ('+profile.adsYear.trim()+')':'')];
    if(done('puc-finish'))education.push('Pós-graduação em Gestão da Qualidade, Controle e Auditoria — '+(profile.postSchool.trim()||'Instituição a informar')+' (concluída)');
    else if(done('puc-enroll'))education.push('Pós-graduação em Gestão da Qualidade, Controle e Auditoria — '+(profile.postSchool.trim()||'Instituição a informar')+' (em andamento)');
    const courses=[];
    if(done('enap-finish'))courses.push('Análise e Melhoria de Processos — ENAP (curso concluído)');
    if(done('power-bi'))courses.push('Power BI e Power Query — Microsoft Learn (trilha de estudos concluída)');
    if(done('power-automate'))courses.push('Power Automate — Microsoft Learn (trilha de estudos concluída)');
    if(done('auditor'))courses.push('Formação de Auditor Interno — '+(profile.auditorSchool.trim()||'Instituição a informar')+' (curso concluído)');
    if(done('green-belt'))courses.push('Lean Six Sigma Green Belt — '+(profile.greenSchool.trim()||'Instituição a informar')+' (formação concluída)');
    const cert=done('pl-300')?['Microsoft Certified: Power BI Data Analyst Associate (PL-300) — exame aprovado']:[];
    return {name:profile.name.trim(),headline:profile.headline.trim(),contact:[profile.location,profile.email,profile.phone,profile.portfolio].map(v=>v.trim()).filter(Boolean),summary:profile.summary.trim(),exp:byLine(profile.experience),education,courses,cert};
  }
  function sect(title,list,bullets=false) {
    if(!list.length)return '';
    return '<section class="cv-section"><h3>'+esc(title)+'</h3>'+(bullets?'<ul>'+list.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>':list.map(x=>'<p>'+esc(x)+'</p>').join(''))+'</section>';
  }
  function paintCv() {
    const m=cvModel(), out=[];
    if(m.name)out.push(m.name.toUpperCase());
    if(m.headline)out.push(m.headline);
    if(m.contact.length)out.push(m.contact.join(' | '));
    if(out.length)out.push('');
    if(m.summary)out.push('RESUMO PROFISSIONAL',m.summary,'');
    if(m.exp.length)out.push('EXPERIÊNCIA E PROJETOS',...m.exp.map(x=>'• '+x),'');
    out.push('FORMAÇÃO ACADÊMICA',...m.education.map(x=>'• '+x));
    if(m.courses.length)out.push('','CURSOS E FORMAÇÕES COMPLEMENTARES',...m.courses.map(x=>'• '+x));
    if(m.cert.length)out.push('','CERTIFICAÇÕES PROFISSIONAIS',...m.cert.map(x=>'• '+x));
    copyText=out.join('\n').trim();
    $('cvPaper').innerHTML='<h2 class="cv-name">'+esc(m.name||'Seu nome')+'</h2>'+(m.headline?'<p class="cv-role">'+esc(m.headline)+'</p>':'')+(m.contact.length?'<p class="cv-contact">'+m.contact.map(esc).join(' · ')+'</p>':'')+sect('Resumo profissional',m.summary?[m.summary]:[])+sect('Experiência e projetos',m.exp,true)+sect('Formação acadêmica',m.education,true)+sect('Cursos e formações complementares',m.courses,true)+sect('Certificações profissionais',m.cert,true)+(!m.courses.length&&!m.cert.length&&!done('puc-enroll')&&!done('puc-finish')?'<p class="cv-placeholder">Ao concluir cursos ou iniciar a pós, suas conquistas aparecerão aqui.</p>':'');
  }
  function paint(){paintChecklist();paintTimeline();paintCv();}
  function setTab(tab,skipHash=false) {
    for(const t of ['timeline','checklist']) {
      const active=t===tab, suffix=t==='timeline'?'Timeline':'Checklist';
      $('tab'+suffix).classList.toggle('active',active);$('tab'+suffix).setAttribute('aria-selected',String(active));$('tab'+suffix).tabIndex=active?0:-1;
      $('panel'+suffix).hidden=!active;
    }
    if(!skipHash)history.replaceState(null,'',tab==='checklist'?'#checklist':'#cronograma');
  }
  document.querySelectorAll('[data-tab]').forEach(t=>t.addEventListener('click',()=>setTab(t.dataset.tab)));
  const tabs=[...document.querySelectorAll('[role="tab"]')];
  tabs.forEach((t,i)=>t.addEventListener('keydown',e=>{
    if(!['ArrowRight','ArrowLeft','Home','End'].includes(e.key))return;
    e.preventDefault();
    const n=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:tabs.length-1))%tabs.length;
    tabs[n].focus();setTab(tabs[n].dataset.tab);
  }));
  window.addEventListener('hashchange',()=>setTab(location.hash==='#checklist'||location.hash==='#curriculo'?'checklist':'timeline',true));
  $('resetChecks').addEventListener('click',()=>{
    if(!checked.size)return;
    if(!confirm('Deseja apagar as marcações deste navegador?'))return;
    checked.clear();put(key,{...get(key),completed:[]});paint();
  });
  const dialog=$('profileDialog'),form=$('profileForm');
  $('editProfile').addEventListener('click',()=>{
    for(const name in defaults){const f=form.elements.namedItem(name);if(f)f.value=profile[name]||'';}
    dialog.showModal();
  });
  $('closeProfile').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
  form.addEventListener('submit',e=>e.preventDefault());
  $('saveProfile').addEventListener('click',()=>{
    for(const name in defaults){const f=form.elements.namedItem(name);if(f)profile[name]=f.value;}
    put(pk,{...get(pk),...profile,fullName:profile.name});
    dialog.close();paintCv();$('cvMessage').textContent='Dados atualizados neste navegador.';
  });
  $('copyCv').addEventListener('click',async()=>{
    try{
      if(navigator.clipboard?.writeText)await navigator.clipboard.writeText(copyText);
      else{
        const el=document.createElement('textarea');el.value=copyText;el.style.position='fixed';el.style.opacity='0';document.body.appendChild(el);el.select();
        const ok=document.execCommand('copy');el.remove();if(!ok)throw Error('clipboard');
      }
      $('cvMessage').textContent='Currículo copiado. Revise os dados antes de enviar.';
    }catch{$('cvMessage').textContent='Cópia bloqueada. Use Salvar em PDF para obter o currículo.';}
  });
  $('printCv').addEventListener('click',()=>{
    document.body.classList.add('print-cv');window.print();
    setTimeout(()=>document.body.classList.remove('print-cv'),1200);
  });
  window.addEventListener('afterprint',()=>document.body.classList.remove('print-cv'));
  window.addEventListener('storage',e=>{
    if(e.key===key){checked=new Set((Array.isArray(get(key).completed)?get(key).completed:[]).filter(x=>typeof x==='string'));paint();}
    if(e.key===pk){const p=get(pk);profile={...defaults,...p,name:p.name||p.fullName||''};paintCv();}
  });
  paint();
  setTab(location.hash==='#checklist'||location.hash==='#curriculo'?'checklist':'timeline',true);
})();