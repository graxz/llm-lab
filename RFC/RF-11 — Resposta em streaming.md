# RF-11 — Resposta em streaming

## Objetivo
Exibir progressivamente a resposta gerada, sem aguardar o conteúdo completo.

## Estados da geração
- `pending`;
- `streaming`;
- `completed`;
- `failed`;
- `cancelled`.

## Fluxo principal
1. A mensagem do usuário é persistida.
2. Uma geração é criada como `pending`.
3. O gateway inicia o stream.
4. Fragmentos são enviados ao cliente.
5. O frontend atualiza a mensagem em andamento.
6. Ao final, o conteúdo completo é persistido.
7. A geração muda para `completed`.

## Requisitos
- O cliente deve distinguir fragmentos de evento final.
- A conexão deve tratar desconexão.
- O conteúdo parcial não pode ser confundido com resposta concluída.
- O stream deve possuir encerramento explícito.
- A geração deve possuir identificador rastreável.

## Critérios de aceite
- O texto aparece progressivamente na interface.
- A resposta final é persistida após o encerramento.
- Falha durante o stream marca a geração como `failed`.
- Reabertura da conversa exibe o resultado persistido.

## Decisão inicial sugerida
Usar Server-Sent Events para transportar eventos unidirecionais do backend para o frontend.
