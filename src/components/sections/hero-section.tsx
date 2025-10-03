import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Zap, TrendingUp, ChevronRight, Globe, Rocket, Star, Award, Target, Briefcase, DollarSign, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import heroNewImage from "@/assets/heronew.jpeg";

export function HeroSection() {
  const [activeWord, setActiveWord] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  
  const dynamicWords = ["Future", "Success", "Dreams", "Journey"];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveWord((prev) => (prev + 1) % dynamicWords.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollToJobs = () => {
    document.getElementById('job-listings')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 4s ease infinite;
        }
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Hero Background Image with Minimal Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroNewImage}
            alt="Modern retail environment"
            className="w-full h-full object-cover"
          />
          {/* Minimal gradient overlays for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        {/* Subtle Animated Effects */}
        <div className="absolute inset-0 z-[1]">
          {/* Very subtle mesh pattern */}
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px'
            }}
          />
          
          {/* Very subtle floating orbs */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/3 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          
          {/* Subtle Interactive Gradient that follows mouse */}
          <div 
            className="absolute w-96 h-96 bg-gradient-to-r from-white/5 to-transparent rounded-full blur-3xl pointer-events-none transition-all duration-700"
            style={{
              left: `${mousePosition.x - 192}px`,
              top: `${mousePosition.y - 192}px`,
            }}
          />
        </div>

        {/* Minimal Floating Particles */}
        <div className="absolute inset-0 z-[2]">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white/20 rounded-full animate-float"
              style={{
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${20 + Math.random() * 20}s`,
                filter: 'blur(0.5px)'
              }}
            />
          ))}
        </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className="space-y-8">
              {/* Logo Section */}
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-yellowgreen to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Briefcase className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Jobs Portal</h2>
                  <p className="text-white/70 text-sm">Kenya's Premier Career Platform</p>
                </div>
              </div>

              {/* Dynamic Heading */}
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight">
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellowgreen via-yellow-400 to-white animate-gradient">
                    Start Your Career
                  </span>
                  <span className="block text-yellow-400 relative">
                    <span className="absolute -inset-1 bg-gradient-to-r from-yellowgreen to-yellow-500 blur-lg opacity-70 animate-pulse"></span>
                    <span className="relative">
                      Success
                    </span>
                  </span>
                  <span className="block text-white text-3xl md:text-4xl mt-2">
                    start your career today
                  </span>
                </h1>
              </div>

              {/* Simple Stats Display */}
              <div className="flex flex-wrap justify-center gap-8 text-center">
                <div className="space-y-1">
                  <div className="text-3xl font-bold text-white">45K+</div>
                  <div className="text-sm text-white/70">Max Salary</div>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-bold text-white">500+</div>
                  <div className="text-sm text-white/70">Open Roles</div>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-bold text-white">98%</div>
                  <div className="text-sm text-white/70">Satisfaction</div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  onClick={scrollToJobs}
                  className="group relative overflow-hidden bg-gradient-to-r from-yellowgreen to-green-500 hover:from-green-600 hover:to-yellowgreen text-white border-0 px-8 py-6 text-lg font-bold rounded-2xl shadow-2xl hover:shadow-green-500/25 transition-all duration-300"
                >
                  <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                  <span className="relative flex items-center gap-2">
                    <Rocket className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                    Apply Now
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </span>
                </Button>
                
                <Button 
                  size="lg"
                  variant="outline"
                  className="group border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 px-8 py-6 text-lg font-bold rounded-2xl transition-all duration-300">
                  <Globe className="w-5 h-5 mr-2 animate-spin-slow" />
                  Explore Locations
                  <Sparkles className="w-4 h-4 ml-2 text-yellowgreen group-hover:animate-pulse" />
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-yellowgreen to-green-500 border-2 border-white/20 flex items-center justify-center">
                      <span className="text-xs text-white font-bold">{i + 1}K</span>
                    </div>
                  ))}
                </div>
                <div className="text-sm text-white/80">
                  <span className="text-yellowgreen font-bold">12,847</span> professionals hired this month
                </div>
              </div>
            </div>

            {/* Right Visual Element */}
            <div className="relative lg:block hidden">
              <div className="relative w-full h-[600px]">
                {/* 3D Card Stack */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-80 h-96">
                    {/* Back Card */}
                    <div className="absolute inset-0 bg-gradient-to-br from-green-600/20 to-yellowgreen/20 backdrop-blur-md rounded-3xl transform rotate-6 scale-95 border border-yellowgreen/20"></div>
                    
                    {/* Middle Card */}
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/20 to-green-600/20 backdrop-blur-md rounded-3xl transform -rotate-3 scale-100 border border-yellow-500/20"></div>
                    
                    {/* Front Card */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-3xl border border-yellowgreen/30 p-8 flex flex-col justify-between hover:scale-105 transition-transform duration-500">
                      <div>
                        <div className="w-16 h-16 bg-gradient-to-br from-yellowgreen to-green-500 rounded-2xl flex items-center justify-center mb-6">
                          <Award className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Premium Position</h3>
                        <p className="text-white/70">Exclusive retail management opportunity with growth potential</p>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-green-600/10 rounded-xl border border-yellowgreen/20">
                          <span className="text-white/70">Salary</span>
                          <span className="text-white font-bold">KSh 45,000+</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-yellow-600/10 rounded-xl border border-yellow-500/20">
                          <span className="text-white/70">Benefits</span>
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                        <Button className="w-full bg-gradient-to-r from-yellowgreen to-green-500 hover:from-green-600 hover:to-yellowgreen text-white">
                          Start Your Journey
                          <Zap className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Icons */}
                <div className="absolute top-10 right-10 p-3 bg-gradient-to-br from-yellowgreen to-green-500 rounded-2xl animate-float">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div className="absolute bottom-10 left-10 p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl animate-float" style={{ animationDelay: '1s' }}>
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="absolute top-1/2 right-0 p-3 bg-gradient-to-br from-white/80 to-white/60 rounded-2xl animate-float" style={{ animationDelay: '2s' }}>
                  <Rocket className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

        {/* Bottom Wave Decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent"></div>
      </section>
    </>
  );
}