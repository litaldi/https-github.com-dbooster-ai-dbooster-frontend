
export function AnimatedBackground() {
  return (
    <div 
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none -z-10"
    >
      <svg 
        viewBox="0 0 600 600" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className="w-full h-full opacity-20 animate-fade-in"
        style={{ position: "absolute", top: '-5%', left: '-10%' }}
      >
        <defs>
          <radialGradient id="bluePurple" cx="60%" cy="35%" r="0.65">
            <stop offset="0%" stopColor="#6872F8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#B075FC" stopOpacity="0"/>
          </radialGradient>
        </defs>
        <ellipse cx="350" cy="250" rx="240" ry="200" fill="url(#bluePurple)" />
      </svg>
    </div>
  );
}
