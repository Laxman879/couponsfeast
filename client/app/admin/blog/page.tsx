'use client';
import { useState, useEffect } from 'react';
import {
  Button, TextField, Switch, FormControlLabel,
  Drawer, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, CircularProgress
} from '@mui/material';
import { Add, Edit, Delete, Article, PlayCircle, Videocam, CheckBox as CheckBoxIcon, CheckBoxOutlineBlank } from '@mui/icons-material';
import { getAdminBlogArticles, createBlogArticle, updateBlogArticle, deleteBlogArticle, bulkDeleteBlogArticles, getSiteConfig, updateSiteConfig } from '@/services/api';
import AdminShell from '@/components/admin/AdminShell';
import ImageUploadField from '@/components/admin/ImageUploadField';
import toast from 'react-hot-toast';

interface BlogArticle {
  _id?: string;
  title: string;
  slug: string;
  category: string;
  subtitle: string;
  description: string;
  image: string;
  content: string[];
  isFeatured: boolean;
  isActive: boolean;
  order: number;
}

const emptyForm: BlogArticle = {
  title: '', slug: '', category: '', subtitle: '', description: '',
  image: '', content: [''], isFeatured: false, isActive: true, order: 0,
};

const defaultPromo = {
  title: 'Earn Up To $100 ExtraBucks At CVS',
  description: "Steal this influencer's top picks from her latest CVS beauty haul.",
  ctaText: 'Click To Watch Video',
  ctaLink: '#',
  image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=400&h=400&fit=crop',
  videoUrl: '',
  bgColor: '#2563eb',
  enabled: true,
};

export default function BlogManagement() {
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<BlogArticle | null>(null);
  const [formData, setFormData] = useState<BlogArticle>(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<BlogArticle | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [promo, setPromo] = useState(defaultPromo);
  const [promoForm, setPromoForm] = useState(defaultPromo);
  const [promoDrawerOpen, setPromoDrawerOpen] = useState(false);
  const [promoSaving, setPromoSaving] = useState(false);

  useEffect(() => { fetchArticles(); fetchPromo(); }, []);

  const fetchPromo = async () => {
    try {
      const res = await getSiteConfig();
      if (res.data?.promoCard) {
        const merged = { ...defaultPromo, ...res.data.promoCard };
        setPromo(merged);
        setPromoForm(merged);
      }
    } catch {}
  };

  const openPromoDrawer = () => { setPromoForm({ ...promo }); setPromoDrawerOpen(true); };

  const savePromo = async () => {
    setPromoSaving(true);
    try {
      await updateSiteConfig({ promoCard: promoForm });
      setPromo({ ...promoForm });
      setPromoDrawerOpen(false);
      toast.success('Promo Card updated!');
    } catch { toast.error('Failed to save Promo Card'); }
    finally { setPromoSaving(false); }
  };

  const fetchArticles = async () => {
    try {
      const res = await getAdminBlogArticles();
      setArticles(res.data?.data ?? []);
    } catch { toast.error('Failed to load articles'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.slug.trim()) { toast.error('Title and slug are required'); return; }
    try {
      if (editing?._id) {
        await updateBlogArticle(editing._id, formData);
        toast.success('Article updated!');
      } else {
        await createBlogArticle(formData);
        toast.success('Article created!');
      }
      setDrawerOpen(false); setFormData(emptyForm); setEditing(null); fetchArticles();
    } catch { toast.error('Failed to save article'); }
  };

  const handleDelete = async () => {
    if (!deleteConfirm?._id) return;
    try {
      await deleteBlogArticle(deleteConfirm._id);
      toast.success('Article deleted!'); setDeleteConfirm(null); fetchArticles();
    } catch { toast.error('Failed to delete'); }
  };

  const toggleSelect = (id: string) => setSelected(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  const toggleAll = () => setSelected(prev => prev.size === articles.length ? new Set() : new Set(articles.map(a => a._id!)));

  const confirmBulkDelete = async () => {
    try {
      const res = await bulkDeleteBlogArticles(Array.from(selected));
      toast.success(res.data?.message || `${selected.size} article(s) deleted`);
      setSelected(new Set()); fetchArticles();
    } catch { toast.error('Failed to delete articles'); }
    setBulkDeleteOpen(false);
  };

  const openEdit = (a: BlogArticle) => { setFormData({ ...a }); setEditing(a); setDrawerOpen(true); };
  const openAdd = () => { setFormData(emptyForm); setEditing(null); setDrawerOpen(true); };
  const set = (patch: Partial<BlogArticle>) => setFormData(f => ({ ...f, ...patch }));

  const autoSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  if (loading) return (
    <AdminShell>
      <div className="flex items-center justify-center h-40 gap-3">
        <CircularProgress size={20} /><p className="text-slate-400">Loading articles...</p>
      </div>
    </AdminShell>
  );

  return (
    <AdminShell>
      {/* Promo Card Preview */}
      <div className="rounded-2xl mb-6 bg-white border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'rgba(37,99,235,0.1)' }}>
              <PlayCircle style={{ color: '#2563eb', fontSize: 20 }} />
            </div>
            <div>
              <h2 className="font-bold text-slate-800 text-lg leading-tight">Homepage Promo Card</h2>
              <p className="text-slate-400 text-xs">The large clover-shaped banner on homepage</p>
            </div>
          </div>
          <Button variant="contained" startIcon={<Edit />} onClick={openPromoDrawer}
            style={{ background: 'linear-gradient(135deg,#3b82f6,#2563eb)', borderRadius: 12, textTransform: 'none', fontWeight: 600 }}>
            Edit Promo
          </Button>
        </div>
        <div className="px-5 pb-5">
          <div className="rounded-xl overflow-hidden flex flex-col sm:flex-row" style={{ border: '1px solid #e2e8f0' }}>
            <div className="relative sm:w-48 h-40 sm:h-auto flex items-center justify-center flex-shrink-0" style={{ backgroundColor: promo.bgColor }}>
              {promo.image ? (
                <img src={promo.image} alt="promo" className="w-24 h-24 rounded-full object-cover border-4 border-white/30" />
              ) : (
                <PlayCircle style={{ color: '#fff', fontSize: 48, opacity: 0.5 }} />
              )}
              <span className={`absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-full ${promo.enabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                {promo.enabled ? '● LIVE' : '● OFF'}
              </span>
            </div>
            <div className="flex-1 p-4 sm:p-5">
              <p className="font-bold text-slate-800 text-base mb-1">{promo.title}</p>
              <p className="text-slate-500 text-sm mb-3 line-clamp-2">{promo.description}</p>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-lg font-medium">{promo.ctaText}</span>
                {promo.videoUrl && (
                  <span className="bg-purple-50 text-purple-600 px-2 py-1 rounded-lg font-medium flex items-center gap-1">
                    <Videocam style={{ fontSize: 12 }} /> Video attached
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Promo Card Drawer */}
      <Drawer anchor="right" open={promoDrawerOpen} onClose={() => setPromoDrawerOpen(false)}
        PaperProps={{ sx: { width: { xs: '100%', sm: 520 } } }}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-6 py-4 flex-shrink-0" style={{ background: 'linear-gradient(135deg,#3b82f6,#2563eb)' }}>
            <div className="flex items-center gap-2 text-white">
              <PlayCircle />
              <span className="font-semibold text-lg">Edit Promo Card</span>
            </div>
            <IconButton onClick={() => setPromoDrawerOpen(false)} style={{ color: '#fff' }}><span className="text-xl leading-none">&times;</span></IconButton>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Promo Card Settings</p>
            <div className="rounded-xl border border-gray-200 p-4 bg-gray-50">
              <FormControlLabel
                control={<Switch checked={promoForm.enabled} onChange={(e) => setPromoForm(p => ({ ...p, enabled: e.target.checked }))} color="primary" />}
                label={<span className="text-sm font-medium text-slate-700">Show Promo Card on Homepage</span>}
              />
            </div>
            <TextField fullWidth label="Title" value={promoForm.title} onChange={(e) => setPromoForm(p => ({ ...p, title: e.target.value }))} variant="outlined" sx={{ '& .MuiInputBase-root': { minHeight: 48 } }} />
            <TextField fullWidth label="Image URL" value={promoForm.image} onChange={(e) => setPromoForm(p => ({ ...p, image: e.target.value }))} placeholder="https://..." variant="outlined" sx={{ '& .MuiInputBase-root': { minHeight: 48 } }} />
            {promoForm.image && <img src={promoForm.image} alt="preview" className="h-16 rounded-lg object-cover border border-gray-100" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />}
            <TextField fullWidth label="Description" value={promoForm.description} onChange={(e) => setPromoForm(p => ({ ...p, description: e.target.value }))} multiline rows={3} variant="outlined" />
            <div className="grid grid-cols-2 gap-4">
              <TextField fullWidth label="CTA Text" value={promoForm.ctaText} onChange={(e) => setPromoForm(p => ({ ...p, ctaText: e.target.value }))} variant="outlined" sx={{ '& .MuiInputBase-root': { minHeight: 48 } }} />
              <TextField fullWidth label="CTA Link" value={promoForm.ctaLink} onChange={(e) => setPromoForm(p => ({ ...p, ctaLink: e.target.value }))} variant="outlined" sx={{ '& .MuiInputBase-root': { minHeight: 48 } }} />
            </div>
            <TextField fullWidth label="Video URL" value={promoForm.videoUrl} onChange={(e) => setPromoForm(p => ({ ...p, videoUrl: e.target.value }))}
              placeholder="https://www.youtube.com/watch?v=... or .mp4 URL"
              helperText="Video plays in modal when user clicks play button"
              variant="outlined" sx={{ '& .MuiInputBase-root': { minHeight: 48 } }} />
          </div>
          <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t flex-shrink-0">
            <Button onClick={() => setPromoDrawerOpen(false)} variant="outlined" style={{ borderRadius: 8, textTransform: 'none' }}>Cancel</Button>
            <Button onClick={savePromo} variant="contained" disabled={promoSaving}
              style={{ background: 'linear-gradient(135deg,#3b82f6,#2563eb)', borderRadius: 8, textTransform: 'none', fontWeight: 600, paddingLeft: 24, paddingRight: 24 }}>
              {promoSaving ? 'Saving...' : 'Update Promo Card'}
            </Button>
          </div>
        </div>
      </Drawer>

      {/* Blog Articles Section */}
      <div className="flex justify-between items-center mb-6 p-5 rounded-2xl bg-white border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-50">
            <Article style={{ color: '#3b82f6', fontSize: 22 }} />
          </div>
          <div>
            <h2 className="font-bold text-slate-800 text-lg leading-tight">Blog Articles</h2>
            <p className="text-slate-400 text-sm mt-0.5">Manage blog section on homepage</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {selected.size > 0 && (
            <Button variant="contained" startIcon={<Delete />} onClick={() => setBulkDeleteOpen(true)}
              style={{ background: '#ef4444', borderRadius: 12, textTransform: 'none', fontWeight: 600 }}>Delete ({selected.size})</Button>
          )}
          {articles.length > 0 && (
            <Button variant="outlined" onClick={toggleAll} size="small"
              style={{ borderColor: '#3b82f6', color: '#3b82f6', borderRadius: 10, textTransform: 'none', fontSize: 12 }}>
              {selected.size === articles.length ? 'Deselect All' : 'Select All'}
            </Button>
          )}
          <Button variant="contained" startIcon={<Add />} onClick={openAdd}
            style={{ background: 'linear-gradient(135deg,#3b82f6,#2563eb)', borderRadius: 12, textTransform: 'none', fontWeight: 600 }}>
            Add Article
          </Button>
        </div>
      </div>

      {articles.length === 0 ? (
        <div className="rounded-2xl p-16 flex flex-col items-center gap-4 text-center bg-white border border-slate-100 shadow-sm">
          <Article style={{ color: '#3b82f6', fontSize: 28 }} />
          <p className="text-slate-600 font-semibold text-lg">No Articles Yet</p>
          <Button variant="contained" startIcon={<Add />} onClick={openAdd}
            style={{ background: 'linear-gradient(135deg,#3b82f6,#2563eb)', borderRadius: 10, textTransform: 'none' }}>
            Create First Article
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {articles.map((a) => (
            <div key={a._id} className="rounded-2xl p-5 bg-white border shadow-sm hover:shadow-md transition-shadow" style={{ borderColor: selected.has(a._id!) ? '#3b82f6' : 'rgb(241 245 249)' }}>
              <div className="flex items-center gap-2 mb-2">
                <IconButton size="small" onClick={() => toggleSelect(a._id!)} style={{ color: selected.has(a._id!) ? '#3b82f6' : '#d1d5db' }}>
                  {selected.has(a._id!) ? <CheckBoxIcon /> : <CheckBoxOutlineBlank />}
                </IconButton>
              </div>
              {a.image && <img src={a.image} alt={a.title} className="w-full h-32 object-cover rounded-lg mb-3" />}
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-bold text-slate-800 text-sm">{a.title}</p>
                  <p className="text-slate-400 text-xs">{a.category}</p>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: a.isActive ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: a.isActive ? '#10b981' : '#ef4444' }}>
                  {a.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              {a.description && <p className="text-slate-500 text-xs mb-3 line-clamp-2">{a.description}</p>}
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                {a.isFeatured && <span className="bg-yellow-50 text-yellow-600 px-2 py-0.5 rounded">⭐ Featured</span>}
                <span className="bg-slate-50 px-2 py-0.5 rounded">/{a.slug}</span>
              </div>
              <div className="flex gap-2">
                <IconButton onClick={() => openEdit(a)} size="small" style={{ background: 'rgba(99,102,241,0.08)', color: '#6366f1', borderRadius: 8 }}>
                  <Edit fontSize="small" />
                </IconButton>
                <IconButton onClick={() => setDeleteConfirm(a)} size="small" style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444', borderRadius: 8 }}>
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
          <div className="flex items-center justify-between px-6 py-4 flex-shrink-0" style={{ background: 'linear-gradient(135deg,#3b82f6,#2563eb)' }}>
            <div className="flex items-center gap-2 text-white">
              <Article />
              <span className="font-semibold text-lg">{editing ? 'Edit Article' : 'Add New Article'}</span>
            </div>
            <IconButton onClick={() => setDrawerOpen(false)} style={{ color: '#fff' }}><span className="text-xl leading-none">&times;</span></IconButton>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Article Information</p>
            <TextField fullWidth label="Title *" value={formData.title} onChange={(e) => { set({ title: e.target.value }); if (!editing) set({ slug: autoSlug(e.target.value) }); }} variant="outlined" placeholder="e.g., Top 10 Beauty Deals" sx={{ '& .MuiInputBase-root': { minHeight: 48 } }} />
            <TextField fullWidth label="Slug *" value={formData.slug} onChange={(e) => set({ slug: e.target.value })} variant="outlined" placeholder="e.g., top-10-beauty-deals" helperText="Auto-generated from title" sx={{ '& .MuiInputBase-root': { minHeight: 48 } }} />
            <div className="grid grid-cols-2 gap-4">
              <TextField fullWidth label="Category" value={formData.category} onChange={(e) => set({ category: e.target.value })} placeholder="e.g., BEAUTY" variant="outlined" sx={{ '& .MuiInputBase-root': { minHeight: 48 } }} />
              <TextField fullWidth label="Order" type="number" value={formData.order} onChange={(e) => set({ order: Number(e.target.value) })} variant="outlined" InputLabelProps={{ shrink: true }} helperText="Lower = shown first" sx={{ '& .MuiInputBase-root': { minHeight: 48 } }} />
            </div>
            <TextField fullWidth label="Subtitle" value={formData.subtitle} onChange={(e) => set({ subtitle: e.target.value })} variant="outlined" placeholder="e.g., Best picks this week" sx={{ '& .MuiInputBase-root': { minHeight: 48 } }} />
            <TextField fullWidth label="Description" value={formData.description} onChange={(e) => set({ description: e.target.value })} multiline rows={3} variant="outlined" />
            <ImageUploadField label="Image" value={formData.image} onChange={(url) => set({ image: url })} uploadType="blog" />
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider pt-2">Content Paragraphs</p>
            {formData.content.map((p, i) => (
              <div key={i} className="flex gap-2 items-start">
                <TextField value={p} onChange={(e) => { const c = [...formData.content]; c[i] = e.target.value; set({ content: c }); }} fullWidth multiline rows={2} placeholder={`Paragraph ${i + 1}`} variant="outlined" />
                <IconButton onClick={() => set({ content: formData.content.filter((_, j) => j !== i) })} size="small" style={{ color: '#ef4444', marginTop: 8 }}>
                  <Delete fontSize="small" />
                </IconButton>
              </div>
            ))}
            <Button size="small" onClick={() => set({ content: [...formData.content, ''] })} style={{ textTransform: 'none', color: '#3b82f6' }}>+ Add Paragraph</Button>
            <div className="rounded-xl border border-gray-200 p-4 bg-gray-50 space-y-1">
              <FormControlLabel control={<Switch checked={formData.isActive} onChange={(e) => set({ isActive: e.target.checked })} color="success" />} label={<span className="text-sm font-medium text-slate-700">Active</span>} />
              <FormControlLabel control={<Switch checked={formData.isFeatured} onChange={(e) => set({ isFeatured: e.target.checked })} color="warning" />} label={<span className="text-sm font-medium text-slate-700">⭐ Featured</span>} />
            </div>
          </div>
          <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t flex-shrink-0">
            <Button onClick={() => setDrawerOpen(false)} variant="outlined" style={{ borderRadius: 8, textTransform: 'none' }}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained"
              style={{ background: 'linear-gradient(135deg,#3b82f6,#2563eb)', borderRadius: 8, textTransform: 'none', fontWeight: 600, paddingLeft: 24, paddingRight: 24 }}>
              {editing ? 'Update Article' : 'Create Article'}
            </Button>
          </div>
        </div>
      </Drawer>

      {/* Bulk Delete */}
      <Dialog open={bulkDeleteOpen} onClose={() => setBulkDeleteOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle style={{ color: '#ef4444', background: '#fef2f2' }}>
          <div className="flex items-center gap-2"><Delete /><span>Delete {selected.size} Article(s)</span></div>
        </DialogTitle>
        <DialogContent className="pt-4"><p className="text-slate-600 text-sm">Delete <strong>{selected.size} selected article(s)</strong>? This cannot be undone.</p></DialogContent>
        <DialogActions className="p-4 bg-slate-50">
          <Button onClick={() => setBulkDeleteOpen(false)} variant="outlined">Cancel</Button>
          <Button onClick={confirmBulkDelete} variant="contained" style={{ background: '#ef4444', borderRadius: 8, textTransform: 'none' }}>Delete All</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} maxWidth="xs" fullWidth>
        <DialogTitle style={{ color: '#ef4444', background: '#fef2f2' }}>
          <div className="flex items-center gap-2"><Delete /><span>Delete Article</span></div>
        </DialogTitle>
        <DialogContent className="pt-4">
          <p className="text-slate-600 text-sm">Delete <strong>&quot;{deleteConfirm?.title}&quot;</strong>? This cannot be undone.</p>
        </DialogContent>
        <DialogActions className="p-4 bg-slate-50">
          <Button onClick={() => setDeleteConfirm(null)} variant="outlined">Cancel</Button>
          <Button onClick={handleDelete} variant="contained" style={{ background: '#ef4444', borderRadius: 8, textTransform: 'none' }}>Delete</Button>
        </DialogActions>
      </Dialog>
    </AdminShell>
  );
}
