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

## Especificação spec-driven

### User story
Como plataforma, quero persistir o resultado e os metadados de cada tentativa para permitir histórico e diagnóstico.

### Pré-condições
- Existe uma geração registrada.
- O conteúdo final ou parcial foi recebido.
- A conversa continua acessível.

### Cenários de aceitação

#### Cenário 1
Quando uma geração terminar com sucesso, então conteúdo e metadados devem ser persistidos.

#### Cenário 2
Quando o provedor falhar, então a tentativa deve ser marcada como failed com diagnóstico seguro.

#### Cenário 3
Quando houver retry, então uma nova tentativa deve ser identificável sem sobrescrever indevidamente a anterior.

### Regras de negócio
- Resposta só é completed após persistência bem-sucedida.
- Uso, latência e custo são armazenados quando disponíveis.
- Erros não incluem segredos.

### Invariantes
- Toda geração possui status final explícito.
- Histórico reaberto reproduz o conteúdo persistido.

### Erros e respostas esperadas

- Geração marcada como `failed` quando a persistência final falhar.
- Retry não deve sobrescrever a tentativa anterior.
- Falha de persistência deve gerar log correlacionável.

### Fora do escopo deste RF
- Retenção configurável.
- Exportação de dados.
- Arquivamento em storage externo.

### Definition of Done
- [ ] Fluxo principal implementado.
- [ ] Cenários de aceitação cobertos por testes.
- [ ] Autorização e isolamento por workspace validados.
- [ ] Erros públicos e logs técnicos separados.
- [ ] Observabilidade mínima adicionada.
- [ ] Documentação atualizada após a implementação.
