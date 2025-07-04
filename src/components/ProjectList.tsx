
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, AlertTriangle, Edit, Trash2 } from "lucide-react";
import { useProjects } from "@/hooks/useProjects";
import { useTasks } from "@/hooks/useTasks";
import { CreateProjectDialog } from "./CreateProjectDialog";

interface ProjectListProps {
  onSelectProject: (projectId: string) => void;
}

export const ProjectList = ({ onSelectProject }: ProjectListProps) => {
  const { projects, isLoading, deleteProject } = useProjects();
  const { tasks } = useTasks();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'on-hold': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTaskCount = (projectId: string) => {
    return tasks.filter(task => task.project_id === projectId).length;
  };

  const handleDeleteProject = (projectId: string, projectName: string) => {
    if (window.confirm(`Are you sure you want to delete "${projectName}"? This will also delete all associated tasks.`)) {
      deleteProject.mutate(projectId);
    }
  };

  if (isLoading) {
    return <div>Loading projects...</div>;
  }

  return (
    <div className="space-y-4">
      {projects.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">No projects yet. Create your first project!</p>
          <CreateProjectDialog />
        </div>
      ) : (
        projects.map((project) => (
          <Card key={project.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{project.name}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteProject(project.id, project.name)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                <div className="flex items-center gap-4">
                  {project.due_date && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {project.due_date}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {getTaskCount(project.id)} tasks
                  </div>
                  <div className={`flex items-center gap-1 ${getRiskColor(project.risk_level)}`}>
                    <AlertTriangle className="h-4 w-4" />
                    {project.risk_level} risk
                  </div>
                </div>
              </div>
              <Button 
                onClick={() => onSelectProject(project.id)}
                className="w-full"
              >
                Open Project
              </Button>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};
