
import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  onFileProcessed?: (data: any) => void;
}

export const FileUpload = ({ onFileProcessed }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { toast } = useToast();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFileUpload(files);
  };

  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0) return;

    const file = files[0];
    
    // Check file type
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload an Excel (.xlsx, .xls) or CSV file.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setUploadProgress(0);
    setUploadStatus('idle');

    // Simulate file processing
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 20;
      });
    }, 200);

    try {
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setUploadProgress(100);
      setUploadStatus('success');
      
      toast({
        title: "File Processed Successfully",
        description: "Your Excel file has been cleaned and structured by AI.",
      });

      // Mock processed data
      const mockProcessedData = {
        projectName: file.name.replace(/\.[^/.]+$/, ""),
        tasks: [
          {
            taskName: "Setup Development Environment",
            priority: "high",
            riskLevel: "low",
            confidenceScore: 0.95
          },
          {
            taskName: "Design User Interface",
            priority: "medium", 
            riskLevel: "medium",
            confidenceScore: 0.80
          }
        ]
      };

      onFileProcessed?.(mockProcessedData);
      
    } catch (error) {
      setUploadStatus('error');
      toast({
        title: "Processing Failed",
        description: "There was an error processing your file. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setTimeout(() => {
        setUploadProgress(0);
        setUploadStatus('idle');
      }, 2000);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5" />
          Import Excel File
        </CardTitle>
        <CardDescription>
          Upload messy Excel files and let AI clean and structure them automatically
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center gap-4">
            {uploadStatus === 'success' ? (
              <CheckCircle className="h-12 w-12 text-green-600" />
            ) : uploadStatus === 'error' ? (
              <AlertCircle className="h-12 w-12 text-red-600" />
            ) : (
              <Upload className="h-12 w-12 text-gray-400" />
            )}
            
            <div>
              <p className="text-lg font-medium">
                {uploadStatus === 'success' 
                  ? 'File processed successfully!' 
                  : uploadStatus === 'error'
                  ? 'Processing failed'
                  : 'Drop your Excel file here'
                }
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {uploadStatus === 'idle' && 'Supports .xlsx, .xls, and .csv files'}
              </p>
            </div>

            {isProcessing && (
              <div className="w-full max-w-sm space-y-2">
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-sm text-gray-600">
                  AI is cleaning and structuring your data... {Math.round(uploadProgress)}%
                </p>
              </div>
            )}

            {!isProcessing && uploadStatus === 'idle' && (
              <div className="space-y-4">
                <Button asChild>
                  <label htmlFor="file-upload" className="cursor-pointer">
                    Choose File
                  </label>
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileSelect}
                />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
