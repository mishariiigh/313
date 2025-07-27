import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showText?: boolean;
}

export function Logo({ size = "md", className, showText = true }: LogoProps) {
  const sizeClasses = {
    sm: "text-2xl",
    md: "text-4xl",
    lg: "text-6xl",
    xl: "text-8xl"
  };

  const containerSizes = {
    sm: "h-10 w-10",
    md: "h-14 w-14",
    lg: "h-20 w-20",
    xl: "h-28 w-28"
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className={cn(
        "flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold shadow-lg",
        containerSizes[size]
      )}>
        <span className={cn(sizeClasses[size], "font-arabic")}>٣١٣</span>
      </div>
      {showText && (
        <div className="flex flex-col">
          <h1 className={cn(
            "font-bold text-blue-600 font-arabic",
            size === "sm" ? "text-lg" : size === "md" ? "text-2xl" : "text-3xl"
          )}>
            ٣١٣
          </h1>
          <p className={cn(
            "text-gray-600 font-arabic",
            size === "sm" ? "text-xs" : size === "md" ? "text-sm" : "text-base"
          )}>
            لعبة الثقافة العربية
          </p>
        </div>
      )}
    </div>
  );
}