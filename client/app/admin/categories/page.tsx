'use client';
import { useState, useEffect } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { getCategories, createCategory, updateCategory, deleteCategory, bulkDeleteCategories } from '@/services/api';
import toast from 'react-hot-toast';
import { LayoutGrid, Plus, Edit, Trash2, X, Check } from 'lucide-react';
import {
  MdLaptop, MdPhoneAndroid, MdSportsSoccer, MdFlight, MdRestaurant,
  MdHome, MdLocalOffer, MdShoppingCart, MdFavorite, MdDirectionsCar,
  MdSchool, MdMusicNote, MdPets, MdBuild, MdAttachMoney, MdBeachAccess,
  MdLocalPizza, MdChildCare, MdSpa, MdFitnessCenter,
} from 'react-icons/md';
import { FaTshirt, FaGamepad, FaBook } from 'react-icons/fa';

interface Category {
  _id: string;
  name: string;
  slug: string;
  color: string;
  icon?: string;
  description?: string;
  hasNavLink?: boolean;
  navLocation?: string;
  dropdownSection?: string;
}

const ICON_OPTIONS = [
  { key: 'MdLaptop',       label: 'Electronics',  Component: MdLaptop },
  { key: 'FaTshirt',       label: 'Fashion',       Component: FaTshirt },
  { key: 'MdRestaurant',   label: 'Food',          Component: MdRestaurant },
  { key: 'MdHome',         label: 'Home',          Component: MdHome },
  { key: 'MdFlight',       label: 'Travel',        Component: MdFlight },
  { key: 'MdSportsSoccer', label: 'Sports',        Component: MdSportsSoccer },
  { key: 'MdFavorite',     label: 'Beauty',        Component: MdFavorite },
  { key: 'MdPhoneAndroid', label: 'Mobile',        Component: MdPhoneAndroid },
  { key: 'FaGamepad',      label: 'Gaming',        Component: FaGamepad },
  { key: 'MdShoppingCart', label: 'Shopping',      Component: MdShoppingCart },
  { key: 'MdLocalOffer',   label: 'Deals',         Component: MdLocalOffer },
  { key: 'MdDirectionsCar',label: 'Automotive',    Component: MdDirectionsCar },
  { key: 'MdSchool',       label: 'Education',     Component: MdSchool },
  { key: 'FaBook',         label: 'Books',         Component: FaBook },
  { key: 'MdMusicNote',    label: 'Music',         Component: MdMusicNote },
  { key: 'MdPets',         label: 'Pets',          Component: MdPets },
  { key: 'MdBuild',        label: 'Tools',         Component: MdBuild },
  { key: 'MdAttachMoney',  label: 'Finance',       Component: MdAttachMoney },
  { key: 'MdBeachAccess',  label: 'Outdoors',      Component: MdBeachAccess },
  { key: 'MdLocalPizza',   label: 'Pizza',         Component: MdLocalPizza },
  { key: 'MdChildCare',    label: 'Baby',          Component: MdChildCare },
  { key: 'MdSpa',          label: 'Wellness',      Component: MdSpa },
  { key: 'MdFitnessCenter',label: 'Fitness',       Component: MdFitnessCenter },
];

const COLORS = ['#6366f1','#ec4899','#f59e0b','#10b981','#3b82f6','#ef4444','#8b5cf6','#f97316','#06b6d4','#84cc16'];

const empty = { name: '', slug: '', color: '#6366f1', icon: 'MdLocalOffer', description: '', hasNavLink: false, navLocation: 'no', dropdownSection: 'categories' };

function CategoryIcon({ iconKey, size = 20, color }: { iconKey?: string; size?: number; color?: string }) {
  const found = ICON_OPTIONS.find(i => i.key === iconKey) || ICON_OPTIONS[10];
  const Comp = found.Component;
  return <Comp size={size} color={color} />;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [showForm,   setShowForm]   = useState(false);
  const [editing,    setEditing]    = useState<Category | null>(null);
  const [form,       setForm]       = useState<any>(empty);
  const [delConfirm, setDelConfirm] = useState<Category | null>(null);
  const [showIcons,  setShowIcons]  = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      const data = res.data?.data ?? res.data ?? [];
      setCategories(Array.isArray(data) ? data : []);
    } catch { toast.error('Failed to load categories'); }
    finally { setLoading(false); }
  };

  const slugify = (str: string) =>
    str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const openAdd  = () => { setForm(empty); setEditing(null); setShowForm(true); };
  const openEdit = (cat: Category) => { setForm({ ...cat }); setEditing(cat); setShowForm(true); };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Category name is required'); return; }
    const payload = { ...form, slug: form.slug || slugify(form.name), hasNavLink: form.navLocation !== 'no' };
    try {
      if (editing) { await updateCategory(editing._id, payload); toast.success('Category updated!'); }
      else         { await createCategory(payload); toast.success(`Category "${form.name}" created!`); }
      localStorage.setItem('cms-updated', Date.now().toString());
      window.dispatchEvent(new StorageEvent('storage', { key: 'cms-updated', newValue: Date.now().toString() }));
      setShowForm(false);
      fetchCategories();
    } catch (e: any) {
      toast.error(e.response?.data?.error || 'Failed to save category');
    }
  };

  const handleDelete = async () => {
    if (!delConfirm) return;
    try {
      await deleteCategory(delConfirm._id);
      toast.success('Category deleted!');
      setDelConfirm(null);
      fetchCategories();
    } catch { toast.error('Failed to delete category'); }
  };

  const toggleSelect = (id: string) => setSelected(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  const toggleAll = () => setSelected(prev => prev.size === categories.length ? new Set() : new Set(categories.map(c => c._id)));

  const confirmBulkDelete = async () => {
    try {
      const res = await bulkDeleteCategories(Array.from(selected));
      toast.success(res.data?.message || `${selected.size} category(ies) deleted`);
      setSelected(new Set()); fetchCategories();
    } catch { toast.error('Failed to delete categories'); }
    setBulkDeleteOpen(false);
  };

  const card = 'bg-white rounded-2xl border border-slate-100 shadow-sm';

  return (
    <AdminShell>
      {/* Header */}
      <div className={`${card} flex justify-between items-center p-5 mb-6`}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-indigo-50">
            <LayoutGrid size={22} className="text-indigo-500" />
          </div>
          <div>
            <h2 className="font-bold text-slate-800 text-lg leading-tight">Categories Management</h2>
            <p className="text-slate-400 text-sm mt-0.5">Add and manage store categories shown in navbar dropdown and filters</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {selected.size > 0 && (
            <button onClick={() => setBulkDeleteOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold"
              style={{ background: '#ef4444' }}>
              <Trash2 size={14} /> Delete ({selected.size})
            </button>
          )}
          {categories.length > 0 && (
            <button onClick={toggleAll}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border"
              style={{ borderColor: '#6366f1', color: '#6366f1' }}>
              {selected.size === categories.length ? 'Deselect All' : 'Select All'}
            </button>
          )}
          <button onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-all"
            style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
            <Plus size={16} /> Add Category
          </button>
        </div>
      </div>

      {/* Info banner */}
      <div className="mb-6 p-4 rounded-2xl bg-indigo-50 border border-indigo-100 text-sm text-indigo-700">
        <strong>How it works:</strong> Categories you add here appear in the navbar dropdown and on the{' '}
        <code className="bg-indigo-100 px-1 rounded">/view</code> store browser page.
        When adding a store, set its <strong>Category</strong> field to match the category name exactly (e.g. <strong>Fashion</strong>).
      </div>

      {/* Categories grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-24 rounded-2xl animate-pulse bg-slate-100" />)}
        </div>
      ) : categories.length === 0 ? (
        <div className={`${card} p-16 flex flex-col items-center gap-4 text-center`}>
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center">
            <LayoutGrid size={28} className="text-indigo-400" />
          </div>
          <p className="font-semibold text-slate-700 text-lg">No categories yet</p>
          <p className="text-slate-400 text-sm">Click "Add Category" to create your first category</p>
          <button onClick={openAdd}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold mt-2"
            style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
            <Plus size={15} /> Add Category
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(cat => (
            <div key={cat._id} className={`${card} p-4 flex items-center gap-4 hover:shadow-md transition-shadow`} style={{ borderColor: selected.has(cat._id) ? '#6366f1' : undefined }}>
              <input type="checkbox" checked={selected.has(cat._id)} onChange={() => toggleSelect(cat._id)}
                className="w-4 h-4 rounded accent-indigo-500 flex-shrink-0 cursor-pointer" />
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${cat.color}18` }}>
                <CategoryIcon iconKey={cat.icon} size={20} color={cat.color} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-slate-800 truncate">{cat.name}</p>
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: cat.color }} />
                </div>
                <p className="text-xs text-slate-400 font-mono mt-0.5">/{cat.slug}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${cat.hasNavLink ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                    {cat.hasNavLink ? `✓ ${cat.navLocation || 'navbar'}` : 'No nav link'}
                  </span>
                  <span className="text-[10px] text-slate-400">{cat.dropdownSection || 'categories'}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5 flex-shrink-0">
                <button onClick={() => openEdit(cat)}
                  className="p-1.5 rounded-lg bg-indigo-50 text-indigo-500 hover:bg-indigo-100 transition-colors">
                  <Edit size={13} />
                </button>
                <button onClick={() => setDelConfirm(cat)}
                  className="p-1.5 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 transition-colors">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Drawer */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative z-10 ml-auto w-full max-w-md h-full bg-white flex flex-col shadow-2xl">

            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
              <div className="flex items-center gap-3">
                <LayoutGrid size={18} className="text-white" />
                <p className="text-white font-bold">{editing ? `Edit: ${editing.name}` : 'Add New Category'}</p>
              </div>
              <button onClick={() => setShowForm(false)} className="text-white/70 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5">

              {/* Icon picker */}
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-2">Icon</label>
                <button onClick={() => setShowIcons(!showIcons)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-indigo-300 transition-colors w-full">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${form.color}18` }}>
                    <CategoryIcon iconKey={form.icon} size={18} color={form.color} />
                  </div>
                  <span className="text-sm text-slate-500">
                    {ICON_OPTIONS.find(i => i.key === form.icon)?.label || 'Select icon'}
                  </span>
                </button>
                {showIcons && (
                  <div className="mt-2 p-3 rounded-xl border border-slate-200 grid grid-cols-5 gap-2">
                    {ICON_OPTIONS.map(ic => {
                      const Comp = ic.Component;
                      const selected = form.icon === ic.key;
                      return (
                        <button key={ic.key}
                          onClick={() => { setForm({ ...form, icon: ic.key }); setShowIcons(false); }}
                          className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${selected ? 'bg-indigo-100 ring-2 ring-indigo-400' : 'hover:bg-slate-50'}`}>
                          <Comp size={20} color={selected ? '#6366f1' : '#64748b'} />
                          <span className="text-[9px] text-slate-500 leading-tight text-center">{ic.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Name */}
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-1.5">Category Name *</label>
                <input
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-indigo-400 transition-colors"
                  placeholder="e.g., Fashion, Electronics"
                  value={form.name}
                  onChange={e => {
                    const name = e.target.value;
                    setForm({ ...form, name, slug: editing ? form.slug : slugify(name) });
                  }}
                />
              </div>

              {/* Slug */}
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-1.5">
                  URL Slug <span className="text-indigo-400 font-mono text-xs">→ /category/{form.slug || 'slug'}</span>
                </label>
                <input
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono outline-none focus:border-indigo-400 transition-colors"
                  placeholder="e.g., fashion"
                  value={form.slug}
                  onChange={e => setForm({ ...form, slug: slugify(e.target.value) })}
                />
              </div>

              {/* Color */}
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-2">Color</label>
                <div className="flex items-center gap-2 flex-wrap">
                  {COLORS.map(c => (
                    <button key={c} onClick={() => setForm({ ...form, color: c })}
                      className="w-7 h-7 rounded-full transition-transform hover:scale-110 flex items-center justify-center"
                      style={{ background: c }}>
                      {form.color === c && <Check size={13} className="text-white" />}
                    </button>
                  ))}
                  <input type="color" value={form.color}
                    onChange={e => setForm({ ...form, color: e.target.value })}
                    className="w-7 h-7 rounded-full cursor-pointer border-0 p-0" title="Custom color" />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-1.5">Description</label>
                <textarea
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-indigo-400 resize-none transition-colors"
                  rows={2} placeholder="Brief description of this category"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                />
              </div>

              {/* Nav Link */}
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-1.5">Navigation Link</label>
                <select
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-indigo-400 bg-white"
                  value={form.navLocation}
                  onChange={e => setForm({ ...form, navLocation: e.target.value, hasNavLink: e.target.value !== 'no' })}>
                  <option value="no">No Link</option>
                  <option value="navbar">Navbar Only</option>
                  <option value="footer">Footer Only</option>
                  <option value="both">Both Navbar & Footer</option>
                </select>
              </div>

              {/* Dropdown Section */}
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-1.5">Dropdown Section</label>
                <select
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-indigo-400 bg-white"
                  value={form.dropdownSection}
                  onChange={e => setForm({ ...form, dropdownSection: e.target.value })}>
                  <option value="categories">Categories Section</option>
                  <option value="popular">Popular Section</option>
                </select>
              </div>
            </div>

            <div className="flex-shrink-0 px-6 py-4 border-t border-slate-100 bg-slate-50 flex gap-3">
              <button onClick={() => setShowForm(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors">
                Cancel
              </button>
              <button onClick={handleSave}
                className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-all"
                style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                {editing ? 'Save Changes' : 'Create Category'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk delete confirm */}
      {bulkDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setBulkDeleteOpen(false)} />
          <div className="relative z-10 bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={22} className="text-red-500" />
            </div>
            <p className="text-center font-bold text-slate-800 mb-1">Delete {selected.size} category(ies)?</p>
            <p className="text-center text-slate-400 text-sm mb-5">This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setBulkDeleteOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
              <button onClick={confirmBulkDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors">Delete All</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {delConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDelConfirm(null)} />
          <div className="relative z-10 bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={22} className="text-red-500" />
            </div>
            <p className="text-center font-bold text-slate-800 mb-1">Delete "{delConfirm.name}"?</p>
            <p className="text-center text-slate-400 text-sm mb-5">
              This will remove the category from the navbar dropdown and filters.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDelConfirm(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                Cancel
              </button>
              <button onClick={handleDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
