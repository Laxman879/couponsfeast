// Utility functions for updating favicon dynamically

export const updateFavicon = (faviconUrl: string) => {
  try {
    // Remove existing favicon links
    const existingFavicons = document.querySelectorAll('link[rel*="icon"]');
    existingFavicons.forEach(favicon => favicon.remove());

    // Create new favicon link
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/x-icon';
    link.href = faviconUrl.startsWith('/uploads/') 
      ? `http://localhost:5000${faviconUrl}` 
      : faviconUrl;
    
    // Add to document head
    document.head.appendChild(link);
    
    // Also update shortcut icon for better compatibility
    const shortcutLink = document.createElement('link');
    shortcutLink.rel = 'shortcut icon';
    shortcutLink.type = 'image/x-icon';
    shortcutLink.href = link.href;
    document.head.appendChild(shortcutLink);
    
    // Force browser to refresh favicon
    const timestamp = new Date().getTime();
    link.href = `${link.href}?v=${timestamp}`;
    shortcutLink.href = `${shortcutLink.href}?v=${timestamp}`;
    
    console.log('Favicon updated successfully:', link.href);
    return true;
  } catch (error) {
    console.error('Error updating favicon:', error);
    return false;
  }
};

export const updatePageTitle = (title: string) => {
  try {
    document.title = title;
    return true;
  } catch (error) {
    console.error('Error updating page title:', error);
    return false;
  }
};

export const updateMetaTags = (config: {
  title?: string;
  description?: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterSite?: string;
}) => {
  try {
    // Update title
    if (config.title) {
      document.title = config.title;
    }

    // Update meta description
    if (config.description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', config.description);
    }

    // Update meta keywords
    if (config.keywords && config.keywords.length > 0) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', config.keywords.join(', '));
    }

    // Update Open Graph tags
    if (config.ogTitle) {
      let ogTitle = document.querySelector('meta[property="og:title"]');
      if (!ogTitle) {
        ogTitle = document.createElement('meta');
        ogTitle.setAttribute('property', 'og:title');
        document.head.appendChild(ogTitle);
      }
      ogTitle.setAttribute('content', config.ogTitle);
    }

    if (config.ogDescription) {
      let ogDescription = document.querySelector('meta[property="og:description"]');
      if (!ogDescription) {
        ogDescription = document.createElement('meta');
        ogDescription.setAttribute('property', 'og:description');
        document.head.appendChild(ogDescription);
      }
      ogDescription.setAttribute('content', config.ogDescription);
    }

    if (config.ogImage) {
      let ogImage = document.querySelector('meta[property="og:image"]');
      if (!ogImage) {
        ogImage = document.createElement('meta');
        ogImage.setAttribute('property', 'og:image');
        document.head.appendChild(ogImage);
      }
      const imageUrl = config.ogImage.startsWith('/uploads/') 
        ? `http://localhost:5000${config.ogImage}` 
        : config.ogImage;
      ogImage.setAttribute('content', imageUrl);
    }

    // Update Twitter tags
    if (config.twitterSite) {
      let twitterSite = document.querySelector('meta[name="twitter:site"]');
      if (!twitterSite) {
        twitterSite = document.createElement('meta');
        twitterSite.setAttribute('name', 'twitter:site');
        document.head.appendChild(twitterSite);
      }
      twitterSite.setAttribute('content', config.twitterSite);
    }

    console.log('Meta tags updated successfully');
    return true;
  } catch (error) {
    console.error('Error updating meta tags:', error);
    return false;
  }
};