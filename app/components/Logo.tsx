import { useEffect, useState } from 'react';

type LogoProps = {
  className?: string
}

export function Logo({ className = '' }: LogoProps) {
  const [isUwu, setIsUwu] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const uwuParam = params.get('uwu');

    // persist the uwu state (〃￣ω￣〃)ゞ
    if (uwuParam !== null) {
      const isUwu = uwuParam === 'true';
      setIsUwu(isUwu);
      localStorage.setItem('isUwu', JSON.stringify(isUwu));
    } else {
      const storedUwu = localStorage.getItem('isUwu');
      if (storedUwu !== null) {
        setIsUwu(JSON.parse(storedUwu));
      }
    }
  }, []);

  return (
    <div className={`flex items-center ${className}`}>
      <img
        src={isUwu ? "/thesurve-logo-uwu.png" : "/thesurve-logo.png"}
        alt="TheSurve Logo"
        className="h-6 w-auto"
      />
      <span className="ml-2 text-[10px] bg-blue-700 px-1.5 py-0.5 rounded-md font-medium tracking-wide uppercase">Beta</span>
    </div>
  )
}