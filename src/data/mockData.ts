import { Provider, DashboardStats, RecentWork } from '@/types';

export const mockProviders: Provider[] = [
  {
    id: "uuid-provider-1",
    fullName: "João Carlos",
    avatarUrl: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    rating: 4.9,
    reviewCount: 12,
    title: "Eletricista Verificado",
    bio: "Mais de 10 anos de experiência em instalações elétricas residenciais e comerciais. Especializado em sistemas de segurança e automação residencial. Atendimento rápido e garantia de 1 ano em todos os serviços.",
    isVerified: true,
    isGoldPartner: true,
    services: [
      { 
        id: "uuid-service-1", 
        title: "Instalação de Tomada", 
        description: "Instalação completa de ponto de tomada padrão, incluindo fiação e acabamento.", 
        price: 50.00 
      },
      { 
        id: "uuid-service-2", 
        title: "Troca de Chuveiro", 
        description: "Remoção do chuveiro antigo e instalação do novo com teste de funcionamento.", 
        price: 80.00 
      },
      { 
        id: "uuid-service-3", 
        title: "Instalação de Ventilador de Teto", 
        description: "Instalação completa com fiação, suporte e teste de todas as velocidades.", 
        price: 120.00 
      }
    ],
    reviews: [
      { 
        id: "uuid-review-1", 
        clientName: "Maria S.", 
        rating: 5, 
        comment: "Serviço excelente, muito profissional e rápido! Chegou no horário marcado e deixou tudo limpo.", 
        createdAt: "2025-06-15T10:00:00Z" 
      },
      { 
        id: "uuid-review-2", 
        clientName: "Carlos R.", 
        rating: 5, 
        comment: "Recomendo demais! Resolveu um problema que outros eletricistas não conseguiram.", 
        createdAt: "2025-06-10T14:30:00Z" 
      }
    ]
  },
  {
    id: "uuid-provider-2",
    fullName: "Ana Paula",
    avatarUrl: "https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    rating: 4.8,
    reviewCount: 8,
    title: "Especialista em Limpeza Pós-Obra",
    bio: "Profissional especializada em limpeza pós-obra e deep cleaning. Utilizo produtos ecológicos e equipamentos profissionais. Mais de 5 anos transformando ambientes.",
    isVerified: true,
    isGoldPartner: false,
    services: [
      { 
        id: "uuid-service-4", 
        title: "Limpeza Pós-Obra (até 50m²)", 
        description: "Limpeza completa pós-obra incluindo remoção de sujeira pesada, detritos e acabamento.", 
        price: 180.00 
      },
      { 
        id: "uuid-service-5", 
        title: "Limpeza Residencial Completa", 
        description: "Limpeza geral de toda residência incluindo banheiros, cozinha e quartos.", 
        price: 120.00 
      }
    ],
    reviews: [
      { 
        id: "uuid-review-3", 
        clientName: "Fernanda L.", 
        rating: 5, 
        comment: "Trabalho impecável! Minha casa ficou brilhando. Super pontual e cuidadosa.", 
        createdAt: "2025-06-12T09:15:00Z" 
      }
    ]
  },
  {
    id: "uuid-provider-3",
    fullName: "Roberto Silva",
    avatarUrl: "https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    rating: 4.7,
    reviewCount: 15,
    title: "Encanador Especializado",
    bio: "Encanador com mais de 8 anos de experiência. Especializado em vazamentos, entupimentos e instalações hidráulicas. Atendimento 24h para emergências.",
    isVerified: true,
    isGoldPartner: true,
    services: [
      { 
        id: "uuid-service-6", 
        title: "Desentupimento de Vaso Sanitário", 
        description: "Desentupimento profissional com equipamentos especializados e garantia.", 
        price: 90.00 
      },
      { 
        id: "uuid-service-7", 
        title: "Reparo de Vazamento Simples", 
        description: "Identificação e reparo de vazamentos em torneiras e registros.", 
        price: 70.00 
      }
    ],
    reviews: [
      { 
        id: "uuid-review-4", 
        clientName: "Pedro M.", 
        rating: 5, 
        comment: "Resolveu meu problema de vazamento rapidamente. Muito profissional!", 
        createdAt: "2025-06-08T16:20:00Z" 
      }
    ]
  }
];

export const mockDashboardStats: DashboardStats = {
  monthlyRevenue: 2450.00,
  averageRating: 4.9,
  completedServices: 18
};

export const mockRecentWork: RecentWork[] = [
  {
    id: "work-1",
    clientName: "Maria Santos",
    serviceName: "Instalação de Tomada",
    date: "2025-01-20",
    status: "Agendado"
  },
  {
    id: "work-2", 
    clientName: "Carlos Oliveira",
    serviceName: "Troca de Chuveiro",
    date: "2025-01-18",
    status: "Concluído"
  },
  {
    id: "work-3",
    clientName: "Ana Silva", 
    serviceName: "Instalação de Ventilador",
    date: "2025-01-17",
    status: "Em Andamento"
  },
  {
    id: "work-4",
    clientName: "João Ferreira",
    serviceName: "Instalação de Tomada", 
    date: "2025-01-15",
    status: "Concluído"
  }
];