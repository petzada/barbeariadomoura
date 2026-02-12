Plano de Correções - Landing Page e Login

 Contexto

 A landing page e a página de login possuem erros de acentuação em textos estáticos, placeholders sem imagens  
 reais, e ajustes de layout/funcionalidade pendentes conforme solicitado pelo usuário.

 ---
 1. Correções de Português (ortografia/acentuação)

 src/components/landing/hero-section.tsx

 - Linha 23: "Experiencia" → "Experiência", "nao" → "não", "mao" → "mão", "presenca" → "presença"
 - Linha 27: "facil" → "fácil"

 src/components/landing/institutional-section.tsx

 - Linha 12: "Sobre nos" → "Sobre nós"
 - Linha 14: "paixao" → "paixão"
 - Linha 17: "reune" → "reúne", "tecnica" → "técnica"
 - Linha 18: "diferenca" → "diferença"
 - Linha 19: "e pensado" → "é pensado"
 - Linha 26: "Conheca" → "Conheça"
 - Linha 48: "maquina" → "máquina"

 src/components/landing/services-section.tsx

 - Linha 19: "Servicos" → "Serviços"
 - Linha 46: "Servico" → "Serviço", "atencao" → "atenção"

 src/components/landing/professionals-section.tsx

 - Linha 29: "Conheca" → "Conheça"
 - Linha 55: "classicos" → "clássicos"

 src/components/landing/map-section.tsx

 - Linha 42: "Maua" → "Mauá"

 src/app/(auth)/login/page.tsx

 - Linha 107: "horarios" → "horários"
 - Linha 120: "Minimo" → "Mínimo"
 - Linha 184: "Minimo" → "Mínimo"
 - Linha 225: "Ja" → "Já"
 - Linha 243: "Area" → "Área", "voce" → "você"

 ---
 2. Hero: Adicionar botão de Login ao lado do CTA

 Arquivo: src/components/landing/hero-section.tsx

 - Na div de botões (linha 30), adicionar um segundo botão "Entrar" ao lado de "Agendar agora"
 - Usar variant="outline" para diferenciar do CTA principal
 - Link para /login
 - Manter flex com gap entre os botões, centralizado

 ---
 3. Serviços: Remover botão "Agendar" dos cards

 Arquivo: src/components/landing/services-section.tsx

 - Remover o bloco do Button "Agendar" (linhas 54-56) de dentro do map dos cards

 ---
 4. Serviços: Grid de 2 colunas no mobile

 Arquivo: src/components/landing/services-section.tsx

 - Alterar o grid de grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 para grid-cols-2 lg:grid-cols-3
 - Isso faz 2 colunas no mobile/tablet e 3 no desktop

 ---
 5. Galeria: Imagens reais + rolagem infinita

 Arquivo: src/components/landing/gallery-section.tsx

 - Substituir os gradients por imagens reais: /images/galeria1.jpg, /images/galeria2.jpg, /images/galeria3.jpg 
 - Para rolagem infinita no mobile: duplicar o array de imagens (repetir as 3 imagens pelo menos 2-3x) dentro  
 de um container com animação CSS de scroll infinito (@keyframes scroll)
 - No desktop (md+): manter o grid de 5 itens (as 3 imagens + 2 repetidas para preencher)
 - Usar next/image ou <img> com object-cover para as imagens
 - Componente "use client" para gerenciar o scroll infinito via CSS animation

 ---
 6. Profissionais: Imagens reais nos placeholders

 Arquivo: src/components/landing/professionals-section.tsx

 - O componente já usa photoUrl do banco (campo avatar_url ou foto_url). Se os profissionais não têm foto no   
 banco, precisamos de um fallback com as imagens estáticas
 - Abordagem: Criar um mapa de nome → imagem estática como fallback quando photoUrl é null:
   - "Gustavo" → /images/gustavobarber.jpg
   - "Guilherme" → /images/guilhermebarber.png
 - Se photoUrl existir, usa ele. Se não, verifica o nome e usa a imagem estática correspondente

 ---
 7. Login: Imagem no placeholder (desktop) e ocultar no mobile

 Arquivo: src/app/(auth)/login/page.tsx

 - Substituir o img-placeholder por next/Image com src="/images/hero-barbearia.jpg" preenchendo o aside        
 - Remover o bloco de texto "Placeholder de imagem" / "Área reservada..."
 - No mobile: ocultar o <aside> completamente usando hidden lg:block (ou lg:flex)
 - Manter a sobreposição gradiente para legibilidade

 ---
 8. Menu hambúrguer: Botões Entrar e Cadastrar (mobile only)

 Arquivo: src/components/landing/landing-header.tsx

 - Dentro do SheetContent (menu mobile), após os links de navegação, adicionar separador e dois botões:        
   - "Entrar" → link para /login
   - "Cadastrar" → link para /login (abre na aba cadastro, pode usar query param ou simplesmente /login)       
 - Usar Button com variantes visuais distintas (ex: gradient para Entrar, outline para Cadastrar)
 - Envolver em SheetClose para fechar o menu ao clicar
 - Esses botões ficam apenas no menu hambúrguer (que já é exclusivo mobile)

 ---
 Arquivos a modificar (resumo)

 1. src/components/landing/hero-section.tsx — acentos + botão Login
 2. src/components/landing/institutional-section.tsx — acentos
 3. src/components/landing/services-section.tsx — acentos + remover botão + grid mobile
 4. src/components/landing/gallery-section.tsx — imagens reais + scroll infinito
 5. src/components/landing/professionals-section.tsx — acentos + fallback de imagens
 6. src/components/landing/map-section.tsx — acento "Mauá"
 7. src/components/landing/landing-header.tsx — botões Entrar/Cadastrar no menu
 8. src/app/(auth)/login/page.tsx — acentos + imagem real + ocultar aside no mobile

 ---
 Verificação

 - npm run build para garantir que não há erros de compilação
 - Verificar visualmente no navegador (desktop e mobile) que:
   - Todos os textos estão com acentuação correta
   - Hero tem os 2 botões lado a lado
   - Cards de serviço sem botão "Agendar", grid 2 colunas no mobile
   - Galeria mostra as 3 imagens com scroll infinito no mobile
   - Profissionais mostram as fotos corretas
   - Login mostra a imagem no desktop e apenas o form no mobile
   - Menu hambúrguer tem os botões Entrar e Cadastrar