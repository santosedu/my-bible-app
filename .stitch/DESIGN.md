# Design System: My Bible App

## 1. Visual Theme & Atmosphere

Serenidade editorial refinada — inspirada em livros de leitura de alta qualidade (Kindle Paperwhite, breviários tipográficos). O espaço em branco é sagrado. Acalma, não intimida. Equilibra sacralidade e modernidade sem cair em religioso-kitsch.

## 2. Color Palette & Roles

### Modo Claro (Light)
| Token | Hex | Role |
|:---|:---|:---|
| `--color-bg` | `#F5F0E8` | Fundo principal de leitura (creme quente) |
| `--color-surface` | `#EDE8DE` | Superfície de cards e contêineres |
| `--color-surface-raised` | `#FAF7F2` | Elementos elevados / hover |
| `--color-text` | `#2C1810` | Texto principal (marrom escuro) |
| `--color-text-secondary` | `#6B5B4E` | Texto secundário / subtitulos |
| `--color-text-muted` | `#9C8E80` | Hints, placeholders, disabled |
| `--color-verse-number` | `#B8A99A` | Número do versículo (discreto) |
| `--color-accent` | `#C49A6C` | Dourado suave — CTAs, favoritos, destaques |
| `--color-highlight-yellow` | `#F5E6B8` | Highlight amarelo pastel |
| `--color-highlight-green` | `#D4E8D0` | Highlight verde pastel |
| `--color-highlight-rose` | `#F0D4D4` | Highlight rosa pastel |
| `--color-border` | `#DDD5C9` | Bordas e divisores |

### Modo Escuro (Dark)
| Token | Hex | Role |
|:---|:---|:---|
| `--color-bg` | `#1A1714` | Fundo (quase-preto com matiz sepia) |
| `--color-text` | `#E8DFD0` | Texto off-white suave |
| `--color-accent` | `#D4A96A` | Dourado mais luminoso para contraste |

### Modo Sepia
| Token | Hex | Role |
|:---|:---|:---|
| `--color-bg` | `#F0E4CC` | Fundo sepia quente |
| `--color-text` | `#3E2F1C` | Texto marrom profundo |
| `--color-accent` | `#B8864E` | Terracota suave |

## 3. Typography Rules

| Role | Font | Weight | Size | Usage |
|:---|:---|:---|:---|:---|
| Corpo da Leitura | Crimson Pro | 400 | 18px (14–22 range) | Texto biblico sagrado |
| Número do Versículo | DM Sans | 600 | 0.65em | Superscript discreto |
| Título do Livro | DM Sans | 600 | 1.6rem | Header de livro |
| Título do Capítulo | DM Sans | 500 | 1.15rem | Sub-header |
| UI / Labels | DM Sans | 500 | 0.875rem | Navegação, chips, botões |
| Notas de Rodapé | DM Sans | 400 | 0.8rem | Referencias e notas |

- **Line-height de leitura**: 1.9 (generoso para conforto prolongado)
- **Max-width do texto**: 65ch (coluna de leitura otimizada)
- **Ajuste de fonte**: Slider de 14px a 22px com 5 pontos predefinidos

## 4. Component Stylings

### Buttons
- **Primario**: Pill-shaped (`--radius-pill`), cor `--color-accent`, texto branco
- **Ghost/Icon**: Quadrado arredondado (`--radius-md`), transparente, hover com `--color-surface-raised`
- **Nav**: Pill com borda, `--color-text-secondary`, escala suave no active

### Cards (Verse Card)
- **Shape**: Softly rounded (`--radius-lg` = 16px)
- **Elevation**: Flat com borda sutil (`1px solid --color-border`)
- **Highlighted**: Fundo de cor pastel, sem borda
- **Bookmarked**: Triangulo decorativo no canto superior direito (`--color-bookmark`)

### Chips
- **Shape**: Pill
- **Default**: Fundo `--color-surface`, borda, texto `--color-text-secondary`
- **Active**: Fundo `--color-accent`, texto branco, sem borda

### Highlight Buttons
- **Shape**: Circular (32px)
- **Cores**: 3 tons pastel (amarelo, verde, rosa)
- **Active**: Ring de `--color-text-muted` ao redor

### Icons
- **Style**: Stroke-based, line-art minimalista (20px)
- **Cor**: `--color-text-muted` por padrão, `--color-bookmark` quando ativo
- **Seta, Bookmark, Search, Share, Settings**

## 5. Layout Principles

- **Mobile-first**: Max-width 430px, centered
- **Leitura padding**: 24px horizontal, 28px vertical (thumb zone friendly)
- **Bottom bar**: Sticky com backdrop-blur, safe area para interação com polegar
- **Header**: Sticky com glassmorphism (`backdrop-filter: blur(12px)`)
- **Whitespace**: Generoso — o vazio entre versiculos e secoes e intencional
- **Transicoes**: Fade suave (0.4s ease) na troca de tema, sem animacoes distrativas

## 6. Accessibility

- Contraste WCAG AA minimo em todos os temas
- Navegacao por teclado em todos os componentes interativos
- ARIA labels em botoes de icone e toggles
- `role="radiogroup"` no seletor de tema
- `prefers-reduced-motion` respeitado (animacoes so via CSS transitions)

## 7. Technical Notes

- HTML + CSS + JS puro, sem frameworks
- Google Fonts: Crimson Pro + DM Sans
- Todas as cores como CSS custom properties no `:root`
- Temas aplicados via `data-theme` attribute no `<html>`
- Font size controlado via `--fs-base` variable (JS slider)
