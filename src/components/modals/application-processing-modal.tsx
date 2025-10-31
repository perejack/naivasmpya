import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, FileText, User, Shield, Sparkles, ArrowRight, MapPin, Users, Star, Zap, Award } from 'lucide-react';
import { NaivasUnavailableModal, AlternativeCompany } from './naivas-unavailable-modal';

interface ApplicationProcessingModalProps {
  isOpen: boolean;
  onComplete: () => void;
  applicantName: string;
  jobTitle: string;
  selectedCompany?: AlternativeCompany;
}

interface ProcessingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  duration: number;
  status: 'pending' | 'processing' | 'completed';
}

export function ApplicationProcessingModal({ 
  isOpen, 
  onComplete, 
  applicantName, 
  jobTitle,
  selectedCompany 
}: ApplicationProcessingModalProps) {
  console.log("ApplicationProcessingModal render:", { isOpen, applicantName, jobTitle, selectedCompany });
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [showNaivasUnavailable, setShowNaivasUnavailable] = useState(false);
  const [alternativeCompany, setAlternativeCompany] = useState<AlternativeCompany | null>(selectedCompany || null);
  const [spotsLeft] = useState(Math.floor(Math.random() * 3) + 2); // Random 2-4 spots

  const processingSteps: ProcessingStep[] = [
    {
      id: 'reviewing',
      title: 'Reviewing Application',
      description: 'Analyzing your qualifications and experience',
      icon: <FileText className="w-6 h-6" />,
      duration: 7000,
      status: 'pending'
    },
    {
      id: 'qualifications',
      title: 'Confirming Qualifications',
      description: 'Verifying education and skill requirements',
      icon: <User className="w-6 h-6" />,
      duration: 8000,
      status: 'pending'
    },
    {
      id: 'documents',
      title: 'Reviewing Documents',
      description: 'Cross-checking provided information',
      icon: <Shield className="w-6 h-6" />,
      duration: 7500,
      status: 'pending'
    },
    {
      id: 'matching',
      title: 'Position Matching',
      description: 'Finding the best role match for you',
      icon: <Sparkles className="w-6 h-6" />,
      duration: 7500,
      status: 'pending'
    }
  ];

  const [steps, setSteps] = useState(processingSteps);

  // Reset everything when modal opens
  useEffect(() => {
    if (isOpen) {
      console.log("Modal opened - resetting states");
      setCurrentStepIndex(0);
      setShowCongratulations(false);
      setShowNaivasUnavailable(false);
      setAlternativeCompany(selectedCompany || null);
      setSteps(processingSteps.map(step => ({ ...step, status: 'pending' as const })));
    }
  }, [isOpen, selectedCompany]);

  // Handle step progression
  useEffect(() => {
    if (!isOpen || showCongratulations) return;

    console.log(`Starting step ${currentStepIndex}`);
    
    // Mark current step as processing immediately
    setSteps(prevSteps => {
      const newSteps = [...prevSteps];
      if (currentStepIndex < newSteps.length) {
        newSteps[currentStepIndex].status = 'processing';
      }
      return newSteps;
    });

    // Complete current step after duration
    const timeoutId = setTimeout(() => {
      console.log(`Completing step ${currentStepIndex}`);
      
      setSteps(prevSteps => {
        const newSteps = [...prevSteps];
        if (currentStepIndex < newSteps.length) {
          newSteps[currentStepIndex].status = 'completed';
        }
        return newSteps;
      });

      // Move to next step or show congratulations/unavailable screen
      if (currentStepIndex < processingSteps.length - 1) {
        setTimeout(() => {
          setCurrentStepIndex(prev => prev + 1);
        }, 500);
      } else {
        // All steps completed
        setTimeout(() => {
          // If no company is selected (first time application to Naivas), show unavailable
          if (!alternativeCompany) {
            setShowNaivasUnavailable(true);
          } else {
            // If applying through alternative company, show congratulations
            setShowCongratulations(true);
          }
        }, 1000);
      }
    }, processingSteps[currentStepIndex]?.duration || 7000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [currentStepIndex, isOpen, showCongratulations]);

  const getStepStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 text-white';
      case 'processing':
        return 'bg-blue-500 text-white animate-pulse';
      default:
        return 'bg-gray-200 text-gray-600';
    }
  };

  const getProgressPercentage = () => {
    const completedSteps = steps.filter(step => step.status === 'completed').length;
    const processingSteps = steps.filter(step => step.status === 'processing').length;
    return ((completedSteps + processingSteps * 0.5) / steps.length) * 100;
  };

  const handleNaivasUnavailableExit = () => {
    setShowNaivasUnavailable(false);
    setCurrentStepIndex(0);
    setShowCongratulations(false);
    setSteps(processingSteps.map(step => ({ ...step, status: 'pending' as const })));
    onComplete();
  };

  const handleAlternativeCompanySelect = (company: AlternativeCompany) => {
    setAlternativeCompany(company);
    setShowNaivasUnavailable(false);
    // Reset and restart processing for the new company
    setCurrentStepIndex(0);
    setSteps(processingSteps.map(step => ({ ...step, status: 'pending' as const })));
  };

  if (!isOpen) return null;

  // Show Naivas Unavailable Modal
  if (showNaivasUnavailable) {
    return (
      <NaivasUnavailableModal
        isOpen={showNaivasUnavailable}
        onExit={handleNaivasUnavailableExit}
        onProceed={handleAlternativeCompanySelect}
        jobTitle={jobTitle}
      />
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="w-[92vw] sm:w-[95vw] max-w-md mx-auto bg-white rounded-xl sm:rounded-2xl shadow-2xl border-0 p-0 overflow-hidden max-h-[85vh] sm:max-h-[90vh]">
        {!showCongratulations ? (
          <div className="relative min-h-[600px] flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Clean Header */}
            <div className="relative z-10 bg-white border-b border-gray-200 p-4 sm:p-6 text-center">
              <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-3 sm:mb-4 shadow-lg">
                <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-white animate-spin" style={{ animationDuration: '3s' }} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                Processing Your Application
              </h2>
              <p className="text-gray-600 text-sm font-medium">
                {alternativeCompany 
                  ? `Reviewing your application for ${alternativeCompany.name}...`
                  : 'Please wait while we review your profile...'}
              </p>
            </div>

            {/* Enhanced Progress Bar */}
            <div className="relative z-10 px-4 sm:px-6 py-4 sm:py-6 bg-white border-b border-gray-200">
              <div className="w-full bg-gray-200 rounded-full h-3 mb-3 overflow-hidden shadow-inner">
                <div 
                  className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 h-3 rounded-full transition-all duration-1000 ease-out relative overflow-hidden shadow-lg"
                  style={{ width: `${getProgressPercentage()}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-700 font-medium">
                  {Math.round(getProgressPercentage())}% Complete
                </p>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500 animate-pulse" />
                  <span className="text-xs text-yellow-600 font-medium">Premium Processing</span>
                </div>
              </div>
            </div>

            {/* Enhanced Processing Steps */}
            <div className="relative z-10 flex-1 p-4 sm:p-6 space-y-3 sm:space-y-4 overflow-y-auto bg-gradient-to-br from-blue-50 to-indigo-100">
              {steps.map((step, index) => (
                <div 
                  key={step.id}
                  className={`flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-lg sm:rounded-xl transition-all duration-500 transform ${
                    step.status === 'processing' 
                      ? 'bg-blue-100 border border-blue-300 scale-[1.02] sm:scale-105 shadow-lg' :
                    step.status === 'completed' 
                      ? 'bg-green-100 border border-green-300 shadow-md' :
                    'bg-white border border-gray-200'
                  }`}
                >
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-500 shadow-md ${
                    step.status === 'completed'
                      ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white' :
                    step.status === 'processing'
                      ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white animate-pulse' :
                    'bg-gray-100 text-gray-500 border border-gray-300'
                  }`}>
                    {step.status === 'completed' ? (
                      <CheckCircle className="w-7 h-7" />
                    ) : step.status === 'processing' ? (
                      <div className="relative">
                        {step.icon}
                      </div>
                    ) : (
                      step.icon
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-bold text-sm sm:text-base ${
                      step.status === 'processing' ? 'text-blue-800' :
                      step.status === 'completed' ? 'text-green-800' :
                      'text-gray-600'
                    }`}>
                      {step.title}
                    </h3>
                    <p className={`text-xs sm:text-sm ${
                      step.status === 'processing' ? 'text-blue-700' :
                      step.status === 'completed' ? 'text-green-700' :
                      'text-gray-500'
                    }`}>
                      {step.description}
                    </p>
                  </div>
                  {step.status === 'processing' && (
                    <div className="flex flex-col space-y-1">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '300ms' }} />
                      </div>
                      <Zap className="w-4 h-4 text-yellow-400 animate-pulse mx-auto" />
                    </div>
                  )}
                  {step.status === 'completed' && (
                    <Award className="w-6 h-6 text-yellow-400 animate-pulse" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Redesigned Mobile-First Congratulations Screen */
          <div className="relative bg-white overflow-hidden">
            {/* Success Header */}
            <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 px-3 sm:px-4 py-6 sm:py-8 text-center">
              {/* Floating Elements */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-white/30 rounded-full animate-pulse"
                    style={{
                      left: `${20 + Math.random() * 60}%`,
                      top: `${20 + Math.random() * 60}%`,
                      animationDelay: `${Math.random() * 2}s`,
                    }}
                  />
                ))}
              </div>
              
              <div className="relative z-10">
                <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 bg-white/20 rounded-full flex items-center justify-center mb-3 sm:mb-4 backdrop-blur-sm">
                  <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  🎉 Congratulations!
                </h2>
                <p className="text-green-100 text-sm font-medium">
                  {alternativeCompany 
                    ? `You've been pre-approved at ${alternativeCompany.name}!`
                    : "You've been pre-approved!"}
                </p>
              </div>
            </div>

            {/* Content Area - Optimized for Mobile */}
            <div className="px-3 sm:px-4 py-4 sm:py-6 space-y-3 sm:space-y-4 max-h-[50vh] overflow-y-auto">
              {/* Position Card */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-blue-200">
                <div className="text-center">
                  <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-1 sm:mb-2">
                    Position Available:
                  </h3>
                  <h4 className="text-lg sm:text-xl font-bold text-blue-800 mb-1">
                    {jobTitle}
                  </h4>
                  {alternativeCompany && (
                    <p className="text-sm text-gray-600 mb-3">at {alternativeCompany.name}</p>
                  )}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{alternativeCompany?.location || 'Multiple Locations'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Full-time</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Urgency Alert */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
                <div className="flex items-center justify-center space-x-2 mb-1 sm:mb-2">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-orange-500 rounded-full animate-pulse" />
                  <p className="text-sm sm:text-base text-orange-800 font-bold">
                    Only {spotsLeft} spots remaining!
                  </p>
                </div>
                <p className="text-orange-700 text-xs sm:text-sm text-center">
                  Complete your application to secure this position
                </p>
              </div>

              {/* Welcome Card */}
              <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm sm:text-base text-gray-800 truncate">Welcome, {applicantName}!</p>
                    <p className="text-gray-600 text-xs sm:text-sm">Your qualifications match perfectly</p>
                  </div>
                </div>
              </div>

              {/* Benefits Preview */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-green-200">
                <h4 className="font-bold text-sm sm:text-base text-green-800 mb-2 text-center">What's Next?</h4>
                <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                  <div className="flex items-center space-x-1.5 sm:space-x-2">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 flex-shrink-0" />
                    <span className="text-gray-700">Complete application processing</span>
                  </div>
                  <div className="flex items-center space-x-1.5 sm:space-x-2">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 flex-shrink-0" />
                    <span className="text-gray-700">Receive confirmation within 48 hours</span>
                  </div>
                  <div className="flex items-center space-x-1.5 sm:space-x-2">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 flex-shrink-0" />
                    <span className="text-gray-700">Start your new career journey</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Fixed Bottom Action Button */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-3 sm:p-4">
              <Button 
                onClick={onComplete}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 sm:py-4 rounded-lg sm:rounded-xl shadow-lg transition-all duration-200 text-sm sm:text-base"
              >
                <div className="flex items-center justify-center space-x-2">
                  <span>Continue Application</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              </Button>
              <p className="text-gray-500 text-xs text-center mt-1.5 sm:mt-2">
                Secure your position • Takes less than 2 minutes
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
