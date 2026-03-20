"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";

// ✅ Added the { logo } prop to match your layout.tsx
export default function GlobalLoader({ logo }: { logo: string }) {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // 1. When the path changes, turn the loader ON
    setLoading(true);

    // 2. Set a small delay (500ms is usually perfect for a smooth feel)
    // and then turn the loader OFF
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600); 

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  // If not loading, we render nothing
  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950 flex flex-col items-center justify-center">
      <div className="relative">
        {/* Outer Rotating Ring */}
        <div className="w-24 h-24 rounded-full border-2 border-teal-400/20 border-t-teal-400 animate-spin"></div>
        
        {/* Favicon in the center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 bg-slate-900 rounded-2xl p-3 border border-slate-800 shadow-2xl flex items-center justify-center">
            <Image 
              src={logo} // ✅ Uses the dynamic logo passed from layout
              alt="Jay TechWave" 
              width={40} 
              height={40} 
              className="object-contain animate-pulse"
            />
          </div>
        </div>
      </div>
      
      <p className="mt-8 font-heading font-bold text-slate-500 text-[10px] tracking-[0.3em] uppercase animate-pulse">
        Initializing<span className="text-teal-400">...</span>
      </p>
    </div>
  );
}