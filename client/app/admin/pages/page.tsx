'use client';
import { useState, useEffect } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { getAllPages, createPage, updatePage, deletePage } from '@/services/api';
import toast from 'react-hot-toast';
import {
  FileText, Plus, Edit, Trash2, Eye, X, ChevronDown, ChevronUp,
  Layout, Type, Image, Tag, Store, Star, AlignLeft, Code
} from 'lucide-react';
import { getBanners } from '@/services/api';

const SECTION_TYPES = [
  { value: 'heroBanner',      label: 'Hero Banner',       icon: Image,     desc: 'Full-width banner with title, image & button' },
  { value: 'textContent',     label: 'Text Content',      icon: Type,      desc: 'Rich text / paragraph content' },
  { value: 'categories',      label: 'Categories Grid',   icon: Layout,    desc: 'Show category cards' },
  { value: 'featuredCoupons', label: 'Featured Coupons',  icon: Tag,       desc: 'Display featured coupon cards' },
  { value: 'trendingCoupons', label: 'Trending Coupons',  icon: Star,      desc: 'Show trending/popular coupons' },
  { value: 'topStores',       label: 'Top Stores',        icon: Store,     desc: 'Display store cards' },
  { value: 'customHTML',      label: 'Custom HTML',       icon: Code,      desc: 'Raw HTML block' },
];

const TEMPLATES = [
  { value: 'default',  label: 'Default' },
  { value: 'landing',  label: 'Landing Page' },
  { value: 'blog',     label: 'Blog Style' },
  { value: 'contact',  label: 'Contact Page' },
];

const BANNER_LAYOUTS = [
  { value: 'fullWidth',  label: 'Full Width',    desc: 'Image with centered overlay text' },
  { value: 'splitImage', label: 'Split Image',   desc: 'Image left, text right' },
  { value: 'centered',   label: 'Centered Card', desc: 'Card on colored background' },
  { value: 'minimal',    label: 'Minimal Bar',   desc: 'Text + button only' },
  { value: 'overlay',    label: 'Overlay',       desc: 'Bottom gradient overlay' },
];

const emptyPage = { title: '', slug: '', description: '', template: 'default', isActive: true, sections: [] };
const emptySection = { type: 'heroBanner', title: '', content: '', image: '', backgroundColor: '', buttonText: 'Shop Now', buttonLink: '/stores', limit: 8, order: 1 };

export default function AdminPagesManager() {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPage, setEditingPage] = useState<any>(null);
  const [form, setForm] = useState<any>(emptyPage);
  const [newSection, setNewSection] = useState<any>(emptySection);
  const [deleteConfirm, setDeleteConfirm] = useState<any>(null);
  const [expandedSection, setExpandedSection] = useState<number | null>(0);

  const [banners, setBanners] = useState<any[]>([]);

  useEffect(() => { fetchPages(); fetchBanners(); }, []);

  const fetchBanners = async () => {
    try {
      const res = await getBanners();
      const data = res.data?.data ?? res.data ?? [];
      setBanners(Array.isArray(data) ? data : []);
    } catch {}
  };

  const fetchPages = async () => {
    try {
      const res = await getAllPages();
      const data = res.data?.data ?? res.data ?? [];
      setPages(Array.isArray(data) ? data : []);
    } catch { toast.error('Failed to load pages'); }
    finally { setLoading(false); }
  };

  const slugify = (str: string) =>
    str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const openCreate = () => {
    setForm(emptyPage);
    setEditingPage(null);
    setNewSection(emptySection);
    setExpandedSection(0);
    setShowForm(true);
  };

  const openEdit = (page: any) => {
    setForm({ ...page, sections: page.sections || [] });
    setEditingPage(page);
    setNewSection({ ...emptySection, order: (page.sections?.length || 0) + 1 });
    setExpandedSection(null);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.slug.trim()) {
      toast.error('Title and URL slug are required');
      return;
    }
    try {
      if (editingPage) {
        await updatePage(form.slug, form);
        toast.success('Page updated!');
      } else {
        await createPage({ ...form, page: form.slug });
        toast.success(`Page "/${form.slug}" created!`);
      }
      setShowForm(false);
      fetchPages();
    } catch (e: any) {
      toast.error(e.response?.data?.error || 'Failed to save page');
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await deletePage(deleteConfirm._id);
      toast.success('Page deleted!');
      setDeleteConfirm(null);
      fetchPages();
    } catch { toast.error('Failed to delete page'); }
  };

  const addSection = () => {
    if (!newSection.title.trim()) { toast.error('Section title is required'); return; }
    const section = { ...newSection, id: `s_${Date.now()}`, order: form.sections.length + 1 };
    const updated = [...form.sections, section];
    setForm({ ...form, sections: updated });
    setNewSection({ ...emptySection, order: updated.length + 1 });
    setExpandedSection(updated.length - 1);
    toast.success('Section added');
  };

  const removeSection = (idx: number) => {
    setForm({ ...form, sections: form.sections.filter((_: any, i: number) => i !== idx) });
  };

  const updateSection = (idx: number, field: string, value: any) => {
    const sections = [...form.sections];
    sections[idx] = { ...sections[idx], [field]: value };
    setForm({ ...form, sections });
  };

  const card = 'bg-white rounded-2xl border border-slate-100 shadow-sm';

  return (
    <AdminShell>
      {/* Header */}
      <div className={`${card} flex justify-between items-center p-5 mb-6`}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-indigo-50">
            <FileText size={22} className="text-indigo-500" />
          </div>
          <div>
            <h2 className="font-bold text-slate-800 text-lg leading-tight">Pages Manager</h2>
            <p className="text-slate-400 text-sm mt-0.5">Create and manage public pages like /about, /contact, /categories</p>
          </div>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
          <Plus size={16} /> New Page
        </button>
      </div>

      {/* How it works info */}
      <div className="mb-6 p-4 rounded-2xl border border-indigo-100 bg-indigo-50 flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Layout size={16} className="text-indigo-600" />
        </div>
        <div>
          <p className="text-sm font-semibold text-indigo-800">How it works</p>
          <p className="text-sm text-indigo-600 mt-0.5">
            Create a page with a slug like <code className="bg-indigo-100 px-1 rounded">about</code> and it becomes live at{' '}
            <code className="bg-indigo-100 px-1 rounded">http://localhost:3000/about</code> instantly.
            Add sections like Hero Banner, Text Content, Coupons, Stores etc. to build the page layout.
          </p>
        </div>
      </div>

      {/* Pages list */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="h-36 rounded-2xl animate-pulse bg-slate-100" />)}
        </div>
      ) : pages.length === 0 ? (
        <div className={`${card} p-16 flex flex-col items-center gap-4 text-center`}>
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center">
            <FileText size={28} className="text-indigo-400" />
          </div>
          <p className="font-semibold text-slate-700 text-lg">No pages yet</p>
          <p className="text-slate-400 text-sm">Click "New Page" to create your first page</p>
          <button onClick={openCreate}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold mt-2"
            style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
            <Plus size={15} /> Create First Page
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pages.map((page) => (
            <div key={page._id} className={`${card} p-5 flex flex-col gap-3 hover:shadow-md transition-shadow`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 text-base truncate">{page.title}</p>
                  <p className="text-indigo-500 text-sm font-mono mt-0.5">{page.slug === 'home' ? '/ (homepage)' : `/${page.slug}`}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${page.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                  {page.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              {page.description && (
                <p className="text-slate-400 text-sm line-clamp-2">{page.description}</p>
              )}

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Layout size={12} />
                <span>{page.sections?.length || 0} sections</span>
                <span>·</span>
                <span>{page.template || 'default'} template</span>
              </div>

              <div className="flex items-center gap-2 pt-1 border-t border-slate-50">
                <button onClick={() => openEdit(page)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors">
                  <Edit size={12} /> Edit
                </button>
                <a href={page.slug === 'home' ? '/' : `/${page.slug}`} target="_blank" rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition-colors no-underline">
                  <Eye size={12} /> Preview
                </a>
                <button onClick={() => setDeleteConfirm(page)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-500 bg-red-50 hover:bg-red-100 transition-colors ml-auto">
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Create / Edit Drawer ── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative z-10 ml-auto w-full max-w-2xl h-full bg-white flex flex-col shadow-2xl overflow-hidden">

            {/* Drawer header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
              <div className="flex items-center gap-3">
                <FileText size={18} className="text-white" />
                <p className="text-white font-bold text-base">{editingPage ? `Edit: ${editingPage.title}` : 'Create New Page'}</p>
              </div>
              <button onClick={() => setShowForm(false)} className="text-white/70 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Drawer body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">

              {/* Page details */}
              <div className="space-y-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Page Details</p>

                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-1.5">Page Title *</label>
                  <input
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-indigo-400 transition-colors"
                    placeholder="e.g., About Us"
                    value={form.title}
                    onChange={e => {
                      const title = e.target.value;
                      setForm({ ...form, title, slug: editingPage ? form.slug : slugify(title), page: editingPage ? form.page : slugify(title) });
                    }}
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-1.5">
                    URL Slug * <span className="text-indigo-500 font-mono text-xs">→ localhost:3000/{form.slug === 'home' ? '' : (form.slug || 'your-slug')}</span>
                  </label>
                  <input
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono outline-none focus:border-indigo-400 transition-colors"
                    placeholder="e.g., about-us"
                    value={form.slug}
                    onChange={e => setForm({ ...form, slug: slugify(e.target.value), page: slugify(e.target.value) })}
                  />
                  {form.slug === 'home' && (
                    <p className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg mt-1.5">
                      ⚠️ The <strong>home</strong> slug maps to <strong>localhost:3000/</strong> (the homepage). It is managed by the homepage sections above.
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-1.5">Description (SEO)</label>
                  <textarea
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-indigo-400 transition-colors resize-none"
                    rows={2}
                    placeholder="Brief description for search engines"
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-slate-700 block mb-1.5">Template</label>
                    <select
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-indigo-400 bg-white"
                      value={form.template}
                      onChange={e => setForm({ ...form, template: e.target.value })}
                    >
                      {TEMPLATES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 block mb-1.5">Status</label>
                    <select
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-indigo-400 bg-white"
                      value={form.isActive ? 'active' : 'inactive'}
                      onChange={e => setForm({ ...form, isActive: e.target.value === 'active' })}
                    >
                      <option value="active">Active (visible)</option>
                      <option value="inactive">Inactive (hidden)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Sections */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Page Sections ({form.sections.length})</p>

                {/* Existing sections */}
                {form.sections.map((section: any, idx: number) => {
                  const SType = SECTION_TYPES.find(s => s.value === section.type);
                  const Icon = SType?.icon || AlignLeft;
                  const isOpen = expandedSection === idx;
                  return (
                    <div key={section.id || idx} className="border border-slate-200 rounded-xl overflow-hidden">
                      <button
                        className="w-full flex items-center gap-3 px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
                        onClick={() => setExpandedSection(isOpen ? null : idx)}
                      >
                        <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                          <Icon size={14} className="text-indigo-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-700 truncate">{section.title}</p>
                          <p className="text-xs text-slate-400">{SType?.label}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={e => { e.stopPropagation(); removeSection(idx); }}
                            className="p-1 rounded-lg text-red-400 hover:bg-red-50 transition-colors">
                            <Trash2 size={13} />
                          </button>
                          {isOpen ? <ChevronUp size={15} className="text-slate-400" /> : <ChevronDown size={15} className="text-slate-400" />}
                        </div>
                      </button>

                      {isOpen && (
                        <div className="p-4 space-y-3 border-t border-slate-100">
                          <input className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-indigo-400"
                            placeholder="Section title" value={section.title}
                            onChange={e => updateSection(idx, 'title', e.target.value)} />

                          {(section.type === 'heroBanner') && (
                            <>
                              <input className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-indigo-400"
                                placeholder="Image URL (https://...)" value={section.image || ''}
                                onChange={e => updateSection(idx, 'image', e.target.value)} />
                              <textarea className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-indigo-400 resize-none"
                                rows={2} placeholder="Subtitle / description" value={section.content || ''}
                                onChange={e => updateSection(idx, 'content', e.target.value)} />
                              <div className="grid grid-cols-2 gap-3">
                                <input className="px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-indigo-400"
                                  placeholder="Button text" value={section.buttonText || ''}
                                  onChange={e => updateSection(idx, 'buttonText', e.target.value)} />
                                <input className="px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-indigo-400"
                                  placeholder="Button link e.g. /stores" value={section.buttonLink || ''}
                                  onChange={e => updateSection(idx, 'buttonLink', e.target.value)} />
                              </div>
                            </>
                          )}

                          {(section.type === 'textContent' || section.type === 'customHTML') && (
                            <textarea className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-indigo-400 resize-none font-mono"
                              rows={5} placeholder={section.type === 'customHTML' ? '<h1>Hello</h1>' : 'Enter your content...'}
                              value={section.content || ''}
                              onChange={e => updateSection(idx, 'content', e.target.value)} />
                          )}

                          {['featuredCoupons','trendingCoupons','topStores','categories'].includes(section.type) && (
                            <div className="flex items-center gap-3">
                              <label className="text-sm text-slate-600">Items to show:</label>
                              <input type="number" min={1} max={50}
                                className="w-20 px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-indigo-400"
                                value={section.limit || 8}
                                onChange={e => updateSection(idx, 'limit', parseInt(e.target.value) || 8)} />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Add new section */}
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 space-y-3">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Add Section</p>

                  <div className="grid grid-cols-2 gap-2">
                    {SECTION_TYPES.map(st => {
                      const Icon = st.icon;
                      const selected = newSection.type === st.value;
                      return (
                        <button key={st.value}
                          onClick={() => setNewSection({ ...newSection, type: st.value })}
                          className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left transition-all ${selected ? 'border-indigo-400 bg-indigo-50' : 'border-slate-200 hover:border-slate-300 bg-white'}`}>
                          <Icon size={14} className={selected ? 'text-indigo-500' : 'text-slate-400'} />
                          <div>
                            <p className={`text-xs font-semibold ${selected ? 'text-indigo-700' : 'text-slate-600'}`}>{st.label}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <input
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-indigo-400"
                    placeholder="Section title e.g. Welcome Banner"
                    value={newSection.title}
                    onChange={e => setNewSection({ ...newSection, title: e.target.value })}
                  />

                  <button onClick={addSection}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors">
                    <Plus size={15} /> Add Section
                  </button>
                </div>
              </div>
            </div>

            {/* Drawer footer */}
            <div className="flex-shrink-0 px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
              <button onClick={() => setShowForm(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors">
                Cancel
              </button>
              <button onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                {editingPage ? 'Save Changes' : 'Create Page'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
          <div className="relative z-10 bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={22} className="text-red-500" />
            </div>
            <p className="text-center font-bold text-slate-800 text-base mb-1">Delete "{deleteConfirm.title}"?</p>
            <p className="text-center text-slate-400 text-sm mb-5">The page at <code className="bg-slate-100 px-1 rounded">/{deleteConfirm.slug}</code> will be permanently removed.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)}
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
