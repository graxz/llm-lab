# RF-07 — Criação de conversa

## Objetivo
Permitir iniciar uma conversa vinculada a um workspace e a um assistente.

## Atores
- Usuário autenticado.

## Dados mínimos
- Identificador.
- `workspaceId`.
- Usuário criador.
- `assistantId`.
- Título.
- Status.
- Datas de criação e atualização.

## Fluxo principal
1. O usuário seleciona um workspace.
2. Seleciona um assistente ativo.
3. Solicita nova conversa.
4. O sistema valida o acesso.
5. A conversa é criada.
6. O usuário é direcionado para a tela de chat.

## Requisitos
- O assistente deve pertencer ao workspace ou estar autorizado nele.
- O usuário deve ter acesso ao workspace.
- O status inicial deve ser `active`.
- O título inicial pode ser definido pelo usuário ou receber um valor padrão.

## Critérios de aceite
- Uma conversa válida é criada e persistida.
- A conversa aparece no histórico.
- A conversa pode receber mensagens.
- Não é possível criar conversa com assistente inexistente ou não autorizado.
