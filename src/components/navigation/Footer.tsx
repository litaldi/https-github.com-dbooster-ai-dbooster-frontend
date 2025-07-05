
import { EnhancedFooter } from '@/components/ui/enhanced-footer';

export function Footer() {
  const footerSections = [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '/features' },
        { label: 'AI Studio', href: '/ai-studio' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'Security', href: '/security' },
        { label: 'Integrations', href: '/integrations' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Documentation', href: '/docs', external: true },
        { label: 'Help Center', href: '/support' },
        { label: 'Blog', href: '/blog' },
        { label: 'Community', href: '/community', external: true },
        { label: 'Status', href: '/status', external: true },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Careers', href: '/careers' },
        { label: 'Contact', href: '/contact' },
        { label: 'Partners', href: '/partners' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Cookie Policy', href: '/cookies' },
        { label: 'Accessibility', href: '/accessibility' },
      ],
    },
  ];

  return <EnhancedFooter sections={footerSections} />;
}
