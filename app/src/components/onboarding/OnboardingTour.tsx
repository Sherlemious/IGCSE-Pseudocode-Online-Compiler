'use client';

import { useState, useEffect, useCallback } from 'react';
import { Braces, Play, BookOpen, GraduationCap, Bug, X } from 'lucide-react';
import { ONBOARDING_KEY } from '../../utils/constants';

interface TourStep {
  targetSelector: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  position: 'right' | 'bottom' | 'left';
}

const STEPS: TourStep[] = [
  {
    targetSelector: '[data-tour="editor"]',
    title: 'Write Your Code',
    description: 'This is the editor. Write Cambridge pseudocode here — it supports IGCSE (0478) and AS & A Level Computer Science (9618) syntax with syntax highlighting.',
    icon: <Braces size={16} className="text-primary" />,
    position: 'right',
  },
  {
    targetSelector: '[data-tour="run-button"]',
    title: 'Run & Debug',
    description: 'Click Run or press Ctrl+Enter to execute your pseudocode. Use Debug to step through line by line.',
    icon: <Play size={16} className="text-success" />,
    position: 'bottom',
  },
  {
    targetSelector: '[data-tour="docs-link"]',
    title: 'Syntax Reference',
    description: 'Not sure about the syntax? The Docs page has a complete reference for every supported keyword and statement.',
    icon: <BookOpen size={16} className="text-info" />,
    position: 'bottom',
  },
  {
    targetSelector: '[data-tour="practice-link"]',
    title: 'Practice Questions',
    description: 'Test your skills with autograded questions. Track your progress, get hints, and compare with model solutions.',
    icon: <GraduationCap size={16} className="text-warning" />,
    position: 'bottom',
  },
  {
    targetSelector: '[data-tour="report-bug"]',
    title: 'Hit a Snag?',
    description: 'Found a bug or have an idea? Click here to report it — your current code is attached automatically so we can reproduce it. You can also open it any time from the command palette (Ctrl+K).',
    icon: <Bug size={16} className="text-error" />,
    position: 'bottom',
  },
];

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export default function OnboardingTour() {
  const [visible, setVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<Rect | null>(null);

  // Check if onboarding has been completed
  useEffect(() => {
    try {
      if (!localStorage.getItem(ONBOARDING_KEY)) {
        const timer = setTimeout(() => setVisible(true), 800);
        return () => clearTimeout(timer);
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Measure target element
  const measureTarget = useCallback(() => {
    if (!visible) return;
    // On mobile, only show first 2 steps (editor + run button)
    const isMobile = window.innerWidth < 768;
    const stepsToShow = isMobile ? STEPS.slice(0, 2) : STEPS;
    const step = stepsToShow[currentStep];
    if (!step) return;

    const el = document.querySelector(step.targetSelector);
    if (el) {
      const rect = el.getBoundingClientRect();
      setTargetRect({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
    }
  }, [visible, currentStep]);

  useEffect(() => {
    measureTarget();
    window.addEventListener('resize', measureTarget);
    return () => window.removeEventListener('resize', measureTarget);
  }, [measureTarget]);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const totalSteps = isMobile ? Math.min(2, STEPS.length) : STEPS.length;
  const step = STEPS[currentStep];

  const complete = useCallback(() => {
    setVisible(false);
    try { localStorage.setItem(ONBOARDING_KEY, 'true'); } catch { /* ignore */ }
  }, []);

  const next = () => {
    if (currentStep >= totalSteps - 1) {
      complete();
    } else {
      setCurrentStep((s) => s + 1);
    }
  };

  const prev = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  if (!visible || !step) return null;

  // Calculate tooltip position
  const getTooltipStyle = (): React.CSSProperties => {
    const isMobileView = typeof window !== 'undefined' && window.innerWidth < 768;

    // On mobile, anchor the card to the bottom of the screen
    if (isMobileView) {
      return {
        bottom: '24px',
        left: '16px',
        right: '16px',
        maxWidth: 'none',
      };
    }

    if (!targetRect) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };

    const pad = 12;
    const viewportMargin = 8;
    const tooltipWidth = Math.min(300, window.innerWidth - viewportMargin * 2);

    if (step.position === 'right') {
      const rawLeft = targetRect.left + targetRect.width + pad;
      return {
        top: targetRect.top + targetRect.height / 2,
        left: Math.min(Math.max(rawLeft, viewportMargin), window.innerWidth - tooltipWidth - viewportMargin),
        transform: 'translateY(-50%)',
        width: tooltipWidth,
      };
    }
    if (step.position === 'bottom') {
      // Clamp the horizontal centre so the tooltip stays on-screen for anchors
      // near the right edge of the header (e.g. the Report-a-bug button).
      const half = tooltipWidth / 2;
      const rawCenter = targetRect.left + targetRect.width / 2;
      const center = Math.min(
        Math.max(rawCenter, half + viewportMargin),
        window.innerWidth - half - viewportMargin,
      );
      return {
        top: targetRect.top + targetRect.height + pad,
        left: center,
        transform: 'translateX(-50%)',
        width: tooltipWidth,
      };
    }
    // left
    const rawLeft = targetRect.left - pad - tooltipWidth;
    return {
      top: targetRect.top + targetRect.height / 2,
      left: Math.min(Math.max(rawLeft, viewportMargin), window.innerWidth - tooltipWidth - viewportMargin),
      transform: 'translateY(-50%)',
      width: tooltipWidth,
    };
  };

  return (
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-label="Welcome tour">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 animate-fade-in" onClick={complete} />

      {/* Spotlight */}
      {targetRect && (() => {
        const viewportInset = 2;
        const rawLeft = targetRect.left - 4;
        const rawTop = targetRect.top - 4;
        const rawRight = targetRect.left + targetRect.width + 4;
        const rawBottom = targetRect.top + targetRect.height + 4;
        const clampedLeft = Math.max(viewportInset, rawLeft);
        const clampedTop = Math.max(viewportInset, rawTop);
        const clampedRight = Math.min(window.innerWidth - viewportInset, rawRight);
        const clampedBottom = Math.min(window.innerHeight - viewportInset, rawBottom);
        const clampedWidth = Math.max(0, clampedRight - clampedLeft);
        const clampedHeight = Math.max(0, clampedBottom - clampedTop);
        if (clampedWidth === 0 || clampedHeight === 0) return null;
        return (
          <div
            className="absolute tour-spotlight pointer-events-none"
            style={{
              top: clampedTop,
              left: clampedLeft,
              width: clampedWidth,
              height: clampedHeight,
            }}
          />
        );
      })()}

      {/* Position and animation use separate elements so the scale animation
          cannot overwrite the translate used to anchor the card. */}
      <div
        className="fixed z-[101]"
        style={getTooltipStyle()}
      >
        <div className="relative w-full bg-surface border border-border rounded-xl p-4 shadow-intense animate-scale-in">
          {/* Close button */}
          <button
            onClick={complete}
            className="absolute top-2 right-2 text-dark-text hover:text-light-text p-0.5 rounded transition-colors"
            aria-label="Skip tour"
          >
            <X size={12} />
          </button>

          {/* Content */}
          <div className="flex items-center gap-2 mb-2">
            {step.icon}
            <h3 className="text-sm font-bold text-light-text">{step.title}</h3>
          </div>
          <p className="text-xs text-dark-text leading-relaxed mb-4">
            {step.description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between">
            {/* Step dots */}
            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === currentStep
                      ? 'w-4 bg-primary'
                      : i < currentStep
                        ? 'w-1.5 bg-primary/50'
                        : 'w-1.5 bg-border'
                  }`}
                />
              ))}
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2">
              {currentStep === 0 ? (
                <button
                  onClick={complete}
                  className="text-[10px] text-dark-text hover:text-light-text transition-colors px-2 py-1"
                >
                  Skip
                </button>
              ) : (
                <button
                  onClick={prev}
                  className="text-[10px] text-dark-text hover:text-light-text transition-colors px-2 py-1"
                >
                  Back
                </button>
              )}
              <button
                onClick={next}
                className="text-xs font-medium text-on-primary bg-primary hover:opacity-90 px-3 py-1.5 rounded-lg transition-opacity"
              >
                {currentStep >= totalSteps - 1 ? 'Get Started' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
