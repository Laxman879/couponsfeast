'use client';
import React, { useState } from 'react';
import { Box, Button, Typography, Alert, CircularProgress } from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import { uploadLogo } from '@/services/api';

interface LogoUploaderProps {
  currentLogo: string;
  onLogoUpdate: (logoUrl: string) => void;
  logoType?: string;
}

const logoTypeLabels: Record<string, string> = {
  navbar: 'Navbar Logo',
  footer: 'Footer Logo',
  favicon: 'Favicon',
  ogImage: 'Open Graph Image'
};

const logoTypeDescriptions: Record<string, string> = {
  navbar: 'Appears in the top navigation bar (Recommended: 200x50px)',
  footer: 'Appears in the footer section (Recommended: 150x40px)',
  favicon: 'Browser tab icon (Recommended: 32x32px, ICO/PNG format)',
  ogImage: 'Social media share image (Recommended: 1200x630px)'
};

export default function LogoUploader({ currentLogo, onLogoUpdate, logoType = 'navbar' }: LogoUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const label = logoTypeLabels[logoType] || 'Image';
  const isFavicon = logoType === 'favicon';

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (isFavicon) {
      if (!file.type.includes('icon') && !file.type.includes('image/')) {
        setError('Favicon should be ICO or PNG format');
        return;
      }
    } else if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const response = await uploadLogo(file, logoType);
      onLogoUpdate(response.data.logoUrl);
      setSuccess(`${label} uploaded successfully!`);
    } catch (error: any) {
      setError(error.response?.data?.error || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const logoSrc = currentLogo
    ? currentLogo.startsWith('http') ? currentLogo : `http://localhost:5000${currentLogo}`
    : '';

  return (
    <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 2 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {logoTypeDescriptions[logoType]}
      </Typography>

      {/* Current Logo Preview */}
      {logoSrc && (
        <Box sx={{ mb: 2, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary" gutterBottom>
            Current:
          </Typography>
          <Box>
            <img
              src={logoSrc}
              alt={`Current ${label}`}
              style={{
                maxHeight: isFavicon ? '32px' : logoType === 'ogImage' ? '120px' : '80px',
                maxWidth: logoType === 'ogImage' ? '300px' : '200px',
                objectFit: 'contain',
                border: '1px solid #ddd',
                borderRadius: '4px',
                padding: '4px'
              }}
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </Box>
        </Box>
      )}

      {/* File Upload */}
      <Button
        component="label"
        variant="outlined"
        startIcon={uploading ? <CircularProgress size={20} /> : <CloudUpload />}
        disabled={uploading}
        fullWidth
      >
        {uploading ? 'Uploading...' : `Upload ${label}`}
        <input
          type="file"
          hidden
          accept={isFavicon ? '.ico,.png' : 'image/*'}
          onChange={handleFileUpload}
          disabled={uploading}
        />
      </Button>
      <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
        {isFavicon ? 'Supported: ICO, PNG formats' : 'Supported: JPG, PNG, GIF, WebP, SVG, etc.'}
      </Typography>

      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
    </Box>
  );
}
