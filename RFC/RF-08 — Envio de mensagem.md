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

## Especificação spec-driven

### User story
Como usuário, quero enviar uma mensagem em uma conversa e iniciar a geração de uma resposta.

### Pré-condições
- O usuário está autenticado.
- A conversa existe, está ativa e é acessível.
- O conteúdo não está vazio.

### Cenários de aceitação

#### Cenário 1
Dado conteúdo válido, quando o usuário enviar uma mensagem, então ela deve ser persistida antes da chamada externa.

#### Cenário 2
Dada uma mensagem duplicada por retry do cliente, quando a mesma chave de idempotência for usada, então apenas uma mensagem deve ser criada.

#### Cenário 3
Dado conteúdo vazio ou acima do limite, quando o usuário enviar, então a operação deve ser rejeitada.

### Regras de negócio
- A ordem das mensagens deve ser determinística.
- Mensagem do usuário é persistida antes da geração.
- O limite de tamanho é validado no backend.

### Invariantes
- Uma mensagem aceita possui conversa e autor válidos.
- O envio não cria duplicatas para a mesma operação idempotente.

### Erros e respostas esperadas

- `400` para conteúdo inválido.
- `404` para conversa inexistente.
- `409` para chave de idempotência conflitante.
- `403` para conversa não autorizada.

### Fora do escopo deste RF
- Anexos.
- Edição de mensagens antigas.
- Mensagens multimodais.

### Definition of Done
- [ ] Fluxo principal implementado.
- [ ] Cenários de aceitação cobertos por testes.
- [ ] Autorização e isolamento por workspace validados.
- [ ] Erros públicos e logs técnicos separados.
- [ ] Observabilidade mínima adicionada.
- [ ] Documentação atualizada após a implementação.
