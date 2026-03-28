'use client';
import { useState, useEffect } from 'react';
import {
  Button, TextField, Switch, FormControlLabel,
  Drawer, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, CircularProgress
} from '@mui/material';
import { Add, Edit, Delete, LocalOffer } from '@mui/icons-material';
import { getDeals, createDeal, updateDeal, deleteDeal, getStores } from '@/services/api';
import AdminShell from '@/components/admin/AdminShell';
import ImageUploadField from '@/components/admin/ImageUploadField';
import toast from 'react-hot-toast';

interface Deal {
  _id?: string;
  title: string;
  description?: string;
  discount?: string;
  store?: string;
  category?: string;
  image?: string;
  link?: string;
  type?: string;
  expiryDate?: string;
  isActive: boolean;
  isFeatured?: boolean;
}

const emptyForm: Deal = {
  title: '', description: '', discount: '', store: '', category: '',
  image: '', link: '', type: 'deal', expiryDate: '',
  isActive: true, isFeatured: false,
};

export default function DealsManagement() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [formData, setFormData] = useState<Deal>(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<Deal | null>(null);

  useEffect(() => { fetchDeals(); fetchStores(); }, []);

  const fetchDeals = async () => {
    try {
      const res = await getDeals();
      const data = res.data?.data ?? res.data ?? [];
      setDeals(Array.isArray(data) ? data : []);
    } catch { toast.error('Failed to load deals'); }
    finally { setLoading(false); }
  };

  const fetchStores = async () => {
    try {
      const res = await getStores();
      setStores(res.data?.data ?? res.data ?? []);
    } catch {}
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) { toast.error('Title is required'); return; }
    try {
      if (editingDeal?._id) {
        await updateDeal(editingDeal._id, formData);
        toast.success('Deal updated!');
      } else {
        await createDeal(formData);
        toast.success('Deal created!');
      }
      setDrawerOpen(false); setFormData(emptyForm); setEditingDeal(null); fetchDeals();
    } catch { toast.error('Failed to save deal'); }
  };

  const handleDelete = async () => {
    if (!deleteConfirm?._id) return;
    try {
      await deleteDeal(deleteConfirm._id);
      toast.success('Deal deleted!'); setDeleteConfirm(null); fetchDeals();
    } catch { toast.error('Failed to delete deal'); }
  };

  const openEdit = (d: Deal) => {
    setFormData({ ...d, store: (d.store as any)?._id || d.store || '', type: d.type || 'deal' });
    setEditingDeal(d);
    setDrawerOpen(true);
  };
  const openAdd = () => { setFormData(emptyForm); setEditingDeal(null); setDrawerOpen(true); };
  const set = (patch: Partial<Deal>) => setFormData(f => ({ ...f, ...patch }));

  if (loading) return (
    <AdminShell>
      <div className="flex items-center justify-center h-40 gap-3">
        <CircularProgress size={20} /><p className="text-slate-400">Loading deals...</p>
      </div>
    </AdminShell>
  );

  return (
    <AdminShell>
      {/* Header */}
      <div className="flex justify-between items-center mb-6 p-5 rounded-2xl bg-white border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-orange-50">
            <LocalOffer style={{ color: '#f97316', fontSize: 22 }} />
          </div>
          <div>
            <h2 className="font-bold text-slate-800 text-lg leading-tight">Deals Management</h2>
            <p className="text-slate-400 text-sm mt-0.5">Create and manage deals shown on the homepage</p>
          </div>
        </div>
        <Button variant="contained" startIcon={<Add />} onClick={openAdd}
          style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)', borderRadius: 12, textTransform: 'none', fontWeight: 600, boxShadow: '0 4px 12px rgba(249,115,22,0.3)' }}>
          Add Deal
        </Button>
      </div>

      {/* Empty state */}
      {deals.length === 0 ? (
        <div className="rounded-2xl p-16 flex flex-col items-center gap-4 text-center bg-white border border-slate-100 shadow-sm">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-orange-50">
            <LocalOffer style={{ color: '#f97316', fontSize: 28 }} />
          </div>
          <p className="text-slate-600 font-semibold text-lg">No Deals Yet</p>
          <p className="text-slate-400 text-sm">Create your first deal to show on the homepage</p>
          <Button variant="contained" startIcon={<Add />} onClick={openAdd}
            style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)', borderRadius: 10, textTransform: 'none', marginTop: 8 }}>
            Create First Deal
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {deals.map((deal) => {
            const store = (deal.store as any);
            const storeName = store?.storeName || '';
            const serverUrl = 'http://localhost:5000';
            const logo = deal.image || (store?.logo ? (store.logo.startsWith('http') ? store.logo : `${serverUrl}${store.logo}`) : '');
            return (
              <div key={deal._id} className="rounded-2xl p-5 bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {logo ? (
                      <img src={logo} alt={deal.title} className="w-12 h-12 rounded-lg object-contain border border-slate-100 bg-white p-1" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center">
                        <LocalOffer style={{ color: '#f97316', fontSize: 18 }} />
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{deal.title}</p>
                      {storeName && <p className="text-slate-400 text-xs">{storeName}</p>}
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: deal.isActive ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: deal.isActive ? '#10b981' : '#ef4444' }}>
                    {deal.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                {deal.discount && (
                  <span className="inline-block text-xs font-semibold bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full mb-2">
                    🔥 {deal.discount}
                  </span>
                )}
                {deal.description && <p className="text-slate-500 text-xs mb-3 line-clamp-2">{deal.description}</p>}
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                  <span className="bg-slate-50 px-2 py-0.5 rounded">{deal.type || 'deal'}</span>
                  {deal.category && <span className="bg-slate-50 px-2 py-0.5 rounded">{deal.category}</span>}
                </div>
                <div className="flex gap-2">
                  <IconButton onClick={() => openEdit(deal)} size="small" style={{ background: 'rgba(99,102,241,0.08)', color: '#6366f1', borderRadius: 8 }}>
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton onClick={() => setDeleteConfirm(deal)} size="small" style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444', borderRadius: 8 }}>
                    <Delete fontSize="small" />
                  </IconButton>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Right Side Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: { xs: '100%', sm: 520 } } }}>
        <div className="flex items-center justify-between px-6 py-5" style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)' }}>
          <div className="flex items-center gap-2 text-white">
            <LocalOffer />
            <span className="font-bold text-lg">{editingDeal ? 'Edit Deal' : 'Add New Deal'}</span>
          </div>
          <IconButton onClick={() => setDrawerOpen(false)} size="small" style={{ color: '#fff' }}>
            <span className="text-xl">&times;</span>
          </IconButton>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="flex flex-col gap-5">
            <TextField label="Title *" value={formData.title} onChange={(e) => set({ title: e.target.value })} fullWidth placeholder="e.g., 30% Off Train Essentials"
              InputProps={{ sx: { height: 52, fontSize: 15 } }} />
            <TextField label="Description" value={formData.description} onChange={(e) => set({ description: e.target.value })} fullWidth placeholder="Brief description of the deal" multiline rows={2} />
            <div className="grid grid-cols-2 gap-4">
              <TextField label="Discount" value={formData.discount} onChange={(e) => set({ discount: e.target.value })} fullWidth placeholder="e.g., 30% Off"
                InputProps={{ sx: { height: 48 } }} />
              <TextField label="Store" value={formData.store || ''} onChange={(e) => set({ store: e.target.value })} fullWidth select
                SelectProps={{ native: true, sx: { height: 48, color: '#000' } }}>
                <option value="">Select Store</option>
                {stores.map((s: any) => <option key={s._id} value={s._id}>{s.storeName}</option>)}
              </TextField>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <TextField label="Category" value={formData.category} onChange={(e) => set({ category: e.target.value })} fullWidth placeholder="e.g., Fashion"
                InputProps={{ sx: { height: 48 } }} />
              <TextField label="Type" value={formData.type || 'deal'} onChange={(e) => set({ type: e.target.value })} fullWidth select
                SelectProps={{ native: true, sx: { height: 48, color: '#000' } }}>
                <option value="deal">Deal</option>
                <option value="offer">Offer</option>
                <option value="clearance">Clearance</option>
                <option value="flash">Flash Sale</option>
              </TextField>
            </div>
            <TextField label="Product / Deal URL (Check Price button opens this)" value={formData.link} onChange={(e) => set({ link: e.target.value })} fullWidth
              placeholder="https://www.amazon.in/dp/B0F1BPM734?tag=couponsfeast-21"
              helperText='This URL opens in a new tab when user clicks "Check price" button'
              InputProps={{ sx: { height: 48 } }} />
            <TextField label="Expiry Date" type="date" value={formData.expiryDate ? formData.expiryDate.split('T')[0] : ''} onChange={(e) => set({ expiryDate: e.target.value })} fullWidth InputLabelProps={{ shrink: true }}
              InputProps={{ sx: { height: 48 } }} />

            {/* Deal Image / Logo */}
            <ImageUploadField
              label="Deal Image / Logo"
              value={formData.image || ''}
              onChange={(url) => set({ image: url })}
              helperText="Logo or image shown on the deal card"
              uploadType="deal"
            />

            <div className="flex flex-wrap gap-5 pt-1">
              <FormControlLabel control={<Switch checked={formData.isActive} onChange={(e) => set({ isActive: e.target.checked })} />}
                label={<span className="text-sm text-slate-700">Active</span>} />
              <FormControlLabel control={<Switch checked={formData.isFeatured} onChange={(e) => set({ isFeatured: e.target.checked })} color="warning" />}
                label={<span className="text-sm text-slate-700">⭐ Featured</span>} />
            </div>
          </div>
        </div>
        <div className="flex gap-3 px-6 py-5 border-t border-slate-100 bg-slate-50">
          <Button onClick={() => setDrawerOpen(false)} variant="outlined" fullWidth style={{ height: 44, borderRadius: 10 }}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" fullWidth
            style={{ height: 44, background: 'linear-gradient(135deg,#f97316,#ea580c)', borderRadius: 10, textTransform: 'none', fontWeight: 600 }}>
            {editingDeal ? 'Update Deal' : 'Create Deal'}
          </Button>
        </div>
      </Drawer>

      {/* Delete Confirm */}
      <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} maxWidth="xs" fullWidth>
        <DialogTitle style={{ color: '#ef4444', background: '#fef2f2' }}>
          <div className="flex items-center gap-2"><Delete /><span>Delete Deal</span></div>
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
