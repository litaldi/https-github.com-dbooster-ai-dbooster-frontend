
import { useEffect } from 'react';

export function AccessibilityEnhancements() {
  useEffect(() => {
    // Announce route changes to screen readers
    const announceRouteChange = (message: string) => {
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      announcement.textContent = message;
      document.body.appendChild(announcement);
      
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    };

    // Listen for route changes
    const handleRouteChange = () => {
      const title = document.title;
      announceRouteChange(`Navigated to ${title}`);
    };

    // Monitor for title changes (which happen on route changes)
    const observer = new MutationObserver(handleRouteChange);
    observer.observe(document.querySelector('title') || document.head, {
      childList: true,
      characterData: true,
      subtree: true
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
