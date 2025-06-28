import { createClient } from '@supabase/supabase-js';

// Supabase project credentials
const supabaseUrl = 'https://zxcvbnmasdfghjklqwertyuiop.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4Y3Zibm1hc2RmZ2hqa2xxd2VydHl1aW9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwOTY4MDAsImV4cCI6MjA2NjY3MjgwMH0.placeholder-key-for-demo';

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