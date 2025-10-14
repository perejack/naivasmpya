import React, { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertCircle, 
  Building2, 
  MapPin, 
  Users, 
  Star, 
  TrendingUp,
  ArrowRight,
  X,
  Sparkles,
  Clock,
  Award,
  Briefcase,
  Heart,
  Shield,
  Zap
} from 'lucide-react';

interface NaivasUnavailableModalProps {
  isOpen: boolean;
  onExit: () => void;
  onProceed: (company: AlternativeCompany) => void;
  jobTitle: string;
}

export interface AlternativeCompany {
  id: string;
  name: string;
  logo: string;
  image: string;
  description: string;
  benefits: string[];
  rating: number;
  employees: string;
  location: string;
  color: string;
  gradient: string;
  salaryRange: string;
  urgency: string;
}

const alternativeCompanies: AlternativeCompany[] = [
  {
    id: 'megamart',
    name: 'MegaMart Supermarkets',
    logo: '🛒',
    image: '/images/companies/megamart.jpg',
    description: 'Leading retail chain with 50+ stores nationwide, known for excellent customer service and employee growth programs.',
    benefits: ['Medical Insurance', 'Performance Bonuses', 'Career Development', 'Flexible Hours'],
    rating: 4.6,
    employees: '5,000+',
    location: 'Multiple Locations',
    color: 'orange',
    gradient: 'from-orange-500 to-red-500',
    salaryRange: 'KSh 28,000 - 35,000',
    urgency: '3 spots left'
  },
  {
    id: 'freshco',
    name: 'Freshco Kenya',
    logo: '🏪',
    image: '/images/companies/freshco.jpg',
    description: 'International retail giant offering world-class training, competitive salaries, and rapid career advancement.',
    benefits: ['International Training', 'Health Coverage', 'Staff Discounts', 'Promotion Opportunities'],
    rating: 4.7,
    employees: '3,000+',
    location: 'Major Cities',
    color: 'blue',
    gradient: 'from-blue-500 to-cyan-500',
    salaryRange: 'KSh 30,000 - 38,000',
    urgency: '2 spots left'
  },
  {
    id: 'valuemart',
    name: 'Valuemart Plus',
    logo: '🥑',
    image: '/images/companies/valuemart.jpg',
    description: 'Premium supermarket chain focusing on quality products and exceptional employee welfare programs.',
    benefits: ['Premium Medical', 'Education Support', 'Annual Bonuses', 'Work-Life Balance'],
    rating: 4.8,
    employees: '2,000+',
    location: 'Nairobi & Mombasa',
    color: 'green',
    gradient: 'from-green-500 to-emerald-500',
    salaryRange: 'KSh 32,000 - 40,000',
    urgency: '1 spot left'
  }
];

export function NaivasUnavailableModal({ 
  isOpen, 
  onExit, 
  onProceed,
  jobTitle 
}: NaivasUnavailableModalProps) {
  const [selectedCompany, setSelectedCompany] = useState<AlternativeCompany | null>(null);
  const [showCompanies, setShowCompanies] = useState(false);

  const handleProceedClick = () => {
    setShowCompanies(true);
  };

  const handleCompanySelect = (company: AlternativeCompany) => {
    setSelectedCompany(company);
    setTimeout(() => {
      onProceed(company);
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-50 w-[92vw] sm:w-[95vw] max-w-2xl translate-x-[-50%] translate-y-[-50%] bg-white rounded-xl sm:rounded-2xl shadow-2xl border-0 p-0 max-h-[90vh] sm:max-h-[95vh] flex flex-col overflow-visible data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
        {!showCompanies ? (
          /* Initial Naivas Unavailable Screen */
          <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col h-full min-h-[500px] max-h-[90vh] sm:max-h-[95vh]">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full opacity-10"
                  style={{
                    width: `${30 + Math.random() * 70}px`,
                    height: `${30 + Math.random() * 70}px`,
                    background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animation: `float ${10 + Math.random() * 20}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 5}s`
                  }}
                />
              ))}
            </div>

            {/* Header with Alert */}
            <div className="relative z-10 bg-white border-b border-gray-200 p-4 sm:p-6 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse shadow-lg flex-shrink-0">
                    <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-lg sm:text-2xl font-bold text-gray-800 truncate">Important Update</h2>
                    <p className="text-xs sm:text-sm text-gray-600">About your application to Naivas</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onExit}
                  className="hover:bg-gray-100 flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </div>
            </div>

            {/* Main Content - Scrollable */}
            <div className="relative z-10 flex-1 overflow-y-auto min-h-0">
              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Status Card */}
                <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
                  <div className="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-lg sm:rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                      <Building2 className="w-7 h-7 sm:w-8 sm:h-8 text-orange-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                        Unfortunately, Naivas is not hiring right now
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                        Due to overwhelming response, all positions at Naivas have been filled. 
                        However, your profile is exceptional and perfectly matches requirements at other premium retailers!
                      </p>
                    </div>
                  </div>
                </div>

                {/* Good News Card */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
                  <div className="flex items-center justify-center space-x-1 sm:space-x-2 mb-3 sm:mb-4">
                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 animate-pulse" />
                    <h3 className="text-xl sm:text-2xl font-bold text-green-800">Great News!</h3>
                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 animate-pulse" />
                  </div>
                  
                  <div className="text-center space-y-2 sm:space-y-3">
                    <p className="text-base sm:text-lg text-gray-700 font-medium">
                      We have <span className="text-green-600 font-bold">3 premium companies</span> actively hiring for
                    </p>
                    <button
                      onClick={handleProceedClick}
                      className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 cursor-pointer group"
                    >
                      <p className="text-lg sm:text-xl font-bold group-hover:animate-pulse">{jobTitle}</p>
                    </button>
                    <p className="text-sm sm:text-base text-gray-600">
                      Based on your qualifications, you're <span className="font-bold text-green-600">pre-approved</span> for these positions!
                    </p>
                  </div>

                  {/* Benefits Grid */}
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-4 sm:mt-6">
                    <div className="bg-white rounded-lg p-2 sm:p-3 flex items-center space-x-1 sm:space-x-2 shadow-sm">
                      <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-medium text-gray-700">Higher Salaries</span>
                    </div>
                    <div className="bg-white rounded-lg p-2 sm:p-3 flex items-center space-x-1 sm:space-x-2 shadow-sm">
                      <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-medium text-gray-700">Better Benefits</span>
                    </div>
                    <div className="bg-white rounded-lg p-2 sm:p-3 flex items-center space-x-1 sm:space-x-2 shadow-sm">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500 flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-medium text-gray-700">Immediate Start</span>
                    </div>
                    <div className="bg-white rounded-lg p-2 sm:p-3 flex items-center space-x-1 sm:space-x-2 shadow-sm">
                      <Award className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-medium text-gray-700">Career Growth</span>
                    </div>
                  </div>
                </div>

                {/* Urgency Alert */}
                <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg sm:rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row items-center sm:justify-between shadow-lg space-y-2 sm:space-y-0">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full animate-pulse" />
                    <p className="text-sm sm:text-base font-bold">Limited Time Offer</p>
                  </div>
                  <p className="text-xs sm:text-sm">Positions closing in 24 hours</p>
                </div>

                {/* Action Buttons - Inside scrollable content */}
                <div className="space-y-3 mt-6">
                  <Button 
                    onClick={handleProceedClick}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 sm:py-4 rounded-lg sm:rounded-xl shadow-lg transition-all duration-200 text-sm sm:text-base group"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Apply to New Company</span>
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Button>
                  <Button 
                    onClick={onExit}
                    variant="outline"
                    className="w-full font-medium py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base"
                  >
                    Exit Application
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Companies Selection Screen */
          <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col h-full min-h-[500px] max-h-[90vh] sm:max-h-[95vh]">
            {/* Header - Fixed */}
            <div className="relative z-20 bg-white border-b border-gray-200 p-3 sm:p-4 shadow-sm flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800 truncate">Choose Your Employer</h2>
                  <p className="text-xs sm:text-sm text-gray-600 truncate">Select from 3 premium companies hiring for {jobTitle}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onExit}
                  className="hover:bg-gray-100 flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 ml-2"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </div>
            </div>

            {/* Companies List - Scrollable */}
            <div className="flex-1 overflow-y-auto min-h-0 p-3 sm:p-4 space-y-3 sm:space-y-4">
              {alternativeCompanies.map((company, index) => (
                <div
                  key={company.id}
                  className={`bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-[1.01] sm:hover:scale-[1.02] hover:shadow-xl ${
                    selectedCompany?.id === company.id ? 'ring-4 ring-blue-500' : ''
                  }`}
                  style={{
                    animation: `slideInUp 0.5s ease-out ${index * 0.1}s both`
                  }}
                >
                  <div className={`bg-gradient-to-r ${company.gradient} p-3 sm:p-4 text-white relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
                    <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur rounded-lg sm:rounded-xl flex items-center justify-center text-2xl sm:text-3xl shadow-lg flex-shrink-0">
                          {company.logo}
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-base sm:text-xl font-bold truncate">{company.name}</h3>
                          <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-white/90">
                            <MapPin className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{company.location}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex sm:flex-col items-center sm:items-end space-x-3 sm:space-x-0">
                        <div className="flex items-center space-x-0.5 sm:space-x-1 sm:mb-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3 h-3 sm:w-4 sm:h-4 ${i < Math.floor(company.rating) ? 'fill-yellow-300 text-yellow-300' : 'text-white/50'}`} 
                            />
                          ))}
                        </div>
                        <Badge className="bg-white/20 text-white border-white/30 text-xs">
                          {company.rating} Rating
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Company Image */}
                  <div className="relative h-32 sm:h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg sm:rounded-xl overflow-hidden">
                    <img
                      src={company.image}
                      alt={`${company.name} store`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        // Show SVG fallback if image fails to load
                        target.src = `data:image/svg+xml;base64,${btoa(`
                          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                              <linearGradient id="grad${company.id}" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style="stop-color:${company.color === 'orange' ? '#f97316' : company.color === 'blue' ? '#3b82f6' : '#10b981'};stop-opacity:1" />
                                <stop offset="100%" style="stop-color:${company.color === 'orange' ? '#dc2626' : company.color === 'blue' ? '#06b6d4' : '#059669'};stop-opacity:1" />
                              </linearGradient>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#grad${company.id})"/>
                            <circle cx="50%" cy="30%" r="15" fill="white" opacity="0.3"/>
                            <text x="50%" y="60%" text-anchor="middle" dy=".3em" fill="white" font-size="12" font-weight="bold">
                              ${company.name}
                            </text>
                            <text x="50%" y="75%" text-anchor="middle" dy=".3em" fill="white" font-size="8" opacity="0.8">
                              ${company.location}
                            </text>
                          </svg>
                        `)}`;
                      }}
                      onLoad={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.opacity = '1';
                      }}
                      style={{ opacity: 0, transition: 'opacity 0.3s ease' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>

                  {/* Company Body */}
                  <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                    {/* Urgency Badge */}
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className="bg-red-100 text-red-700 border-red-200 animate-pulse text-xs">
                        <Zap className="w-3 h-3 mr-1" />
                        {company.urgency}
                      </Badge>
                      <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                        <Users className="w-3 h-3 mr-1" />
                        {company.employees}
                      </Badge>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                      {company.description}
                    </p>

                    {/* Salary Range */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-2.5 sm:p-3 border border-green-200">
                      <p className="text-xs sm:text-sm font-medium text-gray-700">Salary Range</p>
                      <p className="text-base sm:text-lg font-bold text-green-700">{company.salaryRange}</p>
                    </div>

                    {/* Benefits */}
                    <div className="space-y-2">
                      <p className="text-xs sm:text-sm font-medium text-gray-700">Key Benefits</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
                        {company.benefits.map((benefit, idx) => (
                          <div key={idx} className="flex items-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm text-gray-600">
                            <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-pink-500 flex-shrink-0" />
                            <span className="truncate">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Apply Button */}
                    <Button
                      onClick={() => handleCompanySelect(company)}
                      className={`w-full bg-gradient-to-r ${company.gradient} hover:opacity-90 text-white font-bold py-2.5 sm:py-3 rounded-lg sm:rounded-xl shadow-lg transition-all duration-200 group text-sm sm:text-base`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <span>Apply to {company.name}</span>
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Dialog>
  );
}
