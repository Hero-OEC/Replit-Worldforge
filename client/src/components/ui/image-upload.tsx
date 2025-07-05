import { useState, useRef } from 'react';
import { Upload, X, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string | null) => void;
  onUpload: (file: File) => Promise<string>;
  className?: string;
  placeholder?: string;
}

export function ImageUpload({ 
  value, 
  onChange, 
  onUpload, 
  className = '',
  placeholder = "Upload character image"
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (PNG, JPG, JPEG, WebP)",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsUploading(true);
      const imageUrl = await onUpload(file);
      onChange(imageUrl);
      toast({
        title: "Image uploaded successfully",
        description: "Character image has been updated"
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    onChange(null);
    toast({
      title: "Image removed",
      description: "Character image has been removed"
    });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center space-x-4">
        {value ? (
          <div className="relative">
            <div className="aspect-[7/9] bg-[var(--color-200)] rounded-lg border-2 border-gray-200 flex items-center justify-center overflow-hidden" style={{ width: '280px' }}>
              <img 
                src={value} 
                alt="Character preview" 
                className="w-full h-full object-cover"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 bg-red-500 hover:bg-red-600 text-white border-red-500"
              onClick={handleRemove}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <div className="aspect-[7/9] bg-[var(--color-200)] rounded-lg border-2 border-dashed border-[var(--color-300)] flex items-center justify-center" style={{ width: '280px' }}>
            <div className="text-center">
              <Camera className="w-8 h-8 text-[var(--color-500)] mx-auto mb-2" />
              <p className="text-sm text-[var(--color-600)]">No image</p>
            </div>
          </div>
        )}

        <div className="flex flex-col space-y-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center space-x-2"
          >
            <Upload className="w-4 h-4" />
            <span>{isUploading ? 'Uploading...' : value ? 'Change Image' : 'Upload Image'}</span>
          </Button>
          
          <p className="text-xs text-[var(--color-600)]">
            Use 7:9 aspect ratio for best results
          </p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}