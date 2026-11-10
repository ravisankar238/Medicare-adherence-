import React, { useState } from 'react';
import { 
  Download, Smartphone, Monitor, Apple, CheckCircle2, 
  X, Sparkles, WifiOff, BellRing, ShieldCheck, ArrowRight, Share2, PlusSquare 
} from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallModal: React.FC<InstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'auto' | 'android' | 'ios' | 'desktop'>('auto');
  const [installing, setInstalling] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    setInstalling(true);
    const success = await install();
    setInstalling(false);
    if (success) {
      setInstallSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-teal-800 to-teal-600 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white text-teal-800 flex items-center justify-center shadow-lg font-bold">
              <Download className="w-6 h-6 text-teal-700" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest uppercase bg-teal-900/60 text-teal-200 px-2 py-0.5 rounded">
                Local App Installation
              </span>
              <h3 className="text-xl font-black mt-1">Download & Install Sehat Saathi</h3>
              <p className="text-teal-100 text-xs mt-0.5">
                Fast offline access, fullscreen mode & instant pill reminder chimes.
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-800 text-sm">

          {/* Installation Status / Quick Action */}
          {isInstalled || installSuccess ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <div className="font-bold text-emerald-900 text-sm">App Already Installed!</div>
                <div className="text-emerald-700 text-xs">
                  Sehat Saathi is installed on this device and can be opened directly from your home screen or apps folder.
                </div>
              </div>
            </div>
          ) : isInstallable ? (
            <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-teal-950 text-sm">One-Click Install Available</div>
                  <div className="text-teal-700 text-xs">Your browser supports instant direct installation.</div>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              <button
                onClick={handleInstallClick}
                disabled={installing}
                className="w-full py-3 px-4 bg-teal-700 hover:bg-teal-600 text-white font-extrabold rounded-xl shadow-md shadow-teal-700/20 flex items-center justify-center gap-2 transition"
              >
                <Download className="w-4 h-4" />
                <span>{installing ? 'Installing...' : 'Install Sehat Saathi Now'}</span>
              </button>
            </div>
          ) : null}

          {/* Key Benefits of Installing Locally */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-2.5">
              <WifiOff className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-slate-900">100% Offline Mode</div>
                <div className="text-slate-500 text-[11px]">Schedules & pill logs work without internet.</div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-2.5">
              <BellRing className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-slate-900">Full Sound Alarms</div>
                <div className="text-slate-500 text-[11px]">Direct audio alarms even when in background.</div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-2.5">
              <Smartphone className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-slate-900">Clean Fullscreen</div>
                <div className="text-slate-500 text-[11px]">No cluttered browser address bar for elders.</div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-slate-900">Zero Storage Cost</div>
                <div className="text-slate-500 text-[11px]">Ultra lightweight (&lt; 2 MB) local cache.</div>
              </div>
            </div>
          </div>

          {/* Platform Guided Steps */}
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Device Installation Instructions
            </div>

            <div className="flex border-b border-slate-200 text-xs font-bold gap-2">
              <button
                onClick={() => setActiveTab('android')}
                className={`pb-2 px-2 transition border-b-2 flex items-center gap-1.5 ${
                  activeTab === 'android' || (activeTab === 'auto' && isAndroid)
                    ? 'border-teal-700 text-teal-900' 
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Android</span>
              </button>

              <button
                onClick={() => setActiveTab('ios')}
                className={`pb-2 px-2 transition border-b-2 flex items-center gap-1.5 ${
                  activeTab === 'ios' || (activeTab === 'auto' && isIOS)
                    ? 'border-teal-700 text-teal-900' 
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Apple className="w-3.5 h-3.5" />
                <span>iPhone / iPad</span>
              </button>

              <button
                onClick={() => setActiveTab('desktop')}
                className={`pb-2 px-2 transition border-b-2 flex items-center gap-1.5 ${
                  activeTab === 'desktop' || (activeTab === 'auto' && !isIOS && !isAndroid)
                    ? 'border-teal-700 text-teal-900' 
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>PC & Mac</span>
              </button>
            </div>

            <div className="mt-3 text-xs space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              {(activeTab === 'android' || (activeTab === 'auto' && isAndroid)) && (
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">1</span>
                    <span>Click the <strong>Download & Install</strong> button in the top banner or browser prompt.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">2</span>
                    <span>Or tap Chrome&apos;s <strong>three dots menu (⋮)</strong> in the top right.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">3</span>
                    <span>Select <strong>&quot;Install app&quot;</strong> or <strong>&quot;Add to Home screen&quot;</strong>.</span>
                  </div>
                </div>
              )}

              {(activeTab === 'ios' || (activeTab === 'auto' && isIOS)) && (
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">1</span>
                    <span>In Safari, tap the <strong>Share button</strong> <Share2 className="w-3.5 h-3.5 inline text-sky-600" /> at the bottom of the screen.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">2</span>
                    <span>Scroll down and tap <strong>&quot;Add to Home Screen&quot;</strong> <PlusSquare className="w-3.5 h-3.5 inline text-slate-700" />.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">3</span>
                    <span>Tap <strong>&quot;Add&quot;</strong> in the top right. Sehat Saathi will now appear on your home screen!</span>
                  </div>
                </div>
              )}

              {(activeTab === 'desktop' || (activeTab === 'auto' && !isIOS && !isAndroid)) && (
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">1</span>
                    <span>Click the <strong>Download & Install</strong> button in the banner, or the install icon in your browser URL address bar (computer monitor with down arrow).</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">2</span>
                    <span>In Chrome or Edge menu (⋮), choose <strong>&quot;Install Sehat Saathi&quot;</strong>.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">3</span>
                    <span>The app opens in its own clean window, dockable to your Windows Taskbar or Mac Dock!</span>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Works offline with progressive caching
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 font-bold text-xs text-slate-800 transition"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
