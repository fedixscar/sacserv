import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PenLine, Eye, Handshake, Star, Coffee } from 'lucide-react';
import { pageVariants, OptionButton, ToggleButton, ContinueButton, QuestionHeader } from './ui';
import confetti from 'canvas-confetti';
import { QRCodeSVG } from 'qrcode.react';

/* ═══════════════════════════════════════════
   MATCHING EXPLANATION SCREEN
   ═══════════════════════════════════════════ */
export const MatchingExplainScreen: React.FC<{ onContinue: () => void }> = ({ onContinue }) => (
  <motion.div {...pageVariants} className="px-6 py-8 pb-24">
    <h2
      style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: '1.5rem',
        fontWeight: 600,
        color: '#271310',
        marginBottom: '2rem',
        textAlign: 'center',
      }}
    >
      La fonctionnalité Matching —<br />comment ça marche ?
    </h2>

    <div className="flex flex-col gap-5 mb-10">
      {[
        { num: 1, icon: PenLine, text: 'Vous postez : "Je serai là à 18h pour jouer aux cartes"' },
        { num: 2, icon: Eye, text: 'D\'autres clients voient et cliquent "Je rejoins"' },
        { num: 3, icon: Handshake, text: 'À 18h, vous vous retrouvez tous au café' },
      ].map((step) => (
        <motion.div
          key={step.num}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 * step.num }}
          className="flex items-start gap-4 p-5 rounded-2xl"
          style={{ background: '#faf7be' }}
        >
          <span
            className="flex items-center justify-center w-9 h-9 rounded-full shrink-0 text-sm font-bold"
            style={{ background: '#271310', color: '#fefccf' }}
          >
            {step.num}
          </span>
          <div className="flex items-center gap-2">
            <step.icon className="w-5 h-5 shrink-0" style={{ color: '#735c00' }} />
            <span className="text-sm font-medium" style={{ color: '#271310' }}>{step.text}</span>
          </div>
        </motion.div>
      ))}
    </div>

    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95, transition: { type: 'spring' as const, stiffness: 400, damping: 25 } }}
      onClick={onContinue}
      className="w-full py-5 rounded-2xl text-base font-bold btn-primary-gradient shadow-lg cursor-pointer"
      style={{ color: '#fefccf' }}
    >
      J'ai compris, je donne mon avis →
    </motion.button>
  </motion.div>
);

/* ═══════════════════════════════════════════
   Q3 — Matching opinion (single, auto)
   ═══════════════════════════════════════════ */
const Q3_OPTIONS = [
  "J'adore, j'utiliserais ça souvent",
  "Bonne idée, je testerais",
  "Mitigé, j'ai des doutes",
  "Ça ne m'intéresse pas",
];

export const Q3Screen: React.FC<{
  value: string | null;
  onSelect: (v: string) => void;
}> = ({ value, onSelect }) => (
  <motion.div {...pageVariants} className="px-6 py-8 pb-24">
    <QuestionHeader questionNum={3} total={7} title="Cette idée de matching vous plaît-elle ?" />
    <motion.div className="flex flex-col gap-3">
      {Q3_OPTIONS.map((opt) => (
        <OptionButton key={opt} label={opt} selected={value === opt} onClick={() => onSelect(opt)} />
      ))}
    </motion.div>
  </motion.div>
);

/* ═══════════════════════════════════════════
   Q4 — Comfort with strangers (single, auto)
   ═══════════════════════════════════════════ */
const Q4_OPTIONS = [
  "Oui, c'est ce qui me plaît",
  "Selon l'activité proposée",
  "J'aurais besoin de voir les profils d'abord",
  "Non, je préfère venir avec mes amis",
];

export const Q4Screen: React.FC<{
  value: string | null;
  onSelect: (v: string) => void;
}> = ({ value, onSelect }) => (
  <motion.div {...pageVariants} className="px-6 py-8 pb-24">
    <QuestionHeader questionNum={4} total={7} title="Seriez-vous à l'aise de rejoindre des inconnus ?" />
    <motion.div className="flex flex-col gap-3">
      {Q4_OPTIONS.map((opt) => (
        <OptionButton key={opt} label={opt} selected={value === opt} onClick={() => onSelect(opt)} />
      ))}
    </motion.div>
  </motion.div>
);

/* ═══════════════════════════════════════════
   DISINTERESTED SCREEN (New)
   ═══════════════════════════════════════════ */
export const DisinterestedScreen: React.FC<{
  onFinish: (comment: string, newIdea: string) => void;
}> = ({ onFinish }) => {
  const [comment, setComment] = useState('');
  const [newIdea, setNewIdea] = useState('');

  return (
    <motion.div {...pageVariants} className="px-6 py-8 pb-24 flex flex-col min-h-[70dvh]">
      <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl font-bold mb-6 text-[#271310]">
        On comprend tout à fait.
      </h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold mb-2 opacity-70">Pourquoi cette idée ne vous séduit pas ?</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Dites-nous ce qui vous bloque..."
            className="w-full h-32 p-4 rounded-2xl bg-[#efe9a0] border-none outline-none focus:ring-2 focus:ring-[#735c00] transition-all resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-2 opacity-70">Avez-vous une autre idée pour le café ?</label>
          <textarea
            value={newIdea}
            onChange={(e) => setNewIdea(e.target.value)}
            placeholder="Une suggestion, une envie particulière..."
            className="w-full h-32 p-4 rounded-2xl bg-[#efe9a0] border-none outline-none focus:ring-2 focus:ring-[#735c00] transition-all resize-none"
          />
        </div>
      </div>

      <div className="mt-auto pt-8">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onFinish(comment, newIdea)}
          className="w-full py-5 rounded-2xl text-base font-bold btn-primary-gradient shadow-lg"
          style={{ color: '#fefccf' }}
        >
          Envoyer mon avis →
        </motion.button>
      </div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════
   Q5 — Activities (multi, continue)
   ═══════════════════════════════════════════ */
const Q5_OPTIONS = [
  "Jeux de société / cartes",
  "Travailler à plusieurs (coworking)",
  "Discuter d'un sujet précis",
  "Prendre un café rapide",
  "Rencontrer de nouvelles personnes",
];

export const Q5Screen: React.FC<{
  values: string[];
  onToggle: (v: string) => void;
  onContinue: () => void;
}> = ({ values, onToggle, onContinue }) => (
  <motion.div {...pageVariants} className="px-6 py-8 pb-24">
    <QuestionHeader questionNum={5} total={7} title="Pour quelles activités utiliseriez-vous le matching ?" />
    <motion.div className="flex flex-col gap-3 mb-8">
      {Q5_OPTIONS.map((opt) => (
        <ToggleButton key={opt} label={opt} selected={values.includes(opt)} onClick={() => onToggle(opt)} />
      ))}
    </motion.div>
    <ContinueButton onClick={onContinue} disabled={values.length === 0} />
  </motion.div>
);

/* ═══════════════════════════════════════════
   Q6 — Profile info (multi, continue)
   ═══════════════════════════════════════════ */
const Q6_OPTIONS = [
  "Prénom / Pseudo",
  "Centres d'intérêt",
  "Humeur du jour",
  "Boisson favorite",
];

export const Q6Screen: React.FC<{
  values: string[];
  onToggle: (v: string) => void;
  onContinue: () => void;
}> = ({ values, onToggle, onContinue }) => (
  <motion.div {...pageVariants} className="px-6 py-8 pb-24">
    <QuestionHeader questionNum={6} total={7} title="Quelles infos aimeriez-vous voir sur les profils ?" />
    <motion.div className="flex flex-col gap-3 mb-8">
      {Q6_OPTIONS.map((opt) => (
        <ToggleButton key={opt} label={opt} selected={values.includes(opt)} onClick={() => onToggle(opt)} />
      ))}
    </motion.div>
    <ContinueButton onClick={onContinue} disabled={values.length === 0} />
  </motion.div>
);

/* ═══════════════════════════════════════════
   Q7 — Create vs Join (single, auto)
   ═══════════════════════════════════════════ */
const Q7_OPTIONS = [
  "Créer mes propres annonces",
  "Seulement rejoindre les autres",
  "Les deux, selon l'envie",
];

export const Q7Screen: React.FC<{
  value: string | null;
  onSelect: (v: string) => void;
}> = ({ value, onSelect }) => (
  <motion.div {...pageVariants} className="px-6 py-8 pb-24">
    <QuestionHeader questionNum={7} total={7} title="Comment souhaiteriez-vous utiliser le système ?" />
    <motion.div className="flex flex-col gap-3">
      {Q7_OPTIONS.map((opt) => (
        <OptionButton key={opt} label={opt} selected={value === opt} onClick={() => onSelect(opt)} />
      ))}
    </motion.div>
  </motion.div>
);

/* ═══════════════════════════════════════════
   RATING SCREEN — 5 Stars
   ═══════════════════════════════════════════ */
export const RatingScreen: React.FC<{
  value: number;
  onSelect: (n: number) => void;
}> = ({ value, onSelect }) => {
  const [hovered, setHovered] = useState(0);

  return (
    <motion.div {...pageVariants} className="flex flex-col items-center justify-center min-h-[60dvh] px-6 text-center pb-24">
      <h2
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: '1.75rem',
          fontWeight: 600,
          color: '#271310',
          marginBottom: '2.5rem',
        }}
      >
        Notez votre expérience<br />générale au café
      </h2>

      <div className="flex items-center gap-3">
        {[1, 2, 3, 4, 5].map((starNum) => (
          <motion.button
            key={starNum}
            whileTap={{ scale: 0.8, transition: { type: 'spring' as const, stiffness: 400, damping: 10 } }}
            onMouseEnter={() => setHovered(starNum)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onSelect(starNum)}
            className="cursor-pointer p-0 border-0 bg-transparent"
            style={{ width: 56, height: 56 }}
          >
            <Star
              className={`w-12 h-12 transition-all duration-300 ${starNum <= (hovered || value) ? 'animate-star-pop' : ''}`}
              style={{
                color: '#735c00',
                fill: starNum <= (hovered || value) ? '#735c00' : 'transparent',
                strokeWidth: 1.5,
              }}
            />
          </motion.button>
        ))}
      </div>

      {value > 0 && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 text-base font-medium"
          style={{ color: '#735c00' }}
        >
          {value === 5 ? 'Excellent !' : value === 4 ? 'Très bien !' : value === 3 ? 'Correct' : value === 2 ? 'Peut mieux faire' : 'Décevant'}
        </motion.p>
      )}
    </motion.div>
  );
};

/* ═══════════════════════════════════════════
   COMMENT SCREEN (optional)
   ═══════════════════════════════════════════ */
export const CommentScreen: React.FC<{
  value: string;
  onChange: (v: string) => void;
  onSkip: () => void;
  onSubmit: () => void;
}> = ({ value, onChange, onSkip, onSubmit }) => (
  <motion.div {...pageVariants} className="px-6 py-8 pb-24">
    <h2
      style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: '1.5rem',
        fontWeight: 600,
        color: '#271310',
        marginBottom: '0.5rem',
      }}
    >
      Des idées ou améliorations ?
    </h2>
    <p className="text-sm mb-6" style={{ color: '#8a8768' }}>facultatif</p>

    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="J'aimerais beaucoup voir..."
      rows={4}
      className="w-full p-5 rounded-2xl text-base resize-none outline-none transition-all focus:ghost-border-gold"
      style={{
        background: '#efe9a0',
        color: '#271310',
        fontFamily: "'Inter', sans-serif",
        minHeight: 120,
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

    <div className="flex flex-col gap-4 mt-8">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95, transition: { type: 'spring' as const, stiffness: 400, damping: 25 } }}
        onClick={onSkip}
        className="w-full py-5 rounded-2xl text-base font-bold cursor-pointer transition-all"
        style={{ background: '#efe9a0', color: '#5c5a3a' }}
      >
        Envoyer sans commentaire
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95, transition: { type: 'spring' as const, stiffness: 400, damping: 25 } }}
        onClick={onSubmit}
        className="w-full py-5 rounded-2xl text-base font-bold btn-primary-gradient shadow-lg cursor-pointer"
        style={{ color: '#fefccf' }}
      >
        Envoyer mon commentaire →
      </motion.button>
    </div>
  </motion.div>
);

/* ═══════════════════════════════════════════
   THANK YOU SCREEN
   ═══════════════════════════════════════════ */
export const MerciScreen: React.FC<{ userId: string }> = ({ userId }) => {
  const [copied, setCopied] = useState(false);
  const referralLink = `https://scaresurv.netlify.app/?ref=${userId}`;

  useEffect(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div {...pageVariants} className="flex flex-col items-center justify-center min-h-[80dvh] px-6 text-center overflow-hidden pb-12">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.2 }}
        className="mb-8 relative"
      >
        <div className="relative">
          <Coffee className="w-16 h-16" style={{ color: '#735c00' }} />
          {/* Floating Stars */}
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, 15, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-4 -right-4"
          >
            <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
          </motion.div>
        </div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, type: 'spring' as const }}
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: '2.75rem',
          fontWeight: 800,
          color: '#271310',
          marginBottom: '1rem',
        }}
      >
        Félicitations !
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mb-8 px-8 py-6 rounded-3xl relative overflow-hidden w-full max-w-sm"
        style={{ background: 'linear-gradient(135deg, #735c00 0%, #271310 100%)', color: '#fefccf' }}
      >
        <p className="text-sm font-bold uppercase tracking-widest mb-2 opacity-80">Récompense Débloquée</p>
        <p className="text-xl font-black mb-1">10 Points Bonus</p>
        <p className="text-xs opacity-90 leading-relaxed">
          Merci pour votre temps ! Ces points seront crédités dès l'ouverture du site.
        </p>
      </motion.div>

      {/* Referral Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="w-full max-w-sm p-6 rounded-3xl mb-8 flex flex-col items-center gap-4 shadow-sm"
        style={{ background: '#faf7be', border: '1px solid rgba(115, 92, 0, 0.1)' }}
      >
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm font-bold uppercase tracking-widest" style={{ color: '#271310' }}>Parrainage</p>
          <p className="text-xs" style={{ color: '#5c5a3a' }}>Gagnez 5 points par ami invité !</p>
        </div>

        <div className="bg-white/50 p-2 rounded-xl border border-dashed border-gold/30 w-full flex items-center justify-center">
          <QRCodeSVG value={referralLink} size={100} fgColor="#271310" />
        </div>

        <button
          onClick={handleCopy}
          className="w-full py-4 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2"
          style={{ 
            background: copied ? '#4ade80' : '#271310', 
            color: copied ? '#064e3b' : '#fefccf' 
          }}
        >
          {copied ? 'Lien copié !' : 'Copier mon lien de parrainage'}
        </button>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="text-sm max-w-xs"
        style={{ color: '#5c5a3a', lineHeight: 1.6 }}
      >
        Vos réponses sont précieuses. À très bientôt au Café Sacré Cœur !
      </motion.p>
    </motion.div>
  );
};
