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

## Especificação spec-driven

### User story
Como usuário, quero administrar meus assistentes sem alterar silenciosamente o histórico de execuções anteriores.

### Pré-condições
- O usuário está autenticado.
- O assistente pertence ao workspace acessível.

### Cenários de aceitação

#### Cenário 1
Quando o usuário listar assistentes, então somente os autorizados devem aparecer.

#### Cenário 2
Quando o usuário editar um assistente, então novos usos devem receber a configuração atualizada.

#### Cenário 3
Quando um assistente for desativado, então ele não deve ser oferecido para novas conversas.

#### Cenário 4
Quando uma configuração for alterada, então gerações anteriores devem continuar auditáveis.

### Regras de negócio
- Execuções devem armazenar snapshot de modelo, instruções e parâmetros.
- Exclusão não pode quebrar referências históricas.
- Operações devem validar workspace e usuário.

### Invariantes
- Histórico não depende do estado atual do assistente.
- Assistente inativo não inicia nova execução.

### Erros e respostas esperadas

- `404` quando o assistente não existir.
- `403` quando estiver fora do escopo autorizado.
- `409` para conflito de atualização, se versionamento for usado.

### Fora do escopo deste RF
- Controle de acesso por equipe.
- Versionamento visual completo.
- Auditoria administrativa avançada.

### Definition of Done
- [ ] Fluxo principal implementado.
- [ ] Cenários de aceitação cobertos por testes.
- [ ] Autorização e isolamento por workspace validados.
- [ ] Erros públicos e logs técnicos separados.
- [ ] Observabilidade mínima adicionada.
- [ ] Documentação atualizada após a implementação.
