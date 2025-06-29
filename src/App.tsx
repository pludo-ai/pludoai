import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { GeometricNavbar } from './components/ui/GeometricNavbar';
import { Footer } from './components/layout/Footer';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Verify } from './pages/Verify';
import { Create } from './pages/Create';
import { Dashboard } from './pages/Dashboard';
import { NotFound } from './pages/NotFound';
import { useThemeStore } from './store/themeStore';
import { useAuthStore } from './store/authStore';
import { supabase, isSupabaseConfigured } from './lib/supabase';

function App() {
  const { isDark } = useThemeStore();
  const { user, setUser, setLoading, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Apply theme to document
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    // Only initialize auth if Supabase is properly configured
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured - running in demo mode');
      setLoading(false);
      return;
    }

    // Initialize authentication state
    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session?.user) {
          setUser(session.user);
          await ensureUserExists(session.user);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [setUser, setLoading]);

  const initializeAuth = async () => {
    try {
      // Check if we have a stored session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
        setUser(null);
        setLoading(false);
        return;
      }

      if (session?.user) {
        // Verify the session is still valid by making a test request
        const { error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error('Session invalid:', userError);
          // Clear invalid session
          await supabase.auth.signOut();
          setUser(null);
        } else {
          // Session is valid, set user and ensure user record exists
          setUser(session.user);
          await ensureUserExists(session.user);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const ensureUserExists = async (user: any) => {
    if (!isSupabaseConfigured()) return;
    
    try {
      // Check if user exists in public.users table using limit(1) instead of single()
      const { data: existingUsers, error: checkError } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .limit(1);

      if (checkError) {
        console.error('Error checking user existence:', checkError);
        return;
      }

      // If no user found (empty array), create them
      if (!existingUsers || existingUsers.length === 0) {
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: user.id,
            email: user.email,
            name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
          });

        if (insertError) {
          console.error('Error creating user record:', insertError);
        } else {
          console.log('User record created successfully');
        }
      }
    } catch (error) {
      console.error('Error in ensureUserExists:', error);
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
        <GeometricNavbar />
        <main>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/create" element={<Create />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'var(--toast-bg)',
              color: 'var(--toast-color)',
              border: '1px solid var(--toast-border)',
            },
            className: 'dark:bg-gray-800 dark:text-white dark:border-gray-700',
          }}
        />
      </div>
    </Router>
  );
}

export default App;