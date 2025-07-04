
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectList } from "@/components/ProjectList";
import { TaskTable } from "@/components/TaskTable";
import { AIAssistant } from "@/components/AIAssistant";
import { CreateProjectDialog } from "@/components/CreateProjectDialog";
import { Plus, Upload, Download, Bot } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTasks } from "@/hooks/useTasks";
import { useProjects } from "@/hooks/useProjects";
import * as XLSX from 'xlsx';

const Dashboard = () => {
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const { toast } = useToast();
  const { tasks } = useTasks(activeProject);
  const { projects } = useProjects();

  const handleImportFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.xls,.csv';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            
            console.log('Imported data:', jsonData);
            toast({
              title: "File Imported",
              description: `Successfully imported ${jsonData.length} rows from ${file.name}`,
            });
          } catch (error) {
            toast({
              title: "Import Error",
              description: "Failed to import file. Please check the format.",
              variant: "destructive",
            });
          }
        };
        reader.readAsArrayBuffer(file);
      }
    };
    input.click();
  };

  const handleExportProject = () => {
    if (tasks.length === 0) {
      toast({
        title: "No Data to Export",
        description: "Please create some tasks first.",
        variant: "destructive",
      });
      return;
    }

    const exportData = tasks.map(task => ({
      'Task Name': task.task_name,
      'Description': task.description || '',
      'Status': task.status,
      'Priority': task.priority,
      'Risk Level': task.risk_level,
      'Assigned To': task.assigned_to || '',
      'Start Date': task.start_date || '',
      'End Date': task.end_date || '',
      'Estimated Hours': task.estimated_hours || 0,
      'Confidence Score': task.confidence_score || 0,
      'Tags': task.tags?.join(', ') || '',
      'Notes': task.notes || ''
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Tasks');
    
    const projectName = activeProject 
      ? projects.find(p => p.id === activeProject)?.name || 'Project'
      : 'All Projects';
    
    XLSX.writeFile(wb, `${projectName}_Tasks_${new Date().toISOString().split('T')[0]}.xlsx`);
    
    toast({
      title: "Export Successful",
      description: `Exported ${tasks.length} tasks to Excel file`,
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
            <CreateProjectDialog />
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
