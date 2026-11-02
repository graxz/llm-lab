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

## Especificação spec-driven

### User story
Como usuário, quero visualizar a resposta progressivamente para reduzir a espera percebida.

### Pré-condições
- Uma geração foi criada.
- O cliente possui conexão de stream.
- O provedor suporta streaming ou existe fallback definido.

### Cenários de aceitação

#### Cenário 1
Quando a geração iniciar, então seu estado deve mudar para streaming.

#### Cenário 2
Enquanto fragmentos chegarem, então o cliente deve atualizar o conteúdo progressivamente.

#### Cenário 3
Quando o stream terminar, então um evento final deve ser emitido e a geração deve poder ser persistida.

#### Cenário 4
Quando houver falha, então o cliente deve receber um evento de erro e a geração não pode ser marcada como concluída.

### Regras de negócio
- Estados permitidos são pending, streaming, completed, failed e cancelled.
- Cada evento pertence a uma geração.
- Desconexão do cliente deve liberar recursos.

### Invariantes
- Geração failed ou cancelled nunca é completed.
- Fragmentos não podem ser atribuídos a outra conversa.

### Erros e respostas esperadas

- Evento de erro associado à geração.
- Geração marcada como `failed` em falha de stream.
- Nenhum erro deve expor credenciais ou resposta interna do provedor.

### Fora do escopo deste RF
- Colaboração em tempo real bidirecional.
- Edição colaborativa do texto.

### Definition of Done
- [ ] Fluxo principal implementado.
- [ ] Cenários de aceitação cobertos por testes.
- [ ] Autorização e isolamento por workspace validados.
- [ ] Erros públicos e logs técnicos separados.
- [ ] Observabilidade mínima adicionada.
- [ ] Documentação atualizada após a implementação.
