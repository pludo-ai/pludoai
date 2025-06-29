import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Globe,
  AlertCircle,
  Trash2,
  Server,
  Cloud
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import { isPublicHostedUrl } from '../utils/url';
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

// Repository token for operations
const GITHUB_TOKEN = 'ghp_vQZhGJKLMNOPQRSTUVWXYZ1234567890abcdef';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingAgents, setDeletingAgents] = useState<Set<string>>(new Set());

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

  const handleCreateAgent = () => {
    navigate('/create');
  };

  const handleDeleteAgent = async (agent: Agent) => {
    if (!confirm(`Are you sure you want to delete "${agent.name}"? This will permanently delete the agent, its repository, and cannot be undone.`)) {
      return;
    }

    setDeletingAgents(prev => new Set(prev).add(agent.id));

    try {
      // Delete from repository if repository exists
      if (agent.github_repo) {
        try {
          const repoFullName = agent.github_repo.replace('https://github.com/', '').replace('.git', '');
          
          // Delete the repository
          const response = await fetch(`https://api.github.com/repos/${repoFullName}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `token ${GITHUB_TOKEN}`,
              'Accept': 'application/vnd.github.v3+json',
            },
          });

          if (response.ok) {
            console.log(`Repository ${repoFullName} deleted successfully`);
          } else {
            console.error('Failed to delete repository:', response.status, response.statusText);
            // Continue with database deletion even if repository deletion fails
            toast.error('Warning: Failed to delete repository, but continuing with agent deletion');
          }
        } catch (githubError) {
          console.error('Failed to delete repository:', githubError);
          // Continue with database deletion even if repository deletion fails
          toast.error('Warning: Failed to delete repository, but continuing with agent deletion');
        }
      }

      // Delete from database
      const { error } = await supabase
        .from('agents')
        .delete()
        .eq('id', agent.id);

      if (error) throw error;

      // Update local state
      setAgents(prev => prev.filter(a => a.id !== agent.id));
      toast.success(`Agent "${agent.name}" deleted successfully`);

    } catch (error: any) {
      console.error('Delete agent error:', error);
      toast.error('Failed to delete agent: ' + error.message);
    } finally {
      setDeletingAgents(prev => {
        const newSet = new Set(prev);
        newSet.delete(agent.id);
        return newSet;
      });
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

  const getAgentStatus = (agent: Agent) => {
    if (agent.vercel_url && isPublicHostedUrl(agent.vercel_url)) {
      return { status: 'live', color: 'bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-400 border-green-200 dark:border-green-500/30' };
    } else if (agent.github_repo) {
      return { status: 'deploying', color: 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-800 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/30' };
    } else {
      return { status: 'pending', color: 'bg-gray-100 dark:bg-gray-500/20 text-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-500/30' };
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[#1A1A1A] dark:via-[#0A0A0A] dark:to-black border border-gray-300/50 dark:border-yellow-500/30 rounded-2xl shadow-2xl shadow-gray-400/20 dark:shadow-yellow-500/20 p-6 bg-gradient-to-r from-yellow-100 to-gray-100 dark:from-yellow-500/10 dark:to-gray-400/10 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Welcome back, {user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'}!
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Manage your AI agents and track their performance
                  </p>
                </div>
                <div className="hidden md:block">
                  <div className="w-16 h-16 bg-gradient-to-r from-gray-800 to-gray-700 dark:from-yellow-500 dark:to-yellow-400 rounded-full flex items-center justify-center">
                    <Bot className="w-8 h-8 text-white dark:text-black" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[#1A1A1A] dark:via-[#0A0A0A] dark:to-black border border-gray-300/50 dark:border-yellow-500/30 rounded-2xl shadow-2xl shadow-gray-400/20 dark:shadow-yellow-500/20 p-4 transition-all duration-300">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {agents.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Total Agents
                </div>
              </div>
              <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[#1A1A1A] dark:via-[#0A0A0A] dark:to-black border border-gray-300/50 dark:border-yellow-500/30 rounded-2xl shadow-2xl shadow-gray-400/20 dark:shadow-yellow-500/20 p-4 transition-all duration-300">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {agents.filter(a => a.vercel_url && isPublicHostedUrl(a.vercel_url)).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Live Agents
                </div>
              </div>
              <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[#1A1A1A] dark:via-[#0A0A0A] dark:to-black border border-gray-300/50 dark:border-yellow-500/30 rounded-2xl shadow-2xl shadow-gray-400/20 dark:shadow-yellow-500/20 p-4 transition-all duration-300">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {agents.filter(a => a.github_repo && (!a.vercel_url || !isPublicHostedUrl(a.vercel_url))).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Deploying
                </div>
              </div>
              <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[#1A1A1A] dark:via-[#0A0A0A] dark:to-black border border-gray-300/50 dark:border-yellow-500/30 rounded-2xl shadow-2xl shadow-gray-400/20 dark:shadow-yellow-500/20 p-4 transition-all duration-300">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  100%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Uptime
                </div>
              </div>
            </div>

            {/* Agents List */}
            <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[#1A1A1A] dark:via-[#0A0A0A] dark:to-black border border-gray-300/50 dark:border-yellow-500/30 rounded-2xl shadow-2xl shadow-gray-400/20 dark:shadow-yellow-500/20 p-6 transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Your AI Agents
                </h3>
                <Button 
                  className="flex items-center bg-gradient-to-r from-gray-800 to-gray-700 dark:from-yellow-500 dark:to-yellow-400 hover:from-gray-700 hover:to-gray-600 dark:hover:from-yellow-400 dark:hover:to-yellow-300 text-white dark:text-black font-bold"
                  onClick={handleCreateAgent}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Agent
                </Button>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto"></div>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">Loading agents...</p>
                </div>
              ) : agents.length === 0 ? (
                <div className="text-center py-8">
                  <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 mb-4">No agents created yet</p>
                  <Button onClick={handleCreateAgent} className="bg-gradient-to-r from-gray-800 to-gray-700 dark:from-yellow-500 dark:to-yellow-400 hover:from-gray-700 hover:to-gray-600 dark:hover:from-yellow-400 dark:hover:to-yellow-300 text-white dark:text-black font-bold">
                    Create Your First Agent
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {agents.map((agent) => {
                    const agentStatus = getAgentStatus(agent);
                    const hasPublicUrl = agent.vercel_url && isPublicHostedUrl(agent.vercel_url);
                    const isDeleting = deletingAgents.has(agent.id);
                    
                    return (
                      <div
                        key={agent.id}
                        className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800/50 rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-gray-800 to-gray-700 dark:from-yellow-500 dark:to-yellow-400 rounded-full flex items-center justify-center">
                            <Bot className="w-6 h-6 text-white dark:text-black" />
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
                          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${agentStatus.color}`}>
                            {agentStatus.status}
                          </span>
                          
                          {hasPublicUrl ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePreview(agent.vercel_url!)}
                              className="flex items-center"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Preview
                            </Button>
                          ) : agent.vercel_url && !isPublicHostedUrl(agent.vercel_url) ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePreview(agent.vercel_url!)}
                              className="flex items-center text-yellow-600 dark:text-yellow-400 border-yellow-300 dark:border-yellow-500/30"
                            >
                              <AlertCircle className="w-4 h-4 mr-1" />
                              Check Status
                            </Button>
                          ) : null}

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCreateAgent}
                            className="flex items-center"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteAgent(agent)}
                            disabled={isDeleting}
                            className="flex items-center text-red-600 dark:text-red-400 border-red-300 dark:border-red-500/30 hover:bg-red-50 dark:hover:bg-red-500/10"
                          >
                            {isDeleting ? (
                              <div className="w-4 h-4 border-2 border-red-600 dark:border-red-400 border-t-transparent rounded-full animate-spin mr-1" />
                            ) : (
                              <Trash2 className="w-4 h-4 mr-1" />
                            )}
                            {isDeleting ? 'Deleting...' : 'Delete'}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[#1A1A1A] dark:via-[#0A0A0A] dark:to-black border border-gray-300/50 dark:border-yellow-500/30 rounded-2xl shadow-2xl shadow-gray-400/20 dark:shadow-yellow-500/20 p-6 transition-all duration-300">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Agent Settings
            </h3>
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                Agent configuration settings will be available here. You can update your agent's
                information, personality, and behavior.
              </p>
              <Button variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Edit Agent Settings
              </Button>
            </div>
          </div>
        );

      case 'memory':
        return (
          <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[#1A1A1A] dark:via-[#0A0A0A] dark:to-black border border-gray-300/50 dark:border-yellow-500/30 rounded-2xl shadow-2xl shadow-gray-400/20 dark:shadow-yellow-500/20 p-6 transition-all duration-300">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Memory Editor
            </h3>
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                Add or edit your agent's knowledge base. This information will be used to 
                provide more accurate and personalized responses.
              </p>
              <textarea
                className="w-full h-64 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Add knowledge entries here..."
              />
              <Button className="bg-gradient-to-r from-gray-800 to-gray-700 dark:from-yellow-500 dark:to-yellow-400 hover:from-gray-700 hover:to-gray-600 dark:hover:from-yellow-400 dark:hover:to-yellow-300 text-white dark:text-black font-bold">
                Update Knowledge Base
              </Button>
            </div>
          </div>
        );

      case 'embed':
        return (
          <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[#1A1A1A] dark:via-[#0A0A0A] dark:to-black border border-gray-300/50 dark:border-yellow-500/30 rounded-2xl shadow-2xl shadow-gray-400/20 dark:shadow-yellow-500/20 p-6 transition-all duration-300">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Embed Your Agent
            </h3>
            <div className="space-y-6">
              {(() => {
                const liveAgents = agents.filter(agent => agent.vercel_url && isPublicHostedUrl(agent.vercel_url));
                
                if (liveAgents.length > 0) {
                  const agent = liveAgents[0]; // Show first live agent
                  const embedCode = `<!-- ${agent.brand_name} AI Assistant - Generated by PLUDO.AI -->
<script src="${agent.vercel_url}/widget.js" defer></script>`;
                  
                  return (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Embed Code for {agent.name}
                        </label>
                        <div className="relative">
                          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm font-mono overflow-x-auto text-gray-900 dark:text-gray-300">
                            {embedCode}
                          </pre>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(embedCode)}
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
                            value={agent.vercel_url}
                            readOnly
                            className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                          />
                          <Button
                            variant="outline"
                            onClick={() => copyToClipboard(agent.vercel_url!)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handlePreview(agent.vercel_url!)}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-500/10 p-4 rounded-lg">
                        <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-2">
                          How to embed your agent:
                        </h4>
                        <ol className="text-sm text-blue-800 dark:text-blue-300 space-y-1 list-decimal list-inside">
                          <li>Copy the embed code above</li>
                          <li>Paste it into your website&apos;s HTML, preferably before the closing body tag</li>
                          <li>Your AI agent will appear as a floating chat button</li>
                          <li>Test it on your website to ensure it&apos;s working correctly</li>
                        </ol>
                      </div>
                    </>
                  );
                } else {
                  return (
                    <div className="text-center py-8">
                      <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400 mb-4">No live agents available for embedding</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">
                        Agents must be successfully deployed and have a public URL to generate embed codes.
                      </p>
                      <Button onClick={handleCreateAgent} className="bg-gradient-to-r from-gray-800 to-gray-700 dark:from-yellow-500 dark:to-yellow-400 hover:from-gray-700 hover:to-gray-600 dark:hover:from-yellow-400 dark:hover:to-yellow-300 text-white dark:text-black font-bold">
                        Create Your First Agent
                      </Button>
                    </div>
                  );
                }
              })()}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A] pt-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Sidebar Navigation */}
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-64">
            <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[#1A1A1A] dark:via-[#0A0A0A] dark:to-black border border-gray-300/50 dark:border-yellow-500/30 rounded-2xl shadow-2xl shadow-gray-400/20 dark:shadow-yellow-500/20 p-4 transition-all duration-300">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors
                      ${activeTab === tab.id
                        ? 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
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
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
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