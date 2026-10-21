'use strict';
(() => {
  const $ = id => document.getElementById(id);
  const key = 'minha-trilha-qt-v1', pk = 'minha-trilha-qt-cv-v1', ck = 'minha-trilha-qt-custom-courses-v1';
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
    adsDegree:'Tecnólogo em Análise e Desenvolvimento de Sistemas',adsSchool:'',adsYear:'',postDegree:'Pós-graduação em Gestão da Qualidade, Controle e Auditoria',postSchool:'PUC Minas',auditorSchool:'',greenSchool:'FM2S',portfolio:'',
    summary:'Profissional formado em Análise e Desenvolvimento de Sistemas, com experiência em controle documental e rotinas da Qualidade Industrial e interesse em análise de dados, melhoria contínua e transformação digital.',
    experience:'',manualEducation:'',skills:'',languages:'',manualCertifications:'',extrasTitle:'',extras:'',sectionSummary:'Resumo profissional',sectionExperience:'Experiência e projetos',sectionEducation:'Formação acadêmica',sectionCourses:'Cursos e formações complementares',sectionCertifications:'Certificações profissionais',sectionSkills:'Competências e habilidades',sectionLanguages:'Idiomas'
  };
  const old = get(pk);
  let profile = {...defaults,...old,name:old.name||old.fullName||''};
  let checked = new Set((Array.isArray(get(key).completed)?get(key).completed:[]).filter(x=>typeof x==='string'));
  const done = id => checked.has(id);
  const builtInLabels = [
    ['enap-finish','Análise e Melhoria de Processos'],
    ['power-bi','Power BI e Power Query'],
    ['power-automate','Power Automate'],
    ['auditor','Formação de Auditor Interno'],
    ['green-belt','Lean Six Sigma Green Belt'],
    ['pl-300','Certificação Microsoft PL-300']
  ];
  const sanitizeCourse = o => {
    if(!o || typeof o !== 'object' || typeof o.id !== 'string' || typeof o.title !== 'string' || !o.title.trim())return null;
    const clean = k => typeof o[k] === 'string' ? o[k].slice(0,k==='cvText'?850:500) : '';
    return {id:o.id.slice(0,110),title:clean('title'),institution:clean('institution'),category:['course','education','certification'].includes(o.category)?o.category:'course',when:clean('when'),hours:clean('hours'),year:clean('year'),cost:clean('cost'),url:clean('url'),cvText:clean('cvText')};
  };
  let customCourses = (Array.isArray(get(ck).courses)?get(ck).courses:[]).map(sanitizeCourse).filter(Boolean);
  const saveCourses = () => put(ck,{courses:customCourses});
  const safeHref = u => {try { const url = new URL(u);return ['http:','https:'].includes(url.protocol)?url.href:''; }catch{return '';} };
  function builtInDefaultText(id) {
    const map={
      'enap-finish':'Análise e Melhoria de Processos — ENAP (curso concluído)',
      'power-bi':'Power BI e Power Query — Microsoft Learn (trilha de estudos concluída)',
      'power-automate':'Power Automate — Microsoft Learn (trilha de estudos concluída)',
      'auditor':'Formação de Auditor Interno — '+(profile.auditorSchool.trim()||'Instituição a informar')+' (curso concluído)',
      'green-belt':'Lean Six Sigma Green Belt — '+(profile.greenSchool.trim()||'Instituição a informar')+' (formação concluída)',
      'pl-300':'Microsoft Certified: Power BI Data Analyst Associate (PL-300) — exame aprovado'
    };
    return map[id]||'';
  }
  function courseText(id,base) {
    const t = profile.courseTexts;
    return t && Object.prototype.hasOwnProperty.call(t,id) && typeof t[id]==='string' ? t[id].trim() : base;
  }
  function customCvText(c) {
    if(c.cvText.trim())return c.cvText.trim();
    const attrs=[c.hours.trim(),c.year.trim()].filter(Boolean);
    return c.title.trim()+(c.institution.trim()?' — '+c.institution.trim():'')+(attrs.length?' ('+attrs.join(' · ')+')':'');
  }
  let copyText = '';
  function paintTimeline() {
    const originals=timeline.map((r,i) => {
      const [when,detail,title,school,cost,path,link,id,started] = r;
      const badge = done(id)?'<span class="done-pill">✓ Concluído</span>':(started&&done(started)?'<span class="done-pill">Em andamento</span>':'');
      return '<article class="timeline-item"><div class="timeline-when"><span class="step-num">'+(i+1)+'</span><span class="timeline-date">'+esc(when)+'<small>'+esc(detail)+'</small></span></div><div class="timeline-course"><strong>'+esc(title)+' '+badge+'</strong><span class="meta">'+esc(school)+'</span></div><div class="timeline-cost'+(cost==='Gratuito'?' zero':'')+'">'+esc(cost)+'</div><div class="timeline-link"><a href="'+links[path]+'" target="_blank" rel="noopener noreferrer" aria-label="'+esc(link+' — '+title)+'">'+esc(link)+' ↗</a></div></article>';
    });
    const added=customCourses.map((c,i) => {
      const badge=done(c.id)?'<span class="done-pill">✓ Concluído</span>':'';
      const url=safeHref(c.url);
      return '<article class="timeline-item"><div class="timeline-when"><span class="step-num">'+(timeline.length+i+1)+'</span><span class="timeline-date">'+esc(c.when||'A definir')+'<small>Curso adicionado</small></span></div><div class="timeline-course"><strong>'+esc(c.title)+' '+badge+'</strong><span class="meta">'+esc(c.institution||'Instituição a informar')+(c.hours?' · '+esc(c.hours):'')+'</span></div><div class="timeline-cost">'+esc(c.cost||'—')+'</div><div class="timeline-link">'+(url?'<a href="'+esc(url)+'" target="_blank" rel="noopener noreferrer">Acessar ↗</a>':'<span class="muted-link">Sem link</span>')+'</div></article>';
    });
    $('timelineList').innerHTML=[...originals,...added].join('');
  }
  function paintChecklist() {
    const base=items.map(([id,title,desc]) => '<label class="check-item"><input type="checkbox" data-check-id="'+esc(id)+'"'+(done(id)?' checked':'')+' aria-label="'+esc(title)+'"><span class="check-copy"><strong>'+esc(title)+'</strong><small>'+esc(desc)+'</small></span>'+(done(id)?'<span class="done-pill">Feito</span>':'')+'</label>');
    const custom=customCourses.map(c=>'<div class="custom-check-row"><label class="check-item"><input type="checkbox" data-check-id="'+esc(c.id)+'"'+(done(c.id)?' checked':'')+' aria-label="'+esc(c.title)+'"><span class="check-copy"><strong>'+esc(c.title)+'</strong><small>'+esc(c.institution||'Curso personalizado')+(c.hours?' · '+esc(c.hours):'')+'</small></span>'+(done(c.id)?'<span class="done-pill">Feito</span>':'')+'</label><div class="course-item-actions"><button type="button" data-edit-id="'+esc(c.id)+'" aria-label="Editar '+esc(c.title)+'">Editar</button><button type="button" data-delete-id="'+esc(c.id)+'" aria-label="Excluir '+esc(c.title)+'">Excluir</button></div></div>');
    $('checkItems').innerHTML=[...base,...custom].join('');
    const total=items.length+customCourses.length, n=[...items.map(i=>i[0]),...customCourses.map(c=>c.id)].filter(done).length;
    $('headCount').textContent=n+' de '+total;
    $('headBar').style.width=(total?n/total*100:0)+'%';
    $('tabCount').textContent=n+'/'+total;
    $('checkPercent').textContent=(total?Math.round(n/total*100):0)+'%';
    $('customCourseCount').textContent=customCourses.length?(customCourses.length+' curso(s) adicionado(s)'):'Personalize sua formação';
    $('checkItems').querySelectorAll('[data-check-id]').forEach(box=>box.addEventListener('change',()=>{
      if(box.checked)checked.add(box.dataset.checkId);else checked.delete(box.dataset.checkId);
      put(key,{...get(key),completed:[...checked]});paint();
    }));
    $('checkItems').querySelectorAll('[data-edit-id]').forEach(b=>b.addEventListener('click',()=>openCourse(b.dataset.editId)));
    $('checkItems').querySelectorAll('[data-delete-id]').forEach(b=>b.addEventListener('click',()=>{
      const c=customCourses.find(x=>x.id===b.dataset.deleteId);if(!c)return;
      if(!confirm('Excluir o curso "'+c.title+'" da sua trilha e do currículo?'))return;
      customCourses=customCourses.filter(x=>x.id!==c.id);checked.delete(c.id);
      saveCourses();put(key,{...get(key),completed:[...checked]});paint();
    }));
  }
    const byLine = v => String(v||'').split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
  function cvModel() {
    const education=[];
    if(String(profile.adsDegree||'').trim())education.push(profile.adsDegree.trim()+(profile.adsSchool?' — '+profile.adsSchool.trim():'')+(profile.adsYear?' ('+profile.adsYear.trim()+')':''));
    const postName=String(profile.postDegree||'').trim();
    if(postName && (done('puc-finish')||done('puc-enroll')))education.push(postName+' — '+(profile.postSchool.trim()||'Instituição a informar')+(done('puc-finish')?' (concluída)':' (em andamento)'));
    education.push(...byLine(profile.manualEducation));
    const courses=[];
    const cert=byLine(profile.manualCertifications);
    for(const [id] of builtInLabels) {
      if(!done(id))continue;
      const line=courseText(id,builtInDefaultText(id));
      if(line){if(id==='pl-300')cert.push(line);else courses.push(line);}
    }
    for(const c of customCourses) {
      if(!done(c.id))continue;
      const entry=customCvText(c);
      if(c.category==='education')education.push(entry);
      else if(c.category==='certification')cert.push(entry);
      else courses.push(entry);
    }
    return {name:String(profile.name||'').trim(),headline:String(profile.headline||'').trim(),contact:[profile.location,profile.email,profile.phone,profile.portfolio].map(v=>String(v||'').trim()).filter(Boolean),summary:String(profile.summary||'').trim(),exp:byLine(profile.experience),education,courses,cert,skills:byLine(profile.skills),languages:byLine(profile.languages),extrasTitle:String(profile.extrasTitle||'').trim(),extras:byLine(profile.extras)};
  }
    function sect(title,list,bullets=false) {
    if(!list.length)return '';
    return '<section class="cv-section"><h3>'+esc(title)+'</h3>'+(bullets?'<ul>'+list.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>':list.map(x=>'<p>'+esc(x)+'</p>').join(''))+'</section>';
  }
  function paintCv() {
    const m=cvModel(), out=[];
    const title=k=>String(profile[k]||'').trim();
    if(m.name)out.push(m.name.toUpperCase());
    if(m.headline)out.push(m.headline);
    if(m.contact.length)out.push(m.contact.join(' | '));
    if(out.length)out.push('');
    if(m.summary)out.push(title('sectionSummary').toUpperCase(),m.summary,'');
    if(m.exp.length)out.push(title('sectionExperience').toUpperCase(),...m.exp.map(x=>'• '+x),'');
    if(m.education.length)out.push(title('sectionEducation').toUpperCase(),...m.education.map(x=>'• '+x),'');
    if(m.courses.length)out.push(title('sectionCourses').toUpperCase(),...m.courses.map(x=>'• '+x),'');
    if(m.cert.length)out.push(title('sectionCertifications').toUpperCase(),...m.cert.map(x=>'• '+x),'');
    if(m.skills.length)out.push(title('sectionSkills').toUpperCase(),...m.skills.map(x=>'• '+x),'');
    if(m.languages.length)out.push(title('sectionLanguages').toUpperCase(),...m.languages.map(x=>'• '+x),'');
    if(m.extrasTitle&&m.extras.length)out.push(m.extrasTitle.toUpperCase(),...m.extras.map(x=>'• '+x),'');
    copyText=out.join('\n').trim();
    $('cvPaper').innerHTML='<h2 class="cv-name">'+esc(m.name||'Seu nome')+'</h2>'+(m.headline?'<p class="cv-role">'+esc(m.headline)+'</p>':'')+(m.contact.length?'<p class="cv-contact">'+m.contact.map(esc).join(' · ')+'</p>':'')+sect(title('sectionSummary'),m.summary?[m.summary]:[])+sect(title('sectionExperience'),m.exp,true)+sect(title('sectionEducation'),m.education,true)+sect(title('sectionCourses'),m.courses,true)+sect(title('sectionCertifications'),m.cert,true)+sect(title('sectionSkills'),m.skills,true)+sect(title('sectionLanguages'),m.languages,true)+(m.extrasTitle?sect(m.extrasTitle,m.extras,true):'')+(!m.courses.length&&!m.cert.length&&!done('puc-enroll')&&!done('puc-finish')?'<p class="cv-placeholder">Ao concluir cursos, suas conquistas aparecerão aqui.</p>':'');
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
    $('builtinCvTexts').innerHTML=builtInLabels.map(([id,label])=>'<label class="full">'+esc(label)+'<textarea data-cv-course="'+esc(id)+'" rows="2" maxlength="850">'+esc(courseText(id,builtInDefaultText(id)))+'</textarea></label>').join('');
    dialog.showModal();
  });
  $('closeProfile').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
  form.addEventListener('submit',e=>e.preventDefault());
  $('saveProfile').addEventListener('click',()=>{
    for(const name in defaults){const f=form.elements.namedItem(name);if(f)profile[name]=f.value;}
    const texts={...(profile.courseTexts&&typeof profile.courseTexts==='object'?profile.courseTexts:{})};
    $('builtinCvTexts').querySelectorAll('[data-cv-course]').forEach(f=>{
      const val=f.value.trim(), defaultText=builtInDefaultText(f.dataset.cvCourse);
      if(val===defaultText)delete texts[f.dataset.cvCourse];else texts[f.dataset.cvCourse]=val;
    });
    profile.courseTexts=texts;
    put(pk,{...get(pk),...profile,fullName:profile.name});
    dialog.close();paintCv();$('cvMessage').textContent='Dados atualizados neste navegador.';
  });
  const courseDialog=$('courseDialog'),courseForm=$('courseForm');
  let editingCourseId=null;
  function openCourse(id=null) {
    const course=id?customCourses.find(c=>c.id===id):null;
    editingCourseId=course?course.id:null;
    courseForm.reset();
    for(const field of ['title','institution','category','when','hours','year','cost','url','cvText']){
      const el=courseForm.elements.namedItem(field);if(el&&course)el.value=course[field]||'';
    }
    courseForm.elements.namedItem('completed').checked=!!(course&&done(course.id));
    $('courseTitle').textContent=course?'Editar curso':'Adicionar curso';
    courseDialog.showModal();
    if(!course)courseForm.elements.namedItem('title').focus();
  }
  $('addCourse').addEventListener('click',()=>openCourse());
  $('closeCourse').addEventListener('click',()=>courseDialog.close());
  courseDialog.addEventListener('click',e=>{if(e.target===courseDialog)courseDialog.close();});
  courseForm.addEventListener('submit',e=>{
    e.preventDefault();
    if(!courseForm.reportValidity())return;
    const field=k=>courseForm.elements.namedItem(k).value.trim();
    const url=field('url');
    if(url&&!safeHref(url)){courseForm.elements.namedItem('url').setCustomValidity('Informe um endereço http ou https válido.');courseForm.reportValidity();return;}
    courseForm.elements.namedItem('url').setCustomValidity('');
    const id=editingCourseId||'custom-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,9);
    const course=sanitizeCourse({id,...Object.fromEntries(['title','institution','category','when','hours','year','cost','url','cvText'].map(k=>[k,field(k)]))});
    if(!course)return;
    if(editingCourseId)customCourses=customCourses.map(c=>c.id===editingCourseId?course:c);
    else customCourses.push(course);
    if(courseForm.elements.namedItem('completed').checked)checked.add(id);else checked.delete(id);
    saveCourses();put(key,{...get(key),completed:[...checked]});
    courseDialog.close();paint();$('cvMessage').textContent='Curso salvo e integrado à sua trilha.';
  });
  courseForm.elements.namedItem('url').addEventListener('input',e=>e.target.setCustomValidity(''));
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
  $('backupData').addEventListener('click',()=>{
    const payload={version:1,exportedAt:new Date().toISOString(),profile:{...profile},completed:[...checked],courses:customCourses};
    const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
    const address=URL.createObjectURL(blob),anchor=document.createElement('a');
    anchor.href=address;anchor.download='minha-trilha-backup-'+new Date().toISOString().slice(0,10)+'.json';
    document.body.appendChild(anchor);anchor.click();anchor.remove();
    setTimeout(()=>URL.revokeObjectURL(address),1000);
    $('cvMessage').textContent='Backup criado. Guarde o arquivo para restaurar suas informações.';
  });
  $('restoreData').addEventListener('click',()=>$('backupFile').click());
  $('backupFile').addEventListener('change',async e=>{
    const file=e.target.files?.[0];if(!file)return;
    try {
      if(file.size>1024*1024)throw Error('Arquivo excede o limite de 1 MB.');
      const parsed=JSON.parse(await file.text());
      if(!parsed||parsed.version!==1||!Array.isArray(parsed.completed)||!Array.isArray(parsed.courses)||typeof parsed.profile!=='object'||!parsed.profile||Array.isArray(parsed.profile))throw Error('Este arquivo não é um backup válido do Minha Trilha.');
      if(parsed.courses.length>500)throw Error('Arquivo contém cursos em excesso.');
      if(!confirm('Restaurar este backup? As marcações, cursos e o currículo salvos neste navegador serão substituídos.'))return;
      const fresh={...defaults};
      for(const k of Object.keys(defaults))if(typeof parsed.profile[k]==='string')fresh[k]=parsed.profile[k].slice(0,6000);
      const rawTexts=parsed.profile.courseTexts;
      if(rawTexts&&typeof rawTexts==='object'&&!Array.isArray(rawTexts)){
        fresh.courseTexts={};
        for(const [id] of builtInLabels)if(typeof rawTexts[id]==='string')fresh.courseTexts[id]=rawTexts[id].slice(0,850);
      }
      const seen=new Set;
      customCourses=parsed.courses.map(sanitizeCourse).filter(c=>{if(!c||seen.has(c.id))return false;seen.add(c.id);return true;});
      const ids=new Set([...items.map(i=>i[0]),...customCourses.map(c=>c.id)]);
      checked=new Set(parsed.completed.filter(id=>typeof id==='string'&&ids.has(id)));
      profile=fresh;
      put(pk,{...profile,fullName:profile.name});put(ck,{courses:customCourses});put(key,{...get(key),completed:[...checked]});
      paint();$('cvMessage').textContent='Backup restaurado com sucesso.';
    }catch(error){$('cvMessage').textContent='Não foi possível restaurar: '+error.message;}
    finally{e.target.value='';}
  });
  $('printCv').addEventListener('click',()=>{
    document.body.classList.add('print-cv');window.print();
    setTimeout(()=>document.body.classList.remove('print-cv'),1200);
  });
  window.addEventListener('afterprint',()=>document.body.classList.remove('print-cv'));
  window.addEventListener('storage',e=>{
    if(e.key===key){checked=new Set((Array.isArray(get(key).completed)?get(key).completed:[]).filter(x=>typeof x==='string'));paint();}
    if(e.key===pk){const p=get(pk);profile={...defaults,...p,name:p.name||p.fullName||''};paintCv();}
    if(e.key===ck){customCourses=(Array.isArray(get(ck).courses)?get(ck).courses:[]).map(sanitizeCourse).filter(Boolean);paint();}
  });
  paint();
  setTab(location.hash==='#checklist'||location.hash==='#curriculo'?'checklist':'timeline',true);
})();