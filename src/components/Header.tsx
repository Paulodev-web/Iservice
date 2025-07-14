import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Menu, LogOut, User, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  onLogin: () => void;
  onSignup: () => void;
}

export function Header({ onLogin, onSignup }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      setIsMenuOpen(false);
      // O logout redireciona automaticamente para landing page via AuthContext
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      // Forçar logout local em caso de erro
      setIsMenuOpen(false);
      window.location.reload();
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="bg-brand-gradient shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src="/logoiservice.png" 
              alt="IService Logo" 
              className="h-14 w-14 object-contain"
            />
            <span className="text-white text-3xl font-black tracking-wide" style={{ fontFamily: 'Arial Black, sans-serif' }}>
              ISERVICE
            </span>
          </div>
          
          {/* Desktop buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {user && profile ? (
              // Usuário logado
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-white">{profile.full_name}</p>
                  <div className="flex items-center space-x-1">
                    <Badge 
                      className={`text-xs ${
                        profile.role === 'PRESTADOR' 
                          ? 'bg-white text-primary border-0 shadow-md' 
                          : 'bg-white/80 text-primary'
                      }`}
                    >
                      {profile.role}
                    </Badge>
                  </div>
                </div>
                
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile.avatar_url || undefined} />
                  <AvatarFallback className="text-xs">
                    {getInitials(profile.full_name)}
                  </AvatarFallback>
                </Avatar>

                <Button 
                  size="sm" 
                  onClick={handleLogout}
                  className="bg-transparent border-2 border-white text-white font-medium hover:bg-white hover:text-primary transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
              </div>
            ) : (
              // Usuário não logado
              <>
                <Button 
                  onClick={onLogin}
                  className="bg-transparent border-2 border-white text-white font-medium hover:bg-white hover:text-primary transition-colors"
                >
                  Login
                </Button>
                <Button 
                  onClick={onSignup}
                  className="bg-white text-primary font-medium hover:bg-white/90 transition-colors"
                >
                  Cadastre-se
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu */}
          <div className="md:hidden">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  size="sm"
                  className="bg-transparent text-white hover:bg-white/20 transition-colors"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col space-y-4 mt-8">
                  {user && profile ? (
                    // Usuário logado - Menu mobile
                    <>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={profile.avatar_url || undefined} />
                          <AvatarFallback className="text-sm">
                            {getInitials(profile.full_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{profile.full_name}</p>
                          <Badge 
                            className={`text-xs ${
                              profile.role === 'PRESTADOR' 
                                ? 'bg-brand-gradient text-white border-0 shadow-md' 
                                : 'bg-secondary text-secondary-foreground'
                            }`}
                          >
                            {profile.role}
                          </Badge>
                        </div>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        onClick={() => setIsMenuOpen(false)}
                        className="w-full justify-start"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Perfil
                      </Button>

                      <Button 
                        variant="outline" 
                        onClick={() => setIsMenuOpen(false)}
                        className="w-full justify-start"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Configurações
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        onClick={handleLogout}
                        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sair
                      </Button>
                    </>
                  ) : (
                    // Usuário não logado - Menu mobile
                    <>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          onLogin();
                          setIsMenuOpen(false);
                        }}
                        className="w-full"
                      >
                        Login
                      </Button>
                      <Button 
                        onClick={() => {
                          onSignup();
                          setIsMenuOpen(false);
                        }}
                        className="w-full"
                      >
                        Cadastre-se
                      </Button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}