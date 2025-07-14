import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Service } from '@/types';
import { Sidebar } from '../Sidebar';

interface ServiceManagementPageProps {
  services: Service[];
  onNavigate: (section: string) => void;
  onGoHome?: () => void;
}

export function ServiceManagementPage({ services, onNavigate, onGoHome }: ServiceManagementPageProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newService, setNewService] = useState({
    title: '',
    description: '',
    price: ''
  });

  const handleAddService = () => {
    // Aqui seria a lógica para adicionar o serviço
    console.log('Adicionando serviço:', newService);
    setIsAddModalOpen(false);
    setNewService({ title: '', description: '', price: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar 
          currentSection="services" 
          onNavigate={onNavigate} 
          onGoHome={onGoHome}
        />
        
        {/* Main Content */}
        <div className="flex-1 w-full p-4 lg:p-8">
          <div className="lg:ml-0 pt-16 lg:pt-0">
            <div className="mb-6 lg:mb-8">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                Meu Cardápio de Serviços
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Gerencie seus serviços de preço fixo
              </p>
            </div>
            
            {/* Add Service Button */}
            <div className="mb-6">
              <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto">
                    <Plus className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Adicionar Novo Serviço</span>
                    <span className="sm:hidden">Adicionar</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[90vw] max-w-[500px] mx-auto">
                  <DialogHeader>
                    <DialogTitle>Adicionar Novo Serviço</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Nome do Serviço
                      </label>
                      <Input
                        value={newService.title}
                        onChange={(e) => setNewService(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Ex: Instalação de Tomada"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Descrição
                      </label>
                      <Textarea
                        value={newService.description}
                        onChange={(e) => setNewService(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Descreva detalhadamente o que está incluído no serviço..."
                        rows={4}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Preço (R$)
                      </label>
                      <Input
                        type="number"
                        value={newService.price}
                        onChange={(e) => setNewService(prev => ({ ...prev, price: e.target.value }))}
                        placeholder="0.00"
                        step="0.01"
                      />
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <Button 
                        variant="outline" 
                        onClick={() => setIsAddModalOpen(false)}
                        className="flex-1"
                      >
                        Cancelar
                      </Button>
                      <Button onClick={handleAddService} className="flex-1">
                        Salvar Serviço
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            {/* Services - Mobile View (Cards) */}
            <div className="block lg:hidden space-y-4">
              {services.map((service) => (
                <Card key={service.id} className="w-full">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base font-medium leading-tight pr-2">
                        {service.title}
                      </CardTitle>
                      <div className="text-lg font-bold text-primary whitespace-nowrap">
                        R$ {service.price.toFixed(2)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                      {service.description}
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Excluir
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Services - Desktop View (Table) */}
            <div className="hidden lg:block bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[150px]">Nome</TableHead>
                      <TableHead className="min-w-[200px]">Descrição</TableHead>
                      <TableHead className="min-w-[100px]">Preço</TableHead>
                      <TableHead className="min-w-[100px] text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {services.map((service) => (
                      <TableRow key={service.id}>
                        <TableCell className="font-medium">
                          {service.title}
                        </TableCell>
                        <TableCell className="max-w-[250px]">
                          <div className="truncate lg:whitespace-normal">
                            {service.description}
                          </div>
                        </TableCell>
                        <TableCell>
                          R$ {service.price.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Editar</span>
                            </Button>
                            <Button size="sm" variant="outline">
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Excluir</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}