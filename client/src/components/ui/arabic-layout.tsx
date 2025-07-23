import { useEffect } from "react";

interface ArabicLayoutProps {
  children: React.ReactNode;
}

export default function ArabicLayout({ children }: ArabicLayoutProps) {
  useEffect(() => {
    document.documentElement.lang = "ar";
    document.documentElement.dir = "rtl";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-logo-warm-white via-background to-logo-cream font-arabic">
      <div className="fixed inset-0 bg-gradient-to-br from-logo-sage/3 via-transparent to-logo-gold/3 pointer-events-none" />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
