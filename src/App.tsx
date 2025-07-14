import { useState, useEffect } from 'react';
import { LandingPage } from './components/pages/LandingPage';
import { LoginPage } from './components/pages/LoginPage';
import { SignupPage } from './components/pages/SignupPage';
import { ProviderListPage } from './components/pages/ProviderListPage';
import { ProviderProfilePage } from './components/pages/ProviderProfilePage';
import { ProviderDashboard } from './components/pages/ProviderDashboard';
import { ServiceManagementPage } from './components/pages/ServiceManagementPage';
import { mockProviders, mockDashboardStats, mockRecentWork } from './data/mockData';
import { Provider } from './types';
import { AuthProvider, useAuth } from './contexts/AuthContext';

type AppPage = 
  | 'landing'
  | 'login'
  | 'signup'
  | 'provider-list' 
  | 'provider-profile'
  | 'provider-dashboard'
  | 'service-management';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<AppPage>('landing');
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const { user, profile, loading, error, signOut } = useAuth();

  // Estado de autenticação monitorado internamente

  // Efeito para redirecionar baseado no estado de autenticação
  useEffect(() => {
    // Só redirecionar se o login foi bem-sucedido E não há loading
    if (user && profile && currentPage === 'login' && loginSuccess && !loading) {
      // Usuário logado com sucesso - ir para página apropriada
      if (profile.role === 'PRESTADOR') {
        setCurrentPage('provider-dashboard');
      } else {
        setCurrentPage('provider-list');
      }
      // Resetar o flag de sucesso
      setLoginSuccess(false);
    }
  }, [user, profile, currentPage, loginSuccess, loading]);

  const handleFindProfessional = () => {
    setCurrentPage('provider-list');
  };

  const handleViewProfile = (providerId: string) => {
    const provider = mockProviders.find(p => p.id === providerId);
    if (provider) {
      setSelectedProvider(provider);
      setCurrentPage('provider-profile');
    }
  };

  const handleLogin = () => {
    // Sinalizar que o login foi bem-sucedido
    // O redirecionamento será tratado pelo useEffect quando o contexto confirmar a autenticação
    setLoginSuccess(true);
  };

  const handleSignup = () => {
    // Após cadastro, redireciona para login
    setCurrentPage('login');
  };

  const handleGoToLogin = () => {
    setCurrentPage('login');
  };

  const handleGoToSignup = () => {
    setCurrentPage('signup');
  };

  // Função removida - não deve haver acesso direto sem autenticação

  const handleGoHome = async () => {
    await signOut();
    setCurrentPage('landing');
  };

  const handleNavigate = (section: string) => {
    if (section === 'services') {
      setCurrentPage('service-management');
    } else if (section === 'overview') {
      setCurrentPage('provider-dashboard');
    }
    // Outras seções podem ser implementadas futuramente
  };

  const handleBack = () => {
    if (currentPage === 'provider-profile') {
      setCurrentPage('provider-list');
    } else if (currentPage === 'provider-list') {
      setCurrentPage('landing');
    } else if (currentPage === 'login' || currentPage === 'signup') {
      setCurrentPage('landing');
    }
  };

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
              <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-cyan-50 via-white to-primary/5">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-gray-600">Carregando...</p>
          {error && (
            <div className="text-red-600 text-sm max-w-md mx-auto">
              Erro: {error}
              <button 
                onClick={() => window.location.reload()} 
                className="block mx-auto mt-2 text-blue-600 underline"
              >
                Recarregar página
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Mostrar erro se houver problema na autenticação (mas não na página de login)
  if (error && !loading && currentPage !== 'login') {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50">
        <div className="text-center space-y-4 max-w-md mx-auto p-6">
          <div className="text-red-600 text-6xl">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800">Erro de Conexão</h2>
          <p className="text-gray-600">{error}</p>
          <div className="space-y-2">
            <button 
              onClick={() => window.location.reload()} 
              className="block mx-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Recarregar página
            </button>

            <button 
              onClick={() => setCurrentPage('landing')} 
              className="block mx-auto px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Ir para início
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render da página atual
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'landing':
        return (
          <LandingPage
            onFindProfessional={handleFindProfessional}
            onLogin={handleGoToLogin}
            onSignup={handleGoToSignup}
          />
        );

      case 'login':
        return (
          <LoginPage
            onLogin={handleLogin}
            onSignup={handleGoToSignup}
            onBack={handleBack}
          />
        );

      case 'signup':
        return (
          <SignupPage
            onSignup={handleSignup}
            onLogin={handleGoToLogin}
            onBack={handleBack}
          />
        );
      
      case 'provider-list':
        return (
          <ProviderListPage
            providers={mockProviders}
            category="Limpeza Residencial"
            onViewProfile={handleViewProfile}
            onBack={handleBack}
          />
        );
      
      case 'provider-profile':
        return selectedProvider ? (
          <ProviderProfilePage
            provider={selectedProvider}
            onBack={handleBack}
            onGoToLogin={handleGoToLogin}
          />
        ) : null;
      
      case 'provider-dashboard':
        // Verificar se o usuário tem permissão
        if (user && profile?.role === 'PRESTADOR') {
          return (
            <ProviderDashboard
              stats={mockDashboardStats}
              recentWork={mockRecentWork}
              onNavigate={handleNavigate}
              onGoHome={handleGoHome}
            />
          );
        } else if (user && profile?.role === 'CLIENTE') {
          // Cliente tentando acessar dashboard do prestador - redirecionar
          setCurrentPage('provider-list');
          return null;
        } else {
          // Não logado - redirecionar para login
          setCurrentPage('login');
          return null;
        }
      
      case 'service-management':
        // Verificar se o usuário tem permissão
        if (user && profile?.role === 'PRESTADOR') {
          return (
            <ServiceManagementPage
              services={mockProviders[0].services} // TODO: Buscar serviços do prestador logado
              onNavigate={handleNavigate}
              onGoHome={handleGoHome}
            />
          );
        } else if (user && profile?.role === 'CLIENTE') {
          // Cliente tentando acessar gestão de serviços - redirecionar
          setCurrentPage('provider-list');
          return null;
        } else {
          // Não logado - redirecionar para login
          setCurrentPage('login');
          return null;
        }
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-full">
      {renderCurrentPage()}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;