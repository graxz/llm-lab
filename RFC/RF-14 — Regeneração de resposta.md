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
