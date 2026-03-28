'use client';

import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  TextField, 
  Button, 
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getNavigation, updateNavigation, getPage, updatePage, getCategories, createCategory, updateCategory, deleteCategory, getPopularStores, createPopularStore, updatePopularStore, deletePopularStore, getAllFooterLinksAdmin, createFooterLink, updateFooterLink, deleteFooterLink, getAllPages, createPage, deletePage, getSiteConfig, updateSiteConfig } from '@/services/api';
import SiteConfigAdmin from '@/components/admin/SiteConfigAdmin';
import AdminShell from '@/components/admin/AdminShell';
import toast from 'react-hot-toast';

export default function CMSAdmin() {
  const [navigation, setNavigation] = useState<any>({ menu: [], theme: {} });
  const [homePage, setHomePage] = useState<any>({ sections: [] });
  const [categories, setCategories] = useState<any[]>([]);
  const [popularStores, setPopularStores] = useState<any[]>([]);
  const [footerLinks, setFooterLinks] = useState<any[]>([]);
  const [pages, setPages] = useState<any[]>([]);
  const [faqHeading, setFaqHeading] = useState('Frequently Asked Questions');
  const [faqItems, setFaqItems] = useState<{ question: string; answer: string }[]>([]);
  const [pageEditorOpen, setPageEditorOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<any>(null);
  const [newPage, setNewPage] = useState({
    title: '',
    slug: '',
    page: '',
    description: '',
    template: 'default',
    isActive: true,
    sections: []
  });
  const [newSection, setNewSection] = useState({
    type: 'textContent',
    title: '',
    content: '',
    order: 1
  });
  const [newCategory, setNewCategory] = useState({ 
    name: '', 
    color: 'text-gray-600', 
    createNavLink: 'no',
    dropdownSection: 'categories'
  });
  const [newStore, setNewStore] = useState({ 
    name: '', 
    color: 'text-gray-600', 
    createNavLink: 'no',
    dropdownSection: 'popular'
  });
  const [newFooterLink, setNewFooterLink] = useState({
    label: '',
    href: '',
    section: 'main',
    order: 0
  });
  const [editingFooterLink, setEditingFooterLink] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [navRes, pageRes, categoriesRes, storesRes, footerLinksRes, pagesRes, cfgRes] = await Promise.all([
        getNavigation(),
        getPage('home'),
        getCategories(),
        getPopularStores(),
        getAllFooterLinksAdmin(),
        getAllPages(),
        getSiteConfig()
      ]);
      
      setNavigation(navRes.data);
      setHomePage(pageRes.data);
      setCategories(categoriesRes.data);
      setPopularStores(storesRes.data);
      setFooterLinks(footerLinksRes.data.data);
      setPages(pagesRes.data || []);
      setFaqHeading(cfgRes.data?.faqs?.heading || 'Frequently Asked Questions');
      setFaqItems(cfgRes.data?.faqs?.items || []);
    } catch (error) {
      console.error('Error fetching CMS data:', error);
    }
  };

  const handleSaveNavigation = async () => {
    const loadingToast = toast.loading('Updating navigation...');
    try {
      await updateNavigation(navigation);
      // Trigger navbar refresh
      localStorage.setItem('cms-updated', Date.now().toString());
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'cms-updated',
        newValue: Date.now().toString()
      }));
      toast.success('Navigation updated successfully!', { id: loadingToast });
    } catch (error) {
      toast.error('Error updating navigation. Please try again.', { id: loadingToast });
    }
  };

  const handleSavePage = async () => {
    const loadingToast = toast.loading('Updating homepage...');
    try {
      await updatePage('home', homePage);
      toast.success('Homepage updated successfully!', { id: loadingToast });
    } catch (error) {
      toast.error('Error updating homepage. Please try again.', { id: loadingToast });
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategory.name.trim()) {
      toast.error('Please enter a category name.');
      return;
    }
    
    const loadingToast = toast.loading('Creating category...');
    
    try {
      // Generate slug from name
      const slug = newCategory.name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      // Prepare category data
      const categoryData = {
        name: newCategory.name.trim(),
        slug: slug,
        color: newCategory.color || '#007bff',
        description: `${newCategory.name} category`,
        hasNavLink: newCategory.createNavLink !== 'no',
        navLocation: newCategory.createNavLink,
        dropdownSection: newCategory.dropdownSection || 'categories'
      };
      
      console.log('Creating category with data:', categoryData);
      
      // Create the category
      const response = await createCategory(categoryData);
      console.log('Category created successfully:', response.data);
      
      // Reset form
      setNewCategory({ 
        name: '', 
        color: 'text-gray-600', 
        createNavLink: 'no',
        dropdownSection: 'categories'
      });
      
      // Refresh data
      await fetchData();
      
      // Trigger dropdown refresh
      localStorage.setItem('cms-updated', Date.now().toString());
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'cms-updated',
        newValue: Date.now().toString()
      }));
      
      toast.success(`Category "${categoryData.name}" created successfully!`, { id: loadingToast });
      
    } catch (error) {
      console.error('Category creation error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Unknown error occurred';
      toast.error(`Error creating category: ${errorMessage}`, { id: loadingToast });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Delete this category?')) return;
    const loadingToast = toast.loading('Deleting category...');
    try {
      await deleteCategory(id);
      fetchData();
      toast.success('Category deleted successfully!', { id: loadingToast });
    } catch (error) {
      toast.error('Error deleting category. Please try again.', { id: loadingToast });
    }
  };

  const handleCreateStore = async () => {
    if (!newStore.name) {
      toast.error('Please enter a store name.');
      return;
    }
    const loadingToast = toast.loading('Creating store...');
    try {
      const storeData = {
        ...newStore,
        slug: newStore.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        logo: 'https://via.placeholder.com/40x40/6366f1/ffffff?text=' + newStore.name.charAt(0),
        hasNavLink: newStore.createNavLink !== 'no',
        navLocation: newStore.createNavLink,
        dropdownSection: newStore.dropdownSection
      };
      await createPopularStore(storeData);
      
      // If creating navigation link, update navigation menu
      if (newStore.createNavLink !== 'no') {
        const newMenuItem = {
          name: newStore.name,
          url: `/stores/${storeData.slug}`,
          section: newStore.dropdownSection
        };
        
        if (newStore.createNavLink === 'navbar' || newStore.createNavLink === 'both') {
          const updatedNavigation = {
            ...navigation,
            menu: [...navigation.menu, newMenuItem]
          };
          await updateNavigation(updatedNavigation);
          setNavigation(updatedNavigation);
        }
      }
      
      setNewStore({ 
        name: '', 
        color: 'text-gray-600', 
        createNavLink: 'no',
        dropdownSection: 'popular'
      });
      fetchData();
      toast.success(`Popular store "${newStore.name}" created successfully!`, { id: loadingToast });
    } catch (error) {
      toast.error('Error creating popular store. Please try again.', { id: loadingToast });
    }
  };

  const handleDeleteStore = async (id: string) => {
    if (!confirm('Delete this popular store?')) return;
    const loadingToast = toast.loading('Deleting store...');
    try {
      await deletePopularStore(id);
      fetchData();
      toast.success('Popular store deleted successfully!', { id: loadingToast });
    } catch (error) {
      toast.error('Error deleting popular store. Please try again.', { id: loadingToast });
    }
  };

  const handleCreateFooterLink = async () => {
    if (!newFooterLink.label || !newFooterLink.href) {
      toast.error('Please enter both label and URL for the footer link.');
      return;
    }
    const loadingToast = toast.loading('Creating footer link...');
    try {
      await createFooterLink(newFooterLink);
      setNewFooterLink({
        label: '',
        href: '',
        section: 'main',
        order: 0
      });
      fetchData();
      // Trigger footer refresh
      localStorage.setItem('cms-updated', Date.now().toString());
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'cms-updated',
        newValue: Date.now().toString()
      }));
      toast.success(`Footer link "${newFooterLink.label}" created successfully!`, { id: loadingToast });
    } catch (error) {
      toast.error('Error creating footer link. Please try again.', { id: loadingToast });
    }
  };

  const handleDeleteFooterLink = async (id: string) => {
    if (!confirm('Delete this footer link?')) return;
    const loadingToast = toast.loading('Deleting footer link...');
    try {
      await deleteFooterLink(id);
      fetchData();
      localStorage.setItem('cms-updated', Date.now().toString());
      window.dispatchEvent(new StorageEvent('storage', { key: 'cms-updated', newValue: Date.now().toString() }));
      toast.success('Footer link deleted successfully!', { id: loadingToast });
    } catch (error) {
      toast.error('Error deleting footer link. Please try again.', { id: loadingToast });
    }
  };

  const handleUpdateFooterLink = async () => {
    if (!editingFooterLink?.label || !editingFooterLink?.href) {
      toast.error('Label and URL are required.');
      return;
    }
    const loadingToast = toast.loading('Updating footer link...');
    try {
      await updateFooterLink(editingFooterLink._id, {
        label: editingFooterLink.label,
        href: editingFooterLink.href,
        section: editingFooterLink.section,
        order: editingFooterLink.order
      });
      setEditingFooterLink(null);
      fetchData();
      localStorage.setItem('cms-updated', Date.now().toString());
      window.dispatchEvent(new StorageEvent('storage', { key: 'cms-updated', newValue: Date.now().toString() }));
      toast.success('Footer link updated!', { id: loadingToast });
    } catch (error) {
      toast.error('Error updating footer link.', { id: loadingToast });
    }
  };

  // Page Management Functions
  const handleCreatePage = async () => {
    if (!newPage.title.trim() || !newPage.slug.trim()) {
      toast.error('Please enter both page title and URL slug.');
      return;
    }
    
    const loadingToast = toast.loading('Creating page...');
    try {
      const pageData = {
        ...newPage,
        sections: []
      };
      
      await createPage(pageData);
      
      // Reset form
      setNewPage({
        title: '',
        slug: '',
        page: '',
        description: '',
        template: 'default',
        isActive: true,
        sections: []
      });
      
      // Refresh data
      await fetchData();
      
      toast.success(`Page "${pageData.title}" created successfully!`, { id: loadingToast });
    } catch (error) {
      console.error('Page creation error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Unknown error occurred';
      toast.error(`Error creating page: ${errorMessage}`, { id: loadingToast });
    }
  };

  const handleEditPage = (page: any) => {
    setEditingPage({
      ...page,
      sections: page.sections || []
    });
    setPageEditorOpen(true);
  };

  const handleDeletePage = async (pageId: string) => {
    if (!confirm('Delete this page? This action cannot be undone.')) return;
    
    const loadingToast = toast.loading('Deleting page...');
    try {
      await deletePage(pageId);
      await fetchData();
      toast.success('Page deleted successfully!', { id: loadingToast });
    } catch (error) {
      console.error('Page deletion error:', error);
      toast.error('Error deleting page. Please try again.', { id: loadingToast });
    }
  };

  const handleAddSection = () => {
    if (!newSection.type || !newSection.title.trim()) {
      toast.error('Please enter section type and title.');
      return;
    }
    
    const sectionToAdd = {
      ...newSection,
      id: `section_${Date.now()}`,
      content: '',
      image: '',
      limit: newSection.type.includes('Coupons') || newSection.type.includes('Stores') ? 10 : undefined
    };
    
    setEditingPage({
      ...editingPage,
      sections: [...(editingPage.sections || []), sectionToAdd]
    });
    
    // Reset new section form
    setNewSection({
      type: 'textContent',
      title: '',
      content: '',
      order: (editingPage.sections?.length || 0) + 1
    });
    
    toast.success('Section added successfully!');
  };

  const handleUpdateSection = (index: number, field: string, value: any) => {
    const updatedSections = [...editingPage.sections];
    updatedSections[index] = {
      ...updatedSections[index],
      [field]: value
    };
    
    setEditingPage({
      ...editingPage,
      sections: updatedSections
    });
  };

  const handleRemoveSection = (index: number) => {
    if (!confirm('Remove this section?')) return;
    
    const updatedSections = editingPage.sections.filter((_: any, i: number) => i !== index);
    setEditingPage({
      ...editingPage,
      sections: updatedSections
    });
    
    toast.success('Section removed successfully!');
  };

  const handleSavePageContent = async () => {
    if (!editingPage) return;
    
    const loadingToast = toast.loading('Saving page content...');
    try {
      await updatePage(editingPage.page, editingPage);
      
      // Refresh data
      await fetchData();
      
      // Close editor
      setPageEditorOpen(false);
      setEditingPage(null);
      
      toast.success('Page content saved successfully!', { id: loadingToast });
    } catch (error) {
      console.error('Page save error:', error);
      toast.error('Error saving page content. Please try again.', { id: loadingToast });
    }
  };

  return (
    <AdminShell>
    <Box sx={{ p: 0 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        CMS Admin Panel
      </Typography>

      {/* Comprehensive Site Configuration */}
      <SiteConfigAdmin />

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Navigation Menu</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Background Color"
                value={navigation.theme?.backgroundColor || '#7c3aed'}
                onChange={(e) => setNavigation({
                  ...navigation, 
                  theme: {...navigation.theme, backgroundColor: e.target.value}
                })}
                placeholder="#7c3aed"
                helperText="Hex color code for navbar background"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Text Color"
                value={navigation.theme?.textColor || '#ffffff'}
                onChange={(e) => setNavigation({
                  ...navigation, 
                  theme: {...navigation.theme, textColor: e.target.value}
                })}
                placeholder="#ffffff"
                helperText="Hex color code for navbar text"
              />
            </Grid>
          </Grid>
          {navigation.menu?.map((item: any, index: number) => (
            <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Menu Name"
                  value={item.name}
                  onChange={(e) => {
                    const newMenu = [...navigation.menu];
                    newMenu[index].name = e.target.value;
                    setNavigation({...navigation, menu: newMenu});
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="URL"
                  value={item.url}
                  onChange={(e) => {
                    const newMenu = [...navigation.menu];
                    newMenu[index].url = e.target.value;
                    setNavigation({...navigation, menu: newMenu});
                  }}
                />
              </Grid>
            </Grid>
          ))}
          <Button variant="contained" onClick={handleSaveNavigation}>
            Save Navigation
          </Button>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Homepage Sections</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {homePage.sections?.map((section: any, index: number) => (
            <Card key={index} sx={{ mb: 2 }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={3}>
                    <TextField
                      fullWidth
                      label="Order"
                      type="number"
                      value={section.order}
                      onChange={(e) => {
                        const newSections = [...homePage.sections];
                        newSections[index].order = parseInt(e.target.value);
                        setHomePage({...homePage, sections: newSections});
                      }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      fullWidth
                      label="Type"
                      value={section.type}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Title"
                      value={section.title || ''}
                      onChange={(e) => {
                        const newSections = [...homePage.sections];
                        newSections[index].title = e.target.value;
                        setHomePage({...homePage, sections: newSections});
                      }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
          <Button variant="contained" onClick={handleSavePage}>
            Save Homepage
          </Button>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Categories Management</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
            Manage categories that appear in the navbar dropdown. You can create navigation links and choose where they appear.
          </Typography>
          
          {/* Add Category Form */}
          <Card variant="outlined" sx={{ mb: 3, p: 2, backgroundColor: '#f8f9fa' }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Add New Category
            </Typography>
            <Grid container spacing={2} alignItems="end">
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Category Name"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  label="Color Class"
                  value={newCategory.color}
                  onChange={(e) => setNewCategory({...newCategory, color: e.target.value})}
                  placeholder="text-blue-600"
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Navigation Link</InputLabel>
                  <Select
                    value={newCategory.createNavLink || 'no'}
                    label="Navigation Link"
                    onChange={(e) => setNewCategory({...newCategory, createNavLink: e.target.value})}
                  >
                    <MenuItem value="no">No Link</MenuItem>
                    <MenuItem value="navbar">Navbar Only</MenuItem>
                    <MenuItem value="footer">Footer Only</MenuItem>
                    <MenuItem value="both">Both</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Dropdown Section</InputLabel>
                  <Select
                    value={newCategory.dropdownSection || 'categories'}
                    label="Dropdown Section"
                    onChange={(e) => setNewCategory({...newCategory, dropdownSection: e.target.value})}
                  >
                    <MenuItem value="categories">Categories Section</MenuItem>
                    <MenuItem value="popular">Popular Section</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button 
                  variant="contained" 
                  onClick={handleCreateCategory} 
                  fullWidth
                  size="small"
                  sx={{ py: 1.5 }}
                >
                  Add Category
                </Button>
              </Grid>
            </Grid>
          </Card>
          
          {/* Categories List */}
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
            Existing Categories
          </Typography>
          
          {categories.map((category: any) => (
            <Card key={category._id} sx={{ mb: 2 }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={2}>
                    <Typography className={category.color}>{category.name}</Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography variant="body2" color="text.secondary">{category.color}</Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography variant="body2" color="text.secondary">/{category.slug}</Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography variant="body2" color={category.hasNavLink ? 'success.main' : 'text.secondary'}>
                      {category.hasNavLink ? `✅ ${category.navLocation || 'navbar'}` : '❌ No Nav Link'}
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography variant="body2" color="text.secondary">
                      {category.dropdownSection || 'categories'} section
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Button 
                      color="error" 
                      size="small"
                      onClick={() => handleDeleteCategory(category._id)}
                    >
                      Delete
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Popular Stores Management</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
            Manage popular stores that appear in the navbar dropdown. You can create navigation links and choose where they appear.
          </Typography>
          
          {/* Add Store Form */}
          <Card variant="outlined" sx={{ mb: 3, p: 2, backgroundColor: '#f8f9fa' }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Add New Popular Store
            </Typography>
            <Grid container spacing={2} alignItems="end">
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Store Name"
                  value={newStore.name}
                  onChange={(e) => setNewStore({...newStore, name: e.target.value})}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  label="Color Class"
                  value={newStore.color}
                  onChange={(e) => setNewStore({...newStore, color: e.target.value})}
                  placeholder="text-red-600"
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Navigation Link</InputLabel>
                  <Select
                    value={newStore.createNavLink || 'no'}
                    label="Navigation Link"
                    onChange={(e) => setNewStore({...newStore, createNavLink: e.target.value})}
                  >
                    <MenuItem value="no">No Link</MenuItem>
                    <MenuItem value="navbar">Navbar Only</MenuItem>
                    <MenuItem value="footer">Footer Only</MenuItem>
                    <MenuItem value="both">Both</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Dropdown Section</InputLabel>
                  <Select
                    value={newStore.dropdownSection || 'popular'}
                    label="Dropdown Section"
                    onChange={(e) => setNewStore({...newStore, dropdownSection: e.target.value})}
                  >
                    <MenuItem value="categories">Categories Section</MenuItem>
                    <MenuItem value="popular">Popular Section</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button 
                  variant="contained" 
                  onClick={handleCreateStore} 
                  fullWidth
                  size="small"
                  sx={{ py: 1.5 }}
                >
                  Add Store
                </Button>
              </Grid>
            </Grid>
          </Card>
          
          {/* Stores List */}
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
            Existing Popular Stores
          </Typography>
          
          {popularStores.map((store: any) => (
            <Card key={store._id} sx={{ mb: 2 }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={2}>
                    <Typography className={store.color}>{store.name}</Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography variant="body2" color="text.secondary">{store.color}</Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography variant="body2" color="text.secondary">/{store.slug}</Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography variant="body2" color={store.hasNavLink ? 'success.main' : 'text.secondary'}>
                      {store.hasNavLink ? `✅ ${store.navLocation || 'navbar'}` : '❌ No Nav Link'}
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography variant="body2" color="text.secondary">
                      {store.dropdownSection || 'popular'} section
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Button 
                      color="error" 
                      size="small"
                      onClick={() => handleDeleteStore(store._id)}
                    >
                      Delete
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Pages Management</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
            Create and manage custom pages for your website. Each page can have multiple sections with different content types.
          </Typography>
          
          {/* Create New Page Form */}
          <Card variant="outlined" sx={{ mb: 3, p: 3, backgroundColor: '#f8f9fa' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Create New Page
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Page Title"
                  value={newPage.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                    setNewPage({...newPage, title, slug, page: slug});
                  }}
                  placeholder="e.g., About Us"
                  helperText="This will be the page title displayed to users"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Page URL (Slug)"
                  value={newPage.slug}
                  onChange={(e) => {
                    const slug = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                    setNewPage({...newPage, slug, page: slug});
                  }}
                  placeholder="e.g., about-us"
                  helperText="URL path: /about-us"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Page Template</InputLabel>
                  <Select
                    value={newPage.template}
                    label="Page Template"
                    onChange={(e) => setNewPage({...newPage, template: e.target.value})}
                  >
                    <MenuItem value="default">Default Template</MenuItem>
                    <MenuItem value="landing">Landing Page</MenuItem>
                    <MenuItem value="blog">Blog Style</MenuItem>
                    <MenuItem value="contact">Contact Page</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Page Description"
                  value={newPage.description}
                  onChange={(e) => setNewPage({...newPage, description: e.target.value})}
                  placeholder="Brief description of the page"
                  multiline
                  rows={2}
                  helperText="This will be used for SEO meta description"
                />
              </Grid>
              <Grid item xs={12}>
                <Button 
                  variant="contained" 
                  onClick={handleCreatePage}
                  size="large"
                  sx={{ 
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                >
                  Create Page
                </Button>
              </Grid>
            </Grid>
          </Card>
          
          {/* Existing Pages List */}
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mt: 3, mb: 2 }}>
            Existing Pages ({pages.length})
          </Typography>
          
          {pages.length === 0 ? (
            <Card sx={{ p: 4, textAlign: 'center', backgroundColor: '#f5f5f5' }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Custom Pages Created Yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Create your first custom page using the form above
              </Typography>
            </Card>
          ) : (
            pages.map((page) => (
              <Card key={page._id} sx={{ mb: 2, border: '1px solid #e0e0e0' }}>
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={3}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        {page.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        /{page.slug}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <Typography variant="body2" color="text.secondary">
                        Template: {page.template || 'default'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <Typography variant="body2" color="text.secondary">
                        Sections: {page.sections?.length || 0}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <Typography 
                        variant="body2" 
                        color={page.isActive ? 'success.main' : 'error.main'}
                        sx={{ fontWeight: 'medium' }}
                      >
                        {page.isActive ? '✅ Active' : '❌ Inactive'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Button 
                          size="small" 
                          variant="outlined"
                          onClick={() => handleEditPage(page)}
                          sx={{ color: 'primary.main', borderColor: 'primary.main' }}
                        >
                          Edit Content
                        </Button>
                        <Button 
                          size="small" 
                          variant="outlined"
                          color="success"
                          onClick={() => window.open(`/${page.slug}`, '_blank')}
                        >
                          Preview
                        </Button>
                        <Button 
                          size="small" 
                          color="error" 
                          variant="outlined"
                          onClick={() => handleDeletePage(page._id)}
                        >
                          Delete
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                  {page.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
                      {page.description}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </AccordionDetails>
      </Accordion>

      {/* Page Editor Modal */}
      <Dialog open={pageEditorOpen} onClose={() => setPageEditorOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ 
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          color: 'white',
          fontWeight: 'bold'
        }}>
          {editingPage ? `Edit Page: ${editingPage.title}` : 'Page Editor'}
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {editingPage && (
            <Box>
              {/* Page Settings */}
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
                Page Settings
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Page Title"
                    value={editingPage.title}
                    onChange={(e) => setEditingPage({...editingPage, title: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Page URL (Slug)"
                    value={editingPage.slug}
                    onChange={(e) => {
                      const slug = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                      setEditingPage({...editingPage, slug, page: slug});
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Page Description"
                    value={editingPage.description || ''}
                    onChange={(e) => setEditingPage({...editingPage, description: e.target.value})}
                    multiline
                    rows={2}
                  />
                </Grid>
              </Grid>

              {/* Page Sections */}
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Page Sections
              </Typography>
              
              {/* Add New Section */}
              <Card variant="outlined" sx={{ mb: 3, p: 2, backgroundColor: '#f8f9fa' }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Add New Section
                </Typography>
                <Grid container spacing={2} alignItems="end">
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Section Type</InputLabel>
                      <Select
                        value={newSection.type}
                        label="Section Type"
                        onChange={(e) => setNewSection({...newSection, type: e.target.value})}
                      >
                        <MenuItem value="textContent">Text Content</MenuItem>
                        <MenuItem value="heroBanner">Hero Banner</MenuItem>
                        <MenuItem value="featuredCoupons">Featured Coupons</MenuItem>
                        <MenuItem value="trendingCoupons">Trending Coupons</MenuItem>
                        <MenuItem value="topStores">Top Stores</MenuItem>
                        <MenuItem value="categories">Categories</MenuItem>
                        <MenuItem value="imageGallery">Image Gallery</MenuItem>
                        <MenuItem value="customHTML">Custom HTML</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Section Title"
                      value={newSection.title}
                      onChange={(e) => setNewSection({...newSection, title: e.target.value})}
                      placeholder="e.g., Welcome Section"
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Order"
                      type="number"
                      value={newSection.order}
                      onChange={(e) => setNewSection({...newSection, order: parseInt(e.target.value) || 1})}
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <Button 
                      variant="contained" 
                      onClick={handleAddSection}
                      fullWidth
                      size="small"
                      sx={{ py: 1.5 }}
                    >
                      Add Section
                    </Button>
                  </Grid>
                </Grid>
              </Card>

              {/* Existing Sections */}
              {editingPage.sections && editingPage.sections.length > 0 ? (
                editingPage.sections
                  .sort((a, b) => a.order - b.order)
                  .map((section, index) => (
                    <Card key={section.id || index} sx={{ mb: 2, border: '1px solid #ddd' }}>
                      <CardContent>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={2}>
                            <TextField
                              fullWidth
                              label="Order"
                              type="number"
                              value={section.order}
                              onChange={(e) => handleUpdateSection(index, 'order', parseInt(e.target.value) || 1)}
                              size="small"
                            />
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <TextField
                              fullWidth
                              label="Section Type"
                              value={section.type}
                              disabled
                              size="small"
                            />
                          </Grid>
                          <Grid item xs={12} md={5}>
                            <TextField
                              fullWidth
                              label="Section Title"
                              value={section.title || ''}
                              onChange={(e) => handleUpdateSection(index, 'title', e.target.value)}
                              size="small"
                            />
                          </Grid>
                          <Grid item xs={12} md={2}>
                            <Button 
                              color="error" 
                              size="small"
                              onClick={() => handleRemoveSection(index)}
                              fullWidth
                            >
                              Remove
                            </Button>
                          </Grid>
                          
                          {/* Section-specific fields */}
                          {(section.type === 'textContent' || section.type === 'customHTML') && (
                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                label={section.type === 'customHTML' ? 'HTML Content' : 'Text Content'}
                                value={section.content || ''}
                                onChange={(e) => handleUpdateSection(index, 'content', e.target.value)}
                                multiline
                                rows={4}
                                placeholder={section.type === 'customHTML' ? 'Enter HTML code...' : 'Enter your content...'}
                              />
                            </Grid>
                          )}
                          
                          {section.type === 'heroBanner' && (
                            <>
                              <Grid item xs={12} md={6}>
                                <TextField
                                  fullWidth
                                  label="Banner Image URL"
                                  value={section.image || ''}
                                  onChange={(e) => handleUpdateSection(index, 'image', e.target.value)}
                                  placeholder="https://example.com/image.jpg"
                                  size="small"
                                />
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <TextField
                                  fullWidth
                                  label="Background Color"
                                  value={section.backgroundColor || ''}
                                  onChange={(e) => handleUpdateSection(index, 'backgroundColor', e.target.value)}
                                  placeholder="#ffffff"
                                  size="small"
                                />
                              </Grid>
                              <Grid item xs={12}>
                                <TextField
                                  fullWidth
                                  label="Banner Content"
                                  value={section.content || ''}
                                  onChange={(e) => handleUpdateSection(index, 'content', e.target.value)}
                                  multiline
                                  rows={3}
                                  placeholder="Banner description or call-to-action text"
                                />
                              </Grid>
                            </>
                          )}
                          
                          {(section.type === 'featuredCoupons' || section.type === 'trendingCoupons' || section.type === 'topStores') && (
                            <Grid item xs={12} md={4}>
                              <TextField
                                fullWidth
                                label="Items Limit"
                                type="number"
                                value={section.limit || 10}
                                onChange={(e) => handleUpdateSection(index, 'limit', parseInt(e.target.value) || 10)}
                                size="small"
                              />
                            </Grid>
                          )}
                        </Grid>
                      </CardContent>
                    </Card>
                  ))
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                  No sections added yet. Add your first section above.
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, backgroundColor: '#f5f5f5' }}>
          <Button onClick={() => setPageEditorOpen(false)} variant="outlined">
            Cancel
          </Button>
          <Button 
            onClick={handleSavePageContent} 
            variant="contained"
            sx={{ 
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              color: 'white',
              fontWeight: 'bold'
            }}
          >
            Save Page Content
          </Button>
        </DialogActions>
      </Dialog>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Footer Links Management</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
            Manage footer links that appear in different sections. The footer UI design remains unchanged.
          </Typography>
          
          {/* Add Footer Link Form */}
          <Card variant="outlined" sx={{ mb: 3, p: 2, backgroundColor: '#f8f9fa' }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Add New Footer Link
            </Typography>
            <Grid container spacing={2} alignItems="end">
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Link Label"
                  value={newFooterLink.label}
                  onChange={(e) => setNewFooterLink({...newFooterLink, label: e.target.value})}
                  size="small"
                  placeholder="e.g., Privacy Policy"
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Link URL"
                  value={newFooterLink.href}
                  onChange={(e) => setNewFooterLink({...newFooterLink, href: e.target.value})}
                  size="small"
                  placeholder="e.g., /privacy"
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Section</InputLabel>
                  <Select
                    value={newFooterLink.section}
                    label="Section"
                    onChange={(e) => setNewFooterLink({...newFooterLink, section: e.target.value})}
                  >
                    <MenuItem value="main">Main Links</MenuItem>
                    <MenuItem value="myRmn">My RMN</MenuItem>
                    <MenuItem value="bottom">Bottom Links</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  label="Order"
                  type="number"
                  value={newFooterLink.order}
                  onChange={(e) => setNewFooterLink({...newFooterLink, order: parseInt(e.target.value) || 0})}
                  size="small"
                  placeholder="0"
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <Button 
                  variant="contained" 
                  onClick={handleCreateFooterLink} 
                  fullWidth
                  size="small"
                  sx={{ py: 1.5 }}
                >
                  Add Link
                </Button>
              </Grid>
            </Grid>
          </Card>
          
          {/* Footer Links List */}
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
            Existing Footer Links
          </Typography>
          
          {/* Group by section */}
          {['main', 'myRmn', 'bottom'].map((section) => {
            const sectionLinks = footerLinks.filter((link: any) => link.section === section);
            const sectionNames = {
              main: 'Main Links',
              myRmn: 'My RMN',
              bottom: 'Bottom Links'
            };
            
            return (
              <Box key={section} sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>
                  {sectionNames[section as keyof typeof sectionNames]} ({sectionLinks.length})
                </Typography>
                {sectionLinks.map((link: any) => (
                  <Card key={link._id} sx={{ mb: 1 }}>
                    <CardContent sx={{ py: 1.5 }}>
                      {editingFooterLink?._id === link._id ? (
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={12} md={3}>
                            <TextField fullWidth size="small" label="Label"
                              value={editingFooterLink.label}
                              onChange={(e) => setEditingFooterLink({ ...editingFooterLink, label: e.target.value })}
                            />
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <TextField fullWidth size="small" label="URL"
                              value={editingFooterLink.href}
                              onChange={(e) => setEditingFooterLink({ ...editingFooterLink, href: e.target.value })}
                            />
                          </Grid>
                          <Grid item xs={6} md={2}>
                            <FormControl fullWidth size="small">
                              <InputLabel>Section</InputLabel>
                              <Select label="Section" value={editingFooterLink.section}
                                onChange={(e) => setEditingFooterLink({ ...editingFooterLink, section: e.target.value })}>
                                <MenuItem value="main">Main Links</MenuItem>
                                <MenuItem value="myRmn">My RMN</MenuItem>
                                <MenuItem value="bottom">Bottom Links</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item xs={6} md={1}>
                            <TextField fullWidth size="small" label="Order" type="number"
                              value={editingFooterLink.order}
                              onChange={(e) => setEditingFooterLink({ ...editingFooterLink, order: parseInt(e.target.value) || 0 })}
                            />
                          </Grid>
                          <Grid item xs={6} md={1}>
                            <Button variant="contained" size="small" fullWidth onClick={handleUpdateFooterLink}>Save</Button>
                          </Grid>
                          <Grid item xs={6} md={2}>
                            <Button variant="outlined" size="small" fullWidth onClick={() => setEditingFooterLink(null)}>Cancel</Button>
                          </Grid>
                        </Grid>
                      ) : (
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={3}>
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>{link.label}</Typography>
                          </Grid>
                          <Grid item xs={3}>
                            <Typography variant="body2" color="text.secondary">{link.href}</Typography>
                          </Grid>
                          <Grid item xs={2}>
                            <Typography variant="body2" color="text.secondary">Order: {link.order}</Typography>
                          </Grid>
                          <Grid item xs={2}>
                            <Typography variant="body2" color={link.isActive ? 'success.main' : 'error.main'}>
                              {link.isActive ? '✅ Active' : '❌ Inactive'}
                            </Typography>
                          </Grid>
                          <Grid item xs={2} sx={{ display: 'flex', gap: 1 }}>
                            <Button size="small" variant="outlined" onClick={() => setEditingFooterLink({ ...link })}>Edit</Button>
                            <Button size="small" color="error" onClick={() => handleDeleteFooterLink(link._id)}>Delete</Button>
                          </Grid>
                        </Grid>
                      )}
                    </CardContent>
                  </Card>
                ))}
                {sectionLinks.length === 0 && (
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', ml: 2 }}>
                    No links in this section
                  </Typography>
                )}
              </Box>
            );
          })}
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Global FAQ Section</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            These FAQs appear on all store pages. Add questions and answers that apply site-wide.
          </Typography>

          <TextField fullWidth label="Section Heading" value={faqHeading}
            onChange={e => setFaqHeading(e.target.value)}
            size="small" sx={{ mb: 3 }} placeholder="Frequently Asked Questions" />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 480, overflowY: 'auto', paddingRight: 4 }}>
            {faqItems.map((item, i) => (
              <Card key={i} variant="outlined" sx={{ p: 2, background: '#f9fafb' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', color: '#6b7280' }}>FAQ {i + 1}</Typography>
                  <Button size="small" color="error" onClick={() => setFaqItems(f => f.filter((_, idx) => idx !== i))} sx={{ minWidth: 0 }}>Remove</Button>
                </div>
                <TextField fullWidth label="Question" value={item.question} size="small"
                  onChange={e => setFaqItems(f => { const n = [...f]; n[i] = { ...n[i], question: e.target.value }; return n; })}
                  sx={{ mb: 1 }} />
                <TextField fullWidth label="Answer" value={item.answer} size="small" multiline rows={2}
                  onChange={e => setFaqItems(f => { const n = [...f]; n[i] = { ...n[i], answer: e.target.value }; return n; })} />
              </Card>
            ))}
            {faqItems.length === 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>No FAQs yet — click "+ Add FAQ" below</Typography>
            )}
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            <Button variant="outlined" onClick={() => setFaqItems(f => [...f, { question: '', answer: '' }])}>+ Add FAQ</Button>
            <Button variant="contained" onClick={async () => {
              try {
                await updateSiteConfig({ faqs: { heading: faqHeading, items: faqItems } });
                toast.success('FAQs saved!');
              } catch { toast.error('Failed to save FAQs'); }
            }}>Save FAQs</Button>
          </div>
        </AccordionDetails>
      </Accordion>
    </Box>
    </AdminShell>
  );
}