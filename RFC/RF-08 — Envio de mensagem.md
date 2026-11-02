# RF-08 — Envio de mensagem

## Objetivo
Permitir que o usuário envie uma mensagem textual em uma conversa.

## Atores
- Usuário autenticado.

## Dados da mensagem
- Conteúdo.
- Autor.
- Tipo: `user`, `assistant` ou `system`.
- Ordem ou sequência.
- Data de criação.
- Status.
- Conversa associada.

## Fluxo principal
1. O usuário escreve uma mensagem.
2. O cliente valida campos básicos.
3. A API valida autenticação e acesso à conversa.
4. O sistema rejeita conteúdo vazio ou excessivo.
5. A mensagem é persistida.
6. A execução da resposta é iniciada.

## Requisitos
- Mensagens vazias não são aceitas.
- Deve existir limite máximo de tamanho.
- A conversa deve estar ativa.
- O envio deve aceitar uma chave de idempotência.
- A ordem das mensagens deve ser determinística.

## Critérios de aceite
- Mensagem válida é persistida uma única vez.
- Mensagem inválida retorna erro compreensível.
- Usuário sem acesso não consegue enviar mensagens.
- A mensagem persistida participa da montagem do contexto.
