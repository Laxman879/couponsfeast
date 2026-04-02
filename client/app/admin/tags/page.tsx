'use client';
import { useEffect, useState } from 'react';
import {
  Typography, Button, Table, TableBody, TableCell, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions, Chip, Avatar,
  TextField, Drawer, IconButton
} from '@mui/material';
import AdminShell from '@/components/admin/AdminShell';
import { getTags, createTag, updateTag, deleteTag, bulkDeleteTags } from '@/services/api';
import toast from 'react-hot-toast';
import { Add, Edit, Delete, Label, Close, CheckBox, CheckBoxOutlineBlank, IndeterminateCheckBox } from '@mui/icons-material';

export default function AdminTags() {
  const [tags, setTags] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [tagToDelete, setTagToDelete] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', slug: '' });
  const [editId, setEditId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  useEffect(() => { fetchTags(); }, []);

  const fetchTags = async () => {
    try { const res = await getTags(); setTags(res.data?.data ?? res.data ?? []); }
    catch (error) { console.error('Error fetching tags:', error); }
  };

  const closeDrawer = () => { setOpen(false); setEditId(null); setFormData({ name: '', slug: '' }); };

  const handleSubmit = async () => {
    if (!formData.name.trim()) return toast.error('Tag name is required');
    try {
      if (editId) { await updateTag(editId, formData); toast.success('Tag updated!'); }
      else { await createTag(formData); toast.success('Tag created!'); }
      closeDrawer(); fetchTags();
    } catch (error: any) { toast.error(error.response?.data?.error || 'Failed to save tag'); }
  };

  const handleEdit = (tag: any) => {
    setFormData({ name: tag.name, slug: tag.slug });
    setEditId(tag._id); setOpen(true);
  };

  const confirmDelete = async () => {
    if (tagToDelete) {
      try { await deleteTag(tagToDelete._id); toast.success('Tag deleted!'); fetchTags(); }
      catch (error: any) { toast.error(error.response?.data?.error || 'Failed to delete tag'); }
    }
    setDeleteOpen(false); setTagToDelete(null);
  };

  const toggleSelect = (id: string) => setSelected(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  const toggleAll = () => setSelected(prev => prev.size === tags.length ? new Set() : new Set(tags.map((t: any) => t._id)));
  const isAllSelected = tags.length > 0 && selected.size === tags.length;
  const isSomeSelected = selected.size > 0 && selected.size < tags.length;

  const confirmBulkDelete = async () => {
    try {
      const res = await bulkDeleteTags(Array.from(selected));
      toast.success(res.data?.message || `${selected.size} tag(s) deleted`);
      setSelected(new Set()); fetchTags();
    } catch (error: any) { toast.error(error.response?.data?.error || 'Failed to delete tags'); }
    setBulkDeleteOpen(false);
  };

  return (
    <AdminShell>
      <div className="flex justify-between items-center mb-6 p-5 rounded-2xl" style={{ background: '#fff', boxShadow: '0 2px 16px rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.07)' }}>
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'rgba(168,85,247,0.08)' }}><Label style={{ color: '#a855f7', fontSize: 20 }} /></div>
          <div>
            <h2 className="font-bold text-gray-900 text-lg leading-tight">Tag Management</h2>
            <p className="text-gray-400 text-xs">Create and manage tags for coupons</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {selected.size > 0 && (
            <Button variant="contained" startIcon={<Delete />} onClick={() => setBulkDeleteOpen(true)} size="medium"
              style={{ background: '#ef4444', borderRadius: 12, textTransform: 'none', fontWeight: 600 }}>Delete ({selected.size})</Button>
          )}
          {tags.length > 0 && (
            <Button variant="outlined" onClick={toggleAll} size="small"
              style={{ borderColor: '#a855f7', color: '#a855f7', borderRadius: 10, textTransform: 'none', fontSize: 12 }}>
              {isAllSelected ? 'Deselect All' : 'Select All'}
            </Button>
          )}
          <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)} size="medium"
            style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)', borderRadius: 12, textTransform: 'none', fontWeight: 600, boxShadow: '0 4px 12px rgba(168,85,247,0.35)' }}>Add Tag</Button>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', boxShadow: '0 2px 16px rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.07)' }}>
        <Table>
          <TableHead>
            <TableRow style={{ background: 'rgba(168,85,247,0.04)' }}>
              <TableCell padding="checkbox" style={{ width: 48 }}>
                <IconButton size="small" onClick={toggleAll} style={{ color: '#a855f7' }}>
                  {isAllSelected ? <CheckBox /> : isSomeSelected ? <IndeterminateCheckBox /> : <CheckBoxOutlineBlank />}
                </IconButton>
              </TableCell>
              {['Tag Name', 'Slug', 'Actions'].map((h, i) => (
                <TableCell key={h} className={i === 2 ? 'text-center' : ''} style={{ color: '#a855f7', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700 }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tags.map((tag) => (
              <TableRow key={tag._id} className="hover:bg-gray-50 transition-colors" style={{ background: selected.has(tag._id) ? 'rgba(168,85,247,0.04)' : undefined }}>
                <TableCell padding="checkbox">
                  <IconButton size="small" onClick={() => toggleSelect(tag._id)} style={{ color: selected.has(tag._id) ? '#a855f7' : '#d1d5db' }}>
                    {selected.has(tag._id) ? <CheckBox /> : <CheckBoxOutlineBlank />}
                  </IconButton>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar style={{ background: 'rgba(168,85,247,0.1)', color: '#a855f7', width: 36, height: 36 }}><Label style={{ fontSize: 16 }} /></Avatar>
                    <span className="font-semibold text-gray-900 text-sm">{tag.name}</span>
                  </div>
                </TableCell>
                <TableCell><Chip label={tag.slug} size="small" style={{ background: 'rgba(168,85,247,0.08)', color: '#a855f7', fontFamily: 'monospace', fontWeight: 600, fontSize: 11 }} /></TableCell>
                <TableCell>
                  <div className="flex justify-center gap-2">
                    <Button size="small" variant="outlined" startIcon={<Edit />} onClick={() => handleEdit(tag)} style={{ borderColor: '#6366f1', color: '#6366f1', borderRadius: 8, textTransform: 'none', fontSize: 12 }}>Edit</Button>
                    <Button size="small" variant="outlined" startIcon={<Delete />} onClick={() => { setTagToDelete(tag); setDeleteOpen(true); }} style={{ borderColor: '#ef4444', color: '#ef4444', borderRadius: 8, textTransform: 'none', fontSize: 12 }}>Delete</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {tags.length === 0 && (
              <TableRow><TableCell colSpan={4} className="text-center py-16">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(168,85,247,0.08)' }}><Label style={{ color: '#a855f7', fontSize: 24 }} /></div>
                  <p className="text-gray-500 font-medium">No Tags Found</p>
                  <p className="text-gray-400 text-sm">Click "Add Tag" to create your first tag</p>
                </div>
              </TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Right Drawer */}
      <Drawer anchor="right" open={open} onClose={closeDrawer}>
        <div className="w-[420px] h-full flex flex-col">
          <div className="flex items-center justify-between px-6 py-4" style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)' }}>
            <div className="flex items-center gap-2 text-white"><Label /><span className="font-semibold text-lg">{editId ? 'Edit Tag' : 'Add New Tag'}</span></div>
            <IconButton onClick={closeDrawer} style={{ color: '#fff' }}><Close /></IconButton>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            <TextField fullWidth label="Tag Name *" placeholder="e.g., Flash Sale" value={formData.name}
              onChange={e => {
                const name = e.target.value;
                setFormData({ name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') });
              }} variant="outlined" />
            <TextField fullWidth label="Slug" value={formData.slug}
              onChange={e => setFormData(p => ({ ...p, slug: e.target.value }))}
              variant="outlined" helperText="Auto-generated from name. Edit if needed." />
          </div>
          <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t">
            <Button onClick={closeDrawer} variant="outlined">Cancel</Button>
            <Button onClick={handleSubmit} variant="contained" style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)', borderRadius: 8, textTransform: 'none' }}>
              {editId ? 'Update Tag' : 'Create Tag'}
            </Button>
          </div>
        </div>
      </Drawer>

      {/* Bulk Delete Dialog */}
      <Dialog open={bulkDeleteOpen} onClose={() => setBulkDeleteOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle style={{ color: '#ef4444', background: '#fef2f2' }}>
          <div className="flex items-center gap-2"><Delete /><span>Delete {selected.size} Tag(s)</span></div>
        </DialogTitle>
        <DialogContent className="p-6">
          <div className="text-center py-4">
            <Typography variant="h6">Delete <strong>{selected.size} selected tag(s)</strong>?</Typography>
            <p className="text-gray-500 text-sm mt-2">This action cannot be undone.</p>
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
          <div className="flex items-center gap-2"><Delete /><span>Delete Tag</span></div>
        </DialogTitle>
        <DialogContent className="p-6">
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(239,68,68,0.08)' }}><Delete style={{ color: '#ef4444', fontSize: 28 }} /></div>
            <Typography variant="h6" className="mb-2">Delete <strong>"{tagToDelete?.name}"</strong>?</Typography>
            <p className="text-gray-500 text-sm">This action cannot be undone.</p>
          </div>
        </DialogContent>
        <DialogActions className="p-6 bg-gray-50">
          <Button onClick={() => setDeleteOpen(false)} variant="outlined">Cancel</Button>
          <Button onClick={confirmDelete} variant="contained" startIcon={<Delete />} style={{ background: '#ef4444', borderRadius: 8, textTransform: 'none' }}>Delete Tag</Button>
        </DialogActions>
      </Dialog>
    </AdminShell>
  );
}
