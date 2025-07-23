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
    <div className="min-h-screen bg-gradient-to-br from-arabic-cream via-background to-arabic-cream font-arabic">
      <div className="fixed inset-0 bg-gradient-to-br from-arabic-sage/5 via-transparent to-arabic-gold/5 pointer-events-none" />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
