import React, { useState } from 'react';
import { Download, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { InstallModal } from './InstallModal';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'navbar' | 'compact' | 'elderly' | 'card';
  label?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ 
  className = '', 
  variant = 'navbar',
  label 
}) => {
  const { isInstallable, isInstalled, isStandalone, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);
  const [installing, setInstalling] = useState(false);

  // If already running standalone, show subtle badge or return null
  if (isStandalone) {
    if (variant === 'card') {
      return (
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>App Installed Locally</span>
        </div>
      );
    }
    return null;
  }

  const handleClick = async () => {
    if (isInstallable) {
      setInstalling(true);
      await install();
      setInstalling(false);
    } else {
      setShowModal(true);
    }
  };

  if (variant === 'elderly') {
    return (
      <>
        <button
          onClick={handleClick}
          className={`h-10 px-3.5 bg-teal-700 hover:bg-teal-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition ${className}`}
          title="Install app to your home screen"
        >
          <Download className="w-4 h-4 text-teal-200" />
          <span>{label || 'Install App'}</span>
        </button>
        <InstallModal isOpen={showModal} onClose={() => setShowModal(false)} />
      </>
    );
  }

  if (variant === 'card') {
    return (
      <>
        <button
          onClick={handleClick}
          className={`px-4 py-2.5 bg-teal-700 hover:bg-teal-600 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-2 transition ${className}`}
        >
          <Download className="w-4 h-4" />
          <span>{label || (isInstallable ? 'Install App on this Device' : 'Download / Install Guide')}</span>
        </button>
        <InstallModal isOpen={showModal} onClose={() => setShowModal(false)} />
      </>
    );
  }

  // Default navbar variant
  return (
    <>
      <button
        onClick={handleClick}
        className={`px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-300 rounded-xl text-xs font-bold shadow-2xs flex items-center gap-1.5 transition ${className}`}
        title="Download and install app locally"
      >
        <Download className="w-3.5 h-3.5 text-teal-600 animate-pulse" />
        <span className="hidden sm:inline">{label || 'Install App'}</span>
      </button>
      <InstallModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};
