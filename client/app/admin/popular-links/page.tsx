'use client';
import { useState, useEffect } from 'react';
import {
  Button, TextField, Switch, FormControlLabel, MenuItem,
  Drawer, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, CircularProgress, Chip
} from '@mui/material';
import { Add, Edit, Delete, Link as LinkIcon } from '@mui/icons-material';
import { getAdminPopularLinks, createPopularLink, updatePopularLink, deletePopularLink } from '@/services/api';
import AdminShell from '@/components/admin/AdminShell';
import toast from 'react-hot-toast';

interface PopularLinkData {
  _id?: string;
  name: string;
  href: string;
  type: string;
  isActive: boolean;
  order: number;
}

const emptyForm: PopularLinkData = { name: '', href: '#', type: 'category', isActive: true, order: 0 };

export default function PopularLinksManagement() {
  const [links, setLinks] = useState<PopularLinkData[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<PopularLinkData | null>(null);
  const [formData, setFormData] = useState<PopularLinkData>(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<PopularLinkData | null>(null);
  const [filter, setFilter] = useState<'all' | 'category' | 'store'>('all');

  useEffect(() => { fetchLinks(); }, []);

  const fetchLinks = async () => {
    try {
      const res = await getAdminPopularLinks();
      setLinks(res.data?.data ?? []);
    } catch { toast.error('Failed to load links'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) { toast.error('Name is required'); return; }
    try {
      if (editing?._id) {
        await updatePopularLink(editing._id, formData);
        toast.success('Link updated!');
      } else {
        await createPopularLink(formData);
        toast.success('Link created!');
      }
      setDrawerOpen(false); setFormData(emptyForm); setEditing(null); fetchLinks();
    } catch { toast.error('Failed to save'); }
  };

  const handleDelete = async () => {
    if (!deleteConfirm?._id) return;
    try {
      await deletePopularLink(deleteConfirm._id);
      toast.success('Deleted!'); setDeleteConfirm(null); fetchLinks();
    } catch { toast.error('Failed to delete'); }
  };

  const openEdit = (l: PopularLinkData) => { setFormData({ ...l }); setEditing(l); setDrawerOpen(true); };
  const openAdd = (type?: string) => { setFormData({ ...emptyForm, type: type || 'category' }); setEditing(null); setDrawerOpen(true); };
  const set = (patch: Partial<PopularLinkData>) => setFormData(f => ({ ...f, ...patch }));

  const filtered = filter === 'all' ? links : links.filter(l => l.type === filter);
  const categories = links.filter(l => l.type === 'category');
  const stores = links.filter(l => l.type === 'store');

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
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-emerald-50">
            <LinkIcon style={{ color: '#10b981', fontSize: 22 }} />
          </div>
          <div>
            <h2 className="font-bold text-slate-800 text-lg leading-tight">Popular Links</h2>
            <p className="text-slate-400 text-sm mt-0.5">
              {categories.length} categories · {stores.length} stores
            </p>
          </div>
        </div>
        <Button variant="contained" startIcon={<Add />} onClick={() => openAdd()}
          style={{ background: 'linear-gradient(135deg,#10b981,#059669)', borderRadius: 12, textTransform: 'none', fontWeight: 600 }}>
          Add Link
        </Button>
      </div>

      <div className="flex gap-2 mb-4">
        {(['all', 'category', 'store'] as const).map(f => (
          <Chip key={f} label={f === 'all' ? `All (${links.length})` : f === 'category' ? `Categories (${categories.length})` : `Stores (${stores.length})`}
            onClick={() => setFilter(f)} variant={filter === f ? 'filled' : 'outlined'}
            color={filter === f ? 'primary' : 'default'} style={{ textTransform: 'capitalize' }} />
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl p-16 flex flex-col items-center gap-4 text-center bg-white border border-slate-100 shadow-sm">
          <LinkIcon style={{ color: '#10b981', fontSize: 28 }} />
          <p className="text-slate-600 font-semibold text-lg">No Links Yet</p>
          <div className="flex gap-2">
            <Button variant="contained" size="small" onClick={() => openAdd('category')}
              style={{ background: '#3b82f6', borderRadius: 8, textTransform: 'none' }}>+ Category</Button>
            <Button variant="contained" size="small" onClick={() => openAdd('store')}
              style={{ background: '#10b981', borderRadius: 8, textTransform: 'none' }}>+ Store</Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filtered.map((l) => (
            <div key={l._id} className="rounded-xl p-4 bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${l.type === 'category' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    {l.type === 'category' ? 'CAT' : 'STORE'}
                  </span>
                  <p className="font-semibold text-slate-800 text-sm truncate">{l.name}</p>
                </div>
                <p className="text-slate-400 text-xs truncate">{l.href}</p>
              </div>
              <div className="flex gap-1 ml-2">
                <IconButton onClick={() => openEdit(l)} size="small" style={{ color: '#6366f1' }}>
                  <Edit fontSize="small" />
                </IconButton>
                <IconButton onClick={() => setDeleteConfirm(l)} size="small" style={{ color: '#ef4444' }}>
                  <Delete fontSize="small" />
                </IconButton>
              </div>
            </div>
          ))}
        </div>
      )}

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: { xs: '100%', sm: 480 } } }}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 flex-shrink-0" style={{ background: 'linear-gradient(135deg,#10b981,#059669)' }}>
            <div className="flex items-center gap-2 text-white">
              <LinkIcon />
              <span className="font-semibold text-lg">{editing ? 'Edit Link' : 'Add New Link'}</span>
            </div>
            <IconButton onClick={() => setDrawerOpen(false)} style={{ color: '#fff' }}><span className="text-xl leading-none">&times;</span></IconButton>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Link Information</p>

            <TextField fullWidth label="Name *" placeholder="e.g., Electronics" value={formData.name}
              onChange={(e) => set({ name: e.target.value })} variant="outlined"
              sx={{ '& .MuiInputBase-root': { minHeight: 48 } }} />

            <TextField fullWidth label="Link URL" placeholder="/category/electronics" value={formData.href}
              onChange={(e) => set({ href: e.target.value })} variant="outlined"
              sx={{ '& .MuiInputBase-root': { minHeight: 48 } }} />

            <div className="grid grid-cols-2 gap-4">
              <TextField fullWidth label="Type" value={formData.type} onChange={(e) => set({ type: e.target.value })} variant="outlined" select
                InputLabelProps={{ shrink: true }}
                sx={{ '& .MuiInputBase-root': { minHeight: 48 } }}
                SelectProps={{ displayEmpty: true, renderValue: (val: any) => {
                  if (!val) return <span style={{ color: '#9ca3af' }}>Select Type</span>;
                  return val === 'category' ? 'Popular Category' : 'Popular Store';
                }}}>
                <MenuItem value="category">Popular Category</MenuItem>
                <MenuItem value="store">Popular Store</MenuItem>
              </TextField>

              <TextField fullWidth label="Order" type="number" value={formData.order}
                onChange={(e) => set({ order: Number(e.target.value) })} variant="outlined"
                InputLabelProps={{ shrink: true }}
                helperText="Lower = shown first"
                sx={{ '& .MuiInputBase-root': { minHeight: 48 } }} />
            </div>

            <div className="rounded-xl border border-gray-200 p-4 bg-gray-50">
              <FormControlLabel
                control={<Switch checked={formData.isActive} onChange={(e) => set({ isActive: e.target.checked })} color="success" />}
                label={<span className="text-sm font-medium text-slate-700">Active (visible on site)</span>}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t flex-shrink-0">
            <Button onClick={() => setDrawerOpen(false)} variant="outlined" style={{ borderRadius: 8, textTransform: 'none' }}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained"
              style={{ background: 'linear-gradient(135deg,#10b981,#059669)', borderRadius: 8, textTransform: 'none', fontWeight: 600, paddingLeft: 24, paddingRight: 24 }}>
              {editing ? 'Update Link' : 'Create Link'}
            </Button>
          </div>
        </div>
      </Drawer>

      <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} maxWidth="xs" fullWidth>
        <DialogTitle style={{ color: '#ef4444', background: '#fef2f2' }}>
          <div className="flex items-center gap-2"><Delete /><span>Delete Link</span></div>
        </DialogTitle>
        <DialogContent className="pt-4">
          <p className="text-slate-600 text-sm">Delete <strong>&quot;{deleteConfirm?.name}&quot;</strong>?</p>
        </DialogContent>
        <DialogActions className="p-4 bg-slate-50">
          <Button onClick={() => setDeleteConfirm(null)} variant="outlined">Cancel</Button>
          <Button onClick={handleDelete} variant="contained" style={{ background: '#ef4444', borderRadius: 8, textTransform: 'none' }}>Delete</Button>
        </DialogActions>
      </Dialog>
    </AdminShell>
  );
}
