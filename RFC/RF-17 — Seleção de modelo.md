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

## Especificação spec-driven

### User story
Como usuário, quero selecionar um modelo habilitado para controlar o comportamento e o custo da geração.

### Pré-condições
- O usuário está autenticado.
- O modelo está cadastrado e habilitado.
- O assistente ou workspace permite a seleção.

### Cenários de aceitação

#### Cenário 1
Quando o usuário abrir a lista de modelos, então somente modelos habilitados devem aparecer.

#### Cenário 2
Quando um modelo válido for selecionado, então a geração deve registrá-lo.

#### Cenário 3
Quando um identificador arbitrário for enviado, então a API deve rejeitar antes da chamada externa.

#### Cenário 4
Quando o modelo ficar indisponível, então o sistema deve usar fallback documentado ou informar erro.

### Regras de negócio
- A lista é controlada pelo backend.
- Histórico mantém o modelo efetivo usado.
- Custo e uso são rastreáveis por modelo.

### Invariantes
- Nenhuma geração usa modelo não autorizado.
- Uma execução registra exatamente um modelo efetivo.

### Erros e respostas esperadas

- `400` para modelo não permitido.
- `404` para modelo não cadastrado.
- `503` quando nenhum fallback estiver disponível.

### Fora do escopo deste RF
- Roteamento baseado em avaliação em tempo real.
- Fine-tuning por usuário.
- Marketplace de modelos.

### Definition of Done
- [ ] Fluxo principal implementado.
- [ ] Cenários de aceitação cobertos por testes.
- [ ] Autorização e isolamento por workspace validados.
- [ ] Erros públicos e logs técnicos separados.
- [ ] Observabilidade mínima adicionada.
- [ ] Documentação atualizada após a implementação.
