# RF-04 — Listagem de workspaces

## Objetivo
Permitir que o usuário visualize os workspaces aos quais pertence e selecione o contexto de trabalho.

## Atores
- Usuário autenticado.

## Fluxo principal
1. O usuário acessa a lista de workspaces.
2. O sistema retorna apenas os workspaces autorizados.
3. O usuário visualiza nome e informações resumidas.
4. O usuário seleciona um workspace ativo.

## Informações exibidas
- Identificador.
- Nome.
- Data de criação.
- Quantidade de conversas, se disponível.
- Quantidade de assistentes, se disponível.

## Requisitos
- A consulta deve ser filtrada pelo usuário autenticado.
- Nenhum workspace de outro usuário pode ser exposto.
- A seleção deve permanecer disponível durante a navegação.

## Critérios de aceite
- O usuário visualiza seu workspace padrão.
- A resposta não contém workspaces não autorizados.
- O workspace selecionado é usado nas operações seguintes.

## Fora do escopo
- Convites e colaboração entre membros.
- Papéis avançados de workspace.
