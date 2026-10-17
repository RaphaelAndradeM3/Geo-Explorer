# 🌍 Geo-Explorer

> **Plataforma interativa de exploração de trilhas de aprendizagem, desafios práticos de código e emissão de certificados fictícios com suporte nativo a Servidor MCP (Model Context Protocol).**

Projeto desenvolvido como parte do Desafio de Projeto da **Digital Innovation One (DIO)** em colaboração com o assistente **IBM Bob / AI Agent**.

---

## 📌 Sumário

1. [O Que é o Geo-Explorer](#-o-que-é-o-geo-explorer)
2. [Arquitetura e Organização do Projeto](#-arquitetura-e-organização-do-projeto)
3. [Pré-requisitos e Instalação](#-pré-requisitos-e-instalação)
4. [Como Usar os Comandos (CLI)](#-como-usar-os-comandos-cli)
   - [1. Trilha (`trilha`)](#1-comando-trilha)
   - [2. Desafio (`desafio`)](#2-comando-desafio)
   - [3. Certificado (`certificado`)](#3-comando-certificado)
   - [4. Modo Interativo (`explorar`)](#4-modo-interativo-explorar)
5. [Servidor MCP (Model Context Protocol)](#-servidor-mcp-model-context-protocol)
   - [Ferramentas (Tools) Expostas](#ferramentas-tools-expostas)
   - [Configuração em Clientes MCP (Claude Desktop, Cursor, Antigravity)](#configuração-em-clientes-mcp)
6. [Como Executar os Testes Automatizados](#-como-executar-os-testes-automatizados)
7. [Melhorias Realizadas](#-melhorias-realizadas)
8. [O Que Foi Aprendido](#-o-que-foi-aprendido)
9. [Licença](#-licença)

---

## 🧭 O Que é o Geo-Explorer

O **Geo-Explorer** é uma experiência imersiva de exploração do conhecimento tecnológico construída sob a metáfora de uma expedição geográfica. Assim como exploradores mapeiam territórios e superam barreiras naturais, no Geo-Explorer a pessoa usuária navega por territórios de tecnologias (IA, GIS, Cloud/DevOps, Fullstack e Enterprise C# .NET), cumpre missões com desafios algorítmicos e conquista certificados fictícios de conclusão.

O projeto reúne três comandos centrais alimentados por uma base de dados estruturada:
- **`trilha`**: Apresenta planos de estudo detalhados, carga horária estimada, módulos pedagógicos e pré-requisitos para a tecnologia escolhida.
- **`desafio`**: Gera missões práticas de código com especificações, instruções de implementação, código inicial (*starter code*), dicas graduais (*hints*) e casos de teste esperados.
- **`certificado`**: Emite certificados fictícios estilizados nos formatos **HTML imprimível (A4 landscape)**, **SVG vetorial de alta resolução** e **JSON estruturado**, com hash criptográfico SHA-256 de validação.
- **`Servidor MCP`**: Permite que agentes inteligentes (Claude, Cursor, Antigravity, IBM Bob) consumam e orquestrem todas as capacidades do Geo-Explorer como ferramentas de IA.

---

## 🏗️ Arquitetura e Organização do Projeto

```text
Geo-Explorer/
├── .github/                      # Workflows de CI/CD (opcional)
├── certificates/                 # Saída dos certificados emitidos (HTML, SVG, JSON)
├── dist/                         # Código compilado em JavaScript ESM
├── scripts/
│   └── copy-assets.js            # Script auxiliar de build para empacotar a base JSON
├── src/
│   ├── index.ts                  # Ponto de entrada executável da CLI
│   ├── cli.ts                    # Registro de comandos Commander e Menu Interativo
│   ├── data/
│   │   ├── trails.json           # Base de dados estruturada com trilhas e desafios
│   │   └── loader.ts             # Carregamento resiliente da base de dados
│   ├── services/
│   │   ├── trackService.ts       # Regras de negócio de consulta e filtros de trilhas
│   │   ├── challengeService.ts   # Consulta e seleção de desafios de código
│   │   └── certificateService.ts # Geração de certificados (HTML/SVG/JSON) e criptografia
│   ├── mcp/
│   │   └── server.ts             # Servidor MCP padrão Model Context Protocol (@modelcontextprotocol/sdk)
│   ├── types/
│   │   └── index.ts              # Tipagens e interfaces TypeScript
│   └── utils/
│       └── formatting.ts         # Formatação estética do terminal com Chalk e banners
├── tests/
│   ├── trackService.test.ts      # Testes unitários do serviço de trilhas
│   ├── challengeService.test.ts  # Testes dos desafios e casos de teste
│   ├── certificateService.test.ts# Testes de emissão e verificação de certificados
│   └── mcpServer.test.ts         # Testes de integração das ferramentas MCP
├── package.json                  # Dependências e scripts npm
├── tsconfig.json                 # Configuração do compilador TypeScript
└── vitest.config.ts              # Configuração do executor de testes Vitest
```

---

## ⚙️ Pré-requisitos e Instalação

### Pré-requisitos
- **Node.js** v18+ (recomendado Node.js 20 ou 22/24)
- **npm** v9+

### Instalação

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/RaphaelAndradeM3/Geo-Explorer.git
cd Geo-Explorer
npm install
```

Para compilar o TypeScript para JavaScript (diretório `dist/`):

```bash
npm run build
```

---

## 🚀 Como Usar os Comandos (CLI)

O Geo-Explorer pode ser executado diretamente em modo desenvolvimento via `npm start -- <comando>` ou compilado via `node dist/index.js <comando>`.

### 1. Comando `trilha`

Apresenta as trilhas de aprendizagem disponíveis, permitindo filtros por tecnologia, nível e visualização aprofundada de módulos.

```bash
# Listar todas as trilhas cadastradas
npm start -- trilha

# Filtrar por tecnologia (ex: python, javascript, devops, gis, c#)
npm start -- trilha --tech python

# Filtrar por nível de dificuldade (iniciante, intermediario, avancado)
npm start -- trilha --nivel avancado

# Exibir detalhes completos (módulos, tópicos e desafios de uma trilha)
npm start -- trilha --id geo-spatial --detalhes
```

**Exemplo de Saída:**
```text
📍 Trilha: Geospatial Data Science & Map Analytics [INTERMEDIÁRIO]
ID: geo-spatial │ Tech: GIS & Python │ Carga Horária: 50h
Descrição: Explore a ciência de dados geográficos: sistemas de coordenadas, geo-fencing e imagens de satélite.
Módulos: 3 módulos cadastrados │ Desafios: 3 desafios
```

---

### 2. Comando `desafio`

Gera uma missão prática com código inicial e casos de teste para a tecnologia e nível informados.

```bash
# Gerar desafio para Python no nível iniciante
npm start -- desafio --tech python --nivel iniciante

# Gerar desafio de DevOps com dicas e casos de teste
npm start -- desafio --tech devops --nivel iniciante --com-dicas --com-testes

# Obter desafio pelo seu identificador único
npm start -- desafio --id ch-geo-init
```

**Exemplo de Saída:**
```text
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
   DESAFIO DE CÓDIGO: Calculador de Distância Esférica Haversine
   NÍVEL: INICIANTE  Trilha: Geospatial Data Science & Map Analytics
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
📋 Descrição da Missão:
Implemente a fórmula de Haversine para calcular a distância em quilômetros
entre dois pontos geográficos na Terra.

💻 Código Inicial (Starter Code):
def calcular_haversine(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    # Converta graus para radianos e aplique a fórmula
    pass

🧪 Casos de Teste:
  Caso #1: São Paulo (-23.5505, -46.6333) e Rio de Janeiro (-22.9068, -43.1729) -> ~357.5 km
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

---

### 3. Comando `certificado`

Cria um certificado fictício personalizado para o estudante que concluiu a trilha.

```bash
# Emitir certificado nos formatos HTML, SVG e JSON
npm start -- certificado --aluno "Raphael Andrade" --trilha geo-spatial

# Personalizar grau de aproveitamento e formato
npm start -- certificado --aluno "Ada Lovelace" --trilha python-ai --nota "Distinção com Louvor" --formato html

# Verificar a autenticidade de um certificado pelo código emitido
npm start -- certificado --verificar GEO-7164-B4C8-214A
```

Os arquivos gerados são salvos automaticamente no diretório `certificates/`:
- `certificates/certificado_<trilha>_<aluno>_<id>.html`: Certificado web responsivo pronto para impressão A4 horizontal.
- `certificates/certificado_<trilha>_<aluno>_<id>.svg`: Gráfico vetorial nítido com insígnias e assinaturas.
- `certificates/certificado_<trilha>_<aluno>_<id>.json`: Metadados estruturados para validação e auditoria.

---

### 4. Modo Interativo (`explorar`)

Se você executar o Geo-Explorer sem parâmetros (ou com o comando `explorar`), um menu interativo guiará sua jornada:

```bash
npm start
# ou
npm start -- explorar
```

---

## 🤖 Servidor MCP (Model Context Protocol)

O Geo-Explorer implementa o padrão oficial do **Model Context Protocol (MCP)**, permitindo que agentes de Inteligência Artificial utilizem o projeto como uma suíte de ferramentas externas.

### Iniciar o Servidor MCP:
```bash
npm run mcp
# ou
node dist/mcp/server.js
```

### Ferramentas (Tools) Expostas:
1. `list_tracks`: Lista todas as trilhas filtradas por tecnologia, nível ou categoria.
2. `get_track_details`: Retorna o syllabus completo com módulos e carga horária de uma trilha.
3. `get_code_challenge`: Recupera desafios adequados para o perfil do estudante.
4. `generate_certificate`: Cria o certificado emitindo o código criptográfico e gerando os artefatos visuais.
5. `verify_certificate`: Valida o hash e a integridade de um certificado emitido.

### Recursos (Resources) Expostos:
- `tracks://list`: Catálogo em JSON com todas as trilhas.

### Prompts de Sistema Integrados:
- `study_plan_advisor`: Recomenda trilha e plano de estudos personalizado de acordo com o objetivo do usuário.

### Configuração em Clientes MCP (ex: Claude Desktop):
Adicione a configuração ao arquivo `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "geo-explorer": {
      "command": "node",
      "args": [
        "H:/tmp/RSA/DIO/Geo-Explorer/dist/mcp/server.js"
      ]
    }
  }
}
```

---

## 🧪 Como Executar os Testes Automatizados

O projeto utiliza o **Vitest** como suíte de testes unitários e de integração, garantindo que regras de negócio, filtros, criptografia e conformidade MCP funcionem com robustez.

```bash
# Executar todos os testes uma vez
npm test

# Executar em modo interativo contínuo (watch)
npm run test:watch
```

**Cobertura de Testes:**
- `tests/trackService.test.ts`: Valida listagem, busca por ID, filtros de tecnologia e níveis de dificuldade.
- `tests/challengeService.test.ts`: Valida recuperação de desafios, starter codes e casos de teste.
- `tests/certificateService.test.ts`: Testa cálculo de código criptográfico SHA-256, geração de arquivos SVG/HTML/JSON e validação de autenticidade.
- `tests/mcpServer.test.ts`: Valida o registro de ferramentas e resposta dos serviços MCP.

---

## 💡 Melhorias Realizadas

Além dos requisitos mínimos da proposta original, foram implementadas as seguintes evoluções:

1. **Servidor MCP Completo e Conforme**:
   - Integração com `@modelcontextprotocol/sdk` oficial com schema Zod rigoroso, permitindo que LLMs usem as ferramentas diretamente.
2. **Emissão Multiformato de Certificados**:
   - Exportação simultânea para **HTML moderno com CSS de impressão A4**, **SVG vetorial de alta fidelidade** e **JSON de metadados**.
3. **Mecanismo Criptográfico de Autenticidade**:
   - Cada certificado possui um código único derivado de SHA-256 (`GEO-XXXX-XXXX-XXXX`), permitindo verificar a integridade do comprovante.
4. **Modo Interativo com Inquirer**:
   - Experiência guiada por terminal com seleção amigável de trilhas, geração de desafios e emissão de certificados sem necessidade de decorar comandos.
5. **Trilhas e Desafios Reais & Temáticos**:
   - Inclusão de trilha específica em **Geospatial Data Science & GIS** em consonância com a identidade do *Geo-Explorer*, além de trilhas em **IA & LLMs**, **DevOps & Cloud**, **Modern Fullstack** e **C# .NET 9 Clean Architecture**.
6. **Suíte Completa de Testes Automatizados**:
   - 18 testes automatizados em Vitest com 100% de sucesso.

---

## 🎓 O Que Foi Aprendido

Durante o desenvolvimento deste projeto, foram consolidadas competências essenciais para engenharia de software moderna:

- **Desenvolvimento Orientado a Agentes (Agentic Engineering)**: Uso prático do paradigma de AI Pair Programming com o Bob / DIO Agent para acelerar o ciclo de concepção, scaffolding e testes.
- **Model Context Protocol (MCP)**: Compreensão profunda da arquitetura do protocolo MCP, criação de servidores Stdio, exposição de ferramentas (*tools*), recursos (*resources*) e *prompts* parametrizados.
- **Arquitetura Limpa e Tipagem Estrita**: Separação de responsabilidades em camadas (`services`, `data`, `utils`, `mcp`, `cli`), tipagem com TypeScript 5 e validação de contratos com Zod.
- **Design de CLI e Experiência do Desenvolvedor (DX)**: Construção de interfaces de linha de comando elegantes com cores (Chalk), ajuda contextual, aliases rápidos e fallback para modo interativo.
- **Geração Programática de Artefatos**: Renderização dinâmica de documentos visuais SVG e templates HTML profissionais com suporte a impressão.

---

## 📄 Licença

Distribuído sob a licença **MIT**. Consulte o arquivo [LICENSE](LICENSE) para obter mais informações.

Desenvolvido com 🚀 por **Raphael Andrade** na jornada da **Digital Innovation One**.
