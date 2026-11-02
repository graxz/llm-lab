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
