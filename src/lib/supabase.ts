import { createClient } from '@supabase/supabase-js';

// These will be set up when user connects to Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      agents: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          brand_name: string;
          website_name: string;
          agent_type: string;
          role_description: string;
          services: string[];
          faqs: { question: string; answer: string }[];
          primary_color: string;
          tone: string;
          avatar_url?: string;
          subdomain: string;
          github_repo?: string;
          vercel_url?: string;
          office_hours?: string;
          knowledge: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          brand_name: string;
          website_name: string;
          agent_type: string;
          role_description: string;
          services: string[];
          faqs: { question: string; answer: string }[];
          primary_color: string;
          tone: string;
          avatar_url?: string;
          subdomain: string;
          github_repo?: string;
          vercel_url?: string;
          office_hours?: string;
          knowledge: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          brand_name?: string;
          website_name?: string;
          agent_type?: string;
          role_description?: string;
          services?: string[];
          faqs?: { question: string; answer: string }[];
          primary_color?: string;
          tone?: string;
          avatar_url?: string;
          subdomain?: string;
          github_repo?: string;
          vercel_url?: string;
          office_hours?: string;
          knowledge?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};