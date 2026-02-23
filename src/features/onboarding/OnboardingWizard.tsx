import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboardingStore } from '@/store/onboardingStore';

// Components
import IdentityStep from './components/IdentityStep';
import AIPersonalityStep from './components/AIPersonalityStep';
import ServiceStep from './components/ServiceStep';

export const OnboardingWizard: React.FC = () => {
  const { step, setStep } = useOnboardingStore();

  const nextStep = () => setStep(step + 1);

  const renderStep = () => {
    switch (step) {
      case 1: return <IdentityStep onNext={nextStep} />;
      case 2: return <AIPersonalityStep onNext={nextStep} />;
      case 3: return <ServiceStep onNext={() => window.location.href = '/admin/dashboard'} />;
      default: return <IdentityStep onNext={nextStep} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white/80 backdrop-blur-xl border border-white shadow-2xl rounded-3xl overflow-hidden">
        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-gray-100">
          <motion.div 
            className="h-full bg-indigo-600"
            initial={{ width: '33.3%' }}
            animate={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default OnboardingWizard;
