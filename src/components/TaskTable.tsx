
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Settings, Plus } from "lucide-react";

interface Task {
  id: string;
  taskName: string;
  startDate: string;
  endDate: string;
  status: 'todo' | 'in-progress' | 'completed' | 'blocked';
  assignedTo: string;
  priority: 'low' | 'medium' | 'high';
  riskLevel: 'low' | 'medium' | 'high';
  confidenceScore: number;
  estimatedHours: number;
  dependencies: string[];
  tags: string[];
}

interface TaskTableProps {
  projectId: string | null;
}

export const TaskTable = ({ projectId }: TaskTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const [tasks] = useState<Task[]>([
    {
      id: '1',
      taskName: 'Set up project repository',
      startDate: '2024-07-01',
      endDate: '2024-07-02',
      status: 'completed',
      assignedTo: 'John Doe',
      priority: 'high',
      riskLevel: 'low',
      confidenceScore: 0.95,
      estimatedHours: 4,
      dependencies: [],
      tags: ['setup', 'infrastructure']
    },
    {
      id: '2',
      taskName: 'Design database schema',
      startDate: '2024-07-03',
      endDate: '2024-07-05',
      status: 'in-progress',
      assignedTo: 'Jane Smith',
      priority: 'high',
      riskLevel: 'medium',
      confidenceScore: 0.80,
      estimatedHours: 16,
      dependencies: ['1'],
      tags: ['database', 'design']
    },
    {
      id: '3',
      taskName: 'Implement user authentication',
      startDate: '2024-07-06',
      endDate: '2024-07-10',
      status: 'todo',
      assignedTo: 'Bob Johnson',
      priority: 'medium',
      riskLevel: 'high',
      confidenceScore: 0.65,
      estimatedHours: 24,
      dependencies: ['2'],
      tags: ['auth', 'security']
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'todo': return 'bg-gray-100 text-gray-800';
      case 'blocked': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.taskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="todo">To Do</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="blocked">Blocked</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Risk</TableHead>
              <TableHead>Confidence</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Hours</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">{task.taskName}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(task.status)}>
                    {task.status}
                  </Badge>
                </TableCell>
                <TableCell>{task.assignedTo}</TableCell>
                <TableCell>
                  <Badge className={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getRiskColor(task.riskLevel)}>
                    {task.riskLevel}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-12 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${task.confidenceScore * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm">{Math.round(task.confidenceScore * 100)}%</span>
                  </div>
                </TableCell>
                <TableCell>{task.startDate}</TableCell>
                <TableCell>{task.endDate}</TableCell>
                <TableCell>{task.estimatedHours}h</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
