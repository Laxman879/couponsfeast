'use client';
import { useState, useEffect } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { getAllPages, createPage, updatePage, deletePage } from '@/services/api';
import toast from 'react-hot-toast';
import RichTextEditor from '@/components/admin/RichTextEditor';
import {
  FileText, Plus, Edit, Trash2, Eye, X, ChevronDown, ChevronUp,
  Layout, Type, Image, Tag, Store, Star, AlignLeft, Code
} from 'lucide-react';
import { getBanners } from '@/services/api';

const SECTION_TYPES = [
  { value: 'customHTML',      label: 'Rich Content',      icon: Code,      desc: 'Rich text with headings, lists, links' },
];

const TEMPLATES = [
  { value: 'default',  label: 'Default' },
  { value: 'legal',    label: 'Legal Page (Privacy, Terms)' },
];

const BANNER_LAYOUTS = [
  { value: 'fullWidth',  label: 'Full Width',    desc: 'Image with centered overlay text' },
  { value: 'splitImage', label: 'Split Image',   desc: 'Image left, text right' },
  { value: 'centered',   label: 'Centered Card', desc: 'Card on colored background' },
  { value: 'minimal',    label: 'Minimal Bar',   desc: 'Text + button only' },
  { value: 'overlay',    label: 'Overlay',       desc: 'Bottom gradient overlay' },
];

const emptyPage = { title: '', slug: '', description: '', template: 'default', isActive: true, sections: [] };
const emptySection = { type: 'customHTML', title: '', content: '', image: '', backgroundColor: '', buttonText: '', buttonLink: '', limit: 8, order: 1 };

const PRIVACY_TEMPLATE = `
<p><strong>COUPON FEAST</strong> IS OWNED AND OPERATED BY Coupon Feast Pvt. Ltd. BY USING THE WEBSITE, YOU AGREE TO THE TERMS AND CONDITIONS OF THIS POLICY. IF YOU DO NOT AGREE WITH THE TERMS AND CONDITIONS OF THIS POLICY, PLEASE DO NOT PROCEED FURTHER TO USE THIS WEBSITE.</p>

<p>We are committed to protecting and respecting your privacy. This policy (together with our website terms and conditions) sets in place the fundamentals based on which any personal data we collect from you or that you provide us, will be processed. Please read the following points carefully to understand our views and practices regarding your personal data and how we will treat it.</p>

<h2>INFORMATION WE MAY COLLECT FROM YOU</h2>
<ul>
<li>We may collect either your contact information, relationship information, location information, analytics information or all of them.</li>
<li>We may also store a record of your correspondence when you contact us.</li>
<li>We may ask your information purely for surveys that we use for research purposes, although you may choose not to participate in such surveys.</li>
</ul>

<h2>Cookie Policy</h2>
<p>This site uses cookies, which are tiny files that are downloaded to your computer, to improve your experience. This page describes what information they gather, how we use it, and why we sometimes need to store these cookies.</p>

<h3>How Do We Use Cookies?</h3>
<ul>
<li>Personalize your experience on our website.</li>
<li>Understand how you interact with our website and improve its functionality.</li>
<li>Provide relevant advertising to you.</li>
<li>Analyze website traffic and usage patterns.</li>
</ul>

<h2>IP ADDRESSES AND COOKIES</h2>
<ul>
<li>Web logs of your visits to our website include, but not limited to, traffic data, location data, and other communication data and the resources that you access.</li>
<li>We may collect information about your computer, including IP address, operating system, and browser type, for system administration and to report aggregate information.</li>
<li>Cookies contain information that is transferred to your computer's hard drive. These cookies help us to improve our website and to deliver a better and more personalized service.</li>
</ul>

<h2>STORING YOUR PERSONAL DATA</h2>
<ul>
<li>All the information you provide us is stored on our secured servers. However, the password you create for your account should be confidential and you should not share your password with anyone.</li>
<li>To ensure complete security, we suggest you use integrated domains such as Gmail and Facebook.</li>
</ul>

<h2>UPDATING/REMOVING PERSONAL INFORMATION</h2>
<ul>
<li>If any required amendments to your personal data is required then it is your responsibility to advise us.</li>
<li>If you no longer desire our service, please let us know and we shall correct, update or remove your personal data provided to us.</li>
</ul>

<h2>USE OF THE PERSONAL INFORMATION</h2>
<ul>
<li>To enable you with data, products or services which you have requested from us or which we feel may interest you.</li>
<li>To ensure that content from our website is presented in the most effective manner for you.</li>
<li>To enable you to participate in interactive features of our services.</li>
<li>To notify you about changes to our service.</li>
</ul>

<h2>We Value Your Privacy</h2>
<p>If you have any questions or complaints concerning this Privacy Policy, please contact us by e-mail at <a href="mailto:support@couponsfeast.com">support@couponsfeast.com</a></p>
`.trim();

const TERMS_TEMPLATE = `
<h2>TERMS ACCEPTANCE</h2>
<p>Coupon Feast (hereinafter referred to as "Coupon Feast", "we", "us", or "our") provides a digital coupon marketplace (the "Services") which includes, and is accessible via the website. The Services allow users to access coupons of certain third-party merchants ("Merchants") for online use. By using the Services, you agree to comply with and be legally bound by the terms and conditions of these Terms of Use ("Terms").</p>
<p>If you do not agree to these terms, please do not use the Services.</p>
<p><strong>Unauthorized access, distribution, reproduction, copying, retransmission, publication, sale, exploitation (commercial or otherwise), or any other form of transfer of any portion of the Site, Application or Services is hereby expressly prohibited.</strong></p>

<h2>INTRODUCTION</h2>
<p>Coupon Feast offers you the specified discount against items/products belonging to the concerned merchants that are widely sold online. These discount vouchers are set-up by the promotional criteria by the merchants themselves and can be availed by anyone. These coupons usually last for a certain amount of time and will expire after a specified period.</p>
<p>"Login" means we have enabled the "User" to register and have access to certain elements of the website under our terms of use.</p>
<p>"User" means any person who visits or uses the website.</p>

<h2>PARTICIPATION</h2>
<h3>Registration</h3>
<p>To utilize certain portions of the Services, you may be required to complete a registration process and establish an account with Coupon Feast ("Account"). You represent and warrant that all information provided by you is current, accurate, and complete.</p>

<h3>Password and Security</h3>
<p>As a registered user of the Services, you may receive or establish a user name and one or more passwords. You are solely responsible for maintaining the confidentiality and security of your password(s) and account(s).</p>

<h3>Privacy</h3>
<p>Coupon Feast respects the privacy of the users. The Privacy Policy provided via the Site is expressly incorporated herein by reference and made a part of these Terms.</p>

<h2>ACCURACY</h2>
<p>Coupon Feast makes no representation or warranty as to the accuracy or fitness for use of any offers, including, but not limited to, coupons, rebates, discounts, etc. posted via the Services or that any third party will honor or acknowledge any such offers.</p>
<p>Coupon Feast is not responsible for providing any value for any offers, coupons, rebates, discounts, etc. posted via the Services.</p>

<h2>TRADEMARK INFORMATION</h2>
<p>You agree that all of Coupon Feast trademarks, trade names, service marks, and other logos and brand features that are displayed via the Services are trademarks and the property of Coupon Feast. You agree not to display or use Coupon Feast's Marks in any manner without prior permission.</p>

<h2>INTELLECTUAL PROPERTY OWNERSHIP</h2>
<p>All right, title and interest in the Services, including technology and trade secrets embodied therein, shall belong solely and exclusively to Coupon Feast or its licensors. You shall have no rights whatsoever in any of the foregoing.</p>

<h2>DISCLAIMER, RELEASE &amp; LIMITATION OF LIABILITY</h2>
<h3>Disclaimer</h3>
<p>The services are provided by Coupon Feast on an "As is" and "As available" basis. Coupon Feast makes no representations or warranties of any kind, express or implied.</p>

<h3>Release</h3>
<p>You are solely responsible for your interactions with merchants and other users of the site.</p>

<h3>Limitation of Liability</h3>
<p>Coupon Feast will not be liable for any damages of any kind arising from the use of this service, including, but not limited to direct, indirect, incidental, punitive, and consequential damages.</p>

<h2>RESTRICTED ACCESS</h2>
<ol>
<li>We have restricted access to certain areas of our website. We reserve the right to restrict access to other areas of our website at our discretion.</li>
<li>If we find any data outflow then we will immediately disable your user ID and password without prior notice or explanation.</li>
</ol>
`.trim();

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

  const openCreate = (template?: string) => {
    if (template === 'privacy-policy') {
      setForm({
        title: 'Privacy Policy', slug: 'privacy-policy', page: 'privacy-policy', description: 'Privacy Policy', template: 'legal', isActive: true,
        sections: [{ id: `s_${Date.now()}`, type: 'customHTML', title: 'Privacy Policy', order: 1, content: PRIVACY_TEMPLATE }],
      });
    } else if (template === 'terms-and-conditions') {
      setForm({
        title: 'Terms & Conditions', slug: 'terms-and-conditions', page: 'terms-and-conditions', description: 'Terms and Conditions', template: 'legal', isActive: true,
        sections: [{ id: `s_${Date.now()}`, type: 'customHTML', title: 'Terms & Conditions', order: 1, content: TERMS_TEMPLATE }],
      });
    } else {
      setForm(emptyPage);
    }
    setEditingPage(null);
    setNewSection(emptySection);
    setExpandedSection(0);
    setShowForm(true);
  };

  const openEdit = (page: any) => {
    setForm({ ...page, sections: page.sections || [] });
    setEditingPage(page);
    setNewSection({ ...emptySection, order: (page.sections?.length || 0) + 1 });
    setExpandedSection(0);
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
        <button onClick={() => openCreate()}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
          <Plus size={16} /> New Page
        </button>
      </div>

      {/* Quick Templates */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button onClick={() => openCreate('privacy-policy')}
          className="flex items-center gap-3 p-4 rounded-2xl border border-slate-200 bg-white hover:shadow-md hover:border-indigo-300 transition-all text-left">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
            <FileText size={18} className="text-indigo-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">Privacy Policy</p>
            <p className="text-xs text-slate-400">Pre-filled legal template — edit and publish</p>
          </div>
        </button>
        <button onClick={() => openCreate('terms-and-conditions')}
          className="flex items-center gap-3 p-4 rounded-2xl border border-slate-200 bg-white hover:shadow-md hover:border-indigo-300 transition-all text-left">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
            <FileText size={18} className="text-amber-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">Terms & Conditions</p>
            <p className="text-xs text-slate-400">Pre-filled legal template — edit and publish</p>
          </div>
        </button>
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
          <button onClick={() => openCreate()}
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
                              <RichTextEditor value={section.content || ''} onChange={val => updateSection(idx, 'content', val)} placeholder="Subtitle / description" />
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
                            <RichTextEditor
                              value={section.content || ''}
                              onChange={val => updateSection(idx, 'content', val)}
                              placeholder={section.type === 'customHTML' ? 'Write your HTML content...' : 'Write your content here...'}
                            />
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
