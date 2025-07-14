export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
}

export interface Review {
  id: string;
  clientName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Provider {
  id: string;
  fullName: string;
  avatarUrl: string;
  rating: number;
  reviewCount: number;
  title: string;
  bio: string;
  isVerified: boolean;
  isGoldPartner: boolean;
  services: Service[];
  reviews: Review[];
}

export interface DashboardStats {
  monthlyRevenue: number;
  averageRating: number;
  completedServices: number;
}

export interface RecentWork {
  id: string;
  clientName: string;
  serviceName: string;
  date: string;
  status: 'Agendado' | 'Em Andamento' | 'Concluído' | 'Cancelado';
}