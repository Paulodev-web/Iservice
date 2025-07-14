# 🗄️ Documentação do Banco de Dados - Iservice MVP

## 📋 Resumo

Este documento descreve a modelagem completa do banco de dados para o MVP da plataforma Iservice, um marketplace de serviços locais implementado com **Supabase** (PostgreSQL + Auth + RLS).

## 🔗 Informações de Conexão

- **URL do Projeto**: `https://jylrlwhfasktdzycjbcb.supabase.co`
- **Chave Anônima**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5bHJsd2hmYXNrdGR6eWNqYmNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0MTA3MDMsImV4cCI6MjA2Njk4NjcwM30.Xjl6gN1Ob91VPIlXmQadfPzupMKjeHiOvkonoizfWbA`

## 🏗️ Arquitetura do Banco

### Tipos Customizados

```sql
-- Roles de usuário
CREATE TYPE USER_ROLE AS ENUM ('CLIENTE', 'PRESTADOR');

-- Status de agendamento
CREATE TYPE BOOKING_STATUS AS ENUM ('AGENDADO', 'CONCLUIDO', 'CANCELADO');
```

## 📊 Estrutura das Tabelas

### 1. `users` (Gerenciada pelo Supabase Auth)
- **Descrição**: Tabela de autenticação gerenciada automaticamente
- **Campos**: `id`, `email`, `created_at`
- **Observação**: Raramente manipulada diretamente

### 2. `profiles`
- **Descrição**: Dados dos usuários (clientes e prestadores)
- **Chave Primária**: `id` (FK para `auth.users.id`)
- **Campos**:
  - `full_name` (TEXT) - Nome completo
  - `avatar_url` (TEXT) - URL da foto de perfil
  - `bio` (TEXT) - Biografia (para prestadores)
  - `phone` (TEXT) - Telefone de contato
  - `role` (USER_ROLE) - 'CLIENTE' ou 'PRESTADOR'
  - `stripe_connect_id` (TEXT) - ID da conta Stripe (prestadores)
  - `created_at` (TIMESTAMPTZ) - Data de criação

### 3. `categories`
- **Descrição**: Categorias de serviços
- **Chave Primária**: `id` (SERIAL)
- **Campos**:
  - `name` (TEXT) - Nome da categoria
  - `slug` (TEXT) - Slug para URLs
- **Dados Iniciais**: 8 categorias (Limpeza, Elétrica, Encanamento, etc.)

### 4. `services`
- **Descrição**: Cardápio de serviços dos prestadores
- **Chave Primária**: `id` (SERIAL)
- **Campos**:
  - `provider_id` (UUID) - FK para profiles
  - `category_id` (INTEGER) - FK para categories
  - `title` (TEXT) - Título do serviço
  - `description` (TEXT) - Descrição detalhada
  - `price` (NUMERIC) - Preço em reais
  - `is_active` (BOOLEAN) - Se está ativo no cardápio
  - `created_at` (TIMESTAMPTZ) - Data de criação

### 5. `bookings`
- **Descrição**: Agendamentos/contratações de serviços
- **Chave Primária**: `id` (SERIAL)
- **Campos**:
  - `client_id` (UUID) - FK para profiles (cliente)
  - `provider_id` (UUID) - FK para profiles (prestador)
  - `service_id` (INTEGER) - FK para services
  - `booking_date` (TIMESTAMPTZ) - Data agendada
  - `status` (BOOKING_STATUS) - Status do agendamento
  - `final_price` (NUMERIC) - Preço final pago
  - `created_at` (TIMESTAMPTZ) - Data da contratação

### 6. `reviews`
- **Descrição**: Avaliações dos serviços
- **Chave Primária**: `id` (SERIAL)
- **Campos**:
  - `booking_id` (INTEGER) - FK única para bookings
  - `reviewer_id` (UUID) - FK para profiles (cliente)
  - `provider_id` (UUID) - FK para profiles (prestador)
  - `rating` (INTEGER) - Nota de 1 a 5
  - `comment` (TEXT) - Comentário da avaliação
  - `created_at` (TIMESTAMPTZ) - Data da avaliação

## 🔍 Views Otimizadas

### `services_with_details`
Combina serviços com dados do prestador e categoria:
```sql
SELECT s.*, p.full_name as provider_name, c.name as category_name, 
       rating.average_rating, rating.review_count
FROM services s
JOIN profiles p ON s.provider_id = p.id
JOIN categories c ON s.category_id = c.id
```

### `provider_dashboard`
Estatísticas agregadas para dashboard do prestador:
```sql
SELECT provider_id, total_services, total_bookings, 
       completed_bookings, total_earnings, average_rating
```

### `bookings_with_details`
Agendamentos com todos os detalhes relacionados:
```sql
SELECT b.*, client_name, provider_name, service_title, category_name
```

## ⚡ Funções Customizadas

### `get_provider_rating(provider_uuid)`
Retorna média de avaliações e total de reviews de um prestador.

### `get_provider_stats(provider_uuid)`
Retorna estatísticas completas para dashboard do prestador.

### `search_services(category_slug, limit, offset)`
Busca serviços com filtros e paginação.

## 🔒 Segurança (RLS)

### Políticas Implementadas:

**Profiles:**
- ✅ Leitura pública de todos os perfis
- ✅ Usuários podem editar apenas seu próprio perfil
- ✅ Criação automática de perfil no cadastro

**Services:**
- ✅ Leitura pública apenas de serviços ativos
- ✅ Prestadores gerenciam apenas seus serviços

**Bookings:**
- ✅ Clientes veem apenas seus agendamentos
- ✅ Prestadores veem agendamentos de seus serviços
- ✅ Apenas clientes podem criar agendamentos
- ✅ Prestadores podem atualizar status

**Reviews:**
- ✅ Leitura pública de todas as avaliações
- ✅ Apenas cliente do booking pode avaliar
- ✅ Uma avaliação por booking (constraint única)

## 🚀 Triggers e Automações

### `handle_new_user()`
- **Trigger**: `on_auth_user_created`
- **Função**: Cria automaticamente perfil ao registrar usuário
- **Padrão**: Role 'CLIENTE' se não especificado

### `validate_provider_service()`
- **Trigger**: `check_provider_role`
- **Função**: Garante que apenas prestadores criem serviços

### `validate_booking()`
- **Trigger**: `check_booking_validity`
- **Função**: Valida integridade dos agendamentos

## 📈 Índices de Performance

```sql
-- Services
CREATE INDEX idx_services_provider_id ON services(provider_id);
CREATE INDEX idx_services_category_id ON services(category_id);
CREATE INDEX idx_services_active ON services(is_active);

-- Bookings
CREATE INDEX idx_bookings_client_id ON bookings(client_id);
CREATE INDEX idx_bookings_provider_id ON bookings(provider_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_date ON bookings(booking_date);

-- Reviews
CREATE INDEX idx_reviews_provider_id ON reviews(provider_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
```

## 🔄 Fluxo de Dados

### 1. Cadastro de Usuário
```
Auth.signUp() → Trigger cria Profile → Role define permissões
```

### 2. Criação de Serviço
```
Prestador → Valida Role → Insere Service → Ativa no cardápio
```

### 3. Contratação
```
Cliente escolhe Service → Cria Booking → Status 'AGENDADO'
```

### 4. Conclusão e Avaliação
```
Prestador → Status 'CONCLUIDO' → Cliente pode criar Review
```

## 🎯 Regras de Negócio Implementadas

### ✅ Validações Garantidas:
1. **Uma avaliação por booking** (constraint única)
2. **Apenas prestadores criam serviços** (trigger)
3. **Cliente ≠ Prestador no booking** (constraint)
4. **Preços sempre positivos** (constraint)
5. **Avaliações entre 1-5** (constraint)
6. **Serviço pertence ao prestador** (trigger)
7. **Apenas cliente do booking pode avaliar** (RLS)

## 📱 Integração com Frontend

### Arquivo de Tipos: `src/types/database.ts`
```typescript
export type Profile = Tables<'profiles'>
export type Service = Tables<'services'>
export type Booking = Tables<'bookings'>
export type UserRole = 'CLIENTE' | 'PRESTADOR'
export type BookingStatus = 'AGENDADO' | 'CONCLUIDO' | 'CANCELADO'
```

### Exemplos de Uso:
```typescript
// Buscar serviços por categoria
const { data } = await supabase.rpc('search_services', {
  category_slug_param: 'limpeza-residencial',
  limit_param: 10
})

// Estatísticas do prestador
const { data } = await supabase.rpc('get_provider_stats', {
  provider_uuid: userId
})
```

## 🔧 Migrações Aplicadas

1. `create_custom_types` - Tipos USER_ROLE e BOOKING_STATUS
2. `create_profiles_table` - Tabela de perfis + RLS
3. `create_categories_table` - Categorias + dados iniciais
4. `create_services_table` - Cardápio de serviços + RLS
5. `create_bookings_table` - Agendamentos + RLS
6. `create_reviews_table` - Avaliações + RLS
7. `create_triggers_and_functions` - Triggers de validação
8. `create_views_only` - Views otimizadas
9. `final_optimizations_fixed` - Índices e funções
10. `fix_security_warnings` - Correções de segurança

## 🚨 Considerações de Segurança

### ✅ Implementado:
- Row Level Security em todas as tabelas
- Validação de roles nos triggers
- Constraints de integridade
- Funções SECURITY DEFINER com search_path fixo

### ⚠️ Avisos Conhecidos:
- Múltiplas políticas RLS (necessário para o modelo de negócio)
- Índices "não utilizados" (normal sem dados de produção)

## 📖 Próximos Passos

1. **Implementar integração Stripe** para pagamentos
2. **Adicionar geolocalização** para busca por proximidade
3. **Sistema de notificações** em tempo real
4. **Upload de imagens** para serviços
5. **Chat entre cliente e prestador**

---

**Criado em**: Janeiro 2025  
**Versão**: 1.0 (MVP)  
**Status**: ✅ Pronto para desenvolvimento 