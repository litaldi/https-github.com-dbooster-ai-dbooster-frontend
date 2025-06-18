
// Accessibility testing utilities
export class AccessibilityTester {
  static checkKeyboardNavigation(): boolean {
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    let passedTests = 0;
    const totalTests = focusableElements.length;
    
    focusableElements.forEach((element) => {
      const computedStyle = window.getComputedStyle(element as Element);
      
      // Check if element is visible and focusable
      if (
        computedStyle.display !== 'none' &&
        computedStyle.visibility !== 'hidden' &&
        (element as HTMLElement).tabIndex >= 0
      ) {
        passedTests++;
      }
    });
    
    const score = (passedTests / totalTests) * 100;
    console.log(`Keyboard Navigation Score: ${score.toFixed(1)}%`);
    return score > 90;
  }

  static checkAriaLabels(): boolean {
    const interactiveElements = document.querySelectorAll(
      'button, input, select, textarea, [role="button"], [role="link"]'
    );
    
    let elementsWithLabels = 0;
    
    interactiveElements.forEach((element) => {
      const hasAriaLabel = element.hasAttribute('aria-label');
      const hasAriaLabelledBy = element.hasAttribute('aria-labelledby');
      const hasAssociatedLabel = element.hasAttribute('id') && 
        document.querySelector(`label[for="${element.id}"]`);
      
      if (hasAriaLabel || hasAriaLabelledBy || hasAssociatedLabel) {
        elementsWithLabels++;
      }
    });
    
    const score = (elementsWithLabels / interactiveElements.length) * 100;
    console.log(`ARIA Labels Score: ${score.toFixed(1)}%`);
    return score > 85;
  }

  static checkColorContrast(): Promise<boolean> {
    return new Promise((resolve) => {
      // Simplified color contrast check
      const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div, button');
      let passedElements = 0;
      
      textElements.forEach((element) => {
        const computedStyle = window.getComputedStyle(element);
        const color = computedStyle.color;
        const backgroundColor = computedStyle.backgroundColor;
        
        // Basic contrast check (simplified)
        if (color && backgroundColor && color !== backgroundColor) {
          passedElements++;
        }
      });
      
      const score = (passedElements / textElements.length) * 100;
      console.log(`Color Contrast Score: ${score.toFixed(1)}%`);
      resolve(score > 80);
    });
  }

  static async runFullAccessibilityAudit() {
    console.log('🔍 Running Accessibility Audit...');
    
    const results = {
      keyboardNavigation: this.checkKeyboardNavigation(),
      ariaLabels: this.checkAriaLabels(),
      colorContrast: await this.checkColorContrast(),
      timestamp: new Date().toISOString()
    };
    
    const overallScore = Object.values(results)
      .filter(result => typeof result === 'boolean')
      .reduce((acc, curr) => acc + (curr ? 1 : 0), 0) / 3 * 100;
    
    console.log('♿ Accessibility Audit Results:', {
      ...results,
      overallScore: `${overallScore.toFixed(1)}%`
    });
    
    return results;
  }
}
