# RF-05 — Criação de assistente

## Objetivo
Permitir configurar um assistente reutilizável para orientar as respostas do modelo.

## Atores
- Usuário autenticado.

## Dados
- Nome.
- Descrição opcional.
- Instruções do sistema.
- Modelo.
- Temperatura.
- Status ativo/inativo.
- Workspace associado.

## Fluxo principal
1. O usuário abre a criação de assistente.
2. Informa nome e instruções.
3. Seleciona modelo e parâmetros.
4. O sistema valida os dados.
5. O assistente é persistido no workspace.

## Requisitos
- O nome é obrigatório.
- As instruções devem respeitar o limite definido.
- O modelo deve pertencer à lista permitida.
- A temperatura deve estar no intervalo aceito pelo provedor.
- O assistente deve pertencer ao workspace do usuário.

## Critérios de aceite
- Dados válidos criam um assistente.
- O assistente aparece na lista do workspace.
- Suas instruções são usadas quando ele é selecionado em uma conversa.
- Dados inválidos não criam registros parciais.

## Erros esperados
- Nome ausente.
- Instruções excedendo o limite.
- Modelo indisponível.
- Temperatura inválida.
- Workspace sem permissão.

## Especificação spec-driven

### User story
Como usuário, quero criar um assistente com instruções e parâmetros próprios para reutilizar uma configuração de IA.

### Pré-condições
- O usuário está autenticado.
- Existe um workspace selecionado.
- O modelo informado está habilitado.

### Cenários de aceitação

#### Cenário 1
Dada uma configuração válida, quando o usuário criar um assistente, então ele deve ser persistido no workspace.

#### Cenário 2
Quando o assistente for usado em uma conversa, então suas instruções e parâmetros devem ser considerados.

#### Cenário 3
Dado um modelo inválido ou temperatura fora do intervalo, quando o usuário salvar, então a operação deve ser rejeitada.

### Regras de negócio
- Nome e instruções possuem limites definidos.
- Modelo deve vir da lista permitida pelo backend.
- Temperatura deve ser validada antes da persistência.
- O assistente pertence a um workspace.

### Invariantes
- Assistente não atravessa o limite de autorização do workspace.
- Assistente criado possui status explícito.

### Erros e respostas esperadas

- `400` para configuração inválida.
- `404` para workspace inexistente.
- `403` para workspace sem acesso.

### Fora do escopo deste RF
- Publicação pública de assistentes.
- Marketplace.
- Versionamento avançado de prompts.

### Definition of Done
- [ ] Fluxo principal implementado.
- [ ] Cenários de aceitação cobertos por testes.
- [ ] Autorização e isolamento por workspace validados.
- [ ] Erros públicos e logs técnicos separados.
- [ ] Observabilidade mínima adicionada.
- [ ] Documentação atualizada após a implementação.
