import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Bot, 
  Palette, 
  MessageSquare, 
  Settings, 
  Plus, 
  Minus, 
  Upload,
  Eye,
  Code,
  Rocket,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Copy,
  Download,
  Github,
  Globe,
  Zap,
  Key,
  Shield,
  Server,
  Cloud,
  EyeOff,
  Save,
  Edit
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Card } from '../components/ui/Card';
import { useAuthStore } from '../store/authStore';
import { generateAgentCode, uploadToGitHub, deployToVercel, triggerDeploymentWithFile, regenerateAgent } from '../lib/deployment';
import { validateSubdomain } from '../lib/subdomain';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface Agent {
  name: string;
  brandName: string;
  websiteName: string;
  agentType: string;
  roleDescription: string;
  services: string[];
  faqs: { question: string; answer: string; id: string }[];
  primaryColor: string;
  tone: string;
  avatarUrl: string;
  officeHours: string;
  knowledge: string;
  subdomain: string;
  // New API configuration fields
  apiProvider: string;
  apiKey: string;
  model: string;
  customModel: string;
}

interface DeploymentStep {
  id: string;
  title: string;
  status: 'pending' | 'loading' | 'success' | 'error';
  message?: string;
}

export const Create: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [searchParams] = useSearchParams();
  const editAgentId = searchParams.get('edit');
  const isEditMode = !!editAgentId;
  
  // Form state
  const [formData, setFormData] = useState<Agent>({
    name: '',
    brandName: '',
    websiteName: '',
    agentType: 'customer-support',
    roleDescription: '',
    services: [''],
    faqs: [
      { id: `faq-${Math.random().toString(36).substr(2, 8)}`, question: '', answer: '' }
    ],
    primaryColor: '#eab308', // yellow-500
    tone: 'professional',
    avatarUrl: '',
    officeHours: '',
    knowledge: '',
    subdomain: '',
    // New API configuration fields
    apiProvider: 'openrouter',
    apiKey: '',
    model: 'deepseek/deepseek-r1',
    customModel: ''
  });

  // Loading states
  const [loadingAgent, setLoadingAgent] = useState(false);
  const [subdomainChecking, setSubdomainChecking] = useState(false);
  const [subdomainError, setSubdomainError] = useState('');

  // Deployment state
  const [deploymentSteps, setDeploymentSteps] = useState<DeploymentStep[]>([
    { id: 'step-1', title: isEditMode ? 'Update Agent Code' : 'Generate Agent Code', status: 'pending' },
    { id: 'step-2', title: isEditMode ? 'Update Repository' : 'Upload to Repository', status: 'pending' },
    { id: 'step-3', title: 'Deploy to Cloud', status: 'pending' },
  ]);

  const [currentAgentId, setCurrentAgentId] = useState<string | null>(editAgentId);
  const [deploymentResult, setDeploymentResult] = useState<any>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [showDeployment, setShowDeployment] = useState(false);
  
  // Button states
  const [buttonStates, setButtonStates] = useState({
    generateCode: false,
    uploadRepo: false,
    deployCloud: false,
    makeItLive: false,
  });

  // API key visibility
  const [showApiKey, setShowApiKey] = useState(false);

  // Countdown for trigger button
  const [triggerCountdown, setTriggerCountdown] = useState(0);
  const [deployCloudClickTime, setDeployCloudClickTime] = useState<number | null>(null);

  // API Provider options
  const apiProviders = [
    {
      id: 'openrouter',
      name: 'OpenRouter',
      description: 'Access to multiple AI models including GPT, Claude, and more',
      models: [
        { id: 'deepseek/deepseek-r1', name: 'DeepSeek R1 (Recommended)' },
        { id: 'openai/gpt-4o', name: 'GPT-4o' },
        { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet' },
        { id: 'meta-llama/llama-3.1-8b-instruct', name: 'Llama 3.1 8B' },
        { id: 'custom', name: 'Custom Model' }
      ]
    },
    {
      id: 'gemini',
      name: 'Google Gemini',
      description: 'Google\'s advanced AI model with multimodal capabilities',
      models: [
        { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash (Recommended)' },
        { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
        { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash' },
        { id: 'gemini-pro', name: 'Gemini Pro' }
      ]
    }
  ];

  // Load agent data for editing
  useEffect(() => {
    if (isEditMode && editAgentId && user) {
      loadAgentForEdit(editAgentId);
    }
  }, [isEditMode, editAgentId, user]);

  // Update available models when API provider changes
  useEffect(() => {
    const provider = apiProviders.find(p => p.id === formData.apiProvider);
    if (provider && provider.models.length > 0 && !isEditMode) {
      setFormData(prev => ({ ...prev, model: provider.models[0].id }));
    }
  }, [formData.apiProvider, isEditMode]);

  // Countdown effect for trigger button
  useEffect(() => {
    if (triggerCountdown > 0) {
      const timer = setTimeout(() => {
        setTriggerCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [triggerCountdown]);

  const loadAgentForEdit = async (agentId: string) => {
    setLoadingAgent(true);
    try {
      const { data: agent, error } = await supabase
        .from('agents')
        .select('*')
        .eq('id', agentId)
        .eq('user_id', user!.id)
        .single();

      if (error) throw error;

      if (agent) {
        setFormData({
          name: agent.name,
          brandName: agent.brand_name,
          websiteName: agent.website_name || '',
          agentType: agent.agent_type,
          roleDescription: agent.role_description,
          services: agent.services.length > 0 ? agent.services : [''],
          faqs: agent.faqs.length > 0 ? agent.faqs.map((faq: any, index: number) => ({
            ...faq,
            id: faq.id || `faq-${index}-${Math.random().toString(36).substr(2, 8)}`
          })) : [{ id: `faq-${Math.random().toString(36).substr(2, 8)}`, question: '', answer: '' }],
          primaryColor: agent.primary_color,
          tone: agent.tone,
          avatarUrl: agent.avatar_url || '',
          officeHours: agent.office_hours || '',
          knowledge: agent.knowledge || '',
          subdomain: agent.subdomain,
          apiProvider: agent.api_provider || 'openrouter',
          apiKey: agent.api_key || '',
          model: agent.model || 'deepseek/deepseek-r1',
          customModel: ''
        });

        // Set deployment result if agent has URLs
        if (agent.github_repo || agent.vercel_url) {
          setDeploymentResult({
            agentId: agent.id,
            githubRepo: agent.github_repo,
            vercelUrl: agent.vercel_url,
            embedCode: agent.vercel_url ? `<!-- ${agent.brand_name} AI Assistant - Generated by PLUDO.AI -->
<script src="${agent.vercel_url}/widget.js" defer></script>` : undefined
          });
        }
      }
    } catch (error: any) {
      toast.error('Failed to load agent: ' + error.message);
      navigate('/dashboard');
    } finally {
      setLoadingAgent(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear subdomain error when user types
    if (field === 'subdomain') {
      setSubdomainError('');
    }
  };

  const handleSubdomainChange = async (value: string) => {
    setFormData(prev => ({ ...prev, subdomain: value }));
    setSubdomainError('');

    if (!value.trim()) return;

    setSubdomainChecking(true);
    try {
      const validation = await validateSubdomain(value);
      if (!validation.isValid || !validation.isAvailable) {
        setSubdomainError(validation.error || 'Subdomain not available');
      }
    } catch (error) {
      setSubdomainError('Error checking subdomain availability');
    } finally {
      setSubdomainChecking(false);
    }
  };

  const handleServiceChange = (index: number, value: string) => {
    const newServices = [...formData.services];
    newServices[index] = value;
    setFormData(prev => ({ 
      ...prev, 
      services: newServices 
    }));
  };

  const addService = () => {
    setFormData(prev => ({ 
      ...prev, 
      services: [...prev.services, ''] 
    }));
  };

  const removeService = (index: number) => {
    if (formData.services.length > 1) {
      const newServices = formData.services.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, services: newServices }));
    }
  };

  const handleFaqChange = (id: string, field: 'question' | 'answer', value: string) => {
    setFormData(prev => ({
      ...prev,
      faqs: prev.faqs.map(faq => 
        faq.id === id ? { ...faq, [field]: value } : faq
      )
    }));
  };

  const addFaq = () => {
    const newId = `faq-${Math.random().toString(36).substr(2, 8)}`;
    setFormData(prev => ({
      ...prev,
      faqs: [...prev.faqs, { id: newId, question: '', answer: '' }]
    }));
  };

  const removeFaq = (id: string) => {
    if (formData.faqs.length > 1) {
      setFormData(prev => ({
        ...prev,
        faqs: prev.faqs.filter(faq => faq.id !== id)
      }));
    }
  };

  const updateDeploymentStep = (stepId: string, status: DeploymentStep['status'], message?: string) => {
    setDeploymentSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, status, message } : step
    ));
  };

  const resetDeploymentSteps = () => {
    setDeploymentSteps([
      { id: 'step-1', title: isEditMode ? 'Update Agent Code' : 'Generate Agent Code', status: 'pending' },
      { id: 'step-2', title: isEditMode ? 'Update Repository' : 'Upload to Repository', status: 'pending' },
      { id: 'step-3', title: 'Deploy to Cloud', status: 'pending' },
    ]);
  };

  const setButtonLoading = (button: keyof typeof buttonStates, loading: boolean) => {
    setButtonStates(prev => ({ ...prev, [button]: loading }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Agent name is required');
      return false;
    }
    if (!formData.brandName.trim()) {
      toast.error('Brand name is required');
      return false;
    }
    if (!formData.roleDescription.trim()) {
      toast.error('Role description is required');
      return false;
    }
    if (formData.services.filter(s => s.trim()).length === 0) {
      toast.error('At least one service is required');
      return false;
    }
    if (!formData.apiKey.trim()) {
      toast.error('API key is required');
      return false;
    }
    if (formData.model === 'custom' && !formData.customModel.trim()) {
      toast.error('Custom model name is required');
      return false;
    }
    if (!isEditMode && !formData.subdomain.trim()) {
      toast.error('Subdomain is required');
      return false;
    }
    if (subdomainError) {
      toast.error(subdomainError);
      return false;
    }
    return true;
  };

  const handleGenerateCode = async () => {
    if (!validateForm()) return;
    if (!user) {
      toast.error('Please sign in to continue');
      return;
    }

    setIsDeploying(true);
    setButtonLoading('generateCode', true);
    setShowDeployment(true);
    resetDeploymentSteps();

    try {
      updateDeploymentStep('step-1', 'loading', isEditMode ? 'Updating agent code...' : 'Generating agent code...');

      // Use custom model if selected
      const finalModel = formData.model === 'custom' ? formData.customModel : formData.model;

      const config = {
        ...formData,
        model: finalModel,
        services: formData.services.filter(s => s.trim()),
        faqs: formData.faqs.filter(faq => faq.question.trim() && faq.answer.trim()),
        userId: user.id,
      };

      let result;
      if (isEditMode && currentAgentId) {
        // Update existing agent
        result = await regenerateAgent(currentAgentId);
      } else {
        // Create new agent
        result = await generateAgentCode(config);
      }

      if (result.success) {
        updateDeploymentStep('step-1', 'success', isEditMode ? 'Agent code updated successfully' : 'Agent code generated successfully');
        setCurrentAgentId(result.agentId!);
        setDeploymentResult(result);
        toast.success(isEditMode ? 'Agent updated successfully!' : 'Agent code generated successfully!');
      } else {
        updateDeploymentStep('step-1', 'error', result.error);
        toast.error(result.error || (isEditMode ? 'Failed to update agent' : 'Failed to generate agent code'));
      }
    } catch (error: any) {
      updateDeploymentStep('step-1', 'error', error.message);
      toast.error(isEditMode ? 'Failed to update agent' : 'Failed to generate agent code');
    } finally {
      setIsDeploying(false);
      setButtonLoading('generateCode', false);
    }
  };

  const handleUploadToRepo = async () => {
    if (!currentAgentId) {
      toast.error(isEditMode ? 'Please update agent code first' : 'Please generate agent code first');
      return;
    }

    setIsDeploying(true);
    setButtonLoading('uploadRepo', true);

    try {
      updateDeploymentStep('step-2', 'loading', isEditMode ? 'Updating repository...' : 'Creating repository...');

      const result = await uploadToGitHub(currentAgentId);

      if (result.success) {
        updateDeploymentStep('step-2', 'success', isEditMode ? 'Repository updated successfully' : 'Uploaded to repository successfully');
        setDeploymentResult(prev => ({ ...prev, ...result }));
        toast.success(isEditMode ? 'Repository updated successfully!' : 'Code uploaded to repository successfully!');
        
        // For edit mode, automatically trigger deployment after repo update
        if (isEditMode) {
          toast.success('Changes deployed automatically!', { icon: '🚀' });
        }
      } else {
        updateDeploymentStep('step-2', 'error', result.error);
        toast.error(result.error || (isEditMode ? 'Failed to update repository' : 'Failed to upload to repository'));
      }
    } catch (error: any) {
      updateDeploymentStep('step-2', 'error', error.message);
      toast.error(isEditMode ? 'Failed to update repository' : 'Failed to upload to repository');
    } finally {
      setIsDeploying(false);
      setButtonLoading('uploadRepo', false);
    }
  };

  const handleDeployToCloud = async () => {
    if (!currentAgentId) {
      toast.error('Please upload to repository first');
      return;
    }

    setIsDeploying(true);
    setButtonLoading('deployCloud', true);
    setDeployCloudClickTime(Date.now());
    setTriggerCountdown(30);

    try {
      updateDeploymentStep('step-3', 'loading', 'Deploying to cloud...');

      const result = await deployToVercel(currentAgentId);

      if (result.success) {
        updateDeploymentStep('step-3', 'success', 'Deployed to cloud successfully');
        setDeploymentResult(prev => ({ ...prev, ...result }));
        toast.success('Agent deployed successfully!');
        setTriggerCountdown(0); // Reset countdown on success
      } else {
        updateDeploymentStep('step-3', 'error', result.error);
        toast.error('Failed to deploy to cloud');
      }
    } catch (error: any) {
      updateDeploymentStep('step-3', 'error', error.message);
      toast.error('Failed to deploy to cloud');
    } finally {
      setIsDeploying(false);
      setButtonLoading('deployCloud', false);
    }
  };

  const handleMakeItLive = async () => {
    if (!currentAgentId) {
      toast.error('Please complete the deployment process first');
      return;
    }

    setButtonLoading('makeItLive', true);

    try {
      toast.loading('Triggering production deployment...', { id: 'make-live' });

      const result = await triggerDeploymentWithFile(currentAgentId);

      if (result.success) {
        toast.success('Production deployment triggered! Your agent will be live shortly.', { id: 'make-live' });
        
        // Update deployment result if needed
        if (result.vercelUrl) {
          setDeploymentResult(prev => ({ ...prev, ...result }));
        }
        setTriggerCountdown(0); // Reset countdown
      } else {
        toast.error(result.error || 'Failed to trigger deployment', { id: 'make-live' });
      }
    } catch (error: any) {
      toast.error('Failed to trigger deployment', { id: 'make-live' });
    } finally {
      setButtonLoading('makeItLive', false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const getStepIcon = (status: DeploymentStep['status']) => {
    switch (status) {
      case 'loading':
        return <div className="w-5 h-5 border-2 border-yellow-500 dark:border-yellow-500 border-t-transparent rounded-full animate-spin" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />;
      default:
        return <div className="w-5 h-5 border-2 border-gray-400 dark:border-gray-600 rounded-full" />;
    }
  };

  const getCurrentProvider = () => {
    return apiProviders.find(p => p.id === formData.apiProvider);
  };

  const getCurrentModels = () => {
    const provider = getCurrentProvider();
    return provider ? provider.models : [];
  };

  // Check if buttons should be disabled
  const isGenerateCodeDisabled = buttonStates.generateCode || isDeploying;
  const isUploadRepoDisabled = buttonStates.uploadRepo || isDeploying || deploymentSteps[0]?.status !== 'success';
  const isDeployCloudDisabled = buttonStates.deployCloud || isDeploying || deploymentSteps[1]?.status !== 'success';
  const isMakeItLiveDisabled = buttonStates.makeItLive || !deploymentResult?.githubRepo || triggerCountdown > 0;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0A0A0A] pt-16 transition-colors duration-300">
        <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[#1A1A1A] dark:via-[#0A0A0A] dark:to-black border border-gray-300/50 dark:border-yellow-500/30 rounded-2xl shadow-2xl shadow-gray-400/20 dark:shadow-yellow-500/20 p-8 text-center transition-all duration-300">
          <img 
            src="/pludo_svg_logo.svg" 
            alt="PLUDO.AI Logo" 
            className="w-12 h-12 mx-auto mb-4 opacity-70"
          />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Sign In Required
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please sign in to create your AI agent
          </p>
          <Button onClick={() => navigate('/login')} className="bg-gradient-to-r from-gray-800 to-gray-700 dark:from-yellow-500 dark:to-yellow-400 hover:from-gray-700 hover:to-gray-600 dark:hover:from-yellow-400 dark:hover:to-yellow-300 text-white dark:text-black font-bold">
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  if (loadingAgent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0A0A0A] pt-16 transition-colors duration-300">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading agent...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A] pt-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {isEditMode ? 'Edit Your' : 'Create Your'}{' '}
              <span className="bg-gradient-to-r from-gray-800 to-gray-700 dark:from-yellow-400 dark:to-yellow-500 bg-clip-text text-transparent">
                AI Agent
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {isEditMode 
                ? 'Update your AI assistant\'s configuration and deploy the changes.'
                : 'Design, customize, and deploy your intelligent AI assistant in minutes. No coding required.'
              }
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[#1A1A1A] dark:via-[#0A0A0A] dark:to-black border border-gray-300/50 dark:border-yellow-500/30 rounded-2xl shadow-2xl shadow-gray-400/20 dark:shadow-yellow-500/20 p-8 transition-all duration-300">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-500/20 rounded-lg">
                    <img 
                      src="/pludo_svg_logo.svg" 
                      alt="PLUDO.AI Logo" 
                      className="w-6 h-6"
                    />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Basic Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Agent Name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g., Sarah, Alex, Assistant"
                    required
                  />

                  <Input
                    label="Brand Name"
                    value={formData.brandName}
                    onChange={(e) => handleInputChange('brandName', e.target.value)}
                    placeholder="e.g., Acme Corp, My Business"
                    required
                  />

                  <Input
                    label="Website Name (Optional)"
                    value={formData.websiteName}
                    onChange={(e) => handleInputChange('websiteName', e.target.value)}
                    placeholder="e.g., acme.com"
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Agent Type
                    </label>
                    <select
                      value={formData.agentType}
                      onChange={(e) => handleInputChange('agentType', e.target.value)}
                      className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-3 py-2 text-gray-900 dark:text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 focus:outline-none transition-all duration-200"
                    >
                      <option value="customer-support">Customer Support</option>
                      <option value="sales">Sales Assistant</option>
                      <option value="lead-generation">Lead Generation</option>
                      <option value="general">General Assistant</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6">
                  <Textarea
                    label="Role Description"
                    value={formData.roleDescription}
                    onChange={(e) => handleInputChange('roleDescription', e.target.value)}
                    placeholder="Describe what your AI agent does and how it helps customers..."
                    rows={3}
                    required
                  />
                </div>

                {/* Subdomain Input */}
                <div className="mt-6">
                  <div className="relative">
                    <Input
                      label="Subdomain"
                      value={formData.subdomain}
                      onChange={(e) => handleSubdomainChange(e.target.value)}
                      placeholder="your-brand"
                      required={!isEditMode}
                      disabled={isEditMode} // Disable editing subdomain in edit mode
                      error={subdomainError}
                    />
                    {subdomainChecking && (
                      <div className="absolute right-3 top-8">
                        <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                  <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
                    <div className="flex items-center">
                      <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
                      <div className="text-xs text-blue-800 dark:text-blue-200">
                        <strong>Your agent will be available at:</strong> {formData.subdomain || 'your-subdomain'}.pludo.online
                        {isEditMode && (
                          <div className="mt-1 text-blue-600 dark:text-blue-300">
                            <strong>Note:</strong> Subdomain cannot be changed after creation
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* API Configuration */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
            >
              <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[#1A1A1A] dark:via-[#0A0A0A] dark:to-black border border-gray-300/50 dark:border-yellow-500/30 rounded-2xl shadow-2xl shadow-gray-400/20 dark:shadow-yellow-500/20 p-8 transition-all duration-300">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-blue-100 dark:bg-blue-500/20 rounded-lg">
                    <Key className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    AI Configuration
                  </h2>
                </div>

                <div className="space-y-6">
                  {/* API Provider Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      AI Provider
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {apiProviders.map((provider) => (
                        <div
                          key={provider.id}
                          className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all ${
                            formData.apiProvider === provider.id
                              ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-500/10'
                              : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                          }`}
                          onClick={() => handleInputChange('apiProvider', provider.id)}
                        >
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="apiProvider"
                              value={provider.id}
                              checked={formData.apiProvider === provider.id}
                              onChange={() => handleInputChange('apiProvider', provider.id)}
                              className="h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                            />
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {provider.name}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {provider.description}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Model Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      AI Model
                    </label>
                    <select
                      value={formData.model}
                      onChange={(e) => handleInputChange('model', e.target.value)}
                      className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-3 py-2 text-gray-900 dark:text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 focus:outline-none transition-all duration-200"
                    >
                      {getCurrentModels().map((model) => (
                        <option key={model.id} value={model.id}>
                          {model.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Custom Model Input (only for OpenRouter) */}
                  {formData.apiProvider === 'openrouter' && formData.model === 'custom' && (
                    <div>
                      <Input
                        label="Custom Model Name"
                        value={formData.customModel}
                        onChange={(e) => handleInputChange('customModel', e.target.value)}
                        placeholder="e.g., anthropic/claude-3-opus, openai/gpt-4-turbo"
                        required
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Enter the exact model name as it appears in the OpenRouter documentation
                      </p>
                    </div>
                  )}

                  {/* API Key Input with visibility toggle */}
                  <div>
                    <div className="relative">
                      <Input
                        label={`${getCurrentProvider()?.name} API Key`}
                        type={showApiKey ? 'text' : 'password'}
                        value={formData.apiKey}
                        onChange={(e) => handleInputChange('apiKey', e.target.value)}
                        placeholder={`Enter your ${getCurrentProvider()?.name} API key`}
                        icon={<Shield className="w-5 h-5 text-gray-400" />}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="absolute right-3 top-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 z-10"
                      >
                        {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
                      <div className="flex items-start">
                        <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
                        <div className="text-xs text-blue-800 dark:text-blue-200">
                          <strong>Secure:</strong> Your API key is encrypted and stored securely. It's only used to power your AI agent's conversations.
                          {formData.apiProvider === 'openrouter' && (
                            <div className="mt-1">
                              Get your API key from <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="underline">OpenRouter Dashboard</a>
                            </div>
                          )}
                          {formData.apiProvider === 'gemini' && (
                            <div className="mt-1">
                              Get your API key from <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline">Google AI Studio</a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Services */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[#1A1A1A] dark:via-[#0A0A0A] dark:to-black border border-gray-300/50 dark:border-yellow-500/30 rounded-2xl shadow-2xl shadow-gray-400/20 dark:shadow-yellow-500/20 p-8 transition-all duration-300">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-green-100 dark:bg-green-500/20 rounded-lg">
                    <Settings className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Services & Capabilities
                  </h2>
                </div>

                <div className="space-y-4">
                  {formData.services.map((service, index) => (
                    <div key={`service-${index}-${Math.random().toString(36).substr(2, 4)}`} className="flex items-center space-x-3">
                      <Input
                        value={service}
                        onChange={(e) => handleServiceChange(index, e.target.value)}
                        placeholder="e.g., Product support, Order tracking, Technical help"
                        className="flex-1"
                      />
                      {formData.services.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeService(index)}
                          className="flex-shrink-0"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  
                  <Button
                    variant="outline"
                    onClick={addService}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Service
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* FAQs */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[#1A1A1A] dark:via-[#0A0A0A] dark:to-black border border-gray-300/50 dark:border-yellow-500/30 rounded-2xl shadow-2xl shadow-gray-400/20 dark:shadow-yellow-500/20 p-8 transition-all duration-300">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-purple-100 dark:bg-purple-500/20 rounded-lg">
                    <MessageSquare className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Frequently Asked Questions
                  </h2>
                </div>

                <div className="space-y-6">
                  {formData.faqs.map((faq, index) => (
                    <div key={faq.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          FAQ #{index + 1}
                        </h3>
                        {formData.faqs.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFaq(faq.id)}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="space-y-4">
                        <Input
                          label="Question"
                          value={faq.question}
                          onChange={(e) => handleFaqChange(faq.id, 'question', e.target.value)}
                          placeholder="What question do customers often ask?"
                        />
                        <Textarea
                          label="Answer"
                          value={faq.answer}
                          onChange={(e) => handleFaqChange(faq.id, 'answer', e.target.value)}
                          placeholder="Provide a helpful answer..."
                          rows={3}
                        />
                      </div>
                    </div>
                  ))}
                  
                  <Button
                    variant="outline"
                    onClick={addFaq}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add FAQ
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Customization */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[#1A1A1A] dark:via-[#0A0A0A] dark:to-black border border-gray-300/50 dark:border-yellow-500/30 rounded-2xl shadow-2xl shadow-gray-400/20 dark:shadow-yellow-500/20 p-8 transition-all duration-300">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-purple-100 dark:bg-purple-500/20 rounded-lg">
                    <Palette className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Customization
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Primary Color
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={formData.primaryColor}
                        onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                        className="w-12 h-12 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer"
                      />
                      <Input
                        value={formData.primaryColor}
                        onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                        placeholder="#eab308"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Personality Tone
                    </label>
                    <select
                      value={formData.tone}
                      onChange={(e) => handleInputChange('tone', e.target.value)}
                      className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-3 py-2 text-gray-900 dark:text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 focus:outline-none transition-all duration-200"
                    >
                      <option value="professional">Professional</option>
                      <option value="friendly">Friendly</option>
                      <option value="witty">Witty</option>
                      <option value="minimal">Minimal</option>
                    </select>
                  </div>

                  <Input
                    label="Avatar URL (Optional)"
                    value={formData.avatarUrl}
                    onChange={(e) => handleInputChange('avatarUrl', e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                  />

                  <Input
                    label="Office Hours (Optional)"
                    value={formData.officeHours}
                    onChange={(e) => handleInputChange('officeHours', e.target.value)}
                    placeholder="e.g., Mon-Fri 9AM-5PM EST"
                  />
                </div>

                <div className="mt-6">
                  <Textarea
                    label="Additional Knowledge"
                    value={formData.knowledge}
                    onChange={(e) => handleInputChange('knowledge', e.target.value)}
                    placeholder="Add any additional information your agent should know..."
                    rows={4}
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Preview & Actions */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Preview */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[#1A1A1A] dark:via-[#0A0A0A] dark:to-black border border-gray-300/50 dark:border-yellow-500/30 rounded-2xl shadow-2xl shadow-gray-400/20 dark:shadow-yellow-500/20 p-6 transition-all duration-300">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Agent Preview
                  </h3>
                  
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-lg p-4 mb-4">
                    <div className="flex items-center space-x-3 mb-3">
                      {formData.avatarUrl ? (
                        <img 
                          src={formData.avatarUrl} 
                          alt={formData.name}
                          className="w-10 h-10 rounded-full"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                          style={{ backgroundColor: formData.primaryColor }}
                        >
                          <img 
                            src="/pludo_svg_logo.svg" 
                            alt="PLUDO.AI Logo" 
                            className="w-6 h-6"
                          />
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {formData.name || 'Agent Name'}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {formData.brandName || 'Brand Name'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 mb-3">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {formData.roleDescription || 'Role description will appear here...'}
                      </p>
                    </div>
                    
                    <div className="text-xs text-gray-500 space-y-1">
                      <div>Tone: {formData.tone} • Type: {formData.agentType.replace('-', ' ')}</div>
                      <div>AI: {getCurrentProvider()?.name} • Model: {getCurrentModels().find(m => m.id === formData.model)?.name || (formData.model === 'custom' ? formData.customModel : formData.model)}</div>
                      {formData.subdomain && (
                        <div className="flex items-center space-x-1">
                          <Globe className="w-3 h-3" />
                          <span>{formData.subdomain}.pludo.online</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button
                      onClick={handleGenerateCode}
                      disabled={isGenerateCodeDisabled}
                      className="w-full bg-gradient-to-r from-gray-800 to-gray-700 dark:from-yellow-500 dark:to-yellow-400 hover:from-gray-700 hover:to-gray-600 dark:hover:from-yellow-400 dark:hover:to-yellow-300 text-white dark:text-black font-bold"
                      loading={buttonStates.generateCode}
                    >
                      {isEditMode ? <Save className="w-4 h-4 mr-2" /> : <Code className="w-4 h-4 mr-2" />}
                      {isEditMode ? 'Update Agent' : 'Generate Agent Code'}
                    </Button>

                    <Button
                      onClick={handleUploadToRepo}
                      disabled={isUploadRepoDisabled}
                      variant="outline"
                      className="w-full"
                      loading={buttonStates.uploadRepo}
                    >
                      <Github className="w-4 h-4 mr-2" />
                      {isEditMode ? 'Update Repository' : 'Upload to Repository'}
                    </Button>

                    {/* Only show deploy and trigger buttons for new agents */}
                    {!isEditMode && (
                      <>
                        <Button
                          onClick={handleDeployToCloud}
                          disabled={isDeployCloudDisabled}
                          variant="secondary"
                          className="w-full"
                          loading={buttonStates.deployCloud}
                        >
                          <Globe className="w-4 h-4 mr-2" />
                          Deploy to Cloud
                        </Button>

                        {/* Make it Live Button with countdown */}
                        {deploymentResult?.githubRepo && (
                          <Button
                            onClick={handleMakeItLive}
                            disabled={isMakeItLiveDisabled}
                            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                            loading={buttonStates.makeItLive}
                          >
                            <Zap className="w-4 h-4 mr-2" />
                            {triggerCountdown > 0 ? `Trigger Deployment (${triggerCountdown}s)` : 'Trigger Deployment'}
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Deployment Progress */}
              {showDeployment && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[#1A1A1A] dark:via-[#0A0A0A] dark:to-black border border-gray-300/50 dark:border-yellow-500/30 rounded-2xl shadow-2xl shadow-gray-400/20 dark:shadow-yellow-500/20 p-6 transition-all duration-300">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      {isEditMode ? 'Update Progress' : 'Deployment Progress'}
                    </h3>
                    
                    <div className="space-y-4">
                      {deploymentSteps.map((step) => (
                        <div key={step.id} className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {getStepIcon(step.status)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {step.title}
                            </div>
                            {step.message && (
                              <div className={`text-xs mt-1 ${
                                step.status === 'error' 
                                  ? 'text-red-600 dark:text-red-400' 
                                  : 'text-gray-500 dark:text-gray-400'
                              }`}>
                                {step.message}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Results */}
                    {deploymentResult && (
                      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                          {isEditMode ? 'Update Results' : 'Deployment Results'}
                        </h4>
                        
                        <div className="space-y-3">
                          {deploymentResult.githubRepo && (
                            <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                              <div className="flex items-center space-x-2">
                                <Github className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                <span className="text-sm text-gray-600 dark:text-gray-300">
                                  Repository
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => window.open(deploymentResult.githubRepo, '_blank')}
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          )}

                          {deploymentResult.vercelUrl && (
                            <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                              <div className="flex items-center space-x-2">
                                <Globe className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                <span className="text-sm text-gray-600 dark:text-gray-300">
                                  Live URL
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => window.open(deploymentResult.vercelUrl, '_blank')}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(deploymentResult.vercelUrl)}
                                >
                                  <Copy className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          )}

                          {deploymentResult.embedCode && (
                            <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                  Embed Code
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(deploymentResult.embedCode)}
                                >
                                  <Copy className="w-4 h-4" />
                                </Button>
                              </div>
                              <code className="text-xs text-gray-500 dark:text-gray-400 break-all">
                                {deploymentResult.embedCode}
                              </code>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};