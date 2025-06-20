
export class AccessibilityChecker {
  private static instance: AccessibilityChecker;

  static getInstance(): AccessibilityChecker {
    if (!AccessibilityChecker.instance) {
      AccessibilityChecker.instance = new AccessibilityChecker();
    }
    return AccessibilityChecker.instance;
  }

  runAccessibilityAudit(): Promise<AccessibilityReport> {
    return new Promise((resolve) => {
      const report: AccessibilityReport = {
        score: 0,
        issues: [],
        recommendations: [],
        timestamp: new Date().toISOString()
      };

      // Check color contrast
      this.checkColorContrast(report);
      
      // Check keyboard navigation
      this.checkKeyboardNavigation(report);
      
      // Check ARIA labels
      this.checkAriaLabels(report);
      
      // Check form accessibility
      this.checkFormAccessibility(report);
      
      // Check image alt texts
      this.checkImageAltTexts(report);
      
      // Check heading structure
      this.checkHeadingStructure(report);

      // Calculate overall score
      report.score = Math.max(0, 100 - (report.issues.length * 10));

      resolve(report);
    });
  }

  private checkColorContrast(report: AccessibilityReport) {
    const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, button, a, label');
    let contrastIssues = 0;

    textElements.forEach((element) => {
      const styles = window.getComputedStyle(element);
      const color = styles.color;
      const backgroundColor = styles.backgroundColor;
      
      // Simple contrast check (in production, use a proper contrast ratio calculator)
      if (this.isLowContrast(color, backgroundColor)) {
        contrastIssues++;
      }
    });

    if (contrastIssues > 0) {
      report.issues.push(`Found ${contrastIssues} potential color contrast issues`);
      report.recommendations.push('Review color combinations for better contrast');
    }
  }

  private checkKeyboardNavigation(report: AccessibilityReport) {
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    let keyboardIssues = 0;
    focusableElements.forEach((element) => {
      const tabIndex = (element as HTMLElement).tabIndex;
      if (tabIndex > 0) {
        keyboardIssues++;
      }
    });

    if (keyboardIssues > 0) {
      report.issues.push(`Found ${keyboardIssues} elements with problematic tab indices`);
      report.recommendations.push('Avoid positive tab indices, use semantic HTML instead');
    }
  }

  private checkAriaLabels(report: AccessibilityReport) {
    const interactiveElements = document.querySelectorAll(
      'button, input, select, textarea, [role="button"], [role="link"]'
    );
    
    let missingLabels = 0;
    interactiveElements.forEach((element) => {
      const hasAriaLabel = element.hasAttribute('aria-label');
      const hasAriaLabelledBy = element.hasAttribute('aria-labelledby');
      const hasAssociatedLabel = element.hasAttribute('id') && 
        document.querySelector(`label[for="${element.id}"]`);
      
      if (!hasAriaLabel && !hasAriaLabelledBy && !hasAssociatedLabel) {
        missingLabels++;
      }
    });

    if (missingLabels > 0) {
      report.issues.push(`Found ${missingLabels} interactive elements without proper labels`);
      report.recommendations.push('Add aria-label or associate with label elements');
    }
  }

  private checkFormAccessibility(report: AccessibilityReport) {
    const forms = document.querySelectorAll('form');
    let formIssues = 0;

    forms.forEach((form) => {
      const inputs = form.querySelectorAll('input, select, textarea');
      inputs.forEach((input) => {
        const hasLabel = input.hasAttribute('aria-label') || 
          input.hasAttribute('aria-labelledby') ||
          form.querySelector(`label[for="${input.id}"]`);
        
        if (!hasLabel) {
          formIssues++;
        }
      });
    });

    if (formIssues > 0) {
      report.issues.push(`Found ${formIssues} form inputs without proper labels`);
      report.recommendations.push('Ensure all form inputs have associated labels');
    }
  }

  private checkImageAltTexts(report: AccessibilityReport) {
    const images = document.querySelectorAll('img');
    let missingAltTexts = 0;

    images.forEach((img) => {
      if (!img.hasAttribute('alt')) {
        missingAltTexts++;
      }
    });

    if (missingAltTexts > 0) {
      report.issues.push(`Found ${missingAltTexts} images without alt text`);
      report.recommendations.push('Add descriptive alt text to all images');
    }
  }

  private checkHeadingStructure(report: AccessibilityReport) {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const headingLevels: number[] = [];
    
    headings.forEach((heading) => {
      const level = parseInt(heading.tagName.substring(1));
      headingLevels.push(level);
    });

    // Check for proper heading hierarchy
    let hierarchyIssues = 0;
    for (let i = 1; i < headingLevels.length; i++) {
      if (headingLevels[i] - headingLevels[i-1] > 1) {
        hierarchyIssues++;
      }
    }

    if (hierarchyIssues > 0) {
      report.issues.push(`Found ${hierarchyIssues} heading hierarchy issues`);
      report.recommendations.push('Maintain proper heading hierarchy (don\'t skip levels)');
    }
  }

  private isLowContrast(color: string, backgroundColor: string): boolean {
    // Simplified contrast check - in production use proper WCAG contrast calculations
    return color === backgroundColor || 
           (color.includes('rgb(128') && backgroundColor.includes('rgb(128'));
  }
}

interface AccessibilityReport {
  score: number;
  issues: string[];
  recommendations: string[];
  timestamp: string;
}

export const accessibilityChecker = AccessibilityChecker.getInstance();
