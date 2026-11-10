import React, { useState, useEffect } from 'react';
import { 
  Download, Smartphone, X, Sparkles, CheckCircle2, 
  HelpCircle, Wifi, WifiOff, ArrowRight 
} from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { InstallModal } from './InstallModal';

interface AppInstallBannerProps {
  onDismiss?: () => void;
}

export const AppInstallBanner: React.FC<AppInstallBannerProps> = ({ onDismiss }) => {
  const { isInstallable, isInstalled, isStandalone, isIOS, isOnline, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [justInstalled, setJustInstalled] = useState(false);

  // Check session dismissal state
  useEffect(() => {
    try {
      const dismissed = sessionStorage.getItem('sehat_saathi_pwa_banner_dismissed');
      if (dismissed === 'true') {
        setIsDismissed(true);
      }
    } catch {
      // Ignore storage restrictions
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      sessionStorage.setItem('sehat_saathi_pwa_banner_dismissed', 'true');
    } catch {
      // Ignore
    }
    if (onDismiss) onDismiss();
  };

  // If running in standalone mode (already installed & running locally as an app), hide banner
  if (isStandalone || isDismissed) {
    return (
      <>
        {/* Even if banner is dismissed, modal is available if needed */}
        <InstallModal isOpen={showModal} onClose={() => setShowModal(false)} />
      </>
    );
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      setInstalling(true);
      const ok = await install();
      setInstalling(false);
      if (ok) {
        setJustInstalled(true);
        setTimeout(() => setIsDismissed(true), 3000);
      }
    } else {
      // Open guided modal for iOS, desktop or manual install
      setShowModal(true);
    }
  };

  return (
    <>
      <aside 
        aria-label="App Installation Banner"
        className="bg-gradient-to-r from-teal-900 via-teal-800 to-emerald-900 text-white relative border-b border-teal-700/60 shadow-md z-30 transition-all"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            
            {/* Left Info Section */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              {/* App Icon Badge */}
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
                <Download className="w-5 h-5 text-teal-300 animate-bounce" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-extrabold text-sm text-white tracking-tight">
                    Install Sehat Saathi App
                  </span>
                  <span className="text-[10px] bg-teal-500/30 text-teal-200 border border-teal-400/30 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    Local &amp; Offline Ready
                  </span>
                  {!isOnline && (
                    <span className="text-[10px] bg-amber-500/30 text-amber-200 border border-amber-400/30 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                      <WifiOff className="w-3 h-3" />
                      Offline Mode Active
                    </span>
                  )}
                </div>
                <p className="text-xs text-teal-100/90 leading-tight mt-0.5 truncate sm:overflow-visible sm:whitespace-normal">
                  Download to your phone, tablet, or desktop for 1-click home screen access, loud pill alarms &amp; 100% offline reliability.
                </p>
              </div>
            </div>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-end shrink-0">
              {justInstalled ? (
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-500/40">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Installed Successfully!</span>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setShowModal(true)}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-teal-100 hover:text-white text-xs font-bold transition flex items-center gap-1.5 border border-white/15"
                    title="View device-specific installation guide"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-teal-300" />
                    <span className="hidden sm:inline">How to install</span>
                    <span className="sm:hidden">Guide</span>
                  </button>

                  <button
                    onClick={handleInstallClick}
                    disabled={installing}
                    className="px-4 py-1.5 rounded-xl bg-white text-teal-900 hover:bg-teal-50 text-xs font-extrabold shadow-md hover:shadow-lg transition flex items-center gap-1.5 group cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-teal-700 group-hover:translate-y-0.5 transition-transform" />
                    <span>{installing ? 'Installing...' : 'Download & Install'}</span>
                  </button>
                </>
              )}

              {/* Dismiss Button */}
              <button
                onClick={handleDismiss}
                className="p-1.5 rounded-lg text-teal-300 hover:text-white hover:bg-white/10 transition ml-1"
                title="Dismiss banner"
                aria-label="Dismiss banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </aside>

      <InstallModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};
