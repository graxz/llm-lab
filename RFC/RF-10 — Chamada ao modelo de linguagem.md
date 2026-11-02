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
