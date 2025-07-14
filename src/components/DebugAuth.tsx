import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export function DebugAuth() {
  const { user, profile, loading, signOut } = useAuth();

  if (loading) {
    return (
      <Card className="w-full max-w-lg">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            <span>Carregando estado de autenticação...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>🐛 Debug - Estado da Autenticação</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {user ? (
          <div className="space-y-3">
            <div>
              <strong>✅ Usuário Autenticado</strong>
              <div className="text-sm text-gray-600 mt-1">
                <p><strong>ID:</strong> {user.id}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Confirmado:</strong> {user.email_confirmed_at ? '✅' : '❌'}</p>
              </div>
            </div>

            {profile ? (
              <div>
                <strong>👤 Perfil Carregado</strong>
                <div className="text-sm text-gray-600 mt-1 space-y-1">
                  <p><strong>Nome:</strong> {profile.full_name}</p>
                  <p><strong>Role:</strong> 
                    <Badge variant={profile.role === 'PRESTADOR' ? 'default' : 'secondary'} className="ml-2">
                      {profile.role}
                    </Badge>
                  </p>
                  {profile.phone && <p><strong>Telefone:</strong> {profile.phone}</p>}
                  <p><strong>Criado em:</strong> {new Date(profile.created_at).toLocaleString('pt-BR')}</p>
                </div>
              </div>
            ) : (
              <div>
                <strong>⚠️ Perfil não encontrado</strong>
                <p className="text-sm text-red-600">O usuário está autenticado, mas o perfil não foi encontrado no banco.</p>
              </div>
            )}

            <Button 
              variant="destructive" 
              onClick={signOut} 
              className="w-full"
            >
              🚪 Fazer Logout
            </Button>
          </div>
        ) : (
          <div>
            <strong>❌ Usuário não autenticado</strong>
            <p className="text-sm text-gray-600 mt-1">
              Nenhum usuário logado no momento.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 