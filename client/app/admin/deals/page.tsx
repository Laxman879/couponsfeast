'use client';
import { useState, useEffect } from 'react';
import {
  Button, TextField, Switch, FormControlLabel, MenuItem,
  Drawer, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, CircularProgress
} from '@mui/material';
import { Add, Edit, Delete, LocalOffer, CheckBox as CheckBoxIcon, CheckBoxOutlineBlank } from '@mui/icons-material';
import { getAdminDeals, createDeal, updateDeal, deleteDeal, bulkDeleteDeals, getStores } from '@/services/api';
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
  logo?: string;
  link?: string;
  type?: string;
  expiryDate?: string;
  isActive: boolean;
  isFeatured?: boolean;
  section?: string;
}

const emptyForm: Deal = {
  title: '', description: '', discount: '', store: '', category: '',
  image: '', logo: '', link: '', type: 'deal', expiryDate: '',
  isActive: true, isFeatured: false, section: '',
};

const inputSx = {
  '& .MuiOutlinedInput-root': {
    minHeight: 48,
    borderRadius: '8px',
    '& textarea': { border: 'none', outline: 'none' },
  },
};

const sectionLabels: Record<string, string> = {
  popular_offers: 'Popular Offers of the Day',
  popular_stores: 'Popular Stores',
  top_coupons: 'Today\'s Top Coupons & Offers',
  deals_of_day: 'Deals Of The Day',
  collections: 'Coupon Feast Collections',
  trending_deals: 'Trending Deals',
};

export default function DealsManagement() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [formData, setFormData] = useState<Deal>(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<Deal | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  useEffect(() => { fetchDeals(); fetchStores(); }, []);

  const fetchDeals = async () => {
    try {
      const res = await getAdminDeals();
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

  const toggleSelect = (id: string) => setSelected(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  const toggleAll = () => setSelected(prev => prev.size === deals.length ? new Set() : new Set(deals.map(d => d._id!)));

  const confirmBulkDelete = async () => {
    try {
      const res = await bulkDeleteDeals(Array.from(selected));
      toast.success(res.data?.message || `${selected.size} deal(s) deleted`);
      setSelected(new Set()); fetchDeals();
    } catch { toast.error('Failed to delete deals'); }
    setBulkDeleteOpen(false);
  };

  const openEdit = (d: Deal) => {
    setFormData({ ...d, store: (d.store as any)?._id || d.store || '', type: d.type || 'deal' });
    setEditingDeal(d);
    setDrawerOpen(true);
  };
  const openAdd = () => { setFormData(emptyForm); setEditingDeal(null); setDrawerOpen(true); };
  const set = (patch: Partial<Deal>) => setFormData(f => ({ ...f, ...patch }));

  const renderDealCard = (deal: Deal) => {
    const store = (deal.store as any);
    const storeName = store?.storeName || '';
    const serverUrl = 'http://localhost:5000';
    const logo = deal.logo || (store?.logo ? (store.logo.startsWith('http') ? store.logo : `${serverUrl}${store.logo}`) : '');
    const img = deal.image || '';
    return (
      <div key={deal._id} className="rounded-2xl p-4 bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow" style={{ borderColor: selected.has(deal._id!) ? '#f97316' : undefined }}>
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-3">
            <IconButton size="small" onClick={() => toggleSelect(deal._id!)} style={{ color: selected.has(deal._id!) ? '#f97316' : '#d1d5db' }}>
              {selected.has(deal._id!) ? <CheckBoxIcon /> : <CheckBoxOutlineBlank />}
            </IconButton>
            {logo ? (
              <img src={logo} alt={deal.title} className="w-10 h-10 rounded-full object-contain border border-slate-100 bg-white p-0.5" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            ) : img ? (
              <img src={img} alt={deal.title} className="w-10 h-10 rounded-lg object-cover border border-slate-100" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                <LocalOffer style={{ color: '#f97316', fontSize: 16 }} />
              </div>
            )}
            <div className="min-w-0">
              <p className="font-bold text-slate-800 text-sm truncate">{deal.title}</p>
              {storeName && <p className="text-slate-400 text-xs">{storeName}</p>}
            </div>
          </div>
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0"
            style={{ background: deal.isActive ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: deal.isActive ? '#10b981' : '#ef4444' }}>
            {deal.isActive ? 'Active' : 'Off'}
          </span>
        </div>
        {deal.discount && <span className="inline-block text-xs font-semibold bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full mb-2">{deal.discount}</span>}
        <div className="flex gap-2 mt-2">
          <IconButton onClick={() => openEdit(deal)} size="small" style={{ background: 'rgba(99,102,241,0.08)', color: '#6366f1', borderRadius: 8 }}><Edit fontSize="small" /></IconButton>
          <IconButton onClick={() => setDeleteConfirm(deal)} size="small" style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444', borderRadius: 8 }}><Delete fontSize="small" /></IconButton>
        </div>
      </div>
    );
  };

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
        <div className="flex items-center gap-3">
          {selected.size > 0 && (
            <Button variant="contained" startIcon={<Delete />} onClick={() => setBulkDeleteOpen(true)}
              style={{ background: '#ef4444', borderRadius: 12, textTransform: 'none', fontWeight: 600 }}>Delete ({selected.size})</Button>
          )}
          {deals.length > 0 && (
            <Button variant="outlined" onClick={toggleAll} size="small"
              style={{ borderColor: '#f97316', color: '#f97316', borderRadius: 10, textTransform: 'none', fontSize: 12 }}>
              {selected.size === deals.length ? 'Deselect All' : 'Select All'}
            </Button>
          )}
          <Button variant="contained" startIcon={<Add />} onClick={openAdd}
            style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)', borderRadius: 12, textTransform: 'none', fontWeight: 600, boxShadow: '0 4px 12px rgba(249,115,22,0.3)' }}>
            Add Deal
          </Button>
        </div>
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
        <div className="flex flex-col gap-6">
          {/* Grouped by section */}
          {Object.entries(sectionLabels).map(([sectionKey, sectionLabel]) => {
            const sectionDeals = deals.filter(d => (d as any).section === sectionKey);
            if (sectionDeals.length === 0) return null;
            return (
              <div key={sectionKey}>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-bold text-slate-700 text-sm">{sectionLabel}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600">{sectionDeals.length}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {sectionDeals.map((deal) => renderDealCard(deal))}
                </div>
              </div>
            );
          })}
          {/* Ungrouped deals */}
          {(() => {
            const ungrouped = deals.filter(d => !(d as any).section);
            if (ungrouped.length === 0) return null;
            return (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-bold text-slate-700 text-sm">General (no section)</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">{ungrouped.length}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {ungrouped.map((deal) => renderDealCard(deal))}
                </div>
              </div>
            );
          })()}
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
            <TextField label="Title *" value={formData.title} onChange={(e) => set({ title: e.target.value })} fullWidth placeholder="e.g., 30% Off Train Essentials" sx={inputSx} />
            <TextField label="Description" value={formData.description} onChange={(e) => set({ description: e.target.value })} fullWidth placeholder="Brief description of the deal" multiline rows={2} sx={inputSx} />
            <div className="grid grid-cols-2 gap-4">
              <TextField label="Discount" value={formData.discount} onChange={(e) => set({ discount: e.target.value })} fullWidth placeholder="e.g., 30% Off" sx={inputSx} />
              <TextField label="Store" value={formData.store || ''} onChange={(e) => set({ store: e.target.value })} fullWidth select
                InputLabelProps={{ shrink: true }}
                sx={inputSx}
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
              <TextField label="Category" value={formData.category} onChange={(e) => set({ category: e.target.value })} fullWidth placeholder="e.g., Fashion" sx={inputSx} />
              <TextField label="Type" value={formData.type || 'deal'} onChange={(e) => set({ type: e.target.value })} fullWidth select
                InputLabelProps={{ shrink: true }}
                sx={inputSx}
                SelectProps={{ displayEmpty: true, renderValue: (val: any) => {
                  if (!val) return <span style={{ color: '#9ca3af' }}>Select Type</span>;
                  const labels: Record<string, string> = { deal: 'Deal', offer: 'Offer', clearance: 'Clearance', flash: 'Flash Sale' };
                  return labels[val] || val;
                }}}>
                <MenuItem value="deal">Deal</MenuItem>
                <MenuItem value="offer">Offer</MenuItem>
                <MenuItem value="clearance">Clearance</MenuItem>
                <MenuItem value="flash">Flash Sale</MenuItem>
              </TextField>
            </div>
            <TextField label="Product / Deal URL (Check Price button opens this)" value={formData.link} onChange={(e) => set({ link: e.target.value })} fullWidth
              placeholder="https://www.amazon.in/dp/B0F1BPM734?tag=couponsfeast-21"
              helperText='This URL opens in a new tab when user clicks "Check price" button'
              sx={inputSx} />
            <TextField label="Expiry Date" type="date" value={formData.expiryDate ? formData.expiryDate.split('T')[0] : ''} onChange={(e) => set({ expiryDate: e.target.value })} fullWidth InputLabelProps={{ shrink: true }} sx={inputSx} />

            {/* Deal Image (card background) */}
            <ImageUploadField
              label="Deal Image (card background)"
              value={formData.image || ''}
              onChange={(url) => set({ image: url })}
              helperText="Background image shown on the deal card"
              uploadType="deal"
            />

            {/* Brand Logo (small circle) */}
            <ImageUploadField
              label="Brand Logo (small circle)"
              value={formData.logo || ''}
              onChange={(url) => set({ logo: url })}
              helperText="Small round logo shown between image and text. Falls back to store logo if empty."
              uploadType="logo"
            />

            {/* Homepage Section */}
            <TextField label="Homepage Section" value={formData.section || ''} onChange={(e) => set({ section: e.target.value })} fullWidth select
              helperText="Which homepage section should this deal appear in?"
              InputLabelProps={{ shrink: true }}
              sx={inputSx}
              SelectProps={{ displayEmpty: true, renderValue: (val: any) => {
                if (!val) return <span style={{ color: '#9ca3af' }}>No section (general deal)</span>;
                return sectionLabels[val] || val;
              }}}>
              <MenuItem value=""><em>No section (general deal)</em></MenuItem>
              {Object.entries(sectionLabels).map(([key, label]) => <MenuItem key={key} value={key}>{label}</MenuItem>)}
            </TextField>

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

      {/* Bulk Delete */}
      <Dialog open={bulkDeleteOpen} onClose={() => setBulkDeleteOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle style={{ color: '#ef4444', background: '#fef2f2' }}>
          <div className="flex items-center gap-2"><Delete /><span>Delete {selected.size} Deal(s)</span></div>
        </DialogTitle>
        <DialogContent className="pt-4"><p className="text-slate-600 text-sm">Delete <strong>{selected.size} selected deal(s)</strong>? This cannot be undone.</p></DialogContent>
        <DialogActions className="p-4 bg-slate-50">
          <Button onClick={() => setBulkDeleteOpen(false)} variant="outlined">Cancel</Button>
          <Button onClick={confirmBulkDelete} variant="contained" style={{ background: '#ef4444', borderRadius: 8, textTransform: 'none' }}>Delete All</Button>
        </DialogActions>
      </Dialog>

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
