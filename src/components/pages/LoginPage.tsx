import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { ArrowLeft, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface LoginPageProps {
  onLogin: () => void;
  onSignup: () => void;
  onBack: () => void;
}

export function LoginPage({ onLogin, onSignup, onBack }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { signIn } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await signIn(email, password);
      
      // Verificar se há erro de autenticação
      if (result && result.error) {
        // Tratar diferentes tipos de erro de forma mais específica
        const errorMessage = result.error.message?.toLowerCase() || '';
        
        if (errorMessage.includes('invalid login credentials') || 
            errorMessage.includes('invalid email or password') ||
            errorMessage.includes('invalid credentials')) {
          setError('Credenciais inválidas. Verifique seu e-mail e senha e tente novamente.');
        } else if (errorMessage.includes('email not confirmed')) {
          setError('Por favor, confirme seu e-mail antes de fazer login. Verifique sua caixa de entrada.');
        } else if (errorMessage.includes('too many requests')) {
          setError('Muitas tentativas de login. Aguarde alguns minutos antes de tentar novamente.');
        } else {
          setError('Credenciais inválidas. Verifique seu e-mail e senha e tente novamente.');
        }
        setIsLoading(false);
        return;
      }
      
      // Se não há resultado, algo deu errado
      if (!result) {
        setError('Erro de conexão. Tente novamente.');
        setIsLoading(false);
        return;
      }

      // Login bem-sucedido
      setIsLoading(false);
      onLogin();
      
    } catch (err: any) {
      setError('Erro inesperado. Verifique suas credenciais e tente novamente.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-primary/5 flex flex-col">
      {/* Header */}
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="text-gray-600 hover:text-gray-900"
            size="sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          
          <div className="flex items-center space-x-3">
            <img 
              src="/logoiservice.png" 
              alt="IService Logo" 
              className="h-10 w-10 object-contain"
            />
            <span className="text-2xl font-bold text-primary">IService</span>
          </div>
          
          <div className="w-20" /> {/* Spacer for centering */}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-2 text-center pb-6">
              <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900">
                Bem-vindo de volta!
              </CardTitle>
              <CardDescription className="text-base text-gray-600">
                Faça login para acessar sua conta
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Mensagem de erro */}
              {error && (
                <div className="flex items-start space-x-3 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-md shadow-sm">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-800 leading-relaxed">
                      {error}
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">
                    E-mail
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      // Limpar erro quando usuário começar a digitar
                      if (error) setError(null);
                    }}
                    className="h-12 text-base"
                    required
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Senha
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Digite sua senha"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        // Limpar erro quando usuário começar a digitar
                        if (error) setError(null);
                      }}
                      className="h-12 text-base pr-12"
                      required
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300" disabled={isLoading} />
                    <span className="text-gray-600">Lembrar de mim</span>
                  </label>
                  <button 
                    type="button" 
                    className="text-primary hover:text-primary/80 font-medium"
                    disabled={isLoading}
                  >
                    Esqueceu a senha?
                  </button>
                </div>
                
                <Button 
                  type="submit" 
                  variant="gradient"
                  className="w-full h-12 text-base font-medium"
                  disabled={isLoading || !email || !password}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Entrando...
                    </>
                  ) : (
                    'Entrar'
                  )}
                </Button>
                
                <div className="text-center pt-4">
                  <span className="text-gray-600">Não tem uma conta? </span>
                  <button
                    onClick={onSignup}
                    className="text-primary hover:text-primary/80 font-medium"
                    disabled={isLoading}
                  >
                    Cadastre-se aqui
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          {/* Footer */}
          <div className="text-center text-sm text-gray-500 space-y-2">
            <p>Ao continuar, você concorda com nossos</p>
            <div className="space-x-4">
              <button className="hover:text-gray-700 underline">
                Termos de Uso
              </button>
              <button className="hover:text-gray-700 underline">
                Política de Privacidade
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 