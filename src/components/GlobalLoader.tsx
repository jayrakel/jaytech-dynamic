"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";

export default function GlobalLoader({ logo }: { logo: string }) {
  const [loading, setLoading] = useState(false);
  const [isInitialMount, setIsInitialMount] = useState(true);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Handle Initial App Load
  useEffect(() => {
    // Small delay to let the page settle, then hide the initial loader
    const timer = setTimeout(() => {
      setIsInitialMount(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Handle Navigation Transitions
  useEffect(() => {
    if (isInitialMount) return; // Don't trigger for the very first load

    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [pathname, searchParams, isInitialMount]);

  // If we aren't mounting for the first time AND we aren't navigating, show nothing
  if (!isInitialMount && !loading) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950 flex flex-col items-center justify-center transition-opacity duration-500">
      <div className="relative">
        <div className="w-24 h-24 rounded-full border-2 border-teal-400/20 border-t-teal-400 animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 bg-slate-900 rounded-2xl p-3 border border-slate-800 shadow-2xl flex items-center justify-center">
            <Image 
              src={logo} 
              alt="Logo" 
              width={40} 
              height={40} 
              priority // ✅ Critical: Loads the logo immediately
              className="object-contain animate-pulse"
            />
          </div>
        </div>
      </div>
      
      <p className="mt-8 font-heading font-bold text-slate-500 text-[10px] tracking-[0.3em] uppercase animate-pulse">
        {isInitialMount ? "Launching" : "Loading"}<span className="text-teal-400">...</span>
      </p>
    </div>
  );
}