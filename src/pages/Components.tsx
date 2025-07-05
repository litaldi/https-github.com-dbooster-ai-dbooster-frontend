
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Palette, 
  Search, 
  Code, 
  Eye, 
  ExternalLink,
  Blocks,
  Layers,
  Settings
} from 'lucide-react';
import { FadeIn, ScaleIn } from '@/components/ui/animations';

const componentCategories = [
  {
    name: 'Form Components',
    count: 12,
    components: [
      { name: 'Input', description: 'Text input with validation', status: 'stable' },
      { name: 'Button', description: 'Interactive button component', status: 'stable' },
      { name: 'Select', description: 'Dropdown selection component', status: 'stable' },
      { name: 'Checkbox', description: 'Boolean selection input', status: 'stable' }
    ]
  },
  {
    name: 'Data Display',
    count: 8,
    components: [
      { name: 'Table', description: 'Data table with sorting', status: 'stable' },
      { name: 'Card', description: 'Content container', status: 'stable' },
      { name: 'Badge', description: 'Status and label indicator', status: 'stable' },
      { name: 'Progress', description: 'Progress indicator', status: 'beta' }
    ]
  },
  {
    name: 'Navigation',
    count: 6,
    components: [
      { name: 'Breadcrumb', description: 'Navigation breadcrumb', status: 'stable' },
      { name: 'Tabs', description: 'Tabbed navigation', status: 'stable' },
      { name: 'Sidebar', description: 'Navigation sidebar', status: 'beta' },
      { name: 'Menu', description: 'Dropdown menu', status: 'stable' }
    ]
  },
  {
    name: 'Overlays',
    count: 5,
    components: [
      { name: 'Dialog', description: 'Modal dialog component', status: 'stable' },
      { name: 'Popover', description: 'Floating content overlay', status: 'stable' },
      { name: 'Tooltip', description: 'Hover information', status: 'stable' },
      { name: 'Sheet', description: 'Slide-out panel', status: 'beta' }
    ]
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'stable': return 'default';
    case 'beta': return 'secondary';
    case 'alpha': return 'outline';
    default: return 'outline';
  }
};

export default function Components() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredCategories = componentCategories.filter(category => {
    if (selectedCategory !== 'all' && category.name.toLowerCase() !== selectedCategory) {
      return false;
    }
    
    if (searchQuery) {
      return category.components.some(component =>
        component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        component.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto px-4 py-12">
        <FadeIn>
          <div className="text-center mb-12">
            <ScaleIn>
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Blocks className="w-8 h-8 text-primary" />
              </div>
            </ScaleIn>
            <h1 className="text-4xl font-bold mb-4">Component Library</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore our comprehensive collection of 50+ reusable React components built with Radix UI and Tailwind CSS.
            </p>
          </div>
        </FadeIn>

        <div className="max-w-6xl mx-auto">
          <FadeIn delay={0.2}>
            <Card className="mb-8">
              <CardHeader>
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search components..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                      <ExternalLink className="w-4 h-4" />
                      View Storybook
                    </Button>
                    <Button className="gap-2">
                      <Code className="w-4 h-4" />
                      GitHub
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </FadeIn>

          <Tabs defaultValue="grid" className="space-y-6">
            <FadeIn delay={0.3}>
              <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
                <TabsTrigger value="grid" className="flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  Grid View
                </TabsTrigger>
                <TabsTrigger value="list" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Category View
                </TabsTrigger>
              </TabsList>
            </FadeIn>

            <TabsContent value="grid" className="space-y-8">
              {filteredCategories.map((category, index) => (
                <FadeIn key={category.name} delay={0.4 + index * 0.1}>
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-xl">{category.name}</CardTitle>
                          <CardDescription>
                            {category.count} components available
                          </CardDescription>
                        </div>
                        <Badge variant="outline">{category.count}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {category.components.map((component, componentIndex) => (
                          <Card key={component.name} className="hover:shadow-md transition-all duration-200 cursor-pointer">
                            <CardHeader className="pb-3">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <CardTitle className="text-base">{component.name}</CardTitle>
                                  <CardDescription className="text-sm mt-1">
                                    {component.description}
                                  </CardDescription>
                                </div>
                                <Badge variant={getStatusColor(component.status)} className="text-xs">
                                  {component.status}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline" className="flex-1 gap-1">
                                  <Eye className="w-3 h-3" />
                                  Preview
                                </Button>
                                <Button size="sm" variant="outline" className="flex-1 gap-1">
                                  <Code className="w-3 h-3" />
                                  Code
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </FadeIn>
              ))}
            </TabsContent>

            <TabsContent value="list" className="space-y-6">
              <FadeIn delay={0.4}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {['all', ...componentCategories.map(cat => cat.name.toLowerCase())].map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? 'default' : 'outline'}
                      onClick={() => setSelectedCategory(category)}
                      className="justify-start"
                    >
                      {category === 'all' ? 'All Categories' : 
                       componentCategories.find(cat => cat.name.toLowerCase() === category)?.name}
                    </Button>
                  ))}
                </div>
              </FadeIn>

              {filteredCategories.map((category, index) => (
                <FadeIn key={category.name} delay={0.5 + index * 0.1}>
                  <Card>
                    <CardHeader>
                      <CardTitle>{category.name}</CardTitle>
                      <CardDescription>
                        {category.components.length} components in this category
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {category.components.map((component) => (
                          <div key={component.name} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <h4 className="font-medium">{component.name}</h4>
                                <Badge variant={getStatusColor(component.status)} className="text-xs">
                                  {component.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {component.description}
                              </p>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <Button size="sm" variant="ghost">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Code className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </FadeIn>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
