# 🚀 Guia de Deploy no Vercel

## Passo a Passo para Deploy

### 1. Conectar com Vercel
1. Acesse [vercel.com](https://vercel.com)
2. Faça login com sua conta GitHub
3. Clique em "New Project"
4. Importe o repositório: `https://github.com/Paulodev-web/Iservice.git`

### 2. Configurações de Build
O Vercel detectará automaticamente que é um projeto Vite/React. As configurações já estão no `vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install"
}
```

### 3. Variáveis de Ambiente (Opcional)
Para melhor segurança, você pode configurar as variáveis do Supabase:

No painel do Vercel:
- `VITE_SUPABASE_URL`: `https://jylrlwhfasktdzycjbcb.supabase.co`
- `VITE_SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

E atualizar `src/lib/supabase.ts`:
```typescript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://jylrlwhfasktdzycjbcb.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

### 4. Deploy
1. Clique em "Deploy"
2. Aguarde o build (2-3 minutos)
3. Seu app estará disponível em: `https://iservice-[random].vercel.app`

### 5. Configurações de Domínio (Opcional)
- No painel do Vercel, vá em "Domains"
- Adicione seu domínio customizado

## ✅ Status do Projeto
- ✅ Git configurado
- ✅ Código no GitHub
- ✅ Configuração Vercel pronta
- ✅ Build otimizado

## 🔗 Links Importantes
- **Repositório**: https://github.com/Paulodev-web/Iservice.git
- **Vercel**: https://vercel.com
- **Supabase Dashboard**: https://app.supabase.com

## 📱 Deploy Automático
Qualquer push para a branch `main` irá automaticamente disparar um novo deploy no Vercel! 