import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, RefreshCw, ArrowLeft, Trash2, Clock, Globe, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface BlockedIP {
  id: string;
  ip_address: string;
  created_at: string;
}

export const FediPage: React.FC = () => {
  const [blockedIps, setBlockedIps] = useState<BlockedIP[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBlockedIps = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('blocked_ips')
      .select('*')
      .order('created_at', { ascending: false });
    setBlockedIps(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchBlockedIps();
  }, []);

  const handleUnblock = async (ip: string, id: string) => {
    if (confirm(`Voulez-vous vraiment débloquer l'IP ${ip} ?`)) {
      await supabase.from('blocked_ips').delete().eq('id', id);
      setBlockedIps((prev) => prev.filter((item) => item.id !== id));
      
      // Clear local storage too just in case it's the current user
      localStorage.removeItem('admin_blocked');
      localStorage.removeItem('admin_attempts');
    }
  };

  const resetAll = () => {
    localStorage.removeItem('admin_blocked');
    localStorage.removeItem('admin_attempts');
    alert('Vos restrictions locales ont été réinitialisées.');
  };

  return (
    <div className="min-h-screen bg-[#fefccf] text-[#271310] p-6 pb-20">
      <div className="max-w-4xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck size={20} className="text-[#735c00]" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#735c00]">Sécurité Système</span>
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif" }} className="text-4xl font-bold">
              Fedi Control Panel
            </h1>
          </div>

          <button
            onClick={resetAll}
            className="bg-[#271310] text-[#fefccf] px-6 py-3 rounded-2xl shadow-xl flex items-center gap-2 hover:scale-105 transition-transform"
          >
            <RefreshCw size={18} />
            Réinitialiser mes accès locaux
          </button>
        </header>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Adresses IP Bloquées</h2>
            <button onClick={fetchBlockedIps} className="p-2 rounded-full hover:bg-black/5">
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-[#735c00]" size={32} />
            </div>
          ) : blockedIps.length === 0 ? (
            <div className="text-center py-20 bg-black/5 rounded-[2.5rem] border-2 border-dashed border-black/10">
              <p className="text-[#8a8768]">Aucune IP bloquée pour le moment.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              <AnimatePresence>
                {blockedIps.map((ip) => (
                  <motion.div
                    key={ip.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-white/60 backdrop-blur-sm p-6 rounded-3xl border border-black/[0.03] flex items-center justify-between group hover:bg-white/80 transition-all shadow-sm"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center text-red-600">
                        <Globe size={24} />
                      </div>
                      <div>
                        <p className="font-black text-xl tracking-tight">{ip.ip_address}</p>
                        <div className="flex items-center gap-2 text-xs text-[#8a8768]">
                          <Clock size={12} />
                          Bloquée le {new Date(ip.created_at).toLocaleString('fr-FR')}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleUnblock(ip.ip_address, ip.id)}
                      className="p-4 rounded-2xl bg-black/5 text-red-600 hover:bg-red-600 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={20} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        <div className="mt-12 text-center">
          <a href="/" className="inline-flex items-center gap-2 text-sm font-bold text-[#8a8768] hover:text-[#271310] transition-colors">
            <ArrowLeft size={16} />
            Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  );
};
