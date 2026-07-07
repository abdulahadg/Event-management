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

  // Load from Local Storage on mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = () => {
    const storedConsultations = JSON.parse(localStorage.getItem('aura_consultation_requests') || '[]');
    const storedInquiries = JSON.parse(localStorage.getItem('aura_custom_inquiries') || '[]');
    const storedRegistrations = JSON.parse(localStorage.getItem('aura_event_registrations') || '[]');

    setConsultations(storedConsultations);
    setInquiries(storedInquiries);
    setRegistrations(storedRegistrations);
  };

  // Login Validator
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.toLowerCase() === 'aura2026' || passcode === '') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Invalid Administrator Passcode. Please try "aura2026" or leave blank for demo access.');
    }
  };

  // Seed sample mock data so the workspace is beautifully populated
  const seedMockData = () => {
    const mockConsultations = [
      {
        id: 'CON-884021',
        eventType: 'corporate-events',
        preselectedPackage: 'Monarch Global',
        guestCount: 250,
        destination: 'London, UK (Mayfair Studio)',
        eventDate: '2026-10-15',
        clientName: 'Lord Alistair Sterling',
        clientEmail: 'a.sterling@sterlinginvestments.co.uk',
        clientPhone: '+44 7700 900077',
        specialRequests: 'Requires complete NDA package, bespoke kinetic stage arrays, and direct Michelin chef partnerships for late dining.',
        estimate: '£15,000',
        rawEstimate: 15000,
        status: 'VIP Contacted',
        timestamp: new Date(Date.now() - 4 * 3600000).toISOString()
      },
      {
        id: 'CON-921448',
        eventType: 'weddings',
        preselectedPackage: 'Elite Soiree',
        guestCount: 180,
        destination: 'Amalfi Coast, Italy',
        eventDate: '2027-06-20',
        clientName: 'Lady Georgina Cavendish',
        clientEmail: 'georgina.c@cavendish-estates.com',
        clientPhone: '+39 333 4567890',
        specialRequests: 'Exclusive glass cliffside marquee setup, private speedboat docking coordinates, and 432Hz string orchestra acoustics.',
        estimate: '£22,000',
        rawEstimate: 22000,
        status: 'Acknowledged',
        timestamp: new Date(Date.now() - 24 * 3600000).toISOString()
      },
      {
        id: 'CON-301984',
        eventType: 'product-launches',
        preselectedPackage: '',
        guestCount: 450,
        destination: 'New York, USA',
        eventDate: '2026-11-05',
        clientName: 'Julian Finch (VP of Brand)',
        clientEmail: 'j.finch@vanguardmedia.com',
        clientPhone: '+1 (212) 555-0199',
        specialRequests: 'Dynamic holographic projections over central stage. Sustainable zero-foam modular backdrop structures.',
        estimate: '£24,600',
        rawEstimate: 24600,
        status: 'Pending',
        timestamp: new Date(Date.now() - 48 * 3600000).toISOString()
      }
    ];

    const mockInquiries = [
      {
        name: 'Baroness Elspeth Sinclair',
        email: 'e.sinclair@sinclaircharities.org',
        notes: 'Interested in the Heritage Castle wedding setup guides. Desires historical castle structural protection guidelines.',
        guestsCount: '200',
        company: 'Sinclair Family Foundation',
        itemId: 'weddings',
        viewType: 'service',
        category: 'Luxury Weddings',
        status: 'Pending',
        timestamp: new Date(Date.now() - 8 * 3600000).toISOString()
      },
      {
        name: 'Markus Zhao',
        email: 'markus@apex-tech.sg',
        notes: 'Requesting carbon-neutral stage details and offset logs for our 2026 tech summit.',
        guestsCount: '600',
        company: 'Apex Tech Asia',
        itemId: 'product-launches',
        viewType: 'service',
        category: 'Product Launches',
        status: 'Acknowledged',
        timestamp: new Date(Date.now() - 36 * 3600000).toISOString()
      }
    ];

    const mockRegistrations = [
      {
        name: 'H.R.H. Prince Charles of Monaco',
        email: 'royalconcierge@palais.mc',
        notes: 'Sovereign security protocol requested. 4-person delegation.',
        guestsCount: '4',
        company: 'Palais Princier de Monaco',
        ticketType: 'royal-box',
        eventId: 'ev-wedding-masterclass',
        eventTitle: 'AURA Royal Wedding Masterclass (Mayfair HQ)',
        status: 'Acknowledged',
        timestamp: new Date(Date.now() - 12 * 3600000).toISOString()
      },
      {
        name: 'Demetrius Vance',
        email: 'd.vance@vanceholdings.com',
        notes: 'VIP Access requested.',
        guestsCount: '2',
        company: 'Vance International',
        ticketType: 'vip',
        eventId: 'ev-sustainable-galas',
        eventTitle: 'Sustainable Staging: The Carbon-Neutral Gala Roundtable',
        status: 'Pending',
        timestamp: new Date(Date.now() - 72 * 3600000).toISOString()
      }
    ];

    localStorage.setItem('aura_consultation_requests', JSON.stringify(mockConsultations));
    localStorage.setItem('aura_custom_inquiries', JSON.stringify(mockInquiries));
    localStorage.setItem('aura_event_registrations', JSON.stringify(mockRegistrations));

    loadAllData();
  };

  // Clear all data
  const clearAllData = () => {
    setConfirmModal({
      title: 'Purge Mayfair Registers',
      message: 'Are you absolutely sure you want to purge all client records from local registers? This is irreversible.',
      actionLabel: 'Purge Registers',
      onConfirm: () => {
        localStorage.removeItem('aura_consultation_requests');
        localStorage.removeItem('aura_custom_inquiries');
        localStorage.removeItem('aura_event_registrations');
        loadAllData();
        setConfirmModal(null);
      }
    });
  };

  // Status Modifiers
  const updateStatus = (index: number, tabType: 'consultations' | 'inquiries' | 'registrations', newStatus: string) => {
    if (tabType === 'consultations') {
      const updated = [...consultations];
      updated[index].status = newStatus;
      setConsultations(updated);
      localStorage.setItem('aura_consultation_requests', JSON.stringify(updated));
    } else if (tabType === 'inquiries') {
      const updated = [...inquiries];
      updated[index].status = newStatus;
      setInquiries(updated);
      localStorage.setItem('aura_custom_inquiries', JSON.stringify(updated));
    } else if (tabType === 'registrations') {
      const updated = [...registrations];
      updated[index].status = newStatus;
      setRegistrations(updated);
      localStorage.setItem('aura_event_registrations', JSON.stringify(updated));
    }
  };

  // Delete Individual Entry
  const deleteEntry = (index: number, tabType: 'consultations' | 'inquiries' | 'registrations') => {
    setConfirmModal({
      title: 'Delete Client Record',
      message: 'Are you sure you want to delete this client record? This action cannot be undone.',
      actionLabel: 'Delete Record',
      onConfirm: () => {
        if (tabType === 'consultations') {
          const updated = consultations.filter((_, idx) => idx !== index);
          setConsultations(updated);
          localStorage.setItem('aura_consultation_requests', JSON.stringify(updated));
        } else if (tabType === 'inquiries') {
          const updated = inquiries.filter((_, idx) => idx !== index);
          setInquiries(updated);
          localStorage.setItem('aura_custom_inquiries', JSON.stringify(updated));
        } else if (tabType === 'registrations') {
          const updated = registrations.filter((_, idx) => idx !== index);
          setRegistrations(updated);
          localStorage.setItem('aura_event_registrations', JSON.stringify(updated));
        }
        setConfirmModal(null);
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
                              onChange={(e) => updateStatus(index, 'consultations', e.target.value)}
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
                            onClick={() => deleteEntry(index, 'consultations')}
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
                              onChange={(e) => updateStatus(index, 'inquiries', e.target.value)}
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
                            onClick={() => deleteEntry(index, 'inquiries')}
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
                              onChange={(e) => updateStatus(index, 'registrations', e.target.value)}
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
                            onClick={() => deleteEntry(index, 'registrations')}
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
