# RF-05 — Criação de assistente

## Objetivo
Permitir configurar um assistente reutilizável para orientar as respostas do modelo.

## Atores
- Usuário autenticado.

## Dados
- Nome.
- Descrição opcional.
- Instruções do sistema.
- Modelo.
- Temperatura.
- Status ativo/inativo.
- Workspace associado.

## Fluxo principal
1. O usuário abre a criação de assistente.
2. Informa nome e instruções.
3. Seleciona modelo e parâmetros.
4. O sistema valida os dados.
5. O assistente é persistido no workspace.

## Requisitos
- O nome é obrigatório.
- As instruções devem respeitar o limite definido.
- O modelo deve pertencer à lista permitida.
- A temperatura deve estar no intervalo aceito pelo provedor.
- O assistente deve pertencer ao workspace do usuário.

## Critérios de aceite
- Dados válidos criam um assistente.
- O assistente aparece na lista do workspace.
- Suas instruções são usadas quando ele é selecionado em uma conversa.
- Dados inválidos não criam registros parciais.

## Erros esperados
- Nome ausente.
- Instruções excedendo o limite.
- Modelo indisponível.
- Temperatura inválida.
- Workspace sem permissão.
