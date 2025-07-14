import { ProviderCard } from '../ProviderCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, LogOut } from 'lucide-react';
import { Provider } from '@/types';
import { useAuth } from '../../contexts/AuthContext';

interface ProviderListPageProps {
  providers: Provider[];
  category: string;
  onViewProfile: (providerId: string) => void;
  onBack: () => void;
}

export function ProviderListPage({ 
  providers, 
  category, 
  onViewProfile, 
  onBack 
}: ProviderListPageProps) {
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    // O logout redireciona automaticamente para landing page via AuthContext
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-4 lg:py-6 max-w-7xl">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="-ml-2"
              size="sm"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleLogout}
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Sair da Conta</span>
              <span className="sm:hidden">Sair</span>
            </Button>
          </div>
          
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
            Resultados para: {category}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Encontramos {providers.length} profissionais disponíveis
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {providers.map((provider) => (
            <ProviderCard 
              key={provider.id}
              provider={provider}
              onViewProfile={onViewProfile}
            />
          ))}
        </div>
      </div>
    </div>
  );
}