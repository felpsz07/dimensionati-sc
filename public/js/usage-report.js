let report;
const $=id=>document.getElementById(id);
$('inicio').value=new Date().toISOString().slice(0,7)+'-01';$('fim').value=new Date().toISOString().slice(0,10);
async function load(e){e?.preventDefault();$('export').disabled=true;$('exportUsers').disabled=true;$('rows').replaceChildren();try{const r=await fetch('/api/uso?'+new URLSearchParams({inicio:$('inicio').value,fim:$('fim').value}));const d=await r.json();if(!r.ok)throw Error(d.error);report=d;report.periodo={inicio:$('inicio').value,fim:$('fim').value};$('status').textContent=`${d.usuarios.length} pessoas distintas • ${d.usuarios.filter(u=>u.acoes>0).length} realizaram ações • ${d.usuarios.reduce((n,u)=>n+u.acessos,0)} logins`;
for(const u of d.usuarios){const tr=document.createElement('tr');for(const v of [u.nome,u.email,u.google?'Sim':'Não',... [u.primeiro,u.ultimo].map(x=>new Date(x).toLocaleString('pt-BR',{timeZone:'America/Sao_Paulo'})),u.acessos,u.acoes]){const td=document.createElement('td');td.textContent=v;tr.append(td);}$('rows').append(tr);}$('export').disabled=false;$('exportUsers').disabled=false;}catch(e){$('status').textContent=e.message;}}
$('filters').onsubmit=load;
$('export').onclick=()=>{const cell=v=>'"'+String(v??'').replace(/^[=+@\-\t\r]/,"'$&").replaceAll('"','""')+'"';const rows=[['Usuário','Nome','E-mail','Método','Ação','Status HTTP','Data UTC'],...report.eventos.map(e=>[e.usuario_id,e.nome,e.email,e.metodo,e.acao,e.resultado,e.data])];const url=URL.createObjectURL(new Blob(['\uFEFF'+rows.map(r=>r.map(cell).join(';')).join('\r\n')],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='utilizacao.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};load();

$('exportUsers').onclick=()=>{
  if (!report) return;
  const cell=v=>'"'+String(v??'').replace(/^[\s]*[=+@\-]/,"'$&").replaceAll('"','""')+'"';
  const rows=[['ID do cadastro','Nome','E-mail','Login Google no período','Primeiro acesso ou ação (UTC)','Último acesso ou ação (UTC)','Quantidade de logins','Ações concluídas','Início do período (UTC)','Fim do período (UTC)'],
    ...report.usuarios.map(u=>[u.id,u.nome,u.email,u.google?'Sim':'Não',u.primeiro,u.ultimo,u.acessos,u.acoes,report.periodo.inicio,report.periodo.fim])];
  const url=URL.createObjectURL(new Blob(['\uFEFF'+rows.map(row=>row.map(cell).join(';')).join('\r\n')],{type:'text/csv;charset=utf-8'}));
  const a=document.createElement('a');a.href=url;a.download='usuarios-'+report.periodo.inicio+'-a-'+report.periodo.fim+'.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
};
