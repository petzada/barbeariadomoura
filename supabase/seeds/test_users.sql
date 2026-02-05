-- =====================================================
-- SCRIPT PARA CRIAR USUÁRIOS DE TESTE
-- Execute no Supabase SQL Editor
-- =====================================================

-- IMPORTANTE: Este script cria usuários diretamente nas tabelas
-- Para autenticação funcionar, você precisa criar os usuários via:
-- 1. Supabase Dashboard > Authentication > Users > Add User
-- 2. Ou via API/signup

-- Depois de criar os usuários no Auth, execute as queries abaixo
-- para atualizar os roles e criar profissionais

-- =====================================================
-- PASSO 1: Criar usuários no Supabase Auth Dashboard
-- =====================================================
-- Acesse: Supabase Dashboard > Authentication > Users > Add User
-- Crie os seguintes usuários:
--
-- 1. Admin:
--    Email: admin@barbeariadomoura.com
--    Password: Admin@123
--
-- 2. Barbeiro 1:
--    Email: carlos@barbeariadomoura.com
--    Password: Barbeiro@123
--
-- 3. Barbeiro 2:
--    Email: rafael@barbeariadomoura.com
--    Password: Barbeiro@123

-- =====================================================
-- PASSO 2: Atualizar roles dos usuários
-- (Execute APÓS criar os usuários no Auth)
-- =====================================================

-- Atualizar role do Admin
UPDATE public.users
SET role = 'admin', nome = 'Administrador'
WHERE email = 'admin@barbeariadomoura.com';

-- Atualizar role do Barbeiro Carlos
UPDATE public.users
SET role = 'barbeiro', nome = 'Carlos Silva'
WHERE email = 'carlos@barbeariadomoura.com';

-- Atualizar role do Barbeiro Rafael
UPDATE public.users
SET role = 'barbeiro', nome = 'Rafael Santos'
WHERE email = 'rafael@barbeariadomoura.com';

-- =====================================================
-- PASSO 3: Criar profissionais
-- (Execute APÓS atualizar os roles)
-- =====================================================

-- Criar profissional Carlos
INSERT INTO public.professionals (user_id, especialidades, bio, ativo)
SELECT 
  id,
  ARRAY['corte', 'barba', 'pigmentacao'],
  'Barbeiro especialista com 10 anos de experiência em cortes modernos e barba.',
  true
FROM public.users
WHERE email = 'carlos@barbeariadomoura.com'
ON CONFLICT DO NOTHING;

-- Criar profissional Rafael
INSERT INTO public.professionals (user_id, especialidades, bio, ativo)
SELECT 
  id,
  ARRAY['corte', 'barba', 'sobrancelha'],
  'Especialista em degradê e cortes clássicos. Atendimento personalizado.',
  true
FROM public.users
WHERE email = 'rafael@barbeariadomoura.com'
ON CONFLICT DO NOTHING;

-- =====================================================
-- PASSO 4: Criar taxas de comissão para os profissionais
-- =====================================================

-- Comissão padrão de 50% para Carlos
INSERT INTO public.commission_rates (profissional_id, servico_id, percentual)
SELECT p.id, s.id, 50.00
FROM public.professionals p
CROSS JOIN public.services s
JOIN public.users u ON p.user_id = u.id
WHERE u.email = 'carlos@barbeariadomoura.com'
ON CONFLICT DO NOTHING;

-- Comissão padrão de 50% para Rafael
INSERT INTO public.commission_rates (profissional_id, servico_id, percentual)
SELECT p.id, s.id, 50.00
FROM public.professionals p
CROSS JOIN public.services s
JOIN public.users u ON p.user_id = u.id
WHERE u.email = 'rafael@barbeariadomoura.com'
ON CONFLICT DO NOTHING;

-- =====================================================
-- VERIFICAR DADOS CRIADOS
-- =====================================================

-- Ver todos os usuários e seus roles
SELECT id, nome, email, role, created_at 
FROM public.users 
ORDER BY role, nome;

-- Ver todos os profissionais
SELECT 
  p.id,
  u.nome,
  u.email,
  p.especialidades,
  p.ativo
FROM public.professionals p
JOIN public.users u ON p.user_id = u.id;

-- =====================================================
-- RESUMO DOS USUÁRIOS DE TESTE
-- =====================================================
/*
ADMIN:
  Email: admin@barbeariadomoura.com
  Senha: Admin@123
  Acesso: /admin/dashboard

BARBEIRO 1:
  Email: carlos@barbeariadomoura.com
  Senha: Barbeiro@123
  Acesso: /profissional/dashboard

BARBEIRO 2:
  Email: rafael@barbeariadomoura.com
  Senha: Barbeiro@123
  Acesso: /profissional/dashboard

CLIENTE:
  Qualquer conta criada via /cadastro
  Acesso: /agendar, /meus-agendamentos, /clube
*/
