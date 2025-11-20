import React, { useState } from 'react';
import { ArrowRight, Clock, AlertTriangle, Sparkles } from 'lucide-react';
import { Button } from './Button';

interface IntroSequenceProps {
  onComplete: () => void;
}

export const IntroSequence: React.FC<IntroSequenceProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [exiting, setExiting] = useState(false);

  const slides = [
    {
      id: 1,
      icon: <Clock size={48} className="text-white" />,
      title: "The Auto-Renewal Trap",
      subtitle: "Miss a date, get locked in.",
      content: (
        <div className="space-y-4 text-gray-300">
          <p>
            Many B2B contracts include automatic renewal clauses. 
            Typical notice periods are <strong className="text-white">30–90 days</strong> before expiry.
          </p>
          <p>
            If you miss the notice date by even one day, you’re often locked into another full term on the same (or worse) terms, creating duplicate costs and compliance risks.
          </p>
        </div>
      )
    },
    {
      id: 2,
      icon: <AlertTriangle size={48} className="text-white" />,
      title: "The Deeper Problem",
      subtitle: "Not all renewals are equal.",
      content: (
        <div className="space-y-4 text-gray-300">
          <p>
            Current alerts are typically just date-based. They don't tell you if a renewal is 
            <strong className="text-sirion-lilac"> strategically risky</strong>.
          </p>
          <div className="bg-red-500/10 p-3 rounded-lg border border-red-500/20 text-sm text-red-200">
            Is the vendor underperforming? <br/>
            Are the terms outdated vs new regulations? <br/>
            Is the price uplift above market rate?
          </div>
          <p>
            Without this context, you can't prioritize which renewals need a fight and which can auto-renew.
          </p>
        </div>
      )
    },
    {
      id: 3,
      icon: <Sparkles size={48} className="text-white" />,
      title: "Renewal Risk Copilot",
      subtitle: "From date-tracking to strategic negotiation.",
      content: (
        <div className="space-y-4 text-gray-300">
          <p>
            We automatically label renewals that are <strong className="text-sirion-lilac">off-policy or risky</strong>.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-sm text-gray-300">
            <li>Performance history & SLA breaches automatically surfaced.</li>
            <li>Market pricing benchmarks applied to uplift clauses.</li>
            <li>One-click generation of negotiation briefs and non-renewal notices.</li>
          </ul>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (step < slides.length - 1) {
      setStep(prev => prev + 1);
    } else {
      finish();
    }
  };

  const finish = () => {
    setExiting(true);
    setTimeout(onComplete, 800); // Allow exit animation to play
  };

  const currentSlide = slides[step];

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-700 bg-sirion-midnight ${exiting ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
      <div className="max-w-2xl w-full mx-6 p-8 md:p-12 rounded-2xl shadow-2xl bg-white/10 backdrop-blur-md border border-white/10 transition-all duration-500">
        
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="p-4 rounded-full shadow-lg bg-white/20 text-white transition-colors duration-500">
            {currentSlide.icon}
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-white transition-colors duration-300">
              {currentSlide.title}
            </h1>
            <p className="text-lg md:text-xl font-medium text-sirion-lilac transition-colors duration-300">
              {currentSlide.subtitle}
            </p>
          </div>

          <div className="w-full h-px bg-white opacity-20 my-4"></div>

          <div className="min-h-[180px] flex flex-col justify-center">
             <div className="animate-fadeIn" key={step}>
                {currentSlide.content}
             </div>
          </div>

          <div className="flex items-center justify-between w-full pt-8">
            <div className="flex gap-2">
              {slides.map((s, idx) => (
                <div 
                  key={s.id} 
                  className={`h-1.5 rounded-full transition-all duration-300 ${idx === step ? 'w-8 bg-sirion-teal' : 'w-2 bg-gray-500'}`}
                />
              ))}
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={finish}
                className="text-sm font-medium px-4 py-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400"
              >
                Skip Intro
              </button>
              <Button onClick={handleNext} variant="primary" className="min-w-[120px] bg-sirion-teal hover:bg-sirion-tealLight text-white border-none">
                {step === slides.length - 1 ? 'Get Started' : 'Next'} <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};