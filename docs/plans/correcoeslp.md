Plano: Remover funcionalidade de imagem de perfil/profissional

 Contexto

 O proprietario quer controlar todas as imagens manualmente via arquivos na pasta public/images/. Toda
 funcionalidade de exibicao de avatar/foto de perfil vinda do banco de dados (avatar_url, foto_url) deve ser   
 removida. Na landing page, as imagens dos profissionais (guilhermebarber.png e gustavobarber.jpg) devem ser   
 usadas diretamente, sem fallback.

 Alteracoes

 1. Landing Page — profissionais direto com imagem estatica

 Arquivo: src/components/landing/professionals-section.tsx
 - Remover o professionalImageFallback e a logica de fallback chain (avatar_url ?? foto_url ?? fallback)       
 - Mapear o nome do profissional diretamente para a imagem estatica:
   - "Gustavo" → /images/gustavobarber.jpg
   - "Guilherme" → /images/guilhermebarber.png
 - Remover foto_url e avatar_url da interface ProfessionalData

 2. Navegacoes — remover AvatarImage, manter so iniciais

 Arquivos:
 - src/components/layout/user-nav.tsx (linha 62)
 - src/components/layout/client-nav.tsx (linhas 114, 173)
 - src/components/layout/professional-nav.tsx (linhas 111, 179)
 - src/components/layout/admin-nav.tsx (linhas 120, 180)

 Em cada um: remover <AvatarImage src={user.avatar_url || undefined} ... />, mantendo apenas <AvatarFallback>  
 com iniciais.

 3. Paginas de perfil — remover exibicao de avatar

 Arquivos:
 - src/app/(cliente)/perfil/page.tsx (linha 177)
 - src/app/(profissional)/profissional/perfil/page.tsx (linha ~203)

 Remover <AvatarImage>, manter apenas <AvatarFallback> com iniciais.

 4. Dashboards — remover fotos de profissionais/clientes

 Arquivos:
 - src/app/(cliente)/dashboard/page.tsx — remover foto_url/avatar_url do profissional no proximo agendamento   
 - src/app/(profissional)/profissional/dashboard/page.tsx — remover avatar do cliente

 Substituir <AvatarImage> por apenas <AvatarFallback>.

 5. Pagina de agendamento

 Arquivo: src/app/(cliente)/agendar/page.tsx
 - Remover foto_url e avatar_url da interface local Professional
 - Remover <AvatarImage> onde usado, manter fallback com iniciais

 6. Pagina de feedback

 Arquivo: src/app/(cliente)/feedback/page.tsx
 - Remover foto do profissional (foto_url/avatar_url), usar so iniciais

 7. Pagina de meus agendamentos

 Arquivo: src/app/(cliente)/meus-agendamentos/page.tsx
 - Remover AvatarImage, manter so iniciais

 8. Paginas admin

 Arquivos:
 - src/app/(admin)/admin/profissionais/page.tsx — remover foto do profissional
 - src/app/(admin)/admin/agenda/page.tsx — remover avatar do cliente
 - src/app/(admin)/admin/assinantes/page.tsx — remover avatar do assinante
 - src/app/(admin)/admin/comissoes/page.tsx — remover avatar do profissional
 - src/app/(admin)/admin/bloqueios/page.tsx — remover avatar do profissional
 - src/app/(admin)/admin/feedbacks/page.tsx — remover avatar do cliente
 - src/app/(admin)/admin/dashboard/page.tsx — remover avatares

 Substituir <AvatarImage> por apenas <AvatarFallback>.

 9. Pagina publica sobre/profissionais

 Arquivo: src/app/(public)/sobre/profissionais/page.tsx
 - Remover <AvatarImage>, manter so iniciais

 10. Tipos — manter campos no schema

 Arquivos: src/types/index.ts, src/types/database.ts
 - NAO alterar — os campos avatar_url e foto_url existem no banco e sao parte do schema. Removemos apenas a    
 exibicao no UI.

 11. Server actions — manter queries como estao

 Arquivos: src/lib/scheduling/actions.ts, src/lib/feedback/actions.ts
 - Manter selects com avatar_url para nao quebrar tipagem. Os valores simplesmente nao serao exibidos.

 O que NAO sera alterado

 - Imagens estaticas da landing page (hero, galeria, institucional, login) — ficam como estao
 - Logo (/logo.png) — fica como esta
 - Campos no banco de dados — permanecem
 - Componente avatar.tsx — permanece (usado para exibir iniciais)

 Verificacao

 1. npm run build — garantir que compila sem erros
 2. Verificar landing page: imagens de Gustavo e Guilherme aparecem diretamente
 3. Verificar navs: apenas iniciais nos avatares, sem fotos
 4. Verificar paginas de perfil: sem foto, apenas iniciais
 5. Verificar agendamento: sem foto do profissional, apenas iniciais

 Dar commit e push.