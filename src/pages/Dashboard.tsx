import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bot, 
  Settings, 
  Eye, 
  Code, 
  Brain, 
  LogOut,
  ExternalLink,
  Copy,
  Edit,
  Plus,
  Globe
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface Agent {
  id: string;
  name: string;
  brand_name: string;
  agent_type: string;
  github_repo?: string;
  vercel_url?: string;
  created_at: string;
  updated_at: string;
}

export const Dashboard: React.FC = () => {
  const { user, setUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Bot className="w-4 h-4" /> },
    { id: 'settings', label: 'Agent Settings', icon: <Settings className="w-4 h-4" /> },
    { id: 'memory', label: 'Memory Editor', icon: <Brain className="w-4 h-4" /> },
    { id: 'embed', label: 'Embed Code', icon: <Code className="w-4 h-4" /> },
  ];

  useEffect(() => {
    fetchAgents();
  }, [user]);

  const fetchAgents = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAgents(data || []);
    } catch (error: any) {
      toast.error('Failed to fetch agents: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const handlePreview = (url: string) => {
    window.open(url, '_blank');
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error: any) {
      toast.error('Failed to logout: ' + error.message);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Welcome Section */}
            <Card className="p-6 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Welcome back, {user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'}!
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Manage your AI agents and track their performance
                  </p>
                </div>
                <div className="hidden md:block">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                    <Bot className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {agents.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Active Agents
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-2xl font-bold text-secondary-600 dark:text-secondary-400">
                  {agents.filter(a => a.vercel_url && !a.vercel_url.includes('dashboard')).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Deployed Agents
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-2xl font-bold text-accent-600 dark:text-accent-400">
                  100%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Uptime
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  Ready
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Status
                </div>
              </Card>
            </div>

            {/* Agents List */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Your AI Agents
                </h3>
                <Button 
                  className="flex items-center"
                  onClick={() => window.location.href = '/create'}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Agent
                </Button>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Loading agents...</p>
                </div>
              ) : agents.length === 0 ? (
                <div className="text-center py-8">
                  <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No agents created yet</p>
                  <Button onClick={() => window.location.href = '/create'}>
                    Create Your First Agent
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {agents.map((agent) => (
                    <div
                      key={agent.id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                          <Bot className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {agent.name} - {agent.brand_name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {agent.agent_type.replace('-', ' ')} • Created {new Date(agent.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className={`
                          px-2 py-1 text-xs font-medium rounded-full
                          ${agent.vercel_url && !agent.vercel_url.includes('dashboard')
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                          }
                        `}>
                          {agent.vercel_url && !agent.vercel_url.includes('dashboard') ? 'live' : 'pending'}
                        </span>
                        
                        {agent.vercel_url && !agent.vercel_url.includes('dashboard') && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePreview(agent.vercel_url!)}
                            className="flex items-center"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Preview
                          </Button>
                        )}

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.location.href = '/create'}
                          className="flex items-center"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        );

      case 'settings':
        return (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Agent Settings
            </h3>
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                Agent configuration settings will be available here. You can update your agent's
                information, personality, and behavior.
              </p>
              <Button variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Edit Agent Settings
              </Button>
            </div>
          </Card>
        );

      case 'memory':
        return (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Memory Editor
            </h3>
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                Add or edit your agent's knowledge base. This information will be used to 
                provide more accurate and personalized responses.
              </p>
              <textarea
                className="w-full h-64 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Add knowledge entries here..."
              />
              <Button>
                Update Knowledge Base
              </Button>
            </div>
          </Card>
        );

      case 'embed':
        return (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Embed Your Agent
            </h3>
            <div className="space-y-6">
              {agents.length > 0 && agents[0].vercel_url && !agents[0].vercel_url.includes('dashboard') ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Embed Code
                    </label>
                    <div className="relative">
                      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm font-mono overflow-x-auto">
                        {`<script src="${agents[0].vercel_url}/float.js" defer></script>`}
                      </pre>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(`<script src="${agents[0].vercel_url}/float.js" defer></script>`)}
                        className="absolute top-2 right-2"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Direct Link
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={agents[0].vercel_url}
                        readOnly
                        className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                      <Button
                        variant="outline"
                        onClick={() => copyToClipboard(agents[0].vercel_url!)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handlePreview(agents[0].vercel_url!)}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-2">
                      How to embed your agent:
                    </h4>
                    <ol className="text-sm text-blue-800 dark:text-blue-300 space-y-1 list-decimal list-inside">
                      <li>Copy the embed code above</li>
                      <li>Paste it into your website's HTML, preferably before the closing &lt;/body&gt; tag</li>
                      <li>Your AI agent will appear as a floating chat button</li>
                      <li>Test it on your website to ensure it's working correctly</li>
                    </ol>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No deployed agents available for embedding</p>
                  <Button onClick={() => window.location.href = '/create'}>
                    Create Your First Agent
                  </Button>
                </div>
              )}
            </div>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Sidebar Navigation */}
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-64">
            <Card className="p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors
                      ${activeTab === tab.id
                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }
                    `}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
                
                <hr className="my-4 border-gray-200 dark:border-gray-700" />
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </nav>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderTabContent()}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};