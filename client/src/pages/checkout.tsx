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
import { ArrowRight, CreditCard, Loader2 } from "lucide-react";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ gameCount }: { gameCount: number }) => {
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <div className="flex space-x-reverse space-x-3">
        <Button type="button" variant="outline" className="flex-1" onClick={() => setLocation("/dashboard")}>
          إلغاء
        </Button>
        <Button type="submit" className="flex-1 bg-secondary hover:bg-secondary/90" disabled={!stripe || isProcessing}>
          {isProcessing && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
          <CreditCard className="ml-2 h-4 w-4" />
          دفع ${gameCount === 1 ? "1.99" : "8.99"}
        </Button>
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

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowRight className="h-4 w-4" />
            </Button>
            <div className="mr-4">
              <h1 className="text-lg font-bold text-neutral-800">شراء ألعاب إضافية</h1>
              <p className="text-sm text-neutral-600">اختر الباقة المناسبة لك</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">شراء ألعاب إضافية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Package Selection */}
            <div>
              <Label className="text-sm font-medium text-neutral-700 mb-3 block">اختر الباقة</Label>
              <RadioGroup
                value={gameCount.toString()}
                onValueChange={(value) => setGameCount(parseInt(value))}
              >
                <div className="flex items-center space-x-reverse space-x-2 p-3 border border-neutral-200 rounded-lg">
                  <RadioGroupItem value="1" id="package-1" />
                  <Label htmlFor="package-1" className="flex-1 flex justify-between items-center cursor-pointer">
                    <div>
                      <span className="font-medium">لعبة واحدة</span>
                      <span className="text-sm text-neutral-500 block">36 سؤالاً</span>
                    </div>
                    <span className="font-bold text-primary">$1.99</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-reverse space-x-2 p-3 border-2 border-secondary rounded-lg bg-secondary/5">
                  <RadioGroupItem value="5" id="package-5" />
                  <Label htmlFor="package-5" className="flex-1 flex justify-between items-center cursor-pointer">
                    <div>
                      <span className="font-medium">5 ألعاب</span>
                      <span className="text-sm text-secondary font-medium block">وفر 10%</span>
                    </div>
                    <span className="font-bold text-secondary">$8.99</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Payment Form */}
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm gameCount={gameCount} />
            </Elements>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
