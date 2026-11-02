# RF-13 — Histórico de conversas

## Objetivo
Permitir consultar, organizar e reabrir conversas anteriores.

## Atores
- Usuário autenticado.

## Operações
- Listar conversas.
- Abrir conversa.
- Visualizar mensagens.
- Ordenar por atividade recente.
- Renomear.
- Arquivar.

## Requisitos
- A listagem deve respeitar workspace e usuário.
- Conversas arquivadas não devem aparecer na lista principal, salvo filtro.
- A ordenação deve ser consistente.
- A paginação deve ser considerada desde o início.
- Mensagens devem ser carregadas em ordem.

## Critérios de aceite
- O usuário visualiza suas conversas recentes.
- Uma conversa aberta mostra seu histórico completo ou paginado corretamente.
- Conversa arquivada deixa de aparecer na visão padrão.
- Usuário não consegue acessar conversa de outro workspace.

## Fora do escopo inicial
- Busca semântica no histórico.
- Compartilhamento de conversas.
- Exportação avançada.
