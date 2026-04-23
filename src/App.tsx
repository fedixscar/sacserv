import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Coffee, Loader2 } from 'lucide-react';
import { STEPS, initialAnswers } from './types';
import type { SurveyAnswers } from './types';
import { ProgressBar } from './components/ui';
import { supabase } from './lib/supabase';
import {
  IntroScreen,
  Q1Screen,
  Q2Screen,
  UserInfoScreen,
  LocationMapScreen,
} from './components/screens-part1';
import {
  MatchingExplainScreen,
  Q3Screen,
  Q4Screen,
  Q5Screen,
  Q6Screen,
  Q7Screen,
  RatingScreen,
  CommentScreen,
  MerciScreen,
  DisinterestedScreen,
} from './components/screens-part2';
import { AdminDashboard } from './components/AdminDashboard';
import { FediPage } from './components/FediPage';
import { LoadingScreen } from './components/LoadingScreen';

const App: React.FC = () => {
  const path = window.location.pathname;
  const hash = window.location.hash;
  
  const [isAdmin] = useState(path === '/admin' || hash === '#admin');
  const [isFedi] = useState(path === '/fedi' || hash === '#fedi');
  
  const [stepIndex, setStepIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showDisinterested, setShowDisinterested] = useState(false);
  const [answers, setAnswers] = useState<SurveyAnswers>({ ...initialAnswers });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  // Capture referral ID from URL
  const queryParams = new URLSearchParams(window.location.search);
  let rawReferredBy = queryParams.get('ref');

  // Fallback si le paramètre s'est retrouvé dans le hash
  if (!rawReferredBy && window.location.hash.includes('ref=')) {
    const hashPart = window.location.hash.split('?')[1] || window.location.hash.substring(1);
    const hashParams = new URLSearchParams(hashPart);
    rawReferredBy = hashParams.get('ref');
  }

  // Nettoyage agressif pour enlever les espaces, slashs de fin, etc.
  const referredBy = rawReferredBy ? rawReferredBy.replace(/[^a-f0-9-]/gi, '') : null;

  /* ── Score Calculation ── */
  const calculateScore = (data: SurveyAnswers): number => {
    let positiveCount = 0;
    if (data.q3 && (data.q3.includes("J'adore") || data.q3.includes("Bonne idée"))) positiveCount++;
    if (data.q4 && (data.q4.includes("Oui") || data.q4.includes("Selon l'activité"))) positiveCount++;
    if (data.q5.length > 0) positiveCount++;
    if (data.q6.length > 0) positiveCount++;
    if (data.q7) positiveCount++;
    return Math.round((positiveCount / 5) * 100);
  };

  /* ── Handlers ── */
  const handleSubmit = async (overrideAnswers?: SurveyAnswers, forceScore?: number) => {
    const finalAnswers = overrideAnswers || answers;
    setIsSubmitting(true);
    try {
      // 1. Vérifier si l'email existe déjà
      const { data: existing, error: checkError } = await supabase
        .from('survey_responses')
        .select('id')
        .eq('email', finalAnswers.email.toLowerCase().trim())
        .maybeSingle();

      if (checkError) throw checkError;
      if (existing) {
        throw new Error('Cet email a déjà été utilisé pour ce sondage.');
      }

      const finalScore = typeof forceScore === 'number' ? forceScore : calculateScore(finalAnswers);
      
      // Valider que le referredBy est un UUID valide
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const validReferredBy = referredBy && uuidRegex.test(referredBy) ? referredBy : null;

      const { data, error } = await supabase
        .from('survey_responses')
        .insert([{ 
          ...finalAnswers, 
          email: finalAnswers.email.toLowerCase().trim(),
          score: finalScore,
          referred_by: validReferredBy 
        }])
        .select('id')
        .single();

      if (error) {
        console.error('Initial insert error:', error);
        // On vérifie si l'erreur est liée à une colonne manquante (42703)
        if (error.code === '42703') {
          throw new Error("La base de données n'est pas à jour. Veuillez contacter l'administrateur.");
        }
        throw error;
      }
      
      if (data) setSubmittedId(data.id);
      
      // On passe tout de suite à l'écran merci pour ne pas bloquer l'utilisateur
      // même si la suite (comptage parrainage) échoue.
      setStepIndex(STEPS.length - 1); 
      
      // Mettre à jour le compteur de parrainage du parrain
      if (validReferredBy) {
        try {
          const { data: referrerData } = await supabase
            .from('survey_responses')
            .select('referral_count')
            .eq('id', validReferredBy)
            .single();
            
          if (referrerData) {
            await supabase
              .from('survey_responses')
              .update({ referral_count: (referrerData.referral_count || 0) + 1 })
              .eq('id', validReferredBy);
          }
        } catch (updateErr) {
          console.error('Impossible de mettre à jour le compteur du parrain:', updateErr);
          // On ne bloque pas ici, l'utilisateur a déjà vu l'écran de succès
        }
      }
    } catch (err: any) {
      console.error('Submission failed details:', err);
      const msg = err.message || 'Erreur inconnue';
      alert(`Erreur d'envoi: ${msg}. Vérifiez la console pour plus de détails.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading && !isAdmin && !isFedi) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  if (showDisinterested) {
    return (
      <DisinterestedScreen 
        onFinish={(comment, newIdea) => {
          // Finish survey with score 0 and custom comments
          handleSubmit(
            {
              ...answers,
              comment: `Pas intéressé: ${comment}. Autre idée: ${newIdea}`
            }, 
            0 // forceScore: 0
          );
          setShowDisinterested(false);
        }} 
      />
    );
  }

  if (isAdmin) {
    return <AdminDashboard />;
  }

  if (isFedi) {
    return <FediPage />;
  }

  const nextStep = () => setStepIndex((prev) => Math.min(prev + 1, STEPS.length - 1));

  const currentStep = STEPS[stepIndex];
  
  // Adjusted index calculation to ignore intermediary non-question screens
  const getQuestionIndex = () => {
    if (stepIndex <= 2) return stepIndex - 2; // q1 is index 2 -> 0
    if (stepIndex <= 4) return 1; // location-map is 3, q2 is 4 -> both map to question index 1
    if (stepIndex <= 5) return 2; // matching-explain is 5
    return stepIndex - 4; // q3 is 6 -> 2, q4 is 7 -> 3, etc.
  };

  const currentQuestionIndex = getQuestionIndex();
  
  const showProgress = 
    stepIndex >= 2 && 
    stepIndex < STEPS.length - 1 && 
    currentStep !== 'location-map' && 
    currentStep !== 'matching-explain';

  const renderStep = () => {
    if (isSubmitting) {
      return (
        <div key="loading" className="flex-1 flex flex-col items-center justify-center min-h-[60dvh]">
          <Loader2 className="w-12 h-12 animate-spin mb-4" style={{ color: '#735c00' }} />
          <p className="text-sm font-medium" style={{ color: '#5c5a3a' }}>Envoi de vos réponses...</p>
        </div>
      );
    }

    switch (currentStep) {
      case 'intro': 
        return (
          <IntroScreen 
            key="intro" 
            onStart={nextStep} 
          />
        );
      case 'user-info':
        return (
          <UserInfoScreen
            key="user-info"
            name={answers.name}
            email={answers.email}
            onChangeName={(v) => setAnswers((p) => ({ ...p, name: v }))}
            onChangeEmail={(v) => setAnswers((p) => ({ ...p, email: v }))}
            onContinue={nextStep}
          />
        );
      case 'q1':
        return (
          <Q1Screen
            key="q1"
            value={answers.q1}
            onSelect={(v) => {
              setAnswers((p) => ({ ...p, q1: v }));
              setTimeout(() => {
                // Robust check for the "Jamais" option
                const isNever = v.toLowerCase().includes('jamais');
                if (!isNever) {
                  setStepIndex((prev) => prev + 2); // Skip location-map
                } else {
                  setStepIndex((prev) => prev + 1); // Go to location-map
                }
              }, 600);
            }}
          />
        );
      case 'location-map':
        return <LocationMapScreen key="location-map" onContinue={nextStep} />;
      case 'q2':
        return (
          <Q2Screen
            key="q2"
            values={answers.q2}
            onToggle={(v) => {
              setAnswers((p) => {
                const next = p.q2.includes(v) ? p.q2.filter((x) => x !== v) : [...p.q2, v];
                return { ...p, q2: next };
              });
            }}
            onContinue={nextStep}
          />
        );
      case 'matching-explain': return <MatchingExplainScreen key="explain" onContinue={nextStep} />;
      case 'q3':
        return (
          <Q3Screen
            key="q3"
            value={answers.q3}
            onSelect={(v) => {
              setAnswers((p) => ({ ...p, q3: v }));
              if (v === "Ça ne m'intéresse pas") {
                setShowDisinterested(true);
              } else {
                nextStep();
              }
            }}
          />
        );
      case 'q4':
        return (
          <Q4Screen
            key="q4"
            value={answers.q4}
            onSelect={(v) => {
              setAnswers((p) => ({ ...p, q4: v }));
              setTimeout(nextStep, 600);
            }}
          />
        );
      case 'q5':
        return (
          <Q5Screen
            key="q5"
            values={answers.q5}
            onToggle={(v) => {
              setAnswers((p) => {
                const next = p.q5.includes(v) ? p.q5.filter((x) => x !== v) : [...p.q5, v];
                return { ...p, q5: next };
              });
            }}
            onContinue={nextStep}
          />
        );
      case 'q6':
        return (
          <Q6Screen
            key="q6"
            values={answers.q6}
            onToggle={(v) => {
              setAnswers((p) => {
                const next = p.q6.includes(v) ? p.q6.filter((x) => x !== v) : [...p.q6, v];
                return { ...p, q6: next };
              });
            }}
            onContinue={nextStep}
          />
        );
      case 'q7':
        return (
          <Q7Screen
            key="q7"
            value={answers.q7}
            onSelect={(v) => {
              setAnswers((p) => ({ ...p, q7: v }));
              setTimeout(nextStep, 600);
            }}
          />
        );
      case 'rating':
        return (
          <RatingScreen
            key="rating"
            value={answers.rating}
            onSelect={(v) => {
              setAnswers((p) => ({ ...p, rating: v }));
              setTimeout(nextStep, 800);
            }}
          />
        );
      case 'comment':
        return (
          <CommentScreen
            key="comment"
            value={answers.comment}
            onChange={(v) => setAnswers((p) => ({ ...p, comment: v }))}
            onSkip={handleSubmit}
            onSubmit={handleSubmit}
          />
        );
      case 'merci':
        return <MerciScreen key="merci" userId={submittedId || ''} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: '#fefccf' }}>
      {currentStep !== 'intro' && currentStep !== 'merci' && !isSubmitting && (
        <div className="fixed top-0 left-0 right-0 z-50 glass-nav" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
          <div className="max-w-lg mx-auto px-6 py-3 flex items-center gap-3">
            <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-[0.15em]" style={{ color: '#271310' }}>
              <Coffee size={14} /> Sacré Cœur
            </span>
            {showProgress && (
              <div className="flex-1">
                <ProgressBar current={currentQuestionIndex + 1} total={7} />
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col max-w-lg mx-auto w-full" style={{ paddingTop: currentStep === 'intro' || currentStep === 'merci' || isSubmitting ? 0 : '3.5rem' }}>
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>

        {/* Footer Syntra */}
        <div className="mt-auto pb-6 pt-8 flex justify-center w-full">
          <div 
            className="flex items-center gap-1.5 text-[10px] font-bold tracking-[0.2em] uppercase" 
            style={{ color: '#8a8768' }}
          >
            <span className="opacity-60">Design by</span>
            <motion.span 
              animate={{ 
                opacity: [0.6, 1, 0.6],
                letterSpacing: ['0.2em', '0.25em', '0.2em']
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="font-black" 
              style={{ color: '#271310' }}
            >
              Syntra
            </motion.span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
