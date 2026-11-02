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

## Especificação spec-driven

### User story
Como usuário, quero abrir uma conversa vinculada a um assistente para iniciar uma sessão de interação.

### Pré-condições
- O usuário está autenticado.
- O workspace existe e é acessível.
- O assistente está ativo e autorizado.

### Cenários de aceitação

#### Cenário 1
Dado um workspace e assistente válidos, quando o usuário criar uma conversa, então ela deve ser persistida como ativa.

#### Cenário 2
Quando a conversa for criada, então ela deve aparecer no histórico do workspace.

#### Cenário 3
Dado um assistente inexistente ou não autorizado, quando o usuário tentar criar a conversa, então a operação deve ser rejeitada.

### Regras de negócio
- A conversa possui workspaceId e assistantId.
- Status inicial é active.
- Título inicial pode ser padrão ou informado pelo usuário.

### Invariantes
- Toda conversa pertence a exatamente um workspace.
- A conversa não pode referenciar assistente fora do escopo autorizado.

### Erros e respostas esperadas

- `400` para dados incompletos.
- `404` para assistente ou workspace inexistente.
- `403` para recurso não autorizado.

### Fora do escopo deste RF
- Compartilhamento de conversa.
- Conversas públicas.
- Importação de histórico externo.

### Definition of Done
- [ ] Fluxo principal implementado.
- [ ] Cenários de aceitação cobertos por testes.
- [ ] Autorização e isolamento por workspace validados.
- [ ] Erros públicos e logs técnicos separados.
- [ ] Observabilidade mínima adicionada.
- [ ] Documentação atualizada após a implementação.
