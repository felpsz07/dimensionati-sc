(() => {
  const error = new URLSearchParams(location.search).get('loginError');
  if (error) {
    const el = document.getElementById('loginErrorMsg');
    if (el) {
      el.textContent = error === 'link'
        ? 'Este e-mail já possui cadastro. Entre com sua senha e acesse "Minha Conta" para vincular ao Google.'
        : 'Login Google cancelado ou não concluído. Tente novamente.';
    }
  }
})();
