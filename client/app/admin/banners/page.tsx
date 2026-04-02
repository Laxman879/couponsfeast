'use client';
import { useState, useEffect, useRef } from 'react';
import {
  Button, TextField, Switch, FormControlLabel, MenuItem,
  Drawer, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, CircularProgress, Chip
} from '@mui/material';
import { Add, Edit, Delete, ViewCarousel, CloudUpload, CheckBox as CheckBoxIcon, CheckBoxOutlineBlank } from '@mui/icons-material';
import { getBanners, createBanner, updateBanner, deleteBanner, uploadBannerImage, getStores, bulkDeleteBanners } from '@/services/api';
import AdminShell from '@/components/admin/AdminShell';
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
  couponCode?: string;
  description?: string;
  discount?: string;
  store?: string;
  bannerType?: string;
  secondDiscount?: string;
  secondDiscountDesc?: string;
  emoji?: string;
  cardBgColor?: string;
  isActive: boolean;
}

const emptyForm: Banner = {
  title: '', label: '', cta: 'SHOP NOW', image: '',
  bgColor: '#4a1d96', buttonLink: '', storeUrl: '', couponCode: '',
  description: '', discount: '', store: '',
  bannerType: 'hero_left',
  secondDiscount: '', secondDiscountDesc: '', emoji: '', cardBgColor: '',
  isActive: true,
};

const bannerTypeLabels: Record<string, string> = {
  hero_left: '🖼️ Left Carousel',
  hero_right: '🃏 Right Card',
};

export default function BannerManagement() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [formData, setFormData] = useState<Banner>(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<Banner | null>(null);
  const [stores, setStores] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  useEffect(() => { fetchBanners(); fetchStores(); }, []);

  const fetchStores = async () => {
    try { const res = await getStores(); setStores(res.data?.data ?? res.data ?? []); } catch {}
  };
  const fetchBanners = async () => {
    try {
      const res = await getBanners();
      setBanners(Array.isArray(res.data?.data ?? res.data) ? (res.data?.data ?? res.data) : []);
    } catch { toast.error('Failed to load banners'); }
    finally { setLoading(false); }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadBannerImage(file);
      const serverUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
      const url = res.data.logoUrl.startsWith('http') ? res.data.logoUrl : `${serverUrl}${res.data.logoUrl}`;
      set({ image: url });
      toast.success('Image uploaded!');
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); }
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) { toast.error('Title is required'); return; }
    try {
      if (editingBanner?._id) { await updateBanner(editingBanner._id, formData); toast.success('Banner updated!'); }
      else { await createBanner(formData); toast.success('Banner created!'); }
      setDialogOpen(false); setFormData(emptyForm); setEditingBanner(null); fetchBanners();
    } catch { toast.error('Failed to save banner'); }
  };

  const handleDelete = async () => {
    if (!deleteConfirm?._id) return;
    try { await deleteBanner(deleteConfirm._id); toast.success('Banner deleted!'); setDeleteConfirm(null); fetchBanners(); }
    catch { toast.error('Failed to delete banner'); }
  };

  const toggleSelect = (id: string) => setSelected(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  const toggleAll = () => setSelected(prev => prev.size === banners.length ? new Set() : new Set(banners.map(b => b._id!)));
  const confirmBulkDelete = async () => {
    try {
      const res = await bulkDeleteBanners(Array.from(selected));
      toast.success(res.data?.message || `${selected.size} banner(s) deleted`);
      setSelected(new Set()); fetchBanners();
    } catch { toast.error('Failed to delete banners'); }
    setBulkDeleteOpen(false);
  };

  const openEdit = (b: Banner) => {
    setFormData({ ...emptyForm, ...b, store: (b.store as any)?._id || (b.store as any) || '' });
    setEditingBanner(b); setDialogOpen(true);
  };
  const openAdd = (type: string) => { setFormData({ ...emptyForm, bannerType: type }); setEditingBanner(null); setDialogOpen(true); };
  const set = (patch: Partial<Banner>) => setFormData(f => ({ ...f, ...patch }));

  const isLeft = formData.bannerType === 'hero_left';
  const leftBanners = banners.filter(b => b.bannerType !== 'hero_right');
  const rightBanners = banners.filter(b => b.bannerType === 'hero_right');

  if (loading) return (
    <AdminShell><div className="flex items-center justify-center h-40 gap-3"><CircularProgress size={20} /><p className="text-slate-400">Loading banners...</p></div></AdminShell>
  );

  const renderBannerCard = (banner: Banner) => (
    <div key={banner._id} className="rounded-2xl p-4 flex items-center justify-between gap-3 bg-white border shadow-sm hover:shadow-md transition-shadow"
      style={{ borderColor: selected.has(banner._id!) ? '#f59e0b' : 'rgb(241 245 249)' }}>
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <IconButton size="small" onClick={() => toggleSelect(banner._id!)} style={{ color: selected.has(banner._id!) ? '#f59e0b' : '#d1d5db' }}>
          {selected.has(banner._id!) ? <CheckBoxIcon /> : <CheckBoxOutlineBlank />}
        </IconButton>
        <div className="w-16 h-10 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: banner.bgColor || '#4a1d96' }}>
          {banner.emoji ? <span className="text-2xl">{banner.emoji}</span> : banner.image
            ? <img src={banner.image} alt="" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            : <ViewCarousel style={{ color: '#fff', fontSize: 18 }} />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-bold text-slate-800 text-sm truncate">{banner.label || banner.title}</p>
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
              style={{ background: banner.isActive ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: banner.isActive ? '#10b981' : '#ef4444' }}>
              {banner.isActive ? 'Active' : 'Off'}
            </span>
          </div>
          <p className="text-slate-400 text-xs truncate">{banner.discount} — {banner.cta}</p>
        </div>
      </div>
      <div className="flex gap-1.5 flex-shrink-0">
        <IconButton onClick={() => openEdit(banner)} size="small" style={{ background: 'rgba(99,102,241,0.08)', color: '#6366f1', borderRadius: 8 }}><Edit fontSize="small" /></IconButton>
        <IconButton onClick={() => setDeleteConfirm(banner)} size="small" style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444', borderRadius: 8 }}><Delete fontSize="small" /></IconButton>
      </div>
    </div>
  );

  return (
    <AdminShell>
      <div className="flex justify-between items-center mb-6 p-5 rounded-2xl bg-white border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-amber-50"><ViewCarousel style={{ color: '#f59e0b', fontSize: 22 }} /></div>
          <div>
            <h2 className="font-bold text-slate-800 text-lg leading-tight">Hero Banner Management</h2>
            <p className="text-slate-400 text-sm mt-0.5">Left carousel slides + Right card panel</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {selected.size > 0 && (
            <Button variant="contained" startIcon={<Delete />} onClick={() => setBulkDeleteOpen(true)}
              style={{ background: '#ef4444', borderRadius: 12, textTransform: 'none', fontWeight: 600 }}>Delete ({selected.size})</Button>
          )}
          {banners.length > 0 && (
            <Button variant="outlined" onClick={toggleAll} size="small"
              style={{ borderColor: '#f59e0b', color: '#f59e0b', borderRadius: 10, textTransform: 'none', fontSize: 12 }}>
              {selected.size === banners.length ? 'Deselect All' : 'Select All'}
            </Button>
          )}
        </div>
      </div>

      {/* Left Carousel Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">🖼️</span>
            <h3 className="font-bold text-slate-700">Left Carousel Slides</h3>
            <Chip label={`${leftBanners.length}`} size="small" style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b', fontWeight: 700 }} />
          </div>
          <Button variant="contained" startIcon={<Add />} onClick={() => openAdd('hero_left')} size="small"
            style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)', borderRadius: 10, textTransform: 'none', fontWeight: 600 }}>Add Slide</Button>
        </div>
        {leftBanners.length === 0
          ? <p className="text-slate-400 text-sm p-4 bg-white rounded-xl border border-slate-100">No left carousel slides yet</p>
          : <div className="flex flex-col gap-2">{leftBanners.map(renderBannerCard)}</div>}
      </div>

      {/* Right Card Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">🃏</span>
            <h3 className="font-bold text-slate-700">Right Card Panel</h3>
            <Chip label={`${rightBanners.length}`} size="small" style={{ background: 'rgba(99,102,241,0.1)', color: '#6366f1', fontWeight: 700 }} />
          </div>
          <Button variant="contained" startIcon={<Add />} onClick={() => openAdd('hero_right')} size="small"
            style={{ background: 'linear-gradient(135deg,#6366f1,#4f46e5)', borderRadius: 10, textTransform: 'none', fontWeight: 600 }}>Add Card</Button>
        </div>
        {rightBanners.length === 0
          ? <p className="text-slate-400 text-sm p-4 bg-white rounded-xl border border-slate-100">No right card banners yet</p>
          : <div className="flex flex-col gap-2">{rightBanners.map(renderBannerCard)}</div>}
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />

      {/* Drawer */}
      <Drawer anchor="right" open={dialogOpen} onClose={() => setDialogOpen(false)} PaperProps={{ sx: { width: { xs: '100%', sm: 520 } } }}>
        <div className="flex items-center justify-between px-6 py-5" style={{ background: isLeft ? 'linear-gradient(135deg,#f59e0b,#d97706)' : 'linear-gradient(135deg,#6366f1,#4f46e5)' }}>
          <div className="flex items-center gap-2 text-white">
            <ViewCarousel />
            <span className="font-bold text-lg">{editingBanner ? 'Edit' : 'Add'} {isLeft ? 'Carousel Slide' : 'Right Card'}</span>
          </div>
          <IconButton onClick={() => setDialogOpen(false)} size="small" style={{ color: '#fff' }}><span className="text-xl">&times;</span></IconButton>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="flex flex-col gap-4">
            {/* Banner Type */}
            <TextField label="Banner Type" value={formData.bannerType || 'hero_left'} onChange={(e) => set({ bannerType: e.target.value })} fullWidth select
              InputLabelProps={{ shrink: true }} sx={{ '& .MuiInputBase-root': { minHeight: 48 } }}
              SelectProps={{ displayEmpty: true, renderValue: (val: any) => bannerTypeLabels[val] || val }}>
              <MenuItem value="hero_left">🖼️ Left Carousel Slide</MenuItem>
              <MenuItem value="hero_right">🃏 Right Card Panel</MenuItem>
            </TextField>

            {/* Common Fields */}
            <TextField label="Brand / Tab Name *" value={formData.label} onChange={(e) => set({ label: e.target.value })} fullWidth placeholder="e.g., Redrail, UBER"
              helperText="Shown in the tab bar below the banner" InputProps={{ sx: { height: 48 } }} />

            {isLeft ? (
              <>
                {/* LEFT CAROUSEL FIELDS */}
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider pt-1">Main Offer</p>
                <TextField label="Headline (big text) *" value={formData.discount} onChange={(e) => set({ discount: e.target.value })} fullWidth placeholder="e.g., UP TO ₹200 OFF"
                  InputProps={{ sx: { height: 48 } }} />
                <TextField label="Sub-headline" value={formData.title} onChange={(e) => set({ title: e.target.value })} fullWidth placeholder="e.g., On Train Ticket Bookings"
                  InputProps={{ sx: { height: 48 } }} />

                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider pt-1">Second Offer (below dashed line)</p>
                <TextField label="Second Discount" value={formData.secondDiscount} onChange={(e) => set({ secondDiscount: e.target.value })} fullWidth placeholder="e.g., FLAT ₹50 OFF"
                  InputProps={{ sx: { height: 48 } }} />
                <TextField label="Second Discount Description" value={formData.secondDiscountDesc} onChange={(e) => set({ secondDiscountDesc: e.target.value })} fullWidth placeholder="e.g., On First Booking"
                  InputProps={{ sx: { height: 48 } }} />

                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider pt-1">Appearance</p>
                <div className="grid grid-cols-2 gap-4">
                  <TextField label="Background Color" value={formData.bgColor} onChange={(e) => set({ bgColor: e.target.value })} fullWidth placeholder="#1a5276"
                    InputProps={{ sx: { height: 48 }, startAdornment: <span className="inline-block w-5 h-5 rounded mr-2 border border-slate-200" style={{ backgroundColor: formData.bgColor || '#4a1d96' }} /> }} />
                  <TextField label="Emoji (right side)" value={formData.emoji} onChange={(e) => set({ emoji: e.target.value })} fullWidth placeholder="🚂"
                    InputProps={{ sx: { height: 48 } }} />
                </div>
                <TextField label="CTA Button Text" value={formData.cta} onChange={(e) => set({ cta: e.target.value })} fullWidth placeholder="BOOK NOW"
                  InputProps={{ sx: { height: 48 } }} />
                <TextField label="Image URL (replaces emoji)" value={formData.image} onChange={(e) => set({ image: e.target.value })} fullWidth placeholder="https://... (optional)"
                  helperText="If set, shows image instead of emoji on right side" InputProps={{ sx: { height: 48 } }} />
                {formData.image && <img src={formData.image} alt="preview" className="h-16 rounded-lg object-cover border border-slate-100" onError={(e) => { e.currentTarget.style.display = 'none'; }} />}
                <Button variant="outlined" onClick={() => fileInputRef.current?.click()} disabled={uploading}
                  startIcon={uploading ? <CircularProgress size={16} /> : <CloudUpload />}
                  style={{ textTransform: 'none', borderRadius: 10 }}>Upload Image</Button>

                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider pt-1">Link</p>
                <TextField label="Store URL (opens on CTA click)" value={formData.storeUrl} onChange={(e) => set({ storeUrl: e.target.value })} fullWidth placeholder="https://redrail.com"
                  InputProps={{ sx: { height: 48 } }} />
              </>
            ) : (
              <>
                {/* RIGHT CARD FIELDS */}
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider pt-1">Card Content</p>
                <TextField label="Badge Text (top of card) *" value={formData.discount} onChange={(e) => set({ discount: e.target.value })} fullWidth placeholder="e.g., FLAT 50% OFF"
                  InputProps={{ sx: { height: 48 } }} />
                <TextField label="Description *" value={formData.title} onChange={(e) => set({ title: e.target.value })} fullWidth placeholder="e.g., Flat 50% OFF On Your First 3 Rides"
                  InputProps={{ sx: { height: 52 } }} />
                <TextField label="CTA Text" value={formData.cta} onChange={(e) => set({ cta: e.target.value })} fullWidth placeholder="GRAB NOW"
                  InputProps={{ sx: { height: 48 } }} />

                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider pt-1">Card Image</p>
                <TextField label="Card Image URL" value={formData.image} onChange={(e) => set({ image: e.target.value })} fullWidth placeholder="https://..."
                  helperText="Image shown in the top section of the card" InputProps={{ sx: { height: 48 } }} />
                {formData.image && <img src={formData.image} alt="preview" className="h-20 rounded-lg object-cover border border-slate-100" onError={(e) => { e.currentTarget.style.display = 'none'; }} />}
                <Button variant="outlined" onClick={() => fileInputRef.current?.click()} disabled={uploading}
                  startIcon={uploading ? <CircularProgress size={16} /> : <CloudUpload />}
                  style={{ textTransform: 'none', borderRadius: 10 }}>Upload Image</Button>

                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider pt-1">Fallback (if no image)</p>
                <div className="grid grid-cols-2 gap-4">
                  <TextField label="Card Top BG Color" value={formData.cardBgColor} onChange={(e) => set({ cardBgColor: e.target.value })} fullWidth placeholder="#1f2937"
                    helperText="Used if no image uploaded"
                    InputProps={{ sx: { height: 48 }, startAdornment: <span className="inline-block w-5 h-5 rounded mr-2 border border-slate-200" style={{ backgroundColor: formData.cardBgColor || '#1f2937' }} /> }} />
                  <TextField label="Emoji" value={formData.emoji} onChange={(e) => set({ emoji: e.target.value })} fullWidth placeholder="🚕"
                    helperText="Shown if no image" InputProps={{ sx: { height: 48 } }} />
                </div>

                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider pt-1">Link</p>
                <TextField label="URL (opens on CTA click)" value={formData.storeUrl} onChange={(e) => set({ storeUrl: e.target.value })} fullWidth placeholder="https://uber.com"
                  InputProps={{ sx: { height: 48 } }} />
              </>
            )}

            <FormControlLabel
              control={<Switch checked={formData.isActive} onChange={(e) => set({ isActive: e.target.checked })} />}
              label={<span className="text-sm font-medium text-slate-700">Active (visible on site)</span>} />
          </div>
        </div>
        <div className="flex gap-3 px-6 py-5 border-t border-slate-100 bg-slate-50">
          <Button onClick={() => setDialogOpen(false)} variant="outlined" fullWidth style={{ height: 44, borderRadius: 10 }}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" fullWidth
            style={{ height: 44, background: isLeft ? 'linear-gradient(135deg,#f59e0b,#d97706)' : 'linear-gradient(135deg,#6366f1,#4f46e5)', borderRadius: 10, textTransform: 'none', fontWeight: 600 }}>
            {editingBanner ? 'Update' : 'Create'} {isLeft ? 'Slide' : 'Card'}
          </Button>
        </div>
      </Drawer>

      {/* Bulk Delete */}
      <Dialog open={bulkDeleteOpen} onClose={() => setBulkDeleteOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle style={{ color: '#ef4444', background: '#fef2f2' }}>
          <div className="flex items-center gap-2"><Delete /><span>Delete {selected.size} Banner(s)</span></div>
        </DialogTitle>
        <DialogContent className="pt-4"><p className="text-slate-600 text-sm">Delete <strong>{selected.size} selected banner(s)</strong>? This cannot be undone.</p></DialogContent>
        <DialogActions className="p-4 bg-slate-50">
          <Button onClick={() => setBulkDeleteOpen(false)} variant="outlined">Cancel</Button>
          <Button onClick={confirmBulkDelete} variant="contained" style={{ background: '#ef4444', borderRadius: 8, textTransform: 'none' }}>Delete All</Button>
        </DialogActions>
      </Dialog>

      {/* Single Delete */}
      <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} maxWidth="xs" fullWidth>
        <DialogTitle style={{ color: '#ef4444', background: '#fef2f2' }}>
          <div className="flex items-center gap-2"><Delete /><span>Delete Banner</span></div>
        </DialogTitle>
        <DialogContent className="pt-4"><p className="text-slate-600 text-sm">Delete <strong>"{deleteConfirm?.label || deleteConfirm?.title}"</strong>?</p></DialogContent>
        <DialogActions className="p-4 bg-slate-50">
          <Button onClick={() => setDeleteConfirm(null)} variant="outlined">Cancel</Button>
          <Button onClick={handleDelete} variant="contained" style={{ background: '#ef4444', borderRadius: 8, textTransform: 'none' }}>Delete</Button>
        </DialogActions>
      </Dialog>
    </AdminShell>
  );
}
