# RF-16 — Feedback da resposta

## Objetivo
Capturar a avaliação do usuário sobre a qualidade de uma resposta.

## Atores
- Usuário autenticado.

## Dados
- Tipo: positivo ou negativo.
- Comentário opcional.
- Usuário.
- Mensagem.
- Geração.
- Data.

## Fluxo principal
1. O usuário avalia uma resposta.
2. O sistema valida sua relação com a conversa.
3. O feedback é persistido.
4. A interface confirma o registro.

## Requisitos
- Apenas o autor ou participante autorizado pode avaliar.
- Deve existir no máximo um feedback ativo por usuário e geração, salvo histórico explícito.
- Comentários devem possuir limite de tamanho.
- Feedback deve ser associado à geração exata, não apenas à conversa.

## Critérios de aceite
- O usuário consegue marcar positivo ou negativo.
- O usuário consegue adicionar comentário opcional.
- Um feedback pode ser atualizado.
- Feedback de resposta inexistente ou não autorizada é rejeitado.

## Uso futuro
Os dados poderão alimentar avaliação humana, datasets de regressão e análise de qualidade.
