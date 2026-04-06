# My Bible App

Um aplicativo de leitura bíblica completo, construído com React, TypeScript e Vite. Interface em português brasileiro.

## Funcionalidades

### Leitura

- **66 livros** da Bíblia (Antigo e Novo Testamento)
- **3 traduções** em português: ARA (Almeida Revista e Atualizada), ACF (Almeida Corrigida Fiel) e NVI (Nova Versão Internacional)
- Seleção de versículos com clique (Shift+Click para selecionar intervalos)
- Modo de **comparação** de traduções lado a lado (2 ou 3 traduções simultâneas)
- Marcação automática de capítulo como lido ao rolar até o final

### Ferramentas de Estudo

- **Destaques** em 5 cores (amarelo, verde, azul, vermelho, roxo) aplicados a versículos ou intervalos
- **Favoritos** com rótulo opcional e navegação rápida
- **Notas** anexadas a versículos com editor inline (Ctrl+Enter para salvar)
- **Referências cruzadas** automáticas (top 3 por versículo) com visualização do texto

### Busca

- Busca em texto completo com índice invertido
- Suporte a palavras isoladas e frases
- Resultados agrupados por livro com termos destacados
- Limite de 50 resultados ordenados por relevância

### Progresso

- Rastreamento automático de capítulos lidos
- Barra de progresso geral (capítulos lidos / total)
- Progresso individual por livro
- Indicadores visuais na grade de capítulos

### Temas

- 7 temas disponíveis: Claro, Escuro, Sépia, Verde, Azul, Laranja e Sistema (segue o tema do SO)
- Transições suaves entre temas
- Tipografia dedicada: Crimson Pro (leitura) e DM Sans (interface)

### Responsividade e Acessibilidade

- Layout adaptável com sidebar deslizante no mobile e barra de navegação inferior
- Comparação em colunas no desktop e abas no mobile
- Navegação por teclado e suporte a ARIA
- Respeita `prefers-reduced-motion`

## Rotas

| Rota | Descrição |
|------|-----------|
| `/` | Redireciona para o último capítulo lido ou Gênesis |
| `/:livro` | Grade de seleção de capítulos |
| `/:livro/:capitulo` | Leitor do capítulo |
| `/search?q=...` | Busca textual |
| `/progress` | Painel de progresso |

## Tecnologias

- **React 19** + **TypeScript**
- **Vite** (build e dev server)
- **Zustand** (gerenciamento de estado com persistência em localStorage)
- **Tailwind CSS v4** (estilização)
- **Vitest** + **Testing Library** (testes)
- **React Router v7** (navegação)

## Instalação e Uso

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Rodar testes
npm run test

# Gerar relatório de cobertura
npm run test:coverage

# Build de produção
npm run build

# Visualizar build
npm run preview
```

## Persistência de Dados

Todos os dados do usuário (tradução ativa, tema, destaques, favoritos, notas e progresso) são persistidos automaticamente no `localStorage` do navegador.
