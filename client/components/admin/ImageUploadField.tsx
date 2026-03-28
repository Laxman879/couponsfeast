'use client';
import { useState, useRef } from 'react';
import { TextField, Button, CircularProgress } from '@mui/material';
import { CloudUpload, Delete } from '@mui/icons-material';
import { uploadLogo } from '@/services/api';
import toast from 'react-hot-toast';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  helperText?: string;
  uploadType?: string;
}

export default function ImageUploadField({ label, value, onChange, helperText, uploadType = 'image' }: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadLogo(file, uploadType);
      const serverUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
      const url = res.data.logoUrl.startsWith('http') ? res.data.logoUrl : `${serverUrl}${res.data.logoUrl}`;
      onChange(url);
      toast.success('Image uploaded!');
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const compact = !label;

  return (
    <div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />

      {compact ? (
        /* Compact mode — just URL + buttons */
        <div className="flex gap-1.5 items-center">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Paste URL..."
            className="flex-1 min-w-0 text-xs border border-slate-200 rounded-lg px-2.5 py-2 outline-none focus:ring-1 focus:ring-purple-300 bg-white text-slate-700 placeholder-slate-400"
          />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-1 px-2.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-medium transition-colors flex-shrink-0 cursor-pointer disabled:opacity-50"
          >
            {uploading ? <CircularProgress size={12} /> : <CloudUpload style={{ fontSize: 14 }} />}
            {uploading ? '' : 'Upload'}
          </button>
          {value && (
            <button
              onClick={() => onChange('')}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors flex-shrink-0 cursor-pointer"
            >
              <Delete style={{ fontSize: 14 }} />
            </button>
          )}
        </div>
      ) : (
        /* Full mode — with MUI label */
        <>
          <div className="flex gap-2 items-end">
            <TextField
              fullWidth
              label={label}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://... or upload"
              size="small"
              helperText={helperText}
            />
            <Button
              variant="outlined"
              size="small"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              startIcon={uploading ? <CircularProgress size={14} /> : <CloudUpload />}
              style={{ minWidth: 100, height: 40, textTransform: 'none', borderRadius: 8, flexShrink: 0 }}
            >
              {uploading ? '...' : 'Upload'}
            </Button>
          </div>
          {value && (
            <img
              src={value}
              alt="preview"
              className="mt-2 h-16 rounded-lg object-cover border border-gray-100"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          )}
        </>
      )}
    </div>
  );
}
