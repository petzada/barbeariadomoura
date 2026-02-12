# Barbearia do Moura - Design System

## Brand Identity

### Nome
Barbearia do Moura

### Tagline
"Estilo e Tradicao em Cada Corte"

### Tom de Voz
- Profissional, mas acolhedor
- Masculino e sofisticado
- Tradicional com toque moderno

---

## Color Tokens

### Primary Palette
| Token | Hex | Uso |
|-------|-----|-----|
| `--color-primary` | #EAD8AC | Ouro - elementos de destaque, textos importantes |
| `--color-primary-dark` | #C4B48A | Ouro escuro - hover states |
| `--color-primary-light` | #F5EBCD | Ouro claro - backgrounds sutis |

### Secondary Palette
| Token | Hex | Uso |
|-------|-----|-----|
| `--color-secondary` | #013648 | Azul profundo - backgrounds de cards |
| `--color-secondary-light` | #05384B | Azul medio - inputs, overlays |
| `--color-secondary-dark` | #012030 | Azul escuro - borders, shadows |

### Neutral Palette
| Token | Hex | Uso |
|-------|-----|-----|
| `--color-background` | #121212 | Fundo principal |
| `--color-surface` | #1A1A1A | Superficies elevadas |
| `--color-border` | #2A2A2A | Bordas padrao |

### Semantic Colors
| Token | Hex | Uso |
|-------|-----|-----|
| `--color-success` | #22C55E | Sucesso, confirmacoes |
| `--color-warning` | #F59E0B | Alertas, pendencias |
| `--color-error` | #EF4444 | Erros, cancelamentos |
| `--color-info` | #3B82F6 | Informacoes |

---

## Typography

### Font Family
```css
--font-primary: 'Roboto', sans-serif;
--font-display: 'Playfair Display', serif;
```

### Font Weights
| Weight | Uso |
|--------|-----|
| 400 (Regular) | Corpo de texto |
| 500 (Medium) | Labels, subtitulos |
| 700 (Bold) | Titulos, CTAs |

### Font Sizes (Mobile First)
| Token | Mobile | Desktop | Uso |
|-------|--------|---------|-----|
| `--text-xs` | 12px | 12px | Badges, timestamps |
| `--text-sm` | 14px | 14px | Labels, descricoes |
| `--text-base` | 16px | 16px | Corpo padrao |
| `--text-lg` | 18px | 20px | Subtitulos |
| `--text-xl` | 20px | 24px | Titulos de secao |
| `--text-2xl` | 24px | 30px | Titulos de pagina |
| `--text-3xl` | 30px | 36px | Headlines |

---

## Spacing System

### Base Unit: 4px

| Token | Value | Uso |
|-------|-------|-----|
| `--space-1` | 4px | Micro espacamentos |
| `--space-2` | 8px | Dentro de componentes |
| `--space-3` | 12px | Entre elementos relacionados |
| `--space-4` | 16px | Padding padrao |
| `--space-5` | 20px | Entre secoes menores |
| `--space-6` | 24px | Padding de cards |
| `--space-8` | 32px | Entre secoes |
| `--space-10` | 40px | Margens de pagina |
| `--space-12` | 48px | Separacao de blocos |

---

## Border Radius

| Token | Value | Uso |
|-------|-------|-----|
| `--radius-sm` | 4px | Inputs, badges |
| `--radius-md` | 8px | Botoes, cards pequenos |
| `--radius-lg` | 12px | Cards medios |
| `--radius-xl` | 16px | Cards grandes, modais |
| `--radius-2xl` | 24px | Elementos de destaque |
| `--radius-full` | 9999px | Avatares, pills |

---

## Shadows

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.4);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.5);
--shadow-glow: 0 0 20px rgba(234, 216, 172, 0.3);
```

---

## Component Patterns

### Cards
- Background: `--color-secondary` com opacity 0.8
- Border: 1px solid `--color-border` ou `--color-primary` (ativo)
- Border-radius: `--radius-xl`
- Padding: `--space-6`
- Shadow: `--shadow-md` no hover

### Buttons

#### Primary Button
- Background: `--color-primary`
- Text: `--color-secondary-dark`
- Border-radius: `--radius-md`
- Height: 44px (mobile), 48px (desktop)
- Font-weight: 700

#### Secondary Button
- Background: transparent
- Border: 1px solid `--color-primary`
- Text: `--color-primary`

#### Ghost Button
- Background: transparent
- Text: `--color-primary`
- Hover: background rgba(234, 216, 172, 0.1)

### Inputs
- Background: `--color-secondary-light` com opacity 0.5
- Border: 1px solid rgba(234, 216, 172, 0.3)
- Border-radius: `--radius-md`
- Height: 44px
- Focus: border-color `--color-primary`

### Badges
- Border-radius: `--radius-full`
- Padding: 4px 12px
- Font-size: `--text-xs`
- Font-weight: 500

---

## Layout Guidelines

### Container Widths
| Breakpoint | Max-width |
|------------|-----------|
| Mobile | 100% (padding 16px) |
| Tablet (768px) | 720px |
| Desktop (1024px) | 960px |
| Large (1280px) | 1200px |

### Grid System
- Mobile: 1 coluna
- Tablet: 2 colunas
- Desktop: 3-4 colunas
- Gap: 16px (mobile), 24px (desktop)

### Navigation
- Header height: 64px
- Mobile: hamburger menu com sheet
- Desktop: horizontal nav com dropdown

---

## Animation Guidelines

### Durations
| Token | Value | Uso |
|-------|-------|-----|
| `--duration-fast` | 150ms | Hover, focus |
| `--duration-normal` | 200ms | Transicoes padrao |
| `--duration-slow` | 300ms | Modais, expansoes |

### Easing
```css
--ease-default: cubic-bezier(0.4, 0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
```

---

## Iconography

### Library
Lucide React

### Sizes
| Size | Dimension | Uso |
|------|-----------|-----|
| sm | 16x16 | Inline, badges |
| md | 20x20 | Botoes, nav |
| lg | 24x24 | Headers, destaque |
| xl | 32x32 | Empty states |

### Style
- Stroke width: 2px
- Color: herda do texto

---

## Accessibility

### Contrast Ratios
- Texto normal: minimo 4.5:1
- Texto grande: minimo 3:1
- Elementos interativos: minimo 3:1

### Focus States
- Outline: 2px solid `--color-primary`
- Outline-offset: 2px

### Touch Targets
- Minimo: 44x44px

---

## Responsive Breakpoints

```css
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
```

---

## Dark Theme (Unico)

Este projeto usa exclusivamente dark theme. Nao ha light mode.

---

## Imagens e Assets

### Logo
- Formato: SVG preferido
- Variantes: completo, simbolo
- Cor: `--color-primary` sobre fundo escuro

### Placeholder Images
- Usar gradientes ou icones
- Nunca usar imagens genericas

### User Avatars
- Fallback: iniciais sobre `--color-primary`
- Border-radius: full
- Size padrao: 40x40px
