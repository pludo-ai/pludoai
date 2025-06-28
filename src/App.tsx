import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { BoltBadge } from './components/ui/BoltBadge';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Verify } from './pages/Verify';
import { Create } from './pages/Create';
import { Dashboard } from './pages/Dashboard';
import { NotFound } from './pages/NotFound';
import { useThemeStore } from './store/themeStore';
import { useAuthStore } from './store/authStore';
import { supabase } from './lib/supabase';

function App() {
  const { isDark } = useThemeStore();
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    // Apply theme to document
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      
      // Ensure user exists in background (non-blocking)
      if (session?.user) {
        ensureUserExists(session.user);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      
      // Ensure user exists in background (non-blocking)
      if (session?.user) {
        ensureUserExists(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, setLoading]);

  const ensureUserExists = async (user: any) => {
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
        }
      }
    } catch (error) {
      console.error('Error in ensureUserExists:', error);
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
        <Navbar />
        <main className="pt-16">
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
        <BoltBadge />
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