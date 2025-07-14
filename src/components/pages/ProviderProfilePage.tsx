import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, MessageCircle, LogOut } from 'lucide-react';
import { StarRating } from '../StarRating';
import { ServiceList } from '../ServiceList';
import { ReviewList } from '../ReviewList';
import { Provider } from '@/types';
import { useAuth } from '../../contexts/AuthContext';

interface ProviderProfilePageProps {
  provider: Provider;
  onBack: () => void;
  onGoToLogin?: () => void;
}

export function ProviderProfilePage({ provider, onBack, onGoToLogin }: ProviderProfilePageProps) {
  const [activeTab, setActiveTab] = useState('servicos');
  const { user, profile, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    // O logout redireciona automaticamente para landing page via AuthContext
  };

  const handleContractService = (serviceId: string) => {
    // Verificar se o usuário está logado como cliente
    if (!user || !profile) {
      // Usuário não está logado - redirecionar para login
      if (onGoToLogin) {
        onGoToLogin();
      }
      return;
    }

    if (profile.role !== 'CLIENTE') {
      // Usuário logado mas não é cliente - mostrar mensagem ou redirecionar
      alert('Apenas clientes podem contratar serviços. Faça logout e entre como cliente.');
      return;
    }

    // Usuário logado como cliente - prosseguir com contratação
    console.log('Contratando serviço:', serviceId);
    // TODO: Implementar lógica de contratação
    alert('Funcionalidade de contratação será implementada em breve!');
  };

  const handleStartChat = () => {
    // Verificar se o usuário está logado como cliente
    if (!user || !profile) {
      // Usuário não está logado - redirecionar para login
      if (onGoToLogin) {
        onGoToLogin();
      }
      return;
    }

    if (profile.role !== 'CLIENTE') {
      // Usuário logado mas não é cliente - mostrar mensagem
      alert('Apenas clientes podem iniciar orçamentos. Faça logout e entre como cliente.');
      return;
    }

    // Usuário logado como cliente - prosseguir com chat
    console.log('Iniciando chat com prestador:', provider.id);
    // TODO: Implementar lógica de chat
    alert('Funcionalidade de chat será implementada em breve!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Barra superior com botões */}
        <div className="flex justify-between items-center mb-6">
          <Button 
            variant="ghost" 
            onClick={onBack}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          
          {/* Botão de logout estratégico */}
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
        
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Coluna Principal - Informações do Prestador */}
          <div className="lg:col-span-1 order-1 lg:order-1">
            <div className="bg-white rounded-lg p-4 lg:p-6 shadow-md lg:sticky lg:top-6">
              <div className="text-center mb-6">
                <Avatar className="h-24 w-24 lg:h-32 lg:w-32 mx-auto mb-4">
                  <AvatarImage src={provider.avatarUrl} alt={provider.fullName} />
                  <AvatarFallback className="text-xl lg:text-2xl">
                    {provider.fullName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                  {provider.fullName}
                </h2>
                
                <div className="flex justify-center mb-4">
                  <StarRating 
                    rating={provider.rating} 
                    size="lg" 
                    reviewCount={provider.reviewCount}
                  />
                </div>
                
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {provider.isVerified && (
                    <Badge variant="secondary">
                      ✔ Verificado
                    </Badge>
                  )}
                  {provider.isGoldPartner && (
                    <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                      🌟 Parceiro Ouro
                    </Badge>
                  )}
                </div>
                
                <p className="text-gray-600 text-sm leading-relaxed mb-6 text-left lg:text-center">
                  {provider.bio}
                </p>
                
                <Button 
                  className="w-full text-base lg:text-lg py-4 lg:py-6"
                  onClick={handleStartChat}
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Iniciar Orçamento via Chat
                </Button>
              </div>
            </div>
          </div>
          
          {/* Coluna de Detalhes - Abas */}
          <div className="lg:col-span-2 order-2 lg:order-2">
            <div className="bg-white rounded-lg shadow-md">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 rounded-t-lg">
                  <TabsTrigger 
                    value="servicos" 
                    className="text-xs sm:text-sm"
                  >
                    Serviços (Preço Fixo)
                  </TabsTrigger>
                  <TabsTrigger 
                    value="avaliacoes"
                    className="text-xs sm:text-sm"
                  >
                    Avaliações
                  </TabsTrigger>
                </TabsList>
                
                <div className="p-4 lg:p-6">
                  <TabsContent value="servicos" className="mt-0">
                    <ServiceList 
                      services={provider.services} 
                      onContractService={handleContractService}
                    />
                  </TabsContent>
                  
                  <TabsContent value="avaliacoes" className="mt-0">
                    <ReviewList reviews={provider.reviews} />
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}