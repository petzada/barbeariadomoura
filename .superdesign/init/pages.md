# pages.md

## /

Entry: `src/app/(public)/page.tsx`

Dependencies:
- `src/app/(public)/page.tsx`
  - `src/components/ui/button.tsx`
    - `src/lib/utils.ts`
  - `src/components/ui/input.tsx`
  - `src/components/ui/label.tsx`
  - `src/lib/auth/actions.ts`
    - `src/lib/supabase/server.ts`

## /dashboard

Entry: `src/app/(cliente)/dashboard/page.tsx`

Dependencies:
- `src/app/(cliente)/dashboard/page.tsx`
  - `src/components/ui/button.tsx`
    - `src/lib/utils.ts`
  - `src/hooks/use-toast.ts`
    - `src/components/ui/toast.tsx`
  - `src/components/ui/card.tsx`
  - `src/components/ui/badge.tsx`
  - `src/components/ui/skeleton.tsx`
  - `src/components/ui/avatar.tsx`
  - `src/hooks/use-user.ts`
    - `src/lib/supabase/client.ts`
    - `src/types/index.ts`

## /agendar

Entry: `src/app/(cliente)/agendar/page.tsx`

Dependencies:
- `src/app/(cliente)/agendar/page.tsx`
  - `src/components/ui/button.tsx`
    - `src/lib/utils.ts`
  - `src/components/ui/card.tsx`
  - `src/components/ui/badge.tsx`
  - `src/components/ui/skeleton.tsx`
  - `src/components/ui/avatar.tsx`
  - `src/hooks/use-toast.ts`
    - `src/components/ui/toast.tsx`
  - `src/hooks/use-user.ts`
    - `src/lib/supabase/client.ts`
    - `src/types/index.ts`
  - `src/lib/scheduling/actions.ts`
    - `src/lib/supabase/server.ts`

## /meus-agendamentos

Entry: `src/app/(cliente)/meus-agendamentos/page.tsx`

Dependencies:
- `src/app/(cliente)/meus-agendamentos/page.tsx`
  - `src/components/ui/button.tsx`
    - `src/lib/utils.ts`
  - `src/components/ui/card.tsx`
  - `src/components/ui/badge.tsx`
  - `src/components/ui/skeleton.tsx`
  - `src/components/ui/avatar.tsx`
  - `src/components/ui/dialog.tsx`
  - `src/hooks/use-toast.ts`
    - `src/components/ui/toast.tsx`
  - `src/hooks/use-user.ts`
    - `src/lib/supabase/client.ts`
    - `src/types/index.ts`
  - `src/lib/scheduling/actions.ts`
    - `src/lib/supabase/server.ts`

## /clube

Entry: `src/app/(cliente)/clube/page.tsx`

Dependencies:
- `src/app/(cliente)/clube/page.tsx`
  - `src/components/ui/button.tsx`
    - `src/lib/utils.ts`
  - `src/components/ui/card.tsx`
  - `src/components/ui/badge.tsx`
  - `src/components/ui/skeleton.tsx`
  - `src/components/ui/dialog.tsx`
  - `src/hooks/use-toast.ts`
    - `src/components/ui/toast.tsx`
  - `src/hooks/use-user.ts`
    - `src/lib/supabase/client.ts`
    - `src/types/index.ts`

## /profissional/dashboard

Entry: `src/app/(profissional)/profissional/dashboard/page.tsx`

Dependencies:
- `src/app/(profissional)/profissional/dashboard/page.tsx`
  - `src/components/ui/card.tsx`
    - `src/lib/utils.ts`
  - `src/components/ui/button.tsx`
  - `src/components/ui/badge.tsx`
  - `src/components/ui/skeleton.tsx`
  - `src/components/ui/avatar.tsx`
  - `src/components/ui/dialog.tsx`
  - `src/components/ui/select.tsx`
  - `src/hooks/use-toast.ts`
    - `src/components/ui/toast.tsx`
  - `src/hooks/use-user.ts`
    - `src/lib/supabase/client.ts`
    - `src/types/index.ts`
  - `src/components/date-filter-calendar-button.tsx`

## /admin/dashboard

Entry: `src/app/(admin)/admin/dashboard/page.tsx`

Dependencies:
- `src/app/(admin)/admin/dashboard/page.tsx`
  - `src/lib/supabase/server.ts`
  - `src/components/ui/card.tsx`
    - `src/lib/utils.ts`
  - `src/components/ui/badge.tsx`
  - `src/components/ui/skeleton.tsx`
  - `src/components/ui/avatar.tsx`
  - `src/components/ui/button.tsx`
  - `src/app/(admin)/admin/dashboard/header.tsx`
    - `src/hooks/use-user.ts`
      - `src/lib/supabase/client.ts`
      - `src/types/index.ts`

## /admin/agenda

Entry: `src/app/(admin)/admin/agenda/page.tsx`

Dependencies:
- `src/app/(admin)/admin/agenda/page.tsx`
  - `src/components/ui/card.tsx`
    - `src/lib/utils.ts`
  - `src/components/ui/button.tsx`
  - `src/components/ui/badge.tsx`
  - `src/components/ui/skeleton.tsx`
  - `src/components/ui/avatar.tsx`
  - `src/components/ui/dialog.tsx`
  - `src/components/ui/select.tsx`
  - `src/hooks/use-toast.ts`
    - `src/components/ui/toast.tsx`
  - `src/lib/supabase/client.ts`
  - `src/components/date-filter-calendar-button.tsx`

## /admin/servicos

Entry: `src/app/(admin)/admin/servicos/page.tsx`

Dependencies:
- `src/app/(admin)/admin/servicos/page.tsx`
  - `src/components/ui/card.tsx`
    - `src/lib/utils.ts`
  - `src/components/ui/button.tsx`
  - `src/components/ui/badge.tsx`
  - `src/components/ui/input.tsx`
  - `src/components/ui/label.tsx`
  - `src/components/ui/skeleton.tsx`
  - `src/components/ui/dialog.tsx`
  - `src/hooks/use-toast.ts`
    - `src/components/ui/toast.tsx`
  - `src/lib/supabase/client.ts`

## /admin/financeiro

Entry: `src/app/(admin)/admin/financeiro/page.tsx`

Dependencies:
- `src/app/(admin)/admin/financeiro/page.tsx`
  - `src/components/ui/card.tsx`
    - `src/lib/utils.ts`
  - `src/components/ui/button.tsx`
  - `src/components/ui/badge.tsx`
  - `src/components/ui/skeleton.tsx`
  - `src/components/ui/select.tsx`
  - `src/lib/supabase/client.ts`
  - `src/components/date-filter-calendar-button.tsx`
    - `src/components/ui/dialog.tsx`

