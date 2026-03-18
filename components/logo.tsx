interface LogoProps {
  variant?: "mono" | "green"
  showText?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
}

const sizes = {
  sm: { icon: 24, text: "text-lg" },
  md: { icon: 32, text: "text-xl" },
  lg: { icon: 48, text: "text-3xl" },
}

export function Logo({ 
  variant = "green", 
  showText = false, 
  size = "md",
  className = "" 
}: LogoProps) {
  const { icon: iconSize, text: textSize } = sizes[size]
  
  // Colors based on variant
  const colors = variant === "mono" 
    ? { primary: "#1a1a1a", secondary: "#404040", tertiary: "#666666" }
    : { primary: "#3d7a5a", secondary: "#4a9068", tertiary: "#5ba678" }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Logo Mark - Stylized B from overlapping rounded shapes */}
      <svg 
        width={iconSize} 
        height={iconSize} 
        viewBox="0 0 48 48" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        aria-label="BeThere logo"
      >
        {/* Back layer - larger rounded rectangle */}
        <rect 
          x="8" 
          y="6" 
          width="24" 
          height="36" 
          rx="12" 
          fill={colors.tertiary}
          opacity="0.6"
        />
        
        {/* Middle layer - top bump of B */}
        <circle 
          cx="26" 
          cy="17" 
          r="11" 
          fill={colors.secondary}
          opacity="0.8"
        />
        
        {/* Front layer - bottom bump of B */}
        <circle 
          cx="26" 
          cy="31" 
          r="13" 
          fill={colors.primary}
        />
        
        {/* Vertical stem accent */}
        <rect 
          x="10" 
          y="8" 
          width="8" 
          height="32" 
          rx="4" 
          fill={colors.primary}
        />
      </svg>
      
      {showText && (
        <span className={`font-sans font-semibold tracking-tight ${textSize} ${
          variant === "mono" ? "text-foreground" : "text-primary"
        }`}>
          BeThere
        </span>
      )}
    </div>
  )
}

// Standalone icon for favicon/small contexts
export function LogoIcon({ 
  variant = "green", 
  size = 32,
  className = "" 
}: { 
  variant?: "mono" | "green"
  size?: number
  className?: string 
}) {
  const colors = variant === "mono" 
    ? { primary: "#1a1a1a", secondary: "#404040", tertiary: "#666666" }
    : { primary: "#3d7a5a", secondary: "#4a9068", tertiary: "#5ba678" }

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 48 48" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="BeThere logo"
    >
      <rect 
        x="8" 
        y="6" 
        width="24" 
        height="36" 
        rx="12" 
        fill={colors.tertiary}
        opacity="0.6"
      />
      <circle 
        cx="26" 
        cy="17" 
        r="11" 
        fill={colors.secondary}
        opacity="0.8"
      />
      <circle 
        cx="26" 
        cy="31" 
        r="13" 
        fill={colors.primary}
      />
      <rect 
        x="10" 
        y="8" 
        width="8" 
        height="32" 
        rx="4" 
        fill={colors.primary}
      />
    </svg>
  )
}
