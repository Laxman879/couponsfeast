import { SiteConfig } from "../models/SiteConfig.js";
import { Navigation } from "../models/Navigation.js";
import { Banner } from "../models/Banner.js";
import { Page } from "../models/Page.js";
import { NavbarItem } from "../models/NavbarItem.js";

// Site Config
export const getSiteConfig = async (req, res) => {
  try {
    let config = await SiteConfig.findOne();
    if (!config) {
      config = await SiteConfig.create({});
    }
    console.log('Getting site config:', JSON.stringify(config, null, 2));
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateSiteConfig = async (req, res) => {
  try {
    console.log('=== SITE CONFIG UPDATE ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    let config = await SiteConfig.findOne();
    if (!config) {
      config = await SiteConfig.create(req.body);
    } else {
      config = await SiteConfig.findOneAndUpdate({}, req.body, { new: true });
    }
    
    console.log('Updated config:', JSON.stringify(config, null, 2));
    console.log('========================');
    
    res.json(config);
  } catch (error) {
    console.error('Site config update error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Navigation
export const getNavigation = async (req, res) => {
  try {
    let nav = await Navigation.findOne();
    if (!nav) {
      nav = await Navigation.create({
        menu: [
          { name: "Home", url: "/" },
          { name: "Stores", url: "/stores" },
          { name: "Categories", url: "/categories" },
          { name: "Trending", url: "/trending" }
        ]
      });
    }
    // Fix /home -> / in existing DB data
    nav.menu = nav.menu.map(item => ({
      ...item.toObject ? item.toObject() : item,
      url: item.url === '/home' ? '/' : item.url
    }));
    res.json(nav);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateNavigation = async (req, res) => {
  try {
    let nav = await Navigation.findOne();
    if (!nav) {
      nav = await Navigation.create(req.body);
    } else {
      nav = await Navigation.findOneAndUpdate({}, req.body, { new: true });
    }
    res.json(nav);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Banners
export const getBanners = async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc', search } = req.query;
    
    let query = { isActive: true };
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    
    const sortOrder = order === 'desc' ? -1 : 1;
    const sortObj = { [sortBy]: sortOrder };
    
    const banners = await Banner.find(query)
      .populate('store', 'storeName slug logo websiteUrl')
      .sort(sortObj)
      .limit(limit * 1)
      .skip((page - 1) * limit);
      
    const total = await Banner.countDocuments(query);
    
    res.json({
      success: true,
      data: banners,
      total,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

export const createBanner = async (req, res) => {
  try {
    const bannerData = {
      ...req.body,
      isActive: req.body.isActive !== undefined ? req.body.isActive : true
    };
    
    const banner = await Banner.create(bannerData);
    res.status(201).json({
      success: true,
      data: banner
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        success: false,
        error: error.message 
      });
    }
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

export const updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!banner) return res.status(404).json({ success: false, error: 'Banner not found' });
    res.json({ success: true, data: banner });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) return res.status(404).json({ success: false, error: 'Banner not found' });
    res.json({ success: true, message: 'Banner deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Pages
export const getPage = async (req, res) => {
  try {
    const { pageName } = req.params;
    const page = await Page.findOne({ page: pageName });
    
    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }
    
    res.json(page);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updatePage = async (req, res) => {
  try {
    const { pageName } = req.params;
    let page = await Page.findOne({ page: pageName });
    
    if (!page) {
      page = await Page.create({ page: pageName, ...req.body });
    } else {
      page = await Page.findOneAndUpdate({ page: pageName }, req.body, { new: true });
    }
    
    res.json(page);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllPages = async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc', search, type, published } = req.query;
    
    let query = {};
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    if (type) {
      query.type = type;
    }
    if (published !== undefined) {
      query.isPublished = published === 'true';
    }
    
    const sortOrder = order === 'desc' ? -1 : 1;
    const sortObj = { [sortBy]: sortOrder };
    
    const pages = await Page.find(query)
      .sort(sortObj)
      .limit(limit * 1)
      .skip((page - 1) * limit);
      
    const total = await Page.countDocuments(query);
    
    res.json({
      success: true,
      data: pages,
      total,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

export const createPage = async (req, res) => {
  try {
    const pageData = {
      ...req.body,
      sections: req.body.sections || []
    };
    
    const page = await Page.create(pageData);
    res.status(201).json({
      success: true,
      data: page
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(409).json({ 
        success: false,
        error: 'Page with this slug already exists' 
      });
    } else if (error.name === 'ValidationError') {
      res.status(400).json({ 
        success: false,
        error: error.message 
      });
    } else {
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  }
};

export const updatePageById = async (req, res) => {
  try {
    const page = await Page.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { 
        new: true,
        runValidators: true
      }
    );
    
    if (!page) {
      return res.status(404).json({ 
        success: false,
        error: 'Page not found' 
      });
    }
    
    res.json({
      success: true,
      data: page
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        success: false,
        error: error.message 
      });
    }
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

export const deletePage = async (req, res) => {
  try {
    const { id } = req.params;
    const page = await Page.findByIdAndDelete(id);
    
    if (!page) {
      return res.status(404).json({ 
        success: false,
        error: 'Page not found' 
      });
    }
    
    res.json({ 
      success: true,
      message: 'Page deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

// Navbar Items
export const getNavbarItems = async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = 'order', order = 'asc', search, active } = req.query;
    
    let query = {};
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    if (active !== undefined) {
      query.isActive = active === 'true';
    }
    
    const sortOrder = order === 'desc' ? -1 : 1;
    const sortObj = { [sortBy]: sortOrder };
    
    const items = await NavbarItem.find(query)
      .sort(sortObj)
      .limit(limit * 1)
      .skip((page - 1) * limit);
      
    const total = await NavbarItem.countDocuments(query);
    
    res.json({
      success: true,
      data: items,
      total,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

export const createNavbarItem = async (req, res) => {
  try {
    const itemData = {
      ...req.body,
      isActive: req.body.isActive !== undefined ? req.body.isActive : true
    };
    
    // Auto-increment order if not provided
    if (!itemData.order) {
      const maxOrder = await NavbarItem.findOne().sort({ order: -1 });
      itemData.order = maxOrder ? maxOrder.order + 1 : 1;
    }
    
    const item = await NavbarItem.create(itemData);
    res.status(201).json({
      success: true,
      data: item
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        success: false,
        error: error.message 
      });
    }
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

export const updateNavbarItem = async (req, res) => {
  try {
    const item = await NavbarItem.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { 
        new: true,
        runValidators: true
      }
    );
    
    if (!item) {
      return res.status(404).json({ 
        success: false,
        error: 'Navbar item not found' 
      });
    }
    
    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        success: false,
        error: error.message 
      });
    }
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

export const deleteNavbarItem = async (req, res) => {
  try {
    const item = await NavbarItem.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ 
        success: false,
        error: 'Navbar item not found' 
      });
    }
    
    res.json({ 
      success: true,
      message: 'Navbar item deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};