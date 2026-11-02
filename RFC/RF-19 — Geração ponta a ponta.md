# RF-19 — Geração ponta a ponta

## Objetivo
Conectar mensagem, montagem de contexto, gateway e persistência em um fluxo real de geração de resposta.

## Fluxo
1. O usuário autenticado envia uma mensagem.
2. A mensagem é persistida com idempotência.
3. O sistema cria uma geração `pending`.
4. O contexto é montado.
5. O gateway chama um adaptador configurado.
6. Eventos de geração são emitidos ao cliente.
7. Deltas são acumulados.
8. A resposta final é persistida.
9. A geração muda para `completed`, `failed` ou `cancelled`.

## Requisitos
- O domínio não importa SDK de provedor.
- Toda geração possui `generationId`.
- A resposta só é concluída após persistência.
- Falha não cria mensagem concluída falsa.
- O fluxo deve possuir adaptador fake determinístico para testes.
- O adaptador real será configurado por ambiente, sem secrets no código.
- O endpoint deve validar autenticação e acesso à conversa.

## Critérios de aceite
- Uma mensagem válida inicia uma geração.
- O adaptador fake produz uma resposta observável em testes.
- O histórico contém a resposta concluída após o fluxo.
- Falha do gateway marca a geração como `failed`.
- Retry com a mesma chave não cria mensagem duplicada.
- A troca do adaptador não altera o domínio.

## Fora do escopo
- RAG.
- Tool calling.
- Fila distribuída.
- Observabilidade avançada.

## Definition of Done
- [ ] RFC aprovada e implementada.
- [ ] Endpoint integrado.
- [ ] Adaptador fake coberto por testes.
- [ ] Persistência da geração integrada.
- [ ] Fluxo de sucesso e falha testado.
- [ ] Documentação atualizada.
