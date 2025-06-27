import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bot, 
  Palette, 
  MessageSquare, 
  Clock, 
  Upload,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Save,
  Rocket,
  Code,
  Github,
  CheckCircle,
  ExternalLink,
  Zap,
  Copy,
  AlertCircle,
  Globe
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Card } from '../components/ui/Card';
import { useAuthStore } from '../store/authStore';
import { generateAgentCode, uploadToGitHub, deployToVercel, triggerDeploymentWithFile } from '../lib/deployment';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface DeploymentStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
  loading: boolean;
  error?: string;
}

export const Create: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [agentId, setAgentId] = useState<string | null>(null);
  const [generatedFiles, setGeneratedFiles] = useState<{ path: string; content: string }[] | null>(null);
  const [githubRepo, setGithubRepo] = useState<string | null>(null);
  const [vercelUrl, setVercelUrl] = useState<string | null>(null);
  const [embedCode, setEmbedCode] = useState<string | null>(null);
  const [showManualTrigger, setShowManualTrigger] = useState(false);
  const [triggerLoading, setTriggerLoading] = useState(false);
  const [showScriptModal, setShowScriptModal] = useState(false);

  const [deploymentSteps, setDeploymentSteps] = useState<DeploymentStep[]>([
    {
      id: 'generate',
      title: 'Generate Code',
      description: 'Create AI agent files with your configuration',
      icon: <Code className="w-5 h-5" />,
      completed: false,
      loading: false,
    },
    {
      id: 'github',
      title: 'Upload to GitHub',
      description: 'Create private repository and push code',
      icon: <Github className="w-5 h-5" />,
      completed: false,
      loading: false,
    },
    {
      id: 'deploy',
      title: 'Deploy to Vercel',
      description: 'Host your agent and make it live',
      icon: <Rocket className="w-5 h-5" />,
      completed: false,
      loading: false,
    },
  ]);

  const [formData, setFormData] = useState({
    // Basic Info
    name: '',
    brandName: '',
    websiteName: '',
    agentName: '',
    agentType: 'customer-support',
    roleDescription: '',
    
    // Services & Knowledge
    services: [''],
    faqs: [{ question: '', answer: '' }],
    knowledge: '',
    
    // Customization
    primaryColor: '#3b82f6',
    tone: 'professional',
    avatar: null as File | null,
    avatarUrl: '',
    
    // Settings
    subdomain: '',
    officeHours: '',
  });

  const agentTypes = [
    { id: 'portfolio', label: 'Portfolio Assistant', description: 'Showcase your work and skills' },
    { id: 'customer-support', label: 'Customer Support Bot', description: 'Help customers with common questions' },
    { id: 'lead-generator', label: 'Lead Generator', description: 'Capture and qualify potential customers' },
    { id: 'appointment', label: 'Appointment Assistant', description: 'Schedule meetings and bookings' },
    { id: 'custom', label: 'Custom Q&A Agent', description: 'General purpose question answering' },
  ];

  const tones = [
    { id: 'friendly', label: 'Friendly', description: 'Warm and approachable' },
    { id: 'professional', label: 'Professional', description: 'Business-focused and formal' },
    { id: 'witty', label: 'Witty', description: 'Fun and engaging' },
    { id: 'minimal', label: 'Minimal', description: 'Concise and direct' },
  ];

  const steps = [
    {
      title: 'Basic Information',
      description: 'Tell us about your business and agent',
      icon: <Bot className="w-6 h-6" />
    },
    {
      title: 'Services & Knowledge',
      description: 'Define what your agent knows',
      icon: <MessageSquare className="w-6 h-6" />
    },
    {
      title: 'Customization',
      description: 'Make your agent unique',
      icon: <Palette className="w-6 h-6" />
    },
    {
      title: 'Deploy Your Agent',
      description: 'Generate, upload, and host your agent',
      icon: <Rocket className="w-6 h-6" />
    }
  ];

  const updateDeploymentStep = (stepId: string, updates: Partial<DeploymentStep>) => {
    setDeploymentSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, ...updates } : step
    ));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleServiceChange = (index: number, value: string) => {
    const newServices = [...formData.services];
    newServices[index] = value;
    setFormData(prev => ({ ...prev, services: newServices }));
  };

  const addService = () => {
    setFormData(prev => ({ ...prev, services: [...prev.services, ''] }));
  };

  const removeService = (index: number) => {
    if (formData.services.length > 1) {
      const newServices = formData.services.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, services: newServices }));
    }
  };

  const handleFAQChange = (index: number, field: 'question' | 'answer', value: string) => {
    const newFAQs = [...formData.faqs];
    newFAQs[index][field] = value;
    setFormData(prev => ({ ...prev, faqs: newFAQs }));
  };

  const addFAQ = () => {
    setFormData(prev => ({ 
      ...prev, 
      faqs: [...prev.faqs, { question: '', answer: '' }] 
    }));
  };

  const removeFAQ = (index: number) => {
    if (formData.faqs.length > 1) {
      const newFAQs = formData.faqs.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, faqs: newFAQs }));
    }
  };

  const generateSubdomain = () => {
    const subdomain = formData.brandName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .trim('-') + '-' + Math.random().toString(36).substr(2, 4);
    setFormData(prev => ({ ...prev, subdomain }));
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB limit
        toast.error('Avatar must be less than 1MB');
        return;
      }

      try {
        // Create a unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${user?.id}-${Date.now()}.${fileExt}`;
        
        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from('avatars')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) {
          console.error('Storage upload error:', error);
          throw error;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);

        setFormData(prev => ({ 
          ...prev, 
          avatar: file,
          avatarUrl: publicUrl
        }));
        
        toast.success('Avatar uploaded successfully!');
      } catch (error: any) {
        console.error('Avatar upload error:', error);
        toast.error('Failed to upload avatar: ' + (error.message || 'Unknown error'));
      }
    }
  };

  const suggestFAQs = async () => {
    const suggestedFAQs = [
      { question: 'What are your business hours?', answer: formData.officeHours || 'Please contact us for our current business hours.' },
      { question: 'How can I contact support?', answer: 'You can reach our support team through this chat or visit our website.' },
      { question: 'What services do you offer?', answer: formData.services.filter(s => s).join(', ') || 'Please ask about our specific services.' },
      { question: 'Do you offer refunds?', answer: 'Please contact us directly to discuss our refund policy.' },
      { question: 'How long does delivery take?', answer: 'Delivery times vary depending on the service. Please contact us for specific timelines.' },
    ];
    
    setFormData(prev => ({ ...prev, faqs: suggestedFAQs }));
    toast.success('FAQ suggestions added!');
  };

  const rewriteDescription = async (style: 'fun' | 'professional' | 'casual') => {
    const styles = {
      fun: 'A super friendly and enthusiastic AI assistant that loves helping customers! 🎉',
      professional: 'A dedicated AI assistant committed to providing exceptional customer service and support.',
      casual: 'Your helpful AI buddy that\'s here to answer questions and make your day easier.'
    };
    
    setFormData(prev => ({ ...prev, roleDescription: styles[style] }));
    toast.success(`Description rewritten in ${style} style!`);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Step 1: Generate Code
  const handleGenerateCode = async () => {
    if (!user) {
      toast.error('Please log in to generate your agent');
      return;
    }

    // Validate required fields
    if (!formData.agentName || !formData.brandName || !formData.roleDescription) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!formData.subdomain) {
      generateSubdomain();
    }

    updateDeploymentStep('generate', { loading: true, error: undefined });
    
    try {
      toast.loading('Generating your AI agent code...', { id: 'generate' });

      const deploymentConfig = {
        name: formData.agentName,
        brandName: formData.brandName,
        websiteName: formData.websiteName,
        agentType: formData.agentType,
        roleDescription: formData.roleDescription,
        services: formData.services.filter(s => s.trim()),
        faqs: formData.faqs.filter(f => f.question && f.answer),
        primaryColor: formData.primaryColor,
        tone: formData.tone,
        avatarUrl: formData.avatarUrl,
        subdomain: formData.subdomain,
        officeHours: formData.officeHours,
        knowledge: formData.knowledge,
        userId: user.id,
      };

      const result = await generateAgentCode(deploymentConfig);

      if (result.success) {
        setAgentId(result.agentId!);
        setGeneratedFiles(result.files!);
        updateDeploymentStep('generate', { loading: false, completed: true });
        toast.success('🎉 Agent code generated successfully!', { id: 'generate' });
      } else {
        throw new Error(result.error || 'Code generation failed');
      }
    } catch (error: any) {
      updateDeploymentStep('generate', { loading: false, error: error.message });
      toast.error('Code generation failed: ' + error.message, { id: 'generate' });
    }
  };

  // Step 2: Upload to GitHub
  const handleUploadToGitHub = async () => {
    if (!agentId) {
      toast.error('Please generate code first');
      return;
    }

    updateDeploymentStep('github', { loading: true, error: undefined });
    
    try {
      toast.loading('Uploading to GitHub...', { id: 'github' });

      const result = await uploadToGitHub(agentId);

      if (result.success) {
        setGithubRepo(result.githubRepo!);
        updateDeploymentStep('github', { loading: false, completed: true });
        toast.success('🎉 Code uploaded to GitHub successfully!', { id: 'github' });
      } else {
        throw new Error(result.error || 'GitHub upload failed');
      }
    } catch (error: any) {
      updateDeploymentStep('github', { loading: false, error: error.message });
      toast.error('GitHub upload failed: ' + error.message, { id: 'github' });
    }
  };

  // Step 3: Deploy to Vercel
  const handleDeployToVercel = async () => {
    if (!agentId || !githubRepo) {
      toast.error('Please upload to GitHub first');
      return;
    }

    updateDeploymentStep('deploy', { loading: true, error: undefined });
    setShowManualTrigger(false);
    
    try {
      toast.loading('Deploying to Vercel...', { id: 'deploy' });

      const result = await deployToVercel(agentId);

      if (result.success) {
        setVercelUrl(result.vercelUrl!);
        setEmbedCode(result.embedCode!);
        updateDeploymentStep('deploy', { loading: false, completed: true });
        toast.success('🎉 Agent deployed successfully!', { id: 'deploy' });
      } else {
        // Show manual trigger option after a delay
        setTimeout(() => {
          setShowManualTrigger(true);
        }, 5000); // Show trigger button after 5 seconds
        
        setVercelUrl(result.vercelUrl || null);
        updateDeploymentStep('deploy', { loading: false, error: result.error });
        toast.error('Deployment pending: ' + (result.error || 'Manual trigger may be needed'), { id: 'deploy' });
      }
    } catch (error: any) {
      setTimeout(() => {
        setShowManualTrigger(true);
      }, 5000);
      updateDeploymentStep('deploy', { loading: false, error: error.message });
      toast.error('Vercel deployment failed: ' + error.message, { id: 'deploy' });
    }
  };

  // Manual trigger deployment
  const handleManualTrigger = async () => {
    if (!agentId) {
      toast.error('Agent ID not found');
      return;
    }

    setTriggerLoading(true);
    
    try {
      toast.loading('Triggering deployment...', { id: 'trigger' });

      const result = await triggerDeploymentWithFile(agentId);

      if (result.success) {
        toast.success('🚀 Deployment triggered! Checking status...', { id: 'trigger' });
        setShowManualTrigger(false);
        
        // Wait and check for deployment completion
        setTimeout(async () => {
          try {
            // Refresh agent data to get updated Vercel URL
            const { data: agent } = await supabase
              .from('agents')
              .select('vercel_url')
              .eq('id', agentId)
              .single();

            if (agent?.vercel_url && !agent.vercel_url.includes('dashboard')) {
              setVercelUrl(agent.vercel_url);
              setEmbedCode(`<!-- ${formData.brandName} AI Assistant - Generated by PLUDO.AI -->
<script src="${agent.vercel_url}/float.js" defer></script>`);
              updateDeploymentStep('deploy', { loading: false, completed: true, error: undefined });
              toast.success('🎉 Deployment completed successfully!');
            } else {
              // Still not ready, show the script modal anyway
              setShowScriptModal(true);
              toast.success('🎉 Agent is being deployed! You can get your script now.');
            }
          } catch (error) {
            console.error('Error checking deployment status:', error);
            setShowScriptModal(true);
          }
        }, 30000); // Check after 30 seconds
        
      } else {
        throw new Error(result.error || 'Failed to trigger deployment');
      }
    } catch (error: any) {
      toast.error('Failed to trigger deployment: ' + error.message, { id: 'trigger' });
    } finally {
      setTriggerLoading(false);
    }
  };

  // Copy embed code to clipboard
  const copyEmbedCode = () => {
    if (embedCode) {
      navigator.clipboard.writeText(embedCode);
      toast.success('Embed code copied to clipboard!');
    }
  };

  // Show script modal
  const handleGetYourAgent = () => {
    setShowScriptModal(true);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Your Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="John Doe"
                required
              />
              <Input
                label="Brand Name"
                name="brandName"
                value={formData.brandName}
                onChange={handleInputChange}
                placeholder="Acme Corp"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Website Name"
                name="websiteName"
                value={formData.websiteName}
                onChange={handleInputChange}
                placeholder="acme.com"
              />
              <Input
                label="AI Agent Name"
                name="agentName"
                value={formData.agentName}
                onChange={handleInputChange}
                placeholder="Alex"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Agent Type
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {agentTypes.map((type) => (
                  <label
                    key={type.id}
                    className={`
                      cursor-pointer p-4 rounded-lg border-2 transition-all
                      ${formData.agentType === type.id
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="agentType"
                      value={type.id}
                      checked={formData.agentType === type.id}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className="font-medium text-gray-900 dark:text-white">
                      {type.label}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {type.description}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Agent Role Description
                </label>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => rewriteDescription('professional')}
                    className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded hover:bg-primary-200 transition-colors"
                  >
                    Pro
                  </button>
                  <button
                    type="button"
                    onClick={() => rewriteDescription('fun')}
                    className="text-xs px-2 py-1 bg-secondary-100 text-secondary-700 rounded hover:bg-secondary-200 transition-colors"
                  >
                    Fun
                  </button>
                  <button
                    type="button"
                    onClick={() => rewriteDescription('casual')}
                    className="text-xs px-2 py-1 bg-accent-100 text-accent-700 rounded hover:bg-accent-200 transition-colors"
                  >
                    Casual
                  </button>
                </div>
              </div>
              <Textarea
                name="roleDescription"
                value={formData.roleDescription}
                onChange={handleInputChange}
                placeholder="Describe what your AI agent does and how it helps customers..."
                rows={4}
                required
              />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Services Offered
              </label>
              {formData.services.map((service, index) => (
                <div key={index} className="flex space-x-2 mb-2">
                  <Input
                    placeholder="Enter a service..."
                    value={service}
                    onChange={(e) => handleServiceChange(index, e.target.value)}
                    className="flex-1"
                  />
                  {formData.services.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removeService(index)}
                      className="px-3"
                    >
                      ×
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addService}
                className="mt-2"
              >
                Add Service
              </Button>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Frequently Asked Questions
                </label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={suggestFAQs}
                  className="text-sm"
                >
                  <Sparkles className="w-4 h-4 mr-1" />
                  Suggest FAQs
                </Button>
              </div>
              
              {formData.faqs.map((faq, index) => (
                <Card key={index} className="p-4 mb-4">
                  <div className="space-y-3">
                    <Input
                      placeholder="Question..."
                      value={faq.question}
                      onChange={(e) => handleFAQChange(index, 'question', e.target.value)}
                    />
                    <Textarea
                      placeholder="Answer..."
                      value={faq.answer}
                      onChange={(e) => handleFAQChange(index, 'answer', e.target.value)}
                      rows={2}
                    />
                    {formData.faqs.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => removeFAQ(index)}
                        className="text-sm"
                      >
                        Remove FAQ
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
              
              <Button
                type="button"
                variant="outline"
                onClick={addFAQ}
              >
                Add FAQ
              </Button>
            </div>

            <Textarea
              label="Additional Knowledge"
              name="knowledge"
              value={formData.knowledge}
              onChange={handleInputChange}
              placeholder="Add any additional information your agent should know about your business..."
              rows={4}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Primary Brand Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    name="primaryColor"
                    value={formData.primaryColor}
                    onChange={handleInputChange}
                    className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
                  />
                  <Input
                    value={formData.primaryColor}
                    onChange={handleInputChange}
                    name="primaryColor"
                    placeholder="#3b82f6"
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  AI Tone
                </label>
                <div className="space-y-2">
                  {tones.map((tone) => (
                    <label
                      key={tone.id}
                      className={`
                        cursor-pointer flex items-center p-3 rounded-lg border transition-all
                        ${formData.tone === tone.id
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                        }
                      `}
                    >
                      <input
                        type="radio"
                        name="tone"
                        value={tone.id}
                        checked={formData.tone === tone.id}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {tone.label}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {tone.description}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Agent Avatar (Optional)
              </label>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center overflow-hidden">
                  {formData.avatarUrl ? (
                    <img
                      src={formData.avatarUrl}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : formData.avatar ? (
                    <img
                      src={URL.createObjectURL(formData.avatar)}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Bot className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                    id="avatar-upload"
                  />
                  <label htmlFor="avatar-upload">
                    <Button
                      type="button"
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() => document.getElementById('avatar-upload')?.click()}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Avatar
                    </Button>
                  </label>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    PNG or JPG, max 1MB
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Custom Subdomain"
                  name="subdomain"
                  value={formData.subdomain}
                  onChange={handleInputChange}
                  placeholder="my-awesome-agent"
                />
                <div className="flex items-center justify-between mt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Your agent will be available at: {formData.subdomain}.vercel.app
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={generateSubdomain}
                    className="text-sm"
                  >
                    Generate
                  </Button>
                </div>
              </div>

              <Input
                label="Office Hours (Optional)"
                name="officeHours"
                value={formData.officeHours}
                onChange={handleInputChange}
                placeholder="9:00 AM - 5:00 PM EST"
                icon={<Clock className="w-5 h-5 text-gray-400" />}
              />
            </div>

            {/* Deployment Steps */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Deploy Your Agent
              </h3>
              
              <div className="space-y-4">
                {deploymentSteps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`
                      flex items-center justify-between p-4 rounded-lg border-2 transition-all
                      ${step.completed 
                        ? 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800' 
                        : step.loading
                        ? 'border-primary-200 bg-primary-50 dark:bg-primary-900/20 dark:border-primary-800'
                        : 'border-gray-200 dark:border-gray-700'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center
                        ${step.completed 
                          ? 'bg-green-500 text-white' 
                          : step.loading
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                        }
                      `}>
                        {step.completed ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : step.loading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        ) : (
                          step.icon
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {step.title}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {step.description}
                        </p>
                        {step.error && (
                          <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                            Error: {step.error}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {step.id === 'generate' && (
                        <Button
                          onClick={handleGenerateCode}
                          disabled={step.completed || step.loading}
                          loading={step.loading}
                          size="sm"
                        >
                          Generate
                        </Button>
                      )}
                      
                      {step.id === 'github' && (
                        <Button
                          onClick={handleUploadToGitHub}
                          disabled={!deploymentSteps[0].completed || step.completed || step.loading}
                          loading={step.loading}
                          size="sm"
                        >
                          Upload
                        </Button>
                      )}
                      
                      {step.id === 'deploy' && (
                        <Button
                          onClick={handleDeployToVercel}
                          disabled={!deploymentSteps[1].completed || step.completed || step.loading}
                          loading={step.loading}
                          size="sm"
                        >
                          Deploy
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Manual Trigger Section */}
              {showManualTrigger && !deploymentSteps[2].completed && (
                <div className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg">
                  <div className="text-center">
                    <h4 className="font-medium text-primary-800 dark:text-primary-200 mb-2">
                      🚀 Ready to Launch Your Agent?
                    </h4>
                    <p className="text-sm text-primary-700 dark:text-primary-300 mb-4">
                      Your agent is ready! Click below to get your embed script and make it live.
                    </p>
                    <Button
                      onClick={handleGetYourAgent}
                      className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white"
                      size="lg"
                    >
                      <Globe className="w-5 h-5 mr-2" />
                      Get Your Agent
                    </Button>
                  </div>
                </div>
              )}

              {/* Success State */}
              {deploymentSteps.every(step => step.completed) && embedCode && (
                <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <h4 className="font-medium text-green-800 dark:text-green-200 mb-4">
                    🎉 Your AI Agent is Live!
                  </h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-green-700 dark:text-green-300">Live URL:</span>
                      <a 
                        href={vercelUrl!} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-500 flex items-center text-sm"
                      >
                        {vercelUrl} <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-green-700 dark:text-green-300 mb-2">
                        Embed Code (Copy & Paste to Your Website):
                      </label>
                      <div className="relative">
                        <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-xs font-mono overflow-x-auto text-gray-800 dark:text-gray-200">
                          {embedCode}
                        </pre>
                        <Button
                          onClick={copyEmbedCode}
                          variant="outline"
                          size="sm"
                          className="absolute top-2 right-2"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Button
                      onClick={() => navigate('/dashboard')}
                      className="w-full"
                    >
                      Go to Dashboard
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Create Your AI Agent
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Build a custom AI assistant tailored to your business needs
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex flex-col items-center flex-1 ${
                  index < steps.length - 1 ? 'relative' : ''
                }`}
              >
                {index < steps.length - 1 && (
                  <div
                    className={`absolute top-6 left-1/2 w-full h-0.5 ${
                      index < currentStep ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                    style={{ transform: 'translateX(50%)' }}
                  />
                )}
                <div
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center relative z-10 transition-all
                    ${index <= currentStep
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                    }
                  `}
                >
                  {step.icon}
                </div>
                <div className="text-center mt-2">
                  <div className={`text-sm font-medium ${
                    index <= currentStep ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 hidden md:block">
                    {step.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <Card className="p-8">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {steps[currentStep].title}
            </h2>
            {renderStepContent()}
          </motion.div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>

            <div className="flex space-x-3">
              <Button
                variant="ghost"
                className="flex items-center"
              >
                <Save className="w-4 h-4 mr-1" />
                Save Draft
              </Button>

              {currentStep < steps.length - 1 && (
                <Button
                  onClick={nextStep}
                  className="flex items-center"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Script Modal */}
        {showScriptModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  🎉 Your AI Agent is Ready!
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Copy the embed code below and paste it into your website
                </p>
              </div>

              <div className="space-y-6">
                {vercelUrl && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Live Preview:
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={vercelUrl}
                        readOnly
                        className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      />
                      <Button
                        onClick={() => window.open(vercelUrl, '_blank')}
                        variant="outline"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Embed Code:
                  </label>
                  <div className="relative">
                    <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm font-mono overflow-x-auto text-gray-800 dark:text-gray-200 border">
{embedCode || `<!-- ${formData.brandName} AI Assistant - Generated by PLUDO.AI -->
<script src="${vercelUrl || 'https://your-agent.vercel.app'}/float.js" defer></script>`}
                    </pre>
                    <Button
                      onClick={() => {
                        const code = embedCode || `<!-- ${formData.brandName} AI Assistant - Generated by PLUDO.AI -->
<script src="${vercelUrl || 'https://your-agent.vercel.app'}/float.js" defer></script>`;
                        navigator.clipboard.writeText(code);
                        toast.success('Embed code copied to clipboard!');
                      }}
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-2">
                    How to add to your website:
                  </h4>
                  <ol className="text-sm text-blue-800 dark:text-blue-300 space-y-1 list-decimal list-inside">
                    <li>Copy the embed code above</li>
                    <li>Paste it into your website's HTML, before the closing &lt;/body&gt; tag</li>
                    <li>Your AI agent will appear as a floating chat button</li>
                    <li>Test it to ensure it's working correctly</li>
                  </ol>
                </div>
              </div>

              <div className="flex space-x-3 mt-8">
                <Button
                  onClick={() => setShowScriptModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Close
                </Button>
                <Button
                  onClick={() => navigate('/dashboard')}
                  className="flex-1"
                >
                  Go to Dashboard
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};