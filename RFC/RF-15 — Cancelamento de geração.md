# RF-15 — Cancelamento de geração

## Objetivo
Permitir interromper uma resposta que ainda está sendo gerada.

## Fluxo principal
1. O usuário solicita cancelamento.
2. O cliente sinaliza a execução correspondente.
3. O backend aborta a chamada quando suportado.
4. O stream é encerrado.
5. A geração é marcada como `cancelled`.
6. O conteúdo parcial é tratado explicitamente.

## Requisitos
- O cancelamento deve atingir somente a geração solicitada.
- O sistema deve usar cancelamento cooperativo quando possível.
- Uma geração cancelada não pode ser marcada como concluída.
- O frontend deve parar de aguardar eventos.
- Recursos e conexões devem ser liberados.

## Critérios de aceite
- Uma resposta em andamento pode ser cancelada.
- Nenhum novo fragmento é exibido após o encerramento confirmado.
- O histórico informa que a geração foi cancelada.
- O usuário consegue iniciar outra tentativa.

## Implementação sugerida
Usar `AbortController` entre API, gateway e adaptador do provedor.
