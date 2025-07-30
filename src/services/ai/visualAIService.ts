
import { productionLogger } from '@/utils/productionLogger';
import { supabase } from '@/integrations/supabase/client';

export interface VisualAnalysisResult {
  description: string;
  detectedElements: string[];
  suggestedSQL?: string;
  confidence: number;
  recommendations: string[];
}

export interface DiagramGenerationOptions {
  type: 'erd' | 'flowchart' | 'schema' | 'relationship';
  tables: string[];
  relationships?: any[];
  style?: 'simple' | 'detailed' | 'modern';
}

export interface ScreenshotAnalysisOptions {
  imageData: string; // base64 encoded image
  analysisType: 'table' | 'query' | 'diagram' | 'general';
  context?: string;
}

class VisualAIService {
  private apiKey: string | null = null;

  async initialize(): Promise<boolean> {
    try {
      // No longer store API keys client-side - use edge function instead
      return true;
    } catch (error) {
      productionLogger.error('Visual AI service initialization failed', error, 'VisualAIService');
      return false;
    }
  }

  async analyzeScreenshot(options: ScreenshotAnalysisOptions): Promise<VisualAnalysisResult> {
    try {
      // Use secure edge function instead of direct API call
      const { data, error } = await supabase.functions.invoke('secure-ai-visual', {
        body: {
          image: options.imageData,
          prompt: `Analyze this ${options.analysisType} image and provide detailed insights. ${options.context || ''}`,
          analysisType: options.analysisType
        }
      });

      if (error) {
        throw new Error(`Visual analysis request failed: ${error.message}`);
      }

      const analysis = data.choices[0].message.content;
      return this.parseVisualAnalysis(analysis, options.analysisType);

    } catch (error) {
      productionLogger.error('Screenshot analysis failed', error, 'VisualAIService');
      throw new Error('Failed to analyze screenshot');
    }
  }

  private getSystemPromptForAnalysis(type: string): string {
    const basePrompt = 'You are an expert database analyst specializing in visual analysis of database-related content.';
    
    switch (type) {
      case 'table':
        return `${basePrompt} Analyze database tables in images and extract:
        1. Table structure (columns, data types)
        2. Sample data patterns
        3. Relationships between columns
        4. Suggested SQL queries for the data
        5. Optimization recommendations
        
        Format your response as JSON with: description, detectedElements, suggestedSQL, confidence, recommendations`;
        
      case 'query':
        return `${basePrompt} Analyze SQL queries in images and provide:
        1. Query explanation and purpose
        2. Performance analysis
        3. Optimization suggestions
        4. Alternative query approaches
        5. Best practices recommendations
        
        Format your response as JSON with: description, detectedElements, suggestedSQL, confidence, recommendations`;
        
      case 'diagram':
        return `${basePrompt} Analyze database diagrams and extract:
        1. Entity relationships
        2. Table structures
        3. Foreign key relationships
        4. Suggested improvements
        5. SQL creation scripts
        
        Format your response as JSON with: description, detectedElements, suggestedSQL, confidence, recommendations`;
        
      default:
        return `${basePrompt} Analyze this database-related image and provide comprehensive insights about what you see, including any SQL-related recommendations.`;
    }
  }

  private parseVisualAnalysis(analysis: string, type: string): VisualAnalysisResult {
    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(analysis);
      return {
        description: parsed.description || analysis,
        detectedElements: parsed.detectedElements || [],
        suggestedSQL: parsed.suggestedSQL,
        confidence: parsed.confidence || 0.8,
        recommendations: parsed.recommendations || []
      };
    } catch {
      // Fallback to text parsing
      return {
        description: analysis,
        detectedElements: this.extractElementsFromText(analysis),
        suggestedSQL: this.extractSQLFromText(analysis),
        confidence: 0.7,
        recommendations: this.extractRecommendationsFromText(analysis)
      };
    }
  }

  private extractElementsFromText(text: string): string[] {
    const elements = [];
    const lines = text.split('\n');
    
    lines.forEach(line => {
      if (line.includes('table') || line.includes('column') || line.includes('field')) {
        elements.push(line.trim());
      }
    });
    
    return elements;
  }

  private extractSQLFromText(text: string): string | undefined {
    const sqlMatch = text.match(/```sql\n([\s\S]*?)\n```/);
    if (sqlMatch) {
      return sqlMatch[1].trim();
    }
    
    // Look for SQL keywords
    if (text.includes('SELECT') || text.includes('CREATE') || text.includes('INSERT')) {
      const lines = text.split('\n');
      for (const line of lines) {
        if (line.includes('SELECT') || line.includes('CREATE') || line.includes('INSERT')) {
          return line.trim();
        }
      }
    }
    
    return undefined;
  }

  private extractRecommendationsFromText(text: string): string[] {
    const recommendations = [];
    const lines = text.split('\n');
    
    lines.forEach(line => {
      if (line.includes('recommend') || line.includes('suggest') || line.includes('consider')) {
        recommendations.push(line.trim());
      }
    });
    
    return recommendations;
  }

  async generateDatabaseDiagram(options: DiagramGenerationOptions): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Visual AI service not initialized');
    }

    try {
      // For now, we'll generate a text-based diagram description
      // In a full implementation, this would integrate with diagram generation tools
      const diagramDescription = this.createDiagramDescription(options);
      
      // Generate SVG or return description for now
      return this.generateSVGDiagram(diagramDescription, options);
      
    } catch (error) {
      productionLogger.error('Diagram generation failed', error, 'VisualAIService');
      throw new Error('Failed to generate database diagram');
    }
  }

  private createDiagramDescription(options: DiagramGenerationOptions): string {
    let description = `Database ${options.type.toUpperCase()} diagram with tables: ${options.tables.join(', ')}`;
    
    if (options.relationships && options.relationships.length > 0) {
      description += `\nRelationships: ${options.relationships.map(r => `${r.from} -> ${r.to}`).join(', ')}`;
    }
    
    description += `\nStyle: ${options.style || 'simple'}`;
    
    return description;
  }

  private generateSVGDiagram(description: string, options: DiagramGenerationOptions): string {
    // Simple SVG generation based on the options
    const tables = options.tables;
    const tableWidth = 200;
    const tableHeight = 150;
    const spacing = 50;
    
    let svg = `<svg width="${(tableWidth + spacing) * Math.ceil(Math.sqrt(tables.length))}" height="${(tableHeight + spacing) * Math.ceil(tables.length / Math.ceil(Math.sqrt(tables.length)))}" xmlns="http://www.w3.org/2000/svg">`;
    
    tables.forEach((table, index) => {
      const row = Math.floor(index / Math.ceil(Math.sqrt(tables.length)));
      const col = index % Math.ceil(Math.sqrt(tables.length));
      const x = col * (tableWidth + spacing) + 20;
      const y = row * (tableHeight + spacing) + 20;
      
      svg += `
        <rect x="${x}" y="${y}" width="${tableWidth}" height="${tableHeight}" 
              fill="#f8f9fa" stroke="#dee2e6" stroke-width="2" rx="8"/>
        <text x="${x + tableWidth/2}" y="${y + 30}" text-anchor="middle" 
              font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#333">
          ${table}
        </text>
        <line x1="${x}" y1="${y + 40}" x2="${x + tableWidth}" y2="${y + 40}" stroke="#dee2e6" stroke-width="1"/>
        <text x="${x + 10}" y="${y + 65}" font-family="Arial, sans-serif" font-size="12" fill="#666">
          id (PRIMARY KEY)
        </text>
        <text x="${x + 10}" y="${y + 85}" font-family="Arial, sans-serif" font-size="12" fill="#666">
          created_at
        </text>
        <text x="${x + 10}" y="${y + 105}" font-family="Arial, sans-serif" font-size="12" fill="#666">
          updated_at
        </text>
      `;
    });
    
    // Add relationships if provided
    if (options.relationships) {
      options.relationships.forEach(rel => {
        // Simple line connections between tables
        const fromIndex = tables.indexOf(rel.from);
        const toIndex = tables.indexOf(rel.to);
        
        if (fromIndex !== -1 && toIndex !== -1) {
          const fromRow = Math.floor(fromIndex / Math.ceil(Math.sqrt(tables.length)));
          const fromCol = fromIndex % Math.ceil(Math.sqrt(tables.length));
          const toRow = Math.floor(toIndex / Math.ceil(Math.sqrt(tables.length)));
          const toCol = toIndex % Math.ceil(Math.sqrt(tables.length));
          
          const fromX = fromCol * (tableWidth + spacing) + 20 + tableWidth;
          const fromY = fromRow * (tableHeight + spacing) + 20 + tableHeight/2;
          const toX = toCol * (tableWidth + spacing) + 20;
          const toY = toRow * (tableHeight + spacing) + 20 + tableHeight/2;
          
          svg += `<line x1="${fromX}" y1="${fromY}" x2="${toX}" y2="${toY}" 
                       stroke="#007bff" stroke-width="2" marker-end="url(#arrowhead)"/>`;
        }
      });
    }
    
    svg += `
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#007bff"/>
        </marker>
      </defs>
    </svg>`;
    
    return svg;
  }

  async captureScreenshot(): Promise<string> {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true
      });
      
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      
      return new Promise((resolve, reject) => {
        video.onloadedmetadata = () => {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }
          
          ctx.drawImage(video, 0, 0);
          
          // Stop the stream
          stream.getTracks().forEach(track => track.stop());
          
          // Convert to base64
          resolve(canvas.toDataURL());
        };
        
        video.onerror = () => {
          stream.getTracks().forEach(track => track.stop());
          reject(new Error('Failed to capture screenshot'));
        };
      });
    } catch (error) {
      productionLogger.error('Screenshot capture failed', error, 'VisualAIService');
      throw new Error('Failed to capture screenshot');
    }
  }

  // API key management removed for security - now handled server-side
}

export const visualAIService = new VisualAIService();
