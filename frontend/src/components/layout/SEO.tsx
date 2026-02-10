import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
}

/**
 * SEO helper hook for updating page meta tags dynamically
 * @param title - Page title (will be appended with site name)
 * @param description - Page description for meta tag
 * @param keywords - Comma-separated keywords
 * @param canonical - Canonical URL for the page
 */
export const useSEO = ({ title, description, keywords, canonical }: SEOProps = {}) => {
  useEffect(() => {
    const siteName = 'IGCSE Pseudocode Compiler';
    const baseTitle = 'IGCSE Pseudocode Compiler - Online Interpreter for Cambridge Computer Science';

    // Update title
    if (title) {
      document.title = `${title} | ${siteName}`;
    } else {
      document.title = baseTitle;
    }

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string) => {
      let element = document.querySelector(`meta[name="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('name', name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    const updateOGTag = (property: string, content: string) => {
      let element = document.querySelector(`meta[property="${property}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('property', property);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Update description
    if (description) {
      updateMetaTag('description', description);
      updateOGTag('og:description', description);
      updateMetaTag('twitter:description', description);
    }

    // Update keywords
    if (keywords) {
      updateMetaTag('keywords', keywords);
    }

    // Update canonical URL
    if (canonical) {
      let linkElement = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!linkElement) {
        linkElement = document.createElement('link');
        linkElement.setAttribute('rel', 'canonical');
        document.head.appendChild(linkElement);
      }
      linkElement.href = canonical;
    }

    // Update Open Graph title
    if (title) {
      updateOGTag('og:title', `${title} | ${siteName}`);
      updateMetaTag('twitter:title', `${title} | ${siteName}`);
    }

    // Update Open Graph URL
    if (canonical) {
      updateOGTag('og:url', canonical);
    }
  }, [title, description, keywords, canonical]);
};

/**
 * SEO Component for declarative usage
 */
export const SEO: React.FC<SEOProps> = (props) => {
  useSEO(props);
  return null;
};

export default SEO;
