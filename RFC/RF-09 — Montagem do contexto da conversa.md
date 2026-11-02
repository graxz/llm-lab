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
