# Login Google e comprovação de utilização

Configure GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET e GOOGLE_REDIRECT_URI no ambiente do servidor. Crie um cliente OAuth do tipo Aplicativo Web no Google Cloud e cadastre exatamente a URI de retorno (local: http://localhost:3000/api/auth/google/callback). Em produção use HTTPS e NODE_ENV=production. Configure a tela de consentimento e usuários de teste quando o projeto estiver em teste. Nunca publique o segredo do cliente.

Referência: https://developers.google.com/identity/openid-connect/openid-connect

Reinicie o servidor. O botão Entrar com Google iniciará a autenticação. Contas existentes devem entrar primeiro com senha e selecionar Vincular Google; não vinculamos automaticamente contas locais por coincidência de e-mail. Novas contas Google recebem perfil solicitante e dados institucionais não informados, que devem ser completados nas configurações antes de produzir documentos.

Administradores acessam Relatório de utilização no topo da aplicação. O filtro usa dias UTC e os horários são exibidos em Brasília. O CSV contém cada login/operação, autor, resultado HTTP e data. Somente operações POST feitas com sessão válida são contadas como ações; impressão no navegador, geração local e envio de e-mail atual não são comprovados por este registro. Não há importação de acessos anteriores. Contas locais não são apresentadas como verificadas pelo Google. Contagens de pessoas são por cadastro, não uma prova de identidade civil.

Sessões duram 8 horas e usam cookies HttpOnly/SameSite, com Secure em produção. A API do relatório consulta o perfil no banco, nunca o perfil enviado pelo navegador. Novos cadastros públicos não podem criar administradores. Não registre tokens ou senhas em relatórios. Defina prazo de retenção e política de acesso antes de disponibilizar publicamente.

Limitação existente: as demais APIs legadas ainda precisam de revisão completa de autorização; esta implementação protege a nova API de relatório, sem certificar a segurança de todo o sistema. Testar login real exige as credenciais Google e interação do titular da conta.
