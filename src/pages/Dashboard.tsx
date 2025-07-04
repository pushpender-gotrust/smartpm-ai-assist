
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectList } from "@/components/ProjectList";
import { TaskTable } from "@/components/TaskTable";
import { AIAssistant } from "@/components/AIAssistant";
import { FileUpload } from "@/components/FileUpload";
import { Plus, Upload, Download, Bot } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const { toast } = useToast();

  const handleCreateProject = () => {
    toast({
      title: "Create Project",
      description: "Project creation feature coming soon!",
    });
  };

  const handleImportFile = () => {
    toast({
      title: "Import File",
      description: "File import feature coming soon!",
    });
  };

  const handleExportProject = () => {
    toast({
      title: "Export Project",
      description: "Project export feature coming soon!",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">SmartPM</h1>
            <p className="text-muted-foreground">AI-Powered Project Management Assistant</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleCreateProject} className="gap-2">
              <Plus className="h-4 w-4" />
              New Project
            </Button>
            <Button variant="outline" onClick={handleImportFile} className="gap-2">
              <Upload className="h-4 w-4" />
              Import Excel
            </Button>
            <Button variant="outline" onClick={handleExportProject} className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowAIPanel(!showAIPanel)}
              className="gap-2"
            >
              <Bot className="h-4 w-4" />
              AI Assistant
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className={`${showAIPanel ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
            <Tabs defaultValue="projects" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
              </TabsList>
              
              <TabsContent value="projects" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Projects</CardTitle>
                    <CardDescription>
                      Manage your projects and track progress
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ProjectList onSelectProject={setActiveProject} />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="tasks" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Task Management</CardTitle>
                    <CardDescription>
                      View and manage tasks across all projects
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TaskTable projectId={activeProject} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {showAIPanel && (
            <div className="lg:col-span-1">
              <AIAssistant />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
