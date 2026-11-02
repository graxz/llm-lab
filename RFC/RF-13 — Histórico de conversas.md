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

## Especificação spec-driven

### User story
Como usuário, quero consultar e reabrir minhas conversas anteriores dentro do workspace autorizado.

### Pré-condições
- O usuário está autenticado.
- A conversa pertence a um workspace acessível.

### Cenários de aceitação

#### Cenário 1
Quando o usuário listar conversas, então elas devem ser ordenadas por atividade recente.

#### Cenário 2
Quando o usuário abrir uma conversa, então suas mensagens devem aparecer em ordem.

#### Cenário 3
Quando uma conversa for arquivada, então ela deve deixar a lista principal sem ser apagada indevidamente.

#### Cenário 4
Quando outro usuário tentar acessar a conversa, então o acesso deve ser rejeitado.

### Regras de negócio
- Listagens devem respeitar workspace e usuário.
- Paginação deve ser determinística.
- Arquivamento altera visibilidade, não necessariamente remove dados.

### Invariantes
- Nenhuma conversa fora da autorização aparece.
- Mensagens preservam sua ordenação.

### Erros e respostas esperadas

- `401` para sessão ausente.
- `403` para conversa de outro workspace.
- `404` quando a conversa não existir.

### Fora do escopo deste RF
- Busca semântica no histórico.
- Compartilhamento.
- Exportação avançada.

### Definition of Done
- [ ] Fluxo principal implementado.
- [ ] Cenários de aceitação cobertos por testes.
- [ ] Autorização e isolamento por workspace validados.
- [ ] Erros públicos e logs técnicos separados.
- [ ] Observabilidade mínima adicionada.
- [ ] Documentação atualizada após a implementação.
