# RF-06 — Listagem e edição de assistentes

## Objetivo
Permitir administrar os assistentes criados dentro de um workspace.

## Atores
- Usuário autenticado.

## Operações
- Listar assistentes.
- Consultar detalhes.
- Editar configuração.
- Ativar ou desativar.
- Excluir, quando permitido.

## Requisitos
- Todas as operações devem validar usuário e `workspaceId`.
- Assistente inativo não pode iniciar novas conversas, salvo regra explícita.
- O histórico não pode ser alterado silenciosamente por uma edição posterior.
- A execução deve registrar as instruções, modelo e parâmetros usados no momento.

## Critérios de aceite
- O usuário visualiza apenas assistentes autorizados.
- Uma edição aparece em novos usos.
- Conversas antigas permanecem auditáveis.
- Assistente desativado não é oferecido para novas conversas.
- A exclusão não quebra o histórico já existente.

## Decisão de histórico
Cada geração deve guardar um snapshot mínimo da configuração usada:
- instruções;
- modelo;
- parâmetros;
- identificador da versão, se existir.
