import { useState, useRef, ChangeEvent } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUploadImage, useUploadImages, getImageUrl } from '@/hooks/useUpload';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ImageUploadProps {
  value?: string[];
  onChange: (urls: string[]) => void;
  maxFiles?: number;
  category?: string;
  className?: string;
}

export const ImageUpload = ({
  value = [],
  onChange,
  maxFiles = 5,
  category = 'services',
  className,
}: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadImage = useUploadImage();
  const uploadImages = useUploadImages();

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Check max files
    if (value.length + files.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} images autorisées`);
      return;
    }

    // Validate file types
    const validFiles = files.filter((file) => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error(`${file.name}: Type de fichier non supporté`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name}: Fichier trop volumineux (max 5MB)`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setIsUploading(true);

    try {
      if (validFiles.length === 1) {
        const result = await uploadImage.mutateAsync({
          file: validFiles[0],
          category,
        });
        onChange([...value, result.data.url]);
        toast.success('Image uploadée avec succès');
      } else {
        const result = await uploadImages.mutateAsync({
          files: validFiles,
          category,
        });
        const newUrls = result.data.map((f: any) => f.url);
        onChange([...value, ...newUrls]);
        toast.success(`${validFiles.length} images uploadées`);
      }
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de l\'upload');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (index: number) => {
    const newValue = [...value];
    newValue.splice(index, 1);
    onChange(newValue);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        multiple={maxFiles > 1}
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="grid grid-cols-3 gap-4">
        {/* Existing images */}
        {value.map((url, index) => (
          <div
            key={index}
            className="relative aspect-square rounded-xl overflow-hidden border border-border group"
          >
            <img
              src={getImageUrl(url)}
              alt={`Upload ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 p-1 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}

        {/* Upload button */}
        {value.length < maxFiles && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className={cn(
              "aspect-square rounded-xl border-2 border-dashed border-border",
              "flex flex-col items-center justify-center gap-2",
              "hover:border-primary hover:bg-primary/5 transition-colors",
              "text-muted-foreground",
              isUploading && "opacity-50 cursor-not-allowed"
            )}
          >
            {isUploading ? (
              <Loader2 className="w-8 h-8 animate-spin" />
            ) : (
              <>
                <Upload className="w-8 h-8" />
                <span className="text-xs">Ajouter</span>
              </>
            )}
          </button>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        {value.length}/{maxFiles} images • Max 5MB par image • JPG, PNG, GIF, WebP
      </p>
    </div>
  );
};

export default ImageUpload;
