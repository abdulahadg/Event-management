import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Lock,
  Eye,
  Trash2,
  CheckCircle2,
  Search,
  Filter,
  Download,
  Database,
  Users,
  Calendar,
  DollarSign,
  Compass,
  TrendingUp,
  Inbox,
  Sparkles,
  Award,
  Crown,
  FileSpreadsheet,
  LogOut,
  UserCheck
} from 'lucide-react';

interface AdminPanelProps {
  onBackToHome: () => void;
}

export default function AdminPanel({ onBackToHome }: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'consultations' | 'inquiries' | 'registrations'>('consultations');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [confirmModal, setConfirmModal] = useState<{
    title: string;
    message: string;
    actionLabel: string;
    onConfirm: () => void;
  } | null>(null);

  // Stored state lists
  const [consultations, setConsultations] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [registrations, setRegistrations] = useState<any[]>([]);

  // Load from database on mount
  useEffect(() => {
    const token = localStorage.getItem('aura_admin_token');
    if (token) {
      setIsAuthenticated(true);
      loadAllData(token);
    }
  }, []);

  const loadAllData = async (providedToken?: string) => {
    const token = providedToken || localStorage.getItem('aura_admin_token');
    if (!token) return;

    try {
      const headers = { 'Authorization': `Bearer ${token}` };

      const [resCon, resInq, resReg] = await Promise.all([
        fetch('/api/records/consultations', { headers }),
        fetch('/api/records/inquiries', { headers }),
        fetch('/api/records/registrations', { headers })
      ]);

      const conData = await resCon.json();
      const inqData = await resInq.json();
      const regData = await resReg.json();

      if (conData.success) setConsultations(conData.data);
      if (inqData.success) setInquiries(inqData.data);
      if (regData.success) setRegistrations(regData.data);
    } catch (err) {
      console.error('Failed to load secure registry registers:', err);
    }
  };

  // Login Validator (Authenticates on backend)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode })
      });
      const result = await response.json();
      if (response.ok && result.success) {
        localStorage.setItem('aura_admin_token', result.token);
        setIsAuthenticated(true);
        loadAllData(result.token);
      } else {
        setLoginError(result.message || 'Invalid passcode.');
      }
    } catch (err) {
      console.error('Admin authentication failure:', err);
      setLoginError('Could not verify credentials with security gateway.');
    }
  };

  // Log out Admin
  const handleLogout = () => {
    localStorage.removeItem('aura_admin_token');
    setIsAuthenticated(false);
    setPasscode('');
  };

  // Seed showcase data directly to the database via API requests
  const seedMockData = async () => {
    const token = localStorage.getItem('aura_admin_token');
    if (!token) return;

    const mockConsultations = [
      {
        clientName: 'Lord Alistair Sterling',
        clientEmail: 'a.sterling@sterlinginvestments.co.uk',
        clientPhone: '+44 7700 900077',
        eventType: 'corporate-events',
        preselectedPackage: 'Monarch Global',
        guestCount: 250,
        destination: 'London, UK (Mayfair Studio)',
        eventDate: '2026-10-15',
        specialRequests: 'Requires complete NDA package, bespoke kinetic stage arrays, and direct Michelin chef partnerships for late dining.',
        estimate: '£15,000',
        rawEstimate: 15000
      },
      {
        clientName: 'Lady Georgina Cavendish',
        clientEmail: 'georgina.c@cavendish-estates.com',
        clientPhone: '+39 333 4567890',
        eventType: 'weddings',
        preselectedPackage: 'Elite Soiree',
        guestCount: 180,
        destination: 'Amalfi Coast, Italy',
        eventDate: '2027-06-20',
        specialRequests: 'Exclusive glass cliffside marquee setup, private speedboat docking coordinates, and 432Hz string orchestra acoustics.',
        estimate: '£22,000',
        rawEstimate: 22000
      }
    ];

    const mockInquiries = [
      {
        name: 'Baroness Elspeth Sinclair',
        email: 'e.sinclair@sinclaircharities.org',
        phone: '+44 7700 900012',
        category: 'Heritage Castle Weddings',
        guestsCount: '200',
        company: 'Sinclair Family Foundation',
        details: 'Requesting historical castle structural protection guidelines.'
      }
    ];

    try {
      // Post all items
      for (const item of mockConsultations) {
        await fetch('/api/records/consultations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item)
        });
      }
      for (const item of mockInquiries) {
        await fetch('/api/records/inquiries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item)
        });
      }
      // Reload
      await loadAllData(token);
    } catch (err) {
      console.error('Failed to post seed data:', err);
    }
  };

  // Clear all data (Admin Purge)
  const clearAllData = () => {
    const token = localStorage.getItem('aura_admin_token');
    if (!token) return;

    setConfirmModal({
      title: 'Purge Mayfair Registers',
      message: 'Are you absolutely sure you want to purge all client records from local registers? This is irreversible.',
      actionLabel: 'Purge Registers',
      onConfirm: async () => {
        try {
          const response = await fetch('/api/records/purge', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (response.ok) {
            setConsultations([]);
            setInquiries([]);
            setRegistrations([]);
          }
        } catch (err) {
          console.error('Failed to purge registers:', err);
        } finally {
          setConfirmModal(null);
        }
      }
    });
  };

  // Status Modifiers
  const updateStatus = async (item: any, tabType: 'consultations' | 'inquiries' | 'registrations', newStatus: string) => {
    const token = localStorage.getItem('aura_admin_token');
    if (!token) return;

    const id = item._id || item.id;
    try {
      const response = await fetch(`/api/records/${tabType}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        await loadAllData(token);
      }
    } catch (err) {
      console.error('Failed to update record status:', err);
    }
  };

  // Delete Individual Entry
  const deleteEntry = (item: any, tabType: 'consultations' | 'inquiries' | 'registrations') => {
    const token = localStorage.getItem('aura_admin_token');
    if (!token) return;

    const id = item._id || item.id;
    setConfirmModal({
      title: 'Delete Client Record',
      message: 'Are you sure you want to delete this client record? This action cannot be undone.',
      actionLabel: 'Delete Record',
      onConfirm: async () => {
        try {
          const response = await fetch(`/api/records/${tabType}/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (response.ok) {
            await loadAllData(token);
          }
        } catch (err) {
          console.error('Failed to delete registry item:', err);
        } finally {
          setConfirmModal(null);
        }
      }
    });
  };

  // Export to JSON
  const handleExportData = () => {
    const fullBackup = {
      consultations,
      inquiries,
      registrations,
      exportedAt: new Date().toISOString()
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullBackup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `aura_registers_export_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Statistics Computations
  const getTotalsStats = () => {
    const totalConsultationValue = consultations.reduce((acc, curr) => acc + (curr.rawEstimate || 0), 0);
    const totalInquiries = inquiries.length;
    const totalRegistrations = registrations.reduce((acc, curr) => acc + Number(curr.guestsCount || 1), 0);

    return {
      pipelineValue: totalConsultationValue.toLocaleString('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }),
      consultationCount: consultations.length,
      inquiryCount: totalInquiries,
      attendeeCount: totalRegistrations
    };
  };

  const stats = getTotalsStats();

  // Filtering rules
  const filterList = (list: any[]) => {
    return list.filter(item => {
      // Search matches
      const searchStr = `${item.clientName || item.name || ''} ${item.clientEmail || item.email || ''} ${item.destination || item.eventTitle || item.category || ''}`.toLowerCase();
      const matchesSearch = searchStr.includes(searchQuery.toLowerCase());

      // Status Filter
      const itemStatus = item.status || 'Pending';
      const matchesStatus = statusFilter === 'All' || itemStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-[#FAFBFD] min-h-screen pt-24 pb-20 flex flex-col items-center justify-center text-left">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white p-8 rounded-[36px] border border-slate-100 shadow-xl"
        >
          <div className="text-center space-y-3 mb-8">
            <div className="w-16 h-16 rounded-full bg-[#0B1B2A] text-[#D4A737] flex items-center justify-center mx-auto shadow-md">
              <Lock className="w-8 h-8" />
            </div>
            <div>
              <span className="text-[#D4A737] text-[10px] font-bold tracking-[0.2em] uppercase block font-mono">
                AURA SECURITY ENCLOSURE
              </span>
              <h2 className="text-2xl font-serif font-light text-[#0B1B2A] mt-1">Administrator Portal</h2>
              <p className="text-xs text-slate-400 font-light max-w-xs mx-auto mt-1">
                Enter your secure administrative key to review global proposal briefs and event schedules.
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#0B1B2A] uppercase tracking-wider block">Administrative Passcode</label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder='Enter "aura2026" or leave blank'
                className="w-full p-3.5 rounded-2xl border border-slate-100 bg-slate-50 focus:outline-none focus:bg-white focus:border-[#D4A737] text-sm text-[#0B1B2A] placeholder-slate-400"
              />
              {loginError && (
                <p className="text-xs text-rose-500 font-medium leading-relaxed pt-1">{loginError}</p>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-[#0B1B2A] hover:bg-[#D4A737] text-white hover:text-[#0B1B2A] font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-md"
              >
                Access Secure Registers
              </button>
              
              <button
                type="button"
                onClick={onBackToHome}
                className="w-full py-3 rounded-2xl border border-slate-100 hover:bg-slate-50 text-slate-500 font-bold text-xs uppercase tracking-wider transition-all text-center"
              >
                Return to Website
              </button>
            </div>
          </form>

          <div className="border-t border-slate-100 mt-8 pt-6 text-center text-[10px] text-slate-400 font-mono">
            SYS LEVEL 2 // MAYFAIR LONDON HQ // STRICT AUDIT PROTOCOL
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFBFD] min-h-screen pt-24 pb-20">
      
      {/* Header Admin bar */}
      <div className="bg-white border-b border-slate-100 py-4 sticky top-16 z-30 shadow-xs text-left">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToHome}
              className="group flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-[#0B1B2A] uppercase tracking-wider transition-colors"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-[#D4A737]" />
              <span>Back to Site</span>
            </button>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-[#D4A737]" />
              <span className="text-xs font-bold text-[#0B1B2A] uppercase tracking-wider font-mono">AURA Central Registry</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={seedMockData}
              className="px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors font-mono"
            >
              Seed Showcase Data
            </button>
            <button
              onClick={handleExportData}
              className="p-2 bg-slate-50 text-slate-600 hover:text-[#0B1B2A] hover:bg-slate-100 rounded-xl transition-all flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest"
              title="Export Registers to JSON"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export JSON</span>
            </button>
            <button
              onClick={clearAllData}
              className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl transition-all flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest"
              title="Purge Registers"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Purge</span>
            </button>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="p-2 text-slate-400 hover:text-[#0B1B2A] rounded-xl transition-colors"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-10 text-left">
        
        {/* Dashboard Title & Overview Banner */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <span className="text-[#D4A737] text-xs font-bold tracking-[0.2em] uppercase block">
              SECURE REGISTRY CONTROL PANEL
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-light text-[#0B1B2A] tracking-tight">
              AURA Curation <span className="font-serif italic font-medium text-[#D4A737]">Executive Hub</span>
            </h1>
            <p className="text-xs text-slate-400">Review, organize, and authenticate custom luxury proposals from global outposts.</p>
          </div>

          <div className="flex gap-2 bg-white/80 p-1.5 rounded-2xl border border-slate-200/50 shadow-xs">
            {(['consultations', 'inquiries', 'registrations'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-[#0B1B2A] text-white shadow-sm'
                    : 'text-slate-500 hover:text-[#0B1B2A]'
                }`}
              >
                {tab === 'consultations' ? 'Consultations' : tab === 'inquiries' ? 'Blueprint Inquiries' : 'Event Admissions'}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5">
            <div className="p-4 rounded-2xl bg-[#0B1B2A] text-[#D4A737] shadow-sm">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Estimated Pipeline</span>
              <span className="text-2xl font-serif font-semibold text-[#0B1B2A] block">{stats.pipelineValue}</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5">
            <div className="p-4 rounded-2xl bg-[#0B1B2A] text-[#D4A737] shadow-sm">
              <Crown className="w-6 h-6" />
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Active Briefs</span>
              <span className="text-2xl font-serif font-semibold text-[#0B1B2A] block">{stats.consultationCount}</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5">
            <div className="p-4 rounded-2xl bg-[#0B1B2A] text-[#D4A737] shadow-sm">
              <Compass className="w-6 h-6" />
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Custom Inquiries</span>
              <span className="text-2xl font-serif font-semibold text-[#0B1B2A] block">{stats.inquiryCount}</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5">
            <div className="p-4 rounded-2xl bg-[#0B1B2A] text-[#D4A737] shadow-sm">
              <Users className="w-6 h-6" />
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Registered Guests</span>
              <span className="text-2xl font-serif font-semibold text-[#0B1B2A] block">{stats.attendeeCount} VIPs</span>
            </div>
          </div>
        </div>

        {/* Filters and search block */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by client name, email, event title..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 focus:bg-white border border-slate-100 rounded-2xl text-xs text-[#0B1B2A] focus:outline-none focus:border-[#D4A737]"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-500 mr-2 font-medium">Status Filter:</span>
            <div className="flex gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200/50">
              {['All', 'Pending', 'Acknowledged', 'VIP Contacted'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors ${
                    statusFilter === st
                      ? 'bg-[#0B1B2A] text-[#D4A737]'
                      : 'text-slate-500 hover:text-[#0B1B2A]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* TABULAR LAYOUT FOR CURRENT SELECTION */}
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
          
          {/* CONSULTATIONS LIST */}
          {activeTab === 'consultations' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                    <th className="py-5 px-8">Client / Liaison</th>
                    <th className="py-5 px-6">Occasion Style</th>
                    <th className="py-5 px-6">Logistics Coordinates</th>
                    <th className="py-5 px-6">Est. Investment</th>
                    <th className="py-5 px-6">Special Requests</th>
                    <th className="py-5 px-6">Status Gate</th>
                    <th className="py-5 px-8 text-right">Administrative</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-xs">
                  {filterList(consultations).length > 0 ? (
                    filterList(consultations).map((item, index) => (
                      <tr key={index} className="hover:bg-[#FAFBFD]/50 transition-colors">
                        <td className="py-5 px-8">
                          <div className="space-y-1">
                            <span className="font-semibold text-slate-800 block text-sm">{item.clientName}</span>
                            <span className="text-[10px] text-slate-400 block font-mono">{item.clientEmail}</span>
                            <span className="text-[10px] text-slate-400 block font-mono">{item.clientPhone}</span>
                          </div>
                        </td>
                        <td className="py-5 px-6">
                          <div className="space-y-1">
                            <span className="px-3 py-1 rounded-full bg-slate-100 text-[#0B1B2A] text-[10px] font-bold uppercase tracking-wide inline-block">
                              {item.eventType.replace('-', ' ')}
                            </span>
                            {item.preselectedPackage && (
                              <span className="text-[10px] text-[#D4A737] block font-semibold uppercase">{item.preselectedPackage}</span>
                            )}
                          </div>
                        </td>
                        <td className="py-5 px-6 text-slate-600">
                          <div className="space-y-1">
                            <span className="font-medium text-[#0B1B2A] block">{item.destination}</span>
                            <span className="block text-[10px] font-mono text-slate-400">
                              • Guest Scale: {item.guestCount} Guests
                            </span>
                            <span className="block text-[10px] font-mono text-slate-400">
                              • Target Date: {item.eventDate ? new Date(item.eventDate).toLocaleDateString('en-GB', { dateStyle: 'medium' }) : 'TBD'}
                            </span>
                          </div>
                        </td>
                        <td className="py-5 px-6 font-serif font-semibold text-[#D4A737] text-sm">
                          {item.estimate}
                        </td>
                        <td className="py-5 px-6 max-w-xs text-slate-500 font-light leading-relaxed truncate hover:text-clip hover:whitespace-normal" title={item.specialRequests}>
                          {item.specialRequests || 'No special requirements listed.'}
                        </td>
                        <td className="py-5 px-6">
                          <div className="flex flex-col gap-1.5">
                            <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider text-center inline-block w-fit ${
                              item.status === 'VIP Contacted'
                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                : item.status === 'Acknowledged'
                                ? 'bg-blue-50 text-blue-600 border border-blue-100'
                                : 'bg-amber-50 text-amber-600 border border-amber-100'
                            }`}>
                              {item.status || 'Pending'}
                            </span>

                            {/* Status controls */}
                            <select
                              value={item.status || 'Pending'}
                              onChange={(e) => updateStatus(item, 'consultations', e.target.value)}
                              className="text-[9px] font-bold uppercase tracking-wide bg-slate-50 border border-slate-100 rounded-lg p-1 text-slate-600 focus:outline-none focus:border-[#D4A737] cursor-pointer"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Acknowledged">Acknowledged</option>
                              <option value="VIP Contacted">VIP Contacted</option>
                            </select>
                          </div>
                        </td>
                        <td className="py-5 px-8 text-right">
                          <button
                            onClick={() => deleteEntry(item, 'consultations')}
                            className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-500 hover:text-rose-600 rounded-xl transition-all"
                            title="Delete Registry Item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-16 text-center text-slate-400 space-y-2">
                        <Inbox className="w-10 h-10 text-slate-300 mx-auto" />
                        <p className="text-xs">No active consultation proposals found matching queries.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* BLUEPRINT INQUIRIES LIST */}
          {activeTab === 'inquiries' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                    <th className="py-5 px-8">Client Name</th>
                    <th className="py-5 px-6">Firm / Organization</th>
                    <th className="py-5 px-6">Blueprint Section</th>
                    <th className="py-5 px-6">Client Directives & Vision</th>
                    <th className="py-5 px-6">Status Gate</th>
                    <th className="py-5 px-8 text-right">Administrative</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-xs">
                  {filterList(inquiries).length > 0 ? (
                    filterList(inquiries).map((item, index) => (
                      <tr key={index} className="hover:bg-[#FAFBFD]/50 transition-colors">
                        <td className="py-5 px-8">
                          <div className="space-y-1">
                            <span className="font-semibold text-slate-800 block text-sm">{item.name}</span>
                            <span className="text-[10px] text-slate-400 block font-mono">{item.email}</span>
                          </div>
                        </td>
                        <td className="py-5 px-6 text-slate-600 font-medium">
                          {item.company || 'Private Patron'}
                        </td>
                        <td className="py-5 px-6">
                          <div className="space-y-1">
                            <span className="px-3 py-1 rounded-full bg-slate-100 text-[#0B1B2A] text-[10px] font-bold uppercase tracking-wide inline-block">
                              {item.category}
                            </span>
                            <span className="text-[9px] text-slate-400 block font-mono">ID: {item.itemId.toUpperCase()}</span>
                          </div>
                        </td>
                        <td className="py-5 px-6 max-w-sm text-slate-500 font-light leading-relaxed truncate hover:text-clip hover:whitespace-normal" title={item.notes}>
                          {item.notes || 'No directives provided.'}
                        </td>
                        <td className="py-5 px-6">
                          <div className="flex flex-col gap-1.5">
                            <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider text-center inline-block w-fit ${
                              item.status === 'VIP Contacted'
                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                : item.status === 'Acknowledged'
                                ? 'bg-blue-50 text-blue-600 border border-blue-100'
                                : 'bg-amber-50 text-amber-600 border border-amber-100'
                            }`}>
                              {item.status || 'Pending'}
                            </span>
                            <select
                              value={item.status || 'Pending'}
                              onChange={(e) => updateStatus(item, 'inquiries', e.target.value)}
                              className="text-[9px] font-bold uppercase tracking-wide bg-slate-50 border border-slate-100 rounded-lg p-1 text-slate-600 focus:outline-none cursor-pointer"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Acknowledged">Acknowledged</option>
                              <option value="VIP Contacted">VIP Contacted</option>
                            </select>
                          </div>
                        </td>
                        <td className="py-5 px-8 text-right">
                          <button
                            onClick={() => deleteEntry(item, 'inquiries')}
                            className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-500 hover:text-rose-600 rounded-xl transition-all"
                            title="Delete Item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-16 text-center text-slate-400 space-y-2">
                        <Inbox className="w-10 h-10 text-slate-300 mx-auto" />
                        <p className="text-xs">No active custom inquiries found.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* EVENT ADMISSIONS */}
          {activeTab === 'registrations' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                    <th className="py-5 px-8">VIP Registrant</th>
                    <th className="py-5 px-6">Firm / Organization</th>
                    <th className="py-5 px-6">Target Seminar</th>
                    <th className="py-5 px-6">Pass Allocation</th>
                    <th className="py-5 px-6">Admissions Notes</th>
                    <th className="py-5 px-6">Status Gate</th>
                    <th className="py-5 px-8 text-right">Administrative</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-xs">
                  {filterList(registrations).length > 0 ? (
                    filterList(registrations).map((item, index) => (
                      <tr key={index} className="hover:bg-[#FAFBFD]/50 transition-colors">
                        <td className="py-5 px-8">
                          <div className="space-y-1">
                            <span className="font-semibold text-slate-800 block text-sm">{item.name}</span>
                            <span className="text-[10px] text-slate-400 block font-mono">{item.email}</span>
                          </div>
                        </td>
                        <td className="py-5 px-6 text-slate-600 font-medium">
                          {item.company || 'Private Patron'}
                        </td>
                        <td className="py-5 px-6">
                          <div className="space-y-1 max-w-xs">
                            <span className="font-serif font-semibold text-[#0B1B2A] block leading-snug">{item.eventTitle}</span>
                            <span className="text-[9px] text-slate-400 block font-mono">ID: {item.eventId.toUpperCase()}</span>
                          </div>
                        </td>
                        <td className="py-5 px-6">
                          <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest inline-block ${
                            item.ticketType === 'royal-box'
                              ? 'bg-purple-50 text-purple-600 border border-purple-100'
                              : item.ticketType === 'vip'
                              ? 'bg-[#D4A737]/15 text-[#D4A737] border border-[#D4A737]/30'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {item.ticketType.toUpperCase()} ({item.guestsCount} Seats)
                          </span>
                        </td>
                        <td className="py-5 px-6 text-slate-500 font-light max-w-xs truncate hover:text-clip hover:whitespace-normal">
                          {item.notes || 'No security/admissions notes.'}
                        </td>
                        <td className="py-5 px-6">
                          <div className="flex flex-col gap-1.5">
                            <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider text-center inline-block w-fit ${
                              item.status === 'VIP Contacted'
                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                : item.status === 'Acknowledged'
                                ? 'bg-blue-50 text-blue-600 border border-blue-100'
                                : 'bg-amber-50 text-amber-600 border border-amber-100'
                            }`}>
                              {item.status || 'Pending'}
                            </span>
                            <select
                              value={item.status || 'Pending'}
                              onChange={(e) => updateStatus(item, 'registrations', e.target.value)}
                              className="text-[9px] font-bold uppercase tracking-wide bg-slate-50 border border-slate-100 rounded-lg p-1 text-slate-600 focus:outline-none cursor-pointer"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Acknowledged">Acknowledged</option>
                              <option value="VIP Contacted">VIP Contacted</option>
                            </select>
                          </div>
                        </td>
                        <td className="py-5 px-8 text-right">
                          <button
                            onClick={() => deleteEntry(item, 'registrations')}
                            className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-500 hover:text-rose-600 rounded-xl transition-all"
                            title="Delete Registration"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-16 text-center text-slate-400 space-y-2">
                        <Inbox className="w-10 h-10 text-slate-300 mx-auto" />
                        <p className="text-xs">No active event admissions found.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

        </div>

      </div>

      {/* Custom Confirmation Modal Overlay */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070D14]/80 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-[32px] border border-slate-100 p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 text-left">
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#D4A737] uppercase tracking-widest font-mono block">SECURITY VERIFICATION</span>
              <h3 className="text-xl font-serif font-semibold text-[#0B1B2A]">{confirmModal.title}</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-light">{confirmModal.message}</p>
            </div>
            
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-100 hover:border-slate-200 text-slate-500 font-semibold text-xs uppercase tracking-wider transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmModal.onConfirm}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs uppercase tracking-wider transition-all shadow-md shadow-rose-600/10"
              >
                {confirmModal.actionLabel}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
