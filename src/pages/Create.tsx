import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Bot, 
  Sparkles, 
  Upload, 
  Github, 
  Globe, 
  Check, 
  AlertCircle,
  Plus,
  Minus,
  Palette,
  MessageSquare,
  Settings,
  Brain,
  Code,
  ExternalLink,
  Copy,
  Download
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Card } from '../components/ui/Card';
import { useAuthStore } from '../store/authStore';
import { generateAgentCode, uploadToGitHub, deployToVercel } from '../lib/deployment';
import toast from 'react-hot-toast';

interface FAQ {
  question: string;
  answer: string;
}

interface FormData {
  name: string;
  brandName: string;
  websiteName: string;
  agentType: string;
  roleDescription: string;
  services: string[];
  faqs: FAQ[];
  primaryColor: string;
  tone: string;
  avatarUrl: string;
  subdomain: string;
  officeHours: string;
  knowledge: string;
}

interface DeploymentStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'loading' | 'completed' | 'error';
  result?: any;
}

export const Create: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [deploymentSteps, setDeploymentSteps] = useState<DeploymentStep[]>([]);
  const [agentId, setAgentId] = useState<string | null>(null);
  const [embedCode, setEmbedCode] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const [formData, setFormData] = useState<FormData>({
    name: '',
    brandName: '',
    websiteName: '',
    agentType: 'customer-support',
    roleDescription: '',
    services: [''],
    faqs: [{ question: '', answer: '' }],
    primaryColor: '#3b82f6',
    tone: 'professional',
    avatarUrl: '',
    subdomain: '',
    officeHours: '',
    knowledge: '',
  });

  // Generate unique keys for dynamic elements
  const [serviceKeys, setServiceKeys] = useState<string[]>(['service-0']);
  const [faqKeys, setFaqKeys] = useState<string[]>(['faq-0']);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    // Generate subdomain from brand name
    if (formData.brandName) {
      const subdomain = formData.brandName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .substring(0, 20);
      setFormData(prev => ({ ...prev, subdomain }));
    }
  }, [formData.brandName]);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addService = () => {
    const newKey = `service-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setFormData(prev => ({ ...prev, services: [...prev.services, ''] }));
    setServiceKeys(prev => [...prev, newKey]);
  };

  const removeService = (index: number) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
    setServiceKeys(prev => prev.filter((_, i) => i !== index));
  };

  const updateService = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.map((service, i) => i === index ? value : service)
    }));
  };

  const addFAQ = () => {
    const newKey = `faq-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setFormData(prev => ({
      ...prev,
      faqs: [...prev.faqs, { question: '', answer: '' }]
    }));
    setFaqKeys(prev => [...prev, newKey]);
  };

  const removeFAQ = (index: number) => {
    setFormData(prev => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index)
    }));
    setFaqKeys(prev => prev.filter((_, i) => i !== index));
  };

  const updateFAQ = (index: number, field: 'question' | 'answer', value: string) => {
    setFormData(prev => ({
      ...prev,
      faqs: prev.faqs.map((faq, i) => 
        i === index ? { ...faq, [field]: value } : faq
      )
    }));
  };

  const validateForm = (): boolean => {
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

  const initializeDeploymentSteps = () => {
    const steps: DeploymentStep[] = [
      {
        id: 'generate',
        title: 'Generate Agent Code',
        description: 'Creating your AI agent files and configuration',
        status: 'pending'
      },
      {
        id: 'github',
        title: 'Upload to GitHub',
        description: 'Creating private repository and uploading files',
        status: 'pending'
      },
      {
        id: 'deploy',
        title: 'Deploy to Vercel',
        description: 'Building and deploying your agent to the web',
        status: 'pending'
      }
    ];
    setDeploymentSteps(steps);
  };

  const updateStepStatus = (stepId: string, status: DeploymentStep['status'], result?: any) => {
    setDeploymentSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, status, result } : step
    ));
  };

  const handleGenerateAgent = async () => {
    if (!validateForm()) return;
    if (!user) {
      toast.error('Please log in to continue');
      return;
    }

    setLoading(true);
    setCurrentStep(2);
    initializeDeploymentSteps();

    try {
      // Step 1: Generate Agent Code
      updateStepStatus('generate', 'loading');
      
      const config = {
        ...formData,
        services: formData.services.filter(s => s.trim()),
        faqs: formData.faqs.filter(faq => faq.question.trim() && faq.answer.trim()),
        userId: user.id,
      };

      const codeResult = await generateAgentCode(config);
      
      if (!codeResult.success) {
        updateStepStatus('generate', 'error');
        throw new Error(codeResult.error || 'Failed to generate agent code');
      }

      updateStepStatus('generate', 'completed', codeResult);
      setAgentId(codeResult.agentId!);

      // Step 2: Upload to GitHub
      await handleUploadToGitHub(codeResult.agentId!);

    } catch (error: any) {
      console.error('Agent generation error:', error);
      toast.error(error.message || 'Failed to generate agent');
      setLoading(false);
    }
  };

  const handleUploadToGitHub = async (agentId: string) => {
    try {
      updateStepStatus('github', 'loading');
      
      const githubResult = await uploadToGitHub(agentId);
      
      if (!githubResult.success) {
        updateStepStatus('github', 'error');
        throw new Error(githubResult.error || 'Failed to upload to GitHub');
      }

      updateStepStatus('github', 'completed', githubResult);

      // Step 3: Deploy to Vercel
      await handleDeployToVercel(agentId);

    } catch (error: any) {
      console.error('GitHub upload error:', error);
      toast.error(error.message || 'Failed to upload to GitHub');
      setLoading(false);
    }
  };

  const handleDeployToVercel = async (agentId: string) => {
    try {
      updateStepStatus('deploy', 'loading');
      
      const deployResult = await deployToVercel(agentId);
      
      if (!deployResult.success) {
        updateStepStatus('deploy', 'error');
        throw new Error(deployResult.error || 'Failed to deploy to Vercel');
      }

      updateStepStatus('deploy', 'completed', deployResult);
      
      if (deployResult.vercelUrl) {
        setPreviewUrl(deployResult.vercelUrl);
      }
      
      if (deployResult.embedCode) {
        setEmbedCode(deployResult.embedCode);
      }

      setCurrentStep(3);
      toast.success('🎉 Agent deployed successfully!');

    } catch (error: any) {
      console.error('Vercel deployment error:', error);
      toast.error(error.message || 'Failed to deploy to Vercel');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            {/* Basic Information */}
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Basic Information
                </h3>
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
                  placeholder="e.g., TechCorp Inc."
                  required
                />
                <Input
                  label="Website Name"
                  value={formData.websiteName}
                  onChange={(e) => handleInputChange('websiteName', e.target.value)}
                  placeholder="e.g., TechCorp Website"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Agent Type
                  </label>
                  <select
                    value={formData.agentType}
                    onChange={(e) => handleInputChange('agentType', e.target.value)}
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

              <div className="mt-6">
                <Textarea
                  label="Role Description"
                  value={formData.roleDescription}
                  onChange={(e) => handleInputChange('roleDescription', e.target.value)}
                  placeholder="Describe what your agent does and how it helps customers..."
                  rows={3}
                  required
                />
              </div>
            </Card>

            {/* Services */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                    <Settings className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Services Offered
                  </h3>
                </div>
                <Button variant="outline" size="sm" onClick={addService}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Service
                </Button>
              </div>

              <div className="space-y-3">
                {formData.services.map((service, index) => (
                  <div key={serviceKeys[index]} className="flex items-center space-x-3">
                    <Input
                      value={service}
                      onChange={(e) => updateService(index, e.target.value)}
                      placeholder="e.g., Technical support, Product information"
                      className="flex-1"
                    />
                    {formData.services.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeService(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* FAQs */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Frequently Asked Questions
                  </h3>
                </div>
                <Button variant="outline" size="sm" onClick={addFAQ}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add FAQ
                </Button>
              </div>

              <div className="space-y-4">
                {formData.faqs.map((faq, index) => (
                  <div key={faqKeys[index]} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        FAQ #{index + 1}
                      </span>
                      {formData.faqs.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeFAQ(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <div className="space-y-3">
                      <Input
                        placeholder="Question"
                        value={faq.question}
                        onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                      />
                      <Textarea
                        placeholder="Answer"
                        value={faq.answer}
                        onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Customization */}
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                  <Palette className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Customization
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Primary Color"
                  type="color"
                  value={formData.primaryColor}
                  onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tone
                  </label>
                  <select
                    value={formData.tone}
                    onChange={(e) => handleInputChange('tone', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 px-3 py-2 text-gray-900 dark:text-white"
                  >
                    <option value="professional">Professional</option>
                    <option value="friendly">Friendly</option>
                    <option value="witty">Witty</option>
                    <option value="minimal">Minimal</option>
                  </select>
                </div>
                <Input
                  label="Avatar URL (optional)"
                  value={formData.avatarUrl}
                  onChange={(e) => handleInputChange('avatarUrl', e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                />
                <Input
                  label="Office Hours (optional)"
                  value={formData.officeHours}
                  onChange={(e) => handleInputChange('officeHours', e.target.value)}
                  placeholder="e.g., Mon-Fri 9AM-5PM EST"
                />
              </div>

              <div className="mt-6">
                <Input
                  label="Subdomain"
                  value={formData.subdomain}
                  onChange={(e) => handleInputChange('subdomain', e.target.value)}
                  placeholder="your-agent-name"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Your agent will be available at: {formData.subdomain || 'your-agent-name'}.vercel.app
                </p>
              </div>
            </Card>

            {/* Knowledge Base */}
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Knowledge Base
                </h3>
              </div>

              <Textarea
                label="Additional Knowledge"
                value={formData.knowledge}
                onChange={(e) => handleInputChange('knowledge', e.target.value)}
                placeholder="Add any additional information your agent should know about your business, products, or services..."
                rows={6}
              />
            </Card>

            {/* Generate Button */}
            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={handleGenerateAgent}
                disabled={loading}
                loading={loading}
                className="px-8 py-3"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Generate AI Agent
              </Button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="max-w-2xl mx-auto">
            <Card className="p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Deploying Your Agent
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Please wait while we create and deploy your AI agent
                </p>
              </div>

              <div className="space-y-6">
                {deploymentSteps.map((step) => (
                  <div key={step.id} className="flex items-start space-x-4">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1
                      ${step.status === 'completed' ? 'bg-green-100 text-green-600' :
                        step.status === 'loading' ? 'bg-blue-100 text-blue-600' :
                        step.status === 'error' ? 'bg-red-100 text-red-600' :
                        'bg-gray-100 text-gray-400'}
                    `}>
                      {step.status === 'completed' ? (
                        <Check className="w-4 h-4" />
                      ) : step.status === 'loading' ? (
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      ) : step.status === 'error' ? (
                        <AlertCircle className="w-4 h-4" />
                      ) : (
                        <div className="w-2 h-2 bg-gray-400 rounded-full" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {step.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        );

      case 3:
        return (
          <div className="max-w-4xl mx-auto">
            <Card className="p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  🎉 Agent Successfully Deployed!
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Your AI agent is now live and ready to engage with your customers
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {previewUrl && (
                  <Card className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Globe className="w-6 h-6 text-primary-600" />
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        Live Preview
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      Test your agent before embedding it on your website
                    </p>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={previewUrl}
                        readOnly
                        className="flex-1 p-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(previewUrl, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                )}

                {embedCode && (
                  <Card className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Code className="w-6 h-6 text-primary-600" />
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        Embed Code
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      Add this code to your website to display the floating agent
                    </p>
                    <div className="relative">
                      <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-xs font-mono overflow-x-auto">
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
                  </Card>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Button
                  onClick={() => navigate('/dashboard')}
                  className="px-6"
                >
                  Go to Dashboard
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setCurrentStep(1);
                    setFormData({
                      name: '',
                      brandName: '',
                      websiteName: '',
                      agentType: 'customer-support',
                      roleDescription: '',
                      services: [''],
                      faqs: [{ question: '', answer: '' }],
                      primaryColor: '#3b82f6',
                      tone: 'professional',
                      avatarUrl: '',
                      subdomain: '',
                      officeHours: '',
                      knowledge: '',
                    });
                    setServiceKeys(['service-0']);
                    setFaqKeys(['faq-0']);
                    setAgentId(null);
                    setEmbedCode('');
                    setPreviewUrl('');
                  }}
                  className="px-6"
                >
                  Create Another Agent
                </Button>
              </div>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Create Your AI Agent
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Build an intelligent AI assistant for your business in minutes. 
              No coding required.
            </p>
          </motion.div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${currentStep >= step 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }
                `}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`
                    w-12 h-0.5 mx-2
                    ${currentStep > step 
                      ? 'bg-primary-600' 
                      : 'bg-gray-200 dark:bg-gray-700'
                    }
                  `} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {renderStepContent()}
        </motion.div>
      </div>
    </div>
  );
};