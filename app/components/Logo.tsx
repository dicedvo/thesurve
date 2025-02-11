type LogoProps = {
  className?: string
}

export function Logo({ className = '' }: LogoProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src="/thesurve-logo.png" 
        alt="TheSurve Logo" 
        className="h-6 w-auto"
      />
      <span className="ml-2 text-[10px] bg-blue-700 px-1.5 py-0.5 rounded-md font-medium tracking-wide uppercase">Beta</span>
    </div>
  )
}
