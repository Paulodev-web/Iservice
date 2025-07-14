# 🚀 Iservice Database - Guia Rápido

## ⚡ Quick Start

### 1. Configuração do Cliente Supabase

```bash
npm install @supabase/supabase-js
```

```typescript
import { createClient } from '@supabase/supabase-js'
import { Database } from './src/types/database'

const supabaseUrl = 'https://jylrlwhfasktdzycjbcb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5bHJsd2hmYXNrdGR6eWNqYmNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0MTA3MDMsImV4cCI6MjA2Njk4NjcwM30.Xjl6gN1Ob91VPIlXmQadfPzupMKjeHiOvkonoizfWbA'

export const supabase = createClient<Database>(supabaseUrl, supabaseKey)
```

### 2. Tipos TypeScript

Os tipos estão disponíveis em `src/types/database.ts`:

```typescript
import { Profile, Service, Booking, Review, UserRole, BookingStatus } from './types/database'
```

## 📚 Operações Principais

### 👤 Gestão de Perfis

```typescript
// Criar perfil (automático no signup)
const { data: user } = await supabase.auth.signUp({
  email: 'joao@exemplo.com',
  password: 'senha123',
  options: {
    data: {
      full_name: 'João Silva',
      role: 'PRESTADOR'
    }
  }
})

// Buscar perfil atual
const { data: profile } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', user.id)
  .single()

// Atualizar perfil
const { data } = await supabase
  .from('profiles')
  .update({ 
    bio: 'Eletricista com 10 anos de experiência',
    phone: '(11) 99999-9999'
  })
  .eq('id', user.id)
```

### 🛠️ Gestão de Serviços

```typescript
// Criar serviço (apenas prestadores)
const { data } = await supabase
  .from('services')
  .insert({
    title: 'Instalação de Chuveiro',
    description: 'Instalação completa com garantia',
    price: 80.00,
    category_id: 2, // Elétrica
    provider_id: user.id
  })

// Buscar serviços com detalhes
const { data } = await supabase
  .from('services_with_details')
  .select('*')
  .eq('category_slug', 'eletrica')
  .limit(10)

// Buscar por função (com filtros e paginação)
const { data } = await supabase.rpc('search_services', {
  category_slug_param: 'limpeza-residencial',
  limit_param: 20,
  offset_param: 0
})
```

### 📅 Gestão de Agendamentos

```typescript
// Criar agendamento (apenas clientes)
const { data } = await supabase
  .from('bookings')
  .insert({
    service_id: 1,
    provider_id: 'provider-uuid',
    client_id: user.id,
    booking_date: '2025-01-15T14:00:00Z',
    final_price: 80.00
  })

// Buscar agendamentos do cliente
const { data } = await supabase
  .from('bookings_with_details')
  .select('*')
  .eq('client_id', user.id)
  .order('booking_date', { ascending: false })

// Atualizar status (apenas prestador)
const { data } = await supabase
  .from('bookings')
  .update({ status: 'CONCLUIDO' })
  .eq('id', bookingId)
  .eq('provider_id', user.id)
```

### ⭐ Gestão de Avaliações

```typescript
// Criar avaliação (apenas cliente do booking)
const { data } = await supabase
  .from('reviews')
  .insert({
    booking_id: 1,
    reviewer_id: user.id,
    provider_id: 'provider-uuid',
    rating: 5,
    comment: 'Excelente serviço!'
  })

// Buscar avaliações de um prestador
const { data } = await supabase
  .from('reviews')
  .select(`
    *,
    reviewer:profiles!reviewer_id(full_name)
  `)
  .eq('provider_id', providerId)
  .order('created_at', { ascending: false })
```

### 📊 Dashboard do Prestador

```typescript
// Estatísticas completas
const { data } = await supabase.rpc('get_provider_stats', {
  provider_uuid: user.id
})

// Resultado:
// {
//   total_services: 5,
//   active_services: 4,
//   total_bookings: 12,
//   completed_bookings: 10,
//   pending_bookings: 2,
//   total_earnings: 1200.00,
//   this_month_earnings: 320.00,
//   average_rating: 4.8,
//   total_reviews: 8
// }
```

## 🔍 Queries Úteis

### Buscar Prestadores por Categoria

```typescript
const { data } = await supabase
  .from('services_with_details')
  .select('provider_id, provider_name, provider_rating, provider_review_count')
  .eq('category_slug', 'limpeza-residencial')
  .gte('provider_rating', 4.0)
  .order('provider_rating', { ascending: false })
```

### Top Prestadores

```typescript
const { data } = await supabase
  .from('provider_dashboard')
  .select('*')
  .gte('average_rating', 4.5)
  .gte('total_reviews', 5)
  .order('average_rating', { ascending: false })
  .limit(10)
```

### Histórico de Agendamentos

```typescript
const { data } = await supabase
  .from('bookings_with_details')
  .select('*')
  .eq('provider_id', user.id)
  .eq('status', 'CONCLUIDO')
  .gte('created_at', '2025-01-01')
  .order('booking_date', { ascending: false })
```

## 🔒 Autenticação e Permissões

### Login

```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'usuario@exemplo.com',
  password: 'senha123'
})
```

### Verificar Role

```typescript
const { data: profile } = await supabase
  .from('profiles')
  .select('role')
  .eq('id', user.id)
  .single()

if (profile?.role === 'PRESTADOR') {
  // Mostrar dashboard do prestador
} else {
  // Mostrar interface do cliente
}
```

### Logout

```typescript
await supabase.auth.signOut()
```

## 📋 Categorias Disponíveis

1. **Limpeza Residencial** (`limpeza-residencial`)
2. **Elétrica** (`eletrica`) 
3. **Encanamento** (`encanamento`)
4. **Jardinagem** (`jardinagem`)
5. **Pintura** (`pintura`)
6. **Montagem de Móveis** (`montagem-moveis`)
7. **Reformas** (`reformas`)
8. **Tecnologia** (`tecnologia`)

## 🚨 Regras Importantes

### ✅ Validações Automáticas:
- Apenas **prestadores** podem criar serviços
- Apenas **clientes** podem fazer agendamentos
- **Uma avaliação por booking** (máximo)
- Preços devem ser **positivos**
- Avaliações entre **1 e 5**
- Cliente ≠ Prestador no mesmo booking

### 🔐 Segurança RLS:
- Usuários só veem/editam **seus próprios dados**
- Prestadores só gerenciam **seus serviços**
- Clientes só veem **seus agendamentos**
- Avaliações são **públicas** (leitura)

## 🐛 Troubleshooting

### Erro de Permissão
```
new row violates row-level security policy
```
**Solução**: Verificar se o usuário está autenticado e tem a role correta.

### Erro de Foreign Key
```
violates foreign key constraint
```
**Solução**: Verificar se os IDs referenciados existem e são válidos.

### Erro de Constraint
```
violates check constraint
```
**Solução**: Verificar se os valores atendem às regras (ex: preço > 0, rating 1-5).

## 📖 Documentação Completa

Para documentação detalhada, consulte: [`DATABASE_DOCUMENTATION.md`](./DATABASE_DOCUMENTATION.md)

---

**MVP Pronto para Desenvolvimento** ✅ 