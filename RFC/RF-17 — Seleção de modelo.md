# RF-17 — Seleção de modelo

## Objetivo
Permitir usar modelos habilitados pela plataforma sem aceitar identificadores arbitrários do cliente.

## Atores
- Usuário autenticado.
- Administrador ou configuração de ambiente.

## Fluxo principal
1. O backend disponibiliza modelos permitidos.
2. O usuário escolhe um modelo, quando autorizado.
3. O sistema valida disponibilidade e compatibilidade.
4. A geração usa o modelo escolhido.
5. O modelo efetivo é registrado na execução.

## Requisitos
- A lista de modelos deve ser controlada pelo backend.
- O cliente não pode impor uma string de modelo não cadastrada.
- O assistente pode possuir um modelo padrão.
- O sistema deve definir fallback ou erro quando o modelo ficar indisponível.
- Uso e custo devem ser rastreáveis por modelo.

## Critérios de aceite
- O usuário visualiza apenas modelos habilitados.
- Modelo inválido é rejeitado antes da chamada ao provedor.
- A execução registra o modelo efetivamente utilizado.
- Um modelo removido não quebra o histórico existente.

## Fora do escopo inicial
- Roteamento inteligente baseado em custo ou qualidade.
- Fine-tuning por usuário.
