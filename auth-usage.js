const crypto = require('node:crypto');
const { OAuth2Client } = require('google-auth-library');
module.exports = function install(app, db) {
  db.exec(`CREATE TABLE IF NOT EXISTS perfis_confirmados (usuario_id INTEGER PRIMARY KEY, data TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS identidades_google (sub TEXT PRIMARY KEY, usuario_id INTEGER UNIQUE NOT NULL);
    CREATE TABLE IF NOT EXISTS sessoes_uso (token TEXT PRIMARY KEY, usuario_id INTEGER NOT NULL, expira INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS eventos_uso (id INTEGER PRIMARY KEY, usuario_id INTEGER NOT NULL, nome TEXT NOT NULL, email TEXT NOT NULL, metodo TEXT NOT NULL, acao TEXT NOT NULL, resultado INTEGER NOT NULL, data TEXT NOT NULL);
    CREATE INDEX IF NOT EXISTS eventos_uso_data ON eventos_uso(data);`);
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URI);
  const cookie = (req, name) => (req.headers.cookie || '').split('; ').find(v => v.startsWith(name + '='))?.slice(name.length + 1);
  const options = { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/' };
  const hash = x => crypto.createHash('sha256').update(x).digest('hex');
  function record(u, method, action, status = 200) { db.prepare('INSERT INTO eventos_uso(usuario_id,nome,email,metodo,acao,resultado,data) VALUES(?,?,?,?,?,?,?)').run(u.id,u.nome,u.email,method,action,status,new Date().toISOString()); }
  function session(req) { const token = cookie(req, 'dim_session'); return token ? db.prepare('SELECT u.* FROM sessoes_uso s JOIN usuarios u ON u.id=s.usuario_id WHERE token=? AND expira>?').get(hash(token),Date.now()) : null; }
  function start(req,res,u,method) {
    const old = cookie(req,'dim_session'); if(old) db.prepare('DELETE FROM sessoes_uso WHERE token=?').run(hash(old));
    db.prepare('DELETE FROM sessoes_uso WHERE expira<?').run(Date.now());
    const token = crypto.randomBytes(32).toString('hex');
    db.prepare('INSERT INTO sessoes_uso VALUES(?,?,?)').run(hash(token),u.id,Date.now()+8*3600000);
    res.cookie('dim_session',token,{...options,maxAge:8*3600000}); record(u,method,'login');
  }
  app.use((req,res,next)=>{
    req.authUser = session(req);
    if(req.authUser) req.authUser.cadastro_pendente = req.authUser.tipo_usuario !== 'admin' && !db.prepare('SELECT 1 FROM perfis_confirmados WHERE usuario_id=?').get(req.authUser.id);
    if (req.method === 'POST' && req.headers.origin && req.headers.origin !== (process.env.GOOGLE_REDIRECT_URI ? new URL(process.env.GOOGLE_REDIRECT_URI).origin : `${req.protocol}://${req.get('host')}`)) return res.status(403).json({error:'Origem não permitida.'});
    if(req.authUser?.cadastro_pendente && req.method==='POST' && !['/api/auth/perfil','/api/auth/logout','/api/login'].includes(req.path)) return res.status(403).json({error:'Informe seu local de trabalho e matrícula antes de continuar.'});
    const send = res.json.bind(res);
    res.json = data => { if(['/api/login','/api/cadastro'].includes(req.path) && data.success && data.usuario) { data.usuario.cadastro_pendente = data.usuario.tipo_usuario !== 'admin' && !db.prepare('SELECT 1 FROM perfis_confirmados WHERE usuario_id=?').get(data.usuario.id); start(req,res,data.usuario,'senha'); } return send(data); };
    if(req.authUser && req.method === 'POST' && !req.path.startsWith('/api/auth') && !['/api/login','/api/cadastro'].includes(req.path)) {
      res.on('finish',()=>record(req.authUser,'sessao',req.path,res.statusCode));
    }
    next();
  });
  app.post('/api/auth/perfil',(req,res)=>{
    const u=req.authUser;
    if(!u) return res.status(401).json({error:'Entre novamente.'});
    if(!u.cadastro_pendente) return res.status(409).json({error:'Cadastro já confirmado.'});
    const {instituicaoNome,matricula}=req.body;
    const nome = typeof instituicaoNome === 'string' ? instituicaoNome.trim().replace(/\s+/g,' ') : '';
    if(nome.length<3 || nome.length>180 || /[<>\x00-\x1f]/.test(nome) || typeof matricula!=='string' || !matricula.trim() || matricula.trim().length>80) return res.status(400).json({error:'Informe o nome completo da escola/unidade (3 a 180 caracteres) e sua matrícula (até 80 caracteres).'});
    const normalizar = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().replace(/\s+/g,' ').toLocaleLowerCase('pt-BR');
    db.exec('BEGIN');
    try {
      let inst=db.prepare("SELECT * FROM instituicoes WHERE ativo=1 AND municipio='Lages'").all().find(i=>normalizar(i.nome)===normalizar(nome));
      if(!inst) {
        const id=db.prepare("INSERT INTO instituicoes(nome,tipo,secretaria,municipio,ativo) VALUES(?,'escola','Secretaria Municipal de Educação','Lages',1)").run(nome).lastInsertRowid;
        inst=db.prepare('SELECT * FROM instituicoes WHERE id=?').get(id);
      }
      db.prepare('UPDATE usuarios SET instituicao_id=?,setor=?,orgao=?,municipio=?,matricula=? WHERE id=?').run(inst.id,inst.nome,inst.secretaria,inst.municipio,matricula.trim(),u.id);
      db.prepare('INSERT INTO perfis_confirmados VALUES(?,?)').run(u.id,new Date().toISOString());
      record(u,'sessao','cadastro_institucional_confirmado');
      db.exec('COMMIT');res.json({success:true});
    } catch {db.exec('ROLLBACK');res.status(500).json({error:'Não foi possível salvar. Tente novamente.'});}
  });
  app.get('/api/auth/me',(req,res)=> { if(!req.authUser) return res.status(401).json({error:'Entre novamente.'}); const {senha,...u}=req.authUser; u.atividades_padrao=JSON.parse(u.atividades_padrao||'[]'); res.json({usuario:u}); });
  app.post('/api/auth/logout',(req,res)=>{ const token=cookie(req,'dim_session'); if(token) db.prepare('DELETE FROM sessoes_uso WHERE token=?').run(hash(token)); res.clearCookie('dim_session',options); res.json({success:true}); });
  app.get('/api/auth/google',(req,res)=>{
    if(!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_REDIRECT_URI) return res.status(503).send('Login Google ainda não configurado pelo administrador.');
    const state=crypto.randomBytes(32).toString('hex');
    res.cookie('dim_oauth',state,{...options,maxAge:600000});
    res.redirect(client.generateAuthUrl({scope:['openid','email','profile'],state,nonce:state,prompt:'select_account'}));
  });
  app.get('/api/auth/google/callback',async(req,res)=>{
    const state=cookie(req,'dim_oauth'); res.clearCookie('dim_oauth',options);
    if(!state || state!==req.query.state || typeof req.query.code!=='string') return res.redirect('/?loginError=google');
    try {
      const {tokens}=await client.getToken(req.query.code);
      const ticket=await client.verifyIdToken({idToken:tokens.id_token,audience:process.env.GOOGLE_CLIENT_ID});
      const p=ticket.getPayload();
      if(!p.email_verified || p.nonce!==state || !p.sub) throw Error('Identidade inválida');
      let u=db.prepare('SELECT u.* FROM identidades_google g JOIN usuarios u ON u.id=g.usuario_id WHERE sub=?').get(p.sub);
      if(!u) {
        // Existing accounts must link while signed in, preventing takeover of seeded/local accounts.
        u=db.prepare('SELECT * FROM usuarios WHERE LOWER(email)=?').get(p.email.toLowerCase());
        if(u && req.authUser?.id!==u.id) return res.redirect('/?loginError=link');
        if(!u) {
          const result=db.prepare("INSERT INTO usuarios(nome,email,senha,cargo,orgao,setor,matricula,atividades_padrao,tipo_usuario) VALUES(?,?,?,'Não informado','Não informado','Não informado','','[1,2]','diretora')").run(p.name||p.email,p.email.toLowerCase(),crypto.randomBytes(48).toString('hex'));
          u=db.prepare('SELECT * FROM usuarios WHERE id=?').get(result.lastInsertRowid);
        }
        db.prepare('INSERT INTO identidades_google VALUES(?,?)').run(p.sub,u.id);
      }
      start(req,res,u,'google'); res.redirect('/');
    } catch { res.redirect('/?loginError=google'); }
  });
  app.get('/api/uso',(req,res)=>{
    if(!req.authUser) return res.status(401).json({error:'Entre novamente.'});
    if(req.authUser.tipo_usuario!=='admin') return res.status(403).json({error:'Acesso exclusivo da administração.'});
    const {inicio='2000-01-01',fim='2100-01-01'}=req.query;
    if(![inicio,fim].every(x=>typeof x==='string' && /^\d{4}-\d{2}-\d{2}$/.test(x)) || inicio>fim) return res.status(400).json({error:'Período inválido.'});
    const eventos=db.prepare('SELECT e.*,u.setor AS escola,u.matricula FROM eventos_uso e JOIN usuarios u ON u.id=e.usuario_id WHERE e.data>=? AND e.data<=? ORDER BY e.data DESC,e.id DESC').all(inicio+'T00:00:00.000Z',fim+'T23:59:59.999Z');
    const users=new Map();
    for(const e of eventos) { if(!users.has(e.usuario_id)) users.set(e.usuario_id,{id:e.usuario_id,nome:e.nome,email:e.email,escola:e.escola,matricula:e.matricula,primeiro:e.data,ultimo:e.data,acessos:0,acoes:0,google:false}); const u=users.get(e.usuario_id); u.primeiro=e.data; if(e.acao==='login') {u.acessos++; if(e.metodo==='google') u.google=true;} else if(e.resultado<400) u.acoes++; }
    res.set('Cache-Control','no-store').json({usuarios:[...users.values()],eventos});
  });
};
