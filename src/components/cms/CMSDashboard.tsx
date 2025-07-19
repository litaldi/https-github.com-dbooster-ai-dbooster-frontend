
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useCMS } from '@/hooks/useCMS';
import { PageLoading } from '@/components/ui/loading-states';
import { AlertTriangle, Shield, CheckCircle } from 'lucide-react';
import { sanitizeErrorForDisplay } from '@/utils/errorSanitizer';
import { toast } from 'sonner';

interface PageFormData {
  title: string;
  slug: string;
  content: string;
  published: boolean;
  meta_title: string;
  meta_description: string;
}

interface NavFormData {
  label: string;
  url: string;
  sort_order: number;
  is_active: boolean;
}

export function CMSDashboard() {
  const { pages, navigation, loading, error, createPage, updatePage, deletePage, createNavigation, deleteNavigation } = useCMS();
  
  const [activeTab, setActiveTab] = useState('pages');
  const [editingPage, setEditingPage] = useState<string | null>(null);
  const [editingNav, setEditingNav] = useState<string | null>(null);
  
  const [pageForm, setPageForm] = useState<PageFormData>({
    title: '',
    slug: '',
    content: '',
    published: false,
    meta_title: '',
    meta_description: ''
  });

  const [navForm, setNavForm] = useState<NavFormData>({
    label: '',
    url: '',
    sort_order: 0,
    is_active: true
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  if (loading) return <PageLoading message="Loading CMS..." />;

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Error Loading CMS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {sanitizeErrorForDisplay(error, 'Failed to load CMS data')}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const validateForm = (data: any, type: 'page' | 'nav'): boolean => {
    const errors: Record<string, string> = {};

    if (type === 'page') {
      if (!data.title?.trim()) errors.title = 'Title is required';
      if (!data.slug?.trim()) errors.slug = 'Slug is required';
      if (data.title && data.title.length > 200) errors.title = 'Title must be less than 200 characters';
      if (data.slug && data.slug.length > 100) errors.slug = 'Slug must be less than 100 characters';
      if (data.meta_title && data.meta_title.length > 200) errors.meta_title = 'Meta title must be less than 200 characters';
      if (data.meta_description && data.meta_description.length > 500) errors.meta_description = 'Meta description must be less than 500 characters';
    } else if (type === 'nav') {
      if (!data.label?.trim()) errors.label = 'Label is required';
      if (!data.url?.trim()) errors.url = 'URL is required';
      if (data.label && data.label.length > 100) errors.label = 'Label must be less than 100 characters';
      if (data.url && data.url.length > 500) errors.url = 'URL must be less than 500 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreatePage = async () => {
    if (!validateForm(pageForm, 'page')) {
      toast.error('Please fix the validation errors');
      return;
    }

    const result = await createPage(pageForm);
    if (result.success) {
      setPageForm({
        title: '',
        slug: '',
        content: '',
        published: false,
        meta_title: '',
        meta_description: ''
      });
      setValidationErrors({});
    }
  };

  const handleUpdatePage = async () => {
    if (!editingPage || !validateForm(pageForm, 'page')) {
      toast.error('Please fix the validation errors');
      return;
    }

    const result = await updatePage(editingPage, pageForm);
    if (result.success) {
      setEditingPage(null);
      setPageForm({
        title: '',
        slug: '',
        content: '',
        published: false,
        meta_title: '',
        meta_description: ''
      });
      setValidationErrors({});
    }
  };

  const handleCreateNavigation = async () => {
    if (!validateForm(navForm, 'nav')) {
      toast.error('Please fix the validation errors');
      return;
    }

    const result = await createNavigation(navForm);
    if (result.success) {
      setNavForm({
        label: '',
        url: '',
        sort_order: 0,
        is_active: true
      });
      setValidationErrors({});
    }
  };

  const startEditingPage = (page: any) => {
    setEditingPage(page.id);
    setPageForm({
      title: page.title,
      slug: page.slug,
      content: page.content || '',
      published: page.published,
      meta_title: page.meta_title || '',
      meta_description: page.meta_description || ''
    });
    setValidationErrors({});
  };

  const SecurityIndicator = ({ field, value }: { field: string, value: string }) => {
    const hasHtml = /<[^>]*>/.test(value);
    const hasScript = /script|javascript|onclick|onerror/i.test(value);
    const isLong = value.length > 1000;

    if (hasScript) {
      return <Badge variant="destructive" className="ml-2"><AlertTriangle className="h-3 w-3 mr-1" />High Risk</Badge>;
    }
    if (hasHtml || isLong) {
      return <Badge variant="secondary" className="ml-2"><Shield className="h-3 w-3 mr-1" />Needs Review</Badge>;
    }
    return <Badge variant="outline" className="ml-2"><CheckCircle className="h-3 w-3 mr-1" />Safe</Badge>;
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">CMS Dashboard</h1>
        <p className="text-muted-foreground">Manage your website content with enhanced security</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="pages">Pages ({pages.length})</TabsTrigger>
          <TabsTrigger value="navigation">Navigation ({navigation.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pages">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Page Form */}
            <Card>
              <CardHeader>
                <CardTitle>{editingPage ? 'Edit Page' : 'Create New Page'}</CardTitle>
                <CardDescription>
                  {editingPage ? 'Update the page content' : 'Add a new page to your site'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={pageForm.title}
                    onChange={(e) => setPageForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Page title"
                    className={validationErrors.title ? 'border-destructive' : ''}
                  />
                  {validationErrors.title && (
                    <p className="text-sm text-destructive mt-1">{validationErrors.title}</p>
                  )}
                  {pageForm.title && <SecurityIndicator field="title" value={pageForm.title} />}
                </div>

                <div>
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={pageForm.slug}
                    onChange={(e) => setPageForm(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="page-url-slug"
                    className={validationErrors.slug ? 'border-destructive' : ''}
                  />
                  {validationErrors.slug && (
                    <p className="text-sm text-destructive mt-1">{validationErrors.slug}</p>
                  )}
                  {pageForm.slug && <SecurityIndicator field="slug" value={pageForm.slug} />}
                </div>

                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={pageForm.content}
                    onChange={(e) => setPageForm(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Page content"
                    rows={6}
                  />
                  {pageForm.content && <SecurityIndicator field="content" value={pageForm.content} />}
                </div>

                <div>
                  <Label htmlFor="meta_title">Meta Title</Label>
                  <Input
                    id="meta_title"
                    value={pageForm.meta_title}
                    onChange={(e) => setPageForm(prev => ({ ...prev, meta_title: e.target.value }))}
                    placeholder="SEO title"
                    className={validationErrors.meta_title ? 'border-destructive' : ''}
                  />
                  {validationErrors.meta_title && (
                    <p className="text-sm text-destructive mt-1">{validationErrors.meta_title}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <Textarea
                    id="meta_description"
                    value={pageForm.meta_description}
                    onChange={(e) => setPageForm(prev => ({ ...prev, meta_description: e.target.value }))}
                    placeholder="SEO description"
                    rows={3}
                    className={validationErrors.meta_description ? 'border-destructive' : ''}
                  />
                  {validationErrors.meta_description && (
                    <p className="text-sm text-destructive mt-1">{validationErrors.meta_description}</p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="published"
                    checked={pageForm.published}
                    onCheckedChange={(checked) => setPageForm(prev => ({ ...prev, published: checked }))}
                  />
                  <Label htmlFor="published">Published</Label>
                </div>

                <div className="flex gap-2">
                  {editingPage ? (
                    <>
                      <Button onClick={handleUpdatePage}>Update Page</Button>
                      <Button variant="outline" onClick={() => {
                        setEditingPage(null);
                        setPageForm({
                          title: '',
                          slug: '',
                          content: '',
                          published: false,
                          meta_title: '',
                          meta_description: ''
                        });
                        setValidationErrors({});
                      }}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button onClick={handleCreatePage}>Create Page</Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Pages List */}
            <Card>
              <CardHeader>
                <CardTitle>Existing Pages</CardTitle>
                <CardDescription>Manage your site pages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pages.map((page) => (
                    <div key={page.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium">{page.title}</h3>
                        <p className="text-sm text-muted-foreground">/{page.slug}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant={page.published ? "default" : "secondary"}>
                            {page.published ? "Published" : "Draft"}
                          </Badge>
                          <SecurityIndicator field="content" value={page.content || ''} />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startEditingPage(page)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deletePage(page.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                  {pages.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No pages created yet. Create your first page using the form on the left.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="navigation">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Navigation Form */}
            <Card>
              <CardHeader>
                <CardTitle>Create Navigation Item</CardTitle>
                <CardDescription>Add a new navigation link</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="nav_label">Label *</Label>
                  <Input
                    id="nav_label"
                    value={navForm.label}
                    onChange={(e) => setNavForm(prev => ({ ...prev, label: e.target.value }))}
                    placeholder="Navigation label"
                    className={validationErrors.label ? 'border-destructive' : ''}
                  />
                  {validationErrors.label && (
                    <p className="text-sm text-destructive mt-1">{validationErrors.label}</p>
                  )}
                  {navForm.label && <SecurityIndicator field="label" value={navForm.label} />}
                </div>

                <div>
                  <Label htmlFor="nav_url">URL *</Label>
                  <Input
                    id="nav_url"
                    value={navForm.url}
                    onChange={(e) => setNavForm(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="/page-url or https://external.com"
                    className={validationErrors.url ? 'border-destructive' : ''}
                  />
                  {validationErrors.url && (
                    <p className="text-sm text-destructive mt-1">{validationErrors.url}</p>
                  )}
                  {navForm.url && <SecurityIndicator field="url" value={navForm.url} />}
                </div>

                <div>
                  <Label htmlFor="nav_sort">Sort Order</Label>
                  <Input
                    id="nav_sort"
                    type="number"
                    value={navForm.sort_order}
                    onChange={(e) => setNavForm(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="nav_active"
                    checked={navForm.is_active}
                    onCheckedChange={(checked) => setNavForm(prev => ({ ...prev, is_active: checked }))}
                  />
                  <Label htmlFor="nav_active">Active</Label>
                </div>

                <Button onClick={handleCreateNavigation}>Create Navigation Item</Button>
              </CardContent>
            </Card>

            {/* Navigation List */}
            <Card>
              <CardHeader>
                <CardTitle>Navigation Items</CardTitle>
                <CardDescription>Manage your site navigation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {navigation.map((nav) => (
                    <div key={nav.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium">{nav.label}</h3>
                        <p className="text-sm text-muted-foreground">{nav.url}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant={nav.is_active ? "default" : "secondary"}>
                            {nav.is_active ? "Active" : "Inactive"}
                          </Badge>
                          <Badge variant="outline">Order: {nav.sort_order}</Badge>
                          <SecurityIndicator field="navigation" value={nav.label + nav.url} />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteNavigation(nav.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                  {navigation.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No navigation items created yet. Create your first navigation item using the form on the left.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
