const {test}=require('node:test');const assert=require('node:assert/strict');const express=require('express');const {DatabaseSync}=require('node:sqlite');
test('sessões, isolamento administrativo, registros e logout',async()=>{
 const db=new DatabaseSync(':memory:');db.exec(`CREATE TABLE usuarios(id INTEGER PRIMARY KEY,nome TEXT,email TEXT,senha TEXT,tipo_usuario TEXT,atividades_padrao TEXT); INSERT INTO usuarios VALUES(1,'Admin','admin@example.test','x','admin','[]'),(2,'Pessoa','p@example.test','x','diretora','[]')`);
 const app=express();app.use(express.json());require('./auth-usage')(app,db);db.exec("ALTER TABLE usuarios ADD COLUMN instituicao_id INTEGER; ALTER TABLE usuarios ADD COLUMN setor TEXT; ALTER TABLE usuarios ADD COLUMN orgao TEXT; ALTER TABLE usuarios ADD COLUMN municipio TEXT; ALTER TABLE usuarios ADD COLUMN matricula TEXT; CREATE TABLE instituicoes(id INTEGER PRIMARY KEY,nome TEXT,secretaria TEXT,municipio TEXT,ativo INTEGER); INSERT INTO instituicoes VALUES(1,'Escola teste','Educação','Lages',1)");app.post('/api/login',(req,res)=>res.json({success:true,usuario:db.prepare('SELECT * FROM usuarios WHERE id=?').get(req.body.id)}));app.post('/api/demandas',(req,res)=>res.json({ok:true}));const server=app.listen(0);await new Promise(r=>server.once('listening',r));const base='http://localhost:'+server.address().port;
 try{assert.equal((await fetch(base+'/api/uso?tipoUsuario=admin')).status,401);
 const login=async id=>{const r=await fetch(base+'/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})});return r.headers.get('set-cookie').split(';')[0];};
 const user=await login(2);assert.equal((await fetch(base+'/api/uso',{headers:{cookie:user}})).status,403);assert.equal((await fetch(base+'/api/demandas',{method:'POST',headers:{cookie:user}})).status,403);
 const save=body=>fetch(base+'/api/auth/perfil',{method:'POST',headers:{cookie:user,'Content-Type':'application/json'},body:JSON.stringify(body)});
 assert.equal((await save({instituicaoId:1,matricula:' '})).status,400);
 assert.equal((await save({instituicaoId:999,matricula:'123'})).status,400);
 assert.equal((await save({instituicaoId:1,matricula:'123'})).status,200);
 assert.equal(db.prepare('SELECT matricula FROM usuarios WHERE id=2').get().matricula,'123');
 const me=await fetch(base+'/api/auth/me',{headers:{cookie:user}}).then(r=>r.json());assert.equal(me.usuario.cadastro_pendente,false);
 assert.equal((await save({instituicaoId:1,matricula:'456'})).status,409);
 await fetch(base+'/api/demandas',{method:'POST',headers:{cookie:user}});
 const admin=await login(1);const adminMe=await fetch(base+'/api/auth/me',{headers:{cookie:admin}}).then(r=>r.json());assert.equal(adminMe.usuario.cadastro_pendente,false);const report=await fetch(base+'/api/uso',{headers:{cookie:admin}}).then(r=>r.json());assert.equal(report.usuarios.length,2);assert.equal(report.usuarios.find(u=>u.id===2).acoes,2);assert.equal(report.usuarios.find(u=>u.id===2).google,false);
 assert.equal((await fetch(base+'/api/uso?inicio=invalid',{headers:{cookie:admin}})).status,400);
 await fetch(base+'/api/auth/logout',{method:'POST',headers:{cookie:admin}});assert.equal((await fetch(base+'/api/uso',{headers:{cookie:admin}})).status,401);
 assert.equal((await fetch(base+'/api/auth/google/callback?state=fake&code=fake',{redirect:'manual'})).status,302);
 }finally{await new Promise(r=>server.close(r));db.close();}
});
