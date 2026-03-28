'use client';
import React, { useState } from 'react';
import { Box, Button, Typography, Alert, CircularProgress, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import { uploadLogo } from '@/services/api';

interface LogoUploaderProps {
  currentLogo: string;
  onLogoUpdate: (logoUrl: string) => void;
  logoType?: string;
}

const logoTypeLabels = {
  navbar: 'Navbar Logo',
  footer: 'Footer Logo', 
  favicon: 'Favicon',
  ogImage: 'Open Graph Image'
};

const logoTypeDescriptions = {
  navbar: 'Appears in the top navigation bar (Recommended: 200x50px)',
  footer: 'Appears in the footer section (Recommended: 150x40px)',
  favicon: 'Browser tab icon (Recommended: 32x32px, ICO format)',
  ogImage: 'Social media share image (Recommended: 1200x630px)'
};

export default function LogoUploader({ currentLogo, onLogoUpdate, logoType = 'navbar' }: LogoUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedType, setSelectedType] = useState(logoType);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('File selected:', {
      name: file.name,
      size: file.size,
      type: file.type,
      logoType: selectedType
    });

    // Validate file type based on logo type
    if (selectedType === 'favicon') {
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
      console.log('Starting upload for type:', selectedType);
      const response = await uploadLogo(file, selectedType);
      console.log('Upload response:', response.data);
      onLogoUpdate(response.data.logoUrl);
      setSuccess(`${logoTypeLabels[selectedType as keyof typeof logoTypeLabels]} uploaded successfully!`);
    } catch (error: any) {
      console.error('Upload error:', error);
      console.error('Error response:', error.response?.data);
      setError(error.response?.data?.error || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        {logoTypeLabels[selectedType as keyof typeof logoTypeLabels]} Management
      </Typography>

      {/* Logo Type Selection */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Logo Type</InputLabel>
        <Select
          value={selectedType}
          label="Logo Type"
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <MenuItem value="navbar">Navbar Logo</MenuItem>
          <MenuItem value="footer">Footer Logo</MenuItem>
          <MenuItem value="favicon">Favicon</MenuItem>
          <MenuItem value="ogImage">Open Graph Image</MenuItem>
        </Select>
      </FormControl>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {logoTypeDescriptions[selectedType as keyof typeof logoTypeDescriptions]}
      </Typography>

      {/* Current Logo Preview */}
      {currentLogo && currentLogo.startsWith('/uploads/') && (
        <Box sx={{ mb: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Current {logoTypeLabels[selectedType as keyof typeof logoTypeLabels]}:
          </Typography>
          <img 
            src={`http://localhost:5000${currentLogo}`} 
            alt={`Current ${logoTypeLabels[selectedType as keyof typeof logoTypeLabels]}`}
            style={{ 
              maxHeight: selectedType === 'favicon' ? '32px' : '80px', 
              maxWidth: selectedType === 'ogImage' ? '300px' : '200px', 
              objectFit: 'contain',
              border: '1px solid #ddd',
              borderRadius: '4px',
              padding: '4px'
            }}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </Box>
      )}

      {/* File Upload */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" gutterBottom>
          Upload {logoTypeLabels[selectedType as keyof typeof logoTypeLabels]}:
        </Typography>
        <Button
          component="label"
          variant="outlined"
          startIcon={uploading ? <CircularProgress size={20} /> : <CloudUpload />}
          disabled={uploading}
          fullWidth
        >
          {uploading ? 'Uploading...' : 'Choose File'}
          <input
            type="file"
            hidden
            accept={selectedType === 'favicon' ? '.ico,.png' : 'image/*'}
            onChange={handleFileUpload}
            disabled={uploading}
          />
        </Button>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
          {selectedType === 'favicon' 
            ? 'Supported: ICO, PNG formats' 
            : 'Supported: All image formats (JPG, PNG, GIF, WebP, SVG, etc.)'}
        </Typography>
      </Box>

      {/* Messages */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
    </Box>
  );
}