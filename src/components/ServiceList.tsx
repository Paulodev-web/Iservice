import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Service } from '@/types';

interface ServiceListProps {
  services: Service[];
  onContractService?: (serviceId: string) => void;
}

export function ServiceList({ services, onContractService }: ServiceListProps) {
  const handleContractClick = (serviceId: string) => {
    if (onContractService) {
      onContractService(serviceId);
    }
  };

  return (
    <div className="space-y-4">
      {services.map((service) => (
        <Card key={service.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-base sm:text-lg leading-tight">
                  {service.title}
                </CardTitle>
                <CardDescription className="mt-1 text-sm leading-relaxed">
                  {service.description}
                </CardDescription>
              </div>
              <div className="sm:text-right sm:ml-4 flex-shrink-0">
                <div className="text-xl sm:text-2xl font-bold text-primary">
                  R$ {service.price.toFixed(2)}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Button 
              className="w-full" 
              size="lg"
              onClick={() => handleContractClick(service.id)}
            >
              Contratar
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}