
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, Lightbulb, AlertTriangle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTasks } from "@/hooks/useTasks";
import { useProjects } from "@/hooks/useProjects";

interface AIMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  generatedTasks?: Array<{
    task_name: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    risk_level: 'low' | 'medium' | 'high';
    estimated_hours: number;
    confidence_score: number;
  }>;
}

export const AIAssistant = () => {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your AI Project Management Assistant. I can help you break down features into tasks, analyze risks, and manage your projects. What would you like to work on today?',
      timestamp: new Date(),
      suggestions: [
        'Break down "User Authentication System" into tasks',
        'Analyze project risks',
        'Generate task estimates for e-commerce features',
        'Create tasks for mobile app development'
      ]
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { createTask } = useTasks();
  const { projects } = useProjects();

  const generateTasksFromFeature = (featureDescription: string) => {
    // Simulated AI task generation - in production, this would call Gemini API
    const taskTemplates = {
      'authentication': [
        { task_name: 'Design authentication database schema', description: 'Create user tables and relationships', priority: 'high' as const, risk_level: 'medium' as const, estimated_hours: 8, confidence_score: 0.9 },
        { task_name: 'Implement user registration', description: 'Create signup functionality with validation', priority: 'high' as const, risk_level: 'medium' as const, estimated_hours: 12, confidence_score: 0.85 },
        { task_name: 'Implement user login', description: 'Create login functionality with session management', priority: 'high' as const, risk_level: 'medium' as const, estimated_hours: 10, confidence_score: 0.88 },
        { task_name: 'Add password reset functionality', description: 'Email-based password reset system', priority: 'medium' as const, risk_level: 'high' as const, estimated_hours: 16, confidence_score: 0.75 },
        { task_name: 'Implement JWT token management', description: 'Secure token generation and validation', priority: 'high' as const, risk_level: 'high' as const, estimated_hours: 14, confidence_score: 0.80 }
      ],
      'ecommerce': [
        { task_name: 'Create product catalog system', description: 'Database and API for product management', priority: 'high' as const, risk_level: 'medium' as const, estimated_hours: 20, confidence_score: 0.85 },
        { task_name: 'Implement shopping cart', description: 'Cart functionality with persistence', priority: 'high' as const, risk_level: 'low' as const, estimated_hours: 16, confidence_score: 0.90 },
        { task_name: 'Payment integration', description: 'Stripe/PayPal payment processing', priority: 'high' as const, risk_level: 'high' as const, estimated_hours: 24, confidence_score: 0.70 },
        { task_name: 'Order management system', description: 'Order tracking and status updates', priority: 'medium' as const, risk_level: 'medium' as const, estimated_hours: 18, confidence_score: 0.80 }
      ],
      'mobile': [
        { task_name: 'Set up React Native project', description: 'Initialize mobile app structure', priority: 'high' as const, risk_level: 'low' as const, estimated_hours: 6, confidence_score: 0.95 },
        { task_name: 'Design mobile UI components', description: 'Create reusable mobile components', priority: 'medium' as const, risk_level: 'medium' as const, estimated_hours: 20, confidence_score: 0.82 },
        { task_name: 'Implement navigation system', description: 'Set up app navigation and routing', priority: 'high' as const, risk_level: 'medium' as const, estimated_hours: 12, confidence_score: 0.85 },
        { task_name: 'Add push notifications', description: 'Firebase push notification integration', priority: 'medium' as const, risk_level: 'high' as const, estimated_hours: 16, confidence_score: 0.75 }
      ]
    };

    const lowerInput = featureDescription.toLowerCase();
    if (lowerInput.includes('auth') || lowerInput.includes('login') || lowerInput.includes('user')) {
      return taskTemplates.authentication;
    } else if (lowerInput.includes('ecommerce') || lowerInput.includes('shop') || lowerInput.includes('commerce')) {
      return taskTemplates.ecommerce;
    } else if (lowerInput.includes('mobile') || lowerInput.includes('app')) {
      return taskTemplates.mobile;
    } else {
      // Default tasks for generic features
      return [
        { task_name: `Research ${featureDescription}`, description: `Gather requirements and technical specifications for ${featureDescription}`, priority: 'medium' as const, risk_level: 'low' as const, estimated_hours: 4, confidence_score: 0.85 },
        { task_name: `Design ${featureDescription}`, description: `Create design and architecture for ${featureDescription}`, priority: 'high' as const, risk_level: 'medium' as const, estimated_hours: 8, confidence_score: 0.80 },
        { task_name: `Implement ${featureDescription}`, description: `Code the core functionality for ${featureDescription}`, priority: 'high' as const, risk_level: 'medium' as const, estimated_hours: 16, confidence_score: 0.75 },
        { task_name: `Test ${featureDescription}`, description: `Write and execute tests for ${featureDescription}`, priority: 'medium' as const, risk_level: 'low' as const, estimated_hours: 6, confidence_score: 0.90 }
      ];
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText("");
    setIsLoading(true);

    // Simulate AI processing
    setTimeout(() => {
      const generatedTasks = generateTasksFromFeature(currentInput);
      
      const aiResponse: AIMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `I've analyzed your request: "${currentInput}" and generated ${generatedTasks.length} tasks with risk assessments and confidence scores. You can review and create these tasks in your project.`,
        timestamp: new Date(),
        generatedTasks,
        suggestions: [
          'Create all suggested tasks',
          'Modify task estimates',
          'Analyze more features',
          'Export tasks to Excel'
        ]
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputText(suggestion);
    toast({
      title: "Suggestion Selected",
      description: `You can now modify: "${suggestion}"`,
    });
  };

  const handleCreateTasks = (tasks: AIMessage['generatedTasks'], projectId?: string) => {
    if (!tasks || tasks.length === 0) return;
    
    const selectedProjectId = projectId || (projects.length > 0 ? projects[0].id : null);
    
    if (!selectedProjectId) {
      toast({
        title: "No Project Selected",
        description: "Please create a project first to add tasks.",
        variant: "destructive",
      });
      return;
    }

    tasks.forEach((task, index) => {
      setTimeout(() => {
        createTask.mutate({
          project_id: selectedProjectId,
          task_name: task.task_name,
          description: task.description,
          status: 'todo',
          priority: task.priority,
          risk_level: task.risk_level,
          estimated_hours: task.estimated_hours,
          confidence_score: task.confidence_score,
          assigned_to: null,
          start_date: null,
          end_date: null,
          dependencies: null,
          tags: null,
          notes: null,
        });
      }, index * 200); // Stagger the requests
    });

    toast({
      title: "Tasks Created",
      description: `Created ${tasks.length} tasks successfully!`,
    });
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-lg">AI Assistant</CardTitle>
        </div>
        <CardDescription>
          Intelligent project management with task generation and risk analysis
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-6">
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg p-3 ${
                  message.type === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="text-sm">{message.content}</p>
                  
                  {message.generatedTasks && (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs font-semibold">Generated Tasks:</p>
                      <div className="space-y-1">
                        {message.generatedTasks.map((task, index) => (
                          <div key={index} className="text-xs bg-white/10 rounded p-2">
                            <div className="font-medium">{task.task_name}</div>
                            <div className="text-xs opacity-75">{task.description}</div>
                            <div className="flex gap-1 mt-1">
                              <Badge variant="outline" className="text-xs">{task.priority}</Badge>
                              <Badge variant="outline" className="text-xs">{task.risk_level} risk</Badge>
                              <Badge variant="outline" className="text-xs">{task.estimated_hours}h</Badge>
                              <Badge variant="outline" className="text-xs">{Math.round(task.confidence_score * 100)}%</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2"
                        onClick={() => handleCreateTasks(message.generatedTasks)}
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Create All Tasks
                      </Button>
                    </div>
                  )}
                  
                  {message.suggestions && (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs opacity-75">Quick actions:</p>
                      <div className="flex flex-wrap gap-1">
                        {message.suggestions.map((suggestion, index) => (
                          <Badge 
                            key={index}
                            variant="outline" 
                            className="cursor-pointer hover:bg-white/20 text-xs"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            {suggestion}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="text-sm text-gray-600">AI is analyzing...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Textarea
              placeholder="Describe a feature to break down into tasks..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[60px] resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button 
              onClick={handleSendMessage}
              disabled={isLoading || !inputText.trim()}
              size="icon"
              className="h-[60px] w-12"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
