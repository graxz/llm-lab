# RF-16 — Feedback da resposta

## Objetivo
Capturar a avaliação do usuário sobre a qualidade de uma resposta.

## Atores
- Usuário autenticado.

## Dados
- Tipo: positivo ou negativo.
- Comentário opcional.
- Usuário.
- Mensagem.
- Geração.
- Data.

## Fluxo principal
1. O usuário avalia uma resposta.
2. O sistema valida sua relação com a conversa.
3. O feedback é persistido.
4. A interface confirma o registro.

## Requisitos
- Apenas o autor ou participante autorizado pode avaliar.
- Deve existir no máximo um feedback ativo por usuário e geração, salvo histórico explícito.
- Comentários devem possuir limite de tamanho.
- Feedback deve ser associado à geração exata, não apenas à conversa.

## Critérios de aceite
- O usuário consegue marcar positivo ou negativo.
- O usuário consegue adicionar comentário opcional.
- Um feedback pode ser atualizado.
- Feedback de resposta inexistente ou não autorizada é rejeitado.

## Uso futuro
Os dados poderão alimentar avaliação humana, datasets de regressão e análise de qualidade.

## Especificação spec-driven

### User story
Como usuário, quero avaliar uma resposta para registrar se ela foi útil e permitir melhorias futuras.

### Pré-condições
- O usuário está autenticado.
- A mensagem e a geração existem e são acessíveis.

### Cenários de aceitação

#### Cenário 1
Quando o usuário marcar positivo ou negativo, então o feedback deve ser associado à geração exata.

#### Cenário 2
Quando o usuário enviar comentário, então ele deve ser validado e persistido com limite de tamanho.

#### Cenário 3
Quando o usuário alterar a avaliação, então o feedback anterior deve ser atualizado sem duplicata ativa.

### Regras de negócio
- Feedback não pode ser criado para resposta de outro usuário sem autorização.
- A geração é a unidade principal de avaliação.
- Comentários não devem conter dados técnicos sensíveis automaticamente.

### Invariantes
- A avaliação permanece vinculada à tentativa avaliada.
- Uma avaliação ativa por usuário e geração.

### Erros e respostas esperadas

- `400` para tipo ou comentário inválido.
- `404` para mensagem ou geração inexistente.
- `403` para recurso não autorizado.

### Fora do escopo deste RF
- Avaliação automática por LLM.
- Recompensas de treinamento.
- Moderação avançada de comentários.

### Definition of Done
- [ ] Fluxo principal implementado.
- [ ] Cenários de aceitação cobertos por testes.
- [ ] Autorização e isolamento por workspace validados.
- [ ] Erros públicos e logs técnicos separados.
- [ ] Observabilidade mínima adicionada.
- [ ] Documentação atualizada após a implementação.
