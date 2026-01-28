
import React, { useEffect, useState } from 'react';
import { Bird } from 'lucide-react';

const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500); // Wait for fade out animation
    }, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-sky-500 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="relative">
        <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full scale-150 animate-pulse"></div>
        <div className="relative bg-white p-8 rounded-[40px] shadow-2xl shadow-blue-900/40 transform hover:scale-105 transition-transform duration-700">
          <Bird className="w-24 h-24 text-blue-600 animate-bounce" />
        </div>
      </div>
      <div className="mt-12 text-center">
        <h1 className="text-4xl font-black text-white tracking-tighter mb-2">AvianCare</h1>
        <div className="flex gap-1 justify-center">
          <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
