'use client';

import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  TextField, 
  Button, 
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch,
  FormControlLabel,
  Chip,
  IconButton,
  Divider,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { getSiteConfig, updateSiteConfig } from '@/services/api';
import LogoUploader from './LogoUploader';
import ColorPicker from './ColorPicker';
import { updateFavicon, updatePageTitle, updateMetaTags } from '@/utils/faviconUtils';
import { Palette, Navigation, ArrowDownCircle, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SiteConfigAdmin() {
  const [config, setConfig] = useState<any>({
    siteName: '',
    seo: {
      metaTitle: '',
      metaDescription: '',
      metaKeywords: [],
      favicon: '',
      ogTitle: '',
      ogDescription: '',
      ogImage: '',
      twitterCard: 'summary_large_image',
      twitterSite: ''
    },
    theme: {
      primaryColor: '#7c3aed',
      secondaryColor: '#9333ea',
      backgroundColor: '#ffffff',
      textColor: '#111827',
      accentColor: '#f59e0b',
      successColor: '#10b981',
      errorColor: '#ef4444',
      warningColor: '#f59e0b'
    },
    navbar: {
      style: 'solid',
      bgColor: '',
      textColor: '#ffffff',
      showSearch: true,
      showThemeToggle: true,
      sticky: true,
    },
    footerConfig: {
      layout: 'footer1',
      style: 'standard',
      bgColor: '',
      textColor: '#ffffff',
      showAppDownload: true,
      showContactInfo: true,
    },
    footerContent: {
      tagline: 'Find the best deals, coupons, and discounts from top brands.',
      columns: [
        { heading: 'Quick Links', links: [{ label: 'Home', href: '/' }, { label: 'Stores', href: '/stores' }, { label: 'Coupons', href: '/coupons' }] },
        { heading: 'Company', links: [{ label: 'About', href: '#' }, { label: 'Blog', href: '#' }, { label: 'Contact', href: '#' }] },
        { heading: 'Support', links: [{ label: 'Help Center', href: '#' }, { label: 'Privacy Policy', href: '#' }, { label: 'Terms', href: '#' }] },
      ],
      bottomLinks: [
        { label: 'Privacy Policy', href: '/privacy-policy' },
        { label: 'Terms & Conditions', href: '/terms-and-conditions' },
        { label: 'Sitemap', href: '/sitemap.xml' },
      ]
    },
    fonts: {
      heading: 'Inter',
      body: 'Roboto',
      mono: 'Fira Code'
    },
    logos: {
      navbar: '',
      footer: '',
      favicon: '',
      ogImage: ''
    },
    socialMedia: {
      facebook: { label: 'Facebook', url: '', icon: 'facebook', enabled: true },
      twitter: { label: 'Twitter', url: '', icon: 'twitter', enabled: true },
      instagram: { label: 'Instagram', url: '', icon: 'instagram', enabled: true },
      linkedin: { label: 'LinkedIn', url: '', icon: 'linkedin', enabled: false },
      youtube: { label: 'YouTube', url: '', icon: 'youtube', enabled: false },
      tiktok: { label: 'TikTok', url: '', icon: 'tiktok', enabled: false }
    },
    footer: {
      copyright: '',
      email: '',
      phone: '',
      address: '',
      showSocialMedia: true,
      showNewsletter: true
    },
    promoCard: {
      title: 'Earn Up To $100 ExtraBucks At CVS',
      description: "Steal this influencer's top picks from her latest CVS beauty haul.",
      ctaText: 'Click To Watch Video',
      ctaLink: '#',
      image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=400&h=400&fit=crop',
      bgColor: '#2563eb',
      enabled: true
    }
  });
  
  const [newKeyword, setNewKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await getSiteConfig();
      setConfig(response.data);
    } catch (error) {
      console.error('Error fetching site config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const loadingToast = toast.loading('Saving configuration...');
    
    try {
      await updateSiteConfig(config);
      
      // Update favicon if changed
      if (config.logos.favicon) {
        const faviconUpdated = updateFavicon(config.logos.favicon);
        if (faviconUpdated) {
          toast.success('Favicon updated successfully!', { id: loadingToast });
        }
      }
      
      // Update page title if changed
      if (config.seo.metaTitle) {
        updatePageTitle(config.seo.metaTitle);
      }
      
      // Update meta tags
      updateMetaTags({
        title: config.seo.metaTitle,
        description: config.seo.metaDescription,
        keywords: config.seo.metaKeywords,
        ogTitle: config.seo.ogTitle,
        ogDescription: config.seo.ogDescription,
        ogImage: config.logos.ogImage,
        twitterSite: config.seo.twitterSite
      });
      
      // Trigger global refresh
      localStorage.setItem('cms-updated', Date.now().toString());
      window.dispatchEvent(new CustomEvent('cms-updated'));
      
      toast.success('Site configuration updated successfully!', { id: loadingToast });
    } catch (error) {
      toast.error('Error updating site configuration. Please try again.', { id: loadingToast });
    } finally {
      setSaving(false);
    }
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !config.seo.metaKeywords.includes(newKeyword.trim())) {
      setConfig({
        ...config,
        seo: {
          ...config.seo,
          metaKeywords: [...config.seo.metaKeywords, newKeyword.trim()]
        }
      });
      setNewKeyword('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setConfig({
      ...config,
      seo: {
        ...config.seo,
        metaKeywords: config.seo.metaKeywords.filter((k: string) => k !== keyword)
      }
    });
  };

  const updateSocialMedia = (platform: string, field: string, value: any) => {
    setConfig({
      ...config,
      socialMedia: {
        ...config.socialMedia,
        [platform]: {
          ...config.socialMedia[platform],
          [field]: value
        }
      }
    });
  };

  if (loading) {
    return <Box sx={{ p: 3 }}><Typography>Loading configuration...</Typography></Box>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Complete Site Configuration
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        Configure all aspects of your website from this single panel. Changes apply immediately across the entire site.
      </Alert>

      {/* Basic Site Information */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Basic Site Information</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Site Name"
                value={config.siteName}
                onChange={(e) => setConfig({...config, siteName: e.target.value})}
                helperText="Appears in browser tab, navbar, and throughout the site"
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* SEO & Meta Tags */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">SEO & Meta Tags</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Meta Title"
                value={config.seo.metaTitle}
                onChange={(e) => setConfig({
                  ...config, 
                  seo: {...config.seo, metaTitle: e.target.value}
                })}
                helperText="Appears in search results and browser tab (50-60 characters recommended)"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Meta Description"
                value={config.seo.metaDescription}
                onChange={(e) => setConfig({
                  ...config, 
                  seo: {...config.seo, metaDescription: e.target.value}
                })}
                helperText="Appears in search results (150-160 characters recommended)"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>Meta Keywords</Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                {config.seo.metaKeywords.map((keyword: string) => (
                  <Chip
                    key={keyword}
                    label={keyword}
                    onDelete={() => removeKeyword(keyword)}
                    deleteIcon={<DeleteIcon />}
                  />
                ))}
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  size="small"
                  label="Add Keyword"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                />
                <Button variant="outlined" onClick={addKeyword} startIcon={<AddIcon />}>
                  Add
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Open Graph Title"
                value={config.seo.ogTitle}
                onChange={(e) => setConfig({
                  ...config, 
                  seo: {...config.seo, ogTitle: e.target.value}
                })}
                helperText="Title when shared on social media"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Twitter Site Handle"
                value={config.seo.twitterSite}
                onChange={(e) => setConfig({
                  ...config, 
                  seo: {...config.seo, twitterSite: e.target.value}
                })}
                helperText="Your Twitter handle (e.g., @yoursite)"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Open Graph Description"
                value={config.seo.ogDescription}
                onChange={(e) => setConfig({
                  ...config, 
                  seo: {...config.seo, ogDescription: e.target.value}
                })}
                helperText="Description when shared on social media"
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Theme Selector */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6"><span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><Palette size={18} /> Theme</span></Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Alert severity="info" sx={{ mb: 3 }}>
            Select a theme preset — it applies instantly across the entire site. No manual color editing needed.
          </Alert>
          <Grid container spacing={2}>
            {[
              { name: 'purple', label: 'Purple',  colors: ['#a78bfa','#c084fc','#fcd34d'] },
              { name: 'blue',   label: 'Blue',    colors: ['#60a5fa','#818cf8','#7dd3fc'] },
              { name: 'green',  label: 'Green',   colors: ['#4ade80','#86efac','#bef264'] },
              { name: 'orange', label: 'Orange',  colors: ['#fb923c','#fdba74','#fde68a'] },
              { name: 'red',    label: 'Red',     colors: ['#f87171','#fca5a5','#fdba74'] },
              { name: 'rose',   label: 'Rose',    colors: ['#fb7185','#fda4af','#fecdd3'] },
              { name: 'teal',   label: 'Teal',    colors: ['#2dd4bf','#5eead4','#99f6e4'] },
              { name: 'dark',   label: 'Dark',    colors: ['#a78bfa','#c4b5fd','#fde68a'] },
            ].map((t) => {
              const selected = (config.themeName || 'purple') === t.name;
              return (
                <Grid item xs={6} sm={4} md={3} key={t.name}>
                  <Box
                    onClick={() => {
                      setConfig({
                        ...config,
                        themeName: t.name,
                        navbar: { ...config.navbar, bgColor: '' },
                        footerConfig: { ...config.footerConfig, bgColor: '' },
                      });
                      document.documentElement.setAttribute('data-theme', t.name);
                    }}
                    sx={{
                      cursor: 'pointer', borderRadius: 2, overflow: 'hidden',
                      border: selected ? `3px solid ${t.colors[0]}` : '3px solid #e5e7eb',
                      boxShadow: selected ? 4 : 1,
                      transition: 'transform 0.15s, box-shadow 0.15s',
                      '&:hover': { transform: 'scale(1.04)' }
                    }}
                  >
                    <Box sx={{ display: 'flex', height: 14 }}>
                      {t.colors.map((c) => <Box key={c} sx={{ flex: 1, backgroundColor: c }} />)}
                    </Box>
                    <Box sx={{ p: 1.5, textAlign: 'center', bgcolor: '#f9fafb' }}>
                      <Typography variant="caption" fontWeight="bold" display="block">
                      <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', backgroundColor: t.colors[0], marginRight: 4, verticalAlign: 'middle' }} />
                      {t.label}
                    </Typography>
                      {selected && <Typography variant="caption" color="success.main" fontWeight="bold">Active</Typography>}
                    </Box>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Typography */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Typography & Fonts</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Heading Font"
                value={config.fonts.heading}
                onChange={(e) => setConfig({
                  ...config, 
                  fonts: {...config.fonts, heading: e.target.value}
                })}
                helperText="Font for headings (h1, h2, h3, etc.)"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Body Font"
                value={config.fonts.body}
                onChange={(e) => setConfig({
                  ...config, 
                  fonts: {...config.fonts, body: e.target.value}
                })}
                helperText="Font for body text and paragraphs"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Monospace Font"
                value={config.fonts.mono}
                onChange={(e) => setConfig({
                  ...config, 
                  fonts: {...config.fonts, mono: e.target.value}
                })}
                helperText="Font for code and technical text"
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Logo Management */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Logo Management</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>Navbar Logo</Typography>
              <LogoUploader 
                currentLogo={config.logos.navbar}
                logoType="navbar"
                onLogoUpdate={async (logoUrl) => {
                  const updated = { ...config, logos: { ...config.logos, navbar: logoUrl } };
                  setConfig(updated);
                  try {
                    await updateSiteConfig({ logos: updated.logos });
                    localStorage.setItem('cms-updated', Date.now().toString());
                    window.dispatchEvent(new CustomEvent('cms-updated'));
                  } catch (e) { console.error('Auto-save logo failed', e); }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>Footer Logo</Typography>
              <LogoUploader 
                currentLogo={config.logos.footer}
                logoType="footer"
                onLogoUpdate={async (logoUrl) => {
                  const updated = { ...config, logos: { ...config.logos, footer: logoUrl } };
                  setConfig(updated);
                  try {
                    await updateSiteConfig({ logos: updated.logos });
                    localStorage.setItem('cms-updated', Date.now().toString());
                    window.dispatchEvent(new CustomEvent('cms-updated'));
                  } catch (e) { console.error('Auto-save logo failed', e); }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>Favicon</Typography>
              <LogoUploader 
                currentLogo={config.logos.favicon}
                logoType="favicon"
                onLogoUpdate={async (logoUrl) => {
                  const updated = { ...config, logos: { ...config.logos, favicon: logoUrl } };
                  setConfig(updated);
                  updateFavicon(logoUrl);
                  try {
                    await updateSiteConfig({ logos: updated.logos });
                    localStorage.setItem('cms-updated', Date.now().toString());
                    window.dispatchEvent(new CustomEvent('cms-updated'));
                  } catch (e) { console.error('Auto-save logo failed', e); }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>Open Graph Image</Typography>
              <LogoUploader 
                currentLogo={config.logos.ogImage}
                logoType="ogImage"
                onLogoUpdate={async (logoUrl) => {
                  const updated = { ...config, logos: { ...config.logos, ogImage: logoUrl } };
                  setConfig(updated);
                  try {
                    await updateSiteConfig({ logos: updated.logos });
                    localStorage.setItem('cms-updated', Date.now().toString());
                    window.dispatchEvent(new CustomEvent('cms-updated'));
                  } catch (e) { console.error('Auto-save logo failed', e); }
                }}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Social Media */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Social Media Links</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            {Object.entries(config.socialMedia).map(([platform, data]: [string, any]) => (
              <Grid item xs={12} key={platform}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" sx={{ textTransform: 'capitalize', mr: 2 }}>
                        {platform}
                      </Typography>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={data.enabled}
                            onChange={(e) => updateSocialMedia(platform, 'enabled', e.target.checked)}
                          />
                        }
                        label="Enabled"
                      />
                    </Box>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          label="Display Label"
                          value={data.label}
                          onChange={(e) => updateSocialMedia(platform, 'label', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          label="URL"
                          value={data.url}
                          onChange={(e) => updateSocialMedia(platform, 'url', e.target.value)}
                          placeholder={`https://${platform}.com/yourhandle`}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          label="Icon Name"
                          value={data.icon}
                          onChange={(e) => updateSocialMedia(platform, 'icon', e.target.value)}
                          helperText="Icon identifier for display"
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Footer Configuration */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Footer Configuration</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Copyright Text"
                value={config.footer.copyright}
                onChange={(e) => setConfig({
                  ...config, 
                  footer: {...config.footer, copyright: e.target.value}
                })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Contact Email"
                value={config.footer.email}
                onChange={(e) => setConfig({
                  ...config, 
                  footer: {...config.footer, email: e.target.value}
                })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                value={config.footer.phone}
                onChange={(e) => setConfig({
                  ...config, 
                  footer: {...config.footer, phone: e.target.value}
                })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Address"
                value={config.footer.address}
                onChange={(e) => setConfig({
                  ...config, 
                  footer: {...config.footer, address: e.target.value}
                })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={config.footer.showSocialMedia}
                    onChange={(e) => setConfig({
                      ...config, 
                      footer: {...config.footer, showSocialMedia: e.target.checked}
                    })}
                  />
                }
                label="Show Social Media Links in Footer"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={config.footer.showNewsletter}
                    onChange={(e) => setConfig({
                      ...config, 
                      footer: {...config.footer, showNewsletter: e.target.checked}
                    })}
                  />
                }
                label="Show Newsletter Signup in Footer"
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* ── Navbar Customization ── */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6"><span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><Navigation size={18} /> Navbar Customization</span></Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Alert severity="info" sx={{ mb: 3 }}>
            Choose a navbar layout, then a style preset, then fine-tune individual fields below.
          </Alert>

          {/* Navbar Layout Selector */}
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Navbar Layout</Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {[
              { key: 'navbar1', label: 'Layout 1', desc: 'Glassmorphism + CTA button' },
              { key: 'navbar2', label: 'Layout 2', desc: 'Solid color + search bar' },
              { key: 'navbar3', label: 'Layout 3', desc: 'Banner + white nav + CTA' },
              { key: 'navbar4', label: 'Layout 4', desc: 'White + search + promo banner' },
            ].map((l) => {
              const selectedNav = (config.navbar?.layout || 'navbar2') === l.key;
              return (
              <Grid item xs={6} sm={4} md={3} key={l.key}>
                <Box
                  onClick={() => setConfig({ ...config, navbar: { ...config.navbar, layout: l.key } })}
                  sx={{
                    cursor: 'pointer', borderRadius: 2, overflow: 'hidden',
                    border: selectedNav
                      ? `3px solid ${config.theme.primaryColor}`
                      : '3px solid #e5e7eb',
                    boxShadow: selectedNav ? 4 : 1, transition: 'transform 0.15s, box-shadow 0.15s',
                    '&:hover': { transform: 'scale(1.04)' }
                  }}
                >
                  {/* Mini preview */}
                  {l.key === 'navbar1' && (
                    <Box sx={{ height: 40, backgroundColor: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(8px)', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', px: 1.5, gap: 1 }}>
                      <Box sx={{ width: 24, height: 8, borderRadius: 1, bgcolor: config.theme.primaryColor }} />
                      <Box sx={{ flex: 1, display: 'flex', gap: 0.5 }}>
                        {[1,2,3].map(i => <Box key={i} sx={{ width: 16, height: 4, borderRadius: 1, bgcolor: '#9ca3af' }} />)}
                      </Box>
                      <Box sx={{ width: 32, height: 14, borderRadius: 4, bgcolor: '#111827' }} />
                    </Box>
                  )}
                  {l.key === 'navbar2' && (
                    <Box sx={{ height: 40, background: `linear-gradient(90deg, ${config.theme.primaryColor}, ${config.theme.secondaryColor})`, display: 'flex', alignItems: 'center', px: 1.5, gap: 1 }}>
                      <Box sx={{ width: 24, height: 8, borderRadius: 1, bgcolor: 'rgba(255,255,255,0.9)' }} />
                      <Box sx={{ flex: 1, height: 14, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.2)' }} />
                      <Box sx={{ width: 20, height: 14, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.3)' }} />
                    </Box>
                  )}
                  {l.key === 'navbar3' && (
                    <Box>
                      <Box sx={{ height: 10, background: `linear-gradient(to right, ${config.theme.primaryColor}, ${config.theme.secondaryColor})` }} />
                      <Box sx={{ height: 30, backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', px: 1.5, gap: 1, borderBottom: '1px solid #e5e7eb' }}>
                        <Box sx={{ width: 24, height: 8, borderRadius: 1, bgcolor: config.theme.primaryColor }} />
                        <Box sx={{ flex: 1, display: 'flex', gap: 0.5 }}>
                          {[1,2,3].map(i => <Box key={i} sx={{ width: 14, height: 4, borderRadius: 1, bgcolor: '#9ca3af' }} />)}
                        </Box>
                        <Box sx={{ width: 28, height: 12, borderRadius: 4, border: '1px solid #d1d5db' }} />
                      </Box>
                    </Box>
                  )}
                  {l.key === 'navbar4' && (
                    <Box sx={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}>
                      <Box sx={{ height: 28, display: 'flex', alignItems: 'center', px: 1.5, gap: 1 }}>
                        <Box sx={{ width: 20, height: 7, borderRadius: 1, bgcolor: config.theme.primaryColor }} />
                        <Box sx={{ flex: 1, height: 12, borderRadius: 4, bgcolor: '#f3f4f6', border: '1px solid #e5e7eb' }} />
                        <Box sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: '#e5e7eb' }} />
                      </Box>
                      <Box sx={{ height: 12, borderTop: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', px: 1.5, gap: 1 }}>
                        {[1,2,3,4].map(i => <Box key={i} sx={{ width: 14, height: 3, borderRadius: 1, bgcolor: '#d1d5db' }} />)}
                      </Box>
                    </Box>
                  )}
                  <Box sx={{ p: 1.5, textAlign: 'center', bgcolor: '#f9fafb' }}>
                    <Typography variant="caption" fontWeight="bold" display="block">{l.label}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10 }}>{l.desc}</Typography>
                    {selectedNav && <Typography variant="caption" color="success.main" fontWeight="bold">Active</Typography>}
                  </Box>
                </Box>
              </Grid>
              );
            })}
          </Grid>
          <Divider sx={{ mb: 3 }} />

          {/* Navbar Style Presets */}
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Navbar Style</Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {[
              { key: 'solid',       label: 'Solid',       desc: 'Flat solid color',         preview: config.theme.primaryColor },
              { key: 'gradient',    label: 'Gradient',    desc: 'Primary → Secondary',       preview: `linear-gradient(90deg, ${config.theme.primaryColor}, ${config.theme.secondaryColor})` },
              { key: 'transparent', label: 'Transparent', desc: 'Glass / transparent look',  preview: 'rgba(0,0,0,0.3)' },
              { key: 'white',       label: 'White',       desc: 'Clean white navbar',         preview: '#ffffff' },
              { key: 'dark',        label: 'Dark',        desc: 'Always dark navbar',         preview: '#1f2937' },
            ].map((s) => {
              const selectedNavStyle = (config.navbar?.style || 'solid') === s.key;
              return (
              <Grid item xs={6} sm={4} md={2} key={s.key}>
                <Box
                  onClick={() => setConfig({ ...config, navbar: { ...config.navbar, style: s.key } })}
                  sx={{
                    cursor: 'pointer', borderRadius: 2, overflow: 'hidden',
                    border: selectedNavStyle ? `3px solid ${config.theme.primaryColor}` : '3px solid #e5e7eb',
                    boxShadow: selectedNavStyle ? 4 : 1, transition: 'transform 0.15s, box-shadow 0.15s',
                    '&:hover': { transform: 'scale(1.04)' }
                  }}
                >
                  <Box sx={{ height: 36, background: s.preview, display: 'flex', alignItems: 'center', px: 1, gap: 0.5 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.7)' }} />
                    <Box sx={{ flex: 1, height: 4, borderRadius: 1, bgcolor: 'rgba(255,255,255,0.5)' }} />
                    <Box sx={{ width: 16, height: 4, borderRadius: 1, bgcolor: 'rgba(255,255,255,0.5)' }} />
                  </Box>
                  <Box sx={{ p: 1, textAlign: 'center', bgcolor: '#f9fafb' }}>
                    <Typography variant="caption" fontWeight="bold" display="block">{s.label}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10 }}>{s.desc}</Typography>
                    {selectedNavStyle && <Typography variant="caption" color="success.main" fontWeight="bold" display="block">Active</Typography>}
                  </Box>
                </Box>
              </Grid>
              );
            })}
          </Grid>
          <Divider sx={{ mb: 3 }} />

          {/* Navbar Fields */}
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Navbar Fields</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <ColorPicker
                label="Navbar Background Color"
                value={config.navbar?.bgColor || config.theme.primaryColor}
                onChange={(color) => setConfig({ ...config, navbar: { ...config.navbar, bgColor: color } })}
                helperText="Overrides style preset background (leave blank to use theme primary)"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <ColorPicker
                label="Navbar Text / Icon Color"
                value={config.navbar?.textColor || '#ffffff'}
                onChange={(color) => setConfig({ ...config, navbar: { ...config.navbar, textColor: color } })}
                helperText="Color for nav links, icons, and site name"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControlLabel control={<Switch checked={config.navbar?.showSearch ?? true} onChange={(e) => setConfig({ ...config, navbar: { ...config.navbar, showSearch: e.target.checked } })} />} label="Show Search Bar" />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControlLabel control={<Switch checked={config.navbar?.showThemeToggle ?? true} onChange={(e) => setConfig({ ...config, navbar: { ...config.navbar, showThemeToggle: e.target.checked } })} />} label="Show Dark/Light Toggle" />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControlLabel control={<Switch checked={config.navbar?.sticky ?? true} onChange={(e) => setConfig({ ...config, navbar: { ...config.navbar, sticky: e.target.checked } })} />} label="Sticky Navbar" />
            </Grid>
            {/* Layout 1 specific fields */}
            {(config.navbar?.layout || 'navbar2') === 'navbar1' && (
              <>
                <Grid item xs={12}>
                  <Divider><Typography variant="caption" color="text.secondary">Layout 1 — CTA Button</Typography></Divider>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="CTA Button Text" value={config.navbar?.ctaText || 'Get Started'}
                    onChange={(e) => setConfig({ ...config, navbar: { ...config.navbar, ctaText: e.target.value } })}
                    helperText="Text shown on the top-right button" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="CTA Button Link" value={config.navbar?.ctaLink || '/'}
                    onChange={(e) => setConfig({ ...config, navbar: { ...config.navbar, ctaLink: e.target.value } })}
                    helperText="URL the CTA button links to" />
                </Grid>
              </>
            )}
            {/* Layout 3 specific fields */}
            {config.navbar?.layout === 'navbar3' && (
              <>
                <Grid item xs={12}>
                  <Divider><Typography variant="caption" color="text.secondary">Layout 3 — Banner + CTA</Typography></Divider>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="CTA Button Text" value={config.navbar?.ctaText || 'Get Started'}
                    onChange={(e) => setConfig({ ...config, navbar: { ...config.navbar, ctaText: e.target.value } })}
                    helperText="Top-right button label" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="CTA Button Link" value={config.navbar?.ctaLink || '/'}
                    onChange={(e) => setConfig({ ...config, navbar: { ...config.navbar, ctaLink: e.target.value } })}
                    helperText="URL the CTA button links to" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Banner Text" value={config.navbar?.bannerText || 'Exclusive Price Drop! Hurry,'}
                    onChange={(e) => setConfig({ ...config, navbar: { ...config.navbar, bannerText: e.target.value } })}
                    helperText="Main text in the top announcement banner" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Banner Highlight Text" value={config.navbar?.bannerHighlight || 'Offer Ends Soon!'}
                    onChange={(e) => setConfig({ ...config, navbar: { ...config.navbar, bannerHighlight: e.target.value } })}
                    helperText="Underlined highlight text in the banner" />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControlLabel control={<Switch checked={config.navbar?.showBanner ?? true} onChange={(e) => setConfig({ ...config, navbar: { ...config.navbar, showBanner: e.target.checked } })} />} label="Show Announcement Banner" />
                </Grid>
              </>
            )}
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* ── Footer Customization ── */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6"><span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><ArrowDownCircle size={18} /> Footer Customization</span></Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Alert severity="info" sx={{ mb: 3 }}>
            Choose a footer style preset, then fine-tune individual fields below.
          </Alert>

          {/* Footer Layout Selector */}
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Footer Layout</Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {[
              { key: 'footer1', label: 'Layout 1', desc: 'Logo + links + app download' },
              { key: 'footer2', label: 'Layout 2', desc: 'Quick links + 3 columns' },
              { key: 'footer3', label: 'Layout 3', desc: 'Social + newsletter + columns' },
              { key: 'footer4', label: 'Layout 4', desc: 'Dark + contact cards' },
            ].map((l) => {
              const selectedLayout = (config.footerConfig?.layout || 'footer1') === l.key;
              return (
              <Grid item xs={6} sm={4} md={3} key={l.key}>
                <Box
                  onClick={() => setConfig({ ...config, footerConfig: { ...config.footerConfig, layout: l.key } })}
                  sx={{
                    cursor: 'pointer', borderRadius: 2, overflow: 'hidden',
                    border: selectedLayout
                      ? `3px solid ${config.theme.primaryColor}`
                      : '3px solid #e5e7eb',
                    boxShadow: selectedLayout ? 4 : 1, transition: 'transform 0.15s, box-shadow 0.15s',
                    '&:hover': { transform: 'scale(1.04)' }
                  }}
                >
                  {/* Mini preview */}
                  {l.key === 'footer1' && (
                    <Box sx={{ height: 44, background: `linear-gradient(180deg, ${config.theme.primaryColor} 70%, ${config.theme.secondaryColor} 100%)`, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', px: 1.5, py: 1 }}>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>{[1,2,3,4].map(i => <Box key={i} sx={{ width: 12, height: 3, borderRadius: 1, bgcolor: 'rgba(255,255,255,0.5)' }} />)}</Box>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>{[1,2,3].map(i => <Box key={i} sx={{ width: 8, height: 8, borderRadius: 1, bgcolor: 'rgba(0,0,0,0.4)' }} />)}</Box>
                    </Box>
                  )}
                  {l.key === 'footer2' && (
                    <Box sx={{ height: 44, backgroundColor: '#ffffff', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', px: 1.5, py: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>{[1,2,3].map(i => <Box key={i} sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>{[1,2,3].map(j => <Box key={j} sx={{ width: 20, height: 2, borderRadius: 1, bgcolor: '#d1d5db' }} />)}</Box>)}</Box>
                      <Box sx={{ height: 2, bgcolor: '#e5e7eb', mt: 0.5 }} />
                    </Box>
                  )}
                  {l.key === 'footer3' && (
                    <Box sx={{ height: 44, backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', px: 1.5, py: 1 }}>
                      <Box sx={{ display: 'flex', gap: 0.5, mb: 0.5 }}>{[1,2,3,4].map(i => <Box key={i} sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#d1d5db' }} />)}</Box>
                      <Box sx={{ display: 'flex', gap: 0.5 }}><Box sx={{ flex: 1, height: 6, borderRadius: 1, bgcolor: '#e5e7eb' }} /><Box sx={{ width: 16, height: 6, borderRadius: 1, bgcolor: '#111827' }} /></Box>
                    </Box>
                  )}
                  {l.key === 'footer4' && (
                    <Box sx={{ height: 44, backgroundColor: '#18181b', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', px: 1.5, py: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>{[1,2,3].map(i => <Box key={i} sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>{[1,2,3].map(j => <Box key={j} sx={{ width: 18, height: 2, borderRadius: 1, bgcolor: '#52525b' }} />)}</Box>)}</Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>{[1,2].map(i => <Box key={i} sx={{ width: 24, height: 8, borderRadius: 1, bgcolor: '#3f3f46' }} />)}</Box>
                    </Box>
                  )}
                  <Box sx={{ p: 1.5, textAlign: 'center', bgcolor: '#f9fafb' }}>
                    <Typography variant="caption" fontWeight="bold" display="block">{l.label}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10 }}>{l.desc}</Typography>
                    {selectedLayout && <Typography variant="caption" color="success.main" fontWeight="bold">Active</Typography>}
                  </Box>
                </Box>
              </Grid>
              );
            })}
          </Grid>
          <Divider sx={{ mb: 3 }} />

          {/* Footer Style Presets */}
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Footer Style</Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {[
              { key: 'standard',  label: 'Standard',  desc: 'Logo + links + social',   topColor: config.theme.primaryColor,   botColor: config.theme.secondaryColor },
              { key: 'minimal',   label: 'Minimal',   desc: 'Links + copyright only',  topColor: '#1f2937',                    botColor: '#111827' },
              { key: 'dark',      label: 'Dark',      desc: 'Full dark footer',         topColor: '#111827',                    botColor: '#000000' },
              { key: 'light',     label: 'Light',     desc: 'White / light footer',     topColor: '#f9fafb',                    botColor: '#e5e7eb' },
              { key: 'branded',   label: 'Branded',   desc: 'Bold brand color footer',  topColor: config.theme.primaryColor,   botColor: config.theme.accentColor },
            ].map((s) => {
              const selectedStyle = (config.footerConfig?.style || 'standard') === s.key;
              return (
              <Grid item xs={6} sm={4} md={2} key={s.key}>
                <Box
                  onClick={() => setConfig({ ...config, footerConfig: { ...config.footerConfig, style: s.key } })}
                  sx={{
                    cursor: 'pointer', borderRadius: 2, overflow: 'hidden',
                    border: selectedStyle ? `3px solid ${config.theme.primaryColor}` : '3px solid #e5e7eb',
                    boxShadow: selectedStyle ? 4 : 1, transition: 'transform 0.15s, box-shadow 0.15s',
                    '&:hover': { transform: 'scale(1.04)' }
                  }}
                >
                  <Box sx={{ height: 28, bgcolor: s.topColor, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, px: 1 }}>
                    {[1,2,3].map(i => <Box key={i} sx={{ width: 12, height: 3, borderRadius: 1, bgcolor: 'rgba(255,255,255,0.6)' }} />)}
                  </Box>
                  <Box sx={{ height: 14, bgcolor: s.botColor }} />
                  <Box sx={{ p: 1, textAlign: 'center', bgcolor: '#f9fafb' }}>
                    <Typography variant="caption" fontWeight="bold" display="block">{s.label}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10 }}>{s.desc}</Typography>
                    {selectedStyle && <Typography variant="caption" color="success.main" fontWeight="bold" display="block">Active</Typography>}
                  </Box>
                </Box>
              </Grid>
              );
            })}
          </Grid>
          <Divider sx={{ mb: 3 }} />

          {/* Footer Fields */}
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Footer Fields</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <ColorPicker
                label="Footer Background Color"
                value={config.footerConfig?.bgColor || config.theme.primaryColor}
                onChange={(color) => setConfig({ ...config, footerConfig: { ...config.footerConfig, bgColor: color } })}
                helperText="Overrides style preset (leave blank to use theme primary)"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <ColorPicker
                label="Footer Text Color"
                value={config.footerConfig?.textColor || '#ffffff'}
                onChange={(color) => setConfig({ ...config, footerConfig: { ...config.footerConfig, textColor: color } })}
                helperText="Color for footer links and text"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Copyright Text"
                value={config.footer.copyright}
                onChange={(e) => setConfig({ ...config, footer: { ...config.footer, copyright: e.target.value } })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Contact Email"
                value={config.footer.email}
                onChange={(e) => setConfig({ ...config, footer: { ...config.footer, email: e.target.value } })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                value={config.footer.phone}
                onChange={(e) => setConfig({ ...config, footer: { ...config.footer, phone: e.target.value } })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Address"
                value={config.footer.address}
                onChange={(e) => setConfig({ ...config, footer: { ...config.footer, address: e.target.value } })}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={config.footer.showSocialMedia}
                    onChange={(e) => setConfig({ ...config, footer: { ...config.footer, showSocialMedia: e.target.checked } })}
                  />
                }
                label="Show Social Media Icons"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={config.footerConfig?.showAppDownload ?? true}
                    onChange={(e) => setConfig({ ...config, footerConfig: { ...config.footerConfig, showAppDownload: e.target.checked } })}
                  />
                }
                label="Show App Download Buttons"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={config.footerConfig?.showContactInfo ?? true}
                    onChange={(e) => setConfig({ ...config, footerConfig: { ...config.footerConfig, showContactInfo: e.target.checked } })}
                  />
                }
                label="Show Contact Info Column"
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* ── Footer Content ── */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6"><span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><FileText size={18} /> Footer Content (Columns & Links)</span></Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Alert severity="info" sx={{ mb: 3 }}>
            Edit the tagline and link columns shown in all footer layouts. Changes apply to all 4 footer designs.
          </Alert>

          {/* Tagline */}
          <TextField
            fullWidth
            label="Footer Tagline"
            value={config.footerContent?.tagline || ''}
            onChange={(e) => setConfig({ ...config, footerContent: { ...config.footerContent, tagline: e.target.value } })}
            helperText="Short description shown below the logo in the footer"
            sx={{ mb: 3 }}
          />

          {/* Columns */}
          {(config.footerContent?.columns || []).map((col: any, colIdx: number) => (
            <Card key={colIdx} variant="outlined" sx={{ mb: 3, p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <TextField
                  label={`Column ${colIdx + 1} Heading`}
                  value={col.heading}
                  onChange={(e) => {
                    const cols = [...config.footerContent.columns];
                    cols[colIdx] = { ...cols[colIdx], heading: e.target.value };
                    setConfig({ ...config, footerContent: { ...config.footerContent, columns: cols } });
                  }}
                  size="small"
                  sx={{ flex: 1 }}
                />
                <Button color="error" size="small" onClick={() => {
                  const cols = config.footerContent.columns.filter((_: any, i: number) => i !== colIdx);
                  setConfig({ ...config, footerContent: { ...config.footerContent, columns: cols } });
                }}>Remove Column</Button>
              </Box>

              {col.links.map((link: any, linkIdx: number) => (
                <Box key={linkIdx} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
                  <TextField size="small" label="Label" value={link.label} sx={{ flex: 1 }}
                    onChange={(e) => {
                      const cols = [...config.footerContent.columns];
                      cols[colIdx].links[linkIdx] = { ...link, label: e.target.value };
                      setConfig({ ...config, footerContent: { ...config.footerContent, columns: cols } });
                    }}
                  />
                  <TextField size="small" label="URL" value={link.href} sx={{ flex: 1 }}
                    onChange={(e) => {
                      const cols = [...config.footerContent.columns];
                      cols[colIdx].links[linkIdx] = { ...link, href: e.target.value };
                      setConfig({ ...config, footerContent: { ...config.footerContent, columns: cols } });
                    }}
                  />
                  <IconButton size="small" color="error" onClick={() => {
                    const cols = [...config.footerContent.columns];
                    cols[colIdx].links = cols[colIdx].links.filter((_: any, i: number) => i !== linkIdx);
                    setConfig({ ...config, footerContent: { ...config.footerContent, columns: cols } });
                  }}><DeleteIcon fontSize="small" /></IconButton>
                </Box>
              ))}

              <Button size="small" startIcon={<AddIcon />} onClick={() => {
                const cols = [...config.footerContent.columns];
                cols[colIdx].links = [...cols[colIdx].links, { label: '', href: '#' }];
                setConfig({ ...config, footerContent: { ...config.footerContent, columns: cols } });
              }}>Add Link</Button>
            </Card>
          ))}

          <Button variant="outlined" startIcon={<AddIcon />} onClick={() => {
            const cols = [...(config.footerContent?.columns || []), { heading: 'New Column', links: [{ label: 'Link', href: '#' }] }];
            setConfig({ ...config, footerContent: { ...config.footerContent, columns: cols } });
          }}>Add Column</Button>

          {/* Bottom Bar Links */}
          <Divider sx={{ my: 4 }} />
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Bottom Bar Links</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            These links appear at the very bottom of the footer (e.g. Privacy Policy, Terms of Service). They show across all footer layouts.
          </Typography>

          {(config.footerContent?.bottomLinks || []).map((link: any, linkIdx: number) => (
            <Box key={linkIdx} sx={{ display: 'flex', gap: 1, mb: 1.5, alignItems: 'center' }}>
              <Chip label={linkIdx + 1} size="small" sx={{ minWidth: 28, fontWeight: 'bold' }} />
              <TextField size="small" label="Label" value={link.label} sx={{ flex: 1 }}
                onChange={(e) => {
                  const links = [...(config.footerContent?.bottomLinks || [])];
                  links[linkIdx] = { ...link, label: e.target.value };
                  setConfig({ ...config, footerContent: { ...config.footerContent, bottomLinks: links } });
                }}
              />
              <TextField size="small" label="URL" value={link.href} sx={{ flex: 1 }}
                onChange={(e) => {
                  const links = [...(config.footerContent?.bottomLinks || [])];
                  links[linkIdx] = { ...link, href: e.target.value };
                  setConfig({ ...config, footerContent: { ...config.footerContent, bottomLinks: links } });
                }}
              />
              <IconButton size="small" color="error" onClick={() => {
                const links = (config.footerContent?.bottomLinks || []).filter((_: any, i: number) => i !== linkIdx);
                setConfig({ ...config, footerContent: { ...config.footerContent, bottomLinks: links } });
              }}><DeleteIcon fontSize="small" /></IconButton>
            </Box>
          ))}

          <Button size="small" startIcon={<AddIcon />} onClick={() => {
            const links = [...(config.footerContent?.bottomLinks || []), { label: '', href: '#' }];
            setConfig({ ...config, footerContent: { ...config.footerContent, bottomLinks: links } });
          }}>Add Bottom Link</Button>
        </AccordionDetails>
      </Accordion>

      {/* Save Button */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button 
          variant="contained" 
          size="large" 
          onClick={handleSave}
          disabled={saving}
          sx={{ minWidth: 200 }}
        >
          {saving ? 'Saving...' : 'Save All Configuration'}
        </Button>
      </Box>
    </Box>
  );
}