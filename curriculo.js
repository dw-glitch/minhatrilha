'use strict';
(() => {
  const itemKey='minha-trilha-qt-v1',profileKey='minha-trilha-qt-cv-v1';
  const $=id=>document.getElementById(id);
  if(!$('cvPreview') || !$('checklistItems'))return;
  const defaults={
    fullName:'',location:'',email:'',phone:'',
    headline:'Qualidade | Processos | Transformação Digital',
    adsSchool:'',adsYear:'',postSchool:'PUC Minas',auditorSchool:'',greenSchool:'FM2S',
    portfolio:'',
    summary:'Profissional com formação em Análise e Desenvolvimento de Sistemas e experiência em controle documental e rotinas da Qualidade Industrial, com interesse em melhoria contínua, análise de dados e transformação digital.',
    experience:''
  };
  const readJSON=(key)=>{try {const data=JSON.parse(localStorage.getItem(key)||'{}');return data&&typeof data==='object'?data:{};}catch{return {};}};
  const inputNames=Object.keys(defaults);
  const profile={...defaults,...readJSON(profileKey)};
  for(const name of inputNames){if(typeof profile[name]!=='string')profile[name]=defaults[name];}
  const form=$('cvProfileForm');
  inputNames.forEach(name=>{const field=form.elements.namedItem(name);if(field)field.value=profile[name];});
  const safe=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const textLines=(value)=>String(value||'').split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
  let currentText='';
  function makeModel(){
    const marked=new Set((Array.isArray(readJSON(itemKey).completed)?readJSON(itemKey).completed:[]).filter(v=>typeof v==='string'));
    const degree='Tecnólogo em Análise e Desenvolvimento de Sistemas'+(profile.adsSchool?' — '+profile.adsSchool:'')+(profile.adsYear?' ('+profile.adsYear+')':'');
    const education=[degree];
    if(marked.has('puc-finish'))education.push('Pós-graduação em Gestão da Qualidade, Controle e Auditoria — '+(profile.postSchool.trim()||'Instituição a confirmar')+' (concluída)');
    else if(marked.has('puc-enroll'))education.push('Pós-graduação em Gestão da Qualidade, Controle e Auditoria — '+(profile.postSchool.trim()||'Instituição a confirmar')+' (em andamento)');
    const courses=[];
    if(marked.has('enap-finish'))courses.push('Análise e Melhoria de Processos — ENAP (curso concluído)');
    if(marked.has('power-bi'))courses.push('Power BI e Power Query — Microsoft Learn (trilha concluída; não é a certificação PL-300)');
    if(marked.has('power-automate'))courses.push('Introdução ao Power Automate — Microsoft Learn (trilha concluída)');
    if(marked.has('auditor'))courses.push('Formação de Auditor Interno — '+(profile.auditorSchool.trim()||'informar instituição emissora')+' (curso concluído)');
    if(marked.has('green-belt'))courses.push('Lean Six Sigma Green Belt — '+(profile.greenSchool.trim()||'informar instituição emissora')+' (formação concluída)');
    const certifications=[];
    if(marked.has('pl-300'))certifications.push('Microsoft Certified: Power BI Data Analyst Associate (PL-300) — aprovado no exame');
    const contact=[profile.location,profile.email,profile.phone,profile.portfolio].map(s=>s.trim()).filter(Boolean);
    return {name:profile.fullName.trim(),headline:profile.headline.trim(),contact,summary:profile.summary.trim(),experience:textLines(profile.experience),education,courses,certifications};
  }
  function asText(model){
    const lines=[];
    if(model.name)lines.push(model.name.toUpperCase());
    if(model.headline)lines.push(model.headline);
    if(model.contact.length)lines.push(model.contact.join(' | '));
    if(lines.length)lines.push('');
    if(model.summary)lines.push('RESUMO PROFISSIONAL',model.summary,'');
    if(model.experience.length)lines.push('EXPERIÊNCIA E PROJETOS',...model.experience.map(x=>'• '+x),'');
    lines.push('FORMAÇÃO ACADÊMICA',...model.education.map(x=>'• '+x));
    if(model.courses.length)lines.push('','CURSOS E FORMAÇÕES COMPLEMENTARES',...model.courses.map(x=>'• '+x));
    if(model.certifications.length)lines.push('','CERTIFICAÇÕES PROFISSIONAIS',...model.certifications.map(x=>'• '+x));
    return lines.join('\n').trim();
  }
  function section(title,items,isList=false){
    if(!items.length)return '';
    const body=isList?'<ul>'+items.map(item=>'<li>'+safe(item)+'</li>').join('')+'</ul>':items.map(item=>'<p>'+safe(item)+'</p>').join('');
    return '<section class="cv-section"><h4>'+safe(title)+'</h4>'+body+'</section>';
  }
  function render(){
    const m=makeModel();currentText=asText(m);
    const cv=$('cvPreview');
    cv.innerHTML='<header class="cv-head"><span class="cv-eyebrow">PRÉVIA PARA ATUALIZAR SEU CURRÍCULO</span><h3>'+safe(m.name||'SEU NOME')+'</h3>'+
      (m.headline?'<p class="cv-headline">'+safe(m.headline)+'</p>':'')+
      (m.contact.length?'<p class="cv-contacts">'+m.contact.map(safe).join(' · ')+'</p>':'')+
      (!m.name?'<p class="cv-fill-note">Personalize seus dados na aba ao lado antes de copiar.</p>':'')+'</header>'+
      (m.summary?section('Resumo profissional',[m.summary]):'')+
      section('Experiência e projetos',m.experience,true)+
      section('Formação acadêmica',m.education,true)+
      section('Cursos e formações complementares',m.courses,true)+
      section('Certificações profissionais',m.certifications,true);
    const notices=[];
    if(!m.courses.length&&!m.certifications.length)notices.push('Marque uma formação concluída para vê-la aqui.');
    if(m.education.some(x=>x.includes('Instituição a confirmar')))notices.push('Informe a instituição da pós em Personalizar meus dados.');
    if(m.courses.some(x=>x.includes('informar instituição')))notices.push('Informe a instituição emissora dos certificados no formulário.');
    $('cvFeedback').textContent=notices.join(' ');
  }
  function switchTab(view){
    for(const target of ['Preview','Edit']){
      const active=view===target,tab=$('cvTab'+target),panel=$('cvPanel'+target);
      tab.classList.toggle('is-active',active);tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;panel.hidden=!active;
    }
    if(view==='Preview')render();
  }
  $('cvTabPreview').addEventListener('click',()=>switchTab('Preview'));
  $('cvTabEdit').addEventListener('click',()=>switchTab('Edit'));
  $('cvBack').addEventListener('click',()=>switchTab('Preview'));
  form.addEventListener('input',e=>{
    const name=e.target.name;
    if(!inputNames.includes(name))return;
    profile[name]=e.target.value;
    try{localStorage.setItem(profileKey,JSON.stringify(profile));}catch{}
    render();
  });
  // Checklist already persists progress in script.js; we listen to the same real checkbox change.
  $('checklistItems').addEventListener('change',()=>queueMicrotask(render));
  $('resetChecklist').addEventListener('click',()=>queueMicrotask(render));
  window.addEventListener('storage',e=>{if([itemKey,profileKey].includes(e.key)){if(e.key===profileKey){Object.assign(profile,defaults,readJSON(profileKey));inputNames.forEach(name=>{const f=form.elements.namedItem(name);if(f)f.value=profile[name];});}render();}});
  function feedback(message){$('cvFeedback').textContent=message;}
  $('cvCopy').addEventListener('click',async()=>{
    try{
      if(navigator.clipboard?.writeText)await navigator.clipboard.writeText(currentText);
      else{
        const box=document.createElement('textarea');box.value=currentText;box.style.position='fixed';box.style.opacity='0';document.body.appendChild(box);box.select();
        const copied=document.execCommand('copy');box.remove();if(!copied)throw Error('cópia indisponível');
      }
      feedback('Currículo copiado! Revise e cole no Word, Google Docs ou no modelo que preferir.');
    }catch{feedback('O navegador impediu a cópia. Use “Baixar texto (.txt)” para obter o currículo.');}
  });
  $('cvDownload').addEventListener('click',()=>{
    const blob=new Blob(['\uFEFF'+currentText],{type:'text/plain;charset=utf-8'});
    const url=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=url;a.download='Minha_Trilha_Curriculo.txt';document.body.appendChild(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),3000);
    feedback('Arquivo de currículo gerado. Confira os dados antes de enviar a recrutadores.');
  });
  let printing=false;
  const clearPrint=()=>{printing=false;document.body.classList.remove('print-curriculo');};
  window.addEventListener('afterprint',clearPrint);
  $('cvPrint').addEventListener('click',()=>{
    if(printing)return;
    printing=true;switchTab('Preview');document.body.classList.add('print-curriculo');
    window.print();setTimeout(clearPrint,1500);
  });
  render();
})();