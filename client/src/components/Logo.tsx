import logoPath from "@assets/logo 313-2_1753650586356.png";

interface LogoProps {
  size?: "small" | "medium" | "large";
  className?: string;
}

export function Logo({ size = "medium", className = "" }: LogoProps) {
  const sizeClasses = {
    small: "h-12 w-12",
    medium: "h-20 w-20",
    large: "h-32 w-32"
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img 
        src={logoPath} 
        alt="313 Logo" 
        className={`${sizeClasses[size]} object-contain`}
        data-testid="logo-image"
      />
    </div>
  );
}