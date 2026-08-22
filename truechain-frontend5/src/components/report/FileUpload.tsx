'use client';

import { useRef, useState, useCallback } from 'react';
import { Upload, FileText, ImageIcon, X, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];
const ACCEPTED_EXTENSIONS = '.jpg,.jpeg,.png,.pdf';

interface FileUploadProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(type: string) {
  if (type.startsWith('image/')) return <ImageIcon className="size-4 text-primary" />;
  return <FileText className="size-4 text-primary" />;
}

export function FileUpload({ file, onFileChange }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const validateAndSetFile = useCallback(
    (selectedFile: File) => {
      setError(null);

      if (!ACCEPTED_TYPES.includes(selectedFile.type)) {
        setError('Only JPG, PNG, and PDF files are accepted.');
        return;
      }

      if (selectedFile.size > MAX_FILE_SIZE) {
        setError('File size must be under 10 MB.');
        return;
      }

      onFileChange(selectedFile);
    },
    [onFileChange]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) validateAndSetFile(selected);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) validateAndSetFile(dropped);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const clearFile = () => {
    onFileChange(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-foreground">
        Attach Evidence <span className="text-muted-foreground font-normal">(optional)</span>
      </Label>

      {!file ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => inputRef.current?.click()}
          className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-secondary/30 px-4 py-8 transition-colors hover:border-primary/50 hover:bg-secondary/50"
        >
          <Upload className="size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Drag & drop or click to upload
          </p>
          <p className="text-xs text-muted-foreground/70">
            JPG, PNG, or PDF — Max 10 MB
          </p>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_EXTENSIONS}
            onChange={handleChange}
            className="hidden"
          />
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 px-4 py-3">
          {getFileIcon(file.type)}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(file.size)} · {file.type}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={clearFile}
            className="size-8 shrink-0 text-muted-foreground hover:text-foreground"
            aria-label="Remove file"
          >
            <X className="size-4" />
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_EXTENSIONS}
            onChange={handleChange}
            className="hidden"
          />
        </div>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}

      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Info className="size-3 shrink-0" />
        <span>EXIF metadata and personal data will be stripped before storage.</span>
      </div>
    </div>
  );
}
