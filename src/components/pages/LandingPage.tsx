import { Button } from '@/components/ui/button';
import { Header } from '../Header';
import { useAuth } from '../../contexts/AuthContext';

import { Search, Shield, Star, Clock, LogOut } from 'lucide-react';

interface LandingPageProps {
  onFindProfessional: () => void;
  onLogin: () => void;
  onSignup: () => void;
}

export function LandingPage({ onFindProfessional, onLogin, onSignup }: LandingPageProps) {
  const { user, profile, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    // O logout redireciona automaticamente para landing page via AuthContext
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-primary/5">
      <Header onLogin={onLogin} onSignup={onSignup} />
      
      <main className="container mx-auto px-4 py-8 sm:py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Botão de logout adicional para usuários logados */}
          {user && profile && (
            <div className="mb-6 sm:mb-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 sm:p-6 shadow-md max-w-2xl mx-auto">
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <p className="text-sm text-gray-600">Bem-vindo de volta,</p>
                    <p className="text-lg font-semibold text-gray-900">{profile.full_name}</p>
                    <p className="text-xs text-gray-500">{profile.role}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={handleLogout}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Sair da Conta</span>
                    <span className="sm:hidden">Sair</span>
                  </Button>
                </div>
              </div>
            </div>
          )}

          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            A forma mais segura de contratar 
            <span className="text-primary"> serviços locais</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Conectamos você com profissionais verificados e qualificados. 
            Transparência, segurança e qualidade garantida em cada serviço.
          </p>
          
          <Button 
            variant="gradient"
            size="lg" 
            className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 mb-12 sm:mb-16 w-full sm:w-auto"
            onClick={onFindProfessional}
          >
            <Search className="mr-2 h-5 w-5" />
            Encontrar um Profissional Agora
          </Button>


          
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mt-12 sm:mt-16">
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="bg-brand-gradient-light w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3">Profissionais Verificados</h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Todos os prestadores passam por processo rigoroso de verificação 
                de identidade e qualificações.
              </p>
            </div>
            
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="bg-brand-gradient-light w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3">Avaliações Reais</h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Sistema de avaliações transparente com comentários de clientes reais 
                para sua total segurança.
              </p>
            </div>
            
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="bg-brand-gradient-light w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3">Rapidez na Contratação</h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Compare preços fixos, veja disponibilidade e contrate 
                em poucos cliques.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}