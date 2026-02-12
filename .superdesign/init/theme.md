# theme.md


## `.superdesign/design-system.md`

```md
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

```

## `tailwind.config.ts`

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "#000000",
        input: "#000000",
        ring: "#EAD8AC",
        background: "#013648",
        foreground: "#EAD8AC",
        primary: {
          DEFAULT: "#013648",
          foreground: "#EAD8AC",
        },
        secondary: {
          DEFAULT: "#013648",
          foreground: "#EAD8AC",
        },
        destructive: {
          DEFAULT: "#013648",
          foreground: "#EAD8AC",
        },
        muted: {
          DEFAULT: "#013648",
          foreground: "#EAD8AC",
        },
        accent: {
          DEFAULT: "#EAD8AC",
          foreground: "#013648",
        },
        popover: {
          DEFAULT: "#00000080",
          foreground: "#EAD8AC",
        },
        card: {
          DEFAULT: "#00000080",
          foreground: "#EAD8AC",
        },
      },
      fontFamily: {
        sans: ["var(--font-roboto)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.25rem",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shimmer: "shimmer 1.5s infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;

```

## `src/app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 197 100% 14%;
    --foreground: 43 56% 80%;
    --card: 0 0% 0% / 50%;
    --card-foreground: 43 56% 80%;
    --popover: 0 0% 0% / 50%;
    --popover-foreground: 43 56% 80%;
    --primary: 197 100% 14%;
    --primary-foreground: 43 56% 80%;
    --secondary: 197 100% 14%;
    --secondary-foreground: 43 56% 80%;
    --muted: 197 100% 14%;
    --muted-foreground: 43 56% 80%;
    --accent: 43 56% 80%;
    --accent-foreground: 197 100% 14%;
    --destructive: 197 100% 14%;
    --destructive-foreground: 43 56% 80%;
    --border: 0 0% 0%;
    --input: 0 0% 0%;
    --ring: 43 56% 80%;
    --radius: 0.75rem;
  }

  * {
    @apply border-black;
  }

  body {
    @apply bg-[#013648] text-[#EAD8AC] antialiased overflow-x-hidden;
    font-family: var(--font-roboto), system-ui, sans-serif;
  }

  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #013648;
  }

  ::-webkit-scrollbar-thumb {
    background: #ead8ac;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #ead8ac;
    opacity: 0.85;
  }

  :focus-visible {
    @apply outline-none ring-2 ring-ring ring-offset-2 ring-offset-background;
  }
}

@layer components {
  .hero-atmosphere {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background-image:
      radial-gradient(circle at 20% 20%, rgba(234, 216, 172, 0.12), transparent 45%),
      radial-gradient(circle at 80% 10%, rgba(234, 216, 172, 0.08), transparent 40%),
      radial-gradient(circle at 50% 85%, rgba(0, 0, 0, 0.2), transparent 55%);
    background-size: 120% 120%;
    animation: hero-drift 18s ease-in-out infinite;
    will-change: transform, opacity;
  }

  .section-divider {
    position: relative;
    isolation: isolate;
  }

  .section-divider::before,
  .section-divider::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    height: 1px;
    pointer-events: none;
    background: linear-gradient(
      90deg,
      rgba(0, 0, 0, 0) 0%,
      rgba(234, 216, 172, 0.18) 20%,
      rgba(234, 216, 172, 0.18) 80%,
      rgba(0, 0, 0, 0) 100%
    );
  }

  .section-divider::before {
    top: 0;
  }

  .section-divider::after {
    bottom: 0;
  }

  .scissor-accent {
    animation: scissor-float 7s ease-in-out infinite;
    will-change: transform;
  }

  .scissor-accent-delayed {
    animation: scissor-float 9s ease-in-out infinite;
    animation-delay: 1.4s;
    will-change: transform;
  }

  .card-hover {
    border: 1px solid #000000;
    background-color: rgba(0, 0, 0, 0.5);
    transition: all 0.3s ease;
  }

  .card-hover:hover {
    border-color: #EAD8AC;
  }

  .btn-primary {
    @apply bg-[#EAD8AC] text-[#013648] font-medium px-6 py-3 rounded-lg border border-black transition-all duration-200 hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed;
  }

  .badge {
    @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-black bg-black/50 backdrop-blur-sm text-[#EAD8AC];
  }

  .skeleton {
    @apply bg-[#EAD8AC]/20 animate-pulse rounded-md;
  }

  .container-app {
    @apply w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
  }

  .section-padding {
    @apply py-12 sm:py-16 lg:py-20;
  }

  .text-gradient-gold {
    color: #EAD8AC;
  }
}

@layer utilities {
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }

  .animate-in {
    animation: animate-in 0.3s ease-out;
  }

  @keyframes hero-drift {
    0% {
      transform: translate3d(0, 0, 0) scale(1);
      opacity: 0.7;
    }

    50% {
      transform: translate3d(0, -1.5%, 0) scale(1.03);
      opacity: 0.9;
    }

    100% {
      transform: translate3d(0, 0, 0) scale(1);
      opacity: 0.7;
    }
  }

  @keyframes scissor-float {
    0%,
    100% {
      transform: translateY(0) rotate(0deg);
    }

    50% {
      transform: translateY(-4px) rotate(-3deg);
    }
  }

  @keyframes animate-in {
    from {
      opacity: 0;
      transform: translateY(10px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .glass {
    @apply bg-black/50 backdrop-blur-sm;
  }

  @media (prefers-reduced-motion: reduce) {
    .hero-atmosphere,
    .scissor-accent,
    .scissor-accent-delayed {
      animation: none;
    }
  }
}

```

## `src/app/layout.tsx`

```tsx
import type { Metadata, Viewport } from "next";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
});


import { Toaster } from "@/components/ui/toaster";
import { WhatsAppFloatingButton } from "@/components/whatsapp-button";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Barbearia do Moura | Agendamento Online",
    template: "%s | Barbearia do Moura",
  },
  description:
    "Agende seu horário na Barbearia do Moura. Cortes de cabelo, barba e tratamentos com profissionais especializados em Mauá-SP. Agendamento online 24/7.",
  keywords: [
    "barbearia",
    "corte de cabelo",
    "barba",
    "agendamento online",
    "Mauá",
    "São Paulo",
    "barbeiro",
  ],
  authors: [{ name: "Barbearia do Moura" }],
  creator: "Barbearia do Moura",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/icon.svg",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://barbeariadomoura.vercel.app",
    siteName: "Barbearia do Moura",
    title: "Barbearia do Moura | Agendamento Online",
    description:
      "Agende seu horário na Barbearia do Moura. Cortes de cabelo, barba e tratamentos com profissionais especializados.",
  },
  twitter: {
    card: "summary",
    title: "Barbearia do Moura | Agendamento Online",
    description: "Agende seu horário na melhor barbearia de Mauá-SP.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#013648",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
    >
      <head>
        {/* Schema.org para LocalBusiness */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BarberShop",
              name: "Barbearia do Moura",
              description:
                "Barbearia especializada em cortes masculinos e barba em Mauá-SP",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Mauá",
                addressRegion: "SP",
                addressCountry: "BR",
              },
              priceRange: "$$",
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday"],
                  opens: "09:00",
                  closes: "20:00",
                },
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: "Saturday",
                  opens: "09:00",
                  closes: "18:00",
                },
              ],
            }),
          }}
        />
      </head>
      <body className={`min-h-screen bg-[#013648] text-[#EAD8AC] font-sans antialiased ${roboto.variable}`}>
        {children}
        <Toaster />
        <WhatsAppFloatingButton />
      </body>
    </html>
  );
}


```
