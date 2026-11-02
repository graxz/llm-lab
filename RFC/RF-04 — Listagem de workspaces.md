# RF-04 — Listagem de workspaces

## Objetivo
Permitir que o usuário visualize os workspaces aos quais pertence e selecione o contexto de trabalho.

## Atores
- Usuário autenticado.

## Fluxo principal
1. O usuário acessa a lista de workspaces.
2. O sistema retorna apenas os workspaces autorizados.
3. O usuário visualiza nome e informações resumidas.
4. O usuário seleciona um workspace ativo.

## Informações exibidas
- Identificador.
- Nome.
- Data de criação.
- Quantidade de conversas, se disponível.
- Quantidade de assistentes, se disponível.

## Requisitos
- A consulta deve ser filtrada pelo usuário autenticado.
- Nenhum workspace de outro usuário pode ser exposto.
- A seleção deve permanecer disponível durante a navegação.

## Critérios de aceite
- O usuário visualiza seu workspace padrão.
- A resposta não contém workspaces não autorizados.
- O workspace selecionado é usado nas operações seguintes.

## Fora do escopo
- Convites e colaboração entre membros.
- Papéis avançados de workspace.

## Especificação spec-driven

### User story
Como usuário autenticado, quero listar e selecionar meus workspaces para trabalhar no contexto correto.

### Pré-condições
- O usuário possui uma sessão válida.
- Existe pelo menos um workspace acessível ou a lista pode estar vazia.

### Cenários de aceitação

#### Cenário 1
Dada uma sessão válida, quando o usuário listar workspaces, então somente workspaces autorizados devem ser retornados.

#### Cenário 2
Quando o usuário selecionar um workspace, então as operações seguintes devem usar esse contexto.

### Regras de negócio
- Toda consulta deve filtrar por identidade e autorização.
- A resposta não deve expor dados de workspaces não autorizados.
- A seleção precisa ser validada no backend, não apenas no frontend.

### Invariantes
- Nenhum recurso de outro workspace aparece na listagem.
- Um workspace selecionado permanece válido somente enquanto o usuário tiver acesso.

### Erros e respostas esperadas

- `401` para sessão ausente.
- `403` quando o contexto não for autorizado.

### Fora do escopo deste RF
- Convites e gerenciamento de membros.
- Compartilhamento público.

### Definition of Done
- [ ] Fluxo principal implementado.
- [ ] Cenários de aceitação cobertos por testes.
- [ ] Autorização e isolamento por workspace validados.
- [ ] Erros públicos e logs técnicos separados.
- [ ] Observabilidade mínima adicionada.
- [ ] Documentação atualizada após a implementação.
