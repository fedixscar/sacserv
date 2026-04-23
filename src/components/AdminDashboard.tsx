import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Mail, Trophy, ArrowLeft, Loader2, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SurveyResponse {
  id: string;
  created_at: string;
  name: string;
  email: string;
  score: number;
}

export const AdminDashboard: React.FC = () => {
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [showCodeError, setShowCodeError] = useState(false);
  const [attempts, setAttempts] = useState(() => Number(localStorage.getItem('admin_attempts')) || 0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [userIp, setUserIp] = useState<string | null>(null);

  useEffect(() => {
    // Get current IP and check if blocked
    const checkStatus = async () => {
      try {
        const res = await fetch('https://api.ipify.org?format=json');
        const { ip } = await res.json();
        setUserIp(ip);

        const { data: blocked } = await supabase
          .from('blocked_ips')
          .select('id')
          .eq('ip_address', ip)
          .single();

        if (blocked || localStorage.getItem('admin_blocked') === 'true') {
          setIsBlocked(true);
        }
      } catch (err) {
        console.error('Error checking IP status:', err);
      }
    };
    checkStatus();
  }, []);

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code === '2026') {
      setIsAuthorized(true);
      setShowCodeError(false);
      setAttempts(0);
      localStorage.removeItem('admin_attempts');
    } else {
      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);
      localStorage.setItem('admin_attempts', String(nextAttempts));
      
      if (nextAttempts >= 3) {
        setIsBlocked(true);
        localStorage.setItem('admin_blocked', 'true');
        // Record IP in database
        if (userIp) {
          await supabase.from('blocked_ips').insert({ ip_address: userIp });
        }
      }
      
      setShowCodeError(true);
      setCode('');
    }
  };

  const fetchResponses = async () => {
    try {
      const { data, error } = await supabase
        .from('survey_responses')
        .select('id, created_at, name, email, score')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResponses(data || []);
    } catch (err: any) {
      console.error('Error fetching responses:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthorized) {
      fetchResponses();

      // Subscribe to real-time updates
      const channel = supabase
        .channel('survey-changes')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'survey_responses' },
          (payload) => {
            const newResponse = payload.new as SurveyResponse;
            setResponses((prev) => [newResponse, ...prev]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [isAuthorized]);

  if (isBlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#271310] px-6 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-red-600/10 backdrop-blur-md p-12 rounded-[3.5rem] border-2 border-red-600/30 shadow-[0_0_50px_rgba(220,38,38,0.2)]"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-24 h-24 bg-red-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(220,38,38,0.5)]"
          >
            <RefreshCw className="text-white" size={40} />
          </motion.div>
          <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl font-bold mb-4 text-white">Accès Révoqué</h2>
          <p className="text-red-200/80 mb-0 leading-relaxed text-lg">
            Votre adresse IP a été <span className="text-white font-black">bloquée définitivement</span> après 3 tentatives infructueuses.
          </p>
          <div className="mt-8 pt-8 border-t border-white/10">
            <p className="text-[10px] uppercase tracking-[0.3em] text-red-400 font-bold">Sécurité Système Syntra</p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fefccf] px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm bg-white/60 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl border border-black/[0.05] text-center"
        >
          <div className="w-16 h-16 bg-[#271310] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <RefreshCw className="text-[#fefccf]" size={28} />
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl font-bold mb-2">Accès Restreint</h2>
          <p className="text-sm text-[#8a8768] mb-8">Veuillez saisir le code d'accès administrateur.</p>
          
          <form onSubmit={handleCodeSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="password"
                value={code}
                onChange={(e) => { setCode(e.target.value); setShowCodeError(false); }}
                placeholder="Code d'accès"
                className="w-full p-5 rounded-2xl text-center text-2xl tracking-[0.5em] font-black outline-none transition-all bg-[#efe9a0] focus:bg-[#faf7be] border-none shadow-inner"
                autoFocus
              />
              <AnimatePresence>
                {showCodeError && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute -bottom-10 left-0 right-0"
                  >
                    <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest leading-tight">
                      Code incorrect ({attempts}/3)<br />
                      <span className="text-[9px] normal-case opacity-80">Attention : la 3ème fois votre IP sera bloquée</span>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button
              type="submit"
              className="w-full py-5 rounded-2xl text-base font-bold bg-[#271310] text-[#fefccf] shadow-xl hover:shadow-2xl transition-all active:scale-95"
            >
              Déverrouiller →
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fefccf]">
        <Loader2 className="w-12 h-12 animate-spin text-[#735c00]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fefccf] text-[#271310] p-6 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <a href="/" className="p-2 rounded-full hover:bg-black/5 transition-colors">
                <ArrowLeft size={20} className="text-[#735c00]" />
              </a>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#735c00]">Admin Panel</span>
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif" }} className="text-4xl font-bold">
              Résultats du Sondage
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-[#271310] text-[#fefccf] px-6 py-4 rounded-3xl shadow-xl flex items-center gap-4">
              <Users size={24} />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Total Utilisateurs</p>
                <p className="text-2xl font-black leading-none">{responses.length}</p>
              </div>
            </div>
          </div>
        </header>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-8 border border-red-100">
            {error}
          </div>
        )}

        {/* List */}
        <div className="space-y-4">
          {responses.length === 0 ? (
            <div className="text-center py-20 bg-black/5 rounded-3xl border-2 border-dashed border-black/10">
              <p className="text-[#8a8768]">Aucune réponse pour le moment.</p>
            </div>
          ) : (
            responses.map((resp, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                key={resp.id}
                className="bg-white/60 backdrop-blur-sm p-6 rounded-3xl shadow-sm border border-black/[0.03] flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:shadow-md transition-all hover:bg-white/80"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#efe9a0] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Users className="text-[#735c00]" size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{resp.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-[#8a8768]">
                      <Mail size={14} />
                      {resp.email}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-end">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#735c00] opacity-80 mb-1">Score</p>
                    <div className="flex items-center gap-1.5">
                      <Trophy size={16} className="text-[#735c00]" />
                      <span className="text-xl font-black">{resp.score}%</span>
                    </div>
                  </div>
                  <div className="h-10 w-px bg-black/10" />
                  <div className="flex flex-col items-end">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#8a8768] mb-1">Date</p>
                    <p className="text-xs font-medium">
                      {new Date(resp.created_at).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
      
      {/* Real-time Indicator */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#271310] text-[#fefccf] px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 shadow-2xl">
        <RefreshCw size={12} className="animate-spin" />
        Live Sync Active
      </div>
    </div>
  );
};
