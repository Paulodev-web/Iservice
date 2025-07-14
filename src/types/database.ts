export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bookings: {
        Row: {
          booking_date: string
          client_id: string
          created_at: string
          final_price: number
          id: number
          provider_id: string
          service_id: number
          status: Database["public"]["Enums"]["booking_status"]
        }
        Insert: {
          booking_date: string
          client_id: string
          created_at?: string
          final_price: number
          id?: number
          provider_id: string
          service_id: number
          status?: Database["public"]["Enums"]["booking_status"]
        }
        Update: {
          booking_date?: string
          client_id?: string
          created_at?: string
          final_price?: number
          id?: number
          provider_id?: string
          service_id?: number
          status?: Database["public"]["Enums"]["booking_status"]
        }
        Relationships: [
          {
            foreignKeyName: "bookings_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          id: number
          name: string
          slug: string
        }
        Insert: {
          id?: number
          name: string
          slug: string
        }
        Update: {
          id?: number
          name?: string
          slug?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          full_name: string
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          stripe_connect_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name: string
          id: string
          phone?: string | null
          role: Database["public"]["Enums"]["user_role"]
          stripe_connect_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          stripe_connect_id?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          booking_id: number
          comment: string | null
          created_at: string
          id: number
          provider_id: string
          rating: number
          reviewer_id: string
        }
        Insert: {
          booking_id: number
          comment?: string | null
          created_at?: string
          id?: number
          provider_id: string
          rating: number
          reviewer_id: string
        }
        Update: {
          booking_id?: number
          comment?: string | null
          created_at?: string
          id?: number
          provider_id?: string
          rating?: number
          reviewer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: true
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          category_id: number
          created_at: string
          description: string | null
          id: number
          is_active: boolean
          price: number
          provider_id: string
          title: string
        }
        Insert: {
          category_id: number
          created_at?: string
          description?: string | null
          id?: number
          is_active?: boolean
          price: number
          provider_id: string
          title: string
        }
        Update: {
          category_id?: number
          created_at?: string
          description?: string | null
          id?: number
          is_active?: boolean
          price?: number
          provider_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "services_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      bookings_with_details: {
        Row: {
          booking_date: string | null
          category_name: string | null
          client_name: string | null
          client_phone: string | null
          created_at: string | null
          final_price: number | null
          id: number | null
          provider_name: string | null
          service_description: string | null
          service_title: string | null
          status: Database["public"]["Enums"]["booking_status"] | null
        }
        Relationships: []
      }
      provider_dashboard: {
        Row: {
          average_rating: number | null
          completed_bookings: number | null
          full_name: string | null
          provider_id: string | null
          total_bookings: number | null
          total_earnings: number | null
          total_reviews: number | null
          total_services: number | null
        }
        Relationships: []
      }
      services_with_details: {
        Row: {
          category_name: string | null
          category_slug: string | null
          created_at: string | null
          description: string | null
          id: number | null
          is_active: boolean | null
          price: number | null
          provider_avatar: string | null
          provider_id: string | null
          provider_name: string | null
          provider_rating: number | null
          provider_review_count: number | null
          title: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_provider_rating: {
        Args: { provider_uuid: string }
        Returns: {
          average_rating: number
          review_count: number
        }[]
      }
      get_provider_stats: {
        Args: { provider_uuid: string }
        Returns: {
          total_services: number
          active_services: number
          total_bookings: number
          completed_bookings: number
          pending_bookings: number
          total_earnings: number
          this_month_earnings: number
          average_rating: number
          total_reviews: number
        }[]
      }
      search_services: {
        Args: {
          category_slug_param?: string
          limit_param?: number
          offset_param?: number
        }
        Returns: {
          service_id: number
          title: string
          description: string
          price: number
          provider_name: string
          provider_avatar: string
          provider_id: string
          provider_rating: number
          review_count: number
          category_name: string
        }[]
      }
    }
    Enums: {
      booking_status: "AGENDADO" | "CONCLUIDO" | "CANCELADO"
      user_role: "CLIENTE" | "PRESTADOR"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      booking_status: ["AGENDADO", "CONCLUIDO", "CANCELADO"],
      user_role: ["CLIENTE", "PRESTADOR"],
    },
  },
} as const

// Aliases úteis para desenvolvimento
export type Profile = Tables<'profiles'>
export type Service = Tables<'services'>
export type Booking = Tables<'bookings'>
export type Review = Tables<'reviews'>
export type Category = Tables<'categories'>

export type UserRole = Database['public']['Enums']['user_role']
export type BookingStatus = Database['public']['Enums']['booking_status']

export type ServiceWithDetails = Tables<'services_with_details'>
export type BookingWithDetails = Tables<'bookings_with_details'>
export type ProviderDashboard = Tables<'provider_dashboard'> 