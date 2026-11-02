# RF-02 — Login e logout

## Objetivo
Permitir autenticar um usuário e encerrar sua sessão com segurança.

## Atores
- Usuário não autenticado.
- Usuário autenticado.

## Fluxo principal de login
1. O usuário informa e-mail e senha.
2. O sistema localiza a conta.
3. O sistema valida a senha.
4. O sistema cria ou renova a sessão.
5. O usuário acessa a plataforma.

## Fluxo de logout
1. O usuário solicita sair.
2. O sistema invalida ou encerra a sessão.
3. O usuário volta para a área pública.

## Requisitos
- Credenciais inválidas não devem revelar se o e-mail existe.
- Rotas protegidas exigem sessão válida.
- Sessões expiradas devem ser rejeitadas.
- O logout deve invalidar a sessão atual.

## Critérios de aceite
- Credenciais válidas permitem acesso.
- Credenciais inválidas são rejeitadas.
- Usuário sem sessão não acessa dados protegidos.
- Após logout, a sessão não pode mais ser usada.

## Erros esperados
- Credenciais inválidas.
- Sessão expirada.
- Sessão ausente.
- Conta desativada.

## Especificação spec-driven

### User story
Como usuário cadastrado, quero iniciar e encerrar minha sessão para acessar a plataforma com segurança.

### Pré-condições
- A conta existe.
- A conta não está desativada para o fluxo de login.

### Cenários de aceitação

#### Cenário 1
Dadas credenciais válidas, quando o usuário fizer login, então uma sessão autenticada deve ser criada.

#### Cenário 2
Dadas credenciais inválidas, quando o usuário tentar login, então o acesso deve ser rejeitado sem revelar qual campo falhou.

#### Cenário 3
Dada uma sessão válida, quando o usuário fizer logout, então a sessão não poderá mais autenticar requisições.

### Regras de negócio
- A sessão deve possuir expiração.
- Rotas protegidas exigem sessão válida.
- Mensagens de erro não devem permitir enumeração de contas.
- Cookies de sessão devem usar configurações seguras em produção.

### Invariantes
- Uma sessão encerrada não autoriza novas requisições.
- Credenciais nunca aparecem em logs.

### Erros e respostas esperadas

- `401` para credenciais inválidas ou sessão ausente.
- `403` para conta desativada quando aplicável.
- `500` sem expor mecanismo de autenticação.

### Fora do escopo deste RF
- Recuperação de senha.
- MFA.
- Login social.

### Definition of Done
- [ ] Fluxo principal implementado.
- [ ] Cenários de aceitação cobertos por testes.
- [ ] Autorização e isolamento por workspace validados.
- [ ] Erros públicos e logs técnicos separados.
- [ ] Observabilidade mínima adicionada.
- [ ] Documentação atualizada após a implementação.
