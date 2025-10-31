import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, DollarSign, FileText, Phone, Mail, User, MapPin, GraduationCap, CreditCard, Copy, Shield, ArrowLeft, ArrowRight, Smartphone, Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { PaymentSuccessModal } from "./payment-success-modal";
import { ApplicationProcessingModal } from "./application-processing-modal";

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: {
    title: string;
    salary: number;
    medicalAllowance: number;
  } | null;
}

export function ApplicationModal({ isOpen, onClose, job }: ApplicationModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    education: ""
  });
  const [paymentData, setPaymentData] = useState({
    phoneNumber: "",
    refundCode: "",
    checkoutRequestId: "",
    paymentStatus: "PENDING"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentStatusInterval, setPaymentStatusInterval] = useState<NodeJS.Timeout | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showProcessingModal, setShowProcessingModal] = useState(false);

  // Generate refund code
  const generateRefundCode = () => {
    const code = `REF${Date.now().toString().slice(-6)}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    setPaymentData(prev => ({ ...prev, refundCode: code }));
    return code;
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === 1) {
      // Validate form data
      if (!formData.fullName || !formData.email || !formData.phone || !formData.location || !formData.education) {
        toast.error("Please fill in all required fields");
        return;
      }
      // Show processing modal instead of going directly to step 2
      console.log("Setting processing modal to true");
      setShowProcessingModal(true);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    }
  };

  const handleProcessingComplete = () => {
    setShowProcessingModal(false);
    generateRefundCode();
    setCurrentStep(2);
  };

  const handlePayment = async () => {
    if (!paymentData.phoneNumber) {
      toast.error("Please enter your phone number");
      return;
    }
    
    setIsProcessingPayment(true);
    
    try {
      // Call the real STK push API
      const response = await fetch('/api/initiate-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: paymentData.phoneNumber,
          description: 'Job Application Processing Fee'
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        const checkoutRequestId = result.data.checkoutRequestId || result.data.externalReference;
        setPaymentData(prev => ({ 
          ...prev, 
          checkoutRequestId,
          paymentStatus: "PENDING"
        }));
        
        toast.success("STK push sent! Please check your phone and enter your M-Pesa PIN.");
        
        // Start polling for payment status
        startPaymentStatusPolling(checkoutRequestId);
      } else {
        throw new Error(result.message || 'Failed to initiate payment');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error("Failed to initiate payment. Please try again.");
      setIsProcessingPayment(false);
    }
  };

  const startPaymentStatusPolling = (checkoutRequestId: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/payment-status?reference=${checkoutRequestId}`);
        const result = await response.json();
        
        if (result.success && result.payment) {
          const status = result.payment.status;
          setPaymentData(prev => ({ ...prev, paymentStatus: status }));
          
          if (status === 'SUCCESS') {
            clearInterval(interval);
            setPaymentStatusInterval(null);
            setIsProcessingPayment(false);
            
            setShowSuccessModal(true);
            onClose();
            resetForm();
          } else if (status === 'FAILED') {
            clearInterval(interval);
            setPaymentStatusInterval(null);
            setIsProcessingPayment(false);
            toast.error("Payment failed. Please try again.");
          }
        }
      } catch (error) {
        console.error('Status check error:', error);
      }
    }, 3000); // Check every 3 seconds
    
    setPaymentStatusInterval(interval);
    
    // Stop polling after 2 minutes
    setTimeout(() => {
      if (interval) {
        clearInterval(interval);
        setPaymentStatusInterval(null);
        if (paymentData.paymentStatus === 'PENDING') {
          setIsProcessingPayment(false);
          toast.error("Payment timeout. Please try again.");
        }
      }
    }, 120000);
  };

  const resetForm = () => {
    setCurrentStep(1);
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      location: "",
      education: ""
    });
    setPaymentData({
      phoneNumber: "",
      refundCode: "",
      checkoutRequestId: "",
      paymentStatus: "PENDING"
    });
    
    // Clear any existing payment status polling
    if (paymentStatusInterval) {
      clearInterval(paymentStatusInterval);
      setPaymentStatusInterval(null);
    }
  };

  const copyRefundCode = () => {
    navigator.clipboard.writeText(paymentData.refundCode);
    toast.success("Refund code copied to clipboard!");
  };

  if (!job) return null;
  const totalPackage = job.salary + job.medicalAllowance;

  return (
    <>
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:w-[90vw] max-w-3xl max-h-[85vh] sm:max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="space-y-4">
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-2xl">
            <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            <span className="truncate">Apply for {job.title}</span>
          </DialogTitle>
          
          {/* Job Summary */}
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-3 sm:p-4 space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <Badge className="bg-primary/10 text-primary text-xs sm:text-sm">
                Full-time Position
              </Badge>
              <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Multiple Locations</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary flex-shrink-0" />
                <div className="min-w-0">
                  <div className="font-semibold text-sm sm:text-base truncate">KSh {job.salary.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Base Salary</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-secondary flex-shrink-0" />
                <div className="min-w-0">
                  <div className="font-semibold text-sm sm:text-base truncate">KSh {job.medicalAllowance.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Medical Allowance</div>
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className={`flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full text-xs sm:text-sm ${
                currentStep >= 1 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {currentStep > 1 ? <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" /> : '1'}
              </div>
              <div className={`h-0.5 w-8 sm:w-12 ${currentStep >= 2 ? 'bg-green-500' : 'bg-gray-200'}`} />
              <div className={`flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full text-xs sm:text-sm ${
                currentStep >= 2 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {currentStep > 2 ? <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" /> : '2'}
              </div>
            </div>
            <div className="text-xs sm:text-sm text-gray-500">
              Step {currentStep} of 2
            </div>
          </div>

          {/* Step 1: Application Form */}
          {currentStep === 1 && (
            <form onSubmit={handleNext} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Full Name *
                  </Label>
                  <Input
                    id="fullName"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+254 700 000 000"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Preferred Location *
                  </Label>
                  <Input
                    id="location"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g., Nairobi, Mombasa, Kisumu"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="education" className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Level of Education *
                </Label>
                <Select
                  value={formData.education}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, education: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your education level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="primary">Primary</SelectItem>
                    <SelectItem value="secondary">Secondary</SelectItem>
                    <SelectItem value="college">College</SelectItem>
                    <SelectItem value="university">University</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Qualifications Reminder */}
              <div className="bg-muted/50 rounded-lg p-3 sm:p-4">
                <h4 className="font-semibold text-sm sm:text-base mb-2">Key Requirements:</h4>
                <ul className="text-xs sm:text-sm space-y-1 text-muted-foreground">
                  <li>• Must be Kenyan citizen, 18 years and above</li>
                  <li>• Reliability and trustworthiness</li>
                  <li>• Strong communication and customer service skills</li>
                  <li>• Punctuality and time management</li>
                </ul>
              </div>

              <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 text-xs sm:text-sm py-2 sm:py-2.5"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary/90 text-white text-xs sm:text-sm py-2 sm:py-2.5"
                >
                  Next <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </form>
          )}

          {/* Step 2: Payment Information */}
          {currentStep === 2 && (
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center space-y-3 sm:space-y-4">
                <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <CreditCard className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold">Application Processing Fee</h3>
                <p className="text-xs sm:text-sm text-muted-foreground px-2">
                  A refundable application processing fee is required to complete your application
                </p>
              </div>

              <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-4 sm:p-6 space-y-3 sm:space-y-4">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-primary">KSh 130</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Refundable Processing Fee</div>
                </div>
                
                <div className="bg-white/50 rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3">
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 flex-shrink-0" />
                    <span className="font-medium">Your Refund Code:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-gray-100 px-2 sm:px-3 py-1.5 sm:py-2 rounded text-xs sm:text-sm font-mono overflow-x-auto">
                      {paymentData.refundCode}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={copyRefundCode}
                      className="shrink-0 h-8 w-8 sm:h-9 sm:w-9 p-0"
                    >
                      <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3">
                <h4 className="font-semibold text-sm sm:text-base text-yellow-800 flex items-center gap-2">
                  <Shield className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  Important Instructions
                </h4>
                <ul className="text-xs sm:text-sm text-yellow-700 space-y-1">
                  <li>• <strong>Keep your refund code safe</strong> - You'll need it to process your refund</li>
                  <li>• <strong>Save your M-Pesa transaction message</strong> - Required for refund processing</li>
                  <li>• <strong>Applicants who complete this process will be highly considered</strong></li>
                  <li>• Refunds are processed within 7-14 business days after hiring decisions</li>
                </ul>
              </div>

              <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                  className="flex-1 text-xs sm:text-sm py-2 sm:py-2.5"
                >
                  <ArrowLeft className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Back
                </Button>
                <Button
                  onClick={handleNext}
                  className="flex-1 bg-primary hover:bg-primary/90 text-white text-xs sm:text-sm py-2 sm:py-2.5"
                >
                  <span className="hidden sm:inline">Proceed to Payment</span>
                  <span className="sm:hidden">Pay Now</span>
                  <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Payment Processing */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Smartphone className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold">Complete Payment</h3>
                <p className="text-muted-foreground">
                  Enter your phone number to receive an STK push for payment
                </p>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">KSh 130</div>
                  <div className="text-sm text-muted-foreground">Processing Fee</div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="paymentPhone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    M-Pesa Phone Number *
                  </Label>
                  <Input
                    id="paymentPhone"
                    type="tel"
                    required
                    value={paymentData.phoneNumber}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    placeholder="+254 700 000 000"
                    className="text-center text-lg"
                  />
                </div>

                {!isProcessingPayment && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-700 text-center">
                    You will receive an STK push notification on your phone to complete the payment
                  </p>
                </div>
              )}

              {isProcessingPayment && (
                <div className="space-y-3">
                  <div className={`border rounded-lg p-4 ${
                    paymentData.paymentStatus === 'SUCCESS' ? 'bg-green-50 border-green-200' :
                    paymentData.paymentStatus === 'FAILED' ? 'bg-red-50 border-red-200' :
                    'bg-blue-50 border-blue-200'
                  }`}>
                    <div className="flex items-center gap-3">
                      {paymentData.paymentStatus === 'SUCCESS' && (
                        <>
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="font-medium text-green-800">Payment Successful!</p>
                            <p className="text-sm text-green-600">Your application has been completed.</p>
                          </div>
                        </>
                      )}
                      {paymentData.paymentStatus === 'FAILED' && (
                        <>
                          <AlertCircle className="h-5 w-5 text-red-600" />
                          <div>
                            <p className="font-medium text-red-800">Payment Failed</p>
                            <p className="text-sm text-red-600">Please try again or contact support.</p>
                          </div>
                        </>
                      )}
                      {paymentData.paymentStatus === 'PENDING' && (
                        <>
                          <Clock className="h-5 w-5 text-blue-600 animate-spin" />
                          <div>
                            <p className="font-medium text-blue-800">Processing Payment...</p>
                            <p className="text-sm text-blue-600">Please check your phone and enter your M-Pesa PIN.</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">Remember:</h4>
              <p className="text-sm text-green-700">
                Your refund code: <code className="bg-white px-2 py-1 rounded font-mono">{paymentData.refundCode}</code>
              </p>
            </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(2)}
                  className="flex-1"
                  disabled={isProcessingPayment}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button
                  onClick={handlePayment}
                  disabled={isProcessingPayment}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  {isProcessingPayment ? (
                    <>Processing...</>
                  ) : (
                    <>Finish Application <CreditCard className="ml-2 h-4 w-4" /></>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
    
    <PaymentSuccessModal 
      isOpen={showSuccessModal} 
      onClose={() => setShowSuccessModal(false)} 
    />
    
    <ApplicationProcessingModal
      isOpen={showProcessingModal}
      onComplete={handleProcessingComplete}
      applicantName={formData.fullName}
      jobTitle={job?.title || "Position"}
    />
  </>
  );
}