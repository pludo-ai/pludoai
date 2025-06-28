import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Zap
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Card } from '../components/ui/Card';
import { useAuthStore } from '../store/authStore';
import { generateAgentCode, uploadToGitHub, deployToVercel, triggerDeploymentWithFile } from '../lib/deployment';
import toast from 'react-hot-toast';

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

interface DeploymentStep {
  id: string;
  title: string;
  status: 'pending' | 'loading' | 'success' | 'error';
  message?: string;
}

// Utility function to generate random string
const generateRandomString = (length: number = 8): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Utility function to generate subdomain
const generateSubdomain = (brandName: string): string => {
  const cleanBrand = brandName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .substring(0, 15); // Limit brand part to 15 chars
  
  const randomSuffix = generateRandomString(6);
  const timestamp = Date.now().toString().slice(-4);
  
  return `${cleanBrand || 'agent'}-${randomSuffix}-${timestamp}`;
};

export const Create: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    brandName: '',
    websiteName: '',
    agentType: 'customer-support',
    roleDescription: '',
    services: [''],
    primaryColor: '#3b82f6',
    tone: 'professional',
    avatarUrl: '',
    officeHours: '',
    knowledge: '',
    subdomain: '',
  });

  const [faqs, setFaqs] = useState<FAQ[]>([
    { id: `faq-${generateRandomString(8)}`, question: '', answer: '' }
  ]);

  // Deployment state
  const [deploymentSteps, setDeploymentSteps] = useState<DeploymentStep[]>([
    { id: 'step-1', title: 'Generate Agent Code', status: 'pending' },
    { id: 'step-2', title: 'Upload to GitHub', status: 'pending' },
    { id: 'step-3', title: 'Deploy to Vercel', status: 'pending' },
  ]);

  const [currentAgentId, setCurrentAgentId] = useState<string | null>(null);
  const [deploymentResult, setDeploymentResult] = useState<any>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [showDeployment, setShowDeployment] = useState(false);
  
  // Button states
  const [buttonStates, setButtonStates] = useState({
    generateCode: false,
    uploadGithub: false,
    deployVercel: false,
    makeItLive: false,
  });

  // Auto-generate subdomain from brand name with random suffix
  useEffect(() => {
    if (formData.brandName) {
      const newSubdomain = generateSubdomain(formData.brandName);
      setFormData(prev => ({ ...prev, subdomain: newSubdomain }));
    }
  }, [formData.brandName]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleServiceChange = (index: number, value: string) => {
    const newServices = [...formData.services];
    newServices[index] = value;
    setFormData(prev => ({ ...prev, services: newServices }));
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
    setFaqs(prev => prev.map(faq => 
      faq.id === id ? { ...faq, [field]: value } : faq
    ));
  };

  const addFaq = () => {
    const newId = `faq-${generateRandomString(8)}`;
    setFaqs(prev => [...prev, { id: newId, question: '', answer: '' }]);
  };

  const removeFaq = (id: string) => {
    if (faqs.length > 1) {
      setFaqs(prev => prev.filter(faq => faq.id !== id));
    }
  };

  const updateDeploymentStep = (stepId: string, status: DeploymentStep['status'], message?: string) => {
    setDeploymentSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, status, message } : step
    ));
  };

  const resetDeploymentSteps = () => {
    setDeploymentSteps([
      { id: 'step-1', title: 'Generate Agent Code', status: 'pending' },
      { id: 'step-2', title: 'Upload to GitHub', status: 'pending' },
      { id: 'step-3', title: 'Deploy to Vercel', status: 'pending' },
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
      updateDeploymentStep('step-1', 'loading', 'Generating agent code...');

      // Ensure subdomain is generated if not already
      const finalSubdomain = formData.subdomain || generateSubdomain(formData.brandName);

      const config = {
        ...formData,
        subdomain: finalSubdomain,
        services: formData.services.filter(s => s.trim()),
        faqs: faqs.filter(faq => faq.question.trim() && faq.answer.trim()),
        userId: user.id,
      };

      const result = await generateAgentCode(config);

      if (result.success) {
        updateDeploymentStep('step-1', 'success', 'Agent code generated successfully');
        setCurrentAgentId(result.agentId!);
        setDeploymentResult(result);
        toast.success('Agent code generated successfully!');
      } else {
        updateDeploymentStep('step-1', 'error', result.error);
        toast.error(result.error || 'Failed to generate agent code');
      }
    } catch (error: any) {
      updateDeploymentStep('step-1', 'error', error.message);
      toast.error('Failed to generate agent code');
    } finally {
      setIsDeploying(false);
      setButtonLoading('generateCode', false);
    }
  };

  const handleUploadToGitHub = async () => {
    if (!currentAgentId) {
      toast.error('Please generate agent code first');
      return;
    }

    setIsDeploying(true);
    setButtonLoading('uploadGithub', true);

    try {
      updateDeploymentStep('step-2', 'loading', 'Creating GitHub repository...');

      const result = await uploadToGitHub(currentAgentId);

      if (result.success) {
        updateDeploymentStep('step-2', 'success', 'Uploaded to GitHub successfully');
        setDeploymentResult(prev => ({ ...prev, ...result }));
        toast.success('Code uploaded to GitHub successfully!');
      } else {
        updateDeploymentStep('step-2', 'error', result.error);
        toast.error(result.error || 'Failed to upload to GitHub');
      }
    } catch (error: any) {
      updateDeploymentStep('step-2', 'error', error.message);
      toast.error('Failed to upload to GitHub');
    } finally {
      setIsDeploying(false);
      setButtonLoading('uploadGithub', false);
    }
  };

  const handleDeployToVercel = async () => {
    if (!currentAgentId) {
      toast.error('Please upload to GitHub first');
      return;
    }

    setIsDeploying(true);
    setButtonLoading('deployVercel', true);

    try {
      updateDeploymentStep('step-3', 'loading', 'Deploying to Vercel...');

      const result = await deployToVercel(currentAgentId);

      if (result.success) {
        updateDeploymentStep('step-3', 'success', 'Deployed to Vercel successfully');
        setDeploymentResult(prev => ({ ...prev, ...result }));
        toast.success('Agent deployed successfully!');
      } else {
        updateDeploymentStep('step-3', 'error', result.error);
        toast.error(result.error || 'Failed to deploy to Vercel');
      }
    } catch (error: any) {
      updateDeploymentStep('step-3', 'error', error.message);
      toast.error('Failed to deploy to Vercel');
    } finally {
      setIsDeploying(false);
      setButtonLoading('deployVercel', false);
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
        return <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />;
    }
  };

  // Check if buttons should be disabled
  const isGenerateCodeDisabled = buttonStates.generateCode || isDeploying;
  const isUploadGithubDisabled = buttonStates.uploadGithub || isDeploying || deploymentSteps[0]?.status !== 'success';
  const isDeployVercelDisabled = buttonStates.deployVercel || isDeploying || deploymentSteps[1]?.status !== 'success';
  const isMakeItLiveDisabled = buttonStates.makeItLive || !deploymentResult?.githubRepo;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="p-8 text-center">
          <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Sign In Required
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Please sign in to create your AI agent
          </p>
          <Button onClick={() => navigate('/login')}>
            Sign In
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Create Your{' '}
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                AI Agent
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Design, customize, and deploy your intelligent AI assistant in minutes. 
              No coding required.
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
              <Card className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                    <Bot className="w-6 h-6 text-primary-600 dark:text-primary-400" />
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
                      className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-3 py-2 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all duration-200"
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

                {/* Auto-generated Subdomain Display */}
                {formData.subdomain && (
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Generated Subdomain
                    </label>
                    <div className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <code className="text-sm text-gray-600 dark:text-gray-300 flex-1">
                        {formData.subdomain}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(formData.subdomain)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      This unique identifier is automatically generated for your agent
                    </p>
                  </div>
                )}
              </Card>
            </motion.div>

            {/* Services */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-secondary-100 dark:bg-secondary-900/30 rounded-lg">
                    <Settings className="w-6 h-6 text-secondary-600 dark:text-secondary-400" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Services & Capabilities
                  </h2>
                </div>

                <div className="space-y-4">
                  {formData.services.map((service, index) => (
                    <div key={`service-${index}-${generateRandomString(4)}`} className="flex items-center space-x-3">
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
              </Card>
            </motion.div>

            {/* FAQs */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-accent-100 dark:bg-accent-900/30 rounded-lg">
                    <MessageSquare className="w-6 h-6 text-accent-600 dark:text-accent-400" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Frequently Asked Questions
                  </h2>
                </div>

                <div className="space-y-6">
                  {faqs.map((faq) => (
                    <div key={faq.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          FAQ #{faqs.findIndex(f => f.id === faq.id) + 1}
                        </h3>
                        {faqs.length > 1 && (
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
              </Card>
            </motion.div>

            {/* Customization */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
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
                        placeholder="#3b82f6"
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
                      className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-3 py-2 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all duration-200"
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
              </Card>
            </motion.div>
          </div>

          {/* Preview & Actions */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Preview */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Agent Preview
                  </h3>
                  
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg p-4 mb-4">
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
                          <Bot className="w-6 h-6" />
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
                    
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Tone: {formData.tone} • Type: {formData.agentType.replace('-', ' ')}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button
                      onClick={handleGenerateCode}
                      disabled={isGenerateCodeDisabled}
                      className="w-full"
                      loading={buttonStates.generateCode}
                    >
                      <Code className="w-4 h-4 mr-2" />
                      Generate Agent Code
                    </Button>

                    <Button
                      onClick={handleUploadToGitHub}
                      disabled={isUploadGithubDisabled}
                      variant="outline"
                      className="w-full"
                      loading={buttonStates.uploadGithub}
                    >
                      <Github className="w-4 h-4 mr-2" />
                      Upload to GitHub
                    </Button>

                    <Button
                      onClick={handleDeployToVercel}
                      disabled={isDeployVercelDisabled}
                      variant="secondary"
                      className="w-full"
                      loading={buttonStates.deployVercel}
                    >
                      <Rocket className="w-4 h-4 mr-2" />
                      Deploy to Vercel
                    </Button>

                    {/* Make it Live Button */}
                    {deploymentResult?.githubRepo && (
                      <Button
                        onClick={handleMakeItLive}
                        disabled={isMakeItLiveDisabled}
                        className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                        loading={buttonStates.makeItLive}
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        Make it Live
                      </Button>
                    )}
                  </div>
                </Card>
              </motion.div>

              {/* Deployment Progress */}
              {showDeployment && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Deployment Progress
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
                          Deployment Results
                        </h4>
                        
                        <div className="space-y-3">
                          {deploymentResult.githubRepo && (
                            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <div className="flex items-center space-x-2">
                                <Github className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                <span className="text-sm text-gray-600 dark:text-gray-300">
                                  GitHub Repo
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
                            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
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
                            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
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
                  </Card>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};