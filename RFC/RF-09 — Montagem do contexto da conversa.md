# RF-09 — Montagem do contexto da conversa

## Objetivo
Construir a entrada enviada ao modelo a partir das instruções e do histórico da conversa.

## Composição
1. Instruções do assistente.
2. Histórico relevante.
3. Nova mensagem do usuário.
4. Parâmetros de geração.

## Fluxo principal
1. O sistema carrega o assistente e seu snapshot aplicável.
2. Carrega as mensagens em ordem.
3. Aplica a política de limite de contexto.
4. Monta a estrutura interna esperada pelo gateway.
5. Registra metadados necessários para auditoria.

## Requisitos
- As mensagens devem manter a ordem correta.
- O limite de contexto deve ser respeitado.
- O truncamento deve seguir uma política previsível.
- A mensagem atual não pode ser omitida silenciosamente.
- Dados sensíveis devem obedecer às regras de retenção e logs.

## Critérios de aceite
- O modelo recebe instruções e histórico na ordem correta.
- Contextos acima do limite são reduzidos de modo determinístico.
- A nova pergunta sempre está presente ou o sistema rejeita a execução.
- O contexto utilizado pode ser diagnosticado com segurança.

## Fora do escopo inicial
- Resumo automático de histórico.
- RAG.
- Memória de longo prazo.

## Especificação spec-driven

### User story
Como sistema, quero montar um contexto determinístico para que o modelo receba instruções e histórico relevantes.

### Pré-condições
- A conversa e o assistente foram carregados.
- A mensagem atual foi validada.
- Existe uma política de limite de contexto.

### Cenários de aceitação

#### Cenário 1
Dado um histórico válido, quando o contexto for montado, então as mensagens devem preservar a ordem.

#### Cenário 2
Quando o histórico exceder o limite, então o truncamento deve seguir política determinística.

#### Cenário 3
Quando o modelo for chamado, então a mensagem atual deve estar presente ou a execução deve falhar explicitamente.

### Regras de negócio
- Instruções do assistente precedem o histórico.
- O contexto deve respeitar limite de tokens ou caracteres configurado.
- Truncamento não pode ocorrer silenciosamente sem metadado.

### Invariantes
- O contexto utilizado pode ser identificado pela geração.
- A ordem semântica das mensagens mantidas é preservada.

### Erros e respostas esperadas

- `400` para contexto impossível de montar.
- `413` quando o contexto mínimo exceder o limite.
- `500` para falha inesperada na montagem.

### Fora do escopo deste RF
- RAG.
- Memória de longo prazo.
- Resumo automático de histórico.

### Definition of Done
- [ ] Fluxo principal implementado.
- [ ] Cenários de aceitação cobertos por testes.
- [ ] Autorização e isolamento por workspace validados.
- [ ] Erros públicos e logs técnicos separados.
- [ ] Observabilidade mínima adicionada.
- [ ] Documentação atualizada após a implementação.
