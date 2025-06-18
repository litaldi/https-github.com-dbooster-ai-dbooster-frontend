
// Utility to detect and report duplicate content/components
export class DuplicateDetector {
  static detectDuplicateIds(): string[] {
    const ids = new Set<string>();
    const duplicates: string[] = [];
    
    document.querySelectorAll('[id]').forEach((element) => {
      const id = element.id;
      if (ids.has(id)) {
        duplicates.push(id);
      } else {
        ids.add(id);
      }
    });
    
    if (duplicates.length > 0) {
      console.warn('🚨 Duplicate IDs found:', duplicates);
    }
    
    return duplicates;
  }

  static detectDuplicateContent(): Array<{text: string, count: number}> {
    const textContent = new Map<string, number>();
    const duplicates: Array<{text: string, count: number}> = [];
    
    document.querySelectorAll('h1, h2, h3, p, button, a').forEach((element) => {
      const text = element.textContent?.trim();
      if (text && text.length > 10) {
        const count = textContent.get(text) || 0;
        textContent.set(text, count + 1);
      }
    });
    
    textContent.forEach((count, text) => {
      if (count > 1) {
        duplicates.push({ text, count });
      }
    });
    
    if (duplicates.length > 0) {
      console.warn('🚨 Duplicate content found:', duplicates);
    }
    
    return duplicates;
  }

  static detectDuplicateStyles(): Array<{rule: string, count: number}> {
    const styleRules = new Map<string, number>();
    const duplicates: Array<{rule: string, count: number}> = [];
    
    Array.from(document.styleSheets).forEach((stylesheet) => {
      try {
        Array.from(stylesheet.cssRules || []).forEach((rule) => {
          const ruleText = rule.cssText;
          if (ruleText) {
            const count = styleRules.get(ruleText) || 0;
            styleRules.set(ruleText, count + 1);
          }
        });
      } catch (e) {
        // Skip cross-origin stylesheets
      }
    });
    
    styleRules.forEach((count, rule) => {
      if (count > 1) {
        duplicates.push({ rule: rule.substring(0, 100) + '...', count });
      }
    });
    
    if (duplicates.length > 0) {
      console.warn('🚨 Duplicate CSS rules found:', duplicates.slice(0, 5));
    }
    
    return duplicates;
  }

  static runFullDuplicateAudit() {
    console.log('🔍 Running Duplicate Content Audit...');
    
    const results = {
      duplicateIds: this.detectDuplicateIds(),
      duplicateContent: this.detectDuplicateContent(),
      duplicateStyles: this.detectDuplicateStyles(),
      timestamp: new Date().toISOString()
    };
    
    const totalIssues = results.duplicateIds.length + 
                       results.duplicateContent.length + 
                       results.duplicateStyles.length;
    
    console.log(`🧹 Duplicate Audit Complete: ${totalIssues} issues found`);
    return results;
  }
}
