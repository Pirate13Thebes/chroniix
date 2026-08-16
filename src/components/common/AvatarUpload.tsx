import { useRef, useState } from 'react';
import { Camera } from 'lucide-react';
import { Avatar } from './Avatar';

const MAX_BYTES = 2 * 1024 * 1024; // 2MB
const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

interface AvatarUploadProps {
  src: string;
  name: string;
  size?: number;
  onChange: (dataUrl: string) => void;
}

// Client-side-only "upload" — there's no backend/object storage in this
// prototype, so the picture is read as a data URL and stored directly on
// the employee/settings record, same as every other piece of app state.
export function AvatarUpload({ src, name, size = 72, onChange }: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Use a PNG, JPG, or WEBP image.');
      return;
    }
    if (file.size > MAX_BYTES) {
      setError('Image must be under 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setError('');
      onChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <Avatar src={src} name={name} size={size} />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          aria-label="Change photo"
          style={{
            position: 'absolute',
            bottom: -2,
            right: -2,
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: 'var(--chronix-navy)',
            color: '#fff',
            border: '2px solid var(--bg-card)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <Camera size={14} />
        </button>
        <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={handleFile} style={{ display: 'none' }} />
      </div>
      {error && <span style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>{error}</span>}
    </div>
  );
}
