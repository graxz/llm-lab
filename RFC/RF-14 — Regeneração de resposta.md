# RF-14 — Regeneração de resposta

## Objetivo
Permitir solicitar uma nova resposta para uma mensagem do usuário.

## Fluxo principal
1. O usuário seleciona a última resposta ou uma resposta regenerável.
2. O sistema identifica o contexto correspondente.
3. Cria uma nova geração.
4. Chama o modelo novamente.
5. Exibe a nova resposta em streaming.
6. Persiste a tentativa separadamente.

## Requisitos
- A mensagem original do usuário deve ser preservada.
- A nova tentativa deve possuir identificador próprio.
- O histórico deve permitir auditoria das respostas.
- A interface deve indicar qual resposta está ativa.
- O sistema deve respeitar limites de uso.

## Critérios de aceite
- O usuário consegue gerar outra resposta.
- A nova resposta não duplica a mensagem do usuário.
- A tentativa anterior permanece consultável ou é substituída conforme regra documentada.
- Erro na regeneração não corrompe a resposta anterior.

## Decisão para o MVP
Registrar cada geração separadamente e exibir a última resposta como ativa.

## Especificação spec-driven

### User story
Como usuário, quero regenerar uma resposta para comparar outra tentativa mantendo a pergunta original.

### Pré-condições
- Existe uma mensagem de usuário válida.
- A conversa está ativa.
- O usuário possui cota para nova geração.

### Cenários de aceitação

#### Cenário 1
Quando o usuário regenerar uma resposta, então uma nova geração deve ser criada.

#### Cenário 2
A mensagem original deve permanecer preservada.

#### Cenário 3
Quando a nova geração falhar, então a resposta anterior não deve ser corrompida.

#### Cenário 4
A interface deve identificar qual tentativa está ativa.

### Regras de negócio
- Cada regeneração possui identificador próprio.
- O contexto usado deve ser reproduzível.
- Limites de uso são aplicados por tentativa.

### Invariantes
- Regenerar não cria nova mensagem de usuário.
- Tentativas anteriores permanecem auditáveis.

### Erros e respostas esperadas

- `400` quando não houver geração regenerável.
- `429` quando a cota for excedida.
- Falha nova não deve apagar a resposta anterior.

### Fora do escopo deste RF
- Votação automática entre modelos.
- Comparação visual avançada.
- Regeneração de mensagens antigas arbitrárias.

### Definition of Done
- [ ] Fluxo principal implementado.
- [ ] Cenários de aceitação cobertos por testes.
- [ ] Autorização e isolamento por workspace validados.
- [ ] Erros públicos e logs técnicos separados.
- [ ] Observabilidade mínima adicionada.
- [ ] Documentação atualizada após a implementação.
