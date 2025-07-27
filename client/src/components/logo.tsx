import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showText?: boolean;
}

export function Logo({ size = "md", className, showText = true }: LogoProps) {
  const imageSizes = {
    sm: "h-12 w-12",
    md: "h-16 w-16",
    lg: "h-24 w-24",
    xl: "h-32 w-32"
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <img 
        src="/logo-313.png" 
        alt="313 Logo" 
        className={cn(imageSizes[size], "object-contain")}
      />
      {showText && (
        <div className="flex flex-col">
          <h1 className={cn(
            "font-bold text-yellow-600 font-arabic",
            size === "sm" ? "text-lg" : size === "md" ? "text-2xl" : "text-3xl"
          )}>
            ٣١٣
          </h1>
          <p className={cn(
            "text-yellow-700 font-arabic",
            size === "sm" ? "text-xs" : size === "md" ? "text-sm" : "text-base"
          )}>
            لعبة الثقافة العربية
          </p>
        </div>
      )}
    </div>
  );
}