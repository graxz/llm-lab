# RF-12 — Persistência da resposta

## Objetivo
Salvar a resposta gerada e os metadados da execução de forma auditável.

## Dados mínimos
- Conteúdo completo.
- Conversa e mensagem relacionadas.
- Modelo utilizado.
- Parâmetros de geração.
- Status final.
- Duração.
- Tokens de entrada e saída, quando disponíveis.
- Custo estimado, quando disponível.
- Erro técnico, quando houver.

## Fluxo principal
1. A geração é criada antes da chamada externa.
2. Fragmentos são acumulados durante o stream.
3. O resultado final é validado.
4. A mensagem do assistente é persistida.
5. A geração é marcada como concluída.

## Requisitos
- A resposta só é `completed` após persistência bem-sucedida.
- Falhas devem preservar o diagnóstico sem expor segredos.
- Tentativas distintas devem ser identificáveis.
- O histórico deve sobreviver a recarregamentos do cliente.

## Critérios de aceite
- Resposta concluída aparece após reabrir a conversa.
- Falha do provedor não cria uma resposta concluída falsa.
- Uso e custo são armazenados quando o provedor informar esses dados.
- Uma nova tentativa não sobrescreve indevidamente a tentativa anterior.
