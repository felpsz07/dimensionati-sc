(() => {
  const error = new URLSearchParams(location.search).get('loginError');
  if(error) document.getElementById('loginErrorMsg').textContent = error==='link' ? 'Este e-mail já possui cadastro. Entre com sua senha e use Vincular Google.' : 'Login Google cancelado ou não concluído. Tente novamente.';
  const old=app.aplicarUsuario.bind(app);
  app.aplicarUsuario=function(u){old(u); let bar=document.getElementById('usageLinks'); if(!bar){bar=document.createElement('div');bar.id='usageLinks';bar.style.cssText='padding:10px;display:flex;gap:16px;flex-wrap:wrap';document.getElementById('screen-app').prepend(bar);} bar.replaceChildren(); const link=document.createElement('a');link.href='/api/auth/google';link.textContent='Vincular Google';bar.append(link);if(u.tipo_usuario==='admin'){const a=document.createElement('a');a.href='/uso.html';a.textContent='Relatório de utilização';bar.append(a);}};
})();
