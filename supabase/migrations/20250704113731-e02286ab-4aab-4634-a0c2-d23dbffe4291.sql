
-- Create projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'on-hold')),
  due_date DATE,
  risk_level TEXT NOT NULL DEFAULT 'medium' CHECK (risk_level IN ('low', 'medium', 'high')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tasks table
CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  task_name TEXT NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in-progress', 'completed', 'blocked')),
  assigned_to TEXT,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  risk_level TEXT NOT NULL DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high')),
  confidence_score DECIMAL(3,2) DEFAULT 0.80 CHECK (confidence_score >= 0 AND confidence_score <= 1),
  estimated_hours INTEGER DEFAULT 0,
  dependencies TEXT[], -- Array of task IDs or names
  tags TEXT[], -- Array of tags
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Create policies for projects (public access for now)
CREATE POLICY "Anyone can view projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Anyone can insert projects" ON public.projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update projects" ON public.projects FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete projects" ON public.projects FOR DELETE USING (true);

-- Create policies for tasks (public access for now)
CREATE POLICY "Anyone can view tasks" ON public.tasks FOR SELECT USING (true);
CREATE POLICY "Anyone can insert tasks" ON public.tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update tasks" ON public.tasks FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete tasks" ON public.tasks FOR DELETE USING (true);

-- Insert sample data
INSERT INTO public.projects (name, description, status, due_date, risk_level) VALUES
('E-commerce Platform', 'Build a modern e-commerce platform with React and Node.js', 'active', '2024-08-15', 'medium'),
('Mobile App MVP', 'Develop minimum viable product for mobile application', 'active', '2024-07-30', 'high'),
('Website Redesign', 'Redesign company website with modern UI/UX', 'completed', '2024-06-20', 'low');

INSERT INTO public.tasks (project_id, task_name, description, start_date, end_date, status, assigned_to, priority, risk_level, confidence_score, estimated_hours, tags, notes) VALUES
((SELECT id FROM public.projects WHERE name = 'E-commerce Platform'), 'Set up project repository', 'Initialize Git repository and basic project structure', '2024-07-01', '2024-07-02', 'completed', 'John Doe', 'high', 'low', 0.95, 4, ARRAY['setup', 'infrastructure'], 'Repository setup completed successfully'),
((SELECT id FROM public.projects WHERE name = 'E-commerce Platform'), 'Design database schema', 'Create comprehensive database schema for e-commerce platform', '2024-07-03', '2024-07-05', 'in-progress', 'Jane Smith', 'high', 'medium', 0.80, 16, ARRAY['database', 'design'], 'Schema design in progress'),
((SELECT id FROM public.projects WHERE name = 'E-commerce Platform'), 'Implement user authentication', 'Build secure user authentication system', '2024-07-06', '2024-07-10', 'todo', 'Bob Johnson', 'medium', 'high', 0.65, 24, ARRAY['auth', 'security'], 'Requires OAuth integration'),
((SELECT id FROM public.projects WHERE name = 'Mobile App MVP'), 'UI/UX Design', 'Create wireframes and mockups for mobile app', '2024-07-08', '2024-07-12', 'in-progress', 'Alice Brown', 'high', 'medium', 0.75, 20, ARRAY['design', 'ui'], 'Initial designs approved'),
((SELECT id FROM public.projects WHERE name = 'Website Redesign'), 'Content Migration', 'Migrate existing content to new design', '2024-06-15', '2024-06-18', 'completed', 'Charlie Wilson', 'medium', 'low', 0.90, 12, ARRAY['content', 'migration'], 'Migration completed successfully');
