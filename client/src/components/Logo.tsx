import logoImage from "@assets/logo_313-1.png";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
}

export function Logo({ className = "", size = "md", showText = true }: LogoProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12", 
    lg: "h-16 w-16",
    xl: "h-24 w-24"
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-xl", 
    xl: "text-3xl"
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img 
        src={logoImage} 
        alt="313 Logo" 
        className={`${sizeClasses[size]} object-contain golden-glow`}
      />
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold text-primary arabic-heading ${textSizeClasses[size]}`}>
            313
          </span>
          <span className="text-xs text-muted-foreground arabic-text">
            الألعاب الثقافية
          </span>
        </div>
      )}
    </div>
  );
}