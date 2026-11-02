# RF-10 — Chamada ao modelo de linguagem

## Objetivo
Enviar o contexto ao modelo por meio de uma camada de integração isolada do domínio.

## Atores e componentes
- API de conversas.
- AI Gateway.
- Adaptador do provedor.
- Modelo de linguagem.

## Fluxo principal
1. A aplicação solicita uma geração ao gateway.
2. O gateway valida modelo e parâmetros.
3. O adaptador traduz o contrato interno para o provedor.
4. O provedor processa a solicitação.
5. O adaptador normaliza a resposta.
6. O gateway devolve resultado ou stream ao domínio.

## Requisitos
- O domínio não deve importar SDK específico de provedor.
- Deve haver timeout configurável.
- Erros externos devem ser convertidos para erros internos conhecidos.
- O modelo e seus parâmetros usados devem ser registrados.
- Chaves e segredos devem permanecer fora do código e dos logs.

## Critérios de aceite
- Uma conversa consegue solicitar resposta usando o gateway.
- Trocar o adaptador não exige alterar o domínio de conversas.
- Modelo inválido é rejeitado antes da chamada externa.
- Timeout e falhas do provedor são tratados de forma previsível.

## Contrato conceitual
Entrada: mensagens, modelo, temperatura, limite de saída e opções de stream.

Saída: stream ou resposta normalizada contendo conteúdo, uso, modelo e metadados.

## Especificação spec-driven

### User story
Como plataforma, quero chamar modelos através de um gateway para desacoplar o domínio dos provedores externos.

### Pré-condições
- O contexto foi montado.
- O modelo está habilitado.
- As credenciais do provedor estão disponíveis no ambiente.

### Cenários de aceitação

#### Cenário 1
Dada uma solicitação válida, quando o gateway chamar o adaptador, então o contrato interno deve ser traduzido para o provedor.

#### Cenário 2
Dado timeout ou falha externa, quando a chamada terminar, então um erro normalizado deve ser devolvido.

#### Cenário 3
Quando uma resposta for recebida, então modelo e uso devem ser registrados quando disponíveis.

### Regras de negócio
- Domínio não importa SDK de provedor.
- Timeout e limites são configuráveis.
- Segredos nunca aparecem em logs.

### Invariantes
- Trocar o adaptador não exige alterar o caso de uso de conversa.
- Toda chamada possui um identificador de geração.

### Erros e respostas esperadas

- `400` para parâmetros incompatíveis.
- `408` para timeout.
- `429` para limite do provedor.
- `502` para falha externa normalizada.

### Fora do escopo deste RF
- Roteamento inteligente avançado.
- Fine-tuning.
- Execução de código gerado.

### Definition of Done
- [ ] Fluxo principal implementado.
- [ ] Cenários de aceitação cobertos por testes.
- [ ] Autorização e isolamento por workspace validados.
- [ ] Erros públicos e logs técnicos separados.
- [ ] Observabilidade mínima adicionada.
- [ ] Documentação atualizada após a implementação.
