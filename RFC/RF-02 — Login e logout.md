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
