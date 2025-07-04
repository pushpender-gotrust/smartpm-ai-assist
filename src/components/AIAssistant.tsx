
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, Lightbulb, AlertTriangle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AIMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

export const AIAssistant = () => {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your AI Project Management Assistant. I can help you break down features into tasks, analyze risks, and manage your projects. What would you like to work on today?',
      timestamp: new Date(),
      suggestions: [
        'Break down a feature into tasks',
        'Analyze project risks',
        'Generate task estimates',
        'Import Excel file'
      ]
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: AIMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'I understand you want to work on that feature. Let me break it down into manageable tasks with risk assessments and time estimates. This would typically involve connecting to Gemini 2.0 API for intelligent analysis.',
        timestamp: new Date(),
        suggestions: [
          'Create detailed task breakdown',
          'Assess technical risks',
          'Generate timeline estimates'
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

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-lg">AI Assistant</CardTitle>
        </div>
        <CardDescription>
          Powered by Gemini 2.0 for intelligent project management
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
                    <span className="text-sm text-gray-600">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Textarea
              placeholder="Describe a feature or ask for help..."
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
