import { useRef, useState } from 'react';
import { UploadCloud } from 'lucide-react';

interface FileDropzoneProps {
  onFileSelected: (file: File) => void;
  selectedFileName?: string | null;
}

export function FileDropzone({ onFileSelected, selectedFileName }: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  return (
    <div
      className="file-dropzone"
      style={dragOver ? { borderColor: 'var(--chronix-navy)' } : undefined}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) onFileSelected(file);
      }}
    >
      <UploadCloud size={22} style={{ marginBottom: '0.5rem' }} />
      <div style={{ fontSize: '0.85rem' }}>{selectedFileName ?? 'PDF, JPG, PNG up to 10MB'}</div>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFileSelected(file);
        }}
      />
    </div>
  );
}
