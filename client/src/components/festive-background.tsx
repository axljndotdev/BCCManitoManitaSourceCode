export function FestiveBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Main gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/30" />
      
      {/* Layered festive decorations */}
      <div className="absolute inset-0">
        {/* Top left star cluster */}
        <div className="absolute top-8 left-8 opacity-8">
          <svg width="80" height="80" viewBox="0 0 60 60" fill="none">
            <path d="M30 0L32.7 27.3L60 30L32.7 32.7L30 60L27.3 32.7L0 30L27.3 27.3L30 0Z" fill="currentColor" className="text-primary" />
          </svg>
        </div>
        
        {/* Top right snowflake */}
        <div className="absolute top-12 right-12 opacity-6">
          <svg width="60" height="60" viewBox="0 0 100 100" fill="none">
            <path d="M50 10L50 90M50 50L85 25M50 50L15 25M50 50L85 75M50 50L15 75" stroke="currentColor" strokeWidth="3" className="text-accent-foreground" />
            <circle cx="50" cy="10" r="4" fill="currentColor" className="text-accent-foreground" />
            <circle cx="50" cy="90" r="4" fill="currentColor" className="text-accent-foreground" />
            <circle cx="85" cy="25" r="4" fill="currentColor" className="text-accent-foreground" />
            <circle cx="15" cy="25" r="4" fill="currentColor" className="text-accent-foreground" />
            <circle cx="85" cy="75" r="4" fill="currentColor" className="text-accent-foreground" />
            <circle cx="15" cy="75" r="4" fill="currentColor" className="text-accent-foreground" />
          </svg>
        </div>
        
        {/* Middle left accent star */}
        <div className="absolute top-1/3 left-4 opacity-6">
          <svg width="40" height="40" viewBox="0 0 60 60" fill="none">
            <path d="M30 0L32.7 27.3L60 30L32.7 32.7L30 60L27.3 32.7L0 30L27.3 27.3L30 0Z" fill="currentColor" className="text-accent-foreground" />
          </svg>
        </div>
        
        {/* Middle right small star */}
        <div className="absolute top-1/2 right-8 opacity-8">
          <svg width="50" height="50" viewBox="0 0 60 60" fill="none">
            <path d="M30 0L32.7 27.3L60 30L32.7 32.7L30 60L27.3 32.7L0 30L27.3 27.3L30 0Z" fill="currentColor" className="text-primary" />
          </svg>
        </div>
        
        {/* Bottom left small decoration */}
        <div className="absolute bottom-20 left-12 opacity-6">
          <svg width="35" height="35" viewBox="0 0 60 60" fill="none">
            <path d="M30 0L32.7 27.3L60 30L32.7 32.7L30 60L27.3 32.7L0 30L27.3 27.3L30 0Z" fill="currentColor" className="text-accent-foreground" />
          </svg>
        </div>
        
        {/* Bottom right star */}
        <div className="absolute bottom-16 right-16 opacity-8">
          <svg width="45" height="45" viewBox="0 0 60 60" fill="none">
            <path d="M30 0L32.7 27.3L60 30L32.7 32.7L30 60L27.3 32.7L0 30L27.3 27.3L30 0Z" fill="currentColor" className="text-primary" />
          </svg>
        </div>
        
        {/* Additional scattered small accents */}
        <div className="absolute top-1/4 right-1/3 opacity-4">
          <svg width="25" height="25" viewBox="0 0 60 60" fill="none">
            <path d="M30 0L32.7 27.3L60 30L32.7 32.7L30 60L27.3 32.7L0 30L27.3 27.3L30 0Z" fill="currentColor" className="text-accent-foreground" />
          </svg>
        </div>
        
        <div className="absolute bottom-1/3 left-1/4 opacity-5">
          <svg width="30" height="30" viewBox="0 0 60 60" fill="none">
            <path d="M30 0L32.7 27.3L60 30L32.7 32.7L30 60L27.3 32.7L0 30L27.3 27.3L30 0Z" fill="currentColor" className="text-primary" />
          </svg>
        </div>
      </div>
      
      {/* Subtle overlay pattern */}
      <div className="absolute inset-0 opacity-[0.015] bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[length:24px_24px]" />
    </div>
  );
}
