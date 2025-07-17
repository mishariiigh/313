import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/lib/auth';
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ArrowRight, CreditCard, Loader2, Tag, CheckCircle, XCircle } from "lucide-react";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : null;

const CheckoutForm = ({ gameCount, finalPrice }: { gameCount: number, finalPrice: number }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      toast({
        title: "فشل في الدفع",
        description: error.message,
        variant: "destructive",
      });
      setIsProcessing(false);
    } else {
      // Payment succeeded, refresh user data
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast({
        title: "تم الدفع بنجاح",
        description: "تم إضافة الألعاب إلى حسابك!",
      });
      setLocation("/dashboard");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="luxury-card p-6">
        <PaymentElement />
      </div>
      <div className="flex space-x-reverse space-x-4">
        <button 
          type="button" 
          className="luxury-button-secondary flex-1 py-4" 
          onClick={() => setLocation("/dashboard")}
        >
          إلغاء
        </button>
        <button 
          type="submit" 
          className="luxury-button flex-1 py-4" 
          disabled={!stripe || isProcessing}
        >
          {isProcessing ? (
            <div className="luxury-spinner mx-auto" />
          ) : (
            <>
              <CreditCard className="ml-2 h-5 w-5" />
              دفع ${finalPrice.toFixed(2)}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default function CheckoutPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [gameCount, setGameCount] = useState(5);
  const [clientSecret, setClientSecret] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [validCoupon, setValidCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState("");
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  // Redirect if not logged in
  if (!user) {
    setLocation("/auth");
    return null;
  }

  useEffect(() => {
    // Create PaymentIntent when game count changes
    if (gameCount) {
      apiRequest("POST", "/api/create-payment-intent", { gameCount })
        .then((res) => res.json())
        .then((data) => {
          setClientSecret(data.clientSecret);
        })
        .catch((error) => {
          toast({
            title: "خطأ في إنشاء الدفعة",
            description: error.message,
            variant: "destructive",
          });
        });
    }
  }, [gameCount, toast]);

  const handleBack = () => {
    setLocation("/dashboard");
  };

  const validateCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("يرجى إدخال رمز الكوبون");
      return;
    }

    setIsValidatingCoupon(true);
    setCouponError("");

    try {
      const response = await apiRequest("POST", "/api/validate-coupon", { code: couponCode });
      const data = await response.json();

      if (data.valid) {
        setValidCoupon(data.coupon);
        toast({
          title: "تم تطبيق الكوبون بنجاح",
          description: `خصم ${data.coupon.discountType === 'percentage' ? data.coupon.discountValue + '%' : '$' + data.coupon.discountValue}`,
        });
      } else {
        setCouponError(data.message || "كوبون غير صحيح");
      }
    } catch (error: any) {
      setCouponError(error.message || "خطأ في التحقق من الكوبون");
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setValidCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  const calculateDiscountedPrice = (originalPrice: number) => {
    if (!validCoupon) return originalPrice;

    if (validCoupon.discountType === 'percentage') {
      return originalPrice * (1 - validCoupon.discountValue / 100);
    } else {
      return Math.max(0, originalPrice - validCoupon.discountValue);
    }
  };

  const getOriginalPrice = (count: number) => {
    return count === 1 ? 1.99 : 8.99;
  };

  const originalPrice = getOriginalPrice(gameCount);
  const finalPrice = calculateDiscountedPrice(originalPrice);

  if (!clientSecret) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="luxury-card p-8 text-center">
          <div className="luxury-spinner mx-auto mb-4" />
          <p className="text-luxury-green-dark text-lg">جاري إعداد عملية الدفع...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="luxury-card mx-4 mt-4 p-6 mb-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center">
            <button className="luxury-button-secondary p-2 ml-4" onClick={handleBack}>
              <ArrowRight className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-luxury-green-dark">شراء ألعاب إضافية</h1>
              <p className="text-muted-foreground">اختر الباقة المناسبة لك</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-8">
        <div className="luxury-card p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-luxury-gold rounded-full flex items-center justify-center mx-auto mb-4 floating">
              <CreditCard className="text-white h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-gradient">شراء ألعاب إضافية</h2>
          </div>

          <div className="space-y-8">
            {/* Package Selection */}
            <div>
              <Label className="text-lg font-semibold text-luxury-green-dark mb-4 block">اختر الباقة</Label>
              <RadioGroup
                value={gameCount.toString()}
                onValueChange={(value) => setGameCount(parseInt(value))}
              >
                <div className="luxury-card p-4 border-2 border-luxury-green-light">
                  <div className="flex items-center space-x-reverse space-x-3">
                    <RadioGroupItem value="1" id="package-1" />
                    <Label htmlFor="package-1" className="flex-1 flex justify-between items-center cursor-pointer">
                      <div>
                        <span className="font-semibold text-luxury-green-dark">لعبة واحدة</span>
                        <span className="text-sm text-muted-foreground block">36 سؤالاً</span>
                      </div>
                      <div className="text-left">
                        {validCoupon && originalPrice !== finalPrice && (
                          <span className="text-sm text-muted-foreground line-through block">$1.99</span>
                        )}
                        <span className="font-bold text-luxury-green text-xl">
                          ${gameCount === 1 ? finalPrice.toFixed(2) : '1.99'}
                        </span>
                      </div>
                    </Label>
                  </div>
                </div>
                <div className="luxury-card p-4 border-2 border-luxury-green bg-luxury-green-light">
                  <div className="flex items-center space-x-reverse space-x-3">
                    <RadioGroupItem value="5" id="package-5" />
                    <Label htmlFor="package-5" className="flex-1 flex justify-between items-center cursor-pointer">
                      <div>
                        <span className="font-semibold text-luxury-green-dark">5 ألعاب</span>
                        <span className="text-sm text-luxury-green-dark font-medium block">وفر 10%</span>
                      </div>
                      <div className="text-left">
                        {validCoupon && originalPrice !== finalPrice && (
                          <span className="text-sm text-muted-foreground line-through block">$8.99</span>
                        )}
                        <span className="font-bold text-luxury-green-dark text-xl">
                          ${gameCount === 5 ? finalPrice.toFixed(2) : '8.99'}
                        </span>
                      </div>
                    </Label>
                  </div>
                </div>
              </RadioGroup>

              {/* Coupon Section */}
              <div className="luxury-card p-4 border border-luxury-green-light">
                <Label className="text-base font-semibold text-luxury-green-dark mb-3 block flex items-center">
                  <Tag className="ml-2 h-4 w-4" />
                  كوبون خصم
                </Label>
                
                {!validCoupon ? (
                  <div className="flex space-x-reverse space-x-2">
                    <Input
                      type="text"
                      placeholder="أدخل رمز الكوبون"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      onClick={validateCoupon}
                      disabled={isValidatingCoupon}
                      className="luxury-button-secondary px-4"
                    >
                      {isValidatingCoupon ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "تطبيق"
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-reverse space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <span className="font-semibold text-green-800">{validCoupon.code}</span>
                        <p className="text-sm text-green-600">
                          خصم {validCoupon.discountType === 'percentage' ? validCoupon.discountValue + '%' : '$' + validCoupon.discountValue}
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      onClick={removeCoupon}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                
                {couponError && (
                  <p className="text-red-500 text-sm mt-2">{couponError}</p>
                )}
              </div>
            </div>

            {/* Payment Form */}
            {stripePromise ? (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm gameCount={gameCount} finalPrice={finalPrice} />
              </Elements>
            ) : (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CreditCard className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div className="mr-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      معالجة الدفعات غير متاحة حالياً
                    </h3>
                    <p className="text-sm text-yellow-700 mt-1">
                      يرجى المحاولة لاحقاً أو التواصل مع فريق الدعم
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
