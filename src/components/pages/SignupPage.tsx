import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Eye, EyeOff, User, Mail, Lock, Phone, MapPin, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types/database';

interface SignupPageProps {
  onSignup: () => void;
  onLogin: () => void;
  onBack: () => void;
}

export function SignupPage({ onSignup, onLogin, onBack }: SignupPageProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: '' as UserRole | '',
    city: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { signUp } = useAuth();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar mensagens ao editar
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setError('Nome completo é obrigatório');
      return false;
    }
    if (!formData.email.trim()) {
      setError('E-mail é obrigatório');
      return false;
    }
    if (!formData.password) {
      setError('Senha é obrigatória');
      return false;
    }
    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return false;
    }
    if (!formData.userType) {
      setError('Selecione o tipo de conta');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      const { error: signUpError } = await signUp(formData.email, formData.password, {
        full_name: formData.fullName,
        phone: formData.phone || undefined,
        role: formData.userType as UserRole
      });
      
      if (signUpError) {
        // Tratar diferentes tipos de erro
        if (signUpError.message.includes('email_already_exists') || signUpError.message.includes('already_registered')) {
          setError('Este e-mail já está cadastrado. Tente fazer login.');
        } else if (signUpError.message.includes('invalid_email')) {
          setError('E-mail inválido. Verifique o formato.');
        } else if (signUpError.message.includes('weak_password')) {
          setError('Senha muito fraca. Use pelo menos 6 caracteres.');
        } else {
          setError('Erro ao criar conta. Tente novamente.');
        }
        setIsLoading(false);
        return;
      }

      // Sucesso - mensagem atualizada para desenvolvimento
      setSuccess('Conta criada com sucesso! Email confirmado automaticamente. Redirecionando para o login...');
      
      // Aguardar um pouco antes de redirecionar
      setTimeout(() => {
        onSignup();
      }, 2000);
    } catch (err) {
      setError('Ocorreu um erro inesperado. Tente novamente.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light/10 via-white to-cyan-50 flex flex-col">
      {/* Header */}
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="text-gray-600 hover:text-gray-900"
            size="sm"
            disabled={isLoading}
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
      <div className="flex-1 flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-lg space-y-6">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-2 text-center pb-6">
              <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900">
                Criar sua conta
              </CardTitle>
              <CardDescription className="text-base text-gray-600">
                Junte-se à maior plataforma de serviços locais
              </CardDescription>
              {/* Badge de desenvolvimento */}
              <div className="inline-block">
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                  🔧 Desenvolvimento: Login imediato após cadastro
                </span>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Mensagem de erro */}
              {error && (
                <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-md">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-red-700">{error}</span>
                </div>
              )}

              {/* Mensagem de sucesso */}
              {success && (
                <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-md">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-700">{success}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nome completo */}
                <div className="space-y-2">
                  <label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                    Nome completo *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Seu nome completo"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="h-12 text-base pl-10"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* E-mail */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">
                    E-mail *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="h-12 text-base pl-10"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Telefone */}
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    Telefone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(11) 99999-9999"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="h-12 text-base pl-10"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Tipo de usuário */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Tipo de conta *
                  </label>
                  <Select 
                    value={formData.userType} 
                    onValueChange={(value) => handleInputChange('userType', value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue placeholder="Selecione o tipo de conta" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CLIENTE">Cliente - Contratar serviços</SelectItem>
                      <SelectItem value="PRESTADOR">Prestador - Oferecer serviços</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Cidade */}
                <div className="space-y-2">
                  <label htmlFor="city" className="text-sm font-medium text-gray-700">
                    Cidade
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="city"
                      type="text"
                      placeholder="Sua cidade"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="h-12 text-base pl-10"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Senha */}
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Senha *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Crie uma senha forte (min. 6 caracteres)"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="h-12 text-base pl-10 pr-12"
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

                {/* Confirmar senha */}
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                    Confirmar senha *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirme sua senha"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="h-12 text-base pl-10 pr-12"
                      required
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Termos */}
                <div className="flex items-start space-x-2 pt-2">
                  <input 
                    type="checkbox" 
                    id="terms"
                    className="rounded border-gray-300 mt-1" 
                    required 
                    disabled={isLoading}
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                    Eu concordo com os{' '}
                    <button type="button" className="text-primary hover:text-primary/80 underline">
                      Termos de Uso
                    </button>
                    {' '}e{' '}
                    <button type="button" className="text-primary hover:text-primary/80 underline">
                      Política de Privacidade
                    </button>
                  </label>
                </div>
                
                <Button 
                  type="submit" 
                  variant="gradient"
                  className="w-full h-12 text-base font-medium mt-6"
                  disabled={isLoading || success !== null}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Criando conta...
                    </>
                  ) : success ? (
                    'Conta criada! Redirecionando...'
                  ) : (
                    'Criar conta'
                  )}
                </Button>
              </form>
              
              <div className="text-center pt-4">
                <span className="text-gray-600">Já tem uma conta? </span>
                <button
                  onClick={onLogin}
                  className="text-primary hover:text-primary/80 font-medium"
                  disabled={isLoading}
                >
                  Faça login aqui
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 