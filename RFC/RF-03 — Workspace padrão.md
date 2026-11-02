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

## Especificação spec-driven

### User story
Como novo usuário, quero receber um workspace inicial para ter um contexto de trabalho imediatamente disponível.

### Pré-condições
- O cadastro do usuário foi validado.
- Ainda não existe workspace inicial para o usuário.

### Cenários de aceitação

#### Cenário 1
Dado um novo usuário, quando o cadastro for concluído, então um workspace inicial deve ser criado.

#### Cenário 2
Dado o workspace inicial, quando o usuário acessar a plataforma, então ele deve estar selecionado ou ser selecionável.

### Regras de negócio
- O workspace deve possuir identificador único.
- O workspace deve estar associado ao usuário criador.
- Recursos futuros devem referenciar workspaceId.

### Invariantes
- Todo usuário novo possui pelo menos um workspace acessível.
- Usuários não podem acessar workspaces de terceiros.

### Erros e respostas esperadas

- `409` quando já existe workspace inicial incompatível.
- `500` quando a criação atômica falhar.

### Fora do escopo deste RF
- Colaboração entre membros.
- Convites.
- Papéis avançados.

### Definition of Done
- [ ] Fluxo principal implementado.
- [ ] Cenários de aceitação cobertos por testes.
- [ ] Autorização e isolamento por workspace validados.
- [ ] Erros públicos e logs técnicos separados.
- [ ] Observabilidade mínima adicionada.
- [ ] Documentação atualizada após a implementação.
