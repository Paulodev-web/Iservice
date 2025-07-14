import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { Profile, UserRole } from '../types/database'

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: Profile | null
  loading: boolean
  error: string | null
  signUp: (email: string, password: string, userData: SignUpData) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

interface SignUpData {
  full_name: string
  phone?: string
  role: UserRole
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Buscar perfil do usuário
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      if (error) {
        console.error('Erro ao buscar perfil:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('Erro ao fetchProfile:', error)
      return null
    }
  }

  // Atualizar perfil
  const refreshProfile = async () => {
    if (user) {
      const profileData = await fetchProfile(user.id)
      setProfile(profileData)
    }
  }

  // Limpar estado completamente
  const clearAuthState = () => {
    setUser(null)
    setSession(null)
    setProfile(null)
    setError(null)
  }

  // Função de cadastro
  const signUp = async (email: string, password: string, userData: SignUpData) => {
    try {
      setError(null)
      setLoading(true)
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.full_name,
            role: userData.role,
            phone: userData.phone
          }
        }
      })

      if (error) {
        console.error('Erro no signUp:', error)
        setError(error.message)
      }

      setLoading(false)
      return { error }
    } catch (err: any) {
      console.error('Erro inesperado no signUp:', err)
      setError(err.message)
      setLoading(false)
      return { error: err }
    }
  }

  // Função de login
  const signIn = async (email: string, password: string) => {
    setLoading(true)
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      setLoading(false)
      
      // Retornar sempre o resultado para a página tratar
      return { error, data }
    } catch (err: any) {
      setLoading(false)
      return { error: err, data: null }
    }
  }

  // Função de logout
  const signOut = async () => {
    try {
      // Limpar estado local primeiro
      clearAuthState()
      
      // Fazer logout no Supabase
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Erro no logout:', error)
      }
    } catch (error) {
      console.error('Erro inesperado no logout:', error)
    }
  }

  // Efeito para monitorar mudanças na autenticação
  useEffect(() => {
    let isMounted = true
    
    const initializeAuth = async () => {
      try {
        // ⚡ OTIMIZAÇÃO: Timeout mínimo de 500ms apenas para segurança
        const timeoutId = setTimeout(() => {
          if (isMounted) {
            console.warn('Timeout na inicialização - finalizando loading')
            setLoading(false)
          }
        }, 500) // Reduzido para 500ms

        // Obter sessão inicial (verificação rápida)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        // Limpar timeout imediatamente após obter resposta
        clearTimeout(timeoutId)
        
        if (!isMounted) return

        // Se houver erro na sessão, finalizar rapidamente
        if (sessionError) {
          console.error('Erro ao obter sessão:', sessionError)
          clearAuthState()
          setLoading(false)
          return
        }

        // 🚀 OTIMIZAÇÃO: Se não há sessão, finalizar IMEDIATAMENTE
        if (!session?.user) {
          clearAuthState()
          setLoading(false)
          return
        }

        // 🔄 Só buscar perfil se realmente há usuário logado
        setLoading(true)
        const profileData = await fetchProfile(session.user.id)
        
        if (!isMounted) return

        // Se não encontrou perfil, limpar sessão automaticamente
        if (!profileData) {
          console.warn('Perfil não encontrado - limpando sessão')
          await supabase.auth.signOut()
          clearAuthState()
          setLoading(false)
          return
        }

        // ✅ Tudo OK - definir estado
        setSession(session)
        setUser(session.user)
        setProfile(profileData)
        setLoading(false)
        
      } catch (error: any) {
        console.error('Erro na inicialização:', error)
        if (isMounted) {
          clearAuthState()
          setLoading(false)
        }
      }
    }

    // Listener para mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return
        
        // Se logout, limpar tudo
        if (event === 'SIGNED_OUT') {
          clearAuthState()
          setLoading(false)
          return
        }
        
        // Se login/signup, verificar perfil
        if (event === 'SIGNED_IN' && session?.user) {
          setLoading(true)
          const profileData = await fetchProfile(session.user.id)
          
          if (!isMounted) return
          
          if (!profileData) {
            console.warn('Perfil não encontrado - fazendo logout')
            await supabase.auth.signOut()
            setLoading(false)
            return
          }
          
          setSession(session)
          setUser(session.user)
          setProfile(profileData)
          setLoading(false)
        }
      }
    )

    // Inicializar
    initializeAuth()

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  const value = {
    user,
    session,
    profile,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    refreshProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 