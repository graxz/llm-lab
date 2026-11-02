# RF-03 — Workspace padrão

## Objetivo
Garantir que todo usuário tenha um ambiente inicial para organizar assistentes e conversas.

## Atores
- Usuário autenticado.
- Sistema.

## Fluxo principal
1. O usuário conclui o cadastro.
2. O sistema cria um workspace inicial.
3. O workspace é associado ao usuário.
4. O workspace é definido como selecionado ou padrão.
5. O usuário pode iniciar uma conversa nele.

## Requisitos
- O workspace deve possuir identificador único.
- O nome inicial deve ser definido pelo produto.
- O usuário deve ter acesso ao workspace criado.
- Recursos futuros devem referenciar `workspaceId`.

## Critérios de aceite
- Todo usuário novo possui exatamente um workspace inicial.
- O workspace aparece na área autenticada.
- O usuário consegue criar uma conversa dentro dele.
- Usuários diferentes não compartilham acidentalmente o workspace.

## Erros esperados
- Falha na criação do workspace.
- Workspace não encontrado.
- Usuário sem permissão de acesso.
