import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, LogOut, LayoutDashboard, FileText, Image, Mail, Settings, 
  Users, Eye, Plus, Pencil, Trash2, Copy, Download, Check, X,
  ChevronRight, Search, Filter, Star, ExternalLink, Save, RefreshCw,
  Palette, Type, Globe, Shield, Database, Clock
} from 'lucide-react';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const CATEGORIES = ['Schlaf', 'Füttern', 'Tipps', 'Alltag', 'Gesundheit'];
const TAGS = ['Baby-Art', 'Abstrakt', 'Familie', 'Neu', 'Featured'];

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [saveStatus, setSaveStatus] = useState('');
  
  // Data states
  const [stats, setStats] = useState({ total_contacts: 0, unread_contacts: 0, total_pages: 0, total_gallery: 0, total_posts: 0, donations_count: 0 });
  const [pages, setPages] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [settings, setSettings] = useState({});
  
  // Modal states
  const [editingPage, setEditingPage] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [editingImage, setEditingImage] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showNewImageModal, setShowNewImageModal] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageTitle, setNewImageTitle] = useState('');
  const [newImageTags, setNewImageTags] = useState('');
  
  // Filter states
  const [contactFilter, setContactFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Check session on load
  useEffect(() => {
    const savedToken = localStorage.getItem('admin_token');
    if (savedToken) {
      verifyToken(savedToken);
    }
  }, []);

  // Auto-save settings
  useEffect(() => {
    const interval = setInterval(() => {
      if (isAuthenticated && activeTab === 'settings') {
        handleSaveSettings(true);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated, activeTab, settings]);

  const verifyToken = async (t) => {
    try {
      await axios.get(`${API}/admin/verify?token=${t}`);
      setToken(t);
      setIsAuthenticated(true);
      fetchAllData(t);
    } catch {
      localStorage.removeItem('admin_token');
    }
  };

  const fetchAllData = async (t) => {
    try {
      const [statsRes, pagesRes, galleryRes, contactsRes, postsRes, settingsRes] = await Promise.all([
        axios.get(`${API}/admin/stats?token=${t}`),
        axios.get(`${API}/admin/pages?token=${t}`),
        axios.get(`${API}/admin/gallery?token=${t}`),
        axios.get(`${API}/admin/contacts?token=${t}`),
        axios.get(`${API}/admin/posts?token=${t}`),
        axios.get(`${API}/settings`)
      ]);
      setStats(statsRes.data);
      setPages(pagesRes.data);
      setGallery(galleryRes.data);
      setContacts(contactsRes.data);
      setPosts(postsRes.data);
      setSettings(settingsRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API}/admin/login`, { password });
      localStorage.setItem('admin_token', res.data.token);
      setToken(res.data.token);
      setIsAuthenticated(true);
      fetchAllData(res.data.token);
    } catch (err) {
      setError(err.response?.data?.detail || 'Login fehlgeschlagen');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await axios.post(`${API}/admin/logout?token=${token}`);
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
    setToken('');
  };

  const handleSaveSettings = async (silent = false) => {
    try {
      await axios.post(`${API}/settings?token=${token}`, settings);
      if (!silent) {
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus(''), 2000);
      }
    } catch (err) {
      console.error('Error saving settings:', err);
    }
  };

  const handleSavePage = async () => {
    try {
      if (editingPage.id) {
        await axios.put(`${API}/admin/pages/${editingPage.id}?token=${token}`, editingPage);
      } else {
        await axios.post(`${API}/admin/pages?token=${token}`, editingPage);
      }
      setEditingPage(null);
      fetchAllData(token);
    } catch (err) {
      console.error('Error saving page:', err);
    }
  };

  const handleDeletePage = async (id) => {
    await axios.delete(`${API}/admin/pages/${id}?token=${token}`);
    setDeleteConfirm(null);
    fetchAllData(token);
  };

  const handleDuplicatePage = async (id) => {
    await axios.post(`${API}/admin/pages/${id}/duplicate?token=${token}`);
    fetchAllData(token);
  };

  const handleSavePost = async () => {
    try {
      if (editingPost.id) {
        await axios.put(`${API}/admin/posts/${editingPost.id}?token=${token}`, editingPost);
      } else {
        await axios.post(`${API}/admin/posts?token=${token}`, editingPost);
      }
      setEditingPost(null);
      fetchAllData(token);
    } catch (err) {
      console.error('Error saving post:', err);
    }
  };

  const handleDeletePost = async (id) => {
    await axios.delete(`${API}/admin/posts/${id}?token=${token}`);
    setDeleteConfirm(null);
    fetchAllData(token);
  };

  const handleAddImage = async () => {
    await axios.post(`${API}/admin/gallery?token=${token}&url=${encodeURIComponent(newImageUrl)}&title=${encodeURIComponent(newImageTitle)}&tags=${encodeURIComponent(newImageTags)}`);
    setShowNewImageModal(false);
    setNewImageUrl('');
    setNewImageTitle('');
    setNewImageTags('');
    fetchAllData(token);
  };

  const handleUpdateImage = async () => {
    await axios.put(`${API}/admin/gallery/${editingImage.id}?token=${token}&title=${encodeURIComponent(editingImage.title)}&alt=${encodeURIComponent(editingImage.alt)}&caption=${encodeURIComponent(editingImage.caption || '')}&tags=${encodeURIComponent((editingImage.tags || []).join(','))}&featured=${editingImage.featured}`);
    setEditingImage(null);
    fetchAllData(token);
  };

  const handleDeleteImage = async (id) => {
    await axios.delete(`${API}/admin/gallery/${id}?token=${token}`);
    setDeleteConfirm(null);
    fetchAllData(token);
  };

  const handleUpdateContactStatus = async (id, status) => {
    await axios.put(`${API}/admin/contacts/${id}/status?token=${token}&status=${status}`);
    fetchAllData(token);
  };

  const handleExportContacts = async () => {
    const res = await axios.get(`${API}/admin/contacts/export?token=${token}`);
    const blob = new Blob([res.data.csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kontakte_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleIncrementDonations = async () => {
    await axios.post(`${API}/admin/donations/increment?token=${token}`);
    fetchAllData(token);
  };

  const filteredContacts = contacts.filter(c => {
    if (contactFilter !== 'all' && c.status !== contactFilter) return false;
    if (searchQuery && !c.email.toLowerCase().includes(searchQuery.toLowerCase()) && !c.nachricht.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Login Screen
  if (!isAuthenticated) {
    return (
      <main id="main-content" className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-foreground rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-background" />
            </div>
            <h1 className="text-2xl font-semibold text-foreground">gltz.de Admin</h1>
            <p className="text-sm text-muted-foreground mt-1">Melde dich an, um fortzufahren</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4" data-testid="admin-login-form">
            <div>
              <Label className="text-xs">Passwort</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1"
                required
                data-testid="admin-password-input"
              />
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full" data-testid="admin-login-btn">
              {loading ? 'Wird geprüft...' : 'Einloggen'}
            </Button>
            <p className="text-[10px] text-muted-foreground text-center">
              Standard-Passwort: gltz2025
            </p>
          </form>
        </motion.div>
      </main>
    );
  }

  // Admin Dashboard
  return (
    <main id="main-content" className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
              <Lock className="w-4 h-4 text-background" />
            </div>
            <span className="font-semibold text-foreground">gltz.de Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground hidden sm:block">
              <Clock className="w-3 h-3 inline mr-1" />
              Session: 30 Min
            </span>
            <Button variant="ghost" size="sm" onClick={handleLogout} data-testid="admin-logout-btn">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <nav className="lg:w-56 flex-shrink-0">
            <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
              {[
                { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
                { id: 'pages', icon: FileText, label: 'Seiten' },
                { id: 'gallery', icon: Image, label: 'Galerie' },
                { id: 'contacts', icon: Mail, label: 'Kontakte', badge: stats.unread_contacts },
                { id: 'posts', icon: FileText, label: 'Blog' },
                { id: 'settings', icon: Settings, label: 'Einstellungen' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === item.id
                      ? 'bg-foreground text-background'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
                  data-testid={`nav-${item.id}`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                  {item.badge > 0 && (
                    <Badge variant="destructive" className="ml-auto text-[10px] px-1.5">
                      {item.badge}
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          </nav>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {/* Dashboard Tab */}
              {activeTab === 'dashboard' && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <h1 className="text-2xl font-semibold">Dashboard</h1>
                  
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: 'Kontakte', value: stats.total_contacts, sub: `${stats.unread_contacts} ungelesen`, icon: Mail },
                      { label: 'Seiten', value: stats.total_pages, icon: FileText },
                      { label: 'Galerie', value: stats.total_gallery, icon: Image },
                      { label: 'Spenden', value: stats.donations_count, icon: Users, action: handleIncrementDonations },
                    ].map((stat) => (
                      <div key={stat.label} className="p-4 rounded-xl border border-border bg-card">
                        <div className="flex items-center justify-between mb-2">
                          <stat.icon className="w-5 h-5 text-muted-foreground" />
                          {stat.action && (
                            <button onClick={stat.action} className="text-xs text-primary hover:underline">+1</button>
                          )}
                        </div>
                        <p className="text-2xl font-semibold">{stat.value}</p>
                        <p className="text-xs text-muted-foreground">{stat.sub || stat.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                      { label: 'Neue Seite', icon: Plus, action: () => { setActiveTab('pages'); setEditingPage({ title: '', slug: '', content: '', status: 'draft' }); }},
                      { label: 'Galerie', icon: Image, action: () => setActiveTab('gallery') },
                      { label: 'Inhalte', icon: FileText, action: () => setActiveTab('posts') },
                      { label: 'Einstellungen', icon: Settings, action: () => setActiveTab('settings') },
                    ].map((btn) => (
                      <Button key={btn.label} variant="outline" className="h-auto py-4 flex-col gap-2" onClick={btn.action}>
                        <btn.icon className="w-5 h-5" />
                        <span className="text-xs">{btn.label}</span>
                      </Button>
                    ))}
                  </div>

                  {/* Recent Contacts */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="font-semibold">Neueste Anfragen</h2>
                      <Button variant="ghost" size="sm" onClick={() => setActiveTab('contacts')}>
                        Alle <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {contacts.slice(0, 3).map((c) => (
                        <div key={c.id} className="p-3 rounded-lg border border-border flex items-center justify-between">
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{c.email}</p>
                            <p className="text-xs text-muted-foreground truncate">{c.nachricht.slice(0, 50)}...</p>
                          </div>
                          <Badge variant={c.status === 'neu' ? 'default' : 'secondary'} className="text-[10px]">
                            {c.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Pages Tab */}
              {activeTab === 'pages' && (
                <motion.div
                  key="pages"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Seiten</h1>
                    <Button onClick={() => setEditingPage({ title: '', slug: '', content: '', status: 'draft' })} data-testid="new-page-btn">
                      <Plus className="w-4 h-4 mr-1" /> Neue Seite
                    </Button>
                  </div>

                  <div className="border rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-secondary">
                        <tr>
                          <th className="px-4 py-3 text-left font-medium">Titel</th>
                          <th className="px-4 py-3 text-left font-medium hidden sm:table-cell">URL</th>
                          <th className="px-4 py-3 text-left font-medium">Status</th>
                          <th className="px-4 py-3 text-right font-medium">Aktionen</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {pages.map((page) => (
                          <tr key={page.id} className="hover:bg-secondary/50">
                            <td className="px-4 py-3 font-medium">{page.title}</td>
                            <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">/{page.slug}</td>
                            <td className="px-4 py-3">
                              <Badge variant={page.status === 'live' ? 'default' : 'secondary'}>{page.status}</Badge>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex justify-end gap-1">
                                <Button variant="ghost" size="sm" onClick={() => setEditingPage(page)}><Pencil className="w-4 h-4" /></Button>
                                <Button variant="ghost" size="sm" onClick={() => handleDuplicatePage(page.id)}><Copy className="w-4 h-4" /></Button>
                                <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm({ type: 'page', id: page.id, title: page.title })}><Trash2 className="w-4 h-4" /></Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {/* Gallery Tab */}
              {activeTab === 'gallery' && (
                <motion.div
                  key="gallery"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Galerie</h1>
                    <Button onClick={() => setShowNewImageModal(true)} data-testid="new-image-btn">
                      <Plus className="w-4 h-4 mr-1" /> Bild hinzufügen
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {gallery.map((img) => (
                      <div key={img.id} className="group relative rounded-xl overflow-hidden border border-border">
                        <div className="aspect-square">
                          <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                        </div>
                        {img.featured && (
                          <div className="absolute top-2 left-2">
                            <Badge className="bg-yellow-500"><Star className="w-3 h-3" /></Badge>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Button size="sm" variant="secondary" onClick={() => setEditingImage(img)}><Pencil className="w-4 h-4" /></Button>
                          <Button size="sm" variant="destructive" onClick={() => setDeleteConfirm({ type: 'image', id: img.id, title: img.title })}><Trash2 className="w-4 h-4" /></Button>
                        </div>
                        <div className="p-2">
                          <p className="text-xs font-medium truncate">{img.title || 'Unbenannt'}</p>
                          <div className="flex gap-1 mt-1 flex-wrap">
                            {(img.tags || []).slice(0, 2).map(tag => (
                              <Badge key={tag} variant="secondary" className="text-[10px]">{tag}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Contacts Tab */}
              {activeTab === 'contacts' && (
                <motion.div
                  key="contacts"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <h1 className="text-2xl font-semibold">Kontakte</h1>
                    <Button variant="outline" onClick={handleExportContacts}>
                      <Download className="w-4 h-4 mr-1" /> CSV Export
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <div className="relative flex-1 min-w-[200px]">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Suchen..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <Select value={contactFilter} onValueChange={setContactFilter}>
                      <SelectTrigger className="w-[140px]">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Alle</SelectItem>
                        <SelectItem value="neu">Ungelesen</SelectItem>
                        <SelectItem value="gelesen">Gelesen</SelectItem>
                        <SelectItem value="beantwortet">Beantwortet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    {filteredContacts.map((c) => (
                      <div key={c.id} className="p-4 rounded-xl border border-border">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <Badge variant={c.status === 'neu' ? 'default' : 'secondary'} className="text-[10px]">{c.status}</Badge>
                              <span className="text-xs text-muted-foreground">{c.thema}</span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(c.timestamp).toLocaleDateString('de-DE')}
                              </span>
                            </div>
                            <p className="font-medium text-sm">{c.name || 'Anonym'} – {c.email}</p>
                            <p className="text-sm text-muted-foreground mt-1">{c.nachricht}</p>
                          </div>
                          <div className="flex flex-col gap-1">
                            <Select value={c.status} onValueChange={(v) => handleUpdateContactStatus(c.id, v)}>
                              <SelectTrigger className="w-[120px] h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="neu">Neu</SelectItem>
                                <SelectItem value="gelesen">Gelesen</SelectItem>
                                <SelectItem value="beantwortet">Beantwortet</SelectItem>
                              </SelectContent>
                            </Select>
                            <a href={`mailto:${c.email}`} className="text-xs text-primary hover:underline text-center">
                              Antworten
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Posts Tab */}
              {activeTab === 'posts' && (
                <motion.div
                  key="posts"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Blog-Beiträge</h1>
                    <Button onClick={() => setEditingPost({ title: '', excerpt: '', content: '', category: 'Tipps', status: 'draft' })} data-testid="new-post-btn">
                      <Plus className="w-4 h-4 mr-1" /> Neuer Beitrag
                    </Button>
                  </div>

                  <div className="grid gap-4">
                    {posts.map((post) => (
                      <div key={post.id} className="p-4 rounded-xl border border-border flex items-center gap-4">
                        {post.image_url && (
                          <img src={post.image_url} alt="" className="w-20 h-20 rounded-lg object-cover hidden sm:block" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant={post.status === 'live' ? 'default' : 'secondary'}>{post.status}</Badge>
                            <span className="text-xs text-muted-foreground">{post.category}</span>
                          </div>
                          <p className="font-medium">{post.title}</p>
                          <p className="text-sm text-muted-foreground truncate">{post.excerpt}</p>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => setEditingPost(post)}><Pencil className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm({ type: 'post', id: post.id, title: post.title })}><Trash2 className="w-4 h-4" /></Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Einstellungen</h1>
                    <Button onClick={() => handleSaveSettings(false)} data-testid="save-settings-btn">
                      {saveStatus === 'saved' ? <><Check className="w-4 h-4 mr-1" /> Gespeichert</> : <><Save className="w-4 h-4 mr-1" /> Speichern</>}
                    </Button>
                  </div>

                  <div className="grid gap-6">
                    {/* Website */}
                    <div className="p-4 rounded-xl border border-border space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Globe className="w-5 h-5" />
                        <h2 className="font-semibold">Website</h2>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs">Seiten-Titel</Label>
                          <Input value={settings.siteTitle || ''} onChange={(e) => setSettings({...settings, siteTitle: e.target.value})} className="mt-1" />
                        </div>
                        <div>
                          <Label className="text-xs">Logo-Text</Label>
                          <Input value={settings.logoText || ''} onChange={(e) => setSettings({...settings, logoText: e.target.value})} className="mt-1" />
                        </div>
                        <div>
                          <Label className="text-xs">Hero-Titel</Label>
                          <Input value={settings.heroTitle || ''} onChange={(e) => setSettings({...settings, heroTitle: e.target.value})} className="mt-1" />
                        </div>
                        <div>
                          <Label className="text-xs">Hero-Untertitel</Label>
                          <Input value={settings.heroSubtitle || ''} onChange={(e) => setSettings({...settings, heroSubtitle: e.target.value})} className="mt-1" />
                        </div>
                        <div className="sm:col-span-2">
                          <Label className="text-xs">Hero-Beschreibung</Label>
                          <Textarea value={settings.heroDescription || ''} onChange={(e) => setSettings({...settings, heroDescription: e.target.value})} className="mt-1" rows={2} />
                        </div>
                      </div>
                    </div>

                    {/* Design */}
                    <div className="p-4 rounded-xl border border-border space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Palette className="w-5 h-5" />
                        <h2 className="font-semibold">Design</h2>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs">Schriftart</Label>
                          <Select value={settings.fontFamily || 'Inter'} onValueChange={(v) => setSettings({...settings, fontFamily: v})}>
                            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Inter">Inter</SelectItem>
                              <SelectItem value="Manrope">Manrope</SelectItem>
                              <SelectItem value="Playfair Display">Playfair Display</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-xs">Standard-Theme</Label>
                          <Select value={settings.defaultTheme || 'light'} onValueChange={(v) => setSettings({...settings, defaultTheme: v})}>
                            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="light">Hell</SelectItem>
                              <SelectItem value="dark">Dunkel</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-xs">Hell-Hintergrund URL</Label>
                          <Input value={settings.lightBackground || ''} onChange={(e) => setSettings({...settings, lightBackground: e.target.value})} className="mt-1" />
                        </div>
                        <div>
                          <Label className="text-xs">Dunkel-Hintergrund URL</Label>
                          <Input value={settings.darkBackground || ''} onChange={(e) => setSettings({...settings, darkBackground: e.target.value})} className="mt-1" />
                        </div>
                      </div>
                    </div>

                    {/* PayPal */}
                    <div className="p-4 rounded-xl border border-border space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-5 h-5" />
                        <h2 className="font-semibold">Spenden</h2>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs">PayPal.me Link</Label>
                          <Input value={settings.paypalLink || ''} onChange={(e) => setSettings({...settings, paypalLink: e.target.value})} className="mt-1" />
                        </div>
                        <div>
                          <Label className="text-xs">Button-Text</Label>
                          <Input value={settings.donationText || ''} onChange={(e) => setSettings({...settings, donationText: e.target.value})} className="mt-1" />
                        </div>
                        <div className="sm:col-span-2">
                          <Label className="text-xs">Rechtshinweis</Label>
                          <Textarea value={settings.donationDisclaimer || ''} onChange={(e) => setSettings({...settings, donationDisclaimer: e.target.value})} className="mt-1" rows={2} />
                        </div>
                      </div>
                    </div>

                    {/* SEO */}
                    <div className="p-4 rounded-xl border border-border space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Search className="w-5 h-5" />
                        <h2 className="font-semibold">SEO & Analytics</h2>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                          <Label className="text-xs">Meta-Beschreibung</Label>
                          <Textarea value={settings.metaDescription || ''} onChange={(e) => setSettings({...settings, metaDescription: e.target.value})} className="mt-1" rows={2} />
                        </div>
                        <div className="sm:col-span-2">
                          <Label className="text-xs">Google Analytics 4 Tag (z.B. G-XXXXXXXXXX)</Label>
                          <Input value={settings.ga4Tag || ''} onChange={(e) => setSettings({...settings, ga4Tag: e.target.value})} className="mt-1" placeholder="G-XXXXXXXXXX" />
                        </div>
                      </div>
                    </div>

                    {/* Security */}
                    <div className="p-4 rounded-xl border border-border space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-5 h-5" />
                        <h2 className="font-semibold">Sicherheit</h2>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Passwort kann über die API geändert werden: POST /api/admin/change-password
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Page Edit Modal */}
      <Dialog open={!!editingPage} onOpenChange={() => setEditingPage(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingPage?.id ? 'Seite bearbeiten' : 'Neue Seite'}</DialogTitle>
          </DialogHeader>
          {editingPage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs">Titel</Label>
                  <Input value={editingPage.title} onChange={(e) => setEditingPage({...editingPage, title: e.target.value})} className="mt-1" />
                </div>
                <div>
                  <Label className="text-xs">URL-Slug</Label>
                  <Input value={editingPage.slug} onChange={(e) => setEditingPage({...editingPage, slug: e.target.value})} className="mt-1" />
                </div>
              </div>
              <div>
                <Label className="text-xs">Inhalt</Label>
                <Textarea value={editingPage.content} onChange={(e) => setEditingPage({...editingPage, content: e.target.value})} className="mt-1" rows={8} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs">Status</Label>
                  <Select value={editingPage.status} onValueChange={(v) => setEditingPage({...editingPage, status: v})}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Entwurf</SelectItem>
                      <SelectItem value="live">Live</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Hero-Bild URL</Label>
                  <Input value={editingPage.heroImage || ''} onChange={(e) => setEditingPage({...editingPage, heroImage: e.target.value})} className="mt-1" />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingPage(null)}>Abbrechen</Button>
            <Button onClick={handleSavePage}>Speichern</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Post Edit Modal */}
      <Dialog open={!!editingPost} onOpenChange={() => setEditingPost(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingPost?.id ? 'Beitrag bearbeiten' : 'Neuer Beitrag'}</DialogTitle>
          </DialogHeader>
          {editingPost && (
            <div className="space-y-4">
              <div>
                <Label className="text-xs">Titel</Label>
                <Input value={editingPost.title} onChange={(e) => setEditingPost({...editingPost, title: e.target.value})} className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Kurzbeschreibung</Label>
                <Input value={editingPost.excerpt} onChange={(e) => setEditingPost({...editingPost, excerpt: e.target.value})} className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Inhalt</Label>
                <Textarea value={editingPost.content} onChange={(e) => setEditingPost({...editingPost, content: e.target.value})} className="mt-1" rows={8} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-xs">Kategorie</Label>
                  <Select value={editingPost.category} onValueChange={(v) => setEditingPost({...editingPost, category: v})}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Status</Label>
                  <Select value={editingPost.status} onValueChange={(v) => setEditingPost({...editingPost, status: v})}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Entwurf</SelectItem>
                      <SelectItem value="live">Live</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Bild-URL</Label>
                  <Input value={editingPost.image_url || ''} onChange={(e) => setEditingPost({...editingPost, image_url: e.target.value})} className="mt-1" />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingPost(null)}>Abbrechen</Button>
            <Button onClick={handleSavePost}>Speichern</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Edit Modal */}
      <Dialog open={!!editingImage} onOpenChange={() => setEditingImage(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bild bearbeiten</DialogTitle>
          </DialogHeader>
          {editingImage && (
            <div className="space-y-4">
              <img src={editingImage.url} alt="" className="w-full h-40 object-cover rounded-lg" />
              <div>
                <Label className="text-xs">Titel</Label>
                <Input value={editingImage.title} onChange={(e) => setEditingImage({...editingImage, title: e.target.value})} className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Alt-Text</Label>
                <Input value={editingImage.alt} onChange={(e) => setEditingImage({...editingImage, alt: e.target.value})} className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Tags (kommagetrennt)</Label>
                <Input value={(editingImage.tags || []).join(', ')} onChange={(e) => setEditingImage({...editingImage, tags: e.target.value.split(',').map(t => t.trim())})} className="mt-1" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={editingImage.featured} onChange={(e) => setEditingImage({...editingImage, featured: e.target.checked})} />
                <Label className="text-xs">Als Featured markieren</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingImage(null)}>Abbrechen</Button>
            <Button onClick={handleUpdateImage}>Speichern</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Image Modal */}
      <Dialog open={showNewImageModal} onOpenChange={setShowNewImageModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Bild hinzufügen</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-xs">Bild-URL</Label>
              <Input value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} className="mt-1" placeholder="https://..." />
            </div>
            <div>
              <Label className="text-xs">Titel</Label>
              <Input value={newImageTitle} onChange={(e) => setNewImageTitle(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Tags (kommagetrennt)</Label>
              <Input value={newImageTags} onChange={(e) => setNewImageTags(e.target.value)} className="mt-1" placeholder="Baby-Art, Abstrakt" />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => setShowNewImageModal(false)}>Abbrechen</Button>
            <Button type="button" onClick={handleAddImage} disabled={!newImageUrl}>Hinzufügen</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Löschen bestätigen</AlertDialogTitle>
            <AlertDialogDescription>
              Möchtest du "{deleteConfirm?.title}" wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              if (deleteConfirm.type === 'page') handleDeletePage(deleteConfirm.id);
              if (deleteConfirm.type === 'post') handleDeletePost(deleteConfirm.id);
              if (deleteConfirm.type === 'image') handleDeleteImage(deleteConfirm.id);
            }}>
              Löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
