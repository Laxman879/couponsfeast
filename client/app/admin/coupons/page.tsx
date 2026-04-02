'use client';
import { useEffect, useState } from 'react';
import {
  Typography, Button, Table, TableBody, TableCell, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions, Chip, Avatar,
  TextField, MenuItem, Drawer, IconButton, Switch, FormControlLabel
} from '@mui/material';
import AdminShell from '@/components/admin/AdminShell';
import { getAdminCoupons, createCoupon, updateCoupon, deleteCoupon, bulkDeleteCoupons, getStores, getTags, getCategories } from '@/services/api';
import toast from 'react-hot-toast';
import { Add, Edit, Delete, LocalOffer, Store, CalendarToday, Percent, Close, CheckBox, CheckBoxOutlineBlank, IndeterminateCheckBox } from '@mui/icons-material';
import { formatDate } from '@/utils/dateUtils';
import ImageUploadField from '@/components/admin/ImageUploadField';

const defaultForm = { title: '', code: '', description: '', discount: '', store: '', category: '', expiryDate: '', type: 'code', labelType: 'Code', interestedUsers: 0, limitedTime: false, expiringToday: false, addedBy: '', exclusive: false, details: '', isFeatured: false, featuredImage: '', affiliateUrl: '', tags: [] as string[] };
const inputSx = { '& .MuiInputBase-root': { minHeight: 48 } };

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [availableTags, setAvailableTags] = useState<any[]>([]);
  const [availableCategories, setAvailableCategories] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState<any>(null);
  const [formData, setFormData] = useState({ ...defaultForm });
  const [editId, setEditId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  useEffect(() => { fetchCoupons(); fetchStores(); fetchTags(); fetchCategories(); }, []);

  const fetchCoupons = async () => {
    try { const res = await getAdminCoupons(); setCoupons(res.data?.data ?? res.data ?? []); }
    catch (error) { console.error('Error fetching coupons:', error); }
  };
  const fetchStores = async () => {
    try { const res = await getStores(); setStores(res.data?.data ?? res.data ?? []); }
    catch (error) { console.error('Error fetching stores:', error); }
  };
  const fetchTags = async () => {
    try { const res = await getTags(); setAvailableTags(res.data?.data ?? res.data ?? []); }
    catch (error) { console.error('Error fetching tags:', error); }
  };
  const fetchCategories = async () => {
    try { const res = await getCategories(); setAvailableCategories(res.data?.data ?? res.data ?? []); }
    catch (error) { console.error('Error fetching categories:', error); }
  };

  const closeDrawer = () => { setOpen(false); setEditId(null); setFormData({ ...defaultForm }); };

  const handleSubmit = async () => {
    try {
      if (editId) { await updateCoupon(editId, formData); toast.success('Coupon updated!'); }
      else { await createCoupon(formData); toast.success('Coupon created!'); }
      closeDrawer(); fetchCoupons();
    } catch (error: any) { toast.error(error.response?.data?.error || error.message || 'Failed to save coupon'); }
  };

  const handleEdit = (coupon: any) => {
    setFormData({ ...defaultForm, ...coupon, store: coupon.store?._id || '', expiryDate: coupon.expiryDate ? coupon.expiryDate.split('T')[0] : '', tags: coupon.tags || [] });
    setEditId(coupon._id); setOpen(true);
  };

  const confirmDelete = async () => {
    if (couponToDelete) {
      try { await deleteCoupon(couponToDelete._id); toast.success('Coupon deleted!'); fetchCoupons(); }
      catch (error: any) { toast.error(error.response?.data?.error || 'Failed to delete coupon'); }
    }
    setDeleteOpen(false); setCouponToDelete(null);
  };

  const toggleSelect = (id: string) => setSelected(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  const toggleAll = () => setSelected(prev => prev.size === coupons.length ? new Set() : new Set(coupons.map((c: any) => c._id)));
  const isAllSelected = coupons.length > 0 && selected.size === coupons.length;
  const isSomeSelected = selected.size > 0 && selected.size < coupons.length;

  const confirmBulkDelete = async () => {
    try {
      const res = await bulkDeleteCoupons(Array.from(selected));
      toast.success(res.data?.message || `${selected.size} coupon(s) deleted`);
      setSelected(new Set()); fetchCoupons();
    } catch (error: any) { toast.error(error.response?.data?.error || 'Failed to delete coupons'); }
    setBulkDeleteOpen(false);
  };

  const ff = (field: string, val: any) => setFormData(p => ({ ...p, [field]: val }));

  return (
    <AdminShell>
      <div className="flex justify-between items-center mb-6 p-5 rounded-2xl" style={{ background: '#fff', boxShadow: '0 2px 16px rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.07)' }}>
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.08)' }}><LocalOffer style={{ color: '#10b981', fontSize: 20 }} /></div>
          <div>
            <h2 className="font-bold text-gray-900 text-lg leading-tight">Coupon Management</h2>
            <p className="text-gray-400 text-xs">Create and manage discount coupons for your stores</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {selected.size > 0 && (
            <Button variant="contained" startIcon={<Delete />} onClick={() => setBulkDeleteOpen(true)} size="medium"
              style={{ background: '#ef4444', borderRadius: 12, textTransform: 'none', fontWeight: 600, boxShadow: '0 4px 12px rgba(239,68,68,0.35)' }}>
              Delete Selected ({selected.size})
            </Button>
          )}
          {coupons.length > 0 && (
            <Button variant="outlined" onClick={toggleAll} size="small"
              style={{ borderColor: '#10b981', color: '#10b981', borderRadius: 10, textTransform: 'none', fontSize: 12 }}>
              {isAllSelected ? 'Deselect All' : 'Select All'}
            </Button>
          )}
          <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)} size="medium"
            style={{ background: 'linear-gradient(135deg, #10b981, #059669)', borderRadius: 12, textTransform: 'none', fontWeight: 600, boxShadow: '0 4px 12px rgba(16,185,129,0.35)' }}>Add Coupon</Button>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', boxShadow: '0 2px 16px rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.07)' }}>
        <Table>
          <TableHead>
            <TableRow style={{ background: 'rgba(16,185,129,0.04)' }}>
              <TableCell padding="checkbox" style={{ width: 48 }}>
                <IconButton size="small" onClick={toggleAll} style={{ color: '#10b981' }}>
                  {isAllSelected ? <CheckBox /> : isSomeSelected ? <IndeterminateCheckBox /> : <CheckBoxOutlineBlank />}
                </IconButton>
              </TableCell>
              {['Coupon Details', 'Code', 'Store', 'Discount', 'Actions'].map((h, i) => (
                <TableCell key={h} className={i === 4 ? 'text-center' : ''} style={{ color: '#10b981', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700 }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {coupons.map((coupon) => (
              <TableRow key={coupon._id} className="hover:bg-gray-50 transition-colors" style={{ background: selected.has(coupon._id) ? 'rgba(16,185,129,0.04)' : undefined }}>
                <TableCell padding="checkbox">
                  <IconButton size="small" onClick={() => toggleSelect(coupon._id)} style={{ color: selected.has(coupon._id) ? '#10b981' : '#d1d5db' }}>
                    {selected.has(coupon._id) ? <CheckBox /> : <CheckBoxOutlineBlank />}
                  </IconButton>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', width: 36, height: 36 }}><LocalOffer style={{ fontSize: 16 }} /></Avatar>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{coupon.title}</p>
                      {coupon.description && <p className="text-gray-400 text-xs">{coupon.description.length > 60 ? `${coupon.description.substring(0, 60)}...` : coupon.description}</p>}
                      {coupon.expiryDate && (
                        <div className="flex items-center gap-1 mt-0.5">
                          <CalendarToday style={{ fontSize: 10, color: '#9ca3af' }} />
                          <span className="text-[10px] text-gray-400">Expires: {formatDate(new Date(coupon.expiryDate))}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell><Chip label={coupon.code} size="small" style={{ background: 'rgba(99,102,241,0.08)', color: '#6366f1', fontFamily: 'monospace', fontWeight: 700, fontSize: 11 }} /></TableCell>
                <TableCell>
                  {coupon.store?.storeName || coupon.store?.name
                    ? <div className="flex items-center gap-1.5"><Store style={{ fontSize: 14, color: '#9ca3af' }} /><span className="text-gray-700 text-sm">{coupon.store?.storeName || coupon.store?.name}</span></div>
                    : <span className="text-gray-400 italic text-sm">No store</span>}
                </TableCell>
                <TableCell><span className="font-bold text-emerald-600 text-sm">{coupon.discount}</span></TableCell>
                <TableCell>
                  <div className="flex justify-center gap-2">
                    <Button size="small" variant="outlined" startIcon={<Edit />} onClick={() => handleEdit(coupon)} style={{ borderColor: '#6366f1', color: '#6366f1', borderRadius: 8, textTransform: 'none', fontSize: 12 }}>Edit</Button>
                    <Button size="small" variant="outlined" startIcon={<Delete />} onClick={() => { setCouponToDelete(coupon); setDeleteOpen(true); }} style={{ borderColor: '#ef4444', color: '#ef4444', borderRadius: 8, textTransform: 'none', fontSize: 12 }}>Delete</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {coupons.length === 0 && (
              <TableRow><TableCell colSpan={6} className="text-center py-16">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.08)' }}><LocalOffer style={{ color: '#10b981', fontSize: 24 }} /></div>
                  <p className="text-gray-500 font-medium">No Coupons Found</p>
                  <p className="text-gray-400 text-sm">Click "Add Coupon" to create your first coupon</p>
                </div>
              </TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Right Drawer */}
      <Drawer anchor="right" open={open} onClose={closeDrawer}>
        <div className="w-[520px] h-full flex flex-col">
          <div className="flex items-center justify-between px-6 py-4" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
            <div className="flex items-center gap-2 text-white"><LocalOffer /><span className="font-semibold text-lg">{editId ? 'Edit Coupon' : 'Add New Coupon'}</span></div>
            <IconButton onClick={closeDrawer} style={{ color: '#fff' }}><Close /></IconButton>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Basic Information</p>
            <TextField fullWidth label="Title *" placeholder="e.g., Summer Sale" value={formData.title} onChange={e => ff('title', e.target.value)} variant="outlined" sx={inputSx} />
            <TextField fullWidth label="Code *" placeholder="e.g., SUMMER20" value={formData.code} onChange={e => ff('code', e.target.value.toUpperCase())} variant="outlined" helperText="Auto-converted to uppercase" sx={inputSx} />
            <TextField fullWidth label="Description" placeholder="Describe what this coupon offers" value={formData.description} onChange={e => ff('description', e.target.value)} variant="outlined" multiline rows={3} />

            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider pt-2">Discount & Store</p>
            <div className="grid grid-cols-2 gap-4">
              <TextField fullWidth label="Discount *" placeholder="e.g., 20% OFF" value={formData.discount} onChange={e => ff('discount', e.target.value)} variant="outlined" InputProps={{ startAdornment: <Percent className="text-gray-400 mr-2" /> }} sx={inputSx} />
              <TextField select fullWidth label="Store *" value={formData.store} onChange={e => ff('store', e.target.value)} variant="outlined" sx={inputSx}
                InputLabelProps={{ shrink: true }}
                SelectProps={{ displayEmpty: true, renderValue: (val: any) => {
                  if (!val) return <span style={{ color: '#9ca3af' }}>Select a store</span>;
                  const s = stores.find((st: any) => st._id === val);
                  return s ? (s.storeName || s.name) : val;
                }}}>
                <MenuItem value=""><em>Select a store</em></MenuItem>
                {stores.map((s) => <MenuItem key={s._id} value={s._id}>{s.storeName || s.name}</MenuItem>)}
              </TextField>
            </div>
            <TextField fullWidth label="Expiry Date" type="date" value={formData.expiryDate} onChange={e => ff('expiryDate', e.target.value)} variant="outlined" InputLabelProps={{ shrink: true }} sx={inputSx} />

            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider pt-2">Category</p>
            <TextField select fullWidth label="Category" value={formData.category} onChange={e => ff('category', e.target.value)} variant="outlined" sx={inputSx}
              helperText="Assign a category so this coupon appears under the correct tab on homepage"
              InputLabelProps={{ shrink: true }}
              SelectProps={{ displayEmpty: true, renderValue: (val: any) => {
                if (!val) return <span style={{ color: '#9ca3af' }}>Select a category</span>;
                const c = availableCategories.find((cat: any) => cat.name === val || cat.slug === val);
                return c ? c.name : val;
              }}}>
              <MenuItem value=""><em>No category</em></MenuItem>
              {availableCategories.map((c: any) => <MenuItem key={c._id} value={c.name}>{c.name}</MenuItem>)}
            </TextField>

            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider pt-2">Tags</p>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {formData.tags.map(t => (
                  <Chip key={t} label={t} size="small"
                    onDelete={() => ff('tags', formData.tags.filter((tag: string) => tag !== t))}
                    style={{ background: 'rgba(168,85,247,0.08)', color: '#a855f7', fontSize: 11 }} />
                ))}
              </div>
            )}
            <TextField select fullWidth label="Add Tag" value="" onChange={e => {
              const val = e.target.value;
              if (val && !formData.tags.includes(val)) ff('tags', [...formData.tags, val]);
            }} variant="outlined" sx={inputSx} helperText="Select tags from the predefined list"
              InputLabelProps={{ shrink: true }}
              SelectProps={{ displayEmpty: true, renderValue: () => <span style={{ color: '#9ca3af' }}>Select a tag to add...</span> }}>
              {availableTags.filter(t => !formData.tags.includes(t.name)).map(t => <MenuItem key={t._id} value={t.name}>{t.name}</MenuItem>)}
              {availableTags.length === 0 && <MenuItem disabled>No tags available — create them in Tags page</MenuItem>}
            </TextField>

            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider pt-2">Type & Labels</p>
            <div className="grid grid-cols-2 gap-4">
              <TextField select fullWidth label="Type" value={formData.type} onChange={e => ff('type', e.target.value)} variant="outlined" sx={inputSx}
                InputLabelProps={{ shrink: true }}
                SelectProps={{ displayEmpty: true, renderValue: (val: any) => {
                  if (!val) return <span style={{ color: '#9ca3af' }}>Select type</span>;
                  return val.charAt(0).toUpperCase() + val.slice(1);
                }}}>
                {['code', 'sale', 'cashback', 'freeshipping'].map(t => <MenuItem key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</MenuItem>)}
              </TextField>
              <TextField fullWidth label="Label Type" placeholder="e.g., Code, Deal" value={formData.labelType} onChange={e => ff('labelType', e.target.value)} variant="outlined" sx={inputSx} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <TextField fullWidth label="Interested Users" type="number" value={formData.interestedUsers} onChange={e => ff('interestedUsers', Number(e.target.value))} variant="outlined" InputLabelProps={{ shrink: true }} sx={inputSx} />
              <TextField fullWidth label="Added By" placeholder="e.g., Staff" value={formData.addedBy} onChange={e => ff('addedBy', e.target.value)} variant="outlined" sx={inputSx} />
            </div>
            <TextField fullWidth label="Details" placeholder="Extra details shown on expand" value={formData.details} onChange={e => ff('details', e.target.value)} variant="outlined" multiline rows={3} />

            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider pt-2">Affiliate / Tracking</p>
            <TextField fullWidth label="Affiliate URL" placeholder="e.g., https://www.coutr.com/?utm_source=RAN&utm_medium=affiliate..." value={formData.affiliateUrl} onChange={e => ff('affiliateUrl', e.target.value)} variant="outlined" helperText="Tracking URL opened when user clicks the coupon. Falls back to store website if empty." sx={inputSx} />

            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider pt-2">Options</p>
            <div className="rounded-xl border border-gray-200 p-4 space-y-1 bg-gray-50">
              <FormControlLabel control={<Switch checked={formData.limitedTime} onChange={e => ff('limitedTime', e.target.checked)} color="success" />} label="Limited Time" />
              <FormControlLabel control={<Switch checked={formData.expiringToday} onChange={e => ff('expiringToday', e.target.checked)} color="warning" />} label="Expiring Today" />
              <FormControlLabel control={<Switch checked={formData.exclusive} onChange={e => ff('exclusive', e.target.checked)} color="secondary" />} label="Exclusive" />
              <FormControlLabel control={<Switch checked={formData.isFeatured} onChange={e => ff('isFeatured', e.target.checked)} color="success" />} label="⭐ Featured on Homepage" />
            </div>
            {formData.isFeatured && (
              <>
                <ImageUploadField label="Featured Card Image" value={formData.featuredImage} onChange={(url) => ff('featuredImage', url)} helperText="Recommended size: 160×170px" uploadType="featured" />
              </>
            )}
          </div>

          <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t">
            <Button onClick={closeDrawer} variant="outlined">Cancel</Button>
            <Button onClick={handleSubmit} variant="contained" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', borderRadius: 8, textTransform: 'none' }}>
              {editId ? 'Update Coupon' : 'Create Coupon'}
            </Button>
          </div>
        </div>
      </Drawer>

      {/* Bulk Delete Dialog */}
      <Dialog open={bulkDeleteOpen} onClose={() => setBulkDeleteOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle style={{ color: '#ef4444', background: '#fef2f2' }}>
          <div className="flex items-center gap-2"><Delete /><span>Delete {selected.size} Coupon(s)</span></div>
        </DialogTitle>
        <DialogContent className="p-6">
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(239,68,68,0.08)' }}><Delete style={{ color: '#ef4444', fontSize: 28 }} /></div>
            <Typography variant="h6" className="mb-2">Delete <strong>{selected.size} selected coupon(s)</strong>?</Typography>
            <p className="text-gray-500 text-sm">All related data will be permanently deleted.</p>
          </div>
        </DialogContent>
        <DialogActions className="p-6 bg-gray-50">
          <Button onClick={() => setBulkDeleteOpen(false)} variant="outlined">Cancel</Button>
          <Button onClick={confirmBulkDelete} variant="contained" startIcon={<Delete />} style={{ background: '#ef4444', borderRadius: 8, textTransform: 'none' }}>Delete All Selected</Button>
        </DialogActions>
      </Dialog>

      {/* Single Delete Dialog */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle style={{ color: '#ef4444', background: '#fef2f2' }}>
          <div className="flex items-center gap-2"><Delete /><span>Delete Coupon</span></div>
        </DialogTitle>
        <DialogContent className="p-6">
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(239,68,68,0.08)' }}><Delete style={{ color: '#ef4444', fontSize: 28 }} /></div>
            <Typography variant="h6" className="mb-2">Delete <strong>"{couponToDelete?.title}"</strong>?</Typography>
            <p className="text-gray-500 text-sm">This action cannot be undone.</p>
          </div>
        </DialogContent>
        <DialogActions className="p-6 bg-gray-50">
          <Button onClick={() => setDeleteOpen(false)} variant="outlined">Cancel</Button>
          <Button onClick={confirmDelete} variant="contained" startIcon={<Delete />} style={{ background: '#ef4444', borderRadius: 8, textTransform: 'none' }}>Delete Coupon</Button>
        </DialogActions>
      </Dialog>
    </AdminShell>
  );
}
