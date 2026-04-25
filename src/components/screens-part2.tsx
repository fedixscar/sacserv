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
   LOYALTY COIN ICON
   ═══════════════════════════════════════════ */
const LoyaltyCoinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="140" height="140" viewBox="0 0 400 400" className="mx-auto drop-shadow-2xl">
    <title>Sacré Cœur - Pièce Fidélité</title>
    <defs>
      <radialGradient id="faceGrad" cx="38%" cy="32%" r="65%">
        <stop offset="0%" stopColor="#FFFBE8"/>
        <stop offset="18%" stopColor="#FFD700"/>
        <stop offset="42%" stopColor="#C8960C"/>
        <stop offset="72%" stopColor="#A07010"/>
        <stop offset="100%" stopColor="#6B4600"/>
      </radialGradient>
      <radialGradient id="rimGrad" cx="50%" cy="50%" r="50%">
        <stop offset="60%" stopColor="#8A6200"/>
        <stop offset="85%" stopColor="#5A3E00"/>
        <stop offset="100%" stopColor="#2E1E00"/>
      </radialGradient>
      <radialGradient id="innerGrad" cx="40%" cy="36%" r="56%">
        <stop offset="0%" stopColor="#FFF5C0"/>
        <stop offset="28%" stopColor="#EDB800"/>
        <stop offset="60%" stopColor="#B88800"/>
        <stop offset="100%" stopColor="#7A5600"/>
      </radialGradient>
      <radialGradient id="reliefLight" cx="30%" cy="28%" r="50%">
        <stop offset="0%" stopColor="#FFFDE0" stopOpacity="0.9"/>
        <stop offset="100%" stopColor="#C89000" stopOpacity="0"/>
      </radialGradient>
      <filter id="ds">
        <feDropShadow dx="4" dy="10" stdDeviation="14" floodColor="#2E1400" floodOpacity="0.65"/>
      </filter>
      <clipPath id="cc">
        <circle cx="200" cy="200" r="141"/>
      </clipPath>
    </defs>

    {/* Shadow */}
    <circle cx="202" cy="208" r="164" fill="#1E0E00" filter="url(#ds)"/>

    {/* Rim layers */}
    <circle cx="200" cy="200" r="164" fill="url(#rimGrad)"/>
    <circle cx="200" cy="200" r="160" fill="#6B4800"/>
    <circle cx="200" cy="200" r="156" fill="#8A6200"/>
    <circle cx="200" cy="200" r="152" fill="#C09000"/>
    <circle cx="200" cy="200" r="148" fill="#A07800"/>
    <circle cx="200" cy="200" r="143" fill="url(#faceGrad)"/>
    <circle cx="200" cy="200" r="143" fill="url(#reliefLight)"/>

    {/* Decorative rings */}
    <circle cx="200" cy="200" r="141" fill="none" stroke="#7A5600" strokeWidth="0.8"/>
    <circle cx="200" cy="200" r="138" fill="none" stroke="#FFE070" strokeWidth="0.5" opacity="0.5"/>
    <circle cx="200" cy="200" r="135" fill="none" stroke="#8A6400" strokeWidth="0.6"/>
    <circle cx="200" cy="200" r="130" fill="url(#innerGrad)"/>

    {/* Logo clipped */}
    <g clipPath="url(#cc)">

      {/* C letter — multi-layer bevel */}
      <path d="M 208 98 C 148 98 98 146 98 200 C 98 254 148 302 208 302"
        fill="none" stroke="#3A2A10" strokeWidth="38" strokeLinecap="round"/>
      <path d="M 208 98 C 148 98 98 146 98 200 C 98 254 148 302 208 302"
        fill="none" stroke="#4A5C2A" strokeWidth="32" strokeLinecap="round"/>
      <path d="M 208 98 C 148 98 98 146 98 200 C 98 254 148 302 208 302"
        fill="none" stroke="#3A5020" strokeWidth="26" strokeLinecap="round"/>
      <path d="M 208 98 C 148 98 98 146 98 200 C 98 254 148 302 208 302"
        fill="none" stroke="#2A3E16" strokeWidth="20" strokeLinecap="round"/>
      <path d="M 208 98 C 148 98 98 146 98 200 C 98 254 148 302 208 302"
        fill="none" stroke="#5E7C38" strokeWidth="13" strokeLinecap="round"/>
      <path d="M 208 98 C 148 98 98 146 98 200 C 98 254 148 302 208 302"
        fill="none" stroke="#486030" strokeWidth="7" strokeLinecap="round"/>
      <path d="M 208 98 C 148 98 98 146 98 200 C 98 254 148 302 208 302"
        fill="none" stroke="#8AB858" strokeWidth="3" strokeLinecap="round" opacity="0.55"/>

      {/* Heart shadow */}
      <path d="M 222 212 C 222 204 230 193 242 193 C 255 193 261 202 261 212 C 261 222 253 231 242 239 C 236 243 229 249 222 255 C 215 249 208 243 201 239 C 190 231 183 222 183 212 C 183 202 189 193 201 193 C 214 193 222 204 222 212 Z"
        fill="#5A2808"/>
      {/* Heart mid */}
      <path d="M 222 210 C 222 202 230 191 242 191 C 255 191 261 200 261 210 C 261 220 253 229 242 237 C 236 241 229 247 222 253 C 215 247 208 241 201 237 C 190 229 183 220 183 210 C 183 200 189 191 201 191 C 214 191 222 202 222 210 Z"
        fill="#7A3010"/>
      {/* Heart highlight fill */}
      <path d="M 222 210 C 222 202 230 191 242 191 C 255 191 261 200 261 210 C 261 220 253 229 242 237 C 236 241 229 247 222 253 C 215 247 208 241 201 237 C 190 229 183 220 183 210 C 183 200 189 191 201 191 C 214 191 222 202 222 210 Z"
        fill="#C06020" opacity="0.65"/>
      <path d="M 222 210 C 222 202 230 191 242 191 C 255 191 261 200 261 210 C 261 220 253 229 242 237 C 236 241 229 247 222 253 C 215 247 208 241 201 237 C 190 229 183 220 183 210 C 183 200 189 191 201 191 C 214 191 222 202 222 210 Z"
        fill="#E07828" opacity="0.3"/>
      {/* Heart top-left light catch */}
      <path d="M 210 199 C 214 194 222 191 230 193" fill="none" stroke="#F8A868" strokeWidth="2.5" strokeLinecap="round" opacity="0.75"/>
      <path d="M 210 199 C 214 194 222 191 230 193" fill="none" stroke="#FFFAF0" strokeWidth="1" strokeLinecap="round" opacity="0.4"/>

      {/* Steam left */}
      <path d="M 208 186 C 203 176 210 166 205 156 C 200 146 207 138 204 128"
        fill="none" stroke="#2A3E16" strokeWidth="7" strokeLinecap="round"/>
      <path d="M 208 186 C 203 176 210 166 205 156 C 200 146 207 138 204 128"
        fill="none" stroke="#4A6828" strokeWidth="4.5" strokeLinecap="round"/>
      <path d="M 208 186 C 203 176 210 166 205 156 C 200 146 207 138 204 128"
        fill="none" stroke="#8AB858" strokeWidth="2" strokeLinecap="round" opacity="0.55"/>
      <path d="M 208 186 C 203 176 210 166 205 156 C 200 146 207 138 204 128"
        fill="none" stroke="#FFFFF0" strokeWidth="0.7" strokeLinecap="round" opacity="0.3"/>

      {/* Steam middle */}
      <path d="M 222 180 C 217 170 224 160 219 150 C 214 140 221 132 218 122"
        fill="none" stroke="#2A3E16" strokeWidth="7" strokeLinecap="round"/>
      <path d="M 222 180 C 217 170 224 160 219 150 C 214 140 221 132 218 122"
        fill="none" stroke="#4A6828" strokeWidth="4.5" strokeLinecap="round"/>
      <path d="M 222 180 C 217 170 224 160 219 150 C 214 140 221 132 218 122"
        fill="none" stroke="#8AB858" strokeWidth="2" strokeLinecap="round" opacity="0.55"/>
      <path d="M 222 180 C 217 170 224 160 219 150 C 214 140 221 132 218 122"
        fill="none" stroke="#FFFFF0" strokeWidth="0.7" strokeLinecap="round" opacity="0.3"/>

      {/* Steam right */}
      <path d="M 237 183 C 232 173 239 163 234 153 C 229 143 236 135 233 125"
        fill="none" stroke="#2A3E16" strokeWidth="7" strokeLinecap="round"/>
      <path d="M 237 183 C 232 173 239 163 234 153 C 229 143 236 135 233 125"
        fill="none" stroke="#4A6828" strokeWidth="4.5" strokeLinecap="round"/>
      <path d="M 237 183 C 232 173 239 163 234 153 C 229 143 236 135 233 125"
        fill="none" stroke="#8AB858" strokeWidth="2" strokeLinecap="round" opacity="0.55"/>
      <path d="M 237 183 C 232 173 239 163 234 153 C 229 143 236 135 233 125"
        fill="none" stroke="#FFFFF0" strokeWidth="0.7" strokeLinecap="round" opacity="0.3"/>

    </g>

    {/* Top text arc: SACRÉ CŒUR */}
    <path id="topArc" d="M 70,200 A 130,130 0 0,1 330,200" fill="none"/>
    <text fontFamily="Georgia,'Times New Roman',serif" fontSize="16" fontWeight="700" letterSpacing="2">
      <textPath href="#topArc" startOffset="10%" fill="#3A2400">SACRÉ CŒUR</textPath>
    </text>
    <text fontFamily="Georgia,'Times New Roman',serif" fontSize="16" fontWeight="700" letterSpacing="2">
      <textPath href="#topArc" startOffset="10%" fill="#FFE580" opacity="0.5">SACRÉ CŒUR</textPath>
    </text>

    {/* Stars top */}
    <path id="starArcT" d="M 74,200 A 126,126 0 0,1 326,200" fill="none"/>
    <text fontFamily="Georgia,serif" fontSize="10" letterSpacing="3">
      <textPath href="#starArcT" startOffset="4%" fill="#8A6400" opacity="0.65">* * * * * * * * * * *</textPath>
    </text>

    {/* Bottom text arc: PROGRAMME FIDÉLITÉ */}
    <path id="botArc" d="M 70,200 A 130,130 0 0,0 330,200" fill="none"/>
    <text fontFamily="Georgia,'Times New Roman',serif" fontSize="12" fontWeight="700" letterSpacing="2">
      <textPath href="#botArc" startOffset="9%" fill="#3A2400">PROGRAMME FIDÉLITÉ</textPath>
    </text>
    <text fontFamily="Georgia,'Times New Roman',serif" fontSize="12" fontWeight="700" letterSpacing="2">
      <textPath href="#botArc" startOffset="9%" fill="#FFE580" opacity="0.5">PROGRAMME FIDÉLITÉ</textPath>
    </text>

    {/* Stars bottom */}
    <path id="starArcB" d="M 76,200 A 124,124 0 0,0 324,200" fill="none"/>
    <text fontFamily="Georgia,serif" fontSize="9" letterSpacing="2">
      <textPath href="#starArcB" startOffset="6%" fill="#8A6400" opacity="0.6">* * * * * * * * * * * * *</textPath>
    </text>

    {/* Glint top-left */}
    <ellipse cx="148" cy="128" rx="38" ry="14" fill="white" opacity="0.16" transform="rotate(-42 148 128)"/>
    <ellipse cx="140" cy="123" rx="15" ry="6" fill="white" opacity="0.28" transform="rotate(-42 140 123)"/>
  </svg>
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
        <div className="relative w-[140px] h-[140px] mx-auto">
          <div className="relative z-10">
            <LoyaltyCoinIcon />
          </div>
          
          {/* Shimmer Effect over the coin */}
          <div className="absolute inset-0 z-20 rounded-full overflow-hidden mix-blend-overlay pointer-events-none">
            <div className="w-[200%] h-full animate-[shimmer_2.5s_infinite]" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.7), rgba(255,255,255,0.9), transparent)' }} />
          </div>

          {/* Floating Stars around the coin */}
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, 15, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-2 -right-4 z-30"
          >
            <Star className="w-6 h-6 fill-amber-300 text-amber-200 drop-shadow-md" />
          </motion.div>
          <motion.div
            animate={{ y: [0, 10, 0], rotate: [0, -15, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute bottom-0 -left-2 z-30"
          >
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-300 drop-shadow-sm" />
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
          <p className="text-xs" style={{ color: '#5c5a3a' }}>Gagnez 10 points par ami invité !</p>
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
