'use client';
import { useEffect, useState } from 'react';
import {
  Typography, Button, Table, TableBody, TableCell, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions, Chip, Avatar,
  TextField, Drawer, IconButton, Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import AdminShell from '@/components/admin/AdminShell';
import { getStores, createStore, updateStore, deleteStore, bulkDeleteStores } from '@/services/api';
import toast from 'react-hot-toast';
import { Add, Edit, Delete, Store, Language, Close, ExpandMore, CheckBox, CheckBoxOutlineBlank, IndeterminateCheckBox } from '@mui/icons-material';
import ImageUploadField from '@/components/admin/ImageUploadField';

const defaultForm = {
  storeName: '', slug: '', logo: '', description: '', websiteUrl: '',
  logoBgColor: '#000000', customDate: '',
  promoInfo: { heading: '', logoBgColor: '#fef9c3', logoText: '', sections: [] as { title: string; body: string }[] },
  storeInfo: { heading: '', subheading: '', sales: [] as { title: string; desc: string }[] },
  aboutSection: { heading: '', paragraphs: [] as string[] },
  sidebarData: {
    authorName: '', authorRole: '', authorImage: '', authorBio: '', authorBioUrl: '',
    trustText: '', lastVerified: '', howToSteps: [] as string[], commissionNote: '',
    featuredArticleImage: '', featuredArticleTitle: '', featuredArticleDesc: '', featuredArticleAuthor: '', featuredArticleUrl: '',
    storeAddress: '', storeRating: 5, storeRatingCount: 0, inStoreCoupons: 0
  },
  faqs: { heading: '', items: [] as { question: string; answer: string }[] }
};

export default function AdminStores() {
  const [stores, setStores] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [storeToDelete, setStoreToDelete] = useState<any>(null);
  const [formData, setFormData] = useState({ ...defaultForm });
  const [editId, setEditId] = useState<string | null>(null);
  const [slugManual, setSlugManual] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  useEffect(() => { fetchStores(); }, []);

  const fetchStores = async () => {
    try { const res = await getStores(); setStores(res.data); }
    catch (error) { console.error('Error fetching stores:', error); }
  };

  const closeDrawer = () => { setOpen(false); setEditId(null); setFormData({ ...defaultForm }); setSlugManual(false); };

  const handleSubmit = async () => {
    try {
      const data = { ...formData, slug: formData.slug || formData.storeName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') };
      if (editId) { await updateStore(editId, data); toast.success('Store updated!'); }
      else { await createStore(data); toast.success('Store created!'); }
      closeDrawer(); fetchStores();
    } catch (error: any) { toast.error(error.response?.data?.error || error.message || 'Failed to save store'); }
  };

  const handleEdit = (store: any) => {
    setFormData({
      ...defaultForm, ...store,
      promoInfo: { ...defaultForm.promoInfo, ...(store.promoInfo || {}) },
      storeInfo: { ...defaultForm.storeInfo, ...(store.storeInfo || {}) },
      aboutSection: { ...defaultForm.aboutSection, ...(store.aboutSection || {}) },
      sidebarData: { ...defaultForm.sidebarData, ...(store.sidebarData || {}) },
      faqs: { ...defaultForm.faqs, ...(store.faqs || {}) },
    });
    setEditId(store._id); setSlugManual(false); setOpen(true);
  };

  const confirmDelete = async () => {
    if (storeToDelete) {
      try { await deleteStore(storeToDelete._id); toast.success('Store deleted!'); fetchStores(); }
      catch (error: any) { toast.error(error.response?.data?.error || 'Failed to delete store'); }
    }
    setDeleteOpen(false); setStoreToDelete(null);
  };

  const toggleSelect = (id: string) => setSelected(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  const toggleAll = () => setSelected(prev => prev.size === stores.length ? new Set() : new Set(stores.map((s: any) => s._id)));
  const isAllSelected = stores.length > 0 && selected.size === stores.length;
  const isSomeSelected = selected.size > 0 && selected.size < stores.length;

  const confirmBulkDelete = async () => {
    try {
      const res = await bulkDeleteStores(Array.from(selected));
      toast.success(res.data?.message || `${selected.size} store(s) deleted`);
      setSelected(new Set()); fetchStores();
    } catch (error: any) { toast.error(error.response?.data?.error || 'Failed to delete stores'); }
    setBulkDeleteOpen(false);
  };

  const f = (field: string, val: any) => setFormData(p => ({ ...p, [field]: val }));
  const fp = (field: string, val: any) => setFormData(p => ({ ...p, promoInfo: { ...p.promoInfo, [field]: val } }));
  const fi = (field: string, val: any) => setFormData(p => ({ ...p, storeInfo: { ...p.storeInfo, [field]: val } }));
  const fa = (field: string, val: any) => setFormData(p => ({ ...p, aboutSection: { ...p.aboutSection, [field]: val } }));
  const fs = (field: string, val: any) => setFormData(p => ({ ...p, sidebarData: { ...p.sidebarData, [field]: val } }));

  const ff = (field: string, val: any) => setFormData(p => ({ ...p, faqs: { ...p.faqs, [field]: val } }));

  const inputSx = { '& .MuiInputBase-root': { minHeight: 48 } };
  const accStyle = { background: 'rgba(99,102,241,0.03)', border: '1px solid rgba(99,102,241,0.1)', borderRadius: '12px !important', '&:before': { display: 'none' }, mb: 1.5 };
  const accTitle = (label: string, color: string) => <span style={{ fontSize: 13, fontWeight: 700, color, textTransform: 'uppercase' as const, letterSpacing: 0.5 }}>{label}</span>;

  return (
    <AdminShell>
      <div className="flex justify-between items-center mb-6 p-5 rounded-2xl" style={{ background: '#fff', boxShadow: '0 2px 16px rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.07)' }}>
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.08)' }}><Store style={{ color: '#6366f1', fontSize: 20 }} /></div>
          <div>
            <h2 className="font-bold text-gray-900 text-lg leading-tight">Store Management</h2>
            <p className="text-gray-400 text-xs">Manage your stores, logos, and store information</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {selected.size > 0 && (
            <Button variant="contained" startIcon={<Delete />} onClick={() => setBulkDeleteOpen(true)} size="medium"
              style={{ background: '#ef4444', borderRadius: 12, textTransform: 'none', fontWeight: 600 }}>Delete ({selected.size})</Button>
          )}
          {stores.length > 0 && (
            <Button variant="outlined" onClick={toggleAll} size="small"
              style={{ borderColor: '#6366f1', color: '#6366f1', borderRadius: 10, textTransform: 'none', fontSize: 12 }}>
              {isAllSelected ? 'Deselect All' : 'Select All'}
            </Button>
          )}
          <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)} size="medium"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: 12, textTransform: 'none', fontWeight: 600, boxShadow: '0 4px 12px rgba(99,102,241,0.35)' }}>Add Store</Button>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', boxShadow: '0 2px 16px rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.07)' }}>
        <Table>
          <TableHead>
            <TableRow style={{ background: 'rgba(99,102,241,0.04)' }}>
              <TableCell padding="checkbox" style={{ width: 48 }}>
                <IconButton size="small" onClick={toggleAll} style={{ color: '#6366f1' }}>
                  {isAllSelected ? <CheckBox /> : isSomeSelected ? <IndeterminateCheckBox /> : <CheckBoxOutlineBlank />}
                </IconButton>
              </TableCell>
              {['Store Info', 'Slug', 'Website', 'Actions'].map((h, i) => (
                <TableCell key={h} className={i === 3 ? 'text-center' : ''} style={{ color: '#6366f1', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700 }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {stores.map((store) => (
              <TableRow key={store._id} className="hover:bg-gray-50 transition-colors" style={{ background: selected.has(store._id) ? 'rgba(99,102,241,0.04)' : undefined }}>
                <TableCell padding="checkbox">
                  <IconButton size="small" onClick={() => toggleSelect(store._id)} style={{ color: selected.has(store._id) ? '#6366f1' : '#d1d5db' }}>
                    {selected.has(store._id) ? <CheckBox /> : <CheckBoxOutlineBlank />}
                  </IconButton>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {store.logo ? <Avatar src={store.logo} style={{ width: 36, height: 36 }} /> : <Avatar style={{ background: 'rgba(99,102,241,0.1)', color: '#6366f1', width: 36, height: 36 }}><Store style={{ fontSize: 16 }} /></Avatar>}
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{store.storeName}</p>
                      {store.description && <p className="text-gray-400 text-xs">{store.description.length > 50 ? `${store.description.substring(0, 50)}...` : store.description}</p>}
                    </div>
                  </div>
                </TableCell>
                <TableCell><Chip label={store.slug} size="small" style={{ background: 'rgba(99,102,241,0.08)', color: '#6366f1', fontFamily: 'monospace', fontSize: 11 }} /></TableCell>
                <TableCell>
                  {store.websiteUrl ? <a href={store.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 no-underline" style={{ color: '#6366f1' }}><Language style={{ fontSize: 14 }} /><span className="text-sm">Visit Site</span></a> : <span className="text-gray-400 italic text-sm">No website</span>}
                </TableCell>
                <TableCell>
                  <div className="flex justify-center gap-2">
                    <Button size="small" variant="outlined" startIcon={<Edit />} onClick={() => handleEdit(store)} style={{ borderColor: '#6366f1', color: '#6366f1', borderRadius: 8, textTransform: 'none', fontSize: 12 }}>Edit</Button>
                    <Button size="small" variant="outlined" startIcon={<Delete />} onClick={() => { setStoreToDelete(store); setDeleteOpen(true); }} style={{ borderColor: '#ef4444', color: '#ef4444', borderRadius: 8, textTransform: 'none', fontSize: 12 }}>Delete</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {stores.length === 0 && (
              <TableRow><TableCell colSpan={5} className="text-center py-16">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.08)' }}><Store style={{ color: '#6366f1', fontSize: 24 }} /></div>
                  <p className="text-gray-500 font-medium">No Stores Found</p>
                  <p className="text-gray-400 text-sm">Click "Add Store" to create your first store</p>
                </div>
              </TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Right Drawer */}
      <Drawer anchor="right" open={open} onClose={closeDrawer}>
        <div className="w-[520px] h-full flex flex-col">
          <div className="flex items-center justify-between px-6 py-4" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            <div className="flex items-center gap-2 text-white"><Store /><span className="font-semibold text-lg">{editId ? 'Edit Store' : 'Add New Store'}</span></div>
            <IconButton onClick={closeDrawer} style={{ color: '#fff' }}><Close /></IconButton>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* Basic Info */}
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Basic Information</p>
            <TextField fullWidth label="Store Name *" placeholder="e.g., Amazon, Target" value={formData.storeName}
              onChange={(e) => { const v = e.target.value; setFormData(p => ({ ...p, storeName: v, ...(!slugManual ? { slug: v.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') } : {}) })); }} required variant="outlined"
              sx={{ '& .MuiInputBase-root': { height: 48 } }} />
            <TextField fullWidth label="Slug" placeholder="Auto-generated" value={formData.slug} onChange={(e) => { setSlugManual(true); f('slug', e.target.value); }} helperText="URL-friendly name" variant="outlined"
              sx={{ '& .MuiInputBase-root': { height: 48 } }} />
            <ImageUploadField label="Logo" value={formData.logo} onChange={(url) => f('logo', url)} uploadType="logo" />
            <TextField fullWidth label="Website URL" placeholder="https://www.store.com" value={formData.websiteUrl} onChange={(e) => f('websiteUrl', e.target.value)} variant="outlined"
              InputProps={{ startAdornment: <Language className="text-gray-400 mr-2" /> }} sx={{ '& .MuiInputBase-root': { height: 48 } }} />
            <TextField fullWidth label="Description" placeholder="Brief description of the store" value={formData.description} onChange={(e) => f('description', e.target.value)} multiline rows={3} variant="outlined" />

            {/* Header Settings */}
            <Accordion disableGutters elevation={0} sx={accStyle}>
              <AccordionSummary expandIcon={<ExpandMore />}>{accTitle('Header Settings', '#10b981')}</AccordionSummary>
              <AccordionDetails className="space-y-4 pt-2">
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-2">Logo Background Color</p>
                  <div className="flex items-center gap-3">
                    <input type="color" value={formData.logoBgColor} onChange={e => f('logoBgColor', e.target.value)} className="w-12 h-11 rounded-lg cursor-pointer border border-gray-300" />
                    <input type="text" value={formData.logoBgColor} onChange={e => f('logoBgColor', e.target.value)} className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-sm font-mono" />
                  </div>
                </div>
                <TextField fullWidth label="Custom Date Label" placeholder="Leave blank for today's date" value={formData.customDate} onChange={e => f('customDate', e.target.value)} variant="outlined" helperText="Leave blank to use today's date automatically" sx={inputSx} />
              </AccordionDetails>
            </Accordion>

            {/* Promo Info */}
            <Accordion disableGutters elevation={0} sx={accStyle}>
              <AccordionSummary expandIcon={<ExpandMore />}>{accTitle('Promo Info', '#f59e0b')}</AccordionSummary>
              <AccordionDetails className="space-y-4 pt-2">
                <TextField fullWidth label="Heading" placeholder="Store Promo Codes" value={formData.promoInfo.heading} onChange={e => fp('heading', e.target.value)} variant="outlined" sx={inputSx} />
                <TextField fullWidth label="Logo Text" placeholder="e.g. alo" value={formData.promoInfo.logoText} onChange={e => fp('logoText', e.target.value)} variant="outlined" helperText="Shown if no logo image" sx={inputSx} />
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-2">Logo Card Background</p>
                  <div className="flex items-center gap-3">
                    <input type="color" value={formData.promoInfo.logoBgColor} onChange={e => fp('logoBgColor', e.target.value)} className="w-12 h-11 rounded-lg cursor-pointer border border-gray-300" />
                    <input type="text" value={formData.promoInfo.logoBgColor} onChange={e => fp('logoBgColor', e.target.value)} className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-sm font-mono" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-gray-600">Sections</p>
                  <Button size="small" onClick={() => fp('sections', [...formData.promoInfo.sections, { title: '', body: '' }])} style={{ color: '#f59e0b', textTransform: 'none', fontSize: 12 }}>+ Add Section</Button>
                </div>
                {formData.promoInfo.sections.map((s, i) => (
                  <div key={i} className="border rounded-lg p-3 bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-gray-500">Section {i + 1}</span>
                      <Button size="small" onClick={() => fp('sections', formData.promoInfo.sections.filter((_, idx) => idx !== i))} style={{ color: '#ef4444', minWidth: 0, fontSize: 12 }}>✕</Button>
                    </div>
                    <TextField fullWidth label="Title" value={s.title} onChange={e => { const arr = [...formData.promoInfo.sections]; arr[i] = { ...arr[i], title: e.target.value }; fp('sections', arr); }} variant="outlined" sx={inputSx} />
                    <TextField fullWidth label="Body" value={s.body} onChange={e => { const arr = [...formData.promoInfo.sections]; arr[i] = { ...arr[i], body: e.target.value }; fp('sections', arr); }} variant="outlined" multiline rows={3} style={{ marginTop: 10 }} />
                  </div>
                ))}
              </AccordionDetails>
            </Accordion>

            {/* Store Info / Sales */}
            <Accordion disableGutters elevation={0} sx={accStyle}>
              <AccordionSummary expandIcon={<ExpandMore />}>{accTitle('Store Info / Sales', '#6366f1')}</AccordionSummary>
              <AccordionDetails className="space-y-4 pt-2">
                <TextField fullWidth label="Section Heading" value={formData.storeInfo.heading} onChange={e => fi('heading', e.target.value)} variant="outlined" sx={inputSx} />
                <TextField fullWidth label="Subheading" value={formData.storeInfo.subheading} onChange={e => fi('subheading', e.target.value)} variant="outlined" sx={inputSx} />
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-gray-600">Sales</p>
                  <Button size="small" onClick={() => fi('sales', [...formData.storeInfo.sales, { title: '', desc: '' }])} style={{ color: '#6366f1', textTransform: 'none', fontSize: 12 }}>+ Add Sale</Button>
                </div>
                {formData.storeInfo.sales.map((s, i) => (
                  <div key={i} className="border rounded-lg p-3 bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-gray-500">Sale {i + 1}</span>
                      <Button size="small" onClick={() => fi('sales', formData.storeInfo.sales.filter((_, idx) => idx !== i))} style={{ color: '#ef4444', minWidth: 0, fontSize: 12 }}>✕</Button>
                    </div>
                    <TextField fullWidth label="Title" value={s.title} onChange={e => { const arr = [...formData.storeInfo.sales]; arr[i] = { ...arr[i], title: e.target.value }; fi('sales', arr); }} variant="outlined" sx={inputSx} />
                    <TextField fullWidth label="Description" value={s.desc} onChange={e => { const arr = [...formData.storeInfo.sales]; arr[i] = { ...arr[i], desc: e.target.value }; fi('sales', arr); }} variant="outlined" multiline rows={3} style={{ marginTop: 10 }} />
                  </div>
                ))}
              </AccordionDetails>
            </Accordion>

            {/* About Section */}
            <Accordion disableGutters elevation={0} sx={accStyle}>
              <AccordionSummary expandIcon={<ExpandMore />}>{accTitle('About Section', '#ec4899')}</AccordionSummary>
              <AccordionDetails className="space-y-4 pt-2">
                <TextField fullWidth label="Heading" value={formData.aboutSection.heading} onChange={e => fa('heading', e.target.value)} variant="outlined" sx={inputSx} />
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-gray-600">Paragraphs</p>
                  <Button size="small" onClick={() => fa('paragraphs', [...formData.aboutSection.paragraphs, ''])} style={{ color: '#ec4899', textTransform: 'none', fontSize: 12 }}>+ Add Paragraph</Button>
                </div>
                {formData.aboutSection.paragraphs.map((p, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <TextField fullWidth label={`Paragraph ${i + 1}`} value={p} onChange={e => { const arr = [...formData.aboutSection.paragraphs]; arr[i] = e.target.value; fa('paragraphs', arr); }} variant="outlined" multiline rows={3} />
                    <Button size="small" onClick={() => fa('paragraphs', formData.aboutSection.paragraphs.filter((_, idx) => idx !== i))} style={{ color: '#ef4444', minWidth: 0, marginTop: 8 }}>✕</Button>
                  </div>
                ))}
              </AccordionDetails>
            </Accordion>

            {/* Store FAQs */}
            <Accordion disableGutters elevation={0} sx={accStyle}>
              <AccordionSummary expandIcon={<ExpandMore />}>{accTitle('Store FAQs', '#8b5cf6')}</AccordionSummary>
              <AccordionDetails className="space-y-4 pt-2">
                <p className="text-xs text-gray-400">Optional: Add FAQs specific to this store. If empty, global FAQs with the store name auto-filled will be shown instead.</p>
                <TextField fullWidth label="FAQ Section Heading" placeholder="e.g., Amazon Frequently Asked Questions" value={formData.faqs.heading} onChange={e => ff('heading', e.target.value)} variant="outlined" sx={inputSx} />
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-gray-600">Questions</p>
                  <Button size="small" onClick={() => ff('items', [...formData.faqs.items, { question: '', answer: '' }])} style={{ color: '#8b5cf6', textTransform: 'none', fontSize: 12 }}>+ Add FAQ</Button>
                </div>
                {formData.faqs.items.map((item, i) => (
                  <div key={i} className="border rounded-lg p-3 bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-gray-500">FAQ {i + 1}</span>
                      <Button size="small" onClick={() => ff('items', formData.faqs.items.filter((_, idx) => idx !== i))} style={{ color: '#ef4444', minWidth: 0, fontSize: 12 }}>Remove</Button>
                    </div>
                    <TextField fullWidth label="Question" value={item.question} onChange={e => { const arr = [...formData.faqs.items]; arr[i] = { ...arr[i], question: e.target.value }; ff('items', arr); }} variant="outlined" sx={inputSx} />
                    <TextField fullWidth label="Answer" value={item.answer} onChange={e => { const arr = [...formData.faqs.items]; arr[i] = { ...arr[i], answer: e.target.value }; ff('items', arr); }} variant="outlined" multiline rows={3} style={{ marginTop: 10 }} />
                  </div>
                ))}
                {formData.faqs.items.length === 0 && (
                  <p className="text-xs text-gray-400 text-center py-4">No store FAQs yet. Global FAQs will be shown instead.</p>
                )}
              </AccordionDetails>
            </Accordion>

            {/* Sidebar Data */}
            <Accordion disableGutters elevation={0} sx={accStyle}>
              <AccordionSummary expandIcon={<ExpandMore />}>{accTitle('Sidebar Data', '#0ea5e9')}</AccordionSummary>
              <AccordionDetails className="space-y-4 pt-2">
                <p className="text-xs font-bold text-gray-500 uppercase">Author</p>
                <div className="grid grid-cols-2 gap-4">
                  <TextField fullWidth label="Author Name" value={formData.sidebarData.authorName} onChange={e => fs('authorName', e.target.value)} variant="outlined" sx={inputSx} />
                  <TextField fullWidth label="Author Role" value={formData.sidebarData.authorRole} onChange={e => fs('authorRole', e.target.value)} variant="outlined" sx={inputSx} />
                </div>
                <ImageUploadField label="Author Image" value={formData.sidebarData.authorImage} onChange={(url) => fs('authorImage', url)} uploadType="author" />
                <TextField fullWidth label="Author Bio URL" value={formData.sidebarData.authorBioUrl} onChange={e => fs('authorBioUrl', e.target.value)} variant="outlined" sx={inputSx} />
                <TextField fullWidth label="Author Bio" value={formData.sidebarData.authorBio} onChange={e => fs('authorBio', e.target.value)} variant="outlined" multiline rows={3} />

                <p className="text-xs font-bold text-gray-500 uppercase pt-2">Trust & Verification</p>
                <div className="grid grid-cols-2 gap-4">
                  <TextField fullWidth label="Last Verified Date" value={formData.sidebarData.lastVerified} onChange={e => fs('lastVerified', e.target.value)} variant="outlined" placeholder="e.g. March 25, 2026" sx={inputSx} />
                  <TextField fullWidth label="Commission Note" value={formData.sidebarData.commissionNote} onChange={e => fs('commissionNote', e.target.value)} variant="outlined" sx={inputSx} />
                </div>
                <TextField fullWidth label="Trust Text" value={formData.sidebarData.trustText} onChange={e => fs('trustText', e.target.value)} variant="outlined" multiline rows={3} />

                <div className="flex items-center justify-between pt-2">
                  <p className="text-xs font-bold text-gray-500 uppercase">How-To Steps</p>
                  <Button size="small" onClick={() => fs('howToSteps', [...formData.sidebarData.howToSteps, ''])} style={{ color: '#0ea5e9', textTransform: 'none', fontSize: 12 }}>+ Add Step</Button>
                </div>
                {formData.sidebarData.howToSteps.map((step, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <span className="text-xs text-gray-400 w-5">{i + 1}.</span>
                    <TextField fullWidth value={step} onChange={e => { const arr = [...formData.sidebarData.howToSteps]; arr[i] = e.target.value; fs('howToSteps', arr); }} variant="outlined" sx={inputSx} />
                    <Button size="small" onClick={() => fs('howToSteps', formData.sidebarData.howToSteps.filter((_, idx) => idx !== i))} style={{ color: '#ef4444', minWidth: 0 }}>✕</Button>
                  </div>
                ))}

                <p className="text-xs font-bold text-gray-500 uppercase pt-2">Featured Article</p>
                <div className="grid grid-cols-2 gap-4">
                  <TextField fullWidth label="Article Title" value={formData.sidebarData.featuredArticleTitle} onChange={e => fs('featuredArticleTitle', e.target.value)} variant="outlined" sx={inputSx} />
                  <TextField fullWidth label="Article Author" value={formData.sidebarData.featuredArticleAuthor} onChange={e => fs('featuredArticleAuthor', e.target.value)} variant="outlined" sx={inputSx} />
                </div>
                <ImageUploadField label="Article Image" value={formData.sidebarData.featuredArticleImage} onChange={(url) => fs('featuredArticleImage', url)} uploadType="article" />
                <TextField fullWidth label="Article URL" value={formData.sidebarData.featuredArticleUrl} onChange={e => fs('featuredArticleUrl', e.target.value)} variant="outlined" sx={inputSx} />
                <TextField fullWidth label="Article Description" value={formData.sidebarData.featuredArticleDesc} onChange={e => fs('featuredArticleDesc', e.target.value)} variant="outlined" multiline rows={3} />

                <p className="text-xs font-bold text-gray-500 uppercase pt-2">Store Info</p>
                <div className="grid grid-cols-2 gap-4">
                  <TextField fullWidth label="Store Address" value={formData.sidebarData.storeAddress} onChange={e => fs('storeAddress', e.target.value)} variant="outlined" sx={inputSx} />
                  <TextField fullWidth label="Rating (0-5)" type="number" value={formData.sidebarData.storeRating} onChange={e => fs('storeRating', Number(e.target.value))} variant="outlined" sx={inputSx} />
                  <TextField fullWidth label="Rating Count" type="number" value={formData.sidebarData.storeRatingCount} onChange={e => fs('storeRatingCount', Number(e.target.value))} variant="outlined" sx={inputSx} />
                  <TextField fullWidth label="In-Store Coupons" type="number" value={formData.sidebarData.inStoreCoupons} onChange={e => fs('inStoreCoupons', Number(e.target.value))} variant="outlined" sx={inputSx} />
                </div>
              </AccordionDetails>
            </Accordion>
          </div>

          <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t">
            <Button onClick={closeDrawer} variant="outlined">Cancel</Button>
            <Button onClick={handleSubmit} variant="contained" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: 8, textTransform: 'none' }}>
              {editId ? 'Update Store' : 'Create Store'}
            </Button>
          </div>
        </div>
      </Drawer>

      {/* Bulk Delete Dialog */}
      <Dialog open={bulkDeleteOpen} onClose={() => setBulkDeleteOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle style={{ color: '#ef4444', background: '#fef2f2' }}>
          <div className="flex items-center gap-2"><Delete /><span>Delete {selected.size} Store(s)</span></div>
        </DialogTitle>
        <DialogContent className="p-6">
          <div className="text-center py-4">
            <Typography variant="h6">Delete <strong>{selected.size} selected store(s)</strong>?</Typography>
            <p className="text-gray-500 text-sm mt-2">This cannot be undone. Associated coupons may be affected.</p>
          </div>
        </DialogContent>
        <DialogActions className="p-6 bg-gray-50">
          <Button onClick={() => setBulkDeleteOpen(false)} variant="outlined">Cancel</Button>
          <Button onClick={confirmBulkDelete} variant="contained" startIcon={<Delete />} style={{ background: '#ef4444', borderRadius: 8, textTransform: 'none' }}>Delete All</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle style={{ color: '#ef4444', background: '#fef2f2' }}>
          <div className="flex items-center gap-2"><Delete /><span>Delete Store</span></div>
        </DialogTitle>
        <DialogContent className="p-6">
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(239,68,68,0.08)' }}><Delete style={{ color: '#ef4444', fontSize: 28 }} /></div>
            <Typography variant="h6" className="mb-2">Delete <strong>"{storeToDelete?.storeName}"</strong>?</Typography>
            <p className="text-gray-500 text-sm">This action cannot be undone. All associated coupons may be affected.</p>
          </div>
        </DialogContent>
        <DialogActions className="p-6 bg-gray-50">
          <Button onClick={() => setDeleteOpen(false)} variant="outlined">Cancel</Button>
          <Button onClick={confirmDelete} variant="contained" startIcon={<Delete />} style={{ background: '#ef4444', borderRadius: 8, textTransform: 'none' }}>Delete Store</Button>
        </DialogActions>
      </Dialog>
    </AdminShell>
  );
}
