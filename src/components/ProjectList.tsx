
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, AlertTriangle } from "lucide-react";

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold';
  dueDate: string;
  taskCount: number;
  riskLevel: 'low' | 'medium' | 'high';
}

interface ProjectListProps {
  onSelectProject: (projectId: string) => void;
}

export const ProjectList = ({ onSelectProject }: ProjectListProps) => {
  const [projects] = useState<Project[]>([
    {
      id: '1',
      name: 'E-commerce Platform',
      description: 'Build a modern e-commerce platform with React and Node.js',
      status: 'active',
      dueDate: '2024-08-15',
      taskCount: 24,
      riskLevel: 'medium'
    },
    {
      id: '2',
      name: 'Mobile App MVP',
      description: 'Develop minimum viable product for mobile application',
      status: 'active',
      dueDate: '2024-07-30',
      taskCount: 18,
      riskLevel: 'high'
    },
    {
      id: '3',
      name: 'Website Redesign',
      description: 'Redesign company website with modern UI/UX',
      status: 'completed',
      dueDate: '2024-06-20',
      taskCount: 12,
      riskLevel: 'low'
    }
  ]);

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

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <Card key={project.id} className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{project.name}</CardTitle>
              <Badge className={getStatusColor(project.status)}>
                {project.status}
              </Badge>
            </div>
            <CardDescription>{project.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {project.dueDate}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {project.taskCount} tasks
                </div>
                <div className={`flex items-center gap-1 ${getRiskColor(project.riskLevel)}`}>
                  <AlertTriangle className="h-4 w-4" />
                  {project.riskLevel} risk
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
      ))}
    </div>
  );
};
