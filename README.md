# LLM Lab

O **LLM Lab** é uma plataforma modular de IA construída para estudar, experimentar e aplicar os principais conceitos por trás de sistemas modernos baseados em modelos de linguagem.

A proposta não é criar apenas mais um chatbot. O objetivo é construir uma plataforma completa, em **TypeScript e Node.js**, na qual cada parte importante do sistema possa ser entendida, testada, observada e evoluída gradualmente.

O projeto combina dois objetivos:

1. Construir uma plataforma de IA próxima de um produto real.
2. Entender, de forma prática, o que acontece por baixo das abstrações de LLMs.

Ao final, o LLM Lab deverá permitir conversar com modelos, criar assistentes especializados, consultar documentos, executar ferramentas, acompanhar custos e avaliar a qualidade das respostas.

## O que a plataforma terá

### Conversas com modelos de linguagem

A plataforma permitirá que usuários criem conversas, enviem mensagens e recebam respostas em streaming. As conversas serão persistidas para que possam ser reabertas posteriormente.

### Assistentes configuráveis

Cada assistente poderá possuir suas próprias instruções, modelo, parâmetros de geração e configurações. Isso permitirá criar assistentes especializados para diferentes objetivos, como revisão de código, suporte técnico, análise de documentos ou geração de conteúdo.

### AI Gateway

O AI Gateway será a camada responsável por conversar com provedores e modelos de linguagem. A aplicação não dependerá diretamente de um SDK específico.

Essa camada deverá centralizar:

- seleção de modelos;
- adaptação entre provedores;
- streaming;
- timeout;
- retry;
- fallback;
- controle de tokens;
- estimativa de custos;
- normalização de respostas;
- registro de metadados.

### Knowledge Base e RAG

A plataforma poderá receber documentos e transformá-los em uma base de conhecimento consultável.

O fluxo será:

```text
documento
→ extração de texto
→ limpeza
→ divisão em chunks
→ embeddings
→ indexação
→ busca semântica
→ montagem de contexto
→ resposta com fontes
```

### Busca semântica e embeddings

O projeto terá um módulo para estudar e utilizar embeddings. Será possível transformar textos em vetores, comparar significados e recuperar os trechos mais relevantes para uma pergunta.

Também haverá experimentos didáticos para entender:

- vetores;
- matrizes;
- produto escalar;
- similaridade de cosseno;
- tokenização;
- embeddings;
- atenção;
- Transformer;
- geração de texto.

### Saídas estruturadas

A plataforma poderá executar tarefas que retornam dados estruturados, como:

- extração de informações;
- classificação;
- resumo;
- tradução;
- análise de tickets;
- conversão de texto para JSON;
- preenchimento de schemas.

As respostas deverão ser validadas antes de serem usadas por outros sistemas.

### Ferramentas e tool calling

Os assistentes poderão solicitar ferramentas com contratos explícitos. A plataforma será responsável por validar os argumentos, verificar permissões, executar a ferramenta e devolver o resultado ao modelo.

Exemplos de ferramentas:

- calculadora;
- busca em documentos;
- consulta a banco de dados;
- criação de tarefa;
- consulta a uma API externa;
- busca web.

### Workflows e agentes

Depois do núcleo estar estável, a plataforma poderá executar fluxos com múltiplas etapas, condições, aprovações humanas, retries e limites de execução.

A ideia é tratar agentes como workflows observáveis e controlados, em vez de simplesmente permitir que o modelo execute ações sem restrições.

### Observabilidade e avaliação

Cada execução poderá registrar:

- modelo usado;
- prompt e contexto;
- tokens de entrada e saída;
- custo estimado;
- latência;
- ferramentas chamadas;
- documentos recuperados;
- resposta produzida;
- erros;
- feedback do usuário.

A plataforma também deverá permitir avaliar se as respostas são relevantes, fundamentadas e livres de alucinações evitáveis.

## Roadmap do projeto

### Fase 1 — Núcleo da plataforma

Construir o primeiro fluxo completo: usuário, workspace, assistente, conversa, mensagem, chamada ao modelo, streaming e persistência.

- [ ] Definir estrutura inicial do monorepo
- [ ] Criar aplicação de API
- [ ] Criar aplicação web
- [ ] Configurar banco de dados
- [ ] Implementar cadastro de usuário
- [ ] Implementar login e logout
- [ ] Criar workspace padrão
- [ ] Implementar listagem de workspaces
- [ ] Implementar criação de assistente
- [ ] Implementar edição e gerenciamento de assistentes
- [ ] Implementar criação de conversa
- [ ] Implementar envio de mensagem
- [ ] Implementar montagem do contexto
- [ ] Criar primeiro adaptador de modelo
- [ ] Implementar chamada ao modelo
- [ ] Implementar resposta em streaming
- [ ] Persistir resposta completa
- [ ] Implementar histórico de conversas
- [ ] Implementar regeneração de resposta
- [ ] Implementar cancelamento de geração
- [ ] Implementar feedback da resposta
- [ ] Implementar seleção de modelo
- [ ] Implementar tratamento de erros
- [ ] Adicionar logs estruturados
- [ ] Criar testes do fluxo principal

### Fase 2 — AI Gateway

Isolar a integração com modelos e preparar a plataforma para múltiplos provedores.

- [ ] Definir contrato interno de modelos
- [ ] Criar adaptadores por provedor
- [ ] Implementar timeout
- [ ] Implementar retry com backoff
- [ ] Implementar fallback
- [ ] Implementar circuit breaker
- [ ] Normalizar respostas entre provedores
- [ ] Registrar tokens e custos
- [ ] Implementar limites por usuário e workspace
- [ ] Adicionar testes de falha do provedor

### Fase 3 — Assistentes avançados

Evoluir o sistema de assistentes configuráveis.

- [ ] Versionar prompts
- [ ] Criar snapshot da configuração usada em cada geração
- [ ] Permitir parâmetros por assistente
- [ ] Permitir modelos diferentes por assistente
- [ ] Implementar permissões de assistentes
- [ ] Criar templates de assistentes
- [ ] Adicionar importação e exportação de configurações

### Fase 4 — Knowledge Base e RAG

Permitir que os assistentes respondam com base em documentos do usuário.

- [ ] Implementar upload de documentos
- [ ] Processar arquivos de texto e Markdown
- [ ] Adicionar suporte a PDF
- [ ] Extrair e limpar texto
- [ ] Implementar chunking
- [ ] Implementar embeddings
- [ ] Criar armazenamento vetorial
- [ ] Implementar busca semântica
- [ ] Implementar filtros por metadados
- [ ] Implementar reranking
- [ ] Montar contexto recuperado
- [ ] Exibir fontes na resposta
- [ ] Testar perguntas sem resposta nos documentos

### Fase 5 — Saídas estruturadas

Transformar respostas de IA em dados confiáveis para consumo por sistemas.

- [ ] Definir schemas de saída
- [ ] Validar respostas estruturadas
- [ ] Tratar JSON inválido
- [ ] Implementar retry de formato
- [ ] Criar tarefas de classificação
- [ ] Criar tarefas de extração
- [ ] Criar tarefas de resumo
- [ ] Criar tarefas de tradução
- [ ] Adicionar testes de conformidade dos schemas

### Fase 6 — Ferramentas e tool calling

Permitir que assistentes solicitem operações controladas.

- [ ] Definir contrato de ferramentas
- [ ] Criar registro de ferramentas disponíveis
- [ ] Validar argumentos com schemas
- [ ] Implementar calculadora
- [ ] Implementar busca na Knowledge Base
- [ ] Implementar ferramenta de consulta simulada
- [ ] Implementar criação de tarefa
- [ ] Adicionar permissões por assistente
- [ ] Adicionar auditoria de chamadas
- [ ] Adicionar confirmação humana para ações sensíveis
- [ ] Implementar limites de chamadas por execução

### Fase 7 — Workflows e agentes

Executar tarefas compostas com estado e controle de execução.

- [ ] Modelar etapas de workflow
- [ ] Implementar execução sequencial
- [ ] Implementar condições
- [ ] Implementar retries por etapa
- [ ] Implementar timeout por etapa
- [ ] Persistir estado da execução
- [ ] Implementar aprovação humana
- [ ] Implementar limites de custo e duração
- [ ] Exibir trace completo do workflow
- [ ] Criar exemplos de workflows reutilizáveis

### Fase 8 — Avaliação e operação

Medir qualidade, custo, latência e confiabilidade.

- [ ] Criar conjunto de perguntas de avaliação
- [ ] Avaliar qualidade da recuperação
- [ ] Avaliar fidelidade ao contexto
- [ ] Avaliar ocorrência de alucinações
- [ ] Criar testes de regressão de prompts
- [ ] Registrar latência por etapa
- [ ] Registrar custo por execução
- [ ] Criar dashboard operacional
- [ ] Criar dashboard de qualidade
- [ ] Adicionar feedback humano aos experimentos
- [ ] Comparar modelos por custo e qualidade

## Trilha de entendimento interno

Além da plataforma de produto, o projeto terá experimentos menores para entender os mecanismos fundamentais dos LLMs.

- [ ] Implementar escalares, vetores e matrizes
- [ ] Implementar produto escalar
- [ ] Implementar norma e normalização
- [ ] Implementar distância euclidiana
- [ ] Implementar similaridade de cosseno
- [ ] Implementar multiplicação de matrizes
- [ ] Implementar tokenizer por palavras
- [ ] Implementar tokenizer por caracteres
- [ ] Implementar BPE simplificado
- [ ] Implementar tabela de embeddings
- [ ] Implementar busca semântica simples
- [ ] Implementar softmax
- [ ] Implementar cross-entropy
- [ ] Implementar treinamento por gradiente
- [ ] Implementar atenção
- [ ] Implementar atenção causal
- [ ] Implementar multi-head attention
- [ ] Implementar positional embeddings
- [ ] Implementar layer normalization
- [ ] Implementar bloco Transformer
- [ ] Implementar geração autoregressiva
- [ ] Treinar um mini-modelo em corpus pequeno
- [ ] Visualizar tokens, embeddings, logits e atenção

## Princípios do projeto

### Monólito modular primeiro

O backend começará como um monólito modular. A separação inicial será por responsabilidades de domínio, não por microserviços. Serviços separados só serão introduzidos quando houver uma necessidade clara, como processamento assíncrono de documentos ou execução de workflows.

### Contratos explícitos

Integrações com modelos, ferramentas e workflows deverão possuir contratos claros, validação de entrada e saída e tipos compartilhados quando fizer sentido.

### Observabilidade desde o início

Cada geração deve poder ser rastreada. É importante saber qual modelo foi usado, qual contexto foi enviado, quanto tempo levou, quanto custou e por que falhou.

### Segurança por padrão

Segredos não devem aparecer no código ou nos logs. O acesso a workspaces, conversas, documentos e ferramentas deve ser sempre validado no backend.

### Aprender sem esconder as abstrações

Bibliotecas prontas poderão ser usadas no produto, mas os conceitos essenciais terão versões didáticas próprias nos experimentos. O objetivo é entender o funcionamento sem tentar reimplementar toda a indústria em produção.

## Stack inicial

- TypeScript
- Node.js
- API HTTP
- Server-Sent Events para streaming
- Frontend web
- Banco de dados relacional
- Testes automatizados
- Logs estruturados
- AI Gateway próprio

## Estrutura esperada

```text
llm-lab/
├── apps/
│   ├── api/
│   ├── web/
│   └── worker/
├── packages/
│   ├── domain/
│   ├── database/
│   ├── auth/
│   ├── ai-core/
│   ├── gateway/
│   ├── conversations/
│   ├── assistants/
│   ├── documents/
│   ├── retrieval/
│   ├── tools/
│   ├── workflows/
│   └── evaluation/
├── experiments/
│   ├── vectors/
│   ├── tokenizer/
│   ├── embeddings/
│   ├── attention/
│   └── transformer/
└── RFC/
    └──RF-01...
```
