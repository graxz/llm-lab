# RF-18 — Tratamento de erros visíveis

## Objetivo
Apresentar falhas de forma compreensível ao usuário e manter detalhes técnicos para diagnóstico.

## Categorias mínimas
- Credenciais inválidas.
- Sessão expirada.
- Recurso inexistente.
- Falta de permissão.
- Modelo indisponível.
- Timeout.
- Limite excedido.
- Falha do provedor.
- Erro de validação.
- Erro interno inesperado.

## Requisitos
- Mensagens públicas não devem expor segredos ou stack traces.
- Erros devem possuir códigos internos estáveis.
- Logs devem conter contexto suficiente para investigação.
- Streaming deve emitir encerramento ou falha identificável.
- O usuário deve saber quando pode tentar novamente.

## Critérios de aceite
- Erros de validação aparecem junto ao campo ou ação correspondente.
- Falha do provedor informa que a geração não foi concluída.
- Timeout permite nova tentativa quando apropriado.
- Usuário sem permissão não recebe dados do recurso.
- Logs técnicos permitem correlacionar erro com usuário, conversa e geração sem registrar segredos.

## Princípio
Separar o erro técnico interno da mensagem segura apresentada ao usuário.
