import logoPath from "@assets/logo 313-2_1753650586356.png";

interface LogoProps {
  size?: "small" | "medium" | "large";
  className?: string;
}

export function Logo({ size = "medium", className = "" }: LogoProps) {
  const sizeClasses = {
    small: "h-16 w-16",
    medium: "h-24 w-24",
    large: "h-40 w-40",
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
