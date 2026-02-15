import QRCodeSettings from '@/components/Settings/QRCodeSettings';
import { getSettings } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function SettingsPage() {
  const rawSettings = await getSettings();
  const settings = JSON.parse(JSON.stringify(rawSettings));

  return (
    <div className="min-h-screen bg-dark-mesh">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-24">
        {/* Page Header */}
        <div className="mb-10 sm:mb-14 text-center">
          <div className="inline-flex items-center justify-center p-3 mb-6 bg-dark-200/60 backdrop-blur-sm rounded-2xl shadow-dark border border-dark-50/30 animate-reveal-up">
            <div className="bg-accent/10 p-2 rounded-xl">
              <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-4 animate-reveal-up stagger-1">
            <span className="text-gold-gradient">Settings</span>
          </h1>
          <p className="text-lg text-ivory-muted max-w-2xl mx-auto animate-reveal-up stagger-2">
            Configure your billing preferences and payment options
          </p>
        </div>

        <div className="max-w-2xl mx-auto animate-reveal-up stagger-3">
          <QRCodeSettings initialSettings={settings} />
        </div>
      </div>
    </div>
  );
}
