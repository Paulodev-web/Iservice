import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { User, BarChart3, MessageSquare, Wallet, CheckCircle, Menu, Home, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  isActive?: boolean;
}

interface SidebarProps {
  currentSection: string;
  onNavigate: (section: string) => void;
  onGoHome?: () => void;
}

export function Sidebar({ currentSection, onNavigate, onGoHome }: SidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    setIsMobileMenuOpen(false);
    // O logout redireciona automaticamente via AuthContext
  };

  const menuItems: SidebarItem[] = [
    {
      id: 'overview',
      label: 'Visão Geral',
      icon: <BarChart3 className="h-5 w-5" />,
      isActive: currentSection === 'overview'
    },
    {
      id: 'services',
      label: 'Meu Cardápio',
      icon: <CheckCircle className="h-5 w-5" />,
      isActive: currentSection === 'services'
    },
    {
      id: 'chats',
      label: 'Chats',
      icon: <MessageSquare className="h-5 w-5" />,
      isActive: currentSection === 'chats'
    },
    {
      id: 'financial',
      label: 'Financeiro',
      icon: <Wallet className="h-5 w-5" />,
      isActive: currentSection === 'financial'
    }
  ];

  const SidebarContent = () => (
    <div className="p-6 h-full flex flex-col">
      <div className="flex items-center space-x-2 mb-8">
        <User className="h-8 w-8 text-primary" />
        <span className="text-xl font-bold text-gray-900">Painel</span>
      </div>
      
      <nav className="space-y-2 flex-1">
        {menuItems.map((item) => (
          <button 
            key={item.id}
            onClick={() => {
              onNavigate(item.id);
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg font-medium transition-colors ${
              item.isActive 
                ? 'bg-primary/10 text-primary' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Botões do rodapé */}
      <div className="pt-4 border-t border-gray-200 mt-4 space-y-2">
        {/* Botão Logout Dedicado */}
        <Button 
          variant="outline" 
          onClick={() => {
            handleLogout();
            setIsMobileMenuOpen(false);
          }}
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300"
        >
          <LogOut className="h-4 w-4 mr-3" />
          Sair da Conta
        </Button>
        
        {/* Botão Voltar ao Início (mantém funcionalidade original) */}
        {onGoHome && (
          <Button 
            variant="outline" 
            onClick={() => {
              onGoHome();
              setIsMobileMenuOpen(false);
            }}
            className="w-full justify-start"
          >
            <Home className="h-4 w-4 mr-3" />
            Voltar ao Início
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 bg-white shadow-lg">
        <SidebarContent />
      </div>

      {/* Mobile Header with Menu Button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <User className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold text-gray-900">Painel</span>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Botão Home no Mobile */}
            {onGoHome && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onGoHome}
                className="text-gray-600 hover:text-gray-900"
              >
                <Home className="h-5 w-5" />
              </Button>
            )}
            
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <SidebarContent />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </>
  );
} 