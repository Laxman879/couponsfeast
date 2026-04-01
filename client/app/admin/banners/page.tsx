'use client';
import { useState, useEffect, useRef } from 'react';
import {
  Button, TextField, Switch, FormControlLabel, MenuItem,
  Drawer, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, CircularProgress
} from '@mui/material';
import { Add, Edit, Delete, ViewCarousel, CloudUpload } from '@mui/icons-material';
import { getBanners, createBanner, updateBanner, deleteBanner, uploadBannerImage, getStores } from '@/services/api';
import AdminShell from '@/components/admin/AdminShell';
import { BannerRenderer } from '@/components/banner/BannerLayouts';
import toast from 'react-hot-toast';

interface Banner {
  _id?: string;
  title: string;
  label?: string;
  cta?: string;
  image?: string;
  bgColor?: string;
  buttonLink?: string;
  storeUrl?: string;
  textPanelBg?: string;
  textPanelMargin?: number;
  secondaryImage?: string;
  couponCode?: string;
  description?: string;
  discount?: string;
  store?: string;
  expiryDate?: string;
  type?: string;
  labelType?: string;
  interestedUsers?: number;
  addedBy?: string;
  details?: string;
  limitedTime?: boolean;
  expiringToday?: boolean;
  exclusive?: boolean;
  imagePosition?: string;
  isActive: boolean;
}

const emptyForm: Banner = {
  title: '', label: '', cta: 'SHOP NOW', image: '',
  bgColor: '#4a1d96', buttonLink: '/stores', storeUrl: '', couponCode: '',
  textPanelBg: '#ffffff', textPanelMargin: 100,
  secondaryImage: '',
  description: '', discount: '', store: '', expiryDate: '', type: 'code',
  labelType: 'Code', interestedUsers: 0, addedBy: '', details: '',
  limitedTime: false, expiringToday: false, exclusive: false, isActive: true,
  imagePosition: 'right',
};

export default function BannerManagement() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [formData, setFormData] = useState<Banner>(emptyForm);
  const [uploadTarget, setUploadTarget] = useState<'image' | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<Banner | null>(null);
  const [stores, setStores] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchBanners(); fetchStores(); }, []);

  const fetchStores = async () => {
    try {
      const res = await getStores();
      setStores(res.data?.data ?? res.data ?? []);
    } catch {}
  };

  const fetchBanners = async () => {
    try {
      const res = await getBanners();
      const data = res.data?.data ?? res.data ?? [];
      setBanners(Array.isArray(data) ? data : []);
    } catch { toast.error('Failed to load banners'); }
    finally { setLoading(false); }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadTarget) return;
    setUploading(true);
    try {
      const res = await uploadBannerImage(file);
      const serverUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
      const url = res.data.logoUrl.startsWith('http') ? res.data.logoUrl : `${serverUrl}${res.data.logoUrl}`;
      set({ image: url });
      toast.success('Image uploaded!');
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); setUploadTarget(null); }
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) { toast.error('Title is required'); return; }
    try {
      if (editingBanner?._id) {
        await updateBanner(editingBanner._id, formData);
        toast.success('Banner updated!');
      } else {
        await createBanner(formData);
        toast.success('Banner created!');
      }
      setDialogOpen(false); setFormData(emptyForm); setEditingBanner(null); fetchBanners();
    } catch { toast.error('Failed to save banner'); }
  };

  const handleDelete = async () => {
    if (!deleteConfirm?._id) return;
    try {
      await deleteBanner(deleteConfirm._id);
      toast.success('Banner deleted!'); setDeleteConfirm(null); fetchBanners();
    } catch { toast.error('Failed to delete banner'); }
  };

  const openEdit = (b: Banner) => {
    const storeId = (b.store as any)?._id || (b.store as any) || '';
    setFormData({ ...b, store: storeId, type: b.type || 'code' });
    setEditingBanner(b);
    setDialogOpen(true);
  };
  const openAdd = () => { setFormData(emptyForm); setEditingBanner(null); setDialogOpen(true); };
  const set = (patch: Partial<Banner>) => setFormData(f => ({ ...f, ...patch }));
  const triggerUpload = () => { setUploadTarget('image'); setTimeout(() => fileInputRef.current?.click(), 0); };

  const handleStoreChange = (storeId: string) => {
    const selected = stores.find((s: any) => s._id === storeId);
    const domain = selected?.websiteUrl
      ? selected.websiteUrl.replace(/https?:\/\/(www\.)?/, '').replace(/\/$/, '')
      : selected ? `${selected.slug}.com` : '';
    set({ store: storeId, storeUrl: domain ? `https://${domain}` : '' });
  };

  if (loading) return (
    <AdminShell>
      <div className="flex items-center justify-center h-40 gap-3">
        <CircularProgress size={20} /><p className="text-slate-400">Loading banners...</p>
      </div>
    </AdminShell>
  );

  return (
    <AdminShell>
      <div className="flex justify-between items-center mb-6 p-5 rounded-2xl bg-white border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-amber-50">
            <ViewCarousel style={{ color: '#f59e0b', fontSize: 22 }} />
          </div>
          <div>
            <h2 className="font-bold text-slate-800 text-lg leading-tight">Hero Carousel Banners</h2>
            <p className="text-slate-400 text-sm mt-0.5">Manage slides shown on the homepage carousel</p>
          </div>
        </div>
        <Button variant="contained" startIcon={<Add />} onClick={openAdd}
          style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)', borderRadius: 12, textTransform: 'none', fontWeight: 600, boxShadow: '0 4px 12px rgba(245,158,11,0.3)' }}>
          Add Banner
        </Button>
      </div>

      {banners.length === 0 ? (
        <div className="rounded-2xl p-16 flex flex-col items-center gap-4 text-center bg-white border border-slate-100 shadow-sm">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-amber-50">
            <ViewCarousel style={{ color: '#f59e0b', fontSize: 28 }} />
          </div>
          <p className="text-slate-600 font-semibold text-lg">No Banners Yet</p>
          <p className="text-slate-400 text-sm">Create your first banner to enable the hero carousel</p>
          <Button variant="contained" startIcon={<Add />} onClick={openAdd}
            style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)', borderRadius: 10, textTransform: 'none', marginTop: 8 }}>
            Create First Banner
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {banners.map((banner) => (
            <div key={banner._id} className="rounded-2xl p-5 flex items-start justify-between gap-4 bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="w-32 h-20 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: banner.bgColor || '#4a1d96' }}>
                  {banner.image
                    ? <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    : <ViewCarousel style={{ color: '#fff', fontSize: 28 }} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="font-bold text-slate-800 text-base">{banner.title}</p>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: banner.isActive ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: banner.isActive ? '#10b981' : '#ef4444' }}>
                      {banner.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  {banner.label && <p className="text-slate-500 text-xs mb-1 uppercase tracking-widest">{banner.label}</p>}
                  <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
                    <span>CTA: <strong className="text-slate-600">{banner.cta || 'Shop Now'}</strong></span>
                    <span>BG: <span className="inline-block w-3 h-3 rounded-sm align-middle" style={{ backgroundColor: banner.bgColor || '#4a1d96' }} /> <strong className="text-slate-600">{banner.bgColor}</strong></span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <IconButton onClick={() => openEdit(banner)} size="small" style={{ background: 'rgba(99,102,241,0.08)', color: '#6366f1', borderRadius: 8 }}>
                  <Edit fontSize="small" />
                </IconButton>
                <IconButton onClick={() => setDeleteConfirm(banner)} size="small" style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444', borderRadius: 8 }}>
                  <Delete fontSize="small" />
                </IconButton>
              </div>
            </div>
          ))}
        </div>
      )}

      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />

      {/* Right Side Drawer */}
      <Drawer anchor="right" open={dialogOpen} onClose={() => setDialogOpen(false)}
        PaperProps={{ sx: { width: { xs: '100%', sm: 520 } } }}>
        <div className="flex items-center justify-between px-6 py-5" style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)' }}>
          <div className="flex items-center gap-2 text-white">
            <ViewCarousel />
            <span className="font-bold text-lg">{editingBanner ? 'Edit Banner' : 'Add New Banner'}</span>
          </div>
          <IconButton onClick={() => setDialogOpen(false)} size="small" style={{ color: '#fff' }}>
            <span className="text-xl">&times;</span>
          </IconButton>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="flex flex-col gap-5">
            <TextField label="Label (small text above title)" value={formData.label} onChange={(e) => set({ label: e.target.value })} fullWidth placeholder="e.g., THE DAILY DROP"
              InputProps={{ sx: { height: 48 } }} InputLabelProps={{ sx: { fontSize: 14 } }} />
            <TextField label="Title *" value={formData.title} onChange={(e) => set({ title: e.target.value })} fullWidth placeholder="e.g., Get 20% Cash Back on Select Home Decor"
              InputProps={{ sx: { height: 52, fontSize: 15 } }} />
            <TextField label="CTA Text" value={formData.cta} onChange={(e) => set({ cta: e.target.value })} fullWidth placeholder="e.g., SHOP TODAY'S SAVINGS"
              InputProps={{ sx: { height: 48 } }} />
            <div className="grid grid-cols-2 gap-4">
              <TextField label="Button Link" value={formData.buttonLink} onChange={(e) => set({ buttonLink: e.target.value })} fullWidth placeholder="/stores"
                InputProps={{ sx: { height: 48 } }} />
              <TextField label="Background Color" value={formData.bgColor} onChange={(e) => set({ bgColor: e.target.value })} fullWidth placeholder="#4a1d96"
                InputProps={{ sx: { height: 48 }, startAdornment: <span className="inline-block w-5 h-5 rounded mr-2 flex-shrink-0 border border-slate-200" style={{ backgroundColor: formData.bgColor || '#4a1d96' }} /> }} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <TextField label="Text Panel BG" value={formData.textPanelBg} onChange={(e) => set({ textPanelBg: e.target.value })} fullWidth placeholder="#ffffff"
                helperText="White bg = black text, dark bg = white text"
                InputProps={{ sx: { height: 48 }, startAdornment: <span className="inline-block w-5 h-5 rounded mr-2 flex-shrink-0 border border-slate-200" style={{ backgroundColor: formData.textPanelBg || '#ffffff' }} /> }} />
              <TextField label="Image Position" value={formData.imagePosition || 'right'} onChange={(e) => set({ imagePosition: e.target.value })} fullWidth select
                helperText="Where the image focuses"
                InputLabelProps={{ shrink: true }}
                sx={{ '& .MuiInputBase-root': { minHeight: 48 } }}
                SelectProps={{ displayEmpty: true, renderValue: (val: any) => {
                  if (!val) return <span style={{ color: '#9ca3af' }}>Select Position</span>;
                  return val.charAt(0).toUpperCase() + val.slice(1);
                }}}>
                <MenuItem value="right">Right</MenuItem>
                <MenuItem value="center">Center</MenuItem>
                <MenuItem value="left">Left</MenuItem>
                <MenuItem value="top">Top</MenuItem>
                <MenuItem value="bottom">Bottom</MenuItem>
              </TextField>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <TextField label="Text Panel Margin Left (px)" type="number" value={formData.textPanelMargin ?? 100} onChange={(e) => set({ textPanelMargin: Number(e.target.value) })} fullWidth placeholder="100"
                helperText="Distance from left edge in pixels"
                InputProps={{ sx: { height: 48 } }} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <TextField label="Store URL (opens in new tab)" value={formData.storeUrl} onChange={(e) => set({ storeUrl: e.target.value })} fullWidth placeholder="https://makemytrip.com"
                helperText="Opens in new tab on CTA click"
                InputProps={{ sx: { height: 48 } }} />
              <TextField label="Coupon Code" value={formData.couponCode} onChange={(e) => set({ couponCode: e.target.value.toUpperCase() })} fullWidth placeholder="SAVE20"
                helperText="Auto-converted to uppercase"
                InputProps={{ sx: { height: 48 } }} />
            </div>

            {/* Coupon Details Section */}
            <div className="rounded-xl border border-slate-200 p-5">
              <p className="text-sm font-semibold text-slate-700 mb-4">🎟️ Coupon Details</p>
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <TextField label="Discount *" value={formData.discount} onChange={(e) => set({ discount: e.target.value })} fullWidth placeholder="20% OFF"
                    InputProps={{ sx: { height: 48 } }} />
                  <TextField label="Store *" value={formData.store || ''} onChange={(e) => handleStoreChange(e.target.value)} fullWidth select
                    InputLabelProps={{ shrink: true }}
                    sx={{ '& .MuiInputBase-root': { minHeight: 48 } }}
                    SelectProps={{ displayEmpty: true, renderValue: (val: any) => {
                      if (!val) return <span style={{ color: '#9ca3af' }}>Select Store</span>;
                      const s = stores.find((st: any) => st._id === val);
                      return s ? s.storeName : val;
                    }}}>
                    <MenuItem value=""><em>Select Store</em></MenuItem>
                    {stores.map((s: any) => <MenuItem key={s._id} value={s._id}>{s.storeName}</MenuItem>)}
                  </TextField>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <TextField label="Expiry Date" type="date" value={formData.expiryDate ? formData.expiryDate.split('T')[0] : ''} onChange={(e) => set({ expiryDate: e.target.value })} fullWidth InputLabelProps={{ shrink: true }}
                    InputProps={{ sx: { height: 48 } }} />
                  <TextField label="Type" value={formData.type || 'code'} onChange={(e) => set({ type: e.target.value })} fullWidth select
                    InputLabelProps={{ shrink: true }}
                    sx={{ '& .MuiInputBase-root': { minHeight: 48 } }}
                    SelectProps={{ displayEmpty: true, renderValue: (val: any) => {
                      if (!val) return <span style={{ color: '#9ca3af' }}>Select Type</span>;
                      const labels: Record<string, string> = { code: 'Code', sale: 'Sale', cashback: 'Cash Back', freeshipping: 'Free Shipping' };
                      return labels[val] || val;
                    }}}>
                    <MenuItem value="code">Code</MenuItem>
                    <MenuItem value="sale">Sale</MenuItem>
                    <MenuItem value="cashback">Cash Back</MenuItem>
                    <MenuItem value="freeshipping">Free Shipping</MenuItem>
                  </TextField>
                </div>
                <TextField label="Label Type" value={formData.labelType} onChange={(e) => set({ labelType: e.target.value })} fullWidth placeholder="Code"
                  InputProps={{ sx: { height: 48 } }} />
                <TextField label="Details" value={formData.details} onChange={(e) => set({ details: e.target.value })} fullWidth placeholder="Extra details shown on expand" multiline rows={3} />
                <div className="flex flex-wrap gap-5 pt-1">
                  <FormControlLabel control={<Switch checked={formData.limitedTime} onChange={(e) => set({ limitedTime: e.target.checked })} />}
                    label={<span className="text-sm text-slate-700">Limited Time</span>} />
                  <FormControlLabel control={<Switch checked={formData.expiringToday} onChange={(e) => set({ expiringToday: e.target.checked })} />}
                    label={<span className="text-sm text-slate-700">Expiring Today</span>} />
                  <FormControlLabel control={<Switch checked={formData.exclusive} onChange={(e) => set({ exclusive: e.target.checked })} />}
                    label={<span className="text-sm text-slate-700">Exclusive</span>} />
                </div>
              </div>
            </div>

            {/* Banner Images */}
            <div className="rounded-xl border border-slate-200 p-5">
              <p className="text-sm font-semibold text-slate-700 mb-3">Banner Images</p>
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Right Image (main hero shot)</p>
                  <div className="flex gap-3 items-end">
                    <TextField label="Right Image URL" value={formData.image} onChange={(e) => set({ image: e.target.value })} fullWidth placeholder="https://..."
                      InputProps={{ sx: { height: 48 } }} />
                    <Button variant="outlined" onClick={triggerUpload} disabled={uploading}
                      startIcon={uploading ? <CircularProgress size={16} /> : <CloudUpload />}
                      style={{ minWidth: 110, height: 48, textTransform: 'none', borderRadius: 10 }}>
                      Upload
                    </Button>
                  </div>
                  {formData.image && (
                    <img src={formData.image} alt="preview" className="mt-2 h-20 rounded-lg object-cover border border-slate-100"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  )}
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Left Image (shown next to text panel on desktop, hidden on mobile)</p>
                  <TextField label="Left Image URL" value={formData.secondaryImage} onChange={(e) => set({ secondaryImage: e.target.value })} fullWidth placeholder="https://... (optional)"
                    InputProps={{ sx: { height: 48 } }} />
                  {formData.secondaryImage && (
                    <img src={formData.secondaryImage} alt="preview" className="mt-2 h-20 rounded-lg object-cover border border-slate-100"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  )}
                </div>
              </div>
            </div>

            {/* Live preview */}
            {formData.title && (
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest px-4 py-2.5 bg-slate-50 border-b border-slate-100">Live Preview</p>
                <div className="pointer-events-none scale-[0.45] origin-top-left w-[222%]">
                  <BannerRenderer banner={formData} />
                </div>
              </div>
            )}

            <FormControlLabel
              control={<Switch checked={formData.isActive} onChange={(e) => set({ isActive: e.target.checked })} />}
              label={<span className="text-sm font-medium text-slate-700">Active (visible on site)</span>}
            />
          </div>
        </div>
        <div className="flex gap-3 px-6 py-5 border-t border-slate-100 bg-slate-50">
          <Button onClick={() => setDialogOpen(false)} variant="outlined" fullWidth style={{ height: 44, borderRadius: 10 }}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" fullWidth
            style={{ height: 44, background: 'linear-gradient(135deg,#f59e0b,#d97706)', borderRadius: 10, textTransform: 'none', fontWeight: 600 }}>
            {editingBanner ? 'Update Banner' : 'Create Banner'}
          </Button>
        </div>
      </Drawer>

      <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} maxWidth="xs" fullWidth>
        <DialogTitle style={{ color: '#ef4444', background: '#fef2f2' }}>
          <div className="flex items-center gap-2"><Delete /><span>Delete Banner</span></div>
        </DialogTitle>
        <DialogContent className="pt-4">
          <p className="text-slate-600 text-sm">Are you sure you want to delete <strong>"{deleteConfirm?.title}"</strong>? This cannot be undone.</p>
        </DialogContent>
        <DialogActions className="p-4 bg-slate-50">
          <Button onClick={() => setDeleteConfirm(null)} variant="outlined">Cancel</Button>
          <Button onClick={handleDelete} variant="contained" style={{ background: '#ef4444', borderRadius: 8, textTransform: 'none' }}>Delete</Button>
        </DialogActions>
      </Dialog>
    </AdminShell>
  );
}
