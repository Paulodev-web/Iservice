import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Star, CheckCircle } from 'lucide-react';
import { DashboardStats, RecentWork } from '@/types';
import { Sidebar } from '../Sidebar';

interface ProviderDashboardProps {
  stats: DashboardStats;
  recentWork: RecentWork[];
  onNavigate: (section: string) => void;
  onGoHome?: () => void;
}

export function ProviderDashboard({ stats, recentWork, onNavigate, onGoHome }: ProviderDashboardProps) {
  const getStatusBadge = (status: string) => {
    const colors = {
      'Agendado': 'bg-blue-100 text-blue-800 hover:bg-blue-200',
      'Em Andamento': 'bg-amber-100 text-amber-800 hover:bg-amber-200',
      'Concluído': 'bg-green-100 text-green-800 hover:bg-green-200',
      'Cancelado': 'bg-red-100 text-red-800 hover:bg-red-200'
    } as const;

    return (
      <Badge className={colors[status as keyof typeof colors]}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar 
          currentSection="overview" 
          onNavigate={onNavigate} 
          onGoHome={onGoHome}
        />
        
        {/* Main Content */}
        <div className="flex-1 w-full p-4 lg:p-8">
          <div className="lg:ml-0 pt-16 lg:pt-0">
            <div className="mb-6 lg:mb-8">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                Visão Geral
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Acompanhe o desempenho do seu negócio
              </p>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Faturamento no Mês
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl lg:text-2xl font-bold">
                    R$ {stats.monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +12% em relação ao mês anterior
                  </p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Avaliação Média
                  </CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl lg:text-2xl font-bold">
                    {stats.averageRating.toFixed(1)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Baseado em todas as avaliações
                  </p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow sm:col-span-2 lg:col-span-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Serviços Concluídos
                  </CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl lg:text-2xl font-bold">
                    {stats.completedServices}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    No último mês
                  </p>
                </CardContent>
              </Card>
            </div>
            
            {/* Recent Work - Mobile View (Cards) */}
            <div className="block lg:hidden space-y-3 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Últimos Trabalhos Agendados
              </h2>
              {recentWork.map((work) => (
                <Card key={work.id} className="w-full">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1 min-w-0 pr-2">
                        <h3 className="font-medium text-sm text-gray-900 truncate">
                          {work.clientName}
                        </h3>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {work.serviceName}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        {getStatusBadge(work.status)}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(work.date).toLocaleDateString('pt-BR')}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Recent Work - Desktop View (Table) */}
            <Card className="hidden lg:block">
              <CardHeader>
                <CardTitle className="text-lg lg:text-xl">Últimos Trabalhos Agendados</CardTitle>
                <CardDescription>
                  Acompanhe seus agendamentos mais recentes
                </CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[120px]">Cliente</TableHead>
                      <TableHead className="min-w-[140px]">Serviço</TableHead>
                      <TableHead className="min-w-[100px]">Data</TableHead>
                      <TableHead className="min-w-[100px]">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentWork.map((work) => (
                      <TableRow key={work.id}>
                        <TableCell className="font-medium">
                          {work.clientName}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {work.serviceName}
                        </TableCell>
                        <TableCell>
                          {new Date(work.date).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(work.status)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}