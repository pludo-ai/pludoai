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
  Globe,
  RefreshCw,
  Upload
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import { regenerateAgent, uploadToGitHub, deployToVercel } from '../lib/deployment';
import toast from 'react-hot-toast';

interface Agent {
  id: string;
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
}

export const Dashboard: React.FC = () => {
  const { user, setUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [redeployLoading, setRedeployLoading] = useState<string | null>(null);

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

  const handleEditAgent = (agent: Agent) => {
    setEditingAgent({ ...agent });
  };

  const handleUpdateAgent = async (updatedAgent: Agent) => {
    try {
      const { error } = await supabase
        .from('agents')
        .update({
          name: updatedAgent.name,
          brand_name: updatedAgent.brand_name,
          website_name: updatedAgent.website_name,
          agent_type: updatedAgent.agent_type,
          role_description: updatedAgent.role_description,
          services: updatedAgent.services,
          faqs: updatedAgent.faqs,
          primary_color: updatedAgent.primary_color,
          tone: updatedAgent.tone,
          avatar_url: updatedAgent.avatar_url,
          office_hours: updatedAgent.office_hours,
          knowledge: updatedAgent.knowledge,
          updated_at: new Date().toISOString(),
        })
        .eq('id', updatedAgent.id);

      if (error) throw error;

      // Update local state
      setAgents(prev => prev.map(agent => 
        agent.id === updatedAgent.id ? updatedAgent : agent
      ));

      toast.success('Agent updated successfully!');
      setEditingAgent(null);
    } catch (error: any) {
      toast.error('Failed to update agent: ' + error.message);
    }
  };

  const handleRedeploy = async (agent: Agent) => {
    setRedeployLoading(agent.id);
    
    try {
      toast.loading('Starting redeploy process...', { id: 'redeploy' });

      // Step 1: Regenerate and upload to GitHub
      const regenResult = await regenerateAgent(agent.id);
      if (!regenResult.success) {
        throw new Error(regenResult.error || 'Failed to regenerate agent');
      }

      toast.loading('Files updated in GitHub...', { id: 'redeploy' });

      // Step 2: Trigger new deployment if Vercel URL exists
      if (agent.vercel_url && !agent.vercel_url.includes('dashboard')) {
        // For existing deployments, we just need to push to GitHub
        // Vercel will auto-deploy via webhook
        toast.loading('Triggering deployment...', { id: 'redeploy' });
        
        // Wait a moment for GitHub webhook to trigger Vercel
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        toast.success('Agent redeployed successfully! Changes will be live in a few minutes.', { id: 'redeploy' });
      } else {
        // If no Vercel URL, deploy fresh
        const deployResult = await deployToVercel(agent.id);
        if (!deployResult.success) {
          throw new Error(deployResult.error || 'Failed to deploy to Vercel');
        }

        // Update local state with new Vercel URL
        if (deployResult.vercelUrl) {
          setAgents(prev => prev.map(a => 
            a.id === agent.id ? { ...a, vercel_url: deployResult.vercelUrl } : a
          ));
        }

        toast.success('Agent redeployed successfully!', { id: 'redeploy' });
      }

      // Refresh agents list
      await fetchAgents();

    } catch (error: any) {
      console.error('Redeploy error:', error);
      toast.error(error.message || 'Failed to redeploy agent', { id: 'redeploy' });
    } finally {
      setRedeployLoading(null);
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

  const addFAQ = (agent: Agent) => {
    const newFAQ = { question: '', answer: '' };
    setEditingAgent({
      ...agent,
      faqs: [...agent.faqs, newFAQ]
    });
  };

  const removeFAQ = (agent: Agent, index: number) => {
    setEditingAgent({
      ...agent,
      faqs: agent.faqs.filter((_, i) => i !== index)
    });
  };

  const updateFAQ = (agent: Agent, index: number, field: 'question' | 'answer', value: string) => {
    const updatedFAQs = [...agent.faqs];
    updatedFAQs[index] = { ...updatedFAQs[index], [field]: value };
    setEditingAgent({
      ...agent,
      faqs: updatedFAQs
    });
  };

  const addService = (agent: Agent) => {
    setEditingAgent({
      ...agent,
      services: [...agent.services, '']
    });
  };

  const removeService = (agent: Agent, index: number) => {
    setEditingAgent({
      ...agent,
      services: agent.services.filter((_, i) => i !== index)
    });
  };

  const updateService = (agent: Agent, index: number, value: string) => {
    const updatedServices = [...agent.services];
    updatedServices[index] = value;
    setEditingAgent({
      ...agent,
      services: updatedServices
    });
  };

  const renderEditForm = (agent: Agent) => {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Edit Agent: {agent.name}
          </h3>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setEditingAgent(null)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleUpdateAgent(agent)}
            >
              Save Changes
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Agent Name"
              value={agent.name}
              onChange={(e) => setEditingAgent({ ...agent, name: e.target.value })}
              placeholder="e.g., Sarah"
            />
            <Input
              label="Brand Name"
              value={agent.brand_name}
              onChange={(e) => setEditingAgent({ ...agent, brand_name: e.target.value })}
              placeholder="e.g., TechCorp Inc."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Website Name"
              value={agent.website_name}
              onChange={(e) => setEditingAgent({ ...agent, website_name: e.target.value })}
              placeholder="e.g., TechCorp Website"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Agent Type
              </label>
              <select
                value={agent.agent_type}
                onChange={(e) => setEditingAgent({ ...agent, agent_type: e.target.value })}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 px-3 py-2 text-gray-900 dark:text-white"
              >
                <option value="customer-support">Customer Support</option>
                <option value="sales-assistant">Sales Assistant</option>
                <option value="lead-generation">Lead Generation</option>
                <option value="product-guide">Product Guide</option>
                <option value="booking-assistant">Booking Assistant</option>
                <option value="general-assistant">General Assistant</option>
              </select>
            </div>
          </div>

          <Textarea
            label="Role Description"
            value={agent.role_description}
            onChange={(e) => setEditingAgent({ ...agent, role_description: e.target.value })}
            placeholder="Describe what your agent does..."
            rows={3}
          />

          {/* Services */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Services Offered
              </label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addService(agent)}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Service
              </Button>
            </div>
            <div className="space-y-2">
              {agent.services.map((service, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={service}
                    onChange={(e) => updateService(agent, index, e.target.value)}
                    placeholder="Service description"
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeService(agent, index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* FAQs */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Frequently Asked Questions
              </label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addFAQ(agent)}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add FAQ
              </Button>
            </div>
            <div className="space-y-4">
              {agent.faqs.map((faq, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      FAQ #{index + 1}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeFAQ(agent, index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Input
                      placeholder="Question"
                      value={faq.question}
                      onChange={(e) => updateFAQ(agent, index, 'question', e.target.value)}
                    />
                    <Textarea
                      placeholder="Answer"
                      value={faq.answer}
                      onChange={(e) => updateFAQ(agent, index, 'answer', e.target.value)}
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customization */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Primary Color"
              type="color"
              value={agent.primary_color}
              onChange={(e) => setEditingAgent({ ...agent, primary_color: e.target.value })}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tone
              </label>
              <select
                value={agent.tone}
                onChange={(e) => setEditingAgent({ ...agent, tone: e.target.value })}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 px-3 py-2 text-gray-900 dark:text-white"
              >
                <option value="professional">Professional</option>
                <option value="friendly">Friendly</option>
                <option value="witty">Witty</option>
                <option value="minimal">Minimal</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Avatar URL (optional)"
              value={agent.avatar_url || ''}
              onChange={(e) => setEditingAgent({ ...agent, avatar_url: e.target.value })}
              placeholder="https://example.com/avatar.jpg"
            />
            <Input
              label="Office Hours (optional)"
              value={agent.office_hours || ''}
              onChange={(e) => setEditingAgent({ ...agent, office_hours: e.target.value })}
              placeholder="e.g., Mon-Fri 9AM-5PM EST"
            />
          </div>

          <Textarea
            label="Knowledge Base"
            value={agent.knowledge}
            onChange={(e) => setEditingAgent({ ...agent, knowledge: e.target.value })}
            placeholder="Additional information for your agent..."
            rows={6}
          />
        </div>
      </Card>
    );
  };

  const renderTabContent = () => {
    if (editingAgent) {
      return renderEditForm(editingAgent);
    }

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
                          onClick={() => handleEditAgent(agent)}
                          className="flex items-center"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRedeploy(agent)}
                          disabled={redeployLoading === agent.id}
                          className="flex items-center"
                        >
                          {redeployLoading === agent.id ? (
                            <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                          ) : (
                            <Upload className="w-4 h-4 mr-1" />
                          )}
                          Redeploy
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
                Select an agent from the overview to edit its settings, or use the "Edit" button 
                next to any agent in the list above.
              </p>
              {agents.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {agents.map((agent) => (
                    <Card key={agent.id} className="p-4 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleEditAgent(agent)}>
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white text-sm">
                            {agent.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {agent.brand_name}
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit Settings
                      </Button>
                    </Card>
                  ))}
                </div>
              )}
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
                The Memory Editor allows you to update your agent's knowledge base. This feature 
                is integrated into the agent editing form. Use the "Edit" button next to any agent 
                to modify its knowledge base and other settings.
              </p>
              <Button variant="outline" onClick={() => setActiveTab('settings')}>
                <Brain className="w-4 h-4 mr-2" />
                Go to Agent Settings
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
              {agents.length > 0 && agents.some(a => a.vercel_url && !a.vercel_url.includes('dashboard')) ? (
                <>
                  {agents.filter(a => a.vercel_url && !a.vercel_url.includes('dashboard')).map((agent) => (
                    <div key={agent.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-4">
                        {agent.name} - {agent.brand_name}
                      </h4>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Embed Code
                          </label>
                          <div className="relative">
                            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm font-mono overflow-x-auto">
                              {`<script src="${agent.vercel_url}/float.js" defer></script>`}
                            </pre>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(`<script src="${agent.vercel_url}/float.js" defer></script>`)}
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
                              className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(agent.vercel_url!)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePreview(agent.vercel_url!)}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

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
              key={activeTab + (editingAgent ? '-editing' : '')}
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