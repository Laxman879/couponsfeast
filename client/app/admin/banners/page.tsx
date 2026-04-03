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
  title: '', label: '', cta: '', image: '',
  bgColor: '#4a1d96', buttonLink: '', storeUrl: '', couponCode: '',
  description: '', discount: '', store: '',
  bannerType: 'hero_left',
  secondDiscount: '', secondDiscountDesc: '', emoji: '', cardBgColor: '',
  isActive: true,
};

const bannerTypeLabels: Record<string, string> = {
  hero_left: '🖼️ Left Carousel',
  hero_right: '🃏 Right Card',
  quick_left: '⚡ Quick Promo (Image + Link + Code)',
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
  const [quickEditMode, setQuickEditMode] = useState(false);

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
    if (!editingBanner && !formData.label?.trim() && !formData.title?.trim() && !formData.discount?.trim()) {
      toast.error('At least Brand Name, Headline, or Badge is required');
      return;
    }
    try {
      if (editingBanner?._id) {
        const patch: any = {};
        for (const key of Object.keys(formData)) {
          if (key === '_id') continue;
          const newVal = (formData as any)[key];
          const oldVal = (editingBanner as any)[key];
          const oldCmp = key === 'store' ? ((oldVal as any)?._id || oldVal || '') : (oldVal ?? '');
          const newCmp = newVal ?? '';
          if (String(newCmp) !== String(oldCmp)) patch[key] = newVal;
        }
        // quick_left: save as hero_left and force-clear all display fields
        if (patch.bannerType === 'quick_left' || formData.bannerType === 'quick_left') {
          patch.bannerType = 'hero_left';
          patch.title = '';
          patch.cta = '';
          patch.discount = '';
          patch.secondDiscount = '';
          patch.secondDiscountDesc = '';
          patch.emoji = '';
        }
        if (Object.keys(patch).length === 0 && formData.bannerType !== 'quick_left') { toast('No changes to save'); setDialogOpen(false); return; }
        await updateBanner(editingBanner._id, patch);
        toast.success('Banner updated!');
      } else {
        const payload = { ...formData, title: formData.title || formData.label || formData.discount || '' };
        // quick_left: save as hero_left and clear display fields
        if (payload.bannerType === 'quick_left') {
          payload.bannerType = 'hero_left';
          payload.title = '';
          payload.cta = '';
          payload.discount = '';
          payload.secondDiscount = '';
          payload.secondDiscountDesc = '';
          payload.emoji = '';
        }
        await createBanner(payload);
        toast.success('Banner created!');
      }
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

  const openEdit = (b: Banner, quick = false) => {
    const merged: any = { ...emptyForm };
    for (const key of Object.keys(merged)) {
      if ((b as any)[key] !== undefined) merged[key] = (b as any)[key];
    }
    merged.store = (b.store as any)?._id || (b.store as any) || '';
    setFormData(merged);
    setEditingBanner(b); setQuickEditMode(quick); setDialogOpen(true);
  };
  const openAdd = (type: string) => { setFormData({ ...emptyForm, cta: type === 'hero_left' ? 'SHOP NOW' : 'GRAB NOW', bannerType: type }); setEditingBanner(null); setQuickEditMode(false); setDialogOpen(true); };

  const set = (patch: Partial<Banner>) => setFormData(f => ({ ...f, ...patch }));

  const formType = formData.bannerType || 'hero_left';
  const isQuick = formType === 'quick_left';
  const isLeft = formType === 'hero_left' || isQuick;
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
          {banner.image
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
        {banner.bannerType !== 'hero_right' && (
          <IconButton onClick={() => openEdit(banner, true)} size="small" title="Quick Edit" style={{ background: 'rgba(16,185,129,0.08)', color: '#10b981', borderRadius: 8 }}><CloudUpload fontSize="small" /></IconButton>
        )}
        <IconButton onClick={() => openEdit(banner)} size="small" title="Full Edit" style={{ background: 'rgba(99,102,241,0.08)', color: '#6366f1', borderRadius: 8 }}><Edit fontSize="small" /></IconButton>
        <IconButton onClick={() => setDeleteConfirm(banner)} size="small" title="Delete" style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444', borderRadius: 8 }}><Delete fontSize="small" /></IconButton>
      </div>
    </div>
  );

  return (
    <AdminShell>
      <div className="sticky top-0 z-10 flex justify-between items-center mb-6 p-5 rounded-2xl bg-white border border-slate-100 shadow-sm">
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
          <Button variant="contained" startIcon={<Add />} onClick={() => openAdd('hero_left')} size="small"
            style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)', borderRadius: 10, textTransform: 'none', fontWeight: 600 }}>Add Slide</Button>
        </div>
      </div>

      {/* Left Carousel Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-700">Left Carousel Slides</h3>
            <Chip label={`${leftBanners.length}`} size="small" style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b', fontWeight: 700 }} />
          </div>
        </div>
        {leftBanners.length === 0
          ? <p className="text-slate-400 text-sm p-4 bg-white rounded-xl border border-slate-100">No left carousel slides yet</p>
          : <div className="flex flex-col gap-2">{leftBanners.map(renderBannerCard)}</div>}
      </div>

      {/* Right Card Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-700">Right Card Panel</h3>
            <Chip label={`${rightBanners.length}`} size="small" style={{ background: 'rgba(99,102,241,0.1)', color: '#6366f1', fontWeight: 700 }} />
          </div>
        </div>
        {rightBanners.length === 0
          ? <p className="text-slate-400 text-sm p-4 bg-white rounded-xl border border-slate-100">No right card banners yet</p>
          : <div className="flex flex-col gap-2">{rightBanners.map(renderBannerCard)}</div>}
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />

      {/* Drawer */}
      <Drawer anchor="right" open={dialogOpen} onClose={() => setDialogOpen(false)} PaperProps={{ sx: { width: { xs: '100%', sm: 520 } } }}>
        <div className="flex items-center justify-between px-6 py-5" style={{ background: quickEditMode || isQuick ? 'linear-gradient(135deg,#10b981,#059669)' : isLeft ? 'linear-gradient(135deg,#f59e0b,#d97706)' : 'linear-gradient(135deg,#6366f1,#4f46e5)' }}>
          <div className="flex items-center gap-2 text-white">
            <ViewCarousel />
            <span className="font-bold text-lg">{quickEditMode ? '⚡ Quick Edit' : isQuick ? '⚡ Quick Promo' : editingBanner ? 'Edit' : 'Add'} {!quickEditMode && !isQuick && (isLeft ? 'Carousel Slide' : 'Right Card')}</span>
          </div>
          <IconButton onClick={() => setDialogOpen(false)} size="small" style={{ color: '#fff' }}><span className="text-xl">&times;</span></IconButton>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="flex flex-col gap-4">

            {/* QUICK EDIT MODE (green button on card) */}
            {quickEditMode ? (
              <>
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Only these fields will be updated</p>
                <TextField label="Tab Name" value={formData.label} onChange={(e) => set({ label: e.target.value })} fullWidth placeholder="e.g., Redrail, UBER" helperText="Shown in the tab bar below the banner"  />
                <TextField label="Banner Image URL" value={formData.image} onChange={(e) => set({ image: e.target.value })} fullWidth placeholder="https://..."  />
                {formData.image && <img src={formData.image} alt="preview" className="h-20 rounded-lg object-cover border border-slate-100" onError={(e) => { e.currentTarget.style.display = 'none'; }} />}
                <Button variant="outlined" onClick={() => fileInputRef.current?.click()} disabled={uploading} startIcon={uploading ? <CircularProgress size={16} /> : <CloudUpload />} style={{ textTransform: 'none', borderRadius: 10, borderColor: '#10b981', color: '#10b981' }}>Upload Image</Button>
                <TextField label="Coupon / Offer Code" value={formData.couponCode} onChange={(e) => set({ couponCode: e.target.value })} fullWidth placeholder="e.g., SAVE20"  />
                <TextField label="Affiliate URL" value={formData.storeUrl} onChange={(e) => set({ storeUrl: e.target.value })} fullWidth placeholder="https://..."  />
              </>
            ) : (
              <>
                {/* Banner Type Select */}
                <TextField label="Banner Type" value={formData.bannerType || 'hero_left'} onChange={(e) => set({ bannerType: e.target.value })} fullWidth select InputLabelProps={{ shrink: true }} sx={{ '& .MuiInputBase-root': { minHeight: 48 } }} SelectProps={{ displayEmpty: true, renderValue: (val: any) => bannerTypeLabels[val] || val }}>
                  <MenuItem value="hero_left">🖼️ Left Carousel Slide</MenuItem>
                  <MenuItem value="hero_right">🃏 Right Card Panel</MenuItem>
                  <MenuItem value="quick_left">⚡ Quick Promo (Image + Link + Code)</MenuItem>
                </TextField>

                {/* QUICK LEFT — minimal fields from dropdown */}
                {isQuick ? (
                  <>
                    <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Minimal banner — no title, no button on site</p>
                    <TextField label="Tab Name" value={formData.label} onChange={(e) => set({ label: e.target.value })} fullWidth placeholder="e.g., Redrail, UBER" helperText="Shown in the tab bar below the banner"  />
                    <TextField label="Banner Image URL" value={formData.image} onChange={(e) => set({ image: e.target.value })} fullWidth placeholder="https://..."  />
                    {formData.image && <img src={formData.image} alt="preview" className="h-20 rounded-lg object-cover border border-slate-100" onError={(e) => { e.currentTarget.style.display = 'none'; }} />}
                    <Button variant="outlined" onClick={() => fileInputRef.current?.click()} disabled={uploading} startIcon={uploading ? <CircularProgress size={16} /> : <CloudUpload />} style={{ textTransform: 'none', borderRadius: 10, borderColor: '#10b981', color: '#10b981' }}>Upload Image</Button>
                    <TextField label="Coupon / Offer Code" value={formData.couponCode} onChange={(e) => set({ couponCode: e.target.value })} fullWidth placeholder="e.g., SAVE20"  />
                    <TextField label="Affiliate URL" value={formData.storeUrl} onChange={(e) => set({ storeUrl: e.target.value })} fullWidth placeholder="https://..."  />
                  </>

                ) : isLeft ? (
                  <>
                    {/* FULL LEFT CAROUSEL */}
                    <TextField label="Brand / Tab Name *" value={formData.label} onChange={(e) => set({ label: e.target.value })} fullWidth placeholder="e.g., Redrail, UBER" helperText="Shown in the tab bar below the banner"  />
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider pt-1">Main Offer</p>
                    <TextField label="Headline (big text) *" value={formData.discount} onChange={(e) => set({ discount: e.target.value })} fullWidth placeholder="e.g., UP TO ₹200 OFF"  />
                    <TextField label="Sub-headline" value={formData.title} onChange={(e) => set({ title: e.target.value })} fullWidth placeholder="e.g., On Train Ticket Bookings"  />
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider pt-1">Second Offer (below dashed line)</p>
                    <TextField label="Second Discount" value={formData.secondDiscount} onChange={(e) => set({ secondDiscount: e.target.value })} fullWidth placeholder="e.g., FLAT ₹50 OFF"  />
                    <TextField label="Second Discount Description" value={formData.secondDiscountDesc} onChange={(e) => set({ secondDiscountDesc: e.target.value })} fullWidth placeholder="e.g., On First Booking"  />
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider pt-1">Appearance</p>
                    <div className="grid grid-cols-2 gap-4">
                      <TextField label="Background Color" value={formData.bgColor} onChange={(e) => set({ bgColor: e.target.value })} fullWidth placeholder="#1a5276" InputProps={{ sx: { height: 48 }, startAdornment: <span className="inline-block w-5 h-5 rounded mr-2 border border-slate-200" style={{ backgroundColor: formData.bgColor || '#4a1d96' }} /> }} />
                      <TextField label="Emoji (right side)" value={formData.emoji} onChange={(e) => set({ emoji: e.target.value })} fullWidth placeholder="🚂"  />
                    </div>
                    <TextField label="CTA Button Text" value={formData.cta} onChange={(e) => set({ cta: e.target.value })} fullWidth placeholder="BOOK NOW"  />
                    <TextField label="Image URL (replaces emoji)" value={formData.image} onChange={(e) => set({ image: e.target.value })} fullWidth placeholder="https://... (optional)" helperText="If set, shows image instead of emoji on right side"  />
                    {formData.image && <img src={formData.image} alt="preview" className="h-16 rounded-lg object-cover border border-slate-100" onError={(e) => { e.currentTarget.style.display = 'none'; }} />}
                    <Button variant="outlined" onClick={() => fileInputRef.current?.click()} disabled={uploading} startIcon={uploading ? <CircularProgress size={16} /> : <CloudUpload />} style={{ textTransform: 'none', borderRadius: 10 }}>Upload Image</Button>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider pt-1">Link</p>
                    <TextField label="Store URL (opens on CTA click)" value={formData.storeUrl} onChange={(e) => set({ storeUrl: e.target.value })} fullWidth placeholder="https://redrail.com"  />
                  </>

                ) : (
                  <>
                    {/* RIGHT CARD */}
                    <TextField label="Brand / Tab Name *" value={formData.label} onChange={(e) => set({ label: e.target.value })} fullWidth placeholder="e.g., UBER" helperText="Shown in the tab bar below the banner"  />
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider pt-1">Card Content</p>
                    <TextField label="Badge Text (top of card) *" value={formData.discount} onChange={(e) => set({ discount: e.target.value })} fullWidth placeholder="e.g., FLAT 50% OFF"  />
                    <TextField label="Description *" value={formData.title} onChange={(e) => set({ title: e.target.value })} fullWidth placeholder="e.g., Flat 50% OFF On Your First 3 Rides"  />
                    <TextField label="CTA Text" value={formData.cta} onChange={(e) => set({ cta: e.target.value })} fullWidth placeholder="GRAB NOW"  />
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider pt-1">Card Image</p>
                    <TextField label="Card Image URL" value={formData.image} onChange={(e) => set({ image: e.target.value })} fullWidth placeholder="https://..." helperText="Image shown in the top section of the card"  />
                    {formData.image && <img src={formData.image} alt="preview" className="h-20 rounded-lg object-cover border border-slate-100" onError={(e) => { e.currentTarget.style.display = 'none'; }} />}
                    <Button variant="outlined" onClick={() => fileInputRef.current?.click()} disabled={uploading} startIcon={uploading ? <CircularProgress size={16} /> : <CloudUpload />} style={{ textTransform: 'none', borderRadius: 10 }}>Upload Image</Button>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider pt-1">Fallback (if no image)</p>
                    <div className="grid grid-cols-2 gap-4">
                      <TextField label="Card Top BG Color" value={formData.cardBgColor} onChange={(e) => set({ cardBgColor: e.target.value })} fullWidth placeholder="#1f2937" helperText="Used if no image uploaded" InputProps={{ sx: { height: 48 }, startAdornment: <span className="inline-block w-5 h-5 rounded mr-2 border border-slate-200" style={{ backgroundColor: formData.cardBgColor || '#1f2937' }} /> }} />
                      <TextField label="Emoji" value={formData.emoji} onChange={(e) => set({ emoji: e.target.value })} fullWidth placeholder="🚕" helperText="Shown if no image"  />
                    </div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider pt-1">Link</p>
                    <TextField label="URL (opens on CTA click)" value={formData.storeUrl} onChange={(e) => set({ storeUrl: e.target.value })} fullWidth placeholder="https://uber.com"  />
                  </>
                )}

                <FormControlLabel
                  control={<Switch checked={formData.isActive} onChange={(e) => set({ isActive: e.target.checked })} />}
                  label={<span className="text-sm font-medium text-slate-700">Active (visible on site)</span>} />
              </>
            )}

          </div>
        </div>
        <div className="flex gap-3 px-6 py-5 border-t border-slate-100 bg-slate-50">
          <Button onClick={() => setDialogOpen(false)} variant="outlined" fullWidth style={{ height: 44, borderRadius: 10 }}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" fullWidth
            style={{ height: 44, background: quickEditMode || isQuick ? 'linear-gradient(135deg,#10b981,#059669)' : isLeft ? 'linear-gradient(135deg,#f59e0b,#d97706)' : 'linear-gradient(135deg,#6366f1,#4f46e5)', borderRadius: 10, textTransform: 'none', fontWeight: 600 }}>
            {quickEditMode ? 'Quick Update' : isQuick ? 'Create Promo' : editingBanner ? 'Update' : 'Create'} {!quickEditMode && !isQuick && (isLeft ? 'Slide' : 'Card')}
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

      {/* Scroll to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 z-20 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 cursor-pointer"
        style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)', color: '#fff' }}
        title="Scroll to top"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6" /></svg>
      </button>
    </AdminShell>
  );
}
