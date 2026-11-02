# RF-15 — Cancelamento de geração

## Objetivo
Permitir interromper uma resposta que ainda está sendo gerada.

## Fluxo principal
1. O usuário solicita cancelamento.
2. O cliente sinaliza a execução correspondente.
3. O backend aborta a chamada quando suportado.
4. O stream é encerrado.
5. A geração é marcada como `cancelled`.
6. O conteúdo parcial é tratado explicitamente.

## Requisitos
- O cancelamento deve atingir somente a geração solicitada.
- O sistema deve usar cancelamento cooperativo quando possível.
- Uma geração cancelada não pode ser marcada como concluída.
- O frontend deve parar de aguardar eventos.
- Recursos e conexões devem ser liberados.

## Critérios de aceite
- Uma resposta em andamento pode ser cancelada.
- Nenhum novo fragmento é exibido após o encerramento confirmado.
- O histórico informa que a geração foi cancelada.
- O usuário consegue iniciar outra tentativa.

## Implementação sugerida
Usar `AbortController` entre API, gateway e adaptador do provedor.

## Especificação spec-driven

### User story
Como usuário, quero cancelar uma geração em andamento para recuperar controle da conversa e dos recursos.

### Pré-condições
- Existe uma geração em estado pending ou streaming.
- O usuário tem acesso à geração.

### Cenários de aceitação

#### Cenário 1
Quando o usuário cancelar uma geração, então o backend deve sinalizar abort quando suportado.

#### Cenário 2
Após o cancelamento, a geração deve ficar cancelled e não completed.

#### Cenário 3
Quando o cancelamento terminar, então o cliente deve parar de aguardar fragmentos.

#### Cenário 4
O usuário deve poder iniciar uma nova tentativa.

### Regras de negócio
- Cancelamento afeta somente a geração identificada.
- Conteúdo parcial deve ser explicitamente marcado.
- Conexões e recursos devem ser liberados.

### Invariantes
- Uma geração terminal não volta para streaming.
- Cancelamento não altera mensagens de outras conversas.

### Erros e respostas esperadas

- `404` para geração inexistente.
- `409` quando a geração já estiver em estado terminal.
- Cancelamento deve ser idempotente.

### Fora do escopo deste RF
- Cancelamento retroativo de respostas concluídas.
- Pausa e retomada de geração.

### Definition of Done
- [ ] Fluxo principal implementado.
- [ ] Cenários de aceitação cobertos por testes.
- [ ] Autorização e isolamento por workspace validados.
- [ ] Erros públicos e logs técnicos separados.
- [ ] Observabilidade mínima adicionada.
- [ ] Documentação atualizada após a implementação.
