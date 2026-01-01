import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, LogOut, LayoutDashboard, FileText, Image, Mail, Settings, 
  Users, Plus, Pencil, Trash2, Copy, Download, Check, X,
  ChevronRight, ChevronDown, Search, Filter, Star, Save,
  Palette, Type, Globe, Shield, Menu, Home, GripVertical,
  ExternalLink, Facebook, Instagram, Youtube, AtSign, Layout, Layers,
  RotateCcw, Calendar, ImageIcon, Link2, Twitter, Code, Eye,
  Bold, Italic, List, ListOrdered, Heading1, Heading2, Heading3,
  Quote, Link as LinkIcon, AlignLeft, AlignCenter, AlignRight, Newspaper
} from 'lucide-react';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Switch } from '../components/ui/switch';
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../components/ui/tabs';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const CATEGORIES = ['Schlaf', 'Füttern', 'Tipps', 'Alltag', 'Gesundheit', 'Reisen'];

const SOCIAL_PLATFORMS = [
  { id: 'facebook', label: 'Facebook', icon: Facebook },
  { id: 'instagram', label: 'Instagram', icon: Instagram },
  { id: 'youtube', label: 'YouTube', icon: Youtube },
  { id: 'tiktok', label: 'TikTok', icon: () => <span className="text-sm font-bold">TT</span> },
  { id: 'twitter', label: 'X (Twitter)', icon: Twitter },
];

const DEFAULT_NAV_ITEMS = [
  { id: '1', label: 'Home', path: '/', enabled: true, children: [] },
  { id: '2', label: 'Über uns', path: '/ueber-uns', enabled: true, children: [] },
  { id: '3', label: 'Schwangerschaft', path: '/schwangerschaft', enabled: true, children: [] },
  { id: '4', label: 'Baby-Alltag', path: '/baby-alltag', enabled: true, children: [] },
  { id: '5', label: 'Tipps', path: '/tipps', enabled: true, children: [] },
  { id: '6', label: 'Reisen', path: '/reisen', enabled: true, children: [] },
  { id: '7', label: 'Blog', path: '/blog', enabled: true, children: [] },
  { id: '8', label: 'Suchen', path: '/suchen', enabled: true, children: [] },
  { id: '9', label: 'M&O Portfolio', path: '/mo-portfolio', enabled: true, children: [
    { id: '9-1', label: 'Twins-Art', path: '/twins-art', enabled: true }
  ]},
  { id: '10', label: 'Spende', path: '/spende', enabled: true, children: [] },
  { id: '11', label: 'Kontakt', path: '/kontakt', enabled: true, children: [] },
];

const DEFAULT_FOOTER_LINKS = [
  { id: '1', label: 'Impressum', path: '/impressum', enabled: true },
  { id: '2', label: 'Datenschutz', path: '/datenschutz', enabled: true },
];

const DEFAULT_SOCIAL_LINKS = [
  { id: '1', platform: 'facebook', url: '', enabled: true },
  { id: '2', platform: 'instagram', url: '', enabled: false },
  { id: '3', platform: 'youtube', url: '', enabled: false },
  { id: '4', platform: 'tiktok', url: '', enabled: false },
  { id: '5', platform: 'twitter', url: '', enabled: false },
];

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
  const [trashedPages, setTrashedPages] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [trashedPosts, setTrashedPosts] = useState([]);
  const [newsItems, setNewsItems] = useState([]);
  const [settings, setSettings] = useState({
    navItems: DEFAULT_NAV_ITEMS,
    footerLinks: DEFAULT_FOOTER_LINKS,
    socialLinks: DEFAULT_SOCIAL_LINKS,
    footerEmail: '',
    logoText: 'gltz.de',
    logoImage: '',
  });
  
  // Legal page content states (Impressum, Datenschutz)
  const [impressumContent, setImpressumContent] = useState({
    provider_name: 'John D. Gold',
    provider_street: 'Schützenstraße 38',
    provider_city: '47829 Krefeld',
    provider_country: 'Deutschland',
    provider_phone: '01575 731 2560',
    provider_email: 'gltz.de@gmail.com',
    responsible_name: 'John D. Gold',
    responsible_address: 'Schützenstraße 38, 47829 Krefeld',
    liability_content: 'Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.',
    liability_links: 'Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.',
    copyright_text: 'Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Beiträge Dritter sind als solche gekennzeichnet. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.',
    dispute_text: 'Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.',
  });
  const [datenschutzContent, setDatenschutzContent] = useState({
    responsible_name: 'John D. Gold',
    responsible_address: 'Schützenstraße 38, 47829 Krefeld',
    responsible_email: 'gltz.de@gmail.com',
    intro_text: 'Der Schutz deiner persönlichen Daten ist uns wichtig. Diese Datenschutzerklärung informiert dich darüber, welche Daten wir erheben und wie wir sie verwenden.',
    contact_form_text: 'Wenn du uns über das Kontaktformular kontaktierst, werden Name, E-Mail, Thema und Nachricht erhoben.',
    contact_form_purpose: 'Zweck: Bearbeitung deiner Anfrage. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO. Speicherdauer: Bis zur Erledigung, maximal 2 Jahre.',
    cookies_text: 'Wir verwenden nur technisch notwendige Cookies für den Betrieb dieser Website (z.B. für Dark/Light Mode Einstellungen). Es werden keine Tracking- oder Werbe-Cookies eingesetzt.',
    hosting_text: 'Diese Website wird bei einem externen Dienstleister gehostet. Die Verarbeitung erfolgt auf Grundlage unserer berechtigten Interessen an einer effizienten und sicheren Bereitstellung unserer Website (Art. 6 Abs. 1 lit. f DSGVO).',
    rights_text: 'Du hast jederzeit das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit und Widerspruch.',
    paypal_text: 'Wenn du unser Projekt über PayPal unterstützt, erfolgt die Datenverarbeitung durch PayPal (Europe) S.à.r.l. et Cie, S.C.A. gemäß deren Datenschutzbestimmungen. Wir erhalten von PayPal lediglich eine Bestätigung der Transaktion.',
    last_updated: 'Dezember 2025',
  });
  
  // Modal states
  const [editingPage, setEditingPage] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [editingImage, setEditingImage] = useState(null);
  const [editingNews, setEditingNews] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showNewImageModal, setShowNewImageModal] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageTitle, setNewImageTitle] = useState('');
  const [newImageTags, setNewImageTags] = useState('');
  
  // View state
  const [pagesView, setPagesView] = useState('active'); // active, trash
  const [postsView, setPostsView] = useState('active'); // active, trash
  const [expandedNavItem, setExpandedNavItem] = useState(null);
  
  // Filter states
  const [contactFilter, setContactFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const savedToken = localStorage.getItem('admin_token');
    if (savedToken) {
      verifyToken(savedToken);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isAuthenticated && ['settings', 'landing', 'navigation'].includes(activeTab)) {
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
      const [statsRes, pagesRes, galleryRes, contactsRes, postsRes, settingsRes, newsRes, impressumRes, datenschutzRes] = await Promise.all([
        axios.get(`${API}/admin/stats?token=${t}`),
        axios.get(`${API}/admin/pages?token=${t}`),
        axios.get(`${API}/admin/gallery?token=${t}`),
        axios.get(`${API}/admin/contacts?token=${t}`),
        axios.get(`${API}/admin/posts?token=${t}`),
        axios.get(`${API}/settings`),
        axios.get(`${API}/admin/news?token=${t}`),
        axios.get(`${API}/admin/page-content/impressum?token=${t}`).catch(() => ({ data: null })),
        axios.get(`${API}/admin/page-content/datenschutz?token=${t}`).catch(() => ({ data: null }))
      ]);
      setStats(statsRes.data);
      setPages(pagesRes.data.filter(p => p.status !== 'deleted'));
      setTrashedPages(pagesRes.data.filter(p => p.status === 'deleted'));
      setGallery(galleryRes.data);
      setContacts(contactsRes.data);
      setPosts(postsRes.data.filter(p => p.status !== 'deleted'));
      setTrashedPosts(postsRes.data.filter(p => p.status === 'deleted'));
      setNewsItems(newsRes.data);
      
      // Set legal content if available
      if (impressumRes.data) {
        setImpressumContent(prev => ({ ...prev, ...impressumRes.data }));
      }
      if (datenschutzRes.data) {
        setDatenschutzContent(prev => ({ ...prev, ...datenschutzRes.data }));
      }
      
      const fetchedSettings = settingsRes.data;
      setSettings({
        ...fetchedSettings,
        navItems: fetchedSettings.navItems?.length > 0 ? fetchedSettings.navItems : DEFAULT_NAV_ITEMS,
        footerLinks: fetchedSettings.footerLinks?.length > 0 ? fetchedSettings.footerLinks : DEFAULT_FOOTER_LINKS,
        socialLinks: fetchedSettings.socialLinks?.length > 0 ? fetchedSettings.socialLinks : DEFAULT_SOCIAL_LINKS,
        footerEmail: fetchedSettings.footerEmail || fetchedSettings.socialEmail || '',
        logoText: fetchedSettings.logoText || 'gltz.de',
        logoImage: fetchedSettings.logoImage || '',
      });
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  // News handlers
  const handleSaveNews = async () => {
    try {
      if (editingNews.id && newsItems.find(n => n.id === editingNews.id)) {
        await axios.put(`${API}/admin/news/${editingNews.id}?token=${token}`, editingNews);
      } else {
        await axios.post(`${API}/admin/news?token=${token}`, editingNews);
      }
      setEditingNews(null);
      fetchAllData(token);
    } catch (err) {
      console.error('Error saving news:', err);
    }
  };

  const handleDeleteNews = async (id) => {
    await axios.delete(`${API}/admin/news/${id}?token=${token}`);
    setDeleteConfirm(null);
    fetchAllData(token);
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

  // Page handlers
  const handleSavePage = async () => {
    try {
      if (editingPage.id && pages.find(p => p.id === editingPage.id)) {
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

  const handleDeletePage = async (id, permanent = false) => {
    await axios.delete(`${API}/admin/pages/${id}?token=${token}&permanent=${permanent}`);
    setDeleteConfirm(null);
    fetchAllData(token);
  };

  const handleRestorePage = async (id) => {
    await axios.post(`${API}/admin/pages/${id}/restore?token=${token}`);
    fetchAllData(token);
  };

  const handleDuplicatePage = async (id) => {
    await axios.post(`${API}/admin/pages/${id}/duplicate?token=${token}`);
    fetchAllData(token);
  };

  // Post handlers
  const handleSavePost = async () => {
    try {
      const postData = {
        ...editingPost,
        publish_date: editingPost.publish_date ? new Date(editingPost.publish_date).toISOString() : null
      };
      if (editingPost.id && posts.find(p => p.id === editingPost.id)) {
        await axios.put(`${API}/admin/posts/${editingPost.id}?token=${token}`, postData);
      } else {
        await axios.post(`${API}/admin/posts?token=${token}`, postData);
      }
      setEditingPost(null);
      fetchAllData(token);
    } catch (err) {
      console.error('Error saving post:', err);
    }
  };

  const handleDeletePost = async (id, permanent = false) => {
    await axios.delete(`${API}/admin/posts/${id}?token=${token}&permanent=${permanent}`);
    setDeleteConfirm(null);
    fetchAllData(token);
  };

  const handleRestorePost = async (id) => {
    await axios.post(`${API}/admin/posts/${id}/restore?token=${token}`);
    fetchAllData(token);
  };

  // Gallery handlers
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

  // Contact handlers
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

  // Trash handlers
  const handleEmptyTrash = async (type = 'all') => {
    await axios.post(`${API}/admin/trash/empty?token=${token}&type=${type}`);
    fetchAllData(token);
  };

  // Navigation helpers
  const addNavItem = (parentId = null) => {
    const newItem = { id: Date.now().toString(), label: 'Neue Seite', path: '/', enabled: true, children: [] };
    if (parentId) {
      setSettings({
        ...settings,
        navItems: settings.navItems.map(item => 
          item.id === parentId 
            ? { ...item, children: [...(item.children || []), { ...newItem, id: `${parentId}-${Date.now()}` }] }
            : item
        )
      });
    } else {
      setSettings({ ...settings, navItems: [...(settings.navItems || []), newItem] });
    }
  };

  const updateNavItem = (id, field, value, parentId = null) => {
    if (parentId) {
      setSettings({
        ...settings,
        navItems: settings.navItems.map(item => 
          item.id === parentId 
            ? { ...item, children: (item.children || []).map(child => child.id === id ? { ...child, [field]: value } : child) }
            : item
        )
      });
    } else {
      setSettings({
        ...settings,
        navItems: (settings.navItems || []).map(item => item.id === id ? { ...item, [field]: value } : item)
      });
    }
  };

  const removeNavItem = (id, parentId = null) => {
    if (parentId) {
      setSettings({
        ...settings,
        navItems: settings.navItems.map(item => 
          item.id === parentId 
            ? { ...item, children: (item.children || []).filter(child => child.id !== id) }
            : item
        )
      });
    } else {
      setSettings({
        ...settings,
        navItems: (settings.navItems || []).filter(item => item.id !== id)
      });
    }
  };

  // Footer helpers
  const addFooterLink = () => {
    const newLink = { id: Date.now().toString(), label: 'Neuer Link', path: '/', enabled: true };
    setSettings({ ...settings, footerLinks: [...(settings.footerLinks || []), newLink] });
  };

  const updateFooterLink = (id, field, value) => {
    setSettings({
      ...settings,
      footerLinks: (settings.footerLinks || []).map(link => link.id === id ? { ...link, [field]: value } : link)
    });
  };

  const removeFooterLink = (id) => {
    setSettings({
      ...settings,
      footerLinks: (settings.footerLinks || []).filter(link => link.id !== id)
    });
  };

  // Social helpers
  const addSocialLink = () => {
    const newLink = { id: Date.now().toString(), platform: 'facebook', url: '', enabled: true };
    setSettings({ ...settings, socialLinks: [...(settings.socialLinks || []), newLink] });
  };

  const updateSocialLink = (id, field, value) => {
    setSettings({
      ...settings,
      socialLinks: (settings.socialLinks || []).map(link => link.id === id ? { ...link, [field]: value } : link)
    });
  };

  const removeSocialLink = (id) => {
    setSettings({
      ...settings,
      socialLinks: (settings.socialLinks || []).filter(link => link.id !== id)
    });
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-foreground rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-background" />
            </div>
            <h1 className="text-2xl font-semibold text-foreground">gltz.de Admin</h1>
            <p className="text-sm text-muted-foreground mt-1">Melde dich an, um fortzufahren</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label className="text-xs">Passwort</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="mt-1" required />
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Wird geprüft...' : 'Einloggen'}
            </Button>
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
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <nav className="lg:w-56 flex-shrink-0">
            <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
              {[
                { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
                { id: 'landing', icon: Home, label: 'Landing Page' },
                { id: 'news', icon: Newspaper, label: 'Nachrichten', badge: newsItems.filter(n => n.status === 'live').length },
                { id: 'navigation', icon: Menu, label: 'Navigation' },
                { id: 'pages', icon: FileText, label: 'Seiten' },
                { id: 'legal', icon: Shield, label: 'Rechtliches' },
                { id: 'gallery', icon: Image, label: 'Galerie' },
                { id: 'contacts', icon: Mail, label: 'Kontakte', badge: stats.unread_contacts },
                { id: 'posts', icon: Layers, label: 'Blog' },
                { id: 'settings', icon: Settings, label: 'Einstellungen' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === item.id ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                  {item.badge > 0 && <Badge variant="destructive" className="ml-auto text-[10px] px-1.5">{item.badge}</Badge>}
                </button>
              ))}
            </div>
          </nav>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {/* Dashboard Tab */}
              {activeTab === 'dashboard' && (
                <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                  <h1 className="text-2xl font-semibold">Dashboard</h1>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: 'Kontakte', value: stats.total_contacts, sub: `${stats.unread_contacts} ungelesen`, icon: Mail },
                      { label: 'Seiten', value: pages.length, sub: `${trashedPages.length} im Papierkorb`, icon: FileText },
                      { label: 'Galerie', value: stats.total_gallery, icon: Image },
                      { label: 'Blog', value: posts.length, sub: `${trashedPosts.length} im Papierkorb`, icon: Layers },
                    ].map((stat) => (
                      <div key={stat.label} className="p-4 rounded-xl border border-border bg-card">
                        <div className="flex items-center justify-between mb-2">
                          <stat.icon className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <p className="text-2xl font-semibold">{stat.value}</p>
                        <p className="text-xs text-muted-foreground">{stat.sub || stat.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                      { label: 'Neue Seite', icon: FileText, action: () => { setEditingPage({ title: '', slug: '', content: '', status: 'draft' }); setActiveTab('pages'); }},
                      { label: 'Neuer Beitrag', icon: Layers, action: () => { setEditingPost({ title: '', excerpt: '', content: '', category: 'Tipps', status: 'draft', publish_date: new Date().toISOString().split('T')[0] }); setActiveTab('posts'); }},
                      { label: 'Navigation', icon: Menu, action: () => setActiveTab('navigation') },
                      { label: 'Einstellungen', icon: Settings, action: () => setActiveTab('settings') },
                    ].map((btn) => (
                      <Button key={btn.label} variant="outline" className="h-auto py-4 flex-col gap-2" onClick={btn.action}>
                        <btn.icon className="w-5 h-5" />
                        <span className="text-xs">{btn.label}</span>
                      </Button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Landing Page Tab */}
              {activeTab === 'landing' && (
                <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Landing Page</h1>
                    <Button onClick={() => handleSaveSettings(false)}>
                      {saveStatus === 'saved' ? <><Check className="w-4 h-4 mr-1" /> Gespeichert</> : <><Save className="w-4 h-4 mr-1" /> Speichern</>}
                    </Button>
                  </div>

                  <Accordion type="multiple" defaultValue={['hero']} className="space-y-4">
                    <AccordionItem value="hero" className="border rounded-xl px-4">
                      <AccordionTrigger className="py-4">
                        <div className="flex items-center gap-2">
                          <Layout className="w-5 h-5" />
                          <span className="font-semibold">Hero-Bereich</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-4 space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-xs">Überschrift</Label>
                            <Input value={settings.heroTitle || ''} onChange={(e) => setSettings({...settings, heroTitle: e.target.value})} className="mt-1" />
                          </div>
                          <div>
                            <Label className="text-xs">Untertitel</Label>
                            <Input value={settings.heroSubtitle || ''} onChange={(e) => setSettings({...settings, heroSubtitle: e.target.value})} className="mt-1" />
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs">Beschreibung</Label>
                          <Textarea value={settings.heroDescription || ''} onChange={(e) => setSettings({...settings, heroDescription: e.target.value})} className="mt-1" rows={2} />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-xs">Hintergrund (Hell)</Label>
                            <Input value={settings.lightBackground || ''} onChange={(e) => setSettings({...settings, lightBackground: e.target.value})} className="mt-1" placeholder="https://..." />
                          </div>
                          <div>
                            <Label className="text-xs">Hintergrund (Dunkel)</Label>
                            <Input value={settings.darkBackground || ''} onChange={(e) => setSettings({...settings, darkBackground: e.target.value})} className="mt-1" placeholder="https://..." />
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="cta" className="border rounded-xl px-4">
                      <AccordionTrigger className="py-4">
                        <div className="flex items-center gap-2">
                          <Users className="w-5 h-5" />
                          <span className="font-semibold">Call-to-Action (Spenden)</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-4 space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-xs">Überschrift</Label>
                            <Input value={settings.ctaTitle || ''} onChange={(e) => setSettings({...settings, ctaTitle: e.target.value})} className="mt-1" />
                          </div>
                          <div>
                            <Label className="text-xs">Button-Text</Label>
                            <Input value={settings.ctaButtonText || ''} onChange={(e) => setSettings({...settings, ctaButtonText: e.target.value})} className="mt-1" />
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs">PayPal.me Link</Label>
                          <Input value={settings.paypalLink || ''} onChange={(e) => setSettings({...settings, paypalLink: e.target.value})} className="mt-1" />
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </motion.div>
              )}

              {/* News Tab */}
              {activeTab === 'news' && (
                <motion.div key="news" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-2xl font-semibold">Nachrichten-Ticker</h1>
                      <p className="text-sm text-muted-foreground">Verwalte die Nachrichten im Carousel auf der Landing Page</p>
                    </div>
                    <Button onClick={() => setEditingNews({ title: '', subtitle: '', image_url: '', link_url: '', link_type: 'internal', status: 'draft', order: 0 })}>
                      <Plus className="w-4 h-4 mr-1" /> Neue Nachricht
                    </Button>
                  </div>

                  {/* Info */}
                  <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                    <p className="text-sm text-muted-foreground">
                      <strong>Tipp:</strong> Nachrichten werden auf der Startseite als automatisches Carousel angezeigt (10 Sek. Intervall). 
                      Besucher können auch manuell durch die Nachrichten navigieren.
                    </p>
                  </div>

                  {/* News List */}
                  {newsItems.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-border rounded-xl">
                      <Newspaper className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Noch keine Nachrichten vorhanden.</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => setEditingNews({ title: '', subtitle: '', image_url: '', link_url: '', link_type: 'internal', status: 'draft', order: 0 })}
                      >
                        <Plus className="w-4 h-4 mr-1" /> Erste Nachricht erstellen
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {newsItems.map((news, index) => (
                        <div key={news.id} className="flex items-center gap-4 p-4 border border-border rounded-xl bg-card">
                          {news.image_url && (
                            <img src={news.image_url} alt={news.title} className="w-16 h-16 rounded-lg object-cover shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant={news.status === 'live' ? 'default' : 'secondary'}>{news.status}</Badge>
                              <span className="text-xs text-muted-foreground">#{index + 1}</span>
                            </div>
                            <p className="font-medium text-foreground truncate">{news.title}</p>
                            {news.subtitle && <p className="text-sm text-muted-foreground truncate">{news.subtitle}</p>}
                            {news.link_url && <p className="text-xs text-primary truncate">{news.link_url}</p>}
                          </div>
                          <div className="flex gap-1 shrink-0">
                            <Button variant="ghost" size="sm" onClick={() => setEditingNews(news)}><Pencil className="w-4 h-4" /></Button>
                            <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm({ type: 'news', id: news.id, title: news.title })}><Trash2 className="w-4 h-4" /></Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Navigation Tab */}
              {activeTab === 'navigation' && (
                <motion.div key="navigation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Navigation & Menü</h1>
                    <Button onClick={() => handleSaveSettings(false)}>
                      {saveStatus === 'saved' ? <><Check className="w-4 h-4 mr-1" /> Gespeichert</> : <><Save className="w-4 h-4 mr-1" /> Speichern</>}
                    </Button>
                  </div>

                  {/* Header Navigation with Submenus */}
                  <div className="p-4 rounded-xl border border-border space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Menu className="w-5 h-5" />
                        <h2 className="font-semibold">Primäre Navigation (mit Untermenüs)</h2>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => addNavItem()}><Plus className="w-4 h-4 mr-1" /> Hinzufügen</Button>
                    </div>
                    
                    <div className="space-y-2">
                      {(settings.navItems || []).map((item) => (
                        <div key={item.id} className="border rounded-lg bg-card">
                          <div className="flex items-center gap-3 p-3">
                            <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
                            <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3">
                              <Input value={item.label} onChange={(e) => updateNavItem(item.id, 'label', e.target.value)} placeholder="Label" className="h-9" />
                              <Input value={item.path} onChange={(e) => updateNavItem(item.id, 'path', e.target.value)} placeholder="/pfad" className="h-9" />
                              <div className="flex items-center gap-2">
                                <Switch checked={item.enabled} onCheckedChange={(v) => updateNavItem(item.id, 'enabled', v)} />
                                <span className="text-xs text-muted-foreground">{item.enabled ? 'Aktiv' : 'Inaktiv'}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button variant="ghost" size="sm" onClick={() => setExpandedNavItem(expandedNavItem === item.id ? null : item.id)}>
                                  <ChevronDown className={`w-4 h-4 transition-transform ${expandedNavItem === item.id ? 'rotate-180' : ''}`} />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => removeNavItem(item.id)}><Trash2 className="w-4 h-4" /></Button>
                              </div>
                            </div>
                          </div>
                          
                          {/* Children/Submenus */}
                          {expandedNavItem === item.id && (
                            <div className="px-3 pb-3 pt-0 ml-8 border-t border-dashed space-y-2">
                              <p className="text-xs text-muted-foreground pt-2">Untermenü-Einträge:</p>
                              {(item.children || []).map((child) => (
                                <div key={child.id} className="flex items-center gap-3 p-2 bg-secondary/50 rounded">
                                  <Input value={child.label} onChange={(e) => updateNavItem(child.id, 'label', e.target.value, item.id)} placeholder="Label" className="h-8 text-sm" />
                                  <Input value={child.path} onChange={(e) => updateNavItem(child.id, 'path', e.target.value, item.id)} placeholder="/pfad" className="h-8 text-sm" />
                                  <Switch checked={child.enabled} onCheckedChange={(v) => updateNavItem(child.id, 'enabled', v, item.id)} />
                                  <Button variant="ghost" size="sm" onClick={() => removeNavItem(child.id, item.id)}><Trash2 className="w-3 h-3" /></Button>
                                </div>
                              ))}
                              <Button variant="outline" size="sm" onClick={() => addNavItem(item.id)} className="w-full mt-2">
                                <Plus className="w-3 h-3 mr-1" /> Untermenü hinzufügen
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer Links */}
                  <div className="p-4 rounded-xl border border-border space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        <h2 className="font-semibold">Footer-Links (Rechtliches)</h2>
                      </div>
                      <Button variant="outline" size="sm" onClick={addFooterLink}><Plus className="w-4 h-4 mr-1" /> Hinzufügen</Button>
                    </div>
                    
                    <div className="space-y-2">
                      {(settings.footerLinks || []).map((link) => (
                        <div key={link.id} className="flex items-center gap-3 p-3 border rounded-lg bg-card">
                          <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <Input value={link.label} onChange={(e) => updateFooterLink(link.id, 'label', e.target.value)} placeholder="Label" className="h-9" />
                            <Input value={link.path} onChange={(e) => updateFooterLink(link.id, 'path', e.target.value)} placeholder="/pfad" className="h-9" />
                            <div className="flex items-center gap-2">
                              <Switch checked={link.enabled} onCheckedChange={(v) => updateFooterLink(link.id, 'enabled', v)} />
                              <span className="text-xs text-muted-foreground">{link.enabled ? 'Aktiv' : 'Inaktiv'}</span>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => removeFooterLink(link.id)} className="justify-self-end"><Trash2 className="w-4 h-4" /></Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Pages Tab */}
              {activeTab === 'pages' && (
                <motion.div key="pages" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <h1 className="text-2xl font-semibold">Seiten</h1>
                    <div className="flex gap-2">
                      <Tabs value={pagesView} onValueChange={setPagesView}>
                        <TabsList>
                          <TabsTrigger value="active">Aktiv ({pages.length})</TabsTrigger>
                          <TabsTrigger value="trash">Papierkorb ({trashedPages.length})</TabsTrigger>
                        </TabsList>
                      </Tabs>
                      <Button variant="outline" onClick={async () => {
                        await axios.post(`${API}/admin/pages/init-defaults?token=${token}`);
                        fetchAllData(token);
                      }}>
                        <Plus className="w-4 h-4 mr-1" /> Standardseiten
                      </Button>
                      <Button onClick={() => setEditingPage({ title: '', slug: '', content: '', status: 'draft' })}>
                        <Plus className="w-4 h-4 mr-1" /> Neue Seite
                      </Button>
                    </div>
                  </div>

                  {/* Info box */}
                  {pages.length === 0 && (
                    <div className="p-4 rounded-xl border border-border bg-secondary/30">
                      <p className="text-sm text-muted-foreground">
                        <strong>Tipp:</strong> Klicke auf "Standardseiten" um Impressum und Datenschutz automatisch zu erstellen.
                        Alle Seiten können hier zentral bearbeitet werden.
                      </p>
                    </div>
                  )}

                  {pagesView === 'active' ? (
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
                          {pages.length === 0 ? (
                            <tr>
                              <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                                Keine Seiten vorhanden. Erstelle eine neue Seite oder lade Standardseiten.
                              </td>
                            </tr>
                          ) : pages.map((page) => (
                            <tr key={page.id} className="hover:bg-secondary/50">
                              <td className="px-4 py-3 font-medium">{page.title}</td>
                              <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                                <a href={`/${page.slug}`} target="_blank" rel="noopener noreferrer" className="hover:text-foreground hover:underline">
                                  /{page.slug}
                                </a>
                              </td>
                              <td className="px-4 py-3"><Badge variant={page.status === 'live' ? 'default' : 'secondary'}>{page.status}</Badge></td>
                              <td className="px-4 py-3">
                                <div className="flex justify-end gap-1">
                                  <Button variant="ghost" size="sm" onClick={() => setEditingPage(page)} title="Bearbeiten"><Pencil className="w-4 h-4" /></Button>
                                  <Button variant="ghost" size="sm" onClick={() => handleDuplicatePage(page.id)} title="Duplizieren"><Copy className="w-4 h-4" /></Button>
                                  <Button variant="ghost" size="sm" onClick={() => window.open(`/${page.slug}`, '_blank')} title="Vorschau"><ExternalLink className="w-4 h-4" /></Button>
                                  <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm({ type: 'page', id: page.id, title: page.title })} title="Löschen"><Trash2 className="w-4 h-4" /></Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {trashedPages.length > 0 && (
                        <div className="flex justify-end">
                          <Button variant="destructive" size="sm" onClick={() => handleEmptyTrash('pages')}>
                            <Trash2 className="w-4 h-4 mr-1" /> Papierkorb leeren
                          </Button>
                        </div>
                      )}
                      <div className="border rounded-xl overflow-hidden">
                        <table className="w-full text-sm">
                          <thead className="bg-secondary">
                            <tr>
                              <th className="px-4 py-3 text-left font-medium">Titel</th>
                              <th className="px-4 py-3 text-left font-medium hidden sm:table-cell">Gelöscht am</th>
                              <th className="px-4 py-3 text-right font-medium">Aktionen</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {trashedPages.map((page) => (
                              <tr key={page.id} className="hover:bg-secondary/50">
                                <td className="px-4 py-3 font-medium">{page.title}</td>
                                <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                                  {page.deleted_at ? new Date(page.deleted_at).toLocaleDateString('de-DE') : '-'}
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex justify-end gap-1">
                                    <Button variant="ghost" size="sm" onClick={() => handleRestorePage(page.id)}><RotateCcw className="w-4 h-4" /></Button>
                                    <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm({ type: 'page-permanent', id: page.id, title: page.title })}><X className="w-4 h-4 text-destructive" /></Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <p className="text-xs text-muted-foreground text-center">Einträge werden nach 30 Tagen automatisch gelöscht</p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Gallery Tab */}
              {activeTab === 'gallery' && (
                <motion.div key="gallery" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Galerie</h1>
                    <Button onClick={() => setShowNewImageModal(true)}><Plus className="w-4 h-4 mr-1" /> Bild hinzufügen</Button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {gallery.map((img) => (
                      <div key={img.id} className="group relative rounded-xl overflow-hidden border border-border">
                        <div className="aspect-square"><img src={img.url} alt={img.alt} className="w-full h-full object-cover" /></div>
                        {img.featured && <div className="absolute top-2 left-2"><Badge className="bg-yellow-500"><Star className="w-3 h-3" /></Badge></div>}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Button size="sm" variant="secondary" onClick={() => setEditingImage(img)}><Pencil className="w-4 h-4" /></Button>
                          <Button size="sm" variant="destructive" onClick={() => setDeleteConfirm({ type: 'image', id: img.id, title: img.title })}><Trash2 className="w-4 h-4" /></Button>
                        </div>
                        <div className="p-2">
                          <p className="text-xs font-medium truncate">{img.title || 'Unbenannt'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Contacts Tab */}
              {activeTab === 'contacts' && (
                <motion.div key="contacts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <h1 className="text-2xl font-semibold">Kontakte</h1>
                    <Button variant="outline" onClick={handleExportContacts}><Download className="w-4 h-4 mr-1" /> CSV Export</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <div className="relative flex-1 min-w-[200px]">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input placeholder="Suchen..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
                    </div>
                    <Select value={contactFilter} onValueChange={setContactFilter}>
                      <SelectTrigger className="w-[140px]"><Filter className="w-4 h-4 mr-2" /><SelectValue /></SelectTrigger>
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
                              <span className="text-xs text-muted-foreground">{new Date(c.timestamp).toLocaleDateString('de-DE')}</span>
                            </div>
                            <p className="font-medium text-sm">{c.name || 'Anonym'} – {c.email}</p>
                            <p className="text-sm text-muted-foreground mt-1">{c.nachricht}</p>
                          </div>
                          <div className="flex flex-col gap-1">
                            <Select value={c.status} onValueChange={(v) => handleUpdateContactStatus(c.id, v)}>
                              <SelectTrigger className="w-[120px] h-8 text-xs"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="neu">Neu</SelectItem>
                                <SelectItem value="gelesen">Gelesen</SelectItem>
                                <SelectItem value="beantwortet">Beantwortet</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Posts Tab */}
              {activeTab === 'posts' && (
                <motion.div key="posts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <h1 className="text-2xl font-semibold">Blog-Beiträge</h1>
                    <div className="flex gap-2">
                      <Tabs value={postsView} onValueChange={setPostsView}>
                        <TabsList>
                          <TabsTrigger value="active">Aktiv ({posts.length})</TabsTrigger>
                          <TabsTrigger value="trash">Papierkorb ({trashedPosts.length})</TabsTrigger>
                        </TabsList>
                      </Tabs>
                      <Button onClick={() => setEditingPost({ title: '', excerpt: '', content: '', category: 'Tipps', status: 'draft', publish_date: new Date().toISOString().split('T')[0] })}>
                        <Plus className="w-4 h-4 mr-1" /> Neuer Beitrag
                      </Button>
                    </div>
                  </div>

                  {postsView === 'active' ? (
                    <div className="grid gap-4">
                      {posts.map((post) => (
                        <div key={post.id} className="p-4 rounded-xl border border-border flex items-center gap-4">
                          {post.image_url && <img src={post.image_url} alt="" className="w-20 h-20 rounded-lg object-cover hidden sm:block" />}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant={post.status === 'live' ? 'default' : 'secondary'}>{post.status}</Badge>
                              <span className="text-xs text-muted-foreground">{post.category}</span>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {post.publish_date ? new Date(post.publish_date).toLocaleDateString('de-DE') : '-'}
                              </span>
                            </div>
                            <p className="font-medium">{post.title}</p>
                            <p className="text-sm text-muted-foreground truncate">{post.excerpt}</p>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" onClick={() => setEditingPost({...post, publish_date: post.publish_date ? new Date(post.publish_date).toISOString().split('T')[0] : ''})}><Pencil className="w-4 h-4" /></Button>
                            <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm({ type: 'post', id: post.id, title: post.title })}><Trash2 className="w-4 h-4" /></Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {trashedPosts.length > 0 && (
                        <div className="flex justify-end">
                          <Button variant="destructive" size="sm" onClick={() => handleEmptyTrash('posts')}>
                            <Trash2 className="w-4 h-4 mr-1" /> Papierkorb leeren
                          </Button>
                        </div>
                      )}
                      <div className="grid gap-4">
                        {trashedPosts.map((post) => (
                          <div key={post.id} className="p-4 rounded-xl border border-border flex items-center gap-4 opacity-60">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium">{post.title}</p>
                              <p className="text-xs text-muted-foreground">Gelöscht am: {post.deleted_at ? new Date(post.deleted_at).toLocaleDateString('de-DE') : '-'}</p>
                            </div>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm" onClick={() => handleRestorePost(post.id)}><RotateCcw className="w-4 h-4" /></Button>
                              <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm({ type: 'post-permanent', id: post.id, title: post.title })}><X className="w-4 h-4 text-destructive" /></Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground text-center">Einträge werden nach 30 Tagen automatisch gelöscht</p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Einstellungen</h1>
                    <Button onClick={() => handleSaveSettings(false)}>
                      {saveStatus === 'saved' ? <><Check className="w-4 h-4 mr-1" /> Gespeichert</> : <><Save className="w-4 h-4 mr-1" /> Speichern</>}
                    </Button>
                  </div>

                  <div className="grid gap-6">
                    {/* General Settings */}
                    <div className="p-4 rounded-xl border border-border space-y-4">
                      <div className="flex items-center gap-2 mb-2"><Globe className="w-5 h-5" /><h2 className="font-semibold">Allgemein</h2></div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs">Seiten-Titel</Label>
                          <Input value={settings.siteTitle || ''} onChange={(e) => setSettings({...settings, siteTitle: e.target.value})} className="mt-1" />
                        </div>
                        <div>
                          <Label className="text-xs">Logo-Text</Label>
                          <Input value={settings.logoText || ''} onChange={(e) => setSettings({...settings, logoText: e.target.value})} className="mt-1" />
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs flex items-center gap-1"><ImageIcon className="w-3 h-3" /> Logo-Bild URL (optional, ersetzt Logo-Text)</Label>
                        <Input value={settings.logoImage || ''} onChange={(e) => setSettings({...settings, logoImage: e.target.value})} className="mt-1" placeholder="https://..." />
                        {settings.logoImage && <img src={settings.logoImage} alt="Logo Preview" className="mt-2 h-10 object-contain" />}
                      </div>
                    </div>

                    {/* Footer Settings */}
                    <div className="p-4 rounded-xl border border-border space-y-4">
                      <div className="flex items-center gap-2 mb-2"><FileText className="w-5 h-5" /><h2 className="font-semibold">Footer-Einstellungen</h2></div>
                      <div>
                        <Label className="text-xs">Footer-Text</Label>
                        <Textarea value={settings.footerText || ''} onChange={(e) => setSettings({...settings, footerText: e.target.value})} className="mt-1" rows={2} />
                      </div>
                      <div>
                        <Label className="text-xs flex items-center gap-1"><AtSign className="w-3 h-3" /> Kontakt E-Mail</Label>
                        <Input value={settings.footerEmail || ''} onChange={(e) => setSettings({...settings, footerEmail: e.target.value})} className="mt-1" placeholder="kontakt@beispiel.de" />
                      </div>
                    </div>

                    {/* Social Links */}
                    <div className="p-4 rounded-xl border border-border space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2"><Link2 className="w-5 h-5" /><h2 className="font-semibold">Social Media Links</h2></div>
                        <Button variant="outline" size="sm" onClick={addSocialLink}><Plus className="w-4 h-4 mr-1" /> Hinzufügen</Button>
                      </div>
                      
                      <div className="space-y-3">
                        {(settings.socialLinks || []).map((link) => {
                          const platform = SOCIAL_PLATFORMS.find(p => p.id === link.platform);
                          const IconComponent = platform?.icon || Globe;
                          return (
                            <div key={link.id} className="flex items-center gap-3 p-3 border rounded-lg bg-card">
                              <IconComponent className="w-5 h-5 text-muted-foreground" />
                              <Select value={link.platform} onValueChange={(v) => updateSocialLink(link.id, 'platform', v)}>
                                <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  {SOCIAL_PLATFORMS.map(p => (
                                    <SelectItem key={p.id} value={p.id}>{p.label}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Input 
                                value={link.url} 
                                onChange={(e) => updateSocialLink(link.id, 'url', e.target.value)} 
                                placeholder="https://..." 
                                className="flex-1" 
                              />
                              <div className="flex items-center gap-2">
                                <Switch checked={link.enabled} onCheckedChange={(v) => updateSocialLink(link.id, 'enabled', v)} />
                                <span className="text-xs text-muted-foreground w-12">{link.enabled ? 'Aktiv' : 'Aus'}</span>
                              </div>
                              <Button variant="ghost" size="sm" onClick={() => removeSocialLink(link.id)}><Trash2 className="w-4 h-4" /></Button>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Design Settings */}
                    <div className="p-4 rounded-xl border border-border space-y-4">
                      <div className="flex items-center gap-2 mb-2"><Palette className="w-5 h-5" /><h2 className="font-semibold">Design</h2></div>
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
                      </div>
                    </div>

                    {/* SEO Settings */}
                    <div className="p-4 rounded-xl border border-border space-y-4">
                      <div className="flex items-center gap-2 mb-2"><Search className="w-5 h-5" /><h2 className="font-semibold">SEO</h2></div>
                      <div>
                        <Label className="text-xs">Meta-Beschreibung</Label>
                        <Textarea value={settings.metaDescription || ''} onChange={(e) => setSettings({...settings, metaDescription: e.target.value})} className="mt-1" rows={2} />
                      </div>
                      <div>
                        <Label className="text-xs">Google Analytics 4 Tag</Label>
                        <Input value={settings.ga4Tag || ''} onChange={(e) => setSettings({...settings, ga4Tag: e.target.value})} className="mt-1" placeholder="G-XXXXXXXXXX" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Page Edit Modal with Rich Text Editor */}
      <Dialog open={!!editingPage} onOpenChange={() => setEditingPage(null)}>
        <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPage?.id ? 'Seite bearbeiten' : 'Neue Seite'}</DialogTitle>
          </DialogHeader>
          {editingPage && (
            <PageEditor 
              page={editingPage} 
              onChange={setEditingPage} 
              onSave={handleSavePage}
              onCancel={() => setEditingPage(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Post Edit Modal */}
      <Dialog open={!!editingPost} onOpenChange={() => setEditingPost(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingPost?.id ? 'Beitrag bearbeiten' : 'Neuer Beitrag'}</DialogTitle></DialogHeader>
          {editingPost && (
            <div className="space-y-4">
              <div><Label className="text-xs">Titel</Label><Input value={editingPost.title} onChange={(e) => setEditingPost({...editingPost, title: e.target.value})} className="mt-1" /></div>
              <div><Label className="text-xs">Kurzbeschreibung</Label><Input value={editingPost.excerpt} onChange={(e) => setEditingPost({...editingPost, excerpt: e.target.value})} className="mt-1" /></div>
              <div><Label className="text-xs">Inhalt</Label><Textarea value={editingPost.content} onChange={(e) => setEditingPost({...editingPost, content: e.target.value})} className="mt-1" rows={8} /></div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <Label className="text-xs">Kategorie</Label>
                  <Select value={editingPost.category} onValueChange={(v) => setEditingPost({...editingPost, category: v})}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Status</Label>
                  <Select value={editingPost.status} onValueChange={(v) => setEditingPost({...editingPost, status: v})}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="draft">Entwurf</SelectItem><SelectItem value="live">Live</SelectItem></SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs flex items-center gap-1"><Calendar className="w-3 h-3" /> Veröffentlichungsdatum</Label>
                  <Input type="date" value={editingPost.publish_date || ''} onChange={(e) => setEditingPost({...editingPost, publish_date: e.target.value})} className="mt-1" />
                </div>
                <div><Label className="text-xs">Bild-URL</Label><Input value={editingPost.image_url || ''} onChange={(e) => setEditingPost({...editingPost, image_url: e.target.value})} className="mt-1" /></div>
              </div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setEditingPost(null)}>Abbrechen</Button><Button onClick={handleSavePost}>Speichern</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Edit Modal */}
      <Dialog open={!!editingImage} onOpenChange={() => setEditingImage(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Bild bearbeiten</DialogTitle></DialogHeader>
          {editingImage && (
            <div className="space-y-4">
              <img src={editingImage.url} alt="" className="w-full h-40 object-cover rounded-lg" />
              <div><Label className="text-xs">Titel</Label><Input value={editingImage.title} onChange={(e) => setEditingImage({...editingImage, title: e.target.value})} className="mt-1" /></div>
              <div><Label className="text-xs">Alt-Text</Label><Input value={editingImage.alt} onChange={(e) => setEditingImage({...editingImage, alt: e.target.value})} className="mt-1" /></div>
              <div><Label className="text-xs">Tags (kommagetrennt)</Label><Input value={(editingImage.tags || []).join(', ')} onChange={(e) => setEditingImage({...editingImage, tags: e.target.value.split(',').map(t => t.trim())})} className="mt-1" /></div>
              <div className="flex items-center gap-2"><input type="checkbox" checked={editingImage.featured} onChange={(e) => setEditingImage({...editingImage, featured: e.target.checked})} /><Label className="text-xs">Als Featured markieren</Label></div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setEditingImage(null)}>Abbrechen</Button><Button onClick={handleUpdateImage}>Speichern</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Image Modal */}
      <Dialog open={showNewImageModal} onOpenChange={setShowNewImageModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Bild hinzufügen</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div><Label className="text-xs">Bild-URL</Label><Input value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} className="mt-1" placeholder="https://..." /></div>
            <div><Label className="text-xs">Titel</Label><Input value={newImageTitle} onChange={(e) => setNewImageTitle(e.target.value)} className="mt-1" /></div>
            <div><Label className="text-xs">Tags (kommagetrennt)</Label><Input value={newImageTags} onChange={(e) => setNewImageTags(e.target.value)} className="mt-1" placeholder="Baby-Art, Abstrakt" /></div>
          </div>
          <DialogFooter className="gap-2"><Button type="button" variant="outline" onClick={() => setShowNewImageModal(false)}>Abbrechen</Button><Button type="button" onClick={handleAddImage} disabled={!newImageUrl}>Hinzufügen</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* News Edit Modal */}
      <Dialog open={!!editingNews} onOpenChange={() => setEditingNews(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>{editingNews?.id ? 'Nachricht bearbeiten' : 'Neue Nachricht'}</DialogTitle></DialogHeader>
          {editingNews && (
            <div className="space-y-4">
              <div>
                <Label className="text-xs">Überschrift *</Label>
                <Input value={editingNews.title} onChange={(e) => setEditingNews({...editingNews, title: e.target.value})} className="mt-1" placeholder="Neuer Blog-Beitrag online!" />
              </div>
              <div>
                <Label className="text-xs">Untertitel (optional)</Label>
                <Input value={editingNews.subtitle || ''} onChange={(e) => setEditingNews({...editingNews, subtitle: e.target.value})} className="mt-1" placeholder="Kurze Beschreibung..." />
              </div>
              <div>
                <Label className="text-xs">Bild-URL *</Label>
                <Input value={editingNews.image_url} onChange={(e) => setEditingNews({...editingNews, image_url: e.target.value})} className="mt-1" placeholder="https://..." />
                {editingNews.image_url && <img src={editingNews.image_url} alt="Preview" className="mt-2 h-20 w-20 rounded-lg object-cover" />}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs">Link-Typ</Label>
                  <Select value={editingNews.link_type} onValueChange={(v) => setEditingNews({...editingNews, link_type: v})}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="internal">Interne Seite</SelectItem>
                      <SelectItem value="blog">Blog-Beitrag</SelectItem>
                      <SelectItem value="external">Externer Link</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Status</Label>
                  <Select value={editingNews.status} onValueChange={(v) => setEditingNews({...editingNews, status: v})}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Entwurf</SelectItem>
                      <SelectItem value="live">Live</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className="text-xs">Link-URL</Label>
                <Input value={editingNews.link_url || ''} onChange={(e) => setEditingNews({...editingNews, link_url: e.target.value})} className="mt-1" placeholder="/blog oder https://..." />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingNews(null)}>Abbrechen</Button>
            <Button onClick={handleSaveNews} disabled={!editingNews?.title || !editingNews?.image_url}>Speichern</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {deleteConfirm?.type === 'news' ? 'Nachricht löschen?' : deleteConfirm?.type?.includes('permanent') ? 'Endgültig löschen?' : 'In Papierkorb verschieben?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deleteConfirm?.type === 'news'
                ? `"${deleteConfirm?.title}" wird unwiderruflich gelöscht.`
                : deleteConfirm?.type?.includes('permanent') 
                ? `"${deleteConfirm?.title}" wird endgültig gelöscht und kann nicht wiederhergestellt werden.`
                : `"${deleteConfirm?.title}" wird in den Papierkorb verschoben. Du kannst es innerhalb von 30 Tagen wiederherstellen.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              if (deleteConfirm.type === 'news') handleDeleteNews(deleteConfirm.id);
              if (deleteConfirm.type === 'page') handleDeletePage(deleteConfirm.id, false);
              if (deleteConfirm.type === 'page-permanent') handleDeletePage(deleteConfirm.id, true);
              if (deleteConfirm.type === 'post') handleDeletePost(deleteConfirm.id, false);
              if (deleteConfirm.type === 'post-permanent') handleDeletePost(deleteConfirm.id, true);
              if (deleteConfirm.type === 'image') handleDeleteImage(deleteConfirm.id);
            }}>
              {deleteConfirm?.type?.includes('permanent') ? 'Endgültig löschen' : 'In Papierkorb'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}

// ============== Page Editor Component with Rich Text ==============
function PageEditor({ page, onChange, onSave, onCancel }) {
  const [viewMode, setViewMode] = useState('visual'); // 'visual' or 'source'
  const editorRef = useRef(null);
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);

  // Format content for visual display
  const formatForVisual = (content) => {
    if (!content) return '';
    return content;
  };

  // Execute formatting command
  const execCommand = useCallback((command, value = null) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand(command, false, value);
      // Update the page content
      onChange({ ...page, content: editorRef.current.innerHTML });
    }
  }, [page, onChange]);

  // Insert HTML at cursor
  const insertHTML = useCallback((html) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand('insertHTML', false, html);
      onChange({ ...page, content: editorRef.current.innerHTML });
    }
  }, [page, onChange]);

  // Handle link insertion
  const insertLink = () => {
    if (linkUrl) {
      execCommand('createLink', linkUrl);
      setLinkUrl('');
      setShowLinkInput(false);
    }
  };

  // Handle editor content change
  const handleEditorChange = () => {
    if (editorRef.current) {
      onChange({ ...page, content: editorRef.current.innerHTML });
    }
  };

  // Handle source code change
  const handleSourceChange = (e) => {
    onChange({ ...page, content: e.target.value });
  };

  // Toolbar button component
  const ToolbarButton = ({ icon: Icon, onClick, title, active }) => (
    <Button
      type="button"
      variant={active ? "secondary" : "ghost"}
      size="sm"
      onClick={onClick}
      title={title}
      className="h-8 w-8 p-0"
    >
      <Icon className="w-4 h-4" />
    </Button>
  );

  return (
    <div className="space-y-4">
      {/* Page Meta */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label className="text-xs">Titel</Label>
          <Input 
            value={page.title} 
            onChange={(e) => onChange({...page, title: e.target.value})} 
            className="mt-1" 
            placeholder="Seitentitel"
          />
        </div>
        <div>
          <Label className="text-xs">URL-Slug</Label>
          <Input 
            value={page.slug} 
            onChange={(e) => onChange({...page, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-')})} 
            className="mt-1" 
            placeholder="url-slug"
          />
        </div>
        <div>
          <Label className="text-xs">Status</Label>
          <Select value={page.status} onValueChange={(v) => onChange({...page, status: v})}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Entwurf</SelectItem>
              <SelectItem value="live">Live</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label className="text-xs">Hero-Bild URL (optional)</Label>
          <Input 
            value={page.heroImage || ''} 
            onChange={(e) => onChange({...page, heroImage: e.target.value})} 
            className="mt-1" 
            placeholder="https://..."
          />
        </div>
        <div>
          <Label className="text-xs">Meta-Beschreibung (SEO)</Label>
          <Input 
            value={page.metaDescription || ''} 
            onChange={(e) => onChange({...page, metaDescription: e.target.value})} 
            className="mt-1" 
            placeholder="Kurze Beschreibung für Suchmaschinen"
          />
        </div>
      </div>

      {/* Editor Toolbar */}
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-secondary p-2 border-b flex flex-wrap items-center gap-1">
          {/* View Mode Toggle */}
          <div className="flex items-center border-r pr-2 mr-2">
            <Button
              type="button"
              variant={viewMode === 'visual' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('visual')}
              className="h-8 text-xs"
            >
              <Eye className="w-4 h-4 mr-1" /> Visuell
            </Button>
            <Button
              type="button"
              variant={viewMode === 'source' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('source')}
              className="h-8 text-xs"
            >
              <Code className="w-4 h-4 mr-1" /> Quellcode
            </Button>
          </div>

          {viewMode === 'visual' && (
            <>
              {/* Text Formatting */}
              <div className="flex items-center gap-0.5 border-r pr-2 mr-2">
                <ToolbarButton icon={Bold} onClick={() => execCommand('bold')} title="Fett (Ctrl+B)" />
                <ToolbarButton icon={Italic} onClick={() => execCommand('italic')} title="Kursiv (Ctrl+I)" />
              </div>

              {/* Headings */}
              <div className="flex items-center gap-0.5 border-r pr-2 mr-2">
                <ToolbarButton icon={Heading1} onClick={() => execCommand('formatBlock', 'h1')} title="Überschrift 1" />
                <ToolbarButton icon={Heading2} onClick={() => execCommand('formatBlock', 'h2')} title="Überschrift 2" />
                <ToolbarButton icon={Heading3} onClick={() => execCommand('formatBlock', 'h3')} title="Überschrift 3" />
                <ToolbarButton icon={Type} onClick={() => execCommand('formatBlock', 'p')} title="Absatz" />
              </div>

              {/* Lists */}
              <div className="flex items-center gap-0.5 border-r pr-2 mr-2">
                <ToolbarButton icon={List} onClick={() => execCommand('insertUnorderedList')} title="Aufzählung" />
                <ToolbarButton icon={ListOrdered} onClick={() => execCommand('insertOrderedList')} title="Nummerierung" />
                <ToolbarButton icon={Quote} onClick={() => execCommand('formatBlock', 'blockquote')} title="Zitat" />
              </div>

              {/* Alignment */}
              <div className="flex items-center gap-0.5 border-r pr-2 mr-2">
                <ToolbarButton icon={AlignLeft} onClick={() => execCommand('justifyLeft')} title="Linksbündig" />
                <ToolbarButton icon={AlignCenter} onClick={() => execCommand('justifyCenter')} title="Zentriert" />
                <ToolbarButton icon={AlignRight} onClick={() => execCommand('justifyRight')} title="Rechtsbündig" />
              </div>

              {/* Link */}
              <div className="flex items-center gap-1">
                {showLinkInput ? (
                  <div className="flex items-center gap-1">
                    <Input
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      placeholder="https://..."
                      className="h-8 w-40 text-xs"
                      onKeyDown={(e) => e.key === 'Enter' && insertLink()}
                    />
                    <Button type="button" size="sm" onClick={insertLink} className="h-8">
                      <Check className="w-3 h-3" />
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => setShowLinkInput(false)} className="h-8">
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ) : (
                  <ToolbarButton icon={LinkIcon} onClick={() => setShowLinkInput(true)} title="Link einfügen" />
                )}
              </div>
            </>
          )}
        </div>

        {/* Editor Content */}
        {viewMode === 'visual' ? (
          <div
            ref={editorRef}
            contentEditable
            className="min-h-[300px] p-4 focus:outline-none prose prose-neutral dark:prose-invert max-w-none
              prose-headings:text-foreground prose-headings:font-semibold
              prose-p:text-foreground prose-p:leading-relaxed
              prose-a:text-primary prose-a:underline
              prose-strong:text-foreground
              prose-ul:text-foreground prose-ol:text-foreground
              prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground"
            onInput={handleEditorChange}
            dangerouslySetInnerHTML={{ __html: formatForVisual(page.content) }}
          />
        ) : (
          <Textarea
            value={page.content || ''}
            onChange={handleSourceChange}
            className="min-h-[300px] border-0 rounded-none font-mono text-sm resize-none focus-visible:ring-0"
            placeholder="<p>HTML-Inhalt hier eingeben...</p>"
          />
        )}
      </div>

      {/* Preview Link */}
      {page.slug && page.status === 'live' && (
        <p className="text-xs text-muted-foreground">
          Vorschau: <a href={`/${page.slug}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">/{page.slug}</a>
        </p>
      )}

      {/* Actions */}
      <DialogFooter className="gap-2">
        <Button variant="outline" onClick={onCancel}>Abbrechen</Button>
        <Button onClick={onSave}>
          <Save className="w-4 h-4 mr-1" /> Speichern
        </Button>
      </DialogFooter>
    </div>
  );
}
