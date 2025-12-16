import QRCodeSettings from '@/components/Settings/QRCodeSettings';
import { getSettings } from '@/lib/db';

export default async function SettingsPage() {
  // Server-side data fetching
  const settings = await getSettings();

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-10 pb-10">
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent to-blue-300"></div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center">
              <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                Settings
              </span>
            </h1>
            <div className="h-px w-12 sm:w-16 bg-gradient-to-l from-transparent to-blue-300"></div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8">
          <QRCodeSettings initialQRCode={settings.qrCode} />
        </div>
      </div>
    </div>
  );
}
