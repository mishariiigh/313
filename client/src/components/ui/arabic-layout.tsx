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
    <div className="min-h-screen bg-neutral-50 font-arabic">
      {children}
    </div>
  );
}
