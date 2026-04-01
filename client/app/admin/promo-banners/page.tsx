'use client';
import { useState, useEffect } from 'react';
import {
  Button, TextField, Switch, FormControlLabel, MenuItem,
  Drawer, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, CircularProgress
} from '@mui/material';
import { Add, Edit, Delete, Campaign } from '@mui/icons-material';
import { getAdminPromoBanners, createPromoBanner, updatePromoBanner, deletePromoBanner } from '@/services/api';
import AdminShell from '@/components/admin/AdminShell';
import toast from 'react-hot-toast';

interface PromoBannerData {
  _id?: string;
  logo: string;
  text: string;
  buttonLabel: string;
  storeName: string;
  storeUrl: string;
  couponCode: string;
  discount: string;
  expiryDate: string;
  details: string;
  gradient: string;
  placement: string;
  isActive: boolean;
  order: number;
}

const emptyForm: PromoBannerData = {
  logo: 'amazon', text: '', buttonLabel: 'Get Deal', storeName: '', storeUrl: '',
  couponCode: '', discount: '', expiryDate: '', details: '',
  gradient: 'linear-gradient(90deg, #a855f7 0%, #9333ea 100%)',
  placement: 'both', isActive: true, order: 0,
};

export default function PromoBannersManagement() {
  const [banners, setBanners] = useState<PromoBannerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<PromoBannerData | null>(null);
  const [formData, setFormData] = useState<PromoBannerData>(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<PromoBannerData | null>(null);

  useEffect(() => { fetchBanners(); }, []);

  const fetchBanners = async () => {
    try {
      const res = await getAdminPromoBanners();
      setBanners(res.data?.data ?? []);
    } catch { toast.error('Failed to load promo banners'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async () => {
    if (!formData.text.trim()) { toast.error('Text is required'); return; }
    try {
      if (editing?._id) {
        await updatePromoBanner(editing._id, formData);
        toast.success('Banner updated!');
      } else {
        await createPromoBanner(formData);
        toast.success('Banner created!');
      }
      setDrawerOpen(false); setFormData(emptyForm); setEditing(null); fetchBanners();
    } catch { toast.error('Failed to save'); }
  };

  const handleDelete = async () => {
    if (!deleteConfirm?._id) return;
    try {
      await deletePromoBanner(deleteConfirm._id);
      toast.success('Deleted!'); setDeleteConfirm(null); fetchBanners();
    } catch { toast.error('Failed to delete'); }
  };

  const openEdit = (b: PromoBannerData) => { setFormData({ ...b, expiryDate: b.expiryDate?.split('T')[0] || '' }); setEditing(b); setDrawerOpen(true); };
  const openAdd = () => { setFormData(emptyForm); setEditing(null); setDrawerOpen(true); };
  const set = (patch: Partial<PromoBannerData>) => setFormData(f => ({ ...f, ...patch }));

  const placementLabel: Record<string, string> = { inline: 'Inline Only', sticky: 'Sticky Only', both: 'Both' };

  if (loading) return (
    <AdminShell>
      <div className="flex items-center justify-center h-40 gap-3">
        <CircularProgress size={20} /><p className="text-slate-400">Loading...</p>
      </div>
    </AdminShell>
  );

  return (
    <AdminShell>
      <div className="flex justify-between items-center mb-6 p-5 rounded-2xl bg-white border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-purple-50">
            <Campaign style={{ color: '#9333ea', fontSize: 22 }} />
          </div>
          <div>
            <h2 className="font-bold text-slate-800 text-lg leading-tight">Promo Banners</h2>
            <p className="text-slate-400 text-sm mt-0.5">Manage inline & sticky promo banners</p>
          </div>
        </div>
        <Button variant="contained" startIcon={<Add />} onClick={openAdd}
          style={{ background: 'linear-gradient(135deg,#a855f7,#9333ea)', borderRadius: 12, textTransform: 'none', fontWeight: 600 }}>
          Add Banner
        </Button>
      </div>

      {banners.length === 0 ? (
        <div className="rounded-2xl p-16 flex flex-col items-center gap-4 text-center bg-white border border-slate-100 shadow-sm">
          <Campaign style={{ color: '#9333ea', fontSize: 28 }} />
          <p className="text-slate-600 font-semibold text-lg">No Promo Banners Yet</p>
          <Button variant="contained" startIcon={<Add />} onClick={openAdd}
            style={{ background: 'linear-gradient(135deg,#a855f7,#9333ea)', borderRadius: 10, textTransform: 'none' }}>
            Create First Banner
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {banners.map((b) => (
            <div key={b._id} className="rounded-2xl p-5 bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-full h-12 rounded-lg mb-3 flex items-center justify-center text-white text-xs font-bold" style={{ background: b.gradient }}>
                {b.text.substring(0, 50)}{b.text.length > 50 ? '...' : ''}
              </div>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-bold text-slate-800 text-sm">.{b.logo}</p>
                  <p className="text-slate-400 text-xs">{b.storeName || 'No store'}</p>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: b.isActive ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: b.isActive ? '#10b981' : '#ef4444' }}>
                  {b.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                <span className="bg-purple-50 text-purple-600 px-2 py-0.5 rounded">{placementLabel[b.placement] || b.placement}</span>
                {b.couponCode && <span className="bg-slate-50 px-2 py-0.5 rounded font-mono">{b.couponCode}</span>}
              </div>
              <div className="flex gap-2">
                <IconButton onClick={() => openEdit(b)} size="small" style={{ background: 'rgba(99,102,241,0.08)', color: '#6366f1', borderRadius: 8 }}>
                  <Edit fontSize="small" />
                </IconButton>
                <IconButton onClick={() => setDeleteConfirm(b)} size="small" style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444', borderRadius: 8 }}>
                  <Delete fontSize="small" />
                </IconButton>
              </div>
            </div>
          ))}
        </div>
      )}

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: { xs: '100%', sm: 520 } } }}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-6 py-4 flex-shrink-0" style={{ background: 'linear-gradient(135deg,#a855f7,#9333ea)' }}>
            <div className="flex items-center gap-2 text-white">
              <Campaign />
              <span className="font-semibold text-lg">{editing ? 'Edit Banner' : 'Add Banner'}</span>
            </div>
            <IconButton onClick={() => setDrawerOpen(false)} style={{ color: '#fff' }}><span className="text-xl leading-none">&times;</span></IconButton>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Banner Information</p>
            <TextField label="Banner Text *" value={formData.text} onChange={(e) => set({ text: e.target.value })} fullWidth placeholder="TODAY'S DEAL IS LIVE!" variant="outlined" sx={{ '& .MuiInputBase-root': { minHeight: 48 } }} />
            <div className="grid grid-cols-2 gap-4">
              <TextField label="Logo Tag" value={formData.logo} onChange={(e) => set({ logo: e.target.value })} fullWidth placeholder="amazon" variant="outlined" sx={{ '& .MuiInputBase-root': { minHeight: 48 } }} />
              <TextField label="Button Label" value={formData.buttonLabel} onChange={(e) => set({ buttonLabel: e.target.value })} fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': { minHeight: 48 } }} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <TextField label="Store Name" value={formData.storeName} onChange={(e) => set({ storeName: e.target.value })} fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': { minHeight: 48 } }} />
              <TextField label="Store URL" value={formData.storeUrl} onChange={(e) => set({ storeUrl: e.target.value })} fullWidth placeholder="/view/amazon.com?u=..." variant="outlined" sx={{ '& .MuiInputBase-root': { minHeight: 48 } }} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <TextField label="Coupon Code" value={formData.couponCode} onChange={(e) => set({ couponCode: e.target.value })} fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': { minHeight: 48 } }} />
              <TextField label="Discount" value={formData.discount} onChange={(e) => set({ discount: e.target.value })} fullWidth placeholder="20% Off" variant="outlined" sx={{ '& .MuiInputBase-root': { minHeight: 48 } }} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <TextField label="Expiry Date" type="date" value={formData.expiryDate} onChange={(e) => set({ expiryDate: e.target.value })} fullWidth variant="outlined" InputLabelProps={{ shrink: true }} sx={{ '& .MuiInputBase-root': { minHeight: 48 } }} />
              <TextField label="Order" type="number" value={formData.order} onChange={(e) => set({ order: Number(e.target.value) })} fullWidth variant="outlined" InputLabelProps={{ shrink: true }} helperText="Lower = shown first" sx={{ '& .MuiInputBase-root': { minHeight: 48 } }} />
            </div>
            <TextField label="Gradient CSS" value={formData.gradient} onChange={(e) => set({ gradient: e.target.value })} fullWidth placeholder="linear-gradient(90deg, #a855f7, #9333ea)" variant="outlined" sx={{ '& .MuiInputBase-root': { minHeight: 48 } }} />
            <div className="w-full h-10 rounded-lg" style={{ background: formData.gradient }} />
            <TextField label="Placement" value={formData.placement} onChange={(e) => set({ placement: e.target.value })} fullWidth select variant="outlined"
              InputLabelProps={{ shrink: true }}
              sx={{ '& .MuiInputBase-root': { minHeight: 48 } }}
              SelectProps={{ displayEmpty: true, renderValue: (val: any) => {
                if (!val) return <span style={{ color: '#9ca3af' }}>Select Placement</span>;
                const labels: Record<string, string> = { both: 'Both (Inline + Sticky)', inline: 'Inline Only', sticky: 'Sticky Only' };
                return labels[val] || val;
              }}}>
              <MenuItem value="both">Both (Inline + Sticky)</MenuItem>
              <MenuItem value="inline">Inline Only</MenuItem>
              <MenuItem value="sticky">Sticky Only</MenuItem>
            </TextField>
            <TextField label="Details" value={formData.details} onChange={(e) => set({ details: e.target.value })} fullWidth multiline rows={2} variant="outlined" />
            <div className="rounded-xl border border-gray-200 p-4 bg-gray-50">
              <FormControlLabel control={<Switch checked={formData.isActive} onChange={(e) => set({ isActive: e.target.checked })} color="success" />} label={<span className="text-sm font-medium text-slate-700">Active (visible on site)</span>} />
            </div>
          </div>
          <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t flex-shrink-0">
            <Button onClick={() => setDrawerOpen(false)} variant="outlined" style={{ borderRadius: 8, textTransform: 'none' }}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained"
              style={{ background: 'linear-gradient(135deg,#a855f7,#9333ea)', borderRadius: 8, textTransform: 'none', fontWeight: 600, paddingLeft: 24, paddingRight: 24 }}>
              {editing ? 'Update Banner' : 'Create Banner'}
            </Button>
          </div>
        </div>
      </Drawer>

      <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} maxWidth="xs" fullWidth>
        <DialogTitle style={{ color: '#ef4444', background: '#fef2f2' }}>
          <div className="flex items-center gap-2"><Delete /><span>Delete Banner</span></div>
        </DialogTitle>
        <DialogContent className="pt-4">
          <p className="text-slate-600 text-sm">Delete this promo banner? This cannot be undone.</p>
        </DialogContent>
        <DialogActions className="p-4 bg-slate-50">
          <Button onClick={() => setDeleteConfirm(null)} variant="outlined">Cancel</Button>
          <Button onClick={handleDelete} variant="contained" style={{ background: '#ef4444', borderRadius: 8, textTransform: 'none' }}>Delete</Button>
        </DialogActions>
      </Dialog>
    </AdminShell>
  );
}
