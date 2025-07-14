import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { StarRating } from './StarRating';
import { Provider } from '@/types';

interface ProviderCardProps {
  provider: Provider;
  onViewProfile: (providerId: string) => void;
}

export function ProviderCard({ provider, onViewProfile }: ProviderCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer h-full flex flex-col">
      <CardHeader className="pb-4 flex-shrink-0">
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12 sm:h-16 sm:w-16 flex-shrink-0">
            <AvatarImage src={provider.avatarUrl} alt={provider.fullName} />
            <AvatarFallback className="text-sm sm:text-base">
              {provider.fullName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base sm:text-lg font-semibold leading-tight mb-1 line-clamp-2">
              {provider.fullName}
            </CardTitle>
            <div className="flex items-center gap-2 mb-2">
              <StarRating 
                rating={provider.rating} 
                size="sm" 
                reviewCount={provider.reviewCount}
              />
            </div>
            <div className="flex flex-wrap gap-1">
              {provider.isVerified && (
                <Badge className="text-xs bg-brand-gradient text-white border-0 shadow-md">
                  ✔ Verificado
                </Badge>
              )}
              {provider.isGoldPartner && (
                <Badge variant="default" className="text-xs bg-amber-100 text-amber-800 hover:bg-amber-200">
                  🌟 Parceiro Ouro
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 flex-1">
        <CardDescription className="text-sm leading-relaxed line-clamp-3">
          {provider.title}
        </CardDescription>
      </CardContent>
      <CardFooter className="pt-4 flex-shrink-0">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => onViewProfile(provider.id)}
        >
          Ver Perfil e Serviços
        </Button>
      </CardFooter>
    </Card>
  );
}