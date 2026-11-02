# RF-18 — Tratamento de erros visíveis

## Objetivo
Apresentar falhas de forma compreensível ao usuário e manter detalhes técnicos para diagnóstico.

## Categorias mínimas
- Credenciais inválidas.
- Sessão expirada.
- Recurso inexistente.
- Falta de permissão.
- Modelo indisponível.
- Timeout.
- Limite excedido.
- Falha do provedor.
- Erro de validação.
- Erro interno inesperado.

## Requisitos
- Mensagens públicas não devem expor segredos ou stack traces.
- Erros devem possuir códigos internos estáveis.
- Logs devem conter contexto suficiente para investigação.
- Streaming deve emitir encerramento ou falha identificável.
- O usuário deve saber quando pode tentar novamente.

## Critérios de aceite
- Erros de validação aparecem junto ao campo ou ação correspondente.
- Falha do provedor informa que a geração não foi concluída.
- Timeout permite nova tentativa quando apropriado.
- Usuário sem permissão não recebe dados do recurso.
- Logs técnicos permitem correlacionar erro com usuário, conversa e geração sem registrar segredos.

## Princípio
Separar o erro técnico interno da mensagem segura apresentada ao usuário.

## Especificação spec-driven

### User story
Como usuário, quero receber mensagens claras quando algo falhar para saber o que corrigir ou se posso tentar novamente.

### Pré-condições
- Uma operação foi iniciada.
- O sistema consegue classificar o erro ou usar uma categoria genérica segura.

### Cenários de aceitação

#### Cenário 1
Quando ocorrer erro de validação, então a interface deve indicar o campo ou ação inválida.

#### Cenário 2
Quando o provedor falhar, então a interface deve informar que a geração não foi concluída.

#### Cenário 3
Quando ocorrer timeout recuperável, então o usuário deve poder tentar novamente.

#### Cenário 4
Quando faltar autorização, então nenhum dado protegido deve ser retornado.

### Regras de negócio
- Erro público não expõe stack trace, segredo ou prompt sensível.
- Erros internos possuem códigos estáveis.
- Logs possuem correlação com usuário, conversa e geração.

### Invariantes
- Mensagem pública e diagnóstico interno são separados.
- Erro não deixa operação em estado ambíguo.

### Erros e respostas esperadas

- Cada erro deve possuir categoria e código estáveis.
- Falhas desconhecidas devem retornar mensagem genérica segura.
- Stack traces e segredos ficam restritos aos logs internos.

### Fora do escopo deste RF
- Central de suporte.
- Auto-remediação completa.
- Alertas operacionais avançados.

### Definition of Done
- [ ] Fluxo principal implementado.
- [ ] Cenários de aceitação cobertos por testes.
- [ ] Autorização e isolamento por workspace validados.
- [ ] Erros públicos e logs técnicos separados.
- [ ] Observabilidade mínima adicionada.
- [ ] Documentação atualizada após a implementação.
