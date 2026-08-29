export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          bay: string | null
          created_at: string
          customer_id: string
          date: string
          duration_minutes: number | null
          est_price: number | null
          garage_id: string
          id: string
          job_type: Database["public"]["Enums"]["job_type"]
          notes: string | null
          technician: string | null
          time: string | null
          vehicle_id: string | null
        }
        Insert: {
          bay?: string | null
          created_at?: string
          customer_id: string
          date: string
          duration_minutes?: number | null
          est_price?: number | null
          garage_id: string
          id?: string
          job_type: Database["public"]["Enums"]["job_type"]
          notes?: string | null
          technician?: string | null
          time?: string | null
          vehicle_id?: string | null
        }
        Update: {
          bay?: string | null
          created_at?: string
          customer_id?: string
          date?: string
          duration_minutes?: number | null
          est_price?: number | null
          garage_id?: string
          id?: string
          job_type?: Database["public"]["Enums"]["job_type"]
          notes?: string | null
          technician?: string | null
          time?: string | null
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_garage_id_fkey"
            columns: ["garage_id"]
            isOneToOne: false
            referencedRelation: "garage_settings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          address_line: string
          city: string
          created_at: string
          email: string
          full_name: string
          garage_id: string
          id: string
          notes: string | null
          phone: string
          post_code: string
          updated_at: string
        }
        Insert: {
          address_line: string
          city: string
          created_at?: string
          email: string
          full_name: string
          garage_id: string
          id?: string
          notes?: string | null
          phone: string
          post_code: string
          updated_at?: string
        }
        Update: {
          address_line?: string
          city?: string
          created_at?: string
          email?: string
          full_name?: string
          garage_id?: string
          id?: string
          notes?: string | null
          phone?: string
          post_code?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customers_garage_id_fkey"
            columns: ["garage_id"]
            isOneToOne: false
            referencedRelation: "garage_settings"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          active: boolean
          created_at: string
          email: string | null
          full_name: string
          garage_id: string
          hourly_rate: number
          id: string
          phone: string | null
          role: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          email?: string | null
          full_name: string
          garage_id: string
          hourly_rate?: number
          id?: string
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          email?: string | null
          full_name?: string
          garage_id?: string
          hourly_rate?: number
          id?: string
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "employees_garage_id_fkey"
            columns: ["garage_id"]
            isOneToOne: false
            referencedRelation: "garage_settings"
            referencedColumns: ["id"]
          },
        ]
      }
      garage_members: {
        Row: {
          created_at: string
          garage_id: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          garage_id: string
          id?: string
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string
          garage_id?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "garage_members_garage_id_fkey"
            columns: ["garage_id"]
            isOneToOne: false
            referencedRelation: "garage_settings"
            referencedColumns: ["id"]
          },
        ]
      }
      garage_settings: {
        Row: {
          address_line: string
          city: string
          default_vat_rate: number
          garage_name: string
          id: string
          invoice_prefix: string
          post_code: string
          updated_at: string
          vat_number: string
        }
        Insert: {
          address_line?: string
          city?: string
          default_vat_rate?: number
          garage_name?: string
          id?: string
          invoice_prefix?: string
          post_code?: string
          updated_at?: string
          vat_number?: string
        }
        Update: {
          address_line?: string
          city?: string
          default_vat_rate?: number
          garage_name?: string
          id?: string
          invoice_prefix?: string
          post_code?: string
          updated_at?: string
          vat_number?: string
        }
        Relationships: []
      }
      reminders: {
        Row: {
          created_at: string
          customer_id: string | null
          done: boolean
          due_date: string
          garage_id: string
          id: string
          notes: string | null
          title: string
          vehicle_id: string | null
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          done?: boolean
          due_date: string
          garage_id: string
          id?: string
          notes?: string | null
          title: string
          vehicle_id?: string | null
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          done?: boolean
          due_date?: string
          garage_id?: string
          id?: string
          notes?: string | null
          title?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reminders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reminders_garage_id_fkey"
            columns: ["garage_id"]
            isOneToOne: false
            referencedRelation: "garage_settings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reminders_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_line_items: {
        Row: {
          description: string
          garage_id: string
          id: string
          invoice_id: string
          quantity: number
          unit_price: number
        }
        Insert: {
          description: string
          garage_id: string
          id?: string
          invoice_id: string
          quantity?: number
          unit_price?: number
        }
        Update: {
          description?: string
          garage_id?: string
          id?: string
          invoice_id?: string
          quantity?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_line_items_garage_id_fkey"
            columns: ["garage_id"]
            isOneToOne: false
            referencedRelation: "garage_settings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_line_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          created_at: string
          customer_id: string
          date: string
          due_date: string
          garage_id: string
          id: string
          job_id: string | null
          notes: string | null
          number: string
          status: Database["public"]["Enums"]["invoice_status"]
          updated_at: string
          vat_rate: number
          vehicle_id: string | null
        }
        Insert: {
          created_at?: string
          customer_id: string
          date: string
          due_date: string
          garage_id: string
          id?: string
          job_id?: string | null
          notes?: string | null
          number?: string
          status?: Database["public"]["Enums"]["invoice_status"]
          updated_at?: string
          vat_rate?: number
          vehicle_id?: string | null
        }
        Update: {
          created_at?: string
          customer_id?: string
          date?: string
          due_date?: string
          garage_id?: string
          id?: string
          job_id?: string | null
          notes?: string | null
          number?: string
          status?: Database["public"]["Enums"]["invoice_status"]
          updated_at?: string
          vat_rate?: number
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_garage_id_fkey"
            columns: ["garage_id"]
            isOneToOne: false
            referencedRelation: "garage_settings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "job_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      job_cards: {
        Row: {
          booking_id: string | null
          created_at: string
          customer_id: string
          description: string | null
          due_date: string | null
          garage_id: string
          id: string
          notes: string | null
          priority: string
          status: Database["public"]["Enums"]["job_status"]
          technician: string | null
          updated_at: string
          vehicle_id: string | null
        }
        Insert: {
          booking_id?: string | null
          created_at?: string
          customer_id: string
          description?: string | null
          due_date?: string | null
          garage_id: string
          id?: string
          notes?: string | null
          priority?: string
          status?: Database["public"]["Enums"]["job_status"]
          technician?: string | null
          updated_at?: string
          vehicle_id?: string | null
        }
        Update: {
          booking_id?: string | null
          created_at?: string
          customer_id?: string
          description?: string | null
          due_date?: string | null
          garage_id?: string
          id?: string
          notes?: string | null
          priority?: string
          status?: Database["public"]["Enums"]["job_status"]
          technician?: string | null
          updated_at?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_cards_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_cards_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_cards_garage_id_fkey"
            columns: ["garage_id"]
            isOneToOne: false
            referencedRelation: "garage_settings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_cards_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      job_labour_lines: {
        Row: {
          description: string
          garage_id: string
          hours: number
          id: string
          job_id: string
          rate: number
        }
        Insert: {
          description: string
          garage_id: string
          hours?: number
          id?: string
          job_id: string
          rate?: number
        }
        Update: {
          description?: string
          garage_id?: string
          hours?: number
          id?: string
          job_id?: string
          rate?: number
        }
        Relationships: [
          {
            foreignKeyName: "job_labour_lines_garage_id_fkey"
            columns: ["garage_id"]
            isOneToOne: false
            referencedRelation: "garage_settings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_labour_lines_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "job_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      job_part_lines: {
        Row: {
          description: string
          garage_id: string
          id: string
          job_id: string
          part_id: string | null
          quantity: number
          unit_price: number
        }
        Insert: {
          description: string
          garage_id: string
          id?: string
          job_id: string
          part_id?: string | null
          quantity?: number
          unit_price?: number
        }
        Update: {
          description?: string
          garage_id?: string
          id?: string
          job_id?: string
          part_id?: string | null
          quantity?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "job_part_lines_garage_id_fkey"
            columns: ["garage_id"]
            isOneToOne: false
            referencedRelation: "garage_settings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_part_lines_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "job_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_part_lines_part_id_fkey"
            columns: ["part_id"]
            isOneToOne: false
            referencedRelation: "parts"
            referencedColumns: ["id"]
          },
        ]
      }
      parts: {
        Row: {
          category: string | null
          cost_price: number
          created_at: string
          garage_id: string
          id: string
          name: string
          reorder_level: number
          sell_price: number
          sku: string
          stock_level: number
          supplier: string | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          cost_price?: number
          created_at?: string
          garage_id: string
          id?: string
          name: string
          reorder_level?: number
          sell_price?: number
          sku: string
          stock_level?: number
          supplier?: string | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          cost_price?: number
          created_at?: string
          garage_id?: string
          id?: string
          name?: string
          reorder_level?: number
          sell_price?: number
          sku?: string
          stock_level?: number
          supplier?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "parts_garage_id_fkey"
            columns: ["garage_id"]
            isOneToOne: false
            referencedRelation: "garage_settings"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          colour: string | null
          created_at: string
          customer_id: string
          garage_id: string
          id: string
          last_service_date: string | null
          make: string | null
          mileage: number | null
          model: string | null
          mot_due: string | null
          registration: string
          updated_at: string
          year: number | null
        }
        Insert: {
          colour?: string | null
          created_at?: string
          customer_id: string
          garage_id: string
          id?: string
          last_service_date?: string | null
          make?: string | null
          mileage?: number | null
          model?: string | null
          mot_due?: string | null
          registration: string
          updated_at?: string
          year?: number | null
        }
        Update: {
          colour?: string | null
          created_at?: string
          customer_id?: string
          garage_id?: string
          id?: string
          last_service_date?: string | null
          make?: string | null
          mileage?: number | null
          model?: string | null
          mot_due?: string | null
          registration?: string
          updated_at?: string
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_garage_id_fkey"
            columns: ["garage_id"]
            isOneToOne: false
            referencedRelation: "garage_settings"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      next_invoice_number: { Args: never; Returns: string }
      is_garage_member: { Args: { target_garage_id: string }; Returns: boolean }
      set_invoice_number: { Args: never; Returns: undefined }
      create_garage_with_owner: { Args: { p_garage_name: string }; Returns: string }
    }
    Enums: {
      invoice_status: "estimate" | "draft" | "sent" | "paid" | "overdue"
      job_status:
        | "booked"
        | "checked_in"
        | "in_progress"
        | "awaiting_parts"
        | "completed"
        | "vehicle_released"
        | "invoiced"
      job_type:
        | "vehicle_recovery"
        | "diagnostic"
        | "oil_service"
        | "full_service"
        | "mot"
        | "tyre_replacement"
        | "vehicle_storage"
        | "mobile_tyre_fitting"
        | "battery_replacement"
        | "other"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database["public"]

export type Tables<
  DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
    DefaultSchema["Views"])
> = (DefaultSchema["Tables"] &
  DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
  Row: infer R
}
  ? R
  : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
> = DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
  Insert: infer I
}
  ? I
  : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
> = DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
  Update: infer U
}
  ? U
  : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
> = DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
