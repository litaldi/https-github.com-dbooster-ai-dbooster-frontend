
export function AccessibilitySkipLinks() {
  return (
    <div className="sr-only focus-within:not-sr-only">
      <a
        href="#main-content"
        className="absolute left-0 top-0 z-50 bg-primary text-primary-foreground px-4 py-2 transform -translate-y-full focus:translate-y-0 transition-transform"
      >
        Skip to main content
      </a>
      <a
        href="#main-navigation"
        className="absolute left-0 top-10 z-50 bg-primary text-primary-foreground px-4 py-2 transform -translate-y-full focus:translate-y-0 transition-transform"
      >
        Skip to navigation
      </a>
    </div>
  );
}
