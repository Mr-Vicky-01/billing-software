import MenuGrid from '@/components/Menu/MenuGrid';
import FloatingCartButton from '@/components/common/FloatingCartButton';
import { getMenuItems } from '@/lib/db';

export default async function Home() {
  // Server-side data fetching
  const items = await getMenuItems();

  return (
    <>
      <div className="min-h-screen bg-mesh">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-24 sm:pb-32">
          {/* Modern Hero Section */}
          <div className="relative mb-12 sm:mb-16 text-center">
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary-400/20 to-secondary-400/20 blur-3xl rounded-full transform -translate-y-1/2"></div>

            <div className="inline-flex items-center justify-center p-2 mb-6 bg-white/50 backdrop-blur-sm rounded-full border border-white/50 shadow-sm animate-fade-in">
              <span className="px-3 py-1 text-xs font-semibold tracking-wide text-primary-700 uppercase bg-primary-50 rounded-full">New Collection</span>
              <span className="ml-2 text-sm text-slate-600">Check out our latest arrivals</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-primary-800 to-slate-900 animate-gradient">
              Premium Sports Gear
            </h1>

            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-600 mb-8 leading-relaxed">
              Elevate your game with our curated collection of high-performance equipment.
              Designed for champions, built for durability.
            </p>

            {/* Stats/Features */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto mb-8">
              {[
                { label: 'Products', value: items.length, icon: '🛍️' },
                { label: 'Quality', value: 'Premium', icon: '⭐' },
                { label: 'Delivery', value: 'Fast', icon: '🚚' },
                { label: 'Support', value: '24/7', icon: '💬' },
              ].map((stat, index) => (
                <div key={index} className="glass p-4 rounded-2xl text-center hover-lift">
                  <div className="text-2xl mb-1">{stat.icon}</div>
                  <div className="font-bold text-slate-800">{stat.value}</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Content Section */}
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <span className="w-2 h-8 bg-p.rimary-500 rounded-full"></span>
                Featured Products
              </h2>
              <div className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent ml-6"></div>
            </div>

            <MenuGrid items={items} />
          </div>
        </div>
      </div>
      <FloatingCartButton />
    </>
  );
}
