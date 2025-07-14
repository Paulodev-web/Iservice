import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { User, Mail, Phone, Calendar } from 'lucide-react';

export function UserInfo() {
  const { user, profile } = useAuth();

  if (!user || !profile) {
    return null;
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="h-5 w-5" />
          <span>Usuário Logado</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center space-x-2">
          <User className="h-4 w-4 text-gray-500" />
          <span className="text-sm">{profile.full_name}</span>
          <Badge variant={profile.role === 'PRESTADOR' ? 'default' : 'secondary'}>
            {profile.role}
          </Badge>
        </div>
        
        <div className="flex items-center space-x-2">
          <Mail className="h-4 w-4 text-gray-500" />
          <span className="text-sm">{user.email}</span>
        </div>
        
        {profile.phone && (
          <div className="flex items-center space-x-2">
            <Phone className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{profile.phone}</span>
          </div>
        )}
        
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className="text-sm">
            Cadastrado em {new Date(profile.created_at).toLocaleDateString('pt-BR')}
          </span>
        </div>
      </CardContent>
    </Card>
  );
} 