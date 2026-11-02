# RF-01 — Cadastro de usuário

## Objetivo
Permitir que uma pessoa crie uma conta na plataforma.

## Atores
- Visitante não autenticado.

## Fluxo principal
1. O visitante informa nome, e-mail, senha e confirmação de senha.
2. O sistema valida os dados.
3. O sistema verifica se o e-mail ainda não está cadastrado.
4. O sistema cria o usuário com a senha armazenada de forma segura.
5. O sistema cria o workspace inicial.
6. O sistema autentica o usuário ou o direciona para o login.

## Requisitos
- O e-mail deve ser único.
- A senha nunca pode ser armazenada em texto puro.
- Campos obrigatórios devem ser validados.
- O e-mail deve possuir formato válido.
- A senha deve seguir a política mínima definida pelo produto.
- A confirmação deve ser igual à senha.

## Critérios de aceite
- Dado um e-mail novo e dados válidos, uma conta é criada.
- Dado um e-mail já existente, o cadastro é rejeitado sem duplicar o usuário.
- Dada uma senha inválida, o sistema informa o problema.
- A senha persistida não é recuperável em texto puro.
- Um workspace inicial é associado ao novo usuário.

## Erros esperados
- E-mail inválido.
- E-mail já cadastrado.
- Senha fraca.
- Confirmação divergente.
- Campos ausentes.

## Especificação spec-driven

### User story
Como visitante, quero criar uma conta para acessar um workspace inicial e utilizar a plataforma.

### Pré-condições
- O visitante não possui uma sessão autenticada.
- A plataforma está disponível.
- O e-mail informado ainda não está associado a uma conta.

### Cenários de aceitação

#### Cenário 1
Dado um formulário com nome, e-mail e senhas válidos, quando o visitante confirmar o cadastro, então o usuário e seu workspace inicial devem ser criados.

#### Cenário 2
Dado um e-mail já cadastrado, quando o visitante tentar concluir o cadastro, então a operação deve ser rejeitada sem criar duplicatas.

#### Cenário 3
Dada uma senha inválida ou confirmação divergente, quando o formulário for enviado, então a operação deve ser rejeitada com erro de validação.

### Regras de negócio
- O e-mail é normalizado antes da comparação e persistência.
- A senha deve ser transformada em hash antes de sair da camada de aplicação.
- A criação do usuário e do workspace inicial deve ser atômica.
- A resposta nunca pode devolver senha ou hash.

### Invariantes
- Cada e-mail possui no máximo uma conta ativa.
- Todo usuário criado possui um workspace inicial.
- Um cadastro concluído não deixa usuário sem workspace.

### Erros e respostas esperadas

- `400` para dados inválidos.
- `409` para e-mail já cadastrado.
- `500` somente para falhas internas, sem expor detalhes sensíveis.

### Fora do escopo deste RF
- Verificação de e-mail.
- Login social.
- Convites para workspaces existentes.

### Definition of Done
- [ ] Fluxo principal implementado.
- [ ] Cenários de aceitação cobertos por testes.
- [ ] Autorização e isolamento por workspace validados.
- [ ] Erros públicos e logs técnicos separados.
- [ ] Observabilidade mínima adicionada.
- [ ] Documentação atualizada após a implementação.
