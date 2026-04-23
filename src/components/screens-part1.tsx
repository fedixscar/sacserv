import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, MapPin } from 'lucide-react';
import { pageVariants, OptionButton, ToggleButton, ContinueButton, QuestionHeader } from './ui';
import { supabase } from '../lib/supabase';

/* ═══════════════════════════════════════════
   INTRO SCREEN
   ═══════════════════════════════════════════ */
export const IntroScreen: React.FC<{ onStart: () => void }> = ({ onStart }) => (
  <motion.div {...pageVariants} className="flex flex-col items-center justify-center min-h-[80dvh] px-6 text-center">
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="mb-8"
    >
      <span
        className="inline-block px-5 py-2 rounded-full text-xs font-bold uppercase tracking-[0.2em]"
        style={{ background: '#271310', color: '#fefccf' }}
      >
        SACRÉ CŒUR
      </span>
    </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: '2.5rem',
          fontWeight: 700,
          color: '#271310',
          lineHeight: 1.15,
          marginBottom: '1rem',
        }}
      >
        Votre avis<br />nous importe
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-base mb-12"
        style={{ color: '#5c5a3a' }}
      >
        2 minutes · Anonyme · Ça compte vraiment
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="w-full max-w-sm"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95, transition: { type: 'spring' as const, stiffness: 400, damping: 25 } }}
          onClick={onStart}
          className="w-full py-5 rounded-2xl text-base font-bold btn-primary-gradient shadow-xl cursor-pointer transition-all hover:shadow-2xl"
          style={{ color: '#fefccf' }}
        >
          Commencer le sondage →
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-16 animate-gentle-float"
      >
        <Coffee className="w-8 h-8" style={{ color: '#735c00' }} />
      </motion.div>
    </motion.div>
  );

/* ═══════════════════════════════════════════
   USER INFO SCREEN
   ═══════════════════════════════════════════ */
export const UserInfoScreen: React.FC<{
  name: string;
  email: string;
  onChangeName: (v: string) => void;
  onChangeEmail: (v: string) => void;
  onContinue: () => void;
}> = ({ name, email, onChangeName, onChangeEmail, onContinue }) => {
  const [isChecking, setIsChecking] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const DISPOSABLE_DOMAINS = [
    'yopmail.com', 'mailinator.com', '10minutemail.com', 'temp-mail.org', 
    'guerrillamail.com', 'sharklasers.com', 'dispostable.com', 'getnada.com',
    'mohmal.com', 'tempmail.com', 'maildrop.cc', 'teleworm.us', 'protonmail.ch'
  ];

  const isValidEmail = (e: string) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(e)) return false;
    
    const [user, domain] = e.split('@');
    const domainPart = domain.split('.')[0];

    // 1. Bloquer les domaines jetables connus
    if (DISPOSABLE_DOMAINS.includes(domain.toLowerCase())) return false;

    // 2. Bloquer les répétitions de caractères suspectes (ex: ffff, aaaaa)
    if (/(.)\1{3,}/.test(user) || /(.)\1{3,}/.test(domainPart)) return false;

    // 3. Bloquer les noms trop courts ou sans voyelles (souvent du spam/fake)
    if (user.length < 2 || domainPart.length < 3) return false;
    
    // 4. Détecter le "spam de clavier" simple (ex: asdf, fghj)
    const keyboardSpam = ['asdf', 'qwer', 'dfgh', 'fghj', 'jklm'];
    if (keyboardSpam.some(s => user.includes(s) || domainPart.includes(s))) return false;

    return true;
  };
  
  const isFormValid = name.trim().length > 0 && isValidEmail(email);

  const handleContinue = async () => {
    if (!isFormValid || isChecking) return;
    
    setIsChecking(true);
    setEmailError(null);
    
    try {
      const { data: existing, error } = await supabase
        .from('survey_responses')
        .select('id')
        .eq('email', email.toLowerCase().trim())
        .maybeSingle();
        
      if (error) throw error;
      
      if (existing) {
        setEmailError('Cet email a déjà été utilisé pour ce sondage.');
      } else {
        onContinue();
      }
    } catch (err: any) {
      console.error("Erreur de vérification de l'email:", err);
      // Si l'erreur est liée aux permissions (403/PGRST301), on laisse passer pour ne pas bloquer
      // l'utilisateur si le script SQL n'a pas encore été lancé.
      if (err.code === 'PGRST301' || err.status === 403) {
        onContinue();
      } else {
        setEmailError('Erreur de connexion. Veuillez réessayer.');
      }
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <motion.div {...pageVariants} className="px-6 py-8 pb-24">
      <h2
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: '1.75rem',
          fontWeight: 600,
          color: '#271310',
          marginBottom: '1.5rem',
        }}
      >
        Faisons connaissance
      </h2>
      <p className="text-sm mb-8" style={{ color: '#5c5a3a' }}>
        Avant de commencer, comment devons-nous vous appeler ?
      </p>

      <div className="flex flex-col gap-5 mb-10">
        <div>
          <label className="block text-sm font-bold mb-2" style={{ color: '#271310' }}>Votre nom ou pseudo</label>
          <input
            type="text"
            value={name}
            onChange={(e) => onChangeName(e.target.value)}
            placeholder="Fedi"
            className="w-full p-5 rounded-2xl text-base outline-none transition-all focus:ghost-border-gold"
            style={{
              background: '#efe9a0',
              color: '#271310',
              fontFamily: "'Inter', sans-serif",
              border: 'none',
              boxShadow: 'inset 0 0 0 1.5px rgba(29, 29, 3, 0.08)',
            }}
            onFocus={(e) => {
              e.target.style.background = '#faf7be';
              e.target.style.boxShadow = 'inset 0 0 0 1.5px rgba(115, 92, 0, 0.2)';
            }}
            onBlur={(e) => {
              e.target.style.background = '#efe9a0';
              e.target.style.boxShadow = 'inset 0 0 0 1.5px rgba(29, 29, 3, 0.08)';
            }}
          />
        </div>

        <div className="relative">
          <label className="block text-sm font-bold mb-2" style={{ color: '#271310' }}>Votre adresse email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => { onChangeEmail(e.target.value); setEmailError(null); }}
            placeholder="fedi@exemple.com"
            className="w-full p-5 rounded-2xl text-base outline-none transition-all focus:ghost-border-gold"
            style={{
              background: '#efe9a0',
              color: '#271310',
              fontFamily: "'Inter', sans-serif",
              border: 'none',
              boxShadow: 'inset 0 0 0 1.5px rgba(29, 29, 3, 0.08)',
            }}
            onFocus={(e) => {
              e.target.style.background = '#faf7be';
              e.target.style.boxShadow = 'inset 0 0 0 1.5px rgba(115, 92, 0, 0.2)';
            }}
            onBlur={(e) => {
              e.target.style.background = '#efe9a0';
              e.target.style.boxShadow = 'inset 0 0 0 1.5px rgba(29, 29, 3, 0.08)';
            }}
          />
          <AnimatePresence>
            {email.length > 0 && !isValidEmail(email) && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute -bottom-6 left-2 text-[11px] font-bold uppercase tracking-wider" 
                style={{ color: '#a30000' }}
              >
                Format d'email invalide
              </motion.p>
            )}
            {emailError && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute -bottom-6 left-2 text-[11px] font-bold uppercase tracking-wider" 
                style={{ color: '#a30000' }}
              >
                {emailError}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      <ContinueButton 
        onClick={handleContinue} 
        disabled={!isFormValid || isChecking} 
        label={isChecking ? 'Vérification...' : 'Continuer →'} 
      />
    </motion.div>
  );
};

/* ═══════════════════════════════════════════
   Q1 — Fréquence de visite (single, auto)
   ═══════════════════════════════════════════ */
const Q1_OPTIONS = [
  "C'est ma première fois",
  "De temps en temps (moins d'1 fois/mois)",
  "Assez régulièrement (1 à 3 fois/mois)",
  "Je suis un habitué (chaque semaine)",
  "Jamais visité le café",
];

export const Q1Screen: React.FC<{
  value: string | null;
  onSelect: (v: string) => void;
}> = ({ value, onSelect }) => (
  <motion.div {...pageVariants} className="px-6 py-8 pb-24">
    <QuestionHeader questionNum={1} title="À quelle fréquence venez-vous au Café Sacré Cœur ?" />
    <motion.div className="flex flex-col gap-3">
      {Q1_OPTIONS.map((opt) => (
        <OptionButton key={opt} label={opt} selected={value === opt} onClick={() => onSelect(opt)} />
      ))}
    </motion.div>
  </motion.div>
);

/* ═══════════════════════════════════════════
   Q2 — Raison de visite (multi, continue)
   ═══════════════════════════════════════════ */
const Q2_OPTIONS = [
  "Prendre un café / une boisson",
  "Travailler ou étudier",
  "Retrouver des amis",
  "Découvrir un endroit sympa",
  "Jouer à des jeux",
];

export const Q2Screen: React.FC<{
  values: string[];
  onToggle: (v: string) => void;
  onContinue: () => void;
}> = ({ values, onToggle, onContinue }) => (
  <motion.div {...pageVariants} className="px-6 py-8 pb-24">
    <QuestionHeader questionNum={2} title="Pourquoi venez-vous ici principalement ?" />
    <motion.div className="flex flex-col gap-3 mb-8">
      {Q2_OPTIONS.map((opt) => (
        <ToggleButton key={opt} label={opt} selected={values.includes(opt)} onClick={() => onToggle(opt)} />
      ))}
    </motion.div>
    <ContinueButton onClick={onContinue} disabled={values.length === 0} />
  </motion.div>
);

/* ═══════════════════════════════════════════
   LOCATION MAP SCREEN (Intermediary)
   ═══════════════════════════════════════════ */
export const LocationMapScreen: React.FC<{
  onContinue: () => void;
}> = ({ onContinue }) => (
  <motion.div {...pageVariants} className="px-6 py-8 pb-24 flex flex-col items-center">
    <h2
      style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: '1.75rem',
        fontWeight: 600,
        color: '#271310',
        marginBottom: '1rem',
        textAlign: 'center'
      }}
    >
      Découvrez-nous
    </h2>
    <p className="text-center text-sm mb-6" style={{ color: '#5c5a3a' }}>
      Puisque c'est votre première fois, voici où nous trouver et qui nous sommes :
    </p>

    <div className="bg-white/40 p-6 rounded-2xl w-full mb-6 text-center shadow-inner" style={{ border: '1px solid rgba(115, 92, 0, 0.15)' }}>
      <p className="italic text-sm leading-relaxed" style={{ color: '#271310' }}>
        "Un lieu unique au cœur d'El Menzah 6, où l'art du café rencontre une ambiance chaleureuse et artistique. Votre refuge urbain pour travailler, se détendre ou partager."
      </p>
    </div>

    <div className="w-full rounded-2xl overflow-hidden shadow-xl mb-6 relative h-64 border-2" style={{ borderColor: '#735c00' }}>
      <iframe
        src="https://maps.google.com/maps?q=Caf%C3%A9%20Sacr%C3%A9%20C%C5%93ur%2C%20Rue%20Y.%20Djait%2C%20Manzah%206%2C%20Ariana&t=&z=15&ie=UTF8&iwloc=&output=embed"
        width="100%"
        height="100%"
        style={{ border: 0, filter: 'sepia(80%) hue-rotate(5deg) saturate(150%) brightness(95%) contrast(90%)' }}
        allowFullScreen={false}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>

    <div className="bg-white/40 p-5 rounded-2xl w-full mb-8 text-center" style={{ border: '1px solid rgba(115, 92, 0, 0.2)' }}>
      <MapPin className="w-6 h-6 mx-auto mb-2" style={{ color: '#735c00' }} />
      <h3 className="font-bold mb-1" style={{ color: '#271310' }}>Café Sacré Cœur</h3>
      <p className="text-sm mb-4" style={{ color: '#5c5a3a' }}>
        Rue Y. Djait, El Menzah 6<br />Ariana, Tunisie
      </p>
      
      <a 
        href="https://www.instagram.com/sacrecoeur_cafe_resto/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-3 rounded-full text-sm font-bold transition-all hover:scale-105 shadow-md"
        style={{ background: '#271310', color: '#fefccf' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
        </svg>
        Suivez-nous sur Instagram
      </a>
    </div>

    <div className="w-full">
      <ContinueButton onClick={onContinue} label="Continuer le sondage →" />
    </div>
  </motion.div>
);
